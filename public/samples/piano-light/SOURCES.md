# The light piano's samples

The piano heard before the grand's files arrive, and offline before they are downloaded: one layer,
precached with the app.

- **Set:** Splendid Grand Piano, a Steinway sampled by AKAI, mapped to SFZ by kinwie
  (https://sfzinstruments.github.io/pianos/splendid_grand_piano).
- **Source:** https://github.com/sfzinstruments/SplendidGrandPiano (commit 1c595d82), cloned 2026-11-04.
- **Licence:** public domain (released by AKAI; stated in the repository's README). Credited in Settings
  all the same.
- **Files used:** the mf layer (`Data/MF.txt`): for each of 30 roots A0, C1, D♯1 … A7, C8 the region whose
  `pitch_keycenter` is nearest; 29 distinct files (`Samples/MF <note>.flac`).
- **Changes:** mixed to mono, cut to 3 s with a 60 ms fade, one gain for the set (the loudest file at
  -1 dBFS), AAC-LC 96 kb/s, 44.1 kHz.
- **Command:** `node scripts/samples/piano-light.mjs splendid <SplendidGrandPiano folder>` (ffmpeg).
