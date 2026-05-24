'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import ModelEssayBrowser from '@/components/training/ModelEssayBrowser'

export default function ModelEssaysView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subject = (searchParams.get('subject') as 'chinese' | 'english') || 'chinese'

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '24px' }}>
        {subject === 'chinese' ? '语文' : '英语'}范文赏析
      </h1>
      <ModelEssayBrowser
        onBack={() => router.push(`/subject/${subject}`)}
        initialSubject={subject}
      />
    </div>
  )
}
