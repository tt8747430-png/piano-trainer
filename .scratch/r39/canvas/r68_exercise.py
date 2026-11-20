# R68: an exercise's page in the Chords page's shape (loop, 2026-11-15). Run from r41.py after r67 (it replaces the
# Exercise boards r41_practice writes). One piano, one bar, one shape across Practice: the keys edge to edge under a bar
# of glass buttons (Back · Exercise · Piano; no gear: count-in and waiting are the Player's settings), the first position lit on them; the exercise's name in the
# serif with its ♡, its book; one card of its first bars on the staff and what it trains; The exercise (Number, Hands,
# Rhythm, Next key, Tempo, Target tempo); How to play, in words, no hand drawing (no finger numbers on keys); and one
# floating bar: Key (the root, a value over its caption, opening the root grid) · Start (the Player) · Listen.
EX68 = EX.replace("    return { ...common(st, set),", r'''    const marks = { 60: [ROLE[1], 'C'], 64: ['#F3D9A8', 'E'], 65: ['#F3D9A8', 'F'], 67: ['#F3D9A8', 'G'], 69: ['#F3D9A8', 'A'] };
    const order = st.order ?? 'Circle of fifths';
    return { ...common(st, set), kbE: calmKeys(55, 79, marks, 402, 150), kbLE: calmKeys(48, 96, marks, 1462, 180),
      keyShort: NN[key], playing: !!st.playing, notPlaying: !st.playing, toggle: () => set({ playing: !st.playing }),
      favFill: st.fav ? '#C2554A' : 'none', keysOn: st.sheet === 'keys', openKeys: () => set({ sheet: 'keys' }),
      tgL: (st.tg ?? 108) + ' BPM', tgDn: () => set({ tg: Math.max(bpm, (st.tg ?? 108) - 4) }), tgUp: () => set({ tg: (st.tg ?? 108) + 4 }),
      orderSeg: seg(['Circle of fifths', 'Chromatic'], order, (l) => set({ order: l })),''', 1)
assert EX68 != EX, 'EX return not found'
TOP68 = TOP60.replace('Scales and keys</span>', 'Exercise</span>').replace('href="Main.dc.html" aria-label="Back to Practice"', 'href="FingerTechnique.dc.html" aria-label="Back to Finger technique"').replace(ROUND60("Settings", COG, "openSet"), '')
TITLE68 = (f'<div style="flex: none; display: flex; flex-direction: column; gap: 4px">'
           f'<div style="display: flex; align-items: center; gap: 2px"><h2 style="margin: 0; font-family: {SERIF}; font-size: 36px; font-weight: 700; line-height: 1.1; letter-spacing: -0.01em; text-wrap: balance">Hanon No. 1</h2>'
           f'<button type="button" aria-label="Favourite" aria-pressed="{{{{fav}}}}" onClick="{{{{toggleFav}}}}" style="flex: none; width: 44px; height: 44px; border: 0; border-radius: 22px; background: transparent; color: {SOFT}; display: flex; align-items: center; justify-content: center">{HEARTI}</button></div>'
           f'<p style="margin: 0 0 0 2px; font-size: 15px; color: {SOFT}">The Virtuoso Pianist · Finger technique</p></div>')
# the score is what the page is for, so it leads at its full width on the paper, never a thumbnail in a box (owner,
# 2026-11-18: "the score in the exercises is very important but it gets so little space and is so small that the user
# doesnt understand that this is the main things on the page"; NN/g, scale: "making them biggest"; HIG, Layout: the most
# important near the top): two systems, bars 1-4, drawn at 1.4x (the viewBox narrower than the column), no card
from bravura_glyphs import BRAVURA
# Hanon No. 1's first four bars as the app engraves them (ExercisePage: two bars a system in 2/4, the column's width at
# 12.25 a space on a phone's 370, 13 at a laptop's 880), measured from the engine: each head where Verovio justifies it,
# Bravura's black heads, the 16ths beamed four to a beat with the beam sloped a space at most, bar 4's high group stems
# down; the system 10 over its staff's 123 (130) and 4 under, as the app's.
_EX68 = {370: dict(H=123, top=37, sp=12.25, x0=56.2, x8=218.7, dx=18.73, bar=206.7, end=369.2, upx=13.9,
                   ends=([47.4, 43.3, 39.3, 35.2, 26, 30.1, 34.2, 38.2, 38.2, 34.2, 30.1, 26, 19.9, 24, 28.1, 32.1],
                         [32.1, 28, 24, 19.9, 13.8, 17.9, 22, 26, 26, 21.9, 17.8, 13.8, 97.0, 101.1, 105.2, 109.3])),
         880: dict(H=130, top=39.1, sp=12.95, x0=76.4, x8=492.6, dx=48.04, bar=463, end=879.1, upx=14.6,
                   ends=([50.1, 45.8, 41.5, 37.1, 27.4, 31.7, 36.1, 40.4, 40.4, 36.1, 31.7, 27.4, 20.9, 25.2, 29.6, 33.9],
                         [33.9, 29.6, 25.2, 20.9, 14.4, 18.8, 23.1, 27.4, 27.4, 23.1, 18.8, 14.4, 102.6, 106.9, 111.3, 115.5]))}
