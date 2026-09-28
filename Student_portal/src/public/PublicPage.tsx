import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  fixturePrograms, getFixturePage, otherStudyOptions, publicPageCopy, publicRecords, publicSections,
  routeCopy, type PublicPageKind, type PublicProgram, type PublicSection,
} from './content'
import { PageLoader } from '../components/Loading'
import type { PublishedContentEntry } from '../lib/publicApi'
import { PUBLIC_CONTENT_MODE, publicSnapshot, snapshotPublicPath, snapshotRoute, usePublishedEntry, usePublishedSite } from './usePublicContent'
import { publicFetch, publicSearchUrl } from '../lib/publicApi'
import { PublicPageHero, type PageHeroPhoto } from './PublicPageHero'
import { heroQuoteFor } from './heroQuotes'
import { EditorialNote } from './EditorialNote'
import { archivePath, findArchiveEntry, officialArchive, type OfficialArchiveEntry } from './officialArchive'
import { safePublicUrl } from './home-model'
import { OfficialDestinationContent } from './OfficialDestinationContent'
import { EditorialDestination, OfficialContentSection, moveCardLight, leaveCardLight } from './EditorialDestinations'
import { AdmissionsDestination, ContactDestination, PlacementsDestination } from './SecondaryDestinations'
import { PublicFaq } from './PublicFaq'
import './editorial-destinations.css'
import './editorial-secondary.css'

const wrap = 'mx-auto max-w-[1360px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20'
const card = 'rounded-[26px] border border-[#e3dacf] bg-white p-6 shadow-[0_12px_30px_rgba(62,52,34,.06)]'

function MovedContent({ path, programSlug }: { path: string; programSlug?: string }) {
  return <OfficialDestinationContent path={path} programSlug={programSlug} />
}

function contentText(content: Record<string, unknown>, key: string) {
  const value = content[key]
  return typeof value === 'string' ? value.trim() : ''
}

function SourceLink({ href, label = 'Original Westin record' }: { href: string; label?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#9c401b] underline decoration-[#d6b79b] underline-offset-4 hover:text-[#753115]">
    {label}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens a new tab)</span>
  </a>
}

const photo = (stem: string, alt: string, caption: string): PageHeroPhoto => ({ stem, alt, caption })

const routeHeroPhotos: Record<string, PageHeroPhoto> = {
  '/about': photo('about-hero', 'Westin hospitality students learning together', 'Learning with people at Westin'),
  '/about/mission-vision': photo('about-hero', 'Westin hospitality students learning together', 'Purpose in practice'),
  '/about/management': photo('students-group', 'Westin students listening during a learning session', 'People shaping the journey'),
  '/about/faculty': photo('faculty-excellence', 'Westin educators and students in a learning setting', 'Guidance that stays with you'),
  '/why-westin': photo('hm-learning', 'Westin hospitality student practising food preparation', 'Learning by doing'),
  '/partners': photo('success-team', 'Westin students and educators gathered together', 'Connections open doors'),
  '/partners/bineid': photo('success-team', 'Westin students and educators gathered together', 'Connections open doors'),
  '/programs': photo('hm-learning', 'Westin hospitality student practising food preparation', 'Ideas become skills through practice'),
  '/programs/bba': photo('bba-programme', 'Westin business students studying together', 'Explore your business path'),
  '/programs/bba-honours': photo('bba-leadership', 'Westin business students learning together', 'Ideas in action'),
  '/programs/hotel-management': photo('hm-learning', 'Westin hospitality student practising food preparation', 'Learn the craft of hospitality'),
  '/programs/bhm-three-year': photo('hm-programme-degree', 'Westin hospitality students taking part in practical learning', 'Practice makes possibilities'),
  '/programs/bhm-honours': photo('hm-programme-honours', 'Westin hospitality students learning together', 'Take your learning further'),
  '/programs/work-integrated-hotel-management': photo('hm-service-team', 'Westin hospitality students practising service together', 'Learn in the workplace'),
  '/programs/dhm-one-year': photo('hm-front-office', 'Westin hospitality students practising front office service', 'Build practical skills'),
  '/programs/food-production': photo('hm-learning', 'Westin hospitality student practising food preparation', 'Learn through practice'),
  '/programs/pgdhm': photo('hm-hospitality', 'Westin hospitality students in a practical learning setting', 'Build on what you know'),
  '/programs/intermediate': photo('junior-foundation', 'Westin junior college students learning together', 'A strong start'),
  '/campus': photo('campus-culture', 'Westin students collaborating around a laptop', 'A place to learn and belong'),
  '/campus/infrastructure': photo('hm-front-office', 'Westin hospitality students practising front office service', 'Spaces made for practice'),
  '/campus/events': photo('campus-culture', 'Westin students collaborating around a laptop', 'The moments make the place'),
  '/career-planner': photo('training-mock-interviews', 'Westin students attending a workplace learning session', 'Prepare for what comes next'),
  '/publishing-house': photo('bba-journeys', 'Westin students discussing work around a laptop', 'Stories start here'),
}

