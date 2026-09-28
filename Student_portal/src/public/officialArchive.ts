/** Editorial migration of distinct information in Westin's public articles and event galleries.
 * Long articles are paraphrased; source URLs and publication dates remain attached.
 */
export type ArchiveKind = 'blog' | 'campus-events' | 'news' | 'success-stories'
export interface OfficialArchiveEntry {
  id: string
  kind: ArchiveKind
  title: string
  summary: string
  source: string
  date?: string
  context?: string
  paragraphs: string[]
  points?: string[]
  image?: string
  imageAlt?: string
}

const blogBase = 'https://www.westincollegevijayawada.com/post/'
const eventBase = 'https://www.westincollegevijayawada.com/events/'

const studyNotes: Record<string, string[]> = {
  business: [
    'The guide connects a BBA foundation in management, marketing, finance and communication with cases, projects and industry experience.',
    'Westin describes internships, specialisation and career guidance as ways to turn classroom knowledge into workplace confidence.',
    'Students interested in management, entrepreneurship or higher study can compare the three and four-year BBA routes in our program catalog.',
  ],
  hospitality: [
    'Hospitality study combines food production, food and beverage service, front office and housekeeping with communication and guest care.',
    'The college describes practical labs, hotel exposure and internships as essential parts of preparing for service and leadership roles.',
    'Degree, diploma and food-production routes have different durations and entry requirements; the program catalog sets these out individually.',
  ],
  intermediate: [
    'MEC combines mathematics, economics and commerce. CEC combines civics, economics and commerce.',
    'Westin presents these streams as a foundation for later study in business, finance, professional qualifications and related fields.',
    'The junior-college material also describes mentoring, clubs and career guidance alongside academic preparation.',
  ],
  placements: [
    'Westin links employability to internships, practical skill, communication, interviews and specialised training.',
    'Its published material describes opportunities in India and abroad. Individual results and campus records should be read with their original dates.',
    'The placements page gathers Westin’s reported figures and older records with the source and campus context supplied by each page.',
  ],
  admissions: [
    'The guide encourages students to compare curriculum, hands-on facilities, internships and support before choosing a course.',
    'Westin publishes different entry routes for degrees, diplomas and intermediate study. The course pages provide their stated requirements.',
    'For current fees, availability and a campus visit, the Vijayawada team can be reached directly by phone, email or WhatsApp.',
  ],
  college: [
    'Westin traces its educational story to 1999 and brings hospitality, business and junior-college study together in Vijayawada.',
    'Its teaching approach connects classroom learning with practical work, educator guidance and industry exposure.',
    'The About, Campus and Placements pages expand on the people, facilities and career pathways described in the original article.',
  ],
}

function post(id: string, title: string, date: string, topic: keyof typeof studyNotes, summary: string, points?: string[]): OfficialArchiveEntry {
  return { id, kind: 'blog', title, date, summary, source: blogBase + id, paragraphs: studyNotes[topic], points }
}

