# Skybook homepage — verification record

## 26 September 2026 sourced-content refresh

The Home page now introduces Westin’s history, study directions and practical learning with an added overview chapter. The career section displays the placement figures published on the newer Westin site with a note that its reporting period is unstated. The saved desktop, tablet and mobile screenshots were refreshed after these changes. Illustrative image captions remain hidden.

Public course pages now cover the full official catalog; About, campus, career, partners, admissions and contact pages carry distinct Westin information. News, events, magazines and stories link to official records, and API-published entries supplement them. Placement figures from the legacy Hyderabad page are labeled with its 2017–18 year and campus. The source mapping and conflict notes are in [public-content-inventory.csv](../public-content-inventory.csv).

The TypeScript/Vite build, SSR smoke and lint ran successfully. All 48 browser tests passed, including narrow course headings, empty and failed API content, published-program updates, and WCAG scans of expanded course and editorial pages at 390 and 1440px. After adding more management and alumni records, the build and two focused content tests passed again. Lint reports the same ten existing warnings and no errors. Lighthouse was not rerun; its figures below remain the earlier baseline.

## 26 September 2026 design refresh

The refreshed [desktop, tablet and mobile screenshots](README.md#review-the-page) show the handwritten hero notes, the login-style college sketch and WESTIN footer wordmark. About, Programs, Campus life, Placements, Contact and the remaining public routes now use coordinated illustrated heroes. Local public navigation has short exit/entrance motion, smooth same-page anchors and a reduced-motion fallback. Image captions are hidden; descriptive alt text and the footer disclosure still identify illustrative artwork.

The production build and SSR smoke pass. The 39-test Playwright suite passed for this refresh, including six viewport widths, public hero reflow, route motion, hash links and the existing WCAG scans. After the later caption removal, the build, lint and eight affected responsive/published-content tests passed again. Lint has no errors and the same ten pre-existing warnings. The Lighthouse figures below belong to the 25 September baseline; this refresh has not been remeasured with Lighthouse.

## 25 September 2026 baseline

25 September 2026. Local implementation only; nothing deployed.

## Scope checked

Complete public homepage and shared public navbar/footer in `Student_portal`, plus
minimal `/contact` and `/admissions#visit` handoffs. Login/dashboard presentation,
other public page bodies, backend/CMS and HTTP contracts were preserved.

The initial-load fixes eagerly render the homepage instead of a short Suspense
placeholder, self-host the existing Inter body font, and preload only the actual
responsive hero and heading font on `/`. The existing push SDK now starts through
the private notification facade, not the global HTML. Its configuration, identity
order, no-auto-prompt policy and subscription/logout behavior are retained.

## Automated results

| Check | Result |
| --- | --- |
| `npm run build` | Pass: TypeScript and Vite production build |
| `npm run ssr:smoke` | Pass: `/` and `/about` render public HTML through the existing SSR entry |
| `npm test` | 31 Chromium tests pass across fixture and API projects |
| `npm run lint` | No errors or new warnings; ten pre-existing warnings remain |
| axe WCAG 2 A/AA + 2.1 AA scans | No violations in tested desktop/mobile homepage, open menu, contact and populated API layouts |
| Public-page runtime/asset checks | No unexpected page exceptions, console errors or failed local assets in normal successful runs |

Coverage includes:

- 320, 390, 768, 1024, 1440 and 1920px full-page reflow; no horizontal page overflow,
  clipped essential links or incomplete visible image loads. Tablet/desktop hero
  artwork bounds are checked explicitly.
- Landscape and 200%-equivalent viewport reflow. This is a layout-equivalent
  automated check, not a claim of real-device browser-zoom certification.
- Program tab pointer/keyboard operation, arrows/Home/End and image/content changes.
- Mobile dialog focus containment, Escape, restoration, navigation and scroll cleanup.
- Reduced motion, once-per-tab entrance, storage failure and usable static content.
- Homepage/navbar/footer internal destinations, contact/visit links, back-to-top
  and metadata. Tests inspect external contact destinations without placing calls
  or sending messages.
- Signed-in public access with Dashboard, anonymous protected-route redirects,
  and no private data calls while browsing the homepage.
- Published populated, empty, slow, failed, malformed and partially missing content;
  published quote/PDF mapping, long copy, hostile URLs and broken media fallback.
- Public/login routes make no push-SDK or external-font requests. A stub confirms
  private SDK initialization happens once before identification and never requests
  permission automatically; blocked SDK loading settles safely. No real pushes sent.

The earlier failing focus-wrap and small-text contrast checks were fixed. Existing
lint warnings are in `OneSignalSDKWorker`, `ErrorBoundary`, `AuthContext`, `Sidebar`,
`entry-server`, `OtpAnimation` and `Events`; none were suppressed to pass this work.

## Visual review

Compared the implemented desktop hero with the [approved reference](../westin-skybook-hero.png):
integrated sky canvas, approximately 43/57 copy/art balance, dimensional open book,
detailed imagined campus, two learning-photo windows, adult student guide, large
HTML headline and overlapping pathway strip. The mobile hero is independently
composed; it is not a squeezed desktop screenshot. Mobile actions stack.

Full-page screenshot review covers editorial variation through the program
explorer, practical-learning collage, asymmetric campus story, career timeline,
belonging, journal, publication still life, folded invitation and the original skyline footer.
See [saved screenshots](README.md#review-the-page). Generated-image labels remain
visible, and no made-up news dates, testimonials or publication issues are shown.

## Measured Lighthouse results

Lighthouse 13.5.0 against the local **production build** at `http://127.0.0.1:4173/`,
fresh Chromium profile, default simulated mobile throttling and desktop preset.
Normal motion enabled; no SDK/font request mocks and no reduced-motion override.
Fixture preview mode intentionally remains non-indexable.

| Metric | Mobile | Desktop | Target |
| --- | --- | --- | --- |
| Performance | 91 | 100 | ≥90 |
| Accessibility | 100 | 100 | ≥90 |
| Best practices | 100 | 100 | — |
| First contentful paint | 1.8s | 0.4s | — |
| Largest contentful paint | **3.3s** | 0.8s | ≤2.5s |
| Cumulative layout shift | 0 | 0 | ≤0.1 |
| Total blocking time | 20ms | 0ms | — |
| Speed index | 1.8s | 0.4s | — |
| SEO | 69 | 69 | Preview intentionally blocked from indexing |

Raw reports: [mobile JSON](lighthouse-mobile.json), [desktop JSON](lighthouse-desktop.json).
The initial measured mobile run was 60 performance / 0.543 CLS; the final
initial-render/resource-discovery changes removed that layout jump.

**The mobile LCP target is not yet met.** The simulated cold-load result is 3.3s,
despite responsive hero delivery under 100 KiB. Remaining initial SPA script/font
work and production delivery need a separately measured optimization pass; no SSR
deployment migration was attempted. Scores are lab measurements, not field guarantees.
The fixture `noindex` and existing disallowing `robots.txt` were not weakened to
artificially increase SEO scores; production indexing is a separate launch decision.

Hero delivery is 29–100 KiB mobile / 125–315 KiB desktop, meeting the 300/500 KiB
budgets. Assets reserve dimensions. Only the actual matching hero is high priority;
editorial photos are lazy-loaded.

## Sources and remaining limitations

- Contact handoffs use the [official college contact page](https://www.westincolleges.com/vij/contact.html):
  telephone `+91 93937 55755` and WhatsApp `919393755755`. Neither action sends
  anything automatically or promises that a visit is booked.
- SDK initialization retains the existing options and deferred-ready pattern
  documented in the [OneSignal Web SDK reference](https://documentation.onesignal.com/docs/en/web-sdk-reference).
  Actual push delivery must still be checked on the configured origin with an
  authenticated, permission-controlled test device; local stub tests cannot prove it.
- API modes were tested with controlled HTTP responses matching the existing
  contract, not a production CMS integration. Published content/media approvals,
  real publication PDFs and real testimonials remain the college's responsibility.
- Native screen-reader review, real Safari/Firefox/Android devices, field INP,
  production CDN/cache behavior and field Core Web Vitals were not measured.
- The existing SSR entry passes its smoke check; SSR deployment, canonical origin,
  crawler-visible routing/status codes, sitemap/robots policy and full legacy-site
  migration remain separate work. Other public route bodies were not redesigned.
- Backend/CMS authorization, live auth workflows and enquiry privacy/retention were
  not re-audited in this homepage scope. No forms collect visitor data here.

## Reproduce

Inside `Student_portal`:

```sh
npm install
npx playwright install chromium
npm run build
npm test
npm run ssr:smoke
npm run lint
npm run preview -- --host 127.0.0.1 --port 4173
```

In another terminal, using an installed Chromium binary through `CHROME_PATH`:

```sh
npx lighthouse@13.5.0 http://127.0.0.1:4173/ --output=json --output-path=../references/homepage-rebuild/lighthouse-mobile.json --only-categories=performance,accessibility,best-practices,seo --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage'
```

Add `--preset=desktop` and change the output filename for the desktop report.
Measurements vary with environment; retain the raw report alongside any new result.
