// Draws a screen's edges and gaps over a screenshot, as the owner marks them by hand, and lists what is off.
//
//   node lines.mjs <url | Board> <device | width height> <out.png> [steps-json]
//   node lines.mjs flow <url | Board> <steps-json> <url | Board> <steps-json> <device> <out.png>
//
// Devices are the owner's (owner-way testing.md): phone 402×874 (iPhone 17 Pro, the installed app), phone-small 393×852,
// phone-side 852×393, ipad 744×1133, tablet 1024×768, mac 1710×904 (MacBook Air, Safari), mac-app 1710×984. A canvas
// board is always shot at its own device, cropped to its screen (the phone's 402×874, the laptop's 1710×904), never
// the frame or the page around it.
//
// A URL opens the app (the dev server); a bare name opens that canvas board from
// .scratch/r39/canvas/practice/project/<Board>.dc.html, with RT naming the canvas runtime (as checks/run.mjs).
//
// One screen: it finds the blocks (bars, titles, columns, cards, panes, toolbars, tables, floating actions), then
//   - draws each block's left edge and top edge as a line, and every card's bottom edge across the screen: blue where
//     blocks share it, red where two miss each other by 1 to 12px; boxes side by side whose edges cross (one starts
//     inside the height of its neighbour and ends below it) are named, as the owner draws them;
//   - writes the gap between neighbouring blocks, red when it is off the 4/8 scale;
//   - outlines cards in orange and judges how each box holds its rows (insets purple, row gaps teal);
//   - checks the laws: Fitts (targets 44 on a phone, 40 on a laptop), Hick (no more than seven choices in one bar,
//     menu or list of places), Von Restorff (one honey act), contrast (4.5:1 for text), similarity (alike controls
//     share one height and one corner).
// A flow: both screens are shot at one device and each control, title and field is matched by its name. It names
// what moved, what changed size, what appeared and what went, and calls it a PROBLEM when the page's frame (its bar,
// title, search, side pane, the column the content starts on) moves between sibling pages (Jakob, consistency): the
// learner should see where they went, not a new page. The shot is A beside B, kept parts in green, moved or resized
// in red with an arrow, new in blue, gone struck through.
// The report is printed as lines starting with PROBLEM, NOTE or FLOW, then the shot is written with the overlay.
// steps-json is a list of {click: selector} | {wait: ms} | {scroll: px} run before measuring.
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'

const DEVICES = { phone: [402, 874], 'phone-small': [393, 852], 'phone-side': [852, 393], ipad: [744, 1133], tablet: [1024, 768], mac: [1710, 904], 'mac-app': [1710, 984] }
const argv = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] })

