// Draws a screen's edges and gaps over a screenshot, as the owner marks them by hand, and lists what is off.
//
//   node lines.mjs <url | Board> <width> <height> <out.png> [steps-json]
//
// A URL opens the app (the dev server); a bare name opens that canvas board from
// .scratch/r39/canvas/practice/project/<Board>.dc.html, with RT naming the canvas runtime (as checks/run.mjs).
//
// It finds the screen's blocks (bars, titles, columns, cards, panes, toolbars, tables, floating actions), then:
//   - draws each block's left edge and top edge as a line: blue where blocks share it, red where two blocks miss
//     each other by 1 to 12px (a near-miss is worse than a clear difference: it looks like a mistake);
//   - writes the gap between neighbouring blocks in a column and a row, red when it is off the 4/8 scale;
//   - outlines a card (a lighter surface with a ring or shadow) in orange, and says when a card stands alone in its
//     column (a card with no sibling cards on a plain page reads as a box dropped on the paper);
//   - outlines a bar that holds no title and no control in red (an empty header).
// The report is printed as lines starting with PROBLEM or NOTE, then the shot is written with the overlay.
// steps-json, if given, is a list of {click: selector} | {wait: ms} | {scroll: px} run before measuring.
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'

const [url, w, h, out, stepsArg] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 })
if (url.startsWith('http')) await page.goto(url, { waitUntil: 'networkidle' }).catch(() => {})
else {
  const boards = new URL('../../../../.scratch/r39/canvas/practice/project/', import.meta.url).pathname
  const runtime = readFileSync(process.env.RT, 'utf8')
  await page.route('http://canvas.local/**', (route) => {
    const path = new URL(route.request().url()).pathname
    if (path.endsWith('support.js')) return route.fulfill({ contentType: 'text/javascript', body: runtime })
    if (path.endsWith('.dc.html')) return route.fulfill({ contentType: 'text/html; charset=utf-8', body: readFileSync(boards + path.split('/').pop(), 'utf8') })
    return route.fulfill({ status: 404, body: '' })
  })
  await page.goto('http://canvas.local/project/' + url + '.dc.html')
  await page.waitForTimeout(2000)
}
await page.waitForTimeout(800)
for (const s of JSON.parse(stepsArg || '[]')) {
  if (s.click) await page.locator(s.click).first().click({ timeout: 3000 }).catch((e) => console.log('ERR', e.message.slice(0, 120)))
  if (s.wait) await page.waitForTimeout(s.wait)
  if (s.scroll) await page.mouse.wheel(0, s.scroll)
}
await page.waitForTimeout(300)

