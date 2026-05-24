import { prisma } from '@/lib/db'

interface AchievementConfig {
  type: string
  name: string
  description: string
  icon: string
  check: (stats: UserStats) => boolean
}

interface UserStats {
  totalTrainings: number
  currentStreak: number
  hasScoreAbove80: boolean
  chineseCompletedCount: number
  englishCompletedCount: number
}

const ACHIEVEMENTS: AchievementConfig[] = [
  { type: 'first_training', name: '初试锋芒', description: '完成首次训练', icon: '🎯', check: s => s.totalTrainings >= 1 },
  { type: 'streak_7', name: '坚持不懈', description: '连续训练7天', icon: '🔥', check: s => s.currentStreak >= 7 },
  { type: 'monthly_star', name: '月度之星', description: '累计训练20次', icon: '⭐', check: s => s.totalTrainings >= 20 },
  { type: 'first_mastery', name: '首次达标', description: '某项训练达到80分', icon: '🏅', check: s => s.hasScoreAbove80 },
  { type: 'all_round', name: '全面发展', description: '语文英语各完成3个层级', icon: '🌈', check: s => s.chineseCompletedCount >= 3 && s.englishCompletedCount >= 3 },
]

export async function checkAndUnlockAchievements(userId: string): Promise<{ name: string; icon: string } | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return null

  const records = await prisma.trainingRecord.findMany({ where: { userId } })

  const stats: UserStats = {
    totalTrainings: user.totalTrainings,
    currentStreak: user.currentStreak,
    hasScoreAbove80: records.some(r => (r.score ?? 0) >= 80),
    chineseCompletedCount: new Set(records.filter(r => r.subject === 'chinese' && (r.score ?? 0) >= 60).map(r => r.level)).size,
    englishCompletedCount: new Set(records.filter(r => r.subject === 'english' && (r.score ?? 0) >= 60).map(r => r.level)).size,
  }

  const existing = await prisma.achievement.findMany({ where: { userId } })
  const existingTypes = new Set(existing.map(a => a.type))

  for (const ach of ACHIEVEMENTS) {
    if (!existingTypes.has(ach.type) && ach.check(stats)) {
      await prisma.achievement.create({
        data: { userId, type: ach.type, name: ach.name, description: ach.description, icon: ach.icon },
      })
      return { name: ach.name, icon: ach.icon }
    }
  }
  return null
}
