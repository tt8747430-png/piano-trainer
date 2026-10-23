# ADR 0080 — The score editor's menus hold each option in one place

- **Status:** accepted · **Date:** 2026-10-22 · **Amends:** ADR 0065 (the + menu and the gear's sheet), ADR 0064
  (the layout's place in the editor) · Its Insert (the + menu) is **superseded** by
  [ADR 0089](0089-one-palette-on-the-selection.md): its kinds are the one palette's categories

## Context

The editor's + menu had grown to eight tabs: beside what goes on the score at the caret (bars, barlines, lines,
expressions, fingers), it set the song's key, its time signature and its tempo, and added the tune's staff, the
chord names and an instrument. The gear's settings sheet set the same key, time signature and tempo, listed the same
staves, and held the layout too. One option in two menus, each worded its own way, left the learner unsure which was
the real one; and copy, cut and paste sat among the Add menu's bar tiles, though they add nothing.

## Decision

Each menu answers one question, and each option lives in exactly one of them.

- **Insert (the +) is what goes at the caret:** Bars (add, delete, a new line or section, the caret's bar's own
  length or a pickup), Repeats & jumps (barlines, endings, signs and jumps), Slurs & hairpins (with the octave
  lines), Expression & pedal, Fingering (a hand's, its bar written out first) and Clef change (the caret's staff,
  from its bar on). Six tabs, three to a row on a phone (see the amendment below).
- **Song (the gear) is the song as a whole:** its title, key, time signature and tempo (the slider, and the tempo
  words under it); its parts, each shown, hidden or removed, and Add a part (the tune's staff, the chord names, a
  voice on an instrument); and the MIDI keyboard.
- **View is how the score is shown**, the layout first; it leaves the Song sheet.
- **A selection's actions** (copy, cut, paste) are on a bar over the selection and on their shortcuts, never in
  Insert.

### Insert, as a pianist reads it (amended 2026-10-23)

The owner, a pianist, found Insert's names invented and some of its tiles misleading. Insert now speaks as
MuseScore 4, Dorico and Sibelius do, in both languages:

- **Tabs:** Bars · Repeats & jumps · Slurs & hairpins · Expression & pedal · Fingering · Clef change (Такты ·
  Повторы и переходы · Лиги и вилки · Ремарки и педаль · Аппликатура · Смена ключа). On a phone they stand three to
  a row, each picture over its name; from a tablet's width all six in one row. Every tab's and every bar tile's
  picture is drawn on one 24-unit square at one stroke weight (the treble clef Bravura's own outline), so they sit
  level in the same box.
- **Previews are engraved in C**, whatever the song's key, and shrunk to fit their tile at any width: a key
  signature never crowds the mark out. Signs and jumps a score prints as words or a sign (Segno, Coda, To Coda,
  Fine, D.C., D.S. and their al Fine / al Coda) show those words as the picture, with what they ask in a small
  gloss under them ("From the start to Fine").
- **One tile per line:** Slur, Crescendo, Diminuendo, 8va, 8vb. A tile draws the whole line in one action
  (`lineOver` in `features/score-editor`): over the bars chosen, from their first note to their last; with only a
  caret, from the note at the caret to the end of its bar (a single note reaches the next one, since a line joins
  two notes). A slur or hairpin writes its start on the first note and its end on the last; an octave line marks
  every note between. Tapped where it is already drawn, it is taken away (the tile shows pressed); drawn over a
  line of its kind, it replaces what lay inside. The separate "slur start / slur end / hairpin end" tiles are gone:
  a start alone engraved nothing, which read as a crescendo that did not work.
- **Real names, glosses only where they help.** Tiles are named by the term (Crescendo, not "Get louder");
  Italian expression words keep a short lower-case gloss ("dolce — sweetly"). The same pass renamed the palette's
  invented names: Arpeggio, Tie, Enharmonic spelling, Up/Down a diatonic step, Pedal down / Pedal change / Pedal up.
- **Fingering explains itself.** A finger goes on a written note, and a hand's bar is played from the chords by
  the song's pattern until it is written out. So a pattern bar says exactly that in one sentence, with one primary
  button, Write out as notes; a written bar shows each note at the caret with its fingers 1–5, and under them, as a
  second action, Use the pattern again, which says it replaces the written notes. Writing out stays in Fingering
  rather than Bars: Bars' edits act on whole bars of every staff, while writing out acts on one hand's bar, and the
  learner meets the need for it exactly when fingering a pattern bar (typing a note into one writes it out anyway).
- **Clef change** is one choice for the staff the caret is on, Treble or Bass, the current one pressed, "from bar
  n on, until the next clef change". The right- and left-hand rows that repeated the same two tiles are gone;
  outside the piano's staves it says to put the caret on one.

## Consequences

Removing a tab from Insert is not losing a feature: each went where its other copy already was. A tool that
changes the whole song never sits under the caret's menu, so a new option has one obvious home: at the caret,
the song's, or the view's. Insert's trigger can be drawn by its caller, so the bar may show it as an icon or a
named button.
