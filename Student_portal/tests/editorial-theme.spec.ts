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

test('the official logo, legacy mark, and page-specific underlined hero quotes are visible', async ({ page }) => {
  await page.goto('/')
  const logo = page.locator('.sk-header .sk-brand img')
  await expect(logo).toBeVisible()
  expect(await logo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  await expect(page.locator('.ed-legacy-mark')).toContainText('25 years of legacy')
  await expect(page.locator('.ed-legacy-mark img')).toBeVisible()
  await expect(page.locator('.ed-hero-hand')).toHaveCount(1)
  for (const [route, line] of [
    ['/about', 'People help us grow.'],
    ['/programs/food-production', 'Good food begins with care.'],
    ['/campus', 'Belong, learn, grow.'],
    ['/placements', 'Make room for possibility.'],
    ['/admissions', 'The next chapter starts here.'],
    ['/contact', 'A conversation opens doors.'],
  ] as const) {
    await page.goto(route)
    const quote = page.locator('.sk-page-hero-quote')
    await expect(quote, route).toHaveText(line)
    await expect(page.getByText('Good people', { exact: true })).toHaveCount(0)
    expect(await quote.evaluate((node) => getComputedStyle(node.querySelector('span')!).backgroundColor), route).toBe('rgb(241, 106, 44)')
  }
})

test('image led cards keep contextual notes and only left photo shading', async ({ page }) => {
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
  const plain = page.locator('.ed-bento-grid .ed-photo-frame').first()
  for (const frame of [left, plain]) {
    await expect(frame.locator('img')).toBeVisible()
  }
  expect(await left.evaluate((node) => getComputedStyle(node, '::after').backgroundImage)).toContain('linear-gradient(90deg')
  expect(await plain.evaluate((node) => getComputedStyle(node, '::after').backgroundImage)).toBe('none')
  await expect(plain.locator('.ed-photo-frame-caption')).toHaveCount(0)
})

test('photo collection headings sit below photos on desktop and phone', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/gallery', '/campus/events', '/success-stories']) {
      await page.goto(route)
      const frame = page.locator('.sk-gallery-grid .ed-photo-frame, .sk-event-grid .ed-photo-frame, .sk-success-grid .ed-photo-frame').first()
      await expect(frame).toBeVisible()
      await expect(frame.locator('.ed-photo-frame-caption')).toHaveCount(0)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} at ${width}px`).toBe(true)
      expect(await frame.evaluate((node) => {
        const frameBounds = node.getBoundingClientRect()
        const heading = node.parentElement?.querySelector('h3, .ed-gallery-card-title')?.getBoundingClientRect()
        return !!heading && heading.top >= frameBounds.bottom && heading.right <= innerWidth
      }), `${route} at ${width}px`).toBe(true)
    }
  }
})

test('placements and admissions add real photos while BBA Honours explains all four years', async ({ page }) => {
  await page.goto('/placements')
  for (const title of ['Business internships', 'Corporate readiness']) {
    const card = page.locator('.ed-secondary-bento--placement .ed-bento-card').filter({ hasText: title })
    const image = card.locator('.ed-photo-frame img')
    await expect(image).toBeVisible()
    expect(await image.evaluate(async (node: HTMLImageElement) => { await node.decode(); return node.naturalWidth > 0 })).toBe(true)
    await expect(card.locator('.ed-photo-frame-caption')).toHaveCount(0)
  }
  await page.goto('/admissions')
  for (const title of ['Check the entry route.', 'See the place for yourself.']) {
    const card = page.locator('.ed-secondary-bento--admissions .ed-bento-card').filter({ hasText: title })
    const image = card.locator('.ed-photo-frame img')
    await expect(image).toBeVisible()
    expect(await image.evaluate(async (node: HTMLImageElement) => { await node.decode(); return node.naturalWidth > 0 })).toBe(true)
    await expect(card.locator('.ed-photo-frame-caption')).toHaveCount(0)
  }
  await page.goto('/programs')
  const honours = page.locator('.ed-program-card').filter({ hasText: 'BBA (Honours)' })
  await expect(honours.locator('.ed-photo-frame img')).toBeVisible()
  await expect(honours.locator('.ed-program-year-plan dt')).toHaveCount(4)
  await expect(page.locator('.sk-campaign-group--hospitality .ed-card-note').filter({ hasText: 'Care lives in the details.' })).toBeVisible()
  await expect(page.locator('.sk-campaign-group--hospitality .ed-card-note').filter({ hasText: 'Lead with purpose.' })).toBeVisible()
})

test('admissions choices and campus details stay readable across screen sizes', async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/admissions')
    const courses = page.locator('#admissions-2026 .ed-admissions-course-card')
    await expect(courses).toHaveCount(3)
    for (const course of await courses.all()) {
      await course.scrollIntoViewIfNeeded()
      const image = course.locator('.ed-admissions-course-photo img')
      await expect(image).toBeVisible()
      expect(await image.evaluate(async (node: HTMLImageElement) => { await node.decode(); return node.naturalWidth > 0 })).toBe(true)
      await expect(course.locator('h3')).toBeVisible()
    }
    await expect(courses.last().locator('.ed-card-note')).toContainText('A strong start opens doors.')
    await expect(page.locator('.ed-admissions-study-routes dl > div')).toHaveCount(3)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `admissions at ${width}px`).toBe(true)

    await page.goto('/campus')
    for (const title of ['Spaces for study', 'Student-led communities']) {
      const card = page.locator('.ed-bento-card').filter({ hasText: title })
      await expect(card.locator('li')).toHaveCount(3)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `campus at ${width}px`).toBe(true)
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
