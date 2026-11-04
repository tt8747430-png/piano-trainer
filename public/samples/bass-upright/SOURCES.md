# The upright bass's samples

- **Set:** Meatbass v1.001, a 1958 Otto Rubner double bass played pizzicato by Drogomir Smolken,
  recorded by Ludwik Zamenhof, by Karoryfer Samples (Karoryfer Lecolds, 2016).
- **Source:** Karoryfer's free libraries page, https://shop.karoryfer.com/pages/free-samples, its
  download https://github.com/sfzinstruments/karoryfer.meatbass/releases/download/v1.001/Karoryfer.Meatbass.v1.001.zip,
  downloaded 2026-11-04.
- **Licence:** Creative Commons Zero 1.0 (CC0), https://creativecommons.org/publicdomain/zero/1.0/: the
  `LICENSE` in the ZIP is CC0 1.0 Universal, and the free libraries page says "All our free sample
  libraries are under a Creative Commons Zero license". No credit is required; thanked here.
- **Files used:** `Samples/pizz/<note>_vl2_rr1.wav` (layer `p`) and `Samples/pizz/<note>_vl4_rr1.wav`
  (layer `f`) for c1, eb1, gb1, a1, c2, eb2, gb2, a2, c3, eb3, gb3, a3 (named by the pitch they sound).
- **Changes:** mixed to mono, cut to 2.5 s with a 60 ms fade, one gain for the set, AAC-LC 96 kb/s,
  44.1 kHz.
- **Command:** `node scripts/samples/bass-upright.mjs <Meatbass folder>` (ffmpeg).
