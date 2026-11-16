# UI flows, windows, menus and Lite gating

Target: Piano Companion 1.6.1028 (build 90), bundle `com.songtive.pianocompanion.lite.osx`, macOS 13.0+.
Sources: decompiled `PianoCompanion.dll` and `PianoCompanion.Engine.OSX.dll` (ilspycmd 11.2), compiled storyboard `Main.storyboardc` and standalone nibs (decoded with a NIBArchive parser).
Visible labels are resolved from `en.lproj/Localizable.strings`. Format below: `key` → "English text".

Evidence tags:
- **exact** — read directly from code or nib. Citation is `Class.Method` or a file.
- **inferred** — my interpretation. Not stated in code.

Machine-readable gating data: `data/gating.json`.

---

## 1. App structure at a glance

| Layer | What | Evidence |
|---|---|---|
| Entry | Storyboard `Main`, entry point `NSWindowController-B8D-0N-5wS` (class `MainWindowController`) | **exact** `Main.storyboardc/Info.plist` |
| Main window | One window. Content = `SplitViewController`: left `NavigationViewController` (source list), right `RightPageViewController` (container) | **exact** `NSWindowController-B8D-0N-5wS.nib`, `SplitViewController.ViewDidLoad` |
| Page switching | `RightPageViewController.ShowView(SubviewType)` performs a custom segue `ReplaceViewSeque` that removes subview 0 and adds the destination view, autoresizing to fill | **exact** `ReplaceViewSeque.Perform` |
| Toolbar | One shared `MainToolbar` (NSToolbar). Rebuilt per page by `ComposeToolbar(ToolbarType)`. User customisation disabled (`AllowsUserCustomization = false`). Starts hidden | **exact** `MainToolbar` ctor |
| Detail pages | Most pages are a 2-pane `NSSplitViewController` (list left, details right), divider style thin (`NSDividerStyle = 2`), vertical divider | **exact** split nibs |
| Startup page | Chords Dictionary is shown and its source-list row selected | **exact** `MainWindowController.WindowDidLoad` |
| Quit | Closing the last window quits the app | **exact** `AppDelegate.ApplicationShouldTerminateAfterLastWindowClosed` returns true |

### Main window size

| Property | Value | Evidence |
|---|---|---|
| Storyboard rect | `{{727, 364.5}, {466, 328}}`, title "Piano Companion" | **exact** window nib |
| Min content size, macOS ≥ 10.14 | 1280 × 738 (also set as initial size) | **exact** `MainWindowController.WindowDidLoad` |
| Min content size, older | 1000 × 600 | **exact** same |

---

## 2. Main menu (menu bar)

Source: `Main.storyboardc/MainMenu.nib`. Titles are replaced at launch by `MenuLocalization.Apply()` using each item's identifier. `{0}` = `CFBundleName` = "Piano Companion". Shortcut column uses macOS notation (⌘ Cmd, ⌥ Option, ⇧ Shift).

| Menu | Item (localised en) | Identifier → string key | Shortcut | Action / target | Evidence |
|---|---|---|---|---|---|
| Piano Companion | About Piano Companion | `menuAbout` → `about_app` | — | `ShowAboutWindow:` → AppDelegate → About window | **exact** |
| | — separator — | | | | **exact** |
| | Settings… | `menuPreferences` → `settings` + "…" | ⌘, | `ShowSettingsWindow:` → AppDelegate → Settings window | **exact** |
| | — separator — | | | | |
| | Services ▸ | `menuServices` → `menu_services` | — | system Services submenu | **exact** |
| | — separator — | | | | |
| | Hide Piano Companion | `menuHideApp` → `menu_hide_app` "Hide {0}" | ⌘H | `hide:` (first responder) | **exact** |
| | Hide Others | `menuHideOthers` → `menu_hide_others` | ⌥⌘H | `hideOtherApplications:` | **exact** (mask 1572864) |
| | Show All | `menuShowAll` → `menu_show_all` | — | `unhideAllApplications:` | **exact** |
| | — separator — | | | | |
| | Quit Piano Companion | `menuQuitApp` → `menu_quit_app` "Quit {0}" | ⌘Q | `terminate:` | **exact** |
| File | Close | `menuClose` → `menu_close` | ⌘W | `performClose:` | **exact** |
| Edit | Undo | `menuUndo` → `menu_undo` | ⌘Z | `undo:` | **exact** |
| | Redo | `menuRedo` → `menu_redo` | ⇧⌘Z (key "Z", mask ⌘) | `redo:` | **exact** |
| | — separator — | | | | |
| | Cut | `menuCut` → `menu_cut` | ⌘X | `cut:` | **exact** |
| | Copy | `menuCopy` → `copy` | ⌘C | `copy:` | **exact** |
| | Paste | `menuPaste` → `menu_paste` | ⌘V | `paste:` | **exact** |
| | Delete | `menuDelete` → `delete` | — | `delete:` | **exact** |
| | Select All | `menuSelectAll` → `menu_select_all` | ⌘A | `selectAll:` | **exact** |
| View | Show Toolbar | `menuShowToolbar` → `menu_show_toolbar` | ⌥⌘T | `toggleToolbarShown:` | **exact** |
| | Customize Toolbar… | `menuCustomizeToolbar` → `menu_customize_toolbar` | — | `runToolbarCustomizationPalette:`; toolbar has customisation off, so it does nothing useful | **exact** action / **inferred** effect |
| Chord Progression (tag 5) | Save | `menuProgressionSave` → `save` | — | `SaveChordProgression:` → `ChordProgressionViewController.HandleMenuItem(0)` | **exact** |
| | Load | `menuProgressionLoad` → `load` | — | `HandleMenuItem(1)` | **exact** |
| | — separator — | | | | |
| | Export to MIDI | `menuProgressionExport` → `export_to_midi` | — | `HandleMenuItem(2)` | **exact** |
| Window | Minimize | `menuMinimize` → `menu_minimize` | ⌘M | `performMiniaturize:` | **exact** |
| | Zoom | `menuZoom` → `menu_zoom` | — | `performZoom:` | **exact** |
| | — separator — | | | | |
| | Bring All to Front | `menuBringAllToFront` → `menu_bring_all_to_front` | — | `arrangeInFront:` | **exact** |
| Help | Piano Companion Help | `menuAppHelp` → `menu_app_help` "{0} Help" | ⌘? | `showHelp:` (standard; no custom help book found) | **exact** action / **inferred** no help book |

