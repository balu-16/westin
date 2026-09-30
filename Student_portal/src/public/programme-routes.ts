import { programmes } from './officialSite'

/** Public routes and the detailed records they share with the admissions comparison. */
export const officialProgrammeSlugs: Readonly<Record<string, readonly string[]>> = {
  bba: ['bba'],
  'bba-honours': ['bba-4-years-programe'],
  'bhm-three-year': ['3-years-degree-program'],
  'bhm-honours': ['4-years-degree-program'],
  'work-integrated-hotel-management': ['diploma-in-hotel-management'],
  'dhm-one-year': ['dhm-1-year-course'],
  'food-production': ['diploma-in-food-production'],
  pgdhm: ['pgdm'],
  intermediate: ['mec', 'cec'],
}

export function programmeRecordsFor(slug: string) {
  return programmes.filter((programme) => officialProgrammeSlugs[slug]?.includes(programme.slug))
}
