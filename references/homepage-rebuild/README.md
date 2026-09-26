# Westin Skybook — implemented homepage references

Created 25 September 2026. The original [approved hero reference](../westin-skybook-hero.png)
is preserved unchanged. This folder contains production artwork masters and
screenshots of the actual local `Student_portal` implementation—not just mockups.

## Review the page

- [Desktop hero / first viewport](hero-desktop.png)
- [Mobile hero / first viewport](hero-mobile.png)
- [Tablet first viewport](hero-tablet.png)
- [Complete desktop homepage](homepage-desktop.png)
- [Complete mobile homepage](homepage-mobile.png)
- [Complete tablet homepage](homepage-tablet.png)
- [Measured verification and limitations](verification.md)

Screenshots use Chromium at 1440, 390 and 1024px respectively, reduced motion,
and the default fixture-preview mode. Below-fold media is loaded before capture.
To refresh them, run `npm run capture:skybook` in `Student_portal` with its
production preview already running at port 4173.
The original concept has been interpreted as real HTML/CSS with separate responsive
art direction, rather than embedding the original screenshot as a page.

## Asset provenance

All nine PNG masters below were generated using the built-in image-generation
workflow. The two hero variants use the original approved reference for art
direction; the seven editorial scenes were generated from text. Exact prompts
and reference usage are preserved in [prompts.md](prompts.md).

| Master | Dimensions | Use |
| --- | --- | --- |
| [skybook-desktop.png](skybook-desktop.png) | 1448 × 1086 | Open book, imagined campus, blue path, two photo windows, adult student guide |
| [skybook-mobile.png](skybook-mobile.png) | 1448 × 1086 | Separately composed, simpler mobile book/campus/guide scene |
| [business.png](business.png) | 1536 × 1024 | Business presentation |
| [hospitality.png](hospitality.png) | 1536 × 1024 | Hospitality table-service practice |
| [foundation.png](foundation.png) | 1536 × 1024 | Collaborative foundation studies |
| [campus.png](campus.png) | 1536 × 1024 | Social life in an imagined courtyard |
| [mentoring.png](mentoring.png) | 1536 × 1024 | Career conversation |
| [collaboration.png](collaboration.png) | 1536 × 1024 | Student project work |
| [publications.png](publications.png) | 1536 × 1024 | Unbranded editorial still life, not an actual college publication |

People, facilities and architecture are illustrative, not documentary Westin
imagery or claims about available facilities. Visible captions and alt text state
this on the homepage. No fabricated quotes, identities, placement figures,
employer logos, admissions dates or magazine editions are supplied. Generated
hands, sleeves, straps, feet, faces and perspective were visually inspected.
College approval of campaign copy and actual content remains required for launch.

The official logo is reused from `Student_portal/src/assets/images/westin-logo.avif`.
Inter and Bricolage Grotesque are copied from the existing local preview assets;
their license notices are retained in `Student_portal/public/fonts/`. Neither
the concept's generated wordmark nor any stock-reference watermark is used.

## Served derivatives

The app serves WebP from `Student_portal/public/images/skybook/`, not these PNGs.
Regenerate using `npm run assets:skybook` inside `Student_portal`. The named-master
allowlist prevents screenshot files from being mistaken for production artwork.

- Desktop hero: 960 / 1440 / 1920px, approximately 125 / 235 / 315 KiB.
- Mobile hero: 480 / 720 / 960px, approximately 29 / 60 / 100 KiB.
- Editorial scenes: 480 / 720 / 960 / 1440px, approximately 16–156 KiB.
- Sharp WebP quality 82, effort 6. The optional 1920px desktop derivative upscales
  the supplied master for high-density displays; it does not add source detail.
- Only the matching hero is preloaded/prioritized, only on direct `/` visits.
  All below-fold photos reserve layout space and use native lazy loading.

Both hero-delivery budgets are met: mobile under 300 KiB and desktop under 500 KiB.
See [application README](../../Student_portal/README.md) and [remaining plan](../../plan.md).
