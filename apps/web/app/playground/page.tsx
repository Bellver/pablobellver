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
    slug: 'theme-switcher',
    title: 'Serie — ThemeSwitcher',
    description: 'Tres identidades visuales, un sistema compartido. La serie documenta lo que ocurre cuando construyes algo con ambición real y empiezas a ver en qué se queda corto.',
    tags: ['CSS', 'Design Tokens', 'React'],
    status: 'ghost' as const,
    date: null,
  },
  {
    slug: 'lumina-icons',
    title: 'Lumina Icons',
    description: 'Librería de iconos open-source construida sobre principios de design systems. Nació de un artículo. Ya tiene tracción real en Figma Community.',
    tags: ['Icons', 'Design Systems', 'Figma'],
    status: 'ghost' as const,
    date: null,
  },
  {
    slug: 'career-timeline',
    title: 'Career Timeline',
    description: 'Línea de vida interactiva con radar de habilidades que crece con el scroll. No es un CV — es una historia.',
    tags: ['Data Viz', 'Animation', 'Career'],
    status: 'ghost' as const,
    date: null,
  },
  {
    slug: 'bubble-text',
    title: 'Bubble Text',
    description: 'Tipografía burbuja de jabón en SVG puro. Bump mapping 3D sin librerías externas. Cada letra es una esfera iluminada de forma independiente.',
    tags: ['SVG', 'CSS', 'Animation'],
    status: 'ghost' as const,
    date: null,
  },
  {
    slug: 'pablo-bot',
    title: 'Pablo Bot',
    description: 'Agente conversacional que permite hablar directamente con Pablo — mediado por IA. Personas primero, trabajo como consecuencia.',
    tags: ['Claude API', 'AI', 'Chat'],
    status: 'ghost' as const,
    date: null,
  },
  {
    slug: 'visual-changelog',
    title: 'Visual Changelog',
    description: 'Screenshots automáticos en cada deploy relevante. El sitio documenta su propia evolución. Cuando acumule historia suficiente, se gradúa a /changelog.',
    tags: ['Playwright', 'Automation', 'Git'],
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
                <div className="lab-live-badge">
                  <span>Próximamente</span>
                </div>
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
