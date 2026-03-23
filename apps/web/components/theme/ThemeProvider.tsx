'use client'

import { useEffect, useState } from 'react'
import { ThemeContextProvider, type Theme } from '@pablobellver/design-system'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('open')

  useEffect(() => {
    const saved = localStorage.getItem('pb-theme') as Theme | null
    if (saved && ['open', 'learn', 'rebel'].includes(saved)) {
      setTheme(saved)
    } else {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'learn' : 'open')
    }
  }, [])

  return (
    <ThemeContextProvider defaultTheme={theme}>
      {children}
    </ThemeContextProvider>
  )
}