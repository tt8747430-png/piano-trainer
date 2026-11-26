// Agent A's quick look at the app: node a-app.mjs <phone|laptop> <route> <out.png> ['<steps json>']
// Steps: {"click": "<role name>"}, {"sel": "<css>"} (click), {"eval": "<js>"}, {"wait": ms}, {"shot": "<path>"}, {"scroll": y}.
import { readFileSync } from 'node:fs'
import { chromium } from '@playwright/test'

const [size, route, out, stepsJson] = process.argv.slice(2)
const phone = size === 'phone'
const version = Number(/SETTINGS_VERSION = (\d+)/.exec(readFileSync('src/entities/settings/model/store.ts', 'utf8'))?.[1])
const seed = process.env.SEED ? JSON.parse(readFileSync(process.env.SEED, 'utf8')) : {}
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const context = await browser.newContext({
  viewport: phone ? { width: 402, height: 874 } : { width: 1710, height: 904 },
  deviceScaleFactor: 1,
  hasTouch: phone,
  isMobile: phone,
  colorScheme: 'light',
  locale: 'en-GB',
})
await context.addInitScript(
  ([v, standalone, saved]) => {
    for (const [key, value] of Object.entries(saved)) if (!localStorage.getItem(key)) localStorage.setItem(key, value)
    if (!localStorage.getItem('pt-settings')) localStorage.setItem('pt-settings', JSON.stringify({ state: { welcomed: true }, version: v }))
    if (standalone) Object.defineProperty(navigator, 'standalone', { get: () => true })
  },
  [version, phone, seed],
)
const page = await context.newPage()
if (phone) {
  const cdp = await context.newCDPSession(page)
  await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: 62, bottom: 34, left: 0, right: 0 } })
}
page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
await page.goto('http://localhost:5191' + route, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
for (const s of JSON.parse(stepsJson ?? '[]')) {
  if (s.click) await page.getByRole('button', { name: s.click, exact: true }).or(page.getByRole('checkbox', { name: s.click, exact: true })).or(page.getByRole('link', { name: s.click, exact: true })).or(page.getByRole('menuitem', { name: s.click, exact: true })).or(page.getByRole('tab', { name: s.click, exact: true })).first().click({ timeout: 4000 }).catch((e) => console.log('ERR', e.message.split('\n')[0]))
  if (s.sel) await page.locator(s.sel).first().click({ timeout: 4000 }).catch((e) => console.log('ERR', e.message.split('\n')[0]))
  if (s.type) await page.keyboard.type(s.type)
  if (s.key) await page.keyboard.press(s.key)
  if (s.wait) await page.waitForTimeout(s.wait)
  if (s.scroll !== undefined) await page.evaluate((y) => { const all = [document.scrollingElement, ...document.querySelectorAll('*')].filter((el) => el && el.scrollHeight > el.clientHeight + 40 && /(auto|scroll)/.test(getComputedStyle(el).overflowY + (el === document.scrollingElement ? 'auto' : ''))); const el = all.sort((a, b) => b.clientHeight - a.clientHeight)[0]; if (el) el.scrollTop = y }, s.scroll)
  if (s.eval) console.log(JSON.stringify(await page.evaluate(s.eval)))
  if (s.shot) await page.screenshot({ path: s.shot })
  if (s.click || s.sel) await page.waitForTimeout(500)
}
await page.screenshot({ path: out })
await browser.close()
