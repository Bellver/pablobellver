# apps/web — Reglas de la web

## Qué es este package
pablobellver.com. Implementación del design system para el portfolio de Pablo.

## Estructura
- app/ → rutas Next.js App Router
- components/theme/ThemeProvider.tsx → OS detection + localStorage (solo aquí)
- content/ → MDX (work/, writing/, playground/, now.mdx)
- experiments/ → componentes de cada experimento del playground
- lib/content.ts → helper para leer MDX
- styles/globals.css → flash prevention con :root:not([data-theme])

## Lógica de entrada (ThemeProvider)
1. Si hay pb-theme en localStorage → usar ese theme
2. Si no → detectar OS: dark = learn, light = open
3. Rebel nunca como default automático

## Contenido
- Artículos y casos de estudio → archivos MDX en content/
- Experimentos → componente en experiments/[nombre]/index.tsx
  + metadata en content/playground/[nombre].mdx

## Convenciones
- Orden alfabético en imports y dependencias
- Nunca inline styles — siempre tokens CSS
- Nuevos experimentos: carpeta en experiments/ + MDX en content/playground/