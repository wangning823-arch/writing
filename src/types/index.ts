export type Subject = 'chinese' | 'english'

export type EssayType = {
  chinese: string[]
  english: string[]
}

export const ESSAY_TYPES: EssayType = {
  chinese: ['议论文', '记叙文', '散文', '应用文'],
  english: ['应用文', '读后续写', '概要写作'],
}

export interface Topic {
  id: string
  subject: Subject
  type: string
  title: string
  description: string
  requirements?: string
  source?: string
  year?: number | null
  region?: string | null
  tags?: string[]
}

export interface AIFeedback {
  overallScore: number
  grade: string
  scores: {
    content: number
    structure: number
    language: number
    norm: number
  }
  strengths: string[]
  weaknesses: string[]
  suggestions: Suggestion[]
  highlights: Highlight[]
  rewrittenParagraphs: RewrittenParagraph[]
}

export interface Suggestion {
  type: 'content' | 'structure' | 'language' | 'norm'
  location: string
  issue: string
  fix: string
}

export interface Highlight {
  text: string
  comment: string
  type: 'praise' | 'improve'
}

export interface RewrittenParagraph {
  original: string
  rewritten: string
  reason: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// ---- Training System Types ----

export type Stage = 'sprout' | 'growing' | 'thriving'

export type OutputType = 'form' | 'cards' | 'paragraph' | 'full-essay'

export type TrainingSubject = 'chinese' | 'english'

export type DiagnosticTask =
  | 'direction'   // 审题立意
  | 'structure'   // 段落排序
  | 'vocab'       // 词汇选择
  | 'sentence'    // 句式改写
  | 'error'       // 找错误

export interface DiagnosticAnswer {
  questionId: string
  answer: string | number
  timeSpent: number // seconds
}

export interface TrainingProgress {
  level: number
  subject: TrainingSubject
  label: string
  completed: boolean
  current: boolean
  locked: boolean
  score?: number
}

export interface DiagnosticStep {
  id: number
  title: string
  description: string
  timeLimit: number // seconds
  type: 'multiple-choice' | 'drag-reorder' | 'text-input' | 'find-error'
}

export interface DiagnosticQuestion {
  stepId: number
  questionIndex: number
  question: string
  options?: string[]
  correctAnswer?: number
  inputPlaceholder?: string
  paragraphs?: string[] // for drag-reorder
}

export interface DiagnosticResult {
  stepScores: number[]
  totalScore: number
  radarData: { dimension: string; score: number }[]
  recommendation: string
  stage: Stage
}

export interface DiffSegment {
  id: string
  original?: string
  revised?: string
  status: 'deleted' | 'added' | 'modified' | 'unchanged'
  suggestionStatus?: 'resolved' | 'unresolved' | 'misdirected' | 'new-issue'
}

export interface AbilityProfile {
  dimension: string
  score: number
}

export interface ProgressScoreResult {
  originalScore: number
  newScore: number
  improvement: number
  fixedIssues: string[]
  remainingIssues: string[]
  aiComment?: string
}

export interface SuggestionStatus {
  id: string
  type: 'content' | 'structure' | 'language' | 'norm'
  location: string
  issue: string
  fix: string
  status: 'resolved' | 'unresolved' | 'misdirected' | 'new-issue'
}
