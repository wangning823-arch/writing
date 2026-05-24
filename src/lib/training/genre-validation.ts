export interface GenreRule {
  genre: string
  subject: 'chinese' | 'english'
  coreFeatures: string[]
  requirements: string[]
  commonMistakes: string[]
}

export interface GenreValidationResult {
  isConsistent: boolean
  issues: string[]
  suggestions: string[]
  detectedGenre: string
  confidence: number
}

export const CHINESE_GENRES: GenreRule[] = [
  {
    genre: '议论文',
    subject: 'chinese',
    coreFeatures: ['观点明确', '论据充分', '论证严密', '逻辑清晰'],
    requirements: [
      '必须有明确的中心论点',
      '至少使用2-3个论据支撑论点',
      '论据要多样化（事例、道理、对比等）',
      '段落之间要有逻辑衔接',
      '结尾要回扣论点并升华',
    ],
    commonMistakes: [
      '叙事过多，缺乏议论',
      '论点不明确或多个论点并列',
      '论据与论点不匹配',
      '缺少过渡，段落脱节',
      '结尾草率，没有总结升华',
    ],
  },
  {
    genre: '记叙文',
    subject: 'chinese',
    coreFeatures: ['叙事完整', '人物鲜明', '情感真挚', '细节生动'],
    requirements: [
      '要有完整的叙事线索（起因-经过-结果）',
      '人物描写要生动（外貌、语言、动作、心理）',
      '要有真情实感',
      '可以使用倒叙、插叙等手法',
      '结尾要有感悟或点题',
    ],
    commonMistakes: [
      '流水账式叙述，缺乏重点',
      '人物形象扁平，缺乏细节',
      '叙述过多，描写不足',
      '情感虚假或过度煽情',
      '跑题，与题目关联不紧密',
    ],
  },
  {
    genre: '散文',
    subject: 'chinese',
    coreFeatures: ['形散神聚', '意境优美', '情感细腻', '语言凝练'],
    requirements: [
      '要有贯穿全文的线索或主题',
      '语言要有文学性和美感',
      '善于运用修辞手法',
      '情感表达要含蓄隽永',
      '结构要散而不乱',
    ],
    commonMistakes: [
      '形散神也散，缺乏主线',
      '语言过于平实，缺乏文采',
      '堆砌辞藻，内容空洞',
      '情感表达过于直白',
      '与议论文、记叙文体裁混淆',
    ],
  },
  {
    genre: '应用文',
    subject: 'chinese',
    coreFeatures: ['格式规范', '语言得体', '内容明确', '目的清晰'],
    requirements: [
      '严格按照应用文格式写作',
      '语言要符合场合（正式/非正式）',
      '内容要切合实际需求',
      '称呼、落款等格式要素完整',
      '字数要符合要求',
    ],
    commonMistakes: [
      '格式不规范，缺少必要要素',
      '语言不得体，过于口语化',
      '内容偏离实际需求',
      '称呼不当或落款缺失',
      '字数严重不足',
    ],
  },
]

export const ENGLISH_GENRES: GenreRule[] = [
  {
    genre: '应用文',
    subject: 'english',
    coreFeatures: ['Format accuracy', 'Appropriate tone', 'Clear purpose', 'Complete structure'],
    requirements: [
      'Follow the standard letter/email format',
      'Use appropriate salutation and closing',
      'Maintain a consistent tone throughout',
      'Include all required information',
      'Use formal language for formal letters',
    ],
    commonMistakes: [
      'Missing date, address, or closing',
      'Using informal language in formal letters',
      'Grammar errors in standard phrases',
      'Incomplete information',
      'Wrong salutation or closing formula',
    ],
  },
  {
    genre: '读后续写',
    subject: 'english',
    coreFeatures: ['Coherent continuation', 'Character consistency', 'Creative development', 'Emotional depth'],
    requirements: [
      'Seamlessly connect with the original text',
      'Maintain the same tense and point of view',
      'Develop the plot logically',
      'Create vivid descriptions and dialogue',
      'End with a satisfying resolution',
    ],
    commonMistakes: [
      'Contradicting the original plot',
      'Changing the tense or narrator',
      'Repeating what already happened',
      'Lack of descriptive details',
      'Abrupt or unresolved ending',
    ],
  },
  {
    genre: '概要写作',
    subject: 'english',
    coreFeatures: ['Conciseness', 'Accuracy', 'Objectivity', 'Coherence'],
    requirements: [
      'Capture the main idea of each paragraph',
      'Use your own words (not copy sentences)',
      'Maintain objectivity - do not add opinions',
      'Keep within the word limit',
      'Use appropriate linking words',
    ],
    commonMistakes: [
      'Copying sentences from the original',
      'Including minor details instead of main ideas',
      'Adding personal opinions',
      'Exceeding the word limit',
      'Missing key points',
    ],
  },
]

