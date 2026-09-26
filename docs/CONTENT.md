# Content

How pieces, listings, collections, patterns and the path are written. Content is code
([ADR 0002](adr/0002-content-as-code-one-file-per-piece.md)): one TypeScript file per piece, checked by tests that
refuse anything that would not play (see [What the tests check](#what-the-tests-check)). Words follow
[UBIQUITOUS_LANGUAGE](UBIQUITOUS_LANGUAGE.md).

## Add a piece

1. **One file**, `src/entities/piece/content/<collection>/<id>.ts`, exporting `definePiece({ … })`.
2. **One line** in that collection's `index.ts`: import it and put it in `entries`, in the collection's order.
3. **One step** in `src/entities/path/content/path.ts`: `...pieces('<id>')` where it should be learned.
4. Raise the counts in `src/entities/piece/content/catalog.test.ts` (it pins how many pieces there are), then run
   `npm run test`.

An id is short and lower-case (`bz5`, `twofive`). It appears in URLs and in saved progress: never rename one.

```ts
// src/entities/piece/content/bozhe-spasibo/bz5.ts
import { definePiece } from '../../model/types'

export default definePiece({
  id: 'bz5',
  kind: 'song',
  title: 'Мир, душа, храни',
  titleEn: 'Still, my soul, be still',
  credits: [{ role: 'authors', names: 'Keith Getty, Kristyn Getty, Stuart Townend' }],
  source: { book: 'bozhe-spasibo', number: 5, page: 16 },
  key: 'G',
  meter: '4/4',
  tempo: 72,
  pattern: 'r4',
  sections: [
    { kind: 'verse', lines: ['G C Em-G/B C@1-C/E@1-Dsus4@1-D/F#@1'] },
    { kind: 'chorus', lines: ['Em-D/F# G Am-Em C@2-Dsus4@1-D7@1', 'Em C-D'] },
    { kind: 'ending', lines: ['G'] },
  ],
})
```

| Field                      | What it holds                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `kind`                     | `'song'` or `'study'` (with a chart), `'progression'` (with a progression)            |
| `title`                    | As printed, in its own language                                                       |
| `titleEn`                  | The English title, only where the printed one is not English                          |
| `credits`                  | See [Credits](#credits)                                                               |
| `source`                   | `{ book, number?, page? }`; the books are in `content/books.ts`                       |
| `key`                      | The key it is written in: a letter, `#` or `b`, then `m` for minor (`G`, `F#`, `Ebm`) |
| `meter`                    | `'2/4'`, `'3/4'`, `'4/4'`, `'6/8'` or `'12/8'`: the piece's main meter                |
| `tempo`                    | Beats per minute, 40–160 (a compound meter's beat is the dotted quarter)              |
| `pattern`                  | The accompaniment the Player starts with (a pattern id, below)                        |
| `note`                     | Optional `LocalText`, by the [copy rule](#text)                                       |
| `sections`, `melody`       | Songs and studies: the [chart](#the-chart) and an optional [melody](#the-melody)      |
| `progression`, `chordSize` | Progressions: see [Progressions](#progressions)                                       |

A chart that names method codes starts the Player on its own plan: each coded chord plays its method's pattern,
every other chord plays `pattern`.

## Add a listing, a collection

- **A listing** is a songbook entry with no chart yet: `defineListing({ id, title, titleEn, credits, source, key,
meter, note })`. It shows in Songs and never opens in the Player; it has no path step.
- **A collection** is a folder under `content/` whose `index.ts` exports `{ id, name, entries }` typed `Collection`.
  Add its id to `CollectionId` (`model/types.ts`) and the collection to `COLLECTIONS` (`content/index.ts`), in the
  order Songs lists them.

## The chart

`sections` is a list of `{ kind, n?, label?, last?, detail?, lines }`:

- `kind`: `'intro' | 'verse' | 'chorus' | 'ending' | 'practice' | 'hymn' | 'part'`. The interface writes the heading.
- `n` numbers a verse; `label` names a part (`'A'`); `last` marks a last chorus or last ending; `detail` is a
  `LocalText` for anything else (`{ en: 'in 2/4', ru: 'на 2/4' }`, `{ en: 'and ending', ru: 'и окончание' }`).
- `lines`: each line is bars separated by spaces.

A **bar** is one or more chords joined by `-`, each written `symbol[@beats][:method]`:

| Written                    | Means                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `C Dm G-C`                 | Chords without `@beats` share the meter's beats: `G-C` in 4/4 is two beats each       |
| `C@1-C/E@1-Dsus4@1-D/F#@1` | `@beats` fixes a chord's length (`@.5`, `@1.5` too)                                   |
| `Gm/E@2-Asus4-A7`          | Given beats first; the others share what is left (1 and 1)                            |
| `Dm@1-Edim@1 Gm@2`         | A bar where every chord gives beats lasts their sum: a 2/4 bar inside 4/4             |
| `Fm@1`                     | A pickup bar                                                                          |
| `C:t1 F`, `C-G:1`          | A method code; a chord without one takes its bar's first code                         |
| `D/F#`                     | A slash chord; a bass that is a chord tone is spelled as that tone (`D#/G` → `D#/F𝄪`) |

Beats per bar by meter: `2/4` 2, `3/4` 3, `4/4` 4, `6/8` 2, `12/8` 4. Beats must fall on whole ticks (12 per beat:
`.5`, `.25`, `1.5`, not `.3`).

**Chord symbols** are read in every spelling `qualitySpellings` lists (`src/shared/lib/music/chord.ts`): `m`, `7`,
`Maj7`/`maj7`/`M7`/`Δ`, `m7♭5`/`m7b5`/`ø`, `°`/`dim`, `°7`/`dim7`, `sus`/`sus4`, `sus2`, `6`, `m6`, `6/9`,
`add9`/`2`, `9`, `m9`, `Maj9`, `13`, `7♭9`, `7#9`, `7#5`, `7alt`, and the rest. `b` and `♭`, `#` and `♯` are read
alike. A hyphen separates chords, so write the minus of `7(−9)` as `−` (or write `7b9`). Note names are
international: B, never H.

**Method codes** are the source book's techniques: `1`–`5`, `t1`–`t5`, `3ch`, `inv`, `5.1`–`5.3`, `6u`, `6d`
(`METHODS` in `src/entities/pattern/content/methods.ts`).

## The melody

`melody: 'E4/1 D4/.5 r/1 | C#5/1.5'`: a note name with its octave (C4 is middle C), a slash, then beats; `r` is a
rest; `|` may mark bars and is ignored. It is written in the piece's key and is no longer than the chart. A melody
lets the tune be doubled and makes the patterns that play it (r5–r7) available.

## Progressions

A progression has no chart; its chords grow with the chord size the learner picks.

```ts
export default definePiece({
  id: 'twofive',
  kind: 'progression',
  title: 'ii–V–I',
  key: 'C',
  meter: '4/4',
  tempo: 72,
  pattern: 'jazz',
  chordSize: { default: 'sevenths', choosable: true },
  progression: 'ii:min:4 V:dom:4 I:maj:8',
  note: { en: 'The basic jazz cadence. With 9ths: m9 → 9 → Maj9.', ru: '…' },
})
```

Each chord is `degree:function:beats`, optionally `/3`, `/5` or `/7`:

- **Degree:** `I`–`VII` in either case, measured on the major scale from the tonic, in minor keys too (`i` is the
  tonic, `♭III` its relative major). `♭`, `b`, `#` or `♯` before it makes a chromatic degree (`♭VII`, `#iv`).
- **Function:** how the chord grows with the chord size (triads / sevenths / ninths):

  | Function   | Triads                                                                            | Sevenths | Ninths |
  | ---------- | --------------------------------------------------------------------------------- | -------- | ------ |
  | `maj`      | maj                                                                               | Maj7     | Maj9   |
  | `min`      | m                                                                                 | m7       | m9     |
  | `dom`      | maj                                                                               | 7        | 9      |
  | `domb9`    | maj                                                                               | 7        | 7♭9    |
  | `hd`       | °                                                                                 | m7♭5     | m7♭5   |
  | `=quality` | that quality at every chord size (`V:=b9:4`, `♭VII:=sus2:1`; ids from `chord.ts`) |

- **Bass:** `/3`, `/5`, `/7` put that chord tone in the bass. It must exist at every chord size the piece allows.
- **Chord size:** `{ default, choosable }`; `choosable: false` fixes the chord size.

Chords fill bars of the meter in order, a chord longer than the room left tied into the next bar; lines hold four
bars. The 12-bar blues (`I:dom:16 IV:dom:8 …`) is twelve 4/4 bars.

## Credits

`credits: [{ role, names }, …]` with `names` exactly as printed and `role` one of `authors` (no role printed),
`words-and-music`, `words`, `music`, `russian-text`, `harmony`, `accompaniment`; `{ role: 'unknown' }` for "Author
unknown". The interface writes the role in the learner's language. `Words: А. Кетлер · Music: А. В. Зименс` is
`[{ role: 'words', names: 'А. Кетлер' }, { role: 'music', names: 'А. В. Зименс' }]`.

## Text

Content text a learner reads is `LocalText` (`{ en, ru }`, both non-empty): notes, collection names, section
details, pattern and figure names, descriptions and method labels. Titles and credit names stay as printed.

**The copy rule:** no sentence that repeats what the interface shows (the chart, the meter, the key, a pattern's own
description), no reference to controls ("change Accompaniment"), no how-to paragraphs. A note says what the learner
could not see: where the chords came from, a quirk of the printed score, what the source asks of the learner.

## Patterns and figures

`src/entities/pattern`: the ids in `model/types.ts`, the figures in `content/figures.ts`, the 39 patterns in
`content/patterns.ts`, the method codes in `content/methods.ts`. The compiler demands an entry for every id.

- **A figure** (one hand's part): its id in `RIGHT_FIGURE_IDS` or `LEFT_FIGURE_IDS`, then
  `{ name, figure: eventFigure('…') }`.
- **A pattern:** its id in `PATTERN_IDS`, then `{ group, name, description?, rh, lh }` naming two figures. A right
  hand that plays the tune makes it a melody pattern, which falls back to r4 on a piece with no melody.
- **A method code:** its code in `METHOD_CODES`, then `{ pattern, label }`.

### The figure notation

`eventFigure(events, { inThree?, onMajor?, triplets? })`. `events` are comma-separated `start/length tones` in 16ths
of a 4/4 bar (triplet 8ths with `triplets: true`); `inThree` replaces them in 3/4, `onMajor` on major chords.
Tones are joined by `+`, each optionally `^finger` (1–5); an event ending `!` is accented, `~` rolled.

| Token           | Plays                                                                            |
| --------------- | -------------------------------------------------------------------------------- |
| `C`             | The chord, voice-led from the last one                                           |
| `T` `T1` `T2`   | The close triad from the root, or its 1st or 2nd inversion                       |
| `T8`            | The close triad an octave up                                                     |
| `U`             | The triad's 3rd and 5th                                                          |
| `1`–`15`        | A degree above the root, on the chord's own 3rd, 5th and 7th (`8` is the octave) |
| `vN`            | The Nth note of the voiced chord from the bottom; past its top, an octave up     |
| `_7` `_b7` `_6` | 1, 2 or 3 semitones below the root                                               |
| `sN`            | N steps up the chord's major or minor scale from the root (`s0` the root)        |
| `LN`            | Degree N above the bass, in the left hand's register                             |
| `Ka` `Kb` `Kc`  | The key's I, IV and V triads (minor i and iv in a minor key), voice-led          |

`0/4 C,4/4 C,8/4 C,12/4 C` is a chord on every beat; `0/16 L1+L8` an octave held for the bar. Events of two to four
notes with no finger written are fingered automatically. Each chord plays its figures in windows of one meter bar;
a chord shorter than two beats picks the pattern up where it sits in the bar.

## The path

`src/entities/path/content/path.ts` lists each level's steps in order: `chords('sev')`, `scale('harmonic')`,
`...pieces('bz5')`. Every piece appears exactly once, listings never; a chord family or scale kind appears once. It
is the one source of levels ([ADR 0005](adr/0005-levels-live-on-the-path.md)).

## What the tests check

- **Catalog** (`src/entities/piece/content/catalog.test.ts`): the counts; every piece parses at every chord size it
  allows; every piece arranges in all 12 keys with its own accompaniment and each of the 39 patterns, its melody
  doubled, with every note on the piano (21–108) and inside the piece, every root spelled with at most one
  accidental, and no silent bar; melodies fit their charts; tempos 40–160; credit names; every `LocalText` in both
  languages.
- **Path** (`src/entities/path/content/path.test.ts`): every step names a piece that exists, every piece once, no
  listing, every chord family and scale kind.
- **Patterns** (`src/entities/pattern/content/patterns.test.ts`): counts, ids, fallbacks, both languages.

A mistake names its place: `bz10 · section 2, line 1, bar 3: unknown chord symbol "Qm"`.
