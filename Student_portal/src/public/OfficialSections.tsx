import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MessageCircle,
  Quote,
} from "lucide-react";
import { OfficialPhoto } from "./OfficialPhoto";
import { EditorialNote } from "./EditorialNote";
import { OfficialContentSection, moveCardLight, resetCardLight } from "./EditorialDestinations";
import { PublicFaq } from "./PublicFaq";
import {
  about,
  achievements,
  admissions2026,
  albums,
  alumniStories,
  bbaAdmissionReasons,
  campusCulture,
  corporateTraining,
  eventGalleries,
  facultyExcellence,
  heroTaglines,
  businessTaglines,
  juniorTaglines,
  publishingTaglines,
  juniorProgrammeDetail,
  foodProductionDetail,
  publishingDocuments,
  studentAuthorProcess,
  studentAuthorBenefits,
  faqGroups,
  founder,
  industryCollaboration,
  internships,
  juniorFaculty,
  leadership,
  magazinePdfs,
  placementNews,
  programmes,
  programmeGroups,
  publishingHouse,
  recognition,
  schools,
  site,
  studentLife,
  successStories,
  teamVoices,
  visionAndMission,
  albumPhotos,
  officialSources,
} from "./officialSite";
import type { Pic, Programme } from "./officialTypes";

export function SourceNote({ href, children }: { href: string; children: string }) {
  return (
    <p className="sk-source-note">
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens a new tab)</span>
      </a>
    </p>
  );
}

/**
 * Sticky in-page navigation for the long Home page. Rendered outside
 * .sk-home > section so the section count stays exactly 23.
 */
