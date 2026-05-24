/**
 * Pre-assessment diagnostic question bank.
 *
 * Covers 5 micro-tasks as defined in CORE_PLAN.md section 2.2:
 *   1. 审题立意 (direction)  - 3 questions per set, pick the best angle
 *   2. 段落排序 (structure)  - 1 question, order 5 paragraphs logically
 *   3. 词汇选择 (vocab)      - 5 questions, choose the best word in context
 *   4. 句式改写 (sentence)   - 3 questions, rewrite simple sentences as complex
 *   5. 找错误   (error)      - 3 questions, identify errors in text
 *
 * Each question has a unique id, task type, options, correct answer, and explanation.
 * Multiple sets are provided so the diagnostic can randomise per student.
 */

import type { DiagnosticTask } from '@/types'

// ─── Question Interface ──────────────────────────────────────────────────────

export interface DiagnosticQuestionBankItem {
  id: string
  task: DiagnosticTask
  /** The question prompt shown to the student. */
  question: string
  /** Multiple-choice options (undefined for text-input tasks). */
  options?: string[]
  /** Index of the correct option (for multiple-choice), or the expected answer text. */
  correctAnswer: number | string
  /** Explanation shown after the student answers. */
  explanation: string
  /** Which set this question belongs to (for randomisation). */
  setId: number
}

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Get a random diagnostic set: 3 direction + 1 structure + 5 vocab + 3 sentence + 3 error = 15 questions.
 * Picks one question from each setId within each task.
 */
export function getRandomDiagnosticSet(): DiagnosticQuestionBankItem[] {
  const result: DiagnosticQuestionBankItem[] = []

  const tasks: { task: DiagnosticTask; count: number }[] = [
    { task: 'direction', count: 3 },
    { task: 'structure', count: 1 },
    { task: 'vocab', count: 5 },
    { task: 'sentence', count: 3 },
    { task: 'error', count: 3 },
  ]

  for (const { task, count } of tasks) {
    const available = DIAGNOSTIC_QUESTIONS.filter((q) => q.task === task)
    const grouped = groupBySetId(available)
    const setIds = Object.keys(grouped).map(Number)

    for (let i = 0; i < count; i++) {
      const setId = setIds[i % setIds.length]
      const pool = grouped[setId]
      const idx = Math.floor(Math.random() * pool.length)
      result.push(pool[idx])
    }
  }

  return result
}

function groupBySetId(
  questions: DiagnosticQuestionBankItem[],
): Record<number, DiagnosticQuestionBankItem[]> {
  const map: Record<number, DiagnosticQuestionBankItem[]> = {}
  for (const q of questions) {
    if (!map[q.setId]) map[q.setId] = []
    map[q.setId].push(q)
  }
  return map
}

// ─── Diagnostic Steps (for UI rendering) ─────────────────────────────────────

export const DIAGNOSTIC_STEPS = [
  {
    id: 1,
    task: 'direction' as DiagnosticTask,
    title: '审题立意',
    description: '阅读材料，选择最佳立意角度',
    timeLimit: 180, // 3 minutes in seconds
    questionCount: 3,
  },
  {
    id: 2,
    task: 'structure' as DiagnosticTask,
    title: '段落排序',
    description: '将5个段落拖拽排列成合理的逻辑顺序',
    timeLimit: 120, // 2 minutes
    questionCount: 1,
  },
  {
    id: 3,
    task: 'vocab' as DiagnosticTask,
    title: '词汇选择',
    description: '在语境中选择最准确的词语',
    timeLimit: 180, // 3 minutes
    questionCount: 5,
  },
  {
    id: 4,
    task: 'sentence' as DiagnosticTask,
    title: '句式改写',
    description: '将简单句改写为高级句式',
    timeLimit: 240, // 4 minutes
    questionCount: 3,
  },
  {
    id: 5,
    task: 'error' as DiagnosticTask,
    title: '找错误',
    description: '找出文段中的语法/逻辑/表达错误',
    timeLimit: 180, // 3 minutes
    questionCount: 3,
  },
]

