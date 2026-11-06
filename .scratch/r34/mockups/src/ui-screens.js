// R34 UI round's screens, after R33's and R34's helpers (icons, frames, the score, the slim keys, the Player's bar).
Object.assign(P, {
  trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
  restore: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  wave: '<path d="M2 12h2M6 8v8M10 5v14M14 8v8M18 10v4M22 12h0"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
  select: '<path d="m3 6 2 2 4-4M3 14l2 2 4-4M13 6h8M13 14h8M13 20h8"/>',
  filter: '<path d="M3 6h18M7 12h10M10 18h4"/>',
  hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
})

const shot = (src, alt, kind) => kind === 'phone'
  ? `<div class="dev phone"><div class="scr"><img src="${src}" alt="${alt}" style="width:100%;height:100%;object-fit:cover;object-position:top"></div></div>`
  : `<div class="dev mac"><div class="scr mac"><img src="${src}" alt="${alt}" style="width:100%;height:100%;object-fit:cover;object-position:top"></div></div>`

// ——— a staff drawn note by note: steps from E4 (the bottom line) ———
const VERD = {
  right: ['●', 'var(--good)'],
  early: ['◂', 'var(--honey-ink)'],
  late: ['▸', 'var(--honey-ink)'],
  missed: ['○', 'var(--ink-soft)'],
  wrong: ['×', 'var(--rose)'],
}
const TINT = { right: 'var(--good)', early: '#c99a2e', late: '#c99a2e', missed: 'var(--ink-soft)', wrong: 'var(--rose)' }
/**
 * One treble staff. `notes`: [{ s: step from E4, d: 'q' | 'h' | 'e' }], `bars`: note indexes a bar line follows,
 * `v`: verdict per note, `shapes`: draw the verdict's shape, `under`: a label under each note, `between`: labels in the
 * gaps after each note (Steps), `over`: a label over each note.
 */
const staff = ({ k = 1.4, w: outer = 340, notes, bars = [], v = {}, shapes = false, under = null, between = null, over = null, clef = true, h = 96, time = '4' } = {}) => {
  const w = outer / k
  const top = 26, gap = 7, bottom = top + 4 * gap
  const y = (s) => bottom - s * (gap / 2)
  const x0 = clef ? 58 : 14
  const step = (w - x0 - 14) / notes.length
  const xs = notes.map((_, i) => x0 + step * (i + 0.5))
  const lines = [0, 1, 2, 3, 4].map((l) => `<line x1="4" x2="${w - 4}" y1="${top + l * gap}" y2="${top + l * gap}" stroke="currentColor" stroke-width=".8" opacity=".75"/>`).join('')
  const head = clef ? `<text x="6" y="${bottom + 3}" font-size="38" fill="currentColor" font-family="serif">𝄞</text><text x="36" y="${top + 13}" font-size="15" font-weight="700" fill="currentColor" font-family="serif">${time}</text><text x="36" y="${top + 27}" font-size="15" font-weight="700" fill="currentColor" font-family="serif">4</text>` : ''
  const barLines = bars.map((i) => `<line x1="${(xs[i] + (xs[i + 1] ?? w - 4)) / 2}" x2="${(xs[i] + (xs[i + 1] ?? w - 4)) / 2}" y1="${top}" y2="${bottom}" stroke="currentColor"/>`).join('') + `<line x1="${w - 4}" x2="${w - 4}" y1="${top}" y2="${bottom}" stroke="currentColor"/>`
  const heads = notes.map((n, i) => {
    const cx = xs[i], cy = y(n.s)
    const ink = v[i] && !shapes ? TINT[v[i]] : v[i] ? TINT[v[i]] : 'currentColor'
    const ledger = n.s <= -2 ? `<line x1="${cx - 8}" x2="${cx + 8}" y1="${y(-2)}" y2="${y(-2)}" stroke="currentColor" stroke-width=".9"/>` : ''
    const fill = n.d === 'h' ? 'none' : ink
    const stem = `<line x1="${cx + 4.3}" x2="${cx + 4.3}" y1="${cy - 1}" y2="${cy - 25}" stroke="${ink}" stroke-width="1.1"/>`
    const flag = n.d === 'e' ? `<path d="M${cx + 4.3} ${cy - 25}q6 6 5 13" fill="none" stroke="${ink}" stroke-width="1.3"/>` : ''
    const shape = shapes && v[i] ? `<text x="${cx + 9}" y="${cy + 4}" font-size="12" font-weight="800" fill="${VERD[v[i]][1]}" font-family="Onest,sans-serif">${VERD[v[i]][0]}</text>` : ''
    const u = under ? `<text x="${cx}" y="${bottom + 30}" font-size="13" font-weight="700" text-anchor="middle" fill="currentColor" font-family="Onest,sans-serif">${under[i] ?? ''}</text>` : ''
    const o = over ? `<text x="${cx}" y="${top - 30 > 0 ? top - 30 : 10}" font-size="12" font-weight="700" text-anchor="middle" fill="currentColor" font-family="Onest,sans-serif">${over[i] ?? ''}</text>` : ''
    const b = between && i < notes.length - 1 ? `<text x="${(cx + xs[i + 1]) / 2}" y="${bottom + 30}" font-size="12" font-style="italic" text-anchor="middle" fill="var(--ink-soft)" font-family="Literata,serif">${between[i] ?? ''}</text>` : ''
    return `${ledger}<ellipse cx="${cx}" cy="${cy}" rx="4.6" ry="3.4" fill="${fill}" stroke="${ink}" stroke-width="${n.d === 'h' ? 1.5 : 0}" transform="rotate(-20 ${cx} ${cy})"/>${stem}${flag}${shape}${u}${o}${b}`
  }).join('')
  return `<svg width="${outer}" height="${h * k}" viewBox="0 0 ${w} ${h}" style="display:block;color:var(--ink);overflow:visible" aria-hidden="true">${lines}${head}${barLines}${heads}</svg>`
}
const N = (s, d = 'q') => ({ s, d })
const HCB = [N(0), N(-1), N(-2, 'h'), N(0), N(-1), N(-2, 'h')]
const HCB2 = [N(-2, 'e'), N(-2, 'e'), N(-2, 'e'), N(-2, 'e'), N(-1, 'e'), N(-1, 'e'), N(-1, 'e'), N(-1, 'e'), N(0), N(-1), N(-2, 'h')]
const RUN = { 0: 'right', 1: 'right', 2: 'early', 3: 'right', 4: 'late', 5: 'missed' }
const RUN2 = { 0: 'right', 1: 'right', 2: 'wrong', 3: 'right', 4: 'right', 5: 'late', 6: 'right', 7: 'right', 8: 'right', 9: 'early', 10: 'right' }

