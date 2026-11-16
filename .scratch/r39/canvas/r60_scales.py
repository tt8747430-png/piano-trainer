# R60: Scales and keys in the Chords page's shape (loop, 2026-11-14). Run from r41.py after r58 (it replaces the
# Scales boards r41_practice writes). One piano, one bar, one sheet shape across Practice: the keys edge to edge
# under a bar of glass buttons (Back · title · Settings · Piano), the scale's name as its two pickers (tonic ⌄,
# scale ⌄) as the chord's are, Scale · Chords · Key as one segmented control, the run engraved with its fingers,
# Practise in the Player as rows, and one floating bar: Tempo · Play scale ⌄ (Up, Up and down, Down; Octaves) · Hands.
# The scale's spelling, signature, staff and triads are r41_practice's SC logic, unchanged.
SC60 = SC.replace("      chords: tri, ss: { sig, notes: notesS, led } };", r'''      chords: tri, ss: { sig, notes: notesS, led },
      kbE: calmKeys(lo - 5, lo + 19, marks, 402, 150), kbLE: calmKeys(lo - 12, lo + 36, marks, 1462, 180),
      fingSeg: seg(['As the scale', 'From the thumb'], st.fing ?? 'As the scale', (l) => set({ fing: l })),
      tonicL: tonic, kindLow: KINDS[kind].charAt(0).toLowerCase() + KINDS[kind].slice(1),
      noteLine: ivs.map((_, i) => spell(i)).join(' '), sigLine: kind <= 5 ? SIGW.charAt(0).toUpperCase() + SIGW.slice(1) : ivs.length + ' notes',
      fingRH: fingOk && ivs.length === 7 ? FGP[0].split('').join(' ') : '', fingLH: fingOk && ivs.length === 7 ? FGP[1].split('').join(' ') : '',
      rhOn: fingOk && ivs.length === 7 && hands !== 'Left', lhOn: fingOk && ivs.length === 7 && hands !== 'Right', noFing: !(fingOk && ivs.length === 7) && kind > 5,
      tempo: st.tempo ?? 72, tDn: () => set({ tempo: Math.max(40, (st.tempo ?? 72) - 4) }), tUp: () => set({ tempo: Math.min(200, (st.tempo ?? 72) + 4) }),
      menu: st.menu || '', playMenu: st.menu === 'play', handsMenu: st.menu === 'hands', tempoMenu: st.menu === 'tempo',
      openPlay: () => set({ menu: st.menu === 'play' ? null : 'play' }), openHands: () => set({ menu: st.menu === 'hands' ? null : 'hands' }), openTempo: () => set({ menu: st.menu === 'tempo' ? null : 'tempo' }), closeMenu: () => set({ menu: null }),
      playing: !!st.playing, notPlaying: !st.playing, toggle: () => set({ playing: !st.playing, menu: null }),
      dirs: ['Up', 'Up and down', 'Down'].map((d) => ({ d, on: d === (st.dir ?? 'Up and down'), mark: d === (st.dir ?? 'Up and down') ? '✓' : '', pick: () => set({ dir: d, menu: null }) })),
      handItems: ['Both hands', 'Right hand', 'Left hand'].map((d) => ({ d, on: d.startsWith(hands), mark: d.startsWith(hands) ? '✓' : '', pick: () => set({ hands: d.split(' ')[0], menu: null }) })),
      handsLabel: hands === 'Both' ? 'Both hands' : hands + ' hand', hB: hands === 'Both', hR: hands === 'Right', hL: hands === 'Left',
      keysOn: st.sheet === 'keys', openKeys: () => set({ sheet: 'keys' }),
      practise: [['Up and down, hands together', 'Two octaves, 72 BPM'], ['Hands separately', 'Right, then left'], ['Tempo ladder', '60 to 120 BPM, 8 at a time'], ['Contrary motion', 'From the tonic, outwards'], ['Hanon 1–20', 'The Virtuoso Pianist, part one']].map(([t, s]) => ({ t, s })),
      states: [['Playing', !!st.playing, { playing: true }], ['F♯ major, six sharps', rl === 3 && ra === 1 && kind === 0, { rl: 3, ra: 1, kind: 0 }], ['Minor pentatonic (five notes, no fingering)', kind === 7, { kind: 7 }]]
        .map(([l, on, o]) => ({ l, bg: on ? '#332921' : '#EEE9E2', pick: () => set(on ? { playing: false, rl: null, ra: null, kind: null } : o) })),
      // the left hand two octaves under the right, on its own bass staff, its fingers under it (piano-chords-and-scales-app 006)
      ssB: (() => { const ledB = [], Yb = (k) => 127 - k * 3.5;
        const notes = notesS.map((z, i) => { const k = Math.round((58 - z.y) / 3.5), kb = k - 2, y = z.y + 69, up = kb < 4, f = fingOk && nN === 8 ? FGP[1][i] : '';
          for (let j = 0; j >= k; j -= 2) ledB.push({ d: 'M' + (z.x - 9) + ' ' + Yb(j) + 'H' + (z.x + 9) }); for (let j = 12; j <= k; j += 2) ledB.push({ d: 'M' + (z.x - 9) + ' ' + Yb(j) + 'H' + (z.x + 9) });
          return { ...z, y, ay: z.ay + 69, stem: up ? 'M' + (z.x + 4.6) + ' ' + y + 'V' + (y - 24) : 'M' + (z.x - 4.6) + ' ' + y + 'V' + (y + 24), fy: 160, f1: f === '1', f2: f === '2', f3: f === '3', f4: f === '4', f5: f === '5' }; });
        return { sig: sig.map((z) => ({ ...z, ay: z.ay + 69 })), notes, led: ledB }; })(),
      // the key's place on the circle of fifths, drawn as the circle draws it (owner, 2026-11-16: "what is with this relative
      // minor … and on the circle of fifths. this doenst make any sense"): its slice, IV · I · V, each major over its
      // relative minor, the scale's own lit; a tap goes to that key. Counted by fifths from the signature, so a raised
      // seventh (harmonic, melodic) never misspells a neighbour; a mode or a pentatonic has no place on it.
      hasKey: kind <= 3,
      fifths: [sg - 1, sg, sg + 1].filter((f) => Math.abs(f) <= 7).map((f) => { const FL = 'FCGDAEB', nm = (g) => FL[((g + 1) % 7 + 7) % 7] + A7[String(Math.floor((g + 1) / 7))], maj = nm(f), min = nm(f + 3) + 'm', me = f === sg;
        const at = (n) => ({ rl: L7.indexOf(n.charAt(0)), ra: n.includes('♯') ? 1 : n.includes('♭') ? -1 : 0 });
        return { maj, min, minA: min.slice(0, -1) + ' minor', sig: f === 0 ? '' : Math.abs(f) + (f > 0 ? '♯' : '♭'), majOn: me && kind === 0, minOn: me && kind > 0,
          majBg: me && kind === 0 ? '#F3E3C4' : 'transparent', minBg: me && kind > 0 ? '#F3E3C4' : 'transparent',
          goMaj: () => set(Object.assign({ kind: 0 }, at(maj))), goMin: () => set(Object.assign({ kind: kind > 0 ? kind : 1 }, at(min))) }; }),
      hasChords: tri.length > 0,
      chordCards: tri.map((t, i) => { const a = (PIV[(i + 2) % 7] - PIV[i] + 12) % 12, b = (PIV[(i + 4) % 7] - PIV[i] + 12) % 12, bs = 53 + ((root + PIV[i] - 5 + 120) % 12), on = (st.hear ?? -1) === i;
        const kb = calmKeys(53, 76, Object.fromEntries([bs, bs + a, bs + b].map((n) => [n, [on ? '#EDC684' : '#E9C4B8', '']])), 104, 46);
        return { c: t.c, r: t.c, x: '', d: t.d, kb, ring: on ? '0 0 0 2px #EDC684' : '0 0 0 1px #DAD1C8', hear: () => set({ hear: i }) }; }), chordsT: 'Chords in ' + tonic + ' ' + KINDS[kind].toLowerCase(),
      practiseT: 'Practise ' + tonic + ' ' + KINDS[kind].toLowerCase() + ' in the Player' };''')
