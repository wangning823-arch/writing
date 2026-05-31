'use client'

import { useEffect, useRef } from 'react'

interface ReviewStreamPanelProps {
  text: string
  error?: string | null
  onRetry?: () => void
}

export default function ReviewStreamPanel({ text, error, onRetry }: ReviewStreamPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [text])

  if (error) {
    return (
      <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          background: 'var(--theme_bg)',
        }}>
          <p style={{ color: 'var(--color-warning, #f59e0b)', fontWeight: 500, marginBottom: '8px' }}>
            评审出错
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--theme_text-weak)', marginBottom: '16px' }}>
            {error}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--theme_button-primary)',
                color: '#ffffff',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              重试
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'var(--accent, #3b82f6)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)' }}>
            AI 评审中...
          </h1>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text-weak)' }}>
          正在分析你的写作表现
        </p>
      </div>

      {/* Streaming text panel */}
      <div
        ref={scrollRef}
        style={{
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          background: 'var(--theme_bg)',
          maxHeight: '400px',
          overflowY: 'auto',
          fontSize: '0.8125rem',
          lineHeight: 1.8,
          color: 'var(--theme_text)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontFamily: 'monospace',
        }}
      >
        {text || '正在等待 AI 响应...'}
        <span style={{
          display: 'inline-block',
          width: '2px',
          height: '1em',
          background: 'var(--accent, #3b82f6)',
          marginLeft: '2px',
          animation: 'blink 1s step-end infinite',
          verticalAlign: 'text-bottom',
        }} />
      </div>

      <p style={{
        fontSize: '0.75rem',
        color: 'var(--theme_text-weak)',
        textAlign: 'center',
        marginTop: '12px',
      }}>
        通常需要 15-30 秒，请耐心等待
      </p>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
