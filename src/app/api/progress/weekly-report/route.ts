import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { complete } from '@/lib/ai/client'

/**
 * GET /api/progress/weekly-report
 *
 * Modes:
 * - mode=weekly (default): weekly training stats, per-dimension averages,
 *   highlights, improvement areas, and recommendations.
 * - mode=trend: weekly aggregated scores over time for trend charts.
 * - mode=monthly: month-over-month comparison data.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') || 'demo-user'
    const subject = searchParams.get('subject') || 'chinese'
    const mode = searchParams.get('mode') || 'weekly'

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch training records for the subject
    const records = await prisma.trainingRecord.findMany({
      where: { userId, subject },
      orderBy: { createdAt: 'desc' },
    })

    const now = new Date()

    if (mode === 'trend') {
      return handleTrendMode(records, subject)
    }

    if (mode === 'monthly') {
      return handleMonthlyMode(records)
    }

    // Default: weekly mode
    return handleWeeklyMode(records, subject)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Weekly report error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ─── Weekly Mode ─────────────────────────────────────────────────────────────

function handleWeeklyMode(records: any[], subject: string) {
  const now = new Date()
  const dayOfWeek = now.getDay() || 7 // Monday = 1

  // This week: Monday to Sunday
  const thisWeekStart = new Date(now)
  thisWeekStart.setDate(now.getDate() - dayOfWeek + 1)
  thisWeekStart.setHours(0, 0, 0, 0)

  const thisWeekEnd = new Date(thisWeekStart)
  thisWeekEnd.setDate(thisWeekStart.getDate() + 6)
  thisWeekEnd.setHours(23, 59, 59, 999)

  // Last week
  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(thisWeekStart.getDate() - 7)
  const lastWeekEnd = new Date(thisWeekStart)
  lastWeekEnd.setDate(thisWeekStart.getDate() - 1)
  lastWeekEnd.setHours(23, 59, 59, 999)

  const thisWeekRecords = records.filter(
    (r) => r.createdAt >= thisWeekStart && r.createdAt <= thisWeekEnd,
  )
  const lastWeekRecords = records.filter(
    (r) => r.createdAt >= lastWeekStart && r.createdAt <= lastWeekEnd,
  )

  // Compute per-dimension averages
  const dimensionKeys = ['content', 'structure', 'language', 'norms']

  function computeAvg(recordList: any[]) {
    const sums: Record<string, number> = {}
    const counts: Record<string, number> = {}

    for (const r of recordList) {
      if (!r.score) continue
      try {
        const ds = JSON.parse(r.dimensionScores || '{}')
        for (const key of dimensionKeys) {
          if (typeof ds[key] === 'number') {
            sums[key] = (sums[key] || 0) + ds[key]
            counts[key] = (counts[key] || 0) + 1
          }
        }
      } catch {
        /* ignore */
      }
    }

    const avg: Record<string, number> = {}
    for (const key of dimensionKeys) {
      avg[key] =
        counts[key] && counts[key] > 0
          ? Math.round(sums[key] / counts[key])
          : 50
    }
    return avg
  }

  const thisWeekAvg = computeAvg(thisWeekRecords)
  const lastWeekAvg = computeAvg(lastWeekRecords)

  // Generate highlights
  const highlights: string[] = []
  const improvementAreas: string[] = []
  const dimensionLabels: Record<string, string> = {
    content: '内容',
    structure: '结构',
    language: '语言',
    norms: '规范',
  }

  for (const key of dimensionKeys) {
    const delta = thisWeekAvg[key] - lastWeekAvg[key]
    if (delta >= 5) {
      highlights.push(
        `你在${dimensionLabels[key]}方面进步明显 (+${delta}分)`,
      )
    } else if (delta <= -5) {
      improvementAreas.push(
        `${dimensionLabels[key]}方面有所下降 (${delta}分)，建议加强训练`,
      )
    }
  }

  // Check for high scores
  for (const key of dimensionKeys) {
    if (thisWeekAvg[key] >= 85 && lastWeekAvg[key] < 85) {
      highlights.push(
        `${dimensionLabels[key]}达到优秀水平 (${thisWeekAvg[key]}分)`,
      )
    }
  }

  // Check for low scores
  for (const key of dimensionKeys) {
    if (thisWeekAvg[key] < 60) {
      improvementAreas.push(
        `${dimensionLabels[key]}得分偏低 (${thisWeekAvg[key]}分)，建议重点突破`,
      )
    }
  }

  if (highlights.length === 0 && thisWeekRecords.length > 0) {
    highlights.push('本周保持了稳定的训练节奏')
  }

  // Recommendations
  const recommendations: string[] = []
  const weakestDim = dimensionKeys.reduce((min, key) =>
    thisWeekAvg[key] < thisWeekAvg[min] ? key : min,
    dimensionKeys[0],
  )

  if (thisWeekAvg[weakestDim] < 70) {
    recommendations.push(
      `重点提升${dimensionLabels[weakestDim]}能力，每天完成1-2次针对性训练`,
    )
  }

  if (thisWeekRecords.length < 3) {
    recommendations.push('增加训练频率，建议每周至少完成3次训练')
  }

  if (thisWeekRecords.length >= 3) {
    recommendations.push('保持当前训练节奏，可以尝试更高难度的训练内容')
  }

  // Suggest specific level for weak dimension
  const levelMap: Record<string, { subject: string; level: number }> = {
    content: { subject: 'chinese', level: 4 },
    structure: { subject: 'chinese', level: 2 },
    language: { subject: 'chinese', level: 6 },
    norms: { subject: 'english', level: 5 },
  }
  if (thisWeekAvg[weakestDim] < 70 && levelMap[weakestDim]) {
    const lvl = levelMap[weakestDim]
    recommendations.push(
      `建议训练 ${lvl.subject === 'chinese' ? '语文' : '英语'} L${lvl.level} 专项`,
    )
  }

  return NextResponse.json({
    thisWeekCount: thisWeekRecords.length,
    lastWeekCount: lastWeekRecords.length,
    thisWeekAvgScores: thisWeekAvg as { content: number; structure: number; language: number; norms: number },
    lastWeekAvgScores: lastWeekAvg as { content: number; structure: number; language: number; norms: number },
    highlights,
    improvementAreas,
    recommendations,
  })
}

