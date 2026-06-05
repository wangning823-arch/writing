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
      <div className="text-center p-8 bg-white rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          管理面板出错
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || '发生了未知错误'}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          重试
        </button>
      </div>
    </div>
  )
}
