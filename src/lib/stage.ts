import { Stage } from '@/types'

export function computeStage(level: number): Stage {
  if (level >= 5) return 'thriving'
  if (level >= 3) return 'growing'
  return 'sprout'
}
