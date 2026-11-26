# Score editor: what the Flat and Dorico research asks of it

**Source.** `piano-data/research/flat/*.md` (Flat 26.11.0, read from its bundle), `piano-data/research/dorico/**`
(Dorico 6.2.31), `piano-data/research/_shared/app-ready-data/`. Held against the editor as built
(`src/pages/score-editor`, `src/widgets/score-sheet`, `src/widgets/mode-switch`, `src/features/score-editor`,
`src/features/edit-piece`, labels from `src/shared/i18n/locales/en/editor.ts`) and the standing rulings
(`.claude/skills/owner-way/references/feedback-log.md`: Score editor, Pickers and tempo, Player and editor together,
Sheet, selection and playhead).

**Scope.** Only what a piano learner's notation editor needs. Ranked by impact. Each item: the research, the editor
today, the change. "Flat" = Flat's desktop editor; "Dorico" = Dorico's Write mode.

---

## 1. Findings that apply

### F1. One hide-vs-disable rule for every key (high)

- **Research.** Flat hides a tool only when it can never apply in this context (rights, instrument type, toolset) and
  *disables* one that could apply but not at this cursor, with `aria-disabled` so it stays focusable and its tooltip
  reads "`<Title>: <reason>`" (`flat/FLAT_UI_SHELL_AND_MOTION.md` §2, §2.2; Takeaway 4). Dorico's panels keep every
  item in place and disable what cannot run (`dorico/ui-flow/UX_PATTERNS.md` P15, P22). The owner ruled the same
  (feedback log, Score editor, loop round 31: "the tools stay in place, greyed, as Flat's … 'Choose a note' their
  tooltip").
- **Today.** Only half the editor follows the round-31 ruling. Greyed in place: the four note categories
  (`EditorPalette.tsx:70-79`, a `fieldset disabled`), every `MarkKey` (`MarkKeys.tsx:77`), the tempo group
  (`ScoreKeys.tsx:135`). Still left out (the old R32-B rule, so the grid jumps as the choice changes): ♮ ♯ ♭
  (`NoteKeys.tsx:117`), "Enharmonic spelling" (`NoteKeys.tsx:320`), "Dotted" and "Double dotted"
  (`NoteKeys.tsx:274-296`), "Tie" (`NoteKeys.tsx:297`), each tuplet (`NoteKeys.tsx:367`), a line key
  (`LineKeys.tsx:17`), "Roman numeral" and the Character and Technique words (`ScoreKeys.tsx:166-169`), "Clef" in
  a staffless spot (`ScoreKeys.tsx:32`).
- **Change.**
  - Hide only what can never act in this place: the chord row's categories (`categoryOpen`, already so), Add note in
    the chord row, a tuplet the meter writes plainly (e.g. a duplet in 2/4). Everything else stays in its cell.
  - Disable the rest with `aria-disabled="true"` on `ToolKey`, never the native `disabled`, so the tooltip still opens
    and the key stays in the roving focus; a click does nothing.
  - Tooltip: "`<name>: <reason>`", e.g. "Tie: No note of the same pitch follows.", "Dotted: This value can't be
    dotted in 3/8.", "Staccato: Select one or more notes first.". The reasons live in `editor.reason.*`; delete the
    duplicate `palette.chooseNote` ("Select a note to use these tools.") and use `reason.chooseNote` ("Select one or
    more notes first.", the fields' already, `fields.ts:60`) everywhere. New `reason` keys: `noTie` "No note of the same pitch follows.", `noDot` "This
    value can't take a dot here.", `noTuplet` "This value is too short for this tuplet.", `noLine` "Select the notes
    to draw it over.", in `en` and `ru`.
  - The category-level `fieldset disabled` goes; each key carries its own reason.
- Remove the stale wording that still says the opposite: `palette-categories.ts:11-12` ("never greyed (R32-B)"),
  `palette-keys.tsx:85-86`, `ToolKey.tsx:8-9`, ADR 0114 l.29-36 and l.98 (amend to the round-31 ruling, as
  `CLAUDE.md` asks when code and an ADR disagree).

### F2. One disabled look (high, part of F1)

- **Research.** Flat's editor tools grey by colour token, not opacity: icon `--icon-general-secondary-disabled`,
  `cursor: not-allowed`, hover suppressed; opacity (.4/.5) only on cards and sliders
  (`FLAT_UI_SHELL_AND_MOTION.md` §2.3).
- **Today.** Three values: 40% (`EditorPalette.tsx:76`, `ScoreKeys.tsx:135`), 35% (`ToolKey.tsx:49`,
  `palette-keys.tsx:141`).
- **Change.** One rule in `ToolKey` and `SignTile`: `aria-disabled:text-muted-foreground/40
  aria-disabled:cursor-not-allowed aria-disabled:hover:bg-transparent`; no opacity on the cell, so the ruled table's
  hairlines stay full strength.

### F3. Space plays from the caret, as in the Player (high)

- **Research.** Flat: Space play/stop, Shift+Space resume where stopped (`FLAT_PLAYER_AND_PIANO.md` §1.1;
  `FLAT_SETTINGS_TOOLS_FLOWS.md` §3.3 `togglePlayStopResume`). Dorico: Space start/stop, P play from selection
  (`SHORTCUTS_BY_MODE.md`, Global).
- **Today.** "Play from here" (`strip.playFrom`, `SelectionStrip.tsx:92-105`) has no key. Space holds the sustain
  pedal (`EditorKeyboard.tsx:79`, `spacePedal={takes.stage === 'idle'}`), while the Player's Space plays
  (`PlayerLayout.tsx:317`, `player-keys.ts` `play: { key: ' ' }`). The ruling "One score in two modes … the same
  transport" (Player and editor together) is broken by the key.
- **Change.** In the editor Space = "Play from here" / "Stop" (`togglePlay`), listed in the shortcuts sheet as "Play
  from here, or stop", shown in the button's tooltip ("Play from here (Space)"). `EditorKeyboard` passes
  `spacePedal={false}`; while a take records Space still stops it (`STOPS_A_TAKE`, unchanged).

### F4. Shortcuts in every tooltip of the bar and strip (high)

- **Research.** Flat's play tooltip names its keys ("Play or stop ({{playShortcut}})…", `FLAT_PLAYER_AND_PIANO.md`
  §1.1); the owner: "Shortcuts in every tooltip" (Score editor, "Notation we have").
- **Today.** "Undo", "Redo" (`EditorHeader.tsx:61-80`), "Delete" and "Play from here" (`SelectionStrip.tsx:67-105`)
  and the six Pitch keys "Diatonic step up/down", "Semitone up/down", "Octave up/down" (`NoteKeys.tsx:545-560`)
  carry no key in their tooltips, though the keys exist.
- **Change.** Through `useKeyTip`: "Undo (⌘Z)", "Redo (⇧⌘Z)", "Delete (⌫)", "Play from here (Space)", "Diatonic step
  up (↑)", "Semitone up (⇧↑)", "Octave up (⌘↑)" and their downs; Ctrl on Windows and Linux, as `modifierCaps` prints.

### F5. Tie writes the next note tied, during input (high)

- **Research.** Dorico's Tie (T) in step input writes the same pitch tied at the current value
  (`ui-flow/APP_FLOW.md` §3.1 `NoteInput.Tie`; tutorial "Editing notes › Adding ties", §C2). Flat's Tie is `,`
  (`FLAT_SETTINGS_TOOLS_FLOWS.md` §3.3).
- **Today.** "Tie" (`marks.tie`, `,`) only joins a note to a same-pitch note already after it; with the caret at the
  end of what is written it is left out (`NoteKeys.tsx:256-264`, `canTie`), so a note held across a barline cannot be
  typed.
- **Change.** With the caret right after a written note or chord and no same-pitch note following, `,` writes that
  note or chord again at the chosen value, tied from the one before, and moves the caret on; across a barline it
  splits as the bar needs. With a same-pitch note after, `,` ties to it as today. The key is never disabled at the
  caret after a note; elsewhere F1's "Tie: No note of the same pitch follows.".

### F6. Accidentals and Respell act on the note just written (high)

- **Research.** Flat's `flatLastNote` / `sharpLastNote` / `naturalLastNote` (⇧−, ⇧=, ⇧0) change the note just
  entered (`FLAT_SETTINGS_TOOLS_FLOWS.md` §3.3); Dorico respells retrospectively
  (`options/NOTE-INPUT_OPTIONS.md`, `allowNotesToBeRespeltRetrospectively = true`).
- **Today.** ♮ ♯ ♭ and "Enharmonic spelling" are drawn only with notes chosen (`NoteKeys.tsx:117`, `:320`), so a
  note played on the keys as C♯ cannot be made D♭ without first clicking it back.
- **Change.** With no note chosen, ♮ ♯ ♭ (`0`, `=`, `−`) and Enharmonic spelling (⇧J) act on the note or chord the
  caret last wrote; with nothing written before the caret, F1 greys them ("Sharp: Select one or more notes first.").
  No new key: the same keys reach further.

### F7. Chord input by interval (high)

- **Research.** Flat: Alt+2…8 adds a note a 2nd…octave above the chosen note, Alt+Shift+2…8 below
  (`FLAT_SETTINGS_TOOLS_FLOWS.md` §3.2, §3.3 `addNoteInterval1…7`, `addNoteIntervalMinus1…7`).
- **Today.** Chords are built only by the Chord mode or keys struck together (`keys-played.ts:10`, 80 ms); Alt with
  a digit does nothing (`shortcuts.ts:124-132`, `toolOf` ignores Alt).
- **Change.** New tools in `TOOL_SHORTCUTS`: `interval2…interval8` (Alt+2…Alt+8, caps "⌥2"…"⌥8"), diatonic in the
  bar's key, on the notes chosen else the note last written; `intervalDown2…8` with Alt+Shift. No palette key (as
  Flat); the shortcuts sheet lists "Add a note a 2nd to an octave above" / "…below". Applies on a staff only.

