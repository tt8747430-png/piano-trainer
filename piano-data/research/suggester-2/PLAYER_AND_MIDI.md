# Player, sound, MIDI

Sources: `MRMusicSuite.framework` (Kotlin packages `com.mathieurouthier.player2.*`, `music2.arpeggio`, `music2.phrase`, `music2.midi`), `MRPlayerApple_…PackageProduct.framework` (Objective-C++ audio/MIDI layer), `Instruments.framework` (sound bank table), `AudioUnitExtension.appex`.

## 1. Architecture (exact class names)

| Layer | Classes |
|---|---|
| Phrase building (Kotlin) | `Phrase`, `Phrase.Context(startingScale, sectionMarker, timeSignature, tempo, extendTriads, haveBass, metronomeEvents, notationTags, defaultArpeggiation, defaultHumanization, notifications, loopable, arpeggiatorType, arpeggiationTransform)`; events `NoteOnEvent(time, duration, note, channel)`, `NoteOffEvent`, `ControlChangeEvent(time, control, …)`, `ScaleChangeEvent`, `ChordChangeEvent`, `NotificationEvent`, `MetronomeEvent`; `PhraseEvent.Channel` = Normal, Bass |
| Arpeggiator | `Arpeggiator`, `BasicArpeggiator`, `PedalArpeggiator`, `ArpeggiationTransform.StyleA/StyleB`, `ArpeggiatorType` = Pedal (label "Sustain Pedal"), Basic ("Hold Notes Down") |
| Sequencer (Kotlin) | `player2.sequencer.Sequencer` (status Stopped/Pending/Playing), `LightweightSequencerGroup`, `BeatService`, `BasicBeatService`, `BeatServiceMetronome`, `Quantization` |
| Routing | `InputCrossbar` (MIDI in → detectors / triggers / synth), `OutputCrossbar` (phrase → synth / MIDI out / export), `MIDIStormProtector` |
| Synth (Kotlin) | `player2.Synth`, `player2.synth.FluidSynth`, `FluidSynthEngine` (FluidSynth wrapper), `SynthEffects` |
| Apple layer (ObjC++) | `AppleSynth` (AVAudioEngine + `AVAudioUnitSampler` ×2 for instrument and metronome + `AVAudioUnitReverb` + `AVAudioUnitDelay` + mixer), `AppleSequencer`, `AppleAutonomousSequencer`, `AppleSlaveSequencer` (host-driven in AU), `OfflineRenderer` (audio export), `CoreAudioDevice`, `AppleMIDIInput`, `AppleMIDIOutput`, `MIDIQueue`, `MIDIQueueThread`, `SynthMIDIAudioUnit`, `AUMIDIOutputBlockSinkAdapter`, `ABLink`/`ABLink_MacOS` (Ableton Link: tempo + peer count callbacks, `suggestTempo:`) |

Inferred: on macOS/iOS the Apple layer (AVAudioUnitSampler loading SF2 files) does the sound; the FluidSynth classes are the shared Kotlin path (used on other platforms or for rendering).

## 2. Instruments and sound banks

`Instrument` enum (exact order and labels):

