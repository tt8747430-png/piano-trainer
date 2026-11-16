# Components, layout and motion

Scope: asset catalogs, colour tokens, fonts, layout constants, view/controller inventory, and every Lottie animation in Metronaut 9.0.3 (build 472).

Evidence tags:
- **exact** = read directly from a file or binary (path given).
- **inferred** = my interpretation of names or code patterns. Treat as a hypothesis.

Platform note. The main binary has `LC_BUILD_VERSION platform 6` (Mac Catalyst), minos 16.0 (**exact**, `otool -l Contents/MacOS/Metronaut`). `UIDeviceFamily = [2]` (iPad) (**exact**, `Info.plist`). So the Mac app is the iPad UIKit/SwiftUI app running under Catalyst. Layout is iPad-first.

---

## 1. Asset catalogs

Four compiled catalogs exist (**exact**, `find … -name '*.car'`):

| Catalog | Path | Size (bytes) | Content |
|---|---|---|---|
| app | `Contents/Resources/Assets.car` | 11,987,656 | 15 colour sets (28 entries light+dark), 873 Image entries, 70 Vector, 79 packed, 1 icon |
| MetronautResourceKit | `Frameworks/MetronautResourceKit.framework/Versions/A/Resources/Assets.car` | 4,391,656 | 239 Image entries, 3 Vector, 28 packed; no colours |
| MetronautPreviewUIKit | `Frameworks/MetronautPreviewUIKit.framework/Versions/A/Resources/Assets.car` | 4,391,656 | Same name set as ResourceKit (134 names); bytes differ (`cmp` differs at byte 18320) |
| BrazeUI | `Resources/braze-swift-sdk_BrazeUI.bundle/Contents/Resources/Assets.car` | 25,016 | Braze SDK icons (`ContentCard/pin`, `ContentCard/retry`, `InAppMessage/chevron`) |

Catalog metadata (**exact**, `assetutil --info`): Platform `macosx-ios`, PlatformVersion `16.0`, Appearances `UIAppearanceAny`=0 and `UIAppearanceDark`=1, authored with Xcode 27.1 (27A9275).

Full tables: `data/asset_catalog_colors.json` (15 colour sets) and `data/asset_catalog_images.json` (735 name × catalog rows, with types, scales, appearances, pixel sizes). Image pixels are proprietary and were not exported.

### 1.1 Colour sets in Assets.car (**exact**, `assetutil --info Resources/Assets.car`)

All are sRGB, idiom `universal`. Hex is rounded from the float components.

| Colour set | Light (Any) hex | Light alpha | Dark hex | Dark alpha |
|---|---|---|---|---|
| `AnnotationButton` | #A1A4B3 | 1 | #FFFFFF | 1 |
| `AnnotationMenu` | #FFFFFF | 1 | #3F423F | 1 |
| `AnnotationTextButton` | #35AFF7 | 1 | #FFFFFF | 1 |
| `background` | #FFF7EC | 1 | #151517 | 1 |
| `backgroundBlue` | #35AFF7 | 1 | #352469 | 1 |
| `backgroundLaunch` | #35AEF7 | 1 | #00033A | 1 |
| `backgroundRed` | #F53131 | 1 | (no dark variant) | - |
| `backgroundWhite` | #FFFFFF | 1 | #1D1D1F | 1 |
| `bluePerf` | #35AEF7 | 1 | #00033A | 1 |
| `green` | #00504B | 1 | #009472 | 1 |
| `performanceBackground` | #FFF7ED | 1 | (no dark variant) | - |
| `primaryText` | #393940 | 1 | #FFFFFF | 1 |
| `secondaryText` | #000000 | 0.545 | #FFFFFF | 0.544 |
| `tabBarBackground` | #FFFFFF | 1 | #393940 | 1 |
| `white` | #FFFFFF | 1 | #141416 | 1 |

### 1.2 Code-defined palette: `MetronautResourceKit.Resource.Color` (**exact** hex, **inferred** light/dark order)

Most colours are not in the asset catalog. They are Swift static properties on `MetronautResourceKit.Resource.Color` (**exact**, symbols in `MetronautResourceKit`). The underlying struct is `Color { light: String; dark: String; alpha: Float }` (**exact**, `__swift5_fieldmd`). Each property also has a `(with: Float)` variant that overrides alpha (**exact**, symbol `static Resource.Color.<name>(with: Swift.Float)`).

I recovered the hex strings by decoding the arm64 `mov/movk` immediates that build Swift small-string literals inside each getter (script: scratchpad `colorfn.js`). Where one literal was found, the same value is very likely used for light and dark (**inferred**). Order "first literal = light" is **inferred** from struct field order.

| `Resource.Color` property | Hex literal 1 (light, inferred order) | Hex literal 2 (dark, inferred order) | Alpha literal |
|---|---|---|---|
| `orange` | #F77026 | (same as light / not separate) | 1.0 (default, inferred) |
| `clear` | #FFFFFF | (same as light / not separate) | 1.0 (default, inferred) |
| `white` | #FFFFFF | (same as light / not separate) | 1.0 (default, inferred) |
| `black` | #000000 | (same as light / not separate) | 1.0 (default, inferred) |
| `purple` | #B1B2F5 | (same as light / not separate) | 1.0 (default, inferred) |
| `purpleBlack` | #060044 | (same as light / not separate) | 1.0 (default, inferred) |
| `yellow` | #FFBE00 | (same as light / not separate) | 1.0 (default, inferred) |
| `pink` | #F68BC9 | (same as light / not separate) | 1.0 (default, inferred) |
| `blue` | #35AFF7 | (same as light / not separate) | 1.0 (default, inferred) |
| `darkBlue` | #00033A | (same as light / not separate) | 1.0 (default, inferred) |
| `gray` | #B8C1D6 | (same as light / not separate) | 1.0 (default, inferred) |
| `green` | #00504B | #009472 | 1.0 (default, inferred) |
| `primaryText` | #393940 | #FFFFFF | 1.0 (default, inferred) |
| `grayPrimaryText` | #999999 | (same as light / not separate) | 1.0 (default, inferred) |
| `graySecondaryText` | #A0A3AD | (same as light / not separate) | 1.0 (default, inferred) |
| `grayTitleHeaderText` | #9599A3 | (same as light / not separate) | 1.0 (default, inferred) |
| `grayToolTitleHeaderText` | #505259 | #9599A3 | 1.0 (default, inferred) |
| `boldGrayPrimaryText` | #505259 | #FFFFFF | 1.0 (default, inferred) |
| `boldGraySecondaryText` | #9599A6 | (same as light / not separate) | 1.0 (default, inferred) |
| `systemGrayPrimaryText` | #8E8E93 | (same as light / not separate) | 1.0 (default, inferred) |
| `darkGrayText` | #242427 | #FFFFFF | 1.0 (default, inferred) |
| `background` | #FFF7EC | #151517 | 1.0 (default, inferred) |
| `backgroundSeparator` | #D8D8D8 | #38383A | 1.0 (default, inferred) |
| `backgroundLight` | #FFF7EC | (same as light / not separate) | 1.0 (default, inferred) |
| `backgroundRed` | #F53131 | (same as light / not separate) | 1.0 (default, inferred) |
| `backgroundWhite` | #FFFFFF | #1D1D1F | 1.0 (default, inferred) |
| `backgroundWhite2` | #FFFFFF | #151517 | 1.0 (default, inferred) |
| `backgroundWhite3` | #F7F7F7 | #212124 | 1.0 (default, inferred) |
| `backgroundWhite4` | #FFFFFF | #212124 | 1.0 (default, inferred) |
| `backgroundYellow` | #FEF8EF | #151517 | 1.0 (default, inferred) |
| `backgroundWhiteAndLightDark` | #FFFFFF | #242426 | 1.0 (default, inferred) |
| `grayBorderColor` | #BFBFBF | #737373 | 1.0 (default, inferred) |
| `lightGray` | #A1A4B3 | (same as light / not separate) | 1.0 (default, inferred) |
| `quaternary` | #3C3C43 | #EBEBF5 | 0.18 |
| `bluredDarkBlue` | #00033A | (same as light / not separate) | 0.6 |
| `border` | #D9D9D9 | #595959 | 1.0 (default, inferred) |
| `backgroundSeparatorGray` | #CCCCCC | (same as light / not separate) | 1.0 (default, inferred) |
| `backgroundSeparatorGray2` | #C2C5CC | (same as light / not separate) | 1.0 (default, inferred) |
| `backgroundSeparatorGray3` | #C2C5CC | #3A3940 | 1.0 (default, inferred) |
| `tempo` | #2F2F31 | (same as light / not separate) | 1.0 (default, inferred) |
| `graySlider` | #979797 | (same as light / not separate) | 1.0 (default, inferred) |

