import { chromium } from '@playwright/test'
import { settle } from '../../.claude/skills/owner-way/scripts/settle.mjs'

// Songscription after its onboarding: the tour skipped and the banners closed, then the keyboard as it floats,
// each shot only once the page has fully loaded and settled; laptop and phone.
const URL = 'https://www.songscription.ai/scores/d9f74aad-7004-45aa-9216-886e031ef9e9'
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy })
const tap = async (page, locator) => {
  try {
    await locator.first().click({ timeout: 4000 })
    return true
  } catch {
    return false
  }
}
for (const [size, width, height] of [
  ['laptop', 1440, 900],
  ['phone', 402, 874],
]) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await settle(page, { timeout: 45000 })
  // The onboarding: the tour's every step skipped, the sign-up banner closed, any other dialog dismissed.
  for (let round = 0; round < 6; round += 1) {
    const moved =
      (await tap(page, page.getByRole('button', { name: /skip tour/i }))) ||
      (await tap(page, page.getByText(/^skip tour$/i))) ||
      (await tap(page, page.getByRole('button', { name: /^(close|dismiss|got it|ok)$/i })))
    if (!moved) break
    await settle(page, { timeout: 20000 })
  }
  await page.keyboard.press('Escape')
  await settle(page, { timeout: 20000 })
  await page.screenshot({ path: `.scratch/r33/ref/songscription-clean-${size}.png` })
  // What the keyboard offers: the buttons and labels near it, to find how it floats, docks or resizes.
  const near = await page.evaluate(() =>
    [...document.querySelectorAll('button, [role="button"], [aria-label]')]
      .map((element) => element.getAttribute('aria-label') || element.textContent?.trim() || '')
      .filter((label) => label && label.length < 60),
  )
  console.log(size, [...new Set(near)].join(' | '))
  for (const name of [/piano roll/i, /keyboard/i, /piano/i]) {
    if (await tap(page, page.getByRole('button', { name }))) {
      await settle(page, { timeout: 20000 })
      await page.screenshot({ path: `.scratch/r33/ref/songscription-keys-${size}.png` })
      console.log(size, 'opened', String(name))
      break
    }
  }
  await page.close()
}
await browser.close()
