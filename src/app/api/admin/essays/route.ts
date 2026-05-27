import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '15')
    const search = searchParams.get('search') || ''
    const topicId = searchParams.get('topicId') || ''
    const source = searchParams.get('source') || ''
    const subject = searchParams.get('subject') || ''
    const essayTypeId = searchParams.get('essayTypeId') || ''
    const skip = (page - 1) * limit

    // Build raw SQL query
    const conditions: string[] = []
    const params: any[] = []

    if (search) {
      conditions.push('(e.title LIKE ? OR e.content LIKE ? OR e.author LIKE ?)')
      const like = `%${search}%`
      params.push(like, like, like)
    }
    if (topicId) {
      conditions.push('e.topicId = ?')
      params.push(topicId)
    }
    if (source) {
      conditions.push('e.source = ?')
      params.push(source)
    }
    if (essayTypeId) {
      conditions.push('e.essayTypeId = ?')
      params.push(essayTypeId)
    }
    if (subject) {
      conditions.push('e.topicId IN (SELECT id FROM Topic WHERE subject = ?)')
      params.push(subject)
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''

    // Count total
    const countResult = await prisma.$queryRawUnsafe<{ cnt: number }[]>(
      `SELECT COUNT(*) as cnt FROM SampleEssay e ${whereClause}`,
      ...params
    )
    const total = Number(countResult[0]?.cnt || 0)

    // Fetch essays
    const essays = await prisma.$queryRawUnsafe<any[]>(
      `SELECT e.* FROM SampleEssay e ${whereClause} ORDER BY e.createdAt DESC LIMIT ? OFFSET ?`,
      ...params, limit, skip
    )

    // Fetch topic and essayType info
    const topicIds = [...new Set(essays.map((e: any) => e.topicId))]
    const essayTypeIds = [...new Set(essays.map((e: any) => e.essayTypeId).filter(Boolean))]

    const topics = topicIds.length > 0
      ? await prisma.$queryRawUnsafe<any[]>(
          `SELECT id, title, subject FROM Topic WHERE id IN (${topicIds.map(() => '?').join(',')})`,
          ...topicIds
        )
      : []
    const essayTypes = essayTypeIds.length > 0
      ? await prisma.$queryRawUnsafe<any[]>(
          `SELECT id, name FROM EssayType WHERE id IN (${essayTypeIds.map(() => '?').join(',')})`,
          ...essayTypeIds
        )
      : []

    const topicMap = new Map(topics.map((t: any) => [t.id, t]))
    const essayTypeMap = new Map(essayTypes.map((t: any) => [t.id, t]))

    const essaysWithInfo = essays.map((e: any) => ({
      ...e,
      topic: topicMap.get(e.topicId) || null,
      essayType: e.essayTypeId ? essayTypeMap.get(e.essayTypeId) || null : null,
    }))

    return NextResponse.json({ essays: essaysWithInfo, total })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
