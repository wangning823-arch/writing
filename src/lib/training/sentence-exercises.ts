export interface SentenceExercise {
  id: string
  type: 'long-short' | 'integrated-scattered' | 'inversion' | 'upgrade'
  prompt: string
  originalSentence: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const SENTENCE_EXERCISES: SentenceExercise[] = [
  {
    id: 'se-1', type: 'long-short', difficulty: 'medium',
    prompt: '请将以下长句拆分为三个短句，保持原意并使表达更清晰：',
    originalSentence: '在经济全球化和科技革命的双重推动下，传统的产业结构正在经历前所未有的深刻变革，大量新兴职业应运而生。',
  },
  {
    id: 'se-2', type: 'long-short', difficulty: 'hard',
    prompt: '请将以下长句拆分为短句，要求拆分后每句保留核心信息，整体逻辑连贯：',
    originalSentence: '面对百年未有之大变局，我们必须以更加开放包容的姿态拥抱世界，在坚守中华文化根脉的同时积极吸收人类文明的一切优秀成果，以创新驱动发展，以实干赢得未来。',
  },
  {
    id: 'se-3', type: 'integrated-scattered', difficulty: 'medium',
    prompt: '请将以下整句改为散句，打破整齐的句式结构，使语言更自然流畅：',
    originalSentence: '风拂过山岗，雨落于湖面，花开在原野，鸟鸣于林间。',
  },
  {
    id: 'se-4', type: 'integrated-scattered', difficulty: 'hard',
    prompt: '请将以下散句整合为一组排比整句，要求结构对称、节奏鲜明、富有气势：',
    originalSentence: '读书可以增长见识。读书能够陶冶情操。读书使人明智。读书帮人明理。',
  },
  {
    id: 'se-5', type: 'inversion', difficulty: 'hard',
    prompt: '请将以下句子改写为倒装句，强调"在这片古老的土地上"，要求语意连贯、表达自然：',
    originalSentence: '无数先辈用鲜血和生命书写了可歌可泣的壮丽篇章。',
  },
  {
    id: 'se-6', type: 'inversion', difficulty: 'hard',
    prompt: '请将以下句子改写为双重否定句，使语气更加强烈：',
    originalSentence: '面对困难，我们应该勇往直前。',
  },
  {
    id: 'se-7', type: 'upgrade', difficulty: 'medium',
    prompt: '请将以下两个简单句合并为一个包含现在分词结构的复杂句：',
    originalSentence: '他凝视着窗外的雨。他回忆起童年的往事。',
  },
  {
    id: 'se-8', type: 'upgrade', difficulty: 'hard',
    prompt: '请将以下句子改写为包含虚拟语气和倒装的复杂句，表达与过去事实相反的假设：',
    originalSentence: '如果当时他听了劝告，就不会犯下那个错误。',
  },
  {
    id: 'se-9', type: 'long-short', difficulty: 'hard',
    prompt: '请将以下复杂长句拆分为三个短句，每句表达一个独立的信息点，保持逻辑递进：',
    originalSentence: '随着人工智能技术在教育、医疗、交通等领域的广泛应用，数据隐私保护、算法公平性和技术伦理等问题日益凸显，成为全社会共同关注的焦点。',
  },
  {
    id: 'se-10', type: 'inversion', difficulty: 'medium',
    prompt: '请将以下句子改写为以"只有……才……"开头的条件倒装句：',
    originalSentence: '坚持不懈地努力，才能最终实现梦想。',
  },
  {
    id: 'se-11', type: 'upgrade', difficulty: 'hard',
    prompt: '请将以下平淡的叙述句升级为包含比喻、拟人等修辞手法的文学化表达：',
    originalSentence: '时间过得很快，我们应该珍惜每一天。',
  },
  {
    id: 'se-12', type: 'integrated-scattered', difficulty: 'hard',
    prompt: '请将以下整齐的排比句改写为长短交错的散句，保持原意但使节奏富于变化：',
    originalSentence: '山是沉稳的，水是灵动的，风是自由的，云是飘逸的。',
  },
]
