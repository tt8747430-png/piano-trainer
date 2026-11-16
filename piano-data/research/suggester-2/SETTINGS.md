# Settings

All key names below are **exact** (Kotlin field names, legacy UserDefaults key names, Swift enum cases). Defaults are **exact** when the text says so (read from the `*.defaults` objects); "inferred" otherwise. Full machine-readable version: `data/settings.json`.

## 1. Storage

- Settings live in Kotlin data classes serialised with kotlinx.serialization (SuggesterSettingsData contains playerSettings: PlayerSettingsData, which contains musicSettings: MusicSettingsData). The Swift side wraps them (MRSuggesterSettingsModel, ObservableSettings). exact (class and field names).
- The Legacy*Options.keys objects hold flat key names used by older versions; they are read for migration. exact.
- No preference plist for com.mathieurouthier.Suggester2 existed in ~/Library/Containers/com.mathieurouthier.Suggester2/Data/Library/Preferences at the time of reading (only com.apple.security*.plist). So no stored key names could be confirmed from disk.
- App group (exact string): `group.com.mathieurouthier.Suggester` (no container existed on this Mac).

## 2. Settings window structure

`SettingsSuperSection` (exact): `main`, `midi`, `purchases`, `app`.

`SettingsSection` (exact order): `general`, `userinterface`, `guitar`, `audio`, `sync`, `export`, `midiInput`, `midiOutput`, `midiBluetooth`, `application`, `purchases`.

| Section | Label | 
|---|---|
| general | General |
| userinterface | User Interface |
| guitar | Guitar |
| audio | Audio |
| sync | Sync |
| export | Export |
| midiInput | MIDI Input |
| midiOutput | MIDI Output |
| midiBluetooth | Bluetooth ("Configure Bluetooth Devices") |
| application | About the app |
| purchases | Purchases |

Views (exact): GeneralSettingsView, SettingsSplitView, GuitarSettingsView, AudioSettingsView, SyncSettingsView, ExportSettingsView, MIDIInputSettingsView / InternalMIDIInputSettingsView, MIDIOutputSettingsView / InternalMIDIOutputSettingsView, BluetoothSettingsView / BluetoothMIDIDevicesView, ApplicationSettingsView, SuggesterCustomStoreView.

SF Symbols found next to the section labels in the binary: clock, info.circle, speaker.wave.2, switch.2, pianokeys, Guitar (asset), cable.connector.horizontal, app.connected.to.app.below.fill. Exact names; which icon belongs to which section is inferred.

Other labels in the settings code (exact): `User Interface`, `Row Size`, `Panel Size` with sizes `Extra Small`, `Small`, `Medium`, `Large`, `Extra Large`, `Extra Extra Large`, `Extra Extra Extra Large`, `System` (follow Dynamic Type) and `Standard`; `Visual Theme`; `Instrument Sound`; `Metronome Sound`; `Audio Output`; `MIDI Input`; `MIDI Output`; `AppStore Synchronization`; `Sync` (iCloud/App Store purchase sync, inferred).

## 3. All settings

