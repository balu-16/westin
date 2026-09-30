import { sources } from './content'
import type { LearningTopic } from './learning-content'

const careerSource = sources.legacyHome + 'westin-career-planner.html'

export interface PlacementRecord {
  id: string
  label: string
  figures: string
  context: string
  body: string
  source: string
  href?: string
}

export const placementHistory: readonly PlacementRecord[] = [
  { id: 'business', label: 'Business management', figures: '12,000+ international · 4,000+ domestic placements', context: 'Reporting period and campus breakdown not stated', body: 'These business-facing totals describe a broad placement history. They are separate from the hospitality totals and do not identify a current graduating batch.', source: sources.business },
  { id: 'hospitality', label: 'Hospitality', figures: '15,000+ international · 6,000+ domestic placements', context: 'Reporting period and campus breakdown not stated', body: 'The hospitality totals cover international and domestic opportunities across the college’s record. They should be read independently of the business figures.', source: sources.hotelCollegeDetailed },
  { id: 'vijayawada-legacy', label: 'Historical Vijayawada figure', figures: '2,200 international placements', context: 'Historical figure; reporting period not stated', body: 'The Vijayawada college history records international placements alongside its educational development. This figure has no defined reporting period and is not an annual placement total.', source: sources.legacyHome },
  { id: 'hyderabad-2017-18', label: '2017–18 Hyderabad record', figures: '66% of final-year students in international jobs or internships before completion', context: 'Hyderabad campus · 2017–18', body: 'Campus interviews involved international hospitality employers, including hotels, resorts, restaurants and convention venues. This result belongs to the Hyderabad campus and the stated academic year.', href: '/news/international-hotel-placements-2017-18', source: sources.legacyPlacements },
  { id: 'vijayawada-2018-21', label: '2018–2021 Vijayawada batch', figures: '103 students placed across six hotels and institutions', context: 'Vijayawada · 2018–2021 batch', body: 'The college’s account describes roles in the UAE and Bahrain, including hotel and service organisations. It also records the principal’s statement that 90% of that batch entered five-star hotels.', href: '/news/westin-students-uae-bahrain', source: sources.newsMore },
]

export const alumniPreviews = [
  { id: 'sudharshan', title: 'Sudharshan Motupalli', body: 'His published journey connects mentorship at college with an internship at Sheraton Bahrain, experience with Rotana and later hotel leadership in Vijayawada.', href: '/success-stories/sudharshan', imageKey: 'people/alumni-sudharshan-motupalli' },
  { id: 'vara-prasad', title: 'Vara Prasad', body: 'After choosing hotel management following intermediate education, Vara Prasad built a hospitality career that progressed towards reservations leadership with Rotana.', href: '/success-stories/vara-prasad', imageKey: 'people/alumni-vara-prasad' },
  { id: 'indra-kiran', title: 'Indra Kiran', body: 'A campus interview opened a route into hospitality work. His story traces experience in Dubai and progression towards food-and-beverage leadership.', href: '/success-stories/indra-kiran', imageKey: 'people/alumni-indra-kiran' },
] as const

export const employerPreviews = [
  { id: 'michael-wierling', title: 'Michael Wierling', role: 'Director of People Services · Kempinski Grand & Ixir Hotel Bahrain City Centre', body: 'His archived feedback describes recruiting for junior hotel positions in the Gulf. He highlights the suitability of the candidates, organisation of the recruitment visit and coordination of travel arrangements for selected staff.' },
  { id: 'danny-barakat', title: 'Danny Barakat', role: 'Director of Human Resources · Jumeirah Messilah Beach Hotel & Spa, Kuwait', body: 'His archived feedback describes working with Westin Career Planner on hotel recruitment since 2006. He highlights professionalism, the coordination of recruitment visits across Indian cities and careful pre-selection before individual interviews.' },
] as const

export const admissionsGuidance: readonly LearningTopic[] = [
  { id: 'counselling', title: 'Counselling for your next step', body: 'Explore your interests alongside the subjects, practical work and career directions of a course. Individual guidance helps students connect their academic background with suitable study options. For intermediate students, counselling also involves parents and supports personal development. Bring your questions to the Vijayawada team and discuss the route that interests you before making a decision.', points: ['Discuss your academic background and interests', 'Compare course structures and future study options', 'Include parents in intermediate-study guidance'], source: sources.legacyHome + 'intermediate.html' },
  { id: 'fees-support', title: 'Fees and financial support', body: 'Ask the admissions team for the fee details that apply to your chosen course and academic year. The college’s FAQs describe merit and financial-need support, with some categories related to sports or cultural achievement. Discuss eligibility, current availability and the information the team needs to assess your enquiry. Confirm the arrangements before completing your application.', points: ['Request course-specific fees and payment information', 'Ask about scholarship criteria and availability', 'Confirm application dates and required documents'], source: sources.bhm },
  { id: 'visit-hostel', title: 'Campus visits and hostel enquiries', body: 'A visit helps you connect course information with the places where students study and practise. Ask about classrooms, learning resources, hospitality training and student activities. Hostel facilities are offered for students from other cities; discuss current availability and arrangements directly with the team. Use the directions below and contact the college to arrange a visit.', points: ['Discuss a convenient time with the college', 'Explore learning spaces and practical training', 'Ask about hostel availability and arrangements'], source: sources.business },
]

