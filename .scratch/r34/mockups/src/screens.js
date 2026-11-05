// R34 screens, after the R32/R33 helpers (icons, frames, the score system, the bar, the keys).
// R32's transport, tools row and score, as the Player draws them.
const tempo = `<span class="chip" style="height:44px;justify-content:center;font-weight:600"><span style="font-family:var(--music);font-size:18px">♩</span>&nbsp;= 92</span>`
const transportRow = (playing) => `<div style="display:flex;align-items:center;justify-content:space-between;min-height:60px;padding:2px 10px">${rb('loop', 'plain')}${rb('rotate', 'plain')}${rb('prev', 'plain')}<span style="width:56px;height:56px;border-radius:99px;background:var(--honey);color:var(--honey-ink);display:grid;place-items:center">${playing ? ic('pause', 26, 2.6) : ic('play', 26)}</span>${rb('next', 'plain')}${tempo}${rb('metro', 'plain')}</div>`
const tools = (safe = true) => `<div style="display:flex;justify-content:space-around;align-items:center;min-height:56px;padding:0 8px ${safe ? 34 : 0}px;border-top:1px solid var(--line)">${tbtn('eye', 'Sheet ⌄')}${tbtn('updown', 'Key C')}${tbtn('layers', 'Original')}${tbtn('ear', 'Listen')}${tbtn('more', 'More')}</div>`
const score = (lines = 3) => `<div style="flex:1;min-height:0;overflow:hidden;background:var(--paper);padding:0 16px">${title}${sys(0)}${lines > 1 ? sys(0, 361, 8, ['C', 'G', 'C']) : ''}${lines > 2 ? sys(0) : ''}${lines > 3 ? sys(0, 361, 8, ['G', 'C']) : ''}</div>`
Object.assign(P, {
  sustain: '<path d="M10.5 3h3v7h-3z"/><path d="M3 12h18l-1.2 6.2A3 3 0 0 1 16.9 21H7.1a3 3 0 0 1-2.9-2.8Z"/><path d="M6 15.5h12"/>',
  chevd: '<path d="m7 10 5 5 5-5"/>',
  hand: '<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v5h6M8 13h8M8 17h8"/>',
  rows: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18"/>',
  pano: '<path d="M2 7v10M6 5v14"/><rect x="10" y="3" width="12" height="18" rx="2"/>',
  zout: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M8 11h6"/>',
  zin: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/>',
  fit: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  cable: '<path d="M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1M19 15V6.5a3.5 3.5 0 0 0-7 0v11a3.5 3.5 0 0 1-7 0V9M21 21v-2h-4M3 5h4V3M7 5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1V3"/>',
})

// The 88 keys from A0, slim: `w` marks white keys by index (C4 is 23), `b` black keys by the white key before them.
const WH88 = 'ABCDEFG'
const piano88 = ({ h = 56, w = {}, dn = [], b = {}, bdn = [], names = 'c', from = 0, to = 52 } = {}) => {
  const count = to - from
  const bw = 58 / count
  const white = Array.from({ length: count }, (_, k) => {
    const i = from + k
    const letter = WH88[i % 7]
    const oct = Math.floor((i + 5) / 7)
    const name = names === 'c' && letter === 'C' ? `C${oct}` : names === 'c4' && i === 23 ? 'C4' : ''
    return `<div class="w ${w[i] ?? ''} ${dn.includes(i) ? 'dn' : ''}"><span>${name}</span></div>`
  }).join('')
  const black = Array.from({ length: count - 1 }, (_, k) => {
    const i = from + k
    if (!['C', 'D', 'F', 'G', 'A'].includes(WH88[i % 7])) return ''
    return `<div class="b ${b[i] ?? ''} ${bdn.includes(i) ? 'dn' : ''}" style="left:calc(${((k + 1) * 100) / count}% - ${bw / 2}%);width:${bw}%"></div>`
  }).join('')
  return `<div class="pk slim" style="height:${h}px;flex:none"><div class="felt"></div>${white}${black}</div>`
}
const strip = () => `<div class="kstrip">${ic('keys', 16)}Keyboard${ic('fit', 14)}</div>`
const pill = (layout = 'vertical') => `<div class="spill"><span class="rb ${layout === 'page' ? 'on' : ''}" title="Page view">${ic('file', 20)}</span><span class="rb ${layout === 'vertical' ? 'on' : ''}" title="Vertical scroll">${ic('rows', 20)}</span><span class="rb ${layout === 'panorama' ? 'on' : ''}" title="Panorama">${ic('pano', 20)}</span>${layout === 'page' ? `<span class="sep"></span><span class="rb">${ic('zout', 20)}</span><span class="pct">100 %</span><span class="rb">${ic('zin', 20)}</span><span class="rb">${ic('fit', 18)}</span>` : ''}</div>`
const divider = (drag = false) => `<div class="divider ${drag ? 'drag' : ''}" role="separator" aria-label="Resize keyboard"><i></i></div>`

