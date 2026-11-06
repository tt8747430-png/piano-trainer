import { chromium } from '@playwright/test'

// Online pianos for R33's reference: each at laptop and phone sizes, after its page settles.
const SITES = [
  ['onlinepianist', 'https://www.onlinepianist.com/virtual-piano'],
  ['recursivearts', 'https://recursivearts.com/virtual-piano/'],
  ['midiano', 'https://midiano.com'],
  ['autopiano', 'https://www.autopiano.cn'],
  ['sharedpiano', 'https://musiclab.chromeexperiments.com/Shared-Piano/'],
  ['pianoplayground', 'https://pianoplayground.app'],
  ['sessiontown', 'https://www.sessiontown.com/en/music-games-apps/online-virtual-piano-keyboard'],
]
const SIZES = [
  ['laptop', 1440, 900],
  ['phone', 402, 874],
]
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy })
for (const [name, url] of SITES) {
  for (const [size, width, height] of SIZES) {
    const page = await browser.newPage({ viewport: { width, height } })
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
      await page.waitForTimeout(6000)
      await page.screenshot({ path: `.scratch/r33/ref/${name}-${size}.png` })
      console.log(name, size, 'ok')
    } catch (error) {
      console.log(name, size, 'failed', String(error).split('\n')[0])
    }
    await page.close()
  }
}
await browser.close()
