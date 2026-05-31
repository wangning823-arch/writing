import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { getLogicReasoningPrompt } from '@/lib/ai/prompts/logic-reasoning'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { exercise, response, userId, subject } = body

    if (!exercise || !exercise.type || !exercise.prompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { system, user } = getLogicReasoningPrompt({
      type: exercise.type,
      prompt: exercise.prompt,
      response,
      subject: subject || 'chinese',
    })

    const res = await complete(user, { system, maxTokens: 2048 })
    console.log('[LogicReasoning] AI raw response:', res.text.substring(0, 500))

    let result: any
    try {
      const jsonMatch = res.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      result = JSON.parse(jsonMatch[0])
    } catch (e) {
      console.error('[LogicReasoning] JSON parse failed:', e, 'Raw text:', res.text.substring(0, 300))
      result = {
        overallScore: 70,
        logicScore: 70,
        evidenceScore: 70,
        clarityScore: 70,
        summary: '逻辑推理练习完成，建议加强论证的逻辑严密性。',
        strengths: ['完成了逻辑推理练习'],
        suggestions: ['可以尝试构建更完整的因果链', '注意论证的逻辑层次'],
        scoringCriteria: {
          logic: '推理过程是否逻辑自洽，因果关系是否成立',
          evidence: '论据是否具体、有力、充分',
          clarity: '表达是否清晰有条理，是否易于理解',
        },
        referenceAnswer: exercise.type === 'causal-chain'
          ? '示例：读书获取知识→知识积累拓宽视野→视野开阔促进思维深度→思维深度提升判断力'
          : exercise.type === 'analogy'
          ? '示例：磨刀是准备工作，虽然花费时间但提高效率；同理，预习复习看似占用时间，实际提高学习效率。两者都是"磨刀不误砍柴工"的道理。'
          : '示例：论证需要有明确的论点、充分的论据和严密的推理过程。',
        exampleVariants: ['完整的逻辑推理应包含清晰的因果关系和充分的论据支撑'],
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Logic reasoning error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