Chord Progression menu visibility: set `Hidden = false` in `ChordProgressionViewController.ViewWillAppear`, `Hidden = true` in `ViewWillDisappear` (found by `Tag == 5`). In the nib it is not hidden (`NSIsHidden = false`), so it is visible until the first time the progression page is left. **exact** code / **inferred** first-launch state.

Chord Progression menu actions (all gated by ProgressionsPro, see §9):

| Index | Action | File dialog | Format | Evidence |
|---|---|---|---|---|
| 0 Save | `NSSavePanel`, allowed type `pc`, default name `export` | writes `JsonConvert.SerializeObject(CurrentTrack)` | JSON of `Track` | **exact** `HandleMenuItem` |
| 1 Load | `NSOpenPanel`, type `pc`, single file | `JsonConvert.DeserializeObject<Track>`; on error alert `unexpected_error_message` "Unexpected service error, please try again later." | JSON | **exact** |
| 2 Export | `NSSavePanel`, type `mid`, default `export` | `MidiService.SaveTrack(CurrentTrack)` → `ExportMidi` | Standard MIDI file | **exact** |

---

## 3. Source list (left navigation)

Built in `NavigationViewController.LoadNavigationMenu`. One header item (empty title) containing, in order: **exact**

| # | Title key → en | Icon (`Elements.*`, 30 pt) | Opens (`SubviewType`) | Segue | Toolbar |
|---|---|---|---|---|---|
| 1 | `chord_lookup` → "Chords Dictionary" | `ChordLookup` | `Chords` | `ChordsSeque` | `ChordsName` |
| 2 | `scale_lookup` → "Scales Dictionary" | `ScaleLookup` | `Scales` | `ScalesSeque` | `ScalesName` |
| 3 | `circle_of_fifths` → "Circle of Fifths" | `CircleOfFifths` | `CircleFifths` | `CircleFifthsSeque` | `CircleOfFifths` |
| 4 | `chord_progression` → "Chord Progression" | `ChordProgression` | `ChordProgression` | `ChordProgressionSeque` | `ChordProgression` |
| 5 | `piano` → "Piano" | `Piano` | `Piano` | `PianoSeque` | hidden |
| 6 | `metronome` → "Metronome" | `Metronome` | `Metronome` | `MetronomeSeque` | hidden |
| 7 | `songbook` → "Songs" | `Songbook` | `Songbook` | `SongbookSeque` | hidden |
| 8 | `user_library` → "User Library" (not selectable; has a trailing `Elements.Add(30)` "+" button) | `UserLibrary` | click "+" → `AddNewLibraryModalController` as sheet | — | — |
| 9.. | One row per user library (`SecondaryDataCell`), name = library name | none | `UserLibrary` with that `Library` | `UserLibrarySeque` (or reuse if already shown) | `UserLibrary` |

Notes:
- A `TestSeque` / `TestViewController` exists in the storyboard but has no source-list row. It holds one button "Test Pro"/"Test Lite" that toggles AllInOne on or calls `PaymentService.Reset()`. Debug only, unreachable. **exact** (`TestViewController`, window nib segue list).
- Re-selecting the current page does nothing, except User Library rows always reload. **exact** `NavigationViewController.DisplaySubview`.
- Toolbar visibility per page: **exact** `BaseNSViewController.LoadSubviewToolbar`.

---

## 4. Toolbar items

All items are declared in the window nib with fixed sizes, then inserted per page. **exact** `NSWindowController-B8D-0N-5wS.nib`, `MainToolbar`.

