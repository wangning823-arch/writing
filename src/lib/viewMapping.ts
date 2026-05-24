'use client'

// ============================================================
// AppView & TrainingState (shared types)
// ============================================================

export type AppView =
  | 'landing'
  | 'subject-home'
  | 'home'
  | 'writing'
  | 'result'
  | 'diagnostic'
  | 'training'
  | 'grade-select'
  | 'model-essays'
  | 'materials'
  | 'error-cases'
  | 'thinking-hub'
  | 'thinking-paragraph-ordering'
  | 'thinking-argument-chain'
  | 'thinking-multi-angle'
  | 'thinking-psychology'

export interface TrainingState {
  subject: 'chinese' | 'english'
  level: number
  topicId?: string
}

// ============================================================
// View Labels (for breadcrumbs)
// ============================================================

export const viewLabels: Record<AppView, string> = {
  'landing': '首页',
  'subject-home': '科目主页',
  'training': '训练',
  'result': '评审结果',
  'diagnostic': '诊断评估',
  'model-essays': '范文赏析',
  'materials': '素材库',
  'error-cases': '错题本',
  'thinking-hub': '思维训练',
  'thinking-paragraph-ordering': '段落排序',
  'thinking-argument-chain': '论证链条',
  'thinking-multi-angle': '多角度分析',
  'thinking-psychology': '写作心理',
  'grade-select': '年级设置',
  'home': '题目选择',
  'writing': '写作',
}

// ============================================================
// MobileView type & mapping
// ============================================================

export type MobileView = 'home' | 'training' | 'materials' | 'errors' | 'profile'

export const viewToNavView = (view: AppView): MobileView => {
  if (view === 'landing') return 'home'
  if (view === 'subject-home') return 'training'
  if (view === 'materials') return 'materials'
  if (view === 'error-cases') return 'errors'
  if (view === 'grade-select') return 'profile'
  return 'training'
}

export const showNav = (view: AppView): boolean => {
  return ['landing', 'subject-home', 'materials', 'error-cases', 'grade-select'].includes(view)
}
