'use client'

import { useState, useEffect, useCallback } from 'react'

interface ErrorCase {
  id: string
  subject: 'chinese' | 'english'
  category: string
  subType: string
  errorExample: string
  correctedExample: string
  explanation: string
  relatedLevel: string
  severity: 'high' | 'medium' | 'low'
}

interface ErrorCaseLibraryProps {
  subject: 'chinese' | 'english'
}

const CHINESE_CATEGORIES = ['逻辑类', '结构类', '语言类', '规范类']
const ENGLISH_CATEGORIES = ['语法类', '句式类', '内容类', '格式类']

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: '严重', color: 'var(--danger-dark)', bg: 'var(--danger-light)' },
  medium: { label: '中等', color: 'var(--warning-dark)', bg: 'var(--warning-light)' },
  low: { label: '轻微', color: 'var(--primary-600)', bg: 'var(--accent-light)' },
}

export default function ErrorCaseLibrary({ subject }: ErrorCaseLibraryProps) {
  const categories = subject === 'chinese' ? CHINESE_CATEGORIES : ENGLISH_CATEGORIES
  const [cases, setCases] = useState<ErrorCase[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set())

  const fetchCases = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ subject, category: activeCategory })
      const res = await fetch(`/api/errors/cases?${params}`)
      if (res.ok) {
        const data = await res.json()
        setCases(data.cases || [])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [subject, activeCategory])

  useEffect(() => {
    fetchCases()
  }, [fetchCases])

  // Load mastered state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bifeng-mastered-errors')
    if (saved) {
      try {
        setMasteredIds(new Set(JSON.parse(saved)))
      } catch { /* ignore */ }
    }
  }, [])

  const totalCases = cases.length
  const masteredCount = cases.filter(c => masteredIds.has(c.id)).length

  const filteredCases = cases.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      c.subType.toLowerCase().includes(q) ||
      c.errorExample.toLowerCase().includes(q) ||
      c.correctedExample.toLowerCase().includes(q) ||
      c.explanation.toLowerCase().includes(q)
    )
  })

  const toggleMastered = (id: string) => {
    setMasteredIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      localStorage.setItem('bifeng-mastered-errors', JSON.stringify([...next]))
      return next
    })
  }

  return (
    <div className="error-case-library">
      {/* Header with stats */}
      <div className="ecl-header">
        <h2 className="ecl-title">错误案例库</h2>
        <p className="ecl-stats">
          共 {totalCases} 个案例，你已掌握 {masteredCount} 个
        </p>
      </div>

      {/* Category tabs */}
      <div className="ecl-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`ecl-tab ${activeCategory === cat ? 'ecl-tab-active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="ecl-search">
        <input
          type="text"
          className="ecl-search-input"
          placeholder={`在${activeCategory}中搜索...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Cases list */}
      {loading ? (
        <div className="ecl-empty">
          <div className="ecl-loading-spinner" />
          <p>加载中...</p>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="ecl-empty">
          <span className="ecl-empty-icon">📋</span>
          <p className="ecl-empty-text">
            {searchQuery ? '没有找到匹配的案例' : '该分类下暂无案例'}
          </p>
        </div>
      ) : (
        <div className="ecl-list">
          {filteredCases.map(errorCase => {
            const sev = SEVERITY_CONFIG[errorCase.severity]
            const isMastered = masteredIds.has(errorCase.id)

            return (
              <div
                key={errorCase.id}
                className={`ecl-case-card ${isMastered ? 'ecl-case-mastered' : ''}`}
              >
                {/* Case header */}
                <div className="ecl-case-header">
                  <span className="ecl-case-subtype">{errorCase.subType}</span>
                  <span
                    className="ecl-severity-badge"
                    style={{ background: sev.bg, color: sev.color }}
                  >
                    {sev.label}
                  </span>
                  <button
                    className={`ecl-master-btn ${isMastered ? 'ecl-mastered' : ''}`}
                    onClick={() => toggleMastered(errorCase.id)}
                  >
                    {isMastered ? '已掌握' : '标记掌握'}
                  </button>
                </div>

                {/* Error example */}
                <div className="ecl-example ecl-error">
                  <span className="ecl-example-label">典型错误</span>
                  <p className="ecl-example-text ecl-error-text">{errorCase.errorExample}</p>
                </div>

                {/* Corrected example */}
                <div className="ecl-example ecl-correct">
                  <span className="ecl-example-label ecl-correct-label">正确写法</span>
                  <p className="ecl-example-text ecl-correct-text">{errorCase.correctedExample}</p>
                </div>

                {/* Explanation */}
                <div className="ecl-explanation">
                  <span className="ecl-explanation-label">解析</span>
                  <p className="ecl-explanation-text">{errorCase.explanation}</p>
                </div>

                {/* Related level */}
                <div className="ecl-related">
                  <span className="ecl-related-label">相关训练：</span>
                  <span className="ecl-related-level">{errorCase.relatedLevel}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
