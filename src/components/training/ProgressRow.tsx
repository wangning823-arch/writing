'use client'

import LevelIcon from './LevelIcon'

interface ProgressRowProps {
  level: number
  label: string
  status: 'completed' | 'current' | 'locked'
  score?: number
  onClick?: () => void
}

export default function ProgressRow({ level, label, status, score, onClick }: ProgressRowProps) {
  const statusStyles: Record<string, string> = {
    completed: 'text-white',
    current: 'border-2 opacity-100',
    locked: 'border opacity-50',
  }
  const statusBg: Record<string, string> = {
    completed: 'var(--theme_button-primary)',
    current: 'color-mix(in srgb, var(--theme_button-primary) 10%, transparent)',
    locked: 'var(--theme_bg-subtle)',
  }
  const statusBorder: Record<string, string> = {
    completed: 'var(--theme_button-primary)',
    current: 'var(--theme_button-primary)',
    locked: 'var(--border-color)',
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${statusStyles[status]}`}
      style={{ background: statusBg[status], borderColor: statusBorder[status] }}
    >
      <LevelIcon level={level} size="sm" completed={status === 'completed'} />
      <div className="flex-1">
        <div className="font-medium" style={{ color: 'var(--theme_text)' }}>L{level} {label}</div>
        {status === 'completed' && score !== undefined && (
          <div className="text-sm" style={{ color: 'var(--theme_text-weak)' }}>得分: {score}</div>
        )}
        {status === 'current' && (
          <div className="text-sm" style={{ color: 'var(--theme_button-primary)' }}>进行中</div>
        )}
        {status === 'locked' && (
          <div className="text-sm" style={{ color: 'var(--theme_text-weak)' }}>未解锁</div>
        )}
      </div>
    </div>
  )
}
