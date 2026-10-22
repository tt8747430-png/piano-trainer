# ADR 0080 — The score editor's menus hold each option in one place

- **Status:** accepted · **Date:** 2026-10-22 · **Amends:** ADR 0065 (the + menu and the gear's sheet), ADR 0064
  (the layout's place in the editor)

## Context

The editor's + menu had grown to eight tabs: beside what goes on the score at the caret (bars, barlines, lines,
expressions, fingers), it set the song's key, its time signature and its tempo, and added the tune's staff, the
chord names and an instrument. The gear's settings sheet set the same key, time signature and tempo, listed the same
staves, and held the layout too. One option in two menus, each worded its own way, left the learner unsure which was
the real one; and copy, cut and paste sat among the Add menu's bar tiles, though they add nothing.

## Decision

Each menu answers one question, and each option lives in exactly one of them.

- **Insert (the +) is what goes at the caret:** Bars (add, delete, a new line or section, the caret's bar's own
  length or a pickup), Repeats (barlines, endings, signs and jumps), Lines (slurs, hairpins, octave lines), Text
  (expressions and the pedal), Fingers (a hand's, and its bar written out) and Clefs (a hand's, from the caret's
  bar). Six short tabs that fit a phone's width.
- **Song (the gear) is the song as a whole:** its title, key, time signature and tempo (the slider, and the tempo
  words under it); its parts, each shown, hidden or removed, and Add a part (the tune's staff, the chord names, a
  voice on an instrument); and the MIDI keyboard.
- **View is how the score is shown**, the layout first; it leaves the Song sheet.
- **A selection's actions** (copy, cut, paste) are on a bar over the selection and on their shortcuts, never in
  Insert.

## Consequences

Removing a tab from Insert is not losing a feature: each went where its other copy already was. A tool that
changes the whole song never sits under the caret's menu, so a new option has one obvious home: at the caret,
the song's, or the view's. Insert's trigger can be drawn by its caller, so the bar may show it as an icon or a
named button.
