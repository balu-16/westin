import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { sources } from './content'

type Company = { name: string; slug?: string; source: string }
type LogoCompany = Company & { slug: string }

const newer = sources.hotelCollegeDetailed
const legacy = sources.legacyPlacements

export const businessCompanies: Company[] = [
  ['Starbucks', 'starbucks'], ['DHL', 'dhl'], ['Audi', 'audi'],
  ['Mercedes-Benz', 'mercedes-benz'], ['Adidas', 'adidas'], ['Subway', 'subway'],
  ['Wipro', 'wipro'], ['Netflix', 'netflix'], ['Infosys', 'infosys'], ['IBM', 'ibm'],
].map(([name, slug]) => ({ name, slug, source: sources.home }))

const hospitalityLogoCompanies: Company[] = [
  ['Hilton', 'hilton'], ['Marriott', 'marriott'], ['IHG', 'ihg'],
  ['ITC Hotels', 'itc-hotels'], ['The Leela', 'the-leela'], ['Oberoi Hotels', 'oberoi'],
  ['Taj Hotels', 'taj'], ['Holiday Inn', 'holiday-inn'], ['Accor', 'accor'],
  ['Club Med', 'club-med'], ['Renaissance Hotels', 'renaissance'],
  ['Westin Hotels & Resorts', 'westin-hotels'], ['Le Méridien', 'le-meridien'],
  ['Conrad Hotels', 'conrad'], ['Sheraton', 'sheraton'], ['Kempinski', 'kempinski'],
  ['Crowne Plaza', 'crowne-plaza'], ['St. Regis', 'st-regis'],
  ['The Ritz-Carlton', 'ritz-carlton'], ['Fairmont', 'fairmont'],
  ['InterContinental', 'intercontinental'], ['Burj Al Arab', 'burj-al-arab'],
].map(([name, slug]) => ({ name, slug, source: newer }))

export const hospitalityCompanies: Company[] = hospitalityLogoCompanies.concat([
  'Atlantis The Palm', 'Madinat Jumeirah', 'Desert Islands Resort & Spa',
  'Dubai World Trade Centre', 'Shakespeare & Co.', 'Gloria Hotels',
  'Landmark Hotels', 'Nando’s', 'Starwood Hotels & Resorts',
  'Jumeirah International', 'Anantara Hotels & Resorts', 'Rotana Hotels',
  'Azadea Retail', 'Gulf Hotels Group', 'Fontana Hotels',
  'EFS Facilities Services',
].map((name) => ({ name, source: ['Gulf Hotels Group', 'Fontana Hotels', 'EFS Facilities Services'].includes(name) ? sources.newsMore : legacy })))

const businessLogos = businessCompanies.filter((company): company is LogoCompany => !!company.slug)
const hospitalityLogos = hospitalityCompanies.filter((company): company is LogoCompany => !!company.slug)

function CompanyCard({ company }: { company: LogoCompany }) {
  return <span className="sk-company-card" title={company.name}>
    <img src={`/images/companies/display/${company.slug}.webp`} width="190" height="90" loading="eager" decoding="async" alt={company.name} />
  </span>
}

function CompanyTrack({ companies, label, source, reverse = false }: { companies: LogoCompany[]; label: string; source: string; reverse?: boolean }) {
  return <div className="sk-company-row" role="group" aria-label={label} tabIndex={0}>
    <div className="sk-container sk-company-row-heading"><h3>{label}</h3><a href={source} target="_blank" rel="noopener noreferrer">Westin source<span className="sr-only"> (opens a new tab)</span></a></div>
    <div className="sk-company-viewport">
      <div className={`sk-company-track${reverse ? ' sk-company-reverse' : ''}`}>
        <div className="sk-company-set">{companies.map((company) => <CompanyCard key={company.name} company={company} />)}</div>
        <div className="sk-company-set" aria-hidden="true">{companies.map((company) => <CompanyCard key={company.name} company={company} />)}</div>
      </div>
    </div>
  </div>
}

