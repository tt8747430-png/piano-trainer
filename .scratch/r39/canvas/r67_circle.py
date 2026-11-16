# R67: the Circle of fifths in the Practice pages' language (loop, 2026-11-14). Run from r41.py after r66 (it
# replaces the CircleOfFifths boards r41_practice writes). The bar of glass buttons (Back · Circle of fifths), no
# gear and no ⓘ; the wheel large, majors outside and their relative minors inside, the key chosen and its neighbours
# lit, the key's name and signature in its centre; one floating bar: Play the chords (honey) · Scales (the key in Scales and keys).
_src67 = open('/home/user/piano-trainer/.scratch/r39/canvas/r41_practice.py').read()
exec(_src67[_src67.index('CIRCLE = lambda w:'):_src67.index('CO_SET = ')].replace('CIRCLE = ', 'CIRCLE67 = ', 1).replace('DIA = ', 'DIA67 = ', 1))
CO67 = CO.replace("modeSeg: seg(", "playing: !!st.playing, notPlaying: !st.playing, togglePlay: () => set({ playing: !st.playing }), relL: 'E minor', modeSeg: seg(")
assert CO67 != CO, 'Circle return not found'
# the wheel already lights the key's relative minor and its chords: the line names only the signature
CO67 = CO67.replace("sub: SIGN[sel] + ' · relative ' + MIN[sel].replace('m', '') + ' minor'", 'sub: SIGN[sel]')
assert 'relative' not in CO67.split('sub:')[1][:40], 'Circle sub not found'
TOP67 = TOP60.replace('Scales and keys</span>', 'Circle of fifths</span>').replace(ROUND60("Piano", KEYSI, "openKeys"), '').replace(ROUND60("Settings", COG, "openSet"), '')
# One focus (owner, 2026-11-16: "the same thing explained in two places"; "the page has one focus"): the key's name and
# signature stand in the wheel's empty centre; the line "relative E minor" and the seven chord tiles went, since the
# wheel lights the relative minor and the key's chords, and Scales and keys holds the chords with their keys drawn.
WHEEL67 = lambda w, big: (f'<div style="position: relative; flex: none">{CIRCLE67(w)}<div aria-live="polite" style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; pointer-events: none; text-align: center">'
    f'<span style="font-family: {SERIF}; font-size: {big}px; font-weight: 700; line-height: 1.05; letter-spacing: -0.02em; color: {INK}; max-width: {round(w * 0.27)}px">{{{{name}}}}</span>'
    f'<span style="font-size: {13 if big < 30 else 15}px; color: {SOFT}">{{{{sub}}}}</span></div></div>')
PLAY67 = (f'<button type="button" aria-pressed="{{{{playing}}}}" onClick="{{{{togglePlay}}}}" style="pointer-events: auto; flex: none; width: 200px; border: 0; {TINTGRP}; color: #332921; font: inherit; font-size: 17px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px">'
          f'<sc-if value="{{{{notPlaying}}}}" hint-placeholder-val="{{{{true}}}}">{PLAYI}</sc-if><sc-if value="{{{{playing}}}}" hint-placeholder-val="{{{{false}}}}">{STOPI}</sc-if><span>Play the chords</span></button>')
SCALESI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M3 18h4V14h4v-4h4V6h6"></path></svg>'
SCALESP = (f'<a href="Scales.dc.html" aria-label="Open in Scales and keys" style="pointer-events: auto; flex: none; min-width: 72px; padding: 0 12px; {GLASSGRP}; color: {INK}; text-decoration: none; '
           f'display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; line-height: 1.05">{SCALESI}<span style="font-size: 11px; font-weight: 600">Scales</span></a>')
BAR67 = lambda pos: f'<div role="toolbar" aria-label="Play the chords and open in Scales and keys" style="position: absolute; {pos}; z-index: 40; display: flex; justify-content: center; align-items: center; gap: 12px; pointer-events: none">{PLAY67}{SCALESP}</div>'
ph67 = (TOP67 + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 24px 16px 120px; display: flex; flex-direction: column; justify-content: center">'
        + WHEEL67(370, 22) + '</main>' + BAR67('left: 12px; right: 12px; bottom: 30px'))
lm67 = (f'<div style="flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column">' + LPAD(TOP67).replace('Main.dc.html', 'Laptop.dc.html')
        + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; display: flex; align-items: center; justify-content: center; padding: 8px 40px 112px">'
        + WHEEL67(640, 36) + '</div>' + BAR67('left: 50%; translate: -50% 0; bottom: 24px') + '</div>')
phone('CircleOfFifths', 'Circle of fifths, phone', ph67, CO67)
laptop('CircleOfFifthsLaptop', 'Circle of fifths, laptop', lm67, '', CO67, '', 'Practice')
print('r67 circle ok')
