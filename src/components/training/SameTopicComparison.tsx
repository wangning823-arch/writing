'use client'

import { useState, useCallback } from 'react'
import ReviewStreamPanel from '@/components/ai/ReviewStreamPanel'

interface SameTopicComparisonProps {
  studentEssay: string
  modelEssay: string
  modelScore: number
  subject: 'chinese' | 'english'
  topic?: string
}

interface ParagraphAnalysis {
  thesis: { student: string; model: string; difference: string }
  structure: { student: string; model: string; difference: string }
  evidence: { student: string; model: string; difference: string }
  language: { student: string; model: string; difference: string }
}

interface ParagraphComparison {
  studentParagraph: string
  modelParagraph: string
  analysis: ParagraphAnalysis
}

interface ComparisonResult {
  paragraphComparisons: ParagraphComparison[]
  overallAnalysis: {
    thesisDepth: { summary: string; advice: string }
    structureArrangement: { summary: string; advice: string }
    evidenceUsage: { summary: string; advice: string }
    languageExpression: { summary: string; advice: string }
  }
  keyTakeaways: string[]
}

const DIMENSION_META = [
  { key: 'thesis', label: '立意', color: '#3b82f6' },
  { key: 'structure', label: '结构', color: '#8b5cf6' },
  { key: 'evidence', label: '论据', color: '#22c55e' },
  { key: 'language', label: '语言', color: '#f59e0b' },
] as const