// ——— the Player with a judged run ———
const runScore = (shapes, w = 361) => `<div style="flex:1;min-height:0;overflow:hidden;background:var(--paper);padding:0 16px">${title}
  <div style="padding-top:8px">${staff({ w, notes: HCB, bars: [2], v: RUN, shapes })}</div>
  <div style="font-size:13px;color:var(--ink-soft);padding:6px 0 0">3</div>
  ${staff({ w, notes: HCB2, bars: [7], v: RUN2, shapes, clef: false })}</div>`
const legend = `<div class="legend">${Object.entries({ right: 'On time', early: 'Early', late: 'Late', missed: 'Missed', wrong: 'Wrong note' }).map(([k, l]) => `<span><b style="color:${VERD[k][1]}">${VERD[k][0]}</b>${l}</span>`).join('')}</div>`
const summary = `<div class="cardx" style="margin:0 12px 10px;display:grid;gap:10px"><div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font:600 18px var(--display)">Run finished</b><span style="font:650 18px var(--sans)">82%</span></div>
  <div style="display:flex;gap:16px;font-size:14px"><span><b style="color:${VERD.right[1]}">●</b> 12 on time</span><span><b style="color:${VERD.early[1]}">◂</b> 2 early</span><span><b style="color:${VERD.late[1]}">▸</b> 2 late</span><span><b style="color:${VERD.missed[1]}">○</b> 1</span><span><b style="color:${VERD.wrong[1]}">×</b> 1</span></div></div>`
const judgedPhone = (shapes) => app(`${playerBar({ shown: true })}<div style="position:relative;flex:1;min-height:0;display:flex;flex-direction:column">${runScore(shapes)}${shapes ? summary : ''}</div>
  ${divider() + piano88({ h: 56, ...PLAY_MARKS })}<div style="background:var(--card);border-top:1px solid var(--line)">${transportRow(false)}${tools()}</div>`)
const judgedMac = mac(`${playerBar({ chord: 'C', shown: true }, true)}
  <div style="display:flex;flex-direction:column;height:calc(100% - 88px)"><div style="position:relative;flex:1;min-height:0;overflow:hidden;display:flex;justify-content:center;gap:24px;background:var(--sand);padding-top:16px">
  <div style="width:640px;background:var(--card);box-shadow:0 2px 10px rgba(0,0,0,.08);padding:20px 40px">${title}<div style="padding-top:12px">${staff({ w: 560, notes: HCB, bars: [2], v: RUN, shapes: true })}</div>${staff({ w: 560, notes: HCB2, bars: [7], v: RUN2, shapes: true, clef: false })}</div>
  <div class="cardx" style="width:300px;align-self:start;display:grid;gap:12px"><b style="font:600 20px var(--display)">Run finished · 82%</b>${legend}<div class="lbl2">Bar 1, beat 3, right hand: C was 140 ms early.</div><span class="ghostbtn">Next: loop bars 3–4 at 70%</span></div></div>
  ${divider() + piano88({ h: 120, ...PLAY_MARKS })}</div>`, 'Songs')
document.getElementById('s1').innerHTML = [
  fig('1.A', 'Today, phone', 'Notes tinted only; early and late are the same honey.', judgedPhone(false)),
  fig('1.B', 'Shapes, phone', 'Each judged note gets its shape; the summary counts them.', judgedPhone(true)),
  fig('1.C', 'Shapes, laptop', 'The summary beside the score, with the legend, the worst note in words and the next step.', judgedMac),
].join('')

// ——— 2. hands ———
const handsMarks = (b) => ({ w: { 23: b ? 'rhs' : 'rh', 25: b ? 'rhs' : 'rh', 27: b ? 'rhs' : 'rh', 16: b ? 'lho' : 'lh', 18: b ? 'lho' : 'lh', 20: b ? 'lho' : 'lh' }, dn: [] })
const handsPhone = (b) => app(`${playerBar({ shown: true })}<div style="position:relative;flex:1;min-height:0;display:flex;flex-direction:column">${score(3)}</div>
  ${divider()}<div style="position:relative">${piano88({ h: 110, from: 14, to: 31, names: 'c', ...handsMarks(b) })}</div>
  <div style="display:flex;gap:16px;justify-content:center;padding:8px;font-size:13px;color:var(--ink-soft);background:var(--card)"><span><i style="display:inline-block;width:14px;height:14px;border-radius:3px;vertical-align:-2px;background:${b ? 'var(--brick)' : 'var(--rh)'}"></i> Right hand</span><span><i style="display:inline-block;width:14px;height:14px;border-radius:3px;vertical-align:-2px;background:var(--lilac);${b ? 'box-shadow:inset 0 0 0 2px var(--lilac-edge)' : 'background:var(--lh)'}"></i> Left hand</span></div>
  <div style="background:var(--card);border-top:1px solid var(--line)">${transportRow(false)}${tools()}</div>`)
