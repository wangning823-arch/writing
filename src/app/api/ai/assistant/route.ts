import { NextRequest } from 'next/server'
import { stream } from '@/lib/ai/client'
import { ASSISTANT_PROMPT } from '@/lib/ai/prompts/assistant'

export async function POST(req: NextRequest) {
  try {
    const { subject, topic, currentContent, message: userMessage } = await req.json()

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'Missing message' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const systemPrompt = ASSISTANT_PROMPT
      .replace('{subject}', subject === 'chinese' ? '语文' : '英语')
      .replace('{topic}', topic || '自由写作')
      .replace(
        '{currentContent}',
        currentContent ? currentContent.slice(0, 500) + '...' : '尚未开始写作'
      )

    const aiStream = stream(userMessage, { system: systemPrompt, maxTokens: 1024 })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of aiStream) {
            const data = JSON.stringify({ text: chunk.text })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.error(err)
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('AI Assistant Error:', message)
    return new Response(JSON.stringify({ error: 'AI助手请求失败: ' + message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
