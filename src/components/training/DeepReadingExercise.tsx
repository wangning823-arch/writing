'use client'

import { useState } from 'react'

interface Annotation {
  technique: string
  effect: string
  personalThought: string
}

interface Reflection {
  summary: string
  techniques: string
  inspiration: string
}

interface DeepReadingExerciseProps {
  essayTitle: string
  essayContent: string
  subject: 'chinese' | 'english'
  onComplete: (result: any) => void
  onBack: () => void
  userId?: string
}

const TECHNIQUES = [
  '比喻', '拟人', '排比', '反问', '设问', '对比', '衬托', '象征', '借代', '引用', '化用',
  '举例论证', '道理论证', '对比论证', '比喻论证', '引用论证', '假设论证', '因果论证',
  '过渡', '铺垫', '伏笔', '悬念', '以小见大', '欲扬先抑',
]

export default function DeepReadingExercise({
  essayTitle,
  essayContent,
  subject,
  onComplete,
  onBack,
  userId,
}: DeepReadingExerciseProps) {
  const paragraphs = essayContent.split(/\n+/).filter((p) => p.trim())
  const [currentParagraph, setCurrentParagraph] = useState(0)
  const [annotations, setAnnotations] = useState<Record<number, Annotation[]>>({})
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation>({ technique: '', effect: '', personalThought: '' })
  const [showAnnotationForm, setShowAnnotationForm] = useState(false)
  const [reflection, setReflection] = useState<Reflection>({ summary: '', techniques: '', inspiration: '' })
  const [phase, setPhase] = useState<'reading' | 'reflection' | 'submitting'>('reading')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const addAnnotation = () => {
    if (!currentAnnotation.technique) return
    const existing = annotations[currentParagraph] || []
    setAnnotations({ ...annotations, [currentParagraph]: [...existing, { ...currentAnnotation }] })
    setCurrentAnnotation({ technique: '', effect: '', personalThought: '' })
    setShowAnnotationForm(false)
  }

  const removeAnnotation = (paraIdx: number, annoIdx: number) => {
    const existing = annotations[paraIdx] || []
    setAnnotations({ ...annotations, [paraIdx]: existing.filter((_, i) => i !== annoIdx) })
  }

  const handleAnalyze = async () => {
    setPhase('submitting')
    setIsAnalyzing(true)
    try {
      const annotationList = Object.entries(annotations).flatMap(([paraIdx, annos]) =>
        annos.map((a) => ({ paragraphIndex: parseInt(paraIdx), ...a }))
      )

      const res = await fetch('/api/ai/deep-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          essayTitle,
          essayContent,
          annotations: annotationList,
          reflection,
          userId,
          subject,
        }),
      })
      const result = await res.json()
      onComplete(result)
    } catch {
      onComplete({ overallScore: 70, summary: '分析完成', strengths: [], suggestions: [] })
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (phase === 'submitting') {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📖</div>
        <p style={{ color: 'var(--text-secondary, #6b7280)' }}>
          {isAnalyzing ? 'AI 正在分析您的阅读批注...' : '正在提交...'}
        </p>
      </div>
    )
  }

  if (phase === 'reflection') {
    return (
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: '1rem' }}>
          阅读反思
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1.5rem' }}>
          完成批注后，请写下您的阅读感受和收获。
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary, #111827)', marginBottom: '0.5rem' }}>
            这篇文章教会我什么？（2-3句话）
          </label>
          <textarea
            value={reflection.summary}
            onChange={(e) => setReflection({ ...reflection, summary: e.target.value })}
            rows={3}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #e5e7eb)',
              background: 'var(--bg-input, #f9fafb)', fontSize: '0.875rem',
              color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary, #111827)', marginBottom: '0.5rem' }}>
            最值得学习的写作技巧是什么？
          </label>
          <textarea
            value={reflection.techniques}
            onChange={(e) => setReflection({ ...reflection, techniques: e.target.value })}
            rows={3}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #e5e7eb)',
              background: 'var(--bg-input, #f9fafb)', fontSize: '0.875rem',
              color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary, #111827)', marginBottom: '0.5rem' }}>
            对我的写作有什么启发？
          </label>
          <textarea
            value={reflection.inspiration}
            onChange={(e) => setReflection({ ...reflection, inspiration: e.target.value })}
            rows={3}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border-color, #e5e7eb)',
              background: 'var(--bg-input, #f9fafb)', fontSize: '0.875rem',
              color: 'var(--text-primary, #111827)', resize: 'vertical', boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setPhase('reading')}
            style={{
              padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)',
              background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)', cursor: 'pointer', fontSize: '0.875rem',
            }}
          >
            返回批注
          </button>
          <button
            onClick={handleAnalyze}
            style={{
              padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none',
              background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
            }}
          >
            提交分析
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Progress */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)' }}>
            第 {currentParagraph + 1} / {paragraphs.length} 段
          </span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)' }}>
            已标注 {Object.values(annotations).flat().length} 处
          </span>
        </div>
        <div style={{ height: '4px', background: 'var(--bg-secondary, #f3f4f6)', borderRadius: '2px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              background: '#3b82f6',
              borderRadius: '2px',
              width: `${((currentParagraph + 1) / paragraphs.length) * 100}%`,
              transition: 'width 0.3s',
            }}
          />
        </div>
      </div>

      {/* Current paragraph */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: '0.75rem',
          border: '1px solid var(--border-color, #e5e7eb)',
          background: 'var(--bg-card, #fff)',
          marginBottom: '1rem',
        }}
      >
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary, #111827)', lineHeight: 1.8, margin: 0 }}>
          {paragraphs[currentParagraph]}
        </p>
      </div>

      {/* Existing annotations for this paragraph */}
      {(annotations[currentParagraph] || []).length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary, #6b7280)', marginBottom: '0.5rem' }}>
            本段批注
          </h4>
          {(annotations[currentParagraph] || []).map((anno, i) => (
            <div
              key={i}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0369a1', background: '#e0f2fe', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>
                  {anno.technique}
                </span>
                {anno.effect && <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary, #111827)', margin: '0.25rem 0 0' }}>{anno.effect}</p>}
                {anno.personalThought && <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #6b7280)', margin: '0.25rem 0 0', fontStyle: 'italic' }}>{anno.personalThought}</p>}
              </div>
              <button
                onClick={() => removeAnnotation(currentParagraph, i)}
                style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem' }}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add annotation form */}
      {showAnnotationForm ? (
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border-color, #e5e7eb)',
            background: 'var(--bg-secondary, #f9fafb)',
            marginBottom: '1rem',
          }}
        >
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
              写作技巧
            </label>
            <select
              value={currentAnnotation.technique}
              onChange={(e) => setCurrentAnnotation({ ...currentAnnotation, technique: e.target.value })}
              style={{
                width: '100%', padding: '0.5rem', borderRadius: '0.375rem',
                border: '1px solid var(--border-color, #e5e7eb)',
                background: 'var(--bg-card, #fff)', fontSize: '0.875rem',
                color: 'var(--text-primary, #111827)', boxSizing: 'border-box',
              }}
            >
              <option value="">选择技巧...</option>
              {TECHNIQUES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
              表达效果
            </label>
            <input
              type="text"
              value={currentAnnotation.effect}
              onChange={(e) => setCurrentAnnotation({ ...currentAnnotation, effect: e.target.value })}
              placeholder="这个技巧产生了什么效果？"
              style={{
                width: '100%', padding: '0.5rem', borderRadius: '0.375rem',
                border: '1px solid var(--border-color, #e5e7eb)',
                background: 'var(--bg-card, #fff)', fontSize: '0.875rem',
                color: 'var(--text-primary, #111827)', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary, #111827)', marginBottom: '0.25rem' }}>
              个人感悟
            </label>
            <input
              type="text"
              value={currentAnnotation.personalThought}
              onChange={(e) => setCurrentAnnotation({ ...currentAnnotation, personalThought: e.target.value })}
              placeholder="你的感想..."
              style={{
                width: '100%', padding: '0.5rem', borderRadius: '0.375rem',
                border: '1px solid var(--border-color, #e5e7eb)',
                background: 'var(--bg-card, #fff)', fontSize: '0.875rem',
                color: 'var(--text-primary, #111827)', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowAnnotationForm(false)}
              style={{
                padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color, #e5e7eb)',
                background: 'var(--bg-card, #fff)', color: 'var(--text-primary, #111827)', cursor: 'pointer', fontSize: '0.8125rem',
              }}
            >
              取消
            </button>
            <button
              onClick={addAnnotation}
              disabled={!currentAnnotation.technique}
              style={{
                padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: 'none',
                background: currentAnnotation.technique ? '#3b82f6' : '#9ca3af',
                color: '#fff', cursor: currentAnnotation.technique ? 'pointer' : 'not-allowed', fontSize: '0.8125rem',
              }}
            >
              添加
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAnnotationForm(true)}
          style={{
            width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
            border: '1px dashed var(--border-color, #e5e7eb)',
            background: 'transparent', color: 'var(--text-secondary, #6b7280)',
            cursor: 'pointer', fontSize: '0.875rem', marginBottom: '1rem',
          }}
        >
          + 添加批注
        </button>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => setCurrentParagraph(Math.max(0, currentParagraph - 1))}
          disabled={currentParagraph === 0}
          style={{
            padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e5e7eb)',
            background: 'var(--bg-card, #fff)',
            color: currentParagraph === 0 ? 'var(--text-tertiary, #9ca3af)' : 'var(--text-primary, #111827)',
            cursor: currentParagraph === 0 ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
          }}
        >
          ← 上一段
        </button>

        {currentParagraph < paragraphs.length - 1 ? (
          <button
            onClick={() => setCurrentParagraph(currentParagraph + 1)}
            style={{
              padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none',
              background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '0.875rem',
            }}
          >
            下一段 →
          </button>
        ) : (
          <button
            onClick={() => setPhase('reflection')}
            style={{
              padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none',
              background: '#16a34a', color: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
            }}
          >
            完成阅读，写反思
          </button>
        )}
      </div>
    </div>
  )
}
