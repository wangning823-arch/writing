'use client'

import { useState } from 'react'
import { DiffSegment } from '@/types'

interface DiffViewProps {
  segments: DiffSegment[]
  /** Callback when user changes the status of a segment. */
  onStatusChange?: (segmentId: string, status: DiffSegment['suggestionStatus']) => void
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  resolved: { label: '已解决', color: '#166534', bg: '#dcfce7' },
  unresolved: { label: '未解决', color: '#92400e', bg: '#fef3c7' },
  misdirected: { label: '偏差', color: '#991b1b', bg: '#fee2e2' },
  'new-issue': { label: '新问题', color: '#1e40af', bg: '#dbeafe' },
}

export default function DiffView({ segments, onStatusChange }: DiffViewProps) {
  const [animatingId, setAnimatingId] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<'original' | 'revised'>('original')

  const handleStatusChange = (id: string, status: DiffSegment['suggestionStatus']) => {
    setAnimatingId(id)
    setTimeout(() => {
      onStatusChange?.(id, status)
      setTimeout(() => setAnimatingId(null), 300)
    }, 10)
  }

  const modifiedSegments = segments.filter(s => s.status === 'modified')

  return (
    <div className="diff-view">
      <div className="diff-legend">
        <span className="diff-legend-item">
          <span className="diff-legend-swatch diff-legend-deleted" /> 删除
        </span>
        <span className="diff-legend-item">
          <span className="diff-legend-swatch diff-legend-added" /> 新增
        </span>
        <span className="diff-legend-item">
          <span className="diff-legend-swatch diff-legend-modified" /> 修改
        </span>
      </div>

      {/* Mobile tabs for modified segments */}
      {modifiedSegments.length > 0 && (
        <div className="diff-mobile-tabs">
          <button
            className={`diff-mobile-tab ${mobileTab === 'original' ? 'diff-mobile-tab-active' : ''}`}
            onClick={() => setMobileTab('original')}
          >
            原文
          </button>
          <button
            className={`diff-mobile-tab ${mobileTab === 'revised' ? 'diff-mobile-tab-active' : ''}`}
            onClick={() => setMobileTab('revised')}
          >
            修改后
          </button>
        </div>
      )}

      <div className="diff-segments">
        {segments.map((seg) => {
          const isAnimating = animatingId === seg.id

          if (seg.status === 'unchanged') {
            return (
              <div key={seg.id} className="diff-segment diff-unchanged">
                <p className="diff-text">{seg.original}</p>
              </div>
            )
          }

          if (seg.status === 'deleted') {
            return (
              <div key={seg.id} className="diff-segment diff-deleted">
                <p className="diff-text diff-text-deleted">{seg.original}</p>
                {renderStatusBadge(seg, isAnimating, handleStatusChange)}
              </div>
            )
          }

          if (seg.status === 'added') {
            return (
              <div key={seg.id} className="diff-segment diff-added">
                <p className="diff-text diff-text-added">{seg.revised}</p>
                {renderStatusBadge(seg, isAnimating, handleStatusChange)}
              </div>
            )
          }

          // Modified: side by side on desktop, tabbed on mobile
          return (
            <div key={seg.id} className={`diff-segment diff-modified ${isAnimating ? 'diff-segment-animate' : ''}`}>
              <div className="diff-side-by-side">
                <div className="diff-side diff-side-original">
                  <span className="diff-side-label">原文</span>
                  <p className="diff-text diff-text-deleted">{seg.original}</p>
                </div>
                <div className="diff-side diff-side-revised">
                  <span className="diff-side-label">修改</span>
                  <p className="diff-text diff-text-added">{seg.revised}</p>
                </div>
              </div>
              {/* Mobile: show only active tab content */}
              <div className="diff-mobile-single">
                {mobileTab === 'original' ? (
                  <div className="diff-side diff-side-original">
                    <span className="diff-side-label">原文</span>
                    <p className="diff-text diff-text-deleted">{seg.original}</p>
                  </div>
                ) : (
                  <div className="diff-side diff-side-revised">
                    <span className="diff-side-label">修改</span>
                    <p className="diff-text diff-text-added">{seg.revised}</p>
                  </div>
                )}
              </div>
              {renderStatusBadge(seg, isAnimating, handleStatusChange)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function renderStatusBadge(
  seg: DiffSegment,
  isAnimating: boolean,
  onStatusChange: (id: string, status: DiffSegment['suggestionStatus']) => void
) {
  if (!seg.suggestionStatus) return null
  const meta = STATUS_LABELS[seg.suggestionStatus]

  return (
    <div className={`diff-status-row ${isAnimating ? 'diff-status-animate' : ''}`}>
      <span
        className="diff-status-badge"
        style={{ background: meta.bg, color: meta.color }}
      >
        {meta.label}
      </span>
      <div className="diff-status-actions">
        {(Object.keys(STATUS_LABELS) as DiffSegment['suggestionStatus'][]).map((s) => {
          if (s === seg.suggestionStatus) return null
          const m = STATUS_LABELS[s!]
          return (
            <button
              key={s}
              className="diff-status-action-btn"
              style={{ color: m.color }}
              onClick={() => onStatusChange(seg.id, s)}
              title={`标记为 ${m.label}`}
            >
              → {m.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
