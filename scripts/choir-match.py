"""Makes a choir song's score match its printed sheet: the words, the title, the line and page breaks, the staff size.

Each song may hold a `match.txt` beside its files, written from the song's PDF and its page in the choir's book:

    title: 1 Binecuvântat să fie Domnul
    composer: Valer Bogdan             the name printed at the right, under the title
    lyricist: Valentin Popovici        the name printed at the left (the words' author)
    spatium: 1.9                       staff space in mm (the printed size)
    systems: 1 5 9 13 16 | 20 22 25    first bar of each line; | starts a new page
    hide-empty-staves                  a staff with nothing to sing in a line is left out, as printed
    hide-tempo                         the tempo mark is not printed (it still sets the speed)
    hide-names                         no voice names before the staves
    staff-distance: 4.5                space between the staves, and system-distance: between the lines
    lyrics-size: 11                    the words' size in points (Arial, as printed)
    count-pickup                       the sheet numbers its pickup as bar 1 (bars here follow the sheet)
    segno: 54                          the segno stands at this bar
    text: 81 above bold italic D.S.% al Coda   printed text at a bar, above or below the top staff (% is the segno)

    [Soprano]                          words under a voice (any of the choir's voice names)
    1: @1 Bi -- ne -- cu -- vân -- tat să fi -- e Dom -- nul, ...
    2: @18 bi -- ru -- in -- ța ...
    [Tenor italic]                     printed in italics, as the men's own words often are
    1: @14 De toți _ în -- ge -- rii ...

Words are syllables in order, one per note the voice sings (a note that only continues a tie takes none): `--`
joins the syllables of a word, `_` holds a syllable over the next note, `@N` moves to the first note of bar N (as
the bar is numbered on the page). `python3 scripts/choir-match.py notes <score.mscz> <staff> <voice>` lists a
voice's notes bar by bar, for writing the words against them. scripts/choir-scores.py applies the file.
"""

import re
import sys
from fractions import Fraction
import xml.etree.ElementTree as ET
import zipfile

VOICES = ['Soprano', 'Alto', 'Tenor', 'Bass', 'Tenor 1', 'Tenor 2', 'Baritone']


def parse(path):
    spec = dict(title=None, spatium=None, systems=[], hide_empty=False, hide_tempo=False, hide_names=False, blocks=[],
                texts=[], segno=None, notes=[])
    block = None
    for raw in open(path, encoding='utf-8'):
        line = raw.split('#', 1)[0].rstrip() if not raw.lstrip().startswith(('1', '2', '3', '4', '5', '6')) else raw.rstrip()
        if not line.strip():
            continue
        m = re.match(r'\[(.+?)\]\s*$', line.strip())
        if m:
            words = m.group(1).split()
            italic = 'italic' in words
            is_notes = 'notes' in words
            name = ' '.join(w for w in words if w not in ('italic', 'notes'))
            if name not in VOICES:
                raise SystemExit(f'{path}: unknown voice {name}')
            block = dict(voice=name, italic=italic, verses={})
            spec['notes' if is_notes else 'blocks'].append(block)
            continue
        m = re.match(r'\s*(\d+):\s*(.*)$', line)
        if m and block is not None:
            block['verses'].setdefault(int(m.group(1)), []).extend(m.group(2).split())
            continue
        key, _, value = line.partition(':')
        key = key.strip()
        if key == 'title':
            spec['title'] = value.strip()
        elif key in ('composer', 'lyricist'):
            spec[key] = value.strip()
        elif key == 'spatium':
            spec['spatium'] = value.strip()
        elif key == 'lyrics-size':
            spec['lyrics_size'] = value.strip()
        elif key == 'systems':
            spec['systems'] = [[int(b) for b in page.split()] for page in value.split('|')]
        elif key == 'hide-empty-staves':
            spec['hide_empty'] = True
        elif key == 'hide-tempo':
            spec['hide_tempo'] = True
        elif key == 'segno':
            spec['segno'] = int(value)
        elif key == 'text':
            # text: <bar> above|below [bold] [italic] <words>
            words = value.split()
            bar, place = int(words[0]), words[1]
            flags = [w for w in words[2:4] if w in ('bold', 'italic')]
            spec['texts'].append(dict(bar=bar, place=place, bold='bold' in flags, italic='italic' in flags,
                                      text=' '.join(words[2 + len(flags):])))
        elif key == 'hide-names':
            spec['hide_names'] = True
        elif key == 'count-pickup':
            spec['count_pickup'] = True
        elif key in ('staff-distance', 'system-distance'):
            spec[key.replace('-', '_')] = value.strip()
        else:
            raise SystemExit(f'{path}: cannot read: {line}')
    return spec


