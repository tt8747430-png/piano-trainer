# Practice and score following

Source: `/Applications/Metronaut.app` v9.0.3 (build 472), Mac Catalyst (`LC_BUILD_VERSION platform 6`, minos 16.0). Read statically. The app was not launched.

Legend: **exact** = read directly from a file or binary (cited). **inferred** = my interpretation of exact evidence.

---

## 1. Architecture of the follower

| Layer | Binary | What it is | Evidence |
|---|---|---|---|
| Antescofo core (C++) | statically linked into `AntescofoKit.framework` (the separate `AntescofoFramework.framework` and `anteaec.framework` are 84 KB stubs) | Score follower + real-time synchronous language interpreter ("antescofocore"). Source dirs `antescofocore/Src/{Base,Exp,Listening,RunTime,Tree}` | **exact**: `data/embedded_source_paths.json`; file sizes |
| ObjC bridge | `AntescofoKit` class `AntescofoIos2Core` | ~110 selectors (listed in §9) | **exact**: `nm` of AntescofoKit |
| Swift engine | `AntescofoKit.AntescofoEngine`, `AnteAudioEngine`, `AudioGraphController`, `AntescofoEngineIOManager` | AVAudioEngine graph, input routing, latency, recording, MIDI | **exact**: Swift metadata (`data/swift_types_app.json`) |
| Accompaniment logic script | `Resources/AppResources/AntescofoIncludes/actions.asco.txt` (346 lines) and `launch.asco.txt` (405 lines) | Antescofo-language scripts loaded with the score. They implement modes, the accompaniment process `$exe_pv`, pulses, fade-out, loops and tutoring messages | **exact** |
| App layer | `MetronautPreviewCoreKit`, `MetronautPreviewUIKit` (`PracticeCoachManager`, `PerformanceFeedbackEvaluator`, `ReadingPitchMatcher`) | Modes, scoring, feedback colours, wait mode matching | **exact** |
| Piano transcription model | `AntescofoKit.framework/Resources/oav_mobileamt.mlmodelc` (piano), `oav_mobileamt_gtr.mlmodelc` (guitar) | Core ML onset detector, used by `PianoPitchOnsetDetector` | **exact** |

The engine is fed by one of `AudioInputType { none, microphone, simulation, midi }` (**exact**, AntescofoKit). The bridge exposes `switchToAudioFollower` and `switchToMidiFollower` (**exact**). So audio and MIDI input use the same follower with a different front-end (**inferred**).

## 2. Audio front end

| Item | Value | Status |
|---|---|---|
| Graph nodes in `AudioGraphController` | `mixerNode`, `outputMixerNode`, `samplerNode` (AVAudioUnitSampler), `metronomeNode` (AVAudioPlayerNode), `timeStretchSourceNode`, `antescofoNode` (AVAudioSinkNode), `speechRecognitionNode`, `aecNode`, `synchronizedAECNode`, `aecAuxNode`, `simulationPlayer` | **exact** (field names) |
| Gains in graph | `playbackGain`, `microphoneGain`, `metronomeGain`, `samplerGain` | **exact** |
| Analysis | `antescofo_nfft`, `antescofo_nhop` (follower FFT), `pitchDetector_nfft`, `pitchDetector_nhop` (pitch feedback), `AudioConfig.antescofoAnalysisParameters: (nfft, hop)` | **exact** names; numeric values not recovered |
| Core log format | `"%sAnalysis Parameters: nfft=%i, hop=%i (resolution %.1fHz)"`; `"nfft must be a power of two"` | **exact** (AntescofoKit strings) |
| `AudioConfig` fields | `ztxBufferSize, audioBufferSizeDefault, audioBufferSizeLowLatency, decodeWindow, defautlLinearInputGain, defaultLatencyDuration, echoSuppression, dynamicQuadStereo, antescofoAnalysisParameters, aecInternalProfile, aecPostFilterStrengths, oliveAECIntegrationMode` | **exact** |
| `AudioConfig` defaults | chosen per device model string (`UIDevice.current` identifier compared with `iPad5,1`, `iPhone3,1` … lists). Default branch: `ztxBufferSize = 1024`, low-latency buffer `512`, `decodeWindow = 21`, `defautlLinearInputGain = 1.0`, `defaultLatencyDuration = 0.1` s. Older-device branch: buffers `128` / `256`. | **exact** constants from disassembly at AntescofoKit `0xcd150`; field-to-constant mapping **inferred** from store offsets |
| Echo cancellation | `EchoCancellationType { none, VPIO, OliveAEC }`; `OliveAECIntegrationMode { legacy, synchronized }`; `AECPostFilterStrengths { res, ns }`; recording post-process `echoCancelSoloRecording(...)` | **exact** |
| Input sources | `DefaultInput { midi(device, synthesize), microphone(portuid, datasourceid, polarpattern), microphoneMacOS(id) }` persisted in `antescofo_defaultconnection.json` | **exact** |
| Mic hardware list | `MicrophoneElement { id, dataSourceDescription, name, polarPattern, selected, isDefault }` | **exact** |
| Output classes | `AudioOutputType { speaker, headphones, bluetooth, usbaudio, airplay, other }` | **exact** |

## 3. Core follower parameters (Antescofo commands)

Set in `actions.asco.txt` and `launch.asco.txt` (**exact**):

