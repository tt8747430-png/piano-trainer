import { chromium } from '@playwright/test'
const [svg, out, w, h] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 3 })
await p.goto('file://' + svg); await p.waitForTimeout(500)
await p.screenshot({ path: out, omitBackground: true })
await b.close()
