'use client'

import { useState, useEffect } from 'react'
import type { SprintPath, SprintPoint } from '@/lib/training/sprint-mode'

interface SprintDashboardProps {
  userId: string
  grade: string
  onSelectTraining?: (subject: 'chinese' | 'english', level: number) => void
}

const DIMENSION_TO_LEVEL: Record<string, { subject: 'chinese' | 'english'; level: number }> = {
  '内容深度': { subject: 'chinese', level: 4 },
  '结构逻辑': { subject: 'chinese', level: 2 },
  '语言表达': { subject: 'chinese', level: 6 },
  '写作规范': { subject: 'english', level: 5 },
}

const PRIORITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  high: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  medium: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  low: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
}

const PRIORITY_LABELS: Record<string, string> = {
  high: '紧急',
  medium: '重要',
  low: '巩固',
}

function getProgressColor(score: number): string {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#f59e0b'
  return '#ef4444'
}

function SprintPointCard({
  point,
  onStartTraining,
}: {
  point: SprintPoint
  onStartTraining?: (subject: 'chinese' | 'english', level: number) => void
}) {
  const styles = PRIORITY_STYLES[point.priority]
  const mapping = DIMENSION_TO_LEVEL[point.abilityPoint]
  const progressColor = getProgressColor(point.currentScore)

  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: '0.75rem',
        border: `1px solid ${styles.border}`,
        background: 'var(--bg-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              padding: '0.125rem 0.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              background: styles.bg,
              color: styles.text,
              border: `1px solid ${styles.border}`,
            }}
          >
            {PRIORITY_LABELS[point.priority]}
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {point.abilityPoint}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>提分空间</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#22c55e' }}>
            +{point.estimatedImprovement}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.25rem',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span>当前 {point.currentScore}分</span>
          <span>目标 {point.targetScore}分</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'var(--border-color)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${point.currentScore}%`,
              height: '100%',
              borderRadius: '3px',
              background: progressColor,
              transition: 'width 0.6s ease-out',
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          预计需 {point.trainingCount} 次训练
        </span>
        <button
          onClick={() => {
            if (onStartTraining && mapping) {
              onStartTraining(mapping.subject, mapping.level)
            }
          }}
          style={{
            padding: '0.375rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          开始冲刺
        </button>
      </div>
    </div>
  )
}

export default function SprintDashboard({
  userId,
  grade,
  onSelectTraining,
}: SprintDashboardProps) {
  const [sprintPath, setSprintPath] = useState<SprintPath | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [examDate, setExamDate] = useState<string>('')
  const [showDateInput, setShowDateInput] = useState(false)
  const [savingDate, setSavingDate] = useState(false)

  // Only show for 高三
  if (grade !== '高三') return null

  useEffect(() => {
    async function fetchSprintPath() {
      try {
        const res = await fetch(`/api/training/sprint?userId=${userId}`)
        if (!res.ok) {
          const data = await res.json()
          if (data.examDate) {
            // No exam date set yet
            setShowDateInput(true)
          }
          return
        }
        const data = await res.json()
        setSprintPath(data)
        setExamDate(data.examDate)
      } catch {
        setError('加载冲刺计划失败')
      } finally {
        setLoading(false)
      }
    }
    fetchSprintPath()
  }, [userId])

  const handleSaveExamDate = async () => {
    if (!examDate) return
    setSavingDate(true)
    try {
      const res = await fetch('/api/training/sprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, examDate }),
      })
      if (res.ok) {
        const data = await res.json()
        setSprintPath(data)
        setShowDateInput(false)
      }
    } catch {
      setError('保存考试日期失败')
    } finally {
      setSavingDate(false)
    }
  }

  if (loading) {
    return (
      <section className="training-section">
        <h3 className="training-section-title">冲刺模式</h3>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          加载中...
        </div>
      </section>
    )
  }

  // No exam date set - show date input
  if (showDateInput || !sprintPath) {
    return (
      <section className="training-section" style={{ borderLeft: '3px solid #f59e0b', padding: '1rem 1.25rem' }}>
        <h3 className="training-section-title">
          <span style={{ fontSize: '1.125rem' }}>冲刺模式</span>
          <span className="grade-label">高三专属</span>
        </h3>
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 600 }}>
            设置高考日期，制定冲刺计划
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color)',
                fontSize: '0.875rem',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              onClick={handleSaveExamDate}
              disabled={!examDate || savingDate}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                cursor: !examDate || savingDate ? 'not-allowed' : 'pointer',
                opacity: !examDate || savingDate ? 0.5 : 1,
              }}
            >
              {savingDate ? '保存中...' : '开始冲刺'}
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="training-section" style={{ borderLeft: '3px solid #f59e0b', padding: '1rem 1.25rem' }}>
      <h3 className="training-section-title">
        <span style={{ fontSize: '1.125rem' }}>冲刺模式</span>
        <span className="grade-label">高三专属</span>
      </h3>

      {/* Countdown banner */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderRadius: '0.75rem',
          background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
          color: 'white',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>距高考</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.2 }}>
            {sprintPath.daysUntilExam} 天
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>预计总提分</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>
            +{sprintPath.totalEstimatedImprovement}分
          </div>
        </div>
      </div>

      {/* Weekly goal */}
      <div
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          background: 'var(--accent-light)',
          marginBottom: '1rem',
          fontSize: '0.8rem',
          color: 'var(--accent)',
          fontWeight: 500,
        }}
      >
        <span style={{ marginRight: '0.375rem' }}>📋</span>
        {sprintPath.weeklyGoal}
      </div>

      {/* Sprint points */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sprintPath.sprintPoints.map((point) => (
          <SprintPointCard
            key={point.abilityPoint}
            point={point}
            onStartTraining={onSelectTraining}
          />
        ))}
      </div>

      {error && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            background: '#fef2f2',
            color: '#dc2626',
            fontSize: '0.75rem',
          }}
        >
          {error}
        </div>
      )}
    </section>
  )
}
