# The chromatic walk, and «Ромашковые поля» as the course writes it

- **Status:** agreed with the owner 2026-09-29 (brainstorming: three questions, then the design approved as
  presented).
- **Builds on:** ADR 0014 (the walk as a Performance handed to the Player; a new source is one more hook filling
  `PlayerLayout`), `docs/CONTENT.md` (progressions), the roadmap's §10.5 (exercises).
- **From:** three PDFs of Vasily Gorshkov's accompaniment course (@stein_way): «Нонаккорды» (theory), «Нонаккорды.
  Практика» (Exercise 2 and the song's 9ths) and the chart of «Ромашковые поля».

## 1. What the owner asked

> look at this and update the informations if they are wrong and update this song with the needed chords and also
> update the docs specs or plans if needed also i want to be able to walk different types or selected types of chords
> chromaticaly not just in the specific key or scale.

Answered in the session:

| #   | Question                                                   | Answer                                                          |
| --- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| 1   | Several chord types chosen: in what order does the walk go? | **Root by root**: every chosen type on a root, then a semitone on |
| 2   | Where does «Ромашковые поля» live as the whole song?        | **Stays on Practice**, with the progressions, the whole song      |
| 3   | Does the 9ths theory become a Learn lesson?                 | **No**: the song and the walk only                                |

### 1.1 What was wrong

**The app's «Ромашковые поля»** (`progressions/romashki.ts`) against the course's chart:

- Only the chorus: no verse (10 bars), no 2nd ending (`Em7♭5 A Dm6`), the two endings not told apart.
- At 7ths (its default) it played **C7** where the course writes **C**, **A7** where it writes **A**, and **Dm7/F**
  where it writes **Dm/F**: every chord was a function, so every chord grew.
- At 9ths it grew the triads too (C9, A7♭9, Dm9/F). The course grows only the song's 7th chords («любой септаккорд
  песни мы можем преобразовать в нонаккорд»): Dm7 → Dm9, Gm7 → Gm9, and D7 → D7♭9 into Gm.

**The PDFs** (not app content; recorded so the corrections are not lost):

- «Нонаккорды», p.3: "G + Dm = **Am9**" is **G9** (G B D + D F A = G B D F A).
- Typos: «калоритное» → «колоритное» (p.2), «котоый» → «который» («Практика», p.3).
- p.4 calls the second layout «принцип обращения аккордов». The root stays in the bass, so the chord is not inverted:
  the right hand's four notes are laid out from the 7th (7‑9‑3‑5) instead of from the 3rd (3‑5‑7‑9). These are the
  two rootless Voicings of jazz comping.
- Naming: the course names a 9th chord after its 7th chord (m9 «малый минорный», Maj9 «большой мажорный», 9 «малый
  мажорный»). Classical Russian theory names it by its 9th (большой or малый нонаккорд: G9 is the большой
  доминантовый, G7♭9 the малый). The app's names (`music.quality`: m9 «Малый минорный нонаккорд», maj9 «Большой
  мажорный нонаккорд», n9 «Доминантнонаккорд») follow the course and are consistent; nothing changes.
- The degree labels (`7` for a minor 7th, `#7` for a major one) are the course's convention; the app labels by one
  rule (`♭7`, `7`).
- Checked and right: a 9th as two stacked triads (minor + minor = m9, major + major = Maj9, major + minor = 9); the
  bass in the left hand and the four upper notes in the right; the "split the root" shortcut (Cm → B♭ D E♭ G);
  D7♭9 as F♯°7 over D, symmetrical in every inversion; ♭9 into a minor chord, 9 or ♭9 into a major one; Exercise 2's
  spellings (G♯m9, A♭Maj9, A♭9).

The app already voices a 9th the course's way: `rightHandPitchClasses` gives the right hand 3‑5‑7‑9 over the left
hand's root, and voice-leading picks between the layout from the 3rd and the one from the 7th.

## 2. «Ромашковые поля»: the whole song, still a Progression

### 2.1 A Progression may be written in sections

Today a Progression is one string packed into bars, headed "Progression". It gains sections, so a song-shaped
progression reads as the course prints it while its chords still grow with the Chord size.

```ts
/** A Progression's section: a chart Section's heading, its chords as a progression. */
export interface ProgressionSection extends Omit<Section, 'lines'> {
  /** Degree, function and beats per chord: `i:min:2 iv:min:2`. */
  readonly progression: string
}

export interface ProgressionPiece extends PieceCommon {
  readonly kind: 'progression'
  readonly chordSize: { readonly default: ChordSize; readonly choosable: boolean }
  /** One progression, headed "Progression", or sections headed as a chart's. */
  readonly progression: string | readonly ProgressionSection[]
}
```