const blogEntries: OfficialArchiveEntry[] = [
  // Four articles whose full text now lives in officialArticles.ts. Each is
  // listed here so it gets a /blog/<id> route and appears in the journal index.
  post('alumni-success-stories', 'Alumni Success Stories', '2024-12-24', 'college', 'Westin alumni in hospitality leadership around the world.', undefined),
  post('diploma-hotel-management-vijayawada', 'Diploma in Hotel Management Vijayawada: Your Gateway to a Thriving Hospitality Career', '2025-11-14', 'hospitality', 'A guide to the diploma in hotel management route and what it leads to.', undefined),
  post('hotel-management-colleges-in-andhra-pradesh', 'Hotel Management Colleges in Andhra Pradesh', '2025-11-14', 'hospitality', 'A career guide to hotel management education across Andhra Pradesh.', undefined),
  post('yuva-tourism-event-2024', 'YUVA Tourism Event 2024', '2024-12-24', 'college', 'A record of student activities connecting hospitality study with creative and practical challenges.', undefined),

  post('build-your-future-with-westin-school-of-business-management-vijayawada', 'Build Your Future with Westin School of Business Management, Vijayawada', '2025-11-14', 'business', 'A guide to Westin’s practice-led approach to business management in Vijayawada.', ['Learning through cases and business activity', 'Leadership and communication alongside subject knowledge']),
  post('hotel-management-colleges-in-vijayawada-a-complete-guide', 'Hotel Management Colleges in Vijayawada: A Complete Guide', '2025-11-14', 'hospitality', 'What to consider when comparing hospitality courses and practical training in Vijayawada.', ['Training spaces and hotel exposure', 'Career directions in hotels, tourism and events']),
  post('top-bba-colleges-in-vijayawada', 'Top BBA Colleges in Vijayawada', '2025-11-14', 'business', 'Westin’s guide to the subjects and workplace opportunities a BBA can open.', ['Management, marketing, finance and human resources', 'Routes into companies, banking and entrepreneurship']),
  post('which-is-the-best-college-in-international-placements', 'Which is the Best College in International Placements?', '2025-11-25', 'placements', 'A student guide to evaluating international career preparation and placement support.', ['Experience of different workplace cultures', 'Practical preparation before interviews']),
  {
    id: 'alumni-success-stories', kind: 'blog', title: 'Alumni Success Stories', date: '2024-12-24',
    summary: 'Westin profiles graduates whose hospitality careers developed through internships, mentoring and later leadership roles.', source: blogBase + 'alumni-success-stories',
    paragraphs: [
      'Sudharshan Motupalli describes learning from mentors, interning at Sheraton in Bahrain and progressing through hotel roles. The article identifies him as a general manager in Vijayawada at publication.',
      'Vara Prasad describes moving from hotel-management study into reservations leadership with Rotana.',
      'Indra Kiran describes an early campus interview and a path through hotel food and beverage work into leadership.',
    ], points: ['Career titles reflect the 24 December 2024 article, not a live alumni directory.'],
  },
  post('best-colleges-in-vijayawada-andhra-pradesh-for-hotel-management-business-management-intermediat', 'Choosing Hospitality, Business or Intermediate Study in Vijayawada', '2025-11-22', 'college', 'A comparison of the three broad study directions offered by Westin.', ['Hospitality needs practical labs and hotel exposure', 'Business develops management and leadership', 'Intermediate study builds a subject foundation']),
  post('hotel-management-course-vijayawada', 'Hotel Management Course After 12th in Vijayawada', '2026-04-20', 'hospitality', 'A guide to degree and diploma pathways into hotel and hospitality work.', ['Compare course length and practical training', 'Explore hotels, resorts, tourism and event work']),
  post('best-college-to-study-in-vijayawada-and-andhra-pradesh', 'Choosing a College in Vijayawada and Andhra Pradesh', '2025-12-16', 'admissions', 'Westin’s guide to comparing teaching, facilities, support and career opportunities.', ['Visit the campus where possible', 'Ask how practical work and mentoring fit the course']),
  post('westin-school-of-business-management-a-top-bba-college-in-india', 'Westin School of Business Management', '2025-11-10', 'business', 'An introduction to workshops, simulations and educator guidance in Westin’s BBA teaching.', ['Cases and business simulations', 'Faculty support for skill development']),
  {
    id: 'yuva-tourism-event-2024', kind: 'blog', title: 'YUVA Tourism Event 2024', date: '2024-12-24',
    summary: 'A record of student activities connecting hospitality study with creative and practical challenges.', source: blogBase + 'yuva-tourism-event-2024',
    paragraphs: ['The article describes a digital campaign activity dated 8 July 2023, where students practised planning and measuring hospitality marketing.', 'It also records a blind ingredient-identification challenge dated 5 August 2023. The article itself was published in December 2024.'],
    points: ['Activity dates and article publication date are distinct.'],
  },
  post('westin-the-best-college-of-hotel-management-in-vijayawada', 'Hotel Management at Westin in Vijayawada', '2025-11-24', 'hospitality', 'An overview of Westin’s teaching style, practical learning and hospitality career directions.', ['Kitchen and front-office practice', 'Preparation for hotel, tourism and event roles']),
  post('top-10-hotel-management-colleges-in-vijayawada', 'Comparing Hotel Management Colleges in Vijayawada', '2025-11-10', 'hospitality', 'A guide to the skills and experience prospective hospitality students should seek.', ['Guest care and communication', 'Hotels, restaurants, cruise lines and airlines as career settings']),
  post('westin-the-best-college-of-hotel-management-in-andhra-pradesh', 'Westin Hotel Management in Andhra Pradesh', '2025-11-24', 'hospitality', 'Westin’s account of its history and practical hospitality training.', ['College history beginning in 1999', 'Facilities, training and placement support']),
  post('westin-the-best-college-of-business-management-in-andhra-pradesh', 'Westin Business Management in Andhra Pradesh', '2025-11-24', 'business', 'A look at Westin’s business teaching, faculty and workplace exposure.', ['Practice-led business education', 'Industry interaction and career support']),
  post('westin-college-of-hotel-management-vijayawada-the-top-hotel-management-college-in-india', 'Inside Westin Hotel Management', '2025-11-10', 'hospitality', 'A description of food labs, front-office learning and guest-service skills.', ['Learn through realistic service situations', 'Combine theory with department practice']),
  post('which-is-the-best-intermediate-college-in-vijayawada', 'Choosing Intermediate Study in Vijayawada', '2025-11-27', 'intermediate', 'Westin’s guide to judging academic support and future options after Class 10.', ['Compare subject combinations', 'Consider mentoring and career guidance']),
  post('best-colleges-in-vijayawada-andhra-pradesh-for-hotel-management-business-management-intermediat-1', 'Study Choices in Vijayawada and Andhra Pradesh', '2025-11-27', 'college', 'A follow-up guide comparing hospitality, business and intermediate education.', ['Course content and training matter', 'Industry exposure can support career planning']),
  post('bba-admission-vijayawada-best-bba-colleges', 'BBA Admission in Vijayawada', '2026-04-20', 'admissions', 'What to review before choosing a BBA, from subjects to placement preparation.', ['Check eligibility and course structure', 'Ask about internships and project work']),
  post('dhm-course-details-vijayawada-1', 'DHM Course Details, Eligibility and Fees in Vijayawada', '2026-04-03', 'admissions', 'A guide to the shorter hotel-management diploma route and the questions to ask before applying.', ['Practical hotel-department skills', 'Confirm current fees directly with admissions']),
  post('mec-cec-junior-college-vijayawada', 'MEC and CEC Junior College Admissions Guide', '2026-04-20', 'intermediate', 'A guide to subject combinations and further-study directions for MEC and CEC.', ['MEC: mathematics, economics and commerce', 'CEC: civics, economics and commerce', 'Possible later study in commerce, management and professional qualifications']),
  post('bba-admission-in-vijayawada', 'BBA Admission in Vijayawada: Student Guide', '2026-03-30', 'admissions', 'An introduction to BBA subject areas and how to compare management programs.', ['Marketing, finance and entrepreneurship', 'Ask about practical projects and internships']),
  post('westin-the-best-college-of-business-management-in-vijayawada', 'Business Management at Westin Vijayawada', '2025-11-24', 'business', 'Westin’s account of its business faculty, practical learning and career preparation.', ['Established in 1999', 'Classroom learning linked to industry exposure']),
  post('westin-college-of-hotel-management-ug-courses-2025-a-simple-student-guide', 'Westin Undergraduate Courses: Student Guide', '2025-11-21', 'hospitality', 'A guide to B.Sc. hospitality, BHM Honours, BBA and shorter skill courses mentioned by Westin.', ['Three-year B.Sc. in Hospitality and Hotel Administration', 'Four-year BHM Honours and three-year BBA', 'The article also mentions one-year food production and F&B service/housekeeping, plus six-month bakery and mixology options']),
  post('find-the-best-bba-college-in-vijayawada-and-andhra-pradesh-a-simple-student-guide', 'Finding a BBA College in Vijayawada', '2025-11-17', 'admissions', 'A student-focused comparison of BBA content, support and future directions.', ['Understand the subjects before applying', 'Compare teaching, campus and career guidance']),
  post('hotel-management-colleges-in-vijayawada-fees', 'Hotel Management Fees in Vijayawada: A Guide', '2026-04-10', 'admissions', 'Questions to ask when planning the cost of hospitality education.', ['Compare total course costs, not just one fee', 'Contact Westin for its current course-specific fee schedule']),
  post('the-best-college-for-hotel-management-placement', 'Hotel Management Placement: What to Consider', '2025-11-25', 'placements', 'How training, internships and placement support contribute to a hospitality career.', ['Practical skills help at the first job', 'Read outcomes with their date and campus context']),
  post('westin-college-of-hotel-management-vijayawada-the-top-hotel-management-college-in-india-1', 'Practical Hotel Management at Westin', '2025-11-10', 'hospitality', 'A second Westin article on training in food labs and front-office settings.', ['Realistic guest-service practice', 'Theory and practical work together']),
  post('best-jr-college-in-andhra-pradesh-a-complete-guide-for-students-in-2026', 'Junior College in Andhra Pradesh: Student Guide', '2025-11-27', 'intermediate', 'A guide to selecting an intermediate course after Class 10.', ['Choose subjects for your next study direction', 'Look for teaching, support and student activities']),
  post('westin-college-of-hotel-and-business-management-the-pride-of-vijay', 'Westin College of Hotel and Business Management', '2025-11-12', 'college', 'An introduction to the college’s hospitality and business learning in Vijayawada.', ['Industry-facing degree programs', 'Practical training and career guidance']),
]

