# ADR 0107 — Share, Print, MIDI time aligned, the tuning and Sections

- **Status:** accepted · **Date:** 2026-10-26 · **Amends:** ADR 0099 (the Player's More and Song
  information), ADR 0087 (the sheet's pages, now printed), ADR 0104 (a link keeps Transpose and Simplify)
  · **Spec:** [Chordify for piano](../superpowers/specs/2026-10-26-chordify-for-piano.md) §1.1, §1.6, §7

## Context

Chordify's song menu offers Share chords…, Export to PDF, Export to MIDI (time aligned or fixed tempo, the
tempo in the file name) and Song information (the chord summary, the tempo and the song's frequency, with a
word where a song is tuned off 440 Hz). Its toolbar has Sections, a list of the song's sections, one tapped
seeking there. Its PDF and Print are "the chords as seen on screen", the transposition with them, the
diagrams on a last page.

Ours shared only an own song, from its page and the Player, as a link carrying its music. More had Song
information (key, time, tempo) and Export to MIDI at the tempo chosen, named by the title alone. There was
no print, and no way to a section but scrolling the sheet.

## Decision

- **Share, every song.** In the song page's More and the Player's More, named Share alike:
  - one of the app's songs (and a study) is a link to its Player, in the key it is played and as
    simplified, both always said, so the link never takes the key its opener kept (`pieceLink`). From the
    song page that is what the Player last kept for it; from the Player, what it plays now;
  - an own song carries its music as before (ADR 0027), unless it is written in degrees, which has no
    Share;
  - the device's share sheet where it has one, else the link copied, said in the status line (`ShareSaid`:
    "Link copied." with what the link does).
- **Print**, in the Player's More, before Export to MIDI, for everything the Player plays. It prints the
  view shown as it reads:
  - Sheet music, on its A4 pages, the Pages layout's whatever the screen's layout (`PrintedScore` over
    `SheetPages`, which the screen's pages share): the staves, chord symbols and words the View shows,
    each line with its labels' row, nothing a screen adds (the playhead, the loop, bars to tap); one page
    to a sheet of paper, as drawn (`@page score`, no margin of the browser's);
  - Chords over lyrics, its sections under their names, each line's chords printed over every verse
    (`PrintedLyrics`, over `LineSegments`, which the screen's rows share), a line never split;
  - the Grid, the chart in beats, four bars of 4/4 a row (`ChordChart`'s `tap="print"`); Diagrams prints
    as the Grid, the chords in time, since its diagrams are the last page;
  - then a last page of the song's chords as diagrams in the inversions its piece chose
    (`PrintedDiagrams`).

  The music is the Performance the Player plays, so the key and Simplify carry over. `SongPrint` renders it
  into the body, hidden on the screen; the print stylesheet shows it alone while it stands. Once it is drawn
  (every line engraved, for the sheet music) it calls `window.print()`, and goes on `afterprint`. The
  browser's own Save as PDF makes the PDF: no PDF library, one renderer for paper and PDF.

- **MIDI.** The file is named `<title> (<bpm> BPM).mid` (`midiFileName(title, bpm)`). A piece with a
  recording offers two exports in place of one: **fixed tempo**, at the tempo chosen, for notation
  software; **time aligned**, at the recording's tempo with its notes from where the recording's bar 1
  begins (`performanceMidi`'s `lead`, seconds of silence counted at the first tempo), so the file lies
  under the recording in a DAW.
  - Why this alignment is honest: a `Recording` holds where bar 1 begins (`start`) and one steady tempo,
    measured against the recording's landmarks within 50 ms. That is all the timing the data gives, and it
    is the timing the Player itself plays the recording by (`recordingPlay`). A recording with a tempo
    that drifts would need a beat map, which no recording has; it would then offer Fixed tempo alone until
    one is measured.
- **Tuning.** Song information shows a fourth fact card, Tuning: the A the music is tuned to, A 440 Hz
  unless the piece's recording says otherwise (`Recording.tuning`, measured from its file; `tuningOf`).
  Where it is not 440, an ⓘ beside the value says what it means. The one recording, «Ромашковые поля», was
  measured at 440.1 Hz (its spectrum's peaks 0.3 cents off the equal-tempered grid), so it says 440 and
  sets nothing. Four cards stand two by two on a phone held upright, four across from 640px.
- **Sections** is More's, not the tools row's. Measured at 320px, the View (140px), Transpose (48px) and
  Simplify (92px) fill the row's 280px; a fourth tool would cut the View's and Simplify's names, and a
  control keeps one place at every size (ADR 0094). Its sheet lists the sections by name, each with the bar
  it starts at as written ("Bar 9", `sectionStarts`), the one the cursor is in marked (`RowButton`'s
  `current`); one tapped takes the cursor to its first bar the first time it is played (`beatGroupInBar`)
  and closes. It is greyed for a piece of one section, saying so. A walk, a progression or an exercise has
  none.
- **More's order:** the library's (ADR 0106), Song information, Sections, Share, Print, Export to MIDI.
  Grown to eight rows, the menu scrolls within the room it has (a phone on its side).

## Consequences

- **`shared/lib`:** `midiFileName` takes the tempo; `performanceMidi` a `lead`; `Recording.tuning`,
  `STANDARD_TUNING`, `tuningOf`.
- **`features/share-song`:** `SongToShare` (an own song or a piece), `pieceLink`; `ShareSaid` says
  `linked`.
- **`widgets`:** new `song-print` (`SongPrint`); `sheet-music`'s `PrintedScore`, `SheetPages`,
  `useSheetScore`; `chord-views`' `PrintedLyrics`, `LineSegments`, `shownLines`; `chord-chart`'s print bars
  (`PrintedBar`, `BarCells`, `rowBeats`); `chord-diagrams`' `PrintedDiagrams`.
- **`shared/ui`:** `RowButton`'s `current`; `ActionMenu` scrolls past its room.
- **`pages/player`:** `PlayerLayout` takes `more` and `recording` and owns Print; `SectionsSheet`,
  `sectionStarts`; `SongInfo`'s Tuning. **`pages/piece`:** Share for every song, `playedAs`.
- **`entities/piece`:** `PieceFactCards` takes a fact more.
- **`styles/theme.css`:** the print stylesheet.
- No store changes.
