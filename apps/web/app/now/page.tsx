/**
 * app/now/page.tsx
 * Server Component puro. ISR = 1 hora.
 * Lee Notion directamente — sin script manual, sin MDX.
 */

import type { Metadata } from 'next'
import {
  getNowPage,
  groupBlocks,
  blockRichText,
  rt,
  type NotionBlock,
  type RichText,
  type BlockGroup,
} from '@/lib/notion'

// ─────────────────────────────────────────────────────────────────────────────
// ISR — revalida cada hora
// ─────────────────────────────────────────────────────────────────────────────

export const revalidate = 3600

// ─────────────────────────────────────────────────────────────────────────────
// Metadata dinámica
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { lastEdited } = await getNowPage()
    return {
      title: '/now',
      description: `Qué está haciendo Pablo Bellver ahora mismo. Actualizado ${new Date(lastEdited).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}.`,
    }
  } catch {
    return { title: '/now' }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function NowPage() {
  let data
  let error: string | null = null

  try {
    data = await getNowPage()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Error desconocido'
  }

  if (error || !data) {
    return <NowError message={error ?? 'No se pudo cargar la página'} />
  }

  const { lastEdited, blocks, fetchedAt } = data

  const lastEditedFormatted = new Date(lastEdited).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const fetchedFormatted = new Date(fetchedAt).toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="now-page">
      <div className="now-container">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <header className="now-header">
          <div className="now-live">
            <span className="now-dot" aria-hidden="true" />
            <span>En vivo desde Notion</span>
          </div>

          <h1 className="now-title">/now</h1>

          <div className="now-meta">
            <span>
              Última edición:{' '}
              <time dateTime={lastEdited}>{lastEditedFormatted}</time>
            </span>
            <span className="now-sync">
              Sincronizado a las {fetchedFormatted}
            </span>
          </div>
        </header>

        {/* ── Notion content ──────────────────────────────────────────── */}
        <article className="now-body notion-body">
          <BlocksRenderer groups={groupBlocks(blocks)} />
        </article>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer className="now-footer">
          <p>
            Esta página se lee directamente desde Notion vía API con ISR.{' '}
            <a href="/playground/notion-cms" className="now-experiment-link">
              Ver el experimento →
            </a>
          </p>
        </footer>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Block renderer
// ─────────────────────────────────────────────────────────────────────────────

function BlocksRenderer({ groups }: { groups: BlockGroup[] }) {
  return (
    <>
      {groups.map((group, i) => {
        // Lista agrupada
        if (Array.isArray(group)) {
          const isOrdered = group[0].type === 'numbered_list_item'
          const Tag = isOrdered ? 'ol' : 'ul'
          return (
            <Tag key={i} className="notion-list">
              {group.map(b => (
                <li key={b.id} className="notion-list-item">
                  <RT rich={blockRichText(b)} />
                </li>
              ))}
            </Tag>
          )
        }

        return <Block key={group.id} block={group} />
      })}
    </>
  )
}

function Block({ block }: { block: NotionBlock }) {
  const rich = blockRichText(block)

  switch (block.type) {
    case 'heading_1':
      return <h2 className="notion-h1"><RT rich={rich} /></h2>

    case 'heading_2':
      return <h3 className="notion-h2"><RT rich={rich} /></h3>

    case 'heading_3':
      return <h4 className="notion-h3"><RT rich={rich} /></h4>

    case 'paragraph':
      if (rich.length === 0) return <div className="notion-spacer" />
      return <p className="notion-p"><RT rich={rich} /></p>

    case 'quote':
      return <blockquote className="notion-quote"><RT rich={rich} /></blockquote>

    case 'code': {
      const codeBlock = block.code as { rich_text: RichText[]; language: string }
      return (
        <pre className="notion-code" data-lang={codeBlock.language}>
          <code><RT rich={codeBlock.rich_text} /></code>
        </pre>
      )
    }

    case 'callout': {
      const cb = block.callout as { icon?: { emoji?: string }; rich_text: RichText[] }
      return (
        <div className="notion-callout">
          {cb.icon?.emoji && (
            <span className="notion-callout-icon" aria-hidden="true">
              {cb.icon.emoji}
            </span>
          )}
          <p><RT rich={cb.rich_text} /></p>
        </div>
      )
    }

    case 'to_do': {
      const td = block.to_do as { checked: boolean; rich_text: RichText[] }
      return (
        <div className="notion-todo">
          <span
            className={`notion-todo-check ${td.checked ? 'notion-todo-check--done' : ''}`}
            aria-label={td.checked ? 'Hecho' : 'Pendiente'}
          >
            {td.checked ? '✓' : '○'}
          </span>
          <span className={td.checked ? 'notion-todo-text--done' : ''}>
            <RT rich={td.rich_text} />
          </span>
        </div>
      )
    }

    case 'divider':
      return <hr className="notion-divider" />

    case 'image': {
      const img = block.image as {
        type: 'external' | 'file'
        external?: { url: string }
        file?: { url: string }
        caption?: RichText[]
      }
      const url = img.type === 'external' ? img.external?.url : img.file?.url
      if (!url) return null
      const caption = img.caption?.length ? rt(img.caption) : undefined
      return (
        <figure className="notion-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={caption ?? ''} loading="lazy" />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      )
    }

    default:
      return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rich text renderer
// ─────────────────────────────────────────────────────────────────────────────

function RT({ rich }: { rich: RichText[] }) {
  return (
    <>
      {rich.map((node, i) => {
        const { bold, italic, code, strikethrough, underline } = node.annotations
        let content: React.ReactNode = node.plain_text

        if (code)          content = <code className="notion-inline-code">{content}</code>
        if (bold)          content = <strong>{content}</strong>
        if (italic)        content = <em>{content}</em>
        if (strikethrough) content = <s>{content}</s>
        if (underline)     content = <u>{content}</u>

        if (node.href) {
          content = (
            <a
              href={node.href}
              className="notion-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          )
        }

        return <span key={i}>{content}</span>
      })}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Error state
// ─────────────────────────────────────────────────────────────────────────────

function NowError({ message }: { message: string }) {
  return (
    <div className="now-page">
      <div className="now-container">
        <div className="now-error">
          <h1 className="now-title">/now</h1>
          <p className="now-error-title">No se pudo conectar con Notion</p>
          <p className="now-error-body">{message}</p>
          <p className="now-error-hint">
            Verifica <code>NOTION_TOKEN_NOW</code> y <code>NOTION_NOW_PAGE_ID</code>{' '}
            en <code>.env.local</code>
          </p>
        </div>
      </div>
    </div>
  )
}
