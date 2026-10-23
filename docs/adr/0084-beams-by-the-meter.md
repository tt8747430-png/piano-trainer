# ADR 0084 — Beams follow the meter, as LilyPond's; chord names print ♯ and ♭

- **Status:** accepted · **Date:** 2026-10-23

## Context

`scoreToMei` beamed eighths and shorter by the beat in every meter: a 4/4 bar of eighths read as four pairs, a 3/4
bar as three, and a run of triplets over two beats became one tuplet of six notes, unbeamed. LilyPond's
`scm/time-signature-settings.scm` beams eighths over the half bar in 4/4 (`(1/8 . (4 4))`), over the whole bar in
3/4 (`(1/8 . (6))`), by the beat in 2/4, 6/8 and 12/8, ends a beam holding anything shorter at each beat
(`(1/12 . (3 3 3 3))`, the beat structure), and writes a beat of triplets as one tuplet. MuseScore's defaults agree
for 4/4 and 3/4. Our chord names printed `C#m` and `Bb7` in ASCII where LilyPond's and MuseScore's chord names print
♯ and ♭, and a 6/8 tempo, which counts dotted quarters, was marked ♩ = n.

## Decision

- **`beamPlan`** (`shared/lib/notation/beams.ts`): a voice's beams and tuplets in a bar by LilyPond's defaults: eighths
  over the meter's group (half bar in 4/4, whole bar in 3/4, else the beat), a beam with sixteenths cut at each beat,
  a rest or a longer note ending a beam, each beat of triplets one tuplet with its eighths beamed. A pickup counts
  from where its bar would start (`barStartOf`), so its notes keep their beats.
- **`printedSymbol`** (`shared/lib/music`): a chord name over a staff prints `#` as ♯ and `b` as ♭ after a letter or
  before a degree. The stored and typed text keeps its ASCII; widths are measured on it as before.
- **`tempoNote`** (`shared/lib/music`): the tempo's note is the meter's beat, ♩. in x/8.

## Consequences

Lines read as LilyPond and a printed hymnal beam them: fewer, longer beams in 4/4 and 3/4. A voice that wants its
own grouping (a 3+3+2 figure in 4/4) would need a beam written by hand, which no song asks for yet.
