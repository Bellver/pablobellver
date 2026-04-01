'use client'

import { useTheme, type Theme } from './ThemeContext'

const THEMES = ['open', 'learn', 'rebel'] as const

const THEME_CONFIG: Record<Theme, { label: string; icon: string }> = {
  open:  { label: 'Open',  icon: '●' },
  learn: { label: 'Learn', icon: '▮' },
  rebel: { label: 'Rebel', icon: '■' },
}

export function ThemeSwitcher({
  onThemeChange,
}: {
  onThemeChange?: (theme: Theme) => void
} = {}) {
  const { theme, setTheme } = useTheme()
  const config = THEME_CONFIG[theme]

  const handleClick = () => {
    const idx = THEMES.indexOf(theme)
    const next = THEMES[(idx + 1) % THEMES.length]
    setTheme(next)
    onThemeChange?.(next)
  }

  return (
    <button
      className="theme-switcher"
      onClick={handleClick}
      aria-label={`Theme: ${config.label}. Click to change`}
      data-theme-value={theme}
    >
      <span className="theme-switcher__icon" aria-hidden="true">
        {config.icon}
      </span>
      <span className="theme-switcher__name">
        {config.label}
      </span>
      <span className="theme-switcher__cycle" aria-hidden="true">
        →
      </span>
    </button>
  )
}
