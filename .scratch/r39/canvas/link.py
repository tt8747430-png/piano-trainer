# One canvas for the whole app: copies the Songs boards into the Practice canvas's folder and joins every page
# with links (Play follows them). Run after any generator: python3 -I link.py
import json, re, shutil
BASE = '/home/user/piano-trainer/.scratch/r39/canvas/'
P = BASE + 'practice/project/'
SONGS = {'Main.dc.html': 'Songs.dc.html', 'Laptop.dc.html': 'SongsLaptop.dc.html', 'Song.dc.html': 'Song.dc.html',
         'SongLaptop.dc.html': 'SongLaptop.dc.html', 'Editor.dc.html': 'Editor.dc.html', 'EditorLaptop.dc.html': 'EditorLaptop.dc.html'}
for a, b in SONGS.items():
    shutil.copy(BASE + 'songs/project/' + a, P + b)

# Practice's pages by the label on the overview, phone board and laptop board
PAGES = [('Scales and keys', 'Scales'), ('Chord player', 'ChordPlayer'), ('Chord finder', 'ChordFinder'), ('Circle of fifths', 'CircleOfFifths'),
         ('Chords', 'Chords'), ('Intervals', 'Intervals'), ('Progressions', 'Progressions'), ('Accompaniment', 'Accompaniment'),
         ('Exercises', 'Exercise'), ('Quiz', 'Quiz'), ('Metronome', 'Metronome'), ('Tuner', 'Tuner')]
def board(stem, laptop):
    if stem == 'Exercise' and laptop: return 'ExercisesLaptop.dc.html'
    return stem + ('Laptop' if laptop else '') + '.dc.html'
def text(s, i, close):
    j = s.find(close, i)
    return ' '.join(re.sub(r'<[^>]+>', ' ', s[i:j]).split())

def to_link(s, opening, href):
    # a <button> becomes an <a> with the same look; its first </button> after it closes it
    i = s.find(opening)
    if i < 0: return s
    j = s.find('</button>', i)
    tag_end = s.find('>', i)
    tag = s[i:tag_end + 1].replace('<button type="button"', '<a href="' + href + '"', 1)
    tag = re.sub(r'style="', 'style="text-decoration: none; ', tag, count=1)
    return s[:i] + tag + s[tag_end + 1:j] + '</a>' + s[j + len('</button>'):]

for f in sorted(x for x in __import__('os').listdir(P) if x.endswith('.dc.html')):
    s = open(P + f).read()
    lap = f.endswith('Laptop.dc.html') or f == 'Laptop.dc.html'
    home = {'Songs': 'SongsLaptop.dc.html' if lap else 'Songs.dc.html', 'Practice': 'Laptop.dc.html' if lap else 'Main.dc.html'}
    def fix(m):
        t = text(s, m.start(), '</a>')
        for word, target in home.items():
            if t == word: return m.group(0).replace('href="#"', 'href="' + target + '"')
        if f in ('Main.dc.html', 'Laptop.dc.html'):
            for label, stem in PAGES:
                if re.search(r'(^|\s)' + re.escape(label) + r'(\s|$)', t):
                    return m.group(0).replace('href="#"', 'href="' + board(stem, lap) + '"')
        if f in ('Songs.dc.html', 'SongsLaptop.dc.html') and t.startswith('{{s.t}}'):
            return m.group(0).replace('href="#"', 'href="' + ('SongLaptop.dc.html' if lap else 'Song.dc.html') + '"')
        return m.group(0)
    s = re.sub(r'<a href="#"', fix, s)
    for label, target in [('Back to Practice', home['Practice']), ('Back to Exercises', home['Practice']), ('Back to My songs', home['Songs']),
                          ('Back to Progressions', 'ProgressionsLaptop.dc.html' if lap else 'Progressions.dc.html')]:
        while '<button type="button" aria-label="' + label + '"' in s:
            s = to_link(s, '<button type="button" aria-label="' + label + '"', target)
    if f in ('Editor.dc.html', 'EditorLaptop.dc.html'):
        s = to_link(s, '<button type="button" style="flex: none; height: 40px; padding: 0 12px; border: 0; border-radius: 9999px; background: #EFE8DF; color: #1A1612; font-size: 16px; font-weight: 700">Done</button>'[:-len('Done</button>')], 'SongLaptop.dc.html' if lap else 'Song.dc.html')
    if f in ('Song.dc.html', 'SongLaptop.dc.html'):
        s = re.sub(r"label: '([^']+)'", lambda m: m.group(0) + ", href: '" + (('EditorLaptop.dc.html' if lap else 'Editor.dc.html') if m.group(1) == 'Edit score' else '#') + "'", s)
    if f in ('Progressions.dc.html', 'ProgressionsLaptop.dc.html'):
        tgt = 'ProgressionLaptop.dc.html' if lap else 'Progression.dc.html'
        s = re.sub(r'<span style="([^"]*)">\{\{(r|t)\.name\}\}</span>', lambda m: '<a href="' + tgt + '" style="' + m.group(1) + '; color: inherit; text-decoration: none">{{' + m.group(2) + '.name}}</a>', s)
    open(P + f, 'w').write(s)

# the moreItems menu on a song's page: each item an <a> carrying its href
for f in ('Song.dc.html', 'SongLaptop.dc.html'):
    s = open(P + f).read()
    i = s.find('{{m.label}}')
    if i > 0:
        k = s.rfind('<button', 0, i)
        if '{{m.' in s[k:i] and 'href' not in s[k:s.find('>', k)]:
            s = to_link(s[:k] + s[k:].replace('<button type="button"', '<button type="button" data-m', 1), '<button type="button" data-m', '{{m.href}}')
    open(P + f, 'w').write(s)

# the index: Songs first, Practice below, a title over each
d = json.load(open(P + 'canvas.json'))
songs = json.load(open(BASE + 'songs/project/canvas.json'))
d['title'] = 'The ideal Piano Trainer'
practice = {k: v for k, v in d['boards'].items() if k not in SONGS.values()}
top = min(v['y'] for v in practice.values())
shift = 4657 - top if top < 4657 else 0
for v in practice.values(): v['y'] += shift
for a, b in SONGS.items():
    practice[b] = dict(songs['boards'][a])
d['boards'] = {**{b: practice[b] for b in SONGS.values()}, **{k: v for k, v in practice.items() if k not in SONGS.values()}}
d['order'] = list(SONGS.values()) + [k for k in d['order'] if k not in SONGS.values()]
d['notes'] = {'songs': {'x': 0, 'y': -300, 'text': 'Songs', 'kind': 'title1', 'maxW': 2673},
              'practice': {'x': 0, 'y': 4657 - 300, 'text': 'Practice', 'kind': 'title1', 'maxW': 2673}}
json.dump(d, open(P + 'canvas.json', 'w'), ensure_ascii=False, indent=2)
links = sum(len(re.findall(r'href="(?!#")[^"]+\.dc\.html"', open(P + f).read())) for f in d['boards'])
print('linked', len(d['boards']), 'boards,', links, 'links')
