# ADR 0095 — A section's name and meter printed at its first bar, edited there

- **Status:** accepted, amended by ADR 0114 (every meter; the beat type across kinds) · **Date:** 2026-10-24 · **Builds on:** ADR 0087 (a line's first bar numbered), ADR 0089 (a
  key from a section on), ADR 0094 (edited where printed) · **Amends:** the editor's section headings (ADR 0065's
  successor, `SectionHeading`) · Research: Flat's [rehearsal marks](https://help.flat.io/en/music-notation-software/rehearsal/)
  and [time signature](https://help.flat.io/en/music-notation-software/timesig/) ("applies from that measure until the
  next time signature")

## Context

The Player prints a section's name small in the labels' row at its first bar ("1 · Verse 1 · ♩ = 84"), as a score
prints a rehearsal mark; the editor printed a large "Verse 1 ▾" heading over the section's first line, so the two
sheets of one score looked different and a phone lost a line's height to each heading. And the editor could change a
key from a section on but not a meter: a song with a verse in 3/4 and a bridge in 4/4, or a bar in 2/4, could only be
written as short bars (`@beats`), with no time signature printed.

## Decision

- **One print.** Both sheets print a section's name in the labels' row at its first bar, beside its number and the
  tempo, in every layout; the editor's large heading goes. In the editor the printed name is a button opening the
  section's menu (its kind and number, join it to the one before); the palette's Bar section starts a new one.
- **A meter from a section on.** `Section.meter`, as `Section.key`: the meter a section's bars are counted in where
  it is not the piece's. The chart reads a section's bars in its meter, the notation prints the time signature where
  it changes (with the courtesy one at the line before, ADR 0087), the Player counts and clicks its bars so, and the
  editor's Time popover and Time section offer, as the Key's do, "From this section on" and "The whole song". A
  content section written `detail: 'in 2/4'` over short bars becomes `meter: '2/4'`.

## Consequences

`entities/piece` (`Section.meter`, the chart reader and writers, `pt-pieces` version bump), `shared/lib/arrangement`
and `shared/lib/notation` (a measure's meter), `features/practice` (the bar grid), `features/score-editor` (a
`sectionMeter` action beside `sectionKey`), `widgets/score-sheet` and `widgets/sheet-music` (the section's name in the
labels' row), `pages/score-editor` (`SectionHeading` becomes the printed name's menu; the Time popover).

## Amended by ADR 0114

A section's meter is any count of 1 to 12 over 2, 4 or 8 of the song's kind. The song's own meter, at its head,
may change kind: the whole song is written anew so each note keeps its length. A section past the first still
keeps the song's kind, since one song counts its ticks one way.
