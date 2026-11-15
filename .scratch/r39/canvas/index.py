# The one canvas's index: a canvas page per area, a row per screen, laptops left and phones right (R42 canvas 100). Replaces link.py (the pages now carry their own links). Run: python3 -I index.py
import json, re, os
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/states_tool.py').read())  # every board's States box, before the links are checked
P = '/home/user/piano-trainer/.scratch/r39/canvas/practice/project/'
SONGS = [('Songs', 'SongsLaptop', 'My songs'), ('Explore', 'ExploreLaptop', 'Explore, a public song, a shared link'), ('Folder', 'FolderLaptop', 'A folder, its settings, Card style, Archived'), ('Archive', 'ArchiveLaptop', 'Archive and Trash'), ('Groups', 'GroupsLaptop', 'Groups, a group, a shared folder, Join'), ('Song', 'SongLaptop', 'A song'), ('SongSettings', 'SongSettingsLaptop', 'A song’s Settings and Publish'), ('Section', 'SectionLaptop', 'A section of a song'), ('Editor', 'EditorLaptop', 'Score editor'), ('EditorDraft', 'EditorDraftLaptop', 'A built-in song’s draft (editors)'), ('Takes', 'TakesLaptop', 'The takes, Review your recording'), ('Take', 'TakeLaptop', 'A take')]
PLAYER = [('Player', 'PlayerLaptop', 'The Player'), ('PlayerLoop', 'PlayerLaptopLoop', 'The Player, Practice with a loop'),
          ('PlayerKeyboard', 'PlayerLaptopKeyboard', 'The Player, Keyboard'),
          ('PlayerHands', 'PlayerLaptopParts', 'The Player, Parts'), ('PlayerViewSheet', 'PlayerLaptopSheet', 'The Player, Sheet settings'), ('PlayWalk', 'PlayWalkLaptop', 'The Player: walk the chords'), ('PlayChromatic', 'PlayChromaticLaptop', 'The Player: a chromatic walk'), ('PlayProgression', 'PlayProgressionLaptop', 'The Player: a progression in 12 keys'), ('PlayExercise', 'PlayExerciseLaptop', 'The Player: an exercise')]
PLAYER_PHONES = [('PlayerPractice', 'Practice: Wait · Play, the tempo, the metronome'), ('PlayerViewDiagrams', 'Diagrams settings'),
                 ('PlayerViewGrid', 'Grid settings'), ('PlayerViewLyrics', 'Lyrics settings'),
                 ('PlayerSettings', 'Song settings: Arrangement or Accompaniment'), ('PlayerKey', 'Transpose'), ('PlayerDone', 'Played through'),
                 ('PlayerDiagrams', 'Diagrams')]
PRACTICE = [('Main', 'Laptop', 'Practice'), ('Chords', 'ChordsLaptop', 'Chords'), ('PlayChord', 'PlayChordLaptop', 'A chord practice run and its results'), ('Scales', 'ScalesLaptop', 'Scales and keys'),
            ('Intervals', 'IntervalsLaptop', 'Intervals'), ('Progressions', 'ProgressionsLaptop', 'Progressions'), ('Progression', 'ProgressionLaptop', 'A progression'), ('ProgressionEdit', 'ProgressionEditLaptop', 'A progression, edited by an editor'),
            ('Accompaniment', 'AccompanimentLaptop', 'Accompaniment'), ('Pattern', 'PatternLaptop', 'A pattern'), ('PatternNew', 'PatternNewLaptop', 'A new pattern'), ('ChordPlayer', 'ChordPlayerLaptop', 'Chord player'),
            ('FingerTechnique', 'FingerTechniqueLaptop', 'Finger technique'), ('JazzVocabulary', 'JazzVocabularyLaptop', 'Jazz vocabulary'), ('Exercise', 'ExerciseLaptop', 'An exercise'), ('Check', 'CheckLaptop', 'Check a song'),
            ('Metronome', 'MetronomeLaptop', 'Metronome'), ('Tuner', 'TunerLaptop', 'Tuner'),
            ('ChordFinder', 'ChordFinderLaptop', 'Chord finder'), ('CircleOfFifths', 'CircleOfFifthsLaptop', 'Circle of fifths')]