| Command | Value at load | Meaning (**inferred** unless noted) |
|---|---|---|
| `antescofo::gamma` | `-1` | Observation weighting. During long rests it is set to `-0.01` and restored to `-1` (see §6). |
| `antescofo::preventzigzag` | `"off"` (on in Coach) | Prevent the position from jumping back and forth. |
| `antescofo::decodewindow` | `42` at load; per-mode 30/20/10 | Size of the HMM decoding window (events). |
| `;antescofo::calibration_mode 2` | commented out. Comment: `0=old, 1=new (Arshia), 2 = spectral flatness ()` | **exact** comment |
| `antescofo::tempo_limitation` | 0, or 1 in note-by-note | Clamp the tempo estimate. |
| `antescofo::tempo_estimation` | 0 or 1 per mode | Whether the musician tempo is estimated. |
| `antescofo::variance` | 0.3 (follow modes), 0.2 (coach, note-by-note) | Observation variance. Core message: `"Observation variance should be a percentage factor, between 0 and 1."` (**exact**) |
| `antescofo::reset_musician_tempo` | on modes 1 and 2 | Reset tempo to score tempo. |
| Other core commands seen in strings | `bypass_temporeset` ("Fully progressive mode (no tempo reset)" / "Limited progressive mode (reset tempo in absence of events)"), `temposmoothness`, `tempo_alpha`, `calibrate`, `tempo_coef`, `musician_tempo`, `musician_tempo_from_markers`, `pulse`, `audioscrub`, `mute`, `unmute`, `stop` | **exact** names |

Default script variables (**exact**, `actions.asco.txt`):

| Variable | Default |
|---|---|
| `$metronomicTempo` | `1` (comment: "par défaut, c'est le score tempo qui est utilisé") |
| `$default_latency` | `50` (ms) |
| `$default_target` | `5` |
| `$default_anticipation` | `"progressive"` |
| `$target_mode1` | `0.1` |
| `$target_mode2` | `0.1` |
| `$target_mode3` | `10` |
| `$target_mode4` | `5` |
| `$target_mode5` | `10` |
| `$target_mode6` | `5` |
| `$target_mode8` | `9999` |
| `$target_mode9` | `0.1` |
| `$catch_up_type` | `"i_QUAD_IN"` (alternative commented: `"i_LINEAR"`) |

The accompaniment group uses `@temporalscope := $map_sync` where `$map_sync = MAP{ "target_window_rel": $target, "anticipation": $anticipation, "latency_ms": $latency, "catch_up_type": $catch_up_type }` (**exact**). This is Antescofo's "target" synchronisation strategy: the accompaniment converges to the musician's position over a relative window of `$target` beats, with a quadratic-in catch-up curve (**inferred** from Antescofo semantics).

## 4. Performance modes

### 4.1 Engine modes (`AntescofoKit.PerformanceMode`, raw `Int` = `$iosMode`)

Raw values read from the table at AntescofoKit `0x32c038` (**exact**). Script behaviour from `actions.asco.txt` (**exact**).

| Case | `$iosMode` | Script comment | decodewindow | tempo_estimation | tempo_limitation | target | anticipation | metronomicTempo | tight positions | variance | preventzigzag |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `playback` | 1 | "Playback (with Solo)" | – | – | 0 | `$target_mode1` = 0.1 | – | 0 | first only | – | – |
| `playbackmetronomic` | 2 | "playback with metronomic tempo" | – | – | 0 | `$target_mode2` = 0.1 | – | 1 | first only | – | – |
| `playbackRecording` | 10 | "playback with recording (non metronomic)" | – | – | 0 | `$target_mode1` = 0.1 | – | 0 | first only | – | – |
| `follow` | 3 | ".follow1" | 30 | 0 | 0 | `$target_mode3` = 10 | progressive | 0 | all | 0.3 | off |
| `follow2` | 4 | ".follow2" | 30 | 1 | 0 | `$target_mode4` = 5 | progressive | 0 | all | 0.3 | off |
| `follow3` | 5 | (none) | 30 | 1 | 0 | `$target_mode5` = 10 | progressive (comment: was "conservative_no_sil") | 0 | all | 0.3 | off |
| `follow4` | 6 | (none) | 30 | 1 | 0 | `$target_mode5` = 10 | progressive | 0 | all | 0.3 | off |
| (OSC receiver) | 7 | "OSC receiver begin" | – | – | – | – | – | – | – | – | off |
| `coach1` | 8 | "Coach1 (with playback that does not adapt)" | 20 | 0 | 0 | `$target_mode8` = 9999 | progressive | 0 | first only | 0.2 | **on** |
| `notebynote` | 9 | "Note à note" | 10 | 1 | 1 | `$target_mode9` = 0.1 | conservative | 0 | all | 0.2 | off |
| `reading` | 11 | no case in script | – | – | – | – | – | – | – | – | – |

Notes:
- "tight positions" = `$tab_tight_pos_used`. "first only" means the accompaniment starts once and then runs on its own clock. "all" means the accompaniment re-synchronises at every tight position (**exact** assignments; meaning **inferred**).
- `target_mode8 = 9999` means the Coach accompaniment never adapts to the player (**inferred**, matches the comment).
- For every mode except 7 the script sends `osc_mode $iosMode` (**exact**).

### 4.2 User-facing modes (`Core.MetronautPerformancePlayingMode`)

Cases in declaration order: `reading`, `coach`, `withSolo`, `playAlong`, `magicPlayAlong` (**exact**). Labels from `en.lproj/Localizable.strings` (**exact**):

