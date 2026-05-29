'use client'

import { useState, useEffect } from 'react'
import type { EssayAnalysisResult } from '@/lib/ai/essay-analysis-service'

interface EssayAnalysisPanelProps {
  essaySource: 'model' | 'topic' | 'english-json' | 'gaokao'
  essayId: string
  essayTitle: string
  essayContent: string
  subject: 'chinese' | 'english'
  techniques?: string[]
}

const DIMENSION_LABELS = [
  { key: 'contentAnalysis', label: '内容立意', icon: '📝' },
  { key: 'structureAnalysis', label: '结构布局', icon: '🏗️' },
  { key: 'languageAnalysis', label: '语言表达', icon: '💬' },
  { key: 'techniqueAnalysis', label: '写作技巧', icon: '✨' },
  { key: 'takeaways', label: '值得借鉴', icon: '💡' },
] as const

export default function EssayAnalysisPanel({
  essaySource,
  essayId,
  essayTitle,
  essayContent,
  subject,
  techniques,
}: EssayAnalysisPanelProps) {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<EssayAnalysisResult | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  // Check for saved analysis on mount
  useEffect(() => {
    const checkSaved = async () => {
      try {
        const params = new URLSearchParams({
          essaySource,
          essayId,
          userId: 'anonymous',
        })
        const res = await fetch(`/api/ai/essay-analysis?${params}`)
        const data = await res.json()
        if (data.analysis) {
          setAnalysis(data.analysis)
        }
      } catch {
        // ignore
      } finally {
        setChecked(true)
      }
    }
    checkSaved()
  }, [essaySource, essayId])

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/essay-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          essaySource,
          essayId,
          essayTitle,
          essayContent,
          subject,
          techniques,
          userId: 'anonymous',
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '分析失败')
        return
      }
      setAnalysis(data.analysis)
    } catch {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (!checked) return null

  // Button mode (no analysis yet)
  if (!analysis && !loading) {
    return (
      <div style={{ margin: '0.75rem 0' }}>
        <button
          onClick={handleAnalyze}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.8125rem',
            fontWeight: 500,
            border: '1px solid var(--accent)',
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
          }}
        >
          🤖 AI深度分析
        </button>
        {error && (
          <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.375rem' }}>{error}</p>
        )}
      </div>
    )
  }

  // Loading mode
  if (loading) {
    return (
      <div style={{
        margin: '0.75rem 0',
        padding: '1rem',
        borderRadius: '0.5rem',
        background: 'var(--bg-secondary)',
        textAlign: 'center',
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 0.5rem',
        }} />
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>AI正在深度分析范文...</p>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Results mode
  if (!analysis) return null

  return (
    <div style={{
      margin: '0.75rem 0',
      borderRadius: '0.75rem',
      border: '1px solid var(--border-color)',
      background: 'var(--bg-card)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '0.75rem 1rem',
        background: 'var(--accent-light)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)' }}>
          🤖 AI深度分析
        </span>
        <button
          onClick={handleAnalyze}
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          重新分析
        </button>
      </div>

      {/* Summary */}
      {analysis.summary && (
        <div style={{
          padding: '0.75rem 1rem',
          fontSize: '0.8125rem',
          lineHeight: 1.6,
          color: 'var(--text-primary)',
          borderBottom: '1px solid var(--border-color)',
          fontStyle: 'italic',
        }}>
          {analysis.summary}
        </div>
      )}

      {/* Dimension sections */}
      {DIMENSION_LABELS.map(({ key, label, icon }) => {
        const isExpanded = expandedSection === key
        const data = analysis[key]

        return (
          <div key={key} style={{ borderBottom: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setExpandedSection(isExpanded ? null : key)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.625rem 1rem',
                border: 'none',
                background: isExpanded ? 'var(--bg-secondary)' : 'var(--bg-card)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {icon} {label}
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                transition: 'transform 0.2s',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>
                ▼
              </span>
            </button>

            {isExpanded && data && (
              <div style={{ padding: '0.75rem 1rem' }}>
                {key === 'contentAnalysis' && (
                  <ContentAnalysisView data={data as EssayAnalysisResult['contentAnalysis']} />
                )}
                {key === 'structureAnalysis' && (
                  <StructureAnalysisView data={data as EssayAnalysisResult['structureAnalysis']} />
                )}
                {key === 'languageAnalysis' && (
                  <LanguageAnalysisView data={data as EssayAnalysisResult['languageAnalysis']} />
                )}
                {key === 'techniqueAnalysis' && (
                  <TechniqueAnalysisView data={data as EssayAnalysisResult['techniqueAnalysis']} />
                )}
                {key === 'takeaways' && (
                  <TakeawaysView data={data as EssayAnalysisResult['takeaways']} />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ContentAnalysisView({ data }: { data: EssayAnalysisResult['contentAnalysis'] }) {
  return (
    <div style={{ fontSize: '0.8125rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
      <p><strong>立意：</strong>{data.theme}</p>
      <p><strong>深度：</strong>{data.depth}</p>
      <p><strong>切题：</strong>{data.relevance}</p>
      {data.examples.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>原文体现：</p>
          {data.examples.map((ex, i) => (
            <p key={i} style={{
              margin: '0.25rem 0',
              padding: '0.375rem 0.75rem',
              borderLeft: '3px solid var(--accent)',
              background: 'var(--bg-secondary)',
              borderRadius: '0 0.25rem 0.25rem 0',
              fontStyle: 'italic',
            }}>
              &ldquo;{ex}&rdquo;
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function StructureAnalysisView({ data }: { data: EssayAnalysisResult['structureAnalysis'] }) {
  return (
    <div style={{ fontSize: '0.8125rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
      <p><strong>总览：</strong>{data.overview}</p>
      <p><strong>段落衔接：</strong>{data.flow}</p>
      {data.strengths.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>结构优点：</p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {data.strengths.map((s, i) => (
              <li key={i} style={{ marginBottom: '0.25rem' }}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function LanguageAnalysisView({ data }: { data: EssayAnalysisResult['languageAnalysis'] }) {
  return (
    <div style={{ fontSize: '0.8125rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
      <p><strong>风格：</strong>{data.style}</p>
      {data.techniques.length > 0 && (
        <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {data.techniques.map((t, i) => (
            <span key={i} className="model-essay-technique-badge">{t}</span>
          ))}
        </div>
      )}
      {data.highlights.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>语言亮点：</p>
          {data.highlights.map((h, i) => (
            <p key={i} style={{
              margin: '0.25rem 0',
              padding: '0.375rem 0.75rem',
              borderLeft: '3px solid var(--accent)',
              background: 'var(--bg-secondary)',
              borderRadius: '0 0.25rem 0.25rem 0',
            }}>
              {h}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function TechniqueAnalysisView({ data }: { data: EssayAnalysisResult['techniqueAnalysis'] }) {
  return (
    <div style={{ fontSize: '0.8125rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
      {data.techniques.map((t, i) => (
        <div key={i} style={{
          marginBottom: '0.75rem',
          padding: '0.5rem 0.75rem',
          borderRadius: '0.5rem',
          background: 'var(--bg-secondary)',
        }}>
          <p style={{ fontWeight: 600, margin: '0 0 0.25rem' }}>{t.name}</p>
          <p style={{ margin: '0 0 0.25rem' }}>{t.explanation}</p>
          {t.example && (
            <p style={{
              margin: 0,
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              borderLeft: '2px solid var(--accent)',
              paddingLeft: '0.5rem',
            }}>
              原文：&ldquo;{t.example}&rdquo;
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

function TakeawaysView({ data }: { data: EssayAnalysisResult['takeaways'] }) {
  const categoryColors: Record<string, string> = {
    '内容': '#3b82f6',
    '结构': '#8b5cf6',
    '语言': '#10b981',
    '技巧': '#f59e0b',
  }

  return (
    <div style={{ fontSize: '0.8125rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
      {data.map((t, i) => (
        <div key={i} style={{
          marginBottom: '0.75rem',
          padding: '0.5rem 0.75rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
            <span style={{
              fontSize: '0.6875rem',
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              background: categoryColors[t.category] || 'var(--accent)',
              color: '#fff',
              fontWeight: 600,
            }}>
              {t.category}
            </span>
            <span style={{ fontWeight: 600 }}>{t.point}</span>
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            <strong>如何应用：</strong>{t.howToApply}
          </p>
        </div>
      ))}
    </div>
  )
}
