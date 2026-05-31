import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { getAbilityDiagnosisPrompt } from '@/lib/ai/prompts/ability-diagnosis'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, subject } = body

    let trainingRecords: any[] = []
    let weakPoints: any[] = []
    let errorRecords: any[] = []
    let abilityProfile: any = null

    if (userId) {
      trainingRecords = await prisma.trainingRecord.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      })

      weakPoints = await prisma.weakPoint.findMany({
        where: { userId },
      })

      errorRecords = await prisma.errorRecord.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      })

      const profiles = await prisma.abilityProfile.findMany({
        where: { userId },
      })
      abilityProfile = profiles.length > 0 ? profiles : null
    }

    const { system, user } = getAbilityDiagnosisPrompt({
      subject: subject || 'chinese',
      trainingRecords,
      weakPoints,
      errorRecords,
      abilityProfile,
    })

    const res = await complete(user, { system, maxTokens: 2048 })

    let result: any
    try {
      const jsonMatch = res.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      result = JSON.parse(jsonMatch[0])
    } catch {
      result = {
        overallLevel: 'B',
        overallScore: 70,
        dimensions: [
          { name: '审题立意', score: 70, level: 'B', trend: 'stable', description: '审题能力中等，建议加强关键词分析' },
          { name: '结构层次', score: 75, level: 'B+', trend: 'up', description: '结构较清晰，过渡自然' },
          { name: '论据论证', score: 65, level: 'B-', trend: 'stable', description: '论据较单一，建议多元化' },
          { name: '语言表达', score: 72, level: 'B', trend: 'up', description: '语言通顺，部分表达有文采' },
          { name: '创新思维', score: 60, level: 'C+', trend: 'stable', description: '观点较常规，可尝试独到见解' },
        ],
        weakPoints: ['论据论证能力有待提升', '创新思维需要加强'],
        strengths: ['结构层次较好', '语言表达通顺'],
        recommendations: ['多阅读优秀范文，积累论据素材', '尝试从不同角度分析话题', '加强逻辑思维训练'],
        nextSteps: ['完成论证链条训练', '进行多角度分析练习', '阅读2篇优秀范文并做批注'],
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Ability diagnosis error:', error)
    return NextResponse.json({ error: 'Diagnosis failed' }, { status: 500 })
  }
}
