# Phase 3 — Screens: design

- **Status:** decided 2026-09-25. The owner asked for Phase 3 to go ahead on the best decisions without stopping for
  approvals, and pinned the visual references below; everything else here is Claude's decision, argued where it is
  not obvious. **Date:** 2026-09-25
- **Builds on:** the rewrite design (`2026-09-24-piano-trainer-rewrite-design.md`, "the master spec"): §5 screens,
  §6 state, §7 errors, §8 design principles, §9 testing. This document does not repeat them; it decides what they
  left open and lists every place it refines them (§11).
- **Product record:** `PRODUCT.md`. **Direction contract:** `.impeccable/surfaces/src-app.md`. **Approved comp:**
  `.impeccable/mocks/decision/sage.png` (Path, Player, Chords, the Setup sheet in dark).

## 1. Visual direction

The owner pinned four reference products (PRODUCT.md, Brand Commitments) instead of the rolled directions:

| Reference            | Taken                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| Clefs                | Sage-tinted ground, deep teal actions, mint soft surfaces, round 44px icon buttons, a floating glass tab bar, full-width pill actions, the keyboard as the lower half of a practice screen, a bounded quiz with a close button and a progress bar |
| Flowkey player       | The keyboard as the hero; one big round Play; chord symbols over numbered bars with the current bar shaded |
| Theory reference app | Grouped reference cards with inline text actions (the chord dictionary)                        |
| Chord trainer        | Bottom sheets of switches with "Select common · Clear all" and Apply (the quiz's chord families and scales) |

**Not taken:** streaks as pressure, mascots, upsells, locked content, stock photos, a kicker label above a heading,
progress rings standing in for content.

**The world, in one line:** a calm, native-feeling practice app; the labelled keyboard is the hero and each screen has
one deep-teal action.

## 2. Design system

### 2.1 Colour (`src/styles/tokens.css`)

Two layers stay (primitives `--p-*` → semantic roles). The legacy palette is replaced. Light is the default scene
(daylight or a lamp at the piano); dark follows the setting.

| Role                   | Light     | Dark      | Use                                                          |
| ---------------------- | --------- | --------- | ------------------------------------------------------------ |
| `--background`         | `#F3F6F3` | `#0D1210` | page ground (sage-tinted, never cream)                       |
| `--card`               | `#FFFFFF` | `#171E1B` | raised surfaces: sheets, popovers, round buttons, chips      |
| `--muted`              | `#E8EDE9` | `#1F2824` | sunken surfaces: segmented tracks, sliders, inactive tiles   |
| `--foreground`         | `#131816` | `#E6EDE9` | text                                                         |
| `--muted-foreground`   | `#5E6964` | `#97A59F` | secondary text (≥4.5:1 on background and muted)              |
| `--primary`            | `#2D6657` | `#8CCBB8` | the one action, selection, learned checks, links             |
| `--primary-foreground` | `#FFFFFF` | `#0D1210` |                                                              |
| `--secondary`          | `#D3E6DE` | `#1E3A32` | mint: the Continue card, soft buttons                        |
| `--secondary-foreground` | `#1F4D41` | `#BFE3D7` |                                                            |
| `--attention`          | `#9A5A0B` | `#E7A64B` | gaps and "to check" only: the dot or mark; text beside it keeps its surface's foreground |
| `--destructive`        | `#B3261E` | `#FF8A80` | reset progress, a wrong key                                  |
| `--border` / `--input` | `#DCE3DE` | `#2A3430` | hairlines                                                    |
| `--ring`               | `#2D6657` | `#8CCBB8` | focus                                                        |
| `--glass`              | `rgb(255 255 255 / .72)` | `rgb(23 30 27 / .72)` | the floating tab bar, over a backdrop blur |

- **Chord roles** keep their seven tokens (`--role-root` … `--role-13th`, `--on-role`), retuned to sit beside teal:
  root `#2E5BD0`, 3rd `#CC3363`, 5th `#5B6878`, 7th `#A86A00`, 9th `#0E8F5B`, 11th `#7847C8`, 13th `#0A83AD`
  (dark: `#6F95FF #FF6F9D #A6B1C0 #F0B43C #3CCB97 #B794FF #4CC7EA`). **Palette law:** role colours appear on chord
  tones only (keys, the legend, a chord chip's edge), never on chrome.
- **Hands** (the Player's keys, the note grid): `--hand-rh` `#1E7F69` / `#5CCCB0`, `--hand-lh` `#C2552B` /
  `#FF8A5C`, `--hand-melody` `#7A4FC4` / `#B99BFF`. They never appear in the explorers, where roles colour the keys.
- **Keyboard:** `--key-white` `#FFFFFF`/`#E9EEEA`, `--key-white-edge` `#D3DAD5`/`#7D8A84`, `--key-black`
  `#1E2321`/`#050706`, `--key-pressed` (a key held on MIDI or tapped) `#C9D6CF`/`#5A6A63`, `--key-wrong` =
  `--destructive`.
- `THEME_COLORS` (`shared/config`) becomes `{ light: '#F3F6F3', dark: '#0D1210' }`, held to `--background` by its
  test as now.

### 2.2 Type

- **Onest** (variable, 400–800), self-hosted with `@fontsource-variable/onest` (`wght.css`, every subset behind a
  `unicode-range`): a grotesque designed with Cyrillic first, so Russian reads as well as English. Its `math` subset
  carries ♭ ♮ ♯.
- **Noto Music** (`@fontsource/noto-music/music-400.css`, the music subset only) is the fallback for 𝄪 and 𝄫, which
  the kernel writes (G♯ harmonic minor's F𝄪, C°7's B𝄫) and Onest lacks.
- Stack: `'Onest Variable', 'Noto Music', system-ui, sans-serif`. The Vite build emits the woff2 files and the
  service worker precaches them, so nothing loads from a CDN (master spec §8).
- Scale (Tailwind theme): large title 34/1.1 bold, title 22 bold, headline 17 semibold, body 16, subhead 15,
  footnote 13, chord display 64 extrabold (−0.035em), chord-in-chart 20 bold. Numerals that change in place (tempo,
  bar, counts) are `tabular-nums`.

### 2.3 Shape, depth, motion

- Radii: chips and pills full; buttons 18px (`rounded-2xl`); cards and the Continue card 26px; sheets 28px top;
  keys 9px (white) and 6px (black) at the bottom only.
- Depth: round buttons and chips sit on a 1px `--border` ring plus a 1–2px soft shadow; the tab bar and sheets carry
  one soft offset shadow. No coloured glow.
- Motion: one curve, `cubic-bezier(.22, 1, .36, 1)` (exponential ease-out), 200–450ms. Sheets and popovers rise and
  fade; the chart strip scrolls the current bar to the centre; a lit key fades in over 80ms. Everything visible by
  default; `prefers-reduced-motion` already cuts durations globally.
- Icons: lucide-react only, 2px stroke, 20–22px.

### 2.4 Components

**shadcn primitives added with the CLI** (`shared/ui/primitives`, base-nova, then restyled only through tokens and
variants): `drawer` (bottom sheets, swipe to close), `popover`, `toggle-group` + `toggle` (segmented controls and
chip rows), `switch`, `slider`, `input`, `alert-dialog`, `separator`, `progress`, `item` (list rows), `empty`,
`spinner`. `button` gains the variants the world needs (`soft` mint, `surface` round white) and keeps only ≥44px
sizes.

**App-wide presentational components** (`shared/ui`):

| Component       | What it is                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------- |
| `PianoKeyboard` | The one keyboard (master spec §8): `from`/`to` MIDI range, `marks` per key (`{ tone: role | hand, label }`), `pressed`, `wrong`, `lit`, `onKeyPress`; keys are buttons named by note ("F sharp 3") with `aria-pressed` where they are selectable; black keys over white by geometry from a pure `keyboardLayout(from, to)`; optional horizontal scroll with a `centre` MIDI kept in view |
| `ScreenHeader`  | Large title, optional leading back button and trailing actions; replaces `ScreenTitle`      |
| `RoundButton`   | A 44px round icon button with a required `label` (the `surface` Button variant, composed)   |
| `Segmented`     | A pill segmented control over `ToggleGroup` (one value, required)                           |
| `ChipRow`       | A scrolling row of toggle chips over `ToggleGroup` (roots, families, qualities, keys)       |
| `RoleLegend`    | The roles present in a chord or scale: dot + name                                          |
| `RatingMark`    | Known (teal check), gap (amber dot), unknown (hollow ring), each with a hidden text name    |
| `LevelMark`     | Four pips, the level filled, with "Level 2" as its accessible name                          |
| `Sheet`         | The app's bottom sheet: `Drawer` with the grab handle, a title and a scrolling body         |

## 3. Layout and navigation

- **Shell** (`AppShell`): content in a centred column (`max-w-2xl`, 16px gutters, `pt-safe`); the **floating tab bar**
  (`AppNav`): a glass pill of three items (icon over label) centred 16px above the home indicator, the active item in a
  soft teal pill. Content scrolls under it with `pb-32`. From 1024px it becomes a left rail (unchanged behaviour).
- **Screen header:** every shell screen opens with `ScreenHeader`: Path has the settings `RoundButton`; Settings and
  Piece have a back `RoundButton`; Theory keeps its segmented section switch (`TheoryNav`, links styled as
  `Segmented`).
- **Full screen** (`FullScreenLayout`): the Player and the Check, with a close `RoundButton` and no tab bar.
- **Pending chunks:** `defaultPendingComponent` is a centred `Spinner` after 300ms (chunks are precached, so it is rare).

## 4. Screens

URL search params follow master spec §6: what the learner is looking at lives in the URL, validated per route; an
invalid value falls back to its default silently; defaults are stripped from the URL (`stripSearchParams`); changes
from controls **replace** the history entry, so Back leaves the screen instead of undoing a tap.

### 4.1 Path `/`

- Header "Path" + settings button.
- **Continue card** (mint): the suggested step's title (and the original title beneath for a song in English), key or
  kind, the gap line when the suggested piece has gaps or unknowns (amber dot, "2 chords to check", links to its
  Check), and a full-width **Continue** button (the screen's one primary action) that opens the Player for a piece, or
  the explorer for a chord or scale step. Rule (master spec §5): the last-practised piece if not learned, else the first
  unlearned step in path order. Everything learned: the card says so in one line and offers Songs.
- **Levels:** per level a heading "Level 1 · Beginner" with "4 of 9" and the step rows: a kind tile (chords, scale,
  exercise, song), the title, a subtitle (kind; "Chords · 2 of 5 known" for chord steps from quiz evidence; the
  original title for songs), and the **learned toggle** (a round check button, `aria-pressed`). A row opens the
  step: a piece → Piece; chords → `/theory/chords?quality=<first of family>&step=chords:<family>`; a scale →
  `/theory/scales?kind=<kind>&step=scale:<kind>`. Levels without steps (2–4 until Phase 4) are not shown.

### 4.2 Songs `/songs?q&collection&level`

- Header "Songs"; a search `Input` (magnifier, clear button); a `ChipRow` of collections ("All" + 5) and, once the
  path has more than one level (Phase 4), a `ChipRow` of its levels ("Any level" + each); a one-choice filter is noise. Search is case- and diacritic-insensitive, treats ё as е, and
  matches the title, the English title and credit names; it runs on a deferred value.
- Rows grouped by collection (a collection heading when not filtered): songbook number if any, the title (English:
  `titleEn` over the original; Russian: `title`), key · meter, `LevelMark`, and a learned check (read-only mark). A
  listing shows "No chart yet" instead of key and level.
- Empty result: `Empty` with one line ("No songs match") and a Clear button.

### 4.3 Piece `/songs/$pieceId`

- Back button; the title block (as in Songs), credits (role label + names as printed), the source ("«Боже, спасибо»,
  No. 5, p. 16"), chips for key and meter, the note.
- **Chords in this song:** one chip per skill (quality suffix, full name as accessible name) with its `RatingMark`;
  each opens `/theory/chords?quality=<q>&root=<first root it has in the piece>`. **Check these chords** (text button)
  opens `/check?of=piece:<id>`.
- **Chart:** by section (heading assembled by i18n from kind, number, label, last, detail); bars as a lead sheet:
  bar numbers, chord symbols, method code labels under a bar when the chart names them, the beat count under a bar
  that is not the meter's length. **Tap a bar to hear it** (the piece's own arrangement at its tempo).
- Footer: **Practise** (full-width primary, opens `/play/$pieceId`), **Mark as learned** (learned toggle with text),
  and a link to the key's scale (`/theory/scales?root=G&kind=major`).
- A listing: the title block, credits, source, key and meter, the note, one line "No chart yet", and the scale link.
- Unknown id: the not-found screen.

### 4.4 Player `/play/$pieceId?key&tempo&hands&mode&pattern&rh&lh&voicing`

| Param     | Values                                                     | Default                                   |
| --------- | ---------------------------------------------------------- | ----------------------------------------- |
| `key`     | a tonic with at most one accidental (`A`, `Bb`, `F#`); the piece's mode stays | the piece's tonic      |
| `tempo`   | whole BPM 40–160                                           | the piece's tempo                         |
| `hands`   | `both` `rh` `lh`                                           | `both`                                    |
| `mode`    | `listen` `step` `turn`                                     | `listen`                                  |
| `pattern` | `chart` (the chart's own method codes) or a pattern id     | `chart` when the chart has method codes, else the piece's pattern |
| `rh` `lh` | a right- / left-hand figure id; absent = the pattern's own | absent                                    |
| `voicing` | `triads` `sevenths` `ninths` (progressions that allow it)  | the piece's default                       |

- **Top bar:** close `RoundButton` (back to the Piece), the title with the **setup summary** beneath ("G · 72 BPM ·
  Both hands", a button that opens the Setup sheet), and, where Web MIDI exists, a MIDI `RoundButton` whose dot shows
  the status and whose popover connects and names the devices.
- **Mode switch:** `Segmented` Listen · Step · Your turn.
- **Chart strip:** one scrolling row of the same lead-sheet bars as the Piece (section names above the first bar of a
  section); the current bar is shaded and scrolled to the centre; tapping a bar jumps there.
- **Now panel:** the current chord at 64px, "Next" and the next chord beside it, and the bar's beats as pips with the
  current one filled. Your turn adds the feedback line: what to play ("Play D F# A"), a correct tick, "Not F", or
  "Finished" with **Again**.
- **Note grid:** the current bar's beat groups as columns (beat label 1 e & a, ⅓ ⅔), notes named with octave and
  spelled from their chord, right hand over left hand (and the tune when the melody plays), in hand colours; the
  current column shaded; tapping a column jumps there.
- **Keyboard (the hero):** the performance's range rounded out to C…B; white keys at least 28px wide, scrolling
  horizontally when that does not fit, keeping the current notes in view. The current beat group's notes are marked
  in hand colours, labelled with finger numbers when that switch is on, else with note names. Your turn: expected keys
  marked, received ones filled, a wrong key flashes `--key-wrong`; taps and MIDI both count. MIDI keys held show as
  pressed.
- **Transport** (the primary action, bottom): Listen: Restart (round) · a 72px round **Play/Stop**; Step:
  Back (round) · **Next** (pill) · Next bar (round); Your turn: Restart (round) · **Hear these notes** (pill).
- **Setup sheet:** Key (`ChipRow` of 12 tonics named for the piece's mode), Tempo (`Slider` 40–160 with the value),
  Hands (`Segmented`), Pattern (a row opening a nested sheet: "From the chart" when the chart has method codes, then
  the four groups of patterns with their names and descriptions, melody patterns disabled with "Needs a melody" on a
  piece without one), Right hand and Left hand (rows opening nested sheets: "The pattern's own" + the figures),
  Voicing (`Segmented`, progressions that allow it), and the saved switches: Finger numbers, Melody (pieces with a
  melody), Metronome, Count-in.
- Opening the Player records the piece as practised (`recordPractised`). A listing or unknown id: not-found.
- **Landscape phones** (height ≤ 500px): the top bar, mode switch and chart strip share two rows, the now panel and
  transport sit left of the note grid, and the keyboard takes the lower half at full width.

### 4.5 Theory `/theory/*`

Header "Theory" and the section switch Chords · Scales · Symbols · Quiz. A `step` param (a chord or scale step id)
adds the **step panel** at the top of Chords and Scales: the step's title, **Check yourself** (opens
`/check?of=<step>`) and the learned toggle.

**Chords** `?root&quality&inversion&hands&step` (defaults C, `maj`, 0, `rh`):
chord symbol at display size with its full name; `ChipRow` roots (named by `chordRootSpelling` for the quality);
`ChipRow` families; `ChipRow` qualities of the family (suffix labels; full names as accessible names); the keyboard
(roles coloured, degree labels) with the `RoleLegend`; the tones named in order ("G 1 · B 3 · D 5 · F ♭7"); inversion
`Segmented` (Root, 1st, 2nd, 3rd for four-note chords); hands `Segmented` (Right hand · Both hands, adding the root in
the left hand); **Play** (primary, block) and **Arpeggio** (soft). Choosing a root, family, quality, inversion or
hands sounds the chord.

**Scales** `?root&kind&view&rhythm&tempo&hands&chords&step` (defaults C, `major`, `degrees`, `even`, 80, `rh`, 3):
scale name ("E♭ harmonic minor"); `ChipRow` roots and kinds; the keyboard over one octave plus the top note, labelled
by degree or by the chosen hand's fingers (`view` `Segmented`: Degrees · RH fingers · LH fingers); the fingering table
(Note / RH / LH) or one line when no standard fingering exists; **practice**: rhythm (`ChipRow` of the five rhythms),
tempo `Slider` 40–160, hands `Segmented` (Right · Left · Together), **Play up and down** (primary), which lights each
key as it sounds; **chords in this scale** (7-note scales): Triads · 7ths `Segmented` and a chip per chord with its
Roman numeral, tapping sounds it; **about**: formula, steps (W H W+H), and the relative major or minor as a link.

**Symbols** (no params): a **How to read chord symbols** row opening a sheet with the reading notes (legacy Guide's
three panels, in both languages), then the chord dictionary: per family a heading and one reference card per quality
(symbol spellings "Cm, C−", full name, formula "1 ♭3 5", notes on C) with text actions **Hear** and **Open** (the
Chords explorer on that quality).

**Quiz** `?mode` (`build-chord` `name-chord` `build-scale` `gaps`, default `build-chord`): mode `Segmented`; the
**quiz board** (§4.6); stats beneath (Correct 12 / 15 · Streak 3 · Best 9); a **Chords and scales** button opening
the choice sheet: switches per chord family and per scale kind, "Select common · Clear all", **Apply** (saved through
`setQuizFamilies` / `setQuizScales`; Apply is disabled while nothing is chosen for the current mode). **My gaps**:
the ordered scope of gap skills, then unknown skills used by practised pieces; with none, one line and a button to the
whole quiz.

### 4.6 Quiz board and Check `/check?of`

- **Quiz board** (widget, shared by Quiz and Check): the prompt ("Build Cm7", "Which chord is this?" + Play again,
  "Build E♭ harmonic minor"); the keyboard (build modes: tap to select, selected keys filled teal; after Check the
  answer's keys shown with roles, missing ones outlined, extra ones red); Name chord: four answer buttons in a 2×2
  grid; the feedback line ("Right" / "It's C7 · dominant 7th"); one full-width action: **Check** (disabled with no
  keys), then **Next**. Clear sits beside Check while keys are selected.
- **Check** `/check?of=<step id>`, full screen: close button, a `Progress` bar of answered / length, the board, then
  the **result**: "5 of 6" at display size, the scope's skills with their `RatingMark`, each gap opening the explorer
  on it, a line when the check just marked its step learned, and **Done** (back). Scopes: `piece:<id>` → the piece's
  skills and its own roots, 6 questions, Build chord; `chords:<family>` → the family's qualities in order, twice
  each (at least 6), all roots; `scale:<kind>` → Build scale, 6 questions, all roots. An unknown `of` → not-found.

### 4.7 Settings `/settings`

Back button and "Settings"; grouped rows: Language (`Segmented`), Theme (`Segmented` System · Light · Dark), MIDI
keyboard (status line + Connect; or one line saying this browser cannot connect a keyboard), and **Reset progress**
(destructive, confirmed in an `AlertDialog` that says what is lost).

### 4.8 Not found

`Empty`: "Page not found" and a button to Songs (unchanged behaviour, new look).

## 5. Architecture

New code by layer. Pure logic has a colocated test and lives where CLAUDE.md puts it.

**shared/lib**
- `music/voicing.ts` — `chordVoicing(root, quality, { inversion, bothHands })`: the explorer's placed tones
  (right hand from middle C, the root an octave below in the left hand).
- `music/scale.ts` — `scaleSteps(kind)` (`W H W+H`) and `relativeScale(root, kind)` (major ↔ natural minor; the
  harmonic and melodic minors' relative major).
- `music/note.ts` — `noteParam(note)` / URL spelling with ASCII `b` and `#`.
- `schedule/` — `barSounds(performance, bar, options)` (a bar on its own), `chordSounds(midis, { arpeggio })`, and
  `scaleRun(tones, { rhythm, tempo, hands })` with `PRACTICE_RHYTHMS` → sounds plus a cue per note for lighting keys.
- `search-params.ts` — `oneOf`, `wholeIn(min, max)`, `noteIn` validators for `validateSearch`.
- `fold-text.ts` — search normalisation (case, diacritics, ё → е).
- `services/use-play.ts` — `usePlay()`: unlocks audio and plays sounds; the explorers' and chart's one way to sound.

**shared/ui** — §2.4, with `piano-keyboard/layout.ts` (pure geometry, tested).

**entities**
- `progress/model/selectors.ts` — `selectSuggestedStep` (the Continue rule; progress already depends on the path) and
  `selectAllAnswers`; `mastery.ts` — `skillsToCheck(skills, answers)` (gap or unknown) and `knownCount`.
- `path/ui/use-step-title.ts` — a step's name in the learner's language (family, scale kind or the piece's titles).
- `piece/ui/` — `EntryTitle`, `Credits`, `SectionHeading`, `SourceLine` (entity UI: the title rules of master spec §8).

**features**
- `mark-learned/ui/LearnedToggle.tsx` — the round check (and a text variant for the Piece footer).
- `connect-midi/` (new) — `useMidiStatus()` and `MidiControl` (status line + Connect), used by Settings and the Player.
- `practice/` (beside the machine, as the slice already lays out) — `defaultPattern(piece)`, `arrangePiece(piece, choice)` (chart or progression at a voicing,
  tonic, pattern or the chart's methods, figures, melody), `spellPerformedNote`, `barColumns(performance, bar)`
  (the note grid), `keyboardRange(performance)`.
- `quiz/` — `checkPlan(of)` (scope, length, mode per §4.6), `myGaps(answers, practised)`, the quiz keyboard's keys;
  `use-quiz.ts`
  — `useQuiz(config)`: drives the machine, draws questions with `Math.random`, records answers with `recordAnswer`,
  sounds Name chord questions.

**widgets:** `app-nav`, `theory-nav` (restyled), `continue-card`, `path-levels`, `piece-list`, `chord-chart`
(`sheet` and `strip` layouts over a Performance), `piece-skills`, `player-setup`, `chord-explorer`,
`scale-explorer`, `step-panel`, `quiz-board`, `quiz-choice`. Screen tests run the whole app (`renderApp`) from `src/app/screens/`.

**pages:** each page composes widgets; pure page logic sits in its `model/` (`songs-view.ts`, `resolve-choice.ts`).
The Player's subparts (top bar, now panel, note grid, transport) sit beside `PlayerPage` in `pages/player/ui/`.

**app:** `routes/search.ts` holds every route's `validateSearch` and defaults (the router may not import a page's
`index.ts`, or the page would leave its lazy chunk); `router.tsx` gains `validateSearch` + `stripSearchParams` per route, `notFound()` from the Piece, Player and
Check routes' `beforeLoad` for ids that are not there, the `/check` route in the full-screen group (in the
`theory-screens` chunk, with the quiz board), and `defaultPendingComponent`.

**Styles:** `tokens.css` (§2.1), `theme.css` (font stack, type scale utilities, radii, the one easing), `index.css`
imports the two font CSS files.

## 6. i18n

Every new string in `en` and `ru` in its namespace: `common` (nav, actions, ratings, levels, hands, not found),
`path`, `songs`, `piece` (section headings with interpolation: "Verse {{n}}" / "{{n}}-й куплет"; credit roles),
`player`, `theory` (families, the 33 qualities' full names, scale kinds, degrees view, rhythms, the reading notes),
`quiz`, `settings`. Russian is typed against English as now. Chord symbols and note names are the same in both.

## 7. States and edge cases

| Situation                                   | Behaviour                                                                     |
| ------------------------------------------- | ----------------------------------------------------------------------------- |
| First run, nothing learned or practised     | Continue suggests the first path step                                         |
| Everything learned                          | Continue card: one line + Songs                                               |
| Songs search finds nothing                  | `Empty`, one line, Clear                                                      |
| My gaps finds nothing                       | One line + "Whole quiz"                                                       |
| Quiz choice empty for the mode              | Apply disabled; the saved choice never becomes empty (the store already refuses) |
| No Web MIDI                                 | MIDI button hidden in the Player; Settings says so in one line                 |
| MIDI denied / no device                     | The status line says so; taps still work                                      |
| A melody pattern or figure on a piece without a melody | Shown disabled with "Needs a melody"; a URL naming one falls back (arrange already falls back) |
| `voicing` on a fixed-voicing progression    | Ignored (chartOf)                                                             |
| Invalid search param                        | Its default, silently                                                         |
| Unknown piece, a listing in the Player, unknown `of` | Not-found screen                                                     |
| A chunk fails to load offline               | `RouteError` (unchanged)                                                      |

## 8. Accessibility

Keys are buttons with note names; selectable keys use `aria-pressed`; coloured keys always carry a label. Segmented
controls and chip rows are `ToggleGroup`s (arrow keys move, one tab stop). Sheets trap focus and have titles. The
Your-turn feedback and quiz feedback lines are `aria-live="polite"`. Every icon-only button has a label. Targets ≥44px
except white keys in a scrolling keyboard (≥28px wide, 3× as tall), where MIDI is the primary input.

## 9. Testing

Master spec §9 applies. Unit tests first for every pure module in §5. Component tests (Testing Library, fakes) for:
PianoKeyboard (names, taps, marks); the learned toggle, including a quiz answer that marks a chord step; the Continue
card's choice and gap line; Songs search and filters; the Piece screen's chords row, check link and bar tap (FakeAudio
records the bar); the Player's mode switch, Setup sheet changing the URL, and Your-turn feedback from taps and
FakeMidi; the quiz board in each mode and the Check's result; Settings' reset confirmation; route search validation
and not-found. `renderApp` covers routing; no snapshots.

## 10. Finish

Per the direction contract: after the screens are built, one batched screenshot round (phone 390 and desktop 1440,
light and dark), fixes, a second round, the impeccable detector, the shipped finish reviewer, and the documenter
writing `DESIGN.md`. Then `npm run typecheck && npm run lint && npm run test && npm run build`.

## 11. Refinements of the master spec

1. **Visual direction by pinned references** (§8): the owner chose reference products instead of a rolled direction;
   recorded in PRODUCT.md and the direction contract.
2. **Type is Onest + Noto Music** (§2 said Fontsource fonts without naming them).
3. **A Check route** (`/check?of=`) instead of running piece and step checks inside the Theory quiz: a bounded,
   full-screen flow with a progress bar and a result is what the Clefs reference does and what "Check these chords"
   needs. The open-ended quiz stays in Theory.
4. **Explorer URLs drop `family`** (§6): the quality decides the family, so one param cannot contradict another.
5. **Listings open the Piece screen** (§5, §7): a listing shows its title, credits, source, key and a scale link, as
   legacy's songbook detail did; only the Player treats a listing's id as not found.
6. **Player top bar** gains the MIDI button and popover (the reference's toolbar popover) instead of MIDI living only
   in Settings (§7 already asks for a one-line status in the Connect control).
7. **Search-param changes replace history** (§6's "the back button works" now means Back leaves the screen).
8. **Hand colours are their own tokens** (§8 listed role tokens only).
