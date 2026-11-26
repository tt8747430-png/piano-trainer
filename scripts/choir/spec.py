"""A song's `match.txt`: what its printed sheet has that its files lack, written from the song's PDF and its page in
the choir's book. Every line is optional: the house template gives the rest (the title from the folder's name, no
voice names before the staves, the tempo set but not printed, template/house.mss for the look).

    title: 4 Ce poate fi mai minunat?  the title as printed, where it is not the folder's name (its punctuation)
    composer: Valer Bogdan             the name printed at the right, under the title
    lyricist: Valentin Popovici        the name printed at the left (the words' author)
    spatium: 1.4                       staff space in mm, only where the house size cannot keep the sheet's pages
    systems: 1 5 9 13 16 | 20 22 25    first bar of each line; | starts a new page
    hide-empty-staves                  a staff with nothing to sing in a line is left out, as printed
    show-tempo                         the tempo mark printed, as a sheet exported from MuseScore has it
    show-names                         the voice names printed before the staves
    lyrics-size: 10                    the words' size in points, only where the house size does not fit
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
                                       marks as printed: a dynamic (pp p mp mf f ff), a hairpin (< or > with its
                                       length in whole notes) at a bar (+ where in the bar), a fermata over every
                                       voice at that point, a bold italic text
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
    [Alto notes]                       a voice's notes, entered from the sheet where the files lack them
    1: @3 F4:4. Eb4:8 D4:4 r:4 @8 G4:2 r:4 u:4

Words are syllables in order, one per note the voice sings (a note that only continues a tie takes none, unless the
syllable starts with `^`, as where one verse holds and another sings on): `--` joins the syllables of a word, `_`
holds a syllable over the next note, `*` passes over a note that is not sung to these words (an instrumental note), a
syllable ending in `|` draws no line over the notes it holds (where the sheet prints none), `@N` moves to the first
note of bar N (as the bar is numbered on the page). `python3 scripts/choir notes <score.mscz> <staff> <voice>` lists
a voice's notes bar by bar, for writing the words against them.

Notes: `Eb4:8.` is a pitch and octave, its length (1 2 4 8 16 32) and dots; `r:4` a rest; `u:4` the note the
staff's other voice sings, in unison (one notehead, as printed; the voice's part takes that note); `~` after a
length ties to the next note; `t` after a length makes it a triplet's third.
"""

import os
import re
from fractions import Fraction

from common import VOICE_NAMES


def read(song_dir):
    """A song's spec: the house template's defaults, and its match.txt where it has one (`matched`)."""
    path = os.path.join(song_dir, 'match.txt')
    matched = os.path.exists(path)
    # An unmatched song keeps its file's own title (its number may stand apart from it).
    spec = dict(title=folder_title(song_dir) if matched else None, spatium=None, systems=[], hide_empty=False,
                hide_tempo=True, hide_names=True, blocks=[], texts=[], segno=None, notes=[], matched=matched)
    if not matched:
        return spec
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
            if name not in VOICE_NAMES:
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
        elif key == 'show-tempo':
            spec['hide_tempo'] = False
        elif key == 'repeat':
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
            for item in value.split(','):
                item = item.strip()
                bar, _, what = item.partition(' ')
                bar, _, at = bar.partition('+')
                spec.setdefault('marks', []).append(dict(bar=int(bar), at=Fraction(at) if at else Fraction(0),
                                                         what=what.strip()))
        elif key == 'slur':
            for item in value.split(','):
                parts = item.split()
                spec.setdefault('slurs', []).append((' '.join(parts[:-2]), point(parts[-2]), point(parts[-1])))
        elif key == 'untie':
            name, _, bars = value.strip().rpartition(' ')
            spec.setdefault('untie', []).append((name.strip(), [int(b) for b in bars.split(',')]))
        elif key == 'hide-staff':
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
            words = value.split()
            bar, place = int(words[0]), words[1]
            flags = [w for w in words[2:4] if w in ('bold', 'italic')]
            spec['texts'].append(dict(bar=bar, place=place, bold='bold' in flags, italic='italic' in flags,
                                      text=' '.join(words[2 + len(flags):])))
        elif key == 'show-names':
            spec['hide_names'] = False
        elif key == 'count-pickup':
            spec['count_pickup'] = True
        else:
            raise SystemExit(f'{path}: cannot read: {line}')
    return spec


def folder_title(song_dir):
    """A song's title from its folder's name: `002. Glas de trâmbiți a sunat` is `2 Glas de trâmbiți a sunat`."""
    m = re.match(r'(\d+)\.?\s*(.*)', os.path.basename(os.path.abspath(song_dir)))
    return f'{int(m.group(1))} {m.group(2)}' if m else None


def point(t):
    """`13+1/2` as (bar, where in it), `+1/8` as (None, a length), both in whole notes."""
    b, _, a = t.partition('+')
    return (int(b) if b else None), (Fraction(a) if a else Fraction(0))


def syllables(tokens):
    """Word tokens to placements: ('bar', N), ('hold',), ('skip',) or ('word', text, syllabic)."""
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


def note_tokens(tokens):
    """Note tokens to [(bar, [note dict])] (the forms are in this module's text)."""
    bars, cur = [], None
    for t in tokens:
        if t.startswith('@'):
            cur = (int(t[1:]), [])
            bars.append(cur)
            continue
        m = re.match(r'(r|u|[A-G](?:#|b)?\d):(\d+)(\.*)(t?)(~?)$', t)
        if not m or cur is None:
            raise SystemExit(f'cannot read note {t}')
        pitch, length, dots, trip, tie = m.groups()
        cur[1].append(dict(pitch=None if pitch in ('r', 'u') else pitch, unison=pitch == 'u', length=int(length),
                           dots=len(dots), triplet=bool(trip), tie=bool(tie)))
    return bars
