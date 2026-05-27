'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

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

interface SampleEssay {
  id: string
  title: string
  content: string
  source: string
  year: number | null
  region: string | null
  author: string | null
  createdAt: string
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

export default function TopicDetailPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.id as string
  const [topic, setTopic] = useState<Topic | null>(null)
  const [essays, setEssays] = useState<SampleEssay[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingEssay, setEditingEssay] = useState<SampleEssay | null>(null)
  const [form, setForm] = useState({ title: '', content: '', source: 'admin', year: '', region: '', author: '' })

  useEffect(() => {
    fetch(`/api/admin/topics/${topicId}`)
      .then(r => r.json())
      .then(data => setTopic(data.topic))
      .catch(console.error)
    loadEssays()
  }, [topicId])

  const loadEssays = () => {
    fetch(`/api/admin/topics/${topicId}/essays`)
      .then(r => r.json())
      .then(data => setEssays(data.essays || []))
      .catch(console.error)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.content) return alert('标题和内容不能为空')
    const body = {
      title: form.title,
      content: form.content,
      source: form.source,
      year: form.year ? parseInt(form.year) : null,
      region: form.region || null,
      author: form.author || null,
    }

    if (editingEssay) {
      await fetch(`/api/admin/topics/${topicId}/essays/${editingEssay.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } else {
      await fetch(`/api/admin/topics/${topicId}/essays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }
    setShowForm(false)
    setEditingEssay(null)
    setForm({ title: '', content: '', source: 'admin', year: '', region: '', author: '' })
    loadEssays()
  }

  const handleEdit = (essay: SampleEssay) => {
    setEditingEssay(essay)
    setForm({
      title: essay.title,
      content: essay.content,
      source: essay.source,
      year: essay.year ? String(essay.year) : '',
      region: essay.region || '',
      author: essay.author || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (essayId: string) => {
    if (!confirm('确定删除此范文？')) return
    await fetch(`/api/admin/topics/${topicId}/essays/${essayId}`, { method: 'DELETE' })
    loadEssays()
  }

  if (!topic) {
    return <div style={{ color: 'var(--theme_text-weak)', padding: '40px', textAlign: 'center' }}>加载中...</div>
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/admin/topics" style={{ fontSize: '0.8125rem', color: 'var(--theme_button-primary)', textDecoration: 'none' }}>
          ← 返回题目列表
        </Link>
      </div>

      {/* Topic Info */}
      <div style={{
        background: 'var(--theme_bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{
            fontSize: '0.6875rem', padding: '2px 6px', borderRadius: '4px',
            background: topic.subject === 'chinese' ? 'var(--color-blue-50)' : 'var(--color-success-light)',
            color: topic.subject === 'chinese' ? 'var(--color-blue-600)' : 'var(--color-success)',
          }}>
            {topic.subject === 'chinese' ? '语文' : '英语'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)' }}>{topic.type}</span>
          {topic.year && <span style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)' }}>{topic.year}年</span>}
          {topic.region && <span style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)' }}>{topic.region}</span>}
          <span style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)' }}>{topic._count.trainingRecords}次训练</span>
        </div>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '8px' }}>
          {topic.title}
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--theme_text-weak)', marginBottom: '8px', lineHeight: 1.6 }}>
          {topic.description}
        </p>
        {topic.requirements && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text-muted)' }}>要求：{topic.requirements}</p>
        )}
      </div>

      {/* Sample Essays Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--theme_text)' }}>
          优秀范文 <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: 'var(--theme_text-muted)' }}>({essays.length}篇)</span>
        </h2>
        <button onClick={() => { setShowForm(!showForm); setEditingEssay(null); setForm({ title: '', content: '', source: 'admin', year: '', region: '', author: '' }) }} style={{
          ...btnStyle,
          background: 'var(--theme_button-primary)',
          color: 'var(--theme_button-text)',
        }}>
          {showForm ? '取消' : '+ 添加范文'}
        </button>
      </div>

      {/* Essay Form */}
      {showForm && (
        <div style={{
          background: 'var(--theme_bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '16px', color: 'var(--theme_text)' }}>
            {editingEssay ? '编辑范文' : '添加范文'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>标题 *</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>来源</label>
              <select style={inputStyle} value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                <option value="admin">管理员添加</option>
                <option value="gaokao">高考真题</option>
                <option value="ai-generated">AI生成</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>年份</label>
              <input style={inputStyle} type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>地区</label>
              <input style={inputStyle} value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} />
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>作者</label>
            <input style={inputStyle} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', display: 'block', marginBottom: '4px' }}>范文内容 *</label>
            <textarea style={{ ...inputStyle, minHeight: '200px', resize: 'vertical', lineHeight: 1.8 }} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
          </div>
          <button onClick={handleSubmit} style={{ ...btnStyle, background: 'var(--theme_button-primary)', color: 'var(--theme_button-text)' }}>
            {editingEssay ? '保存修改' : '添加范文'}
          </button>
        </div>
      )}

      {/* Essays List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {essays.map(essay => (
          <div key={essay.id} style={{
            background: 'var(--theme_bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '0.6875rem', padding: '2px 6px', borderRadius: '4px',
                    background: essay.source === 'gaokao' ? 'var(--color-blue-50)' : essay.source === 'admin' ? 'var(--color-success-light)' : 'var(--color-warning-light)',
                    color: essay.source === 'gaokao' ? 'var(--color-blue-600)' : essay.source === 'admin' ? 'var(--color-success)' : 'var(--color-warning)',
                  }}>
                    {essay.source === 'gaokao' ? '高考真题' : essay.source === 'admin' ? '管理员' : 'AI生成'}
                  </span>
                  {essay.year && <span style={{ fontSize: '0.6875rem', color: 'var(--theme_text-muted)' }}>{essay.year}年</span>}
                  {essay.region && <span style={{ fontSize: '0.6875rem', color: 'var(--theme_text-muted)' }}>{essay.region}</span>}
                  {essay.author && <span style={{ fontSize: '0.6875rem', color: 'var(--theme_text-muted)' }}>{essay.author}</span>}
                </div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--theme_text)' }}>{essay.title}</h3>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => handleEdit(essay)} style={{ ...btnStyle, background: 'var(--color-blue-50)', color: 'var(--color-blue-600)' }}>
                  编辑
                </button>
                <button onClick={() => handleDelete(essay.id)} style={{ ...btnStyle, background: 'var(--color-error-light)', color: 'var(--color-error)' }}>
                  删除
                </button>
              </div>
            </div>
            <div style={{
              fontSize: '0.8125rem',
              color: 'var(--theme_text-weak)',
              lineHeight: 1.8,
              maxHeight: '200px',
              overflow: 'hidden',
              position: 'relative',
            }}>
              {essay.content}
              {essay.content.length > 500 && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '60px',
                  background: 'linear-gradient(transparent, var(--theme_bg))',
                }} />
              )}
            </div>
          </div>
        ))}
        {essays.length === 0 && (
          <div style={{
            background: 'var(--theme_bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            color: 'var(--theme_text-muted)',
            fontSize: '0.875rem',
          }}>
            暂无范文，点击上方按钮添加
          </div>
        )}
      </div>
    </div>
  )
}
