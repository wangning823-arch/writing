'use client'

import { ProgressScoreResult } from '@/types'

interface ProgressScoreCardProps {
  result: ProgressScoreResult
}

export default function ProgressScoreCard({ result }: ProgressScoreCardProps) {
  const { originalScore, newScore, improvement, fixedIssues, remainingIssues, aiComment } = result

  const scoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="psc-card">
      {/* Score comparison */}
      <div className="psc-scores-row">
        <div className="psc-score-block">
          <span className="psc-score-label">原始分数</span>
          <span className="psc-score-value" style={{ color: scoreColor(originalScore) }}>
            {originalScore}
          </span>
        </div>

        <div className="psc-arrow">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        <div className="psc-score-block">
          <span className="psc-score-label">修改后分数</span>
          <span className="psc-score-value" style={{ color: scoreColor(newScore) }}>
            {newScore}
          </span>
        </div>

        {improvement > 0 && (
          <div className="psc-improvement-badge">
            +{improvement}分
          </div>
        )}
      </div>

      {/* Fixed issues */}
      {fixedIssues.length > 0 && (
        <div className="psc-section psc-fixed">
          <h4 className="psc-section-title">已解决的问题</h4>
          <ul className="psc-list">
            {fixedIssues.map((issue, i) => (
              <li key={i} className="psc-list-item psc-item-fixed">
                <span className="psc-item-icon">✓</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Remaining issues */}
      {remainingIssues.length > 0 && (
        <div className="psc-section psc-remaining">
          <h4 className="psc-section-title">仍需改进</h4>
          <ul className="psc-list">
            {remainingIssues.map((issue, i) => (
              <li key={i} className="psc-list-item psc-item-remaining">
                <span className="psc-item-icon">!</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI comment */}
      {aiComment && (
        <div className="psc-ai-comment">
          <span className="psc-ai-icon">🤖</span>
          <p className="psc-ai-text">{aiComment}</p>
        </div>
      )}
    </div>
  )
}