const handsMac = mac(`${playerBar({ chord: 'C', shown: true }, true)}<div style="display:flex;flex-direction:column;height:calc(100% - 88px)"><div style="flex:1;min-height:0;background:var(--sand);display:flex;justify-content:center;padding-top:16px"><div style="width:640px;background:var(--card);padding:20px 40px">${title}${sys(0, 560)}${sys(0, 560, 8, ['C', 'G', 'C'])}</div></div>${divider()}${piano88({ h: 150, ...handsMarks(true) })}</div>`, 'Songs')
document.getElementById('s2').innerHTML = [
  fig('2.A', 'Today', 'Both hands are a fill; only the hue tells them apart.', handsPhone(false)),
  fig('2.B', 'Filled and outlined', 'Right hand solid brick; left hand a lilac wash with an edge.', handsPhone(true)),
  fig('2.C', 'Laptop', 'The same on all 88 keys.', handsMac),
].join('')

// ——— 3. covers ———
const INC = {
  'Hot Cross Buns': [N(0), N(-1), N(-2, 'h'), N(0), N(-1), N(-2, 'h')],
  'Mary Had a Little Lamb': [N(0), N(-1), N(-2), N(-1), N(0), N(0), N(0, 'h')],
  'Ode to Joy': [N(0), N(0), N(1), N(2), N(2), N(1), N(0), N(-1)],
  'Twinkle, Twinkle': [N(-2), N(-2), N(2), N(2), N(3), N(3), N(2, 'h')],
  'Amazing Grace': [N(-1), N(3, 'h'), N(5, 'e'), N(3, 'e'), N(5, 'h'), N(4)],
}
const BY = { 'Hot Cross Buns': ['Traditional', 'C'], 'Mary Had a Little Lamb': ['Lowell Mason', 'C'], 'Ode to Joy': ['Beethoven', 'C'], 'Twinkle, Twinkle': ['Traditional', 'C'], 'Amazing Grace': ['John Newton', 'G'] }
const incipit = (name, w, h, _scale, clef = w > 100) => {
  const iw = clef ? 190 : 120
  const notes = INC[name].slice(0, clef ? 7 : 4)
  const sc = w / iw
  return `<span class="cv-inc" style="width:${w}px;height:${h}px;display:grid;align-items:center"><span style="display:block;transform:scale(${sc});transform-origin:0 0;width:${iw}px;height:${96 * sc}px;color:#161513;margin-top:${(h - 96 * sc) / 2 - 2 * sc}px">${staff({ k: 1, w: iw, notes, bars: [], clef, h: 96 }).replace('color:var(--ink)', 'color:#161513')}</span></span>`
}
const letter = (k, w, h) => `<span style="display:grid;place-items:center;width:${w}px;height:${h}px;border-radius:6px;background:var(--yellow);color:var(--yellow-ink);font:600 ${h * 0.5}px var(--display)">${k}</span>`
const coverRow = (name, b) => `<div class="row" style="gap:12px">${b ? incipit(name, 72, 54) : letter(BY[name][1], 48, 48)}<div class="txt"><div class="n">${name}</div><div class="d">${BY[name][0]}</div></div>${rb('more', 'plain')}</div>`
const songsList = (b) => app(`<div class="bar">${rb('back')}<div class="t"><span>Songs to learn</span></div><div class="tools">${rb('search')}${rb('more')}</div></div>
  <div style="flex:1;overflow:hidden;padding:4px 16px;background:var(--paper)"><div class="group">${Object.keys(INC).map((n) => coverRow(n, b)).join('')}</div></div>${tabs('Songs')}`)
const card = (name) => `<div style="display:grid;gap:8px">${incipit(name, 180, 120, 0.62)}<div><div style="font:600 16px var(--display)">${name}</div><div class="lbl2">${BY[name][0]}</div></div></div>`
const songsMac = mac(`<div class="bar"><div class="t lg">Songs to learn</div><div class="tools">${rb('search')}${rb('more')}</div></div><div style="padding:16px 32px;display:grid;grid-template-columns:repeat(5,180px);gap:24px;align-content:start;background:var(--paper);height:100%">${Object.keys(INC).map(card).join('')}</div>`, 'Songs')
document.getElementById('s3').innerHTML = [
  fig('3.A', 'Today', 'Every cover is the key letter on yellow.', songsList(false)),
  fig('3.B', 'Engraved covers', 'The first bars of each song, small, on paper.', songsList(true)),
  fig('3.C', 'Laptop, cards', 'Larger covers on the grid; a chosen picture still wins.', songsMac),
].join('')

