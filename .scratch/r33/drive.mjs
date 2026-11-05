// Drives the R33 piano in a real Chromium: the Space pedal, the latch's light, the Piano sheet, and the Player
// after playing (nothing left down).   node .scratch/r33/drive.mjs <base-url> <out-dir>
import { chromium } from '@playwright/test'

const [base, out] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 1710, height: 904 }, deviceScaleFactor: 2 })
// A returning learner: no Welcome over the page.
await page.addInitScript(() =>
  localStorage.setItem('pt-settings', JSON.stringify({ state: { welcomed: true }, version: 32 })),
)
page.on('pageerror', (e) => console.log('PAGE ERROR', e.message))
await page.goto(`${base}/practice/chord-finder`, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(2500)
const sustain = page.getByRole('button', { name: /^Sustain pedal/ })
await page.mouse.click(5, 300)
await page.keyboard.down('Space')
console.log('Space down: sustain pressed =', await sustain.getAttribute('aria-pressed'))
await page.keyboard.up('Space')
console.log('Space up: sustain pressed =', await sustain.getAttribute('aria-pressed'))
await sustain.click()
await page.waitForTimeout(200)
console.log(
  'tapped: latched light =',
  await page.locator('[data-slot=pedal-latch]').count(),
  'pressed =',
  await sustain.getAttribute('aria-pressed'),
)
await page.locator('[data-slot=key-rail]').screenshot({ path: `${out}/rail-latched.png` })
await sustain.click()
await page.waitForTimeout(200)
console.log(
  'tapped again: latched light =',
  await page.locator('[data-slot=pedal-latch]').count(),
  'pressed =',
  await sustain.getAttribute('aria-pressed'),
)
// A chord held by three fingers: down and lit, then let go.
const keys = ['C4', 'E4', 'G4'].map((name) => page.getByRole('button', { name, exact: true }))
const box = await keys[0].boundingBox()
await page.mouse.move(box.x + box.width / 2, box.y + box.height - 20)
await page.mouse.down()
await page.waitForTimeout(150)
await page.locator('[data-slot=keys-scroller]').screenshot({ path: `${out}/key-down.png` })
await page.mouse.up()
await page.getByRole('button', { name: 'Piano settings' }).click()
await page.waitForTimeout(700)
console.log('sheet open:', await page.getByRole('dialog', { name: 'Piano' }).isVisible())
await page.screenshot({ path: `${out}/sheet-laptop.png` })
await page.keyboard.press('Escape')
await page.goto(`${base}/play/hot-cross-buns`, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(3000)
await page.getByRole('button', { name: 'Play', exact: true }).click()
await page.waitForTimeout(3000)
await page
  .getByRole('button', { name: /^(Pause|Stop)$/ })
  .first()
  .click()
await page.waitForTimeout(800)
console.log(
  'after playing: keys down =',
  await page.locator('[data-slot=keys-scroller] [data-down]').count(),
)
await browser.close()
