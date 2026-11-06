import { chromium } from '@playwright/test'
import { clearOnboarding, settle } from '../../.claude/skills/owner-way/scripts/settle.mjs'
// felipefialho's piano, fully loaded: light and dark, laptop and phone, and one key held down.
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy })
for (const [size, width, height] of [['laptop', 1440, 900], ['phone', 402, 874]])
  for (const scheme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width, height }, colorScheme: scheme })
    await page.goto('https://piano.felipefialho.com', { waitUntil: 'domcontentloaded', timeout: 60000 })
    await settle(page, { timeout: 30000 }); await clearOnboarding(page); await settle(page, { timeout: 10000 })
    if (size === 'laptop' && scheme === 'light') { await page.keyboard.down('v'); await page.waitForTimeout(150) }
    await page.screenshot({ path: `.scratch/r34/ref/ffpiano-${size}-${scheme}.png` })
    await page.close()
  }
await browser.close()
