# R39-3: the score editor (`/edit/$pieceId`)

## Premium, for this area

Beside Flat for iPhone and the web, Dorico for iPad and forScore: the page is the work, one quiet bar, and a palette
that is a real instrument (Flat's categories and tiles), not two toolbars and a header.

## Rulings (feedback-log "Score editor")

One home for each thing; only what applies shown, hidden not greyed; the palette and its menus as Flat's, every section
in one scroll; the piano from the editor's bar on a phone; professional terms; laptop a docked side panel, phone a
bottom sheet that shrinks the score; everything printed is edited on the score (the title opens Title and credits, the
printed time and key signatures open their categories); the gear holds only what the score does not print.

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
