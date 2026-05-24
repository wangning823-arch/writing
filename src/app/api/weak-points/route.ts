import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/weak-points?userId=demo-user
 * List user weak points.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'demo-user'
    const subject = searchParams.get('subject')

    const where: Record<string, unknown> = { userId }
    if (subject) where.subject = subject

    const weakPoints = await prisma.weakPoint.findMany({
      where,
      orderBy: { lastOccurrence: 'desc' },
    })

    return NextResponse.json({ weakPoints })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Weak points fetch error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * POST /api/weak-points
 * Add or update a weak point.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      userId = 'demo-user',
      id: existingId,
      subject,
      dimension,
      description,
      improvement,
      recommendedTraining,
    } = body

    if (!dimension || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: dimension, description' },
        { status: 400 },
      )
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    })

    let weakPoint

    if (existingId) {
      // Update existing weak point
      const updateData: Record<string, unknown> = {
        lastOccurrence: new Date(),
        frequency: { increment: 1 },
      }
      if (improvement != null) updateData.improvement = improvement
      if (recommendedTraining != null) updateData.recommendedTraining = recommendedTraining

      weakPoint = await prisma.weakPoint.update({
        where: { id: existingId },
        data: updateData,
      })
    } else {
      // Create new weak point
      weakPoint = await prisma.weakPoint.create({
        data: {
          userId,
          subject: subject || null,
          dimension,
          description,
          lastOccurrence: new Date(),
          improvement: improvement || null,
          recommendedTraining: recommendedTraining || null,
        },
      })
    }

    return NextResponse.json({ weakPoint }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Weak point save error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
