import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
const [route, js, w = 402, h = 874] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, hasTouch: +w < 900 })
await ctx.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }) })
// SEED=<file.json>: saved stores the learner starts with (testing.md), each set once.
if (process.env.SEED) await ctx.addInitScript((s) => { for (const [k, v] of Object.entries(s)) if (!localStorage.getItem(k)) localStorage.setItem(k, v) }, JSON.parse(readFileSync(process.env.SEED, 'utf8')))
const p = await ctx.newPage()
if (+w < 900) { const c = await ctx.newCDPSession(p); await c.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: 62, bottom: 34, left: 0, right: 0 } }) }
await p.goto('http://localhost:5191' + route, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500)
console.log(await p.evaluate(readFileSync(js, 'utf8'))); await b.close()
