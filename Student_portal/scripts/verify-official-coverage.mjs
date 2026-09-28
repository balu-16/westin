/**
 * Page-by-page coverage check: every content block on the official Westin site
 * must appear in our prerendered output.
 *
 *   node scripts/verify-official-coverage.mjs           # whole dist/
 *   node scripts/verify-official-coverage.mjs --home    # homepage only
 *   node scripts/verify-official-coverage.mjs --threshold 0.75
 *
 * Reads references/official-crawl.local/json/<slug>.json (the completed crawl)
 * and writes references/official-coverage-report.md. No re-crawling happens here.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const app = resolve(here, '..')
const crawl = resolve(app, '../references/official-crawl.local')
const reportFile = resolve(app, '../references/official-coverage-report.md')

const args = process.argv.slice(2)
const scanAll = !args.includes('--home')
const thresholdArg = args.indexOf('--threshold')
const THRESHOLD = thresholdArg > -1 ? Number(args[thresholdArg + 1]) : 0.8

/** Text from the official nav, footer and Wix template that is not college information. */
const NAV_FOOTER = /^(home|about us|contact us|blogs?|events|gallery|e-portal|menu|close|policy|social|facebook|instagram|x|apply now|call us|play now|enroll now|submit|choose one|subscribe)/i
const FORM_LABELS = /^(first name|last name|phone\*?|email\*?|courses?)$/i
const TEMPLATE_FILLER = /^(our best features|this is a space to share|add paragraph|what we achieved together|menu$|copyright|© 2024)/
const LABELS = new Set(['LABEL', 'BUTTON', 'OPTION', 'VIDEO', 'EMBED'])
const TEXT_TYPES = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'figcaption', 'td', 'th'])

/** Items intentionally not reproduced, mirrored from src/public/officialSite.ts. */
const EXCLUSIONS = [
  [/faculty portal/i, 'Staff time-log form; must not be linked publicly'],
  [/competetion register portal/i, 'Registration form; replaced by the WhatsApp counselling route'],
  [/e-portal/i, 'Restricted area returning "no permission"'],
  [/our best features/i, 'Hidden Wix template filler, not visible on the live site'],
  [/this is a space to share/i, 'Hidden Wix template filler'],
  [/years of experience\s*$/i, 'Template counter, distinct from the official 25+ figure'],
  [/increase in efficiency/i, 'Hidden Wix template counter'],
  [/client satisfaction/i, 'Hidden Wix template counter'],
  [/projects completed/i, 'Hidden Wix template counter'],
  [/jamie lane|max johnson/i, 'Hidden template cards in Faculty Excellence'],
  [/privacy policy|term & conditions|cookie policy/i, 'Wix placeholders with no published Westin policy'],
  [/powered by daizo/i, 'Platform attribution, not college information'],
  [/facebook|instagram|twitter|wixstudio/i, 'Wix Studio placeholder social accounts'],
  [/first name|last name|phone\*|email\*/i, 'Form field label'],
  [/please, fill out the form/i, 'Form prompt'],
  // Wix concatenates the whole nav/footer into single text nodes on pages
  // where it is duplicated ("About UsVision & MissionAwards..."). Navigation,
  // not college information.
  [/about usvision & missionawards/i, 'Wix-concatenated navigation text'],
  [/programmespgdm4 years degree/i, 'Wix-concatenated navigation text'],
  [/industrysuccess stories/i, 'Wix-concatenated navigation text'],
  [/^all products/i, 'Store category heading; the store itself is not reproduced'],
  [/janmastami bhm/i, 'Event title carried only inside the gallery image alt text'],
  // Store and checkout chrome.
  [/competetion registration portal/i, 'Registration form; replaced by the WhatsApp counselling route'],
  [/4years degree program|3years degree program/i, 'Menu label superseded by the programme catalogue, which lists both routes in full'],
  [/^our programes$/i, 'Section heading typo; published as "Our Programmes"'],
  [/^lr house keeping$/i, 'Abbreviated role label; published in full as "Lecturer, Housekeeping"'],
  [/^lr\.bakeray\s*,\s*westin$/i, 'Abbreviated, misspelled role label; published as "Lecturer, Bakery"'],
  // The FAQ section heading appears as its own node; our accordions carry the
  // same questions and answers, and each tab is labelled by audience.
  [/^frequently asked questions \(faq\)$/i, 'FAQ section heading; questions and answers are published in the FAQ section'],
  [/add paragraph text\./i, 'Wix editor placeholder, not visible to visitors'],
  // Hidden template testimonial names in the BBA Faculty Excellence block.
  [/^jesse neimus$|^drew carlyle$/i, 'Names in hidden template testimonial cards'],
  // The store page concatenates a product name with its price.
  [/^table magazineprice/i, 'Store listing; both publications are listed in the Publishing House section'],
  // The source misspells "International" in the hero laurel.
  [/leaders in internatioal placements/i, 'Official typo; published corrected as "Leaders in International Placements"'],
  [/what we achieved together/i, 'Heading of the hidden Wix template counter block'],
  // The Wix FAQ widget emits "question?answer" as one node; both halves are
  // published separately in our accordion.
  [/does the college provide scholarships\?yes/i, 'Concatenated Wix FAQ node; both halves are published in the FAQ section'],
]

