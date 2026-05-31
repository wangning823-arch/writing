'use client'

import ReviewStreamPanel from '@/components/ai/ReviewStreamPanel'

interface StageTimeRecord {
  stage: string
  recommended: number // minutes
  actual: number // minutes
  rating?: string
  comment?: string
}

interface EssayReview {
  score: number
  dimensionScores: {
    content: number
    structure: number
    language: number
    norm: number
  }
  strengths: string[]
  suggestions: string[]
  overallComment: string
}

interface TimeAnalysis {
  overallRating: string
  stageBreakdown: StageTimeRecord[]
  timeManagementAdvice: string
}

interface SimulationReportProps {
  subject: 'chinese' | 'english'
  topic: string
  stageTimeRecords: StageTimeRecord[]
  essayContent: string
  reviewResult?: {
    essayReview: EssayReview
    timeAnalysis: TimeAnalysis
    strategyAdvice: string[]
  } | null
  isReviewing: boolean
  streamText?: string
  streamError?: string | null
  onRetry?: () => void
  onBackToHome?: () => void
}

function getTimeColor(actual: number, recommended: number): string {
  const diff = actual - recommended
  const ratio = diff / recommended
  if (ratio <= 0.1) return 'var(--success)' // green: within range
  if (ratio <= 0.25) return 'var(--warning)' // yellow: slightly over
  return 'var(--danger)' // red: significantly over
}

function getTimeBgColor(actual: number, recommended: number): string {
  const diff = actual - recommended
  const ratio = diff / recommended
  if (ratio <= 0.1) return 'var(--success-light)'
  if (ratio <= 0.25) return 'var(--warning-light)'
  return 'var(--danger-light)'
}

const DIMENSION_META: Record<string, { label: string; maxScore: number; color: string }> = {
  content: { label: '内容', maxScore: 20, color: '#3b82f6' },
  structure: { label: '结构', maxScore: 15, color: '#8b5cf6' },
  language: { label: '语言', maxScore: 15, color: '#f59e0b' },
  norm: { label: '规范', maxScore: 10, color: '#22c55e' },
}

