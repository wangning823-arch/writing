'use client'

import { useState, useEffect } from 'react'

interface EssayShowcaseProps {
  subject: 'chinese' | 'english'
}

interface ShowcaseEssay {
  id: string
  title: string
  content: string
  author: string
  theme: string
  score: number
  techniques: string[]
}

export default function EssayShowcase({ subject }: EssayShowcaseProps) {
  const [essays, setEssays] = useState<ShowcaseEssay[]>([])
  const [selectedEssay, setSelectedEssay] = useState<ShowcaseEssay | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterTheme, setFilterTheme] = useState<string | null>(null)

  useEffect(() => { loadEssays() }, [subject])

  const loadEssays = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/essays?source=model&subject=${subject}`)
      const data = await res.json()
      const items = (data.essays || data || []).map((e: any) => ({
        id: e.id,
        title: e.title,
        content: e.content,
        author: e.author || '匿名',
        theme: e.theme || '未分类',
        score: e.score || 85,
        techniques: JSON.parse(e.techniques || '[]'),
      }))
      setEssays(items)
    } catch {
      setEssays([])
    } finally {
      setLoading(false)
    }
  }

  const themes = [...new Set(essays.map(e => e.theme))]
  const filtered = filterTheme ? essays.filter(e => e.theme === filterTheme) : essays

  if (selectedEssay) {
    return (
      <div style={{ padding: '1.5rem' }}>
        <button
          onClick={() => setSelectedEssay(null)}
          style={{ border: 'none', background: 'none', color: 'var(--text-weak, #6b7280)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '1rem', padding: 0 }}
        >
          ← 返回列表
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', background: '#eff6ff', color: '#2563eb' }}>
            {selectedEssay.theme}
          </span>
          <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', background: '#f0fdf4', color: '#16a34a' }}>
            {selectedEssay.score}分
          </span>
        </div>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
          {selectedEssay.title}
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)', marginBottom: '1rem' }}>
          作者：{selectedEssay.author}
        </p>

        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary, #111827)', margin: 0, lineHeight: 2, whiteSpace: 'pre-wrap' }}>
            {selectedEssay.content}
          </p>
        </div>

        {selectedEssay.techniques.length > 0 && (
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #6b7280)' }}>技巧标签：</span>
            {selectedEssay.techniques.map((t, i) => (
              <span key={i} style={{ fontSize: '0.625rem', padding: '0.0625rem 0.375rem', borderRadius: '9999px', background: '#f5f3ff', color: '#7c3aed' }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
        优秀作文展示
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1rem' }}>
        浏览高分范文，学习优秀写作技巧
      </p>

      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterTheme(null)}
          style={{
            padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.6875rem',
            border: `1px solid ${!filterTheme ? '#3b82f6' : 'var(--border-color, #e5e7eb)'}`,
            background: !filterTheme ? '#eff6ff' : 'var(--bg-card, #fff)',
            color: !filterTheme ? '#2563eb' : 'var(--text-secondary, #6b7280)',
            cursor: 'pointer',
          }}
        >
          全部
        </button>
        {themes.map(t => (
          <button
            key={t}
            onClick={() => setFilterTheme(t)}
            style={{
              padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.6875rem',
              border: `1px solid ${filterTheme === t ? '#3b82f6' : 'var(--border-color, #e5e7eb)'}`,
              background: filterTheme === t ? '#eff6ff' : 'var(--bg-card, #fff)',
              color: filterTheme === t ? '#2563eb' : 'var(--text-secondary, #6b7280)',
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>加载中...</p>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', padding: '2rem' }}>暂无范文</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(essay => (
            <button
              key={essay.id}
              onClick={() => setSelectedEssay(essay)}
              style={{
                padding: '1rem', borderRadius: '0.75rem',
                border: '1px solid var(--border-color, #e5e7eb)',
                background: 'var(--bg-card, #fff)', textAlign: 'left', cursor: 'pointer', width: '100%',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary, #111827)', margin: 0 }}>
                  {essay.title}
                </h4>
                <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.375rem', borderRadius: '9999px', background: '#f0fdf4', color: '#16a34a' }}>
                  {essay.score}分
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', margin: '0 0 0.375rem' }}>
                {essay.author} · {essay.theme}
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', margin: 0, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {essay.content.slice(0, 80)}...
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