### F8. Second voice on a staff (high, model change)

- **Research.** Dorico ⇧V Create Voice, V Next Voice (`SHORTCUTS_BY_MODE.md`, Step input); Flat V cycles voices,
  ⇧V voice 2 (`FLAT_SETTINGS_TOOLS_FLOWS.md` §3.2), Flat's nudge "Writing for Piano? Press V to switch to voice 2"
  (§5.7). Ranked M2 for a piano learner (`piano-trainer-comparison/PIANO_TRAINER_VS_DORICO.md` §5).
- **Today.** No voice action among the reducer's (`state.ts:89-252`); engraving already draws one or two voices a
  staff (ADR 0087).
- **Change.** "Voice 2" toggle in Note's Input mode group after Chord, ⇧V (V alone is the piano's), pressed while
  the caret writes the second voice (stems down); the strip's line reads "Bar 4 · beat 1 · Lower staff · voice 2".
  Delete on an empty voice-2 bar removes its rests.

### F9. Cross-staff notes (medium-high)

- **Research.** Dorico `CrossStaff` above/below (`PIANO_TRAINER_VS_DORICO.md` §5 M1: "Piano music needs it
  constantly").
- **Today.** None (grep `cross.?staff` = 0). ⌘⇧↑/↓ repeats ⌘↑/↓, an octave (`shortcuts.ts:187`).
- **Change.** ⌘⇧↑ "Cross to upper staff", ⌘⇧↓ "Cross to lower staff" on the notes chosen of the piano's two
  staves; keys in Pitch after the octave pair; F1 reason "Available on the piano staves only. Select a note on the
  upper or lower staff." (`reason.hand`, the Fingering field's already, `fields.ts:55`).

### F10. Bar navigation on Cmd, as both references (medium)

- **Research.** Flat ⌘← ⌘→ previous/next bar, ⌘⇧← ⌘⇧→ extend by a bar (`FLAT_SETTINGS_TOOLS_FLOWS.md` §3.3
  `goPreviousMeasure`, `rangeSelectPrevMeasure`); Dorico the same (`SHORTCUTS_BY_MODE.md`, Step input "Move Caret
  Left by Bar", Write "Select Left by Bar").
- **Today.** ⌥← ⌥→ a bar, ⌘← ⌘→ the score's ends (repeating Home and End), ⇧⌥ extend to the bar
  (`shortcuts.ts:172-180`; sheet `shortcuts.bar`, `shortcuts.extendBar`).
- **Change.** ⌘← ⌘→ "Previous or next bar"; ⇧⌘← ⇧⌘→ "Extend the selection by a bar"; Home/End and ⇧Home/⇧End keep
  the ends. Alt with ← → does nothing (no second binding).

### F11. Go to bar (medium)

- **Research.** Flat ⌘G `promptAndGoMeasure` (`FLAT_SETTINGS_TOOLS_FLOWS.md` §3.3); Dorico ⌘G / Jump bar
  (`PIANO_TRAINER_VS_DORICO.md` §5 M13: "the Player has it; not found in the editor").
- **Change.** ⌘G opens a small field over the sheet, "Go to bar", a number 1–N, Enter puts the caret at that bar's
  first beat on the current staff. Listed in the sheet. The Player's go-to-bar control is reused, not copied.

### F12. Select all and select bar (medium)

- **Research.** Flat ⌘A selects the part, ⌥A the bar, ⇧⌥A the bar on every staff (`FLAT_SETTINGS_TOOLS_FLOWS.md`
  §3.3); Dorico ⌘A select all, ⌘D none (`SHORTCUTS_BY_MODE.md`, Global).
- **Today.** No select-all; ⌘A falls to the browser.
- **Change.** ⌘A "Select all" on the caret's staff (the chord row's bars in the chord row); ⌘A again extends to every
  staff. Escape clears, as now.

### F13. Repeat the selection (medium)

- **Research.** Flat `duplicate` (R), nudge "To repeat a note, select it and press R" (`FLAT_SETTINGS_TOOLS_FLOWS.md`
  §3.3, §5.7); Dorico R Repeat Item (`SHORTCUTS_BY_MODE.md`, Write).
- **Today.** None; Copy then Paste is the only way.
- **Change.** "Repeat" (⇧R, R being the piano's, as J, S, T and P took Shift under ADR 0114) writes the notes chosen,
  else the note last written, again right after them and chooses the copy. A key in Note's Notation grid after Rest.

### F14. Bar keys as Flat's (medium)

- **Research.** Flat: ⌥Enter Insert Measure After, ⌘⇧Enter add a measure at the end, ⌘Enter System break (a
  toggle), ⌘⌫ Remove Measure (`FLAT_SETTINGS_TOOLS_FLOWS.md` §3.1 Measure, §3.3).
- **Today.** ⌘⇧Enter is "Add bar after" (`shortcuts.ts:89-95`); ⌥Enter moves a line (`shortcuts.ts:199-201`); "Line
  break" and "Join lines" are two keys (`BarKeys.tsx:9-16`).
- **Change.** ⌥Enter "Add bar after"; ⌘⇧Enter "Add bar at end" (new, `bars.addEnd`); ⌘Enter "System break" as one
  toggle, pressed where a system starts at that bar, a second press joining the systems; the "Join lines" key and
  `bars.joinLine` go.

### F15. One word for a bar (medium, labels)

- **Research.** Dorico writes "bar" throughout (Insert Bars, bar numbers, "Move Caret Left by Bar",
  `SHORTCUTS_BY_MODE.md`; `PALETTES.md` barsbarlinespanel). The app already says "bar" everywhere the learner reads a
  place ("Bar 4 · beat 1", "Add bar after", "Delete bars", "Write from bar 3").
- **Today.** The palette's category is "Measures and brackets" (`editor.ts:49`) though it holds no brackets (bars,
  tempo, swing); Layout says "Measures" (`:195`), "Measure numbers" (`:196`), "Measures per system" (`:220`), "Fewer
  / More measures per system" (`:222-223`), "Every measure" (`:224`).
- **Change.** `palette.category.measures` "Bars"; `layout.groups.measures` "Bars"; "Bar numbers"; "Bars per system";
  "Fewer bars per system" / "More bars per system"; "Every bar". `ru` already says такт.

### F16. The shortcuts sheet names what the palette names (medium, labels)

- **Today.** One act, two names: palette "Add bar after" vs sheet "Insert bar after" (`editor.ts:523` / `:628`);
  "Delete bars" vs "Delete selected bars" (`:525` / `:629`); "Grace note" vs "Appoggiatura" (`:385` / `:618`); "Line
  break" vs "System break" (`:526` / `:630`).
- **Change.** The sheet reads the palette's label: "Add bar after", "Delete bars", "Grace note", "System break"
  (after F14). `shortcuts.barAfter`, `barDelete`, `grace` and `bars.newLine` merge into the one key each.

### F17. Dynamics named as the musician names them (low-medium, labels)

- **Research.** Flat: sfz "Sforzando", sf "Sforzando (sf)", sffz "Sforzando-fortissimo", rfz "Rinforzando", rf
  "Rinforzando (rf)", fp "Fortepiano", pf "Pianoforte" (`FLAT_SETTINGS_TOOLS_FLOWS.md` §3.1 dynamics).
- **Today.** sfz "Sforzato", sffz "Sforzatissimo", rfz "Rinforzato", fp "Forte-piano", pf "Piano-forte"
  (`editor.ts:424-433`).
- **Change.** As Flat, the commoner terms: sfz "Sforzando", sf "Sforzando (sf)", sffz "Sforzando-fortissimo", rfz
  "Rinforzando", rf "Rinforzando (rf)", fp "Fortepiano", pf "Pianoforte".

### F18. Double dot and nonuplet keys (low-medium)

- **Research.** Flat ⌥. `addTwoDots` (`FLAT_SETTINGS_TOOLS_FLOWS.md` §3.3).
- **Today.** "Double dotted" has no key (`NoteKeys.tsx:286-296`, no `tool`); the nonuplet none
  (`NoteKeys.tsx:371`).
- **Change.** `doubleDot`: ⌥. ("Double dotted (⌥.)"). The nonuplet stays keyless (⇧9 is the acciaccatura's,
  ADR 0097); its tooltip says nothing extra.

### F19. The palette unfolds as a sheet, not a jump (medium, motion)

- **Research.** Flat's mobile toolbar panel slides in (`margin-bottom −319px→0, opacity`, .4s ease); its bottom
  sheet `translateY(100%)↔0`, .3s `cubic-bezier(.32,.72,0,1)`, close committed on `animationend`; sections open by
  `grid-template-rows 0fr→1fr` .2s (`FLAT_UI_SHELL_AND_MOTION.md` §3). Owner: "open, the sections as structured,
  animating well" (Score editor, Palette).
- **Today.** `PaletteSheet` swaps the row for the sections with no transition (`EditorPalette.tsx:453-465`): the
  sheet jumps from one row to `50dvh`.
- **Change.** Fold and unfold move the sheet's body by `transform` on DESIGN.md's sheet curve and length (the iOS
  curve, 450ms, following the finger on the grip); the row cross-fades to the sections over 150ms. Under reduced
  motion: instant. The category thumb keeps its 220ms slide.

### F20. Layout changes never move the score under the eye (medium, motion)

- **Research.** Dorico animates only feedback (hover, press, fold) at 100–200ms; zones and modes switch instantly
  "so the score never moves under the user's eye" (`UX_PATTERNS.md` P23). Flat re-fits the score's zoom whenever a
  panel's width changes (`FLAT_UI_SHELL_AND_MOTION.md` §1.1, auto-zoom coupling).
- **Change.** When the laptop panel's side changes ("Palette position", Left/Right) or the keys show or hide, the
  sheet keeps the caret's bar at the same height on screen (scroll anchored to the caret's line), no animated
  reflow.

