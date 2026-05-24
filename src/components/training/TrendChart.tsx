'use client'

import { useState, useRef, useEffect } from 'react'

interface TrendChartProps {
  data: {
    date: string
    scores: { content: number; structure: number; language: number; norms: number }
  }[]
  width?: number
  height?: number
}

interface TooltipInfo {
  x: number
  y: number
  date: string
  scores: { content: number; structure: number; language: number; norms: number }
}

const DIMENSIONS = [
  { key: 'content' as const, label: '内容', color: '#3b82f6' },
  { key: 'structure' as const, label: '结构', color: '#8b5cf6' },
  { key: 'language' as const, label: '语言', color: '#f59e0b' },
  { key: 'norms' as const, label: '规范', color: '#10b981' },
]

export default function TrendChart({
  data,
  width: propWidth,
  height = 280,
}: TrendChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(propWidth || 600)
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimated(true))
    return () => cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    if (propWidth) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [propWidth])

  if (data.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
        }}
      >
        暂无趋势数据
      </div>
    )
  }

  const padding = { top: 40, right: 20, bottom: 50, left: 45 }
  const chartWidth = containerWidth - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  const maxScore = 100
  const minScore = 0

  // Compute x positions for each data point
  const xStep = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth / 2
  const getX = (index: number) => padding.left + (data.length > 1 ? index * xStep : chartWidth / 2)
  const getY = (score: number) =>
    padding.top + chartHeight - ((score - minScore) / (maxScore - minScore)) * chartHeight

  // Y-axis grid lines
  const yGridLines = [0, 20, 40, 60, 80, 100]

  // Build path strings for each dimension
  function buildLinePath(dimensionKey: keyof typeof data[0]['scores']): string {
    return data
      .map((d, i) => {
        const x = getX(i)
        const y = getY(d.scores[dimensionKey])
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')
  }

  // Build area fill path (close to bottom)
  function buildAreaPath(dimensionKey: keyof typeof data[0]['scores']): string {
    const linePath = data
      .map((d, i) => {
        const x = getX(i)
        const y = animated ? getY(d.scores[dimensionKey]) : getY(0)
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')
    const lastX = getX(data.length - 1)
    const firstX = getX(0)
    return `${linePath} L ${lastX} ${padding.top + chartHeight} L ${firstX} ${padding.top + chartHeight} Z`
  }

  // Format date for display
  function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  // Determine which x-axis labels to show (avoid overcrowding)
  const maxLabels = Math.min(data.length, Math.floor(chartWidth / 50))
  const labelStep = Math.max(1, Math.ceil(data.length / maxLabels))

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      {/* Legend */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        {DIMENSIONS.map((dim) => (
          <div
            key={dim.key}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
          >
            <div
              style={{
                width: '12px',
                height: '3px',
                borderRadius: '2px',
                background: dim.color,
              }}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              {dim.label}
            </span>
          </div>
        ))}
      </div>

      <svg
        width={containerWidth}
        height={height}
        viewBox={`0 0 ${containerWidth} ${height}`}
        style={{ overflow: 'visible' }}
      >
        {/* Y-axis grid lines */}
        {yGridLines.map((score) => {
          const y = getY(score)
          return (
            <g key={score}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + chartWidth}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray={score === 0 ? undefined : '3 3'}
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#9ca3af"
              >
                {score}
              </text>
            </g>
          )
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % labelStep !== 0 && i !== data.length - 1) return null
          const x = getX(i)
          return (
            <text
              key={i}
              x={x}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              fontSize="10"
              fill="#9ca3af"
            >
              {formatDate(d.date)}
            </text>
          )
        })}

        {/* Area fills (very subtle) */}
        {DIMENSIONS.map((dim) => (
          <path
            key={`area-${dim.key}`}
            d={buildAreaPath(dim.key)}
            fill={dim.color}
            opacity="0.05"
            style={{ transition: 'all 0.8s ease-out' }}
          />
        ))}

        {/* Lines */}
        {DIMENSIONS.map((dim) => (
          <path
            key={`line-${dim.key}`}
            d={buildLinePath(dim.key)}
            fill="none"
            stroke={dim.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'all 0.8s ease-out' }}
          />
        ))}

        {/* Data points */}
        {DIMENSIONS.map((dim) =>
          data.map((d, i) => {
            const x = getX(i)
            const y = animated ? getY(d.scores[dim.key]) : getY(0)
            return (
              <circle
                key={`dot-${dim.key}-${i}`}
                cx={x}
                cy={y}
                r="3"
                fill={dim.color}
                stroke="white"
                strokeWidth="1.5"
                style={{ transition: 'all 0.8s ease-out', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const rect = (e.target as SVGCircleElement).getBoundingClientRect()
                  setTooltip({
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                    date: d.date,
                    scores: d.scores,
                  })
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            )
          }),
        )}

        {/* Invisible hit areas for hover */}
        {data.map((d, i) => (
          <rect
            key={`hit-${i}`}
            x={getX(i) - xStep / 2}
            y={padding.top}
            width={xStep}
            height={chartHeight}
            fill="transparent"
            onMouseEnter={(e) => {
              const rect = (e.target as SVGRectElement).getBoundingClientRect()
              setTooltip({
                x: getX(i),
                y: rect.top,
                date: d.date,
                scores: d.scores,
              })
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: 'translate(-50%, -100%)',
            background: 'rgba(17, 24, 39, 0.95)',
            color: 'white',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.7rem',
            pointerEvents: 'none',
            zIndex: 50,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
            {tooltip.date}
          </div>
          {DIMENSIONS.map((dim) => (
            <div key={dim.key} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: dim.color,
                }}
              />
              <span style={{ opacity: 0.8 }}>{dim.label}</span>
              <span style={{ fontWeight: 600 }}>{tooltip.scores[dim.key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
