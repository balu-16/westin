import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PublicProgram } from './content'
import { site } from './officialSite'
import './PublicNextStep.css'

type Action = { label: string; href: string; external?: boolean }

type NextStepContent = {
  headline: string
  description: string
  primary: Action
  secondary: Action
}

const programs = { label: 'Explore programs', href: '/programs' }
const visit = { label: 'Plan a visit', href: '/admissions#visit' }
const contact = { label: 'Contact Westin', href: '/contact' }

const content = {
  home: {
    headline: 'Your next chapter starts here.',
    description: 'Compare study paths and see the Vijayawada campus before you decide.',
    primary: programs,
    secondary: visit,
  },
  about: {
    headline: 'Get to know Westin. Find your place here.',
    description: 'Meet the people and learning approach, then explore a course that fits.',
    primary: programs,
    secondary: visit,
  },
  programs: {
    headline: 'Found a direction that feels like yours?',
    description: 'Compare courses and ask the Vijayawada team about entry details.',
    primary: { label: 'Ask about a course', href: '/contact' },
    secondary: visit,
  },
  campus: {
    headline: 'See life at Westin for yourself.',
    description: 'Explore the spaces and activities, then plan a campus visit.',
    primary: visit,
    secondary: programs,
  },
  careers: {
    headline: 'Prepare for the possibilities ahead.',
    description: 'Discover the practical learning and support behind Westin’s career paths.',
    primary: programs,
    secondary: { label: 'Talk to the team', href: '/contact' },
  },
  admissions: {
    headline: 'Let’s talk about your next step.',
    description: 'Ask about course choices, entry details and visiting the Vijayawada campus.',
    primary: { label: 'Contact admissions', href: '/contact' },
    secondary: { label: 'Compare programs', href: '/programs' },
  },
  contact: {
    headline: 'Come see where you could grow.',
    description: 'Arrange a visit and find your way to the Vijayawada campus.',
    primary: visit,
    secondary: { label: 'Get directions', href: site.contact.directions, external: true },
  },
  editorial: {
    headline: 'Take your curiosity further.',
    description: 'Discover Westin’s study paths or speak with the Vijayawada team.',
    primary: programs,
    secondary: contact,
  },
  search: {
    headline: 'Still finding your way?',
    description: 'Browse the course catalogue or ask the team for help.',
    primary: { label: 'Browse programs', href: '/programs' },
    secondary: { label: 'Ask Westin', href: '/contact' },
  },
  missing: {
    headline: 'Let’s get you back on track.',
    description: 'Return to Westin’s Home page or search the public site.',
    primary: { label: 'Go home', href: '/' },
    secondary: { label: 'Search the site', href: '/search' },
  },
} satisfies Record<string, NextStepContent>

const courseContent: Record<PublicProgram['group'], Pick<NextStepContent, 'headline' | 'description'>> = {
  Business: {
    headline: 'Make your next move in business.',
    description: 'Ask about this business course and the entry details Westin has published.',
  },
  Hospitality: {
    headline: 'Take your next step in hospitality.',
    description: 'Explore practical learning and ask about this hospitality course.',
  },
  'Junior college': {
    headline: 'Build a strong start in junior college.',
    description: 'Ask about MEC or CEC and plan a visit to the Vijayawada campus.',
  },
}

function nextStepFor(pathname: string, program?: PublicProgram): NextStepContent {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return content.home
  if (path === '/search') return content.search
  if (path === '/contact') return content.contact
  if (path === '/admissions') return content.admissions
  if (path === '/programs') return content.programs
  if (path.startsWith('/programs/')) return {
    ...(program ? courseContent[program.group] : {
      headline: 'Find out where this course could take you.',
      description: 'Ask the Vijayawada team about this course and its entry details.',
    }),
    primary: { label: 'Ask about this course', href: '/contact' },
    secondary: visit,
  }
  if (path === '/about' || path.startsWith('/about/') || path === '/why-westin' || path === '/partners' || path.startsWith('/partners/')) return content.about
  if (path === '/campus' || path.startsWith('/campus/') || path === '/gallery' || path.startsWith('/gallery/')) return content.campus
  if (path === '/placements' || path === '/career-planner' || path === '/testimonials' || path.startsWith('/testimonials/') || path === '/success-stories' || path.startsWith('/success-stories/')) return content.careers
  if (path === '/news' || path.startsWith('/news/') || path === '/blog' || path.startsWith('/blog/') || path === '/magazine' || path.startsWith('/magazine/') || path === '/publishing-house') return content.editorial
  return content.missing
}

function NextStepAction({ action, primary }: { action: Action; primary?: boolean }) {
  const className = `ed-next-step-action ${primary ? 'ed-next-step-action--primary' : 'ed-next-step-action--secondary'}`
  const icon = action.external ? <ArrowUpRight size={19} aria-hidden="true" /> : <ArrowRight size={19} aria-hidden="true" />
  if (action.external) return <a className={className} href={action.href} target="_blank" rel="noopener noreferrer">{action.label}{icon}<span className="sr-only"> (opens a new tab)</span></a>
  return <Link className={className} to={action.href}>{action.label}{icon}</Link>
}

export function PublicNextStep({ pathname, program }: { pathname: string; program?: PublicProgram }) {
  const next = nextStepFor(pathname, program)
  const campusLanding = pathname.replace(/\/+$/, '') === '/campus'
  return <section className="ed-next-step" aria-labelledby="public-next-step-title" data-public-next-step="true">
    <div className="ed-next-step-inner">
      <div className="ed-next-step-copy">
        <p className="ed-next-step-kicker"><span aria-hidden="true" />Your next chapter</p>
        <h2 id="public-next-step-title">{next.headline}</h2>
        <p className="ed-next-step-description">{next.description}</p>
        {campusLanding && <nav className="ed-next-step-explore" aria-label="Explore campus life">
          <Link to="/campus/infrastructure">Learning spaces</Link>
          <Link to="/campus/events">Campus events</Link>
          <Link to="/gallery">Official gallery</Link>
        </nav>}
      </div>
      <div className="ed-next-step-actions">
        <NextStepAction action={next.primary} primary />
        <NextStepAction action={next.secondary} />
      </div>
      <div className="ed-next-step-mark" aria-hidden="true"><span>⌁</span><small>Learning<br />People<br />Possibilities</small></div>
    </div>
  </section>
}
