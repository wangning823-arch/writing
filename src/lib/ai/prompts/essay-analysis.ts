/**
 * Prompt for multi-dimensional model essay analysis.
 * Analyzes WHY a model essay is good and what students should learn from it.
 */

function buildAnalysisJsonSpec(): string {
  return `
## 输出要求
请严格按以下JSON格式输出，不要添加任何额外文字或markdown代码块标记：
{
  "contentAnalysis": {
    "theme": "立意概括（一两句话总结文章核心主题）",
    "depth": "深度分析（分析立意的深度和独到之处）",
    "relevance": "切题程度（分析文章如何紧扣题目要求）",
    "examples": ["体现立意的原文片段1", "体现立意的原文片段2"]
  },
  "structureAnalysis": {
    "overview": "结构总览（描述文章的整体结构布局）",
    "strengths": ["结构优点1", "结构优点2"],
    "flow": "段落衔接分析（分析段落之间的过渡和逻辑连接）"
  },
  "languageAnalysis": {
    "style": "语言风格概述（描述文章的语言特色）",
    "highlights": ["语言亮点1（附原文引用）", "语言亮点2（附原文引用）"],
    "techniques": ["修辞手法1", "表达手法2"]
  },
  "techniqueAnalysis": {
    "techniques": [
      {
        "name": "技巧名称",
        "explanation": "为什么这个技巧用得好",
        "example": "原文中的具体体现"
      }
    ]
  },
  "takeaways": [
    {
      "category": "内容|结构|语言|技巧",
      "point": "具体值得学习的要点",
      "howToApply": "如何在自己的写作中应用"
    }
  ],
  "summary": "总结性评价（2-3句话，概括这篇范文最值得学习的地方）"
}`;
}

export function getEssayAnalysisPrompt(
  subject: 'chinese' | 'english',
  title: string,
  content: string,
  techniques?: string[],
): { system: string; user: string } {
  const system = `你是一位经验丰富的高中${subject === 'chinese' ? '语文' : '英语'}教师，擅长分析优秀作文。
你的任务是深入分析一篇范文，从多个维度解释它为什么写得好，以及学生可以从中学到什么。

分析维度：
1. 内容立意：主题是否深刻、独到，是否紧扣题目
2. 结构布局：段落安排是否合理，逻辑是否清晰
3. 语言表达：用词是否精准，句式是否多样，是否有文采
4. 写作技巧：使用了哪些写作技巧，效果如何
5. 值得借鉴：学生可以在自己的写作中学到什么

注意事项：
- 分析要具体，引用原文片段作为例证
- 语言要通俗易懂，适合高中生阅读
- 重点解释"为什么好"和"怎么学"，而不是简单地说"写得好"
- 所有分析内容使用中文输出`

  const user = `请分析以下范文：

【标题】${title}
【学科】${subject === 'chinese' ? '语文' : '英语'}
${techniques && techniques.length > 0 ? `【已知技巧标签】${techniques.join('、')}` : ''}

【正文】
${content}

${buildAnalysisJsonSpec()}`

  return { system, user }
}