// Opens a target at a device and returns the page and the screen's rectangle in it.
async function open(target, device, steps) {
  const board = !target.startsWith('http')
  const lap = /Laptop$/.test(target) || target === 'Laptop'
  const [dw, dh] = device
  const page = await browser.newPage({ viewport: board ? (lap ? { width: 2000, height: 1160 } : { width: 450, height: 952 }) : { width: dw, height: dh }, deviceScaleFactor: 1 })
  // A screen that throws is broken before any line is drawn (the SongSettings board drew blank on 'pick is not defined').
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))
  if (!board) await page.goto(target, { waitUntil: 'networkidle' }).catch(() => {})
  else {
    const boards = new URL('../../../../.scratch/r39/canvas/practice/project/', import.meta.url).pathname
    const runtime = readFileSync(process.env.RT, 'utf8')
    await page.route('http://canvas.local/**', (route) => {
      const path = new URL(route.request().url()).pathname
      if (path.endsWith('support.js')) return route.fulfill({ contentType: 'text/javascript', body: runtime })
      if (path.endsWith('.dc.html')) return route.fulfill({ contentType: 'text/html; charset=utf-8', body: readFileSync(boards + path.split('/').pop(), 'utf8') })
      return route.fulfill({ status: 404, body: '' })
    })
    await page.goto('http://canvas.local/project/' + target + '.dc.html')
    await page.waitForTimeout(2000)
  }
  await page.waitForTimeout(800)
  for (const s of steps) {
    // A board's empty full-page layer can sit over the frame; a click that it intercepts is forced.
    if (s.click) await page.locator(s.click).first().click({ timeout: 3000 }).catch(() => page.locator(s.click).first().click({ force: true, timeout: 3000 })).catch((e) => console.log('ERR', e.message.slice(0, 120)))
    if (s.wait) await page.waitForTimeout(s.wait)
    if (s.scroll) await page.mouse.wheel(0, s.scroll)
  }
  await page.waitForTimeout(300)
  // WIRE=1: the wireframe phase (ui-and-mockups, Building a screen, 4): no colour, no words, no pictures, only boxes,
  // so the structure is judged alone. Text becomes grey bars, pictures crossed grey boxes, every surface white with a line.
  if (process.env.WIRE) {
    await page.evaluate((lap) => {
      const want = lap ? [1710, 904] : [402, 874]
      const scr = [...document.querySelectorAll('div')].find((e) => { const r = e.getBoundingClientRect(); return Math.round(r.width) === want[0] && Math.round(r.height) === want[1] }) || document.body
      scr.setAttribute('data-wire', '')
      for (const el of scr.querySelectorAll('*')) { const cs = getComputedStyle(el); if ((cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || cs.boxShadow !== 'none') el.setAttribute('data-box', '') }
      const st = document.createElement('style')
      st.textContent = `[data-wire] ::placeholder { color: transparent !important; } [data-wire], [data-wire] *:not(i[data-pic]) { color: transparent !important; text-shadow: none !important; background-image: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
        [data-wire] *:not(svg):not(svg *):not(i[data-bar]) { background-color: transparent !important; box-shadow: none !important; border-color: #B0B0B0 !important; }
        [data-wire] { background: #FFFFFF !important; }
        [data-wire] [data-box] { outline: 1px solid #8F8F8F !important; outline-offset: -1px; }
        [data-wire] svg, [data-wire] img { visibility: hidden !important; }
        [data-wire] i[data-bar], [data-wire] i[data-pic] { visibility: visible !important; }`
      document.head.appendChild(st)
      const sr = scr.getBoundingClientRect()
      const add = (b, kind) => { const d = document.createElement('i'); d.setAttribute(kind, ''); Object.assign(d.style, { position: 'absolute', left: b.left - sr.left + 'px', top: b.top - sr.top + 'px', width: b.width + 'px', height: b.height + 'px', zIndex: 9999, pointerEvents: 'none', boxSizing: 'border-box' }); return d }
      const out = []
      // every surface that differs from its parent is drawn as a box outline
      for (const el of scr.querySelectorAll('*')) {
        const cs = getComputedStyle(el)
        const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || cs.visibility === 'hidden' || cs.display === 'none') continue
        if (el.tagName === 'svg' || el.tagName === 'IMG') { const d = add(r, 'data-pic'); d.style.background = 'repeating-linear-gradient(45deg, #EEE 0 6px, #DDD 6px 12px)'; d.style.outline = '1px solid #999'; out.push(d); continue }
        for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) { const rg = document.createRange(); rg.selectNodeContents(n); for (const b of rg.getClientRects()) { const d = add({ left: b.left, top: b.top + b.height * 0.3, width: b.width, height: b.height * 0.4 }, 'data-bar'); d.style.background = '#B5B5B5'; d.style.borderRadius = '3px'; out.push(d) } }
      }
      if (getComputedStyle(scr).position === 'static') scr.style.position = 'relative'
      out.forEach((d) => scr.appendChild(d))
    }, lap)
  }
  const banner = board ? await page.evaluate(() => [...document.querySelectorAll('body *:not(script):not(style)')].map((e) => e.childNodes.length === 1 && e.textContent).find((t) => t && /renderVals|is not defined|is not a function|Cannot read prop/.test(t)) || '') : ''
  for (const e of new Set([...errs, banner].filter((x) => x && x.trim()))) console.log('PROBLEM the screen throws: ' + e.replace(/\s+/g, ' ').trim().slice(0, 160))
  // The board's screen: the element of the device's size (402×874 or 1710×904).
  const scr = board
    ? await page.evaluate((lap) => {
        const want = lap ? [1710, 904] : [402, 874]
        const el = [...document.querySelectorAll('div')].find((e) => { const r = e.getBoundingClientRect(); return Math.round(r.width) === want[0] && Math.round(r.height) === want[1] })
        const r = el ? el.getBoundingClientRect() : { left: 0, top: 0, width: innerWidth, height: innerHeight }
        return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }
      }, lap)
    : { x: 0, y: 0, w: dw, h: dh }
  return { page, scr, phone: scr.w < 600 }
}

