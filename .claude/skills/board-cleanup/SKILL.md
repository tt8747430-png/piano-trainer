---
name: board-cleanup
description: Use in piano-trainer when a canvas board's generator has grown hard to read (helpers nothing calls, states nothing sets, hand-copied kit parts, names that say nothing), or the owner asks to clean up or tidy a canvas without changing how it looks.
---

# Board cleanup

Clean up a board's generator (or the area's, when no board is named) so the next person reads it like
documentation, not chaos. On the canvas the "layers panel" is the generator's source and the markup it writes.

## On our canvas

This skill was written for Figma. In Piano Trainer it runs on the owner's Design canvas (Claude Design), inside the
loop `redesigning-a-screen` sets out; `owner-way` and `CLAUDE.md` still bind every change.

| Written for Figma        | Here                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| the file                 | the area's published canvas (its link is the first line of the area's spec)               |
| a frame                  | a board: `<Name>` for the phone, 402 wide; `<Name>Laptop` for the laptop, 1710 wide       |
| the selection            | the board the owner names or has open; with none, the area being worked on                |
| layers and auto layout   | the board's markup, written by its generator in `.scratch/<round>/canvas/` (flex, inline  |
|                          | styles)                                                                                   |
| components and instances | the kit's helpers (`GROUP`, `BSHEET`, `POPOVER`, `SEGC`, `TOGGLE`); in the app, the kit   |
|                          | in `shared/ui`                                                                            |
| variables and styles     | the kit's constants (`INK`, `SOFT`, `LINE`, `FILL`, `PAGE`, `SHEET`, `ACCENT`, `SHADOW`); |
|                          | in the app, `DESIGN.md` and the theme                                                     |
| inspecting a node        | run the board in the real runtime and measure it: `.scratch/r39/canvas/checks/`           |
| editing the file         | change the generator, rebuild, run the layout check, look at whole-screen screenshots at  |
|                          | both sizes, publish to the same canvas                                                    |

- **Read the rulings first** (the area's spec, "The rulings as they stand"). Nothing a ruling removed comes back.
- **What is found is fixed, the same turn** (`owner-way`: fix what you notice), as one turn of the loop: canvas,
  checks, publish, the ruling in the spec, the feedback log, the drawing, commit and push. Only when the owner asked
  for a review alone (a pasted skill with no words, `redesigning-a-screen`) does it change nothing.
- **A change to the kit or a generator is ours** (`owner-way`, Whose decision): make it, then say in the report which
  boards it changes.
- **Measure, then say.** Every finding cites a number from the runtime or a line of the generator.
- **The words are the owner's:** musician's terms, `avoid-words.test.ts`, every string in `en` and `ru` when ported.

## Step 1 — Audit

Read the generator and the built board. Count and report before changing anything:

- Parts with names that say nothing (`B2`, `X1`, `tmp`, a helper called `row3`).
- Parts built but shown nowhere: a helper no board calls, a sheet no state opens, a state key nothing sets.
- Empty wrappers: a `div` with one child and no style of its own.
- Hand-written copies of a kit helper (a sheet, a group, a segmented row rebuilt inline). Note them; do not fix them
  in this pass.
- Elements placed far outside their parent, or absolutely positioned where the flow would do.
- Controls with no accessible name, and regions with no `aria-label` where a screen reader needs one.
- Boards built into `practice/project/` that `index.py` no longer lists.

Show the owner this summary and proceed.

## Step 2 — Rename by role

Rename every part that says nothing, by what it is on the screen:

- Text → its content: `FINGLINE` for "Right hand 1 2 3 5", not `P2`.
- Buttons → their action: `PLAYSPLIT`, `VOICEBTN`.
- Icons → `PLUSI`, `CHEV_R`: the glyph, then `I`.
- Containers → their role: `STAFFCARD`, `STAFFHEAD`, `DOCK`, `B_PIANO` for a sheet's body.
- State keys → the thing they hold: `kbView`, `keyLabel`, never `flag2`.

Rules:

- Python parts in capitals, state keys in camelCase, as the generators already do.
- Never rename a kit helper or a part that already has a name with a meaning.
- Names in English.

## Step 3 — Structural cleanup

- Delete helpers and state keys nothing uses, and built boards the index no longer lists.
- Delete wrappers that hold one child and carry no style.
- Move a stray absolutely placed element back into the flow of its nearest parent.
- Order the generator top to bottom as the screen reads: bar, picture, name, card, rows, dock, then layers.
- Leave one comment over a part only where it records a ruling or a reason the code cannot show.

Do NOT:

- Delete a state or a sheet that looks unused without listing it first and asking: it may be a ruling's alternate.
- Bring back anything listed under the feedback log's "Never" lines while tidying.
- Change anything the owner can see: position, size, colour, words. The board must build to the same picture; prove
  it by comparing a screenshot before and after at both sizes.
- Rewrite the shared kit from inside one area's cleanup.

## Step 4 — Report

Finish with a short before and after:

- X parts renamed.
- X unused helpers, keys or boards removed.
- X strays moved back into the flow.
- Anything skipped and why (a state left untouched until the owner confirms).
- The screenshots compared, and that the layout check still returns `["layout ok"]`.
