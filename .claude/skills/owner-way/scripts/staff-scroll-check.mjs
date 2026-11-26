// Whether the Scales run's staff scrolls sideways (cut by design) or is cut with no way to see the rest.
import { chromium } from 'playwright'
import { settle, clearOnboarding } from './settle.mjs'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await (await browser.newContext({ viewport: { width: 393, height: 852 } })).newPage()
await page.goto(process.argv[2] + '/practice/scales'); await settle(page); await clearOnboarding(page)
console.log(JSON.stringify(await page.evaluate(() => {
  const svg = document.querySelector('[data-slot="score"] svg') ?? document.querySelector('svg.definition-scale, main svg')
  let el = svg?.parentElement; const chain = []
  while (el && chain.length < 8) { const cs = getComputedStyle(el); chain.push({ tag: el.tagName, cls: el.className.toString().slice(0, 60), ox: cs.overflowX, sw: el.scrollWidth, cw: el.clientWidth }); el = el.parentElement }
  return { svgW: svg?.getBoundingClientRect().width, chain }
})))
await browser.close()
