'use client'

import { getLevel, CHINESE_LEVELS, ENGLISH_LEVELS } from '@/lib/training/config'

interface TrainingReportProps {
  subject: 'chinese' | 'english'
  level: number
  score: number
  dimensionScores: { content: number; structure: number; language: number; norm: number }
  previousScore?: number
  isRevision: boolean
  suggestionStatus?: { resolved: number; unresolved: number; misdirected: number; newIssue: number }
  onRevise?: () => void
  onNextLevel?: () => void
  onBackToHome?: () => void
}

const DIMENSION_META: Record<string, { label: string; color: string }> = {
  content: { label: '内容', color: '#3b82f6' },
  structure: { label: '结构', color: '#8b5cf6' },
  language: { label: '语言', color: '#f59e0b' },
  norm: { label: '规范', color: '#22c55e' },
}

function ScoreBar({ label, score, maxScore, color }: { label: string; score: number; maxScore: number; color: string }) {
  const pct = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0
  return (
    <div className="tr-dim-row">
      <div className="tr-dim-label">{label}</div>
      <div className="tr-dim-bar-track">
        <div
          className="tr-dim-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="tr-dim-score">{score}</div>
    </div>
  )
}

export default function TrainingReport({
  subject,
  level,
  score,
  dimensionScores,
  previousScore,
  isRevision,
  suggestionStatus,
  onRevise,
  onNextLevel,
  onBackToHome,
}: TrainingReportProps) {
  const levels = subject === 'chinese' ? CHINESE_LEVELS : ENGLISH_LEVELS
  const levelConfig = getLevel(subject, level)
  const levelName = levelConfig?.name || `L${level}`
  const maxScore = subject === 'chinese' ? 60 : 25
  const passed = score >= 60

  return (
    <div className="training-report">
      {/* Section 1: Training Summary */}
      <div className="tr-section">
        <h3 className="tr-section-title">
          {subject === 'chinese' ? '训练总结' : 'Training Summary'}
        </h3>
        <div className="tr-summary">
          <div className="tr-summary-main">
            <div className="tr-summary-level">
              <span className="tr-summary-level-badge">
                {subject === 'chinese' ? '语文' : 'English'} L{level}
              </span>
              <span className="tr-summary-level-name">{levelName}</span>
            </div>
            <div className="tr-summary-score">
              <span className="tr-summary-score-value" style={{ color: passed ? 'var(--success)' : 'var(--danger)' }}>
                {score}
              </span>
              <span className="tr-summary-score-max">/ {maxScore}</span>
            </div>
          </div>
          <div className="tr-summary-status">
            <span className={`tr-pass-badge ${passed ? 'tr-pass' : 'tr-fail'}`}>
              {passed
                ? (subject === 'chinese' ? '通过' : 'Passed')
                : (subject === 'chinese' ? '未通过' : 'Not Passed')}
            </span>
            {previousScore !== undefined && (
              <span className="tr-score-diff">
                {score > previousScore ? '+' : ''}{score - previousScore}
                {subject === 'chinese' ? '分' : ' pts'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Dimension Scores */}
      <div className="tr-section">
        <h3 className="tr-section-title">
          {subject === 'chinese' ? '维度得分' : 'Dimension Scores'}
        </h3>
        <div className="tr-dimensions">
          {Object.entries(DIMENSION_META).map(([key, meta]) => (
            <ScoreBar
              key={key}
              label={meta.label}
              score={dimensionScores[key as keyof typeof dimensionScores] || 0}
              maxScore={key === 'content' ? (subject === 'chinese' ? 20 : 10) : key === 'structure' ? (subject === 'chinese' ? 15 : 5) : key === 'language' ? (subject === 'chinese' ? 15 : 5) : (subject === 'chinese' ? 10 : 5)}
              color={meta.color}
            />
          ))}
        </div>
      </div>

      {/* Section 3: Suggestion Tracking (revision only) */}
      {isRevision && suggestionStatus && (
        <div className="tr-section">
          <h3 className="tr-section-title">
            {subject === 'chinese' ? '建议追踪' : 'Suggestion Tracking'}
          </h3>
          <div className="tr-suggestion-grid">
            <div className="tr-suggestion-item tr-suggestion-resolved">
              <span className="tr-suggestion-count">{suggestionStatus.resolved}</span>
              <span className="tr-suggestion-label">
                {subject === 'chinese' ? '已解决' : 'Resolved'}
              </span>
            </div>
            <div className="tr-suggestion-item tr-suggestion-unresolved">
              <span className="tr-suggestion-count">{suggestionStatus.unresolved}</span>
              <span className="tr-suggestion-label">
                {subject === 'chinese' ? '未解决' : 'Unresolved'}
              </span>
            </div>
            <div className="tr-suggestion-item tr-suggestion-misdirected">
              <span className="tr-suggestion-count">{suggestionStatus.misdirected}</span>
              <span className="tr-suggestion-label">
                {subject === 'chinese' ? '误判' : 'Misdirected'}
              </span>
            </div>
            <div className="tr-suggestion-item tr-suggestion-new">
              <span className="tr-suggestion-count">{suggestionStatus.newIssue}</span>
              <span className="tr-suggestion-label">
                {subject === 'chinese' ? '新问题' : 'New Issues'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Next Steps */}
      <div className="tr-section">
        <h3 className="tr-section-title">
          {subject === 'chinese' ? '下一步推荐' : 'Next Steps'}
        </h3>
        <div className="tr-actions">
          {!isRevision && onRevise && (
            <button className="button button-secondary" onClick={onRevise}>
              {subject === 'chinese' ? '修改后再评' : 'Revise & Re-submit'}
            </button>
          )}
          {passed && onNextLevel && (
            <button className="button button-primary" onClick={onNextLevel}>
              {subject === 'chinese' ? '进入下一层' : 'Next Level'}
            </button>
          )}
          {onBackToHome && (
            <button className="button button-secondary" onClick={onBackToHome}>
              {subject === 'chinese' ? '返回首页' : 'Back to Home'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
