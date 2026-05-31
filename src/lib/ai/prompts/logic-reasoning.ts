interface LogicReasoningPromptParams {
  type: 'causal-chain' | 'analogy' | 'counter-argument' | 'fallacy-identification'
  prompt: string
  response: string
  subject: 'chinese' | 'english'
}

export function getLogicReasoningPrompt(params: LogicReasoningPromptParams) {
  const { type, prompt, response, subject } = params
  const lang = subject === 'chinese' ? '中文' : 'English'

  const typeLabel = type === 'causal-chain' ? '因果链推理' : type === 'analogy' ? '类比推理' : type === 'counter-argument' ? '反证法练习' : '逻辑谬误识别'

  return {
    system: `你是一位经验丰富的${subject === 'chinese' ? '语文' : '英语'}逻辑思维教师。

评分规则：
- 如果学生回答内容少于5个字、无意义文字、或明显未认真作答，所有维度给0分。
- 有效回答才按以下维度正常评分。

评分维度（满分100）：
1. 逻辑严密性（logicScore）：推理过程是否逻辑自洽，因果关系是否成立
2. 论证充分性（evidenceScore）：论据是否具体、有力、充分
3. 表达清晰度（clarityScore）：表达是否清晰有条理，是否易于理解

返回 JSON 格式：
{
  "overallScore": 75,
  "logicScore": 80,
  "evidenceScore": 70,
  "clarityScore": 75,
  "scoringCriteria": {
    "logic": "评分依据：推理过程是否逻辑自洽，因果关系是否成立",
    "evidence": "评分依据：论据是否具体、有力、充分",
    "clarity": "评分依据：表达是否清晰有条理，是否易于理解"
  },
  "strengths": ["亮点1", "亮点2"],
  "suggestions": ["建议1", "建议2"],
  "referenceAnswer": "参考答案",
  "exampleVariants": ["变体示例1", "变体示例2"]
}`,
    user: `请用${lang}评估以下逻辑推理练习。

练习类型：${typeLabel}

题目：
${prompt}

学生回答：
${response || '(未填写)'}

请从逻辑严密性、论证充分性、表达清晰度三个维度进行评分，给出详细的评分依据，并提供2-3个优秀范例。`,
  }
}
