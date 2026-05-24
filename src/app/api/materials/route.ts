import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/materials?userId=demo-user&subject=chinese
 * List user materials with optional subject filter.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'demo-user'
    const subject = searchParams.get('subject')

    const where: Record<string, unknown> = { userId }
    if (subject) where.subject = subject

    const materials = await prisma.material.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ materials })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Materials fetch error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * POST /api/materials
 * Save a new material.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { content, source, tags, category, subject, userId = 'demo-user' } = body

    if (!content || !source || !category || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: content, source, category, subject' },
        { status: 400 },
      )
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    })

    const material = await prisma.material.create({
      data: {
        userId,
        content,
        source,
        tags: JSON.stringify(tags || []),
        category,
        subject,
      },
    })

    return NextResponse.json({ material }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Material save error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
