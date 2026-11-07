import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'
const P = '../ideal-canvas/project/'
const shots = JSON.parse(process.argv[2])
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
for (const sh of shots) {
  const t = readFileSync(P + sh.file + '.dc.html', 'utf8')
  const helmet = t.match(/<helmet>([\s\S]*?)<\/helmet>/)[1]
  const tpl = t.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1].replace(/<helmet>[\s\S]*?<\/helmet>/, '')
  const js = t.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1]
  const page = await browser.newPage({ viewport: sh.vp, deviceScaleFactor: 1 })
  const html = `<html><head>${helmet}</head><body><template id="t">${tpl}</template><div id="out"></div></body></html>`
  const BLOBS = JSON.parse(readFileSync('blobs.json', 'utf8'))
  await page.route('http://canvas.local/**', (route) => {
    const u = new URL(route.request().url())
    if (u.pathname === '/') return route.fulfill({ contentType: 'text/html; charset=utf-8', body: html })
    const id = u.pathname.split('/').pop()
    if (BLOBS[id]) return route.fulfill({ contentType: 'image/jpeg', body: readFileSync(BLOBS[id]) })
    return route.fulfill({ status: 404, body: '' })
  })
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message)); page.on('console', (m) => m.type() === 'error' && console.log('CONSOLE', m.text()))
  await page.goto('http://canvas.local/')
  await page.evaluate(([js, props, state]) => {
    class DCLogic {}
    const C = new Function('DCLogic', js + ';return Component;')(DCLogic)
    const c = new C(); c.props = props; c.state = state
    const get = (sc, e) => { e = e.trim(); if (e === 'true') return true; if (e === 'false') return false; if (/^-?\d/.test(e)) return Number(e); return e.split('.').reduce((o, k) => (o == null ? undefined : o[k]), sc) }
    const interp = (s, sc) => s.replace(/\{\{(.*?)\}\}/g, (_, e) => { const v = get(sc, e); return v == null ? '' : String(v) })
    const EV = { onclick: 'click', onpointerdown: 'pointerdown', onpointerup: 'pointerup', onpointerleave: 'pointerleave', oncontextmenu: 'contextmenu', onkeydown: 'keydown', onchange: 'input' }
    const expand = (node, sc, out) => { for (const ch of [...node.childNodes]) {
      if (ch.nodeType === 3) { out.appendChild(document.createTextNode(interp(ch.textContent, sc))); continue }
      if (ch.nodeType !== 1) continue
      const tag = ch.localName
      if (tag === 'sc-if') { if (get(sc, ch.getAttribute('value').replace(/[{}]/g, ''))) expand(ch, sc, out); continue }
      if (tag === 'sc-for') { const l = get(sc, ch.getAttribute('list').replace(/[{}]/g, '')) || []; const as = ch.getAttribute('as'); for (const it of l) expand(ch, { ...sc, [as]: it }, out); continue }
      const el = document.createElementNS(ch.namespaceURI, tag)
      for (const a of ch.attributes) { const n = a.name.toLowerCase(); if (EV[n]) { const f = get(sc, a.value.replace(/[{}]/g, '')); if (typeof f === 'function') el.addEventListener(EV[n], f); continue } if (/^on/.test(n)) continue; if (n === 'ref') { const f = get(sc, a.value.replace(/[{}]/g, '')); if (typeof f === 'function') window.__refs.push([f, el]); continue } const v = interp(a.value, sc); if ((a.name === 'checked') && v === 'false') continue; el.setAttribute(a.name, v) }
      expand(ch, sc, el); out.appendChild(el)
    } }
    window.__refs = []; window.__scrolls = []; const so = Element.prototype.scrollTo; Element.prototype.scrollTo = function (o) { window.__scrolls.push([this.getAttribute('aria-label'), JSON.stringify(o)]); return so.call(this, o) }
    const draw = () => { window.__refs = []; const o = document.getElementById('out'); o.innerHTML = ''; expand(document.getElementById('t').content, c.renderVals(), o); for (const [f, el] of window.__refs) f(el) }
    window.__set = (u) => c.setState(u); c.setState = (u) => { c.state = { ...c.state, ...u }; window.__state = c.state; draw(); c.componentDidUpdate?.() }
    window.__state = c.state
    draw(); c.componentDidMount?.()
  }, [js, sh.props, sh.state])
  await page.evaluate(() => document.fonts.ready)
  if (sh.scroll) await page.evaluate((x) => { for (const el of document.querySelectorAll('[aria-label="Beats"]')) el.scrollLeft = x }, sh.scroll)
  const log = async (w) => console.log(sh.file, w, JSON.stringify(await page.evaluate(() => ({ view: window.__state.view, open: window.__state.open, layout: window.__state.layout }))))
  const tap = async (i, w) => { await page.click('nav[aria-label="View"] button:nth-of-type(' + i + ')'); await page.waitForTimeout(700); await log(w) }
  const st = () => page.evaluate(() => ({ playing: window.__state.playing, bar: window.__state.bar, beat: window.__state.beat, verse: window.__state.verse, held: window.__state.held }))
  const curX = () => page.evaluate(() => { const c = [...document.querySelectorAll('[aria-label="Amazing Grace, the score"] div[aria-hidden="true"]')].find((d) => d.style.width === '2px'); return c ? [c.style.left, c.style.top] : null })
  if (sh.test === 'play') {
    console.log(sh.file, 'cursor before', await curX())
    await page.click('button[aria-label="Play"]')
    await page.waitForTimeout(sh.wait ?? 6000)
    console.log('after play', JSON.stringify(await st()), 'cursor', await curX())
    console.log('lit 3D', await page.evaluate(() => document.querySelectorAll('svg[aria-label^="The keys"] polygon[style*="pointer-events: none"]').length), 'lit 2D', await page.evaluate(() => [...document.querySelectorAll('[role="group"] div[style*="cursor: pointer"]')].filter((d) => /#D9785F|#9C86D0/i.test(d.getAttribute('style'))).length))
    console.log('scrolls', JSON.stringify(await page.evaluate(() => window.__scrolls.filter((x) => /Amazing/.test(x[0] || '')).slice(-3))))
    console.log('score scrollTop', await page.evaluate(() => document.querySelector('[aria-label="Amazing Grace, the score"]')?.scrollTop))
    await page.mouse.click(225, 700); await page.waitForTimeout(300)
    const s1 = await st(); await page.waitForTimeout(1500); const s2 = await st()
    console.log('paused holds', JSON.stringify(s1) === JSON.stringify(s2), JSON.stringify(s2))
  }
  if (sh.test === 'press') {
    const keys = page.locator(sh.sel)
    console.log(sh.file, 'keys', await keys.count())
    const box = await keys.nth(sh.nth).boundingBox()
    await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.8); await page.mouse.down(); await page.waitForTimeout(200)
    console.log('held while down', JSON.stringify((await st()).held))
    await page.screenshot({ path: '../shots/' + sh.name + '-down.png', clip: sh.clip })
    await page.mouse.up(); await page.waitForTimeout(200)
    console.log('held after up', JSON.stringify((await st()).held))
  }
  if (sh.test === 'kbbtn') {
    const isOpen = () => page.evaluate(() => window.__state.open)
    await page.click('button[aria-expanded][onclick], button[aria-label="Keyboard"], button:has-text("Keyboard")'); console.log(sh.file, 'after tap', await isOpen(), await page.locator('section[aria-label="Keyboard"]').count())
    await page.click('section[aria-label="Keyboard"] button:has-text("2D")'); console.log('2D', JSON.stringify(await page.evaluate(() => ({ kbStyle: window.__state.kbStyle, keys: window.__state.keys }))), await page.locator('section[aria-label="Keyboard"] button:has-text("Note names")').count())
    await page.click('section[aria-label="Keyboard"] button:has-text("Off")'); console.log('Off', JSON.stringify(await page.evaluate(() => ({ keys: window.__state.keys }))), 'rows', await page.locator('section[aria-label="Keyboard"] [role=switch]').count())
  }
  if (sh.test === 'metro') {
    const st = () => page.evaluate(() => JSON.stringify({ mode: window.__state.mode, countIn: window.__state.countIn, metro: window.__state.metro, sound: window.__state.metSound, accent: window.__state.accent }))
    const P = 'section[aria-label="Practice"]'
    const st2 = () => page.evaluate(() => JSON.stringify({ mode: window.__state.mode, metro: window.__state.metro, count: window.__state.count, sound: window.__state.metSound }))
    await page.evaluate(() => { const C = window.AudioContext; window.__clicks = []; const og = C.prototype.createOscillator, ob = C.prototype.createBufferSource; C.prototype.createOscillator = function () { const o = og.call(this); const s = o.start.bind(o); o.start = (t) => { window.__clicks.push(o.type + ':' + o.frequency.value); s(t) }; return o }; C.prototype.createBufferSource = function () { window.__clicks.push('noise'); return ob.call(this) } })
    console.log('disabled controls in Pace', await page.locator(P + ' [aria-disabled="true"]').count())
    const M = 'section[aria-label="Metronome sound"]'
    await page.click(P + ' button:has-text("Metronome sound")'); console.log('sound page open', await page.locator(M).count())
    for (const n of ['Beep', 'Claves', 'Wood block']) { await page.click(M + ' button:has-text("' + n + '")'); await page.waitForTimeout(80) }
    console.log('preview sounds', await page.evaluate(() => window.__clicks.join(' ')))
    await page.click(M + ' button:has-text("Claves")'); await page.click(M + ' button[aria-label="Back"]'); console.log('back to Practice', await page.locator(P).count(), 'row shows', await page.locator(P + ' button:has-text("Metronome sound")').innerText())
    for (const n of ['Off', 'Count-in', 'On']) { await page.click(P + ' [role=group] button:text-is("' + n + '")'); console.log(n, await page.evaluate(() => JSON.stringify({ metro: window.__state.metro, countBars: window.__state.countBars }))) }
    await page.evaluate(() => { window.__clicks = [] })
    await page.click(P + ' button:has-text("Play")'); console.log('play keeps them', await st2())
    await page.click(P + ' button[aria-label="Faster by 1 BPM"]'); console.log('reset shown', await page.locator(P + ' button:has-text("Score tempo")').count()); await page.click(P + ' button:has-text("Score tempo")'); console.log('reset to', await page.evaluate(() => window.__state.speed), 'button gone', await page.locator(P + ' button:has-text("Score tempo")').count())
    await page.click('button[aria-label="Close"], [data-close]', { timeout: 500 }).catch(() => {}); await page.evaluate(() => { window.__state && document.querySelector('button[aria-label^="Play"], button[aria-label="Play"]')?.click() })
    await page.waitForTimeout(3500); console.log('claves heard (count-in + clicks)', await page.evaluate(() => window.__clicks.filter((c) => c === 'noise').length)); await page.screenshot({ path: '../shots/' + sh.name + '-playing.png' })
  }
  if (sh.test === 'ver') {
    const Q = 'section[aria-label="Settings"]'; const sh2 = () => page.evaluate(() => window.__state.music + ' ' + window.__state.version)
    const checked = () => page.locator(Q + ' [role=radio][aria-checked="true"]').allInnerTexts()
    for (const n of ['Beginner', 'Intermediate', 'Advanced']) { await page.click(Q + ' button:text-is("' + n + '")'); console.log(n, await sh2(), await checked()) }
    await page.click(Q + ' [role=radio]:has-text("Accompaniment")'); console.log('Accompaniment', await sh2(), await checked())
    await page.click(Q + ' button:text-is("Beginner")'); console.log('a level brings the arrangement back', await sh2(), await checked())
    await page.click(Q + ' button:has-text("Pattern")'); await page.click('section[aria-label="Pattern"] button[aria-pressed]:has-text("Broken chords")'); console.log('a pattern picks the accompaniment', await sh2(), await checked(), await page.locator(Q + ' button:has-text("Pattern")').innerText())
  }
  if (sh.test === 'patlib') {
    const L = 'section[aria-label="Pattern"]'
    await page.evaluate(() => { const C = window.AudioContext; window.__tones = 0; const og = C.prototype.createOscillator; C.prototype.createOscillator = function () { window.__tones++; return og.call(this) } })
    await page.click(L + ' button[aria-label="Listen to Ballad arpeggio"]'); console.log('listen tones', await page.evaluate(() => window.__tones))
    const rows = () => page.locator(L + ' button[aria-label^="Listen to"]').evaluateAll((a) => a.filter((e) => e.offsetParent).length)
    const heads = () => page.locator(L + ' button[aria-expanded]').evaluateAll((a) => a.filter((e) => e.offsetParent).map((e) => (e.getAttribute('aria-expanded') === 'true' ? '▾' : '▸') + e.textContent).join(' | '))
    const subs = () => page.locator(L + ' div[style*="uppercase"]').evaluateAll((a) => a.filter((e) => e.offsetParent).map((e) => e.textContent).join(' | '))
    console.log('start rows', await rows(), await heads())
    const P = L + ' [role=group][aria-label="Show"] button'
    for (const n of ['Gorshkov', 'Favourites', 'Recently used', 'Mine']) { await page.click(P + ':text-is("' + n + '")'); console.log('place', n, await rows(), await heads(), await page.locator(P + '[aria-pressed="true"]').innerText()) }
    await page.click(P + ':text-is("Bobrova")'); await page.click(L + ' button[aria-label="Sort and filter"]'); await page.click('section[aria-label="Sort and filter"] button:text-is("Melody")'); console.log('place+filter foot', await page.locator('section[aria-label="Sort and filter"] button:has-text("Show ")').innerText()); await page.click('section[aria-label="Sort and filter"] button:text-is("Reset")'); await page.click('section[aria-label="Sort and filter"] button:has-text("Show ")'); console.log('reset keeps place', await page.locator(P + '[aria-pressed="true"]').innerText())
    await page.click(P + ':text-is("All")')
    await page.fill(L + ' input[type=search]', 'shuffle'); console.log('search shuffle', await rows(), await heads())
    const F = 'section[aria-label="Sort and filter"]'
    await page.click(L + ' button[aria-label="Clear"]'); await page.click(L + ' button[aria-label="Sort and filter"]')
    await page.click(F + ' button:text-is("Advanced")'); console.log('foot', await page.locator(F + ' button:has-text("Show ")').innerText())
    await page.click(F + ' button:text-is("Arpeggio")'); console.log('foot2', await page.locator(F + ' button:has-text("Show ")').innerText())
    await page.click(F + ' button:has-text("Show ")'); console.log('advanced+arp', await rows(), await heads(), await page.locator(L + ' button[aria-label^="Remove"]').allInnerTexts(), 'badge', await page.locator(L + ' button[aria-label="Sort and filter"]').innerText())
    await page.click(L + ' button[aria-label="Remove Arpeggio"]'); console.log('removed arp', await rows())
    await page.click(L + ' button[aria-label="Sort and filter"]'); await page.click(F + ' button:text-is("Reset")'); await page.click(F + ' button:text-is("Level")'); await page.click(F + ' button:has-text("Show ")'); console.log('by level', await heads())
    await page.click(L + ' button[aria-label="Sort and filter"]'); await page.click(F + ' button:text-is("Name")'); await page.click(F + ' button:has-text("Show ")'); console.log('by name', await rows(), await heads())
    await page.click(L + ' button[aria-label="Sort and filter"]'); await page.click(F + ' button:text-is("Reset")'); await page.click(F + ' button:has-text("Show ")')
    await page.fill(L + ' input[type=search]', 'zzz'); console.log('empty', await page.locator(L + ' div:text-is("No patterns match")').last().isVisible()); await page.fill(L + ' input[type=search]', '')
    await page.click(L + ' button[aria-expanded]:has-text("Called to Play2")'.replace('Play2', 'Play')); console.log('open Called to Play', await rows(), await heads(), '/', await subs())
    await page.click(L + ' button[aria-expanded]:has-text("Mine")'); console.log('open Mine', await subs())
    await page.click(L + ' button[aria-expanded]:has-text("Recently used")'); console.log('close Recent', await rows())
    await page.click(L + ' button:text-is("Close all")'); console.log('close all', await rows(), await heads()); await page.click(L + ' button:text-is("Open all")'); console.log('open all', await rows()); await page.click(L + ' button:text-is("Close all")')
    await page.click(L + ' button[aria-expanded]:has-text("Rhythm styles")')
    const before = await page.locator(L + ' button[aria-label="Favourite"][aria-pressed="true"]:visible').count()
    await page.locator(L + ' button[aria-label="Favourite"]:visible').nth(3).click(); console.log('favourites', before, '->', await page.locator(L + ' button[aria-label="Favourite"][aria-pressed="true"]:visible').count(), await page.evaluate(() => JSON.stringify(window.__state.patFavs)))
    await page.fill(L + " input[type=search]", "blues"); await page.locator(L + " button[aria-pressed]:has-text(\"Blues shuffle\")").first().click(); console.log('picked', await page.evaluate(() => window.__state.patId + ' ' + window.__state.music + ' ' + window.__state.open), await page.locator('section[aria-label="Settings"] button:has-text("Pattern")').innerText())
  }
  if (sh.test === 'show') {
    const vis = () => page.evaluate(() => [...document.querySelectorAll('span')].filter((s) => s.textContent === 'G' && /Georgia/.test(s.getAttribute('style') || '')).map((s) => getComputedStyle(s).visibility).slice(0, 2).join(','))
    console.log('chords before', await vis()); await page.click('section [role=group][aria-label="Show"] button:has-text("Chord symbols")'); console.log('chords after', await vis(), await page.evaluate(() => JSON.stringify(window.__state.show)))
  }
  if (sh.test === 'range') {
    for (const n of ['Song', '61', '76', '88']) {
      await page.click('section[aria-label="Keyboard"] [role=group] button:text-is("' + n + '")')
      console.log(sh.file, n, JSON.stringify(await page.evaluate(() => { const g = document.querySelector('[aria-label="Keyboard"][role="group"], [role="group"][aria-label*="keys"]'); const all = [...document.querySelectorAll('div[style*="cursor: pointer"]')]; return { range: window.__state.kbRange, keys: all.length, idx: all.map((d, i) => /E19E8C|B8A8D8|D9785F|9C86D0/i.test(d.getAttribute("style")) ? i + ":" + d.getAttribute("style").match(/left: [0-9.]+px/) : null).filter(Boolean), marked: all.filter((d) => /E19E8C|B8A8D8|D9785F|9C86D0/i.test(d.getAttribute('style'))).length, out: all.filter((d) => /#E4DED5|#2A2622/i.test(d.getAttribute('style'))).length } })))
    }
  }
  if (sh.test === 'vol') {
    const v = () => page.evaluate(() => { const r = document.querySelector('input[aria-label="Right hand volume"]'); const m = document.querySelector('button[aria-pressed][aria-label$="mute the right hand"], button[aria-label$="ute the right hand"]'); return { slider: r?.value, vol: window.__state.volR, muted: m?.getAttribute('aria-pressed'), icon: m?.querySelector('path')?.getAttribute('d').length, show: window.__state.showR ?? 'show' } })
    const mute = () => page.click('button[aria-label$="ute the right hand"]')
    const sw = () => page.click('button[role="switch"][aria-label="Right hand"]')
    const drag = (n) => page.evaluate((n) => { const r = document.querySelector('input[aria-label="Right hand volume"]'); r.value = n; r.dispatchEvent(new Event('input', { bubbles: true })) }, n)
    const L = async (w) => console.log(w, JSON.stringify(await v()))
    await L(sh.file + ' start')
    await mute(); await L('mute'); await mute(); await L('unmute')
    await drag(30); await L('drag 30 (one wave)'); await drag(0); await L('drag 0 mutes'); await mute(); await L('unmute brings 30 back')
    await sw(); await L('switch off mutes'); await page.screenshot({ path: '../shots/' + sh.name + '-off.png', clip: sh.clip })
    await drag(55); await L('drag 55 while off: heard, still off'); await mute(); await L('mute while off')
    await page.click('button[aria-label="Right hand louder"]'); await L('louder while off: unmutes +0')
    await page.click('button[aria-label="Right hand louder"]'); await L('louder')
    await sw(); await sw(); await L('off then on: unmuted at its level')
  }
  await page.screenshot({ path: '../shots/' + sh.name + '.png', clip: sh.clip })
  await page.close()
}
await browser.close()
