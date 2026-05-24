'use client'

import { useState, useRef, useEffect } from 'react'
import { useNavigation } from '@/contexts/NavigationContext'

export default function UserSwitcher() {
  const { userId, setUserId, users, refreshUsers, createUser } = useNavigation()
  const [open, setOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentUser = users.find(u => u.id === userId)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSwitch = (id: string) => {
    setUserId(id)
    setOpen(false)
  }

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    const user = await createUser(newName.trim())
    if (user) {
      setUserId(user.id)
      setNewName('')
      setOpen(false)
    }
    setCreating(false)
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', borderRadius: '8px',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          cursor: 'pointer', fontSize: '0.8125rem',
          color: 'var(--text-primary)',
        }}
      >
        <span style={{ fontSize: '0.875rem' }}>👤</span>
        <span>{currentUser?.name || userId}</span>
        <span style={{ fontSize: '0.625rem', opacity: 0.5 }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: '4px',
          minWidth: '220px', borderRadius: '8px',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 100, padding: '4px',
        }}>
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => handleSwitch(u.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                width: '100%', padding: '8px 10px', borderRadius: '6px',
                border: 'none', background: u.id === userId ? 'var(--accent-light)' : 'transparent',
                cursor: 'pointer', textAlign: 'left',
                fontSize: '0.8125rem', color: 'var(--text-primary)',
              }}
            >
              <span>👤</span>
              <span style={{ flex: 1 }}>{u.name || u.id}</span>
              {u.id === userId && <span style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>当前</span>}
            </button>
          ))}

          <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0', padding: '8px 10px' }}>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="输入新学生姓名..."
              style={{
                width: '100%', padding: '6px 8px', borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)', color: 'var(--text-primary)',
                fontSize: '0.8125rem', outline: 'none',
              }}
            />
            <button
              onClick={handleCreate}
              disabled={!newName.trim() || creating}
              style={{
                width: '100%', marginTop: '6px', padding: '6px',
                borderRadius: '6px', border: 'none',
                background: newName.trim() ? 'var(--accent)' : 'var(--border-color)',
                color: newName.trim() ? '#fff' : 'var(--text-secondary)',
                cursor: newName.trim() ? 'pointer' : 'not-allowed',
                fontSize: '0.8125rem', fontWeight: 500,
              }}
            >
              {creating ? '创建中...' : '新建学生'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
