# R67: the Circle of fifths in the Practice pages' language (loop, 2026-11-14). Run from r41.py after r66 (it
# replaces the CircleOfFifths boards r41_practice writes). The bar of glass buttons (Back · Circle of fifths), no
# gear and no ⓘ; the wheel large, majors outside and their relative minors inside, the key chosen and its neighbours
# lit; under it on a phone, beside it on a laptop: the key's name, its signature and its relative key, its seven
# chords as tiles that play; one floating bar: Play the chords (honey) · Scales (the key in Scales and keys).
_src67 = open('/home/user/piano-trainer/.scratch/r39/canvas/r41_practice.py').read()
exec(_src67[_src67.index('CIRCLE = lambda w:'):_src67.index('CO_SET = ')].replace('CIRCLE = ', 'CIRCLE67 = ', 1).replace('DIA = ', 'DIA67 = ', 1))
CO67 = CO.replace("modeSeg: seg(", "playing: !!st.playing, notPlaying: !st.playing, togglePlay: () => set({ playing: !st.playing }), relL: 'E minor', modeSeg: seg(")
assert CO67 != CO, 'Circle return not found'
TOP67 = TOP60.replace('Scales and keys</span>', 'Circle of fifths</span>').replace(ROUND60("Piano", KEYSI, "openKeys"), '').replace(ROUND60("Settings", COG, "openSet"), '')
KEY67 = (f'<div style="flex: none; display: flex; flex-direction: column; gap: 4px"><h2 style="margin: 0; font-family: {SERIF}; font-size: 36px; font-weight: 700; line-height: 1.1; letter-spacing: -0.02em">{{{{name}}}}</h2>'
         f'<p style="margin: 0 0 0 2px; font-size: 15px; color: {SOFT}">{{{{sub}}}}</p></div>')
CHORDS67 = (f'<section style="flex: none; display: flex; flex-direction: column; gap: 8px"><h3 style="margin: 0 0 0 4px; font-size: 14px; font-weight: 600; color: {INK}">Chords in the key</h3>'
            + DIA67.replace('<span style="height: 54px;', '<button type="button" style="height: 64px; border: 0; color: inherit; font: inherit;').replace('</span></span></sc-for>', '</span></button></sc-for>').replace('font-size: 15px; font-weight: 700', 'font-size: 16px; font-weight: 700').replace('font-size: 12px; color', 'font-size: 13px; color') + '</section>')
PLAY67 = (f'<button type="button" aria-pressed="{{{{playing}}}}" onClick="{{{{togglePlay}}}}" style="pointer-events: auto; flex: none; width: 200px; border: 0; {TINTGRP}; color: #332921; font: inherit; font-size: 17px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px">'
          f'<sc-if value="{{{{notPlaying}}}}" hint-placeholder-val="{{{{true}}}}">{PLAYI}</sc-if><sc-if value="{{{{playing}}}}" hint-placeholder-val="{{{{false}}}}">{STOPI}</sc-if><span>Play the chords</span></button>')
SCALESI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M3 18h4V14h4v-4h4V6h6"></path></svg>'
SCALESP = (f'<a href="Scales.dc.html" aria-label="Open in Scales and keys" style="pointer-events: auto; flex: none; min-width: 72px; padding: 0 12px; {GLASSGRP}; color: {INK}; text-decoration: none; '
           f'display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; line-height: 1.05">{SCALESI}<span style="font-size: 11px; font-weight: 600">Scales</span></a>')
BAR67 = lambda pos: f'<div role="toolbar" aria-label="Play the chords and open in Scales and keys" style="position: absolute; {pos}; z-index: 40; display: flex; justify-content: center; align-items: center; gap: 12px; pointer-events: none">{PLAY67}{SCALESP}</div>'
ph67 = (TOP67 + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 8px 16px 120px; display: flex; flex-direction: column; gap: 20px">'
        + CIRCLE67(370) + KEY67 + CHORDS67 + '</main>' + BAR67('left: 12px; right: 12px; bottom: 30px'))
lm67 = (f'<div style="flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column">' + LPAD(TOP67).replace('Main.dc.html', 'Laptop.dc.html')
        + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 40px; align-items: center; padding: 16px 40px 120px 56px">'
        + f'<div style="min-width: 0">{CIRCLE67(620)}</div><div style="min-width: 0; display: flex; flex-direction: column; gap: 20px">{KEY67}{CHORDS67}</div></div>'
        + BAR67('left: 50%; translate: -50% 0; bottom: 24px') + '</div>')
phone('CircleOfFifths', 'Circle of fifths, phone', ph67, CO67)
laptop('CircleOfFifthsLaptop', 'Circle of fifths, laptop', lm67, '', CO67, '', 'Practice')
print('r67 circle ok')
