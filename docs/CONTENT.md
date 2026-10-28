# Content

How pieces, listings, collections, patterns, lessons, journeys, courses and the progressions library are written.
Content is TypeScript, one file per piece or lesson, and tests refuse anything that would not play
([What the tests check](#what-the-tests-check)). Names follow [UBIQUITOUS_LANGUAGE](UBIQUITOUS_LANGUAGE.md).

## A piece

1. One file, `src/entities/piece/content/<collection>/<id>.ts`, exporting `definePiece({ … })`.
2. One line in that collection's `index.ts`: import it and put it in `entries`, in the collection's order.
3. Optionally, its id in one course's `songs` (`src/entities/course/content/<course>/index.ts`).
4. Raise the counts in `src/entities/piece/content/catalog.test.ts`.

An id is short and lower-case (`bz5`). It is in URLs and saved progress: never rename one.

```ts
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

| Field                      | Holds                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `kind`                     | `'song'` or `'study'`: what it is, not how it is written                              |
| `title`                    | As printed, in its own language                                                       |
| `titleEn`, `titleRu`       | The English / Russian title, only where the printed one is in another language        |
| `credits`                  | See [Credits](#credits)                                                               |
| `source`                   | `{ book, number?, page? }`; books are in `entities/book`                              |
| `key`                      | A letter, `#` or `b`, then `m` for minor (`G`, `F#`, `Ebm`)                           |
| `meter`                    | The main meter: 1–12 over 2, 4 or 8 (`'4/4'`, `'6/8'`)                                |
| `timeSymbol`               | `true` prints 4/4 as C and 2/2 as ¢                                                   |
| `tempo`, `tempoUnit`       | Beats per minute, 40–160; the note the mark counts where not the meter's beat (`'8'`) |
| `pattern`                  | The accompaniment the Player starts with ([Patterns](#patterns-and-figures))          |
| `note`                     | Optional `LocalText`, by the [copy rule](#text)                                       |
| `sections`                 | [The chart](#the-chart)                                                               |
| `staves`, `lyrics`         | [Single staves](#single-staves-and-lyrics)                                            |
| `leadSheet`                | `true` hides the piano's staves (only with a single staff); its music still plays     |
| `hands`                    | Bars of either hand [written out](#written-hands)                                     |
| `recording`                | [A recording](#a-recording) that plays along                                          |
| `progression`, `chordSize` | A song [written in degrees](#written-in-degrees), in place of `sections`              |

**A listing** is a songbook entry with no chart yet: `defineListing({ id, title, titleEn, credits, source, key,
meter, note })`. It shows in Songs, never opens in the Player and is no course's song.

**A collection** is a folder under `content/` whose `index.ts` exports `{ id, name, entries }` (`Collection`). Add
its id to `COLLECTION_IDS` (`model/types.ts`), and the collection to `SONG_COLLECTIONS` in `content/index.ts` in the
order Songs lists them (the studies are Practice's, not Songs').

## The chart

`sections` is a list of `{ kind, n?, label?, last?, detail?, key?, meter?, pattern?, lines }`:

- `kind`: `intro`, `verse`, `chorus`, `bridge`, `ending`, or a songbook's own `practice`, `hymn`, `part`. The
  interface writes the heading.
- `n` numbers a verse; `label` names a part (`'A'`); `last` marks a last chorus or ending; `detail` is a `LocalText`
  for anything else (`{ en: 'and ending', ru: 'и окончание' }`).
- `key`: a key change, the key the section is written in (`'Db'`). Its signature prints where it starts.
- `meter`: a change of time, of the piece's kind (quarters or dotted quarters). Write its bars whole in it
  (`Dm-Edim Gm`, not `Dm@1-Edim@1 Gm@2`).
- `pattern`: the pattern its chords play where not the piece's. A method code on a chord still wins.
- `lines`: each line is bars separated by spaces.

A **bar** is chords joined by `-`, each `symbol[@beats][:method]`, or `_` for none:

| Written                    | Means                                                                             |
| -------------------------- | --------------------------------------------------------------------------------- |
| `C Dm G-C`                 | Chords without `@beats` share the bar: `G-C` in 4/4 is two beats each             |
| `C@1-C/E@1-Dsus4@1-D/F#@1` | `@beats` fixes a chord's length (`@.5`, `@1.5` too)                               |
| `Gm/E@2-Asus4-A7`          | Given beats first; the rest share what is left                                    |
| `Dm@1-Edim@1 Gm@2`         | A bar where every chord gives beats lasts their sum: a 2/4 bar in 4/4             |
| `Fm@1`                     | A first bar shorter than the meter is a pickup                                    |
| `C:t1 F`, `C-G:1`          | A method code; a chord without one takes its bar's first code                     |
| `D/F#`                     | A slash chord; a bass that is a chord tone is spelled as that tone (`D#/F𝄪`)      |
| `C _ G`, `_@2`             | No chord: nothing printed over the bar, no pattern there, only what a hand writes |

A bar's beats are the meter's: a quarter each in simple time (2/2 has four), a dotted quarter in compound time (6/8
has two, 12/8 four). Beats fall on whole ticks (5040 a beat, so every value to the 64th, `.0625`, and every
tuplet of two to nine notes is whole); what a decimal of four places cannot write is a fraction: `1:3` a triplet
8th, `2:3`, `1:6` a triplet 16th, `1:7` a septuplet 16th (a quintuplet 16th is `.2`). Tuplets are not written
as such: notes of a tuplet's length are engraved in its bracket.

**Barlines** between bars: `|:` starts a repeat, `:|` ends one, `||` a double barline, `|.` the final one, `[1` or
`[2` before a bar puts it in that ending: `'|: G C [1 D :| [2 D7 G |.'`. **Jumps:** `Segno` or `Coda` before a bar;
`Fine`, `ToCoda`, `DC`, `DC.Fine`, `DC.Coda`, `DS`, `DS.Fine` or `DS.Coda` after one.

**Chord symbols** are read in every spelling `qualitySpellings` lists (`src/shared/lib/music/chord.ts`): `m`, `7`,
`Maj7`/`M7`/`Δ`, `m7b5`/`ø`, `dim`/`°`, `dim7`/`°7`, `sus4`, `sus2`, `6`, `m6`, `6/9`, `add9`/`2`, `9`, `13`, `7b9`,
`7#9`, `7#5`, `7alt` and more. `b` and `♭`, `#` and `♯` read alike. A hyphen separates chords, so write `7b9`, not
`7(-9)`. Note names are international: B, never H.

**Method codes** are a method book's ways of playing: `1`–`5`, `t1`–`t5`, `3ch`, `inv`, `5.1`–`5.3`, `6u`, `6d`,
and level 2's `oct`, `octs`, `ch` (`content/methods.ts` in `entities/pattern`). A chart that uses them, or a section
with a `pattern`, starts the Player on its own plan: a coded chord plays its method's pattern, any other chord its
section's pattern, else the piece's.

**A workbook's plan as a chart** (Called to Play): each chord over the words is a bar; chords joined by a dash share
it; a chord that names two ways (`3 | ♪♩`) is written twice, half the bar each (`Dm:3-Dm:t1`). The rhythm icons are
the `t` codes in the workbook's order (♪♩ `t1`, the rising staircase `t2`, the run down from two notes `t3`, the four
flat-beamed notes `t4`, the chords `t5`); `Invers.` is `inv`, `3 chords` `3ch`, `6th↑` `6u`, `6th↓` `6d`; level 2's
`Октавы`, `Октавы (гамма)` and `Chords` are `oct`, `octs`, `ch`. A way printed once over a run of chords is the
piece's `pattern`. What the codes cannot say (`3↑`, `(melody)`) goes in its `note`.

## Single staves and lyrics

`staves: [{ notes: 'E4/1 D4/.5 r/1 | C#5/1.5', name?, clef? }]` are the staves over the piano, top down. Notes are a
name with its octave (C4 is middle C), a slash, then beats; `r` is a rest; `|` may mark bars and is ignored. A staff
is in the piece's key, no longer than the chart, and keeps the spelling written (`C#5` stays C♯). `name` is a
`LocalText` printed at its first line; `clef: 'bass'` where it is not treble. The top staff is the tune: the Setup's
Melody and the tune patterns (`r5`–`r7`) play it. A built-in piece has one staff, unnamed. Notes take the same
[marks](#written-hands) as a hand's.

`lyrics: ['Si-_ lent night, ho-_ ly night, …']`, a verse a string. Syllables are parted by spaces, one under each
note in turn of the staff they are on (the top single staff, else the right hand's onsets, a chord one note; a rest
takes none). `-` ends a syllable its word carries on (`A- ma- zing`); `_` holds the syllable over one more note (`Si-_
lent` sings "Si" on two); `~` leaves a note's place empty. Punctuation stays with its syllable. A verse is no longer
than its staff's notes. `lyricsOn` names another staff: a single staff by its place (`1`) or `'rh'`, the upper staff
of a piece with single staves.

## Written hands

`hands: { rh?, lh? }`: bars of either hand written note by note, played in place of the pattern's hand there. A hand
is its bars separated by `|`, one entry for every bar of the chart in order. A learner's version writes every bar of
both hands; built-in content may leave bars to the pattern.

| Written                  | Means                                                                   |
| ------------------------ | ----------------------------------------------------------------------- |
| `-`                      | The pattern plays this hand in this bar                                 |
| `C4/1 E4/1 G4/2`         | Notes one after another, each a pitch and its beats                     |
| `C4+E4+G4/2`             | Notes struck together                                                   |
| `E4^3`                   | A finger, 1–5                                                           |
| `r/1`                    | A rest; a bar of rests is written silence, not the pattern              |
| `C3/4 E3+G3/1@2 E3+G3/1` | `@beat` starts a token on a beat counted from 1 (`@2.5` the "and" of 2) |
| `F4/1:3 D4/1:3 E4/1:3`   | A triplet; `C4/.2` a quintuplet 16th; `C4/.0625` a 64th                 |
| `C4+E4/1[acc,stacc]`     | Marks after a token, on each of its notes                               |
| `clef:bass G2/1`         | First in a bar, changes the staff's clef from that bar on               |

In the piece's key, accidentals as printed (`E5` in a D♭ section is E natural), on whole ticks, every note on the
piano. A note may run past its bar only into a bar where the same hand is written: it is tied across.

**Marks**, joined by commas in brackets: articulations `stacc` `staccatiss` `acc` `ten` `marc` `ferm`; one ornament
`tr` `mord` `lmord` `turn` `iturn` (inverted), `trem1` `trem2` `trem3` (a tremolo's strokes); `port` (portato),
`breath` and `caes` (a breath mark or a caesura after the note); `arp` rolls the chord; `(` and `)` start and end a
slur; `8va` writes the notes an octave lower than they sound, `8vb` higher, `15ma` and `15mb` two octaves; `gliss`
slides to the next note; dynamics `ppp` to `fff` and the accents `sf` `sfz` `sffz` `fz` `rf` `rfz` `fp` `sfp`
`sfpp` `pf` (struck on their note alone, or struck at one level and held at another); a hairpin `cresc` or `dim`,
`/hairpin` to end it; expressions `dolce` `cantabile` `espress` `legato` `leggiero` `rit` `rall` `accel` `atempo`;
the pedal `ped`, `pedch`, `pedup`; `gr:D5+E5` grace notes. A pitch is always the one heard. A rest takes no marks.

## A recording

`recording: { src, start, tempo }`: a performance (a singer's) that plays along in Listen, in the piece's own key, at
any tempo with its pitch kept.

- **The file:** AAC in an `.m4a` at 128 kbps beside the piece's file
  (`afconvert -f m4af -d aac -b 128000 in.mp3 piece-vocal.m4a`), under the 2 MiB precache limit, imported with
  `?url` so the build fingerprints and precaches it.
- **`start`:** the second where bar 1's downbeat falls, which is not the first sound when the voice starts with a
  pickup. Find it by ear, then check the grid against later landmarks.
- **`tempo`:** measured, never taken from the chart (a singer's is often not the chart's). Time a passage that
  repeats and check every landmark falls within 50ms of its beat. Its form must be the chart's.

## Written in degrees

A song a course teaches in degrees, to be played in any key, has a `progression` in place of `sections`; its chords
grow with the chord size the learner picks. It is still `kind: 'song'` (`isDegreePiece` tells the format). A
progression that is only practised is not a piece: it goes in [the progressions library](#the-progressions-library).

```ts
  key: 'Dm',
  chordSize: { default: 'sevenths', choosable: true },
  progression: [
    { kind: 'verse', lines: ['i:min:4 iv:min:2 V:=sus4:2 i:min:4', 'ii:hd:4 V:=sus4:2 V:=maj:2'] },
    { kind: 'chorus', last: true, lines: ['iv:min:2 i:=min:2/3 ii:hd:1 V:=maj:1 i:=m6:2'] },
  ],
```

Sections are a chart's (`kind`, `n`, `label`, `last`, `detail`, `lines`); each line starts a new bar and is one
printed line. Each chord is `degree:function:beats`, optionally `/3`, `/5` or `/7` for that tone in the bass (it must
exist at every chord size allowed).

- **Degree:** `I`–`VII` in either case, measured on the major scale from the tonic, in minor keys too (`♭III` is a
  minor key's relative major). `♭`, `b`, `#` or `♯` before it makes a chromatic degree.
- **Function**, by chord size (triads / sevenths / ninths): `maj` maj, Maj7, Maj9 · `min` m, m7, m9 · `dom` maj, 7,
  9 · `domb9` maj, 7, 7♭9 · `hd` °, m7♭5, m7♭5 · `=quality` that quality at every size (`V:=b9:4`, `♭VII:=sus2:1`;
  ids from `chord.ts`).
- **Chord size:** `{ default, choosable }`; `choosable: false` fixes it.

Chords fill the meter's bars in order, a long chord tied into the next. **As printed:** write a printed triad,
suspension, 6th or slash chord as a fixed quality (`=maj`, `=sus4`, `=m6`, `/3`) and a printed 7th chord as a
function, so the chord size grows only the 7ths, as an accompanist would.

## Credits

`credits: [{ role, names }]`, `names` exactly as printed, `role` one of `authors` (no role printed),
`words-and-music`, `words`, `music`, `russian-text`, `harmony`, `accompaniment`; `{ role: 'unknown' }` for "Author
unknown". `Words: А. Кетлер · Music: А. В. Зименс` is
`[{ role: 'words', names: 'А. Кетлер' }, { role: 'music', names: 'А. В. Зименс' }]`.

## Text

Text a learner reads is `LocalText` (`{ en, ru }`, both non-empty): notes, collection names, section details,
pattern and figure names and descriptions, method labels. Titles and credit names stay as printed.

**The copy rule:** no sentence that repeats what the interface shows (the chart, the meter, the key, a pattern's
own description), no mention of controls, no how-to. A note says what the learner could not see: where the chords
came from, a quirk of the printed score, what the source asks.

## Patterns and figures

In `src/entities/pattern`: ids in `model/types.ts`, figures in `content/figures.ts`, patterns in
`content/patterns.ts`, method codes in `content/methods.ts`. The compiler demands an entry for every id.

- **A figure** (one hand's part): its id in `RIGHT_FIGURE_IDS` or `LEFT_FIGURE_IDS`, then
  `{ name, figure: eventFigure('…') }`.
- **A pattern:** its id in `PATTERN_IDS`, then `{ group, name, idea, description?, rh, lh }` naming two figures.
  `idea` is one line in both languages, what it sounds like and what each hand does. `description` is the source's
  fuller text, on the pattern's page. A right hand that plays the tune makes a tune pattern, which falls back to `r4`
  on a piece with no single staff.
- **A method code:** its code in `METHOD_CODES`, then `{ pattern, label }`.

`eventFigure(events, { inThree?, onMajor?, triplets?, inCompound?, inCompoundOnMajor?, inSix? })`. `events` are
comma-separated `start/length tones` in 16ths of a 4/4 bar (triplet 8ths with `triplets: true`). `inThree` replaces
them in 3/4, `onMajor` on major chords. `inCompound` replaces them in 6/8 and 12/8, in 16ths of the dotted-quarter
beat (24 to a 12/8 bar; 6/8 plays the first twelve), `inCompoundOnMajor` on major chords there; a figure whose events
all fall on beats needs none. `inSix` gives a 6/8 bar a two-beat form. Tones join with `+`, each optionally
`^finger`; an event ending `!` is accented.

| Token           | Plays                                                                                 |
| --------------- | ------------------------------------------------------------------------------------- |
| `C`             | The chord, voice-led from the last one                                                |
| `T` `T1` `T2`   | The close triad from the root, or its 1st or 2nd inversion                            |
| `T8` `T15`      | The close triad one or two octaves up                                                 |
| `U`             | The chord's upper notes as `C` voices it, all but its lowest                          |
| `1`–`22`        | A degree above the root, on the chord's own 3rd, 5th and 7th (`8` the octave)         |
| `vN`            | The Nth note of the voiced chord from the bottom; past its top, an octave up          |
| `_7` `_b7` `_6` | 1, 2 or 3 semitones below the root                                                    |
| `sN`            | N steps up the chord's major or minor scale from the root (`s0` the root)             |
| `LN`            | Degree N above the bass, in the left hand's register                                  |
| `Ka` `Kb` `Kc`  | The key's I, IV and V triads (i and iv in a minor key), voice-led                     |
| `Sh`            | Over the bass, the chord's 7th, or its 5th where it has none: a jazz shell            |
| `A`             | A semitone under the next bass: a chord's last bar leads on, any other back to itself |

`0/4 C,4/4 C,8/4 C,12/4 C` is a chord on every beat; `0/16 L1+L8` an octave held for the bar. Events of two to four
notes with no finger are fingered automatically. A chord plays its figures in windows of one bar; a chord shorter
than two beats picks the pattern up where it sits in the bar.

## Lessons and courses

Two kinds of lesson, kept apart; `src/app/content/worksheets.test.ts` holds both.

- **A journey's lesson** is a file in `src/entities/lesson/content/` (a `Lesson`), listed in `content/index.ts` and
  placed in a chapter of `content/journeys.ts`: four journeys, one to a stage, each in chapters of lessons, then the
  chord families or scales the chapter's Check asks. It teaches theory: it plays no piece, shows no pattern, names no
  method book and links only journey lessons and Practice.
- **A course** is a folder `src/entities/course/content/<course>/`: `index.ts` (a `Course`: `id`, `shelf`, `stage`,
  `title`, `summary`, `weeks`, its `lessons` in order and its guided `songs`) and a file per lesson. Its lessons link
  no lesson, play only its own songs and show only its own book's patterns. A piece is the song of one course at
  most. A method book's course keeps its book's content and order. The scale and arpeggio courses build a lesson
  per key (`content/scale-lessons.ts`). Its icon is in `ui/course-look.ts`.

A lesson is an `id`, a `title` and `summary` in both languages, and `sections`, each a `heading` over `blocks`.

**How a lesson reads** (tested): each section shows something (an example, a question) within its first two blocks
and says at most 35 words in English; sentences stay under 30 words (aim for 20), with no semicolons; a term is
bold (`lead`) where it is first defined; a section ends with something to play. A lesson ends on **Try it**:
questions on the keys, then links to practise. Depth comes from more examples, not longer prose. It teaches music;
it never explains a button.

| Block         | Written                                                                            | Shows                                 |
| ------------- | ---------------------------------------------------------------------------------- | ------------------------------------- |
| `text`        | `{ kind: 'text', lead?, text }`                                                    | a paragraph, its lead bold            |
| `steps`       | `{ kind: 'steps', steps: [...] }`                                                  | a numbered list                       |
| `note`        | `{ kind: 'note', text }`                                                           | a callout                             |
| `chords`      | `{ kind: 'chords', symbols: ['C2', 'Cadd9'], apart?, melody? }`                    | a button each that plays the chord    |
| `grid`        | `{ kind: 'grid', quality: 'm7' }`                                                  | the quality on all twelve roots       |
| `scale`       | `{ kind: 'scale', root: note('D'), scale: 'dorian' }`                              | its name, notes, run on a staff, Play |
| `interval`    | `{ kind: 'interval', root: note('C'), interval: 'M3' }`                            | the Intervals explorer's card         |
| `notes`       | `{ kind: 'notes', clef: 'treble', notes: 'E4 G4/2 B4/8.', bass?, meter?, key? }`   | the line on a staff, Play             |
| `voicings`    | `{ kind: 'voicings', voicings: [{ symbol, degrees, hands: 'A3 C4 E4' }], key? }`   | voicings as written, on a grand staff |
| `pattern`     | `{ kind: 'pattern', pattern: 'r4', piece: 'otche' }`                               | the pattern over the piece, Play      |
| `progression` | `{ kind: 'progression', numerals: 'ii V I', key, size? }`                          | a row of chords and its link          |
| `question`    | `{ kind: 'question', ask, answer: { chord: 'Em' } }` or `answer: { notes: [...] }` | answered on the keys                  |
| `link`        | `{ kind: 'link', title, target: { opens: … } }`                                    | a row into a page or the Player       |

- **`chords`:** `apart` plays each on its own in root position; otherwise a row on several roots is voice-led.
  `melody` voices each chord close under that note.
- **A line of notes:** each note with its octave, then `/` and its value (`1`, `2`, `4` the default, `8`, `16`), a dot
  for half again (not on a 16th); `r` a rest; `~` ties to the next of its pitch (`G4/2~ G4/4`). Meters 2/4, 3/4, 4/4,
  6/8, 12/8 in whole bars; `key` writes a signature; `bass` adds a left-hand line on a grand staff.
- **Values:** notes are kernel values (`note('B', -1)`), keys `{ tonic: note('E', -1), minor: false }`. Numerals
  read as Progressions reads them, a minor key from natural minor (`V7`, `I6`, `ii9`, `iiø7`; lower case for a minor
  3rd).
- **A pattern block** plays over the piece its source teaches it on. A tune pattern (`r5`–`r7`) needs a piece with a
  single staff. The lesson says why the pattern is there; its name and description come from the pattern.
- **A link `opens`:** `chords` (`chord`), `scales` (`root`, `scale`, `show?`), `key`, `intervals` (`root?`),
  `tensions` (`chord`, `root?`), `lesson`, `progressions` (`numerals`, `key`, `size?`), `between` (`key`, `from`,
  `to`), `harmonise` (`key`, `note`), `song-chords` (`chords` as typed), `quiz` (a trainer id), `piece` (`piece`,
  `pattern?`), `exercise` (`exercise`, `root?`, `quality?`, `kind?`) or `player` (a progression: `numerals`, `key`,
  `size?`, `walk?`, `inversion?` 0–3).

## The progressions library

`src/entities/progression-library/content/library.ts` lists the progressions that are practised, **one entry per
idea**: a `style` (`pop`, `rock`, `jazz`, `blues`, `classical`, `soul`, `gospel`, `theory`), an `id`, its lines
(`major`: `I V vi IV`; `minor`: `ii° V i`, from natural minor; one at least), the name in both languages, and where it
has them a `note` (one line, by the copy rule), the `pattern` and chord `size` its Player opens with.

- **A minor version is the entry's `minor` line, never another entry**: a cadence's minor-key form, a pop loop heard
  from its relative minor.
- Write a chord where the style plays it at any size (the blues' `I7`, `V7♭9`, `I6`); leave a triad plain where it
  should grow with the size.
- **No line is another as a loop** (from another chord, with a chord held, at another size, or in the relative key);
  a test holds it.
- A way of playing is not an entry: a walk through the keys, lead-ins, a chord size.
- **A name is the one musicians use** (`I IV V IV` is Wild Thing).

## What the tests check

- `src/entities/piece/content/catalog.test.ts`: the counts; every piece parses at each chord size it allows and arranges in all 12 keys with its own pattern and all 48, every note on the piano, roots with one accidental at most, no silent bar; staves and verses fit; tempos; both languages.
- `src/features/practice/notate-pieces.test.ts`: every piece engraves in its own key and pattern, and every pattern in 4/4, 3/4 and 12/8, each voice filling its bar.
- `src/app/content/worksheets.test.ts`: lessons: ids, both languages, every symbol, note line, answer and link read by the kernel, the prose rules; journeys and courses kept apart, every guided song a piece in one course.
- `src/entities/pattern/content/patterns.test.ts`: counts, ids, fallbacks, both languages.
- `src/entities/progression-library/content/library.test.ts`: ids, both languages, every line read in its mode, no two lines one loop, every style used.
- `src/widgets/lesson-view/model/pattern-example.test.ts`: every pattern block plays over its piece from its first beat.

A mistake names its place: `bz10 · section 2, line 1, bar 3: unknown chord symbol "Qm"`.
