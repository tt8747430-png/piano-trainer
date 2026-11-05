// Shoots each saved reference page at a phone and a laptop size, the screen and the whole page.
import { chromium } from '@playwright/test'
const [dir, out] = process.argv.slice(2)
const pages = (process.env.PAGES || 'musescore,songscription,warren').split(',')
const sizes = { phone: { width: 402, height: 874, mobile: true }, laptop: { width: 1710, height: 904, mobile: false } }
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
for (const name of pages) {
  for (const [s, v] of Object.entries(sizes)) {
    const c = await b.newContext({ javaScriptEnabled: process.env.NOJS !== '1', viewport: { width: v.width, height: v.height }, isMobile: v.mobile, hasTouch: v.mobile })
    const p = await c.newPage()
    await p.goto(`file://${dir}/${name}.html`, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch((e) => console.log(name, e.message))
    await p.waitForTimeout(4000)
    await p.screenshot({ path: `${out}/${name}-${s}.png` })
    await p.screenshot({ path: `${out}/${name}-${s}-full.png`, fullPage: true }).catch(() => {})
    await c.close()
  }
}
await b.close()
