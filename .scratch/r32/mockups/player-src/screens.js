// R32 screens, after the R31 helpers (icons, frames, the score system, the bar).
Object.assign(P, {
  plusc: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  rows: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18"/>',
  note: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
});

const WH = 15
/** The keys, as the app draws them: honey while sounding, outlined where only the pedal holds them. */
const keys = (lit = [], held = [], whites = WH, h = 132) => `<div style="position:relative;height:${h}px;display:flex;background:var(--line);gap:1px">${Array.from({ length: whites }, (_, i) => `<div style="flex:1;background:${lit.includes(i) ? 'var(--sky)' : '#fbf9f6'};${held.includes(i) ? 'box-shadow:inset 0 0 0 3px var(--sky-ink);' : ''}border-radius:0 0 5px 5px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;font:600 12px var(--sans);color:#3a322b">${i % 7 === 0 ? 'C' + (3 + i / 7) : ''}</div>`).join('')}${Array.from({ length: whites - 1 }, (_, i) => [0, 1, 3, 4, 5].includes(i % 7) ? `<div style="position:absolute;top:0;left:calc(${(i + 1) * 100 / whites}% - ${29 / whites}%);width:${58 / whites}%;height:62%;background:#2a231d;border-radius:0 0 4px 4px"></div>` : '').join('')}<div style="position:absolute;inset:0 0 auto;height:8px;background:linear-gradient(rgba(0,0,0,.12),transparent)"></div></div>`

/** One brass pedal on the lyre: sinks and glows while down; a honey dot while latched. */
const pedal = (name, down = false, latched = false, w = 44) => `<span role="button" aria-pressed="${down}" aria-label="${name} pedal" style="display:grid;justify-items:center;align-content:end;gap:2px;min-width:52px;min-height:48px;position:relative">
  <svg width="${w}" height="30" viewBox="0 0 44 30" aria-hidden="true" style="overflow:visible;transform:translateY(${down ? 3 : 0}px);transition:transform .12s">
    ${down ? '<ellipse cx="22" cy="27" rx="22" ry="5" fill="var(--honey)" opacity=".75"/>' : ''}
    <rect x="18" y="0" width="8" height="${down ? 7 : 10}" rx="1.5" fill="${down ? '#6b4f18' : '#8a6a28'}"/>
    <path d="M4 ${down ? 8 : 10}h36l3 11a6 6 0 0 1-6 7H7a6 6 0 0 1-6-7Z" fill="${down ? '#b98f36' : '#d9b665'}" stroke="#6b4f18" stroke-width="1.2"/>
    <path d="M7 ${down ? 12 : 14}h30" stroke="#f3dea4" stroke-width="1.4" opacity="${down ? .35 : .8}"/>
    ${latched ? '<circle cx="38" cy="4" r="5" fill="var(--honey)" stroke="var(--honey-ink)" stroke-width="1.5"/>' : ''}
  </svg>
  <span style="font:600 11px var(--sans);color:${down ? '#f3dea4' : '#cbbfae'}">${name}</span></span>`

/** The pedal rail under the keys: the chord at its start, the lyre centred, − + ⚙ at its end. */
const rail = ({ chord = '', three = false, sus = false, soft = false, latched = false, wide = false } = {}) => `<div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;min-height:56px;padding:0 ${wide ? 24 : 6}px;background:var(--sand);border-top:1px solid rgba(0,0,0,.08)">
  <b style="font:600 18px var(--display);padding-left:8px">${chord}</b>
  <span style="display:flex;gap:${three ? 6 : 0}px;padding:2px 14px 4px;border-radius:12px 12px 0 0;background:linear-gradient(#3a302a,#2a231d)">${three ? pedal('Soft', soft) + pedal('Sostenuto', false) : ''}${pedal('Sustain', sus, latched)}</span>
  <span style="display:flex;justify-content:flex-end">${wide ? rb('prev', 'plain') + rb('next', 'plain') : ''}${rb('minus', 'plain')}${rb('plusc', 'plain')}${rb('gear', 'plain')}</span></div>`

