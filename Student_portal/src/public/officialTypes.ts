/**
 * Shared shapes for the official Westin content migrated from
 * https://www.westincollegevijayawada.com/ (see officialSite.ts).
 *
 * Images are referenced by a media key such as "people/founder-k-durga-prasad".
 * The optimised files live at `/images/official/<key>-480.webp`, `-960.webp`
 * (and `-1600.webp` when the manifest marks `xl`). Dimensions come from
 * officialMedia.generated.json, produced by scripts/fetch-official-media.mjs.
 */

export type MediaKey = string

export interface Pic {
  key: MediaKey
  alt: string
  /** Optional CSS object-position, e.g. "50% 20%". */
  position?: string
}

export interface Person {
  id: string
  name: string
  role: string
  image: Pic
  /** Short heading shown above a quote, e.g. "Knowledge Beyond Boundaries". */
  heading?: string
  quote?: string
  /** Extra line such as a workplace or home town. */
  detail?: string
  /** Official page this person or statement was taken from. */
  source?: string
}

export interface Stat {
  value: string
  label: string
  note?: string
}

/** A titled item with optional body text and/or bullet points. */
export interface Titled {
  title: string
  text?: string
  items?: readonly string[]
  /** Official page this block was taken from. */
  source?: string
}

export interface ProgrammeStage {
  /** e.g. "Year 1", "Phase 2 · next 3 months", "Step 4". */
  label: string
  title: string
  text: string
}

export interface EligibilityGroup {
  /** e.g. "Educational qualification", "Minimum marks", "Age limit", "Medical fitness". */
  label: string
  items: string[]
}

export type SchoolId = 'hospitality' | 'business' | 'junior'

export interface Programme {
  /** Matches an existing /programs/<slug> page. */
  slug: string
  school: SchoolId
  /** Full name, e.g. "Bachelor of Hotel Management". */
  name: string
  /** Compact label for tabs/chips, e.g. "BHM · 3 years". */
  shortName: string
  duration: string
  /** e.g. "Degree", "Honours degree", "Diploma", "Postgraduate diploma". */
  award: string
  affiliation?: string
  /** The official page's sub-heading. */
  tagline: string
  image: Pic
  /** Overview / objective paragraphs. */
  overview: string[]
  stages: ProgrammeStage[]
  careerPathway?: string
  eligibility: EligibilityGroup[]
  /** Additional official sections: outcomes, objectives, internships, features, specialisations, fees… */
  sections?: Titled[]
  source: string
}

export interface ProgrammeGroup {
  id: SchoolId
  label: string
  /** School name as used by Westin, e.g. "Westin College of Hotel Management". */
  school: string
  intro: string
  source: string
}

export interface FaqGroup {
  id: string
  label: string
  source: string
  items: { q: string; a: string }[]
}

/** A photo album whose photos are listed in officialMedia.generated.json under `albumKey`. */
export interface Album {
  id: string
  title: string
  albumKey: string
  source: string
  cover?: Pic
  date?: string
  description?: string
}

export interface OfficialDoc {
  title: string
  href?: string
  note?: string
}

export interface HeroSlide {
  school: SchoolId
  title: string
  subtitle: string
  image: Pic
}

export interface CoverageExclusion {
  page: string
  item: string
  reason: string
}
