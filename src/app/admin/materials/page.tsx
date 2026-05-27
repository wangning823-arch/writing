'use client'

import { useEffect, useState } from 'react'

interface Material {
  id: string
  content: string
  source: string
  category: string
  subject: string
  tags: string
  usageCount: number
  createdAt: string
  user: { id: string; name: string | null }
}

interface MaterialForm {
  content: string
  source: string
  category: string
  subject: string
  tags: string
}

const emptyForm: MaterialForm = { content: '', source: 'admin', category: '论据', subject: 'chinese', tags: '' }

const btnStyle = {
  padding: '6px 14px',
  borderRadius: '6px',
  border: 'none',
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
}

const inputStyle = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
  background: 'var(--theme_bg)',
  color: 'var(--theme_text)',
  fontSize: '0.8125rem',
  width: '100%',
  boxSizing: 'border-box' as const,
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [subjectFilter, setSubjectFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [createForm, setCreateForm] = useState<MaterialForm>(emptyForm)
  const [creating, setCreating] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<MaterialForm>(emptyForm)

  const loadMaterials = () => {
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (subjectFilter) params.set('subject', subjectFilter)
    if (categoryFilter) params.set('category', categoryFilter)
    fetch(`/api/admin/materials?${params}`)
      .then(r => r.json())
      .then(data => { setMaterials(data.materials || []); setTotal(data.total || 0) })
      .catch(console.error)
  }

  useEffect(() => { loadMaterials() }, [page, subjectFilter, categoryFilter])

  const handleCreate = async () => {
    if (!createForm.content.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/admin/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      if (res.ok) {
        setCreateForm(emptyForm)
        setShowForm(false)
        loadMaterials()
      }
    } finally {
      setCreating(false)
    }
  }

  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/admin/materials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    if (res.ok) {
      setEditId(null)
      loadMaterials()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此素材？')) return
    await fetch(`/api/admin/materials/${id}`, { method: 'DELETE' })
    loadMaterials()
  }

  const startEdit = (mat: Material) => {
    setEditId(mat.id)
    setEditForm({
      content: mat.content,
      source: mat.source,
      category: mat.category,
      subject: mat.subject,
      tags: mat.tags,
    })
  }

  const totalPages = Math.ceil(total / 20)

  const renderForm = (form: MaterialForm, setForm: (f: MaterialForm) => void, onSubmit: () => void, onCancel: () => void, submitting: boolean) => (
    <div style={{ padding: '16px', background: 'var(--theme_bg-subtle)', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <textarea
        placeholder="素材内容"
        value={form.content}
        onChange={e => setForm({ ...form, content: e.target.value })}
        rows={3}
        style={{ ...inputStyle, resize: 'vertical' }}
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={{ ...inputStyle, width: '120px' }}>
          <option value="chinese">语文</option>
          <option value="english">英语</option>
        </select>
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...inputStyle, width: '120px' }}>
          <option value="论据">论据</option>
          <option value="名言">名言</option>
          <option value="事例">事例</option>
          <option value="好词好句">好词好句</option>
        </select>
        <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} style={{ ...inputStyle, width: '120px' }}>
          <option value="admin">管理员添加</option>
          <option value="范文">范文</option>
          <option value="AI推荐">AI推荐</option>
          <option value="学生整理">学生整理</option>
        </select>
      </div>
      <input
        placeholder="标签（逗号分隔）"
        value={form.tags}
        onChange={e => setForm({ ...form, tags: e.target.value })}
        style={inputStyle}
      />
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ ...btnStyle, background: 'var(--theme_bg-subtle)', border: '1px solid var(--border-color)', color: 'var(--theme_text)' }}>取消</button>
        <button onClick={onSubmit} disabled={submitting || !form.content.trim()} style={{ ...btnStyle, background: 'var(--accent, #4F46E5)', color: '#fff', opacity: submitting || !form.content.trim() ? 0.5 : 1 }}>
          {submitting ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)' }}>
          素材库管理 <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--theme_text-muted)' }}>({total}条)</span>
        </h1>
        <button onClick={() => { setShowForm(!showForm); setEditId(null) }} style={{ ...btnStyle, background: 'var(--accent, #4F46E5)', color: '#fff' }}>
          + 新建素材
        </button>
      </div>

      {showForm && renderForm(createForm, setCreateForm, handleCreate, () => setShowForm(false), creating)}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--theme_bg)', color: 'var(--theme_text)', fontSize: '0.8125rem', width: '120px' }} value={subjectFilter} onChange={e => { setSubjectFilter(e.target.value); setPage(1) }}>
          <option value="">全部科目</option>
          <option value="chinese">语文</option>
          <option value="english">英语</option>
        </select>
        <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--theme_bg)', color: 'var(--theme_text)', fontSize: '0.8125rem', width: '120px' }} value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1) }}>
          <option value="">全部类型</option>
          <option value="论据">论据</option>
          <option value="名言">名言</option>
          <option value="事例">事例</option>
          <option value="好词好句">好词好句</option>
        </select>
      </div>

      <div style={{ background: 'var(--theme_bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        {materials.map((mat, i) => (
          <div key={mat.id} style={{
            display: 'flex', alignItems: 'center', padding: '12px 16px',
            borderBottom: i < materials.length - 1 ? '1px solid var(--border-color)' : 'none',
            gap: '12px',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {editId === mat.id ? (
                renderForm(editForm, setEditForm, () => handleUpdate(mat.id), () => setEditId(null), false)
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '0.6875rem', padding: '2px 6px', borderRadius: '4px',
                      background: mat.subject === 'chinese' ? 'var(--color-blue-50)' : 'var(--color-success-light)',
                      color: mat.subject === 'chinese' ? 'var(--color-blue-600)' : 'var(--color-success)',
                    }}>
                      {mat.subject === 'chinese' ? '语文' : '英语'}
                    </span>
                    <span style={{ fontSize: '0.6875rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--theme_bg-subtle)', color: 'var(--theme_text-weak)' }}>
                      {mat.category}
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--theme_text-muted)' }}>by {mat.user.name || '未知'}</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--theme_text)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {mat.content}
                  </div>
                </>
              )}
            </div>
            {editId !== mat.id && (
              <>
                <div style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)', whiteSpace: 'nowrap' }}>
                  使用{mat.usageCount}次
                </div>
                <button onClick={() => startEdit(mat)} style={{ ...btnStyle, background: 'var(--theme_bg-subtle)', border: '1px solid var(--border-color)', color: 'var(--theme_text)' }}>
                  编辑
                </button>
                <button onClick={() => handleDelete(mat.id)} style={{ ...btnStyle, background: 'var(--color-error-light)', color: 'var(--color-error)' }}>
                  删除
                </button>
              </>
            )}
          </div>
        ))}
        {materials.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--theme_text-muted)', fontSize: '0.875rem' }}>暂无素材</div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ ...btnStyle, background: 'var(--theme_bg-subtle)', border: '1px solid var(--border-color)', color: 'var(--theme_text)', opacity: page <= 1 ? 0.5 : 1 }}>上一页</button>
          <span style={{ padding: '6px 12px', fontSize: '0.8125rem', color: 'var(--theme_text-weak)' }}>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={{ ...btnStyle, background: 'var(--theme_bg-subtle)', border: '1px solid var(--border-color)', color: 'var(--theme_text)', opacity: page >= totalPages ? 0.5 : 1 }}>下一页</button>
        </div>
      )}
    </div>
  )
}
