import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContactActions } from './ContactHandoff'
import { EditorialNote } from './EditorialNote'
import { publicPageCopy, type PublicSection } from './content'
import { OfficialContentSection, SectionNavigation, moveCardLight, leaveCardLight } from './EditorialDestinations'
import { OfficialHighlights, PlacementHistory, UnpicturedCompanies } from './OfficialHighlights'
import { OfficialDestinationContent } from './OfficialDestinationContent'
import { admissions2026, placementsSpotlight, site } from './officialSite'
import { PublicPageHero } from './PublicPageHero'
import { heroQuoteFor } from './heroQuotes'
import { PublicFaq } from './PublicFaq'
import { AdmissionEligibilitySection, AdmissionGuidanceSection, PlacementStoriesSection } from './CareerSections'
import { careerPlannerCardDetails } from './secondary-content'

const placementCards = [
  { title: 'Preparation throughout study', label: 'The groundwork', tone: 'cream', image: 'training-mock-interviews', alt: 'Westin students attending a workplace learning session', note: 'Practice opens doors.' },
  { title: 'Business internships', label: 'In the field', tone: 'plain', image: 'bba-journeys', alt: 'Westin business students collaborating around a laptop' },
  { title: 'Corporate readiness', label: 'Ready for what is next', tone: 'sand', image: 'training-etiquette', alt: 'Westin students and educators gathered during an industry visit' },
  { title: 'Career planner', label: 'A route forward', tone: 'plain', href: '/career-planner' },
] as const

const admissionStudyRoutes = [
  { name: 'Hospitality', detail: 'Practise food, service, front office and housekeeping skills.' },
  { name: 'Business', detail: 'Build management skills through projects and industry interaction.' },
  { name: 'MEC / CEC', detail: 'Take a two-year intermediate route in commerce and economics.' },
] as const

export function PlacementsDestination({ sections, title, summary, publishedBody }: {
  sections: PublicSection[]
  title?: string
  summary?: string
  publishedBody?: string
}) {
  const copy = publicPageCopy.placements
  return <div className="ed-secondary ed-secondary--placements">
    <PublicPageHero kind="placements" eyebrow={copy.eyebrow} title={title || copy.title} summary={summary || copy.summary} quote={heroQuoteFor('/placements', title || copy.title)} photo={{ stem: 'success-hero', alt: 'Westin hospitality students gathered around a table during practical learning', caption: 'Where preparation meets possibility' }} />
    <SectionNavigation label="Placements sections" items={[{ href: '#placement-figures-title', label: 'Career outcomes' }, { href: '#placement-support-title', label: 'Career preparation' }, { href: '#company-title', label: 'Organisations' }, { href: '#history-title', label: 'Placement history' }, { href: '#placement-stories', label: 'Alumni journeys' }, { href: '#placement-feedback', label: 'Employer feedback' }]} />

    <section className="ed-shell ed-secondary-section ed-placement-figures" aria-labelledby="placement-figures-title">
      <div className="ed-secondary-heading"><p className="ed-kicker"><span className="ed-orange-rule" aria-hidden="true" />Career outcomes</p><div><h2 id="placement-figures-title">The figures, with their context.</h2><p>Westin highlights career support and outcomes alongside its business and hospitality learning.</p></div></div>
      <div className="ed-placement-stat-grid" aria-label="Placement figures">
        {placementsSpotlight.stats.map((stat, index) => <article key={stat.label} className={`ed-placement-stat${index === 0 ? ' ed-placement-stat--feature' : ''}`} onPointerMove={moveCardLight} onPointerLeave={leaveCardLight}>
          <span className="ed-bento-label">{index === 0 ? 'The headline figure' : 'Further outcomes'}</span>
          <strong>{stat.value.replace('100 %', '100%')}</strong>
          <h3>{stat.label}</h3>
        </article>)}
      </div>
      <p className="ed-placement-caveat">These headline figures have no reporting period or campus breakdown and should be read with that limitation.</p>
    </section>

    <section className="ed-shell ed-secondary-section" aria-labelledby="placement-support-title">
      <div className="ed-secondary-heading"><p className="ed-kicker"><span className="ed-orange-rule" aria-hidden="true" />The path to work</p><div><h2 id="placement-support-title">Preparation starts before graduation.</h2><p>Explore practical experience, industry exposure and guidance for your next step.</p></div></div>
      <div className="ed-bento-grid ed-secondary-bento ed-secondary-bento--placement">
        {placementCards.flatMap((card) => {
          const section = sections.find((item) => item.title === card.title)
          if (!section) return []
          return [<article key={card.title} className={`ed-bento-card ed-bento-card--${card.tone}${card.title === 'Career planner' ? ' ed-placement-career-card' : ''}`} onPointerMove={moveCardLight} onPointerLeave={leaveCardLight}>
            {'image' in card && <div className="ed-photo-frame"><img src={`/images/official/campus/${card.image}-960.webp`} srcSet={`/images/official/campus/${card.image}-480.webp 480w, /images/official/campus/${card.image}-960.webp 960w`} sizes="(min-width: 1100px) 45vw, 100vw" width="960" height="640" loading="lazy" decoding="async" alt={card.alt} /></div>}
            <div className="ed-bento-card-copy"><span className="ed-bento-label">{card.label}</span><h3>{section.title}</h3><p>{section.body}</p>
              {card.title === 'Career planner' ? <div className="ed-placement-career-details">
                <div><h4>Recruitment pathways</h4>{section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}</div>
                {careerPlannerCardDetails.map((detail) => <div key={detail.title}><h4>{detail.title}</h4><p>{detail.body}</p></div>)}
              </div> : section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}
              {'note' in card && card.note ? <EditorialNote>{card.note}</EditorialNote> : null}
              {'href' in card && <div className="ed-secondary-card-links"><Link to={card.href}>Explore career planning <ArrowRight size={17} aria-hidden="true" /></Link></div>}
            </div>
          </article>]
        })}
      </div>
    </section>

    <OfficialHighlights />
    <UnpicturedCompanies />

    <OfficialContentSection kind="placements" title="Experience, people and progress." intro="Explore the college’s experience, placement history and the people whose accounts bring career development to life.">
      {publishedBody && <article className="ed-shell ed-published-copy"><h2>More from Westin</h2><p>{publishedBody}</p></article>}
      <OfficialDestinationContent path="/placements" />
      <div className="ed-shell ed-secondary-history"><PlacementHistory /></div>
      <PlacementStoriesSection />
    </OfficialContentSection>
    <nav className="ed-shell ed-secondary-next" aria-label="Explore careers further"><Link to="/career-planner">Career planner <ArrowRight size={18} aria-hidden="true" /></Link><Link to="/success-stories">Alumni stories <ArrowRight size={18} aria-hidden="true" /></Link><Link to="/programs">Explore courses <ArrowRight size={18} aria-hidden="true" /></Link></nav>
    <PublicFaq route="/placements" />
  </div>
}

