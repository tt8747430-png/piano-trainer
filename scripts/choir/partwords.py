"""Each part from the main score as printed: its lines and pages, and its words: a voice sings its own words where it has them, and elsewhere,
bar by bar, the words of the voice it moves with, as a copyist writes a part.

The sheet prints the words once for the voices that share them (between the staves, or under one staff). A part's
notes are its own where its voice has a syllable or holds one (its lyric line, its slur, a tie); every other run of
notes, between rests and bar lines, takes the words of the voice whose notes start at the same moments over that
stretch: in song 1, bar 13, the tenors move with the sopranos and take their words, the altos with the basses' echo
and take theirs; in bar 38 the tenors sing their own "Miel Divin", then the sopranos' "ru-gă". Where no voice moves
exactly with it, a run takes the words of the voice whose syllables all fall on its notes, the most syllables first,
and the notes left over look to the others; a word comes whole from one voice. A note tied on takes no syllable, and a syllable taken over several notes
is slurred, as a vocal part's melismas are. Where the main score has no words in a bar,
the part keeps the words it was built with (a voice's own practice file may have them)."""

import copy
import xml.etree.ElementTree as ET
from fractions import Fraction

from common import main_name, read_mscz, staves, xml_bytes
from engrave import bar_numbers
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
        if el.tag == 'Rest' or mine.get(t) is not None or (run and run[-1][2] != k):
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
    for el, t, k in part:
        if el.tag != 'Chord' or k not in worded_bars:
            continue  # the main score has no words here: the part keeps its own (from a voice's own file)
        for ly in el.findall('Lyrics'):
            el.remove(ly)
        src = mine.get(t) or take.get(t)
        if src is None:
            continue
        if src is take.get(t):
            copied.add(id(el))
        at = next((i for i, c in enumerate(el) if c.tag == 'Note'), len(el))
        for ly in src.findall('Lyrics'):
            ly = copy.deepcopy(ly)
            for p in ly.findall('placement'):
                ly.remove(p)  # a part's words stand under its own staff
            el.insert(at, ly)
            at += 1
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


def apply(files, matched):
    """Every part of a made file (its members by name) given its words from the main score; for a song matched to
    its sheet, its slurs too: its voice's slurs in the score, and a slur over each syllable it takes from another
    voice and holds."""
    main = staves(ET.fromstring(files[main_name(files)]).find('Score'))
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
        layout(main[0], part)
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
