import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { isolateThirdParties, ready, revealAll } from './helpers'

test.beforeEach(async ({ page }) => isolateThirdParties(page))

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`editorial home works at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/')
    await ready(page)
    await revealAll(page)
    await expect(page.locator('.ed-home > section')).toHaveCount(6)
    await expect(page.locator('[data-public-next-step]')).toHaveCount(1)
    await expect(page.locator('#skybook-title')).toContainText('Bright beginnings.')
    await expect(page.locator('.ed-path-card')).toHaveCount(3)
    await expect(page.locator('.ed-story-card')).toHaveCount(2)
    await expect(page.locator('.sk-catalogue, .sk-vision, .sk-faculty, .sk-publishing')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(await page.locator('.ed-home img').evaluateAll((images) => images.every((node) => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0))).toBe(true)
    expect(errors).toEqual([])
  })
}

test('generated photographs are labelled and Home links reach the topic pages', async ({ page }) => {
  await page.goto('/')
  await ready(page)
  const illustrations = page.locator('.ed-home img[src^="/images/editorial-home/"]')
  await expect(illustrations).toHaveCount(7)
  for (const image of await illustrations.all()) await expect(image).toHaveAttribute('alt', /Illustrative generated/)
  await expect(page.locator('.ed-legacy-mark img')).toHaveAttribute('alt', '')
  await expect(page.getByText('not photographs of Westin College')).toBeVisible()
  const links = [
    ['Explore programs', '/programs'], ['Plan a visit', '/admissions#visit'],
    ['Get to know Westin', '/about'], ['See placements', '/placements'],
    ['Explore events', '/campus/events'], ['Explore news', '/news'],
  ] as const
  for (const [name, href] of links) await expect(page.getByRole('link', { name: new RegExp(name) }).first()).toHaveAttribute('href', href)
  for (const href of ['/programs/bba', '/programs/hotel-management', '/programs/intermediate']) await expect(page.locator(`.ed-path-card[href="${href}"]`)).toHaveCount(1)
})

test('long Home content lives on its own pages', async ({ page }) => {
  const destinations: Array<[string, string]> = [
    ['/about/mission-vision', '#vision-title'],
    ['/about/faculty', '#faculty-title'],
    ['/programs/intermediate', '#junior-detail-title'],
    ['/programs/food-production', '#food-title'],
    ['/placements', '#achievements-title'],
    ['/news/westin-students-uae-bahrain', '#news-title'],
    ['/publishing-house', '#publishing-title'],
    ['/admissions', '#admissions-title'],
    ['/contact', '#contact-official-title'],
  ]
  for (const [path, heading] of destinations) {
    await page.goto(path)
    await expect(page.locator(heading)).toBeVisible()
    await expect(page.getByText('That page has turned.', { exact: true })).toHaveCount(0)
  }
  await page.goto('/')
  await expect(page.locator('#vision-title, #faculty-title, #junior-detail-title, #food-title, #achievements-title, #news-title, #publishing-title, #contact-official-title')).toHaveCount(0)
})

test('mobile menu, login and visit link remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await ready(page)
  const menu = page.getByRole('button', { name: 'Open website menu' })
  await menu.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('dialog').getByRole('link', { name: 'Contact' }).click()
  await expect(page).toHaveURL(/\/contact$/)
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Student login', exact: true }).first()).toHaveAttribute('href', '/login')
  await page.getByRole('link', { name: 'Plan a visit' }).first().click()
  await expect(page).toHaveURL(/\/admissions#visit$/)
  await expect(page.locator('#visit')).toBeInViewport()
})

test('contact enquiry validates fields and opens only a WhatsApp draft', async ({ page }) => {
  const posts: string[] = []
  page.on('request', (request) => { if (request.method() === 'POST') posts.push(request.url()) })
  await page.goto('/contact')
  await expect(page.locator('#counselling-name')).toBeVisible()
  await page.locator('#counselling-name').fill('Test Student')
  await page.locator('#counselling-phone').fill('abc')
  expect(await page.locator('#counselling-phone').evaluate((input) => (input as HTMLInputElement).checkValidity())).toBe(false)
  await page.locator('#counselling-phone').fill('+919393755755')
  expect(await page.locator('#counselling-phone').evaluate((input) => (input as HTMLInputElement).checkValidity())).toBe(true)
  expect(posts).toEqual([])
})

for (const width of [390, 1440]) {
  test(`Home and moved pages meet automated WCAG checks at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/', '/about/faculty', '/programs/intermediate', '/publishing-house', '/contact']) {
      await page.goto(path)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      expect(results.violations, path).toEqual([])
    }
  })
}
