'use client'

import { useState, useEffect } from 'react'

interface MonthlyComparisonProps {
  userId: string
  subject: 'chinese' | 'english'
}

interface MonthData {
  totalTrainings: number
  avgScore: number
  dimensionScores: {
    content: number
    structure: number
    language: number
    norms: number
  }
}

interface ComparisonResult {
  thisMonth: MonthData
  lastMonth: MonthData
  improvement: number
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

function BarChart({
  thisMonth,
  lastMonth,
}: {
  thisMonth: Record<string, number>
  lastMonth: Record<string, number>
}) {
  const maxVal = Math.max(
    ...Object.values(thisMonth),
    ...Object.values(lastMonth),
    1,
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      {Object.keys(DIMENSION_LABELS).map((key) => {
        const thisVal = thisMonth[key] || 0
        const lastVal = lastMonth[key] || 0
        const delta = thisVal - lastVal

        return (
          <div key={key}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.25rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: DIMENSION_COLORS[key],
                }}
              >
                {DIMENSION_LABELS[key]}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {thisVal}
                </span>
                {delta !== 0 && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: delta > 0 ? '#22c55e' : '#ef4444',
                    }}
                  >
                    {delta > 0 ? '+' : ''}{delta}
                  </span>
                )}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '2px',
                height: '8px',
              }}
            >
              {/* Last month bar */}
              <div
                style={{
                  width: `${(lastVal / maxVal) * 100}%`,
                  height: '100%',
                  borderRadius: '2px',
                  background: DIMENSION_COLORS[key],
                  opacity: 0.25,
                }}
              />
              {/* This month bar */}
              <div
                style={{
                  width: `${(thisVal / maxVal) * 100}%`,
                  height: '100%',
                  borderRadius: '2px',
                  background: DIMENSION_COLORS[key],
                  opacity: 0.85,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StatBlock({
  label,
  thisValue,
  lastValue,
  unit = '',
}: {
  label: string
  thisValue: number
  lastValue: number
  unit?: string
}) {
  const delta = thisValue - lastValue
  return (
    <div
      style={{
        padding: '0.75rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {thisValue}{unit}
      </div>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
        {label}
      </div>
      {delta !== 0 && (
        <div
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: delta > 0 ? '#22c55e' : '#ef4444',
          }}
        >
          {delta > 0 ? '+' : ''}{delta}{unit}
        </div>
      )}
    </div>
  )
}

export default function MonthlyComparison({
  userId,
  subject,
}: MonthlyComparisonProps) {
  const [data, setData] = useState<ComparisonResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/progress/weekly-report?userId=${userId}&subject=${subject}&mode=monthly`,
        )
        if (res.ok) {
          const result = await res.json()
          setData(result)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userId, subject])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
        加载月度数据...
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
        暂无月度对比数据
      </div>
    )
  }

  const subjectLabel = subject === 'chinese' ? '语文' : '英语'

  // Get month names
  const now = new Date()
  const thisMonthName = `${now.getMonth() + 1}月`
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthName = `${lastMonthDate.getMonth() + 1}月`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '0.75rem',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {subjectLabel}写作 - 本月 vs 上月
          </h4>
          {data.improvement !== 0 && (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: data.improvement > 0 ? '#22c55e' : '#ef4444',
              }}
            >
              {data.improvement > 0 ? '↑' : '↓'} {Math.abs(data.improvement)}分
            </span>
          )}
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
          <StatBlock
            label="总训练次数"
            thisValue={data.thisMonth.totalTrainings}
            lastValue={data.lastMonth.totalTrainings}
            unit="次"
          />
          <StatBlock
            label="平均分数"
            thisValue={data.thisMonth.avgScore}
            lastValue={data.lastMonth.avgScore}
          />
          <StatBlock
            label="综合进步"
            thisValue={data.thisMonth.avgScore}
            lastValue={data.lastMonth.avgScore}
          />
        </div>
      </div>

      {/* Bar chart comparison */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '0.75rem',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
        }}
      >
        <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          维度对比
        </h4>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: '12px', height: '6px', borderRadius: '2px', background: 'var(--text-secondary)', opacity: 0.3 }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{lastMonthName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div style={{ width: '12px', height: '6px', borderRadius: '2px', background: 'var(--text-secondary)', opacity: 0.85 }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{thisMonthName}</span>
          </div>
        </div>

        <BarChart
          thisMonth={data.thisMonth.dimensionScores}
          lastMonth={data.lastMonth.dimensionScores}
        />
      </div>
    </div>
  )
}
