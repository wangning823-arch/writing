'use client'

import { type Rubric } from '@/lib/training/rubrics'

interface RubricDisplayProps {
  rubric: Rubric
}

export default function RubricDisplay({ rubric }: RubricDisplayProps) {

  return (
    <div className="rubric-display">
      <div className="rubric-card">
        <div className="rubric-title">
          {rubric.genre}评分标准
        </div>

        {/* Score Levels */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            分数等级
          </div>
          <div className="rubric-levels">
            {rubric.levels.map((lvl, i) => (
              <div key={i} className="rubric-level" style={{
                background: i === 0 ? 'var(--success-light)' : i === 1 ? 'var(--accent-light)' : i === 2 ? 'var(--warning-light)' : 'var(--danger-light)',
              }}>
                <span className="rubric-level-name">{lvl.name}</span>
                <span className="rubric-level-range">{lvl.scoreRange}分</span>
                <span className="rubric-level-desc">{lvl.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            评分维度
          </div>
          <div className="rubric-dimensions">
            {rubric.dimensions.map((dim, i) => (
              <div key={i} className="rubric-dim">
                <div className="rubric-dim-name">{dim.name}</div>
                <div className="rubric-dim-desc">{dim.description}</div>
                <div style={{ marginTop: '0.375rem', fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--success-dark)' }}>{dim.excellent}</span>
                  {' / '}
                  <span style={{ color: 'var(--danger-dark)' }}>{dim.poor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
