# Takeaways for a TypeScript web piano trainer

Each item says what Metronaut does (with the doc that proves it) and a concrete web implementation. Everything in the "Web" column is my recommendation (**inferred**). Do not copy proprietary assets: no Metronaut scores, recordings, `.asco` files, Lottie art, images, ML models or the FluidR3 sample file (its own INFO chunk says "DO NOT REDISTRIBUTE").

## 1. Modes (copy the model, it is clean)

| # | Metronaut | Web |
|---|---|---|
| 1 | Five user modes: Listen, Practice (fixed tempo), Interpret (AI tempo), Training (feedback, fixed tempo), Sight-read (wait). PRACTICE §4.2 | `type Mode = 'listen' \| 'practice' \| 'follow' \| 'train' \| 'wait'`. Derive capabilities with pure functions like Metronaut's getters: `listensToUser(m)`, `scores(m)`, `penalises(m)`, `accompanimentOn(m, multitrack)`, `forcedCursor(m)`. |
| 2 | Training uses the fixed-tempo transport (`resolvedTransportMode: coach → playAlong`). PRACTICE §4.2 | Keep "how the accompaniment moves" (transport) separate from "what we evaluate" (feedback). Training = practice transport + feedback on. |
| 3 | Wait mode forces a continuous cursor and advances only when all pitches of the target chord are matched; MIDI notes are batched before matching; wrong-note feedback is delayed and cancellable. PRACTICE §4.4 | Build an onset index `{beat, pitches:Set<number>, staves}` from MusicXML. On MIDI `noteon`, add to a 30–60 ms batch; when batch closes, compare with target set; advance when `target ⊆ held∪batch`. Show red only if no correct match arrives within ~150 ms. |
| 4 | Hands separate = choose a different accompaniment recording per hand (`accompanimentIdForHand`). PRACTICE §4.3 | With MIDI/MusicXML you can do better: mute the practised hand's staff in playback and mark it grey on screen (`grayedStaff` idea). Map hand → staff (RH = staff 1, LH = staff 2 for piano). |
| 5 | Rhythm game: tap a button when the cursor reaches each note. PRACTICE §4.5 | Cheap to add: spacebar/touch taps scored with the same timing classes as §3 below. Works without an instrument. |

## 2. Following the player

| # | Metronaut | Web |
|---|---|---|
| 6 | Accompaniment re-syncs only at "tight" positions and otherwise runs on its own clock; if it reaches ¾ of the way to the next tight point before the player, it stops and waits. PRACTICE §5 step 6 | Implement "sync points" (e.g. downbeats). Between them, schedule audio at the current tempo with Web Audio. If `accompanimentBeat − playerBeat > 0.75 × gap`, pause the accompaniment until the next detected onset. |
| 7 | Catch-up uses a target window in beats with a quadratic-in curve (`target_window_rel`, `i_QUAD_IN`). PRACTICE §3 | When the player is ahead/behind by `d` beats, change tempo so the gap closes over `W` beats using an ease-in curve, instead of jumping. `W ≈ 5` beats for adaptive mode, very large for fixed mode. |
| 8 | User-activity detector with hysteresis: playing ≥ 0.6, idle < 0.4 for 5 s. PRACTICE §5 step 4 | Same thresholds on an RMS/onset-rate measure. After 5 s idle show "Are you there?" and pause. |
| 9 | During long rests (≥ 2 beats) the follower trusts audio less (`gamma −0.01`) from 0.5 beat after the rest to 1 beat before the next note. PRACTICE §5 step 5 | Freeze tempo estimation during long rests so noise does not move the cursor. |
| 10 | Separate latency for engine and cursor, stored per output device; Bluetooth warning. PRACTICE §8 | Use `AudioContext.outputLatency` + `baseLatency`, plus a user offset slider ("If audio is late, increase the latency"), saved per `deviceId` from `enumerateDevices()`. |
| 11 | Piano onset detection: Core ML model on 229-bin log-mel, 9-frame context, stateful, 88 outputs. PRACTICE §7.5 | For mic input, use an open model of the same family (Onsets-and-Frames / Basic Pitch) in ONNX Runtime Web or TF.js; feed log-mel frames from an AudioWorklet. Prefer Web MIDI when available: exact and zero-latency. |

