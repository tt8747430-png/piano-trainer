import { chromium } from '@playwright/test'
import { settle } from '../../.claude/skills/owner-way/scripts/settle.mjs'

// Which of Songscription's view controls are visible, their roles and pressed states; then what the bar's
// Keyboard button opens. Laptop, once fully loaded, the onboarding dismissed.
const URL = 'https://www.songscription.ai/scores/d9f74aad-7004-45aa-9216-886e031ef9e9'
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
await settle(page, { timeout: 45000 })
for (let round = 0; round < 6; round += 1) {
  try {
    await page.getByText(/^skip tour$/i).first().click({ timeout: 3000 })
    await settle(page, { timeout: 15000 })
  } catch {
    break
  }
}
const visible = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('button, [role="button"], [role="menuitemradio"], [role="switch"], [role="tab"], [role="radio"]')]
      .filter((element) => {
        const box = element.getBoundingClientRect()
        return box.width > 0 && box.height > 0 && getComputedStyle(element).visibility !== 'hidden'
      })
      .map((element) => {
        const name = element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 40) || ''
        const state = element.getAttribute('aria-pressed') ?? element.getAttribute('aria-checked') ?? element.getAttribute('aria-expanded') ?? ''
        const box = element.getBoundingClientRect()
        return `${element.getAttribute('role') || element.tagName.toLowerCase()} "${name}" ${state} @${Math.round(box.x)},${Math.round(box.y)}`
      }),
  )
console.log('VISIBLE:\n' + (await visible()).join('\n'))
await page.getByRole('button', { name: 'Keyboard', exact: true }).first().click({ timeout: 5000 })
await settle(page, { timeout: 15000 })
await page.screenshot({ path: '.scratch/r33/ref/songscription-keyboard-menu-laptop.png' })
console.log('AFTER KEYBOARD:\n' + (await visible()).join('\n'))
await browser.close()
