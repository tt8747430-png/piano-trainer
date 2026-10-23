# ADR 0091 — The score editor edits a score, as notation software does

- **Status:** accepted · **Date:** 2026-10-23 · **Supersedes:** ADR 0065 (a section's pattern in the editor), ADR
  0066 and 0070 (more voices and their instruments), ADR 0083's pattern notes drawn soft · **Amends:** ADR 0027
  (what an edit saves), ADR 0064, 0072, 0089 · Research: [2026-10-flat-and-dorico](../research/2026-10-flat-and-dorico.md),
  [Dorico's Write mode](https://www.steinberg.help/r/dorico-pro/6.2/en/dorico/topics/write_mode/write_mode_introduction_c.html),
  [Flat's accidentals](https://help.flat.io/en/music-notation-software/accidental/)

## Context

The editor grew out of the chord chart: a bar either played the accompaniment pattern or was "written out",
each hand on its own; a section could take a pattern of its own; more voices could be sung with the tune, each
on an instrument; and the Song sheet listed all of this as parts. The owner could not read it as an editor:
"this strange hand separations or patterns adding or verses adding". Flat and Dorico know none of it. A score is
staves; a note is written on a staff where the caret is; chord symbols are text over the music; what is heard is
what is written.

## Decision

- **Every bar is written.** The draft holds the notes of both the piano's staves in every bar. A piece whose
  bars the pattern played is written out as the editor opens it (the pattern's notes, as the Player plays them,
  become the hands' notes), and saved so. `DraftBar` no longer says which hand is written; `writeOut`,
  `backToPattern`, `sectionPattern` and the pattern marks drawn soft are gone. The piece's `pattern` and a
  section's `pattern` stay content for the Player's Setup of a built-in piece that no one has edited; an edited
  piece plays its written bars.
- **Three rows, no parts.** A score has a melody staff (treble), the piano's grand staff and a row of chord
  symbols, each shown or hidden in the Song sheet (ADR 0072, 0083). More voices and their instruments are gone
  from the model (`voices`, `instruments`, `ExtraVoice`, `Instrument`): no built-in piece had them.
- **The staff written is where the caret is.** The layer chip names it as a score does: Melody · Upper staff ·
  Lower staff · Chord symbols. No hands.
- **The tools act on the selection** (ADR 0089), with Flat's accidentals: a tap writes the sign, a second tap on
  the same sign takes it off; ♮ returns the note to the key. Fingering is a note's: 1–5 on the chosen notes, as
  Flat's Articulations' Fingerings, no panel by hand.
- **Sections stay the song's form** (Intro, Verse, Chorus, Bridge, Ending), as a chart's and the song page's
  headings; the editor's Bar category starts or joins one. They carry no pattern.

## Consequences

- `features/score-editor`, `entities/piece`, `shared/lib/notation` and `widgets/score-sheet` lose the pattern
  bars, the voices and the instruments; the Song sheet loses `StaffList`'s parts, `AddPart` and
  `InstrumentChoice`.
- `pt-pieces` bumps its version (ADR 0038): a saved version or own song with voices is not read.
- The Player's Setup pattern card applies only to a piece whose bars the pattern still plays.
