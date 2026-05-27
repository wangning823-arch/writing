'use client'

import { useEffect, useState } from 'react'

interface Essay {
  id: string
  topicId: string
  title: string
  content: string
  source: string
  essayTypeId: string | null
  year: number | null
  region: string | null
  author: string | null
  createdAt: string
  topic: { id: string; title: string; subject: string }
  essayType: { id: string; name: string } | null
}

interface EssayType {
  id: string
  name: string
  subject: string
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

export default function EssaysPage() {
  const [essays, setEssays] = useState<Essay[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('chinese')
  const [essayTypeFilter, setEssayTypeFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', content: '', source: 'admin', essayTypeId: '', year: '', region: '', author: '' })
  const [showForm, setShowForm] = useState(false)
  const [topics, setTopics] = useState<{ id: string; title: string }[]>([])
  const [essayTypes, setEssayTypes] = useState<EssayType[]>([])
  const [form, setForm] = useState({ topicId: '', title: '', content: '', source: 'admin', essayTypeId: '', year: '', region: '', author: '' })

  const loadEssays = () => {
    const params = new URLSearchParams({ page: String(page), limit: '15' })
    if (search) params.set('search', search)
    if (sourceFilter) params.set('source', sourceFilter)
    if (subjectFilter) params.set('subject', subjectFilter)
    if (essayTypeFilter) params.set('essayTypeId', essayTypeFilter)
    fetch(`/api/admin/essays?${params}`)
      .then(r => r.json())
      .then(data => { setEssays(data.essays || []); setTotal(data.total || 0) })
      .catch(console.error)
  }

  const loadTopics = () => {
    const params = new URLSearchParams({ limit: '200' })
    if (subjectFilter) params.set('subject', subjectFilter)
    fetch(`/api/admin/topics?${params}`)
      .then(r => r.json())
      .then(data => setTopics((data.topics || []).map((t: any) => ({ id: t.id, title: t.title }))))
      .catch(console.error)
  }

  const loadEssayTypes = () => {
    fetch('/api/admin/essay-types')
      .then(r => r.json())
      .then(data => setEssayTypes((data.types || []).filter((t: EssayType) => t.isActive)))
      .catch(console.error)
  }

  useEffect(() => { loadEssays() }, [page, sourceFilter, subjectFilter, essayTypeFilter])
  useEffect(() => { loadTopics(); loadEssayTypes() }, [subjectFilter])

  const handleSearch = () => { setPage(1); loadEssays() }

  const filteredEssayTypes = subjectFilter
    ? essayTypes.filter(t => t.subject === subjectFilter || t.subject === 'all')
    : essayTypes

  const handleCreate = async () => {
    if (!form.topicId || !form.title || !form.content) return alert('题目、标题和内容不能为空')
    const res = await fetch(`/api/admin/topics/${form.topicId}/essays`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        source: form.source,
        essayTypeId: form.essayTypeId || null,
        year: form.year ? parseInt(form.year) : null,
        region: form.region || null,
        author: form.author || null,
      }),
    })
    if (res.ok) {
      setShowForm(false)
      setForm({ topicId: '', title: '', content: '', source: 'admin', essayTypeId: '', year: '', region: '', author: '' })
      loadEssays()
    } else {
      const data = await res.json()
      alert(data.error || '创建失败')
    }
  }

