# Westin Skybook — implementation record and remaining roadmap

Updated: 25 September 2026.

## Current boundary

**The approved Skybook homepage rebuild is implemented locally inside `Student_portal`: the complete public homepage, shared navbar/footer, and essential contact/visit handoffs. Nothing has been deployed. Login and dashboard presentation, other public page bodies, backend contracts and CMS are outside this rebuild.**

This document records the completed scope and preserves the remaining site-wide roadmap. Public routes, an API client, an SSR smoke entry and CMS/backend scaffolding already existed before this rebuild; their existence is not a claim of full content migration, security review or launch readiness.

### Completed: Westin Skybook homepage rebuild

- One typed homepage presentation tree serves fixture and API modes. The hero, program explorer, practical learning, campus life, career journey, belonging, journal, publications and closing invitation have distinct editorial compositions.
- Official branding, locally hosted Bricolage Grotesque/Inter, sky-blue surfaces, paper details, accessible chapter tabs, a focus-managed mobile menu, grouped footer links and back-to-top.
- Nine generated artwork masters, exact prompts and responsive WebP derivatives. Separate desktop/mobile hero compositions preserve the approved open-book direction. Generated scenes are visibly illustrative—not photographs of documented Westin facilities or students.
- Published content is adapted without new HTTP contracts. Empty/unavailable content retains useful discovery links; testimonials, news dates and publication downloads are never invented. Unsafe URLs and missing media are handled deliberately.
- `/` stays public for signed-in students and offers Dashboard. Protected-route behavior is preserved. Public styles are scoped; the existing Inter font is now self-hosted. Push SDK startup moves from the global HTML to the existing private notification facade, with its identity and permission settings preserved.
- `/contact` and `/admissions#visit` offer verified call/WhatsApp handoffs and the official contact-page link. No visitor data collection, automatic messages or promised bookings.
- Responsive motion is once per tab session, non-blocking and reduced-motion aware. All copy and controls remain HTML, not embedded in artwork.
- See [verification and measured results](references/homepage-rebuild/verification.md), [asset provenance](references/homepage-rebuild/README.md) and [application run instructions](Student_portal/README.md).

This supersedes the earlier planning-only homepage boundary. The isolated login/loader results below are historical; they were not rebuilt or retested as part of this homepage change.

### Completed: isolated login preview

- Standalone `login_page_redesign/` with its own package manifest, lockfile, build and tests.
- Bright & Youthful composition; original SVG schoolboy pulls the login box with a connected rope.
- Responsive student/password and faculty/admin OTP **demo** states, accessible validation, replay, interruption handling and reduced motion.
- Locally served fonts and the existing Westin logo. No live API integration or credentials persisted.
- Accepted faculty/admin demo OTP now transitions from six code tiles into an orbit and a green confirmation check, adapted from `otp animation/`. Wrong codes never play success; system/manual reduced motion skips the transition.
- Production build and 24 Chromium tests pass, including automated accessibility checks, OTP transition/cancellation and 320–1920px layouts.
- Both original concept boards are preserved in `references/`.
- Existing `Student_portal/`, `faculty_admin_portal/`, `westin-api/`, `login_page_animation/` and the source `otp animation/` remain unchanged by this isolated work.

Run instructions: [login preview README](login_page_redesign/README.md).

### Completed: isolated walking-loader refinement

- `loading_state/` now has one shared React/SVG character, shaped anatomy, a fitted uniform/backpack and a foot-led walking cycle.
- A straighter supporting leg, larger opposite arm swings, slight forward lean and gentle head/backpack follow-through reduce stiffness. OS reduced motion, pause/speed controls, offscreen suspension and hidden-tab suspension are included.
- Production build and 14 tests pass: gait geometry over 1,000 frames, animation lifecycle, responsive layout and automated accessibility checks.
- The preview now runs through Vite at port 5177; opening its HTML directly is no longer supported. See [loading-state README](loading_state/README.md).

### New design direction: The Westin Skybook

The public site should have the same care and personality as the pulling login, with a more grown-up expression for management and hospitality students. The signature idea is an **open sketchbook becoming a campus and a path into the future**. Sky blue is the main environment, not merely a button accent.

The approved brief is now implemented in the local homepage. The original concept is preserved unchanged; production artwork is separate, text-free and responsively composed. Generated people and campus architecture remain illustrative, not evidence about the real college.

