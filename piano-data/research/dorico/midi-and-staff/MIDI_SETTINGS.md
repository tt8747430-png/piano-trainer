# Dorico 6 MIDI settings: every one, with key, UI label and default

Sources:
- **App-wide preferences:** keys and values from `~/Library/Application Support/Steinberg/Dorico 6/preferences.xml` on this Mac. Dorico 6.2.31 was installed on 23 Oct 2026 and has barely been used, so these are effectively the factory defaults.
- **UI labels:** from the Preferences pages in the app binary (`preferences/play/*`, `preferences/noteinput/*`).
- **Project-level MIDI options:** from the Dorico 6 project defaults (`options/`).

Dorico splits MIDI into **app preferences** (per machine: devices, latency, thru, step-input timing, import) and **project options** (per score: click, count-in, pedal playback, chord input).

## MIDI input devices (Preferences › Play › MIDI Input Devices)

| Preference key | UI label | Default | Note |
|---|---|---|---|
| `playbackPreferences.enableMIDIInput` | Enable MIDI Input | `true` | Master switch for MIDI keyboards |
| `playbackPreferences.disabledInputDevices` | Device list (per-device on/off) | `` | Every connected input is listed with a tick box; unticked devices are stored here |
| `playbackPreferences.suspendMIDIInputInBackground` | Suspend when application is in background | `false` |  |
| `playbackPreferences.enableMIDIThru` | Enable MIDI thru | `true` | Incoming notes are sounded through the selected instrument |
| `playbackPreferences.filterMIDIControllerEvents` | Filter out MIDI controllers | `false` | Ignore CC messages from the keyboard |
| `playbackPreferences.midiInputLatencyCompensationMs` | MIDI input latency compensation (ms) | `0` | Shifts recorded MIDI earlier by this many ms |
| `playbackPreferences.enableWinRTMIDI` | Enable WinRT MIDI (Windows: required for Bluetooth MIDI) | `false` | "Bluetooth MIDI Devices..." button on macOS |
| `playbackPreferences.sendResetAllControllersOnStop` | Reset controllers and send 'all notes off' when stopping playback | `true` |  |

## Step-time (note input) from MIDI

| Preference key | UI label | Default | Note |
|---|---|---|---|
| `playbackPreferences.stepTimeChordDeadTimeMs` | Chord grouping window (ms) | `100` | Keys pressed within this time count as one chord in step input |
| `playbackPreferences.chordSymbolInputDeadTimeMs` | Chord-symbol MIDI input window (ms) | `100` | Same, when playing a chord into the chord-symbol popover |
| `playbackPreferences.midiLearnDeadTimeMs` | MIDI Learn window (ms) | `100` | For assigning MIDI notes/CCs to commands (Preferences › Key Commands › MIDI Learn) |
| `writePreferences.pitchBeforeDuration` | By default, specify pitch: Before Duration / After Duration | `false` |  |
| `writePreferences.noteParametersAfterCreation` | Specify accidental, rhythm dot and articulations: After inputting note / Before | `false` |  |
| `writePreferences.stickyForceDuration` | Preserve Force Duration state when stopping and restarting note input | `false` |  |
| `writePreferences.limitLockDurationJump` | Lock Duration: jump over rests only if closer than… | `false` |  |
| `writePreferences.maxLockDurationJumpInQuarterNotes` | …this many crotchets | `16` |  |

## Auditioning (hearing notes while editing)

| Preference key | UI label | Default | Note |
|---|---|---|---|
| `playbackPreferences.auditionNotesWhileEditing` | Play notes during note input and selection | `true` |  |
| `playbackPreferences.auditionAllNotesInChordWhenAnySelected` | Play all notes in chord when any is selected | `false` |  |
| `playbackPreferences.auditionNotesAtFixedDynamic` | Use fixed volume to play selected notes | `false` |  |
| `playbackPreferences.auditionFixedDynamicValue` | …fixed velocity | `100` |  |
| `writePreferences.auditionShadowNotePitch` | Play shadow notehead pitch (mouse input) | `false` |  |
| `writePreferences.auditionPitchCommandsInPitchBeforeDuration` | Play changes of shadow notehead pitch in pitch-before-duration input | `true` |  |