| Case | Current title (`mode.*.title`) | Subtitle | Tempo-panel name (`tempo.*`) | Older names (`*.obsolete`) |
|---|---|---|---|---|
| `reading` | "Sight-reading" | "Play without accompaniment" | "Wait" — "The cursor moves along with you, with no accompaniment." | "Note by Note Mode" |
| `coach` | "Training" | "Evaluate your rhythmic accuracy with accompaniment" | "AI Feedback" — "Visualize your pitch and rhythm precision." / "Train with feedback" "Only with fixed tempo" | "Coach Mode" |
| `withSolo` | "Listening" | "Listen to your part and accompaniment" | – | "Listening Mode" |
| `playAlong` | "Performing" | "Play with the accompaniment" | "Fixed" — "Accompaniment plays at a fixed tempo." | "Play Along Mode" |
| `magicPlayAlong` | "Magic Performing" | "Accompaniment adapts to your tempo" | "AI Tempo" — "The accompaniment follows your performance like a real musician." | "Magic Play Along Mode" |

The newer mode sheet uses another set (`performance.mode.*`, **exact**): "Listen" (Familiarize yourself with the piece before playing), "Practice" (Practice along with the accompaniment / at a steady tempo), "Interpret (AI Tempo)", "Sight-read" (The cursor advances when you play the right note or chord). Voice variant: "Sing", "Sing with accompaniment".

Mode properties, from the getters in `Core.framework` (**exact** disassembly; index 0..4 = order above):

| Getter | True for | Address |
|---|---|---|
| `isMagicModeEnabled` | magicPlayAlong | `0xa2448` |
| `isAccompanimentEnabled(isMultiTrack:)` | multitrack AND mode ≠ reading | `0xa2458` |
| `isMixerEnabled(isMultiTrack:)` | multitrack AND withSolo | `0xa2468` |
| `forcedCursorMode` | reading → `CursorMode` raw 2 (`continuous`); others → nil | `0xa247c` |
| `isCoachModeEnabled` | withSolo (raw 2). Name and behaviour disagree; see note | `0xa2490` |
| `isListeningMode` | reading, coach, magicPlayAlong (all modes where the app listens to the player) | `0xa24a0` |
| `usesScoreFollower` | coach, magicPlayAlong | `0xa24b0` |
| `calculateScoresPerformance` | every mode except withSolo | `0xa24c4` |
| `calculatePenalty` | reading, coach, magicPlayAlong (bitmask `0x13`) | `0xa24d4` |
| `detectionWarningEnabled` | magicPlayAlong | `0xa24f0` |
| `resolvedTransportMode` | coach → playAlong; others unchanged | `0xa0948` |

Note: `isCoachModeEnabled` returns true only for raw index 2. I report the code as found. A likely reading is that "coach" here means "the coach reference player is available" (`MetronautPerformancePlayerStatus.coachReferencePlayer(startPos:endPos:)`), which is a listening action (**inferred**).

Mapping user mode → engine mode is **inferred** from strings and the scripts:
- `withSolo` → `playback` (1).
- `playAlong` → `playback` (1) or `playbackmetronomic` (2) when "Constant Tempo" (`performance.tempo.metronomicLabel`) is on.
- `magicPlayAlong` → `follow2` (4). String `rewardAction.PerformanceModeFollow2` = "First use of Magic Mode"; `rewardAction.PerformanceModeFollow` = "First use of Tempo regulator"; `rewardAction.PerformanceModeMetro` = "First use of Metronomic Tempo".
- `coach` → `coach1` (8).
- `reading` → `notebynote` (9) or `reading` (11). The bridge has separate entry points `startNoteByNoteFromBeatPosition:waitForUser:` and `startReadingMarkerSessionFromBeatPosition:waitForUser:` (**exact**).

### 4.3 Hands separate

- `Core.PerformanceHands { right, left, both }` (**exact**).
- `MetronautPerformanceHandsContext { currentHandsSettingsMode, accompanimentIdForHand: [Hand: Int] }` (**exact**). Each hand choice selects a different accompaniment recording ID (**inferred**: the catalogue has "Left Hand" / "Right Hand" part kinds, `part.6` = "Right Hand", `part.7` = "Left Hand", `part.12` = "Both Hands").
- UI strings (**exact**): "Choose which hand to play"; "Play the left hand" → "Metronaut will play the right hand"; "Play the right hand" → "Metronaut will play the left hand"; "Play both hands" → popup "Play both hands without accompaniment. Tap 👂 to hear the piece." Listen buttons: "Hear both hands", "Hear left hand", "Hear right hand".

### 4.4 Wait mode / sight-reading (note-by-note)

- Cursor advances only when the expected note or chord is played: `performance.mode.reading.description` = "The cursor advances when you play the right note or chord." (**exact**).
- App-side matcher (**exact** types, `MetronautPreviewUIKit`): `ReadingScoreOnsetEvent { beatPosition, pitches: Set, staves: Set }`, `ReadingScoreOnsetIndex { events }`, `ReadingPitchMatcher { target, matchedPitches }`, `ReadingPitchMatchResult { target, uniquePitches, correctPitches, matchedPitches, shouldAdvance }`.
- `PracticeCoachManager` fields (**exact**): `readingMIDIPitchBuffer`, `readingMIDIBatchWorkItem` (MIDI notes are batched before matching a chord), `readingAudioSuppressedPitch`, `readingAudioLastEventTime`, `readingAudioSuppressFeedbackUntil`, `readingRecentlyAcceptedTarget`, `readingRecentlyAcceptedAt`, `readingAudioWrongFeedbackTargetBeats`, `readingAudioPendingWrongFeedback { target, targetBeat, pitch, workItem }` (wrong-note feedback is delayed and can be cancelled), `readingTargetArmedAt`.
- Core bridge: `getCorrectnessForPitch:atPosition:`, `getOnsetCorrectnessForPitch:atPosition:matchedEventBeat:`, `getClosestOnsetPitchlistOnPosition:matchedEventBeat:`, `getPitchlistOnPosition:`, `recordAcceptedReadingEvent(at:)` (**exact**).
- Algorithm (**inferred**): build an onset index from the score; arm the next target; collect MIDI notes in a short batch, or audio onsets; advance when all target pitches are matched (`shouldAdvance`); show red only after a delay if no correct match arrives; suppress repeat feedback for the same pitch.

