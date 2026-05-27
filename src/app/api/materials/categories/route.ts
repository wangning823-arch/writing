import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject') || ''

  try {
    const where: Record<string, unknown> = { isActive: true }
    if (subject) {
      where.OR = [{ subject }, { subject: 'all' }]
    }

    const categories = await prisma.materialCategory.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ categories })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
