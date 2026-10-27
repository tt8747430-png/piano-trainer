# ADR 0062 — The keyboard is an instrument; its rail is pictures; the computer's keys have one listener

- **Status:** accepted · **Date:** 2026-09-26 · consolidated 2026-10-27

## Context

The owner found the on-screen keyboard slow to answer, flat to look at and short of what piano apps offer (GarageBand,
Flowkey, The Ultimate Piano). Its rail read as a sentence, it took a third of a phone's screen under the bar, and it
swung and re-zoomed as a page showed other keys. Each screen that wanted a computer shortcut added its own listener.

## Decision

- **A key plays on touch**, at the audio clock's now (`pointerdown`); a click no pointer made (Enter, a screen
  reader) plays once. A key a hand plays is down while it is held, and for at least 150 ms (`usePresses`), MIDI keys
  too.
- **The keys hold still.** A key that plays never lets the keyboard scroll away; the rail scrolls them, and ‹ › move
  an octave for a mouse. Scroll plays only the key touched; Glissando every key a finger slides onto (hit-tested by
  `keyAt`, not the DOM). Keys brought into sight move no further than that (`scrollToReveal`), never re-centre, keep
  their middle as their range changes (`keepCentre`), and a page's keys keep the range they opened on.
- **A piano's proportion** on every screen: a key 4.4 times as long as wide, never over 32dvh, a white key at least
  34px; short keys about two thirds of that.
- **Marks.** The keys put down are the ones struck last, and every mark stays (its wash while quiet, its full paint
  while it sounds; ADR 0011). A marked key names its note under its degree (`markNotes`); no row of chips repeats it.
- **Typing** reads physical keys (`code`), so every layout plays the same notes; never from a text field, with a
  modifier held, or on auto-repeat.
- **The rail is pictures, no words.** It holds the buttons the learner keeps (`railControls`, chosen in Settings as
  tiles wearing the rail's pictures): the key size's − +, the note names (one button that goes round), the chord
  names, typing, Glissando, the pedal (𝆮, the score's mark), the MIDI sound. Every rail setting is in Settings too.
- **The rail names the chord a hand holds**: the live voice's and a MIDI keyboard's keys, three notes or more, by
  the Chord finder's first name, as its caption, unless `chordNames` is off. A trainer's round names nothing
  (`namesChords={false}`): the chord is the question.
- **A page's keys dock** where the settings say: at the foot over the tab bar (the default) or at the top. They fold
  from the rail into a floating Keys button, morphing into it and back, and stay folded on every page until brought
  back. A reading page opens with them folded on a phone on its side (`foldedLandscape`, kept apart from `folded`); a
  screen played on (`screen="playing"`) keeps them out. The Player and the editor draw their own keys, folded from the
  rail and brought back from the View (ADR 0108).
- **The computer's shortcuts have one listener** (`ShortcutsProvider`). A screen binds its keys with
  `useShortcuts(group, …)` beside what they drive, and the `?` sheet lists them. No shortcut fires while a field is
  typed in, inside a pop-up, when the key was already handled, or on auto-repeat unless it asks. A control keeps Space
  and Enter only when the keyboard moved the focus to it.
- **Letters alone are the piano's.** Typing owns A to ' and Z X, so a shortcut takes a named key or a letter typing
  leaves free (R, I). In the Player Space is Play; elsewhere Space is the pedal and a screen's one Play takes Enter
  (`usePlayKey`). Two screens mounted together never bind one key.
- **The keyboard settings are saved** and the same on every keyboard.

## Consequences

`PianoKeyboard` stays presentational; `LiveKeyboard` reads the store and the port. jsdom lays nothing out, so tests
give the keys a box (`stubBox`) and the scroller its metrics (`stubScrolling`).

## History

- 0009 — The keyboard is an instrument (2026-09-26).
- 0036 — One listener for the shortcuts, a rail of pictures, a bar that holds (2026-10-09).
- 0037 — The rail names the chord a hand holds (2026-10-09).
- 0055, 0056 — A page's keys dock and fold; the keys say their notes; the learner chooses the rail (2026-10-16).
- 0059 — Keys that hold still (2026-10-16).
- 0062 — A reading page folds its keys on a phone on its side (2026-10-20).
