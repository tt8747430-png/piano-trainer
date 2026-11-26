"""Writes piano-data/scores/hymns/choir/musescore/INDEX.md: every choir song, its files and the state of its full
MuseScore score. Run from the repo root: python3 scripts/choir-index.py (needs pdftotext for the contents list)."""
import os, re, sys, zipfile, unicodedata, collections, subprocess
import xml.etree.ElementTree as ET
root = 'piano-data/scores/hymns/choir/musescore'
out = os.path.join(root, 'INDEX.md')
def plain(s): return ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn')
VOICES = [('Soprano', r'sopran'), ('Alto', r'\balt'), ('Tenor 1', r'tenor ?_?1'), ('Tenor 2', r'tenor ?_?2'),
          ('Tenor', r'tenor(?! ?_?[12])'), ('Baritone', r'bariton'), ('Bass', r'\bbas\b|\bbass\b|\bbasul\b'),
          ('All voices', r'toate vocile|all voices|toate')]
def voices_of(name):
    p = plain(name); return [v for v, rx in VOICES if re.search(rx, p)]
def inspect(path):
    try:
        z = zipfile.ZipFile(path); names = z.namelist()
        r = ET.fromstring(z.read([x for x in names if x.endswith('.mscx') and 'Excerpts/' not in x][0]))
    except Exception:
        return None
    main = r.find('Score')
    if main is None: return None
    st = [s for s in main.findall('Staff') if s.find('Measure') is not None]
    def voices(m): return m.findall('voice') or [m]  # MuseScore 2 keeps a bar's notes in the bar itself
    def nv(m): return sum(1 for v in voices(m) if v.find('Chord') is not None)
    vmax = [max([nv(m) for m in s.findall('Measure')] or [0]) for s in st]
    lines = sum(len({i for m in s.findall('Measure') for i, v in enumerate(voices(m)) if v.find('Chord') is not None}) for s in st)
    bars = max([len(s.findall('Measure')) for s in st] or [0])
    chords = sum(1 for s in st for c in s.iter('Chord') if len(c.findall('Note')) > 1)
    lyr = sum(1 for s in st for _ in s.iter('Lyrics'))
    ex = [re.sub(r'^\d+_', '', x.split('/')[-1][:-5]).replace('_', ' ') for x in names if 'Excerpts/' in x and x.endswith('.mscx')]
    for e in main.findall('Score'):
        nm = next((t.text for t in e.findall('metaTag') if t.get('name') == 'partName' and t.text), None)
        nm = nm or next((pp.findtext('trackName') for pp in e.findall('Part')), None)
        if nm: ex.append(nm)
    progs = {pp.get('value') for pp in main.iter('program')}
    return dict(ver=r.get('version'), staves=len(st), vmax=vmax, bars=bars, chords=chords, lyr=lyr, ex=sorted(ex), lines=lines, path=path, piano=progs <= {'0'})
def made_words(path):
    """Whether the corrected score has words, in its main score or its parts."""
    with zipfile.ZipFile(path) as z:
        return dict(words=any(b'<Lyrics>' in z.read(n) for n in z.namelist() if n.endswith('.mscx')))


