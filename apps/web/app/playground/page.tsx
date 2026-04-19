import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Tools, prototypes, and technical explorations. The visible process.',
}

const EXPERIMENTS = [
  {
    slug: 'claude-notion-mcp',
    title: 'Claude Code + Notion MCP',
    description: 'Conectar Claude Code al workspace de Notion para consultar y documentar directamente desde VS Code.',
    tags: ['Claude Code', 'MCP', 'Notion'],
    status: 'live' as const,
    date: '2026-04',
  },
  {
    slug: 'notion-cms',
    title: 'Notion como CMS',
    description: 'Server Component que lee directamente la API de Notion con ISR. Sin SDK externo, sin script manual.',
    tags: ['Next.js', 'Notion API', 'ISR'],
    status: 'live' as const,
    date: '2026-03',
  },
  {
    slug: 'theme-system',
    title: 'Sistema de tres themes',
    description: 'Tres identidades visuales, un único design system. CSS tokens + Next.js App Router.',
    tags: ['CSS', 'Design Tokens', 'React'],
    status: 'ghost' as const,
    date: null,
  },
  {
    slug: 'type-scale',
    title: 'Escala tipográfica fluida',
    description: 'Generador de escalas con clamp() y tokens semánticos. Para diseñadores y devs.',
    tags: ['CSS', 'Typography', 'Tokens'],
    status: 'ghost' as const,
    date: null,
  },
  {
    slug: 'apca-checker',
    title: 'APCA contrast checker',
    description: 'Verificador de contraste con el algoritmo APCA. Más preciso que WCAG para texto real.',
    tags: ['Accesibilidad', 'Color', 'APCA'],
    status: 'ghost' as const,
    date: null,
  },
]

export default function PlaygroundPage() {
  return (
    <div className="ghost-page">
      <header className="ghost-page-header">
        <p className="section-label">Playground</p>
        <h1 className="ghost-page-title">Experimentos</h1>
        <p className="ghost-page-sub">
          Herramientas, prototipos y exploraciones técnicas. El proceso en público.
        </p>
      </header>

      <ul className="lab-grid" role="list">
        {EXPERIMENTS.map(exp => (
          <li key={exp.slug}>
            {exp.status === 'live' ? (
              <Link href={`/playground/${exp.slug}`} className="lab-card-link">
                <article className="lab-card">
                  <div className="lab-live-badge">
                    <span className="now-dot" aria-hidden="true" />
                    <span>Live</span>
                    {exp.date && <span className="lab-date">{exp.date}</span>}
                  </div>
                  <h2 className="lab-title">{exp.title}</h2>
                  <p className="lab-desc">{exp.description}</p>
                  <ul className="tag-list" role="list">
                    {exp.tags.map(t => <li key={t} className="tag">{t}</li>)}
                  </ul>
                </article>
              </Link>
            ) : (
              <article className="lab-card lab-card--ghost">
                <h2 className="lab-title">{exp.title}</h2>
                <p className="lab-desc">{exp.description}</p>
                <ul className="tag-list" role="list">
                  {exp.tags.map(t => <li key={t} className="tag">{t}</li>)}
                </ul>
              </article>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
