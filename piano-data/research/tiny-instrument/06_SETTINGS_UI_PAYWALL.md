# Settings, UI surfaces, paywall, intents, widgets

## 1. Settings (exact property names of `SettingsManager`, 280 stored properties)
Key names are the property names without the leading `_` (persisted via UserDefaults/iCloud sync store `isApplyingSyncStore`: **inferred**). Defaults are in code and were not decompiled. Full list with types: `data/settings_keys.json`. Grouped (grouping inferred from names):

- **Onboarding / app state:** hasShownWelcomeSheet, hasShownOnboarding, hasShownModeTour, showModePickerOnLaunch, lastSeenWhatsNewVersion, appInstallDate, appLaunches, appMode, activeMainView, selectedSidebarView, totalDonations.
- **Keyboard:** showKeyLabels, showKeyboardOctaveLabels, keyboardOctavePosition, lowNote, highNote, physicalKeyboardLowNote/HighNote, autoExpandKeyboard, showKeyboardNavArrows, autoOctaveShift, keyboardTheme, keyboardNoteNamePosition, keyboardHighlightStyle, keyboardBorderEffectEnabled/Style/Reacts, keyEffectEnabled/Style/Color, showScaleDegrees, showFingering, highlightHand.
- **Staff:** showStaff, showPlayAlongStaff, showStaffGhostNotes, showStaffChordLabels, showStaffRomanNumerals, staffAccidentalStyle, engravingStyle, engravingFont, useDoubleTrebleStaff, useColoredStaves, showLedgerLines, showStaffOctaveLabels, staffNoteNamePosition.
- **Notation language:** noteNameSystem, solfegeSeventh, octaveConvention, accidentalSpelling, romanNumeralStyle, noteFormatGeneration.
- **Sound:** instrument, volume, reverbEnabled/Mix/PresetIndex, playSound, muteExternalMIDIAudio, muteOnscreenKeyboardAudio, automaticallySelectPiano, playedInstrumentIds.
- **MIDI / input:** enableMidiInput, enableMidiOutput, activeMidiInputs, channel, midiInputSplitNote/LowerTrack/UpperTrack, useComputerKeyboard, enableMicrophoneInput + mic* (6), tunerEnabled, tunerMode, autoClearStuckNotes, stuck-note thresholds, midi transport keys.
- **Practice:** practicePattern, practiceOctaveCount, practiceStartingOctave, practiceStrictnessMode, scale/chord/midi practice hold time, spacing, overlap, show keyboard/hints/note names/staff/fingering/lyrics, lyrics display (highlightActiveWord, scrollingLines, showChordsAbove), midiPracticeSpeed, metronomeBPM/Enabled.
- **Progress & notifications:** dailyGoalKind, dailyGoalMinutes, practiceScheduleEnabled, practiceReminderHour/Minute, practiceWeekdays, practiceModeBudgets, practiceCalendarEventID, reminderEnabled/Hour/Minute, streakRiskEnabled/Hour/Minute, gapNudgesEnabled, milestonesEnabled, weeklyDigestEnabled, homeCardCollapsed, showProgressOnLaunch. UI path string: "Settings ▸ Progress & Notifications ▸ Practice schedule".
- **Gamification:** streakBest, lifetimeXP, perTypeXP, personalBestCount, personalBestTypesToday, personalBestTypesDay, gameCenterEnabled, gameCenterAgeConfirmed, easterEggsEnabled.
- **Aria / coaching:** coachingEnabled, coachingPersonality, coachingEmojiLevel, ariaSuggestionsEnabled, ariaOrbEnabled, ariaChat* (narration, keyboard embeds, progression embeds, actions, nav cards), theoryNarrationEnabled, earTrainingNarrationEnabled, narrationSpeed, selectedNarrationVoiceIdentifier, focusPromptOnContinueEnabled.
- **Accessibility / look:** textSize, reduceMotionOverride, differentiateWithoutColorOverride, reduceTransparencyOverride, boldTextOverride, increaseContrastOverride, useHaptics, particleEffectsEnabled, shaderEffectsEnabled, noteAnimationEnabled, splashAnimationEnabled, selectedColorScheme.
- **Debug:** debug, showDebugOutlines, debugRenderNoteOverlayBar, enableTestTune, coursesEnabled (feature flag).