// ——— 4. the song page ———
const cells = (vals) => `<div class="cells">${vals.map((v) => (v === null ? '<i class="e"></i>' : `<i style="height:${Math.max(10, v)}%"></i>`)).join('')}</div>`
const practiceCard = `<div class="cardx" style="display:grid;gap:12px">
  <div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font:600 18px var(--display)">Your practice</b><span class="lbl2">3 runs</span></div>
  <div style="display:grid;grid-template-columns:auto 1fr auto;gap:8px 12px;align-items:center;font-size:15px"><span class="lbl2">Last run</span><div class="meter"><i style="width:82%"></i></div><b>82%</b><span class="lbl2">Best run</span><div class="meter solid"><i style="width:91%"></i></div><b>91%</b></div>
  <div><div class="lbl2" style="margin-bottom:4px">Bar by bar</div>${cells([95, 100, 62, 70, 100, 90, null, null])}<div style="display:flex;justify-content:space-between" class="lbl2"><span>1</span><span>8</span></div></div>
  <span class="ghostbtn" style="justify-self:stretch">${ic('loop', 20)}Next: loop bars 3–4 at 70%</span>
  <div class="lbl2" style="text-align:center">Then 75% → 100%, then hands together</div></div>`
const chips = `<div style="display:flex;flex-wrap:wrap;gap:8px">${[['Key', 'C'], ['Time', '4/4'], ['Tempo', '92 BPM']].map(([a, b]) => `<span class="chip">${a} <b>${b}</b></span>`).join('')}<span class="chip">${lvl(1)} Beginner</span></div>`
const chordsBlock = `<div style="display:grid;gap:8px"><b style="font:600 20px var(--display)">Chords</b><div style="display:flex;gap:24px">${['C', 'G'].map((c) => `<div style="display:grid;justify-items:center;gap:4px"><span style="width:76px">${piano({ whites: 7, h: 34, names: 'none' })}</span><b style="font-family:var(--display)">${c}</b></div>`).join('')}</div><div style="display:flex;align-items:center;gap:8px"><span class="lbl2">Progressions</span><span class="chip">Authentic cadence <b>I–V–I</b></span></div></div>`
const details = `<div class="cardx" style="display:flex;justify-content:space-between;align-items:center;min-height:52px;padding:0 16px"><b style="font-weight:600">Details</b><span class="lbl2">Traditional · C major · 4/4 ${ic('down', 16)}</span></div>`
const songPhone = app(`<div class="bar">${rb('back')}<div class="t"></div><div class="tools">${rb('heart')}${rb('share')}${rb('more')}</div></div>
  <div style="flex:1;overflow:hidden;padding:4px 16px 16px;display:grid;gap:14px;align-content:start;background:var(--paper)">
  <div style="display:flex;gap:14px;align-items:center">${incipit('Hot Cross Buns', 112, 84, 0.6)}<div><div style="font:600 24px var(--display)">Hot Cross Buns</div><div class="lbl2">Traditional · Level 1</div></div></div>
  ${chips}<span class="honeybtn">${ic('play', 20)}Play</span>${practiceCard}${chordsBlock}${details}</div>${tabs('Songs')}`)
const songMac = mac(`<div class="bar">${rb('back', 'plain')}<div class="t lg"></div><div class="tools">${rb('heart')}${rb('share')}${rb('more')}</div></div>
  <div style="display:grid;grid-template-columns:1fr 380px;gap:32px;padding:16px 40px;background:var(--paper);height:100%;align-content:start">
  <div style="display:grid;gap:18px;align-content:start"><div style="display:flex;gap:24px;align-items:end"><span style="position:relative">${incipit('Hot Cross Buns', 240, 180, 0.9)}<span class="rb" style="position:absolute;right:8px;bottom:8px;background:var(--card)">${ic('image', 18)}</span></span><div style="display:grid;gap:10px"><div style="font:600 36px var(--display)">Hot Cross Buns</div><div class="lbl2" style="font-size:16px">Traditional · C major · 4/4 · Level 1</div><span class="honeybtn" style="justify-self:start">${ic('play', 20)}Play</span></div></div>
  ${chips}${chordsBlock}${details}</div>
  <div style="display:grid;gap:16px;align-content:start">${practiceCard}</div></div>`, 'Songs')
document.getElementById('s4').innerHTML = [
  fig('4.A', 'Today, phone', 'Your practice is one row (“Played last”); at the end Play floats over Details.', shot('now-play-hot-cross-buns-iphone-17-pro.png', 'The song page today', 'phone')),
  fig('4.B', 'Phone', 'Cover, title, the facts, Play (the one honey); your practice and its next step; Chords as today; Details folded.', songPhone),
  fig('4.C', 'Today, laptop', 'An empty right column; “Change cover” over the favourite.', shot('now-play-hot-cross-buns-macbook-app.png', 'The song page today, laptop', 'mac')),
  fig('4.D', 'Laptop', 'Practice fills the right column; the cover\'s picture button sits inside the cover.', songMac),
].join('')

// ——— 5. calibration ———
const clicks = (done) => `<div style="display:grid;grid-template-columns:repeat(8,1fr);gap:8px">${Array.from({ length: 16 }, (_, i) => `<i style="display:block;height:12px;border-radius:99px;background:${i < done ? 'var(--ink)' : 'var(--line)'}"></i>`).join('')}</div>`
const calib = (done, result) => `<div style="display:grid;gap:18px;padding:20px 16px;align-content:start">
  <div style="font:600 22px var(--display)">Calibrate timing</div>
  ${result ? `<div class="cardx" style="display:grid;gap:8px"><div class="lbl2">Your setup sounds</div><div style="font:650 32px var(--sans)">35 ms late</div><div class="lbl2">Measured over 14 of 16 notes. Every judgement is corrected by it.</div></div>
  <div style="display:flex;gap:12px"><span class="ghostbtn" style="flex:1">Try again</span><span class="honeybtn" style="flex:1">Apply</span></div>`
    : `<div class="lbl2" style="font-size:16px">Play middle C with each click.</div>${clicks(done)}<div style="display:grid;place-items:center;padding:10px"><span style="font:650 64px var(--sans)">${done}</span><span class="lbl2">of 16</span></div><span class="ghostbtn">Cancel</span>`}</div>`
