'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTheme } from '@pablobellver/design-system'

// ─────────────────────────────────────────────────────────────────────────────
// Dispatcher — reads theme, renders correct hero variant
// ─────────────────────────────────────────────────────────────────────────────

export function HeroSection() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null
  if (theme === 'learn') return <HeroLearn />
  if (theme === 'rebel') return <HeroRebel />
  return <HeroOpen />
}

// ─────────────────────────────────────────────────────────────────────────────
// OPEN — Editorial. Serif. Warm. Cámara fija.
// ─────────────────────────────────────────────────────────────────────────────

function HeroOpen() {
  return (
    <section className="hero hero-open" aria-labelledby="hero-heading">
      <div className="hero-container">

        <p className="hero-kicker">
          Product Designer · Building in public
        </p>

        <h1 id="hero-heading" className="hero-name">
          Pablo
          <br />
          Bellver
        </h1>

        <p className="hero-tagline">
          Diseño sistemas que hacen que el software complejo
          parezca inevitable. Sin trucos — solo criterio.
        </p>

        <div className="hero-ctas">
          <Link href="/work"    className="btn-primary">Ver trabajo</Link>
          <Link href="/now"     className="btn-ghost"  >Qué estoy haciendo →</Link>
        </div>

      </div>

      {/* Decorative yellow square — acento visual OPEN */}
      <div className="hero-open-accent" aria-hidden="true" />
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LEARN — Terminal. Monospace. Proceso visible.
// ─────────────────────────────────────────────────────────────────────────────

function HeroLearn() {
  return (
    <section className="hero hero-learn" aria-labelledby="hero-heading">
      <div className="hero-container">

        <div className="terminal" role="region" aria-label="Terminal de presentación">
          {/* Traffic lights */}
          <div className="terminal-bar" aria-hidden="true">
            <span className="terminal-dot terminal-dot--close" />
            <span className="terminal-dot terminal-dot--min" />
            <span className="terminal-dot terminal-dot--max" />
            <span className="terminal-title">pablo_bellver — zsh — 80×24</span>
          </div>

          <div className="terminal-body">
            <TermLine delay={0}>
              <span className="t-prompt">~</span>
              <span className="t-sym"> $ </span>
              <span className="t-cmd">cat ./about.txt</span>
            </TermLine>
            <TermOut delay={120}>
              Pablo Bellver{'\n'}
              Product Designer — interfaces & sistemas
            </TermOut>

            <TermLine delay={400}>
              <span className="t-prompt">~</span>
              <span className="t-sym"> $ </span>
              <span className="t-cmd">ls -la ./work/</span>
            </TermLine>
            <TermOut delay={520}>
              design-systems/{'\n'}
              checkout-flow/{'\n'}
              data-viz/{'\n'}
              <Link href="/work" className="t-link">→ ver todos</Link>
            </TermOut>

            <TermLine delay={800}>
              <span className="t-prompt">~</span>
              <span className="t-sym"> $ </span>
              <span className="t-cmd">cat ./status.md</span>
            </TermLine>
            <TermOut delay={920}>
              Building in public.{'\n'}
              Este sitio es el portfolio. El proceso es el argumento.{'\n'}
              <Link href="/now" className="t-link">/now</Link> para el estado actual.
            </TermOut>

            <div className="t-cursor-row" aria-hidden="true">
              <span className="t-prompt">~</span>
              <span className="t-sym"> $ </span>
              <span className="t-cursor">█</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

function TermLine({
  delay,
  children,
}: {
  delay: number
  children: React.ReactNode
}) {
  return (
    <div className="t-line" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function TermOut({
  delay,
  children,
}: {
  delay: number
  children: React.ReactNode
}) {
  return (
    <div className="t-out" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// REBEL — Bebas Neue. Grid duro. Sin disculpas.
// ─────────────────────────────────────────────────────────────────────────────

function HeroRebel() {
  return (
    <section className="hero hero-rebel" aria-labelledby="hero-heading">

      {/* Name block — ocupa columna izquierda */}
      <div className="rebel-name-block">
        <h1 id="hero-heading" className="rebel-name">
          <span className="rebel-name-pablo">PABLO</span>
          <span className="rebel-name-bellver">BELLVER</span>
        </h1>
      </div>

      {/* Right column — role + statement */}
      <div className="rebel-right">
        <div className="rebel-role">
          <span style={{ textDecoration: 'line-through' }}>PRODUCT</span>
          <span style={{ textDecoration: 'line-through' }}>DESIGNER</span>
        </div>

        <div className="rebel-statement">
          <p>MORIARTI<br />RULES.</p>
        </div>
      </div>

      {/* CTA bar — full width bottom */}
      <div className="rebel-cta-bar">
        <Link href="/work"    className="rebel-btn">TRABAJO →</Link>
        <Link href="/now"     className="rebel-btn rebel-btn-outline">/NOW</Link>
        <span className="rebel-year" aria-hidden="true">© 2026</span>
      </div>

    </section>
  )
}
