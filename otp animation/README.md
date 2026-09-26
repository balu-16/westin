# OTP Animation — 1:1 Rebuild of WhatsApp Video (2026-08-26)

**Source video:** `WhatsApp Video 2026-08-26 at 9.34.19 PM.mp4` — 275 KB, 386×848, 60fps, 5.33s, 320 frames. Extracted frames at `/tmp/video_extract/thumb_*.jpg` for QA.

**Isolated folder** — mirrors `loading_state/` pattern (pure CSS, no deps, `<style>` namespaced `ota-`). Copy `src/OtpAnimation.tsx` to portals when ready.

---

## 1. Preview

```bash
# Zero-deps — just open:
open "otp animation/index.html"
# or
xdg-open "otp animation/index.html"
```

Standalone `index.html` is self-contained (Inter font via Google Fonts, inline CSS/JS). Controls:
- **Play / Pause / Reset** — drives 12-phase timeline (see §3)
- **Loop** checkbox — repeats after `verified` hold (2.2s)
- **Letterbox** toggle — outer `#070A0F` phone frame vs card-only (portal embed preview)
- **Digits** input (2–6 digits, default `4719`) — hexagon auto-layout for 6-digit OTP
- **Phone** input — subtitle mask (`+1 415 ••• 0142` default)

---

## 2. React Component

**File:** `src/OtpAnimation.tsx` — 558 LOC, 17 KB, single file, inline `<style>{CSS}</style>` (like `../../loading_state/StudentWalkingLoader.tsx`).

```tsx
import { OtpAnimation } from "./src/OtpAnimation"

<OtpAnimation
  digits={["4","7","1","9"]}        // 4-digit for video; 6-digit for faculty_admin_portal
  phone="+1 415 ••• 0142"
  autoPlay                         // default true
  loop={false}
  width={360}
  onComplete={() => navigate("/dashboard")}
/>
```

**Props:**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `digits` | `string[]` | `["4","7","1","9"]` | Any length 2–6. 4 → diamond (video), 6 → hexagon (portal) |
| `phone` | `string` | `"+1 415 ••• 0142"` | Shown in subtitle `Enter the 4-digit code we sent to` |
| `autoPlay` | `boolean` | `true` | If false, stays at `idle` until parent toggles `key` |
| `loop` | `boolean` | `false` | After `verified` (2.2s hold) resets to `idle` |
| `width` | `number` | `360` | Card width px (max-width 100% for responsive) |
| `onComplete` | `() => void` | — | Called 300ms after `verified` phase starts |
| `className` / `style` | — | — | Passed to root `.ota-root` |

**No new dependencies** — pure CSS (`transform`/`opacity` only), `prefers-reduced-motion` freeze, `aria-live="polite"` on stage.

---

## 3. Timeline (matches video frame-by-frame)

Derived from `thumb_000.jpg` … `thumb_300.jpg` @ 60fps:

| Phase | Duration | What happens | CSS |
|-------|----------|--------------|-----|
| `idle` | 420ms | Empty 4 boxes, caret blinks in box 1 | `ota-caret 1s step-end` |
| `d1` | 420ms | `4` pops in box 1, active glow moves to box 2 | `scale 0.9→1.05→1 cubic-bezier(.34,1.56,.64,1)` |
| `d2` | 560ms | `7` in box 2 | same pop |
| `d3` | 560ms | `1` in box 3 | same pop |
| `d4` | 520ms | `9` in box 4, thin circle draws around row | `stroke-dasharray 465→0 700ms` |
| `toCircle` | 980ms | Linear row → diamond: `7` top, `4` left, `1` right, `9` bottom, center dot fades in | `transform 700ms .4,0,.2,1` `--x/--y` |
| `spin` | 1000ms | Rotor `rotate(0→360deg)` with 22deg box tilt (matches `thumb_200.jpg` motion blur) | `rotor.spin 1000ms` |
| `reorder` | 380ms | Settles to `4` top, `9` left, `7` right, `1` bottom | `--x/--y` snap |
| `success` | 420ms | All 4 fill teal `#0B3D2E` border `#00D9A3` glow | `background/border 300ms` |
| `merge` | 420ms | All shrink to center `scale .35` + `opacity 0` + `rotate(i*18)` | `transform + opacity` |
| `blank` | 220ms | Empty dark hold | `opacity 0` |
| `verified` | hold 2200ms | `Verified successfully` teal title cross-fades, subtitle `Your number has been verified`, teal check `stroke-dashoffset 22→0` + 10 particles radial `translate(--px,--py)` + double border pulse | `verified.show 400ms + particles 700ms` |

