'use client'

import { useState, useEffect, useMemo } from 'react'
import ParagraphOrdering from '@/components/training/ParagraphOrdering'
import { PARAGRAPH_ORDER_EXERCISES } from '@/lib/training/thinking-exercises'

interface ParagraphOrderingViewProps {
  onBack: () => void
  subject: 'chinese' | 'english'
}

export default function ParagraphOrderingView({ onBack, subject }: ParagraphOrderingViewProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [key, setKey] = useState(0) // Force remount of ParagraphOrdering
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')

  // Get available topics for the subject
  const availableTopics = useMemo(() => {
    return PARAGRAPH_ORDER_EXERCISES
      .filter(e => e.subject === subject)
      .map(e => e.topic)
  }, [subject])

  // Randomly select a topic on mount
  useEffect(() => {
    if (availableTopics.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTopics.length)
      setSelectedTopic(availableTopics[randomIndex])
    }
  }, []) // Only run on mount

  const handleComplete = (score: number, completedDifficulty: 'easy' | 'medium' | 'hard') => {
    // Remember difficulty for next question
    setDifficulty(completedDifficulty)
    // Auto switch to next random topic
    if (availableTopics.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTopics.length)
      setSelectedTopic(availableTopics[randomIndex])
      setKey(prev => prev + 1) // Force remount
    }
  }

  if (!selectedTopic) {
    return (
      <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            border: 'none',
            background: 'none',
            color: 'var(--theme_text-weak)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            marginBottom: '12px',
            padding: 0,
          }}
        >
          ← 返回
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '24px' }}>
          {subject === 'chinese' ? '语文' : '英语'}段落排序训练
        </h1>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--theme_text-muted)' }}>正在准备题目...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={onBack}
        style={{
          border: 'none',
          background: 'none',
          color: 'var(--theme_text-weak)',
          cursor: 'pointer',
          fontSize: '0.875rem',
          marginBottom: '12px',
          padding: 0,
        }}
      >
        ← 返回
      </button>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '8px' }}>
        {subject === 'chinese' ? '语文' : '英语'}段落排序训练
      </h1>
      <p style={{ fontSize: '0.875rem', color: 'var(--theme_text-muted)', marginBottom: '24px' }}>
        将段落按正确的逻辑顺序排列
      </p>

      <ParagraphOrdering
        key={key}
        topic={selectedTopic}
        subject={subject}
        initialDifficulty={difficulty}
        onComplete={handleComplete}
      />
    </div>
  )
}
