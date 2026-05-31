'use client'

import { useState } from 'react'
import { DIALECTICAL_EXERCISES, type DialecticalExercise } from '@/lib/training/dialectical-exercises'
import ScoreResultPanel from './ScoreResultPanel'
import ReviewStreamPanel from '@/components/ai/ReviewStreamPanel'

interface DialecticalThinkingProps {
  subject: 'chinese' | 'english'
  onComplete: (result: any) => void
  onBack: () => void
  userId?: string
}

export default function DialecticalThinking({ subject, onComplete, onBack, userId }: DialecticalThinkingProps) {
  const exercises = DIALECTICAL_EXERCISES.filter((e) => e.subject === subject)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [responseA, setResponseA] = useState('')
  const [responseB, setResponseB] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [streamText, setStreamText] = useState('')
  const [streamError, setStreamError] = useState<string | null>(null)

  const exercise = exercises[currentIdx]
  if (!exercise) return <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>暂无可用练习</p>

  const handleSubmit = async () => {
    if (!responseA.trim() || !responseB.trim()) return
    setIsAnalyzing(true)
    setStreamText('')
    setStreamError(null)
    try {
      const res = await fetch('/api/ai/dialectical-thinking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercise, responseA, responseB, userId, subject, stream: true }),
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

  const isProCon = exercise.type === 'pro-con'
  const labelA = isProCon ? '支持方论证' : '诚然...'
  const labelB = isProCon ? '反对方论证' : '但是...'

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
        hasNext={currentIdx < exercises.length - 1}
        onNext={() => { setCurrentIdx(currentIdx + 1); setResponseA(''); setResponseB(''); setResult(null); setStreamText(''); setStreamError(null) }}
        onRetry={() => { setResponseA(''); setResponseB(''); setResult(null); setStreamText(''); setStreamError(null) }}
      />
    )
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

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.125rem 0.5rem', borderRadius: '9999px', background: '#fffbeb', color: '#d97706' }}>
          {exercise.difficulty === 'easy' ? '基础' : exercise.difficulty === 'medium' ? '进阶' : '挑战'}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)' }}>
          {isProCon ? '正反论证' : '让步转折'}
        </span>
      </div>

      <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary, #111827)', margin: '0 0 0.5rem' }}>{exercise.topic}</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', margin: 0, lineHeight: 1.6 }}>{exercise.prompt}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.5rem' }}>{labelA}</label>
          <textarea
            value={responseA}
            onChange={(e) => setResponseA(e.target.value)}
            rows={6}
            placeholder={isProCon ? '请写出支持该观点的论证...' : '请先承认对方观点的合理性...'}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
              fontSize: '0.875rem', color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.5rem' }}>{labelB}</label>
          <textarea
            value={responseB}
            onChange={(e) => setResponseB(e.target.value)}
            rows={6}
            placeholder={isProCon ? '请写出反对该观点的论证...' : '请提出你的反驳或不同看法...'}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
              fontSize: '0.875rem', color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => { setCurrentIdx(Math.max(0, currentIdx - 1)); setResponseA(''); setResponseB('') }}
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
          {currentIdx < exercises.length - 1 && (
            <button
              onClick={() => { setCurrentIdx(currentIdx + 1); setResponseA(''); setResponseB('') }}
              style={{
                padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)',
                background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)', cursor: 'pointer', fontSize: '0.875rem',
              }}
            >
              下一题
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!responseA.trim() || !responseB.trim() || isAnalyzing}
            style={{
              padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none',
              background: responseA.trim() && responseB.trim() && !isAnalyzing ? '#3b82f6' : '#9ca3af',
              color: '#fff', cursor: responseA.trim() && responseB.trim() && !isAnalyzing ? 'pointer' : 'not-allowed',
              fontSize: '0.875rem', fontWeight: 500,
            }}
          >
            {isAnalyzing ? '分析中...' : '提交分析'}
          </button>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)', marginTop: '1rem' }}>
        {currentIdx + 1} / {exercises.length}
      </p>
    </div>
  )
}
