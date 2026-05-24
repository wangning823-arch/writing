import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/materials/search?q=关键词&category=论据&subject=chinese&sort=newest
 *
 * Full-text search on material content with filters and sorting.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || undefined
    const category = searchParams.get('category') || undefined
    const subject = searchParams.get('subject') || undefined
    const sort = searchParams.get('sort') || 'newest'
    const userId = searchParams.get('userId') || 'demo-user'

    const where: Record<string, unknown> = { userId }

    if (subject) {
      where.subject = subject
    }

    if (category && category !== '全部') {
      where.category = category
    }

    if (q) {
      where.content = { contains: q }
    }

    const orderBy: Record<string, string> = sort === 'popular'
      ? { usageCount: 'desc' }
      : { createdAt: 'desc' }

    const materials = await prisma.material.findMany({
      where,
      orderBy,
    })

    // Parse tags from JSON string
    const parsed = materials.map(m => ({
      ...m,
      tags: (() => {
        try { return JSON.parse(m.tags) }
        catch { return [] }
      })(),
    }))

    return NextResponse.json({ materials: parsed, total: parsed.length })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Material search error:', message)
    return NextResponse.json(
      { error: 'Failed to search materials: ' + message },
      { status: 500 }
    )
  }
}
