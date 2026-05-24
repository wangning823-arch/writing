import { NextRequest, NextResponse } from 'next/server'
import { generateTopic } from '@/lib/topic-selector'

export async function POST(req: NextRequest) {
  const { subject, level, genre } = await req.json()

  if (!subject || !['chinese', 'english'].includes(subject)) {
    return NextResponse.json({ error: 'Invalid subject' }, { status: 400 })
  }

  if (!genre) {
    return NextResponse.json({ error: 'Genre is required' }, { status: 400 })
  }

  try {
    const topic = await generateTopic(subject, level || 1, genre)
    return NextResponse.json({ topic })
  } catch (error) {
    console.error('Topic generation error:', error)
    return NextResponse.json({ error: 'Failed to generate topic' }, { status: 500 })
  }
}
