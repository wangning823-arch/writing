'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const navItems = [
  {
    href: '/admin/dashboard',
    label: '数据概览',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: '/admin/topics',
    label: '作文题目',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    href: '/admin/essay-types',
    label: '范文类型',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    href: '/admin/essays',
    label: '范文管理',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    href: '/admin/material-types',
    label: '素材类型',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: '/admin/materials',
    label: '素材库',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
  {
    href: '/admin/users',
    label: '用户管理',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('bifeng-user-id') || 'demo-user'
    fetch(`/api/admin/check?userId=${encodeURIComponent(stored)}`)
      .then(r => r.json())
      .then(data => {
        if (!data.isAdmin) {
          router.push('/')
        } else {
          setIsAdmin(true)
        }
      })
      .catch(() => router.push('/'))
  }, [router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (isAdmin === null) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--theme_bg)',
        color: 'var(--theme_text)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid var(--color-gray-200)',
            borderTopColor: 'var(--theme_button-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }} />
          <p style={{ color: 'var(--theme_text-weak)' }}>验证管理员权限中...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--theme_bg)', display: 'flex' }}>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 200,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className="admin-sidebar"
        style={{
          width: isMobile ? '260px' : '240px',
          minWidth: isMobile ? '260px' : '240px',
          height: '100vh',
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: isMobile ? 0 : undefined,
          background: 'var(--theme_bg)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          zIndex: 300,
          transition: 'transform 0.25s ease',
          transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <Link href="/admin/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--theme_button-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: 700,
              lineHeight: 1,
            }}>
              管
            </div>
            <span style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--theme_text)',
              letterSpacing: '0.02em',
            }}>
              管理后台
            </span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {navItems.map(item => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  marginBottom: '2px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: active ? 500 : 400,
                  color: active ? 'var(--theme_button-primary)' : 'var(--theme_text)',
                  background: active ? 'var(--color-blue-50)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span style={{ width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Back to App */}
        <div style={{ padding: '8px', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => {
              localStorage.setItem('bifeng-user-id', 'demo-user')
              router.push('/')
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              width: '100%',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'var(--theme_text)',
              background: 'transparent',
              transition: 'all var(--transition-fast)',
              textAlign: 'left',
            }}
          >
            <span style={{ width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </span>
            <span>返回前台</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile Header */}
        {isMobile && (
        <header style={{
          height: '56px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          background: 'var(--theme_bg)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          gap: '12px',
        }}>
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
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--theme_text)' }}>
            管理后台
          </span>
        </header>
        )}

        {/* Page Content */}
        <main className="admin-main" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      {isMobile && (
      <nav style={{
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
      }}>
        {navItems.slice(0, 5).map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                textDecoration: 'none',
                color: active ? 'var(--theme_button-primary)' : 'var(--theme_text-weak)',
                fontSize: '0.625rem',
                padding: '4px 8px',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      )}

      {/* Responsive main padding */}
      <style jsx>{`
        @media (max-width: 767px) {
          .admin-main {
            padding: 16px !important;
            padding-bottom: 80px !important;
          }
        }
      `}</style>
    </div>
  )
}
