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
| `chordio/` | Chordio | lesson, sheet-music and chord-pack formats (6 lessons, 108 scores, 556 progressions); chord-naming cost table (27 templates); Wait Mode; quizzes; 38 GM drum styles, basslines, swing presets; Krumhansl key detection; mode-ring circle of fifths; menus and shortcuts; 30 takeaways. Exports: FluidR3 GM drum kits (MIT), Bravura (OFL) |
| `tiny-instrument/` | Tiny Instrument | full gamification (XP formula, levels 50·(L−1)·L, daily and weekly challenges, 50 badges, 5 leaderboards); 26 lesson step types, courses with mastery rules; wait mode and falling notes; composer feedback; AI tutor; colour tokens; 7 one-time packs; 27 takeaways. Exports: GeneralUser GS (full licence), M-Clean Guitar and Celesta (CC0), Bravura, Sebastian, Noto Music (OFL), Bach minuet (PD) |
| `scale-runner/` | Scale Runner | 8 modes, scales, timed Scale/Inversion Running and Jam Mode against a metronome, Easy/Normal/Strict timing, 8-tap latency calibration, 0–100 score with 3 tiers, streak with weekly freeze, 3 reminder kinds, lifetime unlock; 19 takeaways. Exports: Inter, Space Grotesk (OFL). Exact timing numbers need a Dart decompiler |

## Shared (drawn from several apps)

| Folder | What is in it |
|---|---|
| `_shared/piano-theory-and-libraries/` | open-source TS libraries (Verovio, smplr, tonal, webmidi, tone, ts-fsrs), practice engine and theory engine rules |
| `_shared/app-ready-data/` | small JSON files for Piano Trainer from Dorico and Flat: EN/RU glossary, instruments EN/RU, tempo words, page sizes, clefs, ornaments, techniques, Verovio engraving defaults |
| `_shared/open-licensed-resources/` | openly licensed fonts (53 families) and sounds (MS Basic, Greg Sullivan E-Pianos), with licences and attribution |

## Openly licensed items exported inside app folders
- `suggester-2/exported/`: Bravura Text (OFL), fulltines-lite piano SoundFont (CC0).
- `piano-companion/export/`: Bravura 1.204 (OFL), GeneralUser GS subset; the complete licence is now in `LICENSE-full-v2.0.txt` (from Tiny Instrument's copy).
- `metronaut/open-licensed/fonts/`: Bravura, Bravura Text, Guido2 (OFL).
- `chordio/export/`: FluidR3 GM drum kits, 408 WAVs (MIT, Frank Wen), Bravura (OFL).
- `tiny-instrument/export/`: GeneralUser GS with its complete licence, M-Clean Guitar (CC0), Celesta (file says CC0, app catalogue says CC BY 3.0: credit it), Noto Music, Bravura, Sebastian (OFL), Bach minuet in G (PD).
- `scale-runner/export/fonts/`: Inter, Space Grotesk (OFL).