const flow = argv[0] === 'flow'
const deviceOf = (a, b) => (DEVICES[a] ? DEVICES[a] : [+a, +b])
let url, w, h, out, stepsArg
if (!flow) {
  url = argv[0]
  if (DEVICES[argv[1]]) [w, h, out, stepsArg] = [...DEVICES[argv[1]], argv[2], argv[3]]
  else [w, h, out, stepsArg] = [+argv[1], +argv[2], argv[3], argv[4]]
}
async function analyse(page, scr, phone) {
  return page.evaluate(({ scr, phone }) => {
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
  // a dialog over a scrim is the screen while it is open: the page behind it is not measured against it
  const MODAL = [...document.querySelectorAll('[role=dialog], [role=alertdialog]')].filter(vis).find((d) => { if (d.getAttribute('aria-modal') === 'true') return true; const pr = d.previousElementSibling; if (!pr) return false; const cs = getComputedStyle(pr); return cs.position === 'absolute' && /rgba\(/.test(cs.backgroundColor) && pr.getBoundingClientRect().width > d.getBoundingClientRect().width + 40 })
  const sel = 'header, h1, h2, aside, nav, main > *, section, [role=toolbar], [role=table], [role=tablist], [data-float], [class~=card]'
  const blocks = [...document.querySelectorAll(sel)].filter((e) => vis(e) && (!MODAL || MODAL.contains(e))).map((el) => {
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
  }).filter((b) => b.x >= scr.x && b.y >= scr.y && b.x < scr.x + scr.w && b.y < scr.y + scr.h)
  // Cards outside the selector: any lighter ringed surface the eye reads as a box.
  for (const el of document.querySelectorAll('div, a, article, li')) {
    if (!vis(el) || !isCard(el) || blocks.some((b) => b.el === el) || (MODAL && !MODAL.contains(el))) continue
    const r = el.getBoundingClientRect()
    if (r.top > scr.y + scr.h || r.left > scr.x + scr.w || r.right < scr.x) continue
    blocks.push({ el, tag: 'card', text: (el.innerText || '').trim().split('\n')[0].slice(0, 32), x: Math.round(r.left), y: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), card: true, floating: false })
  }
  const lines = []
  const problems = []
  const notes = []
  const near = (a, b) => Math.abs(a - b) >= 1 && Math.abs(a - b) <= 12
  // Left edges and tops: blocks that nearly share an edge.
  const big = blocks.filter((b) => !b.floating && b.r - b.x > 60)
  // The nearest surface (a lighter rounded box) holding a block: its content aligns to its inset.
  const region = (b) => { for (let p = b.el.parentElement; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (parseFloat(cs.borderTopLeftRadius) >= 8 && opaque(bg(p)) && p.parentElement && bg(p) !== bg(p.parentElement) && p.getBoundingClientRect().width >= 160) return p } return null }
  for (let i = 0; i < big.length; i++) for (let j = i + 1; j < big.length; j++) {
    const a = big[i], c = big[j]
    if (a.el.contains(c.el) || c.el.contains(a.el)) continue
    // Content inside a card sits on the card's inset; the card's own edge is what meets the page's.
    if (region(a) !== region(c)) continue
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
    // A bar's or a dialog head's centred title sits in room, not on a step.
    if (p.closest('header, [role=dialog] > :first-child, [data-slot$=header]') || /space/.test(getComputedStyle(p).justifyContent) || [...p.children].some((k) => +getComputedStyle(k).flexGrow > 0 && !k.textContent.trim())) continue
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
  const kept = (el) => /^(ASIDE|NAV)$/.test(el.tagName) || !!el.closest('[role=dialog], [role=alertdialog]') || el.children.length >= 3 && [...el.children].every((k) => /^(A|BUTTON|LI)$/.test(k.tagName) || k.getAttribute('role') === 'row')
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
  // The page's gutter (owner, 2026-11-17, the lesson: "the drag handle reserves space"): a reading column starts on
  // the page's 16 gutter on a phone; a column that starts further in, with nothing drawn in the band at its left,
  // keeps room for a control that is not there (an edit handle, a number). And the first content sits close under
  // the bar: more than 24 bare under it is a band nothing fills.
  if (scr.w < 600) {
    const main = [...document.querySelectorAll('main')].find((m) => vis(m) && m.getBoundingClientRect().width > scr.w * 0.8)
    if (main) {
      const kids = [...main.querySelectorAll('h1, h2, p, li, figure, aside, section > *')].filter((e) => vis(e) && !e.closest('[data-float], [role=dialog]'))
      const lefts = kids.map((e) => Math.round(e.getBoundingClientRect().left - scr.x)).filter((x) => x >= 0)
      const minL = lefts.length ? Math.min(...lefts) : 16
      const band = [...main.querySelectorAll('*')].some((e) => { const r = e.getBoundingClientRect(); return vis(e) && r.width > 0 && r.left - scr.x < minL - 4 && r.right - scr.x <= minL && r.height > 0 && r.top < scr.y + scr.h })
      const maxR = kids.length ? Math.max(...kids.map((e) => Math.round(e.getBoundingClientRect().right - scr.x))) : scr.w - 16
      // a centred thing (the Tuner's gauge, a sign-in form) is held by its two sides, not a gutter
      if (minL > 20 && !band && Math.abs(minL - (scr.w - maxR)) > 8) problems.push(`the content starts ${minL}px in with nothing in the band at its left: it keeps room for a control not shown; a page's column starts on the 16 gutter, and edit controls float over their block, reserving no space`)
      const hd = [...document.querySelectorAll('header')].find((h) => vis(h) && h.getBoundingClientRect().top - scr.y < 120)
      const first = [...main.querySelectorAll('*')].filter((e) => vis(e) && e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().width > 0).map((e) => e.getBoundingClientRect().top).filter((t) => t > (hd ? hd.getBoundingClientRect().bottom : 0)).sort((a, b) => a - b)[0]
      const hb = hd ? hd.getBoundingClientRect().bottom : 0
      const filled = first !== undefined && [...document.body.querySelectorAll('*')].some((e) => { if (!vis(e) || main.contains(e) || e.contains(main) || (hd && (hd.contains(e) || e.contains(hd)))) return false; const r = e.getBoundingClientRect(); return r.height > 8 && r.width > 40 && r.top >= hb - 4 && r.top < first - 4 && r.left - scr.x < scr.w && r.right > scr.x })
      // a lone instrument centred in the screen (the Circle of fifths) is placed, not left: no band
      if (hd && first !== undefined && !filled && first - hb > 24 && main.scrollTop === 0 && getComputedStyle(main).justifyContent !== 'center') problems.push(`${Math.round(first - hd.getBoundingClientRect().bottom)}px bare between the bar and the first content: a band nothing fills (the page starts 8–16 under its bar)`)
    }
  }
  // A bare band under a column (owner, 2026-11-17: "these empty spaces on the left under the sections should not be
  // … the same for the courses and lessons. you should flag this with the line tool"): on a wide screen, columns side
  // by side whose content ends far apart leave paper bare under the shorter one, a column of the page's width unused.
  // Each pair is judged as far as the screen shows it; a side pane of the app's places (the sidebar) is not content.
  if (scr.w >= 700) {
    const bottomOf = (el) => { let b = -1; for (const e of [el, ...el.querySelectorAll('*')]) { if (!vis(e) || e.closest('[data-float], [role=dialog], [role=toolbar], [role=status]')) continue; const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue; if (getComputedStyle(e).position === 'absolute' && e !== el) continue; b = Math.max(b, Math.min(r.bottom, scr.y + scr.h)) } return b }
    const seen = new Set()
    for (const box of document.querySelectorAll('main, main *')) {
      if (!vis(box) || box.closest('nav, [role=dialog], [data-float]')) continue
      const kids = [...box.children].filter((k) => vis(k) && k.getBoundingClientRect().width > 150 && k.getBoundingClientRect().height > 0)
      if (kids.length < 2) continue
      for (let i = 0; i < kids.length; i++) for (let j = 0; j < kids.length; j++) {
        if (i === j) continue
        const a = kids[i].getBoundingClientRect(), c = kids[j].getBoundingClientRect()
        if (a.right > c.left + 4 && c.right > a.left + 4) continue // not side by side
        if (Math.abs(a.top - c.top) > 48 || a.top > scr.y + scr.h - 100) continue
        const ab = bottomOf(kids[i]), cb = bottomOf(kids[j]), gap = Math.round(cb - ab)
        // owner, 2026-11-17 (the course's cover beside its name, marked): any pair sharing a top, not only one running
        // to the screen's foot; 48 bare under the shorter one is already a hole beside a full neighbour
        if (gap >= 48 && cb > ab && Math.min(a.height, c.height) > 40) {
          const key = Math.round(a.left) + ':' + Math.round(a.top)
          if (seen.has(key)) continue; seen.add(key)
          problems.push(`a bare band ${Math.round(a.width)}×${gap}px under the column at x ${Math.round(a.left - scr.x)}, beside one that goes on: the page's width is left unused (balance; put what the column holds in the bar, the foot or a band across the top, and let the content take the width)`)
        }
      }
    }
  }
  // A row cut in two (owner, 2026-11-17, a course's lesson rows marked: the title at the left, its chevron and Next
  // 400px away): on a wide screen a list row whose words end far from its trailing mark reads as two things
  // (proximity); the row is too wide for what it holds: narrow the list, set it in columns, or bring the end mark in.
  if (scr.w >= 700) {
    const cut = new Set()
    // a table's rows are read down their columns, under a header row whose labels stand on the rows' edges
    const leafL = (el) => [...el.querySelectorAll('*')].filter((e) => vis(e) && !e.children.length && e.textContent.trim() && e.getBoundingClientRect().width > 4).map((e) => Math.round(e.getBoundingClientRect().left))
    const heads = [...document.querySelectorAll('main *')].filter((h) => vis(h) && h.getBoundingClientRect().height < 40 && h.getBoundingClientRect().width > 420 && !h.closest('a, [role=button], li')).map(leafL).filter((l) => l.length >= 3)
    const inTable = (row) => { const l = leafL(row); return heads.some((h) => h.filter((x) => l.some((y) => Math.abs(x - y) <= 3)).length >= 3) }
    for (const row of document.querySelectorAll('main a, main [role=button], main li')) {
      if (!vis(row) || row.closest('nav, [role=dialog], [data-float]')) continue
      const r = row.getBoundingClientRect(); if (r.width < 420 || r.height > 120) continue
      const leaves = [...row.querySelectorAll('*')].filter((e) => vis(e) && !e.children.length && e.getBoundingClientRect().width > 4)
      if (leaves.length < 2 || inTable(row)) continue
      const xs = leaves.map((e) => e.getBoundingClientRect()).sort((p, q) => p.left - q.left)
      let best = 0
      for (let i = 1; i < xs.length; i++) { const end = Math.max(...xs.slice(0, i).map((b) => b.right)); best = Math.max(best, xs[i].left - end) }
      if (best > 240 && !cut.has(Math.round(r.top))) { cut.add(Math.round(r.top)); problems.push(`a row cut in two at y ${Math.round(r.top - scr.y)}: ${Math.round(best)}px bare between its words and its end (proximity): narrow the list or set it in columns, or bring the end in`) }
    }
  }
  // Two acts of different weight in one box: a box holding a filled (honey) button and another button of another fill.
  for (const b of blocks.filter((b) => b.card)) {
    const btns = [...b.el.querySelectorAll('button, a')].filter(vis).map((x) => getComputedStyle(x).backgroundColor).filter(opaque)
    if (new Set(btns).size >= 2 && btns.length >= 2) notes.push(`“${b.text}” holds acts of different fills: two focus points in one box?`)
  }
  // ── Relations: how a card and the things in it belong to each other, not only where their edges fall.
  const rel = [] // drawn: insets (purple), row rhythm (teal)
  const R = (el) => el.getBoundingClientRect()
  // A glyph centred in a small tile (a chord's 6°, a number in a circle) or a segment's label is a picture, not where words start.
  const centredGlyph = (p) => { for (let e = p, i = 0; e && i < 3; e = e.parentElement, i++) { const c = getComputedStyle(e); if (R(e).width <= 64 && (c.justifyContent === 'center' || c.textAlign === 'center')) return true } return false }
  const textLeft = (el) => {
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.textContent.trim() && !n.parentElement.closest('[aria-hidden=true], svg, [role=radio]') && !centredGlyph(n.parentElement) ? 1 : 3) })
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
    // Inside a toolbar the acts sit close by design (a dock's groups); the rule is for cards on the page.
    if (sib && vis(sib) && getComputedStyle(sib).position !== 'absolute' && !b.el.closest('[role=toolbar]')) {
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
    // A sheet's or dialog's own title under its grabber is the sheet's name, not a group's heading.
    if (prev && vis(prev) && R(prev).height <= 8) continue
    if (hd.closest('[role=dialog]') && !prev) continue
    // An eyebrow (a small line just above, smaller than the heading) is part of the heading, not a group before it.
    if (prev && vis(prev) && parseFloat(getComputedStyle(prev).fontSize) < parseFloat(getComputedStyle(hd).fontSize) * 0.8 && R(prev).height < 24) continue
    if (above !== null && above >= 0 && below >= 0 && below >= above && above < 64) problems.push(`heading “${hd.textContent.trim().slice(0, 24)}”: ${below}px to what it heads, ${above}px to what is above: it reads as the end of the last group`)
  }
  // ── Edges that cross: boxes side by side whose tops and bottoms both differ, one starting inside its neighbour's
  // height (owner, 2026-11-17: "the method books box crosses this lines that define where a box finishes").
  const cards = blocks.filter((b) => b.card && !b.floating && !blocks.some((o) => o !== b && o.card && o.el.contains(b.el)))
  for (const a of cards) for (const c of cards) {
    if (a === c || !(a.r <= c.x || c.r <= a.x) || Math.abs((a.r - a.x) - (c.r - c.x)) > 0.3 * (a.r - a.x)) continue
    if (c.y > a.y + 12 && c.y < a.b - 12 && c.b > a.b + 12) problems.push(`boxes side by side cross: ${named(c)} starts ${a.b - c.y}px above where ${named(a)} ends and runs ${c.b - a.b}px below it (edges that cross read as overlap, not columns: align their tops and bottoms, or stack them)`)
    // columns side by side start on one line (Müller-Brockmann; HIG layout): a box whose top misses its neighbour's by up
    // to 40, while they share most of their height, reads as a slip, not two columns (Learn's laptop, 2026-11-17)
    else if (a.x < c.x && c.y > a.y && c.y - a.y <= 40 && Math.min(a.b, c.b) - c.y > 0.6 * Math.min(a.b - a.y, c.b - c.y)) problems.push(`columns side by side start ${Math.round(c.y - a.y)}px apart: ${named(a)} and ${named(c)} (columns share their tops)`)
    else if (c.x < a.x && c.y > a.y && c.y - a.y <= 40 && Math.min(a.b, c.b) - c.y > 0.6 * Math.min(a.b - a.y, c.b - c.y)) problems.push(`columns side by side start ${Math.round(c.y - a.y)}px apart: ${named(c)} and ${named(a)} (columns share their tops)`)
  }
  // ── Fitts: every target within reach of a finger (44) or a pointer in a dense laptop row (40).
  const MIN = phone ? 44 : 40
  const small = []
  for (const el of document.querySelectorAll('button, a[href], input:not([type=hidden]), select, [role=button], [role=radio], [role=tab], [role=switch], [role=checkbox]')) {
    if (!vis(el) || el.closest('p, [aria-hidden=true]') || el.parentElement?.closest('button, a[href]')) continue
    const r = R(el)
    if (r.left < scr.x || r.top < scr.y || r.right > scr.x + scr.w || r.bottom > scr.y + scr.h) continue
    const before = getComputedStyle(el, '::before')
    const reach = Math.max(r.height, parseFloat(before.height) || 0), across = Math.max(r.width, parseFloat(before.width) || 0)
    if (reach < MIN - 0.5 && across < MIN + 40) small.push(`“${(el.innerText || el.getAttribute('aria-label') || el.tagName).trim().split('\n')[0].slice(0, 20)}” ${Math.round(r.width)}×${Math.round(r.height)}`)
  }
  if (small.length) problems.push(`Fitts: ${small.length} target${small.length > 1 ? 's' : ''} under ${MIN}px: ${small.slice(0, 6).join(', ')}${small.length > 6 ? ' …' : ''}`)
  // ── Hick: one bar, menu, tab row or list of places offers at most seven choices at once.
  for (const g of document.querySelectorAll('[role=toolbar], [role=menu], [role=tablist], [role=radiogroup], nav, header')) {
    if (!vis(g)) continue
    const n = [...g.querySelectorAll('button, a[href], [role=menuitem], [role=tab], [role=radio]')].filter(vis).length
    if (n > 7 && !g.matches('nav')) notes.push(`Hick: “${(g.getAttribute('aria-label') || g.tagName).slice(0, 24)}” offers ${n} choices at once: group them, or fold the rare ones`)
  }
  // ── Von Restorff: one honey act per screen (the accent on more than one control is two focal points).
  const honey = (c) => { const m = c.match(/\d+(\.\d+)?/g); if (!m) return false; const [r, g, b, a = 1] = m.map(Number); return a > 0.6 && r > 200 && g > 160 && g < 225 && b < 160 && r - b > 70 }
  const accents = [...document.querySelectorAll('button, a[href]')].filter((el) => vis(el) && (!MODAL || MODAL.contains(el)) && honey(getComputedStyle(el).backgroundColor) && R(el).width * R(el).height > 1200 && R(el).top >= scr.y && R(el).bottom <= scr.y + scr.h)
  if (accents.length > 1) problems.push(`Von Restorff: ${accents.length} honey acts on one screen (${accents.slice(0, 3).map((e) => '“' + (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 16) + '”').join(', ')}): one is the focus, the rest go quiet`)
  // ── Contrast: text against what it sits on, 4.5:1 (3:1 at 18px bold or 24px).
  const lum = (c) => { const m = c.match(/\d+(\.\d+)?/g).map(Number); const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]) }
  const under = (el) => { for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; if (opaque(c) && !/rgba\(.*,\s*0?\.\d+\)$/.test(c)) return c } return 'rgb(255, 255, 255)' }
  const faint = []
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.textContent.trim().length > 1 ? 1 : 3) })
  for (let n = tw.nextNode(); n; n = tw.nextNode()) {
    const el = n.parentElement
    if (!vis(el) || el.closest('[aria-hidden=true], svg, [disabled], [aria-disabled=true]')) continue
    const r = R(el)
    if (r.top < scr.y || r.bottom > scr.y + scr.h || r.left < scr.x || r.right > scr.x + scr.w) continue
    const cs = getComputedStyle(el)
    const fg = cs.color, bgc = under(el)
    const a = (fg.match(/[\d.]+/g) || [])[3]
    if (a !== undefined && +a < 0.99) continue
    const [l1, l2] = [lum(fg), lum(bgc)].sort((x, y) => y - x)
    const ratio = (l1 + 0.05) / (l2 + 0.05)
    const large = parseFloat(cs.fontSize) >= 24 || parseFloat(cs.fontSize) >= 18.5 && +cs.fontWeight >= 700
    if (ratio < (large ? 3 : 4.5)) faint.push(`“${n.textContent.trim().slice(0, 18)}” ${ratio.toFixed(1)}:1`)
  }
  if (faint.length) problems.push(`contrast: ${faint.length} text${faint.length > 1 ? 's' : ''} under 4.5:1: ${[...new Set(faint)].slice(0, 5).join(', ')}`)
  // ── Similarity: controls of one shape (pills, round buttons, rounded fields) share one height; a near-miss (1–6px)
  // is two components where one was meant.
  const shapes = {}
  for (const el of document.querySelectorAll('button, a[href], input, [role=button]')) {
    if (!vis(el)) continue
    const cs = getComputedStyle(el), r = R(el)
    if (r.top < scr.y || r.bottom > scr.y + scr.h || !(opaque(cs.backgroundColor) || cs.boxShadow !== 'none') || r.height < 24 || r.height > 72) continue
    const rad = parseFloat(cs.borderTopLeftRadius)
    const kind = rad >= r.height / 2 - 1 ? (Math.abs(r.width - r.height) < 2 ? 'round button' : 'pill') : rad >= 6 ? 'rounded control' : null
    if (kind) (shapes[kind] ??= []).push(Math.round(r.height))
  }
  for (const [k, hs] of Object.entries(shapes)) {
    const set = [...new Set(hs)].sort((a, b) => a - b)
    const pairs = set.filter((x, i) => i && x - set[i - 1] >= 1 && x - set[i - 1] <= 6)
    if (pairs.length) notes.push(`similarity: ${k}s ${set.join(', ')}px tall on one screen: alike parts share one size`)
  }
  for (const b of cards) lines.push({ kind: 'h', at: b.b, bottom: true })
  // Draw.
  const layer = document.createElement('div')
  layer.style.cssText = 'position: fixed; inset: 0; z-index: 2147483647; pointer-events: none; font: 600 11px/1 system-ui'
  const add = (css, txt = '') => { const d = document.createElement('div'); d.style.cssText = 'position: absolute; ' + css; d.textContent = txt; layer.append(d) }
  for (const l of lines) l.kind === 'v'
    ? add(`left: ${l.at}px; top: 0; bottom: 0; width: 0; border-left: 1px ${l.bad ? 'solid #E0201B' : 'dashed rgba(30,90,200,.45)'}`)
    : add(`top: ${l.at}px; left: 0; right: 0; height: 0; border-top: 1px ${l.bad ? 'solid #E0201B' : l.bottom ? 'dashed rgba(230,120,0,.55)' : 'dashed rgba(30,90,200,.3)'}`)
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
}, { scr, phone })
}