const report = await page.evaluate(() => {
  const SCALE = [0, 2, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96]
  const vis = (el) => {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05
  }
  const bg = (el) => getComputedStyle(el).backgroundColor
  const opaque = (c) => c && c !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(c)
  const isCard = (el) => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    if (r.width < 160 || r.height < 56) return false
    const ring = cs.boxShadow !== 'none' || parseFloat(cs.borderTopWidth) > 0
    const parentBg = el.parentElement ? bg(el.parentElement) : ''
    return ring && parseFloat(cs.borderTopLeftRadius) >= 8 && opaque(bg(el)) && bg(el) !== parentBg
  }
  const sel = 'header, h1, h2, aside, nav, main > *, section, [role=toolbar], [role=table], [role=tablist], [data-float], [class~=card]'
  const blocks = [...document.querySelectorAll(sel)].filter(vis).map((el) => {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return {
      el,
      tag: el.tagName.toLowerCase() + (el.getAttribute('role') ? '[' + el.getAttribute('role') + ']' : ''),
      text: (el.innerText || el.getAttribute('aria-label') || '').trim().split('\n')[0].slice(0, 32),
      x: Math.round(r.left), y: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom),
      card: isCard(el),
      floating: cs.position === 'fixed' || cs.position === 'absolute',
    }
  }).filter((b) => b.x >= 0 && b.y >= 0 && b.x < innerWidth && b.y < innerHeight)
  // Cards outside the selector: any lighter ringed surface the eye reads as a box.
  for (const el of document.querySelectorAll('div, a, article, li')) {
    if (!vis(el) || !isCard(el) || blocks.some((b) => b.el === el)) continue
    const r = el.getBoundingClientRect()
    if (r.top > innerHeight) continue
    blocks.push({ el, tag: 'card', text: (el.innerText || '').trim().split('\n')[0].slice(0, 32), x: Math.round(r.left), y: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), card: true, floating: false })
  }
  const lines = []
  const problems = []
  const notes = []
  const near = (a, b) => Math.abs(a - b) >= 1 && Math.abs(a - b) <= 12
  // Left edges and tops: blocks that nearly share an edge.
  const big = blocks.filter((b) => !b.floating && b.r - b.x > 60)
  for (let i = 0; i < big.length; i++) for (let j = i + 1; j < big.length; j++) {
    const a = big[i], c = big[j]
    if (a.el.contains(c.el) || c.el.contains(a.el)) continue
    const stacked = Math.min(a.r, c.r) > Math.max(a.x, c.x) || Math.abs(a.y - c.y) > 40
    if (near(a.x, c.x) && stacked) problems.push(`left edges miss by ${Math.abs(a.x - c.x)}px: ${a.tag} “${a.text}” at ${a.x}, ${c.tag} “${c.text}” at ${c.x}`)
    const side = a.b > c.y && c.b > a.y || Math.abs(a.y - c.y) <= 12
    if (near(a.y, c.y) && side && (a.r <= c.x || c.r <= a.x)) problems.push(`tops miss by ${Math.abs(a.y - c.y)}px: ${a.tag} “${a.text}” at ${a.y}, ${c.tag} “${c.text}” at ${c.y}`)
  }
  const xs = [...new Set(big.map((b) => b.x))].sort((a, b) => a - b)
  for (const x of xs) lines.push({ kind: 'v', at: x, bad: xs.some((o) => near(o, x)) })
  const ys = [...new Set(big.map((b) => b.y))].sort((a, b) => a - b)
  for (const y of ys) lines.push({ kind: 'h', at: y, bad: ys.some((o) => near(o, y)) })
  // Gaps between siblings, stacked and side by side.
  const gaps = []
  const parents = new Set(blocks.map((b) => b.el.parentElement))
  for (const p of parents) {
    if (!p) continue
    // A gap set by space-between or a flexible spacer is room, not a step of the scale: not measured.
    if (/space/.test(getComputedStyle(p).justifyContent) || [...p.children].some((k) => +getComputedStyle(k).flexGrow > 0 && !k.textContent.trim())) continue
    const kids = [...p.children].filter(vis).map((el) => ({ el, r: el.getBoundingClientRect() }))
    for (let i = 1; i < kids.length; i++) {
      const a = kids[i - 1].r, c = kids[i].r
      if (getComputedStyle(kids[i].el).position === 'absolute') continue
      if (c.top >= a.bottom - 1) {
        const g = Math.round(c.top - a.bottom)
        if (g > 0 && g < 200) gaps.push({ x: Math.round(Math.max(a.left, c.left) + 6), y1: Math.round(a.bottom), y2: Math.round(c.top), g, bad: !SCALE.includes(g) })
      } else if (c.left >= a.right - 1) {
        const g = Math.round(c.left - a.right)
        if (g > 0 && g < 200) gaps.push({ y: Math.round(Math.max(a.top, c.top) + 6), x1: Math.round(a.right), x2: Math.round(c.left), g, bad: !SCALE.includes(g) })
      }
    }
  }
  for (const g of gaps) if (g.bad) problems.push(`gap ${g.g}px is off the 4/8 scale at ${g.x ?? g.x1},${g.y ?? g.y1}`)
  // A lone card: a card whose parent holds no other card, on the page's paper.
  // A pane of the app's places (aside, nav) and an inset grouped list (three rows or more) are the boxes the laws keep.
  const kept = (el) => /^(ASIDE|NAV)$/.test(el.tagName) || el.children.length >= 3 && [...el.children].every((k) => /^(A|BUTTON|LI)$/.test(k.tagName) || k.getAttribute('role') === 'row')
  for (const b of blocks.filter((b) => b.card && !kept(b.el))) {
    const sibs = [...(b.el.parentElement?.children ?? [])].filter((s) => s !== b.el && vis(s) && isCard(s))
    if (sibs.length === 0 && b.r - b.x > 240 && b.b - b.y > 240) notes.push(`a lone card “${b.text}” (${b.r - b.x}×${b.b - b.y}): does it group anything the space could not?`)
  }
  // An empty bar: a header with no words and only one control.
  for (const hd of document.querySelectorAll('header')) {
    if (!vis(hd)) continue
    const words = (hd.innerText || '').trim()
    const ctrls = hd.querySelectorAll('button, a').length
    if (!words && ctrls <= 1) problems.push(`an empty bar at y ${Math.round(hd.getBoundingClientRect().top)}: no title, ${ctrls} control`)
  }
  // Two acts of different weight in one box: a box holding a filled (honey) button and another button of another fill.
  for (const b of blocks.filter((b) => b.card)) {
    const btns = [...b.el.querySelectorAll('button, a')].filter(vis).map((x) => getComputedStyle(x).backgroundColor).filter(opaque)
    if (new Set(btns).size >= 2 && btns.length >= 2) notes.push(`“${b.text}” holds acts of different fills: two focus points in one box?`)
  }
  // Draw.
  const layer = document.createElement('div')
  layer.style.cssText = 'position: fixed; inset: 0; z-index: 2147483647; pointer-events: none; font: 600 11px/1 system-ui'
  const add = (css, txt = '') => { const d = document.createElement('div'); d.style.cssText = 'position: absolute; ' + css; d.textContent = txt; layer.append(d) }
  for (const l of lines) l.kind === 'v'
    ? add(`left: ${l.at}px; top: 0; bottom: 0; width: 0; border-left: 1px ${l.bad ? 'solid #E0201B' : 'dashed rgba(30,90,200,.45)'}`)
    : add(`top: ${l.at}px; left: 0; right: 0; height: 0; border-top: 1px ${l.bad ? 'solid #E0201B' : 'dashed rgba(30,90,200,.3)'}`)
  for (const g of gaps) {
    const c = g.bad ? '#E0201B' : '#1E8A3E'
    if (g.y1 !== undefined) add(`left: ${g.x}px; top: ${g.y1}px; height: ${g.y2 - g.y1}px; width: 0; border-left: 2px solid ${c}`, ''), add(`left: ${g.x + 4}px; top: ${(g.y1 + g.y2) / 2 - 6}px; color: ${c}; background: #fff`, String(g.g))
    else add(`top: ${g.y}px; left: ${g.x1}px; width: ${g.x2 - g.x1}px; height: 0; border-top: 2px solid ${c}`, ''), add(`top: ${g.y + 4}px; left: ${(g.x1 + g.x2) / 2 - 6}px; color: ${c}; background: #fff`, String(g.g))
  }
  for (const b of blocks.filter((b) => b.card)) add(`left: ${b.x}px; top: ${b.y}px; width: ${b.r - b.x}px; height: ${b.b - b.y}px; outline: 2px solid rgba(230,120,0,.7)`)
  document.body.append(layer)
  return { problems: [...new Set(problems)], notes: [...new Set(notes)] }
})
for (const p of report.problems) console.log('PROBLEM', p)
for (const n of report.notes) console.log('NOTE', n)
await page.screenshot({ path: out })
console.log(`${report.problems.length} problems, ${report.notes.length} notes; overlay in ${out}`)
await browser.close()
