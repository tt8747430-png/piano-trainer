// Profiles the Player on Chopin's Fantaisie-Impromptu (imported .mxl), as the installed app on a laptop:
// plays 10 s with the keys shown and reports React commits, long tasks, frame gaps and the CPU's hottest
// functions (self time). Usage: node perf.mjs <base> <out-dir> [label]
import { chromium } from '@playwright/test'
import { writeFileSync } from 'node:fs'
const [base, out, label = 'run'] = process.argv.slice(2)
const PLAY_MS = 10000
const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--autoplay-policy=no-user-gesture-required'],
})
const c = await b.newContext({ viewport: { width: Number(process.env.W || 1710), height: Number(process.env.H || 904) } })
await c.addInitScript((walkFibers) => {
  if (!localStorage.getItem('pt-settings'))
    localStorage.setItem('pt-settings', JSON.stringify({ state: { welcomed: true }, version: 29 }))
  // A stand-in for React DevTools: counts commits and the fibers each commit rendered.
  const stats = { commits: 0, rendered: 0, byName: {} }
  window.__perf = stats
  const named = (f) => (typeof f.type === 'function' ? f.type.displayName || f.type.name : typeof f.type === 'object' && f.type ? (f.type.displayName || f.type.render?.name || f.type.type?.name || 'memo') : null)
  const walk = (f, counting) => {
    while (f) {
      const alt = f.alternate
      const did = !alt || alt.memoizedProps !== f.memoizedProps || alt.memoizedState !== f.memoizedState
      const n = named(f)
      if (counting && did && n && f.lanes !== undefined && (f.flags & 1) !== 0) {
        stats.rendered++
        stats.byName[n] = (stats.byName[n] || 0) + 1
      }
      if (f.child) walk(f.child, counting)
      f = f.sibling
    }
  }
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    supportsFiber: true,
    renderers: new Map(),
    inject() { return 1 },
    checkDCE() {},
    onScheduleFiberRoot() {},
    onCommitFiberUnmount() {},
    onPostCommitFiberRoot() {},
    onCommitFiberRoot(_id, root) {
      if (!window.__counting) return
      stats.commits++
      if (walkFibers) walk(root.current.child, true)
    },
  }
  window.__longTasks = []
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) if (window.__counting) window.__longTasks.push(Math.round(e.duration))
  }).observe({ type: 'longtask', buffered: false })
}, process.env.COUNT === '1')
const p = await c.newPage()
const errs = []
p.on('pageerror', (e) => errs.push(e.message))
await p.goto(base + '/songs')
await p.waitForTimeout(2000)
for (const name of ['Get started', 'Skip', 'Close']) {
  const x = p.getByRole('button', { name, exact: true })
  if (await x.count()) await x.first().click().catch(() => {})
}
let id = process.env.PIECE
if (!id) {
  await p.getByRole('button', { name: 'New', exact: true }).first().click()
  const [chooser] = await Promise.all([
    p.waitForEvent('filechooser'),
    p.getByRole('button', { name: 'Import', exact: true }).first().click(),
  ])
  await chooser.setFiles('/home/user/piano-trainer/piano-data/scores/fantaisie-impromptu-in-c-minor-chopin.mxl')
  await p.waitForTimeout(4000)
  id = p.url().split('/songs/')[1]?.split(/[?#]/)[0]
}
console.log('piece', id)
await p.goto(`${base}/play/${id}?keys=1`)
await p.waitForTimeout(8000)
console.log('DOM', JSON.stringify(await p.evaluate(() => ({ nodes: document.getElementsByTagName('*').length, svg: document.querySelectorAll('svg *').length, lines: document.querySelectorAll('[data-slot=sheet-line]').length, layout: [...document.querySelectorAll('button[aria-haspopup]')].map((b) => b.getAttribute('aria-label') || b.textContent).slice(0, 8) }))))
const s = await c.newCDPSession(p)
await s.send('Profiler.enable')
await s.send('Profiler.setSamplingInterval', { interval: 200 })
await p.evaluate(() => {
  window.__counting = true
  window.__muts = {}
  window.__engraved = document.querySelectorAll('[data-slot=score] > div, [data-slot=score] > svg').length
  window.__redrawn = new Map()
  new MutationObserver((list) => {
    for (const m of list) {
      const k = m.type + ':' + (m.target.getAttribute?.('data-slot') || m.target.nodeName) + (m.attributeName ? '@' + m.attributeName : '') + (m.addedNodes.length ? '+' + m.addedNodes.length : '')
      window.__muts[k] = (window.__muts[k] || 0) + 1
      if (m.target.getAttribute?.('data-slot') === 'score' && m.addedNodes.length) {
        const line = [...document.querySelectorAll('[data-slot=sheet-line]')].indexOf(m.target.closest('[data-slot=sheet-line]'))
        window.__redrawn.set(line, (window.__redrawn.get(line) || 0) + 1)
      }
    }
  }).observe(document.body, { subtree: true, childList: true, attributes: true })
  window.__gaps = []
  let last = performance.now()
  const tick = (now) => {
    window.__gaps.push(now - last)
    last = now
    if (window.__counting) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
const TRACE = process.env.TRACE === '1'
const traceEvents = []
if (TRACE) {
  s.on('Tracing.dataCollected', (e) => traceEvents.push(...e.value))
  await s.send('Tracing.start', { categories: 'devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.invalidationTracking,blink,v8.execute', transferMode: 'ReportEvents' })
} else await s.send('Profiler.start')
await p.getByRole('button', { name: 'Play', exact: true }).first().click()
await p.waitForTimeout(PLAY_MS)
let profile = { nodes: [], samples: [], timeDeltas: [] }
if (TRACE) {
  const done = new Promise((r) => s.once('Tracing.tracingComplete', r))
  await s.send('Tracing.end')
  await done
  const sum = new Map()
  for (const e of traceEvents) if (e.ph === 'X' && e.dur) sum.set(e.name, (sum.get(e.name) || 0) + e.dur / 1000)
  const lines = [...sum.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, v]) => `${v.toFixed(0).padStart(6)}ms ${k}`)
  console.log(lines.join('\n'))
  writeFileSync(`${out}/${label}-trace.txt`, lines.join('\n'))
  const why = new Map()
  for (const e of traceEvents) {
    if (!/Invalidation/.test(e.name)) continue
    const d = e.args?.data || {}
    const k = `${e.name} | ${d.reason || d.invalidatedSelectorId || ''} | ${d.nodeName || ''} ${d.changedClass || d.changedAttribute || d.changedId || d.changedPseudo || d.extraData || ''}`
    why.set(k, (why.get(k) || 0) + 1)
  }
  console.log('WHY\n' + [...why.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, v]) => `${v} ${k}`).join('\n'))
  const recalc = traceEvents.filter((e) => e.name === 'UpdateLayoutTree' && e.args?.elementCount !== undefined || e.name === 'UpdateLayoutTree' && e.args?.endData)
  console.log('RECALC sample', JSON.stringify(recalc.slice(0, 3).map((e) => [e.dur, e.args])))
} else ({ profile } = await s.send('Profiler.stop'))
if (process.env.LAYERS === '1') {
  let layers = []
  s.on('LayerTree.layerTreeDidChange', (e) => { if (e.layers) layers = e.layers })
  await s.send('LayerTree.enable')
  await p.waitForTimeout(1500)
  const names = {}
  for (const l of layers) {
    let d = 'none'
    if (l.backendNodeId) {
      const r = await s.send('DOM.describeNode', { backendNodeId: l.backendNodeId }).catch(() => null)
      if (r) d = r.node.nodeName + '.' + ((r.node.attributes || []).join(' ').match(/(data-slot|class) ([^ ]{0,40})/)?.[2] ?? '')
    }
    names[d] = (names[d] || 0) + 1
  }
  console.log('LAYERS', layers.length, JSON.stringify(Object.entries(names).sort((a, b) => b[1] - a[1]).slice(0, 20)))
}
const result = await p.evaluate(() => {
  window.__counting = false
  const g = window.__gaps.slice(1).sort((a, b) => a - b)
  const top = Object.entries(window.__perf.byName).sort((a, b) => b[1] - a[1]).slice(0, 25)
  return {
    commits: window.__perf.commits,
    rendered: window.__perf.rendered,
    frames: g.length,
    p50: Math.round(g[Math.floor(g.length * 0.5)]),
    p95: Math.round(g[Math.floor(g.length * 0.95)]),
    worst: Math.round(g[g.length - 1]),
    over50: g.filter((x) => x > 50).length,
    longTasks: window.__longTasks.length,
    longTaskMs: window.__longTasks.reduce((a, b) => a + b, 0),
    engravedAtStart: window.__engraved,
    redrawn: [...window.__redrawn.entries()],
    muts: Object.entries(window.__muts).sort((a, b) => b[1] - a[1]).slice(0, 25),
    top,
  }
})
await p.getByRole('button', { name: /^(Stop|Pause)$/ }).first().click().catch(() => {})
// Self time per function from the CPU profile.
const self = new Map()
const byId = new Map(profile.nodes.map((n) => [n.id, n]))
const dt = profile.timeDeltas
profile.samples.forEach((sid, i) => {
  const n = byId.get(sid)
  const f = n.callFrame
  const key = `${f.functionName || '(anon)'} ${f.url.split('/').pop().split('?')[0]}:${f.lineNumber + 1}`
  self.set(key, (self.get(key) || 0) + (dt[i] || 0) / 1000)
})
// Inclusive time per component-like function (a capitalised name): what each part of the screen costs.
const parent = new Map()
for (const n of profile.nodes) for (const c of n.children || []) parent.set(c, n.id)
const inclusive = new Map()
profile.samples.forEach((sid, i) => {
  const seen = new Set()
  for (let id = sid; id !== undefined; id = parent.get(id)) {
    const name = byId.get(id).callFrame.functionName
    if (/^[A-Z][A-Za-z]+$/.test(name) && !seen.has(name)) {
      seen.add(name)
      inclusive.set(name, (inclusive.get(name) || 0) + (dt[i] || 0) / 1000)
    }
  }
})
console.log('INCLUSIVE', [...inclusive.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, v]) => `${k} ${v.toFixed(0)}`).join(' | '))
const hottest = [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([k, v]) => `${v.toFixed(0).padStart(6)}ms ${k}`)
writeFileSync(`${out}/${label}.cpuprofile`, JSON.stringify(profile))
writeFileSync(`${out}/${label}.json`, JSON.stringify({ ...result, hottest, errs }, null, 1))
console.log(JSON.stringify({ ...result, top: result.top.slice(0, 15) }))
console.log(hottest.join('\n'))
console.log('errors', errs.slice(0, 5))
await b.close()
