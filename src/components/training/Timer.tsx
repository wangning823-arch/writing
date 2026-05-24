'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface TimerProps {
  /** Duration in seconds. null = untimed (no display). */
  duration: number | null
  /** Called once when countdown reaches zero. */
  onTimeUp: () => void
  /** Called every tick with remaining seconds. */
  onTick?: (remaining: number) => void
  /** If true, timer is paused. */
  paused?: boolean
  /** Force reset to a new duration (e.g. on step change). */
  resetKey?: number | string
}

export default function Timer({ duration, onTimeUp, onTick, paused = false, resetKey }: TimerProps) {
  const [remaining, setRemaining] = useState(duration ?? 0)
  const firedRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Reset when duration or resetKey changes
  useEffect(() => {
    if (duration != null) {
      setRemaining(duration)
      firedRef.current = false
    }
  }, [duration, resetKey])

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    clearTimer()
    if (duration == null || paused || remaining <= 0) return

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1
        if (next <= 0) {
          clearTimer()
          if (!firedRef.current) {
            firedRef.current = true
            // Use setTimeout to avoid setState-during-render
            setTimeout(() => onTimeUp(), 0)
          }
          return 0
        }
        if (onTick) setTimeout(() => onTick(next), 0)
        return next
      })
    }, 1000)

    return clearTimer
  }, [duration, paused, remaining > 0, onTimeUp, onTick, clearTimer])

  // Don't render if untimed
  if (duration == null) return null

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  let colorClass = 'timer-normal'
  if (remaining <= 30) colorClass = 'timer-danger'
  else if (remaining <= 60) colorClass = 'timer-warning'

  return (
    <div className={`timer-container ${colorClass} ${remaining <= 10 && remaining > 0 ? 'timer-pulse' : ''}`}>
      <svg className="timer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="timer-display">{display}</span>
      {paused && <span className="timer-paused-label">暂停</span>}
    </div>
  )
}