def syllables(tokens):
    """Tokens to placements: ('bar', N), ('hold',), or ('word', text, syllabic)."""
    out = []
    i = 0
    while i < len(tokens):
        t = tokens[i]
        if t.startswith('@'):
            out.append(('bar', int(t[1:])))
        elif t == '_':
            out.append(('hold',))
        elif t == '--':
            pass
        else:
            joined_before = i > 0 and tokens[i - 1] == '--'
            joined_after = i + 1 < len(tokens) and tokens[i + 1] == '--'
            kind = {(False, False): 'single', (False, True): 'begin', (True, True): 'middle',
                    (True, False): 'end'}[(joined_before, joined_after)]
            out.append(('word', t, kind))
        i += 1
    return out


# MuseScore's own file (.mscx)

def bar_numbers(measures, count_pickup=False):
    """Each measure's number as printed: a measure marked irregular (a pickup) is not counted, unless the sheet counts
    its pickup as bar 1."""
    out, n = [], 0
    for m in measures:
        if count_pickup or m.findtext('irregular') != '1':
            n += 1
        n += int(m.findtext('noOffset') or 0)
        out.append(n)
    return out


def sung_chords(measure, voice):
    """The chords a voice sings in a measure, in order: no grace note, no note that only continues a tie."""
    vs = measure.findall('voice')
    if voice >= len(vs):
        return []
    out = []
    for c in vs[voice].findall('Chord'):
        if any(c.find(t) is not None for t in ('acciaccatura', 'appoggiatura', 'grace4', 'grace16', 'grace32',
                                               'grace8after', 'grace16after', 'grace32after')):
            continue
        notes = c.findall('Note')
        if notes and all(n.find("Spanner[@type='Tie']/prev") is not None for n in notes):
            continue
        out.append(c)
    return out


def place(slots_by_bar, tokens):
    """Pairs each syllable with its slot (a chord or a MusicXML note), following @bar marks and holds."""
    order = [(b, s) for b in sorted(slots_by_bar) for s in slots_by_bar[b]]
    pos = 0
    pairs = []
    for t in syllables(tokens):
        if t[0] == 'bar':
            pos = next((k for k, (b, s) in enumerate(order) if b >= t[1]), len(order))
            continue
        if pos >= len(order):
            raise SystemExit(f'more words than notes, at {t}')
        if t[0] == 'word':
            pairs.append([order[pos][1], t[1], t[2], 0])
        elif pairs:
            pairs[-1][3] += 1
        pos += 1
    return pairs


DURATIONS = {'whole': Fraction(1), 'half': Fraction(1, 2), 'quarter': Fraction(1, 4), 'eighth': Fraction(1, 8),
             '16th': Fraction(1, 16), '32nd': Fraction(1, 32), 'breve': Fraction(2)}


def chord_lengths(measure, voice):
    """Every chord of a voice in a measure with its length as a fraction of a whole note (tuplets included)."""
    vs = measure.findall('voice')
    if voice >= len(vs):
        return []
    out, ratio = [], Fraction(1)
    for el in vs[voice]:
        if el.tag == 'Tuplet':
            ratio = Fraction(int(el.findtext('normalNotes') or 2), int(el.findtext('actualNotes') or 3))
        elif el.tag == 'endTuplet':
            ratio = Fraction(1)
        elif el.tag in ('Chord', 'Rest'):
            base = DURATIONS.get(el.findtext('durationType'), Fraction(0))
            dots = int(el.findtext('dots') or 0)
            out.append((el, base * (2 - Fraction(1, 2 ** dots)) * ratio))
    return out


