import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { isolateThirdParties } from './helpers'

test.beforeEach(async ({ page }) => isolateThirdParties(page))

const routes = [
  { path: '/about', photo: 'about-hero', cards: 6 },
  { path: '/programs', photo: 'hm-learning', cards: 10 },
  { path: '/campus', photo: 'campus-culture', cards: 4 },
] as const

for (const width of [320, 390, 768, 1440, 1920]) {
  test(`redesigned destinations fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const route of routes) {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      await page.goto(route.path)
      await expect(page.locator('.sk-page-hero h1')).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator('.sk-editorial-site')).toHaveCount(1)
      await expect(page.locator('.sk-page-hero-art')).toHaveCount(0)
      const hero = page.locator('.sk-page-hero-photo img')
      await expect(hero).toHaveAttribute('src', new RegExp(`${route.photo}-960\\.webp$`))
      expect(await hero.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
      await expect(page.locator('.ed-bento-card, .ed-program-card')).toHaveCount(route.cards)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route.path).toBe(true)
      expect(errors, route.path).toEqual([])
    }
  })
}

test('all course cards lead to a distinct detail route', async ({ page }) => {
  await page.goto('/programs')
  const links = await page.locator('.ed-program-card-links > a:first-child').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')))
  expect(links).toHaveLength(10)
  expect(new Set(links).size).toBe(10)
  expect(links.every((href) => href?.startsWith('/programs/'))).toBe(true)
  await page.getByRole('link', { name: 'Explore course' }).first().click()
  await expect(page).toHaveURL(/\/programs\/bba$/)
})

test('longer official material is visible without opening a disclosure', async ({ page }) => {
  for (const [path, heading] of [['/about', '#about-title'], ['/programs', '#campaign-title'], ['/campus', '#campus-title']] as const) {
    await page.goto(path)
    await expect(page.locator('.ed-longform')).toHaveCount(0)
    await expect(page.locator('[data-official-content]')).toHaveCount(1)
    await expect(page.locator(heading)).toBeVisible()
  }
})

test('school campaigns and campus activities are fully visible in the new grids', async ({ page }) => {
  await page.goto('/programs')
  const campaigns = page.locator('[data-official-content="programs"]')
  await expect(campaigns.locator('.sk-campaign-group li')).toHaveCount(16)
  await expect(campaigns.locator('.sk-campaign-group .sk-photo img')).toHaveCount(13)
  await expect(campaigns.locator('.sk-campaign-group ul').first()).toHaveCSS('overflow-x', 'visible')
  await page.goto('/campus')
  const campus = page.locator('[data-official-content="campus"]')
  await expect(campus.locator('.sk-junior-life li')).toHaveCount(6)
  await expect(campus.getByRole('button', { name: /junior college activities/i })).toHaveCount(0)
})

test('source cards lift on hover and respect reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/about')
  const card = page.locator('[data-official-content="about"] .sk-founder-quote.ed-source-card')
  await card.evaluate((node) => node.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await card.hover({ position: { x: 24, y: 24 } })
  expect(await card.evaluate((node) => node.style.getPropertyValue('--pointer-x'))).not.toBe('')
  await expect.poll(() => card.evaluate((node) => getComputedStyle(node).transform)).not.toBe('none')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(card).toHaveCSS('transform', 'none')
})

test('pointer response is subtle and respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/about')
  const card = page.locator('.ed-bento-card').first()
  await card.hover({ position: { x: 20, y: 20 } })
  expect(await card.evaluate((node) => node.style.getPropertyValue('--pointer-x'))).not.toBe('')
  await expect.poll(() => card.evaluate((node) => getComputedStyle(node).transform)).not.toBe('none')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await card.hover({ position: { x: 30, y: 30 } })
  expect(await card.evaluate((node) => getComputedStyle(node).transform)).toBe('none')
})

for (const width of [390, 1440]) {
  test(`redesigned destinations meet automated WCAG checks at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const route of routes) {
      await page.goto(route.path)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      expect(results.violations, route.path).toEqual([])
    }
  })
}
