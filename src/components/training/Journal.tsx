'use client'

import { useState, useEffect } from 'react'

interface JournalProps {
  userId?: string
  subject: 'chinese' | 'english'
}

interface JournalEntry {
  id: string
  type: string
  title?: string
  content: string
  wordCount: number
  tags: string[]
  createdAt: string
}

const JOURNAL_TYPES = ['随笔', '日记', '读后感']

export default function Journal({ userId, subject }: JournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('随笔')
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formTags, setFormTags] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadEntries() }, [userId])

  const loadEntries = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/journal${userId ? `?userId=${userId}` : ''}`)
      const data = await res.json()
      setEntries(data.entries || [])
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formContent.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formType,
          title: formTitle || undefined,
          content: formContent,
          tags: formTags.split(/[,，]/).map(t => t.trim()).filter(Boolean),
          userId,
          subject,
        }),
      })
      const result = await res.json()
      if (result.success) {
        setShowForm(false)
        setFormTitle('')
        setFormContent('')
        setFormTags('')
        loadEntries()
      }
    } catch {
      alert('保存失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除这篇随笔？')) return
    try {
      await fetch(`/api/journal?id=${id}`, { method: 'DELETE' })
      loadEntries()
    } catch {
      alert('删除失败')
    }
  }

  const getWordCount = (text: string) => text.replace(/\s/g, '').length

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', margin: '0 0 0.25rem' }}>
            随笔本
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', margin: 0 }}>
            自由写作，记录思考
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none',
            background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500,
          }}
        >
          {showForm ? '取消' : '+ 新随笔'}
        </button>
      </div>

      {showForm && (
        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {JOURNAL_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setFormType(t)}
                style={{
                  padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem',
                  border: `1px solid ${formType === t ? '#3b82f6' : 'var(--border-color, #e5e7eb)'}`,
                  background: formType === t ? '#eff6ff' : 'var(--bg-card, #fff)',
                  color: formType === t ? '#2563eb' : 'var(--text-secondary, #6b7280)',
                  cursor: 'pointer',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="标题（选填）"
            style={{
              width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.375rem',
              border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
              fontSize: '0.875rem', color: 'var(--text-primary, #111827)', boxSizing: 'border-box', marginBottom: '0.5rem',
            }}
          />

          <textarea
            value={formContent}
            onChange={(e) => setFormContent(e.target.value)}
            rows={8}
            placeholder="开始写作..."
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.375rem',
              border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
              fontSize: '0.875rem', color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '0.5rem',
            }}
          />

          <input
            type="text"
            value={formTags}
            onChange={(e) => setFormTags(e.target.value)}
            placeholder="标签（用逗号分隔）"
            style={{
              width: '100%', padding: '0.5rem 0.75rem', borderRadius: '0.375rem',
              border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
              fontSize: '0.8125rem', color: 'var(--text-primary, #111827)', boxSizing: 'border-box', marginBottom: '0.5rem',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)' }}>
              {getWordCount(formContent)} 字
            </span>
            <button
              onClick={handleSubmit}
              disabled={!formContent.trim() || submitting}
              style={{
                padding: '0.5rem 1.5rem', borderRadius: '0.375rem', border: 'none',
                background: formContent.trim() && !submitting ? '#3b82f6' : '#9ca3af',
                color: '#fff', cursor: formContent.trim() && !submitting ? 'pointer' : 'not-allowed', fontSize: '0.8125rem',
              }}
            >
              {submitting ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>加载中...</p>
      ) : entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '0.9375rem', margin: 0 }}>还没有随笔，开始写第一篇吧</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {entries.map(entry => (
            <div key={entry.id} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.625rem', padding: '0.0625rem 0.375rem', borderRadius: '9999px', background: '#eff6ff', color: '#2563eb' }}>
                      {entry.type}
                    </span>
                    {entry.title && (
                      <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary, #111827)' }}>
                        {entry.title}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)', margin: 0 }}>
                    {new Date(entry.createdAt).toLocaleDateString('zh-CN')} · {entry.wordCount}字
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  style={{ border: 'none', background: 'none', color: 'var(--text-tertiary, #9ca3af)', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem' }}
                >
                  删除
                </button>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary, #111827)', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {entry.content.length > 200 ? entry.content.slice(0, 200) + '...' : entry.content}
              </p>
              {entry.tags && entry.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {entry.tags.map((tag, i) => (
                    <span key={i} style={{ fontSize: '0.625rem', padding: '0.0625rem 0.375rem', borderRadius: '9999px', background: 'var(--bg-secondary, #f9fafb)', color: 'var(--text-secondary, #6b7280)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
