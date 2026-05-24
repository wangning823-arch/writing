'use client'

import React from 'react'
import { TrainingProgress, AbilityProfile, Stage } from '@/types'

interface LandingPageProps {
  chineseProgress: TrainingProgress[]
  englishProgress: TrainingProgress[]
  chineseAbilityProfile: AbilityProfile[]
  englishAbilityProfile: AbilityProfile[]
  chineseStage: Stage
  englishStage: Stage
  grade?: string
  onSelectSubject: (subject: 'chinese' | 'english') => void
  onDiagnostic: (subject: 'chinese' | 'english') => void
  onSelectGrade: () => void
}

const STAGE_META: Record<Stage, { icon: string; label: string; color: string }> = {
  sprout: { icon: '🌱', label: '萌芽期', color: '#22c55e' },
  growing: { icon: '🌿', label: '成长期', color: '#3b82f6' },
  thriving: { icon: '🌳', label: '成熟期', color: '#8b5cf6' },
}

function getProgressSummary(progress: TrainingProgress[]) {
  const completed = progress.filter(p => p.completed).length
  const current = progress.find(p => p.current)
  return {
    completedCount: completed,
    totalLevels: progress.length,
    currentLabel: current?.label || (completed === progress.length ? '全部完成' : '尚未开始'),
  }
}

export default function LandingPage({
  chineseProgress,
  englishProgress,
  chineseAbilityProfile,
  englishAbilityProfile,
  chineseStage,
  englishStage,
  grade,
  onSelectSubject,
  onDiagnostic,
  onSelectGrade,
}: LandingPageProps) {
  const cnSummary = getProgressSummary(chineseProgress)
  const enSummary = getProgressSummary(englishProgress)

  const cnStageMeta = STAGE_META[chineseStage]
  const enStageMeta = STAGE_META[englishStage]

  return (
    <div className="landing-container">
      {/* Action bar */}
      <div className="stage-badge-bar">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {grade && (
            <button className="button button-secondary button-small" onClick={onSelectGrade}>
              {grade === '高一' ? '📚' : grade === '高二' ? '🎯' : '⚡'} {grade}
            </button>
          )}
        </div>
      </div>

      {/* Subject Entry Cards */}
      <div className="landing-cards">
        {/* Chinese Card */}
        <button
          className="landing-card"
          onClick={() => onSelectSubject('chinese')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div className="landing-card-icon">📖</div>
            <span style={{
              fontSize: '0.75rem', fontWeight: 500, padding: '0.25rem 0.5rem',
              borderRadius: '1rem', background: `${cnStageMeta.color}15`, color: cnStageMeta.color,
            }}>
              {cnStageMeta.icon} {cnStageMeta.label}
            </span>
          </div>
          <div className="landing-card-title">语文写作</div>
          <div className="landing-card-level">
            {cnSummary.completedCount}/{cnSummary.totalLevels} 关卡已完成
          </div>
          <div className="landing-card-progress">
            <div className="progress-bar-track" style={{ width: '100%', marginTop: '0.5rem' }}>
              <div
                className="progress-bar-fill progress-bar-active"
                style={{ width: `${(cnSummary.completedCount / cnSummary.totalLevels) * 100}%` }}
              />
            </div>
          </div>
          <div className="landing-card-current">{cnSummary.currentLabel}</div>
        </button>

        {/* English Card */}
        <button
          className="landing-card"
          onClick={() => onSelectSubject('english')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div className="landing-card-icon">🔤</div>
            <span style={{
              fontSize: '0.75rem', fontWeight: 500, padding: '0.25rem 0.5rem',
              borderRadius: '1rem', background: `${enStageMeta.color}15`, color: enStageMeta.color,
            }}>
              {enStageMeta.icon} {enStageMeta.label}
            </span>
          </div>
          <div className="landing-card-title">英语写作</div>
          <div className="landing-card-level">
            {enSummary.completedCount}/{enSummary.totalLevels} 关卡已完成
          </div>
          <div className="landing-card-progress">
            <div className="progress-bar-track" style={{ width: '100%', marginTop: '0.5rem' }}>
              <div
                className="progress-bar-fill progress-bar-active"
                style={{ width: `${(enSummary.completedCount / enSummary.totalLevels) * 100}%` }}
              />
            </div>
          </div>
          <div className="landing-card-current">{enSummary.currentLabel}</div>
        </button>
      </div>

      {/* Per-subject diagnostic buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <button
          className="button button-secondary"
          onClick={() => onDiagnostic('chinese')}
          style={{ flex: 1 }}
        >
          📖 语文诊断
        </button>
        <button
          className="button button-secondary"
          onClick={() => onDiagnostic('english')}
          style={{ flex: 1 }}
        >
          🔤 英语诊断
        </button>
      </div>
    </div>
  )
}
