# The score editor and the Player against Flat and Dorico

2026-10-23. The owner asked us to look at Flat (flat.io) and Dorico (Steinberg): what each icon means, how they do
things, and whether the Player should be separate from the editor. This note answers six questions for a learner's
piano app that is used first on a phone (iPhone 14 Pro, 393×852 upright and on its side) and also in Mac Safari.

## Sources

- **The owner's screenshots.** `piano-data/reference-apps/flat-score-editor/` holds the Flat iPhone app (01–05 and
  IMG_4449–4523: the editor, the palette as a grid and as a list of names, the instruments, the playback options, the
  chord and Roman-numeral sheets, New score) and Flat on the web in Mac Safari (the 16.50–16.55 screenshots: the
  Notation sidebar, the Modes menus, the voice menu). `piano-data/reference-apps/dorico editor/` holds Dorico on a
  Mac: its built-in tutorials _Inputting notes_, _The caret and the grid_, _Editing notes_ and _Adding markings_,
  the guided tour, Layout Options, Engrave and Print mode, and the Write mode's toolboxes with their tooltips
  (17.22–17.29). The icon names below come from these tooltips and Flat's list view wherever they show one.
- **Fetched (Flat help center):** [notation features](https://help.flat.io/en/music-notation-software/notation-features/),
  [discover the interface](https://help.flat.io/en/music-notation-software/discover-the-interface/),
  [insert mode](https://help.flat.io/en/music-notation-software/insert-mode/),
  [chord mode](https://help.flat.io/en/music-notation-software/chord-mode/),
  [key signature](https://help.flat.io/en/music-notation-software/keysig/),
  [time signature](https://help.flat.io/en/music-notation-software/timesig/),
  [keyboard shortcuts](https://help.flat.io/en/music-notation-software/keyboard-shortcuts/),
  [read-only mode](https://help.flat.io/en/music-notation-software/read-only/) and its
  [blog post](https://blog.flat.io/read-only-mode-for-the-editor/).
- **Dorico, through search results only.** steinberg.help is now a JavaScript app. WebFetch got only the
  navigation, `archive.steinberg.help` answered 403, and the PDF manuals redirected or were refused. Dorico facts
  therefore come from search-result extracts of the Steinberg pages (Notes toolbox, Notations toolbox, the key
  signatures popover, the Keyboard panel and the zones of Dorico for iPad, _Modes in Dorico_), from the
  screenshots, and from our own knowledge where marked _(knowledge)_.

## 1. Icons

**Flat, phone.** The **top bar**, left to right:

- ← Back
- Instruments (piano). It opens the parts sheet: All, each part with Solo and Visible, and Edit instruments.
- In one pill, the transport: ⏮ Go to start, ▶ Play (■ while playing), 🔁 Loop, 🔊 Playback options (Audio
  playback, Metronome, Playback speed).
- Keyboard input (piano with a note). It shows the on-screen piano, each key named C4, D4 and so on.
- Flat Power (the flame, an upsell) and ☰ the menu.

The **edit row**:

- The **voice** badge (a coloured circle "1" or "2"; its menu is Use voice 1, Remove voice 2, Swap voices, Split
  staff)
- ⌫ Delete, ↶ Undo, ↷ Redo
- Copy, ✂ Cut, Paste
- The layout (|||| for the horizontal view, ≡ for pages)
- 💬 Comments

On the web the same row adds zoom in and out, export and print, and its left half holds the voice, ♮ ♯ ♭,
Enharmonic switch, the values, dots, tie and tuplet.

The **palette** has a grab handle. Folded, it shows a **quick row** (the editing-mode key ♩+, then whole to
64th, scrolling) over a **category bar**:

- ♩ Notation
- ♭•↕ Pitch and Representation
- accent Articulations
- ∾ Ornament
- _ppp_ Dynamics
- ▤ Measure
- 𝄞 Clef
- ♯♯ Key signature
- 4/4 Time signature
- 𝄇 Barlines and repeats
- Aa Text

The bar ends in ⊞/≡ (the palette as a grid of pictures or as a list of named buttons) and ▭⌄ (fold). Opened,
the sections stack and scroll, and the bar follows. **Notation** holds ♩+ (_Cycle between editing modes_), whole
to 64th, dot, double dot, tie, tuplet ⌐3¬, ♮ ♯ ♭ and ♭↔♯. **Pitch and Representation** holds:

- Cycle between editing modes, Change duration mode, Rest duration mode
- Transpose, Toggle Concert Pitch, Beaming Pattern, Force beaming, Force unbeaming
- Grace note, Acciaccatura, Ghost note, Dead note
- Set note color
- Ottava, Ottava Bassa, Quindicesima, Quindicesima Bassa

**Measure** holds Insert Measure Before, Insert Measure After, Remove Measure, System break, Page break, Add
multimeasure rest, 1- and 2-Measure Repeat, Accelerando, Ritardando, A tempo, Tempo, Swing Eighths and
Sixteenths, and the rehearsal marks. Where nothing is chosen a tool is drawn faded. A small flame badge marks a
paid tool.

**Dorico, Write mode, on a Mac.**

- **Top:** the mode tabs Setup · Write · Engrave · Play · Print, the layout chooser, then the transport (position,
  rewind, play, record, click, tempo) and Undo · Redo.
- **Notes toolbox** (left), with the names from its tooltips: Select; Start Note Input (Shift+N); Pitch Before
  Duration (K); Chords (Q); Insert (I), whose small arrow chooses its scope; Lock Duration (L); Force Duration (O);
  Create Voice (Shift+V); Dotted Notes (.); Rests (,); Tuplets (;); Grace Notes (/); Tie (T); Scissors (U).
- **Notes panel** beside it: durations from breve to 1/1024 (the rare ones behind a ⌃), ♮ ♭ ♯, slur, and eight
  articulations.
- **Notations toolbox** (right), each button opening its panel: Clefs (with octave lines), Key Signatures (with
  Tonality Systems and Accidentals), Time Signatures, Tempo, Dynamics, Ornaments, Repeat Structures, Bars and
  Barlines, Holds and Pauses, Playing Techniques, Lines, then harp pedals, video and markers, Comments and
  proofreading. The last four names are _(knowledge)_, read off the icons.
- **Status bar:** the rhythmic grid's value; Concert or Transposed Pitch; where the caret is, for example "Bar 1 ·
  Key signature: G Major"; Follow playhead; Page, Galley and Fill view; zoom.

**How ours maps** (`EditorHeader`, `EditRow`, `EditorDock`, `EditorTools`, `palette-categories.ts`):

| Ours                                   | Flat                                    | Dorico                      | Verdict                                                   |
| -------------------------------------- | --------------------------------------- | --------------------------- | --------------------------------------------------------- |
| Close ✕                                | ← Back                                  | (window)                    | fine                                                      |
| Record ●                               | (none)                                  | Record in the transport     | fine                                                      |
| View (eye)                             | layout button + Instruments' eye        | View options, Page/Galley   | fine                                                      |
| MIDI                                   | MIDI (web)                              | (device setup)              | fine                                                      |
| Song (sliders)                         | ☰ › score settings                     | Setup mode                  | fine                                                      |
| Edit row ⌫ ↶ ↷ Copy Cut Paste, Add bar | ⌫ ↶ ↷ Copy Cut Paste                    | Edit menu                   | same as Flat; **Copy/Cut/Paste say "Copy" but copy bars** |
| Dock ‹ ▶ › (toolbar named "Playback")  | ⏮ ▶ 🔁 🔊 pill                          | transport                   | **name says Playback; ‹ › move the caret**                |
| Quick row: values, Dotted              | ♩+ and the values                       | Notes panel                 | fine                                                      |
| Notes: ‥, 3, rest, tie, Chord, ♯ ♭ ♮   | Notation                                | Notes panel + toolbox       | fine                                                      |
| Pitch (icon ♯)                         | Pitch and Representation (♭•↕)          | Alt+↑/↓                     | **a ♯ reads as "accidentals"**, which live in Notes       |
| Articulations, Dynamics & hairpins     | Articulations, Dynamics                 | same panels                 | fine                                                      |
| Slurs & lines (8va, 8vb)               | slurs in Articulations, 8va in Pitch    | Lines, Clefs (octave lines) | fine                                                      |
| Bar                                    | Measure                                 | Bars and Barlines           | fine                                                      |
| Clef · Key signature · Time signature  | same three                              | same three                  | fine                                                      |
| Barlines & repeats                     | Barlines and repeats                    | Repeat Structures           | fine                                                      |
| Text & pedal                           | Text (pedal under Dynamics)             | Lines / Playing techniques  | acceptable                                                |
| Fingering, Chords                      | Articulations' Fingerings, Text › Chord | Fingering, Chord symbols    | fine                                                      |
| Fold ⌃/⌄ ("Show every tool")           | ▭⌄ and the grab handle                  | panel toggles (Cmd-7…9)     | fine; add a grab handle                                   |
| Keys (piano)                           | Keyboard input (piano + note)           | Keyboard panel (lower zone) | fine                                                      |
| (none)                                 | voice badge "1"/"2"                     | the caret's voice           | **missing: where the next note goes**                     |

**Recommendation.**

- Draw Pitch as Flat's ♭•↕ (a notehead with an up-and-down arrow), so it no longer looks like the accidentals.
- Name the dock's toolbar "Play and move" instead of "Playback" (`caret.moves`). ‹ › should say "Previous note"
  and "Next note".
- Copy, Cut and Paste should say "Copy bars", "Cut bars" and "Paste bars" while they copy bars.
- Give the palette a grab handle along its top edge: Flat's sign that the palette drags open. The ⌃ stays as the
  button for it.
- Add a read-only **layer chip** at the head of the edit row, coloured like the caret (Melody, Right hand, Left
  hand, Chords), as Flat's voice badge is. ADR 0089 decided "no row chooses the staff", so the chip only tells
  where the next note goes. Whether a tap on it should open a menu is the owner's call.

## 2. Key and time signature changes mid-piece

**Flat:** put the cursor on a bar, or choose a range of bars, and pick a key in **Key signature**. "If there is
no range selection, the new key signature will be applied until the next key or the end of the score". With a
range, only those bars change. On the phone: "tap the measure where the key should change, drag the tool palette
up, and pick the key". Clicking a printed key signature edits it, and **Switch to natural** goes back to no
sharps or flats. Time signatures work the same way from the cursor's bar. **Customize** makes any meter, the C
and ₵ symbols, and a pickup bar.

**Dorico:** the caret or a chosen item, then the Key Signatures panel (Major/Minor and a picture for each key) or
the **popover** (Shift+K, typed: `G`, `g` for minor, `3s`, `open`). During note input it lands at the caret, even
mid-bar. Return applies it to every staff and Alt+Return to the chosen staves only. Time signatures work the same
way (Shift+M; the panel's Common grid, _Create Time Signature_ with a pickup). The screenshots show both lists,
each opening on _Used in This Flow_. The status bar names the key at the caret: "Key signature: G Major".

**Ours:** the draft holds one `key` and one `meter` (`Draft`). The Key and Time sections send the learner to the
Song sheet ("Change for the whole song", ADR 0089). Most of the change already exists below the surface:

- `Section.key` is part of `DraftSection.heading`.
- `arrange` plays a section's own key.
- `line-music.ts` reads `heading.key`.
- `notate` and `scoreToMei` already write a measure's own `key` and `time`, with courtesy signatures at a line's
  end (`NextLine`).

Only the editor gives the learner no way to set a section's key.

**Recommendation.** Support **key changes at a section**, not at any bar. For a learner's songs a key change
comes with a new part: the last chorus a step up, a bridge, the relative minor.

- The Key signature section gets two choices: "From bar N" (the first bar chosen), which starts a section there
  if none starts there and sets its `heading.key`, and "Whole song", which works as today.
- The key picker is the one the Song sheet uses.
- The caret line names the key at the caret, as Dorico's status bar does.

Leave **time changes** for later. `Bar length` already covers a pickup and an odd bar, and a section's own meter
would need `Section` and the practice machine's bar grid to carry it. Mid-bar keys: never.

## 3. The palette's default state

**Flat, phone:** in every screenshot the editor opens with the palette **folded**: the quick row and the
category bar, about a fifth of the screen. It is dragged up by its handle, and a category tapped opens the
palette there. The key-signature help says the same ("drag the tool palette up"). **Flat, web:** the Notation
sidebar is **open** on the left, with Modes and Pitch and Representation expanded and the other sections folded,
and « collapses it. **Dorico:** the Notes and Notations panels are open in Write mode on a desktop and toggled
with Cmd-7 and Cmd-9 or from the toolboxes. The Keyboard panel is in the lower zone (Cmd-8). Dorico for iPad
shows the left or right zones, or the lower zone on its own, never all three.

**Recommendation.** Keep the palette **folded on a phone**: `paletteFolded` defaults to true (ADR 0089). Open it
by default **where it stands beside the sheet** (a laptop, or a phone on its side), where it covers no music.
Remember the choice for each of those two places.

## 4. The Player and the editor: separate or one?

**Flat** has one score screen. Playback (the pill: start, play, loop, playback options with speed and metronome)
works while editing. Viewing is a **mode of that screen**: the top bar's mode menu ("Edit ▾" in the
screenshots; the help calls the button **Composing** and its other choice **Read-only**). Opening a score with
**View** opens it read-only, and changing modes keeps the score, the cursor and the zoom. **Dorico** has five
modes in one window (Setup, Write, Engrave, Play, Print). The transport works in all of them. **Play mode** is
not practice: it is for sounds, the mix and automation.

**Ours:** `/play/…` is a practice machine. It has:

- Listen and Wait mode
- the loop in bars, tempo and hands
- the Setup's pattern, inversions and melody
- the keys and their spotlight

The same Player also serves walks, the chromatic walk, progressions and exercises: music generated from a choice,
with no score to edit. `/edit/…` is a caret, the palette, takes and the Song sheet. A pencil in the Player opens
the editor. The editor's Close goes back; it has no way to open the Player at its bar.

**Recommendation: keep two screens, joined like one screen with two modes.** Don't merge them.

- Half of the Player's uses can't be edited, and on a phone the palette, the caret and the edit row would leave
  no room for the keys and the transport.
- A learner practising should not be able to change the music by accident. Flat added Read-only for exactly
  that, and our Player already is that mode.

What to change so they feel like one:

1. **One mode switch, in the same place on both bars, for a piece:** a two-part control **Practise · Edit**
   instead of the Player's pencil, and the same control in the editor (today it has none). On a phone it can be
   one round button showing the other mode's icon.
2. **The bar carries over.** Edit opens at the Player's cursor bar, and Practise opens at the caret's bar
   (`?bar=` in both URLs).
3. **One layout.** The Player's `scoreView.layout` and the editor's `editorLayout` become one setting, so the
   music doesn't move when the mode changes.
4. **The editor's Play checks what was written at a learner's speed:** the Player's `TempoButton` in the
   editor's dock, as Flat's Playback speed is.

## 5. Note input

**Flat** has three **editing modes** (web Modes › Editing; I cycles them):

- **Melody:** "write one note at a time. Replace rests/notes; the cursor moves forward".
- **Insert:** "new notes push existing content to the right".
- **Chord:** "the cursor stays in place; build chords by adding notes to the same position".

**Duration** is Replace ("keep the same bar length… shortening fills the gap with rests") or Insert ("pushes
following content right"). **Rest** is Change or Keep. Outside Insert mode a value changes the note at the
cursor. In Insert mode it sets the next note's value. On the keyboard:

- ↑ ↓ moves a diatonic step, and Ctrl+↑ ↓ an octave.
- 1–7 choose whole to 64th.
- − = 0 are ♭ ♯ ♮, and J respells.
- 8 is a rest, `.` a dot and `,` a tie.

**Dorico:**

- The **caret** is an orange line with ticks over the staff showing the **rhythmic grid**. ← → move the caret by
  the grid, Space moves it by the value chosen, and Alt+[ and Alt+] change the grid.
- Choose a value, then a pitch (or a pitch first, K). **Insert** (I) pushes, **Chords** (Q) stacks.
- Notes chosen are edited with the tools that write them:
  - a value from the panel or the digits changes them;
  - Alt+↑ ↓ moves them a step, with Shift a semitone, with Cmd an octave;
  - Alt+← → moves them by the grid, and Alt+Shift+← → lengthens or shortens them.
- "If the caret is visible, anything you create will be added at the caret's position", and a marking otherwise
  goes on the note chosen.

**Ours** (ADR 0088, 0089) matches the two where they agree:

- the caret is an insertion point;
- notes chosen are changed by the same tools that write them, and a value tapped with a note chosen makes it that
  long;
- a value with only the caret sets the next note;
- Chord is a toggle;
- digits 1–6 choose the value, as Flat's do.

Three differences remain:

- ↑ ↓ moves a **semitone**, where Flat and Dorico move a **diatonic step**.
- **0** is a rest, where in both of them 0 is ♮.
- We have no Insert mode.

**Recommendation.**

- Keep ADR 0088/0089's model.
- Make **↑ ↓ a step in the key**, with a semitone on a modifier (Ctrl+↑ ↓ or the Pitch keys). A learner thinks
  in the key's notes. Shift is taken by the selection.
- Leave 0 as a rest: our letters are the piano's.
- Later, add **Insert** to the Notes section beside Chord, as one mode control (Melody · Insert · Chord) like
  Flat's. It pushes the following notes of that hand to the right.
- Our caret line already names the value and what is at the caret, as Dorico's status bar does.

## 6. Other things worth taking

- **Palette as names (Flat's ⊞/≡).** Flat's list view names every tool. We already put captions under the keys
  that are not plain pictures, so this isn't needed.
- **Faded, never hidden.** Flat fades the tools that don't apply, as ours does with a reason (ADR 0089). Keep it.
- **The on-screen keyboard names its keys (C4, D4)** in input mode, in both apps. Ours can (`namedKeys`), so it
  could be on by default in the editor.
- **Parts with Solo and an eye** (Flat's Instruments sheet) match our `StaffList` eye (ADR 0083). Solo would help
  a learner hear one hand. The Player already has hands, so the editor's Play could take the Player's hands
  button too (low priority).
- **Playback options in one place** (Flat: Audio playback, Metronome, Playback speed). The editor's dock could
  gain tempo (see §4) and keep the rest in the Song sheet.
- **Interactive tutorials.** Dorico ships short ones (_Inputting notes_, _The caret and the grid_, _Editing
  notes_), each 7 or 8 cards with a looping picture. A three-card first-visit walkthrough of our editor (the
  caret, choose and change, the palette) would suit a learner. It could be a lesson block or an empty-state card.

## Changes for us, in order

1. **Practise · Edit switch on both bars, carrying the bar:** `PlayerPage` `edit` slot, `EditorHeader`,
   `edit-search.ts` and the player search gain `bar`. This joins the two screens without merging them.
2. **One layout setting for both screens:** `entities/settings` (`scoreView.layout` and `editorLayout` become
   one, with a version bump). The music doesn't move between modes.
3. **Key change from a bar, as a section's key:** `Section` in `EditorTools` (`SongSignature kind="key"`), a
   `features/score-editor` edit setting `heading.key`, and the caret line. The model and the engraving already
   carry it.
4. **↑ ↓ a step in the key, semitone on a modifier:** `pages/score-editor/model/shortcuts.ts` and the shortcuts
   sheet. This matches Flat and Dorico and the way a learner thinks.
5. **Palette open by default where it stands beside the sheet:** `selectPaletteFolded` and `use-palette-beside.ts`.
   It covers no music there.
6. **Pitch category icon ♭•↕:** `palette-icons.tsx` (`CATEGORY_ICONS.pitch`). A sharp reads as the accidentals.
7. **Clearer labels:** "Play and move" for the dock (`caret.moves`), "Previous note" and "Next note" for ‹ ›,
   "Copy bars", "Cut bars" and "Paste bars", in en and ru `editor.ts`. These are the non-standard names.
8. **A grab handle on the palette's top edge:** `EditorTools`. It is Flat's sign that the palette drags open.
9. **Tempo in the editor's dock:** `EditorDock` with `TempoButton`. It checks what was written at a learner's
   speed.
10. **A read-only layer chip at the edit row's head:** `EditRow`. It shows where the next note goes, as Flat's
    voice badge does.
11. **Insert mode (Melody · Insert · Chord):** `features/score-editor` reduce, `NoteKeys`. Later; it needs its
    own ADR.
12. **A first-visit editor walkthrough:** `pages/score-editor`. Dorico's tutorials show that it works. Later.

## 7. Flat's help, read for ADR 0091 (2026-10-23, later)

Fetched: [accidentals](https://help.flat.io/en/music-notation-software/accidental/),
[fingerings](https://help.flat.io/en/music-notation-software/fingerings/),
[enharmonic switch](https://help.flat.io/en/music-notation-software/enharmonic-switch/),
[chords](https://help.flat.io/en/music-notation-software/chords/),
[articulations](https://help.flat.io/en/music-notation-software/articulation/),
[dynamics](https://help.flat.io/en/music-notation-software/dynamics/). Dorico's pages are a JavaScript app and give
WebFetch only their navigation.

- **Accidentals** sit beside the durations and stay in sight whichever tab is open; 0 is ♮, = is ♯, − is ♭. On a
  note, a tap writes the sign; the same sign tapped again makes it double, a third tap takes it off, a fourth
  writes it as a courtesy (in brackets), a fifth starts over. ♮ on an altered note takes the sign off. On a rest,
  an accidental is prepared for the next note written.
- **Enharmonic switch** (J) respells one chosen note (C♯ ↔ D♭); the pitch stays.
- **Fingering** is under Articulations (Fingerings). It acts on the note under the cursor; each tap raises the
  number by one, and a tap past the highest takes it off. A chord is fingered note by note.
- **Articulations** (staccato, staccatissimo, tenuto, detached legato, accent, marcato; fermata; breath, caesura)
  are toggles: the same one again takes it off; a range takes it on every note at once.
- **Dynamics** go under the staff at the cursor or the chosen note and hold until the next; the default _mp_ is
  not printed; the same dynamic tapped again takes it off. Hairpins span several notes (a range).
- **Chord symbols** (Text › Chord, Cmd+K): a text field at the chosen note with suggestions as one types; → or
  Enter the next chord, ← the previous, Esc back to the note. Flat stores the chord's meaning, so only chords it
  knows are taken. Chord symbols do not play back on their own.

**What ours takes (ADR 0091):** accidentals as toggles with ♮ returning to the key (no doubles, no courtesy yet);
fingering as a tap that raises the chosen note's finger, past 5 none, one note of a chord at a time
(`chordNote`); articulations and dynamics as toggles over the notes chosen; the chord field at the chosen bar with
→ ← Enter as Flat's.
