'use client'

import { useState } from 'react'
import ScoreResultPanel from './ScoreResultPanel'

interface ComprehensiveTrainingProps {
  subject: 'chinese' | 'english'
  onComplete?: (result: any) => void
  onBack?: () => void
}

type Stage = 'analyze' | 'outline' | 'write' | 'revise' | 'result'

const STAGE_LABELS: Record<Stage, string> = {
  analyze: '审题分析',
  outline: '提纲编写',
  write: '正文写作',
  revise: '修改完善',
  result: '综合评价',
}

export default function ComprehensiveTraining({ subject, onComplete, onBack }: ComprehensiveTrainingProps) {
  const [stage, setStage] = useState<Stage>('analyze')
  const [topic, setTopic] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [outline, setOutline] = useState('')
  const [essay, setEssay] = useState('')
  const [revisionNotes, setRevisionNotes] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!topic.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai/pre-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, phase: 'brainstorm', subject }),
      })
      const data = await res.json()
      setAnalysis(JSON.stringify(data, null, 2))
      setStage('outline')
    } catch {
      setStage('outline')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAll = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: essay,
          topic,
          genre: '议论文',
          subject,
        }),
      })
      const data = await res.json()
      setResult(data)
      setStage('result')
      onComplete?.(data)
    } catch {
      setResult({ overallScore: 70, summary: '综合训练完成' })
      setStage('result')
    } finally {
      setLoading(false)
    }
  }

  const stages: Stage[] = ['analyze', 'outline', 'write', 'revise']
  const currentStageIdx = stages.indexOf(stage)

  return (
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
        综合写作训练
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1rem' }}>
        审题 → 提纲 → 写作 → 修改，全流程训练
      </p>

      {stage !== 'result' && (
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem' }}>
          {stages.map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                height: '4px', borderRadius: '2px', marginBottom: '0.375rem',
                background: i <= currentStageIdx ? '#3b82f6' : 'var(--border-color, #e5e7eb)',
              }} />
              <span style={{
                fontSize: '0.6875rem',
                color: i <= currentStageIdx ? '#3b82f6' : 'var(--text-tertiary, #9ca3af)',
                fontWeight: i === currentStageIdx ? 600 : 400,
              }}>
                {STAGE_LABELS[s]}
              </span>
            </div>
          ))}
        </div>
      )}

      {stage === 'analyze' && (
        <div>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
            placeholder="请输入作文题目或材料..."
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
              fontSize: '0.875rem', color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '1rem',
            }}
          />
          <button
            onClick={handleAnalyze}
            disabled={!topic.trim() || loading}
            style={{
              width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: 'none',
              background: topic.trim() && !loading ? 'var(--theme_button-primary)' : '#9ca3af',
              color: '#fff', cursor: topic.trim() && !loading ? 'pointer' : 'not-allowed', fontSize: '0.875rem',
            }}
          >
            {loading ? 'AI 分析中...' : 'AI 辅助审题'}
          </button>
        </div>
      )}

      {stage === 'outline' && (
        <div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '0.75rem' }}>
            根据审题结果，编写写作提纲
          </p>
          <textarea
            value={outline}
            onChange={(e) => setOutline(e.target.value)}
            rows={6}
            placeholder="一、开头段&#10;  1. 引入方式&#10;  2. 中心论点&#10;二、分论点一&#10;  1. 论据&#10;  2. 分析&#10;三、分论点二&#10;......&#10;五、结尾段"
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
              fontSize: '0.875rem', color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '1rem',
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setStage('analyze')} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)', cursor: 'pointer', fontSize: '0.875rem' }}>
              上一步
            </button>
            <button
              onClick={() => setStage('write')}
              style={{ flex: 2, padding: '0.625rem', borderRadius: '0.5rem', border: 'none', background: 'var(--theme_button-primary)', color: '#fff', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              开始写作
            </button>
          </div>
        </div>
      )}

      {stage === 'write' && (
        <div>
          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            rows={15}
            placeholder="在此写下你的作文..."
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
              fontSize: '0.875rem', color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '0.5rem',
            }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #9ca3af)', marginBottom: '1rem' }}>
            {essay.replace(/\s/g, '').length} 字
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setStage('outline')} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)', cursor: 'pointer', fontSize: '0.875rem' }}>
              上一步
            </button>
            <button
              onClick={() => setStage('revise')}
              disabled={!essay.trim()}
              style={{ flex: 2, padding: '0.625rem', borderRadius: '0.5rem', border: 'none', background: essay.trim() ? 'var(--theme_button-primary)' : '#9ca3af', color: '#fff', cursor: essay.trim() ? 'pointer' : 'not-allowed', fontSize: '0.875rem' }}
            >
              进入修改
            </button>
          </div>
        </div>
      )}

      {stage === 'revise' && (
        <div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '0.75rem' }}>
            回顾你的作文，记录需要修改的地方
          </p>
          <textarea
            value={revisionNotes}
            onChange={(e) => setRevisionNotes(e.target.value)}
            rows={4}
            placeholder="记录修改要点..."
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)',
              fontSize: '0.875rem', color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '1rem',
            }}
          />
          <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-secondary, #f9fafb)', border: '1px solid var(--border-color, #e5e7eb)', marginBottom: '1rem', maxHeight: '200px', overflow: 'auto' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary, #111827)', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {essay}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setStage('write')} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)', background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)', cursor: 'pointer', fontSize: '0.875rem' }}>
              上一步
            </button>
            <button
              onClick={handleSubmitAll}
              disabled={loading}
              style={{ flex: 2, padding: '0.625rem', borderRadius: '0.5rem', border: 'none', background: loading ? '#9ca3af' : 'var(--theme_button-primary)', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.875rem' }}
            >
              {loading ? 'AI 评审中...' : '提交综合评审'}
            </button>
          </div>
        </div>
      )}

      {stage === 'result' && result && (
        <div>
          <ScoreResultPanel
            overallScore={result.overallScore || 70}
            summary={result.summary}
            strengths={result.strengths}
            suggestions={result.suggestions}
            scoringCriteria={result.scoringCriteria}
            referenceAnswer={result.referenceAnswer}
            exampleVariants={result.exampleVariants}
            showRetry={false}
          />
          <button
            onClick={() => { setStage('analyze'); setTopic(''); setAnalysis(''); setOutline(''); setEssay(''); setRevisionNotes(''); setResult(null) }}
            style={{
              width: '100%', padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)',
              background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)', cursor: 'pointer', fontSize: '0.875rem', marginTop: '0.75rem',
            }}
          >
            开始新的训练
          </button>
        </div>
      )}
    </div>
  )
}
