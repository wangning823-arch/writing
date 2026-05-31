'use client'

import DialecticalThinking from '@/components/training/DialecticalThinking'

interface DialecticalThinkingViewProps {
  onBack: () => void
  subject: 'chinese' | 'english'
}

export default function DialecticalThinkingView({ onBack, subject }: DialecticalThinkingViewProps) {
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ border: 'none', background: 'none', color: 'var(--theme_text-weak)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '12px', padding: 0 }}>
        ← 返回
      </button>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '24px' }}>
        {subject === 'chinese' ? '语文' : '英语'}辩证思维训练
      </h1>
      <DialecticalThinking
        subject={subject}
        onComplete={() => {}}
        onBack={onBack}
      />
    </div>
  )
}
