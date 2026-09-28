export type PublicPageKind =
  | 'about' | 'partners' | 'why-westin' | 'programs' | 'campus' | 'placements'
  | 'news' | 'blog' | 'campus-events' | 'gallery' | 'magazine'
  | 'testimonials' | 'success-stories' | 'admissions' | 'contact'

/** Official Westin pages used for the sourced public copy. */
export const sources = {
  home: 'https://www.westincollegevijayawada.com/',
  about: 'https://www.westincollegevijayawada.com/about-us',
  vision: 'https://www.westincollegevijayawada.com/vision-mision',
  bba: 'https://www.westincollegevijayawada.com/bba',
  bbaHonours: 'https://www.westincollegevijayawada.com/bba-4-years-programe',
  bhm: 'https://www.westincollegevijayawada.com/3-years-degree-program',
  bhmHonours: 'https://www.westincollegevijayawada.com/4-years-degree-program',
  workIntegrated: 'https://www.westincollegevijayawada.com/diploma-in-hotel-management',
  dhm: 'https://www.westincollegevijayawada.com/dhm-1-year-course',
  food: 'https://www.westincollegevijayawada.com/diploma-in-food-production',
  pgdhm: 'https://www.westincollegevijayawada.com/pgdm',
  junior: 'https://www.westincollegevijayawada.com/westin-junior-college',
  juniorCourses: 'https://www.westincollegevijayawada.com/blank-1-4-1',
  business: 'https://www.westincollegevijayawada.com/bba-college-in-vijayawada',
  hotelCollege: 'https://www.westincollegevijayawada.com/blank',
  hotelCollegeDetailed: 'https://www.westincollegevijayawada.com/hotel-management-college-in-vijayawada',
  faculty: 'https://www.westincollegevijayawada.com/faculty-excellence',
  corporateTraining: 'https://www.westincollegevijayawada.com/corporate-training',
  internship: 'https://www.westincollegevijayawada.com/internship',
  studentLife: 'https://www.westincollegevijayawada.com/student-life',
  admissions: 'https://www.westincollegevijayawada.com/admission-page',
  courseGuide: 'https://www.westincollegevijayawada.com/post/westin-college-of-hotel-management-ug-courses-2025-a-simple-student-guide',
  events: 'https://www.westincollegevijayawada.com/event',
  gallery: 'https://www.westincollegevijayawada.com/gallery',
  publishing: 'https://www.westincollegevijayawada.com/blank-1-2-1-1-1-1-1-1-1-2-1',
  contact: 'https://www.westincollegevijayawada.com/contact',
  legacyHome: 'https://www.westincolleges.com/vij/',
  legacyWhy: 'https://www.westincolleges.com/vij/why-westin.html',
  legacyBba: 'https://www.westincolleges.com/vij/business-management.html',
  legacyPlacements: 'https://www.westincolleges.com/vij/placements.html',
  legacyPartners: 'https://www.westincolleges.com/vij/bineid.html',
  legacyManagement: 'https://www.westincolleges.com/vij/management-team.html',
  alumni: 'https://www.westincollegevijayawada.com/post/alumni-success-stories',
  newsMore: 'https://www.westincollegevijayawada.com/news-and-more',
} as const

export interface PublicProgram {
  slug: string
  group: 'Business' | 'Hospitality' | 'Junior college'
  label: string
  title: string
  summary: string
  detail: string
  color: string
  facts: string[]
  learning: string[]
  entry: string
  outcomes: string
  source: string
  related?: string[]
}

export interface PublicSection {
  title: string
  body: string
  points?: string[]
  source: string
}

export interface PublicRecord {
  id: string
  kind: PublicPageKind
  label: string
  title: string
  summary: string
  source: string
  date?: string
  context?: string
}

export const otherStudyOptions = [
  { title: 'B.Sc. in Hospitality & Hotel Administration', detail: 'Three-year degree mentioned in Westin’s 2026 undergraduate guide, including hotel operations, bakery, guest care and internships.', source: sources.courseGuide },
  { title: 'Food & Beverage Service and Housekeeping', detail: 'One-year skill course mentioned in Westin’s undergraduate guide.', source: sources.courseGuide },
  { title: 'Bakery and Confectionery', detail: 'Six-month skill course mentioned in Westin’s undergraduate guide.', source: sources.courseGuide },
  { title: 'Mixology / Bartending', detail: 'Six-month skill course mentioned in Westin’s undergraduate guide.', source: sources.courseGuide },
] as const

