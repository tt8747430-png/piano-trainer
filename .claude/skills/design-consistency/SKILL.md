---
name: design-consistency
description: Use in piano-trainer to find where a canvas board or an app screen breaks its own system (colours, type, spacing, radii, shadows, hand-copied kit parts), with the value measured and the value expected for each finding; before a port, or when the owner says parts of a screen do not match.
---

# Design consistency

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

- **Expected values that are settled here:** cards 14 round, as `DESIGN.md`; spacing on 4/8 steps with 2 inside segmented rows; one
  type scale per page; ink-tinted shadows; weights 400 to 700.
- **A fix in one area's post-process is itself a drifted copy.** Say so, and offer the kit.

## What this skill does

Analyse a canvas board, an app screen or a flow and answer one core question:

> Where does this design violate the existing design system?

The skill compares observed design values and component usage against the available design-system foundations and identifies inconsistencies that can reduce visual quality, maintainability, accessibility, and product coherence.

The analysis changes nothing; the fixes follow in the same turn (`owner-way`: fix what you notice), unless the owner
asked for an audit alone.

## Best used for

- SaaS products
- Web applications
- Mobile applications
- Design-system audits
- Product redesigns
- The canvas kit and the app's kit
- Component QA
- UI quality checks
- Design-to-development handoff
- Pre-development design reviews

## What it checks

### 1. Colors

Check for:

- Wrong colors
- Hardcoded color values
- Colours that match no kit constant
- Incorrect semantic color usage
- Near-duplicate colors
- Inconsistent background colors
- Inconsistent text colors
- Inconsistent border colors
- Incorrect brand colors

For every finding, identify the observed value and the expected system value when available.

### 2. Typography

Check:

- Font family
- Font weight
- Font size
- Line height
- Letter spacing
- Text styles
- Heading hierarchy
- Body styles
- Label styles
- Caption styles

Flag typography that:

- Uses hardcoded values instead of existing styles
- Uses the wrong text style
- Uses an inconsistent font
- Uses an unsupported weight
- Breaks the established hierarchy

### 3. Spacing

Check:

- Padding
- Margin
- Gap
- Section spacing
- Component spacing
- Grid spacing
- Vertical rhythm
- Horizontal rhythm

Compare observed values against the existing spacing scale.

Flag:

- One-off spacing values
- Near-duplicate values
- Hardcoded spacing
- Values outside the established system
- Inconsistent spacing between equivalent components

### 4. Components

Check whether the board uses the kit's helpers, and the app screen the kit in `shared/ui`.

Identify:

- A helper rebuilt by hand (a sheet, a group, a segmented row written inline).
- The wrong helper for the job (a popover on a phone where every other choice is a bottom sheet).
- The same thing drawn two ways on one area.
- A local copy of a kit helper that has drifted from it.

Do not call a custom part wrong by itself. Say why the existing helper fits, and name it.

### 5. Drifted copies

