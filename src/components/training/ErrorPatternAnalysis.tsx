'use client'

import { useState, useEffect } from 'react'

interface ErrorPatternAnalysisProps {
  userId?: string
  subject: 'chinese' | 'english'
}

interface ErrorPattern {
  type: string
  count: number
  examples: string[]
  trend: 'increasing' | 'decreasing' | 'stable'
}

export default function ErrorPatternAnalysis({ userId, subject }: ErrorPatternAnalysisProps) {
  const [patterns, setPatterns] = useState<ErrorPattern[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadPatterns() }, [userId])

  const loadPatterns = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/errors${userId ? `?userId=${userId}` : ''}`)
      const data = await res.json()
      const records = data.records || data.errors || []

      const patternMap = new Map<string, ErrorPattern>()
      records.forEach((r: any) => {
        const type = r.errorType || r.type || '其他'
        if (!patternMap.has(type)) {
          patternMap.set(type, { type, count: 0, examples: [], trend: 'stable' })
        }
        const p = patternMap.get(type)!
        p.count++
        if (r.description && p.examples.length < 3) p.examples.push(r.description)
      })

      setPatterns(Array.from(patternMap.values()).sort((a, b) => b.count - a.count))
    } catch {
      setPatterns([])
    } finally {
      setLoading(false)
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'var(--danger-dark)'
      case 'decreasing': return 'var(--success-dark)'
      default: return '#6b7280'
    }
  }

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↑ 上升'
      case 'decreasing': return '↓ 下降'
      default: return '→ 稳定'
    }
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
        错误模式分析
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1.5rem' }}>
        分析你的常见错误类型和趋势
      </p>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>加载中...</p>
      ) : patterns.length === 0 ? (
        <div style={{ padding: '2rem', borderRadius: '0.75rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary, #6b7280)' }}>暂无错误记录</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {patterns.map((p, i) => (
            <div key={i} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary, #111827)' }}>{p.type}</span>
                  <span style={{ fontSize: '0.6875rem', padding: '0.0625rem 0.375rem', borderRadius: '9999px', background: 'var(--danger-light)', color: 'var(--danger-dark)' }}>
                    {p.count}次
                  </span>
                </div>
                <span style={{ fontSize: '0.6875rem', color: getTrendColor(p.trend) }}>
                  {getTrendLabel(p.trend)}
                </span>
              </div>
              {p.examples.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #6b7280)', margin: '0 0 0.25rem' }}>示例：</p>
                  {p.examples.map((ex, j) => (
                    <p key={j} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', margin: '0 0 0.125rem', fontStyle: 'italic' }}>
                      • {ex}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
