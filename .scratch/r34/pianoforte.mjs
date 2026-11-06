import { chromium } from '@playwright/test'
import { clearOnboarding, settle } from '../../.claude/skills/owner-way/scripts/settle.mjs'
// Piano Forte's places, fully loaded, greetings dismissed: laptop (dark and light) and phone (dark).
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy })
const tabs = ['Today', 'Songs', 'Read', 'Scales', 'Theory', 'Technique', 'Progress']
for (const [size, width, height, scheme] of [['laptop', 1440, 900, 'dark'], ['laptop', 1440, 900, 'light'], ['phone', 402, 874, 'dark']]) {
  const page = await browser.newPage({ viewport: { width, height }, colorScheme: scheme })
  await page.goto('https://pianoforte.mattkelly.io', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await settle(page, { timeout: 30000 }); console.log(size, scheme, 'dismissed', await clearOnboarding(page))
  for (const tab of size === 'laptop' && scheme === 'dark' ? tabs : ['Today', 'Songs']) {
    const ok = await page.getByRole('tab', { name: tab, exact: true }).or(page.getByRole('button', { name: tab, exact: true })).or(page.getByRole('link', { name: tab, exact: true })).first().click({ timeout: 4000 }).then(() => true, () => false)
    await settle(page, { timeout: 15000 }); await clearOnboarding(page)
    await page.screenshot({ path: `.scratch/r34/ref/pianoforte-${tab.toLowerCase()}-${size}-${scheme}.png` })
    console.log(size, scheme, tab, ok)
  }
  if (size === 'laptop' && scheme === 'dark') {
    await page.getByRole('button', { name: 'Songs', exact: true }).or(page.getByRole('tab', { name: 'Songs' })).first().click().catch(() => {})
    await settle(page, { timeout: 10000 })
    const opened = await page.locator('[class*=song] button, [class*=row] button, li button').first().click({ timeout: 4000 }).then(() => true, () => false)
    await settle(page, { timeout: 20000 }); await clearOnboarding(page)
    await page.screenshot({ path: `.scratch/r34/ref/pianoforte-piece-${size}-${scheme}.png` }); console.log('piece', opened)
  }
  await page.close()
}
await browser.close()
