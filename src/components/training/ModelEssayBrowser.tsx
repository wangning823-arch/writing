'use client'

import { useState } from 'react'
import { MODEL_ESSAYS, type ModelEssay } from '@/lib/model-essays'
import { BookIcon } from '@/components/icons'

interface ModelEssayBrowserProps {
  onBack: () => void
  initialSubject?: 'chinese' | 'english'
}

const LEVEL_LABELS: Record<string, Record<number, string>> = {
  chinese: {
    3: '开头段专项',
    4: '论证段专项',
    5: '过渡段专项',
    6: '结尾段专项',
    7: '全文整合',
  },
  english: {
    1: '句式仿写',
    2: '段落骨架',
    3: '应用文格式',
    4: '读后续写',
    5: '语法纠错',
    6: '全文写作',
  },
}

export default function ModelEssayBrowser({ onBack, initialSubject }: ModelEssayBrowserProps) {
  const subject = initialSubject || 'chinese'
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set())
  const [collectingId, setCollectingId] = useState<string | null>(null)

  const essays = MODEL_ESSAYS.filter(e => e.subject === subject)

  // Group by level
  const grouped = essays.reduce<Record<number, ModelEssay[]>>((acc, essay) => {
    if (!acc[essay.level]) acc[essay.level] = []
    acc[essay.level].push(essay)
    return acc
  }, {})

  const handleCollect = async (essay: ModelEssay) => {
    setCollectingId(essay.id)
    try {
      const res = await fetch('/api/materials/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: essay.content,
          source: '范文',
          tags: essay.techniques,
          category: essay.abilityPoint,
          subject: essay.subject,
        }),
      })
      if (res.ok) {
        setCollectedIds((prev) => new Set(prev).add(essay.id))
      }
    } catch {
      // silently fail
    } finally {
      setCollectingId(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <header className="header">
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={onBack}
              style={{ color: 'var(--text-muted)', cursor: 'pointer', border: 'none', background: 'none', fontSize: '1.25rem' }}
            >
              &larr;
            </button>
            <div>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookIcon size={16} /> {subject === 'chinese' ? '语文' : '英语'}范文赏析
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>阅读优秀范文，学习写作技巧</p>
            </div>
          </div>
        </div>
      </header>

      <main className="app-container">
        {/* Essays grouped by level */}
        {Object.entries(grouped).map(([levelStr, levelEssays]) => {
          const level = parseInt(levelStr, 10)
          const labels = LEVEL_LABELS[subject] || {}
          const label = labels[level] || `L${level}`

          return (
            <section key={level} className="training-section">
              <h3 className="training-section-title">
                L{level} {label}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {levelEssays.map((essay) => {
                  const isExpanded = expandedId === essay.id
                  return (
                    <div
                      key={essay.id}
                      style={{
                        borderRadius: '0.75rem',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-card)',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Header - clickable */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : essay.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.875rem 1rem',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {essay.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                            {essay.abilityPoint} · {essay.genre}
                          </div>
                        </div>
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          transition: 'transform 0.2s',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}>
                          ▼
                        </span>
                      </button>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid var(--border-color)' }}>
                          {/* Essay content */}
                          <div style={{
                            padding: '0.75rem 1rem',
                            margin: '0.75rem 0',
                            borderRadius: '0.5rem',
                            background: 'var(--bg-secondary)',
                            fontSize: '0.875rem',
                            lineHeight: 1.7,
                            color: 'var(--text-primary)',
                            whiteSpace: 'pre-wrap',
                          }}>
                            {essay.content}
                          </div>

                          {/* Analysis */}
                          <div style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            background: 'var(--accent-light)',
                            fontSize: '0.8125rem',
                            lineHeight: 1.6,
                            color: 'var(--text-primary)',
                            marginBottom: '0.75rem',
                          }}>
                            <span style={{ fontWeight: 600 }}>赏析：</span>{essay.analysis}
                          </div>

                          {/* Techniques */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                            {essay.techniques.map((t) => (
                              <span key={t} className="model-essay-technique-badge">{t}</span>
                            ))}
                          </div>

                          {/* Collect button */}
                          <button
                            onClick={() => handleCollect(essay)}
                            disabled={collectingId === essay.id || collectedIds.has(essay.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '0.5rem',
                              fontSize: '0.8125rem',
                              fontWeight: 500,
                              border: collectedIds.has(essay.id) ? '1px solid var(--border-color)' : '1px solid var(--accent)',
                              background: collectedIds.has(essay.id) ? 'var(--bg-secondary)' : 'var(--accent-light)',
                              color: collectedIds.has(essay.id) ? 'var(--text-secondary)' : 'var(--accent)',
                              cursor: collectingId === essay.id || collectedIds.has(essay.id) ? 'default' : 'pointer',
                            }}
                          >
                            {collectedIds.has(essay.id)
                              ? '✓ 已收藏'
                              : collectingId === essay.id
                                ? '收藏中...'
                                : '🌟 收藏素材'}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}

        {essays.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</p>
            <p>暂无{subject === 'chinese' ? '语文' : '英语'}范文</p>
          </div>
        )}
      </main>
    </div>
  )
}
