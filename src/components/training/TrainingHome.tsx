'use client'

import React, { useState } from 'react'
import { TrainingProgress, AbilityProfile, Stage } from '@/types'
import RadarChart from './RadarChart'

interface TrainingHomeProps {
  chineseProgress: TrainingProgress[]
  englishProgress: TrainingProgress[]
  abilityProfile: AbilityProfile[]
  stage: Stage
  grade?: string
  streak?: number
  monthlyCount?: number
  recentAchievements?: Array<{ name: string; icon: string }>
  onSelectTraining: (subject: 'chinese' | 'english', level: number) => void
  onRetakeDiagnostic: () => void
  dailyRecommendations?: Array<{ subject: string; level: number; label: string; estimatedMinutes: number }>
  weakPoints?: Array<{ dimension: string; description: string; frequency: number; recommendedTraining?: string }>
  onOpenModelEssays?: () => void
}

const STAGE_META: Record<Stage, { icon: string; label: string; color: string }> = {
  sprout: { icon: '🌱', label: '萌芽期', color: '#22c55e' },
  growing: { icon: '🌿', label: '成长期', color: '#3b82f6' },
  thriving: { icon: '🌳', label: '成熟期', color: '#8b5cf6' },
}

function LevelIcon({ completed, current, locked }: { completed: boolean; current: boolean; locked: boolean }) {
  if (locked) return <span className="level-icon level-locked">🔒</span>
  if (completed) return <span className="level-icon level-done">✓</span>
  if (current) return <span className="level-icon level-current">▶</span>
  return <span className="level-icon level-pending">○</span>
}

