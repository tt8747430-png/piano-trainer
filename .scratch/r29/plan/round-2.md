# Round 2 plan: the Practice pages' content

Scope: what each Practice page *shows* (Chords, Scales and keys, Intervals, Progressions, Accompaniment, Chord
finder, Metronome, Exercises, Quiz). Where each setting *lives* and every row of each page's Settings page is
round 1's plan (`round-1.md` S1–S8, S14); here an item only names what its page's settings ARE and points there.
Read with `prompt.md` (cited by line), `compliance/part-a2.md`, `compliance/summary.md`, and the code as of
2026-11-03. Owner's corrections (Decided 20, prompt 404–420) win over everything.

Order of work: C1–C9 first (they contradict the prompt), then A20 → A43 in this file's order. Each item is one
commit or a few, named "A20: …" (owner-way). Screenshot sizes: 390×844, 844×390, 1280×800, light, en; ru where a
string changed; files in `.scratch/r29/shots/after/r2-<item>-<screen>-<size>.png`.

## Corrections to earlier descriptions

1. **`.scratch/r29/metronome-engine/spec.md:29–31`**: "4/4 kick 1 & 3, snare 2 & 4, hat on 8ths; 3/4 kick 1, snare
   2 & 3; 6/8 kick 1, snare 4 … the hat on the subdivision". Decided 20 replaces it. Correct: Chordify's grooves
   (4/4: kick 1, 3 and the "and" of 3, snare 2 and 4, hat on 8ths; 3/4: kick 1, hat 2 and 3; 6/8: kick 1, snare 4,
   hat every 8th), the hat where the groove writes it (C8).
2. **`docs/adr/0052-practice-and-search.md:90`**: "kick 1 and 3, snare 2 and 4; a waltz: kick 1, snare 2 and 3".
   Same correction as 1; add a history line "Decided 20: Chordify's grooves".
3. **Commit 884d7115's message** ("Drum grooves back to A39's … against the prompt's A39") reads as the rule. It
   was written before Decided 20 and is reversed by C8. The log in `progress.md` row A39 says so.
4. **`.scratch/r29/metronome-engine/spec.md:27`** and **`progress.md` row A39** ("Left: samples (owner's CC0
   files)"). The samples are the agent's to choose (Decided 18–19 and the 2026-11-02 beta note); they go in
   `public/samples/metronome/` with `SOURCES.md`, not `public/sounds/` (C9). `src/shared/api/audio/recorded-sounds.ts`'s
   header and `web-audio.ts:270` ("accent is the same block a fifth higher") describe what C9 removes.
5. **`progress.md` row A20** ("a choice the chord can't take is not drawn") and **`ChordBuilder.tsx`'s doc comment**
   ("not drawn (R30), the rows after it closing up"). Correct: every row stays in its place; options it can't take
   are hidden inside it; a row with nothing to choose shows its value as plain text (C2).
6. **`audit.md:54`** ("every row stays, greyed where nothing applies") and **`DESIGN.md:492–494`** ("where nothing
   in it applies it stays in its place, greyed"). The owner rejected greyed options that look broken
   (feedback-log, round 29). Correct: the row stays; no greyed option; a row with no choice shows its value as text
   ("No 7th"), not a disabled control (C2).
7. **`compliance/part-a2.md:43` and `summary.md` item 11** treat "Mode on the page" as the only fix needed, and
   **`round-1.md` S4** says "round 2 C4 decides. Not here". C4 decides: Mode moves to Progressions' Settings as a
   fourth row of S4's page (C4 gives the row).
8. **`compliance/part-a2.md`, A42 Progressions "DONE"** (Mode only for a typed line). Superseded by C4.
9. **`round-1.md` S7 row 1** ("today Click · Beep · Drum kit"). The menu's values are C9's list.
10. **`src/widgets/interval-explorer/model/interval-songs.ts` header** ("each checked against its melody") presents a
    copied list as the feature. A43 rules it out ("not a copied list"); C6 deletes it.
11. **`DESIGN.md:550–551`** "Scale degrees (Key view): a plain table". A43 and A21 replace it with the seven-degree
    spine on Harmony (built in 9c6e182f as `KeyChords`); the paragraph is rewritten to the spine.
12. **`DESIGN.md:552–556`** "a crossing's finger in sky and underlined (on the keys its circle filled in sky, on the
    staff its number in bold sky)": three marks for one thing. A30 sets one (below).
