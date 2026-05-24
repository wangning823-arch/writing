'use client'

import React, { useState } from 'react'

interface GradeOption {
  grade: string
  label: string
  description: string
}

const GRADES: GradeOption[] = [
  {
    grade: '高一',
    label: '高一',
    description: '夯实写作基础，掌握审题立意、段落构建等核心技能',
  },
  {
    grade: '高二',
    label: '高二',
    description: '针对性突破薄弱环节，提升论证逻辑和语言表达能力',
  },
  {
    grade: '高三',
    label: '高三',
    description: '冲刺提分，强化限时训练和应试技巧，冲刺高分',
  },
]

interface GradeSelectorProps {
  onComplete: (grade: string) => void
  onSkip: () => void
  userId?: string
}

export default function GradeSelector({ onComplete, onSkip, userId = 'demo-user' }: GradeSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = async (grade: string) => {
    setSelected(grade)
    // Save to localStorage
    localStorage.setItem('bifeng-grade', grade)
    // Save to API
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, grade }),
      })
    } catch {
      // API save is best-effort; localStorage is the primary store
    }
    onComplete(grade)
  }

  return (
    <div className="grade-selector">
      <h2>选择你的年级</h2>
      <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        根据你的年级，我们将为你推荐合适的训练内容
      </p>

      {GRADES.map((option) => (
        <button
          key={option.grade}
          className={`grade-option ${selected === option.grade ? 'grade-option-selected' : ''}`}
          onClick={() => handleSelect(option.grade)}
          disabled={selected !== null}
        >
          <div className="grade-option-title">{option.label}</div>
          <div className="grade-option-desc">{option.description}</div>
        </button>
      ))}

      <button
        onClick={onSkip}
        style={{
          display: 'block',
          width: '100%',
          marginTop: '0.5rem',
          padding: '0.75rem',
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          fontSize: '0.8125rem',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        跳过，使用默认年级
      </button>
    </div>
  )
}
