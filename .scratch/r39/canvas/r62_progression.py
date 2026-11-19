# R62: a progression's page in the Chords page's shape (loop, 2026-11-14). Run from r41.py after r61 (it replaces the
# Progression boards r41_practice writes). The keys edge to edge under a bar of glass buttons (Back · Progression · ♡ ·
# Settings · Piano); the progression's name, how it sounds and its style, its Key; the chords as tiles coloured by
# their role with the root's move under each, the legend, and the chords on the staff; Practise through the keys as
# the Scales page's Practise rows; Passing chords; the songs it is heard in; and one floating bar as Scales': Loop ·
# Play ⌄ (Chords: Triads, 7ths, 9ths; Approach chords: None, Secondary dominants, ii–V) · Practise (the Player).
PR62 = PR.replace("toggleLoop: () => set({ loop: !loop }) };", r'''toggleLoop: () => set({ loop: !loop }),
      kbE: calmKeys(lo62 - 0, lo62 + 24, marks, 402, 150), kbLE: calmKeys(36, 84, marks, 1462, 180),
      loopCap: loop ? 'Looping' : 'Loop', loopTint: loop ? '#332921' : 'rgba(254,253,251,.86)', loopInk: loop ? '#FEFDFB' : '#332921',
      menu: st.menu || '', playMenu: st.menu === 'play', closeMenu: () => set({ menu: null }), openPlay: () => set({ menu: st.menu === 'play' ? null : 'play' }),
      playing: !!st.playing, notPlaying: !st.playing, toggle: () => set({ playing: !st.playing, menu: null }),
      sizes: ['Triads', '7ths', '9ths'].map((d) => ({ d, on: d === (st.size ?? 'Triads'), mark: d === (st.size ?? 'Triads') ? '✓' : '', pick: () => set({ size: d, menu: null }) })),
      leads: ['None', 'Secondary dominants', 'ii–V'].map((d) => ({ d, on: d === (st.lead ?? 'None'), mark: d === (st.lead ?? 'None') ? '✓' : '', pick: () => set({ lead: d, menu: null }) })),
      keysOn: st.sheet === 'keys', openKeys: () => set({ sheet: 'keys' }), fav: !!st.fav, favFill: st.fav ? '#C2554A' : 'none', toggleFav: () => set({ fav: !st.fav }),
      staff: (() => { const L = 'CDEFGAB', NAT = [0, 2, 4, 5, 7, 9, 11], y = (d) => 65 - d * 3.5, names = [], bars = [], notes = [], led = [];
        P.forEach((n, i) => { const rpc = (key + DEG[n]) % 12, l0 = L.indexOf(NN[rpc].charAt(0)), third = n === n.toLowerCase() ? 3 : 4, x = 80 + i * 52;
          names.push({ x, name: ch(n) }); if (i < P.length - 1) bars.push({ d: 'M' + (x + 26) + ' 30V58' });
          [[l0, rpc], [l0 + 2, (rpc + third) % 12], [l0 + 4, (rpc + 7) % 12]].forEach(([d, pc]) => { const k = ((pc - NAT[d % 7]) % 12 + 12) % 12, acc = k === 1 ? '♯' : k === 11 ? '♭' : '';
            notes.push({ x, cy: y(d), ax: x - 18, ay: y(d) + 5, acc, hasAcc: !!acc }); if (d <= 0) led.push({ d: 'M' + (x - 10) + ' 65H' + (x + 10) }); }); });
        return { names, bars, notes, led }; })(),
      walks: [['In C major', 'C G Am F, round and round'], ['Chromatically, rising', 'C G Am F · D♭ A♭ B♭m G♭ …'], ['Chromatically, falling', 'C G Am F · B F♯ G♯m E …'], ['In whole steps, rising', 'C G Am F · D A Bm G …'], ['Circle of fifths, falling', 'C G Am F · F C Dm B♭ …'], ['In minor thirds', 'C G Am F · E♭ B♭ Cm A♭ …']].map(([t, s]) => ({ t, s })) };''').replace("const cur = P[at]", "const lo62 = 48, cur = P[at]")
