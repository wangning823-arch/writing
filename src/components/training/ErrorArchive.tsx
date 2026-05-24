'use client'

import { useMemo } from 'react'

export interface ErrorRecord {
  errorType: string
  subType?: string
  location: string
  explanation: string
  severity: string
  count: number
}

interface ErrorArchiveProps {
  errors: ErrorRecord[]
}

const TYPE_LABELS: Record<string, string> = {
  '逻辑类': '逻辑类',
  '结构类': '结构类',
  '语言类': '语言类',
  '规范类': '规范类',
}

const TYPE_COLORS: Record<string, string> = {
  '逻辑类': 'error-type-logic',
  '结构类': 'error-type-structure',
  '语言类': 'error-type-language',
  '规范类': 'error-type-norms',
}

const SEVERITY_LABELS: Record<string, string> = {
  high: '严重',
  medium: '中等',
  low: '轻微',
}

const SEVERITY_COLORS: Record<string, string> = {
  high: 'var(--danger)',
  medium: 'var(--warning)',
  low: 'var(--text-muted)',
}

export default function ErrorArchive({ errors }: ErrorArchiveProps) {
  const grouped = useMemo(() => {
    const groups: Record<string, ErrorRecord[]> = {}
    for (const err of errors) {
      const category = err.errorType.split('-')[0] || err.errorType
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(err)
    }
    return groups
  }, [errors])

  const categories = Object.keys(TYPE_LABELS).filter((k) => grouped[k]?.length > 0)

  return (
    <div className="error-archive">
      <h3 className="error-archive-title">
        <span style={{ fontSize: '1rem' }}>&#128203;</span>
        错误档案
      </h3>

      {errors.length === 0 ? (
        <div className="error-archive-empty">
          暂无记录，继续保持！
        </div>
      ) : (
        <div className="error-archive-groups">
          {categories.map((category) => (
            <div key={category} className="error-archive-group">
              <div className="error-archive-group-header">
                <span className={`error-type-badge ${TYPE_COLORS[category] || ''}`}>
                  {TYPE_LABELS[category] || category}
                </span>
                <span className="error-archive-group-count">
                  {grouped[category].length} 个问题
                </span>
              </div>

              <div className="error-archive-group-items">
                {grouped[category].map((err, i) => (
                  <div key={i} className="error-archive-item">
                    <div className="error-archive-item-header">
                      {err.subType && (
                        <span className="error-archive-subtype">{err.subType}</span>
                      )}
                      <span
                        className="error-archive-severity"
                        style={{ color: SEVERITY_COLORS[err.severity] || 'var(--text-muted)' }}
                      >
                        {SEVERITY_LABELS[err.severity] || err.severity}
                      </span>
                      {err.count > 1 && (
                        <span className="error-archive-count">
                          x{err.count}
                        </span>
                      )}
                    </div>
                    <div className="error-archive-item-location">
                      {err.location}
                    </div>
                    <div className="error-archive-item-explanation">
                      {err.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