// The bar's keyboard tools: the chord held (laptop), Sustain (+ ⌄ with All three), Keyboard.
const susBtn = ({ lit = false, three = false, latchedMore = false } = {}) =>
  three
    ? `<span class="split"><span class="rb ${lit ? 'lit' : ''}" title="Sustain pedal">${ic('sustain', 20)}</span><span class="rb more ${latchedMore ? 'on' : ''}" title="Soft and sostenuto pedals">${ic('chevd', 18)}</span></span>`
    : `<span class="rb ${lit ? 'lit' : ''}" title="Sustain pedal">${ic('sustain', 20)}</span>`
const kbdBtn = (shown = true) => `<span class="rb ${shown ? 'pressed' : ''}" title="Keyboard">${ic('keys', 20)}</span>`
const held = (chord) => (chord ? `<span class="held"><small>Chord held</small>${chord}</span>` : '')
const kTools = ({ chord = '', lit = false, three = false, shown = true, latchedMore = false } = {}) =>
  `${held(chord)}${shown ? susBtn({ lit, three, latchedMore }) : ''}${kbdBtn(shown)}`

// The Player
const playerBar = (o = {}, wide = false) => `<div class="bar">${rb('x', 'plain')}<div class="t ${wide ? 'lg' : ''}"><span>Hot Cross Buns</span><span class="rb sm" style="color:var(--ink)">${ic('pen', 20)}</span></div><div class="tools">${kTools(o)}${rb('gear')}</div></div>`
const PLAY_MARKS = { w: { 25: 'rh', 16: 'lh', 18: 'lh', 20: 'lh' }, dn: [25, 16, 18, 20] }
const phonePlayer = ({ keys = true, h = 56, drag = false, lit = false, three = false, marks = PLAY_MARKS, overlay = '' } = {}) =>
  app(`${playerBar({ lit, three, shown: keys })}<div style="position:relative;flex:1;min-height:0;display:flex;flex-direction:column">${score(4)}${pill()}${overlay}</div>
  ${keys ? divider(drag) + piano88({ h, ...marks }) : strip()}<div style="background:var(--card);border-top:1px solid var(--line)">${transportRow(true)}${tools()}</div>`)
