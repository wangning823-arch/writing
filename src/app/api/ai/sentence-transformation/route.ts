import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { getSentenceTransformationPrompt } from '@/lib/ai/prompts/sentence-transformation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { exercise, response, userId } = body

    if (!exercise || !response) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 对过短/无意义的回答直接返回0分，不调用AI
    const trimmed = response.trim()
    if (trimmed.length < 4) {
      return NextResponse.json({
        overallScore: 0,
        transformScore: 0,
        languageScore: 0,
        rhetoricScore: 0,
        scoringCriteria: {
          transform: '回答内容过少，未完成句式变换',
          language: '回答内容过少，无法评估语言表达',
          rhetoric: '回答内容过少，无法评估修辞效果',
        },
        strengths: [],
        suggestions: ['回答内容不完整，请认真完成句式变换，写出完整的变换后句子'],
        referenceAnswer: '',
        exampleVariants: [],
      })
    }

    const { system, user } = getSentenceTransformationPrompt({
      exerciseType: exercise.type,
      originalSentence: exercise.originalSentence,
      prompt: exercise.prompt,
      response,
      subject: exercise.subject || 'chinese',
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
        transformScore: 70,
        languageScore: 70,
        rhetoricScore: 70,
        scoringCriteria: {
          transform: '是否正确完成了要求的句式变换，结构是否符合规范',
          language: '变换后的句子是否通顺流畅，用词是否恰当',
          rhetoric: '变换后是否增强了表达效果，是否有文采',
        },
        strengths: ['完成了句式变换练习'],
        suggestions: ['可以尝试更多样的句式变化', '注意变换后的语言流畅度'],
        referenceAnswer: '',
        exampleVariants: [],
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Sentence transformation error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
