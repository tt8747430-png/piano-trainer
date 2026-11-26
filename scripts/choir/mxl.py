"""A song's MusicXML 4.0 file (`<song> (SATB).mxl`): the open score, a part per voice, for Dorico, MuseScore and any
application that reads MusicXML.

Each voice is its own part (Soprano, Alto, Tenor, Bass; Tenor 1, Tenor 2, Baritone, Bass), declared as that voice,
with its notes, words and marks as the made score's part has them, under the made score's title, credits and page.
Dorico imports a player per voice, each with its own part, and condenses them to the closed score as printed (Soprano
and Alto on one staff, Tenor and Bass on the other) with condensing on in the full score's layout; MuseScore and
others show the four staves. The made `.mscz` stays the closed score as printed.
"""

import os
import tempfile
import xml.etree.ElementTree as ET
import zipfile

from common import ORDER, SHORT, made_name, mscore_job, read_mscz, songs, xml_bytes

MEDIA = 'application/vnd.recordare.musicxml+xml'


def held_lines(root):
    """Each held syllable's line ends on the last note it holds (MusicXML 4.0's extend start and stop), not at the
    next syllable: the notes tied on from its note, or under the slur that starts on it."""
    for part in root.findall('part'):
        by_voice = {}
        for m in part.findall('measure'):
            for n in m.findall('note'):
                if n.find('chord') is None and n.find('grace') is None:
                    by_voice.setdefault(n.findtext('voice') or '1', []).append(n)
        # a lyric with no syllable only marks a held note: cleared, the line's end written anew below
        for notes in by_voice.values():
            for n in notes:
                for ly in n.findall('lyric'):
                    if ly.find('text') is None:
                        n.remove(ly)
        for notes in by_voice.values():
            for i, n in enumerate(notes):
                for ly in n.findall('lyric'):
                    ext = ly.find('extend')
                    if ext is None or ly.find('text') is None:
                        continue
                    slurs = {sl.get('number', '1') for sl in n.iterfind('notations/slur') if sl.get('type') == 'start'}
                    tied = n.find("tie[@type='start']") is not None
                    last = None
                    for nxt in notes[i + 1:]:
                        if nxt.find('rest') is not None:
                            break
                        if any((l.get('number') or '1') == (ly.get('number') or '1') for l in nxt.findall('lyric')):
                            break
                        stops = {sl.get('number', '1') for sl in nxt.iterfind('notations/slur') if sl.get('type') == 'stop'}
                        if tied or slurs:
                            last = nxt
                            tied = nxt.find("tie[@type='start']") is not None
                            slurs -= stops
                            continue
                        break
                    if last is None:
                        ly.remove(ext)
                        continue
                    ext.set('type', 'start')
                    stop = ET.Element('lyric', number=ly.get('number') or '1')
                    ET.SubElement(stop, 'extend', type='stop')
                    tags = [c.tag for c in last]
                    at = max([i for i, t in enumerate(tags) if t in ('notations', 'lyric')], default=len(tags) - 1) + 1
                    last.insert(at, stop)


def house_page(root):
    """The house's words in its fonts (Arial, the words 11 pt), as the made score prints them."""
    d = root.find('defaults')
    if d is None:
        return
    for tag in ('music-font', 'word-font', 'lyric-font', 'lyric-language'):
        for el in d.findall(tag):
            d.remove(el)
    ET.SubElement(d, 'word-font', {'font-family': 'Arial', 'font-size': '10'})
    ET.SubElement(d, 'lyric-font', {'font-family': 'Arial', 'font-size': '11'})


SOUNDS = {'Soprano': 'voice.soprano', 'Alto': 'voice.alto', 'Tenor': 'voice.tenor', 'Tenor 1': 'voice.tenor',
          'Tenor 2': 'voice.tenor', 'Baritone': 'voice.baritone', 'Bass': 'voice.bass'}


