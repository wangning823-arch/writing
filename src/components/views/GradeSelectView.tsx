'use client'

import { useRouter } from 'next/navigation'
import GradeSelector from '@/components/onboarding/GradeSelector'
import { useNavigation } from '@/contexts/NavigationContext'

export default function GradeSelectView() {
  const router = useRouter()
  const { userId } = useNavigation()

  return (
    <div style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
      <GradeSelector
        onComplete={(grade: string) => {
          localStorage.setItem('bifeng-grade', grade)
          router.push('/')
        }}
        onSkip={() => router.push('/')}
        userId={userId}
      />
    </div>
  )
}
