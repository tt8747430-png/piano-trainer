// Shoots each figure of a mockup: node .scratch/r32/mock-figs.mjs <file> <outDir> <width> [theme]
import { chromium } from '@playwright/test'

const [file, out, w, theme = 'light'] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const p = await b.newPage({ viewport: { width: +w, height: 1000 }, colorScheme: theme })
const errs = []
p.on('pageerror', (e) => errs.push(e.message))
await p.goto('file://' + file)
await p.waitForTimeout(1500)
const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)
const figs = await p.$$('figure')
for (const [i, f] of figs.entries())
  await f.screenshot({ path: `${out}/${theme}-${w}-fig-${String(i).padStart(2, '0')}.png` })
console.log('errors', errs, 'overflow', over, 'figures', figs.length)
await b.close()
