/**
 * Every piece of college information published on the official Westin site
 * (https://www.westincollegevijayawada.com/), in the college's own wording,
 * organised for the Home page. Types live in ./officialTypes.
 *
 * Editorial rules applied here, agreed with the user:
 *  - Narrative copy corrects only obvious typos: "Internatioal", "Bakeray",
 *    "nest-gen", "Competetion", "NACC", "Bengalore". FAQ copy stays verbatim.
 *  - BHM is published as a 3-year course on its programme page, while the
 *    official FAQ calls it 4 years. Each source's wording is kept on its page.
 *  - The two placement total sets (hospitality vs business) are both kept and
 *    never merged into a single current number.
 *  - No video: the official hero video is watermarked AI footage and is excluded.
 */
import generatedMedia from "./officialMedia.generated.json";
import type {
  Album,
  FaqGroup,
  OfficialDoc,
  Person,
  Pic,
  Programme,
  ProgrammeGroup,
  Stat,
  Titled,
} from "./officialTypes";

export const officialSources = {
  home: "https://www.westincollegevijayawada.com/",
  about: "https://www.westincollegevijayawada.com/about-us",
  vision: "https://www.westincollegevijayawada.com/vision-mision",
  bba: "https://www.westincollegevijayawada.com/bba",
  bbaHonours: "https://www.westincollegevijayawada.com/bba-4-years-programe",
  bhm: "https://www.westincollegevijayawada.com/3-years-degree-program",
  bhmHonours: "https://www.westincollegevijayawada.com/4-years-degree-program",
  diplomaHm: "https://www.westincollegevijayawada.com/diploma-in-hotel-management",
  dhm: "https://www.westincollegevijayawada.com/dhm-1-year-course",
  foodProduction: "https://www.westincollegevijayawada.com/diploma-in-food-production",
  pgdhm: "https://www.westincollegevijayawada.com/pgdm",
  junior: "https://www.westincollegevijayawada.com/westin-junior-college",
  juniorCourses: "https://www.westincollegevijayawada.com/blank-1-4-1",
  business: "https://www.westincollegevijayawada.com/bba-college-in-vijayawada",
  hotelCollege: "https://www.westincollegevijayawada.com/hotel-management-college-in-vijayawada",
  faculty: "https://www.westincollegevijayawada.com/faculty-excellence",
  corporateTraining: "https://www.westincollegevijayawada.com/corporate-training",
  internship: "https://www.westincollegevijayawada.com/internship",
  studentLife: "https://www.westincollegevijayawada.com/student-life",
  admissions: "https://www.westincollegevijayawada.com/admission-page",
  bbaAdmissions: "https://www.westincollegevijayawada.com/blank-1-2-2-1-1-1-1-1",
  events: "https://www.westincollegevijayawada.com/event",
  gallery: "https://www.westincollegevijayawada.com/gallery",
  publishing: "https://www.westincollegevijayawada.com/blank-1-2-1-1-1-1-1-1-1-2-1",
  authorProgram: "https://www.westincollegevijayawada.com/blank-1-4-1-1",
  publishingDocs:
    "https://www.westincollegevijayawada.com/blank-1-2-1-1-1-1-1-1-1-2-1-1",
  contact: "https://www.westincollegevijayawada.com/contact",
  alumniPost: "https://www.westincollegevijayawada.com/post/alumni-success-stories",
  alumniPage: "https://www.westincollegevijayawada.com/alumni",
  newsMore: "https://www.westincollegevijayawada.com/news-and-more",
  studentAwards:
    "https://www.westincollegevijayawada.com/latest-news-student-achievements",
  successStories: "https://www.westincollegevijayawada.com/success-stories",
  bbaSuccess: "https://www.westincollegevijayawada.com/blank-1-2-2-2",
  academics: "https://www.westincollegevijayawada.com/academics-and-placements",
  blog: "https://www.westincollegevijayawada.com/blog",
  theHindu:
    "https://www.thehindu.com/news/national/andhra-pradesh/westin-college-students-bag-jobs-in-hotels-in-uae-bahrain/article36109192.ece",
  psychometricTest:
    "https://docs.google.com/forms/d/e/1FAIpQLSckAu9wUTagyvg8zpFUig-P6-RFT1hqOc29D1mOnw01WkaA4w/viewform",
} as const;

export const site = {
  name: "Westin College of Hotel and Business Management",
  shortName: "Westin College",
  place: "Vijayawada",
  headline: "Top Hotel Management & BBA College In Vijayawada",
  legacyYears: 25,
  placementClaim: "Leaders in International Placements",
  programmesLine: "Hotel Management | BBA | MEC | CEC",
  admissionsBadge: "Admissions open 2026",
  footerTagline:
    "Westin is a destination for Hospitality and Business learning school in Vijayawada and Hyderabad (India), Our education and facilities stand out as a beacon of the commitment crafting a sustainable future for all.",
  logoSubLines: [
    "College Of Hotel Management",
    "College Of Business Management",
    "Junior College",
  ],
  /** Quoted on the About, alumni and academics pages. */
  legacyLine:
    "Westin education continues the legacy of Twenty five years in education to build on the rich heritage of the era that saw the organization firmly establish itself as a leader in International Placements.",
  contact: {
    phones: ["0866 2546765", "0866 6531641", "+91 93 93 755 755"],
    email: "vijayawada@westin.ac.in",
    publishingEmail: "wpublishing@westin.ac.in",
    whatsapp: "919393755755",
    address:
      "Bharathi Nagar, Vijayawada, Andhra Pradesh 520008, Andhra Pradesh, INDIA",
    addressNote: "G V R Towers, opposite Vinayak Theatre",
    directions:
      "https://www.google.com/maps/search/?api=1&query=Westin+College+Bharathi+Nagar+Vijayawada+520008",
  },
  offices: [
    "Vijayawada",
    "Bengaluru",
    "Hyderabad",
    "Siliguri",
    "Sharjah / Dubai",
    "Florida",
  ],
  affiliations: [
    {
      name: "Krishna University",
      note: "Hotel Management and BBA degrees are affiliated to Krishna University.",
    },
    {
      name: "Board of Intermediate Education, Andhra Pradesh",
      note: "The two-year MEC and CEC junior college programme runs under the State Board of Intermediate Education, AP.",
    },
  ],
  /**
   * The official navigation carries these four as bare labels with no links or
   * content. The college holds the underlying documents, so they are presented
   * as accreditations with a route to request them.
   */
  accreditations: [
    { name: "AICTE", note: "Documents available on request from the college." },
    { name: "NAAC", note: "Documents available on request from the college." },
    { name: "NTF", note: "Documents available on request from the college." },
    { name: "ICC", note: "Documents available on request from the college." },
  ],
  source: officialSources.home,
} as const;

/** The four schools, in the official home-page order, with their real photos. */
export const schools: (ProgrammeGroup & { image: Pic; tagline: string })[] = [
  {
    id: "hospitality",
    label: "College of Hotel Management",
    school: "Westin College Of Hotel Management Vijayawada",
    tagline: "Best Hotel Management College in Vijayawada and Andhra Pradesh",
    intro:
      "Westin is one of the best hotel management colleges in Vijayawada offering industry-focused training and global placements.",
    image: {
      key: "schools/hotel-management",
      alt: "Westin hotel management students in a practical kitchen session",
    },
    source: officialSources.hotelCollege,
  },
  {
    id: "business",
    label: "College of Business Management",
    school: "Westin School Of Business Management Vijayawada",
    tagline: "Best Bachelor of Business Administration College in Vijayawada and Andhra Pradesh",
    intro:
      "Westin is building a human-centric and interconnected ecosystem where education meets innovation and careers begin with confidence. For over 25 years, Westin has been a leading destination for Business learning in Vijayawada, empowering students to become global professionals and entrepreneurs through personalized learning, industry collaborations, and innovation-driven education.",
    image: {
      key: "schools/business-management",
      alt: "Westin business management students during a campus activity",
    },
    source: officialSources.business,
  },
  {
    id: "junior",
    label: "Junior College",
    school: "Westin Junior College Vijayawada",
    tagline: "Best Junior College in Vijayawada and Andhra Pradesh",
    intro:
      "Welcome to Westin Junior College, a premier institution in Vijayawada that provides a solid foundation in Commerce & Management through its Two-Year Junior College Program under the State Board of Intermediate Education, Andhra Pradesh.",
    image: { key: "schools/junior-college", alt: "Westin junior college students on campus" },
    source: officialSources.junior,
  },
  {
    id: "hospitality",
    label: "Westin Publishing House",
    school: "Westin Publishing House",
    tagline: "Westin Publishing House – Inspiring Authors, Creating Legacies",
    intro:
      "Bringing Stories to Life, One Page at a Time. Westin Publishing House turns dreams into reality by nurturing talent, enhancing creativity, and empowering voices.",
    image: {
      key: "schools/publishing-house",
      alt: "Westin Publishing House editorial work and student authors",
    },
    source: officialSources.publishing,
  },
];

