# Resources and licences

Scope: every bundled resource in `Metronaut.app` 9.0.3 (build 472), framework-embedded resources, third-party SDKs, privacy manifests, StoreKit config, and what was exported.

Evidence tags: **exact** = read from the file or binary (path given). **inferred** = interpretation or public knowledge not verified from the bundle.

Paths are relative to `/Applications/Metronaut.app/Contents/` unless stated.

---

## 1. Summary

| Category | Status | Exported? |
|---|---|---|
| Bravura, BravuraText (SMuFL music fonts) | Open: SIL OFL 1.1, verified from name table | Yes, `open-licensed/fonts/` |
| Guido2 font (`GuidoKit/…/guido2.ttf`) | Open: SIL OFL 1.1, verified from name table | Yes, `open-licensed/fonts/` |
| GUIDO Engine, libguidoar, libmusicxml (statically linked in `GuidoKit`) | Open source, MPL-2.0 (**inferred**, public knowledge). No licence text or acknowledgement found in the bundle (**exact** negative grep) | No (code, not a resource) |
| FluidR3 piano SoundFont | SF2 INFO says "DO NOT REDISTRIBUTE ANY OF THESE SAMPLES" (**exact**) | No |
| CoreML transcription models | Proprietary (no licence field) | No |
| Lottie animations, videos, images, icons, Assets.car | Proprietary art | No |
| Localisation strings | Proprietary text (parent documents the `en` table separately) | No (by this section) |
| SDK fonts in third-party bundles (FontAwesome 4.3, Roboto Bold) | Open (see §5) | No (not needed) |

---

## 2. `Contents/Resources` — every item

Sizes are byte sizes from `ls -l` for files and file counts for directories (**exact**).