/** A sourced catalog. Home still introduces the three broad study directions. */
export const fixturePrograms: PublicProgram[] = [
  {
    slug: 'bba', group: 'Business', label: 'Three-year BBA', title: 'Bachelor of Business Administration',
    summary: 'Business foundations, live projects and industry learning in a three-year degree.',
    detail: 'Westin combines management, economics, analytics, finance and entrepreneurship with case studies, workplace projects and communication practice.',
    color: '#3BA7F2', facts: ['Three-year degree', 'Business specialisations', 'Projects and internships'],
    learning: ['Management, economics, finance and analytics', 'Marketing, human resources and entrepreneurship', 'Case studies, live projects and industry interaction'],
    entry: 'The course page lists 10+2 from a recognised board and 50% aggregate, subject to university and reservation rules.',
    outcomes: 'Westin describes business roles, enterprise and postgraduate study as possible next steps.',
    source: sources.bba, related: ['bba-honours'],
  },
  {
    slug: 'bba-honours', group: 'Business', label: 'Four-year BBA', title: 'BBA (Honours)',
    summary: 'An honours year adds research, innovation and deeper specialisation to business study.',
    detail: 'The route starts with business fundamentals, adds applied projects and industry exposure, then finishes with a mentored research project.',
    color: '#3BA7F2', facts: ['Four-year honours degree', 'Business specialisation', 'Final-year research'],
    learning: ['Management, accounting and organisational behaviour', 'Case studies, projects and internships', 'Specialisation and a mentored research project'],
    entry: 'Westin lists 10+2 and 50% aggregate, subject to university and reservation rules.',
    outcomes: 'The college connects the course to leadership, enterprise, research and further study.',
    source: sources.bbaHonours, related: ['bba'],
  },
  {
    slug: 'hotel-management', group: 'Hospitality', label: 'Hotel management', title: 'Hotel management pathways',
    summary: 'Compare Westin’s hospitality degrees, work-integrated route and diplomas.',
    detail: 'The college teaches food production, food and beverage service, front office and housekeeping, alongside communication and industry experience.',
    color: '#F2A159', facts: ['Degrees and diplomas', 'Four hotel departments', 'Industry learning'],
    learning: ['Food production and culinary practice', 'Food and beverage service, front office and housekeeping', 'Communication, soft skills and hotel operations'],
    entry: 'Entry requirements differ by course. Open a specific route below for the requirements published by Westin.',
    outcomes: 'Degree, work-integrated and shorter diploma routes lead toward different hospitality roles.',
    source: sources.bhm, related: ['bhm-three-year', 'bhm-honours', 'work-integrated-hotel-management', 'dhm-one-year', 'food-production', 'pgdhm'],
  },
  {
    slug: 'bhm-three-year', group: 'Hospitality', label: 'Three-year BHM', title: 'Bachelor of Hotel Management',
    summary: 'A three-year hotel-management degree with practical foundations, internship experience and specialisation.',
    detail: 'Students study the four core hotel departments and communication, followed by industry experience and specialised practical learning.',
    color: '#F2A159', facts: ['Three-year degree', 'Hotel operations', 'Industry internship'],
    learning: ['Food production, service, front office and housekeeping', 'Professional communication', 'Internship and selected specialisation'],
    entry: 'Westin lists 10+2 from any stream, 50% aggregate subject to university rules, and hospitality-related medical fitness.',
    outcomes: 'The course page describes domestic and international hospitality career preparation.',
    source: sources.bhm, related: ['bhm-honours', 'work-integrated-hotel-management'],
  },
  {
    slug: 'bhm-honours', group: 'Hospitality', label: 'Four-year BHM', title: 'BHM (Honours)',
    summary: 'A four-year hotel-management degree with a final year of specialisation and research.',
    detail: 'After practical foundations and industry exposure, a guided fourth-year project develops analytical and managerial skills.',
    color: '#F2A159', facts: ['Four-year honours degree', 'Hotel operations', 'Final-year research'],
    learning: ['Four core hotel departments', 'Internship and specialised practical training', 'A year-long research project'],
    entry: 'Westin lists 10+2 from any stream, 50% aggregate subject to university rules, and hospitality-related medical fitness.',
    outcomes: 'The college connects the honours route with advanced hospitality roles.',
    source: sources.bhmHonours, related: ['bhm-three-year'],
  },
  {
    slug: 'work-integrated-hotel-management', group: 'Hospitality', label: 'Work-integrated', title: 'Work-integrated hotel management',
    summary: 'A three-year route combining hospitality study, specialisation and extended work-based training.',
    detail: 'Westin’s detailed course page describes a three-year work-integrated degree; its menu calls the page a diploma. This page follows the detailed course wording.',
    color: '#F2A159', facts: ['Three-year route', 'Work-integrated learning', 'Hotel operations'],
    learning: ['Four core departments and communication', 'Industry internship and specialisation', 'Extended final-year work training'],
    entry: 'The page lists 10th pass or 12th pass/fail, ages generally 16–25, and basic medical fitness.',
    outcomes: 'Westin describes domestic and international hotel career paths.',
    source: sources.workIntegrated, related: ['bhm-three-year', 'dhm-one-year'],
  },
  {
    slug: 'dhm-one-year', group: 'Hospitality', label: 'One-year diploma', title: 'Diploma in Hotel Management',
    summary: 'An introduction to hotel departments, followed by specialisation and workplace experience.',
    detail: 'The diploma page covers food production, service, front office, housekeeping and professional communication, followed by an internship.',
    color: '#F2A159', facts: ['One-year diploma', 'Four hotel departments', 'Professional internship'],
    learning: ['Hotel operations and communication', 'Selected specialisation', 'Professional hospitality experience'],
    entry: 'Westin lists a recognised 10th pass, ages generally 18–25, and basic medical fitness.',
    outcomes: 'The college presents the diploma as a route into operational hospitality work.',
    source: sources.dhm, related: ['work-integrated-hotel-management'],
  },
  {
    slug: 'food-production', group: 'Hospitality', label: 'Culinary diploma', title: 'Diploma in Food Production',
    summary: 'Kitchen operations, cooking, presentation, safety and practical industry experience.',
    detail: 'Students learn preparation, culinary techniques, food safety, menu planning and practical kitchen work.',
    color: '#F2A159', facts: ['Culinary specialisation', 'Food safety', 'Kitchen practice'],
    learning: ['Food preparation and cooking techniques', 'Hygiene and kitchen operations', 'Menus, recipes and industry exposure'],
    entry: 'Westin lists 10th pass or 12th pass/fail, ages generally 16–25, and basic medical fitness.',
    outcomes: 'The page points to hotel, restaurant and catering kitchens.',
    source: sources.food, related: ['dhm-one-year'],
  },
  {
    slug: 'pgdhm', group: 'Hospitality', label: 'Postgraduate diploma', title: 'Post Graduate Diploma in Hotel Management',
    summary: 'Hospitality operations, management, leadership and industry projects after a degree.',
    detail: 'Westin lists a one-year PGDHM covering operations, marketing, finance and people management, with cases and practical exposure.',
    color: '#F2A159', facts: ['One-year postgraduate diploma', 'Hospitality management', 'Industry project'],
    learning: ['Hotel operations and strategy', 'Marketing, finance and human resources', 'Cases, simulations and industry projects'],
    entry: 'The page lists a bachelor’s degree in any discipline, 50% aggregate and age generally below 27.',
    outcomes: 'Westin describes supervisory and managerial hospitality roles.',
    source: sources.pgdhm, related: ['bhm-three-year', 'bhm-honours'],
  },
  {
    slug: 'intermediate', group: 'Junior college', label: 'MEC / CEC', title: 'Intermediate: MEC and CEC',
    summary: 'A two-year commerce and economics foundation with mathematics or civics.',
    detail: 'MEC combines Mathematics, Economics and Commerce. CEC combines Civics, Economics and Commerce. Westin connects both with later business and professional study.',
    color: '#67C7A1', facts: ['Two-year intermediate', 'MEC and CEC', 'Commerce and economics'],
    learning: ['MEC: mathematics, economics and commerce', 'CEC: civics, economics and commerce', 'Clubs, workshops, mentorship and guidance'],
    entry: 'The junior-college site describes entry after Class 10 and provides the current admissions contact.',
    outcomes: 'The site lists BBA, B.Com, CA, CS and other higher-study directions.',
    source: sources.juniorCourses, related: ['bba'],
  },
]

