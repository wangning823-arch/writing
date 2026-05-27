import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const [totalUsers, totalTopics, totalMaterials, totalTrainingRecords] = await Promise.all([
      prisma.user.count(),
      prisma.topic.count({ where: { id: { not: 'diagnostic-questions' } } }),
      prisma.material.count(),
      prisma.trainingRecord.count(),
    ])

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, grade: true, createdAt: true },
    })

    const recentTrainings = await prisma.trainingRecord.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        subject: true,
        score: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    })

    return NextResponse.json({
      totalUsers,
      totalTopics,
      totalMaterials,
      totalTrainingRecords,
      recentUsers,
      recentTrainings,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
