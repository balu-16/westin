import { test, expect } from '@playwright/test'
import { createHomeModel, safePublicUrl } from '../src/public/home-model'
import { entry, isolateThirdParties, ready } from './helpers'

test.beforeEach(async ({ page }) => isolateThirdParties(page))

test('published page copy complements the richer learning and campus sections', async ({ page }) => {
  await page.route('**/api/public/site', (route) => route.fulfill({ json: { settings: {}, entries: [
    entry('page', 'programs', { title: 'Published study choices', summary: 'A reviewed study introduction.', body: 'A reviewed programme announcement.' }),
    entry('page', 'campus', { title: 'Published campus title', body: 'A reviewed campus announcement.' }),
    entry('page', 'campus-infrastructure', { title: 'Published learning spaces', body: 'A reviewed facilities announcement.' }),
  ] } }))
  for (const [route, title, body, selector, count] of [
    ['/programs', 'Published study choices', 'A reviewed programme announcement.', '#learning-methods .ed-learning-card', 6],
    ['/campus', 'Published campus title', 'A reviewed campus announcement.', '.sk-club-grid > li', 6],
    ['/campus/infrastructure', 'Published learning spaces', 'A reviewed facilities announcement.', '.ed-learning-grid--spaces article', 4],
  ] as const) {
    await page.goto(route)
    await expect(page.locator('h1')).toHaveText(title)
    await expect(page.getByText(body, { exact: true })).toBeVisible()
    await expect(page.locator(selector)).toHaveCount(count)
  }
})

test('learning and campus content remains available when the publishing API fails', async ({ page }) => {
  await page.route('**/api/public/site', (route) => route.fulfill({ status: 503, json: { message: 'Unavailable' } }))
  for (const [route, selector, count] of [
    ['/programs', '#learning-methods .ed-learning-card', 6],
    ['/campus', '.ed-learning-grid--support article', 3],
    ['/campus/infrastructure', '.ed-learning-grid--spaces article', 4],
  ] as const) {
    await page.goto(route)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator(selector)).toHaveCount(count)
  }
})

test('published destinations keep the expanded About page and omit source credits', async ({ page }) => {
  await page.route('**/api/public/site', (route) => route.fulfill({ json: { settings: {}, entries: [
    entry('page', 'about', { title: 'About our college', body: 'An approved college announcement.' }),
  ] } }))
  for (const route of ['/about', '/programs', '/campus', '/placements', '/admissions', '/contact', '/about/management']) {
    await page.goto(route)
    await expect(page.getByText(/Original Westin|Original course record|Original admissions page|Westin source|From Westin.s published material|^Source$/i)).toHaveCount(0)
    if (route === '/about') {
      await expect(page.locator('#about-history')).toContainText('Established in 1999')
      await expect(page.locator('.ed-administration-card')).toHaveCount(3)
    }
  }
})

test('the illustrated Home renders even when the publishing API is unavailable', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => { if (request.url().includes('/api/public/site')) requests.push(request.url()) })
  await page.route('**/api/public/site', (route) => route.fulfill({ status: 503, json: { message: 'Unavailable' } }))
  await page.goto('/')
  await ready(page)
  await expect(page.locator('.ed-home > section')).toHaveCount(6)
  await expect(page.locator('[data-public-next-step]')).toHaveCount(1)
  await expect(page.locator('.ed-hero-image')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Explore programs' }).first()).toBeVisible()
  expect(requests.length).toBeGreaterThan(0)
})

test('published Home text updates inside the same illustrated composition', async ({ page }) => {
  await page.route('**/api/public/site', (route) => route.fulfill({ json: { settings: {}, entries: [
    entry('homepage-section', 'hero', { title: 'A published new beginning.', summary: 'A new approved introduction.' }),
    entry('news', 'campus-update', { title: 'A reviewed campus update', summary: 'New college news.' }),
  ] } }))
  await page.goto('/')
  await expect(page.locator('#skybook-title')).toHaveText('A published new beginning.')
  await expect(page.getByText('A new approved introduction.')).toBeVisible()
  await expect(page.getByText('A reviewed campus update')).toBeVisible()
  await expect(page.locator('.ed-hero-image')).toBeVisible()
  await expect(page.locator('.ed-path-card')).toHaveCount(3)
})

test('published course copy updates the course page while official details remain available', async ({ page }) => {
  await page.route('**/api/public/site', (route) => route.fulfill({ json: { settings: {}, entries: [
    entry('program', 'bba', { title: 'Published BBA title', summary: 'Published BBA summary', body: 'A college update to the course.' }),
  ] } }))
  await page.goto('/programs/bba')
  await expect(page.locator('.sk-page-hero h1')).toHaveText('Published BBA title')
  await expect(page.getByText('A college update to the course.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Course details' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Original course record/ })).toHaveCount(0)
  await expect(page.getByRole('complementary').getByRole('link', { name: 'Ask about this course' })).toHaveAttribute('href', '/admissions#visit')
})

