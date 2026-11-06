// R33 screens, after the R32 helpers (icons, frames, the score system, the bar).
Object.assign(P, {
  hide: '<path d="m6 9 6 6 6-6"/>',
  plusc: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
})

const LETTERS = 'CDEFGAB'
const WHITE_CAPS = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '’']
const BLACK_CAPS = { 0: 'W', 1: 'E', 3: 'T', 4: 'Y', 5: 'U', 7: 'O', 8: 'P' }
/**
 * The keys as R33 draws them. `w`: white marks by index ('lit', 'rh', 'lh', 'wash', 'bad', 'held'), `dn`: the white keys
 * down, `b`: black marks by the white key they follow, `names`: 'c' | 'all' | 'none', `caps`: computer letters from
 * `capsFrom` (the white index of the C the letters start on).
 */
const piano = ({ whites = 15, octave = 3, w = {}, dn = [], b = {}, bdn = [], names = 'c', caps = false, capsFrom = 7, h = 150 } = {}) => {
  const bw = 58 / whites
  const white = Array.from({ length: whites }, (_, i) => {
    const letter = LETTERS[i % 7]
    const name = names === 'all' || (names === 'c' && letter === 'C') ? `${letter}${letter === 'C' || names === 'all' ? (letter === 'C' ? octave + Math.floor(i / 7) : '') : ''}` : ''
    const cap = caps && i >= capsFrom && i - capsFrom < WHITE_CAPS.length ? `<span class="cap">${WHITE_CAPS[i - capsFrom]}</span>` : ''
    const cls = [w[i] ?? '', dn.includes(i) ? 'dn' : ''].join(' ')
    return `<div class="w ${cls}">${cap}<span>${name}</span></div>`
  }).join('')
  const black = Array.from({ length: whites - 1 }, (_, i) => {
    if (![0, 1, 3, 4, 5].includes(i % 7)) return ''
    const at = i - capsFrom
    const cap = caps && BLACK_CAPS[at] ? `<span class="cap">${BLACK_CAPS[at]}</span>` : ''
    return `<div class="b ${b[i] ?? ''} ${bdn.includes(i) ? 'dn' : ''}" style="left:calc(${((i + 1) * 100) / whites}% - ${bw / 2}%);width:${bw}%">${cap}</div>`
  }).join('')
  return `<div class="pk" style="height:${h}px"><div class="felt"></div>${white}${black}</div>`
}

/** One brass pedal on the lyre: sinks while down. */
const pedal = (name, down = false) => `<span class="pedal ${down ? 'dn' : ''}" role="button" aria-pressed="${down}" aria-label="${name} pedal">
  <svg width="44" height="30" viewBox="0 0 44 30" aria-hidden="true" style="overflow:visible;transform:translateY(${down ? 3 : 0}px)">
    <rect x="18" y="0" width="8" height="${down ? 7 : 10}" rx="1.5" fill="var(--brass-shank)"/>
    <path d="M4 ${down ? 8 : 10}h36l3 11a6 6 0 0 1-6 7H7a6 6 0 0 1-6-7Z" fill="${down ? 'var(--brass-dn)' : 'var(--brass)'}" stroke="#6b4f18" stroke-width="1.2"/>
    <path d="M7 ${down ? 12 : 14}h30" stroke="#f3dea4" stroke-width="1.4" opacity="${down ? 0.35 : 0.8}"/>
  </svg><span>${name}</span></span>`

/** A: the rail with the pedals on their lyre; the latch's light on the lyre. */
const railA = ({ chord = '', three = false, sus = false, soft = false, latched = false, wide = false, hide = false } = {}) => `<div class="rail" style="padding:0 ${wide ? 20 : 6}px">
  <span class="chord">${chord}</span>
  <span class="lyre">${latched ? '<i class="led on" title="Sustain latched"></i>' : ''}${three ? pedal('Soft', soft) + pedal('Sost.') : ''}${pedal('Sustain', sus || latched)}</span>
  <span class="end">${wide ? rb('prev', 'plain') + rb('next', 'plain') : ''}${rb('minus', 'plain')}${rb('plusc', 'plain')}${rb('gear', 'plain')}${hide ? rb('hide', 'plain') : ''}</span></div>`

