"""Writes every choir song's score with a part per voice: `<song folder name> (SATB).mscz` in a mixed choir song's
folder, `(TTBB)` in a men's choir song's. Run from the repo root: python3 scripts/choir-scores.py [song folder ...]

Needs MuseScore Studio 4 as `mscore` (on a server, run under xvfb-run). For each song: the full score is picked as
scripts/choir-index.py picks it; with none, a score is put together from the song's one-voice files when there is one
for each of the four voices. Every MuseScore file of the song is read as MusicXML, the full score is split by
scripts/choir-parts.py (the others lend their words), and MuseScore saves the result. Songs it cannot make are listed
with the reason; a song that has only a PDF has to be written in by hand.
"""

import copy
import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = 'piano-data/scores/hymns/choir/musescore'
CHOIRS = [('Cântări corul mixt', 'mixed', 'SATB'), ('Cântări corul bărbătesc', 'men', 'TTBB')]
ORDER = {'mixed': ['Soprano', 'Alto', 'Tenor', 'Bass'], 'men': ['Tenor 1', 'Tenor 2', 'Baritone', 'Bass']}


def load(name):
    spec = importlib.util.spec_from_file_location(name.replace('-', '_'), os.path.join(HERE, name + '.py'))
    mod = importlib.util.module_from_spec(spec)
    sys.argv, argv = [spec.origin], sys.argv
    try:
        spec.loader.exec_module(mod)
    finally:
        sys.argv = argv
    return mod


