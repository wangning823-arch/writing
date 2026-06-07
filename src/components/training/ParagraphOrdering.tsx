'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  PARAGRAPH_ORDER_EXERCISES,
  type ParagraphOrderExercise,
} from '@/lib/training/thinking-exercises'

interface ParagraphOrderingProps {
  topic: string
  subject: 'chinese' | 'english'
  initialDifficulty?: 'easy' | 'medium' | 'hard'
  onComplete: (score: number, difficulty: 'easy' | 'medium' | 'hard') => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const DIFFICULTY_CONFIG = {
  easy: { label: '基础', color: 'var(--success-dark)', bgColor: 'var(--success-light)', penaltyPerWrong: 20 },
  medium: { label: '进阶', color: 'var(--warning)', bgColor: 'var(--warning-light)', penaltyPerWrong: 15 },
  hard: { label: '挑战', color: 'var(--danger)', bgColor: 'var(--danger-light)', penaltyPerWrong: 12 },
}

export default function ParagraphOrdering({
  topic,
  subject,
  initialDifficulty,
  onComplete,
}: ParagraphOrderingProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(initialDifficulty || null)

  const availableExercises = useMemo(() => {
    return PARAGRAPH_ORDER_EXERCISES.filter((e) => e.subject === subject)
  }, [subject])

  const exercisesByDifficulty = useMemo(() => {
    return {
      easy: availableExercises.filter((e) => e.difficulty === 'easy'),
      medium: availableExercises.filter((e) => e.difficulty === 'medium'),
      hard: availableExercises.filter((e) => e.difficulty === 'hard'),
    }
  }, [availableExercises])

  const exercise = useMemo(() => {
    if (!selectedDifficulty) return null
    const candidates = exercisesByDifficulty[selectedDifficulty]
    if (candidates.length === 0) {
      // Fallback to any exercise of the subject
      return availableExercises[Math.floor(Math.random() * availableExercises.length)]
    }
    // Randomly select from available exercises in this difficulty
    return candidates[Math.floor(Math.random() * candidates.length)]
  }, [selectedDifficulty, exercisesByDifficulty, availableExercises])

  const [items, setItems] = useState<ParagraphOrderExercise['paragraphs']>([])
  const [submitted, setSubmitted] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  // Initialize items when exercise is selected
  useEffect(() => {
    if (exercise) {
      setItems(shuffle(exercise.paragraphs).map((p) => ({ ...p })))
      setSubmitted(false)
    }
  }, [exercise])

  const getPositionStatus = useCallback(
    (idx: number) => {
      if (!submitted) return 'pending'
      const item = items[idx]
      return item.correctPosition === idx + 1 ? 'correct' : 'wrong'
    },
    [submitted, items],
  )

  const handleDragStart = (idx: number) => setDragIdx(idx)

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault()
    if (dragIdx == null || dragIdx === targetIdx) return
    const next = [...items]
    const [moved] = next.splice(dragIdx, 1)
    next.splice(targetIdx, 0, moved)
    setItems(next)
    setDragIdx(targetIdx)
  }

  const handleDragEnd = () => setDragIdx(null)

  // Touch support
  const [touchIdx, setTouchIdx] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState(0)