export function getGenreRules(subject: 'chinese' | 'english'): GenreRule[] {
  return subject === 'chinese' ? CHINESE_GENRES : ENGLISH_GENRES
}

export function validateGenre(
  essay: string,
  targetGenre: string,
  subject: 'chinese' | 'english'
): GenreValidationResult {
  const genres = getGenreRules(subject)
  const rule = genres.find(g => g.genre === targetGenre)

  if (!rule) {
    return {
      isConsistent: false,
      issues: [`未找到文体"${targetGenre}"的校验规则`],
      suggestions: [`可选文体：${genres.map(g => g.genre).join('、')}`],
      detectedGenre: targetGenre,
      confidence: 0,
    }
  }

  const issues: string[] = []
  const suggestions: string[] = []
  let confidence = 0.5

  if (subject === 'chinese') {
    if (targetGenre === '议论文') {
      // Check for argumentative markers
      const hasArgumentMarkers = /因此|所以|由此可见|综上|总之|显然|毫无疑问|不难发现/.test(essay)
      const hasExamples = /例如|比如|譬如|以.*为例|正如|正如.*所说/.test(essay)
      const narrativeRatio = (essay.match(/[，。]/g)?.length || 0) / Math.max(essay.length, 1)

      if (hasArgumentMarkers) confidence += 0.15
      if (hasExamples) confidence += 0.15
      if (narrativeRatio > 0.02) confidence += 0.1

      // Check for narrative dominance (bad for argumentative)
      const narrativeMarkers = /那天|有一次|记得|小时候|曾经/.test(essay)
      const argumentMarkers = /因此|所以|由此可见|这说明|由此可见/.test(essay)
      if (narrativeMarkers && !argumentMarkers) {
        issues.push('文章叙事成分过多，缺乏议论分析')
        suggestions.push('增加议论分析，减少叙事篇幅')
      }
    } else if (targetGenre === '记叙文') {
      const hasNarrativeElements = /那天|有一次|记得|小时候|曾经|然后/.test(essay)
      const hasDescriptions = /她的眼神|他微笑着|阳光洒在|空气中弥漫/.test(essay)

      if (hasNarrativeElements) confidence += 0.15
      if (hasDescriptions) confidence += 0.15

      // Check for excessive argumentation in narrative
      const excessiveArgument = /因此|所以|由此可见|综上所述|这充分说明/.test(essay)
      if (excessiveArgument) {
        issues.push('记叙文中议论成分过多，影响叙事连贯性')
        suggestions.push('将议论融入叙事中，或在结尾处简要点题')
      }
    }
  } else {
    // English genre checks
    if (targetGenre === '应用文') {
      const hasLetterFormat = /Dear|Sincerely|Yours|Best regards/i.test(essay)
      const hasDate = /\d{4}|January|February|March|April|May|June|July|August|September|October|November|December/i.test(essay)

      if (hasLetterFormat) confidence += 0.2
      if (hasDate) confidence += 0.1

      if (!hasLetterFormat) {
        issues.push('缺少书信格式要素（称呼/落款）')
        suggestions.push('添加Dear...和Yours sincerely/faithfully等格式')
      }
    } else if (targetGenre === '读后续写') {
      const connectiveWords = /Suddenly|However|Then|Afterwards|Meanwhile|Eventually/i.test(essay)
      if (connectiveWords) confidence += 0.15
    }
  }

  // Word count check
  const wordCount = subject === 'chinese'
    ? essay.replace(/\s/g, '').length
    : essay.trim().split(/\s+/).length

  if (wordCount < 50) {
    issues.push('内容过短，无法充分展现文体特征')
    suggestions.push('扩展内容，确保达到基本字数要求')
    confidence *= 0.6
  }

  confidence = Math.min(confidence, 0.95)

  return {
    isConsistent: issues.length === 0,
    issues,
    suggestions,
    detectedGenre: targetGenre,
    confidence,
  }
}
