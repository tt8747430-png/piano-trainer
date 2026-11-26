"""Makes a choir song's score match its printed sheet: the words, the title, the line and page breaks, the staff size.

Each song may hold a `match.txt` beside its files, written from the song's PDF and its page in the choir's book.
Once the score matches the sheet, the song's old MuseScore files are removed: match.txt then stays as the record of
what was checked and written in, and the score is final. Its form:

    title: 1 Binecuvântat să fie Domnul
    composer: Valer Bogdan             the name printed at the right, under the title
    lyricist: Valentin Popovici        the name printed at the left (the words' author)
    spatium: 1.4                       staff space in mm, only where the house size (1.5) cannot keep the sheet's
                                       pages (see HOUSE below)
    systems: 1 5 9 13 16 | 20 22 25    first bar of each line; | starts a new page
    hide-empty-staves                  a staff with nothing to sing in a line is left out, as printed
    hide-tempo                         the tempo mark is not printed (it still sets the speed)
    hide-names                         no voice names before the staves
    lyrics-size: 9                     the words' size in points, only where the house size does not fit
    count-pickup                       the sheet numbers its pickup as bar 1 (bars here follow the sheet)
    dashed: 20 22                      ties and slurs in these bars drawn dashed, as printed
    beams                              eighths beamed together (by default each has its own flag, as sung lines are)
    bar-numbers: every                 a number over every bar (by default only at a line's start)
    repeat: 9+3/4 17                   a repeat from bar 9, 3/4 in (the bar is split there, as printed), to bar 17
    tempo: 105                         the tempo as printed
    footer: Corul ...                  a line of text at the foot of each page
    brace                              the staves joined by a brace, as a sheet exported from MuseScore draws them
    italic: Tenor                      a voice's words already in the file, set in italics as printed
    hide-chords                        chord symbols the file has are left off, as the sheet prints none
    marks: 1 pp, 2+1/4 <3/4, 14 fermata, 1 text:Moderato religioso
                                       marks on the top staff as printed: a dynamic (pp p mp mf f ff), a hairpin
                                       (< or > with its length in whole notes) at a bar (+ where in the bar), a
                                       fermata over the bar's first note at that point, a bold italic text
    hide-staff: Tenor 25-32            a voice's staff left out in those bars (an empty staff, as the sheet has it)
    untie: Bass 38                     a tie the file has and the sheet does not, in that voice's bars (commas)
    slur: Alto 13+1/2 +1/8, ...        a slur the sheet prints for a voice that sings words printed elsewhere
                                       (a voice's own held syllables are slurred from its words): from a bar and
                                       point in it to another, or + its length in whole notes
    segno: 54                          the segno stands at this bar
    text: 81 above bold italic D.S.% al Coda   printed text at a bar, above or below the top staff (% is the segno)

    [Soprano]                          words under a voice (any of the choir's voice names)
    1: @1 Bi -- ne -- cu -- vân -- tat să fi -- e Dom -- nul, ...
    2: @18 bi -- ru -- in -- ța ...
    [Tenor italic]                     printed in italics, as the men's own words often are
    [Soprano above]                    printed above the staff (a voice's own words over a shared staff)
    1: @14 De toți _ în -- ge -- rii ...

Words are syllables in order, one per note the voice sings (a note that only continues a tie takes none, unless the
syllable starts with `^`, as where one verse holds and another sings on): `--` joins the syllables of a word, `_`
holds a syllable over the next note, `*` passes over a note that is not sung to these words (an instrumental note), a syllable ending in `|` draws
no line over the notes it holds (where the sheet prints none),
`@N` moves to the first note of bar N (as the bar is numbered on the page). `python3 scripts/choir-match.py notes <score.mscz> <staff> <voice>` lists a
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
            name = ' '.join(w for w in words if w not in ('italic', 'notes', 'above'))
            if name not in VOICES:
                raise SystemExit(f'{path}: unknown voice {name}')
            block = dict(voice=name, italic=italic, above='above' in words, verses={})
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
        elif key == 'repeat':
            # repeat: 9+3/4 17   from bar 9, three quarters in (the bar is split there), to the end of bar 17
            a, b = value.split()
            bar, _, at = a.partition('+')
            spec['repeat'] = (int(bar), Fraction(at) if at else Fraction(0), int(b))
        elif key == 'tempo':
            spec['tempo'] = int(value)
        elif key == 'bar-numbers':
            spec['bar_numbers'] = value.strip()
        elif key == 'footer':
            spec['footer'] = value.strip()
        elif key == 'brace':
            spec['brace'] = True
        elif key == 'marks':
            # marks: 1 pp, 2 <@1/4-3/4, 5 >, 14 fermata, 1 text:Moderato religioso
            for item in value.split(','):
                item = item.strip()
                bar, _, what = item.partition(' ')
                bar, _, at = bar.partition('+')
                spec.setdefault('marks', []).append(dict(bar=int(bar), at=Fraction(at) if at else Fraction(0),
                                                         what=what.strip()))
        elif key == 'slur':
            # slur: Alto 13+1/2 +1/8   a slur from a point (bar, + where in it) to another, or + its length
            for item in value.split(','):
                parts = item.split()
                def point(t):
                    b, _, a = t.partition('+')
                    return (int(b) if b else None), (Fraction(a) if a else Fraction(0))
                spec.setdefault('slurs', []).append((' '.join(parts[:-2]), point(parts[-2]), point(parts[-1])))
        elif key == 'untie':
            # untie: Bass 38   ties the file has and the sheet does not, in that voice's bars
            name, _, bars = value.strip().rpartition(' ')
            spec.setdefault('untie', []).append((name.strip(), [int(b) for b in bars.split(',')]))
        elif key == 'hide-staff':
            # hide-staff: Tenor 25-32   the voice's staff is not printed in those bars, as on the sheet
            name, _, rng = value.strip().rpartition(' ')
            a, _, b = rng.partition('-')
            spec.setdefault('hide_staff', []).append((name.strip(), int(a), int(b or a)))
        elif key == 'hide-chords':
            spec['hide_chords'] = True
        elif key == 'italic':
            spec['italic'] = value.split(',')
        elif key == 'beams':
            spec['beams'] = True
        elif key == 'dashed':
            spec['dashed'] = [int(b) for b in value.split()]
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
        elif t == '*':
            out.append(('skip',))
        elif t == '--':
            pass
        else:
            # A hold (`_`) may stand on either side of a word's hyphen: look past it.
            b = i - 1
            while b >= 0 and tokens[b] == '_':
                b -= 1
            a = i + 1
            while a < len(tokens) and tokens[a] == '_':
                a += 1
            joined_before = b >= 0 and tokens[b] == '--'
            joined_after = a < len(tokens) and tokens[a] == '--'
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
    for k, m in enumerate(measures):
        if (count_pickup and k == 0) or m.findtext('irregular') != '1':
            n += 1
        n += int(m.findtext('noOffset') or 0)
        out.append(n)
    return out


# The chords a syllable is held onto (`_` in the words), for slurring each melisma as written.
HELD = set()


class Tied:
    """A note that only continues a tie: it takes a syllable only when the words mark it (`^`), as a verse sung
    where another holds (a dashed tie)."""

    def __init__(self, el):
        self.el = el


def sung_chords(measure, voice, with_ties=False):
    """The chords a voice sings in a measure, in order: no grace note, and no note that only continues a tie
    (with_ties: those come wrapped in Tied)."""
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
            if with_ties:
                out.append(Tied(c))
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
        on_tie = t[0] == 'word' and t[1].startswith('^')
        # A tied-on note is passed over unless the syllable is marked for it.
        while pos < len(order) and isinstance(order[pos][1], Tied) and not on_tie:
            pos += 1
        if pos >= len(order):
            raise SystemExit(f'more words than notes, at {t}')
        slot = order[pos][1]
        slot = slot.el if isinstance(slot, Tied) else slot
        if t[0] == 'word':
            pairs.append([slot, t[1].lstrip('^'), t[2], 0])
        elif t[0] == 'skip':
            pass
        elif pairs:
            pairs[-1][3] += 1
            HELD.add(id(slot))
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


def lyrics_mscx(staff, voice, block, nums, clear=True):
    """Writes a block's words under a voice of a staff of the main score, in place of any it had. The bar numbers
    are the top staff's: only it marks a pickup bar."""
    measures = staff.findall('Measure')
    slots = {}
    for m, n in zip(measures, nums):
        slots.setdefault(n, []).extend(sung_chords(m, voice, with_ties=True))
    # A voice's words are cleared once, before its first block (a voice may have several: words above and below).
    for chords in slots.values() if clear else ():
        for c in chords:
            c = c.el if isinstance(c, Tied) else c
            for l in c.findall('Lyrics'):
                c.remove(l)
    # Each chord in order with its length, to draw a held syllable's line to the end of its last note.
    sequence = [x for m in measures for x in chord_lengths(m, voice)]
    for verse, tokens in sorted(block['verses'].items()):
        slots_all = {id(c) for chords in slots.values() for c in chords if not isinstance(c, Tied)}
        for chord, text, kind, holds in place(slots, tokens):
            ly = ET.Element('Lyrics')
            no_line = text.endswith('|')
            text = text.rstrip('|')
            if kind in ('end', 'single') and not no_line:
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
            if block['above']:
                ET.SubElement(ly, 'placement').text = 'above'
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


