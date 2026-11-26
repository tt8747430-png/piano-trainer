"""The song's full score in MusicXML, corrected before its voices are split, so every part carries it: the notes
entered from the sheet, its repeats and tempo, and its words."""

import xml.etree.ElementTree as ET
from fractions import Fraction

from common import ORDER, TYPES
from spec import note_tokens
from words import Tied, place


def default_place(score, kind, name):
    """Where a voice goes on the choir's two staves: the upper pair on the first, the lower on the second, the
    higher voice of each pair voice 1. Returns (part index, staff, voice) in MusicXML terms."""
    i = ORDER[kind].index(name)
    parts_ = score.findall('part')
    staff_pair, voice = i // 2, str(i % 2 + 1)
    if len(parts_) >= 2:
        return staff_pair, '1', voice
    return 0, str(staff_pair + 1), voice


def has_staves(score, part_index):
    """Whether a MusicXML part has more than one staff (its notes then name theirs)."""
    return max([int(x.text) for x in score.findall('part')[part_index].iter('staves')] or [1]) > 1


def duration(n):
    d = Fraction(4, n['length']) * (2 - Fraction(1, 2 ** n['dots']))
    return d * Fraction(2, 3) if n['triplet'] else d


def numbered(measures, count_pickup):
    """Each MusicXML measure's number as printed: a measure marked implicit (a pickup, or the second half of a split
    bar) shares the number before it, unless the sheet counts its pickup as bar 1."""
    nums, n = [], 0
    for k, m in enumerate(measures):
        if m.get('implicit') != 'yes' or (count_pickup and k == 0):
            n += 1
        nums.append(max(n, 1))
    return nums


def structure_xml(score, spec):
    """The tempo and repeats as printed, in every part."""
    if spec.get('tempo'):
        for d in score.iter('direction'):
            for pm in d.iter('per-minute'):
                pm.text = str(spec['tempo'])
            for snd in d.findall('sound'):
                if snd.get('tempo'):
                    snd.set('tempo', str(spec['tempo']))
    if not spec.get('repeat'):
        return
    start, at, end = spec['repeat']
    at = at * 4  # from a fraction of a whole note to beats (quarters), the unit of MusicXML durations here
    for part in score.findall('part'):
        measures = part.findall('measure')
        nums = numbered(measures, spec.get('count_pickup'))
        div = int(next(a.findtext('divisions') for a in part.iter('attributes') if a.findtext('divisions')))
        first = measures[nums.index(start)]
        if at:
            # Split the bar: what sounds from `at` on goes to a new bar that the repeat opens.
            second = ET.Element('measure', number=first.get('number') + 'X', implicit='yes')
            t = Fraction(0)
            keep, move = [], []
            for el in list(first):
                if el.tag == 'backup':
                    t -= Fraction(int(el.findtext('duration')), div)
                    continue
                if el.tag == 'forward':
                    t += Fraction(int(el.findtext('duration')), div)
                    continue
                if el.tag == 'note':
                    if el.find('chord') is None:
                        start_t = t
                        t += Fraction(int(el.findtext('duration') or 0), div)
                    (move if start_t >= at else keep).append(el)
                elif el.tag in ('attributes', 'print'):
                    keep.append(el)
                else:
                    keep.append(el)
            for el in list(first):
                first.remove(el)
            def rebuild(m, els, length):
                # Notes in voice order, each voice from the bar's start.
                voices = {}
                for el in els:
                    if el.tag == 'note':
                        voices.setdefault((el.findtext('staff') or '1', el.findtext('voice') or '1'), []).append(el)
                    else:
                        m.append(el)
                for k, (key, ns) in enumerate(voices.items()):
                    if k:
                        bk = ET.SubElement(m, 'backup')
                        ET.SubElement(bk, 'duration').text = str(int(length * div))
                    for n in ns:
                        m.append(n)
            rebuild(first, keep, at)
            # The second bar is as long as its first voice's notes.
            first_voice = (move[0].findtext('staff') or '1', move[0].findtext('voice') or '1') if move else None
            length2 = sum((Fraction(int(n.findtext('duration') or 0), div) for n in move if n.find('chord') is None
                           and (n.findtext('staff') or '1', n.findtext('voice') or '1') == first_voice), Fraction(0))
            rebuild(second, move, length2)
            bl = ET.Element('barline', location='left')
            ET.SubElement(bl, 'bar-style').text = 'heavy-light'
            ET.SubElement(bl, 'repeat', direction='forward')
            second.insert(0, bl)
            idx = list(part).index(first)
            part.insert(idx + 1, second)
        else:
            bl = ET.Element('barline', location='left')
            ET.SubElement(bl, 'bar-style').text = 'heavy-light'
            ET.SubElement(bl, 'repeat', direction='forward')
            first.insert(0, bl)
        measures = part.findall('measure')
        nums = numbered(measures, spec.get('count_pickup'))
        last = [m for m, n in zip(measures, nums) if n == end][-1]
        bl = ET.SubElement(last, 'barline', location='right')
        ET.SubElement(bl, 'bar-style').text = 'light-heavy'
        ET.SubElement(bl, 'repeat', direction='backward')


