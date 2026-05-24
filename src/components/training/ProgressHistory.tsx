'use client'

import { useState, useEffect } from 'react'
import TrendChart from './TrendChart'
import WeeklyReport from './WeeklyReport'
import MonthlyComparison from './MonthlyComparison'
import RadarChart from './RadarChart'
import type { AbilityProfile } from '@/types'

interface ProgressHistoryProps {
  userId: string
  subject: 'chinese' | 'english'
}

type TabKey = 'trend' | 'weekly' | 'monthly'

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'trend', label: '趋势', icon: '📈' },
  { key: 'weekly', label: '周报', icon: '📋' },
  { key: 'monthly', label: '月度对比', icon: '📊' },
]

interface TrendDataPoint {
  date: string
  scores: { content: number; structure: number; language: number; norms: number }
}

export default function ProgressHistory({ userId, subject }: ProgressHistoryProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('trend')
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([])
  const [abilityProfile, setAbilityProfile] = useState<AbilityProfile[]>([])
  const [loading, setLoading] = useState(true)

  // Stats
  const [totalTrainings, setTotalTrainings] = useState(0)
  const [avgScore, setAvgScore] = useState(0)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch trend data (weekly aggregated scores over time)
        const res = await fetch(
          `/api/progress/weekly-report?userId=${userId}&subject=${subject}&mode=trend`,
        )
        if (res.ok) {
          const data = await res.json()
          setTrendData(data.trendData || [])
          setTotalTrainings(data.totalTrainings || 0)
          setAvgScore(data.avgScore || 0)
        }

        // Fetch ability profile for radar chart
        const progressRes = await fetch(`/api/progress?userId=${userId}`)
        if (progressRes.ok) {
          const progressData = await progressRes.json()
          const profile = subject === 'chinese'
            ? progressData.chineseAbilityProfile
            : progressData.englishAbilityProfile
          setAbilityProfile(profile || [])
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userId, subject])

  const subjectLabel = subject === 'chinese' ? '语文' : '英语'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Tab navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          padding: '0.25rem',
          borderRadius: '0.5rem',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.8rem',
              fontWeight: activeTab === tab.key ? 600 : 400,
              background: activeTab === tab.key ? 'var(--bg-card)' : 'transparent',
              color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: activeTab === tab.key ? '1px solid var(--border-color)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Current state radar chart */}
      {abilityProfile.length > 0 && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
          }}
        >
          <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {subjectLabel}当前能力状态
          </h4>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RadarChart data={abilityProfile} size={220} />
          </div>
        </div>
      )}

      {/* Overall stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
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
            {totalTrainings}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
            总训练次数
          </div>
        </div>
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
            {avgScore || '--'}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
            平均分数
          </div>
        </div>
      </div>

      {/* Tab content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          加载中...
        </div>
      ) : (
        <>
          {activeTab === 'trend' && (
            <div
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
              }}
            >
              <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                能力趋势
              </h4>
              <TrendChart data={trendData} />
            </div>
          )}

          {activeTab === 'weekly' && <WeeklyReport userId={userId} subject={subject} />}

          {activeTab === 'monthly' && <MonthlyComparison userId={userId} subject={subject} />}
        </>
      )}
    </div>
  )
}
