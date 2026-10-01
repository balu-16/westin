import { expect, test, type Page } from '@playwright/test'
import { readFile, readdir } from 'node:fs/promises'

test('production CSS keeps Safari 15 media queries and viewport fallbacks', async () => {
  const assets = new URL('../dist/assets/', import.meta.url)
  const files = (await readdir(assets)).filter((name) => name.endsWith('.css'))
  expect(files.length).toBeGreaterThan(0)
  const styles = await Promise.all(files.map((name) => readFile(new URL(name, assets), 'utf8')))
  for (const css of styles) {
    for (const query of css.matchAll(/@media\s*([^{}]+)/g)) {
      expect(query[1], 'Safari 15 cannot parse range media queries').not.toMatch(/[<>]/)
    }
  }
  const login = styles.find((css) => css.includes('.login-page-shell'))!
  expect(login).toContain('--login-vh:1vh')
  expect(login).toMatch(/@supports\s*\(height:\s*100dvh\)/)
  expect(login).toMatch(/@supports\s*\(overflow:\s*clip\)/)
})

async function expectReachable(page: Page, selector: string) {
  const control = page.locator(selector)
  await control.scrollIntoViewIfNeeded()
  await expect(control).toBeInViewport()
  const hit = await control.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    const target = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
    return {
      left: rect.left,
      right: rect.right,
      width: innerWidth,
      clickable: target === element || element.contains(target),
    }
  })
  expect(hit.left).toBeGreaterThanOrEqual(0)
  expect(hit.right).toBeLessThanOrEqual(hit.width)
  expect(hit.clickable, `${selector} must not be clipped or covered`).toBe(true)
}

for (const fallback of [false, true]) {
  test.describe(fallback ? 'older Safari feature simulation' : 'modern browser', () => {
    test.beforeEach(async ({ page }) => {
      // Simulate absent CSS features only; this does not substitute for a real iPhone test.
      if (fallback) {
        await page.route('**/*.css', async (route) => {
          const response = await route.fetch()
          const css = (await response.text())
            .replace(/@supports\s*\(height:\s*100dvh\)/g, '@supports (height: unsupported)')
            .replace(/@supports\s*\(overflow:\s*clip\)/g, '@supports (overflow: unsupported)')
            .replace(/@media\s*[^{}]*[<>][^{}]*\{/g, '@media not all {')
          await route.fulfill({ response, body: css })
        })
      }
      await page.route('**/api/**', (route) => route.fulfill({ status: 503, body: '{}' }))
    })

    for (const [width, height] of [[414, 628], [414, 736], [375, 559], [320, 460], [414, 300], [736, 300], [1024, 768], [1440, 900]]) {
      test(`login controls remain reachable at ${width} × ${height}`, async ({ page }) => {
        await page.setViewportSize({ width, height })
        await page.goto('/login')
        await expect(page.locator('.login-card')).toBeVisible()
        await page.evaluate(() => document.fonts.ready)
        if (fallback) {
          expect(await page.locator('.login-page-shell').evaluate((e) => getComputedStyle(e).getPropertyValue('--login-vh').trim())).toBe('1vh')
        }
        await expectReachable(page, '#email')
        await expectReachable(page, '#password')
        await expectReachable(page, 'button[type="submit"]')
        await page.locator('button[type="submit"]').click()
        await expect(page.getByRole('alert')).toContainText('Please enter')
        await expectReachable(page, 'button[type="submit"]')

        // Increased text size and validation make the form exceed short viewports.
        await page.evaluate(() => { document.documentElement.style.fontSize = '24px' })
        await expectReachable(page, '#email')
        await expectReachable(page, '#password')
        await expectReachable(page, 'button[type="submit"]')
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
      })
    }
  })
}
