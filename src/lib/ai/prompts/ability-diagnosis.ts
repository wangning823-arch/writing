interface AbilityDiagnosisPromptParams {
  subject: 'chinese' | 'english'
  trainingRecords: any[]
  weakPoints: any[]
  errorRecords: any[]
  abilityProfile?: any
}

export function getAbilityDiagnosisPrompt(params: AbilityDiagnosisPromptParams) {
  const { subject, trainingRecords, weakPoints, errorRecords, abilityProfile } = params
  const lang = subject === 'chinese' ? '中文' : 'English'

  const recentScores = trainingRecords.slice(0, 10).map(r => r.score || r.overallScore || 0)
  const avgScore = recentScores.length > 0 ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length) : 0

  return {
    system: `你是一位经验丰富的${subject === 'chinese' ? '语文' : '英语'}写作能力诊断专家。
根据学生的训练数据，生成多维度能力诊断报告。
返回 JSON 格式：
{
  "overallLevel": "B",
  "overallScore": ${avgScore},
  "dimensions": [
    { "name": "审题立意", "score": 75, "level": "B+", "trend": "up", "description": "..." },
    { "name": "结构层次", "score": 80, "level": "A-", "trend": "stable", "description": "..." },
    { "name": "论据论证", "score": 65, "level": "B-", "trend": "down", "description": "..." },
    { "name": "语言表达", "score": 70, "level": "B", "trend": "up", "description": "..." },
    { "name": "创新思维", "score": 60, "level": "C+", "trend": "stable", "description": "..." }
  ],
  "weakPoints": ["薄弱点1", "薄弱点2"],
  "strengths": ["优势1", "优势2"],
  "recommendations": ["建议1", "建议2", "建议3"],
  "nextSteps": ["下一步1", "下一步2"]
}`,
    user: `请用${lang}为以下学生生成写作能力诊断报告。

学生训练数据（最近${trainingRecords.length}次）：
${trainingRecords.slice(0, 10).map((r, i) => `${i + 1}. 得分: ${r.score || r.overallScore || 'N/A'}, 类型: ${r.topicType || r.type || '未知'}`).join('\n') || '暂无训练数据'}

已知薄弱点：
${weakPoints.map(wp => `- ${wp.category || wp.type}: ${wp.description || wp.count || 0}次`).join('\n') || '暂无记录'}

错误记录（最近${errorRecords.length}条）：
${errorRecords.slice(0, 5).map(e => `- ${e.errorType || e.type}: ${e.description || ''}`).join('\n') || '暂无记录'}

${abilityProfile ? `现有能力画像：${JSON.stringify(abilityProfile)}` : ''}

请根据以上数据，从审题立意、结构层次、论据论证、语言表达、创新思维五个维度进行诊断。`,
  }
}
