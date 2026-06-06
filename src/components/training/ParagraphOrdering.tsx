'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  PARAGRAPH_ORDER_EXERCISES,
  type ParagraphOrderExercise,
} from '@/lib/training/thinking-exercises'

interface ParagraphOrderingProps {
  topic: string
  subject: 'chinese' | 'english'
  onComplete: (score: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ParagraphOrdering({
  topic,
  subject,
  onComplete,
}: ParagraphOrderingProps) {
  const exercise = useMemo(() => {
    const candidates = PARAGRAPH_ORDER_EXERCISES.filter(
      (e) => e.subject === subject && e.topic === topic,
    )
    if (candidates.length > 0) return candidates[0]
    const subjectExercises = PARAGRAPH_ORDER_EXERCISES.filter(
      (e) => e.subject === subject,
    )
    return subjectExercises[Math.floor(Math.random() * subjectExercises.length)]
  }, [topic, subject])

  const [items, setItems] = useState(() =>
    shuffle(exercise.paragraphs).map((p) => ({ ...p })),
  )
  const [submitted, setSubmitted] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)

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

  const score = useMemo(() => {
    if (!submitted) return 0
    let correct = 0
    for (let i = 0; i < items.length; i++) {
      if (items[i].correctPosition === i + 1) correct++
    }
    const total = items.length
    if (correct === total) return 100
    const misplaced = total - correct
    return Math.max(0, 100 - misplaced * 20)
  }, [submitted, items])

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const correctOrder = useMemo(
    () =>
      [...exercise.paragraphs].sort(
        (a, b) => a.correctPosition - b.correctPosition,
      ),
    [exercise],
  )

  const allCorrect = submitted && items.every((it, i) => it.correctPosition === i + 1)

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
          {subject === 'chinese' ? '语文' : '英语'} &middot; {exercise.topic}
        </p>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary, #6b7280)',
            marginTop: '0.5rem',
          }}
        >
          将下列段落按正确的逻辑顺序排列（拖拽调整顺序）
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
              draggable={!submitted}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                border: `2px solid ${borderColor}`,
                background: bgColor,
                cursor: submitted ? 'default' : 'grab',
                opacity: dragIdx === idx ? 0.5 : 1,
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
              background: allCorrect ? 'var(--success-light)' : 'var(--warning-light)',
              border: `1px solid ${allCorrect ? 'var(--success-dark)' : 'var(--warning)'}`,
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
                  color: allCorrect ? 'var(--success-dark)' : 'var(--warning)',
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
                {allCorrect ? '完美！顺序完全正确' : '部分段落位置不正确'}
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
              onClick={() => onComplete(score)}
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
