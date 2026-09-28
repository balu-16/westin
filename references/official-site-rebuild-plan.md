# Westin official-site rebuild — implementation plan

> Historical plan. Its proposal to put all official content on Home was superseded by the later Home page redesign. See [the implemented Home layout](homepage-rebuild/implementation.md) for the current page structure and content routes.

Source of record: `https://www.westincollegevijayawada.com/`
Crawl artifacts: `references/official-crawl.local/` (already complete — **do not re-crawl**)
App: `Student_portal/` (React 19, Vite 8, Tailwind v4, react-router 7, lucide-react; sharp + Playwright dev deps)

## 1. Goal

Every piece of college information published on the official site appears on **our Home page**, organised far better than the original: scannable, tabbed, accordion-driven, gallery-rich. The official site's own photography is reused (founder, leadership, staff, alumni, campus, events). Everything is presented in our existing `sk-*` design system — no Wix styling, no external CDN.

## 2. Decisions locked with the user

| # | Decision | Effect |
| --- | --- | --- |
| 1 | The cut-off "Remove the …" line meant **nothing**. | Nothing is removed. Hero art, blog bodies and disclaimers all stay. |
| 2 | **No video** in the hero background. | Verified: `grep` finds zero `<video>` in `src/public/*.tsx`. The official hero video/poster `e4b079_fb8fa382f00443d398925ef58af7128b…` is Veo-watermarked AI footage and is excluded. Nothing is added. Hero stays a static Skybook illustration. |
| 3 | **BHM is 3 years.** | The BHM FAQ's "4-year undergraduate course" contradicts its own programme page. We publish **3 years** everywhere (citing `3-years-degree-program`). The separate 4-year route is presented as BHM (Honours). |
| 4 | `/blog/<slug>` carries the **full original article text**, in our theme. | 31 posts, ~28,433 words (median 874, max 1,442). Replaces today's generic `studyNotes`. Bodies are **code-split and lazy-loaded** so the Home bundle stays small. Competitor colleges named in 4 articles are migrated **verbatim** (factual published content) with the source link on every article. |
| 5 | Everything migrated must use **our theme**. | New UI reuses `--sk-ink/-blue/-orange/-sky`, `.sk-container`, existing components. No Wix look. |
| 6 | AICTE / NACC / NTF / ICC documents **exist**. | Shown as an affiliations and accreditations block. The official site only carries bare labels; the college holds the documents, so the labels are presented as real affiliations with a contact route to request them. |
| 7 | **A counselling form is implemented** in the contact section. | Supersedes the earlier "zero forms" rule. The form is a static, front-end-only enquiry that opens a pre-filled WhatsApp message to +91 93937 5755 — **no data is transmitted, stored or sent to a server**. The test asserting `form` count 0 is updated to assert the form is labelled, accessible and WhatsApp-routing. |

### 2.1 Still-open discrepancy, handled without guessing


## 3. Constraints carried over from earlier work

- No enquiry that posts anywhere. Contact = phone, WhatsApp, email, directions, and the new WhatsApp-routing counselling form.
- No public staff access: the homepage must not contain `a[href*="faculty"]` or `a[href*="admin"]`. Never link the official "Faculty Portal" or "Competetion Register Portal".
- Visible image captions stay hidden (earlier user request). Alt text must be accurate.
- Figures (42 LPA, 8 LPA, 100%, placement totals) carry light attribution. Hospitality and business pages publish different totals — both are shown, never merged.
- Everything must be **SSR-safe**: no `window`/`document` during render (`src/entry-server.tsx`, `scripts/prerender-public.mjs`).
- Uncommitted work in the tree must not be reverted. Do not commit unless asked.
- The shell reports **exit code 2 on success** and prints `/bin/sh: Cannot set tty process group`. Read output, ignore the code.
- The `grep` tool skips git-ignored paths; `references/official-crawl.local/` is ignored. Use terminal `grep` there.
- `sh` history expansion breaks `!foo` inside `node -e "…"`. Use single-quoted heredocs / `--input-type=module`.
- Network is reachable directly (no proxy needed) for `static.wixstatic.com` and the official site.
- Node's `fetch` ignores the proxy; use `curl` for downloads.

