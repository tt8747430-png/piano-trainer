# Dorico 6.2: every panel, toolbar, dialog and options page, with its controls and actions

How this was built:
- **The list of areas** is Dorico's own help map (`Resources/helpconnections.json`, 163 entries).
- **Each area's contents** come from the strings stored next to it in the app binary:
  - the Qt widget class
  - the button object names
  - the visible labels and tooltips
  - Steinberg's explanatory text (quoted)
  - the commands its buttons trigger
- **The manual link** uses the app's own help-URL template `https://steinberg.help/%app%_%variant%/v%version%/%lang%/%app%` plus the topic path.

Located in the main binary: 129 of 163 areas. The other 34 (key editor, mixer, keyboard, fretboard, drum pads, some library editors) live in other modules and are listed with their manual link only.
Blocks are cut at the next area's marker, so a block can occasionally pick up a few strings from a neighbouring widget.

## Main toolbar (top of project window)

### `projectwindow/toolbar`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/user_interface/user_interface_toolbar_r.html

_Not located in the main binary._

## Secondary toolbar

### `projectwindow/secondarytoolbar`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_secondary_toolbar_r.html

_Not located in the main binary._

## Status bar (bottom of project window)

### `projectwindow/statusbar` (StatusBar)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/user_interface/user_interface_status_bar_r.html

> No language for key commands specified in preferences; using application language {}
>

**Controls:** `scoreOrderPopupMenuButton`, `followPlayheadSlideSwitch`, `pageViewButton`, `galleyViewButton`, `continuousVerticalViewButton`, `customZoomButton`, `buildButton`, `chooseButton`, `instrumentLineEdit`, `playerListView`, `categoryListView`, `ensembleListView`, `descriptionListView`, `saveButton`, `allFlowsButton`, `selectedFlowsButton`, `blankStavesButton`, `createNewFrameChainButton`, `indexComboBox`, `familyListView`, `instrumentListView`, `variantListView`, `addEmptyKitButton`, `importKitButton`, `addOrReplaceButton`

**Labels and tooltips:** 100% · Marquee Tool · Page View · Fill view · Spreads Horizontally · Spreads Vertically · Single Pages Horizontally · Single Pages Vertically · Page Width · Whole Page · Custom Zoom · Set Zoom · Steinberg Hub · Parsing of online version check failed. · SteamCommand. · Atom feed fatal error on line  · Create Empty Kit · Import Kit... · Add Instrument to Player · Save... · Filter by Flow: · Selected · Blank Staves · Frame Chain: · Unlink · Frame Order · Edit Player · Filter by Player: · HALion Sonic · HSSE multi output.pluginstate · Groove Agent SE · GASE Studio Kit.pluginstate · DocumentWindowScoreMediator::initialiseForScore() · DocumentWindowScoreMediator::setupPaletteController() · Open the last score. · Create a new score, with optional template · Run a command · Run a set of commands from a file · Applications · Dorico Web Helper · Unable to find a free socket to bind to · AppControllerHost terminating · UI Delay %.1fs · Auto-save skipped

**Commands triggered:**
- `View.SetPagePositionPolicy?PagePositionPolicy=kSpreadHorizontal`: Set Page Position Policy (PagePositionPolicy=kSpreadHorizontal)
- `View.SetPagePositionPolicy?PagePositionPolicy=kSpreadVertical`: Set Page Position Policy (PagePositionPolicy=kSpreadVertical)
- `View.SetPagePositionPolicy?PagePositionPolicy=kSingleHorizontal`: Set Page Position Policy (PagePositionPolicy=kSingleHorizontal)
- `View.SetPagePositionPolicy?PagePositionPolicy=kSingleVertical`: Set Page Position Policy (PagePositionPolicy=kSingleVertical)
- `View.ZoomDialog`: Zoom Dialog
- `View.ZoomOut`: Zoom Out
- `View.ZoomIn`: Zoom In

## Mini transport

### `projectwindow/minitransport`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/user_interface/user_interface_transport_options_r.html

_Not located in the main binary._

## Empty project start screen and guided tours

### `projectwindow/emptystatewidget` (EmptyStateWidget)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/user_interface/user_interface_windows_c.html

> For full details and documentation of all of the changes in %1, please refer to the Version History PDF.
>
> This guided tour introduces you to some of the new features and improvements. Switch to each mode in turn for details of changes in each one.
>

**Controls:** `backButton`, `finishButton`, `previousButton`

**Labels and tooltips:** Start your project by adding some players · An individual player who plays one or more instruments. · Examples: Solo violin, Piano, Flute & Piccolo · A group of players that all play the same instrument. · Examples: Violin I section, Soprano as part of a choir · An easy way to add multiple players at the same time. · Examples: Double Woodwind, Triple Brass, String section. · Guided Tour · Mode · Text for the guided tour will be dynamically populated here · Next  · Finish Tour · To replay this tour, choose Guided Tour from the Help menu. · To replay this tour, choose What's New Tour from the Help menu. · Replay · What's New · Thank you for updating to %1.

## Setup mode

### `projectwindow/setupmode/flowspanel` (FlowsPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/setup_mode/setup_mode_flows_panel_r.html

> Your project can contain separate movements, songs, or pieces; these are called flows. Drag flows left and right to change the order they appear in layouts. Select a flow to see which players appear in it and which layouts it appears in.
>
> The Notation Options dialog provides settings for beat, beam and rest grouping in different time signatures, rules for accidentals, and how to position notes and rests in multiple voices. These options can be set individually for each flow in your project.
>

**Controls:** `rearrangeFlowsButton`, `flowsListView`, `newFlowButton`, `notationOptionsButton`, `flowsContextMenuButton`, `deleteFlowButton`

**Labels and tooltips:** Add Flow · Notation Options · Flow Settings · Delete Flow · 00:00:00:00

### `projectwindow/setupmode/layoutspanel` (LayoutsPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/setup_mode/setup_mode_layouts_panel_r.html

> Layouts bring together players and flows in combination to produce the pages of music you can view, edit, and print. Score and part layouts are updated automatically as you work, and you can also create custom score layouts for rehearsal scores or unusual combinations.
>
> The Layout Options dialog allows you to change page and staff size, staff labeling, rhythmic spacing and staff spacing for each layout in your project.
>

**Controls:** `layoutsSection`, `layoutsListView`, `newFullScoreButton`, `newPartButton`, `newCustomScoreButtom`, `sortLayoutsButton`, `layoutOptionsButton`, `layoutsContextMenuButton`, `deleteLayoutButton`

**Labels and tooltips:** Add Full Score Layout · Add Instrumental Part Layout · Add Custom Score Layout · Sort Layouts · Layout Settings · Delete Layout

### `projectwindow/setupmode/playerspanel` (MusiciansPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/setup_mode/setup_mode_players_panel_r.html

> Add players and assign instruments to them in the Players panel. Players represent the people who will play your music. Drag players up and down to change the order they appear in layouts. Select a player to see which flows and layouts he or she appears in.
>

**Controls:** `playersSection`, `addSoloPlayerButton`, `addSectionPlayerButton`, `addEnsembleButton`, `addGroupButton`, `sortPlayersButton`, `playerContextMenuButton`, `deleteButton`

**Labels and tooltips:** Add Single Player · Add Section Player · Add Ensemble · Add Group · Sort Players · Player Settings · Delete Player

## Write mode

### `projectwindow/writemode/barsbarlinespanel` (BarsBarlinesPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_bars_barlines_panel_r.html


**Controls:** `newBarsLocationPopupMenuButton`, `numberOfBarsSpinBox`, `sectionSpinBox`, `insertBarsPushButton`, `insertBarRestPushButton`, `transparentButton`, `commonClefsSection`, `commonClefsSectionHeaderButton`, `uncommonClefsSection`, `uncommonClefsSectionHeaderButton`, `archaicClefsSection`, `archaicClefsSectionHeaderButton`, `octaveLinesSection`, `octaveLinesSectionHeaderButton`

**Labels and tooltips:** Insert Bars · Insert Bar Rest · Create Barline · Tick · Short (center) · Short (top) · End/Start Repeat

**Commands triggered:**
- `NoteInput.InsertBarRest`: Insert Bar Rest

### `projectwindow/writemode/clefspanel` (ClefsPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_clefs_panel_r.html


**Controls:** `commentsSection`

**Labels and tooltips:** 15ma · 22ma · 15mb · 22mb · Common Clefs · Uncommon Clefs · Archaic Clefs · Octave Lines

### `projectwindow/writemode/commentspanel` (CommentsPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_comments/write_mode_comments_panel_r.html


**Controls:** `commentsListView`, `addCommentButton`, `editCommentButton`, `replyCommentButton`, `exportCommentsButton`, `deleteCommentButton`, `conductorSymbolsSection`, `functionSymbolsSection`, `insertCueSection`, `suggestCuesSection`

**Labels and tooltips:** Create Comment · Edit Comment · Reply to Comment · Export Comments · Delete Comment · Conductor Symbols · Function Symbols

**Commands triggered:**
- `NoteInput.ReplyToComment`: Reply To Comment
- `File.Export.Comments`: Export › Comments

### `projectwindow/writemode/cuespanel` (CuesPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_cues_panel_r.html


### `projectwindow/writemode/cuespanel/suggestcues` (CuesPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_cues_panel_suggestions_r.html


**Controls:** `secondsSpinBox`, `updateSuggestedCuesButton`, `flowNameLineEdit`, `layoutNameLineEdit`, `suggestCuesTableView`, `ignoreSuggestedLocationButton`, `highlightSuggestedLocationCheckBox`, `soundingInstrumentListView`, `immediateDynamicsSection`, `gradualDynamicsSection`, `forceDynamicsSection`, `combinedDynamicsSection`

**Labels and tooltips:** Create Cue · Suggest Cues · Resting for: · Rehearsal marks: · Consider · Ignore · Cues: · Update · Flow: · Layout: · Highlight suggestions · Playing instruments:

### `projectwindow/writemode/dynamicspanel` (DynamicsPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_dynamics_panel_r.html


**Controls:** `panelModifierButton`, `combinedLeftPlusButton`, `kDynamicCombinedLeftPlusButton`, `combinedLeftMinusButton`, `kDynamicCombinedLeftMinusButton`, `sectionPanelButton`, `combinedRightPlusButton`, `kDynamicCombinedRightPlusButton`, `combinedRightMinusButton`, `kDynamicCombinedRightMinusButton`, `combinedSwapButton`, `kDynamicCombinedSwapButton`, `horizontalLineSection`, `verticalLineSection`

**Labels and tooltips:** Immediate Dynamics · Show More · Force/Intensity of Attack

### `projectwindow/writemode/holdspausespanel` (HoldsPausesPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_holds_pauses_panel_r.html


**Controls:** `tuningSystemSection`, `usedInThisFlowSection`, `keySignaturesSection`, `customKeySignaturesSection`, `accidentalsSection`

**Labels and tooltips:** Fermata · Very Short Fermata · Short Fermata · Long Fermata · Very Long Fermata · Short Fermata (Henze) · Long Fermata (Henze) · Curlew (Britten) · Breath Marks · Breath Mark (Comma) · Breath Mark (Tick-like) · Breath Mark (Upbow-like) · Breath Mark (Salzedo) · Caesuras · Caesura  · Curved Caesura · Thick Caesura · Short Caesura · Single-stroke Caesura 

### `projectwindow/writemode/instrumentfiltersoverlay`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_instrument_filters/write_mode_instrument_filters_c.html

_Not located in the main binary._

### `projectwindow/writemode/keysignaturespanel` (KeySignaturesPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_key_signatures_tonality_systems_accidentals_panel_r.html


### `projectwindow/writemode/keysignaturespanel/accidentals`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_note_input/write_mode_accidentals_inputting_t.html


**Labels and tooltips:** Tonality System · New Tonality System · Duplicate Tonality System · Edit Tonality System · Import Tonality System · Export Tonality System · Delete Tonality System · Used in This Flow · Major · Minor · More Sharps/Fewer Flats · Fewer Sharps/More Flats · Custom Key Signatures · Maxima · Longa · Double Whole Note (Breve) · Whole Note (Semibreve) · Half Note (Minim) · Quarter Note (Crotchet) · 8th Note (Quaver) · 16th Note (Semiquaver) · 32nd Note (Demisemiquaver) · 64th Note (Hemidemisemiquaver) · 128th Note · 256th Note · 512th Note · 1024th Note · Note Input Panel

**Commands triggered:**
- `NoteInput.NoteValue?LogDuration=kMaxima&SetBasedOnButtonCheckedState`: Note Value (LogDuration=kMaxima, SetBasedOnButtonCheckedState)
- `NoteInput.NoteValue?LogDuration=kLong&SetBasedOnButtonCheckedState`: Note Value (LogDuration=kLong, SetBasedOnButtonCheckedState)
- `NoteInput.NoteValue?LogDuration=kBreve&SetBasedOnButtonCheckedState`: Note Value (LogDuration=kBreve, SetBasedOnButtonCheckedState)
- `NoteInput.NoteValue?LogDuration=kSemibreve&SetBasedOnButtonCheckedState`: Note Value (LogDuration=kSemibreve, SetBasedOnButtonCheckedState)
- `NoteInput.NoteValue?LogDuration=kMinim&SetBasedOnButtonCheckedState`: Note Value (LogDuration=kMinim, SetBasedOnButtonCheckedState)
- `NoteInput.NoteValue?LogDuration=kCrotchet&SetBasedOnButtonCheckedState`: Note Value (LogDuration=kCrotchet, SetBasedOnButtonCheckedState)
- `NoteInput.NoteValue?LogDuration=kQuaver&SetBasedOnButtonCheckedState`: Note Value (LogDuration=kQuaver, SetBasedOnButtonCheckedState)
- `NoteInput.NoteValue?LogDuration=kSemiQuaver&SetBasedOnButtonCheckedState`: Note Value (LogDuration=kSemiQuaver, SetBasedOnButtonCheckedState)
- `NoteInput.NoteValue?LogDuration=kDemiSemiQuaver&SetBasedOnButtonCheckedState`: Note Value (LogDuration=kDemiSemiQuaver, SetBasedOnButtonCheckedState)
- `NoteInput.NoteValue?LogDuration=kHemiDemiSemiQuaver&SetBasedOnButtonCheckedState`: Note Value (LogDuration=kHemiDemiSemiQuaver, SetBasedOnButtonCheckedState)
- `NoteInput.NoteValue?LogDuration=k128Note&SetBasedOnButtonCheckedState`: Note Value (LogDuration=k128Note, SetBasedOnButtonCheckedState)
- `NoteInput.NoteValue?LogDuration=k256Note&SetBasedOnButtonCheckedState`: Note Value (LogDuration=k256Note, SetBasedOnButtonCheckedState)
- `NoteInput.NoteValue?LogDuration=k512Note&SetBasedOnButtonCheckedState`: Note Value (LogDuration=k512Note, SetBasedOnButtonCheckedState)
- `NoteInput.NoteValue?LogDuration=k1024Note&SetBasedOnButtonCheckedState`: Note Value (LogDuration=k1024Note, SetBasedOnButtonCheckedState)

### `projectwindow/writemode/keysignaturespanel/customkeysignatures`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_tonality_systems_custom_key_signatures_creating_t.html


### `projectwindow/writemode/keysignaturespanel/tonalitysystem` (KeySignaturesPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_tonality_systems/notation_reference_tonality_systems_c.html


**Controls:** `majorToggle`, `kKeySignatureMajorButton`, `minorToggle`, `kKeySignatureMinorButton`

### `projectwindow/writemode/linespanel` (GenericLinesPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_lines_panel_r.html


**Controls:** `editHorizontalLineButton`, `editVerticalLineButton`, `fermatasSection`, `breathMarksSection`, `caesurasSection`

**Labels and tooltips:** Attach to notehead · Attach to barline (where available) · Attach to rhythmic position · Edit Lines

**Commands triggered:**
- `Engrave.EditLines?LineOrientation=kHorizontal`: Edit Lines (LineOrientation=kHorizontal)
- `Engrave.EditLines?LineOrientation=kVertical`: Edit Lines (LineOrientation=kVertical)

### `projectwindow/writemode/notationstoolbox/panels`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_toolbox_r.html

_Not located in the main binary._

### `projectwindow/writemode/notationstoolbox/panelspopoverstoggle`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_notations_input_c.html

_Not located in the main binary._

### `projectwindow/writemode/notationstoolbox/popovers`

Manual: (no manual page)

_Not located in the main binary._

### `projectwindow/writemode/noteinputtoolbox` (NoteInputToolbox)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notes_toolbox_r.html

> These tools change the way note input and editing work. Most stay switched on until you switch them off, and apply both during note input (when the caret is visible) and when you are editing your music afterwards.
>

**Controls:** `toolboxButton`, `baroqueClassicalSection`, `jazzSection`, `arpeggiationSection`, `glissandiSection`, `guitarSection`

**Labels and tooltips:** Notes Toolbox · Select · Start Note Input · Pitch Before Duration · Chords · Insert (Voice) · Insert (Player) · Insert (Global) · Insert (Global Adjustment of Current Bar) · Create Voice · Create Slash Voice · Next Voice · Dotted Notes · Tuplets · Scissors

**Commands triggered:**
- `NoteInput.MouseInputDisable?SetBasedOnButtonCheckedState`: Mouse Input Disable (SetBasedOnButtonCheckedState)
- `NoteInput.Enter`: Start Note Input [Set=true]
- `NoteInput.PitchBeforeDurationToggle`: Pitch Before Duration Toggle
- `NoteInput.StartEndChord`: Chord Input
- `NoteInput.Mode`: Note input mode
- `NoteInput.Locked`: Lock Note Durations
- `NoteInput.ForceDuration?SetBasedOnButtonCheckedState`: Force Note Durations
- `NoteInput.SetDotted?SetBasedOnButtonCheckedState&Value=1`: Set Dotted (SetBasedOnButtonCheckedState, Value=1)
- `NoteInput.SetDotted?SetBasedOnButtonCheckedState&Value=2`: Set Dotted (SetBasedOnButtonCheckedState, Value=2)
- `NoteInput.SetDotted?SetBasedOnButtonCheckedState&Value=3`: Set Dotted (SetBasedOnButtonCheckedState, Value=3)
- `NoteInput.SetDotted?SetBasedOnButtonCheckedState&Value=4`: Set Dotted (SetBasedOnButtonCheckedState, Value=4)
- `NoteInput.RestMode?SetBasedOnButtonCheckedState`: Rests
- `NoteInput.CreateGraceNote?SetBasedOnButtonCheckedState`: Create Grace Note (SetBasedOnButtonCheckedState)
- `NoteInput.Tie`: Tie
- `NoteInput.Scissor`: Scissor

### `projectwindow/writemode/notespanel`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_panels/write_mode_notes_panel_r.html

> The Notes panel contains all of the basic note durations, accidentals, articulations and slurs you need while inputting music. You can input music using the mouse, a MIDI keyboard, or your computer keyboard 
>

**Controls:** `slurSection`, `articulationSection`

**Labels and tooltips:** Notes Panel · Show/Hide All Notes · Accent · Marcato · Stressed · Unstressed · Staccato · Tenuto · Staccatissimo · Staccato Tenuto

**Commands triggered:**
- `NoteInput.ToggleFullAndReducedNoteInputButtons`: Toggle Full And Reduced Note Input Buttons
- `NoteInput.SetAccidental?Type=kNatural`: Set Accidental (Type=kNatural)
- `NoteInput.SetAccidental?Type=kFlat`: Set Accidental (Type=kFlat)
- `NoteInput.SetAccidental?Type=kSharp`: Set Accidental (Type=kSharp)
- `NoteInput.SlurStart`: Start Slur
- `NoteInput.SetArticulation?Value=kAccent`: Set Articulation
- `NoteInput.SetArticulation?Value=kMarcato`: Set Articulation (Value=kMarcato)
- `NoteInput.SetArticulation?Value=kStress`: Set Articulation (Value=kStress)
- `NoteInput.SetArticulation?Value=kUnstress`: Set Articulation (Value=kUnstress)
- `NoteInput.SetArticulation?Value=kStaccato`: Set Articulation
- `NoteInput.SetArticulation?Value=kTenuto`: Set Articulation
- `NoteInput.SetArticulation?Value=kStaccatissimo`: Set Articulation (Value=kStaccatissimo)
- `NoteInput.SetArticulation?Value=kStaccatoTenuto`: Set Articulation (Value=kStaccatoTenuto)
- `NoteInput.CreateVoice`: Create Voice
- `NoteInput.CreateSlashedVoice`: Create Slashed Voice
- `NoteInput.NextVoice`: Next Voice
- `NoteInput.InsertScope?InsertModeScope=kVoice`: Insert Scope (InsertModeScope=kVoice)
- `NoteInput.InsertScope?InsertModeScope=kPlayer`: Insert Scope (InsertModeScope=kPlayer)
- `NoteInput.InsertScope?InsertModeScope=kGlobal`: Insert Scope (InsertModeScope=kGlobal)
- `NoteInput.InsertScope?InsertModeScope=kGlobalCurrentBar`: Insert Scope (InsertModeScope=kGlobalCurrentBar)
- `NoteInput.SetDotted?Set=true&Value=1`: Set Dotted (Set=true, Value=1)
- `NoteInput.SetDotted?Set=true&Value=2`: Set Dotted (Set=true, Value=2)
- `NoteInput.SetDotted?Set=true&Value=3`: Set Dotted (Set=true, Value=3)
- `NoteInput.SetDotted?Set=true&Value=4`: Set Dotted (Set=true, Value=4)
- `NoteInput.GraceNoteSlashToggle?Set=false`: Grace Note Slash Toggle (Set=false)
- `NoteInput.GraceNoteSlashToggle?Set=true`: Grace Note Slash Toggle (Set=true)
- `NoteInput.StartTupletRun`: Start Tuplet Input