assert PR62 != PR, 'PR return not found'

TILES62 = (f'<div style="display: flex; align-items: stretch; gap: 8px"><sc-for list="{{{{tiles}}}}" as="t" hint-placeholder-count="4"><div style="flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 8px"><button type="button" onClick="{{{{t.pick}}}}" style="width: 100%; height: 96px; border: 0; border-radius: 14px; background: {{{{t.bg}}}}; box-shadow: {{{{t.ring}}}}; color: {INK}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px"><span style="font-family: {SERIF}; font-size: 26px">{{{{t.n}}}}</span><span style="font-size: 15px; font-weight: 700">{{{{t.c}}}}</span></button><span style="font-size: 12px; color: {SOFT}; height: 14px">{{{{t.move}}}} →</span></div></sc-for></div>'
         f'<div style="display: flex; gap: 16px; font-size: 13px; color: {SOFT}">' + ''.join(f'<span style="display: flex; align-items: center; gap: 8px"><span style="width: 10px; height: 10px; border-radius: 5px; background: {c}; box-shadow: 0 0 0 1px {LINE}"></span>{l}</span>' for l, c in (('Tonic', PEACH), ('Predominant', SKY), ('Dominant', SAGE))) + '</div>')
HEARTI = '<svg viewBox="0 0 24 24" width="22" height="22" fill="{{favFill}}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>'
# Back is Up to the Progressions library (its parent); Edit, a word in its own capsule, trailing as on a lesson (loop round 58)
EDIT62 = f'<a href="ProgressionEdit.dc.html" style="{TBST}; text-decoration: none">Edit</a>'
TOP62 = TOP('Progressions.dc.html', 'Progression', ROUND60('Settings', COG, 'openSet') + ROUND60('Piano', KEYSI, 'openKeys') + EDIT62, 'Back to Progressions')
CHEVS = f'<svg viewBox="0 0 24 24" width="16" height="16" {I}><path d="m7 15 5 5 5-5M7 9l5-5 5 5"></path></svg>'
TITLE62 = (f'<div style="flex: none; display: flex; flex-direction: column; gap: 12px"><div style="display: flex; flex-direction: column; gap: 4px">'
           f'<div style="display: flex; align-items: center; gap: 2px"><h2 style="margin: 0; font-family: {SERIF}; font-size: 36px; font-weight: 700; line-height: 1.1; letter-spacing: -0.01em; text-wrap: balance">Axis of Awesome</h2>'
           f'<button type="button" aria-label="Favourite" aria-pressed="{{{{fav}}}}" onClick="{{{{toggleFav}}}}" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{HEARTI}</button></div>'
           f'<p style="margin: 0 0 0 2px; font-size: 15px; color: {SOFT}; text-wrap: pretty">Bright and singable, the sound of a thousand hits · Pop</p></div>'
           f'<button type="button" aria-label="Key: {{{{keyL}}}}" onClick="{{{{openRoot}}}}" style="align-self: flex-start; height: 44px; padding: 0 12px; border-radius: 12px; border: 1px solid {LINE}; background: {SHEET}; color: {INK}; font: inherit; font-size: 16px; display: flex; align-items: center; gap: 8px"><span style="color: {SOFT}">Key</span><b>{{{{keyL}}}}</b><span style="color: {SOFT}; display: flex">{CHEVS}</span></button></div>')