def lyrics_mscx(staff, voice, block, nums):
    """Writes a block's words under a voice of a staff of the main score, in place of any it had. The bar numbers
    are the top staff's: only it marks a pickup bar."""
    measures = staff.findall('Measure')
    slots = {}
    for m, n in zip(measures, nums):
        slots.setdefault(n, []).extend(sung_chords(m, voice))
    for chords in slots.values():
        for c in chords:
            for l in c.findall('Lyrics'):
                c.remove(l)
    # Each chord in order with its length, to draw a held syllable's line to the end of its last note.
    sequence = [x for m in measures for x in chord_lengths(m, voice)]
    for verse, tokens in sorted(block['verses'].items()):
        slots_all = {id(c) for chords in slots.values() for c in chords}
        for chord, text, kind, holds in place(slots, tokens):
            ly = ET.Element('Lyrics')
            if kind in ('end', 'single'):
                # The line runs over the notes the syllable is held on: its holds, and any note tied on.
                k = next(i for i, (c, _) in enumerate(sequence) if c is chord)
                own = sequence[k][1]
                held = Fraction(0)
                last = Fraction(0)
                left = holds
                for c, length in sequence[k + 1:]:
                    if c.tag == 'Rest':
                        break
                    if id(c) in slots_all:
                        if not left:
                            break
                        left -= 1
                    held += length
                    last = length
                if held:
                    # MuseScore draws the line from the syllable's note to the start of the last note it holds.
                    held += own - last
                    ET.SubElement(ly, 'ticks_f').text = f'{held.numerator}/{held.denominator}'
            if verse > 1:
                ET.SubElement(ly, 'no').text = str(verse - 1)
            if kind != 'single':
                ET.SubElement(ly, 'syllabic').text = kind
            t = ET.SubElement(ly, 'text')
            if block['italic']:
                i = ET.SubElement(t, 'i')
                i.text = text
            else:
                t.text = text
            at = next((k for k, el in enumerate(chord) if el.tag == 'Note'), len(chord))
            chord.insert(at, ly)