const tempo = `<span class="chip" style="height:44px;justify-content:center;font-weight:600"><span style="font-family:var(--music);font-size:18px">♩</span>&nbsp;= 92</span>`
const transportRow = (playing) => `<div style="display:flex;align-items:center;justify-content:space-between;min-height:60px;padding:2px 10px">${rb('loop', 'plain')}${rb('rotate', 'plain')}${rb('prev', 'plain')}<span style="width:56px;height:56px;border-radius:99px;background:var(--honey);color:var(--honey-ink);display:grid;place-items:center">${playing ? ic('pause', 26, 2.6) : ic('play', 26)}</span>${rb('next', 'plain')}${tempo}${rb('metro', 'plain')}</div>`
const tools = (safe = true) => `<div style="display:flex;justify-content:space-around;align-items:center;min-height:56px;padding:0 8px ${safe ? 34 : 0}px;border-top:1px solid var(--line)">${tbtn('eye', 'Sheet ⌄')}${tbtn('updown', 'Key C')}${tbtn('layers', 'Original')}${tbtn('ear', 'Listen')}${tbtn('more', 'More')}</div>`
/** The tip: a slim capsule on the dock's top edge, over whatever is above it. */
const tip = `<div style="position:absolute;left:50%;top:-54px;transform:translateX(-50%);display:flex;align-items:center;gap:2px;padding:0 2px 0 14px;height:44px;border-radius:999px;background:var(--card);box-shadow:0 4px 14px rgba(0,0,0,.14),inset 0 0 0 1px var(--line);font-size:14px;white-space:nowrap;z-index:4"><span style="width:6px;height:6px;border-radius:9px;background:var(--honey);margin-right:6px"></span>Press Play to hear the song.<span class="rb sm plain" aria-label="Dismiss" style="width:40px;height:40px">${ic('x', 16)}</span></div>`
const dockPhone = (playing, withTip) => `<div style="position:relative;background:var(--card);border-top:1px solid var(--line)">${withTip ? tip : ''}${transportRow(playing)}${tools()}</div>`
const score = (lines = 3) => `<div style="flex:1;min-height:0;overflow:hidden;background:var(--paper);padding:0 16px">${title}${sys(0)}${lines > 1 ? sys(0, 361, 8, ['C', 'G', 'C']) : ''}${lines > 2 ? sys(0) : ''}${lines > 3 ? sys(0, 361, 8, ['G', 'C']) : ''}</div>`

const phonePlayer = ({ piano = false, playing = false, withTip = false, chord = '', lit = [], held = [], sus = false } = {}) =>
  app(`${bar}${score(piano ? 2 : 4)}${piano ? keys(lit, held) + rail({ chord, sus }) : ''}${dockPhone(playing, withTip)}`)

const macPlayer = mac(`<div class="bar">${rb('x', 'plain')}<div class="t lg">Hot Cross Buns <span class="rb sm" style="color:var(--ink)">${ic('pen', 20)}</span></div><div class="tools">${rb('keys', 'on')}${rb('gear')}</div></div>
  <div style="display:flex;flex-direction:column;height:calc(100% - 72px)">
    <div style="flex:1;min-height:0;overflow:hidden;display:flex;justify-content:center;background:var(--sand);padding-top:16px"><div style="width:640px;background:var(--card);box-shadow:0 2px 10px rgba(0,0,0,.08);padding:20px 40px">${title}${sys(0, 560)}${sys(0, 560, 8, ['C', 'G', 'C'])}</div></div>
    ${keys([7, 9, 11], [4], 29, 150)}${rail({ chord: 'C', sus: true, wide: true })}
    <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;min-height:64px;padding:0 24px;background:var(--card);border-top:1px solid var(--line)">
      <div style="display:flex;gap:8px">${['Sheet ⌄', 'Key C', 'Original', 'Listen'].map((c) => `<span class="chip" style="height:44px">${c}</span>`).join('')}</div>
      <div style="display:flex;align-items:center;gap:8px">${rb('loop', 'plain')}${rb('rotate', 'plain')}${rb('prev', 'plain')}<span style="width:56px;height:56px;border-radius:99px;background:var(--honey);color:var(--honey-ink);display:grid;place-items:center">${ic('pause', 26, 2.6)}</span>${rb('next', 'plain')}${tempo}${rb('metro', 'plain')}</div>
      <div style="display:flex;justify-content:flex-end">${rb('more', 'plain')}</div>
    </div>
  </div>`)

document.getElementById('s1').innerHTML = [
  fig('1.1', 'Phone, at rest', 'The score takes everything between the bar and the transport. The tip floats on the transport’s edge, over the score, and is gone for good once dismissed or followed.', phonePlayer({ withTip: true })),
  fig('1.2', 'Phone, playing with the keyboard', 'The keys directly beneath the score; the pedal rail beneath them, the sustain down with the score’s pedal; the chord held named at its start. The tempo reads ♩ = 92.', phonePlayer({ piano: true, playing: true, chord: 'C', lit: [7, 9, 11], held: [4], sus: true })),
  fig('1.3', 'Laptop, playing', 'The page centred, the keyboard and its pedal rail beneath it, one dock row: song tools at the start, the transport centred, More at the end.', macPlayer),
].join('')

