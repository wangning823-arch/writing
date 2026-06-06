'use client'

import { useState, useEffect } from 'react'
import DeepReadingExercise from '@/components/training/DeepReadingExercise'

interface DeepReadingViewProps {
  onBack: () => void
  subject: 'chinese' | 'english'
  userId?: string
}

interface EssayData {
  id: string
  title: string
  content: string
  abilityPoint?: string
  level?: number
  genre?: string
}

export default function DeepReadingView({ onBack, subject, userId }: DeepReadingViewProps) {
  const [essays, setEssays] = useState<EssayData[]>([])
  const [selectedEssay, setSelectedEssay] = useState<EssayData | null>(null)
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<any>(null)
  const [sourceFilter, setSourceFilter] = useState<'model' | 'gaokao'>('model')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/essays?source=${sourceFilter}&subject=${subject}&limit=30`)
      .then((r) => r.json())
      .then((data) => {
        setEssays(Array.isArray(data.essays) ? data.essays : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [subject, sourceFilter])

  if (result) {
    return (
      <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{ border: 'none', background: 'none', color: 'var(--theme_text-weak)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '12px', padding: 0 }}
        >
          ← 返回
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '1rem' }}>
          精读分析报告
        </h2>

        <div style={{ padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>
              {result.overallScore || 0}
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary, #111827)' }}>综合评分</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #6b7280)' }}>
                技巧准确 {result.techniqueAccuracy || 0} · 深度思考 {result.insightDepth || 0} · 反思质量 {result.reflectionQuality || 0}
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', margin: 0, lineHeight: 1.6 }}>
            {result.summary}
          </p>
        </div>

        {result.strengths?.length > 0 && (
          <div style={{ padding: '1rem', borderRadius: '0.5rem', background: 'var(--success-light)', border: '1px solid var(--success-border)', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--success-dark)', marginBottom: '0.5rem' }}>做得好的方面</h4>
            {result.strengths.map((s: string, i: number) => (
              <p key={i} style={{ fontSize: '0.8125rem', color: 'var(--success-dark)', margin: '0.25rem 0' }}>· {s}</p>
            ))}
          </div>
        )}

        {result.suggestions?.length > 0 && (
          <div style={{ padding: '1rem', borderRadius: '0.5rem', background: 'var(--warning-light)', border: '1px solid var(--warning-border)', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--warning-dark)', marginBottom: '0.5rem' }}>改进建议</h4>
            {result.suggestions.map((s: string, i: number) => (
              <p key={i} style={{ fontSize: '0.8125rem', color: 'var(--warning-dark)', margin: '0.25rem 0' }}>· {s}</p>
            ))}
          </div>
        )}

        {result.techniquesMissed?.length > 0 && (
          <div style={{ padding: '1rem', borderRadius: '0.5rem', background: 'var(--danger-light)', border: '1px solid var(--danger-border)', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--danger-dark)', marginBottom: '0.5rem' }}>遗漏的技巧</h4>
            {result.techniquesMissed.map((t: string, i: number) => (
              <p key={i} style={{ fontSize: '0.8125rem', color: 'var(--danger-dark)', margin: '0.25rem 0' }}>· {t}</p>
            ))}
          </div>
        )}

        <button
          onClick={() => { setResult(null); setSelectedEssay(null) }}
          style={{
            padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none',
            background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '0.875rem',
          }}
        >
          再练一篇
        </button>
      </div>
    )
  }

  if (selectedEssay) {
    return (
      <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={() => setSelectedEssay(null)}
          style={{ border: 'none', background: 'none', color: 'var(--theme_text-weak)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '12px', padding: 0 }}
        >
          ← 返回选文
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.5rem' }}>
          精读训练：{selectedEssay.title}
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1rem' }}>
          逐段阅读，在每个段落中标注您发现的写作技巧，并写下您的感悟。
        </p>
        <DeepReadingExercise
          essayTitle={selectedEssay.title}
          essayContent={selectedEssay.content}
          subject={subject}
          userId={userId}
          onComplete={setResult}
          onBack={() => setSelectedEssay(null)}
        />
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={onBack}
        style={{ border: 'none', background: 'none', color: 'var(--theme_text-weak)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '12px', padding: 0 }}
      >
        ← 返回
      </button>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.5rem' }}>
        {subject === 'chinese' ? '语文' : '英语'}精读训练
      </h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1rem' }}>
        选择一篇范文进行深度阅读，逐段标注写作技巧并写下感悟
      </p>

      {/* Source filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setSourceFilter('model')}
          style={{
            padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none',
            background: sourceFilter === 'model' ? '#3b82f6' : 'var(--bg-secondary, #f3f4f6)',
            color: sourceFilter === 'model' ? '#fff' : 'var(--text-secondary, #6b7280)',
            cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
          }}
        >
          技法范文
        </button>
        <button
          onClick={() => setSourceFilter('gaokao')}
          style={{
            padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none',
            background: sourceFilter === 'gaokao' ? '#3b82f6' : 'var(--bg-secondary, #f3f4f6)',
            color: sourceFilter === 'gaokao' ? '#fff' : 'var(--text-secondary, #6b7280)',
            cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
          }}
        >
          高考满分作文
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary, #6b7280)', padding: '2rem' }}>加载中...</p>
      ) : essays.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary, #6b7280)', padding: '2rem' }}>暂无可用范文</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {essays.map((essay) => (
            <button
              key={essay.id}
              onClick={() => setSelectedEssay(essay)}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem', borderRadius: '0.75rem',
                border: '1px solid var(--border-color, #e5e7eb)',
                background: 'var(--bg-card, #fff)', textAlign: 'left',
                cursor: 'pointer', width: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,130,246,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color, #e5e7eb)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary, #111827)', margin: '0 0 0.25rem' }}>
                  {essay.title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {essay.content.slice(0, 60)}...
                </p>
              </div>
              <span style={{ fontSize: '1rem', color: 'var(--text-tertiary, #9ca3af)', flexShrink: 0 }}>→</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