Observations:
- Brand blue `#35AFF7` appears in `blue`, asset `backgroundBlue`/`AnnotationTextButton`, and Lottie `playing_new.json` (**exact**).
- Brand orange `#F77026` and yellow `#FFBE00` recur in Lottie `anim_training*.json`, `Streak.json`, `RocketLoadingAnim.json` (**exact**).
- Navy `#00033A` is the dark-mode launch/perf background and the "darkBlue" token (**exact**).
- Light background is warm cream `#FFF7EC` (not white); dark background is `#151517` (**exact**).
- Other inline 6-hex literals found in `MetronautUI` code: `FFFFFF`, `242427`, `C2C5CC`, `3A3940`, `1D1D1F`, `F77026`, `00033A`, `D8D8D8`, `38383A` (**exact**, small-string scan). `MetronautPreviewUIKit`: `35AFF7`×7, `FFBE00`×3, `A0A3AD`×3 (**exact**). Main binary: `111111`, `204747`, `9599A3` (**exact**).
- GuidoKit placeholder score uses grey `0xD9D9D9` for staff, bars, clef and notes while a score loads (**exact**, `GuidoKit.framework/…/Resources/placeholder.gmn`).

### 1.3 Theme types (**exact**, Core `__swift5_fieldmd`)

- `Core.Theme { primary, secondary, textPrimary, textSecondary, buttonText, buttonOutline: UIColor; buttonType: Core.ButtonType; buttonRounded: Bool; buttonRadius }`.
- `Core.ButtonType`: `filled`, `outlined`.
- `Core.ThemeType`: `bubble_gum`, `tangerine`, `navy`, `lavender`, `sweden`, `grass`, `sunlight`. Hex values for these themes were not recovered (**gap**; they are built in stripped code).
- `MetronautResourceKit.ShadowStyle { color, alpha: Float, x: Int, y: Int, blur: Int, spread: Int, cornerRadius: Int }` and `BorderStyle { color, width: UInt }` (**exact**). The shape matches Figma/Zeplin export tokens (**inferred**).
- Painter artwork themes exist as images: `Kandinsky`, `Klimt`, `Miro`, `Miro2`, `Mondiran` (sic), `Munch`, `VanGogh`, `VanGogh2`, each with `_Thumbnail` (**exact**, Assets.car). Use is likely user-selectable backgrounds (**inferred**).

### 1.4 Image set inventory (**exact** names; grouping **inferred**)

App catalog: 462 names. ResourceKit and PreviewUIKit catalogs: 134 names each (the same names). Braze: 5. Grouped below across all three Metronaut catalogs (deduplicated).

