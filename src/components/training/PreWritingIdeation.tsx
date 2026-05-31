'use client'

import { useState } from 'react'
import ReviewStreamPanel from '@/components/ai/ReviewStreamPanel'

interface PreWritingIdeationProps {
  topic: string
  genre?: string
  subject: 'chinese' | 'english'
  onComplete: (result: any) => void
  onBack: () => void
}

type Phase = 'brainstorm' | 'outline' | 'polish'

export default function PreWritingIdeation({ topic, genre, subject, onComplete, onBack }: PreWritingIdeationProps) {
  const [phase, setPhase] = useState<Phase>('brainstorm')
  const [idea, setIdea] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [streamError, setStreamError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    setStreamText('')
    setStreamError(null)
    try {
      const res = await fetch('/api/ai/pre-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, genre, currentIdea: idea, phase, subject, stream: true }),
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
            else if (event.type === 'result') { setResult(event.data); if (phase === 'polish') onComplete(event.data) }
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

  const phaseLabels: Record<Phase, string> = {
    brainstorm: '头脑风暴',
    outline: '提纲组织',
    polish: '提纲完善',
  }

  const phaseDescriptions: Record<Phase, string> = {
    brainstorm: '通过发散思维，探索话题的多个角度',
    outline: '将零散想法组织成清晰的写作提纲',
    polish: '审视提纲，检查逻辑漏洞和结构问题',
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
          构思引导
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)' }}>
          苏格拉底式提问引导，帮你深入思考
        </p>
      </div>

      <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#eff6ff', border: '1px solid #bfdbfe', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1d4ed8', margin: '0 0 0.25rem' }}>写作话题</p>
        <p style={{ fontSize: '0.9375rem', color: '#1e40af', margin: 0, fontWeight: 500 }}>{topic}</p>
        {genre && <p style={{ fontSize: '0.8125rem', color: '#3b82f6', margin: '0.25rem 0 0' }}>文体：{genre}</p>}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['brainstorm', 'outline', 'polish'] as Phase[]).map((p) => (
          <button
            key={p}
            onClick={() => { setPhase(p); setResult(null) }}
            style={{
              flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: `1px solid ${phase === p ? '#3b82f6' : 'var(--border-color, #e5e7eb)'}`,
              background: phase === p ? '#eff6ff' : 'var(--bg-card, #fff)',
              color: phase === p ? '#2563eb' : 'var(--text-secondary, #6b7280)',
              cursor: 'pointer', fontSize: '0.8125rem', fontWeight: phase === p ? 600 : 400,
            }}
          >
            {phaseLabels[p]}
          </button>
        ))}
      </div>

      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1rem' }}>
        {phaseDescriptions[phase]}
      </p>

      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        rows={4}
        placeholder={phase === 'brainstorm' ? '写下你对这个话题的初步想法...' : '粘贴你的写作提纲...'}
        style={{
          width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
          border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
          fontSize: '0.875rem', color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '1rem',
        }}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: 'none',
          background: loading ? '#9ca3af' : '#3b82f6', color: '#fff',
          cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem',
        }}
      >
        {loading ? 'AI 分析中...' : 'AI 引导构思'}
      </button>

      {loading && (
        <ReviewStreamPanel
          text={streamText}
          error={streamError}
          onRetry={streamError ? () => { setLoading(false); setStreamText(''); setStreamError(null) } : undefined}
        />
      )}

      {!loading && result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {result.questions && (
            <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#fef3c7', border: '1px solid #fcd34d' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#92400e', margin: '0 0 0.5rem' }}>思考问题</h4>
              {result.questions.map((q: string, i: number) => (
                <p key={i} style={{ fontSize: '0.875rem', color: '#78350f', margin: '0 0 0.25rem', lineHeight: 1.6 }}>• {q}</p>
              ))}
            </div>
          )}

          {result.mindMap && (
            <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#16a34a', margin: '0 0 0.5rem' }}>思维导图</h4>
              <p style={{ fontSize: '0.875rem', color: '#15803d', margin: '0 0 0.5rem', fontWeight: 500 }}>核心：{result.mindMap.central}</p>
              {result.mindMap.branches?.map((b: any, i: number) => (
                <div key={i} style={{ marginLeft: '1rem', marginBottom: '0.25rem' }}>
                  <p style={{ fontSize: '0.8125rem', color: '#166534', margin: 0, fontWeight: 500 }}>• {b.label}</p>
                  {b.children?.map((c: string, j: number) => (
                    <p key={j} style={{ fontSize: '0.8125rem', color: '#15803d', margin: '0 0 0 1rem' }}>  - {c}</p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {result.outline && (
            <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#7c3aed', margin: '0 0 0.5rem' }}>写作提纲</h4>
              {result.outline.map((item: any, i: number) => (
                <div key={i} style={{ marginLeft: `${(item.level - 1) * 1}rem`, marginBottom: '0.25rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#5b21b6', margin: 0, fontWeight: item.level === 1 ? 600 : 400 }}>
                    {item.level === 1 ? '■' : '•'} {item.text}
                  </p>
                  {item.children?.map((c: string, j: number) => (
                    <p key={j} style={{ fontSize: '0.8125rem', color: '#6d28d9', margin: '0 0 0 1.5rem' }}>  - {c}</p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {result.review && (
            <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#fff7ed', border: '1px solid #fed7aa' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#9a3412', margin: '0 0 0.5rem' }}>提纲评审</h4>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                {Object.entries(result.review).map(([k, v]) => (
                  <span key={k} style={{ fontSize: '0.75rem', color: '#c2410c' }}>{k.replace('Score', '')}: {v as number}分</span>
                ))}
              </div>
              {result.revisedOutline && (
                <p style={{ fontSize: '0.8125rem', color: '#78350f', margin: '0.5rem 0 0', lineHeight: 1.6 }}>{result.revisedOutline}</p>
              )}
            </div>
          )}

          {result.strengths && result.strengths.length > 0 && (
            <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#16a34a', margin: '0 0 0.25rem' }}>亮点</h4>
              {result.strengths.map((s: string, i: number) => (
                <p key={i} style={{ fontSize: '0.8125rem', color: '#15803d', margin: '0 0 0.125rem' }}>• {s}</p>
              ))}
            </div>
          )}

          {result.suggestions && result.suggestions.length > 0 && (
            <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#fefce8', border: '1px solid #fde68a' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#854d0e', margin: '0 0 0.25rem' }}>改进建议</h4>
              {result.suggestions.map((s: string, i: number) => (
                <p key={i} style={{ fontSize: '0.8125rem', color: '#713f12', margin: '0 0 0.125rem' }}>• {s}</p>
              ))}
            </div>
          )}

          {result.encouragement && (
            <p style={{ fontSize: '0.875rem', color: '#3b82f6', textAlign: 'center', fontStyle: 'italic' }}>{result.encouragement}</p>
          )}

          {phase !== 'polish' && (
            <button
              onClick={() => {
                const nextPhase = phase === 'brainstorm' ? 'outline' : 'polish'
                setPhase(nextPhase)
                setResult(null)
              }}
              style={{
                width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #3b82f6',
                background: '#fff', color: '#3b82f6', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
              }}
            >
              进入下一阶段：{phase === 'brainstorm' ? '提纲组织' : '提纲完善'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
