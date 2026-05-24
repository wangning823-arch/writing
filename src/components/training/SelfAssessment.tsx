'use client'

import { useState } from 'react'

export interface SelfAssessmentIssue {
  location: string
  issue: string
  severity: 'high' | 'medium' | 'low'
}

interface SelfAssessmentProps {
  content: string
  subject: 'chinese' | 'english'
  onSubmit: (issues: SelfAssessmentIssue[]) => void
  onSkip: () => void
}

const SEVERITY_OPTIONS = [
  { value: 'high' as const, label: '高' },
  { value: 'medium' as const, label: '中' },
  { value: 'low' as const, label: '低' },
]

const SEVERITY_COLORS: Record<string, string> = {
  high: 'var(--danger)',
  medium: 'var(--warning)',
  low: 'var(--text-muted)',
}

export default function SelfAssessment({ content, subject, onSubmit, onSkip }: SelfAssessmentProps) {
  const [issues, setIssues] = useState<SelfAssessmentIssue[]>([
    { location: '', issue: '', severity: 'medium' },
  ])

  const updateIssue = (index: number, field: keyof SelfAssessmentIssue, value: string) => {
    setIssues((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const addIssue = () => {
    if (issues.length < 3) {
      setIssues((prev) => [...prev, { location: '', issue: '', severity: 'medium' }])
    }
  }

  const removeIssue = (index: number) => {
    if (issues.length > 1) {
      setIssues((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = () => {
    const validIssues = issues.filter((i) => i.location.trim() || i.issue.trim())
    onSubmit(validIssues)
  }

  return (
    <div className="self-assessment">
      <div className="self-assessment-card">
        <h3 className="self-assessment-title">
          {subject === 'chinese' ? '自我评估（可选）' : 'Self-Assessment (Optional)'}
        </h3>
        <p className="self-assessment-desc">
          {subject === 'chinese'
            ? '在AI评审前，请先标注你认为最需要改进的1-2处'
            : 'Before AI review, mark 1-2 areas you think need the most improvement'}
        </p>

        {/* Content preview */}
        <div className="self-assessment-content-preview">
          <div className="self-assessment-content-label">
            {subject === 'chinese' ? '你的作品' : 'Your work'}
          </div>
          <div className="self-assessment-content-text">
            {content}
          </div>
        </div>

        {/* Issue rows */}
        <div className="self-assessment-issues">
          {issues.map((issue, index) => (
            <div key={index} className="self-assessment-row">
              <div className="self-assessment-row-header">
                <span className="self-assessment-row-number">#{index + 1}</span>
                {issues.length > 1 && (
                  <button
                    className="self-assessment-remove-btn"
                    onClick={() => removeIssue(index)}
                    aria-label="Remove issue"
                  >
                    &times;
                  </button>
                )}
              </div>
              <div className="self-assessment-fields">
                <div className="self-assessment-field">
                  <label className="self-assessment-field-label">
                    {subject === 'chinese' ? '段落位置' : 'Location'}
                  </label>
                  <input
                    type="text"
                    className="self-assessment-input"
                    placeholder={subject === 'chinese' ? '如：第2段' : 'e.g., Paragraph 2'}
                    value={issue.location}
                    onChange={(e) => updateIssue(index, 'location', e.target.value)}
                  />
                </div>
                <div className="self-assessment-field">
                  <label className="self-assessment-field-label">
                    {subject === 'chinese' ? '问题描述' : 'Issue'}
                  </label>
                  <input
                    type="text"
                    className="self-assessment-input"
                    placeholder={subject === 'chinese' ? '如：论证不够深入' : 'e.g., Weak argument'}
                    value={issue.issue}
                    onChange={(e) => updateIssue(index, 'issue', e.target.value)}
                  />
                </div>
                <div className="self-assessment-field self-assessment-field-small">
                  <label className="self-assessment-field-label">
                    {subject === 'chinese' ? '严重程度' : 'Severity'}
                  </label>
                  <select
                    className="self-assessment-select"
                    value={issue.severity}
                    onChange={(e) => updateIssue(index, 'severity', e.target.value)}
                    style={{ color: SEVERITY_COLORS[issue.severity] }}
                  >
                    {SEVERITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add more button */}
        {issues.length < 3 && (
          <button className="self-assessment-add-btn" onClick={addIssue}>
            + {subject === 'chinese' ? '添加问题' : 'Add issue'}
          </button>
        )}

        {/* Action buttons */}
        <div className="self-assessment-actions">
          <button className="self-assessment-submit-btn" onClick={handleSubmit}>
            {subject === 'chinese' ? '提交自评' : 'Submit self-assessment'}
          </button>
          <button className="self-assessment-skip-btn" onClick={onSkip}>
            {subject === 'chinese' ? '跳过，直接提交AI评审' : 'Skip, submit to AI review'}
          </button>
        </div>
      </div>
    </div>
  )
}