def notes_xml(score, part_index, staff, voice, block, multi_staff, count_pickup=False):
    """Writes a voice's notes, as entered from the sheet, into its bars, in place of what the voice had there."""
    part = score.findall('part')[part_index]
    measures = part.findall('measure')
    nums = numbered(measures, count_pickup)
    div = int(next(a.findtext('divisions') for a in part.iter('attributes') if a.findtext('divisions')))
    tied = False
    for bar, notes in note_tokens(block['verses'].get(1, [])):
        m = measures[nums.index(bar)]
        for el in list(m):
            if el.tag == 'note' and (el.findtext('staff') or '1') == staff and (el.findtext('voice') or '1') == voice:
                m.remove(el)
        length = Fraction(0)
        t = Fraction(0)
        for el in m:
            if el.tag == 'backup':
                t -= Fraction(int(el.findtext('duration')), div)
            elif el.tag == 'forward' or (el.tag == 'note' and el.find('chord') is None):
                t += Fraction(int(el.findtext('duration') or 0), div)
            length = max(length, t)
        if length:
            bk = ET.SubElement(m, 'backup')
            ET.SubElement(bk, 'duration').text = str(int(length * div))
        for nd in notes:
            el = ET.SubElement(m, 'note')
            if nd['pitch'] is None:
                ET.SubElement(el, 'rest')
                if nd.get('unison'):
                    # sung with the staff's other voice on its note: hidden here, the part takes that note
                    el.set('print-object', 'no')
            else:
                p = ET.SubElement(el, 'pitch')
                ET.SubElement(p, 'step').text = nd['pitch'][0]
                acc = nd['pitch'][1:-1]
                if acc:
                    ET.SubElement(p, 'alter').text = '1' if acc == '#' else '-1'
                ET.SubElement(p, 'octave').text = nd['pitch'][-1]
            ET.SubElement(el, 'duration').text = str(int(duration(nd) * div))
            if tied and nd['pitch']:
                ET.SubElement(el, 'tie', type='stop')
            if nd['tie']:
                ET.SubElement(el, 'tie', type='start')
            ET.SubElement(el, 'voice').text = voice
            ET.SubElement(el, 'type').text = TYPES[nd['length']]
            for _ in range(nd['dots']):
                ET.SubElement(el, 'dot')
            if nd['triplet']:
                tm = ET.SubElement(el, 'time-modification')
                ET.SubElement(tm, 'actual-notes').text = '3'
                ET.SubElement(tm, 'normal-notes').text = '2'
            if multi_staff:
                ET.SubElement(el, 'staff').text = staff
            notations = ET.SubElement(el, 'notations')
            if tied and nd['pitch']:
                ET.SubElement(notations, 'tied', type='stop')
            if nd['tie']:
                ET.SubElement(notations, 'tied', type='start')
            if not len(notations):
                el.remove(notations)
            tied = nd['tie']


def lyrics_xml(score, part_index, staff, voice, block, count_pickup=False, clear=True):
    """A block's words under a voice, in place of any it had (cleared once, before the voice's first block)."""
    part = score.findall('part')[part_index]
    slots = {}
    for m, n in zip(part.findall('measure'), numbered(part.findall('measure'), count_pickup)):
        notes = []
        for el in m.findall('note'):
            if (el.findtext('staff') or '1') != staff or (el.findtext('voice') or '1') != voice:
                continue
            if el.find('chord') is not None or el.find('grace') is not None or el.find('rest') is not None:
                continue
            if el.find("tie[@type='stop']") is not None and el.find("tie[@type='start']") is None:
                notes.append(Tied(el))
                continue
            notes.append(el)
        slots.setdefault(n, []).extend(notes)
    for notes in slots.values() if clear else ():
        for el in notes:
            el = el.el if isinstance(el, Tied) else el
            for l in el.findall('lyric'):
                el.remove(l)
    for verse, tokens in sorted(block['verses'].items()):
        for note, text, kind, _ in place(slots, tokens):
            text = text.rstrip('|')
            ly = ET.Element('lyric', number=str(verse))
            ET.SubElement(ly, 'syllabic').text = kind
            t = ET.SubElement(ly, 'text')
            t.text = text
            if block['italic']:
                t.set('font-style', 'italic')
            note.append(ly)