const calibPhone = (done, result) => app(`<div class="bar">${rb('back')}<div class="t"><span>Piano and MIDI</span></div></div><div style="flex:1;background:var(--paper)">${calib(done, result)}</div>${piano88({ h: 90, from: 16, to: 30, names: 'c', w: result ? {} : { 23: 'lit' }, dn: result ? [] : [23] })}<div style="height:34px;background:var(--card)"></div>`)
const settingsRow = (n, d, ctl) => `<div style="display:flex;justify-content:space-between;align-items:center;min-height:56px;padding:6px 16px;border-top:1px solid var(--line)"><div><div style="font-weight:600">${n}</div>${d ? `<div class="lbl2">${d}</div>` : ''}</div>${ctl}</div>`
const calibMac = mac(`<div class="bar"><div class="t lg">Settings</div></div><div style="display:grid;grid-template-columns:300px 1fr;height:100%;background:var(--paper)">
  <div style="padding:8px 16px;border-right:1px solid var(--line)">${['General', 'Appearance', 'Piano and MIDI', 'Sound', 'Account'].map((s) => `<div class="it" style="min-height:44px;display:flex;align-items:center;padding:0 12px;border-radius:10px;${s === 'Piano and MIDI' ? 'background:var(--sand);font-weight:600' : ''}">${s}</div>`).join('')}</div>
  <div style="padding:16px 32px;display:grid;gap:16px;align-content:start;max-width:720px"><div class="cardx" style="padding:0">${settingsRow('MIDI input', 'Yamaha P-125 connected', '<span class="lbl2">Automatic ›</span>')}${settingsRow('Calibrate timing', 'Your setup sounds 35 ms late', '<span class="ghostbtn">Calibrate</span>')}${settingsRow('Touch', 'Soft below 45, hard above 86', '<span class="lbl2">›</span>')}</div></div></div>`, 'Settings')
document.getElementById('s5').innerHTML = [
  fig('5.A', 'Playing along', 'Middle C lit; each tap fills a dot.', calibPhone(9, false)),
  fig('5.B', 'The result', 'Apply saves it for this device.', calibPhone(16, true)),
  fig('5.C', 'Where it lives, laptop', 'A row in Piano and MIDI, with today\'s value.', calibMac),
].join('')

// ——— 6. the editor on a phone ———
const editBar = `<div class="bar">${rb('x', 'plain')}<div class="t"><span>Done</span></div><div class="tools">${rb('keys', 'pressed')}<span class="rb" style="background:var(--honey);color:var(--honey-ink)">${ic('play', 20)}</span>${rb('undo')}${rb('redo')}${rb('gear')}</div></div>`
const staffName = (n) => `<div style="font:italic 13px var(--display);color:var(--ink-soft);padding:6px 0 0 4px">${n}</div>`
const editScore = (menu) => `<div style="position:relative;flex:1;min-height:0;overflow:hidden;background:var(--paper);padding:0 16px">${title}
  <div style="position:relative">${staffName('Melody')}${staff({ w: 361, notes: HCB, bars: [2], h: 80 })}${menu ? `<span class="hit" style="left:0;top:34px;width:62px;height:56px"></span>` : ''}</div>
  ${staffName('Piano')}${sys(0, 361, 4, ['C', 'C'])}
  ${menu ? `<div class="menu2" style="left:24px;top:170px"><div class="cap3">Bar 1 · Melody</div><div class="mi">${ic('music', 20)}Clef</div><div class="mi">${ic('hash', 20)}Key signature</div><div class="mi"><b style="font:700 15px serif;width:20px;text-align:center">4/4</b>Time signature</div></div>` : ''}</div>`
const durations = `<div style="display:flex;justify-content:space-around;align-items:center;min-height:52px;padding:0 6px">${['𝅝', '𝅗𝅥', '♩', '♪', '𝅘𝅥𝅯', '·', '𝄽'].map((g, i) => `<span style="display:grid;place-items:center;width:44px;height:44px;border-radius:10px;font:22px serif;${i === 2 ? 'background:var(--sand)' : ''}">${g}</span>`).join('')}</div>`
const editTools = `<div style="display:flex;justify-content:space-around;align-items:center;min-height:48px;border-top:1px solid var(--line)">${['♯ ♭', 'Tie', 'Dots', 'Dyn.', 'Text', 'More'].map((t) => `<span style="font:600 13px var(--sans);color:var(--ink-soft);min-width:44px;text-align:center">${t}</span>`).join('')}</div>`
const editPhone = (menu) => app(`${editBar}${editScore(menu)}<div style="background:var(--card);border-top:1px solid var(--line)">${durations}${editTools}</div>${piano88({ h: 56, names: 'c4' })}<div style="height:34px;background:var(--card)"></div>`)
document.getElementById('s6').innerHTML = [
  fig('6.A', 'Today', 'Small targets; the panel and the view pill float over the score.', shot('now-edit-hot-cross-buns-iphone-17-pro.png', 'The editor today', 'phone')),
  fig('6.B', 'Docked panel', 'The note panel sits above the keys; the score scrolls clear of it. “Staff 1” is named by its part, Melody.', editPhone(false)),
  fig('6.C', 'The line\'s start tapped', 'One 62 × 52 px target opens Clef, Key signature, Time signature.', editPhone(true)),
].join('')