const eventTitles: Array<[string, string, string?]> = [
  ['bhm-diwali-2024', 'BHM Diwali 2024', '2024'], ['cake-distribution', 'Cake distribution'],
  ['cake-mixing', 'Cake mixing'], ['flower-decoration', 'Flower decoration'],
  ['ghsdp-2024', 'Global Hospitality Skill Development Programme 2024', '2024'],
  ['iftar-party', 'Iftar gathering'], ['independence', 'Independence celebration'],
  ['janstami-bhm', 'Janmashtami with BHM students'], ['mr-and-ms', 'Mr & Ms'],
  ['old-age-home', 'Old age home visit'], ['onam', 'Onam celebration'],
  ['pattabi', 'Pattabi'], ['sankranthi', 'Sankranthi celebration'],
  ['sparkles', 'Sparkles'], ['vinayaka-chavithi', 'Vinayaka Chavithi'],
  ['tourism-2024', 'Tourism 2024', '2024'], ['star', 'Star'], ['sparkles-2024', 'Sparkles 2024', '2024'],
]

const eventEntries: OfficialArchiveEntry[] = eventTitles.map(([id, title, date]) => ({
  id, kind: 'campus-events', title, date,
  summary: `A Westin event gallery documenting ${title.toLowerCase()} through college photography.`,
  source: eventBase + (id === 'mr-and-ms' ? 'mr-%26-ms' : id),
  paragraphs: [
    `Westin’s event collection includes a gallery for ${title}. The source page identifies the activity by name and photographs; it does not provide a written programme or a full event date${date ? ' beyond the year in its title' : ''}.`,
    'Explore the college gallery for more student activities, celebrations and practical learning moments.',
  ],
  image: `/images/official/events/${id}.webp`,
  imageAlt: `Photograph from Westin’s ${title} event gallery`,
}))

