# The grand piano's samples

- **Set:** Salamander Grand Piano V3, a Yamaha C5 recorded by Alexander Holm (48 kHz 24-bit, 16 velocity
  layers, every minor third from A0).
- **Source:** https://archive.org/details/SalamanderGrandPianoV3, the file
  `SalamanderGrandPianoV3_44.1khz16bit.tar.bz2` (the author's own 44.1 kHz 16-bit export of the same
  recordings), downloaded 2026-11-04.
- **Licence:** Creative Commons Attribution 3.0 (CC BY 3.0), https://creativecommons.org/licenses/by/3.0/,
  as the set's `README` states ("Licence: CC-by") and archive.org's record of it.
- **Credit** (shown in Settings, the Help group's footnote): "Piano: Salamander Grand Piano by Alexander
  Holm (CC BY 3.0)".
- **Files used:** `44.1khz16bit/<root>v4.wav` (`p`), `v8` (`mp`), `v12` (`mf`) and `v16` (`f`) for the 30
  roots A0, C1, D#1, F#1 … A7, C8; the tuning of each root (cents, `tune` in `manifest.json`) from
  `SalamanderGrandPianoV3Retuned.sfz` (Markus Fiedler's retuning, in the same release).
- **Changes:** mixed to mono, cut to 10 s (A0–B2), 6 s (C3–B4) or 3 s (C5–C8) with a 60 ms fade, one
  gain for the whole set (+2.1 dB, the loudest file at -1 dBFS), AAC-LC 96 kb/s, 44.1 kHz.
- **Command:** `node scripts/samples/piano.mjs <SalamanderGrandPianoV3_44.1khz16bit folder>` (ffmpeg).
