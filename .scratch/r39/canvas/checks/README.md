# Canvas checks

Measurements run inside a board in the real Design runtime, so a review cites numbers and never guesses from the
generator. Each is one expression that returns JSON; `../layout_check.js` is the gate before every publish.

| File                 | Returns                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `../layout_check.js` | `["layout ok"]`, or controls outside the margin, small targets, labels touching an edge   |
| `review_measure.js`  | targets under 44, controls with no name, clickable non-buttons, font sizes, low contrast, |
|                      | `transition: all`, the focus ring, the open dialog's focus                                |
| `spacing_measure.js` | every padding, gap and margin off the 4-step grid, with where it occurs                   |
| `system_measure.js`  | the distinct text colours, backgrounds, radii (with the element's height), shadows,       |
|                      | weights                                                                                   |

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
