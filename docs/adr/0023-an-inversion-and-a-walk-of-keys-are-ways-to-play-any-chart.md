# ADR 0023 — An inversion and a walk of keys are ways to play any chart

- **Status:** accepted · **Date:** 2026-10-01 · **Builds on:** ADR 0014 (a walk is a Performance handed to the
  Player), ADR 0015 (the chromatic walk), ADR 0020 (numerals in any key, the progression Player)

## Context

The 2-5-1 course (Gorshkov) practises one progression in close position through every key, then with 9ths in
another layout. The owner asked to practise any chord or progression in the inversion they choose, and to walk
progressions through the keys. The Player voice-led every right-hand chord from the last, and played a chart in one
key.

## Decision

- **An inversion is an `ArrangeOptions` choice**, so every Player (a piece, Walk the chords, the chromatic walk, a
  progression) has it through its Setup: Nearest (the voice-leading as before) · Root · 1st · 2nd · 3rd, URL
  `inversion`. The right hand's chord is stacked from that note, its lowest from E3 to E4, the octave nearer the last
  chord (`voiceInversion`). A chord of up to four notes plays whole (a triad's 3rd inversion is its 2nd); a bigger one
  leaves its root and 5th out, down to four notes, its first tension where the root was (`inversionPitchClasses`), so
  Dm9's 1st inversion is the course's 3-5-7-9 and its 3rd the 7-9-3-5. Only a figure that plays the chord as voiced
  (`C`, `vN`) changes; a pattern that plays its own shapes keeps them, and its Setup says so (`keepsInversion`).
- **A walk of keys is a chart transformation**, `chartInKeys(chart, walkKeys(key, walk))`: the chart once per key, a
  section per key, written in C so the sheet music writes each chord's accidentals (as the chromatic walk does).
  It is offered for progressions (the progression Player and progression pieces), URL `walk`: up or down by
  semitones or whole tones, or round the circle of fifths, always back home. Down by whole tones is the course's
  Step 2: each key's I becomes the next key's ii.
- **While it walks** there is no one key: no pattern plays the key's triads (`walkingFit`), no recording or tune plays,
  and the sections and the title name the keys and the walk.

## Consequences

- Both are remembered with the rest of the Player's choices (ADR 0022) and can be named by a lesson's `player` link.
- A new pattern figure that plays the chord as voiced follows the inversion with no change; a new walk is a row in
  `walkKeys`'s table.
