import { prisma } from '@/lib/db'
import { Topic } from '@/types'

const GENRE_FILTERS: Record<string, string[]> = {
  // English L3: 应用文格式 — only application writing types
  'english-3': ['书信', '演讲', '通知', '应用文'],
  // English L4: 读后续写开头 — only continuation types
  'english-4': ['读后续写'],
}

function parseTags(tagsStr: string): string[] {
  try { return JSON.parse(tagsStr) } catch { return [] }
}

function parseSampleEssays(str: string): string[] {
  try { return JSON.parse(str) } catch { return [] }
}

function dbTopicToTopic(row: any): Topic {
  return {
    id: row.id,
    subject: row.subject,
    type: row.type,
    title: row.title,
    description: row.description,
    requirements: row.requirements || undefined,
    source: row.source,
    year: row.year,
    region: row.region,
    tags: parseTags(row.tags),
  }
}

export async function selectTopic(
  subject: string,
  level: number,
  userId: string
): Promise<Topic | null> {
  // 1. Query all topics for this subject
  const rows = await prisma.topic.findMany({
    where: { subject, NOT: { id: 'diagnostic-questions' } },
  })

  if (rows.length === 0) return null

  // 2. Genre filter for level-specific requirements
  const filterKey = `${subject}-${level}`
  const genreFilter = GENRE_FILTERS[filterKey]
  let candidates = rows
  if (genreFilter) {
    candidates = rows.filter(r => genreFilter.includes(r.type))
  }

  if (candidates.length === 0) candidates = rows

  // 3. Get recent practice history for this user+subject
  const recentRecords = await prisma.trainingRecord.findMany({
    where: { userId, subject },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { topicId: true },
  })

  const recentTopicIds = recentRecords
    .map(r => r.topicId)
    .filter(Boolean) as string[]

  const last3 = new Set(recentTopicIds.slice(0, 3))
  const last10 = new Set(recentTopicIds.slice(0, 10))
  const last20 = new Set(recentTopicIds.slice(0, 20))

  // 4. Weighted random selection
  const weighted: { row: any; weight: number }[] = candidates.map(row => {
    if (last3.has(row.id)) return { row, weight: 0 }
    if (last10.has(row.id)) return { row, weight: 2 }
    if (last20.has(row.id)) return { row, weight: 7 }
    return { row, weight: 10 }
  })

  const available = weighted.filter(w => w.weight > 0)
  if (available.length === 0) {
    // All topics recently used — pick any random
    const idx = Math.floor(Math.random() * candidates.length)
    return dbTopicToTopic(candidates[idx])
  }

  const totalWeight = available.reduce((sum, w) => sum + w.weight, 0)
  let rand = Math.random() * totalWeight
  for (const item of available) {
    rand -= item.weight
    if (rand <= 0) return dbTopicToTopic(item.row)
  }

  return dbTopicToTopic(available[available.length - 1].row)
}

