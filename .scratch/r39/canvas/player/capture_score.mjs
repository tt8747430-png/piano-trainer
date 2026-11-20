// Reads the app's own engraving of Amazing Grace from the dev server, for the Player boards (plan/player-score.md).
// node player/capture_score.mjs <width> <out.json>   (the dev server on localhost:5191)
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const [width = '1710', out = 'player/score/desk.json'] = process.argv.slice(2)
const VIEWS = { both: '', r: '?staves=l1s0', l: '?staves=u1s0' }
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await (await browser.newContext({ viewport: { width: +width, height: 984 } })).newPage()
const result = {}
for (const [view, query] of Object.entries(VIEWS)) {
  await page.goto(`http://localhost:5191/play/amazing${query}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  result[view] = await page.evaluate(() => {
    const css = (el) => {
      const s = getComputedStyle(el)
      return { size: s.fontSize, family: s.fontFamily, weight: s.fontWeight, color: s.color, style: s.fontStyle }
    }
    const box = (el, o) => {
      const r = el.getBoundingClientRect()
      return { x: Math.round(r.x - o.x), y: Math.round(r.y - o.y), w: Math.round(r.width), h: Math.round(r.height) }
    }
    const scores = [...document.querySelectorAll('svg.definition-scale')]
    const title = [...document.querySelectorAll('h1, h2')].find((h) => h.textContent.trim() === 'Amazing Grace')
    const origin = { x: 0, y: title.getBoundingClientRect().y }
    const credit = title.nextElementSibling
    return {
      title: { box: box(title, origin), css: css(title) },
      credit: { text: credit.textContent, box: box(credit, origin), css: css(credit) },
      systems: scores.map((s) => {
        const outer = s.parentElement
        const host = outer.parentElement.parentElement
        const head = [...host.children].find((c) => c.className.includes('bottom-full'))
        const leaves = [...head.querySelectorAll('*')].filter((e) => e.children.length === 0 || e.tagName === 'SPAN' && e.querySelector('sup'))
        const heads = [...head.children].flatMap((c) => (c.children.length && !c.querySelector('sup') ? [...c.children] : [c]))
        const bars = [...host.querySelectorAll(':scope > button')].map((b) => box(b, origin))
        // each beat's x: the piano's notes and rests in each bar (the melody's quavers are not beats)
        const beats = [...s.querySelectorAll('g.measure')].map((m) => {
          const xs = [...m.querySelectorAll(':scope > g.staff')].slice(1).flatMap((st) =>
            [...st.querySelectorAll('g.note, g.rest')].map((n) => {
              const r = n.getBoundingClientRect()
              return Math.round(r.x + r.width / 2 - origin.x)
            }),
          ).sort((a, b) => a - b)
          return xs.filter((x, i) => i === 0 || x - xs[i - 1] > 12)
        })
        return {
          svg: outer.outerHTML,
          box: box(outer, origin),
          head: heads.map((e) => ({ html: e.innerHTML, text: e.textContent, box: box(e, origin), css: css(e) })),
          leaves: leaves.length,
          bars,
          beats,
        }
      }),
    }
  })
}
writeFileSync(out, JSON.stringify(result))
await browser.close()
for (const [v, r] of Object.entries(result))
  console.log(v, r.systems.map((s) => `${s.box.y}+${s.box.h} bars ${s.bars.length} beats ${s.beats.map((b) => b.length).join('')} head ${s.head.map((h) => h.text).join('|')}`).join(' ; '))
