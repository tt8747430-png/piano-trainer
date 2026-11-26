# Scale Runner 1.0.4 (build 28): reverse-engineering notes

- **Bundle:** `/Applications/Scale Runner.app`, bundle id `com.scalerunner.app`, Mac App Store build.
- **Platform:** Flutter, with the Dart AOT snapshot in `Contents/Frameworks/App.framework/Versions/A/App` (universal x86_64 + arm64). The Dart package is `scale_runner`.
- **What it is:** a piano and guitar scale, chord and voicing trainer.
  - Free modes: Free Play (live chord/interval naming), Scales and Chords quizzes.
  - Pro timed drills against a metronome: Scale Running, Inversion Running, Jam Mode.
  - A voicing capture-and-drill library: 3 voicings free.
  - Also: daily streak with a Pro weekly freeze, three kinds of reminders, per-mode 0–100 scores with three tiers, and optional Supabase account, sync and friends.

## Files

| File | Contents |
|---|---|
| `GAME_AND_SCORING.md` | Source layout, all 8 modes and their rules, scales, progressions, timing and beat judging, tiers, streak, reminders, stats |
| `UI_FLOWS.md` | Every screen, sheet and builder; home, onboarding, paywall flow, social |
| `PAYWALL_AND_GATING.md` | RevenueCat lifetime product, paywall copy, what is gated, Groove Runner cross-promo |
| `MIDI_AND_SOUND.md` | MIDI and BLE input, native BLE pairing window, latency calibration, samples, metronome |
| `SETTINGS.md` | Settings screen tiles and per-mode sheets (keys in `data/settings_keys.json`) |
| `COMPONENTS_AND_THEME.md` | Fonts, theme getters, widget inventory, motion |
| `STRINGS_EN.md` | Grouped English UI strings (689). Locales: English only |
| `RESOURCES_AND_LICENCES.md` | Every bundled resource and its licence status; NOTICES summary |
| `ANALYTICS_PRIVACY.md` | SDKs (no analytics), backend tables, privacy policy content |
| `PIANO_TRAINER_TAKEAWAYS.md` | What to adopt or avoid, mapped to Piano Trainer areas |
| `data/scales.json` | 21 modes + 4 other scales, with formulas |
| `data/chords_and_intervals.json` | Chord quality names, symbol suffixes, interval names, inversion labels |
| `data/progressions.json` | Scale Running presets, key-advance options, Jam families |
| `data/enums.json` | App enum classes and their probable values |
| `data/settings_keys.json` | About 110 preference keys with types and setters |
| `data/backend.json` | Supabase tables, RPCs, RevenueCat product (secrets omitted) |
| `data/strings_en.json` | Full filtered string list |
| `data/notices_packages.json` | 228 NOTICES package names → licence family |
| `export/` | Inter and Space Grotesk fonts (OFL-1.1) with OFL.txt; `export/README.md` |

## Method

1. Inventoried the bundle and read `Info.plist`, `FontManifest.json` and the asset files.
2. `NOTICES.Z` is **gzip**; I decompressed it with Node zlib.
3. Thinned `App` to arm64 (`lipo`). `strings` gave 87 347 Latin-1 strings. A Node scan of UTF-16 runs gave the non-Latin-1 strings (♮, —, emoji, the privacy text).
4. Mapped app libraries through the `package:scale_runner/...` paths. Grouped private members by their `@<library-hash>` suffix, which gives per-class member lists for each screen and controller.
5. Identified the settings keys (snake_case), setters (`setXxx`), enum class names (`Name.`) and UI copy.
6. Read the main executable's strings for the native Swift side (`scale_runner/ble_midi` → `CABTLEMIDIWindowController`).
7. Read the font name tables with fontTools for licences, and `afinfo` plus a RIFF chunk scan for the WAVs.

**Confidence marks:** **exact** = read from strings or member names; **inferred** = my interpretation. Snapshot strings are hash-ordered, so adjacency proves nothing.

## Limits (not determined)

- **No decompiler.** `blutter` is not installed, and per the brief no Dart toolchain was installed. So code constants are unknown:
  - timing windows (ms) per difficulty
  - grace window
  - number of free trial sessions per Pro mode
  - tier thresholds and the 0–100 score formula weights
  - streak milestone days
  - BPM range and default, default settings values
  - BLE default latency
  - colours and animation durations
- **Name pairings are inferred:** the scale-name ↔ formula pairing is reconstructed from theory (both sides exact). Enum value ↔ enum class pairings are also inferred.
- The app's sandbox preferences could not be listed ("Operation not permitted").
- Static only: the app was not launched and no network was used. API keys and tokens exist (Supabase publishable key, RevenueCat `appl_` key, Google client id, Firebase plist) and were not copied.