assert SC60 != SC, 'SC return not found'

PILL60 = lambda label, val, act: (f'<button type="button" aria-label="{label}: {{{{{val}}}}}" onClick="{{{{{act}}}}}" style="flex: none; height: 64px; padding: 0 12px 0 16px; border: 0; border-radius: 14px; background: {FILL}; color: {INK}; '
                                  f'display: flex; align-items: center; gap: 8px; font: inherit"><span style="font-family: {SERIF}; font-size: 40px; font-weight: 700; line-height: 1; white-space: nowrap">{{{{{val}}}}}</span>'
                                  f'<span style="display: flex; flex-direction: column; color: {SOFT}; margin-top: -2px">{CHEV_U2}{CHEV_D2}</span></button>')
TITLE60 = (SHOWSTATES() + f'<div style="flex: none; display: flex; flex-direction: column; gap: 8px"><div style="display: flex; flex-wrap: wrap; gap: 8px">{PILL60("Tonic", "tonicL", "openRoot")}{PILL60("Scale", "kindLow", "openKind")}</div></div>')
def GRANDSTAFF(label):
    """The scale on a grand staff, each hand on its staff with its fingers, as the books print a scale (and the example's 006)."""
    tre = SCALESTAFF(label)
    inner = tre[tre.index('>') + 1:tre.rindex('</svg>')]
    bass = inner.replace('{{ss.', '{{ssB.')
    for i in range(5): bass = bass.replace(f'<path d="M4 {30 + i * 7}H356"', f'<path d="M4 {92 + i * 7}H356"', 1)
    bass = bass.replace('<text x="6" y="64" font-size="44" font-family="Noto Music, serif" fill="' + INK + '">𝄞</text>', '<text x="8" y="113" font-size="40" font-family="Noto Music, serif" fill="' + INK + '">𝄢</text>')
    brace = f'<path d="M4 30V120" stroke="{INK}" stroke-width="1.4"></path><path d="M356 30V120" stroke="{INK}" stroke-width=".9"></path>'
    return f'<svg viewBox="0 0 360 168" width="100%" role="img" aria-label="{label}" style="display: block">{inner}{bass}{brace}</svg>'
