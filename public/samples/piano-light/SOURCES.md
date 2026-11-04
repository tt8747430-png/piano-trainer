# The light piano's samples

The piano heard before the grand's files arrive, and offline before they are downloaded: one layer,
precached with the app.

- **Set:** Salamander Grand Piano V3, a Yamaha C5 recorded by Alexander Holm (the grand's set, see
  `../piano/SOURCES.md`).
- **Source:** https://archive.org/details/SalamanderGrandPianoV3,
  `SalamanderGrandPianoV3_44.1khz16bit.tar.bz2`, downloaded 2026-11-04.
- **Licence:** Creative Commons Attribution 3.0 (CC BY 3.0), https://creativecommons.org/licenses/by/3.0/;
  credited with the grand.
- **Files used:** `44.1khz16bit/<root>v10.wav` for the 30 roots A0, C1, D#1 … A7, C8.
- **Changes:** mixed to mono, cut to 3 s with a 60 ms fade, one gain for the set (the loudest file at
  -1 dBFS), AAC-LC 96 kb/s, 44.1 kHz.
- **Command:** `node scripts/samples/piano-light.mjs salamander <SalamanderGrandPianoV3_44.1khz16bit folder>`
  (ffmpeg).

**To do:** R29 SND names Splendid Grand Piano (AKAI's Steinway set, public domain,
https://sfzinstruments.github.io/pianos/splendid_grand_piano) for this folder. Its files are in
https://github.com/sfzinstruments/SplendidGrandPiano, which this session could not reach. With the set
downloaded, `node scripts/samples/piano-light.mjs splendid <SplendidGrandPiano folder>` makes this folder
from it; then rewrite this file for Splendid (public domain, no credit needed).