/** B: a strip with a lit Sustain toggle, the controls at its end. */
const railB = ({ chord = '', sus = false, wide = false, hide = false } = {}) => `<div class="rail" style="grid-template-columns:auto minmax(0,1fr) max-content;gap:8px;padding:0 ${wide ? 20 : 8}px">
  <span class="sus ${sus ? 'on' : ''}"><i></i>Sustain</span><span class="chord">${chord}</span>
  <span class="end">${wide ? rb('prev', 'plain') + rb('next', 'plain') : ''}${rb('minus', 'plain')}${rb('plusc', 'plain')}${rb('gear', 'plain')}${hide ? rb('hide', 'plain') : ''}</span></div>`

const finderBar = `<div class="bar">${rb('back')}<div class="t"><span>Chord finder</span></div><div class="tools">${rb('gear')}</div></div>`
const finderBody = (chord) => `<div style="flex:1;min-height:0;display:grid;align-content:start;justify-items:center;gap:14px;padding:18px 16px;background:var(--paper)">
  <span class="chip" style="height:44px">Spelled in <b>C major</b></span>
  <div style="width:100%;border-radius:20px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);padding:22px 16px;display:grid;justify-items:center;gap:6px">
  ${chord ? `<div style="font:600 44px var(--display)">${chord}</div><div style="color:var(--ink-soft)">C major · root position</div><div style="display:flex;gap:6px;margin-top:6px"><span class="chip">C</span><span class="chip">E</span><span class="chip">G</span></div>` : `<div style="font:600 26px var(--display)">Play or tap a chord</div><div style="color:var(--ink-soft);text-align:center">Hold three or more keys; the chord is named as you play.</div>`}</div></div>`
const foot = `<div style="height:34px;background:var(--rail)"></div>`
const finder = (keysOpts, railOpts, rail = railA) => app(`${finderBar}${finderBody(railOpts.chord)}${piano(keysOpts)}${rail({ hide: true, ...railOpts })}${foot}`)

const macFinder = (keysOpts, railOpts, rail = railA) => mac(`<div class="bar">${rb('back', 'plain')}<div class="t lg">Chord finder</div><div class="tools">${rb('gear')}</div></div>
  <div style="display:flex;flex-direction:column;height:calc(100% - 104px)">${finderBody(railOpts.chord)}${piano({ whites: 29, octave: 2, h: 150, ...keysOpts })}${rail({ wide: true, hide: true, ...railOpts })}</div>`, 'Practice')

const macPlayer = mac(`<div class="bar">${rb('x', 'plain')}<div class="t lg">Hot Cross Buns <span class="rb sm" style="color:var(--ink)">${ic('pen', 20)}</span></div><div class="tools">${rb('keys', 'on')}${rb('gear')}</div></div>
  <div style="display:flex;flex-direction:column;height:calc(100% - 104px)">
    <div style="flex:1;min-height:0;overflow:hidden;display:flex;justify-content:center;background:var(--sand);padding-top:16px"><div style="width:640px;background:var(--card);box-shadow:0 2px 10px rgba(0,0,0,.08);padding:20px 40px">${title}${sys(0, 560)}${sys(0, 560, 8, ['C', 'G', 'C'])}</div></div>
    ${piano({ whites: 29, octave: 2, h: 150, w: { 14: 'rh', 16: 'rh', 18: 'rh', 7: 'lh' }, dn: [14, 16, 18, 7], caps: true, capsFrom: 14 })}${railA({ chord: 'C', sus: true, wide: true })}
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;min-height:64px;background:var(--card);border-top:1px solid var(--line)">${rb('loop', 'plain')}${rb('prev', 'plain')}<span style="width:56px;height:56px;border-radius:99px;background:var(--honey);color:var(--honey-ink);display:grid;place-items:center">${ic('pause', 26, 2.6)}</span>${rb('next', 'plain')}<span class="chip" style="height:44px">♩ = 92</span>${rb('metro', 'plain')}</div>
  </div>`)