export const publicPageCopy: Record<PublicPageKind, { eyebrow: string; title: string; summary: string }> = {
  about: { eyebrow: 'About Westin', title: 'A college for the next chapter.', summary: 'Meet Westin College of Hotel and Business Management and its Vijayawada story.' },
  partners: { eyebrow: 'Partners and affiliations', title: 'Connections that open doors.', summary: 'Explore the academic, industry and career relationships described by Westin.' },
  'why-westin': { eyebrow: 'Why Westin', title: 'Learn by doing. Grow with people.', summary: 'See how Westin connects teaching, practical work, feedback and career guidance.' },
  programs: { eyebrow: 'Find your kind of future', title: 'Start with a direction, then make it yours.', summary: 'Compare Westin’s business, hospitality and junior-college courses.' },
  campus: { eyebrow: 'Campus life', title: 'A place to learn, practise, and belong.', summary: 'Explore classrooms, hospitality practice, clubs and life beyond lessons.' },
  placements: { eyebrow: 'From campus to career', title: 'Preparation opens possibilities.', summary: 'Read about internships, career support and outcomes published by Westin.' },
  news: { eyebrow: 'Campus journal', title: 'What is happening at Westin.', summary: 'College updates and achievements from our Vijayawada and legacy archives.' },
  blog: { eyebrow: 'Westin journal', title: 'Ideas worth spending time with.', summary: 'Explore guidance on study, hospitality, business and student life.' },
  'campus-events': { eyebrow: 'Happening here', title: 'The moments make the place.', summary: 'Celebrations and past events documented by Westin.' },
  gallery: { eyebrow: 'Gallery', title: 'See learning in action.', summary: 'Official collections of culinary practice, student projects and campus events.' },
  magazine: { eyebrow: 'The Westin shelf', title: 'Stories to turn a page for.', summary: 'Explore Sattvika, Table and Westin Publishing House.' },
  testimonials: { eyebrow: 'Westin voices', title: 'Hear from the people behind the stories.', summary: 'Attributed experiences already published on Westin’s sites.' },
  'success-stories': { eyebrow: 'Success stories', title: 'Where their paths took them.', summary: 'Alumni and career stories published by Westin.' },
  admissions: { eyebrow: 'Your next page', title: 'Take the next step with clear information.', summary: 'Compare courses, contact Vijayawada and plan a college visit.' },
  contact: { eyebrow: 'Contact Westin', title: 'Let’s make the next step easier.', summary: 'Reach the Vijayawada team by phone, email or a visit.' },
}