## 4. Media contract

`scripts/official-media.manifest.json` already exists (60 `images`, 27 `galleries`) and is the input to step (c). Output: `src/public/officialMedia.generated.json`, consumed by `officialSite.ts` via the `Pic`/`MediaKey` types in `officialTypes.ts`.

Paths follow the contract already documented in `officialTypes.ts`:

```
/images/official/<key>-480.webp
/images/official/<key>-960.webp
/images/official/<key>-1600.webp     (only where the manifest sets "xl": true)
/images/official/<key>-480.png       (where the manifest sets "alpha": true)
```


## 5. Homepage architecture — 23 sections

A sticky in-page section navigation is rendered **outside** `.sk-home > section`, so `.sk-home > section` is exactly 23.

| # | Section | Content | Key official pages |
| --- | --- | --- | --- |
| 1 | Hero | Official headline, 25 years of legacy, leaders in international placements, "Admissions Open 2026" badge, "Hotel Management \| BBA \| MEC \| CEC", Apply Now (WhatsApp), Call Us. No video. | `home` |
| 2 | Recruiter logos + stats | "Students Achieving High-Paying Career Opportunities" and 42 LPA / 8 LPA / 100% | `home` |
| 3 | Four schools | Real photos for Hotel Management, Business Management, Junior College, Publishing House | `home` |
| 4 | About | "The Pride of Vijayawada" (3 paras) and "Where Knowledge Meets Innovation" (2 paras) | `home`, `about-us` |
| 5 | Founder's message | K. Durga Prasad, "Knowledge Beyond Boundaries", portrait | `about-us` |
| 6 | Vision & Mission | Vision, two mission statements, 25-year legacy line | `about-us`, `vision-mision` |
| 7 | Leadership | Director, Principal, Admin Manager (the three crops) | `about-us` |
| 8 | Achievements | 07 / 25+ / 75+, hospitality 15,000+ / 6,000+ **vs** business 12,000+ / 4,000+, Govt. of AP + The Times Group | `hotel-management-…`, `bba-college-…` |
| 9 | Programme catalogue | Tabs: Hotel Management (6), Business (2), Junior College (MEC/CEC) + PGDHM. Each with duration, affiliation, stage timeline, eligibility, career pathway, extras. | all programme pages |
| 10 | Team voices | 8 portraits with "Why Westin" quotes | `hotel-management-…`, `bba-college-…`, `westin-junior-college` |
| 11 | Faculty excellence | "Experienced Professors & Industry Experts" (4) + "Personalized Learning Approach" (4) | `faculty-excellence` |
| 12 | Campus & facilities | 4 BBA facilities + campus culture + hostel | `bba-college-…` |
| 13 | Student life & clubs | 6 clubs, 6 junior student-life items, clubs gallery | `student-life`, `westin-junior-college` |
| 14 | Internships & corporate training | Corporate Partnerships paragraph + 4 internship items + 4 training items | `internship`, `corporate-training` |
| 15 | Placement news | The Hindu story: 103 students, 6 hotels, 90% of 2018–2021, K.B. Chandrasekhar, first under Krishna University at 100% | `news-and-more` |
| 16 | Success stories | 2 quiz prizes, student awards, Team Westin and BBA galleries | `success-stories`, `latest-news-…`, `blank-1-2-2-2` |
| 17 | Alumni stories | 3 named alumni + alumni gallery | `post__alumni-success-stories`, `alumni` |

## 6. Data module — `src/public/officialSite.ts`

Implements every interface already declared in `src/public/officialTypes.ts` (`Pic`, `Person`, `Stat`, `Titled`, `ProgrammeStage`, `EligibilityGroup`, `Programme`, `ProgrammeGroup`, `FaqGroup`, `Album`, `OfficialDoc`, `HeroSlide`, `CoverageExclusion`). Official wording is used as-is; **only** these typos are corrected: `Internatioal`, `Bakeray`, `nest-gen`, `Competetion`, `NACC`, `Bengalore`.

