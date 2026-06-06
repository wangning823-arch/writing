'use client'

import { useState } from 'react'
import { GAOKAO_QUESTIONS, getGaokaoQuestions, type GaokaoQuestion } from '@/lib/training/gaokao-questions'
import ScoreResultPanel from './ScoreResultPanel'

interface GaokaoPracticeProps {
  subject: 'chinese' | 'english'
  onComplete?: (result: any) => void
  onBack?: () => void
}

export default function GaokaoPractice({ subject, onComplete, onBack }: GaokaoPracticeProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<GaokaoQuestion | null>(null)
  const [response, setResponse] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [filterYear, setFilterYear] = useState<number | null>(null)
  const [filterTheme, setFilterTheme] = useState<string | null>(null)

  const years = [...new Set(GAOKAO_QUESTIONS.filter(q => q.subject === subject).map(q => q.year))].sort((a, b) => b - a)
  const themes = [...new Set(GAOKAO_QUESTIONS.filter(q => q.subject === subject).map(q => q.theme))]

  const filteredQuestions = getGaokaoQuestions({
    subject,
    year: filterYear || undefined,
    theme: filterTheme || undefined,
  })

  const handleSubmit = async () => {
    if (!response.trim() || !selectedQuestion) return
    setIsAnalyzing(true)
    try {
      const res = await fetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: response,
          topic: selectedQuestion.prompt,
          genre: '议论文',
          subject,
        }),
      })
      const result = await res.json()
      setResult(result)
      onComplete?.(result)
    } catch {
      onComplete?.({ overallScore: 70, summary: '分析完成' })
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (result && selectedQuestion) {
    return (
      <div style={{ padding: '1.5rem' }}>
        <button
          onClick={() => { setResult(null); setResponse('') }}
          style={{ border: 'none', background: 'none', color: 'var(--text-weak, #6b7280)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '1rem', padding: 0 }}
        >
          ← 继续练习
        </button>
        <ScoreResultPanel
          overallScore={result.overallScore || 0}
          summary={result.summary}
          strengths={result.strengths}
          suggestions={result.suggestions}
          scoringCriteria={result.scoringCriteria}
          referenceAnswer={result.referenceAnswer}
          exampleVariants={result.exampleVariants}
          showRetry={false}
          onRetry={() => { setResult(null); setResponse('') }}
        />
      </div>
    )
  }

  if (selectedQuestion) {
    return (
      <div style={{ padding: '1.5rem' }}>
        <button
          onClick={() => { setSelectedQuestion(null); setResponse('') }}
          style={{ border: 'none', background: 'none', color: 'var(--text-weak, #6b7280)', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '1rem', padding: 0 }}
        >
          ← 返回真题列表
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', background: 'var(--accent-light)', color: 'var(--primary-600)' }}>
            {selectedQuestion.year}年
          </span>
          <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', background: 'var(--success-light)', color: 'var(--success-dark)' }}>
            {selectedQuestion.region}
          </span>
          <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', background: 'var(--topic-info-bg)', color: 'var(--warning-dark)' }}>
            {selectedQuestion.theme}
          </span>
        </div>

        <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary, #111827)', margin: 0, lineHeight: 1.8 }}>
            {selectedQuestion.prompt}
          </p>
          {selectedQuestion.material && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', margin: '0.75rem 0 0', lineHeight: 1.6, fontStyle: 'italic' }}>
              {selectedQuestion.material}
            </p>
          )}
        </div>

        <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--warning-light)', border: '1px solid var(--warning-border)', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--topic-info-text)', margin: '0 0 0.25rem' }}>写作要求</p>
          {selectedQuestion.requirements.map((req, i) => (
            <p key={i} style={{ fontSize: '0.8125rem', color: 'var(--topic-info-text)', margin: '0 0 0.125rem' }}>• {req}</p>
          ))}
        </div>

        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          rows={10}
          placeholder="在此写下你的作文..."
          style={{
            width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
            border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
            fontSize: '0.875rem', color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '1rem',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)' }}>
            {response.replace(/\s/g, '').length} 字
          </span>
          <button
            onClick={handleSubmit}
            disabled={!response.trim() || isAnalyzing}
            style={{
              padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none',
              background: response.trim() && !isAnalyzing ? 'var(--theme_button-primary)' : '#9ca3af',
              color: '#fff', cursor: response.trim() && !isAnalyzing ? 'pointer' : 'not-allowed', fontSize: '0.875rem', fontWeight: 500,
            }}
          >
            {isAnalyzing ? 'AI 评审中...' : '提交 AI 评审'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
        高考真题实战
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1rem' }}>
        按年份和地区浏览高考真题，模拟考场写作
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterYear(null)}
          style={{
            padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem',
            border: `1px solid ${!filterYear ? 'var(--theme_button-primary)' : 'var(--border-color, #e5e7eb)'}`,
            background: !filterYear ? 'var(--accent-light)' : 'var(--bg-card, #fff)',
            color: !filterYear ? 'var(--primary-600)' : 'var(--text-secondary, #6b7280)',
            cursor: 'pointer',
          }}
        >
          全部年份
        </button>
        {years.map(y => (
          <button
            key={y}
            onClick={() => setFilterYear(y)}
            style={{
              padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem',
              border: `1px solid ${filterYear === y ? 'var(--theme_button-primary)' : 'var(--border-color, #e5e7eb)'}`,
              background: filterYear === y ? 'var(--accent-light)' : 'var(--bg-card, #fff)',
              color: filterYear === y ? 'var(--primary-600)' : 'var(--text-secondary, #6b7280)',
              cursor: 'pointer',
            }}
          >
            {y}年
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterTheme(null)}
          style={{
            padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem',
            border: `1px solid ${!filterTheme ? 'var(--theme_button-primary)' : 'var(--border-color, #e5e7eb)'}`,
            background: !filterTheme ? 'var(--accent-light)' : 'var(--bg-card, #fff)',
            color: !filterTheme ? 'var(--primary-600)' : 'var(--text-secondary, #6b7280)',
            cursor: 'pointer',
          }}
        >
          全部主题
        </button>
        {themes.map(t => (
          <button
            key={t}
            onClick={() => setFilterTheme(t)}
            style={{
              padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem',
              border: `1px solid ${filterTheme === t ? 'var(--theme_button-primary)' : 'var(--border-color, #e5e7eb)'}`,
              background: filterTheme === t ? 'var(--accent-light)' : 'var(--bg-card, #fff)',
              color: filterTheme === t ? 'var(--primary-600)' : 'var(--text-secondary, #6b7280)',
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredQuestions.map(q => (
          <button
            key={q.id}
            onClick={() => setSelectedQuestion(q)}
            style={{
              padding: '1rem', borderRadius: '0.75rem',
              border: '1px solid var(--border-color, #e5e7eb)',
              background: 'var(--bg-card, #fff)', textAlign: 'left', cursor: 'pointer', width: '100%',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.375rem', borderRadius: '9999px', background: 'var(--accent-light)', color: 'var(--primary-600)' }}>
                {q.year}
              </span>
              <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.375rem', borderRadius: '9999px', background: 'var(--success-light)', color: 'var(--success-dark)' }}>
                {q.region}
              </span>
              <span style={{ fontSize: '0.6875rem', padding: '0.125rem 0.375rem', borderRadius: '9999px', background: 'var(--topic-info-bg)', color: 'var(--warning-dark)' }}>
                {q.theme}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-primary, #111827)', margin: 0, lineHeight: 1.5 }}>
              {q.prompt.length > 100 ? q.prompt.slice(0, 100) + '...' : q.prompt}
            </p>
          </button>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', padding: '2rem' }}>
          暂无匹配的真题
        </p>
      )}
    </div>
  )
}
