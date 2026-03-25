import { HeroSection }     from '@/components/home/HeroSection'
import {
  AboutSection,
  NowTeaser,
  PlaygroundTeaser,
  WorkSection,
  WritingTeaser,
} from '@/components/home/Sections'

// Todas las secciones son Server Components excepto HeroSection (Client)
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WorkSection />
      <AboutSection />
      <NowTeaser />
      <WritingTeaser />
      <PlaygroundTeaser />
    </>
  )
}