# R42 canvas 100 (owner: "group the screens by page and by device and not so scattered"): one canvas page per area;
# on it one row per screen, every laptop board in the left column and every phone board in the right, in step down the
# page; a row's variants (a state, Night) sit beside its main board
LW, PW, GAP, DEVGAP, TITLE, ROWGAP = 2143, 450, 80, 240, 300, 200
def L(stem, name): return (stem, name)
# round 41: every page has its Night board (r69_night.py); a row shows it wherever it is drawn
def NIGHT(stem): return os.path.exists(P + stem + 'Night.dc.html')
PAGES = [
  ('songs', 'Songs', [(n, [L(lp, n + ', laptop')] + ([L(lp + 'Night', n + ', Night, laptop')] if NIGHT(ph) else []), [L(ph, n + ', phone')] + ([L(ph + 'Night', n + ', Night, phone')] if NIGHT(ph) else [])) for ph, lp, n in SONGS]),
  ('player', 'The Player', [
    ('The Player', [L(lp, n + ', laptop') for ph, lp, n in PLAYER], [L(ph, n + ', phone') for ph, lp, n in PLAYER]),
    ('The Player, Night', [L('PlayerLaptopNight', 'The Player, Night, laptop'), L('PlayerLaptopKeyboardNight', 'The Player, Piano, Night, laptop')] + [L(lp + 'Night', n + ', Night, laptop') for ph, lp, n in PLAYER if ph.startswith('Play') and not ph.startswith('Player') and NIGHT(lp)],
     [L('PlayerNight', 'The Player, Night, phone'), L('PlayerKeyboardNight', 'The Player, Piano, Night, phone'), L('PlayerDoneNight', 'The Player, Played through, Night, phone')] + [L(ph + 'Night', n + ', Night, phone') for ph, lp, n in PLAYER if ph.startswith('Play') and not ph.startswith('Player') and NIGHT(ph)]),
    ('The Player’s layers, phone', [], [L(ph, 'The Player, ' + n + ', phone') for ph, n in PLAYER_PHONES])]),
  ('practice', 'Practice', [(n, [L(lp, n + ', laptop')] + ([L(lp + 'Night', n + ', Night, laptop')] if NIGHT(ph) else []),
                                [L(ph, n + ', phone')] + ([L(ph + 'Night', n + ', Night, phone')] if NIGHT(ph) else [])) for ph, lp, n in PRACTICE]),
  ('places', 'Learn, Profile and Settings', [(n, [L(lp, n + ', laptop')] + ([L(lp + 'Night', n + ', Night, laptop')] if NIGHT(ph) else []), [L(ph, n + ', phone')] + ([L(ph + 'Night', n + ', Night, phone')] if NIGHT(ph) else [])) for ph, lp, n in [('Learn', 'LearnLaptop', 'Learn'), ('LearnLevel', 'LearnLevelLaptop', 'A level'), ('LearnCourses', 'LearnCoursesLaptop', 'Courses'), ('LearnYours', 'LearnYoursLaptop', 'Your lessons and courses'), ('Profile', 'ProfileLaptop', 'Profile'), ('PracticeResult', 'PracticeResultLaptop', 'A practice run’s results, from Profile'), ('Settings', 'SettingsLaptop', 'Settings'), ('Admin', 'AdminLaptop', 'Administration'), ('Lesson', 'LessonLaptop', 'A lesson, read and edited'), ('Course', 'CourseLaptop', 'A course, read and edited'), ('YourLessonSettings', 'YourLessonSettingsLaptop', 'Your own lesson’s Settings'), ('YourCourseSettings', 'YourCourseSettingsLaptop', 'Your own course’s Settings'), ('SignIn', 'SignInLaptop', 'Sign in and the account pages'), ('Legal', 'LegalLaptop', 'Privacy Policy and Terms'), ('AppLayers', 'AppLayersLaptop', 'Across the app: search, MIDI, shortcuts, notices, route states')]])]
d = json.load(open(P + 'canvas.json'))
boards, order, notes = {}, [], {}
# canvas 101 (owner: "put them in a row like the all the flows screens pages in one row for phone then the dark mode
# and after that the same for laptop"): on each page, the flow's phone screens in one row in the flow's order, then
# their Night boards, then the laptop screens, then theirs
def night(stem): return stem.endswith('Night')
for pid, pname, rows in PAGES:
    phones = [b for r in rows for b in r[2]]; laps = [b for r in rows for b in r[1]]
    bands = [('Phone', [b for b in phones if not night(b[0])], PW, 920), ('Phone, Night', [b for b in phones if night(b[0])], PW, 920),
             ('Laptop', [b for b in laps if not night(b[0])], LW, 1299), ('Laptop, Night', [b for b in laps if night(b[0])], LW, 1299)]
    y = 0
    for name, items, w, h in bands:
        if not items: continue
        notes['%s-%s' % (pid, name.lower().replace(', ', '-'))] = {'x': 0, 'y': y, 'text': name, 'kind': 'title1', 'maxW': len(items) * (w + GAP) - GAP, 'page': pid}
        for i, (stem, t) in enumerate(items):
            boards[stem + '.dc.html'] = {'x': i * (w + GAP), 'y': y + TITLE, 'w': w, 'h': h, 'title': t, 'is_interactive': True, 'page': pid}
            order.append(stem + '.dc.html')
        y += TITLE + h + ROWGAP
