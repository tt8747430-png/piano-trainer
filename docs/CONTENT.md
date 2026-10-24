# Content

How pieces, listings, collections, patterns, lessons, journeys and courses are written. Content is code
([ADR 0002](adr/0002-content-as-code-one-file-per-piece.md)): one TypeScript file per piece, checked by tests that
refuse anything that would not play (see [What the tests check](#what-the-tests-check)). Words follow
[UBIQUITOUS_LANGUAGE](UBIQUITOUS_LANGUAGE.md).

## Add a piece

1. **One file**, `src/entities/piece/content/<collection>/<id>.ts`, exporting `definePiece({ … })`.
2. **One line** in that collection's `index.ts`: import it and put it in `entries`, in the collection's order.
3. **Optionally a guided song** of one course: its id in that course's `songs` (`src/entities/course/content/<course>/index.ts`).
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
| `kind`                     | `'song'` or `'study'`: what it is, not how it is written                              |
| `title`                    | As printed, in its own language                                                       |
| `titleEn`                  | The English title, only where the printed one is not English                          |
| `titleRu`                  | The Russian title it is known by, only where the printed one is not Russian           |
| `credits`                  | See [Credits](#credits)                                                               |
| `source`                   | `{ book, number?, page? }`; the books are in `entities/book`                          |
| `key`                      | The key it is written in: a letter, `#` or `b`, then `m` for minor (`G`, `F#`, `Ebm`) |
| `meter`                    | `'2/4'`, `'3/4'`, `'4/4'`, `'6/8'` or `'12/8'`: the piece's main meter                |
| `tempo`                    | Beats per minute, 40–160 (a compound meter's beat is the dotted quarter)              |
| `pattern`                  | The accompaniment the Player starts with (a pattern id, below)                        |
| `note`                     | Optional `LocalText`, by the [copy rule](#text)                                       |
| `sections`, `melody`       | Songs and studies: the [chart](#the-chart) and an optional [melody](#the-melody)      |
| `hands`                    | Songs and studies: optional bars of either hand [written out](#written-hands)         |
| `progression`, `chordSize` | A song written in degrees: see [Written in degrees](#written-in-degrees)              |

A chart that names method codes, or a section with a `pattern` of its own, starts the Player on its own plan:
each coded chord plays its method's pattern, every other chord its section's `pattern`, else the piece's. A
section's `pattern` (`{ kind: 'chorus', pattern: 'M3', lines: […] }`) is a built-in pattern id, as the piece's is.
It is content for the Player of a piece no one has edited: the editor opens every bar written and saves no section
pattern (ADR 0091).

A learner's version of a piece may give it a `title` of its own, typed where the editor prints it (ADR 0094): it
shows in every language in place of `title`, `titleEn` and `titleRu`, until Reset brings back the piece's.

## Add a listing, a collection

- **A listing** is a songbook entry with no chart yet: `defineListing({ id, title, titleEn, credits, source, key,
meter, note })`. It shows in Songs and never opens in the Player; no course has it as a song.
- **A collection** is a folder under `content/` whose `index.ts` exports `{ id, name, entries }` typed `Collection`.
  Add its id to `CollectionId` (`model/types.ts`) and the collection to `COLLECTIONS` (`content/index.ts`), in the
  order Songs lists them.

## The chart

Between a line's bars, barlines (ADR 0067): `|:` starts a repeat at the next bar, `:|` ends one at the bar before, `||`
is a double barline, `|.` the final one, and `[1` or `[2` before a bar puts it in that ending: `'|: G C [1 D :| [2 D7 G |.'`.
The jumps (ADR 0068): `Segno` or `Coda` before a bar puts its sign there; `Fine`, `ToCoda` and a jump `DC`, `DC.Fine`,
`DC.Coda`, `DS`, `DS.Fine` or `DS.Coda` after a bar: `'Segno G C ToCoda D DS.Coda Coda D7 G |.'`.

`sections` is a list of `{ kind, n?, label?, last?, detail?, key?, pattern?, lines }`:

- `kind`: `'intro' | 'verse' | 'chorus' | 'ending' | 'practice' | 'hymn' | 'part'`. The interface writes the heading.
- `n` numbers a verse; `label` names a part (`'A'`); `last` marks a last chorus or last ending; `detail` is a
  `LocalText` for anything else (`{ en: 'in 2/4', ru: 'на 2/4' }`, `{ en: 'and ending', ru: 'и окончание' }`).
- `key` is a key change: the key the section is written in where it is not the piece's (`'Db'`), its signature
  printed where it starts; a learner's other key moves it with the piece's (ADR 0060).
- `pattern` is the accompaniment the section's chords play where it is not the piece's; the editor never writes one (ADR 0091).
- `lines`: each line is bars separated by spaces.

A **bar** is one or more chords joined by `-`, each written `symbol[@beats][:method]`, or `_` for none:

| Written                    | Means                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `C Dm G-C`                 | Chords without `@beats` share the meter's beats: `G-C` in 4/4 is two beats each                  |
| `C@1-C/E@1-Dsus4@1-D/F#@1` | `@beats` fixes a chord's length (`@.5`, `@1.5` too)                                              |
| `Gm/E@2-Asus4-A7`          | Given beats first; the others share what is left (1 and 1)                                       |
| `Dm@1-Edim@1 Gm@2`         | A bar where every chord gives beats lasts their sum: a 2/4 bar inside 4/4                        |
| `Fm@1`                     | A first bar shorter than the meter is a pickup: the end of a bar, played, counted and written so |
| `C:t1 F`, `C-G:1`          | A method code; a chord without one takes its bar's first code                                    |
| `D/F#`                     | A slash chord; a bass that is a chord tone is spelled as that tone (`D#/G` → `D#/F𝄪`)            |
| `C _ G`, `_@2`             | No chord at all (ADR 0094): nothing printed over the bar, nothing a pattern plays there          |

`_` stands alone in its bar, its `@beats` given as a chord's where it is not the meter's length. A bar of no chord
sounds only what a hand writes in it ([Written hands](#written-hands)). A learner's new song starts as four such
bars, as a notation app's new score, and a bar the editor adds has no chord either.

Beats per bar by meter: `2/4` 2, `3/4` 3, `4/4` 4, `6/8` 2, `12/8` 4. Beats must fall on whole ticks (24 per beat:
`.5`, `.25`, `.125` a 32nd, `1.5`, not `.3`); a third of a beat is written as a fraction, `1:3` (a triplet 8th), `2:3`,
`1:6` (a triplet 16th) (ADR 0060).

**Chord symbols** are read in every spelling `qualitySpellings` lists (`src/shared/lib/music/chord.ts`): `m`, `7`,
`Maj7`/`maj7`/`M7`/`Δ`, `m7♭5`/`m7b5`/`ø`, `°`/`dim`, `°7`/`dim7`, `sus`/`sus4`, `sus2`, `6`, `m6`, `6/9`,
`add9`/`2`, `9`, `m9`, `Maj9`, `13`, `7♭9`, `7#9`, `7#5`, `7alt`, and the rest. `b` and `♭`, `#` and `♯` are read
alike. A hyphen separates chords, so write the minus of `7(−9)` as `−` (or write `7b9`). Note names are
international: B, never H.

**Method codes** are the source book's techniques: `1`–`5`, `t1`–`t5`, `3ch`, `inv`, `5.1`–`5.3`, `6u`, `6d`, and
level 2's `oct`, `octs`, `ch`
(`METHODS` in `src/entities/pattern/content/methods.ts`).

**A workbook's plan as a chart.** Called to Play writes a way over each chord of a song's words. Each chord is a
bar; chords joined by a dash share it; a chord that names two ways (`3 | ♪♩`) is written twice, each for half its bar
(`Dm:3-Dm:t1`). A rhythm icon is its `t` code, in the order the workbook's table of ornaments draws them (♪♩ `t1`,
the rising staircase `t2`, the run down from two notes `t3`, the four flat-beamed notes `t4`, the chords `t5`),
`Invers.` is `inv`, `3 chords` `3ch`, `6th↑` and `6th↓` `6u` and `6d`,
and level 2's `Октавы`, `Октавы (гамма)` and `Chords` are `oct`, `octs` and `ch`. A way printed once over a run of
chords holds for them: such a song's `pattern` is that way. What the codes cannot say (`3↑`, an octave higher;
`x 1`; `(melody)`) goes in the piece's `note`.

## The melody

`melody: 'E4/1 D4/.5 r/1 | C#5/1.5'`: a note name with its octave (C4 is middle C), a slash, then beats; `r` is a
rest; `|` may mark bars and is ignored. It is written in the piece's key and is no longer than the chart. A melody
lets the tune be doubled and makes the patterns that play it (r5–r7) available. Its notes keep the spelling they are
written with (`C#5` is C♯, never D♭): the sheet music prints them so, moved into another key by interval.

### Lyrics

`lyrics: ['Si-_ lent night, ho-_ ly night, …']`: the words, a verse a string (ADR 0093). A verse is syllables
parted by spaces, each under the tune's next note in order: the melody's notes where the piece has a melody, else
the right hand's onsets, a chord of them one note. A rest takes none. `-` ends a syllable its word carries on (a
hyphen is printed to the next: `A- ma- zing`); `_` holds the syllable over the next note (a melisma, one `_` a note:
`Si-_ lent` sings "Si" on two notes); `~` leaves a note's place empty. Punctuation stays with its syllable. A verse is
no longer than the tune; a shorter one leaves the last notes without words. The sheet prints every verse under the
tune's staff (the melody's, else the piano's upper staff), and the View menu's Lyrics switch hides them.

The lyrics belong to the staff they are written on: `lyricsOn: 'rh'` keeps them on the upper staff of a piece that
has a melody (a learner's song whose words were written there before its melody staff came), sung on the right hand's
onsets as above. The melody's is the default and is not written.

## Written hands

`hands: { rh?, lh? }`: any bar of either hand written note by note, played in place of the pattern's hand there.
A learner's version or own song writes every bar of both hands (ADR 0027, 0091): the editor opens a piece with its
pattern's bars written out as the Player plays them, and saves it so. Each hand is its bars separated by `|`, one
entry for every bar of the chart in order:

| Written                  | Means                                                                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-`                      | The pattern plays this hand in this bar (built-in content only: a version writes every bar, ADR 0091)                                                     |
| `C4/1 E4/1 G4/2`         | Notes one after another, each a pitch and its beats, as the melody writes them                                                                            |
| `C4+E4+G4/2`             | Notes struck together                                                                                                                                     |
| `E4^3`                   | A finger (1–5), as the figure notation writes it                                                                                                          |
| `r/1`                    | A rest; a bar of rests is written silence, not the pattern                                                                                                |
| `C3/4 E3+G3/1@2 E3+G3/1` | `@beat` starts a token on a beat counted from 1 (`@2.5` the "and" of 2), so a held note and the notes over it are both written; the next token follows it |
| `F4/1:3 D4/1:3 E4/1:3`   | A triplet: thirds of a beat as fractions; `C4/.125` a 32nd                                                                                                |
| `C4+E4/1[acc,stacc]`     | Marks after a token, on each of its notes (below)                                                                                                         |

Written in the piece's key, its accidentals as printed (`E5` in a D♭ section is E natural), on whole ticks, every
note on the piano. A note may last past its bar's end only into bars
where the same hand is written: it is held across the barline.

**Marks** (ADR 0063), words joined by commas in brackets: articulations `stacc` `staccatiss` `acc` `ten` `marc`
`ferm` (several may join); one ornament `tr` `mord` `lmord` `turn` `trem`; `arp` rolls the chord; `(` starts a slur
and `)` ends one; `8va` writes the notes an octave lower than they sound, `8vb` higher; a dynamic `pp` `p` `mp` `mf`
`f` `ff`; a hairpin `cresc` or `dim` starts, `/hairpin` ends; an expression `dolce` `cantabile` `espress` `legato`
`leggiero` `rit` `rall` `accel` `atempo` (ADR 0068); the pedal `ped` down, `pedch` changed, `pedup` up;
`gr:D5+E5` grace notes struck just before. A pitch is
always the one heard. A melody's notes take the same marks (`E4/1[stacc,p]`), a rest none.

**Clef changes** (ADR 0069): `clef:treble` or `clef:bass` first in a hand's bar changes its staff from that bar on,
before its notes or before `-`: `lh: '- | clef:treble C4/2 E4/2 | clef:bass G2/1'`.

## The recording

`recording: { src, start, tempo }`: a performance of the piece (a singer's) that plays along in Listen, in the
piece's own key, at any tempo with its pitch kept ([ADR 0016](adr/0016-a-piece-may-carry-a-recording-that-plays-along.md)).

- **The file** sits beside the piece's file as AAC in an `.m4a` at 128 kbps
  (`afconvert -f m4af -d aac -b 128000 in.mp3 piece-vocal.m4a`), under Workbox's 2 MiB precache limit, and is
  imported with `?url` (`import vocal from './romashki-vocal.m4a?url'`), so the build fingerprints and precaches it.
- **`start`** is the second bar 1's downbeat falls, which is not the first sound when the voice begins with a pickup
  («Ромашковые поля»'s first note is a pickup before bar 1): find it by ear, then check the grid from it against later
  landmarks (a section's entry, the last note). With the count-in on, the Player plays the pickup in the count-in bar.
- **`tempo`** is the recording's steady tempo, counted as the chart counts it, measured, never taken from the chart:
  a singer's is often not the chart's («Ромашковые поля» is sung at 73 over a chart at 72, 0.73 s ahead by its last
  bar). Time a passage that repeats (its two choruses: 16 beats in 13.17 s), and check that every landmark falls within
  50 ms of its beat. Its form must be the chart's (a repeat written out, as the chart writes it).

## Written in degrees

A song a course teaches in degrees, to be played in any key, is written so instead of as a chart: it has no
`sections`; its chords grow with the chord size the learner picks. It is a song all the same (`kind: 'song'`,
`isDegreePiece` tells its format). A progression that is only practised is not a piece: it goes in
[the progressions library](#the-progressions-library).

```ts
export default definePiece({
  id: 'romashki',
  kind: 'song',
  title: 'Ромашковые поля',
  titleEn: 'Daisy fields',
  key: 'Dm',
  meter: '4/4',
  tempo: 72,
  pattern: 'pop8',
  chordSize: { default: 'sevenths', choosable: true },
  progression: [{ kind: 'verse', lines: ['i:min:4 iv:min:2 V:=sus4:2 i:min:4'] }],
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
bars: `I:dom:16 IV:dom:8 …` fills four bars, then two.

**In sections.** A song writes `progression` as a chart's sections (`kind`, `n`, `label`, `last`,
`detail`, `lines`), each line a progression of its own: it starts on a new bar and is one line of the chart, so the
printed line breaks stay. Headings are a chart's. A mistake names its section, line and chord.

```ts
progression: [
  { kind: 'verse', lines: ['i:min:4 iv:min:2 V:=sus4:2 i:min:4', 'ii:hd:4 V:=sus4:2 V:=maj:2'] },
  { kind: 'chorus', last: true, lines: ['iv:min:2 i:=min:2/3 ii:hd:1 V:=maj:1 i:=m6:2'] },
],
```

**As printed.** Write a printed triad, suspension, 6th or slash chord as a fixed quality (`=maj`, `=sus4`, `=m6`,
`/3`) and a printed 7th chord as a function: then the chord size grows only the 7th chords, as an accompanist
extends a song («Ромашковые поля»: Dm7 → Dm9, D7 → D7♭9 into Gm, its C and A staying triads).

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

`src/entities/pattern`: the ids in `model/types.ts`, the figures in `content/figures.ts`, the 48 patterns in
`content/patterns.ts`, the method codes in `content/methods.ts`. The compiler demands an entry for every id.

- **A figure** (one hand's part): its id in `RIGHT_FIGURE_IDS` or `LEFT_FIGURE_IDS`, then
  `{ name, figure: eventFigure('…') }`.
- **A pattern:** its id in `PATTERN_IDS`, then `{ group, name, idea, description?, rh, lh }` naming two figures.
  `idea` is one line in both languages, what it sounds like and what each hand does: the picker's line under its
  name. `description` is the source's fuller explanation, shown on the pattern's page. A right hand that plays the
  tune makes it a melody pattern, which falls back to r4 on a piece with no melody. The learner's own patterns are
  saved state, not content (ADR 0026).
- **A method code:** its code in `METHOD_CODES`, then `{ pattern, label }`.

### The figure notation

`eventFigure(events, { inThree?, onMajor?, triplets?, inCompound?, inCompoundOnMajor?, inSix? })`. `events` are
comma-separated `start/length tones` in 16ths of a 4/4 bar (triplet 8ths with `triplets: true`); `inThree` replaces
them in 3/4, `onMajor` on major chords. `inCompound` replaces them in 6/8 and 12/8, written for a 12/8 bar in 16ths of
the compound beat (six to a dotted quarter, 24 to the bar; a 6/8 bar plays the first twelve), and
`inCompoundOnMajor` on major chords there. A figure whose events all fall on beats needs no compound version: a
compound beat is a beat; `inSix` gives one of four beats its two-beat form for a 6/8 bar (`5.1`: the chord, then
the chord over its ♭7). Tones are joined by `+`, each optionally `^finger` (1–5); an event ending `!` is accented.

| Token           | Plays                                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `C`             | The chord, voice-led from the last one                                                                                   |
| `T` `T1` `T2`   | The close triad from the root, or its 1st or 2nd inversion                                                               |
| `T8` `T15`      | The close triad one or two octaves up                                                                                    |
| `U`             | The chord's upper notes as `C` voices it, all but its lowest (`v1`)                                                      |
| `1`–`22`        | A degree above the root, on the chord's own 3rd, 5th and 7th (`8` is the octave, `15` two)                               |
| `vN`            | The Nth note of the voiced chord from the bottom; past its top, an octave up                                             |
| `_7` `_b7` `_6` | 1, 2 or 3 semitones below the root                                                                                       |
| `sN`            | N steps up the chord's major or minor scale from the root (`s0` the root)                                                |
| `LN`            | Degree N above the bass, in the left hand's register                                                                     |
| `Ka` `Kb` `Kc`  | The key's I, IV and V triads (minor i and iv in a minor key), voice-led                                                  |
| `Sh`            | Over the bass, the chord's 7th, or its 5th where it has none: a jazz shell                                               |
| `A`             | A semitone under the next bass, near this one: a chord's last bar leads to the next chord, any other bar back to its own |

`0/4 C,4/4 C,8/4 C,12/4 C` is a chord on every beat; `0/16 L1+L8` an octave held for the bar. Events of two to four
notes with no finger written are fingered automatically. Each chord plays its figures in windows of one meter bar;
a chord shorter than two beats picks the pattern up where it sits in the bar.

## Lessons and courses

Two kinds of lesson, kept apart ([ADR 0053](adr/0053-lessons-and-courses-apart.md)); `src/app/content/` tests both.

- **A journey's lesson** is a file in `src/entities/lesson/content/` (a `Lesson`), listed in `content/index.ts`
  and placed in a chapter of `content/journeys.ts`: four journeys, one to a level, each in chapters of lessons and
  then the chord families or scales the chapter's Check asks. It teaches theory: it plays no piece, shows no
  pattern, names no method book and links only journey lessons and Practice. Its way on is the journey's next
  lesson, into the next chapter.
- **A course** is a folder `src/entities/course/content/<course>/`: `index.ts` (a `Course`: `id`, `shelf`, `stage`,
  `title`, `summary`, `weeks`, its `lessons` in order and its guided `songs`) and one file per lesson. A course's
  lesson links no lesson, plays only its course's songs and shows only its own book's patterns (level 2 of Called to
  Play also level 1's). A piece is a song of one course at most. A method book's course keeps its book's content and
  order. The scale and arpeggio courses build a lesson per key from the kernel (`content/scale-lessons.ts`). A
  course's icon is in `ui/course-look.ts`.

A lesson teaches music; it never explains a button. Each lesson is an `id`, a `title` and `summary` in both
languages and its `sections`, each a heading over blocks.

**How a lesson reads** (the research checklist, `.scratch/learn-pages/research.md`, held by the catalog test): each
section shows something within its first two blocks (an example, a question) and says at most 35 words in English;
sentences stay under 30 words (aim for 20, 15–18 in Russian), with no semicolons; a term is defined in bold (`lead`)
where it first appears; a section ends with something to play. A lesson ends on **Try it**: questions answered on the
keys, then links into the Quiz or the Player to practise. Depth comes from more sections, examples and questions, never
from longer prose.

| Block         | Content                                                                                  | Shows                                                     |
| ------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `text`        | `{ kind: 'text', lead?, text }`                                                          | a paragraph, its lead in bold                             |
| `steps`       | `{ kind: 'steps', steps: [...] }`                                                        | a numbered list                                           |
| `note`        | `{ kind: 'note', text }`                                                                 | a callout on sand                                         |
| `chords`      | `{ kind: 'chords', symbols: ['C2', 'Cadd9'] }`, written as the lesson writes them        | a button each that plays the chord                        |
| `grid`        | `{ kind: 'grid', quality: 'm7' }`                                                        | the quality on all twelve roots                           |
| `scale`       | `{ kind: 'scale', root: note('D'), scale: 'dorian' }`                                    | its name, notes, run on a staff, Play                     |
| `interval`    | `{ kind: 'interval', root: note('C'), interval: 'M3' }`                                  | the Intervals explorer's card                             |
| `notes`       | `{ kind: 'notes', clef: 'treble', notes: 'E4 G4/2 B4/8.', meter?, key? }`                | the line on one staff, Play                               |
| `pattern`     | `{ kind: 'pattern', pattern: 'r4', piece: 'otche' }`                                     | the pattern over the piece's first line, Play, the Player |
| `progression` | `{ kind: 'progression', numerals: 'ii V I', key, size?: 'sevenths' }`                    | the Progressions page's row, its link                     |
| `quiz`        | `{ kind: 'quiz', ask, answer: { chord: 'Em' } }` or `answer: { notes: ['F', 'A'] }`      | answered on the keys                                      |
| `link`        | `{ kind: 'link', title, target: { opens: 'scales', root: note('D'), scale: 'dorian' } }` | a row into an explorer, a lesson, a tool or the Player    |

A line of notes names each note with its octave (`C4` is middle C), then after a slash its value (`1` whole, `2`
half, `4` quarter, the default, `8` eighth, `16` sixteenth) and a dot for half as long again (not on a sixteenth); `r`
is a rest (`r/4`) and `~` ties a note to the next of its pitch (`G4/2~ G4/4`); its meter is 2/4, 3/4, 4/4, 6/8 or
12/8, in whole bars, and its `key` writes a signature. Notes are kernel values (`note('B', -1)`), keys `Key`
objects (`{ tonic: note('E', -1), minor: false }`). A link `opens` `chords` (a symbol), `scales` (a root, a kind,
`show?`), `key` (a key), `intervals` (`root?`), `tensions` (a chord, a root: the chord builder opens on it), `lesson`
(an id), `progressions` (numerals, a key, `size?`), `between` (a key, `from` and `to` as symbols: Progressions'
passing chords between them), `harmonise` (a key, a melody note: the Key view harmonising it), `song-chords` (a song's
`chords` as typed: Progressions reads them in their key), `quiz` (a trainer's id), `piece` (a piece in the Player,
`pattern?`), `exercise` (an exercise in the
Player, `root?`, `quality?`) or `player` (a progression in the Player, ready to practise: numerals, a key, `size?`,
`walk?` through the keys, `inversion?` 0–3).

A pattern plays over the piece its source teaches it on: the five ways over `ex3`, a right-hand technique over its
lesson's study, Боброва's seven over `otche`, a rhythm style over a study's plain chords. A pattern that plays the tune (`r5`,
`r6`, `r7`) needs a piece with a melody, in a block or a `piece` link. Its name and description come from the pattern; the lesson says why it is
there. Numerals are read as the Progressions page reads them, a minor key from natural minor: a degree, then what a
chord symbol writes after its root (`V7`, `I6`, `Vsus4`, `ii9`, `iiø7`), lower case for a chord with a minor 3rd
(ADR 0032).

## The progressions library

`src/entities/progression-library/content/library.ts` is the one list of the progressions that are practised, **one
entry for each idea** (ADR 0041): a style (`pop`, `rock`, `jazz`, `blues`, `classical`, `soul`, `gospel`, `theory`), an
id, its lines as `parseNumerals` reads them, `major` (`I V vi IV`, `♭VI ♭VII I`) and `minor` (`ii° V i`, counted from
natural minor), one at least, and the name in both languages; and, where it has them, a `note` (what it teaches, in a
line, by the [copy rule](#text)), the `pattern` its Player opens with and the chord `size` it opens at. **A minor version
is the entry's `minor` line, never another entry**: a cadence's is its minor-key version (`ii° V i`, `i iv V i`), a pop
loop's the same loop heard from its relative minor (the Axis's `i VI III VII`); the key's Major · Minor shows one or the
other. Write a chord where the style plays it whatever the chord size (the blues' `I7`, a resolution's `V7♭9`, a tonic's
`I6`); leave a triad plain where the chord should grow with the size (the minor ii–V–i is `ii° V i`: Dm7♭5 G7 Cm7 at 7ths,
Dm9♭5 G7♭9 Cm9 at 9ths). **No line is another as a loop** (in 7th chords, in the same key or the relative one): not
from another chord (`vi IV I V` is the Axis), not with a chord held (`I IV V` is the complete cadence), not at another
chord size (`V I` at 9ths is the authentic cadence); a test holds it. **What a way of playing writes is not an entry**:
a walk through the keys, a lead-in to each chord (secondary dominants, a ii–V–I to every chord of the key), a chord size.
**A name is the one musicians give those chords** (Louie Louie's v is minor, so `I IV V IV` is Wild Thing). An id is its
entry's alone: `tsc` holds every id a table names.

## What the tests check

- **Catalog** (`src/entities/piece/content/catalog.test.ts`): the counts; every piece parses at every chord size it
  allows; every piece arranges in all 12 keys with its own accompaniment and each of the 48 patterns, its melody
  doubled, with every note on the piano (21–108) and inside the piece, every root spelled with at most one
  accidental, and no silent bar; melodies fit their charts; every verse fits its tune; tempos 40–160; credit names;
  every `LocalText` in both languages.
- **Notation** (`src/features/practice/notate-pieces.test.ts`): every piece is written as sheet music and engraved in
  its own key and pattern (its tune doubled too), and every pattern in 4/4, 3/4 and 12/8, each voice filling its bar.
- **Curriculum** (`src/entities/course/content/courses.test.ts`): every lesson in one course, every step names a piece
  that exists, every piece once, no listing, every chord family and scale kind, every stage with courses in order.
- **Patterns** (`src/entities/pattern/content/patterns.test.ts`): counts, ids, fallbacks, both languages.
- **Progressions library** (`src/entities/progression-library/content/library.test.ts`): ids, both languages,
  every line read and named in its mode, no two lines one loop (from another chord, a chord held or the relative
  minor), every style used, every note in both languages, the common progressions in both modes, and the chords a name
  plays (Wild Thing, the gospel 7–3–6, round the circle in minor, the cadences, the Andalusian cadence).
- **Lessons' patterns** (`src/widgets/lesson-view/model/pattern-example.test.ts`): every pattern block plays over its
  piece from its first beat.
- **Lessons** (`src/entities/lesson/content/catalog.test.ts`): ids, every text in both languages, every chord symbol,
  line of notes, question's answer and link read by the kernel (a trainer's id among them), and the prose rules above.

A mistake names its place: `bz10 · section 2, line 1, bar 3: unknown chord symbol "Qm"`.
