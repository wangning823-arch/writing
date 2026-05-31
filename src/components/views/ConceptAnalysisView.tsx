'use client'

import ConceptAnalysis from '@/components/training/ConceptAnalysis'

interface ConceptAnalysisViewProps {
  onBack: () => void
  subject: 'chinese' | 'english'
}

export default function ConceptAnalysisView({ onBack, subject }: ConceptAnalysisViewProps) {
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ border: 'none', background: 'none', color: 'var(--theme_text-weak)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '12px', padding: 0 }}>
        ← 返回
      </button>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '24px' }}>
        {subject === 'chinese' ? '语文' : '英语'}概念辨析训练
      </h1>
      <ConceptAnalysis
        subject={subject}
        onComplete={() => {}}
        onBack={onBack}
      />
    </div>
  )
}
