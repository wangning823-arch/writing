'use client'

import { useState, useCallback } from 'react'
import { DiagnosticStep, DiagnosticResult, Stage } from '@/types'
import Timer from '@/components/training/Timer'
import RadarChart from '@/components/training/RadarChart'

// ---------- Step definitions ----------

const STEPS: DiagnosticStep[] = [
  { id: 1, title: '审题立意', description: '理解题意，确立中心论点', timeLimit: 180, type: 'multiple-choice' },
  { id: 2, title: '段落排序', description: '将打乱的段落排列成合理结构', timeLimit: 120, type: 'drag-reorder' },
  { id: 3, title: '词汇选择', description: '选择最恰当的词汇填空', timeLimit: 180, type: 'multiple-choice' },
  { id: 4, title: '句式改写', description: '将句子改写为指定句式', timeLimit: 240, type: 'text-input' },
  { id: 5, title: '找错误', description: '找出句子中的语病并修正', timeLimit: 180, type: 'find-error' },
]

// ---------- Sample questions (in production, these come from API) ----------

const SAMPLE_MCQ: { question: string; options: string[]; correct: number }[] = [
  { question: '题目"论坚持"最适合从哪个角度切入？', options: ['个人成长', '国家发展', '科学研究', '社会发展'], correct: 0 },
  { question: '以下哪个论点最具有思辨性？', options: ['坚持就是胜利', '坚持需要方向', '坚持是一种美德', '坚持很重要'], correct: 1 },
  { question: '"铁杵磨成针"这个事例最适合论证什么观点？', options: ['天赋很重要', '坚持的力量', '方法决定成败', '时间可以治愈一切'], correct: 1 },
]

const SAMPLE_REORDER = [
  '开头段：提出论点——坚持需要正确的方向',
  '论证段1：没有方向的坚持只会南辕北辙',
  '论证段2：正确的方向让坚持事半功倍',
  '论证段3：历史上正确方向+坚持的成功案例',
  '结尾段：总结——方向与坚持缺一不可',
]

const SAMPLE_VOCAB: { question: string; options: string[]; correct: number }[] = [
  { question: '他的演讲____有力，深深打动了在场每一个人。', options: ['铿锵', '响亮', '大声', '有力'], correct: 0 },
  { question: '这部作品构思____，令人叹为观止。', options: ['精巧', '巧妙', '奇怪', '复杂'], correct: 0 },
  { question: '面对困难，我们不能轻言____。', options: ['放弃', '退缩', '逃避', '认输'], correct: 0 },
  { question: '他的见解____独到，常常令人耳目一新。', options: ['十分', '非常', '极为', '颇为'], correct: 3 },
  { question: '这位学者学识____，在学术界享有盛誉。', options: ['丰富', '渊博', '深厚', '广泛'], correct: 1 },
]

const SAMPLE_REWRITE: { prompt: string; original: string; hint: string }[] = [
  { prompt: '改为排比句', original: '坚持需要勇气、毅力和决心。', hint: '使用三个结构相同的短语' },
  { prompt: '改为反问句', original: '我们应该坚持自己的信念。', hint: '用反问来加强语气' },
  { prompt: '改为比喻句', original: '坚持是一种重要的品质。', hint: '用"像……一样"的结构' },
]

const SAMPLE_ERRORS: { sentence: string; errorCount: number; hint: string }[] = [
  { sentence: '通过这次活动，使我认识到了团队合作的重要性。', errorCount: 1, hint: '缺少主语' },
  { sentence: '他的学习成绩不仅提高了，而且身体也变好了。', errorCount: 1, hint: '语序不当' },
  { sentence: '我们要认真克服和发现学习中的缺点。', errorCount: 1, hint: '逻辑顺序' },
]

// ---------- Sub-components ----------

