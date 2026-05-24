'use client'

import { AIFeedback, Suggestion, Highlight, RewrittenParagraph } from '@/types'
import ScoreCard from './ScoreCard'

interface AIFeedbackPanelProps {
  feedback: AIFeedback
}

function StrengthsList({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {items.map((item, i) => (
        <div key={i} className="feedback-item">
          <span className="feedback-icon" style={{ color: '#22c55e' }}>✓</span>
          <span className="feedback-text">{item}</span>
        </div>
      ))}
    </div>
  )
}

function WeaknessesList({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {items.map((item, i) => (
        <div key={i} className="feedback-item">
          <span className="feedback-icon" style={{ color: '#f59e0b' }}>⚠</span>
          <span className="feedback-text">{item}</span>
        </div>
      ))}
    </div>
  )
}

function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  const typeLabels: Record<string, string> = {
    content: '内容',
    structure: '结构',
    language: '语言',
    norm: '规范',
  }

  return (
    <div className="suggestion-card">
      <div className="suggestion-header">
        <span className={`suggestion-type-tag type-${suggestion.type}`}>
          {typeLabels[suggestion.type]}
        </span>
        <span className="suggestion-location">{suggestion.location}</span>
      </div>
      <p className="suggestion-issue">{suggestion.issue}</p>
      <p className="suggestion-fix">{suggestion.fix}</p>
    </div>
  )
}

function HighlightSection({ highlights }: { highlights: Highlight[] }) {
  if (highlights.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {highlights.map((h, i) => (
        <div
          key={i}
          className={`highlight-${h.type}`}
        >
          <p className="highlight-text">
            &ldquo;{h.text}&rdquo;
          </p>
          <p className="highlight-comment">
            {h.type === 'praise' ? '✓ ' : '⚠ '}{h.comment}
          </p>
        </div>
      ))}
    </div>
  )
}

function RewrittenSection({ paragraphs }: { paragraphs: RewrittenParagraph[] }) {
  if (paragraphs.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {paragraphs.map((p, i) => (
        <div key={i} className="rewrite-example">
          <div className="rewrite-original">
            <p className="rewrite-label">原文</p>
            <p className="rewrite-text">{p.original}</p>
          </div>
          <div className="rewrite-improved">
            <p className="rewrite-label">修改建议</p>
            <p className="rewrite-text">{p.rewritten}</p>
          </div>
          <div className="rewrite-reason">
            <p>{p.reason}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AIFeedbackPanel({ feedback }: AIFeedbackPanelProps) {
  const strengths = feedback.strengths || []
  const weaknesses = feedback.weaknesses || []
  const highlights = feedback.highlights || []
  const suggestions = feedback.suggestions || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="score-card">
        <h3 className="score-card-title">AI评审结果</h3>
        <ScoreCard feedback={feedback} />
      </div>

      {strengths.length > 0 && (
        <div className="feedback-section strengths-section">
          <h3 className="feedback-section-title">亮点</h3>
          <StrengthsList items={strengths} />
        </div>
      )}

      {weaknesses.length > 0 && (
        <div className="feedback-section weaknesses-section">
          <h3 className="feedback-section-title">待改进</h3>
          <WeaknessesList items={weaknesses} />
        </div>
      )}

      {highlights.length > 0 && (
        <div className="feedback-section">
          <h3 className="feedback-section-title">文本标注</h3>
          <HighlightSection highlights={highlights} />
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="feedback-section">
          <h3 className="feedback-section-title">修改建议</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {suggestions.map((s, i) => (
              <SuggestionCard key={i} suggestion={s} />
            ))}
          </div>
        </div>
      )}

      {(feedback.rewrittenParagraphs || []).length > 0 && (
        <div className="feedback-section">
          <h3 className="feedback-section-title">段落改写示范</h3>
          <RewrittenSection paragraphs={feedback.rewrittenParagraphs || []} />
        </div>
      )}
    </div>
  )
}
