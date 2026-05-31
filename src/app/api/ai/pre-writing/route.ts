import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { streamAIResponse, SSE_HEADERS } from '@/lib/ai/stream-helper'
import { getPreWritingPrompt } from '@/lib/ai/prompts/pre-writing'

/**
 * POST /api/ai/pre-writing — 写前构思引导
 *
 * 根据话题和写作阶段，生成引导性问题和鼓励性反馈，帮助学生拓展思路。
 * 支持 SSE 流式传输（请求体传 stream: true）。
 *
 * Body: { topic, genre, currentIdea, phase, userId, subject, stream? }
 */
const FALLBACK = {
  questions: ['你认为这个话题的核心矛盾是什么？', '你能从哪些角度来分析这个问题？'],
  encouragement: '好的开始！继续深入思考。',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, genre, currentIdea, phase, userId, subject, stream: enableStream } = body

    if (!topic || !phase) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { system, user } = getPreWritingPrompt({
      topic, genre, currentIdea, phase, subject: subject || 'chinese',
    })

    if (enableStream) {
      const readable = await streamAIResponse(user, { system, maxTokens: 2048, fallbackResult: FALLBACK })
      return new Response(readable, { headers: SSE_HEADERS })
    }

    const res = await complete(user, { system, maxTokens: 2048 })
    let result: any
    try {
      const jsonMatch = res.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      result = JSON.parse(jsonMatch[0])
    } catch { result = FALLBACK }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Pre-writing analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
