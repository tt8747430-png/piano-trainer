# Practice and learning: lesson player, sheet-music player, Wait Mode, quizzes, feedback

Chordio has **no XP, streaks, badges, levels-progress or score history**. **exact**: there is no Core Data entity for these, and no strings such as "streak" or "XP". Feedback is immediate and visual only (green/red notes, a check-mark pill, and a "Score: x / y" label in quizzes). Proficiency appears only as labels on content: pack level 0/1/2 and item level 0/1/2. The level picker is "Select Proficiency Level" / "Proficiency Level: %@". The list `Beginners, Intermediate, Advanced, Professional` is **exact** (strings).

## 1. Workspaces (the app's top-level modes)
The help text says "The main features are divided into six Workspaces. Select one … by tapping the title button (e.g. Composition)." **exact**. The workspace classes in `WorkspacesViewController` are:

| Workspace | Controller | Purpose |
|---|---|---|
| Composition | `HomeViewController` canvas + `ChordSequenceViewController` | live chord detection, chord cells, playback, tools |
| Sheet Music | `TBSheetMusicViewController` / `SheetMusicView` | score player with Wait Mode |
| Lessons (Listening Skills) | `ListeningSkillsViewController` | `.cla` lesson player |
| Scales | `PractiseScaleViewController` | scale browser and practice |
| Modes | `ModesViewController` | mode wheel / circle of fifths |
| Learn Theory | `LearnTheoryViewController` | theory pages and quizzes |

(There is also `TempWorkspaceViewController` and the string "Scales - Coming Soon".)

## 2. Lesson player (`.cla`, the Lessons workspace)
- **Waveform** (`SYWaveformPlayerView`, `SCWaveformView`) for the audio track, plus a **piano roll** (`PianoRollViewController`, `PianoRollView`, `PlayHeadView`, `MIDIPianoRollSparkline`) for the MIDI track. They are time-synced: "Lesson Packs that contains both MIDI and Audio tracks are synced in time". **exact**.
- **Two control panels**, each with LiveKnobs for **Pitch, Speed, Volume** and a Reset button: `ListeningSessionAudioControlsViewController` and `ListeningSessionMidiControlsViewController`. Values are persisted with `TBListeningSession{Audio,Midi}GainNumberKey`, `…PitchNumberKey`, `…SpeedNumberKey` and `…SliderValueKey`. MIDI track pitch is in semitones ("Track %lu pitch set to %.2f semitones (%.0f cents)"). Audio uses `AVAudioUnitTimePitch`. **exact**.
- **Markers panel** (`ListeningSessionMarkersControlViewController`): a list of `LessonPackMarker`. Tapping a row jumps there. You can add a marker at the current time (`addMarkerButtonPressed:`), rename it ("Edit the marker title"), or delete it by swiping. The progress label shows the current/next marker name (`TBListeningSessionProgressCurrentMarkerNameValueKey`). BlankLesson cannot take markers ("is a Blank Lesson !!!"). **exact**.
- Transport: Play/Pause, Back to start, rewind and forward by N seconds (`rewindListeningSessionByTimeInSeconds:`; SF Symbols `gobackward.5` and `goforward.5`, so **5 s**), a scrub slider, and "Hide MIDI playback" (`TBListeningSessionHideMIDIPlaybackValueKey`).
- The lesson has **no scoring**. It is a listen-and-play-along tool.

## 3. Sheet-music player (scores from `.sheetmusicpack` / `.csm` / imported MIDI)
The renderer is a port of a MidiSheetMusic-style engine. The class names match it: `MidiFile, MidiTrack, MidiNote, MidiOptions, ChordSymbol, ClefMeasures, SymbolWidths, WhiteNote, StemView, AccidSymbolView, BarSymbolView, RestSymbolView, TimeSigSymbolView, KeySigChangeSymbolView, LyricSymbol`, and the source file names `ChordSymbolView.m`. **inferred** lineage (see RESOURCES_LICENCES.md). `MidiOptions` fields **exact**: `transpose, key, time, tempo, pauseTime, shifttime, combineInterval, twoStaffs, showNoteLetters, showLyrics, showMeasureNumbers, showChordNames, showDynamics, showPedalMarks, playMeasuresInLoop(+Start/End), isTrebleClefActive, isBassClefActive, didPressLeftHand, didPressRightHand, enableCountIn, swingUnit, swingPercent, swingClefTarget, upperStaveClef, lowerStaveClef, repeatBarsEnabled, repeatBarSections, middleCSplitPointOffsetNumber, sheetMusicDisplayNoteSize, backgroundColourState, exsInstrumentBassFileName, exsInstrumentDrumsFileName`.

