// Two real builds: serve A, open it, put B in its place, then look and install as the learner does.
import { cpSync, rmSync } from 'node:fs'
import { readFileSync } from 'node:fs'
import { chromium } from '@playwright/test'
const [serveDir, buildB, port] = process.argv.slice(2)
const v = Number(/SETTINGS_VERSION = (\d+)/.exec(readFileSync('src/entities/settings/model/store.ts','utf8'))?.[1])
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const c = await b.newContext({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true })
await c.addInitScript((v)=>{ if(!localStorage.getItem('pt-settings')) localStorage.setItem('pt-settings', JSON.stringify({state:{welcomed:true},version:v}))}, v)
const p = await c.newPage()
p.on('console', m => { if (m.type() === 'error') console.log('console', m.text()) })
const url = `http://localhost:${port}/settings`
await p.goto(url)
await p.waitForFunction(async () => (await navigator.serviceWorker.getRegistration())?.active?.state === 'activated', null, { timeout: 120000 })
console.log('A active; controlled:', await p.evaluate(() => !!navigator.serviceWorker.controller))
for (let i = 0; i < 6 && !(await p.evaluate(() => !!navigator.serviceWorker.controller)); i++) { await p.goto(url); await p.waitForTimeout(1500) }
console.log('controlled after reload:', await p.evaluate(() => !!navigator.serviceWorker.controller))
const before = await p.evaluate(() => document.querySelector('script[type=module]')?.getAttribute('src'))
for (const f of ['index.html','sw.js']) rmSync(`${serveDir}/${f}`, { force: true })
cpSync(buildB, serveDir, { recursive: true })
if (process.env.SLOW) {
  const cdp = await c.newCDPSession(p)
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 40000, uploadThroughput: 40000 })
}
const t0 = Date.now()
await p.getByRole('button', { name: /^Version/ }).click()
for (const ms of [500, 3000]) { await p.waitForTimeout(ms); console.log('row after', ms, await p.getByRole('button', { name: /^Version/ }).textContent()) }
await p.getByRole('button', { name: /Install|Update/ }).first().waitFor({ timeout: 120000 })
console.log('found in', Date.now() - t0, 'ms; rows:', await p.getByRole('button').allTextContents().then(a => a.filter(x => /Version|Install|Update/.test(x))))
const t1 = Date.now()
const nav = p.waitForEvent('load', { timeout: 60000 }).then(() => 'reloaded', () => 'NO RELOAD (hang)')
await p.getByRole('button', { name: /Install|Update/ }).first().click()
console.log(await nav, Date.now() - t1, 'ms')
await p.waitForTimeout(1500)
const after = await p.evaluate(() => document.querySelector('script[type=module]')?.getAttribute('src'))
console.log('before', before, 'after', after)
await b.close()