export const routeCopy: Record<string, { eyebrow: string; title: string; summary: string }> = {
  '/about/faculty': { eyebrow: 'Faculty excellence', title: 'Learning with experienced guides.', summary: 'Meet the faculty and industry practitioners who support learning at Westin.' },
  '/publishing-house': { eyebrow: 'Westin Publishing House', title: 'Stories begin with a first page.', summary: 'Explore Westin’s publishing vision, student author program and support for new writers.' },
  '/about/mission-vision': { eyebrow: 'Our direction', title: 'Purpose in every practical step.', summary: 'Westin’s vision and mission connect hospitality skills with career opportunity.' },
  '/about/management': { eyebrow: 'People at Westin', title: 'Meet the people shaping the journey.', summary: 'Leadership and teaching are part of the Westin story.' },
  '/partners/bineid': { eyebrow: 'Industry relationship', title: 'A connection to hospitality careers.', summary: 'Explore the BIN EID profile documented by Westin.' },
  '/campus/infrastructure': { eyebrow: 'Learning spaces', title: 'A campus made for practice.', summary: 'Classrooms, library and hospitality learning spaces described by Westin.' },
  '/career-planner': { eyebrow: 'Career planner', title: 'A clearer route into work.', summary: 'Westin’s career-planning and recruitment pathway for hospitality students.' },
}

