import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'

/**
 * POST /api/ai/generate-multi-angle-topic — 生成随机多角度分析题目
 *
 * 根据学科随机生成一个适合多角度分析训练的题目。
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
    const prompt = `You are a writing instructor creating a topic for multi-angle analysis practice.

Generate ONE random topic suitable for a ${lang} multi-perspective analysis exercise. The topic should:
- Be relevant to high school students
- Have clear multiple perspectives (individual, society, history/philosophy)
- Be thought-provoking and open to interpretation
- Allow for deep analysis from different viewpoints

For Chinese topics, consider: 社会现象, 人生哲理, 教育问题, 科技发展, 文化传承, 环境保护等
For English topics, consider: social issues, personal growth, education, technology, culture, environment等

Return ONLY a JSON object (no markdown code blocks) with this exact structure:
{
  "topic": "<the topic in ${lang}>",
  "description": "<a brief description of what the student should analyze from multiple angles, in ${lang}>"
}`

    const { text } = await complete(prompt, { maxTokens: 512 })
    let jsonStr = text.trim()
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    const result = JSON.parse(jsonStr)
    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Generate Multi-Angle Topic Error:', message)
    return NextResponse.json({ error: '生成题目失败: ' + message }, { status: 500 })
  }
}
