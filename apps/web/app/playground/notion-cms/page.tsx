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
            Integración técnica detrás de /now. Un Server Component lee directamente
            la Notion API con ISR. Sin SDK externo, sin MDX intermediario.
          </p>
          <p className="notion-p" style={{ maxWidth: '52ch' }}>
            Decisiones tomadas: marzo 2026 · Sesión de contenidos.
          </p>
        </header>

        {/* ── Sala de control — estado en vivo ───────────────────────── */}
        <SyncStatus data={syncData} error={error} />

        {/* ── Framework ──────────────────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">Framework — Burner List de Jake Knapp</h2>
          <p className="notion-p">
            <a href="/now" className="notion-link">/now</a> no es un CV actualizado
            ni una lista de tareas. Es una foto honesta del estado presente: lo que
            tiene el foco, lo que está en segundo plano, y el ruido que hay que
            gestionar. La estructura viene de{' '}
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
            Una hoja dividida en dos columnas.{' '}
            <strong>Izquierda = fuego delantero. Derecha = fuego trasero.</strong>
          </p>

          <div className="notion-callout">
            <span className="notion-callout-icon" aria-hidden="true">🔥</span>
            <p>
              <strong>Front burner</strong> — Un único proyecto. El más importante.
              Solo uno. Las tareas concretas que lo mueven en los próximos días.
              El espacio en blanco restante es enfoque visible.
            </p>
          </div>
          <div className="notion-callout">
            <span className="notion-callout-icon" aria-hidden="true">🫕</span>
            <p>
              <strong>Back burner</strong> — El segundo proyecto más importante.
              Consciente pero no protagonista.
            </p>
          </div>
          <div className="notion-callout">
            <span className="notion-callout-icon" aria-hidden="true">🪣</span>
            <p>
              <strong>Kitchen sink</strong> — Todo lo demás sin categorizar.
              El fregadero donde va el resto.
            </p>
          </div>

          <p className="notion-p">
            <strong>La regla más importante:</strong> la Burner List es desechable.
            Se rehace cuando cambia el front burner. El acto de rehacer te obliga a
            decidir qué sigue siendo importante y qué ya no.
          </p>

          <h3 className="notion-h2">Building in public</h3>
          <p className="notion-p">
            /now es el canal principal de la estrategia de construir en público.
            Cada vez que el front burner cambia, hay una historia que contar:
          </p>
          <ol className="notion-list">
            <li className="notion-list-item">Pablo actualiza /now en Notion</li>
            <li className="notion-list-item">Ese estado se convierte en contenido para redes</li>
            <li className="notion-list-item">
              El visitante que llega referenciado ve la prueba en vivo de que el
              sitio está en construcción
            </li>
            <li className="notion-list-item">
              Conecta con el posicionamiento: aprende haciendo, proceso visible,
              no portfolio muerto
            </li>
          </ol>
        </section>

        {/* ── Planteamiento ──────────────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">Planteamiento</h2>
          <p className="notion-p">
            /now necesitaba actualizarse desde cualquier sitio, sin tocar el código.
            La solución más simple: Notion como CMS. Este experimento documenta cómo
            se construyó esa integración en fases, qué decisiones se tomaron en cada
            momento y por qué.
          </p>

          <h3 className="notion-h2">Qué es /now</h3>
          <p className="notion-p">
            El "frontdesk" de{' '}
            <a href="/" className="notion-link">pablobellver.com</a>.
            La página que responde: <strong>¿qué está pasando ahora mismo?</strong>{' '}
            No es un CV actualizado. No es una lista de tareas. Es una foto del
            presente — lo que tiene el foco, lo que está en segundo plano, y el ruido
            que hay que gestionar. Pública porque esa transparencia es parte del proceso.
          </p>

          <h3 className="notion-h2">Fuente de datos</h3>
          <p className="notion-p">
            <strong>Página:</strong> Now — ID{' '}
            <code className="notion-inline-code">0aa0a698-a15f-4842-898a-02f5ca517d84</code>
          </p>
          <p className="notion-p">
            Una página simple a nivel workspace en Notion (no hija de ningún otro
            documento, no wiki, no database). Contiene la Burner List directamente
            como bloques: headings + callouts. Pablo la edita libremente. Sirve como
            CMS único de /now.
          </p>

          <h3 className="notion-h2">Flujo buscado</h3>
          <p className="notion-p">
            Sería el flujo ideal pero no tiene porque ser el inicial para empezar con
            el experimento.
          </p>
          <pre className="notion-code">
            <code>{`Pablo edita la página de Notion
        ↓
Webhook de Notion detecta el cambio
        ↓
Script convierte el contenido a content/now.mdx
        ↓
Vercel detecta el cambio en el repo y lanza rebuild
        ↓
/now actualizado en producción`}</code>
          </pre>
          <p className="notion-p">
            Vamos a realizar varias fases. Empezaremos por una sincronización cada
            cierto tiempo. Luego añadiremos script manual para leer la página de Notion
            vía API y escribe el content/now.mdx → commit + push → Vercel rebuild.
            Sin infraestructura de webhooks, sin complejidad extra.
          </p>
          <p className="notion-p">
            Por último y si la frecuencia de actualización lo justifica puedo añadir
            el webhook después.
          </p>
        </section>

        {/* ── V1 ─────────────────────────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">V1 — ISR con Notion y Vercel</h2>
          <p className="notion-p" style={{ opacity: 0.6 }}>Estado: ✅ Implementada</p>
          <p className="notion-p">
            Lectura directa desde Notion vía API con ISR — Incremental Static
            Regeneration (revalidación cada hora). Sin script manual, sin MDX
            intermediario. El Server Component lee la página en build time y Next.js
            la regenera automáticamente.
          </p>

          <h3 className="notion-h2">Arquitectura</h3>
          <pre className="notion-code">
            <code>Notion API → lib/notion.ts (fetch + parse) → Server Component → /now</code>
          </pre>
          <p className="notion-p">Variables de entorno necesarias:</p>
          <pre className="notion-code">
            <code>{`NOTION_TOKEN_NOW=ntn_...           # Integration token
NOTION_NOW_PAGE_ID=0aa0a698-...    # ID de la página Now`}</code>
          </pre>
          <div className="notion-callout">
            <span className="notion-callout-icon" aria-hidden="true">⚠️</span>
            <p>
              Las variables van en <strong>Project Settings</strong> de Vercel,
              no en Team Settings. Las de equipo no se inyectan en los builds
              de proyectos individuales.
            </p>
          </div>

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

          <h3 className="notion-h2">Incidencias resueltas</h3>

          <h4 className="notion-h3">Callouts sin contenido interior</h4>
          <p className="notion-p">
            La Notion API devuelve callouts con{' '}
            <code className="notion-inline-code">has_children: true</code> pero{' '}
            <code className="notion-inline-code">fetchBlocks</code> solo leía el
            primer nivel. El renderer pintaba el{' '}
            <code className="notion-inline-code">rich_text</code> del bloque raíz
            —vacío— ignorando los bloques hijos. Fix:{' '}
            <code className="notion-inline-code">fetchBlocks</code> ahora es
            recursiva. Si un bloque tiene{' '}
            <code className="notion-inline-code">has_children: true</code>, fetchea
            sus hijos y los asigna a{' '}
            <code className="notion-inline-code">block.children</code>.
          </p>

          <h4 className="notion-h3">H3 dentro de callouts</h4>
          <p className="notion-p">
            Los callouts con un{' '}
            <code className="notion-inline-code">heading_3</code> como primer hijo
            no lo mostraban como título — el H3 quedaba perdido en el cuerpo. Fix:
            si el primer hijo es{' '}
            <code className="notion-inline-code">heading_3</code>, se extrae y se
            renderiza como título del callout. El resto de hijos pasa a{' '}
            <code className="notion-inline-code">BlocksRenderer</code> normalmente.
          </p>

          <h3 className="notion-h2">Lecciones aprendidas</h3>
          <ul className="notion-list">
            <li className="notion-list-item">
              <strong>Las variables de entorno tienen scope y no es obvio.</strong>{' '}
              Vercel distingue entre variables de equipo y variables de proyecto.
              El error no te dice dónde está el problema — simplemente la variable
              no existe. Cuesta tiempo real hasta que lo ves.
            </li>
            <li className="notion-list-item">
              <strong>Nombrar bien desde el principio tiene coste cero.</strong>{' '}
              <code className="notion-inline-code">NOTION_TOKEN_NOW</code> en lugar
              de <code className="notion-inline-code">NOTION_TOKEN</code> genérico.
              Evita ambigüedad cuando haya más integraciones y hace explícita la
              separación entre servicios.
            </li>
            <li className="notion-list-item">
              <strong>Las APIs tienen niveles de profundidad que no se ven hasta que algo falla.</strong>{' '}
              La Notion API devuelve bloques con{' '}
              <code className="notion-inline-code">has_children: true</code> pero no
              incluye los hijos en la misma llamada. El bug no es de lógica sino de
              arquitectura de la llamada.
            </li>
            <li className="notion-list-item">
              <strong>Verificar en producción antes de dar algo por hecho.</strong>{' '}
              El token funcionaba desde el paso 1 pero no había forma de saberlo
              hasta que el error cambió. Cada error resuelto revela el siguiente.
              El flujo correcto: configurar → desplegar → verificar → siguiente paso.
            </li>
            <li className="notion-list-item">
              <strong>La complejidad técnica se prioriza por frecuencia de uso, no por elegancia.</strong>{' '}
              ISR cada hora cubre el caso de uso real de /now. Añadir webhooks desde
              el día uno habría sido sobreingenería. La decisión correcta: hacer
              funcionar lo mínimo necesario, documentar la evolución posible,
              revisarlo cuando el uso lo justifique.
            </li>
          </ul>
          <p className="notion-p">
            → V1 funcionó. La integración estaba en producción, el contenido se
            leía desde Notion y la web se actualizaba automáticamente cada hora.
            El siguiente problema: editar en Notion y tener que esperar hasta 60
            minutos para ver el cambio publicado dejaba margen claro de mejora.
          </p>
        </section>

        {/* ── Next step ──────────────────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">Next step — Publicar cambios de forma inmediata</h2>
          <p className="notion-p">
            ISR revalida automáticamente cada hora. Para el uso habitual de /now
            es suficiente. Pero cuando se necesita publicar un cambio de forma
            inmediata hay dos caminos posibles.
          </p>

          <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0', borderBottom: '1px solid var(--border)', color: 'var(--muted-foreground)', fontWeight: 500 }}></th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)', color: 'var(--muted-foreground)', fontWeight: 500 }}>Opción A</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)', color: 'var(--muted-foreground)', fontWeight: 500 }}>Opción B</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Mecanismo', 'Deploy Hook + script npm', 'Webhook de Notion'],
                  ['Automatización', 'Manual — tú lanzas el script', 'Automática al guardar en Notion'],
                  ['Complejidad', 'Baja', 'Alta'],
                  ['Versión', 'Versión 2.0', 'Versión 3.0'],
                ].map(([label, a, b]) => (
                  <tr key={label}>
                    <td style={{ padding: '0.5rem 1rem 0.5rem 0', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>{label}</td>
                    <td style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)' }}>{a}</td>
                    <td style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)' }}>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="notion-p" style={{ marginTop: '1.5rem' }}>
            → Se elige Opción A para Versión 2. Coste de implementación mínimo,
            valor inmediato. No requiere infraestructura adicional ni configuración
            en el lado de Notion. La Opción B se reserva para cuando el volumen de
            cambios justifique la automatización completa.
          </p>
        </section>

        {/* ── V2 ─────────────────────────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">V2 — Publicación bajo demanda</h2>
          <p className="notion-p" style={{ opacity: 0.6 }}>Estado: ✅ Implementada</p>
          <p className="notion-p">
            Deploy Hook de Vercel + script npm. Editas en Notion, ejecutas un
            comando, Vercel lanza un redeploy inmediato sin esperar el ciclo de ISR.
          </p>
          <pre className="notion-code">
            <code>npm run sync-now --workspace=apps/web</code>
          </pre>

          <p className="notion-p"><strong>Implementación:</strong></p>
          <ul className="notion-list">
            <li className="notion-list-item">
              <code className="notion-inline-code">apps/web/package.json</code> →
              script <code className="notion-inline-code">sync-now</code> que hace
              POST a <code className="notion-inline-code">$VERCEL_DEPLOY_HOOK_NOW</code>
            </li>
            <li className="notion-list-item">
              <code className="notion-inline-code">apps/web/.env.local</code> →
              variable <code className="notion-inline-code">VERCEL_DEPLOY_HOOK_NOW</code>{' '}
              con la URL del hook (nunca va al repo)
            </li>
            <li className="notion-list-item">
              <code className="notion-inline-code">.vscode/tasks.json</code> → task
              "Publicar /now" para lanzar con{' '}
              <code className="notion-inline-code">Cmd+Shift+P</code> desde VS Code
              sin abrir el terminal
            </li>
          </ul>
          <p className="notion-p">
            <strong>Crear el Deploy Hook en Vercel:</strong> Proyecto → Settings →
            Git → Deploy Hooks → nombre <code className="notion-inline-code">sync-now</code>,
            rama <code className="notion-inline-code">main</code>.
          </p>

          <h3 className="notion-h2">Mejoras visuales (28 mar 2026)</h3>

          <h4 className="notion-h3">Casos de uso resueltos</h4>
          <ul className="notion-list">
            <li className="notion-list-item">
              <strong>Front/Back burners:</strong> Título destacado a la izquierda,
              acción visible sin scroll
            </li>
            <li className="notion-list-item">
              <strong>Kitchen Sink:</strong> Sin título = bloque único, rendering correcto
            </li>
            <li className="notion-list-item">
              <strong>Mobile:</strong> Contenido legible en pantallas pequeñas (1 columna)
            </li>
            <li className="notion-list-item">
              <strong>Ultrawide:</strong> Contenido no se ve aislado (proporciones optimizadas)
            </li>
            <li className="notion-list-item">
              <strong>Temas:</strong> Mantiene consistencia visual en todos los temas
            </li>
          </ul>

          <h4 className="notion-h3">Soporte de nuevos tipos de bloque</h4>
          <p className="notion-p">
            Nuevos renderers añadidos en{' '}
            <code className="notion-inline-code">lib/notion.ts</code> y{' '}
            <code className="notion-inline-code">app/now/page.tsx</code>.
          </p>
          <ul className="notion-list">
            <li className="notion-list-item">
              <strong>Toggle</strong> — renderizado con el elemento nativo{' '}
              <code className="notion-inline-code">&lt;details&gt;/&lt;summary&gt;</code>.
              Sin JavaScript adicional — el navegador gestiona el estado abierto/cerrado.
              Los hijos se renderizan con{' '}
              <code className="notion-inline-code">BlocksRenderer</code>, lo que permite
              anidamiento ilimitado.
            </li>
            <li className="notion-list-item">
              <strong>Child page</strong> — cuando la página de Notion tiene páginas
              hijas enlazadas como bloque, se renderiza como referencia no navegable:
              icono + título.
            </li>
          </ul>

          <h4 className="notion-h3">Callout responsive</h4>
          <p className="notion-p">
            Se modifica el{' '}
            <code className="notion-inline-code">styles/now.css</code>:
          </p>
          <ul className="notion-list">
            <li className="notion-list-item">
              El callout pasó de{' '}
              <code className="notion-inline-code">display: flex</code> a{' '}
              <code className="notion-inline-code">display: grid</code> para permitir
              layout de dos columnas sin romper en mobile.
            </li>
            <li className="notion-list-item">
              Grid se adapta según viewport (5 media queries desde mobile → ultrawide)
            </li>
            <li className="notion-list-item">
              Nuevas clases:{' '}
              <code className="notion-inline-code">.notion-callout-title</code> y{' '}
              <code className="notion-inline-code">.notion-callout-content</code>.
            </li>
            <li className="notion-list-item">
              Estilos para toggle y child_page incluidos.
            </li>
          </ul>
        </section>

        {/* ── V3 ─────────────────────────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">V3 — Actualización con webhook</h2>
          <p className="notion-p" style={{ opacity: 0.6 }}>Estado: 🚧 Pendiente</p>
          <p className="notion-p">
            Notion detecta el cambio al guardar → llama al Deploy Hook automáticamente
            → Vercel redeploy. Sin intervención manual. Más complejidad de configuración
            que V2 pero publicación completamente transparente.
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
