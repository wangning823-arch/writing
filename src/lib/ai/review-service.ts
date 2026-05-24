/**
 * Unified review service.
 *
 * Orchestrates all review operations: prompt selection, AI calling,
 * response parsing, record saving, and progress tracking.
 *
 * This is the main entry point for the training review system.
 */

import { complete } from '@/lib/ai/client'
import { getTrainingReviewPrompt } from '@/lib/ai/prompts/training-review'
import { calculateProgress, type ProgressResult } from '@/lib/ai/progress-scoring'
import type { SuggestionStatus } from '@/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReviewRequest {
  userId: string
  subject: 'chinese' | 'english'
  level: number
  topicId?: string
  topicTitle?: string
  topicDescription?: string
  content: string
  isRevision?: boolean
  originalRecordId?: string
  timeSpent?: number // seconds
}

export interface ReviewResponse {
  recordId: string
  score: number
  dimensionScores: {
    content: number
    structure: number
    language: number
    norms: number
  }
  feedback: string
  highlights: Array<{
    text: string
    comment: string
    type: 'praise' | 'improve'
  }>
  suggestions: SuggestionStatus[]
  isPass: boolean
  nextLevel: number
  encouragement: string
  timeSpent: number
  progress?: ProgressResult // Only present for revisions
}

export interface ReviewRecord {
  id: string
  userId: string
  subject: 'chinese' | 'english'
  level: number
  topicId?: string
  content: string
  score: number
  dimensionScores: ReviewResponse['dimensionScores']
  feedback: string
  suggestions: SuggestionStatus[]
  isPass: boolean
  timeSpent: number
  createdAt: Date
  isRevision: boolean
  originalRecordId?: string
  progress?: ProgressResult
}

// ---------------------------------------------------------------------------
// Prisma record store
// ---------------------------------------------------------------------------

import { prisma } from '@/lib/db'

const PASS_THRESHOLD = 60

async function saveRecord(
  record: ReviewRecord,
): Promise<string> {
  const created = await prisma.trainingRecord.create({
    data: {
      userId: record.userId,
      subject: record.subject,
      level: record.level,
      topicId: record.topicId || null,
      content: record.content,
      score: record.score,
      dimensionScores: JSON.stringify(record.dimensionScores),
      feedback: record.feedback,
      suggestions: JSON.stringify(record.suggestions),
      isRevision: record.isRevision,
      revisionOf: record.originalRecordId || null,
      timeSpent: record.timeSpent,
    },
  })
  return created.id
}

async function getRecordById(id: string): Promise<ReviewRecord | undefined> {
  const rec = await prisma.trainingRecord.findUnique({ where: { id } })
  if (!rec) return undefined
  return {
    id: rec.id,
    userId: rec.userId,
    subject: rec.subject as 'chinese' | 'english',
    level: rec.level,
    topicId: rec.topicId || undefined,
    content: rec.content,
    score: rec.score || 0,
    dimensionScores: JSON.parse(rec.dimensionScores || '{}'),
    feedback: rec.feedback,
    suggestions: JSON.parse(rec.suggestions || '[]'),
    isPass: (rec.score || 0) >= PASS_THRESHOLD,
    timeSpent: rec.timeSpent || 0,
    createdAt: rec.createdAt,
    isRevision: rec.isRevision,
    originalRecordId: rec.revisionOf || undefined,
    progress: undefined,
  }
}

/**
 * Get all records for a user (for history display).
 */
export async function getUserRecords(
  userId: string,
  subject?: 'chinese' | 'english',
): Promise<ReviewRecord[]> {
  const where: Record<string, unknown> = { userId }
  if (subject) where.subject = subject
  const records = await prisma.trainingRecord.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
  return records.map((rec) => ({
    id: rec.id,
    userId: rec.userId,
    subject: rec.subject as 'chinese' | 'english',
    level: rec.level,
    topicId: rec.topicId || undefined,
    content: rec.content,
    score: rec.score || 0,
    dimensionScores: JSON.parse(rec.dimensionScores || '{}'),
    feedback: rec.feedback,
    suggestions: JSON.parse(rec.suggestions || '[]'),
    isPass: (rec.score || 0) >= PASS_THRESHOLD,
    timeSpent: rec.timeSpent || 0,
    createdAt: rec.createdAt,
    isRevision: rec.isRevision,
    originalRecordId: rec.revisionOf || undefined,
    progress: undefined,
  }))
}

/**
 * Advance user level and stage after passing a level.
 */
