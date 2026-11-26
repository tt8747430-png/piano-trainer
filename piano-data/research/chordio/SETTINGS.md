# Settings

`Settings.bundle/Root.plist` is the **unused Xcode template**: `name_preference` (text), `enabled_preference` (true) and `slider_preference` (0.5). **exact**. The real settings live in an in-app popover (`SettingsPopoverPresentationController`) and in `NSUserDefaults`. The preferences file could not be read (macOS container privacy), so the key names below come from string constants in the binary (**exact** names). Defaults are given only where the code shows them.

## In-app Settings sections (exact titles, in order as in the binary)
Audio Devices · KEYBOARD OPTIONS · UI Appearance / Appearance · Music Playback · Time Signature · Transpose Sequence · Launch Quantise · Midi Options · MIDI Output · MIDI Sync · General (Show Onboarding) · Ableton Link · Keyboard Colours · Tempo · Key Signature.

## Keys by area
| Area | Keys (UserDefaults unless noted) | Type / default |
|---|---|---|
| Appearance | `TBIsLightModeKey`, `AppColourAppearanceModeKey`, `AppColourAppearanceModeSelectedIndexKey` | bool / index |
| Keyboard | `NumberOfKeysValueKey`, `KeyboardGridNumberOfKeys`, `KeyboardInstrumentKey`, `PitchShiftKeyboardOctaveKey`, `TransposeKeyboardOctaveKey`, `TBMacKeyboardHeightKey`, `TBKeyboardHighlightDotEnabledKey`, `TBKeyboardResizeHandleEnabledKey`, `TBKeyboardSustainPedalDimmingEnabledKey`, `TBKeyboardSustainPedalDimmingOpacityKey` (Subtle/Strong), `TBSustainPedalNumberKey`, `TBHoldChordDisplayEnabledKey`, `chordDisplaySwitchKey`, `chordNotesDisplaySwitchKey`, `KeyboardHightlight{Red,Green,Blue,Alpha}ComponentKey`, `NoteSelectionColour…ComponentKey`, `IntervalColour…ComponentKey` | |
| Detached windows | `TBAlwaysOnTopSwitchKey`, `TBKeyboardAlwaysOnTopSwitchKey`, `TBGrandStaffAlwaysOnTopSwitchKey`, `TBChordDisplayAlwaysOnTopSwitchKey`, `TBChordDisplayVisibleCountKey`, `TBKeyboardWindowScene{OriginX,OriginY,Width,Height}Key` | bool / geometry |
| Notation | `TBNoteNotationTypeKey` (English / German / French / Do Re Mi fixed / Solfège), `TBSolfegeIntervalStyleKey`, `TBScaleOctaveDisplayAllKey`, `TBFingeringSettingsPanelVisibleKey` | index |
| Playback | `PlaybackInstrumentKey`, `TBMusicTempoChangedByUserKey`, `TBTimeSignatureKey`, `TimeSigNomKey`, `TimeSigDenomKey`, `TBKeySignatureIsMinorKey`, `TBKeySignatureTextKey`, `TBKeySignatureSongViewValueIndex`, `TBLaunchQuantizationKey`, `TBChordPlaybackRateKey`, `ChordPatternNumberKey`, `TBChordPatternTriggerOnPlayKey`, `TBChordPadsModeEnabledKey`, `TBKeyCycleTransposeDeltaKey`, `RelatedChordOctaveNumberKey` | |
| Backing | `SelectedGenreIndexKey`, `SelectedGenreUserDefaultKey`, `SelectedSubgenreUserDefaultKey`, `TBSelectedSubGenreTypeKey`, `TBSelectedSubGenreTempoTypeKey`, `DrumPatternNumberKey`, `DrumPatternIndexNumberKey`, `TBDrumCustomPatternsKey`, `{Drum,Bass,Chord}BackingMuteVolume(UserDefault)Key`, `bassVolumeLevelNumbersKey` | |
| Bassline | `TBBasslineEnabledKey` (false), `TBBasslineStyleIndexKey` (3 = Walking), `TBBasslineComplexityKey` (0.5), `TBBasslineSwingKey` (0.5), `TBBasslineHumaniseKey`, `TBBasslineOctaveOffsetKey` (0), `TBBasslineInstrumentIndexKey` (0), `TBBasslinePracticeModeKey` (0–2, clamped to 1 if > 2), `TBBasslineCustomPresetsKey` | defaults from `resetToDefaults` **exact** |
| Harmony | `TBHarmonyKeyRootNameKey`, `TBHarmonyKeyIsMinorKey`, `TBHarmonyFollowSelectedChordKey`, `TBShowHarmonyRelationshipsKey` | |
| Modes | `TBModesWheelSpinHintEnabledKey`, `TBHasTappedMusicTheoryScaleNumberKey` | |
| Sheet music | `SheetMusicFontSize`, `TBSheetMusicHighlightKeyboardNotesKey`, `TBSheetMusicIsTrebleClefActiveKey`, `TBSheetMusicIsBassClefActiveKey`, `TBSheetMusicHasLeadLinesKey`, `TBIsShowingSheetMusicItemsKey`; per score in Core Data (`SheetMusicItem`: tempo, reverb, swing, clefs, note size, letters, repeat bars) | |
| Lessons | `TBListeningSession{Audio,Midi}{Gain}{Number,SliderValue}Key`, `TBListeningSession{Pitch,Speed}{Number,SliderValue}Key`, `TBListeningSessionHideMIDIPlaybackValueKey` | |
| Audio | `TBAudioOutputDeviceUIDKey`, `TBAudioOutputDeviceNameKey`, `TBAudioInputDeviceUIDKey`, `TBAudioInputDeviceNameKey`, `TBAudioBufferFrameSizeKey`, `TBSelectedDeviceKey/Name/Index`, `TBSelectedOutputDeviceIndexKey` | |
| MIDI in | `TBMIDIInputAutoConnectKey`, `TBMIDIInputChannelKey` (0 = All), `TBMIDIInputPortIndexKey`, `TBSelectedMIDISourceNamesKey`, `TBKnownMIDISourceNamesKey`, `TBMIDIVirtualInputEnabledKey`, `TBMIDIVirtualSourceUniqueIDKey` | |
| MIDI out | `TBMIDIOutputDestinationsKey`, `TBMIDIOutput{Chords,Bass,Drums}ChannelKey`, `TBMIDIOutputSendDrumsKey`, `TBMIDIOutputVirtualEnabledKey`, `TBMIDIOutputIndicatorKey`, `TBMIDINetworkSessionEnabledKey`, `TBMIDIVirtualDestinationUniqueIDKey` | |
| MIDI sync / Link | `TBMIDISyncSendClockKey`, `TBMIDISyncFollowClockKey`, `TBMIDISyncFollowTransportKey`, `TBMIDISyncRespondToMMCKey`, `TBMIDISyncClockSourceKey`, `TBMIDISyncBeatsPerBarKey`, `TBMIDISyncBeatIndexKey`, `ABLLinkEnabledKey`, `TBLinkAppTempoKey` | |
| Musical typing | `TBMusicalTypingIsOnKey`, `TBMusicalTypingVelocityKey`, `TBMusicalTypingKeyCodeKey`, `TBMusicalTypingModifiersKey` | |
| Store / misc | `TBAppStorereceiptActiveStatusKey`, `TBPurchaseAppReceiptKey` (existence noted only), `TBDeveloperModeAppKey`, `TBHasCompletedInteractiveOnboardingKey`, `TBSplitViewControllerUIStateKey`, `TBWorkspaceCardIndexKey`, `kNumberOfChordPacksKey` | |

Some `TB…Key` strings are notification userInfo keys rather than defaults, for example `TBSelectedChordModelKey`, `TBTappedDetachedKeyboardNoteKey` and `kChordEdit…Key`. Which keys are persisted cannot be fully separated statically. **inferred**.

Reset actions in the binary: "Removes all custom drum patterns and restores the Backing Rhythm tool's default style, kit and drum volume." and "Restore Keys, Start, and Size to their defaults." **exact**.
