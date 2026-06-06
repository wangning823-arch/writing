'use client'

import { useState } from 'react'

interface RevisionGuideProps {
  subject: 'chinese' | 'english'
  essayContent?: string
  genre?: string
}

interface CheckItem {
  id: string
  category: string
  level: 'L1' | 'L2' | 'L3'
  label: string
  description: string
}

const CHECKLISTS: Record<string, CheckItem[]> = {
  chinese: [
    { id: 'c1', category: '审题立意', level: 'L1', label: '是否紧扣题意', description: '检查文章是否准确理解题意，没有偏题' },
    { id: 'c2', category: '审题立意', level: 'L1', label: '中心论点是否明确', description: '文章是否有清晰的中心论点或主题' },
    { id: 'c3', category: '审题立意', level: 'L2', label: '立意是否有深度', description: '是否透过现象看本质，有独到见解' },
    { id: 'c4', category: '结构层次', level: 'L1', label: '开头是否点题', description: '开头段是否自然引出话题，点明主旨' },
    { id: 'c5', category: '结构层次', level: 'L1', label: '段落是否完整', description: '是否有开头、主体、结尾三部分' },
    { id: 'c6', category: '结构层次', level: 'L2', label: '过渡是否自然', description: '段落之间是否有恰当的过渡衔接' },
    { id: 'c7', category: '结构层次', level: 'L2', label: '结尾是否升华', description: '结尾是否总结全文并有所升华' },
    { id: 'c8', category: '论据论证', level: 'L1', label: '论据是否恰当', description: '使用的论据是否能支撑论点' },
    { id: 'c9', category: '论据论证', level: 'L2', label: '论据是否多元', description: '是否使用了多种类型的论据（事例、道理、数据等）' },
    { id: 'c10', category: '论据论证', level: 'L2', label: '论证是否严密', description: '论证过程是否有逻辑漏洞' },
    { id: 'c11', category: '语言表达', level: 'L1', label: '语句是否通顺', description: '是否有病句、错别字' },
    { id: 'c12', category: '语言表达', level: 'L2', label: '用词是否准确', description: '关键词语使用是否恰当' },
    { id: 'c13', category: '语言表达', level: 'L3', label: '是否有文采', description: '是否运用了修辞手法、引用等提升文采' },
    { id: 'c14', category: '书写规范', level: 'L1', label: '标点是否正确', description: '标点符号使用是否规范' },
    { id: 'c15', category: '书写规范', level: 'L1', label: '字数是否达标', description: '文章字数是否符合要求' },
  ],
  english: [
    { id: 'e1', category: 'Content', level: 'L1', label: 'Topic relevance', description: 'Does the essay address the prompt directly?' },
    { id: 'e2', category: 'Content', level: 'L1', label: 'Thesis clarity', description: 'Is there a clear thesis statement?' },
    { id: 'e3', category: 'Content', level: 'L2', label: 'Depth of analysis', description: 'Does the essay go beyond surface-level discussion?' },
    { id: 'e4', category: 'Organization', level: 'L1', label: 'Introduction hooks reader', description: 'Does the opening engage the reader?' },
    { id: 'e5', category: 'Organization', level: 'L1', label: 'Paragraph completeness', description: 'Does each paragraph have a topic sentence, evidence, and analysis?' },
    { id: 'e6', category: 'Organization', level: 'L2', label: 'Transitions', description: 'Are ideas connected with appropriate transitions?' },
    { id: 'e7', category: 'Organization', level: 'L2', label: 'Conclusion strength', description: 'Does the conclusion summarize and provide closure?' },
    { id: 'e8', category: 'Evidence', level: 'L1', label: 'Supporting evidence', description: 'Are claims supported with evidence?' },
    { id: 'e9', category: 'Evidence', level: 'L2', label: 'Evidence variety', description: 'Are different types of evidence used?' },
    { id: 'e10', category: 'Language', level: 'L1', label: 'Grammar accuracy', description: 'Are there grammar errors?' },
    { id: 'e11', category: 'Language', level: 'L2', label: 'Vocabulary range', description: 'Is there variety in word choice?' },
    { id: 'e12', category: 'Language', level: 'L3', label: 'Sentence variety', description: 'Are there different sentence structures?' },
  ],
}

export default function RevisionGuide({ subject, essayContent, genre }: RevisionGuideProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const checklist = CHECKLISTS[subject] || CHECKLISTS.chinese
  const categories = [...new Set(checklist.map(item => item.category))]

  const toggleCheck = (id: string) => {
    const next = new Set(checked)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setChecked(next)
  }

  const totalItems = checklist.length
  const checkedCount = checked.size
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'L1': return { bg: 'var(--primary-100)', text: 'var(--primary-700)' }
      case 'L2': return { bg: 'var(--topic-info-bg)', text: 'var(--topic-info-text)' }
      case 'L3': return { bg: '#fce7f3', text: '#9d174d' }
      default: return { bg: '#f3f4f6', text: '#374151' }
    }
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
        修改自检清单
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1rem' }}>
        按层级逐步检查，确保文章质量
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)' }}>完成进度</span>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: progress >= 80 ? 'var(--success-dark)' : 'var(--theme_button-primary)' }}>{checkedCount}/{totalItems} ({progress}%)</span>
        </div>
        <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border-color, #e5e7eb)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, borderRadius: '3px', background: progress >= 80 ? 'var(--success-dark)' : 'var(--theme_button-primary)', transition: 'width 0.3s' }} />
        </div>
      </div>

      {categories.map(cat => {
        const items = checklist.filter(item => item.category === cat)
        const catChecked = items.filter(item => checked.has(item.id)).length
        const isExpanded = expandedCategory === cat

        return (
          <div key={cat} style={{ marginBottom: '0.75rem' }}>
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : cat)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem', borderRadius: '0.5rem',
                border: '1px solid var(--border-color, #e5e7eb)',
                background: 'var(--bg-card, #fff)', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary, #111827)' }}>{cat}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)', marginLeft: '0.5rem' }}>
                  {catChecked}/{items.length}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)' }}>{isExpanded ? '▼' : '▶'}</span>
            </button>

            {isExpanded && (
              <div style={{ padding: '0.5rem 0 0 0.5rem' }}>
                {items.map(item => {
                  const levelColor = getLevelColor(item.level)
                  return (
                    <label
                      key={item.id}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                        padding: '0.5rem', borderRadius: '0.375rem', cursor: 'pointer',
                        background: checked.has(item.id) ? 'var(--success-light)' : 'transparent',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked.has(item.id)}
                        onChange={() => toggleCheck(item.id)}
                        style={{ marginTop: '0.125rem', accentColor: '#3b82f6' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.125rem' }}>
                          <span style={{
                            fontSize: '0.625rem', fontWeight: 600, padding: '0.0625rem 0.375rem',
                            borderRadius: '9999px', background: levelColor.bg, color: levelColor.text,
                          }}>
                            {item.level}
                          </span>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary, #111827)' }}>
                            {item.label}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #6b7280)', margin: 0 }}>
                          {item.description}
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {progress >= 80 && (
        <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '0.75rem', background: 'var(--success-light)', border: '1px solid var(--success-border)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--success-dark)', margin: 0, fontWeight: 500 }}>
            检查完成度 {progress}%，文章质量良好！
          </p>
        </div>
      )}
    </div>
  )
}
