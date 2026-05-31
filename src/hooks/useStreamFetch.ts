'use client'

import { useState, useCallback, useRef } from 'react'

/**
 * SSE 流式请求的配置选项
 */
interface StreamFetchOptions {
  /** API 端点地址 */
  url: string
  /** POST 请求体，会自动追加 stream: true */
  body: Record<string, unknown>
}

/**
 * SSE 流式请求的返回结果
 * @template T - 最终解析结果的类型
 */
interface StreamFetchResult<T = any> {
  /** 流式传输过程中累积的文本片段 */
  streamText: string
  /** AI 返回的结构化 JSON 结果 */
  result: T | null
  /** 是否正在流式传输中 */
  isStreaming: boolean
  /** 错误信息，无错误时为 null */
  error: string | null
  /** 启动流式请求 */
  startStream: (options: StreamFetchOptions) => Promise<void>
  /** 重置所有状态并中断进行中的请求 */
  reset: () => void
}

/**
 * 通用 SSE (Server-Sent Events) 流式请求 Hook
 *
 * 用于消费后端返回的 SSE 流，自动解析 chunk/result/error 三种事件类型。
 * 支持中途取消、错误处理和状态重置。
 *
 * @example
 * ```tsx
 * const { streamText, result, isStreaming, startStream } = useStreamFetch()
 *
 * await startStream({
 *   url: '/api/ai/logic-reasoning',
 *   body: { exercise, response, userId, subject },
 * })
 * // result 会在流结束后自动填充
 * ```
 */
export function useStreamFetch<T = any>(): StreamFetchResult<T> {
  const [streamText, setStreamText] = useState('')
  const [result, setResult] = useState<T | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setStreamText('')
    setResult(null)
    setIsStreaming(false)
    setError(null)
  }, [])

  const startStream = useCallback(async ({ url, body }: StreamFetchOptions) => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setStreamText('')
    setResult(null)
    setError(null)
    setIsStreaming(true)

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, stream: true }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || '请求失败')
        setIsStreaming(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setError('无法读取响应流')
        setIsStreaming(false)
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue

          try {
            const event = JSON.parse(data)
            if (event.type === 'chunk') {
              setStreamText(prev => prev + event.text)
            } else if (event.type === 'result') {
              setResult(event.data)
            } else if (event.type === 'error') {
              setError(event.message)
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError('网络错误，请重试')
      }
    } finally {
      setIsStreaming(false)
    }
  }, [])

  return { streamText, result, isStreaming, error, startStream, reset }
}