export function OfficialHighlights() {
  const [paused, setPaused] = useState(false)
  return <section className="sk-official-highlights" aria-labelledby="company-title" data-paused={paused}>
    <div className="sk-container sk-companies-heading">
      <div><p className="sk-eyebrow">Across industries and hospitality</p><h2 id="company-title">A world of work to explore.</h2></div>
      <button type="button" className="sk-company-pause" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Play company marquees' : 'Pause company marquees'} aria-pressed={paused}>
        {paused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}{paused ? 'Play' : 'Pause'}
      </button>
    </div>
    <CompanyTrack companies={businessLogos} label="Business and broader industry" source={sources.home} />
    <CompanyTrack companies={hospitalityLogos} label="Hospitality and service" source={newer} reverse />
    <div className="sk-container sk-companies-caption">
      <p>These organizations appear in Westin’s company strips or published placement material. A logo here does not describe a specific offer or package.</p>
    </div>
  </section>
}

export function LegacyFeature() {
  return <section className="sk-container sk-legacy-feature" aria-labelledby="legacy-title" data-reveal>
    <div className="sk-legacy-photo"><img src="/images/official/westin-students.webp" width="1200" height="800" loading="lazy" decoding="async" alt="Westin students and educators together at a hospitality venue" /></div>
    <div className="sk-legacy-copy"><p className="sk-eyebrow">A story begun in 1999</p><strong className="sk-legacy-number">25<span>+</span></strong><h2 id="legacy-title">Years of learning with purpose.</h2><p>Westin brings hotel management, business management and junior-college learning together in Vijayawada. Classroom ideas meet practical training, industry exposure and guidance for the next step.</p><Link className="sk-text-link" to="/about">Meet Westin <ArrowRight size={17} aria-hidden="true" /></Link></div>
  </section>
}

export function UnpicturedCompanies() {
  const companies = hospitalityCompanies.filter((company) => !company.slug)
  return <section className="ed-shell ed-unpictured-companies" aria-labelledby="unpictured-companies-title">
    <h2 id="unpictured-companies-title">Other organizations named by Westin</h2>
    <p>These names appear in published material but do not have local logo assets for the marquee.</p>
    <ul>{companies.map((company) => <li key={company.name} className="ed-source-card"><span>{company.name}</span><a href={company.source} target="_blank" rel="noopener noreferrer">Source<span className="sr-only"> for {company.name} (opens a new tab)</span></a></li>)}</ul>
  </section>
}

export function PlacementHistory() {
  const rows = [
    { label: 'Business-facing page', figures: '12,000+ international · 4,000+ domestic placements', context: 'Reporting period and campus breakdown not stated', source: sources.business },
    { label: 'Hospitality-facing page', figures: '15,000+ international · 6,000+ domestic placements', context: 'Reporting period and campus breakdown not stated', source: sources.hotelCollegeDetailed },
    { label: 'Legacy Vijayawada homepage', figures: '2,200 international placements', context: 'Historical site figure; reporting period not stated', source: sources.legacyHome },
    { label: '2017–18 Hyderabad record', figures: '66% of final-year students in international jobs or internships before completion', context: 'Hyderabad campus · 2017–18', source: sources.legacyPlacements },
  ]
  return <section className="sk-placement-history" aria-labelledby="history-title">
    <p className="sk-eyebrow">Read the record in context</p><h2 id="history-title">Placement figures through the years.</h2>
    <p>Westin’s pages publish different totals. Each is shown with its own page and original context rather than combined into a single current number.</p>
    <div className="sk-history-list">{rows.map((row) => <article key={row.label}><span>{row.label}</span><h3>{row.figures}</h3><p>{row.context}</p><a href={row.source} target="_blank" rel="noopener noreferrer">Original record<span className="sr-only"> (opens a new tab)</span></a></article>)}</div>
  </section>
}
