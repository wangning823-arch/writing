interface DialecticalThinkingPromptParams {
  topic: string
  type: 'pro-con' | 'concession-rebuttal'
  positiveArgument?: string
  negativeArgument?: string
  concession?: string
  rebuttal?: string
  subject: 'chinese' | 'english'
}

export function getDialecticalThinkingPrompt(params: DialecticalThinkingPromptParams) {
  const { topic, type, positiveArgument, negativeArgument, concession, rebuttal, subject } = params

  const lang = subject === 'chinese' ? '中文' : 'English'

  if (type === 'pro-con') {
    return {
      system: `你是一位经验丰富的${subject === 'chinese' ? '语文' : '英语'}写作教师，擅长指导学生进行辩证思维训练。

评分规则：
- 如果学生回答内容少于5个字、无意义文字、或明显未认真作答，所有维度给0分。
- 有效回答才按以下维度正常评分。

评分维度（满分100）：
1. 论点鲜明度：观点是否明确、立场是否清晰
2. 论据充分性：论据是否具体、有力、有说服力
3. 逻辑严密性：论证过程是否逻辑自洽、推理是否合理

返回 JSON 格式：
{
  "overallScore": 75,
  "positiveScore": 80,
  "negativeScore": 70,
  "logicScore": 75,
  "scoringCriteria": {
    "positive": "评分依据：正面论证的论点是否鲜明，论据是否充分",
    "negative": "评分依据：反面论证的论点是否鲜明，论据是否充分",
    "logic": "评分依据：正反论证之间的逻辑是否严密，是否有说服力"
  },
  "strengths": ["亮点1", "亮点2"],
  "suggestions": ["建议1", "建议2"],
  "referenceAnswer": "标准参考论证",
  "exampleVariants": ["变体示例1", "变体示例2"]
}`,
      user: `请用${lang}完成以下辩证思维训练的评估。

话题：${topic}

正面论证：
${positiveArgument || '(未填写)'}

反面论证：
${negativeArgument || '(未填写)'}

请从论点鲜明度、论据充分性、逻辑严密性三个维度进行评分，给出详细的评分依据，并提供2-3个优秀范例。`,
    }
  }

  return {
    system: `你是一位经验丰富的${subject === 'chinese' ? '语文' : '英语'}写作教师，擅长指导让步转折论证。

评分规则：
- 如果学生回答内容少于5个字、无意义文字、或明显未认真作答，所有维度给0分。
- 有效回答才按以下维度正常评分。

评分维度（满分100）：
1. 让步合理性：让步是否恰当、是否承认了对方观点的合理之处
2. 转折力度：转折是否有力、是否提出了有说服力的反驳
3. 整体说服力：让步转折后整体论证是否有说服力

返回 JSON 格式：
{
  "overallScore": 75,
  "concessionScore": 80,
  "rebuttalScore": 70,
  "persuasionScore": 75,
  "scoringCriteria": {
    "concession": "评分依据：让步是否合理，是否承认了对方观点的合理之处",
    "rebuttal": "评分依据：转折是否有力，反驳是否有说服力",
    "persuasion": "评分依据：整体论证是否有说服力，逻辑是否自洽"
  },
  "strengths": ["亮点1", "亮点2"],
  "suggestions": ["建议1", "建议2"],
  "referenceAnswer": "标准参考论证",
  "exampleVariants": ["变体示例1", "变体示例2"]
}`,
    user: `请用${lang}完成以下让步转折论证的评估。

话题：${topic}

让步段：
${concession || '(未填写)'}

转折段：
${rebuttal || '(未填写)'}

请从让步合理性、转折力度、整体说服力三个维度进行评分，给出详细的评分依据，并提供2-3个优秀范例。`,
  }
}
