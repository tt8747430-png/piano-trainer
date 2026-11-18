# R56 (canvas 160): a chord practice run's results, and Practice history in Profile.
#   PlayChord      — the Player in a Chords practice run (Cmaj7 · Inversions), ending in its results, full screen
#   PracticeResult — the same results opened from Profile › Practice history
#   Profile        — gains Practice history: a 30-day chart, the runs by day, "Stored on this device"
# The results follow memory-palaces' ResultScreen (an icon circle, the title, one line, a row of stat tiles, the actions
# pinned at the foot) and what Piano Marvel, Melodics and Yousician show after a run: every chord marked right, wrong,
# early or late and by how much; your best beside this score. Exec'd by r41.py after r55_editor_draft; uses
# r53_songs_more's IF and r50_profile's pieces. Helpers carry the RS_ prefix.

RS_SAGE, RS_SAGE_INK, RS_RED, RS_OCHRE = '#DCE9D6', '#2F5A35', '#A1352B', '#8A5D16'
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
        return f'<svg viewBox="0 -6 {w} 82" width="{w}" height="82" aria-hidden="true" style="display: block; flex: none">{lines}<text x="2" y="54" font-family="Noto Music, serif" font-size="40" fill="{INK}">𝄞</text></svg>'
    # round 41: a note may carry its accidental, (letter, octave, '♯' or '♭'), set left of the chord as an engraver does
    accs = {RS_STEP(n[0], n[1]): n[2] for n in notes if len(n) > 2}
    steps = sorted(RS_STEP(n[0], n[1]) for n in notes)
    cx, out, prev, shifted = w / 2 - 3, '', None, False
    for s in steps:
        shifted = (prev is not None and s - prev == 1 and not shifted)
        x = cx + (10 if shifted else 0)
        if s in accs:
            out += f'<text x="{cx - 16:.1f}" y="{y(s) + 4}" font-family="Noto Music, serif" font-size="14" fill="{INK}">{accs[s]}</text>'
        if s <= 0:
            out += f'<path d="M{cx - 9} 56H{cx + 9 + (10 if shifted else 0)}" stroke="{INK}" stroke-width="1"></path>'
        c = RS_RED if red and RS_STEP(*red) == s else INK
        out += f'<ellipse cx="{x:.1f}" cy="{y(s)}" rx="5.4" ry="3.9" transform="rotate(-24 {x:.1f} {y(s)})" fill="none" stroke="{c}" stroke-width="{2.4 if c == RS_RED else 1.7}"></ellipse>'
        prev = s
    return f'<svg viewBox="0 -6 {w} 82" width="{w}" height="82" aria-hidden="true" style="display: block; flex: none">{lines}{out}</svg>'


def RS_CAP(i, perfect):
    m = None if perfect else RS_MARKS.get(i)
    if not m:
        return f'<span style="color: {RS_SAGE_INK}; font-weight: 700" aria-label="Correct">✓</span>'
    if m[0] == 'wrong':
        return f'<span style="color: {RS_RED}; font-weight: 600">Wrong notes</span>'
    return f'<span style="color: {RS_OCHRE}; font-weight: 600; font-variant-numeric: tabular-nums">{m[0].capitalize()}<br>{m[1]} ms</span>'


def RS_RUNSTAFF(per_row, cw, perfect):
    rows = []
    for r in range(0, 12, per_row):
        cells = [f'<div style="flex: none; display: flex; flex-direction: column; align-items: center">{RS_CELL([], 34, clef=True)}<span style="height: 32px"></span></div>']
        for i in range(r, r + per_row):
            m = None if perfect else RS_MARKS.get(i)
            notes, red = (m[1], m[2]) if m and m[0] == 'wrong' else (RS_RUN[i], None)
            cells.append(f'<div role="listitem" aria-label="{RS_NAMES[i % 4]}" style="flex: none; display: flex; flex-direction: column; align-items: center">{RS_CELL(notes, cw, red, last=(i == r + per_row - 1))}'
                         f'<span style="height: 32px; font-size: 12px; line-height: 16px; white-space: nowrap; text-align: center">{RS_CAP(i, perfect)}</span></div>')
        rows.append(f'<div role="list" style="display: flex; justify-content: center">{"".join(cells)}</div>')
    return '<div style="display: flex; flex-direction: column; gap: 4px">' + ''.join(rows) + '</div>'


