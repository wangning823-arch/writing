/**
 * Exam strategy data and logic for timed writing simulations.
 * Defines recommended time allocations and tips for Chinese and English exams.
 */

export interface ExamStage {
  name: string
  duration: number // minutes
  percentage: number
  tips: string[]
}

export interface ExamStrategy {
  subject: 'chinese' | 'english'
  totalTime: number // minutes
  stages: ExamStage[]
  generalTips: string[]
}

export const CHINESE_EXAM_STRATEGY: ExamStrategy = {
  subject: 'chinese',
  totalTime: 60,
  stages: [
    {
      name: '审题立意',
      duration: 5,
      percentage: 8.3,
      tips: [
        '仔细阅读题目，圈出关键词和限制词',
        '明确题目要求：议论文？记叙文？读后感？',
        '确定中心论点，用一句话概括',
        '思考论点的深度和新颖性，避免陈词滥调',
      ],
    },
    {
      name: '提纲编写',
      duration: 10,
      percentage: 16.7,
      tips: [
        '确定文章结构：五段式或六段式',
        '为每段写一句话的功能说明',
        '规划论据：事实论据+道理论据',
        '设计开头和结尾的切入点',
        '检查各段逻辑衔接是否自然',
      ],
    },
    {
      name: '正文写作',
      duration: 40,
      percentage: 66.7,
      tips: [
        '开头简洁有力，快速切入论点',
        '论证段遵循"观点→论据→分析"的结构',
        '注意段间过渡，使用衔接词',
        '控制字数，确保不少于800字',
        '语言要有文采，适当使用修辞手法',
      ],
    },
    {
      name: '检查修改',
      duration: 5,
      percentage: 8.3,
      tips: [
        '检查错别字和标点符号',
        '核实是否有跑题或偏题',
        '检查字数是否达标',
        '修改不通顺的句子',
      ],
    },
  ],
  generalTips: [
    '审题是关键，花足够时间理解题目',
    '提纲能帮你节省大量写作时间',
    '写作时不要回头修改，先完成再优化',
    '结尾要升华，从个人上升到群体或时代',
    '卷面整洁也是得分因素',
  ],
}

export const ENGLISH_EXAM_STRATEGY: ExamStrategy = {
  subject: 'english',
  totalTime: 35,
  stages: [
    {
      name: '审题立意',
      duration: 3,
      percentage: 8.6,
      tips: [
        '明确写作类型：书信、演讲、读后续写等',
        '圈出题目中的关键词和要求',
        '确定核心观点或写作方向',
        '规划好格式要求',
      ],
    },
    {
      name: '提纲编写',
      duration: 5,
      percentage: 14.3,
      tips: [
        '确定段落结构（PEEL结构）',
        '列出每段的主题句',
        '准备2-3个支撑论据',
        '设计过渡句和连接词',
      ],
    },
    {
      name: '正文写作',
      duration: 25,
      percentage: 71.4,
      tips: [
        '使用高级句式：倒装、强调、分词结构',
        '注意时态和语态的一致性',
        '适当使用过渡词保持连贯',
        '控制词数在120-150词之间',
        '应用文注意格式规范',
      ],
    },
    {
      name: '检查修改',
      duration: 2,
      percentage: 5.7,
      tips: [
        '检查主谓一致和时态错误',
        '核实拼写和标点',
        '确认格式是否正确',
        '检查词数是否符合要求',
      ],
    },
  ],
  generalTips: [
    '英语作文时间紧张，审题要快而准',
    '提纲帮助理清思路，避免跑题',
    '高级词汇和句式能提升档次',
    '注意书信格式：称呼、正文、落款',
    '检查语法错误是最容易提分的地方',
  ],
}

/**
 * Get exam strategy for a given subject.
 * Returns stricter timing adjustments for 高三 students.
 */
export function getExamStrategy(
  subject: 'chinese' | 'english',
  grade?: string,
): ExamStrategy {
  const base = subject === 'chinese' ? CHINESE_EXAM_STRATEGY : ENGLISH_EXAM_STRATEGY

  // 高三 students get stricter timing: reduce writing time, increase review
  if (grade === '高三') {
    const adjusted = JSON.parse(JSON.stringify(base)) as ExamStrategy
    // Reduce writing by 5 min, add to review
    const writingStage = adjusted.stages.find((s) => s.name === '正文写作')
    const reviewStage = adjusted.stages.find((s) => s.name === '检查修改')
    if (writingStage && reviewStage) {
      writingStage.duration -= 5
      writingStage.percentage = (writingStage.duration / adjusted.totalTime) * 100
      reviewStage.duration += 5
      reviewStage.percentage = (reviewStage.duration / adjusted.totalTime) * 100
      reviewStage.tips.push('高三要求更严格的检查：重点检查论证逻辑和语言精准度')
    }
    return adjusted
  }

  return base
}
