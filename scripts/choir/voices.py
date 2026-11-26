"""Splits a choir song's full score into a part per voice.

The input is the song's full score as MuseScore exports it to MusicXML (any layout: two voices on a staff, one voice
per staff, or two voices written as one chord). Each voice becomes its own part (Soprano, Alto, Tenor, Bass; for the
men's choir Tenor 1, Tenor 2, Baritone, Bass), on its own staff with the usual clef, playing piano. A bar where a staff
holds one line (the voices in unison) gives that line to both its voices. Words: each part keeps its own; a note
without words takes those of a note starting at the same moment in another voice, the nearest voice first, so a lower
voice singing the same rhythm carries the text. Other scores of the song (often a voice's practice file with the
words) fill a part whose notes they match with their words.
"""

import copy
import sys
import xml.etree.ElementTree as ET
from fractions import Fraction

from common import VOICES, midi

# Each voice: name, abbreviation, its part's clef sign, line and octave change.
NAMES = {kind: [(name, abbr, clef[0], clef[1], clef[2]) for name, abbr, clef, _ in vs] for kind, vs in VOICES.items()}
MIDDLE = {kind: [v[3] for v in vs] for kind, vs in VOICES.items()}
# Headings MuseScore puts in a new score that the choir's files left unfilled.
PLACEHOLDERS = {'untertitel', 'subtitle', 'komponist', 'composer', 'texter', 'lyricist', 'titel', 'title', 'subtitlu',
                'compozitor', 'textier'}


class Event:
    """A chord or rest of one voice: when it starts, how long, its notes (top first)."""

    def __init__(self, start, dur, notes, rest):
        self.start, self.dur, self.notes, self.rest = start, dur, notes, rest


def read_voices(part):
    """Per measure: its attributes and marks, each with the moment it stands at, and its events by (staff, voice)."""
    measures = []
    div = 1
    for m in part.findall('measure'):
        t = Fraction(0)
        head, events = [], {}
        last = None
        for el in m:
            if el.tag == 'attributes':
                if el.findtext('divisions'):
                    div = int(el.findtext('divisions'))
                head.append((el, t))
            elif el.tag in ('direction', 'harmony', 'print', 'barline', 'sound'):
                head.append((el, t))
            elif el.tag == 'backup':
                t -= Fraction(int(el.findtext('duration')), div)
            elif el.tag == 'forward':
                t += Fraction(int(el.findtext('duration')), div)
            elif el.tag == 'note':
                if el.find('grace') is not None:
                    continue
                key = (el.findtext('staff') or '1', el.findtext('voice') or '1')
                dur = Fraction(int(el.findtext('duration') or 0), div)
                if el.find('chord') is not None and last is not None:
                    last.notes.append(el)
                    continue
                ev = Event(t, dur, [el], el.find('rest') is not None)
                events.setdefault(key, []).append(ev)
                last = ev
                t += dur
        for evs in events.values():
            for ev in evs:
                ev.notes.sort(key=lambda n: -(midi(n) or 0))
        measures.append((m, head, events, div))
    return measures


def lines_of(score):
    """The voices of the score, top to bottom: a list of (part index, staff, voice, which note of a chord)."""
    found = []
    for pi, part in enumerate(score.findall('part')):
        for m, head, events, div in read_voices(part):
            for (staff, voice), evs in events.items():
                width = max(len(e.notes) for e in evs if not e.rest) if any(not e.rest for e in evs) else 0
                for k in range(width):
                    if (pi, staff, voice, k) not in found:
                        found.append((pi, staff, voice, k))
    return found


def pitch_mean(score, line):
    pi, staff, voice, k = line
    ps = []
    for m, head, events, div in read_voices(score.findall('part')[pi]):
        for ev in events.get((staff, voice), []):
            if not ev.rest and len(ev.notes) > k:
                ps.append(midi(ev.notes[k]))
    return sum(ps) / len(ps) if ps else 0


def clef_of(score):
    """Each staff's first clef: (sign, octave change), by (part index, staff)."""
    out = {}
    for pi, part in enumerate(score.findall('part')):
        for c in part.iter('clef'):
            key = (pi, c.get('number') or '1')
            if key not in out:
                out[key] = (c.findtext('sign'), int(c.findtext('clef-octave-change') or 0))
    return out