const macPlayer = ({ keys = true, h = 145, chord = 'C', lit = false, three = false, overlay = '', latchedMore = false, size = 'all' } = {}) =>
  mac(`${playerBar({ chord, lit, three, shown: keys, latchedMore }, true)}
  <div style="display:flex;flex-direction:column;height:calc(100% - 88px)">
    <div style="position:relative;flex:1;min-height:0;overflow:hidden;display:flex;justify-content:center;background:var(--sand);padding-top:16px"><div style="width:640px;background:var(--card);box-shadow:0 2px 10px rgba(0,0,0,.08);padding:20px 40px">${title}${sys(0, 560)}${sys(0, 560, 8, ['C', 'G', 'C'])}${sys(0, 560)}</div>${pill(size === 'pagepill' ? 'page' : 'vertical')}${overlay}</div>
    ${keys ? divider() + (size !== 'large' ? piano88({ h, ...PLAY_MARKS }) : piano({ whites: 22, octave: 2, h, w: { 16: 'rh', 0: 'lh', 2: 'lh', 4: 'lh' }, dn: [16, 0, 2, 4] })) : ''}
    <div style="display:flex;align-items:center;justify-content:space-between;min-height:64px;padding:0 40px;background:var(--card);border-top:1px solid var(--line)"><span style="display:flex;gap:4px">${tbtn('eye', 'Sheet ⌄')}${tbtn('layers', 'Original')}${tbtn('ear', 'Listen')}</span><span style="display:flex;align-items:center;gap:8px">${rb('loop', 'plain')}${rb('prev', 'plain')}<span style="width:56px;height:56px;border-radius:99px;background:var(--honey);color:var(--honey-ink);display:grid;place-items:center">${ic('pause', 26, 2.6)}</span>${rb('next', 'plain')}<span class="chip" style="height:44px">♩ = 92</span>${rb('metro', 'plain')}</span>${tbtn('more', 'More')}</div>
  </div>`)

// A Practice page: the Chord finder, Chords
const finderBody = (chord) => `<div style="flex:1;min-height:0;display:grid;align-content:start;justify-items:center;gap:14px;padding:18px 16px;background:var(--paper)">
  <span class="chip" style="height:44px">Spelled in <b>C major</b></span>
  <div style="width:100%;min-height:340px;align-content:center;border-radius:20px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);padding:22px 16px;display:grid;justify-items:center;gap:6px">
  ${chord ? `<div style="font:600 44px var(--display)">${chord}</div><div style="color:var(--ink-soft)">C major · root position</div><div style="display:flex;gap:6px;margin-top:6px"><span class="chip">C</span><span class="chip">E</span><span class="chip">G</span></div>` : `<div style="font:600 26px var(--display)">Play or tap a chord</div><div style="color:var(--ink-soft);text-align:center">Hold three or more keys; the chord is named as you play.</div>`}</div></div>`
const finderBar = (o) => `<div class="bar">${rb('back')}<div class="t"><span>Chord finder</span></div><div class="tools">${kTools(o)}${rb('cable')}${rb('gear')}</div></div>`
const C_MAJOR = { w: { 23: 'lit', 25: 'lit', 27: 'lit' }, dn: [23, 25, 27] }
const finder = ({ keys = true, chord = 'C', lit = false } = {}) =>
  app(`${finderBar({ lit, shown: keys })}${finderBody(keys ? chord : '')}${keys ? divider() + piano88({ h: 56, ...C_MAJOR }) : strip()}<div style="height:34px;background:var(--card)"></div>`)

const chordsMain = `<div style="flex:1;min-height:0;overflow:hidden;padding:20px 40px;background:var(--paper)"><div style="background:var(--card);border-radius:20px;box-shadow:inset 0 0 0 1px var(--line);padding:24px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
  <div style="display:grid;gap:12px;align-content:start"><div style="font:600 64px/1 var(--display)">C</div><div class="soft">Major triad</div>
  <div style="display:flex;gap:8px"><span class="chip" style="height:44px">Root <b>C</b></span><span class="chip" style="height:44px">Chord <b>C</b></span><span class="chip" style="height:44px">Voicing <b>Close</b></span></div>
  <div class="soft" style="font-size:14px">Chord size</div><div class="seg" style="display:grid;grid-template-columns:repeat(5,1fr);text-align:center"><span class="on" style="min-height:44px;display:grid;place-items:center">Triad</span><span style="display:grid;place-items:center">7th</span><span style="display:grid;place-items:center">9th</span><span style="display:grid;place-items:center">11th</span><span style="display:grid;place-items:center">13th</span></div></div>
  <div style="display:grid;place-items:center">${sys(0, 300, 2, ['C'])}</div></div></div>`