document.getElementById('s1').innerHTML = [
  fig('1.1', 'Phone, at rest', 'Ivory and ebony keys under the felt strip, the note name on every C. Nothing is lit.', finder({}, {})),
  fig('1.2', 'Phone, C major held', 'C, E and G pressed: each sinks and lights sky blue. The chord is named at the rail’s start.', finder({ w: { 7: 'lit', 9: 'lit', 11: 'lit' }, dn: [7, 9, 11] }, { chord: 'C' })),
  fig('1.3', 'Laptop, the Player playing', 'Right hand in its colour, left hand in its own, each key down sunk; the computer letters as key caps from the C the letters start on. The sustain follows the score’s pedal.', macPlayer),
  fig('1.4', 'Marks on the new keys', 'A wrong key in red, a key the pedal alone holds ringed, a scale’s wash at rest: every mark reads as before on the ivory.', finder({ w: { 7: 'rh', 9: 'bad', 11: 'held', 12: 'wash', 13: 'wash' }, dn: [7, 9] }, { chord: '' })),
].join('')

document.getElementById('s2').innerHTML = [
  fig('2.1', 'A · Sustain alone, held', 'The sustain sinks while you hold it (or Space, or a MIDI pedal). The ⚙ and Hide stay in sight at the rail’s end; the pedal gives way left on a narrow phone.', finder({ w: { 7: 'lit', 9: 'held', 11: 'held' }, dn: [7] }, { chord: 'C', sus: true })),
  fig('2.2', 'A · All three, sustain latched', 'Pedals: All three. A tap latched the sustain: the light on the lyre stays lit until the next tap. The soft pedal is held too.', finder({ w: { 7: 'held', 9: 'held', 11: 'held' } }, { chord: 'C', three: true, soft: true, latched: true })),
  fig('2.3', 'A · Laptop', 'The rail spans the keys; the pedals centred, ‹ › an octave, − + the key size, ⚙ the settings.', macFinder({ w: { 14: 'lit', 16: 'lit', 18: 'lit' }, dn: [14, 16, 18] }, { chord: 'C', three: true, sus: true })),
  fig('2.4', 'B · A lit Sustain toggle', 'OnlinePianist’s way: a Sustain button at the rail’s start, lit while the pedal is down. Hold or tap as in A; no place for soft or sostenuto.', finder({ w: { 7: 'lit', 9: 'held', 11: 'held' }, dn: [7] }, { chord: 'C', sus: true }, railB)),
].join('')