// ——— 7. Scales ———
const SCALE = [N(-2, 'e'), N(-1, 'e'), N(0, 'e'), N(1, 'e'), N(2, 'e'), N(3, 'e'), N(4, 'e'), N(5, 'e')]
const seg = (items, on) => `<div class="seg" style="display:inline-flex">${items.map((x) => `<span class="${x === on ? 'on' : ''}">${x}</span>`).join('')}</div>`
const scalesHead = (big) => `<div style="display:flex;align-items:baseline;gap:${big ? 18 : 10}px"><span style="font:600 ${big ? 40 : 30}px var(--display)">C ${ic('updown', 16)}</span><span style="font:600 ${big ? 40 : 30}px var(--display)">Major ${ic('updown', 16)}</span></div>`
const layerStaff = (layer, w) => staff({ w, notes: SCALE, bars: [], h: 112, under: layer === 'Fingers' ? ['1', '2', '3', '1', '2', '3', '4', '5'] : layer === 'Degrees' ? ['1', '2', '3', '4', '5', '6', '7', '1'] : null, between: layer === 'Steps' ? ['W', 'W', 'H', 'W', 'W', 'W', 'H'] : null })
const scalesPhone = (layer) => app(`<div class="bar">${rb('back')}<div class="t"><span>Scales and keys</span></div><div class="tools">${rb('keys', 'pressed')}${rb('gear')}</div></div>
  <div style="flex:1;overflow:hidden;padding:8px 16px;display:grid;gap:14px;align-content:start;background:var(--paper)">${seg(['Scale', 'Chords', 'Key'], 'Scale')}${scalesHead(false)}
  <div class="lbl2">Right hand · 1 octave · Up · 80 BPM</div>${seg(['Fingers', 'Degrees', 'Steps'], layer)}<div style="padding-top:10px">${layerStaff(layer, 361)}</div></div>
  ${piano88({ h: 96, from: 21, to: 31, names: 'c', w: { 23: 'lit', 24: 'wash', 25: 'wash', 26: 'wash', 27: 'wash', 28: 'wash', 29: 'wash', 30: 'lit' } })}
  <div style="display:flex;justify-content:center;padding:10px 0 34px;background:var(--card)"><span style="width:56px;height:56px;border-radius:99px;background:var(--honey);color:var(--honey-ink);display:grid;place-items:center">${ic('play', 26)}</span></div>`)
const gearSheet = `<div class="menu2" style="right:24px;top:-6px;width:300px;padding:10px"><div class="cap3">Scale settings</div>${[['Hands', 'Right'], ['Octaves', '1'], ['Direction', 'Up and down'], ['Start on', 'C'], ['Rhythm', 'Even'], ['Tempo', '80 BPM'], ['Fingering', 'As the scale'], ['Compare with', 'None']].map(([a, b]) => `<div class="mi" style="justify-content:space-between"><span>${a}</span><span class="lbl2">${b} ›</span></div>`).join('')}</div>`
const scalesMac = mac(`<div class="bar">${rb('back', 'plain')}<div class="t lg">Scales and keys</div><div class="tools">${rb('keys', 'pressed')}${rb('gear')}</div></div>
  <div style="position:relative;padding:12px 40px;display:grid;gap:14px;align-content:start;background:var(--paper);height:calc(100% - 230px)">${seg(['Scale · 7 notes', 'Chords · I–vii°', 'Key · No sharps or flats'], 'Scale · 7 notes')}
  <div style="display:flex;justify-content:space-between;align-items:end">${scalesHead(true)}<span></span></div>
  <div style="display:grid;grid-template-columns:110px 1fr;gap:10px 16px;align-items:center;font-size:15px"><span class="lbl2">Formula</span><span style="display:flex;gap:10px">${['1 Tonic', '2 Supertonic', '3 Mediant', '4 Subdominant', '5 Dominant', '6 Submediant', '7 Leading tone'].map((d) => `<span class="lbl2"><b style="color:var(--ink)">${d.split(' ')[0]}</b> ${d.split(' ').slice(1).join(' ')}</span>`).join('')}</span><span class="lbl2">Structure</span><b>W W H W W W H</b></div>
  <div style="display:flex;align-items:center;gap:12px"><span class="lbl2">On the staff</span>${seg(['Fingers', 'Degrees', 'Steps'], 'Steps')}</div>
  <div class="cardx" style="display:flex;justify-content:center;padding:28px">${layerStaff('Steps', 760)}</div>${gearSheet}</div>
  ${piano88({ h: 150, w: { 23: 'lit', 24: 'wash', 25: 'wash', 26: 'wash', 27: 'wash', 28: 'wash', 29: 'wash', 30: 'lit' } })}`, 'Practice')
document.getElementById('s7').innerHTML = [
  fig('7.A', 'Today, laptop', 'Eight controls before the music; W/H, degrees and fingers on the staff at once.', shot('now-practice-scales-macbook-app.png', 'Scales today', 'mac')),
  fig('7.B', 'Laptop, gear open', 'The music first; the settings in the gear; Steps between the notes.', scalesMac),
  fig('7.C', 'Phone, Fingers', 'One summary line says what is set; Fingers under the notes.', scalesPhone('Fingers')),
  fig('7.D', 'Phone, Degrees', 'Degrees under the notes, nothing else on the staff.', scalesPhone('Degrees')),
].join('')

