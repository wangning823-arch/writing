'use client'

import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { TrainingProvider } from '@/contexts/TrainingContext'
import { NavigationProvider } from '@/contexts/NavigationContext'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <TrainingProvider>
        <ThreeColumnLayout>{children}</ThreeColumnLayout>
      </TrainingProvider>
    </NavigationProvider>
  )
}