| Identifier | Nib min/max size | Content | Behaviour |
|---|---|---|---|
| `NoteButton` | 94×43 | Title = selected root name | Opens `NotesPopoverController` (transient popover, edge 3) |
| `InversionButton` | 94×43 | Title = `inversion_{n}` ("Root", "1st" … "6th") | Opens `InversionPopoverController` |
| `SearchBar` | 96×22 (NSSearchField) | Text | Fires on every text change; page throttles search 0.5 s |
| `StarButton` | 30×32 | `Elements.Star(14)` filled if `ShowFavouriteScales`, else `StarEmpty(14)` | Toggle favourites filter (ScalesPro) |
| `ScaleLabel` | 46×20 (NSTextField) | Current scale or chord name | Read-only label (Circle of Fifths) |
| `PreferAccidentalButton` | 30×32 | Title "♯" when `PreferSharps` is false, "♭" when true (shows the *other* option) | Toggle `PreferSharps`, relabel circle |
| `PlayStopSegmentControl` | 75×23 | Two segments "▶" and "■" | Play track from selected item / Stop |
| `TempoButton` | (size not in decoded list) | "Tempo: {n} bpm" (`tempo`, `bpm`) | Opens `TempoPopoverController` |
| `DeleteButton` | 30×32 | `Elements.RemoveBin(14)` | Delete selected progression item |
| `AddButton` | 30×32 | `Elements.Plus(14)` | Chord suggester enters add mode |
| `ResetButton` | 30×32 | `Elements.Reset(14)` | Clear the By-Keys keyboard filter |
| `AddToLibraryButton` | 30×32 | Title `add_to_library` "Add to library" | Opens `AddToLibraryModalController` sheet |
| `EditLibraryButton` | 30×32 | `edit_library` "Edit Library" | Opens `AddNewLibraryModalController` in edit mode |
| `DeleteItemButton` | 30×32 | `delete_item` "Delete current item" | Confirm, then remove item |
| `DeleteLibraryButton` | 30×32 | `delete_library` "Delete current library" | Confirm, then remove library |
| `ScaleChordCircleOfFifthsButton` | 40–50×43 | Image `Elements.ScaleLookup(14)`; becomes `ChordLookup(14)` in chord mode | Toggle circle scale/chord mode (ScalesPro) |
| `MidiInButton` | 105×43 | "MIDI IN: On" / "MIDI IN: Off" (`midi_in`, `on`, `off`) | Toggle `Settings.MidiInput` |
| `OpenWindowButton` | 105–150×43 | `open_separate_window` "Open in new window" | Opens current chord or scale in a `DetailsWindow` |
| `Separator`, `Separator1` | 5×30 | Custom separators | — |

Toolbar compositions (`MainToolbar.ComposeToolbar`), "⇔" = flexible space: **exact**

| ToolbarType | Items left → right |
|---|---|
| `ChordsName` | ⇔, NoteButton, InversionButton, ⇔, OpenWindowButton, AddToLibraryButton, SearchBar |
| `ChordsKeys` | ⇔, MidiInButton, ResetButton, ⇔, OpenWindowButton, AddToLibraryButton |
| `ScalesName` | ⇔, NoteButton, StarButton, ⇔, OpenWindowButton, AddToLibraryButton, SearchBar |
| `ScalesKeys` | ⇔, StarButton, MidiInButton, ResetButton, ⇔, OpenWindowButton, AddToLibraryButton |
| `CircleOfFifths` | ⇔, ScaleLabel, ⇔, PreferAccidentalButton, ScaleChordCircleOfFifthsButton, OpenWindowButton |
| `ChordProgression` | ⇔, PlayStopSegmentControl, ⇔, TempoButton, Separator, DeleteButton, Separator1, AddButton |
| `UserLibrary` | ⇔, EditLibraryButton, DeleteLibraryButton, DeleteItemButton, ⇔, OpenWindowButton |

`OpenWindowButton` on the Circle of Fifths page has no handler in `CircleOfFifthsSplitViewController`; it works through the embedded `ChordsDetailsViewController`/`ScalesDetailsViewController` toolbar listeners (they react only when `View.Window == MainWindow`). **exact** listeners / **inferred** combined effect.

---

## 5. Pages

### 5.1 Chords Dictionary

Split `ChordsSplitViewController` (nib `NSSplitViewController-amh-PD-254`): left `ChordsViewController`, right `ChordsDetailsViewController`. Selection change → `LoadChordDetails`. **exact**

Left pane `ChordsViewController`: **exact**

| Control | Values | Behaviour |
|---|---|---|
| `ChordTypeSegmentedControl` | 5 labels set: `all` "All", `maj` "Maj", `min` "Min", `dim` "Dim", `aug` "Aug" (code also maps segments 5–8 to Sevenths, Ninths, Elevenths, Thirteenths) | Sets `ChordsFilterMode`, reloads |
| `SortTypeSegmentedControl` | `by_name` "By Name", `by_keys` "By Keys" | By Keys shows the filter keyboard, label "Touch piano key to start filtering." (`touch_piano_key_to_start_filtering`), toolbar → `ChordsKeys`. By Name hides it, toolbar → `ChordsName`. Clears the filter. Analytics `chords_filter_type_changed` |
| Filter keyboard `PianoKeyboardFilter` | Click keys | Search after 1.0 s throttle. Lite: >2 keys → lite alert |
| MIDI notes | If By Keys active | `HandleMidiKey` + 1.0 s throttled search (no lite check) |
| Collection | Flow layout item 150×100, insets T10 L10 B10 R20, spacing 10/10, `FitItemsToWidth(130)`; cell `GeneralItemController` | Click selects; drag ≥25 pt out exports MIDI file (AllInOne) |
| Progress spinner | Shown while repopulating | — |
| Auto-select | If `AutoSelectFirstItem`, select index 0 (or keep previous index) | — |

Data source logic (`FillDataSourceWithFilters`): By Keys → `findChordByFormulaPart(selectedNotes, mode, IsStrictSearch, ChordsPro && !ReverseModeWithoutInversions)`. Else with search text → `FindChordsByName(text, inversion, root, mode, allowSlashInversion: ChordsPro)`. Else → `FindChords(root, inversion, mode)`. **exact**

Toolbar handlers: Search (0.5 s throttle), Note popover (root saved to `LastRootSemitoneForChords`), Inversion popover, Reset, Add to library (`LibraryItem(ChordSymbols.Name(chord), chord)`), MIDI IN toggle. **exact**

Right pane `ChordsDetailsViewController` — table rows in order: **exact** `InitializeTable`