def layout_mscx(score, spec):
    """The title, line and page breaks, and the hidden tempo, in the main score."""
    if spec['title']:
        for vb in score.iter('VBox'):
            for t in vb.findall('Text'):
                if t.findtext('style') == 'title':
                    tx = t.find('text')
                    for c in list(tx):
                        tx.remove(c)
                    # The song's number in bold before its name, as the sheets print it.
                    num, _, name = spec['title'].partition(' ')
                    if num.isdigit():
                        tx.text = None
                        b = ET.SubElement(tx, 'b')
                        b.text = num
                        b.tail = ' ' + name
                    else:
                        tx.text = spec['title']
            break
    for role in ('composer', 'lyricist'):
        if not spec.get(role):
            continue
        vb = next(score.iter('VBox'))
        styles = {'composer': ('composer',), 'lyricist': ('lyricist', 'poet')}[role]
        texts = [t for t in vb.findall('Text') if t.findtext('style') in styles]
        if texts:
            t = texts[0]
            tx = t.find('text')
            for c in list(tx):
                tx.remove(c)
        else:
            t = ET.SubElement(vb, 'Text')
            ET.SubElement(t, 'style').text = role
            tx = ET.SubElement(t, 'text')
        tx.text = spec[role]
    staffs = [s for s in score.findall('Staff') if s.find('Measure') is not None]
    first = staffs[0]
    measures = first.findall('Measure')
    nums = bar_numbers(measures, spec.get('count_pickup'))
    if spec.get('count_pickup'):
        for st in staffs:
            for m in st.findall('Measure'):
                for el in m.findall('irregular'):
                    m.remove(el)
    for m in measures:
        for b in m.findall('LayoutBreak'):
            m.remove(b)
    if spec['systems']:
        starts = {}
        for pi, page in enumerate(spec['systems']):
            for si, bar in enumerate(page):
                starts[bar] = 'page' if si == 0 and pi > 0 else 'line'
        for k, (m, n) in enumerate(zip(measures, nums)):
            nxt = nums[k + 1] if k + 1 < len(nums) else None
            if nxt in starts and nxt != n:
                br = ET.Element('LayoutBreak')
                ET.SubElement(br, 'subtype').text = starts[nxt]
                m.insert(0, br)
    by_bar = {n: m for m, n in zip(measures, nums)}
    if spec['segno']:
        for m in measures:
            for mk in m.findall('Marker'):
                if mk.findtext('markerType') == 'segno':
                    m.remove(mk)
                    by_bar[spec['segno']].insert(0, mk)
    for t in spec['texts']:
        v = by_bar[t['bar']].find('voice')
        st = ET.Element('StaffText')
        ET.SubElement(st, 'placement').text = t['place']
        tx = ET.SubElement(st, 'text')
        inner = tx
        for flag, tag in ((t['bold'], 'b'), (t['italic'], 'i')):
            if flag:
                inner = ET.SubElement(inner, tag)
        inner.text = t['text'].replace('%', '\U0001D10B')
        at = next((k for k, el in enumerate(v) if el.tag in ('Chord', 'Rest')), len(v))
        v.insert(at, st)
    if spec['hide_names']:
        for part in score.findall('Part'):
            for ins in part.findall('Instrument'):
                for tag in ('longName', 'shortName'):
                    for el in ins.findall(tag):
                        ins.remove(el)
    if spec['hide_tempo']:
        for t in score.iter('Tempo'):
            v = t.find('visible')
            if v is None:
                v = ET.Element('visible')
                t.insert(0, v)
            v.text = '0'


def style_mss(data, spec):
    """The staff size and hidden empty staves, in the score's style."""
    text = data.decode('utf-8')
    values = {}
    if spec['spatium']:
        values['spatium'] = spec['spatium']
    # The words in the printed sheets' sans type, at one size whatever the staff size.
    for side in ('Odd', 'Even'):
        values[f'lyrics{side}FontFace'] = 'Arial'
        values[f'lyrics{side}FontSize'] = spec.get('lyrics_size') or '11'
        values[f'lyrics{side}FontSpatiumDependent'] = '0'
    # A bar number only at the start of each line; the title and names in the sheets' sans type.
    values['showMeasureNumber'] = '1'
    values['measureNumberSystem'] = '1'
    values['measureNumberInterval'] = '1000'
    for el in ('title', 'subTitle', 'composer', 'lyricist'):
        values[f'{el}FontFace'] = 'Arial'
    # Staves and lines as close as the printed sheets set them.
    values['staffDistance'] = spec.get('staff_distance') or '5'
    values['akkoladeDistance'] = spec.get('staff_distance') or '5'
    values['minSystemDistance'] = spec.get('system_distance') or '5.5'
    values['maxSystemDistance'] = str(float(spec.get('system_distance') or '5.5') + 3)
    # The printed sheets have no footer and narrow top and bottom margins (inches).
    values['showFooter'] = '0'
    for side in ('Even', 'Odd'):
        values[f'page{side}TopMargin'] = '0.35'
        values[f'page{side}BottomMargin'] = '0.35'
    values['staffUpperBorder'] = '3'
    values['staffLowerBorder'] = '3'
    values['lyricsMinTopDistance'] = '0.5'
    values['lyricsMinBottomDistance'] = '0.5'
    values['lyricsLineHeight'] = '0.95'
    values['minSystemSpread'] = values['minSystemDistance']
    values['maxSystemSpread'] = values['maxSystemDistance']
    if spec['hide_empty']:
        values['hideEmptyStaves'] = '1'
        values['dontHideStavesInFirstSystem'] = '1'
    for k, v in values.items():
        text, n = re.subn(rf'<{k}>[^<]*</{k}>', f'<{k}>{v}</{k}>', text)
        if not n:
            text = text.replace('</Style>', f'  <{k}>{v}</{k}>\n    </Style>')
    return text.encode('utf-8')


