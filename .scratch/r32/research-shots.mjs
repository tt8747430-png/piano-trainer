// Shoots reference song pages at a phone and a laptop size for songs-research.md.
// node .scratch/r32/research-shots.mjs <outDir> name=url ...
import { chromium } from '@playwright/test'

const [out, ...pairs] = process.argv.slice(2)
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy })
const sizes = [
  ['phone', { width: 402, height: 874 }, true],
  ['laptop', { width: 1710, height: 904 }, false],
]
for (const pair of pairs) {
  const at = pair.indexOf('=')
  const name = pair.slice(0, at)
  const url = pair.slice(at + 1)
  for (const [size, viewport, mobile] of sizes) {
    const context = await browser.newContext({
      viewport,
      isMobile: mobile,
      hasTouch: mobile,
      ignoreHTTPSErrors: true,
      locale: 'en-US',
      userAgent: mobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
        : undefined,
    })
    const page = await context.newPage()
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
      await page.waitForTimeout(4000)
      await page.screenshot({ path: `${out}/${name}-${size}.png` })
      await page.screenshot({ path: `${out}/${name}-${size}-full.png`, fullPage: true }).catch(() => {})
      console.log('ok', name, size, await page.title())
    } catch (error) {
      console.log('failed', name, size, String(error).slice(0, 160))
    }
    await context.close()
  }
}
await browser.close()
