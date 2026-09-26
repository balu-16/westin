# Westin College portals — monorepo

One repository for all three Westin College applications. Each app keeps its own
build, dependencies and Vercel project; the repository only groups them so a
single push can deploy everything.

| App | Folder | Stack | Vercel project | Root Directory | Production URL |
| --- | --- | --- | --- | --- | --- |
| Student portal (public website + student dashboard) | `Student_portal/` | React 19, Vite 8, Tailwind v4 | `westin-student` | `Student_portal` | https://westin-student.vercel.app |
| Faculty & Admin portal | `faculty_admin_portal/` | React 19, Vite 8, Tailwind v4 | `westin-faculty` | `faculty_admin_portal` | https://westin-faculty.vercel.app |
| API (all three portals) | `westin-api/` | NestJS 11, raw SQL on Supabase Postgres | `westin-api` | `westin-api` | https://westin-api.vercel.app |

Every project is connected to this repository (`balu-16/westin`, production branch
`master`) and builds only its own Root Directory, so a push to `master` deploys
all three independently.

## How the deployments are wired

- **Frontends** read the backend origin from `VITE_API_URL`, set as a Vercel
  environment variable on both frontend projects (locally the same value lives in
  each app's untracked `.env`). The value is baked in at build time, so changing
  the API origin requires a new deployment.
- **Backend** reads its configuration from Vercel environment variables
  (`DATABASE_URL`, `SUPABASE_*`, `JWT_SECRET`, `SMTP_*`, `CORS_ORIGINS`,
  `ONESIGNAL_*`, …). `CORS_ORIGINS` must list the deployed frontend origins.
- `westin-api/vercel.json` keeps the existing `builds`/`routes` contract:
  `src/main.ts` exports the Nest handler and Vercel routes every path to it.
- Each app's `vercel.json` (SPA rewrites, caching and security headers) is
  unchanged and is read from the app's own Root Directory.

## Local development

Each app is standalone — install and run it from its own folder:

```bash
# backend (http://localhost:4000)
cd westin-api && npm install && npm run dev

# student portal (http://localhost:5173, proxies /api to :4000)
cd Student_portal && npm install && npm run dev

# faculty/admin portal (http://localhost:5174, proxies /api to :4000)
cd faculty_admin_portal && npm install && npm run dev -- --port 5174
```

## Tests

```bash
cd Student_portal && npm test                 # Playwright (fixture + published modes)
cd westin-api && npm run smoke                # API smoke suite against a running API
API_URL=https://westin-api.vercel.app npm run smoke   # …or against production
```

## Deploying

Push to `master`; each Vercel project builds from its Root Directory. To deploy
manually, run `vercel --prod` inside the app folder (the local link is stored in
that app's untracked `.vercel/` directory).

## Repository layout notes

- `references/` — approved design boards, rebuild screenshots and the public
  content inventory. `Student_portal/scripts/capture-skybook.mjs` and
  `assets:skybook` read from `references/homepage-rebuild/`.
- `plan.md` — the Skybook implementation record and remaining roadmap.
- `login_page_redesign/`, `loading_state/`, `otp animation/` — standalone design
  previews with their own manifests; not deployed.
- `OneSignalSDK-v16-ServiceWorker_*/` — local SDK downloads only (ignored by git).
  The portals load OneSignal from `cdn.onesignal.com` at runtime through their own
  `public/OneSignalSDKWorker.js`.
- `.env` files are never committed; the deployed values live in the Vercel
  projects. `.env.example` files show the required keys.
