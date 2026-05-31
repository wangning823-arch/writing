export interface AIResponse {
  text: string
}

export interface AIStreamChunk {
  text: string
}

const PROVIDER = process.env.AI_PROVIDER || 'anthropic'

export async function complete(prompt: string, options?: { system?: string; maxTokens?: number; model?: string }): Promise<AIResponse> {
  if (PROVIDER === 'mimo') {
    const { complete: mimoComplete } = await import('./providers/openai')
    return mimoComplete(prompt, options)
  }

  const { complete: anthropicComplete } = await import('./providers/anthropic')
  return anthropicComplete(prompt, options)
}

export async function* stream(prompt: string, options?: { system?: string; maxTokens?: number; model?: string }): AsyncGenerator<AIStreamChunk> {
  if (PROVIDER === 'mimo') {
    const { stream: mimoStream } = await import('./providers/openai')
    yield* mimoStream(prompt, options)
    return
  }

  const { stream: anthropicStream } = await import('./providers/anthropic')
  yield* anthropicStream(prompt, options)
}
