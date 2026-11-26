# Settings

Piano Companion 1.6.1028 (Mac, Lite). Machine-readable copy: `data/settings.json`.

Legend: **exact** = read in decompiled code (class/method cited). **inferred** = deduced, not confirmed.

## 1. Storage

| Item | Value | Certainty |
|---|---|---|
| Backend | `NSUserDefaults.StandardUserDefaults` | **exact** `Songtive.SettingsManager` |
| Object format | JSON string via System.Text.Json | **exact** `SettingsManager.SetObject` |
| JSON naming | PascalCase properties, PascalCase enum strings, nulls omitted | **exact** app registers `new SettingsManager(backCmpatibilityMode: true)` (`AppDelegate` line ~500) → `SystemTextJsonSerializer._backCompatibilityOptions` |
| Main blob key | `settings` | **exact** `Settings.Save()` / `Load()` |
| Settings class in use | `PianoCompanion.Engine.Services.Settings` | **exact** `ContainerLoader` registers it |
| Legacy class | `Songtive.Services.Settings` exists but is not registered | **inferred** (no resolve found) |
| On-disk check | `defaults read com.songtive.pianocompanion.lite.osx` → "Domain not found" (app never ran here, or sandbox container). Key names below therefore come from code only. | **exact** |

## 2. Settings window (`SettingsWindow.nib`, `SettingsWindowController`)

Window title: localized `settings` ("Settings"). All values are written when the window closes (`Window_WillClose`), then `Settings.Save()`, `ChordSymbolStyleResolver.Apply()` and `TheoryNamesLocalization.Reload()` run. If Locale or TranslateTheoryNames changed, an informational `NSAlert` shows `restart_to_apply_language` with an OK button. **exact**

| Section (string key → en) | Control | Label key → en | Setting field | Type | Default |
|---|---|---|---|---|---|
| `language` → Language | combo `ddlLanguage` (10 visible items) | `language` → Language | `Locale` | string | `localization.DefaultLanguage` |
| Language | combo `ddlNotation` (10 visible) | `key_notation` → Music Notation | `Notation` | enum | by locale (see §4) |
| Language | checkbox | `translate_theory_names` → Translate chord & scale names | `TranslateTheoryNames` | bool? | `true` (new install); `false` if missing in an older saved blob |
| Language | static note | `restart_to_apply_language` → NOTE: you have to restart the app to apply language changes. | – | – | – |
| `chords_scales` → Chords / Scales | checkbox | `excludes_inversions_for_reverse_mode` → Excludes inversions from Reverse Lookup | `ReverseModeWithoutInversions` | bool | false |
| Chords / Scales | checkbox | `strict_search` → Strict Search | `IsStrictSearch` | bool | false |
| Chords / Scales | checkbox | `always_select_first_item` → Always select the first item | `AutoSelectFirstItem` | bool | true |
| `sound` → Sound | checkbox | `suppress_sound` → Suppress Sound | `SuppressSound` | bool | false |
| Sound | checkbox | `dont_play_chords` → Don't play chords | `DontPlayChords` | bool | true |
| Sound | checkbox | `dont_play_scales` → Don't play scales | `DontPlayScales` | bool | true |
| `midi` → MIDI | checkbox | `midi_input` → MIDI Input | `MidiInput` | bool | false |
| MIDI | checkbox | `midi_output` → MIDI Output | `MidiOutput` | bool | false |

All rows **exact** (`InitLabels`, `Init*Settings`, `Window_WillClose`, constructor defaults, en `Localizable.strings`).

Notation combo item text = `notation_<enum lower>` + ": " + `NoteService.PrepareNotationExample(n)` (the 12 note names in that notation, comma separated). en labels: English, Italian, Russian, Japanese, German, French, Korean, Chinese (`notation_chinesenumbers`), Numbers. **exact**

### Language list (42, in display order) **exact** `SettingsWindowController.Languages`

en, en-GB, es, fr, de, it, ru, ko, zh-Hans, zh-Hant, ja, pt-BR, pt-PT, da, no, nl, ar, hi, bg, ca, hr, cs, en-AU, et, fi, el, he, hu, id, lv, lt, ms, pl, ro, sr, sk, sl, sv, th, tr, uk, vi. Name keys: `lang_english`, `lang_english_br` (en-GB), `lang_spanish`, … `lang_vietnamese` (full map in JSON).

## 3. Piano settings sheet (`PianoSettingsModalController`, storyboard id `PianoSettingsModalController`)

Opened from the gear icon in the Piano tab toolbar. Edits a clone of `Settings.PianoSettings`; **OK** saves, **Cancel** discards. **exact**

