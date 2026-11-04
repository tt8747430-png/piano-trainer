# The electric bass's samples

- **Set:** Growlybass v1.002, a Squier Jazz Bass played fingered, recorded direct, by Karoryfer Samples
  (Karoryfer Lecolds, 2014).
- **Source:** Karoryfer's free libraries page, https://shop.karoryfer.com/pages/free-samples, its
  download https://github.com/sfzinstruments/karoryfer.growlybass/releases/download/v1.002/Karoryfer.Growlybass.v1.002.zip,
  downloaded 2026-11-04.
- **Licence:** Creative Commons Zero 1.0 (CC0), https://creativecommons.org/publicdomain/zero/1.0/: the
  `LICENSE` in the ZIP is CC0 1.0 Universal, and the free libraries page says "All our free sample
  libraries are under a Creative Commons Zero license". No credit is required; thanked here.
- **Files used:** `sustain/<note>_p_rr1.wav` (layer `p`) and `sustain/<note>_f_rr1.wav` (layer `f`) for
  e2, gb2, a2, c3, eb3, gb3, a3, c4, eb4, gb4, a4. Growlybass names a note an octave above the pitch it
  sounds (its `e2` sounds E1, MIDI 28); the manifest gives the sounding key.
- **Changes:** mixed to mono, cut to 2.5 s with a 60 ms fade, one gain for the set, AAC-LC 96 kb/s,
  44.1 kHz.
- **Command:** `node scripts/samples/bass-electric.mjs <Growlybass folder>` (ffmpeg).
