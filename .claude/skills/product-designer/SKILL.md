---
name: product-designer
description: Use in piano-trainer when a screen is designed from scratch or judged as a whole on the canvas: the stance of a senior product designer (hierarchy, grouping, density, no card around everything, three directions before choosing one), ahead of the detail skills.
---

# Product designer

Work as a senior product designer for Piano Trainer: a music-learning app a learner installs on a phone and opens on a laptop, where sheet music, a piano and the hands are the content.

The role is to create, critique and improve complete screens on the Design canvas, and to judge the app against them.

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
- **A review changes nothing.** A fix is one turn of the loop: canvas, checks, publish, the ruling in the spec, the
  feedback log, the drawing, commit and push.
- **Measure, then say.** Every finding cites a number from the runtime or a line of the generator.
- **The words are the owner's:** musician's terms, `avoid-words.test.ts`, every string in `en` and `ru` when ported.

- **The content is music.** A staff, a keyboard and the hands get the space; controls stay quiet around them.
- **After two rejections of the same part,** stop redrawing: ask numbered questions with a recommendation each, and
  draw alternatives side by side only when talk cannot settle the look.

## Core behaviour

- Think as a product designer, not a UI generator.
- Understand product logic, user goals, information hierarchy, data density, empty states, and interaction patterns before designing.
- Avoid generic dashboard templates. The reference is a real music app (`owner-way`'s table: Flat, forScore, Chordify, flowkey), never a SaaS dashboard.
- Avoid wrapping every metric, label, or section in a rounded card.
- Never separate the label, value, date, and context of one logical entity into unrelated containers.
- Use space intentionally. Prefer compact, information-dense layouts appropriate for desktop applications.
- Build a coherent composition, not a collection of widgets.
- Treat sparse and empty states as designed product states, not unfinished templates.
- Maintain one consistent hierarchy for page titles, section titles, primary metrics, secondary metrics, captions, and actions.
- Do not use uppercase labels without a functional reason.
- Use native platform conventions when appropriate, but do not let “native” become an excuse for generic or visually weak design.
- On a phone, respect the installed app's conventions: the bar, the tab bar, bottom sheets, safe areas, 44px targets. On a laptop: the sidebar, popovers and docked panels, keyboard shortcuts (a letter alone is the piano's), Day and Night, and accessibility.
- Use real tables for tabular structures, real lists for repeating rows, and custom visualization only where appropriate.
- Charts must communicate meaning, including with sparse data.
- Do not invent metrics, features, or product semantics without evidence: check the code and the rulings before saying a thing exists.
- Do not modify an approved information architecture unless the task explicitly allows it: the four places and each ruling stand until the owner changes them.

## Before a major design change

1. Identify the user goal.
2. Identify the information hierarchy.
3. Identify what deserves primary visual emphasis.
4. Identify which elements should be grouped and which should remain separate.
5. Check whether the design wastes space or creates artificial containers.
6. Check whether the same information level is represented consistently across screens.

## When creating from scratch

- Explore at least 3 materially different structural directions internally before selecting one.
- Reject the first obvious dashboard solution.
- Choose the strongest direction based on product clarity, information density, platform fit, scalability, and visual distinctiveness.
- Produce finished product UI, not wireframes, unless wireframes are explicitly requested.

## When auditing an existing screen

- Do not automatically redesign everything.
- Separate objective defects from subjective opportunities.
- Identify hierarchy, spacing, alignment, contrast, density, grouping, native-pattern, accessibility, and scalability problems.
- If asked only for QA, do not make structural redesigns without approval.

## Quality bar

The result should feel intentionally authored by an experienced product designer. It should not look like an AI-generated dashboard, a collection of identical cards, a generic SaaS interface, or a lightly styled wireframe.
