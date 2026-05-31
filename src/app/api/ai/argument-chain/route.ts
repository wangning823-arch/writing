import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { streamAIResponse, SSE_HEADERS } from '@/lib/ai/stream-helper'

/**
 * POST /api/ai/argument-chain — 论证链条评估
 *
 * 评估学生构建的论证链条，从逻辑连贯性、论据质量、分析深度、总结效果四个维度打分。
 * 支持 SSE 流式传输（请求体传 stream: true）。
 *
 * Body: { topic, subject, thesis, chains: ChainInput[], stream? }
 */

/** 单条论证链条的输入结构 */
interface ChainInput {
  claim: string
  evidence: string
  analysis: string
  summary: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { topic, subject, thesis, chains, stream: enableStream } = body as {
      topic: string; subject: string; thesis: string; chains: ChainInput[]; stream?: boolean
    }

    if (!topic || !subject || !thesis || !chains || !Array.isArray(chains) || chains.length === 0) {
      return NextResponse.json({ error: '缺少必要字段：topic, subject, thesis, chains' }, { status: 400 })
    }

    const lang = subject === 'english' ? 'English' : 'Chinese'
    const chainText = chains.map((c, i) => `Chain ${i + 1}:\n  Claim: ${c.claim}\n  Evidence: ${c.evidence}\n  Analysis: ${c.analysis}\n  Summary: ${c.summary}`).join('\n\n')

    const prompt = `You are a writing instructor evaluating argument chains for a ${lang} essay.

Topic/Thesis: ${topic}

The student has constructed ${chains.length} argument chains. Evaluate each chain on:
1. Logical coherence: Does the claim logically follow from the thesis? Is the evidence relevant to the claim? Does the analysis connect evidence to claim?
2. Evidence quality: Is the evidence specific and convincing?
3. Analysis depth: Does the analysis go beyond surface-level observation?
4. Summary: Does the summary effectively tie the chain together?

Student's argument chains:
${chainText}

Return ONLY a JSON object (no markdown code blocks) with this exact structure:
{
  "chains": [
    { "score": <0-100>, "feedback": "<specific feedback in ${lang}>" }
  ],
  "totalScore": <average of chain scores, 0-100>
}

Score each chain 0-100 based on logical completeness, evidence relevance, analysis depth, and summary quality.
The totalScore should be the average of all chain scores.`

    if (enableStream) {
      const readable = await streamAIResponse(prompt, { maxTokens: 2048 })
      return new Response(readable, { headers: SSE_HEADERS })
    }

    const { text } = await complete(prompt, { maxTokens: 2048 })
    let jsonStr = text.trim()
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    const result = JSON.parse(jsonStr)
    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Argument Chain Evaluation Error:', message)
    return NextResponse.json({ error: '评估失败: ' + message }, { status: 500 })
  }
}
