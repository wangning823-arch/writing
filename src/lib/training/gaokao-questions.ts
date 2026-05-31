export interface GaokaoQuestion {
  id: string
  year: number
  region: string
  subject: 'chinese' | 'english'
  type: 'material' | 'topic' | 'picture' | 'new材料'
  prompt: string
  material?: string
  requirements: string[]
  theme: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const GAOKAO_QUESTIONS: GaokaoQuestion[] = [
  {
    id: 'gk2024-01',
    year: 2024,
    region: '全国甲卷',
    subject: 'chinese',
    type: 'topic',
    prompt: '每个人都要学习与他人相处。有时，我们为避免冲突而不愿表达自己的想法。其实，坦诚交流才有可能迎来真正的相遇。',
    requirements: ['选准角度，确定立意', '明确文体，自拟标题', '不要套作，不得抄袭', '不少于800字'],
    theme: '人生成长',
    difficulty: 'medium',
  },
  {
    id: 'gk2024-02',
    year: 2024,
    region: '新课标I卷',
    subject: 'chinese',
    type: 'topic',
    prompt: '随着互联网的普及、人工智能的应用，越来越多的问题能很快得到答案。那么，我们的问题是否会越来越少？',
    requirements: ['以上材料引发了你怎样的联想和思考？', '选准角度，确定立意', '明确文体，自拟标题', '不少于800字'],
    theme: '科技创新',
    difficulty: 'hard',
  },
  {
    id: 'gk2024-03',
    year: 2024,
    region: '新课标II卷',
    subject: 'chinese',
    type: 'topic',
    prompt: '本试卷现代文阅读I提到的长久以来，人们只能看到月球固定朝向地球的一面，嫦娥四号探测器着陆月球背面开启了人类首次探索之旅。',
    requirements: ['选准角度，确定立意', '明确文体，自拟标题', '不少于800字'],
    theme: '科技创新',
    difficulty: 'medium',
  },
  {
    id: 'gk2023-01',
    year: 2023,
    region: '全国甲卷',
    subject: 'chinese',
    type: 'topic',
    prompt: '人们因技术发展得以更好地掌控时间，但也有人因此成了时间的仆人。这句话引发了你怎样的联想与思考？',
    requirements: ['选准角度，确定立意', '明确文体，自拟标题', '不少于800字'],
    theme: '科技创新',
    difficulty: 'medium',
  },
  {
    id: 'gk2023-02',
    year: 2023,
    region: '新课标I卷',
    subject: 'chinese',
    type: 'topic',
    prompt: '好的故事，有助于我们更好地表达和沟通。好的故事，可以触动我们的心灵，启迪我们的智慧。好的故事，可以展现一个民族的形象……故事是有力量的。',
    requirements: ['以上材料引发了你怎样的联想和思考？', '选准角度，确定立意', '明确文体，自拟标题', '不少于800字'],
    theme: '传统文化',
    difficulty: 'medium',
  },
  {
    id: 'gk2022-01',
    year: 2022,
    region: '全国甲卷',
    subject: 'chinese',
    type: 'material',
    prompt: '《红楼梦》写到"大观园试才题对额"时有一个情节，为元妃省亲修建的大观园竣工后，众人给园中桥上亭子的匾额题名。',
    material: '有人主张从欧阳修《醉翁亭记》"有亭翼然"一语中取"翼然"二字；有人认为从"泻出于两峰之间"中拈出一个"泻"字；有人则从"酿泉为酒，泉香而酒洌"中取"酿"字……',
    requirements: ['选准角度，确定立意', '明确文体，自拟标题', '不少于800字'],
    theme: '传统文化',
    difficulty: 'hard',
  },
  {
    id: 'gk2022-02',
    year: 2022,
    region: '新高考I卷',
    subject: 'chinese',
    type: 'topic',
    prompt: '围棋中有"本手、妙手、俗手"之说。本手是指合乎棋理的正规下法；妙手是指出人意料的精妙下法；俗手是指貌似合理，而从全局看通常会受损的下法。',
    requirements: ['以上材料对我们颇具启示意义', '选准角度，确定立意', '明确文体，自拟标题', '不少于800字'],
    theme: '哲理思辨',
    difficulty: 'medium',
  },
  {
    id: 'gk2021-01',
    year: 2021,
    region: '全国甲卷',
    subject: 'chinese',
    type: 'topic',
    prompt: '中国共产党走过百年历程。在党团结带领人民进行的伟大斗争中孕育的革命文化和社会主义先进文化，已经深深融入我们的血脉和灵魂。',
    requirements: ['选准角度，确定立意', '明确文体，自拟标题', '不少于800字'],
    theme: '家国情怀',
    difficulty: 'medium',
  },
  {
    id: 'gk2020-01',
    year: 2020,
    region: '全国I卷',
    subject: 'chinese',
    type: 'topic',
    prompt: '春秋时期，齐国的管仲与鲍叔牙。管仲辅佐公子纠，鲍叔牙辅佐公子小白。最终公子小白成为齐桓公，鲍叔牙推荐管仲为相。',
    requirements: ['选准角度，确定立意', '明确文体，自拟标题', '不少于800字'],
    theme: '传统文化',
    difficulty: 'medium',
  },
  {
    id: 'gk2019-01',
    year: 2019,
    region: '全国I卷',
    subject: 'chinese',
    type: 'topic',
    prompt: '民生在勤，勤则不匮。劳动是财富的源泉，也是幸福的源泉。人世间的美好梦想，都是通过劳动实现的；生命里的一切辉煌，都是通过劳动铸就的。',
    requirements: ['选准角度，确定立意', '明确文体，自拟标题', '不少于800字'],
    theme: '劳动实践',
    difficulty: 'easy',
  },
  {
    id: 'gk2018-01',
    year: 2018,
    region: '全国I卷',
    subject: 'chinese',
    type: 'topic',
    prompt: '2000年，农历庚辰龙年，人类迈进新千年，中国千万"世纪宝宝"出生。2008年，汶川地震，北京奥运会……2018年，"世纪宝宝"一代长大成人。',
    requirements: ['选准角度，确定立意', '明确文体，自拟标题', '不少于800字'],
    theme: '社会变迁',
    difficulty: 'medium',
  },
]

export function getGaokaoQuestions(filters?: {
  year?: number
  region?: string
  subject?: 'chinese' | 'english'
  theme?: string
}) {
  return GAOKAO_QUESTIONS.filter(q => {
    if (filters?.year && q.year !== filters.year) return false
    if (filters?.region && q.region !== filters.region) return false
    if (filters?.subject && q.subject !== filters.subject) return false
    if (filters?.theme && q.theme !== filters.theme) return false
    return true
  })
}
