# UI flows, windows, menus

Sources: Swift type metadata of `MacOS/Suggester 2` (module `Suggester_2`) and `DocumentEditor.framework` (modules `DocumentEditor`, `MRMusicUI`, `MRUtilUI`, `MRSwiftUI`, `MenuBuilder`), C strings, Swift small-string literals decoded from arm64 immediates, and `Localizable.strings`. Type, enum-case and string names are **exact**. How screens connect is **inferred** from those names unless a string states it.

The app is a SwiftUI document app (`SuggesterProApp`, `DocumentRootView`, `SuggesterProReferenceFileDocument`) with an AppKit delegate (`MyNSAppDelegate`). Internally it is still called "SuggesterPro" (`@(#)PROGRAM:DocumentEditor PROJECT:SuggesterPro-1`).

## 1. Scenes and windows

| Scene / window | Swift type (exact) | Content |
|---|---|---|
| Welcome window | `WelcomeView`, `WelcomeWindowPatcher` | App logo (`AppLogo`, `AppIconLarge`, `Clouds` background image), buttons `Create Song` (`[Launcher New Song]`), `Open…` (`[Launcher Open]`), `More…` (`[Launcher More]`). Menu item to reopen it: `Welcome Page`. |
| "More" sheet | `LauncherMoreSheet(prominent, onTools, onSettings, onPurchases, onOnboarding)` | Four entries: Tools, Settings, Purchases, Onboarding (identifiers `More-Tools`, `More-Settings`, `Launcher-More`). |
| Onboarding | `SuggesterOnboardingView` → `MRSwiftUI.OnboardingView(banner, icon, title, onComplete, content)` with `OnboardingCellView(image, title, description)` | Title "Welcome to Suggester 2", 8 cells (below), `Continue`. Animation steps `initial → titleAppears → contentAppears → continueButtonAppears → finished`. Completion stored in `onboardingVersionCompleted`. |
| Document window | `DocumentRootView` → `DocumentEditorView` | The song editor (section 2). |
| Tools window | `SuggesterProToolsView` → `ToolsView` / `ToolsSplitView` / `ToolsSidebarView` | Tools that work without a document: "These tools allow you to query the application without having to create a document." Empty state "Pick a tool from the sidebar." |
| Settings window | `SettingsSplitView` | See SETTINGS.md. |
| Purchases / store | `SuggesterCustomStoreView`, `SuggesterProductView`, `SuggesterPurchaseInvitationView`, `SuggesterStoreExplanationView` | See section 7. |
| AudioUnit view | `AudioUnitExtensionMainView`, `AppExtensionButtons` | The same editor inside a DAW (PLAYER_AND_MIDI.md). |

Onboarding cells (exact en text; fr in `data/strings_app_en_fr.json`):

| # | Title | Text |
|---|---|---|
| 1 | Brilliant chord progressions | This app is a powerful tool for writing songs and chord progressions. |
| 2 | Find chords that work together | Based on the scale you pick, the app will suggest chords. It goes well beyond the diatonic chords! |
| 3 | Classic chord progressions | Take inspiration from well-known progressions of various musical genres. |
| 4 | Chord alterations | Create new chords by changing the chord quality, voicing, bass or by adding or omitting intervals. |
| 5 | Change key like a pro | Make your songs take a new turn. Modulations have never been easier. |
| 6 | Detect chords and scales | Let the app tell you the name of the chord you are playing on the keyboard or the guitar. |
| 7 | Guitar chord diagrams | In guitar mode, chord diagrams are displayed – The app completely changes shape. |
| 8 | Connect with AudioUnit and MIDI | Use Suggester 2 in your favorite DAW by loading it as a plugin or connect it to your piano with MIDI. |

Abort text (exact): "The tutorial gives important information to understand the potential of the app. Are you sure you want to abort?" with `Abort Tutorial`.

