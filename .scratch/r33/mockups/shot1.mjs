// Shoots each frame of one question of the R33 piano mockup at twice the pixels.
//   node .scratch/r33/mockups/shot1.mjs <out-prefix> [light|dark] [selector] [width]
import { chromium } from '@playwright/test'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const [out, theme = 'light', sel = '#s1 figure', w = 1710] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: +w, height: 1000 }, colorScheme: theme, deviceScaleFactor: 2 })
page.on('pageerror', (e) => console.log('ERR', e.message))
await page.goto(pathToFileURL(resolve('.scratch/r33/mockups/piano.html')).href)
await page.waitForTimeout(800)
const figs = page.locator(sel)
for (let i = 0; i < (await figs.count()); i++) await figs.nth(i).locator('.dev').screenshot({ path: `${out}-${i}.png` })
await browser.close()