BHM duration is 3 years per decision 3.

## 7. Coverage verification

`scripts/verify-official-coverage.mjs`:

1. For each of the 94 crawled slugs, read `references/official-crawl.local/json/<slug>.json`.
2. Take headings, paragraphs and list items from `sections.main`; drop nav, footer, duplicates, Wix template filler and form labels.
3. Normalise and fuzzy-match each block against the prerendered `dist/index.html` (≥ 0.8 token overlap). `--all` widens the search to the whole `dist/`.
4. Write `references/official-coverage-report.md`: per-page coverage %, missing items, and an explicit exclusion list with reasons.

Known gap to close **without re-crawling**: `post__hotel-management-colleges-in-andhra-pradesh` extracted 0 items. Re-run `extract.mjs` against the already-saved local `html/` file.

## 8. Tests to update deliberately

- `tests/homepage.spec.ts:15` and `tests/published.spec.ts:44` — `.sk-home > section` count **12 → 23**.
- `tests/homepage.spec.ts:46` — `.sk-program-mobile article` count 3 (re-pointed to the new catalogue).
- Programme-explorer tab/keyboard test and the company-marquee test (2 `.sk-company-track`).
- `form` count 0 → replaced with counselling-form assertions (labelled inputs, WhatsApp routing, no network submit).
- Preserve: no `a[href*="faculty"]` / `a[href*="admin"]` on Home; axe WCAG 2.1 AA clean; no external fonts or push SDK.

## 9. Build and verification

```
npm run build          # tsc, vite build, SSR build, prerender
npm run lint           # oxlint
npm test               # Playwright + axe
npm run ssr:smoke
npm run verify:public-build
```

Plus full-page screenshots at **1440 / 768 / 390px** and a Home bundle-size check.

| 18 | Events & albums | 18 event galleries + 3 album covers, linking to event detail pages | `event`, `events__*`, `gallery` |
| 19 | Publishing House | Vision, mission, 6 why-choose, 7 categories, Student Author Program (3 + 6 + 6 + 5), store items, 10 documents, contact | `blank-1-2-1-1-…` |
| 20 | Journal | 31 posts with date, read time, excerpt, image; category filters; link to `/blog/<slug>` | `blog`, `post__*` |
| 21 | FAQs | BHM 7, BBA 6, Junior 7, Publishing 6 — tabs + accordions | `hotel-management-…`, `bba-college-…`, `westin-junior-college`, `blank-1-2-1-1-…` |
| 22 | Admissions 2026 | Course highlights, 5 BBA reasons, campus tours & counselling, Psychometric Test link | `admission-page`, `blank-1-2-2-1-1-1-1-1` |
| 23 | Contact | Phones, email, address, WhatsApp, directions, 6 worldwide offices, affiliations, **counselling form** | `contact`, footer |

### 4.1 Leadership banner crop geometry (measured, not guessed)

`people/leadership-banner` = `e4b079_6fcf61f41f19433d9afb044638d050c8~mv2.jpeg`, 1600×839. Orange-ring blob detection found **exactly three** circles, diameter **288**, top edge **y = 327**, centres x = 262 / 795 / 1331.

| manifest `crop` | extract `left, top` | size | person |
| --- | --- | --- | --- |
| `circle-1` | 118, 327 | 288×288 | Mr. Durga Prasad K — Director |
| `circle-2` | 651, 327 | 288×288 | Mr. Chandra Shekar P — Principal |
| `circle-3` | 1187, 327 | 288×288 | Mrs. Sailaja K — Admin Manager |

Detected blob heights differ (236 / 254 / 221) because each subject occludes part of the orange fill. Using the fixed 288 diameter anchored at the shared top edge keeps all three circles identically framed. Mrs. Sailaja K has no other photograph, so this crop is the only source for her portrait.

DHM Phase 2 is titled "Next 3 Months" while its body text says four months (`text/dhm-1-year-course.md:16`). We publish the official heading and show a short inline note flagging the difference rather than silently picking one.
