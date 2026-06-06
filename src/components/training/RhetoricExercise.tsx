'use client'

import { useState } from 'react'
import { RHETORIC_EXERCISES, type RhetoricExercise } from '@/lib/training/rhetoric-exercises'
import ScoreResultPanel from './ScoreResultPanel'
import ReviewStreamPanel from '@/components/ai/ReviewStreamPanel'

interface RhetoricExerciseProps {
  subject: 'chinese' | 'english'
  onComplete: (result: any) => void
  onBack: () => void
  userId?: string
}

const TYPE_LABELS = { recognition: '识别', imitation: '仿写', application: '应用' }
const TYPE_COLORS = { recognition: { bg: 'var(--accent-light)', text: 'var(--primary-600)' }, imitation: { bg: 'var(--success-light)', text: 'var(--success-dark)' }, application: { bg: 'var(--warning-light)', text: 'var(--warning-dark)' } }

export default function RhetoricExerciseComponent({ subject, onComplete, onBack, userId }: RhetoricExerciseProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [response, setResponse] = useState('')
  const [selectedRecognition, setSelectedRecognition] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [streamText, setStreamText] = useState('')
  const [streamError, setStreamError] = useState<string | null>(null)

  const exercise = RHETORIC_EXERCISES[currentIdx]
  if (!exercise) return null

  const tc = TYPE_COLORS[exercise.type]

  const handleSubmit = async () => {
    if (exercise.type === 'recognition') {
      setShowResult(true)
      return
    }
    if (!response.trim()) return
    setIsAnalyzing(true)
    setStreamText('')
    setStreamError(null)
    try {
      const res = await fetch('/api/ai/rhetoric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercise, response, userId, stream: true }),
      })
      if (!res.ok) {
        const data = await res.json()
        setStreamError(data.error || '分析失败')
        setIsAnalyzing(false)
        return
      }
      const reader = res.body?.getReader()
      if (!reader) { setStreamError('无法读取响应流'); setIsAnalyzing(false); return }
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
            else if (event.type === 'result') { setResult(event.data); onComplete(event.data) }
            else if (event.type === 'error') setStreamError(event.message)
          } catch {}
        }
      }
    } catch {
      setStreamError('网络错误，请重试')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNext = () => {
    if (currentIdx < RHETORIC_EXERCISES.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setResponse('')
      setSelectedRecognition('')
      setShowResult(false)
    }
  }

  if (isAnalyzing) {
    return (
      <div style={{ padding: '1.5rem' }}>
        <ReviewStreamPanel
          text={streamText}
          error={streamError}
          onRetry={streamError ? () => { setIsAnalyzing(false); setStreamText(''); setStreamError(null) } : undefined}
        />
      </div>
    )
  }

  if (result) {
    return (
      <ScoreResultPanel
        overallScore={result.overallScore || 0}
        summary={result.summary}
        strengths={result.strengths}
        suggestions={result.suggestions}
        scoringCriteria={result.scoringCriteria}
        referenceAnswer={result.referenceAnswer}
        exampleVariants={result.exampleVariants}
        hasNext={currentIdx < RHETORIC_EXERCISES.length - 1}
        onNext={() => { setCurrentIdx(currentIdx + 1); setResponse(''); setSelectedRecognition(''); setShowResult(false); setResult(null); setStreamText(''); setStreamError(null) }}
        onRetry={() => { setResponse(''); setSelectedRecognition(''); setShowResult(false); setResult(null); setStreamText(''); setStreamError(null) }}
      />
    )
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.125rem 0.5rem', borderRadius: '9999px', background: tc.bg, color: tc.text }}>
          {TYPE_LABELS[exercise.type]}
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>
          {exercise.rhetoricType}
        </span>
      </div>

      <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary, #111827)', margin: 0, fontWeight: 500 }}>{exercise.prompt}</p>
        {exercise.originalText && (
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary, #111827)', margin: '0.75rem 0 0', lineHeight: 1.8, padding: '0.75rem', background: 'var(--bg-card, #fff)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)' }}>
            {exercise.originalText}
          </p>
        )}
      </div>

      {exercise.type === 'recognition' ? (
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={selectedRecognition}
            onChange={(e) => setSelectedRecognition(e.target.value)}
            placeholder="请输入你识别出的修辞手法..."
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
              fontSize: '0.875rem', color: 'var(--text-primary, #111827)', boxSizing: 'border-box',
            }}
          />
          {showResult && (
            <div style={{
              marginTop: '0.75rem', padding: '1rem', borderRadius: '0.5rem',
              background: selectedRecognition === exercise.rhetoricType ? 'var(--success-light)' : 'var(--warning-light)',
              border: `1px solid ${selectedRecognition === exercise.rhetoricType ? 'var(--success-border)' : 'var(--warning-border)'}`,
            }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: selectedRecognition === exercise.rhetoricType ? 'var(--success-dark)' : 'var(--warning-dark)', margin: '0 0 0.5rem' }}>
                {selectedRecognition === exercise.rhetoricType ? '回答正确！' : `正确答案：${exercise.rhetoricType}`}
              </p>
              {exercise.modelAnswer && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', margin: 0 }}>{exercise.modelAnswer}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          rows={6}
          placeholder="请写下你的仿写或应用..."
          style={{
            width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
            border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
            fontSize: '0.875rem', color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '1rem',
          }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => { setCurrentIdx(Math.max(0, currentIdx - 1)); setResponse(''); setSelectedRecognition(''); setShowResult(false) }}
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
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {showResult && currentIdx < RHETORIC_EXERCISES.length - 1 && (
            <button onClick={handleNext} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)', cursor: 'pointer', fontSize: '0.875rem' }}>
              下一题
            </button>
          )}
          {!showResult && (
            <button
              onClick={handleSubmit}
              disabled={(exercise.type !== 'recognition' && !response.trim()) || isAnalyzing}
              style={{
                padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none',
                background: (exercise.type === 'recognition' || (response.trim() && !isAnalyzing)) ? '#3b82f6' : '#9ca3af',
                color: '#fff', cursor: (exercise.type === 'recognition' || (response.trim() && !isAnalyzing)) ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem', fontWeight: 500,
              }}
            >
              {isAnalyzing ? '分析中...' : exercise.type === 'recognition' ? '确认' : '提交分析'}
            </button>
          )}
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)', marginTop: '1rem' }}>
        {currentIdx + 1} / {RHETORIC_EXERCISES.length}
      </p>
    </div>
  )
}