  const handleUpdate = async () => {
    if (!editId) return
    const res = await fetch(`/api/admin/essays/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editForm.title,
        content: editForm.content,
        source: editForm.source,
        essayTypeId: editForm.essayTypeId || null,
        year: editForm.year ? parseInt(editForm.year) : null,
        region: editForm.region || null,
        author: editForm.author || null,
      }),
    })
    if (res.ok) {
      setEditId(null)
      loadEssays()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此范文？')) return
    await fetch(`/api/admin/essays/${id}`, { method: 'DELETE' })
    loadEssays()
  }

  const startEdit = (essay: Essay) => {
    setEditId(essay.id)
    setEditForm({
      title: essay.title,
      content: essay.content,
      source: essay.source,
      essayTypeId: essay.essayTypeId || '',
      year: essay.year ? String(essay.year) : '',
      region: essay.region || '',
      author: essay.author || '',
    })
  }

  const totalPages = Math.ceil(total / 15)
  const sourceLabel = (s: string) => ({ gaokao: '高考范文', admin: '管理员添加', 'ai-generated': 'AI生成' }[s] || s)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)' }}>
          范文管理 <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--theme_text-muted)' }}>({total}篇)</span>
        </h1>
        <button onClick={() => setShowForm(!showForm)} style={{
          ...btnStyle,
          background: 'var(--theme_button-primary)',
          color: 'var(--theme_button-text)',
        }}>
          {showForm ? '取消' : '+ 新建范文'}
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
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '16px', color: 'var(--theme_text)' }}>新建范文</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>所属题目 *</label>
              <select style={inputStyle} value={form.topicId} onChange={e => setForm({ ...form, topicId: e.target.value })}>
                <option value="">选择题目...</option>
                {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>范文类型</label>
              <select style={inputStyle} value={form.essayTypeId} onChange={e => setForm({ ...form, essayTypeId: e.target.value })}>
                <option value="">选择类型...</option>
                {filteredEssayTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>来源</label>
              <select style={inputStyle} value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                <option value="admin">管理员添加</option>
                <option value="gaokao">高考范文</option>
                <option value="ai-generated">AI生成</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>标题 *</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>内容 *</label>
            <textarea style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>年份</label>
              <input style={inputStyle} type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2024" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>地区</label>
              <input style={inputStyle} value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} placeholder="全国甲卷" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>作者</label>
              <input style={inputStyle} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
            </div>
          </div>
          <button onClick={handleCreate} style={{ ...btnStyle, background: 'var(--theme_button-primary)', color: 'var(--theme_button-text)' }}>
            创建范文
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <select style={{ ...inputStyle, width: '100px' }} value={subjectFilter} onChange={e => { setSubjectFilter(e.target.value); setEssayTypeFilter(''); setPage(1) }}>
          <option value="chinese">语文</option>
          <option value="english">英语</option>
          <option value="">全部</option>
        </select>
        <select style={{ ...inputStyle, width: '130px' }} value={essayTypeFilter} onChange={e => { setEssayTypeFilter(e.target.value); setPage(1) }}>
          <option value="">全部类型</option>
          {filteredEssayTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select style={{ ...inputStyle, width: '120px' }} value={sourceFilter} onChange={e => { setSourceFilter(e.target.value); setPage(1) }}>
          <option value="">全部来源</option>
          <option value="gaokao">高考范文</option>
          <option value="admin">管理员添加</option>
          <option value="ai-generated">AI生成</option>
        </select>
        <input
          style={{ ...inputStyle, width: '200px' }}
          placeholder="搜索标题、内容或作者..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} style={{ ...btnStyle, background: 'var(--theme_bg-subtle)', border: '1px solid var(--border-color)', color: 'var(--theme_text)' }}>
          搜索
        </button>
      </div>

      {/* Essays List */}
      <div style={{ background: 'var(--theme_bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        {essays.map((essay, i) => (
          <div key={essay.id} style={{
            borderBottom: i < essays.length - 1 ? '1px solid var(--border-color)' : 'none',
          }}>
            {editId === essay.id ? (
              /* Edit Mode */
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>标题</label>
                    <input style={inputStyle} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>来源</label>
                    <select style={inputStyle} value={editForm.source} onChange={e => setEditForm({ ...editForm, source: e.target.value })}>
                      <option value="admin">管理员添加</option>
                      <option value="gaokao">高考范文</option>
                      <option value="ai-generated">AI生成</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>范文类型</label>
                  <select style={inputStyle} value={editForm.essayTypeId} onChange={e => setEditForm({ ...editForm, essayTypeId: e.target.value })}>
                    <option value="">选择类型...</option>
                    {filteredEssayTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>内容</label>
                  <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>年份</label>
                    <input style={inputStyle} type="number" value={editForm.year} onChange={e => setEditForm({ ...editForm, year: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>地区</label>
                    <input style={inputStyle} value={editForm.region} onChange={e => setEditForm({ ...editForm, region: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>作者</label>
                    <input style={inputStyle} value={editForm.author} onChange={e => setEditForm({ ...editForm, author: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleUpdate} style={{ ...btnStyle, background: 'var(--theme_button-primary)', color: 'var(--theme_button-text)' }}>保存</button>
                  <button onClick={() => setEditId(null)} style={{ ...btnStyle, background: 'var(--theme_bg-subtle)', border: '1px solid var(--border-color)', color: 'var(--theme_text)' }}>取消</button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div
                style={{ padding: '12px 16px', cursor: 'pointer' }}
                onClick={() => setExpandedId(expandedId === essay.id ? null : essay.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.6875rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: essay.topic?.subject === 'chinese' ? 'var(--color-blue-50)' : 'var(--color-success-light)',
                    color: essay.topic?.subject === 'chinese' ? 'var(--color-blue-600)' : 'var(--color-success)',
                    fontWeight: 500,
                  }}>
                    {essay.topic?.subject === 'chinese' ? '语文' : '英语'}
                  </span>
                  {essay.essayType && (
                    <span style={{ fontSize: '0.6875rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--color-purple-light, #f3e8ff)', color: 'var(--color-purple, #7c3aed)', fontWeight: 500 }}>
                      {essay.essayType.name}
                    </span>
                  )}
                  <span style={{ fontSize: '0.6875rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--color-gray-100)', color: 'var(--theme_text-muted)' }}>
                    {sourceLabel(essay.source)}
                  </span>
                  {essay.year && <span style={{ fontSize: '0.6875rem', color: 'var(--theme_text-muted)' }}>{essay.year}年</span>}
                  {essay.region && <span style={{ fontSize: '0.6875rem', color: 'var(--theme_text-muted)' }}>{essay.region}</span>}
                  {essay.author && <span style={{ fontSize: '0.6875rem', color: 'var(--theme_text-muted)' }}>{essay.author}</span>}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--theme_text)', marginBottom: '2px' }}>
                  {essay.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)', marginBottom: '2px' }}>
                  题目: {essay.topic?.title || essay.topicId}
                </div>
                {expandedId === essay.id && (
                  <div style={{
                    marginTop: '8px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'var(--theme_bg-subtle)',
                    fontSize: '0.8125rem',
                    color: 'var(--theme_text)',
                    lineHeight: 1.7,
                    maxHeight: '300px',
                    overflowY: 'auto',
                  }}>
                    {essay.content.split(/\n+/).filter(p => p.trim()).map((p, i) => (
                      <p key={i} style={{ textIndent: '2em', margin: '0 0 0.5em 0' }}>{p.trim()}</p>
                    ))}
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--theme_text-muted)', marginTop: '4px' }}>
                      共{essay.content.replace(/\s/g, '').length}字
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => startEdit(essay)} style={{
                    padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem',
                    border: 'none', cursor: 'pointer',
                    color: 'var(--theme_button-primary)', background: 'var(--color-blue-50)',
                  }}>编辑</button>
                  <button onClick={() => handleDelete(essay.id)} style={{
                    padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem',
                    border: 'none', cursor: 'pointer',
                    color: 'var(--color-error)', background: 'var(--color-error-light)',
                  }}>删除</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {essays.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--theme_text-muted)', fontSize: '0.875rem' }}>
            暂无范文
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