| Group (inferred from name) | Count | Image set names (exact) |
|---|---|---|
| Account / instruments / education | 34 | `AccountEmail`, `AccountMIDI`, `AccountStatus`, `AccountStudent`, `AccountSubscription`, `AccountTeacher`, `AccountTeacherLink`, `Etablissement_accountCell`, `ProfIcon`, `SendStudent`, `ShareStudent`, `Students_accountCell`, `account-instrument-34`, `account-instrument-35`, `account-instrument-37`, `account-instrument-38`, `account-instrument-40`, `account-instrument-42`, `account-instrument-43`, `account-instrument-45`, `account-instrument-46`, `account-instrument-48`, `account-instrument-49`, `account-instrument-63`, `account-instrument-65`, `account-instrument-family-1`, `account-instrument-family-2`, `account-instrument-family-3`, `account-instrument-family-4`, `account-instrument-family-5`, `account-instrument-family-7`, `institution_status`, `student_status`, `teacher_status` |
| Annotation | 4 | `Annotation`, `Annotation Avance`, `Annotation Chanteur`, `Annotation&print` |
| App Tracking Transparency prompt | 6 | `ATT illustration`, `advertiserTracking-header`, `att_hands`, `att_icon1`, `att_icon2`, `att_icon3` |
| Artwork themes (painter-style backgrounds) | 16 | `Kandinsky`, `Kandinsky_Thumbnail`, `Klimt`, `Klimt_Thumbnail`, `Miro`, `Miro2`, `Miro2_Thumbnail`, `Miro_Thumbnail`, `Mondiran`, `Mondiran_Thumbnail`, `Munch`, `Munch_Thumbnail`, `VanGogh`, `VanGogh2`, `VanGogh2_Thumbnail`, `VanGogh_Thumbnail` |
| Audio / MIDI input | 8 | `MIDI_bluetooth_connection`, `MIDI_wait_connection`, `MIDI_wired_connection`, `Signal`, `connectExternalAudio`, `micaccess-illustration`, `microphone_access`, `midi_instrument` |
| Avatars | 11 | `Avatar1`, `Avatar2`, `Avatar3`, `Avatar4`, `Avatar5`, `Avatar6`, `Avatar7`, `Avatar8`, `att_avatar`, `avatar_none_dark`, `avatar_none_light` |
| Clef picker | 8 | `alto`, `bass`, `bass+8`, `bass-8`, `tenor`, `treble`, `treble+8`, `treble-8` |
| Feature illustrations (subscription/feature lists) | 18 | `Accompagnement`, `Accompagnement Avance`, `Accompagnement Chanteur`, `Accompagnement Debutant`, `Accompagnement Piano`, `Accompagnement_Piano`, `Catalogue`, `Catalogue Avance`, `CatalogueCard`, `Feeback`, `Feedback`, `Feedback Debutant`, `Feedback Piano`, `IconRythme`, `Partitions`, `RhythmGame`, `RhythmeGame`, `Transposition Chanteur` |
| Gamification: grades | 20 | `Grade_1`, `Grade_10`, `Grade_11`, `Grade_12`, `Grade_13`, `Grade_14`, `Grade_15`, `Grade_16`, `Grade_17`, `Grade_18`, `Grade_19`, `Grade_2`, `Grade_20`, `Grade_3`, `Grade_4`, `Grade_5`, `Grade_6`, `Grade_7`, `Grade_8`, `Grade_9` |
| Gamification: leagues | 8 | `league_bronze`, `league_diamond`, `league_down`, `league_gold`, `league_none`, `league_silver`, `league_up`, `league_wood` |
| Gamification: stats & rewards | 17 | `Badge`, `BestStreak`, `BestStreakOrange`, `Challenge`, `LaurelLeft`, `LaurelRight`, `Level`, `Level1`, `Level2`, `Level3`, `Level4`, `PresentStats`, `Steps`, `Streak`, `TimePlayed`, `XP`, `crown` |
| Generic controls / SF-symbol-like overrides | 38 | `CloseIcon`, `actionlist-close-button`, `arrow.triangle.2.circlepath.circle`, `arrow.triangle.2.circlepath.circle.fill`, `back-button`, `button-arrowUp`, `button-seeMore`, `button-seeMore-compact`, `chevron.up`, `chevron.up.circle`, `circularPlayButton-pause`, `circularPlayButton-play`, `circularPlayButton-play-loading`, `circularPlayButton-retry`, `circularPlayButton-warning`, `clearButton`, `close_bt`, `externalLinkWeb_close`, `externalLinkWeb_retry`, `flag`, `flag.fill`, `global-close`, `global-close-gray`, `global-iconSelected`, `global-tuner`, `help-button`, `icon_opus`, `icon_pause`, `icon_piece`, `icon_play`, `preview-close`, `preview-end`, `preview-retry`, `searchIcon`, `search_perf`, `see-more`, `speaker.wave.2`, `speaker.wave.2.fill` |
| Genres / composers | 7 | `Classique`, `Pop`, `Pop_Classique`, `composer1`, `composer2`, `composer3`, `global-defaultComposer` |
| Home / My Music / discovery | 18 | `Bullet`, `CardBackground`, `Clap`, `HandsClap`, `MusicScore`, `Musician-Trumpet`, `Orchestra`, `PlayPiece`, `discovery-welcomeUser`, `header-trombone`, `header-violin`, `landing-orchestra`, `mymusic-emptyview`, `mymusic-piece-placeholder-left`, `mymusic-piece-placeholder-middle`, `mymusic-returningUser`, `pieceCell-icon-free`, `pieceCell-icon-purchased` |
| Launch / branding | 8 | `AppIcon2`, `AppIconSvg`, `icon-detoured`, `launch-horizontal`, `launch-horizontal-iPad`, `launch-vertical`, `launch-vertical-iPad`, `metronaut_footer` |
| Loading (conductor frames) | 12 | `ChefOrchestre_0`, `ChefOrchestre_1`, `ChefOrchestre_10`, `ChefOrchestre_11`, `ChefOrchestre_2`, `ChefOrchestre_3`, `ChefOrchestre_4`, `ChefOrchestre_5`, `ChefOrchestre_6`, `ChefOrchestre_7`, `ChefOrchestre_8`, `ChefOrchestre_9` |
| Login / authentication | 34 | `AccountProvider`, `auth_form_input_invalid`, `auth_form_input_valid`, `auth_form_secure_input_isInvisible`, `auth_form_secure_input_isVisible`, `auth_form_submit_highlited`, `auth_form_submit_normal`, `auth_form_submit_step0`, `auth_form_submit_step1`, `auth_form_submit_step10`, `auth_form_submit_step11`, `auth_form_submit_step12`, `auth_form_submit_step13`, `auth_form_submit_step14`, `auth_form_submit_step15`, `auth_form_submit_step16`, `auth_form_submit_step17`, `auth_form_submit_step2`, `auth_form_submit_step3`, `auth_form_submit_step4`, `auth_form_submit_step5`, `auth_form_submit_step6`, `auth_form_submit_step7`, `auth_form_submit_step8`, `auth_form_submit_step9`, `connect-facebook`, `connect-illustration`, `connect-mail`, `connect-phone`, `facebook_logo_highlited`, `facebook_logo_normal`, `wechat-login`, `wechat_logo_highlighted`, `wechat_logo_normal` |
| Onboarding | 59 | `Age1`, `Age2`, `Age3`, `Age4`, `Age5`, `Age6`, `Age7`, `Apprendre`, `Interpretation`, `MusicienReve`, `Objectif1`, `Objectif2`, `Objectif3`, `Objectif4`, `Objectif5`, `Objective`, `OnboardingGenreClassical`, `OnboardingGenreCountry`, `OnboardingGenreJazz`, `OnboardingGenrePop`, `OnboardingGenreRock`, `OnboardingGenreRomantic`, `OnboardingGenreSoul`, `OnboardingGenreSoundtracks`, `OnboardingLevelAIComment`, `OnboardingTraining`, `Pact`, `commentaryLevel1`, `commentaryLevel2`, `commentaryLevel3`, `commentaryLevel4`, `commentary_instrument_bassoon`, `commentary_instrument_cello`, `commentary_instrument_clarinet`, `commentary_instrument_double_bass`, `commentary_instrument_flute`, `commentary_instrument_guitar`, `commentary_instrument_horn`, `commentary_instrument_oboe`, `commentary_instrument_other`, `commentary_instrument_piano`, `commentary_instrument_saxophone`, `commentary_instrument_singer`, `commentary_instrument_trombone`, `commentary_instrument_trumpet`, `commentary_instrument_viola`, `commentary_instrument_violin`, `commentary_platform_icons`, `commentary_screen`, `onboarding_commitment_fingerprint`, `onboarding_commitment_illustration`, `onboarding_goal_concert`, `onboarding_goal_discover`, `onboarding_goal_enjoy`, `onboarding_goal_motivation`, `onboarding_goal_progress`, `pref_both`, `pref_classical`, `pref_pop` |
| Other | 12 | `SuccessTraining`, `SwipeGesture-VideoFeed`, `authorisePushNotif-header`, `congratulationInfo-header-bottom`, `congratulationInfo-header-text`, `icon-free`, `icon-purchased`, `isOriginalChecked`, `isOriginalUnChecked`, `performance.navBar_close`, `thumpUp`, `widget-appLogo` |
| Packed atlases (internal) | 6 | `ZZZZPackedAsset-1.0.0-gamut0`, `ZZZZPackedAsset-1.0.1-gamut0`, `ZZZZPackedAsset-1.1.0-gamut0`, `ZZZZPackedAsset-2.0.0-gamut0`, `ZZZZPackedAsset-2.0.1-gamut0`, `ZZZZPackedAsset-2.1.0-gamut0` |
| Performance (score page) controls | 70 | `Balance`, `Clavier`, `Clavier Piano`, `Hands_Both`, `Hands_Left`, `Hands_Right`, `Latency`, `PracticeHelper Piano`, `PracticeHelper_Piano`, `ScoreSettings`, `Tempo`, `Tempo Debutant`, `Tempo Piano`, `TempoNormal`, `TempoNormalFilled`, `TempoSmart`, `TempoSmartFilled`, `TempoWait`, `TempoWaitFilled`, `ear`, `ear.fill`, `hands`, `listen_hint`, `metronome`, `metronome.fill`, `performance-feedback-off`, `performance-feedback-on`, `performance-hands-selector-both`, `performance-hands-selector-left`, `performance-hands-selector-right`, `performance-handsSettings-double`, `performance-handsSettings-left`, `performance-handsSettings-right`, `performance-mode-listen`, `performance-mode-magic`, `performance-mode-magic-hands-both`, `performance-mode-magic-hands-left`, `performance-mode-magic-hands-right`, `performance-mode-mute`, `performance-mode-play`, `performance-mode-play-euphonium`, `performance-mode-play-flute`, `performance-mode-play-guitar`, `performance-mode-play-hands-both`, `performance-mode-play-hands-left`, `performance-mode-play-hands-right`, `performance-mode-play-harp`, `performance-mode-play-horn`, `performance-mode-play-piano`, `performance-mode-play-saxophone`, `performance-mode-play-trombone`, `performance-mode-play-trumpet`, `performance-mode-play-violin`, `performance-mode-play-voice`, `performance-mode-play-wind`, `performance-mode-volume`, `performance-mode-wait`, `performance-mode-wait-hands-both`, `performance-mode-wait-hands-left`, `performance-mode-wait-hands-right`, `performance-modes`, `performance-reducedPiano`, `performance-settings`, `performance-volume-general`, `performance-volume-metronome`, `piano_keys`, `solo`, `solo_status`, `studio`, `studio_active` |
| Performance settings menu | 14 | `settings_add_collection`, `settings_anotate`, `settings_audio`, `settings_fullperf`, `settings_partition`, `settings_practiceInstructions`, `settings_print`, `settings_problem`, `settings_rec_audio`, `settings_rec_camera`, `settings_share`, `settings_transpose`, `settings_tuner`, `settings_version` |
| Popups / status / toasts | 21 | `Download_status_error`, `Download_status_valid`, `Storage`, `appUpdate`, `cloud`, `errorInfo-appStore`, `errorInfo-default`, `errorInfo-network`, `error_popup`, `internal_toast_error`, `internal_toast_success`, `notification`, `notificationpermission`, `popup.notificationsAsk`, `popup_workout_start`, `popup_workout_success`, `push-illustration`, `sad-singer`, `speechrecognition_popup`, `vocal_commands`, `waiting` |
| Practice / workouts / misc settings | 13 | `AppSettings`, `Contact`, `Delete`, `Help`, `Instrument`, `Preference`, `Reminders`, `Rename`, `home.practiceDashboad.chrono`, `training_start`, `training_success`, `workout_notachieved`, `workout_start` |
| Print | 7 | `Print`, `Print Avance`, `Print Chanteur`, `Print Debutant`, `print-close`, `print-warning`, `print_popup` |
| Rating / feedback / favourites | 13 | `fav-off`, `fav-on`, `fav-placeholder`, `feedback_negative`, `feedback_neutral`, `feedback_positive`, `rating-close`, `rating-left-image`, `rating-off`, `rating-on`, `rating-right-image`, `thumb-up`, `upvote_grey` |
| Recording | 21 | `Audio`, `AudioRec`, `AudioRecLandscape`, `AudioRecording_thumbnail`, `Recording`, `Recording Avance`, `Recording Chanteur`, `Recording Chanteur Copy`, `Recording Debutant`, `RecordingAlert`, `RecordingAudio`, `RecordingVideo`, `VideoRec`, `VideoRecLandscape`, `record.circle`, `record_videoFilm`, `recording-empty`, `recording_audio`, `recording_camera`, `recording_uploaded`, `recording_video` |
| Sharing / piece menu | 13 | `Export`, `Invite`, `PieceMenuAddToPlaylist`, `PieceMenuOffline`, `PieceMenuShare`, `Publish`, `ShareCell_Collection`, `ShareCell_Piece`, `ShareCell_Playlist`, `ShareCell_Recording_Audio`, `ShareCell_Recording_Video`, `friends-button`, `socialsharing-header` |
| Subscription / paywall / cancellation | 21 | `HowToSwitchOff`, `SouscriptionBackground`, `Subscription_home_crossDevice`, `Subscription_home_engagement`, `Subscription_home_illimited`, `SwitchOffForm_1`, `SwitchOffForm_2`, `SwitchOffForm_3`, `SwitchOffForm_4`, `SwitchOffForm_5`, `SwitchOff_Offer_Gift`, `christmasTheme`, `congrats-subscription`, `reminder_offert_bandeau`, `subscription-appstore-reward`, `subscription-background-header`, `subscription-background-header-promotion`, `subscription-close`, `subscription.product.selected`, `subscriptionMusicians`, `unsubscribe-bottom` |
| Tab bar | 5 | `tab-discover`, `tab-mymusic`, `tab-profile`, `tab-search`, `tab_practice` |