# the two hands' figures stand on their staves; only the honest note for a scale with no standard fingering stays under them
FING60 = (f'<sc-if value="{{{{noFing}}}}" hint-placeholder-val="{{{{false}}}}"><p style="margin: 0; text-align: center; font-size: 15px; color: {SOFT}">No standard fingering for this scale</p></sc-if>')
SCCARDS = lambda cols: (CHORDS_ROW.replace('{{chords}}', '{{chordCards}}').replace('hint-placeholder-count="6"', 'hint-placeholder-count="7"')
    .replace('</sup></span></button>', '</sup></span><span style="margin-top: -4px; font-size: 13px; color: ' + SOFT + '">{{c.d}}</span></button>')
    if cols < 7 else CHORDS_ROW.replace('{{chords}}', '{{chordCards}}').replace('hint-placeholder-count="6"', 'hint-placeholder-count="7"').replace('class="nos" style="display: flex; gap: 8px; overflow-x: auto; margin: 0 -16px; padding: 2px 16px 4px"', 'style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; padding: 2px"').replace('style="flex: none; border: 0;', 'style="min-width: 0; border: 0;').replace('</sup></span></button>', '</sup></span><span style="margin-top: -4px; font-size: 13px; color: ' + SOFT + '">{{c.d}}</span></button>'))
