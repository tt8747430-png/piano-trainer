# Chordio 3.3.0 (com.oneinabillion.chordmaster): static reverse-engineering

Status: **complete**. Static analysis only; the app was never launched.

## Target
- `/Applications/Chordio.app`, v3.3.0, build 5625, from the Mac App Store.
- An **iPad app running on macOS** (UIDeviceFamily 2, iOSSupport UIKit; min macOS 14), universal x86_64 + arm64.
- Code is mostly Objective-C (625 classes), with a few Swift classes (Harmony Explorer, ChordPredictor, GLN piano, onboarding).
- Libraries: MIKMIDI.framework, Ableton Link (C++/asio), Core Data (NSPersistentCloudKitContainer), Core ML (LSTM chord suggester), and a stripped C++ chord analyser.
- Developer: One In A Billion (chordio.co.uk).

## Files
| File | Contents |
|---|---|
| [CONTENT_FORMATS.md](CONTENT_FORMATS.md) | `.cla` lessons, `.sheetmusicpack`, `.chordpack`, `.csm`, `.cpl`: full schemas (ChordModel's 43 fields) and statistics (6 lessons, 9 sheet packs / 108 scores, 7 chord packs / 556 progressions / 6149 chords) |
| [DATA_MODEL.md](DATA_MODEL.md) | Core Data `Chordio.momd`: 7 entities with every attribute, type, default and relationship |
| [THEORY_ENGINE.md](THEORY_ENGINE.md) | detection pipeline, **ChordNameRanker cost algorithm with the full 27-template table**, display rules, voicings, scales (36+), Harmony Explorer, Krumhansl key detection, ML suggester architecture, Key Cycle |
| [PRACTICE_LESSON_PLAYER.md](PRACTICE_LESSON_PLAYER.md) | workspaces, lesson player, sheet-music player, **Wait Mode algorithm**, count-in, quizzes and scoring, practice aids |
| [ACCOMPANIMENT_SOUND_MIDI.md](ACCOMPANIMENT_SOUND_MIDI.md) | 38 drum styles and format, legacy loops, bassline styles and presets, chord patterns, swing presets, instruments, reverb presets, metronome and tap tempo, audio devices, MIDI in/out/sync, Link |
| [CIRCLE_OF_FIFTHS.md](CIRCLE_OF_FIFTHS.md) | mode-ring images for all 7 modes, the wheel UI and the voicing pie |
| [UI_FLOWS.md](UI_FLOWS.md) | 12 window scenes, **Mac menu bar with shortcuts**, main window, onboarding and 13 help chapters, store/paywall, visual system |
| [SETTINGS.md](SETTINGS.md) | in-app settings sections and about 150 UserDefaults keys by area |
| [LOCALISATION.md](LOCALISATION.md) | 7 locales (no Russian); en-GB/en-US layers |
| [RESOURCES_LICENCES.md](RESOURCES_LICENCES.md) | every resource with its status; third-party code |
| [ANALYTICS_PRIVACY.md](ANALYTICS_PRIVACY.md) | no analytics SDK; endpoints; privacy manifest |
| [PIANO_TRAINER_TAKEAWAYS.md](PIANO_TRAINER_TAKEAWAYS.md) | 30 adopt/avoid items, each mapped to a Piano Trainer area |
| `data/content_stats.json` | per-pack and per-item stats, aggregate histograms, schema key lists |
| `data/coredata_model.json` | Core Data model |
| `data/engine_tables.json` | ranker templates and penalties, name vocabulary (184), scale names, key profiles, swing presets, bassline presets, chord-pattern rates, circle-of-fifths ring |
| `data/chord_dictionary_tables.json` | ML vocabulary tables (804 classes, 67 qualities, 135 quality→semitones) |
| `data/drum_patterns.json` | DrumPatterns.json, copied for reference |
| `data/gm_drum_kit_maps.json` | GM note → FluidR3 sample for each of the 7 kits |
| `data/strings_en.json`, `data/stringsdict_en.json` | full English string table (2525 keys) and plurals |
| `export/` | FluidR3 GM drum WAVs (MIT) and Bravura (OFL), each with licence text. See `export/README.md` |

## Method
- Content: a Node NSKeyedArchiver/bplist decoder and a Node SMF parser (scratch `chordio/bplist.js`, `midi.js`, `stats.js`). Core Data decoded from the `.mom` archive.
- Binary:
  - `otool -oV` → classes, ivars, properties and methods. Relative selectors were resolved through selrefs (`objcparse.js`).
  - The `__cstring` dump was read in full.
  - Ghidra 12.2 headless decompiled the chosen functions: ranker, chord-result pipeline, Wait Mode, quizzes, key detection, menus, Key Cycle, bassline presets, swing catalogue, circle-of-fifths manager and tap tempo.
  - Constant tables were read straight from the Mach-O with Node, using chained-fixup pointer decoding.
- Images: three circle-of-fifths PNGs were viewed directly.

## Limits
- The **C++ chord analyser** that produces the candidate names (`findChordResultsFromChordNotes`) is stripped and was not fully decompiled. Its output format and vocabulary are documented; its exact spelling rules are not.
- **Swift** method bodies (Harmony Explorer lists, popular progressions, detected-scale ranking) were not decompiled. Their behaviour is documented from UI strings.
- The **paywall feature list** cannot be determined statically. Only "Premium needed before packs" and "preview-limited packs" are certain.
- The user preferences plist was unreadable (macOS container privacy), so default values come only from code where shown.
- No runtime measurements (latency, animation timings beyond the constants quoted).