Rendering details (**exact**, `assetutil`):
- Template-rendered (tintable) images: `alto`, `auth_form_secure_input_isInvisible`, `auth_form_secure_input_isVisible`, `bass`, `bass+8`, `bass-8`, `fav-off`, `fav-on`, `performance-hands-selector-both/left/right`, `see-more`, `settings_rec_camera`, `tab-discover`, `tab-mymusic`, `tab-profile`, `tab-search`, `tab_practice`, `tenor`, `thumb-up`, `treble`, `treble+8`, `treble-8`.
- Vector (PDF/SVG) entries: 70, including all `performance-mode-*` icons (per instrument: euphonium, flute, guitar, harp, horn, piano, saxophone, trombone, trumpet, violin, voice, wind; per hand: both/left/right; modes listen, magic, mute, play, wait, volume), `tab-*`, `launch-*`, `feedback_*`, `fav-*`.
- Clef picker icons map to the clef setting cases `g2`, `g2p8`, `g2m8`, `c3`, `c4`, `f4`, `f4m8`, `f4p8` (**exact** enum `MetronautResourceKit.SettingsText.Clef`; mapping **inferred**).

App icon (**exact**): `AppIcon2` "Icon Image", idiom `pad`, 1024×1024 ARGB, plus MultiSized `AppIcon2` (1 size). `Resources/AppIcon2.icns` (30,852 bytes). `AppIconSvg` raster 102×102 @1x and 204×204 @2x. Launch images: `launch-horizontal`, `launch-horizontal-iPad`, `launch-vertical`, `launch-vertical-iPad`; plus `Base.lproj/LaunchScreen.storyboardc`.

Code-side image enums (**exact**, `MetronautResourceKit` field metadata):
- `AssetsImageSys` (SF Symbols): `icon_tab_my_music`, `icon_tab_discover`, `icon_tab_search`, `icon_tab_account`, `icon_perf_tab_workout_restart`, `icon_perf_tab_workout_next`, `icon_perf_tab_workout_back`, `icon_perf_bar_item_volume`, `icon_perf_bar_item_loop`, `cell_opus_fav_off`, `cell_opus_fav_on`.
- `AssetsImageApp`: `close_bt`, `tab_practice`, `default_placeholder_piece`, `icon_close`, `icon_cell_piece`, `icon_cell_opus`, `card_discover1..4`, `card_subscribe`, `cell_opus_free`, `cell_opus_purchased`, `cell_opus_fav_off`, `cell_opus_fav_on`, `cell_opus_preview_play`, `cell_opus_preview_pause`, `drawer_open`, `drawer_piano`, `perf_bar_listen`, `perf_bar_listen_outline`, `perf_bar_metronome`, `perf_bar_metronome_outline`, `perf_bar_tempo_normal`, `perf_bar_tempo_wait`, `perf_bar_tempo_smart`, `perf_bar_tempo_normal_filled`, `perf_bar_tempo_wait_filled`, `perf_bar_tempo_smart_filled`, `perf_bar_step`, `perf_bar_step_outline`, `perf_bar_hands_both`, `perf_bar_hands_left`, `perf_bar_hands_right`, `perf_bar_volume`, `perf_bar_volume_outline`, `perf_bar_loop`, `perf_bar_loop_outline`, `perf_bar_rec`, `perf_bar_rec_audio`, `perf_bar_rec_video`.
- `AssetRendering`: `template(tintColor, rotate: Double)`, `original`. `AssetKind`: `xcasset(Bundle)`, `system` (SF Symbol). `SimpleAsset { name, kind, rendering }`.
- The three tempo icons (`TempoNormal`, `TempoSmart`, `TempoWait`, each with `Filled`) show three tempo behaviours: fixed tempo, smart (follow) tempo, wait mode (**exact** names; meaning **inferred**).

---

## 2. Typography

### 2.1 UI font family (**exact**, `MetronautResourceKit.FontType.name.getter` disassembly)

| `FontType` case | Font PostScript name |
|---|---|
| `light` | `HelveticaNeue-Light` |
| `normal` | `HelveticaNeue` |
| `bold` | `HelveticaNeue-Bold` |
| `italic` | `HelveticaNeue-Italic` |
| `music` | `BravuraText` |

- `MetronautResourceKit.Font { name: String; size: Float }` with factories `Font.light(with:)`, `.normal(with:)`, `.bold(with:)`, `.italic(with:)`, `.music(with:)` (**exact** symbols).
- `TextStyle { font: Font; color: Resource.Color?; alignment: center|left|right?; properties: [underline(color) | highlight(color)] }` (**exact**).
- `TextModel { values: [Value{ kind: text|asset, style: TextStyle }], separator: String? }` lets one label mix text runs and inline icons (**exact** fields; behaviour **inferred**).
- `Core.FontHelper` class exists; `Core` contains the string `HelveticaNeue` (**exact**).
- Per-component font sizes are passed at call sites as float immediates in stripped code. They were not enumerated (**gap**).

### 2.2 Music fonts (**exact**)

- `Bravura.otf` v1.392 and `BravuraText.otf` v1.204, registered via `UIAppFonts` (`Info.plist`).
- GuidoKit references `Bravura`, `BravuraText`, `Bravura Text`, `bravuraFontUrl`, and logs `<<< Bravura doesn't exist in System!` (**exact**, `GuidoKit` strings). So GUIDO is configured to draw with Bravura (SMuFL) rather than its native Guido2 font when available (**inferred** from strings).
- `guido2.ttf` (Guido2 v3.93, GRAME) ships in `GuidoKit.framework/Versions/A/Resources/` and is also embedded as an SVG font in the binary (**exact**).
- GUIDO text defaults include `Times New Roman` 10pt for lyrics/text (`S,font,Times New Roman,o;U,fsize,10pt`), `Times New Roman Bold Italic`, `Helvetica`, `HelveticaNeue-Bold` (score header) (**exact**, GuidoKit strings).
- `GuidoKitScoreHeader { title, subtitle, composer, showVersionSelector, version, previewHeader, previewFontName, previewFontColor, composerYpos, versionLayer, scoreLayer }` (**exact**).

---

## 3. Layout constants

| Constant | Value | Evidence |
|---|---|---|
| `MetronautUI.ViewConsts.CELL_CORENER_RADIUS` (sic) | 8 pt | **exact**, `__DATA` double + getter `fmov d0,#8` |
| `MetronautUI.ViewConsts.CELL_HEIGHT` | 64 pt | **exact** |
| `MetronautUI.ViewConsts.WIDGET_SPACING` | 32 pt | **exact** |
| `MetronautUI.ViewConsts.WIDGET_ITEMS_SPACING` | 16 pt | **exact** |
| `MetronautUI.ViewConsts.SHADOW_RADIUS` | 2 pt | **exact** |
| `static CellPostUIView.cellSize`, `static CellVideoUIView.cellSize` | CGSize (value not recovered) | **exact** names |

These are the only exported constant getters in the Metronaut modules (scan of all `.getter : CGFloat/Double/Float/Int` with a constant body). Other dimensions live in stripped code (**gap**).

