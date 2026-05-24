'use client'

import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background 0.2s, border-color 0.2s',
        flexShrink: 0,
      }}
    >
      {theme === 'light' ? '☀️' : '🌙'}
    </button>
  )
}
