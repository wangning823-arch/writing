'use client'

import { useState, useEffect } from 'react'

interface CurrentReadingProps {
  subject: 'chinese' | 'english'
  userId?: string
}

interface Article {
  title: string
  source: string
  summary: string
  url?: string
  tags: string[]
}

interface WeeklyData {
  weekStart: string
  articles: Article[]
}

export default function CurrentReading({ subject, userId }: CurrentReadingProps) {
  const [data, setData] = useState<WeeklyData | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadWeeklyReading() }, [subject])

  const loadWeeklyReading = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/ai/current-reading?subject=${subject}`)
      const result = await res.json()
      setData(result)
    } catch {
      setData({
        weekStart: new Date().toISOString().split('T')[0],
        articles: [],
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/current-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, userId }),
      })
      const result = await res.json()
      setData(result)
    } catch {
      alert('生成失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNote = async () => {
    if (!selectedArticle || !note.trim()) return
    setSaving(true)
    try {
      await fetch('/api/ai/current-reading', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleTitle: selectedArticle.title, note, userId }),
      })
      alert('笔记已保存')
      setNote('')
      setSelectedArticle(null)
    } catch {
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>加载中...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
        时文阅读推荐
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1.5rem' }}>
        每周精选时文，积累写作素材
      </p>

      {data?.weekStart && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)', marginBottom: '1rem' }}>
          本周推荐（{data.weekStart} 起）
        </p>
      )}

      {!data?.articles || data.articles.length === 0 ? (
        <div style={{ padding: '2rem', borderRadius: '0.75rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1rem' }}>
            本周还没有推荐文章
          </p>
          <button
            onClick={handleGenerate}
            style={{
              padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none',
              background: 'var(--theme_button-primary)', color: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
            }}
          >
            AI 生成本周推荐
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {data.articles.map((article, i) => (
              <div
                key={i}
                onClick={() => setSelectedArticle(selectedArticle?.title === article.title ? null : article)}
                style={{
                  padding: '1rem', borderRadius: '0.75rem', cursor: 'pointer',
                  border: `1px solid ${selectedArticle?.title === article.title ? 'var(--theme_button-primary)' : 'var(--border-color, #e5e7eb)'}`,
                  background: selectedArticle?.title === article.title ? 'var(--accent-light)' : 'var(--bg-card, #fff)',
                }}
              >
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary, #111827)', margin: '0 0 0.25rem' }}>
                  {article.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #6b7280)', margin: '0 0 0.375rem' }}>
                  来源：{article.source}
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', margin: 0, lineHeight: 1.5 }}>
                  {article.summary}
                </p>
                {article.tags && article.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {article.tags.map((tag, j) => (
                      <span key={j} style={{ fontSize: '0.625rem', padding: '0.0625rem 0.375rem', borderRadius: '9999px', background: 'var(--success-light)', color: 'var(--success-dark)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedArticle && (
            <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--purple-light)', border: '1px solid var(--purple)', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--purple)', margin: '0 0 0.5rem' }}>
                阅读笔记 - {selectedArticle.title}
              </h4>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="写下你的阅读感悟..."
                style={{
                  width: '100%', padding: '0.5rem', borderRadius: '0.375rem',
                  border: '1px solid var(--purple)', background: 'var(--bg-card)', fontSize: '0.875rem',
                  color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '0.5rem',
                }}
              />
              <button
                onClick={handleSaveNote}
                disabled={!note.trim() || saving}
                style={{
                  padding: '0.375rem 1rem', borderRadius: '0.375rem', border: 'none',
                  background: note.trim() ? 'var(--purple)' : '#9ca3af', color: '#fff',
                  cursor: note.trim() ? 'pointer' : 'not-allowed', fontSize: '0.8125rem',
                }}
              >
                {saving ? '保存中...' : '保存笔记'}
              </button>
            </div>
          )}

          <button
            onClick={handleGenerate}
            style={{
              width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)',
              background: 'var(--bg-card, #fff)', color: 'var(--text-secondary, #6b7280)',
              cursor: 'pointer', fontSize: '0.8125rem',
            }}
          >
            刷新本周推荐
          </button>
        </>
      )}
    </div>
  )
}
