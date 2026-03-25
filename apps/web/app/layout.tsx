import type { Metadata } from 'next'
import {
  Bebas_Neue,
  DM_Serif_Display,
  JetBrains_Mono,
} from 'next/font/google'
import { ThemeProvider }       from '@/components/theme/ThemeProvider'
import { ThemeSwitcherClient } from '@/components/theme/ThemeSwitcherClient'
import { Nav }                 from '@/components/layout/Nav'
import './globals.css'

// ─────────────────────────────────────────────────────────────────────────────
// Google Fonts — self-hosted por next/font, zero CLS
// Variables CSS usadas para sobrescribir primitivos en globals.css
// ─────────────────────────────────────────────────────────────────────────────

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--next-font-serif',
  display: 'swap',
})

const jetBrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--next-font-mono',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--next-font-display',
  display: 'swap',
})

// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default:  'Pablo Bellver — Product Designer',
    template: '%s · Pablo Bellver',
  },
  description:
    'Senior Product Designer and CPO. I design systems that scale and products people understand. Architect by training, systems thinker by practice. Based in Alicante, Spain.',
  metadataBase: new URL('https://pablobellver.com'),
  openGraph: {
    type:     'website',
    locale:   'es_ES',
    url:      'https://pablobellver.com',
    siteName: 'Pablo Bellver',
  },
  twitter: {
    card:    'summary_large_image',
    creator: '@pablobellver',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={[
        dmSerif.variable,
        jetBrains.variable,
        bebasNeue.variable,
      ].join(' ')}
    >
      <body>
        <ThemeProvider>
          <Nav />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <ThemeSwitcherClient />
        </ThemeProvider>
      </body>
    </html>
  )
}