### 4.5 Rhythm game (tap mode)

- `PieceOption.rhythmGame`, `PerformanceBarEnum.tap_rhythm`, `PerformanceAction.rhythmTap`, bridge `tapEvent()`, `set_tapGame:`, `updateTapWithAccompanimentPosition:` (**exact**).
- Strings (**exact**): "Rhythm Game" — "Practice even without your instrument and watch your score increase as you progress."; `rhythmGame.tap` = "Tap here 👇 to play notes when cursor reaches them"; `exploration.feature.rhythmgame.summary.subtitle` = "Practice without instrument in this interactive game. Tap the button as the cursor reaches each note and get familiar with the rhythm of a piece."; `alert.tapgame.synthwarning.summary` = "To avoid delays when using wireless audio output, sound generated by your taps are disabled."
- Score stored separately: `maxRhythmGameScore`, `isInRhythmGame` (**exact**).

### 4.6 Loops

- Script: when `$action_pos` reaches `$endLoop` (tolerance `0.05` beat) the script sends `iosMessage "completedLoop"` (**exact**, `launch.asco.txt`). `$endLoop` defaults to `999999` (**exact**).
- Swift: `AntescofoEngine.setLoopEnd(loopEnd:)`, `endLoopPosition`, `completedLoop` publisher; `FeedbackTransportState.loopCompleted` (**exact**).
- Stored per piece: `loopStatus`, `loopStart`, `loopEnd` (beats). Defaults `false`, `0.0`, `4.0` (**exact**, `Core.DefaultAccompanimentPreferences.init` at Core `0xace0c`, constants at `0x102d10`).
- Older persisted form: `loopBeginMeasure`, `loopBeginPulsation`, `loopEndMeasure`, `loopEndPulsation` (**exact**, `Core.PerformancePreferences`).
- UI rules (**exact** strings): "Loop activated: In this mode the music sheet scroll is continuous." and "Recording is disabled while Loop is on." Loop edit: "Select a measure and adjust the loop by dragging the arrows." Loop handles are drawn by `GuidoKit.GuidoKitScoreSellector` with `Arrow { direction: up/down/left/right }` and `PanManager.PanLoopKind { panBegin, panEnd, panNew, panIn }` (**exact**).

### 4.7 Tempo change

- Tempo is a percentage of score tempo: `performance.tempoFormat` = "Tempo %.0f%%"; `performance.Tempo` = "Tempo (%)" (**exact**).
- Stored as `tempoCoef`, default `100.0` (**exact**, `DefaultAccompanimentPreferences`).
- Slider: `TempoSliderUIView { tempo, tempoArray: [Int], isLockedAt100, lockThresholdLower, lockThresholdUpper, unlockThresholdLower, unlockThresholdUpper }` (**exact**). The slider snaps ("locks") to 100 % inside a threshold band and releases outside a wider band (**inferred** from names). Numeric values not recovered.
- Voice commands change tempo by 10 %: "Increase tempo by 10%", "Decrease tempo by 10%" (**exact**).
- Engine: `set_global_tempo_coef:`, `set_ratio_tempo_coef:`, `get_ratio_tempo_coef`, `getIdealBpm(_:)`, `getIdealBpmWithoutCoef(_:)` (**exact**). Pitch is preserved by a time-stretcher `AnteAudioTimeStretch` ("zTX", `antescofo::audioscrub`) (**exact** names).
- Tempo regulator (Magic mode): `settings.tempoRegulator.footerTitle` = "In Magic Mode the tempo regulator helps you maintaining the original tempo." (**exact**).

### 4.8 Training mode in guided workouts

- `Core.WorkoutStepState { practice, training }` (**exact**).
- Strings (**exact**): "Training mode allows you to play at a slower tempo until you're ready to beat your best score!"; success: "Sounds like you've got it! Try leaving the training mode and beating your best score."; step fail: "Score above %u%% to validate this step." The pass percentage `%u` is supplied at runtime (not found statically).

## 5. Accompaniment process (launch.asco.txt), step by step

All **exact** from `launch.asco.txt`; interpretation in plain words.

