import { test, expect } from '@playwright/test'
import { createHomeModel, safePublicUrl } from '../src/public/home-model'
import { entry, isolateThirdParties, ready } from './helpers'

test.beforeEach(async ({ page }) => isolateThirdParties(page))

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
  await expect(page.getByRole('link', { name: /Original course record/ })).toHaveAttribute('href', /westincollegevijayawada/)
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

test('published placements copy updates the redesigned overview and remains sourced', async ({ page }) => {
  await page.route('**/api/public/site', (route) => route.fulfill({ json: { settings: {}, entries: [
    entry('page', 'placements', { title: 'Published career title', summary: 'Published career summary', body: 'A reviewed career update.' }),
  ] } }))
  await page.goto('/placements')
  await expect(page.locator('.sk-page-hero h1')).toHaveText('Published career title')
  await expect(page.locator('.sk-page-hero-summary')).toHaveText('Published career summary')
  await expect(page.getByText('A reviewed career update.')).toBeVisible()
  await expect(page.locator('.ed-placement-caveat a')).toHaveAttribute('href', 'https://www.westincollegevijayawada.com/')
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
