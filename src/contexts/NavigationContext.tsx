'use client'

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react'
import { AppView } from '@/lib/viewMapping'
import { Stage, TrainingProgress, AbilityProfile } from '@/types'

interface TrainingState {
  subject: 'chinese' | 'english'
  level: number
  topicId?: string
}

interface SubjectStats {
  totalCount: number
  monthlyCount: number
  streak: number
}

interface NavigationContextType {
  currentView: AppView
  navigateTo: (view: AppView) => void
  goBack: () => void
  canGoBack: boolean
  history: AppView[]
  subject: 'chinese' | 'english'
  setSubject: (s: 'chinese' | 'english') => void
  trainingState: TrainingState | null
  setTrainingState: (s: TrainingState | null) => void
  content: string
  setContent: (c: string) => void
  feedback: any | null
  setFeedback: (f: any | null) => void
  grade: string
  setGrade: (g: string) => void
  chineseStage: Stage
  setChineseStage: (s: Stage) => void
  englishStage: Stage
  setEnglishStage: (s: Stage) => void
  progress: { chinese: TrainingProgress[]; english: TrainingProgress[] }
  setProgress: (p: { chinese: TrainingProgress[]; english: TrainingProgress[] }) => void
  abilityProfile: AbilityProfile[]
  setAbilityProfile: (p: AbilityProfile[]) => void
  chineseAbilityProfile: AbilityProfile[]
  setChineseAbilityProfile: (p: AbilityProfile[]) => void
  englishAbilityProfile: AbilityProfile[]
  setEnglishAbilityProfile: (p: AbilityProfile[]) => void
  chineseStats: SubjectStats
  setChineseStats: (s: SubjectStats) => void
  englishStats: SubjectStats
  setEnglishStats: (s: SubjectStats) => void
  chineseAchievements: Array<{ name: string; icon: string }>
  setChineseAchievements: (a: Array<{ name: string; icon: string }>) => void
  englishAchievements: Array<{ name: string; icon: string }>
  setEnglishAchievements: (a: Array<{ name: string; icon: string }>) => void
  weakPoints: Array<{ subject?: string; dimension: string; description: string; frequency: number; recommendedTraining?: string }>
  setWeakPoints: (w: Array<{ subject?: string; dimension: string; description: string; frequency: number; recommendedTraining?: string }>) => void
  errorRecords: Array<{ errorType: string; subType?: string; location: string; explanation: string; severity: string; count: number }>
  setErrorRecords: (e: Array<{ errorType: string; subType?: string; location: string; explanation: string; severity: string; count: number }>) => void
  dailyRecommendations: Array<{ subject: string; level: number; label: string; estimatedMinutes: number }>
  setDailyRecommendations: (r: Array<{ subject: string; level: number; label: string; estimatedMinutes: number }>) => void
  refreshProgress: () => Promise<void>
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

async function fetchProgress(): Promise<{
  chineseStage: Stage
  englishStage: Stage
  chineseProgress: TrainingProgress[]
  englishProgress: TrainingProgress[]
  chineseAbilityProfile: AbilityProfile[]
  englishAbilityProfile: AbilityProfile[]
  chineseStats: SubjectStats
  englishStats: SubjectStats
  chineseAchievements: Array<{ name: string; icon: string }>
  englishAchievements: Array<{ name: string; icon: string }>
}> {
  try {
    const res = await fetch('/api/progress?userId=demo-user')
    if (!res.ok) throw new Error('Failed to fetch progress')
    const data = await res.json()
    return {
      chineseStage: data.chineseStage || 'sprout',
      englishStage: data.englishStage || 'sprout',
      chineseProgress: data.chineseProgress || [],
      englishProgress: data.englishProgress || [],
      chineseAbilityProfile: data.chineseAbilityProfile || [],
      englishAbilityProfile: data.englishAbilityProfile || [],
      chineseStats: data.chineseStats || { totalCount: 0, monthlyCount: 0, streak: 0 },
      englishStats: data.englishStats || { totalCount: 0, monthlyCount: 0, streak: 0 },
      chineseAchievements: data.chineseAchievements || [],
      englishAchievements: data.englishAchievements || [],
    }
  } catch {
    return {
      chineseStage: 'sprout',
      englishStage: 'sprout',
      chineseProgress: [],
      englishProgress: [],
      chineseAbilityProfile: [],
      englishAbilityProfile: [],
      chineseStats: { totalCount: 0, monthlyCount: 0, streak: 0 },
      englishStats: { totalCount: 0, monthlyCount: 0, streak: 0 },
      chineseAchievements: [],
      englishAchievements: [],
    }
  }
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<AppView>('landing')
  const historyRef = useRef<AppView[]>(['landing'])
  const [subject, setSubject] = useState<'chinese' | 'english'>('chinese')
  const [trainingState, setTrainingState] = useState<TrainingState | null>(null)
  const [content, setContent] = useState('')
  const [feedback, setFeedback] = useState<any | null>(null)
  const [grade, setGrade] = useState<string>('高一')

  const [chineseStage, setChineseStage] = useState<Stage>('sprout')
  const [englishStage, setEnglishStage] = useState<Stage>('sprout')
  const [progress, setProgress] = useState<{ chinese: TrainingProgress[]; english: TrainingProgress[] }>({ chinese: [], english: [] })
  const [abilityProfile, setAbilityProfile] = useState<AbilityProfile[]>([])
  const [chineseAbilityProfile, setChineseAbilityProfile] = useState<AbilityProfile[]>([])
  const [englishAbilityProfile, setEnglishAbilityProfile] = useState<AbilityProfile[]>([])
  const [chineseStats, setChineseStats] = useState<SubjectStats>({ totalCount: 0, monthlyCount: 0, streak: 0 })
  const [englishStats, setEnglishStats] = useState<SubjectStats>({ totalCount: 0, monthlyCount: 0, streak: 0 })
  const [chineseAchievements, setChineseAchievements] = useState<Array<{ name: string; icon: string }>>([])
  const [englishAchievements, setEnglishAchievements] = useState<Array<{ name: string; icon: string }>>([])
  const [weakPoints, setWeakPoints] = useState<Array<{ subject?: string; dimension: string; description: string; frequency: number; recommendedTraining?: string }>>([])
  const [errorRecords, setErrorRecords] = useState<Array<{ errorType: string; subType?: string; location: string; explanation: string; severity: string; count: number }>>([])
  const [dailyRecommendations, setDailyRecommendations] = useState<Array<{ subject: string; level: number; label: string; estimatedMinutes: number }>>([])

  const navigateTo = useCallback((view: AppView) => {
    const lastView = historyRef.current[historyRef.current.length - 1]
    if (view !== lastView) {
      historyRef.current.push(view)
    }
    setCurrentView(view)
  }, [])

  const goBack = useCallback(() => {
    if (historyRef.current.length > 1) {
      historyRef.current.pop()
      const prevView = historyRef.current[historyRef.current.length - 1]
      setCurrentView(prevView)
    } else {
      setCurrentView('landing')
    }
  }, [])

  const canGoBack = historyRef.current.length > 1

  const refreshProgress = useCallback(async () => {
    const data = await fetchProgress()
    setChineseStage(data.chineseStage)
    setEnglishStage(data.englishStage)
    setProgress({ chinese: data.chineseProgress, english: data.englishProgress })
    setChineseAbilityProfile(data.chineseAbilityProfile)
    setEnglishAbilityProfile(data.englishAbilityProfile)
    setChineseStats(data.chineseStats)
    setEnglishStats(data.englishStats)
    setChineseAchievements(data.chineseAchievements)
    setEnglishAchievements(data.englishAchievements)
  }, [])

  return (
    <NavigationContext.Provider value={{
      currentView, navigateTo, goBack, canGoBack, history: historyRef.current,
      subject, setSubject, trainingState, setTrainingState,
      content, setContent, feedback, setFeedback, grade, setGrade,
      chineseStage, setChineseStage, englishStage, setEnglishStage,
      progress, setProgress, abilityProfile, setAbilityProfile,
      chineseAbilityProfile, setChineseAbilityProfile,
      englishAbilityProfile, setEnglishAbilityProfile,
      chineseStats, setChineseStats, englishStats, setEnglishStats,
      chineseAchievements, setChineseAchievements,
      englishAchievements, setEnglishAchievements,
      weakPoints, setWeakPoints, errorRecords, setErrorRecords,
      dailyRecommendations, setDailyRecommendations, refreshProgress
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