Review the [generated Skybook hero](references/westin-skybook-hero.png) and [exact generation brief](references/skybook-hero-prompt.md). The concept uses placeholder brand typography and decorative handwritten text; neither is approved production branding/copy.

## 1. Decisions to preserve

1. Evolve **Bright & Youthful** into **The Westin Skybook**: sky-blue editorial layouts, a sculptural paper-campus hero, real college storytelling and purposeful illustration. Preserve the warmth of the [selected concept](references/bright-youthful.png). Keep [Premium Campus](references/premium-campus.png) as an alternative reference, not a second theme to build now.
2. Build the public college website **inside `Student_portal`**, before login. Do not introduce a third production frontend deployment for it.
3. The public website exposes **Student Login only**. Faculty/admin access remains in the separately deployed staff application. No public role selector or staff-login links.
4. Eventually apply the approved pulling scene to all three login views, while preserving student password authentication and staff OTP authentication.
5. Retain the structured **Website CMS** and **Enquiry Inbox** roadmap. Existing scaffolding requires its own review; this homepage task does not authorize CMS changes or enquiry collection.
6. Preserve working backend behavior, role separation, private routes, attendance rules, OTP security, PWA behavior and notifications. A visual refresh is not permission to rewrite those workflows.
7. Use GPT-6 Astra for any explicitly delegated implementation work. Do not use GPT-6 Luna for this project work under the current instruction.

## 2. Codebase findings and design priorities

| Area | Current foundation | Planned upgrade |
| --- | --- | --- |
| Student application | React/Vite/TypeScript, shared UI components, public layout and authenticated dashboard shell | Skybook public layout rebuilt; further portal polish remains separate |
| Student routing | `/` is public even when signed in; explicit student routes remain protected; unknown public URLs render the existing public not-found page | Verify deployment status codes/rewrites separately; no SSR hosting migration in this rebuild |
| Student login | `Student_portal/src/pages/Login.tsx` and `contexts/AuthContext.tsx` | Replace presentation after approval; preserve real submission, errors, session handling and redirects |
| Staff login | Shared `pages/shared/LoginScreen.tsx`, role-specific login pages and separate auth contexts | Wrap existing OTP workflow in the approved scene; retain separate faculty/admin destinations |
| Portal pages | Dashboard, attendance, timetable, materials, events, reports, settings and admin management tools already exist | Improve hierarchy, consistency, mobile interactions, loading/empty/error states and accessibility incrementally |
| Student timetable | Already initializes the day using Kolkata time | Preserve that behavior; improve mobile agenda, next-class emphasis and current-period indication |
| Student attendance | Dashboard consumes live dashboard/attendance data; cards and chart have separate sources/fallbacks | Reconcile displayed values, distinguish unavailable data from real zero and make encouragement conditional on actual results |
| Shared staff sidebar | `components/Sidebar.tsx` currently finds one nested navigation group | Generalize nested-group rendering before adding Website and Enquiries alongside Notifications |
| Backend | `westin-api` has existing domain modules and public-content/admin-content/enquiry scaffolding | Retained unchanged; review authorization, publishing and enquiry lifecycle in a separately authorized phase |
| Branding and motion | Existing blue brand, logo, walking-loader and OTP prototypes | Consolidate tokens and motion language; keep expressive illustration at entry points and calmer operational screens |

Highest-impact upgrades: a clear public first impression, consistent typography/spacing, accurate useful dashboard data, comfortable mobile forms/tables, and complete interaction states. Preserve already-working behavior instead of rebuilding it merely for visual consistency.

## 3. Design system to extract after preview approval

### Visual foundation

- Keep the official existing logo; generated wordmarks in concept boards are not replacements.
- Bricolage Grotesque for expressive headings; Inter for controls, body text and data. Self-host with license notices and system fallbacks.
- Make the website feel like a bright, open sky with paper and ink layered over it. Use sky blue across the hero and selected chapter transitions, near-white reading surfaces, navy text and darker blue actions. Orange echoes the mascot's backpack/rope; mint is reserved for quiet positive states.
- Starting tokens: canvas `#F7FBFF`, pale sky `#EAF6FF`, sky `#A9DDFA`, accent sky `#3BA7F2`, ink `#142D46`, action `#1468AA`, warm detail `#F2A159`. Sky/orange are not small-text colors; verify all semantic combinations before approving tokens.
- A consistent spacing scale, 48–52px primary controls, 16px form input text, restrained shadows and a 1360px maximum public content area. Homepage spacing is approximately 108px desktop and 64px mobile.
- Do not apply oversized marketing headings or decorative backgrounds to dense attendance/administration screens.

