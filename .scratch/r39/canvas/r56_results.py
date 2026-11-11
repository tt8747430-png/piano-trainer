# R56 (canvas 160): a chord practice run's results, and Practice history in Profile.
#   PlayChord      — the Player in a Chords practice run (Cmaj7 · Inversions), ending in its results, full screen
#   PracticeResult — the same results opened from Profile › Practice history
#   Profile        — gains Practice history: a 30-day chart, the runs by day, "Stored on this device"
# The results follow memory-palaces' ResultScreen (an icon circle, the title, one line, a row of stat tiles, the actions
# pinned at the foot) and what Piano Marvel, Melodics and Yousician show after a run: every chord marked right, wrong,
# early or late and by how much; your best beside this score. Exec'd by r41.py after r55_editor_draft; uses
# r53_songs_more's IF and r50_profile's pieces. Helpers carry the RS_ prefix.

RS_SAGE, RS_SAGE_INK, RS_RED, RS_OCHRE = '#DCE9D6', '#2F5A35', '#A1352B', '#9A6A1E'
RS_LET = 'CDEFGAB'
# the run: Cmaj7 through its inversions, three times (root position, 1st, 2nd, 3rd)
RS_INV = [[('C', 4), ('E', 4), ('G', 4), ('B', 4)], [('E', 4), ('G', 4), ('B', 4), ('C', 5)],
          [('G', 4), ('B', 4), ('C', 5), ('E', 5)], [('B', 3), ('C', 4), ('E', 4), ('G', 4)]]
RS_RUN = [RS_INV[i % 4] for i in range(12)]
# what happened at each chord: None is right and on time; ('early'|'late', ms); ('wrong', played notes, the wrong one)
RS_MARKS = {2: ('early', 40), 6: ('wrong', [('G', 4), ('B', 4), ('D', 5), ('E', 5)], ('D', 5)), 9: ('early', 25), 10: ('late', 60)}
RS_NAMES = ['Root position', '1st inversion', '2nd inversion', '3rd inversion']


def RS_STEP(l, o):
    return RS_LET.index(l) + 7 * (o - 4)


def RS_CELL(notes, w, red=None, last=False, clef=False):
    """One chord, a whole note on a treble staff, as an engraver sets it: a second's upper note to the right."""
    y = lambda s: 48 - (s - 2) * 4
    lines = ''.join(f'<path d="M0 {16 + i * 8}H{w}" stroke="{INK}" stroke-width=".8" opacity=".5"></path>' for i in range(5))
    if last:
        lines += f'<path d="M{w - .6} 16V48" stroke="{INK}" stroke-width="1.2"></path>'
    if clef:
        return f'<svg viewBox="0 0 {w} 72" width="{w}" height="72" aria-hidden="true" style="display: block; flex: none">{lines}<text x="2" y="54" font-family="Noto Music, serif" font-size="40" fill="{INK}">𝄞</text></svg>'
    steps = sorted(RS_STEP(l, o) for l, o in notes)
    cx, out, prev, shifted = w / 2 - 3, '', None, False
    for s in steps:
        shifted = (prev is not None and s - prev == 1 and not shifted)
        x = cx + (10 if shifted else 0)
        if s <= 0:
            out += f'<path d="M{cx - 9} 56H{cx + 9 + (10 if shifted else 0)}" stroke="{INK}" stroke-width="1"></path>'
        c = RS_RED if red and RS_STEP(*red) == s else INK
        out += f'<ellipse cx="{x:.1f}" cy="{y(s)}" rx="5.4" ry="3.9" transform="rotate(-24 {x:.1f} {y(s)})" fill="none" stroke="{c}" stroke-width="{2.4 if c == RS_RED else 1.7}"></ellipse>'
        prev = s
    return f'<svg viewBox="0 0 {w} 72" width="{w}" height="72" aria-hidden="true" style="display: block; flex: none">{lines}{out}</svg>'


def RS_CAP(i, perfect):
    m = None if perfect else RS_MARKS.get(i)
    if not m:
        return f'<span style="color: {RS_SAGE_INK}; font-weight: 700" aria-label="Correct">✓</span>'
    if m[0] == 'wrong':
        return f'<span style="color: {RS_RED}; font-weight: 600">Wrong notes</span>'
    return f'<span style="color: {RS_OCHRE}; font-weight: 600; font-variant-numeric: tabular-nums">{m[0].capitalize()} · {m[1]} ms</span>'


