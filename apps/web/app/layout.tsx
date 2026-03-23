import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { ThemeSwitcherClient } from '@/components/theme/ThemeSwitcherClient'
import '@fontsource/dm-serif-display/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/bebas-neue/400.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pablo Bellver',
  description: 'Product Designer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
          <ThemeSwitcherClient />
        </ThemeProvider>
      </body>
    </html>
  )
}