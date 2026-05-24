'use client'

import { useState, useEffect } from 'react'

interface ParagraphEditorProps {
  /** Target word/character count. */
  targetCount: number
  /** Whether this is Chinese (chars) or English (words). */
  language?: 'chinese' | 'english'
  /** Level label, e.g. "L3 论证段写作". */
  levelLabel?: string
  /** Optional guidance tip to show at top. */
  tip?: string
  /** Called when user submits. */
  onSubmit: (content: string) => void
  /** Called to go back. */
  onBack?: () => void
}

export default function ParagraphEditor({
  targetCount,
  language = 'chinese',
  levelLabel = '片段写作',
  tip,
  onSubmit,
  onBack,
}: ParagraphEditorProps) {
  const [content, setContent] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(`bifeng-draft-${levelLabel}`)
    if (saved) setContent(saved)
  }, [levelLabel])

  useEffect(() => {
    if (content) {
      localStorage.setItem(`bifeng-draft-${levelLabel}`, content)
    }
  }, [content, levelLabel])

  const count = language === 'chinese'
    ? content.replace(/\s/g, '').length
    : content.trim() ? content.trim().split(/\s+/).length : 0

  const pct = Math.min((count / targetCount) * 100, 100)
  const isReached = count >= targetCount

  let countClass = 'para-count'
  if (isReached) countClass += ' para-count-reached'
  else if (pct >= 80) countClass += ' para-count-near'

  return (
    <div className="para-editor">
      <div className="para-editor-header">
        {onBack && (
          <button className="l1-back-btn" onClick={onBack}>← 返回</button>
        )}
        <h2 className="l1-editor-title">{levelLabel}</h2>
      </div>

      {tip && (
        <div className="para-tip-card">
          <span className="para-tip-icon">💡</span>
          <span className="para-tip-text">{tip}</span>
        </div>
      )}

      <div className="para-editor-body">
        <textarea
          className="para-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={language === 'chinese' ? '在此输入你的段落...' : 'Write your paragraph here...'}
        />
      </div>

      <div className="para-footer">
        <div className="para-target-info">
          <span className="para-target-label">
            目标: {targetCount}{language === 'chinese' ? '字' : '词'}
          </span>
          <span className={countClass}>
            当前: {count}{language === 'chinese' ? '字' : '词'}
          </span>
        </div>
        <div className="para-progress-bar">
          <div
            className={`para-progress-fill ${isReached ? 'para-progress-done' : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <button
          className={`button button-primary para-submit-btn ${count < 20 ? 'l1-confirm-disabled' : ''}`}
          disabled={count < 20}
          onClick={() => {
            localStorage.removeItem(`bifeng-draft-${levelLabel}`)
            onSubmit(content)
          }}
        >
          提交
        </button>
      </div>
    </div>
  )
}
