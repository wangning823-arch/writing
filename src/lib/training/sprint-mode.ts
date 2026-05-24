/**
 * Sprint Mode for 高三 (冲刺模式)
 *
 * Generates optimized training paths based on the student's ability profile,
 * exam date, and remaining days. Identifies weakest points and estimates
 * improvement potential to create a focused study plan.
 */

import type { AbilityProfile } from '@/types'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SprintPoint {
  abilityPoint: string
  currentScore: number
  targetScore: number
  estimatedImprovement: number
  trainingCount: number
  priority: 'high' | 'medium' | 'low'
}

export interface SprintPath {
  examDate: string
  daysUntilExam: number
  sprintPoints: SprintPoint[]
  totalEstimatedImprovement: number
  weeklyGoal: string
}

// ─── Core Functions ──────────────────────────────────────────────────────────

/**
 * Calculate the number of days between today and the exam date.
 * Returns 0 if the exam date is in the past.
 */
export function getDaysUntilExam(examDate: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const exam = new Date(examDate)
  exam.setHours(0, 0, 0, 0)
  const diffMs = exam.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

/**
 * Estimate the improvement potential for a single ability point.
 * More days = more room for improvement, but with diminishing returns.
 * A score below 60 has higher improvement potential than one above 80.
 *
 * @returns The estimated target score and the number of training sessions needed.
 */
export function estimatePointImprovement(
  currentScore: number,
  daysUntilExam: number,
): { targetScore: number; trainingNeeded: number } {
  if (currentScore >= 100) {
    return { targetScore: 100, trainingNeeded: 0 }
  }

  // Base improvement rate: ~0.3 points per training session
  const baseRate = 0.3

  // Dimin returns factor: lower scores improve faster
  const scoreFactor = currentScore < 50 ? 1.4 : currentScore < 70 ? 1.0 : currentScore < 85 ? 0.7 : 0.4

  // Time factor: more days = more sessions possible (assume ~1 training/session/day)
  const maxSessions = Math.min(daysUntilExam, 90) // cap at 90 days
  const practicalSessions = Math.floor(maxSessions * 0.6) // 60% of days are training days

  // Total potential improvement
  const rawImprovement = practicalSessions * baseRate * scoreFactor
  // Cap improvement to reasonable bounds
  const maxImprovement = Math.min(30, 100 - currentScore)
  const improvement = Math.min(rawImprovement, maxImprovement)

  const targetScore = Math.min(100, Math.round(currentScore + improvement))
  const trainingNeeded = Math.ceil(improvement / (baseRate * scoreFactor))

  return { targetScore, trainingNeeded }
}

/**
 * Determine priority for a sprint point based on score and days until exam.
 *
 * Priority rules:
 * - high: score < 60 and exam is >14 days away (can still improve significantly)
 * - high: score < 50 regardless (urgent need)
 * - medium: score 60-75 and exam is >7 days away
 * - medium: score < 60 and exam is <=14 days (limited time but still possible)
 * - low: score > 75 or exam is very close (<7 days)
 */
function getPriority(
  score: number,
  daysUntilExam: number,
): 'high' | 'medium' | 'low' {
  if (score < 50) return 'high'
  if (score < 60 && daysUntilExam > 14) return 'high'
  if (score < 60 && daysUntilExam <= 14) return 'medium'
  if (score >= 60 && score < 75 && daysUntilExam > 7) return 'medium'
  return 'low'
}

/**
 * Map dimension keys to Chinese display names.
 */
function dimensionDisplayName(dimension: string): string {
  const map: Record<string, string> = {
    content: '内容深度',
    structure: '结构逻辑',
    language: '语言表达',
    norms: '写作规范',
    '内容': '内容深度',
    '结构': '结构逻辑',
    '语言': '语言表达',
    '规范': '写作规范',
  }
  return map[dimension] || dimension
}

/**
 * Generate a weekly goal string based on top sprint points.
 */
function generateWeeklyGoal(points: SprintPoint[]): string {
  if (points.length === 0) {
    return '本周保持写作节奏，稳固现有水平'
  }

  const topPoints = points
    .sort((a, b) => a.currentScore - b.currentScore)
    .slice(0, 2)

  const names = topPoints.map((p) => p.abilityPoint).join('和')
  const totalImprovement = topPoints.reduce(
    (sum, p) => sum + p.estimatedImprovement,
    0,
  )

  return `本周重点突破${names}，预计提分+${totalImprovement}-${Math.round(totalImprovement * 1.3)}分`
}

/**
 * Generate a complete sprint path based on the student's ability profile
 * and exam date. Identifies the 2-3 weakest points and builds a focused
 * training plan with priorities and improvement estimates.
 */
export function generateSprintPath(
  abilityProfile: AbilityProfile[] | any[],
  examDate: string,
): SprintPath {
  const daysUntilExam = getDaysUntilExam(examDate)

  // Sort by score ascending (weakest first)
  const sorted = [...abilityProfile].sort((a, b) => a.score - b.score)

  // Take the 2-3 weakest points
  const weakestPoints = sorted.slice(0, Math.min(3, sorted.length))

  const sprintPoints: SprintPoint[] = weakestPoints.map((point) => {
    const { targetScore, trainingNeeded } = estimatePointImprovement(
      point.score,
      daysUntilExam,
    )

    return {
      abilityPoint: dimensionDisplayName(point.dimension),
      currentScore: point.score,
      targetScore,
      estimatedImprovement: targetScore - point.score,
      trainingCount: trainingNeeded,
      priority: getPriority(point.score, daysUntilExam),
    }
  })

  const totalEstimatedImprovement = sprintPoints.reduce(
    (sum, p) => sum + p.estimatedImprovement,
    0,
  )

  return {
    examDate,
    daysUntilExam,
    sprintPoints,
    totalEstimatedImprovement,
    weeklyGoal: generateWeeklyGoal(sprintPoints),
  }
}
