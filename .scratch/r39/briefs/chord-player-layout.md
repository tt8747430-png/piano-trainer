# Brief: the Chord player's layout is the learner's (canvas R76) in the app

1. **The job:** port the board's Chord player R76 to the app: movable, sizable, minimizable and hideable panels with
   Edit layout, saved per page and reset from the gear and from Settings › General › Layout › Page layouts; the Genos
   Compact on a phone; the sheet name as a menu of recent sheets opening on the last; settings regrouped; ··· a menu.

2. **Docs:** read `docs/adr/0052-practice-and-search.md` (the Chord player's part) and rewrite that part in place to
   what you built. Read `.scratch/r39/plan/practice-chord-player.md`, "The rulings as they stand", first ruling, in full.

3. **Boundaries:** the session (me) is working only on the canvas (`.scratch/r39/canvas/`) and small app fixes in
   `src/widgets/player-setup`, `src/widgets/lesson-view`, `src/widgets/practice-player`. Stay out of those three
   widgets and the canvas. Settings' General page (`widgets/settings-screen`) and the Chord player
   (`pages/chord-player`, `pages/chord-player-settings`, `widgets/chord-player`, `widgets/chord-chart`) are yours.

4. **The owner's screenshots:** none for this item; the board is the spec. Open the boards in the canvas runtime:
   `practice/project/ChordPlayer.dc.html` (phone 402) and `ChordPlayerLaptop.dc.html` (laptop 1710), with their
   States box, and `Settings.dc.html` / `SettingsLaptop.dc.html` (General › Layout › Page layouts). The boards are
   written by `.scratch/r39/canvas/r58_chordplayer.py` (the panels, `LAY0`, Edit layout, the tray, the tag menus, the
   Genos modes, the recent-sheets menu, ···) and `.scratch/r39/canvas/r49_settings.py` (`P_LAYOUTS`, `LAYSEC`,
   `_LAYROW`). Kit helpers: `.scratch/r39/canvas/r41_kit.py`, `calm_kit.py`. Measure the boards with
   `.scratch/r39/canvas/checks/run.mjs <Board> w h '[{"eval":...},{"shot":1}]' <outprefix>` (see `checks/README.md`).

5. **The owner's words** (2026-11-18): "i want more user customizable ui like draggable resizable, hidible,
   minimizable toolbars dragging to the left and putting it there or draggind to the top … genos controls on phone or
   on laptop are bad designed as on phone it occupies too much space and is not hidable, resizable, minimizable,
   draggable … the layout should be saved and resetable in the app setitngs for teh individual page or for the whole
   app … it correctly opens the last opened or saved scores and teh settinsg should be refactored".

6. **Build** (port from the board's code value for value: structure, order, words, sizes, paddings, gaps, radii,
   colours, shadows; the app's kit changes to the board, never the board to the kit):
   1. A layout model, pure, in `entities/*/model` or `shared/lib` with a colocated test: panels Keys (Top|Bottom;
      S|M|L), Controls (Floating|Top; Full|Play only), Genos (Top|Floating|Bottom, laptop also Left|Right;
      Full|Compact|Minimized), Chords on a laptop (Left|Right; Narrow|Wide); each hideable but the chart; the board's
      `LAY0` defaults (Genos Compact by default on a phone; right column on a laptop).
   2. A saved store for page layouts (`createSavedStore`, a new version, no migration), keyed by page so Settings can
      list every changed page; writes are feature commands, reads selectors.
   3. Edit layout from ··· and from the gear's Layout: each panel outlined with its tag (grip + name); drag by the grip
      (mouse and held finger) and, for WCAG 2.5.7, tap the tag then tap a lit honey zone; the tag's menu sets Place,
      Size, Hide; hidden panels in a tray under the bar (+ Keys); the bar holds Reset and Done.
   4. The Genos head minimizes it to a pill ("Genos · Main A") at any time, edit or not.
   5. The sheet's name in the bar is a menu of recent sheets (the open one checked), New sheet, All chord sheets; the
      page opens on the sheet last open.
   6. Chord player settings regrouped as the board: Sound (Piano, Bass, Drums, Volume), Playing (Count-in, Voicing),
      Chart (Time signature, Written as), MIDI (Connect a piano, Follow a MIDI arranger, Arranger), Layout (Edit
      layout, Reset layout, Every page's layout ›). Keep `settings-homes.test.ts` true: one home per preference.
   7. ··· is the kit's row menu at its button (Save and Discard draft when there is one, Share…, Edit layout, Save to
      my progressions, Open in Progressions), not a sheet.
   8. Settings › General › Layout › Page layouts: "Changed by you" rows (page name, what changed, Reset) and Reset
      every page; each reset happens at once with Undo in its toast (`say`). The General row shows the count changed.
   9. Every string in `en` and `ru`, in musicians' words, the board's English exactly.
   Decide anything the board leaves open and say why in the ADR.

7. **Routes to shoot:** `/practice/chord-player` (rest, Edit layout on, a tag menu open, a panel hidden in the tray,
   Genos minimized, the recent-sheets menu, ··· open), its settings page, and Settings › General › Page layouts, at
   402×874, 393×852 and 1710×904, Day, English.

---

## Setup

- If `node_modules` is missing in your worktree, symlink the main checkout's. Do not run `npm install`, because the folder
  is shared. If you need a package, install it directly.
- Merge the session's branch first (`claude/keen-gates-q9bnit`); it holds every earlier round.
- Read `CLAUDE.md`, `docs/CODE_STYLE.md`, `DESIGN.md`, and in `.claude/skills/owner-way`: `SKILL.md`,
  `references/ui-and-mockups.md`, `references/testing.md`, and your area in `references/feedback-log.md` (Practice).
- The dev server needs `VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_PUBLISHABLE_KEY=local-check
  VITE_SKIP_WELCOME=true` inline (never a `.env.local`). Use port 5192.

## The owner's standing rules

- The quality of real apps. No legacy code, backwards compatibility or duplication.
- Phone and desktop work the same. Consistency everywhere.
- Explanations go in ⓘ popups (`InfoTip`). No hardcoded text on the score.
- Everything must be implemented and nothing left unimplemented.

## Process

- Write your plan and report skeleton to a file at once, and save after each item, so an interruption loses nothing.
- This session runs as the owner's loop: no tests written or run, no lint; run `npm run typecheck` once at the end
  and fix what it reports in your files. Test files you touch must still compile.
- One commit per task, its message saying what changed and why, ending with:
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01BrtnH1Yf7S8aVU4w6rFSCU
- Never `npm run format`: `npx prettier --write <files you touched>`.
- Never `checkout`, `restore`, `stash` or `reset` what you did not create. Do not push.
- Run both browser passes in `.claude/skills/owner-way/references/testing.md` on every route you changed, measuring
  the board and the app screen in the browser (computed size, padding, radius, colour) until the numbers match.
- Merge the session's branch again before reporting, and resolve conflicts.
- Amend the ADR's Chord player part. Leave `CLAUDE.md` alone.
- A command over 10 seconds runs in the background. Stop everything you started by PID.
- Everything in the brief is built; nothing is left unimplemented.

## Report (under 500 words)

What you built, the commits, the typecheck result, both passes' results with the shots' folder and the measured
numbers, your decisions, what is left and why, and that nothing you started is running.
