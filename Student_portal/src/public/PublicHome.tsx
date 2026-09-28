import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { createHomeModel } from './home-model'
import { PUBLIC_CONTENT_MODE, usePublishedSite } from './usePublicContent'
import { PublicFaq } from './PublicFaq'
import './editorial-home.css'

const imageRoot = '/images/editorial-home/'

function EditorialImage({ name, alt, className, eager = false }: { name: string; alt: string; className?: string; eager?: boolean }) {
  return <img className={className} src={imageRoot + name + '-1536.webp'} srcSet={imageRoot + name + '-768.webp 768w, ' + imageRoot + name + '-1536.webp 1536w'} sizes={name === 'hero' ? '100vw' : '(min-width: 900px) 50vw, 100vw'} width={1536} height={1024} alt={alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={name === 'hero' ? 'high' : undefined} decoding="async" />
}

const paths = [
  { title: 'Business', description: 'Build the skills to lead in a changing world.', href: '/programs/bba', image: 'business', alt: 'Illustrative generated scene of a business student in a classroom' },
  { title: 'Hospitality', description: 'Turn your passion for people into a rewarding career.', href: '/programs/hotel-management', image: 'hospitality', alt: 'Illustrative generated scene of a hospitality student practising table service' },
  { title: 'MEC & CEC', description: 'Find a strong start for your next stage of study.', href: '/programs/intermediate', image: 'intermediate', alt: 'Illustrative generated scene of intermediate students studying together' },
] as const

export function PublicHome() {
  const published = usePublishedSite()
  const model = useMemo(() => createHomeModel(published.data), [published.data])
  const customHero = model.sections.hero ?? model.sections['home-hero']
  const eventStory = model.stories.find((story) => story.category === 'Campus events')
  const newsStory = model.stories.find((story) => story.category !== 'Campus events')
  return <div className="ed-home" data-public-fixture={PUBLIC_CONTENT_MODE === 'fixture' ? 'true' : undefined}>
    <section className="ed-hero" aria-labelledby="skybook-title">
      <EditorialImage name="hero" className="ed-hero-image" eager alt="Illustrative generated scene of hospitality students practising restaurant service" />
      <div className="ed-hero-wash" aria-hidden="true" />
      <div className="ed-shell ed-hero-content">
        <p className="ed-kicker">People <span /> Practice <span /> A brighter tomorrow</p>
        <h1 id="skybook-title">{customHero?.title ? model.hero.title : <>Big dreams.<br />Bright beginnings.</>}</h1>
        <p className="ed-hero-lead">{customHero?.summary || 'At Westin, we prepare you for a global tomorrow through industry relevant learning, hands on practice and a supportive campus community.'}</p>
        <div className="ed-actions">
          <Link className="ed-button ed-button-primary" to="/programs">Explore programs <ArrowRight size={18} aria-hidden="true" /></Link>
          <Link className="ed-button ed-button-outline" to="/admissions#visit">Plan a visit</Link>
        </div>
        <p className="ed-hand ed-hero-hand">Good people<br />make great places<span aria-hidden="true" /></p>
      </div>
    </section>

    <section className="ed-paths ed-shell" aria-labelledby="ed-paths-title">
      <div className="ed-section-heading">
        <h2 id="ed-paths-title"><span className="ed-orange-rule" aria-hidden="true" />Find your path</h2>
        <Link to="/programs" className="ed-inline-link">Explore all programs <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
      <div className="ed-path-grid">
        {paths.map((path) => <Link className="ed-path-card" to={path.href} key={path.title}>
          <EditorialImage name={path.image} alt={path.alt} />
          <span className="ed-path-copy"><span><strong>{path.title}</strong><small>{path.description}</small></span><span className="ed-circle-arrow" aria-hidden="true"><ArrowRight size={18} /></span></span>
        </Link>)}
      </div>
    </section>

    <section className="ed-experience ed-shell" aria-label="Life and opportunities at Westin">
      <Link to="/campus" className="ed-campus-panel">
        <EditorialImage name="campus" alt="Illustrative generated view of a leafy modern college campus, not a photograph of Westin" />
        <span className="ed-campus-shade" aria-hidden="true" />
        <span className="ed-campus-copy"><strong>Life at Westin</strong><span>A vibrant campus, lifelong friendships and experiences that shape you beyond the classroom.</span><span className="ed-panel-link">Discover campus life <ArrowRight size={17} aria-hidden="true" /></span></span>
      </Link>
      <div className="ed-career-panel">
        <p className="ed-kicker"><span className="ed-orange-rule" aria-hidden="true" />From learning to a brighter tomorrow</p>
        <h2>Explore placements</h2>
        <p>Our students step into opportunities with confidence, supported by industry exposure and dedicated guidance.</p>
        <Link to="/placements" className="ed-panel-link">See placements <span className="ed-circle-arrow" aria-hidden="true"><ArrowRight size={18} /></span></Link>
        <p className="ed-hand">Prepared<br />for what’s next<span aria-hidden="true" /></p>
      </div>
    </section>

    <section className="ed-about ed-shell" aria-labelledby="ed-about-title">
      <p className="ed-kicker">The Westin story</p>
      <figure className="ed-legacy-mark"><img src="/images/official/brand/laurel-25-249.png" width="249" height="181" loading="lazy" alt="" /><figcaption>25 years of legacy</figcaption></figure>
      <h2 id="ed-about-title">A place to learn, practise and belong.</h2>
      <p>Discover the people, purpose and hands on learning behind Westin College in Vijayawada.</p>
      <Link to="/about" className="ed-inline-link">Get to know Westin <ArrowUpRight size={17} aria-hidden="true" /></Link>
    </section>

    <section className="ed-stories ed-shell" aria-labelledby="ed-stories-title">
      <div className="ed-section-heading ed-stories-heading"><h2 id="ed-stories-title"><span className="ed-orange-rule" aria-hidden="true" />Stories from Westin</h2><Link to="/news" className="ed-inline-link">All stories <ArrowRight size={17} aria-hidden="true" /></Link></div>
      <div className="ed-story-grid">
        <Link className="ed-story-card" to={eventStory?.href || '/campus/events'}><EditorialImage name="story-event" eager alt="Illustrative generated scene of a speaker at a student event" /><span className="ed-story-copy"><small>Campus events</small><strong>{eventStory?.title || 'Moments that bring people together.'}</strong><span>Explore events <ArrowRight size={16} aria-hidden="true" /></span></span></Link>
        <Link className="ed-story-card" to={newsStory?.href || '/news'}><EditorialImage name="story-social" eager alt="Illustrative generated scene of students talking at a campus gathering" /><span className="ed-story-copy"><small>News &amp; stories</small><strong>{newsStory?.title || 'See what is happening at Westin.'}</strong><span>Explore news <ArrowRight size={16} aria-hidden="true" /></span></span></Link>
      </div>
    </section>

    <PublicFaq route="/" />
    <p className="ed-image-note ed-shell">Images on this page illustrate student life and are not photographs of Westin College. Explore the <Link to="/gallery">official gallery</Link> for campus photos.</p>
  </div>
}
