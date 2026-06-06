'use client'

import { ThinkingIcon } from '@/components/icons'

type Subject = 'chinese' | 'english'

interface ThinkingTrainingHubProps {
  subject: Subject
  onSelectTraining: (type: string) => void
}

interface TrainingType {
  id: string
  name: string
  description: string
  estimatedTime: string
  difficulty: 'easy' | 'medium' | 'hard'
  icon: React.ReactNode
  availableFor: Subject[]
  category: 'core' | 'sidebar'
}

const TRAINING_TYPES: TrainingType[] = [
  {
    id: 'topic-analysis',
    name: '审题立意',
    description: '分析题目关键词，确立中心论点，培养精准审题能力',
    estimatedTime: '5-10分钟',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    availableFor: ['chinese'],
    category: 'core',
  },
  {
    id: 'paragraph-ordering',
    name: '段落排序',
    description: '将打乱的段落按正确逻辑顺序排列，理解文章结构',
    estimatedTime: '5-8分钟',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'core',
  },
  {
    id: 'argument-chain',
    name: '论证链条',
    description: '构建完整的论证链条：论点→论据→分析→小结',
    estimatedTime: '15-20分钟',
    difficulty: 'medium',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'core',
  },
  {
    id: 'multi-angle',
    name: '多角度分析',
    description: '从个人、社会、历史等多角度分析话题，拓展思维广度',
    estimatedTime: '15-20分钟',
    difficulty: 'medium',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'core',
  },
  {
    id: 'paragraph-cards',
    name: '提纲编写',
    description: '用简洁的卡片形式搭建文章骨架，训练结构化思维',
    estimatedTime: '10-15分钟',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
    availableFor: ['chinese'],
    category: 'core',
  },
  {
    id: 'writing-psychology',
    name: '写作心理训练',
    description: '掌握考场应急策略，从容应对审题困惑、卡壳、时间不足等困境',
    estimatedTime: '10-15分钟',
    difficulty: 'easy',
    icon: <ThinkingIcon size={20} />,
    availableFor: ['chinese', 'english'],
    category: 'core',
  },
  {
    id: 'deep-reading',
    name: '精读训练',
    description: '逐段批注范文，学习写作技巧，培养深度阅读能力',
    estimatedTime: '20-30分钟',
    difficulty: 'medium',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'core',
  },
  {
    id: 'dialectical-thinking',
    name: '辩证思维训练',
    description: '正反论证、让步转折，培养多角度辩证思考能力',
    estimatedTime: '15-20分钟',
    difficulty: 'medium',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'core',
  },
  {
    id: 'concept-analysis',
    name: '概念辨析训练',
    description: '近义词辨析、概念定义，提升概念理解的准确性',
    estimatedTime: '10-15分钟',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'core',
  },
  {
    id: 'logic-reasoning',
    name: '逻辑推理训练',
    description: '因果链、类比推理、谬误识别，强化逻辑思维',
    estimatedTime: '15-20分钟',
    difficulty: 'hard',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'core',
  },
  {
    id: 'rhetoric-training',
    name: '修辞手法训练',
    description: '识别、仿写、应用比喻、排比、拟人等11种修辞手法',
    estimatedTime: '15-20分钟',
    difficulty: 'medium',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    availableFor: ['chinese'],
    category: 'core',
  },
  {
    id: 'sentence-transformation',
    name: '句式变换训练',
    description: '长短句、整散句、倒装句、句式升级，提升语言多样性',
    estimatedTime: '10-15分钟',
    difficulty: 'medium',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>,
    availableFor: ['chinese'],
    category: 'core',
  },
  {
    id: 'argumentation-library',
    name: '论证方法库',
    description: '掌握举例、道理、对比、比喻、引用、假设、因果7种论证方法',
    estimatedTime: '15-20分钟',
    difficulty: 'medium',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    availableFor: ['chinese'],
    category: 'core',
  },
  {
    id: 'pre-writing',
    name: '构思引导',
    description: '苏格拉底式提问引导，从头脑风暴到提纲完善的全流程构思',
    estimatedTime: '15-20分钟',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'core',
  },
  {
    id: 'revision-guide',
    name: '修改自检清单',
    description: '分层级自检清单，逐项检查审题、结构、论据、语言等维度',
    estimatedTime: '10-15分钟',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'sidebar',
  },
  {
    id: 'ability-diagnosis',
    name: '能力诊断报告',
    description: '基于训练数据的多维度写作能力分析，生成个性化诊断报告',
    estimatedTime: '5-10分钟',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'sidebar',
  },
  {
    id: 'personalized-path',
    name: '个性化训练路径',
    description: '根据能力诊断推荐最优训练序列，针对性提升薄弱环节',
    estimatedTime: '按需',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'sidebar',
  },
  {
    id: 'daily-checkin',
    name: '每日写作打卡',
    description: '坚持每天写作，记录连续打卡天数，养成写作习惯',
    estimatedTime: '10-15分钟',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'sidebar',
  },
  {
    id: 'journal',
    name: '随笔本',
    description: '自由写作，记录思考，无评分压力的写作空间',
    estimatedTime: '不限',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'sidebar',
  },
  {
    id: 'current-reading',
    name: '时文阅读推荐',
    description: '每周精选时文，积累写作素材，拓展视野',
    estimatedTime: '15-20分钟',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'sidebar',
  },
  {
    id: 'gaokao-practice',
    name: '高考真题实战',
    description: '按年份和地区浏览高考真题，模拟考场写作训练',
    estimatedTime: '45-60分钟',
    difficulty: 'hard',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    availableFor: ['chinese'],
    category: 'core',
  },
  {
    id: 'comprehensive-training',
    name: '综合写作训练',
    description: '审题→提纲→写作→修改，全流程系统化训练',
    estimatedTime: '60-90分钟',
    difficulty: 'hard',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    availableFor: ['chinese'],
    category: 'core',
  },
  {
    id: 'knowledge-graph',
    name: '写作知识图谱',
    description: '可视化展示写作知识体系，了解知识点间的关联关系',
    estimatedTime: '10-15分钟',
    difficulty: 'medium',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="9" x2="19" y2="5"/><line x1="12" y1="9" x2="5" y2="5"/><line x1="12" y1="15" x2="5" y2="19"/><line x1="12" y1="15" x2="19" y2="19"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'sidebar',
  },
  {
    id: 'language-style',
    name: '语言风格训练',
    description: '识别、模仿、分析不同语言风格，提升表达多样性',
    estimatedTime: '15-20分钟',
    difficulty: 'medium',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'core',
  },
  {
    id: 'error-pattern',
    name: '错误模式分析',
    description: '分析常见错误类型和趋势，针对性改进',
    estimatedTime: '5-10分钟',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'sidebar',
  },
  {
    id: 'essay-showcase',
    name: '优秀作文展示',
    description: '浏览高分范文，学习优秀写作技巧',
    estimatedTime: '15-20分钟',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'sidebar',
  },
  {
    id: 'writing-goals',
    name: '写作目标管理',
    description: '设定写作目标，追踪完成进度',
    estimatedTime: '5分钟',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    availableFor: ['chinese', 'english'],
    category: 'sidebar',
  },
]

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: '基础',
  medium: '进阶',
  hard: '挑战',
}

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  easy: { bg: 'var(--success-light)', text: 'var(--success-dark)' },
  medium: { bg: 'var(--warning-light)', text: 'var(--warning-dark)' },
  hard: { bg: 'var(--danger-light)', text: 'var(--danger-dark)' },
}

