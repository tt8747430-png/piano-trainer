# ADR 0061 — Controls: chosen in sight, one action at the thumb, explained in a popover, the same at every size

- **Status:** accepted · **Date:** 2026-09-27 · consolidated 2026-10-27

## Context

The owner found rows of chips cluttered ("dropdowns better than chips"; "the best UI, not cluttered, like the Apple
design guidelines"), then lists of words hard to read ("more visuals, less text, more icons"), actions scattered
through a page, lines of explanation under every control, and a phone that showed other controls than a laptop.
Apple's Human Interface Guidelines and the owner's reference apps settled each.

## Decision

- **The Choosing Rule** (round 29, A5; Flat's, the reference apps' and Apple's):

  | The choice                                                               | The control                                                                                |
  | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
  | One of many (12 keys, chord qualities, scales, voicings, a tempo's rung) | a menu: the value with ⌃⌄ (`Dropdown` in a settings row, `MenuPicker` in a row of pickers) |
  | Two to five, every one in sight                                          | a segmented control on the row (`Segmented`)                                               |
  | On or off                                                                | a switch (`SwitchRow`), or a `ToggleTile` where several sit together                       |
  | A number                                                                 | a stepper (`Stepper`)                                                                      |
  | Several of many                                                          | a pop-up that checks several (`MultiDropdown`), or a checklist sheet                       |
  | A few filters                                                            | chips (`ToggleChips`), and only there                                                      |

  No strip that hides its options behind ‹ ›, and no scrolling strip fades at its edges. A choice that has a picture
  is a tile wearing it (`PictureTiles`): a layout, a view, a swing feel, a sign; an inversion is its noteheads.
  Settings changed less often are a sheet on a phone and a popover on a laptop. Views of one thing are tabs that are
  links (`NavTabs`).

- **Four pickers for notes and keys** (`shared/ui/pickers`), one look: a value with ⌃⌄ opening a popover, a bottom
  sheet below 30rem.
  - `PitchPicker`: a pitch alone (Intervals' root, the melody note): an octave of twelve cells drawn as the piano's
    keys, each by its usual name (C D♭ D E♭ E F F♯ G A♭ A B♭ B, as MuseScore's and Flat's key lists name them).
  - `NotePicker`: a root as written (Chords', a scale's, a walk's, an exercise's): the same octave, a black key's cell
    split "C♯ | D♭", a tap on a half choosing that spelling; no E♯, F♭, B♯ or C♭.
  - `KeyPicker`: a key (a progression's, an example's, the Chord finder's): the circle of fifths, majors outside and
    relative minors inside, each wedge its name over its signature's count, the keys written two ways split (B / C♭,
    F♯ / G♭, C♯ / D♭ and G♯m / A♭m, D♯m / E♭m, A♯m / B♭m), a wedge taken then "Select: D♭ major". Scales and keys'
    Key view shows the same circle (`KeyCircle`) in place, a tap choosing at once. The score editor's key signature
    stays its grid of signs (`KeySignaturePicker`, ADR 0114).
  - `KeysChecklist`: several keys (a drill's Custom): the 15 signatures as rows "C major / A minor", Select all ·
    Clear all, Apply.
  - An explorer's choices stand in one row of them (`PickerRow`): `Root C ⌃⌄ · Quality Major ⌃⌄ · Voicing Close ⌃⌄`,
    wrapping on a narrow phone. A list of words in that row is a `MenuPicker`; an option the thing cannot take is
    left out of it.
- **A row that chooses is never a row that leaves.** `RowLink` is only a link; `RowButton` opens a sheet over its
  page.
- **One action at the thumb.** A screen's job floats in the thumb's reach (`FloatingActions` in the shell's one
  `FloatingHost`): its main action a 56px round `Fab`, the rest in a `SpeedDial`, all in one row in the middle of the
  foot, each its icon with its name as its tooltip (no setting: round 28). A
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
- **A phone's keyboard covers the screen; the page lifts the field.** One mechanism, Mindscape's (its ADR 0002),
  started once in `RootLayout`: `keyboard-viewport.ts` measures the keyboard from the visual viewport against the
  room anchored with no field focused (`--app-height`), and publishes how much it covers (`--kb-inset`), the range a
  page adds at its foot to lift its last field clear (`--kb-range`, through `pb-foot-*`) and `data-keyboard`. As a
  field takes the focus, the tallest keyboard measured on this phone (`pt-keyboard`) is reserved at once, so the
  field is lifted and the foot steps aside before the keyboard comes and iOS has nothing to pan; a laptop never
  measured one and moves nothing. `keyboard-reveal.ts` scrolls the box round the field (the page, or a screen's own
  scroller) so the field, its label and its error stand under the screen's bar and a gap above the keyboard. A sheet
  or a popover owns its own fields: it stands on the keyboard (`VirtualKeyboardProvider`), its buttons with it; the
  score editor's slim bar and the lesson editor's formatting toolbar stand on the keyboard's top edge
  (`useKeyboardTop`: the visual viewport's foot, followed on its scroll too, since iOS pans the page under a
  keyboard without resizing anything), and the editor's sheet scrolls the caret's line clear of both. While typing
  the tab bar, the floating actions and the toasts step aside (the page pads for them no more), and the screen's bar
  holds still.
- **Toasts:** one at a time, the new one replacing the last; Undo in it puts back exactly what was done; gone after
  five seconds or on Undo.
- **Basics:** 44px targets; one focus ring (a 3px outline 2px off the control, inset inside a scroller); reduced
  motion honoured: what slides or morphs changes at once.

- **A menu, a sheet, a pop-up or a page** (round 26): a ⋯ is a real menu (`ActionMenu` on shadcn's `dropdown-menu`)
  of commands that act at once, grouped with a label, the destructive last after a separator, a choice ticked; a
  sheet is one focused task; a pop-up button chooses one value, shown in words; a page holds content or settings in
  more than one group (a song's Settings, Publish in library, Settings › Keyboard). A switch row is a toggle. Edit is
  a pencil at the bar's end; editing, it is the word Done.

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
- r14 — The keyboard reserved as a field is focused, the field lifted by the page, the bar held still: Mindscape's
  whole mechanism (2026-10-28).
- r26 — Menus, sheets, pop-ups and pages told apart; real menus; Edit ⇄ Done; the keyboard's bars on its top edge as
  iOS pans the page (2026-11-01).
- r28 — The floating buttons' place and names are no longer settings (a developer's words in General): they stand in the middle, icons named by their tooltips; the settings store's version 17 (2026-11-01).
- r29 — The Choosing Rule's table (menu, segmented, switch, stepper, chips for filters) and four shared pickers: pitch, spelled note, key (the circle of fifths), keys checklist; the step strips go (decided 2026-11-02, built in round 29; spec `.scratch/r29/key-picker/spec.md`).