// The named parts of a screen, for a flow: controls, titles and fields by their accessible name, and the page's frame.
async function parts(page, scr) {
  return page.evaluate((scr) => {
    const vis = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05 }
    const out = []
    for (const el of document.querySelectorAll('h1, h2, button, a[href], input, [role=tab], [role=radio], [role=searchbox], nav, aside, [role=toolbar], main')) {
      if (!vis(el) || el.closest('[aria-hidden=true]')) continue
      const r = el.getBoundingClientRect()
      if (r.right < scr.x || r.left > scr.x + scr.w || r.bottom < scr.y || r.top > scr.y + scr.h) continue
      const name = (el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.innerText || '').trim().split('\n')[0].slice(0, 40)
      const kind = el.tagName.toLowerCase()
      if (!name && !/^(nav|aside|main)$/.test(kind)) continue
      // The frame: the bar, the side pane, the title, the search: what should stay put between sibling pages.
      const frame = /^(nav|aside|main|h1)$/.test(kind) || !!el.closest('header, nav, aside, [role=toolbar]') || kind === 'input' || r.top - scr.y < 96
      // The page's title, its first field, its main column and its side pane are matched by their role: their words
      // change from page to page, their place should not.
      const byRole = /^(h1|main|aside)$/.test(kind) || kind === 'input' && !out.some((o) => o.kind === 'input')
      out.push({ key: byRole ? kind : kind + '|' + name, name: name || kind, kind, frame, x: Math.round(r.left - scr.x), y: Math.round(r.top - scr.y), w: Math.round(r.width), h: Math.round(r.height) })
    }
    const seen = {}
    return out.filter((p) => (seen[p.key] = (seen[p.key] || 0) + 1) === 1)
  }, scr)
}

