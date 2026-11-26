# Resources and licences (Contents/Resources, 151 MB, 125 top-level items)

Status key: **EXPORTED** (openly licensed, copied to `export/`), **REF** (app data, summarised or copied to `data/` for reference only), **PROPRIETARY** (documented, not exported).

| Resource | Count / size | What it is | Licence / status |
|---|---|---|---|
| `Sounds/GM Drum Kits/` (7 kits) | 408 WAV + 7 .aupreset + 7 kit.json + README + licence, 31 MB | GM drum kits from FluidR3 GM | **MIT** (FluidR3 License file) → WAVs + licence **EXPORTED**; presets and README not exported |
| `Bravura.otf` | v1.392 | SMuFL notation font | **SIL OFL 1.1** (name table) → **EXPORTED** |
| `*.exs` + `Sampler Files/*` | 27 EXS instruments, 27 sample folders (mp3/m4a/aif/wav + `.mamd` metadata) | piano, Rhodes, strings, pads, guitar, vibes, basses, drum and percussion kits | PROPRIETARY, no licence |
| `gs_instruments.dls` | 1.3 MB | Roland GS sound set | © 1997 Roland Corporation, PROPRIETARY |
| `*.mid` (24) + `Cmaj.midi` | | 14 legacy drum loops; style demos (AHouseIsNotAHome, Georgia/Georgia1, SoloPiano, Keyboard, Blank); Valse Mélancolique (Rebikov) | PROPRIETARY (some are arrangements of copyrighted songs, e.g. "A House Is Not a Home", "Georgia"), not exported |
| `DrumPatterns.json` | 38 styles | step patterns | REF → `data/drum_patterns.json` (no licence) |
| `category_to_number.json`, `number_to_category.json`, `note_to_value.json`, `value_to_note.json`, `quality_to_components.json`, `unique_qualities.json` | | ML chord vocabulary | REF → `data/chord_dictionary_tables.json` |
| `MLChordSuggester.mlmodelc` | 189 KB weights | LSTM chord suggester by Juan Luis García López | licence "--" (none stated), PROPRIETARY/unknown, not exported |
| `.cla` lessons (6) | 17.8 MB | lessons with mp3, MIDI and PNG | PROPRIETARY, schema only |
| `.sheetmusicpack` (9) | 108 scores | | PROPRIETARY, schema and stats only (even public-domain pieces are the developer's arrangements) |
| `.chordpack` (7) | 556 progressions, 6149 chords | | PROPRIETARY, stats only |
| `Where Time Lingers.csm` | 1 score | A.R. Briscoe composition | PROPRIETARY |
| `Chordio.momd` | 7 entities | Core Data model | REF → `data/coredata_model.json` |
| `CircleOfFifth*Mode.png` (7) | 800×800 | mode rings | PROPRIETARY art, described in CIRCLE_OF_FIFTHS.md |
| `LessonImage0{5,7,8}_Square.png`, `AppIcon.icns`, `Assets.car` (343 images, 594 vector glyphs) | | art and icons | PROPRIETARY |
| `ChordioTip1.mp4`, `ChordioTip2.mp4` | | help videos | PROPRIETARY |
| `tick.aif`, `tock.aif` | | metronome clicks | PROPRIETARY, no licence |
| `Content/Data/LessonPacks/` | 1 HTML, 1 CSS, 1 PNG | in-app lesson-pack store page (WKWebView bridge) | PROPRIETARY |
| Storyboards (8) + `ChordSequenceViewController.nib` | | thin scene shells | — |
| `Settings.bundle` | | Xcode template, unused | — |
| `LinkKitResources.bundle` | 8 locales | Ableton Link settings UI strings | Ableton LinkKit licence (not bundled as text); not exported |
| `TFY_ProgressHUD.bundle` | 3 PNG | HUD icons from TFY_ProgressHUD 1.0.0 (com.LianQianLianjiCompany) | licence not bundled, not exported |
| `PrivacyInfo.xcprivacy` | | privacy manifest | see ANALYTICS_PRIVACY.md |
| `Frameworks/MIKMIDI.framework` | | MIKMIDI (Mixed In Key) MIDI library | MIKMIDI is MIT upstream (**inferred**, from knowledge; no licence text is bundled) |

## Third-party code identified in the binary (licence texts are not bundled; status from class and string evidence)
- **Ableton Link / LinkKit** (C++ `ableton::link`, `link_audio`, asio). The LinkKit SDK is licensed by Ableton (**inferred**). The ABL* classes are its settings UI.
- **asio** (Boost Software Licence upstream, **inferred**).
- **MidiSheetMusic-style score engine**: the classes `MidiFile, MidiTrack, MidiNote, MidiOptions, ChordSymbol, ClefMeasures, SymbolWidths, WhiteNote, AccidSymbol, BarSymbol, LyricSymbol, KeySignature, TimeSignature` and the file name `ChordSymbolView.m` match Madhav Vaidyanathan's MidiSheetMusic (GPL-2.0 upstream). This is **inferred** lineage, and no GPL notice is shipped. **Do not copy from Chordio.** If Piano Trainer wants this kind of engine, go to the upstream project and take its GPL obligations into account.
- UI helpers: FTPopOverMenu, JDFTooltips, TYAlertController, TLTransition, BLMultiColorLoader, FRHyperLabel, SWSegmentedController, NXTSegmentedControl, HBLockSliderView, DYFStore receipt verifier, EatsClock/EatsSwingUtils (from the "Eats" sequencer, **inferred**). These are all open-source projects upstream (**inferred**); no licence texts are bundled.
