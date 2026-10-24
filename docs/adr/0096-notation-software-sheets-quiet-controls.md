# ADR 0096 — Sheets that show as notation software does; controls that explain in a popover

- **Status:** accepted · **Date:** 2026-10-24 · **Supersedes:** ADR 0082 and 0088's boxes hugging the notes (the
  marks; the picking stays), the Player's cursor box · **Amends:** ADR 0089 (the palette's Chords, Lyrics and
  Fingering), ADR 0093 (the Lyrics field), ADR 0028 (the takes' sheet), ADR 0094 · Research: Flat (the playback
  cursor, a line across the system; selected notes in blue; [chords](https://help.flat.io/en/music-notation-software/chords/),
  [lyrics](https://help.flat.io/en/music-notation-software/lyrics/) and
  [fingerings](https://help.flat.io/en/music-notation-software/fingerings/) typed at the note), Dorico (the playhead
  line; the chord-symbol, lyrics and fingering popovers), MuseScore (a range drawn as a band over its staves)

## Context

The owner: the Player's cursor is a box that hugs the notes and jumps from staff to staff where a staff has no note;
the editor's choice is drawn the same way; neither looks like an editor. The chords, lyrics and fingering tools are
cluttered and hard to use. Explanations under every control clutter the screens (the palette, the View, the takes,
Settings). "Your version" printed under the title is text the learner cannot change.

## Decision

1. **The playhead is a line.** One thin line across the system, from the top line of its highest staff in sight to
   the bottom line of its lowest, at the time that sounds: in Listen and the editor's Play it moves with the audio
   clock between the notes; in Wait mode it stands at the notes awaited. It never changes height note by note. Both
   sheets draw the same playhead (one component); the sheet follows it from system to system. In the editor it is
   apart from the caret and the choice: Play leaves the caret where it was.
2. **What is chosen is coloured.** A chosen note or rest is drawn in the selection colour (head, stem, flag,
   accidental, dots); a range is a light band over the staves it takes, from its first to its last note; the caret is
   a thin line on its staff, the note it stands on coloured. The Player's loop is a band over every staff, with its
   grips. No box hugs notes; `pickAt` and the gestures stay.
3. **Typed where it is printed.** A chord symbol is typed in a field that opens over the staff at the caret's beat
   (or on a printed symbol clicked), the key's chords suggested as one types; Enter or → writes it and goes to the
   next beat, ← back, Escape out. Lyrics are typed in a field under the note (ADR 0093's keys); fingering in a field
   over the note (digits; a chord's fingers bottom up, `1 3 5`), Enter writing it and going on. The palette's Chords,
   Lyrics and Fingering are one key each that opens its field; the chord grids, Build and Type, and the five finger
   keys go.
4. **Explanations in a popover.** No line of explanation stands under a control: a control's name carries an ⓘ
   (`InfoTip`) that opens its explanation, in the palette, the View, the Setup, the takes, New song and Settings; a
   greyed tool says why in its tooltip. A term's meaning (dolce: sweetly) is its key's tooltip.
5. **Nothing printed that the learner did not write.** "Your version" leaves the sheet (the song's page says it).
6. **Recording is the transport's.** Record (in the dock) counts in and records; with no MIDI keyboard it says so in
   its popover, with the way to connect one. The metronome and what plays along are its settings popover; the takes
   are their sheet. No read-only facts.

## Consequences

`shared/ui/score` (the marks, a `Playhead`), `widgets/sheet-music` and `widgets/score-sheet` (the cursor and the
caret), `pages/score-editor` (the palette's keys, the fields over the sheet, the recorder), `shared/ui` (`InfoTip`;
`SwitchRow`, `SettingField`, `MenuSection` and the palette's sections take `info` in place of a detail line),
`pages/settings`.