| # | Enum | en | fr | Sound bank (exact) | Bank / program / octave shift (exact) |
|---|---|---|---|---|---|
| 0 | Piano | Piano | Piano | soundfonts/piano.sf2 ("Yamaha Grand Piano") | 0 / 3 / 0 |
| 1 | ElectricPiano | Electric Piano | Piano électrique | soundfonts/fulltines-lite.sf2 (FM EP "FullTines", CC0) | 0 / 5 / 0 (a value 9 is also loaded nearby; meaning not resolved) |
| 2 | Guitar | Acoustic Guitar | Guitare acoustique | soundfonts/guitar.sf2 | 0 / 0 / 0 |
| 3 | Strings | Strings | Cordes | soundfonts/strings.sf2 (TimGM6mb) | 0 / 48 / 0 |
| 4 | ElectricPiano2 | Vintage Electric Piano | Piano électrique vintage | soundfonts/rhodes.sf2 | 0 / 0 / 0 |
| 5 | Organ | Organ | Orgue | soundfonts/b3.sf2 (Hammond B3) | 0 / 0 / 0 |
| 6 | SweepPad | Sweep Pad | Pad à balayage | soundfonts/sweep.sf2 | 0 / 0 / 0 |
| 7 | NewAgePad | New Age Pad | Pad nouvel âge | soundfonts/atmosphere.sf2 | 0 / 99 / 0 |
| 8 | AnalogStrings | Analog Strings | Cordes analogiques | soundfonts/SynthStrings1.sf2 | 0 / 0 / 0 |
| 9 | ClassicalGuitar | Classical Guitar | Guitare classique | soundfonts/nylon.sf2 | 0 / 0 / −1 |
| 10 | TwelveStringGuitar | Twelve-String Guitar | Guitare à 12 cordes | soundfonts/12string.sf2 | 0 / 25 / −1 |
| 11 | ElectricGuitar | Electric Guitar | Guitare électrique | soundfonts/strat.sf2 | 0 / 0 / −1 |
| 12 | Ukulele | Ukulele | Ukulélé | soundfonts/nylon.sf2 (20-char path reused; inferred) | 0 / 0 / −1 |
| 13 | UkuleleSteel | Ukulele (Steel) | Ukulélé (Acier) | reused path (guitar.sf2 inferred) | 0 / 0 / 0 |
| 14 | Accordion | Accordion | Accordéon | no entry in `Instruments.framework` (not available in Suggester; inferred to belong to ChordPadX, which shares the engine) | — |
| — | Metronome | — | — | soundfonts/metronome.sf2 | 0 / 69 / 0 |

`InstrumentClass` = Keyboard, Guitar, Ukulele (exact). Guitar and ukulele classes switch the UI into diagram mode. The guitar instruments play one octave lower (octave shift −1).

## 3. Playback options (document level)

- Tempo: `Tempo(value)` integer BPM; `FineTempo(value)`; tap tempo detector in `TempoPropertyRow` (exact type). Default value not resolved (120 inferred). In the AudioUnit the host owns tempo: "In AudioUnit mode, the playback state, the song position, the time signature and the tempo are controlled by the host." (exact).
- Time signature: numerator 1–16, denominator 2/4/8/16, default 4/4 (exact).
- Loop: document property `Looping`; menu `Loop`.
- Volumes and mutes: `InstrumentVolume`, `InstrumentMute`, `MetronomeVolume`, `MetronomeMute` (exact property names); metronome sound selectable (`MetronomeSound`, label "Metronome Sound").
- Instrument sound per document: `InstrumentSound` (label "Instrument Sound").
- Effects (`SynthEffects`): `active` (label "Effects"/"Activés"), `reverbAmount` ("Reverb"), `delayAmount`, `delayFeedback` ("Delay Feedback"), `delayDuration` ("Delay Time"). Default values not resolved.
- Durations: `Duration` enum (exact): WholeNote, HalfNote, QuarterNote, EighthNote, DottedHalfNote, DottedQuarterNote, DottedEighthNote, SixteenthNote, DoubleWholeNote, DottedWholeNote, DottedSixteenthNote, ThirtySecondNote, SixtyFourthNote, with symbols 1, ½, ¼, ⅛, ¾, ⅜, ³⁄₁₆, ¹⁄₁₆, 2, 1 ¹⁄₂, ³⁄₃₂, ¹⁄₃₂, ¹⁄₆₄ and rest names (Whole Rest/Pause, …). `FineDuration(integer, numerator, denominator)` for custom lengths. Glyph assets `note-006 … note-800`, `rest-006 … rest-800` (file names encode 1/64 … 8 whole notes: 006 = 0.0625? inferred naming = duration × 100).
- Arpeggiation (`Arpeggiation(mode, stepLength, monophonic, holdLastStep)`): mode Off / Up / Down / SkipUp / SkipDown (labels Éteint/Montant/Descendant/Montant par saut/Descendant par saut), step length a `Duration`, Voices Polyphonic/Monophonic. Default arpeggiation per document (`DefaultArpeggiation`) and per chord override (`arpeggiationOverride`). Two built-in presets are created lazily in `Arpeggiation.$init_global`: one with mode Off, one with mode Up and step `SixtyFourthNote` (exact values; their names not resolved).
- Humanization (`Humanization(timing, velocity, random)`): `humanizedVelocity(Int)`, `humanizedBeatOffsetFor(BeatValue)`. Default object holds 0.25 and 64 (exact numbers; inferred timing = 0.25, velocity = 64).
- Response curves (ChordPadX velocity curves, shared): `ResponseCurve(shape, floor, ceiling, threshold, saturation)`, shapes Linear, Exponential, InverseExponential, Sine, Compressed.
- Quantization (`player2.beat.Quantization`): Bar ("Quantize to Bar"), Beat ("Quantize to Beat"), None ("Play Instantly"), SongCountIn1Bar ("1 Bar Count-In"), SongCountIn2Bars, SongCountIn4Bars, SongInstant. Preview default None; song default SongInstant (exact).
- Voicing: `extendTriads` ("Double the Root of Triads") and `haveBass` ("Play Bass") both default true; the bass goes to the Bass channel (`PhraseEvent.Channel.Bass`).
- Playback settings sheet pages: audio, arpeggiation, humanization (exact enum). "Some settings cannot be modified during playback." `Plays in the Background` (setting `playsInTheBackground`).

