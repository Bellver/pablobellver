# pablobellver — Contexto global

## Qué es esto
Monorepo del portfolio personal de Pablo Bellver (pablobellver.com).
Product Designer senior. El sitio prueba su adaptabilidad — no la declara.

## Estructura
- `packages/design-system` → DS agnóstico y reutilizable. Sin lógica de app.
- `apps/web` → pablobellver.com. Consume el DS como package local.

## Stack
- Monorepo: npm workspaces
- DS: shadcn/ui adaptado + CSS custom properties
- Web: Next.js App Router + MDX
- Deploy: Vercel

## Regla fundamental
Los componentes solo hablan con tokens semánticos (--background, --foreground...).
Nunca con valores hardcodeados. Nunca con primitivos directamente.

## Themes
- open → light OS, DM Serif Display, radius 8px, fondo blanco
- learn → dark OS, JetBrains Mono, radius 4px, fondo #0F0F0D
- rebel → solo elección activa del usuario, Bebas Neue, radius 0, fondo #F5C400

## Secciones de la web
/ → Landing · /work → Portfolio · /playground → Experimentos
/writing → Blog · /now → Estado presente