# Settings

Legend: **exact** = read from a file or binary (cited). **inferred** = interpretation.

The app's preferences domain `com.antescofo.metronaut` is empty on this Mac (`defaults export` returned an empty plist; the sandbox container `~/Library/Containers/com.antescofo.metronaut/Data/Library/Preferences/` holds only system plists). So the app has not been run here. All keys below come from the binaries. Machine-readable copy: `data/settings_and_defaults.json`.

## 1. Where settings live

| Store | What | Evidence |
|---|---|---|
| UserDefaults, enum-named keys | Account, onboarding, counters, flags (§5) | **exact**: `Core.MNDefaults*` enums; raw key = case name (**inferred**: Swift `String` raw value defaults to the case name; `install_date`, `onboarding_pref`, `show_training_onboarding`, `premiumDescriptionAlreadyPresented`, `selectedHomeTabTag` also appear as literal strings in `Core`) |
| Realm database | Catalogue cache, purchases, per-piece performance data, track gains | **exact**: classes `RealmOpus`, `RealmPerformanceDataRepository`, `RealmPerformanceModeTrackGains`, `RealmDatabase.CatalogDatabase`, `RealmDatabase.User` (main binary) |
| `Metronaut.UserPreferences` (global, property-wrapped) | `identifier, mode, feedbackAIEnabled, scrollStyle, metronomeVolume, countDownKind, cursorMode, metronomeState, pianoMinimized, tuningDiapason, automaticRecording` | **exact** |
| Per piece / per accompaniment | `DefaultAccompanimentPreferences` fields (§3) | **exact** |
| JSON files | `antescofo_defaultconnection.json` (audio/MIDI input), latency values per output (`LatencyValuesStore`: "Unable to save latency values") | **exact** strings |
| App Group | widget items and practice statistics (`MetronautWidgetResourcesManager { itemsURL, practiceStatisticsURL }`) | **exact** |

## 2. Global defaults (`Core.DefaultUserPreferences.init()`, Core `0xd576c`)

All values **exact** from the store instructions and the packed constant `01 01 03 01` at Core `0x106dd8`.

| Field | Default | UI |
|---|---|---|
| `metronomeState` | `false` | Metronome toggle |
| `metronomeGain` | `0.5` | Volumes → Metronome |
| `cursorMode` | `beats` (raw 1) | Display → Cursor |
| `countDownKind` | `acoustic` (raw 1) | Display → Countdown |
| `mode` | `playAlong` (raw 3) — "Performing" | Modes |
| `feedbackAIEnabled` | `true` | Tempo panel → AI Feedback |
| `pianoMinimized` | `false` | Piano keyboard drawer |
| `tuningDiapason` | `440.0` Hz | Tuner → Tuning reference |
| `automaticRecording` | `true` | Account → "Automatic recording" — "Temporarily record all performances" |

## 3. Per-piece defaults (`Core.DefaultAccompanimentPreferences.init(scoreScale:)`, Core `0xace0c`)

| Field | Default | Status |
|---|---|---|
| `tempoCoef` | `100.0` (%) | **exact** |
| `cursorPosition` | `0.0` (beat) | **exact** |
| `loopStatus` | `false` | **exact** |
| `loopStart` | `0.0` (beat) | **exact** |
| `loopEnd` | `4.0` (beat) | **exact** |
| `lastScore`, `maxScore` | `0`, `0` | **exact** |
| `lastScoreVersion`, `maxScoreVersion` | `1`, `1` | **exact** |
| `maxRhythmGameScore` | `0` | **exact** |
| `displayAccompaniment` | `false` | **exact** |
| `showFingering` | `true` | **exact** |
| `isInRhythmGame` | `nil` | **exact** |
| `scoreScale` | passed in; caller reads `UIDevice.current` (device-dependent) | **exact** call; values not recovered |

## 4. Performance settings panel (the "Tools" / settings drawer on the score page)

### 4.1 Top-level lists

- `MetronautPreviewCoreKit.SettingsList { setting, rhythm, volume, mode, advanced, display, tempo, transposition }` (**exact**).
- `PerformanceSettingsModalButton` — every button of the modal, in declaration order (**exact**): `speechRecognition`, `rhythm`, `volume`, `annotation`, `records`, `tuner`, `transpo`, `display`, `versionsList`, `print`, `instructions`, `fullPerformance`, `contact`, `sharePiece`, `addToPlaylist`, `sharePlay`, `helpCenter`, `sharePieceToStudent`.
- `PerformanceSettingsModalConfig { appearance, transpositionState, versionsListState, printState, fullPerformanceState }` with `PerformanceSettingsModalFeatureState { disable(isTapGestureEnabled), enable }` (**exact**). Locked features stay visible and tappable to show an upsell (**inferred**).
- Header strings (**exact**): "Parameters", "Tools", "Performance", "Expert Settings", "Score Presentation".

### 4.2 Every setting, its key, values and label

`PerformanceSettingType` (**exact**, 28 cases) with UI labels from `en.lproj` (**exact**):

