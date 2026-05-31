import { NextRequest, NextResponse } from 'next/server'
import { complete } from '@/lib/ai/client'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, subject } = body

    let trainingRecords: any[] = []
    let weakPoints: any[] = []

    if (userId) {
      trainingRecords = await prisma.trainingRecord.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      })

      weakPoints = await prisma.weakPoint.findMany({
        where: { userId },
      })
    }

    const recentScores = trainingRecords.slice(0, 10).map(r => r.score || r.overallScore || 0)
    const avgScore = recentScores.length > 0 ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length) : 0

    const system = `你是一位${subject === 'chinese' ? '语文' : '英语'}写作训练规划专家。
根据学生的能力数据，推荐个性化的训练路径。
返回 JSON 格式：
{
  "path": [
    {
      "id": "1",
      "name": "训练名称",
      "type": "training-type-id",
      "reason": "推荐原因",
      "priority": "high|medium|low",
      "estimatedTime": "预估时间",
      "status": "recommended"
    }
  ]
}

可用的训练类型：
- topic-analysis: 审题立意训练
- paragraph-ordering: 段落排序
- argument-chain: 论证链条训练
- multi-angle: 多角度分析
- paragraph-cards: 提纲编写
- writing-psychology: 写作心理训练
- deep-reading: 精读训练
- dialectical-thinking: 辩证思维训练
- concept-analysis: 概念辨析训练
- logic-reasoning: 逻辑推理训练
- rhetoric-training: 修辞手法训练
- sentence-transformation: 句式变换训练
- argumentation-library: 论证方法库
- pre-writing: 构思引导
- revision-guide: 修改自检清单

请根据学生的薄弱点和训练历史，推荐5个最需要的训练，按优先级排序。`

    const user = `学生训练数据（最近${trainingRecords.length}次，平均分${avgScore}）：
${trainingRecords.slice(0, 10).map((r, i) => `${i + 1}. 得分: ${r.score || r.overallScore || 'N/A'}, 类型: ${r.topicType || r.type || '未知'}`).join('\n') || '暂无训练数据'}

已知薄弱点：
${weakPoints.map(wp => `- ${wp.category || wp.type}: ${wp.description || ''}`).join('\n') || '暂无记录'}

请推荐个性化的训练路径。`

    const res = await complete(user, { system, maxTokens: 1024 })

    let result: any
    try {
      const jsonMatch = res.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found')
      result = JSON.parse(jsonMatch[0])
    } catch {
      result = {
        path: [
          { id: '1', name: '审题立意训练', type: 'topic-analysis', reason: '提升审题准确性', priority: 'high', estimatedTime: '10分钟', status: 'recommended' },
          { id: '2', name: '论证链条训练', type: 'argument-chain', reason: '加强论证逻辑', priority: 'high', estimatedTime: '20分钟', status: 'recommended' },
          { id: '3', name: '多角度分析', type: 'multi-angle', reason: '拓展思维广度', priority: 'medium', estimatedTime: '15分钟', status: 'recommended' },
          { id: '4', name: '精读训练', type: 'deep-reading', reason: '学习优秀写作技巧', priority: 'medium', estimatedTime: '25分钟', status: 'recommended' },
          { id: '5', name: '段落排序', type: 'paragraph-ordering', reason: '理解文章结构', priority: 'low', estimatedTime: '8分钟', status: 'recommended' },
        ],
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Personalized path error:', error)
    return NextResponse.json({ error: 'Path generation failed' }, { status: 500 })
  }
}
