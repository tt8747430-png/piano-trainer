# ADR 0111 — Song lessons by Chordify's rules: three holds, in time with the click, one change in Wait mode

- **Status:** accepted · **Date:** 2026-10-27 · **Amends:** ADR 0100 (a section's lessons), ADR 0105 (the
  click) · **Spec:** [Chordify for piano](../superpowers/specs/2026-10-26-chordify-for-piano.md) §1.7, §9

## Context

ADR 0100 taught a section by its chords, its changes and its pattern, every lesson but a chord's opening the
Player looping its bars the learner's way. A chord was learned the moment its keys were held once. Chordify's Song
lessons are stricter and plainer: a chord lesson is done once the chord is played correctly three times; the
changes are practised either as the whole sequence "to the tempo" with the metronome, or one change at a time
without the tempo; the strumming pattern is seen and heard on one chord, its current stroke lit. The owner found
the section's page too much at once and dislikes lines of description under controls.

## Decision

- **A chord lesson is three holds.** The chord's sheet counts each hold: its keys held together (on a MIDI keyboard
  or the sheet's keys), every key let go since the last. Holding it longer, or lifting a finger and putting it back,
  is the same hold. Each hold is heard (the accented click of a bar's first beat) and seen (a dot filling under
  "Hold it on the keys", and "1 of 3"); the third learns it. Its row says "1 of 3" at its end until then, a check
  once learned. `CHORD_HOLDS` is 3.
- **Kept in `pt-progress`.** `holds`, by chord lesson key, counts 1 or 2; the third hold writes the lesson done in
  `lessons` and drops its count. Version 3, read field by field, a count of a chord already learned dropped (ADR
  0038, no migration).
- **In time** opens the Player in Listen over the sequence's bars, looped, with the click on for that visit
  (`click=true`). The learner's saved Click is untouched; the Sound's Click switches the visit's own while it has
  one. **One change at a time** opens it in Wait mode over the bar or two its two chords span. **A pattern** loops a
  bar of it on one chord, the first bar it plays the section's first chord alone in (else any chord alone, else its
  first bar), with the keys out for that visit (`keys=true`) and each note lit as it sounds, whatever the View.
- **The visit's own.** `click` and `keys` are never remembered (`rememberView`), and a link naming either opens in
  Listen, never in a mode kept from the last time (`BOUND_TO`): Listen is the URL's default, which a link cannot
  name.
- **Calm.** Chords stand open; In time, One change at a time and Pattern are each a fold of their own, closed until
  asked for. Each group is named by what it does, how behind an ⓘ beside its heading (`FoldSection`'s and
  `RowGroup`'s `info`). A row names what it plays (`Em · C · D`, `Em → D/F♯`, a pattern's name over "On Em"), with
  no line of bars under it. One change alone is still its sequence's (ADR 0100, amended).
- **Done as before.** A sequence, a change and a pattern are done by a Wait-mode pass over their bars (ADR 0100):
  Listen does not hear the learner, so In time's ⓘ says to play along in Wait mode to tick it off.

## Consequences

- **`entities/progress`:** `holds`, `CHORD_HOLDS`, `ChordLessonKey`, `withHold`, `selectHolds`; version 3.
- **`features/record-lesson`:** `recordHold` in place of `recordChord`.
- **`widgets/chord-diagrams`:** `ChordLearn` is `{ held, needed, onHeld }`; `ChordLearning` counts holds.
- **`widgets/practice-player`:** `PracticeView`'s `click` and `keys`; the Player's `click`, `keys`, `setClick`,
  `setKeys`; `SoundButton` takes the click from the Player.
- **`pages/player`:** the View's Keys and the keys under a chord view follow the visit's `keys`.
- **`pages/piece`:** `LessonRow` opens each kind as `OPENS` says; `SectionLessonGroups` has three folds; a pattern
  lesson's bar is chosen on one chord.
- **`shared/ui`:** `FoldSection` and `RowGroup` take `info`.
- **`app/routes`:** the Player's search reads `click` and `keys`; `remember.ts` binds Listen to them.

Judging a pass in Listen by what a MIDI keyboard plays along is not built: it would need timing windows the Player
does not keep.
