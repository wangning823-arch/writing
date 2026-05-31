import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { streamAIResponse, SSE_HEADERS } from '@/lib/ai/stream-helper'

/**
 * POST /api/ai/compare — 同题对比分析
 *
 * 将学生作文与范文逐段对比，从立意、结构、论据、语言四个维度分析差异。
 * 支持 SSE 流式传输（请求体传 stream: true）。
 *
 * Body: { studentEssay, modelEssay, subject, topic, stream? }
 */
const FALLBACK = {
  paragraphComparisons: [], overallAnalysis: { thesisDepth: { summary: '', advice: '' }, structureArrangement: { summary: '', advice: '' }, evidenceUsage: { summary: '', advice: '' }, languageExpression: { summary: '', advice: '' } },
  keyTakeaways: [],
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { studentEssay, modelEssay, subject, topic, stream: enableStream } = body

    if (!studentEssay || !modelEssay) {
      return NextResponse.json({ error: 'Missing required fields: studentEssay, modelEssay' }, { status: 400 })
    }
    if (studentEssay.length < 10) {
      return NextResponse.json({ error: '学生作文内容太短' }, { status: 400 })
    }
    if (modelEssay.length < 10) {
      return NextResponse.json({ error: '范文内容太短' }, { status: 400 })
    }
    if (subject !== 'chinese' && subject !== 'english') {
      return NextResponse.json({ error: 'Invalid subject. Must be "chinese" or "english".' }, { status: 400 })
    }

    const langLabel = subject === 'chinese' ? '中文' : 'English'
    const systemPrompt = `你是一位资深的${langLabel}写作教师，擅长对比分析学生作文与范文的差异。请以专业、具体、建设性的方式进行对比分析。返回严格的JSON格式，不要添加markdown代码块标记。`

    const prompt = `请对以下两篇同题${subject === 'chinese' ? '作文' : 'essay'}进行逐段对比分析。

【题目】${topic || '同题对比'}

【学生作文】
${studentEssay}

【范文】（满分${subject === 'chinese' ? '60' : '25'}分）
${modelEssay}

请按以下JSON格式返回分析结果：
{
  "paragraphComparisons": [
    {
      "studentParagraph": "学生对应段落内容",
      "modelParagraph": "范文对应段落内容",
      "analysis": {
        "thesis": { "student": "学生立意", "model": "范文立意", "difference": "差异" },
        "structure": { "student": "学生结构", "model": "范文结构", "difference": "差异" },
        "evidence": { "student": "学生论据", "model": "范文论据", "difference": "差异" },
        "language": { "student": "学生语言", "model": "范文语言", "difference": "差异" }
      }
    }
  ],
  "overallAnalysis": {
    "thesisDepth": { "summary": "立意对比", "advice": "建议" },
    "structureArrangement": { "summary": "结构对比", "advice": "建议" },
    "evidenceUsage": { "summary": "论据对比", "advice": "建议" },
    "languageExpression": { "summary": "语言对比", "advice": "建议" }
  },
  "keyTakeaways": ["收获1", "收获2", "收获3"]
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
    console.error('AI Compare Error:', message)
    return NextResponse.json({ error: 'AI对比分析失败: ' + message }, { status: 500 })
  }
}
