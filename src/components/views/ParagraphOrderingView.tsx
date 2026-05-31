'use client'

import ParagraphOrdering from '@/components/training/ParagraphOrdering'

interface ParagraphOrderingViewProps {
  onBack: () => void
  subject: 'chinese' | 'english'
}

export default function ParagraphOrderingView({ onBack, subject }: ParagraphOrderingViewProps) {
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={onBack}
        style={{
          border: 'none',
          background: 'none',
          color: 'var(--theme_text-weak)',
          cursor: 'pointer',
          fontSize: '0.875rem',
          marginBottom: '12px',
          padding: 0,
        }}
      >
        ← 返回
      </button>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '24px' }}>
        {subject === 'chinese' ? '语文' : '英语'}段落排序训练
      </h1>
      <ParagraphOrdering
        topic="段落排序"
        subject={subject}
        onComplete={() => {}}
      />
    </div>
  )
}
