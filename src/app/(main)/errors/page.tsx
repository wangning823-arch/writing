'use client'

import { Suspense } from 'react'
import ErrorCasesView from '@/components/views/ErrorCasesView'

function ErrorsPageContent() {
  return <ErrorCasesView />
}

export default function ErrorsPage() {
  return (
    <Suspense>
      <ErrorsPageContent />
    </Suspense>
  )
}
