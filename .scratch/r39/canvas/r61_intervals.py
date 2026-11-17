# R61: Intervals in the Chords page's shape (loop, 2026-11-14). Run from r41.py after r60 (it replaces the Intervals
# boards r41_practice writes). One piano, one bar, one shape across Practice: the keys edge to edge under a bar of glass
# buttons (Back · title · Settings · Piano), the interval's name with its ⓘ, its two notes on the staff with what it
# sounds like and Hear it, Simple · Compound over the tiles (the chosen one filled in ink), and one floating bar as
# Scales': From (the root) · Play P5 ⌄ (Ascending, Descending, Harmonic) · Play all.
# One grid, no Simple · Compound tabs (owner, 2026-11-16: "are the tabs correct? do we need them … should we somehow
# merge them"): the tab hid thirteen tiles behind a switch; the compound intervals follow the simple ones in the same
# grid, the ninth to the double octave, four rows of seven.
IV = (IV.replace("const comp = st.size === 'Compound', CAB", "const CAB")
        .replace("const TL = comp ? TIL.map((x, i) => [CAB[i], x[1] + 12, x[2] + 7]) : TIL;", "const TL = TIL.concat(TIL.slice(1).map((x, i) => [CAB[i + 1], x[1] + 12, x[2] + 7])), comp = (st.tile ?? 8) >= 14;")
        .replace("comp ? CWORDS[tile] : WORDS[tile]", "comp ? CWORDS[tile - 13] : WORDS[tile]"))
assert 'comp = (st.tile' in IV and 'CWORDS[tile - 13]' in IV, 'Interval tiles not found'
IV61 = IV.replace("allSeg: seg(", r'''steps: STEP,
      ab: AB[tile], playL: 'Play ' + AB[tile], wayL: way,
      ways: ['Ascending', 'Descending', 'Harmonic'].map((d) => ({ d, on: d === way, mark: d === way ? '✓' : '', pick: () => set({ way: d, menu: null }) })),
      ivs: TL.map(([a, semis], i) => ({ a, s: String(semis), on: i === tile, bg: i === tile ? '#332921' : '#FEFDFB', fg: i === tile ? '#FEFDFB' : '#332921', sub: i === tile ? '#FEFDFB' : '#685E56', op: i === tile ? 0.72 : 1, pick: () => set({ tile: i }) })),
      menu: st.menu || '', playMenu: st.menu === 'play', closeMenu: () => set({ menu: null }), openPlay: () => set({ menu: st.menu === 'play' ? null : 'play' }),
      playing: !!st.playing, notPlaying: !st.playing, toggle: () => set({ playing: !st.playing, allP: false, menu: null }),
      allPlaying: !!st.allP, notAllPlaying: !st.allP, toggleAll: () => set({ allP: !st.allP, playing: false }),
      states: [['Playing', !!st.playing, { playing: true, allP: false }], ['Every interval in turn', !!st.allP, { allP: true, playing: false }], ['A compound interval (major ninth)', (st.tile ?? 8) === 15, { tile: 15 }]]
        .map(([l, on, o]) => ({ l, bg: on ? '#332921' : '#EEE9E2', pick: () => set(on ? { playing: false, allP: false, tile: null } : o) })),
      keysOn: st.sheet === 'keys', openKeys: () => set({ sheet: 'keys' }),
      kbE: calmKeys(comp ? lo - 2 : lo - 7, comp ? lo + 26 : lo + 17, { [lo]: [ROLE[1], NN[lo % 12]], [hi]: [ROLE[5], HIN] }, 402, 150),
      kbLE: calmKeys(lo - 12, lo + 36, { [lo]: [ROLE[1], NN[lo % 12]], [hi]: [ROLE[5], HIN] }, 1462, 180),
      staff: (() => { const L = 'CDEFGAB', NAT = [0, 2, 4, 5, 7, 9, 11], st0 = L.indexOf(NN[from].charAt(0)), d2 = st0 + STEP;
        const y = (d) => 65 - d * 3.5, acc = (d, pc) => { const k = ((pc - NAT[d % 7]) % 12 + 12) % 12; return k === 1 ? '♯' : k === 11 ? '♭' : ''; };
        const har = way === 'Harmonic', x1 = har ? 180 : 150, x2 = har ? (n <= 2 ? 192 : 180) : 210;
        const notes = [[st0, from, x1], [d2, (from + n) % 12, x2]].map(([d, pc, x]) => ({ x, y: y(d), acc: acc(d, pc), ax: x - 18, ay: y(d) + 5, hasAcc: !!acc(d, pc), ...(() => { const a = acc(d, pc), X = x - 14, Y = y(d); return a === '♭' ? { ad: `M${X - 3} ${Y - 15}V${Y + 4}C${X + 4} ${Y + 1} ${X + 5} ${Y - 5} ${X - 3} ${Y - 3}`, bd: '' } : a === '♯' ? { ad: `M${X - 2} ${Y - 11}V${Y + 9}M${X + 2} ${Y - 12}V${Y + 8}`, bd: `M${X - 5} ${Y - 2}L${X + 5} ${Y - 5}M${X - 5} ${Y + 4}L${X + 5} ${Y + 1}` } : { ad: '', bd: '' }; })() }));
        const led = []; notes.forEach((z) => { const d = (65 - z.y) / 3.5; if (d <= 0) led.push({ d: 'M' + (z.x - 10) + ' 65H' + (z.x + 10) }); if (d >= 12) for (let k = 12; k <= d; k += 2) led.push({ d: 'M' + (z.x - 10) + ' ' + y(k) + 'H' + (z.x + 10) }); });
        return { notes, led }; })(),
      allSeg: seg(''')
