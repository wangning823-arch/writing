export interface RhetoricExercise {
  id: string
  type: 'recognition' | 'imitation' | 'application'
  rhetoricType: string
  prompt: string
  originalText?: string
  modelAnswer?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const RHETORIC_EXERCISES: RhetoricExercise[] = [
  {
    id: 'rh-1', type: 'recognition', rhetoricType: '比喻',
    prompt: '请识别以下句子中使用的修辞手法：',
    originalText: '春天像一幅画，色彩斑斓；春天像一首歌，悦耳动听；春天像一个梦，缤纷多彩。',
    difficulty: 'easy',
  },
  {
    id: 'rh-2', type: 'recognition', rhetoricType: '排比',
    prompt: '请识别以下句子中使用的修辞手法：',
    originalText: '人生是一首诗，悠扬动听；人生是一幅画，绚丽多彩；人生是一支歌，激昂澎湃。',
    difficulty: 'easy',
  },
  {
    id: 'rh-3', type: 'imitation', rhetoricType: '比喻',
    prompt: '请仿照"书是人类进步的阶梯"写一个比喻句，用"书是..."开头。',
    modelAnswer: '书是照亮前行道路的明灯。',
    difficulty: 'easy',
  },
  {
    id: 'rh-4', type: 'imitation', rhetoricType: '排比',
    prompt: '请用排比手法写三个句子，主题为"梦想"。',
    modelAnswer: '梦想是黑夜中的灯塔，指引方向；梦想是寒冬中的阳光，温暖心灵；梦想是荒漠中的绿洲，给予希望。',
    difficulty: 'medium',
  },
  {
    id: 'rh-5', type: 'application', rhetoricType: '对比',
    prompt: '请用对比手法写一段话（50字左右），主题为"快与慢"。',
    difficulty: 'medium',
  },
  {
    id: 'rh-6', type: 'recognition', rhetoricType: '拟人',
    prompt: '请识别以下句子中使用的修辞手法：',
    originalText: '小草从土里探出头来，好奇地打量着这个世界。',
    difficulty: 'easy',
  },
  {
    id: 'rh-7', type: 'application', rhetoricType: '引用',
    prompt: '请引用一句古诗词来论证"坚持"的重要性（30字左右）。',
    difficulty: 'medium',
  },
  {
    id: 'rh-8', type: 'imitation', rhetoricType: '反问',
    prompt: '请用反问手法改写以下句子：我们应该珍惜时间。',
    modelAnswer: '难道我们不应该珍惜时间吗？',
    difficulty: 'easy',
  },
  {
    id: 'rh-9', type: 'application', rhetoricType: '比喻',
    prompt: '请用比喻手法描写"母爱"（50字左右）。',
    difficulty: 'medium',
  },
  {
    id: 'rh-10', type: 'recognition', rhetoricType: '设问',
    prompt: '请识别以下句子中使用的修辞手法：',
    originalText: '什么是勇气？勇气就是面对恐惧时依然选择前行。',
    difficulty: 'easy',
  },
]
