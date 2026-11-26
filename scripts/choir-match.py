"""Makes a choir song's score match its printed sheet: the words, the title, the line and page breaks, the staff size.

Each song may hold a `match.txt` beside its files, written from the song's PDF and its page in the choir's book:

    title: 1 Binecuvântat să fie Domnul
    composer: Valer Bogdan             the name printed at the right, under the title
    spatium: 1.9                       staff space in mm (the printed size)
    systems: 1 5 9 13 16 | 20 22 25    first bar of each line; | starts a new page
    hide-empty-staves                  a staff with nothing to sing in a line is left out, as printed
    hide-tempo                         the tempo mark is not printed (it still sets the speed)
    hide-names                         no voice names before the staves
    staff-distance: 4.5                space between the staves, and system-distance: between the lines
    lyrics-size: 11                    the words' size in points (Arial, as printed)
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
import xml.etree.ElementTree as ET
import zipfile

VOICES = ['Soprano', 'Alto', 'Tenor', 'Bass', 'Tenor 1', 'Tenor 2', 'Baritone']


def parse(path):
    spec = dict(title=None, spatium=None, systems=[], hide_empty=False, hide_tempo=False, hide_names=False, blocks=[],
                texts=[], segno=None)
    block = None
    for raw in open(path, encoding='utf-8'):
        line = raw.split('#', 1)[0].rstrip() if not raw.lstrip().startswith(('1', '2', '3', '4', '5', '6')) else raw.rstrip()
        if not line.strip():
            continue
        m = re.match(r'\[(.+?)\]\s*$', line.strip())
        if m:
            words = m.group(1).split()
            italic = 'italic' in words
            name = ' '.join(w for w in words if w != 'italic')
            if name not in VOICES:
                raise SystemExit(f'{path}: unknown voice {name}')
            block = dict(voice=name, italic=italic, verses={})
            spec['blocks'].append(block)
            continue
        m = re.match(r'\s*(\d+):\s*(.*)$', line)
        if m and block is not None:
            block['verses'].setdefault(int(m.group(1)), []).extend(m.group(2).split())
            continue
        key, _, value = line.partition(':')
        key = key.strip()
        if key == 'title':
            spec['title'] = value.strip()
        elif key == 'composer':
            spec['composer'] = value.strip()
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

def bar_numbers(measures):
    """Each measure's number as printed: a measure marked irregular (a pickup) is not counted."""
    out, n = [], 0
    for m in measures:
        if m.findtext('irregular') != '1':
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
            pairs.append((order[pos][1], t[1], t[2]))
        pos += 1
    return pairs


def lyrics_mscx(staff, voice, block):
    """Writes a block's words under a voice of a staff of the main score, in place of any it had."""
    measures = staff.findall('Measure')
    nums = bar_numbers(measures)
    slots = {}
    for m, n in zip(measures, nums):
        slots.setdefault(n, []).extend(sung_chords(m, voice))
    for chords in slots.values():
        for c in chords:
            for l in c.findall('Lyrics'):
                c.remove(l)
    for verse, tokens in sorted(block['verses'].items()):
        for chord, text, kind in place(slots, tokens):
            ly = ET.Element('Lyrics')
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
    if spec.get('composer'):
        vb = next(score.iter('VBox'))
        texts = [t for t in vb.findall('Text') if t.findtext('style') == 'composer']
        if texts:
            t = texts[0]
            tx = t.find('text')
            for c in list(tx):
                tx.remove(c)
        else:
            t = ET.SubElement(vb, 'Text')
            ET.SubElement(t, 'style').text = 'composer'
            tx = ET.SubElement(t, 'text')
        tx.text = spec['composer']
    staffs = [s for s in score.findall('Staff') if s.find('Measure') is not None]
    first = staffs[0]
    measures = first.findall('Measure')
    nums = bar_numbers(measures)
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


# MusicXML, before the voices are split, so each part carries its words

def lyrics_xml(score, part_index, staff, voice, block):
    part = score.findall('part')[part_index]
    slots = {}
    n = 0
    for m in part.findall('measure'):
        if m.get('implicit') != 'yes':
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
        for note, text, kind in place(slots, tokens):
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
    st = [s for s in root.find('Score').findall('Staff') if s.find('Measure') is not None][staff]
    for m, n in zip(st.findall('Measure'), bar_numbers(st.findall('Measure'))):
        cs = sung_chords(m, voice)
        print(n, len(cs), ' '.join(names[int(c.find('Note').findtext('pitch')) % 12] for c in cs))


if __name__ == '__main__':
    if sys.argv[1] == 'notes':
        notes(sys.argv[2], int(sys.argv[3]), int(sys.argv[4]))