- **Parsing** (`parseProgression`): each section is packed into bars on its own (a section starts on a new bar), four
  bars a line, exactly as the one string is today; the Chart has a section per section. A mistake names its section
  and chord: `romashki · section 2, chord 5: unknown function in "♭VII:mj:1"`.
- **Headings** (`usePieceHeadings`): a string's one heading is "Progression" as today; sections are headed by
  `useSectionHeading`, as a chart's are.
- The other 13 progressions keep their one string; nothing else reads `progression`.

### 2.2 The song

Key D minor, 4/4, 72, `pop8`, Chord size 7ths by default and choosable. Written triads, suspensions, the 6th and the
slash chords are **fixed** (`=quality`), so they read as the course writes them at every size; the 7th chords are
**functions**, so they grow. Degrees count on the major scale from D (CONTENT.md).

| Bar | Course       | Written                                   |
| --- | ------------ | ----------------------------------------- |
|     | **Verse**    |                                           |
| 1   | Dm7          | `i:min:4`                                 |
| 2   | Gm7 Asus     | `iv:min:2 V:=sus4:2`                      |
| 3   | Dm7          | `i:min:4`                                 |
| 4   | Gm Csus4     | `iv:=min:2 ♭VII:=sus4:2`                  |
| 5   | Am D         | `v:=min:2 I:=maj:2`                       |
| 6   | D/F♯ Gm      | `I:=maj:2/3 iv:=min:2`                    |
| 7   | Csus4 C F    | `♭VII:=sus4:1 ♭VII:=maj:1 ♭III:=maj:2`    |
| 8   | B♭ Gm        | `♭VI:=maj:2 iv:=min:2`                    |
| 9   | Em7♭5        | `ii:hd:4`                                 |
| 10  | Asus A       | `V:=sus4:2 V:=maj:2`                      |
|     | **Chorus**   |                                           |
| 11  | Dm7 Gm7      | `i:min:2 iv:min:2`                        |
| 12  | Csus2 C FMaj7 D7 | `♭VII:=sus2:1 ♭VII:=maj:1 ♭III:maj:1 I:domb9:1` |
| 13  | Gm7 Dm/F     | `iv:min:2 i:=min:2/3`                     |
| 14  | Em7♭5 Asus4 A (1st ending) | `ii:hd:2 V:=sus4:1 V:=maj:1` |
|     | **Last chorus** |                                        |
| 15–17 | as 11–13   | as 11–13                                  |
| 18  | Em7♭5 A Dm6 (2nd ending) | `ii:hd:1 V:=maj:1 i:=m6:2`   |