1. `::start_exe_pv()` creates group `$exe_pv` with `@temporalscope := $map_sync` and `@latency := $latency ms`. It runs `::pulse_loop_exe()` and `::fadeout_exe()`. It sends `iosMessage "exe_pv_recreated"` each time.
2. `::pulse_loop_exe()` computes the time to the next pulse from `$pulse_phase_nim` / `$pulses_nim` (NIM = interpolated map). It loops every pulse and sends `antescofo::pulse (pulse duration)` while `action_pos < $endLoop`. Minimum period `0.1` beat if the pulse is shorter than `0.05` ("do not allow zero period for the loop or we'll have memory issues"). These pulses drive the metronome and the beat cursor (**inferred**).
3. `::fadeout_exe()` fires on `$fadeoutPos`. It starts the fade `0.2 s` before the position, converted to beats with the ideal tempo times the tempo ratio, and sends `iosMessage "fadeout" 0.1`. If the computed delay is ≤ 0 it uses the raw beat distance ("Sometimes the tempo returned is erroneously too high (bug Core)").
4. User activity: when `$USERACTIVITY ≥ 0.6` → `iosMessage "userIsPlaying" 1.0`. When it drops below `0.4`, after `5 s` → `iosMessage "userIsPlaying" 0.0`. Hysteresis 0.4/0.6.
5. Silence handling: `::manage_gamma_during_silences()` — for gaps without notes of at least `2` beats it sets `antescofo::gamma -0.01` from `0.5` beat after the gap starts until `1` beat before the next note, then back to `-1`.
6. Tight loop: from the first tight position, every tight position aborts and recreates `$exe_pv`, scrubs the audio (`antescofo::audioscrub $RNOW -200`), and starts a watchdog `stop_exe_by_accomp`. If the accompaniment reaches ¾ of the way to the next tight position before the musician (minus `stopAnticipation = (0.1 + latency/1000) × RT_TEMPO / 60` when not playing), the accompaniment is stopped (`::stop_exe_pv()` → tempo 0) and waits. This is how the accompaniment "waits for the musician" at sync points.
7. On each recognised event (`whenever($BEAT_POS)` with `$DURATION > 0`): send `iosMessage "tutoring_diff_mus" ($RCNOW − $action_pos) $BEAT_POS` (musician vs accompaniment distance in beats), and `"missed_event"` if a non-silence event was skipped.
8. `::propagate_when_acc_reach_detected_events()` sends `"tutoring_diff_acc"` (accompaniment vs musician distance) at each upcoming non-silent event.
9. In Coach only (`$iosMode == 8`), `::propagate_when_acc_reach_event()` sends `"tutoring_pos_acc" $action_pos` at each event including rests. Comment: "used only in COACH mode (excluding Rhythm Game) to drive PianoUI".
10. End: `(@score_duration()+1.0) antescofo::stop`.

Messages from script to app (`iosMessage`), **exact** list: `exe_pv_recreated`, `fadeout`, `userIsPlaying`, `tutoring_diff_acc`, `tutoring_diff_mus`, `tutoring_pos_acc`, `missed_event`, `completedLoop`.

## 6. Recognition log

`actions.asco.txt` keeps `$tab_reco` rows `[time_onset, BEAT_POS, RT_TEMPO, PITCH]` and a NIM `$nim_reco` of first-time onsets. `::save_log($path_file)` dumps `$nim_simul`, `$tab_reco` and the `$iosMode` history. `::load_log` reloads it (**exact**). The app replays a performance from this log (`SimulationProvider`, `RenderingMode.simulator`, `RecognitionTable { table, endBeatPosition }`) to sync recordings with the score (**exact** types; purpose **inferred**).

## 7. Real-time feedback and scoring

### 7.1 Timing class (`MetronautPreviewCoreKit.PracticeScoreLevel`)

Cases: `veryEarly`, `early`, `perfect`, `late`, `veryLate`. `init(diff:withSeverity:)` at PreviewCoreKit `0x38008` (**exact**):

| `withSeverity` | veryEarly | early | perfect | late | veryLate |
|---|---|---|---|---|---|
| true | diff > 0.2 | 0.1 < diff ≤ 0.2 | −0.1 < diff ≤ 0.1 | −0.2 < diff ≤ −0.1 | diff ≤ −0.2 |
| false | diff > 0.5 | 0.25 < diff ≤ 0.5 | −0.25 < diff ≤ 0.25 | −0.5 < diff ≤ −0.25 | diff ≤ −0.5 |

Units of `diff` are beats (**inferred**: it comes from `tutoring_diff_mus`, a beat difference). Positive = early.

Penalty per event, `getScorePenalty(withSeverity:)` tables at `0x50d18` / `0x50d40` (**exact**):

| `withSeverity` | veryEarly | early | perfect | late | veryLate |
|---|---|---|---|---|---|
| true | 1.0 | 0.5 | 0.0 | 0.3 | 1.0 |
| false | 0.66 | 0.33 | 0.0 | 0.33 | 0.66 |

Colours, `getColor` at `0x38310` (**exact** RGBA):

| Level | RGB (0–1) | Hex | UI word (`coach.RTfeedback.*`) |
|---|---|---|---|
| veryEarly, early | 0.97, 0.44, 0.15 | `#F87026` | "Early" / "A bit early" |
| perfect | 0.00, 0.54, 0.43 | `#008A6E` | "On time" |
| late, veryLate | 0.21, 0.69, 0.97 | `#36B0F7` | "A bit late" / "Late" |

End-of-session words (**exact**): `coach.endFeedback.fast` "Early", `.slow` "Late", `.generic` "Fuzzy". Live: `coach.playingOnTime` "On time", `coach.playingTooFast` "Early", `coach.playingTooSlow` "Late". Event enum `MetronautPerformanceCoachPlayingEvent { late, ontime, fast }` (**exact**).

### 7.2 Score formula (`PracticeScore.computeScore(on:withPenalty:)` at `0xd5e8`)

Struct layout: `startPosition, scoreDuration, penalities, eventCount, lastPracticeScore, maximumScore, lastPosition` (**exact**).

