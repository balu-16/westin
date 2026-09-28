# Home page implementation

The public Home page at `/` follows [the approved editorial concept](editorial-home-concept.png). Review the [desktop](implemented-desktop.png) and [mobile](implemented-mobile.png) captures.

Home now has six concise modules: hero, study paths, campus and placements, college introduction, stories, and admissions. The three study cards lead to the relevant course pages. Published Home headline and story text can still update through the existing content feed without changing the layout.

| Detail removed from Home | Destination |
| --- | --- |
| College history and founder | `/about` |
| Vision and mission | `/about/mission-vision` |
| Leadership | `/about/management` |
| Faculty and team voices | `/about/faculty` |
| Full course information, junior program, culinary framework and course questions | `/programs/*` |
| Campus life and events | `/campus`, `/campus/events` |
| Industry learning | `/why-westin` |
| Achievements and placement outcomes | `/placements` |
| Placement news report | `/news/westin-students-uae-bahrain` |
| Alumni stories | `/success-stories` |
| Publishing House and its questions | `/publishing-house` |
| Admissions details and counselling | `/admissions`, `/contact` |

The seven WebP image sets under `Student_portal/public/images/editorial-home/` were generated to match the concept. They illustrate student life and do not document the actual Westin campus or students. The page labels them accordingly and links to the official gallery for real photographs.

Verification: 21 Playwright tests passed, including responsive layouts and automated WCAG checks; the production build prerendered 103 public routes; the retained official content audit found 2,645 of 2,645 blocks across destination pages.