RS_LEGEND = (f'<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 16px; font-size: 13px; color: {SOFT}">'
             f'<span><b style="color: {RS_SAGE_INK}">✓</b> Correct</span><span><b style="color: {RS_RED}">●</b> Wrong notes</span><span><b style="color: {RS_OCHRE}">●</b> Early or late</span></div>')


def RS_TILE(fig, unit, sub, label):
    """A stat tile, the same three rows in every tile (round 63): the figure (its unit quieter), one line of context,
    the label; 16 inset, rows closer than the inset, so the three read as one group and the tiles as siblings."""
    u = f'<span style="font-size: 15px; font-weight: 600; letter-spacing: 0; color: {SOFT}"> {unit}</span>' if unit else ''
    return (f'<div class="rs-rise" style="min-width: 0; border-radius: 14px; background: {SHEET}; box-shadow: 0 0 0 1px {LINE}; padding: 16px; display: flex; flex-direction: column; gap: 2px">'
            f'<span style="font-size: 24px; font-weight: 700; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; white-space: nowrap">{fig}{u}</span>'
            f'<span style="font-size: 13px; color: {SOFT}; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{sub}</span>'
            f'<span style="padding-top: 6px; font-size: 13px; font-weight: 600; color: {SOFT}">{label}</span></div>')


RS_CHECK = f'<svg viewBox="0 0 24 24" width="44" height="44" {I.replace("stroke-width=\"2\"", "stroke-width=\"2.4\"")}><path d="m5 12.5 4.5 4.5L19 7.5"></path></svg>'
RS_STAR = '<svg viewBox="0 0 24 24" width="44" height="44" fill="currentColor" aria-hidden="true"><path d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8z"></path></svg>'
RS_MOTION = ('<style data-motion>@keyframes rs-rise { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }'
             '@keyframes rs-pop { from { opacity: 0; transform: scale(.7) } to { opacity: 1; transform: none } }'
             '.rs-rise { animation: rs-rise 320ms cubic-bezier(.2,.8,.2,1) both } .rs-pop { animation: rs-pop 360ms cubic-bezier(.3,1.4,.5,1) both }'
             '.rs-d1 { animation-delay: 60ms } .rs-d2 { animation-delay: 120ms } .rs-d3 { animation-delay: 180ms } .rs-d4 { animation-delay: 240ms }'
             '@media (prefers-reduced-motion: reduce) { .rs-rise, .rs-pop { animation: none } }</style>')


def RS_BODY(per_row, cw, perfect, from_profile, lap=False, parts=False):
    icon = (f'<span class="rs-pop" style="width: 96px; height: 96px; border-radius: 48px; background: {"#F6E3BC" if perfect else RS_SAGE}; color: {"#8A5D16" if perfect else RS_SAGE_INK}; '
            f'display: flex; align-items: center; justify-content: center">{RS_STAR if perfect else RS_CHECK}</span>')
    head = (f'<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center">{icon}'
            f'<h1 class="rs-rise rs-d1" style="margin: 8px 0 0; font-size: 26px; font-weight: 700; letter-spacing: -0.01em"><span style="font-family: {SERIF}">Cmaj7</span> · Inversions</h1></div>')
    tiles = (f'<div class="rs-rise rs-d2" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: {16 if lap else 12}px">'
             + RS_TILE('100%' if perfect else '92%', '', '12 of 12' if perfect else '11 of 12', 'Accuracy')
             + RS_TILE('12' if perfect else '9', 'on time', 'None early or late' if perfect else '2 early · 1 late', 'Timing')
             + RS_TILE('72', 'BPM', 'In Wait mode', 'Tempo') + '</div>')
    run = (f'<section class="rs-rise rs-d3" aria-label="The run" style="display: flex; flex-direction: column; gap: 8px"><h2 style="margin: 0; font-size: 14px; font-weight: 600">The run</h2>'
           + f'<div style="display: flex; flex-direction: column; gap: 8px">{RS_RUNSTAFF(per_row, cw, perfect)}{"" if perfect else RS_LEGEND}</div>' + '</section>')
    # round 63: the run stands on the paper as in the run itself, never a lone card; the heading on the column's edge
    best = ('New personal best · Attempt 5' if perfect else 'Personal best 96% · Attempt 5')
    prof = '' if from_profile else (f'<a href="{"ProfileLaptop" if lap else "Profile"}.dc.html" style="height: 44px; display: inline-flex; align-items: center; gap: 4px; color: {LINK}; '
                                    f'font-size: 15px; font-weight: 600; text-decoration: none">All practice in Profile{CHEV_R}</a>')
    foot = (f'<div class="rs-rise rs-d4" style="display: flex; flex-direction: column; align-items: center; gap: 0">'
            f'<span style="font-size: 15px; color: {SOFT}; font-variant-numeric: tabular-nums">{best}</span>{prof}</div>')
    return (head, tiles, run, foot) if parts else head + tiles + run + foot


