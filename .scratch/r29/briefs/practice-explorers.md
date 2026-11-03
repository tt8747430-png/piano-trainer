# Brief: Chords, Scales and keys, Intervals (round 29, round 2)

Read first: CLAUDE.md; in `.scratch/r29/prompt.md` items A20 ("20. **Buttons, rows and headings"), A21, A22, A32, A33, A43
and rules R15, R16, R21, R23, R29, R30; the specs `.scratch/r29/colour-notes/spec.md` and
`.scratch/r29/key-picker/spec.md`; ADRs 0046, 0052, 0061; DESIGN.md. The pickers (`shared/ui/pickers`), the shapes and
the chosen style (`src/styles`, DESIGN.md) are built: use them. `tensionTones(root, quality, key)` already follows a
chord's degree in a key (`shared/lib/music/tensions.ts`); `fingerPassage` and `handFingers` are the fingering rules.
Screenshots of today's pages: `.scratch/r29/shots/before/` (chords-*, scales-*, intervals-*), and the owner's in
`/tmp/claude-0/-home-user-piano-trainer/05b98fad-a70e-53a3-9b61-b349107350d2/scratchpad/r29/scales/` if present.

Build, one commit per item, test first:
1. A20 on Chords: the rows, buttons and headings of rule 29; a choice that can't be made is not drawn (R30; undo the
   greyed-but-kept rows from the look round); one heading style.
2. A33: one "Colour notes" panel on Chords: Chord tones · Tensions · Avoid, each chip a toggle that adds the note to the
   chord (its keys, its symbol via the existing chord-parts/withAdded/withAlterations, its sound) and plays it; the Added
   tones and Alterations controls removed; `colour=` in the URL (route-search tests); with `key=`/`degree=` from Harmony
   or Progressions' links the groups follow the degree. Tests from the spec.
3. A21 and A43: Scales and keys' three tabs as the item says (the Key tab's content, theory written on the music).
4. A22: Intervals as the item says.
5. A32: one owner per idea, links elsewhere (A33's table): remove copies, add the links.
Update ADRs 0052 and 0046 (the decision as it stands, one History line each), DESIGN.md where the look changed, the
glossary. After-shots at 402, 320 and 1280 to `.scratch/r29/shots/after/practice-<page>-*.png` (Playwright:
`require('/opt/node-tools/node_modules/playwright-core')`, `chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })`,
dev server `npx vite --port 5196 --strictPort`, stopped by PID).
Stay out of: Progressions, Accompaniment, the Chord finder, Exercises, the Quiz, the Metronome, the Player.
