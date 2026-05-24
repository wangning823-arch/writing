import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') || 'demo-user'
  const subject = req.nextUrl.searchParams.get('subject')
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20')
  const skip = (page - 1) * limit

  const where: any = { userId }
  if (subject) where.subject = subject

  const [records, total] = await Promise.all([
    prisma.trainingRecord.findMany({
      where,
      include: { topic: { select: { id: true, title: true, type: true, source: true, year: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.trainingRecord.count({ where }),
  ])

  const items = records.map(r => ({
    id: r.id,
    subject: r.subject,
    level: r.level,
    score: r.score,
    content: r.content,
    dimensionScores: r.dimensionScores,
    isRevision: r.isRevision,
    revisionOf: r.revisionOf,
    timeSpent: r.timeSpent,
    createdAt: r.createdAt,
    topic: r.topic,
  }))

  return NextResponse.json({ items, total, page, limit })
}