| Setting key | Values / type | UI section and label |
|---|---|---|
| `performanceMode` | `reading`, `coach`, `withSolo`, `playAlong`, `magicPlayAlong` | Modes: "Choose your performance mode:" |
| `tempo` | Int %, default 100 | Tempo: "Choose your tempo"; "Tempo (%)"; "Constant Tempo" — "Activate this mode to play in strict metronomic tempo." |
| `feedbackAIEnabled` | Bool, default true | Tempo panel: "AI Feedback" — "Visualize your pitch and rhythm precision." |
| `handSettingsMode` | `right`, `left`, `both` | "Hands": "Choose which hand to play" |
| `stateMetronome` | Bool, default false | Metronome button / Volumes |
| `volumeMetronome` | Double 0–1, default 0.5 | Volumes → "Metronome" |
| `countDownKind` | `none`, `acoustic`, `visual` | "Countdown" — "Adjust the Countdown at the beginning of your performance." Segments: "None", "Visual", "Audible". Older segments: "None", "Short", "Long" + toggle "With sound" |
| `cursorMode` | `none`, `beats`, `continuous`, `recognition` | "Cursor" — "Choose how the cursor moves through the score." Segments: "None", "Beats", "Continuous". Other labels: "No Cursor", "Continuous", "Continuous with beats", "Beats", "Detected events" |
| `pageScrolling` | `page`, `continue` | "Scroll": "Page", "Continuous". Older: "By Page", "Continuous"; "Scroll Mode" vertical/horizontal |
| (scroll anticipation) | beats | "Scroll Anticipation" — "Choose how early you want the score to scroll ahead as you play." unit "Beat(s)" |
| `displayAccompaniment` | Bool, default false | Display → "Display accompaniment" |
| `showFingering` | Bool, default true | Display → "Show fingerings" |
| `pianoMinimized` | Bool | Display → "Display Keyboard" |
| `scoreScale` | Double | pinch zoom; ⌘+ / ⌘− |
| `scoreClef` | `Original`, `G2` "Treble", `G2M8` "Treble -8", `G2P8` "Treble +8", `C3` "Alto", `C4` "Tenor", `F4` "Bass", `F4M8` "Bass -8", `F4P8` "Bass +8" | Transposition → "Clef" |
| `transpositionInterval` | Int semitones | "Interval" |
| `transpositionOctave` | Int | "Octaves" |
| `transpositionInstrument` | Int (transposing instrument) | "Transposing instrument" |
| `tuning` | Double Hz, default 440 | "Tuning reference" |
| `stateSoloMidi` | Bool | Solo settings: "Audio" / "Synth." (`SoloOutputType { audio, synth }`) |
| `mixerGain` | Double | "Balance" — "available only for Listening Mode" |
| `performanceTrackGain` | `(mode, role: solo/accompaniment, value)` | Per-mode mixer ("Include my part · played by {{part}}", "Accompaniment · {{part}}") |
| `volumeSystem` | `VolumeSystem { volume, list }` | Volumes |
| `loopStatus`, `loopStart`, `loopEnd` | Bool, beats | Loop toggle and handles |
| `position` | Double beats | cursor drag |
| `rhythmMode` | Bool | "Rhythm Game" — "Turn on Rhythm Game or off to access all features" |
| `latency` | Int ms | "Adjust latency" — "Synchronize audio with the animation. If audio is late, increase the latency." |

Volume section labels (**exact**): "Volumes" — "Change how loud you will hear the synthesized solo, accompaniment tracks and your own voice."; rows "Accompaniment", "Metronome", "Solo", "Synth Guide", "Audio Input", "Me (feedback) Headphone Only", "Balance". Tip: "Tip: Use speakers or headphones".

`MetronautPerformanceVolumeContext { generalVolume, metronomeVolume, mixer, recordingMixer, midiSynthMixer }`, each `Mixer { volume, mixer, isDisabled }` (**exact**).

### 4.3 Expert settings (`AudioSettingsViewModel`, **exact** fields)

`soloOutputType`, `soloAudioAvailable`, `metronomeVolume`, `metronomeIsActive`, `balanceModel`, `userAddedLatency`, `calibration`, `calibrationSwitch`, `estimatedLatencyMS`, `cursorLatencyMS`, `currentOutputPortName`, `inputDbGain`, `recordingCompression`, `newCalibration`, `recognitionCursor`, `verbosity`, `usingAppleVPIO`, `isDevelopment`.

Some are developer-only (`isDevelopment`; small strings "Verbosity", "New Calibration", "Cursor Latency" in PreviewUIKit) (**inferred**).

Microphone section (**exact** strings): "Microphone Settings" — "Choose the Microphone to use, adjust its gain and watch how Metronaut hears you."; rows "Source", "Gain", "Calibration".

Audio output (**exact**): "Audio Output" — "Choose Wireless Audio Output when available, and adjust the delay between audio and cursor. If audio feels late, try increasing the latency."

MIDI (**exact**): "MIDI Instrument"; "To use a MIDI Instrument, connect it to your device or activate Bluetooth for detection."; "MIDI Bluetooth"; "Searching for instruments"; "Search other instruments"; "Connected to %@"; "Synthesize MIDI" — "Generate a piano sound when you play on the connected instrument."; footer "To play with an acoustic instrument, just disconnect your MIDI device."