("Asus" is the course's shorthand for Asus4, as its chorus writes it.)

- **The repeat is written out:** the chart format has no repeat signs or endings, so the chorus is a section twice,
  the second `last: true` ("Last chorus"), each with its own ending. 18 bars; the bar numbers up to 14 are the
  course's.
- **At 7ths** it reads exactly as the course: `Dm7 | Gm7 Asus4 | Dm7 | Gm Csus4 | Am D | D/F♯ Gm | Csus4 C F | B♭ Gm
  | Em7♭5 | Asus4 A`, then `Dm7 Gm7 | Csus2 C FMaj7 D7 | Gm7 Dm/F | Em7♭5 Asus4 A`, then the same with `Em7♭5 A Dm6`.
- **At 9ths** only the 7th chords grow: Dm9, Gm9, FMaj9, D7♭9 (into Gm9, as the course resolves it); Em7♭5 stays
  (its 9th, F♯, is not in D minor; the `hd` function never grows past it).
- **At triads** the 7th chords drop to their triads: Dm, Gm, F, D, E°.
- The id `romashki`, its title and English title, its place in Practice's progressions and its path step stay, so
  saved progress keeps working.
- **Note** (the copy rule: where the chords came from, what the learner cannot see):
  - en: "From Vasily Gorshkov's accompaniment course, the chorus written out twice: with its 1st ending, then its
    2nd. With 9ths only the 7th chords grow, as the course teaches: Dm9, Gm9, FMaj9, and D7♭9 into Gm."
  - ru: «Из курса по аккомпанементу Василия Горшкова; припев выписан дважды: с первой вольтой, затем со второй. С
    нонаккордами растут только септаккорды, как учит курс: Dm9, Gm9, FMaj9 и D7♭9 перед Gm.»

## 3. The chromatic walk

**Term:** the **Chromatic walk** («По полутонам»): the chosen chord qualities, root by root, a semitone at a time,
from a root up to its octave, down, or up and back; in the Player with a song's patterns. It is Practice's first
**Exercise** (a line generated from a rule, in any key).

### 3.1 The chart (`features/practice/chromatic.ts`, beside `walk.ts`)

```ts
export const CHROMATIC_DIRECTIONS = ['up', 'down', 'both'] as const
export type ChromaticDirection = (typeof CHROMATIC_DIRECTIONS)[number]

/** The walk's own tempo and pattern: what the Player plays when its URL chooses none. */
export const CHROMATIC = { tempo: 72, pattern: 'block' } as const

export interface ChromaticChoice {
  readonly root: SpelledNote
  /** At least one, in the table's order. */
  readonly chords: readonly ChordQuality[]
  readonly direction: ChromaticDirection
  readonly pattern: PatternId
  readonly rh: RightFigureId | null
  readonly lh: LeftFigureId | null
}

export function chromaticChart(
  root: SpelledNote,
  chords: readonly ChordQuality[],
  direction: ChromaticDirection,
): Chart
export function arrangeChromatic(choice: ChromaticChoice): Performance
```

- **Roots:** up, the root and the 12 semitones above it to its octave (13); down, the 12 below it (13); both, up to
  the octave and back down to the root (25, the octave once).
- **Root by root:** on each root every chosen quality in the table's order, a bar of 4/4 each; four bars a line. One
  quality from G up is the course's Exercise 2: Gm9 G♯m9 Am9 B♭m9 … Gm9.
- **Spelling:** each chord's root by the kernel's one rule over its intervals (`chordRootSpelling`: sharp under a
  minor 3rd or minor 9th), so a root can be G♯ for G♯m9 and A♭ for A♭Maj9 in the same group, as the course writes
  them.
- **Key:** C major (no signature); the sheet music writes each chord's accidentals. A chromatic walk has no key, so
  nothing may play one: the figures that play the key's triads (`Ka` `Kb` `Kc`, today the right hand's `flow`, and
  so the Chord flow pattern) are closed to it (§3.2), and `chromaticChoice` reads one in the URL as the walk's own.
- **Voicing:** the Player's, unchanged: the left hand's figure on the root, the right hand's chord voice-led (3‑5‑7‑9
  or 7‑9‑3‑5 for a 9th). A chromatic climb that leaves the right hand's range wraps down, as a voice-led chord does.
- `arrangeChromatic` arranges it like `arrangeWalk`: the chosen pattern, the hands' figures.

### 3.2 The Player's page (`pages/player`)

- **Route:** `/play/chromatic` (full screen), `validateSearch: validateChromaticSearch`, defaults stripped. Its
  screen is lazy through `routes/player-screens.ts`, like the walk's.
- **URL** (`ChromaticSearch`): the Player's own params (`PracticeView`), then `chords` (quality ids joined by `.`:
  `m9.maj9.n9`), `root` (a NoteParam), `direction`, `pattern`, `rh`, `lh`. Validation drops unknown and repeated ids
  and puts the rest in the table's order; an empty or missing list is the major triad; `direction` defaults to `up`;
  `root` defaults to C and is respelled as the first chosen chord spells its root (`chordRootSpelling`). No `key`, no
  `chordSize`: a quality fixes its own size, and the root is chosen directly.
