// Renders the R32 Practice mockup at a phone's and a laptop's width, light and dark, and shoots each question,
// logging page errors and anything wider than its column.
//   node .scratch/r32/mockups/check.mjs <out-dir>
import { chromium } from '@playwright/test'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const out = process.argv[2]
const url = pathToFileURL(resolve('.scratch/r32/mockups/practice.html')).href
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
for (const [w, h] of [
  [1710, 1000],
  [393, 852],
]) {
  for (const theme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: theme })
    page.on('pageerror', (e) => console.log('ERROR', w, theme, e.message))
    await page.goto(url)
    await page.waitForTimeout(800)
    const wide = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
    if (wide) console.log('WIDE', w, theme)
    if (theme === 'light' || w === 1710)
      for (const id of ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10']) {
        const el = page.locator(`#${id}`)
        await el.screenshot({ path: `${out}/${id}-${w}-${theme}.png` })
      }
    await page.close()
  }
}
await browser.close()
console.log('done')
