/**
 * lib/notion.ts
 * Acceso directo a la Notion API sin SDK externo.
 * Usa fetch nativo de Next.js → ISR automático con next.revalidate.
 *
 * Variables de entorno requeridas en .env.local:
 *   NOTION_TOKEN_NOW        → Integration token (secret_...)
 *   NOTION_NOW_PAGE_ID  → ID de la página "Now" en Notion
 */

const NOTION_API = 'https://api.notion.com/v1'
const NOTION_VER = '2022-06-28'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type RichTextAnnotations = {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: string
}

export type RichText = {
  type: 'text' | 'mention' | 'equation'
  plain_text: string
  href: string | null
  annotations: RichTextAnnotations
  text?: { content: string; link: { url: string } | null }
}

export type BlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'to_do'
  | 'quote'
  | 'callout'
  | 'divider'
  | 'code'
  | 'image'

export type NotionBlock = {
  id: string
  type: BlockType | string
  has_children: boolean
  created_time: string
  last_edited_time: string
  [key: string]: unknown
}

export type NowPageData = {
  id: string
  title: string
  lastEdited: string
  blocks: NotionBlock[]
  fetchedAt: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function headers() {
  const token = process.env.NOTION_TOKEN_NOW
  if (!token) throw new Error('[notion] NOTION_TOKEN_NOW no definido en .env.local')
  return {
    Authorization: `Bearer ${token}`,
    'Notion-Version': NOTION_VER,
    'Content-Type': 'application/json',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public helpers — usados en los componentes de render
// ─────────────────────────────────────────────────────────────────────────────

/** Concatena el plain_text de un array de RichText */
export function rt(richText: RichText[]): string {
  return richText.map(t => t.plain_text).join('')
}

/** Extrae el rich_text de un bloque dado su tipo */
export function blockRichText(block: NotionBlock): RichText[] {
  const content = block[block.type] as { rich_text?: RichText[] } | undefined
  return content?.rich_text ?? []
}

// ─────────────────────────────────────────────────────────────────────────────
// API calls — ISR via next: { revalidate }
// ─────────────────────────────────────────────────────────────────────────────

async function fetchPage(pageId: string, revalidate: number) {
  const res = await fetch(`${NOTION_API}/pages/${pageId}`, {
    headers: headers(),
    next: { revalidate },
  })
  if (!res.ok) {
    throw new Error(`[notion] Error al leer página ${pageId}: HTTP ${res.status}`)
  }
  return res.json()
}

async function fetchBlocks(blockId: string, revalidate: number): Promise<NotionBlock[]> {
  const res = await fetch(
    `${NOTION_API}/blocks/${blockId}/children?page_size=100`,
    { headers: headers(), next: { revalidate } },
  )
  if (!res.ok) {
    throw new Error(`[notion] Error al leer bloques de ${blockId}: HTTP ${res.status}`)
  }
  const data = await res.json()
  return data.results ?? []
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getNowPage
 * Lee la página "Now" de Notion con ISR (revalida cada hora por defecto).
 * Server-side only — nunca importar desde Client Components.
 */
export async function getNowPage(revalidate = 3600): Promise<NowPageData> {
  const pageId = process.env.NOTION_NOW_PAGE_ID
  if (!pageId) throw new Error('[notion] NOTION_NOW_PAGE_ID no definido en .env.local')

  const [page, blocks] = await Promise.all([
    fetchPage(pageId, revalidate),
    fetchBlocks(pageId, revalidate),
  ])

  // Título — Notion puede tenerlo en "title" o "Name" según el tipo de página
  const titleProp =
    page.properties?.title ??
    page.properties?.Name ??
    page.properties?.['Título']

  const title =
    titleProp?.title?.[0]?.plain_text ??
    titleProp?.rich_text?.[0]?.plain_text ??
    'Now'

  return {
    id: page.id,
    title,
    lastEdited: page.last_edited_time as string,
    blocks,
    fetchedAt: new Date().toISOString(),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Block grouping — agrupa listas consecutivas para render correcto
// ─────────────────────────────────────────────────────────────────────────────

export type BlockGroup = NotionBlock | NotionBlock[]

export function groupBlocks(blocks: NotionBlock[]): BlockGroup[] {
  const groups: BlockGroup[] = []
  let buffer: NotionBlock[]  = []
  let listType: string | null = null

  const flush = () => {
    if (buffer.length > 0) { groups.push([...buffer]); buffer = []; listType = null }
  }

  for (const block of blocks) {
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      if (listType && listType !== block.type) flush()
      listType = block.type
      buffer.push(block)
    } else {
      flush()
      groups.push(block)
    }
  }

  flush()
  return groups
}
