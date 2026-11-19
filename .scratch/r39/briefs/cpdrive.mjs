// Drives the Chord player's layout states and shoots each (R76 port's passes).
// node cpdrive.mjs <base> <outdir> <seed.json> <scenario> [sizes]
import { readFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright'

const [base, out, seedFile, scenario, sizesArg] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const seed = JSON.parse(readFileSync(seedFile, 'utf8'))
const SIZES = [
  { name: '402', width: 402, height: 874, touch: true, insets: { top: 62, bottom: 34 } },
  { name: '393', width: 393, height: 852, touch: true, insets: { top: 59, bottom: 34 } },
  { name: '1710', width: 1710, height: 904, touch: false },
].filter((s) => !sizesArg || sizesArg.split(',').includes(s.name))
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
for (const size of SIZES) {
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: 2,
    hasTouch: size.touch,
    isMobile: size.touch,
    colorScheme: 'light',
    locale: 'en-GB',
  })
  await context.addInitScript((saved) => {
    for (const [key, value] of Object.entries(saved))
      if (!localStorage.getItem(key)) localStorage.setItem(key, value)
    Object.defineProperty(navigator, 'standalone', { get: () => true })
  }, seed)
  const page = await context.newPage()
  if (size.insets) {
    const cdp = await context.newCDPSession(page)
    await cdp.send('Emulation.setSafeAreaInsetsOverride', {
      insets: { top: 0, bottom: 0, left: 0, right: 0, ...size.insets },
    })
  }
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
  let n = 0
  const shot = async (name) => {
    await page.waitForTimeout(500)
    await page.screenshot({
      path: join(out, `${scenario}-${size.name}-${String(n++).padStart(2, '0')}-${name}.png`),
    })
  }
  const tap = async (name, role = 'button') => {
    const target = page.getByRole(role, { name, exact: true }).first()
    await target
      .click({ timeout: 4000 })
      .catch((e) => console.log('NO', name, e.message.split('\n')[0]))
    await page.waitForTimeout(400)
  }
  const measure = async (js) =>
    console.log(size.name, scenario, JSON.stringify(await page.evaluate(js)))
  const S = {
    async open() {
      await page.goto(base + '/practice', { waitUntil: 'networkidle' })
      await page
        .getByRole('link', { name: /^Chord player/ })
        .first()
        .click()
      await page.waitForURL(/chord-player/)
      await page.waitForTimeout(1200)
      console.log(size.name, 'url', page.url())
    },
  }
  await S.open()
  if (scenario === 'rest') {
    await shot('rest')
    await tap('Chord sheet: My verse and chorus. Open another')
    await shot('recent-sheets')
    await page.keyboard.press('Escape')
    await tap('Chord sheet')
    await shot('more')
    await page.keyboard.press('Escape')
    await measure(
      `(() => { const q = (s) => document.querySelector(s); const box = (el) => el && (({x,y,width,height}) => ({x:Math.round(x),y:Math.round(y),w:Math.round(width),h:Math.round(height)}))(el.getBoundingClientRect()); return { title: box(q('[aria-label^="Chord sheet: "]')), titleFont: getComputedStyle(q('[aria-label^="Chord sheet: "] span')).font, dock: box(q('[role=toolbar][aria-label="Chord player"]')), keys: box(q('[data-slot=docked]')) } })()`,
    )
  }
  if (scenario === 'edit') {
    await tap('Chord sheet')
    await tap('Edit layout', 'menuitem')
    console.log(size.name, 'url', page.url())
    await shot('edit')
    await measure(
      `(() => { const box = (el) => el && (({x,y,width,height}) => ({x:Math.round(x),y:Math.round(y),w:Math.round(width),h:Math.round(height)}))(el.getBoundingClientRect()); const g = document.querySelector('[aria-label="Move Keys"]').parentElement; const cs = getComputedStyle(g); return { tag: box(g), radius: cs.borderRadius, outline: getComputedStyle(document.querySelector('[aria-label="Move Keys"]').parentElement.previousElementSibling).outline } })()`,
    )
    await tap('Genos: place, size or hide')
    await shot('genos-menu')
    await page.keyboard.press('Escape')
    await tap('Move Genos')
    await shot('genos-picked')
    await tap('Put it here: At the top')
    await shot('genos-top')
    // drag the keys to the top by their grip
    const grip = page.getByRole('button', { name: 'Move Keys', exact: true })
    const b = await grip.boundingBox()
    if (b) {
      await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2)
      await page.mouse.down()
      await page.mouse.move(b.x + 60, b.y - 200, { steps: 8 })
      await page.mouse.move(size.width / 2, 180, { steps: 8 })
      await shot('keys-dragging')
      await page.mouse.up()
    }
    await shot('keys-dropped')
    await tap('Controls: place, size or hide')
    await tap('Hide', 'button')
    await shot('controls-hidden-tray')
    await tap('Show Controls')
    await tap('Reset')
    await shot('reset')
    await tap('Done')
    await shot('done')
  }
  if (scenario === 'genos') {
    await shot('genos-compact')
    await tap('Full')
    await shot('genos-full')
    await tap('Minimize')
    await shot('genos-minimized')
  }
  if (scenario === 'hidden') {
    await shot('custom')
    await tap('Chord sheet')
    await tap('Edit layout', 'menuitem')
    await shot('custom-edit-tray')
  }
  if (scenario === 'settings') {
    await page.goto(base + '/practice/chord-player/settings?sheet=sheet-1', {
      waitUntil: 'networkidle',
    })
    await page.waitForTimeout(800)
    await shot('settings-top')
    await page.mouse.wheel(0, 2000)
    await shot('settings-end')
    await page.goto(base + '/settings/general', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    await shot('general')
    await page.goto(base + '/settings/general/layouts', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    await shot('layouts')
    await tap('Reset Chord player’s layout')
    await shot('layouts-reset-toast')
  }
  await context.close()
}
await browser.close()
