# Spec: the piano sampler and its samples (D15, A27, Constraints: offline)

> **2026-11-03:** where this spec and [`../plan.md`](../plan.md) differ, the plan is newer and wins (prompt D20). Map of round 29's files: [`../README.md`](../README.md).

## Problem
Every piano note (`web-audio.ts`: `partials`, `holdNote`, `tone`) is three oscillators: it cannot sound like a
piano, least of all under the pedal.

## Decision
1. **Samples.** Salamander Grand Piano V3 (Alexander Holm, CC-BY 3.0), self-hosted in
   `public/samples/piano/`: one note every minor third from A0 to C8 (30 notes: A0 C1 D♯1 F♯1 … A7 C8),
   four velocity layers chosen from Salamander's sixteen (v4, v8, v12, v16 → `p`, `mp`, `mf`, `f`), AAC
   in `.m4a`, mono below C3 and stereo above, trimmed to the decay's −60 dB with a 50 ms fade (`scripts/
   piano-samples.mjs`, ffmpeg; the script and `SOURCES.md` committed, the source WAVs not). Budget 15–25 MB
   in all; `manifest.json` lists every file with its root key, layer and bytes. Credit on the About page.
2. **Player.** A spike (one commit, then kept or dropped) tries `smplr` (`SplendidGrandPiano`-style
   `Sampler` with our own map) against three needs: scheduling at an AudioContext time we pass, a damper we
   drive (one voice per key, release on our pedal lift), and loading layers on demand. If any fails, our own
   `shared/api/audio/sampler.ts`: decoded `AudioBuffer`s per (root, layer), `playbackRate =
   2^(semitones/12)` from the nearest root (never more than ±1.5 semitones), the velocity choosing the layer
   and scaling gain within it, a release envelope (≈ 0.3 s, longer in the bass) at note-off or pedal lift.
   Either way it sits behind the existing `AudioOutput` port: `play`, `press`, `release`, `pedal` unchanged.
3. **Loading and memory (≤ 80 MB decoded).** At first use: the `mf` layer's 30 files are fetched and
   decoded lazily per note, the ones a score or keyboard range needs first; other layers are fetched in the
   background but decoded only when first struck. Buffers not struck for 2 minutes and outside the current
   page's range are released. The synthesised voice sounds a note until its buffer is ready and is the
   offline fallback before the download. Measured in Safari's memory timeline on an iPhone before A27 is
   called done.
4. **Offline cache.** A Workbox runtime route for `/samples/` (CacheFirst, `cacheName: 'samples'`,
   `CacheableResponsePlugin({ statuses: [200] })`, `RangeRequestsPlugin`, no expiration), outside the
   precache. Storage and backup shows the samples' size (`caches.open('samples')` sizes) and a "Download for
   offline" row (fetch every file of the manifest with progress; Remove deletes the cache). A learner who
   never downloads still gets every note they played cached.
5. **Velocity.** Scheduled notes keep their velocities (0–1); a MIDI keyboard's velocity maps to the layer
   through the `midi.touch` curve already in settings.

## Tests
- `sampler.test.ts` (fake AudioContext): nearest root and rate for every key A0–C8; layer by velocity;
  one voice per key; release at note-off; held under the pedal until the lift.
- `piano-samples` manifest test: 30 roots × 4 layers, every file present, total under 25 MB.
- Workbox config test: the `/samples/` route exists with the plugins above.
- Memory: a scripted Playwright run of the Fantaisie-Impromptu reports decoded bytes (sum of buffers)
  under 80 MB.

## ADR
0034 (sound and MIDI): the sampled grand; 0002 (PWA): the samples' runtime cache. About page credit.
