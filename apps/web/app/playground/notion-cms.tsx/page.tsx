/**
 * app/playground/notion-cms/page.tsx
 * Experimento: Notion como CMS con Server Components e ISR.
 * Muestra el estado de la sincronización y cómo funciona.
 */

import type { Metadata } from 'next'
import { getNowPage } from '@/lib/notion'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Notion as CMS',
  description: 'Server Component that reads directly from the Notion API with ISR. No SDK, no manual script.',
}

export default async function NotionCmsPage() {
  const startTime = Date.now()
  let syncData: SyncData | null = null
  let error: string | null = null

  try {
    const data = await getNowPage()
    const elapsed = Date.now() - startTime

    syncData = {
      status: 'ok',
      pageId:      data.id,
      title:       data.title,
      lastEdited:  data.lastEdited,
      fetchedAt:   data.fetchedAt,
      blockCount:  data.blocks.length,
      elapsedMs:   elapsed,
    }
  } catch (e) {
    syncData = { status: 'error', elapsedMs: Date.now() - startTime }
    error = e instanceof Error ? e.message : 'Error desconocido'
  }

  return (
    <div className="now-page">
      <div className="now-container">

        {/* Header */}
        <header style={{ marginBottom: '3rem' }}>
          <p className="section-label">Playground / Experimento</p>
          <h1 className="now-title">Notion CMS</h1>
          <p className="notion-p" style={{ marginTop: '1rem', maxWidth: '52ch' }}>
            Un Server Component de Next.js lee directamente la API de Notion.
            Sin SDK externo, sin script manual, sin MDX intermediario.
            ISR hace que los cambios en Notion aparezcan en el sitio en &lt;1h.
          </p>
        </header>

        {/* Sync status card */}
        <SyncStatus data={syncData} error={error} />

        {/* How it works */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">Cómo funciona</h2>

          <h3 className="notion-h2">1. Sin SDK externo</h3>
          <p className="notion-p">
            La Notion API es REST puro. Solo necesita{' '}
            <code className="notion-inline-code">fetch</code> nativo de Node.js.
            Cero dependencias añadidas.
          </p>

          <h3 className="notion-h2">2. ISR automático</h3>
          <p className="notion-p">
            Next.js cachea la respuesta del fetch. Con{' '}
            <code className="notion-inline-code">{'next: { revalidate: 3600 }'}</code>{' '}
            en las llamadas a fetch, el contenido se revalida cada hora
            sin rebuild. El visitante siempre recibe HTML pre-renderizado.
          </p>

          <h3 className="notion-h2">3. Revalidación manual</h3>
          <p className="notion-p">
            Para forzar revalidación inmediata después de una edición en Notion,
            se puede crear un webhook que llame a{' '}
            <code className="notion-inline-code">/api/revalidate?secret=TOKEN</code>.
          </p>

          <h3 className="notion-h2">El código relevante</h3>
          <pre className="notion-code">
            <code>{`// lib/notion.ts
async function fetchBlocks(id: string) {
  return fetch(
    \`https://api.notion.com/v1/blocks/\${id}/children\`,
    {
      headers: { Authorization: \`Bearer \${process.env.NOTION_TOKEN_NOW}\` },
      next: { revalidate: 3600 }, // ← ISR
    }
  ).then(r => r.json())
}

// app/now/page.tsx
export const revalidate = 3600  // ← también en la route

export default async function NowPage() {
  const data = await getNowPage() // server-side, cacheado
  return <NotionBlocks blocks={data.blocks} />
}`}</code>
          </pre>
        </section>

        {/* Link to /now */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <a href="/now" className="link-arrow">
            Ver la página /now generada con esto →
          </a>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sync status component
// ─────────────────────────────────────────────────────────────────────────────

type SyncData =
  | { status: 'ok'; pageId: string; title: string; lastEdited: string; fetchedAt: string; blockCount: number; elapsedMs: number }
  | { status: 'error'; elapsedMs: number }

function SyncStatus({ data, error }: { data: SyncData | null; error: string | null }) {
  if (!data) return null

  const isOk = data.status === 'ok'

  return (
    <div className="sync-card" data-status={data.status}>
      <div className="sync-header">
        <span className="sync-indicator" aria-hidden="true">
          {isOk ? '●' : '✕'}
        </span>
        <span className="sync-title">
          {isOk ? 'Conexión activa' : 'Error de conexión'}
        </span>
        <span className="sync-time">{data.elapsedMs}ms</span>
      </div>

      {isOk && data.status === 'ok' && (
        <dl className="sync-grid">
          <Row label="Página" value={data.title} />
          <Row label="ID"     value={data.pageId.replace(/-/g, '')} mono />
          <Row label="Bloques"   value={String(data.blockCount)} />
          <Row
            label="Última edición"
            value={new Date(data.lastEdited).toLocaleString('es-ES')}
          />
          <Row
            label="Sincronizado"
            value={new Date(data.fetchedAt).toLocaleString('es-ES')}
          />
          <Row label="Revalida cada" value="3600s (1h)" />
        </dl>
      )}

      {error && (
        <p className="sync-error">{error}</p>
      )}
    </div>
  )
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <>
      <dt>{label}</dt>
      <dd style={{ fontFamily: mono ? 'var(--font-mono)' : undefined, fontSize: mono ? '0.75rem' : undefined }}>
        {value}
      </dd>
    </>
  )
}
