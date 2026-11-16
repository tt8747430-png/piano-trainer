# Resources and licences

Bundle: `/Applications/Piano Companion.app` (Songtive, `com.songtive.pianocompanion.lite.osx`, `CFBundleShortVersionString 1.6.1028`, `CFBundleVersion 90`). Read statically only.
Each claim is **exact** (with source) or **inferred**.

## 1. Bundle facts (Info.plist, entitlements)

| Key | Value | Status |
|---|---|---|
| `NSHumanReadableCopyright` | `Songtive (c) 2021` (also shown in the About window: `AboutWindowController` sets `CopyrightLabel` from this key) | **exact** |
| `LSApplicationCategoryType` | `public.app-category.education` | **exact** |
| `LSMinimumSystemVersion` | 13.0 | **exact** |
| `ATSApplicationFontsPath` | `Font` (registers `Font/Bravura.otf` for the process) | **exact** |
| `CFBundleURLSchemes` | `pianocompanion` | **exact** |
| `NSMainStoryboardFile` | `Main` | **exact** |
| `com.microsoft.macos.Version` | 26.5.10315 (.NET for macOS workload; CoreCLR runtime in `MonoBundle/libcoreclr.dylib`) | **exact** |
| Build | Xcode 2660 (17F113), SDK macosx26.5 | **exact** |
| Entitlements (`archived-expanded-entitlements.xcent`) | app-sandbox, network.client, files.user-selected.read-write, cs.allow-jit | **exact** |
| Backend URL | `https://www.songtive.com` (`AppDelegate`, `ServiceUrl`) | **exact** |

## 2. Every file in `Contents/Resources`

Sizes in bytes. "Proprietary" means no open licence was found; assume © Songtive.

| Path | Size | What it is | Used by | Licence | Status |
|---|---|---|---|---|---|
| `Font/Bravura.otf` | 491,344 | SMuFL music font, v1.204 | `StaffView` → Manufaktura `SetFontFromName("Bravura", …)` | SIL OFL 1.1 (Steinberg) | **exact** |
| `Sounds/instruments.sf2` | 11,449,072 | SoundFont 2.01, GeneralUser GS 1.44 subset, 9 presets | `Sequencer.SetInstrument` | GeneralUser GS License v2.0 (permissive) | **exact** (INFO chunk) |
| `Keys/white_key.png` | 264 | 20×60 RGB white key, normal | `PianoKey` (small keyboard, index 0) | Proprietary | **exact** dims/use |
| `Keys/white_key_pressed.png` | 262 | 20×60 white key, pressed | `PianoKey` | Proprietary | **exact** |
| `Keys/white_key_root.png` | 255 | 20×60 white key, root highlight | `PianoKey` | Proprietary | **exact** |
| `Keys/white_key_large.png` | 389 | 40×120 white key (large) | `PianoKey` index 1; `PianoPlayView` | Proprietary | **exact** |
| `Keys/white_key_large_pressed.png` | 394 | 40×120 pressed | same | Proprietary | **exact** |
| `Keys/white_key_large_root.png` | 386 | 40×120 root | `PianoKey` | Proprietary | **exact** |
| `Keys/black_key.png` | 383 | 10×40 RGBA black key | `PianoKey` | Proprietary | **exact** |
| `Keys/black_key_pressed.png` | 396 | 10×40 pressed | `PianoKey` | Proprietary | **exact** |
| `Keys/black_key_root.png` | 345 | 10×40 root | `PianoKey` | Proprietary | **exact** |
| `Keys/black_key_large.png` | 587 | 20×80 RGBA | `PianoKey`; `PianoPlayView` | Proprietary | **exact** |
| `Keys/black_key_large_pressed.png` | 636 | 20×80 pressed | same | Proprietary | **exact** |
| `Keys/black_key_large_root.png` | 529 | 20×80 root | `PianoKey` | Proprietary | **exact** |
| `leaf-left.png`, `leaf-right.png` | 21,547 / 21,493 | 247×414 RGBA decorative laurel leaves | `PaymentModalController` (purchase screen) | Proprietary | **exact** |
| `purchase_bg.jpeg` | 88,402 | 1024×677 JPEG background | `PaymentModalController` | Proprietary | **exact** |
| `AppIcon.icns` | 27,614 | App icon (`ic13`) | Finder/Dock | Proprietary | **exact** |
| `Assets.car` | 213,864 | Asset catalogue: only `AppIcon` (10 renditions, 16–1024 px) plus 2 packed atlases (`ZZZZPackedAsset-1.0.0-gamut0` 166×132, `-2.0.0-gamut0` 102×68). No named colours. | system | Proprietary | **exact** (`assetutil --info`) |
| `StaffContent/core.css` | 24 | `body { margin : 0px; }` | **inferred**: legacy web-view staff renderer; no reference found in current code | trivial | **exact** content |
| `theory-names/theory-names.<locale>.tsv` × 41 | 11,363–55,305 | Chord (51) and scale (1,027) names per locale | `TheoryNamesLocalization` | Proprietary text | **exact** |
| `<locale>.lproj/Localizable.strings` × 42 | en: 68,727 | UI strings | localisation | Proprietary text | **exact** |
| `Main.storyboardc/` (48 nibs + Info.plist) | — | Compiled storyboard (main window, tabs, popovers, sheets) | UI | Proprietary | **exact** (listing) |
| `AboutWindow.nib`, `DetailsWindow.nib`, `SettingsWindow.nib` | 10,968 / 1,732 / 23,833 | Windows | UI | Proprietary | **exact** |
| `ChordSuggesterItemController.nib`, `GeneralItemController.nib`, `RelativeScaleItemController.nib`, `TrackItemCellController.nib` | 1,901 / 10,089 / 10,396 / 9,975 | Collection-view items | UI | Proprietary | **exact** |
| `archived-expanded-entitlements.xcent` | 419 | Entitlements | codesign | — | **exact** |

