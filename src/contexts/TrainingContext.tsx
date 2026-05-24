'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { AIFeedback, DiffSegment } from '@/types'

interface TrainingContextType {
  content: string
  setContent: (c: string) => void
  feedback: AIFeedback | null
  setFeedback: (f: AIFeedback | null) => void
  previousContent: string
  setPreviousContent: (c: string) => void
  diffSegments: DiffSegment[]
  setDiffSegments: (d: DiffSegment[]) => void
  isReviewing: boolean
  setIsReviewing: (v: boolean) => void
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined)

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState('')
  const [feedback, setFeedback] = useState<AIFeedback | null>(null)
  const [previousContent, setPreviousContent] = useState('')
  const [diffSegments, setDiffSegments] = useState<DiffSegment[]>([])
  const [isReviewing, setIsReviewing] = useState(false)

  return (
    <TrainingContext.Provider value={{
      content, setContent,
      feedback, setFeedback,
      previousContent, setPreviousContent,
      diffSegments, setDiffSegments,
      isReviewing, setIsReviewing,
    }}>
      {children}
    </TrainingContext.Provider>
  )
}

export function useTraining() {
  const context = useContext(TrainingContext)
  if (!context) {
    throw new Error('useTraining must be used within a TrainingProvider')
  }
  return context
}
