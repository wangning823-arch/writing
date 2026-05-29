'use client'

import { useState, useEffect, useCallback } from 'react'
import EssayAnalysisPanel from './EssayAnalysisPanel'
import EssayContent from './EssayContent'

// Theme keyword mapping: tag → theme name (for database query)
const TAG_TO_THEME: Record<string, string> = {
  '人生': '人生成长', '成长': '人生成长', '青春': '人生成长', '梦想': '人生成长', '奋斗': '人生成长',
  '文化': '传统文化', '传统': '传统文化', '传承': '传统文化', '经典': '传统文化',
  '劳动': '劳动实践', '实践': '劳动实践',
  '哲理': '哲理思辨', '思辨': '哲理思辨', '思考': '哲理思辨', '辩证': '哲理思辨',
  '家国': '家国情怀', '爱国': '家国情怀', '责任': '家国情怀', '时代': '家国情怀',
  '情感': '情感世界', '亲情': '情感世界', '友情': '情感世界',
  '教育': '教育学习', '学习': '教育学习', '读书': '教育学习',
  '社会': '社会变迁', '变化': '社会变迁', '发展': '社会变迁',
  '科技': '科技创新', '人工智能': '科技创新', '创新': '科技创新', '互联网': '科技创新',
  '自然': '自然生态', '生态': '自然生态', '环保': '自然生态',
  '艺术': '艺术审美', '审美': '艺术审美', '美': '艺术审美',
}

interface EssayData {
  id: string
  title: string
  content: string
  source: string
  year?: number | null
  region?: string | null
  topicId?: string
  theme?: string | null
  abilityPoint?: string | null
  level?: number | null
  techniques?: string[]
  genre?: string | null
  analysis?: string | null
}

interface ModelEssayViewerProps {
  subject: 'chinese' | 'english'
  level: number
  topicId?: string
  topicTags?: string[]
}

export default function ModelEssayViewer({ subject, level, topicId, topicTags }: ModelEssayViewerProps) {
  const [expanded, setExpanded] = useState(false)
  const [modelEssays, setModelEssays] = useState<EssayData[]>([])
  const [gaokaoEssays, setGaokaoEssays] = useState<EssayData[]>([])
  const [collectingId, setCollectingId] = useState<string | null>(null)
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchEssays = async () => {
      try {
        // Fetch curated teaching essays from database
        const modelRes = await fetch(`/api/essays?source=model&subject=${subject}&level=${level}`)
        const modelData = await modelRes.json()
        setModelEssays(modelData.essays || [])

        // Fetch gaokao essays from database
        let gaokaoUrl = ''
        if (subject === 'english' && topicId) {
          gaokaoUrl = `/api/essays?topicIds=${topicId}&limit=5`
        } else if (subject === 'chinese') {
          if (topicId) {
            gaokaoUrl = `/api/essays?topicIds=${topicId}&limit=5`
          } else if (topicTags && topicTags.length > 0) {
            // Match tags → theme names, query by theme
            const matchedThemes = new Set<string>()
            for (const tag of topicTags) {
              const theme = TAG_TO_THEME[tag]
              if (theme) matchedThemes.add(theme)
            }
            const allGaokao: EssayData[] = []
            for (const theme of matchedThemes) {
              if (allGaokao.length >= 5) break
              const res = await fetch(`/api/essays?theme=${encodeURIComponent(theme)}&limit=5`)
              const data = await res.json()
              allGaokao.push(...(data.essays || []))
            }
            setGaokaoEssays(allGaokao.slice(0, 5))
            return
          }
        }

        if (gaokaoUrl) {
          const gaokaoRes = await fetch(gaokaoUrl)
          const gaokaoData = await gaokaoRes.json()
          setGaokaoEssays(gaokaoData.essays || [])
        }
      } catch {
        // silently fail
      }
    }

    fetchEssays()
  }, [subject, level, topicId, topicTags])

  const handleCollect = useCallback(async (essay: EssayData) => {
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
  }, [subject])

  if (modelEssays.length === 0 && gaokaoEssays.length === 0) return null

  return (
    <div className="model-essay-viewer">
      <div
        className="writing-tip-header"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded)
        }}
      >
        <span className="writing-tip-title">
          <span style={{ fontSize: '1rem' }}>&#128214;</span>
          范文赏析（推荐）
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            transition: 'transform 0.2s',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          &#9660;
        </span>
      </div>

      {expanded && (
        <div className="model-essay-body">
          {modelEssays.map((essay) => (
            <div key={essay.id} className="model-essay-card">
              <div className="model-essay-card-header">
                <h4 className="model-essay-card-title">{essay.title}</h4>
                <button
                  className="model-essay-collect-btn"
                  onClick={() => handleCollect(essay)}
                  disabled={collectingId === essay.id || collectedIds.has(essay.id)}
                >
                  {collectedIds.has(essay.id)
                    ? '已收藏'
                    : collectingId === essay.id
                      ? '收藏中...'
                      : '收藏素材'}
                </button>
              </div>

              <div className="model-essay-card-content">
                <EssayContent content={essay.content} />
              </div>

              {essay.analysis && (
                <div className="model-essay-card-analysis">
                  <span className="model-essay-analysis-label">赏析：</span>
                  {essay.analysis}
                </div>
              )}

              {essay.techniques && essay.techniques.length > 0 && (
                <div className="model-essay-card-techniques">
                  {essay.techniques.map((t) => (
                    <span key={t} className="model-essay-technique-badge">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <EssayAnalysisPanel
                essaySource="model"
                essayId={essay.id}
                essayTitle={essay.title}
                essayContent={essay.content}
                subject={subject}
                techniques={essay.techniques}
              />
            </div>
          ))}

          {/* Topic-specific gaokao essays */}
          {gaokaoEssays.length > 0 && (
            <>
              <div style={{ margin: '1rem 0 0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  历年高考满分/优秀范文
                </h4>
              </div>
              {gaokaoEssays.map((essay, idx) => (
                <div key={`gaokao-${idx}`} className="model-essay-card">
                  <div className="model-essay-card-header">
                    <h4 className="model-essay-card-title">
                      {essay.title}
                      {essay.year && <span style={{ fontWeight: 400, fontSize: '0.75rem', color: 'var(--text-secondary)' }}> ({essay.year})</span>}
                    </h4>
                  </div>
                  <div className="model-essay-card-content">
                    <EssayContent content={essay.content} />
                  </div>
                  <EssayAnalysisPanel
                    essaySource="gaokao"
                    essayId={essay.id}
                    essayTitle={essay.title}
                    essayContent={essay.content}
                    subject={subject}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
