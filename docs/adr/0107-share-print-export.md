# ADR 0107 — Share a song by link, print what is shown, export and import the music

- **Status:** accepted · **Date:** 2026-10-11 · consolidated 2026-10-27 · amended 2026-10-28

## Context

A learner's own songs live on their device only, and a teacher or a church group had no way to pass one on but a
backup of everything. A song's music is short text, so it can travel inside a link. Chordify's song menu shares a
song, exports it to PDF and MIDI (fixed tempo or time aligned, the tempo in the file's name) and prints "the chords as
seen on screen" with the diagrams on a last page.

## Decision

- **Share, every song**, from its page's More and the Player's:
  - an app's song (or a study) is a link to its Player in the key it is played and as simplified, both always said,
    so the link never takes the key its opener kept;
  - an own song carries its music: `/songs/shared?song=…`, its title and music deflated and written in base64url. The
    link's text is untrusted and read by the same reader the pieces store reads its own songs with, so a link holds
    nothing a save could not. Opening it shows the song; Add to the library makes it one of the learner's own. A link
    that holds no song says so. A song written in degrees has no Share;
  - the device's share sheet where it has one, else the link copied, said in the status line.
- **Print**, in the Player's More, for everything the Player plays: the view shown, as it reads. Sheet music on its A4
  pages whatever the screen's layout, with what the View shows and nothing a screen adds; Chords over lyrics by
  section, a line never split; the Grid (and Diagrams, as the Grid); then a last page of the song's chords as
  diagrams in their chosen inversions. The music is the Performance played, so the key and Simplify carry over.
  `SongPrint` renders it hidden, the print stylesheet shows it alone, and once drawn it calls `window.print()`. The
  browser's Save as PDF makes the PDF: no PDF library.
- **Export to MIDI**: the music as the Player plays it, a format-1 file with each track a part named as the screen
  names it, the sustain on the hands' tracks, named `<title> (<bpm> BPM).mid`. A piece with a recording offers two:
  fixed tempo (for notation software) and time aligned (the recording's tempo, its notes from where the recording's
  bar 1 begins, so the file lies under the recording in a DAW). A recording holds one steady tempo; one that drifts
  would need a beat map and would offer fixed tempo alone.
- **Export to MusicXML**, beside Export to MIDI in the Player's More (a piece's, never a walk's or an exercise's) and
  on the song page's More, which has Export to MIDI too: the music as written, in its own key whatever it is played
  in, named `<title>.musicxml`. MusicXML 4.0 partwise (`shared/lib/musicxml`, our own small XML reader and writer,
  no package): each single staff a part under its name, the piano one part of two staves under its printed name;
  every bar of every staff (a lead sheet's piano kept with `staff-details print-object="no"`); values, dots,
  triplets, ties, beams, accidentals, fingers, articulations, ornaments, arpeggios, grace notes and slurs; dynamics,
  hairpins, octave lines, the pedal, expressions and the tempo as directions; chord symbols as `<harmony>` (the
  nearest kind and its degrees, our suffix as its text); lyrics with their syllables and extenders; key, time and
  clef changes; repeats, endings, double and final barlines, the signs and jumps; each section's heading a rehearsal
  mark and each chart line a system. What only the app reads (the pattern, the sections' headings and lines, method
  codes) is a versioned `miscellaneous-field name="piano-trainer"`. Every catalog piece exports and imports back as
  the same song, and every export validates against the MusicXML 4.0 XSD.
- **Import** (Flat's), from Songs' New and by a file dropped on the library on a laptop, made where the learner is
  (ADR 0106): MusicXML (`.musicxml`, `.xml`, compressed `.mxl`, unzipped with the platform's
  `DecompressionStream`) and Standard MIDI files, told apart by their first bytes. Read into ticks of the meter's
  kind, then into the editor's draft (`draftOfScore`), written as the editor writes a song and read back as a save
  is, so an import always opens.
  - **MusicXML:** the first part of two staves is the piano's grand staff, every other staff a single staff (one
    line: its first voice, a chord's top note); with no piano part, a lead sheet over a silent piano. Title,
    composer, key, meter, tempo, notes, rests, ties, tuplets, chord symbols, lyrics (on the staff that sings most),
    fingers, dynamics, articulations, slurs, repeats and endings are read as far as our model holds them. Sections
    start at a key change, a lasting change of time and a rehearsal mark (its words naming a part where they do);
    lines are the file's systems, else four bars.
  - **MIDI:** its first meter, tempo and key signature, else the key its notes are most likely in
    (Krumhansl–Schmuckler); its notes snapped to a 16th or an eighth triplet by the takes' `quantise`; the piano's
    tracks (by name, or the only two) its hands by pitch, one track split at middle C; every other track a single
    staff; the sustain pedal as pedal marks.
  - **What it leaves out** is counted by kind and listed after the import in a sheet, with Open the song; an import
    that leaves nothing out opens the song's page at once. A file over 20 MB or 20,000 notes is too large, one that is
    no score says what Import opens, a damaged one (a .mxl garbled or cut short too) says so. Closing the sheet while
    a file is read makes nothing of it.
- **The tuning** is a fact of Song information: A 440 Hz unless the recording says otherwise (`tuningOf`).

## Consequences

Takes are not shared: they are too large for a link. A version of a catalog song is shared as the link to its Player,
not its music.

## History

- The share-a-song spec (2026-10-11), deleted: its link format is here.
- 0107 — Share, Print, MIDI time aligned, the tuning and Sections (2026-10-26). Its Sections are ADR 0105's.
- Export to MusicXML, MIDI from the song page, and Import of MusicXML and MIDI (2026-10-28).
- A broken .mxl says so, an import closed while reading makes nothing; a shared song's Add names the library
  (2026-10-28).
