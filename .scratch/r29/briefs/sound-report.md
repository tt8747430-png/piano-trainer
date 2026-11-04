# Report: the sounds (SND + A27)

Branch `worktree-agent-a866566170de81e04`, fast-forwarded to `claude/keen-gates-q9bnit` (a2b4e0cd) before work.
Commits `896e7e97..3702fd84` (6), plus this report.

## Built

| Commit | What |
|---|---|
| 896e7e97 | The sample sets under `public/samples/{piano,piano-light,bass-electric,bass-upright,drums}/`, each with `manifest.json` and `SOURCES.md`; `scripts/samples/*.mjs` (ffmpeg: AAC-LC `.m4a`, mono, 44.1 kHz; 96 kb/s, drums 128 kb/s; 60 ms fade; one gain a set); `sample-manifest.ts`; `check-samples.test.ts` |
| bac81919 | `sample-loader.ts`: manifest once, fetch + decode on first need, LRU across every set under 80 MB decoded, background prefetch (no decode) |
| 7a070c60 | `sampler.ts`: our own (no smplr, no Tone.js): nearest root ≤ 1 semitone, Salamander's retuned cents, layer by velocity and gain inside it, a loaded neighbour layer while the asked one loads, one voice a key, piano release 0.6 s (C3) → 0.25 s (C5), kit pieces by name, closed/pedal hat chokes open |
| a780303c | `instruments.ts` + `web-audio.ts`: piano note → grand → light piano → synth; bass note (`NoteSound.instrument`) → its set → the piano; `DrumSound` → the kit → `DRUM_STAND_IN`; `play` fetches what it schedules; `unlock` warms the light piano and the grand's mp layer C2–C7, then prefetches the rest. Sound shapes unchanged |
| 00b42869 | `vite.config.ts`: `globIgnores` + `samples/piano/**`; `/samples/piano/` CacheFirst `samples-piano` (200s, range requests, no expiry); manifests StaleWhileRevalidate `samples-manifests`; `workbox` exported for `vite-config.test.ts`. Build checked: precache holds 100 sample files (light piano, basses, kit), no grand file |
| 6bf40a04 | Storage and backup › **Piano sound**: "x MB of 8.8 MB on this device", Download for offline with "Downloading… n%", Ready offline; **Remove piano samples** in the danger group via `ConfirmDialog`; `piano-download.ts`; credit in `settings.about.madeWith` (en, ru) |
| 3702fd84 | ADR 0034 amended |

Sizes: piano 8.8 MB (120 files), piano-light 1.1 MB, bass-electric 0.7 MB, bass-upright 0.7 MB, drums 0.7 MB.
Precached together ≈ 3.3 MB.

## Licence verdicts (each checked at its source)

- **Salamander Grand Piano V3:** CC BY 3.0, used. The set's README ("Licence: CC-by",
  http://creativecommons.org/licenses/by/3.0/) and archive.org's record
  (https://archive.org/details/SalamanderGrandPianoV3). Downloaded the author's 44.1 kHz 16-bit export.
- **Growlybass / Meatbass (Karoryfer):** CC0 1.0, used. `LICENSE` in each ZIP is CC0 1.0 Universal, and
  https://shop.karoryfer.com/pages/free-samples says "All our free sample libraries are under a Creative Commons
  Zero license". So Decided 22's recorded bass is met, electric and upright.
- **Virtuosity Drums:** CC0 1.0, used. `LICENSE` in the ZIP and the same page.
- **Splendid Grand Piano:** listed as public domain (AKAI) at
  https://sfzinstruments.github.io/pianos/splendid_grand_piano. **Not downloaded**: its files are only in the
  GitHub repo `sfzinstruments/SplendidGrandPiano`, and this session's proxy refused it (adding the repo was
  denied). `piano-light` is made from Salamander's v10 for now (same CC BY credit).

## Deviations (and why)

- `check-samples.test.ts` lives in `src/shared/api/audio/`, not `scripts/`: vitest's `include` and
  `tsconfig`'s `include` cover neither `scripts/`, and those files were not mine to change.
- `vite.config.ts` exports `workbox` (the same object the plugin takes) so the config test can read it.
- The smplr spike was not run: no npm package can be added here. Our sampler covers all three tests A27 asked of
  smplr. ADR 0034 records this.
- The credit is plain text: the footnote is a string (`SettingsGroup`'s `footnote`), so the licence name is not
  a link. `SettingsList.tsx` (not mine) would need to render it as one.

## Checks

`typecheck` and `lint` clean; `test:related` on every changed source passes except
`src/app/composition-root.test.ts` › "build on the project the environment names…" ("supabaseUrl is required"),
which needs `.env.local` (none in this worktree) and does not touch audio. `npm run build` passes with placeholder
Supabase variables.

## Left, and the owner's to-dos

1. **Splendid Grand Piano:** download https://github.com/sfzinstruments/SplendidGrandPiano, then
   `node scripts/samples/piano-light.mjs splendid <folder>` and rewrite `public/samples/piano-light/SOURCES.md`
   (public domain). The script reads Splendid's `.sfz` (region nearest each root at velocity 80); it is untested
   against the real files.
2. **Listen:** levels between sets are set by constants (`instruments.ts` `LEVEL`: light piano 0.5, bass 0.8,
   drums 0.7) and the sampler's in-layer floor (0.55). They have not been listened to, and neither has whether
   96 kb/s is thin in the bass. Also check on Chrome, Firefox and Safari that `decodeAudioData` trims AAC's
   priming (ffmpeg decodes the files with the attack at 0–20 ms).
3. **A27's checks not done here:** the before/after recordings (Fantaisie-Impromptu, Amazing Grace, Lightly
   Row) and SND's of Pop 1, Jazz Swing 1, Hymn 2 and the Drum kit (styles not built yet); Safari's memory
   timeline on an iPhone (≤ 80 MB decoded).
4. **Page range:** A27 orders loading by the open page's range and frees buffers outside the next page's range
   on leave. The `AudioOutput` port has no range today, so loading follows what is scheduled and the LRU frees by
   recency alone. A `prepare(range)` on the port would let the Player and keyboard pages say their range.
5. **Credit link:** make the "CC BY 3.0" in Help's footnote a link to https://creativecommons.org/licenses/by/3.0/
   (`widgets/settings-screen/ui/SettingsList.tsx`).
6. **Metronome's Drum kit:** still plays the VCSL WAVs in `public/sounds/` (C9). SND moves its kit pieces to
   Virtuosity Drums; that is the Metronome's code, not touched here.
