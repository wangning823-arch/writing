'use client'

import { useState, useEffect } from 'react'

interface WeeklyReportProps {
  userId: string
  subject: 'chinese' | 'english'
}

interface WeekStats {
  thisWeekCount: number
  lastWeekCount: number
  thisWeekAvgScores: { content: number; structure: number; language: number; norms: number }
  lastWeekAvgScores: { content: number; structure: number; language: number; norms: number }
  highlights: string[]
  improvementAreas: string[]
  recommendations: string[]
}

const DIMENSION_LABELS: Record<string, string> = {
  content: '内容',
  structure: '结构',
  language: '语言',
  norms: '规范',
}

const DIMENSION_COLORS: Record<string, string> = {
  content: '#3b82f6',
  structure: '#8b5cf6',
  language: '#f59e0b',
  norms: '#10b981',
}

function DeltaIndicator({ current, previous }: { current: number; previous: number }) {
  const delta = current - previous
  if (delta === 0) return <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>--</span>

  const color = delta > 0 ? '#22c55e' : '#ef4444'
  const arrow = delta > 0 ? '↑' : '↓'
  return (
    <span style={{ color, fontSize: '0.75rem', fontWeight: 600 }}>
      {arrow} {Math.abs(delta)}
    </span>
  )
}

export default function WeeklyReport({ userId, subject }: WeeklyReportProps) {
  const [stats, setStats] = useState<WeekStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<string | null>(null)
  const [insightsLoading, setInsightsLoading] = useState(false)

  useEffect(() => {
    async function fetchWeeklyReport() {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/progress/weekly-report?userId=${userId}&subject=${subject}`,
        )
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchWeeklyReport()
  }, [userId, subject])

  const handleGenerateInsights = async () => {
    if (!stats) return
    setInsightsLoading(true)
    try {
      const res = await fetch('/api/progress/weekly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subject, stats }),
      })
      if (res.ok) {
        const data = await res.json()
        setInsights(data.insights)
      }
    } catch {
      // silently fail
    } finally {
      setInsightsLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
        加载周报数据...
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
        暂无周报数据，完成更多训练后查看
      </div>
    )
  }

  const subjectLabel = subject === 'chinese' ? '语文' : '英语'
  const countDelta = stats.thisWeekCount - stats.lastWeekCount

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Training count comparison */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '0.75rem',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
        }}
      >
        <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          {subjectLabel}写作 - 本周训练
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {stats.thisWeekCount}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>本周</div>
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>vs</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {stats.lastWeekCount}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>上周</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <DeltaIndicator current={stats.thisWeekCount} previous={stats.lastWeekCount} />
          </div>
        </div>
      </div>

      {/* Per-dimension score comparison */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '0.75rem',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
        }}
      >
        <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          维度平均分对比
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {Object.keys(DIMENSION_LABELS).map((key) => {
            const thisWeek = stats.thisWeekAvgScores[key as keyof typeof stats.thisWeekAvgScores]
            const lastWeek = stats.lastWeekAvgScores[key as keyof typeof stats.lastWeekAvgScores]
            const delta = thisWeek - lastWeek
            const barColor = delta >= 0 ? '#22c55e' : '#ef4444'

            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    width: '2.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: DIMENSION_COLORS[key],
                  }}
                >
                  {DIMENSION_LABELS[key]}
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.125rem',
                      fontSize: '0.7rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span>{thisWeek}</span>
                    <span>{lastWeek}</span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      borderRadius: '2px',
                      background: 'var(--border-color)',
                      overflow: 'hidden',
                      display: 'flex',
                      gap: '1px',
                    }}
                  >
                    <div
                      style={{
                        width: `${thisWeek}%`,
                        height: '100%',
                        borderRadius: '2px',
                        background: DIMENSION_COLORS[key],
                        opacity: 0.9,
                      }}
                    />
                  </div>
                </div>
                <DeltaIndicator current={thisWeek} previous={lastWeek} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Highlights */}
      {stats.highlights.length > 0 && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #bbf7d0',
            background: '#f0fdf4',
          }}
        >
          <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#16a34a', marginBottom: '0.5rem' }}>
            本周亮点
          </h4>
          {stats.highlights.map((h, i) => (
            <div
              key={i}
              style={{
                fontSize: '0.8rem',
                color: '#15803d',
                padding: '0.25rem 0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.375rem',
              }}
            >
              <span>+</span>
              <span>{h}</span>
            </div>
          ))}
        </div>
      )}

      {/* Improvement areas */}
      {stats.improvementAreas.length > 0 && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid #fecaca',
            background: '#fef2f2',
          }}
        >
          <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#dc2626', marginBottom: '0.5rem' }}>
            需要加强
          </h4>
          {stats.improvementAreas.map((area, i) => (
            <div
              key={i}
              style={{
                fontSize: '0.8rem',
                color: '#b91c1c',
                padding: '0.25rem 0',
              }}
            >
              {area}
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {stats.recommendations.length > 0 && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
          }}
        >
          <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            下周建议
          </h4>
          {stats.recommendations.map((rec, i) => (
            <div
              key={i}
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                padding: '0.25rem 0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.375rem',
              }}
            >
              <span style={{ color: 'var(--accent)' }}>{i + 1}.</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      )}

      {/* AI insights button */}
      {!insights && (
        <button
          onClick={handleGenerateInsights}
          disabled={insightsLoading}
          style={{
            padding: '0.625rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: 500,
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            cursor: insightsLoading ? 'not-allowed' : 'pointer',
            opacity: insightsLoading ? 0.5 : 1,
          }}
        >
          {insightsLoading ? 'AI分析中...' : '获取AI个性化分析'}
        </button>
      )}

      {/* AI insights */}
      {insights && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
          }}
        >
          <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            AI个性化分析
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {insights}
          </p>
        </div>
      )}
    </div>
  )
}
