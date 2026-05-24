import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/materials/collect
 * Collect a material from AI feedback or model essay.
 * Saves to the Material table for later review/use.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId = 'demo-user', content, source, category, subject, tags } = body

    if (!content || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: content, subject' },
        { status: 400 },
      )
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    })

    // Determine source and category defaults
    const materialSource = source || 'AI推荐'
    const materialCategory = category || '好词好句'

    const material = await prisma.material.create({
      data: {
        userId,
        content,
        source: materialSource,
        category: materialCategory,
        subject,
        tags: JSON.stringify(tags || []),
      },
    })

    return NextResponse.json({ material }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Material collect error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