// ——— 8. progressions ———
const PROGS = [
  ['Axis of Awesome', 'Bright and singable', [['I', 'home'], ['V', 'away'], ['vi', 'home'], ['IV', 'away']]],
  ['Let It Be', 'Calm and hymn-like', [['I', 'home'], ['V', 'away'], ['vi', 'home'], ['IV', 'away'], ['I', 'home'], ['V', 'away'], ['IV', 'away'], ['I', 'home']]],
  ['50s doo-wop', 'Sweet and nostalgic', [['I', 'home'], ['vi', 'home'], ['IV', 'away'], ['V', 'away']]],
  ['ii–V–I', 'The jazz cadence', [['ii7', 'away'], ['V7', 'tension'], ['Imaj7', 'home']]],
  ['Twelve-bar blues', 'The blues in three chords', [['I7', 'home'], ['IV7', 'away'], ['I7', 'home'], ['V7', 'tension'], ['IV7', 'away'], ['I7', 'home']]],
  ['Minor line cliché', 'Brooding, one voice sliding down', [['i', 'home'], ['iMaj7', 'tension'], ['i7', 'tension'], ['i6', 'home']]],
]
const tiles = (cs, lg = false, now = -1) => `<span style="display:inline-flex;flex-wrap:wrap;gap:${lg ? 10 : 4}px">${cs.map(([n, r], i) => `<span class="ptile ${r} ${lg ? 'lg' : ''} ${i === now ? 'now' : ''}">${n}</span>`).join('')}</span>`
const progRowPhone = ([n, d, cs], b) => b
  ? `<div class="row" style="display:grid;grid-template-columns:1fr auto;gap:6px 8px"><div class="txt"><div class="n">${n}</div><div class="d">${d}</div></div>${rb('more', 'plain')}<div style="grid-column:1/-1">${tiles(cs)}</div></div>`
  : `<div class="row"><span class="tile p-sky">${ic('rows', 22)}</span><div class="txt"><div class="n">${n}</div><div class="d">${cs.map((c) => c[0]).join('–')}</div></div>${rb('more', 'plain')}</div>`
const progPhone = (b) => app(`<div class="bar">${rb('back')}<div class="t"><span>Progressions</span></div><div class="tools">${rb('search')}${rb('gear')}</div></div><div style="flex:1;overflow:hidden;padding:4px 16px;background:var(--paper)"><div class="group">${PROGS.map((p) => progRowPhone(p, b)).join('')}</div></div>${tabs('Practice')}`)
const legendRoles = `<span class="legend"><span><span class="ptile home" style="height:20px;min-width:20px;font-size:11px">I</span> Home</span><span><span class="ptile away" style="height:20px;min-width:20px;font-size:11px">IV</span> Away</span><span><span class="ptile tension" style="height:20px;min-width:20px;font-size:11px">V7</span> Tension</span></span>`
const progPage = mac(`<div class="bar">${rb('back', 'plain')}<div class="t lg">Let It Be ${ic('pen', 18)}</div><div class="tools">${rb('heart')}${rb('gear')}</div></div>
  <div style="padding:16px 40px;display:grid;gap:22px;align-content:start;background:var(--paper);height:calc(100% - 200px)">
  <div style="display:flex;justify-content:space-between;align-items:center"><div class="lbl2" style="font-size:16px">Calm and hymn-like, it settles home twice · Pop</div>${seg(['I V vi IV', 'C G Am F'], 'I V vi IV')}</div>
  <div class="cardx" style="padding:28px;display:grid;gap:18px">${tiles(PROGS[1][2], true, 2)}${legendRoles}</div>
  <div style="display:flex;gap:12px;align-items:center"><span class="honeybtn">${ic('pause', 20)}Pause</span><span class="ghostbtn">Key C ${ic('down', 14)}</span><span class="ghostbtn">♩ = 76</span><span class="ghostbtn">Pattern: Ballad ${ic('down', 14)}</span></div></div>
  ${piano88({ h: 140, w: { 21: 'lh', 23: 'rh', 25: 'rh', 26: 'rh' }, dn: [21, 23, 25, 26] })}`, 'Practice')
document.getElementById('s8').innerHTML = [
  fig('8.A', 'Today', 'The same blue icon on every row; the numerals as plain text.', progPhone(false)),
  fig('8.B', 'Tiles by role', 'Each row shows its chords; green home, sand away, lilac tension.', progPhone(true)),
  fig('8.C', 'A progression\'s page, laptop', 'Large tiles, the one sounding ringed in ink; I V vi IV or C G Am F in place.', progPage),
].join('')

