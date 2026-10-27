# ADR 0107 — Share a song by link, print what is shown, export the music to MIDI

- **Status:** accepted · **Date:** 2026-10-11 · consolidated 2026-10-27

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
    nothing a save could not. Opening it shows the song; Add to Your songs makes it one of the learner's own. A link
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
- **The tuning** is a fact of Song information: A 440 Hz unless the recording says otherwise (`tuningOf`).

## Consequences

Takes are not shared: they are too large for a link. A version of a catalog song is shared as the link to its Player,
not its music.

## History

- The share-a-song spec (2026-10-11), deleted: its link format is here.
- 0107 — Share, Print, MIDI time aligned, the tuning and Sections (2026-10-26). Its Sections are ADR 0105's.
