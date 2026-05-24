import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import { join } from 'path'
import ThemeProvider from '@/components/theme/ThemeProvider'

export const metadata: Metadata = {
  title: '笔锋 - AI写作提升助手',
  description: 'AI驱动的高中语文英语写作提升系统',
}

// Read CSS files at build time and inject as inline style
const globalsPath = join(process.cwd(), 'src/app/globals.css')
const tokensPath = join(process.cwd(), 'src/styles/design-tokens.css')
const globalCss = readFileSync(globalsPath, 'utf-8')
const tokensCss = readFileSync(tokensPath, 'utf-8')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <style dangerouslySetInnerHTML={{ __html: tokensCss + '\n' + globalCss }} />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
