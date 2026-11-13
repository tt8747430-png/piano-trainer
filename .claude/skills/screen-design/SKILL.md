---
name: screen-design
description: Use in piano-trainer when a whole screen or flow is designed or reworked on the canvas: the Screen Contract, discovery of the product's own design language, the state matrix, building it as a working board, and the final QA before it is called done.
---

# Screen design

Create or update **real, working, production-oriented screens on the Design canvas**, phone and laptop. The output must look and behave as if it belongs to the existing product — not like a generic template, a Dribbble concept, or a visual imitation of Apple apps.

This skill governs product reasoning and design quality. How a canvas is built, checked and published is `redesigning-a-screen`.

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

- **Source of truth here:** the owner's latest words and screenshots, then the rulings, then the app's code, then
  the reference apps in `owner-way`'s table, then Apple's guidelines for behaviour.
- **No app code while the design is open:** the canvas until the owner says "ok", then the port, one item a commit; in a
  loop or autonomous mode the canvas first, then the port at once, no "ok" awaited.

## 0. Required companion skills

Before changing a canvas:

1. `owner-way`, and the area's section of its feedback log.
2. `redesigning-a-screen`: the loop every canvas turn follows, and the polish pass before each publish.
3. `artifact-design` before the first publish of a new canvas (Artifact `quickstart`, intent `design`).
4. The runtime checks in `.scratch/r39/canvas/checks/` for visual and structural validation: the layout check in
   every changed state, then whole-screen screenshots at both sizes.
5. The detail skills as the work calls for them: `product-designer`, `state-expander`, `ux-writing`,
   `spacing-audit`, `design-consistency`, `interface-review`.

Write to the owner in their language, answer first. When the owner asks for design work on an area that has a
canvas, change the canvas rather than returning only written recommendations. If the area has no canvas yet, write
the Screen Contract and the discovery plan, then make one.

The app is a web app installed on a phone, so Apple's guidelines are the baseline for how it behaves under the
thumb (targets, sheets, safe areas, large text), never a look to copy. Check a platform rule that may have changed
against Apple's current documentation.

## 1. Core operating principle

Treat the product's design system as the **visual source of truth** and Apple HIG as the **platform behavior, usability, and accessibility baseline**.

Do not make the interface “more Apple-like” by copying Apple aesthetics, introducing glass, gradients, large titles, floating controls, SF Symbols, or native components that the product does not otherwise use. Apply Apple guidance through familiar behavior, hierarchy, touch ergonomics, accessibility, navigation, content clarity, and system integration.

The owner's rulings stand over this paragraph and §7's materials rule: the grouped glass toolbar, the floating bar and
the scroll-edge blur are this product's own language (`owner-way` feedback log: v20, v25, v54, canvas 116).

### Source-of-truth priority

Use this order when making decisions:

1. Explicit user request and product goal.
2. The area's rulings, the kit's helpers and constants, and `DESIGN.md`'s tokens.
3. Current production behavior, product requirements, and source code when available.
4. The closest approved or shipped screens in the same product.
5. Apple Human Interface Guidelines for the target platform and supported OS versions.
6. General usability heuristics and design judgment.

An accessibility, safety, or platform-behavior problem must never be copied silently. Preserve the product language where possible, identify the conflict, and propose the smallest compatible correction.

## 2. Non-negotiable rules

1. **Inspect before designing.** Do not mutate the canvas until the discovery checklist is complete.
2. **Reuse before creating.** Prefer the kit's helpers and constants, the canvas's icons, and compositions the area already uses.
3. **Never copy a kit helper's markup** to change it in one place; change the helper, or add one.
4. **Never hardcode a value** when an appropriate design-system token or style exists.
5. **Never overwrite an approved screen** with an experiment: a reaction changes the area's boards in place (D1); an alternative board only for a question the owner settles by eye.
6. **Never introduce a new visual pattern** just because it appears more modern or attractive.
7. **Never stop at the happy path.** Design all relevant states and edge cases.
8. **Never use rasterized or AI-generated UI** for buttons, controls, cards, navigation, icons, or typography. Core UI is real markup the owner can tap, never a picture of a control.
9. **Never fabricate product content or behavior** when a reliable source exists in the file, requirements, or code.
10. **Never present an unvalidated result as final.** Every final screen requires visual, structural, interaction, accessibility, content, and implementation QA.

