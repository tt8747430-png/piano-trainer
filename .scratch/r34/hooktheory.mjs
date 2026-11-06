import { chromium } from '@playwright/test'
import { clearOnboarding, settle } from '../../.claude/skills/owner-way/scripts/settle.mjs'
// Hooktheory's key cheat sheet, fully loaded with banners dismissed: its sections' text and controls, laptop and phone.
const URL = 'https://www.hooktheory.com/cheat-sheet/key/c/major'
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy })
for (const [size, width, height] of [['laptop', 1440, 900], ['phone', 402, 874]]) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
  console.log(size, 'late:', (await settle(page, { timeout: 30000 })).join(','), 'dismissed:', (await clearOnboarding(page)).join(','))
  await settle(page, { timeout: 15000 })
  await page.screenshot({ path: `.scratch/r34/ref/hooktheory-${size}.png`, fullPage: true })
  if (size === 'laptop') {
    const text = await page.evaluate(() => document.querySelector('main, #content, body').innerText)
    console.log(text.replace(/\n{2,}/g, '\n').slice(0, 7000))
    const controls = await page.evaluate(() => [...document.querySelectorAll('button,[role=button],a,select,input')]
      .filter((e) => e.getBoundingClientRect().width > 0).map((e) => (e.getAttribute('aria-label') || e.title || e.innerText || e.value || '').trim().slice(0, 40)).filter(Boolean))
    console.log('CONTROLS:', [...new Set(controls)].join(' | ').slice(0, 3000))
  }
  await page.close()
}
await browser.close()