// ─── Question Bank ───────────────────────────────────────────────────────────

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestionBankItem[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // TASK: 审题立意 (direction) — 3 questions per set, 5 sets
  // ═══════════════════════════════════════════════════════════════════════════

  // --- Set 1 ---
  {
    id: 'dir-1-1',
    task: 'direction',
    setId: 1,
    question:
      '阅读下面的材料，根据要求写作。\n\n"人们常说：走自己的路，让别人说去吧。但也有人说：兼听则明，偏信则暗。"\n\n请综合以上材料，选择最佳立意角度。',
    options: [
      '坚持自我，不受外界干扰',
      '善于倾听他人意见，完善自我判断',
      '在坚持主见与虚心听取之间找到平衡',
      '社会舆论对个人选择的影响',
    ],
    correctAnswer: 2,
    explanation:
      '材料呈现两种看似矛盾的观点，最佳立意应兼顾二者辩证关系，而非只取其一。C选项体现了辩证思维。',
  },
  {
    id: 'dir-1-2',
    task: 'direction',
    setId: 1,
    question:
      '阅读下面的材料，根据要求写作。\n\n"有人说，科技让世界变得更小；也有人说，科技让人与人之间的距离变得更远。"\n\n请综合以上材料，选择最佳立意角度。',
    options: [
      '科技发展带来的负面影响不容忽视',
      '科技是中性的，关键在于人如何使用',
      '科技让世界变小是不可否认的事实',
      '我们应该拥抱科技，享受便利',
    ],
    correctAnswer: 1,
    explanation:
      '两句话分别从利弊角度评价科技，最佳立意应辩证看待科技的双面性，即科技本身是工具，关键在于使用者。',
  },
  {
    id: 'dir-1-3',
    task: 'direction',
    setId: 1,
    question:
      `阅读下面的材料，根据要求写作。\n\n"一位画家说：'我花了三年学画，却花了三十年学不画。' "\n\n请选择最佳立意角度。`,
    options: [
      '学画画比学不画画更难',
      '艺术创作中"留白"比"填满"更需要功力',
      '做事容易，不做反而困难',
      '学习是一个不断积累的过程',
    ],
    correctAnswer: 1,
    explanation:
      '"不画"不是真的不画，而是懂得取舍、留白的境界。这道题考查对隐喻的理解能力。',
  },

  // --- Set 2 ---
  {
    id: 'dir-2-1',
    task: 'direction',
    setId: 2,
    question:
      '阅读下面的材料，根据要求写作。\n\n"一滴水只有放进大海里才永远不会干涸，一个人只有当他把自己和集体事业融合在一起的时候才能最有力量。"\n\n请选择最佳立意角度。',
    options: [
      '个人离不开集体，集体赋予个人力量',
      '大海比水滴更重要',
      '团结就是力量',
      '个人应该服从集体的安排',
    ],
    correctAnswer: 0,
    explanation:
      '材料的核心是"个人与集体的关系"——个人融入集体才能发挥最大价值，而非简单的服从或团结口号。',
  },
  {
    id: 'dir-2-2',
    task: 'direction',
    setId: 2,
    question:
      '阅读下面的材料，根据要求写作。\n\n"有人说，成功需要坚持；也有人说，放弃有时也是一种智慧。"\n\n请选择最佳立意角度。',
    options: [
      '坚持一定能成功',
      '学会放弃比坚持更重要',
      '该坚持时坚持，该放手时放手',
      '成功与失败只在一念之间',
    ],
    correctAnswer: 2,
    explanation:
      '材料呈现两种对立观点，最佳立意需要辩证思考——坚持与放弃都有其价值，关键在于判断时机。',
  },
  {
    id: 'dir-2-3',
    task: 'direction',
    setId: 2,
    question:
      '阅读下面的材料，根据要求写作。\n\n"真正的自由不是随心所欲，而是自我主宰。"\n\n请选择最佳立意角度。',
    options: [
      '自由就是想做什么就做什么',
      '自由意味着不被任何规则约束',
      '真正的自由是理性地约束自己，做自己的主人',
      '自由和纪律是相互矛盾的',
    ],
    correctAnswer: 2,
    explanation:
      '材料明确区分了"随心所欲"和"自我主宰"，核心立意是真正的自由建立在自律之上。',
  },

  // --- Set 3 ---
  {
    id: 'dir-3-1',
    task: 'direction',
    setId: 3,
    question:
      '阅读下面的材料，根据要求写作。\n\n"在这个信息爆炸的时代，我们获取知识变得越来越容易，但深度思考却变得越来越稀缺。"\n\n请选择最佳立意角度。',
    options: [
      '信息时代我们应该减少使用网络',
      '获取知识的方式发生了根本性变化',
      '在便捷获取信息的时代，更需要培养独立思考能力',
      '深度思考只适合少数学术研究者',
    ],
    correctAnswer: 2,
    explanation:
      '材料用"但"字转折，重点在后半句——深度思考的稀缺才是核心议题，需要围绕"如何在信息时代保持深度思考"展开。',
  },
  {
    id: 'dir-3-2',
    task: 'direction',
    setId: 3,
    question:
      '阅读下面的材料，根据要求写作。\n\n"山不向我走来，我便向山走去。"\n\n请选择最佳立意角度。',
    options: [
      '人应该主动追求目标，而非被动等待',
      '爬山是一种很好的锻炼方式',
      '面对困难，换一种方式也能到达目的地',
      '人定胜天，人类可以征服自然',
    ],
    correctAnswer: 0,
    explanation:
      '"山"象征目标或困难，"向山走去"象征主动出击。核心立意是发挥主观能动性。',
  },
  {
    id: 'dir-3-3',
    task: 'direction',
    setId: 3,
    question:
      `阅读下面的材料，根据要求写作。\n\n"有人说：'少年不识愁滋味。'也有人说：'少年也有少年的愁。'"\n\n请选择最佳立意角度。`,
    options: [
      '少年的烦恼不值一提',
      '每个年龄段都有各自的困惑与成长',
      '成年人的烦恼比少年更大',
      '少年时期是人生最美好的阶段',
    ],
    correctAnswer: 1,
    explanation:
      '两种说法看似对立，实则共同指向——每个年龄段都有独特的烦恼，成长的代价是普遍的。',
  },

  // --- Set 4 ---
  {
    id: 'dir-4-1',
    task: 'direction',
    setId: 4,
    question:
      '阅读下面的材料，根据要求写作。\n\n"读万卷书，行万里路。"然而有人说，在互联网时代，足不出户便可知天下事。\n\n请选择最佳立意角度。',
    options: [
      '互联网时代读书已经过时了',
      '亲身实践和间接经验都是获取知识的途径，二者不可偏废',
      '行万里路比读万卷书更重要',
      '网络信息不可信，还是应该读书',
    ],
    correctAnswer: 1,
    explanation:
      '材料将传统学习方式与互联网并提，最佳立意是辩证看待两种获取知识的途径。',
  },
  {
    id: 'dir-4-2',
    task: 'direction',
    setId: 4,
    question:
      '阅读下面的材料，根据要求写作。\n\n"种子不落在肥土而落在瓦砾中，有生命力的种子决不会悲观和叹气，因为有了阻力才有磨炼。"\n\n请选择最佳立意角度。',
    options: [
      '恶劣的环境不利于种子生长',
      '面对逆境，强者将其视为成长的磨炼',
      '种子应该选择肥沃的土壤',
      '大自然的规律不可违背',
    ],
    correctAnswer: 1,
    explanation:
      '材料用种子比喻人，核心是面对逆境的态度——有生命力的人将阻力视为磨炼。',
  },
  {
    id: 'dir-4-3',
    task: 'direction',
    setId: 4,
    question:
      `阅读下面的材料，根据要求写作。\n\n"一位母亲说：'我宁愿我的孩子在跌倒中学会走路，也不愿他永远被我牵着手。'"\n\n请选择最佳立意角度。`,
    options: [
      '母亲的爱是伟大的',
      '适当放手是更深层次的爱与教育智慧',
      '孩子应该尽早独立生活',
      '过度保护会阻碍孩子成长',
    ],
    correctAnswer: 1,
    explanation:
      '材料强调"放手"背后的教育理念——放手不是不爱，而是以另一种方式表达爱和培养能力。',
  },

  // --- Set 5 ---
  {
    id: 'dir-5-1',
    task: 'direction',
    setId: 5,
    question:
      '阅读下面的材料，根据要求写作。\n\n"生活不是等待暴风雨过去，而是学会在雨中跳舞。"\n\n请选择最佳立意角度。',
    options: [
      '暴风雨是生活的一部分',
      '面对困难要保持乐观，主动适应而非被动承受',
      '跳舞可以让人忘记烦恼',
      '天气变化与人的心情有关',
    ],
    correctAnswer: 1,
    explanation:
      '"暴风雨"比喻困难，"在雨中跳舞"比喻积极应对。核心是面对逆境的乐观态度和主动精神。',
  },
  {
    id: 'dir-5-2',
    task: 'direction',
    setId: 5,
    question:
      '阅读下面的材料，根据要求写作。\n\n"你不能左右天气，但可以改变心情。你不能改变容貌，但可以展现笑容。"\n\n请选择最佳立意角度。',
    options: [
      '心情好就能改变天气',
      '外在条件不可控时，应注重内在修养与心态调整',
      '笑容是最好的化妆品',
      '人应该接受自己的外貌',
    ],
    correctAnswer: 1,
    explanation:
      '材料通过两个"不能…但可以…"的句式，强调在不可控因素面前发挥主观能动性。',
  },
  {
    id: 'dir-5-3',
    task: 'direction',
    setId: 5,
    question:
      '阅读下面的材料，根据要求写作。\n\n"有人问一位老人："你这一生最大的遗憾是什么？"老人说："我年轻时想改变世界，后来发现应该先改变自己。"\n\n请选择最佳立意角度。',
    options: [
      '老年人不应该有遗憾',
      '改变世界之前，先从改变自己做起',
      '年轻时不应该有远大理想',
      '人到晚年总会后悔',
    ],
    correctAnswer: 1,
    explanation:
      '材料通过老人的反思揭示——改变自己是改变世界的基础和起点。',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TASK: 段落排序 (structure) — 1 question per set, 5 sets
  // ═══════════════════════════════════════════════════════════════════════════

  // --- Set 1 ---
  {
    id: 'str-1-1',
    task: 'structure',
    setId: 1,
    question: '将以下5个段落排列成一篇合理的议论文（论题：读书的意义）：',
    options: [
      'A：读书使人明智，帮助我们在纷繁复杂的世界中做出正确判断。',
      'B：读书不仅能获取知识，更能塑造一个人的精神世界。',
      'C：古人云"腹有诗书气自华"，读书对人的影响是潜移默化的。',
      'D：在信息碎片化的今天，我们更需要回归深度阅读。',
      'E：综上所述，读书是一种终身受益的习惯，值得我们用心培养。',
    ],
    correctAnswer: 'B → C → A → D → E',
    explanation:
      'B段提出中心论点（读书塑造精神世界）→ C段用古语承接 → A段具体论证读书的益处 → D段联系现实 → E段总结。这是经典的"引论—本论—结论"结构。',
  },

  // --- Set 2 ---
  {
    id: 'str-2-1',
    task: 'structure',
    setId: 2,
    question: '将以下5个段落排列成一篇合理的议论文（论题：挫折的价值）：',
    options: [
      'A：从古至今，凡成大事者无不经历过重重磨难。',
      'B：挫折是人生的必修课，它教会我们坚韧与成长。',
      'C：司马迁受宫刑而著《史记》，贝多芬失聪而谱交响曲，他们都在挫折中创造了辉煌。',
      'D：因此，我们应该以积极的心态面对挫折，将其转化为前进的动力。',
      'E：然而，面对挫折，有人选择退缩，有人选择迎难而上，结果截然不同。',
    ],
    correctAnswer: 'B → E → A → C → D',
    explanation:
      'B段提出论点 → E段转折引出两种态度 → A段用"古往今来"拓展 → C段具体举例论证 → D段总结。逻辑链：论点→对比→史实→结论。',
  },

  // --- Set 3 ---
  {
    id: 'str-3-1',
    task: 'structure',
    setId: 3,
    question: '将以下5个段落排列成一篇合理的议论文（论题：合作与竞争）：',
    options: [
      'A：竞争促使个体不断进步，合作则让集体发挥更大的力量。',
      'B：合作与竞争并非对立，而是相辅相成的关系。',
      'C：没有竞争的合作容易导致懈怠，没有合作的竞争则可能引发恶性竞争。',
      'D：在现代社会，学会在竞争中合作、在合作中竞争，是一种重要的生存智慧。',
      'E：试看当今世界，无论是科研团队还是商业领域，成功者往往是善于平衡二者的团队。',
    ],
    correctAnswer: 'B → A → C → E → D',
    explanation:
      'B段提出核心论点（二者相辅相成）→ A段分别阐释各自价值 → C段反面论证缺一不可 → E段现实例证 → D段升华总结。',
  },

  // --- Set 4 ---
  {
    id: 'str-4-1',
    task: 'structure',
    setId: 4,
    question: '将以下5个段落排列成一篇合理的议论文（论题：慢生活的智慧）：',
    options: [
      'A：然而，"慢"不是懒惰，而是一种有意识的生活选择。',
      'B：在快节奏的现代社会，"慢生活"逐渐成为一种新的生活理念。',
      'C：当然，慢生活并不意味着放弃效率，而是在高效之余保留一份从容。',
      'D：它强调放慢脚步，关注内心的感受和生活的质量。',
      'E：当人们被焦虑和疲惫裹挟时，慢生活恰恰提供了一剂解药。',
    ],
    correctAnswer: 'B → D → E → A → C',
    explanation:
      'B段引入话题 → D段解释慢生活的内涵 → E段阐述其必要性 → A段纠正误解 → C段补充说明。逻辑推进层层递进。',
  },

  // --- Set 5 ---
  {
    id: 'str-5-1',
    task: 'structure',
    setId: 5,
    question: '将以下5个段落排列成一篇合理的议论文（论题：传承与创新）：',
    options: [
      'A：传承是创新的根基，没有传承的创新如无源之水。',
      'B：文化的生命力在于传承与创新的辩证统一。',
      'C：故宫博物院将传统文化与数字技术结合，让古老文物焕发新生，便是最好的例证。',
      'D：只有在传承中注入创新的活力，文化才能历久弥新。',
      'E：然而，一味固守传统而拒绝创新，文化终将走向僵化。',
    ],
    correctAnswer: 'B → A → E → D → C',
    explanation:
      'B段总论点 → A段正面论述传承的重要性 → E段转折论述创新的必要性 → D段综合二者关系 → C段举例论证。先分后合，论据有力。',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TASK: 词汇选择 (vocab) — 5 questions per set, 5 sets
  // ═══════════════════════════════════════════════════════════════════════════

  // --- Set 1 ---
  {
    id: 'vocab-1-1',
    task: 'vocab',
    setId: 1,
    question: '选择最恰当的词语填入横线处。\n\n面对困难，他没有退缩，而是以______的态度迎难而上。',
    options: ['勇敢', '英勇', '义无反顾', '无所畏惧'],
    correctAnswer: 3,
    explanation:
      '"无所畏惧"强调内心的无畏，与"没有退缩"形成对应，比"勇敢"更有力度，比"义无反顾"更适合形容面对困难的态度。',
  },
  {
    id: 'vocab-1-2',
    task: 'vocab',
    setId: 1,
    question: '选择最恰当的词语填入横线处。\n\n他的演讲______了在场的每一个人，掌声经久不息。',
    options: ['感动', '打动', '震撼', '触碰'],
    correctAnswer: 2,
    explanation:
      '"震撼"强调心灵的强烈冲击，与"掌声经久不息"的程度匹配。"打动"程度不够，"感动"偏柔和，"触碰"不搭配。',
  },
  {
    id: 'vocab-1-3',
    task: 'vocab',
    setId: 1,
    question: '选择最恰当的词语填入横线处。\n\n这座城市在现代化进程中，依然______着深厚的历史文化底蕴。',
    options: ['保留', '保存', '蕴藏', '蕴含'],
    correctAnswer: 3,
    explanation:
      '"蕴含"指包含在内且有深度，常与"文化底蕴"搭配。"保留"偏表面，"保存"偏具体物件，"蕴藏"常用于矿藏。',
  },
  {
    id: 'vocab-1-4',
    task: 'vocab',
    setId: 1,
    question: '选择最恰当的词语填入横线处。\n\n这个观点看似______，实则经不起推敲。',
    options: ['合理', '无懈可击', '天衣无缝', '完美'],
    correctAnswer: 1,
    explanation:
      '"无懈可击"形容没有破绽，与"经不起推敲"形成转折，说明表面看似无破绽但实际有漏洞。"天衣无缝"侧重自然，不如"无懈可击"贴切。',
  },
  {
    id: 'vocab-1-5',
    task: 'vocab',
    setId: 1,
    question: '选择最恰当的词语填入横线处。\n\n秋天的故宫，红墙黄瓦在夕阳下______出一种庄严而温暖的美。',
    options: ['展现', '显现', '焕发', '折射'],
    correctAnswer: 2,
    explanation:
      '"焕发"指光彩四射、精神旺盛，常用于形容光彩或气质。与"庄严而温暖的美"搭配最为恰当，有生机勃勃之感。',
  },

  // --- Set 2 ---
  {
    id: 'vocab-2-1',
    task: 'vocab',
    setId: 2,
    question: '选择最恰当的词语填入横线处。\n\n科技的发展给人们的生活带来了______的便利。',
    options: ['巨大', '极大', '莫大', '重大'],
    correctAnswer: 1,
    explanation:
      '"极大"修饰"便利"最为常见和自然。"巨大"多修饰具体事物，"莫大"带有感情色彩但不够日常，"重大"修饰事件。',
  },
  {
    id: 'vocab-2-2',
    task: 'vocab',
    setId: 2,
    question: '选择最恰当的词语填入横线处。\n\n鲁迅先生的文章______犀利，直指社会的痛点。',
    options: ['语言', '文笔', '措辞', '笔锋'],
    correctAnswer: 3,
    explanation:
      '"笔锋"形容文章的锋芒和锐利，与"犀利"和"直指痛点"形成语义呼应，形象生动。',
  },
  {
    id: 'vocab-2-3',
    task: 'vocab',
    setId: 2,
    question: '选择最恰当的词语填入横线处。\n\n面对突如其来的灾难，人们展现出了______的生命力。',
    options: ['旺盛', '蓬勃', '顽强', '强大'],
    correctAnswer: 2,
    explanation:
      '"顽强"强调在逆境中不屈不挠，与"突如其来"的灾难语境最为契合，体现了抗争精神。',
  },
  {
    id: 'vocab-2-4',
    task: 'vocab',
    setId: 2,
    question: '选择最恰当的词语填入横线处。\n\n在历史的长河中，许多伟大的思想都曾被______，但最终都焕发出了光芒。',
    options: ['埋没', '遗忘', '忽略', '淹没'],
    correctAnswer: 0,
    explanation:
      '"埋没"指才华或思想被压制不为人知，与"焕发光芒"形成前后对比，隐含"金子终会发光"的意味。',
  },
  {
    id: 'vocab-2-5',
    task: 'vocab',
    setId: 2,
    question: '选择最恰当的词语填入横线处。\n\n老师的话虽然______，却让我受益终生。',
    options: ['简单', '朴素', '简洁', '平淡'],
    correctAnswer: 1,
    explanation:
      '"朴素"指朴实无华，与"受益终生"形成转折——语言虽朴实但含义深刻。比"简单"更有褒义，比"平淡"更有温度。',
  },

  // --- Set 3 ---
  {
    id: 'vocab-3-1',
    task: 'vocab',
    setId: 3,
    question: '选择最恰当的词语填入横线处。\n\n互联网让信息的传播变得______，人们可以随时随地获取资讯。',
    options: ['迅速', '快速', '便捷', '广泛'],
    correctAnswer: 2,
    explanation:
      '"便捷"同时涵盖了方便和快捷两层含义，与"随时随地"呼应，强调获取信息的容易程度。',
  },
  {
    id: 'vocab-3-2',
    task: 'vocab',
    setId: 3,
    question: '选择最恰当的词语填入横线处。\n\n这部纪录片______了偏远山区孩子们的真实生活，引起了社会的广泛关注。',
    options: ['记录', '反映', '呈现', '揭示'],
    correctAnswer: 2,
    explanation:
      '"呈现"有展示、展现之意，比"记录"更有画面感，比"揭示"更客观中立，与纪录片的功能最为匹配。',
  },
  {
    id: 'vocab-3-3',
    task: 'vocab',
    setId: 3,
    question: '选择最恰当的词语填入横线处。\n\n真正的友谊经得起时间的______，越是在困难时刻越能显出珍贵。',
    options: ['考验', '检验', '历练', '磨练'],
    correctAnswer: 0,
    explanation:
      '"考验"侧重在特定情境下的检验，与"困难时刻"语境吻合。"检验"偏科学验证，"历练"侧重经历过程。',
  },
  {
    id: 'vocab-3-4',
    task: 'vocab',
    setId: 3,
    question: '选择最恰当的词语填入横线处。\n\n这座城市的绿化做得很好，街道两旁______着茂密的梧桐树。',
    options: ['种植', '排列', '矗立', '矗立'],
    correctAnswer: 1,
    explanation:
      '"排列"暗示整齐有序，描绘街道两旁树木整齐排列的景象，比"种植"更有画面感。',
  },
  {
    id: 'vocab-3-5',
    task: 'vocab',
    setId: 3,
    question: '选择最恰当的词语填入横线处。\n\n面对质疑，他始终保持______，用事实证明了自己的清白。',
    options: ['安静', '冷静', '沉着', '沉默'],
    correctAnswer: 1,
    explanation:
      '"冷静"强调在压力下保持理性思考，与"用事实证明"呼应，体现理智应对的态度。',
  },

  // --- Set 4 ---
  {
    id: 'vocab-4-1',
    task: 'vocab',
    setId: 4,
    question: '选择最恰当的词语填入横线处。\n\n传统文化需要在______中寻求发展，在创新中焕发活力。',
    options: ['传承', '继承', '沿袭', '延续'],
    correctAnswer: 0,
    explanation:
      '"传承"既有传也有承，含有主动传递和发扬的意味，比"继承"更有活力，与后文"创新"形成最佳搭配。',
  },
  {
    id: 'vocab-4-2',
    task: 'vocab',
    setId: 4,
    question: '选择最恰当的词语填入横线处。\n\n这篇文章的观点______，论证严密，令人信服。',
    options: ['鲜明', '明显', '明确', '清晰'],
    correctAnswer: 0,
    explanation:
      '"鲜明"形容观点立场清晰、态度明确，是议论文写作中的高频搭配词，与"论证严密"并列。',
  },
  {
    id: 'vocab-4-3',
    task: 'vocab',
    setId: 4,
    question: '选择最恰当的词语填入横线处。\n\n他的事迹______了无数年轻人投身公益事业。',
    options: ['鼓励', '激励', '鼓舞', '激发'],
    correctAnswer: 1,
    explanation:
      '"激励"强调通过榜样或精神力量推动他人行动，与"事迹"搭配最为恰当，比"鼓励"更有深度。',
  },
  {
    id: 'vocab-4-4',
    task: 'vocab',
    setId: 4,
    question: '选择最恰当的词语填入横线处。\n\n城市的建设不能只追求速度，更要注重品质，做到______发展。',
    options: ['快速', '高速', '均衡', '协调'],
    correctAnswer: 2,
    explanation:
      '"均衡"强调各方面的平衡发展，与"不能只追求速度"形成对比，暗含全面发展之意。',
  },
  {
    id: 'vocab-4-5',
    task: 'vocab',
    setId: 4,
    question: '选择最恰当的词语填入横线处。\n\n读完这本书，我对人生有了更______的思考。',
    options: ['深刻', '深入', '深远', '深沉'],
    correctAnswer: 0,
    explanation:
      '"深刻"形容思考有深度、触及本质，是"思考"最常见的搭配，语气自然恰当。',
  },

  // --- Set 5 ---
  {
    id: 'vocab-5-1',
    task: 'vocab',
    setId: 5,
    question: '选择最恰当的词语填入横线处。\n\n这位科学家一生______于科学研究，为国家做出了巨大贡献。',
    options: ['投入', '投身', '致力于', '沉浸'],
    correctAnswer: 2,
    explanation:
      '"致力于"是正式用语，表示把精力投入到某项事业中，与"一生"和"科学研究"的庄重语境匹配。',
  },
  {
    id: 'vocab-5-2',
    task: 'vocab',
    setId: 5,
    question: '选择最恰当的词语填入横线处。\n\n大自然的鬼斧神工，______出一幅令人叹为观止的画卷。',
    options: ['创造', '打造', '勾勒', '绘就'],
    correctAnswer: 3,
    explanation:
      '"绘就"本意是画出，用于比喻大自然创作美景，形象生动，比"创造"更富诗意，与"画卷"呼应。',
  },
  {
    id: 'vocab-5-3',
    task: 'vocab',
    setId: 5,
    question: '选择最恰当的词语填入横线处。\n\n教育的______在于培养学生的独立思考能力，而非简单灌输知识。',
    options: ['核心', '中心', '关键', '重点'],
    correctAnswer: 0,
    explanation:
      '"核心"指事物最本质、最重要的部分，与"在于"搭配表达教育的本质目的，比其他选项更有力度。',
  },
  {
    id: 'vocab-5-4',
    task: 'vocab',
    setId: 5,
    question: '选择最恰当的词语填入横线处。\n\n这座城市的历史文化遗产______丰富，值得我们用心保护。',
    options: ['数量', '资源', '底蕴', '积淀'],
    correctAnswer: 3,
    explanation:
      '"积淀"指长期积累沉淀下来的文化或历史，带有时间厚度感，与"历史文化遗产"搭配最为贴切。',
  },
  {
    id: 'vocab-5-5',
    task: 'vocab',
    setId: 5,
    question: '选择最恰当的词语填入横线处。\n\n面对失败，他没有______，而是总结经验，重新出发。',
    options: ['放弃', '气馁', '沮丧', '消沉'],
    correctAnswer: 1,
    explanation:
      '"气馁"指因挫折而丧失信心和勇气，与"没有"搭配后表示不放弃希望，与"重新出发"形成呼应。',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TASK: 句式改写 (sentence) — 3 questions per set, 5 sets
  // ═══════════════════════════════════════════════════════════════════════════

  // --- Set 1 ---
  {
    id: 'sent-1-1',
    task: 'sentence',
    setId: 1,
    question:
      '将以下简单句改写为含倒装结构的高级句式：\n\n"我们很少见到如此壮观的景象。"',
    options: [
      '如此壮观的景象，我们很少见到。',
      'Rarely have we seen such a spectacular sight.',
      '我们几乎不曾见到过如此壮观的景象。',
      'Such a spectacular sight is rarely seen by us.',
    ],
    correctAnswer: 1,
    explanation:
      '以Rarely开头的倒装句是高考常见句式，将否定副词置于句首引起部分倒装，结构为"Rarely + have/has + 主语 + 过去分词"。',
  },
  {
    id: 'sent-1-2',
    task: 'sentence',
    setId: 1,
    question:
      '将以下简单句改写为含强调句结构的高级句式：\n\n"是老师的鼓励让他重新振作。"',
    options: [
      '老师的鼓励让他重新振作。',
      '是老师的鼓励让他重新振作起来的。',
      'It was the teacher\'s encouragement that made him pull himself together.',
      'The teacher\'s encouragement was what made him pull himself together.',
    ],
    correctAnswer: 2,
    explanation:
      'It is/was...that...强调句型是高考重点，去掉It is/was和that后句子仍然完整。此句强调"老师的鼓励"。',
  },
  {
    id: 'sent-1-3',
    task: 'sentence',
    setId: 1,
    question:
      '将以下简单句改写为含分词结构的高级句式：\n\n"他走进教室，发现同学们都在认真听讲。"',
    options: [
      '走进教室，他发现同学们都在认真听讲。',
      'When he walked into the classroom, he found his classmates listening attentively.',
      'Walking into the classroom, he found his classmates listening attentively.',
      'Having walked into the classroom, and finding his classmates listening attentively.',
    ],
    correctAnswer: 2,
    explanation:
      '现在分词作状语，表示伴随或时间。Walking与主语he构成主动关系，同时found后的listening构成宾补结构，一句中包含两个非谓语，句式高级。',
  },

  // --- Set 2 ---
  {
    id: 'sent-2-1',
    task: 'sentence',
    setId: 2,
    question:
      '将以下简单句改写为含虚拟语气的高级句式：\n\n"如果当初我更努力一些，结果会不同。"',
    options: [
      '如果当初更努力，结果就会不同。',
      'Had I worked harder, the result would have been different.',
      'If I had worked harder, the result would be different.',
      'Working harder would have changed the result.',
    ],
    correctAnswer: 1,
    explanation:
      '对过去的虚拟条件句用过去完成时+would have done。将Had提前可省略if构成倒装虚拟句，是高考加分句式。',
  },
  {
    id: 'sent-2-2',
    task: 'sentence',
    setId: 2,
    question:
      '将以下简单句改写为含倒装结构的高级句式：\n\n"只有通过不断努力，我们才能实现梦想。"',
    options: [
      '我们只有通过不断努力才能实现梦想。',
      'Only through continuous efforts can we achieve our dreams.',
      'We can achieve our dreams only through continuous efforts.',
      'Only when we work hard can we achieve our dreams.',
    ],
    correctAnswer: 1,
    explanation:
      'Only + 状语置于句首引起部分倒装。注意Only修饰介词短语through continuous efforts时直接倒装，不需要时间状语从句。',
  },
  {
    id: 'sent-2-3',
    task: 'sentence',
    setId: 2,
    question:
      '将以下简单句改写为含分词结构的高级句式：\n\n"这本书写得很好，它被翻译成了多种语言。"',
    options: [
      '这本书写得好，被翻译成多种语言。',
      'Well written, the book has been translated into multiple languages.',
      'The book was well written, and it has been translated into multiple languages.',
      'Being well written, the book has been translated into multiple languages.',
    ],
    correctAnswer: 1,
    explanation:
      '过去分词短语作原因状语，Well written = Because it was well written。过去分词表示被动，与主语the book构成被动关系。',
  },

  // --- Set 3 ---
  {
    id: 'sent-3-1',
    task: 'sentence',
    setId: 3,
    question:
      '将以下简单句改写为含强调句结构的高级句式：\n\n"正是在这种环境下，他培养了坚韧的品格。"',
    options: [
      '在这种环境下，他培养了坚韧的品格。',
      'It was in this environment that he developed a resilient character.',
      'In this environment, he developed a resilient character.',
      'This environment was where he developed a resilient character.',
    ],
    correctAnswer: 1,
    explanation:
      '强调句型It was...that...强调地点状语"in this environment"。去掉It was和that后，句子"In this environment he developed a resilient character"仍然完整。',
  },
  {
    id: 'sent-3-2',
    task: 'sentence',
    setId: 3,
    question:
      '将以下简单句改写为含虚拟语气的高级句式：\n\n"要是没有你的帮助，我不可能完成这个项目。"',
    options: [
      '没有你的帮助，我不可能完成这个项目。',
      'Without your help, I couldn\'t have finished the project.',
      'If there were no your help, I couldn\'t finish the project.',
      'But for your help, I wouldn\'t be able to finish the project.',
    ],
    correctAnswer: 1,
    explanation:
      '含蓄虚拟条件句：without + 名词 = if it had not been for...，表示与过去事实相反，主句用could/would have done。',
  },
  {
    id: 'sent-3-3',
    task: 'sentence',
    setId: 3,
    question:
      '将以下简单句改写为含分词结构的高级句式：\n\n"看到那美丽的风景，游客们都停下了脚步。"',
    options: [
      '游客们看到美丽的风景后停下了脚步。',
      'Seeing the beautiful scenery, all the tourists stopped to take photos.',
      'The tourists saw the beautiful scenery and stopped to take photos.',
      'Having seen the beautiful scenery, the tourists were stopping.',
    ],
    correctAnswer: 1,
    explanation:
      '现在分词Seeing作时间/原因状语，表示主动。主语the tourists与seeing是主动关系。注意stopped to take photos表示停下来去做某事。',
  },

  // --- Set 4 ---
  {
    id: 'sent-4-1',
    task: 'sentence',
    setId: 4,
    question:
      '将以下简单句改写为含倒装结构的高级句式：\n\n"他的贡献如此之大，以至于没有人能忘记。"',
    options: [
      '他的贡献如此之大，没有人能忘记。',
      'So great were his contributions that no one could ever forget them.',
      'His contributions were so great that no one could ever forget them.',
      'Such great contributions did he make that no one could forget them.',
    ],
    correctAnswer: 1,
    explanation:
      'So + adj.置于句首引起部分倒装。So great were his contributions...是将表语前置的倒装句，比正常语序更有力。',
  },
  {
    id: 'sent-4-2',
    task: 'sentence',
    setId: 4,
    question:
      '将以下简单句改写为含强调句结构的高级句式：\n\n"是那次经历改变了我对生活的看法。"',
    options: [
      '那次经历改变了我对生活的看法。',
      'It was that experience that changed my view of life.',
      'That experience was what changed my view of life.',
      'My view of life was changed by that experience.',
    ],
    correctAnswer: 1,
    explanation:
      '标准的It was...that...强调句型，强调主语"that experience"。去掉强调结构后"that experience changed my view of life"句子完整。',
  },
  {
    id: 'sent-4-3',
    task: 'sentence',
    setId: 4,
    question:
      '将以下简单句改写为含虚拟语气的高级句式：\n\n"如果没有改革开放，中国不会取得今天的成就。"',
    options: [
      '没有改革开放，中国不会取得今天的成就。',
      'Were it not for the reform and opening-up, China would not have achieved what it has today.',
      'If it were not for the reform and opening-up, China would not achieve today\'s achievement.',
      'Without the reform, China couldn\'t achieve today\'s achievement.',
    ],
    correctAnswer: 0,
    explanation:
      'Were it not for... = If it were not for...是对现在/一般事实的虚拟，主句用would not have achieved表示对已完成事实的虚拟。此选项用词最精确。',
  },

  // --- Set 5 ---
  {
    id: 'sent-5-1',
    task: 'sentence',
    setId: 5,
    question:
      '将以下简单句改写为含倒装+分词结构的高级句式：\n\n"坐在窗边的那位老人正在读一本旧书。"',
    options: [
      '那位坐在窗边的老人正在读一本旧书。',
      'Seated by the window was an old man reading an old book.',
      'An old man sat by the window reading an old book.',
      'There was an old man sitting by the window, reading an old book.',
    ],
    correctAnswer: 1,
    explanation:
      '完全倒装+过去分词+现在分词的复合句式。Seated = Sitting（过去分词作表语），整句是"表语+系动词+主语"的倒装结构，后接reading作伴随状语。',
  },
  {
    id: 'sent-5-2',
    task: 'sentence',
    setId: 5,
    question:
      '将以下简单句改写为含强调+倒装混合结构的高级句式：\n\n"直到失去健康，人们才意识到它的可贵。"',
    options: [
      '人们直到失去健康才意识到它的可贵。',
      'Not until they lose their health do people realize its value.',
      'It is not until they lose their health that people realize its value.',
      'People don\'t realize the value of health until they lose it.',
    ],
    correctAnswer: 1,
    explanation:
      'Not until...引起的倒装句，not until置于句首，主句用部分倒装。与C选项（强调句型）相比，倒装句更加简洁有力，是高考常考句式。',
  },
  {
    id: 'sent-5-3',
    task: 'sentence',
    setId: 5,
    question:
      '将以下简单句改写为含分词+定语从句嵌套的高级句式：\n\n"这位科学家获得了诺贝尔奖，他的研究改变了我们对宇宙的认识。"',
    options: [
      '这位获得诺贝尔奖的科学家，他的研究改变了我们对宇宙的认识。',
      'The scientist, whose research changed our understanding of the universe, was awarded the Nobel Prize.',
      'The scientist who won the Nobel Prize, his research changed our understanding of the universe.',
      'Having won the Nobel Prize, the scientist\'s research changed our understanding of the universe.',
    ],
    correctAnswer: 1,
    explanation:
      '非限制性定语从句whose research...修饰the scientist，同时主句使用被动语态was awarded。句式紧凑、逻辑清晰，避免了碎片化表达。',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TASK: 找错误 (error) — 3 questions per set, 5 sets
  // ═══════════════════════════════════════════════════════════════════════════

  // --- Set 1 ---
  {
    id: 'err-1-1',
    task: 'error',
    setId: 1,
    question: '找出以下文段中的错误并选择正确选项：\n\n"通过这次活动，使我们认识到了团队合作的重要性。"',
    options: [
      '"通过"和"使"不能同时使用，去掉其中一个',
      '"认识"应改为"意识"',
      '"团队合作"应改为"合作精神"',
      '这个句子没有错误',
    ],
    correctAnswer: 0,
    explanation:
      '"通过…使…"是典型的主语残缺错误。"通过"让活动成为状语，"使"让"我们"成为宾语，导致全句没有主语。应去掉"通过"或"使"。',
  },
  {
    id: 'err-1-2',
    task: 'error',
    setId: 1,
    question: '找出以下文段中的错误并选择正确选项：\n\n"这本书的内容和形式都很丰富。"',
    options: [
      '"内容和形式"应改为"内容和排版"',
      '"丰富"只能搭配"内容"，不能搭配"形式"',
      '"都很丰富"应改为"都很出色"',
      '这个句子没有错误',
    ],
    correctAnswer: 1,
    explanation:
      '搭配不当。"丰富"可以形容内容，但"形式"通常用"新颖""独特"来形容，不能用"丰富"。可以改为"内容丰富，形式新颖"。',
  },
  {
    id: 'err-1-3',
    task: 'error',
    setId: 1,
    question: '找出以下文段中的错误并选择正确选项：\n\n"为了避免今后不再发生类似的错误，我们必须加强管理。"',
    options: [
      '"今后"应改为"以后"',
      '"避免…不再…"是双重否定，意思变成了"要发生类似错误"',
      '"必须"应改为"应该"',
      '这个句子没有错误',
    ],
    correctAnswer: 1,
    explanation:
      '逻辑错误（否定不当）。"避免"已经含有否定意味，再加上"不再"变成双重否定，意思反而变成"要发生类似的错误"。应去掉"不再"。',
  },

  // --- Set 2 ---
  {
    id: 'err-2-1',
    task: 'error',
    setId: 2,
    question: '找出以下文段中的错误并选择正确选项：\n\n"我国的航天事业正在以惊人的速度发展着，取得了举世瞩目的成就。"',
    options: [
      '"举世瞩目"应改为"举世闻名"',
      '"正在"和"着"语义重复，去掉其一',
      '"惊人的速度"应改为"快速"',
      '这个句子没有错误',
    ],
    correctAnswer: 1,
    explanation:
      '语义重复。"正在"表示动作正在进行，"着"也表示持续状态，二者同时使用属于重复表达。应去掉"着"。',
  },
  {
    id: 'err-2-2',
    task: 'error',
    setId: 2,
    question: '找出以下文段中的错误并选择正确选项：\n\n"他不但学习成绩优秀，而且品德高尚，深受老师和同学们的喜爱。"',
    options: [
      '"不但…而且…"应改为"既…又…"',
      '"同学们"前面的"和"应改为"以及"',
      '"深受…喜爱"应改为"深受…欢迎"',
      '这个句子没有错误',
    ],
    correctAnswer: 3,
    explanation:
      '这个句子语法正确，逻辑通顺。"不但…而且…"表示递进关系，使用恰当。"深受…喜爱"搭配正确。',
  },
  {
    id: 'err-2-3',
    task: 'error',
    setId: 2,
    question: '找出以下文段中的错误并选择正确选项：\n\n"同学们的学习态度有了很大的改善。"',
    options: [
      '"态度"和"改善"搭配不当，应改为"学习态度有了很大的转变"',
      '"很大的"应改为"较大的"',
      '"同学们"应改为"学生们的"',
      '这个句子没有错误',
    ],
    correctAnswer: 0,
    explanation:
      '搭配不当。"态度"不能用"改善"来形容，"改善"常搭配"条件""环境""生活"等。应改为"转变"或"提高"。',
  },

  // --- Set 3 ---
  {
    id: 'err-3-1',
    task: 'error',
    setId: 3,
    question: '找出以下文段中的错误并选择正确选项：\n\n"经过反复思考，他终于做出了慎重而又正确的决定。这个决定不仅影响了他自己，也影响了他的家人。"',
    options: [
      '"慎重"和"正确"语序应互换',
      '"又"应改为"且"',
      '"不仅…也…"应改为"不但…而且…"',
      '这个句子没有错误',
    ],
    correctAnswer: 3,
    explanation:
      '这个句子语法正确，逻辑通顺。"慎重而又正确"是并列形容词修饰"决定"，"不仅…也…"表示递进，使用恰当。',
  },
  {
    id: 'err-3-2',
    task: 'error',
    setId: 3,
    question: '找出以下文段中的错误并选择正确选项：\n\n"学校组织了一次有意义的活动，同学们纷纷报名参加，积极性十分踊跃。"',
    options: [
      '"积极性"和"踊跃"搭配不当，应改为"积极性很高"或"报名十分踊跃"',
      '"纷纷"应改为"积极"',
      '"一次"应改为"一场"',
      '这个句子没有错误',
    ],
    correctAnswer: 0,
    explanation:
      '搭配不当。"积极性"是一个抽象名词，不能用"踊跃"形容。可以说"积极性很高"或"报名踊跃"，但不能说"积极性踊跃"。',
  },
  {
    id: 'err-3-3',
    task: 'error',
    setId: 3,
    question: '找出以下文段中的错误并选择正确选项：\n\n"据统计，目前我国网民数量已达6亿多。"',
    options: [
      '"已达"和"多"矛盾，应改为"已达6亿"或"6亿多"',
      '"网民数量"应改为"网民人数"',
      '"目前"应改为"现在"',
      '这个句子没有错误',
    ],
    correctAnswer: 0,
    explanation:
      '语义矛盾。"已达"表示达到某个精确数字，"多"表示超过某个数字，二者矛盾。应改为"已达6亿"或"有6亿多"。',
  },

  // --- Set 4 ---
  {
    id: 'err-4-1',
    task: 'error',
    setId: 4,
    question: '找出以下文段中的错误并选择正确选项：\n\n"他的写作水平明显改进了。"',
    options: [
      '"写作水平"应改为"写作能力"',
      '"明显"应改为"显著"',
      '"改进"应改为"提高"，"水平"与"提高"搭配',
      '这个句子没有错误',
    ],
    correctAnswer: 2,
    explanation:
      '搭配不当。"水平"通常与"提高""上升"搭配，不与"改进"搭配。"改进"常搭配"方法""技术""工作"等。',
  },
  {
    id: 'err-4-2',
    task: 'error',
    setId: 4,
    question: '找出以下文段中的错误并选择正确选项：\n\n"在这次比赛中，他获得了第一名，我们都为他感到很光荣。"',
    options: [
      '"光荣"应改为"骄傲"或"自豪"',
      '"第一名"应改为"冠军"',
      '"我们"应改为"大家"',
      '这个句子没有错误',
    ],
    correctAnswer: 0,
    explanation:
      '用词不当。"光荣"通常指因做某事而获得荣誉，多用于被动或宏观语境。为自己或他人感到高兴应使用"骄傲"或"自豪"。',
  },
  {
    id: 'err-4-3',
    task: 'error',
    setId: 4,
    question: '找出以下文段中的错误并选择正确选项：\n\n"这篇文章的中心思想十分丰富。"',
    options: [
      '"中心思想"应改为"内容"',
      '"十分"应改为"非常"',
      '"丰富"应改为"深刻"，中心思想可以用"深刻"来形容',
      '这个句子没有错误',
    ],
    correctAnswer: 2,
    explanation:
      '搭配不当。"中心思想"是指文章的核心论点或主旨，只能说"明确""深刻"，不能说"丰富"。"内容"才可以用"丰富"形容。',
  },

  // --- Set 5 ---
  {
    id: 'err-5-1',
    task: 'error',
    setId: 5,
    question: '找出以下文段中的错误并选择正确选项：\n\n"春天来了，公园里的花都开了，有红色的、黄色的、白色的，五颜六色，美丽极了。"',
    options: [
      '"有红色的、黄色的、白色的"与"五颜六色"语义重复',
      '"美丽极了"应改为"非常美丽"',
      '"春天来了"应改为"春季来临"',
      '这个句子没有错误',
    ],
    correctAnswer: 0,
    explanation:
      '语义重复。前面已经具体列举了"红色的、黄色的、白色的"，后面又说"五颜六色"，信息重复。可删去"五颜六色"或删去前面的列举。',
  },
  {
    id: 'err-5-2',
    task: 'error',
    setId: 5,
    question: '找出以下文段中的错误并选择正确选项：\n\n"为了防止此类事故不再发生，我们采取了一系列安全措施。"',
    options: [
      '"不再"应改为"继续"',
      '"防止…不再…"构成双重否定，意思变成"要让此类事故继续发生"',
      '"采取"应改为"制定"',
      '这个句子没有错误',
    ],
    correctAnswer: 1,
    explanation:
      '逻辑错误（否定不当）。"防止"已含否定意味，再加上"不再"变成双重否定，意思变成"要让此类事故再次发生"。应去掉"不再"。',
  },
  {
    id: 'err-5-3',
    task: 'error',
    setId: 5,
    question: '找出以下文段中的错误并选择正确选项：\n\n"老师经常激励我们要树立远大的理想和目标。"',
    options: [
      '"激励"应改为"鼓励"',
      '"远大的"应改为"崇高的"',
      '"理想"和"目标"语义重复，"树立远大理想"即可',
      '这个句子没有错误',
    ],
    correctAnswer: 2,
    explanation:
      '语义重复。"理想"和"目标"在语境中含义高度重叠，"树立远大的理想"已经完整表达意思，再加"和目标"显得赘余。',
  },
]
