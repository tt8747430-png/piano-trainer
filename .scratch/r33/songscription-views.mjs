import { chromium } from '@playwright/test'
import { settle } from '../../.claude/skills/owner-way/scripts/settle.mjs'

// Songscription's views without the piano roll: the roll hidden, then each score view (Page, Infinite width,
// Infinite height) with the keyboard shown and hidden; laptop and phone, each shot once fully loaded.
const URL = 'https://www.songscription.ai/scores/d9f74aad-7004-45aa-9216-886e031ef9e9'
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy })
const tap = async (page, locator) => {
  try {
    await locator.first().click({ timeout: 4000 })
    await settle(page, { timeout: 20000 })
    return true
  } catch {
    return false
  }
}
const byName = (page, name) =>
  page
    .getByRole('button', { name, exact: true })
    .or(page.getByRole('menuitemradio', { name, exact: true }))
    .or(page.getByRole('menuitem', { name, exact: true }))
    .or(page.getByRole('radio', { name, exact: true }))
    .or(page.getByRole('switch', { name, exact: true }))
for (const [size, width, height] of [
  ['laptop', 1440, 900],
  ['phone', 402, 874],
]) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await settle(page, { timeout: 45000 })
  for (let round = 0; round < 6; round += 1) {
    if (!(await tap(page, page.getByText(/^skip tour$/i))) && !(await tap(page, byName(page, 'Close')))) break
  }
  await page.keyboard.press('Escape')
  await settle(page, { timeout: 20000 })
  const shot = async (name) => {
    await settle(page, { timeout: 20000 })
    await page.screenshot({ path: `.scratch/r33/ref/songscription-view-${name}-${size}.png` })
    console.log(size, name)
  }
  // The piano roll hidden: its toggle in the bar's view, else "Piano roll" as a switch.
  const hidden =
    (await tap(page, byName(page, 'Piano roll'))) || (await tap(page, byName(page, 'Hide the piano roll')))
  console.log(size, 'roll toggled', hidden)
  await shot('no-roll')
  for (const view of ['Page', 'Infinite width', 'Infinite height']) {
    if (!(await tap(page, byName(page, view)))) {
      await tap(page, byName(page, 'Score view'))
      await tap(page, byName(page, 'View'))
      if (!(await tap(page, byName(page, view)))) {
        console.log(size, 'no', view)
        continue
      }
    }
    await page.keyboard.press('Escape')
    await shot(view.toLowerCase().replace(/ /g, '-'))
  }
  // The keyboard hidden too: the score alone.
  if (await tap(page, byName(page, 'Keyboard'))) await shot('no-keyboard')
  await page.close()
}
await browser.close()