def song_rows(base):
    rows = []
    for d in sorted(os.listdir(base)):
        p = os.path.join(base, d)
        if not os.path.isdir(p): continue
        m = re.match(r'(\d+)\.?\s*(.*)', d)
        nr, title = (int(m.group(1)), m.group(2)) if m else (None, d)
        files = []
        for dp, dn, fn in os.walk(p):
            dn[:] = [x for x in dn if x != '.mscbackup']
            files += [os.path.join(dp, f) for f in fn if not f.endswith('~') and not f.endswith('.mscz,')]
        kinds = collections.Counter()
        for f in files:
            e = f.rsplit('.', 1)[-1].lower()
            kinds[{'mscz': 'mscz', 'mscx': 'mscz', 'pdf': 'pdf', 'mxl': 'xml', 'xml': 'xml', 'musicxml': 'xml',
                   'jpg': 'img', 'jpeg': 'img', 'png': 'img', 'sib': 'other', 'xlsx': 'other'}.get(e, 'other')] += 1
        made = [f for f in files if re.search(r' \((SATB|TTBB)\)\.mscz$', f)]
        files = [f for f in files if f not in made]
        msc = [f for f in files if f.endswith(('.mscz', '.mscx'))]
        voice_files = sorted({v for f in msc for v in voices_of(os.path.basename(f))},
                             key=[v for v, _ in VOICES].index)
        variants = sorted({os.path.relpath(os.path.dirname(f), p) for f in files} - {'.'})
        infos = [i for i in (inspect(f) for f in msc) if i]
        fulls = [i for i in infos if i['lines'] + (1 if i['chords'] else 0) >= 3]
        fulls.sort(key=lambda i: (-(len([e for e in i['ex'] if len(voices_of(e)) == 1]) >= 4), bool([v for v in voices_of(os.path.basename(i['path'])) if v != 'All voices']), -i['lines'], i['path'].count(os.sep), len(i['path'])))
        main = fulls[0] if fulls else None
        full = fulls
        rows.append(dict(matched=os.path.exists(os.path.join(p, 'match.txt')),
                         made=made_words(made[0]) if made else None, nr=nr, title=title, kinds=kinds, nfull=len(full), main=main, mainf=main['path'] if main else None,
                         voices=voice_files, sub=[v for v in variants if v not in ('.',)], dir=d))
    return rows
def status(r, men):
    if r.get('matched') and r.get('made'):
        return 'Done: as printed (matched to its PDF)'
    if r.get('made'):
        return 'Done: a part per voice' + ('' if r['made']['words'] else ' (no words in any of its files)')
    m = r['main']
    if not m: return 'Single voices only, no full score' if r['kinds']['mscz'] else 'No MuseScore'
    want = 4
    single = [e for e in m['ex'] if len(voices_of(e)) == 1 and voices_of(e) != ['All voices']]
    if len(single) >= want: return 'Done: a part per voice'
    if 0 in m['vmax']: return 'To do: unfinished, a staff has no notes'
    if m['lines'] > 4: return f"To check: {m['lines']} voices (a voice divides), not four"
    if m['chords']: return 'To do: voices written as chords'
    if m['staves'] >= 4: return 'To do: add parts (one voice per staff)'
    if m['lines'] >= 4: return 'To do: split two voices per staff'
    return 'To check: three voices'
def shape(m):
    if not m: return '–'
    v = '/'.join(str(x) for x in m['vmax'])
    s = f"{m['staves']} staves, voices {v}, {m['bars']} bars, `{os.path.basename(m['path'])}`"
    if m['chords']: s += f", {m['chords']} chords"
    return s