def empty_staves(score):
    """Staves of the score holding no note at all (a file left unfinished), by their part's name."""
    out = []
    names = {sp.get('id'): (sp.findtext('part-name') or '').strip() for sp in score.iter('score-part')}
    for part in score.findall('part'):
        count = max([int(x.text) for x in part.iter('staves')] or [1])
        sounding = {n.findtext('staff') or '1' for n in part.iter('note') if n.find('rest') is None}
        for st in range(1, count + 1):
            if str(st) not in sounding:
                name = names.get(part.get('id')) or 'unnamed'
                out.append(f'the {name} staff' + (f' {st}' if count > 1 else ''))
    return out


def staff_lines(score):
    """Group the score into its staves, each with the (voice, chord note) lines it carries, top staff first."""
    staves = {}
    for line in lines_of(score):
        staves.setdefault((line[0], line[1]), []).append(line)
    for key in staves:
        staves[key].sort(key=lambda ln: -pitch_mean(score, ln))
    return [staves[k] for k in sorted(staves)]


def plan(score):
    """Which source line each of the four parts reads, staff by staff: [(staff key, [line, ...])]. Four lines on any
    number of staves give one each; on two staves, a staff with one line gives it to both its voices (unison)."""
    staves = staff_lines(score)
    empty = empty_staves(score)
    if empty:
        raise SystemExit('unfinished: ' + ' and '.join(empty) + (' have' if len(empty) > 1 else ' has') + ' no notes')
    if sum(len(s) for s in staves) == 4 and all(len(s) <= 2 for s in staves):
        return [(s[0][:2], s) for s in staves], [len(s) for s in staves]
    if len(staves) == 2:
        return [(s[0][:2], [s[0], s[1] if len(s) > 1 else s[0]]) for s in staves], [2, 2]
    raise SystemExit(f'unusual layout: {len(staves)} staves holding {sum(len(s) for s in staves)} voices')


def voice_events(events, line, fallback):
    """One part's events in a measure, each with the chord note it sings: the line's own, and where it has none (a bar
    or the part of a bar its staff writes as one line) its staff's other voice."""
    pi, staff, voice, k = line
    own = [e for e in events.get((staff, voice), []) if not (e.rest and e.notes[0].get('print-object') == 'no')]
    out = [(e, k) for e in own]
    if fallback is not None:
        covered = [(e.start, e.start + e.dur) for e in own]
        for e in events.get((fallback[1], fallback[2]), []):
            if not any(a < e.start + e.dur and e.start < b for a, b in covered):
                out.append((e, fallback[3]))
    out.sort(key=lambda p: p[0].start)
    return out