13. **`progress.md` row A22** "Harmonic · Melodic … Play all": right, but the row omits that the interval is on no
    staff and its songs are hand-copied (A22, C6 below).

---

## Contradictions (fix first)

### C1: A20 added tones (`addedOf`, `chord-parts.test.ts` asserting the gaps)

- **Source:** A20 (prompt 724–739: "Added tones … on every chord", the examples C5(add9), C°(add9), C+(add2)/(add4),
  Csus2(add4), Csus4(add2), a 7th chord's add♯11; "a tone that would only rename the chord switches to that chord";
  the table test). A33 (1292–1328) later made added tones chips of the Colour notes panel; that stays.
- **Today:** `TRIAD_ADDS` in `src/shared/lib/music/chord-parts.ts:147–155` gives `dim: []`, `power: []`,
  `aug: ['add9']`, `sus2: ['add6']`, `sus4: ['add6','add9']`. `CHORD_PARTS` is built from it, and the Colour notes
  panel (`colour-notes.ts` `withColour` → `builtWith`) can only toggle a note into a chord `CHORD_PARTS` holds, so
  C°'s 9th shows as a dead chip or not at all. `chord-parts.test.ts:205–219` asserts the gaps
  (`addedOf(dim) → []`). `CHORD_PARTS` drops the second of two chords with the same notes, so Csus4(add2) (C D F G)
  would be found as Csus2(add4) and renamed.
