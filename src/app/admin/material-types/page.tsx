'use client'

import { useEffect, useState } from 'react'

interface MaterialCategory {
  id: string
  name: string
  subject: string
  sortOrder: number
  isActive: boolean
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

export default function MaterialTypesPage() {
  const [categories, setCategories] = useState<MaterialCategory[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', subject: 'chinese', sortOrder: 0 })
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', subject: 'chinese', sortOrder: 0 })

  const loadCategories = () => {
    fetch('/api/admin/material-categories')
      .then(r => r.json())
      .then(data => setCategories(data.categories || []))
      .catch(console.error)
  }

  useEffect(() => { loadCategories() }, [])

  const handleCreate = async () => {
    if (!form.name) return alert('名称不能为空')
    await fetch('/api/admin/material-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setForm({ name: '', subject: 'chinese', sortOrder: 0 })
    loadCategories()
  }

  const handleUpdate = async () => {
    if (!editId || !editForm.name) return
    await fetch(`/api/admin/material-categories/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    setEditId(null)
    loadCategories()
  }

  const handleToggle = async (cat: MaterialCategory) => {
    await fetch(`/api/admin/material-categories/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !cat.isActive }),
    })
    loadCategories()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此类型？')) return
    await fetch(`/api/admin/material-categories/${id}`, { method: 'DELETE' })
    loadCategories()
  }

  const startEdit = (cat: MaterialCategory) => {
    setEditId(cat.id)
    setEditForm({ name: cat.name, subject: cat.subject, sortOrder: cat.sortOrder })
  }

  const grouped = {
    chinese: categories.filter(c => c.subject === 'chinese'),
    english: categories.filter(c => c.subject === 'english'),
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)' }}>素材类型管理</h1>
        <button onClick={() => { setShowForm(!showForm); setEditId(null) }} style={{
          ...btnStyle,
          background: 'var(--theme_button-primary)',
          color: 'var(--theme_button-text)',
        }}>
          {showForm ? '取消' : '+ 新建类型'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: 'var(--theme_bg)', border: '1px solid var(--border-color)',
          borderRadius: '12px', padding: '20px', marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '16px', color: 'var(--theme_text)' }}>新建素材类型</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>名称 *</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="如：论据" />
            </div>
            <div style={{ width: '120px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>科目</label>
              <select style={inputStyle} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                <option value="chinese">语文</option>
                <option value="english">英语</option>
              </select>
            </div>
            <div style={{ width: '80px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>排序</label>
              <input style={inputStyle} type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
            </div>
            <button onClick={handleCreate} style={{ ...btnStyle, background: 'var(--theme_button-primary)', color: 'var(--theme_button-text)', height: '36px' }}>
              创建
            </button>
          </div>
        </div>
      )}

      {(['chinese', 'english'] as const).map(subject => (
        <div key={subject} style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '12px' }}>
            {subject === 'chinese' ? '语文素材类型' : '英语素材类型'}
          </h2>
          <div style={{ background: 'var(--theme_bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
            {grouped[subject].map((cat, i) => (
              <div key={cat.id} style={{
                padding: '12px 16px',
                borderBottom: i < grouped[subject].length - 1 ? '1px solid var(--border-color)' : 'none',
              }}>
                {editId === cat.id ? (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>名称</label>
                      <input style={inputStyle} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                    </div>
                    <div style={{ width: '120px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>科目</label>
                      <select style={inputStyle} value={editForm.subject} onChange={e => setEditForm({ ...editForm, subject: e.target.value })}>
                        <option value="chinese">语文</option>
                        <option value="english">英语</option>
                      </select>
                    </div>
                    <div style={{ width: '80px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>排序</label>
                      <input style={inputStyle} type="number" value={editForm.sortOrder} onChange={e => setEditForm({ ...editForm, sortOrder: parseInt(e.target.value) || 0 })} />
                    </div>
                    <button onClick={handleUpdate} style={{ ...btnStyle, background: 'var(--theme_button-primary)', color: 'var(--theme_button-text)', height: '36px' }}>保存</button>
                    <button onClick={() => setEditId(null)} style={{ ...btnStyle, background: 'var(--theme_bg-subtle)', border: '1px solid var(--border-color)', color: 'var(--theme_text)', height: '36px' }}>取消</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)', width: '24px' }}>#{cat.sortOrder}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--theme_text)' }}>{cat.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => startEdit(cat)} style={{ ...btnStyle, background: 'var(--color-blue-50)', color: 'var(--color-blue-600)' }}>
                        编辑
                      </button>
                      <button onClick={() => handleToggle(cat)} style={{
                        ...btnStyle,
                        background: cat.isActive ? 'var(--color-success-light)' : 'var(--theme_bg-subtle)',
                        color: cat.isActive ? 'var(--color-success)' : 'var(--theme_text-muted)',
                        border: '1px solid ' + (cat.isActive ? 'var(--color-success)' : 'var(--border-color)'),
                      }}>
                        {cat.isActive ? '启用' : '停用'}
                      </button>
                      <button onClick={() => handleDelete(cat.id)} style={{ ...btnStyle, background: 'var(--color-error-light)', color: 'var(--color-error)' }}>
                        删除
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {grouped[subject].length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--theme_text-muted)', fontSize: '0.8125rem' }}>
                暂无类型
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
