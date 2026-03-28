/**
 * app/playground/notion-cms/page.tsx
 * Experimento: Notion como CMS con Server Components e ISR.
 * Documenta la integración real de /now → Notion API.
 */

import type { Metadata } from 'next'
import { getNowPage } from '@/lib/notion'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Notion CMS — Playground',
  description: 'Cómo funciona la integración Notion → /now. Server Component puro, fetch nativo, ISR. Sin SDK externo.',
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
      pageId:     data.id,
      title:      data.title,
      lastEdited: data.lastEdited,
      fetchedAt:  data.fetchedAt,
      blockCount: data.blocks.length,
      elapsedMs:  elapsed,
    }
  } catch (e) {
    syncData = { status: 'error', elapsedMs: Date.now() - startTime }
    error = e instanceof Error ? e.message : 'Error desconocido'
  }

  return (
    <div className="now-page">
      <div className="now-container">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <header style={{ marginBottom: '3rem' }}>
          <p className="section-label">Playground / Experimento</p>
          <h1 className="now-title">Notion CMS</h1>
          <p className="notion-p" style={{ marginTop: '1rem', maxWidth: '52ch' }}>
            La integración técnica detrás de{' '}
            <a href="/now" className="notion-link">/now</a>.
            Un Server Component lee directamente la Notion API con ISR.
            Sin SDK externo, sin script manual, sin MDX intermediario.
          </p>
          <p className="notion-p" style={{ maxWidth: '52ch' }}>
            Decisiones tomadas: marzo 2026 · Sesión de contenidos.
          </p>
        </header>

        {/* ── Sala de control — estado en vivo ───────────────────────── */}
        <SyncStatus data={syncData} error={error} />

        {/* ── El framework ───────────────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">El framework — Burner List de Jake Knapp</h2>
          <p className="notion-p">
            /now no es un CV actualizado ni una lista de tareas. Es una foto honesta del estado
            presente: lo que tiene el foco, lo que está en segundo plano, y el ruido que hay
            que gestionar. La estructura viene de{' '}
            <a
              href="https://medium.com/make-time/the-burner-list-my-simple-paper-based-system-for-focused-to-dos-95497321cf14"
              className="notion-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              The Burner List
            </a>{' '}
            de Jake Knapp.
          </p>
          <p className="notion-p">
            Una hoja dividida en dos columnas. <strong>Izquierda = fuego delantero.
            Derecha = fuego trasero.</strong>
          </p>

          <div className="notion-callout">
            <span className="notion-callout-icon" aria-hidden="true">🔥</span>
            <p>
              <strong>Front burner (columna izquierda)</strong> — Un único proyecto.
              El más importante. Solo uno. Con las tareas concretas que lo mueven en
              los próximos días. El espacio en blanco es enfoque visible.
            </p>
          </div>
          <div className="notion-callout">
            <span className="notion-callout-icon" aria-hidden="true">🫕</span>
            <p>
              <strong>Back burner (columna derecha, parte superior)</strong> — El segundo
              proyecto más importante. Consciente pero no protagonista.
            </p>
          </div>
          <div className="notion-callout">
            <span className="notion-callout-icon" aria-hidden="true">🪣</span>
            <p>
              <strong>Kitchen sink (columna derecha, parte inferior)</strong> — Todo lo
              demás sin categorizar. El fregadero donde va el resto.
            </p>
          </div>

          <p className="notion-p">
            La regla más importante: la Burner List es desechable. Se rehace cuando cambia
            el front burner. El acto de rehacer te obliga a decidir qué sigue siendo
            importante y qué ya no.
          </p>
        </section>

        {/* ── Arquitectura ───────────────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">Arquitectura de la integración</h2>

          <h3 className="notion-h2">La fuente de datos</h3>
          <p className="notion-p">
            Una página simple a nivel workspace en Notion (no hija de ningún otro documento,
            no wiki, no database). Contiene la Burner List directamente como bloques:
            headings + callouts. Pablo la edita libremente. Sirve como CMS único de /now.
          </p>
          <p className="notion-p">Estructura actual de la página Notion:</p>
          <pre className="notion-code">
            <code>{`## 🔥 Front burner  → callout con tareas del proyecto principal
## 🫕 Back burner   → callout con el segundo proyecto
## 🪣 Kitchen sink  → callout con el resto
## ⚙️ Cómo funciona → toggle con instrucciones (no se sincroniza)`}</code>
          </pre>

          <h3 className="notion-h2">El flujo</h3>
          <pre className="notion-code">
            <code>{`Pablo edita la página de Notion
        ↓
Notion API devuelve los bloques
        ↓
fetchBlocks() los lee con fetch nativo (ISR: revalidate 3600s)
        ↓
Next.js sirve HTML pre-renderizado
        ↓
/now actualizado en producción (máx. 1h de latencia)`}</code>
          </pre>

          <h3 className="notion-h2">El código</h3>
          <pre className="notion-code">
            <code>{`// lib/notion.ts — fetch recursivo (bloques e hijos)
async function fetchBlocks(blockId: string, revalidate: number) {
  const res = await fetch(
    \`https://api.notion.com/v1/blocks/\${blockId}/children\`,
    {
      headers: { Authorization: \`Bearer \${process.env.NOTION_TOKEN_NOW}\` },
      next: { revalidate }, // ← ISR automático
    }
  )
  const data = await res.json()
  const blocks = data.results ?? []

  for (const block of blocks) {
    if (block.has_children) {
      block.children = await fetchBlocks(block.id, revalidate)
    }
  }

  return blocks
}

// app/now/page.tsx
export const revalidate = 3600

export default async function NowPage() {
  const data = await getNowPage() // server-side, cacheado
  return <BlocksRenderer groups={groupBlocks(data.blocks)} />
}`}</code>
          </pre>
        </section>

        {/* ── Decisiones técnicas ─────────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">Decisiones técnicas</h2>

          <h3 className="notion-h2">Variables de entorno con nombre específico</h3>
          <p className="notion-p">
            <code className="notion-inline-code">NOTION_TOKEN_NOW</code> en lugar de{' '}
            <code className="notion-inline-code">NOTION_TOKEN</code> genérico. El nombre
            genérico asume una única integración Notion. En este proyecto tiene sentido
            ser específico: la integración de /now es independiente y puede haber otras
            (writing, work…) con sus propios tokens y permisos. Nombrar{' '}
            <code className="notion-inline-code">NOTION_TOKEN_NOW</code> hace explícita
            esa separación sin coste adicional.
          </p>

          <h3 className="notion-h2">ISR en lugar de webhook (v1)</h3>
          <p className="notion-p">
            La integración funciona con revalidación automática cada hora. Para publicación
            instantánea (Fase 2), la opción recomendada es un Deploy Hook en Vercel
            ejecutado con <code className="notion-inline-code">npm run sync-now</code>.
            El webhook automático de Notion queda documentado pero pendiente — empieza
            simple, añade complejidad solo si la frecuencia lo justifica.
          </p>

          <h3 className="notion-h2">Trampas conocidas al configurar</h3>
          <ul className="notion-list">
            <li className="notion-list-item">
              <strong>Conectar la página a la integración.</strong> Notion no da acceso
              automático — hay que compartir explícitamente vía{' '}
              <code className="notion-inline-code">··· → Connections</code>. Si no se hace,
              la API devuelve <code className="notion-inline-code">object_not_found</code>{' '}
              sin más pistas.
            </li>
            <li className="notion-list-item">
              <strong>Variables en Project Settings, no en Team Settings.</strong> Las
              variables de equipo no se inyectan en los builds. Hay que crearlas siempre
              en <code className="notion-inline-code">Project → Settings → Environment Variables</code>.
            </li>
            <li className="notion-list-item">
              <strong>Redeploy obligatorio tras añadir variables.</strong> Vercel no
              lo dispara automáticamente si no hay push de código.
            </li>
          </ul>
        </section>

        {/* ── Incidencias resueltas ──────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">Incidencias resueltas</h2>

          <h3 className="notion-h2">Callouts sin contenido interior (28 mar 2026)</h3>
          <p className="notion-p">
            <strong>Síntoma:</strong> /now cargaba los headings (Front burner, Back burner,
            Kitchen sink) pero los callouts aparecían vacíos.
          </p>
          <p className="notion-p">
            <strong>Causa:</strong> La Notion API devuelve callouts con{' '}
            <code className="notion-inline-code">has_children: true</code> pero{' '}
            <code className="notion-inline-code">fetchBlocks</code> solo leía el primer
            nivel. El renderer de <code className="notion-inline-code">callout</code> pintaba
            el <code className="notion-inline-code">rich_text</code> del bloque raíz
            (vacío en este caso), ignorando los bloques hijos.
          </p>
          <p className="notion-p">
            <strong>Fix:</strong> <code className="notion-inline-code">fetchBlocks</code>{' '}
            ahora es recursiva — si un bloque tiene{' '}
            <code className="notion-inline-code">has_children: true</code>, fetchea sus
            hijos y los asigna a <code className="notion-inline-code">block.children</code>.
            El renderer de callout pinta los hijos con{' '}
            <code className="notion-inline-code">BlocksRenderer</code>.
          </p>
        </section>

        {/* ── Fase 2 ─────────────────────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">Fase 2 — Publicación instantánea</h2>
          <p className="notion-p">
            Actualmente la sincronización es automática cada 60 minutos vía ISR. Para
            publicar un cambio de Notion de forma inmediata:
          </p>

          <h3 className="notion-h2">Opción A — Deploy Hook + script npm (recomendada)</h3>
          <p className="notion-p">
            Crear un Deploy Hook en Vercel (
            <code className="notion-inline-code">Settings → Git → Deploy Hooks</code>)
            y añadir en <code className="notion-inline-code">apps/web/package.json</code>:
          </p>
          <pre className="notion-code">
            <code>{`"scripts": {
  "sync-now": "curl -X POST https://api.vercel.com/v1/integrations/deploy/XXXXXXX"
}`}</code>
          </pre>
          <p className="notion-p">
            Ejecutar con{' '}
            <code className="notion-inline-code">npm run sync-now</code> desde{' '}
            <code className="notion-inline-code">apps/web</code> o desde la raíz con{' '}
            <code className="notion-inline-code">npm run sync-now --workspace=apps/web</code>.
          </p>

          <h3 className="notion-h2">Opción B — Webhook de Notion</h3>
          <p className="notion-p">
            Notion detecta el cambio → llama al Deploy Hook automáticamente → Vercel
            redeploy. Sin intervención manual. Más complejidad de configuración.
            Estado: <strong>pendiente</strong> — documentado, no implementado.
          </p>
        </section>

        {/* ── Footer ─────────────────────────────────────────────────── */}
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
          <Row label="Página"          value={data.title} />
          <Row label="ID"              value={data.pageId.replace(/-/g, '')} mono />
          <Row label="Bloques"         value={String(data.blockCount)} />
          <Row label="Última edición"  value={new Date(data.lastEdited).toLocaleString('es-ES')} />
          <Row label="Sincronizado"    value={new Date(data.fetchedAt).toLocaleString('es-ES')} />
          <Row label="Revalida cada"   value="3600s (1h)" />
        </dl>
      )}

      {error && <p className="sync-error">{error}</p>}
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
