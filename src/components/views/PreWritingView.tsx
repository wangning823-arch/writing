'use client'

import { useState } from 'react'
import PreWritingIdeation from '@/components/training/PreWritingIdeation'

interface PreWritingViewProps {
  onBack: () => void
  subject: 'chinese' | 'english'
}

export default function PreWritingView({ onBack, subject }: PreWritingViewProps) {
  const [topic, setTopic] = useState('')
  const [genre, setGenre] = useState('')
  const [started, setStarted] = useState(false)

  if (started && topic) {
    return (
      <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ border: 'none', background: 'none', color: 'var(--theme_text-weak)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '12px', padding: 0 }}>
          ← 返回
        </button>
        <PreWritingIdeation
          topic={topic}
          genre={genre}
          subject={subject}
          onComplete={() => {}}
          onBack={() => setStarted(false)}
        />
      </div>
    )
  }

  return (
    <div style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ border: 'none', background: 'none', color: 'var(--theme_text-weak)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '12px', padding: 0 }}>
        ← 返回
      </button>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '8px' }}>
        构思引导
      </h1>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '2rem' }}>
        在动笔之前，先通过苏格拉底式提问深入思考
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary, #111827)', marginBottom: '0.375rem' }}>
          写作话题
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="请输入作文话题..."
          style={{
            width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
            border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
            fontSize: '0.875rem', color: 'var(--text-primary, #111827)', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary, #111827)', marginBottom: '0.375rem' }}>
          文体（选填）
        </label>
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="如：议论文、记叙文..."
          style={{
            width: '100%', padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
            border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
            fontSize: '0.875rem', color: 'var(--text-primary, #111827)', boxSizing: 'border-box',
          }}
        />
      </div>

      <button
        onClick={() => topic.trim() && setStarted(true)}
        disabled={!topic.trim()}
        style={{
          width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: 'none',
          background: topic.trim() ? '#3b82f6' : '#9ca3af',
          color: '#fff', cursor: topic.trim() ? 'pointer' : 'not-allowed', fontSize: '0.875rem', fontWeight: 500,
        }}
      >
        开始构思
      </button>
    </div>
  )
}
