'use client'

import { useState, useEffect } from 'react'

interface PersonalizedPathProps {
  subject: 'chinese' | 'english'
  userId?: string
  onSelectTraining?: (type: string) => void
}

interface PathItem {
  id: string
  name: string
  type: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  estimatedTime: string
  status: 'recommended' | 'in-progress' | 'completed'
}

export default function PersonalizedPath({ subject, userId, onSelectTraining }: PersonalizedPathProps) {
  const [path, setPath] = useState<PathItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (userId) generatePath()
  }, [userId, subject])

  const generatePath = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/training/personalized-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subject }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setPath(data.path || [])
    } catch (e: any) {
      setError(e.message || '生成路径失败')
      setPath([
        { id: '1', name: '审题立意训练', type: 'topic-analysis', reason: '提升审题准确性', priority: 'high', estimatedTime: '10分钟', status: 'recommended' },
        { id: '2', name: '论证链条训练', type: 'argument-chain', reason: '加强论证逻辑', priority: 'high', estimatedTime: '20分钟', status: 'recommended' },
        { id: '3', name: '多角度分析', type: 'multi-angle', reason: '拓展思维广度', priority: 'medium', estimatedTime: '15分钟', status: 'recommended' },
        { id: '4', name: '精读训练', type: 'deep-reading', reason: '学习优秀写作技巧', priority: 'medium', estimatedTime: '25分钟', status: 'recommended' },
        { id: '5', name: '段落排序', type: 'paragraph-ordering', reason: '理解文章结构', priority: 'low', estimatedTime: '8分钟', status: 'recommended' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: '#fef2f2', text: '#dc2626' }
      case 'medium': return { bg: '#fffbeb', text: '#d97706' }
      default: return { bg: '#f0fdf4', text: '#16a34a' }
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '优先'
      case 'medium': return '推荐'
      default: return '可选'
    }
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
        个性化训练路径
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1.5rem' }}>
        根据你的能力诊断，AI 推荐以下训练序列
      </p>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)' }}>AI 正在分析你的能力数据...</p>
        </div>
      )}

      {error && (
        <p style={{ fontSize: '0.8125rem', color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
      )}

      {!loading && path.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {path.map((item, i) => {
            const pColor = getPriorityColor(item.priority)
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '1rem',
                  padding: '1rem', borderRadius: '0.75rem',
                  border: '1px solid var(--border-color, #e5e7eb)',
                  background: 'var(--bg-card, #fff)',
                }}
              >
                <div style={{
                  width: '2rem', height: '2rem', borderRadius: '50%',
                  background: i === 0 ? '#3b82f6' : 'var(--bg-secondary, #f9fafb)',
                  color: i === 0 ? '#fff' : 'var(--text-secondary, #6b7280)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8125rem', fontWeight: 600, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary, #111827)' }}>{item.name}</span>
                    <span style={{ fontSize: '0.625rem', padding: '0.0625rem 0.375rem', borderRadius: '9999px', background: pColor.bg, color: pColor.text }}>
                      {getPriorityLabel(item.priority)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', margin: '0 0 0.375rem' }}>{item.reason}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)' }}>{item.estimatedTime}</span>
                    {onSelectTraining && (
                      <button
                        onClick={() => onSelectTraining(item.type)}
                        style={{
                          fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '0.375rem',
                          border: '1px solid #3b82f6', background: '#fff', color: '#3b82f6',
                          cursor: 'pointer',
                        }}
                      >
                        开始训练
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <button
        onClick={generatePath}
        disabled={loading}
        style={{
          width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)',
          background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)',
          cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.875rem', marginTop: '1rem',
        }}
      >
        {loading ? '生成中...' : '重新生成路径'}
      </button>
    </div>
  )
}
