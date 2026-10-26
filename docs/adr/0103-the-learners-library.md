# ADR 0103 — The learner's library on Songs: Favourites, setlists, Chords I know

- **Status:** accepted · **Date:** 2026-10-26 · **Amends:** ADR 0099 (the Player's More), ADR 0100 (the song's
  page's bar) · **Spec:** [Chordify for piano](../superpowers/specs/2026-10-26-chordify-for-piano.md) §6

## Context

Chordify keeps a library of the learner's own: Favourites, a setlist of its own, and setlists made, renamed,
duplicated, deleted (asked first: it cannot be undone), searched in, added to by search and reordered, each reached
from a song's "Save to setlists", which can make a new one. Its 7 Tips choose songs by how many chords they have and
search them by the chords one knows.

Our learner found a song by its collection or by a search, and nothing kept the songs they cared about, or the order
they play them in for a service, a lesson or an evening. A song's row did not say how many chords it has.

## Decision

- **One saved store, `pt-library`** (`entities/library`, version 1, in the backup): the favourites, the newest first,
  and the setlists, each `set-<n>` (never given twice), a name of 1 to 40 characters and its songs in order, each
  once. Caps as the other stores': 100 setlists, 500 songs a list.
- **A list holds pieces.** Whatever opens in the Player, a song or a study, may be a favourite or in a setlist. An id
  the repertoire no longer has (an own song deleted) is left out where a list is read (`piecesIn`), never written
  away.
- **Favourites is the first list.** A ♡ in a song's page's bar, between Learned and More, pressed while a favourite
  and named by what a tap does; Add to favourites in the Player's More. It cannot be renamed or deleted.
- **Add to setlist** (Chordify's Save to setlists), from the song page's More and the Player's: a sheet, Favourites
  first, then each setlist, each a check that puts the song in or takes it out, then New setlist, named where the row
  stands and the song put in it.
- **The library is on Songs, as tabs after All.** Favourites is a shelf of the favourite songs, the page's search and
  filters keeping to it. Setlists lists each setlist (its name, its songs counted, its first titles), found by its
  name or a song in it, then New setlist, which opens the one made. Each says how to fill it while empty.
- **A setlist's page** (`/songs/setlists/$setlistId`): its name renamed where it is printed (Mindscape's
  `EditableTitle`: a double tap or Enter edits, Enter or leaving saves, Escape keeps; More's Rename too), Duplicate,
  Delete asked first; a search in it; its songs as rows, each moved by its handle (by drag or by the keyboard, along
  the list alone, a screen reader told where it went) and taken out by its Remove; Add songs a sheet of the
  repertoire by search. No Play yet: a setlist played song after song is a later round's.
- **Chords I know** filters Songs: a button counting the chords ticked, opening a popover of the chords the songs use,
  the most used first; only the songs that use no other chord stay. It is kept in the URL (`known`) as the page's other
  filters are, and, as they are, not remembered (ADR 0022).
- **A song's row counts its chords**, each once over any bass, in its detail, where a screen reader hears it.

## Consequences

- **New slices:** the entity `library` (store, selectors over the repertoire), the feature `manage-library` (each
  command pure: favourite, make, rename, copy, delete, add, remove, move; the ♡, the sheet, New setlist) and the
  page `setlist`.
- **`shared/lib`:** Mindscape's sortable engine (`useSortableList`, `useHeldOrder`, `moveBlock`,
  `mergeVisibleOrder`), so a drop never snaps back and a search's hidden songs keep their places; a chord list in a
  URL (`readChordList`, `chordListParam`); `nameFrom`, a pattern's "(mine)" and a setlist's "(copy)".
- **`shared/ui`:** `EditableTitle`, `ScreenHeader`'s `heading`, `RowCheck`, `TileMark`, a `RowButton` greyed with its
  reason, a setlist's tile among `PAGE_TILES`.
- **Elsewhere:** the router's context carries the library (a setlist not there is not found); Songs' URL its two tabs
  and `known`; Search finds a setlist by its name; the Player's page hands its library actions to More round its
  layout (`MoreActions`); `widgets/piece-list` shares a song's row face (`useEntryFace`).