### `projectwindow/writemode/ornamentspanel` (OrnamentsPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_ornaments_panel_r.html


**Controls:** `verticalLayout_guitarSection`, `commonSection`, `windSection`, `brassSection`, `untunedPercussionSection`, `tunedPercussionSection`, `keyboardSection`, `choralSection`, `stringsSection`, `harpPedalsSection`

**Labels and tooltips:** Jazz · Plop Bend · Doit Bend (Short) · Doit Bend (Medium) · Doit Bend (Long) · Scoop · Fall Bend (Short) · Fall Bend (Medium) · Fall Bend (Long) · Lift (Wavy) · Lift (Straight) · Doit Smooth (Wavy) · Doit Smooth (Straight) · Plop Smooth (Wavy) · Plop Smooth (Straight) · Fall Smooth (Wavy) · Fall Smooth (Straight) · Remove · Baroque and Classical · Arpeggiation · Arpeggio Up · Arpeggio Down · Arpeggio Up (Curve) · Non Arpeggio · Glissandi · Glissando (Straight) · Glissando (Wavy) · Guitar · Guitar Bend · Guitar Bend with Vibrato Bar · Vibrato Bar Scoop · Vibrato Bar Dip · Vibrato Bar Line

**Commands triggered:**
- `NoteInput.RemoveJazzArticulation`: Remove Jazz Articulation

### `projectwindow/writemode/playingtechniquespanel` (PlayingTechniquesPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_playing_techniques_panel_r.html


**Controls:** `addCommonPlayingTechniqueButton`, `editCommonPlayingTechniqueButton`, `addWindPlayingTechniqueButton`, `editWindPlayingTechniqueButton`, `addBrassPlayingTechniqueButton`, `editBrassPlayingTechniqueButton`, `addUntunedPercussionPlayingTechniqueButton`, `editUntunedPercussionPlayingTechniqueButton`, `addTunedPercussionPlayingTechniqueButton`, `editTunedPercussionPlayingTechniqueButton`, `sustainPedalButton`, `sostenutoPedalButton`, `unaCordaPedalButton`, `retakePedalButton`, `changeLevelQuarterButton`, `changeLevelHalfButton`, `changeLevelThreeQuartersButton`, `changeLevelFullButton`, `addKeyboardPlayingTechniqueButton`, `editKeyboardPlayingTechniqueButton`, `addChoralPlayingTechniqueButton`, `editChoralPlayingTechniqueButton`, `addStringsPlayingTechniqueButton`, `editStringsPlayingTechniqueButton`, `addGuitarPlayingTechniqueButton`, `editGuitarPlayingTechniqueButton`, `cSharpRadioButton`, `dFlatRadioButton`, `eFlatRadioButton`, `dSharpRadioButton`, `fFlatRadioButton`, `eNatRadioButton`, `aFlatRadioButton`, `cFlatRadioButton`, `gSharpRadioButton`, `aSharpRadioButton`, `gFlatRadioButton`, `bSharpRadioButton`, `fSharpRadioButton`, `cNatRadioButton`, `gNatRadioButton`, `bNatRadioButton`, `bFlatRadioButton`, `dNatRadioButton`, `eSharpRadioButton`, `fNatRadioButton`, `aNatRadioButton`, `createHarpPedalChangePushButton`, `repeatEndingsSection`, `repeatMarkerSectionsSection`, `repeatMarkerJumpsSection`, `repeatWithinBeatsSection`, `barRepeatsSection`

**Labels and tooltips:** Common · Add Playing Technique · Edit Playing Technique · Wind · Unpitched Percussion · Pitched Percussion · Keyboard · Retake Pedal · Change Pedal Level: 1/4 · Change Pedal Level: 1/2 · Change Pedal Level: 3/4 · Change Pedal Level: 1 · Choral · Strings · Create

### `projectwindow/writemode/proofingpanel`

Manual: (no manual page)

_Not located in the main binary._

### `projectwindow/writemode/repeatstructures` (RepeatStructuresPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_repeat_structures_panel_r.html


**Controls:** `addRepeatEndingSection`, `codaButton`, `segnoButton`, `fineButton`, `slashRegionPushButton`, `barRepeatRegionPushButton`, `numberedBarRegionsPushButton`, `tapTempoSection`, `absoluteTempoChangeSection`, `gradualTempoChangeSection`, `relativeTempoChangeSection`, `resetTempoChangeSection`, `tempoEquationSection`, `tempoSlider`, `leftSingleDotButton`, `leftDoubleDotButton`

**Labels and tooltips:** D.S. al Coda · D.S. al Fine · D.S. · D.C. al Coda · D.C. al Fine · D.C. · To Coda · Coda · Segno · Fine · Repeat Endings · Create Repeat Ending · Add Section To Repeat Ending · Remove Single-note Tremolo · Z on Stem · One Stroke Multi-note Tremolo · Two Strokes Multi-note Tremolo · Four Strokes Single-Note Tremolo · Three Strokes Multi-note Tremolo · Four Strokes Multi-note Tremolo · Remove Multi-note Tremolo · One Stroke Single-note Tremolo · Two Strokes Single-note Tremolo · Three Strokes Single-Note Tremolo · Tremolo With Release · Tremolo With Attack · Create Slash Region · Create Bar Repeat Region · Numbered Bars · Create Numbered Bar Region

**Commands triggered:**
- `Edit.MakeNewRepeatEndingLine`: Make New Repeat Ending Line
- `Edit.AddSegmentToRepeatEndingLine`: Add Segment To Repeat Ending Line
- `Edit.ClearSingleNoteTremolo`: Clear Single Note Tremolo
- `Edit.MakeMultiNoteTremolo?Value=1`: Make Multi Note Tremolo (Value=1)
- `Edit.MakeMultiNoteTremolo?Value=2`: Make Multi Note Tremolo (Value=2)
- `Edit.MakeMultiNoteTremolo?Value=3`: Make Multi Note Tremolo (Value=3)
- `Edit.MakeMultiNoteTremolo?Value=4`: Make Multi Note Tremolo (Value=4)
- `Edit.ClearMultiNoteTremolo`: Clear Multi Note Tremolo
- `NoteInput.CreateSlashedRegion`: Create Slashed Region
- `NoteInput.CreateBarRepeatRegion`: Create Bar Repeat Region
- `NoteInput.CreateRegionNumberingRepeatedBars`: Create Region Numbering Repeated Bars

### `projectwindow/writemode/tempopanel` (TempoPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_tempo_panel_r.html


**Controls:** `tapTempoButton`, `tempoCreateButton`, `pocoGradualModifierButton`, `moltoGradualModifierButton`, `piuRelativeModifierButton`, `moltoRelativeModifierButton`, `pocoRelativeModifierButton`, `menoRelativeModifierButton`, `appenaRelativeModifierButton`, `doppioRelativeModifierButton`, `nonTroppoRelativeModifierButton`, `nonTantoRelativeModifierButton`, `leftSemiquaverButton`, `kTempoEquationLeftSemiquaverButton`, `leftQuaverButton`, `kTempoEquationLeftQuaverButton`, `leftCrotchetButton`, `kTempoEquationLeftCrotchetButton`, `leftMinimButton`, `kTempoEquationLeftMinimButton`, `leftSemibreveButton`, `kTempoEquationLeftSemibreveButton`, `kTempoEquationLeftSingleDotButton`, `kTempoEquationLeftDoubleDotButton`, `rightSemiquaverButton`, `kTempoEquationRightSemiquaverButton`, `rightQuaverButton`, `kTempoEquationRightQuaverButton`, `rightCrotchetButton`, `kTempoEquationRightCrotchetButton`, `rightMinimButton`, `kTempoEquationRightMinimButton`, `rightSemibreveButton`, `kTempoEquationRightSemibreveButton`, `kTempoEquationRightSingleDotButton`, `kTempoEquationRightDoubleDotButton`, `previewButton`, `commonTimeSignaturesSection`, `createTimeSignaturesSection`

**Labels and tooltips:** Tap Tempo · Absolute Tempo Change · Slower · Tempo Range Slider · Set the minimum and maximum tempos to display · Faster · Gradual Tempo Change · Relative Tempo Change · Reset Tempo · Tempo Equation

### `projectwindow/writemode/timesignaturespanel` (TimeSignaturesPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_time_signatures_panel_create_time_sig_section_r.html


**Controls:** `timeSignatureTypePopupMenuButton`, `pickupBarCheckBox`, `pickupBarBeatsPopupMenuButton`, `timeSignaturePreviewButton`, `videoSection`, `markerSection`

**Labels and tooltips:** Create Time Signature · Regular · Pick-up bar of: · 1 beat

### `projectwindow/writemode/videopanel` (VideoPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_notations_input/write_mode_markers_panel_r.html


**Controls:** `videoPropertyButton`, `markersTableView`, `addMarkerButton`, `removeMarkerButton`, `findTempoButton`

**Labels and tooltips:** Properties... · Find Tempo...

**Commands triggered:**
- `Video.Properties`: Properties

## Engrave mode

### `projectwindow/engravemode/engravetoolbox` (EngraveToolbox)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_engrave_toolbox_r.html

> Enable frame editing in the Engrave toolbox. You can create music, text and graphics frames in your layout or in page templates. Double-click a graphics frame to choose the graphic to appear in there. The position, size, margins and tab stops of frames can be edited using the Properties panel.
>

**Controls:** `graphicEditingButton`, `toolboxTabButton`, `frameEditingButton`, `staffSpacingButton`, `noteSpacingButton`, `graphicSlicesButton`

**Labels and tooltips:** Graphic Editing

**Commands triggered:**
- `Window.ShowEngraveModePanel?SpecialEditModeType=kGraphical`: Show Engrave Mode Panel (SpecialEditModeType=kGraphical)
- `Window.ShowEngraveModePanel?SpecialEditModeType=kFrame`: Show Engrave Mode Panel (SpecialEditModeType=kFrame)
- `Window.ShowEngraveModePanel?SpecialEditModeType=kStaffSpacing`: Show Engrave Mode Panel (SpecialEditModeType=kStaffSpacing)
- `Window.ShowEngraveModePanel?SpecialEditModeType=kNoteSpacing`: Show Engrave Mode Panel (SpecialEditModeType=kNoteSpacing)
- `Window.ShowEngraveModePanel?SpecialEditModeType=kGraphicSlices`: Show Engrave Mode Panel (SpecialEditModeType=kGraphicSlices)

### `projectwindow/engravemode/flowheadingspanel` (FlowHeadingsPanelContent)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_flow_headings_c.html


### `projectwindow/engravemode/framespanel` (FramesPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_frames_panel_r.html


### `projectwindow/engravemode/framespanel/constraints`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_constraints_c.html

> You can create music, text and graphics frames in your layout or in page templates. Double-click a graphics frame to choose the graphic to appear in there. The position, size, margins and tab stops of frames can be edited using the Properties panel.
>

**Labels and tooltips:** Insert Frames · Insert Music Frame · Insert Text Frame · Insert Graphics Frame · Constraints · Lock to Top Margin · Lock to Left Margin · Lock to Right Margin · Lock to Bottom Margin · Slice name

**Commands triggered:**
- `Page.ToggleFrameConstraints?Side=kTop`: Toggle Frame Constraints (Side=kTop)
- `Page.ToggleFrameConstraints?Side=kLeft`: Toggle Frame Constraints (Side=kLeft)
- `Page.ToggleFrameConstraints?Side=kRight`: Toggle Frame Constraints (Side=kRight)
- `Page.ToggleFrameConstraints?Side=kBottom`: Toggle Frame Constraints (Side=kBottom)

### `projectwindow/engravemode/framespanel/frames` (FramesPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_frames_c.html


**Commands triggered:**
- `Page.LoadCreateFrameCursor?Type=kMusic`: Load Create Frame Cursor (Type=kMusic)
- `Page.LoadCreateFrameCursor?Type=kText`: Load Create Frame Cursor (Type=kText)

### `projectwindow/engravemode/graphiceditingpanel/bracketing`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_brackets_braces/notation_reference_brackets_braces_custom_grouping_c.html

_Not located in the main binary._

### `projectwindow/engravemode/graphiceditingpanel/castingoff`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/page_formatting/page_formatting_casting_off_c.html

_Not located in the main binary._

### `projectwindow/engravemode/graphicslicespanel` (GraphicSlicePanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_graphic_slices_panel_r.html


**Controls:** `graphicSlicesSection`, `createSliceButton`, `slicesTableView`, `renameSliceButton`, `removeSliceButton`, `saveAsDefaultButton`, `exportButton`, `pagesSection`, `masterPagesSection`, `flowHeadingsSection`, `masterPageSetsSection`

**Labels and tooltips:** Create Slice

**Commands triggered:**
- `Page.LoadCreateFrameCursor?Type=kGraphicSlice`: Load Create Frame Cursor (Type=kGraphicSlice)

### `projectwindow/engravemode/masterpageeditortoolbar` (MasterPageEditorToolbar)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_page_templates_customizing_t.html


**Controls:** `copyLayoutLeftToRightButton`, `copyLayoutRightToLeftButton`

**Labels and tooltips:** Editing Page Template: · Editing Flow Heading: · Copy Page Layout: · Copy left to right · Copy right to left · Welcome to Dorico

**Commands triggered:**
- `Page.MasterPageCopyLeftToRight`: Master Page Copy Left To Right
- `Page.MasterPageCopyRightToLeft`: Master Page Copy Right To Left

### `projectwindow/engravemode/pagespanel/flowheadings`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_flow_headings_c.html


**Commands triggered:**
- `Page.CreateFlowHeadingInSet`: Create Flow Heading In Set
- `Page.EditFlowHeading`: Edit Flow Heading

### `projectwindow/engravemode/pagespanel/pages` (PagesMasterPagesPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_page_format_changes_c.html


**Commands triggered:**
- `Page.InsertPages`: Insert Pages
- `Page.AddPageNumberChange`: Add Page Number Change
- `Page.AddMasterPageChange`: Add Master Page Change
- `Page.AddFlowHeadingChange`: Add Flow Heading Change
- `Page.MovePagesEarlier`: Move Pages Earlier

### `projectwindow/engravemode/pagespanel/pagetemplates`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_page_templates_c.html


**Commands triggered:**
- `Page.CreateMasterPagePairInSet`: Create Master Page Pair In Set
- `Page.EditMasterPagePair`: Edit Master Page Pair
- `Page.EditMasterPagePairInfo`: Edit Master Page Pair Info

### `projectwindow/engravemode/pagespanel/pagetemplatesets`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_page_template_sets_c.html

> Use the Pages panel to add blank pages, change page numbering, or apply a different page template to one or more pages of your layout. Pages you have edited manually show colored triangles in the corner to indicate they have overrides.
>
> Edit the page templates used in your project here. Page templates allow you to produce a consistent page layout everywhere in your project. Each page template consists of a pair of facing pages. Double-click a page template to edit its contents.
>

**Controls:** `masterPageSetsListView`, `duplicateButton`, `breadcrumbSegmentButton`, `breadcrumbRootButton`, `noCapoToggleButton`, `fullCapoToggleButton`, `partialCapoToggleButton`, `capoFretSpinBox`, `partialCapoFromSpinBox`, `partialCapoToSpinBox`

**Labels and tooltips:** Insert Pages · Insert Page Number Change · Insert Page Template Change · Insert Flow Heading Change · Swap with Previous Page · Swap with Next Page · Remove Overrides · Page Templates · Current set · Default set · New Page Template · Edit Page Template · Rename Page Template · Import Page Template · Delete Page Template · Flow Headings · New Flow Heading · Edit Flow Heading · Rename Flow Heading · Delete Flow Heading · Master Page Sets · Page Template Sets · New Page Template Set · Rename Page Template Set · Import Page Template Set · Export Page Template Set · Delete Page Template Set · Duplicate · Save Endpoint Configuration · Delete · Capo: · Full Capo · Partial Capo · Fret: · From string:

## Play mode

### `projectwindow/playmode/trackinspector`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/play_mode/play_mode_track_inspector_r.html

_Not located in the main binary._

### `projectwindow/playmode/trackoverview`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/play_mode/play_mode_track_overview_r.html

_Not located in the main binary._

### `projectwindow/playmode/vstinstrumentspanel`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/play_mode/play_mode_vst_midi_panel_r.html

_Not located in the main binary._

## Print (Publish) mode

### `projectwindow/printmode/layoutspanel` (PrintLayoutsPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/print_mode/print_mode_layouts_panel_r.html

> Select a layout here to see it in the print preview. The layouts selected in this panel will be printed or exported as graphics when you click Print or Export in the print options panel. Change the number of copies to be printed by clicking the + or 
>
>  buttons. Expand the layout to see its page size and its number of pages, to decide what kind of print job you need.
>

**Controls:** `printLayoutsListView`, `pageSetupButton`, `printSettingsButton`

**Labels and tooltips:** OSDialogButtonsFrame · System Dialogs: · Page Setup... · Print...

### `projectwindow/printmode/optionspanel` (PrintOptionsPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/print_mode/print_mode_print_options_panel_r.html

> Choose between printing or exporting graphics in the Destination section of the print options panel. Choose whether to print 2-up, as spreads, or as a booklet in the Job Type section, and add printer
>

**Controls:** `printOrExportButton`, `destinationSection`, `jobTypeSection`, `pageSetupSection`, `duplexingSection`, `printingMarksSection`, `printerToggle`, `kPrintOptionsPrinterDestinationButton`, `graphicsToggle`, `kPrintOptionsGraphicsDestinationButton`, `numCopiesSpinBox`, `monoToggle`, `colourToggle`, `transparentBackgroundCheckBox`, `resolutionPopUpMenuButton`, `folderNameLineEdit`, `chooseFolderButton`, `allPagesToggle`, `pageRangeToggle`, `flowsToggle`, `pageRangesLineEdit`, `sectionLineEdit`, `flowsLineEdit`, `chooseFlowsButton`, `portraitToggle`, `landscapeToggle`, `finalPagePortraitToggle`, `finalPageLandscapeToggle`, `autoScaleToggle`, `customScaleToggle`, `customScaleLineEdit`, `duplexTypeCombo`, `portraitFlipTypeCombo`, `landscapeFlipTypeCombo`, `watermarkLineEdit`

**Labels and tooltips:** Print Options · Print and Export · Choose a directory for graphic export · Frame · Destination · Scaling · Border · Watermark · Printer · Graphics · Select printer · Copies · Number of Copies · Collate copies · Mono · Color · Transparent background · Resolution · Destination folder · Choose Folder · File Name Options... · Job Type · Print range: · Pages · Separate file for each flow · Page Setup · Paper Size · Print odd final page on · Fit to Paper · Custom Scale · Scale factor · Duplex Printing · Print on · Print on one side only · Portrait Paper Feed · Long edge · Landscape Paper Feed · Reverse order of outward pages · Annotations · Crop marks · Date and time · Watermark Text · Proof · View options

## Lower zone (Properties, key editor, mixer, keyboard, fretboard, drum pads)

### `projectwindow/lowerzone/drumpads`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_panels/write_mode_drum_pads_panel_r.html

_Not located in the main binary._

### `projectwindow/lowerzone/fretboard`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_panels/write_mode_fretboard_panel_r.html

_Not located in the main binary._

### `projectwindow/lowerzone/keyboard`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_panels/write_mode_keyboard_panel_r.html

_Not located in the main binary._

### `projectwindow/lowerzone/keyeditor`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/key_editor/key_editor_panel_r.html

_Not located in the main binary._

### `projectwindow/lowerzone/keyeditor/cceditor`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/key_editor/key_editor_midi_cc_editor_r.html

_Not located in the main binary._

### `projectwindow/lowerzone/keyeditor/histogram`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/key_editor/key_editor_histogram_tool_r.html

_Not located in the main binary._

