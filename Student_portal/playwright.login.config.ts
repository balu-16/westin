import { defineConfig } from '@playwright/test'

// Test the compiled CSS: development CSS does not expose the Safari regression.
export default defineConfig({
  testDir: './tests',
  testMatch: 'login-layout.spec.ts',
  fullyParallel: true,
  workers: 3,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5196',
    browserName: 'chromium',
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 5196 --strictPort',
    url: 'http://127.0.0.1:5196',
    reuseExistingServer: false,
  },
})
