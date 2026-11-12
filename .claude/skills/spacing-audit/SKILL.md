---
name: spacing-audit
description: Use in piano-trainer to check a canvas board's or a screen's padding, gaps and margins against the 4/8 scale, list every off-grid value with its nearest step, and snap them, the list in the report; when spacing looks uneven or the owner mentions weird paddings.
---

# Spacing Audit

Check a layout against a 4/8pt spacing scale, report every value that is off the grid, and snap it to the nearest correct step. The goal is consistent, predictable rhythm that is easy to hand off and maintain.

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

- **Not ours to snap:** the browser's default button padding (1px 6px), the phone frame's status bar, and the 2px
  inside a segmented row (the hairline between segments, concentric with their corners).
- **After snapping, re-check the first screen:** every gap grew or shrank, so shoot the phone board in its tallest
  state (both hands) and confirm nothing slid behind the Play bar.

## The scale

Base unit is 8. Use 4 only as a half-step for tight, component-internal spacing.

Allowed values: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96.

- 8, 16, 24, 32, 48, 64: structural spacing (section gaps, card padding, layout margins).
- 4, 12, 20: fine spacing inside a component (icon-to-label, chip padding, tight stacks).
- Anything not a multiple of 4 is off-grid and should be flagged.
- A multiple of 4 that is not a multiple of 8 at the layout level (e.g. section gap of 20 or 28) should be flagged as "consider 8pt step" but is not a hard error.

## What to check

Measure the padding, gap and margin of every element on the board:
- Padding inside containers and controls (top, right, bottom, left).
- Item spacing / gap between children.
- Gaps between sections and between grouped blocks.
- Margins around content within a container.

## How to audit

1. Run `.scratch/r39/canvas/checks/spacing_measure.js` on the board at rest and with each sheet open; it returns every value off the 4-step grid and where it occurs.
2. For each spacing value, compare it against the allowed scale.
3. For each off-grid value, choose the nearest allowed step. When exactly between two steps, round to the one closer to the surrounding rhythm of that group.
4. Prefer consistency within a group over per-element correctness. If three cards use 14, 16, 16, align all three to 16.

## Rules

- Do not change layout structure, sizing behavior (hug/fill), content, or styling. Only adjust spacing values.
- Preserve intentional exceptions and do not flag them: 1px borders and hairlines, optical alignment offsets, values driven by the content's size, and spacing that comes from a kit constant.
- If the value comes from the shared kit, fix it there (ours to decide, `owner-way`) and say which boards it changes.
- Round icon-to-label and other fine gaps to 4 or 8, not to larger steps.
- When a whole group is uniformly off-grid on purpose (e.g. a deliberate 6pt system), decide whether it is deliberate, change it or keep it, and say which in the report.

## Output

1. Write the audit summary first, before changing anything:
   - Total elements checked.
   - A before / after list of every off-grid value, grouped by board and part, in the form `Card padding: 14 -> 16`.
   - Any values you left untouched, with the reason (token, hairline, optical).
2. Apply the fixes in the same turn; the summary goes in the report, never a wait for an answer.
3. End with a one-line rhythm note: the dominant step the layout now uses (e.g. "layout now on an 8pt rhythm, fine spacing on 4pt").

## Do not

- Do not resize elements or reflow content to hit a number.
- Do not invent a new scale. Stick to the 4/8pt steps above.
- Do not touch corner radius, stroke, or type unless the user explicitly asks.
