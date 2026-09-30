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
    summary: 'Build a foundation in management, finance, marketing and entrepreneurship through a three-year degree. Case studies, live projects, workshops and industry interaction connect business concepts with professional situations. Internships and specialist certifications help students explore their interests while preparing for employment, enterprise or further study.',
    detail: 'The three-year BBA connects management, economics, analytics, finance and entrepreneurship with practical business learning. Students explore decisions through live cases, seminars, business talks and workplace projects, strengthening communication and analytical thinking along the way. Workshops and guest lectures add professional perspectives to classroom study. Internship and certification stages give students opportunities to develop an area of interest, while events, competitions and study visits broaden their understanding of organisations and teamwork.',
    color: '#3BA7F2', facts: ['Three-year degree', 'Business specialisations', 'Projects and internships'],
    learning: ['Management, economics, finance and analytics', 'Marketing, human resources and entrepreneurship', 'Case studies, live projects and industry interaction'],
    entry: 'The course page lists 10+2 from a recognised board and 50% aggregate, subject to university and reservation rules.',
    outcomes: 'Westin describes business roles, enterprise and postgraduate study as possible next steps.',
    source: sources.bba, related: ['bba-honours'],
  },
  {
    slug: 'bba-honours', group: 'Business', label: 'Four-year BBA', title: 'BBA (Honours)',
    summary: 'Take business learning further through an honours year of research, innovation and deeper specialisation. The route builds on management foundations, practical projects and industry exposure, then develops analytical and leadership skills through a mentored final-year project. It connects professional preparation with opportunities for enterprise and further study.',
    detail: 'BBA Honours develops business foundations through management, accounting, organisational behaviour and applied learning. Case studies, live projects, workshops and industry interaction help students connect theory with professional questions. Internship and certification stages develop specialist interests before the fourth year adds research, innovation and leadership. A mentored project gives students time to examine an issue in depth, strengthen analytical skills and prepare for further study or responsibilities in business and enterprise.',
    color: '#3BA7F2', facts: ['Four-year honours degree', 'Business specialisation', 'Final-year research'],
    learning: ['Management, accounting and organisational behaviour', 'Case studies, projects and internships', 'Specialisation and a mentored research project'],
    entry: 'Westin lists 10+2 and 50% aggregate, subject to university and reservation rules.',
    outcomes: 'The college connects the course to leadership, enterprise, research and further study.',
    source: sources.bbaHonours, related: ['bba'],
  },
  {
    slug: 'hotel-management', group: 'Hospitality', label: 'Hotel management', title: 'Hotel management pathways',
    summary: 'Compare degree, honours, work-integrated and diploma routes in hospitality. Food production, food and beverage service, front office and housekeeping provide a shared practical foundation, supported by communication and industry learning. Choose a route that matches your educational starting point, preferred specialisation and plans for further professional development.',
    detail: 'Hotel management brings together the skills, knowledge and attitudes needed to contribute to hospitality operations. Food production, food and beverage service, front office and housekeeping connect practical work with classroom learning. Communication, teamwork and professional values support the technical foundations of service. Westin offers degree, honours, work-integrated and diploma pathways with different structures and entry requirements. Compare the specific routes below to understand their training stages, specialisation and industry experience.',
    color: '#F2A159', facts: ['Degrees and diplomas', 'Four hotel departments', 'Industry learning'],
    learning: ['Food production and culinary practice', 'Food and beverage service, front office and housekeeping', 'Communication, soft skills and hotel operations'],
    entry: 'Entry requirements differ by course. Open a specific route below for the requirements published by Westin.',
    outcomes: 'Degree, work-integrated and shorter diploma routes lead toward different hospitality roles.',
    source: sources.bhm, related: ['bhm-three-year', 'bhm-honours', 'work-integrated-hotel-management', 'dhm-one-year', 'food-production', 'pgdhm'],
  },
  {
    slug: 'bhm-three-year', group: 'Hospitality', label: 'Three-year BHM', title: 'Bachelor of Hotel Management',
    summary: 'Study the major hotel departments through a three-year degree combining hospitality theory, practical skills and industry learning. Training in food production, service, front office and housekeeping develops an understanding of hotel operations. Professional communication and selected specialisation prepare students to connect college learning with the expectations of hospitality workplaces.',
    detail: 'Students study the four core hotel departments and communication, followed by industry experience and specialised practical learning.',
    color: '#F2A159', facts: ['Three-year degree', 'Hotel operations', 'Industry internship'],
    learning: ['Food production, service, front office and housekeeping', 'Professional communication', 'Internship and selected specialisation'],
    entry: 'Westin lists 10+2 from any stream, 50% aggregate subject to university rules, and hospitality-related medical fitness.',
    outcomes: 'The course page describes domestic and international hospitality career preparation.',
    source: sources.bhm, related: ['bhm-honours', 'work-integrated-hotel-management'],
  },
  {
    slug: 'bhm-honours', group: 'Hospitality', label: 'Four-year BHM', title: 'BHM (Honours)',
    summary: 'Develop hospitality foundations through a four-year honours degree, with further specialisation and research in the final year. Practical hotel-department training and industry exposure lead into a guided project that strengthens analysis and managerial thinking. The route supports students who want to build on operational skills through deeper academic and professional development.',
    detail: 'After practical foundations and industry exposure, a guided fourth-year project develops analytical and managerial skills.',
    color: '#F2A159', facts: ['Four-year honours degree', 'Hotel operations', 'Final-year research'],
    learning: ['Four core hotel departments', 'Internship and specialised practical training', 'A year-long research project'],
    entry: 'Westin lists 10+2 from any stream, 50% aggregate subject to university rules, and hospitality-related medical fitness.',
    outcomes: 'The college connects the honours route with advanced hospitality roles.',
    source: sources.bhmHonours, related: ['bhm-three-year'],
  },
  {
    slug: 'work-integrated-hotel-management', group: 'Hospitality', label: 'Work-integrated', title: 'Work-integrated hotel management',
    summary: 'Combine hospitality study, selected specialisation and extended workplace training in a three-year route. Core hotel departments and communication provide the foundation, followed by industry experience and further practical development. The programme connects structured learning with opportunities to understand daily responsibilities, teamwork and professional expectations in a hospitality setting.',
    detail: 'Westin’s detailed course page describes a three-year work-integrated degree; its menu calls the page a diploma. This page follows the detailed course wording.',
    color: '#F2A159', facts: ['Three-year route', 'Work-integrated learning', 'Hotel operations'],
    learning: ['Four core departments and communication', 'Industry internship and specialisation', 'Extended final-year work training'],
    entry: 'The page lists 10th pass or 12th pass/fail, ages generally 16–25, and basic medical fitness.',
    outcomes: 'Westin describes domestic and international hotel career paths.',
    source: sources.workIntegrated, related: ['bhm-three-year', 'dhm-one-year'],
  },
  {
    slug: 'dhm-one-year', group: 'Hospitality', label: 'One-year diploma', title: 'Diploma in Hotel Management',
    summary: 'Build an introduction to food production, service, front office and housekeeping through a one-year diploma. Communication and practical training support the hotel-department foundations, followed by selected specialisation and workplace experience. This route gives students a focused starting point for developing the skills and professional habits used in hospitality operations.',
    detail: 'The diploma page covers food production, service, front office, housekeeping and professional communication, followed by an internship.',
    color: '#F2A159', facts: ['One-year diploma', 'Four hotel departments', 'Professional internship'],
    learning: ['Hotel operations and communication', 'Selected specialisation', 'Professional hospitality experience'],
    entry: 'Westin lists a recognised 10th pass, ages generally 18–25, and basic medical fitness.',
    outcomes: 'The college presents the diploma as a route into operational hospitality work.',
    source: sources.dhm, related: ['work-integrated-hotel-management'],
  },
  {
    slug: 'food-production', group: 'Hospitality', label: 'Culinary diploma', title: 'Diploma in Food Production',
    summary: 'Develop culinary skills through food preparation, cooking techniques, presentation and kitchen operations. Practical learning connects hygiene and food safety with recipes, menu planning and the organisation of kitchen work. The diploma focuses on food production and industry exposure for students interested in hotel, restaurant and catering kitchens.',
    detail: 'Students learn preparation, culinary techniques, food safety, menu planning and practical kitchen work.',
    color: '#F2A159', facts: ['Culinary specialisation', 'Food safety', 'Kitchen practice'],
    learning: ['Food preparation and cooking techniques', 'Hygiene and kitchen operations', 'Menus, recipes and industry exposure'],
    entry: 'Westin lists 10th pass or 12th pass/fail, ages generally 16–25, and basic medical fitness.',
    outcomes: 'The page points to hotel, restaurant and catering kitchens.',
    source: sources.food, related: ['dhm-one-year'],
  },
  {
    slug: 'pgdhm', group: 'Hospitality', label: 'Postgraduate diploma', title: 'Post Graduate Diploma in Hotel Management',
    summary: 'Build on a bachelor’s degree through a one-year postgraduate diploma in hospitality management. Operations, marketing, finance and people management connect with strategy, leadership and professional responsibilities. Cases, simulations, practical exposure and industry projects help students apply their knowledge while exploring supervisory and managerial directions in hospitality.',
    detail: 'Westin lists a one-year PGDHM covering operations, marketing, finance and people management, with cases and practical exposure.',
    color: '#F2A159', facts: ['One-year postgraduate diploma', 'Hospitality management', 'Industry project'],
    learning: ['Hotel operations and strategy', 'Marketing, finance and human resources', 'Cases, simulations and industry projects'],
    entry: 'The page lists a bachelor’s degree in any discipline, 50% aggregate and age generally below 27.',
    outcomes: 'Westin describes supervisory and managerial hospitality roles.',
    source: sources.pgdhm, related: ['bhm-three-year', 'bhm-honours'],
  },
  {
    slug: 'intermediate', group: 'Junior college', label: 'MEC / CEC', title: 'Intermediate: MEC and CEC',
    summary: 'Choose MEC or CEC for a two-year foundation in commerce and economics, alongside mathematics or civics. Core subjects are complemented by guest lectures, workshops, business practicals and career exploration. Sports, activities and counselling support personal development as students consider higher study in business, commerce and professional education.',
    detail: 'MEC combines Mathematics, Economics and Commerce; CEC combines Civics, Economics and Commerce. Both provide a two-year foundation for students progressing from Class 10 towards higher education. Westin connects the integrated curriculum with experiential learning, workshops, guest lectures, industrial visits and career exposure. Students explore multiple career options and select career training in their second year. Sports, extracurricular activities and counselling involving parents support personal development alongside academic progress.',
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
    { title: 'Westin in Vijayawada', body: 'Established in 1999, Westin brings more than 25 years of educational experience to hospitality, business management and junior-college learning. Our Vijayawada campus connects classroom study with practical training and personal development, helping students prepare for further education and professional life. Hotel management develops skills across the major hotel departments, while business study explores how organisations operate and grow. MEC and CEC intermediate streams provide a foundation in commerce and economics. Together, these study routes give students different ways to discover their interests and build confidence.', source: sources.about },
    { title: 'The idea behind the college', body: 'Our purpose is to develop academic knowledge alongside the practical competence needed in the workplace. Interactive lessons, collaborative tasks and industry exposure help students apply what they learn and understand professional expectations. Constructive feedback and self-assessment encourage them to recognise their strengths and take responsibility for improvement. Communication, character and responsible leadership are part of that development, alongside awareness of environmental and social responsibilities. We connect educators, industry professionals and alumni so that learning reaches beyond the classroom and prepares students for opportunities in India and abroad.', source: sources.legacyWhy },
    { title: 'Leadership and administration', body: 'The Vijayawada team brings together educational leadership, hospitality experience and day-to-day administration. Founder and Director K. Durga Prasad guides the college’s development and works with teaching and non-teaching teams. Principal P. Chandra Shekar leads the local educators and campus operations, while Sailaja Kasaraneni supports administration and staff coordination. Their work connects the college’s educational aims with the practical organisation that keeps campus life running. This shared focus on teaching, people and processes supports a learning environment where students can develop both professional skills and personal confidence.', source: sources.legacyManagement },
    { title: 'Recognition and reach', body: 'Westin’s record includes seven Best College awards from the Government of Andhra Pradesh, more than 25 years in education and a network of 75+ international placement partners. This experience supports our emphasis on connecting learning with the hospitality and business worlds. Industry relationships help students encounter professional practices through internships, projects and career preparation, while international connections broaden their view of possible careers. The award count and partner figure are college-wide highlights; award dates and a reporting period for the partner count are not specified.', source: sources.business },
    { title: 'Student support and career preparation', body: 'Students receive guidance as they explore their interests, develop skills and decide what comes next. Career counselling considers academic performance and individual aspirations, with support for internships, employment and higher study. Communication workshops, professional grooming, resume preparation and mock interviews help students become more comfortable with workplace expectations. Practical experience and feedback give them opportunities to improve before graduation. Student support also responds to concerns during their studies, while clubs, workshops and industry interactions offer ways to practise teamwork, meet new people and build confidence beyond academic results.', source: sources.legacyWhy },
    { title: 'Faculty and mentoring', body: 'Our faculty combines advanced academic qualifications with experience in industry and business. Educators use case studies, live projects and practical tasks to connect theory with the situations students may encounter at work. Small-class interaction and individual mentoring give students space to ask questions, receive feedback and work on their own development. Guest sessions with business leaders, entrepreneurs and industry professionals introduce additional perspectives. Leadership workshops and continuing guidance help students strengthen their communication, judgement and problem-solving skills as they prepare for further study, internships and professional responsibilities.', source: sources.faculty },
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
    { title: 'Spaces for study', body: 'Classroom learning is supported by resources that help students question, explore and practise independently. Digital classrooms encourage interactive lessons, while the library and learning centre provide books, journals and online resources for further study. Computer labs and innovation hubs support technology-based work and research. These spaces connect taught subjects with assignments, discussions and projects, giving students different ways to develop understanding. Alongside academic resources, the campus includes cafeteria and recreational areas where students can spend time together and take a break from their studies.', points: ['Digital boards and high-speed internet support interactive lessons.', 'The learning centre offers books, journals and online resources for research.', 'Computer labs and innovation hubs support technology-led work.'], source: sources.business },
    { title: 'Spaces for practice', body: 'Hospitality study connects classroom knowledge with the skills used across hotel operations. Food production, food and beverage service, front office and housekeeping provide opportunities to understand the contribution of each department to a guest’s experience. Practical work develops operating skills alongside communication, teamwork and professional values. Students learn to connect an idea with the care and consistency required in service, before progressing to the industry experience in their chosen course. The aim is professional competence and personal development, with learning opportunities both inside the college and beyond the classroom.', source: sources.legacyHome + 'Hotel-management.html' },
    { title: 'Life beyond class', body: 'College life includes opportunities to discover interests and develop confidence alongside academic study. Workshops, guest lectures, industrial visits and business practicals introduce ideas and experiences beyond regular lessons. Events, sports and extracurricular activities give students ways to participate, work together and enjoy time with others. Intermediate students also explore multiple career options through training and practical exposure, with career training selected in the second year. Counselling and parent involvement support their development as they consider further education. The emphasis is individual growth and a balanced learning experience.', source: sources.legacyHome + 'intermediate.html' },
    { title: 'Student-led communities', body: 'Student clubs bring people together around interests in business, creativity, sport and community participation. Entrepreneurship, finance and investment, and marketing groups connect subject learning with innovation, markets and communication. Cultural activities make space for music, dance, art and film appreciation, while sport provides opportunities for teamwork and active participation. Community service and awareness campaigns encourage students to consider their responsibilities beyond the college. These groups offer different ways to contribute, meet other students and develop confidence through shared interests and effort. Explore the clubs below to find a place to begin.', points: ['Business clubs explore startups, finance and marketing through workshops and networking.', 'Cultural and sports groups make room for music, art, cricket, badminton and more.', 'The social-responsibility club takes part in community service and awareness campaigns.'], source: sources.studentLife },
  ],
  '/campus/infrastructure': [
    { title: 'Classrooms and learning centre', body: 'Westin describes classrooms with digital boards and internet, alongside library resources for study and research.', source: sources.business },
    { title: 'Hospitality practice', body: 'Food production, service, front-office operations and housekeeping provide practical learning settings.', source: sources.bhm },
    { title: 'Student activities', body: 'Workshops, guest sessions and student projects provide opportunities to practise teamwork and communication.', source: sources.junior },
  ],
  '/placements': [
    { title: 'Preparation throughout study', body: 'Career preparation develops alongside academic learning. Practical training, workplace projects and feedback help students connect subject knowledge with professional responsibilities. Career counselling considers academic performance and individual interests, supporting choices about internships, employment and further study. Hospitality students develop operating skills across hotel departments, while business students explore organisations through projects and industry interaction. These experiences create opportunities to strengthen confidence, communication and teamwork before graduation.', points: ['Practical skills and constructive feedback', 'Individual guidance for internships and future study', 'Communication and teamwork in professional settings'], source: sources.legacyWhy },
    { title: 'Figures published by Westin', body: 'The newer homepage lists a 42 LPA highest package, 8 LPA average package and 100% placement percentage. It gives no reporting period or campus breakdown for these figures.', points: ['42 LPA highest package', '8 LPA average package', '100% placement percentage'], source: sources.home },
    { title: 'Earlier Hyderabad campus record', body: 'The legacy placements page reports that 66% of final-year students had international jobs or internships before course completion in 2017–18. That page explicitly describes Hyderabad campus interviews.', source: sources.legacyPlacements },
    { title: 'College-wide totals on Westin’s sites', body: 'A newer business-facing page lists 12,000+ international and 4,000+ domestic placements, while a newer hospitality-facing page lists 15,000+ international and 6,000+ domestic placements. Neither gives a reporting period or campus breakdown. The legacy Vijayawada homepage separately lists 2,200 international placements without a date.', source: sources.hotelCollegeDetailed },
    { title: 'Career planner', body: 'Operating since 2005, Westin Career Planner connects hospitality candidates with employers across training, operational and management roles. Its recruitment profile covers permanent and temporary staffing, from individual appointments to large and ongoing requirements. Recruiting offices are listed in Bengaluru, Hyderabad, Vijayawada and Siliguri, bringing together candidates and organisations across different locations.', points: ['Permanent and temporary employees', 'Industrial exposure trainees', 'Management trainees', 'Pre-opening teams', 'Support-service staffing', 'Top management consultants'], source: sources.legacyHome + 'westin-career-planner.html' },
    { title: 'Business internships', body: 'Business internships connect classroom subjects with the work of organisations. Students encounter professional teams, practical responsibilities and business decisions beyond a textbook. Industry visits introduce corporate environments, while live business challenges provide opportunities to work on practical problems. The Business Conclave creates a setting for interaction with industry leaders. Specialist interests develop alongside this exposure; open the relevant course page to understand its internship stages and certification options.', points: ['Industry visits and corporate exposure', 'Live business challenges and projects', 'Interaction through the Business Conclave'], source: sources.internship },
    { title: 'Corporate readiness', body: 'Professional development gives students opportunities to practise how they present themselves and communicate their experience. Soft-skills workshops cover presentation, negotiation and leadership, while resume-building sessions and mock interviews support preparation for recruitment conversations. Corporate etiquette and grooming introduce expectations in professional settings. Advanced certifications complement core subjects and practical learning. Together, these activities help students connect their developing knowledge with the communication and professional habits used in working life.', points: ['Presentation, negotiation and leadership workshops', 'Resume building and mock interviews', 'Professional etiquette, grooming and certifications'], source: sources.corporateTraining },
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
