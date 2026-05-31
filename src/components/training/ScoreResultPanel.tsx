'use client'

interface ScoreResultPanelProps {
  overallScore: number
  strengths?: string[]
  suggestions?: string[]
  summary?: string
  referenceAnswer?: string
  exampleVariants?: string[]
  scoringCriteria?: Record<string, string>
  onRetry?: () => void
  onNext?: () => void
  hasNext?: boolean
  showRetry?: boolean
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)' }}>{label}</span>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626' }}>{score}</span>
      </div>
      <div style={{ height: '6px', borderRadius: '3px', background: 'var(--bg-secondary, #f3f4f6)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, borderRadius: '3px', background: score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626', transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}

export default function ScoreResultPanel({
  overallScore,
  strengths = [],
  suggestions = [],
  summary,
  referenceAnswer,
  exampleVariants = [],
  scoringCriteria,
  onRetry,
  onNext,
  hasNext,
  showRetry = true,
}: ScoreResultPanelProps) {
  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Overall Score */}
      <div style={{ textAlign: 'center', padding: '1.5rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #eff6ff 100%)', border: '1px solid #bfdbfe', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: overallScore >= 80 ? '#16a34a' : overallScore >= 60 ? '#d97706' : '#dc2626' }}>
          {overallScore}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>综合评分</div>
      </div>

      {/* Scoring Criteria */}
      {scoringCriteria && Object.keys(scoringCriteria).length > 0 && (
        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#fffbeb', border: '1px solid #fde68a', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#92400e', marginBottom: '0.75rem' }}>评分依据</h4>
          <div style={{ fontSize: '0.8125rem', color: '#78350f', lineHeight: 1.8 }}>
            {Object.entries(scoringCriteria).map(([key, value]) => (
              <p key={key} style={{ margin: '0 0 0.5rem' }}>{value}</p>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534', marginBottom: '0.5rem' }}>总评</h4>
          <p style={{ fontSize: '0.875rem', color: '#15803d', margin: 0, lineHeight: 1.8 }}>{summary}</p>
        </div>
      )}

      {/* Reference Answer */}
      {referenceAnswer && (
        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534', marginBottom: '0.5rem' }}>参考答案</h4>
          <p style={{ fontSize: '0.875rem', color: '#15803d', margin: 0, lineHeight: 1.8 }}>{referenceAnswer}</p>
        </div>
      )}

      {/* Example Variants */}
      {exampleVariants.length > 0 && (
        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#faf5ff', border: '1px solid #e9d5ff', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#7c3aed', marginBottom: '0.5rem' }}>优秀范例</h4>
          {exampleVariants.map((ex, i) => (
            <div key={i} style={{ padding: '0.5rem 0.75rem', marginBottom: i < exampleVariants.length - 1 ? '0.5rem' : 0, background: '#fff', borderRadius: '0.5rem', border: '1px solid #e9d5ff', fontSize: '0.875rem', color: '#6d28d9', lineHeight: 1.8 }}>
              {i + 1}. {ex}
            </div>
          ))}
        </div>
      )}

      {/* Strengths & Suggestions */}
      {(strengths.length > 0 || suggestions.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          {strengths.length > 0 && (
            <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#166534', marginBottom: '0.5rem' }}>亮点</h4>
              {strengths.map((s, i) => (
                <p key={i} style={{ fontSize: '0.8125rem', color: '#15803d', margin: '0 0 0.25rem', lineHeight: 1.6 }}>{s}</p>
              ))}
            </div>
          )}
          {suggestions.length > 0 && (
            <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#fff7ed', border: '1px solid #fed7aa' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9a3412', marginBottom: '0.5rem' }}>改进建议</h4>
              {suggestions.map((s, i) => (
                <p key={i} style={{ fontSize: '0.8125rem', color: '#c2410c', margin: '0 0 0.25rem', lineHeight: 1.6 }}>{s}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
        {showRetry && onRetry && (
          <button onClick={onRetry}
            style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)', cursor: 'pointer', fontSize: '0.875rem' }}>
            重新作答
          </button>
        )}
        {hasNext && onNext && (
          <button onClick={onNext}
            style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
            下一题 →
          </button>
        )}
      </div>
    </div>
  )
}
