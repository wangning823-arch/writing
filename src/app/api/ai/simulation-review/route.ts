import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { streamAIResponse, SSE_HEADERS } from '@/lib/ai/stream-helper'

/**
 * POST /api/ai/simulation-review — 模拟考试评审
 *
 * 对限时模拟考试的作文进行综合评审，包含作文评分和考试策略分析。
 * 支持 SSE 流式传输（请求体传 stream: true）。
 *
 * Body: { essay, subject, topic, stageData, timeAnalysis, stream? }
 */
const FALLBACK = {
  essayReview: { score: 70, dimensionScores: { content: 14, structure: 10, language: 10, norm: 7 }, strengths: [], suggestions: [], overallComment: '分析完成' },
  timeAnalysis: { overallRating: '一般', stageBreakdown: [], timeManagementAdvice: '' },
  strategyAdvice: [],
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { essay, subject, topic, stageData, timeAnalysis, stream: enableStream } = body

    if (!essay || essay.length < 10) {
      return NextResponse.json({ error: '作文内容太短，请写更多内容后再提交' }, { status: 400 })
    }
    if (!subject || (subject !== 'chinese' && subject !== 'english')) {
      return NextResponse.json({ error: 'Invalid subject. Must be "chinese" or "english".' }, { status: 400 })
    }

    const langLabel = subject === 'chinese' ? '中文' : 'English'
    const maxScore = subject === 'chinese' ? 60 : 25
    const systemPrompt = `你是一位资深的${langLabel}写作教师和考试策略顾问。请从作文质量和考试策略两个维度给出综合评价。返回严格的JSON格式，不要添加markdown代码块标记。`
    const timeAnalysisStr = timeAnalysis ? `\n【各阶段用时】\n${JSON.stringify(timeAnalysis, null, 2)}` : ''

    const prompt = `请对以下限时模拟考试的成果进行综合评审。

【题目】${topic || '自由写作'}
${timeAnalysisStr}

【考场作文】
${essay}

请按以下JSON格式返回评审结果：
{
  "essayReview": {
    "score": 0到${maxScore}的分数,
    "dimensionScores": {
      "content": ${subject === 'chinese' ? '0到20' : '0到10'},
      "structure": ${subject === 'chinese' ? '0到15' : '0到5'},
      "language": ${subject === 'chinese' ? '0到15' : '0到5'},
      "norm": ${subject === 'chinese' ? '0到10' : '0到5'}
    },
    "strengths": ["优点1", "优点2"],
    "suggestions": ["建议1", "建议2"],
    "overallComment": "总体评价"
  },
  "timeAnalysis": {
    "overallRating": "优秀/良好/一般/需改进",
    "stageBreakdown": [{ "stage": "阶段名", "recommended": 0, "actual": 0, "rating": "优秀/良好/一般/需改进", "comment": "评价" }],
    "timeManagementAdvice": "时间管理总体建议"
  },
  "strategyAdvice": ["策略建议1", "策略建议2"]
}`

    if (enableStream) {
      const readable = await streamAIResponse(prompt, { system: systemPrompt, maxTokens: 4096, fallbackResult: FALLBACK })
      return new Response(readable, { headers: SSE_HEADERS })
    }

    const { text } = await complete(prompt, { system: systemPrompt, maxTokens: 4096 })
    let result
    try {
      let jsonStr = text.trim()
      if (jsonStr.startsWith('```')) jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      result = JSON.parse(jsonStr)
    } catch {
      return NextResponse.json({ error: 'AI返回内容解析失败', raw: text }, { status: 500 })
    }
    return NextResponse.json({ result })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('AI Simulation Review Error:', message)
    return NextResponse.json({ error: 'AI模拟评审失败: ' + message }, { status: 500 })
  }
}
