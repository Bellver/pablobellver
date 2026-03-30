'use client'

import Image from 'next/image'
import { useTheme } from '@pablobellver/design-system'

export function HeroImage() {
  const { theme } = useTheme()

  if (theme !== 'rebel') return null

  return (
    <div className="rebel-hero-image">
      {/* h1 oculto para accesibilidad — la imagen sustituye al bloque de nombre */}
      <h1 id="hero-heading" className="sr-only">Pablo Bellver</h1>
      <Image
        src="/images/home/rebel/hero-pablux.png"
        alt="PABLUX"
        width={2449}
        height={962}
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{
          width: '100%',
          height: 'auto',
          filter: 'var(--image-filter)',
        }}
      />
    </div>
  )
}
