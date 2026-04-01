'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme, type Theme } from '@pablobellver/design-system'

const THEMES: Theme[] = ['open', 'learn', 'rebel']

const THEME_CONFIG: Record<Theme, { label: string; icon: string; desc: string }> = {
  open:  { label: 'Open',  icon: '●', desc: 'Light · Editorial' },
  learn: { label: 'Learn', icon: '▮', desc: 'Dark · Terminal'   },
  rebel: { label: 'Rebel', icon: '■', desc: 'Yellow · Raw'      },
}

function persistTheme(theme: Theme) {
  localStorage.setItem('pb-theme', theme)
}

export function NavThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const config = THEME_CONFIG[theme]

  const cycleTheme = () => {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
    setTheme(next)
    persistTheme(next)
  }

  const selectTheme = (t: Theme) => {
    setTheme(t)
    persistTheme(t)
    setOpen(false)
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div className="nts" ref={wrapperRef}>

      {/* ── Cycle button ─────────────────────────────────────── */}
      <button
        className="nts__cycle"
        onClick={cycleTheme}
        aria-label={`Theme: ${config.label}. Click to cycle`}
      >
        <span className="nts__icon" aria-hidden="true">{config.icon}</span>
        <span className="nts__name">{config.label}</span>
      </button>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div className="nts__divider" aria-hidden="true" />

      {/* ── Chevron ──────────────────────────────────────────── */}
      <button
        className={`nts__chevron${open ? ' nts__chevron--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label="Choose theme"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="nts__chevron-icon" aria-hidden="true">▾</span>
      </button>

      {/* ── Dropdown ─────────────────────────────────────────── */}
      {open && (
        <div className="nts__dropdown" role="listbox" aria-label="Select theme">
          {THEMES.map((t) => {
            const c = THEME_CONFIG[t]
            return (
              <button
                key={t}
                className={`nts__option${t === theme ? ' nts__option--active' : ''}`}
                role="option"
                aria-selected={t === theme}
                onClick={() => selectTheme(t)}
              >
                <span className="nts__option-icon" aria-hidden="true">{c.icon}</span>
                <span className="nts__option-info">
                  <span className="nts__option-name">{c.label}</span>
                  <span className="nts__option-desc">{c.desc}</span>
                </span>
                {t === theme && (
                  <span className="nts__option-check" aria-hidden="true">✓</span>
                )}
              </button>
            )
          })}
        </div>
      )}

    </div>
  )
}