```
startNewPerf(startPos, scoreDur, lastScore):
  startPosition = startPos; scoreDuration = scoreDur
  penalities = 0; eventCount = 0; lastPracticeScore = lastScore
  lastPosition = startPos - 1

computeScore(pos, penalty):
  if scoreDuration == 0 or pos <= lastPosition: return nil
  lastPosition = pos
  penalities += penalty; eventCount += 1
  progress = (pos - startPosition) / scoreDuration
  accuracy = 1 - penalities / eventCount
  s = ceil(maximumScore * progress * accuracy)
  if s > 0.96 * maximumScore: s = maximumScore
  if s < 0: s = 0
  return Int(s)
```

All constants **exact** (`0.96` = `0x3FEEB851EB851EB8`). `maximumScore` is not set in `startNewPerf`; it is 100 in practice (**inferred** from "Score above %u%%").

### 7.3 Practice zones

`PracticeZoneType { slow, fast, irregular, missed, none }` and `PracticeZone { beginBeatPos, endBeatPos, type }` (**exact**). Zone background colours, `zoneBackgroundColor` at `0x37970` (**exact**, alpha 1.0 before any view alpha):

| Zone | RGB | Hex |
|---|---|---|
| slow | 0.21, 0.69, 0.97 | `#36B0F7` |
| fast | 0.97, 0.44, 0.15 | `#F87026` |
| irregular, missed, none | 1.00, 0.75, 0.00 | `#FFBF00` |

GuidoKit draws them: `GuidoKit.PracticeZone { begin, end, comment: NSAttributedString, bgColor }`, `GuidoKitPracticeHelper { zoneStorage, missedStorage, practiceHighlightLayer, practiceCommentLayer, practiceRTFeedbackLayer, pitchFeedbackLayer, pianoOnsetFeedbackLayer, feedbackTimer: CADisplayLink }` (**exact**).

### 7.4 Pitch and onset feedback

- `PitchFeedbackStyle { pitchTolerance, interpolation }`, `FeedbackGradientInterpolation { linear, binary, lenient, harsh, jose1, jose2, jose3, jose4 }`, `PitchZone { refPitch, refPos, diffPos, lineWidth, correctPitchColor, wrongPitchColor, correct }` (**exact**, GuidoKit). The score shows a line per note whose colour runs from correct to wrong according to cents deviation (**inferred**).
- `PianoOnsetFeedbackLayer { markerStorage, markerLayers, correctColor, wrongColor }`, `OnsetMarker { pitch, beatPosition, correctness, anchorsToScoreEvent, fadeAfter }` (**exact**).
- `PerformanceFeedbackEvaluator.observePianoOnset(pitch:atAudioTime:drawingAt:inferredTransportAudioTime:rhythmicToleranceSeconds:pitchTolerance:probability:activePitchesAtInferredPosition:scorePositionForAudioTime:)` and `advance(to:rhythmicToleranceBeats:)` → `[PerformanceFeedbackEvaluation { onset, observedPitch, observedBeatPosition, observedAudioPositionSeconds, expectedAudioPositionSeconds, expectedPitch, correctness, missed, finalizesScore, scorePenalty }]` (**exact** signatures).
- Feature gate: `isFeedbackAIInstrumentSupported`; headphones advised: "For best experience using AI Feedback prefer using headphones." (**exact**).

### 7.5 Piano onset model (Core ML)

From `oav_mobileamt.mlmodelc/metadata.json` (**exact**):

| Field | Value |
|---|---|
| Inputs | `log_mel_frames` Float32 [1,1,229,9]; `hidden_in_1` [1,1,256]; `hidden_in_2` [1,1,256] |
| Outputs | `onset_probs` Float32 [1,1,88]; `hidden_out_1` [1,1,256]; `hidden_out_2` [1,1,256] |
| Ops | Conv 21, Relu 15, Add 8, Linear 6, Mul 6, Cast 6, Sigmoid 5, Split 4, Tanh 2, Sub 2, Transpose 1, Reshape 1 |
| Precision | storage Float16, compute mixed |
| Origin | coremltools 8.3.0 from TorchScript, torch 2.4.1 |
| Availability | iOS 15, macOS 12, Mac Catalyst 15 |

So: 229-bin log-mel spectrogram, 9-frame context, a stateful (two 256-d hidden states, GRU/LSTM-like) network that outputs onset probability for the 88 piano keys per frame (**inferred**). The guitar variant (`_gtr`) is selected by `PianoOnsetModel { piano, guitar }` (**exact**). Detector plumbing: `PianoPitchOnsetDetector` with a ring buffer, `LinearResampler`, worker queue, `PianoOnsetEvent { midi, onsetMs, probability, ageMs, exeElapsedMs, exePvGeneration, feedbackAudioPositionSeconds, feedbackTransportPosition }` (**exact**).

## 8. Latency compensation

- `LatencyValues { audioSessionInputLatency, audioSessionOutputLatency, estimatedLatency, estimatedLatencyStdDev, isEstimatedLatencyReliable, userAddedLatency, isBluetoothHeadphone }` stored per output port UID (`latencyValuesByOutput`) (**exact**).
- Separate `cursorLatency` and `engineLatency` (**exact**).
- UI (**exact**): "Synchronize audio with the animation. If audio is late, increase the latency." Settings → Expert Settings → Audio Output: "Choose Wireless Audio Output when available, and adjust the delay between audio and cursor."
- Script uses `$latency` (default 50 ms) in `@latency` of each group (**exact**).

## 9. Bridge API (`AntescofoIos2Core` selectors, **exact**)

