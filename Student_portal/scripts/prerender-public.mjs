import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { render, staticPublicPaths } from '../dist-server/entry-server.js'

const official = process.env.VITE_PUBLIC_RELEASE_MODE === 'official'
const origin = (process.env.VITE_PUBLIC_SITE_ORIGIN || 'https://www.westincollegevijayawada.com').replace(/\/+$/, '')
if (official && (!origin.startsWith('https://') || new URL(origin).pathname !== '/')) {
  throw new Error('Official release requires an HTTPS site origin without a path')
}

const template = await readFile('dist/index.html', 'utf8')
const fallbackHead = template
  .replace(/\s*<meta[^>]+id="portal-default-description"[^>]*\/>/, '')
  .replace(/\s*<meta[^>]+id="portal-default-robots"[^>]*\/>/, '')
  .replace(/<title>[^<]*<\/title>/, '')

for (const path of staticPublicPaths()) {
  const rendered = render(path)
  const bodyStart = rendered.indexOf('<div class="skybook-site')
  if (bodyStart < 0) throw new Error(`Public SSR output missing site root for ${path}`)
  const head = rendered.slice(0, bodyStart)
  const body = rendered.slice(bodyStart)
  const html = fallbackHead.replace('</head>', `${head}</head>`).replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  const destination = path === '/' ? 'dist/index.html' : join('dist', path.slice(1), 'index.html')
  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, html)
  if (path !== '/') await writeFile(join('dist', path.slice(1) + '.html'), html)
}

const publicPaths = staticPublicPaths().filter((path) => path !== '/search')
await writeFile('dist/robots.txt', official
  ? `User-agent: *\nAllow: /\nDisallow: /login\nDisallow: /dashboard\nDisallow: /timetable\nDisallow: /attendance\nDisallow: /materials\nDisallow: /events\nDisallow: /settings\nSitemap: ${origin}/sitemap.xml\n`
  : 'User-agent: *\nDisallow: /\n')

const escapeXml = (value) => value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char])
await writeFile('dist/sitemap.xml', official
  ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPaths.map((path) => `  <url><loc>${escapeXml(origin + path)}</loc></url>`).join('\n')}\n</urlset>\n`
  : '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" />\n')

// Unknown and private SPA routes continue to use the unindexed shell.
await writeFile('dist/app-shell.html', template)
await writeFile('dist/404.html', template)
console.log(`Prerendered ${staticPublicPaths().length} public routes (${official ? 'official' : 'prelaunch'} mode)`)
