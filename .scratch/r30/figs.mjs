import { chromium } from '@playwright/test'
const [url, out, ...ids] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.goto(url); await p.waitForTimeout(400)
for (const id of ids) await p.locator(`figure[data-fb="${id}"] .dev`).screenshot({ path: `${out}/f${id}.png` })
await b.close()
