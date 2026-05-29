import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const topicIdsParam = searchParams.get('topicIds')
    const theme = searchParams.get('theme')
    const source = searchParams.get('source') // 'model' | 'gaokao' | 'theme'
    const subject = searchParams.get('subject') // 'chinese' | 'english'
    const level = searchParams.get('level')
    const abilityPoint = searchParams.get('abilityPoint')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}

    if (source) where.source = source
    if (theme) where.theme = theme

    if (topicIdsParam) {
      const ids = topicIdsParam.split(',').filter(Boolean)
      if (ids.length === 1) {
        where.topicId = ids[0]
      } else if (ids.length > 1) {
        where.topicId = { in: ids }
      }
    }

    if (subject) {
      // For model essays, subject is encoded in abilityPoint/genre patterns
      // For gaokao essays, filter via Topic join
      if (source === 'model') {
        // Model essays: chinese ones have Chinese abilityPoint, english have English
        // We'll filter after fetch since there's no subject column
      } else {
        where.topic = { subject }
      }
    }

    if (level) where.level = parseInt(level)
    if (abilityPoint) where.abilityPoint = abilityPoint

    const essays = await prisma.sampleEssay.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        source: true,
        year: true,
        region: true,
        topicId: true,
        theme: true,
        abilityPoint: true,
        level: true,
        techniques: true,
        genre: true,
        analysis: true,
      },
    })

    // Filter model essays by subject (chinese essays have Chinese abilityPoint like 开头段)
    let result = essays
    if (source === 'model' && subject) {
      const isChinese = (e: any) => {
        const ap = e.abilityPoint || ''
        return /[一-龥]/.test(ap)
      }
      result = subject === 'chinese'
        ? essays.filter(isChinese)
        : essays.filter(e => !isChinese(e))
    }

    // Parse techniques JSON
    const parsed = result.map((e: any) => ({
      ...e,
      techniques: e.techniques ? JSON.parse(e.techniques) : [],
    }))

    return NextResponse.json({ essays: parsed })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
