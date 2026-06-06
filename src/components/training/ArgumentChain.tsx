'use client'

import { useState } from 'react'
import ReviewStreamPanel from '@/components/ai/ReviewStreamPanel'

interface ArgumentChainProps {
  topic: string
  subject: 'chinese' | 'english'
  onComplete: (score: number) => void
}

interface ChainField {
  claim: string
  evidence: string
  analysis: string
  summary: string
}

const EMPTY_CHAIN: ChainField = { claim: '', evidence: '', analysis: '', summary: '' }

const FIELD_LABELS: Record<string, string> = {
  claim: '论点句',
  evidence: '论据',
  analysis: '分析',
  summary: '小结',
}

const FIELD_PLACEHOLDERS: Record<string, Record<string, string>> = {
  chinese: {
    claim: '用一句话概括这个分论点...',
    evidence: '提供具体的事例或数据...',
    analysis: '分析这个论据如何支撑论点...',
    summary: '用一句话小结这一论证链...',
  },
  english: {
    claim: 'State your sub-argument in one sentence...',
    evidence: 'Provide specific examples or data...',
    analysis: 'Analyze how this evidence supports your argument...',
    summary: 'Summarize this argument chain in one sentence...',
  },
}

const FIELD_MIN: Record<string, number> = {
  claim: 10,
  evidence: 20,
  analysis: 20,
  summary: 10,
}

