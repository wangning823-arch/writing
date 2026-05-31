interface RhetoricPromptParams {
  type: 'recognition' | 'imitation' | 'application'
  exercisePrompt: string
  response: string
  rhetoricType: string
  subject: 'chinese' | 'english'
}

export function getRhetoricPrompt(params: RhetoricPromptParams) {
  const { type, exercisePrompt, response, rhetoricType, subject } = params
  const lang = subject === 'chinese' ? '中文' : 'English'

  if (type === 'recognition') {
    return {
      system: `你是一位经验丰富的${subject === 'chinese' ? '语文' : '英语'}修辞教师。

评分规则：
- 如果学生回答内容少于2个字、无意义文字、或明显未认真作答，所有维度给0分。
- 有效回答才按以下维度正常评分。

请评估学生对修辞手法的识别能力。
返回 JSON 格式：
{
  "overallScore": 75,
  "correct": true,
  "strengths": ["亮点1"],
  "suggestions": ["建议1"],
  "scoringCriteria": {
    "accuracy": "评分依据：是否正确识别了修辞手法，解释是否合理"
  },
  "referenceAnswer": "标准参考答案",
  "exampleVariants": ["变体示例1", "变体示例2"]
}`,
      user: `请用${lang}评估以下修辞识别练习。

识别类型：${rhetoricType}
句子：${exercisePrompt}

学生回答：${response || '(未填写)'}

请判断学生的识别是否正确，给出详细的评分依据，并提供2-3个优秀范例。`,
    }
  }

  return {
    system: `你是一位经验丰富的${subject === 'chinese' ? '语文' : '英语'}修辞教师。

评分规则：
- 如果学生回答内容少于5个字、无意义文字、或明显未认真作答，所有维度给0分。
- 有效回答才按以下维度正常评分。

评分维度（满分100）：
1. 修辞准确性（accuracyScore）：修辞手法使用是否正确、恰当
2. 表达效果（effectScore）：修辞是否增强了表达效果
3. 创意性（creativityScore）：仿写或应用是否有创意和新意

返回 JSON 格式：
{
  "overallScore": 75,
  "accuracyScore": 80,
  "effectScore": 70,
  "creativityScore": 75,
  "scoringCriteria": {
    "accuracy": "评分依据：修辞手法使用是否正确、恰当",
    "effect": "评分依据：修辞是否增强了表达效果",
    "creativity": "评分依据：仿写或应用是否有创意和新意"
  },
  "strengths": ["亮点1", "亮点2"],
  "suggestions": ["建议1", "建议2"],
  "referenceAnswer": "参考示例",
  "exampleVariants": ["变体示例1", "变体示例2"]
}`,
    user: `请用${lang}评估以下修辞${type === 'imitation' ? '仿写' : '应用'}练习。

修辞类型：${rhetoricType}
题目要求：${exercisePrompt}

学生作答：
${response || '(未填写)'}

请从修辞准确性、表达效果、创意性三个维度进行评分，给出详细的评分依据，并提供2-3个优秀范例。`,
  }
}