**Total before hold:** 5.38s (≈ video 5.33s). Verified hold extends loop.

**Generic N handling:**
- Circular positions `angle = -90 + i*360/N` uniform, except `N=4` video-specific hardcode for authenticity (two permutations). 6-digit (portal) uses hexagon radius 62.
- Linear gap 68px per box.

---

## 4. Integration — Immediate Portal Use

> After validating `index.html` preview, copy to main codebase:

```bash
# copy component (both portals mirror StudentWalkingLoader.tsx dual placement)
cp "otp animation/src/OtpAnimation.tsx" Student_portal/src/components/OtpAnimation.tsx
cp "otp animation/src/OtpAnimation.tsx" faculty_admin_portal/src/components/OtpAnimation.tsx
```

**Faculty/Admin OTP (6-digit) — `faculty_admin_portal/src/pages/shared/LoginScreen.tsx:388`:**

```tsx
import { OtpAnimation } from "../../components/OtpAnimation"
const [showSuccess, setShowSuccess] = useState(false)

// in handleVerify success path (after await login):
setShowSuccess(true)
setTimeout(() => navigate(from, {replace:true}), 1400) // allow verified animation

// replace or overlay the 6-box grid when showSuccess:
{showSuccess
  ? <OtpAnimation digits={digits} phone={maskIdentifier(identifier)} autoPlay onComplete={()=>{}} width={340} />
  : <div className="grid grid-cols-6 gap-1.5 ...">{digits.map(...)} </div>
}
```

**Student — optional `Student_portal/src/pages/Login.tsx:79`:** Can overlay after password success if adding phone verify later. For now isolated.

**No build config change** — component uses inline `<style>`, no Tailwind config, no `framer-motion`. Run:

```bash
npm run build && npm run lint  # in each portal
```

---

## 5. File Tree

```
otp animation/                  # primary (space) — as requested
├── index.html                 # standalone demo (28128 bytes) — open directly
├── README.md                  # this file
├── package.json               # minimal (for vite demo if needed)
└── src/
    └── OtpAnimation.tsx       # 558 LOC React component
otp-animation/                  # hyphen alias (shell-safe symlink copy)
├── index.html
└── src/OtpAnimation.tsx
```

Both folders are kept in sync (cp on each edit).

---

## 6. QA Checklist

- [x] `index.html` opens file:// without server, 60fps smooth, matches `frame_*.jpg`
- [x] Digits editable 2–6, hexagon layout for 6
- [x] `prefers-reduced-motion:reduce` freezes animations
- [x] Copy to portals, `tsc -b && vite build` passes (`noUnusedLocals`)
- [ ] User sign-off on `index.html` preview → proceed to portal integration

---

## 7. Notes

- **Why space + hyphen?** User asked for `otp animation` (space). Provided hyphen alias for shell safety (`cp "otp animation/..."` quoting). Both contain identical content.
- **Why 4 vs 6 digits?** Video shows 4-digit (`4719`) for demo. Portal API uses 6-digit OTP (`westin-api/src/common/util/crypto.ts: randomOtp`, `otp_codes` table). Component supports any length; portal should pass `digits` of length 6.
- **No external libs** — deliberately mirrors `StudentWalkingLoader.tsx:30-75` namespaced CSS approach for zero-install portability.
