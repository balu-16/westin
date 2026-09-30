import { sources, type PublicProgram } from './content'
import type { Pic } from './officialTypes'

export interface LearningTopic {
  id: string
  title: string
  body: string
  points?: readonly string[]
  image?: Pic
  source: string
}

interface StudyDirection {
  name: PublicProgram['group']
  slug: string
  description: string
  image: Pic
  note: string
}

export const studyDirections: readonly StudyDirection[] = [
  {
    name: 'Business', slug: 'business',
    description: 'Business study connects management, finance, marketing and entrepreneurship with the way organisations work. Students explore ideas through live cases, practical assignments and conversations with industry professionals. Workshops, specialist certifications and internships build on classroom foundations, while study visits and competitions create opportunities to practise teamwork and communication. Choose the three-year BBA or take your learning further through the honours route.',
    image: { key: 'campus/bba-programme', alt: 'Westin business students in a learning setting' }, note: 'Ideas into action.',
  },
  {
    name: 'Hospitality', slug: 'hospitality',
    description: 'Hospitality education brings together food production, food and beverage service, front office and housekeeping. Practical training develops operating skills alongside the knowledge, values and professional attitudes needed in hotels and related industries. Degree, honours, work-integrated and diploma routes offer different starting points and levels of specialisation. Classroom study and workplace experience help students connect the details of service with the wider responsibility of caring for guests.',
    image: { key: 'campus/hm-service-team', alt: 'Westin hospitality students practising service together' }, note: 'Care is a craft.',
  },
  {
    name: 'Junior college', slug: 'junior',
    description: 'MEC and CEC provide a two-year foundation in commerce and economics, alongside mathematics or civics. Westin’s approach also considers personal development, practical exposure and the choices students face after intermediate education. Guest lectures, workshops, industry visits, sports and student activities broaden the learning experience. Individual guidance and counselling involving parents help students understand their interests and prepare for higher study in business, commerce and professional fields.',
    image: { key: 'campus/junior-life-1', alt: 'Westin students visiting a retail store' }, note: 'Start with possibility.',
  },
]

export const learningTopics: readonly LearningTopic[] = [
  {
    id: 'internships', title: 'Internships and workplace learning',
    body: 'Business and hospitality programmes connect academic study with industry experience. Students apply what they have learnt, observe how teams operate and develop independence through practical responsibilities. Workplace learning builds professional competence alongside communication, teamwork and the discipline of completing real tasks. As learning progresses, students can explore a chosen specialisation. Each course page explains the structure and timing of industry experience for that route.',
    points: ['Connect theory with day-to-day work', 'Develop professional habits and teamwork', 'Build experience in a chosen specialisation'],
    image: { key: 'campus/hm-service-team', alt: 'A Westin hospitality student practising guest-room service' }, source: sources.legacyBba,
  },
  {
    id: 'certifications', title: 'Specialist certifications',
    body: 'Specialist certifications connect a broad business foundation with focused study in analytics, logistics, sales and marketing, digital marketing, human resources and aviation. Students explore the language, tools and professional questions of different industries, helping them identify their strengths and interests. This exposure supports decisions about where to apply management knowledge. Explore the certification options within each degree’s course structure.',
    points: ['Explore business functions and industries', 'Connect specialist knowledge with core subjects', 'Compare certification options on the course page'],
    source: sources.legacyBba,
  },
  {
    id: 'workshops', title: 'Workshops that build skills',
    body: 'Workshops combine conceptual understanding with guided tasks, discussion and feedback. Students can ask questions, try an approach and learn from other perspectives. Alongside classroom teaching, these sessions strengthen practical understanding, communication and confidence. Workshops and training in business and intermediate education connect subject knowledge with personal development, encouraging students to contribute ideas and participate actively in their learning.',
    points: ['Practise useful skills through guided tasks', 'Ask questions and learn through feedback', 'Strengthen communication and participation'],
    source: sources.legacyBba,
  },
  {
    id: 'business-practicals', title: 'Live cases and business practicals',
    body: 'Live cases, seminars, conferences, business talks, webinars and exhibitions help students explore how business decisions are made. Students examine problems, discuss possible responses and communicate what they have learnt. Innovation activities, storytelling, business shows and competitions provide further opportunities to develop ideas. These practicals encourage analytical thinking and collaboration while connecting management theory with professional situations beyond a textbook.',
    points: ['Discuss cases and practical business problems', 'Present ideas through seminars and business talks', 'Explore innovation, exhibitions and competitions'],
    image: { key: 'campus/bba-journeys', alt: 'Westin business students collaborating around a laptop' }, source: sources.legacyBba,
  },
  {
    id: 'industry-interaction', title: 'Guest lectures and industry visits',
    body: 'Guest lectures introduce students to the experience of industry professionals, while visits let them observe organisations and professional practices directly. Questions and discussions connect academic concepts with working life: how people collaborate, respond to customers and solve problems. Guest sessions, industrial visits and industry interaction enrich business and intermediate learning, helping students connect their studies with future interests.',
    points: ['Learn from professionals and their experience', 'Observe business practices during visits', 'Connect classroom questions with working life'],
    image: { key: 'campus/junior-life-1', alt: 'Westin students visiting a retail store' }, source: sources.legacyBba,
  },
  {
    id: 'study-tours', title: 'Study tours, events and competitions',
    body: 'Domestic and international study tours introduce business students to different cultures and practices in innovation, sustainability and entrepreneurship. Events and inter-university competitions create opportunities to work towards a shared task, communicate under pressure and contribute as a team. These experiences build confidence and broaden professional interests. Discuss the activities available for your programme and academic year with the college team.',
    points: ['Explore business practices and different cultures', 'Develop teamwork through events and competitions', 'Discover innovation and entrepreneurial ideas'],
    source: sources.legacyBba,
  },
]

