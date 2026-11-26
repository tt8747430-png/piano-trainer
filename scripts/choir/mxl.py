"""A song's MusicXML 4.0 file (`<song> (SATB).mxl`): the closed score as printed, each voice its own instrument,
and a part per voice linked to its voice.

MusicXML 4.0 lets one compressed file hold a score and its parts. The score's two staves each keep their two voices
(Soprano and Alto, Tenor and Bass), but each staff's part declares one instrument per voice, and every note names the
voice that sings it (`<instrument id>`: both voices on a unison's one notehead). Each voice's part, as the made
score's part is (its own staff, notes and words), is a file of its own, tied to its voice by `<part-link>` and
`<instrument-link>`. An application that reads these links shows the closed score and each voice's part; one that
does not still reads the closed score, every note with its voice.
"""

import os
import tempfile
import xml.etree.ElementTree as ET
import zipfile
from fractions import Fraction

from common import ORDER, made_name, mscore_job, read_mscz, songs, xml_bytes

XLINK = 'http://www.w3.org/1999/xlink'
MEDIA = 'application/vnd.recordare.musicxml+xml'
ET.register_namespace('xlink', XLINK)


def onsets(part):
    """A MusicXML part's sounding notes: {(measure index, moment, voice): [note]}, a chord's notes together."""
    out, div = {}, 1
    for mi, m in enumerate(part.findall('measure')):
        t = Fraction(0)
        last = None
        for el in m:
            if el.tag == 'attributes' and el.findtext('divisions'):
                div = int(el.findtext('divisions'))
            elif el.tag == 'backup':
                t -= Fraction(int(el.findtext('duration')), div)
            elif el.tag == 'forward':
                t += Fraction(int(el.findtext('duration')), div)
            elif el.tag == 'note':
                if el.find('grace') is not None:
                    continue
                if el.find('chord') is not None and last is not None:
                    out[last].append(el)
                    continue
                key = (mi, t, el.findtext('voice') or '1')
                out.setdefault(key, []).append(el)
                last = key
                t += Fraction(int(el.findtext('duration') or 0), div)
    return out


def pitch(note):
    p = note.find('pitch')
    return None if p is None else (p.findtext('step'), p.findtext('alter') or '0', p.findtext('octave'))


def sounding(notes):
    return [n for n in notes if n.find('rest') is None]


def name_voices(score, kind, voice_parts):
    """Each staff's part declares an instrument per voice and each note names its voice; returns the instrument
    ids by voice name."""
    names = ORDER[kind]
    plist = score.find('part-list')
    ids = {}
    for pi, (sp, part) in enumerate(zip(plist.findall('score-part'), score.findall('part'))):
        upper, lower = names[2 * pi], names[2 * pi + 1]
        pid = sp.get('id')
        for el in sp.findall('score-instrument') + sp.findall('midi-instrument') + sp.findall('midi-device'):
            sp.remove(el)
        at = len(sp)
        for k, v in enumerate((upper, lower)):
            iid = f'{pid}-I{k + 1}'
            ids[v] = iid
            si = ET.Element('score-instrument', id=iid)
            ET.SubElement(si, 'instrument-name').text = v
            ET.SubElement(si, 'instrument-sound').text = 'keyboard.piano'
            sp.insert(at + k, si)
        for k, v in enumerate((upper, lower)):
            mi = ET.SubElement(sp, 'midi-instrument', id=ids[v])
            ET.SubElement(mi, 'midi-channel').text = str(2 * pi + k + 1)
            ET.SubElement(mi, 'midi-program').text = '1'
        # the notes: voice 1 the upper voice's, voice 2 the lower's; where the lower voice has no note of its own
        # and its part sings the upper's note, that notehead is both voices' (a unison)
        own = onsets(part)
        lower_part = onsets(voice_parts[lower])
        for (mi_, t, v), notes in own.items():
            singers = [upper] if v != '2' else [lower]
            if v == '1' and not sounding(own.get((mi_, t, '2'), [])):
                theirs = sounding(lower_part.get((mi_, t, '1'), []))
                if theirs and {pitch(n) for n in theirs} <= {pitch(n) for n in sounding(notes)}:
                    singers.append(lower)
            for n in sounding(notes):
                tags = [c.tag for c in n]
                at = next((i for i, tag in enumerate(tags) if tag in ('voice', 'type', 'dot', 'accidental',
                                                                     'time-modification', 'stem', 'notehead',
                                                                     'staff', 'beam', 'notations', 'lyric')),
                          len(tags))
                for s in reversed(singers):
                    n.insert(at, ET.Element('instrument', id=ids[s]))
    return ids


def link_parts(score, kind, ids, files):
    """Each staff's part links its voices' part files; the staves form the score's group, the parts their own."""
    names = ORDER[kind]
    for pi, sp in enumerate(score.find('part-list').findall('score-part')):
        at = 1 if sp.find('identification') is not None else 0
        for k, v in enumerate(names[2 * pi:2 * pi + 2]):
            link = ET.Element('part-link', {f'{{{XLINK}}}href': files[v], f'{{{XLINK}}}title': v,
                                            f'{{{XLINK}}}show': 'new'})
            ET.SubElement(link, 'instrument-link', id=ids[v])
            ET.SubElement(link, 'group-link').text = 'parts'
            sp.insert(at + k, link)
        group = ET.Element('group')
        group.text = 'score'
        tags = [c.tag for c in sp]
        sp.insert(max(i for i, t in enumerate(tags) if t in ('part-name', 'part-name-display', 'part-abbreviation',
                                                             'part-abbreviation-display')) + 1, group)


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
    score = ET.parse(jobs[0][1]).getroot()
    parts = {v: ET.parse(os.path.join(work, f'{v}.musicxml')).getroot() for v in voices}
    paths = {v: f'parts/{v}.musicxml' for v in voices}
    ids = name_voices(score, kind, {v: parts[v].find('part') for v in voices})
    link_parts(score, kind, ids, paths)
    score.set('version', '4.0')
    members = {'score.musicxml': score}
    for v in voices:
        p = parts[v]
        p.set('version', '4.0')
        sp = p.find('part-list/score-part')
        sp.find('part-name').text = v
        group = ET.Element('group')
        group.text = 'parts'
        tags = [c.tag for c in sp]
        sp.insert(max(i for i, t in enumerate(tags) if t in ('part-name', 'part-abbreviation')) + 1, group)
        members[paths[v]] = p
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

