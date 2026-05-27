import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const essays = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM SampleEssay WHERE topicId=? ORDER BY createdAt DESC`, params.id
    )
    return NextResponse.json({ essays })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { title, content, source, essayTypeId, year, region, author } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'title and content are required' }, { status: 400 })
    }

    const id = `cme${Date.now()}${Math.random().toString(36).slice(2, 8)}`
    await prisma.$executeRawUnsafe(
      `INSERT INTO SampleEssay (id, topicId, title, content, source, essayTypeId, year, region, author, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      id, params.id, title, content, source || 'admin', essayTypeId || null, year || null, region || null, author || null
    )

    const rows = await prisma.$queryRawUnsafe<any[]>(`SELECT * FROM SampleEssay WHERE id=?`, id)
    return NextResponse.json({ essay: rows[0] }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
