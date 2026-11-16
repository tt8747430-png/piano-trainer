# Tiny Instrument 2.7.0 (build 5978) — static reverse-engineering

`/Applications/Tiny Instrument.app`, bundle id `dk.codeloop.TinyInstrument`, developer Codeloop (Kevin Andersson), Mac App Store, macOS 14.6+, universal (x86_64 + arm64) Swift/SwiftUI, 229 MB, Xcode project name "Chords", SDK macOS 27.0.

## Files
| File | Content |
|---|---|
| 01_CONTENT_MODEL.md | Hash JSON files (a leaked code graph), Song JSON schema + stats, MIDI stats, MusicXML, chord charts, saved data models, widget cards |
| 02_GAMIFICATION.md | XP formula, level curve + titles, daily/weekly challenges, 50 achievements, 5 leaderboards, streaks, celebrations, easter eggs |
| 03_LEARNING_PRACTICE.md | Modes, chapters/lessons/26 step types, courses + mastery rules, Play & Explore, 11 mini-games, ear training, practice modes, compose feedback, input, Aria AI |
| 04_DESIGN_SYSTEM.md | DesignSystem colour tokens (light/dark hex), mode ramps, keyboard themes/effects, 18 Metal shaders, notation fonts, engraving model, icons |
| 05_SOUND_MIDI.md | Engine, 8 bundled SoundFonts with INFO licences, 14-entry SoundFont catalog, MIDI profiles, transport learn |
| 06_SETTINGS_UI_PAYWALL.md | 280 settings keys (grouped), 7 IAP packs + 19 paywall sources, App Intents, widgets, deep links, screens |
| 07_ANALYTICS_PRIVACY_LOCALISATION.md | Aptabase events (35), permissions, locales (English only) |
| PIANO_TRAINER_TAKEAWAYS.md | 27 items to adopt/avoid, each mapped to a Piano Trainer area |
| data/*.json | game_center, challenges, gamification_rules, soundfont_catalog, settings_keys, analytics_events, storekit_products, songs_json_stats, midi_files_stats, hash_json_code_graph, midi_controller_profiles, metal_functions, swift_types_app (app-module types with fields) |
| data/strings_ui_en.txt | 4,094 UI-like English strings |
| export/ | Openly licensed items + `export/LICENSES.md` |

## Bundle inventory and status
| Resource | What | Status |
|---|---|---|
| 249 × `<sha256>.json` | code knowledge graph of 249 Swift files (not content) | documented, summary in data/ |
| Songs/ (73 JSON) | app melody format; 29 public-domain, 44 easter-egg (copyrighted tunes) | stats only |
| 33 × `.mid` | copyrighted song transcriptions | stats only |
| bach-minuet-g.musicxml | public domain (rights tag) | exported |
| scores_catalog.json | empty `[]` | documented |
| soundfont_catalog.json | 14 instruments with licences | copied to data/ |
| 8 × `.sf2` | see 05 | 3 exported (GeneralUser GS licence, CC0, CC0), 5 not (no licence in file) |
| NotoMusic-Regular.ttf | OFL 1.1 | exported |
| Assets.car | 7 colours, 2 gradients, 435 images, 729 vector glyphs, data assets Bravura/Sebastian fonts + SMuFL metadata | fonts carved and exported (OFL); art not exported |
| DesignSystem_DesignSystem.bundle | Assets.car with 69 colour entries (tokens) | documented (04) |
| Vortex_Vortex.bundle | particle sprites circle/confetti/sparkle | documented |
| WidgetShared_WidgetShared.bundle | 21 m4a theory-card clips | not exported |
| MIDIControlKit bundle | 4 controller profiles + 48 standard CC names | copied to data/ |
| MIDIKit*, AudioKit, Aptabase, ZIPFoundation, Tonic bundles | privacy manifests / empty | noted |
| GameCenterResources.gamekit | 50 achievements, 5 leaderboards, 50 PNGs | data only, PNGs not exported |
| default.metallib | 18 Metal functions | names in 04 |
| Metadata.appintents | 6 intents, 2 entities, 12 phrases | 06 |
| TinyInstrument.storekit | 7 non-consumable packs | 06 |
| PrivacyInfo.xcprivacy | Usage Data / Analytics, no tracking | 07 |
| TahoeAppIcon.icns | icon | not exported |

Libraries (from metadata/URLs): AudioKit, Keyboard (AudioKit), Tonic (theory), MIDIKit + TimecodeKit (orchetect), Aptabase, ZIPFoundation, Vortex (particles); first-party SPM modules DesignSystem, MusicCharts, MIDIControlKit, WidgetShared. Weak-linked FoundationModels (on-device LLM for "Aria"). SwiftData, GameKit, WidgetKit, EventKit, CoreSpotlight, StoreKit 2.

## Method
Static only; app never launched; no network. Tools: `plutil`, `jq`, `assetutil --info`, `strings`, `otool`, `lipo` (arm64 slice), `llvm-objdump` + a Node adrp/add string-xref script, `dyld_info -function_starts`, a Node parser for `__swift5_types`/`__swift5_fieldmd` (type and field names; types demangled with `swift-demangle`), Ghidra 12 headless without auto-analysis (decompiled the 349 functions in 0x1011cc000–0x1011d8000 = DesignSystem gamification), Node scripts for SF2 RIFF INFO, MIDI headers, metallib NAME tags and OTF carving from Assets.car, fontTools for name tables.

In the section files, statements are exact (read from code, data or strings, with the address or file named) unless marked **inferred**.

## Limits
- Settings defaults, `Spacing`/`Radius` values, animation timings, chord-detection ranking and ear-training level tables are compiled code and were not decompiled; names only.
- Swift string literals ≤15 bytes are packed into instructions, so string-derived lists (lesson ids, analytics wire names) are minimums.
- The sandboxed preferences plist was not readable; key names come from the binary.
- Lesson prose, song content, images and audio are described structurally only.
