'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center p-8 rounded-xl shadow-sm" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
        <h2 className="text-2xl font-bold mb-4">
          管理面板出错
        </h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          {error.message || '发生了未知错误'}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 text-white rounded-lg transition-colors"
          style={{ background: 'var(--accent)' }}
        >
          重试
        </button>
      </div>
    </div>
  )
}