Practice tools (pack info page, **exact** text):

| Tool | Description |
|---|---|
| Adjust the Tempo | "Drop any score to a comfortable speed …" |
| Hands Separately | Left Hand / Right Hand buttons. "Both Left Hand and Right Hand are pressed. No changes made." |
| Loop a Section | Cycle button + `RepeatBarsEditorViewController` |
| **Wait Mode** | "Playback waits at every note until you play it, lighting each one green as you get it right." |
| Play with the Band | separate piano, bass and drum volumes (`SheetMusicVolumeViewController`) |
| Metronome & Count-in | |
| Play in Any Key | transpose shown above the score |
| Follow the Score | "A cursor tracks every beat as it plays and the page turns itself." The cursor height is per item (`cursorHeightMultiplier`) |
| Hear Any Chord | "Click any chord on the page to hear it on its own, or step through them with the arrow keys." (`highlightChordAtPoint:durationInSeconds:`) |
| Make the Page Yours | note size, note letters, clefs, dark mode |
| Print & PDF | `GeneratePDF`, `UIPrintInteractionController` |
| Study notes | Markdown `detailDescription` in `ScoreDescriptionViewController` with a resize grip |

**Count-in** (**exact** log strings):
- It plays one bar of beats at the adjusted tempo: interval = 60 / (tempo × speed%).
- The first beat plays immediately.
- The playback position is rounded down to the start of the bar ("rounded to bar start … (measure %ld)").
- Real playback starts "on downbeat" after the count-in.

**Speed**: "Playback speed: %ld%%, Adjusted tempo: %.1f BPM". **exact**.

### Wait Mode algorithm (exact; `MidiPlayer` @0x1001c9480–0x1001ca8e4, `SheetMusicView` @0x10008d2e4–0x10008d5d0)
1. Turning it on (`setWaitModeEnabled:`) connects all external MIDI inputs ("Wait Mode: connected %lu external MIDI input(s).") and the on-screen keyboard.
2. A **step** is every distinct note `startTime` (in pulses). From the current pulse it finds the first start time at or after that pulse (`waitModeFirstStartTimeAtOrAfter:`). With looping on, it stays between `waitModeLoopStartPulse` and `waitModeLoopEndPulse`.
3. **Expected pitches** = the set of MIDI numbers of all notes starting exactly at that pulse that fall in the **active hand**. `waitModeNoteInActiveClef:` decides this: both clefs active → every note counts; only treble active → only channel 0; only bass active → only channel 1. So the hands are encoded by MIDI channel 0 (RH) and 1 (LH), which matches the bundled packs.
4. On entering a step the player seeks the cursor to it, sounds nothing, clears the matched set, and tells the UI `waitModeWaitingForNotes:expected matched:0`.
5. **Note-on handling**:
   - If the pitch is **not** in the expected set → `waitFeedbackFlashWrong`: the expected note heads turn **systemRed for 0.32 s** (`dispatch_after 320 000 000 ns`) and then revert. Nothing else happens: no penalty and no counter.
   - If it is expected and not yet matched → it is added to the matched set, `waitFeedbackMarkMatched:` turns that note **systemGreen**, and the pill updates to "matched / expected".
   - When matched ⊇ expected (all chord notes held or played in any order, with no timing window) → `waitModeAdvance` → the next step.
   - Note-off is ignored (`waitModeHandleNoteOff:` is empty), so notes do not have to be held together.