export const officialArchive: OfficialArchiveEntry[] = [
  ...blogEntries,
  ...eventEntries,
  {
    id: 'international-hotel-placements-2017-18', kind: 'news', title: 'International hotel interviews, 2017–18', date: '2018', context: 'Hyderabad campus',
    summary: 'The legacy Westin page records interviews by hospitality employers at its Hyderabad campus in 2017–18.',
    source: 'https://www.westincolleges.com/vij/placements.html',
    paragraphs: ['Westin’s legacy placement record names Atlantis The Palm, Kempinski, Madinat Jumeirah, Anantara, Dubai World Trade Centre, Sheraton and other employers that interviewed students at Hyderabad.', 'The page reports that 66% of final-year students had an international job or internship before finishing in 2017–18. This is a dated Hyderabad record, not a present-day Vijayawada rate.'],
  },
  {
    id: 'westin-students-uae-bahrain', kind: 'news', title: 'Westin students take hotel roles in the UAE and Bahrain', date: '2018–2021 batch', context: 'Vijayawada',
    summary: 'Westin’s news archive reports overseas hotel placements and a college ceremony for the students.',
    source: 'https://www.westincollegevijayawada.com/news-and-more',
    paragraphs: ['The account says 103 students were placed across six hotels and institutions in Dubai and Bahrain.', 'It attributes a statement about 90% of the 2018–2021 students being placed in five-star hotels to principal P. Chandrasekhar. The percentages and destinations are presented here as the archive reported them.'],
  },
]

export function archivePath(entry: OfficialArchiveEntry) {
  return entry.kind === 'campus-events' ? `/campus/events/${entry.id}` : `/${entry.kind}/${entry.id}`
}

export function findArchiveEntry(pathname: string) {
  return officialArchive.find((entry) => archivePath(entry) === pathname.replace(/\/+$/, ''))
}
