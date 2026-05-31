'use client'

import { useState } from 'react'
import { LOGIC_EXERCISES, type LogicExercise } from '@/lib/training/logic-exercises'
import ScoreResultPanel from './ScoreResultPanel'
import ReviewStreamPanel from '@/components/ai/ReviewStreamPanel'

interface LogicReasoningProps {
  subject: 'chinese' | 'english'
  onComplete: (result: any) => void
  onBack: () => void
  userId?: string
}

const TYPE_LABELS: Record<string, string> = {
  'causal-chain': '因果链训练',
  'analogy': '类比推理',
  'fallacy-identification': '谬误识别',
}

export default function LogicReasoning({ subject, onComplete, onBack, userId }: LogicReasoningProps) {
  const exercises = LOGIC_EXERCISES.filter((e) => e.subject === subject)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [response, setResponse] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showShortWarning, setShowShortWarning] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [streamError, setStreamError] = useState<string | null>(null)

  const exercise = exercises[currentIdx]
  if (!exercise) return <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>暂无可用练习</p>

  const isMultipleChoice = exercise.options && exercise.options.length > 0

  const handleSubmit = async () => {
    if (isMultipleChoice && selectedOption === null) return
    if (!isMultipleChoice && !response.trim()) return

    if (!isMultipleChoice && response.trim().length < 10) {
      setShowShortWarning(true)
      return
    }
    setShowShortWarning(false)

    if (isMultipleChoice) {
      setShowExplanation(true)
      return
    }

    setIsAnalyzing(true)
    setStreamText('')
    setStreamError(null)
    try {
      const res = await fetch('/api/ai/logic-reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercise, response, userId, subject, stream: true }),
      })

      if (!res.ok) {
        const data = await res.json()
        setStreamError(data.error || '分析失败')
        setIsAnalyzing(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setStreamError('无法读取响应流')
        setIsAnalyzing(false)
        return
      }

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
            if (event.type === 'chunk') {
              setStreamText(prev => prev + event.text)
            } else if (event.type === 'result') {
              setResult(event.data)
              onComplete(event.data)
            } else if (event.type === 'error') {
              setStreamError(event.message)
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (e) {
      console.error('Logic reasoning fetch error:', e)
      setStreamError('网络错误，请重试')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNext = () => {
    if (currentIdx < exercises.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setSelectedOption(null)
      setResponse('')
      setShowExplanation(false)
    }
  }

  const isCorrect = isMultipleChoice && selectedOption === exercise.correctAnswer

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
        onNext={() => { setCurrentIdx(currentIdx + 1); setSelectedOption(null); setResponse(''); setShowExplanation(false); setResult(null); setStreamText(''); setStreamError(null) }}
        onRetry={() => { setSelectedOption(null); setResponse(''); setShowExplanation(false); setResult(null); setStreamText(''); setStreamError(null) }}
      />
    )
  }

  // Streaming in progress
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
        <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.125rem 0.5rem', borderRadius: '9999px', background: '#fef2f2', color: '#dc2626' }}>
          {TYPE_LABELS[exercise.type]}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)' }}>
          {exercise.difficulty === 'easy' ? '基础' : exercise.difficulty === 'medium' ? '进阶' : '挑战'}
        </span>
      </div>

      <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary, #111827)', margin: 0, fontWeight: 500 }}>{exercise.prompt}</p>
        {exercise.context && (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', margin: '0.5rem 0 0', fontStyle: 'italic', lineHeight: 1.6 }}>
            {exercise.context}
          </p>
        )}
      </div>

      {isMultipleChoice ? (
        <div style={{ marginBottom: '1rem' }}>
          {exercise.options!.map((opt, i) => (
            <button
              key={i}
              onClick={() => !showExplanation && setSelectedOption(i)}
              style={{
                display: 'block', width: '100%', padding: '0.75rem 1rem', marginBottom: '0.5rem',
                borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.875rem',
                border: '1px solid',
                borderColor: showExplanation && i === exercise.correctAnswer ? '#16a34a' :
                  showExplanation && i === selectedOption && !isCorrect ? '#dc2626' :
                  selectedOption === i ? '#3b82f6' : 'var(--border-color, #e5e7eb)',
                background: showExplanation && i === exercise.correctAnswer ? '#f0fdf4' :
                  showExplanation && i === selectedOption && !isCorrect ? '#fef2f2' :
                  selectedOption === i ? '#eff6ff' : 'var(--bg-card, #fff)',
                color: 'var(--text-primary, #111827)',
                cursor: showExplanation ? 'default' : 'pointer',
              }}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
        </div>
      ) : (
        <>
          <textarea
            value={response}
            onChange={(e) => { setResponse(e.target.value); setShowShortWarning(false) }}
            rows={6}
            placeholder="请写下你的分析（至少10个字）..."
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              border: showShortWarning ? '1px solid #dc2626' : '1px solid var(--border-color, #e5e7eb)',
              background: 'var(--bg-card, #fff)',
              fontSize: '0.875rem', color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '0.5rem',
            }}
          />
          {showShortWarning && (
            <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: '0 0 0.75rem' }}>回答内容过短，请至少写10个字</p>
          )}
        </>
      )}

      {showExplanation && (
        <div style={{
          padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem',
          background: isCorrect ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}`,
        }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: isCorrect ? '#16a34a' : '#dc2626', margin: '0 0 0.5rem' }}>
            {isCorrect ? '回答正确！' : '回答有误'}
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', margin: 0, lineHeight: 1.6 }}>
            {exercise.explanation}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => { setCurrentIdx(Math.max(0, currentIdx - 1)); setSelectedOption(null); setResponse(''); setShowExplanation(false) }}
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
          {showExplanation && currentIdx < exercises.length - 1 && (
            <button onClick={handleNext} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)', cursor: 'pointer', fontSize: '0.875rem' }}>
              下一题
            </button>
          )}
          {!showExplanation && (
            <button
              onClick={handleSubmit}
              disabled={(isMultipleChoice && selectedOption === null) || (!isMultipleChoice && !response.trim()) || isAnalyzing}
              style={{
                padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none',
                background: ((isMultipleChoice && selectedOption !== null) || (!isMultipleChoice && response.trim())) && !isAnalyzing ? '#3b82f6' : '#9ca3af',
                color: '#fff', cursor: ((isMultipleChoice && selectedOption !== null) || (!isMultipleChoice && response.trim())) && !isAnalyzing ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem', fontWeight: 500,
              }}
            >
              {isAnalyzing ? '分析中...' : '确认'}
            </button>
          )}
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)', marginTop: '1rem' }}>
        {currentIdx + 1} / {exercises.length}
      </p>
    </div>
  )
}
