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
- **The keyboard settings are saved** and the same on every keyboard. The rail's ⚙ opens the **Piano** sheet in place
  (`PianoSettingsSheet`): Key size, Note names, Volume, Pedals and, on a computer, Play with computer keyboard
  (`PianoEssentialRows`, the same rows heading the On-screen piano page, so each keeps one control), then All piano
  settings. A screen that keeps the piano's settings itself (the Player) passes `onSettings`.
- **A real piano's keys** (R33): ivory and ebony drawn as light and shade over each key's fill (`key-face-*`), a lip and
  a slope, the key slip's felt; a key down sinks. Every mark keeps its colour.
- **The pedals sound as a piano's** (`damp`, the live voice, the WebAudio adapter): the sustain, held from any source
  (a finger, Space, CC64, the score while music plays) or latched by a tap, keeps every key struck or let go under it
  ringing; on its lift they stop together, each with its register's damper (0.6 s in the bass to 0.25 s in the
  treble). A key struck again under it fades its old sound in 50 ms as the new one starts. The soft pedal (CC67, una
  corda) strikes a key two thirds as loud through a low-pass of its own; the sostenuto (CC66) catches the dampers
  raised as it goes down (the keys held, or every key sounding under the sustain) and lets them go as it lifts. The
  keys a hand plays sound as loud as the piano's Volume (`keyboard.volume`, its square a gain).

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
- r29 — Fingering on the keys one way (one circle, right hand above the name, left below; a crossing the accent colour with an arc), never two rows of numbers (decided 2026-11-02, being built in round 29; spec `.scratch/r29/fingering-service/spec.md`).
- r31 (R31-P) — The rail's box and its buttons (names, chord names, glissando, MIDI sound, the sustain latch) go: the
  strip holds the chord, − +, ⚙ and the pedals drawn from the bench (hold, or tap to lock the sustain); `railControls`
  becomes `pedals` (sustain or all three). The bar under the keys goes (2026-11-05).
- r32 (R32-A) — Nothing above the keys: the strip becomes the rail beneath them, the pedals centred on a lyre as a
  piano's (soft · sostenuto · sustain, or the sustain alone), the chord held at its start, ‹ › − + ⚙ at its end; a
  latched sustain carries a honey dot. The On-screen piano's page is the one home of the keys' settings, the
  Player's gear a link to it; its options ordered Keys · While you play · Placement, each with its line (2026-11-05).
- r33 (R33) — A real piano's keys (ivory, ebony, felt, depth); the Piano sheet in place from the rail's ⚙, with a
  Volume; the rail's end never scrolled away; the latch's light; the soft pedal quieter and darker, the sostenuto
  catching every raised damper (2026-11-05).
