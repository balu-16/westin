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
export type PageHeroPhoto = { alt: string; caption: string } & ({ stem: string; src?: never; srcSet?: never } | { src: string; srcSet?: string; stem?: never })

const heroMotifs: Record<HeroKind, Motif> = {
  about: 'college',
  partners: 'college',
  'why-westin': 'college',
  programs: 'programs',
  campus: 'campus',
  placements: 'career',
  news: 'stories',
  blog: 'stories',
  'campus-events': 'campus',
  gallery: 'campus',
  magazine: 'stories',
  testimonials: 'stories',
  'success-stories': 'career',
  admissions: 'contact',
  contact: 'contact',
  search: 'stories',
  'not-found': 'stories',
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
  photo,
}: {
  kind: HeroKind
  eyebrow: string
  title: string
  summary: string
  photo?: PageHeroPhoto
}) {
  const motif = heroMotifs[kind]
  const photoSrc = photo && ('stem' in photo && photo.stem ? `/images/official/campus/${photo.stem}-960.webp` : photo.src)
  const photoSrcSet = photo && ('stem' in photo && photo.stem
    ? `/images/official/campus/${photo.stem}-480.webp 480w, /images/official/campus/${photo.stem}-960.webp 960w`
    : photo.srcSet)
  return (
    <section className={`sk-page-hero${photo ? ' sk-page-hero-photographic' : ''}`} data-motif={motif}>
      <div className="sk-container sk-page-hero-grid">
        <div className="sk-page-hero-copy">
          <p className="sk-eyebrow"><span className="sk-small-line" aria-hidden="true" />{eyebrow}</p>
          <h1>{title}</h1>
          <p className="sk-page-hero-summary">{summary}</p>
          <p className="sk-page-hero-quote">Good people<br />make great places<span aria-hidden="true" /></p>
        </div>
        {photo ? <figure className="sk-page-hero-photo">
          <img src={photoSrc} srcSet={photoSrcSet} sizes="(min-width: 900px) 50vw, 100vw" width="960" height="640" loading="eager" fetchPriority="high" decoding="async" alt={photo.alt} />
          <figcaption className="sr-only">{photo.caption}</figcaption>
        </figure> : <div className="sk-page-hero-art">
          <div className="sk-page-paper" aria-hidden="true" />
          <CampusSketch id="westin-page-hero" />
          <HeroMotif motif={motif} />
        </div>}
      </div>
    </section>
  )
}
