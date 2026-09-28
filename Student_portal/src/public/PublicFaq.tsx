import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { sources } from './content'
import { site } from './officialSite'

type FaqRoute = '/' | '/about' | '/programs' | '/campus' | '/placements' | '/admissions' | '/contact'
type FaqItem = { question: string; answer: string; href: string; link: string }

const questions: Record<FaqRoute, FaqItem[]> = {
  '/': [
    { question: 'What can I study at Westin?', answer: 'Explore business degrees, hospitality degrees and diplomas, and MEC or CEC intermediate study. Each course has its own page with more detail.', href: '/programs', link: 'Explore programs' },
    { question: 'Does learning include practical experience?', answer: 'Westin describes hospitality practice, business projects, industry interaction and internships across its course material. The activities differ by program.', href: '/why-westin', link: 'See the learning approach' },
    { question: 'Can I visit before choosing a course?', answer: 'Yes. Contact the Vijayawada team to discuss a campus visit and the course that interests you.', href: '/admissions#visit', link: 'Plan a visit' },
    { question: 'How do I speak with the college?', answer: 'The Contact page has the Vijayawada phone number, email, directions and a WhatsApp counselling option.', href: '/contact', link: 'Contact Westin' },
  ],
  '/about': [
    { question: 'How long has Westin been in education?', answer: 'Westin traces its history to 1999. Historical figures on this site are labelled with the context supplied by their original pages.', href: sources.about, link: 'Westin’s About page' },
    { question: 'What does the college teach?', answer: 'Westin brings hotel management, business management and MEC or CEC junior-college study together in Vijayawada.', href: '/programs', link: 'Explore programs' },
    { question: 'Where can I read the vision and mission?', answer: 'Westin’s published vision and mission describe practical training, academic competence and career opportunity.', href: '/about/mission-vision', link: 'Read the vision and mission' },
    { question: 'Who supports students in their learning?', answer: 'Westin describes educators and industry practitioners who provide teaching, mentoring and practical guidance.', href: '/about/faculty', link: 'Meet the faculty' },
  ],
  '/programs': [
    { question: 'Which study directions are available?', answer: 'The catalogue groups the published routes into Business, Hospitality and Junior College, with separate detail pages for each course.', href: '/programs', link: 'Browse the catalogue' },
    { question: 'What is the difference between BHM and BHM (Honours)?', answer: 'Westin lists a three-year BHM route and a four-year honours route with further specialisation and research. Check each course page for its published structure.', href: '/programs/bhm-honours', link: 'Compare the honours route' },
    { question: 'What are MEC and CEC?', answer: 'MEC combines Mathematics, Economics and Commerce; CEC combines Civics, Economics and Commerce. Both are two-year intermediate streams.', href: '/programs/intermediate', link: 'Read about intermediate study' },
    { question: 'Where are the entry requirements?', answer: 'Requirements vary by course. Each course page lists the entry information Westin has published and links to its original record.', href: '/admissions', link: 'Explore admissions' },
  ],
  '/campus': [
    { question: 'What spaces support study?', answer: 'Westin describes digital classrooms, library resources and spaces for hospitality practice.', href: '/campus/infrastructure', link: 'See learning spaces' },
    { question: 'How do hospitality students practise?', answer: 'Course material describes practical work in food production, food and beverage service, front office and housekeeping.', href: '/programs/hotel-management', link: 'Explore hospitality learning' },
    { question: 'Are there activities beyond classes?', answer: 'Westin’s student-life material lists clubs, workshops, cultural events, sports and other student activities.', href: sources.studentLife, link: 'Westin’s student-life record' },
    { question: 'Where can I see official campus photos?', answer: 'The gallery collects photographs and event records published by Westin.', href: '/gallery', link: 'Open the gallery' },
  ],
  '/placements': [
    { question: 'What do the 42 LPA, 8 LPA and 100% figures describe?', answer: 'These are figures shown on Westin’s published Vijayawada homepage. That source does not give a reporting period or campus breakdown, so they are presented here with that limitation.', href: sources.home, link: 'See Westin’s source' },
    { question: 'Do the company logos indicate a specific job offer?', answer: 'No. The organizations appear in Westin’s company strips or placement material; a displayed logo does not describe an individual offer or package.', href: '#company-title', link: 'View the sourced company strips' },
    { question: 'What preparation is described before graduation?', answer: 'Westin describes internships, industry visits, workplace projects, communication workshops and interview preparation across its published material.', href: '/career-planner', link: 'Explore career planning' },
    { question: 'Are the older placement totals current?', answer: 'Older totals and the 2017–18 Hyderabad record are shown with their individual source and campus context. Westin does not provide a current reporting period for every figure.', href: '#history-title', link: 'Read historical context' },
  ],
  '/admissions': [
    { question: 'How do I find the right course?', answer: 'Start with the Business, Hospitality and Junior College groups, then open a course page to compare its learning areas and entry details.', href: '/programs', link: 'Compare programs' },
    { question: 'Where can I check eligibility?', answer: 'Each course page lists the entry requirements Westin has published. Confirm current requirements with the Vijayawada admissions team.', href: '/programs/bba', link: 'See a course example' },
    { question: 'How can I arrange a campus visit?', answer: 'Call or message the Vijayawada team to talk through a visit and your preferred course.', href: '#visit', link: 'Plan a visit' },
    { question: 'How do I get current fee information?', answer: 'Fee details can vary by course and academic year. Ask the admissions team for the current amount and any applicable support.', href: '/contact', link: 'Ask the college' },
  ],
  '/contact': [
    { question: 'How can I call Westin in Vijayawada?', answer: 'The Vijayawada contact number published by Westin is +91 93 93 755 755.', href: 'tel:+919393755755', link: 'Call the college' },
    { question: 'Can I contact the college on WhatsApp?', answer: 'Yes. The page offers a WhatsApp action for a conversation with the Vijayawada team.', href: `https://api.whatsapp.com/send?phone=${site.contact.whatsapp}`, link: 'Open WhatsApp' },
    { question: 'Where is the Vijayawada campus?', answer: 'Westin lists Bharathi Nagar, Vijayawada, Andhra Pradesh 520008, opposite Vinayak Theatre.', href: site.contact.directions, link: 'Get directions' },
    { question: 'What happens when I send the counselling form?', answer: 'The form checks the details you enter and opens a prepared WhatsApp message. It does not submit your enquiry to this website.', href: '#contact-official', link: 'Go to the counselling form' },
  ],
}

export function PublicFaq({ route }: { route: FaqRoute }) {
  return <section className="ed-faq ed-shell" aria-labelledby="ed-faq-title">
    <div className="ed-faq-intro"><p className="ed-kicker"><span className="ed-orange-rule" aria-hidden="true" />Frequently asked questions</p><h2 id="ed-faq-title">Good questions, clear answers.</h2><p>Find a quick answer, then follow the link for details from Westin.</p></div>
    <div className="ed-faq-list">{questions[route].map((item) => <details key={item.question}>
      <summary>{item.question}</summary>
      <div className="ed-faq-answer"><p>{item.answer}</p>{item.href.startsWith('/') ? <Link to={item.href}>{item.link}<ArrowUpRight size={16} aria-hidden="true" /></Link> : <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}>{item.link}<ArrowUpRight size={16} aria-hidden="true" />{item.href.startsWith('http') && <span className="sr-only"> (opens a new tab)</span>}</a>}</div>
    </details>)}</div>
  </section>
}