def RS_RUNSTAFF(per_row, cw, perfect):
    rows = []
    for r in range(0, 12, per_row):
        cells = [f'<div style="flex: none; display: flex; flex-direction: column; align-items: center">{RS_CELL([], 34, clef=True)}<span style="height: 18px"></span></div>']
        for i in range(r, r + per_row):
            m = None if perfect else RS_MARKS.get(i)
            notes, red = (m[1], m[2]) if m and m[0] == 'wrong' else (RS_RUN[i], None)
            cells.append(f'<div role="listitem" aria-label="{RS_NAMES[i % 4]}" style="flex: none; display: flex; flex-direction: column; align-items: center">{RS_CELL(notes, cw, red, last=(i == r + per_row - 1))}'
                         f'<span style="height: 18px; font-size: 12px; line-height: 18px; white-space: nowrap">{RS_CAP(i, perfect)}</span></div>')
        rows.append(f'<div role="list" style="display: flex; justify-content: center">{"".join(cells)}</div>')
    return '<div style="display: flex; flex-direction: column; gap: 4px">' + ''.join(rows) + '</div>'


RS_LEGEND = (f'<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 16px; font-size: 13px; color: {SOFT}">'
             f'<span><b style="color: {RS_SAGE_INK}">✓</b> Correct</span><span><b style="color: {RS_RED}">●</b> Wrong notes</span><span><b style="color: {RS_OCHRE}">●</b> Early or late</span></div>')


def RS_TILE(fig, unit, sub, label):
    u = f'<span style="font-size: 15px; font-weight: 600; color: {SOFT}"> {unit}</span>' if unit else ''
    s = f'<span style="font-size: 13px; color: {SOFT}; font-variant-numeric: tabular-nums">{sub}</span>' if sub else ''
    return (f'<div class="rs-rise" style="min-width: 0; border-radius: 16px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 12px; display: flex; flex-direction: column; gap: 2px">'
            f'<span style="font-size: 24px; font-weight: 700; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; white-space: nowrap">{fig}{u}</span>{s}'
            f'<span style="margin-top: auto; padding-top: 4px; font-size: 13px; font-weight: 600; color: {SOFT}">{label}</span></div>')


RS_CHECK = f'<svg viewBox="0 0 24 24" width="44" height="44" {I.replace("stroke-width=\"2\"", "stroke-width=\"2.4\"")}><path d="m5 12.5 4.5 4.5L19 7.5"></path></svg>'
RS_STAR = '<svg viewBox="0 0 24 24" width="44" height="44" fill="currentColor" aria-hidden="true"><path d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8z"></path></svg>'
RS_MOTION = ('<style data-motion>@keyframes rs-rise { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }'
             '@keyframes rs-pop { from { opacity: 0; transform: scale(.7) } to { opacity: 1; transform: none } }'
             '.rs-rise { animation: rs-rise 320ms cubic-bezier(.2,.8,.2,1) both } .rs-pop { animation: rs-pop 360ms cubic-bezier(.3,1.4,.5,1) both }'
             '.rs-d1 { animation-delay: 60ms } .rs-d2 { animation-delay: 120ms } .rs-d3 { animation-delay: 180ms } .rs-d4 { animation-delay: 240ms }'
             '@media (prefers-reduced-motion: reduce) { .rs-rise, .rs-pop { animation: none } }</style>')


