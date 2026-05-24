'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import UserSwitcher from '@/components/UserSwitcher'
import { useNavigation } from '@/contexts/NavigationContext'

export default function HomePage() {
  const { userId } = useNavigation()
  const [grade, setGrade] = useState('高一')
  const [chineseStage, setChineseStage] = useState('sprout')
  const [englishStage, setEnglishStage] = useState('sprout')

  useEffect(() => {
    const saved = localStorage.getItem('bifeng-grade')
    if (saved) setGrade(saved)

    fetch(`/api/progress?userId=${encodeURIComponent(userId)}`)
      .then(r => r.json())
      .then(data => {
        setChineseStage(data.chineseStage || 'sprout')
        setEnglishStage(data.englishStage || 'sprout')
      })
      .catch(() => {})
  }, [userId])

  const stageIcon = (stage: string) => {
    if (stage === 'growing') return '🌿'
    if (stage === 'thriving') return '🌳'
    return '🌱'
  }

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--theme_text)',
              fontFamily: 'var(--font-display)',
            }}
          >
            欢迎来到笔锋
          </h1>
          <UserSwitcher />
        </div>
        <p style={{ fontSize: '1rem', color: 'var(--theme_text-weak)', lineHeight: 1.6 }}>
          AI驱动的高中语文英语写作提升系统
        </p>
      </div>

      {/* Subject Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
        <Link href="/subject/chinese" style={{ textDecoration: 'none' }}>
          <div
            style={{
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              background: 'var(--theme_bg)',
              transition: 'all var(--transition-normal)',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📖</div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '4px' }}>
              语文写作
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text-weak)', marginBottom: '12px' }}>
              审题立意、段落结构、论证技巧
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '12px',
                background: 'var(--color-blue-50)',
                fontSize: '0.75rem',
                color: 'var(--theme_button-primary)',
              }}
            >
              {stageIcon(chineseStage)} 继续训练
            </div>
          </div>
        </Link>

        <Link href="/subject/english" style={{ textDecoration: 'none' }}>
          <div
            style={{
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              background: 'var(--theme_bg)',
              transition: 'all var(--transition-normal)',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔤</div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--theme_text)', marginBottom: '4px' }}>
              英语写作
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text-weak)', marginBottom: '12px' }}>
              句式仿写、段落骨架、语法纠错
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '12px',
                background: 'var(--color-blue-50)',
                fontSize: '0.75rem',
                color: 'var(--theme_button-primary)',
              }}
            >
              {stageIcon(englishStage)} 继续训练
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
