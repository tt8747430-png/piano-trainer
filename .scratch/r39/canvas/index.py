# The one canvas's index: a canvas page per area, a row per screen, laptops left and phones right (R42 canvas 100). Replaces link.py (the pages now carry their own links). Run: python3 -I index.py
import json, re, os
P = '/home/user/piano-trainer/.scratch/r39/canvas/practice/project/'
SONGS = [('Songs', 'SongsLaptop', 'My songs'), ('Song', 'SongLaptop', 'A song'), ('Editor', 'EditorLaptop', 'Score editor')]
PLAYER = [('Player', 'PlayerLaptop', 'The Player'), ('PlayerLoop', 'PlayerLaptopLoop', 'The Player, Practice with a loop'),
          ('PlayerKeyboard', 'PlayerLaptopKeyboard', 'The Player, Keyboard')]
PLAYER_PHONES = [('PlayerPractice', 'Practice: Wait · Play, the tempo, the metronome'), ('PlayerHands', 'Hands'),
                 ('PlayerSettings', 'Song settings: Arrangement or Accompaniment'), ('PlayerKey', 'Transpose'), ('PlayerDone', 'Played through'),
                 ('PlayerDiagrams', 'Diagrams')]
PRACTICE = [('Main', 'Laptop', 'Practice'), ('Chords', 'ChordsLaptop', 'Chords'), ('RandomChords', 'RandomChordsLaptop', 'Random chords'), ('Scales', 'ScalesLaptop', 'Scales and keys'),
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
missing = [b for b in boards if not os.path.exists(P + b)]
links = {b: re.findall(r'href="([^"#{][^"]*\.dc\.html)"', open(P + b).read()) for b in boards if b not in missing}
dead = sorted({(b, h) for b, hs in links.items() for h in hs if not os.path.exists(P + h)})
print(len(boards), 'boards,', sum(map(len, links.values())), 'links; missing', missing, '; dead', dead)
