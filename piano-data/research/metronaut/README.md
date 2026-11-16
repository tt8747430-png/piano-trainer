# Metronaut reference (static reverse engineering)

Target: `/Applications/Metronaut.app` — Antescofo, bundle id `com.antescofo.metronaut`, version 9.0.3 (build 472), Mac App Store, Mac Catalyst build of the iPad app (arm64 + x86_64).

Purpose: reference for the owner's TypeScript web piano trainer (score display, practice with accompaniment, metronome).

Method: static only. The app was not launched. No network. `/Applications` was not modified. Tools: `strings`, `nm`, `otool`, `llvm-objdump`, `xcrun swift-demangle`, `plutil`, `assetutil`, `jq`, and Node scripts that parse Swift metadata sections (`__swift5_types`, `__swift5_fieldmd`) and decode Swift small-string literals from disassembly. The REA MCP server was not available in this session, so everything was done with command-line tools. The app's preference domain is empty on this Mac, so setting keys come from the binaries. API keys and tokens present in `Info.plist` and `GoogleService-Info.plist` were deliberately not copied.

Every claim is marked **exact** (read from a cited file, string, symbol or disassembly) or **inferred** (interpretation).

## Documents

| File | Contents |
|---|---|
| [PRACTICE_AND_SCORE_FOLLOWING.md](PRACTICE_AND_SCORE_FOLLOWING.md) | Antescofo follower architecture, audio front end, all engine modes with parameters, user modes and their capability getters, wait mode, hands separate, loops, tempo, accompaniment script walk-through, scoring formula and thresholds, feedback colours, piano onset ML model, latency, MIDI, voice commands, tuner, bridge API |
| [METRONOME.md](METRONOME.md) | How clicks are generated from score pulses, controls, count-in, tempo model |
| [SCORE_RENDERING.md](SCORE_RENDERING.md) | MusicXML → GUIDO pipeline, fonts, layout/scroll/page turn, cursor modes, overlays, annotation schema, transposition, preview, printing, web equivalents |
| [UI_FLOWS_AND_MENUS.md](UI_FLOWS_AND_MENUS.md) | Menu bar, keyboard shortcuts, root flow, onboarding steps, login, tabs (My music, Discover, Practice, Catalog, Account), preview, score page buttons, end of session, paywall and gating, modals, deep links, App Intents, widgets |
| [COMPONENTS_LAYOUT_MOTION.md](COMPONENTS_LAYOUT_MOTION.md) | Asset catalogs and colour sets, colour tokens in code, typography, layout constants, view/controller inventory, all Lottie animations decoded, animation constants |
| [SETTINGS.md](SETTINGS.md) | Every preference key, defaults (from disassembly), settings panel sections and labels, UserDefaults keys, account settings |
| [CATALOG_MODEL.md](CATALOG_MODEL.md) | `all.json` schema and statistics, CatalogAPI icons, live API DTOs, taxonomy (genres, instruments, levels, part kinds), endpoints |
| [LOCALISATION_EN.md](LOCALISATION_EN.md) | Full English string tables (4,219 keys) grouped by prefix, plus InfoPlist, AppShortcuts, stringsdict; 17 locales |
| [RESOURCES_AND_LICENCES.md](RESOURCES_AND_LICENCES.md) | Every bundled resource with size, purpose and licence status; font licences verified from name tables; third-party SDKs; StoreKit config; privacy manifests |
| [ANALYTICS_EVENTS.md](ANALYTICS_EVENTS.md) | Trackers, ATT text, event and property names, analytics-like backend payloads, what to measure / what not to do |
| [PIANO_TRAINER_TAKEAWAYS.md](PIANO_TRAINER_TAKEAWAYS.md) | 39 concrete items to adopt (or avoid) in the web app |

## Data files (`data/`)

| File | Contents |
|---|---|
| `swift_types_app.json` | 3,403 Swift types with stored fields / enum cases, per binary (first-party modules, plus nested types such as `CodingKeys` and a few unprefixed third-party types the filter could not separate) |
| `swift_models_catalog.json` | Catalogue-related Swift models |
| `antescofo_modes.json` | Engine modes (`$iosMode`), script parameters, iosMessages, user-mode getters |
| `practice_scoring.json` | Timing thresholds, penalties, score formula, colours |
| `settings_and_defaults.json` | Default values, setting enums, UserDefaults key names, preference structs |
| `keyboard_shortcuts.json` | Score-page key commands and menu changes |
| `embedded_source_paths.json` | 91 first-party source file paths embedded in the binaries (home prefix removed) |
| `catalog_schema.json`, `catalog_stats.json`, `api_endpoints.json` | Catalogue schema, statistics, API paths and hosts |
| `strings_en.json`, `stringsdict_en.json`, `appshortcuts_en.json`, `infoplist_en.json`, `widget_strings_en.json` | English string tables as JSON |
| `asset_catalog_colors.json`, `asset_catalog_images.json` | Asset catalogue colour sets and image names |
| `lottie_animations.json` | Lottie metadata (no art) |
| `analytics_events.json` | Event and property names |

## Open-licensed exports (`open-licensed/`)

`fonts/Bravura.otf`, `fonts/BravuraText.otf`, `fonts/guido2.ttf`, each with its SIL OFL 1.1 text copied from the font's own name table, and `fonts/ATTRIBUTION.md`. Nothing proprietary was exported (no scores, recordings, `.asco` scripts, Lottie art, videos, icons, ML models, or the FluidR3 sample file, whose own INFO chunk forbids redistribution).

## Bundle at a glance

- Main binary 33.5 MB; 35 frameworks. Antescofo core, libmusicxml, GUIDO engine and libguidoar are statically linked into `AntescofoKit` (13 MB) and `GuidoKit` (14 MB); their own framework folders are 84 KB stubs.
- First-party modules: `Metronaut`, `MetronautUI`, `MetronautPreviewCoreKit`, `MetronautPreviewUIKit`, `MetronautSubscriptionCoreKit`, `MetronautSubscriptionUIKit`, `MetronautAnalyticsKit`, `MetronautExtensionKit`, `MetronautResourceKit`, `Core`, `Domain`, `Networking`, `Logger`, `AntescofoKit`, `GuidoKit`, `RealmDataSource`, plus `Metronaut-WidgetExtension.appex`.
- Third-party: Realm, RxSwift/RxCocoa, MIDIKit, Alamofire, Lottie, SDWebImage/Nuke, Firebase (Analytics, Crashlytics, Remote Config, A/B testing), AppsFlyer, Branch, Braze, Facebook SDK, Amplitude, Google Sign-In, Zendesk, ZipArchive.

## Main limits

See "What could not be recovered" sections in each document. In short: numeric constants inside stripped functions (FFT sizes, tempo slider range, most UI sizes and durations, count-in length, workout pass percentage), the metronome click sample, runtime-only server content, and the exact user-mode → engine-mode mapping.
