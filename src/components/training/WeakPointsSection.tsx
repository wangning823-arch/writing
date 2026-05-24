'use client'

import React from 'react'

interface WeakPoint {
  dimension: string
  description: string
  frequency: number
  recommendedTraining?: string
}

interface WeakPointsSectionProps {
  weakPoints: WeakPoint[]
  onRecommendTraining: (subject: 'chinese' | 'english', level: number) => void
}

export default function WeakPointsSection({ weakPoints, onRecommendTraining }: WeakPointsSectionProps) {
  return (
    <section className="training-section">
      <h3 className="training-section-title">
        🎯 薄弱点追踪
      </h3>
      {weakPoints.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {weakPoints.map((wp, idx) => {
            // Parse recommendedTraining string like "chinese:2" or "english:4"
            let subject: 'chinese' | 'english' = 'chinese'
            let level = 1
            if (wp.recommendedTraining) {
              const parts = wp.recommendedTraining.split(':')
              if (parts.length === 2) {
                subject = parts[0] as 'chinese' | 'english'
                level = parseInt(parts[1], 10) || 1
              }
            }

            return (
              <div
                key={`${wp.dimension}-${idx}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: 'var(--accent-light)',
                    color: 'var(--accent)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {wp.dimension}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    {wp.description}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                    出现 {wp.frequency} 次
                  </div>
                </div>
                {wp.recommendedTraining && (
                  <button
                    className="button button-primary button-small"
                    onClick={() => onRecommendTraining(subject, level)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    去训练
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💪</p>
          <p>暂无薄弱点，继续保持！</p>
        </div>
      )}
    </section>
  )
}