### F21. The gear says which settings are the score's (medium, settings scope)

- **Research.** Flat keeps four scopes, device, account, score, editor UI (`FLAT_SETTINGS_TOOLS_FLOWS.md` §1);
  Dorico one home per scope, project options apart from preferences (`UX_PATTERNS.md` P3;
  `piano-trainer-comparison/SETTINGS_ARCHITECTURE.md` §1, S3 vs S5).
- **Today.** One group, "Settings" (`EditorGear.tsx:168-208`), mixes the score's own (Instruments, Layout) with
  preferences every score shares (Note input, Recording, On-screen piano, MIDI keyboard).
- **Change.** Two groups: "This score": Instruments, Layout; "Editor": Note input, Recording, On-screen piano ›,
  MIDI keyboard ›. Same rows, same pages; only the titles (`scoreSettings.groups.score` "This score",
  `scoreSettings.groups.editor` "Editor").

### F22. Layout: "Use for new songs" (low-medium, settings scope)

- **Research.** Flat's layout templates "Set as default" for new scores (`FLAT_SETTINGS_TOOLS_FLOWS.md` §1.3);
  Dorico "Save as Default" in its option dialogs (`SETTINGS_ARCHITECTURE.md` §1 S4, §5).
- **Today.** Layout has "Reset" only (`layout.reset`, `LayoutPanel.tsx`); every new song starts from the factory
  layout.
