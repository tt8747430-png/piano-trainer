# Open-source components found in ChordLab 1.0.6, checked

ChordLab ships these as separate, openly licensed components. Get them from **upstream**
(links below) instead of copying them out of the app bundle. Upstream gives you the latest version, the full
source, and a clean licence trail.

| Component | What's in ChordLab | Licence | Upstream | Use in a piano trainer |
|---|---|---|---|---|
| **Verovio** (engraving) | `Frameworks/libverovio.dylib` (4.x) and `Resources/verovio/` (11 MB of font data) | LGPL-3.0 | https://www.verovio.org · npm `verovio` (WASM) · https://github.com/rism-digital/verovio | Render staff notation (clefs, key/time signatures, beaming, ledger lines, spacing) from MusicXML / MEI / ABC / Humdrum to SVG. Works in the browser, iOS/macOS (C++) and Python (`pip install verovio`). |
| **SMuFL fonts**: Bravura, Leipzig, Leland, Petaluma, Gootville | `Resources/verovio/<font>/` glyph files and `<font>.xml` bounding boxes | SIL OFL 1.1 | https://github.com/steinbergmedia/bravura · https://w3c.github.io/smufl/ | Notation glyphs. Bravura's `bravura_metadata.json` includes **engravingDefaults** (staff-line thickness 0.13 sp, stem 0.12 sp, beam 0.5 sp, ledger extension 0.4 sp, etc.). This is the standard source for staff and engraving rules. |
| **Greg Sullivan E-Pianos**: CP80, Pianet T, Wurlitzer EP200 | `Resources/Instruments/E-Pianos/` (.sfz and FLAC, 21 MB) | **CC-BY 3.0** (credit required) | https://github.com/sfzinstruments/greg-sullivan.e-pianos | Piano sounds. Credit: "E-Pianos by Greg Sullivan, sfz mapping by kinwie, CC-BY 3.0". |
| **sfizz** | linked into ChordLab | BSD-2-Clause | https://github.com/sfztools/sfizz | Plays .sfz instruments (native). On the web, use a WebAudio sfz player instead. |
| **Sparkle** 2.9.4 | `Frameworks/Sparkle.framework` | MIT | https://sparkle-project.org | Auto-updates for a macOS app. |
| **IBM Plex** fonts | embedded | SIL OFL 1.1 | https://github.com/IBM/plex | UI typography. |
| **JUCE** | statically linked | AGPLv3 **or** commercial | https://juce.com | Audio/MIDI app framework. AGPL requires you to open-source your app, or buy a licence. |
| **LilyPond** | not bundled; ChordLab looks for it on your system | GPL | https://lilypond.org | Print-quality PDF export. Not installed on this Mac. |

## Engraving and staff rules: where they actually come from

- **Verovio** implements the rules: stem direction (notes above or below the middle line), beaming by
  beat groups, accidental stacking, ledger lines, horizontal spacing proportional to duration, and
  clef, key and time signature layout. Use it as a library rather than re-deriving the rules.
- **SMuFL spec + Bravura metadata** give the glyph code points and engravingDefaults measurements.
- Elaine Gould's *Behind Bars* is the human-readable reference for notation conventions.

## Checks done
- Licences confirmed from ChordLab's bundled `THIRD-PARTY-NOTICES.txt`, the E-Pianos `README.md`/`LICENSE`,
  and Sparkle's `Info.plist`.
- Font directories present: Bravura, Gootville, Leipzig, Leland, Petaluma (+ Liberation text font).
- Verovio version strings in the dylib: 4.0.x. Use the current upstream release.
