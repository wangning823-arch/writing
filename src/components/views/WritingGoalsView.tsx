'use client'

import WritingGoals from '@/components/training/WritingGoals'

interface WritingGoalsViewProps {
  onBack: () => void
  subject: 'chinese' | 'english'
}

export default function WritingGoalsView({ onBack, subject }: WritingGoalsViewProps) {
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ border: 'none', background: 'none', color: 'var(--theme_text-weak)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '12px', padding: 0 }}>
        ← 返回
      </button>
      <WritingGoals subject={subject} />
    </div>
  )
}
