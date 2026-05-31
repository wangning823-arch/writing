interface SentenceTransformationPromptParams {
  exerciseType: string
  originalSentence: string
  prompt: string
  response: string
  subject: 'chinese' | 'english'
}

export function getSentenceTransformationPrompt(params: SentenceTransformationPromptParams) {
  const { exerciseType, originalSentence, prompt, response, subject } = params
  const lang = subject === 'chinese' ? '中文' : 'English'

  const typeLabels: Record<string, string> = {
    'long-short': '长短句变换',
    'integrated-scattered': '整散句变换',
    'inversion': '倒装句训练',
    'upgrade': '句式升级',
  }

  return {
    system: `你是一位经验丰富的${subject === 'chinese' ? '语文' : '英语'}句式训练教师。
请评估学生在"${typeLabels[exerciseType] || exerciseType}"练习中的表现。

评分规则：
- 如果学生回答内容少于5个字、无意义文字（如单个字母、乱码）、或明显未认真作答，所有维度给0分，并在suggestions中说明"回答内容不完整，请认真完成句式变换"。
- 有效回答才按以下维度正常评分。

评分维度（满分100，要求严格）：
1. 句式变换准确性（transformScore）：是否严格完成了题目要求的句式变换类型，结构是否规范，是否改变了原意。只做简单改写而未满足题目具体要求的，该项不超过40分。
2. 语言表达质量（languageScore）：变换后是否通顺流畅，用词是否准确恰当，逻辑是否连贯。有明显语病或不通顺的，该项不超过30分。
3. 修辞效果（rhetoricScore）：变换后是否增强了表达效果，是否有文采和表现力。仅仅是机械变换而无任何提升的，该项不超过40分。

注意：这是进阶以上的训练，评分标准应严格。只有真正高质量的变换才能获得80分以上。

返回 JSON 格式：
{
  "overallScore": 75,
  "transformScore": 80,
  "languageScore": 70,
  "rhetoricScore": 75,
  "scoringCriteria": {
    "transform": "评分依据：是否正确完成了要求的句式变换，结构是否符合规范",
    "language": "评分依据：变换后的句子是否通顺流畅，用词是否恰当",
    "rhetoric": "评分依据：变换后是否增强了表达效果，是否有文采"
  },
  "strengths": ["亮点1", "亮点2"],
  "suggestions": ["建议1", "建议2"],
  "referenceAnswer": "标准参考答案",
  "exampleVariants": ["变体示例1", "变体示例2"]
}`,
    user: `请用${lang}评估以下句式变换练习。

练习类型：${typeLabels[exerciseType] || exerciseType}
原始句子：${originalSentence}
题目要求：${prompt}

学生变换结果：
${response || '(未填写)'}

请从句式变换准确性、语言表达质量、修辞效果三个维度进行评分，给出详细的评分依据，并提供2-3个优秀范例。`,
  }
}
