'use client'

import { useState } from 'react'

interface SentenceRewriteItem {
  original: string
  patternType: string
  hint: string
}

interface SentenceRewriteProps {
  sentences?: SentenceRewriteItem[]
  onSubmit: (answers: string[]) => void
  onBack?: () => void
}

const DEFAULT_SENTENCES: SentenceRewriteItem[] = [
  {
    original: 'The rapid development of technology has changed our daily lives.',
    patternType: 'Not only... but also...',
    hint: 'Rewrite using "Not only... but also..." structure',
  },
  {
    original: 'Students who work hard can achieve their goals.',
    patternType: 'Conditional (If...)',
    hint: 'Rewrite as a conditional sentence starting with "If"',
  },
  {
    original: 'Reading books helps us understand the world better.',
    patternType: 'Emphatic (It is... that...)',
    hint: 'Rewrite using "It is... that..." for emphasis',
  },
]

export default function SentenceRewrite({
  sentences = DEFAULT_SENTENCES,
  onSubmit,
  onBack,
}: SentenceRewriteProps) {
  const [answers, setAnswers] = useState<string[]>(() => Array(sentences.length).fill(''))
  const [expandedHint, setExpandedHint] = useState<number | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)

  const updateAnswer = (idx: number, val: string) => {
    const next = [...answers]
    next[idx] = val
    setAnswers(next)
  }

  const allFilled = answers.every((a) => a.trim().length > 0)
  const item = sentences[currentIdx]

  return (
    <div className="sr-editor">
      <div className="sr-editor-header">
        {onBack && (
          <button className="l1-back-btn" onClick={onBack}>← 返回</button>
        )}
        <h2 className="l1-editor-title">English L1 句式仿写</h2>
      </div>

      <div className="sr-counter">
        第 {currentIdx + 1}/{sentences.length} 句
      </div>

      {/* Original sentence */}
      <div className="sr-original-card">
        <div className="sr-original-label">Original</div>
        <p className="sr-original-text">{item.original}</p>
      </div>

      {/* Pattern type */}
      <div className="sr-pattern-badge">{item.patternType}</div>

      {/* Collapsible hint */}
      <button
        className="sr-hint-toggle"
        onClick={() => setExpandedHint(expandedHint === currentIdx ? null : currentIdx)}
      >
        {expandedHint === currentIdx ? '收起提示 ▲' : '展开提示 ▼'}
      </button>
      {expandedHint === currentIdx && (
        <div className="sr-hint-box">{item.hint}</div>
      )}

      {/* Input */}
      <textarea
        className="sr-input-textarea"
        value={answers[currentIdx]}
        onChange={(e) => updateAnswer(currentIdx, e.target.value)}
        placeholder="Type your rewritten sentence here..."
        rows={3}
      />

      {/* Navigation */}
      <div className="sr-nav">
        {currentIdx > 0 && (
          <button
            className="button button-secondary"
            onClick={() => setCurrentIdx(currentIdx - 1)}
          >
            上一句
          </button>
        )}
        <div style={{ flex: 1 }} />
        {currentIdx < sentences.length - 1 ? (
          <button
            className="button button-primary"
            onClick={() => setCurrentIdx(currentIdx + 1)}
          >
            下一句 →
          </button>
        ) : (
          <button
            className={`button button-primary ${!allFilled ? 'l1-confirm-disabled' : ''}`}
            disabled={!allFilled}
            onClick={() => onSubmit(answers)}
          >
            提交
          </button>
        )}
      </div>
    </div>
  )
}