def mark_split(score, spec):
    """The second half of a bar split for a repeat is not counted, as the sheet numbers it (MuseScore reads it from
    MusicXML as a bar of its own)."""
    if not spec.get('repeat') or not spec['repeat'][1]:
        return
    staffs = [s for s in score.findall('Staff') if s.find('Measure') is not None]
    for st in staffs:
        for m in st.findall('Measure')[1:]:
            if m.get('len') and m.find('startRepeat') is not None:
                if m.find('irregular') is None:
                    m.insert(0, ET.Element('irregular'))
                    m.find('irregular').text = '1'
    # The lower staves follow the top staff's split bar.
    top = staffs[0].findall('Measure')
    for st in staffs[1:]:
        for a, b in zip(top, st.findall('Measure')):
            if a.find('irregular') is not None and b.find('irregular') is None:
                el = ET.Element('irregular')
                el.text = '1'
                b.insert(0, el)


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
        # The pickup counts as bar 1; a split bar later on stays uncounted.
        for st in staffs:
            first_m = st.find('Measure')
            for el in first_m.findall('irregular'):
                first_m.remove(el)
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
    # Each eighth and sixteenth on its own flag, as the choir's sheets print a sung line (a triplet keeps its beam).
    if not spec.get('beams'):
        # A bar some staff sings in is sung by all: only a bar no one sings in (instrumental) keeps its beams.
        sung = {k for st in staffs for k, m in enumerate(st.findall('Measure')) if m.find('.//Lyrics') is not None}
        for st in staffs:
            worded = [m for k, m in enumerate(st.findall('Measure')) if k in sung]
            for v in (v for m in worded for v in m.findall('voice')):
                in_tuplet = False
                for el in v:
                    if el.tag == 'Tuplet':
                        in_tuplet = True
                    elif el.tag == 'endTuplet':
                        in_tuplet = False
                    elif el.tag in ('Chord', 'Rest') and not in_tuplet:
                        bm = el.find('BeamMode')
                        if bm is None:
                            bm = ET.Element('BeamMode')
                            at = next((k for k, c in enumerate(el) if c.tag == 'durationType'), 0)
                            el.insert(at, bm)
                        bm.text = 'no'
    # Ties and slurs the sheet draws dashed (one verse holds where another sings on), in every staff of those bars.
    for bar in spec.get('dashed', []):
        for st in staffs:
            for m, n in zip(st.findall('Measure'), nums):
                if n == bar:
                    for el in m.iter():
                        if el.tag in ('Tie', 'Slur'):
                            lt = el.find('lineType')
                            if lt is None:
                                lt = ET.SubElement(el, 'lineType')
                            lt.text = '2'
    if spec.get('brace'):
        defs = [st for part in score.findall('Part') for st in part.findall('Staff')]
        for d in defs:
            for b in d.findall('bracket'):
                d.remove(b)
        ET.SubElement(defs[0], 'bracket', type='1', span=str(len(defs)), col='0', visible='1')
    if spec.get('hide_chords'):
        for st in staffs:
            for parent in st.iter():
                for h in parent.findall('Harmony'):
                    parent.remove(h)
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


