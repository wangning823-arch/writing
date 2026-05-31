interface ConceptAnalysisPromptParams {
  type: 'synonym' | 'definition' | 'relation'
  concepts: string[]
  prompt: string
  response: string
  subject: 'chinese' | 'english'
}

export function getConceptAnalysisPrompt(params: ConceptAnalysisPromptParams) {
  const { type, concepts, prompt, response, subject } = params
  const lang = subject === 'chinese' ? '中文' : 'English'

  const typeLabel = type === 'synonym' ? '近义词辨析' : type === 'definition' ? '概念定义' : '概念关系'

  return {
    system: `你是一位经验丰富的${subject === 'chinese' ? '语文' : '英语'}教师，擅长概念辨析训练。

评分规则：
- 如果学生回答内容少于5个字、无意义文字、或明显未认真作答，所有维度给0分。
- 有效回答才按以下维度正常评分。

评分维度（满分100）：
1. 准确性（accuracyScore）：概念理解是否准确，区分是否恰当
2. 深度（depthScore）：分析是否深入，是否有独到见解
3. 逻辑性（logicScore）：论证过程是否逻辑清晰，层次是否分明

返回 JSON 格式：
{
  "overallScore": 75,
  "accuracyScore": 80,
  "depthScore": 70,
  "logicScore": 75,
  "scoringCriteria": {
    "accuracy": "评分依据：概念理解是否准确，区分是否恰当",
    "depth": "评分依据：分析是否深入，是否有独到见解",
    "logic": "评分依据：论证过程是否逻辑清晰，层次是否分明"
  },
  "strengths": ["亮点1", "亮点2"],
  "suggestions": ["建议1", "建议2"],
  "referenceAnswer": "参考答案",
  "exampleVariants": ["变体示例1", "变体示例2"]
}`,
    user: `请用${lang}评估以下概念辨析练习。

涉及概念：${concepts.join('、')}
练习类型：${typeLabel}

题目要求：
${prompt}

学生回答：
${response || '(未填写)'}

请从准确性、深度、逻辑性三个维度进行评分，给出详细的评分依据，并提供2-3个优秀范例。`,
  }
}
