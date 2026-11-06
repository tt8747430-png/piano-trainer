import { chromium } from '@playwright/test'
import { settle } from '../../.claude/skills/owner-way/scripts/settle.mjs'

// Songscription's views without the piano roll: Score only, then each score layout (Page, Infinite width,
// Infinite height) and Larger; laptop and phone, each shot once the page has fully loaded.
const URL = 'https://www.songscription.ai/scores/d9f74aad-7004-45aa-9216-886e031ef9e9'
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy })
const tap = async (page, locator) => {
  try {
    await locator.first().click({ timeout: 3000 })
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {})
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
  for (let round = 0; round < 6; round += 1) if (!(await tap(page, page.getByText(/^skip tour$/i)))) break
  await tap(page, page.getByRole('button', { name: 'Close', exact: true }))
  const shot = async (name) => {
    await settle(page, { timeout: 20000 })
    await page.screenshot({ path: `.scratch/r33/ref/songscription-view-${name}-${size}.png` })
    console.log(size, name)
  }
  // On a phone the view's controls sit under ⋯ (More); on a laptop in the score's corner pill.
  const view = async (name) =>
    (await tap(page, page.getByRole('radio', { name, exact: true }))) ||
    (await tap(page, page.getByRole('button', { name, exact: true }))) ||
    ((await tap(page, page.getByRole('button', { name: /^(more|menu)$/i }))) &&
      ((await tap(page, page.getByRole('menuitemradio', { name, exact: true }))) ||
        (await tap(page, page.getByRole('radio', { name, exact: true }))) ||
        (await tap(page, page.getByRole('button', { name, exact: true }))) ||
        (await tap(page, page.getByText(name, { exact: true })))))
  console.log(size, 'score only', await view('Score only'))
  await page.keyboard.press('Escape')
  await shot('score-only')
  for (const layout of ['Page', 'Infinite width', 'Infinite height']) {
    const done = await view(layout)
    await page.keyboard.press('Escape')
    if (done) await shot(layout.toLowerCase().replace(/ /g, '-'))
    else console.log(size, 'no', layout)
  }
  if (await view('Larger')) await shot('larger')
  await page.close()
}
await browser.close()
