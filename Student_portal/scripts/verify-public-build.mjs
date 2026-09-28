import { readFile, stat } from 'node:fs/promises'
import { render, staticPublicPaths } from '../dist-server/entry-server.js'

const official = process.env.PUBLIC_EXPECT_RELEASE === 'official'
const origin = (process.env.VITE_PUBLIC_SITE_ORIGIN || 'https://www.westincollegevijayawada.com').replace(/\/+$/, '')
const paths = staticPublicPaths()
const heroQuotes = new Map()
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
const robots = await readFile('dist/robots.txt', 'utf8')
const shell = await readFile('dist/app-shell.html', 'utf8')
if (!shell.includes('content="noindex,nofollow"')) throw new Error('Private shell must remain unindexed')
if (official && !robots.includes(`Sitemap: ${origin}/sitemap.xml`)) throw new Error('Official robots file has no sitemap')
if (!official && !robots.includes('Disallow: /')) throw new Error('Prelaunch robots file must disallow crawling')
if (/\/login<\/loc>|\/dashboard<\/loc>|\/search<\/loc>/.test(sitemap)) throw new Error('Private or search route appears in sitemap')

for (const path of paths) {
  const file = path === '/' ? 'dist/index.html' : `dist${path}/index.html`
  await stat(file)
  const html = await readFile(file, 'utf8')
  if (!html.includes('<div id="root"><div class="skybook-site')) throw new Error(`No prerendered content: ${path}`)
  if (path === '/') {
    if (!/<p class="ed-hand ed-hero-hand">Good people<br\/>make great places/.test(html)) throw new Error('Home hero is missing its original quote')
  } else {
    const quote = html.match(/<p class="sk-page-hero-quote">([^<]+)<span/)?.[1]?.trim()
    if (!quote || /Good people|make great places/i.test(quote)) throw new Error(`Missing or repeated Home hero quote: ${path}`)
    const normalizedQuote = quote.toLocaleLowerCase('en').replace(/\s+/g, ' ')
    if (heroQuotes.has(normalizedQuote)) throw new Error(`Hero quote repeated on ${heroQuotes.get(normalizedQuote)} and ${path}`)
    heroQuotes.set(normalizedQuote, path)
  }
  if ((html.match(/data-public-next-step="true"/g) ?? []).length !== 1) throw new Error(`Expected one next-step panel: ${path}`)
  if (html.indexOf('data-public-next-step="true"') > html.indexOf('<footer class="sk-footer"')) throw new Error(`Next-step panel is below footer: ${path}`)
  const expectedRobots = official && path !== '/search' ? 'index,follow' : 'noindex,nofollow'
  if (!html.includes(`<meta name="robots" content="${expectedRobots}"`)) throw new Error(`Wrong robots meta: ${path}`)
  if (expectedRobots === 'index,follow' && !html.includes(`href="${origin}${path}"`)) throw new Error(`Wrong canonical: ${path}`)
  if (expectedRobots === 'index,follow' && !sitemap.includes(`<loc>${origin}${path}</loc>`)) throw new Error(`Missing from sitemap: ${path}`)
  if (!official && sitemap.includes(`<loc>${origin}${path}</loc>`)) throw new Error(`Prelaunch sitemap exposes ${path}`)
  if (render(path).length < 200) throw new Error(`SSR returned too little content: ${path}`)
}
const missingPageQuote = render('/a-page-that-does-not-exist').match(/<p class="sk-page-hero-quote">([^<]+)<span/)?.[1]?.trim()
if (!missingPageQuote || heroQuotes.has(missingPageQuote.toLocaleLowerCase('en'))) throw new Error('Not-found page needs its own hero quote')
console.log(`Verified ${paths.length} prerendered routes, metadata, robots and sitemap (${official ? 'official' : 'prelaunch'})`)
