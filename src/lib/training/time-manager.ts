/**
 * Time management system for the training levels.
 *
 * Each level has different time limits depending on the student's
 * current stage (sprout / growing / thriving). Sprout stage is
 * generally untimed to reduce pressure; thriving stage is the most
 * time-constrained to simulate exam conditions.
 *
 * Time limits are in minutes. `null` means untimed.
 */

import type { Stage } from '@/types'

interface TimeConfig {
  sprout: number | null // minutes, null = untimed
  growing: number
  thriving: number
}

/**
 * Chinese training time limits by level and stage.
 *
 * Levels L1-L6 are fragment training (shorter tasks).
 * L7 is full-essay writing (longer tasks).
 *
 * Source: CORE_PLAN.md section 5.1
 */
const CHINESE_TIMES: Record<number, TimeConfig> = {
  // L1 审题立意: quick thinking exercise
  1: { sprout: null, growing: 5, thriving: 3 },
  // L2 段落功能卡: structural planning
  2: { sprout: null, growing: 10, thriving: 5 },
  // L3 开头段: paragraph writing
  3: { sprout: null, growing: 15, thriving: 10 },
  // L4 论证段: paragraph writing
  4: { sprout: null, growing: 15, thriving: 10 },
  // L5 过渡段: paragraph writing
  5: { sprout: null, growing: 15, thriving: 10 },
  // L6 结尾段: paragraph writing
  6: { sprout: null, growing: 15, thriving: 10 },
  // L7 全文: full essay
  7: { sprout: 60, growing: 50, thriving: 45 },
}

/**
 * English training time limits by level and stage.
 *
 * Levels L1-L5 are fragment training.
 * L6 is full-essay writing.
 *
 * Source: CORE_PLAN.md section 5.2
 */
const ENGLISH_TIMES: Record<number, TimeConfig> = {
  // L1 句式仿写: quick sentence exercise
  1: { sprout: null, growing: 5, thriving: 3 },
  // L2 段落骨架: paragraph writing
  2: { sprout: null, growing: 10, thriving: 8 },
  // L3 应用文格式: practical writing
  3: { sprout: null, growing: 10, thriving: 8 },
  // L4 读后续写开头: continuation opening
  4: { sprout: null, growing: 10, thriving: 8 },
  // L5 语法纠错: quick exercise
  5: { sprout: null, growing: 5, thriving: 3 },
  // L6 全文写作: full essay
  6: { sprout: 40, growing: 30, thriving: 25 },
}

/**
 * Get the time limit in minutes for a given subject, level, and stage.
 *
 * @returns Time limit in minutes, or null if untimed.
 */
export function getTimeLimit(
  subject: 'chinese' | 'english',
  level: number,
  stage: Stage,
): number | null {
  const config =
    subject === 'chinese' ? CHINESE_TIMES[level] : ENGLISH_TIMES[level]
  if (!config) return null
  return config[stage]
}

/**
 * Get the time limit in seconds for a given subject, level, and stage.
 * Useful for countdown timers in the UI.
 *
 * @returns Time limit in seconds, or null if untimed.
 */
export function getTimeLimitSeconds(
  subject: 'chinese' | 'english',
  level: number,
  stage: Stage,
): number | null {
  const minutes = getTimeLimit(subject, level, stage)
  if (minutes === null) return null
  return minutes * 60
}

/**
 * Format seconds into MM:SS display string.
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(Math.abs(seconds) / 60)
  const secs = Math.abs(seconds) % 60
  const sign = seconds < 0 ? '-' : ''
  return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Check if the student has exceeded the time limit.
 *
 * @returns Object with overtime status and how many seconds over.
 */
export function checkTimeStatus(
  elapsedSeconds: number,
  timeLimitMinutes: number | null,
): { isOvertime: boolean; overtimeSeconds: number; percentUsed: number } {
  if (timeLimitMinutes === null) {
    return { isOvertime: false, overtimeSeconds: 0, percentUsed: 0 }
  }

  const limitSeconds = timeLimitMinutes * 60
  const isOvertime = elapsedSeconds > limitSeconds
  const overtimeSeconds = isOvertime ? elapsedSeconds - limitSeconds : 0
  const percentUsed = Math.min(
    100,
    Math.round((elapsedSeconds / limitSeconds) * 100),
  )

  return { isOvertime, overtimeSeconds, percentUsed }
}
