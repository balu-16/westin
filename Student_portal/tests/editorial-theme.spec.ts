import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { isolateThirdParties } from './helpers'

test.beforeEach(async ({ page }) => isolateThirdParties(page))

const mainRoutes = ['/', '/about', '/programs', '/campus', '/placements', '/admissions', '/contact']

test('six main destinations show official source sections before FAQs and the next step', async ({ page }) => {
  for (const route of mainRoutes.slice(1)) {
    await page.goto(route)
    const source = page.locator('[data-official-content]')
    await expect(source, route).toHaveCount(1)
    await expect(source.locator('.ed-source-heading h2')).toBeVisible()
    await expect(source.locator('.ed-source-card').first()).toBeVisible()
    await expect(page.locator('.ed-longform')).toHaveCount(0)
    await expect(page.locator('.ed-faq')).toHaveCount(1)
    expect(await page.evaluate(() => {
      const source = document.querySelector('[data-official-content]')
      const faq = document.querySelector('.ed-faq')
      const next = document.querySelector('[data-public-next-step]')
      return !!source && !!faq && !!next && !!(source.compareDocumentPosition(faq) & Node.DOCUMENT_POSITION_FOLLOWING) && !!(faq.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING)
    }), route).toBe(true)
  }
})

test('each main page has one four-question FAQ that works from the keyboard', async ({ page }) => {
  for (const route of mainRoutes) {
    await page.goto(route)
    const faq = page.locator('.ed-faq')
    await expect(faq).toHaveCount(1)
    await expect(faq.locator('details')).toHaveCount(4)
    const first = faq.locator('details').first()
    const summary = first.locator('summary')
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(first).toHaveAttribute('open', '')
    await expect(first.locator('.ed-faq-answer a')).toHaveAttribute('href', /\S+/)
    await page.keyboard.press('Enter')
    await expect(first).not.toHaveAttribute('open')
  }
  await page.goto('/programs/food-production')
  await expect(page.locator('.ed-faq')).toHaveCount(0)
})

