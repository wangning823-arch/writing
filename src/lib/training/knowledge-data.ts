export interface KnowledgeNode {
  id: string
  name: string
  category: string
  description: string
  level: 'basic' | 'intermediate' | 'advanced'
}

export interface KnowledgeEdge {
  from: string
  to: string
  relation: string
}

export const KNOWLEDGE_NODES: KnowledgeNode[] = [
  // 审题立意
  { id: 'topic-analysis', name: '审题立意', category: '思维能力', description: '分析题目要求，确立中心论点', level: 'basic' },
  { id: 'key-words', name: '关键词提取', category: '思维能力', description: '识别题目中的核心概念', level: 'basic' },
  { id: 'depth-thinking', name: '深度思考', category: '思维能力', description: '透过现象看本质', level: 'advanced' },
  { id: 'dialectical', name: '辩证思维', category: '思维能力', description: '正反论证、让步转折', level: 'intermediate' },

  // 结构层次
  { id: 'structure', name: '文章结构', category: '结构能力', description: '整体谋篇布局', level: 'basic' },
  { id: 'paragraph-order', name: '段落排序', category: '结构能力', description: '段落间的逻辑顺序', level: 'basic' },
  { id: 'transition', name: '过渡衔接', category: '结构能力', description: '段落间的自然过渡', level: 'intermediate' },
  { id: 'opening', name: '开头技巧', category: '结构能力', description: '引人入胜的开头', level: 'intermediate' },
  { id: 'ending', name: '结尾升华', category: '结构能力', description: '总结全文并升华', level: 'intermediate' },

  // 论据论证
  { id: 'argument', name: '论证方法', category: '论证能力', description: '举例、道理、对比等论证', level: 'basic' },
  { id: 'evidence', name: '论据选择', category: '论证能力', description: '恰当有力的论据', level: 'basic' },
  { id: 'argument-chain', name: '论证链条', category: '论证能力', description: '论点→论据→分析→小结', level: 'intermediate' },
  { id: 'multi-angle', name: '多角度分析', category: '论证能力', description: '从多维度论证', level: 'intermediate' },
  { id: 'logic', name: '逻辑推理', category: '论证能力', description: '因果链、类比、反证', level: 'advanced' },

  // 语言表达
  { id: 'language', name: '语言表达', category: '语言能力', description: '通顺、准确、有文采', level: 'basic' },
  { id: 'rhetoric', name: '修辞手法', category: '语言能力', description: '比喻、拟人、排比等', level: 'intermediate' },
  { id: 'sentence', name: '句式变换', category: '语言能力', description: '长短句、整散句', level: 'intermediate' },
  { id: 'vocab', name: '用词准确', category: '语言能力', description: '精准的词语选择', level: 'basic' },

  // 写作习惯
  { id: 'pre-writing', name: '构思引导', category: '写作习惯', description: '动笔前的思考', level: 'basic' },
  { id: 'revision', name: '修改完善', category: '写作习惯', description: '自检和修改', level: 'basic' },
  { id: 'daily-practice', name: '每日练习', category: '写作习惯', description: '坚持写作', level: 'basic' },
  { id: 'reading', name: '精读积累', category: '写作习惯', description: '阅读优秀范文', level: 'basic' },
]

export const KNOWLEDGE_EDGES: KnowledgeEdge[] = [
  { from: 'key-words', to: 'topic-analysis', relation: '基础' },
  { from: 'depth-thinking', to: 'topic-analysis', relation: '进阶' },
  { from: 'dialectical', to: 'depth-thinking', relation: '方法' },
  { from: 'paragraph-order', to: 'structure', relation: '基础' },
  { from: 'transition', to: 'structure', relation: '技巧' },
  { from: 'opening', to: 'structure', relation: '部分' },
  { from: 'ending', to: 'structure', relation: '部分' },
  { from: 'evidence', to: 'argument', relation: '基础' },
  { from: 'argument-chain', to: 'argument', relation: '进阶' },
  { from: 'multi-angle', to: 'argument', relation: '进阶' },
  { from: 'logic', to: 'multi-angle', relation: '深化' },
  { from: 'rhetoric', to: 'language', relation: '技巧' },
  { from: 'sentence', to: 'language', relation: '技巧' },
  { from: 'vocab', to: 'language', relation: '基础' },
  { from: 'pre-writing', to: 'topic-analysis', relation: '前置' },
  { from: 'revision', to: 'structure', relation: '后置' },
  { from: 'daily-practice', to: 'language', relation: '积累' },
  { from: 'reading', to: 'language', relation: '积累' },
]

export function getKnowledgeByCategory(category: string) {
  return KNOWLEDGE_NODES.filter(n => n.category === category)
}

export function getConnectedNodes(nodeId: string) {
  const connected = new Set<string>()
  KNOWLEDGE_EDGES.forEach(e => {
    if (e.from === nodeId) connected.add(e.to)
    if (e.to === nodeId) connected.add(e.from)
  })
  return KNOWLEDGE_NODES.filter(n => connected.has(n.id))
}
