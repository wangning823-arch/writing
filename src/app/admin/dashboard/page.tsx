'use client'

import { useEffect, useState } from 'react'

interface Stats {
  totalUsers: number
  totalTopics: number
  totalMaterials: number
  totalTrainingRecords: number
  recentUsers: { id: string; name: string | null; grade: string; createdAt: string }[]
  recentTrainings: { id: string; subject: string; score: number | null; createdAt: string; user: { name: string | null } }[]
}

const cardStyle = {
  background: 'var(--theme_bg)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  padding: '20px',
}

const statCardStyle = {
  ...cardStyle,
  flex: '1',
  minWidth: '200px',
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem('bifeng-user-id') || 'demo-user'
    fetch(`/api/admin/stats?userId=${encodeURIComponent(userId)}`)
      .then(r => r.json())
      .then(setStats)
      .catch(console.error)
  }, [])

  if (!stats) {
    return <div style={{ color: 'var(--theme_text-weak)', padding: '40px', textAlign: 'center' }}>加载中...</div>
  }

  const statItems = [
    { label: '用户总数', value: stats.totalUsers, color: 'var(--color-blue-500)' },
    { label: '作文题目', value: stats.totalTopics, color: 'var(--color-success)' },
    { label: '素材数量', value: stats.totalMaterials, color: 'var(--color-warning)' },
    { label: '训练记录', value: stats.totalTrainingRecords, color: '#8b5cf6' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '20px' }}>
        数据概览
      </h1>

      {/* Stats Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {statItems.map(item => (
          <div key={item.label} style={statCardStyle}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--theme_text-weak)', marginBottom: '8px' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: item.color }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Recent Users */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '16px' }}>
            最近注册用户
          </h2>
          {stats.recentUsers.length === 0 ? (
            <p style={{ color: 'var(--theme_text-muted)', fontSize: '0.8125rem' }}>暂无数据</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stats.recentUsers.map(user => (
                <div key={user.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'var(--theme_bg-subtle)',
                }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--theme_text)' }}>
                      {user.name || '未命名'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)' }}>
                      {user.grade}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)' }}>
                    {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Trainings */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '16px' }}>
            最近训练记录
          </h2>
          {stats.recentTrainings.length === 0 ? (
            <p style={{ color: 'var(--theme_text-muted)', fontSize: '0.8125rem' }}>暂无数据</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stats.recentTrainings.map(t => (
                <div key={t.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'var(--theme_bg-subtle)',
                }}>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--theme_text)' }}>
                      {t.user.name || '未命名'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)' }}>
                      {t.subject === 'chinese' ? '语文' : '英语'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {t.score !== null && (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: t.score >= 80 ? 'var(--color-success)' : t.score >= 60 ? 'var(--color-warning)' : 'var(--color-error)',
                      }}>
                        {t.score}分
                      </span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)' }}>
                      {new Date(t.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
