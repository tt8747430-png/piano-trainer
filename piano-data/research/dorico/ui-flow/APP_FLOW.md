# Dorico 6.2 application flow: screens, navigation, controls and where they lead

This maps how the whole Dorico application works: start screen → project window → modes → panels → dialogs → output.
It's a blueprint for the editor's application shell, not just the score canvas.

**Sources, all from the installed app (Dorico 6.2.31):**
- **[B] App binary:** widget names, labels, Steinberg's tooltip text and command IDs, as stored together per panel.
- **[K] Default key commands:** `keycommands_en.json` and the shortcut mapper.
- **[H] Help map:** `helpconnections.json`, which lists every UI area that has a manual page.
- **[Q] Embedded QML screens.**

Every control listed below appears in those sources. The per-area raw evidence is in `PANELS_AND_BUTTONS.md`, `COMMANDS.md`, `SHORTCUTS_BY_MODE.md` and `DIALOGS_AND_SCREENS.md`.
Shortcuts are macOS: ⌘ = Ctrl in the key files, ⌥ = Alt, ⇧ = Shift.

---

## 0. Screen map

```
App launch
 └─ Hub  [Q: Hub/, "Create New", templates, recent, tutorials "Opens in browser", news, Sign In]
     ├─ New project (from template: Orchestral · Band · Jazz · Chamber · Choral and Vocal · Solo)   [B menu "New From Project Template"]
     ├─ Open… / Open Recent / Import (MusicXML ⌘⇧O, MIDI)                                           [K File.Open, File.Open?FilterID=MusicXMLImportFilter]
     └─ Project window  ────────────────────────────────────────────────────────────────────────────┐
         Menu bar: File · Edit · View · Setup · Write · Engrave · Play · Library · Window · Script · Help   [B "&File|E&dit|&View|&Setup|W&rite|E&ngrave|Pl&ay|&Library|&Window|Scri&pt|H&elp"]
         Toolbar: mode switch [Setup | Write | Engrave | Play | Print]  + layout selector + zone toggles + mini transport
         ┌──────────┬───────────────────────────────┬──────────┐
         │ Left     │   Score area (music)          │ Right    │   Left/Right zone = mode-specific panels
         │ zone     │   tabs · split view           │ zone     │
         ├──────────┴───────────────────────────────┴──────────┤
         │ Lower zone: Properties · Key Editor · Mixer · Keyboard · Fretboard · Drum Pads │   [H projectwindow/lowerzone/*]
         ├────────────────────────────────────────────────────────┤
         │ Status bar: view type · zoom · selection info          │   [H projectwindow/statusbar]
         └────────────────────────────────────────────────────────┘
         Modes:  Setup ⌘1 · Write ⌘2 · Engrave ⌘3 · Play ⌘4 · Print ⌘5 / ⌘P · Read (no default shortcut)  [K Window.SwitchMode?WindowMode=…]
         Dialogs: Engraving Options ⌘⇧E · Layout Options ⌘⇧L · Notation Options ⌘⇧N · Note Input Options · Playback Options ·
                  Project Info ⌘I · Preferences ⌘, · Library editors (Library menu)
```

The **workflow order** the modes are built for is Setup → Write → Engrave → Play → Print.
Every mode shows the **same project**, just with different panels and tools. Switching modes never changes the music.

---

## 1. Project-window shell (all modes)