// ——— 9. Songs ———
const FOLD = [['p-yellow', 'music', 'Songs to learn', '23 songs'], ['p-sand', 'heartsm', '«Боже, спасибо»', '20 songs'], ['p-sky', 'piano', 'Called to Play', '15 songs'], ['p-grass', 'church', 'Hymns', '5 songs']]
const foldRow = ([p, i, n, d]) => `<div class="row"><span class="tile ${p}">${ic(i, 22)}</span><div class="txt"><div class="n">${n}</div><div class="d">${d}</div></div>${rb('more', 'plain')}</div>`
const songsHome = (menu) => app(`<div style="display:flex;align-items:center;gap:16px;padding:8px 16px"><span style="font:600 24px var(--sans);border-bottom:2px solid var(--ink);white-space:nowrap">My songs</span><span style="font:600 24px var(--sans);color:var(--ink-soft)">Explore</span><span style="flex:1"></span>${rb('select')}${rb('archive', menu ? 'pressed' : '')}${rb('more')}</div>
  <div style="display:flex;gap:10px;padding:4px 16px 0"><span class="field" style="flex:1;display:flex;align-items:center;gap:8px;min-height:48px;padding:0 14px;border-radius:14px;box-shadow:inset 0 0 0 1px var(--line);background:var(--card);color:var(--ink-soft)">${ic('search', 20)}Search</span><span class="ghostbtn">Manual ${ic('updown', 14)}</span><span class="ghostbtn" style="padding:0 12px">${ic('filter', 20)}</span></div>
  <div style="position:relative;flex:1;overflow:visible;padding:4px 16px;background:var(--paper)"><div style="font:600 24px var(--display);padding:12px 0 8px">Folders</div><div class="group">${FOLD.map(foldRow).join('')}</div>
  ${menu ? `<div class="menu2" style="right:60px;top:-58px"><div class="mi">${ic('archive', 20)}Archive<span class="lbl2" style="margin-left:auto">4</span></div><div class="mi">${ic('trash', 20)}Trash<span class="lbl2" style="margin-left:auto">2</span></div></div>` : ''}</div>${tabs('Songs')}`)
const trashRow = (n, d) => `<div class="row"><span class="tile p-sand">${ic('music', 22)}</span><div class="txt"><div class="n">${n}</div><div class="d">${d}</div></div><span class="rb plain" title="Restore">${ic('restore', 20)}</span></div>`
const trashPhone = app(`<div class="bar">${rb('back')}<div class="t"><span>Trash</span><span class="rb sm" title="Songs here are gone for good only when you empty the Trash.">${ic('info', 18)}</span></div><div class="tools"><span class="ghostbtn" style="color:var(--rose)">Empty</span></div></div>
  <div style="flex:1;overflow:hidden;padding:4px 16px;background:var(--paper);display:grid;gap:10px;align-content:start"><div class="group">${trashRow('Old waltz draft', 'Deleted today')}${trashRow('Scale study in G', 'Deleted 3 days ago')}</div></div>`)
document.getElementById('s9').innerHTML = [
  fig('9.A', 'Rows with one action', 'The chevron goes: tap the row to open it, ⋯ for the menu.', songsHome(false)),
  fig('9.B', 'Archive · Trash', 'The archive button opens both, with their counts.', songsHome(true)),
  fig('9.C', 'Trash', 'Restore one song, or Empty asks first, then removes them all.', trashPhone),
].join('')

// ——— 10. the recording ———
const waveform = (from, to) => `<div class="wave">${Array.from({ length: 90 }, (_, i) => `<i class="${i >= from && i < to ? 'in' : ''}" style="height:${18 + Math.abs(Math.sin(i * 0.7) * 60 + Math.sin(i * 0.23) * 22)}%"></i>`).join('')}</div>`
const beatRow = `<div class="beats">${Array.from({ length: 24 }, (_, i) => `<span class="bt ${i % 4 === 0 ? 'bar' : ''}" style="left:${2 + i * 4.1}%"></span>`).join('')}</div>`
const recPanel = (w) => `<div class="cardx" style="display:grid;gap:10px;${w ? 'width:' + w + 'px' : ''}"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-weight:600">Original recording</b><span class="tag">Beat found · ♩ = 92</span></div>${waveform(30, 52)}${beatRow}
  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span class="ghostbtn">◂ Nudge</span><span class="lbl2">Loop bars 3–4</span><span class="ghostbtn">Nudge ▸</span></div></div>`
const recControls = `<div style="display:flex;gap:10px;flex-wrap:wrap"><span class="ghostbtn">Key D (+2) ${ic('down', 14)}</span><span class="ghostbtn">Speed 0.75× ${ic('down', 14)}</span><span class="tag" style="align-self:center">Pitch kept</span></div>`
const recPhone = app(`${playerBar({ shown: false })}<div style="flex:1;min-height:0;overflow:hidden;padding:8px 16px;display:grid;gap:12px;align-content:start;background:var(--paper)">${title}${seg(['Score', 'Original'], 'Original')}${recPanel()}${recControls}<div class="lbl2">The recording plays in D, at 0.75×, its pitch kept. The click and the score's cursor follow its beats.</div></div>
  <div style="background:var(--card);border-top:1px solid var(--line)">${transportRow(true)}${tools()}</div>`)
const recMac = mac(`${playerBar({ chord: 'D', shown: true }, true)}<div style="display:grid;grid-template-columns:1fr 420px;gap:24px;padding:16px 32px;background:var(--sand);height:calc(100% - 88px);align-content:start">
  <div style="background:var(--card);padding:20px 40px">${title}${sys(0, 560)}${sys(0, 560, 8, ['D', 'A', 'D'])}</div><div style="display:grid;gap:14px;align-content:start">${recPanel()}${recControls}</div></div>`, 'Songs')
document.getElementById('s10').innerHTML = [
  fig('10.A', 'Phone', 'Transpose and Speed keep the recording playing, its pitch kept; the beat grid can be nudged.', recPhone),
  fig('10.B', 'Laptop', 'The recording\'s panel beside the score, the loop shaded on the waveform.', recMac),
].join('')
