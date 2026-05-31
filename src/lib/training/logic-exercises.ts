export interface LogicExercise {
  id: string
  subject: 'chinese' | 'english'
  type: 'causal-chain' | 'analogy' | 'fallacy-identification'
  prompt: string
  context?: string
  options?: string[]
  correctAnswer?: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const LOGIC_EXERCISES: LogicExercise[] = [
  {
    id: 'lr-1',
    subject: 'chinese',
    type: 'fallacy-identification',
    prompt: '请识别以下论证中的逻辑谬误：',
    context: '"小明这次考试没考好，说明他学习不努力。"',
    options: ['偷换概念', '以偏概全', '因果倒置', '循环论证'],
    correctAnswer: 1,
    explanation: '一次考试没考好不能说明学习不努力，可能有其他原因（身体不好、题目难度大等）。这是以偏概全的谬误。',
    difficulty: 'easy',
  },
  {
    id: 'lr-2',
    subject: 'chinese',
    type: 'fallacy-identification',
    prompt: '请识别以下论证中的逻辑谬误：',
    context: '"如果不支持我的观点，你就是反对科技进步。"',
    options: ['非黑即白', '滑坡谬误', '偷换概念', '诉诸权威'],
    correctAnswer: 0,
    explanation: '不支持某个观点不等于反对科技进步，这是将复杂问题简化为两个极端的"非黑即白"谬误。',
    difficulty: 'medium',
  },
  {
    id: 'lr-3',
    subject: 'chinese',
    type: 'causal-chain',
    prompt: '请分析以下因果链：读书多 → 知识丰富 → 视野开阔 → 思维深刻。请补全这个因果链中缺失的环节，并解释每一步的逻辑关系。',
    explanation: '每个环节之间存在逻辑递进关系，读书是获取知识的途径，知识积累拓宽视野，视野开阔促进思维深度。',
    difficulty: 'medium',
  },
  {
    id: 'lr-4',
    subject: 'chinese',
    type: 'analogy',
    prompt: '请用"磨刀不误砍柴工"这个比喻，类比到学习中的一个道理，并说明两者的相似之处。',
    explanation: '磨刀是准备工作，看似花费时间，实际上提高了后续工作的效率。类比学习中的预习和复习，虽然占用时间，但能提高学习效率。',
    difficulty: 'easy',
  },
  {
    id: 'lr-5',
    subject: 'chinese',
    type: 'fallacy-identification',
    prompt: '请识别以下论证中的逻辑谬误：',
    context: '"大家都这么做，所以这么做一定是对的。"',
    options: ['诉诸大众', '诉诸权威', '人身攻击', '偷换概念'],
    correctAnswer: 0,
    explanation: '不能因为大多数人这么做就认为是对的，这是"诉诸大众"的谬误。',
    difficulty: 'easy',
  },
  {
    id: 'lr-6',
    subject: 'chinese',
    type: 'causal-chain',
    prompt: '请分析以下因果链：科技发展 → 产业升级 → 就业结构变化 → 教育改革。请补充每一步之间的因果关系。',
    explanation: '科技发展推动产业升级，产业升级改变就业需求，就业变化倒逼教育改革以培养新人才。',
    difficulty: 'hard',
  },
  {
    id: 'lr-7',
    subject: 'chinese',
    type: 'analogy',
    prompt: '请将"教育"类比为一种自然现象，写出类比论证（100字左右）。',
    explanation: '教育如同春雨润物，虽无声无息却滋养万物成长。',
    difficulty: 'medium',
  },
  {
    id: 'lr-8',
    subject: 'chinese',
    type: 'fallacy-identification',
    prompt: '请识别以下论证中的逻辑谬误：',
    context: '"如果你不支持环保，那你就是不爱地球。"',
    options: ['非黑即白', '以偏概全', '因果倒置', '循环论证'],
    correctAnswer: 0,
    explanation: '不支持某种环保措施不等于不爱地球，这是将复杂问题简化为两个极端的"非黑即白"谬误。',
    difficulty: 'medium',
  },
  {
    id: 'lr-9',
    subject: 'english',
    type: 'fallacy-identification',
    prompt: 'Identify the logical fallacy:',
    context: '"Dr. Smith, a famous physicist, says this political policy is correct, so it must be right."',
    options: ['Appeal to authority', 'Straw man', 'Slippery slope', 'False dilemma'],
    correctAnswer: 0,
    explanation: 'A physicist is not an authority on political policy. This is an appeal to an irrelevant authority.',
    difficulty: 'medium',
  },
  {
    id: 'lr-10',
    subject: 'english',
    type: 'analogy',
    prompt: 'Use the analogy "Rome was not built in a day" to argue for the importance of patience in learning. Write 100 words.',
    explanation: 'Great achievements require time and sustained effort, just as Rome took centuries to build.',
    difficulty: 'easy',
  },
]
