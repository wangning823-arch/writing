const BASE_URL = process.env.MIMO_BASE_URL || 'https://api.xiaomimimo.com/v1'
const API_KEY = process.env.MIMO_API_KEY || ''
const MODEL = process.env.MIMO_MODEL || 'mimo-v2-flash'

async function callMIMO(messages: { role: string; content: string }[], options?: { maxTokens?: number; stream?: boolean; model?: string }) {
  const body = {
    model: options?.model || MODEL,
    messages,
    max_completion_tokens: options?.maxTokens ?? 4096,
    temperature: 0.7,
    top_p: 0.95,
    stream: options?.stream ?? false,
  }

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`MIMO API error ${response.status}: ${errText}`)
  }

  return response
}

export async function complete(prompt: string, options?: { system?: string; maxTokens?: number; model?: string }) {
  const messages = [
    ...(options?.system ? [{ role: 'system', content: options.system }] : []),
    { role: 'user', content: prompt },
  ]

  const response = await callMIMO(messages, { maxTokens: options?.maxTokens, stream: false, model: options?.model })
  const data = await response.json()

  const text = data.choices?.[0]?.message?.content
  if (!text) {
    throw new Error('MIMO returned no text')
  }

  return { text }
}

export async function* stream(prompt: string, options?: { system?: string; maxTokens?: number; model?: string }) {
  const messages = [
    ...(options?.system ? [{ role: 'system', content: options.system }] : []),
    { role: 'user', content: prompt },
  ]

  const response = await callMIMO(messages, { maxTokens: options?.maxTokens, stream: true, model: options?.model })

  if (!response.body) {
    throw new Error('MIMO stream response has no body')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim()
        if (data === '[DONE]') return

        try {
          const parsed = JSON.parse(data)
          const text = parsed.choices?.[0]?.delta?.content
          if (text) {
            yield { text }
          }
        } catch {
          // skip malformed chunks
        }
      }
    }
  }
}