/** "The Pride of Vijayawada" — the official home-page introduction. */
export const about = {
  eyebrow: "Westin College · Vijayawada",
  prideTitle:
    "Westin College of Hotel and Business Management – The Pride of Vijayawada",
  pride: [
    "Westin College of Hotel and Business Management is acknowledged as the best hotel management school in Vijayawada. It ranked among the top colleges in Andhra Pradesh. As a leader in hospitality, business, and leadership studies, Westin College integrates stellar academics with students' real-life experiential training.",
    "In addition, the college is a center for business management and intermediate programs, thus enabling students to have a firm grip on successful global careers. Not only is Westin the best college of hotel management for local placements, but it is also the top school for international placements.",
    "The students of Westin College, Vijayawada, get globally experienced through the internship opportunities, industry workshops, and career-oriented learning that equip them with the skills required to be the leaders of tomorrow.",
  ],
  knowledgeTitle: "Where Knowledge Meets Innovation",
  knowledge: [
    "Westin is a premier destination for Hospitality and Business education in Vijayawada and Hyderabad, India. For over 25 years, we have built a human-centric, interconnected ecosystem of learning, research, and innovation — inspiring fluid thinking and shaping employable futures.",
    "With a passionate team of educators and industry professionals, and world-class infrastructure that blends learning with living, Westin continues to craft a sustainable future through education that transforms.",
  ],
  image: {
    key: "campus/about-hero",
    alt: "Westin College campus and students in Vijayawada",
  } as Pic,
  source: officialSources.about,
} as const;

export const founder: Person = {
  id: "founder-k-durga-prasad",
  name: "K. Durga Prasad",
  role: "Founder & Director, Westin College",
  heading: "Knowledge Beyond Boundaries",
  quote:
    "Education is not confined to classrooms — it's a journey that transforms potential into purpose. At Westin, we believe in nurturing minds, building character, and creating opportunities that cross continents.",
  image: {
    key: "people/founder-k-durga-prasad",
    alt: "K. Durga Prasad, Founder and Director of Westin College, speaking at a podium",
  },
  source: officialSources.about,
} as const;

export const visionAndMission = {
  vision:
    "To be the leader in providing state-of-the-art training and international job opportunities to our students.",
  mission: [
    "To develop students to demonstrate academic and operational competencies relevant to hospitality industry.",
    "To provide the students with excellent career opportunities across the country and the globe.",
  ],
  legacyLine: site.legacyLine,
  source: officialSources.vision,
} as const;

/**
 * The three leadership portraits are cropped from the official leadership
 * banner. See scripts/fetch-official-media.mjs (CIRCLE_CROPS) for the measured
 * geometry. Mrs. Sailaja K has no other photograph, so her crop is the only source.
 */
export const leadership: Person[] = [
  {
    id: "director-k-durga-prasad",
    name: "Mr. Durga Prasad K",
    role: "Director",
    image: {
      key: "people/director-k-durga-prasad",
      alt: "Mr. Durga Prasad K, Director of Westin College",
    },
    source: officialSources.about,
  },
  {
    id: "principal-p-chandra-shekar",
    name: "Mr. Chandra Shekar P",
    role: "Principal",
    image: {
      key: "people/principal-p-chandra-shekar-circle",
      alt: "Mr. Chandra Shekar P, Principal of Westin College",
    },
    source: officialSources.about,
  },
  {
    id: "admin-manager-k-sailaja",
    name: "Mrs. Sailaja K",
    role: "Admin Manager",
    image: {
      key: "people/admin-manager-k-sailaja",
      alt: "Mrs. Sailaja K, Admin Manager of Westin College",
    },
    source: officialSources.about,
  },
];

/** The "Students Achieving High-Paying Career Opportunities" block. */
export const placementsSpotlight = {
  title: "Students Achieving High-Paying Career Opportunities",
  intro:
    "Westin students are building successful careers with strong placement support, industry-focused training, and opportunities to secure high-paying packages.",
  stats: [
    { value: "42 LPA", label: "highest package" },
    { value: "8 LPA", label: "Average package" },
    { value: "100 %", label: "Placement Percentage" },
  ] satisfies Stat[],
  source: officialSources.home,
} as const;

/** Counters shared by the hospitality and business landing pages. */
export const achievementCounters: Stat[] = [
  { value: "07", label: "Best College Award By Govt. of AP" },
  { value: "25+", label: "Years of Experience" },
  { value: "75+", label: "International Placement Partners" },
];

/**
 * Grouped for the achievements section. The two landing pages publish different
 * placement totals, so each keeps its own source and they are never merged.
 */
export const achievements = {
  counters: achievementCounters,
  totals: {
    hospitality: {
      label: "Hotel Management",
      international: "15000+",
      domestic: "6000+",
      note: "Published on the College of Hotel Management page.",
    },
    business: {
      label: "Business Management",
      international: "12000+",
      domestic: "4000+",
      note: "Published on the School of Business Management page.",
    },
  } as Record<
    string,
    { label: string; international: string; domestic: string; note: string }
  >,
} as const;

export const recognition = {
  text: "Recognized multiple times by the Government of Andhra Pradesh and The Times Group, Westin continues to shape a sustainable future. One student at a time.",
  explore: "Explore. Experience. Excel. Your global journey begins here.",
  source: officialSources.admissions,
} as const;

const krishnaAffiliation = "Affiliated to Krishna University";
const stateBoardAffiliation = "State Board of Intermediate Education, Andhra Pradesh";

export const programmeGroups: ProgrammeGroup[] = [
  {
    id: "hospitality",
    label: "Hotel Management",
    school: "Westin College Of Hotel Management Vijayawada",
    intro:
      "Westin is one of the best hotel management colleges in Vijayawada offering industry-focused training and global placements. Hands-on training in 5-star hotels, with 15000+ international placements.",
    source: officialSources.hotelCollege,
  },
  {
    id: "business",
    label: "Business Management",
    school: "Westin School Of Business Management Vijayawada",
    intro:
      "Westin is building a human-centric and interconnected ecosystem where education meets innovation and careers begin with confidence. The BBA is a three-year undergraduate degree built around practical skills, industry exposure and real-world applications.",
    source: officialSources.business,
  },
  {
    id: "junior",
    label: "Junior College",
    school: "Westin Junior College Vijayawada",
    intro:
      "A Two-Year Junior College Program under the State Board of Intermediate Education, Andhra Pradesh, offering MEC and CEC streams as a foundation for BBA, B.Com, CA, CS and professional business careers.",
    source: officialSources.junior,
  },
];

/** The two BHM degree routes. */
const bhmProgrammes: Programme[] = [
  {
    slug: "3-years-degree-program",
    school: "hospitality",
    name: "Bachelor of Hotel Management",
    shortName: "BHM · 3 years",
    duration: "3 years",
    award: "Degree",
    affiliation: krishnaAffiliation,
    tagline: "Three-Year Bachelor's Degree in Hotel Management",
    image: {
      key: "campus/hm-programme-degree",
      alt: "Hotel management students in practical training",
    },
    overview: [
      "3 years of bachelors of hotel management - Affiliated to Krishna University.",
      "The first year builds the four core hotel departments. The second year is a six-month internship with five-star hotel brands. The third year combines a specialisation with Westin's Global Hospitality Skill Certification Programme.",
    ],
    stages: [
      {
        label: "Year 1",
        title: "Core departments and foundations",
        text: "The four core departments: Food Production, F&B Service, Front Office and Housekeeping, plus communication and soft skills.",
      },
      {
        label: "Year 2",
        title: "Industry Internship & Departmental Mastery",
        text: "A six-month internship with five-star hotel brands.",
      },
      {
        label: "Year 3",
        title: "Specialisation and certification",
        text: "A specialisation of your choice, plus six months of Westin's Global Hospitality Skill Certification Programme.",
      },
    ],
    eligibility: [
      {
        label: "Educational qualification",
        items: ["10+2 in any stream (Arts, Science, Commerce)"],
      },
      { label: "Minimum marks", items: ["50% aggregate"] },
      { label: "Medical fitness", items: ["Medical fitness certificate required"] },
    ],
    careerPathway:
      "BHM opens doors to careers in hotels, resorts, cruise lines, event management, and food & beverage industries.",
    source: officialSources.bhm,
  },
  {
    slug: "4-years-degree-program",
    school: "hospitality",
    name: "Bachelor of Hotel Management (Honours)",
    shortName: "BHM Honours · 4 years",
    duration: "4 years",
    award: "Honours degree",
    affiliation: krishnaAffiliation,
    tagline: "Four-Year Honours Bachelor of Hotel Management",
    image: {
      key: "campus/hm-programme-honours",
      alt: "Hotel management honours students in a practical session",
    },
    overview: [
      "4 years of bachelors of hotel management - Affiliated to Krishna University.",
      "Years one to three follow the BHM structure. The fourth year is a one-year specialisation research project.",
    ],
    stages: [
      {
        label: "Year 1",
        title: "Core departments and foundations",
        text: "The four core departments: Food Production, F&B Service, Front Office and Housekeeping, plus communication and soft skills.",
      },
      {
        label: "Year 2",
        title: "Industry Internship & Departmental Mastery",
        text: "A six-month internship with five-star hotel brands.",
      },
      {
        label: "Year 3",
        title: "Specialisation and certification",
        text: "A specialisation plus six months of Westin's Global Hospitality Skill Certification Programme.",
      },
      {
        label: "Year 4",
        title: "Specialisation research project",
        text: "A one-year specialisation research project.",
      },
    ],
    eligibility: [
      {
        label: "Educational qualification",
        items: ["10+2 in any stream (Arts, Science, Commerce)"],
      },
      { label: "Minimum marks", items: ["50% aggregate"] },
      { label: "Medical fitness", items: ["Medical fitness certificate required"] },
    ],
    careerPathway:
      "BHM opens doors to careers in hotels, resorts, cruise lines, event management, and food & beverage industries.",
    source: officialSources.bhmHonours,
  },
];

