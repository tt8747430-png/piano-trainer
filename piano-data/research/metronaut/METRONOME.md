# Metronome, count-in and tempo

Legend: **exact** = read from a file or binary (cited). **inferred** = interpretation.

## 1. Summary

- The metronome is not a free-running clock. It ticks on **pulses defined by the score**, scheduled by the Antescofo accompaniment process. So it follows the accompaniment tempo, including tempo changes, rubato in Magic mode, and loops (**inferred** from §2).
- There is one click sound buffer and no accent pattern or subdivision setting in the UI or code (**inferred**: one `pulseBuffer`; no subdivision/accent strings or enums found).
- Default: off, volume 0.5 (**exact**).
- Count-in ("Countdown"): `none`, `acoustic`, `visual`. Default `acoustic` (**exact**).
- Tempo is a percentage of the score tempo, default 100 % (**exact**).

## 2. How a tick is produced

| Step | Code | Status |
|---|---|---|
| 1 | Score file (`.asco`, field `ascoFile` per version — see CATALOG_MODEL.md) supplies `$pulses_nim` (pulse length per beat position), `$pulse_phase_nim` (time to next pulse) and `$pulse_pos` (initial phase). If `$pulses_nim` is undefined, the pulse is `1` beat. | **exact** (`launch.asco.txt`, functions `get_pulse`, `get_pulse_time`) |
| 2 | `::pulse_loop_exe()` runs inside `$exe_pv` (the accompaniment group, synchronised to the musician through `$map_sync`). Each period it sends `antescofo::pulse (@get_pulse_time($action_pos_round))`, unless fast-forwarding or past `$endLoop`. Period floor `0.1` beat when the pulse is < `0.05`. Self-heals: if two pulses fire at the same position (`diff < 0.0001`) it aborts and restarts after `0.1 s`. | **exact** |
| 3 | Core → bridge `send_pulse:` → `AntescofoEngine.antescofoPulse(_:)`; publishers `pulsePositionAndDuration`, `pulseData (pos, dur, n)` | **exact** names |
| 4 | `AnteAudioEngine.play_beat()` → `metronomeNode.scheduleBuffer(pulseBuffer, at: nil, options: 2, completionHandler: nil)` | **exact** (AntescofoKit `0x90fb0`). `options = 2` = `AVAudioPlayerNodeBufferInterrupts`, so each click cuts the previous one. |
| 5 | `metronomeNode` is an `AVAudioPlayerNode` in `AudioGraphController`; gain `metronomeGain`; published `metronomeOutputGain` | **exact** |

The click sample source is not identified. `Resources/Pop.aiff` (stereo, 44.1 kHz, 16-bit, 0.022 s, 3,880 audio bytes) is the only short one-shot in the bundle, but no code reference to it was found (**exact** file facts; link **unconfirmed**). A buffer is created after a `fileExistsAtPath:` check in a stripped function at AntescofoKit `0x72664` (**exact**), which suggests a file-based click (**inferred**).

Because pulses come from the score, compound meters can tick on the dotted beat if the `.asco` pulse map says so (**inferred**).

## 3. Controls and labels

| Control | Where | Strings (**exact**) |
|---|---|---|
| Metronome toggle | Bottom bar button `PerformanceBarEnum.metronome`; also inside the tempo drawer (`TempoMetronomeUIView { metronomeActive }`) | `Core.Strings.PERF_BAR_METRONOME`; "Metronome" |
| Metronome volume | Volumes section | "Metronome" (`settings.volume.metronomeTitle`) |
| Voice | "Metronome" keyword | "Toggle Metronome" |
| Pulse listening | tempo drawer | `performance.tempo.pulseLabel` = "Listen to pulse" |
| Engine API | `AntescofoEngine.startMetronome()`, `metronomeIsActive`; context flags `metronomeEnginePlaying`, `metronomePlaybackOverrideActive` | **exact** |
| Errors | `AudioGraphFailureOrigin.metronome`, `AudioGraphReadinessFailure.metronomeNodeUnavailable`; log "Error on metronomeNode.play() : " | **exact** |
| Analytics | settings `stateMetronome`, `volumeMetronome` | **exact** |

