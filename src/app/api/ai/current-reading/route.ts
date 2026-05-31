import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { getCurrentReadingPrompt } from '@/lib/ai/prompts/current-reading'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject') || 'chinese'

    const today = new Date()
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))
    const weekStart = monday.toISOString().split('T')[0]

    const weeklyReading = await prisma.weeklyReading.findUnique({
      where: { weekStart_subject: { weekStart, subject } },
    })

    if (weeklyReading) {
      return NextResponse.json({
        weekStart: weeklyReading.weekStart,
        articles: JSON.parse(weeklyReading.articles || '[]'),
      })
    }

    return NextResponse.json({ weekStart, articles: [] })
  } catch (error) {
    console.error('Current reading GET error:', error)
    return NextResponse.json({ error: 'Failed to load reading data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject } = body

    const { system, user } = getCurrentReadingPrompt(subject || 'chinese')
    const res = await complete(user, { system, maxTokens: 2048 })

    let result: any
    try {
      const jsonMatch = res.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      result = JSON.parse(jsonMatch[0])
    } catch {
      result = {
        weekStart: new Date().toISOString().split('T')[0],
        articles: [],
      }
    }

    const today = new Date()
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))
    const weekStart = monday.toISOString().split('T')[0]

    await prisma.weeklyReading.upsert({
      where: { weekStart_subject: { weekStart, subject: subject || 'chinese' } },
      update: { articles: JSON.stringify(result.articles || []) },
      create: {
        weekStart,
        subject: subject || 'chinese',
        articles: JSON.stringify(result.articles || []),
      },
    })

    return NextResponse.json({ weekStart, articles: result.articles || [] })
  } catch (error) {
    console.error('Current reading POST error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { articleTitle, note, userId } = body

    if (!articleTitle || !note || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Current reading PUT error:', error)
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 })
  }
}
