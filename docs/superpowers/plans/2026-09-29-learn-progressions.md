# Learn's Progressions tool and its Player source — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Part 5.3's second half (spec §5.4): **Progressions** on Learn — Roman numerals typed or taken from a
library by style, read in any key and chord size, shown as a row of chords that play, and **Practise in the Player**
through a new Player source, `/play/progression`.

**Architecture:** The kernel gains `numerals.ts`: `parseNumerals` (a line of numerals), `numeralChord` (a numeral in
a key at a chord size: the key's own chord grows as the scale's, any other major chord to a dominant, any other
minor to a minor 7th) and `numeralOf` (a typed chord back to its numeral in the key). A new entity,
`progression-library`, holds the named progressions by style as content. `features/practice/progression.ts` writes
a chart (a chord a bar) that the Player arranges; `pages/player` gains its search, hook, Setup and page, as the walk
and the chromatic walk have. The tool is a widget, a page and a route on Learn's Tools.

**Spec:** `docs/superpowers/specs/2026-09-29-learn-lessons-references-tools-design.md` (§5.4), roadmap §10.1.

## Global Constraints

As the tools' plan: FSD lint, no casts, both languages, tests first, `renderApp` for screens, Prettier on files
touched, the gate before each commit, commits on `main` with the co-author line.

## Review Focus

- **A numeral line typed with dashes, en dashes, commas or spaces** (`I–V–vi–IV`, `ii7, V7, IMaj7`): all read.
- **Chords typed instead of numerals** (`Am F C G` in C): read as `vi IV I V`; a chord no numeral writes (a sus
  chord) says so.
- **A minor key's numerals** (`i iv V i` in A minor): count from natural minor; `V` a major (dominant) chord.
- **The 12-bar blues at triads**: its written `7`s stay 7ths; the chord size grows only what is not written.
- **The Player opened on an unreadable `p`**: the default progression, never a crash.

---

### Task 1: Numerals in the kernel

**Files:** `src/shared/lib/music/numerals.ts`, `numerals.test.ts`, `index.ts`.

**Produces:** `interface Numeral { degree: number; shift: -1 | 0 | 1; triad: 'maj' | 'min' | 'dim' | 'aug';
seventh: 'none' | 'minor' | 'major' | 'diminished' | 'half' }`; `parseNumerals(text: string): Numeral[] | null`;
`numeralText(numeral): string` (`♭VII`, `viiø7`, `IMaj7`); `numeralsParam(numerals): string` (`bVII-ii7-V7`);
`NUMERAL_SIZES = ['triads','sevenths','ninths']` as the kernel's own `NumeralSize` (the piece entity's `ChordSize`
has the same members); `numeralChord(numeral, key, size): Chord`; `numeralOf(chord, key): Numeral | null`.

- [ ] **Failing tests:**

```ts
const C = { tonic: note('C'), minor: false }
const A_MINOR = { tonic: note('A'), minor: true }
const chords = (text: string, key: Key, size: NumeralSize) =>
  (parseNumerals(text) ?? []).map((numeral) => chordSymbol(numeralChord(numeral, key, size)))

describe('parseNumerals', () => {
  it('reads numerals apart by spaces, dashes or commas, with accidentals and 7ths', () => {
    expect((parseNumerals('I–V–vi–IV') ?? []).map(numeralText)).toEqual(['I', 'V', 'vi', 'IV'])
    expect((parseNumerals('ii7, V7, IMaj7 bVII #iv° viiø7') ?? []).map(numeralText)).toEqual([
      'ii7',
      'V7',
      'IMaj7',
      '♭VII',
      '#iv°',
      'viiø7',
    ])
    expect(parseNumerals('I Q V')).toBeNull()
    expect(parseNumerals('  ')).toBeNull()
  })

  it('writes them for a URL', () => {
    expect(numeralsParam(parseNumerals('♭VII ii7 V7') ?? [])).toBe('bVII-ii7-V7')
  })
})

describe('numeralChord', () => {
  it('reads the key’s own chords, growing with the chord size as the scale’s do', () => {
    expect(chords('I vi ii V', C, 'triads')).toEqual(['C', 'Am', 'Dm', 'G'])
    expect(chords('I vi ii V', C, 'sevenths')).toEqual(['CMaj7', 'Am7', 'Dm7', 'G7'])
    expect(chords('iii vii°', C, 'ninths')).toEqual(['Em7', 'Bm7♭5'])
  })

  it('grows another major chord to a dominant and another minor one to a minor 7th', () => {
    expect(chords('VII III VI ♭VII iv', C, 'sevenths')).toEqual(['B7', 'E7', 'A7', 'B♭7', 'Fm7'])
  })

  it('keeps what is written', () => {
    expect(chords('I7 IV7 V7', C, 'triads')).toEqual(['C7', 'F7', 'G7'])
    expect(chords('IMaj7 vii°7', C, 'triads')).toEqual(['CMaj7', 'B°7'])
  })

  it('counts a minor key from natural minor', () => {
    expect(chords('i iv V i', A_MINOR, 'triads')).toEqual(['Am', 'Dm', 'E', 'Am'])
    expect(chords('i VI III VII', A_MINOR, 'sevenths')).toEqual(['Am7', 'FMaj7', 'CMaj7', 'G7'])
  })
})

describe('numeralOf', () => {
  it('writes a chord as its numeral in the key', () => {
    const numerals = ['Am', 'F', 'C', 'G7', 'Bm7♭5', 'B♭', 'Fm'].map((symbol) =>
      numeralOf(parseChordSymbol(symbol), C),
    )
    expect(numerals.map((numeral) => (numeral ? numeralText(numeral) : null))).toEqual([
      'vi',
      'IV',
      'I',
      'V7',
      'viiø7',
      '♭VII',
      'iv',
    ])
  })

  it('writes none for a chord a numeral does not name', () => {
    expect(numeralOf(parseChordSymbol('Csus4'), C)).toBeNull()
  })
})
```

