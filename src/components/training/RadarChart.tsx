'use client'

import { useEffect, useRef, useState } from 'react'

interface RadarChartProps {
  data: { dimension: string; score: number }[]
  /** Optional history data for overlay lines. Each entry = one historical snapshot (array of dimension scores). */
  history?: { dimension: string; score: number }[][]
  /** Width/height of the SVG viewport. */
  size?: number
  /** Max score on each axis. */
  maxScore?: number
}

const DIMENSION_COLORS: Record<string, string> = {
  '内容': '#3b82f6',
  '结构': '#8b5cf6',
  '语言': '#f59e0b',
  '规范': '#10b981',
  Content: '#3b82f6',
  Structure: '#8b5cf6',
  Language: '#f59e0b',
  Norms: '#10b981',
}

export default function RadarChart({ data, history = [], size = 240, maxScore = 100 }: RadarChartProps) {
  const [animated, setAnimated] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimated(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const n = data.length
  if (n === 0) return null

  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - 40 // leave room for labels

  const angleStep = (2 * Math.PI) / n
  const startAngle = -Math.PI / 2 // start from top

  const getPoint = (index: number, value: number) => {
    const r = (value / maxScore) * radius
    const angle = startAngle + index * angleStep
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  }

  const getLabelPoint = (index: number) => {
    const r = radius + 22
    const angle = startAngle + index * angleStep
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  }

  // Build polygon points string
  const polygonPoints = data
    .map((d, i) => {
      const p = getPoint(i, animated ? d.score : 0)
      return `${p.x},${p.y}`
    })
    .join(' ')

  // Grid rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0]

  // Axis lines
  const axisLines = data.map((_, i) => {
    const end = getPoint(i, maxScore)
    return { x1: cx, y1: cy, x2: end.x, y2: end.y, key: i }
  })

  return (
    <div className="radar-chart-wrapper">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="radar-chart-svg"
      >
        {/* Grid rings */}
        {rings.map((ratio) => {
          const ringPoints = data
            .map((_, i) => {
              const r = radius * ratio
              const angle = startAngle + i * angleStep
              return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
            })
            .join(' ')
          return (
            <polygon
              key={ratio}
              points={ringPoints}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          )
        })}

        {/* Axis lines */}
        {axisLines.map((line) => (
          <line
            key={line.key}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* History lines (faint) */}
        {history.map((snap: { dimension: string; score: number }[], hi) => {
          const pts = snap
            .map((d: { dimension: string; score: number }, i: number) => {
              const p = getPoint(i, d.score)
              return `${p.x},${p.y}`
            })
            .join(' ')
          return (
            <polygon
              key={`hist-${hi}`}
              points={pts}
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1"
              strokeDasharray="4 2"
              opacity="0.5"
            />
          )
        })}

        {/* Current score polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(59,130,246,0.15)"
          stroke="#3b82f6"
          strokeWidth="2"
          style={{ transition: 'all 0.8s ease-out' }}
        />

        {/* Score dots */}
        {data.map((d, i) => {
          const p = getPoint(i, animated ? d.score : 0)
          const color = DIMENSION_COLORS[d.dimension] || '#3b82f6'
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill={color}
              stroke="white"
              strokeWidth="2"
              style={{ transition: 'all 0.8s ease-out' }}
            />
          )
        })}

        {/* Labels */}
        {data.map((d, i) => {
          const lp = getLabelPoint(i)
          const anchor =
            lp.x < cx - 10 ? 'end' : lp.x > cx + 10 ? 'start' : 'middle'
          return (
            <g key={`label-${i}`}>
              <text
                x={lp.x}
                y={lp.y - 6}
                textAnchor={anchor}
                className="radar-label"
                fontSize="12"
                fill="#374151"
                fontWeight="600"
              >
                {d.dimension}
              </text>
              <text
                x={lp.x}
                y={lp.y + 10}
                textAnchor={anchor}
                className="radar-score-label"
                fontSize="11"
                fill="#6b7280"
              >
                {animated ? d.score : 0}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
