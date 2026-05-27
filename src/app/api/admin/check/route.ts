import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ isAdmin: false })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    return NextResponse.json({ isAdmin: user?.role === 'admin' })
  } catch {
    return NextResponse.json({ isAdmin: false })
  }
}
