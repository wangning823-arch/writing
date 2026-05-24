'use client'

import { Suspense } from 'react'
import ModelEssaysView from '@/components/views/ModelEssaysView'

function ModelEssaysPageContent() {
  return <ModelEssaysView />
}

export default function ModelEssaysPage() {
  return (
    <Suspense>
      <ModelEssaysPageContent />
    </Suspense>
  )
}
