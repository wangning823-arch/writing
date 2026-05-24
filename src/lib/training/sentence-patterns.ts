/**
 * English sentence pattern library for L1 句式仿写 training.
 *
 * Contains 80+ patterns across 6 categories:
 *   1. Inversion (倒装句)
 *   2. Emphasis / Cleft sentence (强调句)
 *   3. Participle phrases (分词结构)
 *   4. Subjunctive mood (虚拟语气)
 *   5. Nested relative clauses (定语从句嵌套)
 *   6. Mixed inversion + emphasis (倒装+强调混合)
 *
 * Each pattern provides a template, a worked example, and an explanation.
 * Difficulty is rated 1 (basic) to 3 (advanced).
 */

import type { Subject } from '@/types'

// ─── Types ───────────────────────────────────────────────────────────────────

export type PatternType =
  | 'inversion'
  | 'emphasis'
  | 'participle'
  | 'subjunctive'
  | 'relative-clause'
  | 'mixed'

export interface SentencePattern {
  id: string
  type: PatternType
  /** Human-readable category label. */
  typeLabel: string
  /** Template with placeholders like {subject}, {verb}, etc. */
  template: string
  /** A complete worked example. */
  example: string
  /** How this pattern works and when to use it. */
  explanation: string
  /** 1 = basic, 2 = intermediate, 3 = advanced. */
  difficulty: 1 | 2 | 3
}

// ─── Helper Functions ────────────────────────────────────────────────────────

/**
 * Get all patterns, optionally filtered by type and/or difficulty.
 */
export function getPatterns(
  filters?: { type?: PatternType; difficulty?: 1 | 2 | 3 },
): SentencePattern[] {
  let result = SENTENCE_PATTERNS
  if (filters?.type) {
    result = result.filter((p) => p.type === filters.type)
  }
  if (filters?.difficulty) {
    result = result.filter((p) => p.difficulty === filters.difficulty)
  }
  return result
}

/**
 * Get a random selection of patterns for a training exercise.
 */
