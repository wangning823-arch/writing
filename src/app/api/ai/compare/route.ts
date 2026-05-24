import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'

/**
 * POST /api/ai/compare
 *
 * Same-topic comparison: compare a student essay against a model essay,
 * paragraph by paragraph, analyzing differences across four dimensions.
 *
 * Body: { studentEssay, modelEssay, subject, topic }
 * Returns: structured JSON with per-paragraph comparisons and overall analysis.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { studentEssay, modelEssay, subject, topic } = body

    // --- Validation ---
    if (!studentEssay || !modelEssay) {
      return NextResponse.json(
        { error: 'Missing required fields: studentEssay, modelEssay' },
        { status: 400 },
      )
    }

    if (studentEssay.length < 10) {
      return NextResponse.json(
        { error: '学生作文内容太短' },
        { status: 400 },
      )
    }

    if (modelEssay.length < 10) {
      return NextResponse.json(
        { error: '范文内容太短' },
        { status: 400 },
      )
    }

    if (subject !== 'chinese' && subject !== 'english') {
      return NextResponse.json(
        { error: 'Invalid subject. Must be "chinese" or "english".' },
        { status: 400 },
      )
    }

    const langLabel = subject === 'chinese' ? '中文' : 'English'

    const systemPrompt = `你是一位资深的${langLabel}写作教师，擅长对比分析学生作文与范文的差异。
请以专业、具体、建设性的方式进行对比分析。
返回严格的JSON格式，不要添加markdown代码块标记。`

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
        "thesis": {
          "student": "学生在立意方面的表现",
          "model": "范文在立意方面的表现",
          "difference": "两者差异分析"
        },
        "structure": {
          "student": "学生在结构安排方面的表现",
          "model": "范文在结构安排方面的表现",
          "difference": "两者差异分析"
        },
        "evidence": {
          "student": "学生在论据运用方面的表现",
          "model": "范文在论据运用方面的表现",
          "difference": "两者差异分析"
        },
        "language": {
          "student": "学生在语言表达方面的表现",
          "model": "范文在语言表达方面的表现",
          "difference": "两者差异分析"
        }
      }
    }
  ],
  "overallAnalysis": {
    "thesisDepth": {
      "summary": "立意深度总体对比",
      "advice": "改进建议"
    },
    "structureArrangement": {
      "summary": "结构安排总体对比",
      "advice": "改进建议"
    },
    "evidenceUsage": {
      "summary": "论据运用总体对比",
      "advice": "改进建议"
    },
    "languageExpression": {
      "summary": "语言表达总体对比",
      "advice": "改进建议"
    }
  },
  "keyTakeaways": ["关键收获1", "关键收获2", "关键收获3"]
}`

    const { text } = await complete(prompt, { system: systemPrompt, maxTokens: 4096 })

    let result
    try {
      let jsonStr = text.trim()
      // Strip markdown code block if present
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      }
      result = JSON.parse(jsonStr)
    } catch {
      return NextResponse.json(
        { error: 'AI返回内容解析失败', raw: text },
        { status: 500 },
      )
    }

    return NextResponse.json({ result })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('AI Compare Error:', message)
    return NextResponse.json(
      { error: 'AI对比分析失败: ' + message },
      { status: 500 },
    )
  }
}
