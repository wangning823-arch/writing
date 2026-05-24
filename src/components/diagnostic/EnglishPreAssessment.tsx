'use client'

import { useState, useCallback } from 'react'
import { DiagnosticResult, Stage } from '@/types'
import Timer from '@/components/training/Timer'
import RadarChart from '@/components/training/RadarChart'

// ---------- Step definitions ----------

const STEPS = [
  { id: 1, title: 'Grammar', description: 'Choose the correct grammatical structure', timeLimit: 180, type: 'multiple-choice' },
  { id: 2, title: 'Vocabulary', description: 'Select the most appropriate word', timeLimit: 180, type: 'multiple-choice' },
  { id: 3, title: 'Sentence Structure', description: 'Rearrange words to form correct sentences', timeLimit: 120, type: 'drag-reorder' },
  { id: 4, title: 'Sentence Rewriting', description: 'Rewrite sentences as instructed', timeLimit: 240, type: 'text-input' },
  { id: 5, title: 'Error Correction', description: 'Find and correct grammar errors', timeLimit: 180, type: 'find-error' },
]

// ---------- Sample questions ----------

const SAMPLE_GRAMMAR: { question: string; options: string[]; correct: number }[] = [
  { question: 'Which sentence is grammatically correct?', options: ['Each of the students have finished.', 'Each of the students has finished.', 'Each of the students finished already.', 'Each of the students are finishing.'], correct: 1 },
  { question: 'Choose the correct form: "If I ___ you, I would study harder."', options: ['am', 'was', 'were', 'be'], correct: 2 },
  { question: 'Which sentence uses the present perfect correctly?', options: ['I have went to the store.', 'I have gone to the store.', 'I have going to the store.', 'I have go to the store.'], correct: 1 },
]

const SAMPLE_VOCAB: { question: string; options: string[]; correct: number }[] = [
  { question: 'The scientist made a remarkable ___ in cancer research.', options: ['discovery', 'invention', 'recovery', 'delivery'], correct: 0 },
  { question: 'Despite the heavy rain, the team decided to ___ with the experiment.', options: ['proceed', 'precede', 'exceed', 'succeed'], correct: 0 },
  { question: 'The teacher asked the students to ___ their essays by Friday.', options: ['submit', 'permit', 'admit', 'commit'], correct: 0 },
  { question: 'Her speech was both ___ and thought-provoking.', options: ['informative', 'information', 'informed', 'informing'], correct: 0 },
  { question: 'The company plans to ___ its operations to include overseas markets.', options: ['expand', 'extend', 'expend', 'expect'], correct: 0 },
]

const SAMPLE_REORDER = [
  'The experiment yielded unexpected results',
  'which prompted further investigation',
  'by the research team',
  'into the underlying mechanisms',
  'of the observed phenomenon',
]

const SAMPLE_REWRITE: { prompt: string; original: string; hint: string }[] = [
  { prompt: 'Convert to passive voice', original: 'The researchers conducted the experiment carefully.', hint: 'Use "was/were + past participle" structure' },
  { prompt: 'Convert to a question', original: 'The results confirm the hypothesis.', hint: 'Start with "Do/Does" or use inversion' },
  { prompt: 'Combine into one sentence', original: 'The weather was terrible. We decided to stay indoors.', hint: 'Use "Although" or "Despite"' },
]

const SAMPLE_ERRORS: { sentence: string; errorCount: number; hint: string }[] = [
  { sentence: 'The number of students are increasing every year.', errorCount: 1, hint: 'Subject-verb agreement' },
  { sentence: 'She suggested him to apply for the position.', errorCount: 1, hint: 'Incorrect verb pattern' },
  { sentence: 'Despite of the difficulties, they succeeded.', errorCount: 1, hint: 'Preposition error' },
]

// ---------- Sub-components ----------