const tile = (label, pic, on) => `<div style="display:grid;justify-items:center;gap:4px;padding:8px 4px;border-radius:12px;border:1.5px solid ${on ? 'var(--ink)' : 'var(--line)'};background:${on ? 'var(--sand)' : 'var(--card)'};font-size:13px;font-weight:600;text-align:center">${pic}${label}</div>`
const mini = (whites, labels = '') => `<span style="position:relative;display:flex;width:60px;height:26px;gap:1px;background:var(--bed);padding-top:2px">${Array.from({ length: whites }, (_, i) => `<i style="flex:1;background:var(--ivory);border-radius:0 0 2px 2px;display:grid;align-items:end;justify-content:center;font:600 6px var(--sans);font-style:normal;color:#3a322b">${labels === 'all' ? 'CDEFGAB'[i % 7] : labels === 'c' && i % 7 === 0 ? 'C' : ''}</i>`).join('')}${Array.from({ length: whites - 1 }, (_, i) => ([0, 1, 3, 4, 5].includes(i % 7) ? `<b style="position:absolute;top:2px;left:calc(${((i + 1) * 100) / whites}% - ${29 / whites}%);width:${58 / whites}%;height:55%;background:var(--ebony)"></b>` : '')).join('')}</span>`
const paddles = (n) => `<span style="display:flex;gap:3px;align-items:end;height:26px">${Array.from({ length: n }, () => '<svg width="22" height="15" viewBox="0 0 44 30"><rect x="18" y="0" width="8" height="10" rx="1.5" fill="var(--brass-shank)"/><path d="M4 10h36l3 11a6 6 0 0 1-6 7H7a6 6 0 0 1-6-7Z" fill="var(--brass)" stroke="#6b4f18" stroke-width="1.6"/></svg>').join('')}</span>`
const pics = (items, on) => `<div style="display:grid;grid-template-columns:repeat(${items.length},1fr);gap:8px">${items.map(([label, pic], i) => tile(label, pic, i === on)).join('')}</div>`
const sheetBody = (computer, side = false) => `${side ? '' : '<div class="grip"></div>'}<div style="display:flex;align-items:center"><b style="font:600 22px var(--display)">Piano</b><span style="margin-left:auto">${rb('x', 'plain')}</span></div>
  <div class="row2"><div class="lbl">Key size</div>${pics([['Fit to music', mini(10)], ['Large', mini(5)], ['Full keyboard', mini(21)]], 0)}</div>
  <div class="row2"><div class="lbl">Note names</div>${pics([['On every C', mini(8, 'c')], ['On every key', mini(8, 'all')], ['Hidden', mini(8)]], 0)}</div>
  <div class="row2"><div style="display:flex;justify-content:space-between"><span class="lbl">Volume</span><span class="sub">100 %</span></div><div class="slider"></div></div>
  <div class="row2"><div class="lbl">Pedals</div>${pics([['Sustain only', paddles(1)], ['All three', paddles(3)]], 0)}</div>
  ${computer ? `<div class="row2" style="grid-template-columns:1fr auto;align-items:center"><span class="lbl">Play with computer keyboard</span>${'<span style="width:52px;height:32px;border-radius:99px;background:var(--grass-ink);position:relative"><i style="position:absolute;right:3px;top:3px;width:26px;height:26px;border-radius:99px;background:#fff"></i></span>'}</div>` : ''}
  <div class="row2" style="grid-template-columns:1fr auto;align-items:center;min-height:44px"><span class="lbl">All piano settings</span>${ic('chev', 18)}</div>`
const phoneSheet = app(`${finderBar}${finderBody('')}<div style="position:absolute;inset:0;background:var(--scrim);z-index:5"></div><div class="psheet">${sheetBody(false)}</div>`)
const macSheet = mac(`<div class="bar">${rb('back', 'plain')}<div class="t lg">Chord finder</div><div class="tools">${rb('gear')}</div></div>
  <div style="position:relative;display:flex;flex-direction:column;height:calc(100% - 104px)">${finderBody('')}${piano({ whites: 29, octave: 2, h: 150 })}${railA({ wide: true, hide: true })}
  <div style="position:absolute;inset:0;background:var(--scrim);z-index:5"></div><div class="psheet" style="left:auto;right:0;top:0;bottom:0;width:440px;border-radius:24px 0 0 24px;align-content:start">${sheetBody(true, true)}</div></div>`, 'Practice')

document.getElementById('s3').innerHTML = [
  fig('3.1', 'Phone, the Piano sheet', 'Key size, Note names, Volume and Pedals, then All piano settings for the rest (depth, chord symbol, swipe, position).', phoneSheet),
  fig('3.2', 'Laptop, the Piano sheet', 'The same sheet from the right, with Play with computer keyboard: on, each key carries the letter that plays it.', macSheet),
].join('')

const before = `<div class="dev phone"><div class="scr"><img src="before-phone.png" alt="The Chord finder today" style="width:100%;height:100%;object-fit:cover;object-position:top"></div></div>`
document.getElementById('s4').innerHTML = [
  fig('4.1', 'Today', 'Flat keys; the rail’s ⚙ scrolled out of sight on the phone.', before),
  fig('4.2', 'This design', 'Ivory and ebony under the felt; the pedal, − +, ⚙ and Hide all in sight.', finder({ w: { 7: 'lit', 9: 'lit', 11: 'lit' }, dn: [7, 9, 11] }, { chord: 'C' })),
].join('')