Deep links (exact strings): URL scheme `suggester2`, base `suggester2://suggester2/tools/`, query key `scale=`, paths include `tools` and `welcome` (`Suggester2LaunchURL`, `QueryPair(key,value)`). Tools pages: `suggestions`, `scaleDegrees`, `chordDetector`, `melodyScaleDetector`, `fretboard` (`ToolsPage` enum). Siri/App Intent: `ChordSuggestionsIntent(scaleEntity: ScaleEntity{id, scale, title, phoneticTitle, subtitle})`, phrases "Show me / Give me / Find / Make ${applicationName} [for ${scaleEntity}]", tip "With Siri, say \"%@\"", Dock/home shortcut "[Chord Suggestions]".

## 2. Document editor layout

`DocumentEditorView` combines:

| Region | Types (exact) | What it shows / does |
|---|---|---|
| Toolbar | `DocumentEditorToolbarContent(instrumentPickerPresented, exportSheetPresented, onShowSettings, prefix)` | Undo/Redo (`UndoButton`), Play/Pause (`SongPlayButton`, `play.fill`/`pause.fill`), beat/tempo button (`BeatButton` → `BeatView`, `TempoPropertyRow` with tap tempo), instrument (`InstrumentPickerSheet`), playback settings (`PlaybackSettingsButton`), import/export (`ImportExportButton`), settings, chord-modifier button (`ChordModifiersButton`, appearances toolbar/customToolbar/glass/bordered/plain), audio output device (`AudioOutputDeviceButton`), MIDI feedback warning (`MIDIStormProtectorButton`). |
| Song list (centre) | `SongView`, `SongItemsView`, `CustomList` (AppKit `NSTableView` on macOS: `CustomListDataSourceAndDelegate`, `CustomListCoordinator`, `CustomListRow`, pasteboard type `com.mathieurouthier.suggester2.customlist.row`), `SongRowView`, `SongRowBackgroundView(highlighted, beingPlayed)` | One row per song item. Cells: `ChordEventCell` / `ChordEventCellContent` (chord name, Roman numeral, duration, Alter button), `ScaleMarkerCell` (treble clef + scale name), `SectionMarkerCell`, `TextMarkerCell`. Section indicator `SectionIndicatorView`. Drag-and-drop to reorder and to DAWs (MIDI). |
| Song header / scale button | `SongScaleButton(onPickNewScale, onDetectScale)`, `SongEmptyPlaceholder` | `Pick New Scale`, `Detect Scale`, `Transpose Song`, `[Modulation]`. Empty song: "The song is empty." / "The song doesn't have a scale yet." / "Or just start with chords. You can pick a scale later." / `Pick a scale`. |
| Floating toolbar | `SongFloatingToolbar` (`MRSwiftUI.FloatingToolbar`) | Add Text, Add Section Marker, Add Rest, etc. (`textMarkerCreatorPresented`, `sectionMarkerCreatorPresented`). |
| Workspace panel | `WorkspaceView`, `WorkspaceSectionPicker`, `WorkspaceSectionBody`, `WorkspaceSheet` | The tool panel (section 3). Visibility `workspacePanelVisible`; on compact widths it is a sheet. |
| Piano / guitar | `MRMusicUI.PianoView` (`PianoState{keys, sustainKeys, sustainPedalDown}`), `OutputCrossbarPianoView`, `GuitarInstrumentView`, `FretboardView`, `GuitarChordDiagramView` | Shows the playing notes; in guitar/ukulele mode chord diagrams replace keyboard cells (`[GUITAR MODE]` = "GUITAR", `[UKULELE MODE]` = "UKULELE"). |

Song item kinds (exact): `ChordEvent(chord, duration, fineDuration, arpeggiationOverride)`, `ScaleMarker(scale)` (modulation point), `SectionMarker(title, playCount, isCollapsed, colorCode)`, `TextMarker(text)`; rest = chord type `Rest`.

## 3. Workspace sections (the side panel)