## MIDI file import (File › Import › MIDI: dialog defaults)

| Preference key | UI label | Default | Note |
|---|---|---|---|
| `midiImportPreferences.isGeneralMIDI` | File is General MIDI | `true` |  |
| `midiImportPreferences.drumsOnChannel10` | Drums on channel 10 | `true` |  |
| `midiImportPreferences.identifyInstrumentsFromProgramChanges` | Identify instruments from program changes | `false` |  |
| `midiImportPreferences.useMIDITrackNamesForInstruments` | Use track names for instruments | `true` |  |
| `midiImportPreferences.splitPointPitch2` | Split point for piano (left/right hand) | `` | empty = automatic |
| `midiImportPreferences.preserveVelocities` | Preserve note velocities | `false` |  |
| `midiImportPreferences.preserveOffsets` | Preserve note positions (offsets) | `true` | Keeps the played timing for playback while notating quantized |
| `midiImportPreferences.importPedalLines` | Import CC64 as pedal lines | `true` |  |
| `midiImportPreferences.snapPedalLinesToPreviousBeat` | Snap pedal lines to previous beat | `true` |  |
| `midiImportPreferences.mergePedalLines` | Merge pedal lines | `true` |  |
| `midiImportPreferences.importSlurs` | Detect slurs | `true` |  |
| `midiImportPreferences.inferKeySignature` | Infer key signature | `true` |  |
| `midiImportPreferences.detectTremolos` | Detect tremolos | `true` |  |
| `midiImportPreferences.detectTrills` | Detect trills | `true` |  |
| `midiImportPreferences.detectStaccato` | Detect staccato | `true` |  |
| `midiImportPreferences.annotateNotesWithArticulations` | Add articulations to notes | `true` |  |
| `midiImportPreferences.filterPitches` | Filter key-switch pitches | `false` |  |
| `midiImportPreferences.keySwitchLowFilter` | …below MIDI note | `34` |  |
| `midiImportPreferences.keySwitchHighFilter` | …above MIDI note | `96` |  |
| `midiImportPreferences.quantizeOptions.quantizationUnit` | Quantization unit | `list: {int: 6}, {int: 0}` | list {6,0} = LogDuration index 6 (kSemiQuaver) |
| `midiImportPreferences.quantizeOptions.importTuplets` | Detect tuplets | `true` |  |
| `midiImportPreferences.quantizeOptions.tupletQuantizationUnit` | Quantization unit for tuplets | `list: {int: 6}, {int: 0}` |  |
| `midiImportPreferences.quantizeOptions.fillGaps` | Fill gaps (extend notes to remove small rests) | `true` |  |
| `midiImportPreferences.quantizeOptions.importGraceNotes` | Detect grace notes | `true` |  |
| `midiImportPreferences.useExistingPlayers` | Import into existing players | `true` |  |
| `midiImportPreferences.createPartLayoutsForNewPlayers` | Create part layouts for new players | `true` |  |
| `tempoTrackImportPreferences.importTempos` | Import tempos | `true` |  |
| `tempoTrackImportPreferences.importTimeSignatures` | Import time signatures | `true` |  |
| `tempoTrackImportPreferences.importMarkers` | Import markers | `true` |  |

## Percussion input from MIDI

| Preference key | UI label | Default | Note |
|---|---|---|---|
| `writePreferences.percussionKitInputMethod` | Input onto kit or grid: use percussion map / staff position | `0` | 0 = percussion map |
| `writePreferences.startMIDIPitchForKitTechniques` | Input techniques from MIDI key (start) | `48` |  |
| `writePreferences.numberOfKeysForKitTechniques` | Number of keys for techniques | `12` |  |
| `writePreferences.basePitchForSingleLinePercussion` | Single-line staves: interpret pitches relative to | `60` |  |

## Transport, playhead and click (Preferences › Play)