## 2. Paywall: one-time packs (StoreKit config `TinyInstrument.storekit`, no subscriptions)
| Product id | Name | Price (USD) |
|---|---|---|
| pack_theory_core | Core Theory | 2.99 |
| pack_theory_advanced | Advanced Theory | 4.99 |
| pack_practice_studio | Practice Studio | 4.99 |
| pack_chord_lab | Chord Lab | 2.99 |
| pack_composition | Composition Studio | 4.99 |
| pack_keyboard_themes | Keyboard Themes | 1.99 |
| pack_full_library | Full Library | 14.99 |

`ContentPack` enum mirrors these. Gating points (`PaywallSource`, exact): theoryLesson, theorySelection, earTraining, scalePractice, twoHandDrills, chordProgressionSetup, progressionsList, progressionSetup, progressionLibrary, progressionTemplate, progressionBuilder, composeSelection, chordChartImport, playExplore, packStore, onboarding, whatsNew, settings, unknown. Chapters carry `requiredPack`; Play & Explore groups have `isFree`; ear-training levels `isPurchaseLocked`. Legacy buyers: `EarlyAdopterCohort` paidLegacy / earlyAdopter, analytics `legacy_purchaser_granted`, `early_adopter_2_2_0_granted` (the app was paid before 2.2.0, then became free with packs: inferred). Donation tip jar (`DonationManager`, `totalDonations`).

## 3. Shortcuts / App Intents (exact, `Metadata.appintents`)
| Intent | Title | Parameter | Phrases |
|---|---|---|---|
| PlayScaleIntent | Play Scale | scale (ScaleEntity) | "Play the ${scale} scale in ${applicationName}", "Show me the ${scale} scale in …" |
| PlayChordIntent | Play Chord | chord (ChordEntity) | "Play the ${chord} chord in …", "Show me the ${chord} chord in …" |
| OpenTodaysLessonIntent | Open Today's Lesson | — | "Open today's lesson in …", "Start my lesson in …" |
| StartPracticeIntent | Start Practice | — | "Start practice in …", "Start practicing with …" |
| OpenEarTrainingIntent | Open Ear Training | — | "Open ear training in …", "Start ear training in …" |
| OpenComposeIntent | Open Compose | — | "Open compose in …", "Start composing in …" |
Plus a Focus filter (`PracticeFocusFilter`), Spotlight indexing (`SpotlightIndexer`), Live Activities (`PracticeActivityContentState {itemName, progress?}`, `FocusActivityContentState`).

## 4. Widgets and deep links
Widgets `WidgetKind` keepPlaying, todaysTheory; snapshot schema `WidgetSnapshot {schemaVersion, updatedAt, keepPlaying {lessonID, lessonTitle, chapterIndex, chapterTitle, lessonIndexInChapter, totalLessonsInChapter, progressWithinLesson, state notStarted/inProgress, iconSystemName?, tintName?}, todaysTheory {highestCompletedChapter, eligibleCardIDs, showWelcomeCard}}`; background refresh id `dk.codeloop.TinyInstrument.widgetRefresh`. URL scheme `tinyinstrument://`; `WidgetDeepLink` = lesson(id, step?), theory(cardID), playChapter(id), playExercise(id), practiceSetup(feature, params), earTrainingLevel(id), course(stableId, day?), continueLearning, stopPractice, stopFocus, play, practice, practiceScale, practiceChords, practiceSongs, practiceMidi, earTraining, compose.

## 5. Screens (view names from metadata and code graph; flows inferred from names)
Onboarding (`OnboardingView`, `WelcomeSheet`, mode tour, mic setup), Home progress card (`HomeProgressCard`: streak, Aria suggestion, coaching copy, focus time per mode, drill entries, challenges, achievements button), mode splash (`ModeSplashView`), Learn (`TheorySelectionView`, `TheoryLessonView`, `TheorySummaryView`, `TheoryCurriculumPreview`, `CircleOfFifthsDiagramView`, `ScaleDegreeExplorerView`, `ChordExplorerView`), Ear Training (selection, game, multiple choice, keyboard, stats, summary, tools, health bar), Practice (`PracticeSelectionView`, `ScalePracticeView`, `ChordPracticeView`, `MIDIPracticeView`, `SongPracticeView`, setup sheets with config preview, `PracticeSummaryOverlay`), Compose (canvas, grid, header bar, track sidebar, transport, section bar, lesson overlay, MIDI import dialog), Play (free keyboard, play dock with Chord Lab / progression strip), Songbook (chord charts), Settings (`SettingsView`, `MidiSettings`, `EngineSettingsView`, `LicensesView`, `AboutDeveloperView`, mail, share), What's New (`WhatsNewContent` highlights/custom with figures per feature), Pack Store / paywall, Achievements gallery, Aria chat, rating overlay, debug menus.