# a phone on its side: the acts stand in one row, so the results keep their room (round 66)
def RS_ACTIONS(perfect, from_profile, lap=False):
    run = 'PlayChordLaptop.dc.html' if lap else 'PlayChord.dc.html'
    done = 'ChordsLaptop.dc.html' if lap else 'Chords.dc.html'
    act, href = ('', run) if from_profile else ('again', '')
    if perfect:
        main = BTN('Retry at 80 BPM', act, href, 'primary', 52)
        rest = '' if from_profile else BTN('Done', '', done, 'quiet', 52)
        return f'<div class="rsacts" style="display: grid; gap: 8px">{main}{rest}</div>'
    main = BTN('Practise mistakes', act, href, 'primary', 52)
    rest = BTN('Retry', act, href, 'quiet', 52) + ('' if from_profile else BTN('Done', '', done, 'quiet', 52))
    return f'<div class="rsacts" style="display: grid; gap: 8px">{main}<div style="display: flex; gap: 8px">{rest}</div></div>'


RS_SHOW = (f'<div aria-label="Canvas: show a state" style="flex: none; align-self: center; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 6px; border-radius: 14px; border: 1.5px dashed {LINE}">'
           f'<span style="font-size: 12px; font-weight: 700; color: {SOFT}; padding: 0 4px">CANVAS · SHOW</span>'
           f'<sc-for list="{{{{shows}}}}" as="p" hint-placeholder-count="2"><button type="button" onClick="{{{{p.pick}}}}" style="height: 32px; padding: 0 12px; border: 0; border-radius: 16px; background: {{{{p.bg}}}}; color: {{{{p.fg}}}}; font: inherit; font-size: 13px; font-weight: 600">{{{{p.l}}}}</button></sc-for></div>')


def RS_RESULTS(per_row, cw, from_profile, lap=False):
    both = lambda f: IF('isMiss', f(False), 'true') + IF('isPerfect', f(True))
    body = both(lambda p: RS_BODY(per_row, cw, p, from_profile, lap))
    acts = both(lambda p: RS_ACTIONS(p, from_profile, lap))
    if lap:
        # on a laptop one centred column, as the phone reads: the verdict, its figures, the run, what to do next
        def side(p):
            h, t, r, f = RS_BODY(per_row, cw, p, from_profile, lap, parts=True)
            return (f'<div style="width: min(760px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 24px">'
                    f'{h}{t}{r}<div style="width: min(400px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 16px">{RS_ACTIONS(p, from_profile, lap)}{f}</div></div>')
        return (f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: 24px 56px 48px; display: flex; flex-direction: column; gap: 24px">'
                f'{RS_SHOW}{both(side)}</main>')
    return (f'<main class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding: {8 if from_profile else 16}px 16px 24px; display: flex; flex-direction: column; gap: 20px">{RS_SHOW}{body}</main>'
            f'<div style="flex: none; padding: 12px 16px 34px; box-shadow: 0 -1px 0 {LINE}; background: {PAGE}">{acts}</div>'
            + '<style data-rsacts>[data-menuroot] { container-type: size } @container (max-height: 520px) { .rsacts { display: flex !important } .rsacts > * { flex: 1 } }</style>')


