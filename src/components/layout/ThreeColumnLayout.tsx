'use client'

import type { ReactNode } from 'react'
import { useState, useCallback, useEffect, Children, Fragment } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import RightPanel from '@/components/layout/RightPanel'

interface ThreeColumnLayoutProps {
  children: ReactNode
  hideRightPanel?: boolean
}

export default function ThreeColumnLayout({ children, hideRightPanel = false }: ThreeColumnLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  // Close sidebar on route change or resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--theme_bg)',
      }}
    >
      {/* Desktop Sidebar */}
      <div className="sidebar-wrapper" style={{ display: 'none' }}>
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 200,
          }}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className="mobile-sidebar-drawer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 201,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          pointerEvents: sidebarOpen ? 'auto' : 'none',
        }}
      >
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
        {/* Mobile Top Bar */}
        <div className="mobile-top-bar">
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--theme_bg)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--theme_text)',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--theme_text)' }}>笔锋</span>
        </div>

        {Children.toArray(children).map((child, i) => (
          <Fragment key={i}>{child}</Fragment>
        ))}
      </main>

      {/* Right Panel - hidden on mobile/tablet */}
      {!hideRightPanel && (
        <div className="right-panel-wrapper" style={{ display: 'none' }}>
          <RightPanel />
        </div>
      )}

      <style key="layout-styles">{`
        @media (min-width: 1024px) {
          .sidebar-wrapper {
            display: block !important;
          }
          .right-panel-wrapper {
            display: block !important;
          }
          .mobile-sidebar-overlay,
          .mobile-sidebar-drawer {
            display: none !important;
          }
          .mobile-top-bar {
            display: none !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .sidebar-wrapper {
            display: block !important;
          }
          .mobile-sidebar-overlay,
          .mobile-sidebar-drawer {
            display: none !important;
          }
          .mobile-top-bar {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .mobile-top-bar {
            display: flex !important;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            border-bottom: 1px solid var(--border-color);
            position: sticky;
            top: 0;
            background: var(--theme_bg);
            z-index: 50;
          }
        }
      `}</style>
    </div>
  )
}
