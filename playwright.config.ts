import { defineConfig, devices } from '@playwright/test'

/**
 * The end-to-end checks (`npm run e2e`): the production build, served by `vite preview`, driven in a real
 * browser at a phone's and a laptop's size. `PLAYWRIGHT_CHROMIUM` names a Chromium already installed
 * (a container's); otherwise Playwright's own (`npx playwright install chromium`).
 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'], browserName: 'chromium' } },
    {
      name: 'laptop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
})
