import { chromium } from '@playwright/test'
const [url, out, mode, ...ids] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.addInitScript((m) => localStorage.setItem('pt-mock-size', m), mode)
await p.goto(url); await p.waitForTimeout(800)
for (const id of ids) await p.locator(`figure[data-fb="${id}"] .dev`).screenshot({ path: `${out}/f${id}-${mode}.png` })
await b.close()
