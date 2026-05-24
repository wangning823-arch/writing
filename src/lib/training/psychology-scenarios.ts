export interface PsychologyScenario {
  id: string
  title: string
  description: string
  strategy: string
  strategySteps: string[]
  practicePrompt: string
  practiceOptions: { text: string; isCorrect: boolean; explanation: string }[]
}

export const PSYCHOLOGY_SCENARIOS: PsychologyScenario[] = [
  {
    id: 'unclear-topic',
    title: '审题抓不住核心',
    description: '拿到题目后，反复读了几遍，仍然无法确定题目的核心要求和写作方向。时间在流逝，心中越来越焦虑。',
    strategy: '先写能确定的部分，回头再审',
    strategySteps: [
      '不要死磕题目中的模糊部分，先标记出来',
      '找出题目中你能确定的关键词和要求',
      '围绕确定的部分开始列提纲或写开头',
      '写到后面时，往往会对题目有更深的理解',
      '最后回头审视并调整不确定的部分',
    ],
    practicePrompt: '作文题目是"那一次，我选择了____"，你需要半命题填空。你对填什么犹豫不决，但知道要写一件"选择"的事。你会怎么做？',
    practiceOptions: [
      { text: '花5分钟想最完美的填空，想好了再动笔', isCorrect: false, explanation: '审题时间过长会压缩写作时间，导致后面的论证段落草率收尾。' },
      { text: '先确定一个大致方向，开始列提纲，在写作过程中完善', isCorrect: true, explanation: '先行动起来，在过程中逐步明确方向，是考试中更高效的做法。' },
      { text: '跳过半命题，直接写议论文', isCorrect: false, explanation: '跑题或写错文体是严重的扣分项，应该尊重题目的基本要求。' },
      { text: '等到最后5分钟再随便填一个', isCorrect: false, explanation: '仓促填空容易导致整篇文章结构松散，无法形成有效的叙事。' },
    ],
  },
  {
    id: 'stuck-midway',
    title: '写到一半卡住',
    description: '已经写了两段，突然发现思路中断，不知道下一段该写什么。反复思考同一个段落，时间一分一秒地过去。',
    strategy: '跳过卡壳处，先写后面，最后补',
    strategySteps: [
      '标记卡壳的位置，不要在这里浪费时间',
      '先跳到你最有把握的部分（如结尾或另一个论证段）',
      '写完其他段落后，回过头来填补空白',
      '有时候，写完后面的内容后，思路会自然接上',
      '保持整体结构完整比每个段落完美更重要',
    ],
    practicePrompt: '你在写议论文，论点是"坚持的力量"。写了开头和第一个论据后，第二个论据想不出来。考试还剩40分钟。你怎么办？',
    practiceOptions: [
      { text: '继续想第二个论据，直到想出来为止', isCorrect: false, explanation: '在考试中死磕一个点会导致时间严重不足，可能连结尾都写不完。' },
      { text: '跳过第二个论据，先写第三个论据和结尾，回头再补第二个', isCorrect: true, explanation: '跳过卡壳处，先确保文章结构完整，是最明智的时间管理策略。' },
      { text: '删掉已写的内容，重新开始', isCorrect: false, explanation: '推倒重来会浪费大量时间和精力，在考试中几乎不可能完成。' },
      { text: '写一个简短的过渡段，然后直接写结尾', isCorrect: false, explanation: '虽然跳过了问题，但文章缺少足够的论证，会影响整体得分。' },
    ],
  },
  {
    id: 'time-running-out',
    title: '时间只剩10分钟',
    description: '距离考试结束只剩10分钟，你的作文只写了一半，还差最后一个论证段和结尾。',
    strategy: '快速写结尾，确保结构完整',
    strategySteps: [
      '立刻停止纠结细节，转向结尾部分',
      '用1-2句话快速概括最后一个论证点',
      '写一个简洁但完整的结尾段',
      '结构完整但略短的文章，比写了大半但没结尾的文章得分更高',
      '宁可写得简洁，也不要让文章"烂尾"',
    ],
    practicePrompt: '考试还剩10分钟，你的议论文已经写了开头和两个论证段，但第三个论证段和结尾还没写。你最合理的做法是什么？',
    practiceOptions: [
      { text: '快速写一个简短的第三论证段，然后写结尾', isCorrect: true, explanation: '在有限时间内兼顾论证和结构完整性，是最优策略。' },
      { text: '只写结尾，不再补充论证', isCorrect: false, explanation: '虽然保证了结构，但缺少论证会让文章显得单薄。' },
      { text: '继续详细写第三个论证段，放弃结尾', isCorrect: false, explanation: '没有结尾的文章结构不完整，会严重影响印象分。' },
      { text: '仔细检查前面的内容，确保没有错误', isCorrect: false, explanation: '在时间紧迫时，补全结构比检查细节更重要。' },
    ],
  },
  {
    id: 'off-topic',
    title: '发现跑题了',
    description: '写到第三段时突然意识到，自己的文章偏离了题目要求。已经写了大半，心情很沮丧。',
    strategy: '不要重写，调整后续段落方向',
    strategySteps: [
      '冷静下来，不要慌张或自责',
      '快速评估偏离的程度——是完全跑题还是略有偏移',
      '不要删掉已写的内容，那会浪费大量时间',
      '调整后续段落的方向，尽量向题目靠拢',
      '在结尾段巧妙地回应题目，弥补偏移',
    ],
    practicePrompt: '题目要求写"科技改变生活"，但你写成了"科技的利与弊"。已经写了三段。你怎么办？',
    practiceOptions: [
      { text: '删除前面的内容，重新围绕"改变生活"来写', isCorrect: false, explanation: '删除重写会浪费大量时间，在考试中几乎不可能完成一篇完整的文章。' },
      { text: '在后续段落中侧重写科技带来的"改变"，结尾点题', isCorrect: true, explanation: '通过调整后续内容的方向并巧妙点题，可以在不浪费时间的情况下挽回偏移。' },
      { text: '继续按"利与弊"的思路写完', isCorrect: false, explanation: '完全无视题目要求会导致严重跑题扣分。' },
      { text: '用删减号把偏移的部分标记出来，重新写', isCorrect: false, explanation: '在卷面上大规模涂改会影响卷面整洁，且浪费时间。' },
    ],
  },
  {
    id: 'nervous',
    title: '考场紧张',
    description: '坐在考场里，心跳加速，手心出汗，看着空白的作文纸，大脑一片空白，什么也写不出来。',
    strategy: '深呼吸，先写最熟悉的部分',
    strategySteps: [
      '做3-5次深呼吸，让身体放松下来',
      '不要从头开始写，先写你最有把握的部分',
      '可以从结尾或某个论证段开始',
      '写了几句话后，紧张感会自然缓解',
      '最后再补写开头和其他部分',
    ],
    practicePrompt: '你坐在考场里，距离开考还有2分钟。题目是一篇议论文。你感到非常紧张，手在发抖。你应该做什么？',
    practiceOptions: [
      { text: '闭上眼睛，做几次深呼吸，等心情平静再开始', isCorrect: true, explanation: '深呼吸是最简单有效的放松方法，能快速降低焦虑水平，帮助恢复思考能力。' },
      { text: '立刻开始疯狂写，不管写什么', isCorrect: false, explanation: '在紧张状态下盲目动笔容易导致思路混乱，写出来的东西质量很低。' },
      { text: '看周围同学的进度，给自己打气', isCorrect: false, explanation: '比较他人的进度会加重焦虑，应该专注于自己的状态调整。' },
      { text: '跟老师说自己身体不舒服', isCorrect: false, explanation: '轻微的紧张是正常的，不需要寻求外部帮助，应该学会自我调节。' },
    ],
  },
  {
    id: 'empty-head',
    title: '无话可说',
    description: '审完题后，脑子里只有一个模糊的想法，不知道如何展开，找不到足够的论据和素材来支撑文章。',
    strategy: '用"是什么-为什么-怎么办"框架展开',
    strategySteps: [
      '先明确题目核心概念"是什么"',
      '思考"为什么"这个话题重要或有意义',
      '再想"怎么办"——提出建议或展望',
      '从个人、社会、历史三个层面找素材',
      '用具体事例填充框架，避免空泛议论',
    ],
    practicePrompt: '题目是"诚信"，你能想到"做人要诚信"，但不知道怎么展开写800字。你会用什么方法打开思路？',
    practiceOptions: [
      { text: '用"是什么-为什么-怎么办"的框架逐步展开', isCorrect: true, explanation: '这是最经典的议论文展开方法，能帮你从多个角度深入论述一个话题。' },
      { text: '上网搜一些关于诚信的故事', isCorrect: false, explanation: '考试中无法上网搜索，平时训练应该培养自己调用已有知识储备的能力。' },
      { text: '随便写一些名人名言凑字数', isCorrect: false, explanation: '没有逻辑支撑的名言堆砌会让文章显得空洞，阅卷老师一眼就能看穿。' },
      { text: '把题目翻译成英文再翻译回来', isCorrect: false, explanation: '这种方法对打开思路没有帮助，反而浪费时间。' },
    ],
  },
  {
    id: 'similar-arguments',
    title: '论据雷同',
    description: '发现自己写的几个论证段用的例子太相似，都是同一个类型的事例，缺乏多样性和说服力。',
    strategy: '从不同维度找论据：时间、领域、正反',
    strategySteps: [
      '检查现有论据的时间跨度——是否都是古代或都是现代',
      '检查领域覆盖——是否都是同一领域的人物',
      '补充一个反面论据或对比论证',
      '加入一个现实生活中的具体事例',
      '确保每个论据都有独立的分析和小结',
    ],
    practicePrompt: '你在写"勤奋"这个话题，已经用了爱迪生和居里夫人的例子。第三个论据你觉得还应该用谁？',
    practiceOptions: [
      { text: '再用一个科学家的例子，比如牛顿', isCorrect: false, explanation: '三个都是科学家，论据类型太单一，缺乏多样性和说服力。' },
      { text: '用一个反面例子，比如方仲永，形成对比', isCorrect: true, explanation: '正反对比论证能让文章更有深度，也能覆盖不同的维度。' },
      { text: '不用新例子了，直接写结论', isCorrect: false, explanation: '两个论据不够支撑一篇800字的议论文，会导致论证不充分。' },
      { text: '把爱迪生的例子写得更详细', isCorrect: false, explanation: '增加细节不能解决论据雷同的问题，反而会让段落失衡。' },
    ],
  },
  {
    id: 'perfect-opening',
    title: '开头写不好',
    description: '花了很多时间写开头，反复修改，还是觉得不够吸引人，但时间已经过去不少了。',
    strategy: '先写框架，回头打磨开头',
    strategySteps: [
      '开头只要"点题+引出论点"就够了，不要追求华丽',
      '写一个简单的开头，先往后推进',
      '完成全文后，有余力再回头打磨开头',
      '好的开头是自然流露的，不是反复雕琢出来的',
      '记住：内容完整比开头精彩更重要',
    ],
    practicePrompt: '考试已经过去15分钟，你的议论文开头改了三遍还是不满意。你最应该怎么做？',
    practiceOptions: [
      { text: '继续修改开头，直到满意为止', isCorrect: false, explanation: '在开头耗费过多时间会压缩后续写作时间，得不偿失。' },
      { text: '写一个简单的开头，先往下推进全文', isCorrect: true, explanation: '先把框架搭起来，确保文章结构完整，回头有时间再打磨细节。' },
      { text: '删掉已写的开头，从论证段开始写', isCorrect: false, explanation: '从论证段开始写会让文章缺少引入，读起来突兀。' },
      { text: '跳过开头，直接写论证段，最后补开头', isCorrect: false, explanation: '虽然思路没错，但完全没有开头直接进入论证，会影响文章的整体感。' },
    ],
  },
  {
    id: 'word-count',
    title: '字数不够',
    description: '文章写完了，但字数远不够要求的800字。论证单薄，例子不够充分，不知道如何在不注水的情况下充实内容。',
    strategy: '补充分析和过渡，而非堆砌事例',
    strategySteps: [
      '在每个论据后加一段分析——"这说明了什么"',
      '增加段落之间的过渡句，让文章更连贯',
      '在开头和结尾处深化主题，加入更深层的思考',
      '用设问或反问增强论述力度',
      '宁可写深一个点，也不要浅写三个点',
    ],
    practicePrompt: '你的议论文只有550字，还需要至少250字。你的文章有三个论据但每个都只有两句话。你应该怎么充实？',
    practiceOptions: [
      { text: '每个论据后面加上分析和小结，深入展开', isCorrect: true, explanation: '在现有论据基础上深入分析，既能充实内容，又能提升论证质量。' },
      { text: '再加两个新的论据', isCorrect: false, explanation: '论据数量已经足够，再加新的反而会让每个论据都显得浅薄。' },
      { text: '把已有的句子写得更长更复杂', isCorrect: false, explanation: '单纯拉长句子会显得啰嗦，没有增加实质性的论证内容。' },
      { text: '在开头和结尾重复主题', isCorrect: false, explanation: '重复不会增加文章的价值，反而会让读者觉得冗余。' },
    ],
  },
  {
    id: 'emotion-overwhelm',
    title: '情绪影响发挥',
    description: '因为前面的选择题或阅读理解做得不顺利，心情低落，影响了作文的发挥，脑子里一直想着前面的失误。',
    strategy: '心理切割：过去的题已经结束，专注当下',
    strategySteps: [
      '明确告诉自己："前面的已经结束了"',
      '做几次深呼吸，把注意力拉回作文',
      '先写自己最擅长的部分，建立信心',
      '用具体的写作行动替代焦虑情绪',
      '写到中途，注意力自然会转移到作文上',
    ],
    practicePrompt: '你刚做完阅读理解，感觉错了很多，心里很沮丧。现在要开始写800字的议论文。你怎样调整状态？',
    practiceOptions: [
      { text: '允许自己难过几分钟，然后再开始写', isCorrect: false, explanation: '在考试中浪费时间沉浸在负面情绪里只会让情况更糟。' },
      { text: '告诉自己前面的已经过去，专注眼前的作文', isCorrect: true, explanation: '心理切割是最有效的情绪管理方法，能帮助你迅速回到最佳状态。' },
      { text: '加快速度写作文，争取把前面丢的分补回来', isCorrect: false, explanation: '带着焦虑和急躁写作，质量往往很低，反而可能丢更多分。' },
      { text: '先做几次深呼吸，然后从最有把握的部分开始写', isCorrect: true, explanation: '深呼吸放松身心后，从擅长的部分入手可以建立信心，逐步进入状态。' },
    ],
  },
]
