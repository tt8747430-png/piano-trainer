# ADR 0087 — Engraving: our Score, written as MEI, engraved by Verovio, laid out as LilyPond does

- **Status:** accepted · **Date:** 2026-09-27 · consolidated 2026-10-27

## Context

The owner asked for sheet music the way Flowkey shows it, then for a score that reads as print. Every source of music
here (an arrangement, an exercise, a take) first produces timed notes, so written music must be derived from them. A
VexFlow engraver grown with our own spacing still read as a sketch beside a printed hymnal; LilyPond and MuseScore
were the measure (line breaking, beams, courtesy signatures, page filling).

## Decision

- **The Performance is the one playable truth, and `notate(performance) → Score` writes it** (`shared/lib/notation`,
  pure, importing only the music kernel): measures, one or two voices a staff, values from the meter's grid, ties
  across barlines, accidentals from the key and the bar, chord symbols, a bar's meter printed where it changes, a
  blank staff a hidden rest, each syllable on the note that starts it. `notate` cuts and quantises in writing only:
  the sound stays the Performance's.
- **The Score is written as MEI** (`scoreToMei`), each note, chord and rest named by its staff and tick
  (`n-<staff>-<tick>-<i>`), so what is drawn is found by what it is. Each line's section starts with a system break.
- **Verovio engraves it in a Web Worker** (the unmodified LGPL npm package, bundled only into the worker; WASM loaded
  once and warmed early; in tests it runs on the test's thread). A line is one system justified to its sheet's width;
  a line too wide is drawn smaller, never broken in two. The layout (measures, onsets, heads, signs, staff names,
  syllables) is read back from the SVG's own coordinates, so a test reads it as the browser does. The worker is
  precached so the music is drawn offline.
- **Lines break by width** (`measureWidths`, `breakLine`): as few lines as hold the music, then as even as they come,
  every line justified. The Player and the editor both use it.
- **Beams follow the meter as LilyPond's** (`beamPlan`): eighths over the half bar in 4/4, the whole bar in 3/4, by
  the beat or the meter's groups otherwise; a beam with 16ths cut at each beat; each beat of triplets one tuplet.
- **Courtesy signatures**: a line is told what the next starts in (`NextLine`) and ends with the new key, time or
  clef, as LilyPond and MuseScore print them.
- **The labels' row is ours** (`LabelRow`): HTML over each line in the app's faces, read by a screen reader: the
  line's first bar number, a section's name at its first bar, the tempo, and the chord symbols. The title and the
  staves' names are printed at the head.
- **Pages** are A4 at print size (`PRINT_SCALE`: a staff a 33rd of the page's width, as the printed hymnal), their
  chord symbols 2.6 staff spaces tall. Every page but the last is filled to its height, each gap growing by at most
  `PAGE_STRETCH`; the last is ragged.
- **Colour is CSS**, so the theme and increased contrast never engrave again.

## Consequences

The engraving reads as print in the Player, the editor, the lessons, the explorers and the Chord finder. The first
staff after the app opens waits for the WASM; each line after takes tens of milliseconds off the page's thread.
LilyPond's cautionary accidentals at a line's start are not written: each line is notated alone.

## History

- 0013 — Sheet music is our Score, engraved by VexFlow (2026-09-27). Its engraver was replaced by 0078; its Player is
  ADR 0105's.
- 0074 — Lines cut by width, pressed before shrunk (2026-10-21).
- 0077 — LilyPond's spacing over VexFlow (2026-10-22), superseded by 0078.
- 0078 — Verovio engraves every score (2026-10-22).
- 0084 — Beams by the meter; chord names print ♯ and ♭ (2026-10-23).
- 0087 — Courtesy signatures, line-start bar numbers, pages filled (2026-10-23), from the research note comparing
  the engraving with LilyPond, deleted.
