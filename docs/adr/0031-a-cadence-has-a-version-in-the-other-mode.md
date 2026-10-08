# ADR 0031 — A cadence has a version in the other mode, and the key's mode takes it

- **Status:** accepted · **Date:** 2026-10-08 · **Amends:** ADR 0020 (the tool's key), ADR 0030 (the Progressions
  page)

## Context

The library writes each line of numerals once in its mode, and choosing a progression takes its mode (ADR 0030). The
key's Major · Minor changed only the key: the jazz cadence (`ii V I`) turned to C minor kept its numerals, read from
natural minor as Dm7 G7 C7, a line nobody plays, named as the learner's own. The course's 2-5-1 sheet teaches the
cadence's minor version (the half-diminished ii, the dominant, the minor tonic) as the same cadence in minor.

## Decision

- **The library pairs a cadence with its version in the minor key of the same tonic** (`MODE_VERSIONS`, read by
  `otherModeVersion`): the jazz cadence and the minor ii–V–i, the ♭9 resolution and the ♭9 resolution into minor, the
  authentic cadence and the minor cadence. A pair is content; `tsc` holds its ids to the library's.
- **A key turned minor or major takes the library's progression shown to that version**, at the chord size shown
  (`changedView` in `widgets/progressions/model`). A progression the library holds in one mode, and a line a learner
  typed, stay as they are written: numerals are read as written in any key (ADR 0020).
- **Choosing a progression keeps the tonic as it is written** (`chosenView`, over `writtenKey`), respelled only where
  no signature writes the key: the rule the key's own Major · Minor follows.

## Consequences

- A library cadence is never shown as a typed line because its key changed mode, and its minor version is one tap
  away.
- The minor ii–V–i grows with the chord size (ADR 0032): at 7ths it is the sheet's minor version, and at 9ths its
  dominant takes the ♭9 and its ii the natural 9th.
- A new cadence with a minor version adds its pair to `MODE_VERSIONS`.
