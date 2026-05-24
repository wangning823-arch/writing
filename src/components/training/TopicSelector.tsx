'use client'

import { useState } from 'react'
import { Topic } from '@/types'

interface TopicSelectorProps {
  topic: Topic | null
  onRefresh: () => void
  onGenerated: (topic: Topic) => void
  isLoading?: boolean
  subject: string
  level: number
}

export default function TopicSelector({
  topic,
  onRefresh,
  onGenerated,
  isLoading,
  subject,
  level,
}: TopicSelectorProps) {
  const [generating, setGenerating] = useState(false)

  const genreLabel = (type: string) => {
    const labels: Record<string, string> = {
      '议论文': '议论',
      '记叙文': '记叙',
      '散文': '散文',
      '应用文': '应用',
      '书信': '书信',
      '演讲': '演讲',
      '通知': '通知',
      '读后续写': '续写',
    }
    return labels[type] || type
  }

  const genreColor = (type: string) => {
    if (['议论文'].includes(type)) return '#3b82f6'
    if (['记叙文', '散文'].includes(type)) return '#8b5cf6'
    if (['书信', '演讲', '通知', '应用文'].includes(type)) return '#10b981'
    if (['读后续写'].includes(type)) return '#f59e0b'
    return '#6b7280'
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/topics/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, level, genre: topic?.type || '议论文' }),
      })
      const data = await res.json()
      if (data.topic) onGenerated(data.topic)
    } catch {
      alert('生成失败，请重试')
    } finally {
      setGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        background: 'var(--theme_bg)',
        textAlign: 'center',
        color: 'var(--theme_text-weak)',
        fontSize: '0.875rem',
      }}>
        加载题目中...
      </div>
    )
  }

  if (!topic) return null

  return (
    <div style={{
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid var(--border-color)',
      background: 'var(--theme_bg)',
      marginBottom: '16px',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '4px',
            background: `${genreColor(topic.type)}15`,
            color: genreColor(topic.type),
            fontSize: '0.75rem',
            fontWeight: 500,
          }}>
            {genreLabel(topic.type)}
          </span>
          {topic.source && (
            <span style={{
              fontSize: '0.6875rem',
              color: 'var(--theme_text-weak)',
              opacity: 0.6,
            }}>
              {topic.source}{topic.year ? ` ${topic.year}` : ''}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--theme_bg)',
              color: 'var(--theme_text)',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            换一题
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid var(--accent)',
              background: 'var(--accent-light, #eff6ff)',
              color: 'var(--accent)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              opacity: generating ? 0.6 : 1,
            }}
          >
            {generating ? '生成中...' : 'AI生成'}
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '0.9375rem',
        fontWeight: 600,
        color: 'var(--theme_text)',
        margin: '0 0 6px 0',
      }}>
        {topic.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '0.8125rem',
        color: 'var(--theme_text)',
        lineHeight: 1.6,
        margin: '0 0 6px 0',
      }}>
        {topic.description}
      </p>

      {/* Requirements */}
      {topic.requirements && (
        <p style={{
          fontSize: '0.75rem',
          color: 'var(--theme_text-weak)',
          margin: 0,
        }}>
          要求：{topic.requirements}
        </p>
      )}
    </div>
  )
}