export const admissionsDirectionCopy = {
  hospitality: [
    'Hospitality study develops knowledge and practical skills across food production, food and beverage service, front office and housekeeping. Communication, teamwork and professional values complement the operating skills used in hotels and related industries. Learning within the college is connected with industry experience and selected specialisation.',
    'Compare the three-year degree, four-year honours, work-integrated route and diploma options below. Their entry requirements and training structures differ. Choose a starting point that matches your educational background and the area of hospitality you want to explore.',
  ],
  business: [
    'Business study connects management, finance, marketing, leadership and entrepreneurship with practical decisions in organisations. Case studies, live projects, workshops and industry interaction build on classroom foundations. Internships and specialist certifications give students opportunities to explore analytics, FinTech, logistics, aviation, human resources, real estate and entrepreneurship.',
    'Choose the three-year BBA or the four-year honours route, which adds research, innovation and a mentored final-year project. Career guidance, industry exposure and entrepreneurial learning support students as they consider professional work, enterprise and further study.',
  ],
  junior: [
    'MEC combines Mathematics, Economics and Commerce; CEC combines Civics, Economics and Commerce. Both are two-year intermediate streams under the State Board of Intermediate Education, Andhra Pradesh, preparing students for higher education in business, commerce and professional fields.',
    'The integrated learning experience includes guest lectures, workshops, industry visits, business practicals and career exploration. Sports and extracurricular activities support confidence and teamwork. Continuous counselling involving parents helps students understand their interests, develop personal goals and consider their next stage of education.',
  ],
} as const

export const careerServices: readonly LearningTopic[] = [
  { id: 'permanent-temporary', title: 'Permanent and temporary employees', body: 'Recruitment for single, large or ongoing staffing needs, covering junior positions through senior hospitality responsibilities.', source: careerSource },
  { id: 'industrial-trainees', title: 'Industrial exposure trainees', body: 'A pathway connecting practical education with workplace experience and the operating responsibilities of hospitality departments.', source: careerSource },
  { id: 'management-trainees', title: 'Management trainees', body: 'Training opportunities that introduce candidates to professional responsibilities and the work of hospitality management teams.', source: careerSource },
  { id: 'pre-opening', title: 'Pre-opening teams', body: 'Recruitment support for hospitality organisations assembling the teams they need before a property begins operating.', source: careerSource },
  { id: 'support-staffing', title: 'Support-service staffing', body: 'Staffing across supporting functions that help hotels and related hospitality organisations carry out their daily work.', source: careerSource },
  { id: 'management-consulting', title: 'Top management consultants', body: 'A service line addressing senior management expertise within the hospitality sector and its organisational needs.', source: careerSource },
]

export const careerScreening = [
  { title: 'Screening and shortlisting', body: 'Candidate profiles are reviewed and shortlisted for the requirements of a role.' },
  { title: 'Reference checks', body: 'Reference checks form part of the recruitment process described by Career Planner.' },
  { title: 'Aptitude screening', body: 'Aptitude assessment adds another perspective when considering candidates for professional responsibilities.' },
  { title: 'English proficiency', body: 'English proficiency tests examine communication relevant to hospitality work and interactions with guests and colleagues.' },
] as const

export const careerPlannerCardDetails = [
  { title: 'How candidates are assessed', body: 'Screening and shortlisting match candidate profiles with the needs of a role. Reference checks, aptitude assessment and English proficiency tests add further perspectives on suitability. These stages help employers consider qualifications, communication and readiness for professional responsibilities before individual interviews.' },
  { title: 'Prepare for your next step', body: 'Students can connect practical training with career guidance based on their academic performance and interests. Resume-building sessions, mock interviews and communication workshops help them explain their experience with confidence. Explore the full Career Planner profile, compare recruitment pathways and contact the college to discuss your direction.' },
] as const

export const contactEnquiries: readonly LearningTopic[] = [
  { id: 'study-enquiry', title: 'Courses and admissions', body: 'Discuss Business, Hospitality or MEC/CEC study with the Vijayawada team. Ask how your educational background matches the entry requirements, compare course structures and request current fees and application information. The eligibility comparison on Admissions gives you a useful starting point for the conversation.', source: sources.admissions },
  { id: 'campus-enquiry', title: 'Visits and student support', body: 'Contact the college to arrange a campus visit and ask about learning spaces, practical training and hostel arrangements. Intermediate students and parents can also discuss counselling and career exploration. The Campus Life page introduces the resources, activities and support you can ask about during a visit.', source: sources.legacyHome + 'intermediate.html' },
  { id: 'career-enquiry', title: 'Careers and industry enquiries', body: 'Students can ask about career guidance, internship preparation and professional development. Employers interested in hospitality recruitment can explore the Career Planner service profile and contact the college for direction. Use the college email for a fuller explanation of your enquiry and the organisation or course involved.', source: careerSource },
]