## 4. MIDI

- MIDI input: enable (`midiInputEnabled`), source endpoint (`midiInputSource`), channel (`MIDIChannel` Channel1–Channel16 or `Omni`, default **Omni**), a virtual destination with a stable unique ID (`midiInputPublicDestinationUniqueID`). Uses: chord detector, melody scale detector, MIDI triggers. Input crossbar forwards to the on-screen piano.
- MIDI triggers ("MIDI Trigger Mode"): `TriggerSet(triggers: [Trigger(midiKey, …)])` maps a MIDI key to a chord. Conflict dialog (exact): "This MIDI key is already assigned to a chord. Would you like to replace the existing mapping?" `Replace`. Label `MIDI Key`/`Touche MIDI`.
- MIDI output: enable, destination endpoint, normal channel (default Channel1), bass channel (default Channel1), octave shift, virtual source with stable unique ID. `sendControlChangeAllNotesOff` on stop (exact lambda name).
- Bluetooth MIDI: `BluetoothSettingsView`, `BluetoothMIDIDevicesView` ("Configure Bluetooth Devices"; Info.plist: "Enables the app to connect with MIDI Bluetooth devices.").
- Feedback protection: `MIDIStormProtector` shuts MIDI input down when a loop is detected (strings in UI_FLOWS_AND_MENUS.md).
- MIDI file export: `MIDIDataGenerator` with `TrackStructure` SeparateBassTrack (default; extra track named `<title> (Bass)`) or SingleTrack; `midiExportArpeggiatorType` Pedal (default) or Basic; octave shift; meta events `MIDITrackName`, `MIDITempo`, `MIDITimeSignature`, `MIDIKeySignature`, Yamaha XF `MIDIXFChord` and `MIDIXFVersion` (chord names embedded for DAWs/notation). Note: "The sustain pedal is recommended, especially when exporting to sheet music software."
- Drag and drop: single chords or selections are offered as MIDI files (`TransferableMIDIChordEvent`, `MIDITransferableChordEventItemProvider`) — "You can drag chords directly from Suggester to another app that supports MIDI files, such as Logic Pro."
- Text export: `SongFormatter` writes "Time Signature: ", "Tempo: ", " BPM" header lines, sections `(section)`, rests `(rest)`, text `(text)`.
- Audio export: `OfflineRenderer` (`initWithPhrase:instrument:…:synthEffects:metronome:…:destinationUrl:`), "Export Audio File".

## 5. AudioUnit plug-in

`PlugIns/AudioUnitExtension.appex` (exact Info.plist): two components, both manufacturer `MRou`, subtype `SugP`, version 67072, factory `AudioUnitExtension.AudioUnitViewController`, tags MIDI + Synthesizer:
- `aumu` "Mathieu Routhier: Suggester 2" (instrument; plays its own sounds)
- `aumi` "Mathieu Routhier: Suggester 2 (MIDI)" (MIDI processor; outputs MIDI to the host)

The plug-in hosts the same document editor (`DocumentEditorView` with `ExecutableType.appExtension`) and the same document model; the host drives transport (`AppleSlaveSequencer`). Locked mode: "In locked mode, MIDI features are disabled: the plugin outputs no MIDI data." Parameter tree types exist (`ParameterTreeSpec`, `ParameterGroupSpec`, `ParameterSpec`) but no parameter identifiers were found as strings.

## 6. Ableton Link

`ABLink` / `ABLink_MacOS` wrap `ableton::BasicLink` (C++ symbols present: tempo callback, num-peers callback, start/stop callback). Tempo sync with other Link apps on the network (inferred from the SDK's purpose; no UI string named "Link" was found besides the internal thread name "Link Main").
