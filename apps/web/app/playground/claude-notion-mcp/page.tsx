import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude Code + Notion MCP — Playground',
  description: 'Configurar Claude Code para leer y escribir en Notion directamente desde VS Code usando el servidor MCP oficial.',
}

export default function ClaudeNotionMcpPage() {
  return (
    <div className="now-page">
      <div className="now-container">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <header style={{ marginBottom: '3rem' }}>
          <p className="section-label">Playground / Experimento</p>
          <h1 className="now-title">Claude Code + Notion MCP</h1>
          <p className="notion-p" style={{ marginTop: '1rem', maxWidth: '52ch' }}>
            Configurar Claude Code para leer y escribir en un workspace de Notion
            directamente desde el chat de VS Code, usando el servidor MCP oficial.
            No es el mismo experimento que{' '}
            <a href="/playground/notion-cms" className="notion-link">Notion como CMS</a>{' '}
            — ese conecta la web a Notion; este conecta el agente de IA a Notion.
          </p>
        </header>

        {/* ── Diferencia clave ───────────────────────────────────────── */}
        <section style={{ marginTop: '2rem' }}>
          <h2 className="notion-h1">Diferencia clave</h2>

          <div className="notion-callout">
            <span className="notion-callout-icon" aria-hidden="true">🌐</span>
            <p>
              <strong>Notion CMS /now</strong> — La web (Next.js) lee la API de Notion
              para mostrar contenido en producción. Auth vía <code className="notion-inline-code">NOTION_TOKEN</code>{' '}
              en variables de entorno del servidor.
            </p>
          </div>

          <div className="notion-callout">
            <span className="notion-callout-icon" aria-hidden="true">🤖</span>
            <p>
              <strong>Notion MCP (este experimento)</strong> — Claude Code (el agente)
              lee y escribe en Notion desde el chat. Auth vía token en{' '}
              <code className="notion-inline-code">.mcp.json</code> en la raíz del repo.
            </p>
          </div>
        </section>

        {/* ── Configuración ──────────────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">Configuración</h2>
          <p className="notion-p">
            Un único archivo en la raíz del repo:{' '}
            <code className="notion-inline-code">.mcp.json</code>
          </p>

          <pre className="notion-code">
            <code>{`{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\\"Authorization\\": \\"Bearer TU_TOKEN\\", \\"Notion-Version\\": \\"2022-06-28\\"}"
      }
    }
  }
}`}</code>
          </pre>

          <p className="notion-p">
            El token se genera en{' '}
            <a
              href="https://www.notion.so/profile/integrations"
              className="notion-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              notion.so/profile/integrations
            </a>{' '}
            → New integration → Internal Integration Secret (<code className="notion-inline-code">ntn_...</code>).
          </p>
        </section>

        {/* ── Prerequisitos ──────────────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">Prerequisitos</h2>

          <ul className="notion-list">
            <li className="notion-list-item">
              Crear una integration interna en Notion: notion.so/profile/integrations
              → New integration → Internal Integration Secret
            </li>
            <li className="notion-list-item">
              Compartir las páginas relevantes con esa integration —{' '}
              <code className="notion-inline-code">···</code> → Connect to → tu integration.
              Las páginas no conectadas no son accesibles aunque el token sea válido.
            </li>
            <li className="notion-list-item">
              Reiniciar Claude Code tras cambiar el token. El MCP server se carga al arrancar
              — un cambio en <code className="notion-inline-code">.mcp.json</code> no se aplica en caliente.
            </li>
            <li className="notion-list-item">
              El token nunca va a git. Añadir <code className="notion-inline-code">.mcp.json</code>{' '}
              a <code className="notion-inline-code">.gitignore</code> o usar variables de entorno del sistema.
            </li>
          </ul>
        </section>

        {/* ── Error 401 ──────────────────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">Error 401 — parte del experimento</h2>
          <p className="notion-p">
            Durante la configuración inicial, todas las llamadas a la API de Notion
            respondían con <code className="notion-inline-code">API token is invalid</code>.
            Tres causas posibles:
          </p>

          <ul className="notion-list">
            <li className="notion-list-item">
              <strong>El token caducó o fue revocado</strong> → regenerar en
              notion.so/profile/integrations → tu integration → Internal Integration Secret → Regenerate.
            </li>
            <li className="notion-list-item">
              <strong>La página no está conectada a la integration</strong> → aunque
              el token sea válido, Notion solo da acceso a páginas conectadas explícitamente
              con <code className="notion-inline-code">···</code> → Connect to → tu integration.
            </li>
            <li className="notion-list-item">
              <strong>Claude Code no ha sido reiniciado</strong> → el MCP server se
              inicia al arrancar; sustituir el token en{' '}
              <code className="notion-inline-code">.mcp.json</code> no aplica el cambio
              hasta el siguiente arranque.
            </li>
          </ul>

          <div className="notion-callout">
            <span className="notion-callout-icon" aria-hidden="true">💡</span>
            <p>
              Mientras el MCP del proyecto daba 401, Claude Code usó el MCP de Notion
              de Claude.ai para seguir trabajando — y con él actualizó esta misma página
              de Notion y construyó este experimento. El error quedó documentado in situ.
            </p>
          </div>
        </section>

        {/* ── Casos de uso ───────────────────────────────────────────── */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="notion-h1">Casos de uso</h2>

          <ul className="notion-list">
            <li className="notion-list-item">
              Consultar el estado del proyecto y el plan de trabajo sin salir de VS Code
            </li>
            <li className="notion-list-item">
              Documentar decisiones técnicas directamente en Notion desde el chat
            </li>
            <li className="notion-list-item">
              Leer notas de diseño para dar contexto a Claude antes de implementar
            </li>
            <li className="notion-list-item">
              Potencial: automatizar actualizaciones de documentación al hacer commits
            </li>
          </ul>
        </section>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <a href="/playground/notion-cms" className="link-arrow">
            Ver el experimento de Notion como CMS →
          </a>
        </div>

      </div>
    </div>
  )
}