Workout copy uses the metronome as a learning step (**exact**): "Pay attention to the metronome and the indicated rhythms." / "play the entire piece without the metronome" / "without the click track". Feature card: "Practice with the metronome" — "Improve your rhythmic precision and perfect your playing using the metronome".

## 4. Count-in ("Countdown")

| Item | Value | Status |
|---|---|---|
| Enum | `Core.CountdownMode { none, acoustic, visual }`; `init(Double)`: 0 → none, 1 → acoustic, 2 → visual; `isEnabled` getter | **exact** (Core `0x9a580`) |
| Default | `acoustic` | **exact** |
| UI | "Countdown" — "Adjust the Countdown at the beginning of your performance." Segments "None", "Visual", "Audible". Toasts: "Countdown Off", "Countdown On", "Audible Countdown On" | **exact** |
| Older UI | "None" / "Short" / "Long" and a "With sound" toggle | **exact** (`settings.counter.segment.*`, `settings.counter.wSoundTitle`) |
| Visual | `PulseModel { state: PulseState(off/current/done), duration, pulseNumber, ratio }`, `PulseUIState { model, width }`, `PerformanceModel.countDownPulsesPublisher`, `updateCountDownPulse(number:duration:state:)`; player status `countdown`; `isPlayingHorsCountDown` ("playing, not counting down") | **exact** |
| Messages | `UserMessageUIViewEnum.countdown`, `.countdownWithVolume` | **exact** |
| Length | not found; one bar of score pulses is likely (pulses come from the score and the model counts `pulseNumber`) | **inferred** |
| Workout copy | "The measures are in 3/4 time, press "play" and the count will give you the tempo." | **exact** |

## 5. Tempo

| Item | Value | Status |
|---|---|---|
| Unit | Percent of the score tempo. "Tempo %.0f%%", "Tempo (%)" | **exact** |
| Default | `tempoCoef = 100.0` | **exact** |
| Slider | `TempoSliderUIView { tempo: Int, tempoArray: [Int], isLockedAt100, lockThresholdLower, lockThresholdUpper, unlockThresholdLower, unlockThresholdUpper, maxSliderWidth }`. The slider snaps to 100 % (**inferred** from names). Range values not recovered. | **exact** fields |
| Slider icons | SF Symbols `tortoise.fill` and `hare.fill` (PreviewCoreKit small strings) | **exact** names; placement **inferred** |
| BPM display | `ScoreReaderVM.bpmBoxText`, font `Core.FontHelper.FONT_SCORE_BPMBOX`; `tempoBeatPosition` (position of tempo markings) | **exact** |
| Voice | ±10 % per command | **exact** |
| Fixed vs adaptive | "Metronaut's reaction" / "Choose how Metronaut follows you:" — "No adaptation (fixed tempo)", "Musical adaptation (for interpreting)", "Note by note (for sight-reading)" | **exact** |
| Constant tempo | "Constant Tempo" — "Activate this mode to play in strict metronomic tempo." → engine mode `playbackmetronomic` (2) | **exact** label; mapping **inferred** |
| Tempo regulator | "In Magic Mode the tempo regulator helps you maintaining the original tempo." | **exact** |
| Onboarding | "Swipe left or right to change the accompaniment tempo." / "Swipe the wheel while the accompaniment is playing to find your ideal tempo." / "If the piece is challenging, try lowering the tempo!" | **exact** |
| Statistics | `SubPerformanceEvent.tempoAverage`, "Average tempo" | **exact** |

Engine tempo calls (**exact**): `set_tempo:`, `set_global_tempo_coef:`, `set_ratio_tempo_coef:`, `get_ratio_tempo_coef`, `get_current_bpm`, `get_ideal_bpm:`, `getIdealBpm(_:)`, `getIdealBpmWithoutCoef(_:)`, `reset_musician_tempo`. Time-stretch keeps pitch (`AnteAudioTimeStretch`, `send_timeStretch::`).

## 6. Tap tempo

Only in watchOS strings: "Tap Tempo", "Tap to Define Tempo" (**exact**). No watch app is bundled in this Mac build (**exact**: no `Watch/` folder).

## 7. Not determined

- Click sample and whether accents exist in the sample set.
- Tempo slider min, max and step (`tempoArray`).
- Count-in length in beats.