export default function ArgumentChain({ topic, subject, onComplete }: ArgumentChainProps) {
  const [chains, setChains] = useState<ChainField[]>([
    { ...EMPTY_CHAIN },
    { ...EMPTY_CHAIN },
    { ...EMPTY_CHAIN },
  ])
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [streamError, setStreamError] = useState<string | null>(null)
  const [results, setResults] = useState<{
    chains: Array<{ score: number; feedback: string }>
    totalScore: number
  } | null>(null)
  const [expandedChain, setExpandedChain] = useState(0)

  const t = (key: string) => {
    const labels: Record<string, string> = {
      claim: '论点句',
      evidence: '论据',
      analysis: '分析',
      summary: '小结',
    }
    return labels[key] || key
  }

  const updateField = (chainIdx: number, field: keyof ChainField, value: string) => {
    setChains((prev) => {
      const next = [...prev]
      next[chainIdx] = { ...next[chainIdx], [field]: value }
      return next
    })
  }

  const isChainValid = (chain: ChainField) => {
    return (
      chain.claim.trim().length >= FIELD_MIN.claim &&
      chain.evidence.trim().length >= FIELD_MIN.evidence &&
      chain.analysis.trim().length >= FIELD_MIN.analysis &&
      chain.summary.trim().length >= FIELD_MIN.summary
    )
  }

  const allValid = chains.every(isChainValid)

  const handleSubmit = async () => {
    if (!allValid) return
    setIsEvaluating(true)
    setStreamText('')
    setStreamError(null)
    try {
      const res = await fetch('/api/ai/argument-chain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          subject,
          thesis: topic,
          chains: chains.map((c) => ({
            claim: c.claim,
            evidence: c.evidence,
            analysis: c.analysis,
            summary: c.summary,
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
          论证链条评估结果
        </h2>

        <div
          style={{
            padding: '1.25rem',
            borderRadius: '0.75rem',
            background: results.totalScore >= 80 ? 'var(--success-light)' : results.totalScore >= 60 ? 'var(--warning-light)' : 'var(--danger-light)',
            border: `1px solid ${results.totalScore >= 80 ? 'var(--success-dark)' : results.totalScore >= 60 ? 'var(--warning)' : 'var(--danger)'}`,
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: results.totalScore >= 80 ? 'var(--success-dark)' : results.totalScore >= 60 ? 'var(--warning)' : 'var(--danger)',
            }}
          >
            {results.totalScore}分
          </span>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary, #6b7280)',
              margin: '0.5rem 0 0',
            }}
          >
            {results.totalScore >= 80
              ? '论证链条逻辑严密，论据充分'
              : results.totalScore >= 60
                ? '论证基本成立，部分环节需要加强'
                : '论证链条存在较多问题，需要重新组织'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {results.chains.map((chainResult, idx) => (
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
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary, #111827)', margin: 0 }}>
                  论证链 {idx + 1}
                </h3>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: chainResult.score >= 80 ? 'var(--success-dark)' : chainResult.score >= 60 ? 'var(--warning)' : 'var(--danger)',
                  }}
                >
                  {chainResult.score}分
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
                {chainResult.feedback}
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
          论证链条训练
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
          围绕主题，构建3条完整的论证链：论点句 → 论据 → 分析 → 小结
        </p>
      </div>

      {/* Chain tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {chains.map((chain, idx) => (
          <button
            key={idx}
            onClick={() => setExpandedChain(idx)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 500,
              border: '1px solid',
              borderColor: expandedChain === idx ? 'var(--theme_button-primary)' : 'var(--border-color, #e5e7eb)',
              background: expandedChain === idx ? 'var(--theme_button-primary)' : 'var(--bg-card, #fff)',
              color: expandedChain === idx ? '#fff' : 'var(--text-secondary, #6b7280)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            链 {idx + 1}
            {isChainValid(chain) && (
              <span style={{ marginLeft: '0.25rem' }}>✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Current chain form */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: '0.75rem',
          background: 'var(--bg-card, #fff)',
          border: '1px solid var(--border-color, #e5e7eb)',
        }}
      >
        <h3
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-primary, #111827)',
            marginBottom: '1rem',
          }}
        >
          论证链 {expandedChain + 1}
        </h3>

        {(Object.keys(FIELD_LABELS) as Array<keyof ChainField>).map((field) => {
          const chain = chains[expandedChain]
          const val = chain[field]
          const minLen = FIELD_MIN[field]
          const currentLen = val.replace(/\s/g, '').length
          const isValid = currentLen >= minLen

          return (
            <div key={field} style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--text-primary, #111827)',
                  marginBottom: '0.375rem',
                }}
              >
                {FIELD_LABELS[field]}
              </label>
              {field === 'summary' ? (
                <input
                  type="text"
                  value={val}
                  onChange={(e) => updateField(expandedChain, field, e.target.value)}
                  placeholder={FIELD_PLACEHOLDERS[subject]?.[field] || ''}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-color, #e5e7eb)',
                    fontSize: '0.875rem',
                    background: 'var(--bg-primary, #fff)',
                    color: 'var(--text-primary, #111827)',
                    boxSizing: 'border-box',
                  }}
                />
              ) : (
                <textarea
                  value={val}
                  onChange={(e) => updateField(expandedChain, field, e.target.value)}
                  placeholder={FIELD_PLACEHOLDERS[subject]?.[field] || ''}
                  rows={field === 'claim' ? 2 : 3}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-color, #e5e7eb)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    resize: 'vertical',
                    background: 'var(--bg-primary, #fff)',
                    color: 'var(--text-primary, #111827)',
                    boxSizing: 'border-box',
                  }}
                />
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '0.25rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: isValid ? 'var(--success-dark)' : '#9ca3af',
                  }}
                >
                  {isValid ? '已满足' : `至少${minLen}字`}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-tertiary, #9ca3af)',
                  }}
                >
                  {currentLen}字
                </span>
              </div>
            </div>
          )
        })}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <button
            onClick={() => setExpandedChain((prev) => Math.max(0, prev - 1))}
            disabled={expandedChain === 0}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              border: '1px solid var(--border-color, #e5e7eb)',
              background: 'var(--bg-card, #fff)',
              color: 'var(--text-secondary, #6b7280)',
              cursor: expandedChain === 0 ? 'not-allowed' : 'pointer',
              opacity: expandedChain === 0 ? 0.5 : 1,
            }}
          >
            上一条
          </button>
          <button
            onClick={() => setExpandedChain((prev) => Math.min(chains.length - 1, prev + 1))}
            disabled={expandedChain === chains.length - 1}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              border: '1px solid var(--border-color, #e5e7eb)',
              background: 'var(--bg-card, #fff)',
              color: 'var(--text-secondary, #6b7280)',
              cursor: expandedChain === chains.length - 1 ? 'not-allowed' : 'pointer',
              opacity: expandedChain === chains.length - 1 ? 0.5 : 1,
            }}
          >
            下一条
          </button>
        </div>
      </div>

      {/* Submit */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
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
          {isEvaluating ? 'AI评估中...' : '提交'}
        </button>
        {!allValid && (
          <p
            style={{
              fontSize: '0.75rem',
              color: '#f59e0b',
              marginTop: '0.5rem',
            }}
          >
            请填写所有论证链的所有字段后再提交
          </p>
        )}
      </div>
    </div>
  )
}
