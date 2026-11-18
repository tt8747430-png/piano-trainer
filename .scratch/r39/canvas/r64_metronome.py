# R64: the Metronome in the Practice pages' language (loop, 2026-11-14). Run from r41.py after r63 (it replaces the
# Metronome boards r41_practice writes). The bar of glass buttons (Back · Metronome · Settings) as Scales', Intervals'
# and a progression's; the tempo, its slider and the beats as r41 draws them; the rows; and one floating bar of glass
# pieces as theirs: Tap (tap tempo) · Start, the honey one.
# round 63: the Metronome's settings have one home, in place under the beats (CLAUDE.md: each tool's settings in place),
# ordered by how often they are wanted; the gear, which held Flash on the beat and Volume apart from the rest, goes, as
# on the Tuner
TOP64 = (TOP60.replace('Scales and keys</span>', 'Metronome</span>').replace(ROUND60("Piano", KEYSI, "openKeys"), '')
         .replace(ROUND60("Settings", COG, "openSet"), ''))
ME_ROWS = GROUP(('step', 'Time signature', 'meterL', 'mDn', 'mUp'), ('link', 'Subdivision', '{{subL}}', 'openSub'), ('link', 'Sound', 'Woodblock', ''),
                ('step', 'Volume', 'meVolL', 'meVolDn', 'meVolUp', 80), ('toggle', 'Flash on the beat', 'meFlOn', 'meFlT'),
                ('link', 'Speed trainer', 'Off', ''), ('link', 'Silent bars', 'Off', ''), bg=SHEET)
TAPP = (f'<button type="button" aria-label="Tap tempo" style="pointer-events: auto; flex: none; min-width: 72px; padding: 0 12px; border: 0; {GLASSGRP}; color: {INK}; font: inherit; '
        f'display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; line-height: 1.05">{HANDI}<span style="font-size: 12px; font-weight: 600">Tap</span></button>')
STARTP = (f'<button type="button" aria-pressed="{{{{playing}}}}" onClick="{{{{togglePlay}}}}" style="pointer-events: auto; flex: none; width: 176px; border: 0; {TINTGRP}; color: #332921; font: inherit; font-size: 17px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px">'
          f'<sc-if value="{{{{notPlaying}}}}" hint-placeholder-val="{{{{true}}}}">{PLAYI}</sc-if><sc-if value="{{{{playing}}}}" hint-placeholder-val="{{{{false}}}}">{STOPI}</sc-if><span>{{{{startL}}}}</span></button>')
BAR64 = lambda pos: f'<div role="toolbar" aria-label="Tap tempo and start" style="position: absolute; {pos}; z-index: 40; display: flex; justify-content: center; align-items: center; gap: 12px; pointer-events: none">{TAPP}{STARTP}</div>'
ME64 = ME.replace("    return { ...common(st, set), setOn:", """    const states = [['Playing', !!st.playing, { playing: true }], ['40 BPM', bpm === 40, { bpm: 40 }], ['7/4, accents and rests', meter === 7, { meter: 7, lv: ['accent', 'beat', 'silent', 'beat', 'accent', 'beat', 'silent'] }]]
      .map(([l, on, o]) => ({ l, bg: on ? '#332921' : '#EEE9E2', fg: on ? '#FEFDFB' : '#332921', pick: () => set(on ? { playing: false, bpm: null, meter: null, lv: null } : o) }));
    return { ...common(st, set), states, setOn:""", 1).replace("startL: st.playing ? 'Stop' : 'Start' };", "startL: st.playing ? 'Stop' : 'Start', playing: !!st.playing, notPlaying: !st.playing, togglePlay: () => set({ playing: !st.playing }), meFlOn: !!st.fl, meFlT: () => set({ fl: !st.fl }), meVolL: (st.vol ?? 100) + '%', meVolDn: () => set({ vol: Math.max(10, (st.vol ?? 100) - 10) }), meVolUp: () => set({ vol: Math.min(100, (st.vol ?? 100) + 10) }) };")
assert ME64 != ME, 'Metronome return not found'
ph64 = (TOP64 + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 8px 16px 120px; display: flex; flex-direction: column; gap: 20px">'
        + SHOWSTATES() + TEMPO(72) + BEATS(110) + ME_ROWS + '</main>' + BAR64('left: 12px; right: 12px; bottom: 30px'))
lm64 = (f'<div style="flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column">'
        + LPAD(TOP64).replace('Main.dc.html', 'Laptop.dc.html')
        # one centred column, the tool first and its settings under it (owner, 2026-11-16: "the page has one focus")
        + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 16px 56px 120px">'
        + f'<div style="width: min(760px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 24px">{SHOWSTATES()}{TEMPO(120)}{BEATS(112)}{ME_ROWS}</div></div>'
        + BAR64('left: 50%; translate: -50% 0; bottom: 24px') + '</div>')
phone('Metronome', 'Metronome, phone', ph64, ME64, BSHEET('subOn', 'Subdivision', SUBLIST))
laptop('MetronomeLaptop', 'Metronome, laptop', lm64, '', ME64, POPOVER('subOn', 'Subdivision', SUBLIST, 'right: 351px; bottom: 357px'), 'Practice')
print('r64 metronome ok')
