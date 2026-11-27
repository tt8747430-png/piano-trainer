"""The made score's file: the main score MuseScore saved, corrected (octaves and clefs, piano, the sheet's words,
layout, marks and slurs, the house style), and a part per voice tied to its voice of the score."""

import copy
import os
import re
import xml.etree.ElementTree as ET

import engrave
import house
import parts
import slurs
from common import (ORDER, SHORT, find_voice, main_name, read_mscz, set_text, voice_of, voices_of, write_mscz,
                    xml_bytes)


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
    lower on voice 2, the words under the upper, each staff in its lower voice's clef (the men of a mixed choir in the
    bass clef, the tenors of a men's choir in the tenor clef)."""
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
        low_clefs = [copy.deepcopy(c) for c in low.iter('clef')]
        for at in up.iter('attributes'):
            for k, c in enumerate(at.findall('clef')):
                if k < len(low_clefs):
                    at.insert(list(at).index(c), low_clefs[k])
                    at.remove(c)
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
    # The house template's title, names and tempo on every score; the sheet's corrections where it is matched.
    spec = s['spec']
    if spec['matched']:
        engrave.mark_split(score, spec)
        nums = engrave.bar_numbers(staffs[0].findall('Measure'), spec.get('count_pickup'))
        done_voices, held = set(), set()
        for block in spec['blocks']:
            p = find_voice(info, block['voice'])
            engrave.lyrics_mscx(staffs[p['mstaff']], voice_of(p), block, nums,
                                clear=block['voice'] not in done_voices, held_chords=held,
                                lined=spec.get('unslurred', ()))
            done_voices.add(block['voice'])
        for name in spec.get('italic', []):
            p = find_voice(info, name)
            engrave.italicize(staffs[p['mstaff']], voice_of(p))
    engrave.layout_mscx(score, spec)
    if spec['matched']:
        nums = engrave.bar_numbers(staffs[0].findall('Measure'), spec.get('count_pickup'))
        engrave.marks_mscx(score, spec, nums)
        engrave.hide_staff(score, spec, info, nums)
        engrave.untie_mscx(score, spec, info, nums)
        # Slurs where a syllable spans several notes: each staff's voices sing its words, a voice with words of
        # its own in a bar sings those.
        top = slurs.onsets_of(staffs[0], 0)
        for k, ps in by_staff.items():
            vs = sorted({voice_of(p) for p in ps})
            slurs.melisma_slurs(staffs[k], vs, held, None if k == 0 else top)
        if spec.get('unslurred'):
            slurs.drop_slurs(staffs, {k for k, n in enumerate(nums) if n in spec['unslurred']})
        slurs.slurs_mscx(score, spec, info, nums)
    files['score_style.mss'] = house.apply(files['score_style.mss'], spec)
    files[mname] = xml_bytes(root)
    if imported:
        files[mname] = drop_repeated_marks(files[mname])

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
        files[f'Excerpts/{base}/{base}.mscx'] = drop_repeated_marks(xml_bytes(proot))
        files[f'Excerpts/{base}/{base}.mss'] = house.apply(pf['score_style.mss'], spec)
        extra += [f'Excerpts/{base}/{base}.mss', f'Excerpts/{base}/{base}.mscx']

    # Each part's words from the main score, bar by bar from the voice it moves with.
    parts.apply(files, spec)

    # The container lists the main score, then each part.
    out_name = os.path.basename(dst)[:-5] + '.mscx'
    files[out_name] = files.pop(mname)
    order = ['score_style.mss', out_name] + extra + [n for n in files if n.startswith('Thumbnails/')] + \
        [n for n in ('automation.json', 'audiosettings.json', 'viewsettings.json') if n in files]
    cont = ['<?xml version="1.0" encoding="UTF-8"?>', '<container>', '  <rootfiles>'] + \
        [f'    <rootfile full-path="{n}"/>' for n in order] + ['    </rootfiles>', '  </container>', '']
    files['META-INF/container.xml'] = '\n'.join(cont).encode('utf-8')
    write_mscz(dst, files, order + ['META-INF/container.xml'])


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


def drop_repeated_marks(data):
    """The tempo and other marks above the top staff only (MuseScore repeats them over a staff of its choosing when it
    reads MusicXML)."""
    text = data.decode('utf-8')
    text = re.sub(r'\s*<SystemObjects>.*?</SystemObjects>', '', text, flags=re.S)
    text = re.sub(r'\s*<(Tempo|SystemText|RehearsalMark|Jump|Marker)>(?:(?!</\1>).)*?<linkedTo>.*?</\1>', '', text,
                  flags=re.S)
    return text.encode('utf-8')


def assemble(infos, kind):
    """A full score from one-voice files ((path, MusicXML root, voice count) each): each voice's file gives the
    staff holding its notes."""
    by_voice = {}
    for f, root, lines in infos:
        vs = [v for v in voices_of(os.path.basename(f)) if v != 'All voices']
        name = vs[0] if len(vs) == 1 else None
        if name and lines == 1 and name not in by_voice:
            by_voice[name] = root
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
