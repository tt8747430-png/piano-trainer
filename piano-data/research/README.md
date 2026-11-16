# Research: findings from music apps, grouped by app

All work was static (read from the installed apps; nothing was run against the network). Each app folder has its own README with the method, its findings and their limits. Claims are marked **exact** (read from code or data) or **inferred**.

## By app

| Folder | App | What is in it |
|---|---|---|
| `chordlab/` | ChordLab | chord detection rules, 42 chord qualities, lesson content structure, `chord_detector.py` |
| `garageband/` | GarageBand | chord detection vote tables and special cases, `gb_chord_detector.py` |
| `dorico/` | Dorico 6 | engraving, notation, layout, note input, playback and view options; data model and `.dorico` decoder (Python + TS); library data (624 instruments, techniques…); UI flow (163 areas, 1,366 commands, shortcuts, dialogs, UX patterns, motion); MIDI and staff settings; palettes; comparison with Piano Trainer (`piano-trainer-comparison/`) |
| `flat/` | Flat | UI shell and motion, hide-vs-disable rule, settings by scope, tools and 179 shortcuts, flows and onboarding, player and on-screen piano, public song library and My library |
| `suggester-2/` | Suggester 2 | Kotlin engine: 64 chord types, 46 intervals, 31 scales, 15 suggestion categories, voice leading, Roman numerals, 28 classic progressions; `.suggx` format; settings; sound and MIDI; 34 takeaways |
| `piano-companion/` | Piano Companion | 113 chords in 5 symbol styles, 1,027 scales, 2 chord-recognition algorithms (ported: `chord-detection.ts` + test), suggester, fingering, names in 41 languages, Lite gating; 25 takeaways |
| `metronaut/` | Metronaut | Antescofo score following, 5 practice modes, exact scoring formula, metronome, GUIDO rendering, catalog model, 286 analytics events (what not to do); 39 takeaways |

## Shared (drawn from several apps)

| Folder | What is in it |
|---|---|
| `_shared/piano-theory-and-libraries/` | open-source TS libraries (Verovio, smplr, tonal, webmidi, tone, ts-fsrs), practice engine and theory engine rules |
| `_shared/app-ready-data/` | small JSON files for Piano Trainer from Dorico and Flat: EN/RU glossary, instruments EN/RU, tempo words, page sizes, clefs, ornaments, techniques, Verovio engraving defaults |
| `_shared/open-licensed-resources/` | openly licensed fonts (53 families) and sounds (MS Basic, Greg Sullivan E-Pianos), with licences and attribution |

## Openly licensed items exported inside app folders
- `suggester-2/exported/`: Bravura Text (OFL), fulltines-lite piano SoundFont (CC0).
- `piano-companion/export/`: Bravura 1.204 (OFL), GeneralUser GS subset — **the licence copy in the file is truncated; get the full licence before shipping**.
- `metronaut/open-licensed/fonts/`: Bravura, Bravura Text, Guido2 (OFL).
