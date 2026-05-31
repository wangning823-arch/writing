import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { streamAIResponse, SSE_HEADERS } from '@/lib/ai/stream-helper'
import { getRealtimeHintsPrompt } from '@/lib/ai/prompts/realtime-hints'

/**
 * POST /api/ai/realtime-hints — 实时写作提示
 *
 * 根据学生当前写作内容，在写作过程中实时生成提示和建议。
 * 支持 SSE 流式传输（请求体传 stream: true）。
 *
 * Body: { content, topic, subject, phase, stream? }
 */
const FALLBACK = { hints: [] }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, topic, subject, phase, stream: enableStream } = body

    if (!content) {
      return NextResponse.json({ hints: [] })
    }

    const { system, user } = getRealtimeHintsPrompt({
      content, topic, subject: subject || 'chinese', phase: phase || 'paragraph-check',
    })

    if (enableStream) {
      const readable = await streamAIResponse(user, { system, maxTokens: 512, fallbackResult: FALLBACK })
      return new Response(readable, { headers: SSE_HEADERS })
    }

    const res = await complete(user, { system, maxTokens: 512 })
    let result: any
    try {
      const jsonMatch = res.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      result = JSON.parse(jsonMatch[0])
    } catch { result = FALLBACK }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Realtime hints error:', error)
    return NextResponse.json({ hints: [] })
  }
}
