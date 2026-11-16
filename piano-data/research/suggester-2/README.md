# Suggester 2 — static reverse-engineering reference

Subject: `/Applications/Suggester 2.app` — Mathieu Routhier, bundle id `com.mathieurouthier.Suggester2`, version 6.2.1 (build 153), Mac App Store, minimum macOS 14, built with Xcode 27.2 / SDK macOS 27.2, universal (arm64 + x86_64).

Purpose: reference for the owner's TypeScript web piano trainer. Every statement is marked **exact** (read from code, strings or data, with the source named) or **inferred**.

Rules followed: the app was never launched, no network access was used, nothing in `/Applications` was modified. The app's preference domain held no stored keys on this Mac (nothing personal was read). Only openly licensed media was exported.

## Big picture (exact)

- UI: Swift/SwiftUI in `DocumentEditor.framework` (+ thin app shell `MacOS/Suggester 2`, AU v3 extension).
- Engine: **Kotlin Multiplatform compiled with Kotlin/Native** into `MRMusicSuite.framework` (29 MB, full symbol names kept). Packages `music2` (theory), `player2` (sequencer/MIDI), `suggester` (document, settings), shared with the author's ChordPadX and ChordShapes apps.
- Sound: AVAudioEngine + AVAudioUnitSampler playing 13 SoundFont 2 banks; reverb + delay; Ableton Link.
- Documents: JSON (kotlinx.serialization), extension `.suggx`.

## Files

| File | Contents |
|---|---|
| [THEORY_ENGINE.md](THEORY_ENGINE.md) | Intervals (46), chord types (64, with formulas), scales (31), degrees (36), chord roles, chord-suggestion algorithm, alterations, voice leading, naming and Roman numerals, spelling, text input, detection, borrowing/modulation, classic progressions, guitar engine |
| [UI_FLOWS_AND_MENUS.md](UI_FLOWS_AND_MENUS.md) | Windows, welcome/onboarding, editor layout, workspace sections, sheets, context menu, main menu, store, links |
| [COMPONENTS_LAYOUT_MOTION.md](COMPONENTS_LAYOUT_MOTION.md) | SwiftUI modules and components, layout constants, colours, typography, SF Symbols and custom icons, animations |
| [SETTINGS.md](SETTINGS.md) | Every setting key, type, label, UI section and default; legacy keys; launch/review logic |
| [PLAYER_AND_MIDI.md](PLAYER_AND_MIDI.md) | Audio architecture, instruments → sound banks (bank/program/octave), playback options, arpeggiator, humanisation, quantisation, MIDI in/out/triggers/export, AudioUnit, Ableton Link |
| [DOCUMENT_FORMAT.md](DOCUMENT_FORMAT.md) | File types, JSON schema of a `.suggx` document, versions, pasteboard types |
| [LOCALISATION.md](LOCALISATION.md) | Full en/fr `Localizable.strings`, `InfoPlist.strings`, `AppShortcuts.strings`, intents; where engine strings live |
| [RESOURCES_AND_LICENCES.md](RESOURCES_AND_LICENCES.md) | Every bundled file and component with licence status |
| [PIANO_TRAINER_TAKEAWAYS.md](PIANO_TRAINER_TAKEAWAYS.md) | 34 concrete items to adopt |
| `data/intervals.json` | 46 intervals: ordinal, semitones, generic number, symbol (exact) |
| `data/chords.json` | 64 chord types: intervals, omittable, semitones, degree symbols, class (inferred) |
| `data/scales.json` | 31 scales: intervals, semitones, step pattern, en/fr titles |
| `data/scale_degrees.json` | 36 degrees with caret/Roman strings |
| `data/chord_roles.json` | 9 roles with construction rules |
| `data/classic_progressions.json` | 7 groups, 28 progressions, step by step |
| `data/enums.json` | All decoded Kotlin enums in declaration order (instruments, durations, notes, quantisation, colours, …) |
| `data/settings.json` | Settings, defaults, legacy keys, document-level settings |
| `data/strings_app_en_fr.json` | All Apple string tables (en + fr) |
| `data/strings_engine_literals_in_binary_order.json` | 2,701 engine string literals (en/fr pairs adjacent) |
| `data/swift_ui_types.json` | All Swift types and fields of the app, DocumentEditor and AU binaries |
| `data/assets.json` | Asset-catalog inventory with colour values |
| `data/sf_symbols_and_icons.json` | SF Symbol names and custom symbol assets |
| `exported/BravuraText/` | BravuraText.otf + OFL.txt + README (SIL OFL 1.1) |
| `exported/fulltines-lite/` | fulltines-lite.sf2 + LICENSE.txt (CC0 1.0) |
| `tools/` | The Node scripts and the Ghidra script used (see Method) |

## Method (how to reproduce)

1. `lipo -thin arm64` each binary.
2. Kotlin/Native strings: `tools/knconst.js` scans `__DATA_CONST` for objects whose type pointer is `kclass:kotlin.String` (layout: typeinfo|flags, count, hash, flags, UTF-16 chars; `count−1` chars at +18).
3. Kotlin symbols: `nm` (full `kfun:` signatures are present).
4. Decompile: Ghidra 12.2 headless, import with `-noanalysis`, then `tools/DecompMatching.java` creates functions only for matched symbols and decompiles them (payload limit raised to 1 GB for the large enum initialisers).
5. Post-process: `tools/resolve2.js` (replace string and function addresses with names), `tools/enums.js` (enum entries per initialiser), `tools/subst.js` (replace `VALUES[i]` loads with entry names, using the alphabetical sort of Kotlin/Native `VALUES`), `tools/trace.js` (follow arrays into `listOf`/constructor calls), `tools/patterns.js` (classic progressions).
6. Swift: `tools/swiftmeta.js` parses `__swift5_types`/`__swift5_fieldmd`; `tools/smallstr.js` decodes ≤15-byte Swift string literals from `mov/movk` immediates; `tools/stubmap.js` names stub calls via `dyld_info -fixups`; `tools/pfi.js` and `tools/animcalls.js` read numeric constants.
7. Resources: `assetutil --info`, `plutil -p`, `tools/sf2info.js` (SoundFont INFO chunk), `tools/fontname.js` (OpenType name table).

## Known gaps

See the final section of THEORY_ENGINE.md and the "not determined" notes in each file: keyboard shortcuts, most `@ScaledMetric` values, tuning string notes, guitar-scoring weights, chord-name concatenation order, default tempo, effect defaults, the bodies of the scale-palette and scale-detector functions (inlined into the Objective-C bridge).