def hanon68(W, system):
    g = _EX68[W]; sp, top = g['sp'], g['top']; bot = top + 4 * sp; ends = g['ends'][system]
    steps = [n + 2 * system for n in [0, 2, 3, 4, 5, 4, 3, 2, 1, 3, 4, 5, 6, 5, 4, 3]]
    k = sp / 250; o = ''.join(f'<path d="M0 {top + i * sp:.2f}H{g["end"]}" stroke="{INK}" stroke-width="{.13 * sp:.2f}"></path>' for i in range(5))
    o += f'<text x="6.5" y="{bot - sp:.2f}" font-size="{4 * sp:.2f}" font-family="Noto Music, serif" fill="{INK}">𝄞</text>'
    o += ''.join(f'<path d="M{x} {top}V{bot:.2f}" stroke="{INK}" stroke-width="{.16 * sp:.2f}"></path>' for x in (g['bar'], g['end']))
    xs = [g['x0'] + i * g['dx'] if i < 8 else g['x8'] + (i - 8) * g['dx'] for i in range(16)]
    stems = []
    for i, (x, st) in enumerate(zip(xs, steps)):
        cy = bot + (2 - st) * sp / 2; up = ends[i] < cy
        if st <= 0: o += f'<path d="M{x - 3.2:.2f} {bot + sp:.2f}H{x + 17.7 * sp / 12.25:.2f}" stroke="{INK}" stroke-width="{.16 * sp:.2f}"></path>'
        o += f'<path transform="translate({x:.2f} {cy:.2f}) scale({k:.4f} {-k:.4f})" d="{BRAVURA["black"][0]}" fill="{INK}"></path>'
        sx = x + g['upx'] if up else x + 0.6
        o += f'<path d="M{sx:.2f} {cy:.2f}V{ends[i]}" stroke="{INK}" stroke-width="{.1 * sp:.2f}"></path>'; stems.append((sx, ends[i], up))
    t, d2 = .5 * sp, .653 * sp
    for a in range(0, 16, 4):
        (x1, y1, up), (x2, y2, _) = stems[a], stems[a + 3]; sg = 1 if up else -1
        for off in (0, d2):
            ya, yb = y1 + sg * off, y2 + sg * off
            o += f'<path d="M{x1 - .6:.2f} {ya:.2f}L{x2 + .6:.2f} {yb:.2f}L{x2 + .6:.2f} {yb + sg * t:.2f}L{x1 - .6:.2f} {ya + sg * t:.2f}Z" fill="{INK}"></path>'
    label = 'bars 1 and 2' if system == 0 else 'bars 3 and 4'
    return f'<svg viewBox="0 -10 {W} {g["H"] + 14}" width="100%" role="img" aria-label="Hanon No. 1, {label}" style="display: block; overflow: visible">{o}</svg>'
MUSIC68 = lambda w: (f'<figure style="flex: none; margin: 4px 0 0; display: flex; flex-direction: column; gap: 8px">' + hanon68(w, 0) + hanon68(w, 1)
                     + f'<figcaption style="font-size: 13px; color: {SOFT}; font-variant-numeric: tabular-nums">Bars 1–4 of 30</figcaption></figure>')
H3_68 = lambda t: f'<h3 style="margin: 0; font-size: 14px; font-weight: 600; color: {INK}">{t}</h3>'
ROWS68 = (f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px">{H3_68("The exercise")}'
          + GROUP(('step', 'Number', 'noL', 'noDn', 'noUp'), ('seg', 'Hands', 'handsSeg'), ('seg', 'Rhythm', 'rhythmSeg'), ('seg', 'Next key', 'orderSeg'), ('step', 'Tempo', 'bpmL', 'bpmDn', 'bpmUp', 80), ('step', 'Target tempo', 'tgL', 'tgDn', 'tgUp', 80), bg=SHEET) + '</section>')
HOW68 = (f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px">{H3_68("How to play")}'
         + CARD(f'<p style="margin: 0; font-size: 15px; line-height: 1.45; text-wrap: pretty">Keep the hand in its five-finger shape and lift each finger well; play evenly, every note as loud as the next, as the figure climbs two octaves and comes back.</p>') + '</section>')
