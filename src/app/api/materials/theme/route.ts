import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { THEME_MATERIALS } from '@/lib/training/theme-materials'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const theme = searchParams.get('theme')
    const userId = searchParams.get('userId') || 'demo-user'

    if (theme && THEME_MATERIALS[theme]) {
      const pack = THEME_MATERIALS[theme]
      const userMaterials = await prisma.material.findMany({
        where: { userId, tags: { contains: theme } },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json({ themePack: pack, userMaterials })
    }

    const allThemes = Object.keys(THEME_MATERIALS).map((t) => ({
      name: t,
      quoteCount: THEME_MATERIALS[t].quotes.length,
      factCount: THEME_MATERIALS[t].facts.length,
    }))

    return NextResponse.json({ themes: allThemes })
  } catch (error) {
    console.error('Theme materials error:', error)
    return NextResponse.json({ error: 'Failed to fetch theme materials' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, source, category, subject, tags, userId = 'demo-user' } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    })

    const material = await prisma.material.create({
      data: {
        userId,
        content,
        source: source || '范文',
        category: category || '好词好句',
        subject: subject || 'chinese',
        tags: JSON.stringify(tags || []),
      },
    })

    return NextResponse.json(material)
  } catch (error) {
    console.error('Collect theme material error:', error)
    return NextResponse.json({ error: 'Failed to collect material' }, { status: 500 })
  }
}
