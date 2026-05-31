interface RealtimeHintsPromptParams {
  content: string
  topic?: string
  subject: 'chinese' | 'english'
  phase: 'paragraph-check' | 'logic-check' | 'word-count'
}

export function getRealtimeHintsPrompt(params: RealtimeHintsPromptParams) {
  const { content, topic, subject, phase } = params
  const lang = subject === 'chinese' ? '中文' : 'English'

  if (phase === 'word-count') {
    const wordCount = content.replace(/\s/g, '').length
    return {
      system: `你是写作助手，提供简短的字数和进度提示。
返回 JSON 格式：
{
  "hints": ["提示1", "提示2"],
  "wordCount": ${wordCount},
  "targetRange": "800-1000字",
  "progress": "正常|偏慢|偏快"
}`,
      user: `当前字数：${wordCount}字。请给出简短的进度提示。`,
    }
  }

  if (phase === 'logic-check') {
    return {
      system: `你是${subject === 'chinese' ? '语文' : '英语'}写作助手，检查文章的逻辑连贯性。
只给出1-2条最关键的逻辑提示，不要列表轰炸。
返回 JSON 格式：
{
  "hints": ["逻辑提示1", "逻辑提示2"],
  "logicScore": 75,
  "issues": ["问题1"]
}`,
      user: `请检查以下文章片段的逻辑连贯性：

${content}

只给出最重要的1-2条提示。`,
    }
  }

  return {
    system: `你是${subject === 'chinese' ? '语文' : '英语'}写作助手，提供段落级别的写作建议。
只给出1-2条最关键的建议。
返回 JSON 格式：
{
  "hints": ["建议1", "建议2"],
  "paragraphScore": 75,
  "highlights": ["亮点1"]
}`,
    user: `请分析以下段落的写作质量：

${content}

${topic ? `话题：${topic}` : ''}

只给出最重要的1-2条建议。`,
  }
}
