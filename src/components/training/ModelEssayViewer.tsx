'use client'

import { useState, useEffect, useCallback } from 'react'
import { getModelEssays, type ModelEssay } from '@/lib/model-essays'
import { TOPIC_ESSAYS, THEME_ESSAYS, type TopicModelEssay } from '@/lib/topic-essays'
import ENGLISH_ESSAYS from '@/lib/english-essays.json'

interface ModelEssayViewerProps {
  subject: 'chinese' | 'english'
  level: number
  topicId?: string
  topicTheme?: string
}

export default function ModelEssayViewer({ subject, level, topicId, topicTheme }: ModelEssayViewerProps) {
  const [expanded, setExpanded] = useState(false)
  const [essays, setEssays] = useState<ModelEssay[]>([])
  const [topicEssays, setTopicEssays] = useState<TopicModelEssay[]>([])
  const [collectingId, setCollectingId] = useState<string | null>(null)
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const found = getModelEssays(subject, level)
    setEssays(found)

    // Load topic-specific gaokao essays
    let gaokaoEssays: TopicModelEssay[] = []

    if (subject === 'english' && topicId) {
      // Load English essays from english-essays.json
      const topicData = ENGLISH_ESSAYS.topics.find(t => t.id === topicId)
      if (topicData && topicData.essays) {
        gaokaoEssays = topicData.essays.map(e => ({
          title: e.title,
          content: e.content,
          year: e.year,
          region: e.region,
        }))
      }
    } else if (subject === 'chinese') {
      // Load Chinese gaokao essays from topic-essays.ts
      if (topicId && TOPIC_ESSAYS[topicId]) {
        gaokaoEssays = TOPIC_ESSAYS[topicId]
      } else if (topicTheme && THEME_ESSAYS[topicTheme]) {
        gaokaoEssays = THEME_ESSAYS[topicTheme].slice(0, 5)
      }
    }

    setTopicEssays(gaokaoEssays)
  }, [subject, level, topicId, topicTheme])

  const handleCollect = useCallback(async (essay: ModelEssay) => {
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
  }, [])

  if (essays.length === 0 && topicEssays.length === 0) return null

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
          {essays.map((essay) => (
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
                {essay.content}
              </div>

              <div className="model-essay-card-analysis">
                <span className="model-essay-analysis-label">赏析：</span>
                {essay.analysis}
              </div>

              <div className="model-essay-card-techniques">
                {essay.techniques.map((t) => (
                  <span key={t} className="model-essay-technique-badge">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Topic-specific gaokao essays */}
          {topicEssays.length > 0 && (
            <>
              <div style={{ margin: '1rem 0 0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  历年高考满分/优秀范文
                </h4>
              </div>
              {topicEssays.map((essay, idx) => (
                <div key={`gaokao-${idx}`} className="model-essay-card">
                  <div className="model-essay-card-header">
                    <h4 className="model-essay-card-title">
                      {essay.title}
                      {essay.year && <span style={{ fontWeight: 400, fontSize: '0.75rem', color: 'var(--text-secondary)' }}> ({essay.year})</span>}
                    </h4>
                  </div>
                  <div className="model-essay-card-content">
                    {essay.content}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
