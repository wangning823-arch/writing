'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Topic {
  id: string
  source: string
  year: number | null
  region: string | null
  subject: string
  type: string
  title: string
  description: string
  requirements: string | null
  tags: string
  _count: { trainingRecords: number }
}

const inputStyle = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
  background: 'var(--theme_bg)',
  color: 'var(--theme_text)',
  fontSize: '0.8125rem',
  outline: 'none',
  width: '100%',
}

const btnStyle = {
  padding: '6px 14px',
  borderRadius: '6px',
  border: 'none',
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    id: '', source: '自定义', year: '', region: '', subject: 'chinese',
    type: '议论文', title: '', description: '', requirements: '', tags: '',
  })

  const loadTopics = () => {
    const params = new URLSearchParams({ page: String(page), limit: '15' })
    if (search) params.set('search', search)
    if (subjectFilter) params.set('subject', subjectFilter)
    fetch(`/api/admin/topics?${params}`)
      .then(r => r.json())
      .then(data => { setTopics(data.topics || []); setTotal(data.total || 0) })
      .catch(console.error)
  }

  useEffect(() => { loadTopics() }, [page, subjectFilter])

  const handleSearch = () => { setPage(1); loadTopics() }

  const handleCreate = async () => {
    if (!form.id || !form.title) return alert('ID和标题不能为空')
    const res = await fetch('/api/admin/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        year: form.year ? parseInt(form.year) : null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      }),
    })
    if (res.ok) {
      setShowForm(false)
      setForm({ id: '', source: '自定义', year: '', region: '', subject: 'chinese', type: '议论文', title: '', description: '', requirements: '', tags: '' })
      loadTopics()
    } else {
      const data = await res.json()
      alert(data.error || '创建失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此题目？')) return
    await fetch(`/api/admin/topics/${id}`, { method: 'DELETE' })
    loadTopics()
  }

  const totalPages = Math.ceil(total / 15)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)' }}>
          作文题目管理 <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--theme_text-muted)' }}>({total}题)</span>
        </h1>
        <button onClick={() => setShowForm(!showForm)} style={{
          ...btnStyle,
          background: 'var(--theme_button-primary)',
          color: 'var(--theme_button-text)',
        }}>
          {showForm ? '取消' : '+ 新建题目'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={{
          background: 'var(--theme_bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '16px', color: 'var(--theme_text)' }}>新建题目</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>题目ID *</label>
              <input style={inputStyle} value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} placeholder="如 cn-arg-016" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>科目</label>
              <select style={inputStyle} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                <option value="chinese">语文</option>
                <option value="english">英语</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>类型</label>
              <input style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="议论文" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>来源</label>
              <input style={inputStyle} value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>年份</label>
              <input style={inputStyle} type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2024" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>地区</label>
              <input style={inputStyle} value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} placeholder="全国甲卷" />
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>标题 *</label>
            <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>题目描述</label>
            <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>要求</label>
            <input style={inputStyle} value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} placeholder="不少于800字" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>标签（逗号分隔）</label>
            <input style={inputStyle} value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="科技, 生活" />
          </div>
          <button onClick={handleCreate} style={{ ...btnStyle, background: 'var(--theme_button-primary)', color: 'var(--theme_button-text)' }}>
            创建题目
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          style={{ ...inputStyle, width: '240px' }}
          placeholder="搜索标题或描述..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <select style={{ ...inputStyle, width: '120px' }} value={subjectFilter} onChange={e => { setSubjectFilter(e.target.value); setPage(1) }}>
          <option value="">全部科目</option>
          <option value="chinese">语文</option>
          <option value="english">英语</option>
        </select>
        <button onClick={handleSearch} style={{ ...btnStyle, background: 'var(--theme_bg-subtle)', border: '1px solid var(--border-color)', color: 'var(--theme_text)' }}>
          搜索
        </button>
      </div>

      {/* Topics List */}
      <div style={{ background: 'var(--theme_bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        {topics.map((topic, i) => (
          <div key={topic.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: i < topics.length - 1 ? '1px solid var(--border-color)' : 'none',
            gap: '16px',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '0.6875rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: topic.subject === 'chinese' ? 'var(--color-blue-50)' : 'var(--color-success-light)',
                  color: topic.subject === 'chinese' ? 'var(--color-blue-600)' : 'var(--color-success)',
                  fontWeight: 500,
                }}>
                  {topic.subject === 'chinese' ? '语文' : '英语'}
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--theme_text-muted)' }}>{topic.type}</span>
                {topic.year && <span style={{ fontSize: '0.6875rem', color: 'var(--theme_text-muted)' }}>{topic.year}年</span>}
                {topic.region && <span style={{ fontSize: '0.6875rem', color: 'var(--theme_text-muted)' }}>{topic.region}</span>}
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--theme_text)', marginBottom: '2px' }}>
                {topic.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {topic.description}
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)', whiteSpace: 'nowrap' }}>
              {topic._count.trainingRecords}次训练
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Link href={`/admin/topics/${topic.id}`} style={{
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                textDecoration: 'none',
                color: 'var(--theme_button-primary)',
                background: 'var(--color-blue-50)',
              }}>
                范文
              </Link>
              <button onClick={() => handleDelete(topic.id)} style={{
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-error)',
                background: 'var(--color-error-light)',
              }}>
                删除
              </button>
            </div>
          </div>
        ))}
        {topics.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--theme_text-muted)', fontSize: '0.875rem' }}>
            暂无题目
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ ...btnStyle, background: 'var(--theme_bg-subtle)', border: '1px solid var(--border-color)', color: 'var(--theme_text)', opacity: page <= 1 ? 0.5 : 1 }}>
            上一页
          </button>
          <span style={{ padding: '6px 12px', fontSize: '0.8125rem', color: 'var(--theme_text-weak)' }}>
            {page} / {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={{ ...btnStyle, background: 'var(--theme_bg-subtle)', border: '1px solid var(--border-color)', color: 'var(--theme_text)', opacity: page >= totalPages ? 0.5 : 1 }}>
            下一页
          </button>
        </div>
      )}
    </div>
  )
}
