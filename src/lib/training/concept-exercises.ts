export interface ConceptExercise {
  id: string
  subject: 'chinese' | 'english'
  type: 'synonym' | 'definition' | 'relation'
  concepts: string[]
  prompt: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const CONCEPT_EXERCISES: ConceptExercise[] = [
  {
    id: 'ca-1',
    subject: 'chinese',
    type: 'synonym',
    concepts: ['坚持', '固执'],
    prompt: '请辨析"坚持"与"固执"的区别。它们在什么情况下可以互换？什么情况下不能？',
    difficulty: 'easy',
  },
  {
    id: 'ca-2',
    subject: 'chinese',
    type: 'synonym',
    concepts: ['勇气', '鲁莽'],
    prompt: '请辨析"勇气"与"鲁莽"的区别。真正的勇气应该具备哪些要素？',
    difficulty: 'easy',
  },
  {
    id: 'ca-3',
    subject: 'chinese',
    type: 'synonym',
    concepts: ['自信', '自负'],
    prompt: '请辨析"自信"与"自负"的区别。两者之间的界限在哪里？',
    difficulty: 'medium',
  },
  {
    id: 'ca-4',
    subject: 'chinese',
    type: 'definition',
    concepts: ['勇气'],
    prompt: '请用自己的话定义"勇气"。你的定义应该与字典不同，体现你自己的理解。',
    difficulty: 'easy',
  },
  {
    id: 'ca-5',
    subject: 'chinese',
    type: 'definition',
    concepts: ['创新'],
    prompt: '请用自己的话定义"创新"。真正的创新应该具备哪些特征？',
    difficulty: 'medium',
  },
  {
    id: 'ca-6',
    subject: 'chinese',
    type: 'relation',
    concepts: ['知识', '智慧', '能力'],
    prompt: '请分析"知识"、"智慧"和"能力"三者之间的关系。它们是并列关系、包含关系还是递进关系？',
    difficulty: 'medium',
  },
  {
    id: 'ca-7',
    subject: 'chinese',
    type: 'relation',
    concepts: ['自由', '责任', '权利'],
    prompt: '请分析"自由"、"责任"和"权利"三者之间的关系。',
    difficulty: 'hard',
  },
  {
    id: 'ca-8',
    subject: 'chinese',
    type: 'synonym',
    concepts: ['传承', '守旧'],
    prompt: '请辨析"传承"与"守旧"的区别。什么时候"传承"会被误解为"守旧"？',
    difficulty: 'hard',
  },
  {
    id: 'ca-9',
    subject: 'english',
    type: 'synonym',
    concepts: ['confidence', 'arrogance'],
    prompt: 'Distinguish between "confidence" and "arrogance". When does confidence become arrogance?',
    difficulty: 'medium',
  },
  {
    id: 'ca-10',
    subject: 'english',
    type: 'definition',
    concepts: ['courage'],
    prompt: 'Define "courage" in your own words. What are the essential elements of true courage?',
    difficulty: 'easy',
  },
]