# The house style of every matched song, from professional engraving practice:
# - staff: 6 mm high (a 1.5 mm space), Gould's rastral 5, between her sizes for songs and for choral music
#   (Elaine Gould, Behind Bars, p. 483, as tabled by Donemus: rastral 4 = 6.5 mm songs, 6 = 5.5 mm choral);
# - words: Arial, the sans the choir's sheets use, with their x-height one staff space (Gould for choral text):
#   Arial's x-height is 0.519 of its size, so 1.5 mm takes 8.2 pt; set at 9 pt, a little above, for choirs reading
#   at arm's length;
# - margins: 15 mm on every side, the minimum engravers give a printed page (MuseScore engraving guidance), the
#   lines spread down the page between them;
# - title 20 pt, composer and lyricist 10 pt, a bar number at each line's start.
HOUSE = {
    'spatium': '1.5', 'lyrics_size': '9', 'title_size': '20', 'credit_size': '10', 'margin_mm': 15.0,
}


def style_mss(data, spec):
    """The house style, the line spacing and the sheet's own choices (hidden empty staves, every bar numbered,
    a footer) in the score's style."""
    text = data.decode('utf-8')
    values = {}
    values['spatium'] = spec['spatium'] or HOUSE['spatium']
    inch = lambda v: '%.4f' % (v / 25.4)
    margin = HOUSE['margin_mm']
    values['pageWidth'] = inch(210)
    values['pageHeight'] = inch(297)
    values['pagePrintableWidth'] = inch(210 - 2 * margin)
    for side in ('Even', 'Odd'):
        for edge in ('Left', 'Top', 'Bottom'):
            values[f'page{side}{edge}Margin'] = inch(margin)
    values['pageTwosided'] = '0'
    for side in ('Odd', 'Even'):
        values[f'lyrics{side}FontFace'] = 'Arial'
        values[f'lyrics{side}FontSize'] = spec.get('lyrics_size') or HOUSE['lyrics_size']
        values[f'lyrics{side}FontSpatiumDependent'] = '0'
    for el in ('title', 'subTitle', 'composer', 'lyricist'):
        values[f'{el}FontFace'] = 'Arial'
        values[f'{el}FontSpatiumDependent'] = '0'
    values['titleFontSize'] = HOUSE['title_size']
    values['composerFontSize'] = HOUSE['credit_size']
    values['lyricistFontSize'] = HOUSE['credit_size']
    values['showMeasureNumber'] = '1'
    if spec.get('bar_numbers') == 'every':
        values['measureNumberSystem'] = '0'
        values['measureNumberInterval'] = '1'
    else:
        values['measureNumberSystem'] = '1'
        values['measureNumberInterval'] = '1000'
    # The two staves of a system 5 spaces apart, the systems at least 6, spread evenly down a full page.
    values['staffDistance'] = '5'
    values['akkoladeDistance'] = '5'
    values['minSystemDistance'] = '6'
    values['maxSystemDistance'] = '12'
    values['enableVerticalSpread'] = '1'
    values['minSystemSpread'] = '6'
    values['maxSystemSpread'] = '24'
    values['minStaffSpread'] = '5'
    values['maxStaffSpread'] = '8'
    values['spreadSystem'] = '2.5'
    values['staffUpperBorder'] = '5'
    values['staffLowerBorder'] = '5'
    values['lyricsMinTopDistance'] = '1'
    values['lyricsMinBottomDistance'] = '1.5'
    values['lyricsLineHeight'] = '1'
    values['showFooter'] = '1' if spec.get('footer') else '0'
    if spec.get('footer'):
        for side in ('odd', 'even'):
            values[f'{side}FooterC'] = spec['footer']
            values[f'{side}FooterL'] = ''
            values[f'{side}FooterR'] = ''
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