## 3. Phase A — Understand the task

Before touching the canvas, form a concise **Screen Contract**.

Record:

- Product and feature.
- Target platform: iPhone, iPad if relevant, supported OS range if known.
- Screen or flow name.
- User's job to be done.
- Entry point and exit points.
- Primary user action.
- Secondary actions.
- Information the user needs before acting.
- Data or content displayed.
- Navigation model.
- Whether the screen scrolls.
- Whether the keyboard, media, camera, microphone, permissions, payments, or other system UI is involved.
- Required states and edge cases.
- Known technical or business constraints.
- What is explicitly in scope and out of scope.

Do not force a clarification for minor ambiguity. Infer from product context, neighboring screens, and established patterns, then list the assumption. Ask only when a genuine decision fork would materially change the user flow, data model, or irreversible behavior.

The list above is the template; write it as the first lines of the item's spec.

## 4. Phase B — Discover the product design language

Complete all items below before creating or modifying nodes.

### B1. Inspect the canvas and the code

Identify:

- The area's canvas, its boards (`index.py`), and the board in hand.
- Its generator and the kit it uses (`.scratch/<round>/canvas/`).
- The app's files for the same screen (`pages/`, `widgets/`, `features/`), with every control's exact label, values
  and default.
- The phone and laptop widths every board uses (402 and 1710).
- The naming the generators use for boards, parts and state keys.
- Where the rulings end and an open question begins (the spec).

### B2. Inspect the design system

Map the available:

- The kit's constants, and Day and Night values where the canvas draws both.
- Primitive and semantic color tokens.
- Spacing, sizing, radius, opacity, timing, and motion tokens.
- Text styles and font families.
- Effect styles.
- Grid and layout conventions.
- The kit's helpers, and the parts this area's generator defines.
- Each helper's arguments: what it can vary and what it fixes.
- Icon source and icon sizing rules.
- Light and dark appearance modes.
- Accessibility-specific modes or tokens if present.
- The app's kit in `shared/ui`, for what the port will use.

For each needed component, use this discovery order:

1. The same thing already drawn on a board of this area.
2. A part this area's generator already defines.
3. The shared kit (`r41_kit.py`, `calm_kit.py`).
4. The app's own component in `shared/ui`, drawn as it looks there.
5. A platform control only where the product already uses one.
6. A new local proposed component as the final option.

### B3. Inspect reference screens

Inspect at least the closest **three** approved screens when available. Rank references by:

1. Same flow or feature.
2. Same interaction pattern.
3. Same content structure.
4. Similar information density.
5. Most recent approved implementation.

Capture screenshots of the whole reference screens and close views of important components.

Extract a **Design DNA Map**:

- Screen background and surface hierarchy.
- Safe-area behavior.
- Horizontal margins and section spacing.
- Vertical rhythm.
- Typography hierarchy.
- Content density.
- Corner-radius language.
- Border, divider, shadow, blur, and material usage.
- Icon family, optical size, stroke/fill style, and placement.
- Button hierarchy and placement.
- Navigation pattern.
- Card and list patterns.
- Form patterns.
- Sheet, alert, menu, and confirmation patterns.
- Loading, empty, error, success, offline, and disabled states.
- Motion and haptic conventions when visible in prototypes or code.
- Voice and tone of interface copy.

Record the source of every important decision: helper, constant, ruling, reference screen, code location, or guideline.

### B4. Resolve conflicts

When the design system, source code, and existing screens disagree:

- Prefer the currently shipped or explicitly approved behavior.
- Prefer semantic tokens over copied visual values.
- Prefer the newer established pattern over a one-off legacy screen.
- Do not silently mix competing patterns.
- Record the conflict and chosen resolution in the decision ledger.

