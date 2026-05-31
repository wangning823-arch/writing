export interface DialecticalExercise {
  id: string
  topic: string
  subject: 'chinese' | 'english'
  type: 'pro-con' | 'concession-rebuttal'
  prompt: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const DIALECTICAL_EXERCISES: DialecticalExercise[] = [
  {
    id: 'dc-1',
    topic: '科技与生活',
    subject: 'chinese',
    type: 'pro-con',
    prompt: '有人说"科技让生活更美好"，也有人说"科技让人更孤独"。请分别写出支持这两个观点的论证（各100字左右）。',
    difficulty: 'medium',
  },
  {
    id: 'dc-2',
    topic: '快与慢',
    subject: 'chinese',
    type: 'pro-con',
    prompt: '当今社会，"快"成为一种常态——快餐、快车、快递、快节奏。但也有人说，慢下来才能看见更多风景。请分别论证"快"和"慢"的价值。',
    difficulty: 'easy',
  },
  {
    id: 'dc-3',
    topic: '竞争与合作',
    subject: 'chinese',
    type: 'concession-rebuttal',
    prompt: '请用"诚然...但是..."的结构，写一段关于"竞争与合作"关系的辩证分析（150字左右）。',
    difficulty: 'medium',
  },
  {
    id: 'dc-4',
    topic: '传统与创新',
    subject: 'chinese',
    type: 'pro-con',
    prompt: '有人说"传统文化是创新的根基"，也有人说"传统文化是创新的束缚"。请分别论证这两个观点。',
    difficulty: 'hard',
  },
  {
    id: 'dc-5',
    topic: '个人与集体',
    subject: 'chinese',
    type: 'concession-rebuttal',
    prompt: '请用"诚然...但是..."的结构，写一段关于"个人价值与集体利益"关系的辩证分析（150字左右）。',
    difficulty: 'medium',
  },
  {
    id: 'dc-6',
    topic: '顺境与逆境',
    subject: 'chinese',
    type: 'pro-con',
    prompt: '有人说"顺境出人才"，有人说"逆境出人才"。请分别论证这两个观点，并说明你更认同哪一个。',
    difficulty: 'easy',
  },
  {
    id: 'dc-7',
    topic: '规则与自由',
    subject: 'chinese',
    type: 'concession-rebuttal',
    prompt: '请用"诚然...但是..."的结构，写一段关于"规则与自由"关系的辩证分析（150字左右）。',
    difficulty: 'hard',
  },
  {
    id: 'dc-8',
    topic: '科技与人文',
    subject: 'english',
    type: 'pro-con',
    prompt: 'Some say "technology makes us more connected," while others say "technology makes us more isolated." Write arguments for both views (100 words each).',
    difficulty: 'medium',
  },
  {
    id: 'dc-9',
    topic: 'Individual vs Community',
    subject: 'english',
    type: 'concession-rebuttal',
    prompt: 'Write a paragraph using "Admittedly... However..." structure about the relationship between individual freedom and social responsibility (150 words).',
    difficulty: 'medium',
  },
  {
    id: 'dc-10',
    topic: 'Success and Failure',
    subject: 'english',
    type: 'pro-con',
    prompt: 'Some say "success builds confidence," others say "failure builds character." Write arguments for both views.',
    difficulty: 'easy',
  },
]