`WorkspaceSection` (exact order): `none, suggestions, degrees, borrow, classic, modulation, standard, builder, detector, reader, alter`. `WorkspaceSectionGroup`: `none, scaleRelated, chordRelated, alteration`.

| Case | Label (exact key → en) | View (exact) | What it does |
|---|---|---|---|
| suggestions | `[Chord Suggestions]` → Chord Suggestions | `SelectedScaleSuggestionsView`, `SuggestionsView`, `ChordCollectionView` | Chord palette of the selected scale (THEORY_ENGINE.md §6). Tap = preview, `+`/drag = add (`PickStyle` add/check/none). |
| degrees | `[Degrees]` → Scale Degrees | `DegreesWorkspaceView`, `DegreesView` | Diatonic triads/sevenths per degree. Empty: "Scale degrees are shown here when a scale is selected in the song." |
| borrow | `[Borrowed Chord]` → Borrowed Chord | `BorrowView`, `BorrowHostScaleSelectionView`, `BorrowSuggestionsView` | Pick a related scale, show its chords. |
| classic | `[Classic Progressions]` | `ClassicProgressionsView`, `ClassicProgressionRowView` | Progression list (THEORY_ENGINE.md §11). |
| modulation | `[Modulation]` | `ModulationView` | Pick destination scale; inserts a scale marker. |
| standard | `[Standard Chords]` | `StandardChordsView` | Scale-independent chord catalogue. Button "Show Standard Chords Instead". |
| builder | `[Chord Builder]` | `ChordBuilderWorkspaceView`, `ChordBuilderView`, `ChordBuilderStandardTabView`, `ChordIntervalsFormSections` | Root + chord type + alt bass + voicing + octave + rootless + guitar shape; tabs `standard`/`custom` (custom formula). Buttons `play`, `copy`, `add`. Footer "For additional possibilities, use the [Modifiers](http://modifiers)." Invitation: "Not seeing the chord you want? Use the [Chord Builder](http://builder)." |
| detector | `[Chord Detector]` | `ChordDetectorView`, `KeyboardChordDetectorView`, `GuitarChordDetectorView`, `DetectedChordCell` | Keyboard: "Select notes on the keyboard or play them on the MIDI input." Guitar: "Draw a chord on screen to have it identified." Buttons `Reset Notes`, list `Detected Chords`. |
| reader | `[Chord Reader]` → Text Input | `ChordReaderView` | Type chord names or numerals (THEORY_ENGINE.md §10). |
| alter | `[Alteration]` → Alteration | `AlterationsView`, `AlterationCollectionPage`, `AlterationIntervalsView` | Tabs Qualities / Voicings / AltBass / Intervals for the selected song chord. Empty: "To alter a chord, select it by tapping the 'Alter' button." |

SF Symbols found in the workspace-picker code (exact names, mapping inferred): `heart.fill`, `number`, `hammer.fill`, `shuffle`, `wand.and.stars`, `stethoscope`, `xmark`, `lightbulb.fill`, `books.vertical.fill`, `character.textbox`, `music.note.list`.

Tools window pages (`ToolsPage`, exact): suggestions (`ChordSuggestionsToolView`), scaleDegrees (`ScaleDegreesToolView`), chordDetector (`ChordDetectorToolView`), melodyScaleDetector (`MelodyScaleDetectorToolView` with `MelodyScaleDetectorKeyboardView` and list), fretboard (`FretboardToolView`). Each has a scale selector (`ToolsScaleSelectorView`) and a Siri tip (`ToolsPageSiriTipView`).

## 4. Sheets and dialogs

