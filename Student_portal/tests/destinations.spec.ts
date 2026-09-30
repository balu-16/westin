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
      if (route.path === '/about') {
        const profiles = page.locator('.ed-administration-card')
        await expect(profiles).toHaveCount(3)
        for (const profile of await profiles.all()) {
          await profile.scrollIntoViewIfNeeded()
          await expect.poll(() => profile.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
        }
        expect(await page.locator('.ed-bento-card, .ed-administration-card').evaluateAll((cards) => cards.every((card) => {
          const lastParagraph = card.querySelector('p:last-of-type')
          return !lastParagraph || lastParagraph.getBoundingClientRect().bottom <= card.getBoundingClientRect().bottom
        })), `About copy is not clipped at ${width}px`).toBe(true)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route.path).toBe(true)
      expect(errors, route.path).toEqual([])
    }
  })
}

test('About combines a complete introduction with the Vijayawada team', async ({ page }) => {
  await page.goto('/about')
  await expect(page.locator('#about-history')).toContainText('Established in 1999')
  await expect(page.locator('.ed-bento-grid')).toContainText('Student support and career preparation')
  await expect(page.locator('.ed-bento-grid')).not.toContainText('Earlier site highlights')
  const administration = page.locator('.ed-administration')
  await expect(administration).toContainText('K. Durga Prasad')
  await expect(administration).toContainText('Founder & Director')
  await expect(administration).toContainText('P. Chandra Shekar')
  await expect(administration).toContainText('Principal, Vijayawada')
  await expect(administration).toContainText('Sailaja Kasaraneni')
  await expect(page.locator('.sk-about-official, .sk-founder')).toHaveCount(0)
  await page.locator('.ed-faq summary').first().click()
  await page.locator('.ed-faq-answer a').first().click()
  await expect(page).toHaveURL(/\/about#about-history$/)
  await expect(page.locator('#about-history')).toBeInViewport()
})

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
  for (const [path, heading] of [['/about', '#about-title'], ['/programs', '#official-content-programs'], ['/campus', '#campus-title']] as const) {
    await page.goto(path)
    await expect(page.locator('.ed-longform')).toHaveCount(0)
    await expect(page.locator('[data-official-content]')).toHaveCount(1)
    await expect(page.locator(heading)).toBeVisible()
  }
})

test('practical learning replaces campaigns and campus support is consolidated', async ({ page }) => {
  await page.goto('/programs')
  const learning = page.locator('#learning-methods')
  await expect(learning.locator('.ed-learning-card')).toHaveCount(6)
  await expect(learning.locator('img')).toHaveCount(3)
  await expect(page.locator('.sk-campaign-group')).toHaveCount(0)
  for (const title of ['Internships and workplace learning', 'Specialist certifications', 'Workshops that build skills', 'Live cases and business practicals', 'Guest lectures and industry visits', 'Study tours, events and competitions']) {
    await expect(learning.getByRole('heading', { name: title, exact: true })).toBeVisible()
  }
  await page.goto('/campus')
  const campus = page.locator('[data-official-content="campus"]')
  await expect(campus.locator('.ed-learning-grid--support article')).toHaveCount(3)
  await expect(campus.locator('.ed-moment-card')).toHaveCount(3)
  await expect(campus.locator('.sk-junior-life, .sk-campus-official')).toHaveCount(0)
  await expect(campus.getByText('Parent involvement in intermediate counselling')).toBeVisible()
  await expect(campus.getByRole('button', { name: /junior college activities/i })).toHaveCount(0)
})

test('section navigation and campus event previews lead to their intended content', async ({ page }) => {
  for (const route of ['/programs', '/campus']) {
    await page.goto(route)
    const navigation = page.locator('.ed-section-nav')
    const hrefs = await navigation.locator('a').evaluateAll((links) => links.map((link) => link.getAttribute('href')!))
    for (const href of hrefs) {
      await navigation.locator(`a[href="${href}"]`).click()
      await expect(page.locator(href)).toBeInViewport()
    }
  }
  await page.goto('/campus')
  const moments = page.locator('.ed-moment-card')
  await expect(moments.nth(0)).toContainText('2024')
  await expect(moments.nth(1)).toContainText('2024')
  await expect(moments.nth(2)).toContainText('Campus gallery')
  for (const card of await moments.all()) {
    await card.scrollIntoViewIfNeeded()
    await expect.poll(() => card.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  }
  await moments.first().getByRole('link').click()
  await expect(page).toHaveURL(/\/campus\/events\/sparkles-2024$/)
})

test('linked learning pages fit small screens and retain current course structures', async ({ page }) => {
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/campus/infrastructure', '/programs/bba', '/programs/bhm-three-year', '/programs/intermediate']) {
      await page.goto(route)
      await expect(page.locator('h1')).toBeVisible()
      const cards = page.locator('.ed-learning-card')
      await expect(cards).toHaveCount(route === '/campus/infrastructure' ? 4 : 3)
      expect(await cards.evaluateAll((nodes) => nodes.every((node) => {
        const paragraph = node.querySelector('p')!
        const bounds = paragraph.getBoundingClientRect()
        const card = node.getBoundingClientRect()
        return bounds.right <= card.right && bounds.bottom <= card.bottom
      })), `${route} copy at ${width}px`).toBe(true)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} at ${width}px`).toBe(true)
    }
  }
  await page.goto('/programs/bba')
  await page.locator('.sk-programme summary').click()
  await expect(page.locator('.sk-programme-body')).toContainText('A three-month internship')
  await expect(page.locator('.sk-programme-body')).not.toContainText('Four months')
  await page.goto('/programs/intermediate')
  await expect(page.locator('.ed-course-learning')).toContainText('Parent involvement')
  await expect(page.getByRole('heading', { name: 'Program Objectives', exact: true })).toHaveCount(0)
  await page.goto('/campus/infrastructure')
  for (const card of await page.locator('.ed-learning-card--photo').all()) {
    await card.scrollIntoViewIfNeeded()
    await expect.poll(() => card.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
  }
  await expect(page.getByRole('link', { name: 'Plan a visit', exact: true }).first()).toHaveAttribute('href', '/admissions#visit')
})

test('learning spaces meet automated WCAG checks on phone and desktop', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/campus/infrastructure')
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(results.violations).toEqual([])
  }
})

test('administration cards lift on hover and respect reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/about')
  const card = page.locator('[data-official-content="about"] .ed-administration-card').first()
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

test('pointer light fades out at the exit edge without flashing in the center', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/about')
  const card = page.locator('.ed-bento-card').first()
  await card.hover({ position: { x: 24, y: 24 } })
  await expect.poll(() => card.evaluate((node) => getComputedStyle(node, '::before').opacity)).toBe('1')

  const bounds = await card.boundingBox()
  expect(bounds).not.toBeNull()
  await page.mouse.move(bounds!.x - 4, bounds!.y + 24)

  const light = await card.evaluate((node) => {
    const style = getComputedStyle(node, '::before')
    return { background: style.backgroundImage, opacity: Number(style.opacity), hovered: node.matches(':hover') }
  })
  expect(light.hovered).toBe(false)
  expect(light.opacity).toBeGreaterThan(0)
  expect(light.background).toContain(' at ')
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
