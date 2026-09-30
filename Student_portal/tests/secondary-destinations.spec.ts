import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { isolateThirdParties } from './helpers'

test.beforeEach(async ({ page }) => isolateThirdParties(page))

const routes = [
  { path: '/placements', photo: 'success-hero' },
  { path: '/admissions', photo: 'students-group' },
  { path: '/contact', photo: 'bba-journeys' },
  { path: '/career-planner', photo: 'training-mock-interviews' },
] as const

for (const width of [320, 390, 768, 1440, 1920]) {
  test(`career and enquiry pages fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const route of routes) {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      await page.goto(route.path)
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator('.sk-editorial-site')).toHaveCount(1)
      await expect(page.locator('.sk-page-hero-art')).toHaveCount(0)
      const hero = page.locator('.sk-page-hero-photo img')
      await expect(hero).toHaveAttribute('src', new RegExp(`${route.photo}-960\\.webp$`))
      expect(await hero.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route.path).toBe(true)
      const clipped = await page.locator('.ed-eligibility-row, .ed-alumni-preview, .ed-employer-preview, .ed-learning-card').evaluateAll((cards) => cards.flatMap((card) => {
        const bounds = card.getBoundingClientRect()
        return Array.from(card.querySelectorAll('p, dd, h3, h4')).filter((copy) => {
          const rect = copy.getBoundingClientRect()
          return rect.right > bounds.right + 1 || rect.left < bounds.left - 1 || rect.bottom > bounds.bottom + 1
        }).map((copy) => copy.textContent)
      }))
      expect(clipped, route.path).toEqual([])
      expect(errors, route.path).toEqual([])
    }
  })
}

test('placements show sourced figures, logo-only marquees and historical context', async ({ page }) => {
  await page.goto('/placements')
  await expect(page.locator('.ed-placement-stat')).toHaveCount(3)
  await expect(page.locator('.ed-placement-stat-grid')).toContainText('42 LPA')
  await expect(page.locator('.ed-placement-stat-grid')).toContainText('8 LPA')
  await expect(page.locator('.ed-placement-stat-grid')).toContainText('100%')
  await expect(page.locator('.ed-placement-caveat')).toContainText('no reporting period or campus breakdown')
  await expect(page.locator('.sk-company-row')).toHaveCount(2)
  await expect(page.locator('.sk-company-row .sk-company-set:first-child img')).toHaveCount(32)
  expect(await page.locator('.sk-company-row .sk-company-set:first-child img').evaluateAll(async (images) => {
    await Promise.all(images.map((image) => (image as HTMLImageElement).decode()))
    return images.every((image) => (image as HTMLImageElement).naturalWidth > 0)
  })).toBe(true)
  await expect(page.locator('.sk-company-card > span')).toHaveCount(0)
  await expect(page.locator('.sk-history-list article')).toHaveCount(5)
  await expect(page.locator('.sk-placement-history')).toHaveCount(1)
  await expect(page.locator('.sk-placement-totals, .ed-secondary-source-record')).toHaveCount(0)
  await expect(page.locator('[data-record="hyderabad-2017-18"]')).toContainText('Hyderabad campus · 2017–18')
  await expect(page.locator('[data-record="vijayawada-2018-21"]')).toContainText('103 students placed across six hotels and institutions')
  await expect(page.locator('.ed-longform')).toHaveCount(0)
  await expect(page.locator('#achievements-title')).toBeVisible()
  await expect(page.locator('.ed-unpictured-companies li')).toHaveCount(16)
})

test('marquees move, pause on command or focus, and become static for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/placements')
  const section = page.locator('.sk-official-highlights')
  const track = page.locator('.sk-company-track').first()
  await expect(track).toHaveCSS('animation-play-state', 'running')
  const initialTransform = await track.evaluate((node) => getComputedStyle(node).transform)
  await page.waitForTimeout(350)
  expect(await track.evaluate((node) => getComputedStyle(node).transform)).not.toBe(initialTransform)
  const pause = page.getByRole('button', { name: 'Pause company marquees' })
  await pause.click()
  await page.mouse.move(0, 0)
  await expect(section).toHaveAttribute('data-paused', 'true')
  await expect(track).toHaveCSS('animation-play-state', 'paused')
  await page.getByRole('button', { name: 'Play company marquees' }).click()
  await page.mouse.move(0, 0)
  await expect(track).toHaveCSS('animation-play-state', 'running')
  await page.locator('.sk-company-row').first().focus()
  await expect(track).toHaveCSS('animation-play-state', 'paused')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(track).toHaveCSS('animation-name', 'none')
  await expect(page.locator('.sk-company-set[aria-hidden="true"]').first()).toBeHidden()
})

test('admissions links and visit target work without numbered steps', async ({ page }) => {
  await page.goto('/admissions#visit')
  await expect(page.locator('#visit')).toBeInViewport()
  await expect(page.locator('.ed-secondary-bento--admissions .ed-bento-card')).toHaveCount(3)
  await expect(page.locator('.ed-secondary-bento--admissions [href="/programs/bba"]')).toHaveCount(1)
  await expect(page.locator('.ed-secondary-bento--admissions [href="/programs/hotel-management"]')).toHaveCount(1)
  await expect(page.locator('.ed-secondary-bento--admissions [href="/programs/intermediate"]')).toHaveCount(1)
  await expect(page.locator('.sk-contact-page')).toHaveCount(0)
  await expect(page.locator('.ed-longform')).toHaveCount(0)
  await expect(page.locator('#admissions-title')).toBeVisible()
  await expect(page.locator('.sk-admissions-psychometric')).toHaveCount(1)
})

test('admissions compares all ten routes with their recorded entry conditions', async ({ page }) => {
  await page.goto('/admissions')
  await expect(page.locator('.ed-eligibility-row')).toHaveCount(10)
  const expected = [
    ['bba', ['3 years', '10+2 in any stream', '50% aggregate']],
    ['bba-honours', ['4 years', '50% aggregate']],
    ['bhm-three-year', ['3 years', '50% aggregate', 'Medical fitness certificate required']],
    ['bhm-honours', ['4 years', '50% aggregate']],
    ['work-integrated-hotel-management', ['3 years', '16 to 25 years']],
    ['dhm-one-year', ['1 year', '10th pass', 'No minimum marks', '18 to 25 years']],
    ['food-production', ['10th pass, or 12th pass/fail', '16 to 25 years']],
    ['pgdhm', ['1 year', "A bachelor's degree in any discipline", 'Below 27 years']],
    ['intermediate', ['2 years', '10th in any stream', '50%']],
    ['hotel-management', ['Pathways overview', 'Varies by pathway', 'Requirements vary by route']],
  ] as const
  for (const [slug, conditions] of expected) {
    const row = page.locator(`.ed-eligibility-row[data-program="${slug}"]`)
    for (const condition of conditions) await expect(row).toContainText(condition)
    await expect(row.getByRole('link', { name: 'View course' })).toHaveAttribute('href', `/programs/${slug}`)
  }
  await page.locator('[data-program="dhm-one-year"] a').click()
  await expect(page).toHaveURL(/\/programs\/dhm-one-year$/)
  await page.locator('.sk-programme > summary').click()
  await expect(page.locator('.sk-eligibility')).toContainText('18 to 25 years')
})

test('new section navigation reaches the content on every career and enquiry page', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.path)
    const navigation = page.locator('.ed-section-nav')
    const targets = await navigation.locator('a').evaluateAll((links) => links.map((link) => link.getAttribute('href')!))
    expect(targets.length).toBeGreaterThanOrEqual(4)
    for (const target of targets) {
      await navigation.locator(`a[href="${target}"]`).click()
      await expect(page.locator(target), `${route.path}${target}`).toBeInViewport()
    }
  }
})

test('placement previews load their portraits and open the matching archive records', async ({ page }) => {
  await page.goto('/placements')
  await expect(page.locator('.ed-alumni-preview')).toHaveCount(3)
  await expect(page.locator('.ed-employer-preview')).toHaveCount(2)
  const stories = ['/success-stories/sudharshan', '/success-stories/vara-prasad', '/success-stories/indra-kiran']
  for (const [index, route] of stories.entries()) {
    const card = page.locator('.ed-alumni-preview').nth(index)
    await card.scrollIntoViewIfNeeded()
    await expect.poll(() => card.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
    await expect(card.getByRole('link', { name: 'Read the journey' })).toHaveAttribute('href', route)
  }
  await page.locator('.ed-employer-preview a').first().click()
  await expect(page).toHaveURL(/\/testimonials\/michael-wierling$/)
  await expect(page.locator('h1')).toHaveText('Michael Wierling')
  await page.goto('/news/international-hotel-placements-2017-18')
  await expect(page.getByRole('link', { name: /View the 2018 Hyderabad placement list/ })).toHaveAttribute('href', /Placements_list\.pdf$/)
})

test('Career Planner explains its service range and contact routes', async ({ page }) => {
  await page.goto('/career-planner')
  await expect(page.locator('#career-services .ed-learning-card')).toHaveCount(6)
  await expect(page.locator('#career-screening article')).toHaveCount(4)
  await expect(page.locator('#career-profile')).toContainText('operating since 2005')
  await expect(page.locator('#career-screening')).toContainText('English proficiency')
  await page.locator('#career-preparation a[href="/contact"]').click()
  await expect(page).toHaveURL(/\/contact$/)
})

test('contact exposes the full address, call links and email alongside enquiry guidance', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.locator('#contact-enquiries .ed-learning-card')).toHaveCount(3)
  await expect(page.locator('#campus-location')).toContainText('G V R Towers')
  await expect(page.locator('#campus-location')).toContainText('opposite Vinayak Theatre')
  await expect(page.locator('#campus-location')).toContainText('520008')
  await expect(page.locator('.ed-contact-phone-list a').first()).toHaveAttribute('href', 'tel:+919393755755')
  await expect(page.locator('.ed-contact-email a')).toHaveAttribute('href', 'mailto:vijayawada@westin.ac.in')
  await expect(page.locator('.ed-contact-directions')).toHaveAttribute('href', /google\.com\/maps\/search/)
  await page.locator('#campus-location').scrollIntoViewIfNeeded()
  await expect.poll(() => page.locator('#campus-location img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
})

test('contact keeps one visible counselling form and only opens a WhatsApp draft', async ({ page }) => {
  const posts: string[] = []
  page.on('request', (request) => { if (request.method() === 'POST') posts.push(request.url()) })
  await page.goto('/contact')
  await expect(page.locator('.sk-counselling-form')).toHaveCount(1)
  await expect(page.locator('#counselling-name')).toBeVisible()
  await expect(page.locator('.ed-contact-grid > *')).toHaveCount(4)
  await page.evaluate(() => {
    const testWindow = window as typeof window & { openedUrls?: string[] }
    testWindow.openedUrls = []
    window.open = ((url?: string | URL) => { testWindow.openedUrls?.push(String(url)); return null }) as typeof window.open
  })
  await page.locator('#counselling-name').fill('Test Student')
  await page.locator('#counselling-phone').fill('abc')
  expect(await page.locator('#counselling-phone').evaluate((input: HTMLInputElement) => input.checkValidity())).toBe(false)
  await page.locator('#counselling-phone').fill('+919393755755')
  await page.locator('#counselling-course').selectOption({ label: 'BBA' })
  await page.getByRole('button', { name: 'Send on WhatsApp' }).click()
  const opened = await page.evaluate(() => (window as typeof window & { openedUrls?: string[] }).openedUrls ?? [])
  expect(opened).toHaveLength(1)
  expect(opened[0]).toMatch(/^https:\/\/wa\.me\/919393755755\?text=/)
  expect(decodeURIComponent(opened[0])).toContain('BBA. My name is Test Student and my phone number is +919393755755')
  expect(posts).toEqual([])
  await expect(page.locator('.ed-longform')).toHaveCount(0)
  await expect(page.getByText('Westin offices', { exact: true })).toBeVisible()
  await expect(page.locator('.sk-counselling-form')).toHaveCount(1)
})

for (const width of [390, 1440]) {
  test(`career and enquiry pages meet automated WCAG checks at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const route of routes) {
      await page.goto(route.path)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      expect(results.violations, route.path).toEqual([])
    }
  })
}
