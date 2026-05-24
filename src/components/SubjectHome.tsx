'use client'

import React from 'react'
import { TrainingProgress, AbilityProfile, Stage } from '@/types'
import RadarChart from './training/RadarChart'
import DailyGoal from './training/DailyGoal'
import ErrorArchive from './training/ErrorArchive'

interface SubjectStats {
  totalCount: number
  monthlyCount: number
  streak: number
}

interface SubjectHomeProps {
  subject: 'chinese' | 'english'
  progress: TrainingProgress[]
  abilityProfile: AbilityProfile[]
  stage: Stage
  grade?: string
  stats?: SubjectStats
  achievements?: Array<{ name: string; icon: string }>
  weakPoints?: Array<{ dimension: string; description: string; frequency: number; recommendedTraining?: string }>
  errorRecords?: Array<{ errorType: string; subType?: string; location: string; explanation: string; severity: string; count: number }>
  dailyRecommendations?: Array<{ subject: string; level: number; label: string; estimatedMinutes: number }>
  onSelectTraining: (level: number) => void
  onBack: () => void
  onOpenModelEssays: () => void
  onRetakeDiagnostic: () => void
  onOpenThinkingTraining?: () => void
  onOpenMaterials?: () => void
  onOpenErrorCases?: () => void
}

const STAGE_META: Record<Stage, { icon: string; label: string; color: string }> = {
  sprout: { icon: '🌱', label: '萌芽期', color: '#22c55e' },
  growing: { icon: '🌿', label: '成长期', color: '#3b82f6' },
  thriving: { icon: '🌳', label: '成熟期', color: '#8b5cf6' },
}

const GRADE_LABELS: Record<string, string> = {
  '高一': '基础夯实',
  '高二': '针对性突破',
  '高三': '冲刺提分',
}

const GRADE_HEADERS: Record<string, { icon: string; title: string; style: React.CSSProperties }> = {
  '高一': { icon: '📚', title: '今日学习', style: { borderLeft: '3px solid #22c55e' } },
  '高二': { icon: '🎯', title: '重点突破', style: { borderLeft: '3px solid #3b82f6' } },
  '高三': { icon: '⚡', title: '今日冲刺', style: { borderLeft: '3px solid #f59e0b' } },
}

function LevelIcon({ completed, current, locked }: { completed: boolean; current: boolean; locked: boolean }) {
  if (locked) return <span className="level-icon level-locked">🔒</span>
  if (completed) return <span className="level-icon level-done">✓</span>
  if (current) return <span className="level-icon level-current">▶</span>
  return <span className="level-icon level-pending">○</span>
}

