import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'
const P = new URL("./practice/project/", import.meta.url).pathname
const RT = readFileSync(process.env.RT, 'utf8')
const [file, vw, vh, steps, out] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: +vw, height: +vh }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && console.log('CONSOLE', m.type(), m.text().slice(0, 300)))
await page.route('http://canvas.local/**', (route) => {
  const u = new URL(route.request().url())
  if (u.pathname.endsWith('support.js')) return route.fulfill({ contentType: 'text/javascript', body: RT })
  if (u.pathname.endsWith('.dc.html')) return route.fulfill({ contentType: 'text/html; charset=utf-8', body: readFileSync(P + u.pathname.split('/').pop(), 'utf8') })
  return route.fulfill({ status: 404, body: '' })
})
await page.route(/^https:\/\/(?!canvas\.local)/, (r) => r.continue())
await page.goto('http://canvas.local/project/' + file + '.dc.html')
await page.waitForTimeout(2500)
let i = 0
for (const s of JSON.parse(steps)) {
  if (s.click) { const l = page.locator(s.click).first(); console.log('click', s.click, await l.count()); await l.click({ timeout: 3000 }).catch((e) => console.log('ERR', e.message.slice(0, 200))) }
  if (s.wait) await page.waitForTimeout(s.wait)
  if (s.shot) await page.screenshot({ path: out + '-' + (i++) + '.png' })
  if (s.eval) console.log(await page.evaluate(s.eval))
}
await browser.close()
