# R39-3: the score editor (`/edit/$pieceId`)

## Premium, for this area

Beside Flat for iPhone and the web, Dorico for iPad and forScore: the page is the work, one quiet bar, and a palette
that is a real instrument (Flat's categories and tiles), not two toolbars and a header.

## Rulings (feedback-log "Score editor")

One home for each thing; only what applies shown, hidden not greyed; the palette and its menus as Flat's, every section
in one scroll; the piano from the editor's bar on a phone; professional terms; laptop a docked side panel, phone a
bottom sheet that shrinks the score; everything printed is edited on the score (the title opens Title and credits, the
printed time and key signatures open their categories); the gear holds only what the score does not print.

- The editor's draft of a built-in song (canvas 135, ADR 0116, from "no roles, no edit mode for the pages"): an editor opens it from the song's ··· Edit the original. Under the bar, a Publishing pill and the save state (Saved · not published, Saving…, Offline: not saved yet, Not saved). Publishing holds Publish… (asks, as it reaches every learner), Versions (each published one, Restore asks) and Discard changes (asks; cannot be undone). Opening, opening offline, can't open and not an editor are full-screen states.

## Today (shot `.scratch/r39/drawings/today-editor-phone.png`)

Phone: ✕ and Done both, then a filled piano circle, a filled honey Play, Undo, Redo and the gear, all in one row with
two filled circles; the score; a palette with durations over a row of icon-only category tabs; the piano.
Files: `src/pages/score-editor`, `src/widgets/score-sheet`, `src/features/score-editor`.

## Will build (drawn, canvas [The ideal Songs](https://claude.ai/artifact/Ana84hFnmzQCBFuvNZRmXB), row 3)

1. **Bar**: Done (the one way out), then at the right Undo, Redo, a hairline, **Piano keys** (a toggle that fills),
   **Play** (the only coloured button; becomes Stop), **···** = Score settings: Instruments and staves, Page layout,
   Playback sound, MIDI keyboard. No ✕.
2. **The score**: the title and credits as printed (tap = Title and credits), "Verse · ♩ = 80", the systems with chord
   symbols and bar numbers; the selected note boxed in blue.
3. **Palette, phone**: a white sheet with a grip. Folded: one scrollable row of the current category's tools over a
   segmented row of **named** categories: Notes · Accidentals · Articulation · Dynamics · Bar · Text. The grip opens
   every section in one scroll (Flat's way), the score shrinking above it.
   - Notes: rest, whole to 32nd, dot, tie, triplet. Accidentals: double flat to double sharp. Articulation: staccato,
     accent, tenuto, marcato, fermata, slur, arpeggio. Dynamics: ppp to fff, crescendo, diminuendo. Bar: time
     signature tile (3/4), key signature, clef, start and end repeat, double barline, add a bar, tempo. Text: chord
     symbol, lyrics, text, Roman numeral, rehearsal mark.
4. **Piano** under the palette when on, C4 marked, the entered note's key lit.
5. **Laptop**: the page in the middle on white; the palette docked at the right, every section in one scroll; the piano
   from the bar under both.

## Canvas 123 (2026-11-11): the editor is the Player in Edit

Owner: "all pages except the chord finder and song player should be refactored … the must time you need to spend on
the editor and songs and practice pages"; CLAUDE.md: "the Player's score in Edit mode, sharing its bar and transport".

- **Bar:** the Player's glass bar: ✕, a **Play · Edit** switch in the middle, Undo, Redo and ··· (Score settings) at the
  right. Done goes: the switch to Play is the way back to listening, ✕ the way out. This replaces R39-3's "Done, no ✕".
- **Selection strip** heads the palette: "C5 · half note" over "Bar 4 · beat 1 · “sweet”", then Delete, Piano keys and
  the one honey button, Play from here.
- **Palette:** seven named categories (Notes, Accidentals, Articulations, Dynamics, Lines, Bar, Text); notes, rests, tie,
  slur and grace drawn as engraved icons, not font glyphs; 48 tiles, each with its name and shortcut as a tip. Folded on
  a phone to one row under the categories; the grabber (44 high) opens every section in one scroll.
- **Keys** under the palette on a phone (112 high), under the score on a laptop, the selected note lit.
- **Laptop:** no sidebar; the page in the middle, the palette docked at the right (380), every section in one scroll.
- **··· Score settings:** Instruments and staves, Page layout, Playback sound, MIDI keyboard; Export, Print. Title, key,
  time and tempo are edited on the score.