function ProgressRow({ item, onSelect }: { item: TrainingProgress; onSelect: () => void }) {
  const progressPct = item.completed ? 100 : item.current ? 50 : 0

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

export default function SubjectHome({
  subject,
  progress,
  abilityProfile,
  stage,
  grade,
  stats,
  achievements = [],
  weakPoints = [],
  errorRecords = [],
  dailyRecommendations = [],
  onSelectTraining,
  onBack,
  onOpenModelEssays,
  onRetakeDiagnostic,
  onOpenThinkingTraining,
  onOpenMaterials,
  onOpenErrorCases,
}: SubjectHomeProps) {
  const meta = STAGE_META[stage]
  const subjectLabel = subject === 'chinese' ? '语文写作' : '英语写作'
  const subjectIcon = subject === 'chinese' ? '📖' : '🔤'

  const gradeHeader = grade ? GRADE_HEADERS[grade] : null

  // Filter recommendations that match current subject
  const filteredRecommendations = dailyRecommendations.filter(r => r.subject === subject)

  return (
    <div className="training-home">
      {/* Header with back button */}
      <div className="subject-home-header">
        <button
          className="subject-home-back"
          onClick={onBack}
        >
          ← 返回
        </button>
        <h2 className="subject-home-title">
          {subjectIcon} {subjectLabel}
        </h2>
        <button className="button button-secondary button-small" onClick={onRetakeDiagnostic}>
          重新诊断
        </button>
      </div>

      {/* Per-subject stats with stage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{
          padding: '0.5rem', borderRadius: '0.5rem',
          border: '1px solid var(--border-color)', background: 'var(--bg-card)',
          textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: meta.color }}>{meta.icon} {meta.label}</div>
          <div style={{ fontSize: '0.675rem', color: 'var(--text-secondary)' }}>阶段</div>
        </div>
        {stats && <>
          <div style={{
            padding: '0.5rem', borderRadius: '0.5rem',
            border: '1px solid var(--border-color)', background: 'var(--bg-card)',
            textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>🔥 {stats.streak}</div>
            <div style={{ fontSize: '0.675rem', color: 'var(--text-secondary)' }}>连续训练</div>
          </div>
          <div style={{
            padding: '0.5rem', borderRadius: '0.5rem',
            border: '1px solid var(--border-color)', background: 'var(--bg-card)',
            textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>📝 {stats.monthlyCount}</div>
            <div style={{ fontSize: '0.675rem', color: 'var(--text-secondary)' }}>本月训练</div>
          </div>
          <div style={{
            padding: '0.5rem', borderRadius: '0.5rem',
            border: '1px solid var(--border-color)', background: 'var(--bg-card)',
            textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>🏆 {achievements.length}</div>
            <div style={{ fontSize: '0.675rem', color: 'var(--text-secondary)' }}>成就</div>
          </div>
        </>}
      </div>

      {/* Quick action cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
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
        <button
          onClick={() => document.getElementById('radar-section')?.scrollIntoView({ behavior: 'smooth' })}
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
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{subjectLabel}能力</div>
          </div>
        </button>
        {onOpenThinkingTraining && (
          <button
            onClick={onOpenThinkingTraining}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '1rem', borderRadius: '0.75rem',
              border: '1px solid var(--border-color)', background: 'var(--bg-card)',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🧠</span>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>思维训练</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>逻辑与分析能力</div>
            </div>
          </button>
        )}
        {onOpenMaterials && (
          <button
            onClick={onOpenMaterials}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '1rem', borderRadius: '0.75rem',
              border: '1px solid var(--border-color)', background: 'var(--bg-card)',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🗂️</span>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>素材库</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>论据名言好句</div>
            </div>
          </button>
        )}
        {onOpenErrorCases && (
          <button
            onClick={onOpenErrorCases}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '1rem', borderRadius: '0.75rem',
              border: '1px solid var(--border-color)', background: 'var(--bg-card)',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>📋</span>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>错误库</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>常见错误案例</div>
            </div>
          </button>
        )}
      </div>

      {/* Grade-specific training section */}
      {gradeHeader && (
        <section className="training-section" style={{ ...gradeHeader.style, padding: '1rem 1.25rem' }}>
          <h3 className="training-section-title">
            {gradeHeader.icon} {gradeHeader.title}
            {grade && GRADE_LABELS[grade] && (
              <span className="grade-label">{GRADE_LABELS[grade]}</span>
            )}
          </h3>
          {filteredRecommendations.length > 0 ? (
            <div className="recommend-cards">
              {filteredRecommendations.map((rec) => (
                <button
                  key={`${rec.subject}-${rec.level}`}
                  className="recommend-card"
                  onClick={() => onSelectTraining(rec.level)}
                >
                  <div className="recommend-card-badge">
                    L{rec.level}
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

      {/* Weak points */}
      {weakPoints.length > 0 && (
        <section className="training-section">
          <h3 className="training-section-title">🎯 薄弱点</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {weakPoints.map((wp, idx) => {
              let level = 1
              if (wp.recommendedTraining) {
                const parts = wp.recommendedTraining.split(':')
                if (parts.length === 2) level = parseInt(parts[1], 10) || 1
              }
              return (
                <div
                  key={`${wp.dimension}-${idx}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.75rem 1rem', borderRadius: '0.75rem',
                    border: '1px solid var(--border-color)', background: 'var(--bg-card)',
                  }}
                >
                  <span style={{
                    display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '0.375rem',
                    fontSize: '0.75rem', fontWeight: 600,
                    background: 'var(--accent-light)', color: 'var(--accent)', whiteSpace: 'nowrap',
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
                      onClick={() => onSelectTraining(level)}
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

      {/* Progress */}
      <section className="training-section">
        <h3 className="training-section-title">{subjectIcon} {subjectLabel}进度</h3>
        <div className="progress-list">
          {progress.map((item) => (
            <ProgressRow
              key={item.level}
              item={item}
              onSelect={() => onSelectTraining(item.level)}
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

      {/* Daily goal */}
      <DailyGoal
        grade={grade || '高一'}
        stage={stage}
        recommendations={filteredRecommendations}
        onStartTraining={(_subj: 'chinese' | 'english', level: number) => onSelectTraining(level)}
      />

      {/* Error archive */}
      {errorRecords.length > 0 && (
        <ErrorArchive errors={errorRecords} />
      )}
    </div>
  )
}
