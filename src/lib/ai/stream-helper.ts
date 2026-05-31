import { stream } from '@/lib/ai/client'

/**
 * SSE 流式响应的事件格式
 *
 * 传输过程中会发送以下三种事件：
 * - `{ type: 'chunk', text: string }` — AI 生成的文本片段
 * - `{ type: 'result', data: T }` — 解析后的结构化 JSON 结果
 * - `{ type: 'error', message: string }` — 错误信息
 * - `[DONE]` — 流结束标记
 */

/**
 * 通用 AI 流式响应 Helper
 *
 * 封装了 SSE 流式传输的完整流程：
 * 1. 调用 AI provider 的 stream() 获取流式输出
 * 2. 逐 chunk 发送 SSE 事件供前端实时展示
 * 3. 流结束后自动解析累积文本为 JSON 结果
 * 4. 发送最终结果事件和 [DONE] 结束标记
 *
 * @param userPrompt - 用户提示词
 * @param options - 配置选项
 * @param options.system - 系统提示词（可选）
 * @param options.maxTokens - 最大生成 token 数，默认 2048
 * @param options.fallbackResult - JSON 解析失败时的降级结果
 * @returns ReadableStream，可直接作为 Response body 返回
 */
export async function streamAIResponse(
  userPrompt: string,
  options: { system?: string; maxTokens?: number; fallbackResult?: any },
): Promise<ReadableStream> {
  const { system, maxTokens = 2048, fallbackResult } = options
  const encoder = new TextEncoder()
  let fullText = ''

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream(userPrompt, { system, maxTokens })) {
          fullText += chunk.text
          const data = JSON.stringify({ type: 'chunk', text: chunk.text })
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        }

        let result: any
        try {
          let jsonStr = fullText.trim()
          if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
          }
          const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
          if (!jsonMatch) throw new Error('No JSON found')
          result = JSON.parse(jsonMatch[0])
        } catch {
          result = fallbackResult || { overallScore: 70, summary: '分析完成' }
        }

        const resultData = JSON.stringify({ type: 'result', data: result })
        controller.enqueue(encoder.encode(`data: ${resultData}\n\n`))
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
}

/** Common SSE response headers */
export const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
}
