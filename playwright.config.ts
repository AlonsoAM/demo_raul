import { defineConfig, devices } from '@playwright/test'

const PUERTO = 5173
const URL_BASE = `http://localhost:${PUERTO}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run dev -- --port ${PUERTO} --strictPort`,
    url: URL_BASE,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: URL_BASE,
    // Local: navegador visible y con ritmo humano; CI: headless sin retardo.
    headless: !!process.env.CI,
    launchOptions: { slowMo: process.env.CI ? 0 : 250 },
  },
})