const pianoOnly = (opts, lit = [], held = []) => app(`<div style="flex:1;background:var(--paper)"></div>${keys(lit, held)}${rail(opts)}<div style="height:34px;background:var(--card)"></div>`)
const sideRail = (sus) => app(`<div style="flex:1;background:var(--paper)"></div><div style="display:flex">${'<div style="flex:1">' + keys([7, 9, 11], [], 12) + '</div>'}<div style="width:64px;display:grid;align-content:center;justify-items:center;gap:8px;background:linear-gradient(#3a302a,#2a231d);padding:6px 0">${pedal('Soft')}${pedal('Sostenuto')}${pedal('Sustain', sus)}</div></div><div style="display:flex;justify-content:flex-end;padding:4px 8px;background:var(--sand)">${rb('minus', 'plain')}${rb('plusc', 'plain')}${rb('gear', 'plain')}</div><div style="height:34px;background:var(--card)"></div>`)

document.getElementById('s2').innerHTML = [
  fig('2.1', 'A · Sustain alone, released', 'The default: one sustain pedal centred beneath the keys. Released, nothing is lit or outlined.', pianoOnly({})),
  fig('2.2', 'A · The score holds the sustain', 'While the music plays the sustain follows the score’s Ped. marks: it sinks and glows, and keys sounding only under the pedal are outlined.', pianoOnly({ chord: 'Am', sus: true }, [5, 7, 9], [2])),
  fig('2.3', 'A · All three, sustain latched', 'With Pedals: All three, soft and sostenuto stand to its left. A tap latched the sustain (the honey dot); a second tap releases it. Here the soft pedal is held as well.', pianoOnly({ chord: 'C', three: true, sus: true, soft: true, latched: true }, [0, 2, 4])),
  fig('2.4', 'B · A pedal column beside the keys', 'The alternative: the three pedals stacked at the keyboard’s right edge, the key size and settings beneath. It costs the keys a column on a phone.', sideRail(true)),
].join('')