function MultipleChoiceStep({
  questions,
  answers,
  onAnswer,
}: {
  questions: typeof SAMPLE_GRAMMAR
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
        Question {currentQ + 1}/{questions.length}
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
      <div className="diagnostic-q-counter">Drag to reorder the sentence parts</div>
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
        Question {currentQ + 1}/{questions.length}
      </div>
      <div className="rewrite-prompt-badge">{q.prompt}</div>
      <p className="rewrite-original">Original: {q.original}</p>
      <div className="rewrite-hint">Hint: {q.hint}</div>
      <textarea
        className="diagnostic-textarea"
        value={answers[currentQ]}
        onChange={(e) => onAnswer(currentQ, e.target.value)}
        placeholder="Type your rewritten sentence here..."
        rows={3}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
        {currentQ < questions.length - 1 && (
          <button
            className="button button-primary button-small"
            onClick={() => setCurrentQ(currentQ + 1)}
          >
            Next →
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
        Question {currentQ + 1}/{questions.length}
      </div>
      <div className="error-sentence-card">
        <p className="error-sentence-text">{q.sentence}</p>
        <p className="error-hint-text">Hint: {q.hint}</p>
      </div>
      <textarea
        className="diagnostic-textarea"
        value={answers[currentQ]}
        onChange={(e) => onAnswer(currentQ, e.target.value)}
        placeholder="Find the error and write the correct sentence..."
        rows={3}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
        {currentQ < questions.length - 1 && (
          <button
            className="button button-primary button-small"
            onClick={() => setCurrentQ(currentQ + 1)}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}

// ---------- Main component ----------

interface EnglishPreAssessmentProps {
  onComplete: (result: DiagnosticResult) => void
  onCancel: () => void
}

export default function EnglishPreAssessment({ onComplete, onCancel }: EnglishPreAssessmentProps) {
  const [stepIdx, setStepIdx] = useState(0)
  const [grammarAnswers, setGrammarAnswers] = useState<(number | null)[]>(() => Array(SAMPLE_GRAMMAR.length).fill(null))
  const [vocabAnswers, setVocabAnswers] = useState<(number | null)[]>(() => Array(SAMPLE_VOCAB.length).fill(null))
  const [reorderAnswer, setReorderAnswer] = useState<number[]>(() => SAMPLE_REORDER.map((_, i) => i))
  const [rewriteAnswers, setRewriteAnswers] = useState<string[]>(() => Array(SAMPLE_REWRITE.length).fill(''))
  const [errorAnswers, setErrorAnswers] = useState<string[]>(() => Array(SAMPLE_ERRORS.length).fill(''))
  const [showResults, setShowResults] = useState(false)
  const [resultData, setResultData] = useState<DiagnosticResult | null>(null)

  const step = STEPS[stepIdx]
  const progress = ((stepIdx + 1) / STEPS.length) * 100

  const handleTimeUp = useCallback(() => {
    if (stepIdx < STEPS.length - 1) {
      setStepIdx(stepIdx + 1)
    } else {
      handleSubmit()
    }
  }, [stepIdx])

  const handleSubmit = async () => {
    const grammarCorrect = grammarAnswers.filter((a, i) => a === SAMPLE_GRAMMAR[i].correct).length
    const vocabCorrect = vocabAnswers.filter((a, i) => a === SAMPLE_VOCAB[i].correct).length
    const stepScores = [
      Math.round((grammarCorrect / SAMPLE_GRAMMAR.length) * 100),
      Math.round((vocabCorrect / SAMPLE_VOCAB.length) * 100),
      70, // reorder (heuristic)
      rewriteAnswers.filter((a) => a.trim().length > 0).length > 0 ? 65 : 30,
      errorAnswers.filter((a) => a.trim().length > 0).length > 0 ? 60 : 25,
    ]
    const totalScore = Math.round(stepScores.reduce((a, b) => a + b, 0) / stepScores.length)

    let stage: Stage = 'sprout'
    if (totalScore >= 80) stage = 'thriving'
    else if (totalScore >= 50) stage = 'growing'

    const radarData = [
      { dimension: '内容', score: stepScores[0] },
      { dimension: '结构', score: stepScores[2] },
      { dimension: '语言', score: stepScores[1] },
      { dimension: '规范', score: Math.round((stepScores[3] + stepScores[4]) / 2) },
    ]

    const result: DiagnosticResult = {
      stepScores,
      totalScore,
      radarData,
      recommendation: stage === 'sprout' ? '建议从L1基础句式开始训练' : stage === 'growing' ? '建议从L3应用文格式开始' : '可以挑战高难度写作',
      stage,
    }

    // Save to DB with subject: english
    try {
      await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          subject: 'english',
          stepScores,
          totalScore,
          stage,
          radarData,
          answers: { grammar: grammarAnswers, vocab: vocabAnswers, reorder: reorderAnswer, rewrite: rewriteAnswers, errors: errorAnswers },
        }),
      })
    } catch { /* save best-effort */ }

    setResultData(result)
    setShowResults(true)
    onComplete(result)
  }

  if (showResults && resultData) {
    const scores = resultData.stepScores
    return (
      <div className="diagnostic-results">
        <div className="diagnostic-results-header">
          <h2>English Diagnostic Complete</h2>
          <p className="diagnostic-total-score">Total: {resultData.totalScore}</p>
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
          ← Exit
        </button>
        <h2 className="pre-assessment-title">🔤 English Diagnostic</h2>
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
            questions={SAMPLE_GRAMMAR}
            answers={grammarAnswers}
            onAnswer={(qi, choice) => {
              const next = [...grammarAnswers]
              next[qi] = choice
              setGrammarAnswers(next)
            }}
          />
        )}
        {step.type === 'multiple-choice' && step.id === 2 && (
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
        {step.type === 'drag-reorder' && (
          <DragReorderStep
            items={SAMPLE_REORDER}
            order={reorderAnswer}
            onReorder={setReorderAnswer}
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
            Previous
          </button>
        )}
        <div style={{ flex: 1 }} />
        {stepIdx < STEPS.length - 1 ? (
          <button
            className="button button-primary"
            onClick={() => setStepIdx(stepIdx + 1)}
          >
            Next
          </button>
        ) : (
          <button className="button button-primary" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  )
}