export const publicSections: Record<string, PublicSection[]> = {
  '/about/faculty': [
    { title: 'Teachers and mentors', body: 'Westin describes experienced educators, industry practitioners, case-study teaching and individual mentoring.', source: sources.faculty },
  ],
  '/publishing-house': [
    { title: 'From idea to publication', body: 'Westin Publishing House describes writing workshops, editorial mentoring and support from manuscript to publication.', source: sources.publishing },
  ],
  '/about': [
    { title: 'Westin in Vijayawada', body: 'Westin traces its history to 1999 and brings hotel management, business management and junior-college study together in Vijayawada.', points: ['Hospitality and business education', 'MEC and CEC junior-college streams', 'Vijayawada and Hyderabad campuses'], source: sources.about },
    { title: 'The idea behind the college', body: 'Westin describes a student-centred environment connecting educators, industry professionals and learning beyond the classroom.', points: ['Academic and operational skill', 'Communication and character', 'Career-oriented learning'], source: sources.about },
    { title: 'Founder and leadership', body: 'The newer Westin About page identifies K. Durga Prasad as Founder and Director and presents education as a route from potential to purpose.', source: sources.about },
    { title: 'Recognition and reach', body: 'Our business-facing page lists seven Best College awards from the Government of Andhra Pradesh, more than 25 years of experience and 75+ international placement partners. These are figures published by Westin without award dates or a partner reporting period.', source: sources.business },
    { title: 'Earlier site highlights', body: 'The older Vijayawada homepage displays 65 teachers, 5,300 students and 2,200 international placements without a reporting date. These are retained as figures from that version of the site.', source: sources.legacyHome },
    { title: 'Faculty and mentoring', body: 'Westin’s faculty page describes educators with advanced qualifications and corporate experience, one-to-one mentoring, case-study teaching and live projects.', points: ['Guest sessions with business leaders', 'Small-class interaction', 'Leadership development'], source: sources.faculty },
  ],
  '/about/mission-vision': [
    { title: 'Vision', body: 'Westin’s stated vision is to lead in state-of-the-art training and international job opportunities.', source: sources.vision },
    { title: 'Mission', body: 'Its mission is to develop academic and operational competence for hospitality and create career opportunities in India and abroad.', source: sources.vision },
    { title: 'In the classroom and beyond', body: 'Course pages connect those aims to hotel-department practice, business projects, communication, internships and industry interaction.', source: sources.home },
  ],
  '/about/management': [
    { title: 'K. Durga Prasad', body: 'Westin’s newer About page names K. Durga Prasad as Founder and Director and describes education as a journey that builds character and opportunity.', source: sources.about },
    { title: 'K. Gopi Prasad', body: 'The legacy management page identifies K. Gopi Prasad as founder and CEO of the Westin Group and describes his focus on connecting education with industry expectations.', source: sources.legacyManagement },
    { title: 'P. Chandra Shekar', body: 'The legacy page identifies P. Chandra Shekar as principal of the Vijayawada campus and describes his work with the local team of educators.', source: sources.legacyManagement },
    { title: 'Sailaja Kasaraneni', body: 'Westin’s legacy management profile describes Sailaja Kasaraneni’s role in administration and the college’s day-to-day operations.', source: sources.legacyManagement },
    { title: 'Educators and practitioners', body: 'Westin describes educators and industry professionals who combine academic learning, practical training and individual guidance.', source: sources.about },
  ],
  '/why-westin': [
    { title: 'Practice belongs in the lesson', body: 'Hospitality training covers food production, service, front office and housekeeping; business study uses cases, projects and workshops.', source: sources.legacyWhy },
    { title: 'Industry in view', body: 'Westin describes internships, guest lectures, industry interactions and study visits as ways to connect learning with work.', source: sources.legacyBba },
    { title: 'Feedback and direction', body: 'The college describes constructive feedback, career counselling and support for internships and higher study.', source: sources.legacyWhy },
    { title: 'Corporate preparation', body: 'Westin’s corporate-training page lists communication workshops, advanced certifications, resume sessions, mock interviews and professional grooming.', source: sources.corporateTraining },
    { title: 'Industry learning', body: 'The business internship page describes structured internships in the second and sixth semesters, industry visits, live business challenges and a business conclave.', source: sources.internship },
  ],
  '/partners': [
    { title: 'Academic connections', body: 'Westin’s degree pages list affiliation with Krishna University. Junior-college pages name the Board of Intermediate Education, Andhra Pradesh.', source: sources.bhm },
    { title: 'Industry connections', body: 'Hotel and business relationships support practical exposure, internships and career preparation.', source: sources.home },
    { title: 'BIN EID', body: 'The legacy Vijayawada site profiles BIN EID, a hospitality-focused executive search and consulting firm active in Gulf and Asian markets.', source: sources.legacyPartners },
  ],
  '/partners/bineid': [
    { title: 'Hospitality recruitment', body: 'Westin profiles BIN EID as an executive search and consulting firm working with hotels, resorts and related employers.', source: sources.legacyPartners },
    { title: 'Regional reach', body: 'The profile describes work across the Gulf region, Far East and Asia, matching candidates to employer requirements.', source: sources.legacyPartners },
  ],
  '/campus': [
    { title: 'Spaces for study', body: 'Westin describes digital classrooms and a library and learning centre with books, journals and online resources.', source: sources.business },
    { title: 'Spaces for practice', body: 'Hospitality study brings students into kitchens, food and beverage service, front office and housekeeping practice.', source: sources.bhm },
    { title: 'Life beyond class', body: 'The junior college describes business and debate clubs, workshops, cultural events, sports, mentoring and career guidance.', source: sources.junior },
    { title: 'Student-led communities', body: 'The student-life page lists entrepreneurship, finance and investment, marketing, cultural, sports and social-responsibility clubs.', source: sources.studentLife },
  ],
  '/campus/infrastructure': [
    { title: 'Classrooms and learning centre', body: 'Westin describes classrooms with digital boards and internet, alongside library resources for study and research.', source: sources.business },
    { title: 'Hospitality practice', body: 'Food production, service, front-office operations and housekeeping provide practical learning settings.', source: sources.bhm },
    { title: 'Student activities', body: 'Workshops, guest sessions and student projects provide opportunities to practise teamwork and communication.', source: sources.junior },
  ],
  '/placements': [
    { title: 'Preparation throughout study', body: 'Westin describes internships, workplace projects, specialisation and career guidance across business and hospitality courses.', source: sources.home },
    { title: 'Figures published by Westin', body: 'The newer homepage lists a 42 LPA highest package, 8 LPA average package and 100% placement percentage. It gives no reporting period or campus breakdown for these figures.', points: ['42 LPA highest package', '8 LPA average package', '100% placement percentage'], source: sources.home },
    { title: 'Earlier Hyderabad campus record', body: 'The legacy placements page reports that 66% of final-year students had international jobs or internships before course completion in 2017–18. That page explicitly describes Hyderabad campus interviews.', source: sources.legacyPlacements },
    { title: 'College-wide totals on Westin’s sites', body: 'A newer business-facing page lists 12,000+ international and 4,000+ domestic placements, while a newer hospitality-facing page lists 15,000+ international and 6,000+ domestic placements. Neither gives a reporting period or campus breakdown. The legacy Vijayawada homepage separately lists 2,200 international placements without a date.', source: sources.hotelCollegeDetailed },
    { title: 'Career planner', body: 'Westin describes a dedicated hospitality career-planning and recruitment organisation with screening and employer connections.', source: sources.legacyPlacements },
    { title: 'Business internships', body: 'Westin describes internships in the second and sixth semesters, industry visits, live business challenges and its Business Conclave.', source: sources.internship },
    { title: 'Corporate readiness', body: 'Its corporate-training page lists soft-skills workshops, certification, mock interviews, resume building and professional etiquette.', source: sources.corporateTraining },
  ],
  '/career-planner': [
    { title: 'From interest to opportunity', body: 'Westin Career Planner is described as a hospitality recruitment organisation connecting candidates with internships and jobs.', source: sources.legacyPlacements },
    { title: 'Ways to prepare', body: 'Westin describes aptitude screening, communication, practical experience and interviews as parts of career preparation.', source: sources.legacyPlacements },
    { title: 'A range of roles', body: 'Its material mentions industrial exposure, management trainee and permanent-employment pathways.', source: sources.legacyPlacements },
  ],
}

