# R66: the Chord finder in the Practice pages' language (loop, 2026-11-14). Run from r41.py after r65 (it replaces
# the ChordFinder boards r41_practice writes). The bar of glass buttons (Back · Chord finder · Piano · Settings);
# the keys edge to edge under it, the input; the chord's name large with what it is in words, and its numeral in the
# key it is spelled in ("Imaj7 in C major ⌃"), the one home of that key (the settings no longer repeat it); its notes as tiles with their degrees, the bass marked; one group: Also
# read as, Played, In these keys; one floating bar of glass pieces: Clear · Play (honey) · Chords (open it there).
# Empty: Play a chord, the line saying how, three chords to try.
CF66 = CF.replace("kb: calmKeys(48, 76, marks, 370, 170), kbL: calmKeys(36, 84, marks, 860, 200), clear: () => set({ held: [] }) };",
    "kb: calmKeys(48, 76, marks, 370, 170), kbE: calmKeys(48, 72, marks, 402, 150), kbLE: calmKeys(36, 84, marks, 1462, 180), clear: () => set({ held: [] }), "
    "tryIt: () => set({ held: [52, 60, 67, 71] }), keysOn: st.sheet === 'keys', openKeys: () => set({ sheet: 'keys' }), "
    "playing: !!st.playing, notPlaying: !st.playing, togglePlay: () => set({ playing: !st.playing }), inKeys: 'C major, G major, E minor', numIn: empty ? 'Spelled in' : 'Imaj7 in', states: [{ l: 'Nothing played', bg: empty ? '#332921' : '#EEE9E2', pick: () => set({ held: empty ? null : [] }) }] };")
assert CF66 != CF, 'Chord finder return not found'
TOP66 = TOP60.replace('Scales and keys</span>', 'Chord finder</span>').replace(ROUND60("Settings", COG, "openSet"), ROUND60("Chord finder settings", COG, "openSet"))
CHEVS66 = f'<svg viewBox="0 0 24 24" width="16" height="16" {I}><path d="m7 15 5 5 5-5M7 9l5-5 5 5"></path></svg>'
TITLE66 = (f'<div style="flex: none; display: flex; flex-direction: column; gap: 12px"><div style="display: flex; flex-direction: column; gap: 4px">'
           f'<h2 aria-live="polite" style="margin: 0; font-family: {SERIF}; font-size: 44px; font-weight: 700; line-height: 1.05; letter-spacing: -0.01em">{{{{name}}}}</h2>'
           f'<p style="margin: 0 0 0 2px; font-size: 15px; color: {SOFT}; text-wrap: pretty">{{{{sub}}}}</p></div>'
           f'<button type="button" aria-label="{{{{numIn}}}} C major: the key it is spelled in" style="align-self: flex-start; height: 44px; padding: 0 12px; border-radius: 12px; border: 1px solid {LINE}; background: {SHEET}; color: {INK}; font: inherit; font-size: 16px; display: flex; align-items: center; gap: 8px"><span style="color: {SOFT}">{{{{numIn}}}}</span><b>C major</b><span style="color: {SOFT}; display: flex">{CHEVS66}</span></button></div>')
TRY66 = (f'<sc-if value="{{{{empty}}}}" hint-placeholder-val="{{{{false}}}}"><div role="list" aria-label="Chords to try" style="display: flex; flex-wrap: wrap; gap: 8px">'
         + ''.join(f'<button type="button" role="listitem" onClick="{{{{tryIt}}}}" style="height: 44px; padding: 0 16px; border: 0; border-radius: 22px; background: {FILL}; color: {INK}; font: inherit; font-size: 15px; font-weight: 600">{t}</button>' for t in ('C major', 'A minor 7th', 'D dominant 7th'))
         + '</div></sc-if>')
NOTES66 = CF_NOTES.replace('height: 64px', 'height: 72px').replace('font-size: 22px', 'font-size: 24px')
ROWS66 = f'<sc-if value="{{{{found}}}}" hint-placeholder-val="{{{{true}}}}">' + GROUP(
    ('raw', f'<div style="padding: 12px 16px; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 14px; color: {SOFT}">Also read as</span>{CHIPL("alts", "a")}</div>'),
    ('raw', f'<div style="padding: 12px 16px; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 14px; color: {SOFT}">Played</span>{CHIPL("played", "p")}</div>'),
    ('link', 'In these keys', '{{inKeys}}', ''), bg=SHEET) + '</sc-if>'
ERASEI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>'
CHORDSI = f'<svg viewBox="0 0 24 24" width="22" height="22" {I}><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>'
PIECE66 = PIECE  # the kit's glass piece (r42): an icon over its caption
PLAY66 = PLAYCAP()
BAR66 = lambda pos: (f'<sc-if value="{{{{found}}}}" hint-placeholder-val="{{{{true}}}}"><div role="toolbar" aria-label="Clear, play and open in Chords" style="position: absolute; {pos}; z-index: 40; display: flex; justify-content: center; align-items: center; gap: 12px; pointer-events: none">'
                     + PIECE66('Clear the keys', 'Clear', ERASEI, 'onClick="{{clear}}"') + PLAY66 + PIECE66('Open in Chords', 'Chords', CHORDSI) + '</div></sc-if>')
CF_SET66 = GROUP(('toggle', 'Slash chords for inversions', 'cfSlOn', 'cfSlT'), ('toggle', 'Keys that contain the chord', 'cfKOn', 'cfKT'), ('toggle', 'Key’s scale on the keyboard', 'cfScOn', 'cfScT'), ('toggle', 'Remember the chords played', 'cfHOn', 'cfHT'), ('action', 'Forget the chords played', 'closeSheet')) + GROUP(('link', 'Connect a piano', 'Not connected', 'Settings.dc.html'))
ph66 = (TOP66 + f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 0 16px 120px; display: flex; flex-direction: column; gap: 16px"><div style="flex: none; margin: 8px -16px 0">{KB60("kbE", 150)}</div>'
        + SHOWSTATES() + TITLE66 + TRY66 + NOTES66 + ROWS66 + '</main>' + BAR66('left: 12px; right: 12px; bottom: 34px'))
lm66 = (f'<div style="flex: 1; min-height: 0; position: relative; display: flex; flex-direction: column">' + LPAD(TOP66).replace('Main.dc.html', 'Laptop.dc.html')
        + f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; padding: 8px 40px 120px 40px">'
        + f'{SHOWSTATES()}<div style="flex: none; margin: -32px -40px 0 -40px">{KB60("kbLE", 180)}</div>'
        + f'<div style="width: min(880px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 24px">'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 20px">{TITLE66}{TRY66}{NOTES66}</div>'
        + f'<div style="min-width: 0; display: flex; flex-direction: column; gap: 24px">{ROWS66}</div></div></div>'
        + BAR66('left: 50%; translate: -50% 0; bottom: 24px') + '</div>')
phone('ChordFinder', 'Chord finder, phone', ph66, CF66, BSHEET('setOn', 'Chord finder settings', CF_SET66) + BSHEET('keysOn', 'Piano', SC_KEYS60))
laptop('ChordFinderLaptop', 'Chord finder, laptop', lm66, '', CF66, POPOVER('setOn', 'Chord finder settings', CF_SET66) + POPOVER('keysOn', 'Piano', SC_KEYS60, 'right: 90px; top: 64px'), 'Practice')
print('r66 chord finder ok')