def RS_BODY(per_row, cw, perfect, from_profile, lap=False):
    icon = (f'<span class="rs-pop" style="width: 96px; height: 96px; border-radius: 48px; background: {"#F6E3BC" if perfect else RS_SAGE}; color: {"#9A6A1E" if perfect else RS_SAGE_INK}; '
            f'display: flex; align-items: center; justify-content: center">{RS_STAR if perfect else RS_CHECK}</span>')
    line = '12 of 12 correct · 72 BPM' if perfect else '11 of 12 correct · 72 BPM'
    head = (f'<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center">{icon}'
            f'<h1 class="rs-rise rs-d1" style="margin: 8px 0 0; font-size: 26px; font-weight: 700; letter-spacing: -0.01em"><span style="font-family: {SERIF}">Cmaj7</span> · Inversions</h1>'
            f'<span class="rs-rise rs-d1" style="font-size: 16px; color: {SOFT}; font-variant-numeric: tabular-nums">{line}</span></div>')
    tiles = ('<div class="rs-rise rs-d2" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px">'
             + RS_TILE('100%' if perfect else '92%', '', '', 'Accuracy')
             + RS_TILE('12' if perfect else '9', '', 'on time' if perfect else 'on time<br>2 early · 1 late', 'Timing')
             + RS_TILE('72', 'BPM', '', 'Tempo') + '</div>')
    run = (f'<section class="rs-rise rs-d3" aria-label="The run" style="display: flex; flex-direction: column; gap: 8px"><h2 style="margin: 0 0 0 4px; font-size: 14px; font-weight: 600">The run</h2>'
           + CARD(f'<div style="display: flex; flex-direction: column; gap: 8px">{RS_RUNSTAFF(per_row, cw, perfect)}{"" if perfect else RS_LEGEND}</div>', '12px 8px') + '</section>')
    best = ('New personal best · Attempt 5' if perfect else 'Personal best 96% · Attempt 5')
    prof = '' if from_profile else (f'<a href="{"ProfileLaptop" if lap else "Profile"}.dc.html" style="height: 44px; display: inline-flex; align-items: center; gap: 4px; color: {LINK}; '
                                    f'font-size: 15px; font-weight: 600; text-decoration: none">All practice in Profile{CHEV_R}</a>')
    foot = (f'<div class="rs-rise rs-d4" style="display: flex; flex-direction: column; align-items: center; gap: 0">'
            f'<span style="font-size: 15px; color: {SOFT}; font-variant-numeric: tabular-nums">{best}</span>{prof}</div>')
    return head + tiles + run + foot


def RS_ACTIONS(perfect, from_profile, lap=False):
    run = 'PlayChordLaptop.dc.html' if lap else 'PlayChord.dc.html'
    done = 'ChordsLaptop.dc.html' if lap else 'Chords.dc.html'
    act, href = ('', run) if from_profile else ('again', '')
    if perfect:
        main = BTN('Retry at 80 BPM', act, href, 'primary', 52)
        rest = '' if from_profile else BTN('Done', '', done, 'quiet', 52)
        return f'<div style="display: grid; gap: 8px">{main}{rest}</div>'
    main = BTN('Practise mistakes', act, href, 'primary', 52)
    rest = BTN('Retry', act, href, 'quiet', 52) + ('' if from_profile else BTN('Done', '', done, 'quiet', 52))
    return f'<div style="display: grid; gap: 8px">{main}<div style="display: flex; gap: 8px">{rest}</div></div>'


RS_SHOW = (f'<div aria-label="Canvas: show a state" style="flex: none; align-self: center; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 6px; border-radius: 14px; border: 1.5px dashed {LINE}">'
           f'<span style="font-size: 12px; font-weight: 700; color: {SOFT}; padding: 0 4px">CANVAS · SHOW</span>'
           f'<sc-for list="{{{{shows}}}}" as="p" hint-placeholder-count="2"><button type="button" onClick="{{{{p.pick}}}}" style="height: 32px; padding: 0 10px; border: 0; border-radius: 16px; background: {{{{p.bg}}}}; color: {{{{p.fg}}}}; font: inherit; font-size: 13px; font-weight: 600">{{{{p.l}}}}</button></sc-for></div>')


def RS_RESULTS(per_row, cw, from_profile, lap=False):
    both = lambda f: IF('isMiss', f(False), 'true') + IF('isPerfect', f(True))
    body = both(lambda p: RS_BODY(per_row, cw, p, from_profile, lap))
    acts = both(lambda p: RS_ACTIONS(p, from_profile, lap))
    if lap:
        return (f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 32px 56px 32px; display: flex; justify-content: center">'
                f'<div style="width: 560px; display: flex; flex-direction: column; gap: 24px">{RS_SHOW}{body}<div style="width: 360px; align-self: center">{acts}</div></div></main>')
    return (f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: {8 if from_profile else 16}px 16px 24px; display: flex; flex-direction: column; gap: 20px">{RS_SHOW}{body}</main>'
            f'<div style="flex: none; padding: 12px 16px 34px; box-shadow: 0 -1px 0 {LINE}; background: {PAGE}">{acts}</div>')


