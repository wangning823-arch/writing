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
  const statusStyles = {
    completed: 'bg-[#1b61c9] text-white',
    current: 'bg-[#1b61c9]/10 border-2 border-[#1b61c9]',
    locked: 'bg-[#f8fafc] border border-[#e0e2e6] opacity-50',
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${statusStyles[status]}`}
    >
      <LevelIcon level={level} size="sm" completed={status === 'completed'} />
      <div className="flex-1">
        <div className="font-medium text-[#181d26]">L{level} {label}</div>
        {status === 'completed' && score !== undefined && (
          <div className="text-sm text-[rgba(4,14,32,0.69)]">得分: {score}</div>
        )}
        {status === 'current' && (
          <div className="text-sm text-[#1b61c9]">进行中</div>
        )}
        {status === 'locked' && (
          <div className="text-sm text-[rgba(4,14,32,0.69)]">未解锁</div>
        )}
      </div>
    </div>
  )
}
