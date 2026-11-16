# R65: the Tuner in the Practice pages' language (loop, 2026-11-14). Run from r41.py after r64 (it replaces the
# Tuner boards r41_practice writes). The bar of glass buttons (Back · Tuner) as the Metronome's, no gear (its one
# setting is on the page); the note large, how far it is in words and its frequency; the needle on an arc ±50 cents
# with the in-tune band; under it on both sizes, one group: A4 stepped in place. No floating bar:
# the Tuner listens while the page is open. Without the microphone, the app's words and Try again.
TOP65 = (TOP64.replace('Metronome</span>', 'Tuner</span>').replace(ROUND60("Metronome settings", COG, "openSet"), ''))
TU65 = (TU.replace("    return { ...common(st, set), setOn:", """    const quiet = !!st.quiet && mic, pick = (o) => set(Object.assign({ cents: null, quiet: false, mic: true }, o));
    const states = [['In tune', ok && mic && !quiet, { cents: 0 }], ['18 cents sharp', cents === 18 && mic && !quiet, { cents: 18 }], ['Nothing heard', quiet, { quiet: true }], ['No microphone', !mic, { mic: false }]]
      .map(([l, on, o]) => ({ l, bg: on ? '#332921' : '#EEE9E2', fg: on ? '#FEFDFB' : '#332921', pick: () => (on ? pick({}) : pick(o)) }));
    return { ...common(st, set), states, heard: !quiet, quiet, setOn:""", 1)
        .replace("aUp: () => set({ a4: a4 + 1 }) };", "aUp: () => set({ a4: a4 + 1 }), noteT: quiet ? '–' : 'A', noteC: quiet ? '#DAD1C8' : '#332921', subV: quiet ? 'hidden' : 'visible', askV: quiet ? 'visible' : 'hidden', ...(quiet ? { needle: 'rotate(0 160 170)', nc: '#DAD1C8', state: 'Listening', sc: '#685E56', hz: '\u00a0' } : {}) };", 1))
assert 'states, heard' in TU65 and "nc: '#DAD1C8'" in TU65 and 'askV' in TU65
GAUGE65 = lambda w: f'<svg viewBox="0 0 320 188" width="{w}" aria-hidden="true" style="display: block; max-width: 100%; margin: 0 auto"><path d="M43.9 104A134 134 0 0 1 276.1 104" fill="none" stroke="{FILL}" stroke-width="22"></path><path d="M149.5 36.4A134 134 0 0 1 170.5 36.4" fill="none" stroke="#9BC093" stroke-width="22"></path><sc-for list="{{{{ticks}}}}" as="t" hint-placeholder-count="21"><path d="{{{{t.d}}}}" stroke="{SOFT}" stroke-width="1.6"></path></sc-for><g transform="{{{{needle}}}}"><path d="M160 170L160 44" stroke="{{{{nc}}}}" stroke-width="4" stroke-linecap="round"></path></g><circle cx="160" cy="170" r="8" fill="{INK}"></circle><text x="36" y="178" font-size="12" fill="{SOFT}">−50</text><text x="266" y="178" font-size="12" fill="{SOFT}">+50</text></svg>'
NOTE65 = lambda s: f'<div style="display: flex; flex-direction: column; align-items: center; gap: 4px"><span style="font-size: {s}px; line-height: 1; font-weight: 700; color: {{{{noteC}}}}">{{{{noteT}}}}<sub style="font-size: {s // 3}px; font-weight: 600; visibility: {{{{subV}}}}">4</sub></span><span style="font-size: 18px; font-weight: 600; color: {{{{sc}}}}">{{{{state}}}}</span><span style="font-size: 15px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{hz}}}}</span></div>'
ROWS65 = GROUP(('step', 'Reference pitch', 'a4L', 'aDn', 'aUp', 80), bg=SHEET)
MICOFF65 = (f'<sc-if value="{{{{micOff}}}}" hint-placeholder-val="{{{{false}}}}"><div role="alert" style="flex: 1; padding: 40px 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; text-align: center">'
            # the one empty state's shape (EMPTY, Flat's): a 72 mark in a honey rounded square, an 18 bold title, a 15 line, its way on a 48 pill
            f'<div style="display: flex; flex-direction: column; align-items: center; gap: 8px"><span style="width: 72px; height: 72px; border-radius: 18px; background: {HONEY}; color: {INK}; display: flex; align-items: center; justify-content: center">'
            '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 2l20 20"></path><path d="M18.89 13.23A7 7 0 0 0 19 12v-2"></path><path d="M5 10v2a7 7 0 0 0 12 5"></path><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"></path><path d="M9 9v3a3 3 0 0 0 5.12 2.12"></path><path d="M12 19v3"></path></svg></span>'
            f'<span style="font-size: 18px; font-weight: 700; color: {INK}">No microphone</span><span style="max-width: 340px; font-size: 15px; line-height: 1.45; color: {SOFT}">Allow the microphone in the browser to use the tuner.</span></div>{BTN("Try again", "allow", kind="primary", grow=False, h=48)}</div></sc-if>')
HEARD65 = lambda big, w: (f'<sc-if value="{{{{micOn}}}}" hint-placeholder-val="{{{{true}}}}"><section aria-label="Tuner" style="flex: none; display: flex; flex-direction: column; align-items: center; gap: 12px">'
                          f'{SHOWSTATES()}{NOTE65(big)}{GAUGE65(w)}<span style="font-size: 15px; color: {SOFT}; visibility: {{{{askV}}}}">Play or sing a note</span></section></sc-if>')
ph65 = (TOP65 + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 24px 16px 40px; display: flex; flex-direction: column; gap: 32px">'
        + HEARD65(96, 340) + MICOFF65 + ROWS65 + '</main>')
lm65 = (f'<div style="flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column">'
        + LPAD(TOP65).replace('Main.dc.html', 'Laptop.dc.html')
        + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 24px 56px 48px">'
        + f'<div style="width: min(720px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 32px">{HEARD65(168, 720)}{MICOFF65}{ROWS65}</div></div></div>')
phone('Tuner', 'Tuner, phone', ph65, TU65)
laptop('TunerLaptop', 'Tuner, laptop', lm65, '', TU65, '', 'Practice')
print('r65 tuner ok')
