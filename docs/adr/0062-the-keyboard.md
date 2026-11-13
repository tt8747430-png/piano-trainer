# ADR 0062 — The keyboard is an instrument, its keys alone; its controls are the bar's; the computer's keys have one listener

- **Status:** accepted · **Date:** 2026-09-26 · consolidated 2026-10-27 · amended 2026-11-05 (R34)

## Context

The owner found the on-screen keyboard slow to answer, flat to look at and short of what piano apps offer (GarageBand,
Flowkey, The Ultimate Piano). Its rail read as a sentence, it took a third of a phone's screen under the bar, and it
swung and re-zoomed as a page showed other keys. Each screen that wanted a computer shortcut added its own listener.

## Decision

- **A key plays on touch**, at the audio clock's now (`pointerdown`); a click no pointer made (Enter, a screen
  reader) plays once. A key a hand plays is down while it is held, and for at least 150 ms (`usePresses`), MIDI keys
  too.
- **The keys hold still.** A key that plays never lets the keyboard scroll away; a swipe, a trackpad or the wheel
  scrolls them, and the music they follow does. Scroll plays only the key touched; Glissando every key a finger slides onto (hit-tested by
  `keyAt`, not the DOM). Keys brought into sight move no further than that (`scrollToReveal`), never re-centre, keep
  their middle as their range changes (`keepCentre`), and a page's keys keep the range they opened on.
- **The keys alone, at the screen's edge** (R34, Songscription's): the whole piano, slim and edge to edge at the
  foot (or under the bar at Position: Top), nothing attached: no rail, no caption, no buttons, no pedals, no finger
  numbers (the score, the hand drawings and the fingering tables carry fingers). **Key size:** All keys (the
  default) fill the width and never scroll; Fit to music fills it with the music's range and Large shows about an
  octave on a phone, both scrolling to follow the music.
- **A piano's proportion** until the learner sets a height: a key 4.4 times as long as wide, at least 56px, never
  over `--keys-most` (32dvh, 22dvh on a phone on its side). **The divider** between the music and the keys
  (`KeysDivider`, Songscription's "Resize score and piano roll") drags the keys taller or shorter, 56px to half the
  screen, their widths unchanged; arrows, Home, End and Enter (back to the proportion) from the keyboard; kept per
  screen size (`keysHeight`: phone upright, phone on its side, wider), the screen as left, not a preference. The
  Player, the editor and every page's docked keys have it; keys inside a card (a round, a chord diagram) do not.
- **Marks.** The keys put down are the ones struck last, and every mark stays (its wash while quiet, its full paint
  while it sounds; ADR 0011). A marked key names its note under its degree (`markNotes`); no row of chips repeats it.
- **Typing** reads physical keys (`code`), so every layout plays the same notes; never from a text field, with a
  modifier held, or on auto-repeat.
- **The keyboard's controls are the screen's bar's** (`KeyboardTools`, R34): the chord a hand holds (the live
  voice's and a MIDI keyboard's keys, three notes or more, by the Chord finder's first name, from 40rem, unless
  `chordNames` is off; not on the Chord finder, whose stage names it), **Sustain** while the keys show, and
  **Keyboard**, which shows or hides them. Pages use `PageKeyboardTools` over the saved fold (`folded`, and
  `foldedLandscape` on a phone on its side, where a reading page opens with them hidden; a screen played on,
  `screen="playing"`, keeps them out); the Player its own choice. Hidden, the keys fold into a thin labelled strip
  where they stood (`KeyboardStrip`, "Keyboard ↗", Songscription's Score only) that brings them back at a tap;
  nothing floats. The editor's bar, full on a phone held upright, keeps its Sustain from 40rem.
- **Names on narrow keys:** All keys on a phone (a white key under 12px, a container query) name middle C alone,
  small and on one line; a mark's note name goes, its degree stays.
- **The sheet's one pill** (`SheetPill`, R34, Songscription's view pill): the score's layout (`SheetLayoutPicker`
  through `SheetLayoutTools`, its one control; the Layout tiles left Display and the editor's View) and, in Page
  view, the canvas's zoom (`SheetToolsContext`), always in sight at the score's bottom-right (in the editor from
  48rem; on a phone its gear's View chooses the layout, ADR 0096). A trainer's keys have no bar tools: the chord is the
  question.
- **A page's keys dock** where the settings say: at the foot over the tab bar (the default) or at the top, edge to
  edge.
- **The computer's shortcuts have one listener** (`ShortcutsProvider`). A screen binds its keys with
  `useShortcuts(group, …)` beside what they drive, and the `?` sheet lists them. No shortcut fires while a field is
  typed in, inside a pop-up, when the key was already handled, or on auto-repeat unless it asks. A control keeps Space
  and Enter only when the keyboard moved the focus to it.
- **Letters alone are the piano's.** Typing owns A to ' and Z X, so a shortcut takes a named key or a letter typing
  leaves free (R, I). In the Player Space is Play; elsewhere Space is the pedal and a screen's one Play takes Enter
  (`usePlayKey`). Two screens mounted together never bind one key.
- **The keyboard settings are saved** and the same on every keyboard, set on Settings › On-screen piano
  (`KeyboardSettingsFields`: Key size, Note names, Volume, Pedals, computer keys; Chord symbol, names on highlighted
  keys; Swipe, Play on selection; Position), their one home. The Player's sheet, the editor's gear and a Practice
  page's Settings each hold a row to it, never the fields (owner, 2026-11-12). Key depth
  and Collapse keyboard went in R34: the divider and Keyboard do their jobs.
- **A real piano's keys** (R33): ivory and ebony drawn as light and shade over each key's fill (`key-face-*`), a lip and
  a slope, the key slip's felt; a key down sinks. Every mark keeps its colour.
- **The pedals are worked from the bar** (`SustainControl`, `usePedalPress`, R34): Sustain lit (`--key-down`) while
  down from any source; held it holds, a tap or Enter latches it until the next; with Pedals: All three, a ⌄ opens Soft
  and Sostenuto, worked the same way, their presses held by the bar so a latched one outlives its menu (a dot on the
  ⌄). Whatever a button holds lets up as the page hides or the button goes.
- **The pedals sound as a piano's** (`damp`, the live voice, the WebAudio adapter): the sustain, held from any source
  (a finger, Space, CC64, the score while music plays) or latched by a tap, keeps every key struck or let go under it
  ringing; on its lift they stop together, each with its register's damper (0.6 s in the bass to 0.25 s in the
  treble). A key struck again under it fades its old sound in 50 ms as the new one starts. The soft pedal (CC67, una
  corda) strikes a key two thirds as loud through a low-pass of its own; the sostenuto (CC66) catches the dampers
  raised as it goes down (the keys held, or every key sounding under the sustain) and lets them go as it lifts. The
  keys a hand plays sound as loud as the piano's Volume (`keyboard.volume`, its square a gain).
- **The hands differ by shape:** a right-hand key is filled brick, a left-hand key a lilac wash with a lilac outline,
  1 px at rest and 2 px while it sounds (R34, DESIGN.md's Palette Law).

## Consequences

`PianoKeyboard` stays presentational and is its keys alone; `LiveKeyboard` reads the store and the port; the bar's
`KeyboardTools` and the `KeysDivider` are the keyboard's only controls. jsdom lays nothing out, so tests
give the keys a box (`stubBox`) and the scroller its metrics (`stubScrolling`).
