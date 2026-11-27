"""The song's full score in MusicXML, corrected before its voices are split, so every part carries it: the notes
entered from the sheet, its repeats and tempo, and its words."""

import copy
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
    """The tempo, repeats, endings and double barlines as printed, in every part."""
    if spec.get('tempo'):
        for d in score.iter('direction'):
            for pm in d.iter('per-minute'):
                pm.text = str(spec['tempo'])
            for snd in d.findall('sound'):
                if snd.get('tempo'):
                    snd.set('tempo', str(spec['tempo']))
    for start, at, end in spec.get('repeats', []):
        repeat_xml(score, spec, start, at * 4, end)  # at: from a fraction of a whole note to beats (quarters)
    for first, last, number in spec.get('endings', []):
        ending_xml(score, spec, first, last, number, closed=(first, last, number) != spec['endings'][-1])
    for bar, length in spec.get('bar_lengths', []):
        cut_bar(score, spec, bar, length * 4)
    for bar in spec.get('doubles', []):
        for part in score.findall('part'):
            measures = part.findall('measure')
            nums = numbered(measures, spec.get('count_pickup'))
            bl = right_barline([m for m, n in zip(measures, nums) if n == bar][-1])
            if bl.find('bar-style') is None:
                bl.insert(0, ET.Element('bar-style'))
                bl[0].text = 'light-light'


def cut_bar(score, spec, bar, length):
    """A bar printed shorter than its time (the last bar after a pickup): the rests after `length` (in quarters)
    dropped from every voice, each voice again from the bar's start, so MuseScore reads the bar as that long."""
    for part in score.findall('part'):
        measures = part.findall('measure')
        nums = numbered(measures, spec.get('count_pickup'))
        m = [x for x, n in zip(measures, nums) if n == bar][-1]
        div = int(next(a.findtext('divisions') for a in part.iter('attributes') if a.findtext('divisions')))
        t, keep, voices = Fraction(0), [], {}
        for el in list(m):
            m.remove(el)
            if el.tag == 'backup':
                t -= Fraction(int(el.findtext('duration')), div)
            elif el.tag == 'forward':
                t += Fraction(int(el.findtext('duration')), div)
            elif el.tag == 'note':
                start = t
                if el.find('chord') is None:
                    t += Fraction(int(el.findtext('duration') or 0), div)
                if el.find('rest') is not None and start >= length:
                    continue
                voices.setdefault((el.findtext('staff') or '1', el.findtext('voice') or '1'), []).append(el)
            else:
                keep.append(el)
        for el in keep:
            if el.tag != 'barline':
                m.append(el)
        for k, ns in enumerate(voices.values()):
            if k:
                bk = ET.SubElement(m, 'backup')
                ET.SubElement(bk, 'duration').text = str(int(length * div))
            for n in ns:
                m.append(n)
        for el in keep:
            if el.tag == 'barline':
                m.append(el)


def right_barline(m):
    """A measure's right barline, made once and shared by a repeat and an ending that end there."""
    bl = m.find("barline[@location='right']")
    if bl is None:
        bl = ET.SubElement(m, 'barline', location='right')
    return bl


def ending_xml(score, spec, first, last, number, closed):
    """A first or second ending's bracket over its bars; the last is left open at its end, as printed."""
    for part in score.findall('part'):
        measures = part.findall('measure')
        nums = numbered(measures, spec.get('count_pickup'))
        a = measures[nums.index(first)]
        b = [m for m, n in zip(measures, nums) if n == last][-1]
        left = a.find("barline[@location='left']")
        if left is None:
            left = ET.Element('barline', location='left')
            a.insert(0, left)
        ET.SubElement(left, 'ending', number=number, type='start')
        right = right_barline(b)
        rep = right.find('repeat')
        stop = ET.Element('ending', number=number, type='stop' if closed else 'discontinue')
        right.insert(list(right).index(rep) if rep is not None else len(right), stop)


def repeat_xml(score, spec, start, at, end):
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
        bl = right_barline(last)
        for x in bl.findall('bar-style'):
            bl.remove(x)
        bl.insert(0, ET.Element('bar-style'))
        bl[0].text = 'light-heavy'
        ET.SubElement(bl, 'repeat', direction='backward')


def pitch_xml(el, name, at=None):
    """A note's pitch (`C#5`, `Bb4`) into a MusicXML note, first or at a given place among its children."""
    p = ET.Element('pitch')
    ET.SubElement(p, 'step').text = name[0]
    acc = name[1:-1]
    if acc:
        ET.SubElement(p, 'alter').text = '1' if acc == '#' else '-1'
    ET.SubElement(p, 'octave').text = name[-1]
    el.insert(len(el) if at is None else at, p)


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
                if nd.get('unison') or nd.get('hidden'):
                    # sung with the staff's other voice on its note (the part takes that note), or a rest the sheet
                    # leaves out where the other voice sings alone: not printed here
                    el.set('print-object', 'no')
                    if nd.get('hidden'):
                        el.set('rest-kept', 'yes')  # the voice's part keeps its rest (read by voices.voice_events)
            else:
                pitch_xml(el, nd['pitch'])
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
            for other in nd.get('more', []):
                # the voice divided: the other notes of its chord, after the first
                ch = copy.deepcopy(el)
                for x in list(ch):
                    if x.tag in ('pitch', 'lyric'):
                        ch.remove(x)
                ch.insert(0, ET.Element('chord'))
                pitch_xml(ch, other, at=1)
                m.append(ch)
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