KEYG60 = (f'<sc-if value="{{{{hasKey}}}}" hint-placeholder-val="{{{{true}}}}"><section style="flex: none; display: flex; flex-direction: column; gap: 8px">'
          f'<a href="CircleOfFifths.dc.html" style="align-self: flex-start; min-height: 32px; margin: -6px 0 -6px 4px; display: flex; align-items: center; gap: 2px; font-size: 14px; font-weight: 600; color: {INK}; text-decoration: none">On the circle of fifths{CHEV_R}</a>'
          f'<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden">'
          f'<sc-for list="{{{{fifths}}}}" as="f" hint-placeholder-count="3"><div style="display: flex; flex-direction: column; box-shadow: inset 1px 0 0 {LINE}; margin-left: -1px">'
          f'<button type="button" aria-label="{{{{f.maj}}}} major" aria-pressed="{{{{f.majOn}}}}" onClick="{{{{f.goMaj}}}}" style="position: relative; height: 60px; border: 0; background: {{{{f.majBg}}}}; color: {INK}; font-family: {SERIF}; font-size: 22px; font-weight: 700; box-shadow: inset 0 -1px 0 {LINE}">{{{{f.maj}}}}<span style="position: absolute; top: 6px; right: 8px; font-family: inherit; font-size: 12px; font-weight: 500; color: {SOFT}">{{{{f.sig}}}}</span></button>'
          f'<button type="button" aria-label="{{{{f.minA}}}}" aria-pressed="{{{{f.minOn}}}}" onClick="{{{{f.goMin}}}}" style="height: 48px; border: 0; background: {{{{f.minBg}}}}; color: {INK}; font-family: {SERIF}; font-size: 17px; font-weight: 600">{{{{f.min}}}}</button>'
          f'</div></sc-for></div></section></sc-if>')
# One page, no tabs (owner, 2026-11-16: "are the tabs correct? do we need them … should we somehow merge them"): the
# Key tab repeated the Scale tab's staff for two rows, and the three tabs hid less than a screen between them; the
# run, the scale's chords and its key now read down one page, each once.
VIEW60 = lambda cols: (CARD(GRANDSTAFF("The scale up one octave, each hand on its staff with its fingers") + FING60, "16px 12px")
    + f'<sc-if value="{{{{hasChords}}}}" hint-placeholder-val="{{{{true}}}}"><section style="flex: none; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0 0 0 4px; font-size: 14px; font-weight: 600; color: {INK}">{{{{chordsT}}}}</h3>' + SCCARDS(cols) + '</section></sc-if>'
    + (KEYG60 if cols < 7 else ''))

PLAYM = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor"></path></svg>'
PRACT60 = (f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0 0 0 4px; font-size: 14px; font-weight: 600; color: {INK}">{{{{practiseT}}}}</h3>'
           f'<div style="border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; overflow: hidden"><sc-for list="{{{{practise}}}}" as="p" hint-placeholder-count="5"><a href="Exercise.dc.html" style="min-height: 60px; padding: 8px 14px; display: flex; align-items: center; gap: 12px; color: {INK}; text-decoration: none; box-shadow: inset 0 -1px 0 {LINE}">'
           f'<span style="flex: none; width: 36px; height: 36px; border-radius: 18px; background: {ACCENT}; display: flex; align-items: center; justify-content: center">{PLAYM}</span><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 600">{{{{p.t}}}}</span><span style="font-size: 14px; color: {SOFT}">{{{{p.s}}}}</span></span>{CHEV_RS}</a></sc-for></div></section>')
