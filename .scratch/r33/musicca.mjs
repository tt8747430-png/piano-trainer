import { chromium } from '@playwright/test'

// The owner's reference: musicca.com's virtual piano, its Settings and Mark states, at laptop and phone sizes.
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy })
for (const [size, width, height] of [
  ['laptop', 1440, 1000],
  ['phone', 402, 874],
]) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto('https://www.musicca.com/piano', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(4000)
  await page.screenshot({ path: `.scratch/r33/ref/musicca-open-${size}.png` })
  await page.getByRole('button', { name: 'Settings', exact: true }).first().click()
  await page.waitForTimeout(800)
  await page.screenshot({ path: `.scratch/r33/ref/musicca-settings-${size}.png` })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: 'Mark', exact: true }).first().click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `.scratch/r33/ref/musicca-mark-${size}.png` })
  await page.close()
}
await browser.close()