Notable configurable components (**exact** field names):
- `GuidoKitPageTurnView { pageTurnMode: Horizontal|Vertical; maskingX; maskingY; pageTurnLayer; previousPageLayer; nextPageIndex; scoreBackgroundColor; dimmedScoreBackgroundColor; appearanceAnimationDuration; disappearanceAnimationDuration; bgcolorAnimationDuration; waitFinalDuration; automaticPreviousPageTurn; edgeTriangle; edgeTriangle2; delimiterThickness1; delimiterThickness2 }`. This is a "half-page turn" view. The next page is revealed under a mask with a triangle edge marker before the full turn (**inferred**).
- `PianoOnsetFeedbackLayer { markerStorage: [OnsetMarker]; markerLayers; correctColor; wrongColor }` and `PitchFeedbackLayer { pitchStorage: [PitchZone] }` draw per-note right/wrong feedback on the score (**exact** fields).
- `TempoSliderUIView { tempo: Int; maxSliderWidth; sliderValue: Double; isLockedAt100: Bool; tempoArray: [Int]; lockThresholdLower; lockThresholdUpper; unlockThresholdLower; unlockThresholdUpper }`. The slider snaps ("locks") to 100 % with hysteresis (separate lock/unlock thresholds) (**exact** fields; hysteresis reading **inferred**; numbers not recovered).
- `PerformanceBarItem { orientation; handler; bt: PerformanceBarEnum; title; image; system: Bool (SF Symbol); badge; tint; isIpad; isPressed }`.
- `PerformanceBarEnum`: `rec`, `loop`, `tempo`, `feedbackAI`, `mode`, `listen`, `steps`, `playPause`, `rewind`, `metronome`, `tap_rhythm` (**exact**).
- `PlayerControlsUIView { barModel; recActive; recMode; isPlaying; isExplicitRecording; showingPlayer; isBuffering; playerActive; playingMode; handler }`.
- `PianoKeyboardUIView { pianoContext; height; onTap; horizontalSizeClass }` (on-screen keyboard that can be minimised: `isPianoMinimized` in `MetronautPerformanceConfigValue`).
- `CircularButton { image; tint; badge; isBuffering; tapAction; width; accessibilityLabel; withShadow; sfsym; circle; isPressed; strokeStyle }`.
- `CircularProgressBar { state; height; isLogged; animatedOrangeProgress; phaseTracker; sweepAngle; startAngle; strokeWidth }`.
- `TunerViewModel { tunerBase: Float (A4 Hz); octave; noteName; tunerToneToggle; tunerToneToggleDisabled; fadeTimer; tunerAudioEngine; volume; playMessKey; onTunerBaseChange }`; `DiapasonView { stepperValue: Float }`; `AnalyzerView { detectedPitch; pitchNameSize }`; `Core.MusicNote { baseDiapason; isDetecting; f0; target; lastDetectedF0; printName; cents; analyzerPos; analyzerColor; name: NoteName; octave }`.
- `MetronautUI.AlertDisplay`: `drawer`, `message`, `popup`, `snackbar`, `fullscreen` (five presentation styles).
- `MetronautUI.PopupUIViewEnum` cases: `custom`, `error`, `workout_start_step`, `workout_step_success`, `workout_step_fail`, `pushNotification`, `congrats`, `resetMyAccount`, `purchaseRestore`, `accompaniment_update`, `solo_piece`, `micro_permission`, `video_recording`, `listen_recording_video`, `listen_recording_audio`, `listenButton_hint`, `appUpdate`, `criticalAppUpdate`, `search_perf`, `storage_low`, `recording_camera`, `recording_camera_settings`, `recording_publish_community`, `recording_publish_share_from_teacher`, `recording_publish_share_from_student`, `recording_already_published`, `recording_upload_done`, `shareForbidden`, `workout_training_start`, `workout_training_success`, `midi_connection`, `recording_internalSpeaker_warning`, `prefer_headphones`, `headphone_speaker_prompt`, `speechrecognition_permission_prompt`, `speechrecognition_permission_denied`, `download_piece`, `printNotAllowed`, `printLoading`, `deconnexion` (**exact**).
- `LoadingView.Appearance`: `selected(loading(progress: Float) | loaded)`, `hidden`, `error`; `LoadingView.ColorsConfig { background, progress, error }` (**exact**).

---

## 4. View and controller inventory (**exact**, Swift type metadata)

Names ending in View/Controller/VC/Cell/Bar/Button/Header/Footer/Popup/Modal/Banner/Picker/Slider/Widget/Layer etc. Third-party types (Lottie, Braze, SwiftUIIntrospect, SwiftUIPager, Nuke) are excluded. Grouped by module; module boundaries are the feature boundaries.

### MetronautPreviewUIKit (score/performance page and its settings)

`AdjustLatencyView`, `AirPlayView.Coordinator`, `AlertContentHandler`, `AnalyticsWorkoutPopupEvent`, `AnnotationButtonStyle`, `AnnotationButtonStyle.MyButton`, `AnnotationMenuView`, `AnnotationOnboardingView`, `AnnotationTextButtonStyle`, `AnnotationTextButtonStyle.MyButton`, `AudioRouteView`, `AudioSettingsView`, `AudioSettingsViewModel`, `Bar`, `CameraPiPView`, `CameraViewModel`, `ClefSettingView`, `CoachProgressBar`, `CoachProgressBarBackground`, `CustomHorizontalPicker`, `CustomHorizontalPicker.Coordinator`, `DisplaySettingsView`, `DrawerBtUIView`, `HeaderMiddleView`, `HorizontalClefPicker`, `HorizontalClefPicker.Coordinator`, `InputAudioView`, `InputMenuView`, `LatencyAnimView`, `LatencySettingsView`, `LatencyView`, `MainSettingView`, `MIDISettingsViewModel`, `MixerView`, `NextPieceFooterView`, `OutputMenuView`, `PerformanceBarHandler`, `PerformanceBarItem`, `PerformanceBarItemContent`, `PerformanceBarUIView`, `PerformanceBarUIView.PerformanceBarView`, `PerformanceBarUIView.PerformanceIPhoneBarUIView`, `PerformanceBarUIViewModel`, `PerformanceControllerContext`, `PerformanceControllerManager`, `PerformanceControllerVersionLoadingStateContainer`, `PerformanceFeedbackAIBarItem`, `PerformanceHandsItemUIView`, `PerformanceHandsSelectorUIView`, `PerformanceHandsUIView`, `PerformanceHeaderView`, `PerformanceIPadBarUIView`, `PerformanceIPadPlayerControlsUIView`, `PerformanceListenUIView`, `PerformanceModeUIView`, `PerformanceProgressView`, `PerformanceRecordingListView`, `PerformanceRecordItemUIView`, `PerformanceRecordPlayerView`, `PerformanceRecordPlayerViewModel`, `PerformanceRecordUIView`, `PerformanceRhythmIPadBarUIView`, `PerformanceRhythmIPhoneBarUIView`, `PerformanceRhythmUIView`, `PerformanceRythmItemUIView`, `PerformanceSettingsModalAnalyticsManager`, `PerformanceSettingsModalConfig`, `PerformanceSummaryEndWorkoutUIView`, `PerformanceSummaryUIView`, `PerformanceSummaryUIViewModel`, `PerformanceTempoUIView`, `PerformanceToolbarView`, `PerformanceToolbarViewGroup`, `PerformanceToolbarViewModel`, `PerformanceView`, `PerformanceViewController`, `PerformanceViewControllerRepresentable`, `PerformanceWorkoutStepsCellUIView`, `PerformanceWorkoutStepsUIView`, `PianoKeyboardUIView`, `PianoUIView`, `PlayerControlsUIView`, `PreviewFooterView`, `RecordingVideoView`, `RecordingVideoViewModel`, `RecordTimerView`, `ScoreReaderViewModel`, `SettingsCell`, `SettingsCellWithDisclosure`, `SettingsCellWithToggle`, `SettingSectionView`, `SettingsUIViewModel`, `SliderModel`, `SoloSettingsView`, `SuiviControlView`, `TempoMetronomeUIView`, `TempoSliderUIView`, `TranspoSettingsView`, `TunerDrawerView`, `VideoFeedbackChoiceView`, `VolumeViewSection`, `WidgetsPerformanceViewDelegate`, `WorkoutCellUIView`, `WorkoutIPadBarUIView`, `WorkoutIPhoneBarUIView`

### MetronautSubscriptionUIKit (paywall)