### `projectwindow/lowerzone/keyeditor/playingtechniques`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/key_editor/key_editor_playing_techniques_editor_r.html

_Not located in the main binary._

### `projectwindow/lowerzone/keyeditor/toolbar`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/key_editor/key_editor_panel_toolbar_r.html

_Not located in the main binary._

### `projectwindow/lowerzone/keyeditor/velocityeditor`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/key_editor/key_editor_velocity_editor_r.html

_Not located in the main binary._

### `projectwindow/lowerzone/mixer`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/mixer/mixer_panel_r.html

_Not located in the main binary._

### `projectwindow/lowerzone/mixer/detail`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/mixer/mixer_channel_strips_r.html

_Not located in the main binary._

### `projectwindow/lowerzone/mixer/toolbar`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/mixer/mixer_toolbar_r.html

_Not located in the main binary._

### `projectwindow/lowerzone/propertiespanel` (PropertiesPanel)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/properties/properties_panel_r.html

> Change the appearance or behavior of individual items in the music using the advanced options found in the Properties panel. Click a property switch to activate it and set a property, and click it again to remove the property. For some kinds of items, more properties appear in Engrave mode than in Write mode.
>

**Controls:** `propertiesSectionSlideSwitch`

### `projectwindow/lowerzone/propertiesscopecontrols`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/properties/properties_panel_local_global_scope_c.html

_Not located in the main binary._

### `projectwindow/lowerzone/propertiestoolbar`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/properties/properties_panel_r.html

_Not located in the main binary._

## Dialogs

### `dialogs/characterstyles` (EditCharacterStylesDialog)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_character_styles_dialog_r.html


**Controls:** `narrowSpinBox`, `dialogSlideSwitch`, `relativeSizeInPartsButton`, `absoluteSizeInPartsButton`, `relativeSizeButton`, `absoluteSizeButton`, `fontFeaturesTableView`

### `dialogs/chorddiagrams` (EditChordDiagramsDialog)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_chord_diagrams_dialog_r.html


### `dialogs/chordsymbolkerningpairs` (EditChordSymbolKerningPairsDialog)

Manual: (no manual page)


### `dialogs/editaccidental` (EditAccidentalDialog)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_tonality_systems_edit_accidental_dialog_r.html


**Controls:** `chordSymbolLineEdit`, `nextQualityButton`, `previousQualityButton`, `nextIntervalButton`, `previousIntervalButton`, `kerningValueSpinBox`, `addChordSymbolOverrideLineEdit`

**Labels and tooltips:** Edit Accidental · Pitch delta: · Enter full or partial chord symbol: · Alt+Up · Alt+Down · Ctrl+Up · Ctrl+Down · Edit Composite Component · Unrecognised chord

### `dialogs/editchordsymbolappearance` (OKCancelButtonsFrame)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_chord_symbols_edit_chord_symbol_appearance_dialog_r.html


**Controls:** `zoomOutButton`, `zoomInButton`, `noteNameButton`, `accidentalButton`, `writtenPitchButton`, `soundingPitchButton`, `clearButton`, `useOctaveCheckBox`, `octaveSpinBox`, `integralTempoOnlyButton`, `allowQuarterStepTempoButton`, `createTempoButton`, `markersSection`, `barSelectorSpinBox`, `flowSelector`, `pageIndexSpinBox`, `rehearsalMarkSpinBox`, `flowSelectorPopupMenuButton`, `searchLineEdit`, `rastralSizeSelector`, `percentageSpinBox`, `setTransposeByNumberOfDivisionsPopupMenuButton`, `numberOfOctavesSpinBox`, `transposeByQualityButton`, `transposeByNumberOfDivisionsButton`, `setTransposeQualityPopupMenuButton`, `transposeIntervalPopupMenuButton`, `transposeUpButton`, `transposeDownButton`, `keepChordSymbolAppearanceOverridesCheckBox`, `preventDuplicatedUnisonsCheckBox`, `onlyAddAboveOrBelowOutermostNotesCheckBox`

**Labels and tooltips:** Edit Chord Symbol Appearance · Edit Lyrics · Zoom Out · Zoom In · Edit Lyric · Filter Notes by Pitch · Written · Sounding · Remove Selected · Clear · 200  · Selected tempo::  · Find Tempo · Beat unit: · Tempos found · Tempo increments: · Integral only · Allow increment by 0.25  · Apply · Go To Bar · Bar: · Flow · Go to Page · Page: · Go To Rehearsal Mark · Rehearsal mark: · All ranges (U+E000 · U+F3FF) · Insert Music Text · Custom Staff Size · Default staff size: · New staff size: · Scale factor:

### `dialogs/editchordsymbolcomponent`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_chord_symbols_edit_chord_symbol_component_dialog_r.html

> This will override the existing project default chord symbol appearance. Choose OK to continue
>
> QCheckedInt<Int, Impl, FailureReportPolicy> QtPrivate::QCheckedIntegers::QCheckedInt<int>::operator-() const [Int = int, Impl = QtPrivate::QCheckedIntegers::SafeCheckImpl<int>, FailureReportPolicy = QtPrivate::QCheckedIntegers::AssertReportPolicy]
>
> SectionedPanelSection::SectionedPanelSection(SectionedPanel &, Steinberg::Steam::PaletteSectionID, const QString &, const QString &, const QString &, const QString &)
>

**Controls:** `previousRootButton`, `nextRootButton`, `discardChangesButton`, `normalAppearanceButton`, `italicisedAppearanceButton`, `parenthesisedAppearanceButton`, `italicisedAndParenthesisedAppearanceButton`, `synchronizeAppearancesCheckBox`, `editComponentInEditorPushButton`, `prevPushButton`, `nextPushButton`, `zoomSlider`, `chordSymbolComponentListView`, `editComponentInListPushButton`, `editComponentCopyPushButton`, `revertComponentPushButton`, `componentXOffsetDoubleSpinBox`, `resetXOffsetPushButton`, `componentYOffsetDoubleSpinBox`, `resetYOffsetPushButton`, `componentScaleDoubleSpinBox`, `resetScalePushButton`, `promoteSingleOverrideButton`, `filterLineEdit`, `sidebarListView`, `frameFilterCheckBox`, `layoutThumbnailButton`, `chooseLayoutPushButton`, `notationOnlyButton`, `notationAndTabButton`, `tabOnlyButton`, `showRhythmsInTabCheckBox`, `useFrettedInstrumentTranspositionForNotationCheckBox`, `forNotationButton`, `forNotationAndMainChordSymbolsButton`, `fiveLineStaveButton`, `gridButton`, `individualInstrumentsButton`, `addAttachmentButton`, `deletePushButton`, `componentTabButton`, `tabButton`, `stemTabButton`, `attachmentsTabButton`, `cutOutsTabButton`, `xScaleDoubleSpinBox`, `yOffsetDoubleSpinBox`, `xOffsetDoubleSpinBox`, `moveForwardPushButton`, `moveBackPushButton`, `colourLineEdit`, `colourSwitch`, `yScaleDoubleSpinBox`, `stemUpXSpinBox`, `stemUpYSpinBox`, `stemUpPushButton`, `splitStemUpWXSpinBox`, `splitStemUpWYSpinBox`, `splitStemUpWPushButton`, `stemDownXSpinBox`

**Labels and tooltips:** Edited component (source) before save · Destination editor before save · Destination editor after save · Editing: · Prev root · Next root · Discard current changes to chord symbol · Appearance:  · Parenthesized · Italicized and parenthesized · Synchronize with normal appearance · Edit Component · Select: · Zoom: · Component · Add Component · Revert Component · X offset: · Reset X offset · Y offset: · Reset Y offset · Scale: · Reset Scale · Divisions · Divisions per octave:  · Divisions for specific intervals:  · Project default appearance already exists · Edit Custom Chord Symbol Appearance · Promote Single Override... · Search... · Apply Chord Symbol Appearance to All Roots · Apply to All Roots · Edit Custom Chord Definition · Reset to Default · Dorico Icons · Overflow in unary negation · New Tab · Select a recent layout · Or select a layout from the list · Performance · Tahoma · Response: %1 ms · Redraw: %3 ms  · Player name: · Notation only · Notation and tablature · Show rhythms in tablature · Use fretted instrument transposition: · For notation · For notation and main chord symbols · 5-line Staff · Grid · Single-line Instruments · RangeSliderPrivate::triggerAction: Unknown action · QStylePainter::QStylePainter · Widget must be non-zero

### `dialogs/editdefaultchordsymbolappearance`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_chord_symbols_project_default_chord_symbol_appearances_dialog_r.html


**Controls:** `trebleClefButton`, `bassClefButton`, `altoClefButton`, `tenorClefButton`, `rootPopupMenuButton`, `staffPosUpButton`, `staffPosDownButton`, `octaveUpButton`, `octaveDownButton`, `orderLeftButton`, `orderRightButton`, `deleteAccidentalButton`

**Labels and tooltips:** Project Default Chord Symbol Appearances · Enter a chord symbol: · Add Project Default

### `dialogs/editinstrumentnames`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/setup_mode/setup_mode_edit_instrument_names_dialog_r.html


**Controls:** `overriddenNoteheadTableView`, `playingTechniquesPresentationListView`, `noteheadSetPopupMenuButton`, `staffPositionBelowPushButton`, `staffPositionLinePushButton`, `staffPositionAbovePushButton`, `techniquesListView`, `addAdditionalTechniqueButton`, `removeAdditionalTechniqueButton`, `noTremoloStrokesTechniqueButton`, `oneTremoloStrokeTechniqueButton`, `twoTremoloStrokesTechniqueButton`, `threeTremoloStrokesTechniqueButton`, `zOnStemTechniqueButton`, `accentTechniqueButton`, `marcatoTechniqueButton`, `staccatoTechniqueButton`, `tenutoTechniqueButton`, `staccatissimoTechniqueButton`, `staccatoTenutoTechniqueButton`, `stressedTechniqueButton`, `unstressedTechniqueButton`, `overridePlayingTechniqueSelectorLineEdit`, `overridePlayingTechniqueSelectorButton`, `replacePlayingTechniqueButton`, `addPlayingTechniqueButton`, `familySelector`, `scoreInstrumentFilterPushButton`, `allInstrumentsListView`, `createFromExistingPushButton`, `editPercussionPlayingTechniquesPushButton`, `editStringsAndTuningPushButton`, `editPercussionKitPushButton`, `variantNameLineEdit`, `resetVariantStringPushButton`, `uiNameLineEdit`, `editFamiliesPushButton`, `editInstrumentNamesPushButton`, `numberOfStaveLinesSpinBox`, `showChordSymbolsCheckBox`, `numStavesSpinBox`, `braceButton`, `bracketButton`, `isVocalStaveCheckBox`, `stemDirectionUpPushButton`, `stemDirectionDownPushButton`, `bracketSpanSpinBox`, `barlineSpanSpinBox`, `clef3NTpushButton`, `clef2TpushButton`, `clef2NTpushButton`, `clef1TpushButton`, `clef1NTpushButton`, `clef4TpushButton`, `clef3TpushButton`, `clef4NTpushButton`, `usesKeySignaturesCheckBox`, `intervalNoteName8veSpinBox`, `octaveNoteName8veSpinBox`, `stdRangeStartSpinBox`, `stdRangeEndSpinBox`

**Labels and tooltips:** Edit Instrument Names · Editing instrument:  · Instrument UI Name · Singular names · Plural names · Full name · Short name · Show transposition: · Follow Layout Options · Save as default for instrument · Instrument · Override Percussion Noteheads · Percussion Instrument Playing Techniques · Delete Playing Technique · Notehead set: · Staff position: · Add Technique · Delete Technique · Playback of Articulations and Tremolos · Tremolo strokes: · Playback technique: · Choose Playing Techniques · Replace · Family

### `dialogs/editkeysignature`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_tonality_systems_edit_custom_key_signature_dialog_r.html


**Labels and tooltips:** Edit Custom Key Signature · Clef: · Root: · Note:

### `dialogs/editlineannotation` (Underlined)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_lines_edit_line_annotation_dialog_r.html


**Controls:** `styleButton`, `widthSpinBox`, `heightSpinBox`, `lineWidthSpinBox`, `compositeButton`, `horizontalAttachmentButton`, `verticalAttachmentButton`, `gapAboveSpinBox`, `gapBelowSpinBox`, `gapOnTheLeftSpinBox`, `gapOnTheRightSpinBox`, `rotationButton`, `lengthSpinBox`, `fontStyleButton`, `borderThicknessSpinBox`, `borderCheckBox`, `eraseBackgroundCheckBox`, `bodyStyleButton`, `dashGapPatternLineEdit`, `lineSeparationSpinBox`, `patternViewShowLineButton`, `repeatModeButton`, `drawEndsAsContinuationCheckBox`, `addStartButton`, `addEndButton`, `allCompositeShowLineButton`, `editRCButton`, `wedgeTypeButton`, `startThicknessSpinBox`, `endThicknessSpinBox`, `middleThicknessSpinBox`, `middleThicknessCheckBox`, `startControlPointXSpinBox`, `startControlPointYSpinBox`, `endControlPointXSpinBox`, `endControlPointYSpinBox`, `mirrorCheckBox`, `thicknessTypeButton`, `dampingFactorSpinBox`, `startYOffsetSpinBox`, `endYOffsetSpinBox`, `upButton`, `downButton`, `clampProportionalScalingCheckBox`, `minForProportionalScalingSpinBox`, `maxForProportionalScalingSpinBox`, `minLengthThresholdSpinBox`, `maxLengthThresholdSpinBox`, `drawnAppearanceTypeButton`, `dashLengthDotDiameterSpinBox`, `dashGapDotGapSpinBox`, `wholeBodyCheckBox`, `hookDashPatternCheckBox`, `continuationEndCapButton`, `gapToObjectSpinBox`, `considerForNoteSpacingCheckBox`, `verticalPlacementButton`, `endCapButton`, `startCapButton`, `continuationCapButton`, `gapToStaveLineCheckBox`, `gapToObjectCheckBox`, `gapToStaveLineSpinBox`, `noAnnotationToggleButton`, `centreAnnotationToggleButton`, `hyphenatedTextToggleButton`, `caRepeateButton`, `caRepeatDistanceSpinBox`, `caAlwaysHorizontalCheckBox`, `centralAnnotationButton`, `caVerticalPositionButton`, `caStartEndGapSpinBox`, `caPlacementButton`, `caOffsetSpinBox`, `caHorizontalPositionButton`, `syllablesLineEdit`, `htPositionButton`, `endsWithTextCheckBox`, `startsWithTextCheckBox`, `htStartEndGapSpinBox`, `percussionMapsListView`, `multiplePushButton`, `singlePushButton`, `versionSpinBox`, `drumKitNoteMapSection`, `noteMapTableView`

**Labels and tooltips:** Arrow style: · Symbol: · Horizontal attachment: · Vertical attachment: · Gap above: · Gap below: · Gap on the left: · Gap on the right: · Rotation: · Length: · Font style: · Ignore font metrics · Border: · Dash-gap pattern: · Line separation: · Show Repeat Point · Remove from pattern · Repetition: · When line crosses system break, add ends to each segment · Add to Start · Add to Middle · Add to End · Wedge type: · Start thickness: · End thickness: · Middle thickness: · Start control point: · End control point: · Mirror curve · Thickness type: · Damping factor: · Clamp: · Threshold: · End cap: · Whole body on each system · Hooks follow dash pattern · Start cap: · Line Body Editor... · Continuation end cap: · Continuation cap: · Distance from staff line: · Distance from item: · Body style: · Line Annotation Editor... · Annotation: · Center Annotation · Repeat distance: · Repeat: · Start/end gap: · Offset: · Position: · Syllables: · Ends with text · Starts with text · Show Crossing Break · Edit Music Symbols · C&lear

### `dialogs/editnoteheadtype`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_notehead_sets_custom_edit_notehead_dialog_r.html


**Controls:** `noteheadSetsCategoryPushButton`, `noteheadListView`, `addNoteheadPushButton`, `removeNoteheadPushButton`, `noteheadChooserPushButton`, `durationPushButton`, `shorterThanCheckBox`, `longerThanCheckBox`, `degreeSpinBox`, `noteNamePushButton`, `accidentalPushButton`, `stemDirectionCheckBox`, `doubleWholeNoteCheckBox`, `noteRoundPushButton`, `noteSquarePushButton`, `editCompositePushButton`

### `dialogs/editplayingtechniqueappearance` (Attribute)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_playing_techniques_edit_playing_technique_dialog_r.html


**Controls:** `playingTechniqueListCategoryPushButton`, `editLeftCompositePushButton`, `editRightCompositePushButton`, `generalButton`, `continuationButton`, `shownInCuesButton`, `notShownInCuesButton`, `aboveButton`, `belowButton`, `sameAboveAndBelowButton`, `differentAboveAndBelowButton`, `shownOnTabStaveButton`, `notShownOnTabStaveButton`, `textLineEdit`, `popoverTextLineEdit`, `editPlayingTechniqueButton`, `isBowingMarkCheckBox`

### `dialogs/editplayingtechniqueappearances`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_playing_techniques_edit_playing_techniques_dialog_r.html


**Labels and tooltips:** Edit Playing Techniques · Single / Above Appearance · Edit Composite · Below Appearance · Shown in cues · Not shown in cues · Tablature: · Staff-relative · Absolute · Same above and below · Different above and below · Popover text: · Always shown · Shown if no notation staff · Bowing mark · Transition line: · Duration line: · Alignment above: · Below: · Continuation type:

### `dialogs/editrepeatablesymbol`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_lines_edit_repeatable_symbol_dialog_r.html

> Beware! Some of the part layouts selected for printing or export are currently set to concert pitch. Select the layouts that you want to print or export in transposed pitch and click 'Change Transposition', or click 'Proceed Anyway' to print or export without changing the transposition of any of these layouts.
>
> You are currently using a trial license for %1%.  You can use it for another %2%.
>
> Click the "Buy %1%" button to purchase a permanent license or click the "Enter Activation Code" button if you have another license.
>
> No license was found. Click Enter Activation Code to launch eLicenser Control Center and enter your Activation Code.
>

**Controls:** `showMultipleButton`, `showLinesButton`, `editCompositeButton`, `repeatOffsetSpinBox`, `lowTempoSpinBox`, `highTempoSpinBox`, `quaverUnitButton`, `semiQuaverUnitButton`, `formatPopupMenuButton`, `filenameRecipeLineEdit`, `copyToAllButton`, `defaultSeparatorLineEdit`, `timeButton`, `layoutNumberButton`, `pageNumberButton`, `dateButton`, `layoutNameButton`, `filenameButton`, `projectTitleButton`, `flowNameButton`, `flowNumberButton`, `layoutsTableView`, `proceedAnywayButton`, `changeTranspositionButton`, `buyButton`, `ghostButton`, `enterACButton`, `continueTrialButton`, `exitButton`, `retryButton`, `controlPanelButton`, `playbackTemplateTableView`, `editButton`, `showFactoryButton`, `importButton`, `applyButton`, `filterButton`, `endpointConfigListView`, `spaceTemplateStringListMenuButton`, `addManualButton`, `addAutoButton`, `familyOverridesListView`, `addFamilyMappingButton`, `removeFamilyMappingButton`, `instrumentOverridesListView`, `addInstrumentMappingButton`, `removeInstrumentMappingButton`, `editEndpointConfigurationsButton`, `setNumChannelsButton`, `endpointSetupTableView`

**Labels and tooltips:** Show Multiple · Repeat offset: · Edit Playback Playing Techniques · Low tempo · High tempo · 8th (Quaver) · 16th (Semiquaver) · Swing unit: · Depends on tempo · Export File Names · File names for: · File name recipe: · Copy to All · File name ingredients: · Default separator: · Layout Transposition Warning · Proceed Anyway · Change Transposition · Your Trial License · Thank you for trying %1% · Buy %1% · Continue Trial · No valid licence found · E&xit · License Expiry Notification · Your license expires soon. · Your license expires in %time%. · Read-only · Stage Template · Space Template · Apply Playback Template · Add Playback Template · Duplicate Playback Template · Edit Playback Template · Show All Factory · Export Playback Template · Import Playback Template · Edit Endpoint Configurations · Show only matching endpoint configurations · Delete Endpoint Configuration · Creator · Space template: · Entries · Add &Manual · Add Automatic · Family Overrides · Add Instrument Family · Delete Instrument Family · Instrument Overrides

### `dialogs/edittonalitysystem`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_tonality_systems_edit_tonality_system_dialog_r.html


