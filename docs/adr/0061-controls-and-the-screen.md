# ADR 0061 — Controls: chosen in sight, one action at the thumb, explained in a popover, the same at every size

- **Status:** accepted · **Date:** 2026-09-27 · consolidated 2026-10-27

## Context

The owner found rows of chips cluttered ("dropdowns better than chips"; "the best UI, not cluttered, like the Apple
design guidelines"), then lists of words hard to read ("more visuals, less text, more icons"), actions scattered
through a page, lines of explanation under every control, and a phone that showed other controls than a laptop.
Apple's Human Interface Guidelines and the owner's reference apps settled each.

## Decision

- **The Choosing Rule.** Five or fewer short choices are a segmented control. More, or longer names, are a pop-up
  button that shows its label and its value (`Dropdown`); several of many, a pop-up that checks several
  (`MultiDropdown`); a few, all in sight, `ToggleChips`. On or off is a switch, or a `ToggleTile` where several sit
  together. A choice that has a picture is a tile wearing it (`PictureTiles`): a layout, a view, a swing feel, a
  sign. A note is chosen as written (`NoteChoice`), a key by its tonic then Major · Minor (`KeyChoice`), an inversion
  as its noteheads. Settings changed less often are a sheet on a phone and a popover on a laptop. Views of one thing
  are tabs that are links (`NavTabs`).
- **A row that chooses is never a row that leaves.** `RowLink` is only a link; `RowButton` opens a sheet over its
  page.
- **One action at the thumb.** A screen's job floats in the thumb's reach (`FloatingActions` in the shell's one
  `FloatingHost`): its main action a 56px round `Fab`, the rest in a `SpeedDial`, all in one row along the foot, at
  its left, middle or right as `floating.place` says, each its icon alone unless `floating.labels` asks for names. A
  tap on the page's free room folds them away until the next. The full-screen routes (the Player, the editor, the
  Check) have no host: their bars stand in flow (ADR 0115).
- **Explanations in a popover.** No line of explanation stands under a control. Its name carries an ⓘ (`InfoTip`)
  that opens it; a greyed control says why in its tooltip; a term's meaning is its key's tooltip. No sentence repeats
  what a label, an icon or the layout already says.
- **The same at every size.** A control has the same name and does the same thing on a phone and a laptop. A size
  changes where it stands, never what it is or says. An icon button is named by its tooltip and its accessible name.
- **Secondary sections fold** from their headings (`FoldSection` over `FoldBody`, sliding, inert while folded); what
  is folded is saved by section id (`foldedSections`) and stays folded on every visit.
- **The screen's bar** (`ScreenHeader`) is a child of the page's root, a page's tabs its second row; it hides while
  reading down and comes back on a scroll up. `src/app/screen-bar.test.tsx` holds every screen to it.
- **The shell takes the width it is given.** The sidebar collapses to its icons (saved), the gutter grows with the
  width, and a list is a grid of row cards (`grid-cards`), as many columns as fit. A reading page is one column in
  the middle.
- **A phone's keyboard:** a sheet stands on it (`VirtualKeyboardProvider`); `keyboard-viewport.ts` publishes the room
  left, and while typing the tab bar, the floating actions and the toasts step aside.
- **Toasts:** one at a time, the new one replacing the last; Undo in it puts back exactly what was done; gone after
  five seconds or on Undo.
- **Basics:** 44px targets; one focus ring (a 3px outline 2px off the control, inset inside a scroller); reduced
  motion honoured: what slides or morphs changes at once.

## Consequences

A new option has one obvious form by this rule. A test reaches a folded action by opening its dial first.

## History

- 0012 — Four places, choices as pop-up buttons and segments: the Choosing Rule (2026-09-27).
- 0029 — Pictures in the Choosing Rule, one focus ring, the shell taking its width (2026-10-05).
- 0055 — A page's actions float; secondary sections fold (2026-10-16).
- 0057, 0058, 0059 — The speed dial's small icons; floating buttons where the learner says; one row of one size
  (2026-10-16).
- 0061 — A song's page, the Player and the editor float their actions (2026-10-19); the full-screen routes' bars are
  ADR 0115's now.
- 0094, 0096 — The same at every size; explanations in a popover (2026-10-24).
- 0106 — The phone's keyboard and one toast at a time (2026-10-26).
