# ADR 0094 — The score is edited where it is printed; one bar at every size

- **Status:** accepted · **Date:** 2026-10-24 · **Supersedes:** ADR 0080's Song sheet, ADR 0071 (the palette's
  side), the layer chip of ADR 0089, ADR 0085's names shown on a laptop only · **Amends:** ADR 0083 (the staves),
  0085, 0089, 0090, 0091 · Research: [2026-10-flat-and-dorico](../research/2026-10-flat-and-dorico.md); Flat's help on
  the [key signature](https://help.flat.io/en/music-notation-software/keysig/),
  [time signature](https://help.flat.io/en/music-notation-software/timesig/),
  [clef](https://help.flat.io/en/music-notation-software/clef/),
  [tempo mark](https://help.flat.io/en/music-notation-software/addtempo/),
  [measures](https://help.flat.io/en/music-notation-software/addmeasure/) and
  [the interface](https://help.flat.io/en/music-notation-software/discover-the-interface/)

## Context

The owner, looking at the editor on a laptop and a phone: the staff chip in the bar ("Upper staff ▾") is clutter,
since a click on a staff already chooses it; the Song sheet still holds the old settings (key, time signature, tempo)
and actions; everything printed on the score (the title, the tempo, the notes) should be edited where it is printed;
and the phone and the laptop must have the same tools and the same words.

Flat: "Tap the time signature in the score" (and the key signature, the clef, the tempo mark) to change it; a
measure is added "to the end of the score as you enter notation"; the mobile interface "has the same tools as the
desktop web app", in the same places. Dorico: a double click on an item opens its popover to edit it.

## Decision

1. **Edited where it is printed.** In the editor, a click or a tap on
   - **the title**, printed at the head of the sheet in every layout (Scroll, Pages, Across), turns it into a text
     field in its place: Enter or leaving it saves, Escape keeps the old one. An own song's title and a version's
     (`PieceMusic.title`, the learner's; Reset brings back the catalog's) alike;
   - **the tempo mark** opens its popover: the beats a minute with − and +, and the tempo words Largo to Presto;
   - **a key signature** opens the key (one `KeyChoice`), from that section on, or the whole song at the first bar:
     the palette's Key section in a popover;
   - **the time signature** opens the meter, the song's: the palette's Time section in a popover;
   - **a clef** opens the clefs of that staff from that bar: the palette's Clef section in a popover;
   - **a staff's name**, printed at the head of the first line (Melody, Piano), opens its menu: the melody's
     Remove (its notes go with it; Undo brings them back); the piano's Hide the piano (a lead sheet, its music
     kept and played) and Add a melody staff; a lead sheet's melody has Show the piano;
   - a section's heading, a chord symbol, a syllable, a note or a rest, as before.
   The palette keeps its sections: they add what is not printed yet (a key change at bar 9). The Player prints
   the same, the title, tempo, signatures and staff names included, and edits none of it.
2. **No Song sheet.** Its title, key, time signature and tempo are edited on the score (1) and in the palette; the
   staves by their names (1) and when a song is made (New song).
3. **The score holds; the View shows.** The score has its staves (the melody's, if any; the piano's, shown or
   hidden as a lead sheet), its chord symbols and its words. What a reader sees is the View, **one menu in both
   screens** (`ScoreViewMenu`): the layout; the staves (Melody, Upper staff, Lower staff); Chord symbols, Lyrics and
   the Keys; the Player adds what only practice has (Notation, Positions, Finger numbers, Note names). Nothing is in
   it twice: the palette folds by its own handle, the keys by their own rail.
4. **One bar, the same at every size.** The editor's: Close · Practise | Edit · Delete · Undo · Redo · Copy · Cut ·
   Paste · View · MIDI. The Player's: Close · Practise | Edit · Loop · View · MIDI · Setup. Each is its icon, its name
   the tooltip and the accessible name, at every size. No title in the bar (the sheet prints it) and no caret line
   in sight (a live region tells a screen reader where the caret is). On a phone the edit row wraps under the bar:
   a size changes where a control stands, never what it is or says.
   - **No staff chip.** A click on a staff chooses it (or Alt ↑ ↓); the caret shows where the next note goes.
   - **No Add bar.** Writing past the last bar adds one (`reaching`); the palette's Bar adds one before or after.
   - **Record is the transport's** (Dorico's): the editor's dock is tempo · ‹ · Play · › · Record, Record opening
     the takes.
5. **The palette has no side.** Beside the sheet it stands at its right; `paletteSide` goes.
6. **A bar may have no chord symbol.** A new song's bars have none, deleting a bar's only chord leaves it empty, and
   a chart writes such a bar `_`: nothing printed, nothing played by a pattern there.

## Consequences

- `pt-settings` and `pt-pieces` bump their versions (ADR 0038): `paletteSide` goes; a version may carry its title;
  the score hides only the piano (a lead sheet); the melody and the chord symbols shown or not are the View's.
- CODE_STYLE gains the rule of (4): a control has the same name and does the same thing at every size.
- `PieceSettings`, `LayerChip`, `EditorViewMenu`, the Song sheet's strings and the bar's Add bar go; `PlayerViewMenu`
  becomes the shared `ScoreViewMenu`.