export const courseLearning: Record<PublicProgram['group'], readonly LearningTopic[]> = {
  Business: learningTopics.filter((topic) => ['workshops', 'business-practicals', 'industry-interaction'].includes(topic.id)),
  Hospitality: [
    {
      id: 'department-practice', title: 'Practice across hotel departments',
      body: 'Food production, food and beverage service, front office and housekeeping form the practical foundation of hospitality study. Students connect hotel-management theory with operating skills, building an understanding of how different departments contribute to a guest’s experience. The depth of training and choice of specialisation follow the selected degree or diploma route.',
      source: sources.legacyHome + 'Hotel-management.html',
    },
    {
      id: 'professional-values', title: 'Professional values and service',
      body: 'Hospitality preparation includes the values and attitudes needed to work effectively with guests and colleagues. Communication, responsibility and teamwork sit alongside technical skills. Westin’s training objectives emphasise relevant knowledge, professional competence and personal development, helping students understand the care and consistency expected in operational roles.',
      source: sources.legacyHome + 'Hotel-management.html',
    },
    {
      id: 'hospitality-exposure', title: 'Learning with industry',
      body: 'Practical learning inside the college is complemented by experience beyond the classroom. Internship and industry-training stages help students connect their studies with workplace expectations and explore a chosen department. Follow the course structure below for the timing of industry experience, specialisation and further study within your route.',
      source: sources.legacyHome + 'Hotel-management.html',
    },
  ],
  'Junior college': [
    {
      id: 'integrated-learning', title: 'An integrated learning experience',
      body: 'Intermediate education combines core subjects with opportunities to learn through experience. Workshops, guest lectures, business practicals and industrial visits introduce students to ideas beyond examination preparation. Sports, events and extracurricular activities also make room for teamwork, confidence and personal development alongside academic progress.',
      source: sources.legacyHome + 'intermediate.html',
    },
    {
      id: 'career-exploration', title: 'Explore different career options',
      body: 'Westin introduces intermediate students to multiple career directions so they can identify interests before choosing further study. Practical exposure, certification programmes and summer internships contribute to that exploration. Students select career training in the second year, connecting their developing strengths with possible routes in business, commerce and professional education.',
      source: sources.legacyHome + 'intermediate.html',
    },
    {
      id: 'family-guidance', title: 'Guidance for students and families',
      body: 'Continuous counselling supports intermediate students as they develop their personality, set goals and consider the next stage of education. Parent involvement is part of that support. The emphasis is individual development: understanding the student’s interests, encouraging progress and helping the family make informed decisions about future study and career preparation.',
      source: sources.legacyHome + 'intermediate.html',
    },
  ],
}

