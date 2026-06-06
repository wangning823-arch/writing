'use client'

interface GenreBadgeProps {
  genre: string
  isConsistent?: boolean
}

const GENRE_COLORS: Record<string, string> = {
  '议论文': '#3b82f6',
  '记叙文': '#8b5cf6',
  '散文': '#ec4899',
  '应用文': '#22c55e',
  '读后续写': '#f59e0b',
  '概要写作': '#06b6d4',
}

export default function GenreBadge({ genre, isConsistent }: GenreBadgeProps) {
  const baseColor = GENRE_COLORS[genre] || '#6b7280'

  let bgColor = `${baseColor}15`
  let textColor = baseColor
  let borderColor = `${baseColor}40`

  if (isConsistent === true) {
    bgColor = 'var(--success-light)'
    textColor = 'var(--success-dark)'
    borderColor = 'var(--success-border)'
  } else if (isConsistent === false) {
    bgColor = 'var(--danger-light)'
    textColor = 'var(--danger-dark)'
    borderColor = 'var(--danger-border)'
  }

  return (
    <span
      className="genre-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.125rem 0.5rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        background: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      {isConsistent === true && '✓ '}
      {isConsistent === false && '✗ '}
      {genre}
    </span>
  )
}
