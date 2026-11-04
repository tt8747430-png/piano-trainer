# The drum kit's samples

- **Set:** Virtuosity Drums v0.925, a jazz kit played with sticks, by Versilian Studios and Karoryfer
  Samples (https://versilian-studios.com/virtuosity-drums).
- **Source:** Karoryfer's free libraries page, https://shop.karoryfer.com/pages/free-samples, its
  download https://github.com/sfzinstruments/virtuosity_drums/releases/download/v0.925/Virtuosity_Drums_v0.925.zip,
  downloaded 2026-11-04.
- **Licence:** Creative Commons Zero 1.0 (CC0), https://creativecommons.org/publicdomain/zero/1.0/: the
  `LICENSE` in the ZIP is CC0 1.0 Universal, and the free libraries page says "All our free sample
  libraries are under a Creative Commons Zero license". No credit is required; thanked here.
- **Files used:** each piece's stroke on four microphones, `Samples/<mic>/<folder>/<mic>_<articulation>_vl<n>[_rr1].flac`
  with `<mic>` kickmic, snaremic, oh and room:

  | Piece | Folder, articulation |
  |---|---|
  | kick | kick, `kick_snoff` |
  | snare | snare, `snare_center` |
  | rim (cross-stick) | snare, `snare_crossstick` |
  | hatClosed, hatOpen, hatPedal | hh, `hh_closed`, `hh_open`, `hh_pedal` |
  | ride, rideBell | ride, `ride_ride`, `ride_bell` |
  | crash | crash, `crash_crash` |
  | tomHigh, tomFloor | htom `htom_center`, ltom `ltom_center` |
  | tomMid | htom `htom_center`, tuned three semitones down (the kit has two toms) |

  `accent` is each articulation's loudest velocity layer, `normal` the layer at 55 % of its count.
- **Changes:** the four microphones mixed to mono (kick mic 1, snare mic 0.8, overheads 0.8, room 0.5),
  each stroke cut to its length (0.6 s a closed hat to 3.5 s the crash) with a 60 ms fade, one gain for
  the kit (the loudest file at -1 dBFS), AAC-LC 128 kb/s, 44.1 kHz.
- **Command:** `node scripts/samples/drums.mjs <Virtuosity Drums folder>` (ffmpeg).
