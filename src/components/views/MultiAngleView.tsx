'use client'

import { useState, useEffect } from 'react'
import MultiAngleAnalysis from '@/components/training/MultiAngleAnalysis'

interface MultiAngleViewProps {
  onBack: () => void
  subject: 'chinese' | 'english'
}

interface Topic {
  topic: string
  description: string
}

export default function MultiAngleView({ onBack, subject }: MultiAngleViewProps) {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const generateTopic = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/generate-multi-angle-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || '生成题目失败')
        return
      }
      const data = await res.json()
      setSelectedTopic(data)
    } catch {
      setError('网络错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateTopic()
  }, [subject])

  const handleComplete = (score: number) => {
    // Auto switch to next random topic
    generateTopic()
  }

  if (selectedTopic) {
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
          {subject === 'chinese' ? '语文' : '英语'}多角度分析训练
        </h1>
        <MultiAngleAnalysis
          topic={selectedTopic.topic}
          subject={subject}
          onComplete={handleComplete}
        />
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
        {subject === 'chinese' ? '语文' : '英语'}多角度分析训练
      </h1>
      <p style={{ fontSize: '0.875rem', color: 'var(--theme_text-muted)', marginBottom: '24px' }}>
        AI正在为你生成分析题目...
      </p>

      <div
        style={{
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          background: 'var(--theme_bg)',
          textAlign: 'center',
        }}
      >
        {isLoading ? (
          <div>
            <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>⏳</div>
            <p style={{ color: 'var(--theme_text-muted)' }}>正在生成题目...</p>
          </div>
        ) : error ? (
          <div>
            <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>❌</div>
            <p style={{ color: 'var(--color-error)', marginBottom: '16px' }}>{error}</p>
            <button
              onClick={generateTopic}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--theme_button-primary)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              重试
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
