import type { PointerEvent, ReactNode } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PublicSection } from './content'
import { EditorialNote } from './EditorialNote'
import { PublicFaq } from './PublicFaq'

type Destination = 'about' | 'campus'

const details = {
  about: {
    eyebrow: 'Get to know Westin',
    title: 'The people and purpose behind the place.',
    intro: 'Explore the college story in smaller pieces, then follow the people and ideas that interest you most.',
    fullLabel: 'The complete college story.',
    cards: [
      { label: 'Our roots', tone: 'cream' },
      { label: 'Our approach', tone: 'photo', image: 'students-group', alt: 'A Westin educator speaking with students in a classroom' },
      { label: 'People at Westin', tone: 'plain' },
      { label: 'Recognition', tone: 'sand' },
      { label: 'From the archive', tone: 'plain' },
      { label: 'Teaching and mentoring', tone: 'photo', image: 'faculty-excellence', alt: 'Westin faculty and students in a learning setting', note: 'Guidance helps us grow.' },
    ],
    links: [
      ['Mission & vision', '/about/mission-vision'],
      ['Meet our management', '/about/management'],
      ['Meet the faculty', '/about/faculty'],
      ['Why Westin', '/why-westin'],
    ],
  },
  campus: {
    eyebrow: 'Beyond the classroom',
    title: 'Room to discover what you can do.',
    intro: 'A closer look at where students study, practise, collaborate and make the most of time together.',
    fullLabel: 'The complete campus story.',
    cards: [
      { label: 'Study', tone: 'cream' },
      { label: 'Practice', tone: 'photo', image: 'hm-front-office', alt: 'Westin hospitality students practising front office service', note: 'Confidence comes from doing.' },
      { label: 'Connect', tone: 'photo', image: 'junior-life-1', alt: 'Westin junior college students participating in an activity', note: 'Find your people.' },
      { label: 'Belong', tone: 'sand' },
    ],
  },
} as const

/** Decorative pointer light uses DOM style properties so cards do not rerender on every move. */
export function moveCardLight(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
  const bounds = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`)
  event.currentTarget.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`)
}

export function resetCardLight(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.removeProperty('--pointer-x')
  event.currentTarget.style.removeProperty('--pointer-y')
}

export function OfficialContentSection({ kind, title, intro, children }: {
  kind: 'about' | 'programs' | 'campus' | 'placements' | 'admissions' | 'contact'
  title: string
  intro: string
  children: ReactNode
}) {
  return <section className="ed-source-section" data-official-content={kind} aria-labelledby={`official-content-${kind}`} onPointerMove={(event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
    const card = event.target instanceof Element ? event.target.closest<HTMLElement>('.ed-source-card') : null
    if (!card || !event.currentTarget.contains(card)) return
    const bounds = card.getBoundingClientRect()
    card.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`)
    card.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`)
  }}>
    <div className="ed-shell ed-source-heading">
      <p className="ed-kicker"><span className="ed-orange-rule" aria-hidden="true" />From Westin's published material</p>
      <div><h2 id={`official-content-${kind}`}>{title}</h2><p>{intro}</p></div>
    </div>
    <div className="ed-source-body">{children}</div>
  </section>
}

export function EditorialDestination({ kind, sections, publishedBody, children }: {
  kind: Destination
  sections: PublicSection[]
  publishedBody?: string
  children: ReactNode
}) {
  const page = details[kind]
  return <div className="ed-destination" data-destination={kind}>
    <section className="ed-shell ed-destination-intro" aria-labelledby="ed-destination-title">
      <p className="ed-kicker"><span className="ed-orange-rule" aria-hidden="true" />{page.eyebrow}</p>
      <div><h2 id="ed-destination-title">{page.title}</h2><p>{page.intro}</p></div>
    </section>

    <section className="ed-shell" aria-label={`${kind === 'about' ? 'About Westin' : 'Campus life'} highlights`}>
      <div className={`ed-bento-grid ed-bento-grid--${kind}`}>
        {sections.map((section, index) => {
          const card = page.cards[index]
          if (!card) return null
          return <article key={section.title} className={`ed-bento-card ed-bento-card--${card.tone}`} onPointerMove={moveCardLight} onPointerLeave={resetCardLight}>
            {'image' in card && card.image ? <div className="ed-photo-frame ed-photo-frame--bottom"><img src={`/images/official/campus/${card.image}-960.webp`} srcSet={`/images/official/campus/${card.image}-480.webp 480w, /images/official/campus/${card.image}-960.webp 960w`} sizes="(min-width: 1100px) 45vw, 100vw" width="960" height="640" loading="lazy" decoding="async" alt={card.alt} /><span className="ed-photo-frame-caption ed-photo-frame-caption--label">{card.label}</span></div> : null}
            <div className="ed-bento-card-copy">
              {'image' in card ? null : <span className="ed-bento-label">{card.label}</span>}
              <h3>{section.title}</h3>
              <p>{section.body}</p>
              {section.points?.length ? <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
              {'note' in card && card.note ? <EditorialNote>{card.note}</EditorialNote> : null}
              <a className="ed-bento-source" href={section.source} target="_blank" rel="noopener noreferrer">Original Westin source <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens a new tab)</span></a>
            </div>
          </article>
        })}
      </div>
    </section>

    {kind === 'about' && <nav className="ed-shell ed-destination-links" aria-label="Explore Westin further">
      <div><p className="ed-kicker"><span className="ed-orange-rule" aria-hidden="true" />Keep exploring</p><h2>Meet the rest of the story.</h2></div>
      <div>{details.about.links.map(([label, href]) => <Link key={href} to={href}>{label}<ArrowRight size={18} aria-hidden="true" /></Link>)}</div>
    </nav>}

    <OfficialContentSection
      kind={kind}
      title={page.fullLabel}
      intro={kind === 'about' ? 'Read the college story and a message from its founder, in Westin’s own words.' : 'Explore the spaces, clubs and activities Westin describes across its campus.'}
    >
      {publishedBody && <article className="ed-shell ed-published-copy"><h2>More from Westin</h2><p>{publishedBody}</p></article>}
      {children}
    </OfficialContentSection>

    <PublicFaq route={kind === 'about' ? '/about' : '/campus'} />
  </div>
}
