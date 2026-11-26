"""Writes every choir song's corrected score: `<song folder name> (SATB).mscz` in a mixed choir song's folder,
`(TTBB)` in a men's choir song's. Run from the repo root: python3 scripts/choir-scores.py [song folder ...]

The score looks as the choir's own full score does (its staves, layout, words), saved by MuseScore Studio 4, and is
corrected inside: each staff named for the voices it holds ("Soprano, Alto"), played by piano, each voice in the
octave it sings (a voice of men on a plain treble staff takes the tenor clef, so the page looks the same), and a part
for every voice (Soprano, Alto, Tenor, Bass; Tenor 1, Tenor 2, Baritone, Bass) saved in the file, each tied to its
voice of the score, with the words under it. A song with no full score but a one-voice file for every voice gets a
two-staff score put together from those files.

Needs MuseScore Studio 4 as `mscore` (on a server, under xvfb-run). The voices are split by scripts/choir-parts.py;
songs it cannot make are listed with the reason.
"""

import copy
import importlib.util
import json
import os
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = 'piano-data/scores/hymns/choir/musescore'
CHOIRS = [('Cântări corul mixt', 'mixed', 'SATB'), ('Cântări corul bărbătesc', 'men', 'TTBB')]
ORDER = {'mixed': ['Soprano', 'Alto', 'Tenor', 'Bass'], 'men': ['Tenor 1', 'Tenor 2', 'Baritone', 'Bass']}
SHORT = {'Soprano': 'S.', 'Alto': 'A.', 'Tenor': 'T.', 'Bass': 'B.', 'Tenor 1': 'T. 1', 'Tenor 2': 'T. 2',
         'Baritone': 'Bar.'}
# A part's words a whole space apart with their hyphens kept (many of the choir's files space them tightly).
PART_STYLE = {'lyricsMinDistance': '1', 'lyricsDashForce': '1', 'lyricsDashMinLength': '0.4'}


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