const kindHeroPhotos: Record<PublicPageKind, PageHeroPhoto> = {
  about: routeHeroPhotos['/about'],
  partners: routeHeroPhotos['/partners'],
  'why-westin': routeHeroPhotos['/why-westin'],
  programs: routeHeroPhotos['/programs'],
  campus: routeHeroPhotos['/campus'],
  placements: photo('success-hero', 'Westin hospitality students gathered around a table', 'Where preparation meets possibility'),
  news: photo('students-group', 'Westin students listening during a learning session', 'News from Westin'),
  blog: photo('bba-learning', 'Westin business students learning together', 'Ideas from Westin'),
  'campus-events': routeHeroPhotos['/campus/events'],
  gallery: routeHeroPhotos['/campus'],
  magazine: routeHeroPhotos['/publishing-house'],
  testimonials: photo('alumni-hero', 'Westin alumni gathered together', 'Voices from Westin'),
  'success-stories': photo('alumni-hero', 'Westin alumni gathered together', 'Paths beyond Westin'),
  admissions: photo('students-group', 'Westin students listening during a learning session', 'A new chapter starts with a conversation'),
  contact: photo('bba-journeys', 'Westin students discussing work around a laptop', 'Your next conversation starts here'),
}

function PageIntro({ kind, keyName, title, summary, heroPhoto }: { kind: PublicPageKind; keyName: string; title?: string; summary?: string; heroPhoto?: PageHeroPhoto }) {
  const copy = routeCopy[keyName] ?? publicPageCopy[kind]
  return <PublicPageHero kind={kind} eyebrow={copy.eyebrow} title={title || copy.title} summary={summary || copy.summary} quote={heroQuoteFor(keyName, title || copy.title)} photo={heroPhoto ?? routeHeroPhotos[keyName] ?? kindHeroPhotos[kind]} />
}

function SectionCards({ sections }: { sections: PublicSection[] }) {
  return <div className="ed-section-grid">
    {sections.map((section) => <article key={section.title} className="ed-section-card" onPointerMove={moveCardLight} onPointerLeave={leaveCardLight}>
      <h2>{section.title}</h2>
      <p>{section.body}</p>
        {section.points && <ul>{section.points.map((point) => <li key={point}><Check size={16} aria-hidden="true" />{point}</li>)}</ul>}
        <SourceLink href={section.source} />
    </article>)}
  </div>
}

