import {
  AdministrationSection, AchievementsSection, AdmissionsSection, AlumniSection,
  ContactSection, EventsSection, FacultySection, FoodProductionSection,
  IndustrySection, JuniorProgrammeSection, LeadershipSection, OfficialProgrammeDetail,
  PlacementNewsSection, PublishingSection, StudentLifeSection, SuccessSection,
  TeamVoicesSection, VisionMissionSection,
} from './OfficialSections'
import { faqGroups } from './officialSite'
import { CampusMomentsSection, CampusSupportSection, ProgramsLearningSection } from './LearningSections'

function CourseQuestions({ group }: { group: string }) {
  const faq = faqGroups.find((item) => item.id === group)
  if (!faq) return null
  return <section className="sk-container sk-section sk-route-questions" aria-labelledby="course-questions-title">
    <div className="sk-section-heading"><div><p className="sk-eyebrow">Good to know</p><h2 id="course-questions-title">Questions about {faq.label.toLowerCase()}</h2></div></div>
    <div className="sk-faq-list">{faq.items.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
  </section>
}

/** Keeps the college's longer official copy on the page where visitors expect it. */
export function OfficialDestinationContent({ path, programSlug }: { path: string; programSlug?: string }) {
  if (programSlug) {
    const questionGroup = programSlug === 'bba' || programSlug === 'bba-honours' ? 'bba'
      : programSlug === 'intermediate' ? 'junior'
      : ['bhm-three-year', 'bhm-honours', 'hotel-management'].includes(programSlug) ? 'bhm' : ''
    return <div className="sk-route-detail">
      <OfficialProgrammeDetail slug={programSlug} />
      {programSlug === 'intermediate' && <JuniorProgrammeSection />}
      {programSlug === 'food-production' && <FoodProductionSection />}
      {questionGroup && <CourseQuestions group={questionGroup} />}
    </div>
  }
  switch (path) {
    case '/programs': return <ProgramsLearningSection />
    case '/about': return <AdministrationSection />
    case '/about/mission-vision': return <div className="sk-route-detail"><VisionMissionSection /></div>
    case '/about/management': return <div className="sk-route-detail"><LeadershipSection /></div>
    case '/about/faculty': return <div className="sk-route-detail"><FacultySection /><TeamVoicesSection /></div>
    case '/campus': return <div className="sk-route-detail"><StudentLifeSection /><CampusSupportSection /><CampusMomentsSection /></div>
    case '/campus/events': return <div className="sk-route-detail"><EventsSection /></div>
    case '/why-westin': return <div className="sk-route-detail"><IndustrySection /></div>
    case '/placements': return <div className="sk-route-detail"><AchievementsSection includePlacementTotals={false} /></div>
    case '/news/westin-students-uae-bahrain': return <div className="sk-route-detail"><PlacementNewsSection /></div>
    case '/success-stories': return <div className="sk-route-detail"><SuccessSection /><AlumniSection /></div>
    case '/publishing-house': return <div className="sk-route-detail"><PublishingSection /><CourseQuestions group="publishing" /></div>
    case '/admissions': return <div className="sk-route-detail"><AdmissionsSection /></div>
    case '/contact': return <div className="sk-route-detail"><ContactSection /></div>
    default: return null
  }
}