| # | Row | Content |
|---|---|---|
| 1 | Header | Chord name with long name (`ChordLabels.NameWithLongName`) |
| 2 | `ChordIntervalsPanel` | Intervals |
| 3 | `StyledStringPanel` "Group" (`group`) | Localised group name |
| (3a) | `AppRaterPanel` | Inserted after Group when `AppRater.DoAction` allows |
| 4 | Header "Play Panel" (`play_panel`) | — |
| 5 | `PlayPanel` | Octave segmented 2–6, Loop switch, Arpeggio switch |
| 6 | Header "Staff" | — |
| 7 | `StaffPanel` mode Both | Treble + bass |
| 8 | Header "Keyboard" | — |
| 9 | `PianoKeyboardLarge` | Chord keys + note labels + fingering |
| 10 | "Left Hand" (`fingering_l`) | Fingering or "..." |
| 11 | "Right Hand" (`fingering_r`) | Fingering or "..." |
| 12 | Header "Sounds great with" (`sounds_great_with`) | — |
| 13 | `CompanionChordsPanel` | Successor chords with voicings (`ChordSuccessors.AfterVoiced`). Click a chord → reload details with it. Lite: 3 faded + Unlock → paywall |

On load: plays the chord unless `DontPlayChords` (arpeggio if `PlayChordArpeggio`) at `PreviewOctave` (default 4). Analytics `show_chord`. **exact**

### 5.2 Scales Dictionary

Split `ScalesSplitViewController` (`NSSplitViewController-Dnc-n4-9a0`). **exact**

Left `ScalesViewController`: same layout as chords (150×100 items, 130 min width), `SortTypeSegmentedControl` By Name / By Keys, filter keyboard (lite >2 keys alert), MIDI. No chord-type segment. Data: By Keys → `findScaleByFormulaPart(notes, ShowOnlyPopularScales, ShowFavouriteScales, ...)`; otherwise favourites, popular or all scales filtered by search text, note count and tags. Toolbar: Note popover (`LastRootSemitoneForScales`), Star, Search, Reset, Add to library, MIDI IN. **exact**

Right `ScalesDetailsViewController` rows: **exact** `InitializeTable`

| # | Row |
|---|---|
| 1 | Header "Details" |
| 2 | "Name" panel (localised full name) |
| 3 | `ScaleIntervalsPanel` |
| 4 | Checkbox "Favourites" → `AddRemoveFavouriteScale` (no lite check here) |
| (4a) | `AppRaterPanel` after Favourites |
| 5 | Header "Chords" |
| 6 | `ScaleChordsCollectionPanel` with group popup: Common Chords, Secondary Dominant, Secondary Leading Tone, Parallel Mode. Click a chord's right icon → `ChordsDetailsViewController` in a transient popover (edge 2). Lite: first 3 chords faded + Unlock |
| 7 | Header "Staff" |
| 8 | `StaffPanel` Normal (treble) |
| 9 | `StaffPanel` Bass |
| 10 | Header "Play Panel" |
| 11 | `PlayPanel` (arpeggio switch hidden for scales) |
| 12 | Header "Keyboard" |
| 13 | `PianoKeyboardLarge` with user fingering (`GetUserFingeringForScaleAndSemitone`) |
| 14–15 | Left Hand / Right Hand fingering |
| 16 | Header "Relative" (`relative_scales`) |
| 17 | `RelativeScalesCollectionView`; click → another `ScalesDetailsViewController` in a popover |

On load plays the scale as arpeggio unless `DontPlayScales`. **exact**

### 5.3 Circle of Fifths

Split `CircleOfFifthsSplitViewController` (`NSSplitViewController-yGX-p6-uUi`): left `CircleOfFifthsViewController` (holds `CircleOfFifhtsView`, square = min(w,h) − 20, centred), right `UserLibraryDetailsViewController` (shows either chord or scale details). **exact**

Initial state: C major scale and C major chord (chord id 10). **exact** `ViewWillAppear`.

Mouse interaction (`CircleOfFifhtsView.MouseDown/MouseDragged`): **exact**

| Hit zone (radius r from centre) | Result |
|---|---|
| r < R1 | ignored |
| R1 ≤ r < R2 | minor ring: selects natural-minor scale of that segment (unless frozen), raises `Selected` with `IsMajor=false` |
| R2 ≤ r < R3 | major ring: selects major scale, `IsMajor=true` |
| r ≥ R3 | outer ring: state SHIFT; dragging rotates the wheel (`top` offset) |

Segment = `(atan2(x, −y) · 6/π + 12.5) mod 12`. Radii values: see COMPONENTS file (not my scope).

Modes: scale mode (default) → details pane shows scale, toolbar label = scale name. Chord mode (toolbar button, ScalesPro) → wheel frozen (`IsFrozen`), details show the clicked chord. Accidental button toggles `PreferSharps` and re-labels the wheel. **exact**

### 5.4 Chord Progression

Split `ChordProgressionSplitViewController` (`NSSplitViewController-kIe-E1-riP`): left `ChordProgressionViewController`, right `ChordSuggesterViewController`. **exact**

Left pane: **exact**
- `CurrentScaleView` at top. Click → `ChooseScalePopoverController` (transient, edge 1). It lists header "Selected Scale", Root selector, Scale dropdown, header "Detected Scales" with each compatible scale and a match percentage (`FindCompatibleScalesForTrack`, weight × 100 %). Clicking a detected scale applies it; closing the popover applies dropdown + root.
- `ChordProgressionDragView`: 4 pt corner, 2 pt border, `Elements.BlockMove(70)` icon at 70 % size. Drag → whole track as MIDI file (AllInOne).
- Track collection: item 150×100, cell `TrackItemCellController`. Shows root+octave, quality + long name (+ inversion), right black strip with rotated text "{roman} · {duration} ✕ {repeats}" (Times New Roman 12, white), border colour from scale position. Selected background RGBA(170,170,170,170).
- Song is loaded with `SongService.LoadLastSong()` and saved on leave (`SaveLastSong`).

