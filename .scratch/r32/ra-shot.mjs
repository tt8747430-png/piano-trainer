// Starts recursivearts' Virtual Piano and shoots it, to see its Sustain control.
import { chromium } from '@playwright/test'
const out = process.argv[2]
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY } })
const c = await b.newContext({ viewport: { width: 1710, height: 904 }, ignoreHTTPSErrors: true })
const p = await c.newPage()
await p.goto('https://recursivearts.com/virtual-piano/', { waitUntil: 'domcontentloaded', timeout: 30000 })
await p.waitForTimeout(3000)
await p.mouse.click(855, 390)
await p.waitForTimeout(6000)
await p.screenshot({ path: `${out}/recursivearts-started.png` })
await b.close()