const CHORD_ROLES = { w: { 23: 'rh', 25: 'lh', 27: 'wash' }, dn: [] }
const macChords = ({ keys = true } = {}) =>
  mac(`<div class="bar">${rb('back', 'plain')}<div class="t lg">Chords</div><div class="tools">${kTools({ shown: keys })}${rb('grid')}</div></div>
  <div style="display:flex;flex-direction:column;height:calc(100% - 88px)">${chordsMain}${keys ? divider() + piano88({ h: 145, ...CHORD_ROLES }) : ''}</div>`, 'Practice')

const menuAt = (pos, items) => `<div class="menu" style="${pos}"><div class="cap2">Pedals</div>${items.map(([name, small, on]) => `<div class="it ${on ? 'lit' : ''}">${ic('sustain', 18)}${name}<small>${small}</small></div>`).join('')}</div>`
const callout = (pos, text) => `<span class="note" style="${pos}">${text}</span>`

document.getElementById('s1').innerHTML = [
  fig('1.1', 'Phone, the Player playing', 'The 88 keys edge to edge right above the transport, 56 px tall; the right hand’s E and the left hand’s chord lit in their colours. Under the score, the divider.', phonePlayer()),
  fig('1.2', 'Laptop, the Player playing', 'All 88 keys across the window at a piano’s proportion (about 145 px), under the divider, over the transport. The chord held and Sustain in the bar.', macPlayer()),
].join('')

document.getElementById('s2').innerHTML = [
  fig('2.1', 'Phone bar', 'Close, the title and ✎; then Sustain, Keyboard (pressed: the keys show) and ⚙. No chord on a phone.', phonePlayer()),
  fig('2.2', 'Phone, keys hidden', 'Keyboard tapped: the keys fold into a thin “Keyboard” strip at the foot that brings them back at a tap (Songscription’s Score only); Sustain leaves the bar with them.', phonePlayer({ keys: false })),
  fig('2.3', 'Laptop bar, a chord held', '“Chord held C” as you hold C–E–G on the keys or a MIDI keyboard; gone when you let go.', macPlayer({ chord: 'C' })),
].join('')

document.getElementById('s3').innerHTML = [
  fig('3.1', 'Sustain down', 'Held by a finger, Space, a MIDI pedal or the score’s pedal while it plays: Sustain lit blue, as a key held down. A tap latches it the same way.', phonePlayer({ lit: true })),
  fig('3.2', 'All three: the menu', 'With Pedals: All three, ⌄ beside Sustain opens Soft and Sostenuto. Here the soft pedal is latched; it stays down when the menu closes, the dot on ⌄ showing it.', macPlayer({ three: true, latchedMore: true, overlay: menuAt('top:4px;right:120px', [['Soft', 'Latched', true], ['Sostenuto', 'Hold or tap', false]]) })),
].join('')

document.getElementById('s4').innerHTML = [
  fig('4.1', 'Dragging the divider', 'Drag it up: the keys grow taller (here 120 px), the score shorter. Remembered for this phone held upright.', phonePlayer({ h: 120, drag: true })),
  fig('4.2', 'Key size: Large', 'Larger keys scroll to follow the music; All keys never scroll.', macPlayer({ size: 'large', h: 170 })),
].join('')

document.getElementById('s5').innerHTML = [
  fig('5.1', 'Chord finder, phone', 'C major tapped on the keys; the stage names it. Sustain, Keyboard, MIDI and ⚙ in the bar.', finder()),
  fig('5.2', 'Chord finder, keys hidden', 'The stage takes the screen; the strip at the foot or the bar’s Keyboard brings the keys back. Nothing floats.', finder({ keys: false })),
  fig('5.3', 'Chords, laptop', 'The chord’s keys marked by role, no finger numbers under them.', macChords()),
].join('')

