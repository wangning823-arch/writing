'use client'

import { useState } from 'react'
import { THEME_MATERIALS, ALL_THEMES, type MaterialItem } from '@/lib/training/theme-materials'

interface ThemeMaterialLibraryProps {
  onBack: () => void
  userId?: string
}

type MaterialCategory = 'quotes' | 'facts' | 'openings' | 'argumentParagraphs' | 'conclusions'

const CATEGORY_LABELS: Record<MaterialCategory, string> = {
  quotes: '名言金句',
  facts: '事实论据',
  openings: '精彩开头',
  argumentParagraphs: '论证段落',
  conclusions: '精彩结尾',
}

export default function ThemeMaterialLibrary({ onBack, userId }: ThemeMaterialLibraryProps) {
  const [selectedTheme, setSelectedTheme] = useState(ALL_THEMES[0])
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory>('quotes')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const pack = THEME_MATERIALS[selectedTheme]
  if (!pack) return null

  const currentItems = pack[selectedCategory]

  const filteredItems = searchQuery
    ? currentItems.filter((item) => {
        const text = typeof item === 'string' ? item : item.text
        return text.includes(searchQuery)
      })
    : currentItems

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)

    if (userId) {
      try {
        await fetch('/api/materials/collect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: text,
            source: '范文',
            category: '好词好句',
            subject: 'chinese',
            tags: [selectedTheme],
            userId,
          }),
        })
      } catch {}
    }
  }

  const renderQuoteCard = (item: MaterialItem, index: number) => (
    <div
      key={index}
      style={{
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--border-color, #e5e7eb)',
        background: 'var(--bg-card, #fff)',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onClick={() => handleCopy(item.text, index)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#3b82f6'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,130,246,0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color, #e5e7eb)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary, #111827)', margin: 0, lineHeight: 1.6 }}>
        "{item.text}"
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)' }}>
          {item.author && `— ${item.author}`}{item.source && `《${item.source}》`}
        </span>
        <span style={{ fontSize: '0.75rem', color: copiedIndex === index ? '#16a34a' : 'var(--text-tertiary, #9ca3af)' }}>
          {copiedIndex === index ? '✓ 已复制' : '点击复制'}
        </span>
      </div>
    </div>
  )

  const renderFactCard = (item: MaterialItem, index: number) => (
    <div
      key={index}
      style={{
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--border-color, #e5e7eb)',
        background: 'var(--bg-card, #fff)',
        cursor: 'pointer',
      }}
      onClick={() => handleCopy(item.text, index)}
    >
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', margin: 0, lineHeight: 1.6 }}>
        {item.text}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)' }}>
          {item.source && `来源：${item.source}`}
        </span>
        <span style={{ fontSize: '0.75rem', color: copiedIndex === index ? '#16a34a' : 'var(--text-tertiary, #9ca3af)' }}>
          {copiedIndex === index ? '✓ 已复制' : '点击复制'}
        </span>
      </div>
    </div>
  )

  const renderTextCard = (text: string, index: number) => (
    <div
      key={index}
      style={{
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--border-color, #e5e7eb)',
        background: 'var(--bg-card, #fff)',
        cursor: 'pointer',
      }}
      onClick={() => handleCopy(text, index)}
    >
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary, #111827)', margin: 0, lineHeight: 1.8 }}>
        {text}
      </p>
      <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: copiedIndex === index ? '#16a34a' : 'var(--text-tertiary, #9ca3af)' }}>
          {copiedIndex === index ? '✓ 已复制' : '点击复制'}
        </span>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
      <button
        onClick={onBack}
        style={{ border: 'none', background: 'none', color: 'var(--theme_text-weak)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '12px', padding: 0 }}
      >
        ← 返回
      </button>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.5rem' }}>
        主题素材库
      </h2>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1.5rem' }}>
        按高考主题系统化积累素材，点击即可复制到剪贴板
      </p>

      {/* Theme tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {ALL_THEMES.map((theme) => (
          <button
            key={theme}
            onClick={() => setSelectedTheme(theme)}
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: selectedTheme === theme ? '#3b82f6' : 'var(--border-color, #e5e7eb)',
              background: selectedTheme === theme ? '#3b82f6' : 'var(--bg-card, #fff)',
              color: selectedTheme === theme ? '#fff' : 'var(--text-primary, #111827)',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {theme}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color, #e5e7eb)', paddingBottom: '0.5rem' }}>
        {(Object.keys(CATEGORY_LABELS) as MaterialCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              border: 'none',
              background: selectedCategory === cat ? 'var(--bg-secondary, #f3f4f6)' : 'transparent',
              color: selectedCategory === cat ? 'var(--text-primary, #111827)' : 'var(--text-secondary, #6b7280)',
              fontSize: '0.8125rem',
              fontWeight: selectedCategory === cat ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="搜索素材..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border-color, #e5e7eb)',
            background: 'var(--bg-input, #f9fafb)',
            fontSize: '0.875rem',
            color: 'var(--text-primary, #111827)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Materials list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {selectedCategory === 'quotes' && filteredItems.map((item, i) => renderQuoteCard(item as MaterialItem, i))}
        {selectedCategory === 'facts' && filteredItems.map((item, i) => renderFactCard(item as MaterialItem, i))}
        {(selectedCategory === 'openings' || selectedCategory === 'argumentParagraphs' || selectedCategory === 'conclusions') &&
          filteredItems.map((item, i) => renderTextCard(item as string, i))
        }
        {filteredItems.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary, #6b7280)', padding: '2rem' }}>
            未找到匹配的素材
          </p>
        )}
      </div>
    </div>
  )
}
