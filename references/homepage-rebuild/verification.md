# Skybook homepage — verification record

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
belonging, journal, publication still life, folded invitation and skyline footer.
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