  const handleTouchStart = (idx: number, e: React.TouchEvent) => {
    setTouchIdx(idx)
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchIdx === null) return
    e.preventDefault()
    const touch = e.touches[0]
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY)
    const targetEl = elements.find((el) => el.hasAttribute('data-index'))
    if (targetEl) {
      const targetIdx = parseInt(targetEl.getAttribute('data-index') || '0')
      if (targetIdx !== touchIdx) {
        const next = [...items]
        const [moved] = next.splice(touchIdx, 1)
        next.splice(targetIdx, 0, moved)
        setItems(next)
        setTouchIdx(targetIdx)
      }
    }
  }

  const handleTouchEnd = () => setTouchIdx(null)

  const config = selectedDifficulty ? DIFFICULTY_CONFIG[selectedDifficulty] : DIFFICULTY_CONFIG.easy

  const score = useMemo(() => {
    if (!submitted || !exercise) return 0
    let correct = 0
    for (let i = 0; i < items.length; i++) {
      if (items[i].correctPosition === i + 1) correct++
    }
    const total = items.length
    if (correct === total) return 100
    const misplaced = total - correct
    // Harder difficulty has lower penalty per wrong answer
    const penalty = config.penaltyPerWrong
    return Math.max(0, 100 - misplaced * penalty)
  }, [submitted, items, exercise, config])

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const handleComplete = () => {
    onComplete(score, selectedDifficulty || 'easy')
  }

  const correctOrder = useMemo(
    () =>
      exercise
        ? [...exercise.paragraphs].sort((a, b) => a.correctPosition - b.correctPosition)
        : [],
    [exercise],
  )

  const allCorrect = submitted && items.every((it, i) => it.correctPosition === i + 1)

  // Show difficulty selection if not selected
  if (!selectedDifficulty || !exercise) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--text-primary, #111827)',
              marginBottom: '0.5rem',
            }}
          >
            段落排序训练
          </h2>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary, #6b7280)',
            }}
          >
            {subject === 'chinese' ? '语文' : '英语'} &middot; 选择难度开始训练
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(['easy', 'medium', 'hard'] as const).map((diff) => {
            const diffConfig = DIFFICULTY_CONFIG[diff]
            const exerciseCount = exercisesByDifficulty[diff].length
            const paragraphCount = diff === 'easy' ? '5段' : diff === 'medium' ? '6段' : '7段（含干扰项）'
            return (
              <button
                key={diff}
                onClick={() => {
                  setSelectedDifficulty(diff)
                  // Reset items when changing difficulty
                  setItems([])
                }}
                style={{
                  padding: '1.25rem',
                  borderRadius: '0.75rem',
                  border: '2px solid var(--border-color, #e5e7eb)',
                  background: 'var(--bg-card, #fff)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = diffConfig.color
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color, #e5e7eb)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: diffConfig.bgColor,
                      color: diffConfig.color,
                    }}
                  >
                    {diffConfig.label}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)' }}>
                    {paragraphCount}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', margin: 0 }}>
                  {diff === 'easy'
                    ? '逻辑清晰，段落关系明确，适合初学者'
                    : diff === 'medium'
                      ? '段落增多，逻辑关系更复杂，需要仔细分析'
                      : '包含干扰项，需要辨别无关段落，最具挑战性'}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)', margin: '0.5rem 0 0' }}>
                  可用练习：{exerciseCount}篇
                </p>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <button
            onClick={() => {
              setSelectedDifficulty(null)
              setItems([])
              setSubmitted(false)
            }}
            style={{
              border: 'none',
              background: 'none',
              color: 'var(--text-tertiary, #9ca3af)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              padding: 0,
            }}
          >
            ← 返回
          </button>
          <span
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              background: config.bgColor,
              color: config.color,
            }}
          >
            {config.label}
          </span>
        </div>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--text-primary, #111827)',
            marginBottom: '0.5rem',
          }}
        >
          段落排序训练
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary, #6b7280)',
          }}
        >
          {subject === 'chinese' ? '语文' : '英语'} &middot; {exercise.topic}
        </p>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary, #6b7280)',
            marginTop: '0.5rem',
          }}
        >
          将下列{items.length}个段落按正确的逻辑顺序排列（拖拽调整顺序）
        </p>
      </div>

      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, idx) => {
          const status = getPositionStatus(idx)
          let borderColor = 'var(--border-color, #e5e7eb)'
          let bgColor = 'var(--bg-card, #fff)'
          if (status === 'correct') {
            borderColor = 'var(--success-dark)'
            bgColor = 'var(--success-light)'
          } else if (status === 'wrong') {
            borderColor = 'var(--danger)'
            bgColor = 'var(--danger-light)'
          }

          return (
            <div
              key={item.id}
              data-index={idx}
              draggable={!submitted}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(idx, e)}
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                border: `2px solid ${borderColor}`,
                background: bgColor,
                cursor: submitted ? 'default' : 'grab',
                opacity: dragIdx === idx || touchIdx === idx ? 0.5 : 1,
                transition: 'all 0.15s ease',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background:
                    status === 'correct'
                      ? 'var(--success-dark)'
                      : status === 'wrong'
                        ? 'var(--danger)'
                        : 'var(--bg-secondary, #f3f4f6)',
                  color: status === 'pending' ? 'var(--text-secondary, #6b7280)' : '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {status === 'correct' ? '✓' : status === 'wrong' ? '✗' : idx + 1}
              </span>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    color: 'var(--text-primary, #111827)',
                    margin: 0,
                  }}
                >
                  {item.content}
                </p>
                {submitted && status === 'wrong' && (
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: '#ef4444',
                      marginTop: '0.5rem',
                      margin: '0.5rem 0 0',
                    }}
                  >
                    正确位置：第{item.correctPosition}段
                  </p>
                )}
              </div>
              {!submitted && (
                <span
                  style={{
                    color: 'var(--text-tertiary, #9ca3af)',
                    fontSize: '1.25rem',
                    cursor: 'grab',
                    flexShrink: 0,
                  }}
                >
                  ⠿
                </span>
              )}
            </div>
          )
        })}
      </div>

      {!submitted ? (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            提交排序
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '1.5rem' }}>
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '0.75rem',
              background: allCorrect ? 'var(--success-light)' : score >= 70 ? 'var(--warning-light)' : 'var(--danger-light)',
              border: `1px solid ${allCorrect ? 'var(--success-dark)' : score >= 70 ? 'var(--warning)' : 'var(--danger)'}`,
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.75rem',
              }}
            >
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: allCorrect ? 'var(--success-dark)' : score >= 70 ? 'var(--warning)' : 'var(--danger)',
                }}
              >
                {score}分
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary, #6b7280)',
                }}
              >
                {allCorrect
                  ? '完美！顺序完全正确'
                  : score >= 70
                    ? '基本正确，部分段落需要调整'
                    : '需要重新思考段落间的逻辑关系'}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: '0.75rem',
              background: 'var(--bg-card, #fff)',
              border: '1px solid var(--border-color, #e5e7eb)',
              marginBottom: '1rem',
            }}
          >
            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-primary, #111827)',
                marginBottom: '0.75rem',
              }}
            >
              正确顺序
            </h3>
            <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
              {correctOrder.map((p, i) => (
                <li
                  key={p.id}
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    color: 'var(--text-primary, #111827)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {p.content}
                </li>
              ))}
            </ol>
          </div>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: '0.75rem',
              background: 'var(--bg-secondary, #f9fafb)',
              border: '1px solid var(--border-color, #e5e7eb)',
              marginBottom: '1.5rem',
            }}
          >
            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-primary, #111827)',
                marginBottom: '0.5rem',
              }}
            >
              逻辑关系解析
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.8,
                color: 'var(--text-secondary, #6b7280)',
                margin: 0,
              }}
            >
              {exercise.explanation}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleComplete}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              完成训练
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