- [ ] **Implement.** A token `([b♭#♯]?)(roman)(°|o|ø|\+)?(7|Maj7|maj7|M7)?`, the roman's case its triad (upper
  major, lower minor), `°` diminished, `+` augmented, `ø` a half-diminished 7th (with or without its `7`), `°7` a
  diminished 7th; tokens split on spaces, commas, hyphens and en dashes. The root: the key's scale degree (major, or
  natural minor) moved by its shift, `plainRoot`. The quality: a written 7th fixes it (`7` over major a dominant,
  over minor a minor 7th, over augmented `7#5`; `Maj7` over major `Maj7`, over minor `m(maj7)`, over augmented
  `+Maj7`); otherwise the key's own chord on the degree (no shift, the scale's triad) grows by `scaleChordAt`, and
  any other chord grows as its triad says (major → `7` → `9`, minor → `m7` → `m9`, diminished → `m7♭5`, augmented →
  `7#5`). `numeralOf`: the degree by letters from the tonic, the shift by semitones from the scale's degree (±1 or
  none), the triad and 7th from the chord's intervals; anything else (a suspension, an added tone, a 9th) none.
  **Commit:** "Read Roman numerals in any key and chord size, and write a chord back as its numeral".

### Task 2: The library

**Files:** `src/entities/progression-library/` (`model/types.ts`, `content/library.ts`, `content/library.test.ts`,
`index.ts`).

**Produces:** `PROGRESSION_STYLES` (`pop`, `rock`, `jazz`, `blues`, `classical`, `soul`, `latin`, `gospel`, `minor`,
`theory`), `interface LibraryProgression { id: string; style; name: LocalText; numerals: string; minor: boolean }`,
`PROGRESSION_LIBRARY`.

- [ ] **Failing test:** ids unique; every name in both languages; every line read by `parseNumerals`; every style
  with a progression; the minor ones in the `minor` style and no other.