### Discovery exit criteria

Do not draw until all of the following are known or explicitly marked unavailable:

- Canonical screen width.
- Product font and text styles.
- Semantic color and spacing sources.
- Closest reference screens.
- Required components and their source.
- Navigation pattern.
- Primary action hierarchy.
- Relevant state matrix.
- Working page or safe placement for the new design.

The checklist is the list above; nothing is drawn while a line of it is unknown and unmarked.

## 5. Phase C — Model the experience before drawing

Translate the Screen Contract into a screen model.

### C1. Information hierarchy

Define, in order:

1. What the user must notice first.
2. What they need to understand.
3. What decision or action follows.
4. What supporting details can be deferred.
5. What is optional, advanced, or secondary.

Use progressive disclosure. Do not place every possible option on the first screen.

### C2. Action hierarchy

For every action, classify it as:

- Primary.
- Secondary.
- Tertiary or inline.
- Destructive.
- Navigation.
- System or contextual action.

A single decision context should normally have one visually dominant primary action. Do not invent a primary CTA when the screen is primarily for reading, browsing, monitoring, or passive progress.

### C3. State matrix

Mark each state as Required, Not applicable, or Deferred with a reason:

- Default.
- Initial loading.
- Incremental loading or pagination.
- Empty.
- Error with recovery.
- Offline or poor connection.
- Permission not requested.
- Permission denied or restricted.
- Disabled or unavailable action.
- Validation error.
- Partial completion.
- Success or confirmation.
- Destructive confirmation.
- Long content and long localized strings.
- Large Dynamic Type.
- Dark appearance.
- Keyboard visible.
- Smallest supported device.
- Largest supported device.
- Reduced motion or reduced transparency where relevant.

Do not create irrelevant states merely to fill a checklist, but never omit a state that can realistically block the task.

## 6. Phase D — Design the screen on the canvas

### D1. Safe placement

- A reaction changes the area's existing boards and publishes to the same canvas: the owner follows one link.
- A question the owner must settle by eye is drawn as alternatives side by side on that canvas, clearly named, and
  the one not chosen is removed in the turn that settles it.
- A board a ruling approved is never overwritten by an experiment; the experiment gets its own board until chosen.
- Name boards as the canvas does: `<Name>` and `<Name>Laptop`.

### D2. Build the frame first

Build the screen's frame before its sections.

- The phone and laptop frames come from the kit; the screen inside is a flex column: bar, content that scrolls,
  dock.
- Flex and `gap` for everything in the flow; absolute positioning only for true overlays (sheets, menus, toasts, a
  floating bar, labels over the 3D keys).
- Build one section, rebuild, run the layout check and look at the screenshot before starting the next.
- One generator writes both sizes from the same parts and the same state.

### D3. Use the kit correctly

- Call the kit's helpers (`GROUP`, `BSHEET`, `POPOVER`, `SEGC`, `TOGGLE`) rather than writing their markup again.
- Colours, the line, the shadow and the fonts come from the kit's constants, never a new literal beside them.
- A canvas may leave the app's design system where the owner asked for the ideal design; say where it does, so the
  port can map each value to a token in `DESIGN.md`.
- Icons are inline SVGs in `currentColor`, one stroke weight: Lucide's shape for anything Lucide has, the app's own
  glyph (`shared/ui/icons`) only where it has none, the same icon for the same thing on every board
  (`owner-way/references/ux-principles.md`); never an icon font or an emoji.
- A pattern used twice is a helper; a new helper that other areas need goes in the kit, and that is said in the
  report, since it changes every board built from it.
- Real songs, real chord names and the app's exact labels where the eye goes.

### D4. Content and data

- Use real supplied copy or realistic product copy, never Lorem Ipsum.
- Preserve the product's voice and terminology.
- Use realistic data lengths, values, names, dates, prices, and error messages.
- Include at least one localization stress case when text expansion could break the layout.
- Do not rely on placeholder text as the only field label.
- Do not truncate essential information merely to protect the layout.

