import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ todayChecked: false, todayWordCount: 0, streak: 0, longestStreak: 0, recentCheckins: [] })
    }

    const today = new Date().toISOString().split('T')[0]

    const user = await prisma.user.findUnique({ where: { id: userId } })

    const todayCheckin = await prisma.dailyCheckin.findUnique({
      where: { userId_date: { userId, date: today } },
    })

    const recentCheckins = await prisma.dailyCheckin.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 14,
    })

    return NextResponse.json({
      todayChecked: !!todayCheckin,
      todayWordCount: todayCheckin?.wordCount || 0,
      streak: user?.currentStreak || 0,
      longestStreak: user?.longestStreak || 0,
      recentCheckins: recentCheckins.map(c => ({
        date: c.date,
        wordCount: c.wordCount,
        goalTarget: c.goalTarget,
      })),
    })
  } catch (error) {
    console.error('Checkin GET error:', error)
    return NextResponse.json({ error: 'Failed to load checkin data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, wordCount, goalTarget, userId, subject } = body

    if (!content || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    const existing = await prisma.dailyCheckin.findUnique({
      where: { userId_date: { userId, date: today } },
    })

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already checked in today' })
    }

    await prisma.dailyCheckin.create({
      data: {
        userId,
        date: today,
        wordCount: wordCount || content.replace(/\s/g, '').length,
        goalTarget: goalTarget || 200,
        content,
      },
    })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      const yesterdayCheckin = await prisma.dailyCheckin.findUnique({
        where: { userId_date: { userId, date: yesterdayStr } },
      })

      const newStreak = yesterdayCheckin ? (user.currentStreak || 0) + 1 : 1
      const newLongest = Math.max(user.longestStreak || 0, newStreak)

      await prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastPracticedDate: today,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Checkin POST error:', error)
    return NextResponse.json({ error: 'Checkin failed' }, { status: 500 })
  }
}
