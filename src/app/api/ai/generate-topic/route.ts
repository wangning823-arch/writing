import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'

/**
 * POST /api/ai/generate-topic — 生成随机论证题目
 *
 * 根据学科随机生成一个适合论证链条训练的题目。
 *
 * Body: { subject: 'chinese' | 'english' }
 * Response: { topic: string, description: string }
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { subject } = body as { subject: 'chinese' | 'english' }

    if (!subject) {
      return NextResponse.json({ error: '缺少 subject 字段' }, { status: 400 })
    }

    const lang = subject === 'english' ? 'English' : 'Chinese'
    const prompt = `You are a writing instructor creating a topic for argument chain practice.

Generate ONE random topic suitable for a ${lang} argumentative essay. The topic should:
- Be relevant to high school students
- Have multiple perspectives to argue
- Be thought-provoking but not too controversial
- Allow for clear claims, evidence, analysis, and summaries

For Chinese topics, consider: 传统文化, 社会热点, 人生哲理, 科技发展, 教育, 环境等
For English topics, consider: technology, education, environment, culture, society, personal growth等

Return ONLY a JSON object (no markdown code blocks) with this exact structure:
{
  "topic": "<the topic/titile in ${lang}>",
  "description": "<a brief description of what the student should argue about, in ${lang}>"
}`

    const { text } = await complete(prompt, { maxTokens: 512 })
    let jsonStr = text.trim()
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    const result = JSON.parse(jsonStr)
    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Generate Topic Error:', message)
    return NextResponse.json({ error: '生成题目失败: ' + message }, { status: 500 })
  }
}