Toolbar actions: Play (from selected item) / Stop, Tempo popover (20–300), Delete selected item, Add (suggester shows chord grid). **exact**

Right pane `ChordSuggesterViewController` has two states: **exact**
- **Add mode** (chord grid): sections from `ScaleService.GenerateChordList(scale)`; items 150×80, cell `ScaleChordItem` with "+" icon. Click "+" → `AddNewItem(chord)` (lite: max 4 items) and `PrepareTrackItem(previous, new)`.
- **Item mode** (after selecting a track item): table rows — Duration (1–32), Repeats (1–32), header Details, Root selector, Bass selector, Inversion (0–6, labels "No", "1st"…"6th"; unsupported → alert `inversion_is_not_supported`), Octave (1–7), Chord (opens chord details popover, height ×2), checkbox "Play as Arpeggio", header Staff + staff, header Keyboard + keyboard.

Switching: Add toolbar button or changing the base scale → add mode; selecting a track item → item mode. **exact** `ChordProgressionSplitViewController.ViewDidLoad`.

### 5.5 Piano

`PianoViewController` (toolbar hidden). Two `PianoRollView`s (second only in dual mode, each half height) and a black 38 pt `PianoToolbarView` at the top. **exact**

Piano toolbar buttons, right-aligned, built by `PianoToolbarView.Rebuild` in this order: **exact**

| Button | Shown when | Action |
|---|---|---|
| − (`Elements.Minus(18)`) | always | Fewer keys: ladder {7, 10, 12, 14, 21}, start 10 |
| + (`Elements.Plus(18)`) | always | More keys |
| "Instrument" (text) | always | Pop-up menu of 9 instruments (checkmark on current): Grand Piano (0), Bright Piano (1), Vibraphone (11), Marimba (12), Xylophone (13), Steel Guitar (25), Cello (42), Synth Strings (50), Synth Voice (54) |
| Settings gear (white) | always | `PianoSettingsModalController` sheet |
| Record ● (RGB 255,59,48) / Stop ■ red | Record when idle, Stop while recording | Start/stop `NoteRecorder` |
| "Load" | saved recordings exist and not playing | `PianoRecordsModalController` sheet |
| Play ▶ / Stop ■ | recording has notes | Preview playback |
| "Clear", "Save" | has notes and not playing | Clear notes / name prompt then save |

Save flow: NSAlert with 260×24 text field (placeholder "Name"), OK/Cancel; empty name → "Piano"; existing name → confirm `overwrite_record` "Overwrite record {0}?" (Yes/No). **exact**

Piano settings sheet (380 pt wide, rows 28 pt, gap 10): checkbox "Show notes", checkbox "Dual keyboard enabled", bold header "Dual keyboard settings", "First octave" and "Second octave" steppers 1–7 (disabled and alpha 0.4 unless dual), Cancel / OK (Return). **exact** `PianoSettingsModalController`.

Recordings sheet 420×340: title "Load", table rows 34 pt (name 13 pt + date 10 pt), buttons Delete (x 16), Cancel (x 194), Load (x 304, Return). Double-click loads. Delete confirms with Yes/No. **exact** `PianoRecordsModalController`.

### 5.6 Metronome

`MetronomeViewController` (toolbar hidden), flipped layout, margin 24. Rows top to bottom: **exact**

| Element | Detail |
|---|---|
| BPM label | System 56 bold, centred |
| Tempo mark | System 15, secondary colour; `TempoMarks.MarkFor(bpm)` |
| Beat dots | Active colour RGB(239,108,0) |
| Cross dots + ratio | Teal, only when cross-rhythm ≥ 2 |
| − / slider / + | Slider 30–250, ±1 buttons 36×26 |
| Quick BPM segmented | 60, 90, 120, 140, 180 |
| Beats per bar | Stepper 1–12 |
| Subdivision | Popup Quarter / Eighth / Triplets / Sixteenth; title gets " ▸ PRO" if not entitled |
| Cross-rhythm | Popup Off, 2…9; " ▸ PRO" |
| Presets | Popup (first item "Presets" or "No presets yet. Dial in a tempo and save it."), "Save current", "✕" delete; " ▸ PRO"; max 20 ("You can keep up to {0} presets.") |
| Start / Stop | 40 pt tall, Return key, semibold 16 |

Tempo marks (`TempoMarks.Table`): Largo 40–60, Larghetto 60–66, Adagio 66–76, Andante 76–108, Moderato 108–120, Allegro 120–156, Vivace 156–176, Presto 176–200; else ≤200 "Grave", >200 "Prestissimo". First matching row wins (so 60 → Largo). **exact**

### 5.7 Songs (Songbook)

Split `SongbookSplitViewController` (`NSSplitViewController-Sbk-01-vcC`): left list, right viewer. **exact**

List `SongbookListViewController`: **exact**
- Seeds a sample song once (`SongSheetSeeder.SeedIfNeeded`).
- Search field "Search songs" (filters title or author, case-insensitive), button "New song", table rows 62 pt sorted by `ModifiedAt` descending, empty label "No songs yet — tap "New song" to write one".
- Row context menu: Edit, Duplicate, Share as PDF, —, Delete (confirm "Delete "{0}"?").
- New song → title "Untitled song", opens editor. Free cap: 2 songs.