| Group | Key | Type / values | Label | UI section | Default |
|---|---|---|---|---|---|
| MusicSettingsData | `simplifyAccidentals` | Boolean | Simplify Accidentals / Simplifier les altérations | general (Spelling / Orthographe) | not read (FormattingSettings.defaults stores only notationSystem; Boolean default false inferred) |
| MusicSettingsData | `notationSystem` | NotationSystem {English, FixedDo} | Notation System / Système de notation<br>help: The English notation uses letters (C,D,E); the Fixed-do notation uses names (do, re, mi). | general | English (exact, FormattingSettings.defaults) |
| MusicSettingsData | `languageCode` | String |  | none visible (legacy key in LegacyFormattingOptions) | unknown |
| MusicSettingsData | `durationForAddingToSong` (legacy `defaultNoteDuration`) | Duration | Note Duration · When Adding to Song / Durée des notes · Ajouts à la chanson | general | HalfNote (value exact; field mapping inferred) |
| MusicSettingsData | `durationForPreview` (legacy `previewNoteDuration`) | Duration | Note Duration · Previews / Durée des notes · Aperçus | general | WholeNote (value exact; field mapping inferred) |
| MusicSettingsData | `hideInconvenientEnharmonicScales` | Boolean | Hide Complicated Enharmonic Scales / Cacher les gammes enharmoniques compliquées | general | true (first Boolean byte = 1 in ScaleSettings.defaults; mapping inferred) |
| MusicSettingsData | `showScaleDegreeWhenPickingNote` | Boolean | Show Scale Degree When Picking Note / Montrer le degré de gamme lors de la sélection d'une note | general | false (second Boolean byte = 0; mapping inferred) |
| MusicSettingsData | `handedness` | Handedness {Left, Right} | Left-handed / Right-handed | guitar | Right (exact, GuitarSettings.defaults) |
| MusicSettingsData | `guitarDiagramSize` | GuitarDiagramSize {FourFrets, FiveFrets} | Diagram Size / Taille de diagramme | guitar | FourFrets (exact: GuitarDiagramSize VALUES index 1 of the sorted pair FiveFrets, FourFrets) |
| MusicSettingsData | `midiExportOctaveShift` | OctaveValue (Int) |  | export | OctaveValue constant read from a shared global (0 inferred) |
| MusicSettingsData | `midiExportTrackStructure` | TrackStructure {SeparateBassTrack, SingleTrack} | Track Structure / Structure de piste | export (MIDI File Export) | SeparateBassTrack (exact) |
| MusicSettingsData | `midiExportArpeggiatorType` | ArpeggiatorType {Pedal, Basic} | Method of Play / Méthode de jeu<br>values: Pedal = Sustain Pedal; Basic = Hold Notes Down<br>help: The sustain pedal is recommended, especially when exporting to sheet music software. | export | Pedal (exact) |
| MusicSettingsData (VoicingSettings) | `extendTriads` | Boolean | Double the Root of Triads / Doubler la racine des triades | audio / playback | true (exact: VoicingSettings.defaults writes 0x0101) |
| MusicSettingsData (VoicingSettings) | `haveBass` | Boolean | Play Bass / Jouer la basse | audio / playback | true (exact) |
| ArpeggiatorSettings | `arpeggiatorType` | ArpeggiatorType |  |  | Pedal (exact) |
| PlayerSettingsData | `playsInTheBackground` | Boolean | Plays in the Background | audio | not read |
| PlayerSettingsData | `midiInputChannel` | MIDIChannel {Channel1..Channel16, Omni} | Channel / Omni (All channels) | midiInput | Omni (exact: InputCrossbar.Settings.defaults → MIDIChannel sorted VALUES index 16) |
| PlayerSettingsData | `audioOutputOctaveShift` | OctaveValue | Audio Output · Octave Shift | audio | same OctaveValue constant as other octave defaults (0 inferred) |
| PlayerSettingsData | `midiOutputNormalChannel` (legacy `midiOutputChannel`) | MIDIChannel | Normal Channel / Canal normal | midiOutput | Channel1 (exact: sorted VALUES index 0) |
| PlayerSettingsData | `midiOutputBassChannel` | MIDIChannel | Bass Channel / Canal de basse | midiOutput | Channel1 (exact: sorted VALUES index 0) |
| PlayerSettingsData | `midiOutputOctaveShift` | OctaveValue |  | midiOutput | 0 inferred |
| PlayerSettingsData | `midiInputEnabled` | Boolean | MIDI Input | midiInput | not determined |
| PlayerSettingsData | `midiInputSource` | MIDI endpoint |  | midiInput | a shared 'none' endpoint constant (exact global; meaning inferred) |
| PlayerSettingsData | `midiInputIdentity / legacy midiInputPublicDestinationUniqueID` | MIDIEndpointUniqueID (Integer or String) |  | midiInput (virtual destination identity) | generated |
| PlayerSettingsData | `midiOutputEnabled` | Boolean | MIDI Output | midiOutput | not determined |
| PlayerSettingsData | `midiOutputDestination` | MIDI endpoint | Destination | midiOutput | 'none' endpoint constant (inferred) |
| PlayerSettingsData | `midiOutputIdentity / legacy midiOutputPublicSourceUniqueID` | MIDIEndpointUniqueID |  | midiOutput | generated |
| SuggesterSettingsData | `previewQuantization` | Quantization {Bar, Beat, None, SongCountIn1Bar, SongCountIn2Bars, SongCountIn4Bars, SongInstant} | Preview Quantization / Quantification des aperçus<br>values: Bar = Quantize to Bar; Beat = Quantize to Beat; None = Play Instantly; SongCountIn1Bar = 1 Bar Count-In; SongCountIn2Bars = 2 Bars Count-In; SongCountIn4Bars = 4 Bars Count-In; SongInstant = Play Instantly (song) | Playback Settings / timing | None (exact) |
| SuggesterSettingsData | `songQuantization` | Quantization | Playback Quantization / Quantification de la lecture |  | SongInstant (exact) |
| SuggesterSettingsData | `firstLaunchDate` | ISO-8601 string |  | none (launch logic) | null; set on first launch (exact: SuggesterLaunchLogic prints "FIRST LAUNCH") |
| SuggesterSettingsData | `currentVersion` | String |  |  | null; set to the app version on first launch of a version ("FIRST LAUNCH FOR VERSION ") |
| SuggesterSettingsData | `currentVersionFirstLaunchDate` | ISO-8601 string |  |  | null |
| SuggesterSettingsData | `reviewTriggerCounter` | Int |  |  | 0 |
| SuggesterSettingsData | `lastReviewProposalVersion` | String |  |  | null |
| SuggesterSettingsData | `lastReviewProposalDate` | ISO-8601 string |  |  | null |
| SuggesterSettingsData | `songRowSize` | size enum (labels: Extra Small, Small, Medium, Large, Extra Large, Extra Extra Large, Extra Extra Extra Large) | Row Size | userinterface | 0/null in defaults object (system/dynamic type inferred) |
| SuggesterSettingsData | `chordCollectionPanelSize` | same size enum | Panel Size | userinterface | 0/null (inferred) |
| SuggesterSettingsData | `onboardingVersionCompleted` | Int? |  |  | null |
| SuggesterSettingsData | `visualTheme` | VisualTheme {Light, Dark, Auto} | Visual Theme / Thème visuel<br>values: Light = Light/Clair; Dark = Dark/Sombre; Auto = Automatic/Automatique | userinterface | Auto (exact) |
| Legacy only | `tutorialCompleted` |  |  |  | - |

