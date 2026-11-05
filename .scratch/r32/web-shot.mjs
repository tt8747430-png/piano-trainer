// Shoots live web pianos at a laptop size to see how they draw the keys and pedals.
import { chromium } from '@playwright/test'
const [out, ...urls] = process.argv.slice(2)
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy, args: ['--ignore-certificate-errors-spki-list'] })
for (const url of urls) {
  const name = new URL(url).hostname.replace(/^www\./, '') + new URL(url).pathname.replace(/\W+/g, '-')
  for (const [s, w, h, m] of [['laptop', 1710, 904, false], ['phone', 402, 874, true]]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: m, hasTouch: m, ignoreHTTPSErrors: true })
    const p = await c.newPage()
    try {
      await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
      await p.waitForTimeout(5000)
      await p.screenshot({ path: `${out}/${name}-${s}.png` })
      console.log('ok', name, s)
    } catch (e) { console.log('fail', url, e.message.split('\n')[0]) }
    await c.close()
  }
}
await b.close()
