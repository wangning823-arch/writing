export interface ParagraphOrderExercise {
  id: string
  topic: string
  subject: 'chinese' | 'english'
  difficulty: 'easy' | 'medium' | 'hard'
  paragraphs: { id: string; content: string; correctPosition: number }[]
  explanation: string
}

export const PARAGRAPH_ORDER_EXERCISES: ParagraphOrderExercise[] = [
  // ============ 中文 - 基础难度 (5段) ============
  {
    id: 'cn-yongqi',
    topic: '勇气',
    subject: 'chinese',
    difficulty: 'easy',
    paragraphs: [
      { id: 'p1', content: '真正的勇气，并非鲁莽冲动，而是在深思熟虑后依然选择前行的坚定。', correctPosition: 1 },
      { id: 'p2', content: '历史长河中，无数仁人志士以行动诠释了勇气的真谛。林则徐虎门销烟，明知会触怒列强，仍义无反顾；谭嗣同拒绝逃亡，以鲜血唤醒沉睡的国民。', correctPosition: 2 },
      { id: 'p3', content: '勇气不是没有恐惧，而是面对恐惧时依然选择行动。司马迁遭受宫刑之辱，却忍辱负重，最终完成了"史家之绝唱"。', correctPosition: 3 },
      { id: 'p4', content: '在当今社会，勇气更多体现在日常的选择中——敢于承认错误，敢于坚持原则，敢于为弱者发声。', correctPosition: 4 },
      { id: 'p5', content: '勇气是人类最珍贵的品质之一，它推动着文明的进步，也照亮着个人成长的道路。', correctPosition: 5 },
    ],
    explanation: '文章采用"定义—举例—深化—联系现实—总结"的递进结构。先给出勇气的定义，再用历史人物佐证，接着深入分析勇气的本质，最后联系当下，以总结收束全文。',
  },
  {
    id: 'cn-jianchi',
    topic: '坚持',
    subject: 'chinese',
    difficulty: 'easy',
    paragraphs: [
      { id: 'p1', content: '坚持是通往成功的必经之路，没有坚持，天赋不过是沉睡的种子。', correctPosition: 1 },
      { id: 'p2', content: '然而，真正的坚持并非机械重复，而是在不断反思中调整方向。爱迪生发明灯泡经历了上千次失败，但每次失败都让他更接近正确答案。', correctPosition: 2 },
      { id: 'p3', content: '许多人之所以无法成功，并非能力不足，而是在黎明前最黑暗的时刻选择了放弃。', correctPosition: 3 },
      { id: 'p4', content: '坚持的力量在于积累。正如荀子所言："不积跬步，无以至千里。"每天进步一点点，终将产生质的飞跃。', correctPosition: 4 },
      { id: 'p5', content: '让我们以坚持为舟，以信念为帆，在人生的海洋中乘风破浪，驶向理想的彼岸。', correctPosition: 5 },
    ],
    explanation: '文章采用"提出论点—辨证分析—反面论证—正面深化—号召总结"的结构。先提出坚持的重要性，然后辨证分析坚持的内涵，再从反面和正面两个角度论证，最后发出号召。',
  },
  // ============ 中文 - 中等难度 (6段) ============
  {
    id: 'cn-chuangxin',
    topic: '创新',
    subject: 'chinese',
    difficulty: 'medium',
    paragraphs: [
      { id: 'p1', content: '创新是一个民族进步的灵魂，是国家兴旺发达的不竭动力。', correctPosition: 1 },
      { id: 'p2', content: '回望历史，每一次重大进步都源于创新。从造纸术到互联网，从蒸汽机到人工智能，创新不断重塑着人类文明的面貌。', correctPosition: 2 },
      { id: 'p3', content: '创新需要勇气，需要打破常规的魄力。哥白尼提出日心说，挑战了统治千年的地心说；鲁迅弃医从文，用笔唤醒国民的灵魂。', correctPosition: 3 },
      { id: 'p4', content: '创新更需要深厚的知识积累和持续的学习。没有扎实的基础，创新就成了无源之水、无本之木。', correctPosition: 4 },
      { id: 'p5', content: '然而，创新并非一帆风顺。它常常伴随着质疑、失败，甚至来自保守势力的阻挠。但正是这些挑战，锤炼了创新者的意志。', correctPosition: 5 },
      { id: 'p6', content: '在这个日新月异的时代，唯有创新者才能立于不败之地。让我们拥抱变化，勇于创新，共同开创美好的未来。', correctPosition: 6 },
    ],
    explanation: '文章采用"总起—历史回顾—条件分析（勇气）—条件分析（知识）—转折深化—总结"的结构。层层递进，从多个角度论证创新的条件和意义。',
  },
  {
    id: 'cn-huanjing',
    topic: '环境保护',
    subject: 'chinese',
    difficulty: 'medium',
    paragraphs: [
      { id: 'p1', content: '地球是我们唯一的家园，保护环境就是保护我们自己。', correctPosition: 1 },
      { id: 'p2', content: '然而，工业化进程给地球带来了沉重的负担。空气污染、水土流失、物种灭绝……这些问题正威胁着人类的生存。', correctPosition: 2 },
      { id: 'p3', content: '更令人担忧的是，许多人对环境问题视而不见，认为那是遥远的事情。殊不知，生态系统的破坏终将反噬人类自身。', correctPosition: 3 },
      { id: 'p4', content: '环境保护不仅仅是政府的责任，更需要每个人的参与。从节约用水到垃圾分类，从小事做起，汇聚成改变的力量。', correctPosition: 4 },
      { id: 'p5', content: '可持续发展理念告诉我们，经济发展不能以牺牲环境为代价。绿水青山就是金山银山，这不是口号，而是实践的真理。', correctPosition: 5 },
      { id: 'p6', content: '让我们携手共建美丽家园，为子孙后代留下一片蓝天碧水。', correctPosition: 6 },
    ],
    explanation: '文章采用"提出主题—揭示问题—深化危机感—个人行动—理念升华—号召"的结构。通过层层递进的论述，增强读者的环保意识。',
  },
  {
    id: 'cn-keji',
    topic: '科技与生活',
    subject: 'chinese',
    difficulty: 'medium',
    paragraphs: [
      { id: 'p1', content: '科技已经深刻改变了我们的生活方式，从衣食住行到沟通交流，无处不见科技的身影。', correctPosition: 1 },
      { id: 'p2', content: '智能手机让我们随时随地获取信息，移动支付让交易更加便捷，人工智能让许多重复性工作得以自动化。', correctPosition: 2 },
      { id: 'p3', content: '然而，科技也是一把双刃剑。过度依赖手机导致人际关系疏远，信息过载引发焦虑，隐私泄露成为隐忧。', correctPosition: 3 },
      { id: 'p4', content: '数据显示，青少年平均每天使用手机超过4小时，近视率逐年攀升，这不禁让人反思：科技究竟是在服务我们，还是在控制我们？', correctPosition: 4 },
      { id: 'p5', content: '关键在于如何合理使用科技。我们应当做科技的主人，而非奴隶，让科技服务于人，而非控制人。', correctPosition: 5 },
      { id: 'p6', content: '科技的终极目标应该是让生活更美好，而非更复杂。在享受科技便利的同时，别忘了回归生活的本质。', correctPosition: 6 },
    ],
    explanation: '文章采用"总述—举例—转折—数据论证—对策—总结"的结构。通过数据增强了论证的说服力，使文章更有深度。',
  },
  // ============ 中文 - 困难难度 (7段，含干扰项) ============
  {
    id: 'cn-education',
    topic: '教育的本质',
    subject: 'chinese',
    difficulty: 'hard',
    paragraphs: [
      { id: 'p1', content: '教育的本质，不是灌输知识，而是点燃火焰。正如苏格拉底所言："教育不是灌满一桶水，而是点燃一把火。"', correctPosition: 1 },
      { id: 'p2', content: '然而，现实中的教育往往偏离了这一本质。应试教育将学生变成答题机器，分数成为衡量一切的标准。', correctPosition: 2 },
      { id: 'p3', content: '真正好的教育应该培养学生的批判性思维、创造力和独立人格，让他们学会思考，而非只是记忆。', correctPosition: 3 },
      { id: 'p4', content: '芬兰的教育模式给我们启示：减少考试、增加实践、尊重个体差异，反而能激发学生更大的学习热情。', correctPosition: 4 },
      { id: 'p5', content: '当然，改革教育体制并非一朝一夕之功。它需要全社会的共识，需要政策的支持，更需要每一位教育工作者的坚守。', correctPosition: 5 },
      { id: 'p6', content: '当教育真正回归本质，我们培养出的将不再是"做题家"，而是有思想、有担当、有创造力的新一代。', correctPosition: 6 },
      { id: 'p7', content: '科技的发展为教育带来了新的可能。在线教育、AI辅助学习，让优质教育资源得以跨越地域限制，惠及更多学子。', correctPosition: 3 },
    ],
    explanation: '文章采用"定义—揭示问题—提出理念—案例论证—反思困难—展望未来"的结构。注意第7段是干扰项，虽然内容相关，但应该放在第3段之后。',
  },
  {
    id: 'cn-culture',
    topic: '传统文化的传承',
    subject: 'chinese',
    difficulty: 'hard',
    paragraphs: [
      { id: 'p1', content: '中华传统文化是中华民族的根与魂，它承载着先人的智慧，滋养着当代人的精神世界。', correctPosition: 1 },
      { id: 'p2', content: '从《论语》的仁义礼智，到《道德经》的道法自然，传统文化蕴含着深刻的人生哲理和处世智慧。', correctPosition: 2 },
      { id: 'p3', content: '然而，在全球化的浪潮中，传统文化正面临前所未有的挑战。年轻一代对传统节日、习俗日渐陌生，传统技艺后继乏人。', correctPosition: 3 },
      { id: 'p4', content: '令人欣慰的是，近年来"国潮"兴起，汉服、国风音乐、传统手工艺重新受到年轻人追捧，这说明传统文化并非没有生命力。', correctPosition: 4 },
      { id: 'p5', content: '关键在于如何让传统文化与现代生活相融合，而非束之高阁。故宫文创的成功，正是传统与创新结合的典范。', correctPosition: 5 },
      { id: 'p6', content: '传承传统文化，不是复古，而是在继承中创新，在创新中发展，让古老智慧焕发新的时代光彩。', correctPosition: 6 },
      { id: 'p7', content: '联合国教科文组织已将多项中国非遗列入名录，这既是荣誉，也是责任——我们有义务将这些文化瑰宝代代相传。', correctPosition: 4 },
    ],
    explanation: '文章采用"定义价值—举例说明—揭示问题—积极现象—解决思路—总结升华"的结构。第7段是干扰项，虽然内容相关，但与第4段功能重复。',
  },
  // ============ 英文 - 基础难度 (5段) ============
  {
    id: 'en-courage',
    topic: 'Courage',
    subject: 'english',
    difficulty: 'easy',
    paragraphs: [
      { id: 'p1', content: 'Courage is not the absence of fear, but the triumph over it. It is the quality that enables us to face adversity with strength and determination.', correctPosition: 1 },
      { id: 'p2', content: 'Throughout history, courageous individuals have shaped the world. Martin Luther King Jr. stood up against racial injustice, knowing the dangers he faced, yet refusing to be silenced.', correctPosition: 2 },
      { id: 'p3', content: 'In everyday life, courage takes quieter forms. It is the student who speaks up against bullying, the employee who admits a mistake, or the friend who tells a hard truth.', correctPosition: 3 },
      { id: 'p4', content: 'Developing courage requires practice. Each time we step outside our comfort zone, we build the mental muscles needed to face greater challenges in the future.', correctPosition: 4 },
      { id: 'p5', content: 'Without courage, progress stalls and injustice prevails. Cultivating this virtue is essential for both personal growth and societal advancement.', correctPosition: 5 },
    ],
    explanation: 'The essay follows a "definition - historical example - everyday application - development - conclusion" structure. It opens with a clear definition, supports it with a powerful historical example, then shows how courage manifests in daily life, discusses how to develop it, and concludes with its broader importance.',
  },
  {
    id: 'en-persistence',
    topic: 'Persistence',
    subject: 'english',
    difficulty: 'easy',
    paragraphs: [
      { id: 'p1', content: 'Persistence is the key that unlocks the door to achievement. Without it, even the most talented individuals fail to reach their potential.', correctPosition: 1 },
      { id: 'p2', content: 'Consider the story of Thomas Edison, who failed thousands of times before perfecting the light bulb. His persistence was not blind stubbornness but a deliberate refusal to accept failure as final.', correctPosition: 2 },
      { id: 'p3', content: 'Some people confuse persistence with mere repetition. True persistence involves learning from mistakes and adapting strategies while keeping the ultimate goal in sight.', correctPosition: 3 },
      { id: 'p4', content: 'In modern education, persistence is especially valuable. Students who persist through difficult subjects often discover that the greatest rewards come after the hardest struggles.', correctPosition: 4 },
      { id: 'p5', content: 'As we navigate an increasingly complex world, persistence remains our most reliable companion on the road to success.', correctPosition: 5 },
    ],
    explanation: 'The essay uses a "thesis - illustration - clarification - application - conclusion" structure. It states the thesis, illustrates with Edison, clarifies what persistence truly means, applies it to education, and concludes with a forward-looking statement.',
  },
  // ============ 英文 - 中等难度 (6段) ============
  {
    id: 'en-innovation',
    topic: 'Innovation',
    subject: 'english',
    difficulty: 'medium',
    paragraphs: [
      { id: 'p1', content: 'Innovation drives human progress and transforms the way we live, work, and connect with one another.', correctPosition: 1 },
      { id: 'p2', content: 'From the printing press to the internet, every major leap in civilization has been fueled by innovative thinking that challenged the status quo.', correctPosition: 2 },
      { id: 'p3', content: 'Innovation requires both creativity and courage. It demands the willingness to question established norms and the resilience to persevere through failure.', correctPosition: 3 },
      { id: 'p4', content: 'Moreover, innovation thrives in environments that embrace diversity. When people from different backgrounds collaborate, they bring unique perspectives that spark breakthrough ideas.', correctPosition: 4 },
      { id: 'p5', content: 'However, innovation must be guided by ethical considerations. Technological advancement without moral compass can lead to unintended consequences that harm society.', correctPosition: 5 },
      { id: 'p6', content: 'By fostering a culture of responsible innovation, we can harness its power to build a more equitable and sustainable future for all.', correctPosition: 6 },
    ],
    explanation: 'The essay follows a "topic introduction - historical evidence - requirements - additional factor (diversity) - caution - hopeful conclusion" pattern. It builds a comprehensive argument by adding multiple dimensions to what innovation requires.',
  },
  {
    id: 'en-environment',
    topic: 'Environmental Protection',
    subject: 'english',
    difficulty: 'medium',
    paragraphs: [
      { id: 'p1', content: 'The environment is our shared heritage, and protecting it is a responsibility that falls on every individual, community, and nation.', correctPosition: 1 },
      { id: 'p2', content: 'Climate change, deforestation, and pollution have reached alarming levels. The consequences are visible in rising sea levels, extreme weather events, and biodiversity loss.', correctPosition: 2 },
      { id: 'p3', content: 'What makes these challenges particularly daunting is their interconnected nature. Environmental degradation in one region can trigger cascading effects across the globe.', correctPosition: 3 },
      { id: 'p4', content: 'Individual actions matter. Reducing waste, conserving energy, and choosing sustainable products may seem small, but collectively they create significant impact.', correctPosition: 4 },
      { id: 'p5', content: 'At the policy level, governments must enact and enforce environmental regulations. Corporations should be held accountable for their ecological footprint.', correctPosition: 5 },
      { id: 'p6', content: 'The choices we make today will determine the world we leave for future generations. There is no Planet B — we must act now.', correctPosition: 6 },
    ],
    explanation: 'The essay uses a "statement of responsibility - problem overview - deepening understanding - individual solutions - systemic solutions - urgent call to action" structure. It adds complexity by showing the interconnected nature of environmental problems.',
  },
  {
    id: 'en-technology',
    topic: 'Technology and Life',
    subject: 'english',
    difficulty: 'medium',
    paragraphs: [
      { id: 'p1', content: 'Technology has become inseparable from modern life, reshaping how we communicate, learn, and entertain ourselves.', correctPosition: 1 },
      { id: 'p2', content: 'Smartphones, social media, and artificial intelligence have revolutionized daily routines, offering unprecedented convenience and connectivity.', correctPosition: 2 },
      { id: 'p3', content: 'Yet this dependence comes at a cost. Screen addiction, shortened attention spans, and digital privacy concerns are growing challenges that cannot be ignored.', correctPosition: 3 },
      { id: 'p4', content: 'Research shows that excessive screen time correlates with increased anxiety and decreased well-being, particularly among young people.', correctPosition: 4 },
      { id: 'p5', content: 'Striking a balance is essential. We should use technology as a tool to enhance our lives rather than allow it to dictate our habits and well-being.', correctPosition: 5 },
      { id: 'p6', content: 'Ultimately, the goal of technology should be to serve humanity. By using it wisely, we can enjoy its benefits while preserving what makes us fundamentally human.', correctPosition: 6 },
    ],
    explanation: 'The essay follows a "phenomenon - benefits - drawbacks - evidence - balanced approach - conclusion" structure. It adds research evidence to strengthen the argument about technology\'s negative effects.',
  },
  // ============ 英文 - 困难难度 (7段，含干扰项) ============
  {
    id: 'en-education',
    topic: 'The Future of Education',
    subject: 'english',
    difficulty: 'hard',
    paragraphs: [
      { id: 'p1', content: 'Education stands at a crossroads. Traditional methods that served us for centuries are being challenged by rapid technological change and evolving societal needs.', correctPosition: 1 },
      { id: 'p2', content: 'The industrial-age model of education — standardized curricula, rigid schedules, and passive learning — is increasingly inadequate for preparing students for the modern world.', correctPosition: 2 },
      { id: 'p3', content: 'What students need today are skills that machines cannot easily replicate: critical thinking, emotional intelligence, creativity, and the ability to collaborate across cultures.', correctPosition: 3 },
      { id: 'p4', content: 'Countries like Finland and Singapore are leading the way, replacing standardized tests with project-based learning and emphasizing student well-being alongside academic achievement.', correctPosition: 4 },
      { id: 'p5', content: 'Technology offers promising solutions. Adaptive learning platforms can personalize education, while virtual reality can create immersive learning experiences.', correctPosition: 5 },
      { id: 'p6', content: 'However, technology alone cannot solve education\'s challenges. The human element — passionate teachers, supportive communities, and mentorship — remains irreplaceable.', correctPosition: 6 },
      { id: 'p7', content: 'Online learning platforms have made education more accessible than ever before, allowing students from remote areas to access world-class instruction.', correctPosition: 5 },
      { id: 'p8', content: 'The future of education lies in balancing innovation with tradition, technology with humanity, and standardized measures with individual growth.', correctPosition: 7 },
    ],
    explanation: 'The essay follows a "crossroads - critique old model - identify needs - show examples - technology solutions - human element - conclusion" structure. Paragraph 7 is a distractor - while relevant, it duplicates the function of paragraph 5.',
  },
  {
    id: 'en-media',
    topic: 'Media Literacy in the Digital Age',
    subject: 'english',
    difficulty: 'hard',
    paragraphs: [
      { id: 'p1', content: 'We live in an era of information overload. News, opinions, and content bombard us from every direction, making it harder than ever to distinguish fact from fiction.', correctPosition: 1 },
      { id: 'p2', content: 'Social media algorithms create echo chambers, showing us content that reinforces our existing beliefs while filtering out opposing viewpoints.', correctPosition: 2 },
      { id: 'p3', content: 'This phenomenon has serious consequences. Misinformation spreads faster than truth, influencing elections, public health decisions, and social cohesion.', correctPosition: 3 },
      { id: 'p4', content: 'Media literacy — the ability to critically analyze and evaluate media messages — has become an essential skill for modern citizenship.', correctPosition: 4 },
      { id: 'p5', content: 'Schools must integrate media literacy into their curricula, teaching students how to identify bias, verify sources, and think critically about the information they consume.', correctPosition: 5 },
      { id: 'p6', content: 'Parents also play a crucial role. Having open conversations about media consumption and modeling critical thinking at home can be equally impactful.', correctPosition: 6 },
      { id: 'p7', content: 'Some argue that fact-checking websites and AI tools can solve the misinformation problem automatically, reducing the need for human judgment.', correctPosition: 4 },
      { id: 'p8', content: 'Ultimately, empowering individuals with media literacy skills is our best defense against the manipulation of public opinion and the erosion of democratic discourse.', correctPosition: 8 },
    ],
    explanation: 'The essay uses a "problem statement - mechanism - consequences - solution overview - institutional response - personal responsibility - counterargument - conclusion" structure. Paragraph 7 is a distractor that presents a tempting but incomplete solution.',
  },
]