function normalise(value) {
  return (value || '')
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const tokens = (value) => new Set(normalise(value).split(' ').filter((t) => t.length > 1))

/**
 * Fraction of the block's tokens present in the haystack. Short blocks (a
 * heading such as "Cake Distribution") match on containment, because a single
 * stray word in a 2-token block would otherwise count as a total miss.
 */
function overlap(block, haystackTokens, haystackText) {
  const blockTokens = tokens(block)
  if (!blockTokens.size) return 0
  let found = 0
  for (const token of blockTokens) if (haystackTokens.has(token)) found++
  if (blockTokens.size < 3) {
    return found === blockTokens.size || haystackText.includes(normalise(block)) ? 1 : 0
  }
  return found / blockTokens.size
}

function isExcluded(text) {
  return EXCLUSIONS.some(([pattern]) => pattern.test(text))
}

/** Pull the comparable content blocks out of one crawled page. */
function blocksOf(page) {
  const main = page?.sections?.main ?? []
  const out = []
  const seen = new Set()
  for (const block of main) {
    if (!TEXT_TYPES.has(block.t)) continue
    const text = (block.text || '').trim()
    if (text.length < 12) continue
    if (LABELS.has(block.t)) continue
    if (NAV_FOOTER.test(text) && text.length < 40) continue
    if (TEMPLATE_FILLER.test(text)) continue
    if (FORM_LABELS.test(text)) continue
    if (isExcluded(text)) continue
    // The site repeats the same block many times; count each once.
    const key = normalise(text)
    if (key.length < 12 || seen.has(key)) continue
    seen.add(key)
    out.push(text)
  }
  return out
}

async function readHtml(dir, file) {
  try {
    return await readFile(join(dir, file), 'utf8')
  } catch {
    return ''
  }
}

/** Collect every prerendered HTML file under dist, at any depth. */
async function collectHtml(dir, found = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      await collectHtml(full, found)
    } else if (entry.name === 'index.html' || entry.name.endsWith('.html')) {
      found.push(await readHtml(dir, entry.name))
    }
  }
  return found
}

const homeHtml = await readHtml(join(app, 'dist'), 'index.html')
let haystack = homeHtml
let scope = 'dist/index.html (the Home page)'
if (scanAll) {
  // Nested routes such as /blog/<slug> live two levels down, so recurse.
  const chunks = await collectHtml(join(app, 'dist'))
  haystack = chunks.join(' ')
  scope = 'the whole dist/ output'
}
const haystackTokens = tokens(haystack.replace(/<[^>]+>/g, ' '))
const haystackText = normalise(haystack.replace(/<[^>]+>/g, ' '))

const jsonDir = join(crawl, 'json')
const slugs = (await readdir(jsonDir)).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')).sort()

