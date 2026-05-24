/**
 * Scoring rubrics for Chinese and English writing training.
 * Displayed to students before they begin a training level so they understand
 * the evaluation criteria.
 */

export interface RubricDimension {
  name: string
  description: string
  excellent: string  // description for high score
  poor: string      // description for low score
}

export interface Rubric {
  subject: 'chinese' | 'english'
  genre: string
  dimensions: RubricDimension[]
  levels: Array<{
    name: string
    scoreRange: string
    description: string
  }>
}

export const CHINESE_ARGUMENTATIVE_RUBRIC: Rubric = {
  subject: 'chinese',
  genre: '议论文',
  dimensions: [
    { name: '立意', description: '核心论点的深度和角度', excellent: '深刻独到，有思辨', poor: '偏题或离题' },
    { name: '结构', description: '段落安排和逻辑推进', excellent: '精巧严谨，详略得当', poor: '结构混乱' },
    { name: '论证', description: '论据选择和分析深度', excellent: '论据典型，分析透彻', poor: '论据不当，缺乏分析' },
    { name: '语言', description: '表达质量和文采', excellent: '有文采，有个性', poor: '不通顺' },
  ],
  levels: [
    { name: '一类卷', scoreRange: '54-60', description: '深刻独到，有思辨' },
    { name: '二类卷', scoreRange: '42-53', description: '正确明确，完整清晰' },
    { name: '三类卷', scoreRange: '30-41', description: '基本正确，略有偏颇' },
    { name: '四类卷', scoreRange: '30以下', description: '偏题或离题' },
  ],
}

export const ENGLISH_ESSAY_RUBRIC: Rubric = {
  subject: 'english',
  genre: '应用文/议论文',
  dimensions: [
    { name: '内容', description: '观点明确，内容充实', excellent: '内容充实，观点明确', poor: '内容不完整' },
    { name: '结构', description: '段落衔接和逻辑', excellent: '结构清晰，衔接自然', poor: '结构混乱' },
    { name: '语言', description: '句式多样性和词汇', excellent: '句式多样，用词准确', poor: '错误较多' },
    { name: '规范', description: '语法和格式', excellent: '格式正确，无语法错误', poor: '格式错误' },
  ],
  levels: [
    { name: '优秀', scoreRange: '22-25', description: '内容充实，句式多样' },
    { name: '良好', scoreRange: '18-21', description: '内容较充实' },
    { name: '一般', scoreRange: '13-17', description: '内容基本完整' },
    { name: '较差', scoreRange: '12以下', description: '内容不完整' },
  ],
}

export function getRubric(subject: 'chinese' | 'english'): Rubric {
  return subject === 'chinese' ? CHINESE_ARGUMENTATIVE_RUBRIC : ENGLISH_ESSAY_RUBRIC
}
