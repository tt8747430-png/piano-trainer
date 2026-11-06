import { chromium } from '@playwright/test'
import { settle } from '../../.claude/skills/owner-way/scripts/settle.mjs'

// Songscription's public score page, its piano roll shown, at laptop and phone sizes; each shot only once
// the page has fully loaded.
const URL = 'https://www.songscription.ai/scores/d9f74aad-7004-45aa-9216-886e031ef9e9'
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy })
for (const [size, width, height] of [
  ['laptop', 1440, 900],
  ['phone', 402, 874],
]) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
  const late = await settle(page, { timeout: 45000 })
  console.log(size, 'loaded', late.length ? `(never settled: ${late.join(', ')})` : '')
  await page.screenshot({ path: `.scratch/r33/ref/songscription-${size}.png` })
  const roll = page.getByRole('button', { name: 'Show the piano roll' }).first()
  if (await roll.isVisible().catch(() => false)) {
    await roll.click()
    const after = await settle(page, { timeout: 30000 })
    console.log(size, 'roll', after.length ? `(never settled: ${after.join(', ')})` : '')
    await page.screenshot({ path: `.scratch/r33/ref/songscription-roll-${size}.png` })
  } else console.log(size, 'no Show the piano roll button in sight')
  await page.close()
}
await browser.close()
