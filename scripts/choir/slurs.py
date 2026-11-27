"""Slurs in the made score: a voice's held syllables slurred from its words, the sheet's own slurs for a voice
without words of its own (`slur:` in match.txt), and each part's slurs made its voice's in the score."""

import xml.etree.ElementTree as ET
from fractions import Fraction

from common import find_voice, staves, voice_of
from engrave import chord_lengths


def add_slur(first, last, length):
    """A slur from one chord to another `length` (whole notes) later: MuseScore writes its start in the first and
    its end in the last."""
    for c, kind, frac in ((first, 'next', length), (last, 'prev', -length)):
        sp = ET.Element('Spanner', type='Slur')
        if kind == 'next':
            ET.SubElement(sp, 'Slur')
        loc = ET.SubElement(ET.SubElement(sp, kind), 'location')
        ET.SubElement(loc, 'fractions').text = f'{frac.numerator}/{frac.denominator}'
        c.insert(0, sp)


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


def melisma_slurs(staff, voices, held, fallback=None):
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
                add_slur(run[0][0], run[-1][0], run[-1][1] - run[0][1])

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
            if starts:
                close()
                run = [(el, t)]
            elif id(el) in held and run:
                run.append((el, t))
            else:
                close()
                run = []
        close()


def drop_slurs(staffs, bars):
    """No slur starting in these measures (by index), in any voice: the sheet draws none there."""
    for st in staffs:
        for v in range(4):
            for el, t, k in staff_events(st, v):
                if k not in bars:
                    continue
                for sp in el.findall("Spanner[@type='Slur']"):
                    if sp.find('next') is not None:
                        el.remove(sp)
                        nx = Fraction(sp.findtext('next/location/fractions'))
                        end = next((e for e, u, kk in staff_events(st, v) if u == t + nx and e.tag == 'Chord'), None)
                        for ep in (end.findall("Spanner[@type='Slur']") if end is not None else []):
                            if ep.find('prev') is not None and Fraction(ep.findtext('prev/location/fractions')) == -nx:
                                end.remove(ep)
                                break


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
            add_slur(at[t0], at[t1], t1 - t0)


def slurs_mscx(score, spec, info, nums):
    """The sheet's slurs for voices without words of their own."""
    staffs = staves(score)
    starts, t = {}, Fraction(0)
    for bar, n in zip(bar_lengths(staffs[0]), nums):
        starts.setdefault(n, t)
        t += bar
    for name, (b1, a1), (b2, a2) in spec.get('slurs', []):
        p = find_voice(info, name)
        voice = voice_of(p)
        t0 = starts[b1] + a1
        t1 = t0 + a2 if b2 is None else starts[b2] + a2
        at = {tt: el for el, tt, k in staff_events(staffs[p['mstaff']], voice) if el.tag == 'Chord'}
        if t0 not in at or t1 not in at:
            raise SystemExit(f'slur {name} {b1}+{a1}: no note there')
        add_slur(at[t0], at[t1], t1 - t0)
