'use client'

import { useState } from 'react'
import { KNOWLEDGE_NODES, KNOWLEDGE_EDGES, getConnectedNodes, type KnowledgeNode } from '@/lib/training/knowledge-data'

interface KnowledgeGraphProps {
  subject: 'chinese' | 'english'
  masteredNodes?: string[]
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '思维能力': { bg: 'var(--accent-light)', text: 'var(--primary-700)', border: 'var(--primary-200)' },
  '结构能力': { bg: 'var(--success-light)', text: 'var(--success-dark)', border: 'var(--success-border)' },
  '论证能力': { bg: 'var(--topic-info-bg)', text: 'var(--warning-dark)', border: 'var(--warning-border)' },
  '语言能力': { bg: '#fce7f3', text: '#9d174d', border: '#fbcfe8' },
  '写作习惯': { bg: 'var(--purple-light)', text: 'var(--purple)', border: 'var(--purple)' },
}

const LEVEL_LABELS: Record<string, string> = {
  basic: '基础',
  intermediate: '进阶',
  advanced: '高级',
}

export default function KnowledgeGraph({ subject, masteredNodes = [] }: KnowledgeGraphProps) {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)

  const categories = [...new Set(KNOWLEDGE_NODES.map(n => n.category))]
  const filteredNodes = filterCategory ? KNOWLEDGE_NODES.filter(n => n.category === filterCategory) : KNOWLEDGE_NODES
  const connectedNodes = selectedNode ? getConnectedNodes(selectedNode.id) : []
  const connectedIds = new Set(connectedNodes.map(n => n.id))

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
        写作知识图谱
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1rem' }}>
        可视化展示写作知识体系，点击节点查看详情
      </p>

      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterCategory(null)}
          style={{
            padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.6875rem',
            border: `1px solid ${!filterCategory ? '#3b82f6' : 'var(--border-color, #e5e7eb)'}`,
            background: !filterCategory ? 'var(--accent-light)' : 'var(--bg-card, #fff)',
            color: !filterCategory ? 'var(--primary-600)' : 'var(--text-secondary, #6b7280)',
            cursor: 'pointer',
          }}
        >
          全部
        </button>
        {categories.map(cat => {
          const colors = CATEGORY_COLORS[cat] || { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' }
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.6875rem',
                border: `1px solid ${filterCategory === cat ? colors.text : colors.border}`,
                background: filterCategory === cat ? colors.bg : 'var(--bg-card, #fff)',
                color: filterCategory === cat ? colors.text : 'var(--text-secondary, #6b7280)',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {categories.filter(cat => !filterCategory || cat === filterCategory).map(cat => {
          const catNodes = filteredNodes.filter(n => n.category === cat)
          const colors = CATEGORY_COLORS[cat] || { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' }
          return (
            <div key={cat}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text, margin: '0 0 0.375rem' }}>{cat}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {catNodes.map(node => {
                  const isSelected = selectedNode?.id === node.id
                  const isConnected = connectedIds.has(node.id)
                  const isMastered = masteredNodes.includes(node.id)
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(isSelected ? null : node)}
                      style={{
                        padding: '0.375rem 0.75rem', borderRadius: '0.375rem',
                        border: `1px solid ${isSelected ? colors.text : isConnected ? colors.border : 'var(--border-color, #e5e7eb)'}`,
                        background: isSelected ? colors.bg : isMastered ? 'var(--success-light)' : 'var(--bg-card, #fff)',
                        cursor: 'pointer', fontSize: '0.75rem', fontWeight: isSelected ? 600 : 400,
                        color: isSelected ? colors.text : 'var(--text-primary, #111827)',
                        boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      {isMastered && '✓ '}{node.name}
                      <span style={{ fontSize: '0.5625rem', color: 'var(--text-tertiary, #9ca3af)', marginLeft: '0.25rem' }}>
                        {LEVEL_LABELS[node.level]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {selectedNode && (
        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary, #111827)', margin: 0 }}>
              {selectedNode.name}
            </h4>
            <span style={{ fontSize: '0.625rem', padding: '0.0625rem 0.375rem', borderRadius: '9999px', background: CATEGORY_COLORS[selectedNode.category]?.bg || '#f3f4f6', color: CATEGORY_COLORS[selectedNode.category]?.text || '#374151' }}>
              {LEVEL_LABELS[selectedNode.level]}
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', margin: '0 0 0.5rem' }}>
            {selectedNode.description}
          </p>
          {connectedNodes.length > 0 && (
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-primary, #111827)', margin: '0 0 0.25rem' }}>
                关联知识点：
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {connectedNodes.map(n => (
                  <span key={n.id} style={{ fontSize: '0.6875rem', padding: '0.125rem 0.375rem', borderRadius: '9999px', background: 'var(--bg-card, #fff)', border: '1px solid var(--border-color, #e5e7eb)', color: 'var(--text-secondary, #6b7280)' }}>
                    {n.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
