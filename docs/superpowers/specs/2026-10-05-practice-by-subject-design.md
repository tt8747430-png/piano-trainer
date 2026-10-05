# Practice by subject: one page for each thing practised

- **Date:** 2026-10-05 · **Follows:** ADR 0029 (Learn teaches, Practice holds what is practised by topic)
- **Decision record:** ADR 0030, written with the last sub-project.

## What the owner said

After the overhaul of ADR 0029 the owner read Practice again and found it moved, not rebuilt:

- "Progressions" is there three times (a topic, a tool with its own library, a list of pieces), with the
  "Through the keys" exercises beside them; _Daisy fields_ is a song listed as a progression.
- "Chords of a scale" and "Chords by semitones" are rows of their own, though the Scales page walks a scale's chords
  and the Chords page walks a chord by semitones.
- The old Learn pages sit under an "Explore" heading as a list of links: the same pages, one level down.
- The Progressions library is a column of rows with chevrons that choose a progression in place: they look like
  links to another page.
- The explorers put their choices in one column and "the rest" in another; the split follows no order of reading.
- One black key is D♭ on one screen and C♯ on the next, and sometimes both on the same screen.
- The quizzes are spread over the topics; they could be one page, grouped.

Carried over from the earlier brief and checked again here: the Songs page and a song's page ("Chords in this song"
over a second "Chords"), the learned badge, the keyboard's proportion and its rail, focus rings on every control,
the Setup, the New song sheet and the score editor. The Path is left alone.

## What success looks like

A learner opens Practice and sees seven places, each named for what is practised. Each place is one page that shows
the thing on the keys, changes it, plays it and sends it to the Player. Nothing is reachable from two lists, nothing
that chooses in place looks like a link, and a note has one name on a screen.

Assumptions (the owner gave references, not answers): a hub of rows is preferred to a strip of seven tabs, because
on a phone four of seven tabs would be off the screen; "merge" means one page and one model, not one long page that
stacks the old ones.

## 1. Practice: seven places

`/practice` is a title, My gaps in its bar, and one grid of row links. No tabs, no `?topic=`, nothing remembered.

