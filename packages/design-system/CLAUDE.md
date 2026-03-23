# design-system — Reglas del package

## Qué es este package
Design system agnóstico. No sabe nada de Next.js, del OS ni del usuario.
Solo define tokens y componentes. Reutilizable en cualquier proyecto.

## Lo que NUNCA va aquí
- Lógica de OS detection (prefers-color-scheme)
- Referencias a localStorage
- Imports de Next.js

## Estructura
- tokens/primitives.css → valores brutos (#F5C400, #0F0F0D...)
- tokens/semantic.css → :root con fallbacks y contrato de tokens
- tokens/themes/ → open.css, learn.css, rebel.css
- components/ui/ → shadcn adaptado
- components/theme/ThemeContext.tsx → aplica [data-theme], sin lógica de OS
- components/theme/ThemeSwitcher.tsx → UI del selector

## Tokens disponibles
--background · --foreground · --accent
--radius · --font-display
--transition-base · --shadow-card · --image-filter