d.update(title='The ideal Piano Trainer', boards=boards, order=order, notes=notes,
         pages=[{'id': pid, 'name': pname} for pid, pname, _ in PAGES], launch={'view': 'canvas', 'page': 'practice'})
d.pop('noteOrder', None)
json.dump(d, open(P + 'canvas.json', 'w'), ensure_ascii=False, indent=2)
# canvas 167: the one piano, every board's 2D keys in the app's faces (keyface.py)
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/keyface.py').read())
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/lapwin.py').read())
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/folds.py').read())
for b in boards:
    if os.path.exists(P + b):
        h0 = open(P + b).read(); h1 = folds(lapwin(keyface(h0), night(b[:-8])), b[:-8])
        # the bar floats (owner, 2026-11-15: "the headers … dont make sense to have background when we have floating buttons"):
        # its glass buttons stand over the page, which starts under them and scrolls beneath; nothing is painted behind them
        if 'header data-float' in h1 and 'data-floatcss' not in h1:
            h1 = h1.replace('</head>', '<style data-floatcss>header[data-float] { z-index: 30; pointer-events: none }'
                            ' header[data-float]:has(+ [style*=\"flex-direction: column\"], + :not([style*=\"display: flex\"]):not([style*=\"display: grid\"]):not(sc-if):not(style)) { margin-bottom: -56px }'
                            ' header[data-float] > * { pointer-events: auto }'
                            ' header[data-float] + [style*=\"flex-direction: column\"]::before, header[data-float] + :not([style*=\"display: flex\"]):not([style*=\"display: grid\"]):not(sc-if):not(style)::before { content: \"\"; display: block; flex: none; height: 56px }'
                            ' :has(> header[data-float]) { timeline-scope: --page } header[data-float] + * { scroll-timeline: --page y }'
                            ' header[data-float]:has(+ [style*=\"flex-direction: column\"], + :not([style*=\"display: flex\"]):not([style*=\"display: grid\"]):not(sc-if):not(style)) [data-bar-title] { animation: bar-title linear both; animation-timeline: --page; animation-range: 0 40px }'
                            ' @keyframes bar-title { to { opacity: 0; transform: translateY(-6px) } }</style></head>', 1)
        # on a phone the floating bar steps aside while the learner reads down and returns on the first move up (owner,
        # 2026-11-15: "the main focus of the page and the other things can be easily hide or show"; Apple HIG, Toolbars:
        # hide bars on swipe to give the content the screen; Material 3, top app bar: hide on scroll, return on scroll up)
        if 'header data-float' in h1 and 'data-barhide' not in h1 and 'Laptop' not in b:
            h1 = h1.replace('</head>', '<style data-barhide>header[data-float] { transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 160ms cubic-bezier(0.22, 1, 0.36, 1) }'
                            ' header[data-float][data-away] { transform: translateY(-64px); opacity: 0; pointer-events: none !important }'
                            ' header[data-float][data-away] > * { pointer-events: none !important }'
                            ' @media (prefers-reduced-motion: reduce) { header[data-float] { transition: none } }</style>'
                            '<script data-barhide>(() => { const last = new WeakMap(); document.addEventListener("scroll", (e) => { const t = e.target;'
                            ' if (!(t instanceof Element)) return; const h = t.previousElementSibling; if (!h || !h.matches("header[data-float]")) return;'
                            ' const y = t.scrollTop, p = last.has(t) ? last.get(t) : 0; if (Math.abs(y - p) < 6) return; last.set(t, y);'
                            ' if (y > p && y > 56) h.setAttribute("data-away", ""); else h.removeAttribute("data-away"); }, true); })();</script></head>', 1)
        if '<!--piano2d-->' in h1 and 'PIANO2D' not in h1:
            import sys; sys.path.insert(0, '/home/user/piano-trainer/.scratch/r39/canvas'); import piano_sheet as _PS
            k = h1.rindex('</script>'); h1 = h1[:k] + '/*PIANO2D*/' + _PS.PIANO2D_JS + h1[k:]
        if h1 != h0: open(P + b, 'w').write(h1)
missing = [b for b in boards if not os.path.exists(P + b)]
links = {b: re.findall(r'href="([^"#{][^"]*\.dc\.html)"', open(P + b).read()) for b in boards if b not in missing}
dead = sorted({(b, h) for b, hs in links.items() for h in hs if not os.path.exists(P + h)})
print(len(boards), 'boards,', sum(map(len, links.values())), 'links; missing', missing, '; dead', dead)