`antesc`, `antescofo_midi_align`, `antescofo_next_frame:`, `antescofo_next_frame_wSize:inNumberFrame:`, `antescofo_next_frame_wSize_and_feedback:inNumberFrame:feedback:`, `antescofo_rt_midi:velocity:`, `call_user_proc:arg:`, `completed_loop`, `exe_pv_recreated:`, `fadeout:`, `findNextNonSilentEventAt:`, `get_current_bpm`, `get_del_pos:ExeName:`, `get_exe_pos_at_elapsed_time:ExeName:`, `get_global_coef`, `get_GlobalTransposition`, `get_ideal_bpm:`, `get_ideal_position_init:`, `get_ideal_time_init:`, `get_inputAudioGain`, `get_nim_key_init:nimName:`, `get_nim_pos_and_speed:usingSameNimAsPerformance:`, `get_nim_speed_simplified:usingSameNimAsPerformance:`, `get_nim_speed:nimName:ExeName:usingSameNimAsPerformance:`, `get_nim_val_init:nimName:`, `get_nim_val_simplified`, `get_nim_val:ExeName:`, `get_ratio_tempo_coef`, `get_recognition_table`, `get_rnow`, `get_tapGame`, `get_verbosity`, `getClosestOnsetPitchlistOnAudioPosition:matchedEventBeat:matchedEventAudioPosition:`, `getClosestOnsetPitchlistOnPosition:matchedEventBeat:`, `getCorrectnessForPitch:atPosition:`, `getOnsetCorrectnessForPitch:atPosition:`, `getOnsetCorrectnessForPitch:atPosition:matchedEventBeat:`, `getPitchlistOnPosition:`, `getPitchRangeWithMin:max:`, `hasValidScore`, `is_calibrate_on`, `is_fastforward`, `is_following_on`, `is_playing_on`, `is_waiting`, `lastBeatPosition`, `lastBeatPositionBefore:`, `load:noSilenceMode:withDummySilence:`, `missed_event:`, `musician_tempo_from_markers:`, `nextEvent`, `pause`, `play_string:`, `playFromBeatPosition:`, `propagateEventStatus:`, `propagateStop`, `propagateTimeStatus:`, `reanchorPianoFeedbackForPlayback`, `reset_musician_tempo`, `resumePlay`, `send_activePitchList:`, `send_beatPos:`, `send_calibration:`, `send_currentLabel:`, `send_message:`, `send_midi:::`, `send_pulse:`, `send_timeStretch::`, `set_analysis_parameter:hopsize:samleRate:blockSize:`, `set_blockSize:`, `set_calibrate:`, `set_calibrateMode:`, `set_global_tempo_coef:`, `set_includePath:`, `set_inputAudioGain:`, `set_position:`, `set_ratio_tempo_coef:`, `set_sampleRate:`, `set_suivi:`, `set_tapGame:`, `set_tempo:`, `set_tuning:`, `set_user_var:value:`, `set_verbosity:`, `startCoachFromBeatPosition:waitForUser:`, `startFollowingFromBeatPosition:waitForUser:`, `startFromBeatPosition:waitForUser:`, `startNoteByNoteFromBeatPosition:waitForUser:`, `startReadingMarkerSessionFromBeatPosition:waitForUser:`, `stop`, `switchToAudioFollower`, `switchToMidiFollower`, `tempoEstimation:`, `transposeScore:`, `tutoring_diff_acc:`, `tutoring_diff_mus:pos:`, `tutoring_pos_acc:`, `updateTapWithAccompanimentPosition:`, `user_activity:`.

`AntescofoEngine` public Swift methods (**exact**) include: `loadPiece(_:identifier:antescofoScore:accompanimentAudioURL:accompanimentAudioRemoteURL:soloAudioURL:soloAudioRemoteURL:tuning_reference:previewEndBeatPosition:completion:)`, `start(position:with:waitForUser:withRecording:graphResolutionPolicy:)`, `start(scorePosition:...)`, `stop(clearGraphRecordingIntent:completion:)`, `change(mode:graphResolutionPolicy:)`, `setPosition(position:)`, `setScoreLimits(startBeatPosition:endBeatPosition:)`, `setLoopEnd(loopEnd:)`, `setSuivi(isOn:)`, `playReference(from:to:)`, `startMetronome()`, `beginTunerAnalysis()`, `endTunerAnalysis()`, `setPianoOnsetModel(_:)`, `setPerformanceAnalysisInputRequired(_:usesPianoOnsetDetector:usesPianoOnsetAECPostFilter:)`, `feedbackAudioTime(forScorePosition:)`, `feedbackScorePosition(forAudioTime:)`, `getPitchlist(on:)`, `getPitchRange()`, `getPulse(_:)`, `getPhase(_:)`, `MIDIInputEvent(_:)`, `tapEvent()`, speech-recognition and camera helpers.

Published streams on `AntescofoEngine` (**exact**): `beatPosition`, `pulsePositionAndDuration`, `pulseData`, `reachedEnd`, `completedLoop`, `userIsPlaying`, `emergencyStop`, `tutoringDiffMus`, `tutoringDiffAcc`, `userDistanceFromAccompaniment`, `tapDistanceFromAccompaniment`, `missedEvent`, `ratioTempoCoef`, `microphoneFeedbackStatus`, `calibration`, `activePitches`, `readingPianoOnsets`, `readingMIDINoteOn`, `readingAudioPitches`, `simulationCurrentTime`, `bufferingState`.

## 10. Player states and on-screen messages

