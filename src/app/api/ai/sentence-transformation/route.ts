import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { streamAIResponse, SSE_HEADERS } from '@/lib/ai/stream-helper'
import { getSentenceTransformationPrompt } from '@/lib/ai/prompts/sentence-transformation'

/**
 * POST /api/ai/sentence-transformation — 句式变换练习评估
 *
 * 评估学生完成句式变换的能力，从变换准确度、语言流畅度、修辞效果三个维度打分。
 * 支持 SSE 流式传输（请求体传 stream: true）。
 *
 * Body: { exercise, response, userId, stream? }
 */
const FALLBACK = {
  overallScore: 70, transformScore: 70, languageScore: 70, rhetoricScore: 70,
  scoringCriteria: { transform: '是否正确完成了要求的句式变换', language: '变换后的句子是否通顺流畅', rhetoric: '变换后是否增强了表达效果' },
  strengths: ['完成了句式变换练习'],
  suggestions: ['可以尝试更多样的句式变化', '注意变换后的语言流畅度'],
  referenceAnswer: '', exampleVariants: [],
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { exercise, response, userId, stream: enableStream } = body

    if (!exercise || !response) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const trimmed = response.trim()
    if (trimmed.length < 4) {
      return NextResponse.json({
        overallScore: 0, transformScore: 0, languageScore: 0, rhetoricScore: 0,
        scoringCriteria: { transform: '回答内容过少，未完成句式变换', language: '回答内容过少，无法评估语言表达', rhetoric: '回答内容过少，无法评估修辞效果' },
        strengths: [], suggestions: ['回答内容不完整，请认真完成句式变换'], referenceAnswer: '', exampleVariants: [],
      })
    }

    const { system, user } = getSentenceTransformationPrompt({
      exerciseType: exercise.type, originalSentence: exercise.originalSentence,
      prompt: exercise.prompt, response, subject: exercise.subject || 'chinese',
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
    console.error('Sentence transformation error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