| Control | Command | Shortcut | Effect |
|---|---|---|---|
| Mode switch | `Window.SwitchMode?WindowMode=kSetupMode / kWriteMode / kEngraveMode / kPlayMode / kPrintMode / kReadMode` | ⌘1 ⌘2 ⌘3 ⌘4 ⌘5 (⌘P = Print) | Swaps the left, right and lower zone contents and the toolbox. The score stays. `Window.ModePrevious` returns to the last mode. |
| Show/hide left zone | `Window.ShowLeftPanel` | ⌘7 (numpad) | Toggles the mode's left panel |
| Show/hide right zone | `Window.ShowRightPanel` | ⌘9 (numpad) | Toggles the mode's right panel |
| Show/hide lower zone | `Window.ShowBottomPanel` | ⌘8 (numpad) | Toggles the lower zone |
| Hide/restore all zones | `Window.HideAllPanels` | ⌘0 (numpad) | Score-only view |
| Show toolbar | `Window.ShowToolbar` | ⌘6 (numpad) | |
| Cycle lower-zone panel | `Window.CycleLowerPanelType` / `Window.SwitchToLowerPanel` | | Properties → Key Editor → Mixer → Keyboard → Fretboard → Drum Pads |
| Cycle lower-zone size | `Window.CycleLowerPanelSize` | | |
| Focus a zone | `Set Focus [Value=kLeftPane/kRightPane/kBottomPane/kScoreView]` | ⌥7 / ⌥9 / ⌥8 or ⌥Enter / ⌥0 | Keyboard focus moves into that zone |
| Next / previous layout | `Window.NextLayout` / `Window.PreviousLayout` | ⌥] / ⌥[ | Cycles which layout (score or part) the tab shows |
| Score ↔ part toggle | `Window.ToggleScoreAndPartLayout` | W | Jumps between the full score and the selected instrument's part |
| Layout selector | `Window.SwitchToLayout` | | Picks any layout for the current tab |
| Page / galley view | `Window.SwitchLayoutAspectType?…kPageViewAspect / kGalleyViewAspect`, `Window.TogglePageAndGalleyView` | ⌥⌘1 / ⌥⌘2 (numpad) | **Page view** shows real pages. **Galley view** shows one endless system with staff labels, for input. |
| Page arrangement (status bar) | status bar menu | | Spreads horizontally/vertically, single pages horizontally/vertically [B] |
| Zoom | `View.ZoomIn` / `View.ZoomOut` / `View.ZoomWholePage` / `View.ZoomDialog` | ⌘= or Z / ⌘- or X / ⌥⌘0 / ⌥Z | Presets 60–1600 %, Page Width, Whole Page, Custom Zoom [B] |
| Move view | `View.MoveViewport…` | Home / End / PgUp / PgDn, ⌘Home / ⌘End | |
| Tabs | `Window.NewTab`, `NextTab`, `PreviousTab`, `CloseTab`, `CloseOtherTabs`, `MoveTabToNewWindow`, `ShowTabBar` | | Each tab shows one layout, so you can open the score and a part side by side |
| Split view | `Window.SwitchSplitMode` | | No split · vertical split · horizontal split [B] |
| New window | `Window.NewWindow` | ⌘⇧T | Another window on the same project |
| Mixer / transport windows | `Window.Mixer`, `Window.Transport` | | Floating windows |
| Follow playhead | `Window.ToggleFollowPlayhead` | | Status-bar slide switch `followPlayheadSlideSwitch` [B] |
| Jump bar | `UI.ShowJumpBar`, `JumpBar.*` | J | Type-to-run any command or go to a location |
| Go to bar | `Edit.GoTo` | ⌘G | |

**Status bar** [B `StatusBar`]: score-order menu (`scoreOrderPopupMenuButton`), follow-playhead switch, view buttons (`pageViewButton`, `galleyViewButton`, `continuousVerticalViewButton`), zoom (`customZoomButton`), Marquee Tool, Fill view.

---

## 2. Setup mode (⌘1): define WHO plays, WHAT pieces, WHICH outputs

Three panels. The core interaction: **select an item in one panel and the other two highlight their membership** as included/not-included cards (styles `cardIncludedFill` / `cardNotIncludedFill` [B]). Clicking a card toggles membership.

### 2.1 Players panel (left) [B `MusiciansPanel`, H `setupmode/playerspanel`]
> "Add players and assign instruments to them in the Players panel. Players represent the people who will play your music. Drag players up and down to change the order they appear in layouts. Select a player to see which flows and layouts he or she appears in." [B]

| Button (widget) | Label | Shortcut | Opens / does |
|---|---|---|---|
| `addSoloPlayerButton` | Add Single Player | ⇧P | Adds a solo player, then opens the **instrument picker** (search by name/family/ensemble; `instrumentLineEdit`, `categoryListView`, `ensembleListView` [B]) |
| `addSectionPlayerButton` | Add Section Player | ⌥⇧P | A section player (e.g. "Violin I"), which can divide (divisi) |
| `addEnsembleButton` | Add Ensemble | | Adds a predefined set of players (32 ensembles, see `../library-data/ensembles.json`) |
| `addGroupButton` | Add Group | | Player group (bracketed section) |
| `sortPlayersButton` | Sort Players | | Re-sorts by the project's **score order** |
| `playerContextMenuButton` | Player Settings | | Menu: rename, change instrument, move/copy instrument to player, player-name editor… |
| `deleteButton` | Delete Player | Backspace / Del | |
| (player card) `+` | Add Instrument to Player | ⇧I | Doubling, e.g. Flute + Piccolo |
| drag / ⌥↑ ⌥↓ / ⌥⌘↑ | Move Player Up/Down/to Top | | Changes order in all layouts |

**Empty-project screen** [B `EmptyStateWidget`]: "Start your project by adding some players".
- **Solo player:** "An individual player who plays one or more instruments. Examples: Solo violin, Piano, Flute & Piccolo."
- **Section player:** "A group of players that all play the same instrument. Examples: Violin I section, Soprano as part of a choir."
- **Ensemble:** "An easy way to add multiple players at the same time. Examples: Double Woodwind, Triple Brass, String section."

### 2.2 Flows panel (bottom) [B `FlowsPanel`]
> "Your project can contain separate movements, songs, or pieces; these are called flows. Drag flows left and right to change the order they appear in layouts. Select a flow to see which players appear in it and which layouts it appears in." [B]

| Button | Label | Shortcut | Opens / does |
|---|---|---|---|
| `newFlowButton` | Add Flow | ⇧F | New empty flow; all players are added (`playerAcquisitionPolicy 1,1`) |
| `notationOptionsButton` | Notation Options | ⌘⇧N | **Notation Options dialog** for that flow: "settings for beat, beam and rest grouping in different time signatures, rules for accidentals, and how to position notes and rests in multiple voices… set individually for each flow" [B] |
| `flowsContextMenuButton` | Flow Settings | | Rename, duplicate, split/join flows |
| `deleteFlowButton` | Delete Flow | Backspace | |
| `rearrangeFlowsButton` / ⌥← ⌥→ / ⌥⌘← ⌥⌘→ | Move Flow Left/Right/to Start/End | | Order of flows in every layout |

### 2.3 Layouts panel (right) [B `LayoutsPanel`]
> "Layouts bring together players and flows in combination to produce the pages of music you can view, edit, and print. Score and part layouts are updated automatically as you work, and you can also create custom score layouts for rehearsal scores or unusual combinations." [B]

| Button | Label | Shortcut | Opens / does |
|---|---|---|---|
| `newFullScoreButton` | Add Full Score Layout | | All players and all flows |
| `newPartButton` | Add Instrumental Part Layout | | One player; parts are also auto-created per player |
| `newCustomScoreButtom` | Add Custom Score Layout | ⇧L | Any subset, e.g. a piano/vocal score |
| `sortLayoutsButton` | Sort Layouts | | |
| `layoutOptionsButton` | Layout Settings → **Layout Options** | ⌘⇧L | "change page and staff size, staff labeling, rhythmic spacing and staff spacing for each layout" [B] |
| `layoutsContextMenuButton` | menu | | Rename, duplicate, layout number… |
| `deleteLayoutButton` | Delete Layout | | |

Other Setup actions: `Insert Player/Instrument/Flow/Layout` (Insert key), and Project Info (⌘I).
Project Info covers title, composer and so on per project and per flow, plus "Copy info from", "Import Tempo Track" and capo definition [B].

---

## 3. Write mode (⌘2): enter and edit the music

Layout: **left = Notes toolbox and Notes panel**, **right = Notations toolbox and panels**, **lower = Properties / Key Editor / Keyboard / Fretboard / Drum Pads**.

### 3.1 Notes toolbox (left edge) [B `NoteInputToolbox`]
> "These tools change the way note input and editing work. Most stay switched on until you switch them off, and apply both during note input (when the caret is visible) and when you are editing your music afterwards." [B]

| Tool | Command | Key |
|---|---|---|
| Select (mouse input off) | `NoteInput.MouseInputDisable` | |
| Start Note Input | `NoteInput.Enter` | Enter, ⇧N, I (shows the **caret**) |
| Pitch Before Duration | `NoteInput.PitchBeforeDurationToggle` | |
| Chords | `NoteInput.StartEndChord` | Q |
| Insert (Voice / Player / Global / Global Adjustment of Current Bar) | `NoteInput.InsertScope?InsertModeScope=kVoice/kPlayer/kGlobal/kGlobalCurrentBar` | |
| Lock durations | `NoteInput.Locked` | L |
| Force duration | `NoteInput.ForceDuration` | O |
| Dotted notes (1–4 dots) | `NoteInput.SetDotted?Value=1..4` | |
| Rests | `NoteInput.RestMode` | , |
| Grace notes (slashed/unslashed) | `NoteInput.CreateGraceNote`, `GraceNoteSlashToggle` | numpad / , ⌥ numpad / |
| Tie | `NoteInput.Tie` | T |
| Tuplets | `NoteInput.StartTupletRun` | ; to start, : to end |
| Scissors (split notes) | `NoteInput.Scissor` | |
| Create Voice / Create Slash Voice / Next Voice | `NoteInput.CreateVoice` / `CreateSlashedVoice` / `NextVoice` | ⇧V / – / V |

### 3.2 Notes panel [B, H `writemode/notespanel`]
> "The Notes panel contains all of the basic note durations, accidentals, articulations and slurs you need while inputting music. You can input music using the mouse, a MIDI keyboard, or your computer keyboard." [B]

- **Durations:** keys 1–9 select the duration: 1 = 128th, 2 = 64th, 3 = 32nd, 4 = semiquaver, 5 = quaver, **6 = crotchet**, 7 = minim, 8 = semibreve, 9 = breve. These are `NoteInput.NoteValue?LogDuration=…`. Key 6 = `kCrotchet` and key 9 = `kBreve` are confirmed in `keycommands_en.json`.
- **Accidentals:** natural, flat, sharp (`NoteInput.SetAccidental?Type=…`).
- **Articulations:** accent, marcato, stress, unstress, staccato, tenuto, staccatissimo, staccato-tenuto (`NoteInput.SetArticulation?Value=…`).
- **Slur:** S to start, ⇧S to stop.
- **Show/hide all buttons:** `NoteInput.ToggleFullAndReducedNoteInputButtons`.

### 3.3 Step input with the caret (context "Step input" [K])
| Key | Action |
|---|---|
| A–G | Input pitch, nearest octave. ⌥⇧ + letter goes up an octave, ⌃ + letter goes down. |
| Space | Advance caret (inserts a rest-gap) |
| ← → ↑ ↓ | Move caret left/right; up/down to the next staff |
| ⌘← / ⌘→ | Move caret by a bar |
| Backspace / Del | Delete left / right |
| V / ⇧V | Next voice / create voice |
| ; / : | Start / end tuplet input |
| Numpad / | Grace note |
| L | Lock durations |
| Esc | Stop note input |

### 3.4 Editing a selection (Write context [K])
- **Pitch:** ⌥↑ / ⌥↓ diatonic; ⌥⇧↑ / ⌥⇧↓ chromatic; ⌥⌘↑ / ⌥⌘↓ octave.
- **Position:** ⌥← / ⌥→ moves the selection by the rhythmic grid.
- **Duration:** ⌥⇧← / ⌥⇧→ shorten or lengthen by the grid.
- **Grid resolution:** ⌥[ / ⌥].
- **Respell:** ⌥= / ⌥- respells using the note name above or below.
- **Select by bar:** ⌘← / ⌘→ moves the selection a bar; ⌘⇧← / ⌘⇧→ extends it.

### 3.5 Notations: popovers (type-to-create) and panels
The Notations toolbox switches between **Popovers** and **Panels** (`notationstoolbox/panelspopoverstoggle` [H]).
A popover is a small text field at the selection. You type a short code, and Return creates the item.

| Popover (key) | Creates | Matching panel [H] |
|---|---|---|
| ⇧C | Clef / octave line | Clefs panel: Common, Uncommon, Archaic, Octave Lines [B] |
| ⇧K | Key signature | Key Signatures panel: tonality systems, accidentals, custom key signatures |
| ⇧M | Time signature | Time Signatures panel: common signatures, "Create Time Signature", "Pick-up bar of: 1 beat" [B] |
| ⇧T | Tempo | Tempo panel: Absolute / Gradual / Relative tempo change, Reset Tempo, Tempo Equation, Tap Tempo [B] |
| ⇧D | Dynamic | Dynamics panel: immediate dynamics, force/intensity of attack, combined dynamics +/− [B] |
| < / > (⌥ for messa di voce) | Hairpin | |
| ⇧O | Ornament | Ornaments panel (Baroque/Classical, Jazz, arpeggiation, glissandi, guitar sections [B]) |
| ⇧P | Playing technique | Playing Techniques panel |
| ⇧H | Hold or pause | Holds and Pauses panel: fermatas (9 kinds), breath marks (4), caesuras (5) [B] |
| ⇧B | Bar or barline | Bars and Barlines panel: Insert Bars (count, location), Insert Bar Rest, Create Barline [B] |
| ⇧A | Rehearsal mark | |
| ⇧X | Text | rich text editor (`TextEditor.*`) |
| ⇧L | Lyrics | lyrics editor (lines, translations, chorus [B]) |
| Q | Chord input | |
| (panels only) | Lines, Repeat Structures, Cues ("Create Cue", "Suggest Cues…"), Comments (Create/Edit/Reply/Export/Delete Comment), Video (markers, Find Tempo), Proofing | [H writemode/*] |

`Edit.*` (243 commands) and `Filter.*` (96) provide the menu-level actions on a selection.
- **Edit:** stems, beaming, Paste Special and so on.
- **Filter:** "select only / deselect only" by item type.
- **Write › Transform** (`MusicalManipulation.*`): invert, retrograde, rotate, map pitches, map scale, repeat pitches.

### 3.6 Properties panel (lower zone) [B `PropertiesPanel`]
> "Change the appearance or behavior of individual items in the music using the advanced options found in the Properties panel. Click a property switch to activate it and set a property, and click it again to remove the property. For some kinds of items, more properties appear in Engrave mode than in Write mode." [B]

**Scope controls** (`lowerzone/propertiesscopecontrols`, preference `noteinput/propertiesscope` [H]) set whether a change applies **locally** (this layout and frame chain only) or **globally** (all layouts).
In the data model this is the `context.layoutIDWithFrameChainID` of each property (see `../data-model/DATA_MODEL.md` §4.5).

---

## 4. Engrave mode (⌘3): page-level and graphical editing

Same score, but now **pages, frames and positions** are editable. Nothing here changes the musical content.

### 4.1 Engrave toolbox [B `EngraveToolbox`]
| Button | Command | What becomes editable |
|---|---|---|
| Graphic Editing | `Window.ShowEngraveModePanel?SpecialEditModeType=kGraphical` | Drag or nudge any item: ⌥ + arrows nudges a little, ⌥⌘ + arrows a lot. Slur and tie handles, beam slants, item offsets. Right panel: Formatting (bracketing, casting off) [H graphiceditingpanel/*] |
| Frame Editing | `…kFrame` | Create and edit frames. Right panel = Frames: Insert Music / Text / Graphics Frame; Constraints: Lock to Top / Left / Right / Bottom Margin [B]. "Double-click a graphics frame to choose the graphic… position, size, margins and tab stops… using the Properties panel." [B] |
| Staff Spacing | `…kStaffSpacing` | Drag staves and systems vertically; Reset Staff Spacing |
| Note Spacing | `…kNoteSpacing` | Drag spacing handles horizontally; Reset Note Spacing |
| Graphic Slices | `…kGraphicSlices` | Create Slice, rename, remove, export (as image) [B `GraphicSlicePanel`] |

### 4.2 Pages panel (left) [B `PagesMasterPagesPanel`]
> "Use the Pages panel to add blank pages, change page numbering, or apply a different page template to one or more pages of your layout. Pages you have edited manually show colored triangles in the corner to indicate they have overrides." [B]

| Section | Actions (labels [B], commands) |
|---|---|
| **Pages** | Insert Pages (`Page.InsertPages`) · Insert Page Number Change · Insert Page Template Change · Insert Flow Heading Change · Swap with Previous/Next Page · Remove Overrides |
| **Page Templates** (current set) | New / Edit / Rename / Import / Delete Page Template (`Page.CreateMasterPagePairInSet`, `Page.EditMasterPagePair`…). "Each page template consists of a pair of facing pages. Double-click a page template to edit its contents." [B] |
| **Flow Headings** | New / Edit / Rename / Delete Flow Heading |
| **Page Template Sets** | New / Rename / Import / Export / Delete / Duplicate set |

**Editing a page template** opens the master-page editor in place, with a toolbar [B `MasterPageEditorToolbar`]: "Editing Page Template:", "Copy Page Layout: Copy left to right / Copy right to left". You add and position frames there; tokens like `{@projectTitle@}` fill the text frames.
Menu actions: Create Frame Break (⌥⌘F) and Create System Break (⌥⌘S) force pagination; Format Music Frames / Format Systems; Staff Size.
**Engraving Options** (⌘⇧E, Engrave menu) is the project-wide rules dialog (`../options/ENGRAVING_OPTIONS.md`).

---

## 5. Play mode (⌘4): playback and mixing
- **Panels** [H]:
  - Track overview: one track per instrument, plus Time, Chord, Video and Marker tracks [B].
  - Track inspector.
  - VST instruments panel: plug-in rack, endpoint setup.
- **Lower zone:**
  - **Key Editor:** piano roll, velocity, CC lanes, playing techniques, histogram.
  - **Mixer.**
- **Tools:** S = object selection, D = draw, E = erase. Z / X zoom.
- **Transport** (all modes):

  | Key | Action |
  |---|---|
  | Space / numpad Enter | Start or stop |
  | P | Play from the selection |
  | ⇧Space | Play from the last start position |
  | ⌥⇧Space | Play from the start of the flow |
  | numpad 0 | Stop |

  Also record, retrospective record, fixed tempo mode, click/count-in.
- **Playback Options:** `Play.ShowPlaybackOptions` (`../options/PLAYBACK_OPTIONS.md`). **Playback Template** and **Endpoint Setup** dialogs.

---

## 6. Print mode (⌘5 / ⌘P): output (called "Publish" in some versions)

### 6.1 Layouts panel (left) [B `PrintLayoutsPanel`]
> "Select a layout here to see it in the print preview. The layouts selected in this panel will be printed or exported as graphics when you click Print or Export in the print options panel. Change the number of copies to be printed by clicking the + or − buttons. Expand the layout to see its page size and its number of pages, to decide what kind of print job you need." [B]

There are also system-dialog buttons: Page Setup… and Print….

### 6.2 Print Options panel (right) [B `PrintOptionsPanel`]
| Section | Controls (widget → label) |
|---|---|
| **Destination** | `printerToggle` Printer · `graphicsToggle` Graphics; `numCopiesSpinBox` copies; Collate copies; `monoToggle` / `colourToggle`; `transparentBackgroundCheckBox`; `resolutionPopUpMenuButton`; `folderNameLineEdit` + `chooseFolderButton` (Destination folder); File Name Options… |
| **Job Type** | Normal / 2-up / spreads / booklet (from the description [B]); **Print range**: `allPagesToggle`, `pageRangeToggle` + `pageRangesLineEdit`, `flowsToggle` + `chooseFlowsButton`; "Separate file for each flow" |
| **Page Setup** | Paper Size; `portraitToggle` / `landscapeToggle`; final-page orientation; `autoScaleToggle` Fit to Paper / `customScaleToggle` + scale factor; "Print odd final page on" |
| **Duplex Printing** | `duplexTypeCombo`; portrait/landscape paper feed (long edge); "Reverse order of outward pages" |
| **Annotations** | Crop marks; Date and time; Border; `watermarkLineEdit` Watermark Text |
| Action | `printOrExportButton`: **Print** or **Export** depending on destination |

Export shortcuts in the command list: Print Current Page / Layout, Export Current Page / Layout / All Layouts as PDF.

---

## 7. Dialogs: where each opens from
| Dialog | Opened by | Content reference |
|---|---|---|
| Engraving Options | Engrave menu, ⌘⇧E | `../options/ENGRAVING_OPTIONS.md` (55 pages/groups) |
| Layout Options | Setup menu or Layouts panel button, ⌘⇧L | `../options/LAYOUT_OPTIONS.md`. Pages per [H]: Page Setup (size, margins, music-frame margins, page numbers, page template, space size, tokens, flow headings), Players (condensing, cues, figured bass, fingering, harp pedalling, instrument changes, numbered bar regions, tacets), Staves and Systems (casting off, ossias/extra staves, repeat markers, staff labels, system objects), Vertical Spacing (+justification), Note Spacing (+justify final system), Bar Numbers, Markers, Chord Symbols |
| Notation Options | Write menu or Flows panel button, ⌘⇧N | `../options/NOTATION_OPTIONS.md`. Pages [H]: beam grouping, note grouping, condensing, percussion, plus accidentals, rests, voices… |
| Note Input Options | Write menu | `../options/NOTE-INPUT_OPTIONS.md`. Pages [H]: insert mode, musical transformations, notes from chord symbols |
| Playback Options | Play menu | `../options/PLAYBACK_OPTIONS.md`. Pages [H]: dynamics (pitch contour emphasis, polyphonic voice balancing), pedal lines, repeats, timing (arpeggios, grace notes, pauses, rhythmic feel, tremolos), trills |
| Project Info | File menu, ⌘I | per-project and per-flow text fields; feeds `{@tokens@}` |
| Preferences | ⌘, | Pages [H]: General (language, units, paper size, default font, middle C, comments author, crash reporting, warnings, Steinberg ID), Files (autosave), Note Input (properties scope), Play (MIDI recording, playback template, quantization, transport display), Key Commands |
| Library editors | Library menu | 43 dialogs [H dialogs/*]: Paragraph/Character/Font Styles, Music Fonts, Music Symbols, Notehead Sets, Edit Notehead Type, Edit Accidental, Key Signature, Tonality System, Playing Technique appearances, Playback Techniques, Line editor/annotations/bodies, Repeatable symbols, Chord symbol appearance/components/kerning, Chord diagrams, Instrument editor, Instrument families, Score orders, Instrument names, Percussion kit editor & maps, Strings & tuning, Page sizes, Rhythmic feel, Transpose, Invert, Map pitches/scale, MIDI import options, Endpoint setup, Library Manager, Missing fonts, Generate notes from chord symbols |
| QML dialogs | various | `DIALOGS_AND_SCREENS.md`: e.g. Project File Modified (Save As / Rename / Reload / Cancel), Delete Project, Choose Fonts, Reset Sounds, Respell Options, Score Statistics, Rename Project, Comment, Invert/Rotate, Repeat Pitches, Map Pitches |

---

## 8. Typical end-to-end flows (button by button)

**A. New piano piece → printed PDF**
1. Hub → New → choose a template, or empty.
2. Setup: Add Single Player (⇧P) → instrument picker → "Piano" → Add. A full score layout and a piano part layout are created automatically. Flow 1 exists.
3. Write (⌘2): click a bar → Enter (caret) → type ⇧M `3/4` Return, ⇧K `G` Return.
4. Select a duration (6 = crotchet), type pitches A–G. Space advances, ⇧V adds a voice, Esc stops input.
5. Add a dynamic with ⇧D `mf`, a slur with S…⇧S, a tempo with ⇧T `Allegro`.
6. Engrave (⌘3), only if needed: Staff Spacing / Note Spacing to adjust; Pages panel → Insert Page Template Change for the first page.
7. Print (⌘5): select the "Full score" layout → Destination Graphics → PDF → Export.

**B. Add a second movement**
Setup → Add Flow (⇧F). It appears in all layouts that use `flowAcquisitionPolicy 1,1`. Fill in its title in Project Info. A flow heading prints the title in page view.

**C. Make a part look different from the score**
Use ⌥] to switch the tab to the part → Engrave → Graphic Editing → move the item with the Properties scope set to **Locally**. The change is stored with that layout's ID, so the score is unaffected.

**D. Change house style for the whole project**
Engraving Options (⌘⇧E): e.g. Beams › `beamThickness` 1/2 → apply. Every layout re-engraves.

---

## 9. Mapping to your TypeScript editor
| Dorico concept | Suggested app structure |
|---|---|
| Hub | `/` route: create from template, open recent, import MusicXML |
| Project window + modes | `/project/:id/{setup,write,engrave,play,print}`; one shared document store; the mode only swaps side panels and tools |
| Zones | Layout components: `LeftZone`, `RightZone`, `LowerZone` (tabs: properties, piano roll, mixer), `StatusBar`, `Toolbar` with mode tabs |
| Commands | A central command registry (`id`, `params`, `context`, `shortcut`, `run()`); buttons, menus, shortcuts and a command palette (Dorico's jump bar) all dispatch IDs. `COMMANDS.md` is a ready-made list. |
| Contexts | Shortcut contexts like Dorico's: global, setup, write, step-input (caret active), engrave, play, print, text editor |
| Popovers | One input component plus a parser per notation type (clef, key, time, tempo, dynamic, ornament, technique, hold, bar, text, lyrics, chord) |
| Properties panel | Schema-driven inspector for the selection, with a local/global scope toggle that writes layout-scoped overrides |
| Options dialogs | Schema-driven from `../options/*.json` (group → page, option → control by type: bool → checkbox, enum → select, fraction → number in spaces) |
| Print | Layout selection + PDF export (render pages → SVG → PDF) |

---

## Limits
- **Dorico 6 additions** from the newer QML/Swift modules aren't fully covered here: Read mode details, the key editor, mixer, keyboard/fretboard/drum pads, and some library editors (34 areas). Their names and manual links are in `PANELS_AND_BUTTONS.md`.
- **Menus:** the top-level menus and sub-menu titles are exact [B]. The complete item order inside each menu isn't stored as data, so menu actions are listed by command area in `COMMANDS.md` instead.
- **Command names:** 1,190 of the 1,366 command display names are derived from their IDs (marked in italics). 176 are Dorico's own names.
