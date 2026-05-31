import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { getConceptAnalysisPrompt } from '@/lib/ai/prompts/concept-analysis'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { exercise, response, userId, subject } = body

    if (!exercise || !exercise.type || !exercise.concepts || !exercise.prompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { system, user } = getConceptAnalysisPrompt({
      type: exercise.type,
      concepts: exercise.concepts,
      prompt: exercise.prompt,
      response,
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
        depthScore: 70,
        logicScore: 70,
        summary: '概念辨析练习完成，建议加强概念之间的对比分析。',
        strengths: ['认真完成了概念辨析'],
        suggestions: ['可以尝试从更多维度区分概念', '注意概念之间的细微差别'],
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Concept analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
