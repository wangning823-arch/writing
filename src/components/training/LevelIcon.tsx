'use client'

import { LEVEL_ICONS } from '@/lib/constants'

interface LevelIconProps {
  level: number
  size?: 'sm' | 'md' | 'lg'
  completed?: boolean
}

export default function LevelIcon({ level, size = 'md', completed = false }: LevelIconProps) {
  const icon = LEVEL_ICONS[level] || '📝'
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${
      completed
        ? 'bg-[#1b61c9] text-white'
        : 'bg-[#f8fafc] border border-[#e0e2e6]'
    }`}>
      {icon}
    </div>
  )
}
