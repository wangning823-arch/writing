import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const topic = await prisma.topic.findUnique({
      where: { id },
      include: { _count: { select: { trainingRecords: true } } },
    })

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }

    return NextResponse.json({ topic })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { source, year, region, subject, type, title, description, requirements, tags } = body

    const topic = await prisma.topic.update({
      where: { id },
      data: {
        ...(source !== undefined && { source }),
        ...(year !== undefined && { year }),
        ...(region !== undefined && { region }),
        ...(subject !== undefined && { subject }),
        ...(type !== undefined && { type }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(requirements !== undefined && { requirements }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
      },
    })

    return NextResponse.json({ topic })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.sampleEssay.deleteMany({ where: { topicId: id } })
    await prisma.topic.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
