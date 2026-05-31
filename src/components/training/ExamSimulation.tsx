'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { getExamStrategy, type ExamStrategy, type ExamStage } from '@/lib/training/exam-strategy'
import SimulationReport from './SimulationReport'
import ReviewStreamPanel from '@/components/ai/ReviewStreamPanel'

interface ExamSimulationProps {
  topic: string
  subject: 'chinese' | 'english'
  grade?: string
  onComplete?: () => void
}

type SimulationPhase = 'intro' | '审题立意' | '提纲编写' | '正文写作' | '检查修改' | 'report'

interface StageTimeRecord {
  stage: string
  recommended: number
  actual: number
}

interface ReviewResult {
  essayReview: {
    score: number
    dimensionScores: { content: number; structure: number; language: number; norm: number }
    strengths: string[]
    suggestions: string[]
    overallComment: string
  }
  timeAnalysis: {
    overallRating: string
    stageBreakdown: StageTimeRecord[]
    timeManagementAdvice: string
  }
  strategyAdvice: string[]
}

const PHASE_ORDER: SimulationPhase[] = ['审题立意', '提纲编写', '正文写作', '检查修改']

const PHASE_PROMPTS: Record<string, string> = {
  '审题立意': '请仔细审题，确定核心论点。将你的论点写在下方。',
  '提纲编写': '请列出文章的段落结构。包括每段的核心内容和功能。',
  '正文写作': '请根据提纲完成全文写作。',
  '检查修改': '请检查文章：错别字、语法、逻辑、字数。修改后提交最终版本。',
}