## 4. Legacy UserDefaults keys (exact)

| Object | Keys |
|---|---|
| LegacyArpeggiatorOptions | `arpeggiatorType` |
| ChordUseCase.LegacyOptions | `defaultNoteDuration`, `previewNoteDuration` |
| LegacyVoicingOptions | `extendTriads`, `haveBass` |
| LegacyGuitarOptions | `handedness`, `guitarDiagramSize` |
| LegacyFormattingOptions | `simplifyAccidentals`, `notationSystem`, `languageCode` |
| LegacyMIDIExportOptions | `midiExportOctaveShift`, `midiExportTrackStructure`, `midiExportArpeggiatorType` |
| LegacyScaleOptions | `hideInconvenientEnharmonicScales`, `showScaleDegreeWhenPickingNote` |
| InputCrossbar.LegacyOptions | `midiInputChannel` |
| OutputCrossbar.LegacyOptions | `audioOutputOctaveShift`, `midiOutputChannel`, `midiOutputBassChannel`, `midiOutputOctaveShift` |
| Synth.LegacyOptions | `playsInTheBackground` |
| MIDIInput.LegacyOptions | `midiInputEnabled`, `midiInputSource`, `midiInputPublicDestinationUniqueID` |
| MIDIOutput.LegacyOptions | `midiOutputEnabled`, `midiOutputDestination`, `midiOutputPublicSourceUniqueID` |
| LegacySuggesterOptions | `previewQuantization`, `songQuantization`, `firstLaunchDate`, `reviewTriggerCounter`, `lastReviewProposalVersion`, `songRowSize`, `chordCollectionPanelSize` |
| LegacyTutorialOptions | `tutorialCompleted` |
| LegacyChordPadXOptions (shared engine, not used by Suggester UI) | `showPiano`, `padStyle`, `quantization`, `touchVelocityCurve`, `midiInputVelocityCurve`, `showChordNameOnPads`, `showRomanNumeralsOnPads`, `showMIDIBindingOnPads`, `firstLaunchDate`, `reviewTriggerCounter`, `lastReviewProposalVersion` |

## 5. Document-level settings

- Properties (exact): Title, Song, DefaultArpeggiation, DefaultHumanization, Instrument, Tuning, SelectedScaleMarker, InstrumentSound, InstrumentVolume, MetronomeSound, MetronomeVolume, SynthEffects, Looping.
- SynthEffects fields (exact): active, reverbAmount, delayAmount, delayFeedback, delayDuration; labels Effects/Effets, Reverb/Réverbération, Delay Feedback/Feedback du delay, Delay Time/Temps du delay.
- Humanization fields (exact): timing (TimingValue), velocity (VelocityValue), random; default object values 0.25 and 64 (mapping inferred).
- Arpeggiation fields (exact): mode (ArpeggioMode Off/Up/Down/SkipUp/SkipDown); stepLength (Duration); monophonic (Boolean, labels Polyphonic/Monophonic); holdLastStep (Boolean).
- Time signature: numerator 1..16 (exact, IntRange(1,16)), denominators 2/4/8/16, default 4/4 (exact).
- Tempo: Tempo(value: Int BPM); default value read from a shared constant, not resolved (120 inferred).

## 6. Launch logic and review prompt

`SuggesterLaunchLogic(settingsModel, appVersion, …)` (exact): on first launch it prints `FIRST LAUNCH` and stores `firstLaunchDate` (ISO-8601, `toISO8601`/`parseISO8601`). On the first launch of a new version it prints `FIRST LAUNCH FOR VERSION <v>` and stores `currentVersion` and `currentVersionFirstLaunchDate`. It decides when to ask for a review (`SHOULD REQUEST REVIEW (… days passed since last request)` / `… minutes after first launch of new version)`), using `reviewTriggerCounter`, `lastReviewProposalVersion`, `lastReviewProposalDate`. The thresholds are constructor arguments (two Ints) passed from Swift and were not resolved.
