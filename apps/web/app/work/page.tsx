// ─────────────────────────────────────────────────────────────────────────────
// app/work/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Casos de estudio de diseño de producto. En preparación.',
}

const GHOST_CASES = [
  {
    title: 'Design System a escala',
    year: '2024',
    tags: ['Design Systems', 'Figma', 'React'],
    excerpt: 'De cero a producción. Tokens, componentes y gobernanza para un equipo de 40 personas en 4 ciudades.',
  },
  {
    title: 'Checkout sin fricción',
    year: '2023',
    tags: ['Product Design', 'Research', 'A/B Testing'],
    excerpt: 'Reducción del 23% en abandono. Research, hipótesis, prototipado y rollout progresivo.',
  },
  {
    title: 'Dashboard de métricas',
    year: '2023',
    tags: ['Data Viz', 'Interaction Design', 'React'],
    excerpt: 'Datos complejos legibles para equipos no técnicos. De 8 pantallas a 1 panel accionable.',
  },
  {
    title: 'App móvil de salud mental',
    year: '2022',
    tags: ['Mobile', 'UX Research', 'Accesibilidad'],
    excerpt: 'Diseño centrado en la persona para una app con 200k usuarios activos. Discovery to launch.',
  },
]

export default function WorkPage() {
  return (
    <div className="ghost-page">
      <header className="ghost-page-header">
        <p className="section-label">Portfolio</p>
        <h1 className="ghost-page-title">Trabajo</h1>
        <p className="ghost-page-sub">
          Los casos de estudio están en preparación.
        </p>
        <span className="ghost-coming-soon">
          <span className="now-dot" aria-hidden="true" />
          Building in public — llegando pronto
        </span>
      </header>

      <ul className="work-list" role="list">
        {GHOST_CASES.map((item, i) => (
          <li key={item.title}>
            <article className="work-card work-card--ghost-full">
              <div className="work-card-meta">
                <span className="work-card-index">0{i + 1}</span>
                <span className="work-card-year">{item.year}</span>
              </div>
              <h2 className="work-card-title">{item.title}</h2>
              <p className="work-card-desc">{item.excerpt}</p>
              <footer className="work-card-footer">
                <ul className="tag-list" role="list">
                  {item.tags.map(t => <li key={t} className="tag">{t}</li>)}
                </ul>
                <span className="badge">En preparación</span>
              </footer>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
