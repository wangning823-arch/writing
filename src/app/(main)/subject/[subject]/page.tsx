'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ThinkingIcon, BookIcon } from '@/components/icons'
import { CHINESE_LEVEL_NAMES, ENGLISH_LEVEL_NAMES, LEVEL_ICONS, STAGE_META } from '@/lib/constants'
import { useNavigation } from '@/contexts/NavigationContext'
import type { Stage, TrainingProgress, AbilityProfile } from '@/types'

interface Stats {
  totalCount: number
  monthlyCount: number
  streak: number
}

interface DailyRecommendation {
  subject: string
  level: number
  label: string
  estimatedMinutes: number
}

export default function SubjectPage() {
  const params = useParams()
  const router = useRouter()
  const { userId } = useNavigation()
  const subject = params.subject as 'chinese' | 'english'

  const [grade, setGrade] = useState('高一')
  const [stage, setStage] = useState<Stage>('sprout')
  const [progress, setProgress] = useState<TrainingProgress[]>([])
  const [stats, setStats] = useState<Stats>({ totalCount: 0, monthlyCount: 0, streak: 0 })
  const [dailyRecommendations, setDailyRecommendations] = useState<DailyRecommendation[]>([])

  const levelNames = subject === 'chinese' ? CHINESE_LEVEL_NAMES : ENGLISH_LEVEL_NAMES
  const levelCount = subject === 'chinese' ? 7 : 6

  useEffect(() => {
    const saved = localStorage.getItem('bifeng-grade')
    if (saved) setGrade(saved)

    fetch(`/api/progress?userId=${encodeURIComponent(userId)}`)
      .then(r => r.json())
      .then(data => {
        setStage(subject === 'chinese' ? (data.chineseStage || 'sprout') : (data.englishStage || 'sprout'))
        setProgress(subject === 'chinese' ? (data.chineseProgress || []) : (data.englishProgress || []))
        setStats(subject === 'chinese' ? (data.chineseStats || { totalCount: 0, monthlyCount: 0, streak: 0 }) : (data.englishStats || { totalCount: 0, monthlyCount: 0, streak: 0 }))
        setDailyRecommendations(data.dailyRecommendations || [])
      })
      .catch(() => {})
  }, [subject, userId])

  const stageMeta = STAGE_META[stage] || STAGE_META.sprout

  const handleStartTraining = (level: number) => {
    router.push(`/training/${subject}/${level}`)
  }

  // Filter recommendations for current subject
  const filteredRecommendations = dailyRecommendations.filter(r => r.subject === subject)

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '2rem' }}>{subject === 'chinese' ? '📖' : '🔤'}</span>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--theme_text)' }}>
              {subject === 'chinese' ? '语文写作' : '英语写作'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--theme_text-weak)' }}>
              {grade} · {stageMeta.icon} {stageMeta.label}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
        <StatCard label="总训练" value={stats.totalCount} />
        <StatCard label="本月训练" value={stats.monthlyCount} />
        <StatCard label="连续天数" value={stats.streak} />
      </div>

      {/* Daily Recommendations */}
      {filteredRecommendations.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '16px' }}>
            今日推荐训练
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {filteredRecommendations.map((rec) => (
              <button
                key={`${rec.subject}-${rec.level}`}
                onClick={() => handleStartTraining(rec.level)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--theme_bg)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ fontSize: '0.6875rem', fontWeight: 500, color: 'var(--theme_button-primary)', marginBottom: '6px' }}>
                  L{rec.level} · {rec.estimatedMinutes}分钟
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--theme_text)', marginBottom: '4px' }}>
                  {rec.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)' }}>
                  开始训练 →
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Level Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '16px' }}>
          训练关卡
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {Array.from({ length: levelCount }, (_, i) => i + 1).map(level => {
            const name = levelNames[level] || `L${level}`
            const icon = LEVEL_ICONS[level] || '📝'
            const levelProgress = progress.find(p => p.level === level)
            const completed = levelProgress?.completed || false

            return (
              <button
                key={level}
                onClick={() => handleStartTraining(level)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: completed ? 'var(--color-blue-50)' : 'var(--theme_bg)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.25rem' }}>{icon}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)' }}>L{level}</span>
                  {completed && <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>✓</span>}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--theme_text)' }}>{name}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        <Link href={`/thinking?subject=${subject}`} style={{ textDecoration: 'none' }}>
          <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <ThinkingIcon size={24} />
            <div style={{ fontSize: '0.8125rem', color: 'var(--theme_text)', marginTop: '4px' }}>思维训练</div>
          </div>
        </Link>
        <Link href={`/model-essays?subject=${subject}`} style={{ textDecoration: 'none' }}>
          <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <BookIcon size={24} />
            <div style={{ fontSize: '0.8125rem', color: 'var(--theme_text)', marginTop: '4px' }}>范文赏析</div>
          </div>
        </Link>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--theme_text)' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)', marginTop: '4px' }}>{label}</div>
    </div>
  )
}