export function AdmissionsDestination() {
  return <div className="ed-secondary ed-secondary--admissions">
    <PublicPageHero kind="admissions" eyebrow="Come get a feel for your next chapter" title="Picture yourself here." summary="Talk to the Vijayawada team about visiting the college, exploring a program and finding your next step." quote={heroQuoteFor('/admissions', 'Picture yourself here.')} photo={{ stem: 'students-group', alt: 'Westin students listening to a speaker during a learning session', caption: 'A new chapter starts with a conversation' }} />
    <SectionNavigation label="Admissions sections" items={[{ href: '#admissions-title', label: 'Study choices' }, { href: '#admissions-eligibility', label: 'Course eligibility' }, { href: '#admissions-guidance', label: 'Counselling and support' }, { href: '#visit', label: 'Campus visits' }, { href: '#admissions-psychometric', label: 'Explore your interests' }]} />
    <section className="ed-shell ed-secondary-section" aria-labelledby="admissions-overview-title">
      <div className="ed-secondary-heading"><p className="ed-kicker"><span className="ed-orange-rule" aria-hidden="true" />Your next step</p><div><h2 id="admissions-overview-title">Find your way in.</h2><p>See your options, read the entry details on each course page, and talk with the Vijayawada team about a visit.</p></div></div>
      <div className="ed-bento-grid ed-secondary-bento ed-secondary-bento--admissions">
        <article className="ed-bento-card ed-bento-card--cream" onPointerMove={moveCardLight} onPointerLeave={leaveCardLight}>
          <div className="ed-photo-frame"><img src="/images/official/campus/bba-about-960.webp" srcSet="/images/official/campus/bba-about-480.webp 480w, /images/official/campus/bba-about-960.webp 960w" sizes="(min-width: 1100px) 45vw, 100vw" width="960" height="640" loading="lazy" decoding="async" alt="Westin business students together around a table" /></div>
          <div className="ed-bento-card-copy"><span className="ed-bento-label">Explore</span><h3>Discover your study direction.</h3><p>Start with the subjects and activities that interest you. Business explores organisations and management, hospitality develops practical service skills, and MEC or CEC builds an intermediate foundation in commerce and economics. Compare the learning experience, course duration and opportunities for further study before discussing your preferred route with the college.</p>
            <div className="ed-admissions-study-routes"><h4>Ways to begin</h4><dl>{admissionStudyRoutes.map((route) => <div key={route.name}><dt>{route.name}</dt><dd>{route.detail}</dd></div>)}</dl></div>
            <EditorialNote>Find your direction.</EditorialNote><div className="ed-secondary-card-links"><Link to="/programs">See all programs <ArrowRight size={17} aria-hidden="true" /></Link></div></div>
        </article>
        <article className="ed-bento-card" onPointerMove={moveCardLight} onPointerLeave={leaveCardLight}>
          <div className="ed-photo-frame"><img src="/images/official/campus/junior-about-960.webp" srcSet="/images/official/campus/junior-about-480.webp 480w, /images/official/campus/junior-about-960.webp 960w" sizes="(min-width: 1100px) 25vw, 100vw" width="960" height="640" loading="lazy" decoding="async" alt="Westin students listening during a classroom session" /></div>
          <div className="ed-bento-card-copy"><span className="ed-bento-label">Understand</span><h3>Check the entry route.</h3><p>Your starting qualification helps identify suitable options. Degree, postgraduate, intermediate and diploma routes have different requirements. The comparison below brings together qualifications, marks and other conditions from the course records. Open the full course page and discuss your background with the team, including any university rules that apply.</p><div className="ed-admissions-course-links"><Link to="/programs/bba">BBA <ArrowRight size={15} aria-hidden="true" /></Link><Link to="/programs/hotel-management">Hotel management <ArrowRight size={15} aria-hidden="true" /></Link><Link to="/programs/intermediate">Intermediate <ArrowRight size={15} aria-hidden="true" /></Link></div></div>
        </article>
        <article className="ed-bento-card ed-bento-card--sand" onPointerMove={moveCardLight} onPointerLeave={leaveCardLight}>
          <div className="ed-photo-frame"><img src="/images/official/campus/hm-learning-960.webp" srcSet="/images/official/campus/hm-learning-480.webp 480w, /images/official/campus/hm-learning-960.webp 960w" sizes="(min-width: 1100px) 25vw, 100vw" width="960" height="640" loading="lazy" decoding="async" alt="Westin hospitality student practising food preparation in a kitchen" /></div>
          <div className="ed-bento-card-copy"><span className="ed-bento-label">Connect</span><h3>See the place for yourself.</h3><p>A conversation and campus visit can help you understand how a course feels in practice. Ask about teaching, practical training, learning resources and student activities. Discuss counselling, current fees and hostel arrangements where relevant. Contact the Vijayawada team to arrange a visit and bring the questions that matter to your decision.</p><div className="ed-secondary-card-links"><a href="#visit">Plan a visit <ArrowRight size={17} aria-hidden="true" /></a></div></div>
        </article>
      </div>
    </section>

    <OfficialContentSection kind="admissions" title="Explore your study choices." intro="Get to know the learning approach in each school, then compare the individual routes and their entry requirements."><OfficialDestinationContent path="/admissions" /></OfficialContentSection>
    <AdmissionEligibilitySection />
    <AdmissionGuidanceSection />
    <section className="ed-shell ed-admissions-visit" id="visit" aria-labelledby="visit-title">
      <div><p className="ed-kicker"><span className="ed-orange-rule" aria-hidden="true" />Vijayawada campus</p><h2 id="visit-title">Come see where you could grow.</h2><p>Visit Westin at G V R Towers in Bharathi Nagar, opposite Vinayak Theatre, Vijayawada. Call or message the team to arrange a time and discuss your preferred course. Ask about eligibility, practical learning and the application information you need. The team can also answer questions about current fees and hostel arrangements.</p><a className="ed-admissions-directions" href={site.contact.directions} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens a new tab)</span></a></div>
      <ContactActions />
    </section>
    <section className="ed-shell ed-admissions-assessment" id="admissions-psychometric" aria-labelledby="assessment-title"><div className="sk-admissions-psychometric ed-source-card"><p className="sk-eyebrow">Explore your interests</p><h2 id="assessment-title">Make room for self-reflection.</h2><p>The Psychometric Test offers another starting point for thinking about your interests. Use it alongside course information and a counselling conversation with the college. Discuss your academic background, preferred subjects and goals with the team as you compare your next step.</p><a className="sk-button sk-button-outline" href={admissions2026.psychometricTest.href} target="_blank" rel="noopener noreferrer">Open Westin’s Psychometric Test <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens a new tab)</span></a></div></section>
    <PublicFaq route="/admissions" />
  </div>
}

export function ContactDestination() {
  return <div className="ed-secondary ed-secondary--contact">
    <PublicPageHero kind="contact" eyebrow="Let’s start a conversation" title="Good questions. Warm welcomes." summary="Speak with the Vijayawada team about programs, admissions or a campus visit." quote={heroQuoteFor('/contact', 'Good questions. Warm welcomes.')} photo={{ stem: 'bba-journeys', alt: 'Westin business students discussing their work around a laptop', caption: 'Your next conversation starts here' }} />
    <div className="ed-shell ed-contact-quick-actions"><ContactActions /></div>
    <SectionNavigation label="Contact sections" items={[{ href: '#contact-official', label: 'Contact details' }, { href: '#counselling', label: 'Counselling' }, { href: '#campus-location', label: 'Campus location' }, { href: '#contact-enquiries', label: 'Enquiry guidance' }, { href: '#contact-network', label: 'Office network' }]} />
    <OfficialDestinationContent path="/contact" />
  </div>
}
