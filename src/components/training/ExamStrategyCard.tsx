'use client'

import { useState } from 'react'
import { getExamStrategy, type ExamStrategy, type ExamStage } from '@/lib/training/exam-strategy'

interface ExamStrategyCardProps {
  subject: 'chinese' | 'english'
  grade?: string
}

const STAGE_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#22c55e', // green
  '#f59e0b', // amber
]

export default function ExamStrategyCard({ subject, grade }: ExamStrategyCardProps) {
  const [expandedStage, setExpandedStage] = useState<number | null>(null)
  const strategy: ExamStrategy = getExamStrategy(subject, grade)

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '0.75rem',
      padding: '1.25rem',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '0.25rem',
        }}>
          {subject === 'chinese' ? '语文考试策略' : 'English Exam Strategy'}
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {strategy.totalTime}分钟
          {grade === '高三' ? ' · 高三加强模式' : ''}
        </p>
      </div>

      {/* Time allocation bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          display: 'flex',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          height: '2rem',
        }}>
          {strategy.stages.map((stage: ExamStage, index: number) => (
            <div
              key={stage.name}
              style={{
                width: `${stage.percentage}%`,
                background: STAGE_COLORS[index % STAGE_COLORS.length],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                cursor: 'pointer',
                opacity: expandedStage === index ? 1 : 0.9,
                borderRight: index < strategy.stages.length - 1 ? '2px solid white' : 'none',
              }}
              onClick={() => setExpandedStage(expandedStage === index ? null : index)}
              title={`${stage.name}: ${stage.duration}分钟`}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 0.25rem' }}>
                {stage.name}
              </span>
            </div>
          ))}
        </div>

        {/* Time labels below bar */}
        <div style={{ display: 'flex', marginTop: '0.25rem' }}>
          {strategy.stages.map((stage: ExamStage, index: number) => (
            <div
              key={stage.name}
              style={{
                width: `${stage.percentage}%`,
                textAlign: 'center',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
              }}
            >
              {stage.duration}分钟
            </div>
          ))}
        </div>
      </div>

      {/* Stage details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {strategy.stages.map((stage: ExamStage, index: number) => {
          const isExpanded = expandedStage === index
          return (
            <div
              key={stage.name}
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                transition: 'all 0.2s',
              }}
            >
              {/* Stage header */}
              <button
                onClick={() => setExpandedStage(isExpanded ? null : index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 0.75rem',
                  background: isExpanded ? 'var(--bg-hover)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: STAGE_COLORS[index % STAGE_COLORS.length],
                  flexShrink: 0,
                }} />
                <span style={{
                  flex: 1,
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}>
                  {stage.name}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}>
                  {stage.duration}分钟
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    color: 'var(--text-muted)',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Expanded tips */}
              {isExpanded && (
                <div style={{
                  padding: '0 0.75rem 0.75rem',
                  borderTop: '1px solid var(--border-color)',
                }}>
                  <ul style={{
                    listStyle: 'none',
                    padding: '0.5rem 0 0',
                    margin: 0,
                  }}>
                    {stage.tips.map((tip, tipIndex) => (
                      <li
                        key={tipIndex}
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                          padding: '0.25rem 0',
                          paddingLeft: '1rem',
                          position: 'relative',
                        }}
                      >
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          color: STAGE_COLORS[index % STAGE_COLORS.length],
                          fontWeight: 600,
                        }}>
                          ·
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* General tips */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'var(--accent-light)',
        borderRadius: '0.5rem',
      }}>
        <h4 style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--accent)',
          marginBottom: '0.375rem',
        }}>
          {subject === 'chinese' ? '通用建议' : 'General Tips'}
        </h4>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}>
          {strategy.generalTips.map((tip, index) => (
            <li
              key={index}
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                padding: '0.125rem 0',
                paddingLeft: '0.875rem',
                position: 'relative',
              }}
            >
              <span style={{
                position: 'absolute',
                left: 0,
                color: 'var(--accent)',
              }}>
                {index + 1}.
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