export const studentClubProfiles: readonly LearningTopic[] = [
  {
    id: 'entrepreneurship', title: 'Entrepreneurship Club',
    body: 'Explore business innovation, startup ideas and the process of turning an interest into an enterprise. The club’s focus on startup incubation connects classroom learning with entrepreneurial thinking. Students have room to discuss ideas, learn from other perspectives and develop the confidence to contribute to business conversations and collaborative projects.',
    image: { key: 'campus/training-soft-skills', alt: 'Westin students gathered outside an office building' }, source: sources.studentLife,
  },
  {
    id: 'finance', title: 'Finance & Investment Society',
    body: 'Discover how stock markets, banking and financial strategies relate to business decisions. The society introduces students to financial topics beyond their core lessons and creates opportunities to explore an interest in money, markets and investment. Sharing questions and perspectives helps students connect academic concepts with the wider financial world.',
    image: { key: 'clubs/03', alt: 'Westin business students talking together around a laptop' }, source: sources.studentLife,
  },
  {
    id: 'marketing', title: 'Marketing Mavericks',
    body: 'Workshops and networking events introduce trends in branding and digital marketing. Students can explore how organisations communicate with their audiences and how marketing ideas change with technology and culture. The club connects an interest in business communication with opportunities to discuss current practices, meet others and develop new perspectives.',
    image: { key: 'campus/junior-life-1', alt: 'Westin students visiting a retail store' }, source: sources.studentLife,
  },
  {
    id: 'culture', title: 'Cultural Club',
    body: 'Music, dance, art and film appreciation give students ways to express themselves and enjoy the creative side of college life. Cultural events bring people together around shared interests and different talents. Taking part offers a chance to build confidence, contribute to celebrations and experience campus life beyond regular lessons.',
    image: { key: 'events/sparkles-2024/03', alt: 'Westin students performing on stage at a college cultural event' }, source: sources.studentLife,
  },
  {
    id: 'sports', title: 'Sports Club',
    body: 'Activities include football, cricket, badminton, and athletics, giving students opportunities to stay active alongside their studies. Sport creates a setting for teamwork, participation and shared enjoyment. It also provides a change of pace from classroom work, helping students make time for interests that contribute to a balanced college experience.',
    source: sources.studentLife,
  },
  {
    id: 'social-responsibility', title: 'Social Responsibility Club',
    body: 'Students engage in community service projects and awareness campaigns that connect college life with the needs of others. The club creates opportunities to explore social responsibility through participation and shared effort. These experiences encourage empathy and awareness while giving students another way to work together and contribute beyond the classroom.',
    source: sources.studentLife,
  },
]

