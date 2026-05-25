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
      {suggestion.example && (
        <div style={{
          marginTop: '8px',
          padding: '10px 12px',
          borderRadius: '8px',
          background: 'var(--color-blue-50, #eff6ff)',
          borderLeft: '3px solid var(--accent, #3b82f6)',
        }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--accent, #3b82f6)', margin: '0 0 4px 0' }}>
            优秀示例
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--theme_text)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
            {suggestion.example}
          </p>
        </div>
      )}
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
  const keywordEval = feedback.keywordEvaluation

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="score-card">
        <h3 className="score-card-title">AI评审结果</h3>
        <ScoreCard feedback={feedback} />
      </div>

      {/* Keyword Evaluation */}
      {keywordEval && keywordEval.evaluation && (
        <div className="feedback-section" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--theme_bg)' }}>
          <h3 className="feedback-section-title">关键词评价</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--theme_text)', lineHeight: 1.6, marginBottom: '12px' }}>
            {keywordEval.evaluation}
          </p>
          {keywordEval.suggestedKeywords.length > 0 && (
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--theme_text-muted)', marginBottom: '6px' }}>建议关键词：</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {keywordEval.suggestedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'var(--color-blue-50, #eff6ff)',
                      color: 'var(--accent, #3b82f6)',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