def open_score(closed, voices, parts):
    """The open score: a part per voice (its staff, notes, words and marks as the made score's part), bracketed, each
    staff with its own barlines, under the made score's title, credits and page."""
    out = ET.Element('score-partwise', version='4.0')
    for tag in ('work', 'movement-number', 'movement-title', 'identification', 'defaults', 'credit'):
        for el in closed.findall(tag):
            out.append(el)
    plist = ET.SubElement(out, 'part-list')
    group = ET.SubElement(plist, 'part-group', type='start', number='1')
    ET.SubElement(group, 'group-symbol').text = 'bracket'
    ET.SubElement(group, 'group-barline').text = 'no'
    for k, v in enumerate(voices):
        pid = f'P{k + 1}'
        sp = ET.SubElement(plist, 'score-part', id=pid)
        ET.SubElement(sp, 'part-name').text = v
        ET.SubElement(sp, 'part-abbreviation').text = SHORT[v]
        si = ET.SubElement(sp, 'score-instrument', id=f'{pid}-I1')
        ET.SubElement(si, 'instrument-name').text = v
        ET.SubElement(si, 'instrument-sound').text = SOUNDS[v]
        mi = ET.SubElement(sp, 'midi-instrument', id=f'{pid}-I1')
        ET.SubElement(mi, 'midi-channel').text = str(k + 1)
        ET.SubElement(mi, 'midi-program').text = '1'
    ET.SubElement(plist, 'part-group', type='stop', number='1')
    for k, v in enumerate(voices):
        part = parts[v]
        part.set('id', f'P{k + 1}')
        out.append(part)
    return out


def as_score(files, excerpt):
    """A made file's part as a MuseScore file of its own, for MuseScore to export."""
    mscx = files[excerpt]
    mss = files[excerpt[:-5] + '.mss']
    root = ET.fromstring(mscx)
    sc = root.find('Score')
    for tag in ('Tracklist', 'initialPartId', 'name'):
        for el in sc.findall(tag):
            sc.remove(el)
    out = {'score_style.mss': mss, 'part.mscx': xml_bytes(root)}
    out['META-INF/container.xml'] = (b'<?xml version="1.0" encoding="UTF-8"?>\n<container><rootfiles>'
                                     b'<rootfile full-path="score_style.mss"/><rootfile full-path="part.mscx"/>'
                                     b'</rootfiles></container>\n')
    return out


def write(song_dir, kind, tag, work):
    made = made_name(song_dir, tag)
    files = read_mscz(made)
    excerpts = sorted(n for n in files if n.startswith('Excerpts/') and n.endswith('.mscx'))
    jobs = [(os.path.abspath(made), os.path.join(work, 'score.musicxml'))]
    voices = []
    for n in excerpts:
        name = ET.fromstring(files[n]).find('Score').findtext('name') or n.split('/')[1].split('_', 1)[1]
        src = os.path.join(work, f'{name}.mscz')
        with zipfile.ZipFile(src, 'w', zipfile.ZIP_DEFLATED) as z:
            for k, v in as_score(files, n).items():
                z.writestr(k, v)
        jobs.append((src, os.path.join(work, f'{name}.musicxml')))
        voices.append(name)
    done = set(mscore_job(jobs))
    if any(b not in done for a, b in jobs):
        raise SystemExit(f'MuseScore did not export {os.path.basename(made)}')
    closed = ET.parse(jobs[0][1]).getroot()
    parts = {v: ET.parse(os.path.join(work, f'{v}.musicxml')).getroot().find('part') for v in voices}
    score = open_score(closed, [v for v in ORDER[kind] if v in parts], parts)
    held_lines(score)
    house_page(score)
    members = {'score.musicxml': score}
    dst = made[:-5] + '.mxl'
    container = ['<?xml version="1.0" encoding="UTF-8"?>', '<container>', '  <rootfiles>'] + \
        [f'    <rootfile full-path="{n}" media-type="{MEDIA}"/>' for n in members] + \
        ['  </rootfiles>', '</container>', '']
    with zipfile.ZipFile(dst + '.tmp', 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('mimetype', MEDIA, compress_type=zipfile.ZIP_STORED)
        z.writestr('META-INF/container.xml', '\n'.join(container))
        for n, root in members.items():
            ET.indent(root)
            z.writestr(n, b'<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE score-partwise PUBLIC '
                          b'"-//Recordare//DTD MusicXML 4.0 Partwise//EN" '
                          b'"http://www.musicxml.org/dtds/partwise.dtd">\n' + ET.tostring(root, encoding='utf-8'))
    os.replace(dst + '.tmp', dst)
    return dst


def export(wanted=()):
    for sub, kind, tag, d, song_dir in songs(wanted):
        if not os.path.exists(made_name(song_dir, tag)):
            continue
        print(write(song_dir, kind, tag, tempfile.mkdtemp()))