The canvas has no instances to detach; its equivalent is a copy of a kit helper that no longer matches the kit, or
a value overridden after the build (a post-process that rewrites one board's radius or spacing).

Report:

- The part and the board.
- The kit helper it copies.
- What differs now.
- Why that is a problem (the next kit change will miss it; two boards of one area disagree).
- Whether to move the fix into the kit: ours to decide (`owner-way`); do it, and name every board it changes.

### 6. Hardcoded values

Identify visual values that should potentially use design-system foundations.

Check for hardcoded:

- Colors
- Typography
- Spacing
- Border radius
- Shadows
- Dimensions
- Other reusable visual properties

Do not flag every hardcoded value automatically. Flag values when a kit constant, a token or a consistent habit of the board already holds the value.

### 7. Border radius

Check:

- Corner radius
- Nested radius relationships
- Component radius
- Card radius
- Input radius
- Button radius
- Modal radius

Flag inconsistent radii when the same component family or semantic level uses different values without a clear reason.

### 8. Shadows

Check:

- Shadow type
- Offset
- Blur
- Spread
- Opacity
- Shadow color
- Elevation hierarchy

Flag:

- Custom shadows where system shadows exist
- Near-duplicate shadows
- Incorrect elevation
- Inconsistent shadow usage between equivalent components

## Analysis process

### Step 1 — Understand the system

There are two, and the report says which one each finding is against:

- **The canvas's own:** the kit's constants and helpers (`calm_kit.py`, `r41_kit.py`), and what the area's boards
  do consistently.
- **The app's:** `DESIGN.md`, the theme, the kit in `shared/ui`.

A canvas may leave the app's system on purpose (the owner asked for the ideal design). Then canvas against app is
"cannot verify" until the port maps each value to a token; never a violation.

### Step 2 — Inspect the target

Run `.scratch/r39/canvas/checks/system_measure.js` on the board at rest and with each sheet open. It returns the
distinct text colours, backgrounds, radii (each with the height of the element that carries it), shadows and
weights, with counts. Add `spacing_measure.js` for spacing and `review_measure.js` for font sizes. Read the
generator only to find where a measured value comes from.

### Step 3 — Compare against the system

For every relevant property, classify it as:

- Consistent
- Minor inconsistency
- Major violation
- Unknown / cannot verify

### Step 4 — Collect evidence

Every important finding should include:

- Affected element
- Observed value
- Expected value
- Source of expected value
- Reason for mismatch
- UX/UI impact
- Recommended action

Never invent expected values.

### Step 5 — Prioritize violations

Use:

**P0 — Critical**
- Product-wide system violation
- Major accessibility or brand issue
- Incorrect component behavior affecting important flows

**P1 — High**
- Frequently repeated inconsistency
- Incorrect component or token usage
- Significant visual-system deviation

**P2 — Medium**
- Local inconsistency
- One-off hardcoded value
- Moderate visual mismatch

**P3 — Low**
- Minor polish issue
- Small naming or visual deviation
- Low-impact cleanup

## Recommended output

Start with:

```text
Design System Consistency Report

Overall consistency: 86%

Critical violations: 0
High: 4
Medium: 9
Low: 6

Colors: 3 violations
Typography: 2 violations
Spacing: 5 violations
Components: 2 violations
Drifted copies: 1
Hardcoded values: 6
Radii: 1 violation
Shadows: 0 violations
```

Use actual findings instead of example numbers.

## Finding format

For each violation:

```text
### P1 — Wrong button color

Element:
Primary CTA / Checkout

Observed:
#7C3AED

Expected:
color/action/primary

Evidence:
Every other primary action on the area uses `ACCENT`.

Impact:
Creates visual inconsistency and may break theme or brand updates.

Recommendation:
Replace the literal with `ACCENT`.
```

## Consistency matrix

Provide a summary table:

| Category | Checks | Violations | Severity | Status |
|---|---:|---:|---|---|
| Colors | 24 | 3 | P1 | Review |
| Typography | 18 | 2 | P2 | Review |
| Spacing | 31 | 5 | P1 | Review |
| Components | 22 | 2 | P1 | Review |
| Drifted copies | 8 | 1 | P1 | Review |
| Hardcoded values | 42 | 6 | P2 | Review |
| Radius | 12 | 1 | P3 | Minor |
| Shadows | 9 | 0 | — | Consistent |

## Design-system health score

Calculate, only when there is a token source to weigh against (inspection rule 9):

**Consistency % = 1 - weighted violations / weighted checks**

Use the score only as a directional indicator.

Explain that the score reflects the analyzed scope and is not a universal measure of design quality.

## Inspection rules

1. Measure the named board first; the area's other boards only when asked.
2. Measure in the runtime; read the generator to trace a value, never to count from.
3. Look at a screenshot when the question is how two parts look side by side.
4. Compare against the kit's constants and helpers, then against the board's own habits.
5. Keep to the scope the owner named.
6. Separate what was measured from what is assumed.
7. Change nothing while measuring; fix after, in the same turn, unless the owner asked for an audit alone.
8. Never invent an expected value: when no token or habit fixes it, say so.
9. Give no percentage unless there is a token source to weigh against; an invented score misleads.

## Important constraint

The analysis comes first. Only when the owner asked for an audit alone, do not:

- Change colors
- Replace components
- Fold copies back into the kit
- Swap literals for constants
- Change typography
- Modify spacing
- Change radii
- Change shadows
- Rename parts

Otherwise every finding is fixed in the same turn; folding a copy into the kit or renaming a part is ours to decide,
said in the report.