**Controls:** `xmapFilterButton`, `expressionMapsListView`, `addXmapButton`, `duplicateXmapButton`, `removeXmapButton`, `xmapVersionSpinBox`, `microtonalityPlaybackPresetComboBox`, `lockExpressionMapHeaderDataButton`, `pitchBendRangeSpinBox`, `switchesTableView`, `addBaseSwitchButton`, `addAddonSwitchButton`, `duplicateSwitchButton`, `editTechniqueComboButton`, `switchAuditionButton`, `removeTechniqueButton`, `switchEnabledCheckBox`, `onEventsButton`, `offEventsButton`, `actionsTableView`, `addControlChangeButton`, `addProgramChangeButton`, `addNoteEventButton`, `addAbsChannelChangeButton`, `addRelChannelChangeButton`, `duplicateActionButton`, `actionUpButton`, `actionDownButton`, `removeActionButton`, `anyOfButton`, `allOfButton`, `conditionsTableView`, `addConditionButton`, `duplicateConditionButton`, `removeConditionButton`, `playbackOptionsOverridesSection`, `mutualExclusionGroupsSection`, `mutexGroupTechniquesListView`, `addMutexTechniqueButton`, `removeMutexTechniqueButton`, `mutexGroupsListView`, `addMutexGroupButton`, `removeMutexGroupButton`, `mutualExclusionAutoButton`, `resetToLibDefaultButton`, `importCubaseMapButton`, `monophonicLegatoCheckBox`, `millisecondsBeforeSpinBox`, `lengthFactorSpinBox`, `lengthCheckBox`, `applyMillisecondsBeforeToControllersCheckBox`, `applyMillisecondsBeforeToEndOffsetsCheckBox`, `noteVelocityRadioButton`, `controlChangeRadioButton`, `controlChangeSpinBox`, `minDynamic1SpinBox`, `maxDynamic1SpinBox`, `secondaryDynamicCheckBox`, `secondaryNoteVelocityRadioButton`, `secondaryControlChangeRadioButton`, `secondaryControlChangeSpinBox`, `minDynamic2SpinBox`, `maxDynamic2SpinBox`, `velocityAttackCheckBox`, `velocityFactorSpinBox`, `maxPitchSpinBox`, `minPitchSpinBox`

**Labels and tooltips:** New Accidental · Duplicate Accidental · Delete Accidental · New Key Signature · Edit Key Signature · Delete Key Signature · Expressionmap · Alt+A · Expression Maps · Show only expression maps used in this project · Add Expression Map · Duplicate Expression Map · Delete Expression Map · Expression Map Data · Microtonality playback: · Apply Stage Template settings · Description · Pitch bend range:  · Plug-ins: · Lock Info · Version: · Creator: · Base and Add-on Switches · Add Base Switch · Add Technique Add-on Switch · Duplicate Technique · Edit Technique · Audition · Actions: · On Events · Off Events · O&ff events · Add Control Change Action · Add Program Change Action · Add Key Switch Note Action · Add Absolute Channel Change Action · Abs Ch. · Add Relative Channel Change Action · Rel Ch. · Transpose Up 1 Octave · Shifts switches in the expression by an octave · Transpose Down 1 Octave · Duplicate Action · Move Action Up · Move Action Down · Delete Action · Conditions: · An&y of · A&ll of · Playback Options Overrides · Mutual Exclusion Groups · Has techniques: · Mutual Exclusion Groups: · Create mutual exclusion groups automatically · Import &Cubase Expression Map... · Use velocity for attack DEBUG ONLY · Monophonic legato · Delay: · Length %: · Apply delay to: · End offsets · Volume dynamic: · Note velocity · Control change · Min: · Max: · Use Secondary dynamic · Max. pitch: · Min. pitch: · Velocity %:

### `dialogs/endpointsetup`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/play_mode/play_mode_endpoint_setup_dialog_r.html

> It may be scanning plug-ins, and a plug-in may be showing a dialog that requires your attention. 
>
> Try minimizing Dorico or switching windows to check for dialogs from plug-ins.
>
> If the engine is not responding then click **Terminate** to quit the process. Dorico will create a diagnostic report on your desktop, and open your desktop folder. After the audio engine has been terminated, try restarting Dorico.
>
> This project is set to play back using Iconica Sketch, and has more than 8 players. Your iPad has 4GB RAM or less. For larger projects, we recommend an iPad with more than 4GB RAM. If you use Iconica Sketch with this project, iPadOS may terminate Dorico because it is using too much RAM. We recommend you use the General MIDI sounds with this project instead.
>

**Controls:** `waitButton`, `killButton`, `nameCombo`, `importDiagramButton`, `exportDiagramButton`, `exportEntireLibraryButton`, `sourcePageSpinBox`, `destPageRangeStartSpinBox`, `destPageRangeEndSpinBox`, `flowHeadingNameLineEdit`, `masterPageNameLineEdit`, `startPageSpinBox`, `flowHeadingSelector`, `currentPageOnlyButton`, `thisPageOnwardsButton`, `bottomMarginToggle`, `largeSwitch`, `topMarginToggle`, `masterPageSetsPopUpMenuButton`, `pagePairsListView`, `numPagesSpinBox`, `insertionLocationSpinBox`, `pageInsertionLocationComboBox`, `masterPagePairDefinitionComboBox`, `masterPageSelector`, `movePagesLocationComboBox`, `moveToLocationSpinBox`, `newFlowHeadingNameLineEdit`, `basedOnPopupMenuButton`, `defaultHeadingTypeButton`, `customHeadingTypeButton`, `newMasterPageNameLineEdit`, `firstPageTypeButton`, `defaultPageTypeButton`, `customPageTypeButton`, `graceNoteSpacingScaleToggle`, `graceNoteSpacingScaleResetButton`, `graceNoteSpacingScaleSetToButton`, `customRatioToggle`, `customRatioResetButton`, `customRatioSetToButton`, `floorSizeToggle`, `floorSizeResetButton`, `floorSizeSetToButton`, `cueNoteSpacingScaleToggle`, `cueNoteSpacingScaleResetButton`, `cueNoteSpacingScaleSetToButton`, `crotchetSizeToggle`, `crotchetSizeResetButton`, `crotchetSizeSetToButton`, `generateSpacingRodsForLyricsToggle`, `generateSpacingRodsForLyricsResetButton`, `generateSpacingRodsForLyricsSetToButton`, `numberSpinBox`, `appearanceComboBox`, `visibilityComboBox`, `subAppearanceComboBox`, `subNumberSpinBox`, `groupsTableView`, `preventPlayingTechniqueAmalgamationSwitch`, `preventPlayingTechniqueAmalgamationResetButton`, `preventPlayingTechniqueAmalgamationChangeButton`, `minimumLengthToHideRestsForSilentPlayersSwitch`, `minimumLengthToHideRestsForSilentPlayersResetButton`, `minimumLengthToHideRestsForSilentPlayersChangeButton`, `phraseMaxPitchCrossCountSwitch`, `phraseMaxPitchCrossCountResetButton`, `phraseMaxPitchCrossCountChangeButton`, `allowAnyNumberOfPitchCrossesSwitch`, `allowAnyNumberOfPitchCrossesResetButton`, `allowAnyNumberOfPitchCrossesChangeButton`, `allowTrueUnisonsSwitch`, `allowTrueUnisonsResetButton`, `allowTrueUnisonsChangeButton`, `silentPlayerPolicySwitch`, `silentPlayerPolicyResetButton`, `silentPlayerPolicyChangeButton`, `silentPlayersLabelOnlyButton`, `includeSilentPlayersButton`, `excludeSilentPlayersButton`, `slurAmalgamationPolicySwitch`, `slurAmalgamationPolicyResetButton`, `slurAmalgamationPolicyChangeButton`, `slursAlwaysButton`, `slursPreventIfStartOrEndInDownStemButton`, `slursPreventAnyButton`, `preventStemAmalgamationSwitch`, `preventStemAmalgamationResetButton`, `preventStemAmalgamationChangeButton`, `allowMidSharedStemUnisonsSwitch`, `allowMidSharedStemUnisonsResetButton`, `allowMidSharedStemUnisonsChangeButton`, `requireTrillIntervalCompatibilitySwitch`, `requireTrillIntervalCompatibilityResetButton`, `requireTrillIntervalCompatibilityChangeButton`

**Labels and tooltips:** Number of MIDI channels: · Number of MIDI ports: · Number of &audio outputs to show in Mixer: · Save Endpoint Configuration... · QAudioEngineWaitDialog · Warning · The audio engine is taking longer than expected to respond.  · Continue to &Wait · Reset Sounds · Edit Chord Diagram · Notes not in chord diagram: · Reset Chord Diagram · Import Diagram... · Export Diagram... · Export entire library · Copy Staff Spacing · From page: · To page start: · To page end: · Use flow heading: · Current Page Only · From This Page Onwards · Heading Top Margin: · Heading Bottom Margin: · Current Value · Page template to import: · Number of pages to insert: · Use page template: · Move Pages · Based on: · First · 1.41 · Note Spacing Change · Change · Scale space for cue notes by: · Scale space for grace notes by: · Custom spacing ratio: · Page Number Change · First page number · Sequence type · Visibility · Subordinate number type: · Subordinate number · Up-Stem Voice · Down-Stem Voice

### `dialogs/fontstyles` (EditFontStylesDialog)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_font_styles_dialog_r.html


**Labels and tooltips:** MIDIFileExportFilter

### `dialogs/generatenotesfromchordsymbols`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_arranging_tools/write_mode_generate_notes_from_chord_symbols_dialog_r.html

_Not located in the main binary._

### `dialogs/instrumenteditor`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_instruments_edit_instruments_dialog_r.html


**Controls:** `kitNameLineEdit`, `kitShortNameLineEdit`, `isDrumKitCheckBox`, `kitEditorButton`, `gridEditorButton`, `individualInstrumentsEditorButton`, `moveInstrumentUpButton`, `moveInstrumentDownButton`, `stemUpVoiceButton`, `stemDownVoiceButton`, `voiceIndexSpinBox`, `addSlashesWithStemButton`, `addSlashesWithoutStemButton`, `gridGapSpinBox`, `gridGroupCreateButton`, `gridGroupRenameButton`, `gridGroupDeleteButton`, `editComponentInstrumentNamesButton`, `editNoteheadsButton`, `gridCentreLineShiftSpinBox`, `addInstrumentToKitButton`, `addExistingInstrumentFromPlayerButton`, `removeInstrumentFromKitButton`

**Labels and tooltips:** Edit Instruments · Filter by family: · Search instruments... · Show only project instruments · New Instrument from Selection · New Variant from Selection · Name in instrument picker: · Edit Percussion Playing Techniques · Edit Strings and Tuning... · Edit Percussion Kit... · Discard Current Changes to Instrument · Variant name: · Reset variant description · Families: · Singular full name: · Plural short name: · Singular short name: · Plural full name: · Name language gender: · Name language: · Edit Instrument Names... · Staves and Clefs · Staves · Number of staves: · Rhythm section instrument · Number of staff lines: · Bracket · Default stem direction if contextual: · Vocal staff · Span of bracket: · Span of barline: · Clefs for non-transposing layouts: · Staff 2 · Clefs for transposing layouts: · Staff 1 · Staff 4 · Staff 3 · Written middle C (note 60) sounds as: · Uses key signatures · In a transposing score, written middle C (note 60) sounds as: · Range · Standard range · Advanced range · Doricolib

### `dialogs/instrumentfamilies`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_instruments_edit_instrument_families_dialog_r.html

_Not located in the main binary._

### `dialogs/instrumentscoreorders`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_instruments_edit_instrument_score_orders_dialog_r.html

_Not located in the main binary._

### `dialogs/invert`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_transformations/write_mode_reverse_invert_dialog_r.html

_Not located in the main binary._

### `dialogs/librarymanager`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_manager_r.html

_Not located in the main binary._

### `dialogs/lineannotations` (EditLineAnnotationDialog)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_lines_edit_line_annotations_dialog_r.html


### `dialogs/linebodies` (EditLineBodyStylesDialog)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_lines_edit_line_bodies_dialog_r.html


### `dialogs/lineeditor` (EditLineStylesDialog)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_lines_edit_lines_dialog_r.html


### `dialogs/mappitches`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_transformations/write_mode_map_pitches_dialog_r.html

_Not located in the main binary._

### `dialogs/mapscale`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_transformations/write_mode_map_scale_dialog_r.html

_Not located in the main binary._

### `dialogs/midiimportoptions`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/project_file_handling/project_file_handling_midi_import_options_dialog_r.html


**Labels and tooltips:** MIDI Import Options · Importing MIDI File: · Use track memory · Interpret as &General MIDI · Destination: · Re-use existing players · Tracks from the MIDI file · Basic editor · Advanced editor · Filter... · Show all · Show only enabled · Select &All · Show More Columns · Track settings · Instruments in track: · Add Instrument · Duplicate Instrument · Change Instrument · Delete Instrument · Player type: · Transpose: · Section · Playing tech.: · Start: · End: · Percussion map: · Tremolo · Half-tone trill · Whole-tone trill · Voice separation mode: · Players in Dorico project · Use MIDI track names · Add New Player For Track · Import Options · Instruments · Use GM program changes to identify instruments · Interpret channel 10 as General MIDI percussion · Overwrite all track contents when importing into existing flow/player · Interpretation · Split point for grand staff instruments: · Filter out key switches outside range: · Auto · Fixed · Split at MIDI note number: · Notations · Detect key signature if missing · Detect s&lurs · Create playing techniques · Create player group for new players · Create part layouts for new players · MIDIQuantizeOptionsPanel · Quantize Options · MIDIQuantizeOptionsDialog · MIDI Quantize Options

### `dialogs/missingfonts` (MissingFontDialog)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/project_file_handling/project_file_handling_missing_fonts_dialog_r.html

> One or more fonts used by items in this project are not installed on your computer.
>
> You can specify a replacement font using one of the fonts installed on your computer, and this project will use the replacement font from now on. If you do not specify a replacement, references to missing fonts will be retained in the project, but the items that rely on missing fonts will draw with an automatically substituted font.
>
> Dorico did not close correctly last time, and the following auto-saved projects can be recovered. Any listed auto-saves that you do not recover now will be deleted.
>
> <p style="-qt-paragraph-type:empty; margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px; font-family:'.SF NS Text';"><br /></p></body></html>
>

**Controls:** `autoSavesTableView`, `discardButton`, `recoverButton`, `nameLineEdit`, `categoryComboBox`, `titleLineEdit`, `subtitleLineEdit`, `dedicationLineEdit`, `composerLineEdit`, `arrangerLineEdit`, `lyricistLineEdit`, `artistLineEdit`, `copyistLineEdit`, `publisherLineEdit`, `editorLineEdit`, `workNumberLineEdit`, `composerDatesLineEdit`, `compositionYearLineEdit`, `generatePreviewsCheckBox`, `sourceInfoCombo`, `copyButton`

**Labels and tooltips:** Bold · Bold Italic · Missing Fonts · Recover Auto-saved Projects · Discard All · Recover Selected Projects · An existing template with this name already exists. · Save As Project Template · Preserve Project Info · Name: · Preserve existing flows

### `dialogs/musicfonts` (FontChangeDialog)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_music_fonts_c.html


**Controls:** `parentFontStyleSelector`, `fontFamilySelector`, `fontOverriddenToggle`, `underlinedOverriddenToggle`, `sizeOverriddenToggle`, `styleOverriddenToggle`, `sizeSpinBox`, `styleSelector`, `substituteFamilyNamesOverriddenToggle`

**Labels and tooltips:** Music Fonts · SMuFL fonts: · Update text fonts when changing music font · Use font's recommended engraving options · Substitutes:

### `dialogs/musicsymbols` (EditMusicSymbolsDialog)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_music_symbols_edit_music_symbol_dialog_r.html


### `dialogs/noteheadsets`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_notehead_sets_edit_notehead_sets_dialog_r.html


**Controls:** `playingTechniqueGroupPushButton`

**Labels and tooltips:** Edit Notehead Sets · Notehead Set · Default notehead: · Add Notehead to Set · Remove Notehead from Set · Notehead Chooser · Notehead · Duration: · Use for durations shorter than and equal · Use for durations longer than and equal · Degree: · Pitch: · Stem direction · Double Whole Note · New Notehead · Edit Notehead...

### `dialogs/pagesizes` (EditPageDimensionPresetsDialog)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_page_sizes_edit_dialog_r.html


**Labels and tooltips:** MIDIFileImportFilter · Dorico Annual · Dorico Monthly · Dorico Lifetime · Applications/scu.app/Contents/MacOS/scu · Error read pipe · Activation Manager · Crashes · Shift · Umschalttaste · Strg · No such node · Updated helpconnections.json saved to Desktop. · Meta · Indian Drum Basics.vstsound · Detected instrument:  · Detected effect:  · Detected content:  · Missing content: 

### `dialogs/paragraphstyles`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_paragraph_styles_dialog_r.html


**Controls:** `tonalitySystemNameLineEdit`, `accidentalsSearchLineEdit`, `duplicateAccidentalButton`, `editAccidentalButton`, `keySignaturesListView`, `addKeySignatureButton`

**Labels and tooltips:** Parent: · Letter spacing: · Relative size: · Character alignment: · Underline · Overline · Strikethrough · Stretch: · Text decorations: · Word spacing: · Case: · Baseline shift: · Size in parts: · Top padding: · Bottom padding: · Left padding: · Right padding: · Placement: · Gap after paragraph: · Align with systemic barline if at start of system · Alignment: · Indentation: · First line indent: · Justify · Inside Edge · Outside Edge · Leading: · Distance from staff: · Horizontal offset: · Background color: · Foreground color: · OpenType features: · Add Feature · Delete Feature

### `dialogs/percussionkiteditor`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/setup_mode/setup_mode_edit_percussion_kit_dialog_r.html


**Controls:** `sourceLayoutListView`, `destinationLayoutsListView`, `selectNoneLayoutsButton`, `renameFlowLineEdit`, `shortNameLineEdit`, `editNameLineEdit`, `presetTuningsPopupMenuButton`, `editNamePushButton`, `startingFretSpinBox`, `tuneDownSemitonePushButton`, `openPitchSpinBox`, `tuneUpSemitonePushButton`, `irregularFretsLineEdit`, `irregularFretsCheckBox`, `noOfFretsSpinBox`, `addStringPushButton`, `addStringAtTopPushButton`, `selectAllStringsPushButton`, `moveStringUpPushButton`, `moveStringDownPushButton`, `resetToDefaultPushButton`, `removeStringPushButton`, `capoButton`, `transpositionIntervalForNotationSpinBox`

**Labels and tooltips:** Edit Percussion Kit · Short name: · Drum set · Move: · Stem direction and voice: · Slashes: · Gap: · Group: · Edit Names... · Edit Percussion Playing Techniques... · Edit Noteheads... · Center clef and time signature around staff position: · Add New Instrument · Add Existing Instrument from Player · Remove Instrument from Kit · Export Kit... · Propagate Part Formatting · Copy formatting from: · Propagate formatting to: · Select &None · Include layout options · Include system formatting · Include flow heading overrides · Flow name: · Rename Player · Rename Player Group · Save Custom Ensemble · String Tuning

### `dialogs/percussionmaps`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_percussion_maps_dialog_r.html


**Labels and tooltips:** Percussion Maps · Show only percussion maps used in this project · Add Percussion Map · Duplicate Percussion Map · Delete Percussion Map · Percussion Map Data · Name · Map defines sounds for: · Multiple Instruments · Single Instruments · Drum Kit Note Map · Show MIDI Notes in Use · Add Key Switch Alternative

### `dialogs/playbacktechniques`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_playback_techniques_edit_playback_techniques_dialog_r.html


**Labels and tooltips:** Edit Playback Techniques · Group · Alias for: · Fallback: · Articulation type: · Attribute

### `dialogs/projectinfo`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/project_file_handling/project_file_handling_project_info_dialog_r.html

> The following players have no music in any of the flows in the project and can be deleted, along with any associated part layouts.
>

**Controls:** `flowListView`, `timecodeCheckBox`, `tempoCheckBox`, `timeSigCheckBox`, `markerCheckBox`, `markersButton`, `systemTextButton`, `showBorderOnTextMarkersCheckBox`, `transpositionIntervalSpinBox`, `overridesTableView`, `removeOverrideButton`, `staff3ConcertClefSelector`, `staff2ConcertClefSelector`, `concertPitchSpinBox`, `staff2TransposedClefSelector`, `staff3TransposedClefSelector`, `staff1TransposedClefSelector`, `staff1ConcertClefSelector`, `playersTableView`, `editSingularNameButton`, `editPluralNameButton`, `alwaysPushButton`, `asPerOptionsPushButton`

