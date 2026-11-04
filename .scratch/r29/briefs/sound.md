# Brief: the sounds (SND + A27): the sampled grand, a recorded bass, a recorded drum kit

You build, in a git worktree branched from `claude/keen-gates-q9bnit`, the app's recorded instruments.
Read first, in this order: `CLAUDE.md`, `.claude/skills/owner-way/SKILL.md` (its rules bind you),
`.scratch/r29/plan/practice-redesign.md` section **SND** (with its Decided 22 note), and
`.scratch/r29/plan/rounds-3-4.md` section **A27** (corrections 5–8 at its top apply). Those two sections are
your spec; where they differ, SND (the newer) wins, A27 holds the piano's detail.

## The contract you build on (already on the branch)
`src/shared/lib/schedule/schedule.ts`: `NoteSound.instrument?: 'piano' | 'bassElectric' | 'bassUpright'`
(absent = piano) and `DrumSound { kind: 'drum'; at; piece: KitPiece; velocity }` with `KIT_PIECES`. Today
`web-audio.ts` plays a bass note as the piano and a drum stroke through a synthesised stand-in
(`DRUM_STAND_IN`). You make them play from the recorded sets. A separate agent is building the chord
player, which writes these sounds; do not change their shape.

## Rulings already taken (do not reopen)
- **No new npm package** (you may not `npm install` in a worktree): write our own small sampler
  (`shared/api/audio/sampler.ts`, A27 item 3's "Otherwise, our own"), used for piano, bass and drums alike.
  No Tone.js, no smplr. Note this in ADR 0034.
- Every sample file is ours under `public/samples/<instrument>/` with `manifest.json` and `SOURCES.md`
  (set, author, URL, licence and its URL, files used, the command). Licence must be CC0, public domain or
  CC BY, checked at its source before download; CC-BY-SA, NC and unlicensed sets are never used.
- Sets, in order of preference: piano Salamander Grand Piano V3 (CC BY 3.0) + Splendid Grand Piano (public
  domain) as the light fallback; bass Karoryfer Growlybass / Meatbass if their licence checks out, else
  VCSL's plucked strings or another CC0/CC-BY recorded bass (Decided 22: a recorded bass is required; a
  synthesised bass only until one is found, and then the owner is told); drums Virtuosity Drums (CC0).
- Format AAC-LC `.m4a`, mono, 44.1 kHz (drums 128 kb/s, the rest 96 kb/s); ffmpeg is available? check
  `which ffmpeg`; if it is missing, say so in your report and stop at the code (loader, sampler, manifest
  format, tests with fixture manifests), leaving the downloads as the owner's to-do with exact commands.
- Downloads go through the sandbox's proxy (`/root/.ccr/README.md`); if a host is blocked, try the set's
  mirrors (archive.org, GitHub releases); never bypass TLS.

## Files you own
`src/shared/api/audio/**` (sampler, loader, web-audio, tests), `public/samples/**`, `scripts/samples/**`,
`scripts/check-samples.test.ts`, `vite.config.ts` (globIgnores, runtimeCaching only), the Storage and
backup page's "Piano sound" group (find it with `grep -rn "Storage and backup" src/shared/i18n`), the
credits footnote (`settings.about.madeWith` and its ru), ADR 0034. Touch nothing else.

## How to work
TDD (a failing test first), one commit per task, messages "R29-SND: …" / "R29-A27: …" with the attribution
lines from CLAUDE.md's session (`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and
`Claude-Session: https://claude.ai/code/session_01RLULmeGMHBXAgs4W7vM6qK`). Check only what you changed:
`npm run typecheck`, `npm run lint`, `npm run test:related -- <files>`; `npm run build` after touching
vite.config.ts. Never the full suite. `npx prettier --write` only your files. Commit binary samples only if
the whole set stays under the budgets in SND (piano ≤ 15 MB).

## Report (short, in a file `.scratch/r29/briefs/sound-report.md`, and a few lines back)
What was built, the commits, each set's licence verdict with its URL, what is left and why, and the
owner's to-dos.
