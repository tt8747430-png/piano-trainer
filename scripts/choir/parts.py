"""Each part from the main score as printed: its lines and pages, title frame, marks and tempo, and its words: a voice sings its own words where it has them, and elsewhere,
bar by bar, the words of the voice it moves with, as a copyist writes a part.

The sheet prints the words once for the voices that share them (between the staves, or under one staff). A part's
notes are its own where its voice has a syllable or holds one (its lyric line, its slur, a tie); every other run of
notes, between rests and its own syllables, takes the words of the voice whose notes start at the same moments over that
stretch: in song 1, bar 13, the tenors move with the sopranos and take their words, the altos with the basses' echo
and take theirs; in bar 38 the tenors sing their own "Miel Divin", then the sopranos' "ru-gă". Where no voice moves
exactly with it, a run takes the words of the voice whose syllables all fall on its notes, the most syllables first,
and the notes left over look to the others; a word comes whole from one voice. A note tied on takes no syllable, and a syllable taken over several notes
is slurred, as a vocal part's melismas are. Where the main score has no words in a bar,
the part keeps the words it was built with (a voice's own practice file may have them)."""

import copy
import xml.etree.ElementTree as ET
from fractions import Fraction

from common import hide, main_name, read_mscz, staves, xml_bytes
from engrave import bar_numbers, sung_bars, unbeam
from slurs import add_slur, copy_slurs, slur_pairs, staff_events, tied_on


def events(staff, voice):
    """A voice's chords and rests in order: (element, moment, bar index)."""
    return staff_events(staff, voice)


def held_until(chord, t):
    """Where a voice's own syllable stops being held: the end of its lyric line, or of a slur from its chord."""
    end = t
    for ly in chord.findall('Lyrics'):
        f = ly.findtext('ticks_f')
        if f:
            end = max(end, t + Fraction(f))
    for sp in chord.findall("Spanner[@type='Slur']/next/location/fractions"):
        end = max(end, t + Fraction(sp.text))
    return end


