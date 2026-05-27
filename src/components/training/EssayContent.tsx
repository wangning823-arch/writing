'use client'

interface EssayContentProps {
  content: string
  style?: React.CSSProperties
  showWordCount?: boolean
}

function countChars(text: string): number {
  return text.replace(/\s/g, '').length
}

export default function EssayContent({ content, style, showWordCount = true }: EssayContentProps) {
  const paragraphs = content.split(/\n+/).filter(p => p.trim())
  const wordCount = countChars(content)

  return (
    <div>
      <div style={{ whiteSpace: 'pre-wrap', ...style }}>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ textIndent: '2em', margin: '0 0 0.5em 0' }}>
            {p.trim()}
          </p>
        ))}
      </div>
      {showWordCount && (
        <div style={{
          textAlign: 'right',
          fontSize: '0.75rem',
          color: 'var(--text-muted, #999)',
          marginTop: '0.5rem',
        }}>
          共{wordCount}字
        </div>
      )}
    </div>
  )
}
