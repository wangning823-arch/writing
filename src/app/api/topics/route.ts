import { NextRequest, NextResponse } from 'next/server'
import { selectTopic } from '@/lib/topic-selector'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject')
  const level = parseInt(searchParams.get('level') || '1')
  const userId = searchParams.get('userId') || 'demo-user'

  if (!subject || !['chinese', 'english'].includes(subject)) {
    return NextResponse.json({ error: 'Invalid subject' }, { status: 400 })
  }

  try {
    const topic = await selectTopic(subject, level, userId)
    if (!topic) {
      return NextResponse.json({ error: 'No topics available' }, { status: 404 })
    }
    return NextResponse.json({ topic })
  } catch (error) {
    console.error('Topic selection error:', error)
    return NextResponse.json({ error: 'Failed to select topic' }, { status: 500 })
  }
}
