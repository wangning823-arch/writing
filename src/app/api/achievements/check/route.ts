import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const ACHIEVEMENTS = [
  {
    type: 'first_chinese_training',
    name: '语文初试',
    description: '完成第一次语文训练',
    icon: '🌟',
    subject: 'chinese' as const,
    check: (context: { chineseTrainings: number }) => context.chineseTrainings >= 1,
  },
  {
    type: 'first_english_training',
    name: '英语初试',
    description: '完成第一次英语训练',
    icon: '🌟',
    subject: 'english' as const,
    check: (context: { englishTrainings: number }) => context.englishTrainings >= 1,
  },
  {
    type: 'streak_7',
    name: '坚持不懈',
    description: '连续训练7天',
    icon: '🔥',
    subject: null,
    check: (context: { currentStreak: number }) => context.currentStreak >= 7,
  },
  {
    type: 'monthly_star',
    name: '月度之星',
    description: '累计训练20次',
    icon: '⭐',
    subject: null,
    check: (context: { totalTrainings: number }) => context.totalTrainings >= 20,
  },
  {
    type: 'first_chinese_mastery',
    name: '语文达标',
    description: '语文训练分数达到80分',
    icon: '🎯',
    subject: 'chinese' as const,
    check: (context: { hasChineseScoreAbove80: boolean }) => context.hasChineseScoreAbove80,
  },
  {
    type: 'first_english_mastery',
    name: '英语达标',
    description: '英语训练分数达到80分',
    icon: '🎯',
    subject: 'english' as const,
    check: (context: { hasEnglishScoreAbove80: boolean }) => context.hasEnglishScoreAbove80,
  },
  {
    type: 'comprehensive',
    name: '全面发展',
    description: '中文和英文各完成3个以上等级',
    icon: '🌈',
    subject: null,
    check: (context: { chineseCompleted: number; englishCompleted: number }) =>
      context.chineseCompleted >= 3 && context.englishCompleted >= 3,
  },
  {
    type: 'overcome_weakness',
    name: '攻克难关',
    description: '某个弱点从60分以下提升到75分以上',
    icon: '💪',
    subject: null,
    check: (context: { hasWeakPointImproved: boolean }) => context.hasWeakPointImproved,
  },
]

/**
 * POST /api/achievements/check
 * Check and unlock achievements for a user.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId = 'demo-user' } = body

    // Ensure user exists
    let user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      user = await prisma.user.create({ data: { id: userId } })
    }

    // Get existing achievements
    const existingAchievements = await prisma.achievement.findMany({
      where: { userId },
    })
    const unlockedTypes = new Set(existingAchievements.map((a) => a.type))

    // Gather context data
    const trainingRecords = await prisma.trainingRecord.findMany({
      where: { userId },
    })

    const chineseTrainings = trainingRecords.filter(r => r.subject === 'chinese').length
    const englishTrainings = trainingRecords.filter(r => r.subject === 'english').length
    const hasChineseScoreAbove80 = trainingRecords.some(r => r.subject === 'chinese' && r.score != null && r.score >= 80)
    const hasEnglishScoreAbove80 = trainingRecords.some(r => r.subject === 'english' && r.score != null && r.score >= 80)

    // Count completed levels (score >= 60)
    const PASS_THRESHOLD = 60
    const completedChinese = new Set<number>()
    const completedEnglish = new Set<number>()
    for (const record of trainingRecords) {
      if (record.score == null || record.score < PASS_THRESHOLD) continue
      if (record.subject === 'chinese') completedChinese.add(record.level)
      if (record.subject === 'english') completedEnglish.add(record.level)
    }

    // Check weak point improvement
    const weakPoints = await prisma.weakPoint.findMany({ where: { userId } })
    const hasWeakPointImproved = weakPoints.some(
      (wp) => wp.improvement != null && wp.improvement.length > 0
    )

    const context = {
      chineseTrainings,
      englishTrainings,
      currentStreak: user.currentStreak,
      totalTrainings: user.totalTrainings,
      hasChineseScoreAbove80,
      hasEnglishScoreAbove80,
      chineseCompleted: completedChinese.size,
      englishCompleted: completedEnglish.size,
      hasWeakPointImproved,
    }

    // Check each achievement
    const newlyUnlocked: Array<{
      type: string
      name: string
      description: string
      icon: string
      subject?: string | null
    }> = []

    for (const achievement of ACHIEVEMENTS) {
      // For per-subject achievements, check with subject suffix
      const checkType = achievement.subject
        ? `${achievement.type}`
        : achievement.type
      if (unlockedTypes.has(checkType)) continue

      if (achievement.check(context)) {
        const record = await prisma.achievement.create({
          data: {
            userId,
            type: checkType,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            subject: achievement.subject,
          },
        })
        newlyUnlocked.push({
          type: record.type,
          name: record.name,
          description: record.description,
          icon: record.icon,
          subject: record.subject,
        })
      }
    }

    return NextResponse.json({
      newlyUnlocked,
      totalUnlocked: unlockedTypes.size + newlyUnlocked.length,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Achievement check error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
