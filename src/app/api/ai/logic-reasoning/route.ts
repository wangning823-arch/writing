import { NextRequest, NextResponse } from 'next/server'
import { complete, stream } from '@/lib/ai/client'
import { getLogicReasoningPrompt } from '@/lib/ai/prompts/logic-reasoning'

/**
 * POST /api/ai/logic-reasoning — 逻辑推理练习评估
 *
 * 评估学生的逻辑推理能力，从逻辑严密性、论据充分性、表达清晰度三个维度打分。
 * 本路由手动实现 SSE 流式传输（使用 stream() 而非 streamAIResponse）。
 * 支持 SSE 流式传输（请求体传 stream: true）。
 *
 * Body: { exercise, response, userId, subject, stream? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { exercise, response, userId, subject, stream: enableStream } = body

    if (!exercise || !exercise.type || !exercise.prompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { system, user } = getLogicReasoningPrompt({
      type: exercise.type,
      prompt: exercise.prompt,
      response,
      subject: subject || 'chinese',
    })

    // --- Streaming path ---
    if (enableStream) {
      const aiStream = stream(user, { system, maxTokens: 2048 })
      const encoder = new TextEncoder()
      let fullText = ''

      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of aiStream) {
              fullText += chunk.text
              const data = JSON.stringify({ type: 'chunk', text: chunk.text })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }

            // Parse the accumulated text
            let result: any
            try {
              const jsonMatch = fullText.match(/\{[\s\S]*\}/)
              if (!jsonMatch) throw new Error('No JSON found')
              result = JSON.parse(jsonMatch[0])
            } catch {
              result = buildFallbackResult(exercise)
            }

            const resultData = JSON.stringify({ type: 'result', data: result })
            controller.enqueue(encoder.encode(`data: ${resultData}\n\n`))
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error'
            const errorData = JSON.stringify({ type: 'error', message: errorMsg })
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          }
        },
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // --- Non-streaming path ---
    const res = await complete(user, { system, maxTokens: 2048 })
    console.log('[LogicReasoning] AI raw response:', res.text.substring(0, 500))

    let result: any
    try {
      const jsonMatch = res.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      result = JSON.parse(jsonMatch[0])
    } catch (e) {
      console.error('[LogicReasoning] JSON parse failed:', e, 'Raw text:', res.text.substring(0, 300))
      result = buildFallbackResult(exercise)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Logic reasoning error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}

/** 当 AI 返回内容解析失败时的降级结果 */
function buildFallbackResult(exercise: any) {
  return {
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
