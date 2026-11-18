# R68: an exercise's page in the Chords page's shape (loop, 2026-11-15). Run from r41.py after r67 (it replaces the
# Exercise boards r41_practice writes). One piano, one bar, one shape across Practice: the keys edge to edge under a bar
# of glass buttons (Back · Exercise · Piano; no gear: count-in and waiting are the Player's settings), the first position lit on them; the exercise's name in the
# serif with its ♡, its book; one card of its first bars on the staff and what it trains; The exercise (Number, Hands,
# Rhythm, Next key, Tempo, Target tempo); How to play, in words, no hand drawing (no finger numbers on keys); and one
# floating bar: Key (the root, a value over its caption, opening the root grid) · Start (the Player) · Listen.
EX68 = EX.replace("    return { ...common(st, set),", r'''    const marks = { 60: [ROLE[1], 'C'], 62: ['#F3D9A8', 'D'], 64: ['#F3D9A8', 'E'], 65: ['#F3D9A8', 'F'], 67: ['#F3D9A8', 'G'] };
    const order = st.order ?? 'Circle of fifths';
    return { ...common(st, set), kbE: calmKeys(55, 79, marks, 402, 150), kbLE: calmKeys(48, 96, marks, 1462, 180),
      keyShort: NN[key], playing: !!st.playing, notPlaying: !st.playing, toggle: () => set({ playing: !st.playing }),
      favFill: (st.fav ?? true) ? '#C2554A' : 'none', keysOn: st.sheet === 'keys', openKeys: () => set({ sheet: 'keys' }),
      tgL: (st.tg ?? 108) + ' BPM', tgDn: () => set({ tg: Math.max(bpm, (st.tg ?? 108) - 4) }), tgUp: () => set({ tg: (st.tg ?? 108) + 4 }),
      orderSeg: seg(['Circle of fifths', 'Chromatic'], order, (l) => set({ order: l })),''', 1)
assert EX68 != EX, 'EX return not found'
TOP68 = TOP60.replace('Scales and keys</span>', 'Exercise</span>').replace('href="Main.dc.html" aria-label="Back to Practice"', 'href="FingerTechnique.dc.html" aria-label="Back to Finger technique"').replace(ROUND60("Settings", COG, "openSet"), '')
TITLE68 = (f'<div style="flex: none; display: flex; flex-direction: column; gap: 4px">'
           f'<div style="display: flex; align-items: center; gap: 2px"><h2 style="margin: 0; font-family: {SERIF}; font-size: 36px; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; text-wrap: balance">Hanon No. 1</h2>'
           f'<button type="button" aria-label="Favourite" aria-pressed="{{{{fav}}}}" onClick="{{{{toggleFav}}}}" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{HEARTI}</button></div>'
           f'<p style="margin: 0 0 0 2px; font-size: 15px; color: {SOFT}">The Virtuoso Pianist · Finger technique</p></div>')
MUSIC68 = lambda w: CARD(hanon(w) + f'<div style="display: flex; justify-content: space-between; gap: 12px; font-size: 13px; color: {SOFT}; margin: 6px 2px 0"><span>Bars 1–2 of 30</span></div>', '16px 16px 14px')
H3_68 = lambda t: f'<h3 style="margin: 0 0 0 4px; font-size: 14px; font-weight: 600; color: {INK}">{t}</h3>'
ROWS68 = (f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px">{H3_68("The exercise")}'
          + GROUP(('step', 'Number', 'noL', 'noDn', 'noUp'), ('seg', 'Hands', 'handsSeg'), ('seg', 'Rhythm', 'rhythmSeg'), ('seg', 'Next key', 'orderSeg'), ('step', 'Tempo', 'bpmL', 'bpmDn', 'bpmUp', 80), ('step', 'Target tempo', 'tgL', 'tgDn', 'tgUp', 80), bg=SHEET) + '</section>')
HOW68 = (f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px">{H3_68("How to play")}'
         + CARD(f'<p style="margin: 0; font-size: 15px; line-height: 1.45; text-wrap: pretty">Keep the hand in its five-finger shape and lift each finger well; play evenly, every note as loud as the next, as the figure climbs two octaves and comes back.</p>') + '</section>')