export default function SameTopicComparison({
  studentEssay,
  modelEssay,
  modelScore,
  subject,
  topic,
}: SameTopicComparisonProps) {
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [streamText, setStreamText] = useState('')
  const [streamError, setStreamError] = useState<string | null>(null)
  const [expandedParagraph, setExpandedParagraph] = useState<number | null>(null)
  const [expandedOverall, setExpandedOverall] = useState<string | null>(null)

  // Split essays into paragraphs
  const studentParagraphs = studentEssay
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
  const modelParagraphs = modelEssay
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  // Pad shorter array with empty strings
  const maxLen = Math.max(studentParagraphs.length, modelParagraphs.length)
  const paddedStudent = [...studentParagraphs, ...Array(maxLen - studentParagraphs.length).fill('')]
  const paddedModel = [...modelParagraphs, ...Array(maxLen - modelParagraphs.length).fill('')]

  const handleCompare = useCallback(async () => {
    setIsAnalyzing(true)
    setError(null)
    setStreamText('')
    setStreamError(null)
    try {
      const res = await fetch('/api/ai/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentEssay, modelEssay, subject, topic, stream: true }),
      })
      if (!res.ok) {
        const data = await res.json()
        setStreamError(data.error || '对比分析失败')
        setIsAnalyzing(false)
        return
      }
      const reader = res.body?.getReader()
      if (!reader) { setStreamError('无法读取响应流'); setIsAnalyzing(false); return }
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
            else if (event.type === 'result') setResult(event.data)
            else if (event.type === 'error') setStreamError(event.message)
          } catch {}
        }
      }
    } catch {
      setStreamError('网络错误，请重试')
    } finally {
      setIsAnalyzing(false)
    }
  }, [studentEssay, modelEssay, subject, topic])

  const overallItems = result
    ? [
        { key: 'thesisDepth', label: '立意深度', meta: DIMENSION_META[0] },
        { key: 'structureArrangement', label: '结构安排', meta: DIMENSION_META[1] },
        { key: 'evidenceUsage', label: '论据运用', meta: DIMENSION_META[2] },
        { key: 'languageExpression', label: '语言表达', meta: DIMENSION_META[3] },
      ]
    : []

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '0.75rem',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            同题对比
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
            {subject === 'chinese' ? '语文' : '英语'} · 范文评分 {modelScore}分
          </p>
        </div>
        {!result && (
          <button
            onClick={handleCompare}
            disabled={isAnalyzing}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 500,
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              opacity: isAnalyzing ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            {isAnalyzing ? '分析中...' : '开始对比'}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '0.75rem 1.25rem',
          background: 'var(--danger-light)',
          color: 'var(--danger)',
          fontSize: '0.8125rem',
        }}>
          {error}
        </div>
      )}

      {/* Side-by-side paragraphs */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
        }} className="comparison-grid">
          {/* Column headers */}
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--accent)',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid var(--accent)',
            textAlign: 'center',
          }}>
            学生作文
          </div>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--success)',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid var(--success)',
            textAlign: 'center',
          }}>
            范文（{modelScore}分）
          </div>

          {/* Paragraph pairs */}
          {paddedStudent.map((sPara, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <div
                style={{
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                  lineHeight: 1.7,
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-wrap',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedParagraph(expandedParagraph === i ? null : i)}
              >
                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  display: 'block',
                  marginBottom: '0.25rem',
                }}>
                  第{i + 1}段
                </span>
                {sPara || (
                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    （无内容）
                  </span>
                )}
              </div>
              <div
                style={{
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                  lineHeight: 1.7,
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-wrap',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedParagraph(expandedParagraph === i ? null : i)}
              >
                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: 'var(--success)',
                  display: 'block',
                  marginBottom: '0.25rem',
                }}>
                  第{i + 1}段
                </span>
                {paddedModel[i] || (
                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    （无内容）
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Analysis for expanded paragraph */}
        {result && expandedParagraph !== null && result.paragraphComparisons[expandedParagraph] && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'var(--bg-secondary)',
            borderRadius: '0.5rem',
            border: '1px solid var(--border-color)',
          }}>
            <h4 style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
            }}>
              第{expandedParagraph + 1}段对比分析
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
            }}>
              {DIMENSION_META.map((dim) => {
                const analysis = result.paragraphComparisons[expandedParagraph].analysis
                const data = analysis[dim.key as keyof ParagraphAnalysis]
                return (
                  <div
                    key={dim.key}
                    style={{
                      padding: '0.625rem',
                      background: 'var(--bg-card)',
                      borderRadius: '0.375rem',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: dim.color,
                      marginBottom: '0.375rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}>
                      <div style={{
                        width: '0.375rem',
                        height: '0.375rem',
                        borderRadius: '50%',
                        background: dim.color,
                      }} />
                      {dim.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <div style={{ marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 500 }}>学生：</span>{data.student}
                      </div>
                      <div style={{ marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 500 }}>范文：</span>{data.model}
                      </div>
                      <div style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
                        {data.difference}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Overall analysis */}
      {result && (
        <div style={{
          padding: '1.25rem',
          borderTop: '1px solid var(--border-color)',
        }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
          }}>
            总体对比分析
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {overallItems.map((item) => {
              const data = result.overallAnalysis[item.key as keyof typeof result.overallAnalysis]
              const isExpanded = expandedOverall === item.key
              return (
                <div
                  key={item.key}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setExpandedOverall(isExpanded ? null : item.key)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.625rem 0.75rem',
                      background: isExpanded ? 'var(--bg-hover)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      borderRadius: '50%',
                      background: item.meta.color,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      flex: 1,
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                    }}>
                      {item.label}
                    </span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        color: 'var(--text-muted)',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div style={{
                      padding: '0 0.75rem 0.75rem',
                      borderTop: '1px solid var(--border-color)',
                    }}>
                      <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: '0.375rem',
                      }}>
                        {data.summary}
                      </p>
                      <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--accent)',
                        lineHeight: 1.6,
                        fontWeight: 500,
                      }}>
                        建议：{data.advice}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Key takeaways */}
          {result.keyTakeaways && result.keyTakeaways.length > 0 && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'var(--accent-light)',
              borderRadius: '0.5rem',
            }}>
              <h4 style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--accent)',
                marginBottom: '0.375rem',
              }}>
                关键收获
              </h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
              }}>
                {result.keyTakeaways.map((takeaway, index) => (
                  <li
                    key={index}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      padding: '0.125rem 0',
                      paddingLeft: '1rem',
                      position: 'relative',
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: 'var(--accent)',
                      fontWeight: 600,
                    }}>
                      {index + 1}.
                    </span>
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {isAnalyzing && (
        <div style={{ padding: '1.25rem' }}>
          <ReviewStreamPanel
            text={streamText}
            error={streamError}
            onRetry={streamError ? () => { setIsAnalyzing(false); setStreamText(''); setStreamError(null) } : undefined}
          />
        </div>
      )}

      {/* Responsive styles */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .comparison-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
