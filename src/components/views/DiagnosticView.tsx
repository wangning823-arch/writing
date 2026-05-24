'use client'

import { useRouter } from 'next/navigation'
import PreAssessment from '@/components/diagnostic/PreAssessment'
import EnglishPreAssessment from '@/components/diagnostic/EnglishPreAssessment'

interface DiagnosticViewProps {
  subject: 'chinese' | 'english'
}

export default function DiagnosticView({ subject }: DiagnosticViewProps) {
  const router = useRouter()

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      {subject === 'english' ? (
        <EnglishPreAssessment
          onComplete={() => router.push('/grade-select')}
          onCancel={() => router.push('/')}
        />
      ) : (
        <PreAssessment
          onComplete={() => router.push('/grade-select')}
          onCancel={() => router.push('/')}
        />
      )}
    </div>
  )
}
