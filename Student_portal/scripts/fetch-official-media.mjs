/**
 * Downloads the official Westin photography and produces optimised WebP.
 *
 * Input  : scripts/official-media.manifest.json  (already curated by hand)
 * Output : public/images/official/<key>-<w>.<ext>
 *          src/public/officialMedia.generated.json
 *
 * Downloads go through curl (Node's fetch ignores the sandbox proxy) and are
 * cached in references/official-crawl.local/media-cache so re-runs are cheap.
 * Gallery entries are discovered from the crawled page named in the manifest
 * rather than hard-coded, so a re-crawl needs no code change.
 *
 *   node scripts/fetch-official-media.mjs            # missing files only
 *   node scripts/fetch-official-media.mjs --force    # re-encode everything
 *   node scripts/fetch-official-media.mjs --budget 60000000
 */
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const here = dirname(fileURLToPath(import.meta.url))
const app = resolve(here, '..')
const crawl = resolve(app, '../references/official-crawl.local')
const outRoot = join(app, 'public/images/official')
const cacheDir = join(crawl, 'media-cache')
const generated = join(app, 'src/public/officialMedia.generated.json')

const args = process.argv.slice(2)
const force = args.includes('--force')
const budgetArg = args.indexOf('--budget')
const budget = budgetArg > -1 ? Number(args[budgetArg + 1]) : 60_000_000

const WIDTHS = [480, 960]
const XL_WIDTH = 1600
const JPEG_QUALITY = 82
const WEBP_QUALITY = 80

/**
 * Leadership banner geometry, measured by orange-ring blob detection on the
 * 1600x839 source: three circles, diameter 288, shared top edge y=327.
 * Anchoring all three at the same top edge keeps the circles identically framed.
 */
const CIRCLE_CROPS = {
  'circle-1': { left: 118, top: 327, width: 288, height: 288 },
  'circle-2': { left: 651, top: 327, width: 288, height: 288 },
  'circle-3': { left: 1187, top: 327, width: 288, height: 288 },
}

const TEMPLATE_FILLER = /^(nsplsh_|11062b_|2a1a02_|baac51_)/

function curl(url, destination) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(
      'curl',
      [
        '-sS', '-L',
        // --max-time alone does not stop a stalled connection here, so the
        // connect and low-speed phases get their own bounds. A hung transfer
        // must never block the whole gallery run.
        '--connect-timeout', '15',
        '--max-time', '60',
        '--speed-limit', '1024',
        '--speed-time', '20',
        '--retry', '2',
        '--retry-delay', '1',
        '-o', destination,
        url,
      ],
      { stdio: ['ignore', 'ignore', 'pipe'] },
    )
    let stderr = ''
    child.stderr.on('data', (chunk) => (stderr += chunk))
    child.on('close', (code) =>
      code === 0 ? resolvePromise() : reject(new Error(`curl ${code}: ${stderr.trim()}`)),
    )
    child.on('error', reject)
  })
}

async function exists(file) {
  try {
    const info = await stat(file)
    return info.size > 0
  } catch {
    return false
  }
}

async function fetchOriginal(uri) {
  await mkdir(cacheDir, { recursive: true })
  const cached = join(cacheDir, uri)
  if (!force && (await exists(cached))) return cached
  await mkdir(dirname(cached), { recursive: true })
  const temporary = `${cached}.part`
  await curl(`https://static.wixstatic.com/media/${uri}`, temporary)
  if (!(await exists(temporary))) throw new Error(`empty download for ${uri}`)
  const { rename } = await import('node:fs/promises')
  await rename(temporary, cached)
  return cached
}

const media = {}

/** Encode one source buffer into the width ladder and record its dimensions. */
async function emit(key, buffer, { alpha = false } = {}) {
  const extension = alpha ? 'png' : 'webp'
  const base = join(outRoot, key)
  await mkdir(dirname(base), { recursive: true })
  const meta = await sharp(buffer).metadata()
  const widest = Math.min(meta.width ?? 1600, XL_WIDTH)
  const ladder = WIDTHS.filter((width) => width <= widest)
  if (!ladder.length) ladder.push(Math.min(widest, 480))

  const written = []
  for (const width of ladder) {
    const file = `${base}-${width}.${extension}`
    // Re-encoding is the slow part of a re-run, so keep any existing file.
    if (!force && (await exists(file))) {
      written.push(width)
      continue
    }
    const pipeline = sharp(buffer).resize({
      width,
      withoutEnlargement: true,
      ...(alpha ? {} : { fit: 'inside' }),
    })
    if (alpha) await pipeline.png({ compressionLevel: 9 }).toFile(file)
    else await pipeline.webp({ quality: WEBP_QUALITY, effort: 5 }).toFile(file)
    written.push(width)
  }

  // The largest encoding is the display size; record it so consumers can set
  // width/height attributes and avoid layout shift.
  const largest = written[written.length - 1]
  const largestMeta = await sharp(
    await readFile(`${base}-${largest}.${extension}`),
  ).metadata()
  media[key] = {
    srcset: written.map((width) => `/images/official/${key}-${width}.${extension} ${width}w`),
    src: `/images/official/${key}-${largest}.${extension}`,
    width: largestMeta.width,
    height: largestMeta.height,
    format: extension,
  }
  return written
}

