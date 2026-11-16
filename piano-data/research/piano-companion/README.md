# Piano Companion (macOS) — reverse-engineering reference

* Target: `/Applications/Piano Companion.app` by Songtive.
* Bundle id `com.songtive.pianocompanion.lite.osx`, version 1.6.1028, Mac App Store.
* Stack: Xamarin.Mac / .NET (CoreCLR, `Contents/MonoBundle`).
* Method: static only. I decompiled the app assemblies with ilspycmd 11.2, decoded the nibs and storyboard with a NIBArchive parser, and inspected the asset catalog, SF2, OTF and strings files with Node scripts.
* Limits:
  * The app was never launched, and there was no network access.
  * Executing the app's own .NET code was not allowed, so all numbers are read from the code or recomputed by the port.
* Marking: each claim is **exact** (read in code or in a file, with the source named) or **inferred**.

Decompiled assemblies (app-specific only):

| Assembly | Content |
|---|---|
| PianoCompanion.dll | macOS UI, view controllers, controls, voicing and fingering helpers |
| PianoCompanion.Engine.OSX.dll | theory engine, settings, MIDI, metronome, songbook |
| Songtive.Engine.OSX.dll | note primitives, legacy engine, analytics, NAudio.Midi copy |
| Manufaktura.* | staff rendering |
| Plugin.InAppBilling | purchases |

## Files

| File | What it covers |
|---|---|
| [THEORY_ENGINE.md](THEORY_ENGINE.md) | Covers the note model and spelling, all 113 chords (89 listed) with symbols in 5 styles, inversions, voicing and fingering, and all 1,027 scales. Also: chords in a scale, modes, the 45 progression patterns, the "what comes next" suggester, the circle of fifths and key signatures, enharmonic rules, and search by name. |
| [CHORD_DETECTION.md](CHORD_DETECTION.md) | The two notes → chord algorithms: the one the macOS UI uses and the shared ChordNamer. Exact scoring and worked examples. |
| [UI_FLOWS_AND_MENUS.md](UI_FLOWS_AND_MENUS.md) | Every window, page, menu item with shortcut, toolbar, popover and flow; the paywall; Lite vs paid gating. |
| [COMPONENTS_LAYOUT_MOTION.md](COMPONENTS_LAYOUT_MOTION.md) | Both keyboard engines (sizes, ratios, colours, labels, range, highlighting), the staff, the circle-of-fifths geometry, colours, fonts, spacings, animations. |
| [SETTINGS.md](SETTINGS.md) | Every preference key, its type, default and UI location. |
| [SOUND_AND_MIDI.md](SOUND_AND_MIDI.md) | The SF2 bank, playback recipes and timings, MIDI in and out, the synthesised metronome. |
| [LOCALISATION.md](LOCALISATION.md) | How localisation works, all English strings, Russian chord and scale names, note notations per language. |
| [RESOURCES_AND_LICENCES.md](RESOURCES_AND_LICENCES.md) | Every bundled resource, the font and sound-bank licences, third-party code, what was exported. |
| [PIANO_TRAINER_TAKEAWAYS.md](PIANO_TRAINER_TAKEAWAYS.md) | Concrete items a web piano trainer can adopt, with pointers to the data. |
| `chord-detection.ts` | Self-contained TypeScript port: dictionary, symbols, both detection algorithms, suggester, voicer, fingering. |
| `chord-detection.test.mjs` | Run `node --test chord-detection.test.mjs`. Result: 10 tests, 10 passing. |

### data/

| File | Content |
|---|---|
| `chords.json` | 113 chords: id, short and button names, English name, group, formula, degrees, interval names, symbols in 5 styles, alias flag, difficulty, quality, notes in C, every inversion in C with its label |
| `scales.json` | 1,027 scales: letters, accidentals, step pattern, semitones, degree string, C spelling, tags, popular flag; also named ids and parallel modes |
| `progressions.json` | mode chord tables, 45 patterns (Roman numerals and C), suggester weights and example outputs, curated-library note |
| `circle_of_fifths.json` | major and minor circles, key table, major-scale spelling and accidental count for all 21 tonic spellings |
| `localized_theory_names.json` | chord, variant and scale names in 41 locales (Russian included) |
| `en_strings.json`, `en_regional_overrides.json` | English UI strings (1,423 keys), en-GB / en-AU overrides |
| `settings.json` | preference keys, types, defaults, UI locations |
| `colors.json` | colours from code and the asset catalog |
| `gating.json` | product ids, entitlement flags, every Lite limit |
| `sf2_inventory.json` | presets, instruments, samples, key ranges, INFO chunk of the sound bank |

### export/ (openly licensed items only)

| Folder | Content |
|---|---|
| `export/bravura/` | Bravura 1.204 music font (SIL OFL 1.1) with its metadata, licence and attribution |
| `export/generaluser-gs-subset/` | The app's 9-preset SF2 subset of GeneralUser GS 1.44 by S. Christian Collins, with licence and attribution. The licence text embedded in the file is cut off; see RESOURCES_AND_LICENCES.md before shipping it. |

Proprietary media were **not** exported: key images, leaf images, the paywall background, the app icon and the asset catalog.

## Reproduce

Scripts are in the session scratchpad (`…/scratchpad/pianocompanion/scripts`, `…/tools`):
* `extract_theory.mjs` rebuilds the theory JSON from the decompiled C# and the TS port;
* `write_theory_md.mjs` writes THEORY_ENGINE.md;
* the l10n, SF2, OTF and NIB parsers are there too.

Decompile command: `ilspycmd -p -o <dir> <Assembly>.dll`.
