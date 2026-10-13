# ADR 0041 — A progression is one idea in both modes, and a lead-in is a way to play it

- **Status:** accepted · **Date:** 2026-10-13 · **Supersedes:** ADR 0031 (a cadence's version in the other mode)
  · **Amends:** ADR 0030 (the library), ADR 0040 (the walks inside a key), ADR 0023 (the walks' rows)

## Context

The owner read the library against the 2-5-1 sheet and asked why its Шаг 2 was missing, why so many progressions
were duplicates, why a major and a minor version were two progressions when the key already says which, and why
lines a rule could write were written out. The audit (spec 2026-10-13) found eight twins (the same loop of chords,
or the same heard from the relative minor), four ideas listed once per mode, three lines a rule writes, and the
sheet's walk named so that it could not be found.

## Decision

- **A library progression has a line in each mode it has** (`major`, `minor`, one at least), one entry in the
  pop-up. The key's Major · Minor shows that mode's line; choosing a progression keeps the key's mode where it has a
  line in it. The Minor style goes. A pop loop's minor line is the loop heard from its relative minor; a cadence's
  is its minor-key version.
- **No two lines of the library are the same loop**, in the same key or the relative one, other than one
  progression's two lines (a test holds it).
- **A lead-in is a way to play any progression** (`withLeadIns` in the kernel; the Progressions page's "Lead into
  each chord", URL `lead`: `v` or `ii-v`): each chord after its own V, or its ii–V, with a half-diminished ii before
  a chord with a minor 3rd; the key's tonic in its mode takes the key's ii and V, any other chord applied ones. A
  chord held or already applied takes none, and a lead-in starts after a chord it would repeat. Secondary dominants
  and the ii–V–I to every chord of the key are its lines, no longer the library's.
- **A walk's row names the chords of its first two keys**, so the sheet's Шаг 2 (down by whole tones, each I the
  next key's ii) reads as the sheet writes it.

## Consequences

- A new progression is one entry with its lines; its minor version is never a second entry.
- The Player plays a lead-in as numerals (`p`), so it needs no choice of its own.
- No store changes: views remember numerals, which read as before.