def write_xml(root, path):
    ET.indent(root)
    with open(path, 'wb') as fh:
        fh.write(b'<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(root, encoding='utf-8'))


def main():
    idx = load('choir-index')
    parts = load('choir-parts')
    match = load('choir-match')
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
                songs.append(dict(d=d, sub=sub, why='only a PDF: to be written in by hand'))
                continue
            xmls = []
            for i, f in enumerate(files):
                x = os.path.join(work, f'{len(songs):03d}-{i:02d}.musicxml')
                jobs.append((os.path.abspath(f), x))
                xmls.append((f, x))
            songs.append(dict(d=d, sub=sub, kind=kind, tag=tag, dir=song_dir, xmls=xmls, why=None))
    print(f'reading {len(jobs)} files', file=sys.stderr)
    done = set(mscore_job(jobs))

    # Split each song's voices. The main score is the full score itself, saved again by MuseScore; a song with only
    # one-voice files gets a two-staff score put together from its parts.
    second = []
    for n, s in enumerate(songs):
        if s['why']:
            continue
        infos = []
        for f, x in s['xmls']:
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
                score, s['from'] = copy.deepcopy(full[0][2]['root']), os.path.relpath(full[0][0], s['dir'])
            else:
                score, s['from'] = assemble(infos, s['kind'], idx)
            out, info = parts.build(score, s['kind'], lyric_srcs)
            spec_path = os.path.join(s['dir'], 'match.txt')
            s['spec'] = match.parse(spec_path) if os.path.exists(spec_path) else None
            if s['spec'] and s['spec']['notes']:
                # Notes entered from the sheet (a voice the file left out) go in first; a voice that shared its
                # staff's line takes the staff's next voice.
                for block in s['spec']['notes']:
                    p = next(x for x in info if x['name'] == block['voice'])
                    voice = p['voice']
                    if any(x is not p and (x['part'], x['staff'], x['voice']) == (p['part'], p['staff'], voice)
                           for x in info):
                        voice = str(int(voice) + 1)
                    multi = max([int(x.text) for x in score.findall('part')[p['part']].iter('staves')] or [1]) > 1
                    match.notes_xml(score, p['part'], p['staff'], voice, block, multi,
                                    s['spec'].get('count_pickup'))
                out, info = parts.build(score, s['kind'], lyric_srcs)
                s['corrected'] = True
            if s['spec'] and (s['spec'].get('repeat') or s['spec'].get('tempo')):
                # Repeats and tempo as printed, after any notes are entered (a repeat may split a bar).
                match.structure_xml(score, s['spec'])
                s['corrected'] = True
            if s['spec']:
                # The words as printed go under their voices before the split, so every part carries them.
                done_voices = set()
                for block in s['spec']['blocks']:
                    p = next(x for x in info if x['name'] == block['voice'])
                    match.lyrics_xml(score, p['part'], p['staff'], p['voice'], block, s['spec'].get('count_pickup'),
                                     clear=block['voice'] not in done_voices)
                    done_voices.add(block['voice'])
                out, info = parts.build(score, s['kind'], [])
        except SystemExit as e:
            s['why'] = f'not made: {e}'
            continue
        s['info'] = info
        s['parts'] = []
        for i in range(len(out.findall('part'))):
            x = os.path.join(work, f'{n:03d}-part{i}.musicxml')
            write_xml(single_part(out, i), x)
            s['parts'].append((x, x[:-9] + '.mscz'))
            second.append(s['parts'][-1])
        if full and not s.get('corrected'):
            s['main_src'] = os.path.abspath(full[0][0])
            s['score_xml'] = score
        elif full:
            # Notes were entered: the main score is the corrected full score, read back by MuseScore.
            x = os.path.join(work, f'{n:03d}-corrected.musicxml')
            # Each staff's barlines its own, as the choir's sheets draw them.
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
            write_xml(closed(out, s['kind']), x)
            s['main_src'] = x
            s['info'] = closed_info(info)
        s['main'] = os.path.join(work, f'{n:03d}-main.mscz')
        second.append((s['main_src'], s['main']))
    print(f'saving {len(second)} scores and parts', file=sys.stderr)
    done = set(mscore_job(second))

    results = []
    for s in songs:
        if s['why']:
            results.append((s['sub'], s['d'], s['why']))
            continue
        if s['main'] not in done or any(b not in done for a, b in s['parts']):
            results.append((s['sub'], s['d'], 'not made: MuseScore did not save it'))
            continue
        dst = os.path.join(s['dir'], f"{s['d']} ({s['tag']}).mscz")
        compose(s, dst, imported='score_xml' not in s or s.get('imported'))
        results.append((s['sub'], s['d'], f"made from {s['from']}"))
    for sub, d, msg in results:
        print(f'{sub} | {d} | {msg}')


def single_part(out, i):
    """The split score with only its i-th part: what MuseScore saves as that voice's part."""
    one = copy.deepcopy(out)
    plist = one.find('part-list')
    keep = f'P{i + 1}'
    for el in list(plist):
        if el.tag != 'score-part' or el.get('id') != keep:
            plist.remove(el)
    for p in one.findall('part'):
        if p.get('id') != keep:
            one.remove(p)
    return one


def closed(out, kind):
    """Two staves from the four parts, as a choir's score is printed: the upper voice of each pair on voice 1, the
    lower on voice 2, the words under the upper."""
    sc = copy.deepcopy(out)
    plist = sc.find('part-list')
    ps = sc.findall('part')
    names = ORDER[kind]
    for el in list(plist):
        if el.tag == 'score-part' and el.get('id') in ('P2', 'P4'):
            plist.remove(el)
    for pid, pair in (('P1', names[:2]), ('P3', names[2:])):
        sp = [e for e in plist.findall('score-part') if e.get('id') == pid][0]
        sp.find('part-name').text = ', '.join(pair)
        sp.find('part-abbreviation').text = ' '.join(SHORT[v] for v in pair)
    for up, low in ((ps[0], ps[1]), (ps[2], ps[3])):
        for mu, ml in zip(up.findall('measure'), low.findall('measure')):
            length = sum(int(n.findtext('duration') or 0) for n in mu
                         if n.tag in ('note', 'forward') and n.find('chord') is None)
            bk = ET.SubElement(mu, 'backup')
            ET.SubElement(bk, 'duration').text = str(length)
            for el in ml:
                if el.tag in ('note', 'forward'):
                    el = copy.deepcopy(el)
                    if el.tag == 'note':
                        el.find('voice').text = '2'
                        for l in el.findall('lyric'):
                            el.remove(l)
                    mu.append(el)
        sc.remove(low)
    return sc


def closed_info(info):
    """Where each part's voice sits in the put-together score: two staves, upper voice 1, lower voice 2."""
    out = []
    for i, p in enumerate(info):
        q = dict(p)
        q.update(part=i // 2, staff='1', voice=str(i % 2 + 1), shift=0, clef=('G', 0))
        out.append(q)
    return out


def staff_index(score_xml, part, staff):
    """A MusicXML (part, staff) as MuseScore's staff number, counting from 0 through the parts in order."""
    n = 0
    for pi, p in enumerate(score_xml.findall('part')):
        count = max([int(s.text) for s in p.iter('staves')] or [1])
        if pi == part:
            return n + int(staff) - 1
        n += count
    raise ValueError(part)


def read_mscz(path):
    with zipfile.ZipFile(path) as z:
        return {n: z.read(n) for n in z.namelist()}


def main_name(files):
    return next(n for n in files if n.endswith('.mscx') and '/' not in n)


def compose(s, dst, imported):
    """The song's file: its main score corrected, and a part per voice tied to its voice of the score."""
    files = {n: v for n, v in read_mscz(s['main']).items() if not n.startswith('Excerpts/')}
    mname = main_name(files)
    root = ET.fromstring(files[mname])
    score = root.find('Score')
    for el in score.findall('Score'):
        score.remove(el)
    staffs = score.findall('Staff')
    info = s['info']
    sx = s.get('score_xml')
    by_staff = {}
    for p in info:
        p['mstaff'] = staff_index(sx, p['part'], p['staff']) if sx is not None else p['part']
        by_staff.setdefault(p['mstaff'], []).append(p)

    # Octaves, staff by staff; a plain treble staff moved down for men's voices takes the tenor clef, so the notes
    # stay where the page has them.
    for k, ps in by_staff.items():
        shift = ps[0]['shift']
        if not shift:
            continue
        for note in staffs[k].iter('Note'):
            note.find('pitch').text = str(int(note.findtext('pitch')) + 12 * shift)
        for c in staffs[k].iter('Clef'):
            for tag in ('concertClefType', 'transposingClefType'):
                el = c.find(tag)
                if el is not None:
                    el.text = moved_clef(el.text, shift)
        # The staff's own clef, set on its definition (or by its instrument) where the bars carry none.
        sdef, ins_clef = staff_def(score, k)
        cur = sdef.findtext('defaultClef') or ins_clef
        new = moved_clef(cur, shift)
        if new != cur:
            set_text(sdef, 'defaultClef', new)

    # Each staff's instrument named for the voices it holds; every instrument played by piano.
    k = 0
    for mp in score.findall('Part'):
        n_staves = len(mp.findall('Staff'))
        voices = [p['name'] for st in range(k, k + n_staves) for p in by_staff.get(st, [])]
        k += n_staves
        label = ', '.join(dict.fromkeys(voices))
        if label:
            set_text(mp, 'trackName', label)
        for ins in mp.findall('Instrument'):
            ins.set('id', 'piano')
            if label:
                set_text(ins, 'trackName', label)
            set_text(ins, 'instrumentId', 'keyboard.piano')
            for pr in ins.iter('program'):
                pr.set('value', '0')
    spec = s.get('spec')
    if spec:
        match = load('choir-match')
        match.mark_split(score, spec)
        done_voices = set()
        for block in spec['blocks']:
            p = next(x for x in info if x['name'] == block['voice'])
            match.lyrics_mscx(staffs[p['mstaff']], (int(p['voice']) - 1) % 4, block,
                              match.bar_numbers(staffs[0].findall('Measure'), spec.get('count_pickup')),
                              clear=block['voice'] not in done_voices)
            done_voices.add(block['voice'])
        for name in spec.get('italic', []):
            p = next(x for x in info if x['name'] == name.strip())
            match.italicize(staffs[p['mstaff']], (int(p['voice']) - 1) % 4)
        match.layout_mscx(score, spec)
        files['score_style.mss'] = match.style_mss(files['score_style.mss'], spec)
    files[mname] = b'<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(root, encoding='utf-8')
    if imported:
        files[mname] = drop_repeated_marks(files[mname])
        files['score_style.mss'] = style(files['score_style.mss'])

    # A part per voice, tied to its staff and voice of the main score.
    extra = []
    for i, (p, (x, part_mscz)) in enumerate(zip(info, s['parts'])):
        pf = read_mscz(part_mscz)
        proot = ET.fromstring(pf[main_name(pf)])
        pscore = proot.find('Score')
        pos = list(pscore).index(pscore.find('eid')) + 1 if pscore.find('eid') is not None else 0
        name_el = ET.Element('name')
        name_el.text = p['name']
        pscore.insert(pos, name_el)
        track = p['mstaff'] * 4 + (int(p['voice']) - 1) % 4
        pscore.insert(pos + 1, ET.Element('Tracklist', sTrack=str(track), dstTrack='0'))
        base = f"{i}_{p['name'].replace(' ', '_')}"
        files[f'Excerpts/{base}/{base}.mscx'] = drop_repeated_marks(
            b'<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(proot, encoding='utf-8'))
        files[f'Excerpts/{base}/{base}.mss'] = style(pf['score_style.mss'])
        extra += [f'Excerpts/{base}/{base}.mss', f'Excerpts/{base}/{base}.mscx']

    # The container lists the main score, then each part.
    out_name = os.path.basename(dst)[:-5] + '.mscx'
    files[out_name] = files.pop(mname)
    order = ['score_style.mss', out_name] + extra + [n for n in files if n.startswith('Thumbnails/')] + \
        [n for n in ('automation.json', 'audiosettings.json', 'viewsettings.json') if n in files]
    cont = ['<?xml version="1.0" encoding="UTF-8"?>', '<container>', '  <rootfiles>'] + \
        [f'    <rootfile full-path="{n}"/>' for n in order] + ['    </rootfiles>', '  </container>', '']
    files['META-INF/container.xml'] = '\n'.join(cont).encode('utf-8')
    if os.path.exists(dst):
        os.remove(dst)
    with zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as z:
        for n in order + ['META-INF/container.xml']:
            z.writestr(n, files[n])


def moved_clef(clef, shift):
    """The clef that keeps a staff's notes where the page has them once its voices move an octave down."""
    return {('G', -1): 'G8vb', ('F8va', -1): 'F', ('G8va', -1): 'G', ('F15ma', -1): 'F8va'}.get((clef, shift), clef)


def staff_def(score, k):
    """The k-th staff's definition in its instrument's Part, and the clef its instrument gives it."""
    n = 0
    for mp in score.findall('Part'):
        defs = mp.findall('Staff')
        if k < n + len(defs):
            local = k - n
            ins = mp.find('Instrument')
            clef = 'G'
            if ins is not None:
                for c in ins.findall('clef'):
                    if int(c.get('staff') or 1) == local + 1:
                        clef = c.text
            return defs[local], clef
        n += len(defs)
    raise ValueError(k)


def set_text(parent, tag, text):
    el = parent.find(tag)
    if el is None:
        el = ET.SubElement(parent, tag)
    el.text = text


def drop_repeated_marks(data):
    """The tempo and other marks above the top staff only (MuseScore repeats them over a staff of its choosing when it
    reads MusicXML)."""
    text = data.decode('utf-8')
    text = re.sub(r'\s*<SystemObjects>.*?</SystemObjects>', '', text, flags=re.S)
    text = re.sub(r'\s*<(Tempo|SystemText|RehearsalMark|Jump|Marker)>(?:(?!</\1>).)*?<linkedTo>.*?</\1>', '', text,
                  flags=re.S)
    return text.encode('utf-8')


def style(data):
    text = data.decode('utf-8')
    for k, v in PART_STYLE.items():
        text, n = re.subn(rf'<{k}>[^<]*</{k}>', f'<{k}>{v}</{k}>', text)
        if not n:
            text = text.replace('</Style>', f'  <{k}>{v}</{k}>\n    </Style>')
    return text.encode('utf-8')


def assemble(infos, kind, idx):
    """A full score from one-voice files: each voice's file gives the staff holding its notes."""
    by_voice = {}
    for f, x, i in infos:
        vs = [v for v in idx.voices_of(os.path.basename(f)) if v != 'All voices']
        name = vs[0] if len(vs) == 1 else None
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
        part = [p for p in src.findall('part') if any(x.find('rest') is None for x in p.iter('note'))][0]
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