def italicize(staff, voice):
    """A voice's words, as the file has them, set in italics."""
    for m in staff.findall('Measure'):
        vs = m.findall('voice')
        if voice >= len(vs):
            continue
        for ly in vs[voice].iter('Lyrics'):
            tx = ly.find('text')
            if tx is None or tx.find('i') is not None:
                continue
            words = ''.join(tx.itertext())
            for c in list(tx):
                tx.remove(c)
            tx.text = None
            i = ET.SubElement(tx, 'i')
            i.text = words


def chord_at_voice(measure, voice, at):
    t = Fraction(0)
    for el, length in chord_lengths(measure, voice):
        if t >= at:
            return el
        t += length
    return None


def chord_at(measure, at):
    """The first chord or rest of the measure's first voice that starts at `at` (a fraction of a whole note)."""
    t = Fraction(0)
    for el, length in chord_lengths(measure, 0):
        if t >= at:
            return el
        t += length
    return None


def marks_mscx(score, spec, nums):
    """Dynamics, hairpins, fermatas and texts on the top staff, where the sheet prints them."""
    staffs = [s for s in score.findall('Staff') if s.find('Measure') is not None]
    by_bar = {}
    for m, n in zip(staffs[0].findall('Measure'), nums):
        by_bar.setdefault(n, m)
    for mk in spec.get('marks', []):
        m = by_bar[mk['bar']]
        v = m.find('voice')
        target = chord_at(m, mk['at'])
        at_index = list(v).index(target) if target is not None else len(v)
        what = mk['what']
        if what in ('ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff', 'sf', 'sfz'):
            d = ET.Element('Dynamic')
            ET.SubElement(d, 'subtype').text = what
            ET.SubElement(d, 'placement').text = 'above'
            v.insert(at_index, d)
        elif what.startswith('<') or what.startswith('>'):
            length = Fraction(what[1:]) if what[1:] else Fraction(1, 2)
            sp = ET.Element('Spanner', type='HairPin')
            hp = ET.SubElement(sp, 'HairPin')
            ET.SubElement(hp, 'subtype').text = '0' if what[0] == '<' else '1'
            ET.SubElement(hp, 'placement').text = 'above'
            nx = ET.SubElement(sp, 'next')
            loc = ET.SubElement(nx, 'location')
            ET.SubElement(loc, 'fractions').text = f'{length.numerator}/{length.denominator}'
            v.insert(at_index, sp)
            # its end, `length` later
            end_bar, end_at = mk['bar'], mk['at'] + length
            em = by_bar[end_bar]
            sizes = [l for _, l in chord_lengths(em, 0)]
            while end_at >= sum(sizes) and end_bar + 1 in by_bar:
                end_at -= sum(sizes)
                end_bar += 1
                em = by_bar[end_bar]
                sizes = [l for _, l in chord_lengths(em, 0)]
            ev = em.find('voice')
            et = chord_at(em, end_at)
            end_sp = ET.Element('Spanner', type='HairPin')
            pv = ET.SubElement(end_sp, 'prev')
            loc = ET.SubElement(pv, 'location')
            ET.SubElement(loc, 'fractions').text = f'-{length.numerator}/{length.denominator}'
            ev.insert(list(ev).index(et) if et is not None else len(ev), end_sp)
        elif what == 'fermata':
            # On every staff of the bar, over the top voice and under the lower, as printed.
            for st_ in staffs:
                for m2, n2 in zip(st_.findall('Measure'), nums):
                    if n2 != mk['bar']:
                        continue
                    for vi, v2 in enumerate(m2.findall('voice')[:2]):
                        t2 = chord_at_voice(m2, vi, mk['at'])
                        if t2 is None:
                            continue
                        idx = list(v2).index(t2)
                        if any(x.tag == 'Fermata' for x in list(v2)[max(0, idx - 3):idx]):
                            continue  # the file has it already
                        f = ET.Element('Fermata')
                        ET.SubElement(f, 'subtype').text = 'fermataAbove' if vi == 0 else 'fermataBelow'
                        v2.insert(idx, f)
                    break
        elif what.startswith('text:'):
            st = ET.Element('StaffText')
            tx = ET.SubElement(st, 'text')
            b = ET.SubElement(tx, 'b')
            i = ET.SubElement(b, 'i')
            i.text = what[5:]
            v.insert(at_index, st)