**Labels and tooltips:** Project Info · New Flow · Duplicate Flow · Rename Flow · Move Down · Move Up · Copy info from · Arranger · Composer dates · Publisher · Artist · Lyricist · Editor · Dedication · Subtitle · Generate preview thumbnails when saving · Title · Copyist · Composer · Work number · Composition year · Copyright · Other information · Resolve Markdown formatting for text tokens · Export... · Import Tempo Track · Import into flow: · Import and replace: · Timecode display &offset · Time &signatures · System-attached Text · Show border around system-attached text markers · Capo Chord Symbol Definition · In capo chord symbols, written middle C (note 60) sounds as: · Capo Definition · Clef and Transposition Overrides · Transposed pitch · Clef for third staff: · Clef for second staff: · Concert pitch · Clef for first staff: · Written middle C sounds as: · Delete Empty Players · Delete Selected Players

### `dialogs/repeatablesymbols` (EditRepeatedCompositesDialog)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/library/library_lines_edit_repeatable_symbols_dialog_r.html


### `dialogs/rhythmicfeel` (EditRhythmicFeelDialog)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/play_mode/play_mode_swing_playback_rhythmic_feel_dialog_r.html


### `dialogs/stringsandtuningeditor`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/setup_mode/setup_mode_edit_strings_and_tuning_dialog_r.html


**Controls:** `useVideoFrameRateButton`, `chordIsMoveableCheckBox`, `allChordNotesPushButton`, `someChordNotesPushButton`, `matchCheckBox`, `startingFretOffsetSpinBox`, `addFretButton`, `removeFretButton`, `discardCurrentChangesPushButton`, `categoryPushButton`, `entityFilterLineEdit`, `collectionEditFilterPushButton`, `newButton`, `newFromButton`, `importLibraryButton`

**Labels and tooltips:** Edit Strings and Tuning · Instrument: · Compatible preset tunings: · Preset tunings · Edit name · Tune Down Half-Step · Tune Up Half-Step · Starting fret: · Open pitch: · Irregular fret spacing · No. of frets: · Add String · Select all · Move string: · Move String Up · Move String Down · Delete String · Capo and Transposition · Capo... · In staff notation, written middle C (MIDI note 60) sounds as: · Import Tuning... · Export Tuning... · Video Properties · Project frame rate: · Video start offset: · Video frame rate: · Timecode start: · Use video frame rate · Beat count: · Video file: · Flow attachment position: · Edit Chord Diagrams · Chord may be moved along the neck · Match: · Tuning: · Must contain all the required notes to represent the chord · All chord notes · All notes represented by the chord diagram must exist in the chord · Some chord notes · Chord may not be movable along the neck · Include this chord diagram shape when matching to chord symbols · Starting fret number offset: · Add fret · Remove fret · Discard Current Changes · Only show enabled chord diagrams · New from Selection · Import Library... · Export Library...

### `dialogs/transpose`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_transposing_tools/write_mode_transpose_dialog_r.html

> **New sound content or virtual instruments are available for use.** Would you like to change the default playback template to make use of the new sounds?
>
> You can change the default playback template at any time on the **Play** page of Preferences, or change the playback template used for any project by choosing **Play** > **Playback Template**.
>

**Controls:** `sectionsTableView`, `addSoloistButton`, `addSectionButton`, `deleteSelectionButton`, `editFullNameButton`, `editShortNameButton`, `followOptionsGroupVisibilityButton`, `showGroupVisibilityButton`, `hideGroupVisibilityButton`, `followOptionsNumberVisibilityButton`, `showNumberVisibilityButton`, `hideNumberVisibilityButton`, `playbackTemplatesListView`, `grooveAgentCheckBox`, `cancelButton`, `setTemplateButton`, `exportFlowsAsSeparateFilesCheckBox`, `flowsSelectAllButton`, `flowsSelectNoneButton`, `exportPartsAsSeparateFilesCheckBox`, `layoutsSelectAllButton`, `layoutsSelectNoneButton`, `exportPlayersAsSeparateFilesCheckBox`, `chooseFolderPathPushButton`, `createFolderCheckBox`, `highQualityCheckBox`, `broadcastWavCheckBox`, `reverbTailSpinBox`, `headerSection`, `useTrackMemoryCheckBox`, `gmCheckBox`, `flowsComboBox`, `useExistingPlayersCheckBox`, `trackAssignmentSection`, `midiTrackListSection`, `basicEditorButton`, `advancedEditorButton`, `instrumentFilterLineEdit`, `showAllButton`, `showEnabledButton`, `mappingsTableView`, `importSelectedButton`, `dontImportSelectedButton`, `invertSelectionButton`, `selectAllButton`, `showMoreColumnsButton`, `instrumentTypeListView`, `addInstrumentTypeButton`, `copyInstrumentTypeButton`, `editInstrumentTypeButton`, `removeInstrumentTypeButton`, `playingTechniquesPresetComboBox`, `soloPlayerButton`, `sectionButton`, `transposeSpinBox`, `startPlayingTechniquePopUpMenuButton`, `endPlayingTechniquePopUpMenuButton`, `percussionMapComboBox`, `staccatoArticulationCheckBox`, `staccatissimoArticulationCheckBox`, `marcatoArticulationCheckBox`, `accentArticulationCheckBox`, `tenutoArticulationCheckBox`, `tremoloArticulationCheckBox`, `trillHalfArticulationCheckBox`, `trillWholeArticulationCheckBox`, `voiceSeparationModeComboBox`, `doricoPlayersListSection`, `trackNamesCheckBox`, `logicalDestListView`, `newDestinationButton`, `importOptionsSection`, `gmProgramChangeCheckBox`, `drumsCh10CheckBox`, `overwriteAllExistingContentCheckBox`, `filterOutPitchesCheckBox`, `autoSplitPointButton`

**Labels and tooltips:** Transpose · Transpose by: · Direction: · No. of divisions · Quality · Number of Divisions · Interval · Number of octaves: · Quality: · Number of divisions: · Calculate interval · Transpose key signatures · Create new key signature at start · Keep relative respelled chord symbols in all layouts where possible · Keep accidental visibility properties · Keep chord symbol appearance overrides · Prevent duplicated unisons · Only add above or below outermost notes · Respell to avoid double and triple sharps and flats · Apply atonal spelling options: · In atonal passages · Change Divisi · Add Solo Division · Add Section Division · Delete Division or Group · Staff labels · Full Name · Short Name · Follow Options · Show player or group name: · Show section numbers: · Iconica Sketch · HALion Symphonic Orchestra · HALion Sonic Selection · New Sound Content Installed · Set default playback template to best available that includes: · Use Groove Agent SE for drum set instruments · Cancel · Set Default Playback Template · Export compressed XML (.mxl) · Export uncompressed XML (.musicxml) · Export each selected flow as a separate file · Select flows to export: · Export layouts as separate files · Select layouts to export: · Export players as separate files · Select players to export: · Export to: · Create folder for exported files · Audio Export Options · MP3 (.mp3) · FLAC (.flac) · WAV (.wav) · High-quality (slower) · Bit depth: · 16-bit · 24-bit · 32-bit int. · 32-bit float · 64-bit float · Broadcast WAVE · Reverb tail (s): · Format: · Flow Import Options · Player handling: · Create All New Players · Merge with Existing Players Where Possible · Import flows: · MIDIImportOptionsDialog · Ctrl+E

## Layout Options dialog: pages

### `layoutoptions/barnumbers`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_bar_numbers/notation_reference_bar_numbers_paragraph_styles_r.html

> When bar numbers are positioned at barlines, you may prefer dynamics to be placed closer to the staff than bar numbers, or vice versa. This has no effect for bar numbers centered on the bar, which are always placed outside dynamics.
>
> Whether or not repeats are counted in bar numbering is determined by the 'Bar numbering for repeated sections' option on the Bar Numbers page of Engraving Options.
>
> Show ranges of bar numbers under multi-bar rests and consolidated bar repeats
>
> Show normal bar number if coincident with start of multi-bar rest showing range
>

**Controls:** `noEnclosureButton`, `rectangularEnclosureButton`, `circularEnclosureButton`, `noBracketsButton`, `smallEnsembleButton`, `orchestralButton`, `windBandButton`, `bigBandButton`, `britishBrassBandButton`, `barlineJoinsFollowPrimaryButton`, `barlineJoinsSeparateButton`, `useSecondaryBracketsButton`, `noSecondaryBracketsButton`, `useBraceButton`, `useSubBracketButton`, `useBracketButton`, `noBracketButton`, `drawBraceButton`, `doNotDrawBraceButton`, `drawSubBracketOnSingleStaffButton`, `doNotDrawSubBracketOnSingleStaffButton`, `drawSubBracketMatchPrimaryGroupButton`, `doNotDrawSubBracketMatchPrimaryGroupButton`, `singleSubBracketViolinsButton`, `separateSubBracketViolinsButton`, `separateMultipleStavesSubBracketViolinsButton`, `chordSymbolsAboveSystemFollowPlayerButton`, `chordSymbolsAboveSystemAboveTopStaffButton`, `chordSymbolPositionOnGrandStavesBetweenStavesButton`, `chordSymbolPositionOnGrandStavesAboveTopStaffButton`, `spaceAboveDiagramsSpinBox`, `spaceBelowDiagramsSpinBox`

**Labels and tooltips:** BarNumberEnclosureType::kNone · BarNumberEnclosureType::kRectangle · BarNumberEnclosureType::kCircle · RepeatedBarNumberRepresentation::kShowAllRepetitions · RepeatedBarNumberRepresentation::kShowFirstRepetitionOnly · RepeatedBarNumberRepresentation::kShowFinalRepetitionOnly · Frequency · Show bar numbers: · Every n bars · Every bar · Interval: · Position bar numbers at start of system after clef and key signature · Left-aligned on barline · Centered on barline · Alignment after start of system: · Centered on bar · Alignment at start of system: · Show above top staff of system · Inside dynamics · Outside dynamics · Placement relative to dynamics: · Show above specific players: · Placement relative to system: · Show below bottom staff of system · Align bar numbers across width of system · Paragraph style: · Enclosure type: · Count repeats: · All repeats · First repeat only · Last repeat only · Showing and Hiding · Show bar number at start of system for bar split over break · Show first bar number when shown every bar · Show bar numbers at rehearsal marks · Show rehearsal marks below bottom staff · Show bar numbers at time signatures shown above the staff · Show bar numbers at start of codas · BracketPlacingApproach::kNoBrackets · BracketPlacingApproach::kSmallEnsemble · BracketPlacingApproach::kOrchestral · BracketPlacingApproach::kWindBandLike · BracketPlacingApproach::kBigBand · BracketPlacingApproach::kBritishBrassBand · SubBracketingApproachForViolins::kJoinWithSingleSubBracket · SubBracketingApproachForViolins::kSeparateSubBrackets · SubBracketingApproachForViolins::kSeparateWhenMultipleStaves · Bracketing · Ensemble type: · No brackets · Small ensemble · Orchestral · Wind band · Big band · British brass band · Barline joins: · Follow primary brackets · Separate at each instrument · Instruments of the same kind within a bracketed group: · Use secondary brackets · No secondary brackets · Secondary bracket appearance: · Brace · Sub-bracket · Bracketed groups with only one instrument: · Use bracket · No bracket · When only one staff of braced group is shown: · Draw brace · Do not draw brace

### `layoutoptions/chordsymbols/chorddiagramsusedframe`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_chord_diagrams/notation_reference_chord_diagrams_grids_c.html

> Chord symbols appear either above the staves belonging to specific players, or above the top staff of each system. If 'Above specific players' staves' is chosen, you determine which staves chord symbols appear above in the Players panel in Setup mode.
>

**Labels and tooltips:** Chord Symbols · Show chord symbols: · Above specific players' staves · Above top staff of system · Position of chord symbols on grand staff instruments: · Between staves · Above top staff · Chord Diagrams · Show fingerings in chord diagrams · Distance between chord diagrams: · Capo chord symbols: · Tuning for chord diagrams at start of flow: · Distance between rows: · Scale factor for chord diagrams: · Use capo with transposition: · Maximum number of chord diagrams per row: · Gap below bottom row of chord diagrams: · Inside dot · At end of string · Show chord diagrams used at start of flow · Fingerings position: · Gap above top row of chord diagrams: · Show fingerings in chord diagrams at start of flow

### `layoutoptions/markers` (MarkerLayoutOptions)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_markers/notation_reference_markers_c.html


**Controls:** `showMarkersCheckBox`, `aboveSystemButton`, `belowSystemButton`, `timecodeStaffButton`, `aboveOrBelowSystemButton`, `belowTimecodeStaffButton`, `startOfSystemButton`, `neverButton`, `timecodeAboveSystemButton`, `timecodeBelowSystemButton`, `timecodeXOffsetSpinBox`, `timecodeYOffsetSpinBox`, `showTimecodeAtStartOfFirstSystemCheckBox`

**Labels and tooltips:** MarkerVerticalPosition::kAboveTopStaff · MarkerVerticalPosition::kBelowBottomStaff · MarkerVerticalPosition::kOnTimecodeStaff · TimecodeFrequency::kEverySystem · TimecodeFrequency::kEveryBar · TimecodeFrequency::kNone · Show markers · Vertical position: · Above system · Below system · Timecode staff · Position timecode staff above bracket: · Show timecode: · Above or below start of system · Below timecode staff · Timecode frequency: · Start of system · Timecode position relative to system: · Offset at start of system: · Show timecode at start of first system

### `layoutoptions/notespacing` (NoteSpacingOptionsWidget)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_note_spacing_page_layout_options_r.html


### `layoutoptions/notespacing/justifyfinalsystem`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/page_formatting/page_formatting_final_system_justification_changing_t.html

> Dorico's default spacing ratio uses the square root of 2, roughly 1:1.41.
>
> When justifying music, it is usual to consider the width of everything that takes up solid space (for example accidentals, rhythm dots, lyrics) as well as the rhythmic duration of each spacing column. However, solid space is treated differently from rhythmic spacing when justifying systems that are over-full. This means that if you are making extensive manual adjustments to music that is sometimes over-full and sometimes not, you may get more consistent results if you force Dorico to consider only the ideal widths associated with rhythmic spacing.
>

**Controls:** `useActualWidthsButton`, `useIdealWidthsOnlyButton`

**Labels and tooltips:** Note Spacing · Default space for crotchet/quarter note: · Minimum space for short notes: · Only justify final system in flow when more than · Scale space for cue notes by · Scale space for grace notes by · Custom spacing ratio:  · Optical spacing for beams between staves · Make space for lyrics · When justifying music: · Use actual widths · Use ideal widths only

### `layoutoptions/pagesetup/flowheadings`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_flow_headings_c.html


### `layoutoptions/pagesetup/musicframemargins`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/page_formatting/page_formatting_margins_c.html


**Controls:** `musicFrameMarginsTopSpinBox`, `musicFrameMarginsBottomSpinBox`

**Labels and tooltips:** FirstPageBehaviour::kNeverUseFirstPage · FirstPageBehaviour::kUseFirstPageForFirstFlowOnly · FirstPageBehaviour::kUseFirstPageForFlowsStartingAtTheTopOfAPage · MusicFrameManuscriptFillType::kNone · MusicFrameManuscriptFillType::kAfterEveryFlow · MusicFrameManuscriptFillType::kFinalFrame · FlowHeadingBehaviour::kNoFlowHeadings · FlowHeadingBehaviour::kAddHeadingsAfterFirstFlow · FlowHeadingBehaviour::kAlwaysInsertHeadings · FlowBreakBehaviour::kStartNewPageForFlows · FlowBreakBehaviour::kNoFlowBreaks

### `layoutoptions/pagesetup/pagemargins`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/page_formatting/page_formatting_margins_c.html


**Labels and tooltips:** PageMarginType::kIdentical · PageMarginType::kIndependent · PageMarginType::kMirrored

### `layoutoptions/pagesetup/pagenumbers`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_page_numbers/notation_reference_page_numbers_c.html


### `layoutoptions/pagesetup/pagesize` (PageSetupOptionsWidget)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/print_mode/print_mode_page_paper_sizes_c.html


### `layoutoptions/pagesetup/pagetemplate`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_page_template_sets_c.html


### `layoutoptions/pagesetup/spacesize`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/page_formatting/page_formatting_staff_size_c.html


### `layoutoptions/pagesetup/tokens`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/engrave_mode/engrave_mode_text_tokens_r.html

> In publishing it is customary to hide running headers and page numbers when a new section begins at the top of a page. These options allow you to determine whether running headers should appear when a new flow begins at the start of a page.
>
> The top margin for a flow heading will only take effect if the height of the flow margin is less than the default inter-system gap, or if the frame is very full vertically.
>
> The 'First' page template will be used only if it exists in the chosen page template set and has a single music frame in the same chain as the music frame on the 'Default' page template pair.
>

**Controls:** `transposingScoreOptionsSection`

**Labels and tooltips:** Page Size · Height: · Width: · Size: · Portrait · Landscape · Space Size · Rastral size: · Space size: · Page Template · Page template set: · Page Margins · Page margins: · Same · Different · Mirrored · Top: · Bottom: · Left: · Right: · Music Frame Margins · Flow heading top margin: · Show above flow heading · Hide above flow heading · Use 'First' page template: · Page number in header: · Flow title in header: · New flows: · First flow only · Any flow starting at top of page · After every flow · Only after last flow · Not for first flow · For all flows · Flow heading bottom margin: · Include clefs · Exclude clefs · Flow page number in header: · Always start new page · Allow on existing page · Show blank staves in systems identical to preceding flow · Number of staff lines for blank staves: · Fill frames with blank staves: · Show flow headings: · Page Numbers · Initial page number: · Visibility: · Text Tokens · Custom text for concert layout: · Custom text for transposed layout:

### `layoutoptions/players/condensing`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/page_formatting/page_formatting_condensing_c.html

> Show instrument change label after cue, if cue precedes first note in new instrument
>
> If players are assigned to a flow, but have no music, then multi-bar rests for the whole flow will appear. If players are not assigned to the flow, then 'Tacet' will appear, provided this option is enabled.
>
> Dorico can only show cautionary and restorative clefs, key signatures, and time signatures at repeats if the option to track clefs and key signatures in repeat structures on the Repeats page of Notation Options is enabled.
>

**Controls:** `enableCondensingCheckBox`, `doNotCondenseButton`, `excludeViolinsWhenCondensingAdjacentSectionPlayersCheckBox`, `allowInstrumentChangesOnCondensedStavesCheckBox`

**Labels and tooltips:** SectionPlayerCondensingPolicy::kDoNotCondense · SectionPlayerCondensingPolicy::kCondenseWithinSinglePlayer · SectionPlayerCondensingPolicy::kCondenseSectionsAndAdjacentPlayers · Players · Transposing layout · Uses custom player order · Move up · Move down · Allow instrument changes · Hide instrument change warning · Hide instrument change label · Full Names · Short Names · Show instrument change warnings · When instrument transitions are close: · Instrument names to use in change labels: · After last note in old instrument · Before first note in new instrument · Take · Instrument transition position: · Prefix for instrument change warnings: · Show only the change of transposition when instruments match · Show instrument change label at start of flow · Instrument change warnings position: · Snap to notes · Snap to nearest barlines · Instrument change labels position: · Bar Rests and Multi-bar Rests · Show bar rests in empty bars · Consolidate: · Multi-bar Rests and Bar Repeats · Show bar count in numbered bar regions · Tacets · Show tacet for flows where no players are assigned · Tacet text: · Margin above tacet: · Margin below tacet: · Show percussion legends on grids · Show percussion legends on five-line staves · Cues · Show cues · Fingering · Show fingering · Harp Pedaling · Show harp pedaling · Appearance for full pedal changes: · Diagram · Figured Bass · Players to show figured bass: · Default placement: · Enable condensing · Section players: · Exclude from condensing · Condense divisi · Condense divisi and adjacent players · Exclude adjacent violin section players from condensing · Allow instrument changes on condensed staves · Groups to exclude from condensing: · Custom condensing groups: · New Group · Delete Group · Cautionary items at repeat jumps: · Show in parentheses · Restorative items after end repeat barlines: · Cautionary items at end repeat barlines: · Notation Options... · Restorative items after repeat jumps:

### `layoutoptions/players/cues`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_cues/notation_reference_cues_c.html


**Controls:** `showCuesCheckBox`, `fingeringOptionsSection`

### `layoutoptions/players/figuredbass`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_figured_bass/notation_reference_figured_bass_c.html


**Controls:** `figuredBassAbovePlacementButton`, `figuredBassBelowPlacementButton`

### `layoutoptions/players/fingering`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_fingering/notation_reference_fingering_c.html


**Controls:** `showFingeringCheckBox`, `harpPedalingOptionsSection`

### `layoutoptions/players/harppedaling`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_harp_pedaling/notation_reference_harp_pedaling_c.html


**Controls:** `showHarpPedalingCheckBox`, `diagramButton`, `noteNamesButton`, `figuredBassOptionsSection`

**Labels and tooltips:** HarpPedalSettingsAppearance::kDiagram · HarpPedalSettingsAppearance::kNoteNames

### `layoutoptions/players/instrumentchanges`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/setup_mode/setup_mode_instrument_changes_c.html


