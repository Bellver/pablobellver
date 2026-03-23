'use client'

import { ThemeSwitcher, type Theme } from '@pablobellver/design-system'

function handleThemeChange(theme: Theme) {
  localStorage.setItem('pb-theme', theme)
}

export function ThemeSwitcherClient() {
  return <ThemeSwitcher onThemeChange={handleThemeChange} />
}