def hide_staff(score, spec, info, nums):
    """A voice's staff left out where the sheet prints it empty: those bars' notes hidden, the staff hidden as empty."""
    staffs = [s for s in score.findall('Staff') if s.find('Measure') is not None]
    for name, a, b in spec.get('hide_staff', []):
        p = next(x for x in info if x['name'] == name)
        st = staffs[p['mstaff']]
        for m, n in zip(st.findall('Measure'), nums):
            if a <= n <= b:
                for v in m.findall('voice'):
                    for el in list(v):
                        if el.tag in ('Chord', 'Rest'):
                            vis = el.find('visible')
                            if vis is None:
                                vis = ET.Element('visible')
                                el.insert(0, vis)
                            vis.text = '0'



def bar_lengths(staff):
    """Each measure's length in whole notes: its own (`len`, a pickup or split bar) or its time signature's."""
    out, sig = [], Fraction(1)
    for m in staff.findall('Measure'):
        ts = m.find('.//TimeSig')
        if ts is not None and ts.findtext('sigN'):
            sig = Fraction(int(ts.findtext('sigN')), int(ts.findtext('sigD')))
        out.append(Fraction(m.get('len')) if m.get('len') else sig)
    return out


def staff_events(staff, voice):
    """A voice's chords and rests through the staff, each with its start (whole notes from the beginning) and its
    bar's index."""
    out, t = [], Fraction(0)
    for k, (m, bar) in enumerate(zip(staff.findall('Measure'), bar_lengths(staff))):
        tv = t
        for el, length in chord_lengths(m, voice):
            out.append((el, tv, k))
            tv += length if el.findtext('durationType') != 'measure' else bar
        t += bar
    return out


