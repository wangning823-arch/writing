import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { getPreWritingPrompt } from '@/lib/ai/prompts/pre-writing'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, genre, currentIdea, phase, userId, subject } = body

    if (!topic || !phase) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { system, user } = getPreWritingPrompt({
      topic,
      genre,
      currentIdea,
      phase,
      subject: subject || 'chinese',
    })

    const res = await complete(user, { system, maxTokens: 2048 })

    let result: any
    try {
      const jsonMatch = res.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      result = JSON.parse(jsonMatch[0])
    } catch {
      result = {
        questions: ['你认为这个话题的核心矛盾是什么？', '你能从哪些角度来分析这个问题？'],
        encouragement: '好的开始！继续深入思考。',
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Pre-writing analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
