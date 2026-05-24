import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { computeStage } from '@/lib/stage'

/**
 * POST /api/assessment
 *
 * Save pre-assessment diagnostic results to DB.
 * Updates the relevant subject's level and writes AbilityProfile records.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      userId = 'demo-user',
      subject = 'chinese', // 'chinese' | 'english'
      stepScores,
      totalScore,
      stage,
      radarData,
    } = body

    if (!stepScores || !totalScore || !stage) {
      return NextResponse.json(
        { error: 'Missing required fields: stepScores, totalScore, stage' },
        { status: 400 },
      )
    }

    // Compute level for the diagnosed subject
    const diagnosedLevel = stage === 'sprout' ? 1 : stage === 'growing' ? (subject === 'chinese' ? 3 : 2) : (subject === 'chinese' ? 5 : 4)

    // Get current user to preserve the other subject's level
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Save assessment record
    const assessment = await prisma.assessment.create({
      data: {
        userId,
        directionScore: stepScores[0] || 0,
        structureScore: stepScores[1] || 0,
        vocabScore: stepScores[2] || 0,
        sentenceScore: stepScores[3] || 0,
        errorScore: stepScores[4] || 0,
        stage,
        chineseLevel: subject === 'chinese' ? diagnosedLevel : user.chineseLevel,
        englishLevel: subject === 'english' ? diagnosedLevel : user.englishLevel,
        answers: JSON.stringify(body.answers || []),
      },
    })

    // Update only the diagnosed subject's level
    const updateData = subject === 'chinese'
      ? { chineseLevel: diagnosedLevel }
      : { englishLevel: diagnosedLevel }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    // Save ability profiles (4 dimensions from radar data)
    if (radarData && Array.isArray(radarData)) {
      // Delete old assessment-based profiles for this subject
      await prisma.abilityProfile.deleteMany({
        where: { userId, source: 'assessment', subject },
      })

      // Create new ones
      for (const dim of radarData) {
        await prisma.abilityProfile.create({
          data: {
            userId,
            subject,
            dimension: dim.dimension,
            score: dim.score,
            source: 'assessment',
            recordId: assessment.id,
          },
        })
      }
    }

    return NextResponse.json({
      assessmentId: assessment.id,
      subject,
      chineseStage: computeStage(subject === 'chinese' ? diagnosedLevel : user.chineseLevel),
      englishStage: computeStage(subject === 'english' ? diagnosedLevel : user.englishLevel),
      message: '诊断结果已保存',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Assessment save error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
