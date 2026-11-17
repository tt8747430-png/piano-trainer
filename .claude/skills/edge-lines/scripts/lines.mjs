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
  const rowTop = (el) => {
    const p = el.parentElement
    if (!p) return el.getBoundingClientRect().top
    const ps = getComputedStyle(p)
    const pr = p.getBoundingClientRect(), r = el.getBoundingClientRect()
    return /flex/.test(ps.display) && ps.flexDirection.startsWith('row') && ps.alignItems === 'center' && r.top - pr.top <= 12 && pr.height <= r.height + 24 ? pr.top : r.top
  }
  const sel = 'header, h1, h2, aside, nav, main > *, section, [role=toolbar], [role=table], [role=tablist], [data-float], [class~=card]'
  const blocks = [...document.querySelectorAll(sel)].filter(vis).map((el) => {
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    return {
      el,
      tag: el.tagName.toLowerCase() + (el.getAttribute('role') ? '[' + el.getAttribute('role') + ']' : ''),
      text: (el.innerText || el.getAttribute('aria-label') || '').trim().split('\n')[0].slice(0, 32),
      // A block centred in a row is read by its row's top: the row is the edge the eye lines up.
      x: Math.round(r.left), y: Math.round(rowTop(el)), r: Math.round(r.right), b: Math.round(r.bottom),
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
  // ── Relations: how a card and the things in it belong to each other, not only where their edges fall.
  const rel = [] // drawn: insets (purple), row rhythm (teal)
  const R = (el) => el.getBoundingClientRect()
  const textLeft = (el) => {
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.textContent.trim() && !n.parentElement.closest('[aria-hidden=true], svg') ? 1 : 3) })
    const n = walk.nextNode()
    if (!n) return null
    const range = document.createRange()
    range.selectNodeContents(n)
    const r = range.getBoundingClientRect()
    return r.width ? Math.round(r.left) : null
  }
  // The rows of a container: down through single wrappers to the first level with two visible children or more.
  const rowsOf = (el) => {
    let at = el
    for (let i = 0; i < 4; i++) {
      const kids = [...at.children].filter(vis).filter((k) => getComputedStyle(k).position !== 'absolute')
      if (kids.length >= 2) return kids
      if (kids.length !== 1) return []
      at = kids[0]
    }
    return []
  }
  const named = (b) => `${b.tag} “${b.text}”`
  // The app's own sidebar (its nav) is chrome of unlike things, not a group to judge.
  for (const b of blocks.filter((b) => (b.card || b.el.tagName === 'ASIDE') && !b.el.closest('nav'))) {
    const box = R(b.el)
    const cs = getComputedStyle(b.el)
    const rows = rowsOf(b.el)
    if (rows.length === 0) continue
    const rr = rows.map(R)
    const ink = { l: Math.min(...rr.map((r) => r.left)), t: Math.min(...rr.map((r) => r.top)), r: Math.max(...rr.map((r) => r.right)), b: Math.max(...rr.map((r) => r.bottom)) }
    // Where the words start, inside the card: the inset the eye reads (a row's hover fill is not its edge).
    const lefts = rows.map(textLeft).filter((x) => x !== null)
    const inL = Math.round((lefts.length ? Math.min(...lefts) : ink.l) - box.left)
    const inT = Math.round(ink.t - box.top)
    const inB = Math.round(box.bottom - ink.b)
    rel.push({ k: 'in', x: box.left, y: box.top + 10, w: inL, label: inL })
    rel.push({ k: 'inv', x: box.left + 10, y: box.top, h: inT, label: inT })
    rel.push({ k: 'inv', x: box.left + 10, y: ink.b, h: inB, label: inB })
    if (Math.abs(inT - inB) > 4 && inT < 40 && inB < 40) problems.push(`${named(b)}: top inset ${inT} and bottom inset ${inB} differ (an unbalanced box: the content sits off its centre)`)
    // Stacked rows: the gaps between them, against the card's inset (inner closer than the edge, NN/g proximity).
    const stacked = rr.every((r, i) => i === 0 || r.top >= rr[i - 1].bottom - 1)
    if (stacked && rows.length >= 2) {
      const gs = rr.slice(1).map((r, i) => Math.round(r.top - rr[i].bottom))
      gs.forEach((g, i) => rel.push({ k: 'row', x: box.right - 18, y: rr[i].bottom, h: g, label: g }))
      // A row holding a heading, or a hairline, starts a new group inside the card: its gap is a break, not the rhythm.
      const breaks = (el) => R(el).height <= 4 || el.matches('h1, h2, h3, h4') || !!el.querySelector('h1, h2, h3, h4')
      const plain = gs.filter((g, i) => !breaks(rows[i]) && !breaks(rows[i + 1]))
      const widest = Math.max(...plain, 0)
      const edge = Math.min(inL, inT || inL)
      if (plain.length && widest >= edge && edge > 0) problems.push(`${named(b)}: rows ${widest}px apart but only ${edge}px from the card's edge: the card no longer reads as their group (inner gaps must be smaller than the inset)`)
      const kinds = new Set(plain)
      if (kinds.size > 1) notes.push(`${named(b)}: its rows sit ${[...kinds].join(', ')}px apart: one rhythm reads as one list`)
      // Rows of one kind share one height.
      const byTag = {}
      rows.forEach((r, i) => { const key = r.tagName + (r.getAttribute('role') ?? ''); (byTag[key] ??= []).push(Math.round(rr[i].height)) })
      for (const [k, hs] of Object.entries(byTag)) {
        const set = [...new Set(hs)]
        if (hs.length >= 3 && Math.max(...set) - Math.min(...set) > 2 && Math.max(...set) < 1.5 * Math.min(...set)) notes.push(`${named(b)}: its ${k.toLowerCase()} rows are ${set.join(', ')}px tall: alike things look alike (similarity)`)
      }
      // The rows' words start on one edge.
      const ls = rows.filter((r) => !breaks(r)).map(textLeft).filter((x) => x !== null)
      const off = [...new Set(ls)].filter((x) => ls.some((o) => near(o, x)))
      if (off.length) problems.push(`${named(b)}: its rows' words start at ${[...new Set(ls)].join(', ')}: a near-miss inside one list`)
    }
    // The card from its neighbours: never closer to them than its contents are to its edge.
    const sib = b.el.nextElementSibling
    if (sib && vis(sib) && getComputedStyle(sib).position !== 'absolute') {
      const s = R(sib)
      const out = s.top >= box.bottom - 1 ? Math.round(s.top - box.bottom) : s.left >= box.right - 1 ? Math.round(s.left - box.right) : null
      if (out !== null && out < Math.min(inL, inT) && out < 16) problems.push(`${named(b)}: ${out}px from its neighbour but ${Math.min(inL, inT)}px inset: it reads as part of the next thing`)
    }
    // Concentric corners: a filled thing near the card's edge rounds as the card less the inset.
    const outerR = parseFloat(cs.borderTopLeftRadius)
    for (const k of b.el.querySelectorAll('*')) {
      const kr = R(k), ks = getComputedStyle(k)
      const r2 = parseFloat(ks.borderTopLeftRadius)
      const gap = Math.round(kr.left - box.left)
      if (!vis(k) || !opaque(ks.backgroundColor) || r2 < 4 || gap > 8 || Math.round(kr.top - box.top) > 8 || kr.width < 40) continue
      const want = Math.max(outerR - gap, 4)
      if (Math.abs(r2 - want) > 4) { notes.push(`${named(b)}: corner ${outerR} with a ${r2}-round fill ${gap}px in: concentric would be about ${want}`); break }
    }
  }
  // Headings: closer to what they head than to what comes before them (proximity).
  for (const hd of document.querySelectorAll('h1, h2, h3, [role=heading]')) {
    if (!vis(hd)) continue
    // The heading's own row (a heading beside its + or See all) is the unit.
    let unit = hd
    for (let i = 0; i < 3 && unit.parentElement; i++) {
      const row = [...unit.parentElement.children].filter(vis)
      if (!row.every((k) => Math.abs(R(k).top + R(k).height / 2 - (R(unit).top + R(unit).height / 2)) < 16)) break
      unit = unit.parentElement
    }
    const prev = unit.previousElementSibling, next = unit.nextElementSibling
    if (!next || !vis(next)) continue
    const u = R(unit)
    const below = Math.round(R(next).top - u.bottom)
    const above = prev && vis(prev) ? Math.round(u.top - R(prev).bottom) : null
    if (above !== null && above >= 0 && below >= 0 && below >= above && above < 64) problems.push(`heading “${hd.textContent.trim().slice(0, 24)}”: ${below}px to what it heads, ${above}px to what is above: it reads as the end of the last group`)
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
  for (const q of rel) {
    const c = q.k === 'row' ? '#0E8C8C' : '#7A3FC2'
    if (q.k === 'in') add(`left: ${q.x}px; top: ${q.y}px; width: ${q.w}px; height: 0; border-top: 2px solid ${c}`), add(`left: ${q.x + 2}px; top: ${q.y + 3}px; color: ${c}; background: #fff`, String(q.label))
    else if (q.h > 0) add(`left: ${q.x}px; top: ${q.y}px; height: ${q.h}px; width: 0; border-left: 2px solid ${c}`), add(`left: ${q.x + 3}px; top: ${q.y + q.h / 2 - 6}px; color: ${c}; background: #fff`, String(q.label))
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
