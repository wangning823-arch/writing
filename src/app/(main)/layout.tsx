'use client'

import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { TrainingProvider } from '@/contexts/TrainingContext'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <TrainingProvider>
      <ThreeColumnLayout>{children}</ThreeColumnLayout>
    </TrainingProvider>
  )
}
