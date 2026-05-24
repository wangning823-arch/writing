import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/errors?userId=demo-user&subject=chinese
 *
 * Fetch the user's error archive, grouped by type with occurrence counts.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'demo-user'
    const subject = searchParams.get('subject') || undefined

    const where: Record<string, unknown> = { userId }
    if (subject) {
      // Filter through training records that match the subject
      where.trainingRecord = { subject }
    }

    const errors = await prisma.errorRecord.findMany({
      where,
      orderBy: { count: 'desc' },
    })

    // Group errors by errorType
    const grouped: Record<string, typeof errors> = {}
    for (const err of errors) {
      if (!grouped[err.errorType]) {
        grouped[err.errorType] = []
      }
      grouped[err.errorType].push(err)
    }

    return NextResponse.json({
      errors: errors.map((e) => ({
        id: e.id,
        errorType: e.errorType,
        subType: e.subType,
        location: e.location,
        explanation: e.explanation,
        severity: e.severity,
        count: e.count,
        isRecurring: e.isRecurring,
        firstOccurrence: e.firstOccurrence,
        lastOccurrence: e.lastOccurrence,
      })),
      grouped,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Fetch errors error:', message)
    return NextResponse.json(
      { error: 'Failed to fetch errors: ' + message },
      { status: 500 },
    )
  }
}
