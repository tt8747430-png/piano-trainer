# Resources and licences

Every file in `Suggester 2.app` (code signature folders aside), what it is, and its licence status. Licence evidence is only what is embedded in the files (no network was used). "Proprietary" means no open licence was found; it does not prove the authors' terms.

Exported (in `exported/`): **BravuraText.otf** (SIL OFL 1.1) and **fulltines-lite.sf2** (CC0 1.0). Nothing else was exported.

## 1. Media and data files

| Path (under Contents/) | Size (bytes) | What | Embedded licence / provenance (exact) | Status |
|---|---|---|---|---|
| Frameworks/DocumentEditor.framework/…/Resources/BravuraText.otf | 1,342,196 | SMuFL music font, "Bravura Text", Version 1.271 | © 2018 Steinberg Media Technologies GmbH, Reserved Font Name "Bravura"; SIL Open Font License 1.1 (full text in name ID 0/13) | **Open — exported** with OFL.txt |
| Frameworks/Instruments.framework/…/soundfonts/fulltines-lite.sf2 | 5,569,366 | Electric piano (FM, Dexed "FullTines") | INFO: IENG "Strix SoundFont", ICOP "Public Domain", ICMT "Licensed under the Creative Commons CC0 1.0 License." | **Open — exported** |
| …/soundfonts/guitar.sf2 | 985,710 | Acoustic guitar ("Guitar Acoustic", 1995, SBAWE32) | ICOP "Public Domain"; no author, no licence text | Claims public domain, provenance unclear (Sound Blaster AWE32-era bank). **Not exported** — verify before use |
| …/soundfonts/nylon.sf2 | 19,767,184 | "Spanish classical guitar", 2019 | ICMT "http://freepats.zenvoid.org/Guitar/acoustic-guitar.html"; no licence text | FreePats project; licence not embedded. **Not exported** (check the FreePats page; many FreePats sets are CC0 or GPL) |
| …/soundfonts/strat.sf2 | 10,855,010 | "EGuitar Br Cl Sm" (clean electric), 2022 | ICMT FreePats electric-guitar URL | Same as above. Not exported |
| …/soundfonts/sweep.sf2 | 8,414,208 | "Sweep Pad", 2019 | ICMT FreePats synth-pad URL | Same. Not exported |
| …/soundfonts/SynthStrings1.sf2 | 5,910,658 | "Synth Strings 1", 2020 | ICMT FreePats synth-strings URL | Same. Not exported |
| …/soundfonts/strings.sf2 | 12,717,822 | Strings, INAM "TimGM6mb1.sf2" | no copyright field | Derived from TimGM6mb (a GM bank distributed under GPL-2 in Linux distributions — inferred, not embedded). Not exported |
| …/soundfonts/piano.sf2 | 32,827,554 | "Yamaha Grand Piano", 2008, made for fluidsynth | no copyright field | Unknown licence. Not exported |
| …/soundfonts/rhodes.sf2 | 12,860,054 | "Rhodes EP-JN1.1", IENG "David Mason", 2016 | ICOP "Copyright Information Not Present" | Unknown. Not exported |
| …/soundfonts/b3.sf2 | 5,696,534 | " Hammond B3", SBAWE32 | none | Unknown. Not exported |
| …/soundfonts/12string.sf2 | 2,108,354 | INAM "Touhou.sf2" (12-string guitar preset) | ICOP "SynthFont Viena" | Proprietary/unclear. Not exported |
| …/soundfonts/atmosphere.sf2 | 1,890,882 | INAM "Touhou.sf2" (pad preset) | ICOP "SynthFont Viena" | Proprietary/unclear. Not exported |
| …/soundfonts/metronome.sf2 | 18,104 | Metronome clicks (IPRD "Metronome") | none | Unknown. Not exported |
| Resources/Assets.car | 1,584,984 | App icon (Suggester2-glass layered icon, 7 sizes), AccentColor, icon colours/gradients, `Intent-TrebleClef` | © Mathieu Routhier (Info.plist copyright) | Proprietary |
| Resources/Suggester2-glass.icns | 50,486 | App icon | — | Proprietary |
| DocumentEditor.framework/…/Assets.car | 715,384 | Colours (SuggesterOrange, SuggesterMint, Chartreuse, LightOrange, LightYellow), images AppIcon, AppIconLarge, AppLogo, ChordPadX2, ChordShapes, Clouds, symbols Guitar, Instruments, TrebleClef, capsule.pro(.fill), key.circle, lightbulb.max.fill | — | Proprietary (colour values documented in COMPONENTS_LAYOUT_MOTION.md as facts) |
| Resources/MRMusicUI_MRMusicUI.bundle/…/Assets.car (also in the .appex) | 361,656 | Arpeggio mode glyphs (ArpeggioUp/Down/Off/SkipUp/SkipDown), note/rest duration glyphs note-006…note-800, rest-006…rest-800 | — | Proprietary |
| Resources/{en,fr}.lproj/*.strings, *.stringsdict | 25,922 / 28,724 (Localizable) and small files | UI text | — | Proprietary text (documented as reference in `data/strings_app_en_fr.json`) |
| Resources/Metadata.appintents/{extract.actionsdata, version.json} | 4,169 / 51 | App Intents metadata (ChordSuggestionsIntent) | — | Build artefact |
| Resources/MRSwiftUI_MRSwiftUI.bundle, MRMusicUI_MRMusicUI.bundle (Localizable.strings) | tiny | "EditButton-Done/Edit", "[AppStore Product Error]" | — | Proprietary |
| Resources/MRReceipt_MRReceipt.bundle/…/rawdata/AppleIncRootCertificate.cer (3 copies) | 1,215 | Apple Inc. Root certificate (receipt validation) | Apple | Apple's public certificate; not useful to export |
| PlugIns/AudioUnitExtension.appex/…/Base.lproj/AudioUnitViewController.nib | 2,388 | AU view controller nib | — | Proprietary |
| _MASReceipt/receipt | 4,845 | Mac App Store receipt (personal) | — | Personal — not read further, not exported |
| Frameworks/OpenSSL.framework/…/PrivacyInfo.xcprivacy | 373 | Privacy manifest (no tracking, no collected data) | — | — |

## 2. Code (binaries) and third-party components

| Binary | Language / content | Third-party code found | Licence of that component (general knowledge, not embedded) |
|---|---|---|---|
| MacOS/Suggester 2 (677 KB) | Swift app shell | — | Proprietary |
| DocumentEditor.framework (9.7 MB) | Swift/SwiftUI UI (modules DocumentEditor, MRMusicUI, MRUtilUI, MRSwiftUI, MenuBuilder) | `MenuBuilder` module name matches the open-source "MenuBuilder" Swift package (inferred) | MIT if it is that package (inferred) |
| MRMusicSuite.framework (29 MB) | Kotlin/Native engine (music2, player2, suggester, chordpadx, chordshapes, util2) | Kotlin stdlib, kotlinx.coroutines, kotlinx.serialization (JSON), kotlinx-datetime, kotlinx.cinterop (class names present) | Apache-2.0 (JetBrains) |
| MRPlayerApple_…PackageProduct.framework | Objective-C++ audio/MIDI | Ableton Link (`ableton::BasicLink`, asio) | Ableton Link is dual-licensed GPL-2.0+ or a proprietary licence from Ableton |
| Instruments.framework | Sound bank table + SF2 files | — | see §1 |
| OpenSSL.framework | OpenSSL 3.6.5 (29 Sep 2026), bundle id `com.github.krzyzanowskim.OpenSSL` | OpenSSL | Apache-2.0 |
| MRReceipt_…PackageProduct.framework | Swift receipt validation | — | Proprietary |
| MRMusicSuite_…PackageProduct.framework | Swift stubs (`MRSuggester.Bogus`, `MRChordPadX.Bogus`, `MRPlayer.Bogus`, `MRMusic.Bogus`, `MRUtil.Bogus`) | — | — |
| PlugIns/AudioUnitExtension.appex | AU v3 extension | — | Proprietary |

The engine contains `FluidSynth`/`FluidSynthEngine` Kotlin classes, but no `fluid_*` C symbols are linked in any binary, so FluidSynth itself is not shipped on macOS (exact: symbol search).

No acknowledgements/licence screen or text file is bundled (no "Acknowledgements", "LICENSE" or "Settings.bundle" resource exists).

## 3. Using these in a web piano trainer

- Bravura Text: usable under OFL 1.1 with the notice; for the web you would normally use upstream Bravura/Bravura Text WOFF2 from Steinberg's repository (SMuFL).
- fulltines-lite.sf2: CC0, free to convert (e.g. to sample files for Web Audio / soundfont-player).
- For the other banks, prefer sources whose licence you can verify (FreePats pages, or the CC0/MIT GM banks commonly used on the web).