Embedded resources inside assemblies (extracted by ilspycmd):

| Resource | Size | What | Licence | Status |
|---|---|---|---|---|
| `Manufaktura.OSX.dll` → `Manufaktura.OSX.bravura_metadata.json` | 896,095 | SMuFL metadata for Bravura 1.204 (engraving defaults, glyph boxes, anchors) | Ships with Bravura → OFL 1.1 | **exact** content / **inferred** licence |
| `Manufaktura.OSX.dll` → `Manufaktura.OSX.glyphnames.json` | 262,436 | SMuFL glyph-name → codepoint map | Published by the W3C Music Notation CG with SMuFL; licence not stated in the file | **exact** content / **inferred** origin |

No `Acknowledgements`, `Credits`, `LICENSE` or third-party notice file exists in the bundle, and no localisation key mentions licences or open source (grep of `en_strings.json` for licen/acknowl/open source/third). The About window (`AboutWindowController.AwakeFromNib`) shows only: app icon, `CFBundleName` ("Piano Companion"), "Version 1.6.1028 (90)", `Songtive (c) 2021`, and the link `http://pianocompanion.info` (opens `?utm_source=pianocompanion-osx&utm_medium=mainmenu&utm_campaign=pianocompanion`). **exact**

## 3. Fonts

### Bravura (OpenType name table, read with `scripts/otf_names.mjs`)

| nameID | Value |
|---|---|
| 0 Copyright | `Copyright © 2016, Steinberg Media Technologies GmbH (http://www.steinberg.net/), with Reserved Font Name "Bravura".` followed by the full OFL text |
| 1 Family | `Bravura` |
| 2 Subfamily | `Regular` |
| 3 Unique ID | `SteinbergMediaTechnologiesGmbH: Bravura: 2016` |
| 5 Version | `Version 1.204` |
| 7 Trademark | `Bravura is a registered trademark of Steinberg Media Technologies GmbH in the European Union and other territories.` |
| 8 Manufacturer | `Steinberg Media Technologies GmbH` |
| 9 Designer | `Daniel Spreadbury et al.` |
| 11 Vendor URL | `http://www.steinberg.net/` |
| 13 Licence | SIL Open Font License, Version 1.1 – 26 February 2007 (full text) |
| 14 Licence URL | `http://scripts.sil.org/OFL` |

All **exact**. SHA-256 `1f3e85c0db8ddbba3ddd56aa94d08d080071c398751dc2b9a9349775a6d3b912`.

UI text uses the macOS system font (e.g. `NSFont.SystemFontOfSize(14f)` in `PlayPanel`; `.AppleSystemUIFontBold` in `AboutWindow.nib`). No other font files are bundled. **exact**

## 4. Sound bank provenance

| Field | Value | Status |
|---|---|---|
| Name | GeneralUser GS softsynth version 1.44 | **exact** (`INAM`) |
| Author / copyright | S. Christian Collins, 2012 | **exact** (`IENG`, `ICOP`) |
| Tool | Awave Studio v10.1 | **exact** (`ISFT`) |
| Licence text (`ICMT`, verbatim start) | "*** License v2.0 *** ** License of the complete work ** You may use GeneralUser GS without restriction for your own music creation, private or commercial. This SoundFont bank is provided to the community free of charge. Please feel free to use it in your software projects, and to modify the SoundFont bank or its packaging to suit your needs. ** License of contained samples ** GeneralUser GS inherits the usage rights of the samples contained within, all of which allow full use in music production, including the ability to make profit from musical recordings created with GeneralUser GS. Many of the samples are original, but some were taken from other banks freely (and legally) available on the Internet … This uncertainty may concern you if you intend to use GeneralUser GS in a commercial software product. That being said, I have never" | **exact** |
| Truncation | The `ICMT` chunk is 1,502 bytes and stops mid-sentence ("I have never"). | **exact** |
| Subset | Only 9 presets (0, 1, 11, 12, 13, 25, 42, 50, 54) remain. Songtive cut the bank down to the instruments the app offers. | **exact** (presets) / **inferred** (who cut it) |
| SHA-256 | `51bb4dc36cb7600eca436237820fa1a52f15d2631a8973572bd869b48c8113d2` | **exact** |

