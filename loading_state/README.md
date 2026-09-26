# Westin Walker — isolated loading-state preview

A React-powered, code-native SVG student with a more natural walk, a fitted uniform, a detailed backpack, and shaped hands and trainers. Every example renders the same component.

This folder is a design preview only. Neither production portal nor its authentication/loading behavior is changed.

## Run

Use Node 22.12+ (verified locally with Node 24).

```bash
cd loading_state
npm ci
npm run dev
```

Open **http://127.0.0.1:5177/**. This preview now uses Vite and React: opening `index.html` through `file://` will not render it. For a production build, run `npm run build`, then `npm run preview` (port 4176).

The showcase includes a large character study, pause/resume and speed controls, three sizes, light/dark surfaces, and a mock dashboard. Fonts are served locally; it makes no external requests.

## What changed

- Shaped thighs, shins, hands, socks and trainers replace thick line-based limbs.
- Sleeves overlap the arms, while a collar, placket, buttons, pocket and restrained shading give the uniform depth.
- The backpack sits against the back with a continuous shoulder strap, buckle, stitched pocket, zipper and carry handle.
- Feet drive the leg positions through a two-bone joint calculation. The supporting foot rolls heel-to-toe without sinking through the ground; the free leg bends and clears it.
- A 1.25-second cycle, a straighter supporting leg, opposite arm swings, a slight forward lean and subtle head/backpack follow-through make the stride less stiff.
- One shared animation clock updates SVG transforms without re-rendering React every frame. Offscreen and hidden-tab instances stop.
- OS reduced motion produces a still pose and stops the loading dots. Manual pause and speed controls are available in the showcase.

## React integration — when approved

Keep these three files together:

- `StudentWalkingLoader.tsx`
- `walker-motion.ts`
- `walker.css`

Then import the component into a React/TypeScript application with CSS-import support:

```tsx
import { StudentWalkingLoader } from "./StudentWalkingLoader";

<StudentWalkingLoader
  size={160}
  label="Loading your dashboard"
  sublabel="Just a moment."
/>

// For a dark background:
<StudentWalkingLoader size={96} dark label="Fetching timetable" />

// Decorative artwork, with a loading-status name retained for assistive technology:
<StudentWalkingLoader size={56} label={null} />
```

Props:

| Prop                 | Default     | Meaning                                                          |
| -------------------- | ----------- | ---------------------------------------------------------------- |
| `size`               | `120`       | SVG width in px, clamped to 40–640; shrinks to fit its container |
| `label`              | `"Loading"` | Visible text, or `null` to hide it                               |
| `sublabel`           | —           | Optional secondary text                                          |
| `dark`               | `false`     | Text, ground and shadow palette for dark surfaces                |
| `paused`             | `false`     | Freeze the current pose; OS reduced motion takes precedence      |
| `speed`              | `1`         | Cycle-speed multiplier, clamped to 0.25–2                        |
| `className`, `style` | —           | Container customization                                          |

The illustration has a **280:360 width-to-height ratio**, taller than the old artwork. Reserve sufficient vertical space when integrating it. Component styles use the `swl-` prefix; gradients receive unique React IDs. The showcase fonts are optional for the component and are not imported by it.

The root is a polite loading status. Keep its label stable during animation and avoid multiple live announcements for the same real loading operation. Integrate this only for actual pending work; do not add artificial waiting time.

## Verification

```bash
npm run build
npm test
```

Tests cover the gait geometry over 1,000 frames, loop continuity, responsive layouts from 320–1440px, unique SVG IDs, local-only requests, manual pause, keyboard controls, runtime reduced-motion changes, offscreen suspension, and automated WCAG A/AA checks.

Playwright uses `/usr/bin/google-chrome` when available. Otherwise run `npx playwright install chromium`, or supply `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

Automated checks do not replace real-device Safari/Firefox or screen-reader testing. The artwork is a stylized original illustration, not a photorealistic model.

## Files

| File                                       | Responsibility                                       |
| ------------------------------------------ | ---------------------------------------------------- |
| `StudentWalkingLoader.tsx`                 | Shared SVG artwork and accessible React wrapper      |
| `walker-motion.ts`                         | Foot-led gait, animation clock and lifecycle cleanup |
| `walker.css`                               | Namespaced component styling and motion preferences  |
| `index.html`, `preview.tsx`, `preview.css` | Responsive showcase                                  |
| `public/fonts/`                            | Self-hosted showcase fonts and license notices       |
| `tests/`                                   | Browser, accessibility and geometry checks           |
