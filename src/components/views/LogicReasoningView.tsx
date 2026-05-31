'use client'

import LogicReasoning from '@/components/training/LogicReasoning'

interface LogicReasoningViewProps {
  onBack: () => void
  subject: 'chinese' | 'english'
}

export default function LogicReasoningView({ onBack, subject }: LogicReasoningViewProps) {
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ border: 'none', background: 'none', color: 'var(--theme_text-weak)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '12px', padding: 0 }}>
        ← 返回
      </button>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '24px' }}>
        {subject === 'chinese' ? '语文' : '英语'}逻辑推理训练
      </h1>
      <LogicReasoning
        subject={subject}
        onComplete={() => {}}
        onBack={onBack}
      />
    </div>
  )
}
