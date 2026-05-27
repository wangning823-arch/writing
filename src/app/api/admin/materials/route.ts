import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const subject = searchParams.get('subject') || ''
  const category = searchParams.get('category') || ''

  try {
    const where: Record<string, unknown> = {}
    if (subject) where.subject = subject
    if (category) where.category = category

    const [materials, total] = await Promise.all([
      prisma.material.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true } } },
      }),
      prisma.material.count({ where }),
    ])

    return NextResponse.json({ materials, total, page, limit })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { content, source, category, subject, tags, userId } = body

    if (!content || !category || !subject) {
      return NextResponse.json({ error: 'content, category, subject are required' }, { status: 400 })
    }

    const material = await prisma.material.create({
      data: {
        content,
        source: source || 'admin',
        category,
        subject,
        tags: tags || '[]',
        userId: userId || 'admin-user',
      },
      include: { user: { select: { id: true, name: true } } },
    })

    return NextResponse.json({ material })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