### D5. Make the key behaviour work

A board is a working page, not a picture. Make real:

- The primary action (it sounds, it plays).
- Back, Done, cancel and dismissal, by tap and by Escape.
- Every sheet, drawer, menu and popover the screen has, opened from its own control.
- Selection, and what it changes on the screen.
- A loss with its Undo toast.
- Anything whose layout changes with state (a second hand, a long staff, a hidden piano).

Do not animate decoration. Make work what removes a question for the owner or for the port.

## 7. Interaction and component rules (phone first)

The following are the defaults, for the installed app on a phone; on a laptop the same rules hold with a pointer and a keyboard.

### Buttons and actions

- Use a hit region of at least 44 × 44 pt for interactive controls.
- Use specific, verb-led labels: `Save changes`, `Continue`, `Delete account`, not vague labels like `OK` when the action can be named.
- Keep short button labels free of unnecessary punctuation.
- Preserve button dimensions during loading to avoid layout jumps.
- Prevent repeated submission while an action is in progress.
- Separate destructive actions from safe primary actions and label them explicitly.
- Confirm irreversible or high-impact destructive actions.
- Use icon-only buttons only for familiar actions or constrained toolbars; document the accessibility label.
- Do not use a disabled state without making the reason understandable.

### Navigation and modality

- Use tab bars for persistent top-level destinations, not task steps.
- Use hierarchical push navigation for drill-down content.
- Use sheets for focused secondary tasks that benefit from retaining context.
- Use full-screen presentation for immersive or substantial multi-step tasks.
- Use alerts for brief, important, blocking decisions.
- Use an action sheet or menu for choices related to an intentional action instead of overloading an alert.
- Avoid stacking modals and avoid trapping the user without a visible dismissal path.
- Preserve state when the user returns from a secondary view.

### Inputs and selection

- Use toggles for immediate binary state changes.
- Do not use a toggle when the change requires a separate confirmation step.
- Use segmented controls for a small set of peer choices.
- Use menus, pickers, or selection lists for longer option sets.
- Use the correct keyboard and content type for the expected input.
- Keep field labels visible when entered content replaces the placeholder.
- Validate close to the field and provide a recovery path.
- Keep controls close to the content they affect.

### Typography and content

- Use existing product text styles; do not create ad hoc sizes to make a layout fit.
- Support Dynamic Type behavior and verify the screen at large accessibility sizes.
- Maintain a clear hierarchy with the fewest necessary type levels.
- Prefer concise wording in the musician's terms; a musician's term always wins over a plain paraphrase (`ux-writing`,
  owner canvas 158).
- Use sentence case unless the product's established content system specifies otherwise.
- Avoid using color alone, font weight alone, or position alone to communicate a critical state.

### Color, materials, and icons

- Use semantic product colors and appearance modes.
- Verify contrast on the actual background and in every supported appearance.
- Do not introduce glass, blur, gradient, shadow, or translucency unless the product already uses it or the task explicitly requires it (the owner's glass bars are the product's: §1).
- Preserve image aspect ratios.
- Prefer existing icons; otherwise draw one inline SVG in the canvas's stroke and size.
- Match optical weight and size to neighboring icons, not merely the nominal bounding box.

### Motion and haptics

- Use motion to explain hierarchy, continuity, cause, and result.
- Avoid decorative motion that delays task completion.
- Provide a reduced-motion interpretation for essential transitions.
- Use haptics only for meaningful confirmation, warning, boundary, or result feedback when consistent with the product.
- Do not trigger haptics for every ordinary tap.

## 8. Accessibility requirements

Every final design must include an accessibility pass.

Verify:

- Interactive targets are at least 44 × 44 pt.
- Adjacent controls have enough separation to avoid accidental activation.
- Text and meaningful icons remain legible at large Dynamic Type sizes.
- Layout reflows instead of clipping or overlapping.
- Color is not the only carrier of meaning.
- Text and controls have sufficient contrast against their actual backgrounds.
- VoiceOver reading order is logical.
- Icon-only controls have explicit accessibility labels.
- Grouped information is represented as a meaningful accessibility unit where appropriate.
- State changes and errors can be announced.
- Images that convey meaning have an accessibility description; decorative imagery is ignored.
- Reduce Motion, Increase Contrast, and Reduce Transparency are considered where relevant.
- The design remains understandable without relying exclusively on audio, haptics, animation, or gesture discovery.

Accessibility problems are not polish issues. Treat critical issues as blockers.

## 9. Implementation feasibility

Design for implementation, not only presentation.

- Prefer patterns the app's kit already has (the shadcn primitives in `shared/ui/primitives`), so the port is a mapping, not an invention.
- Use points and product tokens rather than arbitrary pixel measurements.
- Respect safe areas, keyboard avoidance, scrolling, content insets, and system gestures.
- Ensure the layout can handle live data and asynchronous updates.
- Avoid fixed-height text containers unless the content is guaranteed.
- Avoid impossible blur, masking, blend, or animation effects without an implementation note.
- Document custom behavior that differs from a native control.
- Keep component APIs coherent with existing design-system variants and properties.
- When code is available, compare the canvas's helper with the app's component and record mismatches in the port table.

## 10. Validation workflow

Validate incrementally and at the end.

### After each major section

1. Capture a screenshot.
2. Check text clipping, overlaps, spacing, alignment, and incorrect component variants.
3. Check font family and text style.
4. Check that colours and spacing come from the kit's constants and that helpers are called, not copied.
5. Fix targeted issues before building the next section.

### Final visual QA

Compare the new screen side-by-side with the closest reference screens.

Check:

- Does it clearly belong to the same product?
- Is hierarchy understandable in three seconds?
- Is the primary action appropriately dominant?
- Are margins, spacing rhythm, type scale, radii, surfaces, icons, and control density consistent?
- Is any decorative treatment new without justification?
- Are all states visually coherent?
- Is any placeholder, sample title, missing image, or temporary copy still present?

### Final structural QA

Check:

- `checks/layout_check.js` returns `["layout ok"]` in every changed state, at both sizes.
- Repeated patterns are helpers, and kit helpers are called, not copied.
- No literal colour, radius or shadow beside a kit constant that already holds it.
- Every control is a `button` or a link with an accessible name; a switch row is one control.
- Every sheet and menu opens, closes by Escape, and returns focus.
- No helper, state key or built board is left unused (`board-cleanup`).

### Final experience QA

Check:

- Entry and exit are clear.
- Back, close, cancel, retry, and destructive paths are defined.
- Loading, empty, error, offline, permission, and validation behavior is covered when relevant.
- The screen remains usable with the keyboard visible.
- Small and large supported devices are considered.
- Long text and localization do not break the layout.
- Accessibility requirements pass.
- The interaction can be implemented without hidden assumptions.

The three lists above are the final gate, with `redesigning-a-screen`'s polish pass.

## 11. Required final deliverables

When a canvas turn is complete, provide:

1. The boards published to the area's canvas, with the version number.
2. Every relevant state reachable on them.
3. The ruling in the area's spec, in the owner's words, with its sources.
4. A bullet in the feedback log and a line in the round's loop file (`.scratch/r39/plan/loop.md`).
5. The commit, staged by path, pushed.
6. A short report, answer first: what changed, the checks run, what was left and why, and the open questions
   numbered, each with a recommendation.

## 12. Completion criteria

The task is complete only when:

- The result is a working board built from the kit, not a flattened picture.
- The product design system is reused correctly.
- The design matches neighboring approved screens.
- Platform behavior follows current Apple guidance for the supported OS range.
- Relevant non-happy-path states exist.
- Accessibility has been checked.
- The layout survives realistic data, localization, and Dynamic Type stress.
- The design is feasible to implement.
- Screenshots and metadata have been reviewed after the final changes.
- No critical QA issue remains unresolved or unreported.