`PremiumDescriptionControllerManager`, `SubscriptionBanner`, `SubscriptionConainerUIView`, `SubscriptionErrorModel.ButtonModel`, `SubscriptionErrorModel.Buttons`, `SubscriptionFeaturesCellUIView`, `SubscriptionFeaturesFooterBtUIView`, `SubscriptionFeaturesFooterUIView`, `SubscriptionFeaturesListUIView`, `SubscriptionFooterGroup`, `SubscriptionFreeTrialUIView`, `SubscriptionLineBanner`, `SubscriptionLogoUIView`, `SubscriptionNoFreeTrialUIView`, `SubscriptionNoTrialProductCommentUIView`, `SubscriptionNoTrialProductEditorsChoiceUIView`, `SubscriptionNoTrialProductRatingUIView`, `SubscriptionOffersHeaderUIModel`, `SubscriptionPageUIView`, `SubscriptionPageUIViewModel`, `SubscriptionProductButton`, `SubscriptionProductButtons`, `SubscriptionSegmentView`, `SubscriptionUIView`, `SubscriptionUIViewModel`, `SubscriptionViewController`, `SubscriptionViewControllerAnalyticsManager`, `SubscriptionViewControllerAppearanceManager`, `SubscriptionViewControllerResultContainer`, `VideoPlayerViewRepresentable`

### GuidoKit (score view layers)

`ECATextLayer`, `GuidoKitPageTurnView`, `GuidoKitScoreHeader`, `PianoOnsetFeedbackLayer`, `PitchFeedbackLayer`

### Metronaut (main app: root, tabs, home, discover, search, my music, practice/workouts, account, login, payments)

`AccountDisplayPrefsUIView`, `AccountLegalView`, `AccountProfileView`, `AccountRecordingUIView`, `AccountSettingsView`, `AccountSubscriptionUIView`, `AccountUIView`, `AccountUIViewModel`, `AccountUserAvatarGalleryUIView`, `AccountUserGoalUIView`, `AnalyticsCardEvent`, `AppleLoginButton`, `ApsAlert`, `CollectionView`, `CollectionViewModel`, `ComposerView`, `ComposerViewModel`, `ConsumablePurchaseController`, `DeeplinkInputViewModifier`, `DiscoverView`, `DiscoverViewModel`, `EmailLoginView`, `FacebookLoginButton`, `ForgotPasswordView`, `GoogleLoginButton`, `HomeRouteDestinationView`, `HomeTabsView`, `LoginFlowView`, `LoginHomeView`, `LoginProviderButton`, `MetronomeViewModel`, `MusicSheetAccess`, `MyMusicView`, `MyMusicViewModel`, `OfflineView`, `OfflineViewModel`, `PaymentQueueController`, `PaymentsController`, `PerformanceCoverView`, `PerformanceVCM`, `PracticeGoalView`, `PracticeGoalViewModel`, `PracticeReminderCoordinator`, `PracticeView`, `PracticeViewModel`, `RealmMusicSheetAccess`, `RecentlyPlayedView`, `RecentlyPlayedViewModel`, `RestorePurchasesController`, `RootAppView`, `RootAppViewModel`, `RootNavigation.LoginSheetPresentation`, `SearchView`, `SearchViewModel`, `SmsFirstStepView`, `SmsVerificationView`, `SubscriptionPurchaseController`, `SubscriptionViewControllerRessourceManager`, `SwitchOffCommentUIView`, `SwitchOffHowUIView`, `SwitchOffReasonUIView`, `SwitchOffUIViewModel`, `TabBarUIView`, `TabBarUIViewModel`, `WidgetResourcesService`, `WidgetsViewDelegate`, `WorkoutSubscribtBtUIView`, `WorkoutView`, `WorkoutViewModel`

### Metronaut_WidgetExtension (WidgetKit)

`MetronautCardWidgetImageView`, `MetronautCardWidgetView`, `MetronautItemWidgetView`, `MetronautListItemsWidgetView`, `MetronautWidget`, `MetronautWidgetItem`, `MetronautWidgetItemContainer`, `MetronautWidgetPracticeStatistics`, `MetronautWidgetProvider`, `MetronautWidgetProviderEntry`, `MetronautWidgetResourcesManager`, `MetronautWidgets`, `MetronautWidgetView`, `PracticeStatisticsWidget`, `PracticeStatisticsWidgetEntry`, `PracticeStatisticsWidgetProvider`

### MetronautUI (shared UI kit: cells, popups, tuner, onboarding, playlists, posts/video feed, widgets, gamification)

`AccountCell`, `AccountStorageProgressView`, `AccountTitlePageUIView`, `ActionButtonsContainerView`, `ActionButtonsContainerViewModel`, `ActionButtonView`, `ActionButtonViewModel`, `AlertConfig`, `AlertHandler`, `AlertUIView`, `AnalyzerView`, `AnyMetronautUpdatableViewConfig`, `AnyMetronautUpdatableViewModel`, `AnyMetronautUpdatableViewStyle`, `AsyncButton`, `AvatarUIView`, `BadgeUIView`, `ButtonPress`, `ButtonsView`, `ButtonsViewModel`, `ButtonUIView`, `ButtonUIViewModel`, `ButtonView`, `ButtonViewModel`, `CarouselView`, `CellCardUIView`, `CellCollectionSearchUIView`, `CellCollectionUIView`, `CellComposerUIView`, `CellMyMusicOnboardingUIView`, `CellOnboardingUIView`, `CellPieceMenuUIViewModel`, `CellPiecePlayUIView`, `CellPieceRequestUIView`, `CellPiecesListHeaderUIView`, `CellPieceUIView`, `CellPlaceholderUIView`, `CellPlaylistUIView`, `CellPostMenuUIView`, `CellPostUIView`, `CellRecordPieceView`, `CellRecordPieceViewModel`, `CellRecordView`, `CellRecordViewModel`, `CellSearchCategoryView`, `CellSearchRequestPieceUIView`, `CellSearchSearchPlaceholderUIView`, `CellSearchUIView`, `CellShareMenuUIView`, `CellShareUIView`, `CellStatsUIView`, `CellStudentUIView`, `CellTitleUIView`, `CellVideoUIView`, `CellWorkoutDetailsUIView`, `CellWorkoutStepUIView`, `CellWorkoutUIView`, `CircleButtonUIView`, `CircularButton`, `CircularProgressBar`, `CircularProgressView`, `ClearBackgroundView`, `ClearBackgroundViewModifier`, `ClearSearchPillView`, `CommitmentView`, `ConnectWhileVisibleViewModifier`, `CustomPopupData`, `DescriptionPageFormEvent`, `DescriptionPageFormView`, `DescriptionPageFormViewModel`, `DescriptionPageView`, `DescriptionPageViewModel`, `DeviceRotationViewModifier`, `DiapasonView`, `DisabledFeatureView`, `DrawerHeaderUIView`, `DynamicSizeViewModifier`, `EducationAdvantagesUIView`, `EducationUsersView`, `EducationUsersViewModel`, `EndPreviewCellUIView`, `EndPreviewUIView`, `FeatureDetailsUIView`, `FeaturesListCellUIView`, `FeaturesListUIView`, `FeaturesUIView`, `FeaturesUIViewModel`, `FeedbackQuestionView`, `GamificationDetailsHeaderView`, `GamificationDetailsView`, `GoalView`, `HelpCenterView`, `HelpCenterView.Coordinator`, `IconsView`, `InstrumentCellView`, `InstrumentsUIView`, `InstrumentsUIViewModel`, `InterceptableOnWidgetsView`, `LeagueCell`, `LeagueCells`, `LeagueModalView`, `LoadingAppUIView`, `LoadingView`, `MediaPlayerTimeSlider`, `MediaPlayPauseButton`, `MetronautUpdatableView`, `MetronautView`, `MIDISettingsView`, `MIDISynthView`, `MinimalDynamicScrollableViewModifier`, `MinimalScrollableViewModifier`, `ModalDestinationModifier`, `ModalView`, `MultiGenrePreferenceUIView`, `OnboardingCellUIView`, `OnboardingChildView`, `OnboardingCommentView`, `OnboardingUIView`, `OnReceiveIfVisibleViewModifier`, `PerfDifficultyGroupHeaderUIView`, `PerfDifficultyGroupUIView`, `PerformanceSummaryListItemUIView`, `PerfVersionCellUIView`, `PerfVersionsGroupHeaderUIView`, `PerfVersionsGroupUIView`, `PerfVersionsUIView`, `PieceMenuModalUIView`, `PieceMenuModalUIViewModel`, `PiecesUIView`, `PiecesUIViewModel`, `PlaylistAlert`, `PlaylistCreateAlertView`, `PlaylistCreateAlertViewModel`, `PlaylistDrawerCell`, `PlaylistDrawerUIView`, `PlaylistDrawerUIViewModel`, `PlaylistViewModel`, `PopupMessageSceneView`, `PopupUIView`, `PopupUIViewModel`, `PostsListUIView`, `PostsListUIViewModel`, `PostUIView`, `PostUIViewModel`, `PreferenceUIView`, `PreviewPlayerUIView`, `PreviewPlayerViewConfig`, `PreviewPlayerViewModel`, `ProgressUIView`, `RecommendationView`, `RecommendationViewModel`, `RecordPiecesView`, `RecordsView`, `RecordsViewModel`, `SaveVideoButton`, `SearchFilterItemView`, `SearchFiltersSectionView`, `SearchFiltersView`, `SearchPillListView`, `SearchPillView`, `SearchPlaceholderUIView`, `SearchPlaceholderUIViewModel`, `SearchTextFieldView`, `SettingPickerView`, `SharesView`, `SharesViewModel`, `ShareVideoButton`, `SplashScreenUIView`, `StorageUIView`, `StudentsButtonView`, `TextAlert`, `TextButtonUIView`, `TextFieldAlertView`, `TextUIView`, `TunerView`, `TunerViewModel`, `UISliderView`, `UISliderView.Coordinator`, `UserLevelUIView`, `UserMessageFooterUIView`, `UserMessageUIView`, `UserMessageUIViewModel`, `UserStatusUIView`, `VideoControlView`, `VideoHeaderView`, `VideoPlayerUIView`, `VideoPlayerView2`, `VideoViewControls`, `VideoViewLayer`, `ViewConsts`, `ViewControllerRepresentable`, `VoiceCommandView`, `WebView`, `WebViewContainer`, `WebViewContainer.Coordinator`, `WebViewModel`, `WebViewVC`, `WelcomeUIView`, `WidgetHeaderView`, `WidgetRowView`, `WidgetsResult`, `WidgetsScreenView`, `WidgetsSearchBoxUIView`, `WidgetsView`, `WidgetView`, `WorkoutHeaderHeaderImage`, `ZendeskMessageView`, `ZendeskMessageView.Coordinator`

