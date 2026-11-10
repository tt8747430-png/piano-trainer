---
name: phone-from-laptop
description: Use in piano-trainer when a screen exists at one size and the other is missing or drifting: derive the phone board from the laptop board (or check the pair) on the canvas, so it reads as designed for a phone and keeps every feature.
---

# Phone from laptop

Create the phone board from a laptop board. The mobile version must feel natively designed for mobile — not a shrunk desktop. Preserve the brand, content, and visual language exactly; transform only structure, sizing, and interaction patterns.

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

- **The owner's rule is the other way round too:** "the same features on a phone and a laptop". Nothing on the
  laptop board is missing on the phone; it moves into a sheet, a drawer or a scroll.
- **The patterns below for marketing pages** (hero, pricing, logo bars, footer) are kept for a landing page; the
  app's screens use the bar, the tab bar, sheets and drawers the canvas already has.

## Canvas setup

- Target width: **402px**, the phone frame every board uses (the app is tested at 393). If the owner names another width, use theirs.
- Height: auto — grows with content. Never crop or hide content to fit an arbitrary height.
- Name the boards as the canvas does: `<Name>` for the phone, `<Name>Laptop` for the laptop, both listed in `index.py`.
- One generator writes both boards from the same parts and the same state, so they cannot drift.
- Never change the laptop board while deriving the phone one.

## Step 1 — Read and map the laptop board

Before creating anything:

1. Read the laptop board's generator and a whole-screen screenshot of it: sections, their order, grids, components, text styles, spacing values.
2. Identify the section types present (hero, nav, feature grid, pricing, testimonials, gallery, footer, forms, tables, etc.).
3. Note the spacing system (base unit, section paddings) and type scale — mobile values will be derived from these, not invented.
4. If what is named is a single control rather than a screen, say so and stop.

## Step 2 — Global transformation rules

### Layout
- Multi-column grids stack into a single column. Column order = desktop reading order (left→right, top→bottom).
- Content area: 402 − 2×16px side margins = **370px**. Side padding 16px, as every phone board uses.
- Section vertical padding: reduce desktop values by ~40–50% (e.g. 120px → 64px, 96px → 56px, 64px → 40px). Keep the rhythm proportional — bigger desktop gaps stay bigger on mobile.
- Gaps between stacked items: 16–24px, taken from the desktop spacing scale.
- Every stacked section is a flex column with a `gap`, so the board survives longer text.

### Typography
- Scale down headings ~30–40%, keep body nearly intact:
  - Desktop 64–72 → 36–40
  - Desktop 48–56 → 30–32
  - Desktop 32–40 → 24–28
  - Desktop 24 → 20
  - Body 16–18 → keep 16 (never below 15 for body)
  - Captions/labels → keep, minimum 12
- Line-height: headings 1.1–1.2, body 1.5–1.6.
- Shorten nothing: keep all copy. If a heading wraps to 4+ lines, flag it in the final report rather than rewriting.
- Left-align long text blocks even if desktop centers them; centered is fine for short heroes and section titles.

### Touch targets
- Every interactive element: minimum **44×44px** hit area.
- Buttons: full-width (350px) for primary CTAs in stacked sections; height 48–56px. Secondary buttons may stay intrinsic width.
- Adjacent tap targets: minimum 8px between them.
- Links inside body text: keep, but ensure surrounding line-height gives enough tap room.

### Imagery
- Full-bleed images may extend edge-to-edge (390px); contained images stay within the 350px content area.
- Preserve aspect ratios; switch wide panoramic crops (e.g., 21:9 hero) to 4:3 or 1:1 crops focused on the subject.
- Decorative background elements that would crowd a small screen: scale down or remove, and list every removal in the final report.

## Step 3 — Section-specific patterns

### Navigation
- Desktop horizontal nav → top bar 64px tall: logo left, hamburger icon right.
- The opened menu is a state of the same board, reachable by tapping, never a second board: full-screen or dropdown with the nav links stacked, 56px row height each.
- If the desktop nav has a prominent CTA (e.g. "Get started"), keep it visible in the top bar next to the hamburger if space allows, otherwise first item in the opened menu.
- If the page is app-like (dashboard) with 3–5 primary destinations → use a bottom tab bar (56px, icons + labels) instead of a hamburger.

### Hero
- Stack: heading → subheading → CTA(s) → hero image. If the image is the message (product shot), image may go first.
- Two side-by-side CTAs → stack vertically, primary on top, 12px gap.

### Feature grids (3–4 columns)
- Stack into one column, OR use a horizontal swipe carousel if there are 4+ visually rich cards. Default: stack. Use carousel only for card galleries, logos, and testimonials.
- Card internal padding: reduce ~25% from desktop.

### Logo bars / social proof
- Wrap into 2 rows, or single-row horizontal scroll. Shrink logos to max height 28–32px.

### Pricing tables
- Stack plans vertically, recommended plan first (not middle, as on desktop).
- If plans share a long feature-comparison table → each plan card lists its own features; drop the comparison matrix and note it in the report.

### Data tables
- Tables wider than 350px: transform each row into a card (label: value pairs stacked), or make the table horizontally scrollable with the first column pinned. Default: cards for ≤6 columns of simple data, scroll for dense numeric tables.

### Forms
- All fields full-width, stacked. Field height 48–56px. Labels above fields, never placeholder-only.
- Multi-column form rows (First name | Last name) → stacked, unless both fields are short (ZIP | City may stay paired).

### Footer
- Columns stack; link groups become either stacked lists or accordions if there are 4+ groups. Legal line and social icons last.

### Sticky elements
- Desktop sticky sidebar CTAs → sticky bottom bar on mobile (full-width button, 16px padding, above safe area).

## Step 4 — Content prioritization

Mobile users scroll, but attention decays. Without deleting content:
- Keep the desktop section order unless a section is purely decorative filler before the primary CTA — in that case it may move below the CTA section. Report any reordering.
- Collapse long FAQ lists into accordions (first item may be expanded).
- Long testimonial walls → carousel of one testimonial per view.

## Step 5 — Finalize and report

1. Verify: no horizontal overflow anywhere, all text legible (body ≥15px), all touch targets ≥44px (`layout_check.js` returns `["layout ok"]` in every state).
2. Deliver both boards on the same canvas, every sheet, menu and state reachable by tapping.
3. Report in chat:
   - Sections transformed and which pattern was used for each
   - Anything removed, cropped, reordered, or converted (e.g., "comparison matrix → per-card feature lists")
   - Flags for human review (headings wrapping 4+ lines, dense tables, ambiguous nav CTA placement)

## Guardrails

- Never invent new content, copy, or imagery — everything comes from the laptop board and the rulings.
- Never restyle: colors, fonts, radius, shadows stay identical to the desktop system.
- Use existing components and their mobile variants from the connected library if they exist; only detach or rebuild when no variant fits, and report each case.
- Where the kit has both forms of a thing (`POPOVER` on a laptop, `BSHEET` on a phone), use the pair; never rebuild one by hand.
