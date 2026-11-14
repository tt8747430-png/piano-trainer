// Two copies of one shared chord sheet: one plays, the other should light the same chord; one saves, the other takes it.
import { chromium } from 'playwright'
import { settle, clearOnboarding } from './settle.mjs'
const [base, link, out] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'], proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } })
const open = async () => {
  const ctx = await browser.newContext({ viewport: { width: 402, height: 874 } })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log('pageerror', e.message))
  page.on('requestfailed', (r) => console.log('failed', r.url().slice(0, 90), r.failure()?.errorText))
  page.on('console', (m) => m.type() === 'error' && console.log('console', m.text().slice(0, 160)))
  await page.goto(`${base}/practice/chord-player?link=${link}`)
  await settle(page); await clearOnboarding(page)
  await page.waitForFunction(() => document.body.innerText.includes('Live check'), null, { timeout: 20000 }).catch(async () => { console.log('NOT OPENED', page.url(), (await page.innerText('body')).slice(0, 300).replace(/\n/g, ' / ')); await page.screenshot({ path: `${out}/notopened.png` }); process.exit(1) })
  await page.waitForTimeout(2500)
  return page
}
const a = await open(); const b = await open()
console.log('A url', a.url().replace(base, ''), 'B url', b.url().replace(base, ''))
console.log('B live mark', await b.getByText('Live', { exact: true }).count())
await a.locator('button[aria-label="Play"]').last().click()
const seen = []
for (let i = 0; i < 8; i++) {
  await a.waitForTimeout(500)
  const la = await a.locator('[aria-current="true"]').first().textContent().catch(() => null)
  const lb = await b.locator('[aria-current="true"]').first().textContent().catch(() => null)
  seen.push(`${la}|${lb}`)
}
console.log('A|B lit over 4s:', seen.join('  '))
await b.screenshot({ path: `${out}/live-b-playing.png` })
await a.locator('button[aria-label="Stop"]').last().click().catch(() => console.log('no Stop button'))
await a.waitForTimeout(1500)
console.log('B lit after stop:', await b.locator('[aria-current="true"]').count())
await browser.close()