assert IV61 != IV, 'IV return not found'

STAFF61 = (lambda: (
    f'<svg viewBox="0 -18 360 102" width="100%" role="img" aria-label="The interval on the staff" style="display: block; max-width: 420px; margin: 0 auto">'
    + ''.join(f'<path d="M24 {30 + i * 7}H336" stroke="{INK}" stroke-width=".9"></path>' for i in range(5))
    + f'<text x="26" y="64" font-size="44" font-family="Noto Music, serif" fill="{INK}">𝄞</text>'
    + f'<sc-for list="{{{{staff.led}}}}" as="l" hint-placeholder-count="0"><path d="{{{{l.d}}}}" stroke="{INK}" stroke-width="1"></path></sc-for>'
    + f'<sc-for list="{{{{staff.notes}}}}" as="z" hint-placeholder-count="2"><ellipse cx="{{{{z.x}}}}" cy="{{{{z.y}}}}" rx="6.4" ry="4.2" transform="rotate(-20 {{{{z.x}}}} {{{{z.y}}}})" fill="none" stroke="{INK}" stroke-width="1.8"></ellipse>'
    + f'<path d="{{{{z.ad}}}}" fill="none" stroke="{INK}" stroke-width="1.4" stroke-linecap="round"></path><path d="{{{{z.bd}}}}" fill="none" stroke="{INK}" stroke-width="2.6"></path></sc-for>'
    + f'<path d="M334 30V58" stroke="{INK}" stroke-width="1"></path></svg>'))()
INFO61 = '<span style="width: 8px"></span>' + INFOB('About the interval', 'toggleAbout', 'aboutOn')
ABOUT61 = INFOTIP('aboutOn', 'toggleAbout', '{{name}}', f'<p style="margin: 0">{{{{mean}}}}</p>' + ''.join(f'<div style="display: flex; align-items: baseline; gap: 12px"><span style="flex: none; width: 84px; color: {SOFT}">{k}</span><span style="font-weight: 600">{{{{{v}}}}}</span></div>' for k, v in (('Down', 'downS'), ('Inverts to', 'inv'))), 'left: 0; top: 56px')
TITLE61 = (SHOWSTATES() + f'<div style="position: relative; flex: none; display: flex; flex-direction: column; gap: 4px"><div style="display: flex; align-items: center; gap: 2px">'
           f'<h2 style="margin: 0; font-family: {SERIF}; font-size: 36px; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; text-wrap: balance">{{{{name}}}}</h2>{INFO61}</div>'
           f'{ABOUT61}</div>')
HEAR61 = (f'<div style="display: flex; align-items: center; gap: 12px"><span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 14px; color: {SOFT}">Sounds like</span><span style="font-size: 16px; font-weight: 600">{{{{song}}}}</span></span>'
          f'<button type="button" aria-label="Hear it" data-tip="Hear it" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; display: flex; align-items: center; justify-content: center">{PLAYM}</button></div>')
MUSIC61 = CARD(STAFF61 + '<div style="height: 12px"></div>' + HEAR61, '16px 16px 14px')
GRID61 = (f'<div role="radiogroup" aria-label="Interval" style="flex: none; display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px"><sc-for list="{{{{ivs}}}}" as="i" hint-placeholder-count="27">'
          f'<button type="button" role="radio" aria-checked="{{{{i.on}}}}" onClick="{{{{i.pick}}}}" style="height: 52px; border: 0; border-radius: 12px; background: {{{{i.bg}}}}; box-shadow: 0 0 0 1px {LINE}; color: {{{{i.fg}}}}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px">'
          f'<span style="font-size: 16px; font-weight: 700">{{{{i.a}}}}</span><span style="font-size: 12px; color: {{{{i.sub}}}}; opacity: {{{{i.op}}}}; font-variant-numeric: tabular-nums">{{{{i.s}}}}</span></button></sc-for></div>')
