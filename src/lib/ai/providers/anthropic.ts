import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function complete(prompt: string, options?: { system?: string; maxTokens?: number; model?: string }) {
  const message = await client.messages.create({
    model: options?.model || 'claude-sonnet-4-20250514',
    max_tokens: options?.maxTokens ?? 4096,
    system: options?.system,
    messages: [{ role: 'user', content: prompt }],
  })

  const textBlock = message.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Anthropic returned no text')
  }

  return { text: textBlock.text }
}

export async function* stream(prompt: string, options?: { system?: string; maxTokens?: number; model?: string }) {
  const stream = client.messages.stream({
    model: options?.model || 'claude-sonnet-4-20250514',
    max_tokens: options?.maxTokens ?? 1024,
    system: options?.system,
    messages: [{ role: 'user', content: prompt }],
  })

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield { text: event.delta.text }
    }
  }
}
