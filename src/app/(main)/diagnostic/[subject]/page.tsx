'use client'

import { useParams } from 'next/navigation'
import DiagnosticView from '@/components/views/DiagnosticView'

export default function DiagnosticPage() {
  const params = useParams()
  const subject = params.subject as 'chinese' | 'english'

  return <DiagnosticView subject={subject} />
}
