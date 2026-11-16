# Music resources and learning materials: what you may take, and from where

This covers what I found inside ChordLab, GarageBand, Dorico 6 and Flat 26.11, sorted by licence.

**Rule used:**
- **Openly licensed:** take it, from its **upstream source** rather than out of the app bundle, so the licence and credits come with it.
- **Proprietary:** catalogued here (names and counts) for reference only. Don't copy it into Piano Trainer: it's a free, public app (PRODUCT.md), so shipping it would be redistribution.

---

## A. Openly licensed: can go into Piano Trainer

| Resource | Found in | Licence | Get it from | Use |
|---|---|---|---|---|
| **Bravura** (SMuFL music font, + Bravura Text) | Dorico, Verovio, ChordLab | SIL OFL 1.1 | github.com/steinbergmedia/bravura | notation (you already use it) |
| **Petaluma** (handwritten-style music font; Flat also ships PetalumaScript) | Dorico, Flat | SIL OFL 1.1 | github.com/steinbergmedia/petaluma | "handwritten" score style (you already offer Petaluma) |
| **Leland** (MuseScore's music font) | Dorico, Flat, Verovio | SIL OFL 1.1 | github.com/MuseScoreFonts/Leland | notation (you already offer it) |
| **Leipzig, Gootville** | Verovio, ChordLab | SIL OFL 1.1 | bundled in `verovio` (npm) | notation |
| **Finale music fonts** (Maestro, Ash, Broadway, Jazz, Engraver…) | Dorico (acknowledged), Flat | MakeMusic re-licensed them under the SIL OFL (2024), so **check the current licence file** before use | MakeMusic's official release | jazz / handwritten styles |
| **Academico, Sebastian, Golden Age** | Dorico (acknowledged) | listed among Dorico's open fonts; **verify each licence** at its source | their authors' repositories | text / alternative music fonts |
| **Greg Sullivan E-Pianos** (CP80, Pianet T, Wurlitzer EP200) | ChordLab | CC-BY 3.0, **credit required** | github.com/sfzinstruments/greg-sullivan.e-pianos (or npm `smplr` ElectricPiano) | electric-piano sounds |
| **Salamander Grand Piano V3** | already in Piano Trainer (ADR 0034) | CC-BY 3.0 | (already integrated) | piano |
| **SMuFL specification** (glyph names, ranges, engraving defaults) | Dorico ships `glyphnames.json`, `classes.json`, `ranges.json` | W3C Community Final Specification (open) | w3c.github.io/smufl/ | glyph lookup tables |
| **Verovio** (engraving engine) | ChordLab, your app | LGPL-3.0 | npm `verovio` | (already integrated) |
| **URW base-35 fonts** (Nimbus, Century Schoolbook L, URW Gothic) | Flat | AGPL with font exception / GPL (URW++) | the URW base35 repository | text fonts for printed scores |
| **Inter, Noto Serif** | Flat | SIL OFL 1.1 | Google Fonts / rsms.me/inter | UI and text |

## B. Open learning material and music (replacements for the proprietary lessons)

| Source | Licence | What it gives you |
|---|---|---|
| **Open Music Theory** (viva.pressbooks.pub/openmusictheory) | CC BY-SA 4.0 | a complete theory textbook: intervals, keys, chords, cadences, voice leading, form |
| **OpenScore** (MuseScore's CC0 projects: Lieder corpus, string quartets) | CC0 | thousands of engraved public-domain scores as MusicXML / MuseScore files |
| **Mutopia Project** (mutopiaproject.org) | public domain / CC per piece | engraved classical scores in LilyPond, MIDI and PDF |
| **IMSLP** (imslp.org) | public domain in many countries; **check per file and per country** | scans of method books (Czerny, Hanon, Burgmüller, Beyer, Bach's Notebook for Anna Magdalena) |
| **Theory facts recovered in this folder** | facts aren't copyrightable | chord qualities, scale tables, key-detection weights, engraving values, spelling rules (`../chordlab-export`, `../garageband-chord-detection`, `../piano-theory-export`) |

**Formats worth copying as ideas** (formats aren't content):
- Dorico's guided-tutorial structure: steps with a heading, markdown, a highlighted UI element and a looping GIF, per language.
- ChordLab's content-pack JSON.
- Flat's tip cadence (one tip at a time, 5-minute gap).

## C. Proprietary: catalogue only, don't copy

| App | Content | Size / count | Owner |
|---|---|---|---|
| GarageBand | **Learn to Play**: Basic Lessons (Piano 1–8, Pop Piano 1–6, Guitar) and **Artist Lessons** (John Legend, Norah Jones, Sara Bareilles, Ben Folds, Rush, Fall Out Boy, OneRepublic, Colbie Caillat, Sarah McLachlan…) | 4.3 GB, `.mwand` bundles | Apple, plus the artists' publishers |
| GarageBand | ChordTrainer (4 sets), Apple Loops, instrument library | — | Apple |
| GarageBand | trained neural-net weights (`_weight_definitions`) | — | Apple |
| Dorico 6 | 8 guided-tutorial projects with GIFs (4 desktop, 4 mobile, 9 languages) | — | Steinberg |
| Dorico 6 | HALion sound content, playback templates, expression maps; 624-instrument database, 41 templates, 298 technique definitions (exported earlier for **reference only**) | — | Steinberg |
| Flat 26.11 | 205 instrument sound packs (92 premium), downloaded to `~/Library/Caches/Flat/soundfonts` | — | Tutteo |
| Flat 26.11 | onboarding texts, tours, Assistant catalogue, icons (`flat-icons`) | — | Tutteo |
| ChordLab | Beginner and Intermediate content packs (exported earlier for **reference only**) | 16 voicings, 4 progressions, 11 melodies | ChordLab's developer |

**Practical route for content:** write your own lessons in your own words and voicings. Build the theory from section B and the recovered facts, use public-domain or CC0 scores for repertoire, and use the open fonts and sounds from section A.
