'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CHINESE_ARGUMENTATIVE_RUBRIC, ENGLISH_ESSAY_RUBRIC } from '@/lib/training/rubrics'
import { useNavigation } from '@/contexts/NavigationContext'

interface Stats {
  totalCount: number
  monthlyCount: number
  streak: number
}

export default function RightPanel() {
  const pathname = usePathname()
  const { userId } = useNavigation()
  const [chineseStats, setChineseStats] = useState<Stats>({ totalCount: 0, monthlyCount: 0, streak: 0 })
  const [englishStats, setEnglishStats] = useState<Stats>({ totalCount: 0, monthlyCount: 0, streak: 0 })

  useEffect(() => {
    fetch(`/api/progress?userId=${encodeURIComponent(userId)}`)
      .then(r => r.json())
      .then(data => {
        setChineseStats(data.chineseStats || { totalCount: 0, monthlyCount: 0, streak: 0 })
        setEnglishStats(data.englishStats || { totalCount: 0, monthlyCount: 0, streak: 0 })
      })
      .catch(() => {})
  }, [userId])

  const isTrainingPage = pathname.startsWith('/training/')
  const isSubjectPage = pathname.startsWith('/subject/')
  const isChinese = pathname.includes('chinese')
  const isEnglish = pathname.includes('english')

  // Determine which rubric to show
  const showChineseRubric = isChinese && (isTrainingPage || isSubjectPage)
  const showEnglishRubric = isEnglish && (isTrainingPage || isSubjectPage)
  const rubric = showChineseRubric ? CHINESE_ARGUMENTATIVE_RUBRIC : showEnglishRubric ? ENGLISH_ESSAY_RUBRIC : null

  return (
    <aside
      className="right-panel"
      style={{
        width: '280px',
        minWidth: '280px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: 'var(--theme_bg)',
        borderLeft: '1px solid var(--border-color)',
        padding: '20px 16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Rubric / Scoring Criteria - shown on subject/training pages */}
      {rubric && (
        <section>
          <h3
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--theme_text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '12px',
            }}
          >
            {rubric.genre}评分标准
          </h3>

          {/* Score Levels */}
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--theme_bg)',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--theme_text-muted)', marginBottom: '8px' }}>
              分数等级
            </div>
            {rubric.levels.map((level, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 0',
                  borderBottom: i < rubric.levels.length - 1 ? '1px solid var(--border-color)' : 'none',
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--theme_text)', minWidth: '48px' }}>
                  {level.name}
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--theme_button-primary)', minWidth: '52px' }}>
                  {level.scoreRange}分
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--theme_text-muted)', flex: 1 }}>
                  {level.description}
                </span>
              </div>
            ))}
          </div>

          {/* Dimensions */}
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--theme_bg)',
            }}
          >
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--theme_text-muted)', marginBottom: '8px' }}>
              评分维度
            </div>
            {rubric.dimensions.map((dim, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 0',
                  borderBottom: i < rubric.dimensions.length - 1 ? '1px solid var(--border-color)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--theme_text)' }}>{dim.name}</span>
                  <span style={{ fontSize: '0.625rem', color: 'var(--theme_text-muted)' }}>{dim.description}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem' }}>
                  <span style={{ color: 'var(--color-success)' }}>{dim.excellent}</span>
                  <span style={{ color: 'var(--color-error)' }}>{dim.poor}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Home page: Quick Stats */}
      {!rubric && (
        <>
          <section>
            <h3
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--theme_text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '12px',
              }}
            >
              写作统计
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              <StatCard label="总训练" value={chineseStats.totalCount + englishStats.totalCount} />
              <StatCard label="本月" value={chineseStats.monthlyCount + englishStats.monthlyCount} />
              <StatCard label="连续天数" value={Math.max(chineseStats.streak, englishStats.streak)} />
              <StatCard label="语文" value={chineseStats.totalCount} />
            </div>
          </section>

          <section>
            <h3
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--theme_text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '12px',
              }}
            >
              快捷操作
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <QuickLink href="/subject/chinese" icon="📖" label="开始语文训练" />
              <QuickLink href="/subject/english" icon="🔤" label="开始英语训练" />
            </div>
          </section>
        </>
      )}
    </aside>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        background: 'var(--theme_bg)',
      }}
    >
      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)' }}>{value}</div>
      <div style={{ fontSize: '0.6875rem', color: 'var(--theme_text-muted)', marginTop: '2px' }}>{label}</div>
    </div>
  )
}

function QuickLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        textDecoration: 'none',
        color: 'var(--theme_text)',
        fontSize: '0.8125rem',
        transition: 'all var(--transition-fast)',
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