export async function advanceUserLevel(
  userId: string,
  subject: 'chinese' | 'english',
  level: number,
): Promise<{ passed: boolean; newLevel: number; newStage: string }> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { passed: false, newLevel: level, newStage: 'sprout' }

  const maxLevel = subject === 'chinese' ? 7 : 6
  const currentLevel = subject === 'chinese' ? user.chineseLevel : user.englishLevel

  if (level < currentLevel || currentLevel >= maxLevel) {
    return { passed: false, newLevel: currentLevel, newStage: user.stage }
  }

  const newLevel = currentLevel + 1
  const updateData =
    subject === 'chinese'
      ? { chineseLevel: newLevel }
      : { englishLevel: newLevel }

  // Determine stage based on both subjects' levels
  const chineseLevel = subject === 'chinese' ? newLevel : user.chineseLevel
  const englishLevel = subject === 'english' ? newLevel : user.englishLevel

  let newStage = user.stage
  if (chineseLevel >= 5 && englishLevel >= 4) {
    newStage = 'thriving'
  } else if (chineseLevel >= 3 || englishLevel >= 3) {
    newStage = 'growing'
  }

  await prisma.user.update({
    where: { id: userId },
    data: { ...updateData, stage: newStage },
  })

  return { passed: true, newLevel, newStage }
}

// ---------------------------------------------------------------------------
// Core review logic
// ---------------------------------------------------------------------------

function generateSuggestionsWithIds(
  rawSuggestions: Array<{
    type: string
    location: string
    issue: string
    fix: string
  }>,
): SuggestionStatus[] {
  return rawSuggestions.map((s, i) => ({
    id: `sug-${Date.now()}-${i}`,
    type: (['content', 'structure', 'language', 'norm'].includes(s.type)
      ? s.type
      : 'content') as SuggestionStatus['type'],
    location: s.location,
    issue: s.issue,
    fix: s.fix,
    status: 'unresolved' as const,
  }))
}

/**
 * Main entry point: review a training submission.
 *
 * Flow:
 * 1. Look up the topic (or use provided topic info)
 * 2. Get the appropriate prompt for the level
 * 3. Call the AI provider
 * 4. Parse the response
 * 5. If this is a revision, calculate progress
 * 6. Save the record
 * 7. Return structured results
 */
export async function reviewTraining(
  request: ReviewRequest,
): Promise<ReviewResponse> {
  const {
    userId,
    subject,
    level,
    topicTitle = '自由写作',
    topicDescription = '',
    content,
    isRevision = false,
    originalRecordId,
    timeSpent = 0,
  } = request

  // 1. Get the appropriate prompt for this level
  let previousFeedback: string | undefined
  if (isRevision && originalRecordId) {
    const originalRecord = await getRecordById(originalRecordId)
    if (originalRecord) {
      previousFeedback = originalRecord.feedback
    }
  }

  const { system, user } = getTrainingReviewPrompt(
    subject,
    level,
    topicTitle,
    topicDescription,
    content,
    isRevision,
    previousFeedback,
  )

  // 2. Call the AI
  const { text } = await complete(user, { system, maxTokens: 4096 })

  // 3. Parse the response
  let jsonStr = text.trim()
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  }

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(jsonStr)
  } catch {
    throw new Error('AI返回内容解析失败: ' + text.substring(0, 200))
  }

  const score = Number(parsed.score) || 0
  const ds = (parsed.dimensionScores || {}) as Record<string, number>
  const dimensionScores = {
    content: Number(ds.content) || 0,
    structure: Number(ds.structure) || 0,
    language: Number(ds.language) || 0,
    norms: Number(ds.norms) || 0,
  }
  const feedback = String(parsed.feedback) || ''
  const highlights = Array.isArray(parsed.highlights) ? parsed.highlights : []
  const rawSuggestions = Array.isArray(parsed.suggestions)
    ? parsed.suggestions
    : []
  const isPass = Boolean(parsed.pass)
  const nextLevel = Number(parsed.nextLevel) || level
  const encouragement = String(parsed.encouragement) || ''

  // 4. Process suggestions with IDs
  const suggestions = generateSuggestionsWithIds(rawSuggestions)

  // 5. If this is a revision, calculate progress
  let progress: ProgressResult | undefined
  if (isRevision && originalRecordId) {
    const originalRecord = await getRecordById(originalRecordId)
    if (originalRecord && previousFeedback) {
      try {
        progress = await calculateProgress(
          subject,
          level,
          originalRecord.content,
          content,
          previousFeedback,
        )
      } catch (err) {
        console.error('Progress calculation failed:', err)
        // Don't fail the whole review if progress calc fails
      }
    }
  }

  // 6. Save the record to DB
  const recordId = await saveRecord({
    id: 'temp',
    userId,
    subject,
    level,
    topicId: request.topicId,
    content,
    score,
    dimensionScores,
    feedback,
    suggestions,
    isPass,
    timeSpent,
    createdAt: new Date(),
    isRevision,
    originalRecordId,
    progress,
  })

  // 7. Return structured results
  return {
    recordId,
    score,
    dimensionScores,
    feedback,
    highlights,
    suggestions,
    isPass,
    nextLevel,
    encouragement,
    timeSpent,
    progress,
  }
}