| Item | Size / files | Type | Purpose | Proprietary or open |
|---|---|---|---|---|
| `all.json` | 75,879 B | JSON | Catalog/library data (documented by parent in CATALOG_MODEL.md) | Proprietary data |
| `anim_success.json` | 65,772 B | Lottie 5.5.6 | Confetti cannons celebration | Proprietary art |
| `anim_training.json` | 18,068 B | Lottie 5.7.4 | Arm + dumbbell "training" | Proprietary art |
| `anim_trainingSuccess.json` | 25,206 B | Lottie 5.7.4 | Arm + stars "training success" | Proprietary art |
| `playing.json` | 6,145 B | Lottie 5.5.8 | Equaliser bars, `#3EB0F4` | Proprietary art |
| `playing_new.json` | 7,942 B | Lottie 4.8.0 | Equaliser bars, `#35AFF7` | Proprietary art |
| `showcase_announce_animation.json` | 96,024 B | Lottie 5.1.16 | Violinist feature announcement | Proprietary art |
| `showcase_transposition_animation.json` | 163,263 B | Lottie 5.3.4 | Instruments + clefs, transposition announcement | Proprietary art |
| `showcase_usergoal_announce_animation.json` | 47,243 B | Lottie 5.3.4 | Calendar + curve, practice-goal announcement | Proprietary art |
| `AnimationAssets/` | 8 files | Lottie | `ClapAnimation`, `ErrorAnimation`, `game_particles`, `Grade`, `Particles`, `RocketLoadingAnim`, `Streak`, `subscription_congrats_animation` (see COMPONENTS_LAYOUT_MOTION.md §5) | Proprietary art |
| `AppResources/AntescofoIncludes/` | 2 files | Antescofo DSL text | `actions.asco.txt` (346 lines), `launch.asco.txt` (405 lines): score-following and accompaniment control scripts (parent documents logic) | Proprietary code |
| `AppIcon2.icns` | 30,852 B | ICNS | App icon | Proprietary |
| `Assets.car` | 11,987,656 B | Compiled asset catalog | 15 colour sets, 462 image names | Proprietary |
| `Base.lproj/LaunchScreen.storyboardc` | 3 files | Compiled storyboard | Launch screen | Proprietary |
| `Bravura.otf` | 512,924 B | OpenType CFF | SMuFL music font for notation | **Open, SIL OFL 1.1** (§4) |
| `BravuraText.otf` | 1,288,496 B | OpenType CFF | SMuFL text-oriented music font (`FontType.music`) | **Open, SIL OFL 1.1** (§4) |
| `CatalogAPI/icons/` | 60 PNG, e.g. 360×300 RGBA | PNG, SHA-1 file names | Bundled catalog icons (category/collection art; parent maps them) | Proprietary |
| `GoogleService-Info.plist` | 1,354 B | plist | Firebase project config. **Contains API keys/IDs. Values deliberately not copied.** | Config (secret-ish) |
| `help_center_article_style.css` | 9,473 B | CSS | Styling for in-app help-centre web articles (starts with a CSS reset) | Proprietary |
| `Metadata.appintents/` | 2 files | App Intents metadata | `extract.actionsdata`, `version.json` (`toolsVersion 27A9275`, `version 3.0`). Backs App Shortcuts "Open/Search/Practice in/Play … on Metronaut" | Proprietary |
| `Metronaut-dev.storekit` | 9,205 B | StoreKit test config (JSON) | Dev product catalogue (§6) | Config |
| `noTrialVideo.mp4` | 1,611,965 B | H.264, 1320×660, 30 fps, 15.0 s, no audio track (**exact**, ffprobe) | Paywall video for the no-trial offer (**inferred** from name) | Proprietary media |
| `onboarding.mp4` | 5,243,370 B | H.264, 1440×1080, 25 fps, 19.12 s, no audio track | Onboarding video | Proprietary media |
| `Pop.aiff` | 4,716 B | AIFF, 2 ch, 44.1 kHz, 16-bit, 0.022 s | Short UI "pop" click sound (**inferred** UI feedback) | Proprietary |
| `PrivacyInfo.xcprivacy` | 919 B | Privacy manifest | App's own required-reason APIs (§7) | Config |
| `de, en, es, fr, it, ja, ko, nl, pl, pt-BR, ru, sv, th, tr, uk, zh-Hans, zh-Hant .lproj` | 17 dirs × 4 files | `.strings`, `.stringsdict` | `AppShortcuts.strings`, `InfoPlist.strings`, `Localizable.strings` (en: 752,838 B, 4,219 keys), `Localizable.stringsdict` (en: 45 entries) | Proprietary text |
| `Alamofire_Alamofire.bundle` | 2 files | SPM resource bundle | Info.plist + PrivacyInfo | MIT (**inferred**) |
| `Amplitude_Amplitude.bundle` | 4 files | SPM bundle | PrivacyInfo, `AmazonRootCA1.cer`, `ComodoRsaDomainValidationCA.der` (certificate pinning) | MIT (**inferred**) |
| `AppAuth_AppAuth.bundle`, `AppAuth_AppAuthCore.bundle` | 2 each | SPM bundles | PrivacyInfo | Apache-2.0 (**inferred**) |
| `BranchSDK_BranchSDK.bundle` | 2 | SPM bundle | PrivacyInfo | MIT (**inferred**) |
| `braze-swift-sdk_BrazeUI.bundle` | 82 | SPM bundle | `Assets.car` (3 icons), `FontAwesome.otf` 4.3.0, `align.license` (MIT, Alexander Grebenyuk), InAppMessage/ContentCards localisations | Braze proprietary licence + MIT component |
| `Facebook_FacebookAEM/Core/Login.bundle` | 2 each | SPM bundles | PrivacyInfo | Facebook Platform licence (**inferred**) |
| `Firebase_FirebaseABTesting/Core/CoreExtension/CoreInternal/Crashlytics/Installations.bundle` | 2 each | SPM bundles | PrivacyInfo | Apache-2.0 (**inferred**) |
| `GoogleDataTransport_GoogleDataTransport.bundle` | 2 | SPM bundle | PrivacyInfo | Apache-2.0 (**inferred**) |
| `GoogleSignIn_GoogleSignIn.bundle` | 44 | SPM bundle | `google.png` @1x/2x/3x, `Roboto-Bold.ttf` (Apache-2.0, **exact** name table), localisations | Apache-2.0 |
| `GoogleSignIn_GoogleSignInSwift.bundle` | 2 | SPM bundle | PrivacyInfo | Apache-2.0 (**inferred**) |
| `GoogleUtilities_*` (AppDelegateSwizzler, Environment, Logger, MethodSwizzler, Network, NSData, Reachability, UserDefaults) | 2 each | SPM bundles | PrivacyInfo | Apache-2.0 (**inferred**) |
| `GTMAppAuth_GTMAppAuth.bundle`, `GTMSessionFetcher_GTMSessionFetcherCore.bundle` | 2 each | SPM bundles | PrivacyInfo | Apache-2.0 (**inferred**) |
| `Lottie_Lottie.bundle` | 2 | SPM bundle | PrivacyInfo | Apache-2.0 (**inferred**) |
| `nanopb_nanopb.bundle` | 2 | SPM bundle | PrivacyInfo | zlib (**inferred**) |
| `Promises_FBLPromises.bundle`, `Promises_Promises.bundle` | 2 each | SPM bundles | PrivacyInfo | Apache-2.0 (**inferred**) |
| `Realm_Realm.bundle`, `Realm_RealmSwift.bundle`, `RealmDatabase_RealmCoreResources.bundle` | 2 each | SPM bundles | PrivacyInfo | Apache-2.0 (**inferred**) |
| `RxSwift_RxCocoa/RxCocoaRuntime/RxRelay/RxSwift.bundle` | 2 each | SPM bundles | PrivacyInfo | MIT (**inferred**) |
| `SDWebImage_SDWebImage.bundle` | 2 | SPM bundle | PrivacyInfo | MIT (**inferred**) |
| `ZipArchive_ZipArchive.bundle` | 2 | SPM bundle | PrivacyInfo | MIT (**inferred**) |

