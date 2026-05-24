import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CHINESE_LEVELS, ENGLISH_LEVELS } from '@/lib/training/config'
import { computeStage } from '@/lib/stage'

function generateDailyRecommendations(
  chineseLevel: number,
  englishLevel: number,
  chineseProgress: Array<{ level: number; completed: boolean }>,
  englishProgress: Array<{ level: number; completed: boolean }>
) {
  const recommendations: Array<{
    subject: string
    level: number
    label: string
    estimatedMinutes: number
  }> = []

  // Chinese recommendations
  const chineseNext = chineseProgress.find(p => !p.completed && p.level === chineseLevel)
  if (chineseNext) {
    const levelConfig = CHINESE_LEVELS.find(l => l.level === chineseLevel)
    recommendations.push({
      subject: 'chinese',
      level: chineseLevel,
      label: levelConfig?.name || `L${chineseLevel}`,
      estimatedMinutes: 15,
    })
  } else if (chineseLevel < 7) {
    const levelConfig = CHINESE_LEVELS.find(l => l.level === chineseLevel + 1)
    recommendations.push({
      subject: 'chinese',
      level: chineseLevel + 1,
      label: levelConfig?.name || `L${chineseLevel + 1}`,
      estimatedMinutes: 15,
    })
  }

  // English recommendations
  const englishNext = englishProgress.find(p => !p.completed && p.level === englishLevel)
  if (englishNext) {
    const levelConfig = ENGLISH_LEVELS.find(l => l.level === englishLevel)
    recommendations.push({
      subject: 'english',
      level: englishLevel,
      label: levelConfig?.name || `L${englishLevel}`,
      estimatedMinutes: 10,
    })
  } else if (englishLevel < 6) {
    const levelConfig = ENGLISH_LEVELS.find(l => l.level === englishLevel + 1)
    recommendations.push({
      subject: 'english',
      level: englishLevel + 1,
      label: levelConfig?.name || `L${englishLevel + 1}`,
      estimatedMinutes: 10,
    })
  }

  return recommendations
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'demo-user'

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        trainingRecords: {
          orderBy: { createdAt: 'desc' },
        },
        abilityProfiles: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Build progress from training records
    const completedLevels = new Map<string, { score: number; count: number }>()
    const bestScores = new Map<string, number>()

    for (const record of user.trainingRecords) {
      if (record.score == null) continue
      const key = `${record.subject}-${record.level}`
      const existing = completedLevels.get(key)
      if (!existing || record.score > existing.score) {
        completedLevels.set(key, { score: record.score, count: (existing?.count || 0) + 1 })
        bestScores.set(key, record.score)
      }
    }

    // Determine pass threshold: score >= 60 is considered passing
    const PASS_THRESHOLD = 60

    // Build Chinese progress
    const chineseProgress = CHINESE_LEVELS.map((level) => {
      const key = `chinese-${level.level}`
      const bestScore = bestScores.get(key)
      const isCompleted = bestScore != null && bestScore >= PASS_THRESHOLD
      const isCurrent = !isCompleted && level.level === user.chineseLevel
      const isLocked = level.level > user.chineseLevel

      return {
        level: level.level,
        subject: 'chinese' as const,
        label: `L${level.level} ${level.name}`,
        completed: isCompleted,
        current: isCurrent,
        locked: isLocked,
        score: bestScore,
      }
    })

    // Build English progress
    const englishProgress = ENGLISH_LEVELS.map((level) => {
      const key = `english-${level.level}`
      const bestScore = bestScores.get(key)
      const isCompleted = bestScore != null && bestScore >= PASS_THRESHOLD
      const isCurrent = !isCompleted && level.level === user.englishLevel
      const isLocked = level.level > user.englishLevel

      return {
        level: level.level,
        subject: 'english' as const,
        label: `L${level.level} ${level.name}`,
        completed: isCompleted,
        current: isCurrent,
        locked: isLocked,
        score: bestScore,
      }
    })

    // Build ability profiles split by subject
    const dimensionNames = ['内容', '结构', '语言', '规范']
    const dimensionKeys = ['content', 'structure', 'language', 'norms']

    function buildProfile(filterSubject: string | null) {
      return dimensionNames.map((dim, i) => {
        // Get latest score for this dimension from AbilityProfile table
        const profiles = filterSubject
          ? user!.abilityProfiles.filter((p) => p.dimension === dim && p.subject === filterSubject)
          : user!.abilityProfiles.filter((p) => p.dimension === dim)
        const profile = profiles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
        if (profile) return { dimension: dim, score: profile.score }

        // Fallback: compute from training record dimension scores
        const scores: number[] = []
        for (const record of user!.trainingRecords) {
          if (!record.score) continue
          if (filterSubject && record.subject !== filterSubject) continue
          try {
            const ds = JSON.parse(record.dimensionScores || '{}')
            const val = ds[dimensionKeys[i]]
            if (typeof val === 'number') scores.push(val)
          } catch { /* ignore */ }
        }
        if (scores.length > 0) {
          const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          return { dimension: dim, score: avg }
        }

        // No data yet — default to 0
        return { dimension: dim, score: 0 }
      })
    }

    const abilityProfile = buildProfile(null)
    const chineseAbilityProfile = buildProfile('chinese')
    const englishAbilityProfile = buildProfile('english')

    // Compute per-subject stats from training records
    function computeSubjectStats(filterSubject: string) {
      const records = user!.trainingRecords.filter(r => r.subject === filterSubject)
      const totalCount = records.length

      // Monthly count (current month)
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthlyCount = records.filter(r => r.createdAt >= monthStart).length

      // Streak: count consecutive days backwards from today
      const trainingDays = new Set(
        records.map(r => r.createdAt.toISOString().split('T')[0])
      )
      let streak = 0
      const d = new Date()
      while (trainingDays.has(d.toISOString().split('T')[0])) {
        streak++
        d.setDate(d.getDate() - 1)
      }

      return { totalCount, monthlyCount, streak }
    }

    const chineseStats = computeSubjectStats('chinese')
    const englishStats = computeSubjectStats('english')

    // Per-subject achievements
    let achievements: { subject: string | null; name: string; icon: string }[] = []
    try {
      achievements = await prisma.achievement.findMany({
        where: { userId },
        orderBy: { unlockedAt: 'desc' },
        take: 10,
      })
    } catch { /* achievement table may not have subject column yet */ }
    const chineseAchievements = achievements
      .filter(a => a.subject === 'chinese')
      .map(a => ({ name: a.name, icon: a.icon }))
    const englishAchievements = achievements
      .filter(a => a.subject === 'english')
      .map(a => ({ name: a.name, icon: a.icon }))

    return NextResponse.json({
      userId: user.id,
      chineseStage: computeStage(user.chineseLevel),
      englishStage: computeStage(user.englishLevel),
      chineseLevel: user.chineseLevel,
      englishLevel: user.englishLevel,
      chineseProgress,
      englishProgress,
      abilityProfile,
      chineseAbilityProfile,
      englishAbilityProfile,
      chineseStats,
      englishStats,
      chineseAchievements,
      englishAchievements,
      totalRecords: user.trainingRecords.length,
      dailyRecommendations: generateDailyRecommendations(
        user.chineseLevel,
        user.englishLevel,
        chineseProgress,
        englishProgress
      ),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Progress fetch error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