if (!flow) {
  const { page, scr, phone } = await open(url, [w, h], JSON.parse(stepsArg || '[]'))
  const report = await analyse(page, scr, phone)
  for (const p of report.problems) console.log('PROBLEM', p)
  for (const n of report.notes) console.log('NOTE', n)
  await page.screenshot({ path: out, clip: { x: scr.x, y: scr.y, width: scr.w, height: scr.h } })
  console.log(`${report.problems.length} problems, ${report.notes.length} notes; overlay in ${out} (${scr.w}×${scr.h})`)
} else {
  const [, ta, sa, tb, sb, dev, fout] = argv
  const device = deviceOf(dev)
  const A = await open(ta, device, JSON.parse(sa || '[]')), B = await open(tb, device, JSON.parse(sb || '[]'))
  const pa = await parts(A.page, A.scr), pb = await parts(B.page, B.scr)
  const shotA = (await A.page.screenshot({ clip: { x: A.scr.x, y: A.scr.y, width: A.scr.w, height: A.scr.h } })).toString('base64')
  const shotB = (await B.page.screenshot({ clip: { x: B.scr.x, y: B.scr.y, width: B.scr.w, height: B.scr.h } })).toString('base64')
  const byKey = Object.fromEntries(pb.map((p) => [p.key, p]))
  const marks = []
  let kept = 0, frames = 0
  for (const a of pa) {
    const b = byKey[a.key]
    if (!b) { console.log(`FLOW gone: ${a.kind} “${a.name}”`); marks.push({ side: 0, ...a, c: 'gone' }); continue }
    const dx = b.x - a.x, dy = b.y - a.y, dw = b.w - a.w, dh = b.h - a.h
    // a title holding another place's name is as wide as its words: only where it starts and its height are its frame
    const words = a.kind === 'h1' && b.name !== a.name
    const moved = Math.abs(dx) > 2 || Math.abs(dy) > 2, sized = (!words && Math.abs(dw) > 2) || Math.abs(dh) > 2
    if (a.frame) frames++
    if (!moved && !sized) { kept++; marks.push({ side: 0, ...a, c: 'kept' }, { side: 1, ...b, c: 'kept' }); continue }
    const what = [moved ? `moved ${dx >= 0 ? '+' : ''}${dx},${dy >= 0 ? '+' : ''}${dy}` : '', sized ? `resized ${a.w}×${a.h} → ${b.w}×${b.h}` : ''].filter(Boolean).join(', ')
    console.log(`${a.frame ? 'PROBLEM' : 'FLOW'} ${a.frame ? "the page's frame changes: " : ''}${a.kind} “${a.name}”${b.name !== a.name ? ' (“' + b.name + '”)' : ''} ${what}`)
    marks.push({ side: 0, ...a, c: 'moved' }, { side: 1, ...b, c: 'moved', from: a })
  }
  for (const b of pb) if (!pa.some((a) => a.key === b.key)) { console.log(`FLOW new: ${b.kind} “${b.name}”`); marks.push({ side: 1, ...b, c: 'new' }) }
  const fixed = marks.filter((m) => m.side === 0 && m.frame && m.c === 'kept').length
  console.log(`FLOW ${kept} of ${pa.length} parts stay put; the frame keeps ${fixed} of ${frames} in place${frames && fixed / frames < 0.8 ? ': PROBLEM, the page changes too much to follow (Jakob; consistency between sibling pages)' : ''}`)
  // A beside B, marked.
  const [W, H] = [A.scr.w, A.scr.h]
  const cmp = await browser.newPage({ viewport: { width: W * 2 + 24, height: H }, deviceScaleFactor: 1 })
  const C = { kept: 'rgba(30,138,62,.55)', moved: '#E0201B', new: '#1E5AC8', gone: '#7A3FC2' }
  const boxes = marks.map((m) => `<div style="position:absolute;left:${m.side * (W + 24) + m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px;outline:2px ${m.c === 'kept' ? 'dashed' : 'solid'} ${C[m.c]};${m.c === 'gone' ? 'background:repeating-linear-gradient(45deg,transparent 0 6px,rgba(122,63,194,.25) 6px 8px)' : ''}"></div>`).join('')
  const arrows = marks.filter((m) => m.from).map((m) => `<line x1="${m.from.x + m.from.w / 2}" y1="${m.from.y + m.from.h / 2}" x2="${W + 24 + m.x + m.w / 2}" y2="${m.y + m.h / 2}" stroke="#E0201B" stroke-width="1.5" marker-end="url(#h)" opacity=".7"/>`).join('')
  await cmp.setContent(`<body style="margin:0;position:relative;background:#222"><img src="data:image/png;base64,${shotA}" style="position:absolute;left:0;top:0"><img src="data:image/png;base64,${shotB}" style="position:absolute;left:${W + 24}px;top:0">${boxes}<svg width="${W * 2 + 24}" height="${H}" style="position:absolute;inset:0"><defs><marker id="h" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="#E0201B"/></marker></defs>${arrows}</svg></body>`)
  await cmp.waitForTimeout(300)
  await cmp.screenshot({ path: fout })
  console.log(`flow shot in ${fout}`)
}
await browser.close()
