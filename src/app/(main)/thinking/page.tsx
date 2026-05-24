'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ThinkingTrainingHub from '@/components/training/ThinkingTrainingHub'
import { TOPICS } from '@/lib/topics'

function ThinkingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [subject, setSubject] = useState<'chinese' | 'english'>('chinese')

  useEffect(() => {
    const subjectParam = searchParams.get('subject')
    if (subjectParam === 'english') {
      setSubject('english')
    } else if (subjectParam === 'chinese') {
      setSubject('chinese')
    } else {
      const saved = localStorage.getItem('bifeng-subject')
      if (saved === 'english') setSubject('english')
    }
  }, [searchParams])

  const handleSelectTraining = (type: string) => {
    if (type === 'paragraph-ordering') {
      router.push(`/thinking/paragraph-ordering?subject=${subject}`)
    } else if (type === 'argument-chain') {
      router.push(`/thinking/argument-chain?subject=${subject}`)
    } else if (type === 'multi-angle') {
      router.push(`/thinking/multi-angle?subject=${subject}`)
    } else if (type === 'writing-psychology') {
      router.push(`/thinking/writing-psychology?subject=${subject}`)
    } else if (type === 'topic-analysis') {
      router.push(`/training/${subject}/1`)
    } else if (type === 'paragraph-cards') {
      router.push(`/training/${subject}/2`)
    }
  }

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <ThinkingTrainingHub subject={subject} onSelectTraining={handleSelectTraining} />
    </div>
  )
}

export default function ThinkingPage() {
  return (
    <Suspense>
      <ThinkingPageContent />
    </Suspense>
  )
}