def build(score, kind, sources):
    parts = score.findall('part')
    per_staff, widths = plan(score)
    names = NAMES[kind]
    out = ET.Element('score-partwise', version='4.0')
    for tag in ('work', 'movement-number', 'movement-title', 'identification', 'defaults', 'credit'):
        for el in score.findall(tag):
            if ''.join(el.itertext()).strip().lower() in PLACEHOLDERS:
                continue
            el = copy.deepcopy(el)
            for parent in el.iter():
                for child in list(parent):
                    if (child.text or '').strip().lower() in PLACEHOLDERS:
                        parent.remove(child)
            out.append(el)
    plist = ET.SubElement(out, 'part-list')
    targets = []
    for (skey, lines) in per_staff:
        for j, line in enumerate(lines):
            other = lines[1 - j] if len(lines) == 2 else None
            targets.append((skey, line, other))
    if len(targets) != 4:
        raise SystemExit(f'{len(targets)} voices, not four')
    for i, (name, abbr, sign, cline, octv) in enumerate(names):
        sp = ET.SubElement(plist, 'score-part', id=f'P{i + 1}')
        ET.SubElement(sp, 'part-name').text = name
        ET.SubElement(sp, 'part-abbreviation').text = abbr
        si = ET.SubElement(sp, 'score-instrument', id=f'P{i + 1}-I1')
        ET.SubElement(si, 'instrument-name').text = 'Piano'
        ET.SubElement(si, 'instrument-sound').text = 'keyboard.piano'
        mi = ET.SubElement(sp, 'midi-instrument', id=f'P{i + 1}-I1')
        ET.SubElement(mi, 'midi-channel').text = str(i + 1)
        ET.SubElement(mi, 'midi-program').text = '1'
        ET.SubElement(mi, 'volume').text = '80'
    plist.insert(0, ET.Element('part-group', type='start', number='1'))
    plist[0].append(ET.Element('group-symbol'))
    plist[0][0].text = 'bracket'
    ET.SubElement(plist, 'part-group', type='stop', number='1')

    read = {pi: read_voices(p) for pi, p in enumerate(parts)}
    nmeas = len(read[0])
    built = []
    def mean_of(line, other):
        ps = []
        for m, head, events, div in read[line[0]]:
            ps += [midi(e.notes[min(k, len(e.notes) - 1)]) for e, k in voice_events(events, line, other) if not e.rest]
        return sum(ps) / len(ps) if ps else None

    # Two voices of a staff that come out upside down (the lower above the upper) change places.
    for j in range(0, 4, 1):
        if j + 1 < 4 and targets[j][0] == targets[j + 1][0]:
            hi, lo = mean_of(targets[j][1], targets[j][2]), mean_of(targets[j + 1][1], targets[j + 1][2])
            if hi is not None and lo is not None and lo > hi + 1:
                targets[j], targets[j + 1] = targets[j + 1], targets[j]

    # The octave each voice sounds in. A choir reads a voice of men on a plain treble staff an octave lower, and a
    # clef marked an octave up (as a piano would play it) likewise; then a staff whose voices still average an octave
    # away from where those voices sing is moved there, its voices together.
    staff_clefs = clef_of(score)
    shifts = []
    for i, (skey, line, other) in enumerate(targets):
        sign_, change = staff_clefs.get((line[0], line[1]), ('G', 0))
        men_voice = kind == 'men' and i < 2 or kind == 'mixed' and i == 2
        shifts.append(-1 if change > 0 or (men_voice and sign_ == 'G' and change == 0) else 0)
    for skey in dict.fromkeys(t[0] for t in targets):
        idx = [i for i, t in enumerate(targets) if t[0] == skey]
        ms = [mean_of(targets[i][1], targets[i][2]) for i in idx]
        if any(m is None for m in ms):
            continue
        have = sum(m + 12 * shifts[i] for m, i in zip(ms, idx)) / len(idx)
        want = sum(MIDDLE[kind][i] for i in idx) / len(idx)
        if abs(want - have) >= 8:
            for i in idx:
                shifts[i] += round((want - have) / 12)
    if any(shifts):
        print('octave moved:', ', '.join(f'{names[i][0]} {s:+d}' for i, s in enumerate(shifts) if s), file=sys.stderr)
    for i, (skey, line, other) in enumerate(targets):
        name, abbr, sign, cline, octv = names[i]
        part = ET.SubElement(out, 'part', id=f'P{i + 1}')
        src = read[line[0]]
        last = {}
        for mi in range(nmeas):
            m, head, events, div = src[mi]
            nm = ET.SubElement(part, 'measure', number=m.get('number'))
            for k, v in m.attrib.items():
                if k in ('implicit',):
                    nm.set(k, v)
            marks = []
            for h, at in head:
                if h.tag == 'print' and mi != 0:
                    continue
                if h.tag == 'direction' and h.findtext('staff') not in (None, line[1]):
                    continue
                if h.tag == 'direction' and i != 0 and (h.find('.//metronome') is not None
                                                         or h.find('sound[@tempo]') is not None):
                    continue
                el = copy.deepcopy(h)
                for s in el.findall('staff') + el.findall('offset'):
                    el.remove(s)
                if el.tag == 'attributes':
                    for c in el.findall('staves'):
                        el.remove(c)
                    # A key or time is written where it changes, not again in every bar as some files have it.
                    for tag in ('key', 'time'):
                        for c in el.findall(tag):
                            sig = ET.tostring(c)
                            if last.get(tag) == sig:
                                el.remove(c)
                            last[tag] = sig
                    clefs = el.findall('clef')
                    for c in clefs:
                        el.remove(c)
                    if clefs or mi == 0:
                        c = ET.Element('clef')
                        ET.SubElement(c, 'sign').text = sign
                        ET.SubElement(c, 'line').text = str(cline)
                        if octv:
                            ET.SubElement(c, 'clef-octave-change').text = str(octv)
                        pos = [x.tag for x in el].index('time') + 1 if el.find('time') is not None else len(el)
                        el.insert(pos, c)
                marks.append((el, at))
            t = Fraction(0)

            def advance(to, now):
                # Marks stand where the source has them: each is written once the part reaches its moment.
                while marks and marks[0][1] <= to:
                    el, at = marks.pop(0)
                    if at > now:
                        fw = ET.SubElement(nm, 'forward')
                        ET.SubElement(fw, 'duration').text = str(int((at - now) * div))
                        now = at
                    nm.append(el)
                if to > now:
                    fw = ET.SubElement(nm, 'forward')
                    ET.SubElement(fw, 'duration').text = str(int((to - now) * div))
                return to

            for ev, k in voice_events(events, line, other):
                if ev.start < t:
                    continue
                t = advance(ev.start, t)
                t = ev.start + ev.dur
                src_note = ev.notes[min(k, len(ev.notes) - 1)]
                n = copy.deepcopy(src_note)
                for tag in ('chord', 'staff', 'stem'):
                    for c in n.findall(tag):
                        n.remove(c)
                for tag in ('default-x', 'default-y', 'print-object', 'relative-y', 'relative-x'):
                    n.attrib.pop(tag, None)
                n.find('voice').text = '1'
                if shifts[i] and n.find('pitch/octave') is not None:
                    n.find('pitch/octave').text = str(int(n.findtext('pitch/octave')) + shifts[i])
                if ev.rest and n.find('rest') is not None:
                    n.find('rest').attrib.clear()
                for d in n.findall('rest/display-step') + n.findall('rest/display-octave'):
                    n.find('rest').remove(d)
                built.append((i, mi, ev.start, n, ev.rest))
                nm.append(n)
            if marks:
                advance(marks[-1][1], t)
        fill_words_from(part, sources, i)
    share_words(out, built)
    # Which source staff and voice each part reads, and the octaves it was moved: the main score is corrected and its
    # parts are tied to its tracks from these.
    info = [dict(name=names[i][0], part=t[1][0], staff=t[1][1], voice=t[1][2], upper=(j == 0), shift=shifts[i],
                 clef=staff_clefs.get((t[1][0], t[1][1]), ('G', 0)))
            for i, t in enumerate(targets) for j in [[x for x in targets if x[0] == t[0]].index(t)]]
    return out, info


