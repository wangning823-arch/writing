'use client'

import { useState, useEffect } from 'react'

interface AbilityDiagnosisProps {
  subject: 'chinese' | 'english'
  userId?: string
}

interface Dimension {
  name: string
  score: number
  level: string
  trend: 'up' | 'down' | 'stable'
  description: string
}

interface DiagnosisResult {
  overallLevel: string
  overallScore: number
  dimensions: Dimension[]
  weakPoints: string[]
  strengths: string[]
  recommendations: string[]
  nextSteps: string[]
}

export default function AbilityDiagnosis({ subject, userId }: AbilityDiagnosisProps) {
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDiagnose = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/ability-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subject }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (e: any) {
      setError(e.message || '诊断失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#16a34a'
    if (score >= 60) return '#d97706'
    return '#dc2626'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↑'
      case 'down': return '↓'
      default: return '→'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#16a34a'
      case 'down': return '#dc2626'
      default: return '#6b7280'
    }
  }

  if (!result) {
    return (
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
          能力诊断报告
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1.5rem' }}>
          基于训练数据的多维度写作能力分析
        </p>

        <div style={{ padding: '2rem', borderRadius: '0.75rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', textAlign: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary, #111827)', marginBottom: '1rem' }}>
            点击下方按钮，AI 将分析你的训练数据并生成能力诊断报告
          </p>
          <button
            onClick={handleDiagnose}
            disabled={loading}
            style={{
              padding: '0.625rem 1.5rem', borderRadius: '0.5rem', border: 'none',
              background: loading ? '#9ca3af' : '#3b82f6', color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.875rem', fontWeight: 500,
            }}
          >
            {loading ? '诊断中...' : '开始诊断'}
          </button>
          {error && <p style={{ fontSize: '0.8125rem', color: '#dc2626', marginTop: '0.75rem' }}>{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
        能力诊断报告
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1.5rem' }}>
        基于训练数据的多维度写作能力分析
      </p>

      <div style={{ padding: '1.5rem', borderRadius: '0.75rem', background: '#eff6ff', border: '1px solid #bfdbfe', marginBottom: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8125rem', color: '#3b82f6', margin: '0 0 0.25rem', fontWeight: 500 }}>综合等级</p>
        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1d4ed8', margin: '0 0 0.25rem' }}>{result.overallLevel}</p>
        <p style={{ fontSize: '0.875rem', color: '#2563eb', margin: 0 }}>综合得分：{result.overallScore}</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.75rem' }}>维度分析</h4>
        {result.dimensions.map((dim, i) => (
          <div key={i} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)', marginBottom: '0.5rem', background: 'var(--bg-card, #fff)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary, #111827)' }}>{dim.name}</span>
                <span style={{ fontSize: '0.6875rem', padding: '0.0625rem 0.375rem', borderRadius: '9999px', background: '#eff6ff', color: '#2563eb' }}>{dim.level}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: getScoreColor(dim.score) }}>{dim.score}</span>
                <span style={{ fontSize: '0.75rem', color: getTrendColor(dim.trend) }}>{getTrendIcon(dim.trend)}</span>
              </div>
            </div>
            <div style={{ height: '4px', borderRadius: '2px', background: 'var(--border-color, #e5e7eb)', overflow: 'hidden', marginBottom: '0.375rem' }}>
              <div style={{ height: '100%', width: `${dim.score}%`, borderRadius: '2px', background: getScoreColor(dim.score) }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #6b7280)', margin: 0 }}>{dim.description}</p>
          </div>
        ))}
      </div>

      {result.strengths.length > 0 && (
        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#16a34a', margin: '0 0 0.5rem' }}>优势</h4>
          {result.strengths.map((s, i) => (
            <p key={i} style={{ fontSize: '0.8125rem', color: '#15803d', margin: '0 0 0.25rem' }}>• {s}</p>
          ))}
        </div>
      )}

      {result.weakPoints.length > 0 && (
        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#dc2626', margin: '0 0 0.5rem' }}>薄弱点</h4>
          {result.weakPoints.map((w, i) => (
            <p key={i} style={{ fontSize: '0.8125rem', color: '#991b1b', margin: '0 0 0.25rem' }}>• {w}</p>
          ))}
        </div>
      )}

      {result.recommendations.length > 0 && (
        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#fffbeb', border: '1px solid #fde68a', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#92400e', margin: '0 0 0.5rem' }}>训练建议</h4>
          {result.recommendations.map((r, i) => (
            <p key={i} style={{ fontSize: '0.8125rem', color: '#78350f', margin: '0 0 0.25rem' }}>{i + 1}. {r}</p>
          ))}
        </div>
      )}

      {result.nextSteps.length > 0 && (
        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#7c3aed', margin: '0 0 0.5rem' }}>下一步行动</h4>
          {result.nextSteps.map((n, i) => (
            <p key={i} style={{ fontSize: '0.8125rem', color: '#5b21b6', margin: '0 0 0.25rem' }}>{i + 1}. {n}</p>
          ))}
        </div>
      )}

      <button
        onClick={handleDiagnose}
        disabled={loading}
        style={{
          width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)',
          background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)', cursor: 'pointer', fontSize: '0.875rem', marginTop: '1rem',
        }}
      >
        重新诊断
      </button>
    </div>
  )
}