export default function ExamSimulation({
  topic,
  subject,
  grade,
  onComplete,
}: ExamSimulationProps) {
  const strategy: ExamStrategy = getExamStrategy(subject, grade)

  const [phase, setPhase] = useState<SimulationPhase>('intro')
  const [content, setContent] = useState('')
  const [stageContents, setStageContents] = useState<Record<string, string>>({})
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null)
  const [stageTimeRecords, setStageTimeRecords] = useState<StageTimeRecord[]>([])
  const [phaseStartTime, setPhaseStartTime] = useState<number>(Date.now())
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [timerActive, setTimerActive] = useState(true)
  const [streamText, setStreamText] = useState('')
  const [streamError, setStreamError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentStage: ExamStage = strategy.stages[currentStageIndex]
  const currentPhase = PHASE_ORDER[currentStageIndex]
  const totalDurationSeconds = currentStage.duration * 60

  // Timer logic
  useEffect(() => {
    if (!timerActive || phase === 'intro' || phase === 'report') return

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1
        if (next >= totalDurationSeconds) {
          // Time up for this stage
          if (currentPhase === '正文写作') {
            // Don't auto-advance for writing stage, just notify
            return next
          }
          // Auto-advance for other stages
          handleStageComplete()
        }
        return next
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [timerActive, phase, currentStageIndex, totalDurationSeconds])

  const handleStart = useCallback(() => {
    setPhase('审题立意')
    setCurrentStageIndex(0)
    setPhaseStartTime(Date.now())
    setElapsedSeconds(0)
    setTimerActive(true)
    setContent('')
  }, [])

  const handleStageComplete = useCallback(() => {
    // Record time
    const actualMinutes = Math.round(elapsedSeconds / 60 * 10) / 10
    const newRecord: StageTimeRecord = {
      stage: currentStage.name,
      recommended: currentStage.duration,
      actual: Math.max(actualMinutes, 0.1),
    }

    setStageTimeRecords((prev) => [...prev, newRecord])
    setStageContents((prev) => ({ ...prev, [currentPhase]: content }))

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Move to next stage or complete
    if (currentStageIndex < strategy.stages.length - 1) {
      const nextIndex = currentStageIndex + 1
      setCurrentStageIndex(nextIndex)
      setContent(stageContents[PHASE_ORDER[nextIndex]] || '')
      setElapsedSeconds(0)
      setPhaseStartTime(Date.now())
      setPhase(PHASE_ORDER[nextIndex])
    } else {
      // All stages complete - submit for review
      handleFinalSubmit()
    }
  }, [elapsedSeconds, currentStage, currentStageIndex, content, strategy, stageContents, currentPhase])

  const handleFinalSubmit = useCallback(async () => {
    // Record last stage
    const actualMinutes = Math.round(elapsedSeconds / 60 * 10) / 10
    const finalRecord: StageTimeRecord = {
      stage: currentStage.name,
      recommended: currentStage.duration,
      actual: Math.max(actualMinutes, 0.1),
    }
    const allRecords = [...stageTimeRecords, finalRecord]
    setStageTimeRecords(allRecords)

    // Combine all stage contents into final essay
    const finalEssay = PHASE_ORDER
      .map((p) => stageContents[p] || '')
      .filter((c) => c.trim())
      .join('\n\n')

    setPhase('report')
    setIsReviewing(true)
    setTimerActive(false)
    setStreamText('')
    setStreamError(null)

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    try {
      const res = await fetch('/api/ai/simulation-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          essay: finalEssay || content,
          subject,
          topic,
          stageData: stageContents,
          timeAnalysis: allRecords,
          stream: true,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setStreamError(data.error || '评审失败')
        setIsReviewing(false)
        return
      }
      const reader = res.body?.getReader()
      if (!reader) { setStreamError('无法读取响应流'); setIsReviewing(false); return }
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue
          try {
            const event = JSON.parse(data)
            if (event.type === 'chunk') setStreamText(prev => prev + event.text)
            else if (event.type === 'result') setReviewResult(event.data)
            else if (event.type === 'error') setStreamError(event.message)
          } catch {}
        }
      }
    } catch {
      setStreamError('网络错误，请重试')
    } finally {
      setIsReviewing(false)
    }
  }, [elapsedSeconds, currentStage, stageTimeRecords, stageContents, content, subject, topic])

  const handleNextStage = useCallback(() => {
    setShowConfirm(true)
  }, [])

  const handleConfirmNext = useCallback(() => {
    setShowConfirm(false)
    handleStageComplete()
  }, [handleStageComplete])

  const handleManualContinue = useCallback(() => {
    // For writing stage when time runs out - let student continue
    setShowConfirm(false)
  }, [])

  // Timer display
  const remaining = Math.max(totalDurationSeconds - elapsedSeconds, 0)
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const timerDisplay = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  const timerColor = remaining <= 30 ? 'var(--danger)' : remaining <= 60 ? 'var(--warning)' : 'var(--text-primary)'
  const isTimeUp = remaining === 0

  // Progress percentage
  const stageProgress = totalDurationSeconds > 0
    ? Math.min((elapsedSeconds / totalDurationSeconds) * 100, 100)
    : 0

  // ==================== INTRO ====================
  if (phase === 'intro') {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <h2 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          textAlign: 'center',
        }}>
          限时模拟考试
        </h2>

        {/* Topic */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}>
            题目
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}>
            {topic}
          </p>
        </div>

        {/* Strategy overview */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
          }}>
            考试安排 · {strategy.totalTime}分钟
          </h3>

          {/* Time bar */}
          <div style={{
            display: 'flex',
            borderRadius: '0.375rem',
            overflow: 'hidden',
            height: '1.5rem',
            marginBottom: '0.75rem',
          }}>
            {strategy.stages.map((stage, index) => {
              const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b']
              return (
                <div
                  key={stage.name}
                  style={{
                    width: `${stage.percentage}%`,
                    background: colors[index % colors.length],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.625rem',
                    fontWeight: 500,
                  }}
                >
                  {stage.name} {stage.duration}min
                </div>
              )
            })}
          </div>

          {/* Stages list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {strategy.stages.map((stage, index) => (
              <div key={stage.name} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                background: 'var(--bg-secondary)',
                borderRadius: '0.375rem',
              }}>
                <div style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  borderRadius: '50%',
                  background: ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b'][index],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.5625rem',
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                  }}>
                    {stage.name}
                  </div>
                  <div style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-muted)',
                  }}>
                    {stage.duration}分钟 · {stage.tips[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div style={{
          background: 'var(--warning-light)',
          borderRadius: '0.75rem',
          padding: '1rem',
        }}>
          <h4 style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--warning)',
            marginBottom: '0.375rem',
          }}>
            注意事项
          </h4>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}>
            {[
              '计时开始后无法暂停',
              '每个阶段时间到会自动进入下一阶段',
              '正文写作阶段超时后可以继续写，但建议尽快完成',
              '最终成绩包含作文质量和时间管理两个维度',
            ].map((rule, i) => (
              <li key={i} style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                padding: '0.125rem 0',
                paddingLeft: '1rem',
                position: 'relative',
              }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--warning)' }}>!</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.9375rem',
            fontWeight: 600,
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          开始模拟
        </button>
      </div>
    )
  }

  // ==================== REPORT ====================
  if (phase === 'report') {
    return (
      <SimulationReport
        subject={subject}
        topic={topic}
        stageTimeRecords={stageTimeRecords}
        essayContent={stageContents['正文写作'] || content}
        reviewResult={reviewResult}
        isReviewing={isReviewing}
        streamText={streamText}
        streamError={streamError}
        onRetry={() => {
          setPhase('intro')
          setStageTimeRecords([])
          setStageContents({})
          setReviewResult(null)
          setContent('')
          setCurrentStageIndex(0)
          setElapsedSeconds(0)
          setStreamText('')
          setStreamError(null)
        }}
        onBackToHome={onComplete}
      />
    )
  }

  // ==================== ACTIVE STAGE ====================
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)',
    }}>
      {/* Top bar: timer + stage info */}
      <div style={{
        padding: '0.75rem 1.25rem',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Stage progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {PHASE_ORDER.map((p, i) => {
            const isCompleted = i < currentStageIndex
            const isCurrent = i === currentStageIndex
            return (
              <div
                key={p}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <div style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '50%',
                  background: isCompleted
                    ? 'var(--success)'
                    : isCurrent
                      ? 'var(--accent)'
                      : 'var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.5625rem',
                  fontWeight: 600,
                  transition: 'all 0.3s',
                }}>
                  {isCompleted ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: isCurrent ? 600 : 400,
                  color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                  display: 'none',
                }} className="stage-label-desktop">
                  {p}
                </span>
                {i < PHASE_ORDER.length - 1 && (
                  <div style={{
                    width: '1.25rem',
                    height: '2px',
                    background: isCompleted ? 'var(--success)' : 'var(--border-color)',
                    margin: '0 0.125rem',
                  }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
          }}>
            {currentStage.name}
          </span>
          <div style={{
            padding: '0.375rem 0.75rem',
            borderRadius: '0.375rem',
            background: isTimeUp ? 'var(--danger-light)' : 'var(--bg-secondary)',
            border: `1px solid ${isTimeUp ? 'var(--danger)' : 'var(--border-color)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={timerColor} strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: timerColor,
              fontFamily: 'monospace',
            }}>
              {timerDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: '0.25rem',
        background: 'var(--border-color)',
      }}>
        <div style={{
          height: '100%',
          width: `${stageProgress}%`,
          background: isTimeUp ? 'var(--danger)' : 'var(--accent)',
          transition: 'width 1s linear',
        }} />
      </div>

      {/* Phase reminder */}
      <div style={{
        padding: '0.625rem 1.25rem',
        background: 'var(--accent-light)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <p style={{
          fontSize: '0.8125rem',
          color: 'var(--accent)',
          fontWeight: 500,
        }}>
          {PHASE_PROMPTS[currentPhase]}
        </p>
      </div>

      {/* Writing area */}
      <div style={{
        flex: 1,
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          flex: 1,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
        }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              currentPhase === '审题立意'
                ? '请写出你的核心论点...'
                : currentPhase === '提纲编写'
                  ? '请列出段落结构（每段一行）...'
                  : currentPhase === '正文写作'
                    ? '请开始写作...'
                    : '请检查并修改你的文章...'
            }
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              padding: '1.25rem',
              fontSize: currentPhase === '正文写作' ? '1.0625rem' : '0.9375rem',
              lineHeight: 1.75,
              resize: 'none',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
            }}
            autoFocus
          />
        </div>
      </div>

      {/* Bottom actions */}
      <div style={{
        padding: '0.75rem 1.25rem',
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {content.trim() ? `${content.trim().length}字` : '尚未开始'}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isTimeUp && currentPhase === '正文写作' && (
            <button
              onClick={handleManualContinue}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-hover)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              继续写作
            </button>
          )}

          {isTimeUp && currentPhase !== '正文写作' && (
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}>
              时间已到，正在自动进入下一阶段...
            </span>
          )}

          {!isTimeUp && (
            <button
              onClick={handleNextStage}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                fontWeight: 500,
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {currentStageIndex === strategy.stages.length - 1 ? '提交' : '进入下一阶段'}
            </button>
          )}
        </div>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            maxWidth: '24rem',
            width: '90%',
            boxShadow: 'var(--shadow-md)',
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}>
              {currentStageIndex === strategy.stages.length - 1 ? '确认提交？' : '进入下一阶段？'}
            </h3>
            <p style={{
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
              lineHeight: 1.5,
            }}>
              {currentStageIndex === strategy.stages.length - 1
                ? '提交后将进入AI评审，无法再修改。'
                : `剩余时间将不再计入${currentStage.name}阶段。`}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-hover)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                取消
              </button>
              <button
                onClick={handleConfirmNext}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
