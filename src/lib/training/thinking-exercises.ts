export interface ParagraphOrderExercise {
  id: string
  topic: string
  subject: 'chinese' | 'english'
  paragraphs: { id: string; content: string; correctPosition: number }[]
  explanation: string
}

export const PARAGRAPH_ORDER_EXERCISES: ParagraphOrderExercise[] = [
  {
    id: 'cn-yongqi',
    topic: '勇气',
    subject: 'chinese',
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
    paragraphs: [
      { id: 'p1', content: '坚持是通往成功的必经之路，没有坚持，天赋不过是沉睡的种子。', correctPosition: 1 },
      { id: 'p2', content: '然而，真正的坚持并非机械重复，而是在不断反思中调整方向。爱迪生发明灯泡经历了上千次失败，但每次失败都让他更接近正确答案。', correctPosition: 2 },
      { id: 'p3', content: '许多人之所以无法成功，并非能力不足，而是在黎明前最黑暗的时刻选择了放弃。', correctPosition: 3 },
      { id: 'p4', content: '坚持的力量在于积累。正如荀子所言："不积跬步，无以至千里。"每天进步一点点，终将产生质的飞跃。', correctPosition: 4 },
      { id: 'p5', content: '让我们以坚持为舟，以信念为帆，在人生的海洋中乘风破浪，驶向理想的彼岸。', correctPosition: 5 },
    ],
    explanation: '文章采用"提出论点—辨证分析—反面论证—正面深化—号召总结"的结构。先提出坚持的重要性，然后辨证分析坚持的内涵，再从反面和正面两个角度论证，最后发出号召。',
  },
  {
    id: 'cn-chuangxin',
    topic: '创新',
    subject: 'chinese',
    paragraphs: [
      { id: 'p1', content: '创新是一个民族进步的灵魂，是国家兴旺发达的不竭动力。', correctPosition: 1 },
      { id: 'p2', content: '回望历史，每一次重大进步都源于创新。从造纸术到互联网，从蒸汽机到人工智能，创新不断重塑着人类文明的面貌。', correctPosition: 2 },
      { id: 'p3', content: '创新需要勇气，需要打破常规的魄力。哥白尼提出日心说，挑战了统治千年的地心说；鲁迅弃医从文，用笔唤醒国民的灵魂。', correctPosition: 3 },
      { id: 'p4', content: '创新更需要深厚的知识积累和持续的学习。没有扎实的基础，创新就成了无源之水、无本之木。', correctPosition: 4 },
      { id: 'p5', content: '在这个日新月异的时代，唯有创新者才能立于不败之地。让我们拥抱变化，勇于创新，共同开创美好的未来。', correctPosition: 5 },
    ],
    explanation: '文章采用"总起—历史回顾—条件分析—深化—总结"的结构。先提出创新的重要性，然后回顾历史加以证明，接着分析创新所需的条件（勇气和知识），最后总结并展望未来。',
  },
  {
    id: 'cn-huanjing',
    topic: '环境保护',
    subject: 'chinese',
    paragraphs: [
      { id: 'p1', content: '地球是我们唯一的家园，保护环境就是保护我们自己。', correctPosition: 1 },
      { id: 'p2', content: '然而，工业化进程给地球带来了沉重的负担。空气污染、水土流失、物种灭绝……这些问题正威胁着人类的生存。', correctPosition: 2 },
      { id: 'p3', content: '环境保护不仅仅是政府的责任，更需要每个人的参与。从节约用水到垃圾分类，从小事做起，汇聚成改变的力量。', correctPosition: 3 },
      { id: 'p4', content: '可持续发展理念告诉我们，经济发展不能以牺牲环境为代价。绿水青山就是金山银山，这不是口号，而是实践的真理。', correctPosition: 4 },
      { id: 'p5', content: '让我们携手共建美丽家园，为子孙后代留下一片蓝天碧水。', correctPosition: 5 },
    ],
    explanation: '文章采用"提出主题—揭示问题—个人行动—理念深化—号召"的结构。先点明环保的意义，再揭示当前面临的问题，然后从个人层面提出行动方案，接着升华到发展理念，最后发出号召。',
  },
  {
    id: 'cn-keji',
    topic: '科技与生活',
    subject: 'chinese',
    paragraphs: [
      { id: 'p1', content: '科技已经深刻改变了我们的生活方式，从衣食住行到沟通交流，无处不见科技的身影。', correctPosition: 1 },
      { id: 'p2', content: '智能手机让我们随时随地获取信息，移动支付让交易更加便捷，人工智能让许多重复性工作得以自动化。', correctPosition: 2 },
      { id: 'p3', content: '然而，科技也是一把双刃剑。过度依赖手机导致人际关系疏远，信息过载引发焦虑，隐私泄露成为隐忧。', correctPosition: 3 },
      { id: 'p4', content: '关键在于如何合理使用科技。我们应当做科技的主人，而非奴隶，让科技服务于人，而非控制人。', correctPosition: 4 },
      { id: 'p5', content: '科技的终极目标应该是让生活更美好，而非更复杂。在享受科技便利的同时，别忘了回归生活的本质。', correctPosition: 5 },
    ],
    explanation: '文章采用"总述—举例—转折—对策—总结"的结构。先概括科技对生活的改变，然后举例说明，接着转折指出科技的负面影响，随后提出应对策略，最后总结升华。',
  },
  {
    id: 'en-courage',
    topic: 'Courage',
    subject: 'english',
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
    paragraphs: [
      { id: 'p1', content: 'Persistence is the key that unlocks the door to achievement. Without it, even the most talented individuals fail to reach their potential.', correctPosition: 1 },
      { id: 'p2', content: 'Consider the story of Thomas Edison, who failed thousands of times before perfecting the light bulb. His persistence was not blind stubbornness but a deliberate refusal to accept failure as final.', correctPosition: 2 },
      { id: 'p3', content: 'Some people confuse persistence with mere repetition. True persistence involves learning from mistakes and adapting strategies while keeping the ultimate goal in sight.', correctPosition: 3 },
      { id: 'p4', content: 'In modern education, persistence is especially valuable. Students who persist through difficult subjects often discover that the greatest rewards come after the hardest struggles.', correctPosition: 4 },
      { id: 'p5', content: 'As we navigate an increasingly complex world, persistence remains our most reliable companion on the road to success.', correctPosition: 5 },
    ],
    explanation: 'The essay uses a "thesis - illustration - clarification - application - conclusion" structure. It states the thesis, illustrates with Edison, clarifies what persistence truly means, applies it to education, and concludes with a forward-looking statement.',
  },
  {
    id: 'en-innovation',
    topic: 'Innovation',
    subject: 'english',
    paragraphs: [
      { id: 'p1', content: 'Innovation drives human progress and transforms the way we live, work, and connect with one another.', correctPosition: 1 },
      { id: 'p2', content: 'From the printing press to the internet, every major leap in civilization has been fueled by innovative thinking that challenged the status quo.', correctPosition: 2 },
      { id: 'p3', content: 'Innovation requires both creativity and courage. It demands the willingness to question established norms and the resilience to persevere through failure.', correctPosition: 3 },
      { id: 'p4', content: 'However, innovation must be guided by ethical considerations. technological advancement without moral compass can lead to unintended consequences that harm society.', correctPosition: 4 },
      { id: 'p5', content: 'By fostering a culture of responsible innovation, we can harness its power to build a more equitable and sustainable future for all.', correctPosition: 5 },
    ],
    explanation: 'The essay follows a "topic introduction - historical evidence - requirements - caution - hopeful conclusion" pattern. It introduces innovation, traces its historical impact, outlines what it requires, raises an important caveat about ethics, and ends with an optimistic vision.',
  },
  {
    id: 'en-environment',
    topic: 'Environmental Protection',
    subject: 'english',
    paragraphs: [
      { id: 'p1', content: 'The environment is our shared heritage, and protecting it is a responsibility that falls on every individual, community, and nation.', correctPosition: 1 },
      { id: 'p2', content: 'Climate change, deforestation, and pollution have reached alarming levels. The consequences are visible in rising sea levels, extreme weather events, and biodiversity loss.', correctPosition: 2 },
      { id: 'p3', content: 'Individual actions matter. Reducing waste, conserving energy, and choosing sustainable products may seem small, but collectively they create significant impact.', correctPosition: 3 },
      { id: 'p4', content: 'At the policy level, governments must enact and enforce environmental regulations. Corporations should be held accountable for their ecological footprint.', correctPosition: 4 },
      { id: 'p5', content: 'The choices we make today will determine the world we leave for future generations. There is noPlanet B — we must act now.', correctPosition: 5 },
    ],
    explanation: 'The essay uses a "statement of responsibility - problem overview - individual solutions - systemic solutions - urgent call to action" structure. It moves from personal responsibility to global problems, then back to what individuals and governments can do, ending with urgency.',
  },
  {
    id: 'en-technology',
    topic: 'Technology and Life',
    subject: 'english',
    paragraphs: [
      { id: 'p1', content: 'Technology has become inseparable from modern life, reshaping how we communicate, learn, and entertain ourselves.', correctPosition: 1 },
      { id: 'p2', content: 'Smartphones, social media, and artificial intelligence have revolutionized daily routines, offering unprecedented convenience and connectivity.', correctPosition: 2 },
      { id: 'p3', content: 'Yet this dependence comes at a cost. Screen addiction, shortened attention spans, and digital privacy concerns are growing challenges that cannot be ignored.', correctPosition: 3 },
      { id: 'p4', content: 'Striking a balance is essential. We should use technology as a tool to enhance our lives rather than allow it to dictate our habits and well-being.', correctPosition: 4 },
      { id: 'p5', content: 'Ultimately, the goal of technology should be to serve humanity. By using it wisely, we can enjoy its benefits while preserving what makes us fundamentally human.', correctPosition: 5 },
    ],
    explanation: 'The essay follows a "phenomenon - benefits - drawbacks - balanced approach - conclusion" structure. It describes technology\'s pervasiveness, acknowledges its advantages, raises concerns about over-dependence, advocates for balance, and concludes with a humanistic perspective.',
  },
]
