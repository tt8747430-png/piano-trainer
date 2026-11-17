// Every popup of every board, opened and measured (owner, 2026-11-17: "make an index of all the pages, all the popups
// and all the components and check all of them"). For each board it taps every control in the screen that is not a
// link to another board, and when a sheet, popover, menu or dialog appears it measures it, then reloads the board.
// Usage (from the repo root): RT=… node .scratch/r39/canvas/checks/layers.mjs [Board …]   (no names: every board)
// Prints one line per layer: board · opener → layer, then PROBLEM lines:
//   OUTSIDE  the layer runs past the screen;  CUT  a word runs past the layer's edge;  OVERLAP  two controls cross;
//   SHEET ON A LAPTOP  a phone's bottom sheet drawn on a laptop (a laptop opens a popover, menu or centred dialog);
//   HEADING  a caption as near the group above as its own;  UNBALANCED  a dialog's top and bottom insets differ;
//   SMALL  a control under 32 tall or wide with no larger reach;  EMPTY  a layer with no words;  THROWS  a page error.
import { readFileSync, readdirSync } from 'node:fs'
import { chromium } from 'playwright'
const P = new URL('../practice/project/', import.meta.url).pathname
const RT = readFileSync(process.env.RT, 'utf8')
const names = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(P).filter((f) => f.endsWith('.dc.html')).map((f) => f.slice(0, -8)).sort()
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
let total = 0, bad = 0
const MEASURE = ([want, lap, before]) => {
      const scr = [...document.querySelectorAll('div')].find((e) => { const r = e.getBoundingClientRect(); return Math.round(r.width) === want[0] && Math.round(r.height) === want[1] })
      if (!scr) return null
      const S = scr.getBoundingClientRect()
      const ls = [...document.querySelectorAll('[role=dialog], [role=menu], [role=alertdialog]')].filter((d) => { const r = d.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(d).visibility !== 'hidden' && d.getAttribute('aria-label') !== 'States' })
      if (ls.length <= before) return { moved: location.pathname }
      const L = ls[ls.length - 1], R = L.getBoundingClientRect()
      const p = []
      if (R.left < S.left - 1 || R.right > S.right + 1 || R.top < S.top - 1 || R.bottom > S.bottom + 1) p.push(`OUTSIDE by ${Math.round(Math.max(S.left - R.left, R.right - S.right, S.top - R.top, R.bottom - S.bottom))}px`)
      if (lap && L.getAttribute('role') === 'dialog' && Math.abs(R.left - S.left) < 2 && Math.abs(R.right - S.right) < 2 && Math.abs(R.bottom - S.bottom) < 2) p.push('SHEET ON A LAPTOP')
      if (!L.textContent.trim()) p.push('EMPTY')
      const leaves = [...L.querySelectorAll('*')].filter((e) => !e.children.length && e.textContent.trim() && e.getBoundingClientRect().width > 0)
      for (const e of leaves) { const b = e.getBoundingClientRect(); if (b.right > R.right + 1 || b.left < R.left - 1) { p.push('CUT “' + e.textContent.trim().slice(0, 30) + '”'); break } }
      for (const e of leaves) { if (e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).textOverflow !== 'ellipsis' && getComputedStyle(e).overflow === 'hidden') { p.push('CUT “' + e.textContent.trim().slice(0, 30) + '”'); break } }
      const ctl = [...L.querySelectorAll('button, a, input, [role=menuitem], [role=menuitemradio], [role=radio], [role=switch], [role=checkbox]')].filter((e) => e.getBoundingClientRect().width > 0)
      for (const e of ctl) { const b = e.getBoundingClientRect(); const pre = getComputedStyle(e, '::before'); const reach = pre.content !== 'none' && pre.position === 'absolute'; if (!reach && (b.height < 32 || b.width < 32) && e.tagName !== 'INPUT') { p.push('SMALL “' + (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 24) + '” ' + Math.round(b.width) + '×' + Math.round(b.height)); break } }
      outer: for (let i = 0; i < ctl.length; i++) for (let j = i + 1; j < ctl.length; j++) {
        if (ctl[i].contains(ctl[j]) || ctl[j].contains(ctl[i])) continue
        const a = ctl[i].getBoundingClientRect(), c = ctl[j].getBoundingClientRect()
        if (Math.min(a.right, c.right) - Math.max(a.left, c.left) > 2 && Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top) > 2) { p.push('OVERLAP “' + (ctl[i].textContent || ctl[i].getAttribute('aria-label') || '').trim().slice(0, 20) + '” × “' + (ctl[j].textContent || ctl[j].getAttribute('aria-label') || '').trim().slice(0, 20) + '”'); break outer }
      }
      // a caption heads what follows it: nearer its own control than the group above (proximity)
      const vis = (e) => e && e.getBoundingClientRect().height > 0 && getComputedStyle(e).position !== 'absolute'
      for (const h of L.querySelectorAll('h3, h4')) {
        if (!vis(h)) continue
        let prev = h.previousElementSibling; while (prev && !vis(prev)) prev = prev.previousElementSibling
        let next = h.nextElementSibling; while (next && !vis(next)) next = next.nextElementSibling
        if (!next && h.parentElement !== L) { next = h.parentElement.nextElementSibling; if (!prev) { prev = h.parentElement.previousElementSibling; while (prev && !vis(prev)) prev = prev.previousElementSibling } }
        if (!prev || !next) continue
        const hb = h.getBoundingClientRect(), up = hb.top - prev.getBoundingClientRect().bottom, down = next.getBoundingClientRect().top - hb.bottom
        if (up >= 0 && down >= 0 && up <= down) { p.push('HEADING “' + h.textContent.trim().slice(0, 24) + '” ' + Math.round(up) + ' above, ' + Math.round(down) + ' below'); break }
      }
      // a centred dialog or popover (not a menu, whose caption carries its own margin) holds its content in the middle: top and bottom insets alike
      if (L.getAttribute('role') !== 'menu' && !(Math.abs(R.left - S.left) < 2 && Math.abs(R.right - S.right) < 2)) {
        const kids = [...L.children].filter(vis)
        if (kids.length) { const t = kids[0].getBoundingClientRect().top - R.top, b = R.bottom - kids[kids.length - 1].getBoundingClientRect().bottom; if (L.scrollHeight <= L.clientHeight + 1 && Math.abs(t - b) > 4) p.push('UNBALANCED top ' + Math.round(t) + ', bottom ' + Math.round(b)) }
      }
      const by = L.getAttribute('aria-labelledby'); return { role: L.getAttribute('role'), label: L.getAttribute('aria-label') || (by && document.getElementById(by) ? document.getElementById(by).textContent.trim() : ''), p }
}
async function doBoard(name) {
  const out = []
  const lap = /Laptop$/.test(name) || name === 'Laptop'
  const want = lap ? [1710, 904] : [402, 874]
  const page = await browser.newPage({ viewport: lap ? { width: 2000, height: 1160 } : { width: 450, height: 952 } })
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))
  await page.route('http://canvas.local/**', (route) => {
    const path = new URL(route.request().url()).pathname
    if (path.endsWith('support.js')) return route.fulfill({ contentType: 'text/javascript', body: RT })
    if (path.endsWith('.dc.html')) return route.fulfill({ contentType: 'text/html; charset=utf-8', body: readFileSync(P + path.split('/').pop(), 'utf8') })
    return route.fulfill({ status: 404, body: '' })
  })
  const load = async () => { await page.goto('http://canvas.local/project/' + name + '.dc.html'); await page.waitForTimeout(1100) }
  await load()
  // the openers: controls inside the screen, outside any layer and the States box, that do not leave the board
  const openers = await page.evaluate((want) => {
    const scr = [...document.querySelectorAll('div')].find((e) => { const r = e.getBoundingClientRect(); return Math.round(r.width) === want[0] && Math.round(r.height) === want[1] })
    if (!scr) return []
    const out = []
    let n = 0
    for (const el of scr.querySelectorAll('button, [role=button], a:not([href]), a[href="#"], [onclick]')) {
      const r = el.getBoundingClientRect(); n++
      if (r.width < 8 || r.height < 8 || el.closest('[role=dialog], [role=menu], [role=alertdialog], [aria-label="States"], [role=status]')) continue
      if (getComputedStyle(el).visibility === 'hidden') continue
      el.setAttribute('data-opener', String(n))
      out.push({ id: String(n), label: (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40) })
    }
    return out
  }, want)
  const seenLayers = new Set(), kinds = new Set()
  for (const o of openers) {
    const kind = o.label.replace(/ for .*/, ' for').replace(/\d+/g, '#')
    if (/ for$/.test(kind)) { if (kinds.has(kind)) continue; kinds.add(kind) }
    const before = await page.evaluate(() => [...document.querySelectorAll('[role=dialog], [role=menu], [role=alertdialog]')].filter((d) => d.getBoundingClientRect().width > 0).length)
    const el = page.locator(`[data-opener="${o.id}"]`).first()
    if (!(await el.count())) continue
    await el.click({ timeout: 1500 }).catch(() => el.click({ force: true, timeout: 1500 }).catch(() => {}))
    await page.waitForTimeout(450)
    const res = await page.evaluate(MEASURE, [want, lap, before])
    if (res && res.role) {
      const key = res.role + ':' + res.label
      if (!seenLayers.has(key)) {
        seenLayers.add(key); total++
        if (res.p.length) bad++
        out.push(`${name} · ${o.label} → ${res.role} “${res.label}”${res.p.length ? '\n  PROBLEM ' + res.p.join('\n  PROBLEM ') : ''}`)
      }
      // a layer's own controls that open a further layer (New → New lesson), each from a fresh board
      const inner = await page.evaluate(() => { const ls = [...document.querySelectorAll('[role=dialog], [role=menu], [role=alertdialog]')].filter((d) => d.getBoundingClientRect().width > 0 && d.getAttribute('aria-label') !== 'States'); const L = ls[ls.length - 1]; let k = 0; const out = []; for (const e of L.querySelectorAll('button, [role=button], [role=menuitem], a:not([href]), a[href="#"]')) { k++; e.setAttribute('data-inner', String(k)); out.push({ id: String(k), label: (e.getAttribute('aria-label') || e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40) }) } return out.slice(0, 8) })
      for (const q of inner) {
        await load()
        await page.evaluate((ids) => { const want = ids.want; const scr = [...document.querySelectorAll('div')].find((e) => { const r = e.getBoundingClientRect(); return Math.round(r.width) === want[0] && Math.round(r.height) === want[1] }); let n = 0; if (scr) for (const el of scr.querySelectorAll('button, [role=button], a:not([href]), a[href="#"], [onclick]')) { n++; el.setAttribute('data-opener', String(n)) } }, { want })
        const op = page.locator(`[data-opener="${o.id}"]`).first()
        await op.click({ timeout: 1500 }).catch(() => op.click({ force: true, timeout: 1500 }).catch(() => {}))
        await page.waitForTimeout(400)
        const b2 = await page.evaluate(() => { const ls = [...document.querySelectorAll('[role=dialog], [role=menu], [role=alertdialog]')].filter((d) => d.getBoundingClientRect().width > 0 && d.getAttribute('aria-label') !== 'States'); const L = ls[ls.length - 1]; if (!L) return 0; let k = 0; for (const e of L.querySelectorAll('button, [role=button], [role=menuitem], a:not([href]), a[href="#"]')) { k++; e.setAttribute('data-inner', String(k)) } return ls.length })
        const ie = page.locator(`[data-inner="${q.id}"]`).first()
        if (!(await ie.count())) continue
        const lab1 = res.label
        await ie.click({ timeout: 1500 }).catch(() => ie.click({ force: true, timeout: 1500 }).catch(() => {}))
        await page.waitForTimeout(450)
        const r2 = await page.evaluate(MEASURE, [want, lap, 0])
        if (r2 && r2.role && (r2.role + ':' + r2.label) !== key && !seenLayers.has(r2.role + ':' + r2.label)) {
          seenLayers.add(r2.role + ':' + r2.label); total++
          if (r2.p.length) bad++
          out.push(`${name} · ${o.label} › ${q.label} → ${r2.role} “${r2.label}”${r2.p.length ? '\n  PROBLEM ' + r2.p.join('\n  PROBLEM ') : ''}`)
        }
      }
      await load()
      await page.evaluate((ids) => { const want = ids.want; const scr = [...document.querySelectorAll('div')].find((e) => { const r = e.getBoundingClientRect(); return Math.round(r.width) === want[0] && Math.round(r.height) === want[1] }); let n = 0; if (scr) for (const el of scr.querySelectorAll('button, [role=button], a:not([href]), a[href="#"], [onclick]')) { n++; el.setAttribute('data-opener', String(n)) } }, { want })
    } else if (res && res.moved && !res.moved.endsWith(name + '.dc.html')) {
      await load()
    }
  }
  for (const e of new Set(errs)) out.push(`${name}\n  PROBLEM THROWS ${e.slice(0, 140)}`)
  await page.close()
  return out
}
// boards in parallel, printed in order as each finishes
const queue = [...names]
const W = Number(process.env.WORKERS || 6)
await Promise.all(Array.from({ length: W }, async () => { while (queue.length) { const n = queue.shift(); try { const o = await doBoard(n); if (o.length) console.log(o.join('\n')) } catch (e) { console.log(`${n}\n  PROBLEM THROWS ${String(e).slice(0, 140)}`) } } }))
console.log(`LAYERS ${total} opened, ${bad} with problems`)
await browser.close()