/** The remaining hospitality routes. */
const moreHospitalityProgrammes: Programme[] = [
  {
    slug: "diploma-in-hotel-management",
    school: "hospitality",
    name: "Diploma in Hotel Management",
    shortName: "Diploma in HM · 3 years",
    duration: "3 years",
    award: "Work-integrated diploma",
    tagline: "Three-Year Work Integrated Degree in Hotel Management",
    image: {
      key: "campus/hm-about",
      alt: "Diploma in hotel management students during practical work",
    },
    overview: [
      "The programme is listed as a Diploma in the menu and described on the page as a Three-Year Work Integrated Degree in Hotel Management.",
      "Each year alternates study with practical training, so graduates enter the industry with work experience already in hand.",
    ],
    stages: [
      {
        label: "Year 1",
        title: "Foundation",
        text: "Foundation study across the core hotel departments.",
      },
      {
        label: "Year 2",
        title: "Internship and certification",
        text: "A six-month internship plus six months of the certification programme.",
      },
      {
        label: "Year 3",
        title: "Work-integrated training",
        text: "Twelve months of work-integrated training.",
      },
    ],
    eligibility: [
      { label: "Educational qualification", items: ["10th pass, or 12th pass/fail"] },
      { label: "Minimum marks", items: ["No minimum marks"] },
      { label: "Age limit", items: ["16 to 25 years"] },
      { label: "Medical fitness", items: ["Medical fitness certificate required"] },
    ],
    source: officialSources.diplomaHm,
  },
  {
    slug: "dhm-1-year-course",
    school: "hospitality",
    name: "Diploma in Hotel Management (1 year)",
    shortName: "DHM · 1 year",
    duration: "1 year",
    award: "Diploma",
    tagline: "One-Year Diploma in Hotel Management",
    image: {
      key: "campus/hm-learning",
      alt: "Students in a one-year hotel management classroom",
    },
    overview: [
      "A one-year diploma that moves from foundation to specialisation and a final internship.",
      "The official page titles Phase 2 as \"Next 3 Months\" while its body text describes four months. Both are reproduced as published.",
    ],
    stages: [
      { label: "Phase 1", title: "Foundation", text: "Four months of foundation study." },
      {
        label: "Phase 2 · next 3 months",
        title: "Global Specialization & Career Launch",
        text: "The official page titles this phase \"Next 3 Months\" and describes four months of work in the body text.",
      },
      { label: "Phase 3", title: "Internship", text: "A six-month internship." },
    ],
    eligibility: [
      { label: "Educational qualification", items: ["10th pass"] },
      { label: "Minimum marks", items: ["No minimum marks"] },
      { label: "Age limit", items: ["18 to 25 years"] },
      { label: "Medical fitness", items: ["Medical fitness certificate required"] },
    ],
    source: officialSources.dhm,
  },
  {
    slug: "diploma-in-food-production",
    school: "hospitality",
    name: "Diploma in Food Production",
    shortName: "Diploma in Food Production",
    duration: "Diploma",
    award: "Diploma",
    tagline: "Diploma in Food Production",
    image: {
      key: "campus/hm-service-team",
      alt: "Food production students plating a practical dish",
    },
    overview: [
      "A five-step food production programme covering culinary skills, food safety and hygiene, practical exposure and a final internship.",
    ],
    stages: [
      {
        label: "Step 1",
        title: "Overview",
        text: "An overview of the food production discipline and the hospitality kitchen.",
      },
      { label: "Step 2", title: "Culinary skills", text: "Core culinary skills and technique development." },
      {
        label: "Step 3",
        title: "Food safety and hygiene",
        text: "Food safety and hygiene standards for a professional kitchen.",
      },
      {
        label: "Step 4",
        title: "Practical exposure",
        text: "Practical exposure to a working kitchen environment.",
      },
      { label: "Step 5", title: "Final internship", text: "A final six-month internship." },
    ],
    eligibility: [
      { label: "Educational qualification", items: ["10th pass, or 12th pass/fail"] },
      { label: "Age limit", items: ["16 to 25 years"] },
      { label: "Medical fitness", items: ["Medical fitness certificate required"] },
    ],
    source: officialSources.foodProduction,
  },
  {
    slug: "pgdm",
    school: "hospitality",
    name: "Post Graduate Diploma in Hotel Management",
    shortName: "PGDHM · 1 year",
    duration: "1 year",
    award: "Postgraduate diploma",
    tagline: "PGDHM",
    image: {
      key: "campus/hm-front-office",
      alt: "Postgraduate hotel management students at work",
    },
    overview: [
      "A one-year postgraduate diploma in hotel management, structured around advanced knowledge, leadership development, international exposure and professional internships.",
      "The final semester carries a six-month professional internship.",
    ],
    stages: [
      {
        label: "Framework",
        title: "Advanced Knowledge",
        text: "Advanced knowledge in hospitality operations and management.",
      },
      {
        label: "Framework",
        title: "Leadership Development",
        text: "Leadership development for hospitality professionals.",
      },
      {
        label: "Framework",
        title: "International Exposure",
        text: "International exposure aligned to global hospitality practice.",
      },
      {
        label: "Final semester",
        title: "Professional internships",
        text: "Six months of professional internship.",
      },
    ],
    eligibility: [
      { label: "Educational qualification", items: ["A bachelor's degree in any discipline"] },
      { label: "Minimum marks", items: ["50%"] },
      { label: "Age limit", items: ["Below 27 years"] },
    ],
    source: officialSources.pgdhm,
  },
];

export const hospitalityProgrammes: Programme[] = [
  ...bhmProgrammes,
  ...moreHospitalityProgrammes,
];

/** Business Management: BBA and BBA (Honours). */
export const businessProgrammes: Programme[] = [
  {
    slug: "bba",
    school: "business",
    name: "Bachelor of Business Administration",
    shortName: "BBA · 3 years",
    duration: "3 years",
    award: "Degree",
    affiliation: krishnaAffiliation,
    tagline: "Westin College of Business Administration",
    image: {
      key: "campus/bba-programme",
      alt: "Business administration students in a seminar",
    },
    overview: [
      "The Bachelor of Business Administration (BBA) is a three-year undergraduate degree designed to provide students with comprehensive knowledge of business management, leadership, entrepreneurship, and corporate strategies. This program focuses on practical skills, industry exposure, and real-world applications to prepare students for managerial and entrepreneurial careers in a dynamic business environment.",
      "The curriculum is designed to provide a strong theoretical foundation while ensuring students acquire hands-on experience through internships, live projects, case studies, and industry interactions.",
    ],
    stages: [
      {
        label: "Year 1",
        title: "Core subjects",
        text: "The core subjects of business administration, building the theoretical foundation.",
      },
      {
        label: "Year 2",
        title: "Internship and certifications",
        text: "A three-month internship plus certifications in Analytics, FinTech, Logistics, Aviation, Human Resources, Real Estate, Entrepreneurship and Salesforce.",
      },
      {
        label: "Year 3",
        title: "Specialisation and corporate training",
        text: "A one-year specialisation certification plus six months of corporate training.",
      },
    ],
    eligibility: [
      {
        label: "Educational qualification",
        items: ["10+2 in any stream (Arts, Science, Commerce)"],
      },
      { label: "Minimum marks", items: ["50% aggregate"] },
      { label: "Medical fitness", items: ["Medical fitness certificate required"] },
    ],
    careerPathway:
      "BBA graduates can pursue careers in business management, marketing, finance, banking, consulting, startups, and more. Students can also pursue MBA, PGDM, CA, CFA, or other advanced management programs.",
    sections: [
      {
        title: "Specialisations",
        items: [
          "Marketing Management",
          "Finance & Accounting",
          "Human Resource Management",
          "International Business",
          "Entrepreneurship & Innovation",
        ],
      },
      {
        title: "\u{1F4CC} Professional Values & Ethics",
        items: [
          "Inculcates strong business ethics, corporate responsibility, and professional integrity to function effectively in the global business environment.",
        ],
      },
      {
        title: "Entrepreneurial focus",
        items: [
          "Encourages business innovation, start-up incubation, and entrepreneurial mindset with mentorship from industry leaders.",
        ],
      },
      {
        title: "Internships",
        items: [
          "A three-month internship in the second year.",
          "A six-month internship in semester 6.",
        ],
      },
      {
        title: "Fees and financial assistance",
        text: "Fees vary by academic year. Westin offers help with education loans through partner banks; contact the admission office for current figures.",
      },
      {
        title: "Campus tours and counselling",
        text: "Visit the college campus for offline application, and talk through your options with the admission team. Admissions typically involve a screening process, including an interview.",
      },
      { title: "Important Dates", items: ["Application Open"] },
    ],
    source: officialSources.bba,
  },
  {
    slug: "bba-4-years-programe",
    school: "business",
    name: "Bachelor of Business Administration (Honours)",
    shortName: "BBA Honours · 4 years",
    duration: "4 years",
    award: "Honours degree",
    affiliation: krishnaAffiliation,
    tagline: "BBA (Honours) — Westin College of Business Administration",
    image: {
      key: "campus/bba-programme-2",
      alt: "BBA honours students in a leadership session",
    },
    overview: [
      "A four-year honours route that matches the BBA in years one to three. The fourth year covers research, innovation and leadership with a one-year research project.",
    ],
    stages: [
      {
        label: "Year 1",
        title: "Core subjects",
        text: "The core subjects of business administration, building the theoretical foundation.",
      },
      {
        label: "Year 2",
        title: "Internship and certifications",
        text: "A three-month internship plus certifications in Analytics, FinTech, Logistics, Aviation, Human Resources, Real Estate, Entrepreneurship and Salesforce.",
      },
      {
        label: "Year 3",
        title: "Specialisation and corporate training",
        text: "A one-year specialisation certification plus six months of corporate training.",
      },
      {
        label: "Year 4",
        title: "Research, innovation and leadership",
        text: "A one-year research project focused on research, innovation and leadership.",
      },
    ],
    eligibility: [
      {
        label: "Educational qualification",
        items: ["10+2 in any stream (Arts, Science, Commerce)"],
      },
      { label: "Minimum marks", items: ["50% aggregate"] },
      { label: "Medical fitness", items: ["Medical fitness certificate required"] },
    ],
    careerPathway:
      "BBA graduates can pursue careers in business management, marketing, finance, banking, consulting, startups, and more.",
    source: officialSources.bbaHonours,
  },
];

