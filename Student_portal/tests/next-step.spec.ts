import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { isolateThirdParties } from './helpers'

test.beforeEach(async ({ page }) => isolateThirdParties(page))

const cases = [
  { route: '/', heading: 'Your next chapter starts here.', actions: [['Explore programs', '/programs'], ['Plan a visit', '/admissions#visit']] },
  { route: '/about', heading: 'Get to know Westin. Find your place here.', actions: [['Explore programs', '/programs'], ['Plan a visit', '/admissions#visit']] },
  { route: '/why-westin', heading: 'Get to know Westin. Find your place here.', actions: [['Explore programs', '/programs'], ['Plan a visit', '/admissions#visit']] },
  { route: '/partners/bineid', heading: 'Get to know Westin. Find your place here.', actions: [['Explore programs', '/programs'], ['Plan a visit', '/admissions#visit']] },
  { route: '/programs', heading: 'Found a direction that feels like yours?', actions: [['Ask about a course', '/contact'], ['Plan a visit', '/admissions#visit']] },
  { route: '/programs/bba', heading: 'Make your next move in business.', actions: [['Ask about this course', '/contact'], ['Plan a visit', '/admissions#visit']] },
  { route: '/programs/food-production', heading: 'Take your next step in hospitality.', actions: [['Ask about this course', '/contact'], ['Plan a visit', '/admissions#visit']] },
  { route: '/programs/intermediate', heading: 'Build a strong start in junior college.', actions: [['Ask about this course', '/contact'], ['Plan a visit', '/admissions#visit']] },
  { route: '/campus/events', heading: 'See life at Westin for yourself.', actions: [['Plan a visit', '/admissions#visit'], ['Explore programs', '/programs']] },
  { route: '/gallery/gallery-learning', heading: 'See life at Westin for yourself.', actions: [['Plan a visit', '/admissions#visit'], ['Explore programs', '/programs']] },
  { route: '/placements', heading: 'Prepare for the possibilities ahead.', actions: [['Explore programs', '/programs'], ['Talk to the team', '/contact']] },
  { route: '/success-stories/sudharshan', heading: 'Prepare for the possibilities ahead.', actions: [['Explore programs', '/programs'], ['Talk to the team', '/contact']] },
  { route: '/admissions', heading: 'Let’s talk about your next step.', actions: [['Contact admissions', '/contact'], ['Compare programs', '/programs']] },
  { route: '/news/westin-students-uae-bahrain', heading: 'Take your curiosity further.', actions: [['Explore programs', '/programs'], ['Contact Westin', '/contact']] },
  { route: '/publishing-house', heading: 'Take your curiosity further.', actions: [['Explore programs', '/programs'], ['Contact Westin', '/contact']] },
  { route: '/search', heading: 'Still finding your way?', actions: [['Browse programs', '/programs'], ['Ask Westin', '/contact']] },
  { route: '/a-page-that-does-not-exist', heading: 'Let’s get you back on track.', actions: [['Go home', '/'], ['Search the site', '/search']] },
] as const

test('public pages show one contextual panel immediately before the footer', async ({ page }) => {
  for (const { route, heading, actions } of cases) {
    await page.goto(route)
    const panel = page.locator('[data-public-next-step]')
    await expect(panel, route).toHaveCount(1)
    await expect(panel.getByRole('heading', { name: heading })).toBeVisible()
    await expect(panel.locator('.ed-next-step-description')).not.toBeEmpty()
    await expect(panel.getByRole('link')).toHaveCount(2)
    for (const [name, href] of actions) await expect(panel.getByRole('link', { name })).toHaveAttribute('href', href)
    expect(await page.evaluate(() => {
      const panel = document.querySelector('[data-public-next-step]')
      return panel?.parentElement?.tagName === 'MAIN' && panel.nextElementSibling === null && panel.parentElement.nextElementSibling?.tagName === 'FOOTER'
    }), route).toBe(true)
  }
})

test('contact panel uses stored directions and the visit action reaches its anchor', async ({ page }) => {
  await page.goto('/contact')
  const directions = page.locator('[data-public-next-step]').getByRole('link', { name: /Get directions/ })
  await expect(directions).toHaveAttribute('href', /google\.com\/maps\/search/)
  await expect(directions).toHaveAttribute('target', '_blank')
  await page.locator('[data-public-next-step]').getByRole('link', { name: 'Plan a visit' }).click()
  await expect(page).toHaveURL(/\/admissions#visit$/)
  await expect(page.locator('#visit')).toBeInViewport()
})

for (const width of [320, 390, 768, 1440, 1920]) {
  test(`next-step panel fits ${width}px pages and keeps both actions usable`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/', '/programs/intermediate', '/news', '/a-page-that-does-not-exist']) {
      await page.goto(route)
      const panel = page.locator('[data-public-next-step]')
      await panel.scrollIntoViewIfNeeded()
      await expect(panel).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true)
      const bounds = await panel.boundingBox()
      expect(bounds, route).not.toBeNull()
      expect(bounds!.x, route).toBeGreaterThanOrEqual(0)
      expect(bounds!.x + bounds!.width, route).toBeLessThanOrEqual(width + 1)
      for (const action of await panel.getByRole('link').all()) await expect(action).toBeVisible()
    }
  })
}

test('panel actions have keyboard focus and no decorative motion when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const primary = page.locator('[data-public-next-step] .ed-next-step-action--primary')
  const secondary = page.locator('[data-public-next-step] .ed-next-step-action--secondary')
  await primary.focus()
  await page.keyboard.press('Tab')
  await expect(secondary).toBeFocused()
  expect(await secondary.evaluate((node) => getComputedStyle(node).outlineStyle)).toBe('solid')
  expect(await secondary.evaluate((node) => getComputedStyle(node).transitionDuration)).toBe('0s')
})

test('the panel keeps WCAG contrast and control semantics on mobile and desktop', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/', '/contact', '/a-page-that-does-not-exist']) {
      await page.goto(route)
      const results = await new AxeBuilder({ page }).include('[data-public-next-step]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      expect(results.violations, `${route} at ${width}px`).toEqual([])
    }
  }
})
