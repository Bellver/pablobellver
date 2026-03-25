import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes and articles on product, systems, and process design. Coming soon.',
}

const GHOST_POSTS = [
  { title: 'Cómo funciona el sistema de themes de este sitio',       date: '2025', tags: ['Design Systems', 'CSS'] },
  { title: 'Design tokens: del primitivo al semántico',              date: '2025', tags: ['Tokens', 'CSS'] },
  { title: 'Building in public: qué significa para mí',             date: '2025', tags: ['Proceso', 'Meta'] },
  { title: 'Por qué los design systems fracasan (y cómo evitarlo)', date: '2025', tags: ['Design Systems', 'Gobernanza'] },
  { title: 'Figma variables vs CSS custom properties',               date: '2025', tags: ['Figma', 'CSS', 'Tokens'] },
]

export default function WritingPage() {
  return (
    <div className="ghost-page">
      <header className="ghost-page-header">
        <p className="section-label">Escritura</p>
        <h1 className="ghost-page-title">
          Notas y<br />artículos
        </h1>
        <p className="ghost-page-sub">
          Escribo sobre diseño de sistemas, proceso y producto.
        </p>
        <span className="ghost-coming-soon">
          <span className="now-dot" aria-hidden="true" />
          Building in public — llegando pronto
        </span>
      </header>

      <ul className="writing-list" role="list">
        {GHOST_POSTS.map(post => (
          <li key={post.title} className="writing-item">
            <article className="writing-card writing-card--ghost">
              <span className="writing-date">{post.date}</span>
              <div className="writing-card-body">
                <h2 className="writing-title">{post.title}</h2>
                <ul className="tag-list" role="list">
                  {post.tags.map(t => <li key={t} className="tag">{t}</li>)}
                </ul>
              </div>
              <span className="badge">Próximamente</span>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
