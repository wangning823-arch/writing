'use client'

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  hover?: boolean
}

interface CardButtonProps extends CardProps {
  onClick?: () => void
  disabled?: boolean
}

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <div className={`
      border rounded-2xl
      ${paddingClasses[padding]}
      ${hover ? 'transition-shadow hover:shadow-[rgba(45,127,249,0.28)_0px_1px_3px]' : ''}
      ${className}
    `} style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      {children}
    </div>
  )
}

export function CardButton({ children, className = '', padding = 'md', onClick, disabled = false }: CardButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        border rounded-2xl
        ${padding === 'sm' ? 'p-3' : padding === 'md' ? 'p-4' : 'p-6'}
        text-left transition-all
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#1b61c9] hover:shadow-[rgba(45,127,249,0.28)_0px_1px_3px]'}
        ${className}
      `}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      {children}
    </button>
  )
}

interface CardGridProps {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4
  className?: string
}

export function CardGrid({ children, cols = 2, className = '' }: CardGridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  return (
    <div className={`grid ${colClasses[cols]} gap-4 ${className}`}>
      {children}
    </div>
  )
}