- **Change.** At Layout's foot beside Reset: "Use for new songs" (a button; toast "New songs will use this layout").
  `features/edit-piece/make-song.ts` reads that saved layout. "Reset" returns to it.

### F23. A way to the shortcuts from the editor (low-medium)

- **Research.** Flat's rail ends with Search and Shortcuts entries; its section headers show the shortcut hint
  (`FLAT_UI_SHELL_AND_MOTION.md` §1.2, §1.4).
- **Today.** The sheet opens only with `?` (`ShortcutsHelp.tsx:48`); its button sits on Settings › On-screen piano
  alone (`OnScreenPianoPage.tsx:27`).
- **Change.** On a fine pointer, the gear's "Editor" group ends with "Shortcuts" (`common:shortcuts.title`), the
  existing `ShortcutsButton`, "?" as its value.

### F24. Chord window for keys struck together (low)

- **Research.** Dorico `stepTimeChordDeadTimeMs` 100, a machine preference (`midi-and-staff/MIDI_SETTINGS.md`;
  `PIANO_TRAINER_VS_DORICO.md` R11: "not adjustable… slow players spread chords").
- **Today.** 80 ms, fixed (`keys-played.ts:10`).
- **Change.** Settings › Connect a piano (the one home of MIDI): "Chord window", Segmented 50 · 100 · 150 · 200 ms,
  default 100; ⓘ "Keys pressed within this time are written as one chord." Device scope (not synced, per
  `SETTINGS_ARCHITECTURE.md` §3.1).