Viewer `SongbookViewerViewController`: buttons Loop (toggle, saved in key `songbook_loop` "1"/"0"), Play/Stop, "•••" overflow. Overflow menu: Tempo (popover 30–200), Auto-scroll / Stop auto-scroll (speed popover 1–10), Show diagrams / Show chord names, —, Edit, Share as PDF, Print, Export MIDI. While playing or auto-scrolling, display sleep is blocked ("Songbook perform mode"). The highlighted chord block is scrolled to one third from the top. **exact**

Editor `SongbookEditorWindowController` — separate window 620×560 (titled, closable, resizable), one per song (re-opening focuses it), saves on every change and on close. Structure: meta row (title bold 15, "Words & Music by {0} · key · N BPM · N/4", "Details" button → `SongbookDetailsSheet` 380×260 with Title, Author, Date, Key (— = none), Tempo, Beats per bar, Save/Cancel), then per section: editable label (placeholder "Section (e.g. Verse 1)") + "⋯" menu (Duplicate section, Copy section, Paste section, —, Delete section), lyric lines with chord lanes, "+ Add line", and finally "+ Add section" (menu: Paste section, Intro, Verse 1, Verse 2, Pre-Chorus, Chorus, Bridge, Solo, Outro, —, Custom…). Line menu: Add chord, Insert progression…, —, Insert line above, Insert line below, Duplicate line, Copy line, Paste line below, —, Delete. Chord chip menu: Change chord, Beats per bar ▸ (Default (n), 1, 2, 3, 4, 6, 8, 12, 16), —, Delete. Add-row tint RGB(253, 187, 43). **exact**

Chord chooser popover 300×340: "Recent chords" buttons (wrap at 290), "Chords Dictionary" root popup + type table, "Add chord" (Return). Progression chooser 300×300: "My progressions" list of saved songs, "Insert progression" button. **exact**

### 5.8 User Library

Split `UserLibrarySplitViewController` (`NSSplitViewController-cww-6s-SrN`): left `UserLibraryViewController` (same 150×100 grid; items are chords or scales re-formatted from stored id + root + inversion), right `UserLibraryDetailsViewController` (hosts hidden chord and scale detail controllers and shows the right one). **exact**

| Action | UI | Evidence |
|---|---|---|
| New library | Source-list "+" → sheet: header "New Library", label "Library Name", text field, Save, Cancel. Empty name ignored | **exact** `AddNewLibraryModalController` |
| Edit library | Toolbar → same sheet, header "Edit Library", pre-filled | **exact** |
| Add item | Toolbar on Chords/Scales → sheet: "Library" combo (10 visible, first selected), Save, Cancel | **exact** `AddToLibraryModalController` |
| Delete item | Warning alert "Are you sure?" OK/Cancel | **exact** |
| Delete library | Same alert; reloads source list | **exact** |

---

## 6. Popovers (all `NSPopoverBehavior.Transient`)

| Popover | Size | Content | Evidence |
|---|---|---|---|
| Notes | 300×240 | 12 on/off buttons, 3 columns, 40 pt tall, 10 pt gaps; flat/sharp segmented (♭ default) switches the name set | **exact** `NotesPopoverController` |
| Inversion | 200×320 | Label "Choose inversion" + 7 buttons ("Root", "1st" … "6th"), 40 pt tall | **exact** `InversionPopoverController` |
| Tempo | nib size | `NumericPanel` "Tempo" 20–300 | **exact** `TempoPopoverController` |
| Choose scale | nib size | See §5.4 | **exact** |
| Chord details | parent view frame (progression: height ×2) | Full `ChordsDetailsViewController` | **exact** |
| Scale details | parent frame | Full `ScalesDetailsViewController` | **exact** |
| Songbook numeric | 240×90 | `NumericPanel` | **exact** |

Before presenting any popover, `BaseNSViewController.PresentViewController` dismisses all others. **exact**

---

## 7. Secondary windows

| Window | Opened by | Size / style | Content | Evidence |
|---|---|---|---|---|
| About | Menu "About Piano Companion" (reused instance) | 400×270, style mask 7 (titled, closable, miniaturizable) | App icon, `CFBundleName`, copyright "Songtive (c) 2021", "Version {CFBundleShortVersionString} ({CFBundleVersion})" = "Version 1.6.1028 (90)", link "http://pianocompanion.info" → opens `http://pianocompanion.info?utm_source=pianocompanion-osx&utm_medium=mainmenu&utm_campaign=pianocompanion` | **exact** `AboutWindowController`, `AboutWindow.nib`, Info.plist |
| Settings | ⌘, (always recreated; closes the old one) | 511×511, style 15 (resizable) | Sections: Language (Language combo of 42 locales, Music Notation combo with example, "Translate chord & scale names", restart note), Chords / Scales (Excludes inversions from Reverse Lookup, Strict Search, Always select the first item), Sound (Suppress Sound, Don't play chords, Don't play scales), MIDI (MIDI Input, MIDI Output). Saved on close; if language or translate flag changed → alert "NOTE: you have to restart the app to apply language changes." | **exact** `SettingsWindowController`, `SettingsWindow.nib` |
| Details | Toolbar "Open in new window"; Chord-of-the-day notification or URL | Chord: 700×700; scale: 700×900; style 15; title = chord/scale name | Full chord or scale details controller | **exact** `DetailsWindowController` |
| Songbook editor | Songs page | 620×560 | §5.7 | **exact** |
| Paywall | Lite alert "Buy", Unlock buttons | 470×680, titled+closable, centred 40 pt below centre | §8 | **exact** |

