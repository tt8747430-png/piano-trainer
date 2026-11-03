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

### C7: A23 the Library's bar cells and "Songs with four chords" (musicca)

- **Source:** A23 (829–836: "progressions grouped by style (Pop, Rock, Jazz, Blues …), each a row of its chords in
  bar cells, and 'Songs with four chords': title, artist, chords, year. Check our library against it (missing
  progressions, the 12-bar blues as one row of twelve bars) …"); the screenshots `piano-data/Screenshot 2026-10-27 at
  20.57.40–55.png`; `piano-data/musica/progressions.json`; the owner (feedback-log 2026-11-03): "Musicca's files are
  reference only (no licence) but progressions are facts".
- **Today:** `src/entities/progression-library/content/library.ts`: 31 entries in 9 styles (pop, rock, jazz, blues,
  classical, soul, gospel, modal, theory), one chord per bar (`ProgressionLibrary.tsx:182` draws `| C | G | Am | F |`).
  `progressions.json` holds 269 loops in 9 styles (pop 48, rock 40, melodic 29, hiphop 29, disco 27, reggae 25, jazz
  33, blues 12, classical 26), all in C or A minor, some with two chords in a bar (`duration: 2`). The screenshots
  show those lists and a table "Songs with four chords" of 23 songs (Withorwithout, Parcels, | F | Dm7 | Gsus4 | G |,
  2018 … All Along the Watchtower, Jimi Hendrix, | Cm | B♭ | A♭ | B♭ |, 1967). We have no such list.
- **Will build:**
  - Bars in a line: `src/shared/lib/music/numerals.ts` `parseBars(text: string): Numeral[][] | null` — bars split by
    `|`, chords in a bar by spaces (`I V | vi IV`); a line without `|` is a chord a bar. `parseNumerals` reads `|` as
    a separator (flattened). `ProgressionLibrary`'s bar cells and the Progression tab's strip draw a bar with two
    chords as one cell `| Dm7 Am7 |`; playback gives each chord its share of the bar.
  - A check script `scripts/musicca-progressions.mjs` (not shipped; reads `piano-data/musica/progressions.json`,
    writes nothing): each loop turned to numerals in C major or A minor, compared with the library by rotation and
    key (a loop is the same when one rotation equals another), printing what we lack, by style. Every loop it prints
    is added to `library.ts` as an `entry(...)` with a name and a one-line character in en and ru
    (`characters.ts`), unless it is a rotation or a one-chord variant of an entry we have (noted in the commit).
  - Styles: `PROGRESSION_STYLES` gains **`ballad`** (musicca's "melodic"; label "Ballad" / «Баллада»),
    **`hiphop`** ("Hip-hop" / «Хип-хоп»), **`disco`** ("Disco" / «Диско»), **`reggae`** ("Reggae" / «Регги»),
    each a chip in the Library tab after the existing ones. Blues: the twelve musicca 12- and 13-bar forms we lack
    (quick change, the turnaround's V7, minor blues), each one row of twelve bar cells (four to a line on a phone,
    one line from 1280 wide: `fourToALine` decides).
  - **Songs with four chords:** `src/entities/progression-library/content/four-chord-songs.ts`:
    `FOUR_CHORD_SONGS: readonly FourChordSong[]`, `interface FourChordSong { title: string; artist: string; year:
    number; key: KeyParam; chords: string /* "Am | G | F | G" */ }`, the 23 rows of the screenshots, each with its
    key worked out from its chords (a test checks every chord is diatonic or named borrowed in that key). Selector
    `fourChordSongs()` and `libraryMatch(song): LibraryProgression | undefined` (the library entry whose loop equals
    the song's numerals by rotation) in `model/selectors.ts`.
  - The Library tab (`ProgressionLibrary.tsx`): its style chips end with **"Songs with four chords"** (ru «Песни на
    четырёх аккордах»). Chosen, the list shows those songs: each row the title (body), "artist · year" (small, soft),
    the chords in bar cells, ▷ plays the four bars; a tap opens the Progression tab with the line typed in the
    song's key (`?line=…&key=…`), the numerals and roles row under it; where `libraryMatch` finds an entry, the row
    names it ("Axis of Awesome").
- **Not in this item:** our own songs per progression ("Songs with this progression", built).
- **Done when:** `numerals.test.ts`: "reads bars: 'I V | vi IV' is two bars of two chords"; "a line without bars is a
  chord a bar". `library.test.ts`: "has every musicca loop or a rotation of it" (the test reads a checked-in list of
  musicca's loops as numerals, `content/musicca-loops.ts`, facts only, no names); "the 12-bar blues is one row of 12
  bars". `four-chord-songs.test.ts`: "each song reads in its key"; "Zombie matches its library progression".
  `ProgressionsPage.test.tsx`: "the Songs with four chords chip lists 23 songs, and a tap opens Zombie's line in E
  minor". Screenshots of the Library at the Pop chip, the Blues chip and the songs chip, three sizes.
- **Owner's question:** musicca's 269 loops minus ours may be well over 100 new entries, each needing a name and a
  character in two languages. Default taken: add every distinct loop, named by its numerals where no common name
  exists ("I–IV–♭VII–IV"), with an authored one-line character.

### C8: A39 grooves (Decided 20: Chordify's; 884d7115 put back the old ones)

- **Source:** Decided 20 (411–412: "Chordify's (4/4: kick on 1, 3 and the 'and' of 3, snare 2 and 4, hat on 8ths;
  3/4: kick on 1, hat on 2 and 3; 6/8: kick 1, snare 4, hat on every 8th). Replaces A39's list."); feedback-log
  2026-11-03.
- **Today:** `src/shared/lib/schedule/meter.ts:125` `groove()` strikes only on beats (kick 1 and 3, snare 2 and 4 in
  4/4; kick 1, snare 2 and 3 in 3/4); `barClicks` adds a hat to every click and runs the hat on the subdivision.
  The kick on the "and" of 3 can't be written: drums strike only on a click's first part. Tests in
  `metronome.test.ts:50–57` assert A39's old groove.
- **Will build:**
  - New `src/shared/lib/schedule/groove.ts`: `interface GrooveHit { readonly at: number /* in 8ths from the bar's
    start */; readonly voices: readonly DrumVoice[] }`; `grooveOf(meter: Meter, grouping?: readonly number[]):
    readonly GrooveHit[]` from one table:
    - **4/4** (8 eighths): kick 0, 4, 5; snare 2, 6; hat every 8th (0–7). (Chordify.)
    - **3/4** (6 eighths): kick 0; hat 2, 4. No snare. (Chordify.)
    - **6/8**: kick 0; snare 3; hat 0–5. (Chordify.)
    - Ours, by the same idea, each marked "derived" in the table's comment: **2/4** kick 0, snare 2, hat 0–3;
      **2/2** as 4/4 over the bar; **4/4's** shape for **6/4** extended (kick 0, 4; snare 2, 6, 10; hat on 8ths);
      **9/8** kick 0, snare 3 and 6, hat every 8th; **12/8** kick 0 and 6, snare 3 and 9, hat every 8th; **3/8** kick 0,
      hat 1, 2; **odd meters** (5/8, 7/8, 5/4 …) kick on the bar, snare on each later group's first 8th, hat every 8th.
  - `DrumVoice` gains `'openHat' | 'ride'` (C9's kit) though no groove uses them yet (they are sounds a groove can
    take; the open hat closes each 4/4 bar's last 8th only if a source groove says so: none does, so unused).
  - `barClicks({ drums: true })` takes its hits from `grooveOf` at `at × (secondsPerBeat × beatsPer8th)`; a beat
    square set silent silences the hits inside that beat; an accented square raises its hits' gain by
    `LEVEL_GAIN.accent / LEVEL_GAIN.normal`. With Drum kit chosen, **Subdivision** has no effect, so round 1's S7
    Subdivision row is not drawn while the sound is Drum kit (R30), and the face shows nothing for it.
  - `click-voice.ts` `voicedClick` for the Player's click with Drum kit uses the same `grooveOf` (one engine, A39).
  - `meter.ts` `groove()` deleted with its comment; ADR 0052:90 and the engine spec corrected (Corrections 1–2).
- **Done when:** `src/shared/lib/schedule/groove.test.ts`: "4/4 is Chordify's: kick 1, 3 and the and of 3, snare 2
  and 4, hat on 8ths" (exact hit list); "3/4: kick 1, hat 2 and 3, no snare"; "6/8: kick 1, snare 4, hat every 8th";
  one case per derived meter; "7/8 as 2+2+3 snares on 8ths 2 and 4". `metronome.test.ts:50–57` rewritten: "a 4/4
  drum bar strikes at 0, 0.5, 1, … with the kick at beat 2.5". `MetronomePage.test.tsx`: "Drum kit hides
  Subdivision". A recording of each groove at 100 BPM in the commit's notes (`.scratch/r29/shots/after/r2-c8-*.webm`).

### C9: D16 the metronome's sound set

- **Source:** D16 (389–394: "recorded one-shots, each with an accented and a normal stroke, CC0 only … source and
  licence of each file written in `public/samples/metronome/SOURCES.md`: woodblock, clave, rimshot, cowbell, a
  classic click, and a drum kit (kick, snare, closed and open hi-hat, ride); all of them under 300 KB together,
  self-hosted and cached. The spoken count … isn't offered"); Decided 20 ("Spoken count: … not offered");
  feedback-log ("CC0 (VCSL) for the metronome and kit").
- **Today:** four WAVs in `public/sounds/` (woodblock, kick, snare, hihat; 122 KB) from VCSL, no `SOURCES.md`, the
  accent the woodblock pitched a fifth up (`web-audio.ts:270`). Sounds offered: Clicks · Beeps · Drum beat
  (`METRONOME_SOUNDS = ['click','beep','drum']`).
- **Will build:**
  - Files in `public/samples/metronome/`, each a mono 16-bit WAV at 32 kHz, trimmed with a 5 ms fade, peak −1 dBFS,
    `<sound>-accent.wav` and `<sound>-normal.wav` (the accent a harder stroke from the source's louder dynamic layer,
    not a pitch shift). Source per sound, from VCSL (https://github.com/sgossner/VCSL, CC0):
    | Sound | VCSL folder | Strokes |
    |---|---|---|
    | Woodblock | `Idiophones/Struck Idiophones/Woodblock` | its loudest and a middle layer |
    | Clave | `Idiophones/Struck Idiophones/Claves` | same |
    | Cowbell | `Idiophones/Struck Idiophones/Cowbells` | same |
    | Kick | `Membranophones/Struck Membranophones/Bass Drum 1` (or 2, whichever is shorter and drier) | same |
    | Snare | `Membranophones/Struck Membranophones/Snare Drum Modern 1–3` (the driest, wires on) | same |
    | Closed hi-hat | `Idiophones/Struck Idiophones/Hi-Hat Cymbal` (closed) | same |
    | Open hi-hat | `Idiophones/Struck Idiophones/Hi-Hat Cymbal` (open) | same |
    | Ride | **none in VCSL by that name**: `Idiophones/Struck Idiophones/Suspended Cymbal 1` or `2`, struck with a stick tip, is the nearest; used and named "Ride" only if it sounds like a ride (bell-less ping, short wash) |
    | Rimshot | **none as its own folder**: a rim articulation inside a `Snare Drum Modern` folder if one exists; else Freesound's CC0 filter |
    | Classic click (a mechanical metronome's tick) | **none in VCSL**: Freesound CC0 ("metronome tick", CC0 filter) |
    Where Freesound is needed and still answers 403 (progress.md), that sound is not offered (R30) and it is the
    owner's to-do in the report; no synthesised stand-in under a recorded name.
  - Size: clicks ≤ 80 ms, kick/snare/closed hat ≤ 250 ms, open hat and ride ≤ 450 ms; total measured by a test,
    under 300 KB. `public/sounds/` deleted. Service worker precache (`vite.config.ts` `globPatterns`) includes
    `samples/metronome/*.wav`.
  - `public/samples/metronome/SOURCES.md`: per file, the source folder and file name, the URL, "CC0 1.0", the
    trimming done.
  - `src/shared/api/audio/recorded-sounds.ts`: `RECORDED_SOUNDS` maps each `RecordedSound` (`woodblock`, `clave`,
    `rimshot`, `cowbell`, `click`, `kick`, `snare`, `hat`, `openHat`, `ride`) to `{ accent: url; normal: url }`;
    `buffer(context, sound, stroke: 'accent' | 'normal')`. Loaded lazily: the chosen sound's two files when the
    Metronome or the Player's click first plays, the rest never until chosen (memory). `web-audio.ts`'s pitched accent
    removed; the synthesised voice plays only until the file is loaded.
  - `METRONOME_SOUNDS` (`schedule/metronome.ts`) becomes `['click', 'woodblock', 'clave', 'rimshot', 'cowbell',
    'beep', 'drums']`; labels (round 1 S7's "Sound" menu): **Click** · **Woodblock** · **Clave** · **Rimshot** ·
    **Cowbell** · **Beep** · **Drum kit** (ru «Щелчок» · «Вуд-блок» · «Клаве» · «Римшот» · «Ковбелл» · «Сигнал» ·
    «Ударная установка»). "Beep" stays synthesised (an electronic beep is meant to be one). Default **Click**
    (classic click; if it can't be sourced, Woodblock). The menu groups them "Single sound" and "Groove" (Drum kit).
  - `MetronomeSettings.sound` sanitiser maps any value outside the list to the default; version bumped.
  - Spoken count: not offered (Decided 20); listed in the round's report as not available.
- **Done when:** `src/shared/api/audio/recorded-sounds.test.ts`: "loads only the chosen sound's two strokes";
  "an accent uses the accent file, not a pitch change". New `scripts/check-samples.test.ts` (unit, node): "every
  file in `public/samples/metronome` is named in SOURCES.md with CC0"; "the folder is under 300 KB"; "each sound has
  an accent and a normal file". `MetronomePage.test.tsx`: "the Sound menu lists Click, Woodblock, Clave, Rimshot,
  Cowbell, Beep, Drum kit" (minus any not sourced). A recording of each sound, accent then normal, in
  `.scratch/r29/shots/after/r2-c9-sounds.webm`.

---

## Items

### A20: Buttons, rows and headings on every explorer

- **Source:** A20 (prompt 716–742), R29 (298–323), R14–R15; C1 and C2 above take its added-tones and rows parts.
  Audit: pickers DONE; Voicing pictures PARTIAL; one family per control PARTIAL (Harmony's fields grid); contact
  sheet missing.
- **Today:** Chords: Root and Quality pickers in a `PickerRow` (done), `VoicingField.tsx` a `MenuPicker` of eight
  voicings (Close, Drop 2, Drop 3, Shell, Rootless A, Rootless B, Locked hands, So What) with text and an ⓘ. Section
  headings come in five sizes: `ScaleLayout`'s `text-5xl` name, `text-3xl`, `text-2xl` ("Borrowed chords"), `text-xl`
  and `text-lg` ("Left hand"), and `RowGroup` titles in small sans ("Practise in the Player"). Harmony
  (`ChordsView.tsx:92–140`) lays Chord size, Inversion, Keys play, Played as and a `TempoSlider` out as a fields grid.
- **Will build:**
  - **Voicing picker with pictures:** `VoicingField` stays a `MenuPicker` (combobox) whose each option shows a small
    staff picture of that voicing on C7 (or Cmaj7 for Locked hands, Dm7 for So What): new
    `src/shared/ui/pickers/VoicingPicture.tsx` `VoicingPicture({ voicing }: { voicing: Voicing })`, an inline SVG of
    the notes as stacked noteheads on a five-line grand-staff fragment, drawn from `voiceChord(…)` in the kernel, not
    by hand. The option's label stays the name (Close · Drop 2 · Drop 3 · Shell · Rootless A · Rootless B · Locked
    hands · So What, the names in jazz books). The ⓘ goes from the field; each option's one-line meaning moves to the
    option's second line ("Root, 3rd, 7th"). A voicing the chord can't take (`VoicingBar`) is not listed (R30), with
    nothing greyed.
  - **One heading per level** in `src/shared/ui/SectionHeading.tsx` (new): `SectionHeading({ level, children,
    summary }: { level: 2 | 3; children: ReactNode; summary?: string })`: level 2 the page section (Literata 24px,
    the old `text-2xl`), level 3 a card's heading (sans 17px semibold). Every explorer heading uses it:
    "Fingering", "Colour notes", "Borrowed chords", "Harmonise a melody note", "Songs in this key", "Practise in all
    12 keys", "Songs with this progression", "Passing chords"' groups, "Left hand"/"Right hand" (level 3). `RowGroup`'s
    `title` renders a level-2 `SectionHeading`. The page name under the bar (`text-5xl`) goes (A21: one title).
  - **One family per control** (all already in `shared/ui`): choice of 2–4 short values → `Segmented`; a list →
    `MenuPicker`; a root → `NotePicker`; a key → `KeyPicker`; a number → `Stepper`; on/off → `Switch` only in
    Settings; a play action → the floating capsule (`FloatingActions`). Each explorer is checked and moved:
    Harmony's `TempoSlider` → the capsule's tempo (A42); Progressions' "In the key only" `Toggle` → a `Segmented`
    **"All chords · In the key"** (ru «Все аккорды · В тональности»); Scales' `TempoSlider` on Notes → `Stepper`
    "Tempo" (− 80 + BPM). `TempoSlider.tsx` deleted.
  - **Contact sheet:** `e2e/contact-sheet.spec.ts` renders `/dev/kit` (a test-only route already used by `kit.test.tsx`
    if present; else a Playwright page that mounts each family in each state: rest, hover, focus, chosen, open) and
    saves `.scratch/r29/shots/after/r2-a20-families-{light,dark}.png`.
- **Not in this item:** the header of Scales (A21), the Progressions roles row (done).
- **Done when:** `src/shared/ui/pickers/pickers.test.tsx`: "the Voicing menu shows a picture for each voicing and
  lists only those the chord takes". `src/app/explorer-headings.test.tsx` (new): renders every explorer page via
  `renderApp` and asserts every `h2`/`h3` carries `data-heading-level` from `SectionHeading` (no raw heading classes
  left). Lint: a `no-restricted-syntax` rule in `eslint.config.js` forbids `className` containing `text-[2-5]xl` on an
  `h2`/`h3` under `src/widgets` and `src/pages`. Screenshots of every explorer before (existing) and after at the
  three sizes; the contact sheet.

### A21: Scales and keys, all three tabs

- **Source:** A21 (743–799), A32 (1239–1259), A42 (1614–1626), A43 (1641–1731); C5 above. Audit: tabs named,
  pickers, duplicates DONE; header, spine, function colours, controls group, two titles, Walk row, Key folds,
  score width NOT DONE or PARTIAL.
- **Today:** each tab draws its own `ScaleLayout` header (`RunView`, `ChordsView`, `KeyView`): a `text-5xl` name,
  then the pickers; Notes adds facts (`ScaleFacts`), Key has none and no Play. Harmony has `KeyChords` (the seven
  degrees, 9c6e182f); Notes and Key don't line up on them. Borrowed chords and "Harmonise a melody note" sit on Key.
  `PiecesInKey` (`pages/scales/ui`) lists every song and study with no cap.
- **Will build:**
  - **One header** above the tabs, in `src/widgets/scale-explorer/ui/ScaleHeader.tsx` (new), replacing the three
    `ScaleLayout` headers: `ScaleHeader({ scale, onChange }: { scale: ScaleView; onChange: … })`:
    1. the pickers row (C5: Root + Scale on Notes and Harmony; Key on Key);
    2. the scale on one staff: key signature and the notes up an octave (`ScoreView` of a one-bar Score from
       `spellScale`), the staff's width the column's;
    3. the notes as chips (`ChordButton` family, each plays its note), the tonic first;
    4. one facts line: "Formula W W H W W W H · Relative A minor ›" (ru «Строение … · Параллельная ля минор ›»);
       the relative key is a link (A32: shown once, here).
    The page's Play is the floating capsule (Play · Stop, the run up and down), the same on all three tabs. The
    title is the app bar's "Scales and keys"; the `text-5xl` name goes (the pickers say the scale).
  - **The seven-degree spine** (`KeyChords.tsx` becomes `src/widgets/scale-explorer/ui/DegreeSpine.tsx`,
    `DegreeSpine({ tonic, kind, row }: { …; row: 'notes' | 'chords' | 'functions' })`): seven equal columns I–VII
    (a grid with seven tracks; on a phone the row scrolls is NOT allowed: it wraps to 4 + 3 with the same widths and
    the last row starting at column 1, as `KeyChords` does today), each column headed by its degree number and
    numeral in the same place on every tab:
    - Notes: the note and its fingers (RH above, LH below) per A30;
    - Harmony: the chord (C Dm Em F G Am B°), its numeral, its function word and colour (`ROLE_PAINT`: home ·
      away · tension), tap opens Chords (the corner link stays); borrowed chords listed under the degree they stand
      on (♭VI under VI, Neapolitan ♭II under II), named;
    - Key: the degree's name (tonic, supertonic … leading note; subtonic in natural minor), with the function colour.
    A one-line legend under the spine: "Home (tonic) · Away (subdominant) · Tension (dominant)" with ⓘ.
  - **Sections in one order** on every tab, each a `SectionHeading` level 2: (header) → see and hear (the piano,
    the staff) → play it → use it. Notes: piano, staff (the run), "Fingering" (hand cards, A30), "Practise in the
    Player" (exercises). Harmony: the spine, "Borrowed chords" (moved from Key, A32), "Harmonise a melody note"
    (moved from Key, A32), "Practise in all 12 keys" (the walk row, A42), "Progressions in this key" (≤4 rows +
    "Show all n" opening Progressions in this key, A32). Key: the circle and the signature side by side, "Modes"
    (links, C5), "Songs in this key", "Studies in this key".
  - **Folds and caps:** "Songs in this key" and "Studies in this key" show 6 rows then **"Show all n"** (ru
    «Показать все n»); "Harmonise a melody note" is a `FoldSection` closed on a phone with the summary "{{n}} chords
    hold {{note}}"; lesson titles wrap to two lines (`line-clamp-2`), never cut on one.
  - **Practise in the Player** (Notes): one `RowGroup` of the six exercises, each with its own icon from
    `lucide-react` by kind (Scale run `MoveUpRight`, Thirds `Layers`, Arpeggio `Waves`, Contrary motion
    `ArrowLeftRight`, Broken chords `Grip`, Hanon `Repeat`), descriptions on two lines, never cut. On Harmony "Walk
    the chords" joins the "Practise in all 12 keys" group as "Through the key's chords, in scale order" (C3) beside
    the other sequences, so it is not a lone row.
  - **On-screen piano labels:** the tab tells `PinnedKeyboard` what to show: Notes the fingers of the hand chosen (A30)
    and no degrees; Harmony the chord's notes; Key the scale's notes. Computer-key letters only when the On-screen
    piano setting asks (A26, round 3).
  - **The score fills the column** (`ScaleSheet.tsx`: width 100% of its column, not `max-w-1/2`), fingering per A30.
  - `ScaleLayout.tsx` deleted.
- **Not in this item:** C5's picker narrowing; the annotations on the staff (A43); fingering rules (A30).
- **Done when:** `ScalesPage.test.tsx`: "the header (pickers, staff, note chips, facts) is the same element on all
  three tabs" (switching tabs keeps `data-testid="scale-header"` and its text); "the spine has seven columns headed
  I–VII on every tab"; "Borrowed chords and Harmonise are on Harmony, not Key"; "Songs in this key shows six and
  Show all 24"; "there is no h2 with the scale's name under the bar". Screenshots: the three tabs side by side at 390
  and 1280 for C major and B♭ minor (A21's Done line).

### A22: Intervals

- **Source:** A22 (800–823), A24 (979–980), A43 (1694–1696, 1715–1718); C6. Audit: root picker, way picture
  capsule, row style DONE; staff, Settings, songs, odd counts open.
- **Today:** `src/widgets/interval-explorer/ui/IntervalExplorer.tsx`: Root (`PitchPicker`), the floating capsule
  (Harmonic · Melodic rising · Melodic falling as pictured buttons, Play all, Stop), two lists ("Within the octave",
  "Past the octave") of `IntervalRow` (name, "3 semitones", mini keyboard, play mark). No staff. Songs in an ⓘ.
- **Will build:**
  - **The chosen interval's panel** at the top of the page (new `IntervalDetail.tsx`), for the row last tapped
    (`?interval=m3` in the URL, replaced, default M3):
    1. a staff (`ScoreView`) with both notes, harmonic or melodic as the capsule's way is set, the interval's name
       printed between them, the semitones counted under ("4 semitones") (A43's layer, on by default here);
    2. facts on one line: "Inverts to minor 6th ›" (a link choosing it), "Consonant" or "Dissonant" (perfect and
       imperfect consonances as the books class them);
    3. "Songs that begin with it" (C6);
    4. **"Test yourself"** (ru «Проверь себя») opening the Quiz's Intervals drill set to this interval (A43).
    On 1280 the panel is the left column (sticky) and the list the right; on a phone the panel sits above the list.
  - **Rows:** tapping a row plays it in the chosen way and chooses it (the panel follows); the chosen row has the
    one chosen style (R15); the playing one shows the playing mark. Rows unchanged otherwise.
  - **Odd counts:** the two lists are one-column lists (rows, not cards) on every width, so no lone card is left.
  - **Settings** (round 1 S3 has the rows): Interval names (m3 · ♭3 · Minor 3rd), Compound intervals. The way stays
    in the capsule (S3's reasoning).
- **Not in this item:** the Quiz drill itself (A41).
- **Done when:** `IntervalsPage.test.tsx`: "tapping Minor 3rd plays it and shows it on the staff with its name and 3
  semitones"; "Inverts to major 6th chooses the major 6th"; "Test yourself opens /practice/quiz/intervals with m3
  checked"; "rows are one list with no card grid". Screenshots at the three sizes, the panel on M3 and on m6 (no
  songs).

### A23: Progressions

- **Source:** A23 (824–962), D14, A33's table (Passing chords owns approach chords), A43 (1719–1723); C3, C4, C7
  above. Audit: tabs, roles row, Library list, chips, "C → G" combobox, empty songs hidden DONE; the role row
  elsewhere, the groups, Insert, "+" between chords, fold summaries, In the key only open.
- **Today:** `ProgressionsTabs.tsx` (Progression · Library · Passing chords); `RoleChips.tsx` on the Progression tab
  and passing cards. "Progressions in this key" on Harmony are plain `RowLink`s (`PractiseChords.tsx:68`); a song's
  page doesn't show the role row. Passing chords group by `PASSING_CATEGORIES` (dominant · functional · chromatic ·
  diminished · diatonic · cadence) in `shared/lib/music/passing-chords.ts`; 16 kinds; no Insert
  (`SuggestionCard.tsx`). The walks section ("Practise in all 12 keys") lists nine sequences with one icon.
- **Will build:**
  - **The role row everywhere a progression is shown:** `RoleChips` (the chords, the function word and colour under
    each, the bass move between) is used by (1) the Library rows when a row is opened (tap the row's chevron ⌄:
    its role row under the bar cells), (2) Harmony's "Progressions in this key" rows (the row shows the role row
    in place of its plain chips), (3) a song's page section "Progressions in this song" where `in-songs.ts` finds
    one (`pages/piece`, the row under the section's chords). One component, no copies.
  - **Passing chords regrouped** (A23 919–947): `PASSING_CATEGORIES` becomes `['dominant', 'diminished',
    'chromatic', 'subdominant', 'bass']`, labels **Dominant approach** · **Diminished passing chords** ·
    **Chromatic approach** · **Subdominant approach** · **Bass-line passing chords** (ru «Доминантовый подход» ·
    «Проходящие уменьшённые» · «Хроматический подход» · «Субдоминантовый подход» · «Проходящие в басу»), each with
    one ⓘ line. `CATEGORY_OF`: secondaryDominant, tritoneSub, secondaryTwoFive, backdoor, backdoorTwoFive →
    dominant; diminishedApproach (passing ♯i°7), diminishedAbove (descending), commonToneDiminished → diminished;
    approachBelow, doubleApproach, + new `approachAbove` (a half step above) and `planing` → chromatic; plagal,
    minorPlagal → subdominant; walkUp, walkDown, gospelWalkUp, diatonicWalk (renamed `bassWalk`: the passing ⁶₄,
    I – I/3 – IV) → bass. The "cadence" and "diatonic" categories go.
  - Names checked against Bobrova and Gorshkov (`piano-data/books`); the en/ru names of each kind listed in the
    commit with the book and page.
  - **Each card** (`SuggestionCard.tsx`): the three chords as chips that play (C → B♭7 → E♭), their numerals in the
    key, the small staff of the voice leading drawn at once (no lazy wait), tags only from **Diatonic · Borrowed ·
    Chromatic** (computed: all in key / in the parallel key / neither) and a style tag **Jazz · Gospel ·
    Classical · Pop** where the kind has one (a table in the kernel), and a button **Insert** (ru «Вставить»).
  - **Insert:** on the Passing chords tab, with two chords chosen from the Progression tab's chain (the "C → G"
    combobox lists its adjacent pairs first), Insert puts the passing chord(s) between them in the line, switches to
    the Progression tab, and shows a toast "Inserted B♭7 · Undo". New `insertBetween(line: string, at: number,
    chords: readonly Numeral[]): string` in `widgets/progression-explorer/model/progressions-view.ts`.
  - **"+" between chords:** on the Progression tab's chord strip a "+" target between two chips (44px, shown on
    hover/focus on a laptop, always on a phone) opens the Passing chords tab filtered to that pair. The Grid view and
    the editor's chord row get the same "+" in round 4 (A37), opening a sheet of the same `PassingChordsList`
    component; listed there, not built here.
  - **Walks' icons** (`ProgressionPractice.tsx`): each sequence its own icon by direction (rising `TrendingUp`,
    falling `TrendingDown`, up and back `ArrowUpDown`, circle falling `RotateCcw`, circle rising `RotateCw`, thirds
    `Triangle`); the chord list under each shows the first three keys and "…": "C D♭ D …" (no cut mid-chord). The
    group hides for a one-chord line (done).
  - **Fold summaries:** `FoldSection` takes `summary` and shows it on the closed heading in small soft text: "38
    progressions · 13 styles", "9 sequences". Used wherever a section folds.
  - **Progressions, in a song's key** (A43 1719–1720): each row of "Songs with this progression" gets a ▷ **"Play in
    this song's key"** (ru «Сыграть в тональности песни») that sets the key picker to the song's key.
  - **Test yourself** (Progressions has it on the legend, done).
- **Not in this item:** "Reharmonise" (A43, listed there); the Grid/editor "+" (round 4).
- **Done when:** `passing-chords.test.ts`: "groups by how they lead: five groups"; the A23 cases "C → E♭", "C → Am",
  "G → C" each list the expected kinds per group, spelled in the key (B♭7, not A♯7). `ProgressionsPage.test.tsx`:
  "Insert puts B♭7 between C and E♭ and Undo takes it out"; "the + between C and G opens Passing chords on C → G";
  "Harmony's progressions show their role row". `pages/piece/ui/PiecePage.test.tsx`: "a song with I V vi IV shows
  its role row". Screenshots: Passing chords on C → E♭, a Library row opened, at the three sizes.

### A24: Each Practice page's own settings (content only)

- **Source:** A24 (963–992), A32 (1276–1290), Decided 20. Structure, routes and rows: round 1 S1–S8, S14.
- **What each page's settings ARE** (as round 1 lists them, plus this file's additions):
  - **Chords** (S1): Chord playback (Block · Broken · Rolled), Fingering (switch), Staff (Grand staff · Treble).
  - **Scales and keys** (S2): Fingering (Standard · From the thumb), Rhythm (Even · Dotted · Reverse dotted · Long,
    3 short · 3 short, long), Chord size on Harmony (Triads · 7th chords), Scales listed (families).
    Add from A43: the annotation layers of A43 (Degree numbers, Whole and half steps, Tonic and leading note,
    Tetrachords) as switches in a group **"On the staff"** (ru «На нотоносце»), defaults in A43.
  - **Intervals** (S3): Interval names, Compound intervals; A43's "On the staff": Name between the notes (on),
    Semitones (on), Inversion (off).
  - **Progressions** (S4): Written as, Voicing, First chord's inversion, and **Mode of typed numerals** (C4); "On
    the staff": Numerals under the chords (on), Voice-leading lines (off).
  - **Accompaniment** (S5): Sources shown and their order; "On the staff": Beats numbered (on), Hands named (off).
  - **Chord finder** (S6): Slash chords, Keys it is in, Scale on the keys, Remember chords; "On the staff": Chord
    tones labelled (on).
  - **Metronome** (S7): Sound (C9's list), Volume, Subdivision (hidden for Drum kit, C8), Flash on the beat (A39);
    **Saved tempos** group (A39 below).
  - **Exercises and Quiz** (S8): Questions, Time limit, Next question automatically; Answer with (once A41 lands).
  - **App-wide, General › Notation and names** (S12, A32): note names, chord symbols, numerals, sharps or flats,
    function colours, degrees on the keys. Not on any page.
- **Will build here:** only the "On the staff" switches' effects (A43) and Saved tempos (A39); the pages, routes and
  other rows are round 1's.
- **Done when:** each page's test in round 1 S1–S8, plus A43's and A39's tests below.

### A25: Accompaniment, Chord finder, Metronome, Exercises and Quiz

- **Source:** A25 (990–1023). Audit: names in one script, the gear, Quiz's My gaps DONE; the rest open.
- **Today:** `pages/accompaniment/ui/AccompanimentTabs.tsx` six `NavTabs` (sources) that scroll on a phone;
  `PatternShelves.tsx` rows titled "5.1 · …", with ♪ ♫ glyphs, descriptions cut, no icon; Chord finder's bar has
  `<MidiButton />` (`ChordFinderPage.tsx:55`); its empty staff is drawn small; Metronome: `TempoSteps.tsx` four round
  buttons (−10 −1 +1 +10), a pill Tap tempo, `TempoWordTip` an ⓘ, a `size-24` Play; Exercises' grid leaves holes.
- **Will build:**
  - **Accompaniment:**
    - The six source tabs become one `MenuPicker` **"Source"** in the page head (ru «Источник»): its options the
      sources shown (S5's order), each with its book's short name (Called to Play · Bobrova · Gorshkov · Styles ·
      My patterns …). The URL keeps `source`.
    - One naming rule: a pattern's title is its name alone ("Alberti bass", "Waltz, oom-pah-pah"); the book's number
      ("5.1") moves to the row's second line with the book ("Bobrova, 5.1"); no glyphs in titles.
    - The rhythm drawn as a picture: new `src/entities/pattern/ui/RhythmPicture.tsx` `RhythmPicture({ pattern }:
      { pattern: Pattern })`, a one-bar SVG of the pattern's right and left hand rhythms (noteheads and stems on two
      lines, from the pattern's own events), 64×28, at each row's start in place of an icon.
    - Row: `RowLink` with the picture, the name, a two-line description (`line-clamp-2`, never one cut line), ›.
      The same `RowLink` shape as Exercises' rows. Studies' titles wrap to two lines.
  - **Chord finder:**
    - `<MidiButton />` leaves the bar; the bar keeps the gear only. The empty state says the piano's status in words:
      **"No piano connected · Connect"** (link to Connect a piano) or **"{{name}} connected: play a chord"**, under the
      staff.
    - The staff (`ChordName` widget): one size, empty or not: the column's width at the page's staff size, an empty
      grand staff with clefs at full ink until the first chord; the chord's name above it in the heading size.
    - The chords remembered (when S6's Remember is on) as a history list below: rows "Cmaj7 · 2 min ago", a tap shows
      it again; Clear history as the list's last row (`DangerRow`, confirm).
  - **Metronome** (look; the rest is A39):
    - One `Stepper` for the tempo: **− 120 +**, the number large (48px) between, hold to repeat (Stepper gains
      `repeat`: after 400 ms, 10 steps a second, after 1.5 s by 5), tap the number to type (`typed`). −10/+10 buttons
      go; Shift+↑/↓ keep ±10.
    - The tempo word ("Allegro") in the page's text style under the number, not capitals; a tap opens a `MenuPicker`
      of the tempo words with their ranges ("Largo 40–60" … "Presto 168–200"), choosing one sets the tempo to its
      middle. `TempoWordTip.tsx` becomes `TempoWordPicker.tsx`.
    - Tap tempo: the same `Button` variant as other secondary actions (soft, control corner), not a pill.
    - Play: the floating capsule's Play (R5), the same size and colour as every Play; the 96px circle goes.
    - Time signature: a `MenuPicker` (one menu style), until A34's shared time control lands (round 4), then that.
  - **Exercises:** the grid is a list of `RowLink`s in groups (no card grid), so no group of two leaves a hole;
    descriptions two lines.
  - **Everywhere on Practice:** the on-screen piano's toolbar is round 3's (A26); nothing here.
- **Done when:** `AccompanimentPage.test.tsx`: "Source is one menu listing the shown sources"; "no row title holds a
  digit or a note glyph"; "each row has a rhythm picture". `ChordFinderPage.test.tsx`: "no MIDI button in the bar";
  "says 'No piano connected' with a Connect link"; "the staff's width is the same before and after a chord"
  (stubBox). `MetronomePage.test.tsx`: "holding + raises the tempo by repeats"; "typing 96 sets 96"; "Allegro opens
  the tempo words and Largo sets 50"; "Play is the capsule's". Screenshots of each page at the three sizes.

### A30: Fingering, one way everywhere

- **Source:** A30 (1171–1223); spec `.scratch/r29/fingering-service/spec.md` (kept, with the switch's home
  corrected below). Audit: "one chord rule" DONE (both use `handFingers`); everything else NOT DONE;
  `passage-fingering.ts` has no caller.
- **Today:** `src/shared/lib/music/fingering.ts` (`scaleFingering`, `thumbFingering`, `arpeggioFingering`,
  `fingerCrossings`, `runFingering`), `chord-fingering.ts` (`handFingers`, `blockFingering`, `placedFingering`),
  `passage-fingering.ts` (`fingerPassage`). Drawn four ways: `FingerRow` under the piano (crossing filled sky),
  numbers stacked on the keys with degrees and letters, `HandDiagram` (crossing underlined), Verovio's numbers
  (crossing bold sky, "2 4" collision at bar lines). Fingering on Chords (one chord), Scales' Notes and Exercises only.
- **Will build:**
  - **Kernel** `src/shared/lib/music/fingering/` (folder; `index.ts` re-exported by `music/index.ts`), with the
    spec's five functions and type `Fingered = { midi; hand; finger; crossing?: 'under' | 'over' | 'change' }`:
    `fingerChord(keys, hand | 'both')`, `fingerRun(keys, hand, kind?, way?)`, `fingerArpeggio(keys, hand)`,
    `fingerPassage(notes, hands)`, `fingerProgression(chords, hand)` (least movement). Files: `chord.ts`, `run.ts`,
    `arpeggio.ts`, `passage.ts`, `progression.ts`, `books.test.ts`. `fingering.ts`, `chord-fingering.ts`,
    `passage-fingering.ts` deleted; every caller moves (Chords, Scales, `exercise/inversions.ts`, `exercise/
    arpeggio.ts`, `exercise/scales.ts`, Hanon).
  - **One look** (DESIGN.md gets a "Fingering" section replacing lines 552–556):
    - on the on-screen piano: the finger in one ink circle on the key, the right hand's above the note name, the
      left hand's below; a crossing: the number in the accent colour (`--link`) with a small arc over it. No other
      number row: `FingerRow.tsx` deleted; degrees on the keys only on a degrees page (Key tab), never with fingers.
      `PianoKeyboard` takes `fingers?: readonly Fingered[]`.
    - on the score: right hand above the staff, left below (`place` by the staff's hand), crossing in the accent
      colour by a CSS class on Verovio's `<fing>` (`fing.crossing`), no collision: our notation writes
      `fingeringPosition` and nudges a number off a bar line (checked on C major two octaves).
    - hand pictures: `src/shared/ui/HandCard.tsx` replacing `HandDiagram.tsx`: a drawn right and left hand, palm
      down, one line style (SVG made once with the impeccable skill's asset steps, or a CC0 drawing adapted, its
      licence in `src/shared/ui/hand-art/SOURCES.md`), numbers on the fingertips, a crossing marked as on the piano.
      Where it teaches (a chord's shape, a scale's first five notes) the hand drawn over the keys it plays
      (`HandCard({ hand, fingers, keys?: readonly Midi[] })`).
  - **Fingering wherever notes are shown, from one source:** Harmony's seven chords (each chord card: its RH
    fingers under the chord), Key's borrowed chords (moved to Harmony, A21), Progressions (each chord of the
    voice-led line, `fingerProgression`, under the chips on the staff), Intervals (the two notes, `fingerChord` of two
    keys), Accompaniment patterns (`fingerPassage` over the pattern's bar), the Chord finder's chord (`fingerChord`),
    lesson examples and the Player (a score that prints none: "Suggested fingering" drawn lighter, the Player's
    legend says "Suggested"; in the editor a **"Keep suggested fingering"** action writes it in). Scales' "From the
    thumb · Standard" stays a choice of the run (round 1 S2).
  - **One switch:** **"Fingering"** shows or hides fingering everywhere at once. Its one home is app-wide,
    Settings › General, group "Notation and names" (round 1 S12), key `notation.fingering`, default on. Round 1's
    per-page `chords.fingering` (S1 row 2) is not built: one setting per idea (R18, Decided 20 "no setting on two
    pages"); the Chords and Player Settings pages carry no Fingering row. (Correction to round-1 S1 and to the spec's
    "home `player`".)
- **Not in this item:** the On-screen piano's other labels (A26, round 3); the editor's fingering tool (round 4).
- **Done when:** `fingering/books.test.ts`: the 12 major and 12 harmonic minor scales, two octaves, both hands, and
  the 24 triad arpeggios, against the printed books (Nikolaev, Shirinskaya; table in the file with page refs); the
  four inversions of C, F♯, B♭ triads each hand. `fingering/progression.test.ts`: "I–IV–V–I in C moves the fewest
  fingers". `src/app/fingering-agrees.test.tsx`: "C major in 1st inversion has the same fingers on Chords, the
  inversion drill and Progressions"; "C major two octaves both hands: the piano, the score and the hand card show the
  same numbers". `fingering-switch.test.tsx`: "Fingering off hides it on Chords, Scales, the Player". A30's Done:
  screenshots of C major two octaves on the piano, the score and the hand cards side by side at 1280.
- **Owner's question:** the hand art: draw our own SVG (default) or adapt a CC0 illustration?

### A31: Nothing flickers, nothing jumps

- **Source:** A31 (1224–1238); C2 above. Audit: buttons, re-engraving, the bar DONE; rows CONTRADICTS (C2);
  recordings NOT DONE.
- **Today:** 0a9069b4 fixed buttons, the bar and measuring before paint; 7875ffe7 undid the rows (C2). Open in
  `audit.md:53,55`: the floating actions' side room lands a frame late at 1280; the Chords heading block changes
  height with the chord at 402.
- **Will build:**
  - C2 (rows stay).
  - The Chords head (name, also written, staff) a fixed height per breakpoint: the staff box reserves the height of
    a two-hand grand staff (`min-h` from the score size), the "Also written" line reserves one line even when empty.
  - The floating actions' side room: computed in the same layout effect as `Docked`'s height
    (`FloatingActions.tsx`), so both land in the first frame.
  - The Chord finder's staff one size (A25).
  - **Recordings:** `e2e/no-jumps.spec.ts`: for Chords, Scales (each tab), Intervals, Progressions, the Metronome and
    the Chord finder, at 402 and 1280, change each choice in turn with `recordVideo` on, and compute the layout shift
    of untouched elements (`PerformanceObserver('layout-shift')`, `hadRecentInput` ignored by our script); the spec
    fails over 0.01 per change. Videos to `.scratch/r29/shots/after/r2-a31-*.webm`; before ones from `main` first.
- **Done when:** the e2e spec passes; `audit.md` rows 53 and 55 closed; each new jump found a row in the audit.

### A32: The theory pages: one owner per idea

- **Source:** A32 (1239–1291). Audit: relative once, Intervals → Quiz, Harmony's chords → Chords, Chord finder
  → Key DONE; "Progressions in this key" cap, walks, Notation and names, per-page defaults open.
- **Will build (the table's rows still open):**
  | Idea | Owner | Change |
  |---|---|---|
  | Root / key picker | `NotePicker` (one chord, a scale's root), `KeyPicker` (a key) | Intervals' `PitchPicker` stays (pitch only, A22); every other root is `NotePicker`, every key `KeyPicker` (C5, A21) |
  | Chord size | `ChordSizeField` (`shared/ui`) | Chords, Progressions use it; Harmony's moves to Settings (S2) |
  | Inversion | `InversionChoice` | Progressions' "first chord's inversion" (S4) draws `InversionChoice`'s pictures |
  | Voicing | Chords' list (`VOICINGS`) | Progressions' Block · Voice leading is how a line moves, not a chord voicing: it stays, named "Voice leading" (S4), no second list |
  | Hands | `Segmented` Right · Left · Both | one component `HandsChoice` (new, `shared/ui`) on Chords, Scales, Accompaniment |
  | Tempo | `Stepper` "Tempo" | Scales (A20), Metronome (A25), the Player's (round 4) |
  | A key's seven chords | Harmony's spine (A21) | the circle shows no chords; Progressions' strip links "See the key's chords ›" |
  | Which chords hold a note | Harmony (Harmonise) | the Chord finder's "keys it is in" opens Key (done) |
  | Progressions of a key | Progressions' Library | Harmony: at most 4 rows + "Show all n" opening Progressions in that key |
  | Walks | the Player's walk kinds, named as C3 | offered from Chords, Harmony, Progressions with the sequence chosen there |
  - `features/practice/ui/PractiseChords.tsx`: `commonProgressions()` sliced to 4, then a `RowLink` **"Show all
    {{n}}"** to `/practice/progressions?tab=library&key=…`.
  - App-wide "Notation and names" and each page's defaults: round 1 S12 and S1–S8.
- **Done when:** `src/app/one-owner.test.tsx`: "no page but Chords renders a Voicing menu"; "Harmony shows at most four
  progressions and Show all n"; "each shared control is one component" (each page's root/key/hands/tempo controls carry
  the shared component's `data-control` name). The settings registry test (round 1 S14) proves no setting on two
  pages.

### A33: Colour notes (what is left)

- **Source:** A33 (1292–1328); audit DONE except "every voicing name in Progressions is one of Chords'" (n/a) and the
  names checked against the books.
- **Today:** `ColourNotes.tsx`, `colour-notes.ts` done (chips heard and added, groups by the degree in a key).
- **Will build:** only what C1 adds (more triads take tones) and:
  - the names checked once more against `piano-data/books` (*The Chord Tensions Chart*, A43) chord by chord: the
    AVAILABLE table in `colour-notes.ts` compared with the chart for each of the nine 7th chords, differences fixed
    and the page cited in the table's comment;
  - Harmony's chords and Progressions' chords link to it: a chord card's corner link opens Chords with `key=` set
    (Harmony, done) and Progressions' chord chip menu gets **"Colour notes in Chords ›"** (opening Chords with the
    chord and `key=`).
- **Done when:** `colour-notes.test.ts`: "matches The Chord Tensions Chart for each 7th chord" (a table with the page);
  `ProgressionsPage.test.tsx`: "a chord's menu opens Chords on it in the key".