STAFF62 = (f'<svg viewBox="20 0 246 84" width="100%" role="img" aria-label="The chords on the staff" style="display: block; max-width: 560px; margin: 0 auto">'
           + ''.join(f'<path d="M24 {30 + i * 7}H262" stroke="{INK}" stroke-width=".9"></path>' for i in range(5))
           + f'<text x="26" y="64" font-size="44" font-family="Noto Music, serif" fill="{INK}">𝄞</text><path d="M262 30V58" stroke="{INK}" stroke-width="1"></path>'
           + f'<sc-for list="{{{{staff.names}}}}" as="c" hint-placeholder-count="4"><text x="{{{{c.x}}}}" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="{INK}">{{{{c.name}}}}</text></sc-for>'
           + f'<sc-for list="{{{{staff.bars}}}}" as="l" hint-placeholder-count="3"><path d="{{{{l.d}}}}" stroke="{INK}" stroke-width="1"></path></sc-for>'
           + f'<sc-for list="{{{{staff.led}}}}" as="l" hint-placeholder-count="1"><path d="{{{{l.d}}}}" stroke="{INK}" stroke-width="1"></path></sc-for>'
           + f'<sc-for list="{{{{staff.notes}}}}" as="z" hint-placeholder-count="12"><ellipse cx="{{{{z.x}}}}" cy="{{{{z.cy}}}}" rx="6.4" ry="4.2" transform="rotate(-20 {{{{z.x}}}} {{{{z.cy}}}})" fill="none" stroke="{INK}" stroke-width="1.8"></ellipse>'
           + f'<sc-if value="{{{{z.hasAcc}}}}" hint-placeholder-val="{{{{false}}}}"><text x="{{{{z.ax}}}}" y="{{{{z.ay}}}}" font-size="15" font-family="Noto Music, serif" fill="{INK}">{{{{z.acc}}}}</text></sc-if></sc-for></svg>')
# the chords on the staff at reading size (10 a space on a phone), framed to its four bars, on the paper: no card round
# the page's own music (laws, "The page's subject is its largest thing")
MUSIC62 = f'<figure style="flex: none; margin: 0">{STAFF62}</figure>'
WALKS62 = (f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 14px; font-weight: 600; color: {INK}">Practise in the Player</h3>'
           f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{walks}}}}" as="p" hint-placeholder-count="5"><a href="PlayProgression.dc.html" style="min-height: 60px; padding: 8px 16px; display: flex; align-items: center; gap: 12px; color: {INK}; text-decoration: none; box-shadow: inset 0 -1px 0 {LINE}">'
           f'<span style="flex: none; width: 36px; height: 36px; border-radius: 18px; background: {FILL}; color: {INK}; display: flex; align-items: center; justify-content: center">{PLAYM}</span><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{p.t}}}}</span><span style="font-size: 14px; color: {SOFT}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{{{p.s}}}}</span></span>{CHEV_RS}</a></sc-for></div></section>')
BETWEEN62 = (f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 14px; font-weight: 600; color: {INK}">Passing chords</h3>'
             # the same playable row as the walks above: play at its start, a name over one line (it plays here, so no chevron)
             f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><button type="button" aria-label="Play C D7 G" style="width: 100%; min-height: 60px; padding: 8px 16px; border: 0; background: transparent; color: {INK}; font: inherit; text-align: left; display: flex; align-items: center; gap: 12px">'
             f'<span style="flex: none; width: 36px; height: 36px; border-radius: 18px; background: {FILL}; color: {INK}; display: flex; align-items: center; justify-content: center">{PLAYM}</span><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">D7 into G</span><span style="font-size: 14px; line-height: 1.35; color: {SOFT}; text-wrap: pretty">The V of G: its F♯ rises a semitone into G</span></span></button></div></section>')
SONGS62 = (f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0; font-size: 14px; font-weight: 600; color: {INK}">Songs with this progression</h3>'
           + GROUP(('link', 'Let It Be', 'Bars 1–8', 'Song.dc.html'), bg=SHEET) + '</section>'
           # the Chord player is not a song: its own row under the songs
           + GROUP(('link', 'Open in the Chord player', '', 'ChordPlayer.dc.html'), ('link', 'Make your own from it', '', 'ProgressionEdit.dc.html'), bg=SHEET))
