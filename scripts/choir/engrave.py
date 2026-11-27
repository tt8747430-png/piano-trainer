"""The made score in MuseScore's own file (.mscx), corrected to its printed sheet: the words under each voice, the
title and names, the line and page breaks, the marks, ties and hidden staves. The slurs are in slurs.py."""

import xml.etree.ElementTree as ET
from fractions import Fraction

from common import DURATIONS, ORDER, find_voice, hide, main_name, read_mscz, staves, voice_of
from words import Tied, place

DYNAMICS = ('ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff', 'sf', 'sfz')


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


def lyrics_mscx(staff, voice, block, nums, clear=True, held_chords=None):
    """Writes a block's words under a voice of a staff of the main score, in place of any it had. The bar numbers
    are the top staff's: only it marks a pickup bar. The chords a syllable is held onto are added to `held_chords`,
    for slurring each melisma as written."""
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
        for chord, text, kind, holds in place(slots, tokens, held_chords):
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
    staffs = staves(score)
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
    """The title and names, line and page breaks, beams, texts and the hidden tempo, in the main score."""
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
            # where the house style puts it, on the line under the title (a file's own alignment, "left,top", put
            # the words' author beside the title: songs 9 and 10)
            for a in t.findall('align'):
                t.remove(a)
        else:
            t = ET.SubElement(vb, 'Text')
            # MuseScore 4 names the words' author's style "poet" (a "lyricist" text is dropped on reading: song 11)
            ET.SubElement(t, 'style').text = {'composer': 'composer', 'lyricist': 'poet'}[role]
            tx = ET.SubElement(t, 'text')
        tx.text = spec[role]
    staffs = staves(score)
    first = staffs[0]
    measures = first.findall('Measure')
    nums = bar_numbers(measures, spec.get('count_pickup'))
    if spec.get('count_pickup'):
        # The pickup counts as bar 1; a split bar later on stays uncounted.
        for st in staffs:
            first_m = st.find('Measure')
            for el in first_m.findall('irregular'):
                first_m.remove(el)
    if spec['systems']:
        # The sheet's lines and pages in place of the file's.
        for m in measures:
            for b in m.findall('LayoutBreak'):
                m.remove(b)
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
    if not spec.get('beams'):
        unbeam(staffs, sung_bars(staffs, spec))
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
            hide(t)


def sung_bars(staffs, spec=None):
    """The bars some staff sings in (a bar sung by one voice is sung by all), and the bars the sheet prints as sung
    though it gives them no words (`flagged:`, a choir humming)."""
    sung = {k for st in staffs for k, m in enumerate(st.findall('Measure')) if m.find('.//Lyrics') is not None}
    if spec and spec.get('flagged'):
        nums = bar_numbers(staffs[0].findall('Measure'), spec.get('count_pickup'))
        sung |= {k for k, n in enumerate(nums) if n in spec['flagged']}
    return sung


def unbeam(staffs, sung=None):
    """Each eighth and sixteenth on its own flag, as the choir's sheets print a sung line (a triplet keeps its beam):
    in every sung bar (only a bar no one sings in, an instrumental one, keeps its beams)."""
    sung = sung_bars(staffs) if sung is None else sung
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


def chord_at(measure, at, voice=0):
    """The first chord or rest of a voice of the measure that starts at `at` (a fraction of a whole note) or later."""
    t = Fraction(0)
    for el, length in chord_lengths(measure, voice):
        if t >= at:
            return el
        t += length
    return None


def marks_mscx(score, spec, nums):
    """Dynamics, hairpins, fermatas and texts on the top staff, where the sheet prints them."""
    staffs = staves(score)
    by_bar = {}
    for m, n in zip(staffs[0].findall('Measure'), nums):
        by_bar.setdefault(n, m)
    for mk in spec.get('marks', []):
        m = by_bar[mk['bar']]
        v = m.find('voice')
        target = chord_at(m, mk['at'])
        at_index = list(v).index(target) if target is not None else len(v)
        what = mk['what']
        if what in DYNAMICS:
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
        elif what.split('/')[0] == 'fermata':
            # On every staff of the bar, over the top voice and under the lower, as printed; or over one voice
            # (fermata/Bass: the voice's place on the two staves, its staff's upper or lower voice).
            only = None
            if '/' in what:
                k = next(names.index(what.split('/')[1]) for names in ORDER.values() if what.split('/')[1] in names)
                only = (k // 2, k % 2)
            for si, st_ in enumerate(staffs):
                if only is not None and si != only[0]:
                    continue
                for m2, n2 in zip(st_.findall('Measure'), nums):
                    if n2 != mk['bar']:
                        continue
                    for vi, v2 in enumerate(m2.findall('voice')[:2]):
                        if only is not None and vi != only[1]:
                            continue
                        t2 = chord_at(m2, mk['at'], vi)
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
            if any(o is not mk and (o['bar'], o['at']) == (mk['bar'], mk['at']) and o['what'] in DYNAMICS
                   for o in spec['marks']):
                # Beside the dynamic at its note, as a sheet prints `f Marciale` (stacked above it otherwise).
                ET.SubElement(st, 'offset', x='2.5', y='0')
            tx = ET.SubElement(st, 'text')
            b = ET.SubElement(tx, 'b')
            i = ET.SubElement(b, 'i')
            i.text = what[5:]
            v.insert(at_index, st)


def hide_staff(score, spec, info, nums):
    """A voice's staff left out where the sheet prints it empty: those bars' notes hidden, the staff hidden as empty."""
    staffs = staves(score)
    for name, a, b in spec.get('hide_staff', []):
        p = find_voice(info, name)
        st = staffs[p['mstaff']]
        for m, n in zip(st.findall('Measure'), nums):
            if a <= n <= b:
                for v in m.findall('voice'):
                    for el in list(v):
                        if el.tag in ('Chord', 'Rest'):
                            hide(el)


def untie_mscx(score, spec, info, nums):
    """Ties the choir's file has where the sheet has none."""
    staffs = staves(score)
    for name, bars in spec.get('untie', []):
        p = find_voice(info, name)
        voice = voice_of(p)
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


def notes(path, staff, voice):
    """A voice's sung notes bar by bar, for writing its words."""
    names = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
    files = read_mscz(path)
    staffs = staves(ET.fromstring(files[main_name(files)]).find('Score'))
    for m, n in zip(staffs[staff].findall('Measure'), bar_numbers(staffs[0].findall('Measure'))):
        cs = sung_chords(m, voice)
        print(n, len(cs), ' '.join(names[int(c.find('Note').findtext('pitch')) % 12] for c in cs))