Tab bar (**exact**, `Core.TabBarItem`): `myMusic`, `discovery`, `practice`, `search`, `account`.

UI stack (**exact**, imports/types): UIKit + SwiftUI hybrid (`…UIView` SwiftUI structs, `ViewControllerRepresentable`, `PerformanceViewControllerRepresentable`), RxSwift/RxCocoa, Combine (`CombineExt`, `RxCombine`), `SwiftUIIntrospect`, `SwiftUIPager`, `Nuke`/`NukeUI` images, Lottie (statically linked into `MetronautUI`).

---

## 5. Animations

### 5.1 Lottie files (**exact**, decoded JSON; durations = (op − ip) / fr)

Full per-layer data: `data/lottie_animations.json`. No file has markers. No file has text layers or fonts. Only `anim_success.json`, `game_particles.json`, `Particles.json` use precomp assets; none embed images.

| File | Lottie `v` | `nm` | fr | ip | op | Duration (s) | Size (w×h) | Layers | Assets (precomps/images) | Markers | Text/fonts |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `anim_success.json` | 5.5.6 | lottie (mobile) | 70 | 0 | 370 | 5.286 | 609×812 | 3 | 5 (0 images) | 0 | none |
| `anim_training.json` | 5.7.4 | Training | 30 | 0 | 64 | 2.133 | 300×250 | 4 | 0 (0 images) | 0 | none |
| `anim_trainingSuccess.json` | 5.7.4 | Training Success | 30 | 0 | 34 | 1.133 | 300×250 | 5 | 0 (0 images) | 0 | none |
| `playing.json` | 5.5.8 | Comp 1 | 30 | 0 | 60 | 2 | 128×128 | 3 | 0 (0 images) | 0 | none |
| `playing_new.json` | 4.8.0 | Comp 1 | 30 | 0 | 90 | 3 | 128×128 | 3 | 0 (0 images) | 0 | none |
| `showcase_announce_animation.json` | 5.1.16 | Master 12 | 25 | 0 | 76 | 3.04 | 375×340 | 25 | 0 (0 images) | 0 | none |
| `showcase_transposition_animation.json` | 5.3.4 | Composition 6 | 30 | 0 | 180 | 6 | 1000×850 | 23 | 0 (0 images) | 0 | none |
| `showcase_usergoal_announce_animation.json` | 5.3.4 | Calendar 7 | 60 | 0 | 72 | 1.2 | 375×320 | 6 | 0 (0 images) | 0 | none |
| `AnimationAssets/ClapAnimation.json` | 5.6.3 | Clap 4 | 60 | 0 | 41 | 0.683 | 375×200 | 6 | 0 (0 images) | 0 | none |
| `AnimationAssets/ErrorAnimation.json` | 5.7.4 | ErrorAnimation | 60 | 0 | 120 | 2 | 110×140 | 1 | 0 (0 images) | 0 | none |
| `AnimationAssets/game_particles.json` | 4.12.0 | confettis2 | 45 | 0 | 58 | 1.289 | 800×800 | 10 | 1 (0 images) | 0 | none |
| `AnimationAssets/Grade.json` | 5.12.1 | Grade | 30 | 0 | 90 | 3 | 150×150 | 5 | 0 (0 images) | 0 | none |
| `AnimationAssets/Particles.json` | 5.5.7 | star_composition | 60 | 0 | 600 | 10 | 1131×2436 | 29 | 5 (0 images) | 0 | none |
| `AnimationAssets/RocketLoadingAnim.json` | 5.7.4 | LoadingAnim | 60 | 0 | 120 | 2 | 230×230 | 6 | 0 (0 images) | 0 | none |
| `AnimationAssets/Streak.json` | 5.12.1 | Streak | 30 | 0 | 60 | 2 | 150×150 | 1 | 0 (0 images) | 0 | none |
| `AnimationAssets/subscription_congrats_animation.json` | 5.1.16 | Composition 7 | 25 | 0 | 25 | 1 | 600×600 | 3 | 0 (0 images) | 0 | none |