/**
 * Read the ordered photo URIs for a gallery from the crawled page. The manifest
 * names the slug; json/<slug>.json holds the images in page order.
 */
async function galleryUris(page, key) {
  const file = join(crawl, 'json', `${page}.json`)
  let parsed
  try {
    parsed = JSON.parse(await readFile(file, 'utf8'))
  } catch {
    return []
  }
  const blocks = parsed?.sections?.main ?? []
  const uris = []
  for (const block of blocks) {
    if (block?.t !== 'img' || !block.uri) continue
    if (TEMPLATE_FILLER.test(block.uri)) continue
    if (/^https?:\/\//i.test(block.uri)) continue
    if (!uris.includes(block.uri)) uris.push(block.uri)
  }
  if (key === 'clubs') {
    // This source page also embeds unrelated course photos. Its student-club
    // gallery begins after the portrait JPEG run and ends at the next run.
    const start = uris.findIndex((uri, index) => index > 0 && uris[index - 1].endsWith('.jpeg') && /^e4b079_.*\.jpg$/i.test(uri))
    const end = uris.findIndex((uri, index) => index > start && uri.endsWith('.jpeg'))
    return start < 0 ? [] : uris.slice(start, end > start ? end : undefined)
  }
  return uris
}

let totalBytes = 0
let encoded = 0
let failed = 0

const manifest = JSON.parse(
  await readFile(join(here, 'official-media.manifest.json'), 'utf8'),
)

/** Resolve a manifest entry to an encoded source, following `from`/`crop` chains. */
const sources = new Map()

for (const image of manifest.images) {
  try {
    if (image.from) {
      const parent = sources.get(image.from)
      if (!parent) throw new Error(`unknown parent ${image.from}`)
      const region = CIRCLE_CROPS[image.crop]
      if (!region) throw new Error(`unknown crop ${image.crop}`)
      const cropped = await sharp(parent.buffer)
        .extract(region)
        .png()
        .toBuffer()
      const widths = await emit(image.key, cropped, { alpha: true })
      sources.set(image.key, { buffer: cropped, widths })
      encoded++
      continue
    }
    const file = await fetchOriginal(image.uri)
    const buffer = await readFile(file)
    const widths = await emit(image.key, buffer, { alpha: !!image.alpha })
    sources.set(image.key, { buffer, widths })
    encoded++
  } catch (error) {
    failed++
    console.warn(`  ! ${image.key}: ${error.message}`)
  }
}

// Galleries: two widths only, capped per album to bound the payload.
for (const gallery of manifest.galleries) {
  try {
    const uris = await galleryUris(gallery.page, gallery.key)
    if (!uris.length) {
      console.warn(`  ~ ${gallery.key}: no photos found in ${gallery.page}`)
      continue
    }
    for (const [index, uri] of uris.entries()) {
      const file = await fetchOriginal(uri)
      const buffer = await readFile(file)
      const key = `${gallery.key}/${String(index + 1).padStart(2, '0')}`
      const meta = await sharp(buffer).metadata()
      const widest = Math.min(meta.width ?? 1600, 960)
      const widths = WIDTHS.filter((width) => width <= widest)
      if (!widths.length) widths.push(widest)
      const base = join(outRoot, key)
      await mkdir(dirname(base), { recursive: true })
      for (const width of widths) {
        const target = `${base}-${width}.webp`
        if (force || !(await exists(target))) {
          await sharp(buffer)
            .resize({ width, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: WEBP_QUALITY, effort: 5 })
            .toFile(target)
        }
      }
      media[key] = {
        srcset: widths.map(
          (width) => `/images/official/${key}-${width}.webp ${width}w`,
        ),
        src: `/images/official/${key}-${widths[widths.length - 1]}.webp`,
        album: gallery.key,
        page: gallery.page,
      }
    }
    encoded++
  } catch (error) {
    failed++
    console.warn(`  ! ${gallery.key}: ${error.message}`)
  }
}

for (const key of Object.keys(media)) {
  const src = media[key].src
  try {
    totalBytes += (await stat(join(app, 'public', src))).size
  } catch {
    /* recorded entry with no file */
  }
}

await writeFile(
  generated,
  `${JSON.stringify({ generatedBy: 'fetch-official-media.mjs', images: media }, null, 2)}\n`,
)

const galleryCount = Object.keys(media).filter((key) => key.includes('/') &&
  /^events\//.test(key)).length

console.log(
  `Encoded ${encoded} media entries (${galleryCount} gallery photos), ${failed} failed`,
)
console.log(
  `Total ${(totalBytes / 1024 / 1024).toFixed(1)} MB across ${Object.keys(media).length} keys`,
)
if (totalBytes > budget) {
  console.error(
    `Over budget: ${(totalBytes / 1024 / 1024).toFixed(1)} MB > ${(budget / 1024 / 1024).toFixed(0)} MB`,
  )
  process.exitCode = 1
}