| Row | Control | Label key → en | Field | Range | Default |
|---|---|---|---|---|---|
| 1 | checkbox | `show_notes` → Show notes | `PianoSettings.ShowNotes` | bool | true |
| 2 | checkbox | `dual_keyboards_enabled` → Dual keyboard enabled | `PianoSettings.DualKeyboardsEnabled` | bool | false |
| 3 | bold 13 pt header | `dual_keyboards_settings` → Dual keyboard settings | – | – | – |
| 4 | label + value + NSStepper | `first_octave` → First octave | `PianoSettings.FirstOctave` | 1–7, step 1, no wrap | 2 |
| 5 | label + value + NSStepper | `second_octave` → Second octave | `PianoSettings.SecondOctave` | 1–7 | 4 |
| – | (no UI) | – | `PianoSettings.ShowChordNames` | bool | false |

Rows 3–5 are disabled and drawn at alpha 0.4 when dual mode is off (alpha 1.0 when on). **exact** `SyncControls`

Layout **exact** `LayoutControls`: sheet width 380; margin 20; row height 28; row gap 10; label width 210; single-control rows 340 wide; value field at x 300 (34 wide, right-aligned); stepper at x 340 (20 wide); buttons Cancel (170,20,90,28) and OK (270,20,90,28); OK key equivalent Return. Sheet height = 68 + rows·28 + (rows−1)·10 + 20 = 266 for 5 rows.

Saving fires analytics event `piano_settings_changed` with `show_notes`, `dual_keyboards_enabled`, `first_octave`, `second_octave`. **exact**

## 4. Every field of the `settings` JSON blob

Source: `PianoCompanion.Engine.Services.Settings` constructor + `Load()`. **exact** unless noted.

| Field | Type / values | Default | Where it is changed |
|---|---|---|---|
| Locale | string | system default language | Settings window |
| Notation | English, Italian, Russian, Japanese, German, French, Korean, ChineseNumbers, Numbers | German for de no nb nn da is cs bs fi et lt lv sk mk hu sl hr sr sq; French for fr; Italian for he ro ca fa es it eu gl el iw; else English (`NoteService.GetDefaultNotation`) | Settings window |
| NotationAutoLocale / NotationAutoValue | string | null | internal (auto notation follows locale until user picks one) |
| NotationChosenByUser | bool? | `!IsFirstRun` | internal |
| ParallelNotation | None, IndianHindustani | IndianHindustani if language subtag `hi` | no UI found |
| TranslateTheoryNames | bool? | true / false (see §2) | Settings window |
| ReverseModeWithoutInversions | bool | false | Settings window |
| IsStrictSearch | bool | false | Settings window |
| AutoSelectFirstItem | bool | true | Settings window |
| SuppressSound | bool | false | Settings window |
| DontPlayChords | bool | true | Settings window |
| DontPlayScales | bool | true | Settings window |
| MidiInput | bool | false | Settings window |
| MidiOutput | bool | false | Settings window; also enables sound on reverse-lookup keyboards |
| MidiInputDevice | string; `"off"` = listening disabled (`MidiInputOff`) | `""` | no Settings-window UI (**inferred**: MIDI toolbar item `MidiInButton`) |
| PianoSettings | {ShowNotes, DualKeyboardsEnabled, FirstOctave, SecondOctave, ShowChordNames} | {true, false, 2, 4, false} | Piano settings sheet |
| PreferSharps | bool | false (so flats preferred) | toolbar `PreferAccidentalButton` (title shows ♯ when flats active, ♭ when sharps active); Circle of Fifths toggle |
| ShowFavouriteScales | bool | false | Scales toolbar star (`StarButton`) |
| ShowOnlyPopularScales | bool | false | no UI found |
| ScaleFilterSettings | NoteSettings for note counts 2–13; TagSettings for ScaleType Common, Jazz, Blues, Arabic, Indian, Other | all shown | scale filter (**inferred**) |
| PlayChordArpeggio | bool | false | PlayPanel arpeggio switch |
| ArpeggioTempo | int? | 160 (applied in Load) | no UI found |
| PreviewOctave | int? | 4 | no UI found; staff octave fallback |
| Instrument | Piano 0, BrightPiano 1, Vibraphone 11, Marimba 12, Xylophone 13, SteelGuitar 25, Cello 42, SynthStrings 50, SynthVoice 54 (GM programs) | Piano | Piano tab toolbar "Instrument" menu; item titles `instrument_<lowercase name>` |
| IsSimplifiedDegrees | bool | true | ChordIntervalsPanel toggle |
| LastRootSemitoneForChords / ForScales | Semitone | null → C | root-note popovers |
| ChordLookupScaleId | int | 268 (also reset to 268 if < 1) | none |
| OverwriteCurrentProgression | bool | true | none found |
| ChordSymbolStyle | int: 0 Automatic, 1 International, 2 Jazz, 3 French, 4 Asian, 5 Brazilian | 0 | none (no setter). Automatic → Jazz if `onboarding_v2_genres` contains "jazz"; fr → French; ja/ko/zh → Asian; pt → Brazilian; else International (`ChordSymbols.Resolve`) |
| Show9th / Show11th / Show13th | bool | true | none found |
| IsAcademicMode | bool | false | none found |
| ViewMode | int | 1 (clamped ≥ 1) | – |
| SarPosition | int | 0 | – |
| DisplayStayAwake | bool | true | – |
| HasBackgroundPlay | bool | false | – |
| RootAutoShown | bool | false | – |
| ChordDetailItemsInfo / ScaleDetailItemsInfo | [{SectionKey, IsVisible}] | null | details panels |
| DefaultEmail | string | null | – |
| DeviceId | string (GUID "N") | generated on first Load | – |
| ChordsPro / ScalesPro / ProgressionsPro | bool | false in Lite; all true in full app (`IsLite` = bundle id ≠ `com.binitex.pianocompanion`) | purchases |

