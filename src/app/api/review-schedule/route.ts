import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/review-schedule?userId=demo-user
 * Get today's review tasks for a user.
 * Returns entries where nextReview <= now and status != mastered.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'demo-user'

    const now = new Date()

    const reviewTasks = await prisma.reviewSchedule.findMany({
      where: {
        userId,
        nextReview: { lte: now },
        status: { not: 'mastered' },
      },
      orderBy: { nextReview: 'asc' },
    })

    return NextResponse.json({ reviewTasks })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Review schedule fetch error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * POST /api/review-schedule
 * Create or update a review schedule entry after training.
 *
 * Uses a simple spaced repetition algorithm:
 * - If score >= 80: double the interval, potentially mark as mastered
 * - If score >= 60: keep interval the same
 * - If score < 60: reset interval to 1
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      userId = 'demo-user',
      subject,
      level,
      score,
    } = body

    if (!subject || level == null || score == null) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, level, score' },
        { status: 400 },
      )
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    })

    // Find existing schedule for this subject+level
    const existing = await prisma.reviewSchedule.findFirst({
      where: { userId, subject, level: Number(level) },
    })

    const now = new Date()
    const levelNum = Number(level)
    const scoreNum = Number(score)

    let newInterval: number
    let newStatus: string

    if (scoreNum >= 80) {
      // Doing well - double interval
      newInterval = existing ? Math.min(existing.interval * 2, 60) : 2
      newStatus = newInterval >= 30 ? 'mastered' : 'reviewing'
    } else if (scoreNum >= 60) {
      // Adequate - keep interval
      newInterval = existing ? existing.interval : 1
      newStatus = 'reviewing'
    } else {
      // Needs work - reset interval
      newInterval = 1
      newStatus = 'learning'
    }

    // Calculate next review date
    const nextReview = new Date(now)
    nextReview.setDate(nextReview.getDate() + newInterval)

    let schedule

    if (existing) {
      schedule = await prisma.reviewSchedule.update({
        where: { id: existing.id },
        data: {
          lastPracticed: now,
          lastScore: scoreNum,
          reviewCount: { increment: 1 },
          nextReview,
          status: newStatus,
          interval: newInterval,
        },
      })
    } else {
      schedule = await prisma.reviewSchedule.create({
        data: {
          userId,
          subject,
          level: levelNum,
          lastPracticed: now,
          lastScore: scoreNum,
          reviewCount: 1,
          nextReview,
          status: newStatus,
          interval: newInterval,
        },
      })
    }

    return NextResponse.json({ schedule }, { status: existing ? 200 : 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Review schedule save error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
