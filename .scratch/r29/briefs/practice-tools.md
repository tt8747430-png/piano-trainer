# Brief: Progressions, Accompaniment, Chord finder, Exercises and Quiz, Practice settings (round 29, round 2)

Read first: CLAUDE.md; in `.scratch/r29/prompt.md` items A23 ("23. **Progressions"), A24, A25, A41, A42 and rules R15, R16,
R18, R20, R21, R29, R30, Decided 14; ADRs 0112, 0025, 0052; `.scratch/r29/settings-registry/spec.md` (incl. "As
built") and `src/entities/settings/model/registry.ts` (SETTING_HOMES; `src/app/settings-homes.test.ts` and
`src/app/settings-pages.test.tsx` keep each preference on one page). The pickers (`shared/ui/pickers`), the settings
pages' two-pane layout and rows (`pages/settings`, `shared/ui` rows) and the chosen style are built: use them.
Screenshots of today's pages: `.scratch/r29/shots/before/`.

Build, one commit per item, test first:
1. A24: a Settings page for every Practice page (Chords, Scales and keys, Intervals, Progressions, Accompaniment, Chord
   finder, Exercises and Quiz), reached from a gear in the page's bar and from Settings, the same page (registry ids;
   their preferences move there from the pages; the settings tests stay green).
2. A23: Progressions as the item says (roles and moves drawn on the chords, layout B, no Function switch; Passing
   chords; Voice leading; the page no longer ~11,500px).
3. A25: Accompaniment, the Chord finder, Exercises and the Quiz as the item says (not the Metronome: done).
4. A41: Exercises and the Quiz, inside, as the item says.
5. A42: every page against rule 30 (only what works here; a choice never moves you).
Update ADRs 0112, 0025, 0052 (decision as it stands, one History line each), DESIGN.md where the look changed, the
glossary. After-shots at 402, 320 and 1280 to `.scratch/r29/shots/after/practice-<page>-*.png` (Playwright as in
CLAUDE.md's repo facts; dev server `npx vite --port 5197 --strictPort`, stopped by PID).
Stay out of: Chords, Scales and keys, Intervals, the Metronome, the Player.
