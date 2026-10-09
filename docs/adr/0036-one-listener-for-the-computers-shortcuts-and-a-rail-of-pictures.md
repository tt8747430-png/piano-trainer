# ADR 0036 — One listener for the computer's shortcuts, a rail of pictures, and a bar that holds

- **Status:** accepted · **Date:** 2026-10-09 · **Amends:** ADR 0009 (the keyboard's rail and its settings), ADR 0012
  (pop-up choices: the rail has none) · **Spec:**
  `docs/superpowers/specs/2026-10-09-screen-bar-keyboard-rail-shortcuts-design.md`

## Context

Three things the owner asked for in one note. The screen's bar "flickered": on the seven tabbed pages it sat in a
wrapper no taller than itself and its tabs, and a sticky box goes no further than its parent, so it scrolled away for
good while `--screen-bar` kept its height over the pinned keyboard. The keyboard's rail read as a sentence (`Keys Fit
Large Whole piano · Note names C All None`) and hid it behind a settings button on a phone. And only the score editor
had shortcuts, each screen that wanted a key adding its own `keydown` listener with its own copy of the guards.

## Decision

- **A subject's tabs are the bar's second row, and the bar is a child of the page's root.** `ScreenHeader` takes
  `tabs`; a test opens every screen in the shell and holds the bar to its place (`src/app/screen-bar.test.tsx`). The
  bar is measured whole: its rows are what pinned content sits under, its box how far the page scrolls before it may
  hide (`useShownOnScrollUp(past)`), and a position is read inside the page's scroll range, so an overshoot is no
  direction. `Pinned` moves with the bar.
- **Every rail control is a picture, in sight on every screen.** Key size is a zoom (`−` `+` over `KEY_SIZES`, now
  smallest first); the note names are one button that goes round and wears what the keys show; the pedal is a pedal.
  The map is the rail's own wherever the keys scroll, so `KeyboardSettings.map` goes (`pt-settings` version 10). A
  control a pointer cannot use is not shown to it (‹ › and typing are a fine pointer's), and a rail too short keeps
  its buttons: ‹ › go first, the map last. No settings button, no pop-up, no words in the rail.
- **One listener, and screens say what their keys do.** `ShortcutsProvider` (in `App`) holds a registry;
  `useShortcuts(group, shortcuts, { scope, enabled })` binds while a screen is mounted and is what the sheet lists.
  A combo names a letter or digit by its physical key (`code`), as the typing keys do, and a named key or a character
  a layout reaches its own way by `key`. No shortcut fires while a field is typed in, inside a pop-up, when the key
  was already handled, or on auto-repeat unless it asks to.
- **A control keeps Space and Enter only when the keyboard moved the focus to it.** A button pressed with a pointer
  keeps the focus but not the key: after a tap on Loop, Space is still Play. The provider remembers how the focus
  last moved (Tab, or a pointer).
- **Letters alone are the piano's.** Typing owns A–' and Z X, so a shortcut uses a letter typing leaves free (R) or a
  named key. In the Player Space is Play, and its keyboard holds no pedal on Space; on every other screen Space is the
  pedal, so a screen's one Play takes Enter (`usePlayKey`).
- **Keys handled elsewhere are listed, not bound**: the piano's typing keys and the score editor's (`shortcutOf` reads
  them by layer) are rows with `shown` caps and no `run`.

## Consequences

- A new screen's keys are one `useShortcuts` call beside what they drive; the sheet, the guards and the keycaps come
  with it. Two screens mounted together must not bind one key: the group bound last would win.
- `isTyping`, `takesKey` and `KeyPress` live in `shared/lib/shortcuts`; typing, the Space pedal and the editor's
  `shortcutOf` use them.
- A page that wraps its `ScreenHeader` fails `screen-bar.test.tsx`, not a learner's scroll.
- A saved `keyboard.map` is read and dropped; nothing else in a version-9 save changes.