| File | Layer names (type), top level, in order | Main colours (fill/stroke hex × count) |
|---|---|---|
| `anim_success.json` | cannon (small - left) (precomp); cannon (small - right) (precomp); cannon (small - top) (precomp) | #F37312×5, #D08002×4, #EE9234×4, #BE5E30×4, #F07213×4, #F5A623×4, #F35532×4, #FAD2B4×4, #E55B22×4, #DA1E1E×3 |
| `anim_training.json` | Nul 2 (null); Altere (shape); Veines (shape); Bras (shape) | #FFBE00×3, #F77026×3, #B22D24×2, #00033A×1 |
| `anim_trainingSuccess.json` | Etoiles (shape); Nul 2 (null); Altere (shape); Bras 2 (shape); Bras (shape) | #FFBE00×9, #F77026×5, #B22D24×4, #00033A×1 |
| `playing.json` | Shape Layer 2 (shape); Shape Layer 3 (shape); Shape Layer 4 (shape) | #3EB0F4×3 |
| `playing_new.json` | Shape Layer 2 (shape); Shape Layer 3 (shape); Shape Layer 4 (shape) | #35AFF7×3 |
| `showcase_announce_animation.json` | ParentPot (null); Logo Silhouettes (shape); Masque Silhouettes (shape); Plante1 Silhouettes (shape); Plante2 Silhouettes (shape); plante3 Silhouettes (shape); TextContainer (shape); Carte (shape); Motifs (shape); NoteComplete (shape); NoteSansCroche (shape); Pot Silhouettes (shape); Parent (null); Tete (shape); MainArchet (shape); Instrument (shape); BrasArchet (shape); Cou (shape); Buste (shape); MainViolon (shape); BrasViolon (shape); Pantalon (shape); PiedsGauche (shape); PiedsDroite (shape); Ombre (shape) | #FFFFFF×12, #FF73A6×12, #FFCC73×12, #33C1FF×12, gradient×6, #24B283×4, #FFE9CC×3, #B27440×3, #DD8C4A×3, #279B71×3, #E8E3DD×2, #DAEFF7×2 |
| `showcase_transposition_animation.json` | ParentInstruments (null); Parent Clefs (null); ClefSol (shape); Clarinette (shape); B (shape); ClefFa (shape); Tuba (shape); # 3 (shape); # 2 (shape); ClefUt (shape); Basson (shape); # (shape); Trompette (shape); Contrebasse (shape); B 3 (shape); B 2 (shape); Violon (shape); Blanc uni 1 (solid) | #000000×19, gradient×17, #FFFFFF×1 |
| `showcase_usergoal_announce_animation.json` | Anneau (shape); Calendar (shape); MaskFill (shape); CurveFill (shape); MaskLigne (shape); CurveLigne (shape) | #D8D8D8×22, #FFFFFF×11, #1DBF60×8, gradient×3, #CCCCCC×3, #0DA6FF×1 |
| `AnimationAssets/ClapAnimation.json` | Traits 2 (shape); Traits (shape); RIghtHand Silhouettes (shape); RightThumb Silhouettes (shape); LeftHand Silhouettes (shape); LeftThumb Silhouettes (shape) | #FFE8BD×8, #FFC41C×2, #F5AE14×2 |
| `AnimationAssets/ErrorAnimation.json` | New Shape (shape) | #00033B×3, #FFBF00×2, #000047×2, #000000×1 |
| `AnimationAssets/game_particles.json` | confettis1 (precomp) | #FFCA27×7, #FFFFFF×5, #FEE18B×4, #F7EAC5×4 |
| `AnimationAssets/Grade.json` | Sparkle_left (shape); Sparkle_right (shape); Shine_Mask (shape); Shine (shape); New Shape (shape) | #FFFFFF×3, #FFBF00×2, #FFF7F0×2, #FA9612×1 |
| `AnimationAssets/Particles.json` | bigstar (precomp); medstar (precomp); smallstar (precomp); tinystar (precomp); allover (precomp) | #FFFFFF×16, gradient×6 |
| `AnimationAssets/RocketLoadingAnim.json` | Personnage (shape); Mask (shape); Cloud 1 (shape); Mask 2 (shape); Cloud 2 (shape); Circle (shape) | #000047×14, #FCE3AB×6, #00033B×4, #F58CC9×3, #B0B3F5×3, #36B0F7×3, #FF7A36×2, #FFFFFF×2, #FFBF00×1, #F77026×1 |
| `AnimationAssets/Streak.json` | New Shape (shape) | #FFBF00×1, #F77026×1 |
| `AnimationAssets/subscription_congrats_animation.json` | validationIcon Silhouettes 3 (shape); Spark02/validationIcon Silhouettes (shape); Spark01/validationIcon Silhouettes (shape) | #62F255×9, #00A661×7, gradient×1 |

### 5.2 What each animation shows (**inferred** from layer names) and where it is referenced

| File | What it shows (inferred) | Code reference |
|---|---|---|
| `anim_success.json` | Three confetti "cannons" (left, right, top) firing streamers, circles, stars, rectangles in orange/red. Celebration after success. | No literal found in code (**exact** negative search). Likely named by server-driven content (a card model has a `lottie` field, **exact** `CodingKeys { type; title; subtitle; lottie; url; … }`) (**inferred**). |
| `anim_training.json` | A muscled arm lifting a dumbbell ("Bras", "Altere", "Veines" = arm, dumbbell, veins). Training start. | Not found as literal. Matches popup `workout_training_start` (**inferred**). |
| `anim_trainingSuccess.json` | Same arm with stars ("Etoiles"). Training success. | Not found as literal. Matches `workout_training_success` (**inferred**). |
| `playing.json` / `playing_new.json` | Three animated bars (equaliser) in blue. "Now playing" indicator on a preview cell. | Literal `playing` exists in main, Core, PreviewCoreKit, PreviewUIKit, MetronautUI (**exact**), but may be a state name (**inferred**). |
| `showcase_announce_animation.json` | Violinist character with plants and a card with notes. Feature announcement. | Not found as literal (**inferred** remote-driven). |
| `showcase_transposition_animation.json` | Instruments (clarinet, tuba, bassoon, trumpet, double bass, violin) cycling with clefs (G, F, C) and accidentals. Transposition feature announcement. | Not found as literal. |
| `showcase_usergoal_announce_animation.json` | Calendar ring with a rising green curve. Practice-goal feature announcement. | Not found as literal. |
| `AnimationAssets/ClapAnimation.json` | Two clapping hands with motion strokes. Applause. | `ClapAnim…` literal in `MetronautUI` (**exact**). |
| `AnimationAssets/ErrorAnimation.json` | Single shape in navy/yellow. Error state. | `ErrorAni…` literal in `MetronautUI` (**exact**). |
| `AnimationAssets/game_particles.json` | 10 confetti bursts, gold/white. Rhythm-game reward. | `game_par…` literal in `MetronautUI` (**exact**). |
| `AnimationAssets/Grade.json` | Badge with shine sweep and sparkles. New grade reached. | `Grade` literal in `MetronautUI` and `Core` (**exact**). |
| `AnimationAssets/Particles.json` | Full-screen (1131×2436) drifting stars in blue/pink/purple, 10 s loop. Background for celebratory screens. | `Particle…` literal in `MetronautUI` (**exact**). |
| `AnimationAssets/RocketLoadingAnim.json` | Character ("Personnage") flying through clouds in a circle. Loading spinner. | String `RocketLoadingAnim` in `MetronautUI` (**exact**). |
| `AnimationAssets/Streak.json` | Flame in yellow/orange. Practice streak. | `Streak` literal in `MetronautUI`, `Core` (**exact**). |
| `AnimationAssets/subscription_congrats_animation.json` | Green check icon with two spark bursts. Purchase success. | String `subscription_congrats_animation` in main binary (**exact**). |

Lottie runtime (**exact**, `MetronautUI` symbols): `Lottie.RenderingEngineOption.coreAnimation`, `LottieAnimationCache.shared`, `DefaultAnimationCache.sharedCache`. The Core Animation rendering engine is selected (**inferred** from the referenced static).

### 5.3 Code animation constants

Exact numbers are hard to recover because most durations are loaded from constant pools in stripped functions. What I found:

| Item | Value | Evidence |
|---|---|---|
| SwiftUI APIs used in main app | `Animation.default`, `Animation.easeInOut`, `Animation.easeOut(duration:)`, `withAnimation`, `Transaction(animation:)` | **exact**, imports of `Contents/MacOS/Metronaut` |
| UIKit APIs | `UIView.animateWithDuration:animations:`, `…:delay:options:animations:completion:`, `UIViewPropertyAnimator`, `CABasicAnimation`, `CAKeyframeAnimation`, `CAAnimationGroup`, `kCAMediaTimingFunctionLinear`, `kCAAnimationCubic/Discrete/Linear` | **exact**, imports/strings |
| GuidoKit `setDuration:` calls | 0.25 s most common (20 call sites), also 0.5 s, 1 s, 10 s, 14 s | **inferred** (nearest preceding `fmov d0` before the call; heuristic) |
| `GuidoKitPageTurnView` | separate `appearanceAnimationDuration`, `disappearanceAnimationDuration`, `bgcolorAnimationDuration`, `waitFinalDuration` | **exact** field names; values not recovered |
| `PerformanceToolbarViewModel.animationDuration` | Double field | **exact** name; value not recovered |
| SwiftUIPager paging animations | `.standard`, `.steep`, `.none` | **exact** symbols |
| Loading conductor | 12 frames `ChefOrchestre_0…11`, `LoadingAsset.chef(index:)` | **exact**; frame-by-frame image animation (**inferred**) |
| Auth submit button | 18 frames `auth_form_submit_step0…17` | **exact**; frame animation of the submit button (**inferred**) |

---

## 6. Takeaways for a web piano trainer (**inferred**)

- Use two-tier tokens: a small semantic palette (background, primaryText, secondaryText, separator, tabBar) with light/dark pairs, plus brand accents (blue `#35AFF7`, orange `#F77026`, yellow `#FFBE00`, navy `#00033A`).
- A warm off-white page (`#FFF7EC`) under a white score area reduces glare while keeping the score crisp.
- Use Bravura (OFL) through SMuFL code points for any notation glyph in UI chrome (clef pickers, note names), as Metronaut does with `FontType.music = BravuraText`.
- Keep celebratory motion short (1–3 s) and loading loops at 2 s; reserve long particle loops (10 s) for full-screen reward screens.
- Per-note correct/wrong overlays on the score (two colours) plus a tempo slider that snaps to 100 % are cheap, high-value patterns.
