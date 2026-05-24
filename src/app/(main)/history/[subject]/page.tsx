'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useNavigation } from '@/contexts/NavigationContext'
import { useTraining } from '@/contexts/TrainingContext'
import { CHINESE_LEVEL_NAMES, ENGLISH_LEVEL_NAMES } from '@/lib/constants'

interface TrainingRecord {
  id: string
  subject: string
  level: number
  score: number | null
  content: string
  dimensionScores: string
  isRevision: boolean
  revisionOf: string | null
  timeSpent: number | null
  createdAt: string
  topic: { id: string; title: string; type: string; source: string; year: number | null } | null
}

interface RecordDetail extends TrainingRecord {
  feedback: string
  suggestions: string
}

export default function HistoryPage() {
  const params = useParams()
  const router = useRouter()
  const { userId } = useNavigation()
  const { setContent, setFeedback, setLastRecordId, setTopicTitle, setTopicDescription, setResumeTopic } = useTraining()
  const subject = params.subject as 'chinese' | 'english'

  const [records, setRecords] = useState<TrainingRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<RecordDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const levelNames = subject === 'chinese' ? CHINESE_LEVEL_NAMES : ENGLISH_LEVEL_NAMES

  const fetchRecords = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/training/records?userId=${encodeURIComponent(userId)}&subject=${subject}&page=${p}&limit=15`)
      const data = await res.json()
      setRecords(data.items || [])
      setTotal(data.total || 0)
    } catch {
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [userId, subject])

  useEffect(() => {
    fetchRecords(page)
  }, [fetchRecords, page])

  const handleViewDetail = async (record: TrainingRecord) => {
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/training/records/${record.id}`)
      const data = await res.json()
      setSelectedRecord(data)
    } catch {
      // Fallback: show basic info
      setSelectedRecord(record as RecordDetail)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleResumeTraining = (record: TrainingRecord) => {
    setContent(record.content)
    setLastRecordId(record.id)
    if (record.topic) {
      setResumeTopic({
        id: record.topic.id,
        subject: subject as 'chinese' | 'english',
        type: record.topic.type,
        title: record.topic.title,
        description: '',
        source: record.topic.source,
        year: record.topic.year,
      })
    }
    router.push(`/training/${subject}/${record.level}`)
  }

  const handleNewTraining = (level: number) => {
    setContent('')
    setLastRecordId(null)
    router.push(`/training/${subject}/${level}`)
  }

  const totalPages = Math.ceil(total / 15)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffHr = Math.floor(diffMs / 3600000)
    const diffDay = Math.floor(diffMs / 86400000)

    if (diffMin < 1) return '刚刚'
    if (diffMin < 60) return `${diffMin}分钟前`
    if (diffHr < 24) return `${diffHr}小时前`
    if (diffDay < 7) return `${diffDay}天前`
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  const scoreColor = (score: number | null) => {
    if (score == null) return 'var(--theme_text-weak)'
    if (score >= 80) return 'var(--color-success, #22c55e)'
    if (score >= 60) return 'var(--color-warning, #f59e0b)'
    return 'var(--color-error, #ef4444)'
  }

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <button
            onClick={() => router.push(`/subject/${subject}`)}
            style={{
              border: 'none',
              background: 'none',
              color: 'var(--theme_text-weak)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              marginBottom: '8px',
              padding: 0,
            }}
          >
            ← 返回
          </button>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--theme_text)' }}>
            {subject === 'chinese' ? '语文' : '英语'}训练记录
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text-weak)', marginTop: '2px' }}>
            共 {total} 条记录
          </p>
        </div>
        <button
          onClick={() => handleNewTraining(1)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--theme_button-primary)',
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          新训练
        </button>
      </div>

      {/* Record List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--theme_text-weak)' }}>
          加载中...
        </div>
      ) : records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--theme_text-weak)', marginBottom: '16px' }}>暂无训练记录</p>
          <button
            onClick={() => handleNewTraining(1)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--theme_button-primary)',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            开始第一次训练
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {records.map((record) => (
            <div
              key={record.id}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--theme_bg)',
                cursor: 'pointer',
                transition: 'border-color var(--transition-fast)',
              }}
              onClick={() => handleViewDetail(record)}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--theme_button-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'var(--theme_bg-subtle)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'var(--theme_text)',
                  }}>
                    L{record.level} {levelNames[record.level] || ''}
                  </span>
                  {record.isRevision && (
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'var(--color-warning-bg, #fffbeb)',
                      color: 'var(--color-warning, #f59e0b)',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                    }}>
                      修改
                    </span>
                  )}
                  {record.topic && (
                    <span style={{
                      fontSize: '0.6875rem',
                      color: 'var(--theme_text-weak)',
                      opacity: 0.7,
                    }}>
                      {record.topic.source}{record.topic.year ? ` ${record.topic.year}` : ''}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)' }}>
                    {formatDate(record.createdAt)}
                  </span>
                  {record.score != null && (
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: scoreColor(record.score),
                    }}>
                      {record.score}
                    </span>
                  )}
                </div>
              </div>

              {record.topic && (
                <p style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--theme_text)',
                  margin: '0 0 4px 0',
                }}>
                  {record.topic.title}
                </p>
              )}

              <p style={{
                fontSize: '0.75rem',
                color: 'var(--theme_text-weak)',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {record.content.slice(0, 80)}...
              </p>

              <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleResumeTraining(record)
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--theme_button-primary)',
                    background: 'transparent',
                    color: 'var(--theme_button-primary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  继续修改
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNewTraining(record.level)
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--theme_bg)',
                    color: 'var(--theme_text-weak)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  同关新练
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--theme_bg)',
              color: page === 1 ? 'var(--theme_text-weak)' : 'var(--theme_text)',
              cursor: page === 1 ? 'default' : 'pointer',
              opacity: page === 1 ? 0.5 : 1,
            }}
          >
            上一页
          </button>
          <span style={{ padding: '6px 12px', fontSize: '0.8125rem', color: 'var(--theme_text-weak)' }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--theme_bg)',
              color: page === totalPages ? 'var(--theme_text-weak)' : 'var(--theme_text)',
              cursor: page === totalPages ? 'default' : 'pointer',
              opacity: page === totalPages ? 0.5 : 1,
            }}
          >
            下一页
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '32px',
          }}
          onClick={() => setSelectedRecord(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '700px',
              maxHeight: '80vh',
              overflow: 'auto',
              background: 'var(--theme_bg)',
              borderRadius: '16px',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--theme_text)', margin: 0 }}>
                  L{selectedRecord.level} {levelNames[selectedRecord.level] || ''}
                  {selectedRecord.topic && ` — ${selectedRecord.topic.title}`}
                </h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--theme_text-weak)', margin: '4px 0 0 0' }}>
                  {new Date(selectedRecord.createdAt).toLocaleString('zh-CN')}
                  {selectedRecord.score != null && ` · 得分 ${selectedRecord.score}`}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '1.25rem',
                  color: 'var(--theme_text-weak)',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: 'var(--theme_bg-subtle)',
              fontSize: '0.875rem',
              lineHeight: 1.8,
              color: 'var(--theme_text)',
              whiteSpace: 'pre-wrap',
              marginBottom: '16px',
              maxHeight: '300px',
              overflow: 'auto',
            }}>
              {selectedRecord.content}
            </div>

            {/* Feedback */}
            {selectedRecord.feedback && (() => {
              try {
                const fb = JSON.parse(selectedRecord.feedback)
                return fb.suggestions?.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '8px' }}>
                      AI建议
                    </h3>
                    {fb.suggestions.map((s: any, i: number) => (
                      <div key={i} style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'var(--theme_bg-subtle)',
                        marginBottom: '6px',
                        fontSize: '0.8125rem',
                        color: 'var(--theme_text)',
                      }}>
                        <span style={{ fontWeight: 500 }}>{s.type === 'content' ? '内容' : s.type === 'structure' ? '结构' : s.type === 'language' ? '语言' : '规范'}:</span> {s.issue}
                        {s.fix && <span style={{ color: 'var(--theme_text-weak)' }}> → {s.fix}</span>}
                      </div>
                    ))}
                  </div>
                )
              } catch { return null }
            })()}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setSelectedRecord(null)
                  handleResumeTraining(selectedRecord)
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--theme_button-primary)',
                  background: 'var(--theme_button-primary)',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                继续修改
              </button>
              <button
                onClick={() => {
                  setSelectedRecord(null)
                  handleNewTraining(selectedRecord.level)
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
                同关新练
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
