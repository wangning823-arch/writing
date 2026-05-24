import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { validateGenre, getGenreRules } from '@/lib/training/genre-validation'

/**
 * POST /api/ai/genre-check
 *
 * Validates whether an essay matches the target genre requirements.
 * Uses AI for deeper analysis beyond pattern matching.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { essay, targetGenre, subject = 'chinese' } = body

    if (!essay || !targetGenre) {
      return NextResponse.json(
        { error: 'Missing required fields: essay, targetGenre' },
        { status: 400 }
      )
    }

    if (subject !== 'chinese' && subject !== 'english') {
      return NextResponse.json(
        { error: 'Invalid subject. Must be "chinese" or "english".' },
        { status: 400 }
      )
    }

    // Get local validation result
    const localResult = validateGenre(essay, targetGenre, subject)

    // Get genre rules for AI prompt
    const genres = getGenreRules(subject)
    const rule = genres.find(g => g.genre === targetGenre)

    if (!rule) {
      return NextResponse.json({ result: localResult })
    }

    const systemPrompt = subject === 'chinese'
      ? '你是一位资深的高中语文教师，专门负责指导学生写作。请分析学生的作文是否符合目标文体的要求。'
      : 'You are an experienced English writing teacher for high school students. Analyze whether the essay matches the target genre requirements.'

    const prompt = subject === 'chinese'
      ? `请分析以下作文是否符合"${targetGenre}"的文体要求。

目标文体特征：${rule.coreFeatures.join('、')}
基本要求：${rule.requirements.join('；')}
常见错误：${rule.commonMistakes.join('、')}

学生作文：
${essay}

请用JSON格式返回分析结果：
{
  "isConsistent": true/false,
  "issues": ["问题1", "问题2"],
  "suggestions": ["建议1", "建议2"],
  "detectedGenre": "实际检测到的文体",
  "confidence": 0.8
}`
      : `Analyze whether the following essay matches the "${targetGenre}" genre requirements.

Genre characteristics: ${rule.coreFeatures.join(', ')}
Requirements: ${rule.requirements.join('; ')}
Common mistakes: ${rule.commonMistakes.join(', ')}

Student essay:
${essay}

Return the analysis in JSON format:
{
  "isConsistent": true/false,
  "issues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "detectedGenre": "detected genre",
  "confidence": 0.8
}`

    const { text } = await complete(prompt, {
      system: systemPrompt,
      maxTokens: 1024,
    })

    let aiResult
    try {
      let jsonStr = text.trim()
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      }
      aiResult = JSON.parse(jsonStr)
    } catch {
      // If AI parsing fails, return local result
      return NextResponse.json({ result: localResult, source: 'local' })
    }

    // Merge local and AI results
    const mergedIssues = [...new Set([...localResult.issues, ...(aiResult.issues || [])])]
    const mergedSuggestions = [...new Set([...localResult.suggestions, ...(aiResult.suggestions || [])])]

    const result = {
      isConsistent: aiResult.isConsistent ?? localResult.isConsistent,
      issues: mergedIssues,
      suggestions: mergedSuggestions,
      detectedGenre: aiResult.detectedGenre || localResult.detectedGenre,
      confidence: aiResult.confidence ?? localResult.confidence,
    }

    return NextResponse.json({ result, source: 'ai' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Genre check error:', message)
    return NextResponse.json(
      { error: 'Genre check failed: ' + message },
      { status: 500 }
    )
  }
}
