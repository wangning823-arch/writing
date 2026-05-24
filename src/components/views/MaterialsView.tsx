'use client'

import { useSearchParams } from 'next/navigation'
import MaterialLibrary from '@/components/training/MaterialLibrary'
import { useNavigation } from '@/contexts/NavigationContext'

export default function MaterialsView() {
  const searchParams = useSearchParams()
  const { userId } = useNavigation()
  const subject = (searchParams.get('subject') as 'chinese' | 'english') || 'chinese'

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '24px' }}>
        {subject === 'chinese' ? '语文' : '英语'}素材库
      </h1>
      <MaterialLibrary userId={userId} subject={subject} />
    </div>
  )
}