/** Junior College: the two intermediate streams. */
export const juniorProgrammes: Programme[] = [
  {
    slug: "mec",
    school: "junior",
    name: "MEC (Mathematics, Economics, Commerce)",
    shortName: "MEC · 2 years",
    duration: "2 years",
    award: "Intermediate",
    affiliation: stateBoardAffiliation,
    tagline: "Two-Year Junior College Program",
    image: { key: "campus/junior-about", alt: "Junior college students in a classroom" },
    overview: [
      "These courses provide essential knowledge in business, finance, and economics, equipping students with the skills needed for future studies in BBA, BHM, B.Com, CA, CS, and professional business careers.",
    ],
    stages: [
      {
        label: "Year 1",
        title: "Intermediate first year",
        text: "Mathematics, Economics and Commerce under the State Board of Intermediate Education, AP.",
      },
      {
        label: "Year 2",
        title: "Intermediate second year",
        text: "Continuation of the chosen stream, preparing students for higher education and professional courses.",
      },
    ],
    eligibility: [
      { label: "Educational qualification", items: ["10th in any stream"] },
      { label: "Minimum marks", items: ["50%"] },
      { label: "Medical fitness", items: ["Medical fitness certificate required"] },
    ],
    careerPathway:
      "Graduates can pursue BBA, BHM, B.Com, CA, CS, MBA, and careers in banking, finance, business, and entrepreneurship.",
    source: officialSources.juniorCourses,
  },
  {
    slug: "cec",
    school: "junior",
    name: "CEC (Civics, Economics, Commerce)",
    shortName: "CEC · 2 years",
    duration: "2 years",
    award: "Intermediate",
    affiliation: stateBoardAffiliation,
    tagline: "Two-Year Junior College Program",
    image: {
      key: "schools/business-management",
      alt: "Junior college students during a college activity",
    },
    overview: [
      "These courses provide essential knowledge in business, finance, and economics, equipping students with the skills needed for future studies in BBA, BHM, B.Com, CA, CS, and professional business careers.",
    ],
    stages: [
      {
        label: "Year 1",
        title: "Intermediate first year",
        text: "Civics, Economics and Commerce under the State Board of Intermediate Education, AP.",
      },
      {
        label: "Year 2",
        title: "Intermediate second year",
        text: "Continuation of the chosen stream, preparing students for higher education and professional courses.",
      },
    ],
    eligibility: [
      { label: "Educational qualification", items: ["10th in any stream"] },
      { label: "Minimum marks", items: ["50%"] },
      { label: "Medical fitness", items: ["Medical fitness certificate required"] },
    ],
    careerPathway:
      "Graduates can pursue BBA, BHM, B.Com, CA, CS, MBA, and careers in banking, finance, business, and entrepreneurship.",
    source: officialSources.juniorCourses,
  },
];

export const programmes: Programme[] = [
  ...hospitalityProgrammes,
  ...businessProgrammes,
  ...juniorProgrammes,
];

export function programmesBySchool(school: ProgrammeGroup["id"]) {
  return programmes.filter((programme) => programme.school === school);
}

/** The "Why Westin" voices, with their official portraits and quotes. */
export const teamVoices: Person[] = [
  {
    id: "p-chandra-sekhar",
    name: "P. Chandra Sekhar",
    role: "Principal",
    heading: "Why Westin",
    quote:
      "Westin has established world class education, research and innovation ecosystem bringing together the world's greatest minds to co-create a vibrant, diverse community to drive progress, pilot new ways of living and focus solving the world's biggest challenges. Westin will be an engaging learning environment that builds community, drives continuous pan-discipline innovation and impact, and fosters knowledge and skills for the future workforce sustainability",
    image: {
      key: "people/p-chandra-sekhar",
      alt: "P. Chandra Sekhar, Principal of Westin College",
    },
    source: officialSources.hotelCollege,
  },
  {
    id: "p-suresh-babu",
    name: "P. Suresh Babu",
    role: "HOD, Westin",
    heading: "Why Westin",
    quote:
      "Westin is a destination famed for advancing the frontiers of learning. Our education and Practical facilities will stand out as a beacon of the commitment to a sustainable future for all. Embark on a rewarding journey with the Westin Degree and Diploma programs",
    image: { key: "people/p-suresh-babu", alt: "P. Suresh Babu, Head of Department at Westin" },
    source: officialSources.hotelCollege,
  },
  {
    id: "vishwajit-jadhav",
    name: "Dr. Vishwajit Jadhav",
    role: "Research Automation and Publishing Officer",
    heading: "Why Westin",
    quote:
      "Westin will be a preeminent progressive institution and a vibrant foundry of next-gen education and technology, empowering students to be tomorrow's leaders, innovators and entrepreneurs",
    image: {
      key: "people/vishwajit-jadhav",
      alt: "Dr. Vishwajit Jadhav, Research Automation and Publishing Officer",
    },
    source: officialSources.hotelCollege,
  },
  {
    id: "shampa-chatterjee",
    name: "Ms. Shampa Chatterjee",
    role: "Lecturer, Housekeeping",
    heading: "Why Westin",
    quote:
      "Westin has a strong culture of long term, Cordial relationships with Parents and Colleagues alike. We are proud to work here since we feel recognized in my work, and my career is nurtured and enhanced through many activities and training offered within the Westin. Working with Westin is truly a Treasured Time.",
    image: { key: "people/shampa-chatterjee", alt: "Ms. Shampa Chatterjee, Lecturer in Housekeeping" },
    source: officialSources.hotelCollege,
  },
  {
    id: "sk-kalisha-vali",
    name: "Mr. SK. Kalisha Vali",
    role: "Food & Beverage Operations",
    heading: "Why Westin",
    quote:
      "By creating \"International job skills\" for our students, we spark their talent and engage with their own individual tastes and interests by providing skills into the employment rolls.",
    image: { key: "people/sk-kalisha-vali", alt: "Mr. SK. Kalisha Vali, Food and Beverage Operations" },
    source: officialSources.hotelCollege,
  },
  {
    id: "rahul-nair",
    name: "Mr. Rahul Nair",
    role: "Front Office",
    heading: "Why Westin",
    quote:
      "Westin establishing Student-centric and interconnected education, research, and innovation ecosystem that inspires fluidity in thinking from cradle to evolving career. Westin Provided more than 12000 International placements and tie -up with major reputed Business organisations and Hotel Chains.",
    image: { key: "people/rahul-nair", alt: "Mr. Rahul Nair, Front Office" },
    source: officialSources.hotelCollege,
  },
  {
    id: "arun-kumar",
    name: "Mr. Arun Kumar",
    role: "Lecturer, Bakery",
    heading: "Why Westin",
    quote:
      "Westin has a strong culture of long term, Cordial relationships with Parents and Colleagues alike. We are proud to work here since we feel recognized in my work, and my career is nurtured and enhanced through many activities and training offered within the Westin. Working with Westin is truly a Treasured Time",
    image: { key: "people/arun-kumar", alt: "Mr. Arun Kumar, Lecturer in Bakery" },
    source: officialSources.junior,
  },
  {
    id: "vyshnavi",
    name: "Ms. Vyshnavi",
    role: "Communication & Soft Skills",
    heading: "Why Westin",
    quote: site.legacyLine,
    image: { key: "people/vyshnavi", alt: "Ms. Vyshnavi, Communication and Soft Skills" },
    source: officialSources.junior,
  },
];

export const facultyExcellence: Titled[] = [
  {
    title: "Experienced Professors & Industry Experts",
    text: "Westin College prides itself on having some of the finest faculty members, who bring a wealth of experience and industry knowledge. Our professors are not just educators but also mentors who guide students in achieving their academic and professional aspirations.",
    items: [
      "Our faculty members hold PhDs and MBAs from prestigious institutions.",
      "Many professors have corporate experience, having worked in multinational companies.",
      "Regular guest lectures from CEOs, entrepreneurs, and business leaders.",
      "Faculty members provide one-on-one mentoring to help students with career guidance and research projects.",
    ],
  },
  {
    title: "Personalized Learning Approach",
    items: [
      "Small Class Sizes: Ensuring better student-teacher interaction.",
      "Case Study Methodology: Teaching through real-world business scenarios.",
      "Live Projects: Students work on actual business problems for practical exposure.",
      "Leadership Development Programs: Nurturing future business leaders through workshops and training.",
    ],
  },
];