def main():
    cuprins = subprocess.run(['pdftotext', '-layout', os.path.join(root, 'Cântări corul mixt', 'Cuprins 1-100.pdf'), '-'],
                             capture_output=True, text=True, check=True).stdout.splitlines()
    L = []
    L.append('# The choir\'s songs: what each one has\n')
    L.append('Every song in this folder, with the files it has and the state of its full MuseScore score. The goal for each ')
    L.append('song is one MuseScore file with a separate part for each voice (Soprano, Alto, Tenor, Bass; for the men\'s choir ')
    L.append('Tenor 1, Tenor 2, Baritone, Bass), the words under every part, and piano as its sound. Written by ')
    L.append('`scripts/choir-index.py` from the files; run it again after a change.\n')
    L.append('That file is `<song> (SATB).mscz` in a mixed choir song\'s folder and `<song> (TTBB).mscz` in a men\'s, made by ')
    L.append('`scripts/choir-scores.py`. It looks as the choir\'s own full score does (its staves, layout and words, saved ')
    L.append('by MuseScore Studio 4) and is corrected inside: each staff named for the voices it holds, every instrument ')
    L.append('playing piano, each voice in the octave it sings (many files write the men an octave high; a plain treble ')
    L.append('staff of men takes the tenor clef, so the page looks the same), and a part for every voice saved in the file, ')
    L.append('tied to its voice of the score, with the words under it. A song with no full score but a one-voice file for ')
    L.append('every voice gets a two-staff score put together from those files. A song with only a PDF, a full score left ')
    L.append('unfinished, or no file for some voice is still to be written in by hand.\n')
    L.append('Columns: **Score** the full MuseScore score (how many); **Shape** its staves, voices per staff and bars, and ')
    L.append('"chords" where two voices are written as one chord; **Words** lyrics in the score; **Parts** separate voice parts ')
    L.append('saved in it; **Voice files** separate MuseScore files per voice; **PDF**, **XML** (MusicXML), **Img** counts; ')
    L.append('**Sound** piano when every instrument plays piano.\n')
    summary = []
    for label, sub, men in (('Mixed choir', 'Cântări corul mixt', False), ("Men's choir", 'Cântări corul bărbătesc', True)):
        rows = song_rows(os.path.join(root, sub))
        if not men:
            titles = {}
            for line in cuprins:
                for t, n in re.findall(r'(\S[^\d]*?)\s+(\d{1,3})(?=\s{2,}|\s*$)', line): titles[int(n)] = t.strip()
            titles[28] = 'Deșteptare, strigă glasul Domnului'
            have = {r['nr'] for r in rows}
            for n, t in titles.items():
                if n not in have: rows.append(dict(nr=n, title=t, kinds=collections.Counter(), nfull=0, main=None, mainf=None, voices=[], sub=[], dir=None))
            rows.sort(key=lambda r: (r['nr'] is None, r['nr'] or 0))
        st = collections.Counter()
        L.append(f'\n## {label} (`{sub}/`)\n')
        L.append('| Nr | Song | State | Score | Shape | Words | Parts | Voice files | PDF | XML | Img | Sound |')
        L.append('| --: | --- | --- | :-: | --- | :-: | --- | --- | --: | --: | --: | --- |')
        for r in rows:
            s = 'No folder (in the book only)' if r['dir'] is None else status(r, men)
            st[s.split(':')[0] if s.startswith(('Done', 'To do', 'To check')) else s] += 1
            m = r['main']
            title = r['title'] + (f" ({len(r['sub'])} subfolders)" if r['sub'] else '')
            L.append(f"| {r['nr'] if r['nr'] is not None else ''} | {title} | {s} | {r['nfull'] or '–'} | {shape(m)} | "
                     f"{'yes' if m and m['lyr'] else ('no' if m else '–')} | {', '.join(m['ex']) if m and m['ex'] else '–'} | "
                     f"{', '.join(r['voices']) or '–'} | {r['kinds']['pdf'] or ''} | {r['kinds']['xml'] or ''} | {r['kinds']['img'] or ''} | "
                     f"{('piano' if m['piano'] else 'other') if m else '–'} |")
        summary.append((label, len(rows), st))
    head = ['\n## Summary\n', '| Choir | Songs | ' + ' | '.join(['Done', 'To do', 'To check', 'Single voices only, no full score', 'No MuseScore', 'No folder (in the book only)', 'Unreadable']) + ' |',
            '| --- | --: |' + ' --: |' * 7]
    for label, n, st in summary:
        head.append(f"| {label} | {n} | " + ' | '.join(str(st.get(k, 0)) for k in ['Done', 'To do', 'To check', 'Single voices only, no full score', 'No MuseScore', 'No folder (in the book only)', 'Unreadable']) + ' |')
    at = next(i for i, l in enumerate(L) if l.startswith('**Sound**')) + 1
    L = L[:at] + head + L[at:]
    open(out, 'w', encoding='utf-8').write('\n'.join(L) + '\n')
    print('\n'.join(head))

if __name__ == '__main__':
    main()
