import { prisma } from '@/lib/db'
import { complete } from './client'
import { getEssayAnalysisPrompt } from './prompts/essay-analysis'

export interface EssayAnalysisRequest {
  essaySource: 'model' | 'topic' | 'english-json'
  essayId: string
  essayTitle: string
  essayContent: string
  subject: 'chinese' | 'english'
  techniques?: string[]
  userId?: string
}

export interface ContentAnalysis {
  theme: string
  depth: string
  relevance: string
  examples: string[]
}

export interface StructureAnalysis {
  overview: string
  strengths: string[]
  flow: string
}

export interface LanguageAnalysis {
  style: string
  highlights: string[]
  techniques: string[]
}

export interface TechniqueItem {
  name: string
  explanation: string
  example: string
}

export interface Takeaway {
  category: string
  point: string
  howToApply: string
}

export interface EssayAnalysisResult {
  contentAnalysis: ContentAnalysis
  structureAnalysis: StructureAnalysis
  languageAnalysis: LanguageAnalysis
  techniqueAnalysis: { techniques: TechniqueItem[] }
  takeaways: Takeaway[]
  summary: string
}

export interface EssayAnalysisSummary {
  id: string
  essaySource: string
  essayId: string
  essayTitle: string
  subject: string
  summary: string
  createdAt: Date
}

export async function getSavedAnalysis(
  userId: string,
  essaySource: string,
  essayId: string,
): Promise<EssayAnalysisResult | null> {
  const record = await prisma.essayAnalysis.findUnique({
    where: {
      userId_essaySource_essayId: { userId, essaySource, essayId },
    },
  })

  if (!record) return null

  return {
    contentAnalysis: JSON.parse(record.contentAnalysis),
    structureAnalysis: JSON.parse(record.structureAnalysis),
    languageAnalysis: JSON.parse(record.languageAnalysis),
    techniqueAnalysis: JSON.parse(record.techniqueAnalysis),
    takeaways: JSON.parse(record.takeaways),
    summary: record.summary,
  }
}

async function saveAnalysis(
  userId: string,
  request: EssayAnalysisRequest,
  result: EssayAnalysisResult,
): Promise<string> {
  const record = await prisma.essayAnalysis.upsert({
    where: {
      userId_essaySource_essayId: {
        userId,
        essaySource: request.essaySource,
        essayId: request.essayId,
      },
    },
    create: {
      userId,
      essaySource: request.essaySource,
      essayId: request.essayId,
      essayTitle: request.essayTitle,
      essayContent: request.essayContent,
      subject: request.subject,
      contentAnalysis: JSON.stringify(result.contentAnalysis),
      structureAnalysis: JSON.stringify(result.structureAnalysis),
      languageAnalysis: JSON.stringify(result.languageAnalysis),
      techniqueAnalysis: JSON.stringify(result.techniqueAnalysis),
      takeaways: JSON.stringify(result.takeaways),
      summary: result.summary,
    },
    update: {
      contentAnalysis: JSON.stringify(result.contentAnalysis),
      structureAnalysis: JSON.stringify(result.structureAnalysis),
      languageAnalysis: JSON.stringify(result.languageAnalysis),
      techniqueAnalysis: JSON.stringify(result.techniqueAnalysis),
      takeaways: JSON.stringify(result.takeaways),
      summary: result.summary,
    },
  })

  return record.id
}

export async function analyzeEssay(
  request: EssayAnalysisRequest,
): Promise<{ analysis: EssayAnalysisResult; recordId: string }> {
  const userId = request.userId || 'anonymous'

  // Check for existing analysis
  const existing = await getSavedAnalysis(userId, request.essaySource, request.essayId)
  if (existing) {
    const record = await prisma.essayAnalysis.findUnique({
      where: {
        userId_essaySource_essayId: { userId, essaySource: request.essaySource, essayId: request.essayId },
      },
    })
    return { analysis: existing, recordId: record!.id }
  }

  // Build prompt and call AI
  const { system, user } = getEssayAnalysisPrompt(
    request.subject,
    request.essayTitle,
    request.essayContent,
    request.techniques,
  )

  const { text } = await complete(user, { system, maxTokens: 4096 })

  // Parse JSON response
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

  const ca = parsed.contentAnalysis as Record<string, unknown> || {}
  const sa = parsed.structureAnalysis as Record<string, unknown> || {}
  const la = parsed.languageAnalysis as Record<string, unknown> || {}
  const ta = parsed.techniqueAnalysis as Record<string, unknown> || {}

  const result: EssayAnalysisResult = {
    contentAnalysis: {
      theme: String(ca.theme || ''),
      depth: String(ca.depth || ''),
      relevance: String(ca.relevance || ''),
      examples: Array.isArray(ca.examples) ? ca.examples.map(String) : [],
    },
    structureAnalysis: {
      overview: String(sa.overview || ''),
      strengths: Array.isArray(sa.strengths) ? sa.strengths.map(String) : [],
      flow: String(sa.flow || ''),
    },
    languageAnalysis: {
      style: String(la.style || ''),
      highlights: Array.isArray(la.highlights) ? la.highlights.map(String) : [],
      techniques: Array.isArray(la.techniques) ? la.techniques.map(String) : [],
    },
    techniqueAnalysis: {
      techniques: Array.isArray(ta.techniques)
        ? (ta.techniques as Record<string, string>[]).map((t) => ({
            name: String(t.name || ''),
            explanation: String(t.explanation || ''),
            example: String(t.example || ''),
          }))
        : [],
    },
    takeaways: Array.isArray(parsed.takeaways)
      ? (parsed.takeaways as Record<string, string>[]).map((t) => ({
          category: String(t.category || ''),
          point: String(t.point || ''),
          howToApply: String(t.howToApply || ''),
        }))
      : [],
    summary: String(parsed.summary || ''),
  }

  // Save to database
  const recordId = await saveAnalysis(userId, request, result)

  return { analysis: result, recordId }
}

export async function getUserAnalyses(
  userId: string,
): Promise<EssayAnalysisSummary[]> {
  const records = await prisma.essayAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return records.map((r) => ({
    id: r.id,
    essaySource: r.essaySource,
    essayId: r.essayId,
    essayTitle: r.essayTitle,
    subject: r.subject,
    summary: r.summary,
    createdAt: r.createdAt,
  }))
}
