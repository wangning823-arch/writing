import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ entries: [] })
    }

    const entries = await prisma.journal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      entries: entries.map(e => ({
        ...e,
        tags: JSON.parse(e.tags || '[]'),
      })),
    })
  } catch (error) {
    console.error('Journal GET error:', error)
    return NextResponse.json({ error: 'Failed to load journals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, content, tags, userId, subject } = body

    if (!content || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const wordCount = content.replace(/\s/g, '').length

    await prisma.journal.create({
      data: {
        userId,
        type: type || '随笔',
        title: title || undefined,
        content,
        wordCount,
        tags: JSON.stringify(tags || []),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Journal POST error:', error)
    return NextResponse.json({ error: 'Failed to save journal' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    await prisma.journal.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Journal DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete journal' }, { status: 500 })
  }
}
