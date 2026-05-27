import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        role: true,
        grade: true,
        stage: true,
        chineseLevel: true,
        englishLevel: true,
        totalTrainings: true,
        lastPracticedDate: true,
        createdAt: true,
        _count: { select: { trainingRecords: true, materials: true } },
      },
    })

    return NextResponse.json({ users })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, grade, role } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: '名称不能为空' }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        grade: grade || '高一',
        role: role || 'student',
      },
      select: {
        id: true,
        name: true,
        role: true,
        grade: true,
        stage: true,
        chineseLevel: true,
        englishLevel: true,
        totalTrainings: true,
        lastPracticedDate: true,
        createdAt: true,
        _count: { select: { trainingRecords: true, materials: true } },
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
