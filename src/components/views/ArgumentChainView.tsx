'use client'

import ArgumentChain from '@/components/training/ArgumentChain'

interface ArgumentChainViewProps {
  onBack: () => void
  subject: 'chinese' | 'english'
}

export default function ArgumentChainView({ onBack, subject }: ArgumentChainViewProps) {
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
        {subject === 'chinese' ? '语文' : '英语'}论证链条训练
      </h1>
      <ArgumentChain
        topic="论证训练"
        subject={subject}
        onComplete={(score: number) => {
          alert(`训练完成！得分：${score}`)
          onBack()
        }}
      />
    </div>
  )
}
