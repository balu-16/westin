import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PublicProgram } from './content'
import { OfficialPhoto } from './OfficialPhoto'
import { archivePath, officialArchive } from './officialArchive'
import { campusMoments, campusSupport, courseLearning, learningSpaces, learningTopics, type LearningTopic } from './learning-content'
import { moveCardLight, leaveCardLight } from './EditorialDestinations'

function TopicGrid({ topics, variant, headingLevel = 'h3' }: {
  topics: readonly LearningTopic[]
  variant: 'programs' | 'course' | 'support' | 'spaces'
  headingLevel?: 'h3' | 'h4'
}) {
  const Heading = headingLevel
  return <div className={`ed-learning-grid ed-learning-grid--${variant}`}>
    {topics.map((topic, index) => <article key={topic.id} data-topic={topic.id} className={`ed-learning-card ed-source-card${topic.image ? ' ed-learning-card--photo' : ''}`} onPointerMove={moveCardLight} onPointerLeave={leaveCardLight}>
      {topic.image && <div className="ed-photo-frame ed-learning-photo"><OfficialPhoto mediaKey={topic.image.key} alt={topic.image.alt} sizes={variant === 'spaces' ? '(min-width: 768px) 45vw, 100vw' : '(min-width: 1100px) 50vw, 100vw'} /></div>}
      <div className="ed-learning-copy">
        {variant === 'programs' && <span className="ed-bento-label">Learning in practice · {String(index + 1).padStart(2, '0')}</span>}
        <Heading>{topic.title}</Heading>
        <p>{topic.body}</p>
        {variant !== 'course' && topic.points?.length ? <ul>{topic.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}
        {topic.id === 'campus-information' && <Link className="sk-text-link" to="/admissions#visit">Plan a visit <ArrowRight size={17} aria-hidden="true" /></Link>}
      </div>
    </article>)}
  </div>
}

export function ProgramsLearningSection() {
  return <div className="ed-shell ed-program-learning" id="learning-methods"><TopicGrid topics={learningTopics} variant="programs" /></div>
}

export function CourseLearningSection({ group }: { group: PublicProgram['group'] }) {
  return <section className="ed-course-learning" aria-labelledby="course-learning-title">
    <h3 id="course-learning-title">Learning in practice</h3>
    <TopicGrid topics={courseLearning[group]} variant="course" headingLevel="h4" />
  </section>
}

export function CampusSupportSection() {
  return <section className="sk-container sk-section ed-campus-support" id="campus" aria-labelledby="campus-title">
    <div className="ed-learning-heading"><div><p className="sk-eyebrow">Guidance through your studies</p><h2 id="campus-title">Support for the person you are becoming.</h2></div><p>Individual guidance connects academic progress, personal development and decisions about what comes next.</p></div>
    <TopicGrid topics={campusSupport} variant="support" />
    <nav className="ed-learning-actions" aria-label="Explore student support"><Link to="/about/faculty">Meet the faculty <ArrowRight size={17} aria-hidden="true" /></Link><Link to="/career-planner">Explore career planning <ArrowRight size={17} aria-hidden="true" /></Link><Link to="/contact">Talk with the team <ArrowRight size={17} aria-hidden="true" /></Link></nav>
  </section>
}

export function CampusMomentsSection() {
  return <section className="sk-container sk-section ed-campus-moments" id="campus-moments" aria-labelledby="campus-moments-title">
    <div className="ed-learning-heading"><div><p className="sk-eyebrow">A glimpse of college life</p><h2 id="campus-moments-title">Shared moments, lasting memories.</h2></div><p>Explore college photographs of performances, hospitality activities and community participation.</p></div>
    <div className="ed-moment-grid">{campusMoments.map((moment) => {
      const record = officialArchive.find((entry) => entry.kind === 'campus-events' && entry.id === moment.id)
      if (!record) return null
      return <article key={moment.id} className="ed-moment-card ed-source-card">
        <Link to={archivePath(record)}>
          <div className="ed-photo-frame"><img src={record.image} alt={record.imageAlt || record.title} width="900" height="600" loading="lazy" decoding="async" /></div>
          <div className="ed-moment-copy"><span className="ed-bento-label">{moment.label}</span><h3>{record.title}</h3><p>{moment.body}</p><span className="ed-moment-date">{record.date || 'Campus gallery'}</span><span className="ed-moment-link">Explore the photographs <ArrowRight size={17} aria-hidden="true" /></span></div>
        </Link>
      </article>
    })}</div>
    <nav className="ed-learning-actions" aria-label="Explore more campus moments"><Link to="/campus/events">Browse all campus events <ArrowRight size={17} aria-hidden="true" /></Link><Link to="/gallery">Open the gallery <ArrowRight size={17} aria-hidden="true" /></Link></nav>
  </section>
}

export function LearningSpacesSection() {
  return <section className="sk-container sk-section ed-learning-spaces" aria-labelledby="learning-spaces-title">
    <div className="ed-learning-heading"><div><p className="sk-eyebrow">Resources for learning and everyday life</p><h2 id="learning-spaces-title">From classroom ideas to practical skills.</h2></div><p>Explore academic resources, hospitality practice and the spaces and support that form part of the Vijayawada campus experience.</p></div>
    <TopicGrid topics={learningSpaces} variant="spaces" />
    <nav className="ed-learning-actions" aria-label="Explore the campus further"><Link to="/campus">Explore Campus Life <ArrowRight size={17} aria-hidden="true" /></Link><Link to="/contact">Ask about the campus <ArrowRight size={17} aria-hidden="true" /></Link></nav>
  </section>
}