## 3. Feedback and scoring (copy the numbers)

| # | Metronaut | Web |
|---|---|---|
| 12 | Timing classes in beats: strict ±0.1 / ±0.2; lenient ±0.25 / ±0.5. PRACTICE §7.1 | `classify(diffBeats, strict)` with the same thresholds. Positive diff = early. |
| 13 | Penalties strict `[1, .5, 0, .3, 1]`, lenient `[.66, .33, 0, .33, .66]` (veryEarly→veryLate). Late is punished less than early in strict mode. | Reuse. |
| 14 | Score = `ceil(100 × progress × (1 − meanPenalty))`, snap to 100 above 96, never decreases position. PRACTICE §7.2 | One function, unit-tested. Show it live and at the end. Store `lastScore`, `maxScore` per piece+version. |
| 15 | Colours: early orange `#F87026`, on-time teal `#008A6E`, late blue `#36B0F7`; zones slow blue, fast orange, other amber `#FFBF00`. PRACTICE §7.1, §7.3 | Use the same semantic mapping (early = warm, late = cool). Add a colour-blind-safe second cue (arrow ◀ ▶ or label "Early"/"Late"). |
| 16 | Practice zones (slow/fast/irregular/missed) are drawn as background bands over beat ranges with a comment. PRACTICE §7.3 | After a run, cluster consecutive bad events into zones `{beginBeat, endBeat, type}`; one tap sets a loop on that zone. |
| 17 | Workout steps pass at a score threshold, with a "Training mode" at slower tempo. UI §6.3 | Steps = `{piece range, hand, tempo %, metronome on/off, pass %}`. Offer "train slower" after a fail. |

## 4. Metronome and tempo

| # | Metronaut | Web |
|---|---|---|
| 18 | Clicks are scheduled from score pulses inside the accompaniment timeline, so they follow tempo changes and rubato. METRONOME §2 | Derive the click grid from the MusicXML time signature + tempo map, schedule with `AudioBufferSourceNode.start(when)` on the same clock as the accompaniment (look-ahead scheduler, 25 ms timer, 100 ms horizon). |
| 19 | One click sound; each click interrupts the previous. No accents or subdivisions. METRONOME §1 | Add what Metronaut lacks: downbeat accent, subdivisions (2/3/4), compound-meter grouping. Generate clicks with an `OscillatorNode` burst (no asset licence issue). |
| 20 | Count-in: none / audible / visual, default audible; visual dots with off/current/done states. METRONOME §4 | Same three options; one bar by default; dots component with three states. |
| 21 | Tempo is a % of score tempo, default 100, slider snaps to 100, voice ±10 %. METRONOME §5 | Slider 25–200 % with a snap band around 100 (e.g. lock within ±3, unlock beyond ±6). Show BPM next to %. Keyboard: `[`/`]` ±5 %. |

## 5. Score display

| # | Metronaut | Web |
|---|---|---|
| 22 | MusicXML → GUIDO → engraved tiles; Bravura font; time→rect maps for cursor. SCORE_RENDERING §1 | OpenSheetMusicDisplay or Verovio → SVG; build `beat → {x, y, systemIndex}` map once per layout; Bravura is OFL (bundled in `open-licensed/fonts/`). |
| 23 | Cursor modes: none, beats (jumps on pulses), continuous, detected events. Default beats. SCORE_RENDERING §5 | Offer the same four. Continuous = interpolate x between event rects by time. |
| 24 | Page vs continuous scroll; scroll anticipation in beats; loop forces continuous scroll; half-page turn with mask and edge triangle. SCORE_RENDERING §4 | Page mode: when the cursor passes the last system's midpoint, reveal the next page's top half under a mask. Make anticipation a setting in beats (default 1–2). |
| 25 | Annotations anchored to `{beat, staff, measure, x/y offset, reference}`, not pixels. SCORE_RENDERING §7 | Store annotations in that shape (JSON, versioned `schemaVersion`). They survive zoom, transposition and re-layout. |
| 26 | Clef and transposition auto-adapted to the instrument range, with explicit outcome codes. SCORE_RENDERING §8 | For piano mostly irrelevant; still keep octave shift ±1 and "show fingering" toggle (default on). |
| 27 | On-screen keyboard under the score showing active pitches and note names; tap a note to see its key. SCORE_RENDERING §6 | Simple SVG keyboard, highlight expected (outline) vs played (fill) keys. |