**Controls:** `hideWarningButton`, `hideLabelButton`, `useFullNamesButton`, `useShortNamesButton`, `toButton`, `takeButton`, `customButton`, `notePositionsButton`, `snapToBarlinesButton`, `changeLabelsNotePositionsButton`, `changeLabelsSnapToBarlinesButton`, `barRestsOptionsSection`, `noneButton`, `multibarRestsButton`, `multibarRestsAndBarRepeatsButton`

**Labels and tooltips:** InstrumentChangeLabelHideType::kWarning · InstrumentChangeLabelHideType::kChangeTo · InstrumentChangeLabelType::kTo · InstrumentChangeLabelType::kTake · InstrumentChangeLabelType::kCustom · BarConsolidationBehaviour::kNeverConsolidate · BarConsolidationBehaviour::kConsolidateEmptyBarsIntoMultiRests · BarConsolidationBehaviour::kConsolidateCollapsibleBarRepeats

### `layoutoptions/players/numberedbarregions`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_numbered_bars/notation_reference_numbered_bars_c.html


**Controls:** `showBarCountInNumberedBarRegionsCheckBox`, `tacetOptionsSection`

### `layoutoptions/players/tacets`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/page_formatting/page_formatting_tacets_c.html


### `layoutoptions/stavesandsystems/castingoff`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/page_formatting/page_formatting_casting_off_c.html


### `layoutoptions/stavesandsystems/ossiasextrastaves`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_staves/notation_reference_staves_ossia_c.html


**Controls:** `showOssiasCheckBox`, `defaultOssiaLabelButton`, `customOssiaLabelButton`, `includeInPreambleButton`, `excludeFromPreambleButton`, `insideOssiaButton`, `outsideOssiaButton`, `systemDividerOptionsSection`, `minPlayersExceededButton`, `numStavesDiffersButton`, `minNumberPlayersInFlowSpinBox`, `defaultSystemDividersButton`, `longSystemDividersButton`, `extraLongSystemDividersButton`

**Labels and tooltips:** SystemDividerApproach::kExceedsMinimumNumberOfStavesInSystem · SystemDividerApproach::kExceedsMinimumNumberOfPlayers · SystemDividerApproach::kNumberOfStavesInSystemsDiffers · SystemDividerSize::kDefault · SystemDividerSize::kLong · SystemDividerSize::kExtraLong

### `layoutoptions/stavesandsystems/repeatmarkers`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_repeat_markers/notation_reference_repeat_markers_c.html

> By default, staff labels are placed inside the music frame to keep the left margin clear, but this can cause systems to align differently due to varying label widths. To ensure consistent system alignment, you can set 
>
>  and inset the left-hand edge of the music frame in your page templates to fit the widest label.
>
> Allow each staff of grand staff instruments to be cut away independently
>
> The first bar in a system is always allowed to split across a system break if it is too wide to fit within the frame. This option determines whether bars after the first bar in the system may be split across system breaks.
>

**Controls:** `aboveStaffButton`, `belowStaffButton`, `aboveAndBelowBottomStaffButton`, `showOnSingleLineButton`, `showOnTwoLinesButton`, `largeTimeSignatureOncePerBracketButton`, `autoLargeTimeSignaturesButton`, `manualLargeTimeSignaturesButton`, `userLargeTimeSignaturesListView`, `deleteUserDefinedLargeTimeSignatureButton`, `playersListView`, `addUserDefinedLargeTimeSignatureButton`

**Labels and tooltips:** RepeatMarkerStaveRelativePositioning::kAlwaysAbove · RepeatMarkerStaveRelativePositioning::kBelowStaveIfJumpMarkerOrFine · RepeatMarkerStaveRelativePositioning::kAdditionallyBelowBottomStave · Full · Show player group labels: · Show divisi change labels above staves · Divisi labels: · Staff labels on first system: · Staff labels on subsequent systems: · Show section names on subsequent systems · Show section names on first system · Snap divisi unison labels to notes · Show first sounding instrument on system · Instrument changes: · When staff labels shown · Show player name instead of instrument names: · Select None · Show player names: · On all systems · On first system only · Show on separate line · Show in abbreviated staff labels · Indents · Position staff labels: · Show in full staff labels · Inside music frame · Outside music frame · Width · Show staff labels: · Apply indent when staff labels are shown · Show instrument number before transposition · Indent first system of flow by · Separator between instrument pitch at start and name: · On all flows · On first flow only · Pitch and Transposition · Position of instrument pitch in staff labels: · Minimum indent for systems with staff labels: · Automatically cut staves away in empty bars · Minimum number of empty bars before cutting away: · Show system-attached items above cutaways · Show bar numbers above or below cutaways · Ossias and Extra Staves · Show ossias · Show label before ossia · Ossia label: · Custom ossia label: · Ossias crossing a system break: · Include in preamble · Exclude from preamble · Position of system-attached items relative to ossia above staff: · Inside ossia · Outside ossia · Extra Staves · Show extra staves across full system when starting or stopping · Show system dividers: · When min. staves exceeded · When min.  players exceeded · When number of staves differs · Minimum number of staves in system: · Minimum number of players: · Appearance: · Extra long · Casting Off · Fixed number of bars per system: · Fixed number of systems per frame: · Scale number of systems by frame height · Allow open bars to be split across system breaks · System-attached Items · Show system-attached items above:

### `layoutoptions/stavesandsystems/stafflabels` (StavesAndSystemOptions)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_staff_labels/notation_reference_staff_labels_c.html


**Controls:** `staffLabelShowsFirstSoundingInstrumentOnSystemCheckBox`, `alwaysButton`, `whenStaffLabelsShownButton`, `onAllSystemsButton`, `onFirstSystemOnlyButton`, `useFlowFirstSystemIndentWhenStaffLabelsShownCheckBox`, `fullLabelsBeforeButton`, `fullLabelsAfterButton`, `flowFirstSystemIndentSpinBox`, `numEmptyBarsBeforeCutawaySpinBox`, `cutawayGrandStaffInstrumentStavesIndividuallyCheckBox`, `showSystemObjectsAndBarNumbersOnCutawayStavesCheckBox`

**Labels and tooltips:** StaffLabelLength::kFull · StaffLabelLength::kAbbreviated · StaffLabelLength::kNone · PlayerGroupLabelVisibility::kAlways · PlayerGroupLabelVisibility::kWhenStaffLabelsVisible · PlayerGroupLabelVisibility::kNever · StaffLabelFullTranspositionAppearance::kBefore · StaffLabelFullTranspositionAppearance::kAfter

### `layoutoptions/stavesandsystems/systemobjects`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_staves/notation_reference_staves_system_objects_c.html


**Controls:** `aboveFamiliesButton`, `abovePlayersButton`

**Labels and tooltips:** SystemObjectVisibilityApproach::kAboveFamilies · SystemObjectVisibilityApproach::kAbovePlayers

### `layoutoptions/verticalspacing` (VerticalSpacingOptionsWidget)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/page_formatting/page_formatting_vertical_spacing_per_layout_options_r.html


**Controls:** `divisiStaffGapTypeButton`, `staffGapButton`, `bracedStaffGapButton`, `defaultStaffSizeButton`, `playerStaffSizeButton`, `disableVerticalGapFineTuningCheckBox`

**Labels and tooltips:** DivisiStaveGapType::kStave · DivisiStaveGapType::kBracedStave

### `layoutoptions/verticalspacing/verticaljustification`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/page_formatting/page_formatting_staves_systems_vertical_justification_changing_t.html

> These values determine the minimum gap Dorico will allow between pairs of staves. They are subject to vertical justification, which normally causes the gaps between staves to be increased, unless the frame is full vertically. Specify the smallest gap you would consider acceptable, and rely on vertical justification to produce a balanced layout.
>
> When using the staff to staff gap, divisi staves will be vertically justified; when using the braced staff to braced staff gap, divisi staves will not be vertically justified.
>
> The gap in spaces between the staves belonging to one player and the player immediately below can either be calculated relative to the custom staff size of the first player, if any, reverting to using the default staff size for the system, or it can always ignore the custom staff size.
>
> When the frame is less full than the threshold for justifying staves, no vertical justification occurs.
>

**Controls:** `afterFirstSystemButton`, `allSystemsButton`, `allowPartialHidingOfGrandStaveInstrumentsCheckBox`, `playRepeatsCheckBox`, `preRollBeforeFlowSecondsSpinBox`, `frameRateButton`, `noteDurationPercentSpinBox`, `graceNoteLengthSpinBox`, `unmeasuredTremoloLengthSpinBox`, `pitchofAInHzDoubleSpinBox`, `dynamicCurvePowerSpinBox`, `maxProfileLevelForPlaybackSpinBox`, `minProfileLevelForPlaybackSpinBox`, `ghostNoteDynamicDeltaSpinBox`, `rhythmicFeelEditButton`, `likelihoodOfMelodyBeingAtTopSlider`, `contrapuntalAlgorithmStrengthSlider`, `rhythmicFeelButton`, `clickSection`, `compoundTimeSigCheckBox`, `regularTimeSigCheckBox`, `clickSoundButton`, `beepSoundButton`

**Labels and tooltips:** HideEmptyStavesPolicy::kAfterFirstSystem · HideEmptyStavesPolicy::kAllSystems · HideEmptyStavesPolicy::kNever · Minimum Gaps · Ossia staff to staff: · Braced staff to unbraced staff: · Notation staff to tablature: · Staff to staff group: · Inter-system gap: · Timecode staff to staff: · Braced staff to braced staff: · Staff to staff: · Staff group to staff group: · Staff group to staff: · Gap to use for divisi staves: · Staff to staff · Braced staff to braced staff · Gap values are relative to: · Default staff size · Player-specific custom staff size · Galley View · In galley view, expand minimum staff gaps to: · Fill View · Inter-system gap in fill view: · Automatically resolve collisions between adjacent staves and systems · Minimum inter-staff gap with content: · Minimum inter-system gap with content: · Vertical Justification · Justify distance between staves and systems when frame is at least: · Justify staves when frame with single system is above this threshold · Justify distance only between systems when frame is at least: · Staff Visibility · Hide empty staves: · After first system · All systems · Allow individual staves of multi-staff instruments to be hidden · Players excluded from Hide Empty Staves: · Unknown · Edit Custom Condensing Group · DoricoBeepSound::kClickSound · DoricoBeepSound::kBeepSound · DoricoBeepSound::kWoodBlockSound · Metronome Click · Beat subdivisions · Subdivide beats in simple time signatures · Subdivide beats in compound time signatures · Click sound: · Click · Beep · Wood Block · Pitch and velocity · MIDI pitch · First beat: · Subsequent beats: · Beat subdivisions: · Velocity · Count-in

## Notation Options dialog: pages

### `notationoptions/beamgrouping` (BeamGroupingSimpleTimeSigsWithoutHalfBar)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_note_rest_grouping/notation_reference_note_rest_grouping_c.html

> Beaming eighth notes (quavers) together in quarter note (crotchet) denominator time signatures:
>
> Eighth note (quaver) beams when adjacent tuplet starts or ends with an eighth note:
>
> Rests within groups of eighth notes (quavers) in simple time signatures with a half-bar:
>
> Clefs with 8 above or below normally indicate that the instrument playing the music sounds an octave higher (for example, piccolo) or lower (for example, double bass, or tenor voice) than written. More recently, some composers have used these clefs as a substitute for octave lines. This option allows you to choose between the two approaches to octave-transposing clefs.
>

**Controls:** `noHalfBarAllowToCrossBeatsButton`, `noHalfBarBreakAtBoundariesButton`, `noHalfBarBeamTogetherEntireBarButton`, `noHalfBarBeamTogetherAnySizeButton`, `noHalfBarBreakBeamButton`, `noHalfBarJoinBeamButton`, `noHalfBar16thNoteAllowToCrossBeatsButton`, `noHalfBar16thNoteBreakBoundariesButton`, `noHalfBar32ndNoteAllowCrossButton`, `noHalfBar32ndNoteBreakBoundariesButton`, `halfBarBreakBeamsButton`, `halfBarBreakBeamsAtBeatBoundariesButton`, `restsWithinEighthGroupsBeamOverRestsButton`, `restsWithinEighthGroupsBreakBeamsAtRestsButton`, `groupsOfNotesInSimpleTimeSigsBeamTogetherOnlyFullHalfBarButton`, `groupsOfNotesInSimpleTimeSigsBeamTogetherNotFullButton`, `longGroupsBreakBeamsHalfBarButton`, `longGroupsBreakBeamsQuarterBarButton`, `secondaryBeamGroupsSplitSecondaryButton`, `secondaryBeamGroupsDoNotSplitSecondaryButton`, `secondaryBeamGroupsSingleLineButton`, `secondaryBeamGroupsMultipleLinesButton`, `useStemletsButton`, `allowRestsWithinBeamsButton`, `allowRestsWithinBeamsAndAtStartAndEndButton`, `breakBeamsAtRestsButton`, `breakAllSecondaryBeamsAtRestsButton`, `breakAllSecondaryBeamsButton`, `preserveSecondaryBeamsButton`, `dialogCheckBox`

**Labels and tooltips:** Simple Time Signatures Without a Half-bar · Allow to cross beats · Break beams at beat boundaries · Only when the group fills the entire bar · Beam together a group of any size · Break beam at tuplet · Join beam at tuplet · Quarter Note (Crotchet) Denominator Time Signatures With Half-bars · For example, 4/4 or 8/4 (assuming 4+4/4). · Eighth notes (quavers) in simple time signatures with a half-bar: · Break beams at the half-bar · Beam over rests · Break beams at rests · Groups of notes in simple time signatures with a half-bar: · Beam together only when the group fills the half-bar · Beam together even if the group does not fill the half-bar · Groups of notes in long time signatures with a half-bar: · Break beams at half-bar beat boundaries · Break beams at quarter-bar beat boundaries · Secondary Beam Groups · Approach for secondary beam groups: · Split secondary beams · Do not split secondary beams · Number of lines in primary beam within secondary beam groups: · Single line only · Number of lines equal to the duration of the secondary group · RestPrimaryBeamBehaviour::kUseStemlets · RestPrimaryBeamBehaviour::kAllowRestsInMiddleOfBeamWithoutStemlets · RestPrimaryBeamBehaviour::kAllowRestsAnywhereInBeamWithoutStemlets · RestPrimaryBeamBehaviour::kBreakBeamsAtRests · RestSecondaryBeamBehaviour::kAlwaysBreakSecondaryBeamsAtRests · Beams and Rests · Rests in beam groups: · Use stemlets · Allow rests within beams · Allow rests within beams and at start and end of beams · Rests and secondary beam groups: · Always break all secondary beams at rests · Break all secondary beams at rests when duration differs · Preserve secondary beams over rests where possible · Allow partial beams on stemless rest at start or end of beam · Clefs with octave indicators: · Ignore octave indicator · Respect octave indicator · Clefs at start of systems following first system:  · Show clefs

### `notationoptions/condensing` (CondensingNotationOptions)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/page_formatting/page_formatting_condensing_notation_options_r.html

> When single-stem unisons are allowed for a whole phrase, Dorico will write music for two or more players on the same stem, labeled appropriately. If you choose to prevent single-stem unisons, by contrast, each notehead on a condensed staff can represent music from a single player, and even a passage of rhythmic and melodic unison will be written with two stems.
>
> If a whole phrase cannot be written on a shared stem, Dorico will still allow individual unison notes within a phrase to be written with a single notehead on a shared stem labeled, for example, 'a 2'. When mid-phrase unisons are prevented, Dorico will instead write unison notes in two voices, showing stems in both directions.
>
> When the player or players assigned to the down-stem voice have notes that are higher in pitch than notes in the up-stem voice, this is considered to be a pitch cross. When the phrases in the up- and down-stem voices start at the same position, Dorico can choose to allow up to a limited number of pitch crosses, or it can allow an unlimited number. Pitch crosses are always allowed when phrases do not start at the same rhythmic position.
>
> By default, changes you make to the 'Accidental' property for notes are not propagated to condensed staves, because when music for multiple players is written on a single staff, the considerations for where accidentals should appear are different. However, if you want to propagate accidental visibility overrides to condensed staves, you can do so using this option.
>

**Controls:** `trillNoneButton`, `trillIntervalsButton`, `trillIntervalAndNotesButton`, `showButton`, `hideButton`

**Labels and tooltips:** TrillIntervalCompatibilityRequirement::kNone · TrillIntervalCompatibilityRequirement::kIdenticalIntervals · TrillIntervalCompatibilityRequirement::kIdenticalIntervalsAndUnison · SlurAmalgamationPolicy::kAlways · SlurAmalgamationPolicy::kPreventIfStartOrEndInDownStem · SlurAmalgamationPolicy::kPreventAnyAmalgamation · CondensingSilentPlayerPolicy::kInclude · CondensingSilentPlayerPolicy::kLabelOnly · CondensingSilentPlayerPolicy::kExclude · Condensing · Unisons · Whole-phrase unison approach: · Allow single-stem unison · Prevent single-stem unison · Mid-phrase unison approach: · Allow mid-phrase unisons · Prevent mid-phrase unisons · Pitch Crossing · Pitch crossing approach: · Allow unlimited pitch crossing · Limit pitch crossing · Maximum number of pitch crosses in region: · Accidentals · Accidental visibility overrides: · Propagate to condensed staves · Do not propagate to condensed staves · Trills · Trill intervals: · Do not require identical intervals · Require identical intervals · Require identical intervals and notes · Amalgamation · Amalgamation approach for notes and chords: · Allow amalgamation · Prevent amalgamation · Amalgamation approach for slurs: · Allow amalgamation of slurs · Prevent amalgamation for slurs in down-stem voice · Prevent amalgamation for all slurs · Amalgamation approach for playing techniques: · Amalgamation approach for horizontal lines: · Inactive Players · Condensing for players inactive for some of the system: · Hide rests and label active player · Show rests and omit labels · When hiding rests for inactive players: · Hide rests only at the start or end of bars · Hide rests at any position · Minimum length of range of rests to allow hiding: · Condensing for players inactive for the whole system: · Pair with active player · Include in staff label · Do not condense · String Allocation · Coincident pitches in other voices: · Consider when determining string · Ignore when determining string · ShowHide::kShow · ShowHide::kHide · Key Signatures · Key signatures at start of systems following first system:  · Show key signatures · Hide key signatures · Cautionary key signature at end of system: · Show · Hide · Repeats · Clefs and key signatures in repeat structures: · Do not track

### `notationoptions/notegrouping` (TimeSignaturesWithHalfBars)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_note_rest_grouping/notation_reference_note_rest_grouping_c.html

> Time signatures with half-bars typically have four beats, e.g. 4/8, 4/4, 4/2.
>
> Notes starting at the start of the bar or the half-bar of multiple beats in duration:
>
> Notes starting after the start of the bar of multiple beats in duration:
>
> Irregular meter means that the beats within a single bar are not the same length.
>

**Controls:** `splitAtHalfBarButton`, `notateAsSingleNoteButton`, `groupCutTimeLikeCommonTimeCheckBox`, `splitAtBeatBoundariesButton`, `notateUsingRhythmDotsButton`, `splitAtSubdivisionsButton`, `shotLongShortNotateSingleButton`, `shotLongShortSplitButton`, `shortLongShortRestSingleNoteButton`, `shortLongShortRestSplitButton`, `shortLongShortHalfBarCrossHalfBarButton`, `shortLongShortHalfBarSplitButton`, `shortDottedLongSingleNoteButton`, `shortDottedLongSplitButton`, `crossHalfBarPatternFullBarButton`, `crossHalfBarPatternAlwaysSingleNoteButton`, `compoundSlashFollowBeatGroupingButton`, `compoundSlashFollowTimeSigDenominatorButton`, `slashIrregularFollowBeatGroupingButton`, `slashIrregularFollowDenominatorButton`

**Labels and tooltips:** Time Signatures With Half-bars · Notes starting on a beat ending in the middle of the beat: · Split at the half-bar · Notate as a single note · Notes starting in the middle of the beat: · Split at the first beat boundary, and at the half-bar · Split only at the half-bar · Use common time note grouping for cut common time signatures · Simple Time Signatures With or Without a Half-bar · Notes starting on a beat followed by a rest in the middle of the beat: · Split at beat boundaries · Notes joined by ties in simple time signatures: · Rhythm Dots · Maximum number of rhythm dots allowed in simple beats: · Maximum number of rhythm dots allowed in compound beats: · Notes that subdivide compound beats, and fill the beat: · Notate using rhythm dots · Split at beat subdivisions · Time Signatures With Irregular Meter · Notes that completely fill a bar with irregular meter: · When splitting notes at beat subdivisions: · Split at all subdivisions · Split only at subdivisions of different length · Note grouping approach for 5/4: · Irregular compound (3+2) · Irregular simple (1+1+1+1+1) · Syncopation · Notation of short-long-short patterns: · Notate as single notes · Rests substituting one of the short notes in short-long-short patterns: · Notation of short-long-short patterns that cross the half-bar: · Notate as single note across the half-bar · Split at half-bar beat boundary · Notation of short-dotted long patterns: · Notation of patterns that cross the half-bar: · Notate as single note across the half-bar only when the bar is full · Always notate as single note across the half-bar · SlashRegionBeatGroupingBehaviour::kReflectBeatGroups · SlashRegionBeatGroupingBehaviour::kUseTimeSignatureDenominator · Rhythmic Slashes · Maximum duration for rhythmic slashes: · Rhythmic slash grouping in compound time signatures: · Follow beat grouping · Follow time signature denominator · Rhythmic slash grouping in irregular time signatures