def nearest(track, tracks):
    """The other voices in the order a part looks to them: its staff's other voice, then the nearer staves."""
    return sorted((t for t in tracks if t != track), key=lambda t: (abs(t // 4 - track // 4), t // 4, t % 4))


def part_words(main_staffs, part_staff, track):
    """Rewrites a part's words from the main score; returns the chords given another voice's syllables."""
    voices = {}
    for si, st in enumerate(main_staffs):
        for v in range(4):
            ev = [(el, t, k) for el, t, k in events(st, v) if el.tag == 'Chord']
            if ev:
                voices[si * 4 + v] = ev
    worded_bars = {k for ev in voices.values() for el, t, k in ev if el.find('Lyrics') is not None}
    own = {t: el for el, t, k in voices.get(track, [])}
    part = events(part_staff, 0)
    # the voice's own slurs (the sheet's): the notes after a slur's first are held
    slurred = set()
    for t0, t1 in (slur_pairs(main_staffs[track // 4], track % 4) if track in voices else []):
        slurred |= {t for el, t, k in part if t0 < t <= t1}
    # the part's notes that are its own voice's: a syllable of its own, or held under one (to its last note)
    mine, held = {}, Fraction(-1)
    for el, t, k in part:
        o = own.get(t)
        if o is not None and o.find('Lyrics') is not None:
            mine[t] = o
            held = held_until(o, t)
        elif el.tag == 'Chord' and (t <= held or tied_on(el) or t in slurred):
            mine[t] = None
    # the rest, in runs between rests, own syllables and bar lines: each takes the words of the voice it moves with
    runs, run = [], []
    for el, t, k in part:
        if el.tag == 'Rest' or mine.get(t) is not None:
            if run:
                runs.append(run)
            run = []
        if el.tag == 'Chord' and t not in mine:
            run.append((el, t, k))
    if run:
        runs.append(run)
    take, take_from = {}, {}
    queue = [(run, set()) for run in runs]
    while queue:
        run, tried = queue.pop(0)
        moments = {t for el, t, k in run}
        lo, hi = run[0][1], run[-1][1]
        exact, partial, sequence = None, None, None
        for other in nearest(track, voices):
            if other in tried:
                continue
            inside = {t: el for el, t, k in voices[other] if lo <= t <= hi}
            words = {t for t, el in inside.items() if el.find('Lyrics') is not None}
            if not words:
                continue
            starts = {t for t, el in inside.items() if not tied_on(el)}
            if starts == moments:
                exact = (other, inside)
                break
            if words <= moments and (partial is None or len(words) > len(partial[2])):
                partial = (other, inside, words)
            if len(words) == len(moments) and sequence is None:
                # the same words in its own rhythm: one syllable to each of its notes, in order
                sequence = (other, dict(zip(sorted(moments), (inside[t] for t in sorted(words)))))
        chosen = exact or (partial[:2] if partial else None) or sequence
        if not chosen:
            # No voice fits the whole run (song 11: the altos' line runs unbroken from the first bar to the last):
            # it is tried again bar by bar, and within a bar each note takes the syllable another voice sings at its
            # moment, the nearest voice first.
            bars = {}
            for item in run:
                bars.setdefault(item[2], []).append(item)
            if len(bars) > 1:
                queue += [(b, tried) for b in bars.values()]
                continue
            for el, t, k in run:
                for other in nearest(track, voices):
                    src = next((e for e, u, kk in voices[other] if u == t), None)
                    if src is not None and src.find('Lyrics') is not None:
                        take[t], take_from[t] = src, other
                        break
            continue
        other, source = chosen
        covered, until = set(), Fraction(-1)
        for t in sorted(source):
            el = source[t]
            if el.find('Lyrics') is not None and t in moments:
                take[t] = el
                take_from[t] = other
                covered.add(t)
                until = held_until(el, t) if chosen is not sequence else t
            elif t <= until or tied_on(el):
                covered.add(t)
        # notes this voice neither sings words on nor holds look to the other voices again
        rest, part_run = [], []
        for item in run:
            if item[1] in covered:
                if part_run:
                    rest.append(part_run)
                part_run = []
            else:
                part_run.append(item)
        if part_run:
            rest.append(part_run)
        queue += [(r, tried | {other}) for r in rest]
    # whole words from one voice: a syllable that continues a word takes the word's earlier syllables from the same
    # voice, where that voice sings them on the part's notes (song 1, bar 15: the altos' "lă-u", not "lău u")
    order = [t for el, t, k in part if el.tag == 'Chord' and t not in mine]
    sung = {other: {t: el for el, t, k in ev if el.find('Lyrics') is not None} for other, ev in voices.items()}
    for i, t in enumerate(order):
        el = take.get(t)
        if el is None or el.find('Lyrics/syllabic') is None or el.findtext('Lyrics/syllabic') not in ('middle', 'end'):
            continue
        other, j = take_from[t], i - 1
        while j >= 0 and order[j] in take and take_from[order[j]] != other and order[j] in sung[other]:
            take[order[j]], take_from[order[j]] = sung[other][order[j]], other
            if sung[other][order[j]].findtext('Lyrics/syllabic') not in ('middle', 'end'):
                break
            j -= 1

    copied = set()
    last_from = None
    for el, t, k in part:
        if el.tag != 'Chord' or k not in worded_bars:
            continue  # the main score has no words here: the part keeps its own (from a voice's own file)
        for ly in el.findall('Lyrics'):
            el.remove(ly)
        src = mine.get(t) or take.get(t)
        if src is None and tied_on(el) and last_from is not None:
            # a tied note where the voice it moves with sings a verse on (a dashed tie: song 11, bar 20, "în-chi-na")
            src = next((e for e, u, kk in voices[last_from] if u == t and e.find('Lyrics') is not None), None)
        if src is None:
            continue
        if t in take_from:
            last_from = take_from[t]
        if src is take.get(t):
            copied.add(id(el))
        at = next((i for i, c in enumerate(el) if c.tag == 'Note'), len(el))
        for ly in src.findall('Lyrics'):
            ly = copy.deepcopy(ly)
            for p in ly.findall('placement'):
                ly.remove(p)  # a part's words stand under its own staff
            el.insert(at, ly)
            at += 1
    # A syllable taken from another voice holds its line only until the part's own next syllable, in any verse (the
    # sopranos hold "cit," while the altos sing on: song 9, bar 17, the altos' "cit," then "ești fe-ri-cit!").
    own_at = {t for t, o in mine.items() if o is not None}
    chords = [(el, t) for el, t, k in part if el.tag == 'Chord' and not tied_on(el)]
    for i, (el, t) in enumerate(chords):
        if id(el) not in copied:
            continue
        for ly in el.findall('Lyrics'):
            f = ly.find('ticks_f')
            if f is None:
                continue
            nxt = next((u for e, u in chords[i + 1:] if u in own_at and e.find('Lyrics') is not None), None)
            if nxt is None or t + Fraction(f.text) < nxt:
                continue
            last = max((u for e, u in chords[i + 1:] if u < nxt), default=None)
            if last is None:
                ly.remove(f)
            else:
                f.text = str(last - t)
    return copied


def melismas(part_staff, copied):
    """A slur over each syllable the part sings across several notes, where it took the syllable from another
    voice (its own syllables have their slurs from the score)."""
    run = []

    def close():
        if len(run) > 1 and id(run[0][0]) in copied and run[0][0].find("Spanner[@type='Slur']/next") is None:
            add_slur(run[0][0], run[-1][0], run[-1][1] - run[0][1])

    for el, t, k in staff_events(part_staff, 0):
        if el.tag == 'Rest' or el.find('Lyrics') is not None:
            close()
            run = [(el, t)] if el.tag == 'Chord' else []
        elif tied_on(el):
            continue
        elif run:
            run.append((el, t))
    close()


def layout(main_staff, part_staff):
    """A part's lines and pages as the main score's: the same bars start each line and page."""
    for mm, pm in zip(main_staff.findall('Measure'), part_staff.findall('Measure')):
        for b in pm.findall('LayoutBreak'):
            pm.remove(b)
        for i, b in enumerate(mm.findall('LayoutBreak')):
            pm.insert(i, copy.deepcopy(b))


MARKS = ('Dynamic', 'StaffText', 'Fermata')


def marks_of(staff, voice):
    """A voice's marks with the moment each stands at: dynamics, texts, hairpins and fermatas."""
    at = {id(el): t for el, t, k in staff_events(staff, voice)}
    out = []
    for m in staff.findall('Measure'):
        vs = m.findall('voice')
        if voice >= len(vs):
            continue
        pending = []
        for el in vs[voice]:
            if el.tag in MARKS or (el.tag == 'Spanner' and el.get('type') == 'HairPin'):
                pending.append(el)
            elif el.tag in ('Chord', 'Rest') and id(el) in at:
                out += [(at[id(el)], x) for x in pending]
                pending = []
    return out


def marks(main_staffs, part_staff, track):
    """The part's marks as the score's: the dynamics, hairpins and texts printed for the system (the top staff's,
    and its own staff's), and the fermatas over its own voice or printed once for its staff."""
    for v in part_staff.iter('voice'):
        for el in list(v):
            if el.tag in MARKS or (el.tag == 'Spanner' and el.get('type') == 'HairPin'):
                v.remove(el)
    wanted, seen = [], set()
    own = (main_staffs[track // 4], track % 4)
    sources = [(main_staffs[0], 0), (main_staffs[track // 4], 0), own]
    for st, v in dict.fromkeys(sources):
        for t, el in marks_of(st, v):
            if el.tag == 'Fermata' and (st, v) != own:
                continue
            key = (t, ET.tostring(el))
            if key not in seen:
                seen.add(key)
                wanted.append((t, el))
    # A fermata printed once over a staff (above its upper voice or below its lower) holds both its voices: the
    # voice without one of its own takes it, where it sings or rests at that moment too.
    held = {t for t, el in wanted if el.tag == 'Fermata'}
    for t, el in marks_of(own[0], 1 - own[1]):
        if el.tag == 'Fermata' and t not in held:
            held.add(t)
            wanted.append((t, el))
    slot = {t: el for el, t, k in staff_events(part_staff, 0)}
    parent = {id(c): v for v in part_staff.iter('voice') for c in v}
    for t, el in wanted:
        target = slot.get(t)
        if target is None:
            continue
        v = parent[id(target)]
        el = copy.deepcopy(el)
        for e in el.findall('eid') + el.findall('linkedTo'):
            el.remove(e)
        if el.tag == 'Fermata' and el.find('subtype') is not None:
            el.find('subtype').text = 'fermataAbove'  # a part's one voice: over the staff
        v.insert(list(v).index(target), el)


def header(main_score, part_score, name):
    """The part's title frame as the score's (title, composer, words' author), with the part's name."""
    main_box = next(main_score.iter('VBox'), None)
    box = next(part_score.iter('VBox'), None)
    if main_box is None or box is None:
        return
    for t in box.findall('Text'):
        box.remove(t)
    for t in main_box.findall('Text'):
        t = copy.deepcopy(t)
        # the style's alignment for each text (the words' author at the bottom left, under the part's name), never
        # a file's own (song 9's "left,top" put it over the part's name); a text moved where the sheet prints it
        # keeps its offset
        for e in t.findall('eid') + t.findall('linkedTo') + t.findall('align'):
            t.remove(e)
        box.append(t)
    label = ET.SubElement(box, 'Text')
    ET.SubElement(label, 'style').text = 'instrument_excerpt'
    ET.SubElement(label, 'text').text = name


def apply(files, spec):
    """Every part of a made file (its members by name) made from its main score: its lines and pages, its title
    frame, its marks, its tempo shown or hidden and its eighths flagged or beamed as the score's, its words; for a song matched to its sheet, its slurs
    too: its voice's slurs in the score, and a slur over each syllable it takes from another voice and holds."""
    main_score = ET.fromstring(files[main_name(files)]).find('Score')
    main = staves(main_score)
    owner = [(p.get('id'), sd.findtext('eid')) for p in main_score.findall('Part') for sd in p.findall('Staff')]
    for n in list(files):
        if not (n.startswith('Excerpts/') and n.endswith('.mscx')):
            continue
        root = ET.fromstring(files[n])
        score = root.find('Score')
        tl = score.find('Tracklist')
        if tl is None:
            continue
        part = staves(score)[0]
        track = int(tl.get('sTrack'))
        # The part's instrument is the score's instrument its voice belongs to, by id, as MuseScore makes a part from
        # a voice: under another id MuseScore adds that instrument, the whole staff, to the part when it opens it.
        score.find('Part').set('id', owner[track // 4][0])
        ipi = score.find('initialPartId')
        if ipi is None:
            ipi = ET.Element('initialPartId')
            score.insert(list(score).index(tl), ipi)
        ipi.text = owner[track // 4][0]
        # its staff linked to the score's staff, by the staff definition's element id, as MuseScore links them
        sdef = score.find('Part').find('Staff')
        link = sdef.find('linkedTo')
        if link is None:
            link = ET.Element('linkedTo')
            at = list(sdef).index(sdef.find('eid')) + 1 if sdef.find('eid') is not None else 0
            sdef.insert(at, link)
        link.text = owner[track // 4][1]
        # Its voice map as MuseScore reads it on opening: MuseScore 4.7 applies a part's Tracklist before it ties the
        # part's staff to its own staff of the score, against the score's first staff, so the voice is given by its
        # place within its staff (the basses, voice 2 of the second staff: sTrack 1). Opened, the part shows that
        # voice of its own staff, and MuseScore saves it as sTrack 5. (A file MuseScore saved this way loses the
        # choice on its next opening, MuseScore's own fault; the part still prints only its voice, as stored.)
        tl.set('sTrack', str(track % 4))
        matched = spec['matched']
        # Its bars counted as the score's (a pickup the sheet counts as bar 1 is counted in the part too).
        for pm, sm in zip(part.findall('Measure'), main[0].findall('Measure')):
            for el in pm.findall('irregular'):
                pm.remove(el)
            if sm.find('irregular') is not None:
                pm.insert(list(pm).index(pm.find('eid')) + 1 if pm.find('eid') is not None else 0,
                          copy.deepcopy(sm.find('irregular')))
        layout(main[0], part)
        header(main_score, score, score.findtext('name') or n.split('/')[1].split('_', 1)[1].replace('_', ' '))
        marks(main, part, track)
        if not spec.get('beams'):
            unbeam([part], sung_bars(main))
        if spec['hide_tempo']:
            for tempo in score.iter('Tempo'):
                hide(tempo)
        if matched:
            copy_slurs(part, slur_pairs(main[track // 4], track % 4))
        copied = part_words(main, part, track)
        if matched:
            melismas(part, copied)
        files[n] = xml_bytes(root)


def check(files):
    """What a part's words get wrong, verse by verse: a note that neither starts a syllable nor is held (by a tie, a
    slur or its syllable's line), and a slur over a note where every verse starts a new syllable (a slur for one
verse's held syllable, where another sings on, stands)."""
    main = staves(ET.fromstring(files[main_name(files)]).find('Score'))
    nums = bar_numbers(main[0].findall('Measure'))
    problems = []
    for n in sorted(files):
        if not (n.startswith('Excerpts/') and n.endswith('.mscx')):
            continue
        name = n.split('/')[1].split('_', 1)[1].replace('_', ' ')
        part = staves(ET.fromstring(files[n]).find('Score'))[0]
        verses = {ly.findtext('no') or '0' for ly in part.iter('Lyrics')}
        for verse in sorted(verses):
            held_any, slur_start, slur_end, started = (Fraction(-1),) * 3 + (False,)
            for el, t, k in events(part, 0):
                if el.tag == 'Rest':
                    held_any, started = Fraction(-1), False
                    continue
                mine = [ly for ly in el.findall('Lyrics') if (ly.findtext('no') or '0') == verse]
                if el.findall('Lyrics'):
                    started = True
                if mine:
                    every = {ly.findtext('no') or '0' for ly in el.findall('Lyrics')} == verses
                    if slur_start < t <= slur_end and every:
                        problems.append((name, nums[k], verse, 'a slur over a new syllable'))
                elif verse == '0' and not el.findall('Lyrics') and not tied_on(el) and \
                        not (t <= held_any or t <= slur_end) and started:
                    problems.append((name, nums[k], verse, 'a note with no syllable in any verse, not held'))
                if el.findall('Lyrics'):
                    held_any = max([held_any] + [held_until(el, t)])
                for f in el.findall("Spanner[@type='Slur']/next/location/fractions"):
                    slur_start, slur_end = t, max(slur_end, t + Fraction(f.text))
    return problems


def report(path):
    problems = check(read_mscz(path))
    for name, bar, verse, what in problems:
        print(f'{name} bar {bar}, verse {int(verse) + 1}: {what}')
    print(f'{len(problems)} problems')