test('published course copy also updates the redesigned program index', async ({ page }) => {
  await page.route('**/api/public/site', (route) => route.fulfill({ json: { settings: {}, entries: [
    entry('program', 'bba', { title: 'Published BBA title', summary: 'Published BBA summary' }),
  ] } }))
  await page.goto('/programs')
  const bba = page.locator('.ed-program-card').filter({ has: page.locator('a[href="/programs/bba"]') })
  await expect(bba.getByRole('heading', { name: 'Published BBA title' })).toBeVisible()
  await expect(bba.getByText('Published BBA summary')).toBeVisible()
  await expect(page.locator('.ed-program-card')).toHaveCount(10)
})

test('published placements copy updates the overview and keeps reporting context', async ({ page }) => {
  await page.route('**/api/public/site', (route) => route.fulfill({ json: { settings: {}, entries: [
    entry('page', 'placements', { title: 'Published career title', summary: 'Published career summary', body: 'A reviewed career update.' }),
  ] } }))
  await page.goto('/placements')
  await expect(page.locator('.sk-page-hero h1')).toHaveText('Published career title')
  await expect(page.locator('.sk-page-hero-summary')).toHaveText('Published career summary')
  await expect(page.getByText('A reviewed career update.')).toBeVisible()
  await expect(page.locator('.ed-placement-caveat')).toContainText('no reporting period or campus breakdown')
  await expect(page.locator('.ed-placement-caveat a')).toHaveCount(0)
  await expect(page.locator('.sk-history-list article')).toHaveCount(5)
  await expect(page.locator('.ed-alumni-preview')).toHaveCount(3)
})

test('published Career Planner copy supplements its recruitment and preparation sections', async ({ page }) => {
  await page.route('**/api/public/site', (route) => route.fulfill({ json: { settings: {}, entries: [
    entry('page', 'career-planner', { title: 'Published career guidance', summary: 'A reviewed recruitment introduction.', body: 'A reviewed career announcement.' }),
  ] } }))
  await page.goto('/career-planner')
  await expect(page.locator('h1')).toHaveText('Published career guidance')
  await expect(page.getByText('A reviewed career announcement.', { exact: true })).toBeVisible()
  await expect(page.locator('#career-services .ed-learning-card')).toHaveCount(6)
  await expect(page.locator('#career-screening article')).toHaveCount(4)
})

test('career and enquiry pages retain their information when publishing is unavailable', async ({ page }) => {
  await page.route('**/api/public/site', (route) => route.fulfill({ status: 503, json: { message: 'Unavailable' } }))
  for (const [route, selector, count] of [
    ['/placements', '.sk-history-list article', 5],
    ['/admissions', '.ed-eligibility-row', 10],
    ['/contact', '.sk-counselling-form', 1],
    ['/career-planner', '#career-services .ed-learning-card', 6],
  ] as const) {
    await page.goto(route)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator(selector)).toHaveCount(count)
  }
})

test('published records supplement the sourced news archive', async ({ page }) => {
  await page.route('**/api/public/site', (route) => route.fulfill({ json: { settings: {}, entries: [
    entry('news', 'awards', { title: 'Westin awards and achievements', summary: 'A revised college update.' }),
    entry('news', 'new-update', { title: 'New college update', summary: 'A newly published item.' }),
  ] } }))
  await page.goto('/news')
  await expect(page.getByRole('heading', { name: 'Westin awards and achievements' })).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'New college update' })).toBeVisible()
})

test('untrusted published text cannot run markup or create unsafe links', async ({ page }) => {
  await page.route('**/api/public/site', (route) => route.fulfill({ json: { settings: {}, entries: [
    entry('program', 'bba', { title: '<img src=x onerror=alert(1)>', summary: 'Updated course' }),
  ] } }))
  const dialogs: string[] = []
  page.on('dialog', (dialog) => { dialogs.push(dialog.message()); void dialog.dismiss() })
  await page.goto('/programs/bba')
  await expect(page.locator('.sk-page-hero h1')).toContainText('<img src=x onerror=alert(1)>')
  await expect(page.locator('img[src="x"], a[href^="javascript:"]')).toHaveCount(0)
  expect(dialogs).toEqual([])
})

test('home model rejects unsafe optional content', () => {
  const model = createHomeModel({ settings: {}, entries: [
    entry('testimonial', 'incomplete', { title: 'Missing quote and name' }),
    entry('news', 'valid-news', { title: 'Safe title', summary: ['not text'], date: 'not a date' }),
  ] })
  expect(model.voice).toBeUndefined()
  expect(model.stories[0].summary).toBe('')
  expect(model.stories[0].date).toBeUndefined()
  for (const url of ['javascript:alert(1)', '//bad.test/a', '/\\bad.test', 'data:text/html,hi', 'https://u:p@bad.test/a']) expect(safePublicUrl(url)).toBeUndefined()
  expect(safePublicUrl('/images/a.webp')).toBe('/images/a.webp')
})