export const publicRecords: PublicRecord[] = [
  { id: 'awards', kind: 'news', label: 'College recognition', title: 'Westin awards and achievements', summary: 'The newer business page lists seven Best College awards by the Government of Andhra Pradesh; the older site records earlier awards.', source: sources.business },
  { id: 'business-quiz', kind: 'news', label: 'Student achievement', title: 'BBA students recognised in business quiz', summary: 'Westin reports that Chandra Chandi, Manaswini and Gowshik T. won second prize in a quiz organised by KBN College, Vijayawada.', source: sources.business },
  { id: 'news-more', kind: 'news', label: 'College archive', title: 'Westin news and more', summary: 'The college’s news collection documents student achievements, hotel-industry learning and placement updates.', source: sources.newsMore },
  { id: 'interviews', kind: 'news', label: '2017–18 archive · Hyderabad', title: 'Hospitality campus interviews', summary: 'The legacy site documents hotel-industry interviews and placements for Hyderabad in 2017–18.', date: '2018', context: 'Hyderabad campus', source: sources.legacyPlacements },
  { id: 'mec-guide', kind: 'blog', label: 'Study guide', title: 'Understanding MEC and CEC', summary: 'Westin explains the subject combinations and directions available after intermediate study.', source: 'https://www.westincollegevijayawada.com/post/mec-cec-junior-college-vijayawada' },
  { id: 'hospitality-story', kind: 'blog', label: 'Hospitality', title: 'The Westin hospitality story', summary: 'The college writes about hospitality education, practical training and routes students can explore.', source: 'https://www.westincollegevijayawada.com/post/westin-the-best-college-of-hotel-management-in-andhra-pradesh' },
  { id: 'diwali', kind: 'campus-events', label: 'Campus celebration', title: 'BHM Diwali', summary: 'A student celebration in Westin’s event collection.', date: '2024', source: sources.events },
  { id: 'tourism', kind: 'campus-events', label: 'Student activity', title: 'Tourism event', summary: 'Tourism-related activity listed by Westin.', date: '2024', source: sources.events },
  { id: 'cake-mixing', kind: 'campus-events', label: 'Hospitality practice', title: 'Cake mixing', summary: 'A food-production activity in the event collection.', source: sources.events },
  { id: 'open-house', kind: 'campus-events', label: 'Event archive', title: 'Westin open house', summary: 'An open-house event on the legacy Vijayawada site.', date: '20 July 2019', source: sources.legacyHome },
  { id: 'gallery-learning', kind: 'gallery', label: 'Official gallery', title: 'Learning in action', summary: 'Westin’s collection includes culinary sessions, guest lectures, campus events and student projects.', source: sources.gallery },
  { id: 'gallery-freshers', kind: 'gallery', label: 'Student life', title: 'Freshers and campus moments', summary: 'The official gallery includes a freshers welcome and student-led activities.', source: sources.gallery },
  { id: 'sattvika-1', kind: 'magazine', label: 'Hospitality publication · Volume I', title: 'Sattvika I', summary: 'The first Sattvika volume linked by Westin.', source: 'https://www.westincollegevijayawada.com/_files/ugd/e48a5b_b9e9977404f84e6e871b49ec3e000ab9.pdf' },
  { id: 'sattvika-2', kind: 'magazine', label: 'Hospitality publication · Volume II', title: 'Sattvika II', summary: 'The second Sattvika volume linked by Westin.', source: 'https://www.westincollegevijayawada.com/_files/ugd/e48a5b_e20263673b754c419efed67c75002885.pdf' },
  { id: 'sattvika-3', kind: 'magazine', label: 'Hospitality publication · Volume III', title: 'Sattvika III', summary: 'The third Sattvika volume linked by Westin.', source: 'https://www.westincollegevijayawada.com/_files/ugd/e4b079_39c690c54eb54f0a9a581c34c8e7d5be.pdf?index=true' },
  { id: 'table-1', kind: 'magazine', label: 'Business publication', title: 'Table: A Business Magazine', summary: 'An official Westin business magazine available from the legacy Vijayawada site.', source: 'https://www.westincolleges.com/vij/pdf/TABLE-Business-Magazine.pdf' },
  { id: 'table-new', kind: 'magazine', label: 'Business publication', title: 'Table Magazine', summary: 'A newer Table volume linked by Westin College Vijayawada.', source: 'https://www.westincollegevijayawada.com/_files/ugd/e4b079_5ee25301beb549ed90b8ff0c08252e13.pdf' },
  { id: 'table-3', kind: 'magazine', label: 'Business publication', title: 'Table Magazine 3', summary: 'A further Table business-magazine PDF linked from the Vijayawada site. The file is large and opens at the original source.', source: 'https://www.westincollegevijayawada.com/_files/ugd/e4b079_8d7b159078794b789e40fc358c986a8a.pdf' },
  { id: 'publishing', kind: 'magazine', label: 'Westin Publishing House', title: 'Student Author Program', summary: 'The publishing house describes writing workshops, editorial mentorship and the journey from manuscript to publication.', source: sources.publishing },
  { id: 'founder', kind: 'testimonials', label: 'College leadership', title: 'K. Durga Prasad', summary: 'Westin’s Founder and Director describes education as a journey that builds knowledge, character and opportunity.', source: sources.about },
  { id: 'michael-wierling', kind: 'testimonials', label: 'Employer perspective · legacy site', title: 'Michael Wierling', summary: 'The hotel human-resources director describes Westin Career Planner’s candidate search and travel coordination for hospitality recruitment.', source: sources.legacyHome },
  { id: 'danny-barakat', kind: 'testimonials', label: 'Employer perspective · legacy site', title: 'Danny Barakat', summary: 'The hotel human-resources director describes working with Gopi Prasad and Westin Career Planner on recruitment trips.', source: sources.legacyHome },
  { id: 'simon-morley', kind: 'testimonials', label: 'Employer perspective · legacy site', title: 'Simon Morley', summary: 'The general manager recounts a multi-city recruitment effort supported by the Westin Career Planner team.', source: sources.legacyHome },
  { id: 'sudharshan', kind: 'success-stories', label: 'Alumni story', title: 'Sudharshan Motupalli', summary: 'Westin’s alumni article describes his path through mentorship, a Bahrain internship and hotel roles, identifying him as a general manager in Vijayawada at publication.', date: '24 December 2024', source: sources.alumni },
  { id: 'vara-prasad', kind: 'success-stories', label: 'Alumni story', title: 'Vara Prasad', summary: 'In the same alumni collection, Vara Prasad describes studying hotel management after intermediate and progressing to reservations leadership with Rotana.', date: '24 December 2024', source: sources.alumni },
  { id: 'indra-kiran', kind: 'success-stories', label: 'Alumni story', title: 'Indra Kiran', summary: 'Westin’s alumni collection follows Indra Kiran from a campus interview to food-and-beverage leadership in hospitality.', date: '24 December 2024', source: sources.alumni },
]