export const campusCulture: Titled = {
  title: "A Thriving Campus Culture",
  text: "At Westin College, we believe that student life should be an exciting and transformational journey. Our campus is a hub of cultural diversity, innovative thinking, and social engagement. The college is designed to promote a balance between rigorous academics and extracurricular activities, ensuring that every student gets the best of both worlds.",
  items: [
    "Modern Classrooms equipped with digital boards and high-speed internet to enhance interactive learning.",
    "Library & Learning Center stocked with thousands of books, journals, and online resources.",
    "Computer Labs & Innovation Hubs to encourage research and technological advancements.",
    "Cafeteria & Recreational Areas offering a variety of cuisines and leisure spots to relax and unwind.",
  ],
};

export const studentLife = {
  title: "Events & Student Clubs",
  intro:
    "Engagement in extracurricular activities is a key part of student life. Westin College offers multiple student-run clubs and societies where students can explore their passions and talents:",
  clubs: [
    "Entrepreneurship Club: Encouraging business innovation and startup incubation.",
    "Finance & Investment Society: Providing insights into stock markets, banking, and financial strategies.",
    "Marketing Mavericks: Organizing workshops and networking events to discuss trends in branding and digital marketing.",
    "Cultural Club: Hosting music, dance, art, and film appreciation events.",
    "Sports Club: Offering activities like football, cricket, badminton, and athletics.",
    "Social Responsibility Club: Engaging in community service projects and awareness campaigns.",
  ],
  juniorTitle: "Student Life at Westin Junior College",
  juniorIntro:
    "At Westin Junior College, we believe in a holistic educational experience that extends beyond academics. Our students engage in:",
  juniorItems: [
    "Clubs & Societies – Business, Debate, and Entrepreneurship Clubs to enhance learning.",
    "Workshops & Seminars – Regular industry expert sessions and guest lectures.",
    "Sports & Cultural Events – Encouraging a healthy balance between academics and extracurricular activities.",
    "Student Support Services – Mentorship programs, counseling, and career guidance to help students achieve their goals.",
    "Leadership & Personality Development Programs – Training sessions to build confidence and leadership abilities.",
    "Community Engagement & Social Responsibility – Opportunities to participate in social initiatives, fostering a sense of responsibility and empathy.",
  ],
  source: officialSources.studentLife,
} as const;

export const juniorFaculty: Titled = {
  title: "Faculty & Academic Excellence",
  text: "Our faculty consists of experienced educators, industry professionals, and researchers dedicated to mentoring students and shaping their careers. We emphasize:",
  items: [
    "Innovative teaching methodologies combining theory and practical application.",
    "Personalized attention through small class sizes and mentoring.",
    "Use of Modern Teaching Aids – Digital classrooms, simulation exercises, and real-world case studies for enhanced learning.",
    "Continuous assessment and skill-building activities to enhance learning outcomes.",
    "Research-Based Learning – Encouraging students to engage in case studies, market research, and financial analysis.",
  ],
};

export const industryCollaboration = {
  title: "Industry Collaboration & Corporate Training",
  text: "To bridge the gap between academics and industry, we collaborate with top corporations, financial institutions, and business leaders. Our industry connections provide:",
  items: [
    "Guest Lectures & Career Seminars to gain real-world exposure.",
    "Corporate Training Programs to develop professional skills.",
    "Networking Opportunities with business leaders and alumni.",
    "Industry Visits – Giving students firsthand experience of business operations.",
    "Workshops with Entrepreneurs & Business Leaders – Learning directly from those who have excelled in the corporate world.",
  ],
  source: officialSources.junior,
} as const;

export const internships: Titled = {
  title: "Industry Collaboration & Internship Opportunities",
  text: "At Westin College, we ensure that our students get direct exposure to the corporate world through strong industry collaborations. We have established tie-ups with top multinational corporations, startups, and research organizations to provide internship and placement opportunities.",
  items: [
    "Internship Programs: Every student undergoes a structured internship in their 2nd and 6th semesters.",
    "Industry Visits: Students get firsthand experience of corporate environments through scheduled industry tours.",
    "Live Business Challenges: Collaboration with companies on real-time projects.",
    "Westin College Business Conclave: An annual event where students interact with industry leaders.",
  ],
};

export const corporateTraining: Titled = {
  title: "Corporate Training & Professional Development",
  text: "At Westin College, we ensure that our students get direct exposure to the corporate world through strong industry collaborations. We have established tie-ups with top multinational corporations, startups, and research organizations to provide internship and placement opportunities.",
  items: [
    "Soft Skills & Communication Workshops: Enhancing presentation, negotiation, and leadership abilities.",
    "Advanced Certification Courses: Partnering with global institutions for added qualifications.",
    "Mock Interviews & Resume-Building Sessions: Helping students secure the best job opportunities.",
    "Corporate Etiquette & Grooming: Preparing students for professional settings.",
  ],
};

export const bbaAdmissionReasons: Titled = {
  title: "Why choose the Westin BBA?",
  items: [
    "Comprehensive Curriculum: A strong foundation in management, leadership, entrepreneurship and corporate strategies.",
    "Industry Exposure: Internships, live projects, case studies and industry interactions.",
    "Global Perspective: Student exchange and international exposure.",
    "100% Placement Assistance: A dedicated placement cell that ensures students get placed in top companies.",
    "Entrepreneurial Focus: Startup incubation, mentorship, funding and resources for aspiring entrepreneurs.",
  ],
  source: officialSources.bbaAdmissions,
};

export const admissions2026 = {
  badge: "Admissions open 2026",
  programmesLine: "Hotel Management | BBA | MEC | CEC",
  courses: [
    {
      title: "Hotel Managment",
      highlights: ["Practical Training", "Internship Support", "Placement Assistance"],
    },
    { title: "BBA", highlights: ["Business Knowledge", "Industry Exposure", "Career Guidance"] },
    {
      title: "Junior Intermediate College",
      highlights: ["Experienced Faculty", "Exam Preparation", "Career Support"],
    },
  ],
  bbaNote:
    "The Westin School of Business Management offers BBA programs with specializations in Analytics, FinTech, Logistics, Aviation, Human Resources, Real Estate, and Entrepreneurship.",
  bbaHighlights: [
    "The Bachelor of Business Administration (BBA) is a three-year undergraduate degree designed to provide students with comprehensive knowledge of business management, leadership, entrepreneurship, and corporate strategies. This program focuses on practical skills, industry exposure, and real-world applications to prepare students for managerial and entrepreneurial careers in a dynamic business environment.",
    "The curriculum is designed to provide a strong theoretical foundation while ensuring students acquire hands-on experience through internships, live projects, case studies, and industry interactions.",
  ],
  hotelNote:
    "Westin is creating a human-centric and interconnected ecosystem where education meets innovation and careers begin with confidence. For over twenty-five years, Westin has been a destination for Hospitality management college Vijayawada and Business learning in Vijayawada and Hyderabad — empowering thousands to build global careers through personalized development, active industry partnerships, and research-driven learning.",
  juniorNote:
    "Welcome to Westin Junior College, a premier institution in Vijayawada that provides a solid foundation in Commerce & Management through its Two-Year Junior College Program under the State Board of Intermediate Education, Andhra Pradesh. Our programs are designed to prepare students for higher education and successful careers in business, commerce, and management.",
  psychometricTest: {
    title: "Psychometric Test",
    note: "The official navigation links a Psychometric Test form hosted on Google Forms.",
    href: officialSources.psychometricTest,
  },
  source: officialSources.admissions,
} as const;

/** The Hindu placement report, reproduced as published. */
export const placementNews = {
  title:
    "Westin College of Hotel Management Students bag jobs in hotels in UAE, Bahrain",
  lead: "Students of Westin College of Hotel Management bagged placements in international hotels in and around Dubai of the United Arab Emirates and Bahrain. In a ceremony on the college premises here on Wednesday, Krishna University Vice-Chancellor K.B. Chandrasekhar appreciated the students and the college and handed over visas and other travel documents to the students about to leave the country.",
  body: [
    "Mr. Chandrasekhar said it was a proud moment for Krishna University as Westin College became the first institution under the university to achieve 100% placement. He called upon all the college managements to focus on providing campus placements to graduates by reaching out to companies.",
    "He said hotel management graduates were in great demand on the lines of engineering graduates. College principal P. Chandrasekhar said that 90% of the 2018-2021 students were placed in the world's best five-star hotels. He said 103 students were placed in six hotels and institutions, including Dubai World Trade Centre, Gulf Hotels Group, Bahrain, Le Meridian, and Westin, Atlantis Palm, Dubai, Fontana, Bahrain, and EFS Facilities Services, Dubai.",
  ],
  figures: [
    { value: "103", label: "students placed in six hotels and institutions" },
    {
      value: "90%",
      label: "of the 2018-2021 students were placed in the world's best five-star hotels",
    },
    {
      value: "100%",
      label: "placement — the first institution under Krishna University to achieve it",
    },
  ] satisfies Stat[],
  employers: [
    "Dubai World Trade Centre",
    "Gulf Hotels Group, Bahrain",
    "Le Meridian and Westin",
    "Atlantis Palm, Dubai",
    "Fontana, Bahrain",
    "EFS Facilities Services, Dubai",
  ],
  publishedIn: "THE HINDU",
  source: officialSources.theHindu,
  page: officialSources.newsMore,
} as const;

