'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTraining } from '@/contexts/TrainingContext'
import { useNavigation } from '@/contexts/NavigationContext'
import Timer from '@/components/training/Timer'
import ModelEssayViewer from '@/components/training/ModelEssayViewer'
import WritingTip from '@/components/training/WritingTip'
import SelfAssessment from '@/components/training/SelfAssessment'
import L1TopicAnalysis from '@/components/editor/L1TopicAnalysis'
import L2ParagraphCards from '@/components/editor/L2ParagraphCards'
import ParagraphEditor from '@/components/editor/ParagraphEditor'
import SentenceRewrite from '@/components/editor/SentenceRewrite'
import TopicSelector from '@/components/training/TopicSelector'
import { getLevel } from '@/lib/training/config'
import { getTimeLimit } from '@/lib/training/time-manager'
import { CHINESE_LEVEL_NAMES, ENGLISH_LEVEL_NAMES } from '@/lib/constants'
import { computeParagraphDiff } from '@/lib/training/diff-engine'
import type { Stage, AIFeedback, Topic } from '@/types'

export default function TrainingPage() {
  const params = useParams()
  const router = useRouter()
  const { userId } = useNavigation()
  const subject = params.subject as 'chinese' | 'english'
  const level = parseInt(params.level as string)

  const { content, setContent, setFeedback, setPreviousContent, setDiffSegments, isReviewing, setIsReviewing, lastRecordId, setLastRecordId, setTopicTitle, setTopicDescription, setTrainingSubject, setTrainingLevel, resumeTopic, setResumeTopic } = useTraining()

  const [chineseStage, setChineseStage] = useState<Stage>('sprout')
  const [englishStage, setEnglishStage] = useState<Stage>('sprout')
  const [showSelfAssessment, setShowSelfAssessment] = useState(false)
  const [selfAssessmentIssues, setSelfAssessmentIssues] = useState<
    Array<{ location: string; issue: string; severity: 'high' | 'medium' | 'low' }>
  >([])
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [topicLoading, setTopicLoading] = useState(true)

  const fetchTopic = useCallback(async () => {
    setTopicLoading(true)
    try {
      const res = await fetch(`/api/topics?subject=${subject}&level=${level}&userId=${encodeURIComponent(userId)}`)
      const data = await res.json()
      setSelectedTopic(data.topic || null)
    } catch {
      setSelectedTopic(null)
    } finally {
      setTopicLoading(false)
    }
  }, [subject, level, userId])

  useEffect(() => {
    // If resuming from history, use the stored topic directly
    if (resumeTopic) {
      setSelectedTopic(resumeTopic)
      setTopicLoading(false)
      setResumeTopic(null) // consumed, clear it
      return
    }
    // Otherwise fetch a new random topic
    setLastRecordId(null)
    setTrainingSubject(subject)
    setTrainingLevel(level)
    fetchTopic()
  }, [fetchTopic])

  useEffect(() => {
    fetch(`/api/progress?userId=${encodeURIComponent(userId)}`)
      .then(r => r.json())
      .then(data => {
        setChineseStage(data.chineseStage || 'sprout')
        setEnglishStage(data.englishStage || 'sprout')
      })
      .catch(() => {})
  }, [userId])

  const currentStage = (subject === 'chinese' ? chineseStage : englishStage) as Stage
  const levelLabel = subject === 'chinese' ? CHINESE_LEVEL_NAMES[level] : ENGLISH_LEVEL_NAMES[level]
  const levelConfig = getLevel(subject, level)
  const timeLimit = getTimeLimit(subject, level, currentStage)

  const handleReview = useCallback(async (levelContent: string) => {
    setIsReviewing(true)
    setFeedback(null)
    const isRevision = !!lastRecordId
    try {
      const res = await fetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          level,
          topicId: selectedTopic?.id,
          topicTitle: selectedTopic?.title || levelConfig?.name || '',
          topicDescription: selectedTopic?.description || levelConfig?.description || '',
          content: levelContent,
          userId,
          isRevision,
          originalRecordId: lastRecordId || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || '评审失败'); return }

      const review = data.feedback
      const aiFeedback: AIFeedback = {
        overallScore: review.score || 0,
        scores: {
          content: review.dimensionScores?.content || 0,
          structure: review.dimensionScores?.structure || 0,
          language: review.dimensionScores?.language || 0,
          norm: review.dimensionScores?.norms || 0,
        },
        grade: review.isPass ? '合格' : '待提高',
        strengths: [],
        weaknesses: [],
        highlights: review.highlights || [],
        suggestions: review.suggestions || [],
        rewrittenParagraphs: [],
        keywordEvaluation: review.keywordEvaluation || undefined,
      }
      setFeedback(aiFeedback)
      setPreviousContent(levelContent)
      setLastRecordId(review.recordId || null)
      setTopicTitle(selectedTopic?.title || levelConfig?.name || '')
      setTopicDescription(selectedTopic?.description || levelConfig?.description || '')
      setResumeTopic(selectedTopic)
      router.push('/result')
    } catch {
      alert('网络错误，请重试')
    } finally {
      setIsReviewing(false)
    }
  }, [subject, level, selectedTopic, router, setFeedback, setPreviousContent, setIsReviewing, userId, lastRecordId, setLastRecordId, setTopicTitle, setTopicDescription, setResumeTopic])

  const handleBack = () => {
    router.push(`/subject/${subject}`)
  }

  if (isNaN(level)) {
    return <div style={{ padding: '32px', textAlign: 'center' }}>无效的关卡</div>
  }

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={handleBack}
          style={{
            border: 'none',
            background: 'none',
            color: 'var(--theme_text-weak)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            marginBottom: '12px',
            padding: 0,
          }}
        >
          ← 返回
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)' }}>
          {subject === 'chinese' ? '语文' : '英语'} L{level} {levelLabel}
        </h1>
        {levelConfig?.description && (
          <p style={{ fontSize: '0.875rem', color: 'var(--theme_text-weak)', marginTop: '4px' }}>
            {levelConfig.description}
          </p>
        )}
      </div>

      {/* Timer */}
      {timeLimit != null && (
        <div style={{ marginBottom: '16px' }}>
          <Timer
            duration={timeLimit * 60}
            onTimeUp={() => {
              alert('时间到！')
              if (content.trim()) handleReview(content)
            }}
          />
        </div>
      )}

      {/* Topic Selector */}
      <TopicSelector
        topic={selectedTopic}
        onRefresh={fetchTopic}
        onGenerated={(t) => setSelectedTopic(t)}
        isLoading={topicLoading}
        subject={subject}
        level={level}
      />

      {/* Model Essay & Tips */}
      <ModelEssayViewer subject={subject} level={level} topicId={selectedTopic?.id} topicTags={selectedTopic?.tags} />
      <WritingTip subject={subject} level={level} />

      {/* Self Assessment */}
      {!showSelfAssessment && (
        <div style={{ textAlign: 'center', margin: '12px 0' }}>
          <button
            onClick={() => setShowSelfAssessment(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--theme_bg)',
              color: 'var(--theme_text-weak)',
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            先做自我评估（可选）
          </button>
        </div>
      )}

      {showSelfAssessment && (
        <SelfAssessment
          content={content}
          subject={subject}
          onSubmit={(issues) => {
            setSelfAssessmentIssues(issues)
            setShowSelfAssessment(false)
          }}
          onSkip={() => setShowSelfAssessment(false)}
        />
      )}

      {/* Chinese L1: Topic Analysis */}
      {subject === 'chinese' && level === 1 && (
        <L1TopicAnalysis
          topicPrompt={selectedTopic?.description || '请根据题目进行审题立意'}
          onConfirm={(keywords: string[], thesis: string) => {
            const combined = `关键词：${keywords.join('、')}\n论点：${thesis}`
            handleReview(combined)
          }}
          onBack={handleBack}
        />
      )}

      {/* Chinese L2: Paragraph Cards */}
      {subject === 'chinese' && level === 2 && (
        <L2ParagraphCards
          onConfirm={(cards: Array<{ content: string }>) => {
            const combined = cards.map((c, i) => `第${i + 1}段：${c.content}`).join('\n')
            handleReview(combined)
          }}
          onBack={handleBack}
        />
      )}

      {/* Chinese L3-L6 / English L2-L4: Paragraph Editor */}
      {((subject === 'chinese' && level >= 3 && level <= 6) ||
        (subject === 'english' && level >= 2 && level <= 4)) && (
        <ParagraphEditor
          targetCount={levelConfig?.wordTarget ? parseInt(levelConfig.wordTarget) || 150 : 150}
          language={subject === 'chinese' ? 'chinese' : 'english'}
          levelLabel={`L${level} ${levelLabel}`}
          tip={levelConfig?.description}
          onSubmit={(text) => handleReview(text)}
          onBack={handleBack}
        />
      )}

      {/* Chinese L7 / English L6: Full Essay */}
      {((subject === 'chinese' && level === 7) ||
        (subject === 'english' && level === 6)) && (
        <div>
          {selectedTopic?.description && (
            <div style={{ padding: '12px', background: 'var(--theme_bg-subtle)', borderRadius: '8px', marginBottom: '12px' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--theme_text)' }}>
                <span style={{ fontWeight: 500 }}>题目要求：</span>
                {selectedTopic.description}
              </p>
            </div>
          )}
          <div style={{ marginBottom: '12px' }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={subject === 'chinese' ? '在这里开始你的写作...' : 'Start writing here...'}
              style={{
                width: '100%',
                minHeight: '400px',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--theme_bg)',
                color: 'var(--theme_text)',
                fontSize: '1rem',
                lineHeight: 1.8,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'var(--font-family)',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={handleBack}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--theme_bg)',
                color: 'var(--theme_text)',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              返回
            </button>
            <button
              onClick={() => handleReview(content)}
              disabled={isReviewing || !content.trim()}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--theme_button-primary)',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                opacity: isReviewing || !content.trim() ? 0.5 : 1,
              }}
            >
              {isReviewing ? '评审中...' : '提交评审'}
            </button>
          </div>
        </div>
      )}

      {/* English L1: Sentence Rewrite */}
      {subject === 'english' && level === 1 && (
        <SentenceRewrite
          onSubmit={(rewrites: string[]) => handleReview(rewrites.join('\n'))}
          onBack={handleBack}
        />
      )}

      {/* English L5: Grammar Error Correction */}
      {subject === 'english' && level === 5 && (
        <ParagraphEditor
          targetCount={100}
          language="english"
          levelLabel="L5 语法纠错"
          tip="找出并改正文段中的3-5处语法错误"
          onSubmit={(text) => handleReview(text)}
          onBack={handleBack}
        />
      )}

      {/* Reviewing Overlay */}
      {isReviewing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(255,255,255,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid var(--border-color)',
              borderTopColor: 'var(--theme_button-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }} />
            <p style={{ fontWeight: 500, color: 'var(--theme_text)' }}>AI正在评审...</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--theme_text-weak)', marginTop: '4px' }}>
              分析{levelLabel}表现
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
