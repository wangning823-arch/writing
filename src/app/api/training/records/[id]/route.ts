import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const record = await prisma.trainingRecord.findUnique({
    where: { id },
    include: { topic: { select: { id: true, title: true, type: true, source: true, year: true } } },
  })

  if (!record) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 })
  }

  return NextResponse.json({
    id: record.id,
    subject: record.subject,
    level: record.level,
    score: record.score,
    content: record.content,
    dimensionScores: record.dimensionScores,
    feedback: record.feedback,
    suggestions: record.suggestions,
    isRevision: record.isRevision,
    revisionOf: record.revisionOf,
    timeSpent: record.timeSpent,
    createdAt: record.createdAt,
    topic: record.topic,
  })
}
