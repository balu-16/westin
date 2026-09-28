import { writeFile } from 'node:fs/promises'

const destination = new URL('../src/public/cms-snapshot.json', import.meta.url)
const base = process.env.PUBLIC_CMS_BUILD_URL
if (!base) {
  await writeFile(destination, '{"settings":{},"entries":[]}\n')
  console.log('CMS snapshot: empty (set PUBLIC_CMS_BUILD_URL to include published API content)')
  process.exit(0)
}

const origin = new URL(base)
if (origin.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(origin.hostname)) {
  throw new Error('PUBLIC_CMS_BUILD_URL must use HTTPS outside local development')
}
const endpoint = new URL('/api/public/site', origin)
const response = await fetch(endpoint, { signal: AbortSignal.timeout(20000) })
if (!response.ok) throw new Error(`CMS snapshot request failed: ${response.status}`)
const payload = await response.json()
if (!payload || !Array.isArray(payload.entries)) throw new Error('CMS snapshot must contain an entries array')

const allowed = new Set(['homepage-section', 'program', 'page', 'news', 'blog', 'event-story', 'gallery', 'magazine', 'testimonial', 'success-story'])
const seen = new Set()
const entries = payload.entries.filter((entry) => {
  if (!entry || !allowed.has(entry.entryType) || typeof entry.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) || !entry.content || typeof entry.content !== 'object' || Array.isArray(entry.content)) return false
  const key = `${entry.entryType}:${entry.slug}`
  if (seen.has(key)) return false
  seen.add(key)
  return true
}).map((entry) => ({
  id: String(entry.id ?? `${entry.entryType}:${entry.slug}`),
  entryType: entry.entryType,
  slug: entry.slug,
  content: entry.content,
  seo: entry.seo && typeof entry.seo === 'object' ? entry.seo : {},
  publishedAt: typeof entry.publishedAt === 'string' ? entry.publishedAt : '',
  media: Array.isArray(entry.media) ? entry.media : [],
}))

await writeFile(destination, JSON.stringify({ settings: {}, entries }) + '\n')
console.log(`CMS snapshot: ${entries.length} published entries from ${endpoint.origin}`)