RS_JS = lambda mode: js(r'''
    const S = (o) => set(o), CM7 = { 60: [ROLE[1], 'C'], 64: [ROLE[3], 'E'], 67: [ROLE[5], 'G'], 71: [ROLE[7], 'B'] }, MODE = ''' + mode + r''', view = st.view ?? (MODE === 'run' ? 'run' : 'results'), show = st.show ?? 'After mistakes';
    return { ...common(st, set), isRun: view === 'run', isResults: view === 'results', isMiss: show === 'After mistakes', isPerfect: show === 'Perfect run',
      shows: ['After mistakes', 'Perfect run'].map((l) => ({ l, bg: show === l ? '#332921' : '#EEE9E2', fg: show === l ? '#FEFDFB' : '#332921', pick: () => S({ show: l, view: 'results' }) })),
      playing: !!st.playing, playLabel: st.playing ? 'Pause' : 'Play',
      togglePlay: () => { if (st.playing) { S({ playing: false }); return; } S({ playing: true }); setTimeout(() => S({ playing: false, view: 'results' }), 1400); },
      kb: calmKeys(53, 79, CM7, 402, 112), kbL: calmKeys(36, 96, CM7, 1462, 170), chordT: st.playing ? 'Chord 12 of 12' : 'Chord 11 of 12', prog: st.playing ? '100%' : '92%',
      again: () => S({ view: 'run', playing: false }), closeSheet: () => S({ sheet: null }) };''')

# the run, in the Player: the bar (Close, the exercise, Wait mode), the staff with the run, the keys, the transport
RS_KEYS = lambda h, k='kb': KEYS(h, k, edge=True, ring=False)  # the one instrument, edge to edge


def RS_RUNVIEW(lap):
    close = 'ChordsLaptop.dc.html' if lap else 'Chords.dc.html'
    wait = f'<span style="height: 32px; padding: 0 12px; border-radius: 16px; background: {FILL}; font-size: 13px; font-weight: 600; display: flex; align-items: center; white-space: nowrap">Wait mode</span>'
    bar = TOP('', f'<span style="font-family: {SERIF}">Cmaj7</span> · Inversions', wait, 'Close', CLOSEB(close), n=2)  # the pill is two buttons wide
    bar = LPAD(bar) if lap else bar
    # round 63: the run's music is the page's subject, so it stands on the paper, never in a lone card (edge-lines law
    # 3); on a laptop it is set larger (zoom 1.35) and centred in the band over the transport, never a 760px card
    # with 300px of bare paper under it
    staff = RS_RUNSTAFF(6 if lap else 4, 120 if lap else 84, True).replace(f'color: {RS_SAGE_INK}; font-weight: 700" aria-label="Correct">✓', f'color: transparent" aria-hidden="true">·')
    staff = f'<div style="zoom: 1.35">{staff}</div>' if lap else staff
    prog = (f'<div style="display: flex; align-items: center; gap: 12px"><div style="flex: 1; height: 8px; border-radius: 4px; background: {FILL}"><div style="width: {{{{prog}}}}; height: 8px; border-radius: 4px; background: #44684A"></div></div>'
            f'<span style="font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{chordT}}}}</span></div>')
    transport = (f'<span style="padding: 0 8px; white-space: nowrap; font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">72 BPM</span>{PLAYBTN(56)}'
                 f'<span style="padding: 0 8px; white-space: nowrap; font-size: 14px; color: {SOFT}">Both hands</span>')
    # the music scrolls in what is left, the keys and Play stay at the foot (a phone on its side, round 66)
    inner = f'<div class="nos" style="flex: 1; min-height: 0; overflow-y: auto; padding-bottom: 80px; display: flex; flex-direction: column; gap: 16px">{staff}{prog}</div><div style="flex: none; margin: 0 -16px">{RS_KEYS(112)}</div>'
    if lap:
        return (bar + f'<main style="flex: 1; min-height: 0; padding: 8px 56px 16px; display: flex; flex-direction: column; align-items: center; gap: 16px"><div style="flex: 1"></div><div style="width: 1018px; max-width: 100%; display: flex; flex-direction: column; gap: 8px">{staff}{prog}</div>'
                f'<div style="flex: 1"></div></main><div style="flex: none; box-shadow: 0 -1px 0 {LINE}">{RS_KEYS(170, "kbL")}</div>{DOCK(transport, 186, w="auto")}')
    # the transport floats, as the Player's: the kit's glass dock 12 above the keys, reserving no space; the music's
    # scroll ends clear of it (owner, 2026-11-18: "the floating actions guidelines are broken by that implementation").
    # A phone on its side has a 20 home band, so keys and dock both sit 14 lower (round 66)
    short = ('<style data-rsrun>[data-menuroot] { container-type: size } @container (max-height: 520px) { .rsrun { padding-bottom: 20px !important } '
             '.rsrun ~ [role=toolbar] { bottom: 144px !important } }</style>')
    return bar + f'<main class="rsrun" style="flex: 1; min-height: 0; padding: 4px 16px 34px; display: flex; flex-direction: column; gap: 16px">{inner}</main>{DOCK(transport, 158, w="auto")}' + short


