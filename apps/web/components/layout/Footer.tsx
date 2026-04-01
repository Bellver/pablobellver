import Link from 'next/link'
import { FooterNav } from './FooterNav'
import { MetaBar }   from './MetaBar'

const SOCIAL_LINKS = [
  { href: 'https://www.linkedin.com/in/pablo-bellver/',   label: 'LinkedIn'  },
  { href: 'https://www.instagram.com/pablobellver_/',     label: 'Instagram' },
  { href: 'https://pablobellver.substack.com',            label: 'Substack'  },
  { href: 'mailto:hola@pablobellver.com',                 label: 'Email'     },
] as const

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">

        {/* ── Main row ─────────────────────────────────────────────────── */}
        <div className="footer-inner">

          {/* Col 1 — Brand + tagline */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label="Pablo Bellver — inicio">
              Pablo Bellver
            </Link>
            <p className="footer-tagline">Designer who builds</p>
          </div>

          {/* Col 2 — Nav */}
          <FooterNav />

          {/* Col 3 — Social */}
          <ul className="footer-social-list" role="list">
            {SOCIAL_LINKS.map(({ href, label }) => (
              <li key={label}>
                <a
                  href={href}
                  className="footer-social-link"
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

        </div>

        {/* ── Meta bar ─────────────────────────────────────────────────── */}
        <MetaBar />

      </div>
    </footer>
  )
}
