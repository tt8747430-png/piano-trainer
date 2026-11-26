# Open resources found in Dorico 6, Flat, MuseScore 4 and ChordLab: verified and exported

Each file's licence was checked **in the file itself** (the font's OpenType name table, or the licence file shipped beside the sound), and against each app's acknowledgements. Only what's openly licensed is here, with its licence text.

## Fonts: `fonts/` (132 files, 53 families)
Full per-file copyright lines are in `fonts/FONTS-ATTRIBUTION.md`; the licence text is in `fonts/OFL/OFL-1.1.txt`.

| Licence | Families | Useful for Piano Trainer |
|---|---|---|
| **SIL OFL 1.1** | **Music (SMuFL):** Bravura (+Text), Leland (+Text), Petaluma (+Text, Script), Leipzig, Sebastian (+Text), Gootville Text, MuseJazz Text, Golden Age, MScore / MScoreBC / MScore Tabulature | score fonts for Verovio and the Layout font choice (you offer Bravura, Petaluma, Leland today); Sebastian, Leipzig and Golden Age are extra styles |
| **SIL OFL 1.1** | **Text:** Academico (Dorico's score text), Edwin (MuseScore's score text), Campania, Nepomuk, Splentino, Crimson Pro, Libre Bodoni, Lato, Source Sans Pro, Source Code Pro, Noto Sans JP, Inter, Caveat, Eugene | title and lyric text on printed scores (Academico and Edwin are the engraving-standard text faces) |
| **Apache 2.0** | Noto Serif | text |
| **GPL with font exception** | GNU FreeSerif, FreeSans | text; redistributing the font file itself follows the GPL |

**OFL conditions:**
- Bundle and embed freely, including in a web app.
- Keep the copyright and licence with the files.
- Don't sell a font on its own.
- A modified font must not use a Reserved Font Name (e.g. "Bravura").

## Sounds: `sounds/`
| Set | Size | Licence | Credit to include | Fit with your ADR 0034 |
|---|---|---|---|---|
| **MS Basic** (MuseScore's General MIDI SoundFont, the FluidR3 GM lineage; preset count not verified here), `MS-Basic-GM/MS Basic.sf3` | 49 MB | **MIT** (FluidR3 lineage); its `MS Basic_License.md` must stay with it | "FluidR3 © Frank Wen 2000–02; FluidR3Mono © Michael Cowgill 2014–17; MuseScore_General © S. Christian Collins 2018–19; Temple Blocks © Ethan Winer 2002; Drumline Cymbals © Michael Schorsch 2016" (from the file) | MIT isn't in your allowed list (CC0, public domain, CC BY; `check-samples.test.ts`). MIT is at least as permissive as CC BY, so **add MIT to the list** first. Convert the instruments you need with `scripts/samples/<set>.mjs` (mono AAC 44.1 kHz, per ADR 0034). |
| **Greg Sullivan E-Pianos** (Yamaha CP80, Hohner Pianet T, Wurlitzer EP200; SFZ + FLAC), `Greg-Sullivan-E-Pianos/` | 21 MB | **CC BY 3.0** (`LICENSE`, `README.md` included) | "E-Pianos by Greg Sullivan (sullivang.net), SFZ mapping by kinwie, CC BY 3.0", in About, as with Salamander | allowed as is; convert with a `scripts/samples/e-pianos.mjs` |

## Checked and **not** included
- **Finale Ash, Broadway, Jazz, Maestro** (installed by Dorico, also bundled in MuseScore). The files say "All rights reserved… as permitted by the EULA", although Dorico's credits list them under the OFL. Use only a copy from MakeMusic's official OFL release.
- **Proprietary:** Opus fonts (Avid / Sibelius), Georgia (Microsoft), Cambon (General Type Studio), DoricoIcons, flat-icons.
- **URW base-35** (in Flat): no licence embedded. Take it from the upstream release with its AGPL/GPL font-exception licence if wanted.
- **Proprietary content:**
  - Dorico: HALion sounds, tutorials and GIFs
  - Flat: instrument packs (none downloaded here), onboarding and UI text
  - GarageBand: everything
  - Sibelius: everything
  - ChordLab: its lesson packs
- **MuseScore code and data** (templates, instrument lists, styles) are **GPL-3.0**. Usable only if Piano Trainer's code were GPL, so they're not included. MuseScore's fonts and its MIT SoundFont are included above.

## Related
- `piano-data/research/_shared/app-ready-data/`: data (tempo words, EN/RU glossary, instruments EN/RU, page sizes, clefs…).
- `piano-data/research/dorico/RESOURCES_CATALOGUE.md`: open learning material (Open Music Theory, OpenScore CC0 scores, Mutopia, IMSLP).
