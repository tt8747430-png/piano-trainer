# Canvas checks

Measurements run inside a board in the real Design runtime, so a review cites numbers and never guesses from the
generator. Each is one expression that returns JSON; `layout_check.js` here is the gate before every publish.

| File                 | Returns                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `layout_check.js`    | `["layout ok"]`, or controls outside the margin, small targets, labels touching an edge   |
| `review_measure.js`  | targets under 44, controls with no name, clickable non-buttons, font sizes, low contrast, |
|                      | `transition: all`, the focus ring, the open dialog's focus                                |
| `spacing_measure.js` | every padding, gap and margin off the 4-step grid, with where it occurs                   |
| `system_measure.js`  | the distinct text colours, backgrounds, radii (with the element's height), shadows,       |
|                      | weights                                                                                   |

## After every rebuild

`python3 checks/regress.py` compares each built board with the last commit and prints `REVERTED?` for a board that
shrank by more than 15%, grew by more than half, or changed its title. One is never published until the generator that
rewrote it is found: each board has one generator (`r41.py` runs them in order; a helper file is exec'd in its own
namespace, never imported, so it cannot re-run an old writer or shadow the kit's names).

## Running one

`run.mjs` serves the built boards to Chromium, plays steps and prints each `eval`'s result:

```bash
RT=<path to the Design type's dc-runtime.js> CSP=1 node run.mjs <Board> <width> <height> '<steps json>' <shot prefix>
```

- `<Board>` is the board's file stem (`Chords`, `ChordsLaptop`); a phone board runs at `450 952`, a laptop board at
  `1710 1100`. `DSF=3` zooms a screenshot.
- Steps: `{"wait": ms}`, `{"click": selector}`, `{"eval": js}`, `{"shot": 1}`. Wait about 4500 ms for a 3D stage.
- Build the steps with `json.dumps` in Python, never by hand in the shell: the scripts hold quotes.
- A laptop popover has no Done button; close it by clicking the element before `[role=dialog]`.
- `dc-runtime.js` is the Design artifact type's own script; read it from the type with the Artifact tool once per
  session and keep it in the scratchpad.

## The inventory and the layers

- `python3 checks/inventory.py` writes `../plan/inventory.md`: every board by canvas page, every sheet, popover, menu
  and dialog it holds (by its `aria-label`), and every kit component with the generators that call it. Run it after a
  rebuild; a component used by nothing is deleted, and a board on no canvas page is placed or deleted.
- `RT=… node .scratch/r39/canvas/checks/layers.mjs [Board …]` (from the repo root) opens every board, taps every
  control in its screen that does not leave the board, and measures each layer that opens, two levels deep (New ›
  New lesson): OUTSIDE the screen, a word CUT at its edge, two controls in OVERLAP, a phone's SHEET ON A LAPTOP,
  a SMALL control, an EMPTY layer, a page that THROWS. Its last line counts the layers opened and those with problems.

`python3 checks/dead_replaces.py <scratch dir>` builds a copy of the canvas with every `.replace(a, b)` and `re.sub` wrapped and prints each call that never matched: a patch on a helper's output that silently stopped applying (the laptop take's roll stood at 340×120 for rounds). It names suspects only; remove one, rebuild, and `diff -rq` against a copy of `practice/project` made before is the proof. `index.py:43` (a name with no comma) is expected.

## The board against the app by text (`port/tdiff.py`)

`RT=$RT python3 checks/port/tdiff.py <route> <Board> <w> <h>`, run from `.scratch/r39/canvas` with the dev server on
5191: every visible text's own box, size, weight and colour on the board and on the app's route, aligned at the first
text both show; it prints only what differs (BOARD ONLY, APP ONLY, DIFF pos/font/color). Run it before any screenshot
of a port; shoot only what it flags.

`python3 checks/shadow.py` lists every kit name (`r41_kit.py`, `calm_kit.py`) that a later generator assigns again and exits 1 if there is one. All generators run in one namespace, so such a copy silently replaces the kit's for every board built after it (r42's 20 chevron drew the kit's 16 one everywhere; r47's 20 Undo stood in the Chord player's band beside the editor's 22). A generator's own glyph takes a name of its own (`UNDO47`, `COURSEI`); the check runs with the build, before `regress.py`.
