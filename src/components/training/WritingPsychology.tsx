'use client'

import { useState } from 'react'
import {
  PSYCHOLOGY_SCENARIOS,
  type PsychologyScenario,
} from '@/lib/training/psychology-scenarios'

interface WritingPsychologyProps {
  onComplete: () => void
}

type ViewMode = 'browse' | 'practice' | 'result'

export default function WritingPsychology({ onComplete }: WritingPsychologyProps) {
  const [view, setView] = useState<ViewMode>('browse')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set())

  const scenario = PSYCHOLOGY_SCENARIOS[currentIdx]

  const handleSelectOption = (optionIdx: number) => {
    if (selectedOption !== null) return
    setSelectedOption(optionIdx)
  }

  const handleConfirm = () => {
    if (selectedOption === null) return
    const option = scenario.practiceOptions[selectedOption]
    setCompletedScenarios((prev) => new Set(prev).add(scenario.id))
    setView('result')
  }

  const handleNext = () => {
    if (currentIdx < PSYCHOLOGY_SCENARIOS.length - 1) {
      setCurrentIdx((prev) => prev + 1)
      setSelectedOption(null)
      setView('browse')
    } else {
      onComplete()
    }
  }

  const startPractice = () => {
    setSelectedOption(null)
    setView('practice')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--text-primary, #111827)',
            marginBottom: '0.5rem',
          }}
        >
          写作心理训练
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary, #6b7280)',
          }}
        >
          掌握考场应急策略，从容应对各种写作困境
        </p>
      </div>

      {/* Scenario navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.375rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {PSYCHOLOGY_SCENARIOS.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              setCurrentIdx(idx)
              setSelectedOption(null)
              setView('browse')
            }}
            style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '50%',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: '2px solid',
              borderColor:
                idx === currentIdx
                  ? '#3b82f6'
                  : completedScenarios.has(s.id)
                    ? '#22c55e'
                    : 'var(--border-color, #e5e7eb)',
              background:
                idx === currentIdx
                  ? '#3b82f6'
                  : completedScenarios.has(s.id)
                    ? '#f0fdf4'
                    : 'var(--bg-card, #fff)',
              color:
                idx === currentIdx
                  ? '#fff'
                  : completedScenarios.has(s.id)
                    ? '#22c55e'
                    : 'var(--text-secondary, #6b7280)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {completedScenarios.has(s.id) ? '✓' : idx + 1}
          </button>
        ))}
      </div>

      {/* BROWSE view */}
      {view === 'browse' && (
        <div>
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '0.75rem',
              background: 'var(--bg-card, #fff)',
              border: '1px solid var(--border-color, #e5e7eb)',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  background: '#fef2f2',
                  color: '#ef4444',
                }}
              >
                场景 {currentIdx + 1}/{PSYCHOLOGY_SCENARIOS.length}
              </span>
              {completedScenarios.has(scenario.id) && (
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px',
                    background: '#f0fdf4',
                    color: '#22c55e',
                  }}
                >
                  已完成
                </span>
              )}
            </div>

            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--text-primary, #111827)',
                marginBottom: '0.75rem',
              }}
            >
              {scenario.title}
            </h3>

            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.8,
                color: 'var(--text-secondary, #6b7280)',
                marginBottom: '1.25rem',
              }}
            >
              {scenario.description}
            </p>

            {/* Strategy */}
            <div
              style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                marginBottom: '1rem',
              }}
            >
              <h4
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#1d4ed8',
                  margin: '0 0 0.5rem',
                }}
              >
                应急策略：{scenario.strategy}
              </h4>
              <ol
                style={{
                  paddingLeft: '1.25rem',
                  margin: 0,
                }}
              >
                {scenario.strategySteps.map((step, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '0.8125rem',
                      lineHeight: 1.7,
                      color: '#1e40af',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={startPractice}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              开始练习
            </button>
          </div>
        </div>
      )}

      {/* PRACTICE view */}
      {view === 'practice' && (
        <div>
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '0.75rem',
              background: 'var(--bg-card, #fff)',
              border: '1px solid var(--border-color, #e5e7eb)',
              marginBottom: '1rem',
            }}
          >
            <h4
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-primary, #111827)',
                marginBottom: '0.75rem',
              }}
            >
              情境练习
            </h4>
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.8,
                color: 'var(--text-secondary, #6b7280)',
                margin: 0,
              }}
            >
              {scenario.practicePrompt}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {scenario.practiceOptions.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '2px solid',
                  borderColor:
                    selectedOption === idx
                      ? '#3b82f6'
                      : 'var(--border-color, #e5e7eb)',
                  background:
                    selectedOption === idx
                      ? '#eff6ff'
                      : 'var(--bg-card, #fff)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--text-primary, #111827)',
                    lineHeight: 1.6,
                  }}
                >
                  {String.fromCharCode(65 + idx)}. {option.text}
                </span>
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleConfirm}
              disabled={selectedOption === null}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                background: selectedOption !== null ? '#3b82f6' : '#9ca3af',
                color: '#fff',
                border: 'none',
                cursor: selectedOption !== null ? 'pointer' : 'not-allowed',
              }}
            >
              确认答案
            </button>
          </div>
        </div>
      )}

      {/* RESULT view */}
      {view === 'result' && selectedOption !== null && (
        <div>
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '0.75rem',
              background: scenario.practiceOptions[selectedOption].isCorrect ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${scenario.practiceOptions[selectedOption].isCorrect ? '#22c55e' : '#ef4444'}`,
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>
                {scenario.practiceOptions[selectedOption].isCorrect ? '✓' : '✗'}
              </span>
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: scenario.practiceOptions[selectedOption].isCorrect ? '#22c55e' : '#ef4444',
                }}
              >
                {scenario.practiceOptions[selectedOption].isCorrect ? '正确！' : '不太对'}
              </span>
            </div>
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary, #6b7280)',
                margin: 0,
              }}
            >
              {scenario.practiceOptions[selectedOption].explanation}
            </p>
          </div>

          {/* Show the correct answer's explanation too if wrong */}
          {!scenario.practiceOptions[selectedOption].isCorrect && (
            <div
              style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                marginBottom: '1rem',
              }}
            >
              <p
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#166534',
                  margin: '0 0 0.5rem',
                }}
              >
                推荐策略
              </p>
              {scenario.practiceOptions
                .filter((o) => o.isCorrect)
                .map((o, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: '0.8125rem',
                      lineHeight: 1.7,
                      color: '#166534',
                      margin: 0,
                    }}
                  >
                    {o.text}
                  </p>
                ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleNext}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {currentIdx < PSYCHOLOGY_SCENARIOS.length - 1 ? '下一个场景' : '完成训练'}
            </button>
          </div>
        </div>
      )}

      {/* Progress text */}
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-tertiary, #9ca3af)',
          marginTop: '1.5rem',
        }}
      >
        已完成 {completedScenarios.size}/{PSYCHOLOGY_SCENARIOS.length} 个场景
      </p>
    </div>
  )
}