### `notationoptions/percussion` (PercussionNotationOptions)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/setup_mode/setup_mode_percussion_kits_c.html

> When notes in one voice are closer to the middle line of the staff than the space above or below the staff, this option determines the closest staff positions that half (minim) or longer rests in the opposing voice can use. This applies only when two opposing voices are active: if three or more voices are active, this option always applies, regardless of the staff positions of the notes.
>
> When multiple voices are active, bar rests move outwards from their default positions. A bar rest in an up-stem voice can only hang from the top line of the staff, but a bar rest in a down-stem voice can hang from any of the three lower lines of the staff, and by default hangs from the bottom line of the staff.
>

**Controls:** `useTiesButton`, `truncateButton`, `useKitVoicingButton`, `useSingleVoiceButton`, `padWithRestsButton`, `doNotPadWithRestsButton`, `additionalVoicesShowBarRestsButton`, `additionalVoicesOmitBarRestsButton`, `cuesShowBarRestsButton`, `cuesOmitBarRestsButton`, `allowDottedRestsButton`, `disallowDottedRestsButton`, `valueButton`, `irregularCrossBeatDivisionsButton`, `irregularSplitBeatDivisionsButton`, `showEveryRestInEachVoiceButton`, `showOnlyOneRestButton`, `considerNotesAndRestsSamePositionButton`, `avoidNotesSoundingAfterStartButton`, `useDefaultPositionsButton`, `alwaysMoveAwayFromMiddleOfStaffButton`, `positionOnTopOrBottomStaffLineButton`, `hangFromMiddleStaffLineButton`, `hangFromSecondStaffLineFromBottomButton`, `hangFromBottomStaffLineButton`, `inSameBeatGroupButton`, `inSameBarButton`, `alignRestBottomsButton`, `centerRestsVerticallyButton`, `wholeRestButton`, `doubleWholeRestButton`, `stemToStemButton`, `headToHeadButton`, `preferStemlessToLeftButton`, `preferHigherNotesToLeftButton`, `ignoreDotsButton`, `dottedVoiceOnLeftButton`, `dottedVoiceOnRightButton`, `allowNoteheadsOverlapButton`, `doNotAllowNoteheadsOverlapButton`, `unisonDottedUndottedAllowNoteheadsOverlapButton`, `unisonDottedUndottedDoNotAllowNoteheadsOverlapButton`

**Labels and tooltips:** OverlappingNoteBehaviour::kTie · OverlappingNoteBehaviour::kTruncate · DrumKitVoicingType::kFollowKit · DrumKitVoicingType::kSingleVoice · Percussion · Overlapping notes in the same voice in a kit or grid presentation: · Use ties to show full duration · Truncate to shortest duration · Voicing for drum set kit presentation: · Use voicing defined in kit editor · Use single voice · Rests at start and end of voices in five-line staff presentation: · Pad voice with rests · Do not pad voice with rests · Bar rests in additional voices in five-line staff presentation: · Show bar rests · Omit bar rests · Rests in additional voices options · Rests in Additional Voices · Bar rests in additional voices: · Bar rests in cues: · Simple time signature options · Simple Time Signatures · Rests at the end of simple beats: · Allow dotted rests · Disallow dotted rests · Compound time signatures · Compound Time Signatures · Rests at the start of compound beats: · Notate as a single rest · Rests in the middle of compound beats: · Rests equal to the length of a compound beat: · Notation of half-bar rests when rhythm dots are otherwise disallowed: · Irregular time signatures · Irregular Time Signatures · Rests in bars with irregular beat lengths: · Allow to cross beat divisions · Split at beat divisions · Rest positioning · LongRestPositioningBehaviour::kNeverStrayBeyondMiddleOfStave · LongRestPositioningBehaviour::kMoveAwayFromMiddleOfStave · LongRestPositioningBehaviour::kPositionAtStaveExtremities · LowerBarRestInMultipleVoicesPositioningBehaviour::kHangFromMiddleLine · LowerBarRestInMultipleVoicesPositioningBehaviour::kHangFromSecondLineUp · LowerBarRestInMultipleVoicesPositioningBehaviour::kHangFromBottomLine · BarsOrBeats::kBeats · BarsOrBeats::kBars · Rest Positioning · Coincident rests of the same duration in opposing voices: · Show every rest in each voice · Show only one rest · Position of rests against notes in an opposing voice: · Consider only notes and rests at the same position · Avoid notes sounding after the start of the rest · Positioning of half (minim) and longer rests in opposing voices: · Use default positions · Always move away from the middle of the staff · Position on the top or bottom staff line · Position of down-stem voice bar rests in opposing voices: · Hang from middle staff line · Hang from second staff line from bottom · Hang from bottom staff line · Align rests in the same voice vertically: · When in the same beat group · When in the same bar · Context to consider when positioning rests in multiple voices: · Current and previous bars · Current bar only · Position of rests on single-line percussion instruments: · Align rest bottoms

## Note Input Options dialog: pages

### `noteinputoptions/insertmode` (InsertModeNoteInputOptions)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_insert_mode/write_mode_insert_mode_scope_r.html

> When insert mode scope is set to Global Adjustment Of Current Bar, specify how the bar length is being adjusted.
>

**Controls:** `changeAndShowTimeSigButton`, `changeAndHideTimeSigButton`, `changeBarLengthButton`, `showMoreButton`, `actionBarButton`, `insertBarsSection`, `insertBarRestSection`, `createBarlinesSection`

**Labels and tooltips:** InsertWithinCurrentBarBehaviour::kChangeAndShowTimeSignature · InsertWithinCurrentBarBehaviour::kChangeAndHideTimeSignature · InsertWithinCurrentBarBehaviour::kChangeBarLength · Insert Mode · When inserting with Global Adjustment Of Current Bar: · Change and show time signature · Change and hide time signature · Change bar length · Chord Symbol Options · DoricoPaletteIndicatorUI::recreatePaletteButtonsForPresetSections()

### `noteinputoptions/musicaltransformations` (MusicalManipulationOptionsWidget)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_transformations/write_mode_transformations_c.html

> Sometimes, as the result of performing a rotation that affects the rhythm, the transformed music can end up protruding outside the bounds of the original selection. Dorico can clip its result at the edges of the selection or prevent the transformation entirely.
>
> When notes move into or out of tuplets as a result of the transformation:
>
> It is sometimes possible for a note to be positioned either inside or outside a tuplet, e.g. a quarter note (crotchet) can fit inside a 3:2 quarter note tuplet where it would be notated as a dotted quarter note, or be notated straightforwardly as a quarter note. Dorico can allow such notes to move in or out of tuplets as long as the new duration can be notated, or it can prevent the transformation entirely.
>
> Determines whether Dorico will invert pitches chromatically or diatonically unless explicitly qualified.
>

**Labels and tooltips:** ChromaticOrDiatonic::kChromatic · ChromaticOrDiatonic::kDiatonic · DefaultBehaviourForChromaticInversions::kRetainOutermostPitches · DefaultBehaviourForChromaticInversions::kPivotAboutRoot · DefaultBehaviourForChromaticInversions::kPivotAboutTopNoteInFirstChord · DefaultBehaviourForDiatonicInversions::kPivotAboutRoot · DefaultBehaviourForDiatonicInversions::kPivotAboutTopNoteInFirstChord · Musical Transformations · Clip at selection edges · Prevent transformation · Revise notated durations · Inversions · Default quality for inversions: · Chromatic · Diatonic · When inverting pitches chromatically, pivot about: · Centre, keeping outermost pitches · Root · Highest note in first chord · Lowest note in first chord · When inverting pitches diatonically, pivot about: · Scale Transformations · Behavior for pitches naturally present in destination scale: · Keep relative offset from source scale · Prefer pitches present in destination scale · Behavior for enharmonic equivalents of pitches in source scale: · Do not change · Treat as matching source scale · Destination scale note spellings: · Keep relative to source scale

### `noteinputoptions/notesfromchordsymbols` (ChordSymbolVoicerParallelismOptions)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_arranging_tools/write_mode_generate_notes_from_chord_symbols_dialog_r.html

> This option deteremines how Dorico will choose between using chord tones that will give stronger voice leading versus using more of the chord's tones, giving a fuller sound.
>
> Particularly when voicing chords for polyphonic instruments, such as piano, parallel octaves at the bottom of the voicing can sound strong, so they can be allowed even if parallel octaves are generally not allowed.
>
> When successive chords have different numbers of chord tones,  relaxing restrictions on parallel motion can allow Dorico to produce stronger, fuller voicings.
>
> When successive extended chords (chords with more than four chord tones) move stepwise, it can be preferable for polyphonic instruments, such as piano, to be allowed parallel motion when voicing these chords.
>

**Controls:** `allowParallelismInAllVoicesButton`, `allowParallelismInDivergentVoicesButton`, `notNotAllowParallelismButton`, `contraryMotionNeverButton`, `contraryMotionAlwaysButton`, `contraryMotionWenNotPlayingBassButton`, `doricoCheckBox`, `transposedPitchSpinBox`, `avoidResolutionOfSeventhToFifthButton`, `allowWhenDestinationHasDomSeventhButton`, `alwaysAllowResolutionOfSeventhToFifthButton`, `avoidResolutionOfThirdToFifthButton`, `allowResolutionOfThirdToFifthWhenNotAtTopOfVoicingButton`, `alwaysAllowResolutionOfThirdToFifthButton`

**Labels and tooltips:** FullVoicingPreference::kAlwaysFavourStrongVoiceLeading · FullVoicingPreference::kModeratelyFavourFullVoicingsOverVoiceLeading · FullVoicingPreference::kStronglyFavourFullVoicingsOverVoiceLeading · ParallelMotionAllowanceForExtendedChordsMovingByStep::kAlwaysAllow · ParallelMotionAllowanceForExtendedChordsMovingByStep::kNeverAllow · GenerateNotesFromChordSymbolsContraryMotionPreference::kNeverConsider · GenerateNotesFromChordSymbolsContraryMotionPreference::kAlwaysConsider · FrettedInstrumentVoicingPreference::kFavourPreDefinedShapes · FrettedInstrumentVoicingPreference::kFavourAutoGeneratedVoicings · Parallelism and Contrary Motion · Non-fretted instruments · Balance of voice leading against full voicing: · Strongly prefer voice leading · Moderately prefer full voicing · Strongly prefer full voicing · Parallel octaves: · Allow · Do not allow · Parallel octaves at the bottom of voicings: · Parallel fifths: · Parallel motion for extended chords moving stepwise: · Always allow · Allow only for polyphonic instruments · Never allow · Parallel motion when returning to a previously-used voicing: · Allow parallel motion when only single note moves by step: · Allow in all voices · Allow in non-adjacent voices · Balance of strong resolution versus parallel motion at top of voicing: · Prefer strong resolution · Prefer avoiding parallel motion · Consider contrary motion in the outermost parts: · When not playing bass · Prefer strong resolutions to contrary motion in the outermost parts · Between successive chords, penalise motion of greater than: · Between successive chords, prefer motion of less than or equal to: · Strength of penalty for undesirable notes in chord voicings: · Notes beyond preferred range of instrument: · Notes beyond 'Intervals' limits: · Notes producing muddy voicings: · Motion larger than preferred number of half-steps: · Penalise successive motion in the same direction of greater than: · Allow doublings at same octave when all voices move step-wise · Prefer step-wise movement: · Prefer to avoid leaps in bass line on polyphonic instruments · Parallel motion for entire chords · Stepwise parallel motion for successive chords: · Stepwise parallel motion of chords containing sevenths: · Stepwise parallel motion of diminished chords: · Stepwise parallel motion of augmented chords: · Fretted instruments · Source for chord shapes: · Prefer shapes from library · Prefer auto-generated shapes · Parallel motion on fretted instruments: · Maximum allowed stretch in frets: · Pitches beyond limits when voicing chords on fretted instruments: · SeventhResolutionBehaviour::kNeverAllowSeventhToResolveToFifth · SeventhResolutionBehaviour::kAlwaysAllowSeventhToResolveToFifth · ThirdToFifthResolutionBehaviour::kNeverAllowThirdToResolveToFifth · ThirdToFifthResolutionBehaviour::kAlwaysAllowThirdToResolveToFifth · Chord Degrees · Lowest pitches for scale degrees in chords: · Preferred:

## Playback Options dialog: pages

### `playbackoptions/dynamics` (DynamicsPlaybackOptionsWidget)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_dynamics/notation_reference_dynamics_playback_options_r.html


**Controls:** `humaniseSection`, `overallImpactSpinBox`, `maximumDynamicDeviationSpinBox`

### `playbackoptions/dynamics/pitchcontouremphasis`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_dynamics/notation_reference_dynamics_playback_pitch_contour_emphasis_enable_disable_t.html


**Controls:** `polyphonicInstrumentVoiceBalancingSection`, `percentageToApplyToHighLoudAlgorithmOutputForNonMelodyLinesSpinBox`, `offsetToApplyToOuterNotesOfMelodySpinBox`, `offsetToApplyToChordsInAllOtherVoicesSpinBox`, `overallImpactForPolyphonicInstrumentVoiceBalancingSpinBox`, `effectPercentForForVoicesWithSimilarRhythmsSpinBox`, `offsetToApplyToSingleNotesInAllOtherVoicesSpinBox`, `effectPercentForOtherVoicesWhenMelodyOnTopForteOrQuieterSpinBox`, `effectPercentForForVoicesWithSimilarRhythmsWhenChordsPresentInNonMelodyVoiceSpinBox`, `offsetToApplyToAllOtherNotesOfBassSpinBox`, `offsetToApplyToAllOtherNotesOfMelodySpinBox`, `counteractAgainstDynamicCurvePercentageSlider`, `effectPercentForOtherVoicesWhenMelodyOnTopFortissimoOrLouderSpinBox`, `offsetToApplyToOuterNotesOfBassSpinBox`

### `playbackoptions/dynamics/polyphonicvoicebalancing`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_dynamics/notation_reference_dynamics_playback_polyphonic_voice_balancing_enable_disable_t.html

> A value of 1 will return a linear relationship between the written dynamic intensity levels (pp, p, mp etc.) and the resulting dynamic. Values higher than 1 will result in greater difference between the central dynamics (p, mp, mf, f) than the extreme dynamics (pppp to ppp, or fff to ffff).
>
> These values determine the minimum and maximum dynamic levels that are subject to the dynamic power curve. A value of -3 corresponds to ppp, and a value of 3 corresponds to fff. Dynamics lower than the minimum play back the same as the minimum; dynamics higher than the maximum play the same as the maximum.
>
> A value of 100% allows the dynamics of notes to be modified randomly by up to 40% of a single step between dynamic intensities.
>
> When multiple gradual dynamics of the same direction are in close proximity, for example a series of diminuendo hairpins, they may need to be interpreted as phrasing dynamics, where the dynamic level is reset at the start of each one, so that the music does not become inexorably quieter or louder. With this option activated, Dorico will reset the dynamic level for hairpins of up to four quarters (crotchets) in length that are within four quarters of each other. Switch this option off if you want successive gradual dynamics to always change the overall dynamic level.
>

**Controls:** `useRulesForContrapuntalMusicCheckBox`, `overallImpactForContrapuntalPolyphonicInstrumentVoiceBalancingSpinBox`, `scaleImpactOfBassNotesWhenUsingContrapuntalRulesSpinBox`, `noteDynamicsSection`, `applyAccentToTremoloNotesCheckBox`, `delayedStartSection`, `delayedStartCheckBox`

**Labels and tooltips:** Dynamic Curve · Dynamic curve power: · Minimum dynamic level: · Maximum dynamic level: · Humanize · Maximum change to written dynamic: · Scale effect by: · Use pitch contour emphasis · Pitched: · Unpitched: · Humanize written dynamic by: · Polyphonic Instruments · Offset to apply to all other notes of melody voice: · Offset to apply to bottom/outer notes of bass voice: · Scale overall effect by: · Impact of effect for voices with similar rhythms without chords: · Offset to apply to chords in all other voices: · Use dynamic curve to emphasize effect: · Impact of pitch contour emphasis on non-melody voices: · Offset to apply to single notes in all other voices: · Likelihood of melody being at top: · Offset to apply to all other notes of bass voice: · Offset to apply to top/outer notes of melody voice: · Impact of effect for voices with similar rhythms containing chords: · Use automatic polyphonic instrument voice balancing · Use rules for contrapuntal music · Strength of contrapuntal rules: · Scale overall effect for contrapuntal music by: · Scale impact of bass notes when using contrapuntal rules: · Note Dynamics · Beat stress: · Increase written dynamic of first beat in the bar by: · Increase written dynamic of other beats in the bar by: · Increase written dynamic by: · Apply accent to all notes for unpitched percussion measured tremolo · Bracketed noteheads (ghost notes) for unpitched percussion: · Decrease written dynamic by: · Glissando Lines

### `playbackoptions/pedallines` (PedalLinesPlaybackOptionsWidget)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_pedal_lines/notation_reference_pedal_lines_piano_retakes_changes_c.html


**Controls:** `beforeNoteOnsetButton`, `afterNoteOnsetButton`

**Labels and tooltips:** Pedal Lines · Depression length: · Fraction of quarter note at 120 bpm: · Retake length: · Release length: · Depress sustain pedal at start and at retake: · Before note onset

### `playbackoptions/repeats` (RepeatsPlaybackOptionsWidget)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/play_mode/play_mode_repeats_playback_r.html


**Controls:** `playRepeatsAfterDSCheckBox`, `rhythmSlashesSection`

**Labels and tooltips:** Play repeats · Play repeats after D.S./D.C. jump · Rhythm Slashes · Play slash voices · Time display: · Elapsed time · Frame rate:

### `playbackoptions/timing/arpeggiosigns`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_arpeggio_signs/notation_reference_arpeggio_signs_playback_r.html


**Controls:** `startOnTheBeatButton`, `endOnTheBeatButton`

**Labels and tooltips:** ArpeggioPlaybackPosition::kStartsOnBeat · ArpeggioPlaybackPosition::kEndsOnBeat

### `playbackoptions/timing/gracenotes`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_grace_notes/notation_reference_grace_notes_playback_r.html


**Controls:** `leftButton`, `rightButton`

**Labels and tooltips:** LogDuration::kQuaver · LogDuration::kSemiQuaver · LogDuration::kDemiSemiQuaver

### `playbackoptions/timing/pauses`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_holds_pauses/notation_reference_holds_pauses_playback_r.html

> Setting a pre-roll value allows grace notes before the first rhythmic note of a flow to be played back.
>
> Setting the duration for legato notes affects all notes under a slur except for the last note, which is shortened.
>
> Shortening behaviour for other notes belonging to chords with shortened notes due to repetitions:
>
> Enforcing a gap between repeated notes of the same pitch mimics the physical nature of keyboard instruments whereby a key must be released and replayed before it will resound.
>

**Controls:** `playPausesCheckBox`, `longHenzeSilencePercentSpinBox`, `longSilencePercentSpinBox`

**Labels and tooltips:** Rhythmic Feel · Default rhythmic feel: · Gap between flows during playback: · Pre-roll before flow: · Note Durations · Default notes: · Play as % of written duration: · Shorten note if followed by abutting note of same pitch · Staccato notes: · Staccatissimo notes: · Tenuto notes: · Marcato notes: · Legato notes: · Repeated notes on keyboard instruments: · Maximum gap between notes: · Minimum gap between notes: · Enforce gap between repeated notes of the same pitch · Do not shorten · Shorten if played by same hand · Shorten if played by either hand · Maximum duration for staccato playback technique: · Note Positions · Humanize start positions of notes by: · Humanize end positions of notes by: · Playback of single unslashed grace notes: · Play on the beat · Play before the beat · Default grace note length: · Tremolos · Minimum number of strokes for playback of unmeasured tremolos: · Default unmeasured tremolo length: · Play tremolos at constant speed during tempo changes · Arpeggio Signs · Playback of arpeggio signs relative to the beat: · Start on the beat · End on the beat · Default wiggly arpeggio length: · Default curved arpeggio length: · Minimum length of arpeggio as proportion of notated duration: · Maximum length of arpeggio as proportion of notated duration: · Pauses · Play back pauses · Very short · Very long · Shortening as % of quarter note at 120 bpm · Short (Henze) · Long (Henze) · Hold duration % · Gap duration % · Caesura

