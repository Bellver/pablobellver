'use client'

import { useTheme, type Theme } from './ThemeContext'

const themes: { value: Theme; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'learn', label: 'Learn' },
  { value: 'rebel', label: 'Rebel' },
]

export function ThemeSwitcher({ onThemeChange }: { onThemeChange?: (theme: Theme) => void } = {}) {
  const { theme, setTheme } = useTheme()

  const handleChange = (newTheme: Theme) => {
    setTheme(newTheme)
    onThemeChange?.(newTheme)
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      gap: '8px',
      zIndex: 'var(--z-toast)',
    }}>
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => handleChange(t.value)}
          style={{
            padding: '8px 16px',
            background: theme === t.value ? 'var(--foreground)' : 'var(--background)',
            color: theme === t.value ? 'var(--background)' : 'var(--foreground)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'var(--transition-base)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}