| Sheet | Type (exact) | Controls |
|---|---|---|
| Scale picker | `ScalePickerSheet`, `ScalePickerView`, `ObservableScale{tab, noteEx, scaleType, customFormula, customTitle}` | Tabs Standard/Custom; piano to pick the tonic (shows scale degree when `showScaleDegreeWhenPickingNote`); scale grid `ScaleCollectionView`/`ScaleView`. |
| Scale detector | `ChordScaleDetectorView`, `MatchedScaleCell`, `ScaleDetectionInvitationView` | Best Matches / All Results from song chords. "No scales have been detected." |
| Chord event parameters | `ChordEventParametersSheet`, `ChordEventParametersButton` | Duration (`Custom Duration`/`CustomDurationSections` with fine duration), arpeggiation override, preview. |
| Section marker editor | `SectionMarkerEditorSheet`, `SectionMarkerEditorView(title, playCount, colorCode)` | Title, play count (`Play Count`), colour (ColorCode: White, Grey, Pink, Red, Orange, Yellow, Green, Teal, Blue, Indigo, Purple). |
| Text marker editor | `TextMarkerEditorSheet` | Text field. |
| Transpose | `TransposeSongSheet`, `TransposeSectionSheet`, `TransposeItemsSheet` | Semitones stepper. |
| Instrument picker | `InstrumentPickerSheet`, `InstrumentPickerView` | Instrument groups by `InstrumentClass` (Keyboard, Guitar, Ukulele). "Pick an instrument". |
| Guitar tuning | `GuitarTuningPickerSheet`, `TuningPickerSheet`, `CustomGuitarTuningSheet`, `CustomGuitarTuningStringView` | Pick or build tuning. |
| Guitar shape picker | `GuitarChordShapePickerView` | Choose a shape for a chord. |
| Chord modifiers | `ChordModifiersView` (popover from `ChordModifiersButton`) | Octave shift, inversion shift, arpeggiation override, rootless — applied to all suggestions. |
| Playback settings | `PlaybackSettingsView` pages `audio`, `arpeggiation`, `humanization` | See PLAYER_AND_MIDI.md. "Some settings cannot be modified during playback." |
| Export | `ExportView`, `ObservableExporter.ExportFormat {text, midi, audio, suggester2}` | `Export as Text...`, `Export as MIDI...`, `Export as Audio...`, `Export Document`. |
| Import | `ObservableImporter{presentedForLegacy, presentedForStandard}` | `Import Document`, `Import Suggester Document` (Suggester 1). Errors `[InvalidDataError]`, `[UnsupportedLegacyDocumentError]`. |
| MIDI storm | `MIDIStormProtectorButton` | "MIDI Feedback was detected" / "The MIDI input was shut down to avoid freezing… feedback loop." `Try Again`. |
| Review prompt | strings `[App Review Question]` etc. | "We hope you like Suggester 2! How is your experience so far?" Good 😄 / Bad 😩 → positive: rating; negative: contact. |
| Tips | `MRSwiftUI.TipInlineView`, `TipPopoverContent`, `TipSheetContent`, `TipMessageView` | e.g. "Drag and drop to a DAW — You can drag chords directly from Suggester to another app that supports MIDI files, such as Logic Pro." |
| Toasts | `MRSwiftUI.Toaster`, `ToastView`, `ToastCapsule` | e.g. `Added`, `Copied`. |

## 5. Song item context menu (macOS: `CustomListContextualMenu`, `SongItemContextualMenuItems`; built with `MenuBuilder`)

Items found together in the menu builder (exact labels; SF Symbol in brackets where it sits next to the label):

- Play from Here [play.fill]
- Alter / Change Timing / Change Duration [square.dashed] / Default
- Transpose... ; Semitone Shift Up / Semitone Shift Down ; Octave Shift Up / Octave Shift Down [arrow.down] ; Invert Upward / Invert Downward ; Set Rootless [circle / circle.slash] ; Set Function ; Set Tuning ; Set Instrument
- Cut Item / Cut Section [scissors] ; Copy Item / Copy Section [doc.on.doc] ; Paste / Paste Above / Paste Below
- Duplicate / Duplicate Item / Duplicate Section [circle.grid.2x1]
- Insert → Section Marker / Text / Rest, Above / Below
- Delete / Delete Item / Delete Items / Delete Section [trash]
- Expand Section [chevron.down]
- Export (single chord as MIDI: `ChordEventMIDIProvider`, `TransferableMIDIChordEvent`)

