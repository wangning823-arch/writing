import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { streamAIResponse, SSE_HEADERS } from '@/lib/ai/stream-helper'
import { getRhetoricPrompt } from '@/lib/ai/prompts/rhetoric'

/**
 * POST /api/ai/rhetoric — 修辞手法练习评估
 *
 * 评估学生对修辞手法的运用能力，从准确性、效果、创意三个维度打分。
 * 支持 SSE 流式传输（请求体传 stream: true）。
 *
 * Body: { exercise, response, userId, subject, stream? }
 */
const FALLBACK = {
  overallScore: 70, accuracyScore: 70, effectScore: 70, creativityScore: 70,
  summary: '修辞手法练习完成，建议加强对修辞效果的理解。',
  strengths: ['认真完成了修辞练习'],
  suggestions: ['可以尝试使用更多样的修辞手法', '注意修辞与内容的结合'],
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { exercise, response, userId, subject, stream: enableStream } = body

    if (!exercise || !exercise.type || !exercise.rhetoricType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { system, user } = getRhetoricPrompt({
      type: exercise.type, exercisePrompt: exercise.prompt,
      response, rhetoricType: exercise.rhetoricType, subject: subject || 'chinese',
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
    console.error('Rhetoric analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
