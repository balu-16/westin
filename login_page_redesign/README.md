# Westin — isolated login redesign

A standalone React/TypeScript/Vite preview of the **Bright & Youthful** direction. It does not import, modify, or connect to either production portal or the API.

## Run

Use Node 22.12+ (verified locally with Node 24).

```bash
cd login_page_redesign
npm ci
npm run dev
```

Open **http://127.0.0.1:5175/**. For the production bundle, run `npm run build` and `npm run preview` (port 4175).

## What is included

- Original SVG schoolboy with a closed blue uniform shirt, overlapping sleeve cuffs, connected backpack straps, planted shoes and a rope attached to the hands/card.
- Detailed original architectural line drawing with clock tower, arched windows, columns, entrance steps and textured trees. No yellow circle behind the boy.
- A 1.8-second pulling introduction, once per tab session. Focus, pointer interaction, Tab, Escape, or **Skip animation** settles it immediately.
- Responsive side-by-side desktop composition and stacked mobile composition; the form stays real HTML, not a scaled screenshot.
- Student password demo, faculty/admin six-digit OTP demos, validation, loading, error and success states.
- OTP paste/autofill, arrow-key navigation, retry, resend cooldown and focus restoration.
- Accepted faculty/admin demo codes now play a compact row → orbit → green-check confirmation, adapted from `otp animation/` to the light login card. Wrong codes do not trigger it; system/manual reduced motion skips the 2.4-second transition. Role changes cancel pending animation, and the card keeps its height through success.
- System reduced-motion support and a manual preview toggle.
- Local fonts, the existing Westin logo, keyboard focus indicators, a persistent skip-link target and accessible field errors.
- Collapsible **Preview controls** for role, form state, responsive/mobile width, reduced motion and replay.

Use only synthetic credentials: any demo ID and password for the student view; any demo ID followed by **123456** for faculty/admin. No email is sent. No authentication, token handling, database writes, credential logging or credential persistence is implemented. Only an animation-seen boolean is stored in `sessionStorage`. The college website links are external links, not a new homepage implementation.

The role switcher is an isolated design-review tool. It must **not** be placed on the future public college website.

## Verification

```bash
npm run build
npm test
```

The test configuration uses `/usr/bin/google-chrome` when available. Otherwise install Playwright Chromium with `npx playwright install chromium`, or supply `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` for a browser installed elsewhere.

24 tests passed in local headless Chromium:

- Student and staff interactions, validation, password reveal, OTP paste/retry/resend and pending-work cancellation.
- OTP confirmation at 320px, invalid-code suppression, system/manual reduced motion and cancellation when switching roles.
- Keyboard skip/focus behavior, natural animation completion, session-only introduction, replay and reduced motion.
- Layout and rope attachment at 320, 360, 390, 560, 768, 901, 1024, 1440 and 1920 CSS pixels, including separation between illustration and copy in stacked layouts.
- Axe WCAG A/AA checks on desktop/mobile student form states and the faculty OTP view, including open preview controls.

Automated accessibility checks are not a complete accessibility certification. Real-device Safari/Firefox, screen-reader and production-auth regression checks remain part of future integration.

## Structure

| File | Responsibility |
| --- | --- |
| `src/App.tsx` | Preview shell and review controls |
| `src/components/LoginPullScene.tsx` | Short introduction, session flag, rope measurements and interruption handling |
| `src/components/StudentMascot.tsx` | Original vector illustration and hand anchor |
| `src/components/LoginCard.tsx` | Local-only form demonstrations |
| `src/components/OtpConfirmation.tsx`, `otp-confirmation.css` | Accepted-code orbit/check transition; no real verification |
| `src/components/CampusSketch.tsx` | Decorative, illustrative campus line drawing |
| `src/styles.css` | Typography, layout, colors and responsive container queries |
| `tests/login.spec.ts` | Browser and automated accessibility coverage |
| `public/fonts/` | Self-hosted Inter/Bricolage fonts and their license notices |

The artwork is a code-native interpretation of the chosen concept, not a claim that the illustration depicts a real Westin student or building. Both original generated concept boards are preserved in [references](../references/README.md).

## Integration is intentionally deferred

After design approval, the scene can wrap each portal's existing authentication form through its `children` prop. Keep production auth/OTP contracts, callbacks, redirects and permission checks intact. Do not copy the demo success logic or its synthetic OTP into production. Remove preview controls/disclosures at integration time, retain font licenses, and make browser-only initialization safe if rendering the scene on the server.

The remaining implementation roadmap is in [plan.md](../plan.md). No homepage, CMS, enquiry inbox or live-login integration is included in this build.