- **Hook:** `useChromaticPlayer(search, setSearch)` → `{ choice, performance, player, changeSetup }`, as
  `useWalkPlayer`; `chromaticChoice` and `chromaticPatch` in `model/chromatic-search.ts` read the URL and write a
  Setup change (the walk's own pattern left out).
- **Screen:** `ChromaticPlayerPage` fills `PlayerLayout`; one section, no headings. Title: "Chromatic walk: Gm9 ·
  GMaj9 · G9" / «По полутонам: Gm9 · GMaj9 · G9» (the chosen chords on the first root). ✕ goes back, else to
  Practice.
- **Setup** (`ChromaticSetup`, composed like `WalkSetup`):
  - **Chords:** a `MultiDropdown` of the 36 qualities in the table's order, each labelled by its suffix (the major
    triad's `music.major`) and its name. Unchecking the last one checked leaves it checked: the walk always has a
    chord.
  - **Root:** a `Dropdown` of the 12 pitch classes, each spelled as the first chosen chord spells it.
  - **Direction:** a `Segmented` Up · Down · Up and down.
  - `FigureRows` (pattern and hands' figures) and `PlayingFields` (swing). No Chord size, no melody, no methods.
  - `PlayerSetup` gains `keyed: boolean`, beside `melody`: a source without a key closes the figures that play the
    key's triads, and the patterns made of them, with a note saying why ("Needs a key" · «Нужна тональность»), as a
    source without a tune closes the melody's (`needsMelody`). Which figures those are is the pattern entity's
    (`playsKeyTriads(figure)`), read from the figure's tokens, never listed by hand. Pieces and the scale walk pass
    `keyed`.

### 3.3 Ways in

- **Chords reference:** under a chord the table names (`built.quality`), a `RowGroup` "Practise in the Player" with
  one `RowLink`, "Chromatic walk", opening `/play/chromatic` on that quality and root. A chord the table does not
  name (`13sus4`) shows no row: a Chart chord is a table quality. The row is `features/practice`'s
  (`ChromaticWalkLink`, as `PractiseChords` is), composed by the `chord-explorer` widget.
- **Practice:** a new `RowGroup` "Exercises" («Упражнения») after the Theory quizzes, its first row "Chromatic walk"
  («По полутонам»), opening the walk on its defaults (the major triad from C, up). Sub-project 7's exercises join
  this group.

### 3.4 Words (en · ru)

| Key                        | en                          | ru                        |
| -------------------------- | --------------------------- | ------------------------- |
| `player:chromatic.title`   | Chromatic walk: {{chords}}  | По полутонам: {{chords}}  |
| `player:chords`            | Chords                      | Аккорды                   |
| `player:direction`         | Direction                   | Направление               |
| `player:directions.up`     | Up                          | Вверх                     |
| `player:directions.down`   | Down                        | Вниз                      |
| `player:directions.both`   | Up and down                 | Вверх и вниз              |
| `practice:exercises`       | Exercises                   | Упражнения                |
| `practice:chromatic`       | Chromatic walk              | По полутонам              |
| `player:needsKey`          | Needs a key                 | Нужна тональность         |

## 4. Docs

- `docs/CONTENT.md`: a Progression in sections (the shape, a section starts a new bar); written triads are fixed
  (`=maj`) so only a progression's 7th chords grow.
- `docs/UBIQUITOUS_LANGUAGE.md`: **Progression** (one string or sections); **Chromatic walk**; **Exercise**'s example.
- `docs/adr/0015-progressions-in-sections-and-a-chromatic-walk.md`: both decisions, and what was decided against
  (repeat signs and endings in the chart format; a fixed right-hand layout for the walk; a Learn lesson for now).
- The roadmap: a revision line; §10.1's «Daisy fields» the whole song; §10.5's catalogue gains "Chords by semitones:
  any qualities root by root, up, down or both" (built); the owner's words in §7.
- `CLAUDE.md`: the route `/play/chromatic` and the player screens; `features/practice`'s chromatic walk and
  `ChromaticWalkLink`; progressions in sections.

## 5. Testing (test first, CODE_STYLE and `tdd`)

- `features/practice/chromatic.test.ts`: the roots of each direction (13, 13, 25); root by root in the table's order
  whatever order the choice lists; spellings (G♯m9, A♭Maj9, A♭9 on one root); every quality from every root arranges
  with every note on the piano; the walk is written as sheet music, each voice filling its bar.
- `pages/player/model/chromatic-search.test.ts`: the URL read (defaults, the walk's own pattern, a key-bound pattern
  or figure read as the walk's own) and a Setup change written.
- `entities/pattern`: `playsKeyTriads` true for `flow` alone today; `PlayerSetup.test.tsx`: `keyed={false}` closes
  the Chord flow with its note.
- `app/routes/search` validation: unknown and repeated ids dropped, table order, empty → `maj`, a bad direction →
  `up`, a root respelled.
- `ChromaticPlayerPage.test.tsx` (through `renderApp`): the title; Setup's Chords, Root and Direction change the URL
  and the sheet; the last chord cannot be unchecked; ✕.
- `PracticePage.test.tsx`: the Exercises row opens the walk. The Chords page's test: a table chord's row opens the walk
  on its quality and root; a chord outside the table shows none.
- `parse-progression.test.ts`: sections start new bars, four bars a line, a Chart section each; an error names its
  section. `usePieceHeadings`: a string's "Progression", sections' headings.
- `catalog.test.ts`: «Ромашковые поля» at triads, 7ths (the course's chart, §2.2) and 9ths.
- Verify: `npm run typecheck && npm run lint && npm run test`, then `npm run build` (a new route).
