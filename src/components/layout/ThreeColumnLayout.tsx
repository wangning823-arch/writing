'use client'

import type { ReactNode } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import RightPanel from '@/components/layout/RightPanel'
import { HomeIcon, ThinkingIcon, FolderIcon } from '@/components/icons'

interface ThreeColumnLayoutProps {
  children: ReactNode
  hideRightPanel?: boolean
}

export default function ThreeColumnLayout({ children, hideRightPanel = false }: ThreeColumnLayoutProps) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--theme_bg)',
      }}
    >
      {/* Left Sidebar - hidden on mobile */}
      <div className="sidebar-wrapper" style={{ display: 'none' }}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </main>

      {/* Right Panel - hidden on mobile/tablet */}
      {!hideRightPanel && (
        <div className="right-panel-wrapper" style={{ display: 'none' }}>
          <RightPanel />
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />

      <style jsx>{`
        @media (min-width: 1024px) {
          .sidebar-wrapper {
            display: block !important;
          }
          .right-panel-wrapper {
            display: block !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .sidebar-wrapper {
            display: block !important;
          }
        }
      `}</style>
    </div>
  )
}

function MobileBottomNav() {
  return (
    <>
      <nav
        className="mobile-bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          background: 'var(--theme_bg)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          zIndex: 100,
        }}
      >
        <MobileNavItem href="/" icon={<HomeIcon size={20} />} label="首页" />
        <MobileNavItem href="/subject/chinese" icon="📖" label="语文" />
        <MobileNavItem href="/subject/english" icon="🔤" label="英语" />
        <MobileNavItem href="/thinking" icon={<ThinkingIcon size={20} />} label="思维" />
        <MobileNavItem href="/materials" icon={<FolderIcon size={20} />} label="素材" />
      </nav>

      <style jsx>{`
        @media (min-width: 768px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

function MobileNavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        textDecoration: 'none',
        color: 'var(--theme_text-weak)',
        fontSize: '0.625rem',
        padding: '4px 8px',
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </a>
  )
}
