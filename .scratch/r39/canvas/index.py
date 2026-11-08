# R40: the one canvas's index. Each page is a laptop board with its phone beside it, three pages to a row,
# Songs first, then Practice. Replaces link.py (the pages now carry their own links). Run: python3 -I index.py
import json, re, os
P = '/home/user/piano-trainer/.scratch/r39/canvas/practice/project/'
SONGS = [('Songs', 'SongsLaptop', 'My songs'), ('Song', 'SongLaptop', 'A song'), ('Editor', 'EditorLaptop', 'Score editor')]
PRACTICE = [('Main', 'Laptop', 'Practice'), ('Chords', 'ChordsLaptop', 'Chords'), ('Scales', 'ScalesLaptop', 'Scales and keys'),
            ('Intervals', 'IntervalsLaptop', 'Intervals'), ('Progressions', 'ProgressionsLaptop', 'Progressions'), ('Progression', 'ProgressionLaptop', 'A progression'),
            ('Accompaniment', 'AccompanimentLaptop', 'Accompaniment'), ('ChordPlayer', 'ChordPlayerLaptop', 'Chord player'),
            ('Exercises', 'ExercisesLaptop', 'Exercises'), ('Exercise', 'ExerciseLaptop', 'An exercise'), ('Quiz', 'QuizLaptop', 'Quiz'),
            ('QuizRun', 'QuizRunLaptop', 'A quiz run'), ('Metronome', 'MetronomeLaptop', 'Metronome'), ('Tuner', 'TunerLaptop', 'Tuner'),
            ('ChordFinder', 'ChordFinderLaptop', 'Chord finder'), ('CircleOfFifths', 'CircleOfFifthsLaptop', 'Circle of fifths')]
CW, CH, PER = 2143 + 80 + 450 + 240, 1299 + 260, 3
d = json.load(open(P + 'canvas.json'))
boards, order, notes, y0 = {}, [], {}, 0
for key, title, pages in (('songs', 'Songs', SONGS), ('practice', 'Practice', PRACTICE)):
    notes[key] = {'x': 0, 'y': y0, 'text': title, 'kind': 'title1', 'maxW': CW * PER}
    for i, (ph, lp, name) in enumerate(pages):
        x, y = (i % PER) * CW, y0 + 300 + (i // PER) * CH
        boards[lp + '.dc.html'] = {'x': x, 'y': y, 'w': 2143, 'h': 1299, 'title': name + ', laptop', 'is_interactive': True}
        boards[ph + '.dc.html'] = {'x': x + 2143 + 80, 'y': y + 1299 - 920, 'w': 450, 'h': 920, 'title': name + ', phone', 'is_interactive': True}
        order += [lp + '.dc.html', ph + '.dc.html']
    y0 += 300 + ((len(pages) + PER - 1) // PER) * CH + 200
d.update(title='The ideal Piano Trainer', boards=boards, order=order, notes=notes)
json.dump(d, open(P + 'canvas.json', 'w'), ensure_ascii=False, indent=2)
missing = [b for b in boards if not os.path.exists(P + b)]
links = {b: re.findall(r'href="([^"#{][^"]*\.dc\.html)"', open(P + b).read()) for b in boards if b not in missing}
dead = sorted({(b, h) for b, hs in links.items() for h in hs if not os.path.exists(P + h)})
print(len(boards), 'boards,', sum(map(len, links.values())), 'links; missing', missing, '; dead', dead)
