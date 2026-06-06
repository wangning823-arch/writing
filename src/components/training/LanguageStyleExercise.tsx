'use client'

import { useState } from 'react'
import { LANGUAGE_STYLE_EXERCISES } from '@/lib/training/language-style-exercises'
import ReviewStreamPanel from '@/components/ai/ReviewStreamPanel'

interface LanguageStyleExerciseProps {
  subject: 'chinese' | 'english'
  onComplete?: (result: any) => void
  onBack?: () => void
}

export default function LanguageStyleExercise({ subject, onComplete, onBack }: LanguageStyleExerciseProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [response, setResponse] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [loading, setLoading] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [streamError, setStreamError] = useState<string | null>(null)

  const exercises = LANGUAGE_STYLE_EXERCISES.filter(e => e.subject === subject)
  const exercise = exercises[currentIdx]
  if (!exercise) return null

  const handleSubmit = async () => {
    if (!response.trim()) return
    setLoading(true)
    setStreamText('')
    setStreamError(null)
    try {
      const res = await fetch('/api/ai/rhetoric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: exercise.type === 'identification' ? 'recognition' : 'imitation',
          exercisePrompt: exercise.prompt,
          response,
          rhetoricType: '语言风格',
          subject,
          stream: true,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setStreamError(data.error || '分析失败')
        setLoading(false)
        return
      }
      const reader = res.body?.getReader()
      if (!reader) { setStreamError('无法读取响应流'); setLoading(false); return }
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue
          try {
            const event = JSON.parse(data)
            if (event.type === 'chunk') setStreamText(prev => prev + event.text)
            else if (event.type === 'result') { setShowAnalysis(true); onComplete?.(event.data) }
            else if (event.type === 'error') setStreamError(event.message)
          } catch {}
        }
      }
    } catch {
      setStreamError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '1.5rem' }}>
        <ReviewStreamPanel
          text={streamText}
          error={streamError}
          onRetry={streamError ? () => { setLoading(false); setStreamText(''); setStreamError(null) } : undefined}
        />
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
        语言风格训练
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1rem' }}>
        识别、模仿、分析不同语言风格
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', background: 'var(--purple-light)', color: 'var(--purple)' }}>
          {exercise.type === 'identification' ? '风格识别' : exercise.type === 'imitation' ? '风格模仿' : '风格分析'}
        </span>
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #9ca3af)' }}>
          {exercise.difficulty === 'easy' ? '基础' : exercise.difficulty === 'medium' ? '进阶' : '挑战'}
        </span>
      </div>

      {exercise.originalText && (
        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', margin: '0 0 0.5rem' }}>原文：</p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary, #111827)', margin: 0, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {exercise.originalText}
          </p>
        </div>
      )}

      <p style={{ fontSize: '0.875rem', color: 'var(--text-primary, #111827)', marginBottom: '0.75rem' }}>{exercise.prompt}</p>

      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        rows={6}
        placeholder="请写下你的分析或仿写..."
        style={{
          width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
          border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
          fontSize: '0.875rem', color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '1rem',
        }}
      />

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => { setCurrentIdx(Math.max(0, currentIdx - 1)); setResponse(''); setShowAnalysis(false) }}
          disabled={currentIdx === 0}
          style={{
            padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)',
            background: 'var(--bg-card, #fff)',
            color: currentIdx === 0 ? 'var(--text-tertiary, #9ca3af)' : 'var(--text-primary, #111827)',
            cursor: currentIdx === 0 ? 'not-allowed' : 'pointer', fontSize: '0.875rem',
          }}
        >
          ← 上一题
        </button>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {currentIdx < exercises.length - 1 && (
            <button
              onClick={() => { setCurrentIdx(currentIdx + 1); setResponse(''); setShowAnalysis(false) }}
              style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              下一题
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!response.trim() || loading}
            style={{
              padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none',
              background: response.trim() && !loading ? '#3b82f6' : '#9ca3af',
              color: '#fff', cursor: response.trim() && !loading ? 'pointer' : 'not-allowed', fontSize: '0.875rem', fontWeight: 500,
            }}
          >
            {loading ? '分析中...' : '提交分析'}
          </button>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)', marginTop: '1rem' }}>
        {currentIdx + 1} / {exercises.length}
      </p>
    </div>
  )
}
