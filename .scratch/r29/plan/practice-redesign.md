# Practice pages' redesign, and the app-wide pieces they show (Decided 21)

Scope: Chords, Scales and keys, Intervals, Progressions; the page-bar tabs pattern (every page with tabs, lessons
included); the key picker; one sheet everywhere and its selection; the chord-card grid rule; and, added by the owner the same
evening, the **chord player** (CP1–CP6: Progressions and Accompaniment merged into one Musicca-like page) and the
**sounds** for piano, bass, drums and metronome (SND). Starting point:
`round-2.md` (A20–A23, A30, A42, A43) and `round-1.md` (A5, S1–S4); this file **supersedes them where it says so**
(Decided 21, prompt 422–461, wins over everything). Research: the reference apps in `piano-data/reference-apps/`
(files named in each item), Apple's HIG, and the apps named in **Sources**. No code was changed.

Each item follows `briefs/plan.md`'s format, plus **Decision and why**. Screenshots: 390×844, 844×390, 1280×800,
light, en (ru where a string changed), in `.scratch/r29/shots/after/rd-<item>-<screen>-<size>.png`. Users in mind:
church accompanists and learners with a phone on the music stand: one hand free, glancing, reading lead sheets and
hymnals in keys like E♭, A♭ and D♭.

## Corrections to round-2.md and earlier descriptions

1. **`round-1.md` A5 and `.scratch/r29/key-picker/spec.md` §3 ("`KeyPicker` — the circle of fifths … a 'Select:
   <key>' button")** and **prompt A5 (601–604)**. Decided 21: no circle of fifths for picking a key. Correct: every
   key is picked from the key-signature grid (P2). The circle stays only as a picture on the Key view, not a picker.
2. **`round-2.md` A21 "One header … the pickers row (C5: Root + Scale on Notes and Harmony; Key on Key)"** and
   **its tab names Notes · Harmony · Key (A32)**. Correct: one scale picker for every view, its value the scale's
   full name ("B natural minor"), no "Root" label (P8); the views become **Scale · Chords · Key**, a segmented
   control inside the header card, each segment showing what it holds ("7 notes", "7 chords", "2 sharps") (P7).
3. **`round-2.md` A21, A23 and `ScalesPage.tsx`/`ProgressionsPage.tsx`/`AccompanimentPage.tsx`/`LearnPage.tsx`
   passing `tabs=` to `ScreenHeader`** (a second row under the bar). Decided 21: page bars stay one height. Correct:
   P1 (no `tabs` prop on `ScreenHeader`).
4. **`round-2.md` A23 "The page's structure, tabs: Progression · Library · Passing chords"** (and prompt A23,
   906–917). Correct: Progressions has no tabs: the Library is where a progression is chosen from (a sheet from
   the progression's name), Passing chords are what you insert between two of its chords (a sheet from the gap)
   (P13, P14).
5. **`round-1.md` S2 rows "Fingering (Standard · From the thumb)", "Rhythm", "Chord size on Harmony"** on Scales'
   Settings page. They change what the learner is looking at (the written run, the fingers, the chords), so by
   A24's own rule they belong on the page. Correct: P9 (Rhythm, Octaves, Start on, Direction above the sheet;
   Fingering in the Fingering section) and P7 (chord size on the Chords view). S2 keeps: Starting octave, Scales
   listed, On the staff.
6. **`round-1.md` S1 (Chords' Settings "Chord playback: Block · Broken · Rolled")** and **`round-2.md`'s "one Play"
   default (open question 6)**. Decided 21: Play and Arpeggio together but distinct. Correct: two labelled buttons
   in the capsule (P4); the Settings row goes.
7. **`round-2.md` A30 "hand pictures: `HandCard` … SVG made once … or a CC0 drawing adapted"** (an open question).
   Decided: P5 (our own drawing, method-book outline hands over the keys; logged in ADR 0052).
8. **`round-2.md` A22 "the chosen interval's panel … the floating capsule (Harmonic · Melodic rising · Melodic
   falling as pictured buttons)"** and `progress.md` row A22 ("way picture capsule DONE"). The owner did not
   understand those icons (Decided 21). Correct: P12 (a labelled "Play as" control on the page; the capsule holds
   Play all and Stop only).
9. **ADR 0096 (`docs/adr/0096-the-sheet.md`) and feedback-log "Selection and playhead: Tight selection … covers only
   the notes chosen … never empty space"**. Decided 21 replaces it for ranges: a range snaps to whole beats from the
   start of its bar and spans the meter's beats (P16). One note chosen for editing in the score editor stays tight
   (the note coloured), as before; only bands (ranges) change.
10. **`round-2.md` A43 "Overlaps: the harmonise cards … `grid-cols-[repeat(auto-fill,minmax(11rem,1fr))]`"** fixed
    one component. Decided 21 calls it a bug everywhere. Correct: one rule and one test for every card grid (P11).
11. **`round-2.md` A23 "Passing chords regrouped … Insert … '+' between chords opens the Passing chords tab"**. The
    groups and Insert stay; the tab goes; any two chords and the learner's own chord are allowed (P14).
12. **`docs/adr/0046-the-theory-kernel.md` / `RightHandFrom.tsx`'s "Right hand from"** (ADR 0046). The idea (where a
    two-hand chord's right hand starts) stays; its control becomes **Top note**, named by the note on top (P3).
13. **`round-1.md` S4 (Progressions settings) and S5 (Accompaniment settings)**: the two pages merge (CP1); their
    rows become CP6's one page (Written as, Voicing kept; Mode of typed numerals with them; Accompaniment's sources
    list goes with its tabs, the book patterns being styles, CP3).
14. **`rounds-3-4.md` A27 "the synthesised voice stays only while samples load"** and **`round-2.md` C9's drum-kit
    rows (VCSL bass drum, snare, hi-hat, suspended cymbal as ride)**: SND replaces the loading fallback with the
    public-domain Splendid piano and the kit with Virtuosity Drums.
15. **`round-2.md` A21 "Notes: … `PinnedKeyboard` … Octaves `Segmented` 1 · 2"** and `scale-view.ts`
    `RUN_OCTAVES = [1, 2]`. Correct: 1 to 4 octaves on a stepper (P9).

---

## P1: Tabs out of the page bar (every page with tabs)

- **Source:** Decided 21 "Page bars stay one height: tabs in a page's bar that make it taller than other pages' bars
  go"; "How the tabs relate … clear from the UI itself … the same for every Practice page's tabs and the lessons'
  tabs"; R1 (compact, one row); D1 (Songs' "My songs · Explore" in the app bar, the same control as Learn's).
- **Today:** `ScreenHeader` (`src/shared/ui/ScreenHeader.tsx:30,95`) draws a `tabs` prop as a second row of
  `NavTabs` (`.tab-strip`, underlined/filled tabs) under the bar: Learn (`LearnPage.tsx:51`, Lessons · Courses),
  Scales and keys (`ScaleTabs.tsx`), Progressions (`ProgressionsTabs.tsx`), Accompaniment
  (`AccompanimentTabs.tsx`, six sources), Admin (`AdminPage.tsx`). Those bars are about 48px taller than every
  other page's (owner screenshots `scales-key-tab-1280.jpg`, `progressions-let-it-be-1280.jpg`).
- **Decision and why:**
  - Apple's HIG (Navigation bars; Segmented controls): a segmented control may sit in a navigation bar **only at the
    top level of the hierarchy**, and then it replaces the title; on iOS it does not go in a toolbar, because
    toolbar items act on the screen rather than switch context. A screen under a Back button shows its views as a
    segmented control at the top of its content (Health's D · W · M · 6M · Y over its chart; App Store's Ratings
    and Reviews). macOS allows a segmented control in a window's toolbar to switch views (Calendar's Day · Week ·
    Month), in the same row as everything else, never a second row.
  - So two cases, and neither adds a row to the bar:
    1. **A place** (Learn, Songs): the switch takes the title's place in the one bar row. The place is already named
       by the tab bar (phone) or the sidebar (laptop). This is D1 as written.
    2. **A page under a place** (Scales and keys, Accompaniment; Progressions loses its tabs in P13): the bar is
       Back · title · actions, as every page's. The views are a segmented control **inside the header card of the
       thing they are views of** (P7), so the UI itself says "these are three views of D major": the thing chosen
       sits above, its views right under it, and each segment shows a live summary that changes with the choice.
  - Accompaniment's six sources become one **Source** menu in its page head (round-2 A25, kept). Admin's tabs follow
    case 2 (a segmented control at the top of its content); Admin is not in this area, listed so it is not missed.