def mscore_job(pairs):
    """Converts many files in one MuseScore run; returns the outputs that were written."""
    if not pairs:
        return []
    with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False) as f:
        json.dump([{'in': a, 'out': b} for a, b in pairs], f)
    subprocess.run(['mscore', '-j', f.name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=3600)
    os.unlink(f.name)
    # A file MuseScore cannot read ends the whole job: what it left undone is converted one file at a time.
    for a, b in pairs:
        if not (os.path.exists(b) and os.path.getsize(b) > 0):
            subprocess.run(['mscore', a, '-o', b], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=600)
    return [b for a, b in pairs if os.path.exists(b) and os.path.getsize(b) > 0]


def song_files(song_dir):
    out = []
    for dp, dn, fn in os.walk(song_dir):
        dn[:] = [d for d in dn if d != '.mscbackup']
        out += [os.path.join(dp, f) for f in fn if f.endswith(('.mscz', '.mscx'))]
    return sorted(out)


def main():
    idx = load('choir-index')
    parts = load('choir-parts')
    wanted = set(sys.argv[1:])
    work = tempfile.mkdtemp()
    jobs, songs = [], []
    for sub, kind, tag in CHOIRS:
        base = os.path.join(ROOT, sub)
        for d in sorted(os.listdir(base)):
            song_dir = os.path.join(base, d)
            if not os.path.isdir(song_dir) or (wanted and d not in wanted):
                continue
            files = [f for f in song_files(song_dir) if f' ({tag}).mscz' not in f]
            if not files:
                songs.append((d, sub, kind, tag, None, [], 'only a PDF: to be written in by hand'))
                continue
            xmls = []
            for i, f in enumerate(files):
                x = os.path.join(work, f'{len(songs):03d}-{i:02d}.musicxml')
                jobs.append((os.path.abspath(f), x))
                xmls.append((f, x))
            songs.append((d, sub, kind, tag, song_dir, xmls, None))
    print(f'converting {len(jobs)} files', file=sys.stderr)
    done = set(mscore_job(jobs))
    results, outs = [], []
    for d, sub, kind, tag, song_dir, xmls, why in songs:
        if why:
            results.append((sub, d, why))
            continue
        infos = []
        for f, x in xmls:
            if x in done:
                root = ET.parse(x).getroot()
                infos.append((f, x, {'root': root, 'lines': len(parts.lines_of(root)),
                                     'lyr': any(l.findtext('text') for l in root.iter('lyric'))}))
        full = [t for t in infos if t[2]['lines'] >= 3]
        full.sort(key=lambda t: (bool([v for v in idx.voices_of(os.path.basename(t[0])) if v != 'All voices']),
                                 -t[2]['lines'], t[0].count(os.sep), len(t[0])))
        lyric_srcs = [i['root'] for f, x, i in infos if i['lyr']]
        try:
            if full:
                score = copy.deepcopy(full[0][2]['root'])
                note = os.path.relpath(full[0][0], song_dir)
            else:
                score, note = assemble(infos, kind, idx)
            out = parts.build(score, kind, lyric_srcs)
        except SystemExit as e:
            results.append((sub, d, f'not made: {e}'))
            continue
        ET.indent(out)
        x = os.path.join(work, f'out-{len(outs):03d}.musicxml')
        with open(x, 'wb') as fh:
            fh.write(b'<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(out, encoding='utf-8'))
        dst = os.path.abspath(os.path.join(song_dir, f'{d} ({tag}).mscz'))
        if os.path.exists(dst):
            os.remove(dst)
        outs.append((x, dst))
        results.append((sub, d, f'made from {note}'))
    written = set(mscore_job(outs))
    for w in written:
        tidy(w)
    for sub, d, msg in results:
        if msg.startswith('made') and not any(d in w for w in written):
            msg = 'not made: MuseScore did not save it'
        print(f'{sub} | {d} | {msg}')


# Words a whole space apart with their hyphens kept, in place of the tight spacing many of the choir's files carry;
# the tempo and other marks above the top part only (MuseScore repeats them over a second staff of its choosing).
STYLE = {'lyricsMinDistance': '1', 'lyricsDashForce': '1', 'lyricsDashMinLength': '0.4'}


def tidy(mscz):
    import re
    import shutil
    import zipfile
    tmp = mscz + '.tmp'
    with zipfile.ZipFile(mscz) as zin, zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename.endswith('.mscx') and '/' not in item.filename:
                text = data.decode('utf-8')
                text = re.sub(r'\s*<SystemObjects>.*?</SystemObjects>', '', text, flags=re.S)
                text = re.sub(r'\s*<(Tempo|SystemText|RehearsalMark|Jump|Marker)>(?:(?!</\1>).)*?<linkedTo>.*?</\1>', '',
                              text, flags=re.S)
                data = text.encode('utf-8')
            if item.filename == 'score_style.mss':
                text = data.decode('utf-8')
                for k, v in STYLE.items():
                    text, n = re.subn(rf'<{k}>[^<]*</{k}>', f'<{k}>{v}</{k}>', text)
                    if not n:
                        text = text.replace('</Style>', f'  <{k}>{v}</{k}>\n    </Style>')
                data = text.encode('utf-8')
            zout.writestr(item, data)
    shutil.move(tmp, mscz)


def assemble(infos, kind, idx):
    """A full score from one-voice files: each voice's file gives the staff holding its notes."""
    by_voice = {}
    for f, x, i in infos:
        vs = [v for v in idx.voices_of(os.path.basename(f)) if v != 'All voices']
        name = {'Baritone': 'Baritone', 'Tenor': 'Tenor'}.get(vs[0], vs[0]) if len(vs) == 1 else None
        if name and i['lines'] == 1 and name not in by_voice:
            by_voice[name] = i['root']
    want = ORDER[kind]
    if kind == 'men' and 'Tenor' in by_voice and 'Tenor 1' not in by_voice:
        by_voice['Tenor 1'] = by_voice.pop('Tenor')
    missing = [v for v in want if v not in by_voice]
    if missing:
        raise SystemExit('no full score, and no one-voice file for ' + ', '.join(missing))
    score = None
    for n, v in enumerate(want):
        src = copy.deepcopy(by_voice[v])
        sounding = [p for p in src.findall('part') if any(x.find('rest') is None for x in p.iter('note'))]
        part = sounding[0]
        staves = {x.findtext('staff') or '1' for x in part.iter('note') if x.find('rest') is None}
        if len(staves) == 1 and part.find('.//attributes/staves') is not None:
            keep = staves.pop()
            for m in part.findall('measure'):
                for el in list(m):
                    if el.tag == 'note' and (el.findtext('staff') or '1') != keep:
                        m.remove(el)
                    elif el.tag in ('backup', 'forward'):
                        m.remove(el)
        part.set('id', f'A{n + 1}')
        if score is None:
            score = src
            for p in score.findall('part'):
                score.remove(p)
        score.append(part)
    lens = {len(p.findall('measure')) for p in score.findall('part')}
    if len(lens) != 1:
        raise SystemExit('the one-voice files differ in length: ' + ', '.join(map(str, sorted(lens))))
    return score, 'the one-voice files'


if __name__ == '__main__':
    main()
