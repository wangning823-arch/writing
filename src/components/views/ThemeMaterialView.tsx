'use client'

import ThemeMaterialLibrary from '@/components/training/ThemeMaterialLibrary'

interface ThemeMaterialViewProps {
  onBack: () => void
  userId?: string
}

export default function ThemeMaterialView({ onBack, userId }: ThemeMaterialViewProps) {
  return <ThemeMaterialLibrary onBack={onBack} userId={userId} />
}