export const campusSupport: readonly LearningTopic[] = [
  {
    id: 'academic-mentoring', title: 'Academic mentoring',
    body: 'Personal attention and constructive feedback help students understand their progress and identify where they can improve. Educators connect subject learning with practical assignments, discussions and professional expectations. Mentoring creates room to ask questions, reflect on strengths and develop confidence over time. Students interested in higher education or research can also receive guidance as they explore the next stage of learning. Support responds to individual interests and academic performance, helping students connect daily study with longer-term goals.',
    points: ['Feedback and self-assessment', 'Guidance for higher study and research'], source: sources.legacyWhy,
  },
  {
    id: 'personal-development', title: 'Personal development and counselling',
    body: 'Student development extends beyond examination results. Workshops, leadership activities, sports and cultural participation offer opportunities to practise communication and build confidence. Counselling provides ongoing guidance as students consider their interests and personal goals. For intermediate students, this support includes parent involvement, helping families participate in decisions about education and career development. The aim is to support the individual student through learning and choices, while making room for a balanced college experience.',
    points: ['Communication, leadership and confidence', 'Parent involvement in intermediate counselling'], source: sources.legacyHome + 'intermediate.html',
  },
  {
    id: 'career-guidance', title: 'Career exploration and direction',
    body: 'Career counselling connects a student’s academic performance and field of interest with possible next steps. Industry interaction, practical learning and internships help students understand professional expectations before making those choices. Intermediate students explore multiple career options and select career training in their second year. Across college study, guidance can support internship applications, employment preparation and further education. Students can discuss their interests with the team and identify a direction that builds on their developing skills.',
    points: ['Explore interests through practical exposure', 'Support for internships, employment and further study'], source: sources.legacyWhy,
  },
]

export const learningSpaces: readonly LearningTopic[] = [
  {
    id: 'academic-spaces', title: 'Classrooms and academic resources',
    body: 'Digital classrooms support interactive lessons, while library and learning-centre resources give students material for independent study and research. Books, journals and online resources complement classroom teaching. Computer labs and innovation hubs offer settings for technology-based learning and project work. Together, these resources support the movement between a taught idea, a question explored independently and an assignment developed with others.',
    points: ['Digital boards and internet-supported lessons', 'Books, journals and online learning resources', 'Computer-based learning and project work'],
    image: { key: 'campus/students-group', alt: 'Westin students listening to an educator in a classroom' }, source: sources.business,
  },
  {
    id: 'hospitality-spaces', title: 'Hospitality training spaces',
    body: 'Practical hospitality learning connects students with the work of food production, food and beverage service, front office and housekeeping. Kitchen tasks build familiarity with preparation and food safety, while service and guest-care practice develop communication and attention to detail. These settings help students connect hotel-management theory with operating skills before progressing to the industry experience described in their chosen programme.',
    points: ['Food production and kitchen practice', 'Food and beverage service', 'Front office and housekeeping operations'],
    image: { key: 'campus/hm-learning', alt: 'A Westin hospitality student practising food preparation' }, source: sources.bhm,
  },
  {
    id: 'recreation-spaces', title: 'Recreation and time together',
    body: 'Campus life also includes spaces and activities where students can meet, relax and take a break from academic work. Cafeteria and recreational areas complement the learning environment, while sports and cultural participation give students additional ways to spend time together. The intermediate programme describes sport and fitness alongside its academic and career-development activities, recognising the role of participation in a balanced educational experience.',
    points: ['Cafeteria and recreational areas', 'Sports and fitness participation', 'Cultural events and student activities'],
    image: { key: 'events/sparkles-2024/03', alt: 'Westin students performing together at a college cultural event' }, source: sources.business,
  },
  {
    id: 'campus-information', title: 'Plan your campus experience',
    body: 'A campus visit is a useful opportunity to connect course information with the spaces where students learn. Speak with the Vijayawada team about your intended programme, the practical training it includes and the support available during study. Hostel facilities are offered for students coming from other cities; discuss availability and arrangements with the college. The admissions and contact pages provide directions and ways to arrange counselling or a visit.',
    points: ['Discuss learning spaces during a campus visit', 'Ask the team about hostel arrangements', 'Get course-specific guidance before applying'],
    source: sources.business,
  },
]

export const campusMoments = [
  { id: 'sparkles-2024', label: 'Cultural activities', body: 'Performances and shared celebrations give students room to express themselves. Explore the college photographs from Sparkles 2024.' },
  { id: 'ghsdp-2024', label: 'Hospitality activities', body: 'Discover a college event focused on hospitality skill development through the Global Hospitality Skill Development Programme 2024 gallery.' },
  { id: 'old-age-home', label: 'Community engagement', body: 'Explore photographs from a college visit to an old-age home, showing another part of student participation beyond classroom learning.' },
] as const
