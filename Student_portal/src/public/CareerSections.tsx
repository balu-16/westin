import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fixturePrograms } from './content'
import { moveCardLight, leaveCardLight, SectionNavigation } from './EditorialDestinations'
import { OfficialPhoto } from './OfficialPhoto'
import { programmeRecordsFor } from './programme-routes'
import { admissionsGuidance, alumniPreviews, careerScreening, careerServices, contactEnquiries, employerPreviews } from './secondary-content'
import type { LearningTopic } from './learning-content'

function GuidanceCards({ topics }: { topics: readonly LearningTopic[] }) {
  return <div className="ed-learning-grid ed-learning-grid--support">{topics.map((topic) => <article key={topic.id} className="ed-learning-card ed-source-card" onPointerMove={moveCardLight} onPointerLeave={leaveCardLight}>
    <div className="ed-learning-copy"><h3>{topic.title}</h3><p>{topic.body}</p>{topic.points && <ul>{topic.points.map((point) => <li key={point}>{point}</li>)}</ul>}</div>
  </article>)}</div>
}

export function AdmissionEligibilitySection() {
  return <section className="ed-shell ed-secondary-section ed-admissions-eligibility" id="admissions-eligibility" aria-labelledby="eligibility-title">
    <div className="ed-learning-heading"><div><p className="sk-eyebrow">Compare your starting point</p><h2 id="eligibility-title">Find the entry route that fits.</h2></div><p>Compare the requirements for each study route, then open its course page for full details. Discuss current eligibility and applicable university rules with the Vijayawada team.</p></div>
    {(['Business', 'Hospitality', 'Junior college'] as const).map((group, index) => <section className="ed-eligibility-group" key={group} aria-labelledby={`eligibility-group-${index}`}>
      <h3 id={`eligibility-group-${index}`}>{group}</h3>
      <ul>{fixturePrograms.filter((program) => program.group === group).map((program) => {
        const records = programmeRecordsFor(program.slug)
        const fields = new Map<string, Set<string>>()
        for (const record of records) for (const condition of record.eligibility) {
          const values = fields.get(condition.label) ?? new Set<string>()
          condition.items.forEach((item) => values.add(item))
          fields.set(condition.label, values)
        }
        const duration = [...new Set(records.map((record) => record.duration))].join(' / ') || 'Varies by pathway'
        const academic = [...fields].filter(([label]) => ['Educational qualification', 'Minimum marks'].includes(label))
        const additional = [...fields].filter(([label]) => !['Educational qualification', 'Minimum marks'].includes(label))
        return <li key={program.slug}><article className="ed-eligibility-row" data-program={program.slug}>
          <div className="ed-eligibility-course"><h4>{program.title}</h4>{program.slug === 'hotel-management' && <span className="ed-bento-label">Pathways overview</span>}<Link to={`/programs/${program.slug}`}>View course <ArrowRight size={16} aria-hidden="true" /></Link></div>
          <dl><div><dt>Duration</dt><dd>{duration}</dd></div><div><dt>Academic eligibility</dt><dd>{academic.length ? academic.map(([label, values]) => <span key={label}>{[...values].join(' / ')}</span>) : program.entry}</dd></div><div><dt>Additional conditions</dt><dd>{additional.length ? additional.map(([label, values]) => <span key={label}>{[...values].join(' / ')}</span>) : 'Requirements vary by route. Compare the specific course pages.'}</dd></div></dl>
        </article></li>
      })}</ul>
    </section>)}
  </section>
}

export function AdmissionGuidanceSection() {
  return <section className="ed-shell ed-secondary-section ed-admissions-guidance" id="admissions-guidance" aria-labelledby="admissions-guidance-title">
    <div className="ed-learning-heading"><div><p className="sk-eyebrow">Make an informed choice</p><h2 id="admissions-guidance-title">Good guidance makes the next step clearer.</h2></div><p>Use these topics to prepare for a conversation with the college, whether you are choosing your first course or considering a new direction.</p></div>
    <GuidanceCards topics={admissionsGuidance} />
    <nav className="ed-learning-actions" aria-label="Explore admission guidance"><Link to="/contact#counselling">Ask for counselling <ArrowRight size={17} aria-hidden="true" /></Link><Link to="/campus/infrastructure">Explore learning spaces <ArrowRight size={17} aria-hidden="true" /></Link></nav>
  </section>
}

export function PlacementStoriesSection() {
  return <div className="ed-shell ed-placement-people">
    <section id="placement-stories" aria-labelledby="placement-stories-title">
      <div className="ed-learning-heading"><div><p className="sk-eyebrow">Paths beyond graduation</p><h2 id="placement-stories-title">Experience grows into a career.</h2></div><p>Our alumni accounts show how practical learning, mentorship and early opportunities can connect with later professional development.</p></div>
      <div className="ed-alumni-preview-grid">{alumniPreviews.map((story) => <article className="ed-alumni-preview ed-source-card" key={story.id}>
        <OfficialPhoto mediaKey={story.imageKey} alt={`Portrait of Westin alumnus ${story.title}`} sizes="80px" />
        <div><span className="ed-bento-label">Alumni account · December 2024</span><h3>{story.title}</h3><p>{story.body}</p><Link to={story.href}>Read the journey <ArrowRight size={16} aria-hidden="true" /></Link></div>
      </article>)}</div>
    </section>
    <section id="placement-feedback" aria-labelledby="placement-feedback-title">
      <div className="ed-learning-heading"><div><p className="sk-eyebrow">Employer perspectives</p><h2 id="placement-feedback-title">Relationships built through recruitment.</h2></div><p>These summaries reflect archived employer feedback. The roles below are those recorded with the testimonials.</p></div>
      <div className="ed-employer-preview-grid">{employerPreviews.map((feedback) => <article className="ed-employer-preview ed-source-card" key={feedback.id}><span className="ed-bento-label">Archived employer feedback</span><h3>{feedback.title}</h3><p className="ed-employer-role">{feedback.role}</p><p>{feedback.body}</p><Link to={`/testimonials/${feedback.id}`}>Read employer feedback <ArrowRight size={16} aria-hidden="true" /></Link></article>)}</div>
    </section>
  </div>
}