// ─── Trend Mode ──────────────────────────────────────────────────────────────

function handleTrendMode(records: any[], subject: string) {
  const now = new Date()
  const dimensionKeys = ['content', 'structure', 'language', 'norms'] as const

  // Group records by week for the last 12 weeks
  const weeks: { start: Date; end: Date; label: string }[] = []
  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay() + 1 - i * 7)
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    weeks.push({
      start: weekStart,
      end: weekEnd,
      label: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
    })
  }

  const trendData = weeks.map((week) => {
    const weekRecords = records.filter(
      (r) => r.createdAt >= week.start && r.createdAt <= week.end && r.score,
    )

    const scores: Record<string, number> = {}
    for (const key of dimensionKeys) {
      const values: number[] = []
      for (const r of weekRecords) {
        try {
          const ds = JSON.parse(r.dimensionScores || '{}')
          if (typeof ds[key] === 'number') values.push(ds[key])
        } catch {
          /* ignore */
        }
      }
      scores[key] =
        values.length > 0
          ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
          : 0
    }

    return {
      date: week.label,
      scores: scores as { content: number; structure: number; language: number; norms: number },
    }
  })

  // Filter out leading zero-only entries
  const firstNonZero = trendData.findIndex((d) =>
    dimensionKeys.some((k) => d.scores[k] > 0),
  )
  const filteredTrend = firstNonZero >= 0 ? trendData.slice(firstNonZero) : trendData

  // Overall stats
  const scoredRecords = records.filter((r) => r.score)
  const totalTrainings = scoredRecords.length
  const avgScore =
    totalTrainings > 0
      ? Math.round(
          scoredRecords.reduce((sum, r) => sum + (r.score || 0), 0) /
            totalTrainings,
        )
      : 0

  return NextResponse.json({
    trendData: filteredTrend,
    totalTrainings,
    avgScore,
  })
}