export default function ThinkingTrainingHub({ subject, onSelectTraining }: ThinkingTrainingHubProps) {
  const coreTrainings = TRAINING_TYPES.filter((t) => t.availableFor.includes(subject) && t.category === 'core')
  const sidebarItems = TRAINING_TYPES.filter((t) => t.availableFor.includes(subject) && t.category === 'sidebar')

  const renderCard = (training: TrainingType) => {
    const diffColor = DIFFICULTY_COLORS[training.difficulty]
    return (
      <button
        key={training.id}
        onClick={() => onSelectTraining(training.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1.25rem',
          borderRadius: '0.75rem',
          border: '1px solid var(--border-color, #e5e7eb)',
          background: 'var(--bg-card, #fff)',
          textAlign: 'left',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          width: '100%',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--theme_button-primary)'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color, #e5e7eb)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <span
          style={{
            width: '3rem',
            height: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0.75rem',
            background: 'var(--bg-secondary, #f9fafb)',
            flexShrink: 0,
            color: 'var(--text-primary, #111827)',
          }}
        >
          {training.icon}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.25rem',
            }}
          >
            <h3
              style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--text-primary, #111827)',
                margin: 0,
              }}
            >
              {training.name}
            </h3>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                background: diffColor.bg,
                color: diffColor.text,
              }}
            >
              {DIFFICULTY_LABELS[training.difficulty]}
            </span>
          </div>
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-secondary, #6b7280)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {training.description}
          </p>
        </div>

        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.25rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-tertiary, #9ca3af)',
            }}
          >
            {training.estimatedTime}
          </span>
          <span
            style={{
              fontSize: '1rem',
              color: 'var(--text-tertiary, #9ca3af)',
            }}
          >
            →
          </span>
        </div>
      </button>
    )
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--text-primary, #111827)',
            marginBottom: '0.5rem',
          }}
        >
          思维训练中心
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary, #6b7280)',
          }}
        >
          {subject === 'chinese' ? '语文' : '英语'} &middot; 选择训练类型，提升写作思维能力
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* 左侧 - 核心训练区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-secondary, #6b7280)',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            核心训练
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {coreTrainings.map(renderCard)}
          </div>
        </div>

        {/* 右侧 - 辅助功能区 */}
        <div style={{ width: '280px', flexShrink: 0 }}>
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-secondary, #6b7280)',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            辅助工具
          </h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              padding: '1rem',
              borderRadius: '0.75rem',
              background: 'var(--bg-secondary, #f9fafb)',
              border: '1px solid var(--border-color, #e5e7eb)',
            }}
          >
            {sidebarItems.map((training) => (
              <button
                key={training.id}
                onClick={() => onSelectTraining(training.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: 'var(--bg-card, #fff)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span
                  style={{
                    width: '2rem',
                    height: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '0.5rem',
                    background: 'var(--bg-secondary, #f3f4f6)',
                    flexShrink: 0,
                    color: 'var(--text-primary, #111827)',
                  }}
                >
                  {training.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: 'var(--text-primary, #111827)',
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {training.name}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-tertiary, #9ca3af)',
                      margin: 0,
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {training.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