export function CareerPlannerContent() {
  return <>
    <SectionNavigation label="Career Planner sections" items={[{ href: '#career-profile', label: 'Career Planner' }, { href: '#career-services', label: 'Recruitment pathways' }, { href: '#career-screening', label: 'Screening and selection' }, { href: '#career-preparation', label: 'Prepare and connect' }]} />
    <section className="ed-shell ed-career-profile" id="career-profile" aria-labelledby="career-profile-title">
      <div className="ed-photo-frame"><OfficialPhoto mediaKey="campus/training-mock-interviews" alt="Westin students participating in a workplace learning session" /></div>
      <div><p className="sk-eyebrow">Connecting people and hospitality</p><h2 id="career-profile-title">A route from preparation to opportunity.</h2><p>Westin Career Planner’s hospitality recruitment profile describes an organisation operating since 2005, working with permanent and temporary staffing needs. Its service range covers entry-level candidates through senior management, with recruiting offices listed in Bengaluru, Hyderabad, Vijayawada and Siliguri.</p><p>For students, career preparation starts with understanding interests and developing professional skills. Practical training, feedback and workplace experience help connect academic learning with the responsibilities of a role.</p><Link className="sk-text-link" to="/contact">Discuss your interests with the team <ArrowRight size={17} aria-hidden="true" /></Link></div>
    </section>
    <section className="ed-shell ed-secondary-section" id="career-services" aria-labelledby="career-services-title">
      <div className="ed-learning-heading"><div><p className="sk-eyebrow">Hospitality recruitment</p><h2 id="career-services-title">Different ways to enter and progress.</h2></div><p>Career Planner’s service profile spans training, operational work and management responsibilities, responding to single, large and ongoing staffing requirements.</p></div>
      <GuidanceCards topics={careerServices} />
    </section>
    <section className="ed-shell ed-secondary-section" id="career-screening" aria-labelledby="career-screening-title">
      <div className="ed-learning-heading"><div><p className="sk-eyebrow">Understanding candidate suitability</p><h2 id="career-screening-title">Screening and selection.</h2></div><p>The recruitment profile describes several ways to assess candidates alongside their qualifications and practical experience.</p></div>
      <div className="ed-career-screening-grid">{careerScreening.map((item) => <article key={item.title} className="ed-source-card"><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
    </section>
    <section className="ed-shell ed-secondary-section ed-career-preparation" id="career-preparation" aria-labelledby="career-preparation-title">
      <div className="ed-learning-heading"><div><p className="sk-eyebrow">Build your confidence</p><h2 id="career-preparation-title">Prepare, practise and ask questions.</h2></div><p>Career guidance considers academic performance and individual interests, with support for internships, employment and further study.</p></div>
      <div className="ed-career-screening-grid"><article className="ed-source-card"><h3>Develop professional skills</h3><p>Communication workshops develop presentation, negotiation and leadership. Resume sessions and mock interviews give students opportunities to practise explaining their experience. Corporate etiquette and grooming introduce expectations in professional settings, while certifications and practical work build on subject knowledge.</p></article><article className="ed-source-card"><h3>Connect experience with your direction</h3><p>Industry visits, guest sessions and live projects introduce professional perspectives. Use the course structure to understand your internship stages and discuss your interests with the team. Students considering higher education or research can also seek guidance on the next stage of their learning.</p></article></div>
      <nav className="ed-learning-actions" aria-label="Explore career preparation"><Link to="/placements">Explore placements <ArrowRight size={17} aria-hidden="true" /></Link><Link to="/programs">Compare course pathways <ArrowRight size={17} aria-hidden="true" /></Link><Link to="/contact">Contact the team <ArrowRight size={17} aria-hidden="true" /></Link></nav>
    </section>
  </>
}

export function ContactEnquiryGuide() {
  const destinations = ['/admissions#admissions-eligibility', '/campus', '/career-planner']
  return <section className="ed-shell ed-contact-enquiries" id="contact-enquiries" aria-labelledby="contact-enquiries-title">
    <div className="ed-learning-heading"><div><p className="sk-eyebrow">Start with what you need</p><h2 id="contact-enquiries-title">A conversation with a clear direction.</h2></div><p>The Vijayawada team can help you connect your questions with course information, a visit or the next stage of your learning.</p></div>
    <div className="ed-learning-grid ed-learning-grid--support">{contactEnquiries.map((topic, index) => <article className="ed-learning-card ed-source-card" key={topic.id}><div className="ed-learning-copy"><h3>{topic.title}</h3><p>{topic.body}</p><Link className="sk-text-link" to={destinations[index]}>Explore the details <ArrowRight size={17} aria-hidden="true" /></Link></div></article>)}</div>
  </section>
}
