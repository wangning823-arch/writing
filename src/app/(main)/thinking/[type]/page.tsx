'use client'

import { Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import ParagraphOrderingView from '@/components/views/ParagraphOrderingView'
import ArgumentChainView from '@/components/views/ArgumentChainView'
import MultiAngleView from '@/components/views/MultiAngleView'
import WritingPsychologyView from '@/components/views/WritingPsychologyView'
import DeepReadingView from '@/components/views/DeepReadingView'
import ThemeMaterialView from '@/components/views/ThemeMaterialView'
import DialecticalThinkingView from '@/components/views/DialecticalThinkingView'
import ConceptAnalysisView from '@/components/views/ConceptAnalysisView'
import LogicReasoningView from '@/components/views/LogicReasoningView'
import RhetoricView from '@/components/views/RhetoricView'
import SentenceTransformationView from '@/components/views/SentenceTransformationView'
import ArgumentationView from '@/components/views/ArgumentationView'
import PreWritingView from '@/components/views/PreWritingView'
import RevisionGuideView from '@/components/views/RevisionGuideView'
import AbilityDiagnosisView from '@/components/views/AbilityDiagnosisView'
import PersonalizedPathView from '@/components/views/PersonalizedPathView'
import DailyCheckinView from '@/components/views/DailyCheckinView'
import JournalView from '@/components/views/JournalView'
import CurrentReadingView from '@/components/views/CurrentReadingView'
import GaokaoPracticeView from '@/components/views/GaokaoPracticeView'
import ComprehensiveTrainingView from '@/components/views/ComprehensiveTrainingView'
import KnowledgeGraphView from '@/components/views/KnowledgeGraphView'
import LanguageStyleView from '@/components/views/LanguageStyleView'
import ErrorPatternView from '@/components/views/ErrorPatternView'
import EssayShowcaseView from '@/components/views/EssayShowcaseView'
import WritingGoalsView from '@/components/views/WritingGoalsView'

function ThinkingTypeContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = params.type as string
  const subject = (searchParams.get('subject') as 'chinese' | 'english') || 'chinese'

  const handleBack = () => router.push(`/thinking?subject=${subject}`)

  if (type === 'paragraph-ordering') {
    return <ParagraphOrderingView onBack={handleBack} subject={subject} />
  }
  if (type === 'argument-chain') {
    return <ArgumentChainView onBack={handleBack} subject={subject} />
  }
  if (type === 'multi-angle') {
    return <MultiAngleView onBack={handleBack} subject={subject} />
  }
  if (type === 'writing-psychology') {
    return <WritingPsychologyView onBack={handleBack} subject={subject} />
  }
  if (type === 'deep-reading') {
    return <DeepReadingView onBack={handleBack} subject={subject} />
  }
  if (type === 'dialectical-thinking') {
    return <DialecticalThinkingView onBack={handleBack} subject={subject} />
  }
  if (type === 'concept-analysis') {
    return <ConceptAnalysisView onBack={handleBack} subject={subject} />
  }
  if (type === 'logic-reasoning') {
    return <LogicReasoningView onBack={handleBack} subject={subject} />
  }
  if (type === 'rhetoric-training') {
    return <RhetoricView onBack={handleBack} subject={subject} />
  }
  if (type === 'sentence-transformation') {
    return <SentenceTransformationView onBack={handleBack} subject={subject} />
  }
  if (type === 'argumentation-library') {
    return <ArgumentationView onBack={handleBack} subject={subject} />
  }
  if (type === 'pre-writing') {
    return <PreWritingView onBack={handleBack} subject={subject} />
  }
  if (type === 'revision-guide') {
    return <RevisionGuideView onBack={handleBack} subject={subject} />
  }
  if (type === 'ability-diagnosis') {
    return <AbilityDiagnosisView onBack={handleBack} subject={subject} />
  }
  if (type === 'personalized-path') {
    return <PersonalizedPathView onBack={handleBack} subject={subject} />
  }
  if (type === 'daily-checkin') {
    return <DailyCheckinView onBack={handleBack} subject={subject} />
  }
  if (type === 'journal') {
    return <JournalView onBack={handleBack} subject={subject} />
  }
  if (type === 'current-reading') {
    return <CurrentReadingView onBack={handleBack} subject={subject} />
  }
  if (type === 'gaokao-practice') {
    return <GaokaoPracticeView onBack={handleBack} subject={subject} />
  }
  if (type === 'comprehensive-training') {
    return <ComprehensiveTrainingView onBack={handleBack} subject={subject} />
  }
  if (type === 'knowledge-graph') {
    return <KnowledgeGraphView onBack={handleBack} subject={subject} />
  }
  if (type === 'language-style') {
    return <LanguageStyleView onBack={handleBack} subject={subject} />
  }
  if (type === 'error-pattern') {
    return <ErrorPatternView onBack={handleBack} subject={subject} />
  }
  if (type === 'essay-showcase') {
    return <EssayShowcaseView onBack={handleBack} subject={subject} />
  }
  if (type === 'writing-goals') {
    return <WritingGoalsView onBack={handleBack} subject={subject} />
  }

  return (
    <div style={{ padding: '32px', textAlign: 'center' }}>
      <p style={{ color: 'var(--theme_text-weak)' }}>未知的训练类型</p>
      <button
        onClick={handleBack}
        style={{
          marginTop: '16px',
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          background: 'var(--theme_button-primary)',
          color: '#ffffff',
          cursor: 'pointer',
        }}
      >
        返回思维训练
      </button>
    </div>
  )
}

export default function ThinkingTypePage() {
  return (
    <Suspense>
      <ThinkingTypeContent />
    </Suspense>
  )
}
