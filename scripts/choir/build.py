"""Builds each choir song's made score: `<song folder name> (SATB).mscz` in a mixed choir song's folder, `(TTBB)` in
a men's choir song's.

The song's fullest MuseScore file is read through MuseScore as MusicXML, corrected (the notes, repeats, tempo and
words its match.txt writes in from the printed sheet), split into a part per voice (voices.py), saved by MuseScore,
and composed into one file (compose.py): the main score, each staff named for its voices and played by piano, each
voice in the octave it sings, the house style (template/house.mss), and a part for every voice tied to its voice of
the score. A song with no full score but a one-voice file for every voice gets a two-staff score put together from
those files.

Once a song matches its printed sheet its old MuseScore files are removed: its made score is then final, and a build
only brings its style level with the house's. Songs that cannot be made are listed with the reason.
"""

import copy
import os
import sys
import tempfile
import xml.etree.ElementTree as ET

import compose
import house
import sheet
import spec as specs
import voices
from common import made_name, mscore_job, read_mscz, song_files, songs, voices_of, write_mscz, write_xml


def build(wanted=()):
    work = tempfile.mkdtemp()
    jobs, todo = [], []
    for sub, kind, tag, d, song_dir in songs(wanted):
        final = made_name(song_dir, tag)
        files = [f for f in song_files(song_dir) if f != final]
        if not files and os.path.exists(final):
            restyle(final, specs.read(song_dir))
            todo.append(dict(d=d, sub=sub, why='final: matched to its sheet, its old files cleared; restyled'))
            continue
        if not files:
            todo.append(dict(d=d, sub=sub, why='only a PDF: to be written in by hand'))
            continue
        xmls = []
        for i, f in enumerate(files):
            x = os.path.join(work, f'{len(todo):03d}-{i:02d}.musicxml')
            jobs.append((os.path.abspath(f), x))
            xmls.append((f, x))
        todo.append(dict(d=d, sub=sub, kind=kind, tag=tag, dir=song_dir, xmls=xmls, why=None,
                         spec=specs.read(song_dir)))
    print(f'reading {len(jobs)} files', file=sys.stderr)
    done = set(mscore_job(jobs))

    second = []
    for n, s in enumerate(todo):
        if s['why']:
            continue
        try:
            split(s, done, work, n, second)
        except SystemExit as e:
            s['why'] = f'not made: {e}'
    print(f'saving {len(second)} scores and parts', file=sys.stderr)
    done = set(mscore_job(second))

    for s in todo:
        if s['why']:
            msg = s['why']
        elif s['main'] not in done or any(b not in done for a, b in s['parts']):
            msg = 'not made: MuseScore did not save it'
        else:
            compose.compose(s, made_name(s['dir'], s['tag']), imported='score_xml' not in s or s.get('imported'))
            msg = f"made from {s['from']}"
        print(f"{s['sub']} | {s['d']} | {msg}")


def split(s, done, work, n, second):
    """A song's score corrected and split into its voices; queues the main score and each part for MuseScore."""
    infos = []
    for f, x in s['xmls']:
        if x in done:
            root = ET.parse(x).getroot()
            infos.append((f, root, len(voices.lines_of(root)), any(l.findtext('text') for l in root.iter('lyric'))))
    spec = s['spec']
    entering = bool(spec['notes'])
    # The full score: the fullest file that names no single voice (a song whose voices are written in from the
    # sheet starts from its fullest file, however few voices it has).
    full = [t for t in infos if t[2] >= (1 if entering else 3)]
    full.sort(key=lambda t: (bool([v for v in voices_of(os.path.basename(t[0])) if v != 'All voices']),
                             -t[2], t[0].count(os.sep), len(t[0])))
    lyric_srcs = [root for f, root, lines, lyr in infos if lyr]
    if full:
        score, s['from'] = copy.deepcopy(full[0][1]), os.path.relpath(full[0][0], s['dir'])
    else:
        score, s['from'] = compose.assemble([(f, root, lines) for f, root, lines, lyr in infos], s['kind'])
    corrected = False
    if entering:
        enter_notes(score, s['kind'], spec, lyric_srcs)
        corrected = True
    if spec.get('repeat') or spec.get('tempo'):
        # Repeats and tempo as printed, after any notes are entered (a repeat may split a bar).
        sheet.structure_xml(score, spec)
        corrected = True
    out, info = voices.build(score, s['kind'], lyric_srcs)
    if spec['matched']:
        # The words as printed go under their voices before the split, so every part carries them.
        done_voices = set()
        for block in spec['blocks']:
            p = next(x for x in info if x['name'] == block['voice'])
            sheet.lyrics_xml(score, p['part'], p['staff'], p['voice'], block, spec.get('count_pickup'),
                             clear=block['voice'] not in done_voices)
            done_voices.add(block['voice'])
        out, info = voices.build(score, s['kind'], [])
    s['info'] = info
    s['parts'] = []
    for i in range(len(out.findall('part'))):
        x = os.path.join(work, f'{n:03d}-part{i}.musicxml')
        write_xml(compose.single_part(out, i), x)
        s['parts'].append((x, x[:-9] + '.mscz'))
        second.append(s['parts'][-1])
    if full and not corrected:
        # The main score is the choir's own file, saved again by MuseScore.
        s['main_src'] = os.path.abspath(full[0][0])
        s['score_xml'] = score
    elif full:
        # Corrected: the main score is the corrected full score, read back by MuseScore, each staff's barlines its
        # own, as the choir's sheets draw them.
        x = os.path.join(work, f'{n:03d}-corrected.musicxml')
        for g in score.iter('part-group'):
            for gb in g.findall('group-barline'):
                g.remove(gb)
            if g.get('type') == 'start':
                ET.SubElement(g, 'group-barline').text = 'no'
        write_xml(score, x)
        s['main_src'] = x
        s['score_xml'] = score
        s['imported'] = True
    else:
        x = os.path.join(work, f'{n:03d}-closed.musicxml')
        write_xml(compose.closed(out, s['kind']), x)
        s['main_src'] = x
        s['info'] = compose.closed_info(info)
    s['main'] = os.path.join(work, f'{n:03d}-main.mscz')
    second.append((s['main_src'], s['main']))


def enter_notes(score, kind, spec, lyric_srcs):
    """The notes match.txt enters from the sheet, each voice in its place: on the choir's two staves where the file
    has too few voices to split, else where the split finds the voice (a voice that shared its staff's line takes
    the staff's next voice)."""
    if len(voices.lines_of(score)) < 4:
        places = {b['voice']: sheet.default_place(score, kind, b['voice']) for b in spec['notes']}
    else:
        _, info = voices.build(score, kind, lyric_srcs)
        places = {}
        for block in spec['notes']:
            p = next(x for x in info if x['name'] == block['voice'])
            voice = p['voice']
            if any(x is not p and (x['part'], x['staff'], x['voice']) == (p['part'], p['staff'], voice)
                   for x in info):
                voice = str(int(voice) + 1)
            places[block['voice']] = (p['part'], p['staff'], voice)
    for block in spec['notes']:
        part, staff, voice = places[block['voice']]
        sheet.notes_xml(score, part, staff, voice, block, sheet.has_staves(score, part), spec.get('count_pickup'))


def restyle(mscz, spec):
    """A final score's style and its parts' made the house's, nothing else touched."""
    files = read_mscz(mscz)
    for n in files:
        if n.endswith('.mss'):
            files[n] = house.apply(files[n], spec)
    write_mscz(mscz, files, list(files))
