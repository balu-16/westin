import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  fixturePrograms, getFixturePage, publicPageCopy, publicRecords, publicSections,
  routeCopy, type PublicPageKind, type PublicProgram, type PublicSection,
} from './content'
import { ErrorState } from '../components/ErrorState'
import { PageLoader } from '../components/Loading'
import type { PublishedContentEntry } from '../lib/publicApi'
import { PUBLIC_CONTENT_MODE, usePublishedEntry, usePublishedSite } from './usePublicContent'
import { publicFetch, publicSearchUrl } from '../lib/publicApi'
import { ContactHandoff } from './ContactHandoff'
import { PublicPageHero } from './PublicPageHero'

const wrap = 'mx-auto max-w-[1360px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20'
const card = 'rounded-[26px] border border-[#cce7f7] bg-white p-6 shadow-[0_12px_30px_rgba(27,96,133,.06)]'

function contentText(content: Record<string, unknown>, key: string) {
  const value = content[key]
  return typeof value === 'string' ? value.trim() : ''
}

function SourceLink({ href, label = 'Read on Westin’s official site' }: { href: string; label?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-[#1468aa] underline decoration-[#9fcde8] underline-offset-4 hover:text-[#0c4c80]">
    {label}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens a new tab)</span>
  </a>
}

function PageIntro({ kind, keyName, title, summary }: { kind: PublicPageKind; keyName: string; title?: string; summary?: string }) {
  const copy = routeCopy[keyName] ?? publicPageCopy[kind]
  return <PublicPageHero kind={kind} eyebrow={copy.eyebrow} title={title || copy.title} summary={summary || copy.summary} />
}

function SectionCards({ sections }: { sections: PublicSection[] }) {
  return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
    {sections.map((section) => <article key={section.title} className={card}>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf6ff] text-[#1468aa]"><Check size={20} aria-hidden="true" /></span>
      <h2 className="mt-5 text-[clamp(1.45rem,2vw,2rem)] font-bold leading-tight tracking-[-0.04em] text-[#142d46]">{section.title}</h2>
      <p className="mt-4 text-[15px] leading-7 text-[#42647a]">{section.body}</p>
      {section.points && <ul className="mt-5 grid gap-2 text-sm leading-6 text-[#325d77]">{section.points.map((point) => <li key={point} className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-[#1688ba]" aria-hidden="true" />{point}</li>)}</ul>}
      <div className="mt-6"><SourceLink href={section.source} /></div>
    </article>)}
  </div>
}

function ProgramIndex({ entries }: { entries: PublishedContentEntry[] }) {
  return <div className={wrap}>
    <div className="mb-10 max-w-[750px]">
      <p className="sk-eyebrow">Three study directions · more ways to begin</p>
      <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-[#142d46] sm:text-4xl">Choose the route that fits your curiosity.</h2>
      <p className="mt-4 text-base leading-7 text-[#42647a]">Westin lists business degrees, hospitality degrees and diplomas, and MEC/CEC intermediate study. Each course page below brings together its learning areas, entry details and the original college source.</p>
    </div>
    {(['Business', 'Hospitality', 'Junior college'] as const).map((group) => <section key={group} className="mb-14 last:mb-0" aria-label={group + ' courses'}>
      <h3 className="mb-5 border-b border-[#cce7f7] pb-3 text-xl font-bold text-[#142d46]">{group}</h3>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {fixturePrograms.filter((program) => program.group === group).map((program) => {
          const published = entries.find((entry) => entry.entryType === 'program' && entry.slug === program.slug)
          return <article key={program.slug} className={card + ' flex flex-col'}>
          <span className="text-xs font-bold uppercase tracking-[.15em] text-[#35728f]">{program.label}</span>
          <h4 className="mt-4 text-2xl font-bold leading-tight tracking-[-0.04em] text-[#142d46]">{published && contentText(published.content, 'title') || program.title}</h4>
          <p className="mt-4 flex-1 text-sm leading-7 text-[#42647a]">{published && contentText(published.content, 'summary') || program.summary}</p>
          <ul className="mt-5 grid gap-2 text-sm text-[#325d77]">{program.facts.map((fact) => <li key={fact} className="flex gap-2"><Check size={15} className="mt-1 shrink-0 text-[#3ba7f2]" aria-hidden="true" />{fact}</li>)}</ul>
          <Link to={'/programs/' + program.slug} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#1468aa]">Explore course <ArrowRight size={17} aria-hidden="true" /></Link>
        </article>})}
      </div>
    </section>)}
  </div>
}

function ProgramDetail({ program, published }: { program: PublicProgram; published?: PublishedContentEntry }) {
  const publishedBody = published ? contentText(published.content, 'body') : ''
  return <div className={wrap}>
    <Link to="/programs" className="inline-flex items-center gap-2 text-sm font-bold text-[#1468aa]">← All programs</Link>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.45fr_.8fr]">
      <article className={card}>
        <p className="sk-eyebrow">{program.label}</p>
        <h2 className="mt-4 text-[clamp(2rem,3vw,3.3rem)] font-bold leading-tight tracking-[-.05em] text-[#142d46]">{program.title}</h2>
        <p className="mt-5 text-base leading-8 text-[#42647a]">{program.detail}</p>
        {publishedBody && <p className="mt-5 whitespace-pre-line border-l-2 border-[#f2a159] pl-5 text-base leading-8 text-[#42647a]">{publishedBody}</p>}
        <h3 className="mt-9 text-xl font-bold text-[#142d46]">What you will explore</h3>
        <ul className="mt-4 grid gap-3 text-[15px] leading-7 text-[#42647a]">{program.learning.map((point) => <li key={point} className="flex gap-3"><Check size={17} className="mt-1 shrink-0 text-[#1688ba]" aria-hidden="true" />{point}</li>)}</ul>
        {program.related && <div className="mt-9 border-t border-[#d8eaf3] pt-6">
          <h3 className="mb-3 text-lg font-bold text-[#142d46]">Related courses</h3>
          <div className="flex flex-wrap gap-2">{program.related.map((slug) => {
            const related = fixturePrograms.find((item) => item.slug === slug)
            return related ? <Link key={slug} to={'/programs/' + slug} className="rounded-full border border-[#afd5e8] bg-[#f3faff] px-4 py-2 text-sm font-semibold text-[#1468aa]">{related.label}</Link> : null
          })}</div>
        </div>}
      </article>
      <aside className="self-start rounded-[28px] border border-[#cce7f7] bg-[#eaf6ff] p-6 sm:p-8">
        <p className="sk-eyebrow">At a glance</p>
        <ul className="mt-5 grid gap-3">{program.facts.map((fact) => <li key={fact} className="flex gap-3 border-b border-[#c5e1ef] pb-3 text-sm font-semibold text-[#325d77] last:border-0"><span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: program.color }} />{fact}</li>)}</ul>
        <h3 className="mt-7 text-lg font-bold text-[#142d46]">Entry listed by Westin</h3>
        <p className="mt-2 text-sm leading-7 text-[#42647a]">{program.entry}</p>
        <h3 className="mt-6 text-lg font-bold text-[#142d46]">Where it can lead</h3>
        <p className="mt-2 text-sm leading-7 text-[#42647a]">{program.outcomes}</p>
        <div className="mt-7"><SourceLink href={program.source} label="View college course page" /></div>
        <Link to="/admissions#visit" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1468aa] px-5 text-sm font-bold text-white">Ask about this course <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </aside>
    </div>
  </div>
}

const collectionTypes: Partial<Record<PublicPageKind, string>> = {
  news: 'news', blog: 'blog', 'campus-events': 'event-story', gallery: 'gallery',
  magazine: 'magazine', testimonials: 'testimonial', 'success-stories': 'success-story',
}

function RecordGrid({ kind, entries }: { kind: PublicPageKind; entries: PublishedContentEntry[] }) {
  const sourceRecords = publicRecords.filter((record) => record.kind === kind)
  const published = entries.filter((entry) => entry.entryType === collectionTypes[kind] && typeof entry.content?.title === 'string')
  const names = new Set(published.map((entry) => contentText(entry.content, 'title').toLowerCase()))
  const sourceUrls = new Set(published.map((entry) => contentText(entry.content, 'sourceUrl')).filter(Boolean))
  const sourceCounts = new Map<string, number>()
  sourceRecords.forEach((record) => sourceCounts.set(record.source, (sourceCounts.get(record.source) ?? 0) + 1))
  return <div className={wrap}>
    <p className="mb-8 max-w-3xl text-base leading-8 text-[#42647a]">These records come from Westin’s official websites. Dates and campus context are shown where the source provides them. Newly published college entries appear here too.</p>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {published.map((entry) => <article key={entry.id || entry.slug} className={card + ' flex flex-col'}>
        <p className="text-xs font-bold uppercase tracking-[.15em] text-[#35728f]">Published by Westin</p>
        <h2 className="mt-4 text-2xl font-bold tracking-[-.04em] text-[#142d46]">{contentText(entry.content, 'title')}</h2>
        <p className="mt-3 flex-1 text-sm leading-7 text-[#42647a]">{contentText(entry.content, 'summary')}</p>
        <Link to={publicEntryPath(entry)} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1468aa]">Read story <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </article>)}
      {sourceRecords.filter((record) => !names.has(record.title.toLowerCase()) && !(sourceCounts.get(record.source) === 1 && sourceUrls.has(record.source))).map((record) => <article key={record.id} className={card + ' flex flex-col'}>
        <p className="text-xs font-bold uppercase tracking-[.15em] text-[#35728f]">{record.label}</p>
        <h2 className="mt-4 text-2xl font-bold tracking-[-.04em] text-[#142d46]">{record.title}</h2>
        <p className="mt-3 flex-1 text-sm leading-7 text-[#42647a]">{record.summary}</p>
        {(record.date || record.context) && <p className="mt-4 text-xs font-semibold text-[#557184]">{[record.date, record.context].filter(Boolean).join(' · ')}</p>}
        <div className="mt-5"><SourceLink href={record.source} label="Open official source" /></div>
      </article>)}
    </div>
  </div>
}

const relatedLinks: Record<string, Array<[string, string]>> = {
  '/about': [['Mission & vision', '/about/mission-vision'], ['People at Westin', '/about/management'], ['Why Westin', '/why-westin']],
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
  return <>
    <PageIntro kind={kind} keyName={keyName} title={publishedTitle || undefined} summary={publishedSummary || undefined} />
    {sections ? <div className={wrap}>
      <div className="mb-9 max-w-3xl"><p className="sk-eyebrow">Inside {copy.eyebrow.toLowerCase()}</p><p className="mt-3 text-base leading-8 text-[#42647a]">{copy.summary}</p></div>
      <SectionCards sections={sections} />
      {publishedBody && <article className={card + ' mt-6 max-w-4xl'}><h2 className="text-2xl font-bold text-[#142d46]">More from Westin</h2><p className="mt-4 whitespace-pre-line text-base leading-8 text-[#42647a]">{publishedBody}</p></article>}
      {(relatedLinks[keyName] || []).length > 0 && <nav aria-label="Explore related pages" className="mt-10 flex flex-wrap gap-3">{relatedLinks[keyName].map(([label, href]) => <Link key={href} to={href} className="inline-flex items-center gap-2 rounded-full border border-[#afd5e8] bg-white px-5 py-3 text-sm font-bold text-[#1468aa]">{label}<ArrowRight size={16} aria-hidden="true" /></Link>)}</nav>}
    </div> : <RecordGrid kind={kind} entries={entries} />}
  </>
}

function PublishedDetail({ entry, kind, keyName }: { entry: PublishedContentEntry; kind: PublicPageKind; keyName: string }) {
  const content = entry.content
  const bullets = Array.isArray(content.bullets) ? content.bullets.filter((item): item is string => typeof item === 'string') : []
  return <><PageIntro kind={kind} keyName={keyName} title={contentText(content, 'title') || entry.slug} summary={contentText(content, 'summary')} />
    <div className={wrap}><article className={card + ' max-w-4xl'}>
      <p className="sk-eyebrow">{contentText(content, 'eyebrow') || publicPageCopy[kind].eyebrow}</p>
      <p className="mt-5 whitespace-pre-line text-base leading-8 text-[#42647a]">{contentText(content, 'body')}</p>
      {bullets.length > 0 && <ul className="mt-6 grid gap-2 text-sm text-[#42647a]">{bullets.map((item) => <li key={item} className="border-l-2 border-[#f2a159] pl-3">{item}</li>)}</ul>}
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
  if (page.kind === 'contact' || page.kind === 'admissions') return <ContactHandoff visit={page.kind === 'admissions'} />
  if (collectionDetail) {
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
  </div>
  if (page.kind === 'programs') return <div data-public-fixture={PUBLIC_CONTENT_MODE === 'fixture' ? 'true' : undefined}><PageIntro kind="programs" keyName={page.key} /><ProgramIndex entries={entries} /></div>
  return <div data-public-fixture={PUBLIC_CONTENT_MODE === 'fixture' ? 'true' : undefined}><EditorialPage kind={page.kind} keyName={page.key} entries={entries} published={published} /></div>
}

export function PublicSearch() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [result, setResult] = useState<{ items: PublishedContentEntry[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (PUBLIC_CONTENT_MODE !== 'api') return
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
      <PublicPageHero kind="search" eyebrow="Explore the Westin journal" title="Search the public story." summary="Search only the content that has been approved and published for visitors." />
      <div data-public-fixture={PUBLIC_CONTENT_MODE === 'fixture' ? 'true' : undefined} className="mx-auto max-w-[1360px] px-5 py-14 sm:px-8 lg:px-12 lg:py-24">
        <form onSubmit={(event) => { event.preventDefault(); setSubmitted(query.trim()) }} className="mx-auto flex max-w-3xl gap-2 rounded-2xl border border-[#cce7f7] bg-white p-2 shadow-[0_10px_30px_rgba(27,96,133,.06)]">
          <label htmlFor="public-search" className="sr-only">Search published content</label>
          <input id="public-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search programs, stories, and campus life" className="min-h-12 min-w-0 flex-1 rounded-xl bg-[#f7fbff] px-4 text-base text-[#142d46] outline-none ring-[#3ba7f2] placeholder:text-[#7891a1] focus:ring-2" />
          <button type="submit" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#1468aa] px-4 text-sm font-bold text-white"><Search size={16} aria-hidden="true" />Search</button>
        </form>
        {PUBLIC_CONTENT_MODE === 'fixture' ? (
          <div className="mt-8 rounded-[28px] border border-[#cce7f7] bg-white p-8 text-center">
            <CalendarDays size={28} className="mx-auto text-[#1468aa]" aria-hidden="true" />
            <p className="mt-4 text-sm leading-7 text-[#557184]">Search is wired to the published-content API contract. Local fixture mode does not invent search results.</p>
          </div>
        ) : loading ? <PageLoader label="Searching published content" size={86} className="min-h-[240px]" /> : error ? <div className="mt-8"><ErrorState message={error} /></div> : (
          <div className="mt-8 grid gap-4">
            {result?.items.length ? result.items.map((entry) => (
              <Link key={entry.id} to={publicEntryPath(entry)} className="rounded-[24px] border border-[#d4e8f2] bg-white p-6 transition hover:border-[#3ba7f2]">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#35728f]">{entry.entryType}</p>
                <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#142d46]">{contentText(entry.content, 'title') || entry.slug}</h2>
                <p className="mt-2 text-sm leading-7 text-[#557184]">{contentText(entry.content, 'summary')}</p>
              </Link>
            )) : <div className="rounded-[28px] border border-dashed border-[#cce7f7] p-10 text-center text-sm text-[#557184]">No published pages matched that search.</div>}
          </div>
        )}
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
      <PublicPageHero kind="not-found" eyebrow="Page not found" title="That page has turned." summary="Try the homepage or explore the programs currently available." />
      <div className="sk-container sk-not-found-action">
        <Link to="/" className="sk-button">Back to Westin <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </>
  )
}
