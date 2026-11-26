# Piano Trainer: app-ready data from Dorico 6 and Flat

These are data and facts from the installed Dorico 6.2.31 and Flat 26.11.0, cleaned into small JSON files that can be used directly. Each file's use in Piano Trainer is noted below.

**Excluded on purpose:** proprietary media and writing (icons, GIFs, sounds, tutorial and onboarding text, Flat's sentences). See `piano-data/research/dorico/RESOURCES_CATALOGUE.md`.

| File | Contents | From | Use in Piano Trainer |
|---|---|---|---|
| `notation-glossary-en-ru.json` | **765** notation terms, English → Russian (Акцент, Связка, Форшлаг, Ключевые знаки, Размер, Педаль…) | Flat's editor locale (en + ru tool titles, short terms only) | checking `ru` strings for the musician's term (CLAUDE.md: "the musician's term always wins") |
| `instruments-en-ru.json` | **624** instruments: full, short and plural names in **EN and RU**, staves, clefs, ranges (+ MIDI numbers), transposition | Dorico `instruments.xml` + `l10n/instrumentnames_{en,ru}.xml` | Instruments list in the score's Settings; New song by family; range checks |
| `tempo-words.json` | **78** tempo words with BPM (e.g. Adagietto 72), gradual vs immediate | Dorico tempo presets | the tempo dial's ruler of tempo words (ADR 0114) and the Metronome |
| `swing-feels.json` | **11** feels (straight; light, medium and heavy swing 8ths and 16ths; 2:1, 3:1 fixed) with strength over tempo | Dorico rhythmic feels | swing in Measures and playback |
| `page-sizes.json` | **19** presets in pt **and mm** (A3, A4, A5, B4, B5, Letter, Legal, Tabloid, Concert, Octavo, Hymn, Part…) | Dorico page presets | Layout › Page size (today A4 / A3 / Letter) |
| `clefs.json`, `octave-lines.json` | 26 clefs, 7 octave lines | Dorico library | the Clef palette section |
| `ornaments.json` | 45 ornaments | Dorico library | the Ornaments section |
| `playing-techniques.json` | 298 techniques with group (techniques, ornaments, dynamics, lengths) and **`onPiano`** (38 apply to piano) | Dorico | Text › techniques; Dynamics |
| `accidentals.json`, `notehead-sets.json`, `line-styles.json` | 66 accidentals (incl. quarter-tones), 37 notehead sets, 46 line styles | Dorico | later features (note colours and shapes, lines) |
| `engraving-defaults-verovio.json` | 21 Verovio `engravingDefaults` values from Dorico 6 (staff spaces), plus spacing in Verovio units | Dorico 6 engraving options | `shared/ui/score/verovio/toolkit.ts` |
| `chord-qualities.json` | 42 chord qualities with intervals | ChordLab (recovered) | chord naming and the chord wizard |
| `shortcuts-dorico.json` / `shortcuts-flat.txt` | Dorico's 339 default shortcuts with names; Flat's 179 | the apps' key-command data | **design reference** for `TOOL_SHORTCUTS`, not to copy wholesale |

**Licences:**
- **Names, numbers, ranges, tempos and term translations** are facts and short terms. Use them as reference data.
- **Shortcuts:** treat them as design input.
- **Proprietary media and writing:** don't copy them into the app.
- **Fonts and sounds:** take them from their upstream sources (see `RESOURCES_CATALOGUE.md`).

**Fuller references:**
- `piano-data/research/dorico/`: options, settings, palettes, UI flow, comparison with Piano Trainer.
- `piano-data/research/flat/`: Flat's shell and motion, settings, tools, flows, onboarding, player, libraries.
