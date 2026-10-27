# ADR 0097 — The music model: a piece's music as text, any number of staves, marks, repeats, meters and words

- **Status:** accepted · **Date:** 2026-10-01 · consolidated 2026-10-27

## Context

A piece began as a lead sheet: a chart of chords, an optional tune and a pattern. The learner then needed their own
version of any piece and songs of their own, and the owner asked for what notation apps write: marks, repeats and
jumps, clef changes, a section in another key or meter, staves added like instruments, the words under the notes. An
arrangement note for note (Wonderful Grace of Jesus) needed 32nds, triplets and a key change.

## Decision

- **A piece's music is text in the content's own format** (`PieceMusic`): its key, meter, tempo, pattern, sections of
  lines of bars of chords, its single staves, both hands' bars, its lyrics and, for a version, its title. One parser
  reads content and saved music; the writers write the shortest text that reads the same, and every catalog piece
  round-trips through them.
- **The learner's music** (`pt-pieces`): a version replaces a catalog piece by its id (Reset deletes it), and an own
  song is `my-<n>`, never given twice. The repertoire is the catalog as the learner has it: the router, Songs, a
  piece's page and the Player read it; lessons and courses read the catalog they teach. A recording plays with a
  version only on the original's timeline.
- **Time.** A beat is 24 ticks (a 32nd is 3, a triplet 8th 8). Nothing saved holds ticks: music is written in beats
  (a fraction `1:3` where a decimal cannot say it), takes in milliseconds.
- **Meters.** A meter is a count of 1 to 12 over 2, 4 or 8. Its kind (a quarter, or a dotted quarter in x/8) is what
  the song's ticks count; its counted beats (2/2's two halves, 7/8's 2+2+3) are what the click and the count-in
  follow, and its groups what the click accents, the beams join and a pattern's figure fills. A section may have its
  own meter of the piece's kind and its own key (`Section.meter`, `Section.key`), each printed where it changes. A
  4/4 or 2/2 may print as C or ¢ (`timeSymbol`). A tempo mark may count another note than the beat (`tempoUnit`);
  the tempo stays the song's beats a minute.
- **A bar may have no chord symbol** (`_`, `_@2` where it is not the meter's length): nothing printed over it, nothing
  a pattern plays there.
- **Marks belong to written notes** (`[acc,stacc]`): articulations, ornaments, octave lines, slurs, dynamics,
  hairpins, grace notes, expressions and the pedal. A note's pitch stays the pitch it sounds (8va changes only where
  it is written). The schedule hears the marks that change the sound: lengths, loudness, rolls, grace notes,
  ornaments, `rit` and `accel` (`tempoWarp`), the pedal (`pedalHeld`), notes joined under a slur or legato. A tie is a
  longer note, not a mark.
- **Barlines, repeats, endings and jumps are bar marks** (`|: :| || |. [1 [2`, Segno, Coda, Fine, To Coda, D.C. and
  D.S. with their al Fine and al Coda). They are engraved as written and played as taken (`playOrder`): back once
  from a repeat's end, the 1st ending left out the second time, a jump taken once and played on without repeats. The
  Player plays the piece unrolled; the editor, the song's page and the chart keep the bars as written.
- **A clef changes from a bar on**, in a hand's or a staff's text (`clef:alto`): treble and bass with their octave
  forms, the five C clefs and the F clef on the third or fifth line. A clef never changes mid-bar.
- **A score is staves**: any number of single staves over or under the piano's grand staff, each named by the learner
  (`staves: [{ name?, notes }]`), the piano there or hidden. The piano may be hidden (a lead sheet, `leadSheet`) only
  where there is a single staff, so a score never hides every staff. What the Player calls the tune is the top single
  staff. There are no voices or instruments beyond these.
- **Lyrics** are verses of syllables aligned to the notes of the staff they are written on (`lyricsOn`: a single staff
  by its place, else the upper staff), `-` carrying a word on, `_` a melisma, `~` an empty place. A verse longer than
  its tune is a content mistake.

## Consequences

`docs/CONTENT.md` holds the full syntax. A shape change of the saved music bumps `pt-pieces` (ADR 0038).

## History

- 0027 — A version is the piece's music in its own format (2026-10-01). Its editor is ADR 0114's.
- 0060 — Twenty-four ticks a beat; a section in its own key (2026-10-19).
- 0063 — Notes carry marks (2026-10-20).
- 0066, 0070 — Voices sung with the tune and their instruments (removed 2026-10-23 by 0091).
- 0067, 0068, 0069 — Barlines and repeats; expressions, tempo, pedal and jumps; clef changes (2026-10-21).
- 0093 — Lyrics under the tune (2026-10-24).
- 0095 — A section's meter (2026-10-24); every meter and the beat type by 0114 (2026-10-27).
- 0097 — A score's staves are staves (2026-10-24).
