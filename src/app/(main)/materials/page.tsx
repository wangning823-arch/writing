'use client'

import { Suspense } from 'react'
import MaterialsView from '@/components/views/MaterialsView'

function MaterialsPageContent() {
  return <MaterialsView />
}

export default function MaterialsPage() {
  return (
    <Suspense>
      <MaterialsPageContent />
    </Suspense>
  )
}
