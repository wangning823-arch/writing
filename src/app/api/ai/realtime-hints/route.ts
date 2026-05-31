import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { getRealtimeHintsPrompt } from '@/lib/ai/prompts/realtime-hints'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, topic, subject, phase } = body

    if (!content) {
      return NextResponse.json({ hints: [] })
    }

    const { system, user } = getRealtimeHintsPrompt({
      content,
      topic,
      subject: subject || 'chinese',
      phase: phase || 'paragraph-check',
    })

    const res = await complete(user, { system, maxTokens: 512 })

    let result: any
    try {
      const jsonMatch = res.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      result = JSON.parse(jsonMatch[0])
    } catch {
      result = { hints: [] }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Realtime hints error:', error)
    return NextResponse.json({ hints: [] })
  }
}
