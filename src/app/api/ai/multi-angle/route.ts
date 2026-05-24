import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'

interface AngleAnalysis {
  angle: string
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { topic, subject, analyses } = body as {
      topic: string
      subject: string
      analyses: AngleAnalysis[]
    }

    if (!topic || !subject || !analyses || !Array.isArray(analyses) || analyses.length === 0) {
      return NextResponse.json(
        { error: '缺少必要字段：topic, subject, analyses' },
        { status: 400 },
      )
    }

    const lang = subject === 'english' ? 'English' : 'Chinese'

    const analysisText = analyses
      .map((a, i) => `Angle ${i + 1} - ${a.angle}:\n${a.content}`)
      .join('\n\n')

    const prompt = `You are a writing instructor evaluating multi-angle analysis for a ${lang} essay.

Topic: ${topic}

The student has written analyses from ${analyses.length} different angles. Evaluate each angle on:
1. Depth: Does the analysis go beyond surface-level observations?
2. Relevance: Is the analysis clearly connected to the topic?
3. Originality: Does the student offer a unique or insightful perspective?
4. Clarity: Is the analysis well-expressed and easy to understand?

Student's analyses:
${analysisText}

Evaluate the overall breadth of perspectives covered. Are the angles sufficiently different from each other? Does the combination of angles provide a comprehensive view of the topic?

Return ONLY a JSON object (no markdown code blocks) with this exact structure:
{
  "angles": [
    { "score": <0-100>, "feedback": "<specific feedback in ${lang}>" }
  ],
  "overallDepth": "<assessment of overall analytical depth and breadth, in ${lang}>",
  "totalScore": <0-100, weighted average emphasizing depth and breadth>
}

Score each angle 0-100. The totalScore should weight depth (40%), breadth (30%), and individual angle quality (30%).`

    const { text } = await complete(prompt, { maxTokens: 2048 })

    let jsonStr = text.trim()
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    const result = JSON.parse(jsonStr)

    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Multi-Angle Analysis Error:', message)
    return NextResponse.json(
      { error: '评估失败: ' + message },
      { status: 500 },
    )
  }
}
