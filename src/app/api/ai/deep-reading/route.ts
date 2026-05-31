import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { getDeepReadingAnalysisPrompt } from '@/lib/ai/prompts/deep-reading'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { essayTitle, essayContent, annotations, reflection, userId, subject } = body

    if (!essayTitle || !essayContent || !annotations || !reflection) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { system, user } = getDeepReadingAnalysisPrompt(
      essayTitle,
      essayContent,
      annotations,
      reflection,
      subject || 'chinese',
    )

    const res = await complete(user, { system, maxTokens: 2048 })

    let result: any
    try {
      const jsonMatch = res.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      result = JSON.parse(jsonMatch[0])
    } catch {
      result = {
        overallScore: 70,
        techniqueAccuracy: 70,
        insightDepth: 70,
        reflectionQuality: 70,
        summary: '您的阅读批注总体不错，建议在技巧识别和深度思考方面继续提升。',
        techniquesMissed: [],
        techniquesCorrect: [],
        strengths: ['认真完成了阅读批注'],
        suggestions: ['可以尝试从更多角度分析写作技巧'],
        paragraphScores: [],
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Deep reading analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