export const alumniStories: (Person & { journey: string })[] = [
  {
    id: "alumni-sudharshan-motupalli",
    name: "Mr. Sudharshan Motupalli",
    role: "General Manager, Novotel Vijayawada",
    journey: "Interned at Sheraton Bahrain, then The Cove Rotana, Ras Al Khaimah.",
    image: {
      key: "people/alumni-sudharshan-motupalli",
      alt: "Mr. Sudharshan Motupalli, General Manager at Novotel Vijayawada",
    },
    source: officialSources.alumniPost,
  },
  {
    id: "alumni-vara-prasad",
    name: "Mr. Vara Prasad",
    role: "East Godavari",
    journey: "Ambition, enthusiasm and hard work pay off.",
    image: {
      key: "people/alumni-vara-prasad",
      alt: "Mr. Vara Prasad, Westin alumnus from East Godavari",
    },
    source: officialSources.alumniPost,
  },
  {
    id: "alumni-indra-kiran",
    name: "Indra Kiran",
    role: "Director of F&B",
    journey:
      "Joined WCHM in 2006, hired through a campus interview. Head Bartender at the Barasti Bar (Le Méridien / Westin Mina Seyahi, Dubai), now Director of F&B.",
    image: {
      key: "people/alumni-indra-kiran",
      alt: "Indra Kiran, Westin alumnus and Director of Food and Beverage",
    },
    source: officialSources.alumniPost,
  },
];

export const successStories = {
  title: "Team Westin — Success Stories",
  text: "Westin College, has a rich legacy of nurturing talented students who go on to achieve remarkable success in the hospitality industry. Known for its world-class curriculum and hands-on training, the college provides students with the skills and exposure needed to excel in competitive roles globally.",
  achievements: [
    {
      title: "Prasnothara — Business Quiz, 2nd prize",
      text: "Chandra Chandi, Manaswini and Gowshik T. (first-year BBA) won 2nd prize in Prasnothara (Business Quiz), PG Dept. of Business Administration, KBN College.",
      image: {
        key: "campus/quiz-prasnothara",
        alt: "First-year BBA students who won 2nd prize in the Prasnothara business quiz",
      } as Pic,
    },
    {
      title: "CHITROPA HASAK — Movie Quiz, 2nd prize",
      text: "Abhiram, Lalasa and Bhanu Tejaswini won 2nd prize in CHITROPA HASAK (Movie Quiz) at MAST 2025, KBN College.",
      image: {
        key: "campus/quiz-chitropa-hasak",
        alt: "BBA students who won 2nd prize in the CHITROPA HASAK movie quiz",
      } as Pic,
    },
  ],
  studentAwards: { title: "Student Awards", album: "student-awards" },
  teamWestin: { title: "Team Westin", album: "team-westin" },
  bbaSuccess: { title: "BBA Success Stories", album: "bba-success" },
  source: officialSources.successStories,
} as const;

/** Magazine PDFs, from the official documents list. */
export const magazinePdfs: OfficialDoc[] = [
  {
    title: "Sattvika V1",
    href: "https://www.westincollegevijayawada.com/_files/ugd/e48a5b_b9e9977404f84e6e871b49ec3e000ab9.pdf",
  },
  {
    title: "Sattvika V2",
    href: "https://www.westincollegevijayawada.com/_files/ugd/e48a5b_e20263673b754c419efed67c75002885.pdf",
  },
  {
    title: "Sattvika V3",
    href: "https://www.westincollegevijayawada.com/_files/ugd/e4b079_39c690c54eb54f0a9a581c34c8e7d5be.pdf?index=true",
  },
  {
    title: "Table Magazine 1",
    href: "https://www.westincollegevijayawada.com/_files/ugd/e4b079_5ee25301beb549ed90b8ff0c08252e13.pdf",
  },
  {
    title: "Table Magazine 3",
    href: "https://www.westincollegevijayawada.com/_files/ugd/e4b079_8d7b159078794b789e40fc358c986a8a.pdf",
  },
];

/** The three gallery albums on the official Gallery page, in caption order. */
export const albums: Album[] = [
  {
    id: "welcoming-freshers",
    title: "Welcoming freshers to Jewel Committee",
    albumKey: "gallery-albums",
    source: officialSources.gallery,
  },
  {
    id: "avenir-jeunes-2019",
    title: "Avenir Jeunes 2019",
    albumKey: "gallery-albums",
    source: officialSources.gallery,
  },
  {
    id: "show-time",
    title: "Show Time",
    albumKey: "gallery-albums",
    source: officialSources.gallery,
  },
];

/** The 18 event galleries, in the official order. */
export const eventGalleries = [
  ["bhm-diwali-2024", "BHM Diwali 2024", "2024"],
  ["cake-distribution", "Cake Distribution", ""],
  ["cake-mixing", "Cake Mixing", ""],
  ["flower-decoration", "Flower Decoration", ""],
  ["ghsdp-2024", "GHSDP 2024", "2024"],
  ["iftar-party", "Iftar party", ""],
  ["independence", "Independence", ""],
  ["janstami-bhm", "Janmashtami BHM", ""],
  ["mr-and-ms", "Mr & Ms", ""],
  ["old-age-home", "Old Age Home", ""],
  ["onam", "Onam", ""],
  ["pattabi", "Pattabi", ""],
  ["sankranthi", "Sankranthi", ""],
  ["sparkles", "Sparkles", ""],
  ["vinayaka-chavithi", "Vinayaka Chavithi", ""],
  ["tourism-2024", "Tourism 2024", "2024"],
  ["star", "Star", ""],
  ["sparkles-2024", "Sparkles 2024", "2024"],
] as const;

export const publishingHouse = {
  name: "Westin Publishing House",
  tagline: "Bringing Stories to Life, One Page at a Time",
  welcome:
    "Welcome to Westin Publishing House – Inspiring Authors, Creating Legacies. Whether you are a student, academic, or aspiring novelist, your journey starts here.",
  vision:
    "To cultivate a new generation of thinkers, storytellers, and thought leaders by making publishing an accessible and rewarding journey for all.",
  mission:
    "To provide quality-driven, affordable, and transparent publishing services while nurturing creativity and intellectual growth among students and professionals alike.",
  whyChoose: {
    title: "Why Choose Westin Publishing House?",
    items: [
      "Empowering Aspiring Authors – Whether you are a student with a passion for storytelling or an academic seeking to publish research, we provide the guidance and tools to turn your vision into a published work.",
      "Comprehensive Publishing Services – From manuscript development to marketing and global distribution, we offer a full spectrum of publishing solutions.",
      "Innovative & Author-Centric Approach – We prioritize the author's vision, ensuring personalized publishing strategies tailored to different genres and audiences.",
      "Industry Expertise & Mentorship – Learn from renowned authors, editors, and publishing professionals who guide you through the entire publishing journey.",
      "Global Reach & Distribution – Your work deserves recognition. We ensure worldwide availability through Amazon, bookstores, eBook platforms, and libraries.",
      "Exclusive Student Publishing Programs – Designed for young, budding writers, our programs make publishing accessible to students from high school to university level.",
    ],
  },
  categories: {
    title: "Our Publishing Categories",
    intro:
      "At Westin Publishing House, we cater to a diverse range of literary and academic works, including",
    items: [
      { title: "Fiction & Non-Fiction", text: "Novels, short stories, memoirs, biographies, and self-help books." },
      { title: "Poetry & Anthologies", text: "Celebrate the beauty of words through collections of poetry, essays, and collaborative anthologies." },
      { title: "Academic & Research Publications", text: "Publish theses, dissertations, research journals, and textbooks in various fields." },
      { title: "Children's Books & Educational Content", text: "From illustrated books to academic resources, we bring learning to life." },
      { title: "Digital Publishing & E-Books", text: "Offering authors the latest in self-publishing and digital book distribution." },
      { title: "Business & Management Literature", text: "Business case studies, entrepreneurship guides, leadership books, and corporate strategies." },
      { title: "Service Cookbooks & Hospitality Publications", text: "A special niche for aspiring chefs, hoteliers, and hospitality students to document and share their knowledge." },
    ],
  },
  mentorship: {
    title: "Author Mentorship & Training Programs",
    intro:
      "At Westin, we believe in lifelong learning and continuous improvement. Our Author Mentorship & Training Programs include:",
    items: [
      "Creative Writing Workshops – Learn storytelling techniques, character development, and narrative structure.",
      "Publishing Masterclasses – Step-by-step guidance on the publishing process, copyrights, and book marketing.",
      "Author Branding & Public Speaking – Strategies to establish yourself as a professional author.",
      "Networking with Industry Experts – Interact with best-selling authors, literary agents, and book marketers.",
      "Internship & Work Opportunities – Gain hands-on experience in the publishing world.",
    ],
  },
  studentProgram: {
    title: "Student Author Program – Make Your Dream a Reality",
    intro:
      "Westin Publishing House is proud to introduce the Student Author Program (SAP), designed specifically for students who wish to step into the world of publishing. This initiative nurtures creativity, develops writing skills, and provides real-world publishing experience.",
    whoCanApply: [
      "School and college students who want to publish their first work.",
      "Student authors working on a thesis, dissertation or research paper.",
      "Young writers building a portfolio or a first book.",
    ],
    benefits: [
      "Mentorship from experienced authors and editors.",
      "Editing, proofreading and book design support.",
      "Print and digital publishing options.",
      "Marketing, launch events and social media promotion.",
      "Career guidance for student authors.",
      "Affordable pricing designed for student budgets.",
    ],
    process: [
      "Submit your manuscript through the website or contact the editorial team.",
      "Receive an editorial assessment of the manuscript.",
      "Complete revisions with the editorial team.",
      "Approve the final book design and cover.",
      "Print and publish the book.",
      "Marketing, distribution and launch support.",
    ],
    source: officialSources.authorProgram,
  },
  store: [
    { title: "Table Magazine", price: "₹499.00", href: "https://www.westincollegevijayawada.com/product-page/table-magazine" },
    { title: "Sattvika Volume 3", price: "₹499.00", href: "https://www.westincollegevijayawada.com/product-page/sattvika-volume-3" },
  ],
  contact: { email: site.contact.publishingEmail, phone: "+91 9393755755" },
  source: officialSources.publishing,
} as const;

