'use client'

import { useState } from 'react'
import { SENTENCE_EXERCISES, type SentenceExercise } from '@/lib/training/sentence-exercises'
import ReviewStreamPanel from '@/components/ai/ReviewStreamPanel'

interface SentenceTransformationProps {
  subject: 'chinese' | 'english'
  onComplete: (result: any) => void
  onBack: () => void
  userId?: string
}

interface AnalysisResult {
  overallScore: number
  transformScore: number
  languageScore: number
  rhetoricScore: number
  scoringCriteria?: {
    transform: string
    language: string
    rhetoric: string
  }
  strengths: string[]
  suggestions: string[]
  referenceAnswer: string
  exampleVariants?: string[]
  summary?: string
}

const TYPE_LABELS: Record<string, string> = {
  'long-short': '长短句变换',
  'integrated-scattered': '整散句变换',
  'inversion': '倒装句训练',
  'upgrade': '句式升级',
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)' }}>{label}</span>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626' }}>{score}</span>
      </div>
      <div style={{ height: '6px', borderRadius: '3px', background: 'var(--bg-secondary, #f3f4f6)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, borderRadius: '3px', background: score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626', transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}

export default function SentenceTransformation({ subject, onComplete, onBack, userId }: SentenceTransformationProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [response, setResponse] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [streamText, setStreamText] = useState('')
  const [streamError, setStreamError] = useState<string | null>(null)

  const exercise = SENTENCE_EXERCISES[currentIdx]
  if (!exercise) return null

  const handleSubmit = async () => {
    if (!response.trim() || response.trim().length < 4) return
    setIsAnalyzing(true)
    setStreamText('')
    setStreamError(null)
    try {
      const res = await fetch('/api/ai/sentence-transformation', {
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
    setCurrentIdx(currentIdx + 1)
    setResponse('')
    setResult(null)
    setStreamText('')
    setStreamError(null)
  }

  const handlePrev = () => {
    setCurrentIdx(Math.max(0, currentIdx - 1))
    setResponse('')
    setResult(null)
    setStreamText('')
    setStreamError(null)
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
      <div style={{ padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.125rem 0.5rem', borderRadius: '9999px', background: 'var(--purple-light)', color: 'var(--purple)' }}>
            {TYPE_LABELS[exercise.type]}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)' }}>
            {exercise.difficulty === 'easy' ? '基础' : exercise.difficulty === 'medium' ? '进阶' : '挑战'}
          </span>
        </div>

        {/* Overall Score */}
        <div style={{ textAlign: 'center', padding: '1.5rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, var(--info-bg) 0%, var(--accent-light) 100%)', border: '1px solid var(--info-border)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: result.overallScore >= 80 ? 'var(--success-dark)' : result.overallScore >= 60 ? 'var(--warning-dark)' : 'var(--danger-dark)' }}>
            {result.overallScore}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>综合评分</div>
        </div>

        {/* Dimension Scores */}
        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.75rem' }}>分项评分</h4>
          <ScoreBar label="句式变换准确性" score={result.transformScore} />
          <ScoreBar label="语言表达质量" score={result.languageScore} />
          <ScoreBar label="修辞效果" score={result.rhetoricScore} />
        </div>

        {/* Scoring Criteria */}
        {result.scoringCriteria && (
          <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--warning-light)', border: '1px solid var(--warning-border)', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--warning-dark)', marginBottom: '0.75rem' }}>评分依据</h4>
            <div style={{ fontSize: '0.8125rem', color: 'var(--warning-dark)', lineHeight: 1.8 }}>
              <p style={{ margin: '0 0 0.5rem' }}><strong>句式变换准确性：</strong>{result.scoringCriteria.transform}</p>
              <p style={{ margin: '0 0 0.5rem' }}><strong>语言表达质量：</strong>{result.scoringCriteria.language}</p>
              <p style={{ margin: 0 }}><strong>修辞效果：</strong>{result.scoringCriteria.rhetoric}</p>
            </div>
          </div>
        )}

        {/* Reference Answer */}
        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--success-light)', border: '1px solid var(--success-border)', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--success-dark)', marginBottom: '0.5rem' }}>参考答案</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--success-dark)', margin: 0, lineHeight: 1.8 }}>{result.referenceAnswer}</p>
        </div>

        {/* Example Variants */}
        {result.exampleVariants && result.exampleVariants.length > 0 && (
          <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--purple-light)', border: '1px solid var(--purple)', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--purple)', marginBottom: '0.5rem' }}>优秀范例</h4>
            {result.exampleVariants.map((ex, i) => (
              <div key={i} style={{ padding: '0.5rem 0.75rem', marginBottom: i < result.exampleVariants!.length - 1 ? '0.5rem' : 0, background: 'var(--bg-card)', borderRadius: '0.5rem', border: '1px solid var(--purple)', fontSize: '0.875rem', color: 'var(--purple-text)', lineHeight: 1.8 }}>
                {i + 1}. {ex}
              </div>
            ))}
          </div>
        )}

        {/* Strengths & Suggestions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--success-light)', border: '1px solid var(--success-border)' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--success-dark)', marginBottom: '0.5rem' }}>亮点</h4>
            {result.strengths.map((s, i) => (
              <p key={i} style={{ fontSize: '0.8125rem', color: 'var(--success-dark)', margin: '0 0 0.25rem', lineHeight: 1.6 }}>{s}</p>
            ))}
          </div>
          <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--suggestion-bg)', border: '1px solid var(--suggestion-border)' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--suggestion-text)', marginBottom: '0.5rem' }}>改进建议</h4>
            {result.suggestions.map((s, i) => (
              <p key={i} style={{ fontSize: '0.8125rem', color: 'var(--suggestion-text)', margin: '0 0 0.25rem', lineHeight: 1.6 }}>{s}</p>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handlePrev} disabled={currentIdx === 0}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)', color: currentIdx === 0 ? 'var(--text-tertiary, #9ca3af)' : 'var(--text-primary, #111827)', cursor: currentIdx === 0 ? 'not-allowed' : 'pointer', fontSize: '0.875rem' }}>
            ← 上一题
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {currentIdx < SENTENCE_EXERCISES.length - 1 && (
              <button onClick={handleNext}
                style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                下一题 →
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.125rem 0.5rem', borderRadius: '9999px', background: 'var(--purple-light)', color: 'var(--purple)' }}>
          {TYPE_LABELS[exercise.type]}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)' }}>
          {exercise.difficulty === 'easy' ? '基础' : exercise.difficulty === 'medium' ? '进阶' : '挑战'}
        </span>
      </div>

      <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary, #111827)', margin: '0 0 0.5rem', fontWeight: 500 }}>{exercise.prompt}</p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary, #111827)', margin: 0, lineHeight: 1.8, padding: '0.75rem', background: 'var(--bg-card, #fff)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)' }}>
          {exercise.originalSentence}
        </p>
      </div>

      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        rows={5}
        placeholder="请写下变换后的句子..."
        style={{
          width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
          border: response.trim().length > 0 && response.trim().length < 4 ? '1px solid #f87171' : '1px solid var(--border-color, #e5e7eb)',
          background: 'var(--bg-card, #fff)',
          fontSize: '0.875rem', color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '0.25rem',
        }}
      />
      {response.trim().length > 0 && response.trim().length < 4 && (
        <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: '0 0 0.75rem' }}>输入内容过少，请认真完成句式变换</p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={handlePrev} disabled={currentIdx === 0}
          style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)', color: currentIdx === 0 ? 'var(--text-tertiary, #9ca3af)' : 'var(--text-primary, #111827)', cursor: currentIdx === 0 ? 'not-allowed' : 'pointer', fontSize: '0.875rem' }}>
          ← 上一题
        </button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {currentIdx < SENTENCE_EXERCISES.length - 1 && (
            <button onClick={handleNext}
              style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)', cursor: 'pointer', fontSize: '0.875rem' }}>
              下一题
            </button>
          )}
          <button onClick={handleSubmit} disabled={!response.trim() || response.trim().length < 4 || isAnalyzing}
            style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', background: response.trim() && response.trim().length >= 4 && !isAnalyzing ? '#3b82f6' : '#9ca3af', color: '#fff', cursor: response.trim() && response.trim().length >= 4 && !isAnalyzing ? 'pointer' : 'not-allowed', fontSize: '0.875rem', fontWeight: 500 }}>
            {isAnalyzing ? '分析中...' : '提交分析'}
          </button>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)', marginTop: '1rem' }}>
        {currentIdx + 1} / {SENTENCE_EXERCISES.length}
      </p>
    </div>
  )
}