- **Will build:**
  - `ScreenHeader` loses `tabs`. It gains `switcher?: ReactNode`, drawn in the title's place in the one row and only
    accepted where the screen is a place (the existing `large` prop marks a place's bar today; it becomes `place:
    true`, and the props' type makes `switcher` require it). The title stays for screen readers (the page's
    heading) when the switcher takes its place. Height: the bar's one token (`--bar-height`, 56px phone / 64px laptop) on every screen.
  - **Learn:** bar row `[Lessons | Courses]` (`Segmented`, `size="bar"`) · Search · + . ru «Уроки · Курсы».
  - **Songs:** bar row `[My songs | Explore]` (D1) · Search · Select · + .
  - **Scales and keys, Accompaniment:** bar row ‹ · title · actions (no second row). Scales' views: P7.
    Accompaniment: Source menu (round-2 A25).
  - `NavTabs.tsx`, `ScaleTabs.tsx`, `ProgressionsTabs.tsx`, `AccompanimentTabs.tsx`, `.tab-strip` in `theme.css`
    deleted.
  - The view is still in the URL (`?view=`, `?show=`), replaced, never pushed (R26).
- **Not in this item:** the switcher's own look (the one segmented style, R15, round 1 A8).
- **Done when:**
  - `src/app/bar-height.test.tsx` (new): renders every route of `app/routes/parents.ts` through `renderApp` with
    `stubBox`, asserts every `[data-screen-header]` has one row (`data-rows="1"`) and no `nav[aria-label]` inside it
    but the switcher; "Learn, Songs, Scales, Progressions and Accompaniment bars are the same height as Chords'".
  - Lint: `ScreenHeader`'s props have no `tabs`; `tsc` fails a `switcher` on a non-place.
  - Screenshots: Learn, Songs, Chords, Scales, Progressions at the three sizes, a strip of their bars stacked, one
    height.

## P2: The key picker: a key-signature grid, enharmonic keys named twice

- **Source:** Decided 21 "Keys: no circle of fifths for picking a key. Use the reference apps' controls (Flat's
  key-signature grid and the like); decide properly. C♯/D♭ are shown as the reference apps show enharmonic keys (both
  names where a key has two), not as today." A5 (577–620) where not replaced; D20 (Transpose has no circle).
- **Today:** two key controls. `KeyPicker` (`src/shared/ui/pickers/KeyPicker.tsx`, `KeyCircle.tsx`,
  `circle-layout.ts`): a value with ⌃⌄ opening the circle of fifths, a "Select: D♭ major" button; used by
  Progressions (`ProgressionExplorer.tsx:144`), the Chord finder, the lesson editor's examples
  (`ExampleView.tsx`, `ExampleFields.tsx`), the Player's progression setup. `KeySignaturePicker.tsx` (Flat's grid:
  Major · Minor, 1–7 sharps over 1–7 flats, signs only, "Switch to natural") in the score editor and New song. The
  Key view's own circle (`CircleOfFifths.tsx`) also chooses. Root pickers (`NotePicker`, `OctaveGrid.tsx`) split a
  black key's cell "C♯ | D♭", two half-cells to tap.
- **Decision and why:**
  - **Flat** (`flat-score-editor/IMG_4522.PNG`, New score "Key signature"): a card of 7 sharps over 7 flats, signs
    only, the chosen one tinted, no accidentals the default. **MuseScore 4** (Key signatures palette) lays out the
    same 15 signatures as cells, each named in its tooltip "D♭ major / B♭ minor". **Dorico** (Key signatures panel):
    a mode menu (Major · Minor …) over a grid of the tonics. **Journey app** (`06-key-explorer/01.png`): Key chosen as
    three menus "C · Natural · Major", then the facts "C Major · No sharps or flats". Ultimate Piano and the journey
    app's circles (`ultimate-piano/02-*`, `journey-app/07-*`) write the enharmonic wedges "F♯/G♭", "D♯m/E♭m".
  - A signature grid is right for keys because a key **is** its signature to a musician reading a hymnal: an
    accompanist sees three flats and needs E♭ major or C minor. It shows all 15 keys at once (no hidden choice,
    R29), needs no circle literacy, and is the control our editor and New song already use (A1: one component).
    The enharmonic keys are distinct cells (C♯ = 7♯, D♭ = 5♭), so both spellings are always reachable.
  - **Names:** Flat's cells carry signs only; ours add the tonic's name under the signs (our learners are not all
    engravers). Where a key has two names in use, the reference circles write both, so we do: in the grid each cell
    names its own key; wherever a key is **named in text** (a picker's value, a facts line, a list row), a key with
    an enharmonic twin in use shows both, the chosen spelling first: **"D♭ / C♯ major"**, **"B♭ / A♯ minor"**. The
    keys that have two: majors B/C♭, F♯/G♭, C♯/D♭; minors G♯/A♭, D♯/E♭, A♯/B♭ (the six signatures of 5–7 sharps or
    flats). Every other key has one name.
  - **Pitch-only cells** (a chord's root, a scale's tonic, Intervals' root, the melody note, Start on) are one cell
    per key of the octave, the black key's cell named **"C♯ / D♭"** in one label, one tap, as the circles and the
    journey app write it; the spelling is the usual one for what is built on it (`scaleRootSpelling`, the chord's
    `qualityRootSpelling`) and the other is one tap away on the page ("Also written D♭m", P3; P8). Two half-cells
    to tap at 44px each did not read as one key (today's "not as today").
- **Will build:**
  - `src/shared/ui/pickers/KeyPicker.tsx` rewritten: a value with ⌃⌄ ("Key  D♭ / C♯ major ⌃⌄") opening a popover
    (laptop) or a bottom sheet (phone) holding `KeySignatureGrid`:
    1. `Segmented` **Major · Minor** (ru «Мажор · Минор»), default the value's mode;
    2. a cell **"No sharps or flats"** (C major / A minor) on its own line (ru «Без знаков»);
    3. row **Sharps**: 7 cells, 1♯ … 7♯; row **Flats**: 7 cells, 1♭ … 7♭; each cell: the signs drawn on a staff
       fragment (`SignatureSigns`, exists) and under it the tonic in the chosen mode ("G", "Em", "C♯", "A♯m"),
       the chosen cell in the one selected style (R15). A tap chooses and closes; Esc closes; arrows move (a radio
       group, as `OctaveGrid`).
  - `KeySignaturePicker.tsx` (editor, New song) and the new `KeyPicker` share `KeySignatureGrid.tsx` (new, the grid
    alone, `KeySignatureGrid({ value, onChange }: { value: Key; onChange: (key: Key) => void })`). The editor keeps its
    "Switch to natural" (its own command).
  - `KeyCircle.tsx`, `circle-layout.ts`, `circle-layout.test.ts` deleted from `pickers/`. The Key view's
    `CircleOfFifths.tsx` becomes a picture (P7): no `onChange`, its wedges not buttons.
  - Key names: `useKeyName()` (`src/shared/i18n`) gains the twin: new kernel function
    `enharmonicKey(key: Key): Key | null` in `src/shared/lib/music/key.ts` (returns C♯ for D♭ major, null for E♭
    major), and `useKeyName()(key, { twin: true })` prints "D♭ / C♯ major"; every text that names a key uses it.
  - `OctaveGrid.tsx`: `split` removed; black cells labelled "C♯ / D♭" (`usualName` second). `NotePicker` returns a
    `PitchClass` plus the usual spelling for its context: `NotePicker({ value, onChange, spellFor }: { value:
    SpelledNote; onChange: (note: SpelledNote) => void; spellFor: (pc: PitchClass) => SpelledNote })`.
  - Used by: Progressions, the Chord finder, the lesson editor, the Player's progression setup, Scales (P8, its
    tonic grid is the same octave), the Quiz and Exercises' Keys checklist keeps its rows (A5) but names keys with
    the twin.
- **Not in this item:** Transpose (rounds-3-4's T, D20); the editor's "all the parts" switch.
- **Done when:**
  - `src/shared/lib/music/key.test.ts`: "enharmonicKey: D♭ major ↔ C♯ major, B ↔ C♭, F♯ ↔ G♭, the three minors,
    and null for the other 18".
  - `src/shared/ui/pickers/pickers.test.tsx`: "KeyPicker shows 15 cells in Major and the minor names in Minor";
    "a tap on 5♭ chooses D♭ major and the value reads D♭ / C♯ major"; "no element of the picker is a circle (no
    `[data-wedge]`)"; "the octave's black cell reads C♯ / D♭ and is one radio".
  - `src/app/key-names.test.tsx`: renders Scales' Key view on D♭ major and asserts "D♭ / C♯ major" in the header and
    "E♭ major" with no slash.
  - Screenshots: the picker open at 390 (sheet) and 1280 (popover), Major and Minor.

## P3: Chords: the chord chosen as the references choose it

- **Source:** Decided 21 "the chord size picked as the reference apps pick it (research); '7th' (♭7 · 7) and 'Right
  hand from' are not understandable: redesign them with controls that say what they do"; A20, A33; round-2 C1, C2.
- **Today:** `src/widgets/chord-explorer/ui/ChordBuilder.tsx`: a `PickerRow` (Root `NotePicker`, Quality
  `MenuPicker` Major/Minor/Diminished/Augmented/…, `VoicingField`), then a fields grid: **Chord size** `Segmented`
  Triad · 7th · 9th · 11th · 13th; **7th** `Segmented` "♭7 · 7" (title "Minor 7th / Major 7th") from the 9th up;
  **Suspension**; **Right hand from** `RightHandFrom.tsx` "♭3 E♭ · 7 B" (a two-hand close chord of five or more
  notes); **Inversion**; **Hands** Right · Both. Owner's screenshot `chords-cm-maj13-1280.jpg`.
- **Decision and why:**
  - **Chord Trainer** (`chord-trainer/08-*`, `09-*`): one row of menus, "C ⌃⌄ · Natural ⌃⌄ · Major ⌃⌄ · Triads
    ⌃⌄"; the size menu lists **Triads · 7ths · 9ths · 11ths · 13ths**; then Suspension chips, Add tones, inversions.
    **Piano Chords Compass** and the chord dictionaries (PG Music's Piano Chord Dictionary, pianochord.org): a root
    column, then a **chord type** list of the symbols themselves (maj7, m7, 7, m9, maj9, 13, m13 …), then additions.
    **Ultimate Piano** (`19-*`): "Root C · Type Major" menus in one toolbar.
  - The size is a menu in the picker row in every reference, never a five-part bar; and no reference has a separate
    "7th: ♭7 · 7" control, because the 7th's kind is part of the chord type a musician reads (C9 vs Cmaj9, Cm9 vs
    Cm(maj9)). So: **one Type picker** whose first level is the size (Chord Trainer's menu) and second level the
    types of that size, each shown as its symbol on the current root and its name (the dictionaries' list). The 7th
    question disappears: Cm(maj9) and Cm9 are two rows.
  - **"Right hand from"** describes the mechanism. What a pianist decides with two hands is **the note on top**
    (the melody note; jazz and gospel voicing books, and an accompanist harmonising a hymn tune, name a voicing by
    its top note). The control becomes **Top note**, each value the note and its degree ("D · 9th"), with a small
    picture of the right hand's notes. Single-hand chords keep **Inversion**, each value naming its bass
    ("1st inversion · E♭ in the bass"). One of the two shows, never both (R30).
- **Will build (route `/practice/chords`, the explorer's head, in order):**
  1. **Root** `NotePicker` (P2: "C♯ / D♭" cells), value "C".
  2. **Type** (new `ChordTypePicker`, `src/shared/ui/pickers/ChordTypePicker.tsx`): a value with ⌃⌄ showing the
     symbol suffix ("m(maj13)"). Opens a popover (laptop) / sheet (phone) with a `Segmented` **Triad · 6th · 7th ·
     9th · 11th · 13th** (ru «Трезвучие · Секст. · Септ. · Нона · Ундец. · Терцдец.»; full names in each option's
    `title`) and under it the list of that size's types, each row "Cm(maj7)" + "Minor-major 7th":
     - Triad: C · Cm · C° · C+ · Csus2 · Csus4 · C5;
     - 6th: C6 · Cm6 · C6/9 · Cm6/9;
     - 7th: Cmaj7 · C7 · Cm7 · Cm(maj7) · Cø7 · C°7 · C+maj7 · C+7 · C7sus4;
     - 9th: Cmaj9 · C9 · Cm9 · Cm(maj9) · C9sus4 · Cø9;
     - 11th: Cmaj11 · C11 · Cm11 · Cm(maj11);
     - 13th: Cmaj13 · C13 · Cm13 · Cm(maj13) · C13sus4.
     Names as the chord-symbol books write them (checked against *The Chord Tensions Chart* and Chord Trainer's
     list, A33); the list is `CHORD_TYPES` built in the kernel from `qualityIntervals`, not typed by hand.
     Choosing a size keeps the type's family (Cm9 → 13th gives Cm13). Replaces Quality, Chord size, 7th and
     Suspension.
  3. **Voicing** `VoicingField` (round-2 A20's pictures).
  4. **Inversion** (`InversionChoice` as a menu with pictures; values "Root position · 1st inversion · E♭ in the
     bass" …) for a one-hand voicing; **or Top note** (new `TopNotePicker`, replacing `RightHandFrom.tsx`): a menu
     of the right hand's possible top notes, "D · 9th", "A · 13th", each with a picture of the right hand's notes on a
     staff fragment; for a two-hand close chord of five notes or more. Same `chord.inversion` in the URL (no route
     change): the kernel maps a top note to the right hand's inversion, `inversionForTop(tones, top): number` in
     `src/shared/lib/music/voicing.ts`.
  5. **Hands** `Segmented` Right · Both, only for a one-hand close chord (unchanged).
  Colour notes (A33) stay under the head as they are.
- **Moves and goes:** `RightHandFrom.tsx` deleted; the Quality `MenuPicker`, the size and 7th `Segmented`s and the
  Suspension row deleted from `ChordBuilder.tsx`; keys `practice:chords.builder.seventh`, `sevenths`, `handFrom`
  removed in en and ru.
- **Not in this item:** added tones and alterations (A33, the Colour notes panel); the voicing pictures (round-2
  A20).
- **Done when:**
  - `src/shared/lib/music/chord-types.test.ts`: "every CHORD_TYPES row spells on C as the table" (a table, the book's
    page in a comment); "each size lists its types"; "Cm9 at 13th becomes Cm13".
  - `src/shared/lib/music/voicing.test.ts`: "inversionForTop: Cm(maj13) top D gives the right hand E♭ G B D".
  - `src/pages/chords/ui/ChordsPage.test.tsx`: "Type at 9th lists C9 and Cmaj9 and choosing Cmaj9 shows Cmaj9";
    "no control is labelled 7th or Right hand from"; "Top note shows for Cm(maj13) and Inversion does not";
    "Inversion shows for Cm7 and Top note does not".
  - Screenshots: the Type picker open at 390 and 1280; Cm(maj13) and Cm7 heads.

## P4: Chords: Play and Arpeggio

- **Source:** Decided 21 "Chords' Play and Arpeggio: together, but distinct: two buttons or clearer icons"; R5, R21
  ("an icon … always with its label").
- **Today:** `ChordExplorer.tsx` floats a capsule of an `AudioLines` icon (arpeggio), a round Play and a keyboard
  toggle, with no labels (`chords-cm-maj13-1280.jpg`); it sits over the Tensions card.
- **Decision and why:** Chordify and Chord Trainer play a chord on tap and offer an arpeggio as a separate, named act;
  piano teachers say "play it blocked" and "play it broken (arpeggiated)". Two labelled buttons side by side read
  as two ways to hear one chord; an icon alone was not understood.
- **Will build:** the page's capsule (`FloatingActions`, one centred capsule, R5), left to right:
  1. **Play** (primary, the round accent button with ▶ and the label "Play" beside it; ru «Играть»): the chord
     together. While sounding: ■ "Stop".
  2. **Arpeggio** (secondary, the soft button with a new icon of three notes rising, `src/shared/ui/icons/
     ArpeggioIcon.tsx`, and the label "Arpeggio"; ru «Арпеджио»): the notes from the bottom up, then held. While
     sounding: ■ "Stop".
  3. a divider, then the on-screen piano's show/hide (its own icon and label "Piano"; ru «Пианино»).
  On a phone below 400px the labels stay (the capsule is about 300px); the page gets bottom padding of the capsule's
  height plus 16px so the last card scrolls clear of it (`FloatingActions` exposes `--capsule-room`).
  Round-1 S1's "Chord playback" row is not built (correction 6).
- **Done when:** `ChordsPage.test.tsx`: "Play sounds the notes at one time, Arpeggio one after another" (fake audio
  `setNow`); "each capsule button has a visible label"; `stubBox`: "the last card's bottom is above the capsule".
  Screenshots at the three sizes.

## P5: Chords: hand drawings for fingering

- **Source:** Decided 21 "the hand drawings are proper hands (the decision logged), not today's shapes"; A30.
- **Today:** `src/shared/ui/HandDiagram.tsx`: a rounded blob with five bars, numbered circles on top; beside it the
  note letters and finger numbers in two rows (`ChordFingering.tsx`, `ScaleFingering.tsx`).
- **Decision and why:** none of the reference apps draws a hand (`scratchpad/r29/tools-fingering-refs.md`: Ultimate
  Piano numbers the keys; flowkey films real hands over the keys, `flowkey/07-*`; new-app's hands are decoration).
  The printed method books our learners know (Alfred's, Faber's *Piano Adventures*, the Russian school's
  "аппликатура" pictures) draw **a hand outline palm down, the five fingers numbered on the fingertips, the thumb
  short and to the side**, and place it over the keys it plays. That is the drawing: it teaches the finger numbers
  and where each falls, and needs no photograph.
- **Will build:**
  - `src/shared/ui/HandCard.tsx` (replaces `HandDiagram.tsx`; round-2 A30 names it): `HandCard({ hand, fingers,
    keys }: { hand: 'rh' | 'lh'; fingers: readonly Fingered[]; keys: readonly Midi[] })`:
    - an octave-and-a-bit of keys drawn (the span of the notes plus a key each side), the played keys tinted;
    - over them the hand outline (one SVG path for the right hand, mirrored for the left), drawn once in
      `src/shared/ui/hand-art/hand.svg` as a single 1.5px line, skin left unfilled, proportions from a real hand
      (middle finger longest, thumb at about 40° and two-thirds the index's length), each fingertip's centre placed
      over its key by the component (the fingers bend toward their keys; a finger not used is drawn light);
    - on each used fingertip its number in a 20px ink circle; a thumb crossing marked as on the piano (A30);
    - the title "Right hand" / "Left hand" and the notes under the keys ("E♭ F A B D").
  - Used on Chords, Scales' Fingering section (P9), the Exercise page (A41), lessons.
  - ADR **0052** gets a section "Fingering drawn as the method books draw it" with this decision and its sources;
    `hand-art/SOURCES.md` says the drawing is ours.
- **Not in this item:** the fingering rules (A30's kernel).
- **Done when:** `src/shared/ui/HandCard.test.tsx`: "places finger 1 over E♭ and 5 over D for Cm(maj13)'s right
  hand" (the fingertip circles' `data-key` match the midi); "a finger not used is drawn light"; "the left hand is the
  right mirrored". A screenshot of both hands on Cm(maj13) and C major's scale at 390 and 1280, beside the old.

## P6: Chords: the top section filled, adapting to width

- **Source:** Decided 21 "the top section (the name, the staff) is not half empty: the sheet placed properly; every
  page adapts to its width"; R28; A31 (no jump).
- **Today:** `chords-cm-maj13-1280.jpg`: the name "Cm(maj13)" large at the left, a small grand staff at the far
  right, about 400px of empty band between and under them; the pickers below.
- **Decision and why:** Chord Trainer and the journey app (`journey-app/08-*`) stack name, notes, staff and keys
  as one card; Ultimate Piano gives the staff the page's width. A chord's page answers "what is it, what notes, how
  does it look": the name and the staff belong side by side at a size where the staff is read, not decorated.
- **Will build:** a **chord head card** (`src/widgets/chord-explorer/ui/ChordHead.tsx`, new), its height fixed per
  width band so nothing jumps when the chord changes:
  - **≥ 64rem:** two columns, `grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`: left the symbol (display size, 56px),
    under it the name ("C minor-major 13th"), "Also written …" (a button that respells, P2), the note chips (each
    plays, R5's chip family) and the picker row (P3) at the column's foot; right the grand staff (`Sheet`, P15) at
    the app's staff size (one staff space = 10px), filling its column, fingering on it per A30.
  - **48–64rem:** the same two columns, equal.
  - **< 48rem (phone, 844 landscape included):** one column: symbol and name, the staff the column's width, the
    note chips, the picker row.
  - Under the card on a laptop, Fingering and Colour notes sit in an even grid (`auto-fill, minmax(22rem, 1fr)`,
    R28), each card full height of its row.
- **Done when:** `ChordsPage.test.tsx` with `stubBox` at 1280: "the staff's box is at least 45% of the head's width";
  "the head's height is the same for C and Cm(maj13)". Screenshots at the three sizes and 1440.

## P7: Scales and keys: what replaces Notes · Harmony · Key

- **Source:** Decided 21 "Notes · Harmony · Key do not say what they mean or how they relate … Redesign the page,
  not just describe it"; P1; A21, A32, A42, A43.
- **Today:** tabs Notes · Harmony · Key in a second bar row (`ScaleTabs.tsx`), each view with its own header
  (`ScaleLayout`), its own pickers (Key view: the circle chooses), its own facts.
- **Decision and why:**
  - Ultimate Piano's MODE menu (Scale · Diatonic chords · Circle) and the journey app's Key Explorer (key chosen,
    then Key Signature, Chords, On the Piano in one column, `journey-app/06-*`) both present **one key or scale,
    then what you can do with it**. The learner understands "these are about D major" when D major is chosen once,
    above, and the views sit under it.
  - The names say what is inside, in the words a teacher uses: **Scale** (the notes to play, with fingering),
    **Chords** (the key's chords and what harmonises a note), **Key** (its signature, relatives, neighbours,
    songs). "Harmony" and "Notes" were abstract. "Chords" no longer collides with the Chords page because it sits
    under "D major", and each chord card opens the Chords page on that chord (the relation shown, not stated).
  - Each segment shows a live summary under its word, so a choice visibly changes every view: Scale "7 notes",
    Chords "I–vii°", Key "2 sharps". That is how the UI itself says one choice drives all three.
- **Will build (route `/practice/scales`, `?show=scale|chords|key` unchanged):**
  - **Header card** `src/widgets/scale-explorer/ui/ScaleHeader.tsx` (new; replaces `ScaleLayout`'s three headers):
    1. the scale picker as the card's title (P8): "**D ⌃⌄ major ⌃⌄**", heading size;
    2. the staff (`Sheet`, P15): the key signature and the scale up an octave, the column's width;
    3. the notes as chips (each plays), the tonic first;
    4. the facts line (P10);
    5. the views: `Segmented` with two-line segments, inside the card, its full width:
       **Scale** / "{{n}} notes" · **Chords** / "{{first}}–{{last}}" (I–vii°) · **Key** / "{{signature}}" ("2
       sharps", "No sharps or flats"). ru «Гамма / {{n}} нот» · «Аккорды / I–vii°» · «Тональность / 2 диеза». A
       view the scale doesn't have is not drawn (`showsOf`, R30): a blues scale shows Scale alone and then no
       segmented control at all.
    The page's Play (the capsule) plays what the view shows: the run (Scale), the chords in order (Chords), the
    cadence I–IV–V–I (Key).
  - **Scale view:** the run's controls above the sheet (P9), the sheet, the Fingering section (P5, P9), "Practise in
    the Player" (round-2 A21's exercise rows with their own icons).
  - **Chords view:** `Segmented` **Triads · 7th chords** (ru «Трезвучия · Септаккорды»; moved back from Settings,
    correction 5) and **Inversion** menu; the seven-degree row (round-2 A21's `DegreeSpine`); "Borrowed chords";
    "Harmonise a melody note" (P11's grid); "Practise in all 12 keys"; "Progressions in this key" (≤ 4 + Show all).
  - **Key view:** the circle of fifths as a **picture** (the key, its relative and its two neighbours lit; not a
    picker, P2), beside it the signature named ("2 sharps: F♯ C♯"), Relative and Parallel as links, the neighbours as
    links, Modes; "Songs in this key" (6 + Show all). No menus of its own (the owner's "the menus on Key are not
    understandable": they go; the header's picker is the one).
  - `ScaleLayout.tsx`, `ScaleTabs.tsx`, `CircleOfFifths`'s `onChange` deleted.
- **Done when:** `src/pages/scales/ui/ScalesPage.test.tsx`: "the header is the same element on all three views";
  "the views read Scale / 7 notes, Chords / I–vii°, Key / 2 sharps for D major and change to 3 flats for C minor";
  "a blues scale shows no views control"; "the Key view has no menu or combobox"; "the circle has no buttons".
  Screenshots: D major's three views at 390 and 1280; B♭ minor's Chords view.

## P8: Scales and keys: the scale picker ("Root" of what)

- **Source:** Decided 21 "'Root B' doesn't say of which scale".
- **Today:** `PickerRow` "Root C ⌃⌄ · Scale Major ⌃⌄" above "C major" written again as a 48px title.
- **Decision and why:** Chord Trainer and the journey app (`chord-trainer/04-*`, `journey-app/06-01`) write the
  choice as the name itself: "C ⌃⌄ Natural ⌃⌄ Major ⌃⌄". Reading "D ⌃⌄ major ⌃⌄" there is no "Root" to puzzle over,
  and no second title (R29 "one title").
- **Will build:** the header's title is two menus that read as the scale's name:
  - **Tonic** (`NotePicker`, P2's octave, "C♯ / D♭" cells; its accessible name "Tonic", ru «Тоника»), the spelling
    `scaleRootSpelling` gives, the other in the facts line as "Also written C♯ minor" (a button that respells);
  - **Scale** (`MenuPicker`, its options grouped by `SCALE_FAMILIES`: Major and minor · Modes · Pentatonic and
    blues · Symmetric · Other, each option the scale's name, e.g. "natural minor", "Dorian"), accessible name
    "Scale".
  Both in the heading's type, underlined dotted with the ⌃⌄ mark, so they read as one title. The `text-5xl` name and
  the `PickerRow` go.
- **Done when:** `ScalesPage.test.tsx`: "the heading reads 'B natural minor' and its two parts are the Tonic and Scale
  menus"; "no element is labelled Root". Screenshots of the header at 320, 390, 1280.

## P9: Scales and keys: Range, Fingering, Start on, Rhythm by what they affect

- **Source:** Decided 21 "Octaves (why only 1–2, more and customisable), Fingering, Start on and Rhythm are mixed
  (which belongs to the sheet, which to playing)".
- **Today:** `RunView.tsx`: Hands, On the keys, Octaves (`Segmented` 1 · 2, `RUN_OCTAVES`), Start on, Fingering,
  Rhythm (`Dropdown`), `TempoSlider`, in a two-column fields grid above the piano (`practice-scales-1280.png`).
- **Decision and why:**
  - new-app's scale settings (`new-app/IMG_4695.PNG`): One hand · Two hands, **Octave range 1 · 2 · 3 · 4**, the
    first hand's start octave, Tempo; its face has **Asc · Desc · Asc & Desc** beside Play (`IMG_4690.PNG`).
    Ultimate Piano (`01-*`): HAND, **RANGE "1 octave"**, OCTAVE − 3 +. Scale books (Hanon's scales, the ABRSM and
    Russian school syllabi) practise 1 to 4 octaves.
  - Group by what changes: **what is written** (the run on the sheet and the keys: hands, octaves, start, direction,
    rhythm) sits as one row right above the sheet it changes; **the fingers** (which fingering) sit in the
    Fingering section they change; **how fast it plays** (tempo) sits with Play in the capsule, as in the Player and
    the Metronome. On-the-keys labels are the on-screen piano's own toolbar (round 3, A26), not a page control.
- **Will build (Scale view, top to bottom):**
  1. **The run** — one compact row (`PickerRow`, wrapping at 320): **Hands** `Segmented` Right · Left · Both;
     **Octaves** `Stepper` 1–4, default 2 (− 2 +; ru «Октавы»); **Start on** `MenuPicker` of the scale's notes
     ("D (1st)", "E (2nd)" …; hidden for the chromatic scale); **Direction** `MenuPicker` Up and down · Up · Down
     (ru «Вверх и вниз · Вверх · Вниз»), default Up and down; **Rhythm** `MenuPicker` Even · Dotted · Reverse dotted
     · Triplets · Groups of four (names from Hanon's and the scale books' practice rhythms; today's ids kept).
  2. the sheet (P15), then the on-screen piano.
  3. **Fingering** section (`SectionHeading`), its first line a `Segmented` **Standard · From the thumb** (only when
     the scale has both, as today), then the hand cards (P5).
  4. the capsule: Play (the run) · **Tempo ♩ = 80** (a button opening a `Stepper` 40–208, as the Player's tempo).
  Scales' Settings (`/practice/scales/settings`, round-1 S2) holds **Starting octave** (`Stepper` C2–C5, default C4
  for the right hand, the left an octave lower; ru «Начальная октава»), **Scales listed**, **On the staff**.
  - `scale-view.ts`: `RUN_OCTAVES` becomes `MIN_OCTAVES = 1`, `MAX_OCTAVES = 4`; `ScaleView` gains `direction: 'both'
    | 'up' | 'down'`; `scaleRunOf` takes it; `TempoSlider.tsx` deleted; `RUN_KEY_SHOWS` and the "On the keys"
    control deleted (the piano's toolbar shows fingers or notes, A26).
- **Done when:** `scale-run.test.ts`: "4 octaves of D major has 57 notes up and down"; "direction up stops at the top";
  `ScalesPage.test.tsx`: "the run row holds Hands, Octaves, Start on, Direction, Rhythm and nothing else"; "Fingering
  is in the Fingering section"; "Tempo is in the capsule". Screenshots at the three sizes.

## P10: Scales and keys: facts that follow the chosen scale

- **Source:** Decided 21 "the structure and formula are hardcoded and don't follow the chosen scale".
- **Today (checked in the code first, rule 7):** `ScaleFacts.tsx` computes the formula from `spellScale` (degrees
  "1 2 ♭3 …") and the structure from `scaleGaps` (`scale.ts:316`), so the numbers do follow the kind. What reads as
  hardcoded: (a) the names row under the formula is a **key's** degree names for every seven-note scale
  (`scaleDegreeNames`, `scale.ts:306`): Lydian's ♯4 is still called "Subdominant", Phrygian's ♭2 "Supertonic";
  (b) nothing marks what differs from major, so C major and C Dorian look alike at a glance; (c) the facts sit apart
  from the staff and the keys, in a loose table (`practice-scales-1280.png`).
- **Decision and why:** theory books (and musictheory.net's lessons) teach a scale by its **formula against the major
  scale** and its **steps** drawn between the notes; Ultimate Piano writes the degree on each key (`01-*`: "♭3 E♭",
  "♭5 G♭"). So the facts are drawn on the music and the differences are coloured.
- **Will build:**
  - The header's facts line (P7 item 4): **Formula** as chips "1 2 ♭3 4 5 6 ♭7", the degrees that differ from major
    in the accent colour; **Steps** "W H W W W H W" (ru «Т П Т Т Т П Т», тон/полутон) drawn between the noteheads on
    the header's staff (A43's annotation `step`) and between the chips; for a mode, "Mode of C major ›" (a link);
    for a minor kind, "Relative F major ›".
  - Degree **names** only where the books use them: major and the three minors (tonic … leading note / subtonic);
    for a mode, its **characteristic note** named instead ("Dorian: raised 6th", A43's addition); none for
    pentatonic, blues, symmetric scales.
  - `scaleDegreeNames` becomes `scaleDegreeNames(kind): readonly DegreeName[] | null` returning null for modes;
    new `alteredFromMajor(kind): readonly number[]` (the degree indexes that differ) in `scale.ts`.
- **Done when:** `src/shared/lib/music/scale.test.ts`: a table over every `ScaleKind` asserting formula, steps and
  `alteredFromMajor` (e.g. Dorian → [2, 6] i.e. ♭3 ♭7; Lydian → [3]); "modes have no degree names".
  `ScalesPage.test.tsx`: "changing Major to Dorian changes the formula chips to 1 2 ♭3 4 5 6 ♭7 with ♭3 ♭7 marked".

## P11: Overlapping chord cards: the bug and the grid rule

- **Source:** Decided 21 "chord cards that overlap (Key tab, Harmonise a melody note) are a bug everywhere"; A43;
  R28.
- **Today (the cause, from the code):** `HoldingGroupCard.tsx:25` lays cards in `grid-cols-2 sm:grid-cols-3`, i.e.
  tracks of `minmax(0, 1fr)`, inside a parent that already puts four groups side by side. A track can shrink below
  its card, and the card's second line ("as ♭3 · in the key", a `ChordButton` numeral span inside a `Button` whose
  base class is `whitespace-nowrap`) cannot wrap, so the card spills over its neighbour (`scales-key-tab-1280.jpg`:
  Bm7/Em7, F♯7♭13/F13). Borrowed chords and the spine use other grids with the same risk.
- **Decision and why:** a card grid's track must never be narrower than the card's content: the CSS grid rule is
  `repeat(auto-fill, minmax(<card minimum>, 1fr))` so the browser drops a column instead of squeezing, and the card's
  text must be allowed to wrap. Groups are not nested in columns of columns.
- **Will build:**
  - `src/shared/ui/CardGrid.tsx` (new): `CardGrid({ min, children }: { min: 'chord' | 'row' | 'tile'; children })`
    with `grid-template-columns: repeat(auto-fill, minmax(var(--card-min-<min>), 1fr))` (`--card-min-chord: 8.5rem`,
    `row: 18rem`, `tile: 11rem` in `theme.css`), `gap` the one card gap. Every grid of cards in widgets and pages
    uses it: Harmonise, Borrowed chords, the spine's wrap on a phone, Songs in this key, Progressions' chord cards,
    Practice's groups, the Chord finder.
  - `ChordButton.tsx`: every line `whitespace-normal min-w-0 text-balance`; the button's `whitespace-nowrap` reset.
  - Harmonise: each group (Triads, Major 7ths, Minor 7ths, Dominant 7ths …) a full-width section stacked
    vertically, its own `CardGrid min="chord"`; the card's second line shortened to "**D = ♭3**" (the melody note's
    place in the chord; ru «ре = ♭3»); a chord of the key marked by the one "in the key" style (a filled dot before
    the symbol, its legend once above the groups: "● in D major"). "In the key only" becomes `Segmented` **In the key
    · All chords** (round-2 A20).
  - Lint: `no-restricted-syntax` in `eslint.config.js` forbids `grid-cols-[0-9]` in a `className` under
    `src/widgets` and `src/pages` for lists (`ul`, `ol`) of cards; a list of cards uses `CardGrid`.
- **Done when:** `e2e/no-overlap.spec.ts` (Playwright, real layout): for Scales (each view), Chords, Progressions,
  Intervals, Practice, Songs in this key, at 320, 390, 844 and 1280, for every `[data-card-grid] > *` pair, the
  bounding boxes do not intersect (tolerance 0.5px), and no card's `scrollWidth` exceeds its `clientWidth`.
  `CardGrid.test.tsx`: "uses auto-fill with the chord minimum". Screenshots: D major and B♭ minor Harmonise at the
  four widths.

## P12: Intervals: icons, meanings, descriptions

- **Source:** Decided 21 "Intervals: its icons and what they do are not understandable: proper icons, meanings and
  descriptions"; A22, A43.
- **Today:** `practice-intervals-402.png`: Root picker; two folded lists "Within the octave", "Past the octave"; each
  row ▷, "m3", "Minor third", "3 semitones", ⓘ, a 120px mini keyboard; the capsule holds three icon-only buttons
  (`WayPicture.tsx`: dot pairs for harmonic, rising, falling) and Play; "Train your ear" with "Intervals by ear".
- **Decision and why:**
  - Ear-training apps name the three ways **Ascending · Descending · Harmonic** (Musical U, goodEar Intervals,
    teoria.com's Direction "ascending / descending" and Type "melodic / harmonic"). Words a learner already reads in
    an exam syllabus; three icons of dots were not. The choice changes what every row sounds like, so it belongs on
    the page head as a labelled control, not as unlabelled icons in a floating bar.
  - The truthful picture of an interval is the interval written: two notes on a staff fragment
    (theory-trainer's interval cards, `theory-trainer/03-*`, draw it so). It tells m3 from M6 at a glance; a 120px
    keyboard with two dots did not, and it repeats the on-screen piano below.
  - One plain description per interval, what it sounds like and where it is met, from the theory books (the
    owner's "meanings and descriptions"), on the row itself as its second line; ⓘ removed.
- **Will build (route `/practice/intervals`):**
  - Head row: **Root** (`NotePicker`, P2, unsplit cells) · **Play as** `Segmented` **Ascending · Descending ·
    Harmonic** (ru «Вверх · Вниз · Вместе»), each segment a 24px staff picture (two notes rising / falling /
    stacked, `WayPicture` redrawn as notation) with its word, default from Intervals' Settings.
  - The chosen interval's panel (round-2 A22's `IntervalDetail`, kept): the staff with both notes and the name
    between, "3 semitones", "Inverts to major 6th ›", "Consonant", "Test yourself".
  - **Rows** (`IntervalRow.tsx`), one list, no card grid (A22): left a 40×32 staff picture of the interval on the
    chosen root (new `IntervalPicture({ interval, root, way })`, drawn by our notation, not Verovio, for speed);
    the name "Minor 3rd" (abbreviation "m3" after it in muted text); under it the description (one line, wraps,
    never cut); at the row's end a 44px ▷ "Play" button (its accessible name "Play minor 3rd"); the row itself
    chooses the interval for the panel. The mini keyboard and the ⓘ go.
  - Descriptions (en; ru translated with the same meaning, checked with the humanizer skill), keys
    `practice:intervals.meaning.<id>`:
    - P1 "The same note twice." · m2 "A half step: the tightest clash; the leading note to the tonic." · M2 "A whole
      step: one scale step." · m3 "The 3rd of a minor chord: darker." · M3 "The 3rd of a major chord: brighter." · P4
      "Open and stable; the subdominant above the tonic." · A4/d5 "The tritone: three whole steps, the tension in a
      dominant 7th." · P5 "The most open consonance; the root and 5th of every triad." · m6 "Soft and sad: a major
      3rd turned upside down." · M6 "Warm and open: a minor 3rd turned upside down." · m7 "The 7th of a dominant
      chord: wants to resolve." · M7 "A half step below the octave: sharp and bright, the 7th of a major 7th chord."
      · P8 "The same note an octave higher." · compound intervals "The {{simple}} an octave higher: the {{n}}th of a
      chord."
  - Group titles: **Simple intervals** (within the octave) and **Compound intervals** (past the octave), the
    theory books' names (ru «Простые интервалы · Составные интервалы»); both open, the compound group's visibility
    on Settings (S3).
  - Capsule: **Play all** (each interval in turn, the chosen way) · Stop. The three way icons leave the capsule.
  - "Train your ear": the row "Intervals by ear" gets the Quiz's ear icon and the line "Name intervals you hear".
- **Done when:** `IntervalsPage.test.tsx`: "Play as reads Ascending, Descending, Harmonic, each with a picture and
  its word"; "each row shows the interval on a staff, its name, its description, and a Play button named 'Play minor
  3rd'"; "no row has a keyboard or an ⓘ"; "the capsule has Play all and no way buttons"; ru: "Вверх · Вниз ·
  Вместе". Screenshots at the three sizes.

## P13: Progressions: no tabs; Library and Passing chords around the one progression

> **Superseded in part by CP1–CP6** (the owner's chord-player decision, written after this item): the page becomes
> the Chord player (`/practice/chord-player`); its Key picker becomes text linking to Settings' Transpose (CP4, CP6);
> the strip is the chord sheet (CP2). What stays from P13: no tabs, the Library opened from the name, Passing chords
> from the gap, the deleted explanatory line.

- **Source:** Decided 21 "Passing chords … don't belong in Progressions as they are … How the tabs relate and that
  one tab's choice changes another must be clear from the UI itself, not from a line of description"; D14 (roles
  on the chords); A23.
- **Today:** tabs Progression · Library · Passing chords in a second bar row (`progressions-let-it-be-1280.jpg`);
  choosing in Library changes the Progression tab out of sight; Passing chords acts on a pair of the Progression
  tab's chords, also out of sight, with an explanatory line ("Chords that lead…"); the staff is drawn at half the
  width; "Only the key's own chords. Most pop songs need no others." explains a control.
- **Decision and why:** the three tabs are not three views of one thing; they are **one thing** (the progression)
  and **two acts on it** (pick one from the library; put chords between two of its chords). Hooktheory's chord
  editor and Chordify's chord grid show the one sequence and open a picker *on* a chord or a gap; Ultimate Piano's
  Passing Chords asks for the two chords and lists the ways (`ultimate-piano/04-*`). Putting the acts where they
  apply shows the relation without a word: the Library opens from the progression's name and fills it; the passing
  chords open from the gap between two chords and are inserted there.
- **Will build (route `/practice/progressions`, `?tab=` removed, `?line=`, `?key=`, `?size=` kept):**
  - Bar: ‹ · "Progressions" · gear (editors also the pencil and +, unchanged). No second row.
  - **Head card:**
    1. the progression's name as a picker: "**Let It Be ⌃⌄**" (a typed line reads "My progression ⌃⌄"); a tap
       opens the **Library** sheet (phone: full-height sheet; laptop: a 28rem side sheet): search field, style
       chips (Pop · Rock · Jazz · Blues · Gospel · Classical · Latin, round-2 A23), rows "I V vi IV · Axis" with ▷
       (plays in the current key without choosing) and a tap that loads it and closes. At its top, **My
       progressions** (P14).
    2. **Key** (`KeyPicker`, P2) · **Chord size** `Segmented` Triads · 7ths · 9ths · **Approach chords** menu (A23).
    3. the chord strip with the roles row (D14: under each chord home · away · tension, the bass moves between),
       and between each two chords a **+** target (44px; on a laptop shown on hover and focus, on a phone always)
       labelled "Passing chords from C to G" (P14).
  - **Body:** the staff (`Sheet`, P15) at the column's full width; the on-screen piano; "Practise in all 12 keys";
    "Songs with this progression" (hidden when empty).
  - The line under the strip ("Only the key's own chords …") is deleted (R10); "In the key" is P14's filter.
  - `ProgressionsTabs.tsx`, `ProgressionLibrary.tsx` as a tab, `ProgressionBetween.tsx` as a tab deleted; the
    Library list becomes `ProgressionLibrarySheet.tsx`, the passing chords `PassingChordsSheet.tsx`.
- **Done when:** `ProgressionsPage.test.tsx`: "there is no tab list"; "tapping Let It Be opens the Library, choosing
  Axis loads I V vi IV and closes it"; "the + between C and G opens Passing chords from C to G"; "no paragraph
  explains the page". Screenshots at the three sizes; the Library sheet open at 390 and 1280.

## P14: Passing chords: computed for any two chords, the learner's own allowed

> **Its store is widened by CP5** (`pt-chord-sheets` holds whole chord sheets); "Insert" inserts into a chord sheet's
> boxes (CP2), the inserted chord taking half the beats of the chord before it.

- **Source:** Decided 21 "Passing chords are hardcoded … the learner must be able to choose their own"; A23
  (groups, Insert), round-2 A23.
- **Today:** `shared/lib/music/passing-chords.ts`: 16 rule kinds in 6 categories, computed from the two chords and
  the key (not a fixed table), but the pair is only one of the progression's own changes (`changesOf`), there is no
  Insert, and a chord the learner knows (their teacher's B♭7, a hymnal's diminished) cannot be added.
- **Decision and why:** "hardcoded" as the learner meets it is "I can only look at the pairs and chords you chose".
  Ultimate Piano lets you set both chords freely; a church accompanist wants to try a passing chord between any two
  chords of a hymn and keep the one that works. So both ends are free, the suggestions are the books' rules (round-2
  A23's five groups, spelled in the key), and the learner may type their own chord and keep it.
- **Will build:**
  - `PassingChordsSheet.tsx` (`src/widgets/progression-explorer/ui/`), opened from a gap's +:
    1. **From** and **To**: two chord fields (a text field taking a chord symbol, Postel's law: "Bb7", "B♭7", "bb7"
       read the same; or a tap on the chip to choose from the key's chords), prefilled with the gap's chords;
    2. **In the key · All chords** `Segmented`;
    3. the groups (Dominant approach · Diminished passing chords · Chromatic approach · Subdominant approach ·
       Bass-line passing chords), each card the three chords as chips that play, their numerals, a small staff of the
       voice leading, and **Insert** (ru «Вставить»);
    4. **Your own chord**: a chord field and **Insert** (ru «Свой аккорд»), for any chord the learner types.
    Insert puts the chord(s) into the line between the two chords, closes the sheet, toasts "Inserted B♭7 · Undo".
  - **My progressions** (new saved store, needs a spec `.scratch/r29/my-progressions/spec.md` and ADR 0112 line):
    `entities/progression-library/model/store.ts`, key `pt-progressions`, version 1, `{ mine: readonly { id; name;
    line: string; key: KeyParam; size: ChordNotes }[] }`, at most 100, sanitiser field by field, synced (added to
    `SYNCED_SAVES`). The head's name menu gains **Save as my progression…** (a `NewSheet`: Name, Create) for a typed or
    changed line, and the Library sheet lists **My progressions** first (row menu: Rename · Remove, Remove confirms,
    R17).
  - Kernel: `passingChords(from, to, key)` unchanged in signature, regrouped as round-2 A23; new
    `parseChordSymbol(text: string): Chord | null` (in `shared/lib/music/chord-symbol.ts` if not present; the typed
    line already parses symbols in `typed-progression.ts`, so it is reused, not written twice);
    `insertBetween(line, at, chords)` (round-2 A23).
  - Where else: the Grid view's and the editor's chord row's + open the same sheet (round 4, A37); a lesson that
    teaches passing chords links to Progressions with `?line=` set.
- **Done when:** `passing-chords.test.ts` (round-2's cases: C → E♭, C → Am, G → C, spelled in the key);
  `PassingChordsSheet.test.tsx`: "typing F#dim7 as To lists its approaches"; "Your own chord E7/G♯ inserts it between
  C and Am"; "Undo takes it out". `store.test.ts`: "a save of version 1 reads field by field; any other version
  starts empty". `ProgressionsPage.test.tsx`: "Save as my progression puts it first in the Library".

## P15: One sheet everywhere, following what is played

- **Source:** Decided 21 "The sheets everywhere are one: every sheet follows what is played and has the same features
  in every place".
- **Today:** at least eight sheet components over `ScoreView`/`LazyScoreView` (`shared/ui/score`), each with its own
  subset: `widgets/sheet-music/SheetMusic.tsx` (the Player: playhead, loop band, chords, layouts),
  `features/play-example/TappableStaff.tsx` (lessons: tap a note or a bar, a playhead while it plays),
  `widgets/scale-explorer/ScaleSheet.tsx` (tap plays, fingers), `widgets/chord-explorer/ChordSheet.tsx` (static),
  `widgets/progression-explorer/ProgressionReading.tsx` (a band on a chord, `progressions-let-it-be-1280.jpg`),
  `widgets/scale-explorer/KeySignature.tsx`, `widgets/trainer-board/RoundStaff.tsx`, `widgets/chord-finder/
  ChordTrail.tsx`. Some follow playback, some don't; sizes differ (the Progressions staff half the width).
- **Decision and why:** Flat, MuseScore and Chordify show one score surface with the same behaviour wherever it
  appears; our owner's rule A1 is one component per thing. The kernel is already one (Performance → Score →
  Verovio); the surface must be too.
- **Will build:**
  - **`features/sheet`** (new slice; features may be used by every widget and page, FSD): `Sheet({ score, clock,
    selection, onSelect, onTap, layers, fit }: SheetProps)`, built from `TappableStaff` (it has the most) and
    `SheetMusic`'s playhead and band, with:
    1. **follows what is played**: any sound scheduled for this score through `usePlayback` (the page's Play, a
       chip, a tapped bar, the capsule) moves the one playhead line across the staves (ADR 0096's line), and the notes
       sounding are coloured; the on-screen piano lights them (exists);
    2. **tap a note** plays it and puts the cursor there; **tap a bar** selects that bar's beats (P16) and plays it;
       **drag or Shift+click** extends by beats (P16); Esc clears;
    3. **layers**: chord symbols, numerals, fingering (A30's app-wide switch), the page's "On the staff" switches
       (A43) through one prop;
    4. **fit**: the column's full width, the one staff size (staff space 10px, scaled down only below 360px),
       line breaks by Verovio; a one-bar staff is centred in its column at that size, never stretched;
    5. loading: its box reserved from the score's measured height (A31), no jump.
  - Callers: the Player's `SheetMusic` (composes `Sheet` with its layouts and editor overlays), lessons'
    `TappableStaff` (becomes `Sheet`), Chords (P6), Scales (P7, P9), Progressions (P13), Intervals' panel, the Chord
    finder, the Quiz's `RoundStaff`, the Key view's signature. Each old component deleted.
  - ADR 0096 amended: "One sheet: `features/sheet`, used everywhere".
- **Not in this item:** the score editor's input tools (they stay the editor's overlays on `Sheet`).
- **Done when:** `src/features/sheet/ui/Sheet.test.tsx`: "the playhead moves when a chip outside the sheet plays its
  notes" (fake audio `setNow`); "tap a bar selects four beats in 4/4 and plays them"; "fingering hides with the
  app-wide switch". `src/app/one-sheet.test.ts` (architecture): "no file outside `features/sheet`,
  `shared/ui/score` and the score editor imports `ScoreView` or `LazyScoreView`". Screenshots of each page's sheet
  while playing at 1280.

## P16: Selection snaps to the bar's beats

- **Source:** Decided 21 "a selection on the sheet snaps to whole beats from the start of its bar and spans the
  meter's beats (4/4 selects four beats, 2/4 two), across the app".
- **Today:** `shared/ui/score/selection.ts` (ADR 0096): a band is drawn tight round the notes chosen (`MARK.pad`),
  so a bar's band covers the chord's notes and not the bar (`progressions-let-it-be-1280.jpg`: the band round Am9
  starts before the bar line and stops short of the next).
- **Decision and why:** flowkey's loop (`flowkey/07-*`) and Chordify's loop select whole bars and grow by beats, the
  band from bar line to bar line; Dorico and MuseScore select a bar as the whole bar's rhythmic space. A learner
  practising a passage thinks in bars and beats, and a band that lines up with the bar lines says exactly what will
  loop.
- **Will build:**
  - Kernel (`src/shared/lib/notation/beats.ts`, new; notation may import only music): `beatGrid(score: Score):
    readonly BeatMark[]` (each bar's start tick and its beats from its meter: 4/4 four quarters, 3/4 three, 2/4 two,
    6/8 two dotted quarters, 7/8 by its grouping), and `snapRange(range: TickRange, grid: readonly BeatMark[]):
    TickRange` (start down to the beat it falls in, end up to the next beat; a tap on a bar → the bar's first beat to
    its last beat's end).
  - `selection.ts`: `bandBox(layout, range)` draws from the x of the range's first beat (the bar line for a bar's
    first beat, after the clef, key and time on a line's first bar) to the x of the beat after its end (the next bar
    line for a whole bar), over every staff in sight; `MARK.pad` no longer applies to bands.
  - Used by `Sheet` (P15) everywhere: the Player's loop and its practice range, lessons, Progressions, Scales,
    Chords, the editor's range selection (drag or Shift+arrow by beats). The editor's single-note selection stays a
    coloured note (correction 9).
  - ADR 0096 amended (its "tight band" paragraph replaced), feedback-log line added.
- **Done when:** `beats.test.ts`: "a tap in bar 3 of 4/4 selects ticks of beats 1–4 of bar 3"; "2/4 selects two";
  "6/8 selects two dotted quarters"; "a drag from beat 2 of bar 1 to beat 3 of bar 2 snaps to 1.2–2.3".
  `selection.test.ts`: "a bar's band starts at its bar line and ends at the next". `Sheet.test.tsx`: "the band over
  Am9 in Let It Be spans its bar". Screenshots: Progressions with bar 3 selected, the Player with a two-bar loop.

## CP: The chord player (the owner's decision, 2026-11-03 evening)

The owner asked for **a chord player like Musicca's, with the same controls and options** (style presets with
variations, tempo, Play on Space, count-in, sections with repeats, chords as boxes in bars with a length in beats,
typed from the keyboard, dragged to reorder, resized by their edge, Randomize with Undo, and a Settings page with
instruments, count-in, repeat, time signature, transpose, volume). Research: Musicca's chord player as saved in
`piano-data/musica/` (its `en.json` UI strings, `presets.json`, the bundle), summarised in
`scratchpad/metronome-ref/notes.md` §7–8 and `musicca-notes.md` §3–5. Musicca's files carry no licence: we take
facts and behaviour only, and write our own words, patterns, sounds and code.

### CP1: Where it lives: one page, Progressions and Accompaniment merged

- **Source:** the owner's decision ("it overlaps Progressions and Accompaniment: one page, not two"); D14; A23; A25;
  P13, P14 above.
- **Today:** three places do parts of it. **Progressions** (`/practice/progressions`): a typed line of numerals or
  symbols, a key, chord size, the roles row, a staff, Play, the Library, Passing chords. **Accompaniment**
  (`/practice/accompaniment`): the book patterns (Called to Play, Bobrova, Gorshkov, Styles, My patterns) as six
  source tabs of rows, each pattern played over a chart; its studies at
  `/practice/accompaniment/studies/$pieceId`. **Nothing** plays bass or drums with chords, and a chord's length is
  always a bar.
- **Decision and why:** Musicca puts the progressions it teaches on the same page as its chord player (the player on
  top, the progressions by genre below), and its styles are what we call accompaniment patterns plus a bass and a
  drum part. A learner wants one place to *build a chord sheet and hear it played in a style*: the progression is
  what is played, the accompaniment is how. Two pages would hold the same chords, key and Play twice (Decided 21:
  no duplicates). So the two pages become one: **Chord player**, Musicca's name for it and the plain description
  of what it does (ru «Аккордовый плеер»). The theory that Progressions had (the roles row, passing chords,
  practise in all 12 keys, songs with this progression) stays on it, drawn on the chord sheet.
- **Will build:**
  - Route **`/practice/chord-player`** (`pages/chord-player`, replacing `pages/progressions` and
    `pages/accompaniment`), parent `/practice`; its Settings `/practice/chord-player/settings`; the editor's
    progression editor moves to `/practice/chord-player/progressions/$progressionId/edit` (unchanged inside).
    `app/routes/parents.ts`, the search validators (`chord-player-search.ts`: `sheet` (a saved sheet's id) or
    `line` (a typed line, as today), `style`, `tempo`, `section`), the Practice grid and Search's index updated.
    `progressions-search.ts`, `accompaniment-search.ts` and their screens deleted; no redirects (no users yet).
  - Practice's Harmony group shows one tile **Chord player** (its icon: a chord box with a play mark) where
    Progressions and Accompaniment were.
  - Accompaniment's **patterns** become the piano part of the styles (CP3, group "Piano patterns"); its **studies**
    (book pieces) move to Songs' built-in folder **"Accompaniment studies"** (ru «Этюды на аккомпанемент»), their song
    pages as every song's (`/songs/$pieceId`), so they are not a second song page inside Practice.
  - `widgets/progression-explorer` becomes `widgets/chord-player` (the chord sheet, the head, the sheets of
    Library, Styles, Passing chords); `pages/accompaniment/ui/*`, `AccompanimentTabs.tsx`, `PatternShelves.tsx`,
    `BookPieces.tsx` deleted after their content moves.
- **Not in this item:** the score editor; the Player (a chord sheet opens in the Player through Practise, CP4).
- **Done when:** `src/app/routes/parents.test.ts`: "/practice/chord-player's parent is /practice"; `src/app/
  practice-grid.test.tsx`: "Practice shows Chord player and neither Progressions nor Accompaniment"; `src/pages/
  songs/ui/SongsPage.test.tsx`: "Accompaniment studies is a built-in folder holding the Bobrova studies".
- **Owner's question:** the page's name: **Chord player** (default, Musicca's) or keep **Progressions**?

### CP2: The chord sheet: sections, bars and chord boxes

- **Source:** the owner's decision (sections with repeats; chords as boxes in bars with a duration in beats, typed
  from the keyboard, dragged to reorder, resized by their edge; Randomize with Undo); Musicca `sections.*`,
  `chord_modal.*`, `main_controls.add_section`, `randomize_chords` (notes §8); D14 (roles on the chords); P13, P14.
- **Today:** one line of chords, one per bar (`typed-progression.ts`, `RoleChips.tsx`); no sections, no lengths.
- **Decision and why:** Musicca's model is the lead sheet's: sections (Intro, Verse, Chorus …), each repeated, made of
  bars, each bar holding chords whose lengths add up to the bar's beats. It is how an accompanist reads a song
  ("Verse ×2: | C | G | Am F | C |"), so it is ours too. Our additions are the theory D14 asked for, on the boxes.
- **Will build (the page body, top to bottom):**
  1. **Sections**, each a card (dragged by its handle to reorder, R4), its head: the name (`MenuPicker` **Intro ·
     Verse · Pre-chorus · Chorus · Bridge · Solo · Outro** or typed; ru «Вступление · Куплет · Предприпев · Припев ·
     Бридж · Соло · Кода»), **Repeat** `Stepper` ×1–×8 (ru «Повтор»), **Variation** `Segmented` 1 · 2 · 3 · 4 (only
     the variations the style has, R30; ru «Вариант»), and a ⋯ menu: Duplicate · Delete (Delete confirms when the
     section has chords, R17). At most 12 sections; **Add section** (ru «Добавить раздел») under the last, hidden at
     12 with nothing greyed.
  2. **Bars** in each section as an even grid of equal cells (four bars a row from 48rem, two on a phone; P11's
     `CardGrid`, never squeezed), each bar divided into its beats (faint beat ticks, the meter's count, P16's grid).
  3. **Chord boxes** inside the bars: each box spans its beats (1 to the bar's beats, and across a bar line up to 8),
     showing the symbol large (`C`, `Am7`, `G/B`), under it its numeral in the key and its role word and colour
     (home · away · tension, D14), and between two boxes the bass move (↓5 …) with the **+** for Passing chords (P14).
     - **Add:** a **+** at the end of the last bar, or Enter on the last box; a new box takes the bar's remaining
       beats (a bar's 4 in 4/4).
     - **Type:** a focused box is a text field: typing a chord symbol (`A`, `Bbm7`, `F#dim7`, `G/B`, `C6/9`) sets it
       on Enter or Tab (Tab moves to the next box); the computer keys don't play the piano while a box is being typed
       in (a field has focus). Parsing reuses `parseChordSymbol` (P14). A double tap (or Enter) on a box opens the
       **Chord** sheet: Root (`NotePicker`), Type (`ChordTypePicker`, P3), **Bass note** (`MenuPicker`: the chord's
       root, 3rd, 5th, 7th or another note; ru «Бас»), **Length** `Stepper` 1–8 beats (ru «Длительность»), and
       **Suggested chords** (the key's chords and the passing chords that lead to the next box, P14).
     - **Resize:** drag a box's right edge; it snaps to whole beats (P16) and the next box gives up or takes the
       beats; on a keyboard Shift+← / Shift+→ shortens or lengthens by a beat.
     - **Reorder:** drag a box by itself (a held finger on a phone, R4) to another place; keyboard: Space picks up,
       arrows move, Space drops, Esc cancels (the drag-and-drop library already used by `LibraryDnd`).
     - **Delete:** Backspace or Delete on a focused box, or drag it out of the sheet; an Undo toast ("Deleted Am7 ·
       Undo"), no dialog (a one-chord act, R17's "no dialog" list).
  4. **Randomize** (a button at the sheet's foot, its icon dice and the label; ru «Случайные аккорды»): fills each
     section with chords from the key that move by function (tonic → subdominant → dominant → tonic, the books'
     rule), one per bar, keeping the sections' lengths; **Undo** in its toast puts the sheet back. Kernel:
     `randomProgression(key: Key, bars: number, random: () => number): readonly Numeral[]` in
     `shared/lib/music/progression-random.ts`, tested with a seeded `random`.
  5. Under the sheet: the **staff** (`Sheet`, P15) of the piano part as the style plays it, folded by default on a
     phone (summary "Piano part · 8 bars"), open on a laptop; the on-screen piano; **Practise in all 12 keys**;
     **Songs with this progression** (hidden when empty).
  - **Undo/redo** for every edit of the sheet (⌘Z / ⇧⌘Z, `useShortcuts`), one history per sheet in memory.
  - Model: `src/shared/lib/arrangement/chord-sheet.ts` (pure, kernel's arrangement may import music only):
    `interface ChordSheet { readonly sections: readonly SheetSection[]; readonly meter: Meter; readonly key: Key }`,
    `SheetSection { kind: SectionKind; name?: string; repeats: number; variation: 1 | 2 | 3 | 4; bars:
    readonly SheetChord[] }`, `SheetChord { chord: Chord; beats: number }`; functions `resizeChord`, `moveChord`,
    `insertChord`, `removeChord`, `sheetToChart(sheet): Chart` (the arrangement's existing input), each pure and
    tested. A typed line (`?line=`) reads as one section "Verse", one chord a bar.
- **Not in this item:** the styles' sound (CP3); saving (CP5).
- **Done when:** `chord-sheet.test.ts`: "resizing C from 4 to 2 beats gives G 2 more"; "a box can't pass 8 beats or
  leave a bar short"; "moveChord keeps every bar's beats"; "a typed line I V vi IV reads as one Verse of four bars".
  `progression-random.test.ts`: "a seeded random gives I IV V I in C"; "every chord is the key's". `ChordPlayerPage.
  test.tsx`: "typing Bbm7 in a box and Enter shows B♭m7 with iv and away"; "dragging a box's edge by one beat makes
  it 3 beats" (`stubBox`); "Backspace deletes and Undo restores"; "Randomize fills the sections and Undo restores them";
  "Add section is hidden at 12 sections". Screenshots of a three-section sheet at the three sizes.

### CP3: Styles: presets with variations, written by us

- **Source:** the owner's decision (style presets: pop, rock, jazz, blues, … with variations); Musicca's presets
  (notes §4, §8: Pop 1–5, Rock 1–2, Melodic 1–4, Hip hop 1–2, Disco 1–2, Funk 1–2, Reggae 1–2, Jazz 1–4, Blues 1–2,
  Classical 1–2, each up to 4 variations; a 16-step grid per bar per instrument with a main bar and a last-bar fill);
  D20 (Chordify's drum grooves for the metronome).
- **Today:** `entities/pattern` holds piano patterns (`content/patterns.ts`, `methods.ts`, `called-to-play`) played by
  `shared/lib/arrangement` over a chart; no bass or drum part exists anywhere.
- **Decision and why:** a style is three parts over the chords: the piano's figure, the bass's line and the drums'
  groove, with variations (a busier one, a half-time one, a fill). Musicca's grid model (a bar of 16 steps per
  instrument, a main bar and the section's last bar as a fill, per-step velocity for the feel, swing as a triplet
  grid) is a clean data model; we copy the idea and write every pattern ourselves. We add the styles our users
  play: **Hymn** (four-part block chords, no drums), **Worship ballad**, **Gospel**, **Waltz**, and the book
  patterns of Accompaniment as piano-only styles.
- **Will build:**
  - Head control **Style** (`MenuPicker` in the page head, its value "Pop 1"; ru «Стиль»), opening a sheet grouped:
    **Pop** (Pop 1–5) · **Rock** (1–2) · **Ballad** (1–4) · **Worship and gospel** (Worship ballad 1–2, Gospel 1–2) ·
    **Hymn** (Hymn 1 four-part, Hymn 2 with bass) · **Hip hop** (1–2) · **Disco** (1–2) · **Funk** (1–2) · **Reggae**
    (1–2) · **Latin** (Bossa nova, Samba) · **Jazz** (Swing 1–2, Jazz ballad, Jazz waltz) · **Blues** (Shuffle, Slow
    blues) · **Classical** (Alberti, Arpeggio, Waltz) · **Piano patterns** (Accompaniment's book patterns, by book:
    Called to Play · Bobrova · Gorshkov · My patterns). Each row: the name and a one-bar rhythm picture
    (`RhythmPicture`, round-2 A25) and ▷ to hear a bar of it over C. Default **Pop 1** (owner's question 7).
  - Variation per section (CP2), 1–4 where the style has them.
  - Data: `src/entities/pattern/content/styles/<family>.ts`, each `Style { id; family; meters: readonly Meter[];
    swing?: boolean; variations: readonly StyleVariation[] }`, `StyleVariation { piano: PianoFigure; bass:
    BassLine; drums: DrumGrid; fill?: { bass?: BassLine; drums?: DrumGrid }; crash?: boolean }`; `DrumGrid` a record
    of `DrumVoice` → 16 velocities (0 = silent) per 4/4 bar, `timing` per meter; `BassLine` steps of `{ step; degree:
    'root' | 'fifth' | 'octave' | 'third' | 'approach'; velocity; length }` (an approach note walks to the next
    chord's root, the jazz walking line's rule). All written by us; each file's header says so.
  - Arrangement: `shared/lib/arrangement/arrange.ts` gains `arrangeStyle(sheet: ChordSheet, style: Style, options):
    Performance` writing three parts (the Performance gains `parts: readonly { instrument: 'piano' | 'bass' |
    'drums'; notes }`; notation writes the piano part only; schedule plays all three). Swing: a triplet grid as
    Musicca's (every fourth 16th dropped, the tempo kept).
  - The Metronome's Drum kit (D20, round-2 C8) and these styles share `DrumVoice` and the drum sampler (SND); its
    grooves stay Chordify's.
- **Not in this item:** guitar (the owner's list has no guitar; Chordify's rule "no guitar features").
- **Done when:** `styles.test.ts`: "every style's grids are 16 steps per 4/4 bar and the meter's length otherwise";
  "every variation has piano, bass and drums except Hymn 1 and the piano patterns (piano only)"; "swing styles drop
  every fourth step". `arrange-style.test.ts`: "Pop 1 over C G Am F writes the bass on each chord's root on beat 1";
  "the section's last bar on its last repeat plays the fill"; "a 2-beat chord's bass changes on beat 3". A recording
  of each family over Let It Be at 100 BPM in `.scratch/r29/shots/after/cp3-*.webm`.

### CP4: The head and the transport

- **Source:** the owner's decision (tempo, Play (Space), count-in); Musicca `main_controls`, notes §5 (worker clock,
  100 ms look-ahead, edits applied at a boundary, a fade on Stop, a 3 s tail on the last chord); R5.
- **Today:** Progressions' Play in a third place (A23); no count-in; edits stop or restart the sound.
- **Will build:**
  - **Bar:** ‹ · "Chord player" · ⋯ (**New** · **Save as my chord sheet…** · **Share link** · **Export audio…**;
    commands only, R3) · gear. Editors keep the pencil for a built-in progression (P13).
  - **Head card** (one row on a laptop, two on a phone): the sheet's name as a picker opening the **Library** (P13:
    built-in progressions by style chips, then **My chord sheets**; choosing one replaces the sheet, with Undo) ·
    **Style** (CP3) · **Tempo** `Stepper` 40–240, default the style's (e.g. 100), ru «Темп» · the key as text with
    its twin (P2), "Key C major ›" opening Settings' Transpose (CP6).
  - **Capsule** (R5): **Play** (▶ "Play" / ■ "Stop"; Space toggles, `useShortcuts`, not while a box is typed in) ·
    **Loop** (plays the selection or the section chosen again and again; P16's selection) · **Practise in the
    Player** (opens the sheet as a Performance in `/play/…`, the Player's own tools).
  - **Following:** the playing box is lit and the sheet scrolls to keep it in view; the staff's playhead moves
    (P15); the on-screen piano lights the piano part. The light is scheduled on the audio clock (the moment the
    sound plays), skipped while the page is hidden.
  - **Count-in:** one bar of clicks (the metronome's sound, its accent on beat 1), when on in Settings.
  - **Edits while playing** are applied at the next chord start (Musicca's pending plan); a tempo change at once.
  - **Stop** fades the sound out over 2 beats; the last chord of the sheet rings 3 s.
  - Scheduler: the existing look-ahead (`shared/api/audio/lookahead.ts`) with its clock in a Worker when the page
    is in the background (a Worker posting every 50 ms, 100 ms ahead), so a phone's locked screen does not stall it.
  - **Export audio…**: renders the sheet offline (`OfflineAudioContext`, count-in included) to a WAV file named
    after the sheet; no MP3 encoder (no licence-clean small one; WAV plays everywhere).
- **Done when:** `ChordPlayerPage.test.tsx`: "Space plays and stops" (fake audio); "the second box lights when its time
  comes" (`setNow`); "an edit during play lands at the next chord"; "Stop ramps the gain to 0 over 2 beats".
  `lookahead.test.ts`: "a Worker tick schedules 100 ms ahead". `export-audio.test.ts`: "a 4-bar sheet at 120 BPM
  renders 8 s plus the 3 s tail".

### CP5: My chord sheets (saving)

- **Source:** the owner's "the learner's own allowed" (P14) and Musicca's File menu (New, Save, Share).
- **Will build:** P14's store, widened: `pt-progressions` becomes **`pt-chord-sheets`**, version 1, `{ mine: readonly
  { id; name; sheet: ChordSheet; style: StyleId; tempo: number; settings: ChordPlayerSheetSettings }[] }`, at most
  100, sanitiser field by field, synced (`SYNCED_SAVES`). **Save as my chord sheet…** is a `NewSheet` (Name, Create);
  a saved sheet saves on every edit (no Save button); the Library lists **My chord sheets** first (row menu Rename ·
  Duplicate · Delete; Delete confirms, R17). **New** clears to one empty Verse, confirming when the sheet is unsaved
  ("Start a new chord sheet? Your changes to this one are lost." · **Start new**). **Share link** encodes the sheet in
  the URL (`?line=` grows to the sheet's compact text, `sheetToText`/`textToSheet`, Postel's law on read). The spec
  `.scratch/r29/chord-sheets/spec.md` is written first (a store and a route change); ADR 0112 amended.
- **Done when:** `entities/progression-library/model/store.test.ts`: "reads a version-1 save field by field; any other
  version starts empty"; `chord-sheet-text.test.ts`: "sheetToText and textToSheet round-trip three sections with
  repeats and lengths"; `ChordPlayerPage.test.tsx`: "Save as my chord sheet puts it first in the Library and an edit
  saves it".

### CP6: The chord player's Settings page

- **Source:** the owner's decision ("a Settings page with instruments (piano, bass, drums…), count-in, repeat, time
  signature, transpose, volume"); Musicca `settings_modal.*`; Decided 20–21 (each page's own Settings page from its
  own gear, like a lesson's); round-1 S4/S5 (superseded: Progressions' and Accompaniment's pages become this one).
- **Will build:** `/practice/chord-player/settings` (`pages/chord-player-settings`, the lesson Settings page's shape,
  R20), from the gear in the page's bar. Groups and rows, in order:
  1. **Instruments** (ru «Инструменты»): **Piano** switch + **Level** slider 0–100 % (default 80) · **Bass** switch +
     level (default on, 70) · **Drums** switch + level (default on, 70). At least one stays on (the last one's switch
     can't turn off; its row says so in its ⓘ). Hymn styles draw no Drums row (R30).
  2. **Playing** (ru «Воспроизведение»): **Count-in** switch (default off) · **Repeat** switch ("Repeat the sheet",
     default on; ru «Повторять») · **Volume** slider 0–100 % (default 80).
  3. **Music** (ru «Музыка»): **Time signature** (the shared time-signature control of A34; values 2/4 · 3/4 · 4/4 ·
     6/8 · 12/8 and Other…; changing it re-lays the bars, keeping each chord's beats where they fit, with Undo) ·
     **Transpose** (the editor's Transpose control, D20: semitones − n + and the key it lands in, "C major → D major";
     the page's key text links here) · **Written as** (Chord symbols · Roman numerals · Nashville numbers, from S4) ·
     **Voicing** (Block · Voice leading, S4).
  4. Link rows: **On-screen piano ›**, **Connect a piano ›** (R18).
  - The values belong to the sheet being played (saved with a saved sheet, CP5) except Written as and Voicing, which
    are the page's defaults. Registry entries in `entities/settings/model/registry.ts` with home `chord-player`;
    `settings-homes.test.ts` proves each has one home.
- **Done when:** `ChordPlayerSettingsPage.test.tsx`: "turning Drums off silences the drums" (fake audio); "Transpose +2
  shows D major on the page"; "Time signature 3/4 re-lays C(4) G(4) as C(3) +1 …, with Undo"; "Hymn 1 shows no Drums
  row". Screenshots at the three sizes (one column on a phone, two panes from 64rem).

## SND: Sounds: the libraries and the sample sets (piano, bass, drums, metronome)

- **Source:** the owner's decision ("proper libraries and proper sounds for all of them (piano, bass, drums,
  metronome) … e.g. smplr, MIT, with CC0/public-domain sets such as Splendid Grand Piano and VCSL; Salamander CC-BY
  for the piano … size, loading and offline caching; every file's source and licence written beside it. No Tone.js
  unless you show it's needed"); D15, D16; rounds-3-4 A27 (the sampled grand, planned in detail there and kept);
  round-2 C9 (the metronome's set, kept with one change below).
- **Today:** the piano is three oscillators (`shared/api/audio/web-audio.ts`); four VCSL WAVs in `public/sounds/`
  with no `SOURCES.md`; no bass or drum kit beyond those; no sample library in `package.json`.
- **Decision and why:**
  - **Library: smplr** (MIT, danigb/smplr): plays sample buffers on the Web Audio clock at the time we pass, takes
    velocity 0–127 and the sustain pedal as CC 64, loads only what is asked, and can keep files in the Cache API
    (`CacheStorage`). Its instruments include a `Sampler` for our own maps and a `DrumMachine`. It is a few tens of KB
    against Tone.js's several hundred, and we already own a scheduler (`lookahead.ts`) and a damper model
    (`schedule/damper.ts`), which is all Tone would add here (Musicca uses Tone for its Transport, which we have).
    **No Tone.js.** smplr is kept only if A27's spike passes its three tests (a start time we pass; our damper drives
    release; load on first ask); otherwise A27's own small sampler, used the same way for every instrument below.
    smplr's default sample host (GitHub Pages, rate-limited) is never used: every file is ours, under `public/samples/`.
  - **Sample sets** (each licence checked at its source before download; CC-BY-SA and unlicensed sets excluded):

    | Instrument | Set | Licence | What we keep | Size (AAC .m4a, mono) |
    |---|---|---|---|---|
    | Piano | **Salamander Grand Piano V3** (Alexander Holm, Yamaha C5) | CC BY 3.0, credited on About (D15) | A27: 30 roots every minor third × 4 velocity layers | ≈ 9–12 MB |
    | Piano, while that loads and on a phone short of memory | **Splendid Grand Piano** (Akai's Steinway set, released by Akai into the public domain; SFZ by kinwie) | public domain | 1 layer (mf), 30 roots, 3 s each | ≈ 1 MB |
    | Bass (electric) | **Karoryfer "Growlybass"** (a Squier Jazz bass, fingered) | to verify in its ZIP: CC0 or CC BY 3.0 accepted, else not used | roots every minor third E1–G3 (11) × 2 layers, 2.5 s | ≈ 0.6 MB |
    | Bass (upright, for Jazz, Blues, Hymn 2) | **Karoryfer "Meatbass"** (a 1958 Otto Rubner double bass, pizzicato) | same check | 11 roots × 2 layers, 2.5 s | ≈ 0.6 MB |
    | Drum kit (chord player, Metronome's Drum kit) | **Virtuosity Drums** (Versilian/Karoryfer, a jazz kit played with sticks) | CC0 | kick, snare, snare rim (cross-stick), closed hat, open hat, pedal hat, ride, ride bell, crash, high tom, mid tom, floor tom: 2 strokes each (accent, normal) | ≈ 0.5 MB |
    | Metronome single sounds | **VCSL** (Versilian Community Sample Library) | CC0 | round-2 C9: woodblock, clave, cowbell, and click/rimshot where C9 finds them | < 300 KB (WAV, C9) |

    Splendid is the fallback the owner named and costs little: the first note sounds from it at once and Salamander
    replaces it note by note as its layers arrive (better than A27's synthesised fallback, which then goes). If the
    Karoryfer ZIPs turn out CC-BY-SA or unlicensed, the next candidates are checked in order: VCSL's plucked
    strings, then the smpldsnds sets smplr uses (each set's own licence file decides, never smplr's MIT). If none is
    CC0, public domain or CC BY, the bass is not offered (R30, no synthesised stand-in under a recorded name) and the
    owner is told (owner's question 9).
    Round-2 C9's drum kit pieces from VCSL are **replaced** by Virtuosity Drums (a real kit recorded as one, so the
    Metronome's Drum kit and the chord player sound alike); C9's single sounds stay VCSL.
  - **Format:** AAC-LC in `.m4a`, mono, 44.1 kHz (A27's choice: plays in Safari and every browser we support; stereo
    doubles memory for no gain on a phone speaker). Drum one-shots at 128 kb/s (transients), the rest 96 kb/s; the
    metronome's clicks stay WAV (C9: tiny, decoded instantly).
  - **Layout and provenance:** `public/samples/<instrument>/` (`piano`, `piano-light`, `bass-electric`,
    `bass-upright`, `drums`, `metronome`), each with `manifest.json` (`{ file, midi | voice, layer, bytes }`) and
    **`SOURCES.md`**: the set, its author, the URL, the licence and its URL, the exact source files used, the command
    that made them (`scripts/samples/<instrument>.mjs`, ffmpeg). The source WAV/FLAC files are not committed.
    `scripts/check-samples.test.ts` (round-2 C9's, widened): "every file under `public/samples` is in its folder's
    manifest and SOURCES.md, with a licence of CC0, public domain or CC BY"; "each folder is under its budget".
  - **Credits:** About's footnote lists every CC BY set ("Piano: Salamander Grand Piano by Alexander Holm (CC BY
    3.0)"; the bass if CC BY), en and ru; CC0 and public-domain sets are thanked in `SOURCES.md` only.
  - **Loading:** one loader for every instrument (`shared/api/audio/sample-loader.ts`, A27): fetch on first need,
    decode on first strike, an LRU under the 80 MB decoded budget across instruments (A27). The chord player loads its
    style's instruments when the page opens (bass and drums ≈ 1 MB, under a second on 4G); the piano follows A27's
    order (light piano first, then Salamander's mp layer for the range in view).
  - **Offline:** the service worker (`vite.config.ts`, Workbox) **precaches** `metronome/`, `drums/`, `bass-*/` and
    `piano-light/` (≈ 3 MB together: the app plays offline from its first visit) and caches `piano/` at runtime
    (CacheFirst, its own cache `samples-piano`), with Storage and backup's row **"Grand piano for offline use ·
    12 MB · Download"** (A15, A27) fetching every Salamander file into that cache, its size shown, and **Remove**.
  - ADR **0034** (audio) amended with the library, the sets and their licences.
- **Not in this item:** guitar and other instruments; the spoken count (D20: not offered).
- **Done when:** A27's and C9's tests, plus `src/shared/api/audio/instruments.test.ts`: "the chord player's bass and
  drums play from their manifests at the scheduled time" (fake context); "a note asked before Salamander's buffer is
  ready plays from the light piano"; `scripts/check-samples.test.ts` as above; a recording of Pop 1, Jazz Swing 1
  and Hymn 2 over Let It Be, and of the Metronome's Drum kit, in `.scratch/r29/shots/after/snd-*.webm`; Safari's
  memory timeline on an iPhone with the chord player and the Player open: under 80 MB of decoded audio.

## Build order

1. P11 (the grid rule; a bug, small, unblocks screenshots).
2. P1 (one bar height) with P7's header card skeleton (the views move into it).
3. P2 (key picker), then P8 (scale picker uses its octave).
4. P15 then P16 (the one sheet, then its selection).
5. P3, P4, P5, P6 (Chords).
6. P7, P9, P10 (Scales and keys).
7. P12 (Intervals).
8. SND (the A27 spike decides smplr; the sets downloaded and checked; the loader), before any CP sound.
9. CP1 (route and merge), CP2 (the chord sheet, with P13/P14 folded in), CP5's spec then store, CP3 (styles),
   CP4 (transport), CP6 (Settings).
Each item one commit or a few, named "R29-P3: …"; the full suite and build once at the end of the round.

## Questions for the owner (defaults taken)

1. **Key names in text:** "D♭ / C♯ major" (chosen first, default) or "D♭ major (C♯ major)"?
2. **Chords' Type picker:** one picker, size then type (default), or two menus Size and Type side by side as Chord
   Trainer shows (Quality ⌃⌄ · Triads ⌃⌄)?
3. **Scales' view names:** Scale · Chords · Key (default) or Scale · Harmony · Key signature?
4. **Hand drawing:** our own outline drawing over the keys (default) or no hand, the fingers on the keys alone
   (Ultimate Piano's)?
5. **My chord sheets** synced with the account (default) or this device only?
6. **The merged page's name:** Chord player (default, Musicca's) or Progressions?
7. **Default style:** Pop 1 (default) or Hymn 1 (church accompanists)?
8. **Transpose and time signature on the Settings page** as you listed (default, so the page shows the key as text
   with a link), or the key picker kept on the page and Transpose dropped from Settings (no control twice)?
9. **Bass sound:** if no CC0 / public-domain / CC BY bass set checks out, ship without bass (default) or allow a
   synthesised bass?
10. **Accompaniment studies** move to a built-in Songs folder (default) or stay under the Chord player?

## Sources

- Reference apps (`piano-data/reference-apps/`): chord-trainer 04, 07, 08, 09; journey-app 06-key-explorer,
  07-circle-of-fifths, 08-chord-builder; ultimate-piano 01, 02, 04, 19, 29; flat-score-editor IMG_4516–4522;
  new-app IMG_4690, IMG_4695; flowkey 07; courses-app 09, 14; theory-trainer 03.
- Apple HIG, Navigation bars: https://developer.apple.com/design/human-interface-guidelines/navigation-bars
  (a segmented control in the bar only at the top level, and then no title).
- Apple HIG, Segmented controls: https://developer.apple.com/design/human-interface-guidelines/segmented-controls
  (not in an iOS toolbar; macOS toolbars may switch views).
- Apple HIG, Toolbars: https://developer.apple.com/design/human-interface-guidelines/toolbars
- Piano Chords Compass (root · chord type · addition): https://www.waerfa.com/piano-chords-compass
- PG Music, The Piano Chord Dictionary: https://www.pgmusic.com/pianochorddictionary.features.htm
- pianochord.org chord finder: https://pianochord.org/app-info.html
- teoria.com exercise help (interval Direction and Type): https://www.teoria.com/en/help/exercises-help.php?sec=nc
- Musical U, interval ear training (ascending, descending, harmonic):
  https://www.musical-u.com/ear-training-exercises/intervals/
- goodEar Intervals (ascending, descending, simultaneous): https://apps.apple.com/us/app/goodear-intervals-ear-training/id588122114
- Musicca's chord player as saved in `piano-data/musica/` (`en.json`, `presets.json`, the bundle; no licence: facts
  only), summarised in `scratchpad/metronome-ref/notes.md` §7–8 and `musicca-notes.md` §3–5.
- smplr (MIT): https://github.com/danigb/smplr (instruments, `baseUrl`, `CacheStorage`, time, velocity, CC 64).
- Splendid Grand Piano (public domain, Akai's release): https://github.com/sfzinstruments/SplendidGrandPiano
- VCSL (CC0): https://github.com/sgossner/VCSL and https://versilian-studios.com/vcsl/
- Virtuosity Drums (CC0, Versilian/Karoryfer): https://versilian-studios.com/wp-content/uploads/2023/10/virtuositydrumsmanual.pdf
- Karoryfer basses (licence to verify in each ZIP; one secondary source says CC BY 3.0):
  https://www.kvraudio.com/product/growlybass-by-karoryfer , https://bedroomproducersblog.com/2014/08/25/growlybass-free-samples/
- midi-js-soundfonts licences (FluidR3_GM CC BY 3.0; MusyngKite and FatBoy CC BY-SA 3.0, excluded):
  https://github.com/gleitz/midi-js-soundfonts
- MuseScore 4 key signatures palette and Dorico's Key signatures panel: from their handbooks (not fetched this
  session; to verify before P2 is built, rule 7).
