'use client'

import { useState } from 'react'
import ReviewStreamPanel from '@/components/ai/ReviewStreamPanel'

interface MultiAngleAnalysisProps {
  topic: string
  subject: 'chinese' | 'english'
  onComplete: (score: number) => void
}

interface AngleEntry {
  key: string
  label: string
  labelEn: string
  content: string
  icon: string
}

const CHINESE_ANGLES: Omit<AngleEntry, 'content'>[] = [
  { key: 'individual', label: '个人角度', labelEn: 'Individual', icon: '👤' },
  { key: 'society', label: '群体/社会角度', labelEn: 'Society', icon: '🌍' },
  { key: 'history', label: '历史/哲学角度', labelEn: 'History', icon: '📚' },
]

const ENGLISH_ANGLES: Omit<AngleEntry, 'content'>[] = [
  { key: 'individual', label: 'Individual Perspective', labelEn: 'Individual', icon: '👤' },
  { key: 'society', label: 'Society Perspective', labelEn: 'Society', icon: '🌍' },
  { key: 'history', label: 'History/Philosophy', labelEn: 'History', icon: '📚' },
]

const MIN_CHARS = 100
const MAX_CHARS = 200

export default function MultiAngleAnalysis({
  topic,
  subject,
  onComplete,
}: MultiAngleAnalysisProps) {
  const angleTemplates = subject === 'chinese' ? CHINESE_ANGLES : ENGLISH_ANGLES

  const [angles, setAngles] = useState<AngleEntry[]>(
    angleTemplates.map((a) => ({ ...a, content: '' })),
  )
  const [activeAngle, setActiveAngle] = useState(0)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [streamError, setStreamError] = useState<string | null>(null)
  const [results, setResults] = useState<{
    angles: Array<{ score: number; feedback: string }>
    overallDepth: string
    totalScore: number
  } | null>(null)

  const updateContent = (idx: number, value: string) => {
    setAngles((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], content: value }
      return next
    })
  }

  const getCharCount = (content: string) =>
    subject === 'chinese' ? content.replace(/\s/g, '').length : content.trim().split(/\s+/).filter(Boolean).length

  const isAngleValid = (angle: AngleEntry) => {
    const count = getCharCount(angle.content)
    return count >= MIN_CHARS && count <= MAX_CHARS
  }

  const allValid = angles.every(isAngleValid)

  const handleSubmit = async () => {
    if (!allValid) return
    setIsEvaluating(true)
    setStreamText('')
    setStreamError(null)
    try {
      const res = await fetch('/api/ai/multi-angle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          subject,
          analyses: angles.map((a) => ({
            angle: subject === 'chinese' ? a.label : a.labelEn,
            content: a.content,
          })),
          stream: true,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setStreamError(data.error || '评估失败')
        setIsEvaluating(false)
        return
      }
      const reader = res.body?.getReader()
      if (!reader) { setStreamError('无法读取响应流'); setIsEvaluating(false); return }
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
            else if (event.type === 'result') setResults(event.data)
            else if (event.type === 'error') setStreamError(event.message)
          } catch {}
        }
      }
    } catch {
      setStreamError('网络错误，请重试')
    } finally {
      setIsEvaluating(false)
    }
  }

  if (isEvaluating) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        <ReviewStreamPanel
          text={streamText}
          error={streamError}
          onRetry={streamError ? () => { setIsEvaluating(false); setStreamText(''); setStreamError(null) } : undefined}
        />
      </div>
    )
  }

  if (results) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--text-primary, #111827)',
            marginBottom: '1rem',
          }}
        >
          多角度分析评估结果
        </h2>

        <div
          style={{
            padding: '1.25rem',
            borderRadius: '0.75rem',
            background: results.totalScore >= 80 ? 'var(--success-light)' : results.totalScore >= 60 ? 'var(--warning-light)' : 'var(--danger-light)',
            border: `1px solid ${results.totalScore >= 80 ? 'var(--success-dark)' : results.totalScore >= 60 ? 'var(--warning)' : 'var(--danger)'}`,
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: results.totalScore >= 80 ? 'var(--success-dark)' : results.totalScore >= 60 ? 'var(--warning)' : 'var(--danger)',
              }}
            >
              {results.totalScore}分
            </span>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              lineHeight: 1.7,
              color: 'var(--text-secondary, #6b7280)',
              margin: 0,
            }}
          >
            <strong>整体分析深度：</strong>
            {results.overallDepth}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {results.angles.map((angleResult, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.25rem',
                borderRadius: '0.75rem',
                background: 'var(--bg-card, #fff)',
                border: '1px solid var(--border-color, #e5e7eb)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <h3
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text-primary, #111827)',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>{angles[idx].icon}</span>
                  {angles[idx].label}
                </h3>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: angleResult.score >= 80 ? 'var(--success-dark)' : angleResult.score >= 60 ? 'var(--warning)' : 'var(--danger)',
                  }}
                >
                  {angleResult.score}分
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary, #6b7280)',
                  margin: 0,
                }}
              >
                {angleResult.feedback}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => onComplete(results.totalScore)}
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
    )
  }

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
          多角度分析训练
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary, #6b7280)',
          }}
        >
          {subject === 'chinese' ? '语文' : '英语'} &middot; {topic}
        </p>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary, #6b7280)',
            marginTop: '0.5rem',
          }}
        >
          从三个不同角度分析话题，展现思维的广度和深度
        </p>
      </div>

      {/* Topic display */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderRadius: '0.75rem',
          background: 'var(--bg-secondary, #f9fafb)',
          border: '1px solid var(--border-color, #e5e7eb)',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)' }}>
          {subject === 'chinese' ? '分析话题' : 'Analyze Topic'}
        </span>
        <p
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--text-primary, #111827)',
            margin: '0.25rem 0 0',
          }}
        >
          {topic}
        </p>
      </div>

      {/* Angle tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {angles.map((angle, idx) => {
          const count = getCharCount(angle.content)
          const valid = count >= MIN_CHARS && count <= MAX_CHARS
          return (
            <button
              key={angle.key}
              onClick={() => setActiveAngle(idx)}
              style={{
                flex: 1,
                padding: '0.625rem 0.5rem',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                fontWeight: 500,
                border: '1px solid',
                borderColor: activeAngle === idx ? 'var(--theme_button-primary)' : 'var(--border-color, #e5e7eb)',
                background: activeAngle === idx ? 'var(--theme_button-primary)' : 'var(--bg-card, #fff)',
                color: activeAngle === idx ? '#fff' : 'var(--text-secondary, #6b7280)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{angle.icon}</span>
              <span>{subject === 'chinese' ? angle.label : angle.labelEn}</span>
              {angle.content.length > 0 && (
                <span
                  style={{
                    fontSize: '0.625rem',
                    color: valid ? 'var(--success-dark)' : activeAngle === idx ? 'rgba(255,255,255,0.8)' : '#9ca3af',
                  }}
                >
                  {count}/{MAX_CHARS}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Active angle editor */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: '0.75rem',
          background: 'var(--bg-card, #fff)',
          border: '1px solid var(--border-color, #e5e7eb)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>{angles[activeAngle].icon}</span>
          <h3
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'var(--text-primary, #111827)',
              margin: 0,
            }}
          >
            {angles[activeAngle].label}
          </h3>
        </div>

        <textarea
          value={angles[activeAngle].content}
          onChange={(e) => updateContent(activeAngle, e.target.value)}
          placeholder={
            subject === 'chinese'
              ? `从${angles[activeAngle].label}分析"${topic}"（${MIN_CHARS}-${MAX_CHARS}字）...`
              : `Analyze "${topic}" from ${angles[activeAngle].labelEn} perspective (${MIN_CHARS}-${MAX_CHARS} words)...`
          }
          rows={6}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border-color, #e5e7eb)',
            fontSize: '0.875rem',
            lineHeight: 1.7,
            resize: 'vertical',
            background: 'var(--bg-primary, #fff)',
            color: 'var(--text-primary, #111827)',
            boxSizing: 'border-box',
          }}
        />

        {(() => {
          const count = getCharCount(angles[activeAngle].content)
          const isOver = count > MAX_CHARS
          const isUnder = count < MIN_CHARS && count > 0
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  color: isOver ? 'var(--danger)' : isUnder ? 'var(--warning)' : count > 0 ? 'var(--success-dark)' : '#9ca3af',
                }}
              >
                {isOver
                  ? `超出${count - MAX_CHARS}字`
                  : isUnder
                    ? `还需${MIN_CHARS - count}字`
                    : count > 0
                      ? '长度合适'
                      : `目标${MIN_CHARS}-${MAX_CHARS}字`}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-tertiary, #9ca3af)',
                }}
              >
                {count} / {MAX_CHARS}
              </span>
            </div>
          )
        })()}
      </div>

      {/* Progress indicator */}
      <div
        style={{
          display: 'flex',
          gap: '0.375rem',
          justifyContent: 'center',
          marginTop: '1rem',
          marginBottom: '1rem',
        }}
      >
        {angles.map((angle, idx) => {
          const count = getCharCount(angle.content)
          const valid = count >= MIN_CHARS && count <= MAX_CHARS
          return (
            <div
              key={idx}
              style={{
                width: '2rem',
                height: '4px',
                borderRadius: '2px',
                background: valid ? 'var(--success-dark)' : activeAngle === idx ? 'var(--theme_button-primary)' : 'var(--border-color, #e5e7eb)',
                transition: 'background 0.2s ease',
              }}
            />
          )
        })}
      </div>

      {/* Submit */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleSubmit}
          disabled={!allValid || isEvaluating}
          style={{
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: allValid && !isEvaluating ? 'var(--theme_button-primary)' : '#9ca3af',
            color: '#fff',
            border: 'none',
            cursor: allValid && !isEvaluating ? 'pointer' : 'not-allowed',
          }}
        >
          {isEvaluating ? 'AI评估中...' : '提交分析'}
        </button>
        {!allValid && (
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--warning)',
              marginTop: '0.5rem',
            }}
          >
            请确保每个角度的分析都在{MIN_CHARS}-{MAX_CHARS}字之间
          </p>
        )}
      </div>
    </div>
  )
}
