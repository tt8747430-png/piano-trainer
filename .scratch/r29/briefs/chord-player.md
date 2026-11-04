# Brief: the Chord player (R29 CP1–CP6)

You build, in a git worktree branched from `claude/keen-gates-q9bnit`, a new Practice page: the Chord player.
Read first: `CLAUDE.md`, `.claude/skills/owner-way/SKILL.md` (its rules bind you, above all "No half
measures", "Interaction", "Layout", "Words and help"), then `.scratch/r29/plan/practice-redesign.md`
sections **CP** to **CP6** (each with its Decided 22 note, which wins), and **P13**, **P14** (folded into
it), **P16** (beats). Musicca's chord player is the reference: facts and behaviour only, from the notes the
plan cites (`scratchpad/metronome-ref/notes.md` §7–8, `musicca-notes.md` §3–5, `piano-data/musica/`); its
code, words, patterns and sounds never ship.

## Rulings already taken (do not reopen; ledger them in your report)
1. **Two pages, one engine (Decided 22).** Progressions stays (`/practice/progressions`, the page to learn a
   progression). The **Chord player** is new: `/practice/chord-player` (`pages/chord-player`), its Settings
   `/practice/chord-player/settings`, a tile in Practice's Harmony group, in Search's index, its parent in
   `app/routes/parents.ts`. Each page opens the other with the same chords (a link row on each).
2. **Accompaniment stays as it is** (its pattern pages, studies and Settings). Its patterns are the chord
   player's **Piano patterns** style group (read from `entities/pattern`, not copied). Moving the studies to a
   Songs folder is not in your scope.
3. Styles: the first and default is **Pop 1**. Before writing styles, write
   `.scratch/r29/research/musicca-styles.md` (how Musicca's styles are built: instruments, steps, variation per
   bar and section, fills), facts only; ours follow that structure, every pattern written by us.
4. Sound contract (already on the branch, do not change its shape): `NoteSound.instrument?: 'piano' |
   'bassElectric' | 'bassUpright'` and `DrumSound { kind: 'drum'; at; piece: KitPiece; velocity }`
   (`src/shared/lib/schedule/schedule.ts`). Write the band's bass and drums as these sounds; they play today
   through stand-ins and a separate agent is giving them recorded samples. Do not touch `src/shared/api/audio/`.
5. My chord sheets: a `createSavedStore` (`pt-chord-sheets`, version 1) in `SYNCED_SAVES` (Decided 22: synced).
6. Transpose and the time signature are on the Chord player's Settings page (Decided 22), not on the page.
7. Export audio (CP4) is left out: it needs the recorded instruments first; say so in the report.

## Files you own
`src/pages/chord-player/**`, `src/pages/chord-player-settings/**` (or the page's own settings folder, as the
lesson's is), `src/widgets/chord-player/**` (new), `src/shared/lib/arrangement/chord-sheet.ts` and
`arrange-style.ts` (new, kernel rules: arrangement imports only music), `src/shared/lib/music/
progression-random.ts`, `src/entities/pattern/content/styles/**`, a new entity for the saved sheets, the
route files (`app/router.tsx`, `app/routes/*chord-player*`, `parents.ts`), the Practice grid and Search index
entries, `entities/settings/model/registry.ts` (home `chord-player`), en/ru `practice` strings, ADR 0112
(amended) and a line in `docs/UBIQUITOUS_LANGUAGE.md`. Ask nothing; touch other files only as the routes need.

## How to work
Write the CP5 spec `.scratch/r29/chord-sheets/spec.md` first (a store and a route). Then build CP1 → CP2 →
CP5 → CP3 → CP4 → CP6, TDD (a failing test first), one commit per item or task, messages "R29-CP2: …" with
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and
`Claude-Session: https://claude.ai/code/session_01RLULmeGMHBXAgs4W7vM6qK`. Every string in en and ru. Phone
(390, 320) and laptop (1280) alike; nothing clipped at 320. Check only what you changed: `npm run typecheck`,
`npm run lint`, `npm run test:related -- <files>`; `npm run build` after touching routing. Never the full
suite. `npx prettier --write` only your files. Take a screenshot of the page at 390 and 1280 at the end
(Playwright per CLAUDE.md, `npx vite --port 5191 --strictPort`, stopped by PID after) into
`.scratch/r29/shots/after/cp-*.png`.

## Report (in `.scratch/r29/briefs/chord-player-report.md`, and a few lines back)
What was built per item, the commits, the rulings you took (each with its cost if wrong), what is left.