const pic = (label, svg, on) => `<div style="display:grid;justify-items:center;gap:4px;padding:8px 4px;border-radius:12px;border:1.5px solid ${on ? 'var(--ink)' : 'var(--line)'};background:${on ? 'var(--sand)' : 'var(--card)'};font-size:13px;font-weight:600;text-align:center">${svg}<span>${label}</span></div>`
const tiny = (n) => `<span style="display:block;width:64px;height:22px">${piano({ whites: n, h: 22, names: 'none' }).replace('class="pk"', 'class="pk slim"')}</span>`
const row = (name, line, control) => `<div style="display:grid;gap:8px;padding:12px 14px;border-top:1px solid var(--line)"><div><div style="font-weight:600">${name}</div><div style="font-size:14px;color:var(--ink-soft)">${line}</div></div>${control}</div>`
const tilesRow = (items) => `<div style="display:grid;grid-template-columns:repeat(${items.length},1fr);gap:8px">${items.join('')}</div>`
const settingsPage = app(`<div class="bar">${rb('back')}<div class="t"><span>On-screen piano</span></div></div><div style="flex:1;overflow:hidden;padding:4px 16px;background:var(--paper)">
  <div class="h2" style="padding:6px 0;font-weight:600">Keys and sound</div><div class="group" style="background:var(--card);border-radius:16px;box-shadow:inset 0 0 0 1px var(--line)">
  ${row('Key size', 'All keys fit the width; a larger size scrolls to follow the music.', tilesRow([pic('All keys', tiny(28), true), pic('Fit to music', tiny(12)), pic('Large', tiny(6))])).replace('border-top:1px solid var(--line)', 'border-top:0')}
  ${row('Note names', 'Which keys carry their note name.', tilesRow([pic('On every C', '', true), pic('On every key', ''), pic('Hidden', '')]))}
  ${row('Volume', 'How loud the keys you play sound.', '<div class="slider"></div>')}
  ${row('Pedals', 'Adds the soft and sostenuto pedals to the Sustain button’s menu.', tilesRow([pic('Sustain only', ic('sustain', 22), true), pic('All three', ic('sustain', 22).repeat(3))]))}
  </div></div>`)
document.getElementById('s6').innerHTML = [fig('6.1', 'Settings › On-screen piano', 'Key size first, All keys chosen. Further down: Chord symbol (“Names the chord you hold in the bar”), names on highlighted keys, Swipe, Play on selection, Position. Key depth and Collapse keyboard are gone.', settingsPage)].join('')

const shot = (src, alt, kind) => kind === 'phone'
  ? `<div class="dev phone"><div class="scr"><img src="${src}" alt="${alt}" style="width:100%;height:100%;object-fit:cover;object-position:top"></div></div>`
  : `<div class="dev mac"><div class="scr mac"><img src="${src}" alt="${alt}" style="width:100%;height:100%;object-fit:cover;object-position:top"></div></div>`
document.getElementById('s7').innerHTML = [
  fig('7.1', 'Player today', 'Keys inset under a rail: the pedal, − + and the sliders.', shot('before-player-phone.png', 'The Player today', 'phone')),
  fig('7.2', 'Player, this design', 'Slim 88 keys edge to edge; Sustain and Keyboard in the bar.', phonePlayer()),
  fig('7.3', 'Chords today', 'Finger circles under the keys and the rail with ‹ › − + ⚙ Hide.', shot('before-chords-laptop.png', 'Chords today', 'mac')),
  fig('7.4', 'Chords, this design', 'The keys alone, at the foot, under the divider.', macChords()),
].join('')

const pagePlayer = macPlayer({ size: 'pagepill' })
document.getElementById('s8').innerHTML = [
  fig('8.1', 'Phone, Vertical scroll', 'The sheet’s one pill at its foot’s right: Page view · Vertical scroll · Panorama, the one chosen filled.', phonePlayer()),
  fig('8.2', 'Laptop, Page view', 'In Page view the zoom joins the same pill: − 100 % + and Fit the page to the width. Always in sight, so it never appears under a finger.', pagePlayer),
].join('')
