export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-6xl font-bold text-gray-300 mb-4">404</h2>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          页面未找到
        </h3>
        <p className="text-gray-600 mb-6">
          您访问的页面不存在
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-block"
        >
          返回首页
        </a>
      </div>
    </div>
  )
}
