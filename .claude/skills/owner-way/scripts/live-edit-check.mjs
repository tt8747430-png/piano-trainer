// One copy of a shared sheet open: a change saved elsewhere should appear in it without a reload.
import { chromium } from 'playwright'
import { settle, clearOnboarding } from './settle.mjs'
const [base, link, out] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } })
const page = await (await browser.newContext({ viewport: { width: 402, height: 874 } })).newPage()
await page.goto(`${base}/practice/chord-player?link=${link}`)
await settle(page); await clearOnboarding(page)
await page.waitForFunction(() => document.body.innerText.includes('Live check'), null, { timeout: 20000 })
console.log('READY', Date.now())
const t0 = Date.now()
await page.waitForFunction(() => document.body.innerText.includes('Bridge'), null, { timeout: 60000 })
  .then(() => console.log('took the change after', Date.now() - t0, 'ms'))
  .catch(() => console.log('change never arrived'))
await page.screenshot({ path: `${out}/live-edit.png` })
await browser.close()
