'use client'

import { useState } from 'react'

interface WritingGoalsProps {
  userId?: string
  subject: 'chinese' | 'english'
}

interface Goal {
  id: string
  title: string
  target: number
  current: number
  unit: string
  deadline?: string
  status: 'active' | 'completed' | 'expired'
}

export default function WritingGoals({ userId, subject }: WritingGoalsProps) {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: '每周完成2篇作文', target: 8, current: 3, unit: '篇', deadline: '2026-06-30', status: 'active' },
    { id: '2', title: '阅读10篇优秀范文', target: 10, current: 6, unit: '篇', deadline: '2026-06-30', status: 'active' },
    { id: '3', title: '连续打卡14天', target: 14, current: 5, unit: '天', status: 'active' },
  ])
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newTarget, setNewTarget] = useState('')
  const [newUnit, setNewUnit] = useState('篇')

  const handleAddGoal = () => {
    if (!newTitle.trim() || !newTarget) return
    const goal: Goal = {
      id: Date.now().toString(),
      title: newTitle,
      target: Number(newTarget),
      current: 0,
      unit: newUnit,
      status: 'active',
    }
    setGoals(prev => [...prev, goal])
    setNewTitle('')
    setNewTarget('')
    setShowAdd(false)
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', margin: '0 0 0.25rem' }}>
            写作目标
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', margin: 0 }}>
            设定目标，追踪进步
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          style={{
            padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: 'none',
            background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '0.75rem',
          }}
        >
          + 新目标
        </button>
      </div>

      {showAdd && (
        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', marginBottom: '1rem' }}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="目标名称"
            style={{
              width: '100%', padding: '0.5rem', borderRadius: '0.375rem',
              border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
              fontSize: '0.875rem', color: 'var(--text-primary, #111827)', boxSizing: 'border-box', marginBottom: '0.5rem',
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              placeholder="目标数量"
              style={{
                flex: 1, padding: '0.5rem', borderRadius: '0.375rem',
                border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
                fontSize: '0.875rem', color: 'var(--text-primary, #111827)', boxSizing: 'border-box',
              }}
            />
            <select
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              style={{
                padding: '0.5rem', borderRadius: '0.375rem',
                border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
                fontSize: '0.875rem', color: 'var(--text-primary, #111827)',
              }}
            >
              <option value="篇">篇</option>
              <option value="天">天</option>
              <option value="字">字</option>
              <option value="小时">小时</option>
            </select>
            <button
              onClick={handleAddGoal}
              disabled={!newTitle.trim() || !newTarget}
              style={{
                padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none',
                background: newTitle.trim() && newTarget ? '#3b82f6' : '#9ca3af',
                color: '#fff', cursor: newTitle.trim() && newTarget ? 'pointer' : 'not-allowed', fontSize: '0.8125rem',
              }}
            >
              添加
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {goals.map(goal => {
          const progress = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0
          const isCompleted = progress >= 100
          return (
            <div key={goal.id} style={{
              padding: '1rem', borderRadius: '0.75rem',
              border: `1px solid ${isCompleted ? 'var(--success-border)' : 'var(--border-color, #e5e7eb)'}`,
              background: isCompleted ? 'var(--success-light)' : 'var(--bg-card, #fff)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary, #111827)', margin: 0 }}>
                  {goal.title}
                </h4>
                <span style={{ fontSize: '0.6875rem', color: isCompleted ? 'var(--success-dark)' : 'var(--text-tertiary, #9ca3af)' }}>
                  {goal.current}/{goal.target}{goal.unit}
                </span>
              </div>
              <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border-color, #e5e7eb)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '3px',
                  width: `${Math.min(progress, 100)}%`,
                  background: isCompleted ? 'var(--success-dark)' : 'var(--theme_button-primary)',
                  transition: 'width 0.3s',
                }} />
              </div>
              {goal.deadline && (
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #9ca3af)', margin: '0.375rem 0 0' }}>
                  截止：{goal.deadline}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
