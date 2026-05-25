'use client'

import { useState } from 'react'

interface L1TopicAnalysisProps {
  /** Called when user confirms their thesis statement. */
  onConfirm: (keywords: string[], thesis: string) => void
  /** Called to go back. */
  onBack?: () => void
  /** Optional pre-filled topic prompt. */
  topicPrompt?: string
}

const THESIS_MAX = 200

export default function L1TopicAnalysis({ onConfirm, onBack, topicPrompt }: L1TopicAnalysisProps) {
  const [keywordInput, setKeywordInput] = useState('')
  const [thesis, setThesis] = useState('')

  const keywords = keywordInput
    .split(/[,，、\s]+/)
    .map((k) => k.trim())
    .filter(Boolean)

  const charCount = thesis.replace(/\s/g, '').length
  const isValid = charCount > 0 && charCount <= THESIS_MAX && keywords.length > 0

  let charCountClass = 'char-count'
  if (charCount > THESIS_MAX) charCountClass += ' char-count-high'
  else charCountClass += ' char-count-ok'

  return (
    <div className="l1-editor">
      <div className="l1-editor-header">
        {onBack && (
          <button className="l1-back-btn" onClick={onBack}>
            ← 返回
          </button>
        )}
        <h2 className="l1-editor-title">L1 审题立意</h2>
      </div>

      {topicPrompt && (
        <div className="l1-topic-prompt">
          <span className="l1-topic-prompt-label">题目：</span>
          <span className="l1-topic-prompt-text">{topicPrompt}</span>
        </div>
      )}

      {/* Keywords */}
      <div className="l1-field">
        <label className="l1-label">关键词（用逗号分隔）</label>
        <input
          type="text"
          className="l1-input"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          placeholder="例如：坚持, 方向, 勇气"
        />
        {keywords.length > 0 && (
          <div className="l1-tags">
            {keywords.map((kw, i) => (
              <span key={i} className="l1-tag">{kw}</span>
            ))}
          </div>
        )}
      </div>

      {/* Thesis */}
      <div className="l1-field">
        <label className="l1-label">一句话立意</label>
        <textarea
          className="l1-textarea"
          value={thesis}
          onChange={(e) => setThesis(e.target.value)}
          placeholder="请用一句话概括你的文章中心论点"
          rows={4}
        />
        <div className="l1-char-row">
          <span className={charCountClass}>
            {charCount} 字
          </span>
        </div>
      </div>

      {/* Confirm */}
      <div className="l1-actions">
        <button
          className={`button button-primary l1-confirm-btn ${!isValid ? 'l1-confirm-disabled' : ''}`}
          disabled={!isValid}
          onClick={() => onConfirm(keywords, thesis)}
        >
          确认立意
        </button>
      </div>
    </div>
  )
}
