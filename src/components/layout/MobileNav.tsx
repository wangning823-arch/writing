'use client'

import { HomeIcon, BookIcon, FolderIcon, FileTextIcon } from '@/components/icons'

export type MobileView = 'home' | 'training' | 'materials' | 'errors' | 'profile'

interface MobileNavProps {
  activeView: MobileView
  onViewChange: (view: MobileView) => void
}

const NAV_ITEMS: Array<{
  id: MobileView
  label: string
  icon: React.ReactNode
  activeIcon: React.ReactNode
}> = [
  { id: 'home', label: '首页', icon: <HomeIcon size={20} />, activeIcon: <HomeIcon size={20} /> },
  { id: 'training', label: '训练', icon: <BookIcon size={20} />, activeIcon: <BookIcon size={20} /> },
  { id: 'materials', label: '素材', icon: <FolderIcon size={20} />, activeIcon: <FolderIcon size={20} /> },
  { id: 'errors', label: '错误', icon: <FileTextIcon size={20} />, activeIcon: <FileTextIcon size={20} /> },
  { id: 'profile', label: '我的', icon: '👤', activeIcon: '👤' },
]

export default function MobileNav({ activeView, onViewChange }: MobileNavProps) {
  return (
    <nav className="mobile-nav">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`mobile-nav-item ${activeView === item.id ? 'mobile-nav-active' : ''}`}
          onClick={() => onViewChange(item.id)}
          aria-label={item.label}
        >
          <span className="mobile-nav-icon">
            {activeView === item.id ? item.activeIcon : item.icon}
          </span>
          <span className="mobile-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
