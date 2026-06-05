import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    await prisma.$executeRawUnsafe(
      `UPDATE SampleEssay SET title=?, content=?, source=?, essayTypeId=?, year=?, region=?, author=?, updatedAt=datetime('now') WHERE id=?`,
      body.title, body.content, body.source, body.essayTypeId || null, body.year || null, body.region || null, body.author || null, id
    )
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM SampleEssay WHERE id=?`, id
    )
    return NextResponse.json({ essay: rows[0] || null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.$executeRawUnsafe(`DELETE FROM SampleEssay WHERE id=?`, id)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
