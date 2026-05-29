'use client'

import { useState, useEffect } from 'react'
import { BookIcon } from '@/components/icons'
import EssayAnalysisPanel from './EssayAnalysisPanel'
import EssayContent from './EssayContent'

const CHINESE_THEMES = [
  '人生成长', '传统文化', '劳动实践', '哲理思辨', '家国情怀',
  '情感世界', '教育学习', '社会变迁', '科技创新', '自然生态', '艺术审美',
]

interface EssayData {
  id: string
  title: string
  content: string
  source: string
  year?: number | null
  region?: string | null
  theme?: string | null
  abilityPoint?: string | null
  level?: number | null
  techniques?: string[]
  genre?: string | null
  analysis?: string | null
}

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
  const [modelEssays, setModelEssays] = useState<EssayData[]>([])
  const [themeEssays, setThemeEssays] = useState<Record<string, EssayData[]>>({})
  const [englishEssays, setEnglishEssays] = useState<Record<string, EssayData[]>>({})

  // Fetch all data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch curated teaching essays
        const modelRes = await fetch(`/api/essays?source=model&subject=${subject}`)
        const modelData = await modelRes.json()
        setModelEssays(modelData.essays || [])

        // Fetch gaokao essays
        if (subject === 'chinese') {
          const grouped: Record<string, EssayData[]> = {}
          for (const theme of CHINESE_THEMES) {
            const res = await fetch(`/api/essays?theme=${encodeURIComponent(theme)}&limit=10`)
            const data = await res.json()
            if (data.essays?.length) grouped[theme] = data.essays
          }
          setThemeEssays(grouped)
        } else {
          const res = await fetch(`/api/essays?subject=english&limit=200`)
          const data = await res.json()
          const grouped: Record<string, EssayData[]> = {}
          for (const essay of data.essays || []) {
            const key = essay.topicId || 'other'
            if (!grouped[key]) grouped[key] = []
            grouped[key].push(essay)
          }
          setEnglishEssays(grouped)
        }
      } catch {
        // silently fail
      }
    }
    fetchData()
  }, [subject])

  // Group model essays by level
  const grouped = modelEssays.reduce<Record<number, EssayData[]>>((acc, essay) => {
    const lvl = essay.level || 0
    if (!acc[lvl]) acc[lvl] = []
    acc[lvl].push(essay)
    return acc
  }, {})

  const handleCollect = async (essay: EssayData) => {
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
          subject,
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
        {/* Model essays grouped by level */}
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

                      {isExpanded && (
                        <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid var(--border-color)' }}>
                          <div style={{
                            padding: '0.75rem 1rem',
                            margin: '0.75rem 0',
                            borderRadius: '0.5rem',
                            background: 'var(--bg-secondary)',
                            fontSize: '0.875rem',
                            lineHeight: 1.7,
                            color: 'var(--text-primary)',
                          }}>
                            <EssayContent content={essay.content} />
                          </div>

                          {essay.analysis && (
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
                          )}

                          {essay.techniques && essay.techniques.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                              {essay.techniques.map((t) => (
                                <span key={t} className="model-essay-technique-badge">{t}</span>
                              ))}
                            </div>
                          )}

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

                          <EssayAnalysisPanel
                            essaySource="model"
                            essayId={essay.id}
                            essayTitle={essay.title}
                            essayContent={essay.content}
                            subject={subject}
                            techniques={essay.techniques}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}

        {modelEssays.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</p>
            <p>暂无{subject === 'chinese' ? '语文' : '英语'}范文</p>
          </div>
        )}

        {/* Gaokao essays by theme - Chinese */}
        {subject === 'chinese' && Object.keys(themeEssays).length > 0 && (
          <>
            <div style={{ margin: '2rem 0 1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--accent)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                历年高考满分/优秀范文
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                来源：高考真题满分作文，按主题分类
              </p>
            </div>

            {Object.entries(themeEssays).map(([theme, themeEssayList]) => (
              <section key={theme} className="training-section">
                <h3 className="training-section-title">
                  {theme} ({themeEssayList.length}篇)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {themeEssayList.map((essay, idx) => {
                    const essayKey = `theme-${theme}-${idx}`
                    const isExpanded = expandedId === essayKey
                    return (
                      <div
                        key={essayKey}
                        style={{
                          borderRadius: '0.75rem',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-card)',
                          overflow: 'hidden',
                        }}
                      >
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : essayKey)}
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
                              {essay.year && `${essay.year}年`}
                              {essay.region && ` ${essay.region}`}
                              {' '}{theme}
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

                        {isExpanded && (
                          <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{
                              padding: '0.75rem 1rem',
                              margin: '0.75rem 0',
                              borderRadius: '0.5rem',
                              background: 'var(--bg-secondary)',
                              fontSize: '0.875rem',
                              lineHeight: 1.8,
                              color: 'var(--text-primary)',
                            }}>
                              <EssayContent content={essay.content} />
                            </div>
                            <EssayAnalysisPanel
                              essaySource="gaokao"
                              essayId={essay.id}
                              essayTitle={essay.title}
                              essayContent={essay.content}
                              subject="chinese"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </>
        )}

        {/* English gaokao essays by topic */}
        {subject === 'english' && Object.keys(englishEssays).length > 0 && (
          <>
            <div style={{ margin: '2rem 0 1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--accent)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                高考英语优秀范文
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                来源：高考真题优秀作文，按题型分类
              </p>
            </div>

            {Object.entries(englishEssays).map(([topicId, topicEssayList]) => (
              <section key={topicId} className="training-section">
                <h3 className="training-section-title">
                  {topicId} ({topicEssayList.length}篇)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {topicEssayList.map((essay, idx) => {
                    const essayKey = `english-${topicId}-${idx}`
                    const isExpanded = expandedId === essayKey
                    return (
                      <div
                        key={essayKey}
                        style={{
                          borderRadius: '0.75rem',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-card)',
                          overflow: 'hidden',
                        }}
                      >
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : essayKey)}
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
                              {essay.year && `${essay.year}年`}
                              {essay.region && ` ${essay.region}`}
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

                        {isExpanded && (
                          <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{
                              padding: '0.75rem 1rem',
                              margin: '0.75rem 0',
                              borderRadius: '0.5rem',
                              background: 'var(--bg-secondary)',
                              fontSize: '0.875rem',
                              lineHeight: 1.8,
                              color: 'var(--text-primary)',
                            }}>
                              <EssayContent content={essay.content} />
                            </div>
                            <EssayAnalysisPanel
                              essaySource="gaokao"
                              essayId={essay.id}
                              essayTitle={essay.title}
                              essayContent={essay.content}
                              subject="english"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </>
        )}
      </main>
    </div>
  )
}