function ProgressRow({ item, onSelect }: { item: TrainingProgress; onSelect: () => void }) {
  const progressPct = item.completed ? 100 : item.current ? 50 : item.locked ? 0 : 0

  return (
    <button
      className={`progress-row ${item.current ? 'progress-row-active' : ''} ${item.locked ? 'progress-row-locked' : ''}`}
      onClick={onSelect}
      disabled={item.locked}
    >
      <LevelIcon completed={item.completed} current={item.current} locked={item.locked} />
      <div className="progress-row-info">
        <span className="progress-row-label">{item.label}</span>
        <div className="progress-bar-track">
          <div
            className={`progress-bar-fill ${item.completed ? 'progress-bar-done' : item.current ? 'progress-bar-active' : ''}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
      {item.score != null && (
        <span className="progress-row-score">{item.score}分</span>
      )}
    </button>
  )
}

const GRADE_LABELS: Record<string, string> = {
  '高一': '基础夯实',
  '高二': '针对性突破',
  '高三': '冲刺提分',
}

export default function TrainingHome({
  chineseProgress,
  englishProgress,
  abilityProfile,
  stage,
  grade,
  onSelectTraining,
  onRetakeDiagnostic,
  dailyRecommendations,
  weakPoints,
  onOpenModelEssays,
}: TrainingHomeProps) {
  const meta = STAGE_META[stage]
  const [activeSubject, setActiveSubject] = useState<'chinese' | 'english'>('chinese')

  const progress = activeSubject === 'chinese' ? chineseProgress : englishProgress
  const subjectLabel = activeSubject === 'chinese' ? '语文写作' : '英语写作'
  const subjectIcon = activeSubject === 'chinese' ? '📖' : '🔤'

  // Filter recommendations for active subject
  const subjectRecommendations = (dailyRecommendations || []).filter(r => r.subject === activeSubject)

  // Fallback recommendations from progress
  const fallbackRecommendations = subjectRecommendations.length > 0
    ? subjectRecommendations
    : progress
        .filter((p) => p.current || (!p.completed && !p.locked))
        .slice(0, 2)
        .map((p) => ({
          subject: p.subject,
          level: p.level,
          label: p.label,
          estimatedMinutes: activeSubject === 'chinese' ? 15 : 10,
        }))

  // Filter weak points for active subject
  const subjectWeakPoints = (weakPoints || []).filter(wp => {
    if (!wp.recommendedTraining) return false
    return wp.recommendedTraining.startsWith(activeSubject)
  })

  // Grade-specific header config
  const GRADE_HEADERS: Record<string, { icon: string; title: string; style: React.CSSProperties }> = {
    '高一': {
      icon: '📚',
      title: '今日学习',
      style: { borderLeft: '3px solid #22c55e' },
    },
    '高二': {
      icon: '🎯',
      title: '重点突破',
      style: { borderLeft: '3px solid #3b82f6' },
    },
    '高三': {
      icon: '⚡',
      title: '今日冲刺',
      style: { borderLeft: '3px solid #f59e0b' },
    },
  }

  const gradeHeader = grade ? GRADE_HEADERS[grade] : null

  return (
    <div className="training-home">
      {/* Stage badge */}
      <div className="stage-badge-bar">
        <div className="stage-badge" style={{ borderColor: meta.color }}>
          <span className="stage-badge-icon">{meta.icon}</span>
          <span className="stage-badge-label" style={{ color: meta.color }}>{meta.label}</span>
        </div>
        <button className="button button-secondary button-small" onClick={onRetakeDiagnostic}>
          重新诊断
        </button>
      </div>

      {/* Subject Toggle */}
      <div className="subject-toggle" style={{ marginBottom: '1rem' }}>
        <div className="toggle-group">
          <button
            onClick={() => setActiveSubject('chinese')}
            className={`toggle-button ${activeSubject === 'chinese' ? 'active' : ''}`}
          >
            📖 语文写作
          </button>
          <button
            onClick={() => setActiveSubject('english')}
            className={`toggle-button ${activeSubject === 'english' ? 'active' : ''}`}
          >
            🔤 英语写作
          </button>
        </div>
      </div>

      {/* Quick action cards */}
      <div className="training-home-quick-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        {/* Model Essay entry */}
        {onOpenModelEssays && (
          <button
            onClick={onOpenModelEssays}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '1rem', borderRadius: '0.75rem',
              border: '1px solid var(--border-color)', background: 'var(--bg-card)',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>📚</span>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>范文赏析</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>阅读优秀范文</div>
            </div>
          </button>
        )}

        {/* Radar chart entry */}
        <button
          onClick={() => {
            const el = document.getElementById('radar-section')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '1rem', borderRadius: '0.75rem',
            border: '1px solid var(--border-color)', background: 'var(--bg-card)',
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>📊</span>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>能力雷达</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>查看综合能力</div>
          </div>
        </button>
      </div>

      {/* Grade-specific training section */}
      {gradeHeader && (
        <section className="training-section" style={{ ...gradeHeader.style, padding: '1rem 1.25rem' }}>
          <h3 className="training-section-title">
            {gradeHeader.icon} {gradeHeader.title}
            {grade && GRADE_LABELS[grade] && (
              <span className="grade-label">
                {GRADE_LABELS[grade]}
              </span>
            )}
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
              {subjectIcon} {subjectLabel}
            </span>
          </h3>
          {fallbackRecommendations.length > 0 ? (
            <div className="recommend-cards">
              {fallbackRecommendations.map((rec) => (
                <button
                  key={`${rec.subject}-${rec.level}`}
                  className="recommend-card"
                  onClick={() => onSelectTraining(rec.subject as 'chinese' | 'english', rec.level)}
                >
                  <div className="recommend-card-badge">
                    {rec.subject === 'chinese' ? '语文' : '英语'} L{rec.level}
                  </div>
                  <div className="recommend-card-title">{rec.label}</div>
                  <div className="recommend-card-cta">开始训练 →</div>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅</p>
              <p>今天已完成所有推荐训练！</p>
            </div>
          )}
        </section>
      )}

      {/* Weak points for active subject */}
      {subjectWeakPoints.length > 0 && (
        <section className="training-section">
          <h3 className="training-section-title">🎯 {subjectLabel}薄弱点</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {subjectWeakPoints.map((wp, idx) => {
              let subject: 'chinese' | 'english' = activeSubject
              let level = 1
              if (wp.recommendedTraining) {
                const parts = wp.recommendedTraining.split(':')
                if (parts.length === 2) {
                  subject = parts[0] as 'chinese' | 'english'
                  level = parseInt(parts[1], 10) || 1
                }
              }
              return (
                <div
                  key={`${wp.dimension}-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                  }}
                >
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: 'var(--accent-light)',
                    color: 'var(--accent)',
                    whiteSpace: 'nowrap',
                  }}>
                    {wp.dimension}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{wp.description}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                      出现 {wp.frequency} 次
                    </div>
                  </div>
                  {wp.recommendedTraining && (
                    <button
                      className="button button-primary button-small"
                      onClick={() => onSelectTraining(subject, level)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      去训练
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Progress for active subject */}
      <section className="training-section">
        <h3 className="training-section-title">{subjectIcon} {subjectLabel}进度</h3>
        <div className="progress-list">
          {progress.map((item) => (
            <ProgressRow
              key={item.level}
              item={item}
              onSelect={() => onSelectTraining(activeSubject, item.level)}
            />
          ))}
        </div>
      </section>

      {/* Radar chart */}
      <section className="training-section" id="radar-section">
        <h3 className="training-section-title">能力雷达图</h3>
        <div className="radar-section-card">
          <RadarChart data={abilityProfile} size={260} />
        </div>
      </section>
    </div>
  )
}
