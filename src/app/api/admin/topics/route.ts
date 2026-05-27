import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const subject = searchParams.get('subject') || ''
  const type = searchParams.get('type') || ''
  const source = searchParams.get('source') || ''

  try {
    const where: Record<string, unknown> = { id: { not: 'diagnostic-questions' } }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }
    if (subject) where.subject = subject
    if (type) where.type = type
    if (source) where.source = source

    const [topics, total] = await Promise.all([
      prisma.topic.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
        include: { _count: { select: { trainingRecords: true } } },
      }),
      prisma.topic.count({ where }),
    ])

    return NextResponse.json({ topics, total, page, limit })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, source, year, region, subject, type, title, description, requirements, tags } = body

    if (!id || !subject || !type || !title) {
      return NextResponse.json({ error: 'id, subject, type, title are required' }, { status: 400 })
    }

    const topic = await prisma.topic.create({
      data: {
        id,
        source: source || '自定义',
        year: year || null,
        region: region || null,
        subject,
        type,
        title,
        description: description || '',
        requirements: requirements || '',
        tags: JSON.stringify(tags || []),
        sampleEssays: JSON.stringify([]),
      },
    })

    return NextResponse.json({ topic }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
