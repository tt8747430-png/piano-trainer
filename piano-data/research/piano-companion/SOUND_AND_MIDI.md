# Sound and MIDI

Scope: the sound bank, the playback pipeline, every timing and velocity constant, MIDI input/output and the metronome.
Assemblies: `PianoCompanion.dll` (UI, `PianoCompanion.OSX.SoundHelpers`), `PianoCompanion.Engine.OSX.dll` (engine), `Songtive.Engine.OSX.dll` (shared Songtive engine with an embedded copy of `NAudio.Midi`).
Each claim is **exact** (with source) or **inferred**.

## 1. Architecture in one picture

```
UI click / MIDI in ──► Player (abstract, PianoCompanion.Engine.Services.Player)
                         └─ OSXPlayer (PianoCompanion.OSX.SoundHelpers)
                              └─ Sequencer
                                   ├─ builds a Track → NAudio MidiEventCollection (MidiService.SaveTrack)
                                   ├─ writes a temporary .mid file to ~/tmp/<random>.mid, loads it into
                                   │  an AudioToolbox MusicSequence, plays it with MusicPlayer, deletes the file
                                   ├─ MusicSequence → virtual CoreMIDI destination "PianoCompanion Sequencer Destination"
                                   │  → Read() callback → MusicDeviceMIDIEvent → AUSampler
                                   └─ AUGraph: AUSampler (loads Sounds/instruments.sf2 preset) → default output
Live notes (on-screen piano, MIDI in) ──► Sequencer.NoteOn/NoteOff → MusicDeviceMIDIEvent(0x90/0x80) directly
Metronome ──► separate AVAudioEngine + AVAudioPlayerNode, synthesised clicks (no samples)
```

| Fact | Source | Status |
|---|---|---|
| DI: `Player` → `new OSXPlayer(MidiKeyboardService, Settings)`; `MidiService` → `PianoCompanion.Engine.Midi.MidiService` | `AppDelegate` lines 506–509 | **exact** |
| AUGraph = one `AudioTypeMusicDevice.Sampler` node connected to `AudioTypeOutput.Default`; `MaximumFramesPerSlice = 4096` | `Sequencer.InitAUGraph` | **exact** |
| Sound bank loaded with `AudioUnitSetProperty(kAUSamplerProperty_LoadPresetFromBank = 4100)`, `bankURL = Sounds/instruments.sf2`, `bankMSB = 121` (kAUSampler_DefaultMelodicBankMSB), `bankLSB = 0`, `presetID = (byte)Settings.Instrument` | `Sequencer.SetInstrument` | **exact** |
| Every sequenced playback goes through a temp MIDI file: `~/tmp/{TickCount+rand(0..10^7)}.mid`, deleted in `finally` | `Sequencer.PlayTrack` | **exact** |
| Looping progressions use `MusicTrackLoopInfo { loopDuration = track length, numberOfLoops = 0 }` (0 = infinite) when `!track.PlayOnce` | `Sequencer.PlayMidi` | **exact** |
| Current chord highlight during playback: on every Note-On arriving at the virtual endpoint, `MusicPlayerGetTime` is read, and the item whose start beat ≤ now becomes current (`TrackItemChanged`). Loops use `now % maxTrackLength`. | `Sequencer.Read`, `Sequencer.Tick` | **exact** |
| CoreMIDI client names: `"PianoCompanion Sequencer"` (retry `"PianoCompanion Sequencer2"`), `"PianoCompanion MIDI Receiver"`; ports `"PianoCompanion MIDI Input"`, `"PianoCompanion MIDI Output"` | `Sequencer.Init`, `MidiKeyboardService.Init` | **exact** |
| The Songtive-engine players (`Songtive.Helper.PlatformPlayer`, `Songtive.Services.TimeNotePlayer`, `Songtive.Midi.MidiService`) are not referenced by `PianoCompanion.dll` or the PianoCompanion engine; they are shared-library leftovers (PlatformPlayer even has an Android path `/sdcard/songtive.sf2`). | grep over decompiled sources | **exact** (no references) / **inferred** (purpose) |

## 2. The sound bank: `Contents/Resources/Sounds/instruments.sf2`

Parsed with `scripts/sf2_inventory.mjs`; full dump in `data/sf2_inventory.json`.

