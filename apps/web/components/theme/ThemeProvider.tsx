'use client'

import { ThemeContextProvider, type Theme } from '@pablobellver/design-system'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'open'

  const saved = localStorage.getItem('pb-theme') as Theme | null
  if (saved && ['open', 'learn', 'rebel'].includes(saved)) return saved

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'learn' : 'open'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const initialTheme = getInitialTheme()

  return (
    <ThemeContextProvider defaultTheme={initialTheme}>
      {children}
    </ThemeContextProvider>
  )
}