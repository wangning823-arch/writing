'use client'

import { useRouter } from 'next/navigation'
import { useTraining } from '@/contexts/TrainingContext'
import AIFeedbackPanel from '@/components/ai/AIFeedback'
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Essay Preview */}
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

          {/* Feedback */}
          <div>
            <AIFeedbackPanel feedback={feedback} />
          </div>
        </div>
      )}
    </div>
  )
}
