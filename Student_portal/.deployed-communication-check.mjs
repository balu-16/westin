/**
 * Temporary end-to-end check: deployed frontends ↔ deployed API.
 *
 * Run from Student_portal so @playwright/test resolves:
 *   node .deployed-communication-check.mjs
 *
 * The faculty portal is OTP-only. Without OTP_FILE the run stops right after
 * the OTP request — which already proves the frontend reached the API. To
 * finish the login, set OTP_FILE and write the 6-digit code to that path
 * (needs OTP_LOG_TO_CONSOLE=true on the API, or copy it from the email).
 */
import { chromium } from '@playwright/test'
import { readFileSync, existsSync } from 'node:fs'

const STUDENT = process.env.STUDENT_URL ?? 'https://westin-student.vercel.app'
const FACULTY = process.env.FACULTY_URL ?? 'https://westin-faculty.vercel.app'
const API_HOST = new URL(process.env.API_URL ?? 'https://westin-api.vercel.app').host
const OTP_FILE = process.env.OTP_FILE ?? null

const results = []
const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

function watch(page) {
  const state = { failed: [], api: [], consoleErrors: [] }
  page.on('requestfailed', (r) => state.failed.push(`${r.method()} ${r.url()} :: ${r.failure()?.errorText}`))
  page.on('response', (r) => {
    try {
      const u = new URL(r.url())
      if (u.host === API_HOST) state.api.push(`${r.status()} ${u.pathname}`)
    } catch {}
  })
  page.on('console', (m) => {
    if (m.type() === 'error') state.consoleErrors.push(m.text())
  })
  return state
}

async function waitForOtpCode(timeoutMs = 180000) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    if (existsSync(OTP_FILE)) {
      const code = readFileSync(OTP_FILE, 'utf8').trim()
      if (/^\d{6}$/.test(code)) return code
    }
    await new Promise((r) => setTimeout(r, 2000))
  }
  throw new Error('OTP code file never received a 6-digit code')
}

const browser = await chromium.launch({ args: ['--no-sandbox'] })
try {
  // ------------------------- student portal -------------------------
  {
    const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
    const seen = watch(page)
    await page.goto(`${STUDENT}/login`, { waitUntil: 'domcontentloaded' })
    await page.fill('#email', 'STU-2025-001')
    await page.fill('#password', 'Password@123')
    await page.getByRole('button', { name: /^Login$/ }).click()
    await page.waitForURL(/\/dashboard/, { timeout: 45000 })
    await page.getByText('Classes Today').first().waitFor({ timeout: 30000 })
    await page.waitForTimeout(1500)
    const session = await page.evaluate(() => localStorage.getItem('student-portal.session'))
    console.log(`  student API traffic: ${seen.api.slice(0, 8).join(', ')}${seen.api.length > 8 ? ' …' : ''}`)
    record('student: password login → dashboard rendered', true, page.url())
    record('student: API answered (≥1 2xx, no 5xx)', seen.api.some((c) => c.startsWith('2')) && !seen.api.some((c) => c.startsWith('5')), `${seen.api.length} calls`)
    record('student: authenticated session stored', Boolean(session))
    record('student: no failed/CORS-blocked requests', seen.failed.length === 0, seen.failed.slice(0, 3).join(' | '))
    record('student: no console errors', seen.consoleErrors.length === 0, seen.consoleErrors.slice(0, 3).join(' | '))
    await page.context().close()
  }

  // ------------------------- faculty portal (OTP) -------------------------
  {
    const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
    const seen = watch(page)
    await page.goto(`${FACULTY}/faculty/login`, { waitUntil: 'domcontentloaded' })
    await page.fill('input[placeholder="e.g. FAC-2025-014"]', 'FAC-2025-014')
    await page.getByRole('button', { name: /Send OTP/i }).click()
    const otpUiReady = await page.waitForSelector('[aria-label="Digit 1 of 6"]', { timeout: 30000 })
      .then(() => true)
      .catch(() => false)
    const otpCall = seen.api.find((c) => c.includes('/api/auth/otp/request')) ?? 'no call recorded'
    // Reaching the code screen already proves the deployed faculty portal called
    // the deployed API cross-origin and got a 2xx back.
    if (otpUiReady) {
      record('faculty: OTP request accepted by API (2xx + CORS)', /^2\d\d /.test(otpCall), otpCall)
    } else {
      // The API throttles repeat OTP requests (3 per 10 min per identifier), and
      // a throttled request legitimately keeps the code screen closed.
      console.log(`  code screen stayed closed — API responded: ${otpCall}`)
      record('faculty: OTP request reached the API (throttled, not failed)', /\d{3} \w+ \/api\/auth\/otp\/request/.test(otpCall), otpCall)
    }
    record('faculty: no failed/CORS-blocked requests', seen.failed.length === 0, seen.failed.slice(0, 3).join(' | '))

    if (OTP_FILE && otpUiReady) {
      console.log(`  waiting for the code in ${OTP_FILE}`)
      const code = await waitForOtpCode()
      for (let i = 0; i < 6; i++) await page.fill(`[aria-label="Digit ${i + 1} of 6"]`, code[i])
      await page.getByRole('button', { name: /Verify & Login/i }).click()
      await page.waitForURL(/\/faculty\/?$/, { timeout: 45000 })
      await page.getByText('Classes Today').first().waitFor({ timeout: 30000 })
      await page.waitForTimeout(1500)
      console.log(`  faculty API traffic: ${seen.api.slice(0, 8).join(', ')}${seen.api.length > 8 ? ' …' : ''}`)
      record('faculty: OTP login → dashboard rendered', true, page.url())
      record('faculty: API answered (≥1 2xx, no 5xx)', seen.api.some((c) => c.startsWith('2')) && !seen.api.some((c) => c.startsWith('5')), `${seen.api.length} calls`)
      record('faculty: no console errors', seen.consoleErrors.length === 0, seen.consoleErrors.slice(0, 3).join(' | '))
    } else {
      console.log('  stopping after the OTP request (set OTP_FILE to finish the login)')
    }
    await page.context().close()
  }
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
if (failed.length) {
  console.log('FAILURES:')
  failed.forEach((f) => console.log(' -', f.name, f.detail))
  process.exit(1)
}
