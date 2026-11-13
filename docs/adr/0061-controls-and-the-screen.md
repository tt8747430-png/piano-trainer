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
  | Which hands                                                              | `HandsSegmented`: Left · Both · Right, as the hands sit at the keys                        |
  | On or off                                                                | a switch (`SwitchRow`), or a `ToggleTile` where several sit together                       |
  | A number                                                                 | a stepper (`Stepper`)                                                                      |
  | Several of many                                                          | a pop-up that checks several (`MultiDropdown`), or a checklist sheet                       |
  | A few filters                                                            | chips (`ToggleChips`), and only there                                                      |

  **On a Settings page** (R29, the owner's choice of Flat's "Advanced settings"): a choice among two or more,
  where the choices are words, is a `ChoiceCard`: the setting's name over a card, every choice a radio with a
  one-line example under it, longer help in its ⓘ. On or off stays a `SwitchRow`; a choice with a picture stays
  `PictureChoice`. **The hands** (R35, after Ivory's parts) are one control everywhere, `HandsSegmented`, in the
  keys' order Left · Both · Right with the words of `common:handsShort`; where the keys wear the hands' colours (the
  Player's Hands, an exercise, a scale run in the Player) each segment carries its hand's dot over its word,
  the right a brick dot, the left a lilac ring, Both the two; in the explorers, whose keys wear a chord's tones, none.
  A row of controls on a screen (not a Settings page) keeps the table above.

  No strip that hides its options behind ‹ ›, and no scrolling strip fades at its edges. A choice that has a picture
  is a tile wearing it (`PictureTiles`): a layout, a view, a swing feel, a sign; an inversion is its noteheads.
  Settings changed less often are a sheet on a phone and a popover on a laptop. Views of one thing are a `Segmented` in
  the page's content; a place's views are its title (`TitleTabs`).

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
  foot, each its icon with its name as its tooltip (no setting: round 28). Creating is one shape on every library
  (canvas 169): `NewDial`, the honey + opening its card of rows, the most made nearest the thumb (one thing to make is
  the + alone), and on a laptop `NewMenu`, the honey New ▾ at the bar's end (one thing is its own button). A
  tap on the page's free room folds them away until the next. The full-screen routes (the Player, the editor, the
  Check) have no host: their bars stand in flow (ADR 0115).
- **Explanations in a popover.** No line of explanation stands under a control. Its name carries an ⓘ (`InfoTip`)
  that opens it; a term's meaning is its key's tooltip. A menu or a gear holds only what can be done here: an act
  that cannot (no takes yet, the last staff in sight, no voice in this browser) is left out, never greyed with a reason. No sentence repeats
  what a label, an icon or the layout already says.
- **The same at every size.** A control has the same name and does the same thing on a phone and a laptop. A size
  changes where it stands, never what it is or says. An icon button is named by its tooltip and its accessible name. A control with words is named by
  them: an `aria-label` only adds to its visible text, never replaces it (WCAG 2.5.3, axe in the e2e).
- **Secondary sections fold** from their headings (`FoldSection` over `FoldBody`, sliding, inert while folded); what
  is folded is saved by section id (`foldedSections`) and stays folded on every visit.
- **The screen's bar** (`ScreenHeader`) is a child of the page's root, one row with no tabs under it; it hides
  while reading down and comes back on a scroll up. `src/app/screen-bar.test.tsx` holds every screen to it.
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
  more than one group (a song's Settings, Publish in library, Settings › On-screen piano). A switch row is a toggle.
  Edit is a quiet pencil right after the title (`ScreenHeader`'s `edit`, an `EditAction`); editing, Done in its place,
  so it never moves between modes. The score's toolbar keeps its own Edit · Done at its end (`EditToggle`, ADR 0115).
- **What floats keeps clear of the screen's edges:** a popover, a menu, a select's list and a tooltip open 5px
  inside the safe area (`useLayerPadding`), never under the notch or the status bar nor in the home indicator's
  strip, read again as the phone turns; one taller than the room left scrolls inside itself.

## Consequences

A new option has one obvious form by this rule. A test reaches a folded action by opening its dial first.
