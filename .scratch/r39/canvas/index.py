import re
# The one canvas's index: a canvas page per area, a row per screen, laptops left and phones right (R42 canvas 100). Replaces link.py (the pages now carry their own links). Run: python3 -I index.py
import json, re, os
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/states_tool.py').read())  # every board's States box, before the links are checked
P = '/home/user/piano-trainer/.scratch/r39/canvas/practice/project/'
SONGS = [('Songs', 'SongsLaptop', 'My songs'), ('AllSongs', 'AllSongsLaptop', 'All songs, Select, Sort'), ('Explore', 'ExploreLaptop', 'Explore, a public song, a shared link'), ('Folder', 'FolderLaptop', 'A playlist, its settings, Card style, Archived'), ('SharedFolder', 'SharedFolderLaptop', 'A playlist shared with you'), ('Archive', 'ArchiveLaptop', 'Archive: Select, Restore, Move to Trash'), ('Trash', 'TrashLaptop', 'Trash: Select, Restore, Delete permanently'), ('Groups', 'GroupsLaptop', 'Groups, a group, a shared folder, Join'), ('Song', 'SongLaptop', 'A song'), ('SongSettings', 'SongSettingsLaptop', 'A song’s Settings and Publish'), ('Section', 'SectionLaptop', 'A section of a song'), ('Editor', 'EditorLaptop', 'Score editor'), ('EditorDraft', 'EditorDraftLaptop', 'A built-in song’s draft (editors)'), ('Takes', 'TakesLaptop', 'The takes, Review your recording'), ('Take', 'TakeLaptop', 'A take')]
PLAYER = [('Player', 'PlayerLaptop', 'The Player'), ('PlayerLoop', 'PlayerLaptopLoop', 'The Player, practising with a loop'),
          ('PlayerKeyboard', 'PlayerLaptopKeyboard', 'The Player, Keyboard'), ('PlayerDone', 'PlayerDoneLaptop', 'The Player, Played through'),
          ('PlayerHands', 'PlayerLaptopParts', 'The Player, Parts'), ('PlayerViewSheet', 'PlayerLaptopSheet', 'The Player, Sheet settings'), ('PlayWalk', 'PlayWalkLaptop', 'The Player: walk the chords'), ('PlayChromatic', 'PlayChromaticLaptop', 'The Player: a chromatic walk'), ('PlayProgression', 'PlayProgressionLaptop', 'The Player: a progression in 12 keys'), ('PlayExercise', 'PlayExerciseLaptop', 'The Player: an exercise')]
PLAYER_PHONES = [('PlayerPractice', 'Practice: Wait · Play, the tempo, the metronome'), ('PlayerViewDiagrams', 'Diagrams settings'),
                 ('PlayerViewGrid', 'Grid settings'), ('PlayerViewLyrics', 'Lyrics settings'),
                 ('PlayerSettings', 'Song settings: Arrangement or Accompaniment'), ('PlayerKey', 'Transpose'),
                 ('PlayerDiagrams', 'Diagrams')]
PRACTICE = [('Main', 'Laptop', 'Practice'), ('Chords', 'ChordsLaptop', 'Chords'), ('PlayChord', 'PlayChordLaptop', 'A chord practice run and its results'), ('Scales', 'ScalesLaptop', 'Scales and keys'),
            ('Intervals', 'IntervalsLaptop', 'Intervals'), ('Progressions', 'ProgressionsLaptop', 'Progressions'), ('Progression', 'ProgressionLaptop', 'A progression'), ('ProgressionEdit', 'ProgressionEditLaptop', 'A progression, edited by an editor'),
            ('Accompaniment', 'AccompanimentLaptop', 'Accompaniment'), ('Pattern', 'PatternLaptop', 'A pattern'), ('PatternNew', 'PatternNewLaptop', 'A new pattern'), ('ChordPlayer', 'ChordPlayerLaptop', 'Chord player'),
            ('FingerTechnique', 'FingerTechniqueLaptop', 'Finger technique'), ('JazzVocabulary', 'JazzVocabularyLaptop', 'Jazz vocabulary'), ('Exercise', 'ExerciseLaptop', 'An exercise'), ('Check', 'CheckLaptop', 'Check a song'),
            ('Metronome', 'MetronomeLaptop', 'Metronome'), ('Tuner', 'TunerLaptop', 'Tuner'),
            ('ChordFinder', 'ChordFinderLaptop', 'Chord finder'), ('CircleOfFifths', 'CircleOfFifthsLaptop', 'Circle of fifths')]