def words(note):
    return [l for l in note.findall('lyric') if l.findtext('text')]


def share_words(out, built):
    """A note without words takes those of a note starting at the same moment in the nearest other voice."""
    index = {}
    for i, mi, start, n, rest in built:
        if not rest and n.find('tie[@type="stop"]') is None:
            index[(i, mi, start)] = n
    order = {0: [1, 2, 3], 1: [0, 2, 3], 2: [3, 1, 0], 3: [2, 1, 0]}
    for i, mi, start, n, rest in built:
        if rest or words(n) or n.find('tie[@type="stop"]') is not None:
            continue
        for j in order[i]:
            other = index.get((j, mi, start))
            if other is not None and words(other):
                for l in words(other):
                    lc = copy.deepcopy(l)
                    for a in ('default-x', 'default-y', 'relative-y', 'relative-x', 'placement'):
                        lc.attrib.pop(a, None)
                    pos = len(n)
                    for t, x in enumerate(n):
                        if x.tag in ('notations',):
                            pos = t + 1
                    n.insert(pos, lc)
                break


def note_seq(part_el):
    seq = []
    for n in part_el.iter('note'):
        if n.find('rest') is None and n.find('chord') is None and n.find('grace') is None:
            seq.append(n)
    return seq


def fill_words_from(part, sources, i):
    """Words for a part with none, from another score of the song holding the same notes with words."""
    mine = note_seq(part)
    if not mine or any(words(n) for n in mine):
        return
    key = [midi(n) % 12 for n in mine]
    for src in sources:
        for sp in src.findall('part'):
            for staff_voice in {(n.findtext('staff') or '1', n.findtext('voice') or '1') for n in sp.iter('note')}:
                theirs = [n for n in note_seq(sp) if (n.findtext('staff') or '1', n.findtext('voice') or '1') == staff_voice]
                if [midi(n) % 12 for n in theirs] == key and any(words(n) for n in theirs):
                    for a, b in zip(mine, theirs):
                        for l in words(b):
                            lc = copy.deepcopy(l)
                            for at in ('default-x', 'default-y', 'relative-y', 'relative-x', 'placement'):
                                lc.attrib.pop(at, None)
                            a.append(lc)
                    return