# the floating bar, as the Chords page's: the left is what the scale plays at, the centre Play, the right the hands
TEMPOBTN = f'<button type="button" aria-label="Tempo: {{{{tempo}}}} BPM" aria-haspopup="dialog" onClick="{{{{openTempo}}}}" style="pointer-events: auto; justify-self: end; flex: none; min-width: 56px; padding: 0 12px; border: 0; {GLASSGRP}; color: {INK}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.05"><span style="font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums">{{{{tempo}}}}</span><span style="font-size: 11px; font-weight: 600; color: {SOFT}">BPM</span></button>'
PLAYSC = (f'<div role="group" aria-label="Play" style="pointer-events: auto; flex: none; width: 184px; {TINTGRP}; display: flex; align-items: center">'
          f'<button type="button" onClick="{{{{toggle}}}}" style="flex: 1; min-width: 0; height: 100%; padding: 0 0 0 18px; border: 0; background: transparent; color: #332921; font: inherit; font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 8px; white-space: nowrap">'
          f'<sc-if value="{{{{notPlaying}}}}" hint-placeholder-val="{{{{true}}}}">{PLAYI}<span>Play scale</span></sc-if><sc-if value="{{{{playing}}}}" hint-placeholder-val="{{{{false}}}}">{STOPI}<span>Stop</span></sc-if></button>'
          f'<span aria-hidden="true" style="width: 1px; height: 28px; background: rgba(51,41,33,.22)"></span><button type="button" aria-label="Play: up, down, octaves" aria-haspopup="menu" onClick="{{{{openPlay}}}}" style="flex: none; width: 48px; height: 100%; border: 0; background: transparent; color: #332921; display: flex; align-items: center; justify-content: center">{CHEV_D}</button></div>')
HANDSSC = f'<button type="button" aria-label="Hands: {{{{handsLabel}}}}" aria-haspopup="menu" onClick="{{{{openHands}}}}" style="pointer-events: auto; justify-self: start; flex: none; width: 56px; padding: 0; border: 0; {GLASSGRP}; color: {INK}; display: flex; align-items: center; justify-content: center">{HANDSI}</button>'
def MENU60(cond, label, lst, pos, extra=''):
    return (f'<sc-if value="{{{{{cond}}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeMenu}}}}" style="position: absolute; inset: 0; z-index: 50"></div><div role="menu" aria-label="{label}" style="position: absolute; {pos}; z-index: 51; width: 248px; padding: 6px; border-radius: 18px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; flex-direction: column">'
            f'<sc-for list="{{{{{lst}}}}}" as="o" hint-placeholder-count="3"><button type="button" role="menuitemradio" aria-checked="{{{{o.on}}}}" onClick="{{{{o.pick}}}}" style="height: 44px; padding: 0 12px; border: 0; border-radius: 12px; background: transparent; color: {INK}; font: inherit; font-size: 16px; display: flex; align-items: center; text-align: left"><span style="flex: 1">{{{{o.d}}}}</span><span style="font-weight: 700; color: #7A5418">{{{{o.mark}}}}</span></button></sc-for>{extra}</div></sc-if>')
OCTROW = f'<div style="margin-top: 4px; padding: 8px 6px 2px 12px; box-shadow: inset 0 1px 0 {LINE}; display: flex; align-items: center; justify-content: space-between; gap: 8px"><span style="font-size: 16px">Octaves</span><div style="display: flex; align-items: center; gap: 4px"><button type="button" aria-label="Fewer octaves" onClick="{{{{octDn}}}}" style="width: 40px; height: 40px; border: 0; border-radius: 20px; background: {FILL}; color: {INK}; font: inherit; font-size: 20px">−</button><span style="min-width: 24px; text-align: center; font-size: 16px; font-weight: 600; font-variant-numeric: tabular-nums">{{{{oct}}}}</span><button type="button" aria-label="More octaves" onClick="{{{{octUp}}}}" style="width: 40px; height: 40px; border: 0; border-radius: 20px; background: {FILL}; color: {INK}; font: inherit; font-size: 20px">+</button></div></div>'
TEMPOPOP = lambda pos: (f'<sc-if value="{{{{tempoMenu}}}}" hint-placeholder-val="{{{{false}}}}"><div onClick="{{{{closeMenu}}}}" style="position: absolute; inset: 0; z-index: 50"></div><div role="dialog" aria-label="Tempo" style="position: absolute; {pos}; z-index: 51; width: 248px; box-sizing: border-box; padding: 12px; border-radius: 18px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}, {SHADOW}; display: flex; align-items: center; gap: 8px">'
    f'<button type="button" aria-label="Slower" onClick="{{{{tDn}}}}" style="flex: none; width: 48px; height: 48px; border: 0; border-radius: 24px; background: {FILL}; color: {INK}; font: inherit; font-size: 24px">−</button><div style="flex: 1; text-align: center; line-height: 1.1"><div style="font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums">{{{{tempo}}}}</div><div style="font-size: 13px; color: {SOFT}">BPM</div></div>'
    f'<button type="button" aria-label="Faster" onClick="{{{{tUp}}}}" style="flex: none; width: 48px; height: 48px; border: 0; border-radius: 24px; background: {FILL}; color: {INK}; font: inherit; font-size: 24px">+</button></div></sc-if>')
