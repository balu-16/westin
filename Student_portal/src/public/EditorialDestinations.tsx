import type { PointerEvent, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PublicSection } from './content'
import { EditorialNote } from './EditorialNote'
import { PublicFaq } from './PublicFaq'

type Destination = 'about' | 'campus'

const details = {
  about: {
    eyebrow: 'Get to know Westin',
    title: 'The people and purpose behind the place.',
    intro: 'Discover our roots in Vijayawada, our approach to learning and the people who support every student’s next step.',
    fullLabel: 'Leadership and administration.',
    cards: [
      { label: 'Our roots', tone: 'cream', image: 'about-hero', alt: 'Westin hospitality students learning together' },
      { label: 'Our approach', tone: 'photo', image: 'students-group', alt: 'A Westin educator speaking with students in a classroom' },
      { label: 'People at Westin', tone: 'plain' },
      { label: 'Recognition', tone: 'sand' },
      { label: 'Support for your next step', tone: 'plain' },
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
    fullLabel: 'Make the most of college life.',
    cards: [
      { label: 'Study', tone: 'cream' },
      { label: 'Practice', tone: 'photo', image: 'hm-front-office', alt: 'Westin hospitality students practising front office service', note: 'Confidence comes from doing.' },
      { label: 'Connect', tone: 'photo', image: 'junior-life-1', alt: 'Westin junior college students participating in an activity', note: 'Find your people.' },
      { label: 'Belong', tone: 'sand' },
    ],
  },
} as const

export function SectionNavigation({ items, label }: { items: readonly { href: string; label: string }[]; label: string }) {
  return <nav className="ed-shell ed-section-nav" aria-label={label}><span>On this page</span><ul>{items.map((item) => <li key={item.href}><a href={item.href}>{item.label}<ArrowRight size={14} aria-hidden="true" /></a></li>)}</ul></nav>
}

/** Decorative pointer light uses DOM style properties so cards do not rerender on every move. */
export function moveCardLight(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
  const bounds = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`)
  event.currentTarget.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`)
}

export function leaveCardLight(event: PointerEvent<HTMLElement>) {
  // Keep the light at the exit edge while its opacity fades out.
  moveCardLight(event)
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
      <p className="ed-kicker"><span className="ed-orange-rule" aria-hidden="true" />{{ about: 'People at Westin', programs: 'Explore your study options', campus: 'Life at Westin', placements: 'Career preparation', admissions: 'Admissions at Westin', contact: 'Visit and connect' }[kind]}</p>
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

    {kind === 'campus' && <SectionNavigation label="Campus Life sections" items={[{ href: '#campus-highlights', label: 'Learning and campus life' }, { href: '#life', label: 'Student clubs' }, { href: '#campus', label: 'Student support' }, { href: '#campus-moments', label: 'Campus moments' }]} />}

    <section className="ed-shell" id={kind === 'campus' ? 'campus-highlights' : undefined} aria-label={`${kind === 'about' ? 'About Westin' : 'Campus life'} highlights`}>
      <div className={`ed-bento-grid ed-bento-grid--${kind}`}>
        {sections.map((section, index) => {
          const card = page.cards[index]
          if (!card) return null
          return <article key={section.title} id={kind === 'about' && index === 0 ? 'about-history' : undefined} className={`ed-bento-card ed-bento-card--${card.tone}`} onPointerMove={moveCardLight} onPointerLeave={leaveCardLight}>
            {'image' in card && card.image ? <div className="ed-photo-frame"><img src={`/images/official/campus/${card.image}-960.webp`} srcSet={`/images/official/campus/${card.image}-480.webp 480w, /images/official/campus/${card.image}-960.webp 960w`} sizes="(min-width: 1100px) 45vw, 100vw" width="960" height="640" loading="lazy" decoding="async" alt={card.alt} /></div> : null}
            <div className="ed-bento-card-copy">
              <span className="ed-bento-label">{card.label}</span>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
              {section.points?.length ? <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
              {kind === 'campus' && index === 0 && <Link className="sk-text-link ed-campus-spaces-link" to="/campus/infrastructure">Explore learning spaces <ArrowRight size={17} aria-hidden="true" /></Link>}
              {'note' in card && card.note ? <EditorialNote>{card.note}</EditorialNote> : null}
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
      intro={kind === 'about' ? 'Meet the team guiding education and everyday campus life in Vijayawada.' : 'Find your interests, get guidance and discover the activities that bring students together.'}
    >
      {publishedBody && <article className="ed-shell ed-published-copy"><h2>More from Westin</h2><p>{publishedBody}</p></article>}
      {children}
    </OfficialContentSection>

    <PublicFaq route={kind === 'about' ? '/about' : '/campus'} />
  </div>
}
