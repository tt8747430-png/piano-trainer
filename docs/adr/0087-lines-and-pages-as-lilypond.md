# ADR 0087 — Courtesy signatures, line-start bar numbers, pages filled to their height

- **Status:** accepted · **Date:** 2026-10-23 · **Amends:** ADR 0074, ADR 0075

## Context

The comparison with LilyPond and MuseScore (`docs/research/2026-10-engraving-vs-lilypond.md`) left three
differences. Each line is engraved as its own Verovio score, so a line before a change of key, time or clef had no
courtesy signature at its end, where LilyPond and MuseScore print one by default. The Player numbered every bar,
the editor only each line's first, where LilyPond and MuseScore number each system's start. Pages were dealt top
down and left their foot empty, where LilyPond (`ragged-bottom` off) and MuseScore (vertical justification) spread
a page's systems down to its bottom margin.

## Decision

- **Courtesy signatures.** A line is told what the next line starts in (`NextLine`: its first measure's key,
  time and clefs; the Player's `scoreLines`, the editor's `createLineSheets`). `scoreToMei` writes what changes
  after the line's last measure: a page break, the new `scoreDef` (clefs as `staffDef`s) and an empty measure
  (`m-next`, `mSpace`). Verovio 6.3 prints a courtesy signature only at a system's end with a measure after it
  (a trailing `scoreDef` alone draws nothing); the page after the break is never drawn, a line being its first
  page. A line left at its own width (a panorama, the width measured before shrinking) writes none. The editor
  writes a section's own key on its bars, as the Player always has.
- **Bar numbers** stand at each line's start only, in the Player as in the editor, so a page's first line is
  numbered too. A later bar's label says only a section's name or a tempo. Every bar is still a button that says
  its number to a screen reader.
- **Pages filled** (`SheetPage`, `shared/ui`; the Player's and the editor's page): on every page but the last, the
  gaps between its blocks grow alike until its last system meets the bottom margin, each by at most
  `PAGE_STRETCH`, ten staff spaces at print size (60 px); what is left stays at the foot. A heading and the title
  stay with the line under them. The last page is ragged, as LilyPond's `ragged-last-bottom` and MuseScore leave it.
  The cap sits between MuseScore's Max. system distance (15 spaces between staves) and LilyPond's uncapped
  stretch: a page of two systems is not spread into gaps.

## Consequences

A key change at a section's start reads as print: the line before ends with the new signature. The Player's sheet
reads as a printed one, its bars located by the line's number. Full pages end at the same height. LilyPond's
`modern` cautionary accidental is not written: the editor notates each line alone, so a courtesy at a line's start
would differ between the editor and the Player.