# MusicXML, before the voices are split, so each part carries its words and the notes entered from the sheet

STEP_PC = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
TYPES = {1: 'whole', 2: 'half', 4: 'quarter', 8: 'eighth', 16: '16th', 32: '32nd'}


def note_tokens(tokens):
    """Note tokens to [(bar, [note dict])]: `Eb4:8.` (pitch, octave, length, dots), `r:4` a rest, `~` after a length
    ties to the next note, `t` after a length makes it a triplet's third."""
    bars, cur = [], None
    for t in tokens:
        if t.startswith('@'):
            cur = (int(t[1:]), [])
            bars.append(cur)
            continue
        m = re.match(r'(r|[A-G](?:#|b)?\d):(\d+)(\.*)(t?)(~?)$', t)
        if not m or cur is None:
            raise SystemExit(f'cannot read note {t}')
        pitch, length, dots, trip, tie = m.groups()
        cur[1].append(dict(pitch=None if pitch == 'r' else pitch, length=int(length), dots=len(dots),
                           triplet=bool(trip), tie=bool(tie)))
    return bars


def duration(n):
    d = Fraction(4, n['length']) * (2 - Fraction(1, 2 ** n['dots']))
    return d * Fraction(2, 3) if n['triplet'] else d


def notes_xml(score, part_index, staff, voice, block, multi_staff, count_pickup=False):
    """Writes a voice's notes, as entered from the sheet, into its bars, in place of what the voice had there."""
    part = score.findall('part')[part_index]
    measures = part.findall('measure')
    nums, n = [], 0
    for m in measures:
        if count_pickup or m.get('implicit') != 'yes':
            n += 1
        nums.append(n)
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

def lyrics_xml(score, part_index, staff, voice, block, count_pickup=False):
    part = score.findall('part')[part_index]
    slots = {}
    n = 0
    for m in part.findall('measure'):
        if count_pickup or m.get('implicit') != 'yes':
            n += 1
        notes = []
        for el in m.findall('note'):
            if (el.findtext('staff') or '1') != staff or (el.findtext('voice') or '1') != voice:
                continue
            if el.find('chord') is not None or el.find('grace') is not None or el.find('rest') is not None:
                continue
            if el.find("tie[@type='stop']") is not None and el.find("tie[@type='start']") is None:
                continue
            notes.append(el)
        slots.setdefault(n, []).extend(notes)
    for notes in slots.values():
        for el in notes:
            for l in el.findall('lyric'):
                el.remove(l)
    for verse, tokens in sorted(block['verses'].items()):
        for note, text, kind, _ in place(slots, tokens):
            ly = ET.Element('lyric', number=str(verse))
            ET.SubElement(ly, 'syllabic').text = kind
            t = ET.SubElement(ly, 'text')
            t.text = text
            if block['italic']:
                t.set('font-style', 'italic')
            note.append(ly)


def notes(path, staff, voice):
    """A voice's sung notes bar by bar, for writing its words."""
    names = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read(next(n for n in z.namelist() if n.endswith('.mscx') and '/' not in n)))
    staffs = [s for s in root.find('Score').findall('Staff') if s.find('Measure') is not None]
    for m, n in zip(staffs[staff].findall('Measure'), bar_numbers(staffs[0].findall('Measure'))):
        cs = sung_chords(m, voice)
        print(n, len(cs), ' '.join(names[int(c.find('Note').findtext('pitch')) % 12] for c in cs))


if __name__ == '__main__':
    if sys.argv[1] == 'notes':
        notes(sys.argv[2], int(sys.argv[3]), int(sys.argv[4]))