RS_JS = lambda mode: js(r'''
    const S = (o) => set(o), MODE = ''' + mode + r''', view = st.view ?? (MODE === 'run' ? 'run' : 'results'), show = st.show ?? 'After mistakes';
    return { ...common(st, set), isRun: view === 'run', isResults: view === 'results', isMiss: show === 'After mistakes', isPerfect: show === 'Perfect run',
      shows: ['After mistakes', 'Perfect run'].map((l) => ({ l, bg: show === l ? '#332921' : '#EEE9E2', fg: show === l ? '#FEFDFB' : '#332921', pick: () => S({ show: l }) })),
      playing: !!st.playing, playLabel: st.playing ? 'Pause' : 'Play',
      togglePlay: () => { if (st.playing) { S({ playing: false }); return; } S({ playing: true }); setTimeout(() => S({ playing: false, view: 'results' }), 1400); },
      chordT: st.playing ? 'Chord 12 of 12' : 'Chord 11 of 12', prog: st.playing ? '100%' : '92%',
      again: () => S({ view: 'run', playing: false }), closeSheet: () => S({ sheet: null }) };''')

# the run, in the Player: the bar (Close, the exercise, Wait mode), the staff with the run, the keys, the transport
RS_KEYS = lambda h: (f'<div aria-hidden="true" style="flex: none; height: {h}px; border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px {LINE}; display: flex; background: {SHEET}">'
                     + ''.join(f'<span style="flex: 1; box-shadow: inset -1px 0 0 {LINE}; background: {"#F6E3BC" if i in (7, 9, 11, 13) else SHEET}"></span>' for i in range(21)) + '</div>')


def RS_RUNVIEW(lap):
    close = 'ChordsLaptop.dc.html' if lap else 'Chords.dc.html'
    bar = (f'<header style="flex: none; height: {64 if lap else 52}px; display: flex; align-items: center; gap: 8px; padding: 0 {40 if lap else 12}px">'
           f'<a href="{close}" style="height: 44px; display: flex; align-items: center; color: {LINK}; font-size: 16px; font-weight: 600; text-decoration: none">Close</a>'
           f'<span style="flex: 1; text-align: center; font-size: 17px; font-weight: 600"><span style="font-family: {SERIF}">Cmaj7</span> · Inversions</span>'
           f'<span style="height: 32px; padding: 0 12px; border-radius: 16px; background: {FILL}; font-size: 13px; font-weight: 600; display: flex; align-items: center">Wait mode</span></header>')
    staff = CARD(RS_RUNSTAFF(6 if lap else 4, 92 if lap else 76, True).replace(f'color: {RS_SAGE_INK}; font-weight: 700" aria-label="Correct">✓', f'color: transparent" aria-hidden="true">·'), '12px 8px')
    prog = (f'<div style="display: flex; align-items: center; gap: 12px"><div style="flex: 1; height: 6px; border-radius: 3px; background: {FILL}"><div style="width: {{{{prog}}}}; height: 6px; border-radius: 3px; background: {INK}"></div></div>'
            f'<span style="font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{chordT}}}}</span></div>')
    transport = f'<div style="display: flex; align-items: center; justify-content: center; gap: 12px"><span style="font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">72 BPM</span>{PLAYBTN(56)}<span style="font-size: 14px; color: {SOFT}">Both hands</span></div>'
    inner = f'{staff}{prog}<div style="flex: 1"></div>{RS_KEYS(170 if lap else 110)}{transport}'
    if lap:
        return bar + f'<main style="flex: 1; min-height: 0; padding: 8px 56px 32px; display: flex; justify-content: center"><div style="width: 760px; display: flex; flex-direction: column; gap: 16px">{inner}</div></main>'
    return bar + f'<main style="flex: 1; min-height: 0; padding: 4px 16px 40px; display: flex; flex-direction: column; gap: 16px">{inner}</main>'


rs_ph = RS_MOTION + IF('isRun', RS_RUNVIEW(False), 'true') + IF('isResults', RS_RESULTS(4, 76, False))
rs_lm = RS_MOTION + IF('isRun', RS_RUNVIEW(True), 'true') + IF('isResults', RS_RESULTS(6, 84, False, True))
detail('PlayChord', 'The Player: a chord practice run and its results', RS_JS("'run'"), rs_ph, rs_lm, '', '', '', 'Practice')
# opened from Profile › Practice history: the bar's Back, no Done and no link back to Profile
rs_pph = RS_MOTION + TOP('Profile.dc.html', '', '', 'Back') + RS_RESULTS(4, 76, True)
rs_plm = RS_MOTION + LTOP('ProfileLaptop.dc.html') + RS_RESULTS(6, 84, True, True)
detail('PracticeResult', 'A practice run’s results, from Profile', RS_JS("'result'"), rs_pph, rs_plm, '', '', '', 'Profile')
print('r56 results ok')
