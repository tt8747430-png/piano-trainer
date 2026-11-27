"""The choir's template scores, `template/Choir SATB.mscz` and `template/Choir TTBB.mscz`: empty scores made the way
every song's score is made (compose.py), for writing a new song in MuseScore Studio by hand: the two staves of a
choir's sheet (Soprano and Alto, Tenor and Bass; Tenor 1 and Tenor 2, Baritone and Bass), the upper voice of each
pair as voice 1 and the lower as voice 2, a part per voice tied to its voice, piano as the sound, the house style.
"""

import os
import tempfile
import xml.etree.ElementTree as ET

import compose
import spec as specs
from common import CHOIRS, ORDER, TEMPLATE, VOICES, mscore_job, write_xml
from spec import note_tokens

BARS = 16


def parts_xml(kind, bars=BARS, fifths=0, beats=4, beat_type=4):
    """A part per voice in MusicXML, each a whole bar's rest in every bar."""
    out = ET.Element('score-partwise', version='4.0')
    ET.SubElement(ET.SubElement(out, 'work'), 'work-title').text = 'Title'
    ident = ET.SubElement(out, 'identification')
    ET.SubElement(ident, 'creator', type='composer').text = 'Composer'
    ET.SubElement(ident, 'creator', type='lyricist').text = 'Lyricist'
    plist = ET.SubElement(out, 'part-list')
    # The staves bracketed, each with its own barlines, as the choir's sheets draw them.
    group = ET.SubElement(plist, 'part-group', type='start', number='1')
    ET.SubElement(group, 'group-symbol').text = 'bracket'
    ET.SubElement(group, 'group-barline').text = 'no'
    for i, (name, abbr, clef, _) in enumerate(VOICES[kind]):
        pid = f'P{i + 1}'
        sp = ET.SubElement(plist, 'score-part', id=pid)
        ET.SubElement(sp, 'part-name').text = name
        ET.SubElement(sp, 'part-abbreviation').text = abbr
        si = ET.SubElement(sp, 'score-instrument', id=f'{pid}-I1')
        ET.SubElement(si, 'instrument-name').text = 'Piano'
        ET.SubElement(si, 'instrument-sound').text = 'keyboard.piano'
        mi = ET.SubElement(sp, 'midi-instrument', id=f'{pid}-I1')
        ET.SubElement(mi, 'midi-channel').text = str(i + 1)
        ET.SubElement(mi, 'midi-program').text = '1'
    ET.SubElement(plist, 'part-group', type='stop', number='1')
    for i, (name, abbr, clef, _) in enumerate(VOICES[kind]):
        part = ET.SubElement(out, 'part', id=f'P{i + 1}')
        first = min(bar for block in spec['notes'] for bar, _ in note_tokens(block['verses'].get(1, [])))
        for b in range(min(first, 1), bars + 1):
            # bar 0: a pickup the sheet leaves unnumbered
            m = ET.SubElement(part, 'measure', number=str(b), **({'implicit': 'yes'} if b == 0 else {}))
            if b == min(first, 1):
                at = ET.SubElement(m, 'attributes')
                ET.SubElement(at, 'divisions').text = '1'
                ET.SubElement(ET.SubElement(at, 'key'), 'fifths').text = str(fifths)
                t = ET.SubElement(at, 'time')
                ET.SubElement(t, 'beats').text = str(beats)
                ET.SubElement(t, 'beat-type').text = str(beat_type)
                c = ET.SubElement(at, 'clef')
                ET.SubElement(c, 'sign').text = clef[0]
                ET.SubElement(c, 'line').text = str(clef[1])
                if clef[2]:
                    ET.SubElement(c, 'clef-octave-change').text = str(clef[2])
            n = ET.SubElement(m, 'note')
            ET.SubElement(n, 'rest', measure='yes')
            ET.SubElement(n, 'duration').text = str(beats * 4 // beat_type)
            ET.SubElement(n, 'voice').text = '1'
    return out


def skeleton(kind, spec):
    """The choir's two staves, empty, for a song written in from its sheet alone: its key and time, as many bars as
    its notes fill, the upper pair of voices on the first staff and the lower on the second, each staff in its lower
    voice's clef."""
    bars = max(bar for block in spec['notes'] for bar, _ in note_tokens(block['verses'].get(1, [])))
    beats, beat_type, symbol = spec.get('time', (4, 4, None))
    out = ET.Element('score-partwise', version='4.0')
    ET.SubElement(ET.SubElement(out, 'work'), 'work-title').text = spec['title'] or ''
    ident = ET.SubElement(out, 'identification')
    for role in ('composer', 'lyricist'):
        if spec.get(role):
            ET.SubElement(ident, 'creator', type=role).text = spec[role]
    plist = ET.SubElement(out, 'part-list')
    group = ET.SubElement(plist, 'part-group', type='start', number='1')
    ET.SubElement(group, 'group-symbol').text = 'bracket'
    ET.SubElement(group, 'group-barline').text = 'no'
    pairs = (VOICES[kind][:2], VOICES[kind][2:])
    for i, pair in enumerate(pairs):
        sp = ET.SubElement(plist, 'score-part', id=f'P{i + 1}')
        ET.SubElement(sp, 'part-name').text = ', '.join(v[0] for v in pair)
    ET.SubElement(plist, 'part-group', type='stop', number='1')
    for i, pair in enumerate(pairs):
        clef = pair[1][2]
        part = ET.SubElement(out, 'part', id=f'P{i + 1}')
        first = min(bar for block in spec['notes'] for bar, _ in note_tokens(block['verses'].get(1, [])))
        for b in range(min(first, 1), bars + 1):
            # bar 0: a pickup the sheet leaves unnumbered
            m = ET.SubElement(part, 'measure', number=str(b), **({'implicit': 'yes'} if b == 0 else {}))
            if b == min(first, 1):
                at = ET.SubElement(m, 'attributes')
                ET.SubElement(at, 'divisions').text = '48'
                ET.SubElement(ET.SubElement(at, 'key'), 'fifths').text = str(spec.get('key', 0))
                t = ET.SubElement(at, 'time', **({'symbol': symbol} if symbol else {}))
                ET.SubElement(t, 'beats').text = str(beats)
                ET.SubElement(t, 'beat-type').text = str(beat_type)
                c = ET.SubElement(at, 'clef')
                ET.SubElement(c, 'sign').text = clef[0]
                ET.SubElement(c, 'line').text = str(clef[1])
                if clef[2]:
                    ET.SubElement(c, 'clef-octave-change').text = str(clef[2])
        for bar, fifths in spec.get('key_changes', []):
            # a new key signature from that bar, as printed
            at = ET.Element('attributes')
            ET.SubElement(ET.SubElement(at, 'key'), 'fifths').text = str(fifths)
            part.findall("measure")[bar - min(first, 1)].insert(0, at)
        for bar, (b, bt, sym) in spec.get('time_changes', []):
            # a new time signature from that bar, as printed
            at = ET.Element('attributes')
            tm = ET.SubElement(at, 'time', **({'symbol': sym} if sym else {}))
            ET.SubElement(tm, 'beats').text = str(b)
            ET.SubElement(tm, 'beat-type').text = str(bt)
            part.findall("measure")[bar - min(first, 1)].insert(0, at)
        # The final barline (a repeat in match.txt may add its own).
        bl = ET.SubElement(part.findall('measure')[-1], 'barline', location='right')
        ET.SubElement(bl, 'bar-style').text = 'light-heavy'
    return out


def write():
    work = tempfile.mkdtemp()
    os.makedirs(TEMPLATE, exist_ok=True)
    made = []
    for sub, kind, tag in CHOIRS:
        out = parts_xml(kind)
        s = dict(kind=kind, parts=[], spec=specs.read(TEMPLATE),
                 info=compose.closed_info([dict(name=n) for n in ORDER[kind]]))
        jobs = []
        for i in range(len(ORDER[kind])):
            x = os.path.join(work, f'{tag}-part{i}.musicxml')
            write_xml(compose.single_part(out, i), x)
            s['parts'].append((x, x[:-9] + '.mscz'))
            jobs.append(s['parts'][-1])
        # The main score: two staves, each pair's lower voice left empty for the notes to be written in (its rests
        # would only stand beside the upper voice's).
        main = compose.closed(out, kind)
        for part in main.findall('part'):
            for m in part.findall('measure'):
                for el in list(m):
                    if el.tag == 'backup' or (el.tag == 'note' and el.findtext('voice') == '2'):
                        m.remove(el)
        x = os.path.join(work, f'{tag}-main.musicxml')
        write_xml(main, x)
        s['main'] = x[:-9] + '.mscz'
        jobs.append((x, s['main']))
        done = set(mscore_job(jobs))
        if any(b not in done for a, b in jobs):
            raise SystemExit(f'MuseScore did not save the {tag} template')
        dst = os.path.join(TEMPLATE, f'Choir {tag}.mscz')
        compose.compose(s, dst, imported=True)
        made.append(dst)
    print('\n'.join(made))