## 6. UI and controls

| # | Metronaut | Web |
|---|---|---|
| 28 | Bottom bar of 11 buttons: rec, loop, tempo, AI feedback, mode, listen, steps, play/pause, rewind, metronome, tap. UI §8.1 | Fewer is better on web: play/pause, rewind, tempo, metronome, loop, mode, hands, settings. |
| 29 | Shortcuts: Space play/pause, ⌘P print, PgUp/PgDn/↑/↓ page, ⌘+/⌘− zoom. UI §2 | Same, plus `L` loop, `M` metronome, `H` hands, `R` rewind. Note Metronaut's bug: ← is labelled "Next Page". |
| 30 | Rewind: first tap → last start position, second tap → beginning. UI §8.3 | Copy exactly; it is a good pattern. |
| 31 | Settings grouped: Modes, Tempo, Volumes (accompaniment, metronome, solo, input), Display (cursor, scroll, keyboard, fingering, accompaniment staff), Transposition, Expert (latency, mic, MIDI). SETTINGS §4 | Use these groups. Persist per piece: tempo %, loop, cursor position, best score. Persist globally: cursor mode, count-in, metronome volume, A4 reference. |
| 32 | Defaults: metronome off, volume 0.5, cursor beats, count-in audible, mode Practice, feedback on, A4 = 440, show fingering on. SETTINGS §2–3 | Reasonable starting defaults. |
| 33 | Voice commands with simple keyword lists. PRACTICE §12 | Optional: Web Speech API `SpeechRecognition` with the same keywords; useful when both hands are busy. |
| 34 | Tuner with A reference stepper; piano users adjust the app's reference instead of tuning. PRACTICE §13 | Global `a4Hz` setting applied as `playbackRate`/detune on samples. |

## 7. Data model

| # | Metronaut | Web |
|---|---|---|
| 35 | Opus → piece (movement) → version (accompaniment) with `musicxmlFile`, `soloMusicxmlFile`, `ascoFile`, preview range, difficulty 1–3, part kind (Right/Left/Both hands). CATALOG_MODEL | `Work → Piece → Arrangement { musicXml, difficulty, hands, accompanimentAudio?, previewRange }`. |
| 36 | Recording snapshot stores the full settings used (`PerformancePreferences`). SETTINGS §4.4 | Save the settings object with each take so playback/replay is reproducible. |

## 8. What to measure, what not to do

| # | Metronaut | Web |
|---|---|---|
| 37 | Useful session events: session start/end, each run `{startPosition, endPosition, tempoAverage, notesNumber, practiceScore, scoreDuration}`, one generic `performance_setting_changed {category, setting, value}`. ANALYTICS_EVENTS | Log these locally (IndexedDB) for the user's own progress view. |
| 38 | Seven trackers (AppsFlyer, Branch, Braze, Facebook with auto-logging, Firebase, Amplitude, Apple attribution); ATT prompt "To Help Build our Community"; email as an analytics user property; tokens in UserDefaults. ANALYTICS_EVENTS, SETTINGS §5 | Do not do this. No third-party trackers by default; no email in analytics; tokens in HTTP-only cookies; first-party, opt-in, aggregated metrics only. |
| 39 | Paywall tuned by a server "conversion score" and probabilistic multiplier; many seasonal discounts; daily free minutes. UI §9 | If you monetise, prefer a transparent free tier (e.g. full features on public-domain pieces). |

## 9. Openly licensed items you can reuse

See RESOURCES_AND_LICENCES.md and `open-licensed/fonts/ATTRIBUTION.md`:
- Bravura, BravuraText (SIL OFL 1.1, © Steinberg Media Technologies GmbH; reserved name "Bravura").
- Guido2 (SIL OFL 1.1; reserved name "Guido2").
- GUIDO engine / libmusicxml are open source (MPL-2.0 per upstream; no notice in the bundle) — use upstream sources, not the app's binaries.
