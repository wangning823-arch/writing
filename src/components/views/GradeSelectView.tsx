'use client'

import { useRouter } from 'next/navigation'
import GradeSelector from '@/components/onboarding/GradeSelector'

export default function GradeSelectView() {
  const router = useRouter()

  return (
    <div style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
      <GradeSelector
        onComplete={(grade: string) => {
          localStorage.setItem('bifeng-grade', grade)
          router.push('/')
        }}
        onSkip={() => router.push('/')}
      />
    </div>
  )
}
