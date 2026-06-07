'use client'

import { useEffect, useRef } from 'react'

interface Material {
  id: string
  content: string
  source: string
  tags: string[]
  category: string
  subject: string
  usageCount: number
  createdAt: string
}

interface MaterialDetailModalProps {
  material: Material
  onClose: () => void
  onCopy: (id: string, content: string) => void
  copiedId: string | null
}

const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  '范文': { bg: 'var(--primary-100)', text: '#1e40af' },
  'AI推荐': { bg: 'var(--purple-light)', text: 'var(--purple)' },
  '学生整理': { bg: 'var(--success-light)', text: 'var(--success-dark)' },
}

export default function MaterialDetailModal({ material, onClose, onCopy, copiedId }: MaterialDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'modalFadeIn 0.2s ease',
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: '1rem',
          border: '1px solid var(--border-color)',
          maxWidth: '640px',
          width: '100%',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          animation: 'modalSlideIn 0.2s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: SOURCE_COLORS[material.source]?.bg || '#f3f4f6',
                color: SOURCE_COLORS[material.source]?.text || '#374151',
              }}
            >
              {material.source}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {material.category}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '1.125rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-color)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)' }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '1.5rem 1.25rem',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          <p
            style={{
              fontSize: '0.9375rem',
              lineHeight: 1.8,
              color: 'var(--text-primary)',
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}
          >
            {material.content}
          </p>
        </div>

        {/* Tags */}
        {material.tags.length > 0 && (
          <div
            style={{
              padding: '0 1.25rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.375rem',
            }}
          >
            {material.tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  background: 'var(--accent-light)',
                  color: 'var(--accent)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            使用 {material.usageCount} 次
          </span>
          <button
            onClick={() => onCopy(material.id, material.content)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: copiedId === material.id ? '#16a34a' : 'var(--accent)',
              color: '#fff',
              transition: 'all 0.15s',
            }}
          >
            {copiedId === material.id ? '✓ 已复制' : '复制素材'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