| Field | Value | Status |
|---|---|---|
| Size | 11,449,072 bytes; `smpl` chunk 11,341,312 bytes (16-bit PCM, no `sm24`) | **exact** |
| `ifil` / `isng` | 2.1 / EMU8000 | **exact** |
| `INAM` | GeneralUser GS softsynth version 1.44 | **exact** |
| `ICOP` | 2012 by S. Christian Collins | **exact** |
| `IENG` | S. Christian Collins | **exact** |
| `ISFT` | Awave Studio v10.1 | **exact** |
| `ICMT` | "License v2.0" text, cut off at 1502 bytes (see RESOURCES_AND_LICENCES.md) | **exact** |
| Counts | 9 presets, 81 instruments, 120 samples (all sample type 1 = mono) | **exact** |
| Sample rates present | 8000, 11025, 20000, 22050, 24000, 27778, 28800, 29998–30002, 30380–32014 (several), 32000, 44100, 48000 Hz | **exact** |

### Presets, mapped to the app's `Instrument` enum

`PianoCompanion.Engine.Services.Instrument` values are passed as `presetID` and match the SF2 program numbers one-to-one. UI labels come from `instrument_<enumname lowercased>` keys.

| Enum (value) | UI label (en) | SF2 preset (bank:program name) | Instr. | Samples | Key range | Velocity layers | Sample rate(s) | Root pitches (MIDI) |
|---|---|---|---|---|---|---|---|---|
| Piano (0) | Grand Piano | 0:0 Grand Piano | 24 | 40 | 0–127 | 12: 0-9, 10-19, 20-28, 29-37, 38-48, 49-59, 60-72, 73-83, 84-94, 95-105, 106-116, 117-127 | 44100 | 20 pitches × L/R: 24,29,35,38,42,45,49,52,57,61,65,68,74,79,83,86,89,95,101,107 |
| BrightPiano (1) | Bright Piano | 0:1 Stereo Grand | 16 | 17 | 0–127 | 8: 0-49, 50-65, 66-79, 80-91, 92-101, 102-110, 111-119, 120-127 | 44100 + 30380–32014 | 26,29,34,38,44,48,53,58,60,63,66,72,75,81,86,91,96 |
| Vibraphone (11) | Vibraphone | 0:11 Vibraphone | 7 | 6 | 0–114 | 7 | 30000 | 34,41,50,58,71,72 |
| Marimba (12) | Marimba | 0:12 Marimba | 10 | 10 | 0–127 | 9 | 48000/8000/22050 | 42…126 |
| Xylophone (13) | Xylophone | 0:13 Xylophone | 6 | 4 | 21–127 | 6 | 20000 | 60 |
| SteelGuitar (25) | Steel Guitar | 0:25 Steel Guitar | 7 | 10 | 0–108 | 7: 0-44, 45-57, 58-71, 72-85, 86-98, 99-112, 113-127 | 24000/32000 | 52,57,62,67,71,76,79,82,85,88 |
| Cello (42) | Cello | 0:42 Cello | 9 | 22 | 0–127 | 9 (sustain + separate "CelloAttack" layers) | 22050–30002 | 37…75 |
| SynthStrings (50) | Synth Strings | 0:50 Synth Strings 1 | 1 | 5 | 0–113 | 1 | 11025/22050/44100 | 60,84 |
| SynthVoice (54) | Synth Voice | 0:54 Synth Voice | 1 | 6 | 0–115 | 1 | 28800 | 55,58,61,67,73,83 |

All **exact** from the SF2 parse and `Instrument.cs`, except "UI label" which is **exact** from `en.lproj` (`instrument_piano = "Grand Piano"` etc.) and `PianoViewController.OnInstrumentTapped`.

Envelope examples (from the instrument generators, timecents converted to seconds): Grand Piano layer 117–127 uses `decayVolEnv ≈ 12.0 s`, `sustainVolEnv = 456 cB`, `releaseVolEnv ≈ 3.08 s`; Stereo Grand lowest layer uses `decay 31.6 s → 10.5 s` falling with pitch, `release 1.95 s → 0.96 s`. **exact** (`data/sf2_inventory.json`).

