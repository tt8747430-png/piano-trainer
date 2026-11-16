# Scale Runner: bundled resources and licences

## Flutter assets (`App.framework/Resources/flutter_assets/`, exact listing)

| Resource | Details | Status |
|---|---|---|
| `assets/audio/note_40.wav` … `note_95.wav` (56 files) | Piano tones, MIDI 40–95, mono 22.05 kHz 16-bit, about 1.1 s each. No INFO/licence chunk. | Proprietary / unknown origin. **Not exported.** |
| `assets/audio/click.wav`, `click_accent.wav` | Metronome clicks, 44.1 kHz, 50 ms / 60 ms | Not exported |
| `assets/icon/app_icon.png`, `app_icon_macos.png`, `icon_splash.png` | App icon and splash | Proprietary art |
| `assets/icon/Icon_Scales.png`, `Icon_Chords.png`, `Icon_Running.png`, `Icon_Voicings.png`, `invert-run.png`, `Jam.png` | Mode-card icons (exact names) | Proprietary art |
| `assets/icon/groove_runner_icon.png` | Cross-promo icon | Proprietary |
| `assets/fonts/Inter_{400Regular,500Medium,600SemiBold,700Bold}.ttf` | Inter 4.001 | **OFL-1.1, exported** |
| `assets/fonts/SpaceGrotesk_{500Medium,700Bold}.ttf` | Space Grotesk 2.000 | **OFL-1.1, exported** |
| `fonts/MaterialIcons-Regular.otf` | Tree-shaken Material Icons, "Copyright 2019 Google LLC" | Apache-2.0 upstream; not exported |
| `packages/cupertino_icons/assets/CupertinoIcons.ttf` | v1.08 | MIT (in NOTICES); not exported |
| `shaders/ink_sparkle.frag`, `shaders/stretch_effect.frag` | Flutter engine shaders | Flutter BSD |
| `packages/wakelock_plus/assets/no_sleep.js`, `packages/flutter_local_notifications_web/web/notifications_service_worker.js` | Web-only plugin files (unused on macOS) | Plugin licences |
| `AssetManifest.bin`, `FontManifest.json`, `NativeAssetsManifest.json` | Manifests. FontManifest declares the families Inter (400/500/600/700), SpaceGrotesk (500/700), MaterialIcons and CupertinoIcons. | n/a |
| `NOTICES.Z` | **gzip** (not zlib). Decompressed to 1 485 609 bytes, 1 668 licence blocks, 228 package names. The package → licence map is in `data/notices_packages.json` (licence type detected by keyword; *other* = needs manual reading). | Read |

## macOS bundle (`Contents/Resources`, exact)

- `Assets.car`: only `AppIcon` (no named colour sets).
- `AppIcon.icns`.
- `Base.lproj/MainMenu.nib`.
- `GoogleService-Info.plist`: Firebase config; keys exist, not reproduced.
- Plugin resource bundles (privacy manifests): app_links, AppAuth, Firebase×3, flutter_local_notifications, flutter_timezone, google_sign_in, GoogleSignIn, GoogleUtilities×4, GTMAppAuth, GTMSessionFetcher, package_info_plus, FBLPromises, RevenueCat, share_plus, shared_preferences, url_launcher, wakelock_plus.
- Frameworks: `App.framework` (Dart AOT, universal x86_64+arm64), `FlutterMacOS.framework`, `flutter_midi_command.framework`, `universal_ble.framework`, `sign_in_with_apple.framework`, `objective_c.framework`.

## Licences of Dart packages (from NOTICES, keyword-detected)

- **MIT:** audioplayers*, purchases_flutter, supabase*, gotrue, postgrest, realtime_client, storage_client, functions_client, sign_in_with_apple*, equatable, uuid, cupertino_icons, yet_another_json_isolate, …
- **BSD:** flutter plugins (shared_preferences*, url_launcher*, path_provider*, package_info_plus, share_plus, wakelock_plus), firebase_core*, google_sign_in*, universal_ble, timezone, midi, …
- **Apache-2.0:** app_links*, rxdart, material_color_utilities, clock, retry, universal_io.
- `flutter_midi_command` (BSD-3, upstream) has no separate NOTICES entry beyond its platform interface ("midi" = BSD). Treat as inferred.
