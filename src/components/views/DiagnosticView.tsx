'use client'

import { useRouter } from 'next/navigation'
import PreAssessment from '@/components/diagnostic/PreAssessment'
import EnglishPreAssessment from '@/components/diagnostic/EnglishPreAssessment'
import { useNavigation } from '@/contexts/NavigationContext'

interface DiagnosticViewProps {
  subject: 'chinese' | 'english'
}

export default function DiagnosticView({ subject }: DiagnosticViewProps) {
  const router = useRouter()
  const { userId } = useNavigation()

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      {subject === 'english' ? (
        <EnglishPreAssessment
          onComplete={() => router.push('/grade-select')}
          onCancel={() => router.push('/')}
          userId={userId}
        />
      ) : (
        <PreAssessment
          onComplete={() => router.push('/grade-select')}
          onCancel={() => router.push('/')}
          userId={userId}
        />
      )}
    </div>
  )
}
