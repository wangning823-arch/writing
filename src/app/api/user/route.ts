import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/user?userId=demo-user
 * Fetch user data including grade, theme, streak, achievements.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'demo-user'

    let user = await prisma.user.findUnique({
      where: { id: userId },
    })

    // Auto-create user if not found
    if (!user) {
      user = await prisma.user.create({
        data: { id: userId },
      })
    }

    // Check streak: if lastPracticedDate is today, keep streak; if yesterday, increment; else reset
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    let currentStreak = user.currentStreak

    if (user.lastPracticedDate === today) {
      // Already trained today, streak is current
    } else if (user.lastPracticedDate === yesterday) {
      // Trained yesterday, streak continues
    } else if (user.lastPracticedDate != null) {
      // Missed a day, reset streak
      currentStreak = 0
    }

    // Fetch achievements (if the model exists)
    let achievements: { name: string; icon: string }[] = []
    try {
      const userAchievements = await (prisma as any).achievement.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 3,
      })
      if (userAchievements && Array.isArray(userAchievements)) {
        achievements = userAchievements.map((a: any) => ({
          name: a.name || '未命名',
          icon: a.icon || '🏆',
        }))
      }
    } catch {
      // Achievement model may not exist yet; return empty
    }

    return NextResponse.json({
      userId: user.id,
      grade: user.grade,
      theme: user.theme,
      currentStreak,
      longestStreak: user.longestStreak,
      lastPracticedDate: user.lastPracticedDate,
      totalTrainings: user.totalTrainings,
      achievements,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('User fetch error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * POST /api/user
 * Update user data (grade, theme, streak, etc.).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId = 'demo-user', grade, theme, currentStreak, longestStreak, lastPracticedDate, totalTrainings } = body

    // Ensure user exists
    let user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      user = await prisma.user.create({ data: { id: userId } })
    }

    // Build update data with only provided fields
    const updateData: Record<string, any> = {}
    if (grade != null) updateData.grade = grade
    if (theme != null) updateData.theme = theme
    if (currentStreak != null) updateData.currentStreak = currentStreak
    if (longestStreak != null) updateData.longestStreak = longestStreak
    if (lastPracticedDate != null) updateData.lastPracticedDate = lastPracticedDate
    if (totalTrainings != null) updateData.totalTrainings = totalTrainings

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    return NextResponse.json({
      userId: updated.id,
      grade: updated.grade,
      theme: updated.theme,
      currentStreak: updated.currentStreak,
      longestStreak: updated.longestStreak,
      lastPracticedDate: updated.lastPracticedDate,
      totalTrainings: updated.totalTrainings,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('User update error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