Settings languages, in order: en, en-GB, es, fr, de, it, ru, ko, zh-Hans, zh-Hant, ja, pt-BR, pt-PT, da, no, nl, ar, hi, bg, ca, hr, cs, en-AU, et, fi, el, he, hu, id, lv, lt, ms, pl, ro, sr, sk, sl, sv, th, tr, uk, vi. **exact** `SettingsWindowController.Languages`.

---

## 8. Paywall (`PaymentModalController`)

Shown as a modal window. Layout top to bottom, content width 90 % of 470: **exact**

| Block | Detail |
|---|---|
| Background | `purchase_bg.jpeg` stretched + black scrim alpha 102/255 |
| Badges (3) | White, radius 8, 1 pt border RGB(200,200,200), laurels `leaf-left.png`/`leaf-right.png`, bold 12 black: "App of\nthe Day", "Rating\n★ 4.7", "5M+\nUsers"; 44 pt tall |
| Title | "Unlock Pro Features", bold 20 white |
| Carousel | 124 pt pager, interleaves 5 features and 7 reviews (12 pages). Auto-advance every 4.5 s; tween 12 steps × 0.02 s (≈0.24 s) ease-in-out-quad; dots 8 pt (spacing 6), active RGB(253,187,43), idle RGB(200,200,200); dots are clickable |
| Features | "What Chord Is That?" / "Every Inversion, Every Extension" / "10,000+ Scales & Modes" / "Progressions That Fit the Key" / "Interactive Circle of Fifths" (descriptions in `pro_feat_*_desc`) |
| Reviews | ★★★★★ (RGB 255,162,26) + italic quote + "— Name": Sarah, Alex, Marcus, Ji-hye, Tom, Priya, Jamie |
| Product cards | Yearly (tall 80, trial line "{n} days free trial" + "cancel anytime", price "{0} / year", sub-line "{0} / week" = price/52), Weekly (56, "{0} / week"), Lifetime (56, formatted price). Radio circle 22 pt. Selected: border 2.5 pt accent, filled radio |
| Save badge | Over yearly card: "SAVE {0}%", where % = round((weekly×52 − yearly)/(weekly×52)×100); hidden if ≤ 0 |
| Bottom bar | Billed amount (bold 20), CTA (accent fill, radius 10, 46 pt, bold 17 shrinking to 11): "Continue" for subscriptions, "Unlock Forever | {price}" for lifetime; detail line: lifetime "One-time payment", trial "{n} day(s) free, then {price}. Cancel anytime.", else "Subscription auto-renews • cancel anytime" |
| Footer | "Privacy Policy" • "Restore Purchases" • "Terms of Use" (11 pt). If too wide, Restore moves to a second line |

Default selection: Yearly, else Weekly, else Lifetime. Clicking an unselected card selects it; clicking the selected card buys. **exact** `OnCardClick`.

Links: privacy `https://www.songtive.com/pages/privacy?utm_source=pianocompanion-osx&utm_medium=products&utm_campaign=privacy_policy`; terms `https://www.songtive.com/pages/terms-of-use?utm_source=pianocompanion-osx&utm_medium=products&utm_campaign=terms_of_use`. **exact**

Errors: product list empty or connection error → alert "Can't retrieve products. Check your network or try again." User-cancel is silent. After a successful purchase the paywall closes and `RefreshAction` re-renders the calling page. Restore → "Purchases have been restored." or "Failed to restore purchases. See FAQ or contact us: support@songtive.com". **exact**

---

## 9. Lite vs paid gating

Lite = any bundle id other than `com.binitex.pianocompanion`. This app (`…lite.osx`) is Lite. **exact** `Settings.IsLite`.

The standard lock UI is an informational sheet: "This feature is not available for LITE version." with **OK** and **Buy** (Buy → paywall). **exact** `BaseNSViewController.CheckWarnIfLite`.

| Area | Locked feature | Needs | Free behaviour | Evidence |
|---|---|---|---|---|
| Chords Dictionary | Non-root inversion from Inversion popover | ChordsPro | Alert, reset to Root | **exact** |
| Chords By Keys | Clicking a 3rd+ key | ChordsPro | Alert, no search | **exact** |
| Chords By Keys | Inversions in reverse results | ChordsPro | Excluded | **exact** |
| Chords search | Slash-chord inversions (C/E) | ChordsPro | Not matched | **exact** |
| Chord details | "Sounds great with" list | ChordsPro | 3 chords at alpha 1 / 0.5 / 0.25 + Unlock | **exact** |
| Scales By Keys | 3rd+ key | ScalesPro | Alert, no search | **exact** |
| Scales | Favourites filter (star) | ScalesPro | Alert | **exact** |
| Scale details | Chords-in-scale list | ScalesPro | 3 chords at alpha 1 / 0.55 / 0.10 + Unlock | **exact** |
| Circle of Fifths | Chord mode | ScalesPro | Alert | **exact** |
| Progression | Save / Load / Export MIDI | ProgressionsPro | Alert | **exact** |
| Progression | 5th chord and more | ProgressionsPro | Max 4 chords | **exact** |
| Songs | 3rd song (new or duplicate) | ProgressionsPro | Max 2 songs | **exact** |
| Songs | PDF share, Print, MIDI export | ProgressionsPro | Alert | **exact** |
| Everywhere | Drag chord/progression out as MIDI | AllInOne | Alert | **exact** |
| Metronome | Subdivision > quarter, cross-rhythm, presets | AllInOne | " ▸ PRO" labels, alert | **exact** |

