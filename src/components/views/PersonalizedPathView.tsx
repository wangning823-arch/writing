'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import PersonalizedPath from '@/components/training/PersonalizedPath'

interface PersonalizedPathViewProps {
  onBack: () => void
  subject: 'chinese' | 'english'
}

function PersonalizedPathContent({ onBack, subject }: PersonalizedPathViewProps) {
  const router = useRouter()

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ border: 'none', background: 'none', color: 'var(--theme_text-weak)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '12px', padding: 0 }}>
        ← 返回
      </button>
      <PersonalizedPath
        subject={subject}
        onSelectTraining={(type) => router.push(`/thinking/${type}?subject=${subject}`)}
      />
    </div>
  )
}

export default function PersonalizedPathView({ onBack, subject }: PersonalizedPathViewProps) {
  return (
    <Suspense>
      <PersonalizedPathContent onBack={onBack} subject={subject} />
    </Suspense>
  )
}
