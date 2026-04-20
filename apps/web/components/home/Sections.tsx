import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface WorkItem {
  slug: string
  title: string
  description: string
  tags: string[]
  year: string
  status: 'published' | 'ghost'
}

interface WritingItem {
  title: string
  date: string
  status: 'ghost'
}

interface LabItem {
  slug: string
  title: string
  description: string
  tags: string[]
  status: 'live' | 'ghost'
}

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder data — reemplazar con MDX / Notion cuando esté listo
// ─────────────────────────────────────────────────────────────────────────────

const WORK: WorkItem[] = [
  {
    slug: 'design-system',
    title: 'Design System a escala',
    description: 'De cero a producción. Tokens, componentes y gobernanza para un equipo de 40 personas distribuidas en 4 ciudades.',
    tags: ['Design Systems', 'Tokens', 'Figma', 'React'],
    year: '2024',
    status: 'ghost',
  },
  {
    slug: 'checkout',
    title: 'Checkout sin fricción',
    description: 'Reducción del 23% en abandono de carrito. Research, hipótesis, prototipado, test A/B y rollout.',
    tags: ['Product Design', 'Research', 'A/B Testing'],
    year: '2023',
    status: 'ghost',
  },
  {
    slug: 'data-viz',
    title: 'Dashboard de métricas en tiempo real',
    description: 'Datos complejos legibles para equipos no técnicos. De 8 pantallas a 1 panel accionable.',
    tags: ['Data Viz', 'Interaction Design', 'React'],
    year: '2023',
    status: 'ghost',
  },
]

const WRITING: WritingItem[] = [
  { title: 'Cómo está construido este sistema de themes',  date: '2025', status: 'ghost' },
  { title: 'Design tokens: del primitivo al semántico',    date: '2025', status: 'ghost' },
  { title: 'Building in public: qué significa para mí',   date: '2025', status: 'ghost' },
]