function MultipleChoiceStep({
  questions,
  answers,
  onAnswer,
}: {
  questions: typeof SAMPLE_MCQ
  answers: (number | null)[]
  onAnswer: (qi: number, choice: number) => void
}) {
  const [currentQ, setCurrentQ] = useState(0)
  const q = questions[currentQ]
  const answered = answers[currentQ] != null

  const handleSelect = (idx: number) => {
    onAnswer(currentQ, idx)
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 400)
    }
  }

  return (
    <div className="diagnostic-question-wrap">
      <div className="diagnostic-q-counter">
        第 {currentQ + 1}/{questions.length} 题
      </div>
      <p className="diagnostic-q-text">{q.question}</p>
      <div className="diagnostic-options">
        {q.options.map((opt, i) => {
          let cls = 'diagnostic-option'
          if (answered && answers[currentQ] === i) cls += ' diagnostic-option-selected'
          if (answered && i === q.correct) cls += ' diagnostic-option-correct'
          return (
            <button key={i} className={cls} onClick={() => !answered && handleSelect(i)}>
              <span className="diagnostic-option-letter">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DragReorderStep({
  items,
  order,
  onReorder,
}: {
  items: string[]
  order: number[]
  onReorder: (newOrder: number[]) => void
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  const handleDragStart = (idx: number) => setDragIdx(idx)

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault()
    if (dragIdx == null || dragIdx === targetIdx) return
    const newOrder = [...order]
    const [moved] = newOrder.splice(dragIdx, 1)
    newOrder.splice(targetIdx, 0, moved)
    onReorder(newOrder)
    setDragIdx(targetIdx)
  }

  return (
    <div className="diagnostic-question-wrap">
      <div className="diagnostic-q-counter">拖拽排列段落顺序</div>
      <div className="drag-list">
        {order.map((origIdx, pos) => (
          <div
            key={origIdx}
            className="drag-item"
            draggable
            onDragStart={() => handleDragStart(pos)}
            onDragOver={(e) => handleDragOver(e, pos)}
            onDragEnd={() => setDragIdx(null)}
          >
            <span className="drag-handle">⠿</span>
            <span className="drag-number">{pos + 1}</span>
            <span className="drag-text">{items[origIdx]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TextInputStep({
  questions,
  answers,
  onAnswer,
}: {
  questions: typeof SAMPLE_REWRITE
  answers: string[]
  onAnswer: (qi: number, val: string) => void
}) {
  const [currentQ, setCurrentQ] = useState(0)
  const q = questions[currentQ]

  return (
    <div className="diagnostic-question-wrap">
      <div className="diagnostic-q-counter">
        第 {currentQ + 1}/{questions.length} 题
      </div>
      <div className="rewrite-prompt-badge">{q.prompt}</div>
      <p className="rewrite-original">原句：{q.original}</p>
      <div className="rewrite-hint">提示：{q.hint}</div>
      <textarea
        className="diagnostic-textarea"
        value={answers[currentQ]}
        onChange={(e) => onAnswer(currentQ, e.target.value)}
        placeholder="在此输入改写后的句子..."
        rows={3}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
        {currentQ < questions.length - 1 && (
          <button
            className="button button-primary button-small"
            onClick={() => setCurrentQ(currentQ + 1)}
          >
            下一题 →
          </button>
        )}
      </div>
    </div>
  )
}

function FindErrorStep({
  questions,
  answers,
  onAnswer,
}: {
  questions: typeof SAMPLE_ERRORS
  answers: string[]
  onAnswer: (qi: number, val: string) => void
}) {
  const [currentQ, setCurrentQ] = useState(0)
  const q = questions[currentQ]

  return (
    <div className="diagnostic-question-wrap">
      <div className="diagnostic-q-counter">
        第 {currentQ + 1}/{questions.length} 题
      </div>
      <div className="error-sentence-card">
        <p className="error-sentence-text">{q.sentence}</p>
        <p className="error-hint-text">提示：{q.hint}</p>
      </div>
      <textarea
        className="diagnostic-textarea"
        value={answers[currentQ]}
        onChange={(e) => onAnswer(currentQ, e.target.value)}
        placeholder="指出错误并写出正确的句子..."
        rows={3}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
        {currentQ < questions.length - 1 && (
          <button
            className="button button-primary button-small"
            onClick={() => setCurrentQ(currentQ + 1)}
          >
            下一题 →
          </button>
        )}
      </div>
    </div>
  )
}

// ---------- Main component ----------

interface PreAssessmentProps {
  onComplete: (result: DiagnosticResult) => void
  onCancel: () => void
}

export default function PreAssessment({ onComplete, onCancel }: PreAssessmentProps) {
  const [stepIdx, setStepIdx] = useState(0)
  const [mcqAnswers, setMcqAnswers] = useState<(number | null)[]>(() => Array(SAMPLE_MCQ.length).fill(null))
  const [reorderAnswer, setReorderAnswer] = useState<number[]>(() => SAMPLE_REORDER.map((_, i) => i))
  const [vocabAnswers, setVocabAnswers] = useState<(number | null)[]>(() => Array(SAMPLE_VOCAB.length).fill(null))
  const [rewriteAnswers, setRewriteAnswers] = useState<string[]>(() => Array(SAMPLE_REWRITE.length).fill(''))
  const [errorAnswers, setErrorAnswers] = useState<string[]>(() => Array(SAMPLE_ERRORS.length).fill(''))
  const [showResults, setShowResults] = useState(false)
  const [resultData, setResultData] = useState<DiagnosticResult | null>(null)

  const step = STEPS[stepIdx]
  const progress = ((stepIdx + 1) / STEPS.length) * 100

  const handleTimeUp = useCallback(() => {
    // Auto-advance
    if (stepIdx < STEPS.length - 1) {
      setStepIdx(stepIdx + 1)
    } else {
      handleSubmit()
    }
  }, [stepIdx])

  const handleSubmit = async () => {
    const mcqCorrect = mcqAnswers.filter((a, i) => a === SAMPLE_MCQ[i].correct).length
    const vocabCorrect = vocabAnswers.filter((a, i) => a === SAMPLE_VOCAB[i].correct).length
    const stepScores = [
      Math.round((mcqCorrect / SAMPLE_MCQ.length) * 100),
      70, // reorder (heuristic: drag completed = baseline 70)
      Math.round((vocabCorrect / SAMPLE_VOCAB.length) * 100),
      rewriteAnswers.filter((a) => a.trim().length > 0).length > 0 ? 65 : 30,
      errorAnswers.filter((a) => a.trim().length > 0).length > 0 ? 60 : 25,
    ]
    const totalScore = Math.round(stepScores.reduce((a, b) => a + b, 0) / stepScores.length)

    let stage: Stage = 'sprout'
    if (totalScore >= 80) stage = 'thriving'
    else if (totalScore >= 50) stage = 'growing'

    const radarData = [
      { dimension: '内容', score: stepScores[0] },
      { dimension: '结构', score: stepScores[1] },
      { dimension: '语言', score: stepScores[2] },
      { dimension: '规范', score: Math.round((stepScores[3] + stepScores[4]) / 2) },
    ]

    const result: DiagnosticResult = {
      stepScores,
      totalScore,
      radarData,
      recommendation: stage === 'sprout' ? '建议从L1基础开始训练' : stage === 'growing' ? '建议从L3进阶训练开始' : '可以挑战高难度综合训练',
      stage,
    }

    // Save to DB
    try {
      await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          stepScores,
          totalScore,
          stage,
          radarData,
          answers: { mcq: mcqAnswers, vocab: vocabAnswers, reorder: reorderAnswer, rewrite: rewriteAnswers, errors: errorAnswers },
        }),
      })
    } catch { /* save best-effort, don't block UI */ }

    setResultData(result)
    setShowResults(true)
    onComplete(result)
  }

  if (showResults && resultData) {
    const scores = resultData.stepScores
    return (
      <div className="diagnostic-results">
        <div className="diagnostic-results-header">
          <h2>诊断完成</h2>
          <p className="diagnostic-total-score">总分：{resultData.totalScore}分</p>
        </div>
        <div className="diagnostic-radar-section">
          <RadarChart data={resultData.radarData} size={260} />
        </div>
        <div className="diagnostic-step-scores">
          {STEPS.map((s, i) => (
            <div key={s.id} className="diagnostic-step-score-row">
              <span className="diagnostic-step-score-label">{s.title}</span>
              <div className="diagnostic-step-score-bar-bg">
                <div
                  className="diagnostic-step-score-bar-fill"
                  style={{ width: `${scores[i]}%` }}
                />
              </div>
              <span className="diagnostic-step-score-val">{scores[i]}分</span>
            </div>
          ))}
        </div>
        <p className="diagnostic-recommendation">
          {resultData.recommendation}
        </p>
      </div>
    )
  }

  return (
    <div className="pre-assessment">
      {/* Header */}
      <div className="pre-assessment-header">
        <button className="pre-assessment-back" onClick={onCancel}>
          ← 退出
        </button>
        <h2 className="pre-assessment-title">能力诊断</h2>
        <Timer
          duration={step.timeLimit}
          onTimeUp={handleTimeUp}
          resetKey={step.id}
        />
      </div>

      {/* Progress bar */}
      <div className="pre-assessment-progress">
        <div className="pre-assessment-progress-track">
          <div
            className="pre-assessment-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="pre-assessment-progress-text">
          {stepIdx + 1} / {STEPS.length} - {step.title}
        </span>
      </div>

      {/* Step description */}
      <div className="pre-assessment-step-desc">
        <h3>{step.title}</h3>
        <p>{step.description}</p>
      </div>

      {/* Step content */}
      <div className="pre-assessment-content">
        {step.type === 'multiple-choice' && step.id === 1 && (
          <MultipleChoiceStep
            questions={SAMPLE_MCQ}
            answers={mcqAnswers}
            onAnswer={(qi, choice) => {
              const next = [...mcqAnswers]
              next[qi] = choice
              setMcqAnswers(next)
            }}
          />
        )}
        {step.type === 'drag-reorder' && (
          <DragReorderStep
            items={SAMPLE_REORDER}
            order={reorderAnswer}
            onReorder={setReorderAnswer}
          />
        )}
        {step.type === 'multiple-choice' && step.id === 3 && (
          <MultipleChoiceStep
            questions={SAMPLE_VOCAB}
            answers={vocabAnswers}
            onAnswer={(qi, choice) => {
              const next = [...vocabAnswers]
              next[qi] = choice
              setVocabAnswers(next)
            }}
          />
        )}
        {step.type === 'text-input' && (
          <TextInputStep
            questions={SAMPLE_REWRITE}
            answers={rewriteAnswers}
            onAnswer={(qi, val) => {
              const next = [...rewriteAnswers]
              next[qi] = val
              setRewriteAnswers(next)
            }}
          />
        )}
        {step.type === 'find-error' && (
          <FindErrorStep
            questions={SAMPLE_ERRORS}
            answers={errorAnswers}
            onAnswer={(qi, val) => {
              const next = [...errorAnswers]
              next[qi] = val
              setErrorAnswers(next)
            }}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="pre-assessment-nav">
        {stepIdx > 0 && (
          <button
            className="button button-secondary"
            onClick={() => setStepIdx(stepIdx - 1)}
          >
            上一步
          </button>
        )}
        <div style={{ flex: 1 }} />
        {stepIdx < STEPS.length - 1 ? (
          <button
            className="button button-primary"
            onClick={() => setStepIdx(stepIdx + 1)}
          >
            下一步
          </button>
        ) : (
          <button className="button button-primary" onClick={handleSubmit}>
            提交诊断
          </button>
        )}
      </div>
    </div>
  )
}