# the floating bar, as Scales': the left is where the interval is played from, the centre Play with how, the right all of them
FROMBTN = f'<button type="button" aria-label="From: {{{{fromL}}}}" aria-haspopup="dialog" onClick="{{{{openRoot}}}}" style="pointer-events: auto; justify-self: end; flex: none; min-width: 56px; padding: 0 12px; border: 0; {GLASSGRP}; color: {INK}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.05"><span style="font-size: 18px; font-weight: 700">{{{{fromL}}}}</span><span style="font-size: 11px; font-weight: 600; color: {SOFT}">From</span></button>'
LISTI = f'<svg viewBox="0 0 24 24" width="20" height="20" {I}><path d="M3 6h12M3 12h12M3 18h7"></path><path d="M17 13v8l5-4z" fill="currentColor"></path></svg>'
ALLBTN = f'<button type="button" aria-label="Play all" aria-pressed="{{{{allPlaying}}}}" onClick="{{{{toggleAll}}}}" style="pointer-events: auto; justify-self: start; flex: none; min-width: 56px; padding: 0 12px; border: 0; {GLASSGRP}; color: {INK}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; line-height: 1.05"><sc-if value="{{{{notAllPlaying}}}}" hint-placeholder-val="{{{{true}}}}">{LISTI}<span style="font-size: 11px; font-weight: 600; color: {SOFT}">Play all</span></sc-if><sc-if value="{{{{allPlaying}}}}" hint-placeholder-val="{{{{false}}}}"><span aria-hidden="true" style="width: 14px; height: 14px; border-radius: 3px; background: {INK}; margin: 3px 0"></span><span style="font-size: 11px; font-weight: 700; color: {INK}">Stop</span></sc-if></button>'
PLAYIV = PLAYSC.replace('<span>Play scale</span>', '<span>{{playL}}</span>').replace('aria-label="Play: up, down, octaves"', 'aria-label="Play as: {{wayL}}"').replace('width: 184px', 'width: 168px')
BAR61 = lambda pos: f'<div role="toolbar" aria-label="From, play and play all" style="position: absolute; {pos}; z-index: 40; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 8px; pointer-events: none">{FROMBTN}{PLAYIV}{ALLBTN}</div>'
WAYMENU = lambda pos: MENU60('playMenu', 'Play as', 'ways', pos).replace('<sc-for list="{{ways}}"', f'<p style="margin: 6px 12px 4px; font-size: 13px; font-weight: 600; color: {SOFT}">Play as</p><sc-for list="{{{{ways}}}}"')
TOP61 = TOP60.replace('Scales and keys</span>', 'Intervals</span>')
IV_KEYS61 = SC_KEYS60
SHEETS61 = BSHEET('rootOn', 'From', ROOTGRID()) + BSHEET('setOn', 'Interval settings', IV_SET) + BSHEET('keysOn', 'Piano', IV_KEYS61)
POPS61 = POPOVER('rootOn', 'From', ROOTGRID(), 'left: calc(50% - 400px); bottom: 100px; top: auto') + POPOVER('setOn', 'Interval settings', IV_SET) + POPOVER('keysOn', 'Piano', IV_KEYS61, 'right: 40px; top: 70px')

ph61 = (TOP61 + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 16px 120px; display: flex; flex-direction: column; gap: 16px"><div style="flex: none; margin: 4px -16px 0">{KB60("kbE", 150)}</div>'
        + f'<div style="margin-top: 8px; display: flex; flex-direction: column; gap: 8px">{TITLE61}{MUSIC61}</div>' + GRID61 + '</main>'  # round 63: the name with what it names
        + BAR61('left: 12px; right: 12px; bottom: 30px') + WAYMENU('left: 50%; translate: -50% 0; bottom: 104px'))
lm61 = (f'<div style="flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column">' + LPAD(TOP61)
        + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 0 120px">'
        + f'<div style="margin: 0 0 28px">{KB60("kbLE", 180)}</div><div style="width: min(880px, calc(100% - 80px)); margin: 0 auto; display: flex; flex-direction: column; gap: 24px"><div style="display: flex; flex-direction: column; gap: 12px">{TITLE61}{MUSIC61}</div>'
        + f'<div style="display: flex; flex-direction: column; gap: 16px">{GRID61}</div></div></div>'
        + BAR61('left: 50%; translate: -50% 0; bottom: 24px; width: 520px') + WAYMENU('left: 50%; translate: -50% 0; bottom: 100px') + '</div>')
phone('Intervals', 'Intervals, phone', ph61, IV61, SHEETS61)
laptop('IntervalsLaptop', 'Intervals, laptop', lm61, '', IV61, POPS61, 'Practice')
print('r61 intervals ok')