Not gated (free): Piano page (record, save, load, instruments, dual keyboard), metronome BPM/beats, user libraries, favourites checkbox in scale details, relative scales, circle of fifths scale mode, chord-of-the-day notification, MIDI input/output toggles. **exact** (no check found in those code paths).

Loophole: MIDI-input notes in By Keys mode are searched without the >2-note check. **exact** `ChordsViewController.HandleNoteChanged`, `ScalesViewController.HandleNoteChanged`.

Entitlement mapping: all three current products (1y, 1w, lifetime) grant AllInOne; four legacy non-consumables grant single flags. **exact** `PaymentService.ProductIdToType`. Full list in `data/gating.json`.

`PianoTeaser` (5 free chords per day, 3 locked pills per day) exists in the engine but has no macOS call site. **exact** (grep) / **inferred** that it serves the mobile app.

---

## 10. Other flows

| Flow | Detail | Evidence |
|---|---|---|
| App rater banner | Orange panel RGB(243,152,18), 90 pt, inside chord/scale details. Steps: "We need your help! Is Piano Companion useful for you?" (Yes! / No) → Yes: "Please rate us! …" (Rate / No, thanks); No: "Would you mind giving us feedback?" (Yes! / No, thanks). Ready when ≥1 day since this version's first launch, ≥2 launches of this version, and 10 detail views have been counted down. Re-show delays: 7 days after a missed show, 30 days after "No, thanks", 60 days after Rate or Feedback | **exact** `AppRaterPanel`, `Songtive.Services.AppRater` |
| Day-1 reminder | On launch, asks notification permission (Sound + Alert) if undetermined, then schedules one notification 86 400 s later: title "Today's chord: {0}", body "30 seconds. Tap to hear it and see what sounds great with it." Tapping opens the chord in a Details window | **exact** `RetentionReminders`, `AppDelegate.ChordOfTheDayNotificationDelegate` |
| URL scheme | `pianocompanion://cotd?cotd_chord_id=…&cotd_root=…&cotd_source=…&cotd_day=…&cotd_slot=…` opens that chord in a Details window | **exact** Info.plist `CFBundleURLTypes`, `ChordOfTheDayLink.Parse`, `AppDelegate.OpenUrls` |
| Analytics page views | chords, scales, circle_of_fifths, progressions, piano, piano_settings, piano_records, metronome, songbook, songbook_viewer, songbook_editor, user_library | **exact** `Analytics.TrackView` calls |
| Startup services | 100 small keyboards pre-pooled (`ObjectPool<PianoKeyboardSmall>.Generate(100)`) | **exact** `AppDelegate.InitServices` |

---

## 11. Storyboard scene map

| Nib | Class(es) | Role |
|---|---|---|
| `NSWindowController-B8D-0N-5wS` | MainWindowController, MainToolbar, NavigationViewController, RightPageViewController | Main window, toolbar, segues |
| `NSSplitViewController-amh-PD-254` | ChordsSplitViewController, ChordsViewController, ChordsDetailsViewController | Chords |
| `NSSplitViewController-Dnc-n4-9a0` | ScalesSplitViewController, ScalesViewController, ScalesDetailsViewController | Scales |
| `NSSplitViewController-yGX-p6-uUi` | CircleOfFifthsSplitViewController, CircleOfFifthsViewController, UserLibraryDetailsViewController | Circle |
| `NSSplitViewController-kIe-E1-riP` | ChordProgressionSplitViewController, ChordProgressionViewController, ChordSuggesterViewController | Progression |
| `NSSplitViewController-Sbk-01-vcC` | SongbookSplitViewController, SongbookListViewController, SongbookViewerViewController | Songs |
| `NSSplitViewController-cww-6s-SrN` | UserLibrarySplitViewController, UserLibraryViewController, UserLibraryDetailsViewController | Library |
| `NSViewController-InM-5s-6bV` | TestViewController | Unreachable debug page |
| `PianoViewController`, `MetronomeViewController` | — | Single pages |
| `ChordsDetailsViewController`, `ScalesDetailsViewController` | — | Instantiated by id for popovers and windows |
| `NotesPopoverController`, `InversionPopoverController`, `TempoPopoverController`, `ChooseScalePopoverController` | — | Popovers |
| `AddNewLibraryModalController`, `AddToLibraryModalController`, `PaymentModalController`, `PianoSettingsModalController`, `PianoRecordsModalController` | — | Sheets / modal |
| `TuL-zN-1mL-…` | SourceListView | Navigation outline |
| Standalone: `AboutWindow.nib`, `SettingsWindow.nib`, `DetailsWindow.nib`, `GeneralItemController.nib`, `ChordSuggesterItemController.nib`, `RelativeScaleItemController.nib`, `TrackItemCellController.nib` | — | Windows and collection cells |

---

## 12. What could not be determined

- Exact pixel layout inside nib-designed views (e.g. Settings window control frames): the nibs were decoded for classes, titles and window rects only. Readable with the same parser if needed.
- Runtime look of the toolbar `TempoButton` size and the `SourceListView` row heights: not extracted.
- Whether StoreKit returns subscriptions to `GetPurchasesAsync(InAppPurchase)` during Restore: platform behaviour, not visible statically.
- Whether "Customize Toolbar…" shows an empty palette or nothing: depends on AppKit at runtime.
