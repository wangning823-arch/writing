import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const categories = await prisma.materialCategory.findMany({
      orderBy: [{ subject: 'asc' }, { sortOrder: 'asc' }],
    })
    return NextResponse.json({ categories })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, subject, sortOrder = 0 } = body

    if (!name || !subject) {
      return NextResponse.json({ error: 'name and subject are required' }, { status: 400 })
    }

    const category = await prisma.materialCategory.create({
      data: { name, subject, sortOrder },
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