## 5. Third-party code (MonoBundle)

| Assembly | Version | Copyright / author (from assembly) | Repository (from assembly) | Licence | Status |
|---|---|---|---|---|---|
| Manufaktura.Controls | 1.4.2 | "Manufaktura Programów Jacek Salamon 2018"; description "The best open source multiplatform music notation library for .NET" | bitbucket.org/Ajcek/manufakturalibraries | Open source per description; exact licence not embedded (upstream states MIT) | **exact** metadata / **inferred** licence |
| Manufaktura.Core | 1.0.2 | "Manufaktura programów Jacek Salamon 2019" | same | as above | **exact** / **inferred** |
| Manufaktura.Music | 1.1.2 | "Manufaktura programów Jacek Salamon 2018" | same | as above | **exact** / **inferred** |
| Manufaktura.Model, Manufaktura.OSX | 1.0.0 | — | — | as above | **exact** / **inferred** |
| NAudio.Midi (source-embedded in `Songtive.Engine.OSX.dll`, namespaces `NAudio.Midi`, `NAudio.Utils`) | — | Mark Heath (NAudio) | — | MIT (current NAudio; older releases Ms-PL) | **exact** presence / **inferred** licence |
| Newtonsoft.Json | — | James Newton-King | github.com/JamesNK/Newtonsoft.Json | MIT | **exact** repo / **inferred** licence |
| RestSharp | 112.1.0 | — | github.com/restsharp/RestSharp | Apache-2.0 | **exact** version / **inferred** licence |
| SQLite-net | 1.9.172 | Frank Krueger | github.com/praeclarum/sqlite-net | MIT | **exact** version / **inferred** licence |
| SQLitePCLRaw.core / batteries_v2 / provider.e_sqlite3 | 2.1.10 | "Copyright 2014-2024 SourceGear, LLC" | github.com/ericsink/SQLitePCL.raw | Apache-2.0 | **exact** / **inferred** |
| `libe_sqlite3.dylib` | — | SQLite | — | Public domain | **inferred** |
| Plugin.InAppBilling | 6.0.0 | "James Montemagno", "Copyright 2022" | github.com/jamesmontemagno/InAppBillingPlugin | MIT | **exact** / **inferred** |
| `ServiceStack.Text` namespace in `PianoCompanion.Engine.OSX.dll` | — | Not ServiceStack: a 3-method shim over Newtonsoft (`JsonSerializer.DeserializeFromString/SerializeToString/ToJson`) | — | Songtive code | **exact** |
| .NET runtime and BCL (`System.*`, `Microsoft.*`, `libcoreclr`, …) | .NET for macOS 26.5.10315 | Microsoft | — | MIT | **inferred** |
| PianoCompanion, PianoCompanion.Engine.OSX, Songtive.Engine.OSX | 1.0.0 | Songtive | — | Proprietary | **exact** (names) / **inferred** (licence) |

## 6. What was exported (`export/`)

| Folder | Contents | Why allowed |
|---|---|---|
| `export/bravura/` | `Bravura.otf` (unchanged), `bravura_metadata.json` (from Manufaktura.OSX), `LICENSE.txt` (OFL 1.1 copied from nameID 13), `ATTRIBUTION.md` | SIL OFL 1.1 permits redistribution with the licence. Do not sell the font alone; rename any modified version. |
| `export/generaluser-gs-subset/` | `instruments.sf2` (unchanged), `LICENSE.txt` (ICMT text, marked truncated), `ATTRIBUTION.md` | ICMT licence permits use in software projects and modification. Prefer the upstream full bank for the complete licence text. |

Not exported (proprietary, © Songtive): `Keys/*.png`, `leaf-left.png`, `leaf-right.png`, `purchase_bg.jpeg`, `AppIcon.icns`, `Assets.car`, nibs/storyboard, `theory-names/*.tsv` and `.strings` files (text is used only as reference data in `data/` JSON for the owner's study; re-check before shipping translations), `glyphnames.json` (licence not stated in file; get it from the SMuFL project instead).

## 7. Practical notes for a web piano trainer

- Bravura can be served as a web font (`@font-face`, WOFF2 conversion is a "modified version" only if glyphs change; a format conversion is allowed by OFL but a renamed build is safest). Use `bravura_metadata.json` for glyph metrics. Newer Bravura releases exist upstream.
- The key images are tiny flat bitmaps (20×60 / 40×120 white, 10×40 / 20×80 black, ratio white:black width 2:1, height 3:2). Draw keys with SVG/CSS instead of copying them.
- Credit line if you use the SF2: "Piano sound: GeneralUser GS by S. Christian Collins."