export default function SimulationReport({
  subject,
  topic,
  stageTimeRecords,
  essayContent,
  reviewResult,
  isReviewing,
  streamText,
  streamError,
  onRetry,
  onBackToHome,
}: SimulationReportProps) {
  const maxScore = subject === 'chinese' ? 60 : 25

  // Adjust max scores for English
  if (subject === 'english') {
    DIMENSION_META.content.maxScore = 10
    DIMENSION_META.structure.maxScore = 5
    DIMENSION_META.language.maxScore = 5
    DIMENSION_META.norm.maxScore = 5
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      {/* Title */}
      <h2 style={{
        fontSize: '1.125rem',
        fontWeight: 600,
        color: 'var(--text-primary)',
        textAlign: 'center',
      }}>
        考场表现报告
      </h2>
      <p style={{
        fontSize: '0.8125rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
        marginTop: '-0.5rem',
      }}>
        {topic || '限时模拟'}
      </p>

      {/* Time usage breakdown */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.75rem',
        padding: '1.25rem',
      }}>
        <h3 style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '0.75rem',
        }}>
          时间使用情况
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {stageTimeRecords.map((record, index) => {
            const color = getTimeColor(record.actual, record.recommended)
            const bgColor = getTimeBgColor(record.actual, record.recommended)
            const diff = record.actual - record.recommended
            const diffLabel = diff > 0 ? `+${diff}` : `${diff}`

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '0.5rem',
                  background: bgColor,
                  border: `1px solid ${color}20`,
                }}
              >
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background: color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                  }}>
                    {record.stage}
                  </div>
                  <div style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-muted)',
                  }}>
                    推荐 {record.recommended}分钟
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color,
                  }}>
                    {record.actual}分钟
                  </div>
                  <div style={{
                    fontSize: '0.6875rem',
                    color,
                    fontWeight: 500,
                  }}>
                    {diffLabel}分钟
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Overall time rating */}
        {reviewResult?.timeAnalysis && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.625rem',
            borderRadius: '0.5rem',
            background: 'var(--bg-secondary)',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              时间管理评价：
            </span>
            <span style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: reviewResult.timeAnalysis.overallRating === '优秀' || reviewResult.timeAnalysis.overallRating === '良好'
                ? 'var(--success)'
                : reviewResult.timeAnalysis.overallRating === '一般'
                  ? 'var(--warning)'
                  : 'var(--danger)',
            }}>
              {reviewResult.timeAnalysis.overallRating}
            </span>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isReviewing && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
        }}>
          <ReviewStreamPanel
            text={streamText || ''}
            error={streamError}
            onRetry={streamError ? onRetry : undefined}
          />
        </div>
      )}

      {/* Essay review */}
      {reviewResult?.essayReview && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
          }}>
            作文评审
          </h3>

          {/* Score */}
          <div style={{
            textAlign: 'center',
            marginBottom: '1rem',
          }}>
            <span style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: reviewResult.essayReview.score >= 60 ? 'var(--success)' : 'var(--danger)',
            }}>
              {reviewResult.essayReview.score}
            </span>
            <span style={{
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
            }}>
              / {maxScore}
            </span>
          </div>

          {/* Dimension scores */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}>
            {Object.entries(DIMENSION_META).map(([key, meta]) => {
              const score = reviewResult.essayReview.dimensionScores[key as keyof typeof reviewResult.essayReview.dimensionScores] || 0
              const pct = Math.min((score / meta.maxScore) * 100, 100)
              return (
                <div key={key} style={{
                  padding: '0.5rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '0.375rem',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.25rem',
                  }}>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      {meta.label}
                    </span>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: meta.color }}>
                      {score}/{meta.maxScore}
                    </span>
                  </div>
                  <div style={{
                    height: '0.375rem',
                    background: 'var(--border-color)',
                    borderRadius: '0.1875rem',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: meta.color,
                      borderRadius: '0.1875rem',
                      transition: 'width 0.3s',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Overall comment */}
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '0.75rem',
          }}>
            {reviewResult.essayReview.overallComment}
          </p>

          {/* Strengths */}
          {reviewResult.essayReview.strengths.length > 0 && (
            <div style={{ marginBottom: '0.5rem' }}>
              <h4 style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--success)',
                marginBottom: '0.25rem',
              }}>
                优点
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {reviewResult.essayReview.strengths.map((s, i) => (
                  <li key={i} style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    padding: '0.125rem 0',
                    paddingLeft: '0.875rem',
                    position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--success)' }}>+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {reviewResult.essayReview.suggestions.length > 0 && (
            <div>
              <h4 style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--warning)',
                marginBottom: '0.25rem',
              }}>
                改进建议
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {reviewResult.essayReview.suggestions.map((s, i) => (
                  <li key={i} style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    padding: '0.125rem 0',
                    paddingLeft: '0.875rem',
                    position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--warning)' }}>*</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Strategy advice */}
      {reviewResult?.timeAnalysis?.timeManagementAdvice && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}>
            时间管理建议
          </h3>
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '0.5rem',
          }}>
            {reviewResult.timeAnalysis.timeManagementAdvice}
          </p>

          {/* Per-stage breakdown */}
          {reviewResult.timeAnalysis.stageBreakdown.map((stage, i) => (
            <div key={i} style={{
              padding: '0.5rem',
              background: 'var(--bg-secondary)',
              borderRadius: '0.375rem',
              marginBottom: '0.375rem',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {stage.stage}
                </span>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  color: stage.rating === '优秀' || stage.rating === '良好'
                    ? 'var(--success)'
                    : stage.rating === '一般'
                      ? 'var(--warning)'
                      : 'var(--danger)',
                }}>
                  {stage.rating}
                </span>
              </div>
              {stage.comment && (
                <p style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.125rem',
                }}>
                  {stage.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Strategy advice list */}
      {reviewResult?.strategyAdvice && reviewResult.strategyAdvice.length > 0 && (
        <div style={{
          background: 'var(--accent-light)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--accent)',
            marginBottom: '0.5rem',
          }}>
            策略建议
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {reviewResult.strategyAdvice.map((advice, i) => (
              <li key={i} style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                padding: '0.25rem 0',
                paddingLeft: '1rem',
                position: 'relative',
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: 'var(--accent)',
                  fontWeight: 600,
                }}>
                  {i + 1}.
                </span>
                {advice}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Essay content preview */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '0.75rem',
        padding: '1.25rem',
      }}>
        <h3 style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}>
          考场作文
        </h3>
        <div style={{
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.75,
          whiteSpace: 'pre-wrap',
          padding: '0.75rem',
          background: 'var(--bg-secondary)',
          borderRadius: '0.5rem',
          maxHeight: '15rem',
          overflowY: 'auto',
        }}>
          {essayContent}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.75rem',
        paddingBottom: '1rem',
      }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 500,
              background: 'var(--bg-hover)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            重新模拟
          </button>
        )}
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 500,
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            返回首页
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
