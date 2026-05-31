import { NextRequest, NextResponse } from 'next/server'
import { reviewTraining, streamReviewTraining, advanceUserLevel } from '@/lib/ai/review-service'
import { complete } from '@/lib/ai/client'
import { CHINESE_ESSAY_PROMPT } from '@/lib/ai/prompts/chinese-essay'
import { ENGLISH_ESSAY_PROMPT } from '@/lib/ai/prompts/english-essay'

/**
 * POST /api/ai/review
 *
 * Supports two modes:
 *
 * 1. Legacy full-essay review (no `level` in body):
 *    Uses the existing chinese-essay / english-essay prompts.
 *
 * 2. Training-level review (`level` in body):
 *    Uses the new per-level prompts that evaluate only the
 *    skill targeted by that training level.
 *
 * Revision mode: include `isRevision: true` and `originalRecordId`
 * to trigger progress tracking.
 *
 * Streaming: include `stream: true` to get SSE response with real-time chunks.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      subject,
      topic,
      content,
      level,
      userId = 'anonymous',
      topicId,
      topicTitle,
      topicDescription,
      isRevision,
      originalRecordId,
      timeSpent,
      stream: enableStream,
    } = body

    // --- Validation ---
    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, content' },
        { status: 400 },
      )
    }

    if (subject !== 'chinese' && subject !== 'english') {
      return NextResponse.json(
        { error: 'Invalid subject. Must be "chinese" or "english".' },
        { status: 400 },
      )
    }

    // --- Training-level review (new path) ---
    if (level !== undefined && level !== null) {
      const levelNum = Number(level)
      if (isNaN(levelNum) || levelNum < 1) {
        return NextResponse.json(
          { error: 'Invalid level. Must be a positive integer.' },
          { status: 400 },
        )
      }

      const reviewRequest = {
        userId,
        subject,
        level: levelNum,
        topicId,
        topicTitle: topicTitle || topic || '自由写作',
        topicDescription: topicDescription || '',
        content,
        isRevision: Boolean(isRevision),
        originalRecordId,
        timeSpent: timeSpent ? Number(timeSpent) : undefined,
      }

      // --- Streaming path ---
      if (enableStream) {
        const generator = streamReviewTraining(reviewRequest)
        const encoder = new TextEncoder()
        const readable = new ReadableStream({
          async start(controller) {
            try {
              for await (const event of generator) {
                const data = JSON.stringify(event)
                controller.enqueue(encoder.encode(`data: ${data}\n\n`))
              }
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
            } catch (err) {
              const message = err instanceof Error ? err.message : 'Unknown error'
              const errorData = JSON.stringify({ type: 'error', message })
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
      const result = await reviewTraining(reviewRequest)

      let levelAdvanced = false
      if (result.isPass) {
        const advance = await advanceUserLevel(userId, subject, levelNum)
        levelAdvanced = advance.passed
      }

      return NextResponse.json({ feedback: result, levelAdvanced })
    }

    // --- Legacy full-essay review (original path) ---
    if (!topic) {
      return NextResponse.json(
        { error: 'Missing required field: topic' },
        { status: 400 },
      )
    }

    if (content.length < 50) {
      return NextResponse.json(
        { error: '作文内容太短，请至少写50字以上再提交评审' },
        { status: 400 },
      )
    }

    const promptTemplate =
      subject === 'chinese' ? CHINESE_ESSAY_PROMPT : ENGLISH_ESSAY_PROMPT

    const prompt = promptTemplate
      .replace('{topic}', topic)
      .replace('{content}', content)

    const { text } = await complete(prompt, { maxTokens: 4096 })

    let feedback
    try {
      let jsonStr = text.trim()
      // Strip markdown code block if present
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      }
      feedback = JSON.parse(jsonStr)
    } catch {
      return NextResponse.json(
        { error: 'AI返回内容解析失败', raw: text },
        { status: 500 },
      )
    }

    return NextResponse.json({ feedback })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('AI Review Error:', message)
    return NextResponse.json(
      { error: 'AI评审失败: ' + message },
      { status: 500 },
    )
  }
}
