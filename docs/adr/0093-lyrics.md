# ADR 0093 — Lyrics under the tune

- **Status:** accepted · **Date:** 2026-10-24 · **Builds on:** ADR 0064 (the tune's staff), ADR 0078 (Verovio over
  MEI), ADR 0089 (one palette on the selection), ADR 0091 (the editor edits a score) · Research:
  [Flat's lyrics](https://help.flat.io/en/music-notation-software/lyrics/), LilyPond's `\lyricmode`

## Context

The app is about songs, most of them hymns, and a song's score carries its words. Flat (Text › Lyrics) and Dorico
(Shift+L) write lyrics as a text field under a note: Space, → or Enter moves to the next note, `-` splits a word
across notes, `_` carries a syllable on (a melisma), ↓ starts the next verse. LilyPond writes a verse as a line of
syllables aligned to a voice's notes in order. Our scores had none, so a hymn's page could print its music and not
its words.

## Decision

- **A piece's lyrics are verses of syllables, aligned to the tune's notes in order.**
  `ChartPiece.lyrics?: readonly string[]`: each verse one string, syllables parted by spaces, `-` ending a syllable
  that a word carries on (`A- ma- zing`), `_` a syllable held over the next note (a melisma); a rest and a tied
  note's continuation take none; `~` an empty place under a note. The tune is the melody staff where the score has
  one, else the upper staff of the piano, its chords counting as one note. Content writes them as text
  (docs/CONTENT.md); the editor writes and reads the same string.
- **Engraved with the music.** `scoreToMei` writes each syllable as `<verse n><syl wordpos con>` on its note, so
  both sheets print them in every layout, and a line's height grows with its verses. The Player shows them under
  the tune; the View menu's "Chord symbols" gains a sibling, "Lyrics", shown or hidden (`scoreView.lyrics`).
- **Written as Flat's.** The palette's Text & pedal section gains **Lyrics**: a text field over the sheet at the
  chosen note (the caret's), Space / → / Enter to the next note, ← back, `-` and `_` as above, ↓ the next verse, ↑
  the one before, Esc out. The caret line names the verse while it is on. Greyed with a one-line reason where the
  caret is not on the tune's staff.

## Consequences

- `entities/piece` (`lyrics`, its parser and writer, `pt-pieces` version 3), `shared/lib/notation` (`Score` carries
  each note's syllables; `mei.ts`), `features/score-editor` (the `Draft`'s verses and their edits),
  `pages/score-editor` (the Lyrics field), `widgets/practice-player` (the View menu), `entities/settings`
  (`scoreView.lyrics`, version 6).
- Built-in hymns may now carry their words; none must.

**Later (2026-10-24):** the lyrics belong to the staff they are written on (`lyricsOn`, `lyricsStaff`): the tune's
by default where the score has its staff, else the upper staff. A melody staff added to a song whose lyrics are on the
upper staff leaves them there (`lyricsOn: 'rh'`, saved with the music), where before the next save dropped them; one
added to a song with none takes them; the tune's staff taken away takes its lyrics with its notes. The sheet prints
the verses under the staff whose notes sing them. The Lyrics field writes on that staff; on another it is greyed,
its line saying where the lyrics are.