### Creative rules — a recognizable college, not a template

- **One story across entry points:** the homepage opens a chapter, the login character pulls it closer, the loader carries the journey forward, and OTP brings separate pieces together. These are related visual ideas, not four competing animation styles.
- **College-age, not primary-school:** retain the login's friendly character language, but use adult proportions, confident posture and management/hospitality context on the public site. Check hands, sleeves, straps, perspective and grounded feet at full size before accepting any illustration.
- **Editorial variety:** alternate open type-led sections, photo essays, a program explorer, a career timeline and a publication shelf. Do not turn every section into the same three rounded cards.
- **Credibility beside imagination:** the approved rebuild uses coordinated generated editorial photography with visible illustrative captions. Replace selected scenes with permission-cleared college photos when supplied. An imagined building must not be presented as Westin's actual campus.
- **A small set of recurring details:** paper folds, a fine blue journey line, a restrained orange underline and chapter labels. No arbitrary floating badges, yellow character halos, glassmorphism everywhere, neon gradients or decorative achievement counters.
- **Warm but useful copy:** concise headings that sound like a welcoming college; body copy answers practical questions. No guaranteed placement claims or invented rankings. Proposed campaign copy requires college approval.

### Component foundation

Create shared tokens and a small local UI package only when integration starts. Both existing frontend applications must retain independent builds; React stays a peer dependency. Verify Tailwind source scanning where shared components use utilities.

Prioritize Button, FormField, Input, OTP input, Alert, EmptyState, Skeleton, Dialog, Drawer, Tabs, Badge, Table/CardList, Pagination and media primitives. Provide documented focus, disabled, loading, error, empty and success states.

### Motion rules

- Keep the short schoolboy introduction once per session; never block typing or retries.
- Motion follows real geometry; the rope remains connected across responsive changes.
- Settle immediately on input intent; honor reduced motion with a static composition.
- Use small opacity/transform transitions for public sections and cards. No scroll hijacking, endless parallax, autoplay hero video or decorative animation competing with forms.
- Move heavy/optional media and animation work out of the initial rendering path.
- The public hero has one optional 900–1200ms page-turn/path reveal, once per tab session. Headline, navigation and CTAs are readable and usable from the first frame. A static version is the default if animation cannot run.
- Limit other reveals to 250–450ms and 8–16px of movement, once on entry. Buttons use short 120–180ms feedback. Optional pointer depth stays within 4px on fine pointers and stops when the hero leaves view; omit it on touch/reduced motion.
- No continuous mascot loop on the homepage. The walking loader appears only during actual pending work; it is not a decorative wait gate. OTP confirmation must follow real server acceptance when later integrated, never stand in for verification.

## 4. Phase A — approve and integrate the login design

**Starts only after the isolated preview is approved.**

1. Review the illustration, copy, colors, card sizing and mobile composition in the standalone preview.
2. Extract the scene and tokens without pulling preview controls or demo auth into production.
3. Integrate into student `/login`; keep the real password form and existing authentication contracts.
4. Integrate into staff `/faculty/login` and `/admin/login` with their existing OTP flows. Keep paste, resend expiry, error recovery and submit prevention while requests are pending.
5. Validate return destinations as internal, role-appropriate routes; preserve existing authenticated-user redirects and protected deep links.
6. Add a student-only route back to the new public homepage when that homepage exists. Do not add public staff access.
7. Test invalid/expired OTP, wrong credentials, throttling, network failure, refresh, logout, reload and history-back behavior against real staging APIs.
8. Remove demo disclosure, role switcher, forced state controls and synthetic success handlers from production integration. Keep this standalone preview as a safe design harness.

Acceptance: users can sign in without waiting for an animation, existing auth tests pass, real credentials are never written into logs or UI storage, and each role reaches only its own destination.

## 5. Phase B — public content inventory and page architecture