Undo titles (engine `UndoStack`): `Undo <title>`, `Redo <title>`, with operation titles such as `Move Items`, `Set Scale`, `Set Looping`, `Set Instrument Sound`, `Set Metronome Sound`, `Set Effects`, `Set tempo`, `Set time signature`, `Add Trigger`, `Replace Trigger`, `New Section`, `Update Section`, `Set text`, `Move Item` (exact).

## 6. Main menu (macOS)

SwiftUI `Commands` types found (exact): `ExportCommands(accessControl, settingsModel, doc)`, `UndoRedoCommands` with `UndoCommandActionFocusedValues` / `RedoCommandActionFocusedValues`, `CommandAction(disabled, action)`, `AdditionalScenes` (Tools window, Welcome window).

| Menu | Items (exact labels) | Shortcut |
|---|---|---|
| App | About, Settings… (standard SwiftUI) | ⌘, (system default, inferred) |
| File | New (`Create Song`), Open…, Import Document, Import Suggester Document, Export as Text..., Export as MIDI..., Export as Audio..., Export Song | not determined |
| Edit | Undo, Redo (custom `UndoRedoCommands`), Cut, Copy, Paste, Delete, Duplicate | ⌘Z / ⇧⌘Z (system default, inferred) |
| Window | Welcome Page, Tools | not determined |

Keyboard shortcuts: SwiftUI stores `KeyEquivalent` characters as one-character immediates mixed with other code; they could not be tied to menu items statically. Not determined.

## 7. Purchases (store)

Product identifiers (exact): `com.mathieurouthier.Suggester2.Key.Universal`, `…Key.Universal.Upgrade`, `…Key.iOS`, `…Key.iOS.Upgrade`, `…Key.macOS`, `…Key.macOS.Upgrade`, `com.mathieurouthier.Suggester2.Subscription.Universal.Month`. Swift enum `SuggesterProduct`: fullUnlock, fullUnlockUpgrade, iOSUnlock, iOSUnlockUpgrade, macOSUnlock, macOSUnlockUpgrade, monthlySubscription. Labels: Universal Key, iOS Key, macOS Key, Monthly Subscription, Best Value, "save %d%%", Restore Purchases, Manage Subscriptions, Verify Eligibility (discount for Suggester 1 owners). App group `group.com.mathieurouthier.Suggester`.

Locked features (`SuggesterStoreExplanation.BulletPoint`, exact): AllSections, AllChords, AllScales, CustomChordsAndScales, AllInstruments, AllGuitarTunings, CustomGuitarTunings, AllArpeggioModes, AllVoicings, Special (sections + text blocks), MidiInput, MidiOutput, ExportTextAudioMidi, ExportTextMidiOnly, AudioUnit, FamilySharing. Invitation (exact): "Compose without limits — Unlock now all PRO features." with highlights Advanced chords and scales / All instruments / MIDI connectivity; buttons "See offers" / "Not now". Locked MIDI export writes a demo clip: "!! Demo MIDI clip !! Suggester must be unlocked before real MIDI data can be exported."

## 8. About / links (exact URLs)

https://www.mathieurouthier.com, https://www.mathieurouthier.com/contact, https://www.mathieurouthier.com/suggester2_macos/privacypolicy.html, https://www.apple.com/legal/internet-services/itunes/dev/stdeula/ (terms), https://apps.apple.com/app/id6448964737?action=write-review, https://www.facebook.com/suggesterapp, ChordPadX 2 (id6503992536), ChordShapes (id1570684582).

## 9. Document model

See DOCUMENT_FORMAT.md.