const sheetOver = (titleText, back, body, top = 96) => app(`<div style="opacity:.35">${bar}</div><div style="position:absolute;inset:0;background:var(--scrim)"></div><div class="sheet" style="top:${top}px;align-content:start;overflow:hidden"><div class="grip"></div><div style="display:flex;align-items:center;gap:8px">${back ? rb('back', 'plain') : ''}<b style="font:600 22px var(--display)">${titleText}</b><span style="margin-left:auto">${rb('x', 'plain')}</span></div>${body}</div>`)
const navRow = ([p, i, n, d, v]) => `<div class="row"><span class="tile ${p}">${ic(i, 20)}</span><div class="txt"><div class="n">${n}</div><div class="d">${d}</div></div><span style="color:var(--ink-soft);white-space:nowrap;font-size:14px">${v}</span>${ic('chev', 18)}</div>`
const sw = (on) => `<span style="width:52px;height:32px;border-radius:99px;background:${on ? 'var(--grass-ink)' : 'var(--line)'};position:relative;flex:none"><i style="position:absolute;${on ? 'right' : 'left'}:3px;top:3px;width:26px;height:26px;border-radius:99px;background:#fff"></i></span>`
const seg = (items, on) => `<div class="seg" style="width:100%;display:grid;grid-template-columns:repeat(${items.length},1fr);text-align:center">${items.map((x, i) => `<span class="${i === on ? 'on' : ''}" style="min-height:44px;display:grid;place-items:center;padding:2px">${x}</span>`).join('')}</div>`
const opt = (name, line, control) => `<div style="display:grid;gap:8px;padding:12px 14px;border-top:1px solid var(--line)"><div><div style="font-weight:600">${name}</div><div style="font-size:14px;color:var(--ink-soft)">${line}</div></div>${control}</div>`
const swRow = (name, line, on) => `<div style="display:flex;align-items:center;gap:12px;min-height:60px;padding:8px 14px;border-top:1px solid var(--line)"><div style="flex:1;min-width:0"><div style="font-weight:600">${name}</div><div style="font-size:14px;color:var(--ink-soft)">${line}</div></div>${sw(on)}</div>`
const group = (head, inner) => `<div><div class="h2" style="padding-top:6px">${head}</div><div class="group">${inner.replace('border-top:1px solid var(--line)', 'border-top:0')}</div></div>`
const pic = (label, svg, on) => `<div style="display:grid;justify-items:center;gap:4px;padding:8px 4px;border-radius:12px;border:1.5px solid ${on ? 'var(--ink)' : 'var(--line)'};background:${on ? 'var(--sand)' : 'var(--card)'};font-size:13px;font-weight:600;text-align:center">${svg}<span>${label}</span></div>`
const tiles = (items) => `<div style="display:grid;grid-template-columns:repeat(${items.length},1fr);gap:8px">${items.join('')}</div>`
const mini = (kind) => `<svg width="60" height="34" viewBox="0 0 60 34" aria-hidden="true" style="color:var(--ink)">${kind === 'page' ? '<rect x="17" y="2" width="26" height="30" rx="2" fill="none" stroke="currentColor"/><path d="M21 9h18M21 14h18M21 19h18M21 24h12" stroke="currentColor" stroke-width=".8"/>' : kind === 'vertical' ? '<path d="M6 6h48M6 14h48M6 22h48M6 30h48" stroke="currentColor"/><path d="m56 22 0 9m-3-3 3 3 3-3" stroke="currentColor" fill="none"/>' : kind === 'panorama' ? '<path d="M2 14h56M2 20h56" stroke="currentColor"/><path d="M18 28h24m-21-3-3 3 3 3m18-6 3 3-3 3" stroke="currentColor" fill="none"/>' : kind === 'fit' ? '<rect x="2" y="8" width="56" height="20" fill="none" stroke="currentColor"/>' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<path d="M${2 + i * 5.6} 8v20" stroke="currentColor" stroke-width=".6"/>`).join('') : kind === 'large' ? '<rect x="2" y="8" width="56" height="20" fill="none" stroke="currentColor"/>' + [1, 2, 3, 4].map((i) => `<path d="M${2 + i * 11.2} 8v20" stroke="currentColor" stroke-width=".6"/>`).join('') : kind === 'all' ? '<rect x="2" y="12" width="56" height="12" fill="none" stroke="currentColor"/>' + Array.from({ length: 27 }, (_, i) => `<path d="M${2 + (i + 1) * 2.07} 12v12" stroke="currentColor" stroke-width=".4"/>`).join('') : kind === 'one' ? '<path d="M24 10h12l2 10a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4Z" fill="#d9b665" stroke="#6b4f18"/>' : '<path d="M4 10h12l2 10a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z M24 10h12l2 10a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4Z M44 10h12l2 10a4 4 0 0 1-4 4H46a4 4 0 0 1-4-4Z" fill="#d9b665" stroke="#6b4f18"/>'}</svg>`

const settingsMain = sheetOver('Player settings', false, `<div class="group">${[
  ['p-lilac', 'eye', 'Score view', 'Layout, cursor and what appears on the score', 'Vertical'],
  ['p-grass', 'sliders', 'Playback', 'Count-in, pedalling, metronome and practice tempo', 'Audible'],
  ['p-sky', 'rows', 'Staves', 'Which staves sound and appear, and their levels', 'All'],
  ['p-yellow', 'note', 'Accompaniment', 'Pattern, chord voicing and swing', 'Broken'],
  ['p-sand', 'keys', 'On-screen piano', 'Key size, note names and pedals', 'Fit to music'],
].map(navRow).join('')}</div>`)

const scoreView = sheetOver('Score view', true, `<div class="group">${opt('Layout', 'How the systems are arranged on screen.', tiles([pic('Page', mini('page')), pic('Vertical scroll', mini('vertical'), true), pic('Panorama', mini('panorama'))]))}<div style="padding:0 14px 12px;font-size:14px;color:var(--ink-soft)"><b style="color:var(--ink)">Vertical scroll:</b> systems down the screen at full width.</div></div>
  <div class="group">${opt('Show on the score', 'Markings drawn over and under the staves.', `<div style="display:flex;gap:8px;flex-wrap:wrap">${['Chord symbols', 'Lyrics', 'Fingering', 'Chord positions', 'Note names'].map((x, i) => `<span class="chip ${i < 2 ? 'on' : ''}" style="height:44px">${x}</span>`).join('')}</div>`).replace('border-top:1px solid var(--line)', 'border-top:0')}${opt('Cursor', 'How the playhead moves with the music.', seg(['Off', 'By note', 'Continuous'], 2))}${swRow('Follow the music', 'Keeps the passage being played in view.', true)}</div>`, 80)

const playbackPage = sheetOver('Playback', true, `<div class="group">${opt('Count-in', 'A bar counted before the music begins.', seg(['Off', 'Audible', 'Silent'], 1)).replace('border-top:1px solid var(--line)', 'border-top:0')}${opt('Pedalling', 'How the sustain pedal is played back.', seg(['As marked', 'Automatic', 'Off'], 0))}${opt('Metronome level', 'Volume of the click against the music.', '<div style="height:6px;border-radius:9px;background:linear-gradient(90deg,var(--ink) 70%,var(--line) 70%)"></div>')}</div>
  <div class="group">${opt('Speed training step', 'Tempo increase after each clean pass.', seg(['2%', '5%', '10%'], 1)).replace('border-top:1px solid var(--line)', 'border-top:0')}${opt('Other hand in practice', 'How the hand you are not practising appears.', seg(['Show', 'Dim', 'Hide'], 1))}</div>`, 80)

const pianoPage = sheetOver('On-screen piano', true, `${group('Keys', `${opt('Key size', 'How many keys fit across the screen.', tiles([pic('Fit to music', mini('fit'), true), pic('Large', mini('large')), pic('Full keyboard', mini('all'))]))}${opt('Note names', 'Which keys carry their note name.', seg(['On every C', 'On every key', 'Hidden'], 0))}`)}
  ${group('While you play', `${swRow('Chord symbol', 'Names the chord you hold at the start of the pedal rail.', true)}${opt('Pedals', 'Adds the soft and sostenuto pedals beside the sustain.', tiles([pic('Sustain only', mini('one'), true), pic('All three', mini('three'))]))}${opt('Swipe gesture', 'Scrolls the keyboard, or plays every key your finger crosses.', seg(['Scroll', 'Glissando'], 0))}`)}`, 70)

document.getElementById('s3').innerHTML = [
  fig('3.1', 'Player settings', 'Four pages in the order they are used, each with a line on what it controls and its current choice; last, a link to the On-screen piano page in Settings, the one home of every keyboard’s settings (Back returns to the Player).', settingsMain),
  fig('3.2', 'Score view', 'Layout as pictures, the one chosen described beneath; what appears on the score; the cursor; following the music.', scoreView),
  fig('3.3', 'Playback', 'Count-in, pedalling and the metronome first; speed training and the other hand after. Each option with its line.', playbackPage),
  fig('3.4', 'Settings › On-screen piano', 'The one home of the keyboard’s settings, opened from the Player’s link and every piano rail’s ⚙: Keys first (size, note names), then While you play (chord symbol, pedals, swipe gesture); Placement (position, Collapse keyboard) follows further down.', pianoPage),
].join('')

const before = `<div class="dev phone"><div class="scr"><img src="../shots/before/play-hot-cross-buns-click-Play-iphone-17-pro-light-en.png" alt="The Player today, playing" style="width:100%;height:100%;object-fit:cover;object-position:top"></div></div>`
document.getElementById('s4').innerHTML = [
  fig('4.1', 'Today', 'A 56 px band of controls and a lone pedal above the keys; the tip’s row and two empty gaps between score and keyboard.', before),
  fig('4.2', 'This design', 'The keys directly under the score, the controls and pedals on the rail beneath them.', phonePlayer({ piano: true, playing: true, chord: 'C', lit: [7, 9, 11], sus: true })),
].join('')

// ——— theme and feedback (kept in this browser) ———
document.getElementById('themeBtn').onclick = () => { const r = document.documentElement; const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; r.dataset.theme = dark ? 'light' : 'dark' }
let saved = {}
try { saved = JSON.parse(localStorage.getItem('r32-player-feedback') || '{}') } catch (e) { saved = {} }
const keep = () => { try { localStorage.setItem('r32-player-feedback', JSON.stringify(saved)) } catch (e) { /* private window */ } }
document.querySelectorAll('figure[data-fb]').forEach((f) => {
  const id = f.dataset.fb
  const box = document.createElement('div')
  box.innerHTML = `<div class="fb">${[['ok', 'Approve'], ['change', 'Revise'], ['remove', 'Remove']].map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${saved[id]?.v === v}">${l}</button>`).join('')}</div><textarea aria-label="Note on ${id}" placeholder="Note on ${id}…"></textarea>`
  f.append(box)
  const ta = box.querySelector('textarea')
  ta.value = saved[id]?.note || ''
  ta.oninput = () => { saved[id] = { ...saved[id], note: ta.value }; keep() }
  box.querySelectorAll('button').forEach((b) => (b.onclick = () => { box.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); saved[id] = { ...saved[id], v: b.dataset.v }; keep() }))
})