KEYP68 = f'<button type="button" aria-label="Key: {{{{keyL}}}}" aria-haspopup="dialog" onClick="{{{{openRoot}}}}" style="pointer-events: auto; justify-self: end; flex: none; min-width: 56px; padding: 0 12px; border: 0; {GLASSGRP}; color: {INK}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.05"><span style="font-size: 18px; font-weight: 700">{{{{keyShort}}}}</span><span style="font-size: 12px; font-weight: 600; color: {SOFT}">Key</span></button>'
START68 = f'<a href="PlayExercise.dc.html" aria-label="Start in the Player" style="pointer-events: auto; flex: none; min-width: 176px; {TINTGRP}; color: #332921; text-decoration: none; font-size: 17px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px">{PLAYI}<span>Start</span></a>'
LISTEN68 = (f'<button type="button" aria-label="Listen" aria-pressed="{{{{playing}}}}" onClick="{{{{toggle}}}}" style="pointer-events: auto; justify-self: start; flex: none; min-width: 56px; padding: 0 12px; border: 0; {GLASSGRP}; color: {INK}; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; line-height: 1.05">'
            f'<sc-if value="{{{{notPlaying}}}}" hint-placeholder-val="{{{{true}}}}">{ICON(SPEAKER, 20)}<span style="font-size: 12px; font-weight: 600; color: {SOFT}">Listen</span></sc-if><sc-if value="{{{{playing}}}}" hint-placeholder-val="{{{{false}}}}">{STOPI}<span style="font-size: 12px; font-weight: 600; color: {SOFT}">Stop</span></sc-if></button>')
BAR68 = lambda pos: f'<div role="toolbar" aria-label="Key, start and listen" style="position: absolute; {pos}; z-index: 40; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 8px; pointer-events: none">{KEYP68}{START68}{LISTEN68}</div>'
SHEETS68 = BSHEET('rootOn', 'Key', ROOTGRID()) + BSHEET('keysOn', 'Piano', SC_KEYS60)
POPS68 = POPOVER('rootOn', 'Key', ROOTGRID(), 'left: calc(50% - 400px); bottom: 100px; top: auto') + POPOVER('keysOn', 'Piano', SC_KEYS60, 'right: 40px; top: 64px')
ph68 = (TOP68 + KBPAGE_OPEN + f'<div style="flex: none; margin: 8px 0 0">{KB60("kbE", 150)}</div><main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 16px 16px 120px; display: flex; flex-direction: column; gap: 16px">'
        + TITLE68 + MUSIC68(370) + (ROWS68 + HOW68).replace('<section style="flex: none;', '<section style="flex: none; margin-top: 8px;') + '</main></div>' + KBPAGE_CSS+ BAR68('left: 12px; right: 12px; bottom: 34px'))
ROWS68L = ROWS68.replace(GROUP(('step', 'Number', 'noL', 'noDn', 'noUp'), ('seg', 'Hands', 'handsSeg'), ('seg', 'Rhythm', 'rhythmSeg'), ('seg', 'Next key', 'orderSeg'), ('step', 'Tempo', 'bpmL', 'bpmDn', 'bpmUp', 80), ('step', 'Target tempo', 'tgL', 'tgDn', 'tgUp', 80), bg=SHEET), GROUP(('step', 'Number', 'noL', 'noDn', 'noUp'), ('segr', 'Hands', 'handsSeg'), ('segr', 'Rhythm', 'rhythmSeg', 400), ('segr', 'Next key', 'orderSeg'), ('step', 'Tempo', 'bpmL', 'bpmDn', 'bpmUp', 80), ('step', 'Target tempo', 'tgL', 'tgDn', 'tgUp', 80), bg=SHEET))
assert ROWS68L != ROWS68, 'Exercise rows not found'
lm68 = (f'<div style="flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column">' + LPAD(TOP68).replace('FingerTechnique.dc.html', 'FingerTechniqueLaptop.dc.html')
        + f'<div style="flex: none; margin-top: 8px">{KB60("kbLE", 180)}</div>'
        + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; padding: 28px 40px 120px 40px">'
        + f'<div style="width: min(880px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 24px">'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 20px">{TITLE68}{MUSIC68(880)}</div>'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 24px">{ROWS68L}{HOW68}</div></div></div>'  # the phone's order: the exercise's choices, then How to play (round 58)
        + BAR68('left: 50%; translate: -50% 0; bottom: 24px; width: 520px') + '</div>')
phone('Exercise', 'An exercise, phone', ph68, EX68, SHEETS68)
laptop('ExerciseLaptop', 'An exercise, laptop', lm68, '', EX68, POPS68, 'Practice')
print('r68 exercise ok')