Default instrument: `Settings.Instrument` has no explicit default in code, so it is enum value 0 = Piano (Grand Piano). **inferred** (C# default of an enum property).

## 3. Playback recipes (what the user hears)

Pitch formula used everywhere: `midi = (octave + 1) * 12 + formulaSemitone`, so octave 4 → C4 = 60. **exact** (`MidiService.SaveTrack`: `num4 = (trackItem.Octave + 1) * 12`).

| Action | Code path | Tempo | Note length | Velocity | Octave | Status |
|---|---|---|---|---|---|---|
| Play a chord (block) | `Player.FormulaToChordTrack(formula, octave, duration = 1)` → `new Track(90, 4)`, one `Formula` item | 90 BPM | 1 beat = 480 ticks = **0.667 s**; all notes start together (no strum, no stagger) | 100 (on and off) | `Settings.PreviewOctave ?? 4` | **exact** (`Player.cs`, `MidiService.SaveTrack`) |
| Play a chord as arpeggio | `Player.FormulaToArpeggioTrack` → `new Track(tempo ?? Settings.ArpeggioTempo, 4)`, one item per note, each `duration = 1` | `ArpeggioTempo`, default **160 BPM** | 1 beat each = **0.375 s** per note; ascending in formula order; no overlap | 100 | as above | **exact** (`Settings` load: `ArpeggioTempo = settings.ArpeggioTempo ?? 160`) |
| Play a scale | `PlayArpeggio(scale.FormulaAsInts, null, octave)` | 160 BPM default | 0.375 s per note, ascending only (no descent) | 100 | `PreviewOctave ?? 4` | **exact** (`ScalesDetailsViewController` l.430, `GeneralItemController` l.444) |
| Chord detail auto-play on selection | only if `!DontPlayChords`; arpeggio if `PlayChordArpeggio` | as above | as above | 100 | `PreviewOctave ?? 4` | **exact** (`ChordsDetailsViewController` l.354–366) |
| Play panel (detail page) | octave picker with 5 segments labelled `2 3 4 5 6`; `octave = SelectedSegment + 2`; for chords an "arpeggio" switch chooses block vs arpeggio; scales always arpeggio | as above | as above | 100 | 2–6 (persisted to `PreviewOctave`) | **exact** (`PlayPanel.cs` l.98–107, 181–205) |
| Scale-chord tile tap | `PlayChordForFormula(array)` with default octave 4 | 90 | 0.667 s | 100 | 4 | **exact** (`ScaleChordItem` l.288) |
| Progression item in "Arpeggio" play mode | `PlayMode.Arpeggio`: item length `480 × duration` ticks split evenly: each note `num6 / formula.Length` ticks, consecutive | track tempo | `duration` beats ÷ note count | 100 | item `Octave` | **exact** (`MidiService.SaveTrack`, `flag` branch) |
| Progression item, default mode | all notes for `480 × duration` ticks, repeated `Repeats` times | track tempo (new `Track()` default **140 BPM**, 4 beats/measure) | `duration` beats | 100 | item `Octave` (default 4) | **exact** (`Track()` ctor `this(140, 4)`; `Track.AddItem(chord)` → octave 4, duration 1, repeats 4) |
| Slash-chord bass in progression | extra note on MIDI channel 2 (event list 1), one octave below the item octave (`max(0, base − 12) + BassNote`), lasting the whole item (`Repeats × duration` beats) | track tempo | whole item | **70** | item octave − 1 | **exact** (`SaveTrack`, `BassNote` branch) |
| Silence item | Note-On/Off of note 0, velocity 0 for `480 × duration` ticks (keeps time) | — | — | 0 | — | **exact** |
| Progression with accompaniment style (`Chord.RefId` set) | `PlayChordWithStyle`: events from the first `Section` of the referenced Songtive style track; positions in 1/128-note units × 15 ticks; note = `(item.Octave + 1 + (event.Octave − minOctave)) × 12 + chord index → semitone`, bass events use `BassSemitone ?? Semitone`; notes > 120 dropped | track tempo | per style event | per style event | per style | **exact** (`MidiService.PlayChordWithStyle`, `GetNoteForIndex`) |
| Single-item preview (`PlayTrackItem`) | `new Track(90, 4) { PlayOnce = true }` with a copy of the item, `Repeats = 1` | 90 | `duration` beats | 100 | item octave | **exact** (`Player.TrackItemToTrack`) |
| Library export | `SaveLibrary`: each item 4 beats (1920 ticks) at 120 BPM (tempo event 500000 µs), root C4 (60) | 120 | 4 beats | 100 | 4 | **exact** |
| On-screen small keyboard key | `NoteOn(60 + keyIndex, 120)` on mouse-down, `NoteOff` on mouse-up | live | held | **120** | fixed C4 base | **exact** (`PianoKeyboard.KeyMouseDownHandler`) |
| Big piano (Piano tab) mouse | `PianoPlayKey.Activate(120)`; note = `21 + keyIndex` (key 0 = A0) | live | held | **120** | 88-key range from A0 | **exact** (`PianoPlayView` l.486, `PianoRollView.OnKeyNoteOn`) |

MIDI file constants (`PianoCompanion.Engine.Midi.MidiService`): `PPQN = 480`, `DefaultVelocity = 100`, `N128DURATION = 15` ticks (1/128 note), `METER_EIGHTH = 12`, `METER_QUARTER = 24`, `METER_HALF = 48`, `METER_WHOLE = 96`, `DEFAULT_METER = 24`, `DEFAULT_DIVISION = 8`; time signature event `(beatsPerMeasure, 2 (=quarter), 24, 8)`; tempo event `60000000 / tempo`; accompaniment tracks also send `CC91 Reverb = 38` and `CC7 MainVolume = 127 × min(1, volume)`; drum tracks use channel 10. **exact**

Global mute: `Settings.SuppressSound` blocks `NoteOn/NoteOff/Play` in `OSXPlayer` and the sampler write in `Sequencer.Read`. **exact**

Not present: strum offsets, humanisation, sustain-pedal handling, velocity curves. A search for "strum" finds only the word "instrument". **exact** (grep).

## 4. MIDI input

| Step | Detail | Status |
|---|---|---|
| Discovery | `MidiKeyboardService.Init`: `Midi.Restart()`, creates client and ports, connects **every** source (`for i < Midi.SourceCount: inputPort.ConnectSource(...)`). On `ObjectAdded` it reconnects all sources. | **exact** |
| Source list text | Sources from index 1 upward are listed as `"<DisplayName>: Network"` or `"<DisplayName>: Local"` (localised `Network`/`Local`); index 0 is skipped in the list but still connected. | **exact** (`GetSources`) |
| Parser | `MidiMessageParser.Feed`: ignores real-time bytes (≥ 0xF8); tracks running status; SysEx (0xF0) swallowed until next status; 0xC0/0xD0 have 1 data byte, others 2. | **exact** |
| Note mapping | `NoteAction`: status 0x9n with velocity > 0 → on; 0x9n with velocity 0 → off; 0x8n → off; all else ignored (all channels accepted). | **exact** |
| Event | `NoteChangedEventArgs(note = data1 % 12, midiCode = data1, velocity = on ? data2 : 0, isOn)` | **exact** |
| Gate | Event fires only if `Settings.MidiInput` is true (default **false**). `Settings.MidiInputDevice` exists (default `""`; `"off"` means not listening via `MidiInputListens()`), but `MidiKeyboardService` itself does not filter by device. | **exact** (`OnNoteChanged`, `Settings`) / **inferred** (device filter unused on macOS) |
| Chords & Scales finders | `HandleNoteChanged` → `PianoKeyboardFilter.HandleMidiKey(midiCode, isOn)`: keeps a sorted list of held MIDI notes; transposes them so the lowest held note's octave becomes 0 (`offset = min / 12 * 12`); then a **1.0 s throttled search** (`PerformSelector("UpdateData:", delay 1.0)`, cancelling the previous request). If `PlayKeys` (= `Settings.MidiOutput`) is on, the incoming note is also sounded with velocity 120. | **exact** (`ChordsViewController` l.526–545, `ScalesViewController` l.559, `PianoKeyboard.HandleMidiKey`) |
| Lite gate on finder | On-screen key presses beyond 2 notes call `CheckWarnIfLite(ProductType.ChordsPro)`. | **exact** (`ChordsViewController.ViewDidLoad`) |
| Piano tab | `PianoRollView.HandleNoteChanged`: `code = midiCode − 21` (A0 = 0; notes below A0 ignored) → lights the key on the main piano and the overview strip with the incoming velocity. | **exact** |
| Recording | `NoteRecorder` stores `{note, time ms since start, velocity 127 (on) / none (off), code 144/128, instrumentIndex}` using `CACurrentMediaTime`; playback uses a 10 ms `System.Timers.Timer`. Recorded velocity is always 127. | **exact** (`NoteRecorder.cs`) |

## 5. MIDI output

| Detail | Status |
|---|---|
| `Settings.MidiOutput` (default **false**). When on, Note-On/Off produced by the sequencer (status high nibble 9 or 8) are forwarded to every CoreMIDI destination whose name does **not** start with "PianoCompanion" (case-insensitive). | **exact** (`Sequencer.Read`, `MidiKeyboardService.SendPacket`) |
| Live on-screen key presses are not forwarded (they call `MusicDeviceMIDIEvent` directly, bypassing the virtual endpoint). | **inferred** from code paths |
| MIDI file export of progressions/library/songbook uses the same `MidiService.SaveTrack`/`SaveLibrary` builders (strings: "Export to MIDI", "Send MIDI file"). | **exact** (strings) / **inferred** (shared builder for exports) |

## 6. Metronome (`PianoCompanion.Engine.Services.Metronome`)

Fully synthesised; no audio files.

| Item | Value | Status |
|---|---|---|
| Engine | `AVAudioEngine` + `AVAudioPlayerNode`, mono Float32, **44,100 Hz** | **exact** (`MetronomeAudioEngine`) |
| Scheduling | One buffer per beat (`round(44100 × 60/bpm)` samples). 3 buffers queued ahead (`QueueDepth = 3`); each completion schedules the next. Click tails longer than a beat carry into the next buffer. | **exact** |
| Click synthesis `RenderClick(freq, peak, duration, square)` | Linear attack 0 → peak over 1 ms, then exponential decay from `peak` to 0.001 over the remaining time; waveform square (`sign(sin)`) or triangle (`2/π·asin(sin)`) | **exact** |
| Accent click (beat 1, only if beats/bar > 1) | 1100 Hz, peak 0.30, 60 ms, square | **exact** |
| Beat click | 800 Hz, peak 0.18, 60 ms, square | **exact** |
| Subdivision click | 1600 Hz, peak 0.07, 30 ms, square; placed at `round(beatSamples × k / subdivision)` | **exact** |
| Cross-rhythm accent (first pulse) | 660 Hz, peak 0.22, 50 ms, triangle | **exact** |
| Cross-rhythm pulse | 520 Hz, peak 0.16, 50 ms, triangle; `cross` pulses evenly spread over the bar (`l × beats / cross` beats) | **exact** |
| Limits | BPM 30–250 (default 120); beats/bar 1–12 (default 4); subdivisions {1,2,3,4} = Quarter, Eighth, Triplets, Sixteenth; cross-rhythm off (0) or 2–9; max 20 presets; quick BPMs 60, 90, 120, 140, 180 | **exact** (`MetronomeLimits`) |
| Pro gating | Subdivision > 1 or cross-rhythm ≥ 2 is "pro" (`IsSubdivisionPro`, `UsesProFeatures`); `WithEntitlement(false)` strips them to subdivision 1, cross 0. | **exact** |
| Tempo marks | Largo 40–60, Larghetto 60–66, Adagio 66–76, Andante 76–108, Moderato 108–120, Allegro 120–156, Vivace 156–176, Presto 176–200; below → "Grave", above 200 → "Prestissimo" (first match wins, so 60 = Largo) | **exact** (`TempoMarks`) |
| Persistence | settings key `metronome_settings`, presets key `metronome_presets` (JSON objects via `ISettingsManager`); preset summary `"{bpm} BPM · {beats}/4[ · Eighth][ · {cross}:{beats}]"`; suggested name `"{bpm} BPM"`, then `"{bpm} BPM 2"`, `3`, … | **exact** (`MetronomeService`, `MetronomePreset`) |
| Visuals | `BeatStarted(beatIndex)` on main queue when a beat buffer starts; `CrossPulseStarted(i)` dispatched after the pulse offset within the beat | **exact** |

## 7. Settings that affect sound (keys and defaults)

| Property | Default on first run | Where set | Status |
|---|---|---|---|
| `Instrument` | 0 (Piano) | Piano tab instrument menu | **inferred** default; **exact** setter (`PianoViewController.SelectInstrument`) |
| `ArpeggioTempo` | 160 | not set anywhere in `PianoCompanion.dll` (no UI) | **exact** (`Settings` load; grep) |
| `PreviewOctave` | 4 | Play panel octave picker 2–6 | **exact** |
| `PlayChordArpeggio` | false | Play panel switch / settings | **exact** |
| `DontPlayChords` | **true** | Settings window "dont_play_chords" | **exact** (`Settings` ctor) |
| `DontPlayScales` | **true** | Settings window "dont_play_scales" | **exact** |
| `MidiInput` | false | Settings window; toolbar button `MidiInButton` (Chords/Scales finder) toggles it | **exact** |
| `MidiOutput` | false | Settings window checkbox | **exact** |
| `MidiInputDevice` | `""` | — | **exact** |
| `SuppressSound` | false (not set in ctor) | Settings window checkbox (`SuppressSoundCheckBox`) | **exact** setter; **inferred** default |
| `metronome_settings` / `metronome_presets` | 120 BPM, 4/4, quarter, no cross | Metronome tab | **exact** |

The full preference list is in SETTINGS.md (other fork).

## 8. Notes for a web port

- Equivalent graph: one sampler (e.g. an SF2 player or per-note samples) → `AudioContext.destination`. Schedule with `AudioContext.currentTime` instead of writing MIDI files.
- Reproduce exactly: block chord 0.667 s at velocity 100; arpeggio 0.375 s per note; mouse keys velocity 120; slash bass at velocity 70 one octave down.
- The metronome click formulas above can be ported line-for-line into an `AudioBuffer` generator.
- Web MIDI: implement the same parser rules (running status, velocity-0 Note-On = off) and the 1 s debounce before chord lookup.