### F25. Stale strings to delete (low, hygiene)

- `palette.hide`, `palette.show`, `palette.asList`, `palette.asGrid` (`editor.ts:28-35`) are read nowhere
  (grep = 0): delete in `en` and `ru`. The list view's orphaned doc line with no selector under it
  (`entities/settings/model/selectors.ts:42`) goes too.

---

## 2. Data to import

| File (`piano-data/research/_shared/app-ready-data/`) | Use | Target in our code |
|---|---|---|
| `engraving-defaults-verovio.json` | Dorico 6's 21 line thicknesses in staff spaces, as Verovio's `engravingDefaults`; spacing `spacingStaff 12`, `spacingSystem 20` | `src/shared/ui/score/verovio/toolkit.ts` (the screen options at l.105-121 set `spacingSystem: 4`, Dorico's 10 spaces is 20); check every field against the installed Verovio types first |
| `tempo-words.json` | Each word's own BPM (Adagio 66, Andante 80, Moderato 108, Allegro 140, Presto 172…) where a word is chosen on the dial | `src/shared/lib/music/tempo-words.ts`: a `bpm` per `TempoTerm`, used when the tempo ruler lands on a word (today the range's `from`) |
| `notation-glossary-en-ru.json` | A reference to check `ru` against, not to copy: Flat's Russian is often a machine's (Артикуляции, Орнаменты, Связка) where ours is the musician's (Штрихи, Мелизмы, Связующая лига) | review of `src/shared/i18n/locales/ru/editor.ts`; of 20 differences found, keep ours; consider only "Разрыв системы" for System break (ours "Перенос системы") |
| `clefs.json`, `octave-lines.json` | Names and octave transpositions to check ours (17 clefs, 4 octave lines) | `editor.clef.*`, `lines.*`; nothing to add for a pianist (22ma/22mb, Loco left out) |
| `ornaments.json` | `realisation` steps (Mordent `0,1`, Turn `1,0,-1`, Inverted turn `-1,0,1`) | a check of `src/shared/lib/schedule/marks.ts`'s ornament playback |
| `shortcuts-flat.txt`, `shortcuts-dorico.json` | Design input for F3–F14, not copied wholesale | `src/pages/score-editor/model/shortcuts.ts` |