rs_ph = RS_MOTION + IF('isRun', RS_RUNVIEW(False), 'true') + IF('isResults', RS_RESULTS(4, 76, False))
rs_lm = RS_MOTION + IF('isRun', RS_RUNVIEW(True), 'true') + IF('isResults', RS_RESULTS(6, 116, False, True))
detail('PlayChord', 'The Player: a chord practice run and its results', RS_JS("'run'"), rs_ph, rs_lm, '', '', '', 'Practice')
# opened from Profile › Practice history: the bar's Back, no Done and no link back to Profile
rs_pph = RS_MOTION + TOP('Profile.dc.html', 'Today, 14:20', '', 'Profile') + RS_RESULTS(4, 76, True)
rs_plm = RS_MOTION + LTOP('ProfileLaptop.dc.html', '', 'Today, 14:20') + RS_RESULTS(6, 116, True, True)
detail('PracticeResult', 'A practice run’s results, from Profile', RS_JS("'result'"), rs_pph, rs_plm, '', '', '', 'Profile')
print('r56 results ok')

# Round 41: the Player's runs (walk the chords, a chromatic walk, a progression in 12 keys, an exercise) in the run
# view's parts, where a wireframe stood (a staff with no clef and grey dots, keys with no black keys in a card): the
# chords engraved on the treble staff, the one piano edge to edge at the foot with the first chord's tones in their
# paints, the transport centred under the staff; Setup opens the run's choices, as before. Round 68: the music stands
# on the paper as the chord run's does (round 63), never in a lone card, at its 1.35 on a laptop.
PV_WALK = [[('C', 4), ('E', 4), ('G', 4)], [('D', 4), ('F', 4), ('A', 4)], [('E', 4), ('G', 4), ('B', 4)], [('F', 4), ('A', 4), ('C', 5)], [('G', 4), ('B', 4), ('D', 5)], [('A', 4), ('C', 5), ('E', 5)], [('B', 4), ('D', 5), ('F', 5)], [('C', 5), ('E', 5), ('G', 5)]]
_F, _S = '♭', '♯'
PV_MUSIC = {'walk': PV_WALK,
    'chromatic': [[('C', 4), ('E', 4, _F), ('G', 4), ('B', 4, _F)], [('C', 4, _S), ('E', 4), ('G', 4, _S), ('B', 4)], [('D', 4), ('F', 4), ('A', 4), ('C', 5)], [('E', 4, _F), ('G', 4, _F), ('B', 4, _F), ('D', 5, _F)],
                  [('E', 4), ('G', 4), ('B', 4), ('D', 5)], [('F', 4), ('A', 4, _F), ('C', 5), ('E', 5, _F)], [('F', 4, _S), ('A', 4), ('C', 5, _S), ('E', 5)], [('G', 4), ('B', 4, _F), ('D', 5), ('F', 5)]],
    'progression': [[('C', 4), ('E', 4), ('G', 4)], [('B', 3), ('D', 4), ('G', 4)], [('C', 4), ('E', 4), ('A', 4)], [('C', 4), ('F', 4), ('A', 4)]] * 2,
    'exercise': [[(l, o)] for l, o in (('C', 4), ('E', 4), ('F', 4), ('G', 4), ('A', 4), ('G', 4), ('F', 4), ('E', 4))]}
