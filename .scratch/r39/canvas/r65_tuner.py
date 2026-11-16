# R65: the Tuner in the Practice pages' language (loop, 2026-11-14). Run from r41.py after r64 (it replaces the
# Tuner boards r41_practice writes). The bar of glass buttons (Back · Tuner) as the Metronome's, no gear (its one
# setting is on the page); the note large, how far it is in words and its frequency; the needle on an arc ±50 cents
# with the in-tune band; under it on a phone, beside it on a laptop, one group: A4 stepped in place. No floating bar:
# the Tuner listens while the page is open. Without the microphone, the app's words and Try again.
TOP65 = (TOP64.replace('Metronome</span>', 'Tuner</span>').replace(ROUND60("Metronome settings", COG, "openSet"), ''))
TU65 = (TU.replace("    return { ...common(st, set), setOn:", """    const quiet = !!st.quiet && mic, pick = (o) => set(Object.assign({ cents: null, quiet: false, mic: true }, o));
    const states = [['In tune', ok && mic && !quiet, { cents: 0 }], ['18 cents sharp', cents === 18 && mic && !quiet, { cents: 18 }], ['Nothing heard', quiet, { quiet: true }], ['No microphone', !mic, { mic: false }]]
      .map(([l, on, o]) => ({ l, bg: on ? '#332921' : '#EEE9E2', fg: on ? '#FEFDFB' : '#332921', pick: () => (on ? pick({}) : pick(o)) }));
    return { ...common(st, set), states, heard: !quiet, quiet, setOn:""", 1)
        .replace("aUp: () => set({ a4: a4 + 1 }) };", "aUp: () => set({ a4: a4 + 1 }), noteT: quiet ? '–' : 'A', noteC: quiet ? '#DAD1C8' : '#332921', subV: quiet ? 'hidden' : 'visible', ...(quiet ? { needle: 'rotate(0 160 170)', nc: '#DAD1C8', state: 'Listening', sc: '#685E56', hz: '\u00a0' } : {}) };", 1))
assert 'states, heard' in TU65 and "nc: '#DAD1C8'" in TU65
GAUGE65 = lambda w: f'<svg viewBox="0 0 320 180" width="{w}" aria-hidden="true" style="display: block; max-width: 100%; margin: 0 auto"><path d="M43.9 104A134 134 0 0 1 276.1 104" fill="none" stroke="{FILL}" stroke-width="22"></path><path d="M149.5 36.4A134 134 0 0 1 170.5 36.4" fill="none" stroke="#9BC093" stroke-width="22"></path><sc-for list="{{{{ticks}}}}" as="t" hint-placeholder-count="21"><path d="{{{{t.d}}}}" stroke="{SOFT}" stroke-width="1.6"></path></sc-for><g transform="{{{{needle}}}}"><path d="M160 170L160 44" stroke="{{{{nc}}}}" stroke-width="4" stroke-linecap="round"></path></g><circle cx="160" cy="170" r="8" fill="{INK}"></circle><text x="36" y="178" font-size="12" fill="{SOFT}">−50</text><text x="266" y="178" font-size="12" fill="{SOFT}">+50</text></svg>'
NOTE65 = lambda s: f'<div style="display: flex; flex-direction: column; align-items: center; gap: 4px"><span style="font-size: {s}px; line-height: 1; font-weight: 700; color: {{{{noteC}}}}">{{{{noteT}}}}<sub style="font-size: {s // 3}px; font-weight: 600; visibility: {{{{subV}}}}">4</sub></span><span style="font-size: 18px; font-weight: 600; color: {{{{sc}}}}">{{{{state}}}}</span><span style="font-size: 15px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{hz}}}}</span></div>'
ROWS65 = GROUP(('step', 'Reference pitch', 'a4L', 'aDn', 'aUp', 80), bg=SHEET)
MICOFF65 = (f'<sc-if value="{{{{micOff}}}}" hint-placeholder-val="{{{{false}}}}"><div role="alert" style="flex: 1; padding: 40px 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; text-align: center">'
            f'<span style="max-width: 320px; font-size: 16px; line-height: 1.45; color: {SOFT}">The microphone is not available. Allow it in the browser to use the tuner.</span>{BTN("Try again", "allow", kind="quiet", grow=False, h=44)}</div></sc-if>')
HEARD65 = lambda big, w: (f'<sc-if value="{{{{micOn}}}}" hint-placeholder-val="{{{{true}}}}"><section aria-label="Tuner" style="flex: none; display: flex; flex-direction: column; align-items: center; gap: 12px">'
                          f'{SHOWSTATES()}{NOTE65(big)}{GAUGE65(w)}<span style="font-size: 15px; color: {SOFT}">Play or sing a note</span></section></sc-if>')
ph65 = (TOP65 + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 24px 16px 40px; display: flex; flex-direction: column; gap: 32px">'
        + HEARD65(96, 340) + MICOFF65 + ROWS65 + '</main>')
lm65 = (f'<div style="flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column">'
        + LPAD(TOP65).replace('Main.dc.html', 'Laptop.dc.html')
        + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 40px; align-items: start; padding: 48px 40px 120px 56px">'
        + f'<div style="min-width: 0; display: flex; flex-direction: column">{HEARD65(140, 560)}{MICOFF65}</div>'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 24px">{ROWS65}</div></div></div>')
phone('Tuner', 'Tuner, phone', ph65, TU65)
laptop('TunerLaptop', 'Tuner, laptop', lm65, '', TU65, '', 'Practice')
for f in ('Tuner', 'TunerLaptop'):
    open(OUT + f + 'Night.dc.html', 'w').write(night(open(OUT + f + '.dc.html').read()))
print('r65 tuner ok')
