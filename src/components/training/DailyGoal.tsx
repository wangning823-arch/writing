'use client'

import React from 'react'

interface DailyGoalProps {
  grade: string
  stage: string
  recommendations: Array<{ subject: string; level: number; label: string; estimatedMinutes: number }>
  onStartTraining: (subject: 'chinese' | 'english', level: number) => void
}

const GRADE_MESSAGING: Record<string, { header: string; subtitle: string }> = {
  '高一': { header: '📚 今日学习', subtitle: '夯实基础' },
  '高二': { header: '🎯 重点突破', subtitle: '针对性突破' },
  '高三': { header: '⚡ 今日冲刺', subtitle: '冲刺提分' },
}

export default function DailyGoal({ grade, stage: _stage, recommendations, onStartTraining }: DailyGoalProps) {
  const messaging = GRADE_MESSAGING[grade] || GRADE_MESSAGING['高一']
  const totalMinutes = recommendations.reduce((sum, r) => sum + r.estimatedMinutes, 0)

  return (
    <section className="training-section">
      <h3 className="training-section-title">
        {messaging.header}
        <span className="grade-label">{messaging.subtitle}</span>
      </h3>
      {recommendations.length > 0 ? (
        <>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 1rem' }}>
            每天只需{totalMinutes}分钟
          </p>
          <div className="recommend-cards">
            {recommendations.map((rec) => (
              <div
                key={`${rec.subject}-${rec.level}`}
                className="recommend-card"
              >
                <div className="recommend-card-badge">
                  {rec.subject === 'chinese' ? '语文' : '英语'} L{rec.level}
                </div>
                <div className="recommend-card-title">{rec.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  预计 {rec.estimatedMinutes} 分钟
                </div>
                <button
                  className="button button-primary button-small"
                  onClick={() => onStartTraining(rec.subject as 'chinese' | 'english', rec.level)}
                >
                  开始训练
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅</p>
          <p>今天已完成所有推荐训练！</p>
        </div>
      )}
    </section>
  )
}