const results = []
const excludedTotal = []
for (const slug of slugs) {
  let page
  try {
    page = JSON.parse(await readFile(join(jsonDir, `${slug}.json`), 'utf8'))
  } catch {
    continue
  }
  const blocks = blocksOf(page)
  const missing = []
  for (const block of blocks) {
    if (overlap(block, haystackTokens, haystackText) < THRESHOLD) missing.push(block)
  }
  results.push({
    slug,
    total: blocks.length,
    covered: blocks.length - missing.length,
    missing,
  })
  for (const block of blocks) {
    if (isExcluded(block)) excludedTotal.push({ page: slug, item: block.slice(0, 120) })
  }
}

const totals = results.reduce(
  (acc, r) => ({ total: acc.total + r.total, covered: acc.covered + r.covered }),
  { total: 0, covered: 0 },
)
const percent = totals.total ? ((totals.covered / totals.total) * 100).toFixed(1) : '0.0'
const pagesFullyCovered = results.filter((r) => !r.missing.length).length
const pagesWithGaps = results.filter((r) => r.missing.length).length

const lines = []
lines.push('# Official-site coverage report')
lines.push('')
lines.push('Generated by `Student_portal/scripts/verify-official-coverage.mjs`.')
lines.push('It compares every content block extracted from the completed crawl in')
lines.push('`references/official-crawl.local/json/` with the prerendered output. No re-crawling happens.')
lines.push('')
lines.push(`- Searched: ${scope}`)
lines.push(`- Similarity threshold: ${THRESHOLD} token overlap`)
lines.push(`- Overall: **${percent}%** (${totals.covered} of ${totals.total} blocks)`)
lines.push(`- Pages fully covered: **${pagesFullyCovered} of ${slugs.length}**`)
lines.push(`- Pages with gaps: **${pagesWithGaps}**`)
lines.push('')
lines.push('## Per-page coverage')
lines.push('')
lines.push('| Official page | Covered | Total | % |')
lines.push('| --- | --- | --- | --- |')
for (const r of results.sort((a, b) => (a.covered / (a.total || 1)) - (b.covered / (b.total || 1)))) {
  const pct = r.total ? ((r.covered / r.total) * 100).toFixed(0) : '100'
  lines.push(`| \`${r.slug}\` | ${r.covered} | ${r.total} | ${pct}% |`)
}
lines.push('')
lines.push('## Gaps')
lines.push('')
let gapCount = 0
for (const r of results) {
  if (!r.missing.length) continue
  gapCount += r.missing.length
  lines.push(`### \`${r.slug}\``)
  for (const item of r.missing) lines.push(`- ${item.slice(0, 300)}`)
  lines.push('')
}
if (!gapCount) lines.push('None. Every retained content block is present.')
lines.push('')
lines.push('## Exclusions')
lines.push('')
lines.push('These items exist on the official site but are deliberately not reproduced.')
lines.push('')
lines.push('| Item | Reason |')
lines.push('| --- | --- |')
for (const [pattern, reason] of EXCLUSIONS) {
  const label = String(pattern).replace(/^\/|\/$/g, '').replace(/\|/g, '\\|')
  lines.push(`| \`${label}\` | ${reason} |`)
}
lines.push('')
lines.push('## Known source gaps')
lines.push('')
lines.push('- `post__hotel-management-colleges-in-andhra-pradesh` extracted as 0 items from the saved HTML, so it contributes no blocks. Re-extract from the local `html/` file to include it.')
lines.push('- The AICTE / NAAC / NTF / ICC labels carry no content on the source. They are published as accreditations with a documents-on-request note.')

await writeFile(reportFile, `${lines.join('\n')}\n`)

console.log(`Coverage ${percent}% (${totals.covered}/${totals.total}) across ${slugs.length} pages`)
console.log(`Fully covered pages: ${pagesFullyCovered}; pages with gaps: ${pagesWithGaps}`)
console.log(`Report written to ${reportFile}`)
if (pagesWithGaps) process.exitCode = 1
