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
  },
  {
    id: 'paragraph-ordering',
    name: '段落排序',
    description: '将打乱的段落按正确逻辑顺序排列，理解文章结构',
    estimatedTime: '5-8分钟',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    availableFor: ['chinese', 'english'],
  },
  {
    id: 'argument-chain',
    name: '论证链条',
    description: '构建完整的论证链条：论点→论据→分析→小结',
    estimatedTime: '15-20分钟',
    difficulty: 'medium',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    availableFor: ['chinese', 'english'],
  },
  {
    id: 'multi-angle',
    name: '多角度分析',
    description: '从个人、社会、历史等多角度分析话题，拓展思维广度',
    estimatedTime: '15-20分钟',
    difficulty: 'medium',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    availableFor: ['chinese', 'english'],
  },
  {
    id: 'paragraph-cards',
    name: '提纲编写',
    description: '用简洁的卡片形式搭建文章骨架，训练结构化思维',
    estimatedTime: '10-15分钟',
    difficulty: 'easy',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
    availableFor: ['chinese'],
  },
  {
    id: 'writing-psychology',
    name: '写作心理训练',
    description: '掌握考场应急策略，从容应对审题困惑、卡壳、时间不足等困境',
    estimatedTime: '10-15分钟',
    difficulty: 'easy',
    icon: <ThinkingIcon size={20} />,
    availableFor: ['chinese', 'english'],
  },
]

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: '基础',
  medium: '进阶',
  hard: '挑战',
}

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  easy: { bg: '#f0fdf4', text: '#16a34a' },
  medium: { bg: '#fffbeb', text: '#d97706' },
  hard: { bg: '#fef2f2', text: '#dc2626' },
}

export default function ThinkingTrainingHub({ subject, onSelectTraining }: ThinkingTrainingHubProps) {
  const available = TRAINING_TYPES.filter((t) => t.availableFor.includes(subject))

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {available.map((training) => {
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
                e.currentTarget.style.borderColor = '#3b82f6'
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
        })}
      </div>
    </div>
  )
}
