export interface ArgumentationMethod {
  id: string
  name: string
  definition: string
  role: string
  examples: string[]
  recognitionText?: string
  recognitionAnswer?: string
}

export const ARGUMENTATION_METHODS: ArgumentationMethod[] = [
  {
    id: 'am-1',
    name: '举例论证',
    definition: '用具体的事例来证明论点，增强说服力。',
    role: '使抽象的道理具体化，增强文章的说服力和可信度。',
    examples: [
      '司马迁忍辱负重著《史记》，证明了坚持的力量。',
      '袁隆平数十年如一日研究杂交水稻，解决了数亿人的吃饭问题。',
    ],
    recognitionText: '正如爱迪生发明灯泡经历了上千次失败，每一次失败都让他更接近成功。',
    recognitionAnswer: '举例论证——用爱迪生发明灯泡的具体事例来论证坚持的重要性。',
  },
  {
    id: 'am-2',
    name: '道理论证',
    definition: '用经典著作中的精辟见解、名言警句等来证明论点。',
    role: '增强文章的权威性和理论深度。',
    examples: [
      '孔子曰："学而不思则罔，思而不学则殆。"',
      '老子说："千里之行，始于足下。"',
    ],
    recognitionText: '古语有云："不积跬步，无以至千里。"',
    recognitionAnswer: '道理论证——引用古语来论证积累的重要性。',
  },
  {
    id: 'am-3',
    name: '对比论证',
    definition: '把两种对立的事物或道理进行对比，突出其中一个方面。',
    role: '通过对比使论点更加鲜明，增强论证效果。',
    examples: [
      '有的人活着，他已经死了；有的人死了，他还活着。',
      '勤勉者硕果累累，懒惰者一事无成。',
    ],
    recognitionText: '鲁迅弃医从文，以笔为刀唤醒国民；而同时代的一些人却选择明哲保身，沉默不语。',
    recognitionAnswer: '对比论证——将鲁迅与明哲保身者对比，突出勇气和担当。',
  },
  {
    id: 'am-4',
    name: '比喻论证',
    definition: '用打比方的方式来证明论点，使抽象的道理形象化。',
    role: '使深奥的道理浅显易懂，增强文章的生动性。',
    examples: [
      '书籍是人类进步的阶梯。',
      '教育是一棵树摇动另一棵树，一朵云推动另一朵云。',
    ],
    recognitionText: '人生如逆旅，我亦是行人。',
    recognitionAnswer: '比喻论证——将人生比作旅途，形象地说明人生的短暂和行进。',
  },
  {
    id: 'am-5',
    name: '引用论证',
    definition: '引用他人的言论或著作来支持自己的观点。',
    role: '借助权威增强论证的可信度和说服力。',
    examples: [
      '马克思说："在科学上没有平坦的大道，只有不畏劳苦沿着陡峭山路攀登的人，才有希望达到光辉的顶点。"',
      '高尔基说："书籍是人类进步的阶梯。"',
    ],
    recognitionText: '鲁迅曾说："真正的勇士敢于直面惨淡的人生。"',
    recognitionAnswer: '引用论证——引用鲁迅的名言来论证勇气的重要性。',
  },
  {
    id: 'am-6',
    name: '假设论证',
    definition: '通过假设相反或不同的情况，从反面或侧面来论证观点。',
    role: '从反面证明论点的正确性，增强论证的全面性。',
    examples: [
      '如果没有改革开放，中国就不可能取得今天的成就。',
      '如果当初选择放弃，就不会有今天的成功。',
    ],
    recognitionText: '试想，如果没有千千万万革命先烈的牺牲，哪有我们今天的幸福生活？',
    recognitionAnswer: '假设论证——假设没有先烈的牺牲，从反面论证今天的幸福来之不易。',
  },
  {
    id: 'am-7',
    name: '因果论证',
    definition: '通过分析事物的因果关系来证明论点。',
    role: '揭示事物之间的内在联系，使论证更加严密。',
    examples: [
      '因为有了坚持，所以有了成功；因为有了付出，所以有了收获。',
      '正因为他长期刻苦钻研，才取得了如此卓越的成就。',
    ],
    recognitionText: '正是因为无数科研工作者夜以继日的攻关，中国才能在航天领域取得举世瞩目的成就。',
    recognitionAnswer: '因果论证——分析科研工作者的努力与航天成就之间的因果关系。',
  },
]
