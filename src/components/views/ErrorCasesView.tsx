'use client'

import { useSearchParams } from 'next/navigation'
import ErrorCaseLibrary from '@/components/training/ErrorCaseLibrary'

export default function ErrorCasesView() {
  const searchParams = useSearchParams()
  const subject = (searchParams.get('subject') as 'chinese' | 'english') || 'chinese'

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '24px' }}>
        {subject === 'chinese' ? '语文' : '英语'}错题本
      </h1>
      <ErrorCaseLibrary subject={subject} />
    </div>
  )
}
