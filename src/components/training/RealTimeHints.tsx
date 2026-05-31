'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface RealTimeHintsProps {
  content: string
  topic?: string
  subject: 'chinese' | 'english'
  onHint?: (hints: string[]) => void
}

interface HintData {
  hints: string[]
  wordCount?: number
  logicScore?: number
  paragraphScore?: number
}

export default function RealTimeHints({ content, topic, subject, onHint }: RealTimeHintsProps) {
  const [hints, setHints] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [lastCheckLength, setLastCheckLength] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const checkContent = useCallback(async (text: string) => {
    if (!text.trim() || text.length < 50) return
    setLoading(true)
    try {
      const phase = text.length < 200 ? 'word-count' : text.length < 500 ? 'paragraph-check' : 'logic-check'
      const res = await fetch('/api/ai/realtime-hints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, topic, subject, phase }),
      })
      const data: HintData = await res.json()
      if (data.hints && data.hints.length > 0) {
        setHints(data.hints)
        onHint?.(data.hints)
      }
    } catch {
      // Silent fail for realtime hints
    } finally {
      setLoading(false)
    }
  }, [topic, subject, onHint])

  useEffect(() => {
    const lengthDiff = Math.abs(content.length - lastCheckLength)
    if (lengthDiff < 100) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      checkContent(content)
      setLastCheckLength(content.length)
    }, 30000) // 30 second debounce

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [content, lastCheckLength, checkContent])

  const wordCount = content.replace(/\s/g, '').length
  const targetMin = subject === 'chinese' ? 800 : 120
  const targetMax = subject === 'chinese' ? 1000 : 150
  const progress = Math.min((wordCount / targetMin) * 100, 100)

  return (
    <div style={{
      padding: '0.75rem 1rem',
      background: 'var(--bg-card, #fff)',
      border: '1px solid var(--border-color, #e5e7eb)',
      borderRadius: '0.5rem',
      marginBottom: '0.75rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>写作助手</span>
        <span style={{ fontSize: '0.6875rem', color: wordCount >= targetMin ? '#16a34a' : 'var(--text-tertiary, #9ca3af)' }}>
          {wordCount} / {targetMin}-{targetMax} 字
        </span>
      </div>

      <div style={{ height: '3px', borderRadius: '2px', background: 'var(--border-color, #e5e7eb)', marginBottom: '0.5rem' }}>
        <div style={{
          height: '100%', borderRadius: '2px',
          width: `${progress}%`,
          background: progress >= 100 ? '#16a34a' : progress >= 60 ? '#3b82f6' : '#f59e0b',
          transition: 'width 0.3s',
        }} />
      </div>

      {loading && (
        <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #9ca3af)', margin: 0 }}>
          正在分析...
        </p>
      )}

      {hints.length > 0 && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {hints.map((hint, i) => (
            <p key={i} style={{ fontSize: '0.75rem', color: '#3b82f6', margin: 0, lineHeight: 1.4 }}>
              💡 {hint}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
