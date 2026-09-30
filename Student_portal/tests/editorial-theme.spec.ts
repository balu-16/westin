import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { isolateThirdParties } from './helpers'
import { publicSections, fixturePrograms } from '../src/public/content'

test.beforeEach(async ({ page }) => isolateThirdParties(page))

const mainRoutes = ['/', '/about', '/programs', '/campus', '/placements', '/admissions', '/contact']

test('public pages remove source credits while preserving external resources', async ({ page }) => {
  const routes = [...new Set([...mainRoutes, ...Object.keys(publicSections), ...fixturePrograms.map((program) => `/programs/${program.slug}`), '/gallery', '/campus/events', '/magazine', '/news/westin-students-uae-bahrain'])]
  for (const route of routes) {
    await page.goto(route)
    await expect(page.locator('h1'), route).toBeVisible()
    await expect(page.getByText(/Original Westin|Original course record|Original admissions page|Westin source|From Westin.s published material|Figures and their sources|View original Westin archive|Original record|^Source$/i), route).toHaveCount(0)
  }
  await page.goto('/magazine')
  await expect(page.getByRole('link', { name: /Open publication/ }).first()).toHaveAttribute('href', /^https:/)
  await page.goto('/admissions')
  await expect(page.getByRole('link', { name: 'Open Westin’s Psychometric Test' })).toHaveAttribute('href', /^https:/)
  await page.goto('/news/westin-students-uae-bahrain')
  await expect(page.getByRole('link', { name: /Read The Hindu coverage/ })).toHaveAttribute('href', /thehindu\.com/)
})

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
  const left = page.locator('.sk-page-hero-photo')
  const plain = page.locator('.ed-bento-grid .ed-photo-frame').first()
  for (const frame of [left, plain]) {
    await expect(frame.locator('img')).toBeVisible()
  }
  expect(await left.evaluate((node) => getComputedStyle(node, '::before').backgroundImage)).toContain('linear-gradient(90deg')
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
  await expect(page.locator('#learning-methods')).toContainText('Internships and workplace learning')
  await expect(page.locator('.sk-campaign-group')).toHaveCount(0)
})

test('admissions choices and campus details stay readable across screen sizes', async ({ page }) => {
  const descriptions = [
    [
      'food production, food and beverage service, front office and housekeeping',
      'Their entry requirements and training structures differ.',
      'Explore. Experience. Excel. Your global journey begins here.',
    ],
    [
      'analytics, FinTech, logistics, aviation, human resources, real estate and entrepreneurship',
      'three-year BBA or the four-year honours route',
    ],
    [
      'State Board of Intermediate Education, Andhra Pradesh',
      'Continuous counselling involving parents',
    ],
  ]
  const highlights = [
    ['Practical Training', 'Internship Support', 'Placement Assistance'],
    ['Business Knowledge', 'Industry Exposure', 'Career Guidance'],
    ['Experienced Faculty', 'Exam Preparation', 'Career Support'],
  ]
  const titles = ['Hotel Management', 'BBA', 'Junior Intermediate College']
  const photos = ['hm-service-team', 'bba-leadership', 'junior-life-2']
  for (const width of [390, 640, 768, 1100, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/admissions')
    const section = page.locator('#admissions-2026')
    const courses = section.locator('.ed-admissions-course-card')
    await expect(courses).toHaveCount(3)
    await expect(section.locator('.sk-course-highlights')).toHaveCount(0)
    for (let index = 0; index < titles.length; index++) {
      const course = courses.nth(index)
      await expect(section.getByRole('heading', { name: titles[index], exact: true })).toHaveCount(1)
      await course.scrollIntoViewIfNeeded()
      const image = course.locator('.ed-admissions-course-photo img')
      await expect(image).toBeVisible()
      await expect(image).toHaveAttribute('src', new RegExp(`/campus/${photos[index]}-`))
      expect(await image.evaluate(async (node: HTMLImageElement) => { await node.decode(); return node.naturalWidth > 0 })).toBe(true)
      await expect(course.locator('h3')).toBeVisible()
      for (const paragraph of descriptions[index]) {
        await expect(course.locator('p').filter({ hasText: paragraph })).toBeVisible()
      }
      await expect(course.locator('li')).toHaveText(highlights[index])
    }
    const layout = await courses.evaluateAll((nodes) => nodes.map((node) => ({
      card: node.getBoundingClientRect().toJSON(),
      photo: node.querySelector('.ed-admissions-course-photo')!.getBoundingClientRect().toJSON(),
      copy: node.querySelector('.ed-admissions-course-copy')!.getBoundingClientRect().toJSON(),
    })))
    for (const course of layout.slice(0, 2)) {
      expect(course.photo.bottom).toBeLessThanOrEqual(course.copy.top)
    }
    if (width < 768) {
      expect(layout[0].card.bottom).toBeLessThanOrEqual(layout[1].card.top)
      expect(layout[1].card.bottom).toBeLessThanOrEqual(layout[2].card.top)
    } else {
      expect(layout[0].card.top).toBeCloseTo(layout[1].card.top, 0)
      expect(layout[0].card.right).toBeLessThanOrEqual(layout[1].card.left)
      expect(layout[2].card.top).toBeGreaterThanOrEqual(layout[1].card.bottom)
      expect(layout[2].card.left).toBeCloseTo(layout[0].card.left, 0)
      expect(layout[2].card.right).toBeCloseTo(layout[1].card.right, 0)
    }
    if (width <= 1100) {
      expect(layout[2].photo.bottom).toBeLessThanOrEqual(layout[2].copy.top)
    } else {
      expect(layout[2].copy.right).toBeLessThanOrEqual(layout[2].photo.left)
    }
    await expect(courses.last().locator('.ed-card-note')).toContainText('A strong start opens doors.')
    await expect(page.locator('.ed-admissions-study-routes dl > div')).toHaveCount(3)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `admissions at ${width}px`).toBe(true)

    await page.goto('/campus')
    const clubs = page.locator('#life .sk-club-grid > li')
    await expect(clubs).toHaveCount(6)
    for (const title of ['Entrepreneurship Club', 'Finance & Investment Society', 'Marketing Mavericks', 'Cultural Club']) {
      const card = clubs.filter({ hasText: title })
      await card.scrollIntoViewIfNeeded()
      await expect(card.getByRole('heading', { name: title, exact: true })).toBeVisible()
      const image = card.locator('.ed-club-photo img')
      await expect(image).toBeVisible()
      await expect(image).toHaveAttribute('alt', /Westin students|Westin business students/)
      expect(await image.evaluate(async (node: HTMLImageElement) => { await node.decode(); return node.naturalWidth > 0 })).toBe(true)
    }
    await expect(clubs.filter({ hasText: 'Sports Club' })).toContainText('football, cricket, badminton, and athletics')
    await expect(clubs.filter({ hasText: 'Social Responsibility Club' })).toContainText('community service projects and awareness campaigns')
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
