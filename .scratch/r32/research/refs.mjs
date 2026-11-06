// Shoots the reference pages the R32 Practice research reads (Chordify's tools, Apple's HIG, musictheory.net).
//   node .scratch/r32/research/refs.mjs <out-dir>
import { chromium } from '@playwright/test'

const out = process.argv[2]
const pages = [
  ['chordify-metronome', 'https://chordify.net/metronome'],
  ['chordify-tuner', 'https://chordify.net/tuner'],
  ['hig-sidebars', 'https://developer.apple.com/design/human-interface-guidelines/sidebars'],
  ['hig-lists', 'https://developer.apple.com/design/human-interface-guidelines/lists-and-tables'],
  ['musictheory-exercises', 'https://www.musictheory.net/exercises'],
]
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
for (const [name, url] of pages)
  for (const [size, w, h] of [
    ['phone', 402, 874],
    ['laptop', 1440, 900],
  ]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } })
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
      await page.waitForTimeout(1500)
      await page.screenshot({ path: `${out}/${name}-${size}.png` })
      console.log('ok', name, size, (await page.title()).slice(0, 60))
    } catch (e) {
      console.log('fail', name, size, String(e).slice(0, 80))
    }
    await page.close()
  }
await browser.close()
