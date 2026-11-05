// Shoots a mockup page whole, at a width and theme, and says what broke.
//   node .scratch/r32/mock-shot.mjs <html> <png> [width] [light|dark] [clip-selector]
import { chromium } from '@playwright/test'

const [file, out, width = '1400', theme = 'light', selector] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 }, colorScheme: theme })
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
await page.goto(`file://${file}`)
await page.waitForTimeout(1500)
if (selector) await page.locator(selector).screenshot({ path: out })
else await page.screenshot({ path: out, fullPage: true })
const over = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
)
console.log('errors', JSON.stringify(errors), 'overflow', over)
await browser.close()