def PV_LINE(n, cw, v='walk', start=0, last=True):
    cells = RS_CELL([], 40, clef=True) + ''.join(RS_CELL(PV_MUSIC[v][i], cw, last=(last and i == start + n - 1)) for i in range(start, start + n))
    return f'<div style="display: flex; justify-content: safe center; overflow: hidden">{cells}</div>'
def PV_RUN(lap, v):
    setup = BTN('Setup', 'openSetup', '', 'plain', 44, False)
    # the transport floats, as the Player's: the kit's glass dock over the paper, 12 above the keys, reserving no
    # space (owner, 2026-11-18: "the floating actions guidelines are broken by that implementation")
    transport = (f'{setup}<span style="padding: 0 8px; white-space: nowrap; font-size: 14px; color: {SOFT}; font-variant-numeric: tabular-nums">{{{{tempoV}}}}</span>{PLAYBTN(56)}')
    if lap:
        return (PVBAR.replace('Practice.dc.html', 'Laptop.dc.html').replace('PlayerSettings.dc.html', 'PlayerLaptop.dc.html')
                + f'<main style="flex: 1; min-height: 0; padding: 8px 56px 16px; display: flex; flex-direction: column; align-items: center; gap: 16px"><div style="flex: 1"></div><div style="zoom: 1.35">{PV_LINE(8, 104, v)}</div>'
                f'<div style="flex: 1"></div></main><div style="flex: none; box-shadow: 0 -1px 0 {LINE}">{RS_KEYS(170, "kbL")}</div>{DOCK(transport, 186, w="auto")}')
    return (PVBAR.replace('Practice.dc.html', 'Main.dc.html')
            + f'<main style="flex: 1; min-height: 0; padding: 4px 16px 34px; display: flex; flex-direction: column; gap: 16px">{PV_LINE(4, 76, v, 0, False)}{PV_LINE(4, 76, v, 4)}<div style="flex: 1"></div>'
            f'<div style="flex: none; margin: 0 -16px">{RS_KEYS(112)}</div></main>{DOCK(transport, 158, w="auto")}')
PV_CT = {"'walk'": "{ 60: [ROLE[1], 'C'], 64: [ROLE[3], 'E'], 67: [ROLE[5], 'G'] }", "'progression'": "{ 60: [ROLE[1], 'C'], 64: [ROLE[3], 'E'], 67: [ROLE[5], 'G'] }",
         "'chromatic'": "{ 60: [ROLE[1], 'C'], 63: [ROLE[3], 'E♭'], 67: [ROLE[5], 'G'], 70: [ROLE[7], 'B♭'] }", "'exercise'": "{ 60: [ROLE[1], 'C'] }"}
PV_KB = lambda v: "const CT = " + PV_CT[v] + ";\n    return { kb: calmKeys(53, 79, CT, 402, 112), kbL: calmKeys(36, 96, CT, 1462, 170),"
for stem, v, ttl in (('PlayWalk', "'walk'", 'The Player: walk the chords of a key'), ('PlayChromatic', "'chromatic'", 'The Player: a chromatic walk'), ('PlayProgression', "'progression'", 'The Player: a progression, in all 12 keys'), ('PlayExercise', "'exercise'", 'The Player: an exercise')):
    detail(stem, ttl, js(PV_SRC.replace('__V__', v).replace('    return {', '    ' + PV_KB(v), 1)), PV_RUN(False, v.strip("'")), PV_RUN(True, v.strip("'")), '', BSHEET('setupOn', 'Setup', PVSTART, 'Close'), POPOVER('setupOn', 'Setup', PVSETL, 'left: calc(50% - 310px); bottom: 262px', 620).replace('max-height: 760px', 'max-height: 600px', 1), 'Practice')
print('r56 runs ok')
