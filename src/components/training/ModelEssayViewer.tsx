'use client'

import { useState, useEffect, useCallback } from 'react'
import { getModelEssays, type ModelEssay } from '@/lib/model-essays'

interface ModelEssayViewerProps {
  subject: 'chinese' | 'english'
  level: number
}

export default function ModelEssayViewer({ subject, level }: ModelEssayViewerProps) {
  const [expanded, setExpanded] = useState(false)
  const [essays, setEssays] = useState<ModelEssay[]>([])
  const [collectingId, setCollectingId] = useState<string | null>(null)
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const found = getModelEssays(subject, level)
    setEssays(found)
  }, [subject, level])

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

  if (essays.length === 0) return null

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
        </div>
      )}
    </div>
  )
}
