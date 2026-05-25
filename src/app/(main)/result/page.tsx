'use client'

import { useRouter } from 'next/navigation'
import { useTraining } from '@/contexts/TrainingContext'
import ScoreCard from '@/components/ai/ScoreCard'
import DiffView from '@/components/diff/DiffView'
import { CHINESE_LEVEL_NAMES, ENGLISH_LEVEL_NAMES } from '@/lib/constants'

export default function ResultPage() {
  const router = useRouter()
  const { feedback, previousContent, diffSegments, setContent, setFeedback, lastRecordId, setLastRecordId, topicTitle, topicDescription, trainingSubject, trainingLevel } = useTraining()

  if (!feedback) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--theme_text-weak)' }}>暂无评审结果</p>
        <button
          onClick={() => router.push('/')}
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
          返回首页
        </button>
      </div>
    )
  }

  const score = feedback.overallScore
  const passed = score >= 60
  const levelName = trainingSubject === 'chinese' ? CHINESE_LEVEL_NAMES[trainingLevel] : ENGLISH_LEVEL_NAMES[trainingLevel]

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)' }}>
            评审结果
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text-weak)', marginTop: '2px' }}>
            {trainingSubject === 'chinese' ? '语文' : '英语'} L{trainingLevel} {levelName}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => router.push(`/history/${trainingSubject}`)}
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
            训练记录
          </button>
          <button
            onClick={() => {
              setContent(previousContent)
              router.push(`/training/${trainingSubject}/${trainingLevel}`)
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--accent, #3b82f6)',
              background: 'var(--accent-light, #eff6ff)',
              color: 'var(--accent, #3b82f6)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            修改重写
          </button>
          <button
            onClick={() => {
              setFeedback(null)
              setLastRecordId(null)
              setContent('')
              router.push('/')
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--theme_button-primary)',
              color: '#ffffff',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            写新作文
          </button>
        </div>
      </div>

      {/* Score Summary */}
      <div style={{
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        background: passed ? 'var(--color-success-bg, #f0fdf4)' : 'var(--color-warning-bg, #fffbeb)',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: passed ? 'var(--color-success, #22c55e)' : 'var(--color-warning, #f59e0b)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {score}
        </div>
        <div>
          <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--theme_text)', margin: 0 }}>
            {passed ? '通过！' : '继续加油！'}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text-weak)', margin: '2px 0 0 0' }}>
            {passed
              ? '你的表现不错，可以挑战下一关了'
              : '建议根据AI反馈修改后重新提交'}
          </p>
        </div>
      </div>

      {/* Content */}
      {diffSegments.length > 0 ? (
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--theme_text)' }}>
            修改对比
          </h3>
          <DiffView segments={diffSegments} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Left: Essay + Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '8px' }}>
                你的作品
              </h3>
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--theme_bg)',
                  fontSize: '0.875rem',
                  lineHeight: 1.8,
                  color: 'var(--theme_text)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {previousContent}
              </div>
            </div>
            {/* Inline highlights */}
            {feedback.highlights && feedback.highlights.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '8px' }}>
                  文本标注
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {feedback.highlights.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        borderLeft: `3px solid ${h.type === 'praise' ? 'var(--color-success, #22c55e)' : 'var(--color-warning, #f59e0b)'}`,
                        background: h.type === 'praise' ? 'var(--color-success-bg, #f0fdf4)' : 'var(--color-warning-bg, #fffbeb)',
                      }}
                    >
                      <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text)', margin: '0 0 4px 0', fontStyle: 'italic' }}>
                        "{h.text}"
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', margin: 0 }}>
                        {h.type === 'praise' ? '✓ ' : '⚠ '}{h.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Score + Strengths/Weaknesses + Suggestions + Rewrites */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Score Card */}
            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--theme_bg)' }}>
              <ScoreCard feedback={feedback} />
            </div>

            {/* Keyword Evaluation */}
            {feedback.keywordEvaluation && feedback.keywordEvaluation.evaluation && (
              <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--theme_bg)' }}>
                <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--theme_text)', margin: '0 0 8px 0' }}>关键词评价</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text)', lineHeight: 1.6, margin: '0 0 10px 0' }}>
                  {feedback.keywordEvaluation.evaluation}
                </p>
                {feedback.keywordEvaluation.suggestedKeywords.length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', marginBottom: '6px' }}>建议关键词：</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {feedback.keywordEvaluation.suggestedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: 'var(--color-blue-50, #eff6ff)',
                            color: 'var(--accent, #3b82f6)',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Strengths */}
            {feedback.strengths && feedback.strengths.length > 0 && (
              <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--theme_bg)' }}>
                <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--theme_text)', margin: '0 0 8px 0' }}>亮点</h3>
                {feedback.strengths.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--theme_text)' }}>{s}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Weaknesses */}
            {feedback.weaknesses && feedback.weaknesses.length > 0 && (
              <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--theme_bg)' }}>
                <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--theme_text)', margin: '0 0 8px 0' }}>待改进</h3>
                {feedback.weaknesses.map((w, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <span style={{ color: '#f59e0b', flexShrink: 0 }}>⚠</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--theme_text)' }}>{w}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions with examples */}
            {feedback.suggestions && feedback.suggestions.length > 0 && (
              <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--theme_bg)' }}>
                <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--theme_text)', margin: '0 0 10px 0' }}>修改建议</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {feedback.suggestions.map((s, i) => (
                    <div key={i} style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--theme_bg-subtle)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <span style={{
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          background: s.type === 'content' ? '#dbeafe' : s.type === 'structure' ? '#f3e8ff' : s.type === 'language' ? '#dcfce7' : '#fef3c7',
                          color: s.type === 'content' ? '#2563eb' : s.type === 'structure' ? '#9333ea' : s.type === 'language' ? '#16a34a' : '#d97706',
                        }}>
                          {s.type === 'content' ? '内容' : s.type === 'structure' ? '结构' : s.type === 'language' ? '语言' : '规范'}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--theme_text-weak)' }}>{s.location}</span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text)', margin: '0 0 4px 0' }}>{s.issue}</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text-weak)', margin: 0 }}>{s.fix}</p>
                      {s.example && (
                        <div style={{
                          marginTop: '8px',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          background: 'var(--color-blue-50, #eff6ff)',
                          borderLeft: '3px solid var(--accent, #3b82f6)',
                        }}>
                          <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--accent, #3b82f6)', margin: '0 0 3px 0' }}>
                            优秀示例
                          </p>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                            {s.example}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rewritten paragraphs */}
            {feedback.rewrittenParagraphs && feedback.rewrittenParagraphs.length > 0 && (
              <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--theme_bg)' }}>
                <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--theme_text)', margin: '0 0 10px 0' }}>段落改写示范</h3>
                {feedback.rewrittenParagraphs.map((p, i) => (
                  <div key={i} style={{ marginBottom: i < feedback.rewrittenParagraphs!.length - 1 ? '12px' : 0 }}>
                    <div style={{ padding: '8px 10px', borderRadius: '6px', background: 'var(--theme_bg-subtle)', marginBottom: '6px' }}>
                      <p style={{ fontSize: '0.6875rem', fontWeight: 500, color: 'var(--theme_text-weak)', margin: '0 0 4px 0' }}>原文</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text)', margin: 0, lineHeight: 1.6 }}>{p.original}</p>
                    </div>
                    <div style={{ padding: '8px 10px', borderRadius: '6px', background: 'var(--color-success-bg, #f0fdf4)', marginBottom: '6px' }}>
                      <p style={{ fontSize: '0.6875rem', fontWeight: 500, color: 'var(--color-success, #22c55e)', margin: '0 0 4px 0' }}>修改建议</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text)', margin: 0, lineHeight: 1.6 }}>{p.rewritten}</p>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', margin: 0 }}>{p.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
