import { chromium } from '@playwright/test'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const c = await b.newContext()
c.on('serviceworker', (w) => { console.log('sw', w.url()); w.on('console', (m) => console.log('SWLOG', m.text())) })
const p = await c.newPage()
await p.goto('http://localhost:5193/')
await p.waitForFunction(async () => (await navigator.serviceWorker.getRegistration())?.active?.state === 'activated', null, { timeout: 120000 })
for (const u of ['/', '/songs', '/']) { await p.goto('http://localhost:5193' + u); await p.waitForTimeout(1500); console.log(u, await p.evaluate(() => [!!navigator.serviceWorker.controller, performance.getEntriesByType('navigation')[0].workerStart])) }
await b.close()
