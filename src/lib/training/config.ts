/**
 * Training level configurations for Chinese and English writing training.
 *
 * Each level defines the task scope, time limits per stage (sprout/growing/thriving),
 * output format, and word targets. These configs drive the training UI, timer,
 * editor shape, and AI review prompt selection.
 */

import type { Stage, OutputType } from '@/types'

// ─── Shared Types ────────────────────────────────────────────────────────────

export interface TimeLimit {
  /** Minutes allowed. `null` means untimed (sprout stage only). */
  sprout: number | null
  growing: number
  thriving: number
}

export interface TrainingLevel {
  level: number
  name: string
  description: string
  timeLimit: TimeLimit
  outputType: OutputType
  outputDescription: string
  wordTarget?: string
}

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Given a `TrainingLevel` and a `Stage`, return the time limit in minutes.
 * Returns `null` if the stage is untimed.
 */
export function getTimeLimit(level: TrainingLevel, stage: Stage): number | null {
  return level.timeLimit[stage]
}

/**
 * Get all levels for a subject.
 */
export function getLevels(subject: 'chinese' | 'english'): TrainingLevel[] {
  return subject === 'chinese' ? CHINESE_LEVELS : ENGLISH_LEVELS
}

/**
 * Get a single level by subject and level number.
 * Returns `undefined` if the level doesn't exist.
 */
export function getLevel(
  subject: 'chinese' | 'english',
  level: number,
): TrainingLevel | undefined {
  return getLevels(subject).find((l) => l.level === level)
}

// ─── Chinese Training Levels (7 layers) ──────────────────────────────────────

export const CHINESE_LEVELS: TrainingLevel[] = [
  {
    level: 1,
    name: '审题立意',
    description: '关键词提取 + 一句话中心论点',
    timeLimit: { sprout: null, growing: 5, thriving: 3 },
    outputType: 'form',
    outputDescription: '提取关键词并写出一句话中心论点',
  },
  {
    level: 2,
    name: '段落功能卡',
    description: '5段式骨架（每段一句话功能说明）',
    timeLimit: { sprout: null, growing: 10, thriving: 5 },
    outputType: 'cards',
    outputDescription: '为5个段落各写一句话功能说明',
  },
  {
    level: 3,
    name: '开头段专项',
    description: '150字开头段',
    timeLimit: { sprout: null, growing: 15, thriving: 10 },
    outputType: 'paragraph',
    outputDescription: '写出引人入胜的开头段，点明论点',
    wordTarget: '150字左右',
  },
  {
    level: 4,
    name: '论证段专项',
    description: '200字完整论证段',
    timeLimit: { sprout: null, growing: 15, thriving: 10 },
    outputType: 'paragraph',
    outputDescription: '写出论点→论据→分析的完整论证段',
    wordTarget: '200字左右',
  },
  {
    level: 5,
    name: '过渡段专项',
    description: '一段过渡文字',
    timeLimit: { sprout: null, growing: 15, thriving: 10 },
    outputType: 'paragraph',
    outputDescription: '写出段间衔接自然的过渡段',
    wordTarget: '100字左右',
  },
  {
    level: 6,
    name: '结尾段专项',
    description: '升华结尾',
    timeLimit: { sprout: null, growing: 15, thriving: 10 },
    outputType: 'paragraph',
    outputDescription: '跳出个人，上升到群体/时代的升华结尾',
    wordTarget: '150字左右',
  },
  {
    level: 7,
    name: '全文整合',
    description: '800字完整作文',
    timeLimit: { sprout: 60, growing: 50, thriving: 45 },
    outputType: 'full-essay',
    outputDescription: '综合运用所有层级能力，限时完成完整作文',
    wordTarget: '不少于800字',
  },
]

// ─── English Training Levels (6 layers) ──────────────────────────────────────

export const ENGLISH_LEVELS: TrainingLevel[] = [
  {
    level: 1,
    name: '句式仿写',
    description: '掌握高级句式（倒装/强调/分词/虚拟）',
    timeLimit: { sprout: null, growing: 5, thriving: 3 },
    outputType: 'form',
    outputDescription: '仿写3个高级句式',
  },
  {
    level: 2,
    name: '段落骨架',
    description: '一段PEEL结构段落',
    timeLimit: { sprout: null, growing: 10, thriving: 8 },
    outputType: 'paragraph',
    outputDescription: '写出主题句+论据+解释+过渡的PEEL段落',
    wordTarget: '60-80词',
  },
  {
    level: 3,
    name: '应用文格式',
    description: '掌握书信/演讲/通知格式',
    timeLimit: { sprout: null, growing: 10, thriving: 8 },
    outputType: 'paragraph',
    outputDescription: '完成一封格式正确的应用文',
    wordTarget: '80-100词',
  },
  {
    level: 4,
    name: '读后续写开头',
    description: '衔接前文，保持风格一致',
    timeLimit: { sprout: null, growing: 10, thriving: 8 },
    outputType: 'paragraph',
    outputDescription: '写出衔接原文的续写首段',
    wordTarget: '50-70词',
  },
  {
    level: 5,
    name: '语法纠错',
    description: '识别常见语法陷阱',
    timeLimit: { sprout: null, growing: 5, thriving: 3 },
    outputType: 'form',
    outputDescription: '找出并改正3-5处语法错误',
  },
  {
    level: 6,
    name: '全文写作',
    description: '综合运用，限时成文',
    timeLimit: { sprout: 40, growing: 30, thriving: 25 },
    outputType: 'full-essay',
    outputDescription: '完成一篇完整的英语作文',
    wordTarget: '120-150词',
  },
]
