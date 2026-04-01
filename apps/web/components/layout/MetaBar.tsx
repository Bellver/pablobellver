'use client'

import Link from 'next/link'
import { ThemeSwitcher, type Theme } from '@pablobellver/design-system'

function handleThemeChange(theme: Theme) {
  localStorage.setItem('pb-theme', theme)
}

export function MetaBar() {
  return (
    <div className="footer-meta">
      <div className="footer-meta-left">
        <span className="footer-copyright">
          <span className="footer-copyright--default">© 2026 Pablo Bellver</span>
          <span className="footer-copyright--rebel">BELLVER MMXXVI</span>
        </span>
        <Link href="/sitemap" className="footer-sitemap">
          Sitemap
        </Link>
      </div>
      <ThemeSwitcher onThemeChange={handleThemeChange} />
    </div>
  )
}