/** The four FAQ groups, transcribed from Westin's published FAQ sections. */
export const faqGroups: FaqGroup[] = [
  {
    id: "bhm",
    label: "Hotel Management",
    source: officialSources.hotelCollege,
    items: [
      { q: "What is BHM, and how is it beneficial for a career in hospitality?", a: "BHM (Bachelor of Hotel Management) is a professional degree that provides students with comprehensive knowledge and skills in hospitality, tourism, and hotel operations. It opens doors to careers in hotels, resorts, cruise lines, event management, and food & beverage industries." },
      { q: "Is Westin College of Hotel Management affiliated with any university?", a: "Yes, Westin College of Hotel Management is affiliated with Krishna University and recognized by the relevant educational authorities." },
      { q: "What is the duration of the BHM course?", a: "The BHM program at Westin College is a 4-year undergraduate course, including internships and hands-on training in various hospitality sectors." },
      { q: "What are the eligibility criteria for admission to BHM?", a: "The eligibility criteria include:\n• Completion of 10+2 or equivalent from a recognized board.\n• A passion for hospitality, customer service, and management." },
      { q: "How can I apply for admission?", a: "visit the college campus for offline application. Admissions typically involve a screening process, including an interview." },
      { q: "What is the fee structure for the BHM program?", a: "The fee structure varies depending on the academic year. You can contact the admission office for detailed information." },
      { q: "Are there any scholarships available?", a: "Yes, the college offers scholarships based on merit, financial need, and special categories like sports or cultural achievements. Contact the administration office for eligibility details." },
    ],
  },
  {
    id: "bba",
    label: "Business Management",
    source: officialSources.business,
    items: [
      { q: "What is the duration of the BBA program?", a: "The Bachelor of Business Administration (BBA) program is a 3-year full-time undergraduate course." },
      { q: "What specializations are offered?", a: "We offer specializations in Marketing, Finance, Human Resources, International Business, and Entrepreneurship." },
      { q: "What are the career opportunities after completing BBA?", a: "BBA graduates can pursue careers in business management, marketing, finance, banking, consulting, startups, and more." },
      { q: "Does the college provide placement assistance?", a: "Yes, we have a dedicated placement cell that ensures students get placed in top companies." },
      { q: "Are there opportunities for higher education after BBA?", a: "Yes, students can pursue MBA, PGDM, CA, CFA, or other advanced management programs." },
      { q: "How does Westin College support entrepreneurship?", a: "Our Entrepreneurship Club and Startup Incubation Program provide funding, mentorship, and resources for aspiring entrepreneurs." },
    ],
  },
  {
    id: "junior",
    label: "Junior College",
    source: officialSources.junior,
    items: [
      { q: "What are the career prospects after completing MEC or CEC?", a: "Graduates can pursue BBA,BHM, B.Com, CA, CS, MBA, and careers in banking, finance, business, and entrepreneurship." },
      { q: "Is there any entrance exam for admission?", a: "No, admissions are based on 10th-grade marks and eligibility criteria." },
      { q: "Does the college provide scholarships?", a: "Yes, scholarships are available for meritorious students and economically weaker sections." },
      { q: "How does the college support placements?", a: "We provide career counseling, corporate training, and networking opportunities to help students secure jobs in reputed organizations." },
      { q: "What extracurricular activities are available?", a: "We offer clubs, cultural events, sports, workshops, and seminars to enhance student life." },
      { q: "Does the college provide hostel facilities?", a: "Yes, we offer safe and well-maintained hostel facilities for students from other cities." },
      { q: "What kind of corporate training is included?", a: "Students receive personality development, communication, business etiquette, and financial management training to prepare them for the corporate world." },
    ],
  },
  {
    id: "publishing",
    label: "Publishing House",
    source: officialSources.publishing,
    items: [
      { q: "Do I need to have prior writing experience to publish with Westin?", a: "No! We welcome first-time authors and provide support at every stage." },
      { q: "How long does the publishing process take?", a: "Depending on the project, it can take anywhere from 3 to 6 months." },
      { q: "What kind of support does Westin provide for student authors?", a: "We offer mentorship, editing, book design, marketing, and career guidance to ensure student success." },
      { q: "Can I publish an eBook instead of a printed book?", a: "Absolutely! We provide both print and digital publishing options." },
      { q: "How can I market my book after publishing?", a: "Westin Publishing House offers marketing services, book launch events, and social media promotions to help authors reach their audience." },
      { q: "How can I submit my manuscript?", a: "You can submit your manuscript via our website or contact our editorial team at [email@example.com]." },
    ],
  },
];

/**
 * Official-site items deliberately not reproduced, each with its reason. The
 * coverage report prints this list so every omission is auditable.
 */
export const coverageExclusions: { page: string; item: string; reason: string }[] = [
  { page: "blank-1-2-1-1-1-1-1-1-1-2", item: "Faculty Portal", reason: "Staff time-log form. Not a public page and must not be linked from Home." },
  { page: "competition-registration-portal", item: "Competetion Register Portal", reason: "A registration form. Replaced by the WhatsApp counselling route." },
  { page: "blank-1-3-1-1", item: "E-Portal", reason: "Restricted area returning \"no permission\"." },
  { page: "pricing-plans", item: "Pricing plans", reason: "Empty page with no published plans." },
  { page: "category__all-products", item: "Store cart and checkout", reason: "Commerce checkout. Publications are linked as documents instead." },
  { page: "home", item: "Hero background video and poster", reason: "Veo-watermarked AI footage. Excluded by the user's instruction to add no video." },
  { page: "home", item: "\"Get free counselling\" popup form", reason: "Superseded by the in-page WhatsApp counselling form, which stores no data." },
  { page: "hotel-management-college-in-vijayawada", item: "\"Our Best Features\" block and its paragraph", reason: "Hidden Wix template filler, not visible on the live site." },
  { page: "hotel-management-college-in-vijayawada", item: "20+ / 70% / 90% / 1200+ counters", reason: "Hidden Wix template counters, not visible on the live site." },
  { page: "bba-college-in-vijayawada", item: "Jamie Lane / Max Johnson template cards", reason: "Hidden filler in the Faculty Excellence section." },
  { page: "vision-mision", item: "Social links to Wix Studio profiles", reason: "Wix placeholders, not Westin's own accounts." },
  { page: "footer", item: "Privacy Policy / Term & Conditions / Cookie Policy", reason: "Wix placeholders with no published Westin policy." },
  { page: "footer", item: "\"© 2024 by Westin Powered by Daizo\"", reason: "Platform attribution, not college information." },
  { page: "blank-1-2-1-1-1-1-1-1-1-2-1", item: "Publishing welcome paragraph", reason: "The official page mistakenly reuses the junior-college paragraph; replaced with the correct publishing welcome text." },
  { page: "dhm-1-year-course", item: "Phase 2 duration", reason: "Heading says three months, body says four. Both are shown rather than silently choosing one." },
  { page: "bba-college-in-vijayawada", item: "Three team quotes repeating the hotel page", reason: "Identical text already published under Team voices; not duplicated." },
];

/**
 * Resolve a media key to its optimised files. Sizes come from
 * officialMedia.generated.json, written by scripts/fetch-official-media.mjs.
 */
export interface OfficialImage {
  src: string;
  srcSet?: string | string[];
  width: number;
  height: number;
}

/** Gallery entries are recorded without dimensions until they are measured. */
interface MediaEntry {
  src: string;
  srcset?: string | string[];
  width?: number;
  height?: number;
}

const mediaIndex: Record<string, MediaEntry> = (
  generatedMedia as unknown as { images?: Record<string, MediaEntry> }
).images ?? {};

function toImage(entry: MediaEntry): OfficialImage {
  return {
    src: entry.src,
    srcSet: entry.srcset,
    width: entry.width ?? 960,
    height: entry.height ?? 640,
  };
}

export function mediaImage(key: string): OfficialImage {
  const found = mediaIndex[key];
  if (found) return toImage(found);
  // Graceful fallback keeps SSR working before media has been generated.
  return { src: `/images/official/${key}-960.webp`, width: 960, height: 640 };
}

export function albumPhotos(albumKey: string, limit = 12): OfficialImage[] {
  const prefix = `${albumKey}/`;
  return Object.keys(mediaIndex)
    .filter((key) => key.startsWith(prefix))
    .sort()
    .slice(0, limit)
    .map((key) => toImage(mediaIndex[key]));
}

/**
 * The seven official hero taglines, each paired with its own real photograph.
 * These carry the college's own campaign copy and were previously absent.
 */
