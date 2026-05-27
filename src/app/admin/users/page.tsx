'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string | null
  role: string
  grade: string
  stage: string
  chineseLevel: number
  englishLevel: number
  totalTrainings: number
  lastPracticedDate: string | null
  createdAt: string
  _count: { trainingRecords: number; materials: number }
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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form, setForm] = useState({ name: '', grade: '', role: '' })
  const [showForm, setShowForm] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', grade: '高一', role: 'student' })

  const loadUsers = () => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => setUsers(data.users || []))
      .catch(console.error)
  }

  useEffect(() => { loadUsers() }, [])

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setForm({ name: user.name || '', grade: user.grade, role: user.role })
  }

  const handleSave = async () => {
    if (!editingUser) return
    await fetch(`/api/admin/users/${editingUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setEditingUser(null)
    loadUsers()
  }

  const handleCreate = async () => {
    if (!createForm.name.trim()) return alert('名称不能为空')
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createForm),
    })
    if (res.ok) {
      setShowForm(false)
      setCreateForm({ name: '', grade: '高一', role: 'student' })
      loadUsers()
    } else {
      const data = await res.json()
      alert(data.error || '创建失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此用户？删除后数据将无法恢复。')) return
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    loadUsers()
  }

  const stageLabel: Record<string, string> = { sprout: '萌芽期', growing: '成长期', thriving: '飞跃期' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)' }}>
          用户管理 <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--theme_text-muted)' }}>({users.length}人)</span>
        </h1>
        <button onClick={() => setShowForm(!showForm)} style={{
          ...btnStyle,
          background: 'var(--theme_button-primary)',
          color: 'var(--theme_button-text)',
        }}>
          {showForm ? '取消' : '+ 新建用户'}
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
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '16px', color: 'var(--theme_text)' }}>新建用户</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>名称 *</label>
              <input style={inputStyle} value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} placeholder="输入学生姓名..." />
            </div>
            <div style={{ width: '120px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>年级</label>
              <select style={inputStyle} value={createForm.grade} onChange={e => setCreateForm({ ...createForm, grade: e.target.value })}>
                <option value="高一">高一</option>
                <option value="高二">高二</option>
                <option value="高三">高三</option>
              </select>
            </div>
            <div style={{ width: '120px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>角色</label>
              <select style={inputStyle} value={createForm.role} onChange={e => setCreateForm({ ...createForm, role: e.target.value })}>
                <option value="student">学生</option>
                <option value="admin">管理员</option>
              </select>
            </div>
            <button onClick={handleCreate} style={{ ...btnStyle, background: 'var(--theme_button-primary)', color: 'var(--theme_button-text)', height: '36px' }}>创建</button>
            <button onClick={() => setShowForm(false)} style={{ ...btnStyle, background: 'var(--theme_bg-subtle)', border: '1px solid var(--border-color)', color: 'var(--theme_text)', height: '36px' }}>取消</button>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editingUser && (
        <div style={{
          background: 'var(--theme_bg)', border: '1px solid var(--border-color)',
          borderRadius: '12px', padding: '20px', marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '16px', color: 'var(--theme_text)' }}>
            编辑用户：{editingUser.name || editingUser.id}
          </h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>名称</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div style={{ width: '120px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>年级</label>
              <select style={inputStyle} value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}>
                <option value="高一">高一</option>
                <option value="高二">高二</option>
                <option value="高三">高三</option>
              </select>
            </div>
            <div style={{ width: '120px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>角色</label>
              <select style={inputStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="student">学生</option>
                <option value="admin">管理员</option>
              </select>
            </div>
            <button onClick={handleSave} style={{ ...btnStyle, background: 'var(--theme_button-primary)', color: 'var(--theme_button-text)', height: '36px' }}>保存</button>
            <button onClick={() => setEditingUser(null)} style={{ ...btnStyle, background: 'var(--theme_bg-subtle)', border: '1px solid var(--border-color)', color: 'var(--theme_text)', height: '36px' }}>取消</button>
          </div>
        </div>
      )}

      {/* Users List */}
      <div style={{ background: 'var(--theme_bg)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        {users.map((user, i) => (
          <div key={user.id} style={{
            display: 'flex', alignItems: 'center', padding: '12px 16px',
            borderBottom: i < users.length - 1 ? '1px solid var(--border-color)' : 'none',
            gap: '16px',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--theme_text)' }}>
                  {user.name || '未命名'}
                </span>
                {user.role === 'admin' && (
                  <span style={{
                    fontSize: '0.625rem', padding: '1px 5px', borderRadius: '3px',
                    background: 'var(--color-warning-light)', color: 'var(--color-warning)', fontWeight: 500,
                  }}>
                    管理员
                  </span>
                )}
                <span style={{
                  fontSize: '0.625rem', padding: '1px 5px', borderRadius: '3px',
                  background: 'var(--theme_bg-subtle)', color: 'var(--theme_text-muted)',
                }}>
                  {stageLabel[user.stage] || user.stage}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)' }}>
                {user.grade} · 语文Lv{user.chineseLevel} · 英语Lv{user.englishLevel} · 训练{user._count.trainingRecords}次 · 素材{user._count.materials}个
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--theme_text-muted)', marginTop: '2px' }}>
                ID: {user.id} · 创建于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => handleEdit(user)} style={{ ...btnStyle, background: 'var(--color-blue-50)', color: 'var(--color-blue-600)' }}>
                编辑
              </button>
              {user.id !== 'admin-user' && user.id !== 'demo-user' && (
                <button onClick={() => handleDelete(user.id)} style={{ ...btnStyle, background: 'var(--color-error-light)', color: 'var(--color-error)' }}>
                  删除
                </button>
              )}
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--theme_text-muted)', fontSize: '0.875rem' }}>暂无用户</div>
        )}
      </div>
    </div>
  )
}