| Preference key | UI label | Default | Note |
|---|---|---|---|
| `playbackPreferences.miniTransportDisplayType` | Default mini transport display | `2` | 0 elapsed time, 1 timecode, 2 bar.beat.tick |
| `playbackPreferences.scrollToFollowPlayHead` | Follow playhead | `true` |  |
| `playbackPreferences.showPlayHeadWhenStopped` | Show playhead when stopped | `false` |  |
| `playbackPreferences.playSelectionPlaysStaveOnly` | Play from selection only plays selected staves | `true` |  |
| `playbackPreferences.miniTransportPlayButtonPlaysFromSelectionIfAny` | Play button in mini transport plays from selection, if any | `false` |  |
| `coloursPreferences.playheadColour` | Playhead colour | `#11cc00` |  |
| `coloursPreferences.playheadRecordColour` | Playhead colour while recording | `#ff0000` |  |

## General: middle C and piano roll

| Preference key | UI label | Default | Note |
|---|---|---|---|
| `generalPreferences.middleCConventionInUI` | Middle C (note 60) is called | `1` | Enum `MiddleCConvention` with 3 values in the binary (`kC3`, `kC4`, `kC5`; buttons `c3Button`, `c4Button`, `c5Button`); the stored 1 is the second value = **C4** (scientific pitch, Dorico's default; C3 is the Yamaha convention) |
| `generalPreferences.displayNotatedDurationsInPianoRoll` | Default piano roll display: Played / Notated durations | `true` |  |
| `coloursPreferences.outOfStandardRangeColour` | Notes out of standard range colour | `#8b0000` |  |
| `coloursPreferences.outOfAdvancedRangeColour` | Notes out of advanced range colour | `#ff0000` |  |

## Project-level MIDI-related options (per score)

**playback (project) › clickAndCountInOptions**
- `enableClick = false`
- `numBarsCountIn = 1`
- `primaryBeatPitch = 83 (B5), velocity 64`
- `subsequentBeatPitch = 79 (G5), velocity 56`
- `beatSubdivisionPitch = 71 (B4), velocity 48`
- `useBeatSubdivisionsForCompoundTimeSigs = true; …ForRegularTimeSigs = false`
- `doricoBeepSound = kClickSound`

**playback (project) › pedalLinePlaybackOptions**
- `depressionLengthAt120BPM = 1/4`
- `retakeLengthAt120BPM = 1/2`
- `releaseLengthAt120BPM = 1/2`
- `sustainDepressedAfterNote = true`

**note input (project) › chordInputOptions (playing a chord on the keyboard into a chord symbol)**
- `allowChordsToBeInputViaMIDI = true`
- `allowModalChordsToBeInputViaMIDI = true`
- `chordSymbolMIDIInputNavigationBehaviour = kNextBeat (after a chord is played, the popover advances to the next beat)`
- `ignoreInversions = false; preferInversionsForSimpleChords = false`
- `chordInputSpellingPreference = kAllowAllRoots`

**note input (project) › noteInputSpellingOptions (spelling MIDI notes)**
- `midiNoteInputRootSpellingPreference = kDisallowBSharpAndESharpAndAllDoubles`
- `allowNotesToBeRespeltRetrospectively = true (a later note can respell an earlier one, e.g. to complete a chord)`

**note input (project) › noteInputPitchMode**
- `kWrittenPitch (MIDI pitches are interpreted as written pitch for transposing instruments when the layout is transposed)`

## Recording (Play mode) and MIDI learn
- **Recording:** Record, Retrospective Record (it recalls what you just played even without Record armed), Fixed Tempo Mode. The commands are `Play.Record`, `Play.RetrospectiveRecord`, `Play.FixedTempo` (see `../ui-flow/COMMANDS.md`).
- **Quantization preferences page** (`preferences/play/quantization`): widgets `detectTupletsCheckBox`, `fillGapsCheckBox`, `graceNotesCheckBox`, `preserveVelocityCheckBox`, `importPedalLinesCheckBox`, `detectSlursCheckBox`, `detectTremolosCheckBox`, `detectTrillsCheckBox`, with labels "Quantization unit:", "Quantization unit for tuplets:", "Preserve note positions", "Snap pedal lines to previous beat". The same quantize settings apply to live recording and MIDI import.
- **MIDI Learn** (Preferences › Key Commands): "Add MIDI Command" / "Remove MIDI Command" assigns a MIDI note or controller to any command. "MIDI Learn is only possible if you have a project loaded."