Top-level `Info.plist` also contains third-party keys and tokens (Branch live/test keys, Facebook app ID and client token, Google client IDs, URL schemes). **They exist; values are deliberately not reproduced here** (**exact** existence, `Info.plist`).

---

## 3. Framework-embedded resources

| Path | Size | What it is (**exact** unless marked) | Licence / status |
|---|---|---|---|
| `Frameworks/AntescofoKit.framework/Versions/A/Resources/FluidR3-piano.SF2` | 7,810,550 B | SoundFont 2 (`RIFF sfbk`). INFO chunk: `INAM` "Fluid R3 GM", `ICRD` "20th June 2013", `IENG` "Frank Wen", `IPRD` "SBAWE32", `ICOP` "Frank Wen 2000-2002", `ICMT` "DO NOT REDISTRIBUTE ANY OF THESE SAMPLES. Violin fixed by Church Organist", `ISFT` "Polyphone". Piano-only cut of Fluid R3 GM used to synthesise the solo/MIDI part (**inferred** from name + `AVAudioUnitMIDISynth` error enum `unableToLoadSoundFont`). | Upstream FluidR3_GM is widely distributed as MIT (**inferred**, public knowledge), but **the file's own comment forbids redistributing the samples**. Not exported. Use an upstream source with a clear licence instead. |
| `…/AntescofoKit…/Resources/oav_mobileamt.mlmodelc/` | `model.mil` 51,810 B + weights | CoreML mlProgram (spec v6). Converted from TorchScript, torch 2.4.1, coremltools 8.3.0. **Input** `log_mel_frames` Float32 [1,1,229,9]; `hidden_in_1`, `hidden_in_2` Float32 [1,1,256]. **Output** `onset_probs` Float32 [1,1,88]; `hidden_out_1`, `hidden_out_2` [1,1,256]. `author`, `license`, `version`, `shortDescription` all null. | Proprietary. Not exported. |
| `…/AntescofoKit…/Resources/oav_mobileamt_gtr.mlmodelc/` | `model.mil` 51,809 B + weights | Same I/O shape. torch 2.6.0, coremltools 9.0, conversion date 2026-10-13. | Proprietary. Not exported. |
| `Frameworks/GuidoKit.framework/Versions/A/Resources/guido2.ttf` | 56,408 B | Guido2 v3.93. Copyright (c) 1996-2001 Keith A. Hamel, 2009-2021 Grame. Name ID 13: SIL OFL 1.1, Reserved Font Name "Guido2", notice by Dominique Fober. | **Open, SIL OFL 1.1**. Exported. |
| `…/GuidoKit…/Resources/placeholder.gmn` | 3,832 B | GUIDO Music Notation source. A grey (`0xD9D9D9`) skeleton score with `\title<"Piece Title">`, `\composer<"Piece Composer">`, `autoPageBreak="on"`, shown while a real score loads (**inferred** purpose). | Proprietary content (trivial). Not exported. |
| `…/GuidoKit…/Resources/logo@3x.png` | 5,756 B | PNG 99×96 RGBA. | Proprietary. Not exported. |
| `Frameworks/MetronautResourceKit.framework/Versions/A/Resources/Assets.car` | 4,391,656 B | 134 image names, no colour sets (**exact**, `assetutil`). | Proprietary. |
| `Frameworks/MetronautPreviewUIKit.framework/Versions/A/Resources/Assets.car` | 4,391,656 B | Same 134 names, no colour sets; bytes differ from ResourceKit copy. | Proprietary. |
| `Frameworks/BrazeKit.framework/Versions/A/Resources/braze.license` | text | "Copyright (c) 2024 Braze, Inc. All rights reserved. Use … permitted only to enable use of the Braze platform by customers of Braze." | Proprietary SDK licence. |
| `Frameworks/BrazeKit.framework/Versions/A/Resources/minizip-ng.license` | text | "Condition of use and distribution are the same as zlib". | zlib. |
| `Frameworks/BrazeKit.framework/…/*.lproj/Localizable.strings` | 40+ locales | Braze SDK strings. | Braze. |
| `Frameworks/FBSDKCoreKit.framework/…/FacebookSDKStrings.bundle` | many locales | Facebook SDK strings. | Facebook. |
| `PlugIns/Metronaut-WidgetExtension.appex` | binary 148 KB + 17 `.lproj/Localizable.strings` + `Lottie_Lottie.bundle` | WidgetKit extension `com.antescofo.metronaut.MetronautWidget`, display name `MetronautWidget`, version 9.0.3 (472). Widgets: `MetronautWidget` (card/list of pieces) and `PracticeStatisticsWidget` (home + accessory) (**exact** type names). | Proprietary. |