const LAB: LabItem[] = [
  {
    slug: 'claude-notion-mcp',
    title: 'Claude Code + Notion MCP',
    description: 'Conectar Claude Code al workspace de Notion para consultar y documentar directamente desde VS Code.',
    tags: ['Claude Code', 'MCP', 'Notion'],
    status: 'live',
  },
  {
    slug: 'notion-cms',
    title: 'Notion como CMS',
    description: 'Server Component que lee directamente la API de Notion con ISR. Sin intermediario.',
    tags: ['Next.js', 'Notion API', 'ISR'],
    status: 'live',
  },
  {
    slug: 'career-timeline',
    title: 'Career Timeline',
    description: 'Línea de vida interactiva con radar de habilidades que crece con el scroll. No es un CV — es una historia.',
    tags: ['Data Viz', 'Animation', 'Career'],
    status: 'ghost',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Section shell
// ─────────────────────────────────────────────────────────────────────────────

function Section({
  id,
  label,
  title,
  children,
  footer,
}: {
  id?: string
  label: string
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <section id={id} className="section" aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="section-container">
        <header className="section-header">
          <p className="section-label">{label}</p>
          <h2 id={id ? `${id}-title` : undefined} className="section-title">
            {title}
          </h2>
        </header>
        {children}
        {footer && <div className="section-footer">{footer}</div>}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// P1 — Featured Work
// ─────────────────────────────────────────────────────────────────────────────

export function WorkSection() {
  return (
    <Section
      id="work"
      label="Trabajo seleccionado"
      title="Casos de estudio"
      footer={
        <Link href="/work" className="link-arrow">
          Ver todo el trabajo →
        </Link>
      }
    >
      <ul className="work-list" role="list">
        {WORK.map((item, i) => (
          <li key={item.slug}>
            <WorkCard item={item} index={i} />
          </li>
        ))}
      </ul>
    </Section>
  )
}

function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  const card = (
    <article
      className={`work-card${item.status === 'ghost' ? ' work-card--ghost' : ''}`}
    >
      <div className="work-card-meta">
        <span className="work-card-index">0{index + 1}</span>
        <span className="work-card-year">{item.year}</span>
      </div>
      <h3 className="work-card-title">{item.title}</h3>
      <p className="work-card-desc">{item.description}</p>
      <footer className="work-card-footer">
        <ul className="tag-list" role="list">
          {item.tags.map(t => <li key={t} className="tag">{t}</li>)}
        </ul>
        {item.status === 'ghost'
          ? <span className="badge">Próximamente</span>
          : <span className="arrow" aria-hidden="true">→</span>
        }
      </footer>
    </article>
  )

  if (item.status === 'published') {
    return <Link href={`/work/${item.slug}`} className="work-card-link">{card}</Link>
  }
  return card
}

// ─────────────────────────────────────────────────────────────────────────────
// P1 — About
// ─────────────────────────────────────────────────────────────────────────────

export function AboutSection() {
  return (
    <section className="section section--about" aria-labelledby="about-title">
      <div className="section-container">

        <header className="section-header">
          <p className="section-label">Sobre mí</p>
          <h2 id="about-title" className="section-title">
            El sitio que estás<br />
            viendo <em>es</em> el portfolio.
          </h2>
        </header>

        <div className="about-grid">
          <div className="about-text">
            <p>
              Llevo más de 15 años diseñando productos digitales que la gente usa sin
              pensar que han sido diseñados. Esa invisibilidad es el objetivo.
            </p>
            <p>
              Trabajo en la intersección de diseño de sistemas, estrategia de producto
              e ingeniería de interfaz. No me interesa la estética por la estética —
              me interesa lo que funciona.
            </p>
            <p>
              Este sitio tiene tres modos visuales. No es un truco — es un argumento.
              La forma en que algo se presenta cambia lo que dice.
            </p>
            <Link href="/now" className="link-arrow about-now-link">
              Qué estoy haciendo ahora →
            </Link>
          </div>

          <div className="about-stats" aria-label="Estadísticas rápidas">
            {[
              { n: '15+', label: 'años diseñando' },
              { n: '3',   label: 'modos de uso'   },
              { n: '∞',   label: 'en construcción' },
            ].map(({ n, label }) => (
              <div key={label} className="stat">
                <span className="stat-n" aria-hidden="true">{n}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// P1 — Now Teaser
// ─────────────────────────────────────────────────────────────────────────────

export function NowTeaser() {
  return (
    <section className="section section--now" aria-labelledby="now-teaser-title">
      <div className="section-container">
        <Link href="/now" className="now-card" aria-labelledby="now-teaser-title">

          <div className="now-card-content">
            <div className="now-live-badge">
              <span className="now-dot" aria-hidden="true" />
              <span>Ahora mismo</span>
            </div>
            <p id="now-teaser-title" className="now-card-text">
              Construyendo este sitio en público. El proceso como argumento.
            </p>
            <span className="link-arrow">Ver /now completo →</span>
          </div>

          <span className="now-card-slug" aria-hidden="true">/now</span>

        </Link>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// P1 — Writing Teaser
// ─────────────────────────────────────────────────────────────────────────────

export function WritingTeaser() {
  return (
    <Section
      id="writing"
      label="Escritura"
      title="Notas y artículos"
      footer={<Link href="/writing" className="link-arrow">Ver todo →</Link>}
    >
      <ul className="writing-list" role="list">
        {WRITING.map(item => (
          <li key={item.title} className="writing-item">
            <article className="writing-card writing-card--ghost">
              <span className="writing-date">{item.date}</span>
              <h3 className="writing-title">{item.title}</h3>
              <span className="badge">Próximamente</span>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// P1 — Playground Teaser
// ─────────────────────────────────────────────────────────────────────────────

export function PlaygroundTeaser() {
  return (
    <Section
      id="playground"
      label="Playground"
      title="Experimentos"
      footer={<Link href="/playground" className="link-arrow">Ver todos →</Link>}
    >
      <ul className="lab-grid" role="list">
        {LAB.map(item => (
          <li key={item.slug}>
            <LabCard item={item} />
          </li>
        ))}
      </ul>
    </Section>
  )
}

function LabCard({ item }: { item: LabItem }) {
  const card = (
    <article className={`lab-card${item.status === 'ghost' ? ' lab-card--ghost' : ''}`}>
      <div className="lab-live-badge">
        {item.status === 'live' ? (
          <>
            <span className="now-dot" aria-hidden="true" />
            <span>Live</span>
          </>
        ) : (
          <span>Próximamente</span>
        )}
      </div>
      <h3 className="lab-title">{item.title}</h3>
      <p className="lab-desc">{item.description}</p>
      <ul className="tag-list" role="list">
        {item.tags.map(t => <li key={t} className="tag">{t}</li>)}
      </ul>
    </article>
  )

  if (item.status === 'live') {
    return (
      <Link href={`/playground/${item.slug}`} className="lab-card-link">
        {card}
      </Link>
    )
  }
  return card
}
