import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; essayId: string } }
) {
  try {
    const body = await req.json()
    const essay = await prisma.sampleEssay.update({
      where: { id: params.essayId },
      data: body,
    })
    return NextResponse.json({ essay })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; essayId: string } }
) {
  try {
    await prisma.sampleEssay.delete({ where: { id: params.essayId } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