# R42 canvas 100 (owner: "group the screens by page and by device and not so scattered"): one canvas page per area;
# on it one row per screen, every laptop board in the left column and every phone board in the right, in step down the
# page; a row's variants (a state) sit beside its main board
LW, PW, GAP, DEVGAP, TITLE, ROWGAP = 2143, 450, 80, 240, 300, 200
def L(stem, name): return (stem, name)
PAGES = [
  ('songs', 'Songs', [(n, [L(lp, n + ', laptop')], [L(ph, n + ', phone')]) for ph, lp, n in SONGS]),
  ('player', 'The Player', [
    ('The Player', [L(lp, n + ', laptop') for ph, lp, n in PLAYER], [L(ph, n + ', phone') for ph, lp, n in PLAYER]),
    ('The Player’s layers, phone', [], [L(ph, 'The Player, ' + n + ', phone') for ph, n in PLAYER_PHONES])]),
  ('practice', 'Practice', [(n, [L(lp, n + ', laptop')],
                                [L(ph, n + ', phone')]) for ph, lp, n in PRACTICE]),
  ('places', 'Learn, Profile and Settings', [(n, [L(lp, n + ', laptop')], [L(ph, n + ', phone')]) for ph, lp, n in [('Learn', 'LearnLaptop', 'Learn'), ('LearnLevel', 'LearnLevelLaptop', 'A level'), ('LearnCourses', 'LearnCoursesLaptop', 'Courses'), ('LearnYours', 'LearnYoursLaptop', 'Made by you'), ('Profile', 'ProfileLaptop', 'Profile'), ('PracticeResult', 'PracticeResultLaptop', 'A practice run’s results, from Profile'), ('Settings', 'SettingsLaptop', 'Settings'), ('Admin', 'AdminLaptop', 'Administration'), ('Lesson', 'LessonLaptop', 'A lesson, read and edited'), ('Course', 'CourseLaptop', 'A course, read and edited'), ('YourLessonSettings', 'YourLessonSettingsLaptop', 'Your own lesson’s Settings'), ('YourCourseSettings', 'YourCourseSettingsLaptop', 'Your own course’s Settings'), ('SignIn', 'SignInLaptop', 'Sign in and the account pages'), ('Legal', 'LegalLaptop', 'Privacy Policy and Terms'), ('AppLayers', 'AppLayersLaptop', 'Across the app: search, MIDI, shortcuts, notices, route states')]])]
d = json.load(open(P + 'canvas.json'))
boards, order, notes = {}, [], {}
# canvas 101: on each page, the flow's phone screens in one row in the flow's order, then the laptop screens (Day only:
# owner, 2026-11-16, "remove all the night versions")
for pid, pname, rows in PAGES:
    phones = [b for r in rows for b in r[2]]; laps = [b for r in rows for b in r[1]]
    bands = [('Phone', phones, PW, 920), ('Laptop', laps, LW, 1299)]
    y = 0
    for name, items, w, h in bands:
        if not items: continue
        notes['%s-%s' % (pid, name.lower().replace(', ', '-'))] = {'x': 0, 'y': y, 'text': name, 'kind': 'title1', 'maxW': len(items) * (w + GAP) - GAP, 'page': pid}
        for i, (stem, t) in enumerate(items):
            boards[stem + '.dc.html'] = {'x': i * (w + GAP), 'y': y + TITLE, 'w': w, 'h': h, 'title': t, 'is_interactive': True, 'page': pid}
            order.append(stem + '.dc.html')
        y += TITLE + h + ROWGAP
# what the page itself saved is kept (the owner's note sizes, its note order, the boards only the published copy has)
for k, n in d.get('notes', {}).items():
    if k in notes:
        notes[k].update({f: n[f] for f in ('w', 'maxW') if f in n})
for k in ('PlayerApp.dc.html', 'PlayerDesk.dc.html'):
    if k in d.get('boards', {}):
        boards[k] = d['boards'][k]; order.append(k)
d.update(title='The ideal Piano Trainer', boards=boards, order=order, notes=notes,
         pages=[{'id': pid, 'name': pname} for pid, pname, _ in PAGES], launch={'view': 'canvas', 'page': 'practice'})
json.dump(d, open(P + 'canvas.json', 'w'), ensure_ascii=False, indent=2)
# canvas 167: the one piano, every board's 2D keys in the app's faces (keyface.py)
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/keyface.py').read())
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/lapwin.py').read())
exec(open('/home/user/piano-trainer/.scratch/r39/canvas/folds.py').read())

_FX = ('background: rgba(254,253,251,.86); -webkit-backdrop-filter: blur(24px) saturate(1.8); backdrop-filter: blur(24px) saturate(1.8); '
       'box-shadow: 0 0 0 1px #DAD1C8, 0 1px 3px rgba(51,41,33,.12), 0 6px 14px -4px rgba(51,41,33,.14), 0 14px 28px -8px rgba(51,41,33,.14)')
