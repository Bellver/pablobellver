'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ThemeSwitcher, useTheme, type Theme } from '@pablobellver/design-system'
import { NavThemeSwitcher, ThemeIcon, persistTheme, cycleNext } from './NavThemeSwitcher'

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '/work',       label: 'Work'       },
  { href: '/writing',    label: 'Writing'    },
  { href: '/playground', label: 'Playground' },
  { href: '/now',        label: '/now'       },
] as const

function handleDrawerThemeChange(theme: Theme) {
  localStorage.setItem('pb-theme', theme)
}

// ─────────────────────────────────────────────────────────────────────────────
// Nav
// ─────────────────────────────────────────────────────────────────────────────

export function Nav() {
  const pathname  = usePathname()
  const { theme, setTheme } = useTheme()
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Trap focus inside drawer
  useEffect(() => {
    if (!open) return
    const firstFocusable = drawerRef.current?.querySelector<HTMLElement>('a, button')
    firstFocusable?.focus()
  }, [open])

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href + '/'))

  const handleMobileCycle = () => {
    const next = cycleNext(theme)
    setTheme(next)
    persistTheme(next)
  }

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header
        className={`nav-header${scrolled ? ' nav-header--scrolled' : ''}`}
        role="banner"
      >
        <div className="nav-inner">

          {/* Wordmark */}
          <Link href="/" className="nav-wordmark" aria-label="Pablo Bellver — inicio">
            <span className="nav-wordmark-text">Pablo Bellver</span>
          </Link>

          {/* Desktop links */}
          <nav className="nav-links" aria-label="Navegación principal">
            <ul role="list">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="nav-link"
                    data-active={isActive(href) ? 'true' : undefined}
                    aria-current={isActive(href) ? 'page' : undefined}
                  >
                    {theme === 'learn' ? `[${label}]` : label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop ThemeSwitcher with dropdown */}
          <div className="nav-theme-switcher">
            <NavThemeSwitcher />
          </div>

          {/* Mobile: icon-only theme cycle + hamburger */}
          <div className="nav-mobile-actions">
            <button
              className="nav-mobile-theme"
              onClick={handleMobileCycle}
              aria-label={`Theme: ${theme}. Click to cycle`}
            >
              <ThemeIcon theme={theme} className="nav-mobile-theme__icon" />
            </button>

            <button
              className={`nav-burger${open ? ' nav-burger--open' : ''}`}
              onClick={() => setOpen(v => !v)}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              aria-controls="nav-drawer"
              aria-haspopup="dialog"
            >
              <span className="nav-burger-line" />
              <span className="nav-burger-line" />
              <span className="nav-burger-line" />
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      <div
        className={`nav-overlay${open ? ' nav-overlay--open' : ''}`}
        aria-hidden={!open}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
      >
        <div
          id="nav-drawer"
          ref={drawerRef}
          className="nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >

          {/* Nav links — centered vertically */}
          <nav className="nav-drawer-nav" aria-label="Navegación móvil">
            <ul className="nav-drawer-links" role="list">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="nav-drawer-link"
                    data-active={isActive(href) ? 'true' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ThemeSwitcher — pinned to bottom */}
          <footer className="nav-drawer-footer">
            <ThemeSwitcher onThemeChange={handleDrawerThemeChange} />
          </footer>

        </div>
      </div>
    </>
  )
}
