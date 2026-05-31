'use client'

import RevisionGuide from '@/components/training/RevisionGuide'

interface RevisionGuideViewProps {
  onBack: () => void
  subject: 'chinese' | 'english'
}

export default function RevisionGuideView({ onBack, subject }: RevisionGuideViewProps) {
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ border: 'none', background: 'none', color: 'var(--theme_text-weak)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '12px', padding: 0 }}>
        ← 返回
      </button>
      <RevisionGuide subject={subject} />
    </div>
  )
}