_GEL = re.compile(r'<(a|button)\b[^>]*?style="[^"]*?width: 44px; height: 44px;[^"]*?' + re.escape(_FX) + r'[^"]*"[^>]*>(?:(?!</?(?:a|button)\b).)*?</\1>', re.S)
def _glassgroups(h):
    ms = list(_GEL.finditer(h)); runs = []; cur = []
    for m in ms:
        if cur and h[cur[-1].end():m.start()].strip() == '': cur.append(m)
        else:
            if len(cur) > 1: runs.append(cur)
            cur = [m]
    if len(cur) > 1: runs.append(cur)
    for run in reversed(runs):
        inner = ''.join(m.group(0).replace(_FX, 'background: transparent', 1) for m in run)
        h = h[:run[0].start()] + f'<div data-glassgroup style="flex: none; display: flex; border-radius: 22px; {_FX}">' + inner + '</div>' + h[run[-1].end():]
    return h

for b in boards:
    if os.path.exists(P + b):
        h0 = open(P + b).read(); h1 = folds(lapwin(keyface(h0)), b[:-8])
        # the bar floats (owner, 2026-11-15: "the headers … dont make sense to have background when we have floating buttons"):
        # its glass buttons stand over the page, which starts under them and scrolls beneath; nothing is painted behind them
        FL = ('<style data-floatcss>header[data-float] { z-index: 30; pointer-events: none }'
                            ' header[data-float]:has(+ [style*=\"flex-direction: column\"], + :not([style*=\"display: flex\"]):not([style*=\"display: grid\"]):not(sc-if):not(style)) { margin-bottom: -56px }'
                            ' header[data-float] > * { pointer-events: auto }'
                            ' header[data-float] + [style*=\"flex-direction: column\"], header[data-float] + :not([style*=\"display: flex\"]):not([style*=\"display: grid\"]):not(sc-if):not(style) { border-top: 56px solid transparent; background-clip: padding-box }'
                            ' :has(> header[data-float]) { timeline-scope: --page } header[data-float] + * { scroll-timeline: --page y }'
                            ' header[data-float]:has(+ [style*=\"flex-direction: column\"], + :not([style*=\"display: flex\"]):not([style*=\"display: grid\"]):not(sc-if):not(style)) [data-bar-title] { animation: bar-title linear both; animation-timeline: --page; animation-range: 0 40px }'
                            ' @keyframes bar-title { to { opacity: 0; transform: translateY(-6px) } }</style>')
        if 'header data-float' in h1:  # rewritten where it stands, so a rebuild is byte-stable
            h1 = re.sub(r'<style data-floatcss>.*?</style>', lambda m: FL, h1, count=1, flags=re.S) if 'data-floatcss' in h1 else h1.replace('</head>', FL + '</head>', 1)
        else:
            h1 = re.sub(r'<style data-floatcss>.*?</style>', '', h1, flags=re.S)
        # a sheet or popover keeps its own scroll: reaching its end never scrolls the page under it (Apple HIG, Sheets;
        # Web Interface Guidelines, overscroll-behavior: contain); a tap never waits on double-tap zoom (touch-action)
        if 'data-sheetcss' not in h1:
            h1 = h1.replace('</head>', '<style data-sheetcss>[role=dialog], [role=dialog] .nos { overscroll-behavior: contain }'
                            ' button, a, [role=switch], [role=radio], [role=slider] { touch-action: manipulation }</style></head>', 1)
        # icons side by side in a bar share one glass (Apple HIG, Toolbars: "Group toolbar items logically by function";
        # a text button keeps its own capsule): a run of 44 glass circles becomes one capsule, each keeping its 44 target
        h1 = _glassgroups(h1)
        if '<!--piano2d-->' in h1 and 'PIANO2D' not in h1:
            import sys; sys.path.insert(0, '/home/user/piano-trainer/.scratch/r39/canvas'); import piano_sheet as _PS
            k = h1.rindex('</script>'); h1 = h1[:k] + '/*PIANO2D*/' + _PS.PIANO2D_JS + h1[k:]
        if h1 != h0: open(P + b, 'w').write(h1)
missing = [b for b in boards if not os.path.exists(P + b)]
links = {b: re.findall(r'href="([^"#{][^"]*\.dc\.html)"', open(P + b).read()) for b in boards if b not in missing}
dead = sorted({(b, h) for b, hs in links.items() for h in hs if not os.path.exists(P + h)})
print(len(boards), 'boards,', sum(map(len, links.values())), 'links; missing', missing, '; dead', dead)