def tied_on(chord):
    notes = chord.findall('Note')
    return bool(notes) and all(n.find("Spanner[@type='Tie']/prev") is not None for n in notes)


def onsets_of(staff, voice):
    """The moments a voice of a staff starts a syllable, and the bars it has words in."""
    ev = staff_events(staff, voice)
    return ({t for el, t, k in ev if el.tag == 'Chord' and el.find('Lyrics') is not None},
            {k for el, t, k in ev if el.tag == 'Chord' and el.find('Lyrics') is not None})


def melisma_slurs(staff, voices, fallback=None):
    """Slurs where a syllable is sung across several notes, as vocal music is engraved: a note that starts no
    syllable and is not tied on is slurred, with the notes before it, to the note that began its syllable.

    Each voice, bar by bar, sings the words under it: its own where it has them, else its staff's first voice's,
    else (fallback: the top staff's onsets and worded bars) those printed above, but only where it moves with them
    (every syllable there falls on one of its notes or in one of its rests). In a bar with none of these the file's
    own slurs stay; elsewhere they give way."""
    events = {v: staff_events(staff, v) for v in voices}
    onsets = {v: onsets_of(staff, v)[0] for v in voices}
    worded = {v: onsets_of(staff, v)[1] for v in voices}
    if fallback is not None:
        onsets['top'], worded['top'] = fallback
    lead = voices[0]

    def source(v, k):
        if k in worded[v]:
            return v, 'own'
        if k in worded[lead]:
            return (lead, 'own') if lead == v else (lead, 'moves')
        if 'top' in worded and k in worded['top']:
            starts = {t for el, t, kk in events[v] if kk == k and el.tag == 'Chord'}
            rests = [(t, t2) for (el, t, kk), (_, t2, _) in zip(events[v], events[v][1:] + [(None, None, None)])
                     if kk == k and el.tag == 'Rest' and t2 is not None]
            bar = [t for el, t, kk in events[v] if kk == k]
            lo, hi = (min(bar), max(bar)) if bar else (0, 0)
            sy = [t for t in onsets['top'] if lo <= t <= hi]
            if all(t in starts or any(a <= t < b for a, b in rests) for t in sy):
                return 'top', 'moves'
        return None

    for v in voices:
        drop = set()
        for el, t, k in events[v]:
            for sp in el.findall("Spanner[@type='Slur']"):
                nx = sp.find('next/location/fractions')
                if nx is not None and source(v, k) is not None:
                    drop.add((t, t + Fraction(nx.text)))
        for el, t, k in events[v]:
            for sp in el.findall("Spanner[@type='Slur']"):
                nx = sp.find('next/location/fractions')
                pv = sp.find('prev/location/fractions')
                if nx is not None and (t, t + Fraction(nx.text)) in drop:
                    el.remove(sp)
                elif pv is not None and (t + Fraction(pv.text), t) in drop:
                    el.remove(sp)
        run = []

        def close():
            if len(run) > 1:
                (c0, t0), (c1, t1) = run[0], run[-1]
                f = t1 - t0
                for c, kind, frac in ((c0, 'next', f), (c1, 'prev', -f)):
                    sp = ET.Element('Spanner', type='Slur')
                    if kind == 'next':
                        ET.SubElement(sp, 'Slur')
                    loc = ET.SubElement(ET.SubElement(sp, kind), 'location')
                    ET.SubElement(loc, 'fractions').text = f'{frac.numerator}/{frac.denominator}'
                    c.insert(0, sp)

        for el, t, k in events[v]:
            if el.tag == 'Rest':
                close()
                run = []
                continue
            if tied_on(el):
                continue
            got = source(v, k)
            if got is None:
                close()
                run = []
                continue
            src, how = got
            if how != 'own':
                # A voice singing words printed under another: its slurs are copied from the sheet (slur:), as an
                # engraver places them by ear; none are guessed.
                close()
                run = []
                continue
            # Under its own words a note joins a melisma only where the words hold a syllable onto it.
            starts = el.find('Lyrics') is not None
            held = id(el) in HELD
            if starts:
                close()
                run = [(el, t)]
            elif held and run:
                run.append((el, t))
            else:
                close()
                run = []
        close()


