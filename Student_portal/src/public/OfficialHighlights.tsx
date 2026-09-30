import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { sources } from './content'
import { placementHistory } from './secondary-content'

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

function CompanyTrack({ companies, label, reverse = false }: { companies: LogoCompany[]; label: string; reverse?: boolean }) {
  return <div className="sk-company-row" role="group" aria-label={label} tabIndex={0}>
    <div className="sk-container sk-company-row-heading"><h3>{label}</h3></div>
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
    <CompanyTrack companies={businessLogos} label="Business and broader industry" />
    <CompanyTrack companies={hospitalityLogos} label="Hospitality and service" reverse />
    <div className="sk-container sk-companies-caption">
      <p>Explore organisations across business and hospitality. A displayed logo does not describe a specific job offer or package.</p>
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
    <h2 id="unpictured-companies-title">More organisations across hospitality and service</h2>
    <p>Discover further organisations in our placement history, spanning hotels, resorts, restaurants and related services.</p>
    <ul>{companies.map((company) => <li key={company.name} className="ed-source-card"><span>{company.name}</span></li>)}</ul>
  </section>
}

export function PlacementHistory() {
  return <section className="sk-placement-history" aria-labelledby="history-title">
    <p className="sk-eyebrow">Read the record in context</p><h2 id="history-title">Placement figures through the years.</h2>
    <p>These figures cover different study areas, campuses and periods. Read each with its reporting context; they do not form one current placement total.</p>
    <div className="sk-history-list">{placementHistory.map((row) => <article key={row.id} data-record={row.id}><span>{row.label}</span><h3>{row.figures}</h3><p className="ed-history-context">{row.context}</p><p>{row.body}</p>{row.href && <Link className="sk-text-link" to={row.href}>Read the placement record <ArrowRight size={16} aria-hidden="true" /></Link>}</article>)}</div>
  </section>
}
