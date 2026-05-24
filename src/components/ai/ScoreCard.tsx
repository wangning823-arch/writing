'use client'

import { AIFeedback } from '@/types'

interface ScoreCardProps {
  feedback: AIFeedback
}

function ScoreRing({ score, max, label, color }: { score: number; max: number; label: string; color: string }) {
  const percentage = (score / max) * 100
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="dimension-score">
      <div className="score-ring-container">
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="6" fill="none" />
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'all 1s ease-out' }}
          />
        </svg>
        <span className="score-ring-text">{score}</span>
      </div>
      <span className="dimension-label">{label}</span>
    </div>
  )
}

export default function ScoreCard({ feedback }: ScoreCardProps) {
  const scoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const gradeClass = (score: number) => {
    if (score >= 80) return 'grade-a'
    if (score >= 60) return 'grade-b'
    return 'grade-c'
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div className="score-ring-container" style={{ width: '112px', height: '112px', margin: '0 auto' }}>
          <svg width="112" height="112" viewBox="0 0 112 112" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="56" cy="56" r="50" stroke="#e5e7eb" strokeWidth="8" fill="none" />
            <circle
              cx="56"
              cy="56"
              r="50"
              stroke={scoreColor(feedback.overallScore)}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 50}
              strokeDashoffset={2 * Math.PI * 50 - (feedback.overallScore / 100) * 2 * Math.PI * 50}
              style={{ transition: 'all 1s ease-out' }}
            />
          </svg>
          <div className="score-ring-text" style={{ fontSize: '1.875rem', fontWeight: 700 }}>
            {feedback.overallScore}
            <div style={{ fontSize: '0.75rem', fontWeight: 400, color: '#9ca3af' }}>满分100</div>
          </div>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <span className={`score-grade ${gradeClass(feedback.overallScore)}`}>
            {feedback.grade}
          </span>
        </div>
      </div>

      <div className="dimension-scores">
        <ScoreRing score={feedback.scores.content} max={30} label="内容" color="#3b82f6" />
        <ScoreRing score={feedback.scores.structure} max={25} label="结构" color="#8b5cf6" />
        <ScoreRing score={feedback.scores.language} max={25} label="语言" color="#f59e0b" />
        <ScoreRing score={feedback.scores.norm} max={20} label="规范" color="#10b981" />
      </div>
    </div>
  )
}
