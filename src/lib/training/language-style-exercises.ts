export interface LanguageStyleExercise {
  id: string
  subject: 'chinese' | 'english'
  type: 'identification' | 'imitation' | 'analysis'
  prompt: string
  originalText?: string
  targetStyle?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const LANGUAGE_STYLE_EXERCISES: LanguageStyleExercise[] = [
  {
    id: 'ls-01',
    subject: 'chinese',
    type: 'identification',
    prompt: '请分析以下段落的语言风格特征：',
    originalText: '月光如流水一般，静静地泻在这一片叶子和花上。薄薄的青雾浮起在荷塘里。叶子和花仿佛在牛乳中洗过一样；又像笼着轻纱的梦。',
    difficulty: 'easy',
  },
  {
    id: 'ls-02',
    subject: 'chinese',
    type: 'imitation',
    prompt: '模仿以下段落的语言风格，写一段描写校园秋景的文字：',
    originalText: '秋天，无论在什么地方的秋天，总是好的；可是啊，北国的秋，却特别地来得清，来得静，来得悲凉。',
    difficulty: 'medium',
  },
  {
    id: 'ls-03',
    subject: 'chinese',
    type: 'analysis',
    prompt: '比较以下两段文字的语言风格差异，分析各自的表达效果：',
    originalText: 'A: 盼望着，盼望着，东风来了，春天的脚步近了。\nB: 春天来了，万物复苏，大地一片生机勃勃的景象。',
    difficulty: 'medium',
  },
  {
    id: 'ls-04',
    subject: 'english',
    type: 'identification',
    prompt: 'Analyze the language style of the following passage:',
    originalText: 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.',
    difficulty: 'easy',
  },
  {
    id: 'ls-05',
    subject: 'english',
    type: 'imitation',
    prompt: 'Write a paragraph about technology using a formal academic style:',
    originalText: 'Technology has revolutionized the way we communicate, transforming distant interactions into instantaneous connections.',
    difficulty: 'medium',
  },
]
