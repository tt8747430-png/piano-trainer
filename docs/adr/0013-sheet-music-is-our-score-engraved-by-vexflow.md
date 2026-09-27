# ADR 0013 — Sheet music is our Score, engraved by VexFlow

- **Status:** accepted · **Date:** 2026-09-27 · **Amends:** the master spec's §5 (the Player) and §6 (its params),
  ADR 0012's "a popover only beside the keys"

## Context

The owner asked for sheet music in the Player, the way Flowkey shows it: the piece as it is played, on a staff, with a
cursor on what sounds now and a loop dragged over bars. The roadmap (§4.1) asked for the notation to be the app's own
model — "the editor edits it, the cursor walks it, the Player plays it, exercises generate it" — and for the renderer
to be tried under jsdom before it was chosen. Every source the roadmap names (an arrangement, an exercise generator, a
recording from MIDI) first produces timed notes; none produces written music. The Performance the Player played gave
each rolled chord's notes their own onsets and guessed a note's spelling from its chord afterwards, which a written
score cannot use.

## Decision

- **The Performance stays the one playable truth,** and `notate(performance) → Score` writes it: pure, in a new kernel
  `shared/lib/notation`, fenced like `music` and `arrangement` (it imports only `music`, and no package). The practice
  machine, the transport and the keyboard read the Performance; the sheet reads the Score.
- **The Performance carries what the page needs:** each note's written onset and length, its `roll` (how late a rolled
  chord's note sounds, so a rolled chord is one beat group), and its `spelled` note, decided where the chord is voiced;
  the tune keeps its written spelling. Time and meter (`Tick`, `Meter`, `timeSignature`) live in the music kernel.
- **The Score is written music:** measures on a grand staff, one or two voices a staff, note values from the meter's
  grid (triplet beats where the notes lie on thirds), ties across barlines, accidentals from the key and the bar, chord
  symbols. `notate` cuts or quantises in writing only; the sound stays the Performance's.
- **VexFlow 5 core engraves it** (`shared/ui/score`, `ScoreView`), into SVG, as one system that scrolls sideways: a
  cursor that follows the music needs one line, and a phone on its side has room for one grand staff. It is imported
  by path, never through the kit's barrel, so only the Player's chunk carries it.
- **Bravura is self-hosted** from `@vexflow-fonts/bravura` through its `@font-face` (woff2, `font-display: block`,
  precached), not the JavaScript-embedded copy `vexflow` ships; `ScoreView` engraves once `document.fonts` has it, and
  says so in one line when it cannot, while the rest of the Player plays.
- **Chord symbols, bar numbers and section names are HTML** over the engraving, placed by the layout `ScoreView` hands
  its children: real text in the app's faces, themed, read by a screen reader. Each bar is a button, the loop's ends
  are sliders.
- **Colour is CSS:** every VexFlow colour is `currentColor`, and `score.css` colours the staff's lines by VexFlow's
  classes from the tokens, so dark mode, increased contrast and a muted staff never engrave again.
- **Tests engrave for real:** jsdom has no fonts and no canvas, so `stubFonts()` in the shared setup gives it
  `document.fonts` and a canvas that measures text; VexFlow itself is never mocked.
- **The Player is Flowkey's shape:** Listen and Wait mode (Step is ‹ › in either), Play in both, a loop, speed
  training and swing, and the tempo and hands in popovers anchored to their buttons, quick choices whose effect shows
  at once. Its reusable parts (`widgets/practice-player`, `widgets/sheet-music`) take any Performance; the page only
  turns a piece into one.

## Consequences

- The editor (sub-project 9) edits a Score and adds `perform(score)`, its way back to a Performance; a lesson's staff
  (5) and the scale as sheet music (4) reuse `ScoreView`; the key's chords (4) and exercises (7) hand the Player a
  Performance.
- The roadmap's §12 items are decided: lyrics under the staff are planned (no piece carries its words yet); a single
  staff whose clef follows the range is not for this app (the other staff is muted instead); the metronome's drum
  grooves, tap tempo and a MIDI sustain pedal are not for this app.
- The Choosing Rule's popovers are the keyboard's settings and the Player's tempo and hands.
- The note grid, the chord strip and the big chord now and next leave the Player; Setup loses the tempo and hands.