---

## 4. Font licences verified from the `name` table (**exact**; script: scratchpad `otfname.js`)

| Font | Name ID 0 (copyright) | ID 5 (version) | ID 7 (trademark) | ID 8/9 (maker/designer) | ID 13 (licence) | ID 14 (licence URL) |
|---|---|---|---|---|---|---|
| `Bravura.otf` | Copyright © 2021, Steinberg Media Technologies GmbH (http://www.steinberg.net/), with Reserved Font Name "Bravura". + full OFL text | Version 1.392 (ID 3: `Version 1.392;SMTG;Bravura;2021;FL720`) | Bravura is a registered trademark of Steinberg Media Technologies GmbH in the European Union and other territories. | Steinberg Media Technologies GmbH / Daniel Spreadbury et al. | SIL Open Font License 1.1, full text | http://scripts.sil.org/OFL |
| `BravuraText.otf` | Copyright © 2016, Steinberg Media Technologies GmbH, with Reserved Font Name "Bravura". + OFL text | Version 1.204 | same | same | SIL OFL 1.1 | http://scripts.sil.org/OFL |
| `guido2.ttf` | Copyright (c) 1996-2001 Keith A. Hamel, 2009-2021 Grame. | 3.93 | — | — | Copyright (c) 2021, Dominique Fober, with Reserved Font Name Guido2. SIL OFL 1.1 | http://scripts.sil.org/OFL |
| `FontAwesome.otf` (Braze bundle) | Copyright Dave Gandy 2015. All rights reserved. | Version 4.3.0 2015 | — | — | — | http://fontawesome.io/license/ (FA 4.x font = SIL OFL 1.1, **inferred**) |
| `Roboto-Bold.ttf` (GoogleSignIn bundle) | Font data copyright Google 2014 | Version 2.000980; 2014 | — | — | Licensed under the Apache License, Version 2.0 | http://www.apache.org/licenses/LICENSE-2.0 |

Exported to `open-licensed/fonts/`: `Bravura.otf`, `BravuraText.otf`, `guido2.ttf`, plus `OFL-Bravura.txt`, `OFL-BravuraText.txt`, `OFL-Guido2.txt` (each copied verbatim from the font's own name ID 13) and `ATTRIBUTION.md` (copyright lines, Reserved Font Names, trademark, SHA-256, compliance notes).

---

## 5. Third-party code (frameworks and statically linked libraries)

Licences are **inferred** from public knowledge unless the bundle states them.

| Component | Where | Role | Licence |
|---|---|---|---|
| Antescofo engine (`AntescofoKit`, stub `AntescofoFramework.framework`, `anteaec.framework`) | `AntescofoKit` 13.0 MB; stubs 84 KB | Score following, Antescofo DSL interpreter (gnuplot, `@dumpvar` etc. strings), AEC (`OliveAECIntegrationMode`) | Proprietary (Antescofo SAS / IRCAM heritage) |
| GUIDO Engine, libguidoar, libmusicxml | Statically inside `GuidoKit` (14.2 MB); `GUIDOEngine/libguidoar/libmusicxml.framework` are 84 KB stubs | Score layout/rendering, GUIDO AR transforms, MusicXML→GUIDO | MPL-2.0 (**inferred**). No MPL notice, licence file or acknowledgements screen found (`grep -i 'mozilla\|license\|acknowledg'` over all binaries found only SDK hits) |
| GuidoKit (Swift wrapper) | `GuidoKit.framework` | Score view, page turn, feedback layers | Proprietary |
| Lottie (airbnb) | Static in `MetronautUI` + bundle | Vector animation | Apache-2.0 |
| MIDIKit (orchetect), `MIDIKitIO` | framework | CoreMIDI I/O | MIT |
| RxSwift, RxCocoa, RxRelay, RxSwiftExt, RxAppState, RxRealm, RxCombine, CombineExt | frameworks | Reactive plumbing | MIT |
| Realm / RealmSwift / RealmDataSource | frameworks | Local database | Apache-2.0 (RealmDataSource is in-house) |
| Alamofire | static | HTTP | MIT |
| Nuke / NukeUI / NukeExtensions | static | Image loading | MIT |
| SDWebImage | static + bundle | Image loading | MIT |
| SwiftUIIntrospect, SwiftUIPager | static | SwiftUI helpers | MIT |
| ZipArchive (SSZipArchive) | static + bundle | Zip | MIT |
| AppAuth, GTMAppAuth, GTMSessionFetcher, GoogleSignIn | static + bundles | Google sign-in | Apache-2.0 |
| Firebase (Core, Installations, Crashlytics, ABTesting, Sessions, RemoteConfig interop), GoogleDataTransport, GoogleUtilities, Promises, nanopb | static + bundles | Crash reporting, A/B config | Apache-2.0 (nanopb zlib) |
| FirebaseAnalytics, GoogleAppMeasurement(+IdentitySupport) | 84 KB stubs; code elsewhere | Analytics | Google proprietary binary terms |
| Facebook SDK (FBSDKCoreKit, CoreKit_Basics, LoginKit, FBAEMKit) | frameworks | Login, app events, AEM attribution | Facebook Platform licence |
| AppsFlyerLib | 84 KB stub | Install attribution | Proprietary |
| BrazeKit / BrazeUI | stub + static + bundle | CRM messages, content cards, banners | Proprietary (`braze.license`, **exact**) |
| Branch SDK | bundle + static | Deep links | MIT |
| Amplitude (Swift) | bundle + static | Product analytics | MIT |
| Zendesk (help centre/messaging) | `ZendeskMessageView`, `ZendeskHelper`, `LaunchZendeskSupport` strings | Support | Proprietary service (**inferred**) |
| In-house kits: `Core`, `Domain`, `Networking`, `Logger`, `Analytics` (package), `Metronaut*Kit`, `MetronautUI` | frameworks | App code | Proprietary |

---

## 6. StoreKit test configuration (**exact**, `Resources/Metronaut-dev.storekit`)

Storefront `FRA`, locale `fr`. Internal team/app IDs omitted. One subscription group: **"Subscriptions Unlimited Time"**. All entries are `_dev` test products, not production IDs.

| productID | referenceName | Period | Display price | Intro offer |
|---|---|---|---|---|
| `monthly_7DaysTrial_dev` | Monthly 7 days Free Trial | P3M | 9.49 | free, P1W |
| `yearly_14DaysTrial_dev` | Yearly 7 days Free Trial | P1Y | 54.99 | free, P1W |
| `monthly_7DaysTrial_dev` (duplicate ID) | monthly_7DaysTrial_dev | P1M | 9.99 | free, P1W |
| `yearly_7DaysTrial_dev` | yearly_7DaysTrial_dev | P1Y | 54.99 | free, P1W |
| `yearly_7DaysTrial_50ff_dev` | yearly_7DaysTrial_50ff_dev | P1Y | 26.99 | free, P1W |
| `Yearly_1MonthTrial_dev` | Yearly_1MonthTrial_dev | P1Y | 0.99 | free, P1M |
| `monthly_30DaysTrial_dev` | monthly_30DaysTrial_dev | P1M | 0.99 | free, P1M |
| `monthly_plus_7DaysTrial_dev` | monthly_plus_7DaysTrial_dev | P1M | 2.99 | free, P1W |
| `yearly_14DaysTrial_dev` (duplicate ID) | yearly_14DaysTrial_dev | P1Y | 54.99 | free, P1W |

Consumable: `com.antescofo.metronaut_dev.piece.2USD` ("piece.2USD"), 0.99 — pay-per-piece purchase. No family sharing. No promotional offers. Localised display names are empty.

Reading (**inferred**): the paywall A/B-tests trial length (1 week vs 1 month), a 50 % yearly discount, a cheap "plus" tier, and per-piece purchases. Localisation keys `FreeTrialBanner.59,94€_/_year` and `FreeTrialBanner.9,99€_/_month` match real price points (parent's localisation doc).

---

## 7. Privacy manifests (**exact**, every `PrivacyInfo.xcprivacy`)

App's own `Resources/PrivacyInfo.xcprivacy`: no tracking flag, no collected types; required-reason APIs `DiskSpace` (85F4.1, E174.1), `FileTimestamp` (DDA9.1), `UserDefaults` (CA92.1).

| Manifest | NSPrivacyTracking | Tracking domains | Collected data types | Required-reason APIs |
|---|---|---|---|---|
| AppsFlyerLib.framework | true | 16 `att.*.appsflyer*` hosts | DeviceID, ProductInteraction | UserDefaults CA92.1, FileTimestamp C617.1 |
| BrazeKit.framework | false | — | UserID, DeviceID, ProductInteraction | UserDefaults CA92.1, FileTimestamp C617.1 |
| FBAEMKit.framework / Facebook_FacebookAEM.bundle | false | — | — | UserDefaults CA92.1 |
| FBSDKCoreKit_Basics.framework | false | — | OtherDataTypes | UserDefaults CA92.1 |
| FBSDKCoreKit.framework / Facebook_FacebookCore.bundle | true | ep1.facebook.com | OtherDataTypes, CrashData, DeviceID | UserDefaults CA92.1 |
| FBSDKLoginKit.framework / Facebook_FacebookLogin.bundle | true | ep1.facebook.com | OtherDataTypes, CrashData, ProductInteraction, UserID, DeviceID | — |
| BranchSDK bundle | true | api-safetrack.branch.io, api-safetrack-eu.branch.io | DeviceID, PerformanceData, OtherDataTypes | FileTimestamp C617.1, UserDefaults CA92.1 |
| Amplitude bundle | (unset) | — | ProductInteraction, DeviceID, CoarseLocation | — |
| GoogleSignIn bundle | false | — | Name, EmailAddress, PhoneNumber, OtherDataTypes, CoarseLocation, UserID, DeviceID, OtherUsageData | UserDefaults CA92.1 |
| Firebase Crashlytics | false | — | CrashData, OtherDiagnosticData | UserDefaults CA92.1 |
| Firebase Installations / GoogleDataTransport | false | — | OtherDiagnosticData | — |
| Firebase Core / CoreInternal | false | — | — | UserDefaults CA92.1 / 1C8F.1 |
| GoogleUtilities Environment / UserDefaults / Network | false | — | — | UserDefaults C56D.1 / 1C8F.1+C56D.1 / FileTimestamp C617.1 |
| GTMSessionFetcherCore | false | — | — | UserDefaults CA92.1 |
| Realm, RealmSwift, RealmCoreResources | false | — | — | FileTimestamp C617.1, DiskSpace E174.1 |
| Lottie (app + widget), SDWebImage | false | — | — | FileTimestamp C617.1 |
| ZipArchive | false | — | — | FileTimestamp 0A2A.1 |
| Alamofire, AppAuth, AppAuthCore, ABTesting, CoreExtension, GoogleSignInSwift, GoogleUtilities (AppDelegateSwizzler, Logger, MethodSwizzler, NSData, Reachability), GTMAppAuth, nanopb, Promises (×2), RxSwift bundles (×4 + RxCocoa framework copy) | false | — | — | — |

The app-level `Info.plist` `NSPrivacyTrackingDomains` merges the AppsFlyer, Branch and Facebook domains (19 hosts) (**exact**).

---

## 8. Notes for the owner's web app (**inferred**)

- Bravura and Guido2 can be used directly under OFL. Keep the OFL file and copyright next to the font. Rename if you subset or convert.
- Do not reuse `FluidR3-piano.SF2` from this bundle. Its embedded comment forbids redistributing samples. Source a piano sample set with an explicit licence (for example, upstream FluidR3_GM from its MIT-licensed distribution, or Salamander Grand Piano under CC-BY).
- If you use GUIDO Engine / libmusicxml (MPL-2.0), you must make the MPL-covered source (with any changes) available and include notices. Metronaut ships no visible notice; do not copy that omission.
- The onset model I/O (229 log-mel bins × 9 frames → 88 key onset probabilities, with 2 × 256 recurrent state) describes a streaming piano-transcription design you can reproduce with an open model (for example Onsets-and-Frames-style, 229 mel bins is that model family's standard). The model weights themselves are proprietary.
