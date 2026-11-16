# Sound, instruments, MIDI

## 1. Engine
AudioKit (SPM bundle `AudioKit_AudioKit.bundle`) with SoundFont (SF2) sampler playback; reverb (`reverbEnabled`, `reverbMix`, `reverbPresetIndex`), volume, `playSound`, `muteExternalMIDIAudio`, `muteOnscreenKeyboardAudio`, live rewind (`liveRewindEnabled`, `liveRewindDuration`), playback speed (`PlaybackSpeed`), loop bars. Metronome settings stored as JSON (`metronomeSettingsJSON`, `metronomeRevision`); accent levels strong/medium/light/none, subdivisions beat/eighth/triplet/sixteenth/silent (exact strings). Ear-training chimes, narration via system voices (`NarrationService`, `NarrationVoiceCatalog`, `selectedNarrationVoiceIdentifier`; guide to download Enhanced/Premium voices).

## 2. Bundled SoundFonts (INFO chunk read from each file; exact)
| File | Size | INAM | ifil / isng | ICOP / ICMT (licence evidence in file) | App catalog licence | Status |
|---|---|---|---|---|---|---|
| GeneralUser-GS.sf2 | 32,319,396 | GeneralUser GS 2.0.3 BETA | 2.1 / E-mu 10K2 | ICOP "1997-2025 by S. Christian Collins"; ICMT = License v2.0: free use incl. commercial, may be used in software and modified/repackaged | not in catalog; credits "free use with attribution" | **Exported** with licence text |
| M-Clean_Guitar.sf2 | 20,877,122 | M-Clean Guitar | 2.1 / EMU8000 | ICOP "Creative Commons 0 1.0"; IENG Yingchun Soul, et. al. | CC0 1.0 (Yingchun Soul, FreePats, Karoryfer) | **Exported** (CC0) |
| Celesta_Tuned_Denoised_Mix.sf2 | 66,290,850 | Celesta Tuned Denoised Mix | 2.1 / EMU8000 | ICOP "Creative Commons 0"; IENG Neil Bickford, Patrick Gardner, Grant Huang, Samuel Neubuerger; ICRD 2 May 2020 | CC BY 3.0, "Daniel Militello" (musical-artifacts 2585) | **Exported**; conflict noted, attribution kept |
| GC_Alto_Sax.sf2 | 4,298,150 | Juno Alto Sax | 2.1 / Generic | none | CC BY 3.0, "HGC Production" | Not exported: no licence in file; INAM "Juno" suggests a Roland-derived source (doubtful) |
| Guitar Spanish Classical.sf2 | 19,822,546 | Spanish classical guitar | 2.1 / EMU8000 | ICMT freepats URL only | none | Not exported: no licence in file |
| Piano FM.sf2 | 43,783,782 | FM Synthesized Piano 1 | 2.1 / EMU8000 | ICMT freepats URL only | none | Not exported |
| Piano Upright.sf2 | 57,377,848 | Upright Piano KW | 2.1 / EMU8000 | ICMT freepats URL only | none | Not exported |
| Synth Lead.sf2 | 8,542,812 | Synth Bass & Lead | 2.1 / EMU8000 | ICMT freepats URL only | none | Not exported |

FreePats generally publishes under CC0/GPL-with-exception, but these files do not say which; per the rules they stay unexported. Note: catalog `sizeBytes` differ slightly from on-disk sizes for Guitar/Piano FM/Piano Upright/Synth Lead (catalog 19,406,848 vs 19,822,546 etc.): the bundled files were re-saved after cataloguing (exact numbers; cause inferred).

## 3. SoundFont catalog (`soundfont_catalog.json`, 14 entries; downloadable ones fetched from GitHub releases `Kevin-4Spaces/tiny-instrument-soundfonts`)
| id | Name | Category | Delivery | Availability | Licence (catalog) |
|---|---|---|---|---|---|
| brass-trombone-bright | Bright Trombone | brass | downloadable | available | WTFPL 2.0 (Guy) |
| celesta-tuned-denoised | Celesta | percussion | bundled | available | CC BY 3.0 |
| gc-alto-sax | Alto Sax | woodwinds | bundled | available | CC BY 3.0 |
| guitar-spanish-classical | Guitar Spanish Classical | guitar | bundled | available (starter) | — |
| m-clean-guitar | M-Clean Guitar | guitar | bundled | available | CC0 1.0 |
| piano-axolotl-grand | Axolotl Grand Piano | piano | downloadable | available | WTFPL 2.0 |
| piano-eastwest-yamaha-c7 | Piano EastWest Yamaha C7 | piano | downloadable (433 MB) | retired | CC BY 3.0 |
| piano-fb | Piano FB | piano | downloadable | available | CC0 1.0 (FreePats Old Piano FB) |
| piano-fm | Piano FM | piano | bundled | available (starter) | — |
| piano-kayserburg | Kayserburg Piano | piano | downloadable | available | CC BY 3.0 |
| piano-upright | Piano Upright | piano | bundled | available | — |
| synth-lead | Synth Lead | synth | bundled | available (starter) | — |
| violin-ldk1609 | Violin LDK | strings | downloadable (290 MB) | available | CC BY 3.0 |
| world-requinto-guitar | Requinto Guitar | world | downloadable | available | CC BY 3.0 |

Schema `SoundFontCatalogItem {id, displayName, filename, category (piano, guitar, synth, bass, strings, brass, woodwinds, percussion, world, fx), delivery bundled/downloadable, sizeBytes, summary, remoteURL?, availability available/retired, version?, sha256?, attribution{creatorName, creatorURL?, sourceName, sourceURL?, licenseName, licenseURL, attributionText, requiresAttribution}, isStarterRecommended}`. Install state `SoundFontInstallState {id, status notInstalled/downloading/installed/updateAvailable/failed, localFilename, installedVersion, lastError, installedAt}`; downloads are SHA-256-checked (field present). `SoundFontLibraryEntry.Source = bundledCatalog | downloadableCatalog | generalMIDI(program) | userImported` (users import .sf2 from Documents). Instrument picker shows an attribution sheet per item and a preview melody.

## 4. MIDI
- MIDIKit (IO, Core, SMF, Sync, UI, ControlSurfaces), TimecodeKit, MIDIControlKit (developer's own package).
- `MIDIControlKit_MIDIControlKit.bundle`: `MIDIControllerProfiles.json` (4 transport profiles: Arturia KeyLab, Akai MPK, Roland A-Series, Generic DAW; matched by lower-case name substrings) and `StandardCC.json` (48 CC names; credited to webmidi.js, Apache 2.0). Copied to `data/midi_controller_profiles.json`.
- Transport learn: `MIDITransportAction` (13): play, stop, pause, record, rewind, loopToggle, tapTempo, metronomeToggle, octaveUp, octaveDown, confirm, continue_, cancel; categories transport/timing/keyboard/session; trigger by CC number or note (`MIDITriggerThreshold` button/any); settings `midiContinueNote`, `midiCancelNote`, `midiConfirmNote`, `midiTransportChannel`.
- Inputs: `activeMidiInputs Set<String>`, split note and upper/lower tracks, channel selection, `enableMidiOutput`, Orchid-style chord pad mapping (`OrchidPadMap`, `OrchidBindingTarget` maj/min/sus/dim/six/m7/M7/nine/voicingUp/voicingDown/bass/keyMode; chord-out and bass-out channels).
- File types: opens `.mid`, `.sf2`, `.musicxml`, `.mxl`; exports MIDI (`MIDIFileExporter`) and MusicXML.
