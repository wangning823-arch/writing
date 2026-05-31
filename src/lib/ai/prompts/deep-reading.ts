export interface DeepReadingAnnotation {
  paragraphIndex: number
  technique: string
  effect: string
  personalThought: string
}

export interface DeepReadingReflection {
  summary: string
  techniques: string
  inspiration: string
}

export function getDeepReadingAnalysisPrompt(
  essayTitle: string,
  essayContent: string,
  annotations: DeepReadingAnnotation[],
  reflection: DeepReadingReflection,
  subject: 'chinese' | 'english',
): { system: string; user: string } {
  const system = `你是一位经验丰富的高中${subject === 'chinese' ? '语文' : '英语'}教师，擅长引导学生深度阅读范文。
你的任务是评估学生的阅读批注质量，包括：技巧识别的准确性、个人感悟的深度、阅读反思的质量。

铁律：
1. 绝不代写 — 不产出可直接复制粘贴的替换内容
2. 具体定位 — 反馈必须指向学生批注的具体段落
3. 解释"为什么" — 不只说"好/不好"，要解释原因
4. 鼓励为主 — 先肯定优点，再指出改进方向
5. 最多给 3 条总体建议`

  const annotationsJson = JSON.stringify(annotations, null, 2)
  const reflectionJson = JSON.stringify(reflection, null, 2)

  const user = `请分析以下学生对范文的精读批注：

## 范文信息
标题：${essayTitle}
内容：
${essayContent}

## 学生批注
${annotationsJson}

## 学生阅读反思
${reflectionJson}

请按以下JSON格式输出分析结果：
{
  "paragraphScores": [
    {
      "paragraphIndex": 0,
      "techniqueScore": 0-100,
      "insightScore": 0-100,
      "feedback": "针对该段批注的具体评价"
    }
  ],
  "overallScore": 0-100,
  "techniqueAccuracy": 0-100,
  "insightDepth": 0-100,
  "reflectionQuality": 0-100,
  "summary": "2-3句话总体评价",
  "techniquesMissed": ["学生遗漏的重要技巧"],
  "techniquesCorrect": ["学生正确识别的技巧"],
  "strengths": ["学生做得好的方面"],
  "suggestions": ["具体的改进建议"]
}`

  return { system, user }
}
