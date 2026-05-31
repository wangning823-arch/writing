'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { AIFeedback, DiffSegment, Topic } from '@/types'

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
  lastRecordId: string | null
  setLastRecordId: (id: string | null) => void
  topicTitle: string
  setTopicTitle: (t: string) => void
  topicDescription: string
  setTopicDescription: (d: string) => void
  trainingSubject: string
  setTrainingSubject: (s: string) => void
  trainingLevel: number
  setTrainingLevel: (l: number) => void
  resumeTopic: Topic | null
  setResumeTopic: (t: Topic | null) => void
  reviewStreamText: string
  setReviewStreamText: (t: string | ((prev: string) => string)) => void
  isStreamComplete: boolean
  setIsStreamComplete: (v: boolean) => void
  streamError: string | null
  setStreamError: (e: string | null) => void
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined)

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState('')
  const [feedback, setFeedback] = useState<AIFeedback | null>(null)
  const [previousContent, setPreviousContent] = useState('')
  const [diffSegments, setDiffSegments] = useState<DiffSegment[]>([])
  const [isReviewing, setIsReviewing] = useState(false)
  const [lastRecordId, setLastRecordId] = useState<string | null>(null)
  const [topicTitle, setTopicTitle] = useState('')
  const [topicDescription, setTopicDescription] = useState('')
  const [trainingSubject, setTrainingSubject] = useState('chinese')
  const [trainingLevel, setTrainingLevel] = useState(1)
  const [resumeTopic, setResumeTopic] = useState<Topic | null>(null)
  const [reviewStreamText, setReviewStreamText] = useState('')
  const [isStreamComplete, setIsStreamComplete] = useState(false)
  const [streamError, setStreamError] = useState<string | null>(null)

  return (
    <TrainingContext.Provider value={{
      content, setContent,
      feedback, setFeedback,
      previousContent, setPreviousContent,
      diffSegments, setDiffSegments,
      isReviewing, setIsReviewing,
      lastRecordId, setLastRecordId,
      topicTitle, setTopicTitle,
      topicDescription, setTopicDescription,
      trainingSubject, setTrainingSubject,
      trainingLevel, setTrainingLevel,
      resumeTopic, setResumeTopic,
      reviewStreamText, setReviewStreamText,
      isStreamComplete, setIsStreamComplete,
      streamError, setStreamError,
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