- **Will build:**
  - `src/shared/lib/music/chord-parts.ts`:
    - `TRIAD_ADDS` becomes, each entry with the dictionary that names it in a comment:
      `maj: add2 add4 add6 add9 add11 add♯11` (unchanged); `min: add2 add4 add6 add9 add11` (unchanged);
      `dim: add9 add11` (C°(add9), C°(add11): Chord Trainer's builder, *Piano Chord Bible*); `aug: add2 add4 add9`
      (C+(add2), C+(add4), C+(add9)); `sus2: add4 add6` (Csus2(add4), 6sus2); `sus4: add2 add6 add9`
      (Csus4(add2), 6sus4, sus4(add9)); `power: add9` (C5(add9)). A tone not in a source is not added: the build
      checks each against `piano-data/books` and the chord-chart sites and records the source in the test table;
      one no source names is dropped from this list and noted in the commit.
    - `addedOf` for 7th chords: keeps today's rule (an 11th under a minor 3rd, a 13th the stack skipped) and adds
      `addS11` on a 7th chord whose `alterationsOf` has no `s11` and whose stack has no 11th, only where a source
      names it (candidates m7(add♯11), mMaj7(add♯11), m7♭5(add♯11); expected: none of them is in the books, then
      the rule stays as today and the test says so).
    - A tone that only renames the chord: nothing new to build. `withColour` already finds C9 + 13th as C13 and
      Cm9 + 11th as Cm11 (`builtWith` by notes). A test proves it for each size.
    - `CHORD_PARTS` dedupe key becomes `triad + semitones` (was semitones alone), so Csus4(add2) and Csus2(add4)
      are both kept, each named after the chord it was built from.
  - `src/shared/lib/music/colour-notes.ts`: `builtWith(semitones, prefer: Triad)` returns the chord with those notes
    whose triad is `prefer` when there is one, else the first (`withColour(parts, interval)` passes `parts.triad`).
  - Symbols by the existing rule (`triadRuleSuffix`): `5(add9)`, `°(add9)` (or `dim(add9)`, as the app-wide symbol
    style writes ° , S12), `+(add2)`, `sus2(add4)`, `sus4(add2)`.
- **Not in this item:** new chord qualities, the voicing list, alterations (`alterationsOf` unchanged).
- **Done when:**
  - `src/shared/lib/music/chord-parts.test.ts`: describe "what a chord may add" rewritten as `it.each` over every
    triad × size × 7th that `sizesOf`/`seventhsOf` allow, each row `[triad, size, seventh, expected adds, source]`;
    the five gap assertions (lines 209–212 and the power chord's at 160) replaced. New tests: "builds C5(add9),
    C°(add9), C+(add2), C+(add4), Csus2(add4), Csus4(add2) with their symbols"; "keeps Csus4(add2) and Csus2(add4)
    as two chords".
  - `src/shared/lib/music/colour-notes.test.ts`: "a diminished triad's 9th is a tension that adds C°(add9)";
    "Csus4 with a 2nd added reads Csus4(add2), not Csus2(add4)"; "C9 with its 13th added becomes C13, and the chip
    stays"; "every chip of every built chord toggles to a chord the builder holds or is a chord tone".
  - `src/pages/chords/ui/ChordsPage.test.tsx`: "offers add9 on C°, and the name reads C°(add9)".
  - Screenshot `r2-c1-chords-cdim-add9` at the three sizes.

### C2: A20/A31 rows that vanish (7875ffe7 against 0a9069b4)

- **Source:** A20 (734–736: "The row is always shown, in one place; a tone the chord can't take is hidden with the
  others re-flowing"), A31 (1230–1231: "they stay, with options hidden inside"), R30 (324–329), feedback-log round 29
  ("no greyed option that looks broken").
- **Today:** `src/widgets/chord-explorer/ui/ChordBuilder.tsx:114–175` draws Seventh only when
  `choosesSeventh`, Suspension only when `suspensions.length > 0`, "Right hand from" or Inversion by the voicing and
  hand count, Hands only for a close one-hand voicing. Changing the chord moves every row under them (A31's
  finding: Hands jumped up to 150px). `ChordsPage.test.tsx` (7875ffe7) expects the rows to vanish.
- **Will build:**
  - `ChordBuilder` always draws five rows in this order under the picker row (Chord: Root · Quality · Voicing):
    1. **Chord size** (segmented): the sizes the quality stacks to (unchanged).
    2. **7th** (segmented ♭7 · 7 · 𝄫7, the label "Seventh" becomes "7th"): only the 7ths the chord can take. With
       none to choose (a triad) the row shows the text **"No 7th"**; with one (e.g. aug 9th) it shows that 7th as
       text ("♭7").
    3. **Suspension** (segmented None · sus2 · sus4): only the suspensions this size takes. For a quality with
       none (minor, diminished, augmented, power) the row shows **"None"** as text.
    4. **Inversion** (`InversionChoice`) for a one-hand voicing; in the same slot, with the label **"Right hand
       from"**, `RightHandFrom` for a two-hand chord. With one position only (power chord, a voicing that sets its
       own: rootless, So What) the row shows **"Root position"** or **"Set by the voicing"** as text.
    5. **Hands** (segmented Right · Both): for a two-hand voicing the row shows **"Both hands"** as text.
  - New `src/shared/ui/StaticValue.tsx`: `StaticValue({ children }: { children: ReactNode })`: the value as text at a
    control's height (44px) and type size, in body ink, so a row's height doesn't change between a control and its
    text. Exported from `shared/ui/index.ts`. No disabled or greyed control anywhere in the builder.
  - Strings (en/ru, `practice.chords.builder`): `seventh: '7th'` / «Септима»; `noSeventh: 'No 7th'` / «Без
    септимы»; `noSuspension` reuses `none`; `rootPosition: 'Root position'` / «Основной вид»; `byVoicing: 'Set by the
    voicing'` / «Задаётся расположением»; `bothHands: 'Both hands'` / «Двумя руками».
  - `ChordBuilder`'s doc comment, `DESIGN.md:492–494` and `docs/adr/0011` (A31's) rewritten to this rule.
- **Not in this item:** the colour notes (A33, kept), the voicing pictures (A20).
- **Done when:**
  - `ChordsPage.test.tsx`: "keeps the same five rows for C, C9, C°, C5, Cmaj13 and a rootless voicing" (the row
    labels in order are equal for each); "draws no disabled control in the builder"; "a triad's 7th row reads No
    7th"; the 7875ffe7 cases that expect rows to vanish are replaced.
  - A Playwright recording (`e2e/explorers.spec.ts`, case "Chords' rows hold their places") steps C → C9 → C° →
    C5 at 390 and 1280 and asserts each row's top changes by 0px (`boundingBox().y`).
  - Screenshots `r2-c2-chords-{triad,ninth,power}` at 390 and 1280.

### C3: A23 walk names in the Player's title

- **Source:** A23 (895–904: "the same names in the Player's title and its More menu, and in Russian"), A32
  (1271–1273).
- **Today:** the Progressions page uses `player.keyWalk.*` ("Chromatically, rising" …). The Player's titles do not:
  `src/pages/player/ui/ProgressionPlayerPage.tsx:27` uses `progression.walking` + `walking.*` ("I V vi IV from C,
  up by semitones"); `WalkPlayerPage.tsx:20` uses `walk.title` "Walk the chords in {{scale}}";
  `ChromaticPlayerPage.tsx:26` uses `chromatic.title` "Chromatic walk: {{chords}}". `practice.chords.chromatic`
  ("Chromatic walk") and `practice.scales.walk.title` ("Walk the chords") are the old names on the pages' rows.
  The Player's More menu has no walk entry (nothing to rename there).
- **Will build:**
  - `src/shared/i18n/locales/{en,ru}/player.ts`: delete `walking` (all nine keys). `progression.walking` becomes
    `'{{numerals}} in all 12 keys, from {{key}}: {{walk}}'` / «{{numerals}} во всех 12 тональностях от {{key}}:
    {{walk}}», `{{walk}}` from `keyWalk.<id>` in lower case where it follows a colon in ru only.
    `walk.title` → `'{{scale}}: through the key’s chords, in scale order'` / «{{scale}}: по аккордам тональности
    по порядку ступеней». `chromatic.title` → `'{{chords}}: a chord in all 12 keys, chromatically'` /
    «{{chords}}: аккорд во всех 12 тональностях, хроматически».
  - `practice.chords.chromatic` → `'A chord in all 12 keys, chromatically'`; `practice.scales.walk.title` →
    `'Through the key’s chords, in scale order'` (ru as above).
  - Check the ru `keyWalk` names against A23's Russian (секвенция, хроматически вверх, по квинтовому кругу) and fix
    any that differ.
  - `ProgressionPlayerPage.tsx:27`: `t(\`keyWalk.${choice.walk}\`)`.
- **Not in this item:** what a walk plays.
- **Done when:** new `src/pages/player/ui/walk-titles.test.tsx`: "titles a progression walk 'I V vi IV in all 12
  keys, from C: Chromatically, rising'"; "titles a scale's chord walk with 'through the key's chords, in scale
  order'"; "titles a chromatic walk 'a chord in all 12 keys, chromatically'"; each in ru too. `tsc` fails any use
  of the deleted `walking` keys. Screenshot of the three Player titles at 390.

### C4: A23/A24 Mode on the page

- **Source:** A23 (920–922: on Settings "**Mode** (major or minor, today "Major or minor" in a menu with an ⓘ)"),
  A24 (981–982: Progressions' Settings "written as, voicing, first chord's inversion, mode"), A24's last bullet
  (991–992: "the page keeps a link row ('Plays: broken ›') only where the setting changes what you see"), A42
  (1630–1631: "Mode … beside a progression whose numerals already say"). A32's "nothing that is a page's current
  choice is a setting" does not override two explicit placements by the owner (the later, more specific words win).
- **Today:** `src/widgets/progression-explorer/ui/ProgressionReading.tsx`, a "Mode" `Dropdown` (the key's major or
  minor · Dorian · Phrygian · Lydian · Mixolydian · Aeolian · Locrian) with an ⓘ, drawn under the field for a typed
  line only (`ProgressionExplorer.tsx:169`), its value `mode` in the URL. A library progression with its own church
  mode (`style: 'modal'` entries' `mode`) sets `mode` from its content (`progressions-view.ts:124`).
- **Will build:**
  - `ProgressionReading.tsx` deleted, and its call in `ProgressionExplorer.tsx:169`.
  - Round 1's S4 page gets a fourth row, in its group "Notation" after "Written as":
    `ChoiceRow` **"Mode of typed numerals"** (ru «Лад набранных ступеней») — menu **The key's (major or minor)** ·
    **Dorian** · **Phrygian** · **Lydian** · **Mixolydian** · **Aeolian** · **Locrian** (ru «Как в тональности
    (мажор или минор)» · «Дорийский» · …), default the key's. ⓘ today's `progressions.mode.info`. Key
    `progressions.mode: 'key' | ChurchMode` in `ProgressionsSettings` (`entities/settings/model/types.ts`),
    sanitised against `CHURCH_MODES`; `pt-settings` version bumped (CLAUDE.md, no migration).
  - `readProgressionsView`/`progressions-view.ts`: a typed line reads in `settings.progressions.mode`; `mode` in the
    URL is kept only for a library progression's own mode (set from content, never by a control). `explorer-search.ts`
    keeps `mode` for that case only.
  - On the page, under the field, only when a typed line is shown and the setting isn't the key's: a `RowLink`
    **"Read in Dorian ›"** (ru «Читается в дорийском ›») opening `/practice/progressions/settings`. Nothing is
    drawn when the setting is the key's.
- **Not in this item:** the rest of S4's page (round 1).
- **Done when:** `src/pages/progressions/ui/ProgressionsSettingsPage.test.tsx`: "Mode of typed numerals Dorian reads
  a typed i IV as Dm G in D" (type "i IV", key D minor, choose Dorian, back: the chips read Dm G); `ProgressionsPage
  .test.tsx`: "has no Mode menu on the page"; "shows 'Read in Dorian ›' for a typed line only, and none for a library
  progression"; "a modal library progression keeps its own mode". Screenshots of the page with and without the link
  row at 390.
- **Owner's question:** keep Mode on the page beside a typed line (it changes the chords shown) instead? Default
  taken: Settings, as A23 and A24 both say, with the link row.

### C5: A42 the Key tab's picker offers every scale

- **Source:** A42 (1617–1626: "On the Key tab the picker offers keys only (major and minor, Part A 5's circle), the
  modes listed under the key as links ('D Dorian: the C major scale from D', opening Notes); a scale with no chords …
  the tab isn't shown and the kind is marked 'no chords' in the picker"), R30 ("a choice made in a tab keeps you in
  that tab").
- **Today:** `src/widgets/scale-explorer/ui/ScaleExplorer.tsx:50` passes the same `ScaleChoice` (`NotePicker` +
  `MenuPicker` of every family) to all three views. On Key, choosing Dorian makes `showsOf` drop Key
  (`model/scale-view.ts:16`) and the page falls to Notes. On Harmony, choosing a pentatonic drops Harmony the same way.
  The Key tab's modes are listed in `KeyFacts`.
- **Will build:**
  - `src/widgets/scale-explorer/model/scale-view.ts`: `kindsFor(show: ScaleShow): readonly ScaleKind[]`: Notes every
    kind; Harmony the kinds with `scaleHasChords`; (Key uses no kind menu).
  - `ScaleChoice` gains `kinds: readonly ScaleKind[]` and lists only those, grouped by family as now; on Notes a kind
    without chords carries the menu option's second line **"No chords"** (ru «Без аккордов»), so the learner knows
    why Harmony is absent for it. `MenuPicker` gets an optional `detail?: string` per option if it has none.
  - On Key: the header's picker is the shared `KeyPicker` (`shared/ui/pickers/KeyPicker.tsx`, the circle, majors and
    minors), label **"Key"**. Choosing a minor key keeps the minor form shown if the scale was a minor form (harmonic,
    melodic), else natural minor; a major key sets `kind: 'major'`. The tab stays Key.
  - `KeyFacts`'s modes become rows of links, one per mode on the key's notes, each **"D Dorian: the C major scale
    from D"** (ru «Ре дорийский: гамма до мажор от ре»), opening `?show=scale&root=D&kind=dorian` (Notes). For a
    minor key the modes listed are those of its relative major.
  - `showsOf` unchanged (a mode has no Key tab, a pentatonic no Harmony tab); since no tab offers a kind that drops
    it, no choice moves the learner.
- **Not in this item:** the header's look (A21).
- **Done when:** `src/pages/scales/ui/ScalesPage.test.tsx`: "the Key tab's picker is the circle of keys and offers
  no Dorian"; "a minor key chosen on Key stays on Key"; "Harmony's scale menu lists no pentatonic or blues"; "Notes'
  menu marks Major pentatonic 'No chords'"; "D Dorian's link on C major's Key opens Notes on D Dorian".
  `scale-view.test.ts` (new): "every kind `kindsFor('chords')` offers has chords". Screenshots of Key with the picker
  open at 390 and 1280.

### C6: A43 the hand-copied interval songs list

- **Source:** A43 (1715–1718: "the songs in our own library whose tune starts with it (found by the kernel from the
  first two melody notes, not a copied list), each playing its opening; … falls back to 'No song in your library
  starts with a minor 6th yet'"), A22 (821–823: the interval on the staff).
- **Today:** `src/widgets/interval-explorer/model/interval-songs.ts` (`SONGS`, 121 lines, titles per language, most
  not in our library), shown in an ⓘ per row (`IntervalSongsTip.tsx`), tested by `interval-songs.test.ts`.
- **Will build:**
  - Kernel `src/shared/lib/music/opening.ts` (+ `index.ts` export): `openingInterval(midis: readonly number[]):
    { readonly semitones: number; readonly rising: boolean } | null` — the interval between the first two notes
    (0 a unison, `rising` false for a fall), null under two notes.
  - `src/entities/piece/model/opening.ts`: `openingNotes(piece: Piece, count?: number): readonly NoteSound[]` — the
    tune's first notes (the first staff that has words, else the top staff; `singingNotes` for chords; ties joined),
    default 8 for the "opening" heard; `piecesOpeningWith(pieces: readonly Piece[], semitones: number, rising:
    boolean): readonly Piece[]` — sorted by title. Exported from `entities/piece/index.ts`. A song with no staff (a
    chart only) is skipped.
  - `src/widgets/interval-explorer`: `interval-songs.ts`, its test and `IntervalSongsTip.tsx` deleted. The songs show
    in the chosen interval's panel (A22 below), section **"Songs that begin with it"** (ru «Песни, которые с него
    начинаются»), two lists **Rising** · **Falling** (ru «Вверх» · «Вниз»), each row the song's title and a ▷ that
    plays its opening (`openingNotes`, 8 notes, at the song's tempo); a tap on the title opens the song's page.
    Empty: **"No song in your library starts with a {{interval}} yet."** (ru «В вашей библиотеке пока нет песни,
    которая начинается с {{interval}}.»). Songs read from `useRepertoire()` (built-in and the learner's own).
- **Done when:** `src/shared/lib/music/opening.test.ts`: "a rising 4th", "a falling minor 3rd", "a repeated note is a
  unison", "one note has none". `src/entities/piece/model/opening.test.ts`: "Frère Jacques opens with a major 2nd
  rising" (C4 D4), "Jingle Bells with a unison", "a chart-only song has no opening", and "every built-in song with a
  staff has an opening". `IntervalsPage.test.tsx`: "the major 2nd lists Frère Jacques and ▷ plays C D E C …";
  "the minor 6th says no song starts with it yet" (if one does, the test picks an interval none starts with).
