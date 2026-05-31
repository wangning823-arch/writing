import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { getRhetoricPrompt } from '@/lib/ai/prompts/rhetoric'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { exercise, response, userId, subject } = body

    if (!exercise || !exercise.type || !exercise.rhetoricType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { system, user } = getRhetoricPrompt({
      type: exercise.type,
      exercisePrompt: exercise.prompt,
      response,
      rhetoricType: exercise.rhetoricType,
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
        overallScore: 70,
        accuracyScore: 70,
        effectScore: 70,
        creativityScore: 70,
        summary: '修辞手法练习完成，建议加强对修辞效果的理解。',
        strengths: ['认真完成了修辞练习'],
        suggestions: ['可以尝试使用更多样的修辞手法', '注意修辞与内容的结合'],
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Rhetoric analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