### `playbackoptions/timing/rhythmicfeel` (TimingPlaybackOptionsWidget)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/play_mode/play_mode_swing_playback_c.html


**Controls:** `flowsSection`, `noteDurationsSection`, `alwaysTruncateAbuttingNotesOfSamePitchCheckBox`, `staccatoDoubleSpinBox`, `staccatissimoDoubleSpinBox`, `tenutoDoubleSpinBox`, `legatoDoubleSpinBox`, `minimumGapBetweenRepeatedNotesOnKeyboardInstrumentsSpinBox`, `maximumGapBetweenRepeatedNotesOnKeyboardInstrumentsSpinBox`, `enforceGapBetweenRepeatedNotesOnKeyboardInstrumentsCheckBox`, `doNotShortenButton`, `shortenIfPlayedBySameHandButton`, `shortenIfPlayedByEitherHandButton`, `noteStartPositionsSection`

**Labels and tooltips:** KeyboardChordShorteningBehaviour::kOnlyShortenRepeatedNotes

### `playbackoptions/timing/tremolos`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_tremolos/notation_reference_tremolos_playback_r.html


**Controls:** `minimumStrokesForUnmeasuredTremoloSpinBox`, `considerTempoChangesCheckBox`

### `playbackoptions/trills` (TrillsPlaybackOptionsWidget)

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/notation_reference/notation_reference_trills/notation_reference_trills_playback_r.html

> If 'Use samples if possible' is chosen, Dorico will use sampled trills if provided for trills of a half-step (semitone) or whole step (tone), and will generate trill playback for all other intervals. Only generated playback for trills allows Dorico to change trill speed, incorporate grace notes, or start on the upper or lower note.
>
> For generated trills, Dorico can adjust the durations of the notes used to perform the trill according to changes in tempo over the duration of the trill, for example for gradual tempo changes or holds and pauses. If you would prefer the trill to follow tempo changes, deactivate this option.
>
> When transposing a chord shape up the neck, this specifies the highest allowed starting fret.
>
> To prevent chords where the root note is played from being chosen at all, choose 'Omit root from chord'.
>

**Controls:** `generatedTrillsOnlyButton`, `useSamplesIfPossibleButton`, `upperNoteButton`, `lowerNoteButton`, `tuningSection`, `omitRootFromChordButton`, `includeRootInChordButton`, `mustBeLowestNoteOfChordButton`, `mustNotBeLowestNoteOfChordButton`, `mayBeAnywhereInChordButton`, `allowOmissionOfFifthButton`, `includeFifthButton`, `allowOmissionOfNinthButton`, `includeNinthButton`, `allowThumbButton`, `disallowThumbButton`, `preferOmissionsButton`, `preferAdditionsButton`, `alwaysConsiderOmissionsButton`, `ignoreInExtendedChordsButton`, `ignoreInAllChordsButton`, `ignorePlayedInversionButton`, `considerPlayedInversionButton`, `preferSus2Button`, `preferSus9Button`, `suspendedSecondsFollowContextButton`, `preferAdd2Button`, `preferAdd9Button`, `addedNinthsFollowContextButton`, `preferAdd4Button`, `preferAdd11Button`, `addedEleventhsFollowContextButton`, `preferMinMaj7Flat5Button`, `preferDimMaj7Button`, `preferFlat6Button`, `preferFlat13Button`, `includeInChordButton`, `excludeFromChordButton`, `preferSuspensionButton`, `preferAdditionWithOmit3Button`, `preferAugmentedButton`, `preferSharpenedFifthButton`, `preferSimplerChordButton`, `allowAllRootsButton`, `disallowDoubleAccidentalsButton`, `preferSimplerIntervalButton`, `allowComplexIntervalButton`, `preferSixthChordsButton`, `preferMinorSeventhChordsButton`, `followEngravingOptionsButton`, `followInputLiterallyButton`

**Labels and tooltips:** TrillPlaybackMode::kGeneratedOnly · TrillPlaybackMode::kSampledAndGenerated · Playback approach for trills: · Generated trills only · Use samples if possible · Generated Trills · Fast trill speed: · Slow trill speed: · Normal trill speed: · Default playback of generated trills: · Normal speed · Accelerating from normal to fast speed · Starting pitch for generated trills: · Upper note · Lower note · Play generated trills at constant speed during tempo changes · Tuning · Pitch of first A above middle C: · ChordDiagramRootNoteApproach::kMustBeLowestNoteOfChord · ChordDiagramRootNoteApproach::kMustNotBeLowestNoteOfChord · ChordDiagramRootNoteApproach::kMayBeAnywhereInChord · Transposing Chord Shapes · Highest allowed starting fret: · Chord Roots · Root of chord: · Omit root from chord · Include root in chord · If root is included in chord: · Must be lowest note of chord · Must not be lowest note of chord · May be anywhere in chord · Dominant sevenths or higher alterations: · Allow omission of fifth · Include fifth · 11 and 13 chords: · Allow omission of ninth · Include ninth · For 11 and 13 chords, you can specify whether the ninth may be omitted. · Use of thumb when fingering lowest string: · Allow thumb · Disallow thumb · Update existing chord diagram fingerings when changing use of thumb · OmissionOrAdditionInputPreference::kPreferOmissions · OmissionOrAdditionInputPreference::kPreferAdditions · OmissionsConsiderationInputPreference::kAlwaysConsiderOmissions · OmissionsConsiderationInputPreference::kIgnoreInExtendedChords · OmissionsConsiderationInputPreference::kIgnoreInAllChords · SimpleOrCompoundNumberingPreference::kPreferSimple · SimpleOrCompoundNumberingPreference::kPreferCompound · SimpleOrCompoundNumberingPreference::kContextual · DiminishedMajorSeventhInputPreference::kPreferMinMaj7Flat5 · DiminishedMajorSeventhInputPreference::kPreferDimMaj7 · CompoundSuspensionPreference::kPreferSuspensions · CompoundSuspensionPreference::kPreferAdditionWithOmit3 · AugmentedChordWithSeventhPreference::kPreferAugmentedQuality · AugmentedChordWithSeventhPreference::kPreferSharpFiveAlteration · Omissions or additions: · Prefer omissions · Prefer additions · Omissions: · Always consider omissions · Ignore in extended chords · Ignore in all chords · Inversions: · Ignore played inversion · Consider played inversion · Suspended seconds: · Prefer sus2 · Prefer sus9 · Follow context

## Preferences dialog: pages

### `preferences/files/autosave`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/project_file_handling/project_file_handling_autosave_c.html

> Prompt to save projects from an earlier or later version to a new location
>
> When you print or export graphics from your full or custom score layouts, Dorico will use the current transposition chosen on the Players page and indicated in the Edit menu. Dorico can warn you if the layout uses an unexpected transposition. For example, if you habitually publish transposed pitch scores, Dorico can warn you if you try to print in concert pitch.
>
> When you copy a selected text item to the clipboard, Dorico also copies the text to the system clipboard so you can paste it into other applications. This option determines which format is used for the text copied to the system clipboard.
>

**Controls:** `warnForOpenFileModificationOrDeletionCheckBox`, `pruneEmptyFlowsAndLayoutsWhenExportingFlowsCheckBox`, `openCSVAfterExportCheckBox`, `concertPitchButton`, `transposedPitchButton`, `projectFileLocationButton`, `onMyiPadButton`, `iCloudDriveButton`

**Labels and tooltips:** LayoutTransposition::kScoreInC · LayoutTransposition::kTransposingScore · Files · Saving Projects · Default project folder: · Choose... · Show complete path for recent files · Auto-save every: · Project backup folder: · Number of backups per project: · Warn when open project is updated outside Dorico, moved, or deleted · Opening Projects · Warn when projects use fonts not installed on this computer · Warn when opening projects last saved in an earlier or later version · Exporting Files · Filenames for exporting graphics: · Edit... · Omit excluded players and layouts when exporting flows · Open text CSV in default application after export · Suspect transposition for score layouts: · Concert Pitch · Transposed Pitch · Format for text items copied to clipboard: · Default project location: · On this iPad · Key Commands · MIDI Learn · Jump Bar Alias

### `preferences/general/comments`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_comments/write_mode_comments_c.html

> If activated, Dorico checks for recent crash dumps on start-up and prompts you to send them to Steinberg to enhance future software quality. These reports are anonymous, and our privacy policy outlines their use.
>
> We cannot and do not want to track anything personally identifiable. Only basic usage information is tracked enabling us to make improvements, fix problems and implement new features. Your data is safe and will not be shared with any third parties. Read our privacy policy to see exactly what we do with your data.
>

**Controls:** `userNameButton`, `customNameButton`, `optInCheckBox`, `themeComboBox`, `lastWindowComboBox`, `engraveModeGraphicalEditingCheckBox`, `followSelectionWhenActivatingScoreViewCheckBox`, `showCompletePathForRecentFilesCheckBox`

**Labels and tooltips:** General · Language: · Preferred unit of measurement: · Default paper size type: · Default text font family: · Middle C (note 60): · Default piano roll display: · Played Durations · Notated Durations · Instrument Names · Default language for instrument names: · Comments · Author name for comments: · User Name · Custom Name · Full name: · Initials: · Crash Reporting · Show prompt to send crash reports to Steinberg · Privacy Policy... · Suppressed Warnings · To reset all warnings you have suppressed so they can appear again: · Reset Warnings · Steinberg ID · To manage your Steinberg ID,  or delete your account: · Manage Steinberg ID... · Premium Features · Current status: · Status · Iconica Sketch status: · Download... · Diagnostics and Usage Data · Share diagnostics and usage data · Theme: · Open new windows maximized · When the last window is closed: · Close side panels when lower panel is opened · When switching to Engrave mode, activate the Graphical Editing tool · Default zoom: · Default view type: · Overscroll amount: · Show tab bar in new projects · When switching tab or window, bring selection into view · When switching to Play mode, bring selection into view · Ruler · Continue ruler across spreads

### `preferences/keycommands`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/user_interface/user_interface_preferences_key_commands_r.html

> Note durations will match those specified in the MusicXML file exactly, as if input using Force Durations.
>
> Ties will curve upwards or downwards as specified in the MusicXML file, and if a tie is specified as dashed or dotted, its appearance will be imported.
>
> Tuplet placement above or below the staff will be forced to match the MusicXML file, and the bracket will be shown or hidden as specified in the MusicXML file.
>
> Stem directions will be forced to match the MusicXML file, in which they are probably specified as if for a transposing score.
>

**Controls:** `actionBarTextButton`, `exportSection`, `importTupletPropertiesCheckBox`, `importStemDirectorPropertiesCheckBox`, `importExplicitAccidentalsCheckBox`, `importArticulationPropertiesCheckBox`, `importVoiceStartAndStopPropertiesCheckBox`, `importExplicitLetRingTiesOnlyCheckBox`, `advancedOptionsHeaderFrameOtherNotationsSection`, `advancedOptionsContentFrameOtherNotationsSection`, `allRepeatsButton`, `firstRepeatButton`, `lastRepeatButton`, `importDynamicAboveBelowStavePropertiesCheckBox`, `importAllFiguredBassWithOverridesCheckBox`, `importSMuFLNotationsAsPlayingTechniquesCheckBox`, `importTransposingInstrumentsBeyondTheOctaveWithConcertOctaveTranspositionCheckBox`, `includeSuppressedPageAndSystemBreaksCheckBox`, `itemsShiftedIntoPreviousBarRelativeToSpacingOfBarlineCheckBox`, `divideOngoingItemsAtSystemBreaksCheckBox`, `useConsistentVerticalPositionForItemsSpanningMultipleSystemsCheckBox`, `bestAvailableButton`

**Labels and tooltips:** MIDILearnWidgetFrame · Search · Add Key Command · Remove Key Command · Keyboard language:  · Choose Keyboard Language · Print Summary · Reset Key Commands · Add &MIDI Command · Remove M&IDI Command · MIDI Learn is only possible if you have a project loaded · Add Alias · Remove Alias · XMLImportPreferencesWidget · MusicXMLImportTabMirroringBehaviour::kDoNotMirror · Import · Notes and Chords · Note durations · Tie placement and appearance · Tuplet placement and bracket visibility · Beam groups · Notes will be beamed as specified in the MusicXML file. · Stem directions · Accidental visibility · Articulation placement · Enforce order of tuplet nesting · Rests · Rest durations · Rest positions · Rest visibility · Other Notations · Text items · Import font style information · Explicit laissez vibrer ties only · Slur direction · When notation and tablature are both encoded as separate parts: · Combine into single player · Copy strings and tuning · Import independently · Dynamics placement · Figured bass appearance · Ambiguous arpeggio lines span all staves · Glissando line style and text · Import other-technical playing techniques · Import system and frame breaks · Include instrument octave transpositions at concert pitch · XMLExportPreferencesWidget · Export · Include suppressed system and frame breaks · Items at the end of the bar naturally relative to barline · Gap after barline: · Enable this if you plan to import your exported MusicXML into Finale. · Split ongoing items at system and frame breaks · Use same vertical position for all systems for lines crossing breaks

### `preferences/noteinput/propertiesscope`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/properties/properties_panel_local_global_scope_c.html

> You may find it more natural to add accidentals, articulations and to prolong the duration with a rhythm dot after committing the note. With 'After inputting note' chosen, the panel buttons and key commands for accidentals, articulations and rhythm dots will affect the last input note. When 'Before inputting note' is chosen, they will affect the next note to be input.
>
> When using Lock Duration, Dorico will by default jump over an unlimited number of rests to find the next note or chord in the current voice in the same flow. If you would prefer Dorico not to jump over an unlimited distance, activate this option.
>
> You can create a system or frame break at any rhythmic position, including in the middle of a bar, but by default breaks will snap to barlines. When creating a single system or frame break, the break will be created at the start of the bar in which the earliest item is selected. When using Make Into System or Make Into Frame, the first break will be created at the start of the bar in which the earliest item is selected, and the second break will be created at the end of the bar in which the latest item is selected. To instead create the break at precisely the position you select, deactivate this option.
>
> Lock source and destination systems when moving bars to previous or next system
>

**Controls:** `prioritiseNoteheadsButton`, `prioritiseBeamsAndStemsButton`, `handToolButton`, `marqueeSelectToolButton`, `endGradualDynamicsAtStartOfLastNoteCheckBox`, `applyCutawayChangesOnTopStaffToAllStavesInInstrumentCheckBox`, `automaticButton`, `forwardsButton`, `backwardsButton`, `pathsListView`, `addButton`, `removeButton`, `allowListView`, `addAllowedPluginButton`, `blockAllButton`, `blockPluginButton`, `blockListView`, `allowPluginButton`, `allowAllButton`, `clearEngineCacheButton`, `resetEngineDataButton`, `proofingEnabledCheckBox`

**Labels and tooltips:** Note Input · Pitch and Duration · By default, specify pitch: · Before Duration · After Duration · Specify accidental, rhythm dot and articulations: · After inputting note · Before inputting note · Lock Duration · Jump over rests to next note only if closer than: · Force Duration · Preserve Force Duration state when stopping and restarting note input · Auditioning · Play notes during note input and selection · Play changes of shadow notehead pitch in pitch before duration input · Play all notes in chord when any is selected · Use fixed volume to play selected notes: · Mouse Input · By default, enable note input using the mouse · Play shadow notehead pitch · Enable note pitch and rhythmic position editing using the mouse · Middle mouse button changes selection · Breaks · Snap system and frame breaks to barlines when creating · Create system breaks when using Lock Layout · Percussion Input · Input techniques from MIDI key: · Use percussion map · Use staff position · Interpret as: · Treble G clef · Bass F clef · Input onto kit or grid: · Number of keys for techniques: · Input onto single-line staves: · Interpret pitches relative to: · Copying Music · Properties · When starting a new project, set local properties: · Locally · Globally · When selecting multiple items of different types: · Show all properties · Show only common properties · DefaultMouseClickToolType::kHand · DefaultMouseClickToolType::kMarqueeSelect · PaletteButtonBehaviourWithSelection::kCreateItemAtSelection · PaletteButtonBehaviourWithSelection::kCreateItemWithMouse · GraceNoteConversionPosition::kAuto · GraceNoteConversionPosition::kEnd · GraceNoteConversionPosition::kStart · Editing · Selection priority when clicking: · Prioritize noteheads · Prioritize beams and stems · Default click-drag behavior: · Hand Tool · Marquee Select Tool · Drag threshold: · Double-click in Setup or Engrave mode switches to Write mode · Double-click on a chord symbol in Engrave mode opens: · Kerning Pairs Editor · Appearance Editor · Follow selection changes on undo and redo · Allow multiple items to be created with the mouse · Creating items with the mouse: · Create item at selection · Load pointer with item · Create items at position of first selected note · Create clefs at position of first selected note

### `preferences/play/midirecording`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/write_mode/write_mode_midi_recording/write_mode_midi_recording_optimization_c.html


**Controls:** `inputLatencyMsSpinBox`

### `preferences/play/playbacktemplate`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/play_mode/play_mode_playback_templates_c.html


**Controls:** `activateOneAskButton`, `activateOneAlwaysButton`, `activateOneNeverButton`, `activateNextAskButton`, `activateNextAlwaysButton`, `activateNextNeverButton`, `followPlayheadCheckBox`, `playSelectedStavesCheckBox`, `defaultPluginOutputGainSlider`, `defaultPluginOutputGainSpinBox`, `wideSpinBox`, `deviceTableView`

**Labels and tooltips:** AskAlwaysNever::kAsk · AskAlwaysNever::kAlways · AskAlwaysNever::kNever

### `preferences/play/quantization`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/project_file_handling/project_file_handling_quantize_options_r.html


**Controls:** `detectTupletsCheckBox`, `fillGapsCheckBox`, `graceNotesCheckBox`, `preserveVelocityCheckBox`, `importPedalLinesCheckBox`, `detectSlursCheckBox`, `detectTremolosCheckBox`, `detectTrillsCheckBox`

### `preferences/play/transportdisplay`

Manual: https://steinberg.help/dorico_pro/v6/en/dorico/topics/user_interface/user_interface_transport_options_r.html

> Dorico's automatic playback template makes optimal use of the supplied sound content, including automatically configuring new sounds when they are installed.
>
> This value is used for new projects, when applying a playback template, or when choosing Play > Apply Default Output Level.
>
> Dorico must be restarted for changes to any of these options to be respected.
>

**Controls:** `elapsedTimeButton`, `timecodeButton`, `barBeatTickButton`, `beforeDurationButton`, `afterDurationButton`, `useFixedVolumeCheckBox`, `fixedVolumeSpinBox`, `mouseInputDefaultCheckBox`, `middleMouseButtonChangesSelectionCheckBox`, `learnButton`, `usePercussionMapButton`, `useStaffPositionButton`, `interpretAsTrebleClefButton`, `interpretAsBassClefButton`, `copyAutomationDataCheckBox`

**Labels and tooltips:** MiniTransportDisplayType::kProjectTime · MiniTransportDisplayType::kTimecode · MiniTransportDisplayType::kBarBeatTick · Playback Template · Use 'Auto' playback template · Default HALion plug-in: · Default stage template: · Space template override: · Preferred HALion plug-in: · Use best available · Use preferred · Default playback template: · Project Activation · Activate subsequent project on load · Activate project when only one project: · Always · Never · Playhead · S&how playhead when stopped · Play from se&lection only plays selected staves · Play button in mini transport plays from selection, if any · Mixer · Default output level: · MIDI Input Devices · Bluetooth MIDI Devices... · Quantization · Quantization unit: · Detect &tuplets · Quantization unit for tuplets: · Detect &grace notes · Recording · Enable &MIDI Input · Suspend when application is in background · Enable MIDI thru · Filter out MIDI controllers · Preserve note velocities · Preserve note &positions · Import CC64 as &pedal lines · Snap pedal lines to previous beat · Detect slurs · Detect tremolos · Detect trills · Add articulations to notes · MIDI input latency compensation: · Transport Display · Default mini transport display: · Elapsed Time · Timecode · Bar.Beat.Ticks · Controllers · Reset controllers and send 'all notes off' when stopping playback · Multi-core rendering · Enable multi-core rendering · Audio Buffer Size · Audio Device · Enable ASIO-Guard · Enable high-DPI plug-in user interfaces · Enable WinRT MIDI (required for Bluetooth-connected MIDI devices) · Form · PercussionKitInputMethod::kInterpretWithGClef · PercussionKitInputMethod::kInterpretWithFClef

**Commands triggered:**
- `Play.DeviceSetup`: Device Setup