KEYP68 = f'<button type="button" aria-label="Key: {{{{keyL}}}}" aria-haspopup="dialog" onClick="{{{{openRoot}}}}" style="pointer-events: auto; justify-self: end; flex: none; min-width: 56px; padding: 0 12px; border: 0; {GLASSGRP}; color: {INK}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.05"><span style="font-size: 18px; font-weight: 700">{{{{keyShort}}}}</span><span style="font-size: 11px; font-weight: 600; color: {SOFT}">Key</span></button>'
START68 = f'<a href="PlayExercise.dc.html" aria-label="Start in the Player" style="pointer-events: auto; flex: none; width: 168px; {TINTGRP}; color: #332921; text-decoration: none; font-size: 17px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px">{PLAYI}<span>Start</span></a>'
LISTEN68 = (f'<button type="button" aria-label="Listen" aria-pressed="{{{{playing}}}}" onClick="{{{{toggle}}}}" style="pointer-events: auto; justify-self: start; flex: none; min-width: 56px; padding: 0 12px; border: 0; {GLASSGRP}; color: {INK}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; line-height: 1.05">'
            f'<sc-if value="{{{{notPlaying}}}}" hint-placeholder-val="{{{{true}}}}">{SPEAKER.replace("18", "20")}<span style="font-size: 11px; font-weight: 600; color: {SOFT}">Listen</span></sc-if><sc-if value="{{{{playing}}}}" hint-placeholder-val="{{{{false}}}}">{STOPI}<span style="font-size: 11px; font-weight: 600; color: {SOFT}">Stop</span></sc-if></button>')
BAR68 = lambda pos: f'<div role="toolbar" aria-label="Key, start and listen" style="position: absolute; {pos}; z-index: 40; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 8px; pointer-events: none">{KEYP68}{START68}{LISTEN68}</div>'
SHEETS68 = BSHEET('rootOn', 'Key', ROOTGRID()) + BSHEET('keysOn', 'Piano', SC_KEYS60)
POPS68 = POPOVER('rootOn', 'Key', ROOTGRID(), 'left: calc(50% - 400px); bottom: 100px; top: auto') + POPOVER('keysOn', 'Piano', SC_KEYS60, 'right: 40px; top: 70px')
ph68 = (TOP68 + f'<div style="flex: none; margin: 4px 0 0">{KB60("kbE", 150)}</div><main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 16px 16px 120px; display: flex; flex-direction: column; gap: 16px">'
        + TITLE68 + MUSIC68(338) + (ROWS68 + HOW68).replace('<section style="flex: none;', '<section style="flex: none; margin-top: 8px;') + '</main>'+ BAR68('left: 12px; right: 12px; bottom: 30px'))
ROWS68L = ROWS68.replace(GROUP(('step', 'Number', 'noL', 'noDn', 'noUp'), ('seg', 'Hands', 'handsSeg'), ('seg', 'Rhythm', 'rhythmSeg'), ('seg', 'Next key', 'orderSeg'), ('step', 'Tempo', 'bpmL', 'bpmDn', 'bpmUp', 80), ('step', 'Target tempo', 'tgL', 'tgDn', 'tgUp', 80), bg=SHEET), GROUP(('step', 'Number', 'noL', 'noDn', 'noUp'), ('segr', 'Hands', 'handsSeg'), ('segr', 'Rhythm', 'rhythmSeg', 400), ('segr', 'Next key', 'orderSeg'), ('step', 'Tempo', 'bpmL', 'bpmDn', 'bpmUp', 80), ('step', 'Target tempo', 'tgL', 'tgDn', 'tgUp', 80), bg=SHEET))
assert ROWS68L != ROWS68, 'Exercise rows not found'
lm68 = (f'<div style="flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column">' + LPAD(TOP68).replace('FingerTechnique.dc.html', 'FingerTechniqueLaptop.dc.html')
        + f'<div style="flex: none">{KB60("kbLE", 180)}</div>'
        + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; padding: 28px 40px 120px 40px">'
        + f'<div style="width: min(880px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 24px">'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 20px">{TITLE68}{MUSIC68(760)}</div>'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 24px">{ROWS68L}{HOW68}</div></div></div>'  # the phone's order: the exercise's choices, then How to play (round 58)
        + BAR68('left: 50%; translate: -50% 0; bottom: 24px; width: 520px') + '</div>')
phone('Exercise', 'An exercise, phone', ph68, EX68, SHEETS68)
laptop('ExerciseLaptop', 'An exercise, laptop', lm68, '', EX68, POPS68, 'Practice')
print('r68 exercise ok')
