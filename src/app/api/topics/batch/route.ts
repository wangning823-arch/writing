import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { complete } from '@/lib/ai/client'

export async function POST(req: NextRequest) {
  const { subject, genre, count = 10 } = await req.json()

  if (!subject || !['chinese', 'english'].includes(subject)) {
    return NextResponse.json({ error: 'Invalid subject' }, { status: 400 })
  }

  if (!genre) {
    return NextResponse.json({ error: 'Genre is required' }, { status: 400 })
  }

  const batchSize = Math.min(count, 20) // Max 20 per request
  const subjectLabel = subject === 'chinese' ? '语文' : '英语'
  const isChinese = subject === 'chinese'

  const examples = isChinese
    ? `高考真题风格参考：
1. "随着互联网的普及，人工智能的应用，越来越多的问题能很快得到答案。那么，我们的问题是否会越来越少？"（2024新课标I卷）
2. "人们因技术发展得以更好地掌控时间，但也有人因此成了时间的仆人。"（2023全国甲卷）
3. "双奥之城，闪耀世界。两次奥运会，都显示了中国体育发展的新高度。"（2022全国乙卷）
4. "有人说，真正的勇气不是无所畏惧，而是心怀恐惧却依然前行。"（模拟题）
5. "当下社会，'快'成为一种常态——快餐、快车、快递、快节奏。但也有人说，慢下来才能看见更多风景。"（模拟题）`
    : `Gaokao English topic style:
1. Write a letter to a foreign friend introducing your favorite Chinese tradition. (2024 National)
2. Your friend Chris plans to visit China and asks for advice. (2023 National)
3. Continuation: "I had an interesting childhood. It was filled with surprises and adventures." (2024 New Curriculum)
4. Speech: Write about environmental protection for school day. (2024 New Curriculum II)
5. Notice: Inform students about changes to library hours during exam period. (2021 New Curriculum)`

  const prompt = `你是一位资深高中${subjectLabel}教师和高考命题专家。请一次性生成 ${batchSize} 道高质量的${genre}题目。

要求：
1. 严格参考高考真题和模拟题的命题风格与难度
2. 每道题目描述清晰完整，包含具体的写作情境和要求
3. 难度适中，适合高中生水平
4. 话题多样，涵盖社会热点、人生哲理、文化传承、科技创新、青年成长等领域
5. 每道题目要具有思辨性，能引发深度思考
6. 题目之间话题不重复

参考示例：
${examples}

请严格按以下JSON数组格式输出，不要输出任何其他内容：
[
  {
    "title": "题目标题1",
    "description": "完整的题目描述（100-200字）",
    "requirements": "写作要求",
    "tags": ["标签1", "标签2"]
  },
  {
    "title": "题目标题2",
    "description": "完整的题目描述（100-200字）",
    "requirements": "写作要求",
    "tags": ["标签1", "标签2"]
  }
]`

  try {
    const res = await complete(prompt, {
      system: '你是高考命题专家，只输出JSON数组，不要输出任何其他内容。',
      maxTokens: 8192,
    })

    // Parse JSON array from response
    let topics: any[]
    try {
      const jsonMatch = res.text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('No JSON array found')
      topics = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    // Save each topic to DB
    const saved = []
    const timestamp = Date.now()
    for (let i = 0; i < topics.length; i++) {
      const t = topics[i]
      const id = `ai-${subject}-${timestamp}-${i}-${Math.random().toString(36).slice(2, 6)}`
      const topic = await prisma.topic.create({
        data: {
          id,
          source: 'AI生成',
          year: null,
          region: null,
          subject,
          type: genre,
          title: t.title,
          description: t.description,
          requirements: t.requirements,
          tags: JSON.stringify(t.tags || []),
          sampleEssays: '[]',
        },
      })
      saved.push({
        id: topic.id,
        title: topic.title,
        type: topic.type,
        source: topic.source,
      })
    }

    return NextResponse.json({ created: saved.length, topics: saved })
  } catch (error) {
    console.error('Batch generation error:', error)
    return NextResponse.json({ error: 'Batch generation failed' }, { status: 500 })
  }
}
