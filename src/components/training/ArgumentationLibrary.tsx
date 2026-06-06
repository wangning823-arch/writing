'use client'

import { useState } from 'react'
import { ARGUMENTATION_METHODS, type ArgumentationMethod } from '@/lib/training/argumentation-methods'

interface ArgumentationLibraryProps {
  subject: 'chinese' | 'english'
  onComplete: (result: any) => void
  onBack: () => void
  userId?: string
}

export default function ArgumentationLibrary({ subject, onComplete, onBack, userId }: ArgumentationLibraryProps) {
  const [selectedMethod, setSelectedMethod] = useState<ArgumentationMethod | null>(null)
  const [practiceMode, setPracticeMode] = useState<'reference' | 'recognition'>('reference')
  const [recognitionAnswer, setRecognitionAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)

  if (selectedMethod) {
    return (
      <div style={{ padding: '1.5rem' }}>
        <button
          onClick={() => { setSelectedMethod(null); setRecognitionAnswer(''); setShowAnswer(false) }}
          style={{ border: 'none', background: 'none', color: 'var(--theme_text-weak)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '12px', padding: 0 }}
        >
          ← 返回方法列表
        </button>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.5rem' }}>
          {selectedMethod.name}
        </h3>

        <div style={{ padding: '1rem', borderRadius: '0.5rem', background: 'var(--accent-light)', border: '1px solid #bfdbfe', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1d4ed8', margin: '0 0 0.25rem' }}>定义</h4>
          <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>{selectedMethod.definition}</p>
        </div>

        <div style={{ padding: '1rem', borderRadius: '0.5rem', background: 'var(--success-light)', border: '1px solid var(--success-border)', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--success-dark)', margin: '0 0 0.25rem' }}>作用</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--success-dark)', margin: 0 }}>{selectedMethod.role}</p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.5rem' }}>示例</h4>
          {selectedMethod.examples.map((ex, i) => (
            <div key={i} style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary, #111827)', margin: 0, lineHeight: 1.6 }}>"{ex}"</p>
            </div>
          ))}
        </div>

        {selectedMethod.recognitionText && (
          <div style={{ padding: '1rem', borderRadius: '0.5rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.5rem' }}>识别练习</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', margin: '0 0 0.5rem' }}>请分析以下句子使用了什么论证方法：</p>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary, #111827)', margin: 0, lineHeight: 1.8, fontStyle: 'italic' }}>
              "{selectedMethod.recognitionText}"
            </p>
            <input
              type="text"
              value={recognitionAnswer}
              onChange={(e) => setRecognitionAnswer(e.target.value)}
              placeholder="你的分析..."
              style={{
                width: '100%', padding: '0.5rem', borderRadius: '0.375rem', marginTop: '0.75rem',
                border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
                fontSize: '0.875rem', color: 'var(--text-primary, #111827)', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => setShowAnswer(true)}
                style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)', cursor: 'pointer', fontSize: '0.8125rem' }}
              >
                查看答案
              </button>
            </div>
            {showAnswer && (
              <div style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem', background: 'var(--success-light)', border: '1px solid var(--success-border)' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--success-dark)', margin: 0 }}>{selectedMethod.recognitionAnswer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.5rem' }}>
        论证方法库
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1.5rem' }}>
        掌握7种常用论证方法的定义、作用和示例
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {ARGUMENTATION_METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method)}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem', borderRadius: '0.75rem',
              border: '1px solid var(--border-color, #e5e7eb)',
              background: 'var(--bg-card, #fff)', textAlign: 'left',
              cursor: 'pointer', width: '100%',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,130,246,0.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color, #e5e7eb)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-600)' }}>{method.name.charAt(0)}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary, #111827)', margin: '0 0 0.25rem' }}>{method.name}</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {method.definition}
              </p>
            </div>
            <span style={{ fontSize: '1rem', color: 'var(--text-tertiary, #9ca3af)', flexShrink: 0 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
