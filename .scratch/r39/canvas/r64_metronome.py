# R64: the Metronome in the Practice pages' language (loop, 2026-11-14). Run from r41.py after r63 (it replaces the
# Metronome boards r41_practice writes). The bar of glass buttons (Back · Metronome · Settings) as Scales', Intervals'
# and a progression's; the tempo, its slider and the beats as r41 draws them; the rows; and one floating bar of glass
# pieces as theirs: Tap (tap tempo) · Start, the honey one.
TOP64 = (TOP60.replace('Scales and keys</span>', 'Metronome</span>').replace(ROUND60("Piano", KEYSI, "openKeys"), '')
         .replace(ROUND60("Settings", COG, "openSet"), ROUND60("Metronome settings", COG, "openSet")))
TAPP = (f'<button type="button" aria-label="Tap tempo" style="pointer-events: auto; flex: none; min-width: 72px; padding: 0 12px; border: 0; {GLASSGRP}; color: {INK}; font: inherit; '
        f'display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; line-height: 1.05">{HANDI}<span style="font-size: 11px; font-weight: 600">Tap</span></button>')
STARTP = (f'<button type="button" aria-pressed="{{{{playing}}}}" onClick="{{{{togglePlay}}}}" style="pointer-events: auto; flex: none; width: 176px; border: 0; {TINTGRP}; color: #332921; font: inherit; font-size: 17px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px">'
          f'<sc-if value="{{{{notPlaying}}}}" hint-placeholder-val="{{{{true}}}}">{PLAYI}</sc-if><sc-if value="{{{{playing}}}}" hint-placeholder-val="{{{{false}}}}">{STOPI}</sc-if><span>{{{{startL}}}}</span></button>')
BAR64 = lambda pos: f'<div role="toolbar" aria-label="Tap tempo and start" style="position: absolute; {pos}; z-index: 40; display: flex; justify-content: center; align-items: center; gap: 12px; pointer-events: none">{TAPP}{STARTP}</div>'
ME64 = ME.replace("startL: st.playing ? 'Stop' : 'Start' };", "startL: st.playing ? 'Stop' : 'Start', playing: !!st.playing, notPlaying: !st.playing, togglePlay: () => set({ playing: !st.playing }), meFlOn: !!st.fl, meFlT: () => set({ fl: !st.fl }), meVolL: (st.vol ?? 100) + '%', meVolDn: () => set({ vol: Math.max(10, (st.vol ?? 100) - 10) }), meVolUp: () => set({ vol: Math.min(100, (st.vol ?? 100) + 10) }) };")
assert ME64 != ME, 'Metronome return not found'
ph64 = (TOP64 + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 8px 16px 120px; display: flex; flex-direction: column; gap: 20px">'
        + TEMPO(72) + BEATS(110) + ME_ROWS + '</main>' + BAR64('left: 12px; right: 12px; bottom: 30px'))
lm64 = (f'<div style="flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column">'
        + TOP64.replace('padding: 0 12px', 'padding: 0 28px 0 40px').replace('left: 112px; right: 112px', 'left: 140px; right: 140px').replace('Main.dc.html', 'Laptop.dc.html')
        + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 40px; align-items: start; padding: 24px 40px 120px 56px">'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 28px">{TEMPO(120)}{BEATS(220)}</div>'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 24px">{ME_ROWS}</div></div>'
        + BAR64('left: 50%; translate: -50% 0; bottom: 24px') + '</div>')
phone('Metronome', 'Metronome, phone', ph64, ME64, BSHEET('subOn', 'Subdivision', SUBLIST) + BSHEET('setOn', 'Metronome settings', ME_SET))
laptop('MetronomeLaptop', 'Metronome, laptop', lm64, '', ME64, POPOVER('subOn', 'Subdivision', SUBLIST, 'right: 40px; top: 160px') + POPOVER('setOn', 'Metronome settings', ME_SET, 'right: 40px; top: 64px'), 'Practice')
for f in ('Metronome', 'MetronomeLaptop'):
    open(OUT + f + 'Night.dc.html', 'w').write(night(open(OUT + f + '.dc.html').read()))
print('r64 metronome ok')
