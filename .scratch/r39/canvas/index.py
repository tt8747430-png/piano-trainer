# The one canvas's index: a canvas page per area, a row per screen, laptops left and phones right (R42 canvas 100). Replaces link.py (the pages now carry their own links). Run: python3 -I index.py
import json, re, os
P = '/home/user/piano-trainer/.scratch/r39/canvas/practice/project/'
SONGS = [('Songs', 'SongsLaptop', 'My songs'), ('Song', 'SongLaptop', 'A song'), ('Editor', 'EditorLaptop', 'Score editor')]
PLAYER = [('Player', 'PlayerLaptop', 'The Player'), ('PlayerLoop', 'PlayerLaptopLoop', 'The Player, Practice with a loop'),
          ('PlayerKeyboard', 'PlayerLaptopKeyboard', 'The Player, Keyboard')]
PLAYER_PHONES = [('PlayerPractice', 'Practice: Wait · Play, the tempo, the metronome'), ('PlayerHands', 'Hands'),
                 ('PlayerSettings', 'Song settings: Arrangement or Accompaniment'), ('PlayerDone', 'Played through'),
                 ('PlayerDiagrams', 'Diagrams')]
PRACTICE = [('Main', 'Laptop', 'Practice'), ('Chords', 'ChordsLaptop', 'Chords'), ('Scales', 'ScalesLaptop', 'Scales and keys'),
            ('Intervals', 'IntervalsLaptop', 'Intervals'), ('Progressions', 'ProgressionsLaptop', 'Progressions'), ('Progression', 'ProgressionLaptop', 'A progression'),
            ('Accompaniment', 'AccompanimentLaptop', 'Accompaniment'), ('ChordPlayer', 'ChordPlayerLaptop', 'Chord player'),
            ('Exercises', 'ExercisesLaptop', 'Exercises'), ('Exercise', 'ExerciseLaptop', 'An exercise'), ('Quiz', 'QuizLaptop', 'Quiz'),
            ('QuizRun', 'QuizRunLaptop', 'A quiz run'), ('Metronome', 'MetronomeLaptop', 'Metronome'), ('Tuner', 'TunerLaptop', 'Tuner'),
            ('ChordFinder', 'ChordFinderLaptop', 'Chord finder'), ('CircleOfFifths', 'CircleOfFifthsLaptop', 'Circle of fifths')]
# R42 canvas 100 (owner: "group the screens by page and by device and not so scattered"): one canvas page per area;
# on it one row per screen, every laptop board in the left column and every phone board in the right, in step down the
# page; a row's variants (a state, Night) sit beside its main board
LW, PW, GAP, DEVGAP, TITLE, ROWGAP = 2143, 450, 80, 240, 300, 200
def L(stem, name): return (stem, name)
PAGES = [
  ('songs', 'Songs', [(n, [L(lp, n + ', laptop')], [L(ph, n + ', phone')]) for ph, lp, n in SONGS]),
  ('player', 'The Player', [
    ('The Player', [L(lp, n + ', laptop') for ph, lp, n in PLAYER], [L(ph, n + ', phone') for ph, lp, n in PLAYER]),
    ('The Player’s layers, phone', [], [L(ph, 'The Player, ' + n + ', phone') for ph, n in PLAYER_PHONES]),
    ('Earlier drafts of the Player', [L('PlayerDesk', 'The Player, earlier draft, laptop')], [L('PlayerApp', 'The Player, earlier draft, phone')])]),
  ('practice', 'Practice', [(n, [L(lp, n + ', laptop')] + ([L('ChordsLaptopNight', 'Chords, Night, laptop')] if ph == 'Chords' else []),
                                [L(ph, n + ', phone')] + ([L('ChordsNight', 'Chords, Night, phone')] if ph == 'Chords' else [])) for ph, lp, n in PRACTICE])]
d = json.load(open(P + 'canvas.json'))
boards, order, notes = {}, [], {}
for pid, pname, rows in PAGES:
    nl = max(len(r[1]) for r in rows); px = nl * (LW + GAP) - GAP + DEVGAP
    notes[pid + '-laptop'] = {'x': 0, 'y': 0, 'text': 'Laptop', 'kind': 'title1', 'maxW': px - DEVGAP, 'page': pid}
    notes[pid + '-phone'] = {'x': px, 'y': 0, 'text': 'Phone', 'kind': 'title1', 'maxW': 8 * (PW + GAP), 'page': pid}
    y = TITLE
    for k, (name, laps, phones) in enumerate(rows):
        h = 1299 if laps else 920
        notes['%s-%d' % (pid, k)] = {'x': 0, 'y': y, 'text': name, 'kind': 'title1', 'maxW': px + len(phones) * (PW + GAP), 'page': pid}
        top = y + TITLE
        for i, (stem, t) in enumerate(laps):
            boards[stem + '.dc.html'] = {'x': i * (LW + GAP), 'y': top, 'w': LW, 'h': 1299, 'title': t, 'is_interactive': True, 'page': pid}
            order.append(stem + '.dc.html')
        for i, (stem, t) in enumerate(phones):
            boards[stem + '.dc.html'] = {'x': px + i * (PW + GAP), 'y': top + h - 920, 'w': PW, 'h': 920, 'title': t, 'is_interactive': True, 'page': pid}
            order.append(stem + '.dc.html')
        y = top + h + ROWGAP
d.update(title='The ideal Piano Trainer', boards=boards, order=order, notes=notes,
         pages=[{'id': pid, 'name': pname} for pid, pname, _ in PAGES], launch={'view': 'canvas', 'page': 'practice'})
d.pop('noteOrder', None)
json.dump(d, open(P + 'canvas.json', 'w'), ensure_ascii=False, indent=2)
missing = [b for b in boards if not os.path.exists(P + b)]
links = {b: re.findall(r'href="([^"#{][^"]*\.dc\.html)"', open(P + b).read()) for b in boards if b not in missing}
dead = sorted({(b, h) for b, hs in links.items() for h in hs if not os.path.exists(P + h)})
print(len(boards), 'boards,', sum(map(len, links.values())), 'links; missing', missing, '; dead', dead)