export async function generateTopic(
  subject: string,
  level: number,
  genre: string
): Promise<Topic> {
  const { complete } = await import('@/lib/ai/client')

  const subjectLabel = subject === 'chinese' ? '语文' : '英语'
  const isChinese = subject === 'chinese'

  const examples = isChinese
    ? `参考历年高考真题风格：
1. 2024新课标I卷："随着互联网的普及，人工智能的应用，越来越多的问题能很快得到答案。那么，我们的问题是否会越来越少？"
2. 2023全国甲卷："人们因技术发展得以更好地掌控时间，但也有人因此成了时间的仆人。"
3. 2022全国乙卷："双奥之城，闪耀世界。两次奥运会，都显示了中国体育发展的新高度。"
4. 2021新高考I卷："生逢其时，重任在肩——1917年毛泽东在《新青年》发表《体育之研究》。"
5. 2020全国I卷："春秋时期，齐国的公子纠与公子小白争夺君位，管仲和鲍叔牙分别辅佐二人。"
6. 2019全国I卷："'民生在勤，勤则不匮。'劳动是财富的源泉，也是幸福的源泉。"
7. 2018全国I卷："2000年农历庚辰龙年，人类迈进新千年，中国千万'世纪宝宝'出生。"
8. 模拟题风格："有人说，真正的勇气不是无所畏惧，而是心怀恐惧却依然前行。请以'真正的勇气'为题写一篇议论文。"
9. 模拟题风格："当下社会，'快'成为一种常态——快餐、快车、快递、快节奏。但也有人说，慢下来才能看见更多风景。"
10. 模拟题风格："传统文化是一个民族的精神命脉。在现代社会中，如何传承和创新传统文化？"
11. 记叙文风格："生活中总有一些时刻，像一束光，照亮我们前行的路。请以'那束光'为题写一篇记叙文。"
12. 记叙文风格："成长的路上，总有一些特别的时刻让我们突然意识到自己已经长大。请记叙这样一个时刻。"`
    : `Reference real gaokao (高考) English writing topics:
1. 2024 National: Write a letter to a foreign friend introducing your favorite Chinese tradition.
2. 2023 National: Your foreign friend Chris plans to visit China and asks for advice.
3. 2022 National: Write a letter to a foreign friend learning Chinese, sharing tips.
4. 2021 New Curriculum: Write a notice about the upcoming English Speech Contest.
5. 2020 National: Your friend Jim wants to learn Chinese calligraphy. Give advice.
6. 2019 National: Write a letter about volunteering in China.
7. Continuation: "I had an interesting childhood. It was filled with surprises and adventures, most of which involved my mother."
8. Continuation: "It was the day of the big cross-country race. Students gathered at the starting line."
9. Speech: Write a speech about environmental protection for school day.
10. Notice: Inform students about changes to library hours during exam period.`

  const prompt = `你是一位资深高中${subjectLabel}教师和高考命题专家。请生成一道高质量的${genre}题目。

要求：
1. 严格参考高考真题和模拟题的命题风格与难度
2. 题目描述清晰完整，包含具体的写作情境和要求
3. 难度适中，适合高中生水平
4. 话题新颖但不偏不怪，贴近学生生活和社会热点
5. 题目要具有思辨性，能引发深度思考

参考示例：
${examples}

请严格按以下JSON格式输出，不要输出任何其他内容：
{
  "title": "题目标题（简洁有力）",
  "description": "完整的题目描述（包含材料/情境和具体写作要求，100-200字）",
  "requirements": "写作要求（字数、格式等限制条件）",
  "tags": ["话题标签1", "话题标签2", "话题标签3"]
}`

  const res = await complete(prompt, {
    system: '你是高考命题专家，只输出JSON，不要输出任何其他内容。',
    maxTokens: 1024,
  })

  // Parse JSON from response
  let parsed: any
  try {
    const jsonMatch = res.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')
    parsed = JSON.parse(jsonMatch[0])
  } catch {
    // Fallback topic if AI response is malformed
    parsed = {
      title: isChinese ? '时代与青年' : 'A Letter About Growth',
      description: isChinese
        ? '每一代青年都有自己的际遇和机缘，都要在自己所处的时代条件下谋划人生、创造历史。请以"时代与青年"为话题，写一篇不少于800字的文章。'
        : 'Write a letter to your foreign friend about how you have grown and changed over the past year.',
      requirements: isChinese ? '不少于800字，自选角度，自拟题目' : 'About 120 words',
      tags: isChinese ? ['青年', '时代'] : ['growth', 'reflection'],
    }
  }

  // Save to DB
  const id = `ai-${subject}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const topic = await prisma.topic.create({
    data: {
      id,
      source: 'AI生成',
      year: null,
      region: null,
      subject,
      type: genre,
      title: parsed.title,
      description: parsed.description,
      requirements: parsed.requirements,
      tags: JSON.stringify(parsed.tags || []),
      sampleEssays: '[]',
    },
  })

  return dbTopicToTopic(topic)
}
