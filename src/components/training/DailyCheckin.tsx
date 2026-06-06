'use client'

import { useState, useEffect } from 'react'

interface DailyCheckinProps {
  userId?: string
  subject: 'chinese' | 'english'
}

interface CheckinData {
  todayChecked: boolean
  todayWordCount: number
  streak: number
  longestStreak: number
  recentCheckins: { date: string; wordCount: number; goalTarget: number }[]
}

export default function DailyCheckin({ userId, subject }: DailyCheckinProps) {
  const [data, setData] = useState<CheckinData | null>(null)
  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [goalTarget, setGoalTarget] = useState(200)
  const [loading, setLoading] = useState(false)
  const [checkinLoading, setCheckinLoading] = useState(false)

  useEffect(() => { loadCheckinData() }, [userId])

  const loadCheckinData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/training/checkin${userId ? `?userId=${userId}` : ''}`)
      const result = await res.json()
      setData(result)
    } catch {
      setData({
        todayChecked: false, todayWordCount: 0, streak: 0, longestStreak: 0, recentCheckins: [],
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckin = async () => {
    if (!content.trim()) return
    setCheckinLoading(true)
    try {
      const res = await fetch('/api/training/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, wordCount, goalTarget, userId, subject }),
      })
      const result = await res.json()
      if (result.success) {
        alert('打卡成功！')
        setContent('')
        setWordCount(0)
        loadCheckinData()
      }
    } catch {
      alert('打卡失败，请重试')
    } finally {
      setCheckinLoading(false)
    }
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    const count = value.replace(/\s/g, '').length
    setWordCount(count)
  }

  const today = new Date().toISOString().split('T')[0]

  if (loading) {
    return <div style={{ padding: '1.5rem', textAlign: 'center' }}><p style={{ color: 'var(--text-secondary)' }}>加载中...</p></div>
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
        每日写作打卡
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1.5rem' }}>
        坚持每天写作，养成写作习惯
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', background: 'var(--accent-light)', border: '1px solid var(--primary-200)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-600)', margin: '0 0 0.25rem' }}>{data?.streak || 0}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--theme_button-primary)', margin: 0 }}>连续打卡</p>
        </div>
        <div style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', background: 'var(--success-light)', border: '1px solid var(--success-border)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success-dark)', margin: '0 0 0.25rem' }}>{data?.longestStreak || 0}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--success-dark)', margin: 0 }}>最长连续</p>
        </div>
        <div style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', background: 'var(--warning-light)', border: '1px solid var(--warning-border)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--warning-dark)', margin: '0 0 0.25rem' }}>{data?.todayWordCount || 0}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--topic-info-text)', margin: 0 }}>今日字数</p>
        </div>
      </div>

      {data?.todayChecked ? (
        <div style={{ padding: '1.5rem', borderRadius: '0.75rem', background: 'var(--success-light)', border: '1px solid var(--success-border)', textAlign: 'center' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--success-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.5rem' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--success-dark)', margin: 0 }}>今日已打卡</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary, #111827)', marginBottom: '0.375rem' }}>
              今日写作目标
            </label>
            <select
              value={goalTarget}
              onChange={(e) => setGoalTarget(Number(e.target.value))}
              style={{
                width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
                fontSize: '0.875rem', color: 'var(--text-primary, #111827)', boxSizing: 'border-box',
              }}
            >
              <option value={100}>100字（轻松模式）</option>
              <option value={200}>200字（标准模式）</option>
              <option value={300}>300字（进阶模式）</option>
              <option value={500}>500字（挑战模式）</option>
            </select>
          </div>

          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            rows={6}
            placeholder="写下你今天的随感、观察或任何想法..."
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
              fontSize: '0.875rem', color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '0.5rem',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: wordCount >= goalTarget ? 'var(--success-dark)' : 'var(--text-tertiary, #9ca3af)' }}>
              {wordCount} / {goalTarget} 字 {wordCount >= goalTarget ? '✓ 达标' : ''}
            </span>
          </div>

          <button
            onClick={handleCheckin}
            disabled={!content.trim() || checkinLoading}
            style={{
              width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: 'none',
              background: content.trim() && !checkinLoading ? 'var(--theme_button-primary)' : '#9ca3af',
              color: '#fff', cursor: content.trim() && !checkinLoading ? 'pointer' : 'not-allowed', fontSize: '0.875rem', fontWeight: 500,
            }}
          >
            {checkinLoading ? '打卡中...' : '完成打卡'}
          </button>
        </>
      )}

      {data?.recentCheckins && data.recentCheckins.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.75rem' }}>最近打卡</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.375rem' }}>
            {data.recentCheckins.map((c, i) => (
              <div
                key={i}
                style={{
                  padding: '0.375rem', borderRadius: '0.375rem', textAlign: 'center',
                  background: c.wordCount >= c.goalTarget ? 'var(--success-light)' : c.wordCount > 0 ? 'var(--topic-info-bg)' : 'var(--bg-secondary, #f9fafb)',
                  border: `1px solid ${c.wordCount >= c.goalTarget ? 'var(--success-border)' : c.wordCount > 0 ? 'var(--warning-border)' : 'var(--border-color, #e5e7eb)'}`,
                }}
              >
                <p style={{ fontSize: '0.625rem', color: 'var(--text-secondary, #6b7280)', margin: '0 0 0.125rem' }}>
                  {c.date.split('-').slice(1).join('/')}
                </p>
                <p style={{ fontSize: '0.625rem', color: c.wordCount >= c.goalTarget ? 'var(--success-dark)' : 'var(--text-tertiary, #9ca3af)', margin: 0, fontWeight: 500 }}>
                  {c.wordCount}字
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
