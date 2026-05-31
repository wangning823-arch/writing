/**
 * Progress scoring system.
 *
 * When a student revises and resubmits, this module:
 * 1. Compares original and revised text (diff)
 * 2. Re-evaluates focusing on whether previous issues were fixed
 * 3. Calculates an improvement score
 *
 * This implements the "修改闭环" from CORE_PLAN.md section 11.1.
 */

import { complete } from '@/lib/ai/client'

export interface ProgressResult {
  originalScore: number
  newScore: number
  improvement: number
  resolvedSuggestions: string[] // IDs of suggestions that were addressed
  unresolvedSuggestions: string[] // IDs still not fixed
  newIssues: string[] // new problems introduced
  feedback: string
}

/**
 * Build a revision-review prompt that sees both versions and knows
 * what feedback was given. The AI evaluates whether each suggestion
 * was addressed and scores the improvement.
 */
function buildRevisionReviewPrompt(
  subject: 'chinese' | 'english',
  level: number,
  originalContent: string,
  revisedContent: string,
  previousFeedback: string,
): { system: string; user: string } {
  const lang = subject === 'chinese' ? '中文' : '中文'
  const levelContext =
    subject === 'chinese'
      ? getChineseLevelContext(level)
      : getEnglishLevelContext(level)

  const system = `你是一位资深${subject === 'chinese' ? '语文' : '英语'}教师，正在评估学生的修改稿。

## 你的任务
你之前给学生提出了修改建议。现在学生提交了修改稿，你需要：
1. 逐条检查之前的建议是否被解决
2. 发现修改过程中是否引入了新问题
3. 给出进步分（相对于上次的提升幅度）

## 评审原则
1. **公平评估**：如果学生改对了，要明确肯定。如果没改到位，要具体说明差在哪里。
2. **关注进步**：进步分 = 新分数 - 原始分数，可以为负（改了但改差了）。
3. **不要重复之前的完整反馈**，只聚焦在修改相关的评价上。

## ${levelContext}

## 输出格式
请严格按以下JSON格式输出，不要添加任何额外文字或markdown代码块标记：
{
  "originalScore": 原始分数(数字),
  "newScore": 新分数(0-100的数字),
  "improvement": 新分数减去原始分数的差值(数字，可为负),
  "resolvedSuggestions": [
    "之前建议1的简述 - 已解决",
    "之前建议2的简述 - 已解决"
  ],
  "unresolvedSuggestions": [
    "之前建议3的简述 - 仍未解决，原因"
  ],
  "newIssues": [
    "修改过程中引入的新问题1"
  ],
  "feedback": "修改评价（${lang}，2-3句话，总结进步和仍需改进的方面）"
}`

  const user = `## 之前的评审反馈
${previousFeedback}

## 原始版本
${originalContent}

## 修改版本
${revisedContent}

## 请你评估
1. 之前指出的每个问题，学生是否解决了？
2. 修改过程中是否引入了新问题？
3. 整体进步了多少？`

  return { system, user }
}

function getChineseLevelContext(level: number): string {
  const contexts: Record<number, string> = {
    1: '本层级训练目标：审题立意。评估重点：立意是否准确、有深度、有创新性。',
    2: '本层级训练目标：段落功能卡。评估重点：段落逻辑是否通顺、功能是否清晰。',
    3: '本层级训练目标：开头段。评估重点：是否引人入胜、是否点明论点。',
    4: '本层级训练目标：论证段。评估重点：论点-论据-分析闭环是否完整。',
    5: '本层级训练目标：过渡段。评估重点：段间衔接是否自然、逻辑是否推进。',
    6: '本层级训练目标：结尾段。评估重点：升华质量、呼应开头、感染力。',
    7: '本层级训练目标：全文写作。评估重点：内容、结构、语言、规范四维度综合。',
  }
  return contexts[level] || contexts[7]
}

function getEnglishLevelContext(level: number): string {
  const contexts: Record<number, string> = {
    1: '本层级训练目标：句式仿写。评估重点：语法准确性和句式模式运用。',
    2: '本层级训练目标：段落骨架。评估重点：PEEL结构完整性。',
    3: '本层级训练目标：应用文格式。评估重点：格式正确性和内容完整性。',
    4: '本层级训练目标：读后续写开头。评估重点：与原文的连贯性和风格一致性。',
    5: '本层级训练目标：语法纠错。评估重点：错误识别准确性和修正正确性。',
    6: '本层级训练目标：全文写作。评估重点：内容、组织、语言、规范四维度综合。',
  }
  return contexts[level] || contexts[6]
}

/**
 * Calculate progress between an original submission and a revision.
 *
 * Calls the AI with a special "revision review" prompt that:
 * - Sees both versions
 * - Knows what feedback was given
 * - Evaluates whether each suggestion was addressed
 * - Scores the improvement
 */
export async function calculateProgress(
  subject: 'chinese' | 'english',
  level: number,
  originalContent: string,
  revisedContent: string,
  previousFeedback: string,
): Promise<ProgressResult> {
  const { system, user } = buildRevisionReviewPrompt(
    subject,
    level,
    originalContent,
    revisedContent,
    previousFeedback,
  )

  const { text } = await complete(user, { system, maxTokens: 4096, model: process.env.MIMO_FAST_MODEL })

  // Parse the AI response
  let jsonStr = text.trim()
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  }

  const parsed = JSON.parse(jsonStr)

  return {
    originalScore: Number(parsed.originalScore) || 0,
    newScore: Number(parsed.newScore) || 0,
    improvement: Number(parsed.improvement) || 0,
    resolvedSuggestions: Array.isArray(parsed.resolvedSuggestions)
      ? parsed.resolvedSuggestions
      : [],
    unresolvedSuggestions: Array.isArray(parsed.unresolvedSuggestions)
      ? parsed.unresolvedSuggestions
      : [],
    newIssues: Array.isArray(parsed.newIssues) ? parsed.newIssues : [],
    feedback: String(parsed.feedback) || '',
  }
}