def untie_mscx(score, spec, info, nums):
    """Ties the choir's file has where the sheet has none."""
    staffs = [s for s in score.findall('Staff') if s.find('Measure') is not None]
    for name, bars in spec.get('untie', []):
        p = next(x for x in info if x['name'] == name)
        voice = (int(p['voice']) - 1) % 4
        ms = staffs[p['mstaff']].findall('Measure')
        for k, (m, n) in enumerate(zip(ms, nums)):
            if n not in bars:
                continue
            vs = m.findall('voice')
            if voice < len(vs):
                for note in vs[voice].iter('Note'):
                    for sp in note.findall("Spanner[@type='Tie']"):
                        note.remove(sp)
            # a tie from the bar's last note ends on the next bar's first chord
            if k + 1 < len(ms):
                nv = ms[k + 1].findall('voice')
                first = next((c for c in nv[voice] if c.tag == 'Chord'), None) if voice < len(nv) else None
                if first is not None:
                    for note in first.findall('Note'):
                        for sp in note.findall("Spanner[@type='Tie']"):
                            if sp.find('prev') is not None:
                                note.remove(sp)


def slur_pairs(staff, voice):
    """A voice's slurs as (start, end) moments."""
    out = []
    for el, t, k in staff_events(staff, voice):
        for sp in el.findall("Spanner[@type='Slur']"):
            nx = sp.find('next/location/fractions')
            if nx is not None:
                out.append((t, t + Fraction(nx.text)))
    return out


def copy_slurs(part_staff, pairs):
    """A part's slurs made the main score's for its voice."""
    ev = staff_events(part_staff, 0)
    for el, t, k in ev:
        for sp in el.findall("Spanner[@type='Slur']"):
            el.remove(sp)
    at = {t: el for el, t, k in ev if el.tag == 'Chord'}
    for t0, t1 in pairs:
        if t0 in at and t1 in at:
            f = t1 - t0
            for c, kind, frac in ((at[t0], 'next', f), (at[t1], 'prev', -f)):
                sp = ET.Element('Spanner', type='Slur')
                if kind == 'next':
                    ET.SubElement(sp, 'Slur')
                loc = ET.SubElement(ET.SubElement(sp, kind), 'location')
                ET.SubElement(loc, 'fractions').text = f'{frac.numerator}/{frac.denominator}'
                c.insert(0, sp)


def slurs_mscx(score, spec, info, nums):
    """The sheet's slurs for voices without words of their own."""
    staffs = [s for s in score.findall('Staff') if s.find('Measure') is not None]
    starts, t = {}, Fraction(0)
    for bar, n in zip(bar_lengths(staffs[0]), nums):
        starts.setdefault(n, t)
        t += bar
    for name, (b1, a1), (b2, a2) in spec.get('slurs', []):
        p = next(x for x in info if x['name'] == name)
        voice = (int(p['voice']) - 1) % 4
        t0 = starts[b1] + a1
        t1 = t0 + a2 if b2 is None else starts[b2] + a2
        at = {tt: el for el, tt, k in staff_events(staffs[p['mstaff']], voice) if el.tag == 'Chord'}
        if t0 not in at or t1 not in at:
            raise SystemExit(f'slur {name} {b1}+{a1}: no note there')
        f = t1 - t0
        for c, kind, frac in ((at[t0], 'next', f), (at[t1], 'prev', -f)):
            sp = ET.Element('Spanner', type='Slur')
            if kind == 'next':
                ET.SubElement(sp, 'Slur')
            loc = ET.SubElement(ET.SubElement(sp, kind), 'location')
            ET.SubElement(loc, 'fractions').text = f'{frac.numerator}/{frac.denominator}'
            c.insert(0, sp)
