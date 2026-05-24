'use client'

import { useState } from 'react'

interface ParagraphCard {
  label: string
  content: string
}

interface L2ParagraphCardsProps {
  onConfirm: (cards: ParagraphCard[]) => void
  onBack?: () => void
}

const INITIAL_CARDS: ParagraphCard[] = [
  { label: '开头段', content: '' },
  { label: '论证段1', content: '' },
  { label: '论证段2', content: '' },
  { label: '论证段3', content: '' },
  { label: '结尾段', content: '' },
]

const MAX_CHARS = 30

export default function L2ParagraphCards({ onConfirm, onBack }: L2ParagraphCardsProps) {
  const [cards, setCards] = useState<ParagraphCard[]>(INITIAL_CARDS)
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  const updateContent = (idx: number, val: string) => {
    const next = [...cards]
    next[idx] = { ...next[idx], content: val.slice(0, MAX_CHARS) }
    setCards(next)
  }

  const handleDragStart = (idx: number) => setDragIdx(idx)

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault()
    if (dragIdx == null || dragIdx === targetIdx) return
    const next = [...cards]
    const [moved] = next.splice(dragIdx, 1)
    next.splice(targetIdx, 0, moved)
    setCards(next)
    setDragIdx(targetIdx)
  }

  const handleDragEnd = () => setDragIdx(null)

  const filledCount = cards.filter((c) => c.content.trim().length > 0).length
  const allFilled = filledCount === cards.length

  return (
    <div className="l2-editor">
      <div className="l2-editor-header">
        {onBack && (
          <button className="l1-back-btn" onClick={onBack}>← 返回</button>
        )}
        <h2 className="l1-editor-title">L2 段落功能卡</h2>
      </div>

      <p className="l2-hint">
        为每个段落写出核心内容概要（30字以内），构建文章骨架。
      </p>

      <div className="l2-cards-list">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`l2-card ${dragIdx === idx ? 'l2-card-dragging' : ''}`}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
          >
            <div className="l2-card-header">
              <span className="l2-card-drag-handle">⠿</span>
              <span className="l2-card-label">{card.label}</span>
              <span className={`l2-card-count ${card.content.length >= MAX_CHARS ? 'l2-card-count-full' : ''}`}>
                {card.content.length}/{MAX_CHARS}
              </span>
            </div>
            <textarea
              className="l2-card-textarea"
              value={card.content}
              onChange={(e) => updateContent(idx, e.target.value)}
              placeholder={`${card.label}的核心内容...`}
              rows={2}
            />
          </div>
        ))}
      </div>

      {/* Visual structure indicator */}
      <div className="l2-structure-visual">
        <div className="l2-structure-line" />
        <div className="l2-structure-labels">
          {cards.map((card, i) => (
            <span key={i} className={`l2-structure-dot ${card.content.trim() ? 'l2-structure-dot-filled' : ''}`}>
              {card.label.charAt(0)}
            </span>
          ))}
        </div>
        <div className="l2-structure-line" />
      </div>

      <div className="l1-actions">
        <button
          className={`button button-primary ${!allFilled ? 'l1-confirm-disabled' : ''}`}
          disabled={!allFilled}
          onClick={() => onConfirm(cards)}
        >
          确认结构
        </button>
      </div>
    </div>
  )
}