# the floating bar, as Scales': Loop on the left, Play with what it plays, Practise in the Player on the right
LOOPI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="m17 2 4 4-4 4"></path><path d="M3 11v-1a4 4 0 0 1 4-4h14"></path><path d="m7 22-4-4 4-4"></path><path d="M21 13v1a4 4 0 0 1-4 4H3"></path></svg>'
LOOPP = f'<button type="button" aria-label="Loop" aria-pressed="{{{{loop}}}}" onClick="{{{{toggleLoop}}}}" style="pointer-events: auto; justify-self: end; flex: none; min-width: 56px; padding: 0 12px; border: 0; {GLASSGRP}; background: {{{{loopTint}}}}; color: {{{{loopInk}}}}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; line-height: 1.05">{LOOPI}<span style="font-size: 12px; font-weight: 600">Loop</span></button>'
PLAYPR = PLAYSC.replace('<span>Play scale</span>', '<span>Play</span>').replace('aria-label="Play: up, down, octaves"', 'aria-label="What it plays"')
BAR62 = lambda pos: f'<div role="toolbar" aria-label="Loop and play" style="position: absolute; {pos}; z-index: 40; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 8px; pointer-events: none">{LOOPP}{PLAYPR}<span></span></div>'
def PMENU62(pos):
    head = lambda t: f'<p style="margin: 6px 12px 4px; font-size: 13px; font-weight: 600; color: {SOFT}">{t}</p>'
    item = lambda lst: f'<sc-for list="{{{{{lst}}}}}" as="o" hint-placeholder-count="3"><button type="button" role="menuitemradio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="height: 44px; padding: 0 12px; border: 0; border-radius: 12px; background: transparent; color: {INK}; font: inherit; font-size: 16px; display: flex; align-items: center; text-align: left"><span style="flex: 1">{{{{o.d}}}}</span><span style="font-weight: 700; color: #7A5418">{{{{o.mark}}}}</span></button></sc-for>'
    return (f'<sc-if value="{{{{playMenu}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeMenu}}}}" style="position: absolute; inset: 0; z-index: 50"></div><div role="menu" aria-label="What it plays" style="position: absolute; {pos}; z-index: 51; width: 260px; display: flex; flex-direction: column; padding: 6px; border-radius: 16px; {GLASSFX}">'
            + head('Chords') + item('sizes') + f'<div style="height: 1px; margin: 4px 6px; background: {LINE}"></div>' + head('Approach chords') + item('leads') + '</div></sc-if>')
PR_SET62 = GROUP(('seg', 'Written as', 'prWSeg', 200), ('seg', 'Voicing', 'voiceSeg', 200), ('seg', 'First chord’s inversion', 'prISeg', 200))
SHEETS62 = BSHEET('rootOn', 'Key', ROOTGRID()) + BSHEET('setOn', 'Progression settings', PR_SET62) + BSHEET('keysOn', 'Piano', SC_KEYS60)
POPS62 = POPOVER('rootOn', 'Key', ROOTGRID(), 'left: 120px; top: 380px') + POPOVER('setOn', 'Progression settings', PR_SET62) + POPOVER('keysOn', 'Piano', SC_KEYS60, 'right: 40px; top: 70px')

ph62 = (TOP62 + KBPAGE_OPEN + f'<div style="flex: none; margin: 8px 0 0">{KB60("kbE", 150)}</div><main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 16px 16px 120px; display: flex; flex-direction: column; gap: 16px">'
        + TITLE62 + TILES62 + MUSIC62 + WALKS62 + BETWEEN62 + SONGS62 + '</main></div>' + KBPAGE_CSS
        + BAR62('left: 12px; right: 12px; bottom: 34px') + PMENU62('left: 50%; translate: -50% 0; bottom: 104px'))
lm62 = (f'<div style="flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column">' + LPAD(TOP62)
        + f'<div style="flex: none; margin-top: 8px">{KB60("kbLE", 180)}</div>'
        + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; padding: 28px 40px 120px 40px">'
        + f'<div style="width: min(880px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 24px">'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 20px">{TITLE62}{TILES62.replace("height: 96px", "height: 120px").replace("font-size: 26px", "font-size: 34px")}{MUSIC62}</div>'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 24px">{WALKS62}{BETWEEN62}{SONGS62}</div></div></div>'
        + BAR62('left: 50%; translate: -50% 0; bottom: 24px; width: 520px') + PMENU62('left: 50%; translate: -50% 0; bottom: 100px') + '</div>')
phone('Progression', 'A progression, phone', ph62, PR62, SHEETS62)
laptop('ProgressionLaptop', 'A progression, laptop', lm62, '', PR62, POPS62, 'Practice')
print('r62 progression ok')