Voice commands (**exact**): "Voice commands" On/Off — "See all voice commands associated to each action".

Video (**exact**): `VideoFeedbackChoice { alwaysOn, transparent, hide }`; "Video Recording".

### 4.4 Persisted snapshot attached to each recording

`Core.PerformancePreferences` (**exact**): `mode, mixer, soloGain, accompanimentGain, tempo, metronome, countdownMode, octaveTransposition, intervalTransposition, instrumentTransposition, clef, octavia, displayAccompaniment, displayPianoKeyboard, cursorMode, scrollingMode, loopState, loopBeginMeasure, loopBeginPulsation, loopEndMeasure, loopEndPulsation, cursorPosition, showFingering`. Its derived `tempoPercentage` getter exists (**exact**).

SharePlay sync payload `SharePlaySettings { cursorPosition, countDownKind, metronomeState, metronomeVolume, mixGain, soloGain, accompanimentGain, mode, tempoCoef }` (**exact**).

## 5. UserDefaults keys (key names only; no values read)

| Enum (Core unless noted) | Keys |
|---|---|
| `MNDefaultsGlobal` | `install_date` (literal `last_install_date` also present) |
| `MNDefaultsSync` | `last_date` |
| `MNDefaultsUser` | `token_app`, `token_firebase`, `username`, `email`, `first_name`, `last_name`, `firebase_id`, `instrument_id`, `instrument_last_modification`, `level_id`, `level_last_modification`, `daily_performance_done`, `is_trial_period`, `product_id`, `store`, `credit_piece_qty`, `audioRecording_onboarding`, `listenButtonHint_onboarding`, `appstoreCountryCode`, `perfCounter`, `perfSessionCounter`, `performanceAlreadyPresented` |
| `MNDefaultsCard` | `clicked_ids` |
| `MNDefaultsPieceRequest` | `voted_ids` |
| `MNDefaultsWorkout` | `show_training_onboarding` |
| `MNDefaultsOnboarding` | `onboarding_pref` |
| `MNDefaultsSubscription` | `subscription_first_show_date` |
| `MNDefaultsFreeWorkoutStep` | `show_first_free_workout_step` |
| `MNDefaultsPlaylistFavorite` | `synced_favorite_playlist` |
| `MNDefaultsPerformance` | `is_summary_disable`, `midi_onboarding` |
| `MNDefaultsABExperiment` | `firstScreenPractice` |
| `UserDefaultsBooleanKey` | `premiumDescriptionAlreadyPresented` |
| `UserDefaultsIntKey` | `numberOfTimesPushNotifAlreadyPresented`, `selectedHomeTabTag`, `postShowSwipeIndicatorCount` |
| `Metronaut.AppClipUserDefaultsKey` | `cookies` |
| `Metronaut.DeepLinkKey` | `premium_delta_days_connected_user`, `premium_specific_date_connected_user`, `congrats`, `referral_user` |

Note: `MNDefaultsUser` stores auth tokens and email in UserDefaults (**exact** key names). A web app should keep such data in HTTP-only cookies or encrypted storage, not in `localStorage` (**inferred** advice).

## 6. Account screen settings

`Metronaut.AccountAction` (**exact**, every case): `togglePracticeGoal(active)`, `text(field, text)`, `avatarChanged(asset)`, `externalLink(url)`, `automaticRecording(value)`, `onboarding`, `account`, `user`, `mySubscription`, `settings`, `avatar`, `midiSettings`, `share`, `shareTeacher`, `shareStudent`, `studentsList`, `speechRecognition`, `subscribe`, `switchOffReason`, `switchOffComment`, `switchOffHow`, `zendeskSupport`, `deeplinkInput`, `contact`, `userGoal`, `deconnexion`, `resetMyAccount`, `login`, `restorePurchases`.

Profile fields `AccountProfileTextFieldKind { nickname, firstName, lastName }` and provider labels Apple, Email, Facebook, Google, SMS, WeChat (**exact**).

Practice goal: `PracticeGoalPeriod { day, weekend, weekday }`; reminder settings `{ identifier, period, hourAndMinute, isActive, date, timeZone }`; delivery `remote, pending, local` (**exact**).

Preference ("What do you like to play?"): `OnboardingPreferenceEnum { both, pop, classic }` — "Classical & mainstream music", "Classical music", "Mainstream music" (**exact**).

Storage (**exact**): "Storage", "Available:", "Remove cached pieces", "Remove offline pieces", "Remove saved recordings", "Remove temporary recordings", "Clear All Data". `StorageType { cache, offlinePieces, temporaryRecordings, savedRecordings }`.

Danger zone (**exact**): "Delete Account" (with subscription warning: "Deleting your Account will not cancel your Premium subscription!"), "Restore purchases", log out (`deconnexion`).

## 7. What could not be recovered

- Actual stored values (the domain is empty here; by design I did not read account data).
- The `scoreScale` default per device and the tempo slider range.
- Whether `MNDefaults*` keys get a prefix at runtime (no prefix string found; raw-name keys **inferred**).
