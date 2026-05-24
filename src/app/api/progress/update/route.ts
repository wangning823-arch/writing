import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { computeStage } from '@/lib/stage'

const PASS_THRESHOLD = 60

/**
 * POST /api/progress/update
 *
 * Saves a training record to DB and advances the user's level if they passed.
 * Called after AI review returns results.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      userId = 'demo-user',
      subject,
      level,
      content,
      score,
      dimensionScores,
      feedback,
      suggestions,
      isRevision,
      originalRecordId,
      timeSpent,
    } = body

    if (!subject || level == null || content == null) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, level, content' },
        { status: 400 },
      )
    }

    // Save training record
    const record = await prisma.trainingRecord.create({
      data: {
        userId,
        subject,
        level: Number(level),
        content,
        score: score != null ? Number(score) : null,
        dimensionScores: JSON.stringify(dimensionScores || {}),
        feedback: JSON.stringify(feedback || {}),
        suggestions: JSON.stringify(suggestions || []),
        isRevision: Boolean(isRevision),
        revisionOf: originalRecordId || null,
        timeSpent: timeSpent != null ? Number(timeSpent) : null,
      },
    })

    // If passed, advance user level
    const passed = score != null && Number(score) >= PASS_THRESHOLD
    if (passed) {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (user) {
        const maxLevel = subject === 'chinese' ? 7 : 6
        const currentLevel = subject === 'chinese' ? user.chineseLevel : user.englishLevel

        if (Number(level) >= currentLevel && currentLevel < maxLevel) {
          const newLevel = currentLevel + 1
          const updateData =
            subject === 'chinese'
              ? { chineseLevel: newLevel }
              : { englishLevel: newLevel }

          await prisma.user.update({
            where: { id: userId },
            data: updateData,
          })
        }
      }
    }

    return NextResponse.json({
      recordId: record.id,
      passed,
      message: passed ? '通过！已解锁下一关' : '继续加油！',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Progress update error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