// ─── Monthly Mode ────────────────────────────────────────────────────────────

function handleMonthlyMode(records: any[]) {
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

  const thisMonthRecords = records.filter((r) => r.createdAt >= thisMonthStart)
  const lastMonthRecords = records.filter(
    (r) => r.createdAt >= lastMonthStart && r.createdAt <= lastMonthEnd,
  )

  const dimensionKeys = ['content', 'structure', 'language', 'norms']

  function computeMonthData(recordList: any[]) {
    const sums: Record<string, number> = {}
    const counts: Record<string, number> = {}
    const allScores: number[] = []

    for (const r of recordList) {
      if (!r.score) continue
      allScores.push(r.score)
      try {
        const ds = JSON.parse(r.dimensionScores || '{}')
        for (const key of dimensionKeys) {
          if (typeof ds[key] === 'number') {
            sums[key] = (sums[key] || 0) + ds[key]
            counts[key] = (counts[key] || 0) + 1
          }
        }
      } catch {
        /* ignore */
      }
    }

    const dimensionScores: Record<string, number> = {}
    for (const key of dimensionKeys) {
      dimensionScores[key] =
        counts[key] && counts[key] > 0
          ? Math.round(sums[key] / counts[key])
          : 50
    }

    return {
      totalTrainings: allScores.length,
      avgScore:
        allScores.length > 0
          ? Math.round(
              allScores.reduce((a, b) => a + b, 0) / allScores.length,
            )
          : 0,
      dimensionScores: dimensionScores as {
        content: number
        structure: number
        language: number
        norms: number
      },
    }
  }

  const thisMonth = computeMonthData(thisMonthRecords)
  const lastMonth = computeMonthData(lastMonthRecords)

  return NextResponse.json({
    thisMonth,
    lastMonth,
    improvement: thisMonth.avgScore - lastMonth.avgScore,
  })
}

// ─── POST: AI Insights ──────────────────────────────────────────────────────

/**
 * POST /api/progress/weekly-report
 *
 * Generate AI-powered personalized insights based on weekly stats.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, subject, stats } = body

    if (!stats) {
      return NextResponse.json(
        { error: 'Missing stats data' },
        { status: 400 },
      )
    }

    const subjectLabel = subject === 'chinese' ? '语文' : '英语'

    const prompt = `你是一位专业的${subjectLabel}写作教练。请根据以下周训练数据，为学生提供个性化的学习分析和建议。

本周训练数据:
- 训练次数: 本周 ${stats.thisWeekCount} 次 vs 上周 ${stats.lastWeekCount} 次
- 内容得分: 本周 ${stats.thisWeekAvgScores.content} vs 上周 ${stats.lastWeekAvgScores.content}
- 结构得分: 本周 ${stats.thisWeekAvgScores.structure} vs 上周 ${stats.lastWeekAvgScores.structure}
- 语言得分: 本周 ${stats.thisWeekAvgScores.language} vs 上周 ${stats.lastWeekAvgScores.language}
- 规范得分:本周 ${stats.thisWeekAvgScores.norms} vs 上周 ${stats.lastWeekAvgScores.norms}
${stats.highlights.length > 0 ? `\n本周亮点:\n${stats.highlights.map((h: string) => `- ${h}`).join('\n')}` : ''}
${stats.improvementAreas.length > 0 ? `\n需要改进:\n${stats.improvementAreas.map((a: string) => `- ${a}`).join('\n')}` : ''}

请用简洁的中文给出:
1. 一段总体评价（2-3句话）
2. 2-3条具体的改进建议
3. 鼓励性的话语

总字数控制在200字以内。语气要亲切、专业、鼓励。`

    const response = await complete(prompt, {
      system: '你是一位专业的写作教练，擅长分析学生训练数据并给出有针对性的建议。',
      maxTokens: 500,
    })

    return NextResponse.json({ insights: response.text })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('AI insights error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
