import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/error-records?userId=demo-user&subject=chinese
 * List user error records with optional subject filter.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'demo-user'
    const subject = searchParams.get('subject')
    const trainingRecordId = searchParams.get('trainingRecordId')

    const where: Record<string, unknown> = { userId }
    if (trainingRecordId) where.trainingRecordId = trainingRecordId
    if (subject) where.subject = subject

    const errorRecords = await prisma.errorRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ errors: errorRecords })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error records fetch error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * POST /api/error-records
 * Save error records from AI review.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId = 'demo-user', trainingRecordId, subject, errors } = body

    if (!trainingRecordId || !errors || !Array.isArray(errors) || errors.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: trainingRecordId, errors (array)' },
        { status: 400 },
      )
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    })

    // Verify training record exists
    const trainingRecord = await prisma.trainingRecord.findUnique({
      where: { id: trainingRecordId },
    })
    if (!trainingRecord) {
      return NextResponse.json(
        { error: 'Training record not found' },
        { status: 404 },
      )
    }

    // Use subject from training record if not provided
    const recordSubject = subject || trainingRecord.subject

    const created = []
    for (const error of errors) {
      const {
        errorType,
        subType,
        location,
        originalText,
        explanation,
        severity = 'medium',
      } = error

      if (!errorType || !location || !originalText || !explanation) {
        continue
      }

      const existing = await prisma.errorRecord.findFirst({
        where: {
          userId,
          errorType,
          location,
        },
      })

      let record
      if (existing) {
        record = await prisma.errorRecord.update({
          where: { id: existing.id },
          data: {
            isRecurring: true,
            lastOccurrence: new Date(),
            count: { increment: 1 },
          },
        })
      } else {
        record = await prisma.errorRecord.create({
          data: {
            userId,
            trainingRecordId,
            subject: recordSubject,
            errorType,
            subType: subType || null,
            location,
            originalText,
            explanation,
            severity,
            isRecurring: false,
          },
        })
      }

      created.push(record)
    }

    return NextResponse.json({ errors: created }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error records save error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
