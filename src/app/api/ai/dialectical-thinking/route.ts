import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { streamAIResponse, SSE_HEADERS } from '@/lib/ai/stream-helper'
import { getDialecticalThinkingPrompt } from '@/lib/ai/prompts/dialectical-thinking'

/**
 * POST /api/ai/dialectical-thinking — 辩证思维训练
 *
 * 评估学生的正反论证和让步反驳能力，从正面论证、反面论证、逻辑严密性三个维度打分。
 * 支持 SSE 流式传输（请求体传 stream: true）。
 *
 * Body: { exercise, responseA, responseB, userId, subject, stream? }
 */
const FALLBACK = {
  overallScore: 70, positiveScore: 70, negativeScore: 70, logicScore: 70,
  summary: '辩证思维训练完成，建议加强论据的充分性和逻辑的严密性。',
  strengths: ['完成了正反论证练习'],
  suggestions: ['可以尝试从更多角度寻找论据', '注意论证逻辑的严密性'],
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { exercise, responseA, responseB, userId, subject, stream: enableStream } = body

    if (!exercise || !exercise.topic || !exercise.type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const topic = exercise.topic
    const type = exercise.type
    const positiveArgument = type === 'pro-con' ? responseA : undefined
    const negativeArgument = type === 'pro-con' ? responseB : undefined
    const concession = type === 'concession-rebuttal' ? responseA : undefined
    const rebuttal = type === 'concession-rebuttal' ? responseB : undefined

    const { system, user } = getDialecticalThinkingPrompt({
      topic, type, positiveArgument, negativeArgument, concession, rebuttal,
      subject: subject || 'chinese',
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
    console.error('Dialectical thinking analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
