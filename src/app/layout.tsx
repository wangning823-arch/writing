import type { Metadata } from 'next'
import './globals.css'
import '@/styles/design-tokens.css'
import ThemeProvider from '@/components/theme/ThemeProvider'

export const metadata: Metadata = {
  title: '笔锋 - AI写作提升助手',
  description: 'AI驱动的高中语文英语写作提升系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
