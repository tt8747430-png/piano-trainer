# Dorico 6.2 command catalogue: 1366 commands

Every action in Dorico (menu item, toolbar or panel button, popover, shortcut) runs a **command**. This is every command ID found in the Dorico 6.2 binary, plus the default key-command files.

- **Name:** Dorico's display name, taken from its shortcut mapper (normal text), or *derived from the ID* (italics).
- **Shortcut:** the macOS default (`Ctrl` = ⌘), with the context in brackets.
- **Panel:** the UI area whose buttons trigger the command (help ID, see `PANELS_AND_BUTTONS.md`).
- **Parameters:** `?Param=Value` is the same command with a preset argument, e.g. `Window.SwitchMode?WindowMode=kWriteMode`.

| Area | What it covers | Count |
|---|---|---|
| [Edit](#edit) | Edit menu actions on the selection (create/modify notations, properties) | 243 |
| [NoteInput](#noteinput) | Note input (caret, durations, pitches, voices, tuplets, chords) | 232 |
| [Play](#play) | Playback, transport, key editor, mixer, VST | 143 |
| [Project](#project) | Project structure: players, instruments, flows, layouts, libraries | 122 |
| [EventEdit](#eventedit) | Selection navigation and editing of events in the score | 113 |
| [Filter](#filter) | Edit › Filter: select only/deselect by item type | 96 |
| [Page](#page) | Engrave mode pages, page templates, frames, flow headings | 79 |
| [View](#view) | View menu: zoom, view types, signposts, colours | 69 |
| [Window](#window) | Modes, zones/panels, tabs, windows, layouts switching | 69 |
| [Engrave](#engrave) | Engrave menu: fonts, styles, formatting | 41 |
| [File](#file) | File menu: new/open/save/import/export | 29 |
| [NoteEdit](#noteedit) | Note editing (pitch/rhythm edits) | 19 |
| [Application](#application) | Preferences, account, app-level | 18 |
| [Print](#print) | Print/Publish mode actions | 17 |
| [TextEditor](#texteditor) | Rich text editor | 13 |
| [MusicalManipulation](#musicalmanipulation) | Write › Transform: invert, retrograde, rotate, map… | 12 |
| [Setup](#setup) | Setup mode list editing | 10 |
| [Help](#help) | Help menu | 7 |
| [ScoreInfo](#scoreinfo) | Project info | 7 |
| [UI](#ui) | UI helpers | 7 |
| [Script](#script) | Script menu | 6 |
| [OptionsDialog](#optionsdialog) | Options dialogs | 5 |
| [Video](#video) | Video | 5 |
| [JumpBar](#jumpbar) | Jump bar | 2 |
| [ScrubPlayback](#scrubplayback) | Scrub playback | 2 |

## Edit

Edit menu actions on the selection (create/modify notations, properties)

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `Edit.AddAngledLineToOttavaLine` | *Add Angled Line To Ottava Line* |  |  |
| `Edit.AddBarNumberChange` | *Add Bar Number Change* |  |  |
| `Edit.AddBarNumbersToSelection` | *Add Bar Numbers To Selection* |  |  |
| `Edit.AddChordSymbolsToSelection` | *Add Chord Symbols To Selection* |  |  |
| `Edit.AddCornerToOttavaLine` | *Add Corner To Ottava Line* |  |  |
| `Edit.AddDivisi` | *Add Divisi* |  |  |
| `Edit.AddGuitarTechnique` | *Add Guitar Technique* |  |  |
| `Edit.AddInstrumentsToPercussionKitInPlayer` | *Add Instruments To Percussion Kit In Player* |  |  |
| `Edit.AddKitComponentInstrumentToKitInPlayer` | *Add Kit Component Instrument To Kit In Player* |  |  |
| `Edit.AddNotesAboveOrBelowSelection` | *Add Notes Above Or Below Selection* |  |  |
| `Edit.AddOssiaAbove` | *Add Ossia Above* |  |  |
| `Edit.AddOssiaBelow` | *Add Ossia Below* |  |  |
| `Edit.AddPedalLineChangeToHalf` | *Add Pedal Line Change To Half* |  |  |
| `Edit.AddPedalLineChangeToOne` | *Add Pedal Line Change To One* |  |  |
| `Edit.AddPedalLineChangeToQuarter` | *Add Pedal Line Change To Quarter* |  |  |
| `Edit.AddPedalLineChangeToThreeQuarters` | *Add Pedal Line Change To Three Quarters* |  |  |
| `Edit.AddPedalLineRetake` | *Add Pedal Line Retake* |  |  |
| `Edit.AddSegmentToRepeatEndingLine` | *Add Segment To Repeat Ending Line* |  | `projectwindow/writemode/repeatstructures` |
| `Edit.AddStaffAbove` | *Add Staff Above* |  |  |
| `Edit.AddStaffBelow` | *Add Staff Below* |  |  |
| `Edit.AddVibratoBarScoop` | *Add Vibrato Bar Scoop* |  |  |
| `Edit.AlignDynamics` | *Align Dynamics* |  |  |
| `Edit.ApplyCursorPayloadAtPoint` | *Apply Cursor Payload At Point* |  |  |
| `Edit.ApplyPercussionKitEditorChanges` | *Apply Percussion Kit Editor Changes* |  |  |
| `Edit.ApplyPercussionPlayingTechniquePresentationEditorChanges` | *Apply Percussion Playing Technique Presentation Editor Changes* |  |  |
| `Edit.BeamTogether` | *Beam Together* |  |  |
| `Edit.BreakBeam` | *Break Beam* |  |  |
| `Edit.CalculateHarpPedal` | *Calculate Harp Pedal* |  |  |
| `Edit.ChangeBarConsolidation` | *Change Bar Consolidation* |  |  |
| `Edit.ChangeLayoutTransposition` | *Change Layout Transposition* |  |  |
| `Edit.ChangeParagraphStyle` | *Change Paragraph Style* |  |  |
| `Edit.ChangePercussionDestinationVoice` | *Change Percussion Destination Voice* |  |  |
| `Edit.ChangeStaffTextToSystemText` | *Change Staff Text To System Text* |  |  |
| `Edit.ChangeVoice` | *Change Voice* |  |  |
| `Edit.ChangeVoiceDirection` | *Change Voice Direction* |  |  |
| `Edit.ChangeVoiceDirection.VoiceDirection` | *Change Voice Direction › Voice Direction* |  |  |
| `Edit.ChangeVoiceSlashType` | *Change Voice Slash Type* |  |  |
| `Edit.ChangeVoiceToDownstem1` | *Change Voice To Downstem1* |  |  |
| `Edit.ChangeVoiceToDownstem2` | *Change Voice To Downstem2* |  |  |
| `Edit.ChangeVoiceToDownstem3` | *Change Voice To Downstem3* |  |  |
| `Edit.ChangeVoiceToDownstem4` | *Change Voice To Downstem4* |  |  |
| `Edit.ChangeVoiceToDownstemSlash1` | *Change Voice To Downstem Slash1* |  |  |
| `Edit.ChangeVoiceToDownstemSlash2` | *Change Voice To Downstem Slash2* |  |  |
| `Edit.ChangeVoiceToNext` | *Change Voice To Next* |  |  |
| `Edit.ChangeVoiceToPrevious` | *Change Voice To Previous* |  |  |
| `Edit.ChangeVoiceToStemlessSlash1` | *Change Voice To Stemless Slash1* |  |  |
| `Edit.ChangeVoiceToStemlessSlash2` | *Change Voice To Stemless Slash2* |  |  |
| `Edit.ChangeVoiceToUpstem1` | *Change Voice To Upstem1* |  |  |
| `Edit.ChangeVoiceToUpstem2` | *Change Voice To Upstem2* |  |  |
| `Edit.ChangeVoiceToUpstem3` | *Change Voice To Upstem3* |  |  |
| `Edit.ChangeVoiceToUpstem4` | *Change Voice To Upstem4* |  |  |
| `Edit.ChangeVoiceToUpstemSlash1` | *Change Voice To Upstem Slash1* |  |  |
| `Edit.ChangeVoiceToUpstemSlash2` | *Change Voice To Upstem Slash2* |  |  |
| `Edit.ClearMultiNoteTremolo` | *Clear Multi Note Tremolo* |  | `projectwindow/writemode/repeatstructures` |
| `Edit.ClearNoteheadSetOverride` | *Clear Notehead Set Override* |  |  |
| `Edit.ClearSingleNoteTremolo` | *Clear Single Note Tremolo* |  | `projectwindow/writemode/repeatstructures` |
| `Edit.ClefAfterBarline` | *Clef After Barline* |  |  |
| `Edit.ClefAfterGraceNotes` | *Clef After Grace Notes* |  |  |
| `Edit.ClefInConcertLayouts` | *Clef In Concert Layouts* |  |  |
| `Edit.ClefInTransposingLayouts` | *Clef In Transposing Layouts* |  |  |
| `Edit.ClefResetPosition` | *Clef Reset Position* |  |  |
| `Edit.ClickInScoreUI` | *Click In Score UI* |  |  |
| `Edit.Copy` | Copy | `Ctrl+C` (everywhere) |  |
| `Edit.CopyAtLocation` | *Copy At Location* |  |  |
| `Edit.CopyAtPosition` | *Copy At Position* |  |  |
| `Edit.CreateCondensingChange` | *Create Condensing Change* |  |  |
| `Edit.CreateCoordinationLine` | *Create Coordination Line* |  |  |
| `Edit.CreateEndCutaway` | *Create End Cutaway* |  |  |
| `Edit.CreateFannedBeamAccelThreeLines` | *Create Fanned Beam Accel Three Lines* |  |  |
| `Edit.CreateFannedBeamAccelTwoLines` | *Create Fanned Beam Accel Two Lines* |  |  |
| `Edit.CreateFannedBeamRallThreeLines` | *Create Fanned Beam Rall Three Lines* |  |  |
| `Edit.CreateFannedBeamRallTwoLines` | *Create Fanned Beam Rall Two Lines* |  |  |
| `Edit.CreateFrameBreak` | *Create Frame Break* | `Shift+F` (Engrave) |  |
| `Edit.CreateManualCutaway` | *Create Manual Cutaway* |  |  |
| `Edit.CreateMarker` | *Create Marker* | `Shift+Alt+M` (music editable) |  |
| `Edit.CreateNoteSpacingChange` | *Create Note Spacing Change* |  |  |
| `Edit.CreatePercussionLegend` | *Create Percussion Legend* |  |  |
| `Edit.CreatePercussionLegendSelectedInstruments` | *Create Percussion Legend Selected Instruments* |  |  |
| `Edit.CreatePercussionLegendSoundingInstruments` | *Create Percussion Legend Sounding Instruments* |  |  |
| `Edit.CreateStartCutaway` | *Create Start Cutaway* |  |  |
| `Edit.CreateSystemBreak` | Stop Slur | `Shift+S` (Engrave) |  |
| `Edit.CrossStaffAbove` | Cross to Staff Above | `N` (everywhere) |  |
| `Edit.CrossStaffBelow` | Cross to Staff Below | `M` (everywhere) |  |
| `Edit.CrossStaffReset` | *Cross Staff Reset* |  |  |
| `Edit.Cut` | Cut | `Ctrl+X` (everywhere) |  |
| `Edit.Delete` | Delete | `Del / Backspace` (everywhere) |  |
| `Edit.DeleteBars` | *Delete Bars* |  |  |
| `Edit.DeleteInitialExplicitClefs` | *Delete Initial Explicit Clefs* |  |  |
| `Edit.DeleteTonalitySystem` | *Delete Tonality System* |  |  |
| `Edit.DuplicateTonalitySystem` | *Duplicate Tonality System* |  |  |
| `Edit.EditInstrumentVisibilityFilters` | *Edit Instrument Visibility Filters* |  |  |
| `Edit.EditTonalitySystem` | *Edit Tonality System* |  |  |
| `Edit.EditUseInstrumentVisibilityFilterPreset` | *Edit Use Instrument Visibility Filter Preset* |  |  |
| `Edit.ExportLibraryForPercussionKit` | *Export Library For Percussion Kit* |  |  |
| `Edit.ExportTonalitySystem` | *Export Tonality System* |  |  |
| `Edit.FilterBehaviour` | *Filter Behaviour* |  |  |
| `Edit.FilterSelectedInstruments` | *Filter Selected Instruments* |  |  |
| `Edit.Find` | *Find* |  |  |
| `Edit.FindNext` | *Find Next* |  |  |
| `Edit.FlipItem` | Input Pitch [Pitch=F] | `F` (music editable) |  |
| `Edit.FontForSelectedEvent` | *Font For Selected Event* |  |  |
| `Edit.ForceStemletBeam` | *Force Stemlet Beam* |  |  |
| `Edit.GenerateChordSymbolsFromSelection` | *Generate Chord Symbols From Selection* |  |  |
| `Edit.GenerateNotesFromChordSymbolsInSelection` | *Generate Notes From Chord Symbols In Selection* |  |  |
| `Edit.GoTo` | *Go To* | `Ctrl+G` (everywhere) |  |
| `Edit.GoToFlow` | *Go To Flow* |  |  |
| `Edit.GoToLocation` | *Go To Location* |  |  |
| `Edit.GoToNextFlow` | *Go To Next Flow* |  |  |
| `Edit.GoToPage` | *Go To Page* |  |  |
| `Edit.GoToPreviousFlow` | *Go To Previous Flow* |  |  |
| `Edit.GoToRehearsalMark` | *Go To Rehearsal Mark* |  |  |
| `Edit.GoToRhythmicPosition` | *Go To Rhythmic Position* |  |  |
| `Edit.GroupDynamicsTogether` | *Group Dynamics Together* |  |  |
| `Edit.GroupPlayingTechniques` | *Group Playing Techniques* |  |  |
| `Edit.HideAccidental` | *Hide Accidental* |  |  |
| `Edit.ImportTonalitySystem` | *Import Tonality System* |  |  |
| `Edit.InstrumentVisibilityFilterPreset1` | *Instrument Visibility Filter Preset1* |  |  |
| `Edit.InstrumentVisibilityFilterPreset10` | *Instrument Visibility Filter Preset10* |  |  |
| `Edit.InstrumentVisibilityFilterPreset2` | *Instrument Visibility Filter Preset2* |  |  |
| `Edit.InstrumentVisibilityFilterPreset3` | *Instrument Visibility Filter Preset3* |  |  |
| `Edit.InstrumentVisibilityFilterPreset4` | *Instrument Visibility Filter Preset4* |  |  |
| `Edit.InstrumentVisibilityFilterPreset5` | *Instrument Visibility Filter Preset5* |  |  |
| `Edit.InstrumentVisibilityFilterPreset6` | *Instrument Visibility Filter Preset6* |  |  |
| `Edit.InstrumentVisibilityFilterPreset7` | *Instrument Visibility Filter Preset7* |  |  |
| `Edit.InstrumentVisibilityFilterPreset8` | *Instrument Visibility Filter Preset8* |  |  |
| `Edit.InstrumentVisibilityFilterPreset9` | *Instrument Visibility Filter Preset9* |  |  |
| `Edit.LineOfLyrics` | *Line Of Lyrics* |  |  |
| `Edit.LinkElements` | *Link Elements* |  |  |
| `Edit.LyricTextContent` | *Lyric Text Content* |  |  |
| `Edit.MakeMultiNoteTremolo` | *Make Multi Note Tremolo* |  |  |
| `Edit.MakeMultiNoteTremolo?Value=1` | *Make Multi Note Tremolo (Value=1)* |  | `projectwindow/writemode/repeatstructures` |
| `Edit.MakeMultiNoteTremolo?Value=2` | *Make Multi Note Tremolo (Value=2)* |  | `projectwindow/writemode/repeatstructures` |
| `Edit.MakeMultiNoteTremolo?Value=3` | *Make Multi Note Tremolo (Value=3)* |  | `projectwindow/writemode/repeatstructures` |
| `Edit.MakeMultiNoteTremolo?Value=4` | *Make Multi Note Tremolo (Value=4)* |  | `projectwindow/writemode/repeatstructures` |
| `Edit.MakeNewRepeatEndingLine` | *Make New Repeat Ending Line* |  | `projectwindow/writemode/repeatstructures` |
| `Edit.MakeSingleNoteTremolo` | *Make Single Note Tremolo* |  |  |
| `Edit.ManualStaffVisibility` | *Manual Staff Visibility* |  |  |
| `Edit.MoveToStringAbove` | *Move To String Above* |  |  |
| `Edit.MoveToStringBelow` | *Move To String Below* |  |  |
| `Edit.NewTonalitySystem` | *New Tonality System* |  |  |
| `Edit.Paste` | Paste | `Ctrl+V` (everywhere) |  |
| `Edit.PasteArticulations` | *Paste Articulations* |  |  |
| `Edit.PasteChordSymbolsAsNotes` | *Paste Chord Symbols As Notes* |  |  |
| `Edit.PasteCubaseChordsAtPosition` | *Paste Cubase Chords At Position* |  |  |
| `Edit.PasteExplode` | *Paste Explode* |  |  |
| `Edit.PasteFileAtPosition` | *Paste File At Position* |  |  |
| `Edit.PasteIntoVoice` | *Paste Into Voice* |  |  |
| `Edit.PasteReduce` | *Paste Reduce* |  |  |
| `Edit.PasteSpecial` | *Paste Special* |  |  |
| `Edit.PedalLineMerge` | *Pedal Line Merge* |  |  |
| `Edit.PedalLineRemoveNotch` | *Pedal Line Remove Notch* |  |  |
| `Edit.PedalLineSplit` | *Pedal Line Split* |  |  |
| `Edit.PerformMarqueeSelection` | *Perform Marquee Selection* |  |  |
| `Edit.PropagateProperties` | *Propagate Properties* |  |  |
| `Edit.PropertiesSetGlobal` | *Properties Set Global* |  |  |
| `Edit.PropertiesSetLocal` | *Properties Set Local* |  |  |
| `Edit.PropertiesToggleGlobalLocal` | *Properties Toggle Global Local* |  |  |
| `Edit.Redo` | Redo | `Ctrl+Shift+Z / Ctrl+Y` (everywhere) |  |
| `Edit.RemoveAllInstrumentsFromPercussionKitInPlayer` | *Remove All Instruments From Percussion Kit In Player* |  |  |
| `Edit.RemoveCornerOrAngledLineFromOttavaLine` | *Remove Corner Or Angled Line From Ottava Line* |  |  |
| `Edit.RemoveFromDynamicGroup` | *Remove From Dynamic Group* |  |  |
| `Edit.RemoveFromSharedElement` | *Remove From Shared Element* |  |  |
| `Edit.RemoveInstrumentsFromPercussionKitInPlayer` | *Remove Instruments From Percussion Kit In Player* |  |  |
| `Edit.RemovePlayingTechniqueFromGroup` | *Remove Playing Technique From Group* |  |  |
| `Edit.RemoveRests` | *Remove Rests* |  |  |
| `Edit.RemoveStaff` | *Remove Staff* |  |  |
| `Edit.Requantize` | *Requantize* |  |  |
| `Edit.ResetAppearance` | *Reset Appearance* |  |  |
| `Edit.ResetBeaming` | *Reset Beaming* |  |  |
| `Edit.ResetFiguredBass` | *Reset Figured Bass* |  |  |
| `Edit.ResetFingering` | *Reset Fingering* |  |  |
| `Edit.ResetInstrumentNames` | *Reset Instrument Names* |  |  |
| `Edit.ResetPercussionDestinationVoice` | *Reset Percussion Destination Voice* |  |  |
| `Edit.ResetPosition` | *Reset Position* |  |  |
| `Edit.RestoreUnison` | *Restore Unison* |  |  |
| `Edit.ScalePlayer` | *Scale Player* |  |  |
| `Edit.ScalePlayerCustom` | *Scale Player Custom* |  |  |
| `Edit.ScalePlayerTo100Percent` | *Scale Player To100 Percent* |  |  |
| `Edit.ScalePlayerTo60Percent` | *Scale Player To60 Percent* |  |  |
| `Edit.ScalePlayerTo75Percent` | *Scale Player To75 Percent* |  |  |
| `Edit.SelectAll` | Select All | `Ctrl+A` (everywhere) |  |
| `Edit.SelectAtEndOfFlow` | *Select At End Of Flow* |  |  |
| `Edit.SelectAtPoint` | *Select At Point* |  |  |
| `Edit.SelectBarNumbers` | *Select Bar Numbers* |  |  |
| `Edit.SelectChordSymbols` | *Select Chord Symbols* |  |  |
| `Edit.SelectComment` | *Select Comment* |  |  |
| `Edit.SelectMore` | *Select More* | `Ctrl+Shift+A` (everywhere) |  |
| `Edit.SelectNone` | Select None | `Ctrl+D` (everywhere) |  |
| `Edit.SelectToEndOfSystem` | *Select To End Of System* |  |  |
| `Edit.SelectToStartOfFlow` | *Select To Start Of Flow* |  |  |
| `Edit.SelectToStartOfSystem` | *Select To Start Of System* |  |  |
| `Edit.SetChordSymbolLineNumber` | *Set Chord Symbol Line Number* |  |  |
| `Edit.SetColourOverride` | *Set Colour Override* |  |  |
| `Edit.SetFramesEditMode` | *Set Frames Edit Mode* |  |  |
| `Edit.SetGraphicSlicesEditMode` | *Set Graphic Slices Edit Mode* |  |  |
| `Edit.SetGraphicalEditMode` | *Set Graphical Edit Mode* |  |  |
| `Edit.SetLyricLineNumber` | *Set Lyric Line Number* |  |  |
| `Edit.SetNoteSpacingEditMode` | *Set Note Spacing Edit Mode* |  |  |
| `Edit.SetNoteheadSetOverride` | *Set Notehead Set Override* |  |  |
| `Edit.SetPartialBeamDirectionLeft` | *Set Partial Beam Direction Left* |  |  |
| `Edit.SetPartialBeamDirectionRight` | *Set Partial Beam Direction Right* |  |  |
| `Edit.SetSpecialEditModeEnabled` | *Set Special Edit Mode Enabled* |  |  |
| `Edit.SetStaffSpacingEditMode` | *Set Staff Spacing Edit Mode* |  |  |
| `Edit.ShiftSpacingSelection` | *Shift Spacing Selection* |  |  |
| `Edit.ShowAccidental` | *Show Accidental* |  |  |
| `Edit.ShowAccidentalInBrackets` | *Show Accidental In Brackets* |  |  |
| `Edit.ShowAccidentalInParentheses` | *Show Accidental In Parentheses* |  |  |
| `Edit.ShowChordSymbolEditor` | *Show Chord Symbol Editor* |  |  |
| `Edit.SingleNoteTremoloFourStrokes` | *Single Note Tremolo Four Strokes* |  |  |
| `Edit.SingleNoteTremoloOneStroke` | *Single Note Tremolo One Stroke* |  |  |
| `Edit.SingleNoteTremoloThreeStrokes` | *Single Note Tremolo Three Strokes* |  |  |
| `Edit.SingleNoteTremoloTwoStrokes` | *Single Note Tremolo Two Strokes* |  |  |
| `Edit.SingleNoteTremoloZOnStem` | *Single Note Tremolo Z On Stem* |  |  |
| `Edit.SplitBeam` | *Split Beam* |  |  |
| `Edit.SplitFlowAtSelection` | *Split Flow At Selection* |  |  |
| `Edit.SplitSecondaryBeam` | *Split Secondary Beam* |  |  |
| `Edit.StemForceCentredBeam` | *Stem Force Centred Beam* |  |  |
| `Edit.StemForceCustomCentredBeam` | *Stem Force Custom Centred Beam* |  |  |
| `Edit.StemForceDirection` | *Stem Force Direction* |  |  |
| `Edit.StemRemoveCentredBeam` | *Stem Remove Centred Beam* |  |  |
| `Edit.StemRemoveForceDirection` | *Stem Remove Force Direction* |  |  |
| `Edit.SuppressStemletBeam` | *Suppress Stemlet Beam* |  |  |
| `Edit.SwapVoiceOrder` | *Swap Voice Order* |  |  |
| `Edit.SwapVoices` | *Swap Voices* |  |  |
| `Edit.ToggleAccidentalVisibility` | *Toggle Accidental Visibility* |  |  |
| `Edit.ToggleBarConsolidation` | *Toggle Bar Consolidation* |  |  |
| `Edit.ToggleHideEvent` | *Toggle Hide Event* |  |  |
| `Edit.ToggleHideNotehead` | *Toggle Hide Notehead* |  |  |
| `Edit.ToggleHideStem` | *Toggle Hide Stem* |  |  |
| `Edit.ToggleLaissezVibrerTie` | *Toggle Laissez Vibrer Tie* |  |  |
| `Edit.ToggleLayoutCondensing` | *Toggle Layout Condensing* |  |  |
| `Edit.ToggleLayoutTransposition` | *Toggle Layout Transposition* |  |  |
| `Edit.ToggleRoundBracketsForNotehead` | *Toggle Round Brackets For Notehead* |  |  |
| `Edit.ToggleSquareBracketsForNotehead` | *Toggle Square Brackets For Notehead* |  |  |
| `Edit.ToggleSuppressPlayback` | *Toggle Suppress Playback* |  |  |
| `Edit.TransposeSelection` | *Transpose Selection* |  |  |
| `Edit.TrimFlow` | *Trim Flow* |  |  |
| `Edit.Undo` | Undo | `Ctrl+Z` (everywhere) |  |
| `Edit.UndoRedoHistory` | *Undo Redo History* |  |  |
| `Edit.UngroupDynamics` | *Ungroup Dynamics* |  |  |
| `Edit.UngroupPlayingTechniques` | *Ungroup Playing Techniques* |  |  |
| `Edit.UnlinkElement` | *Unlink Element* |  |  |
| `Edit.UseInstrumentVisibilityFilter` | *Use Instrument Visibility Filter* |  |  |

## NoteInput

Note input (caret, durations, pitches, voices, tuplets, chords)

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `NoteInput.AcceptCurrentChordSymbolMIDIInput` | *Accept Current Chord Symbol MIDI Input* |  |  |
| `NoteInput.AcceptCurrentChordSymbolTextInput` | *Accept Current Chord Symbol Text Input* |  |  |
| `NoteInput.AcceptCurrentFiguredBassTextInput` | *Accept Current Figured Bass Text Input* |  |  |
| `NoteInput.AcceptCurrentLyricInput` | *Accept Current Lyric Input* |  |  |
| `NoteInput.AddBarAtEndOfFlow` | *Add Bar At End Of Flow* |  |  |
| `NoteInput.AddFingeringsToSelection` | *Add Fingerings To Selection* |  |  |
| `NoteInput.AddJazzArticulation` | *Add Jazz Articulation* |  |  |
| `NoteInput.AddNoteAtShadowNotePosition` | *Add Note At Shadow Note Position* |  |  |
| `NoteInput.AddRepeatsToSelection` | *Add Repeats To Selection* |  |  |
| `NoteInput.AdvanceChordSymbolInput` | *Advance Chord Symbol Input* |  |  |
| `NoteInput.AdvanceLyricInput` | *Advance Lyric Input* |  |  |
| `NoteInput.ContinueChordSymbolInput` | *Continue Chord Symbol Input* |  |  |
| `NoteInput.ContinueFiguredBassInput` | *Continue Figured Bass Input* |  |  |
| `NoteInput.CreateBarLine` | Create Bar or Barline | `Shift+B` (Write) |  |
| `NoteInput.CreateBarRepeatRegion` | *Create Bar Repeat Region* |  | `projectwindow/writemode/repeatstructures` |
| `NoteInput.CreateChordSymbolVisibilityRegion` | *Create Chord Symbol Visibility Region* |  |  |
| `NoteInput.CreateClef` | Create Clef | `Shift+C` (Write) |  |
| `NoteInput.CreateComment` | *Create Comment* |  |  |
| `NoteInput.CreateCue` | *Create Cue* | `Shift+U` (Write) |  |
| `NoteInput.CreateDynamic` | Create Dynamic | `Shift+D` (Write) |  |
| `NoteInput.CreateGlissando` | *Create Glissando* |  |  |
| `NoteInput.CreateGraceNote` | *Create Grace Note* | `/` (Write) |  |
| `NoteInput.CreateGraceNote?SetBasedOnButtonCheckedState` | *Create Grace Note (SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.CreateGuitarBend` | *Create Guitar Bend* |  |  |
| `NoteInput.CreateKeySignature` | Create Key Signature | `Shift+K` (Write) |  |
| `NoteInput.CreateMIDITriggerRegion` | *Create MIDI Trigger Region* |  |  |
| `NoteInput.CreateOrnament` | Create Ornament | `Shift+O` (Write) |  |
| `NoteInput.CreatePause` | Create Hold or Pause | `Shift+H` (Write) |  |
| `NoteInput.CreatePlayingTechnique` | Create Playing Technique | `Shift+P` (Write) |  |
| `NoteInput.CreateRegionNumberingRepeatedBars` | *Create Region Numbering Repeated Bars* |  | `projectwindow/writemode/repeatstructures` |
| `NoteInput.CreateRehearsalMark` | Create Rehearsal Mark | `Shift+A` (Write) |  |
| `NoteInput.CreateRehearsalMarkBarNumbers` | *Create Rehearsal Mark Bar Numbers* |  |  |
| `NoteInput.CreateRehearsalMarkLetters` | *Create Rehearsal Mark Letters* |  |  |
| `NoteInput.CreateRehearsalMarkNumbers` | *Create Rehearsal Mark Numbers* |  |  |
| `NoteInput.CreateRepeat` | *Create Repeat* |  |  |
| `NoteInput.CreateRhythmicFeel` | *Create Rhythmic Feel* |  |  |
| `NoteInput.CreateSlashedRegion` | *Create Slashed Region* |  | `projectwindow/writemode/repeatstructures` |
| `NoteInput.CreateSlashedVoice` | *Create Slashed Voice* | `Shift+Alt+V` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.CreateSystemText` | *Create System Text* |  |  |
| `NoteInput.CreateSystemText?ParagraphStyleID=paragraph.defaulttext` | *Create System Text (ParagraphStyleID=paragraph.defaulttext)* | `Shift+Alt+X` (Write) |  |
| `NoteInput.CreateTempo` | Create Tempo | `Shift+T` (Write) |  |
| `NoteInput.CreateText` | *Create Text* |  |  |
| `NoteInput.CreateText?ParagraphStyleID=paragraph.defaulttext` | Create Text | `Shift+X` (Write) |  |
| `NoteInput.CreateTimeSignature` | Create Time Signature | `Shift+M` (Write) |  |
| `NoteInput.CreateVoice` | Create Voice | `Shift+V` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.CycleNumDots` | *Cycle Num Dots* | `Alt+.` (Write) |  |
| `NoteInput.DeleteLeft` | Delete Left | `Backspace` (note input) |  |
| `NoteInput.DeleteRight` | Delete Right | `Del` (note input) |  |
| `NoteInput.DrumPadHits` | *Drum Pad Hits* |  |  |
| `NoteInput.DrumPadHitsAudition` | *Drum Pad Hits Audition* |  |  |
| `NoteInput.DrumPadRecording` | *Drum Pad Recording* |  |  |
| `NoteInput.EditLockPosition` | *Edit Lock Position* | `Shift+Alt+I` (Write) |  |
| `NoteInput.EndTupletRun` | End Tuplet Input | `:` (note input) |  |
| `NoteInput.Enter` | Start Note Input [Set=true] | `Shift+N` (Write) | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.EnterAtPoint` | *Enter At Point* |  |  |
| `NoteInput.Exit` | Stop Note Input | `Esc` (Write) |  |
| `NoteInput.ExtendDown` | *Extend Down* | `Shift+Down / Shift+Num+Down` (note input) |  |
| `NoteInput.ExtendUp` | *Extend Up* | `Shift+Up / Shift+Num+Up` (note input) |  |
| `NoteInput.ForceDuration` | Force Note Durations | `O` (Write) |  |
| `NoteInput.ForceDuration?SetBasedOnButtonCheckedState` | Force Note Durations |  | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.Fret` | *Fret* |  |  |
| `NoteInput.Fret?FretPosition=0` | *Fret (FretPosition=0)* | `0 / Num+0` (note input on tab) |  |
| `NoteInput.Fret?FretPosition=1` | *Fret (FretPosition=1)* | `1 / Num+1` (note input on tab) |  |
| `NoteInput.Fret?FretPosition=2` | *Fret (FretPosition=2)* | `2 / Num+2` (note input on tab) |  |
| `NoteInput.Fret?FretPosition=3` | *Fret (FretPosition=3)* | `3 / Num+3` (note input on tab) |  |
| `NoteInput.Fret?FretPosition=4` | *Fret (FretPosition=4)* | `4 / Num+4` (note input on tab) |  |
| `NoteInput.Fret?FretPosition=5` | *Fret (FretPosition=5)* | `5 / Num+5` (note input on tab) |  |
| `NoteInput.Fret?FretPosition=6` | *Fret (FretPosition=6)* | `6 / Num+6` (note input on tab) |  |
| `NoteInput.Fret?FretPosition=7` | *Fret (FretPosition=7)* | `7 / Num+7` (note input on tab) |  |
| `NoteInput.Fret?FretPosition=8` | *Fret (FretPosition=8)* | `8 / Num+8` (note input on tab) |  |
| `NoteInput.Fret?FretPosition=9` | *Fret (FretPosition=9)* | `9 / Num+9` (note input on tab) |  |
| `NoteInput.FretDecaIndex` | *Fret Deca Index* |  |  |
| `NoteInput.FretboardStringPlucked` | *Fretboard String Plucked* |  |  |
| `NoteInput.Glue` | *Glue* |  |  |
| `NoteInput.GraceNoteSlashToggle` | *Grace Note Slash Toggle* | `Alt+/` (Write) |  |
| `NoteInput.GraceNoteSlashToggle?Set=false` | *Grace Note Slash Toggle (Set=false)* |  | `projectwindow/writemode/notespanel` |
| `NoteInput.GraceNoteSlashToggle?Set=true` | *Grace Note Slash Toggle (Set=true)* |  | `projectwindow/writemode/notespanel` |
| `NoteInput.GridResolutionDecrease` | Previous Layout | `Alt+[` (music editable) |  |
| `NoteInput.GridResolutionIncrease` | Next Layout | `Alt+]` (music editable) |  |
| `NoteInput.HairpinStart` | *Hairpin Start* |  |  |
| `NoteInput.HairpinStart?Type=kGradualDynamicDown&GradualDynamicType=kCrescOrDim` | *Hairpin Start (Type=kGradualDynamicDown, GradualDynamicType=kCrescOrDim)* | `>` (Write) |  |
| `NoteInput.HairpinStart?Type=kGradualDynamicDown&GradualDynamicType=kMessaDiVoce` | *Hairpin Start (Type=kGradualDynamicDown, GradualDynamicType=kMessaDiVoce)* | `Alt+Shift+.` (Write) |  |
| `NoteInput.HairpinStart?Type=kGradualDynamicUp&GradualDynamicType=kCrescOrDim` | *Hairpin Start (Type=kGradualDynamicUp, GradualDynamicType=kCrescOrDim)* | `<` (Write) |  |
| `NoteInput.HairpinStart?Type=kGradualDynamicUp&GradualDynamicType=kMessaDiVoce` | *Hairpin Start (Type=kGradualDynamicUp, GradualDynamicType=kMessaDiVoce)* | `Alt+Shift+,` (Write) |  |
| `NoteInput.HairpinStop` | *Hairpin Stop* | `?` (Write) |  |
| `NoteInput.InsertBarRest` | *Insert Bar Rest* |  | `projectwindow/writemode/barsbarlinespanel` |
| `NoteInput.InsertScope` | *Insert Scope* |  |  |
| `NoteInput.InsertScope?InsertModeScope=kGlobal` | *Insert Scope (InsertModeScope=kGlobal)* |  | `projectwindow/writemode/notespanel` |
| `NoteInput.InsertScope?InsertModeScope=kGlobalCurrentBar` | *Insert Scope (InsertModeScope=kGlobalCurrentBar)* |  | `projectwindow/writemode/notespanel` |
| `NoteInput.InsertScope?InsertModeScope=kPlayer` | *Insert Scope (InsertModeScope=kPlayer)* |  | `projectwindow/writemode/notespanel` |
| `NoteInput.InsertScope?InsertModeScope=kVoice` | *Insert Scope (InsertModeScope=kVoice)* |  | `projectwindow/writemode/notespanel` |
| `NoteInput.InsertScopeCycle` | *Insert Scope Cycle* | `Alt+I` (Write) |  |
| `NoteInput.Locked` | Lock Note Durations | `L` (note input) | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.MIDINoteInput` | *MIDI Note Input* |  |  |
| `NoteInput.Mode` | Note input mode | `I / Ins` (Write) | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.MouseInputDisable` | *Mouse Input Disable* |  |  |
| `NoteInput.MouseInputDisable?SetBasedOnButtonCheckedState` | *Mouse Input Disable (SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.MoveAdvance` | Advance Caret | `Space` (note input) |  |
| `NoteInput.MoveDown` | Move Down | `Down / Num+Down` (note input) |  |
| `NoteInput.MoveDownBottom` | *Move Down Bottom* | `Ctrl+Down / Ctrl+Num+Down` (note input) |  |
| `NoteInput.MoveLeft` | Move Left | `Left / Num+Left` (note input) |  |
| `NoteInput.MoveLeftBar` | Move Caret Left by Bar | `Ctrl+Left / Ctrl+Num+Left` (note input) |  |
| `NoteInput.MoveRight` | Move Right | `Right / Num+Right` (note input) |  |
| `NoteInput.MoveRightBar` | Move Caret Right by Bar | `Ctrl+Right / Ctrl+Num+Right` (note input) |  |
| `NoteInput.MoveToString` | *Move To String* |  |  |
| `NoteInput.MoveUp` | Move Up | `Up / Num+Up` (note input) |  |
| `NoteInput.MoveUpTop` | *Move Up Top* | `Ctrl+Up / Ctrl+Num+Up` (note input) |  |
| `NoteInput.NextVoice` | Next Voice | `V` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.NoteInputAdvanceFingeringInput` | *Note Input Advance Fingering Input* |  |  |
| `NoteInput.NoteValue` | *Note Value* |  |  |
| `NoteInput.NoteValue?LogDuration=k1024Note&SetBasedOnButtonCheckedState` | *Note Value (LogDuration=k1024Note, SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/keysignaturespanel/accidentals` |
| `NoteInput.NoteValue?LogDuration=k128Note` | *Note Value (LogDuration=k128Note)* | `1` (Write) |  |
| `NoteInput.NoteValue?LogDuration=k128Note&SetBasedOnButtonCheckedState` | *Note Value (LogDuration=k128Note, SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/keysignaturespanel/accidentals` |
| `NoteInput.NoteValue?LogDuration=k256Note&SetBasedOnButtonCheckedState` | *Note Value (LogDuration=k256Note, SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/keysignaturespanel/accidentals` |
| `NoteInput.NoteValue?LogDuration=k512Note&SetBasedOnButtonCheckedState` | *Note Value (LogDuration=k512Note, SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/keysignaturespanel/accidentals` |
| `NoteInput.NoteValue?LogDuration=kBreve` | *Note Value (LogDuration=kBreve)* | `9` (Write) |  |
| `NoteInput.NoteValue?LogDuration=kBreve&SetBasedOnButtonCheckedState` | *Note Value (LogDuration=kBreve, SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/keysignaturespanel/accidentals` |
| `NoteInput.NoteValue?LogDuration=kCrotchet` | *Note Value (LogDuration=kCrotchet)* | `6` (Write) |  |
| `NoteInput.NoteValue?LogDuration=kCrotchet&SetBasedOnButtonCheckedState` | *Note Value (LogDuration=kCrotchet, SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/keysignaturespanel/accidentals` |
| `NoteInput.NoteValue?LogDuration=kDemiSemiQuaver` | *Note Value (LogDuration=kDemiSemiQuaver)* | `3` (Write) |  |
| `NoteInput.NoteValue?LogDuration=kDemiSemiQuaver&SetBasedOnButtonCheckedState` | *Note Value (LogDuration=kDemiSemiQuaver, SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/keysignaturespanel/accidentals` |
| `NoteInput.NoteValue?LogDuration=kHemiDemiSemiQuaver` | *Note Value (LogDuration=kHemiDemiSemiQuaver)* | `2` (Write) |  |
| `NoteInput.NoteValue?LogDuration=kHemiDemiSemiQuaver&SetBasedOnButtonCheckedState` | *Note Value (LogDuration=kHemiDemiSemiQuaver, SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/keysignaturespanel/accidentals` |
| `NoteInput.NoteValue?LogDuration=kLong&SetBasedOnButtonCheckedState` | *Note Value (LogDuration=kLong, SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/keysignaturespanel/accidentals` |
| `NoteInput.NoteValue?LogDuration=kMaxima&SetBasedOnButtonCheckedState` | *Note Value (LogDuration=kMaxima, SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/keysignaturespanel/accidentals` |
| `NoteInput.NoteValue?LogDuration=kMinim` | *Note Value (LogDuration=kMinim)* | `7` (Write) |  |
| `NoteInput.NoteValue?LogDuration=kMinim&SetBasedOnButtonCheckedState` | *Note Value (LogDuration=kMinim, SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/keysignaturespanel/accidentals` |
| `NoteInput.NoteValue?LogDuration=kQuaver` | *Note Value (LogDuration=kQuaver)* | `5` (Write) |  |
| `NoteInput.NoteValue?LogDuration=kQuaver&SetBasedOnButtonCheckedState` | *Note Value (LogDuration=kQuaver, SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/keysignaturespanel/accidentals` |
| `NoteInput.NoteValue?LogDuration=kSemiQuaver` | *Note Value (LogDuration=kSemiQuaver)* | `4` (Write) |  |
| `NoteInput.NoteValue?LogDuration=kSemiQuaver&SetBasedOnButtonCheckedState` | *Note Value (LogDuration=kSemiQuaver, SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/keysignaturespanel/accidentals` |
| `NoteInput.NoteValue?LogDuration=kSemibreve` | *Note Value (LogDuration=kSemibreve)* | `8` (Write) |  |
| `NoteInput.NoteValue?LogDuration=kSemibreve&SetBasedOnButtonCheckedState` | *Note Value (LogDuration=kSemibreve, SetBasedOnButtonCheckedState)* |  | `projectwindow/writemode/keysignaturespanel/accidentals` |
| `NoteInput.NoteValueLonger` | *Note Value Longer* | `=` (note input on tab) |  |
| `NoteInput.NoteValueShorter` | *Note Value Shorter* | `-` (note input on tab) |  |
| `NoteInput.OctaveDown` | *Octave Down* |  |  |
| `NoteInput.OctaveUp` | *Octave Up* |  |  |
| `NoteInput.OttavaLineStart` | *Ottava Line Start* |  |  |
| `NoteInput.OttavaLineStop` | *Ottava Line Stop* |  |  |
| `NoteInput.PedalLineStop` | *Pedal Line Stop* | `*` (Write) |  |
| `NoteInput.Pitch` | *Pitch* |  |  |
| `NoteInput.Pitch?Pitch=A` | Input Pitch | `A` (note input) |  |
| `NoteInput.Pitch?Pitch=A&Down=true` | Input Pitch | `Meta+A` (note input) |  |
| `NoteInput.Pitch?Pitch=A&Up=true` | Input Pitch | `Shift+Alt+A` (note input) |  |
| `NoteInput.Pitch?Pitch=B` | Input Pitch | `B` (note input) |  |
| `NoteInput.Pitch?Pitch=B&Down=true` | Input Pitch | `Meta+B` (note input) |  |
| `NoteInput.Pitch?Pitch=B&Up=true` | Input Pitch | `Shift+Alt+B` (note input) |  |
| `NoteInput.Pitch?Pitch=C` | Input Pitch | `C` (note input) |  |
| `NoteInput.Pitch?Pitch=C&Down=true` | Input Pitch | `Meta+C` (note input) |  |
| `NoteInput.Pitch?Pitch=C&Up=true` | Input Pitch | `Shift+Alt+C` (note input) |  |
| `NoteInput.Pitch?Pitch=D` | Input Pitch | `D` (note input) |  |
| `NoteInput.Pitch?Pitch=D&Down=true` | Input Pitch | `Meta+D` (note input) |  |
| `NoteInput.Pitch?Pitch=D&Up=true` | Input Pitch | `Shift+Alt+D` (note input) |  |
| `NoteInput.Pitch?Pitch=E` | Input Pitch | `E` (note input) |  |
| `NoteInput.Pitch?Pitch=E&Down=true` | Input Pitch | `Meta+E` (note input) |  |
| `NoteInput.Pitch?Pitch=E&Up=true` | Input Pitch | `Shift+Alt+E` (note input) |  |
| `NoteInput.Pitch?Pitch=F` | Input Pitch | `F` (note input) |  |
| `NoteInput.Pitch?Pitch=F&Down=true` | Input Pitch | `Meta+F` (note input) |  |
| `NoteInput.Pitch?Pitch=F&Up=true` | Input Pitch | `Shift+Alt+F` (note input) |  |
| `NoteInput.Pitch?Pitch=G` | Input Pitch | `G` (note input) |  |
| `NoteInput.Pitch?Pitch=G&Down=true` | Input Pitch | `Meta+G` (note input) |  |
| `NoteInput.Pitch?Pitch=G&Up=true` | Input Pitch | `Shift+Alt+G` (note input) |  |
| `NoteInput.Pitch?Pitch=X` | *Pitch (Pitch=X)* | `Y` (note input) |  |
| `NoteInput.PitchBeforeDurationDown` | *Pitch Before Duration Down* |  |  |
| `NoteInput.PitchBeforeDurationOctaveDown` | *Pitch Before Duration Octave Down* |  |  |
| `NoteInput.PitchBeforeDurationOctaveUp` | *Pitch Before Duration Octave Up* |  |  |
| `NoteInput.PitchBeforeDurationToggle` | *Pitch Before Duration Toggle* | `K` (Write) | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.PitchBeforeDurationUp` | *Pitch Before Duration Up* |  |  |
| `NoteInput.PitchMode` | *Pitch Mode* |  |  |
| `NoteInput.RemoveChordSymbolSpellingOverrides` | *Remove Chord Symbol Spelling Overrides* |  |  |
| `NoteInput.RemoveJazzArticulation` | *Remove Jazz Articulation* |  | `projectwindow/writemode/ornamentspanel` |
| `NoteInput.RepeatLast` | Repeat Item | `R` (music editable) |  |
| `NoteInput.ReplyToComment` | *Reply To Comment* | `Alt+R` (music editable) | `projectwindow/writemode/commentspanel` |
| `NoteInput.RestMode` | Rests | `,` (Write) |  |
| `NoteInput.RestMode?SetBasedOnButtonCheckedState` | Rests |  | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.Scissor` | *Scissor* | `U` (Write) | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.ScissorWithMultipleSplits` | *Scissor With Multiple Splits* | `Alt+U` (Write) |  |
| `NoteInput.SetAccidental` | *Set Accidental* |  |  |
| `NoteInput.SetAccidental.Type` | *Set Accidental › Type* |  |  |
| `NoteInput.SetAccidental?Type=kFlat` | *Set Accidental (Type=kFlat)* | `-` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.SetAccidental?Type=kNatural` | *Set Accidental (Type=kNatural)* | `0` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.SetAccidental?Type=kSharp` | *Set Accidental (Type=kSharp)* | `=` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.SetArticulation` | *Set Articulation* |  |  |
| `NoteInput.SetArticulation.Value` | *Set Articulation › Value* |  |  |
| `NoteInput.SetArticulation?Value=kAccent` | Set Articulation | `[` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.SetArticulation?Value=kMarcato` | *Set Articulation (Value=kMarcato)* | `'` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.SetArticulation?Value=kStaccatissimo` | *Set Articulation (Value=kStaccatissimo)* | `}` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.SetArticulation?Value=kStaccato` | Set Articulation | `]` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.SetArticulation?Value=kStaccatoTenuto` | *Set Articulation (Value=kStaccatoTenuto)* | `|` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.SetArticulation?Value=kStress` | *Set Articulation (Value=kStress)* | `{` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.SetArticulation?Value=kTenuto` | Set Articulation | `\` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.SetArticulation?Value=kUnstress` | *Set Articulation (Value=kUnstress)* | `"` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.SetDotted` | *Set Dotted* | `.` (Write) |  |
| `NoteInput.SetDotted?Set=true&Value=1` | *Set Dotted (Set=true, Value=1)* |  | `projectwindow/writemode/notespanel` |
| `NoteInput.SetDotted?Set=true&Value=2` | *Set Dotted (Set=true, Value=2)* |  | `projectwindow/writemode/notespanel` |
| `NoteInput.SetDotted?Set=true&Value=3` | *Set Dotted (Set=true, Value=3)* |  | `projectwindow/writemode/notespanel` |
| `NoteInput.SetDotted?Set=true&Value=4` | *Set Dotted (Set=true, Value=4)* |  | `projectwindow/writemode/notespanel` |
| `NoteInput.SetDotted?SetBasedOnButtonCheckedState&Value=1` | *Set Dotted (SetBasedOnButtonCheckedState, Value=1)* |  | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.SetDotted?SetBasedOnButtonCheckedState&Value=2` | *Set Dotted (SetBasedOnButtonCheckedState, Value=2)* |  | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.SetDotted?SetBasedOnButtonCheckedState&Value=3` | *Set Dotted (SetBasedOnButtonCheckedState, Value=3)* |  | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.SetDotted?SetBasedOnButtonCheckedState&Value=4` | *Set Dotted (SetBasedOnButtonCheckedState, Value=4)* |  | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.SetGridResolution` | *Set Grid Resolution* |  |  |
| `NoteInput.SetNoteInputOptions` | *Set Note Input Options* |  |  |
| `NoteInput.SetPopOverItemInputLocality` | *Set Pop Over Item Input Locality* |  |  |
| `NoteInput.SetPopOverItemInputLocality.ChordSymbolEntryInputLocality` | *Set Pop Over Item Input Locality › Chord Symbol Entry Input Locality* |  |  |
| `NoteInput.SetPosition` | *Set Position* |  |  |
| `NoteInput.ShowCommentDialog` | *Show Comment Dialog* | `Alt+C` (music editable) |  |
| `NoteInput.ShowFingeringPopover` | *Show Fingering Popover* | `Shift+F` (Write) |  |
| `NoteInput.ShowMIDITriggerRegionPopover` | *Show MIDI Trigger Region Popover* | `)` (Write) |  |
| `NoteInput.ShowNoteInputOptions` | *Show Note Input Options* | `Ctrl+Shift+I` (everywhere) |  |
| `NoteInput.ShowPopoverForTransposingOrAddingNotes` | *Show Popover For Transposing Or Adding Notes* | `Shift+I` (Write) |  |
| `NoteInput.ShowRepeatsPopover` | *Show Repeats Popover* | `Shift+R` (Write) |  |
| `NoteInput.SlurStart` | Start Slur | `S` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.SlurStop` | Stop Slur | `Shift+S` (note input) |  |
| `NoteInput.SplitByRhythmicLength` | *Split By Rhythmic Length* |  |  |
| `NoteInput.StartChordSymbolInput` | *Start Chord Symbol Input* | `Shift+Q` (Write) |  |
| `NoteInput.StartEndChord` | Chord Input | `Q` (Write) | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.StartFiguredBassInput` | *Start Figured Bass Input* | `Shift+G` (Write) |  |
| `NoteInput.StartLyricInput` | Create Lyrics | `Shift+L` (Write) |  |
| `NoteInput.StartTupletRun` | Start Tuplet Input | `;` (Write) | `projectwindow/writemode/notespanel` |
| `NoteInput.StartTupletRunCancel` | *Start Tuplet Run Cancel* |  |  |
| `NoteInput.StringDown` | *String Down* |  |  |
| `NoteInput.StringUp` | *String Up* |  |  |
| `NoteInput.TextCreateFinished` | *Text Create Finished* |  |  |
| `NoteInput.TextEditFinished` | *Text Edit Finished* |  |  |
| `NoteInput.Tie` | Tie | `T` (Write) | `projectwindow/writemode/noteinputtoolbox` |
| `NoteInput.ToggleFullAndReducedNoteInputButtons` | *Toggle Full And Reduced Note Input Buttons* |  | `projectwindow/writemode/notespanel` |
| `NoteInput.ToggleLiveNoteEditing` | *Toggle Live Note Editing* |  |  |
| `NoteInput.ToggleMIDIInput` | *Toggle MIDI Input* |  |  |
| `NoteInput.ToggleMIDIThru` | *Toggle MIDI Thru* |  |  |
| `NoteInput.TransposeOrAddNotesToSelection` | *Transpose Or Add Notes To Selection* |  |  |
| `NoteInput.UpdateMIDIPitchesInMIDITriggerPopover` | *Update MIDI Pitches In MIDI Trigger Popover* |  |  |

## Play

Playback, transport, key editor, mixer, VST

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `Play.ActivateProject` | *Activate Project* |  |  |
| `Play.AddFXSend` | *Add FX Send* |  |  |
| `Play.ApplyDefaultGain` | *Apply Default Gain* |  |  |
| `Play.ApplyLiveSpace` | *Apply Live Space* |  |  |
| `Play.ApplyPlaybackTemplate` | *Apply Playback Template* |  |  |
| `Play.ApplySpaceTemplate` | *Apply Space Template* |  |  |
| `Play.ApplyStageTemplate` | *Apply Stage Template* |  |  |
| `Play.AutomationDeleteAll` | *Automation Delete All* |  |  |
| `Play.AutomationDeleteForInstruments` | *Automation Delete For Instruments* |  |  |
| `Play.AutomationDeleteForSelection` | *Automation Delete For Selection* |  |  |
| `Play.AutomationEdit` | *Automation Edit* |  |  |
| `Play.AutomationEditorSetTempoMaximumValue` | *Automation Editor Set Tempo Maximum Value* |  |  |
| `Play.AutomationPointChange` | *Automation Point Change* |  |  |
| `Play.AutomationPointCreate` | *Automation Point Create* |  |  |
| `Play.AutomationPointDelete` | *Automation Point Delete* |  |  |
| `Play.AutomationPointEditEnvelope` | *Automation Point Edit Envelope* |  |  |
| `Play.AutomationPointHide` | *Automation Point Hide* |  |  |
| `Play.AutomationPointMakeConstant` | *Automation Point Make Constant* |  |  |
| `Play.AutomationPointMakeLinear` | *Automation Point Make Linear* |  |  |
| `Play.AutomationSetValues` | *Automation Set Values* |  |  |
| `Play.ChangeMixerControl` | *Change Mixer Control* |  |  |
| `Play.ChangeMixerControls` | *Change Mixer Controls* |  |  |
| `Play.ChangePianoRollTimeEditMode` | *Change Piano Roll Time Edit Mode* |  |  |
| `Play.ClearCycleLocators` | *Clear Cycle Locators* |  |  |
| `Play.ClearPlaybackData` | *Clear Playback Data* |  |  |
| `Play.DecreaseGridResolution` | *Decrease Grid Resolution* |  |  |
| `Play.DeviceSetup` | *Device Setup* |  | `preferences/play/transportdisplay` |
| `Play.DisableMIDIOut` | *Disable MIDI Out* |  |  |
| `Play.DuplicatePlugin` | *Duplicate Plugin* |  |  |
| `Play.EditPlaybackTechniques` | *Edit Playback Techniques* |  |  |
| `Play.EditRhythmicFeel` | *Edit Rhythmic Feel* |  |  |
| `Play.EnableClick` | *Enable Click* |  |  |
| `Play.EnableCycle` | *Enable Cycle* |  |  |
| `Play.EnableInsert` | *Enable Insert* |  |  |
| `Play.EnableMIDIOut` | *Enable MIDI Out* |  |  |
| `Play.EnablePlugin` | *Enable Plugin* |  |  |
| `Play.EnableSend` | *Enable Send* |  |  |
| `Play.EndpointSetup` | *Endpoint Setup* |  |  |
| `Play.FixedTempoMode` | *Fixed Tempo Mode* |  |  |
| `Play.Forward` | *Forward* | `Num++ / F9` (everywhere) |  |
| `Play.HideAllPlugins` | *Hide All Plugins* |  |  |
| `Play.IncreaseGridResolution` | *Increase Grid Resolution* |  |  |
| `Play.KeyEditorMakeTrackSelectionFromSelection` | *Key Editor Make Track Selection From Selection* |  |  |
| `Play.KeyEditorToggleLockedView` | *Key Editor Toggle Locked View* |  |  |
| `Play.LaneSizeDecrease` | *Lane Size Decrease* | `Shift+G` (Play) |  |
| `Play.LaneSizeIncrease` | Create Hold or Pause | `Shift+H` (Play) |  |
| `Play.LoadInsert` | *Load Insert* |  |  |
| `Play.LoadPlugin` | *Load Plugin* |  |  |
| `Play.LoadPluginPreset` | *Load Plugin Preset* |  |  |
| `Play.LoadUnassignedSounds` | *Load Unassigned Sounds* |  |  |
| `Play.MovePlayheadToFlowPosition` | *Move Playhead To Flow Position* |  |  |
| `Play.NavigateBackwards` | Navigate Backwards | `Ctrl+[` (Play) |  |
| `Play.NavigateForwards` | Navigate Forwards | `Ctrl+]` (Play) |  |
| `Play.NavigateToStart` | *Navigate To Start* |  |  |
| `Play.NewSpaceTemplate` | *New Space Template* |  |  |
| `Play.NewStageTemplate` | *New Stage Template* |  |  |
| `Play.NextFrame` | *Next Frame* | `Ctrl+Num++ / Ctrl+F9` (everywhere) |  |
| `Play.PercussionEditorSetKitComponentGridResolution` | *Percussion Editor Set Kit Component Grid Resolution* |  |  |
| `Play.PercussionKitSetDisclosed` | *Percussion Kit Set Disclosed* |  |  |
| `Play.PianoRollDrawNote` | *Piano Roll Draw Note* |  |  |
| `Play.PianoRollEditPitchAndPosition` | *Piano Roll Edit Pitch And Position* |  |  |
| `Play.PianoRollEventsDeleted` | *Piano Roll Events Deleted* |  |  |
| `Play.PianoRollEventsSelected` | *Piano Roll Events Selected* |  |  |
| `Play.PianoRollMoveEvent` | *Piano Roll Move Event* |  |  |
| `Play.PianoRollMuteEvent` | *Piano Roll Mute Event* |  |  |
| `Play.PianoRollNoteOffsetChange` | *Piano Roll Note Offset Change* |  |  |
| `Play.PianoRollNoteVelocityChange` | *Piano Roll Note Velocity Change* |  |  |
| `Play.PianoRollShiftEvent` | *Piano Roll Shift Event* |  |  |
| `Play.PianoRollShiftPitch` | *Piano Roll Shift Pitch* |  |  |
| `Play.PluginRackCommand` | *Plugin Rack Command* |  |  |
| `Play.PostLoadFixup` | *Post Load Fixup* |  |  |
| `Play.PreviousFrame` | *Previous Frame* | `Ctrl+Num+- / Ctrl+F7` (everywhere) |  |
| `Play.Record` | *Record* | `Ctrl+R` (music editable) |  |
| `Play.Refresh` | *Refresh* | `F5` (Play) |  |
| `Play.RemoveFXSend` | *Remove FX Send* |  |  |
| `Play.RemoveLoadInsert` | *Remove Load Insert* |  |  |
| `Play.RemovePlugin` | *Remove Plugin* |  |  |
| `Play.ResetPlaybackOverrides` | *Reset Playback Overrides* |  |  |
| `Play.ResetSoundsMobile` | *Reset Sounds Mobile* |  |  |
| `Play.RetrospectiveRecord` | *Retrospective Record* | `Ctrl+Alt+R` (music editable) |  |
| `Play.Rewind` | *Rewind* | `Num+- / F7` (everywhere) |  |
| `Play.SaveAutomationEditorConfiguration` | *Save Automation Editor Configuration* |  |  |
| `Play.SavePlaybackTemplate` | *Save Playback Template* |  |  |
| `Play.SavePlaybackTemplateForEndpoint` | *Save Playback Template For Endpoint* |  |  |
| `Play.SetChordEndpoint` | *Set Chord Endpoint* |  |  |
| `Play.SetClickEndpoint` | *Set Click Endpoint* |  |  |
| `Play.SetCycleLeftLocator` | *Set Cycle Left Locator* |  |  |
| `Play.SetCycleLocatorsFromSelection` | *Set Cycle Locators From Selection* |  |  |
| `Play.SetCycleRightLocator` | *Set Cycle Right Locator* |  |  |
| `Play.SetEndpoint` | *Set Endpoint* |  |  |
| `Play.SetEndpointExpressionMap` | *Set Endpoint Expression Map* |  |  |
| `Play.SetEndpointPercussionMap` | *Set Endpoint Percussion Map* |  |  |
| `Play.SetFixedTempo` | *Set Fixed Tempo* |  |  |
| `Play.SetIRVState` | *Set IRV State* |  |  |
| `Play.SetKeyEditorTool1` | *Set Key Editor Tool1* | `Shift+Alt+1` (music editable) |  |
| `Play.SetKeyEditorTool2` | *Set Key Editor Tool2* | `Shift+Alt+2` (music editable) |  |
| `Play.SetKeyEditorTool3` | *Set Key Editor Tool3* | `Shift+Alt+3` (music editable) |  |
| `Play.SetKeyEditorTool4` | *Set Key Editor Tool4* | `Shift+Alt+4` (music editable) |  |
| `Play.SetKeyEditorTool5` | *Set Key Editor Tool5* | `Shift+Alt+5` (music editable) |  |
| `Play.SetKeyEditorTool6` | *Set Key Editor Tool6* | `Shift+Alt+6` (music editable) |  |
| `Play.SetMixerChannelName` | *Set Mixer Channel Name* |  |  |
| `Play.SetMixerSectionVisibility` | *Set Mixer Section Visibility* |  |  |
| `Play.SetMixerStripVisibility` | *Set Mixer Strip Visibility* |  |  |
| `Play.SetPlaybackOptions` | *Set Playback Options* |  |  |
| `Play.SetPlayheadTo` | *Set Playhead To* |  |  |
| `Play.SetPlayheadTo.PlayFromLocation` | *Set Playhead To › Play From Location* |  |  |
| `Play.SetPlayheadTo?PlayFromLocation=kSelection` | *Set Playhead To (PlayFromLocation=kSelection)* | `Alt+P` (everywhere) |  |
| `Play.SetPlayheadToFlowStart` | *Set Playhead To Flow Start* | `Num+.` (everywhere) |  |
| `Play.SetPlayheadToPoint` | *Set Playhead To Point* |  |  |
| `Play.SetPluginShownInUIState` | *Set Plugin Shown In UI State* |  |  |
| `Play.SetProjectAudioEngineState` | *Set Project Audio Engine State* |  |  |
| `Play.SetSendDestination` | *Set Send Destination* |  |  |
| `Play.SetTool` | *Set Tool* |  |  |
| `Play.SetTool.ToolName` | *Set Tool › Tool Name* |  |  |
| `Play.SetupExpressionMaps` | *Setup Expression Maps* |  |  |
| `Play.SetupPercussionMaps` | *Setup Percussion Maps* |  |  |
| `Play.SetupPluginPlayingTechniques` | *Setup Plugin Playing Techniques* |  |  |
| `Play.ShowChordTrack` | *Show Chord Track* |  |  |
| `Play.ShowInsert` | *Show Insert* |  |  |
| `Play.ShowLiveSpaceEditor` | *Show Live Space Editor* |  |  |
| `Play.ShowLiveStage` | *Show Live Stage* |  |  |
| `Play.ShowMarkerTrack` | *Show Marker Track* |  |  |
| `Play.ShowPlaybackOptions` | *Show Playback Options* | `Ctrl+Shift+P` (everywhere) |  |
| `Play.ShowPlugin` | *Show Plugin* |  |  |
| `Play.ShowPluginWindowForSelection` | *Show Plugin Window For Selection* |  |  |
| `Play.ShowTimeTrack` | *Show Time Track* |  |  |
| `Play.ShowVideoTrack` | *Show Video Track* |  |  |
| `Play.SoloFromSelection` | *Solo From Selection* | `Alt+S` (everywhere) |  |
| `Play.StartOrStop` | *Start Or Stop* |  |  |
| `Play.StartOrStop.PlayFromLocation` | *Start Or Stop › Play From Location* |  |  |
| `Play.StartOrStop?PlayFromLocation=kLastStartPosition` | Start or Stop Playback | `Shift+Space` (everywhere) |  |
| `Play.StartOrStop?PlayFromLocation=kPlayhead` | Start or Stop Playback | `Space / Enter / F8` (everywhere) |  |
| `Play.StartOrStop?PlayFromLocation=kSelection` | Start or Stop Playback | `P` (everywhere) |  |
| `Play.StartOrStop?PlayFromLocation=kStartOfFlow` | Start or Stop Playback | `Shift+Alt+Space` (everywhere) |  |
| `Play.StartScrubPlayback` | *Start Scrub Playback* | `Alt+Space` (music editable) |  |
| `Play.StartScrubSoloPlayback` | Start or Stop Playback [PlayFromLocation=kStartOfFlow] | `Shift+Alt+Space` (music editable) |  |
| `Play.Stop` | *Stop* | `Num+0` (everywhere) |  |
| `Play.StopScrubPlayback` | *Stop Scrub Playback* |  |  |
| `Play.SyncAutomation` | *Sync Automation* |  |  |
| `Play.ToggleScrubPlayback` | *Toggle Scrub Playback* |  |  |
| `Play.ToggleSnapToGrid` | *Toggle Snap To Grid* |  |  |
| `Play.UnMuteAll` | *Un Mute All* | `Alt+U` (everywhere) |  |
| `Play.UnSoloAll` | *Un Solo All* | `Shift+Alt+S` (everywhere) |  |

## Project

Project structure: players, instruments, flows, layouts, libraries

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `Project.AddChordDiagramToScoreLibrary` | *Add Chord Diagram To Score Library* |  |  |
| `Project.AddCustomEnsemble` | *Add Custom Ensemble* |  |  |
| `Project.AddEntitiesToScoreLibrary` | *Add Entities To Score Library* |  |  |
| `Project.ClearProofingSuppressions` | *Clear Proofing Suppressions* |  |  |
| `Project.DontShowChordDiagrams` | *Dont Show Chord Diagrams* |  |  |
| `Project.EditChordSymbolKerningPairs` | *Edit Chord Symbol Kerning Pairs* |  |  |
| `Project.EditInstrumentFamilies` | *Edit Instrument Families* |  |  |
| `Project.EditInstrumentScoreOrder` | *Edit Instrument Score Order* |  |  |
| `Project.EditInstruments` | *Edit Instruments* |  |  |
| `Project.Ensemble.Choose` | *Ensemble › Choose* | `Shift+E` (Setup) |  |
| `Project.Ensemble.New` | *Ensemble › New* |  |  |
| `Project.ExportLibrary` | *Export Library* |  |  |
| `Project.Flow.InitiateRename` | *Flow › Initiate Rename* |  |  |
| `Project.Flow.New` | New Flow | `Shift+F` (Setup) |  |
| `Project.Flow.NotationOptions` | Notation Options... | `Ctrl+Shift+N` (everywhere) |  |
| `Project.Flow.Rename` | *Flow › Rename* |  |  |
| `Project.Flow.SetNotationOptions` | *Flow › Set Notation Options* |  |  |
| `Project.Flows.Delete` | *Flows › Delete* |  |  |
| `Project.Flows.Duplicate` | *Flows › Duplicate* |  |  |
| `Project.Flows.ExcludePlayers` | *Flows › Exclude Players* |  |  |
| `Project.Flows.IncludePlayers` | *Flows › Include Players* |  |  |
| `Project.Flows.MoveLeftOne` | *Flows › Move Left One* |  |  |
| `Project.Flows.MoveRightOne` | *Flows › Move Right One* |  |  |
| `Project.Flows.MoveToEnd` | *Flows › Move To End* |  |  |
| `Project.Flows.MoveToStart` | *Flows › Move To Start* |  |  |
| `Project.Flows.Reorder` | *Flows › Reorder* |  |  |
| `Project.ImportLibrary` | *Import Library* |  |  |
| `Project.Instrument.Change` | *Instrument › Change* |  |  |
| `Project.Instrument.CopyToPlayer` | *Instrument › Copy To Player* |  |  |
| `Project.Instrument.CreateEmptyKit` | *Instrument › Create Empty Kit* |  |  |
| `Project.Instrument.Delete` | *Instrument › Delete* |  |  |
| `Project.Instrument.EditDefinition` | *Instrument › Edit Definition* |  |  |
| `Project.Instrument.EditPercussionKit` | *Instrument › Edit Percussion Kit* |  |  |
| `Project.Instrument.EditPlayingTechniquePresentation` | *Instrument › Edit Playing Technique Presentation* |  |  |
| `Project.Instrument.EditStringsAndTuning` | *Instrument › Edit Strings And Tuning* |  |  |
| `Project.Instrument.ImportKitfromLibrary` | *Instrument › Import Kitfrom Library* |  |  |
| `Project.Instrument.InitiateEditNames` | *Instrument › Initiate Edit Names* |  |  |
| `Project.Instrument.MoveToPlayer` | *Instrument › Move To Player* |  |  |
| `Project.Instrument.New` | Add Instrument to Player... | `Shift+I` (Setup) |  |
| `Project.Instrument.UpdateNames` | *Instrument › Update Names* |  |  |
| `Project.Instruments.CombineIntoKit` | *Instruments › Combine Into Kit* |  |  |
| `Project.Instruments.Renumber` | *Instruments › Renumber* |  |  |
| `Project.Instruments.Reorder` | *Instruments › Reorder* |  |  |
| `Project.Layout.AllPartOptions` | *Layout › All Part Options* |  |  |
| `Project.Layout.AllScoreOptions` | *Layout › All Score Options* |  |  |
| `Project.Layout.InitiateRename` | *Layout › Initiate Rename* |  |  |
| `Project.Layout.New` | *Layout › New* |  |  |
| `Project.Layout.New?Type=kCustomScoreLayout` | New Layout | `Shift+L` (Setup) |  |
| `Project.Layout.NewDefaultParts` | *Layout › New Default Parts* |  |  |
| `Project.Layout.NumberChange` | *Layout › Number Change* |  |  |
| `Project.Layout.Options` | Layout Options... | `Ctrl+Shift+L` (everywhere) |  |
| `Project.Layout.Rename` | *Layout › Rename* |  |  |
| `Project.Layout.ResetName` | *Layout › Reset Name* |  |  |
| `Project.Layout.SetFlowHeadingOverride` | *Layout › Set Flow Heading Override* |  |  |
| `Project.Layout.SetOptions` | *Layout › Set Options* |  |  |
| `Project.Layouts.ClefAndTranspositionOverrides` | *Layouts › Clef And Transposition Overrides* |  |  |
| `Project.Layouts.ClefAndTranspositionOverridesSetOverrides` | *Layouts › Clef And Transposition Overrides Set Overrides* |  |  |
| `Project.Layouts.Delete` | *Layouts › Delete* |  |  |
| `Project.Layouts.Duplicate` | *Layouts › Duplicate* |  |  |
| `Project.Layouts.ExcludeFlows` | *Layouts › Exclude Flows* |  |  |
| `Project.Layouts.ExcludePlayers` | *Layouts › Exclude Players* |  |  |
| `Project.Layouts.IncludeAllFlows` | *Layouts › Include All Flows* |  |  |
| `Project.Layouts.IncludeFlows` | *Layouts › Include Flows* |  |  |
| `Project.Layouts.IncludePlayers` | *Layouts › Include Players* |  |  |
| `Project.Layouts.MoveDownOne` | *Layouts › Move Down One* |  |  |
| `Project.Layouts.MoveToBottom` | *Layouts › Move To Bottom* |  |  |
| `Project.Layouts.MoveToTop` | *Layouts › Move To Top* |  |  |
| `Project.Layouts.MoveUpOne` | *Layouts › Move Up One* |  |  |
| `Project.Layouts.PropagateFormatting` | *Layouts › Propagate Formatting* |  |  |
| `Project.Layouts.RemoveAllFlows` | *Layouts › Remove All Flows* |  |  |
| `Project.Layouts.Renumber` | *Layouts › Renumber* |  |  |
| `Project.Layouts.Reorder` | *Layouts › Reorder* |  |  |
| `Project.Layouts.Sort` | *Layouts › Sort* |  |  |
| `Project.Player.AddToAllFlows` | *Player › Add To All Flows* |  |  |
| `Project.Player.AddToAllLayouts` | *Player › Add To All Layouts* |  |  |
| `Project.Player.AddToGroup` | *Player › Add To Group* |  |  |
| `Project.Player.AddToNewGroup` | *Player › Add To New Group* |  |  |
| `Project.Player.ChooseTranspositionForCapoChordSymbols` | *Player › Choose Transposition For Capo Chord Symbols* |  |  |
| `Project.Player.Duplicate` | *Player › Duplicate* |  |  |
| `Project.Player.Edit` | *Player › Edit* |  |  |
| `Project.Player.InitiateRename` | *Player › Initiate Rename* |  |  |
| `Project.Player.NavigateToNextItem` | *Player › Navigate To Next Item* |  |  |
| `Project.Player.NavigateToPrevItem` | *Player › Navigate To Prev Item* |  |  |
| `Project.Player.OpenAddInstrumentPopup` | *Player › Open Add Instrument Popup* |  |  |
| `Project.Player.RemoveFromAllFlows` | *Player › Remove From All Flows* |  |  |
| `Project.Player.RemoveFromAllLayouts` | *Player › Remove From All Layouts* |  |  |
| `Project.Player.RemoveFromGroup` | *Player › Remove From Group* |  |  |
| `Project.Player.Rename` | *Player › Rename* |  |  |
| `Project.Player.ResetName` | *Player › Reset Name* |  |  |
| `Project.Player.SetAsSoloist` | *Player › Set As Soloist* |  |  |
| `Project.Player.SetCapoChordSymbolVisibility` | *Player › Set Capo Chord Symbol Visibility* |  |  |
| `Project.Player.SetChordSymbolVisibility` | *Player › Set Chord Symbol Visibility* |  |  |
| `Project.Player.SetTranspositionForCapoChordSymbols` | *Player › Set Transposition For Capo Chord Symbols* |  |  |
| `Project.PlayerGroup.New` | *Player Group › New* |  |  |
| `Project.PlayerGroup.Rename` | *Player Group › Rename* |  |  |
| `Project.PlayerGroupRenameShowDialog` | *Player Group Rename Show Dialog* |  |  |
| `Project.PlayerGroups.Delete` | *Player Groups › Delete* |  |  |
| `Project.PlayerGroups.Move` | *Player Groups › Move* |  |  |
| `Project.PlayerGroups.MoveDownOneIndex` | *Player Groups › Move Down One Index* |  |  |
| `Project.PlayerGroups.MoveToBottomOfList` | *Player Groups › Move To Bottom Of List* |  |  |
| `Project.PlayerGroups.MoveToTopOfList` | *Player Groups › Move To Top Of List* |  |  |
| `Project.PlayerGroups.MoveUpOneIndex` | *Player Groups › Move Up One Index* |  |  |
| `Project.PlayerRenameShowDialog` | *Player Rename Show Dialog* |  |  |
| `Project.Players.Delete` | *Players › Delete* |  |  |
| `Project.Players.DeleteEmpty` | *Players › Delete Empty* |  |  |
| `Project.Players.Move` | *Players › Move* |  |  |
| `Project.Players.MoveDownOne` | *Players › Move Down One* |  |  |
| `Project.Players.MoveToBottom` | *Players › Move To Bottom* |  |  |
| `Project.Players.MoveToTop` | *Players › Move To Top* |  |  |
| `Project.Players.MoveUpOne` | *Players › Move Up One* |  |  |
| `Project.Players.Sort` | *Players › Sort* |  |  |
| `Project.SectionPlayer.New` | New Section Player... | `Shift+Alt+P` (Setup) |  |
| `Project.SelectNextProofingResult` | *Select Next Proofing Result* |  |  |
| `Project.SelectPreviousProofingResult` | *Select Previous Proofing Result* |  |  |
| `Project.SetInstrumentScoreOrder` | *Set Instrument Score Order* |  |  |
| `Project.SetLayoutSortOrder` | *Set Layout Sort Order* |  |  |
| `Project.SetScoreInfoInternal` | *Set Score Info Internal* |  |  |
| `Project.ShowLibraryImportExportDialog` | *Show Library Import Export Dialog* |  |  |
| `Project.SoloPlayer.New` | New Solo Player... | `Shift+P` (Setup) |  |
| `Project.Statistics` | *Statistics* |  |  |
| `Project.SuppressProofingResult` | *Suppress Proofing Result* |  |  |
| `Project.ToggleSuppressForSelectedProofingResult` | *Toggle Suppress For Selected Proofing Result* |  |  |

## EventEdit

Selection navigation and editing of events in the score

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `EventEdit.AddAndRemovePropertiesAtLocation` | *Add And Remove Properties At Location* |  |  |
| `EventEdit.ApplyInstrumentStringsAndTuningChange` | *Apply Instrument Strings And Tuning Change* |  |  |
| `EventEdit.ApplySingleTempoAtStart` | *Apply Single Tempo At Start* |  |  |
| `EventEdit.ChangeProperty` | *Change Property* |  |  |
| `EventEdit.ClearPlayedPitchesOfChordSymbol` | *Clear Played Pitches Of Chord Symbol* |  |  |
| `EventEdit.CopyShapeToMatchingChordSymbols` | *Copy Shape To Matching Chord Symbols* |  |  |
| `EventEdit.CopyToStaveAbove` | *Copy To Stave Above* |  |  |
| `EventEdit.CopyToStaveBelow` | *Copy To Stave Below* |  |  |
| `EventEdit.Delete` | *Delete* |  |  |
| `EventEdit.DurationDouble` | *Duration Double* |  |  |
| `EventEdit.DurationHalve` | *Duration Halve* |  |  |
| `EventEdit.DurationLengthen` | *Duration Lengthen* | `Ctrl+Shift+Alt+Right / Num+Ctrl+Shift+Alt+Right` (music editable) |  |
| `EventEdit.DurationLengthenByGrid` | Lengthen Duration [UseRhythmicGridValue=true] | `Shift+Alt+Right / Num+Shift+Alt+Right` (music editable) |  |
| `EventEdit.DurationLengthenByValue` | *Duration Lengthen By Value* |  |  |
| `EventEdit.DurationShorten` | *Duration Shorten* | `Ctrl+Shift+Alt+Left / Num+Ctrl+Shift+Alt+Left` (music editable) |  |
| `EventEdit.DurationShortenByGrid` | Shorten Duration [UseRhythmicGridValue=true] | `Shift+Alt+Left / Num+Shift+Alt+Left` (music editable) |  |
| `EventEdit.DurationShortenByValue` | *Duration Shorten By Value* |  |  |
| `EventEdit.DynamicIntensityDecrease` | *Dynamic Intensity Decrease* |  |  |
| `EventEdit.DynamicIntensityIncrease` | *Dynamic Intensity Increase* |  |  |
| `EventEdit.EditExistingArpeggio` | *Edit Existing Arpeggio* |  |  |
| `EventEdit.EditExistingBarRepeatRegion` | *Edit Existing Bar Repeat Region* |  |  |
| `EventEdit.EditExistingChordSymbolVisibilityEvent` | *Edit Existing Chord Symbol Visibility Event* |  |  |
| `EventEdit.EditExistingClef` | *Edit Existing Clef* |  |  |
| `EventEdit.EditExistingComment` | *Edit Existing Comment* |  |  |
| `EventEdit.EditExistingCue` | *Edit Existing Cue* |  |  |
| `EventEdit.EditExistingDynamic` | *Edit Existing Dynamic* |  |  |
| `EventEdit.EditExistingGlissando` | *Edit Existing Glissando* |  |  |
| `EventEdit.EditExistingHoldOrPause` | *Edit Existing Hold Or Pause* |  |  |
| `EventEdit.EditExistingKeySignature` | *Edit Existing Key Signature* |  |  |
| `EventEdit.EditExistingMIDITriggerEvent` | *Edit Existing MIDI Trigger Event* |  |  |
| `EventEdit.EditExistingOctaveLine` | *Edit Existing Octave Line* |  |  |
| `EventEdit.EditExistingOrEnterStepTimeInput` | Start Note Input [Set=true] | `Return` (Write) |  |
| `EventEdit.EditExistingOrnament` | *Edit Existing Ornament* |  |  |
| `EventEdit.EditExistingPedalLine` | *Edit Existing Pedal Line* |  |  |
| `EventEdit.EditExistingPlayingTechnique` | *Edit Existing Playing Technique* |  |  |
| `EventEdit.EditExistingRepeatMarker` | *Edit Existing Repeat Marker* |  |  |
| `EventEdit.EditExistingRhythmicFeel` | *Edit Existing Rhythmic Feel* |  |  |
| `EventEdit.EditExistingRomanNumeral` | *Edit Existing Roman Numeral* |  |  |
| `EventEdit.EditExistingSlashRegion` | *Edit Existing Slash Region* |  |  |
| `EventEdit.EditExistingTempo` | *Edit Existing Tempo* |  |  |
| `EventEdit.EditExistingTimeSignature` | *Edit Existing Time Signature* |  |  |
| `EventEdit.EditExistingTrill` | *Edit Existing Trill* |  |  |
| `EventEdit.ExtendToEndOfSelection` | *Extend To End Of Selection* |  |  |
| `EventEdit.ExtendToNextEvent` | *Extend To Next Event* |  |  |
| `EventEdit.Glue` | *Glue* |  |  |
| `EventEdit.MoveLeft` | Move [Direction=Left] | `Alt+Left / Alt+Num+Left` (music editable) |  |
| `EventEdit.MoveLeftByGrid` | *Move Left By Grid* | `Ctrl+Alt+Left / Ctrl+Alt+Num+Left` (music editable) |  |
| `EventEdit.MoveLeftByValue` | *Move Left By Value* |  |  |
| `EventEdit.MoveMarker` | *Move Marker* |  |  |
| `EventEdit.MoveRight` | Move [Direction=Right] | `Alt+Right / Alt+Num+Right` (music editable) |  |
| `EventEdit.MoveRightByGrid` | *Move Right By Grid* | `Ctrl+Alt+Right / Ctrl+Alt+Num+Right` (music editable) |  |
| `EventEdit.MoveRightByValue` | *Move Right By Value* |  |  |
| `EventEdit.MoveToStaveAbove` | *Move To Stave Above* | `Alt+N` (everywhere) |  |
| `EventEdit.MoveToStaveBelow` | *Move To Stave Below* | `Alt+M` (everywhere) |  |
| `EventEdit.NavigateDown` | Navigate Down | `Down / Num+Down` (music editable) |  |
| `EventEdit.NavigateDownExtend` | *Navigate Down Extend* | `Shift+Down / Shift+Num+Down` (music editable) |  |
| `EventEdit.NavigateDownExtendBottom` | *Navigate Down Extend Bottom* | `Shift+Ctrl+Down / Shift+Ctrl+Num+Down` (music editable) |  |
| `EventEdit.NavigateDownNextStave` | *Navigate Down Next Stave* | `Ctrl+Down / Num+Ctrl+Down` (music editable) |  |
| `EventEdit.NavigateLeft` | Select Left | `Left / Num+Left` (music editable) |  |
| `EventEdit.NavigateLeftBar` | Select Left by Bar | `Ctrl+Left / Ctrl+Num+Left` (music editable) |  |
| `EventEdit.NavigateLeftExtend` | Extend Selection Left | `Shift+Left / Shift+Num+Left` (music editable) |  |
| `EventEdit.NavigateLeftExtendBar` | *Navigate Left Extend Bar* | `Shift+Ctrl+Left / Shift+Ctrl+Num+Left` (music editable) |  |
| `EventEdit.NavigateNextBarline` | *Navigate Next Barline* |  |  |
| `EventEdit.NavigateNextFragment` | Navigate to the Next Fragment | `Tab` (Engrave) |  |
| `EventEdit.NavigateNextItemSamePosition` | Navigate to the Next Fragment | `Tab` (Write) |  |
| `EventEdit.NavigatePreviousBarline` | *Navigate Previous Barline* |  |  |
| `EventEdit.NavigatePreviousFragment` | *Navigate Previous Fragment* | `Shift+Tab` (Engrave) |  |
| `EventEdit.NavigatePreviousItemSamePosition` | *Navigate Previous Item Same Position* | `Shift+Tab` (Write) |  |
| `EventEdit.NavigateRight` | Select Right | `Right / Num+Right` (music editable) |  |
| `EventEdit.NavigateRightBar` | Select Right by Bar | `Ctrl+Right / Ctrl+Num+Right` (music editable) |  |
| `EventEdit.NavigateRightExtend` | Extend Selection Right | `Shift+Right / Shift+Num+Right` (music editable) |  |
| `EventEdit.NavigateRightExtendBar` | *Navigate Right Extend Bar* | `Shift+Ctrl+Right / Shift+Ctrl+Num+Right` (music editable) |  |
| `EventEdit.NavigateStaveDown` | *Navigate Stave Down* |  |  |
| `EventEdit.NavigateStaveUp` | *Navigate Stave Up* |  |  |
| `EventEdit.NavigateUp` | Navigate Up | `Up / Num+Up` (music editable) |  |
| `EventEdit.NavigateUpExtend` | *Navigate Up Extend* | `Shift+Up / Shift+Num+Up` (music editable) |  |
| `EventEdit.NavigateUpExtendTop` | *Navigate Up Extend Top* | `Shift+Ctrl+Up / Shift+Ctrl+Num+Up` (music editable) |  |
| `EventEdit.NavigateUpNextStave` | *Navigate Up Next Stave* | `Ctrl+Up / Num+Ctrl+Up` (music editable) |  |
| `EventEdit.Nudge` | *Nudge* |  |  |
| `EventEdit.Nudge?Direction=Down&Amount=kALittle` | Nudge | `Alt+Down / Alt+Num+Down` (Engrave) |  |
| `EventEdit.Nudge?Direction=Down&Amount=kALittle&AlternateNudgeMode=true` | *Nudge (Direction=Down, Amount=kALittle, AlternateNudgeMode=true)* | `Alt+J` (Engrave) |  |
| `EventEdit.Nudge?Direction=Down&Amount=kALot` | Nudge | `Ctrl+Alt+Down / Ctrl+Alt+Num+Down` (Engrave) |  |
| `EventEdit.Nudge?Direction=Down&Amount=kALot&AlternateNudgeMode=true` | *Nudge (Direction=Down, Amount=kALot, AlternateNudgeMode=true)* | `Ctrl+Alt+J` (Engrave) |  |
| `EventEdit.Nudge?Direction=Down&Amount=kATinyAmount` | *Nudge (Direction=Down, Amount=kATinyAmount)* | `Ctrl+Shift+Alt+Down / Ctrl+Shift+Alt+Num+Down` (Engrave) |  |
| `EventEdit.Nudge?Direction=Down&Amount=kModerate` | Pitch | `Shift+Alt+Down / Shift+Alt+Num+Down` (Engrave) |  |
| `EventEdit.Nudge?Direction=Left&Amount=kALittle` | Nudge | `Alt+Left / Alt+Num+Left` (Engrave) |  |
| `EventEdit.Nudge?Direction=Left&Amount=kALittle&AlternateNudgeMode=true` | *Nudge (Direction=Left, Amount=kALittle, AlternateNudgeMode=true)* | `Alt+H` (Engrave) |  |
| `EventEdit.Nudge?Direction=Left&Amount=kALot` | Nudge | `Ctrl+Alt+Left / Ctrl+Alt+Num+Left` (Engrave) |  |
| `EventEdit.Nudge?Direction=Left&Amount=kALot&AlternateNudgeMode=true` | *Nudge (Direction=Left, Amount=kALot, AlternateNudgeMode=true)* | `Ctrl+Alt+H` (Engrave) |  |
| `EventEdit.Nudge?Direction=Left&Amount=kATinyAmount` | *Nudge (Direction=Left, Amount=kATinyAmount)* | `Ctrl+Shift+Alt+Left / Ctrl+Shift+Alt+Num+Left` (Engrave) |  |
| `EventEdit.Nudge?Direction=Left&Amount=kModerate` | Shorten Duration | `Shift+Alt+Left / Shift+Alt+Num+Left` (Engrave) |  |
| `EventEdit.Nudge?Direction=Right&Amount=kALittle` | Nudge | `Alt+Right / Alt+Num+Right` (Engrave) |  |
| `EventEdit.Nudge?Direction=Right&Amount=kALittle&AlternateNudgeMode=true` | *Nudge (Direction=Right, Amount=kALittle, AlternateNudgeMode=true)* | `Alt+L` (Engrave) |  |
| `EventEdit.Nudge?Direction=Right&Amount=kALot` | Nudge | `Ctrl+Alt+Right / Ctrl+Alt+Num+Right` (Engrave) |  |
| `EventEdit.Nudge?Direction=Right&Amount=kALot&AlternateNudgeMode=true` | *Nudge (Direction=Right, Amount=kALot, AlternateNudgeMode=true)* | `Ctrl+Alt+L` (Engrave) |  |
| `EventEdit.Nudge?Direction=Right&Amount=kATinyAmount` | *Nudge (Direction=Right, Amount=kATinyAmount)* | `Ctrl+Shift+Alt+Right / Ctrl+Shift+Alt+Num+Right` (Engrave) |  |
| `EventEdit.Nudge?Direction=Right&Amount=kModerate` | Lengthen Duration | `Shift+Alt+Right / Shift+Alt+Num+Right` (Engrave) |  |
| `EventEdit.Nudge?Direction=Up&Amount=kALittle` | Nudge | `Alt+Up / Alt+Num+Up` (Engrave) |  |
| `EventEdit.Nudge?Direction=Up&Amount=kALittle&AlternateNudgeMode=true` | *Nudge (Direction=Up, Amount=kALittle, AlternateNudgeMode=true)* | `Alt+K` (Engrave) |  |
| `EventEdit.Nudge?Direction=Up&Amount=kALot` | Nudge | `Ctrl+Alt+Up / Ctrl+Alt+Num+Up` (Engrave) |  |
| `EventEdit.Nudge?Direction=Up&Amount=kALot&AlternateNudgeMode=true` | *Nudge (Direction=Up, Amount=kALot, AlternateNudgeMode=true)* | `Ctrl+Alt+K` (Engrave) |  |
| `EventEdit.Nudge?Direction=Up&Amount=kATinyAmount` | *Nudge (Direction=Up, Amount=kATinyAmount)* | `Ctrl+Shift+Alt+Up / Ctrl+Shift+Alt+Num+Up` (Engrave) |  |
| `EventEdit.Nudge?Direction=Up&Amount=kModerate` | Pitch | `Shift+Alt+Up / Shift+Alt+Num+Up` (Engrave) |  |
| `EventEdit.ResetChordDiagramFingerNumbering` | *Reset Chord Diagram Finger Numbering* |  |  |
| `EventEdit.Select` | *Select* |  |  |
| `EventEdit.SetCapoChordDiagram` | *Set Capo Chord Diagram* |  |  |
| `EventEdit.SetSpecificChordDiagramForTuning` | *Set Specific Chord Diagram For Tuning* |  |  |
| `EventEdit.ShortenToNextEvent` | *Shorten To Next Event* |  |  |
| `EventEdit.ShowAllChordDiagramVariantsForPlayer` | *Show All Chord Diagram Variants For Player* | `Shift+Alt+Q` (music editable) |  |
| `EventEdit.ShowNextChordDiagramVariant` | *Show Next Chord Diagram Variant* | `Alt+Q` (music editable) |  |
| `EventEdit.Split` | *Split* |  |  |
| `EventEdit.SwapStaves` | *Swap Staves* |  |  |
| `EventEdit.Trim` | *Trim* |  |  |

## Filter

Edit › Filter: select only/deselect by item type

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `Filter.AllDoubleFlatNotes` | *All Double Flat Notes* |  |  |
| `Filter.AllDoubleSharpNotes` | *All Double Sharp Notes* |  |  |
| `Filter.AllFlatNotes` | *All Flat Notes* |  |  |
| `Filter.AllSharpNotes` | *All Sharp Notes* |  |  |
| `Filter.AllTripleFlatNotes` | *All Triple Flat Notes* |  |  |
| `Filter.AllTripleSharpNotes` | *All Triple Sharp Notes* |  |  |
| `Filter.ArpeggioSigns` | *Arpeggio Signs* |  |  |
| `Filter.BarRepeatRegions` | *Bar Repeat Regions* |  |  |
| `Filter.Breaks` | *Breaks* |  |  |
| `Filter.ChordSymbolRegions` | *Chord Symbol Regions* |  |  |
| `Filter.ChordSymbols` | *Chord Symbols* |  |  |
| `Filter.Clefs` | *Clefs* |  |  |
| `Filter.Comments` | *Comments* |  |  |
| `Filter.CondensingChanges` | *Condensing Changes* |  |  |
| `Filter.CoordinationLines` | *Coordination Lines* |  |  |
| `Filter.Cues` | *Cues* |  |  |
| `Filter.Cutaways` | *Cutaways* |  |  |
| `Filter.Dynamics` | *Dynamics* |  |  |
| `Filter.FiguredBass` | *Figured Bass* |  |  |
| `Filter.FrameBreaks` | *Frame Breaks* |  |  |
| `Filter.GlissandoLines` | *Glissando Lines* |  |  |
| `Filter.GraceNotes` | *Grace Notes* |  |  |
| `Filter.GradualDynamics` | *Gradual Dynamics* |  |  |
| `Filter.GradualTempo` | *Gradual Tempo* |  |  |
| `Filter.GuitarBends` | *Guitar Bends* |  |  |
| `Filter.HarpPedals` | *Harp Pedals* |  |  |
| `Filter.HoldsAndPauses` | *Holds And Pauses* |  |  |
| `Filter.HorizontalLines` | *Horizontal Lines* |  |  |
| `Filter.ImmediateDynamics` | *Immediate Dynamics* |  |  |
| `Filter.ImmediateTempoAbsolute` | *Immediate Tempo Absolute* |  |  |
| `Filter.ImmediateTempoRelative` | *Immediate Tempo Relative* |  |  |
| `Filter.KeySignatures` | *Key Signatures* |  |  |
| `Filter.Lyrics` | *Lyrics* |  |  |
| `Filter.LyricsAboveStaff` | *Lyrics Above Staff* |  |  |
| `Filter.LyricsBelowStaff` | *Lyrics Below Staff* |  |  |
| `Filter.LyricsChorus` | *Lyrics Chorus* |  |  |
| `Filter.LyricsLine1` | *Lyrics Line1* |  |  |
| `Filter.LyricsLine2` | *Lyrics Line2* |  |  |
| `Filter.LyricsLine3` | *Lyrics Line3* |  |  |
| `Filter.LyricsLine4` | *Lyrics Line4* |  |  |
| `Filter.LyricsLine5` | *Lyrics Line5* |  |  |
| `Filter.LyricsTranslation` | *Lyrics Translation* |  |  |
| `Filter.Markers` | *Markers* |  |  |
| `Filter.NoteSpacingChanges` | *Note Spacing Changes* |  |  |
| `Filter.NotesAndChords` | *Notes And Chords* |  |  |
| `Filter.NotesInChordsFromBottom` | *Notes In Chords From Bottom* |  |  |
| `Filter.NotesInChordsFromBottom1` | *Notes In Chords From Bottom1* |  |  |
| `Filter.NotesInChordsFromBottom2` | *Notes In Chords From Bottom2* |  |  |
| `Filter.NotesInChordsFromBottom3` | *Notes In Chords From Bottom3* |  |  |
| `Filter.NotesInChordsFromBottom4` | *Notes In Chords From Bottom4* |  |  |
| `Filter.NotesInChordsFromBottom5` | *Notes In Chords From Bottom5* |  |  |
| `Filter.NotesInChordsFromTop` | *Notes In Chords From Top* |  |  |
| `Filter.NotesInChordsFromTop1` | *Notes In Chords From Top1* |  |  |
| `Filter.NotesInChordsFromTop2` | *Notes In Chords From Top2* |  |  |
| `Filter.NotesInChordsFromTop3` | *Notes In Chords From Top3* |  |  |
| `Filter.NotesInChordsFromTop4` | *Notes In Chords From Top4* |  |  |
| `Filter.NotesInChordsFromTop5` | *Notes In Chords From Top5* |  |  |
| `Filter.NotesOfPitch` | *Notes Of Pitch* |  |  |
| `Filter.NotesOfPitches` | *Notes Of Pitches* |  |  |
| `Filter.OctaveLines` | *Octave Lines* |  |  |
| `Filter.OrnamentsAndTrills` | *Ornaments And Trills* |  |  |
| `Filter.PedalLines` | *Pedal Lines* |  |  |
| `Filter.PlayingTechniqueByEntityID` | *Playing Technique By Entity ID* |  |  |
| `Filter.PlayingTechniques` | *Playing Techniques* |  |  |
| `Filter.RehearsalMarks` | *Rehearsal Marks* |  |  |
| `Filter.RepeatEndings` | *Repeat Endings* |  |  |
| `Filter.RepeatMarkers` | *Repeat Markers* |  |  |
| `Filter.Rests` | *Rests* |  |  |
| `Filter.RhythmSlashRegions` | *Rhythm Slash Regions* |  |  |
| `Filter.Slurs` | *Slurs* |  |  |
| `Filter.SuppressedPlayback` | *Suppressed Playback* |  |  |
| `Filter.SystemBreaks` | *System Breaks* |  |  |
| `Filter.Tempo` | *Tempo* |  |  |
| `Filter.Text` | *Text* |  |  |
| `Filter.TextUsingParagraphStyle` | *Text Using Paragraph Style* |  |  |
| `Filter.TimeSignatures` | *Time Signatures* |  |  |
| `Filter.Tuplets` | *Tuplets* |  |  |
| `Filter.VerticalLines` | *Vertical Lines* |  |  |
| `Filter.Voice` | *Voice* |  |  |
| `Filter.VoiceAllDownStem` | *Voice All Down Stem* |  |  |
| `Filter.VoiceAllSlashes` | *Voice All Slashes* |  |  |
| `Filter.VoiceAllUpStem` | *Voice All Up Stem* |  |  |
| `Filter.VoiceDownstem1` | *Voice Downstem1* |  |  |
| `Filter.VoiceDownstem2` | *Voice Downstem2* |  |  |
| `Filter.VoiceDownstem3` | *Voice Downstem3* |  |  |
| `Filter.VoiceDownstem4` | *Voice Downstem4* |  |  |
| `Filter.VoiceDownstemSlash1` | *Voice Downstem Slash1* |  |  |
| `Filter.VoiceDownstemSlash2` | *Voice Downstem Slash2* |  |  |
| `Filter.VoiceStemlessSlash1` | *Voice Stemless Slash1* |  |  |
| `Filter.VoiceStemlessSlash2` | *Voice Stemless Slash2* |  |  |
| `Filter.VoiceUpstem1` | *Voice Upstem1* |  |  |
| `Filter.VoiceUpstem2` | *Voice Upstem2* |  |  |
| `Filter.VoiceUpstem3` | *Voice Upstem3* |  |  |
| `Filter.VoiceUpstem4` | *Voice Upstem4* |  |  |
| `Filter.VoiceUpstemSlash1` | *Voice Upstem Slash1* |  |  |
| `Filter.VoiceUpstemSlash2` | *Voice Upstem Slash2* |  |  |

## Page

Engrave mode pages, page templates, frames, flow headings

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `Page.AddFlowHeadingChange` | *Add Flow Heading Change* |  | `projectwindow/engravemode/pagespanel/pages` |
| `Page.AddMasterPageChange` | *Add Master Page Change* |  | `projectwindow/engravemode/pagespanel/pages` |
| `Page.AddPageNumberChange` | *Add Page Number Change* |  | `projectwindow/engravemode/pagespanel/pages` |
| `Page.AddRangeToPagePanelSelection` | *Add Range To Page Panel Selection* |  |  |
| `Page.AddToPagePanelSelection` | *Add To Page Panel Selection* |  |  |
| `Page.ApplyMasterPageEditor` | *Apply Master Page Editor* |  |  |
| `Page.ClearAllDefinitionOverrides` | *Clear All Definition Overrides* |  |  |
| `Page.ClearAllPageNumberChanges` | *Clear All Page Number Changes* |  |  |
| `Page.ClearDefinitionOverride` | *Clear Definition Override* |  |  |
| `Page.ClearFlowHeadingSelection` | *Clear Flow Heading Selection* |  |  |
| `Page.ClearMasterPagePairSelection` | *Clear Master Page Pair Selection* |  |  |
| `Page.ClearPageNumberChange` | *Clear Page Number Change* |  |  |
| `Page.ClearPagePanelSelection` | *Clear Page Panel Selection* |  |  |
| `Page.CloseMasterPageEditor` | *Close Master Page Editor* |  |  |
| `Page.CopySelectedFramesToSelectedPages` | *Copy Selected Frames To Selected Pages* |  |  |
| `Page.CreateFlowHeadingInSet` | *Create Flow Heading In Set* |  | `projectwindow/engravemode/pagespanel/flowheadings` |
| `Page.CreateFrame` | *Create Frame* |  |  |
| `Page.CreateMasterPagePairInSet` | *Create Master Page Pair In Set* |  | `projectwindow/engravemode/pagespanel/pagetemplates` |
| `Page.CreateNewMusicFrameChainForFrame` | *Create New Music Frame Chain For Frame* |  |  |
| `Page.CreateNewTextFlowAndUseInFrame` | *Create New Text Flow And Use In Frame* |  |  |
| `Page.CreatePagePairDefinitionSet` | *Create Page Pair Definition Set* |  |  |
| `Page.DeleteAllFlowHeadingChanges` | *Delete All Flow Heading Changes* |  |  |
| `Page.DeleteAllMasterPageChanges` | *Delete All Master Page Changes* |  |  |
| `Page.DeleteFlowHeadingChange` | *Delete Flow Heading Change* |  |  |
| `Page.DeleteFlowHeadingInSet` | *Delete Flow Heading In Set* |  |  |
| `Page.DeleteMasterPageChange` | *Delete Master Page Change* |  |  |
| `Page.DeleteMasterPagePairInSet` | *Delete Master Page Pair In Set* |  |  |
| `Page.DeletePagePairDefinitionSet` | *Delete Page Pair Definition Set* |  |  |
| `Page.EditFlowHeading` | *Edit Flow Heading* |  | `projectwindow/engravemode/pagespanel/flowheadings` |
| `Page.EditFlowHeadingInfo` | *Edit Flow Heading Info* |  |  |
| `Page.EditMasterPagePair` | *Edit Master Page Pair* |  | `projectwindow/engravemode/pagespanel/pagetemplates` |
| `Page.EditMasterPagePairInfo` | *Edit Master Page Pair Info* |  | `projectwindow/engravemode/pagespanel/pagetemplates` |
| `Page.ExportGraphicSlices` | *Export Graphic Slices* |  |  |
| `Page.ExportPagePairDefinitionSet` | *Export Page Pair Definition Set* |  |  |
| `Page.ImportMasterPagePair` | *Import Master Page Pair* |  |  |
| `Page.ImportPagePairDefinitionSet` | *Import Page Pair Definition Set* |  |  |
| `Page.InsertPages` | *Insert Pages* |  | `projectwindow/engravemode/pagespanel/pages` |
| `Page.LoadCreateFrameCursor` | *Load Create Frame Cursor* |  |  |
| `Page.LoadCreateFrameCursor?Type=kGraphic` | *Load Create Frame Cursor (Type=kGraphic)* |  |  |
| `Page.LoadCreateFrameCursor?Type=kGraphicSlice` | *Load Create Frame Cursor (Type=kGraphicSlice)* |  | `projectwindow/engravemode/graphicslicespanel` |
| `Page.LoadCreateFrameCursor?Type=kMusic` | *Load Create Frame Cursor (Type=kMusic)* |  | `projectwindow/engravemode/framespanel/frames` |
| `Page.LoadCreateFrameCursor?Type=kText` | *Load Create Frame Cursor (Type=kText)* |  | `projectwindow/engravemode/framespanel/frames` |
| `Page.LockFrame` | *Lock Frame* |  |  |
| `Page.LockLayout` | *Lock Layout* |  |  |
| `Page.LockSystem` | *Lock System* |  |  |
| `Page.MakeIntoFrame` | *Make Into Frame* |  |  |
| `Page.MakeIntoSystem` | *Make Into System* |  |  |
| `Page.MasterPageCopyLeftToRight` | *Master Page Copy Left To Right* |  | `projectwindow/engravemode/masterpageeditortoolbar` |
| `Page.MasterPageCopyRightToLeft` | *Master Page Copy Right To Left* |  | `projectwindow/engravemode/masterpageeditortoolbar` |
| `Page.MoveBarsToNextSystem` | *Move Bars To Next System* | `.` (Engrave) |  |
| `Page.MoveBarsToPreviousSystem` | Rests | `,` (Engrave) |  |
| `Page.MovePages` | *Move Pages* |  |  |
| `Page.MovePagesEarlier` | *Move Pages Earlier* |  | `projectwindow/engravemode/pagespanel/pages` |
| `Page.MovePagesLater` | *Move Pages Later* |  |  |
| `Page.NavigateTo` | *Navigate To* |  |  |
| `Page.OpenEditorForTextFrameContents` | *Open Editor For Text Frame Contents* |  |  |
| `Page.RemoveFromPagePanelSelection` | *Remove From Page Panel Selection* |  |  |
| `Page.RenamePagePairDefinitionSet` | *Rename Page Pair Definition Set* |  |  |
| `Page.SelectFlowHeading` | *Select Flow Heading* |  |  |
| `Page.SelectMasterPagePair` | *Select Master Page Pair* |  |  |
| `Page.SetFrameConstraints` | *Set Frame Constraints* |  |  |
| `Page.SetGraphicSliceDataInternal` | *Set Graphic Slice Data Internal* |  |  |
| `Page.SetLayoutPagePairDefinitionSetID` | *Set Layout Page Pair Definition Set ID* |  |  |
| `Page.SetMusicFrameChainFilter` | *Set Music Frame Chain Filter* |  |  |
| `Page.SetMusicFrameChainForFrame` | *Set Music Frame Chain For Frame* |  |  |
| `Page.SetMusicFrameIndexForFrame` | *Set Music Frame Index For Frame* |  |  |
| `Page.SetTextFlowContents` | *Set Text Flow Contents* |  |  |
| `Page.SetTextFrameChainToDefaultContent` | *Set Text Frame Chain To Default Content* |  |  |
| `Page.ShowFrameChainSelector` | *Show Frame Chain Selector* |  |  |
| `Page.ShowFrameFlowSelector` | *Show Frame Flow Selector* |  |  |
| `Page.ShowFrameIndexSelector` | *Show Frame Index Selector* |  |  |
| `Page.ShowFramePlayerSelector` | *Show Frame Player Selector* |  |  |
| `Page.ShowOpenDialogForGraphicFrame` | *Show Open Dialog For Graphic Frame* |  |  |
| `Page.ToggleFrameConstraints` | *Toggle Frame Constraints* |  |  |
| `Page.ToggleFrameConstraints?Side=kBottom` | *Toggle Frame Constraints (Side=kBottom)* |  | `projectwindow/engravemode/framespanel/constraints` |
| `Page.ToggleFrameConstraints?Side=kLeft` | *Toggle Frame Constraints (Side=kLeft)* |  | `projectwindow/engravemode/framespanel/constraints` |
| `Page.ToggleFrameConstraints?Side=kRight` | *Toggle Frame Constraints (Side=kRight)* |  | `projectwindow/engravemode/framespanel/constraints` |
| `Page.ToggleFrameConstraints?Side=kTop` | *Toggle Frame Constraints (Side=kTop)* |  | `projectwindow/engravemode/framespanel/constraints` |
| `Page.UnlockLayout` | *Unlock Layout* |  |  |

## View

View menu: zoom, view types, signposts, colours

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `View.CentreSelection` | *Centre Selection* |  |  |
| `View.Collapse` | *Collapse* |  |  |
| `View.CollapseAll` | *Collapse All* |  |  |
| `View.EditGridOptions` | *Edit Grid Options* |  |  |
| `View.Expand` | *Expand* |  |  |
| `View.ExpandAll` | *Expand All* |  |  |
| `View.FullScreen` | *Full Screen* | `Ctrl+Meta+F` (everywhere) |  |
| `View.HideInvisibles` | *Hide Invisibles* | ``` (everywhere) |  |
| `View.MarqueeZoom` | *Marquee Zoom* |  |  |
| `View.MoveViewportDown` | Move View Down | `PgDown` (everywhere) |  |
| `View.MoveViewportLeft` | Move View Left | `Home` (everywhere) |  |
| `View.MoveViewportNextPage` | Select Right | `Right / Num+Right / Down / Num+Down / PgDown` (Read) |  |
| `View.MoveViewportNextSpread` | *Move Viewport Next Spread* |  |  |
| `View.MoveViewportPreviousPage` | Select Left | `Left / Num+Left / Up / Num+Up / PgUp` (Read) |  |
| `View.MoveViewportPreviousSpread` | *Move Viewport Previous Spread* |  |  |
| `View.MoveViewportRight` | Move View Right | `End` (everywhere) |  |
| `View.MoveViewportToEnd` | Move View to End | `Ctrl+End` (everywhere) |  |
| `View.MoveViewportToStart` | Move View to Start | `Ctrl+Home` (everywhere) |  |
| `View.MoveViewportUp` | Move View Up | `PgUp` (everywhere) |  |
| `View.OptionsShowDialog` | Paste Special... | `Ctrl+Shift+V` (everywhere) |  |
| `View.ResetOptionsToFactory` | *Reset Options To Factory* |  |  |
| `View.ResetOptionsToSavedDefaults` | *Reset Options To Saved Defaults* |  |  |
| `View.SetAllSignpostFlagTypesHidden` | *Set All Signpost Flag Types Hidden* |  |  |
| `View.SetAllSignpostFlagTypesShown` | *Set All Signpost Flag Types Shown* |  |  |
| `View.SetBarNumbersShownInLayoutAspectType` | *Set Bar Numbers Shown In Layout Aspect Type* |  |  |
| `View.SetNoteColoursOptions` | *Set Note Colours Options* |  |  |
| `View.SetPagePositionPolicy` | *Set Page Position Policy* |  |  |
| `View.SetPagePositionPolicy?PagePositionPolicy=kSingleHorizontal` | *Set Page Position Policy (PagePositionPolicy=kSingleHorizontal)* |  | `projectwindow/statusbar` |
| `View.SetPagePositionPolicy?PagePositionPolicy=kSingleVertical` | *Set Page Position Policy (PagePositionPolicy=kSingleVertical)* |  | `projectwindow/statusbar` |
| `View.SetPagePositionPolicy?PagePositionPolicy=kSpreadHorizontal` | *Set Page Position Policy (PagePositionPolicy=kSpreadHorizontal)* |  | `projectwindow/statusbar` |
| `View.SetPagePositionPolicy?PagePositionPolicy=kSpreadVertical` | *Set Page Position Policy (PagePositionPolicy=kSpreadVertical)* |  | `projectwindow/statusbar` |
| `View.SetSignpostFlagTypeShown` | *Set Signpost Flag Type Shown* |  |  |
| `View.ShowInvisibles` | *Show Invisibles* |  |  |
| `View.ShowSystemTrack` | *Show System Track* | `Alt+T` (everywhere) |  |
| `View.ToggleAttachmentLines` | *Toggle Attachment Lines* |  |  |
| `View.ToggleCautionaryAccidentals` | *Toggle Cautionary Accidentals* |  |  |
| `View.ToggleContradictoryAccidentals` | *Toggle Contradictory Accidentals* |  |  |
| `View.ToggleForcedAccidentals` | *Toggle Forced Accidentals* |  |  |
| `View.ToggleHighlightBarRepeatRegions` | *Toggle Highlight Bar Repeat Regions* |  |  |
| `View.ToggleHighlightChordSymbolVisibilityRegions` | *Toggle Highlight Chord Symbol Visibility Regions* |  |  |
| `View.ToggleHighlightCues` | *Toggle Highlight Cues* |  |  |
| `View.ToggleHighlightMIDITriggerRegions` | *Toggle Highlight MIDI Trigger Regions* |  |  |
| `View.ToggleHighlightSlashRegions` | *Toggle Highlight Slash Regions* |  |  |
| `View.ToggleShowComments` | *Toggle Show Comments* |  |  |
| `View.ToggleShowCondensedMusicInGrey` | *Toggle Show Condensed Music In Grey* |  |  |
| `View.ToggleShowCrosshairWhenDragging` | *Toggle Show Crosshair When Dragging* |  |  |
| `View.ToggleShowCrosshairWithSelection` | *Toggle Show Crosshair With Selection* |  |  |
| `View.ToggleShowCuesInGrey` | *Toggle Show Cues In Grey* |  |  |
| `View.ToggleShowCycleLocators` | *Toggle Show Cycle Locators* |  |  |
| `View.ToggleShowDivisiUnisonInGrey` | *Toggle Show Divisi Unison In Grey* |  |  |
| `View.ToggleShowGridInPageView` | *Toggle Show Grid In Page View* |  |  |
| `View.ToggleShowHiddenNoteheadsInGrey` | *Toggle Show Hidden Noteheads In Grey* |  |  |
| `View.ToggleShowImplicitRestsInGrey` | *Toggle Show Implicit Rests In Grey* |  |  |
| `View.ToggleShowInstrumentFilterOverlay` | *Toggle Show Instrument Filter Overlay* |  |  |
| `View.ToggleShowMutedEventsInGrey` | *Toggle Show Muted Events In Grey* |  |  |
| `View.ToggleShowPageNumbersOverlay` | *Toggle Show Page Numbers Overlay* |  |  |
| `View.ToggleShowRulersInPageView` | *Toggle Show Rulers In Page View* |  |  |
| `View.ToggleShowStaveLinesInCutaways` | *Toggle Show Stave Lines In Cutaways* |  |  |
| `View.ToggleShowTokenPlaceholders` | *Toggle Show Token Placeholders* |  |  |
| `View.ToggleSuppressSignposts` | *Toggle Suppress Signposts* |  |  |
| `View.Zoom` | *Zoom* |  |  |
| `View.ZoomDialog` | *Zoom Dialog* | `Alt+Z` (everywhere) | `projectwindow/statusbar` |
| `View.ZoomIn` | Zoom In | `Ctrl+= / Z` (everywhere) | `projectwindow/statusbar` |
| `View.ZoomOut` | Zoom Out | `Ctrl+- / X` (everywhere) | `projectwindow/statusbar` |
| `View.ZoomPageHeight` | *Zoom Page Height* |  |  |
| `View.ZoomPageWidth` | *Zoom Page Width* |  |  |
| `View.ZoomScoreLayoutView` | *Zoom Score Layout View* |  |  |
| `View.ZoomTwoPages` | *Zoom Two Pages* |  |  |
| `View.ZoomWholePage` | *Zoom Whole Page* | `Ctrl+Alt+0` (everywhere) |  |

## Window

Modes, zones/panels, tabs, windows, layouts switching

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `Window.BringAllToFront` | *Bring All To Front* |  |  |
| `Window.BringToFront` | *Bring To Front* |  |  |
| `Window.CloseHub` | *Close Hub* |  |  |
| `Window.CloseOtherTabs` | *Close Other Tabs* |  |  |
| `Window.CloseTab` | Close Tab | `Ctrl+W` (everywhere) |  |
| `Window.CreateView` | *Create View* |  |  |
| `Window.CycleLowerPanelSize` | *Cycle Lower Panel Size* |  |  |
| `Window.CycleLowerPanelType` | *Cycle Lower Panel Type* |  |  |
| `Window.HideAllPanels` | *Hide All Panels* | `Ctrl+0` (everywhere) |  |
| `Window.KeyEditorZoomInHorizontal` | Toggle between Hand and Marquee Tool | `H` (everywhere) |  |
| `Window.KeyEditorZoomInVertical` | *Key Editor Zoom In Vertical* | `Ctrl+Shift+H` (everywhere) |  |
| `Window.KeyEditorZoomOutHorizontal` | Input Pitch [Pitch=G] | `G` (everywhere) |  |
| `Window.KeyEditorZoomOutVertical` | *Key Editor Zoom Out Vertical* | `Ctrl+Shift+G` (everywhere) |  |
| `Window.MergeAllWindows` | *Merge All Windows* |  |  |
| `Window.Minimise` | *Minimise* | `Ctrl+M` (everywhere) |  |
| `Window.Mixer` | Mixer Window | `F3` (everywhere) |  |
| `Window.ModePrevious` | *Mode Previous* |  |  |
| `Window.MoveTabToNewWindow` | *Move Tab To New Window* |  |  |
| `Window.NewTab` | New Tab | `Ctrl+T` (everywhere) |  |
| `Window.NewWindow` | New Window | `Ctrl+Shift+T` (everywhere) |  |
| `Window.NextLayout` | *Next Layout* | `Shift+Alt+]` (everywhere) |  |
| `Window.NextTab` | Next Tab | `Meta+Tab` (everywhere) |  |
| `Window.PreviousLayout` | *Previous Layout* | `Shift+Alt+[` (everywhere) |  |
| `Window.PreviousTab` | Previous Tab | `Shift+Meta+Tab` (everywhere) |  |
| `Window.ShowBottomPanel` | *Show Bottom Panel* | `Ctrl+8` (everywhere) |  |
| `Window.ShowBottomPanel?Set=true` | *Show Bottom Panel (Set=true)* |  |  |
| `Window.ShowBottomPanel?SetBasedOnButtonCheckedState` | *Show Bottom Panel (SetBasedOnButtonCheckedState)* |  |  |
| `Window.ShowEngraveModePanel` | *Show Engrave Mode Panel* |  |  |
| `Window.ShowEngraveModePanel?SpecialEditModeType=kFrame` | *Show Engrave Mode Panel (SpecialEditModeType=kFrame)* |  | `projectwindow/engravemode/engravetoolbox` |
| `Window.ShowEngraveModePanel?SpecialEditModeType=kGraphicSlices` | *Show Engrave Mode Panel (SpecialEditModeType=kGraphicSlices)* |  | `projectwindow/engravemode/engravetoolbox` |
| `Window.ShowEngraveModePanel?SpecialEditModeType=kGraphical` | *Show Engrave Mode Panel (SpecialEditModeType=kGraphical)* |  | `projectwindow/engravemode/engravetoolbox` |
| `Window.ShowEngraveModePanel?SpecialEditModeType=kNoteSpacing` | *Show Engrave Mode Panel (SpecialEditModeType=kNoteSpacing)* |  | `projectwindow/engravemode/engravetoolbox` |
| `Window.ShowEngraveModePanel?SpecialEditModeType=kStaffSpacing` | *Show Engrave Mode Panel (SpecialEditModeType=kStaffSpacing)* |  | `projectwindow/engravemode/engravetoolbox` |
| `Window.ShowHub` | *Show Hub* |  |  |
| `Window.ShowLeftPanel` | *Show Left Panel* | `Ctrl+7` (everywhere) |  |
| `Window.ShowLeftPanel?Set=true` | *Show Left Panel (Set=true)* |  |  |
| `Window.ShowLeftPanel?SetBasedOnButtonCheckedState` | *Show Left Panel (SetBasedOnButtonCheckedState)* |  |  |
| `Window.ShowRightPanel` | *Show Right Panel* | `Ctrl+9` (everywhere) |  |
| `Window.ShowRightPanel?Set=true` | *Show Right Panel (Set=true)* |  |  |
| `Window.ShowRightPanel?SetBasedOnButtonCheckedState` | *Show Right Panel (SetBasedOnButtonCheckedState)* |  |  |
| `Window.ShowTabBar` | *Show Tab Bar* |  |  |
| `Window.ShowToolbar` | *Show Toolbar* | `Ctrl+6` (everywhere) |  |
| `Window.ShowToolbar?SetBasedOnButtonCheckedState` | *Show Toolbar (SetBasedOnButtonCheckedState)* |  |  |
| `Window.ShowWriteModePanel` | *Show Write Mode Panel* |  |  |
| `Window.SwitchLayoutAspectType` | *Switch Layout Aspect Type* |  |  |
| `Window.SwitchLayoutAspectType?LayoutAspectType=kContinuousVerticalViewAspect` | *Switch Layout Aspect Type (LayoutAspectType=kContinuousVerticalViewAspect)* | `Ctrl+Alt+3` (everywhere) |  |
| `Window.SwitchLayoutAspectType?LayoutAspectType=kGalleyViewAspect` | *Switch Layout Aspect Type (LayoutAspectType=kGalleyViewAspect)* | `Ctrl+Alt+2` (everywhere) |  |
| `Window.SwitchLayoutAspectType?LayoutAspectType=kPageViewAspect` | *Switch Layout Aspect Type (LayoutAspectType=kPageViewAspect)* | `Ctrl+Alt+1` (everywhere) |  |
| `Window.SwitchMode` | *Switch Mode* |  |  |
| `Window.SwitchMode.WindowMode` | *Switch Mode › Window Mode* |  |  |
| `Window.SwitchMode?WindowMode=kEngraveMode` | *Switch Mode (WindowMode=kEngraveMode)* | `Ctrl+3` (everywhere) |  |
| `Window.SwitchMode?WindowMode=kPlayMode` | *Switch Mode (WindowMode=kPlayMode)* | `Ctrl+4` (everywhere) |  |
| `Window.SwitchMode?WindowMode=kPrintMode` | Switch Mode | `Ctrl+5 / Ctrl+P` (everywhere) |  |
| `Window.SwitchMode?WindowMode=kReadMode` | *Switch Mode (WindowMode=kReadMode)* |  |  |
| `Window.SwitchMode?WindowMode=kSetupMode` | *Switch Mode (WindowMode=kSetupMode)* | `Ctrl+1` (everywhere) |  |
| `Window.SwitchMode?WindowMode=kWriteMode` | *Switch Mode (WindowMode=kWriteMode)* | `Ctrl+2` (everywhere) |  |
| `Window.SwitchSplitMode` | *Switch Split Mode* |  |  |
| `Window.SwitchSplitMode.WindowSplitMode` | *Switch Split Mode › Window Split Mode* |  |  |
| `Window.SwitchToLayout` | *Switch To Layout* |  |  |
| `Window.SwitchToLowerPanel` | *Switch To Lower Panel* |  |  |
| `Window.SwitchToLowerPanel.LowerPanelType` | *Switch To Lower Panel › Lower Panel Type* |  |  |
| `Window.TabsReordered` | *Tabs Reordered* |  |  |
| `Window.ToggleFollowPlayhead` | *Toggle Follow Playhead* |  |  |
| `Window.ToggleLayoutAspectType` | *Toggle Layout Aspect Type* |  |  |
| `Window.TogglePageAndFillView` | *Toggle Page And Fill View* |  |  |
| `Window.TogglePageAndGalleyView` | *Toggle Page And Galley View* |  |  |
| `Window.ToggleScoreAndPartLayout` | *Toggle Score And Part Layout* | `W` (everywhere) |  |
| `Window.Transport` | Transport Window | `F2` (everywhere) |  |
| `Window.Zoom` | *Zoom* |  |  |

## Engrave

Engrave menu: fonts, styles, formatting

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `Engrave.ChangeFonts` | *Change Fonts* |  |  |
| `Engrave.ChangeProjectLanguage` | *Change Project Language* |  |  |
| `Engrave.ChordSymbolOptions` | *Chord Symbol Options* |  |  |
| `Engrave.ClearLayoutHorizontalSpacingAdjustments` | *Clear Layout Horizontal Spacing Adjustments* |  |  |
| `Engrave.ClearLayoutVerticalSpacingAdjustments` | *Clear Layout Vertical Spacing Adjustments* |  |  |
| `Engrave.CompleteEditStaffSpacingMeasurement` | *Complete Edit Staff Spacing Measurement* |  |  |
| `Engrave.CopyStaffSpacingBetweenFrames` | *Copy Staff Spacing Between Frames* |  |  |
| `Engrave.CreateBarlineOverride` | *Create Barline Override* |  |  |
| `Engrave.CreateBrace` | *Create Brace* |  |  |
| `Engrave.CreateBracket` | *Create Bracket* |  |  |
| `Engrave.CreateBracketAndBarlineChange` | *Create Bracket And Barline Change* |  |  |
| `Engrave.CreateBracketAndBarlineReset` | *Create Bracket And Barline Reset* |  |  |
| `Engrave.CreateSubBracket` | *Create Sub Bracket* |  |  |
| `Engrave.CreateSubSubBracket` | *Create Sub Sub Bracket* |  |  |
| `Engrave.EditCharacterStyles` | *Edit Character Styles* |  |  |
| `Engrave.EditChordDiagrams` | *Edit Chord Diagrams* |  |  |
| `Engrave.EditFlowHeadingTextContent` | *Edit Flow Heading Text Content* |  |  |
| `Engrave.EditFontStyles` | *Edit Font Styles* |  |  |
| `Engrave.EditLineAnnotations` | *Edit Line Annotations* |  |  |
| `Engrave.EditLineBodies` | *Edit Line Bodies* |  |  |
| `Engrave.EditLines` | *Edit Lines* |  |  |
| `Engrave.EditLines?LineOrientation=kHorizontal` | *Edit Lines (LineOrientation=kHorizontal)* |  | `projectwindow/writemode/linespanel` |
| `Engrave.EditLines?LineOrientation=kVertical` | *Edit Lines (LineOrientation=kVertical)* |  | `projectwindow/writemode/linespanel` |
| `Engrave.EditMusicSymbols` | *Edit Music Symbols* |  |  |
| `Engrave.EditNoteheadSets` | *Edit Notehead Sets* |  |  |
| `Engrave.EditPageDimensionPresets` | *Edit Page Dimension Presets* |  |  |
| `Engrave.EditParagraphStyles` | *Edit Paragraph Styles* |  |  |
| `Engrave.EditPlayTechniqueAppearanceStyles` | *Edit Play Technique Appearance Styles* |  |  |
| `Engrave.EditProjectDefaultChordSymbolAppearances` | *Edit Project Default Chord Symbol Appearances* |  |  |
| `Engrave.EditRepeatableComposites` | *Edit Repeatable Composites* |  |  |
| `Engrave.EditSelectedChordSymbolAppearance` | *Edit Selected Chord Symbol Appearance* |  |  |
| `Engrave.EditStaffSpacingMeasurement` | *Edit Staff Spacing Measurement* |  |  |
| `Engrave.EnterEdit` | Start Note Input [Set=true] | `Return` (Engrave) |  |
| `Engrave.LyricLineUserYOffsetsReset` | *Lyric Line User Y Offsets Reset* |  |  |
| `Engrave.Options` | Engraving Options... | `Ctrl+Shift+E` (everywhere) |  |
| `Engrave.SelectDragHandlesViewState` | *Select Drag Handles View State* |  |  |
| `Engrave.SetEngravingOptions` | *Set Engraving Options* |  |  |
| `Engrave.SetFontStyleOptions` | *Set Font Style Options* |  |  |
| `Engrave.SplitMultirest` | *Split Multirest* |  |  |
| `Engrave.ToggleDragHandleCategory` | *Toggle Drag Handle Category* |  |  |
| `Engrave.UpdateDxDy` | *Update Dx Dy* |  |  |

## File

File menu: new/open/save/import/export

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `File.AutoSave` | *Auto Save* |  |  |
| `File.ClearRecentFiles` | *Clear Recent Files* |  |  |
| `File.Close` | *Close* |  |  |
| `File.CloseAll` | *Close All* |  |  |
| `File.CloseProject` | Close Project | `Ctrl+Shift+W` (everywhere) |  |
| `File.Exit` | Quit | `Ctrl+Q` (everywhere) |  |
| `File.Export` | *Export* |  |  |
| `File.Export.Comments` | *Export › Comments* |  | `projectwindow/writemode/commentspanel` |
| `File.Export.Lyrics` | *Export › Lyrics* |  |  |
| `File.Export.SpecificFlowsAndParts` | *Export › Specific Flows And Parts* |  |  |
| `File.Export.Text` | *Export › Text* |  |  |
| `File.Import.OtherProjectFlow` | *Import › Other Project Flow* |  |  |
| `File.New` | New | `Ctrl+N` (everywhere) |  |
| `File.NewFromTemplate` | *New From Template* |  |  |
| `File.Open` | Open... | `Ctrl+O` (everywhere) |  |
| `File.Open?FilterID=MusicXMLImportFilter` | Open... | `Ctrl+Shift+O` (everywhere) |  |
| `File.PageSetup` | *Page Setup* |  |  |
| `File.Print` | *Print* |  |  |
| `File.Revert` | *Revert* |  |  |
| `File.Save` | Save | `Ctrl+S` (everywhere) |  |
| `File.SaveAll` | *Save All* |  |  |
| `File.SaveAs` | Save As... | `Ctrl+Shift+S` (everywhere) |  |
| `File.SaveAsTemplate` | *Save As Template* |  |  |
| `File.SaveNewVersion` | *Save New Version* |  |  |
| `File.ScoreInfo` | *Score Info* | `Ctrl+I` (everywhere) |  |
| `File.ShowSaveAsTemplateDialog` | *Show Save As Template Dialog* |  |  |
| `File.WasDeletedOnDisk` | *Was Deleted On Disk* |  |  |
| `File.WasModifiedOnDisk` | *Was Modified On Disk* |  |  |
| `File.WasRenamedOnDisk` | *Was Renamed On Disk* |  |  |

## NoteEdit

Note editing (pitch/rhythm edits)

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `NoteEdit.DecreasePlayEndOffset` | *Decrease Play End Offset* |  |  |
| `NoteEdit.DecreasePlayStartOffset` | *Decrease Play Start Offset* |  |  |
| `NoteEdit.IncreasePlayEndOffset` | *Increase Play End Offset* |  |  |
| `NoteEdit.IncreasePlayStartOffset` | *Increase Play Start Offset* |  |  |
| `NoteEdit.Pitch` | *Pitch* |  |  |
| `NoteEdit.PitchDown` | Pitch [Direction=Down] | `Alt+Down / Alt+Num+Down` (music editable) |  |
| `NoteEdit.PitchDownChromatic` | Pitch [Direction=Down&Chromatic=true] | `Shift+Alt+Down / Shift+Alt+Num+Down` (music editable) |  |
| `NoteEdit.PitchDownOctave` | Pitch [Direction=Down&Octave=true] | `Ctrl+Alt+Down / Ctrl+Alt+Num+Down` (music editable) |  |
| `NoteEdit.PitchDrag` | *Pitch Drag* |  |  |
| `NoteEdit.PitchUp` | Pitch [Direction=Up] | `Alt+Up / Alt+Num+Up` (music editable) |  |
| `NoteEdit.PitchUpChromatic` | Pitch [Direction=Up&Chromatic=true] | `Shift+Alt+Up / Shift+Alt+Num+Up` (music editable) |  |
| `NoteEdit.PitchUpOctave` | Pitch [Direction=Up&Octave=true] | `Ctrl+Alt+Up / Ctrl+Alt+Num+Up` (music editable) |  |
| `NoteEdit.PropagateSpelling` | *Propagate Spelling* |  |  |
| `NoteEdit.ResetSpellAutomatically` | *Reset Spell Automatically* |  |  |
| `NoteEdit.ResetSpellingInAllLayouts` | *Reset Spelling In All Layouts* |  |  |
| `NoteEdit.ResetSpellingInCurrentLayout` | *Reset Spelling In Current Layout* |  |  |
| `NoteEdit.RespellToggle` | *Respell Toggle* |  |  |
| `NoteEdit.RespellUsingNoteNameAbove` | *Respell Using Note Name Above* | `Alt+=` (music editable) |  |
| `NoteEdit.RespellUsingNoteNameBelow` | *Respell Using Note Name Below* | `Alt+-` (music editable) |  |

## Application

Preferences, account, app-level

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `Application.About` | *About* |  |  |
| `Application.CheckForUpdates` | *Check For Updates* |  |  |
| `Application.DeviceSetup` | *Device Setup* |  |  |
| `Application.DownloadVSTSoundContent` | *Download VST Sound Content* |  |  |
| `Application.ExportFilenameTokensDialog` | *Export Filename Tokens Dialog* |  |  |
| `Application.ExportUserSettings` | *Export User Settings* |  |  |
| `Application.ImportUserSettings` | *Import User Settings* |  |  |
| `Application.Nudge` | *Nudge* |  |  |
| `Application.OpenUrlInDefaultBrowser` | *Open Url In Default Browser* |  |  |
| `Application.Preferences` | Preferences... | `Ctrl+,` (everywhere) |  |
| `Application.RemoteSetProgress` | *Remote Set Progress* |  |  |
| `Application.SetEnableProofreading` | *Set Enable Proofreading* |  |  |
| `Application.ShowAllowRemoteClientDialog` | *Show Allow Remote Client Dialog* |  |  |
| `Application.ShowLifetimeUnlockPrompt` | *Show Lifetime Unlock Prompt* |  |  |
| `Application.ShowSignInPrompt` | *Show Sign In Prompt* |  |  |
| `Application.ShowSignOutPrompt` | *Show Sign Out Prompt* |  |  |
| `Application.ShowSubscriptionPrompt` | *Show Subscription Prompt* |  |  |
| `Application.UploadCrashes` | *Upload Crashes* |  |  |

## Print

Print/Publish mode actions

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `Print.AddPrintLayoutRendererInternal` | *Add Print Layout Renderer Internal* |  |  |
| `Print.ExportAllLayoutsAsPDF` | *Export All Layouts As PDF* |  |  |
| `Print.ExportCurrentLayoutAsPDF` | *Export Current Layout As PDF* |  |  |
| `Print.ExportCurrentPageAsPDF` | *Export Current Page As PDF* |  |  |
| `Print.InitiatePrintingRequest` | *Initiate Printing Request* |  |  |
| `Print.LayoutsPanelSelectAll` | Select All | `Ctrl+A` (Print) |  |
| `Print.PrintCurrentLayout` | *Print Current Layout* |  |  |
| `Print.PrintCurrentPage` | *Print Current Page* |  |  |
| `Print.PrintPreviewEnd` | Move View Right | `End` (Print) |  |
| `Print.PrintPreviewHome` | Move View Left | `Home` (Print) |  |
| `Print.PrintPreviewPageDown` | Move View Down | `PgDown` (Print) |  |
| `Print.PrintPreviewPageUp` | Move View Up | `PgUp` (Print) |  |
| `Print.PrintPreviewZoomLevelType` | *Print Preview Zoom Level Type* |  |  |
| `Print.PrintWithCurrentSettingsInternal` | *Print With Current Settings Internal* |  |  |
| `Print.RemovePrintLayoutRendererInternal` | *Remove Print Layout Renderer Internal* |  |  |
| `Print.SetHideViewOptionsInternal` | *Set Hide View Options Internal* |  |  |
| `Print.UpdatePrintPreview` | *Update Print Preview* |  |  |

## TextEditor

Rich text editor

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `TextEditor.ConvertUnicode` | *Convert Unicode* | `Alt+X` (text editor) |  |
| `TextEditor.DecreaseFontSize` | *Decrease Font Size* | `Ctrl+Shift+,` (text editor) |  |
| `TextEditor.IncreaseFontSize` | *Increase Font Size* | `Ctrl+Shift+.` (text editor) |  |
| `TextEditor.InsertHairSpace` | *Insert Hair Space* |  |  |
| `TextEditor.InsertMusicText` | *Insert Music Text* |  |  |
| `TextEditor.InsertNarrowNonBreakingSpace` | *Insert Narrow Non Breaking Space* |  |  |
| `TextEditor.InsertNonBreakingSpace` | *Insert Non Breaking Space* |  |  |
| `TextEditor.InsertThinSpace` | *Insert Thin Space* |  |  |
| `TextEditor.InsertToken` | *Insert Token* |  |  |
| `TextEditor.OpenMusicTextDialog` | *Open Music Text Dialog* |  |  |
| `TextEditor.ToggleBold` | *Toggle Bold* | `Ctrl+B` (text editor) |  |
| `TextEditor.ToggleItalic` | *Toggle Italic* | `Ctrl+I` (text editor) |  |
| `TextEditor.ToggleUnderline` | *Toggle Underline* | `Ctrl+U` (text editor) |  |

## MusicalManipulation

Write › Transform: invert, retrograde, rotate, map…

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `MusicalManipulation.InvertPitches` | *Invert Pitches* |  |  |
| `MusicalManipulation.MapPitches` | *Map Pitches* |  |  |
| `MusicalManipulation.RepeatPitches` | *Repeat Pitches* |  |  |
| `MusicalManipulation.RetrogradeAndInvertPitches` | *Retrograde And Invert Pitches* |  |  |
| `MusicalManipulation.RetrogradePitches` | *Retrograde Pitches* |  |  |
| `MusicalManipulation.RetrogradePitchesAndRhythm` | *Retrograde Pitches And Rhythm* |  |  |
| `MusicalManipulation.RetrogradePitchesAndRhythmAndInvertPitches` | *Retrograde Pitches And Rhythm And Invert Pitches* |  |  |
| `MusicalManipulation.RetrogradeRhythm` | *Retrograde Rhythm* |  |  |
| `MusicalManipulation.RotatePitches` | *Rotate Pitches* |  |  |
| `MusicalManipulation.RotatePitchesAndRhythm` | *Rotate Pitches And Rhythm* |  |  |
| `MusicalManipulation.RotateRhythm` | *Rotate Rhythm* |  |  |
| `MusicalManipulation.TransformScale` | *Transform Scale* |  |  |

## Setup

Setup mode list editing

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `Setup.Delete` | Delete Player/Instrument/Flow/Layout | `Del / Backspace` (Setup) |  |
| `Setup.Insert` | *Insert* | `Ins` (Setup) |  |
| `Setup.MoveDown` | Move Player Down | `Alt+Down / Alt+Num+Down` (Setup) |  |
| `Setup.MoveLeft` | Move Flow Left | `Alt+Left / Alt+Num+Left` (Setup) |  |
| `Setup.MoveRight` | Move Flow Right | `Alt+Right / Alt+Num+Right` (Setup) |  |
| `Setup.MoveToBottom` | Move Player to Right | `Ctrl+Alt+Down / Ctrl+Alt+Num+Down` (Setup) |  |
| `Setup.MoveToEnd` | Move Flow to End | `Ctrl+Alt+Right / Ctrl+Alt+Num+Right` (Setup) |  |
| `Setup.MoveToStart` | Move Flow to Start | `Ctrl+Alt+Left / Ctrl+Alt+Num+Left` (Setup) |  |
| `Setup.MoveToTop` | Move Player to Top | `Ctrl+Alt+Up / Ctrl+Alt+Num+Up` (Setup) |  |
| `Setup.MoveUp` | Move Player Up | `Alt+Up / Alt+Num+Up` (Setup) |  |

## Help

Help menu

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `Help.ConnectionsEditor` | *Connections Editor* |  |  |
| `Help.CreateDiagnosticReport` | *Create Diagnostic Report* |  |  |
| `Help.GuidedTour` | *Guided Tour* |  |  |
| `Help.KeyCommands` | *Key Commands* |  |  |
| `Help.Manual` | *Manual* |  |  |
| `Help.ShowOverlay` | *Show Overlay* | `Ctrl+/ / F1` (help overlay) |  |
| `Help.WhatsNewGuidedTour` | *Whats New Guided Tour* |  |  |

## ScoreInfo

Project info

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `ScoreInfo.GetFlowInfo` | *Get Flow Info* |  |  |
| `ScoreInfo.GetFlows` | *Get Flows* |  |  |
| `ScoreInfo.GetLayoutInfo` | *Get Layout Info* |  |  |
| `ScoreInfo.GetLayouts` | *Get Layouts* |  |  |
| `ScoreInfo.GetPlayerInfo` | *Get Player Info* |  |  |
| `ScoreInfo.GetPlayers` | *Get Players* |  |  |
| `ScoreInfo.GetScoreInfo` | *Get Score Info* |  |  |

## UI

UI helpers

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `UI.Escape` | Escape | `Esc` (help overlay) |  |
| `UI.SetFocus?Value=kBottomPane` | Set Focus | `Alt+8 / Alt+Return` (everywhere) |  |
| `UI.SetFocus?Value=kLeftPane` | *Set Focus (Value=kLeftPane)* | `Alt+7` (everywhere) |  |
| `UI.SetFocus?Value=kRightPane` | *Set Focus (Value=kRightPane)* | `Alt+9` (everywhere) |  |
| `UI.SetFocus?Value=kScoreView` | *Set Focus (Value=kScoreView)* | `Alt+0` (everywhere) |  |
| `UI.ShowJumpBar` | *Show Jump Bar* | `J` (everywhere) |  |
| `UI.ToggleDefaultMouseClickTool` | *Toggle Default Mouse Click Tool* | `Alt+H` (everywhere) |  |

## Script

Script menu

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `Script.AttachDebugger` | *Attach Debugger* |  |  |
| `Script.EndRecordingMacro` | *End Recording Macro* |  |  |
| `Script.RunLastScript` | Run Last Script | `Ctrl+Shift+Alt+R` (everywhere) |  |
| `Script.RunScript` | *Run Script* |  |  |
| `Script.ShowConsole` | *Show Console* |  |  |
| `Script.StartRecordingMacro` | *Start Recording Macro* |  |  |

## OptionsDialog

Options dialogs

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `OptionsDialog.CloseFind` | Escape | `Esc` (Options dialog) |  |
| `OptionsDialog.Filter` | *Filter* | `Ctrl+L` (Options dialog) |  |
| `OptionsDialog.Find` | *Find* | `Ctrl+F` (Options dialog) |  |
| `OptionsDialog.NextResult` | *Next Result* | `Ctrl+G` (Options dialog) |  |
| `OptionsDialog.PreviousResult` | *Previous Result* | `Ctrl+Shift+G` (Options dialog) |  |

## Video

Video

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `Video.AttachVideo` | *Attach Video* |  |  |
| `Video.DetachVideo` | *Detach Video* |  |  |
| `Video.Properties` | *Properties* |  | `projectwindow/writemode/videopanel` |
| `Video.SetAttachmentPosition` | *Set Attachment Position* |  |  |
| `Video.ShowWindow` | *Show Window* | `F4` (everywhere) |  |

## JumpBar

Jump bar

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `JumpBar.CommandsMode` | *Commands Mode* | `Meta+1` (jump bar) |  |
| `JumpBar.GotoMode` | *Goto Mode* | `Meta+2` (jump bar) |  |

## ScrubPlayback

Scrub playback

| Command ID | Name | Shortcut | Panel |
|---|---|---|---|
| `ScrubPlayback.StepBackwards` | Select Left | `Left / Num+Left` (scrub playback) |  |
| `ScrubPlayback.StepForwards` | Select Right | `Right / Num+Right` (scrub playback) |  |