BAR60 = lambda pos: f'<div role="toolbar" aria-label="Tempo, play and hands" style="position: absolute; {pos}; z-index: 40; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 8px; pointer-events: none">{TEMPOBTN}{PLAYSC}{HANDSSC}</div>'
ROUND60 = lambda label, svg, act: IB(label, svg, act)  # the kit's one bar button
TOP60 = TOP('Main.dc.html', 'Scales and keys', ROUND60("Settings", COG, "openSet") + ROUND60("Piano", KEYSI, "openKeys"), 'Back to Practice')
KB60 = lambda k, h: KEYS(h).replace('kb.', k + '.').replace('border-radius: 14px;', 'border-radius: 0;', 1)
import sys; sys.path.insert(0, '/home/user/piano-trainer/.scratch/r39/canvas'); import piano_sheet as PS
SC_KEYS60 = PS.PIANO_SHEET_2D()  # the one Piano sheet, its 2D part
SHEETS60 = SC_SHEETS + BSHEET('keysOn', 'Piano', SC_KEYS60)
POPS60 = SC_POPS + POPOVER('keysOn', 'Piano', SC_KEYS60, 'right: 40px; top: 70px')

ph60 = (TOP60 + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 16px 120px; display: flex; flex-direction: column; gap: 16px"><div style="flex: none; margin: 4px -16px 0">{KB60("kbE", 150)}</div>'
        + TITLE60 + VIEW60(4) + PRACT60 + '</main>'
        + BAR60('left: 12px; right: 12px; bottom: 30px') + MENU60('playMenu', 'Play', 'dirs', 'left: 50%; translate: -50% 0; bottom: 104px', OCTROW) + MENU60('handsMenu', 'Hands', 'handItems', 'right: 16px; bottom: 104px') + TEMPOPOP('left: 16px; bottom: 104px'))
# One focus (owner, 2026-11-16: "the floating controls … should be centerd by the main focus content … the practices on
# the right robs the focus"): on a laptop the scale leads one centred column, the key's rows and Practise follow it in
# that column, and the floating bar is centred on it.
lm60 = (f'<div style="flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column">' + LPAD(TOP60)
        + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 0 120px">'
        + f'<div style="margin: 0 0 28px">{KB60("kbLE", 180)}</div><div style="width: min(880px, calc(100% - 80px)); margin: 0 auto; display: flex; flex-direction: column; gap: 24px">{TITLE60}' + VIEW60(7).replace('" style="display: block">', '" style="display: block; max-width: 640px; margin: 0 auto">')
        + f'{KEYG60}{PRACT60}</div></div>'
        + BAR60('left: 50%; translate: -50% 0; bottom: 24px; width: 560px') + MENU60('playMenu', 'Play', 'dirs', 'left: 50%; translate: -50% 0; bottom: 100px', OCTROW) + MENU60('handsMenu', 'Hands', 'handItems', 'left: calc(50% + 160px); bottom: 100px') + TEMPOPOP('left: calc(50% - 400px); bottom: 100px') + '</div>')
phone('Scales', 'Scales and keys, phone', ph60, SC60, SHEETS60)
laptop('ScalesLaptop', 'Scales and keys, laptop', lm60, '', SC60, POPS60, 'Practice')
print('r60 scales ok')
