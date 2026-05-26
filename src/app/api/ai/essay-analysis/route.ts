import { NextRequest, NextResponse } from 'next/server'
import {
  analyzeEssay,
  getSavedAnalysis,
  type EssayAnalysisRequest,
} from '@/lib/ai/essay-analysis-service'

/**
 * POST /api/ai/essay-analysis
 * Trigger AI analysis of a model essay.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      essaySource,
      essayId,
      essayTitle,
      essayContent,
      subject,
      techniques,
      userId = 'anonymous',
    } = body as EssayAnalysisRequest & { userId?: string }

    // Validation
    if (!essaySource || !['model', 'topic', 'english-json'].includes(essaySource)) {
      return NextResponse.json({ error: '无效的essaySource' }, { status: 400 })
    }
    if (!essayId) {
      return NextResponse.json({ error: '缺少essayId' }, { status: 400 })
    }
    if (!essayTitle) {
      return NextResponse.json({ error: '缺少essayTitle' }, { status: 400 })
    }
    if (!essayContent || essayContent.length < 10) {
      return NextResponse.json({ error: '范文内容过短' }, { status: 400 })
    }
    if (!subject || !['chinese', 'english'].includes(subject)) {
      return NextResponse.json({ error: '无效的subject' }, { status: 400 })
    }

    const { analysis, recordId } = await analyzeEssay({
      essaySource,
      essayId,
      essayTitle,
      essayContent,
      subject,
      techniques,
      userId,
    })

    return NextResponse.json({ analysis, recordId })
  } catch (error) {
    console.error('Essay analysis error:', error)
    const message = error instanceof Error ? error.message : '分析失败，请重试'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * GET /api/ai/essay-analysis?essaySource=...&essayId=...&userId=...
 * Retrieve a saved analysis.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const essaySource = searchParams.get('essaySource')
    const essayId = searchParams.get('essayId')
    const userId = searchParams.get('userId') || 'anonymous'

    if (!essaySource || !essayId) {
      return NextResponse.json({ error: '缺少参数' }, { status: 400 })
    }

    const analysis = await getSavedAnalysis(userId, essaySource, essayId)
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Get essay analysis error:', error)
    return NextResponse.json({ error: '查询失败' }, { status: 500 })
  }
}