## 5. Other NSUserDefaults keys

| Key | Type | Owner | Notes |
|---|---|---|---|
| `recent_chords` | string `id,value,accidental,inversion;…` | ChordService | 20-item LRU; accidental −1 = none |
| `FavouriteScales` | JSON int[] | ScaleService | |
| `libraries` | JSON | LibraryService | |
| `songs_list`, `songs_list_last` | JSON | Sequencer.SongService | progressions |
| `songsheets_file` | JSON | SongSheetService | songbook |
| `songbook_sample_seeded` | "1" | SongSheetSeeder | |
| `songbook_loop` | "1"/"0" | SongbookViewerViewController | |
| `piano_recordings` | JSON | PianoRecordingService | |
| `metronome_settings` | JSON {Bpm 120, BeatsPerBar 4, Subdivision 1, CrossRhythm 0} | MetronomeService | |
| `metronome_presets` | JSON list, max 20 | MetronomeService | |
| `flashcards_stats_v1`, `flashcards_deck_prefs_v1`, `flashcards_streak_v1` | JSON | FlashcardsService | |
| `Subscriptions` | JSON Product[] | PaymentService | |
| `payment_shown_times` | string int | AnalyticsCollector | |
| `onboarding_v2_skill_level` | just_starting / know_a_few / comfortable / comfortable_reading / advanced | read by ChordOfTheDayCache, RetentionReminders | writer not located (**inferred** onboarding) |
| `onboarding_v2_genres` | CSV | ChordSymbolStyleResolver | |
| `retention_day1_scheduled` (bool), `retention_day1_chord_day` (int) | | RetentionReminders | |
| `announcement_shown_date`, `announcement_number_shown`, `announcement_launch_count` | string numbers | AnnouncementService | |
| `rater_launch_count`, `rater_date_firstlaunch`, `rater_last_version`, `rater_launch_delay`, `rater_rater_shown`, `rater_date_firstlaunch_<ver>`, `rater_launch_count_<ver>`, `rater_action_count_<ver>` | string | AppRater | |
| `nexus_client.anonymous_id`, `.user_id`, `.install_sent`, `.fbc` | | NexusClient (analytics) | |

App group `7JK6525JYY.group.com.songtive.pianocompanion` holds chord-of-the-day keys `cotd_source`, `cotd_chord_id`, `cotd_chord_name`, `cotd_day`, `cotd_root`, `cotd_slot`. **exact** `ChordOfTheDayCache`, `ChordOfTheDayLink`

## 6. Metronome limits **exact** `MetronomeLimits`, `MetronomeSettings`

| Item | Value |
|---|---|
| BPM | 30–250, default 120; quick picks 60, 90, 120, 140, 180 |
| Beats per bar | 1–12, default 4 |
| Subdivisions | 1 quarter, 2 eighth, 3 triplet, 4 sixteenth (`metronome_sub_*`) |
| Cross rhythm | 0 = off, else 2–9 (shown as "N:beats") |
| Presets | max 20 |
| Pro gating | subdivision > 1 or cross rhythm ≥ 2 needs Pro; without it they reset to 1 / 0 |
| Beat length | 60 / BPM seconds |