| Row | Opens | What is inside (the row's one line) |
| --- | --- | --- |
| Chords | `/practice/chords` | Build · Find · Tensions |
| Scales and keys | `/practice/scales` | Scale · Chords · Key |
| Progressions | `/practice/progressions` | Any key · Passing chords · Reharmonise |
| Intervals | `/practice/intervals` | — |
| Accompaniment | `/practice/patterns` | Patterns · Studies |
| Exercises | `/practice/exercises` | Technique · Barry Harris · Piano With Jonny |
| Quiz | `/practice/quiz` | every trainer |

The rows are the page's own list; `pages/quiz/model/quiz-groups.ts` holds every trainer to one group by a test.
`topics.ts`, `TopicPanel`, the topic tabs and Practice's remembered view go.

**Quiz** (`/practice/quiz`, `pages/quiz`): the trainers in four groups, each row saying its runs: Chords (Build
chord, Name chord, A chord's role), Scales and keys (Build scale, Key signatures, The degrees of a key), By ear
(Intervals, Chords, Scales), Reading (Reading notes). My gaps is the page's action. A trainer's Back leads here.

**Exercises** (`/practice/exercises`, `pages/exercises`): the exercises that belong to no other page, by group:
Technique, Barry Harris, Piano With Jonny. The scale exercises open from the Scales page and the arpeggio from the
Chords page, with the scale or chord already chosen.

**Accompaniment**: Patterns (`/practice/patterns`) and Studies (`/practice/studies`, the studies as row cards) are
two tabs of one page family (`SubjectTabs`, tabs that are links).

**The exercise catalogue loses what other pages already do.** The five "way" exercises (Chords of a scale, Chords
by semitones, and the three progressions through the keys) are deleted with `WayExercise` and `ExerciseWay`: the
Scales page walks a scale's chords, the Chords page walks a chord by semitones, the Progressions page plays any
progression through the keys. The groups `chords` and `progressions` go.

## 2. Progressions: one library, one page

One model: **the progression library**. A library progression gains what the authored pieces carried:

```ts
interface LibraryProgression {
  id: string
  style: ProgressionStyle
  name: LocalText
  numerals: string
  minor: boolean
  note?: LocalText // what it teaches, in a line
  pattern?: PatternId // the pattern its Player opens with
  size?: ChordSize // the chord size it opens at
}
```

- The twelve authored progression pieces dissolve into it. Each twin keeps the library's name and takes the piece's
  note, pattern and size: `flow` → `doo-wop`, `pop` → `axis`, `twofive` → `jazz-cadence`, `cadence` → `authentic`,
  `mcadence` → `minor-cadence`, `minorpop` → `minor-pop`, `minor251` → `minor-two-five`, `blues` → `twelve-bar`.
  New entries: `dominant-resolution` (`V I`, 9ths), `flat-nine-resolution` (`V7♭9 I`, 9ths),
  `minor-flat-nine-resolution` (`V7♭9 i`, minor, 9ths), `stack-your-chords`, `round-the-circle`
  (`I IV vii° iii vi ii V I`).
- Numerals read a dominant's written ♭9 (`V7♭9`), so the three resolutions keep their sound.
- The library's own twins merge: one entry per line of numerals in a mode; a second style's name is dropped.
- `COMMON_PROGRESSIONS` becomes the library's `COMMON` ids per mode.
- **_Daisy fields_ is a song**: `kind: 'song'`, still written in degrees as its course teaches it, in a new Songs
  collection "Other songs". A piece's format (a chart, or degrees) is no longer its kind:
  `isDegreePiece(piece)` replaces every `kind === 'progression'`. The kind `progression`, the collection
  `progressions`, `PROGRESSIONS` and `/practice/progressions/$pieceId` go. The Path loses the twelve steps; a saved
  mark for one names a piece no longer there, which the stores already allow.

**The page** (`/practice/progressions`), read top to bottom:

1. The keys (pinned), showing the chord last played.
2. The progression as a row of chords in the key, each to tap, with **Play**; its note under it.
3. What it is: the **key** (all 24 keys in sight), the **progression** (a pop-up button grouped by style, the
   Choosing Rule's control for a long list; "Your own" when typed) with the typed field beside it, the **chord size**.
4. **Practise in the Player**: in this key, or through the keys (fifths, fourths, half steps).

**Passing chords** (`/practice/progressions/passing`) and **Reharmonise** (`/practice/progressions/reharmonise`) are
the page family's other two tabs, each opening as it was left (ADR 0022). Their old paths go.

## 3. Chords: build and find on one page

- `/practice/chords` (Build) and `/practice/chords/find` (Find) are two tabs. `/practice/chord-finder` goes.
- **Tensions are a part of the built chord.** Under a chord that takes them (a 7th chord of `TENSION_CHORDS`) the
  page shows its twelve notes in the four groups, each played on top. `/practice/tensions`, its page and its own
  root and chord pop-ups go; a lesson's link to tensions opens the builder on that chord.
- **Practise in the Player**: Arpeggio (the exercise, on this chord) and Through the roots (the chromatic walk).

## 4. Scales and keys

- Scale · Chords · Key become tabs (the page's sections), the root a note picker.
- **Practise in the Player**, on the Scale tab: the scale, in 3rds, in 6ths, in groups, in contrary motion, each
  opening its exercise on this root and kind. On the Chords tab: Walk the chords, and the key's common progressions,
  each opening the Progressions page in this key.

## 5. One layout for a page that shows a thing on the keys

`Workbench` (the kit) replaces the two columns: the keys pinned; then **what it is** (its name large, its facts, the
one honey Play); then **its choices**, a grid of labelled fields that takes as many columns as fit (`grid-fields`,
at least 20rem each); then titled sections (a staff, tensions, Practise in the Player). A phone reads it as one
column in the same order. Chords, Scales, Progressions, Passing chords, Reharmonise, Intervals and Find use it.

**A row that chooses is not a row that leaves.** `RowLink` (a chevron) is only ever a link. A choice among rows is a
pop-up button, segments, or `ChoiceRow` (a radio: its mark at the left, no chevron).

## 6. A note has one name on a screen

- **One chooser for a note, one for a key.** `NoteDropdown` and `KeyDropdown` go. `NotePicker` shows the twelve
  notes; `KeyPicker` shows the keys by their own names, the major row over the minor row (C♯ minor and D♭ major are
  two keys, each with one name), one row where the mode is fixed. No chooser relabels itself.
- **Inside a key, everything is spelled by the key:** the circle of fifths names the key's own chords as the key
  does (G♭ and E♭m in D♭ major, not F♯ and D♯m).
- **A borrowed root is named plainly,** with its tones: E, A and B in D♭ major, not F♭, B𝄫 and C♭. Passing chords and
  Reharmonise keep ADR 0019's rule (letters, then plainly): a tritone substitution is spelled from where it falls.

## 7. The rest of the brief, checked

- **A song's page:** "Chords in this song" becomes **Chords** (the chords it plays, to tap) and the chart's heading
  becomes **Chart**; the Check sits with the chords.
- **Learned** is one mark: a grass check in a circle, the same on a row and on the song's button.
- **The keyboard's rail:** scroll ‹ ›, then glissando and settings as pressed toggles; each button's focus ring drawn
  inside the rail, whole.
- **The score editor's sheet** was blank only in a hidden browser tab, where no staff is ever "on screen"; it is
  no fault of the app.

## Build order

Each lands as its own commit, verified by `typecheck`, `lint` and `test` (and `build` where routes change):

1. Practice's seven places: the hub, Quiz, Exercises, Accompaniment's tabs, the catalogue without its ways.
2. Progressions: the library as the one model, _Daisy fields_ a song, the page and its two sibling tabs.
3. Chords: Build and Find, tensions in the builder, Practise.
4. Scales and keys: tabs, the note picker, Practise.
5. The workbench layout and the choosers; the naming rules.
6. The song's page, Learned, the rail, the editor's sheet.
7. ADR 0030 and the product, design, language and code notes.

## Testing

Every page keeps its screen test through `renderApp`; a test of a removed path asserts the Not found page. New pure
logic (`subjects.ts`, the library's merge, the numerals' ♭9, `isDegreePiece`, the plain names) is written test first
beside its module.