export function getFixturePage(pathname: string): { kind: PublicPageKind; key: string; program?: PublicProgram } | null {
  const clean = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
  if (clean === '/about' || clean === '/about/mission-vision' || clean === '/about/management' || clean === '/about/faculty') return { kind: 'about', key: clean }
  if (clean === '/publishing-house') return { kind: 'magazine', key: clean }
  if (clean === '/partners' || clean === '/partners/bineid') return { kind: 'partners', key: clean }
  if (clean === '/why-westin') return { kind: 'why-westin', key: clean }
  if (clean === '/programs') return { kind: 'programs', key: clean }
  if (clean.startsWith('/programs/')) {
    const program = fixturePrograms.find((item) => item.slug === clean.slice('/programs/'.length))
    return program ? { kind: 'programs', key: clean, program } : null
  }
  if (clean === '/campus' || clean === '/campus/infrastructure') return { kind: 'campus', key: clean }
  if (clean === '/campus/events' || clean.startsWith('/campus/events/')) return { kind: 'campus-events', key: clean }
  if (clean === '/placements' || clean === '/career-planner') return { kind: 'placements', key: clean }
  if (clean === '/news' || clean.startsWith('/news/')) return { kind: 'news', key: clean }
  if (clean === '/blog' || clean.startsWith('/blog/')) return { kind: 'blog', key: clean }
  if (clean === '/gallery' || clean.startsWith('/gallery/')) return { kind: 'gallery', key: clean }
  if (clean === '/magazine' || clean.startsWith('/magazine/')) return { kind: 'magazine', key: clean }
  if (clean === '/testimonials' || clean.startsWith('/testimonials/')) return { kind: 'testimonials', key: clean }
  if (clean === '/success-stories' || clean.startsWith('/success-stories/')) return { kind: 'success-stories', key: clean }
  if (clean === '/admissions' || clean === '/contact') return { kind: clean.slice(1) as 'admissions' | 'contact', key: clean }
  return null
}