export function OfficialSectionNav() {
  const items = [
    ["about", "About"],
    ["campaign", "Campaign"],
    ["leadership", "Leadership"],
    ["achievements", "Achievements"],
    ["programmes", "Programmes"],
    ["voices", "Team"],
    ["campus", "Campus"],
    ["life", "Student life"],
    ["junior-programme", "MEC / CEC"],
    ["news", "Placements"],
    ["success", "Success"],
    ["alumni", "Alumni"],
    ["events", "Events"],
    ["publishing", "Publishing"],
    ["journal", "Journal"],
    ["faq", "FAQs"],
    ["admissions-2026", "Admissions"],
    ["contact-official", "Contact"],
  ] as const;
  return (
    <nav className="sk-section-nav" aria-label="Home page sections">
      <div
        className="sk-container sk-section-nav-inner"
        tabIndex={0}
        aria-label="Home page section links"
      >
        {items.map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}

/** 03 · The four schools, with their real photographs. */
export function SchoolsSection() {
  return (
    <section className="sk-container sk-section sk-schools" id="schools" aria-labelledby="schools-title" data-reveal>
      <div className="sk-section-heading">
        <div>
          <p className="sk-eyebrow">Four schools, one campus</p>
          <h2 id="schools-title">
            Where you could <em>study.</em>
          </h2>
        </div>
        <p>
          Hotel management, business management, junior college and a publishing house that puts
          students on the page.
        </p>
      </div>
      <div className="sk-schools-grid">
        {schools.map((school, index) => (
          <article key={school.school} className="sk-school-card">
            <OfficialPhoto
              mediaKey={school.image.key}
              alt={school.image.alt}
              sizes="(max-width: 767px) calc(100vw - 44px), (min-width: 1200px) 340px, 30vw"
            />
            <span className="sk-school-index">0{index + 1}</span>
            <h3>{school.school}</h3>
            <p>{school.tagline}</p>
            <Link className="sk-text-link" to="/programs">
              Know more
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

/** 04 · The Pride of Vijayawada and Where Knowledge Meets Innovation. */
export function AboutSection() {
  return (
    <section className="sk-about-official" id="about" aria-labelledby="about-title" data-reveal>
      <div className="sk-container sk-about-official-inner">
        <div className="ed-photo-frame ed-photo-frame--left">
          <OfficialPhoto
            mediaKey={about.image.key}
            alt={about.image.alt}
            priority
            sizes="(min-width: 1024px) 46vw, 100vw"
          />
          <span className="ed-photo-frame-caption">About Westin</span>
        </div>
        <div className="sk-about-official-copy ed-source-card">
          <p className="sk-eyebrow">{about.eyebrow}</p>
          <h2 id="about-title">{about.prideTitle}</h2>
          {about.pride.map((paragraph, index) => (
            <p key={`pride-${index}`}>{paragraph}</p>
          ))}
          <h3>{about.knowledgeTitle}</h3>
          {about.knowledge.map((paragraph, index) => (
            <p key={`knowledge-${index}`}>{paragraph}</p>
          ))}
          <SourceNote href={about.source}>Westin’s About page</SourceNote>
        </div>
      </div>
    </section>
  );
}

/** 05 · The founder's message. */
export function FounderSection() {
  return (
    <section className="sk-founder" id="founder" aria-labelledby="founder-title" data-reveal>
      <div className="sk-container sk-founder-inner">
        <blockquote className="sk-founder-quote ed-source-card">
          <Quote size={30} aria-hidden="true" />
          <h2 id="founder-title">{founder.heading}</h2>
          <p>{founder.quote}</p>
          <footer>
            <strong>{founder.name}</strong>
            <span>{founder.role}</span>
          </footer>
        </blockquote>
        <OfficialPhoto
          mediaKey={founder.image.key}
          alt={founder.image.alt}
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
        />
      </div>
    </section>
  );
}

/** 06 · Vision and mission. */
export function VisionMissionSection() {
  return (
    <section className="sk-container sk-section sk-vision" id="vision" aria-labelledby="vision-title" data-reveal>
      <div className="sk-vision-card">
        <p className="sk-eyebrow">Vision &amp; Mission</p>
        <h2 id="vision-title">{visionAndMission.vision}</h2>
        <h3>Mission</h3>
        <ul className="sk-vision-list">
          {visionAndMission.mission.map((item, index) => (
            <li key={`mission-${index}`}>
              <Check size={18} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="sk-vision-legacy">{visionAndMission.legacyLine}</p>
        <SourceNote href={visionAndMission.source}>Westin’s Vision &amp; Mission page</SourceNote>
      </div>
    </section>
  );
}

/** 07 · The three leadership portraits, cropped from the official banner. */
export function LeadershipSection() {
  return (
    <section className="sk-container sk-section sk-leadership" id="leadership" aria-labelledby="leadership-title" data-reveal>
      <div className="sk-section-heading">
        <div>
          <p className="sk-eyebrow">Who leads Westin</p>
          <h2 id="leadership-title">The people behind the college.</h2>
        </div>
        <p>Direction, teaching and administration, in the college&rsquo;s own words.</p>
      </div>
      <ul className="sk-leadership-grid">
        {leadership.map((person) => (
          <li key={`voice-${person.id}`}>
            <OfficialPhoto mediaKey={person.image.key} alt={person.image.alt} sizes="168px" />
            <h3>{person.name}</h3>
            <p>{person.role}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 08 · Counters, both placement total sets, and the recognition line. */
export function AchievementsSection() {
  return (
    <section className="sk-achievements" id="achievements" aria-labelledby="achievements-title" data-reveal>
      <div className="sk-container">
        <div className="sk-section-heading">
          <div>
            <p className="sk-eyebrow">Achievements</p>
            <h2 id="achievements-title">Twenty-five years, counted.</h2>
          </div>
          <p>{recognition.text}</p>
        </div>
        <dl className="sk-achievement-counters">
          {achievements.counters.map((stat) => (
            <div key={stat.value} className="ed-source-card">
              <dd>{stat.value}</dd>
              <dt>{stat.label}</dt>
            </div>
          ))}
        </dl>
        <div className="sk-placement-totals">
          {Object.values(achievements.totals).map((totals) => (
            <article key={totals.label} className="ed-source-card">
              <h3>{totals.label}</h3>
              <p>
                <strong>{totals.international}</strong> international
              </p>
              <p>
                <strong>{totals.domestic}</strong> domestic
              </p>
              <span>{totals.note}</span>
            </article>
          ))}
        </div>
        <p className="sk-achievement-recognition">{recognition.explore}</p>
      </div>
    </section>
  );
}

/** 09 · The complete programme catalogue, tabbed by school. */
export function ProgrammeCatalogueSection() {
  const [group, setGroup] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = programmeGroups.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % programmeGroups.length
        : event.key === "ArrowLeft"
          ? (index + last) % programmeGroups.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setGroup(next);
    tabs.current[next]?.focus();
  };
  const active = programmeGroups[group];
  const list = programmes.filter((item) => item.school === active.id);
  return (
    <section className="sk-container sk-section sk-catalogue" id="programmes" aria-labelledby="catalogue-title" data-reveal>
      <div className="sk-section-heading">
        <div>
          <p className="sk-eyebrow">Every programme</p>
          <h2 id="catalogue-title">
            The complete <em>catalogue.</em>
          </h2>
        </div>
        <p>Duration, affiliation, year-by-year structure, eligibility and career pathway.</p>
      </div>
      <div className="sk-program-tabs" role="tablist" aria-label="Programme schools">
        {programmeGroups.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`school-tab-${item.id}`}
            aria-controls={`school-panel-${item.id}`}
            aria-selected={group === index}
            tabIndex={group === index ? 0 : -1}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            onKeyDown={(event) => onKey(event, index)}
            onClick={() => setGroup(index)}
          >
            <span className="sk-tab-number">0{index + 1}</span>
            {item.label}
            <ArrowUpRight size={19} aria-hidden="true" />
          </button>
        ))}
      </div>
      {programmeGroups
        .filter((item) => item.id !== active.id)
        .map((item) => (
          <div
            key={item.id}
            id={`school-panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`school-tab-${item.id}`}
            hidden
          />
        ))}
      <div
        className="sk-catalogue-panel"
        role="tabpanel"
        id={`school-panel-${active.id}`}
        aria-labelledby={`school-tab-${active.id}`}
        tabIndex={0}
      >
        <p className="sk-catalogue-intro">{active.intro}</p>
        <div className="sk-catalogue-list">
          {list.map((programme) => (
            <ProgrammeCard key={programme.slug} programme={programme} />
          ))}
        </div>
      </div>
      {/*
        The other schools' programmes are prerendered too, inside a
        visually-hidden container. They are deliberately not marked as
        role="tabpanel" so the page exposes exactly one live tabpanel, while the
        text stays available to search engines and the coverage audit.
      */}
      <div className="sk-catalogue-rest">
        {programmeGroups
          .filter((item) => item.id !== active.id)
          .map((item) => (
            <div key={item.id} className="sk-catalogue-rest-group">
              <p className="sk-catalogue-intro">{item.intro}</p>
              <div className="sk-catalogue-list">
                {programmes
                  .filter((programme) => programme.school === item.id)
                  .map((programme) => (
                    <ProgrammeCard key={programme.slug} programme={programme} />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

function ProgrammeStageCard({ stage }: { stage: Programme["stages"][number] }) {
  return <li>
    <span>{stage.label}</span>
    <strong>{stage.title}</strong>
    <p>{stage.text}</p>
  </li>;
}

function ProgrammeCard({ programme }: { programme: Programme }) {
  const lastStageAfterEligibility = programme.slug === "diploma-in-food-production" ? programme.stages[4] : undefined;
  const structureStages = lastStageAfterEligibility ? programme.stages.slice(0, 4) : programme.stages;
  return (
    <details className="sk-programme">
      <summary>
        <span className="sk-programme-name">
          <strong>{programme.name}</strong>
          <span className="sk-programme-meta">
            {programme.duration} · {programme.award}
            {programme.affiliation ? ` · ${programme.affiliation}` : ""}
          </span>
        </span>
        <span className="sk-programme-toggle" aria-hidden="true" />
      </summary>
      <div className="sk-programme-body">
        <p className="sk-programme-tagline">{programme.tagline}</p>
        {programme.overview.map((paragraph, index) => (
          <p key={`overview-${index}`}>{paragraph}</p>
        ))}
        <div className={`sk-programme-grid${lastStageAfterEligibility ? " sk-programme-grid--balanced" : ""}`}>
          <div>
            <h4>Structure</h4>
            <ol className="sk-timeline">
              {structureStages.map((stage) => <ProgrammeStageCard key={stage.label} stage={stage} />)}
            </ol>
          </div>
          <div>
            <h4>Eligibility</h4>
            <dl className="sk-eligibility">
              {programme.eligibility.map((group) => (
                <div key={group.label}>
                  <dt>{group.label}</dt>
                  <dd>{group.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
            {lastStageAfterEligibility && <ol className="sk-timeline sk-timeline--after-eligibility" start={5} aria-label="Final structure step">
              <ProgrammeStageCard stage={lastStageAfterEligibility} />
            </ol>}
            {programme.careerPathway && (
              <>
                <h4>Career pathway</h4>
                <p>{programme.careerPathway}</p>
              </>
            )}
          </div>
        </div>
        {programme.sections?.map((section) => (
          <div key={section.title} className="sk-programme-extra">
            <h4>{section.title}</h4>
            {section.text && <p>{section.text}</p>}
            {section.items && (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <SourceNote href={programme.source}>Westin’s official programme page</SourceNote>
      </div>
    </details>
  );
}

/** Detailed official course copy belongs on its course route, not Home. */
export function OfficialProgrammeDetail({ slug }: { slug: string }) {
  const officialSlugs: Record<string, string[]> = {
    bba: ["bba"],
    "bba-honours": ["bba-4-years-programe"],
    "bhm-three-year": ["3-years-degree-program"],
    "bhm-honours": ["4-years-degree-program"],
    "work-integrated-hotel-management": ["diploma-in-hotel-management"],
    "dhm-one-year": ["dhm-1-year-course"],
    "food-production": ["diploma-in-food-production"],
    pgdhm: ["pgdm"],
    intermediate: ["mec", "cec"],
  };
  const matches = programmes.filter((programme) => officialSlugs[slug]?.includes(programme.slug));
  if (!matches.length) return null;
  return <section className="sk-container sk-section sk-catalogue sk-route-programmes" aria-label="Full course information">
    <div className="sk-section-heading"><div><p className="sk-eyebrow">Official course information</p><h2>Course details</h2></div><p>Learning structure, eligibility and career pathways published by Westin.</p></div>
    <div className="sk-catalogue-list">{matches.map((programme) => <ProgrammeCard key={programme.slug} programme={programme} />)}</div>
  </section>;
}

/** 10 · Team voices: eight portraits with their "Why Westin" quotes. */
export function TeamVoicesSection() {
  return (
    <section className="sk-voices" id="voices" aria-labelledby="voices-title" data-reveal>
      <div className="sk-container">
        <div className="sk-section-heading">
          <div>
            <p className="sk-eyebrow">Why Westin</p>
            <h2 id="voices-title">In their own words.</h2>
          </div>
          <p>Educators, department heads and administrators on working at Westin.</p>
        </div>
        <ul className="sk-voices-grid">
          {teamVoices.map((person) => (
            <li key={person.id}>
              <OfficialPhoto
                mediaKey={person.image.key}
                alt={person.image.alt}
                sizes="92px"
              />
              <blockquote>
                <p>{person.quote}</p>
              </blockquote>
              <h3>{person.name}</h3>
              <p className="sk-voice-role">{person.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TitledBlock({
  title,
  text,
  items,
}: {
  title: string;
  text?: string;
  items?: readonly string[];
}) {
  return (
    <article className="sk-titled-block ed-source-card">
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {items && (
        <ul>
          {items.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

/** 11 · Faculty excellence. */
export function FacultySection() {
  return (
    <section className="sk-container sk-section sk-faculty" id="faculty" aria-labelledby="faculty-title" data-reveal>
      <div className="sk-section-heading">
        <div>
          <p className="sk-eyebrow">Faculty excellence</p>
          <h2 id="faculty-title">Taught by people who have done the job.</h2>
        </div>
      </div>
      <div className="sk-titled-grid">
        {facultyExcellence.map((block) => (
          <TitledBlock
            key={block.title}
            title={block.title}
            text={block.text}
            items={block.items}
          />
        ))}
        <TitledBlock
          title={juniorFaculty.title}
          text={juniorFaculty.text}
          items={juniorFaculty.items}
        />
      </div>
    </section>
  );
}

/** 12 · Campus culture and facilities. */
export function CampusSection() {
  return (
    <section className="sk-container sk-section sk-campus-official" id="campus" aria-labelledby="campus-title" data-reveal>
      <div className="ed-photo-frame ed-photo-frame--left">
        <OfficialPhoto
          mediaKey="campus/campus-culture"
          alt="Westin students during a campus culture activity"
          priority
          sizes="(min-width: 1024px) 46vw, 100vw"
        />
        <span className="ed-photo-frame-caption">Campus life</span>
      </div>
      <div className="sk-campus-official-copy ed-source-card">
        <p className="sk-eyebrow">Campus</p>
        <h2 id="campus-title">{campusCulture.title}</h2>
        <p>{campusCulture.text}</p>
        <ul>
          {campusCulture.items?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="sk-campus-hostel">
          Does the college provide hostel facilities? Yes, we offer safe and well-maintained hostel
          facilities for students from other cities.
        </p>
      </div>
    </section>
  );
}

/** 13 · Student life, clubs and the junior-college list. */
export function StudentLifeSection() {
  return (
    <section className="sk-container sk-section sk-life" id="life" aria-labelledby="life-title" data-reveal>
      <div className="sk-section-heading">
        <div>
          <p className="sk-eyebrow">{studentLife.title}</p>
          <h2 id="life-title">More than the timetable.</h2>
        </div>
        <p>{studentLife.intro}</p>
      </div>
      <ul className="sk-club-grid">
        {studentLife.clubs.map((club) => (
          <li key={club} className="ed-source-card">{club}</li>
        ))}
      </ul>
      <div className="sk-life-extra">
        <h3>{studentLife.juniorTitle}</h3>
        <p>{studentLife.juniorIntro}</p>
        <ul className="sk-junior-life">
          {studentLife.juniorItems.map((item, index) => (
            <li key={`junior-${index}`} className="ed-source-card">{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 14 · Internships, industry collaboration and corporate training. */
export function IndustrySection() {
  return (
    <section className="sk-container sk-section sk-industry" id="industry" aria-labelledby="industry-title" data-reveal>
      <div className="sk-section-heading">
        <div>
          <p className="sk-eyebrow">Industry</p>
          <h2 id="industry-title">Classroom, then the real world.</h2>
        </div>
      </div>
      <div className="sk-titled-grid">
        <TitledBlock
          title={internships.title}
          text={internships.text}
          items={internships.items}
        />
        <TitledBlock
          title={corporateTraining.title}
          text={corporateTraining.text}
          items={corporateTraining.items}
        />
        <TitledBlock
          title={industryCollaboration.title}
          text={industryCollaboration.text}
          items={industryCollaboration.items}
        />
        <TitledBlock title={bbaAdmissionReasons.title} items={bbaAdmissionReasons.items} />
      </div>
    </section>
  );
}

/** 15 · The placement news report. */
export function PlacementNewsSection() {
  return (
    <section className="sk-news-official" id="news" aria-labelledby="news-title" data-reveal>
      <div className="sk-container">
        <div className="sk-section-heading">
          <div>
            <p className="sk-eyebrow">News &amp; More · {placementNews.publishedIn}</p>
            <h2 id="news-title">{placementNews.title}</h2>
          </div>
        </div>
        <p className="sk-news-lead">{placementNews.lead}</p>
        {placementNews.body.map((paragraph, index) => (
          <p key={`news-${index}`}>{paragraph}</p>
        ))}
        <dl className="sk-news-figures">
          {placementNews.figures.map((figure) => (
            <div key={figure.value}>
              <dd>{figure.value}</dd>
              <dt>{figure.label}</dt>
            </div>
          ))}
        </dl>
        <h3>Hospitals and institutions</h3>
        <ul className="sk-news-employers">
          {placementNews.employers.map((employer) => (
            <li key={employer}>{employer}</li>
          ))}
        </ul>
        <OfficialPhoto
          mediaKey="campus/news-placements"
          alt="Westin students receiving travel documents at the placement ceremony"
          priority
          sizes="(min-width: 1024px) 620px, 100vw"
        />
        <SourceNote href={placementNews.source}>
          Read the original report in The Hindu
        </SourceNote>
      </div>
    </section>
  );
}

/** 16 · Success stories and student achievements. */
export function SuccessSection() {
  return (
    <section className="sk-container sk-section sk-success" id="success" aria-labelledby="success-title" data-reveal>
      <div className="sk-section-heading">
        <div>
          <p className="sk-eyebrow">{successStories.title}</p>
          <h2 id="success-title">Prizes, and the people who won them.</h2>
        </div>
        <p>{successStories.text}</p>
      </div>
      <div className="sk-success-grid">
        {successStories.achievements.map((item, index) => (
          <article key={item.title}>
            <div className="ed-photo-frame">
              <OfficialPhoto
                mediaKey={item.image.key}
                alt={item.image.alt}
                sizes="(max-width: 767px) calc(100vw - 44px), 340px"
              />
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            {index === 0 && <EditorialNote>Effort deserves its moment.</EditorialNote>}
          </article>
        ))}
      </div>
      <div className="sk-success-gallery">
        <GalleryStrip
          title={successStories.studentAwards.title}
          albumKey={successStories.studentAwards.album}
        />
        <GalleryStrip
          title={successStories.teamWestin.title}
          albumKey={successStories.teamWestin.album}
        />
        <GalleryStrip
          title={successStories.bbaSuccess.title}
          albumKey={successStories.bbaSuccess.album}
        />
      </div>
    </section>
  );
}

function GalleryStrip({ title, albumKey }: { title: string; albumKey: string }) {
  const photos = albumPhotos(albumKey, 8);
  if (!photos.length) return null;
  return (
    <div className="sk-gallery-strip">
      <h3>{title}</h3>
      <ul tabIndex={0} aria-label={`${title} photographs`}>
        {photos.map((photo) => (
          <li key={photo.src}>
            <img
              src={photo.src}
              srcSet={Array.isArray(photo.srcSet) ? photo.srcSet.join(", ") : photo.srcSet}
              sizes="160px"
              width={photo.width}
              height={photo.height}
              alt={`${title}: Westin college photograph`}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 17 · Alumni stories and the alumni gallery. */
export function AlumniSection() {
  return (
    <section className="sk-alumni" id="alumni" aria-labelledby="alumni-title" data-reveal>
      <div className="sk-container">
        <div className="sk-section-heading">
          <div>
            <p className="sk-eyebrow">Alumni at Westin</p>
            <h2 id="alumni-title">Where they are now.</h2>
          </div>
          <p>{site.legacyLine}</p>
        </div>
        <ul className="sk-alumni-grid">
          {alumniStories.map((person) => (
            <li key={person.id}>
              <OfficialPhoto
                mediaKey={person.image.key}
                alt={person.image.alt}
                sizes="(max-width: 767px) 88px, 160px"
              />
              <h3>{person.name}</h3>
              <p className="sk-voice-role">{person.role}</p>
              <p>{person.journey}</p>
            </li>
          ))}
        </ul>
        <GalleryStrip title="Alumni at Westin" albumKey="alumni" />
      </div>
    </section>
  );
}

/** 18 · Event galleries and album covers. */
export function EventsSection() {
  return (
    <section className="sk-container sk-section sk-events-official" id="events" aria-labelledby="events-title" data-reveal>
      <div className="sk-section-heading">
        <div>
          <p className="sk-eyebrow">What&rsquo;s happening at Westin</p>
          <h2 id="events-title">Events &amp; gallery albums.</h2>
        </div>
        <p>Eighteen event galleries and three album collections from the college.</p>
      </div>
      <ul className="sk-event-grid">
        {eventGalleries.map(([id, title, year]) => (
          <li key={id}>
            <Link to={`/campus/events/${id}`}>
              <span className="ed-photo-frame">
                <OfficialPhoto
                  mediaKey={`events/${id}/01`}
                  alt={`Westin ${title}${year ? ` ${year}` : ""} event photograph`}
                  sizes="(max-width: 767px) calc(100vw - 44px), 240px"
                />
              </span>
              <h3>{title}</h3>
            </Link>
          </li>
        ))}
      </ul>
      <div className="sk-albums">
        {albums.map((album) => (
          <article key={album.id}>
            <h3>{album.title}</h3>
            <p>
              <a href={album.source} target="_blank" rel="noopener noreferrer">
                View on the official gallery
                <span className="sr-only"> (opens a new tab)</span>
              </a>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

/** 19 · Westin Publishing House. */
export function PublishingSection() {
  return (
    <section className="sk-publishing" id="publishing" aria-labelledby="publishing-title" data-reveal>
      <div className="sk-container">
        <div className="sk-section-heading">
          <div>
            <p className="sk-eyebrow">Westin Publishing House</p>
            <h2 id="publishing-title">{publishingHouse.tagline}</h2>
          </div>
          <p>{publishingHouse.welcome}</p>
        </div>
        <div className="sk-publishing-vision">
          <div>
            <h3>Vision</h3>
            <p>{publishingHouse.vision}</p>
          </div>
          <div>
            <h3>Mission</h3>
            <p>{publishingHouse.mission}</p>
          </div>
        </div>
        <TitledBlock
          title={publishingHouse.whyChoose.title}
          items={publishingHouse.whyChoose.items}
        />
        <div className="sk-publishing-columns">
          <div>
            <h3>{publishingHouse.categories.title}</h3>
            <p>{publishingHouse.categories.intro}</p>
            <ul>
              {publishingHouse.categories.items.map((category) => (
                <li key={category.title}>
                  <strong>{category.title}</strong>
                  <span>{category.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{publishingHouse.studentProgram.title}</h3>
            <p>{publishingHouse.studentProgram.intro}</p>
            <h4>Who can apply</h4>
            <ul>
              {publishingHouse.studentProgram.whoCanApply.map((item, index) => (
                <li key={`who-${index}`}>{item}</li>
              ))}
            </ul>
            <h4>Benefits</h4>
            <ul>
              {studentAuthorBenefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h4>Publishing process</h4>
            <ol>
              {studentAuthorProcess.map((step) => (
                <li key={step.label}>
                  <strong>
                    {step.label}: {step.title}
                  </strong>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <TitledBlock
          title={publishingHouse.mentorship.title}
          text={publishingHouse.mentorship.intro}
          items={publishingHouse.mentorship.items}
        />
        <div className="sk-publishing-store">
          <h3>Check our new publications</h3>
          <ul>
            {publishingHouse.store.map((item, index) => (
              <li key={`store-${index}`}>
                <strong>{item.title}</strong>
                <span>{item.price}</span>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  View<span className="sr-only"> {item.title} (opens a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <h3>Documents</h3>
          <ul className="sk-documents">
            {publishingDocuments.map((doc) => (
              <li key={doc.title}>
                {doc.href ? (
                  <a href={doc.href} target="_blank" rel="noopener noreferrer">
                    {doc.title}
                    <span className="sr-only"> (PDF, opens a new tab)</span>
                  </a>
                ) : (
                  <span>
                    {doc.title}
                    {doc.note ? ` — ${doc.note}` : ""}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p>
            Magazines:{" "}
            {magazinePdfs.map((doc, index) => (
              <span key={doc.title}>
                {index > 0 && ", "}
                <a href={doc.href} target="_blank" rel="noopener noreferrer">
                  {doc.title}
                  <span className="sr-only"> (PDF, opens a new tab)</span>
                </a>
              </span>
            ))}
          </p>
          <p>
            <a href={`mailto:${publishingHouse.contact.email}`}>
              {publishingHouse.contact.email}
            </a>{" "}
            · <a href="tel:+919393755755">{publishingHouse.contact.phone}</a>
          </p>
        </div>
      </div>
    </section>
  );
}

/** 21 · FAQs, tabbed by audience and collapsible. */
export function FaqSection() {
  const [group, setGroup] = useState(0);
  const active = faqGroups[group];
  return (
    <section className="sk-container sk-section sk-faq" id="faq" aria-labelledby="faq-title" data-reveal>
      <div className="sk-section-heading">
        <div>
          <p className="sk-eyebrow">Frequently asked questions</p>
          <h2 id="faq-title">Answers, before you ask.</h2>
        </div>
        <p>Comprehensive courses tailored to your growth.</p>
      </div>
      <div className="sk-faq-tabs" role="tablist" aria-label="Question groups">
        {faqGroups.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`faq-tab-${item.id}`}
            aria-controls={`faq-panel-${item.id}`}
            aria-selected={group === index}
            tabIndex={group === index ? 0 : -1}
            onClick={() => setGroup(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {faqGroups
        .filter((item) => item.id !== active.id)
        .map((item) => (
          <div
            key={item.id}
            id={`faq-panel-${item.id}`}
            role="tabpanel"
            aria-labelledby={`faq-tab-${item.id}`}
            hidden
          />
        ))}
      <div
        className="sk-faq-list"
        role="tabpanel"
        id={`faq-panel-${active.id}`}
        aria-labelledby={`faq-tab-${active.id}`}
        tabIndex={0}
      >
        {active.items.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** 22 · Admissions 2026. */
export function AdmissionsSection() {
  return (
    <section className="sk-admissions-official" id="admissions-2026" aria-labelledby="admissions-title" data-reveal>
      <div className="sk-container">
        <div className="sk-section-heading">
          <div>
            <p className="sk-eyebrow">{admissions2026.badge}</p>
            <h2 id="admissions-title">Choose your course for 2026.</h2>
          </div>
          <p className="sk-admissions-line">{admissions2026.programmesLine}</p>
        </div>
        <div className="sk-course-highlights">
          {admissions2026.courses.map((course) => (
            <article key={course.title} className="ed-source-card">
              <h3>{course.title}</h3>
              <p className="sk-course-note">Highlights:</p>
              <ul>
                {course.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="sk-admissions-notes">
          <div className="ed-source-card">
            <h3>Hotel Management</h3>
            <p>{admissions2026.hotelNote}</p>
            <p className="sk-admissions-explore">{recognition.explore}</p>
          </div>
          <div className="ed-source-card">
            <h3>BBA</h3>
            <p>{admissions2026.bbaNote}</p>
            {admissions2026.bbaHighlights.map((paragraph, index) => (
              <p key={`bba-${index}`}>{paragraph}</p>
            ))}
          </div>
          <div className="ed-source-card">
            <h3>Junior Intermediate College</h3>
            <p>{admissions2026.juniorNote}</p>
          </div>
        </div>
        <TitledBlock title={bbaAdmissionReasons.title} items={bbaAdmissionReasons.items} />
        <div className="sk-admissions-psychometric ed-source-card">
          <h3>{admissions2026.psychometricTest.title}</h3>
          <p>{admissions2026.psychometricTest.note}</p>
          <a
            className="sk-button sk-button-outline"
            href={admissions2026.psychometricTest.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the Psychometric Test
            <span className="sr-only"> (opens a new tab)</span>
          </a>
        </div>
        <Link className="sk-text-link" to="/admissions#visit">
          Plan a campus tour and counselling
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

/**
 * 23 · Contact details, worldwide offices, affiliations, accreditations and the
 * counselling form. The form is entirely front-end: submitting it opens a
 * pre-filled WhatsApp message, so no enquiry data is sent to or stored by us.
 */
export function ContactSection() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState<string>(admissions2026.courses[0].title);
  const [phone, setPhone] = useState("");
  const phoneHref = (line: string) => {
    const digits = line.replace(/\D/g, "");
    return `tel:+${line.startsWith("+") ? digits : `91${digits.replace(/^0/, "")}`}`;
  };
  return (
    <>
      <section className="ed-shell ed-contact-overview" id="contact-official" aria-labelledby="contact-official-title">
        <div className="ed-secondary-heading"><p className="ed-kicker"><span className="ed-orange-rule" aria-hidden="true" />Reach the college</p><div><h2 id="contact-official-title">Talk to the college.</h2><p>Westin is more than just a place of learning; it&rsquo;s a place where dreams take flight, where ideas flourish, and where you&rsquo;ll find the support.</p></div></div>
        <div className="ed-contact-grid">
          <article className="ed-bento-card ed-bento-card--cream ed-contact-phone" onPointerMove={moveCardLight} onPointerLeave={resetCardLight}>
            <div className="ed-bento-card-copy"><span className="ed-bento-label">Call</span><h3>Speak to the Vijayawada team.</h3><ul className="ed-contact-phone-list">{[...site.contact.phones].reverse().map((line) => <li key={line}><a href={phoneHref(line)}>{line}</a></li>)}</ul></div>
          </article>
          <div className="sk-counselling ed-bento-card ed-contact-form" onPointerMove={moveCardLight} onPointerLeave={resetCardLight}>
          <span className="ed-bento-label">Ask a question</span>
          <h3>Get free counselling</h3>
          <p>
            Fill this in and we&rsquo;ll open WhatsApp with your details ready to send. Nothing is
            stored on this website.
          </p>
          <form
            className="sk-counselling-form"
            onSubmit={(event) => {
              event.preventDefault();
              const safeName = name.trim();
              const safePhone = phone.trim();
              const allowedCourse = admissions2026.courses.some((item) => item.title === course) || programmes.some((item) => item.name === course);
              if (!safeName || !/^[0-9+ ()-]{7,20}$/.test(safePhone) || !allowedCourse) return;
              const message = encodeURIComponent(`Hello Westin College, I would like free counselling about ${course}. My name is ${safeName} and my phone number is ${safePhone}.`);
              window.open(
                `https://wa.me/${site.contact.whatsapp}?text=${message}`,
                "_blank",
                "noopener",
              );
            }}
          >
            <div className="sk-field">
              <label htmlFor="counselling-name">First name</label>
              <input
                id="counselling-name"
                name="name"
                type="text"
                autoComplete="given-name"
                required
                maxLength={80}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="sk-field">
              <label htmlFor="counselling-phone">Phone</label>
              <input
                id="counselling-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                minLength={7}
                maxLength={20}
                pattern="[0-9+ ()-]{7,20}"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            <div className="sk-field">
              <label htmlFor="counselling-course">Course</label>
              <select
                id="counselling-course"
                name="course"
                value={course}
                onChange={(event) => setCourse(event.target.value)}
              >
                {admissions2026.courses.map((item) => (
                  <option key={item.title} value={item.title}>
                    {item.title}
                  </option>
                ))}
                {programmes.map((item) => (
                  <option key={item.slug} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="sk-button">
              <MessageCircle size={17} aria-hidden="true" />
              Send on WhatsApp
            </button>
          </form>
        </div>
          <article className="ed-bento-card ed-contact-email" onPointerMove={moveCardLight} onPointerLeave={resetCardLight}><div className="ed-bento-card-copy"><span className="ed-bento-label">Email</span><h3>Write to the team.</h3><p><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p></div></article>
          <article className="ed-bento-card ed-bento-card--sand ed-contact-address" onPointerMove={moveCardLight} onPointerLeave={resetCardLight}><div className="ed-bento-card-copy"><span className="ed-bento-label">Visit</span><h3>Find us in Vijayawada.</h3><p>{site.contact.address}. {site.contact.addressNote}.</p><a className="ed-contact-directions" href={site.contact.directions} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens a new tab)</span></a></div></article>
        </div>
        <SourceNote href={officialSources.contact}>Westin’s original Contact page</SourceNote>
      </section>
      <OfficialContentSection kind="contact" title="More ways to find Westin." intro="Westin lists these offices, affiliations and accreditations in its published college information.">
        <div className="ed-shell ed-contact-records">
          <article className="ed-contact-record-card ed-contact-offices ed-source-card"><h3>Westin offices</h3><ul className="sk-office-list">{site.offices.map((office) => <li key={office}>{office}</li>)}</ul></article>
          <article className="ed-contact-record-card ed-source-card"><h3>Affiliations</h3><ul>{site.affiliations.map((item) => <li key={item.name}><strong>{item.name}</strong><span>{item.note}</span></li>)}</ul></article>
          <article className="ed-contact-record-card ed-source-card"><h3>Accreditations</h3><ul>{site.accreditations.map((item) => <li key={item.name}><strong>{item.name}</strong><span>{item.note}</span></li>)}</ul></article>
        </div>
      </OfficialContentSection>
      <PublicFaq route="/contact" />
    </>
  );
}

/**
 * The official campaign taglines, each with its real photograph. The Programs
 * landing page presents them in a responsive grid beneath the course catalogue.
 */
export function CampaignTaglinesSection() {
  const groups: { label: string; items: { title: string; subtitle: string; image: Pic }[] }[] = [
    { label: "College of Hotel Management", items: heroTaglines },
    { label: "School of Business Management", items: businessTaglines },
    { label: "Junior College", items: juniorTaglines },
  ];
  return (
    <section className="sk-container sk-section sk-campaign" id="campaign" aria-labelledby="campaign-title" data-reveal>
      <div className="sk-section-heading">
        <div>
          <p className="sk-eyebrow">In the college&rsquo;s own words</p>
          <h2 id="campaign-title">The lines Westin leads with.</h2>
        </div>
        <p>
          These are the official campaign taglines from each school&rsquo;s landing page, each
          shown with its own photograph.
        </p>
      </div>
      {groups.map((group, groupIndex) => (
        <div key={group.label} className={`sk-campaign-group${groupIndex === 0 ? ' sk-campaign-group--hospitality' : ''}`}>
          <h3>{group.label}</h3>
          <ul aria-label={`${group.label} campaign photographs`}>
            {group.items.map((item, index) => (
              <li key={`${group.label}-${index}`} className="ed-source-card">
                <div className="ed-photo-frame">
                  <OfficialPhoto
                    mediaKey={item.image.key}
                    alt={item.image.alt}
                    sizes="(max-width: 767px) 78vw, 380px"
                  />
                </div>
                <p className="sk-campaign-title">{item.title}</p>
                <p className="sk-campaign-sub">{item.subtitle}</p>
                {groupIndex === 0 && index === 1 && <EditorialNote>Care lives in the details.</EditorialNote>}
                {groupIndex === 0 && index === 5 && <EditorialNote>Lead with purpose.</EditorialNote>}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="sk-campaign-group">
        <h3>Westin Publishing House</h3>
        <ul>
          {publishingTaglines.map((item, index) => (
            <li key={`publishing-${index}`} className="ed-source-card">
              <p className="sk-campaign-title">{item.title}</p>
              <p className="sk-campaign-sub">{item.subtitle}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** The Two-Year Junior College Program in full: objectives, outcomes, features. */
export function JuniorProgrammeSection() {
  return (
    <section className="sk-container sk-section sk-junior-detail" id="junior-programme" aria-labelledby="junior-detail-title" data-reveal>
      <div className="sk-section-heading">
        <div>
          <p className="sk-eyebrow">{juniorProgrammeDetail.title}</p>
          <h2 id="junior-detail-title">{juniorProgrammeDetail.stream}</h2>
        </div>
      </div>
      <p className="sk-catalogue-intro">{juniorProgrammeDetail.overview}</p>
      <div className="sk-titled-grid">
        <TitledBlock title="Program Objectives" items={juniorProgrammeDetail.objectives} />
        <TitledBlock title="Learning Outcomes" items={juniorProgrammeDetail.learningOutcomes} />
        <TitledBlock title="Program Objectives" items={juniorProgrammeDetail.programObjectives} />
        <TitledBlock title="Internship &amp; Practical Learning" items={juniorProgrammeDetail.practicalLearning} />
      </div>
      <TitledBlock title="Course Structure &amp; Key Features" items={juniorProgrammeDetail.keyFeatures} />
      <p className="sk-vision-legacy">{juniorProgrammeDetail.closing}</p>
      <SourceNote href={juniorProgrammeDetail.source}>Westin&rsquo;s junior college course page</SourceNote>
    </section>
  );
}

/** The Diploma in Food Production objectives and framework, in the official wording. */
export function FoodProductionSection() {
  return (
    <section className="sk-container sk-section sk-food" id="food-production" aria-labelledby="food-title" data-reveal>
      <div className="sk-section-heading">
        <div>
          <p className="sk-eyebrow">Diploma In Food Production</p>
          <h2 id="food-title">{foodProductionDetail.title}</h2>
        </div>
      </div>
      <ol className="sk-timeline">
        {foodProductionDetail.steps.map((step) => (
          <li key={step.label}>
            <span>{step.label}</span>
            <strong>{step.title}</strong>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
      <SourceNote href={foodProductionDetail.source}>Westin&rsquo;s Diploma in Food Production page</SourceNote>
    </section>
  );
}