function ProgramIndex({ entries }: { entries: PublishedContentEntry[] }) {
  const groups = [
    { name: 'Business', slug: 'business', description: 'Explore management, enterprise and the work behind strong decisions.', image: 'bba-programme', alt: 'Westin business students in a learning setting', note: 'Ideas into action.' },
    { name: 'Hospitality', slug: 'hospitality', description: 'Learn service, food, operations and the craft of welcoming people.', image: 'hm-service-team', alt: 'Westin hospitality students practising service together', note: 'Care is a craft.' },
    { name: 'Junior college', slug: 'junior', description: 'Build a foundation in commerce and management through MEC or CEC.', image: 'junior-life-1', alt: 'Westin junior college students participating in an activity', note: 'Start with possibility.' },
  ] as const
  return <div className="ed-programs">
    <section className="ed-shell ed-programs-intro" aria-labelledby="ed-programs-title">
      <p className="ed-kicker"><span className="ed-orange-rule" aria-hidden="true" />Our Programmes · three study directions</p>
      <div><h2 id="ed-programs-title">Find the course that feels like yours.</h2><p>Explore business degrees, hospitality degrees and diplomas, and MEC or CEC intermediate study. Each course page has its learning areas, entry details and a way to speak with the Vijayawada team.</p></div>
    </section>
    {groups.map((group) => <section key={group.slug} className="ed-shell ed-program-group" data-group={group.slug} aria-labelledby={`ed-program-${group.slug}`}>
      <div className="ed-program-group-heading"><div><p className="ed-kicker"><span className="ed-orange-rule" aria-hidden="true" />Study direction</p><h3 id={`ed-program-${group.slug}`}>{group.name}</h3></div><p>{group.description}</p></div>
      <div className="ed-program-grid">
        {fixturePrograms.filter((program) => program.group === group.name).map((program, index) => {
          const published = entries.find((entry) => entry.entryType === 'program' && entry.slug === program.slug)
          const cardImage = index === 0
            ? { stem: group.image, alt: group.alt }
            : program.slug === 'bba-honours'
              ? { stem: 'bba-programme-2', alt: 'Westin business student seated in a blue blazer' }
              : null
          return <article key={program.slug} className={`ed-program-card${index === 0 ? ' ed-program-card--feature' : ''}`} onPointerMove={moveCardLight} onPointerLeave={leaveCardLight}>
            {cardImage && <div className="ed-photo-frame"><img src={`/images/official/campus/${cardImage.stem}-960.webp`} srcSet={`/images/official/campus/${cardImage.stem}-480.webp 480w, /images/official/campus/${cardImage.stem}-960.webp 960w`} sizes="(min-width: 1100px) 45vw, 100vw" width="960" height="640" loading="lazy" decoding="async" alt={cardImage.alt} /></div>}
            <div className="ed-program-card-copy"><span className="ed-bento-label">{program.label}</span><h4>{published && contentText(published.content, 'title') || program.title}</h4><p>{published && contentText(published.content, 'summary') || program.summary}</p>
              <ul>{program.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
              {program.slug === 'bba-honours' && <div className="ed-program-year-plan"><h5>Four years at a glance</h5><dl>
                <div><dt>Year 1</dt><dd>Core business subjects.</dd></div>
                <div><dt>Year 2</dt><dd>Three-month internship and certifications.</dd></div>
                <div><dt>Year 3</dt><dd>Specialisation and six months of corporate training.</dd></div>
                <div><dt>Year 4</dt><dd>Research, innovation, leadership and a year-long project.</dd></div>
              </dl></div>}
              {index === 0 && <EditorialNote>{group.note}</EditorialNote>}
              <div className="ed-program-card-links"><Link to={'/programs/' + program.slug}>Explore course <ArrowRight size={17} aria-hidden="true" /></Link><a href={program.source} target="_blank" rel="noopener noreferrer">Original course record <span className="sr-only">(opens a new tab)</span></a></div>
            </div>
          </article>
        })}
      </div>
    </section>)}
    <section className="ed-shell ed-other-options" aria-labelledby="other-options-title"><div><p className="ed-kicker"><span className="ed-orange-rule" aria-hidden="true" />Also in Westin's guide</p><h2 id="other-options-title">Other study options.</h2><p>These options appear in Westin's undergraduate guide without full current admission details. Contact the college to discuss availability.</p></div>
      <div className="ed-other-options-grid">{otherStudyOptions.map((option) => <article key={option.title}><h3>{option.title}</h3><p>{option.detail}</p><a href={option.source} target="_blank" rel="noopener noreferrer">Read the guide <ArrowRight size={16} aria-hidden="true" /><span className="sr-only"> (opens a new tab)</span></a></article>)}</div>
      <Link className="ed-other-contact" to="/contact">Ask about an option <ArrowRight size={17} aria-hidden="true" /></Link>
    </section>
  </div>
}

function ProgramDetail({ program, published }: { program: PublicProgram; published?: PublishedContentEntry }) {
  const publishedBody = published ? contentText(published.content, 'body') : ''
  return <div className={wrap}>
    <Link to="/programs" className="inline-flex items-center gap-2 text-sm font-bold text-[#9c401b]">← All programs</Link>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.45fr_.8fr]">
      <article className={card}>
        <p className="sk-eyebrow">{program.label}</p>
        <h2 className="mt-4 text-[clamp(2rem,3vw,3.3rem)] font-bold leading-tight tracking-[-.05em] text-[#0d2e51]">{program.title}</h2>
        <p className="mt-5 text-base leading-8 text-[#40566a]">{program.detail}</p>
        {publishedBody && <p className="mt-5 whitespace-pre-line border-l-2 border-[#f2a159] pl-5 text-base leading-8 text-[#40566a]">{publishedBody}</p>}
        <h3 className="mt-9 text-xl font-bold text-[#0d2e51]">What you will explore</h3>
        <ul className="mt-4 grid gap-3 text-[15px] leading-7 text-[#40566a]">{program.learning.map((point) => <li key={point} className="flex gap-3"><Check size={17} className="mt-1 shrink-0 text-[#c14e13]" aria-hidden="true" />{point}</li>)}</ul>
        {program.related && <div className="mt-9 border-t border-[#e3dacf] pt-6">
          <h3 className="mb-3 text-lg font-bold text-[#0d2e51]">Related courses</h3>
          <div className="flex flex-wrap gap-2">{program.related.map((slug) => {
            const related = fixturePrograms.find((item) => item.slug === slug)
            return related ? <Link key={slug} to={'/programs/' + slug} className="rounded-full border border-[#d6c5b2] bg-[#f4efe6] px-4 py-2 text-sm font-semibold text-[#9c401b]">{related.label}</Link> : null
          })}</div>
        </div>}
      </article>
      <aside className="self-start rounded-[28px] border border-[#e3dacf] bg-[#f4efe6] p-6 sm:p-8">
        <p className="sk-eyebrow">At a glance</p>
        <ul className="mt-5 grid gap-3">{program.facts.map((fact) => <li key={fact} className="flex gap-3 border-b border-[#e3dacf] pb-3 text-sm font-semibold text-[#40566a] last:border-0"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#c14e13]" />{fact}</li>)}</ul>
        <h3 className="mt-7 text-lg font-bold text-[#0d2e51]">Entry listed by Westin</h3>
        <p className="mt-2 text-sm leading-7 text-[#40566a]">{program.entry}</p>
        <h3 className="mt-6 text-lg font-bold text-[#0d2e51]">Where it can lead</h3>
        <p className="mt-2 text-sm leading-7 text-[#40566a]">{program.outcomes}</p>
        <div className="mt-7"><SourceLink href={program.source} label="Original course record" /></div>
        <Link to="/admissions#visit" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#9c401b] px-5 text-sm font-bold text-white">Ask about this course <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </aside>
    </div>
  </div>
}

const collectionTypes: Partial<Record<PublicPageKind, string>> = {
  news: 'news', blog: 'blog', 'campus-events': 'event-story', gallery: 'gallery',
  magazine: 'magazine', testimonials: 'testimonial', 'success-stories': 'success-story',
}

type LocalRecord = OfficialArchiveEntry | (typeof publicRecords)[number]

function localRecordPath(record: LocalRecord) {
  if ('paragraphs' in record) return archivePath(record)
  if (record.kind === 'campus-events') return '/campus/events/' + record.id
  return '/' + record.kind + '/' + record.id
}

function findLocalRecord(pathname: string): LocalRecord | undefined {
  const archive = findArchiveEntry(pathname)
  if (archive) return archive
  return publicRecords.find((record) => localRecordPath(record) === pathname.replace(/\/+$/, ''))
}

/**
 * Renders the full, verbatim article body. The body data lives in its own
 * module and is loaded on demand, so the 29k words never enter the Home bundle.
 */
const ArticleBody = lazy(() =>
  import('./OfficialArticleBody').then((m) => ({ default: m.OfficialArticleBody })),
)

function LocalDetail({ record }: { record: LocalRecord }) {
  const paragraphs = 'paragraphs' in record ? record.paragraphs : [record.summary]
  const points = 'points' in record ? record.points : undefined
  const image = 'image' in record ? record.image : undefined
  const imageAlt = 'imageAlt' in record ? record.imageAlt : undefined
  // A blog article gets its complete original text, in our theme.
  const articleSlug = record.kind === 'blog' ? record.id : undefined
  const heroPhoto = image?.startsWith('/images/') ? { src: image, alt: imageAlt || record.title, caption: 'From the Westin archive' } as const : undefined
  return <><PageIntro kind={record.kind} keyName={localRecordPath(record)} title={record.title} summary={record.summary} heroPhoto={heroPhoto} />
    <div className={wrap}><article className="sk-archive-detail">
      <div className="sk-archive-detail-meta">{record.date && <span>{record.date}</span>}{record.context && <span>{record.context}</span>}</div>
      {image && <img src={image} width="900" height="600" loading="eager" alt={imageAlt || record.title} />}
      <div className="sk-archive-detail-copy">
        {articleSlug ? (
          <Suspense fallback={<p>{paragraphs.join(' ')}</p>}>
            <ArticleBody slug={articleSlug} />
          </Suspense>
        ) : (
          <>
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {points?.length ? <ul>{points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
          </>
        )}
        <SourceLink href={record.source} label="View original Westin archive" />
        <Link to={record.kind === 'campus-events' ? '/campus/events' : '/' + record.kind} className="sk-text-link">Back to the collection <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
    </article></div>
    <MovedContent path={localRecordPath(record)} />
  </>
}

function RecordGrid({ kind, entries }: { kind: PublicPageKind; entries: PublishedContentEntry[] }) {
  const archiveRecords = officialArchive.filter((record) => record.kind === kind)
  const archiveSources = new Set(archiveRecords.map((record) => record.source))
  const archiveIds = new Set(archiveRecords.map((record) => record.id))
  const sourceRecords: LocalRecord[] = [...archiveRecords, ...publicRecords.filter((record) => record.kind === kind && !archiveSources.has(record.source) && !archiveIds.has(record.id))]
  const published = entries.filter((entry) => entry.entryType === collectionTypes[kind] && typeof entry.content?.title === 'string')
  const names = new Set(published.map((entry) => contentText(entry.content, 'title').toLowerCase()))
  const sourceUrls = new Set(published.map((entry) => contentText(entry.content, 'sourceUrl')).filter(Boolean))
  return <div className={wrap}>
    <p className="mb-8 max-w-3xl text-base leading-8 text-[#40566a]">Explore our college archive. Dates and campus context are shown where the original record provides them; new published stories appear alongside earlier material.</p>
    {kind === 'magazine' && <Link to="/publishing-house" className="sk-text-link mb-8">Explore Westin Publishing House <ArrowRight size={17} aria-hidden="true" /></Link>}
    <div className="ed-record-grid">
      {published.map((entry) => <article key={entry.id || entry.slug} className="ed-record-card flex flex-col p-6" onPointerMove={moveCardLight} onPointerLeave={leaveCardLight}>
        <p className="text-xs font-bold uppercase tracking-[.15em] text-[#9c401b]">Published by Westin</p>
        <h2 className="mt-4 text-2xl font-bold tracking-[-.04em] text-[#0d2e51]">{contentText(entry.content, 'title')}</h2>
        <p className="mt-3 flex-1 text-sm leading-7 text-[#40566a]">{contentText(entry.content, 'summary')}</p>
        <Link to={publicEntryPath(entry)} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#9c401b]">Read story <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </article>)}
      {sourceRecords.filter((record) => !names.has(record.title.toLowerCase()) && !sourceUrls.has(record.source) && !published.some((entry) => entry.slug === record.id)).map((record) => {
        const image = 'image' in record && typeof record.image === 'string' ? record.image : ''
        const imageAlt = 'imageAlt' in record && typeof record.imageAlt === 'string' ? record.imageAlt : record.title
        const label = 'label' in record && typeof record.label === 'string' ? record.label : record.kind === 'campus-events' ? 'Campus event' : 'Westin archive'
        return <article key={record.id} className="ed-record-card flex flex-col overflow-hidden p-6" onPointerMove={moveCardLight} onPointerLeave={leaveCardLight}>
          {image ? <div className="ed-photo-frame"><img className="sk-archive-thumb" src={image} width="600" height="400" loading="lazy" alt={imageAlt} /></div> : null}
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[#9c401b]">{label}</p>
          <h2 className="mt-4 text-2xl font-bold tracking-[-.04em] text-[#0d2e51]">{record.title}</h2>
          <p className="mt-3 flex-1 text-sm leading-7 text-[#40566a]">{record.summary}</p>
          {(record.date || record.context) && <p className="mt-4 text-xs font-semibold text-[#526477]">{[record.date, record.context].filter(Boolean).join(' · ')}</p>}
          {kind === 'magazine' ? <div className="mt-5"><SourceLink href={record.source} label="Open publication" /></div> : <Link to={localRecordPath(record)} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#9c401b]">Explore record <ArrowRight size={17} aria-hidden="true" /></Link>}
        </article>
      })}
    </div>
  </div>
}

function GalleryCollection({ entries }: { entries: PublishedContentEntry[] }) {
  const events = officialArchive.filter((record) => record.kind === 'campus-events' && record.image)
  const published = entries.filter((entry) => entry.entryType === 'gallery' && contentText(entry.content, 'title'))
  return <div className={wrap}>
    <div className="sk-gallery-feature">
      <div className="ed-photo-frame ed-photo-frame--left"><img src="/images/official/hospitality-practice.webp" width="1200" height="800" loading="eager" alt="Westin students practising food production together" /><span className="ed-photo-frame-caption">Learning in action</span></div>
      <div><p className="sk-eyebrow">Learning in action</p><h2>Practice, people and shared moments.</h2><p>Browse photographs published in Westin’s event galleries. Open a collection to see its source and the context supplied by the college.</p><EditorialNote className="ed-card-note--paired">Every moment tells a story.</EditorialNote></div>
    </div>
    <div className="sk-gallery-grid">{published.map((entry) => <Link key={entry.id} to={publicEntryPath(entry)}>
      {safePublicUrl(entry.media?.[0]?.url) && <span className="ed-photo-frame"><img src={safePublicUrl(entry.media[0].url)} width="600" height="400" loading="lazy" alt={entry.media[0].altText || contentText(entry.content, 'title')} /></span>}
      <span className="ed-gallery-card-title">{contentText(entry.content, 'title')}</span>
    </Link>)}{events.map((event) => <Link key={event.id} to={archivePath(event)}>
      <span className="ed-photo-frame"><img src={event.image} width="600" height="400" loading="lazy" alt={event.imageAlt || event.title} /></span>
      <span className="ed-gallery-card-title">{event.title}</span>
    </Link>)}</div>
  </div>
}

const relatedLinks: Record<string, Array<[string, string]>> = {
  '/about': [['Mission & vision', '/about/mission-vision'], ['People at Westin', '/about/management'], ['Faculty', '/about/faculty'], ['Why Westin', '/why-westin']],
  '/why-westin': [['Explore courses', '/programs'], ['Campus life', '/campus'], ['Career planning', '/career-planner']],
  '/partners': [['BIN EID profile', '/partners/bineid'], ['Career planning', '/career-planner']],
  '/campus': [['Learning spaces', '/campus/infrastructure'], ['Campus events', '/campus/events'], ['Gallery', '/gallery']],
  '/placements': [['Career planner', '/career-planner'], ['Explore courses', '/programs']],
}

function EditorialPage({ kind, keyName, entries, published }: { kind: PublicPageKind; keyName: string; entries: PublishedContentEntry[]; published?: PublishedContentEntry }) {
  const sections = publicSections[keyName]
  const copy = routeCopy[keyName] ?? publicPageCopy[kind]
  const publishedTitle = published && contentText(published.content, 'title')
  const publishedSummary = published && contentText(published.content, 'summary')
  const publishedBody = published && contentText(published.content, 'body')
  if (keyName === '/placements' && sections) return <PlacementsDestination sections={sections} title={publishedTitle || undefined} summary={publishedSummary || undefined} publishedBody={publishedBody || undefined} />
  if ((keyName === '/about' || keyName === '/campus') && sections) return <>
    <PageIntro kind={kind} keyName={keyName} title={publishedTitle || undefined} summary={publishedSummary || undefined} />
    <EditorialDestination kind={keyName === '/about' ? 'about' : 'campus'} sections={sections} publishedBody={publishedBody || undefined}>
      <MovedContent path={keyName} />
    </EditorialDestination>
  </>
  return <>
    <PageIntro kind={kind} keyName={keyName} title={publishedTitle || undefined} summary={publishedSummary || undefined} />
    {sections ? <><div className={wrap}>
      <div className="mb-9 max-w-3xl"><p className="sk-eyebrow">Inside {copy.eyebrow.toLowerCase()}</p><p className="mt-3 text-base leading-8 text-[#40566a]">{copy.summary}</p></div>
      {keyName === '/why-westin' && <div className="sk-editorial-photo"><div className="ed-photo-frame ed-photo-frame--left"><img src="/images/official/westin-students.webp" width="1200" height="800" loading="lazy" alt="Westin students and educators together at a hospitality venue" /><span className="ed-photo-frame-caption">Why Westin</span></div><div><span>Westin College · Vijayawada</span><p>A community shaped by learning, ambition and opportunity.</p><EditorialNote className="ed-card-note--paired">Purpose in practice.</EditorialNote></div></div>}
      <SectionCards sections={sections} />
      {publishedBody && <article className={card + ' mt-6 max-w-4xl'}><h2 className="text-2xl font-bold text-[#0d2e51]">More from Westin</h2><p className="mt-4 whitespace-pre-line text-base leading-8 text-[#40566a]">{publishedBody}</p></article>}
      {(relatedLinks[keyName] || []).length > 0 && <nav aria-label="Explore related pages" className="mt-10 flex flex-wrap gap-3">{relatedLinks[keyName].map(([label, href]) => <Link key={href} to={href} className="inline-flex items-center gap-2 rounded-full border border-[#d6c5b2] bg-white px-5 py-3 text-sm font-bold text-[#9c401b]">{label}<ArrowRight size={16} aria-hidden="true" /></Link>)}</nav>}
    </div><MovedContent path={keyName} /></> : kind === 'gallery' ? <GalleryCollection entries={entries} /> : <><RecordGrid kind={kind} entries={entries} />{(keyName === '/campus/events' || keyName === '/success-stories') && <MovedContent path={keyName} />}</>}
  </>
}

function PublishedDetail({ entry, kind, keyName }: { entry: PublishedContentEntry; kind: PublicPageKind; keyName: string }) {
  const content = entry.content
  const bullets = Array.isArray(content.bullets) ? content.bullets.filter((item): item is string => typeof item === 'string') : []
  const media = entry.media?.[0]
  const localImage = media && safePublicUrl(media.url)
  const heroPhoto = localImage?.startsWith('/images/') ? { src: localImage, alt: media.altText || contentText(content, 'title') || entry.slug, caption: 'From Westin' } as const : undefined
  return <><PageIntro kind={kind} keyName={keyName} title={contentText(content, 'title') || entry.slug} summary={contentText(content, 'summary')} heroPhoto={heroPhoto} />
    <div className={wrap}><article className={card + ' max-w-4xl'}>
      <p className="sk-eyebrow">{contentText(content, 'eyebrow') || publicPageCopy[kind].eyebrow}</p>
      <p className="mt-5 whitespace-pre-line text-base leading-8 text-[#40566a]">{contentText(content, 'body')}</p>
      {bullets.length > 0 && <ul className="mt-6 grid gap-2 text-sm text-[#40566a]">{bullets.map((item) => <li key={item} className="border-l-2 border-[#f2a159] pl-3">{item}</li>)}</ul>}
      <Link to={kind === 'campus-events' ? '/campus/events' : '/' + kind} className="sk-text-link mt-8">Back to the collection <ArrowRight size={17} aria-hidden="true" /></Link>
    </article></div>
  </>
}

function dynamicTarget(pathname: string) {
  const routes: Array<[string, string]> = [
    ['/news/', 'news'], ['/blog/', 'blog'], ['/campus/events/', 'event-story'],
    ['/gallery/', 'gallery'], ['/magazine/', 'magazine'],
    ['/testimonials/', 'testimonial'], ['/success-stories/', 'success-story'],
  ]
  const match = routes.find(([prefix]) => pathname.startsWith(prefix))
  return match ? { type: match[1], slug: pathname.slice(match[0].length) } : null
}

export function PublicPage() {
  const { pathname } = useLocation()
  const page = getFixturePage(pathname)
  const collectionDetail = dynamicTarget(pathname)
  const site = usePublishedSite(PUBLIC_CONTENT_MODE === 'api' && page?.kind !== 'contact' && page?.kind !== 'admissions')
  const detail = usePublishedEntry(PUBLIC_CONTENT_MODE === 'api' && collectionDetail ? collectionDetail.type : null, collectionDetail?.slug ?? null)
  if (!page) return <NotFound />
  if (page.kind === 'contact') return <ContactDestination />
  if (page.kind === 'admissions') return <AdmissionsDestination />
  if (collectionDetail) {
    const local = findLocalRecord(pathname)
    const publishedDetail = detail.data ?? snapshotRoute(pathname)
    if (publishedDetail) return <PublishedDetail entry={publishedDetail} kind={page.kind} keyName={page.key} />
    if (local) return <LocalDetail record={local} />
    if (PUBLIC_CONTENT_MODE !== 'api') return <NotFound />
    if (detail.loading) return <><PageIntro kind={page.kind} keyName={page.key} /><PageLoader label="Opening published story" className="min-h-[40vh]" /></>
    if (detail.error || !detail.data) return <NotFound />
    return <PublishedDetail entry={detail.data} kind={page.kind} keyName={page.key} />
  }
  const entries = Array.isArray(site.data?.entries)
    ? site.data.entries.filter((entry): entry is PublishedContentEntry =>
        !!entry && typeof entry === 'object' && typeof entry.entryType === 'string' &&
        typeof entry.slug === 'string' && !!entry.content &&
        typeof entry.content === 'object' && !Array.isArray(entry.content))
    : []
  const slug = page.program?.slug ?? page.key.slice(1).split('/').join('-')
  const entryType = page.program ? 'program' : 'page'
  const published = entries.find((entry) => entry.entryType === entryType && entry.slug === slug)
  if (page.program) return <div data-public-fixture={PUBLIC_CONTENT_MODE === 'fixture' ? 'true' : undefined}>
    <PageIntro kind="programs" keyName={page.key} title={published && contentText(published.content, 'title') || page.program.title} summary={published && contentText(published.content, 'summary') || page.program.summary} />
    <ProgramDetail program={page.program} published={published} />
    <MovedContent path={page.key} programSlug={page.program.slug} />
  </div>
  if (page.kind === 'programs') return <div data-public-fixture={PUBLIC_CONTENT_MODE === 'fixture' ? 'true' : undefined}><PageIntro kind="programs" keyName={page.key} /><ProgramIndex entries={entries} /><OfficialContentSection kind="programs" title="The ideas behind each school." intro="Explore Westin’s published campaign lines and photographs across hospitality, business, junior college and publishing."><MovedContent path={page.key} /></OfficialContentSection><PublicFaq route="/programs" /></div>
  return <div data-public-fixture={PUBLIC_CONTENT_MODE === 'fixture' ? 'true' : undefined}><EditorialPage kind={page.kind} keyName={page.key} entries={entries} published={published} /></div>
}

export function PublicSearch() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [result, setResult] = useState<{ items: PublishedContentEntry[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const localResults = useMemo(() => {
    const term = submitted.toLocaleLowerCase().trim()
    if (!term) return []
    const items = [
      ...fixturePrograms.map((item) => ({ title: item.title, summary: item.summary + ' ' + item.detail, href: '/programs/' + item.slug, kind: 'Program' })),
      ...Object.entries(publicSections).map(([href, sections]) => ({ title: (routeCopy[href] ?? publicPageCopy[getFixturePage(href)?.kind ?? 'about']).title, summary: sections.map((section) => section.title + ' ' + section.body).join(' '), href, kind: 'College page' })),
      ...officialArchive.map((item) => ({ title: item.title, summary: item.summary + ' ' + item.paragraphs.join(' '), href: archivePath(item), kind: item.kind === 'campus-events' ? 'Event' : 'Article' })),
      ...publicRecords.map((item) => ({ title: item.title, summary: item.summary, href: item.kind === 'magazine' ? item.source : localRecordPath(item), kind: item.kind === 'magazine' ? 'Publication' : 'College record' })),
      ...publicSnapshot.entries.flatMap((item) => {
        const href = snapshotPublicPath(item)
        return href ? [{ title: contentText(item.content, 'title') || item.slug, summary: contentText(item.content, 'summary') + ' ' + contentText(item.content, 'body'), href, kind: 'Published story' }] : []
      }),
    ]
    const seen = new Set<string>()
    return items.filter((item) => {
      if (!(`${item.title} ${item.summary}`).toLocaleLowerCase().includes(term) || seen.has(item.href)) return false
      seen.add(item.href)
      return true
    }).slice(0, 80)
  }, [submitted])

  useEffect(() => {
    setResult(null)
    if (PUBLIC_CONTENT_MODE !== 'api' || !submitted) return
    let cancelled = false
    setLoading(true)
    setError(null)
    publicFetch<{ items: PublishedContentEntry[] }>(publicSearchUrl(submitted))
      .then((data) => {
        if (!cancelled) setResult(data)
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : 'Search could not be completed.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [submitted])

  return (
    <>
      <PublicPageHero kind="search" eyebrow="Explore Westin" title="Find what you need." summary="Search programs, college information, articles, events and publications." quote={heroQuoteFor('/search', 'Find what you need.')} photo={photo('bba-learning', 'Westin business students learning together', 'Find your next direction')} />
      <div data-public-fixture={PUBLIC_CONTENT_MODE === 'fixture' ? 'true' : undefined} className="mx-auto max-w-[1360px] px-5 py-14 sm:px-8 lg:px-12 lg:py-24">
        <form onSubmit={(event) => { event.preventDefault(); setSubmitted(query.trim()) }} className="mx-auto flex max-w-3xl gap-2 rounded-2xl border border-[#e3dacf] bg-white p-2 shadow-[0_10px_30px_rgba(62,52,34,.06)]">
          <label htmlFor="public-search" className="sr-only">Search published content</label>
          <input id="public-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search programs, stories, and campus life" className="min-h-12 min-w-0 flex-1 rounded-xl bg-[#fbfaf7] px-4 text-base text-[#0d2e51] outline-none ring-[#c14e13] placeholder:text-[#6b746f] focus:ring-2" />
          <button type="submit" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#9c401b] px-4 text-sm font-bold text-white"><Search size={16} aria-hidden="true" />Search</button>
        </form>
        {!submitted ? <div className="mt-8 rounded-[28px] border border-[#e3dacf] bg-white p-8 text-center"><CalendarDays size={28} className="mx-auto text-[#9c401b]" aria-hidden="true" /><p className="mt-4 text-sm leading-7 text-[#526477]">Try “BBA”, “internship”, “student life” or “hospitality”.</p></div> : <div className="mt-8 grid gap-4">
            {localResults.map((item) => item.href.startsWith('http') ? <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="rounded-[24px] border border-[#e3dacf] bg-white p-6 transition hover:border-[#c14e13]"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9c401b]">{item.kind}</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#0d2e51]">{item.title}</h2><p className="mt-2 text-sm leading-7 text-[#526477]">{item.summary}</p></a> : <Link key={item.href} to={item.href} className="rounded-[24px] border border-[#e3dacf] bg-white p-6 transition hover:border-[#c14e13]"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9c401b]">{item.kind}</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#0d2e51]">{item.title}</h2><p className="mt-2 text-sm leading-7 text-[#526477]">{item.summary.slice(0, 200)}</p></Link>)}
            {loading && <p className="text-sm text-[#526477]">Checking newly published stories…</p>}
            {error && <p className="text-sm text-[#526477]">Newly published stories are temporarily unavailable. College pages and archive results remain searchable.</p>}
            {result?.items.filter((entry) => !localResults.some((item) => item.href === publicEntryPath(entry) || item.title.toLowerCase() === contentText(entry.content, 'title').toLowerCase())).length ? result.items.filter((entry) => !localResults.some((item) => item.href === publicEntryPath(entry) || item.title.toLowerCase() === contentText(entry.content, 'title').toLowerCase())).map((entry) => (
              <Link key={entry.id} to={publicEntryPath(entry)} className="rounded-[24px] border border-[#e3dacf] bg-white p-6 transition hover:border-[#c14e13]">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9c401b]">{entry.entryType}</p>
                <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#0d2e51]">{contentText(entry.content, 'title') || entry.slug}</h2>
                <p className="mt-2 text-sm leading-7 text-[#526477]">{contentText(entry.content, 'summary')}</p>
              </Link>
            )) : null}
            {!localResults.length && !result?.items.length && !loading && <div className="rounded-[28px] border border-dashed border-[#e3dacf] p-10 text-center text-sm text-[#526477]">No pages matched that search.</div>}
          </div>}
      </div>
    </>
  )
}

function publicEntryPath(entry: PublishedContentEntry) {
  if (entry.entryType === 'program') return '/programs/' + entry.slug
  if (entry.entryType === 'news' || entry.entryType === 'blog') return '/' + entry.entryType + '/' + entry.slug
  if (entry.entryType === 'event-story') return '/campus/events/' + entry.slug
  if (entry.entryType === 'gallery') return '/gallery/' + entry.slug
  if (entry.entryType === 'magazine') return '/magazine/' + entry.slug
  if (entry.entryType === 'testimonial') return '/testimonials/' + entry.slug
  if (entry.entryType === 'success-story') return '/success-stories/' + entry.slug
  return '/' + entry.slug
}

export function NotFound() {
  return (
    <>
      <PublicPageHero kind="not-found" eyebrow="Page not found" title="That page has turned." summary="Try the homepage or explore the programs currently available." quote="There is always a way back." photo={photo('about-hero', 'Westin hospitality students learning together', 'Find your way back')} />
      <div className="sk-container sk-not-found-action">
        <Link to="/" className="sk-button">Back to Westin <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </>
  )
}
