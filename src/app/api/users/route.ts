import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/users
 * List all users.
 */
export async function GET() {
  try {
    // Ensure demo-user exists
    await prisma.user.upsert({
      where: { id: 'demo-user' },
      create: { id: 'demo-user', name: 'Demo Student', grade: '高一' },
      update: {},
    })

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        grade: true,
        chineseLevel: true,
        englishLevel: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(users)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Users list error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * POST /api/users
 * Create a new user. Body: { name: string, grade?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, grade = '高一' } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Use a cuid-like id: timestamp + random
    const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

    const user = await prisma.user.create({
      data: {
        id,
        name: name.trim(),
        grade,
      },
      select: {
        id: true,
        name: true,
        grade: true,
        chineseLevel: true,
        englishLevel: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('User create error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