export function getRandomPatterns(
  count: number,
  filters?: { type?: PatternType; difficulty?: 1 | 2 | 3 },
): SentencePattern[] {
  const pool = getPatterns(filters)
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

/**
 * Get patterns grouped by type.
 */
export function getPatternsByType(): Record<PatternType, SentencePattern[]> {
  const grouped: Record<PatternType, SentencePattern[]> = {
    inversion: [],
    emphasis: [],
    participle: [],
    subjunctive: [],
    'relative-clause': [],
    mixed: [],
  }
  for (const p of SENTENCE_PATTERNS) {
    grouped[p.type].push(p)
  }
  return grouped
}

// ─── Sentence Pattern Bank ───────────────────────────────────────────────────

export const SENTENCE_PATTERNS: SentencePattern[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. INVERSION (倒装句)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- Negative adverb at sentence beginning ---
  {
    id: 'inv-01',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'Never + have/has + S + past participle ...',
    example: 'Never have I seen such a beautiful sunset.',
    explanation:
      '否定副词never置于句首，主句用部分倒装（助动词提前）。常见否定词：never, rarely, seldom, hardly, scarcely, little.',
    difficulty: 1,
  },
  {
    id: 'inv-02',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'Seldom + does/do + S + base verb ...',
    example: 'Seldom does he complain about his working conditions.',
    explanation:
      'seldom置于句首引起部分倒装，助动词does/do提前。注意主谓一致。',
    difficulty: 1,
  },
  {
    id: 'inv-03',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'Hardly/Scarcely + had + S + past participle ... when/before + S + past tense ...',
    example: 'Hardly had I sat down when the telephone rang.',
    explanation:
      'Hardly/Scarcely...when/before表示"刚……就……"，主句用过去完成时，从句用一般过去时。',
    difficulty: 2,
  },
  {
    id: 'inv-04',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'No sooner + had + S + past participle ... than + S + past tense ...',
    example: 'No sooner had we arrived than it started to rain.',
    explanation:
      'No sooner...than表示"一……就……"，主句用过去完成时，从句用一般过去时。与Hardly...when用法相似。',
    difficulty: 2,
  },
  {
    id: 'inv-05',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'Not only + aux + S + verb ... but (also) + S + verb ...',
    example: 'Not only does he speak English fluently, but he also masters French.',
    explanation:
      'Not only...but also连接两个分句时，not only引导的分句需要部分倒装，but also引导的分句不倒装。',
    difficulty: 2,
  },
  {
    id: 'inv-06',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'Not until + time/event + did/does + S + verb ...',
    example: 'Not until midnight did we finish the experiment.',
    explanation:
      'Not until...表示"直到……才"，主句需要用部分倒装（助动词did提前）。注意not until从句本身不倒装。',
    difficulty: 2,
  },
  {
    id: 'inv-07',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'Under no circumstances + should + S + verb ...',
    example: 'Under no circumstances should you reveal the password to others.',
    explanation:
      'under no circumstances（在任何情况下都不）置于句首引起部分倒装。常见类似短语：in no way, by no means, on no account。',
    difficulty: 2,
  },
  {
    id: 'inv-08',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'Only + adverb/prepositional phrase + aux + S + verb ...',
    example: 'Only by working hard can we achieve our goals.',
    explanation:
      'Only+状语置于句首引起部分倒装。注意Only修饰主语时不倒装，如Only he can solve this problem.',
    difficulty: 2,
  },
  {
    id: 'inv-09',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'Only after + time clause + did/does + S + verb ...',
    example: 'Only after years of practice did she master the piano.',
    explanation:
      'Only after...表示"只有在……之后"，主句需要部分倒装。Only后接时间状语从句时从句不倒装。',
    difficulty: 2,
  },

  // --- Inversion with adjectives / so / such ---
  {
    id: 'inv-10',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'So + adj./adv. + aux + S + verb ... that ...',
    example: 'So excited was she that she could hardly speak.',
    explanation:
      'so...that结构中，so+形容词/副词提前到句首时，主句需要部分倒装。这是高考常考句式。',
    difficulty: 2,
  },
  {
    id: 'inv-11',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'Such + noun + aux + S + verb ... that ...',
    example: 'Such was the noise that we could not hear ourselves think.',
    explanation:
      'such+名词提前到句首，主句用部分倒装。such代替了整个名词短语。',
    difficulty: 2,
  },
  {
    id: 'inv-12',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'So + aux + S + verb ... (用于肯定句的省略倒装)',
    example: 'I enjoy reading, and so does my sister.',
    explanation:
      'so+助动词+主语表示"也是如此"，用于肯定句的省略。注意与"so + 主语 + 助动词"（表强调）的区别。',
    difficulty: 1,
  },
  {
    id: 'inv-13',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'Neither/Nor + aux + S + verb ...',
    example: 'He cannot swim, neither can I.',
    explanation:
      'neither/nor+助动词+主语表示"也不"，用于否定句的省略。注意与肯定句的so倒装对应。',
    difficulty: 1,
  },

  // --- Full inversion ---
  {
    id: 'inv-14',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'Here/There/Now/Then + verb + S ...',
    example: 'Here comes the bus! / There goes the bell!',
    explanation:
      '地点副词here/there或时间副词now/then置于句首，谓语动词为come/go等，主语为名词时用完全倒装。',
    difficulty: 1,
  },
  {
    id: 'inv-15',
    type: 'inversion',
    typeLabel: '倒装句',
    template: '介词短语 + V + S ... (地点状语前置完全倒装)',
    example: 'On the wall hangs a beautiful painting.',
    explanation:
      '方位介词短语置于句首，谓语为不及物动词（hang, stand, lie, sit等），主语为名词时用完全倒装。',
    difficulty: 2,
  },
  {
    id: 'inv-16',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'Present/Past participle + be + S ...',
    example: 'Seated by the window was an old man reading a newspaper.',
    explanation:
      '过去分词或现在分词短语置于句首作表语，构成完全倒装。常用于描写场景，文学色彩较浓。',
    difficulty: 3,
  },

  // --- Conditional inversion (省略if) ---
  {
    id: 'inv-17',
    type: 'inversion',
    typeLabel: '倒装句',
    template: 'Were + S + ... / Had + S + past participle ... / Should + S + verb ...',
    example: 'Were I you, I would study abroad. / Had he come earlier, he would have caught the train.',
    explanation:
      '省略if的虚拟条件句：were/had/should提前构成倒装。Were I you = If I were you; Had he come = If he had come.',
    difficulty: 3,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. EMPHASIS / CLEFT SENTENCE (强调句)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- Basic It is/was ... that ---
  {
    id: 'emp-01',
    type: 'emphasis',
    typeLabel: '强调句',
    template: 'It is/was + emphasized part + that/who + rest of sentence',
    example: 'It was yesterday that I met her for the first time.',
    explanation:
      'It is/was...that强调句型，可强调主语、宾语、状语等。去掉It is/was和that，剩余部分仍是一个完整句子。',
    difficulty: 1,
  },
  {
    id: 'emp-02',
    type: 'emphasis',
    typeLabel: '强调句',
    template: 'It is/was + not until + time/event + that + S + verb ...',
    example: 'It was not until midnight that he finished the essay.',
    explanation:
      'not until的强调句型。It was not until...that...表示"直到……才……"。注意that从句用肯定形式。',
    difficulty: 2,
  },
  {
    id: 'emp-03',
    type: 'emphasis',
    typeLabel: '强调句',
    template: 'It is/was + who/that + verb ... (强调人用who)',
    example: 'It was the teacher who helped me overcome my difficulties.',
    explanation:
      '强调人时可用who或that。此句强调"老师"而不是其他人。注意与定语从句的区别：强调句去掉It is/was和who/that后句子完整。',
    difficulty: 1,
  },
  {
    id: 'emp-04',
    type: 'emphasis',
    typeLabel: '强调句',
    template: 'It is/was + on account of/because of + reason + that + S + verb ...',
    example: 'It was on account of his illness that he missed the exam.',
    explanation:
      '强调原因状语。It was because of/on account of...that...表示"正是因为……才……"。',
    difficulty: 2,
  },
  {
    id: 'emp-05',
    type: 'emphasis',
    typeLabel: '强调句',
    template: 'It is/was + in + place + that + S + verb ...',
    example: 'It was in the library that I found the rare book.',
    explanation:
      '强调地点状语。in the library是介词短语作状语，被强调后置于It was和that之间。',
    difficulty: 1,
  },
  {
    id: 'emp-06',
    type: 'emphasis',
    typeLabel: '强调句',
    template: 'It is/was + only when/after/before + time clause + that + S + verb ...',
    example: 'It was only when I graduated that I realized how much I had learned.',
    explanation:
      'only+时间状语的强调句型。It was only when/after...that...强调时间条件。注意从句用正常语序不倒装。',
    difficulty: 2,
  },

  // --- do/does/did emphasis ---
  {
    id: 'emp-07',
    type: 'emphasis',
    typeLabel: '强调句',
    template: 'S + do/does/did + verb ...',
    example: 'I do believe that honesty is the best policy.',
    explanation:
      '在肯定句中用do/does/did强调动词，表示"确实/的确"。常用于口语和书面语中的强调。',
    difficulty: 1,
  },
  {
    id: 'emp-08',
    type: 'emphasis',
    typeLabel: '强调句',
    template: 'What + S + verb ... is/was + that + clause',
    example: 'What impressed me most was that the children were so happy.',
    explanation:
      'What引导的主语从句+is/was+that表语从句，构成双重强调。What从句强调内容，that从句揭示具体信息。',
    difficulty: 3,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. PARTICIPLE PHRASES (分词结构)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- Present participle ---
  {
    id: 'par-01',
    type: 'participle',
    typeLabel: '分词结构',
    template: 'V-ing, S + verb ... (现在分词作原因/时间/伴随状语)',
    example: 'Hearing the news, she burst into tears.',
    explanation:
      '现在分词短语作状语，表示时间或原因。分词的逻辑主语必须与句子主语一致，且分词与主语之间是主动关系。',
    difficulty: 1,
  },
  {
    id: 'par-02',
    type: 'participle',
    typeLabel: '分词结构',
    template: 'S + verb ..., V-ing ... (现在分词作伴随状语)',
    example: 'She sat by the window, reading a novel.',
    explanation:
      '现在分词短语放在句末作伴随状语，表示与谓语动作同时发生的动作。读写同时进行。',
    difficulty: 1,
  },
  {
    id: 'par-03',
    type: 'participle',
    typeLabel: '分词结构',
    template: 'Having + past participle, S + verb ... (完成式分词作时间/原因状语)',
    example: 'Having finished the homework, he went out to play.',
    explanation:
      'having+过去分词表示分词动作先于主句动作完成。having finished表示"完成作业之后"。',
    difficulty: 2,
  },
  {
    id: 'par-04',
    type: 'participle',
    typeLabel: '分词结构',
    template: 'S + verb ..., having + past participle ...',
    example: 'He returned home, having visited three countries.',
    explanation:
      '完成式分词短语放在句末，表示在谓语动作之前已经完成的动作。强调先后顺序。',
    difficulty: 2,
  },

  // --- Past participle ---
  {
    id: 'par-05',
    type: 'participle',
    typeLabel: '分词结构',
    template: 'Past participle, S + verb ... (过去分词作原因/条件状语)',
    example: 'Tired from the long journey, he fell asleep immediately.',
    explanation:
      '过去分词短语作状语，表示原因或条件。过去分词与主语之间是被动关系。tired表示他感到疲倦。',
    difficulty: 1,
  },
  {
    id: 'par-06',
    type: 'participle',
    typeLabel: '分词结构',
    template: 'Seen from the hill, the city looks magnificent.',
    example: 'Seen from the hill, the city looks magnificent.',
    explanation:
      '过去分词短语作条件/方式状语。seen与the city构成被动关系（城市被看），所以用过去分词。',
    difficulty: 2,
  },
  {
    id: 'par-07',
    type: 'participle',
    typeLabel: '分词结构',
    template: 'S + verb + object + V-ing/V-ed (分词作宾补)',
    example: 'I saw him crossing the street carefully.',
    explanation:
      '感官动词(saw)+宾语(him)+分词(crossing)构成复合宾语。现在分词表示正在进行，过去分词表示被动或完成。',
    difficulty: 2,
  },

  // --- Absolute construction ---
  {
    id: 'par-08',
    type: 'participle',
    typeLabel: '分词结构',
    template: 'Noun + V-ing/V-ed, S + verb ... (独立主格结构)',
    example: 'The sun having set, we headed back to the hotel.',
    explanation:
      '独立主格结构：分词的逻辑主语与句子主语不一致时，需要加上自己的主语。the sun having set的主语是the sun，不是we。',
    difficulty: 3,
  },
  {
    id: 'par-09',
    type: 'participle',
    typeLabel: '分词结构',
    template: 'All things considered, S + verb ...',
    example: 'All things considered, the project was a great success.',
    explanation:
      'all things considered是独立分词结构的固定表达，意为"综合考虑"。常用于文章开头或段落过渡。',
    difficulty: 3,
  },

  // --- Participle as adjective ---
  {
    id: 'par-10',
    type: 'participle',
    typeLabel: '分词结构',
    template: 'The + V-ing/V-ed + noun ... (分词作定语)',
    example: 'The trembling leaves rustled in the autumn wind.',
    explanation:
      '现在分词trembling作定语修饰leaves，表示leaves在颤抖（主动）。过去分词如broken window则表示被动。',
    difficulty: 1,
  },
  {
    id: 'par-11',
    type: 'participle',
    typeLabel: '分词结构',
    template: 'S + verb + noun + (which is) + past participle ... (后置定语)',
    example: 'The bridge, built in 1990, needs repair.',
    explanation:
      '过去分词短语作后置定语，相当于省略了which is的定语从句。built in 1990 = which was built in 1990。',
    difficulty: 2,
  },
  {
    id: 'par-12',
    type: 'participle',
    typeLabel: '分词结构',
    template: 'The + noun + to be + past participle (不定式+分词复合定语)',
    example: 'The problem to be discussed tomorrow is very important.',
    explanation:
      '不定式的被动式to be discussed作后置定语，表示"将要被讨论的"，兼具将来和被动含义。',
    difficulty: 3,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. SUBJUNCTIVE MOOD (虚拟语气)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- If conditional ---
  {
    id: 'sub-01',
    type: 'subjunctive',
    typeLabel: '虚拟语气',
    template: 'If + S + past tense, S + would/could/might + base verb ...',
    example: 'If I had more time, I would travel around the world.',
    explanation:
      '对现在事实的虚拟：if从句用一般过去时（be动词用were），主句用would/could/might+动词原形。',
    difficulty: 1,
  },
  {
    id: 'sub-02',
    type: 'subjunctive',
    typeLabel: '虚拟语气',
    template: 'If + S + had + past participle, S + would/could/might + have + past participle ...',
    example: 'If I had studied harder, I would have passed the exam.',
    explanation:
      '对过去事实的虚拟：if从句用过去完成时had done，主句用would/could/might+have done。',
    difficulty: 2,
  },
  {
    id: 'sub-03',
    type: 'subjunctive',
    typeLabel: '虚拟语气',
    template: 'If + S + should/were to + base verb, S + would/could + base verb ...',
    example: 'If I were to choose a career, I would become a doctor.',
    explanation:
      '对将来事实的虚拟（可能性较小）：if从句用should do或were to do，主句用would/could+动词原形。',
    difficulty: 2,
  },

  // --- wish ---
  {
    id: 'sub-04',
    type: 'subjunctive',
    typeLabel: '虚拟语气',
    template: 'S + wish(es) + (that) + S + past tense ...',
    example: 'I wish I were taller so that I could play basketball better.',
    explanation:
      'wish+过去时表对现在事实的虚拟。be动词一律用were。表示与现状相反的愿望。',
    difficulty: 1,
  },
  {
    id: 'sub-05',
    type: 'subjunctive',
    typeLabel: '虚拟语气',
    template: 'S + wish(es) + (that) + S + had + past participle ...',
    example: 'She wishes she had taken that job opportunity.',
    explanation:
      'wish+过去完成时表对过去事实的虚拟。表示后悔过去没有做某事。',
    difficulty: 2,
  },
  {
    id: 'sub-06',
    type: 'subjunctive',
    typeLabel: '虚拟语气',
    template: 'S + wish(es) + (that) + S + would/could + base verb ...',
    example: 'I wish you would stop making so much noise.',
    explanation:
      'wish+would/could表示希望或请求对方做某事。含委婉语气，比直接请求更礼貌。',
    difficulty: 2,
  },

  // --- Suggest / demand / insist ---
  {
    id: 'sub-07',
    type: 'subjunctive',
    typeLabel: '虚拟语气',
    template: 'S + suggest/insist/demand/recommend + (that) + S + (should) + base verb ...',
    example: 'The teacher suggested that every student (should) read one book per month.',
    explanation:
      '在suggest, insist, demand, recommend等动词后的宾语从句中用虚拟语气：(should)+动词原形。should可省略。',
    difficulty: 2,
  },
  {
    id: 'sub-08',
    type: 'subjunctive',
    typeLabel: '虚拟语气',
    template: 'It is suggested/required/important + (that) + S + (should) + base verb ...',
    example: 'It is essential that every citizen (should) obey the law.',
    explanation:
      '在It is important/necessary/essential/suggested等后面的主语从句中用虚拟语气：(should)+动词原形。',
    difficulty: 2,
  },

  // --- as if / as though ---
  {
    id: 'sub-09',
    type: 'subjunctive',
    typeLabel: '虚拟语气',
    template: 'S + verb + as if/as though + S + past tense ... (与现在相反)',
    example: 'He talks as if he knew everything about the world.',
    explanation:
      'as if/as though引导的方式状语从句，如果表示与现在事实相反，用一般过去时（be用were）。knows→knew。',
    difficulty: 2,
  },
  {
    id: 'sub-10',
    type: 'subjunctive',
    typeLabel: '虚拟语气',
    template: 'S + verb + as if/as though + S + had + past participle ... (与过去相反)',
    example: 'He looked as if he had seen a ghost.',
    explanation:
      'as if/as though从句中如果表示与过去事实相反，用过去完成时。表示"看起来好像已经……了"。',
    difficulty: 3,
  },

  // --- would rather / it\'s time ---
  {
    id: 'sub-11',
    type: 'subjunctive',
    typeLabel: '虚拟语气',
    template: 'S + would rather + (that) + S + past tense ...',
    example: 'I would rather you stayed at home tonight.',
    explanation:
      'would rather后接从句时用虚拟语气：对现在用过去时，对过去用过去完成时。注意主语不一致时才有虚拟。',
    difficulty: 2,
  },
  {
    id: 'sub-12',
    type: 'subjunctive',
    typeLabel: '虚拟语气',
    template: "It's (high/about) time + S + past tense ...",
    example: "It's high time we took action to protect the environment.",
    explanation:
      `It's high/about time表示"是时候……了"，从句用一般过去时。含"早该如此"的催促语气。`,
    difficulty: 2,
  },

  // --- But for / without (含蓄虚拟) ---
  {
    id: 'sub-13',
    type: 'subjunctive',
    typeLabel: '虚拟语气',
    template: 'Without/But for + noun, S + would/could/might + have + past participle ...',
    example: 'Without your help, I couldn\'t have finished the project on time.',
    explanation:
      '含蓄虚拟条件句：用without/but for+名词代替if从句，表示"若非……"。主句用would/could have done。',
    difficulty: 2,
  },
  {
    id: 'sub-14',
    type: 'subjunctive',
    typeLabel: '虚拟语气',
    template: 'S + would have + past participle ... but for/because + fact',
    example: 'I would have gone to the party, but I was too tired.',
    explanation:
      'would have done表示与过去事实相反的虚拟，but后接真实原因。"本来会……但事实上没有"。',
    difficulty: 3,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. NESTED RELATIVE CLAUSES (定语从句嵌套)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- Basic relative clauses ---
  {
    id: 'rel-01',
    type: 'relative-clause',
    typeLabel: '定语从句嵌套',
    template: 'S + verb + noun + that/which + verb ... (限制性定语从句)',
    example: 'The book that/which I bought yesterday is very interesting.',
    explanation:
      'that/which引导限制性定语从句修饰先行词the book。在从句中bought的宾语省略了that/which。',
    difficulty: 1,
  },
  {
    id: 'rel-02',
    type: 'relative-clause',
    typeLabel: '定语从句嵌套',
    template: 'S + verb + person + who/that + verb ...',
    example: 'The scientist who discovered penicillin won the Nobel Prize.',
    explanation:
      'who/that引导限制性定语从句修饰人。先行词是the scientist，在从句中作主语，不能省略。',
    difficulty: 1,
  },
  {
    id: 'rel-03',
    type: 'relative-clause',
    typeLabel: '定语从句嵌套',
    template: 'S + verb + noun, which + verb ... (非限制性定语从句)',
    example: 'He passed the exam, which made his parents very happy.',
    explanation:
      'which引导非限制性定语从句，修饰前面整个句子。which不可用that替换，且不可省略。',
    difficulty: 2,
  },

  // --- Whose / where / when ---
  {
    id: 'rel-04',
    type: 'relative-clause',
    typeLabel: '定语从句嵌套',
    template: 'S + verb + noun + whose + noun + verb ...',
    example: 'The student whose father is a doctor wants to study medicine.',
    explanation:
      'whose引导定语从句表示所属关系。whose father = the student\'s father。whose可修饰人或物。',
    difficulty: 2,
  },
  {
    id: 'rel-05',
    type: 'relative-clause',
    typeLabel: '定语从句嵌套',
    template: 'S + verb + place + where + S + verb ...',
    example: 'This is the city where I was born and grew up.',
    explanation:
      'where引导定语从句修饰地点名词。where = in/at/on which。先行词可以是具体的地点名词。',
    difficulty: 1,
  },
  {
    id: 'rel-06',
    type: 'relative-clause',
    typeLabel: '定语从句嵌套',
    template: 'S + verb + time + when + S + verb ...',
    example: 'I will never forget the day when I first met you.',
    explanation:
      'when引导定语从句修饰时间名词。when = on/at/in which。先行词可以是day, year, moment等时间名词。',
    difficulty: 1,
  },

  // --- Nested / multiple clauses ---
  {
    id: 'rel-07',
    type: 'relative-clause',
    typeLabel: '定语从句嵌套',
    template: 'S + verb + noun + that/which + verb + noun + that/which + verb ...',
    example: 'The teacher who teaches the class that I attended yesterday is very knowledgeable.',
    explanation:
      '双层定语从句嵌套：who修饰the teacher，that修饰the class。两个从句层层修饰，信息逐步聚焦。',
    difficulty: 3,
  },
  {
    id: 'rel-08',
    type: 'relative-clause',
    typeLabel: '定语从句嵌套',
    template: 'S + verb + noun, which + verb ..., and which + verb ...',
    example: 'The project, which took three months to complete, and which involved many people, was finally approved.',
    explanation:
      '并列的非限制性定语从句：两个which从句用and连接，分别补充说明the project的不同方面。',
    difficulty: 3,
  },

  // --- Preposition + which ---
  {
    id: 'rel-09',
    type: 'relative-clause',
    typeLabel: '定语从句嵌套',
    template: 'S + verb + noun + prep + which + S + verb ...',
    example: 'The issue that we are concerned about is environmental protection.',
    explanation:
      '介词+which结构：be concerned about中的about提到关系代词which之前。正式写作中常将介词前置。',
    difficulty: 2,
  },
  {
    id: 'rel-10',
    type: 'relative-clause',
    typeLabel: '定语从句嵌套',
    template: 'This is the reason + for which / why + S + verb ...',
    example: 'This is the reason why/for which he was late for the meeting.',
    explanation:
      'why = for which，引导定语从句修饰reason。why更口语化，for which更正式。',
    difficulty: 2,
  },

  // --- "the way" and special cases ---
  {
    id: 'rel-11',
    type: 'relative-clause',
    typeLabel: '定语从句嵌套',
    template: 'S + verb + the way + (that/in which) + S + verb ...',
    example: 'I admire the way (that/in which) she handles difficult situations.',
    explanation:
      'the way后接定语从句时，关系词可用that, in which或省略。三种形式都正确，省略最常见。',
    difficulty: 2,
  },
  {
    id: 'rel-12',
    type: 'relative-clause',
    typeLabel: '定语从句嵌套',
    template: 'As + S + verb ..., so + S + verb ... (as引导的特殊定语从句)',
    example: 'As the saying goes, "Practice makes perfect."',
    explanation:
      'as引导非限制性定语从句，可放在句首，常用于引用谚语或固定表达。as代替后面整个句子的内容。',
    difficulty: 2,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. MIXED INVERSION + EMPHASIS (倒装+强调混合)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'mix-01',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'Not until + event + did + S + realize + (that) + emphasis clause',
    example: 'Not until he failed did he realize how important preparation was.',
    explanation:
      'Not until引起倒装（did提前），内部包含强调句的含义。整句表达"直到失败他才意识到……的重要性"。',
    difficulty: 3,
  },
  {
    id: 'mix-02',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'Only when + S + verb ... did + S + realize + emphasis clause',
    example: 'Only when I left home did I realize how much my parents had done for me.',
    explanation:
      'Only when从句不倒装，主句部分倒装（did提前）。同时主句隐含强调意味——强调"我才意识到"。',
    difficulty: 3,
  },
  {
    id: 'mix-03',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'Rarely + have + S + experienced + such + emphasis noun + that + result',
    example: 'Rarely have we experienced such a severe winter that many pipes froze.',
    explanation:
      'Rarely引起部分倒装，同时such...that结构提供强调结果。双重修辞效果使句子更有力度。',
    difficulty: 3,
  },
  {
    id: 'mix-04',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'So + past participle + be + S + that it + emphasis verb + rest',
    example: 'So moved was she that it took her a long time to calm down.',
    explanation:
      'So+过去分词提前引起倒装（was提前），that从句说明结果。强调程度之深以至于……',
    difficulty: 3,
  },
  {
    id: 'mix-05',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'Had + S + past participle + emphasis noun/pronoun + not ...',
    example: 'Had it not been for the Internet, the whole world would not have been connected.',
    explanation:
      '省略if的虚拟条件句（had提前）+含蓄虚拟（had it not been for = if it had not been for），表示对过去事实的虚拟。',
    difficulty: 3,
  },
  {
    id: 'mix-06',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'Under no circumstances + should + S + emphasis verb + without + consideration',
    example: 'Under no circumstances should we make decisions without careful consideration.',
    explanation:
      'Under no circumstances引起倒装（should提前），同时整句含强调语气——在任何情况下都不应该……',
    difficulty: 3,
  },
  {
    id: 'mix-07',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'It was + not until + emphasis time + that + S + past tense (倒装+强调)',
    example: 'It was not until the bell rang that the students stopped talking.',
    explanation:
      'It was not until...that强调句型，强调时间状语。that从句用正常语序，外部是强调结构。',
    difficulty: 3,
  },
  {
    id: 'mix-08',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'Not only + did/does + S + verb + emphasis object, but + S + also + verb ...',
    example: 'Not only did she win the first prize, but she also broke the school record.',
    explanation:
      'Not only引起前半句倒装（did提前），but also连接的后半句不倒装。前后并列形成递进强调。',
    difficulty: 3,
  },
  {
    id: 'mix-09',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'Seldom + has + S + emphasis verb + such + adj + noun + as + example',
    example: 'Seldom has there been such an inspiring story as that of Helen Keller.',
    explanation:
      'Seldom引起倒装（has提前），such...as结构强调程度和举例。整句表达"很少有像……这样……的"。',
    difficulty: 3,
  },
  {
    id: 'mix-10',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'Never before + has + S + emphasis verb + something + so + adj + as + comparison',
    example: 'Never before has the world faced a challenge so great as climate change.',
    explanation:
      'Never before引起倒装（has提前），so...as结构强调比较。表达"世界从未面对过像……这样……的挑战"。',
    difficulty: 3,
  },
  {
    id: 'mix-11',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'So + adj + be + S + that + S + cannot help + V-ing ...',
    example: 'So beautiful was the scenery that we could not help taking photos.',
    explanation:
      'So+形容词提前引起倒装（was提前），that从句表达结果，cannot help doing表示"忍不住"。倒装增强感叹语气。',
    difficulty: 3,
  },
  {
    id: 'mix-12',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'It + emphasis verb + that + S + not only + verb ..., but also + verb ... (强调+递进)',
    example: 'It should be noted that not only does this policy benefit the economy, but it also protects the environment.',
    explanation:
      'It is...that强调句包裹not only倒装结构。not only从句倒装（does提前），but also从句不倒装，形成递进。',
    difficulty: 3,
  },
  {
    id: 'mix-13',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'Hardly + had + S + past participle + emphasis time + when + S + past tense ...',
    example: 'Hardly had she started speaking when the audience burst into applause.',
    explanation:
      'Hardly...when表示"刚……就……"，Hardly引起倒装，内含强调时间点的意味。强调反应之快。',
    difficulty: 3,
  },
  {
    id: 'mix-14',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'Not only + have/has + S + past participle + emphasis object, but + S + also + verb ...',
    example: 'Not only has the company increased its profits, but it also expanded into international markets.',
    explanation:
      'Not only引起倒装（have提前），但also从句不倒装。同时强调"不仅……而且……"的递进关系。适合议论文写作。',
    difficulty: 3,
  },
  {
    id: 'mix-15',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'Were + S + not for + noun, S + would/could + have + past participle ... (虚拟倒装)',
    example: 'Were it not for the support of my family, I would never have succeeded.',
    explanation:
      '省略if的虚拟条件句（Were提前）+含蓄虚拟（Were it not for = If it were not for）。倒装使句子更正式、更有力度。',
    difficulty: 3,
  },
  {
    id: 'mix-16',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'Never + have/has + S + past participle + so + adj + noun + as + emphasis comparison',
    example: 'Never have we witnessed so rapid a technological advancement as we see today.',
    explanation:
      'Never引起倒装（have提前），so+adj+a+noun是so...that的变体，as引导比较。整句强调程度之前所未有。',
    difficulty: 3,
  },
  {
    id: 'mix-17',
    type: 'mixed',
    typeLabel: '倒装+强调混合',
    template: 'Had + S + known + emphasis object + earlier, S + would/could + have + past participle ...',
    example: 'Had I known the consequences earlier, I would have made a different decision.',
    explanation:
      '省略if的虚拟条件句（Had提前）强调假设条件，主句用would have done表示对过去事实的虚拟。表达事后后悔。',
    difficulty: 3,
  },
]