- `MetronautPerformancePlayerStatus { coachReferencePlayer(startPos, endPos), playing, paused, buffering, countdown }` (**exact**).
- `PerformanceControllerAppearance { loading, playing, paused, buffering, countdown, annotation, error }` (**exact**).
- Waiting message (**exact**): "I am listening…" + "Start playing when you are ready." Freeze: "Are you there?" / "Metronaut is waiting for you…". Instability: "Oops…" / "Something went wrong! Restart?"
- `UserMessageUIViewEnum` (all cases, **exact**): `bestCoachScore(value)`, `changeVersion(message)`, `restoreVersion(message)`, `rec(mode, explicit)`, `midiConnected(device)`, `midiDisconnected(device)`, `tempoChanged(value)`, `volumeChanged(value)`, `exploration(features, fromPerf)`, `pressStart`, `pressStartRecording`, `waitingUserToStart`, `listeningMode`, `performanceModeWithSolo`, `performanceModeReading`, `performanceModePlayAlong`, `performanceModeMagicPlayAlong`, `performanceModeMagicPlayAlongSolo`, `maxVolume`, `countdown`, `countdownWithVolume`, `coachDetection`, `sightReadingDetection`, `stopAlert`, `scoreAdaptation`, `lowVolume`, `workoutTraining`, `soloPieceInfo`, `handsBoth`, `handsLeft`, `handsRight`, `versionsUpdate`, `recordingInLoop`, `midiConnectionError`, `midiSynthBluetoothWarning`, `tapGameMidiDisabled`, `pieceDownloadStart`, `pieceDownloadEnd`, `deeplinkLoading`, `deeplinkFailure`.

## 11. MIDI

- MIDIKit (`MIDIKitIO` package) for USB/virtual/network; CoreBluetooth for BLE MIDI (`BluetoothMIDIService`, `BluetoothState { poweredOn, poweredOff, unauthorized, unsupported, unknown }`) (**exact**).
- "Synthesize MIDI": "Generate a piano sound when you play on the connected instrument." Sound source: `FluidR3-piano.SF2` in AntescofoKit resources (7,810,550 bytes) played by `AVAudioUnitSampler` (**exact** file; sampler use **inferred** from `samplerNode`).
- MIDI recording: `MIDIRecorder`, `TimedMidiNoteOn { pitch, velocity, date }`; bouncing to audio: `MIDI2AudioBouncer.swift` (**exact**).
- "To play with an acoustic instrument, just disconnect your MIDI device." (**exact**).

## 12. Voice commands

`Core.SpeechCommand { play, rewind, pause, listen, metronome, slower, faster, volumeUp, volumeDown, close }` (**exact**). Keywords (**exact**, en):

| Command | Keywords | Action label |
|---|---|---|
| play | Play, Start, Perform | Play accompaniment |
| pause | Pause, Stop | Pause playback |
| rewind | Back, back, Return, Start over | Return to previous position |
| listen | Listen, Solo, Soloist | Listen to the solo with accompaniment |
| metronome | Metronome | Toggle Metronome |
| slower | Slow down, Reduce tempo, Less speed, Slow tempo | Decrease tempo by 10% |
| faster | Speed up, Increase tempo, Faster, Quicken | Increase tempo by 10% |
| volumeUp | Louder, Volume up, Increase volume, Raise volume, Turn up the volume, Boost volume | Increase volume by 10% |
| volumeDown | Less volume, Decrease volume, Lower, Reduce volume, Volume down, Quieter, Lower, Turn down the volume | Decrease volume by 10% |
| close | Close, Exit | Close the piece |

Implementation: `SFSpeechRecognizer` on a sink node of the same audio graph (**exact** field names).

## 13. Tuner

- `Metronaut.TunerAudioService { rtDetectedF0, tunerFrequencyHz, phase, phaseIncrement, currentFreq, generatingTone, fade, fadeIncrement, fftBuffer, nfft, hopsize, toneGenerator: AVAudioSourceNode, sinkNode: AVAudioSinkNode }` (**exact**). It detects f0 by FFT and can play a reference sine tone with fade in/out (**inferred** from names).
- `Core.MusicNote { baseDiapason, f0, lastDetectedF0, printName, cents, analyzerPos, analyzerColor, name: NoteName, octave }` (**exact**).
- UI: `TunerView`, `AnalyzerView`, `DiapasonView { stepperValue }`, `TunerDrawerView` (**exact**). Strings: "Tuner", "Play a note to Start Tuner", piano: "Play an A and adjust the Tuning reference", "Tuning reference" (**exact**). watchOS strings exist: "Tap Tempo", "Play Tone", "Base", "Name", "Octaves" (**exact**; watch app not bundled).
- Reference pitch default `440.0` Hz (`DefaultUserPreferences.tuningDiapason`, **exact**). It is passed to the engine as `tuning_reference` and `set_tuning:` so accompaniment audio is re-pitched for an out-of-tune piano (feature `piano_not_tuned`) (**inferred**).

## 14. What could not be recovered

- Numeric FFT sizes (`antescofo_nfft`, hop) and per-device buffer table beyond the two branches shown.
- Tempo slider array and lock thresholds (`tempoArray`, `lockThreshold*`).
- The pass threshold for workout steps (`%u`).
- Exact `MetronautPerformancePlayingMode` → `PerformanceMode` mapping (inferred above).
- HMM internals of the Antescofo listener (`AnteAlign.cpp`, `StateChain.cpp`); only messages and parameter names are visible.
