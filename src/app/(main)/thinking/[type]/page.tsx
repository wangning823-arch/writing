'use client'

import { Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import ParagraphOrderingView from '@/components/views/ParagraphOrderingView'
import ArgumentChainView from '@/components/views/ArgumentChainView'
import MultiAngleView from '@/components/views/MultiAngleView'
import WritingPsychologyView from '@/components/views/WritingPsychologyView'

function ThinkingTypeContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = params.type as string
  const subject = (searchParams.get('subject') as 'chinese' | 'english') || 'chinese'

  const handleBack = () => router.push(`/thinking?subject=${subject}`)

  if (type === 'paragraph-ordering') {
    return <ParagraphOrderingView onBack={handleBack} subject={subject} />
  }
  if (type === 'argument-chain') {
    return <ArgumentChainView onBack={handleBack} subject={subject} />
  }
  if (type === 'multi-angle') {
    return <MultiAngleView onBack={handleBack} subject={subject} />
  }
  if (type === 'writing-psychology') {
    return <WritingPsychologyView onBack={handleBack} subject={subject} />
  }

  return (
    <div style={{ padding: '32px', textAlign: 'center' }}>
      <p style={{ color: 'var(--theme_text-weak)' }}>未知的训练类型</p>
      <button
        onClick={handleBack}
        style={{
          marginTop: '16px',
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          background: 'var(--theme_button-primary)',
          color: '#ffffff',
          cursor: 'pointer',
        }}
      >
        返回思维训练
      </button>
    </div>
  )
}

export default function ThinkingTypePage() {
  return (
    <Suspense>
      <ThinkingTypeContent />
    </Suspense>
  )
}
