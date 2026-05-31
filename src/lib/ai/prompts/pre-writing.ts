interface PreWritingPromptParams {
  topic: string
  genre?: string
  currentIdea?: string
  phase: 'brainstorm' | 'outline' | 'polish'
  subject: 'chinese' | 'english'
}

export function getPreWritingPrompt(params: PreWritingPromptParams) {
  const { topic, genre, currentIdea, phase, subject } = params
  const lang = subject === 'chinese' ? '中文' : 'English'

  if (phase === 'brainstorm') {
    return {
      system: `你是一位苏格拉底式的${subject === 'chinese' ? '语文' : '英语'}写作导师。
通过提问引导学生深入思考，而不是直接给出答案。
每次提1-2个问题，帮助学生从不同角度审视话题。
返回 JSON 格式：
{
  "questions": ["问题1", "问题2"],
  "mindMap": {
    "central": "核心主题",
    "branches": [
      { "label": "分支1", "children": ["要点1", "要点2"] },
      { "label": "分支2", "children": ["要点1", "要点2"] }
    ]
  },
  "encouragement": "鼓励语"
}`,
      user: `请用${lang}引导学生进行写作构思。

话题：${topic}
${genre ? `文体：${genre}` : ''}
${currentIdea ? `学生已有想法：${currentIdea}` : '学生尚未开始构思'}

请通过提问引导学生深入思考，并提供初步的思维导图框架。`,
    }
  }

  if (phase === 'outline') {
    return {
      system: `你是一位经验丰富的${subject === 'chinese' ? '语文' : '英语'}写作教师。
帮助学生将零散的想法组织成清晰的写作提纲。
返回 JSON 格式：
{
  "outline": [
    { "level": 1, "text": "开头段", "children": ["引入方式", "中心论点"] },
    { "level": 2, "text": "分论点1", "children": ["论据1", "分析1"] },
    { "level": 2, "text": "分论点2", "children": ["论据2", "分析2"] },
    { "level": 1, "text": "结尾段", "children": ["总结升华"] }
  ],
  "suggestions": ["建议1", "建议2"],
  "structureScore": 75
}`,
      user: `请用${lang}帮助学生组织写作提纲。

话题：${topic}
${genre ? `文体：${genre}` : ''}
学生的想法：
${currentIdea || '(未填写)'}

请根据学生的想法，帮助组织成清晰的写作提纲。`,
    }
  }

  return {
    system: `你是一位经验丰富的${subject === 'chinese' ? '语文' : '英语'}写作教师。
帮助学生审视和完善写作提纲，检查逻辑漏洞和结构问题。
返回 JSON 格式：
{
  "review": {
    "structureScore": 80,
    "logicScore": 75,
    "completenessScore": 70
  },
  "strengths": ["亮点1", "亮点2"],
  "issues": ["问题1", "问题2"],
  "revisedOutline": "修改后的提纲建议",
  "finalTips": ["临场提示1", "临场提示2"]
}`,
    user: `请用${lang}帮助学生完善写作提纲。

话题：${topic}
${genre ? `文体：${genre}` : ''}

学生的提纲：
${currentIdea || '(未填写)'}

请检查提纲的结构完整性、逻辑严密性，并给出修改建议和临场写作提示。`,
  }
}
