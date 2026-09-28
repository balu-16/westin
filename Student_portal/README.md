# Westin College Vijayawada website and student portal

React 19, Vite and Tailwind v4 power the public college website and protected student portal. The public site combines the illustrated Westin Skybook design with paraphrased, source-linked information from the [current Vijayawada site](https://www.westincollegevijayawada.com/) and [legacy Vijayawada site](https://www.westincolleges.com/vij/). The [content inventory](../references/westin-official-site-inventory.md) records the migration and source context.

## Local development and checks

```bash
npm install
npm run dev             # http://localhost:5173; /api proxies to localhost:4000
npm run build           # prelaunch: prerendered public pages, noindex, empty sitemap
npm run verify:public-build
npm run build:official  # canonical Westin origin, public indexing and sitemap
PUBLIC_EXPECT_RELEASE=official npm run verify:public-build
npm run ssr:smoke
npm test                # Playwright responsive, navigation and axe checks
npm run lint
```

Run commands from `Student_portal`. The default build is **prelaunch** and disallows crawling. `build:official` prepares an indexable artifact for `https://www.westincollegevijayawada.com`; it does not deploy or change DNS. `VITE_PUBLIC_SITE_ORIGIN` can set a different HTTPS canonical origin for an authorized official build. Private routes and `/search` stay unindexed. All locally migrated public routes are prerendered with route-specific title, description and canonical metadata; Vercel serves their static files before the `app-shell` rewrite.

### Published CMS content

Evergreen college information is bundled locally and works with no API. `VITE_PUBLIC_CONTENT_MODE=api` also fetches published content from the existing public API at runtime. Matching CMS records supplement or update sourced items without duplicate cards.

For an official build that includes **published CMS detail pages in the prerendered sitemap and local search index**, set `PUBLIC_CMS_BUILD_URL` to the public API origin before running `npm run build:official`. The prebuild script fetches `/api/public/site`, validates public entry types and slugs, and generates `src/public/cms-snapshot.json`. A requested snapshot fetch failure stops the build. With the variable unset, the snapshot is empty. The snapshot is public data embedded in the client bundle; never put private content in that endpoint. Rebuild after publication to update the index.

The existing `{ settings, entries }` API contract is unchanged. Published media URLs and text are validated by the public view model. The contact flow uses phone, email, WhatsApp and directions; it does not submit an enquiry form.

### Media and content

The Home hero and inner-page motifs are illustrated. Two supporting photos and event-gallery images come from Westin’s current site, with descriptive alt text and no visible image captions. The company strips use marks shown on Westin’s pages where available and text otherwise. Their label is deliberately neutral: appearance in Westin material does not identify an individual recruitment offer or package. The 42 LPA, 8 LPA and 100% figures retain the homepage as their source and state that no reporting period is supplied. Older placement totals and Hyderabad results are separately attributed.

`src/public/content.ts` contains sourced college, course and legacy records. `src/public/officialArchive.ts` contains dated, paraphrased blog and event detail pages. `src/public/OfficialHighlights.tsx` contains the company directory and contextual placement history. `src/public/PublicLayout.tsx` handles route metadata, navigation, motion and footer. `scripts/prerender-public.mjs` generates the public HTML, sitemap and robots files.

## Later domain handoff

Keep the current live domain and DNS unchanged until Westin approves the official build and a deployment is ready. At cutover, configure the canonical domain on the host, verify TLS and direct loads of the prerendered routes, then add explicit permanent redirects from each replaced legacy URL to its local destination. Retain source PDFs at their publication URLs. Check Search Console ownership, submit the new sitemap, and verify that login and private pages remain noindex. The `vercel.json` fallback serves private and unknown client routes from the unindexed app shell.

## Student portal

The public homepage stays available to signed-in students. `/login` leads to the protected dashboard, timetable, attendance, materials, events and settings. Unauthenticated users are redirected to login. The student features use `../westin-api` and retain their existing authentication and push behavior.

| Demo identifier | Email | Password |
| --- | --- | --- |
| `STU-2025-001` | `balarakesh.g@university.edu` | `Password@123` |

`src/lib/api.ts` handles Bearer access tokens and refresh rotation. `src/contexts/AuthContext.tsx` handles login and logout. The OneSignal SDK is loaded only on private portal routes. Nothing in this update deploys the site or changes the backend schema.
