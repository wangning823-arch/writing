export type Theme = 'light' | 'dark'
export type Grade = '高一' | '高二' | '高三'

export function getThemeCSS(theme: Theme): Record<string, string> {
  if (theme === 'dark') {
    return {
      '--bg-primary': '#111827',
      '--bg-secondary': '#1f2937',
      '--bg-card': '#1f2937',
      '--bg-hover': '#374151',
      '--text-primary': '#f9fafb',
      '--text-secondary': '#d1d5db',
      '--text-muted': '#9ca3af',
      '--border-color': '#374151',
      '--accent': '#3b82f6',
      '--accent-hover': '#2563eb',
      '--success': '#22c55e',
      '--warning': '#f59e0b',
      '--danger': '#ef4444',
      '--shadow': '0 4px 6px -1px rgba(0,0,0,0.3)',
    }
  }
  return {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f9fafb',
    '--bg-card': '#ffffff',
    '--bg-hover': '#f3f4f6',
    '--text-primary': '#111827',
    '--text-secondary': '#374151',
    '--text-muted': '#9ca3af',
    '--border-color': '#e5e7eb',
    '--accent': '#3b82f6',
    '--accent-hover': '#2563eb',
    '--success': '#22c55e',
    '--warning': '#f59e0b',
    '--danger': '#ef4444',
    '--shadow': '0 1px 3px 0 rgba(0,0,0,0.1)',
  }
}
