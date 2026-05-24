'use client'

import { useRouter } from 'next/navigation'
import { useTraining } from '@/contexts/TrainingContext'
import TrainingReport from '@/components/training/TrainingReport'
import AIFeedbackPanel from '@/components/ai/AIFeedback'
import DiffView from '@/components/diff/DiffView'

export default function ResultPage() {
  const router = useRouter()
  const { feedback, previousContent, diffSegments, setContent, setFeedback } = useTraining()

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

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)' }}>
          评审结果
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setFeedback(null)
              router.push('/')
            }}
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
            写新作文
          </button>
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