test('the official logo, legacy mark, and one underlined hero quote are visible', async ({ page }) => {
  await page.goto('/')
  const logo = page.locator('.sk-header .sk-brand img')
  await expect(logo).toBeVisible()
  expect(await logo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  await expect(page.locator('.ed-legacy-mark')).toContainText('25 years of legacy')
  await expect(page.locator('.ed-legacy-mark img')).toBeVisible()
  await expect(page.locator('.ed-hero-hand')).toHaveCount(1)
  for (const route of ['/about', '/programs/food-production', '/campus', '/placements', '/admissions', '/contact']) {
    await page.goto(route)
    const quote = page.locator('.sk-page-hero-quote')
    await expect(quote, route).toHaveText(/Good people\s*make great places/)
    expect(await quote.evaluate((node) => getComputedStyle(node.querySelector('span')!).backgroundColor), route).toBe('rgb(241, 106, 44)')
  }
})

test('image led cards use contextual notes and the Home photo shades', async ({ page }) => {
  const notes = [
    ['/about', ['Guidance helps us grow.']],
    ['/campus', ['Confidence comes from doing.', 'Find your people.']],
    ['/programs', ['Ideas into action.', 'Care is a craft.', 'Start with possibility.']],
    ['/placements', ['Practice opens doors.']],
    ['/admissions', ['Find your direction.']],
    ['/why-westin', ['Purpose in practice.']],
    ['/gallery', ['Every moment tells a story.']],
    ['/success-stories', ['Effort deserves its moment.']],
  ] as const
  for (const [route, lines] of notes) {
    await page.goto(route)
    for (const line of lines) {
      const note = page.locator('.ed-card-note').filter({ hasText: line })
      await expect(note, route).toBeVisible()
      expect(await note.locator('span').evaluate((node) => getComputedStyle(node).backgroundColor)).toBe('rgb(241, 106, 44)')
    }
  }
  await page.goto('/about')
  const left = page.locator('.sk-about-official .ed-photo-frame--left')
  const bottom = page.locator('.ed-bento-grid .ed-photo-frame--bottom').first()
  for (const frame of [left, bottom]) {
    await expect(frame.locator('img')).toBeVisible()
    expect(await frame.evaluate((node) => getComputedStyle(node, '::after').backgroundImage)).toContain('linear-gradient')
  }
})

test('photo collection captions fit their cards on desktop and phone', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/gallery', '/campus/events', '/success-stories']) {
      await page.goto(route)
      const frame = page.locator('.sk-gallery-grid .ed-photo-frame, .sk-event-grid .ed-photo-frame, .sk-success-grid .ed-photo-frame').first()
      await expect(frame).toBeVisible()
      await expect(frame.locator('.ed-photo-frame-caption')).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} at ${width}px`).toBe(true)
      expect(await frame.evaluate((node) => {
        const frameBounds = node.getBoundingClientRect()
        const caption = node.querySelector('.ed-photo-frame-caption')?.getBoundingClientRect()
        return !!caption && caption.left >= frameBounds.left && caption.right <= frameBounds.right && caption.top >= frameBounds.top && caption.bottom <= frameBounds.bottom
      }), `${route} at ${width}px`).toBe(true)
    }
  }
})

test('campus life has one blue panel before the footer with its explore links', async ({ page }) => {
  await page.goto('/campus')
  await expect(page.locator('.ed-destination-links')).toHaveCount(0)
  const panel = page.locator('[data-public-next-step]')
  await expect(panel).toHaveCount(1)
  for (const [label, href] of [['Learning spaces', '/campus/infrastructure'], ['Campus events', '/campus/events'], ['Official gallery', '/gallery']] as const) {
    await expect(panel.getByRole('link', { name: label })).toHaveAttribute('href', href)
  }
  expect(await panel.evaluate((node) => node.parentElement?.nextElementSibling?.tagName)).toBe('FOOTER')
})

test('food production eligibility is unboxed and step 5 follows it', async ({ page }) => {
  await page.goto('/programs/food-production')
  await page.locator('.sk-route-programmes .sk-programme summary').click()
  const lastStage = page.locator('.sk-route-programmes .sk-timeline--after-eligibility li')
  await expect(lastStage).toContainText('Step 5')
  await expect(lastStage).toContainText('Final internship')
  const positions = await page.evaluate(() => {
    const list = document.querySelector('.sk-route-programmes .sk-eligibility')!
    const stage = document.querySelector('.sk-route-programmes .sk-timeline--after-eligibility li')!
    const entry = list.querySelector('div')!
    return { eligibilityBottom: list.getBoundingClientRect().bottom, stageTop: stage.getBoundingClientRect().top, background: getComputedStyle(entry).backgroundColor }
  })
  expect(positions.stageTop).toBeGreaterThan(positions.eligibilityBottom)
  expect(positions.background).toBe('rgba(0, 0, 0, 0)')
})

test('official course FAQs use Westin wording and a right aligned plus', async ({ page }) => {
  await page.goto('/programs/hotel-management')
  const faq = page.locator('.sk-route-questions')
  await expect(faq.getByText('Original Westin answers')).toHaveCount(0)
  const duration = faq.locator('details').filter({ hasText: 'What is the duration of the BHM course?' })
  await duration.locator('summary').click()
  await expect(duration).toContainText('The BHM program at Westin College is a 4-year undergraduate course')
  const summary = faq.locator('summary').first()
  expect(await summary.evaluate((node) => ({ display: getComputedStyle(node).display, plus: getComputedStyle(node, '::after').content }))).toEqual({ display: 'flex', plus: '"+"' })
})

test('detail, collection, search and missing pages use photos and the warm theme', async ({ page }) => {
  for (const route of ['/programs/food-production', '/about/mission-vision', '/news', '/gallery', '/search', '/a-page-that-does-not-exist']) {
    await page.goto(route)
    await expect(page.locator('.sk-editorial-site')).toHaveCount(1)
    const hero = page.locator('.sk-page-hero-photo img')
    await expect(hero).toHaveCount(1)
    expect(await hero.evaluate(async (image: HTMLImageElement) => { await image.decode(); return image.naturalWidth > 0 })).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true)
  }
  await page.goto('/news')
  const articleLink = page.locator('main a[href^="/news/"]').first()
  await expect(articleLink).toBeVisible()
  await articleLink.click()
  await expect(page.locator('.sk-page-hero-photo img')).toHaveCount(1)
  await expect(page.locator('.sk-editorial-site')).toHaveCount(1)
})

test('course stages form cards and larger company logos retain their controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/programs/food-production')
  const stage = page.locator('#food-production .sk-timeline li').first()
  await stage.scrollIntoViewIfNeeded()
  await expect(stage).toBeVisible()
  expect(await stage.evaluate((node) => getComputedStyle(node).borderRadius)).toBe('20px')
  await page.goto('/placements')
  const logo = page.locator('.sk-company-row .sk-company-set:first-child .sk-company-card').first()
  const size = await logo.evaluate((node) => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height }))
  expect(size).toEqual({ width: 210, height: 120 })
  await expect(page.getByRole('button', { name: 'Pause company marquees' })).toBeVisible()
  await page.getByRole('button', { name: 'Pause company marquees' }).click()
  await expect(page.locator('.sk-official-highlights')).toHaveAttribute('data-paused', 'true')
  await page.setViewportSize({ width: 390, height: 844 })
  const mobileSize = await logo.evaluate((node) => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height }))
  expect(mobileSize).toEqual({ width: 168, height: 98 })
})

test('detail, search and missing pages meet automated WCAG checks', async ({ page }) => {
  for (const route of ['/programs/food-production', '/search', '/a-page-that-does-not-exist']) {
    await page.goto(route)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(results.violations, route).toEqual([])
  }
})
