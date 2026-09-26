import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Compass,
  ConciergeBell,
  GraduationCap,
  MapPin,
  PenLine,
  Trees,
  UsersRound,
} from 'lucide-react'
import type { PublicPageKind } from './content'
import { CampusSketch } from './CampusSketch'

type HeroKind = PublicPageKind | 'search' | 'not-found'
type Motif = 'college' | 'programs' | 'campus' | 'career' | 'stories' | 'contact'

const heroDetails: Record<HeroKind, { motif: Motif; note: string }> = {
  about: { motif: 'college', note: 'Every beginning has a place.' },
  partners: { motif: 'college', note: 'Better paths, together.' },
  'why-westin': { motif: 'college', note: 'A place to become.' },
  programs: { motif: 'programs', note: 'More than one way forward.' },
  campus: { motif: 'campus', note: 'Find your people.' },
  placements: { motif: 'career', note: 'Every step counts.' },
  news: { motif: 'stories', note: 'Stories worth sharing.' },
  blog: { motif: 'stories', note: 'Keep your curiosity close.' },
  'campus-events': { motif: 'campus', note: 'The moments make the place.' },
  gallery: { motif: 'campus', note: 'Look a little closer.' },
  magazine: { motif: 'stories', note: 'Turn the page.' },
  testimonials: { motif: 'stories', note: 'Every voice has a story.' },
  'success-stories': { motif: 'career', note: 'Every path is personal.' },
  admissions: { motif: 'contact', note: 'Your next page starts here.' },
  contact: { motif: 'contact', note: 'Let’s start here.' },
  search: { motif: 'stories', note: 'See what you discover.' },
  'not-found': { motif: 'stories', note: 'Another page is waiting.' },
}

function HeroMotif({ motif }: { motif: Motif }) {
  if (motif === 'college') {
    return (
      <div className="sk-page-motif sk-page-motif-college" aria-hidden="true">
        <span className="sk-page-seal">W</span>
        <span className="sk-page-rule" />
      </div>
    )
  }

  if (motif === 'programs') {
    return (
      <div className="sk-page-motif sk-page-motif-programs" aria-hidden="true">
        <svg viewBox="0 0 390 190" fill="none">
          <path d="M14 172C104 172 94 97 190 97S276 23 373 23M190 97C270 97 278 166 374 166" stroke="currentColor" strokeWidth="2" strokeDasharray="6 7" />
        </svg>
        <span><BriefcaseBusiness size={24} /></span>
        <span><ConciergeBell size={24} /></span>
        <span><GraduationCap size={25} /></span>
      </div>
    )
  }

  if (motif === 'campus') {
    return (
      <div className="sk-page-motif sk-page-motif-campus" aria-hidden="true">
        <Trees size={62} strokeWidth={1.15} />
        <span className="sk-page-campus-path" />
        <UsersRound size={38} strokeWidth={1.25} />
      </div>
    )
  }

  if (motif === 'career') {
    return (
      <div className="sk-page-motif sk-page-motif-career" aria-hidden="true">
        <svg viewBox="0 0 370 190" fill="none">
          <path d="M17 159C77 161 59 73 136 92s104 80 149 25 35-84 68-90" stroke="currentColor" strokeWidth="2" />
          <circle cx="17" cy="159" r="6" fill="currentColor" />
          <circle cx="136" cy="92" r="7" fill="white" stroke="currentColor" strokeWidth="2" />
          <circle cx="285" cy="117" r="7" fill="white" stroke="currentColor" strokeWidth="2" />
        </svg>
        <Compass size={29} strokeWidth={1.4} />
        <ArrowUpRight size={30} strokeWidth={1.5} />
      </div>
    )
  }

  if (motif === 'contact') {
    return (
      <div className="sk-page-motif sk-page-motif-contact" aria-hidden="true">
        <svg viewBox="0 0 350 150" fill="none"><path d="M5 137C60 115 65 18 160 54s102 76 185-42" stroke="currentColor" strokeWidth="2" strokeDasharray="6 7" /></svg>
        <MapPin size={42} strokeWidth={1.3} />
      </div>
    )
  }

  return (
    <div className="sk-page-motif sk-page-motif-stories" aria-hidden="true">
      <span><BookOpen size={54} strokeWidth={1.25} /></span>
      <PenLine size={36} strokeWidth={1.25} />
    </div>
  )
}

export function PublicPageHero({
  kind,
  eyebrow,
  title,
  summary,
}: {
  kind: HeroKind
  eyebrow: string
  title: string
  summary: string
}) {
  const { motif, note } = heroDetails[kind]
  return (
    <section className="sk-page-hero" data-motif={motif}>
      <div className="sk-container sk-page-hero-grid">
        <div className="sk-page-hero-copy">
          <p className="sk-eyebrow"><span className="sk-small-line" aria-hidden="true" />{eyebrow}</p>
          <h1>{title}</h1>
          <p className="sk-page-hero-summary">{summary}</p>
        </div>
        <div className="sk-page-hero-art">
          <div className="sk-page-paper" aria-hidden="true" />
          <CampusSketch />
          <HeroMotif motif={motif} />
          <p className="sk-page-hero-note">{note}<span aria-hidden="true" /></p>
        </div>
      </div>
    </section>
  )
}