Not for the editor now: `instruments-en-ru.json` (the editor adds only the piano and voices), `swing-feels.json`
(ours: Swing eighths, Swing sixteenths, Straight), `page-sizes.json` (Layout has A4 · A3 · Letter; more sizes are
a printing feature), `accidentals.json`, `notehead-sets.json`, `line-styles.json`, `playing-techniques.json`.

---

## 3. Rejected

| Research item | Why not | The ruling |
|---|---|---|
| A–G type the pitch; ⇧A–G add a chord tone; single-letter commands S, T, P, J, L, Q (Flat §3.2; Dorico P9) | Letters play the piano | `CLAUDE.md`: "A letter alone is the piano's." |
| Notes A–G only while a note-input caret is on (Dorico's context model, `PIANO_TRAINER_VS_DORICO.md` R2) | Same | as above |
| Hide every key that cannot act (ADR 0114's R32-B, MuseScore) | Overruled | Score editor, loop round 31: "the tools stay in place, greyed, as Flat's … replaces R32-B's 'only the tools that act on what is chosen are drawn'" |
| A separate Tempo category between Dynamics and Measure (Flat's current `tempo` preset, §1.4) | The owner placed it | Score editor, 2026-11-05: "Time signature as Flat's tiles with Customize; Key signature and Clef bare tables; Tempo in Measure." |
| Time signature, key or clef also set in the gear or a New-song-style dialog (Flat's Fine-tune, Dorico's dialogs) | One home | Score editor, 2026-11-05: "we can at the same time edit the time signature from the settings and from the palette which is strange … set in the palette's category" |
| Workflow modes: ⌘1–7 switch the category, digits 1–9 become its tools (Flat §3.2) | Digits are the note values; ⌘1–9 are the browser's tabs | owner: "Tools that only repeat a tap on the sheet go" (Score editor, Palette) |
| Hand separation, a part per hand, Dorico's players and layouts (M9) | Not in the editor | Score editor: "No hand separation, pattern adding or verse adding inside it." |
| A staff selector or Dorico's Setup mode | Not in the editor | Score editor: "No staff selector." |
| A folded toolbar at the laptop's foot, Dorico's lower zone | Owner refused | Score editor: "a docked side panel and a note-entry toolbar, never a folded bar at the foot ('annoying and not movable')" |
| A fog or fade at the end of the category strip | Owner refused | Score editor: "No fog at a strip's end." |
| Dorico's popovers (⇧C, ⇧K, ⇧T… type a code) | Shift+letters are taken (F, J, P, S, T); the palette is the one way in | "Palette: … Tools that only repeat a tap on the sheet go"; "One control each" (Pickers and tempo) |
| Circle of fifths as the key picker, or in Transpose | Owner refused | Pickers and tempo: "No circle of fifths as a picker."; Player and editor together: "No circle of fifths." |
| A second chosen-note colour (Dorico's orange `#ff8000`) | Sky is the selection | Player and editor together, loop round 32: the key down and chosen keys `#85B8DC`, "the score's selection colour" |
| Selection as a column over the staff | Owner refused | Sheet, selection and playhead, loop round 58: "wraps the note's head and stem alone" |
| Flat's Live MIDI Arm panel and Place-your-recording step as separate screens | The takes flow is drawn and ruled | Score editor: "Review your recording ported to its board"; "The takes are drawn (canvas 194)" |
| Quantize subdivisions in two rows (3 + 2) | Owner ruled one row | Score editor: "Quantize as one row of five (1/4 1/8 1/16 1/4t 1/8t, never 3 + 2)" |
