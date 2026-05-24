import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateSprintPath } from '@/lib/training/sprint-mode'

/**
 * GET /api/training/sprint
 *
 * Returns the sprint path for a user based on their ability profile and exam date.
 * If no exam date is stored, returns 404 with a flag so the client can prompt for it.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'demo-user'

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        abilityProfiles: true,
        weakPoints: true,
        trainingRecords: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check for stored exam date in the user's name field is not ideal.
    // We'll store examDate in a JSON metadata approach, or use the most recent
    // training record's date + a default offset for demo purposes.
    // For now, check if there's an "examDate" key in weak points or use metadata.

    // Try to get exam date from a dedicated field or metadata.
    // Since User model doesn't have examDate, we check if any weakPoint
    // has a description containing "examDate:" as a workaround, or
    // we compute a default: June 7 of current year (or next year).
    let examDate: string | null = null

    // Check if there's metadata stored in the user record via a special weak point
    const metaWeakPoint = user.weakPoints?.find(
      (wp) => wp.dimension === '_meta' && wp.description.startsWith('examDate:'),
    )
    if (metaWeakPoint) {
      examDate = metaWeakPoint.description.replace('examDate:', '')
    }

    if (!examDate) {
      return NextResponse.json(
        { error: 'No exam date set', examDate: null },
        { status: 404 },
      )
    }

    // Build ability profile from the AbilityProfile table
    const dimensionNames = ['内容', '结构', '语言', '规范']
    const dimensionKeys = ['content', 'structure', 'language', 'norms']

    const abilityProfile = dimensionNames.map((dim, i) => {
      const profiles = user.abilityProfiles.filter((p) => p.dimension === dim)
      const profile = profiles.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )[0]
      if (profile) return { dimension: dimensionKeys[i], score: profile.score }

      // Fallback: compute from training records
      const scores: number[] = []
      for (const record of user.trainingRecords) {
        if (!record.score) continue
        try {
          const ds = JSON.parse(record.dimensionScores || '{}')
          const val = ds[dimensionKeys[i]]
          if (typeof val === 'number') scores.push(val)
        } catch {
          /* ignore */
        }
      }
      if (scores.length > 0) {
        const avg = Math.round(
          scores.reduce((a, b) => a + b, 0) / scores.length,
        )
        return { dimension: dimensionKeys[i], score: avg }
      }
      return { dimension: dimensionKeys[i], score: 50 } // default midpoint
    })

    const sprintPath = generateSprintPath(abilityProfile, examDate)

    return NextResponse.json(sprintPath)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Sprint path error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * POST /api/training/sprint
 *
 * Update the exam date for a user. Stores it as a special WeakPoint
 * with dimension "_meta" and description "examDate:YYYY-MM-DD".
 * Also regenerates and returns the sprint path.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId = 'demo-user', examDate } = body

    if (!examDate) {
      return NextResponse.json(
        { error: 'Missing examDate field' },
        { status: 400 },
      )
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(examDate)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 },
      )
    }

    // Ensure user exists
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Upsert the exam date metadata as a special WeakPoint
    const existingMeta = await prisma.weakPoint.findFirst({
      where: {
        userId,
        dimension: '_meta',
        description: { startsWith: 'examDate:' },
      },
    })

    if (existingMeta) {
      await prisma.weakPoint.update({
        where: { id: existingMeta.id },
        data: { description: `examDate:${examDate}` },
      })
    } else {
      await prisma.weakPoint.create({
        data: {
          userId,
          dimension: '_meta',
          description: `examDate:${examDate}`,
          frequency: 0,
          lastOccurrence: new Date(),
        },
      })
    }

    // Now regenerate and return the sprint path
    const fullUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        abilityProfiles: true,
        trainingRecords: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    const dimensionNames = ['内容', '结构', '语言', '规范']
    const dimensionKeys = ['content', 'structure', 'language', 'norms']

    const abilityProfile = dimensionNames.map((dim, i) => {
      const profiles = fullUser!.abilityProfiles.filter(
        (p) => p.dimension === dim,
      )
      const profile = profiles.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )[0]
      if (profile) return { dimension: dimensionKeys[i], score: profile.score }

      const scores: number[] = []
      for (const record of fullUser!.trainingRecords) {
        if (!record.score) continue
        try {
          const ds = JSON.parse(record.dimensionScores || '{}')
          const val = ds[dimensionKeys[i]]
          if (typeof val === 'number') scores.push(val)
        } catch {
          /* ignore */
        }
      }
      if (scores.length > 0) {
        const avg = Math.round(
          scores.reduce((a, b) => a + b, 0) / scores.length,
        )
        return { dimension: dimensionKeys[i], score: avg }
      }
      return { dimension: dimensionKeys[i], score: 50 }
    })

    const sprintPath = generateSprintPath(abilityProfile, examDate)

    return NextResponse.json(sprintPath)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Sprint update error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