export const heroTaglines: { title: string; subtitle: string; image: Pic }[] = [
  {
    title: "Every Westin student is a story of courage, curiosity, and creation shaping a new world of enterprise.",
    subtitle: "From room service to fine dining, master hospitality here!",
    image: { key: "campus/hm-service-team", alt: "Hotel management students in practical service training" },
  },
  {
    title: "From Service to Excellence, Build Your Legacy in Hospitality",
    subtitle: "Where every tray served and every room cleaned reflects professionalism and pride.",
    image: { key: "campus/hm-front-office", alt: "Westin students training in hotel front office operations" },
  },
  {
    title: "Transforming Passion into Professional Hospitality Skills.",
    subtitle: "Discover the art of exceptional room service and elevate every guest's experience.",
    image: { key: "campus/hm-room-service", alt: "A student practising room service standards" },
  },
  {
    title: "Ideas are born in classrooms, but impact is created in the world that’s the Westin way",
    subtitle: "Learn from the best, be the best",
    image: { key: "campus/hm-learning", alt: "Westin students in a practical learning session" },
  },
  {
    title: "Learn the art of hospitality.",
    subtitle: "Your journey to hospitality excellence starts here.",
    image: { key: "campus/hm-hospitality", alt: "Hospitality students during practical training" },
  },
  {
    title: "We don’t prepare students for jobs; we prepare them for journeys of leadership and innovation.",
    subtitle: "Hands-on training in 5-star hotels.",
    image: { key: "schools/hotel-management", alt: "Westin College of Hotel Management students" },
  },
  {
    title: "Shake, Stir, Serve: Master the Art of Bartending!",
    subtitle: "From mixing drinks to mastering flair, craft your bartending journey here!",
    image: { key: "campus/hm-bartending", alt: "A student practising bartending technique" },
  },
];

/** Business and junior-college campaign taglines, from their landing pages. */
export const businessTaglines: { title: string; subtitle: string; image: Pic }[] = [
  {
    title: "Ideas are born in classrooms, but impact is created in the world — that’s the Westin way.",
    subtitle: "From room service to fine dining, master hospitality here!",
    image: { key: "campus/bba-leadership", alt: "Westin business students in a leadership session" },
  },
  {
    title: "Leadership begins with learning and Westin builds both with integrity and imagination.",
    subtitle: "Learn from the best, be the best",
    image: { key: "campus/bba-learning", alt: "Business management students in a learning session" },
  },
  {
    title: "We don’t prepare students for jobs; we prepare them for journeys of leadership and innovation.",
    subtitle: "Your journey to hospitality excellence starts here.",
    image: { key: "campus/bba-journeys", alt: "Westin business students on a college journey" },
  },
];

export const juniorTaglines: { title: string; subtitle: string; image: Pic }[] = [
  {
    title: "Learn, grow, and excel at our Junior College!",
    subtitle: "Shape your future with knowledge.",
    image: { key: "campus/junior-foundation", alt: "Westin junior college students" },
  },
  {
    title: "Build a strong foundation for your future!",
    subtitle: "Learn from the best, be the best",
    image: { key: "campus/bba-learning", alt: "Junior college students in a learning session" },
  },
  {
    title: "Your Gateway to a Successful Business Career",
    subtitle: "Equipping you with the skills to thrive in the corporate world.",
    image: { key: "campus/bba-leadership", alt: "Junior college students preparing for business careers" },
  },
];

/** Publishing House hero taglines. */
export const publishingTaglines: { title: string; subtitle: string }[] = [
  { title: "Publishing Dreams, Creating Legacies.", subtitle: "Your journey to story telling starts here." },
  { title: "Bringing Stories to Life, One Page at a Time", subtitle: "Learn from the best, be the best" },
  { title: "Where Every Story Finds Its Reader.", subtitle: "Equipping you with the skills to thrive in the world." },
];

/** Two-Year Junior College Program: objectives, outcomes and key features. */
export const juniorProgrammeDetail = {
  title: "Two-Year Junior College Program",
  stream: "Commerce & Management Stream – State Board of Intermediate Education, Andhra Pradesh",
  overview:
    "Courses Offered: MEC (Mathematics, Economics, Commerce) & CEC (Civics, Economics, Commerce). The Junior College program at Westin Junior College, Vijayawada, is designed to build a strong foundation in business, commerce, and management principles. This program helps students prepare for higher education in BBA, B.Com, CA, CS, and professional business careers.",
  objectives: [
    "To develop competent professionals with strong business acumen, leadership skills, and ethical values who can effectively manage organizations in a competitive global business environment.",
    "To offer a well-balanced mix of theoretical and practical knowledge in management, finance, marketing, human resources, international business, and entrepreneurship.",
    "To enhance problem-solving abilities, critical thinking, and decision-making skills through real-world case studies, business simulations, and industry-based projects.",
    "To encourage entrepreneurial mindset and innovation, helping students start their own ventures or contribute effectively in corporate organizations.",
    "To provide global exposure through internships, industrial visits, expert lectures, and international collaborations.",
  ],
  learningOutcomes: [
    "Have a strong foundation in business management and economics.",
    "Be ready for higher education in BBA, B.Com, CA, CS, and MBA programs.",
    "Understand fundamental financial concepts and business operations.",
    "Develop problem-solving skills for real-world business challenges.",
  ],
  programObjectives: [
    "Introduce students to business, finance, economics, and entrepreneurship.",
    "Develop analytical, communication, and decision-making skills.",
    "Provide real-world exposure through internships and industry projects.",
    "Encourage students to pursue careers in business, commerce, and corporate sectors.",
  ],
  practicalLearning: [
    "Internship & Skill-Based Training in Second Year",
    "Practical exposure to business and financial concepts.",
    "Case studies, group discussions, and industry interaction.",
  ],
  keyFeatures: [
    "Industry-Relevant Knowledge — Exposure to modern business practices, financial literacy, and entrepreneurship fundamentals.",
    "Skill Development — Training in communication, analytical thinking, and leadership.",
    "Ethical & Professional Values — Focus on integrity, social responsibility, and ethical business practices.",
    "Global Learning Approach — Practical assignments, guest lectures, and workshops to prepare students for a global business environment.",
  ],
  closing:
    "The Junior College program at Westin Junior College, Vijayawada, provides quality education, career guidance, and industry exposure to prepare students for higher studies and successful careers in Business, Commerce, and Management.",
  source: officialSources.juniorCourses,
} as const;

/** Diploma in Food Production: the official objectives and framework. */
export const foodProductionDetail = {
  title: "Objectives & framework",
  steps: [
    {
      label: "Step 1",
      title: "Program Overview",
      text: "The Diploma in Food Production is designed to build specialized culinary knowledge and hands-on expertise in kitchen operations, food preparation, and food safety. It’s ideal for students who aspire to become chefs or kitchen professionals in hotels, restaurants, and catering establishments — focusing on culinary artistry, presentation, and kitchen management.",
    },
    {
      label: "Step 2",
      title: "Culinary Skills Development",
      text: "Students begin by mastering professional cooking techniques, from basic preparation methods to advanced culinary artistry across global cuisines. This phase nurtures creativity, discipline, and technical excellence — the foundation of every successful chef.",
    },
    {
      label: "Step 3",
      title: "Food Safety & Hygiene",
      text: "Students are trained in food safety laws, hygiene standards, and kitchen safety protocols, ensuring every dish meets international quality and compliance benchmarks.",
    },
    {
      label: "Step 4",
      title: "Practical Exposure",
      text: "Through immersive kitchen-based training, learners practice menu planning, recipe execution, and food production techniques under the mentorship of experienced chefs in a professional culinary environment.",
    },
    {
      label: "Step 5",
      title: "Internship & Industry Integration",
      text: "The final six months feature a real-world internship with reputed hotels and food production units, giving students live kitchen experience and preparing them for careers in commercial kitchens, catering operations, and international hospitality brands.",
    },
  ],
  source: officialSources.foodProduction,
} as const;

/** Publishing House documents, with the official PDF links. */
export const publishingDocuments: OfficialDoc[] = [
  { title: "Welcome Note", note: "The official page lists a welcome note without a file link." },
  { title: "Westin Publishing House Brochure" },
  { title: "Research Papers" },
  { title: "Checklist for Faculty" },
  { title: "Checklist Review" },
  { title: "Premium Book Publishing Package" },
  { title: "Standard Book Format with Examples" },
  { title: "7 Day Virtual Bootcamp" },
  { title: "7 Day Virtual Bootcamp for Research" },
  { title: "Standard Westin Publishing House" },
];

/** The Student Author Program's own six-step publishing process. */
export const studentAuthorProcess: { label: string; title: string; text: string }[] = [
  { label: "Step 1", title: "Concept & Manuscript Development", text: "Work with our team to refine your idea and create a strong manuscript." },
  { label: "Step 2", title: "Editing & Proofreading", text: "Professional editors polish your work, ensuring clarity, coherence, and accuracy." },
  { label: "Step 3", title: "Book Design & Formatting", text: "Our designers craft beautiful, reader-friendly layouts and covers." },
  { label: "Step 4", title: "Marketing & Promotion", text: "Personalized marketing strategies to maximize reach and reader engagement." },
  { label: "Step 5", title: "Publishing & Global Distribution", text: "Your book gets an ISBN, is printed, and made available worldwide through major bookstores, eBook platforms, and libraries." },
  { label: "Step 6", title: "Author Success & Recognition", text: "Celebrate your achievement with a book launch, media exposure, and speaking opportunities." },
];

/** The Student Author Program's stated benefits, in the official wording. */
export const studentAuthorBenefits: string[] = [
  "Inclusion in Westin’s Student Authors Hall of Fame.",
  "Mentorship and guidance throughout the publishing journey.",
  "Professional editing, proofreading and book design.",
  "Print and digital publishing options.",
  "Marketing, launch events and social media promotion.",
  "Career guidance for student authors.",
];