Use [the current Vijayawada college website](https://www.westincolleges.com/vij/) as the content inventory, not as a layout to clone. Preserve its substantive features through clearer navigation and reusable page templates.

Rechecked on 24 September 2026: the legacy homepage still presents business/hotel-management/intermediate pathways, campus and placement content, stories, publications, contact/enquiry entry points and older admissions/events material. Treat the legacy information as an inventory to verify, not as current admissions or outcome data. [Source: official college homepage](https://www.westincolleges.com/vij/).

Some legacy content was unavailable or returned errors during review. **Full parity cannot be signed off until those pages/assets are obtained and checked.** Create a migration checklist with old URL, destination URL, content owner, asset rights, verification date and completion state.

### Proposed route map

| Existing content/visitor need | New public destination | Presentation |
| --- | --- | --- |
| College overview | `/about` | Strong introduction, history, values, approved campus imagery |
| Mission and vision | `/about/mission-vision` | Short editorial sections with clear hierarchy |
| Management | `/about/management` | Approved profiles, roles and messages |
| Program discovery | `/programs` | Compare the main study pathways |
| BBA | `/programs/bba` | Overview, eligibility, duration, curriculum, outcomes and enquiry |
| Hotel management | `/programs/hotel-management` | Same structured program template |
| Intermediate/MEC/CEC | `/programs/intermediate` | Approved streams and progression routes |
| Reasons to choose Westin | `/why-westin` | Evidence-led benefits; no invented placement statistics |
| Campus and infrastructure | `/campus`, `/campus/infrastructure` | Real photography and facility information |
| Placements and career guidance | `/placements`, `/career-planner` | Dated results, process, preparation and approved employer marks |
| Bineid partnership content | `/partners/bineid` | Verify current relationship and approved wording before publishing |
| Testimonials and success stories | `/testimonials`, `/success-stories` | Consent-backed profiles and dated, verifiable stories |
| News and blog | `/news`, `/blog`, detail routes | Searchable/paginated editorial templates |
| Public campus events | `/campus/events`, `/campus/events/:slug` | Publicly approved event stories; distinct from private `/events` |
| Photo/video gallery | `/gallery`, album routes | Responsive albums, accessible lightbox, click-to-load video |
| Magazine/publications | `/magazine` | Edition covers, dates and accessible PDF/download metadata |
| Admissions and visit requests | `/admissions#visit` | Implemented call/WhatsApp handoff; current admissions process and any future form need separate approval |
| Contact | `/contact` | Implemented verified telephone/WhatsApp and official contact-page link; no collection form |
| Public search | `/search` | Published public content only; never student/staff records |

Finalize detail slugs and legacy redirects from the content inventory. Do not publish empty routes merely to fill the menu.

### Content approval gates

- Verify official qualification names. Legacy descriptions are not sufficiently consistent to choose between BHM/B.Sc. wording without college confirmation.
- Replace stale admission-year content with approved current information; do not invent fees, eligibility, deadlines or intake dates.
- Verify contact details, leadership names, placements, recruiter marks, affiliations and partnerships with the college.
- Generated homepage scenes are explicitly approved as illustrative artwork, with visible captions and appropriate alt text. Actual college photographs must be permission-cleared before replacing them; never describe generated people as documented Westin students.
- Obtain consent for identifiable student/alumni testimonials. Mark dates and context on outcome claims.
- Assign an owner for every missing page, image, PDF and old URL before declaring the migration complete.

## 6. Phase C — the creative sky-blue public homepage

**Implemented locally.** The approved rebuild uses the narrative below, with API-backed social proof only when actually published, no autoplay testimonial carousel, and evergreen discovery links when stories/publications are absent. Other route bodies and full legacy-site parity remain separate work.

### 6.1 Hero art direction: The Westin Skybook

**First impression:** a real college with imagination, energy and a clear next step. Keep the useful information as real HTML; the hero illustration is not a flattened screenshot of the interface.

**Desktop composition:** an airy sky-blue canvas, a quiet header and an asymmetric 43/57 text/art balance. Use a content width of roughly 1280–1360px, 64–80px outer breathing space where the viewport permits, and a hero around 680–780px high including its pathway strip. Do not force a full-screen height on short laptops.

The left side carries the message. The right side is a dimensional **open sketchbook**: layered pale-blue/white paper becomes a detailed campus drawing, while a slim blue ribbon forms a path towards its entrance. Integrate two small photo windows—business learning and hospitality practice—into the paper composition. One college-age illustrated student turns the page corner, with the familiar blue uniform and orange backpack. The pose must look physically plausible. The sketch, character and photos support the headline rather than cover it.

Use original architectural linework with real detail: window mullions, columns, entrance steps, textured trees and perspective. Before launch, either base the drawing on approved campus references or make its illustrative nature unambiguous. Avoid a fabricated photorealistic campus or a generic elementary-school building.

**Proposed hero copy, subject to college approval:**

- Eyebrow: “YOUR NEXT CHAPTER STARTS HERE”.
- Headline: “Big dreams. Bright beginnings.” Navy first phrase, deeper blue second phrase, one fine orange underline.
- Supporting line: “Discover business, hospitality and a campus full of possibility.”
- Primary action: **Explore programs** → `/programs`.
- Secondary action: **Plan a campus visit** → `/admissions#visit`; a request, not a booking confirmation.
- Quiet signature: “Learn. Grow. Belong.”

At the bottom, a thin paper-like pathway strip links to business management, hotel management and intermediate study. It is a useful navigation element, not a statistics bar. Show only approved program labels; no admissions year, placement count or ranking in the hero without current evidence.

**Header:** official logo and campus label; About, Programs, Campus Life, Placements and Contact; separate Student Login and Enquire actions. At intermediate widths, collapse navigation before labels crowd. Student Login is the only public login destination. No role selector or faculty/admin entry in public navigation.

### 6.2 Homepage chapters — every section has its own purpose

| Chapter | Creative treatment | Useful content and action |
| --- | --- | --- |
| The opening page | Skybook hero; one short page-turn/path reveal | Understand the college; explore programs or request a visit |
| Find your kind of future | An editorial program explorer, like three chapter tabs with an image and a concise fact panel; no hover-only information | Compare BBA, hotel management and intermediate pathways, then open the full program page |
| Learn beyond the classroom | Spacious image-and-type spread with a fine annotated blue line linking evidence | Explain industry exposure, teaching and practical learning using verified specifics; link to Why Westin |
| A day at Westin | Asymmetric photographic story: one wide campus image, two smaller moments and short captions; mobile becomes a vertical story | Infrastructure, learning spaces, clubs and public events; link to Campus Life and Gallery |
| From campus to career | A readable preparation → experience → opportunity timeline paired with one dated alumni story | Explain support, show approved placement evidence and employer marks; link to Placements and Career Planner |
| People who make it Westin | Spacious student-life feature; one attributed quote only when published, otherwise an unquoted invitation | Explore student stories; no invented identities, outcomes or autoplay carousel |
| Happening here | Editorial noticeboard with one featured visual and a compact story list | Published news/events/blog entries; evergreen discovery links when empty, never fake dates/activity |
| The Westin shelf | Magazine-inspired composition and explicitly illustrative editorial still life | Actual published editions/PDFs when available, with useful Magazine and Gallery entry points otherwise |
| Your next page | A calm blue folded-paper closing panel, small mascot detail, clear contact choices | Admissions guidance, enquiry and visit request; contact page for verified phone/email, directions and approved WhatsApp link |
| Footer | Navy type on pale sky, useful grouped links, a subtle skyline drawing | About/management/mission, programs, partners, stories, contact and Student Login; no nonexistent legal/social links |

These chapters surface the important journeys without crowding every legacy page into the first viewport. The complete route inventory in Phase B remains required. Preserve contact/WhatsApp links only after confirming the destination; do not add unsolicited messaging or automatic third-party embeds.

### 6.3 Responsive art direction, not desktop scaled down

| Viewport | Hero and navigation | Other chapters |
| --- | --- | --- |
| 1024px and above | Side-by-side copy and Skybook; reduce illustration density before squeezing text; header can collapse if needed | Editorial grids and paired timelines/photos |
| 768–1023px | Prefer copy above a wide, shallower scene; compact header and accessible menu; both CTAs remain obvious | Selective two-column sections; no essential horizontal scrolling |
| 320–767px | Text first; roughly 40–56px heading using `clamp`; buttons stack if needed; a separately cropped 240–320px-tall illustration below; decorative photo windows can disappear | Single-column stories, stacked program summaries and a vertical career timeline |

- Reserve image/illustration dimensions. Do not let late media shift buttons or text.
- Mobile preserves the open-page/campus idea, not every desktop decoration. Never compress the whole desktop composition into a tiny picture.
- Keep inputs at least 16px, primary touch targets around 48px and text contrast readable on actual blue surfaces. Check 320px, landscape and 200% zoom without horizontal page overflow.
- The program explorer exposes all options to keyboard and touch. On narrow screens prefer three compact linked summaries over a hidden sideways carousel.
- Mobile menu supports Escape, focus restoration and scroll locking only while open. Essential content and CTAs do not depend on hover, dragging or animation.

### 6.4 Build approach and asset list

**Implemented components:** `PublicLayout`, `SkybookHero`, `ProgramExplorer`, the independently exported chapters in `HomeChapters`, `HomeMedia`, `ContactHandoff`, `home-model` and `useSkybookMotion`. `PublicHome` composes these once for both content modes.

- Structure, typography and controls are React/CSS; generated artwork-only WebP heroes provide the dimensional book/campus scene. The original mockup is not served as the UI. Small line details and the footer skyline are SVG; no WebGL dependency.
- Generated masters cover desktop/mobile heroes, business, hospitality, foundation studies, social life, mentoring, collaboration and a publication still life. All masters and exact prompts are in `references/homepage-rebuild/`; optimized derivatives are in `Student_portal/public/images/skybook/`.
- Official logo and font-license notices are preserved. Publication artwork has no fabricated readable issue names/dates, and the homepage invents no quotes or recruiter logos.
- Aim for a compressed hero-art budget of about 300KB on mobile and 500KB on desktop, measured on delivered responsive sources. Prioritize only the actual LCP asset; lazy-load below-fold images and load videos/maps only on request.
- Document CMS crop/focal-point requirements, text length guidance and empty states for every chapter. Content changes must not break carefully composed layouts.

### 6.5 Creative acceptance gate

The approved reference has been implemented and local desktop/mobile screenshots are in `references/homepage-rebuild/`. Review these and the running page before any deployment. Automated coverage includes 320/390/768/1024/1440/1920px, landscape, zoom-equivalent reflow, reduced motion and keyboard behavior. College content approval and real-device checks remain launch gates.

The finished page should still look intentionally designed with all animation disabled. Its creativity should come from composition, illustration, storytelling and real content—not from requiring visitors to watch an intro.

## 7. Public-site technical architecture

### Routing and authentication separation

- Put `PublicLayout` and public routes in `Student_portal`; `/` remains the homepage even when a student is signed in. Offer a Dashboard action to authenticated students.
- Preserve `/dashboard`, `/timetable`, `/attendance`, `/materials`, `/events` and `/settings` as protected student routes. Do not reuse `/events` for marketing content.
- Keep `/login` guest-aware and retain protected-route return behavior.
- Public requests use a separate public API client: no Authorization header, token refresh or automatic redirect to login on a public-content failure.
- Do not initialize student-only profile fetching, push permission prompts or private notification subscriptions on public routes. Load those in the authenticated application boundary.
- Preserve the installed PWA identity and portal launch destination; changing `/` to a homepage must not break existing student shortcuts or navigation after login.

### Rendering and deployment

- Keep the current React/Vite project rather than migrate the whole application to a new framework.
- Planned approach: server-render public routes using Vite's SSR build and a Vercel Node entry, while preserving the client-rendered private application. Prove one public route in preview deployment before committing the full migration.
- Add browser-safe boundaries around `window`, storage, push SDKs and private auth modules so server rendering does not import browser-only behavior.
- Supply route-specific title, description, canonical URL, Open Graph metadata, structured data where applicable, sitemap and robots rules. Draft previews and authenticated content must not be indexed.
- Return actual 404 responses for missing public documents, not a login redirect or a successful empty shell.
- Use one bounded public-content cache strategy with a target publish-to-visible delay of no more than 60 seconds. Define invalidation for edit, publish, unpublish and delete; avoid stacked caches with cumulative stale times.
- Verify host rewrites, direct URL reloads, API origins, SSR runtime limits and private-app fallback routing in staging before launch.

## 8. Phase D — Website CMS in the admin portal

**Outside this rebuild.** Existing scaffolding must be audited against this roadmap before adding or changing anything; do not recreate already-present tables, APIs or screens.

Create an admin-only Website section with structured editing, not an unrestricted HTML/page-builder system.

### Editing areas

- Homepage sections and ordering; global navigation/footer/contact settings.
- College pages and management profiles.
- Programs and their approved structured fields.
- News, blog posts, public event stories, success stories and testimonials.
- Gallery albums/media and magazine editions/PDFs.
- SEO fields, slugs, publication dates and optional feature flags.

### Editorial workflow

1. Draft and validate content.
2. Preview through authenticated admin access; never expose drafts through public APIs or share permanent unrestricted preview URLs.
3. Publish an atomic revision; public reads use only the published revision.
4. Support unpublish and restoration of an earlier revision, with who/when audit metadata.
5. Require alt text where images convey meaning; support captions, focal point/crop and media ordering.
6. Validate internal links and unique slugs, provide unsaved-change protection and clearly separate Save Draft from Publish.

Private portal events remain private. An explicit admin action may create a **draft public story** from selected safe event fields; a separate review/publish action is required. Never expose student lists, private attachment URLs or attendance details through marketing content.

### Backend/data additions

Proposed additive tables: `website_entries`, `website_revisions`, `website_media`, `website_settings`, `website_enquiries` and enquiry activity/notes. Final naming should follow the existing migration conventions.

An entry needs a type, slug, draft revision and published revision pointer. Revisions hold schema-versioned structured content, author and timestamps. Media needs ownership, MIME type, size, dimensions and approved storage paths. Avoid a single unvalidated JSON blob standing in for all validation.

Proposed API boundaries:

- `GET /api/public/site` — safe global/public homepage configuration.
- `GET /api/public/content` and detail/search endpoints — published, paginated public content only.
- `POST /api/public/enquiries` — validated, rate-limited enquiry submission.
- `/api/admin/website/*` — role-guarded editing, media, revisions and publishing.
- `/api/admin/enquiries/*` — role-guarded enquiry handling.

Use separate public response types rather than serializing admin/database records. Preserve existing auth/role guards, parameterized SQL, validation and upload rules. Define new-table grants/RLS where applicable; drafts, enquiries and private object keys must never be readable through an anonymous storage/database path.

## 9. Phase E — enquiry and campus-visit workflow

**Deferred.** Current homepage/contact/visit routes only hand visitors to official contact channels. No collection or booking workflow is enabled by this rebuild.

### Public form

- Enquiry category, name, a usable contact method, optional program, message and relevant privacy/consent acknowledgement.
- Short, accessible form with inline validation, a clear pending state, retry-safe submission handling and a stored confirmation reference.
- Distinguish enquiry from admission/application acceptance. A campus visit request is pending coordination, not a guaranteed booking.
- Apply server-side length/type validation, rate limits, honeypot/spam controls, duplicate/idempotency handling and safe logging. Decide whether a stronger anti-bot challenge is needed based on measured abuse.
- Publish an approved privacy notice and define retention/access policy before collecting real enquiries.

### Admin inbox

- New, Contacted and Closed states; filters/search; detail view; internal notes and activity history.
- Restrict access to admins. Mask sensitive information where not needed and make retention/deletion policy explicit.
- First release saves enquiries in the inbox. Do not add automatic email, WhatsApp campaigns or external CRM forwarding without a separately agreed workflow.

Acceptance: successful submission survives reload, appears once in the authorized inbox, and cannot be read by public/faculty users. Duplicate clicks, spam and network failures are handled clearly.

## 10. Phase F — refresh the authenticated applications

Work page-by-page after public/login foundations are stable. Keep the content-dense portal quieter than the marketing site.

### Student experience

- **Dashboard:** emphasize next class and useful actions; reconcile live attendance sources; replace missing-data zeroes or unconditional “Good Job!” messaging with honest states and data-driven guidance.
- **Timetable:** preserve Kolkata-day selection; improve current-day/current-period emphasis, mobile agenda and no-class states.
- **Attendance:** clear date ranges, actual counts and percentages, readable legends and accessible tabular equivalents. Never substitute a reassuring demo percentage for missing data.
- **Materials:** useful search/filter chips, clear file metadata, download/open states, readable mobile cards and meaningful empty results.
- **Events:** stronger images, dates, category hierarchy and accessible galleries without confusing private events with the public website.
- **Settings:** clear grouped fields, explicit save feedback and consistent account/support affordances.

### Faculty and admin experience

- **Attendance roster:** large hit areas, sticky context/actions, clear present/absent states, robust search and unsaved-change handling. Preserve edit windows, reporting cutoffs and server validation.
- **Directories and sections:** readable desktop tables, purposeful mobile cards, visible filters and well-labeled detail/edit forms.
- **Imports:** staged Upload → Validate → Review → Result flow; show row-level errors and avoid ambiguous partial-success messages.
- **Timetables/reports:** consistent filters, density controls where useful, accessible exports and reliable loading/empty/error states.
- **Notifications:** recipient preview/count, explicit confirmation, sending progress and delivery history, without changing delivery semantics unintentionally.
- **App shell:** consistent page headers, breadcrumbs where useful, accessible mobile drawers, focus-managed dialogs and reusable toast/alert patterns.

## 11. Quality, security and performance gates

### UI and accessibility

- Test at 360, 390, 768, 1024, 1440 and 1920px, plus 320px edge cases, landscape and 200% zoom.
- Manual keyboard navigation and screen-reader checks; visible focus, named controls, associated errors, usable dialogs/drawers/lightboxes and non-color status indicators.
- WCAG AA contrast and automated checks across loading, error, empty and success states; no claim of full conformance from automated scans alone.
- Respect OS reduced motion and ensure interactions do not depend on animation completion.
- Real-device Safari, Android Chrome and desktop Chrome/Firefox checks in addition to automated Chromium coverage.

### Functional and security regression

- Existing password/OTP/session/role/redirect tests; refresh and expired-session behavior must not interrupt anonymous browsing.
- Authorization tests for every CMS/enquiry endpoint, including object-level access and unauthenticated requests.
- Draft/published isolation, content validation/XSS protection, media MIME/size/path checks and safe URL handling.
- Test pagination, search, publishing, rollback, unpublish cache invalidation and stale-content behavior.
- Crawl every migrated URL, internal link, PDF and media asset; validate redirects and true public 404 responses.
- Test public enquiry validation, duplicate handling, rate limits, inbox permissions and privacy requirements.

### Performance targets, to measure rather than assume

- Aim for mobile Lighthouse performance/accessibility scores of 90+ on representative public pages.
- Target LCP ≤2.5s, CLS ≤0.1 and field INP ≤200ms where sufficient real-user data is available. Lab results are not field guarantees.
- Keep public bundles independent of staff/private pages and notification SDKs; code-split by route and use measured bundle budgets.
- Optimize media, reserve layout dimensions, avoid excessive backdrop blur/large repainting shadows and stop animation work after it settles.

## 12. Delivery order and approval gates

| Order | Deliverable | Gate before proceeding |
| --- | --- | --- |
| Complete | Isolated login/OTP and walking-loader previews | Review running previews; no production integration yet |
| Complete locally | Skybook homepage, public navbar/footer, contact handoffs and generated desktop/mobile artwork | Review screenshots and measured verification; no deployment authorized |
| A | Approved scene integrated with real login flows | Visual approval and authentication regression pass |
| B | Verified content inventory, route map and token/component foundation | College approves content and media; missing-page inventory resolved |
| C — remaining | Other public page bodies, verified content migration and production SSR/SEO delivery | Separate scope and approval; preserve the completed homepage |
| D | CMS, storage/revisions and admin publishing UI | Authorization, draft isolation and rollback tests pass |
| E | Enquiry form and inbox | Privacy/retention approved; validation, abuse controls and inbox access verified |
| F | Full content migration and phased portal polish | URL/content parity, real-device QA and workflow regression pass |
| Launch | Staged rollout with monitoring and rollback | Explicit launch approval, verified backups and recovery procedure |

CMS schema/API contracts should be agreed before implementing data-driven public templates; frontend fixture development can proceed against those contracts without exposing drafts or fabricating live content.

Use additive database migrations, separate preview deployments and small reviewable changes. Back up content before migration; retain the prior production deployment and published revisions for rollback. Do not replace the legacy public site until content completeness, redirects and operational sign-off are confirmed.

## 13. Next action — review the completed local homepage

1. Run `Student_portal` and review the homepage from navbar to footer against the preserved Skybook reference. Consult saved screenshots and the verification report.
2. Obtain current college copy, program-name, photography and content approvals. Illustrative scenes must retain their disclosure until replaced by approved documentary assets.
3. Scope remaining public page redesigns/content migration separately. Existing route availability does not establish legacy-site feature/content parity.
4. Review CMS/security, enquiry privacy/retention, real-device behavior and production SSR/SEO in their own phases. Backend/CMS changes, dashboard polish and deployment remain deferred.
