'use client'

import { useState, useEffect, useCallback } from 'react'
import { BookIcon } from '@/components/icons'

interface Material {
  id: string
  content: string
  source: string
  tags: string[]
  category: string
  subject: string
  usageCount: number
  createdAt: string
}

interface MaterialLibraryProps {
  userId: string
  subject: 'chinese' | 'english'
}

const SORT_OPTIONS = [
  { value: 'newest', label: '最新' },
  { value: 'popular', label: '最常用' },
]

const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  '范文': { bg: '#dbeafe', text: '#1e40af' },
  'AI推荐': { bg: '#f3e8ff', text: '#7c3aed' },
  '学生整理': { bg: '#dcfce7', text: '#166534' },
}

export default function MaterialLibrary({ userId, subject }: MaterialLibraryProps) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const [sort, setSort] = useState('newest')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>(['全部'])

  const fetchMaterials = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        userId,
        subject,
        sort,
      })
      if (category !== '全部') params.set('category', category)
      if (searchQuery) params.set('q', searchQuery)

      const res = await fetch(`/api/materials/search?${params}`)
      if (res.ok) {
        const data = await res.json()
        setMaterials(data.materials || [])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [userId, subject, category, sort, searchQuery])

  useEffect(() => {
    fetchMaterials()
  }, [fetchMaterials])

  // Fetch categories from database
  useEffect(() => {
    fetch(`/api/materials/categories?subject=${subject}`)
      .then(r => r.json())
      .then(data => {
        const cats = (data.categories || [])
          .map((c: { name: string }) => c.name)
        setCategories(['全部', ...cats])
      })
      .catch(() => setCategories(['全部', '论据', '名言', '事例', '好词好句']))
  }, [subject])

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return
    }
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  const handleUseMaterial = async (id: string, content: string) => {
    try {
      await copyToClipboard(content)
      await fetch(`/api/materials/${id}/use`, { method: 'POST' })
      setCopiedId(id)
      setMaterials(prev =>
        prev.map(m => m.id === id ? { ...m, usageCount: m.usageCount + 1 } : m)
      )
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // silently fail
    }
  }

  return (
    <div className="material-library">
      {/* Header */}
      <div className="ml-header">
        <h2 className="ml-title">素材库</h2>
        <span className="ml-count">{materials.length} 个素材</span>
      </div>

      {/* Search and Filters */}
      <div className="ml-filters">
        <div className="ml-search-row">
          <input
            type="text"
            className="ml-search-input"
            placeholder="搜索素材内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="ml-sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="ml-category-tabs">
          {categories.map((cat: string) => (
            <button
              key={cat}
              className={`ml-category-tab ${category === cat ? 'ml-category-active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="ml-empty">
          <div className="ml-loading-spinner" />
          <p>加载中...</p>
        </div>
      ) : materials.length === 0 ? (
        <div className="ml-empty">
          <span className="ml-empty-icon"><BookIcon size={32} /></span>
          <p className="ml-empty-text">还没有收藏素材，去范文赏析中收藏吧</p>
        </div>
      ) : (
        <div className="ml-grid">
          {materials.map(material => (
            <div
              key={material.id}
              className="ml-card"
              onClick={() => setExpandedId(expandedId === material.id ? null : material.id)}
            >
              {/* Source badge */}
              <div className="ml-card-header">
                <span
                  className="ml-source-badge"
                  style={{
                    background: SOURCE_COLORS[material.source]?.bg || '#f3f4f6',
                    color: SOURCE_COLORS[material.source]?.text || '#374151',
                  }}
                >
                  {material.source}
                </span>
                <span className="ml-category-tag">{material.category}</span>
              </div>

              {/* Content preview */}
              <p className={`ml-card-content ${expandedId === material.id ? 'ml-card-expanded' : ''}`}>
                {material.content}
              </p>

              {/* Tags */}
              {material.tags.length > 0 && (
                <div className="ml-card-tags">
                  {material.tags.map((tag, i) => (
                    <span key={i} className="ml-tag">{tag}</span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="ml-card-footer">
                <span className="ml-usage-count">
                  使用 {material.usageCount} 次
                </span>
                <div className="ml-card-actions">
                  <button
                    className={`ml-use-btn ${copiedId === material.id ? 'copied' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleUseMaterial(material.id, material.content) }}
                  >
                    {copiedId === material.id ? '已复制' : '复制素材'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
