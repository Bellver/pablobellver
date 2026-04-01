import Link from 'next/link'

const NAV_LINKS = [
  { href: '/work',       label: 'Work'       },
  { href: '/writing',    label: 'Writing'    },
  { href: '/playground', label: 'Playground' },
  { href: '/now',        label: 'Now'        },
] as const

export function FooterNav() {
  return (
    <nav aria-label="Footer navigation">
      <ul className="footer-nav-list" role="list">
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className="footer-nav-link">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
