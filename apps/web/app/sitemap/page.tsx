import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Estructura completa de pablobellver.com — todas las páginas y secciones del sitio.',
  robots: {
    index: true,
    follow: true,
  },
}

const SECTIONS = [
  {
    label: 'Principal',
    links: [
      { href: '/',           label: 'Inicio',      desc: 'Portfolio personal de Pablo Bellver' },
      { href: '/work',       label: 'Work',         desc: 'Casos de estudio de diseño de producto' },
      { href: '/writing',    label: 'Writing',      desc: 'Artículos sobre diseño y producto' },
      { href: '/playground', label: 'Playground',   desc: 'Experimentos técnicos y de diseño' },
      { href: '/now',        label: 'Now',          desc: 'Qué está haciendo Pablo ahora mismo' },
    ],
  },
  {
    label: 'Playground',
    links: [
      { href: '/playground/notion-cms',        label: 'Notion CMS',         desc: 'Notion como CMS para /now vía API' },
      { href: '/playground/claude-notion-mcp', label: 'Claude + Notion MCP', desc: 'Claude Code + MCP con Notion' },
    ],
  },
  {
    label: 'Legal y utilidad',
    links: [
      { href: '/sitemap',     label: 'Sitemap',     desc: 'Esta página' },
      { href: '/sitemap.xml', label: 'Sitemap XML', desc: 'Versión XML para motores de búsqueda', ext: true },
    ],
  },
  {
    label: 'Social',
    links: [
      { href: 'https://www.linkedin.com/in/pablo-bellver/', label: 'LinkedIn',   desc: 'Perfil profesional', ext: true },
      { href: 'https://www.instagram.com/pablobellver_/',   label: 'Instagram',  desc: 'Diseño y proceso',   ext: true },
      { href: 'https://pablobellver.substack.com',          label: 'Substack',   desc: 'Newsletter',         ext: true },
      { href: 'mailto:hola@pablobellver.com',               label: 'Email',      desc: 'hola@pablobellver.com' },
    ],
  },
] as const

export default function SitemapPage() {
  return (
    <div className="sitemap-page">
      <header className="sitemap-header">
        <p className="section-label">Navegación</p>
        <h1 className="sitemap-title">Sitemap</h1>
        <p className="sitemap-sub">
          Estructura completa del sitio. Todas las páginas, secciones y enlaces externos.
        </p>
      </header>

      <nav aria-label="Mapa del sitio">
        <ul className="sitemap-sections" role="list">
          {SECTIONS.map(({ label, links }) => (
            <li key={label}>
              <section className="sitemap-section">
                <p className="sitemap-section-label">{label}</p>
                <ul role="list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {links.map(({ href, label: linkLabel, desc, ...rest }) => {
                    const isExt = 'ext' in rest && rest.ext
                    const isMailto = href.startsWith('mailto')
                    const isExternal = isExt || (href.startsWith('http') && !href.startsWith('https://pablobellver.com'))

                    return (
                      <li key={href} className="sitemap-link-item">
                        {isExternal || isMailto ? (
                          <a
                            href={href}
                            className={`sitemap-link${isExternal ? ' sitemap-link-ext' : ''}`}
                            target={isMailto ? undefined : '_blank'}
                            rel={isMailto ? undefined : 'noopener noreferrer'}
                          >
                            {linkLabel}
                          </a>
                        ) : (
                          <Link href={href} className="sitemap-link">
                            {linkLabel}
                          </Link>
                        )}
                        <span className="sitemap-link-desc">{desc}</span>
                      </li>
                    )
                  })}
                </ul>
              </section>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