- [ ] **Content** (roadmap §10.1, a style each): **Pop** I V vi IV (Axis of Awesome), vi IV I V (Sensitive), I vi IV V
  (50s doo-wop), I IV vi V (Alternative pop), IV V iii vi (Royal Road), I V vi iii IV I IV V (Pachelbel's Canon);
  **Rock** I IV V (Basic rock), I V IV (Rock shuffle), I IV V IV (Louie Louie), I V vi IV (Pop rock), I IV V V (Rock
  anthem); **Jazz** ii7 V7 IMaj7 (Jazz cadence), I vi ii V (Rhythm changes), iii vi ii V (Full turnaround), ii V I IV
  (Jazz standard), I IV ii V (Sweet jazz), ii V I vi (Autumn Leaves); **Blues** I7 IV7 I7 V7 (Blues turnaround), I7 IV7
  V7 (Basic blues), I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7 (12-bar blues); **Classical** I IV V I (Authentic cadence), I
  V I (Perfect cadence), I ii V I (Classical standard), I IV V vi (Deceptive cadence), I IV I (Plagal cadence);
  **R&B / Soul** vi V IV V (Neo-soul), I IV vi V (Modern R&B), I vi ii V (Soul turnaround), vi IV V I (Emotional R&B);
  **Latin / Bossa** I vi ii V (Bossa nova), I IV V IV (Latin groove), ii V I I (Samba cadence); **Gospel** IV V iii vi
  (Gospel lift), I iii IV V (Gospel standard), I IV I V (Gospel hymn), VII III VI (Gospel climb), V IV I (Gospel
  resolution), ♭VI ♭VII I (Gospel walk-up); **Minor keys** i iv V i (Minor cadence), i VI III VII (Minor pop), ii° V i
  (Minor ii–V–i); **Theory** I ii iii IV V vi vii° (The chords of the key).
- [ ] **Why two differ from the table:** the blues write their 7ths (a blues I is a dominant 7th, which a plain `I`
  would not grow to), and the gospel walk-up is ♭VI ♭VII I (the table's "VI–VII–I" climbs to I from the flat side,
  A♭ B♭ C in C; natural VI and VII would be A and B). **Commit:** "Add the Progressions library: the named
  progressions by style, as content".

### Task 3: A progression as a chart the Player plays

**Files:** `src/features/practice/progression.ts`, `progression.test.ts`, `index.ts`.

**Produces:** `PROGRESSION = { tempo: 80, pattern: 'block', chordSize: 'triads' }`, `interface ProgressionChoice {
numerals: readonly Numeral[]; key: Key; pattern; rh; lh; chordSize }`, `progressionChart(numerals, key, size):
Chart` (a chord a bar of 4/4, four bars a line, in the key), `arrangeProgression(choice): Performance`.

- [ ] **Failing test:** `I V vi IV` in G at triads writes four bars G D Em C in one line in G; the 12-bar blues
  writes three lines; arranging it with `block` gives a performance of twelve bars. **Commit:** "Write a progression
  as a chart the Player arranges: a chord a bar in the key".

### Task 4: The Player's progression source

**Files:** `src/pages/player/model/progression-search.ts` (+ test), `use-progression-player.ts`,
`ui/ProgressionSetup.tsx`, `ui/ProgressionPlayerPage.tsx` (+ test), `index.ts`; route `/play/progression`
(`PROGRESSION_DEFAULTS`: `p=I-V-vi-IV`, key C; `validateProgressionSearch`: an unread `p` is the default, the key's
tonic respelled by `tonicSpelling`), `player-screens.ts`, strings `player:progression.*`.

**The screen:** as the walk's: the title "I–V–vi–IV in C major"; the Setup composes Key (`KeyDropdown`), the figures,
Chord size and how it plays, keyed; closing goes back to the Progressions tool on the same numerals, key and size.

- [ ] **Failing tests:** the search reads and patches as the walk's do (own pattern and chord size left out);
  `/play/progression?p=ii-V-I&key=Bb` plays C m, F, B♭ bars (the sheet's chord symbols `Cm F B♭`); the Setup's key
  changes the URL; `?p=Q` opens `I–V–vi–IV`. **Commit:** "Play a progression in the Player: any numerals in any key,
  with a song's patterns".

### Task 5: The Progressions tool

**Files:** widget `src/widgets/progressions/` (`model/progressions-view.ts`: `{ key: KeyParam; p: string; size:
NumeralSize }`, `model/typed-progression.ts` (+ test: numerals or chords typed → numerals in the key, or null),
`ui/ProgressionsTool.tsx`, `ui/ProgressionRow.tsx`, `ui/ProgressionLibrary.tsx`), page, route
`/learn/progressions` (defaults C major, `I-V-vi-IV`, triads), Tools row, strings `learn:progressions.*` with the
library's style names.

**The screen:** the Key pop-up and Chord size (Triads · 7ths · 9ths); a field for the numerals or chords (a line
under it while it cannot be read: "This progression can't be read."), which sets the URL's numerals as soon as it
reads; the row of chords (`ChordButton`: the symbol over its numeral) each playing and showing, Play (the row
voice-led, a chord each two beats, Stop while it plays), and Practise in the Player (a `ButtonLink`); beside it on a
laptop, the library by style, each a row that links the tool to its numerals (a minor one to the same tonic's minor
key).

- [ ] **Failing page test:** default row C G Am F; typing `Am F C G` keeps `p=vi-IV-I-V`; typing `Qx` says it can't be
  read; Chord size 7ths gives CMaj7 G7 Am7 FMaj7; a library row (12-bar blues) links `p=I7-I7-…`; Practise in the
  Player links `/play/progression?p=…`; Russian. **Commit:** "Add Progressions to Learn's tools: numerals or chords in
  any key, a library by style, played and practised in the Player".

### Task 6: Record it

- [ ] ADR 0020 (the numerals' reading; the library as content; a progression as a Player source); glossary
  **Numerals**, **Library**; CONTENT.md (the library's format); DESIGN.md (the tool's layout); CLAUDE.md; PRODUCT.md;
  the roadmap's Built line (part 5.3). Screenshots of the tool and the Player at a laptop's width and a phone's first.
  Commit.