6. Note colours during a step: expected and unmatched = **systemBlue**; matched = **systemGreen**; wrong flash = **systemRed**.
7. The pill (`createWaitModePillIfNeeded`, `showWaitModePillWithExpected:matched:`) shows an icon, a label and a progress bar. On success it flashes `checkmark.circle.fill` in systemGreen at 18 pt (0x4032000000000000 = 18.0), weight 6.
8. At the end of the song, or the end of the loop when looping is off, it calls `midiPlayer:didReachEndOfSong:` and `waitModeStopAndNotify`. Changing hands mid-run (`waitModeHandSelectionDidChange`) recomputes the expected set.
9. The preference is restored per session (`restoreWaitModePreference`). The playback-bar button is "Wait Mode: Play Each Note to Advance".

## 4. Quizzes (Learn Theory ▸ "Switch between Lessons and Quizzes"), `QuizLessonPickerView`
Quiz types (**exact** titles and subtitles):

| # | Quiz | Subtitle | Status |
|---|---|---|---|
| 0 | Note Identification | Identify notes on the staff | active |
| 1 | Interval Recognition | Identify intervals by ear | active |
| 2 | Chord Playback Recognition | Identify and play chords | active |
| 3 | Chord Matching Exercise | Identify chords from audio and visual cues | active (**inferred**; a "Coming Soon" format exists for others) |
| — | "%@ (Coming Soon)" | | placeholders |

How each one works:
- **Note Identification**: "Look at the note displayed on the staff to the left. Tap the corresponding key on the piano keyboard below to answer." Treble or bass clef. Log: "Correct answer for note: %@" / "Incorrect answer. Expected: %@, Got: %@".
- **Interval Recognition**: "Listen to the interval and look at the staff. Select the correct interval name from the grid below." Grid of 13 (Perfect 5th position **inferred**; the string is shared elsewhere): Unison, Minor 2nd, Major 2nd, Minor 3rd, Major 3rd, Perfect 4th, Tritone, Perfect 5th, Minor 6th, Major 6th, Minor 7th, Major 7th, Octave. The correct and chosen buttons are recoloured (`updateIntervalButtonColors:isCorrect:correctIndex:`).
- **Chord Playback Recognition**: "Look at the chord name displayed below. Play the chord using the keyboard. The chord can be played in any octave." It checks by pitch class, not octave: it builds the pressed set modulo 12 and compares it with the target. The chord detector also runs on the input (`processChordResults:forInputMidiNumbers:`), and `isEnharmonicallyEquivalent:toTarget:` accepts a different root spelling (via a constant root-equivalence dictionary) when the chord type matches.
- **Chord Matching**: "Listen to the chord and watch the highlighted keys. Select the correct chord name from the grid below."

**Scoring** (**exact**): integer counters `correctAnswers` / `totalQuestions`. The label reads "Score: %ld / %ld", with "Success Rate: %.1f%%" (= correct ÷ total × 100). Then "Next Question" appears. Scores are **not persisted**. Buttons: "Start Quiz", "Stop Quiz", "Tap 'Start Quiz' to begin!".

The Learn Theory page sliders are "Use the slider to change note intervals by half-steps." and "Build a major/minor chord by stacking thirds." (Dyad / Root / 5th / 8th labels).

## 5. Composition practice aids
- **Capture Chords** ("Enable Capture Chords"): chords played live are added to the canvas automatically.
- **Chord Pads**: each chord in the progression is mapped to a single coloured key at the low end of the keyboard. "Play a whole chord with a single key press." The pads stay live in the Voicings panel. "Play on Keyboard" makes pads use the chosen chord pattern.
- **Launch Quantise** (`LaunchQuantizationViewController`): "Launch Quantise: chord %ld waits for the next %@".
- **Key Cycle**: practise a progression in all 12 keys (see THEORY_ENGINE §8).
- **Chord Charts**: a grid with piano snapshots of each chord. Printable (`ChordChartPrintOptionsViewController`, swatches `ChordChartSwatch`).
- **Lead sheet** window (`LeadsheetViewController`), "Only for 4/4 Time Signatures", with PDF export "Chordio Lead Sheet".
- **Musical Typing**: computer keyboard → notes, with velocity, sustain, pitch bend and modulation notifications. It has its own window scene.
