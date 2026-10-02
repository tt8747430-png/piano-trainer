# Patterns: a page per pattern, a calmer picker, favourites, hiding, and your own (sub-project 8)

- **Status:** decided 2026-10-01 under the owner's standing instruction (decide, record, continue). The owner asked
  for the next sub-project of the roadmap (`2026-09-25-next-features-roadmap-design.md` §2: "**8 Patterns**: a page
  per pattern (its idea in a line, each hand in notation over a C chord, heard, on the keys, the songs that use it);
  a calmer picker; favourites and hiding; an editor for the learner's own patterns. The owner left the design to
  Claude"). Sub-project 6 (the Path as a course) stays skipped at the owner's word; nothing here depends on it.
- **Builds on:** ADR 0002 (content as code), ADR 0003 and 0022 (the view in the URL, remembered views), ADR 0012
  (Learn's references), ADR 0013 (the Player plays a Performance), ADR 0021 (a pattern is heard over its piece),
  ADR 0023 (an inversion follows the patterns that play the chord).
- **From the owner (roadmap §7):** "the patterns are too cluttered and i cant edit or manage them and nowhere is
  explained what does this really mean (the Setup sheet's Pattern page)."

## 1. What the earlier changes mean for this plan

Checked against what shipped after the roadmap was written:

- **A pattern is a pair of figures** (`PatternEntry`: `rh` and `lh`, figure ids), and the Player already lets each
  hand's figure be swapped over the pattern (the Setup's Right hand and Left hand rows). An own pattern is therefore a
  named pair of figures from the catalogue: nothing new is needed in the arrangement.
- **The pattern id travels**: the Player's URL (`pattern=`), remembered views (ADR 0022), a lesson's pattern block and
  link, a piece's own pattern, the methods a chart names. Pieces, lessons and methods name the built-in patterns only;
  the Player's URL and its Setup may name an own pattern too.
- **The inversion field** asks whether a pattern plays the chord (`followsInversion`), and the **pattern fit**
  (`patternNeed`, `playablePattern`) asks what it needs. Both read the pattern's figures, so both read an own
  pattern the same way once it is looked up.
- **The Theory quiz became trainers, exercises have their own Setup** (sub-project 7): neither chooses a pattern.
- **Remembered views** restore `pattern=` like any param; an own pattern deleted since is read as the music's own
  pattern, as an unknown built-in id is today.

## 2. The pattern book (the model)

- **A pattern ref** names a pattern: a built-in id (`M1`, `ballad`) or an own pattern's id, `my-<n>` (`my-3`).
  `PatternChoice` is a ref or `'chart'`.
- **An own pattern** (`OwnPattern`): `id`, `name` (the learner's text, 1 to 40 characters), `rh` and `lh` (figure
  ids). Its idea line is its two figures' names, so it needs no text of its own.
- **The pattern book** (`patternBook(own)` in `entities/pattern`): the built-in patterns and the learner's, looked up
  by ref. It answers everything that read `PATTERNS[id]` before: a pattern's entry (name, idea, description, figures,
  the `Pattern` `arrange` plays, its group: a built-in group or `own`), what it needs of the music, whether it follows
  an inversion, the arrangement options of an accompaniment. `BUILT_IN_PATTERNS` is the book with none of the
  learner's (content, lessons, pieces). An unknown ref is not in the book: the Player plays the music's own pattern.
- **Every built-in pattern gets an idea:** one line, both languages, what it sounds like and what each hand does
  ("Chord on every beat over a held octave bass"). A description stays where the source explains more (Called to
  Play's, Боброва's): it is the pattern page's paragraph, never the picker's.

## 3. Saved state: `pt-patterns` (version 1)

`entities/pattern/model/store.ts`, a `createSavedStore`:

```ts
interface PatternsState {
  readonly favourites: readonly PatternRef[] // in the order starred
  readonly hidden: readonly PatternId[] // built-in only: an own pattern is deleted, not hidden
  readonly own: readonly OwnPattern[] // in the order made
  readonly nextOwn: number // the next own id's number: a deleted id is never reused
}
```

The sanitiser keeps what reads: refs that are built-in ids or own ids still present, own patterns whose name is text
of 1 to 40 characters (trimmed) and whose figures are known, `nextOwn` past every own id. It follows other tabs.

**Commands** (`features/manage-patterns`, one use case per file): `toggleFavourite(store, ref)`,
`toggleHidden(store, id)`, `saveOwnPattern(store, draft, id?)` (a new one takes `my-<nextOwn>`; returns the id),
`deleteOwnPattern(store, id)` (also leaves the favourites).

## 4. The Patterns reference (Learn)

A new reference in Learn's References group, **Patterns** (`/learn/patterns`, its tile `AudioWaveform` on yellow),
after Available tensions.

- **The list:** Favourites (if any), Your patterns (if any), then the four built-in groups; Hidden at the end, if
  any, so a hidden pattern can be found and shown again. **New pattern** is the bar's round + action. A row is the
  pattern's name and its idea line (two lines at most) and the disclosure chevron, no tile: every row would wear the
  same one. A favourite shows on its shelf, not by a mark in its row. Not remembered (a list, ADR 0022).
- **A pattern's page** (`/learn/patterns/$patternRef`; `notFound()` for a ref not in the book):
  - the bar: Back, its name, and Favourite (a star toggle) as the bar's action;
  - its idea line under the title, then **each hand's figure by name** (Right hand · Left hand) as two facts;
  - **the music:** the pattern over a bar of C major in 4/4, on the grand staff (right hand on the treble staff,
    left on the bass), **Play** (honey, the page's one action; Stop while it sounds) and the pinned keyboard showing
    the keys as they sound. A pattern that plays the tune (`r5`–`r7`, or an own pattern with a tune figure) is heard
    over the first line of «Отче наш» instead (`otche`, the piece its lesson uses), its name said under the staff;
  - its description, where it has one;
  - **Used in:** the songs, studies and progressions that play it (their own pattern, or a method their chart names),
    as piece rows; none, none shown;
  - **Practise:** open it in the Player over a progression (`/play/progression?pattern=<ref>`, I–V–vi–IV in C), or
    over a song with a tune for a tune pattern (`/play/otche?pattern=<ref>`);
  - **Make your own from it** (a built-in) or **Edit** and **Delete** (an own one; Delete asks first), and **Hide**
    or **Show** (a built-in).

## 5. The calmer picker (the Setup's Pattern page)

- **Groups:** Favourites first, then Your patterns, then the built-in groups; **hidden patterns are left out**, but
  for the one chosen now (so the sheet always shows what plays).
- **A row:** the name and, under it, the idea line (never the description's paragraph); a pattern the music cannot
  play stays closed with what it needs (DESIGN's one exception), as today.
- **At its foot, Patterns in Learn**: a link row to the reference, where patterns are explained, starred, hidden and
  made. The Player is left; Back returns to it as it was (ADR 0022 restores nothing it must not: the Player's URL
  holds the view).
- **The pattern row on the Setup's first page** shows an own pattern's name like a built-in's.

## 6. Your own patterns (the editor)

**New pattern** (`/learn/patterns/new`, optionally `?from=<ref>`: Make your own from it) and **Edit**
(`/learn/patterns/$ref/edit`, an own ref only) open the same screen:

- **Name** (a text field, required, 1–40 characters; from a pattern: its name followed by "(mine)" / «(моя)»);
- **Right hand** and **Left hand**: pop-up buttons over the figure catalogue (36 and 20 figures);
- the same music as the pattern page, following the draft as it changes (staff, Play, keys);
- **Save** (honey; disabled while the name is empty) writes it and opens its page, replacing the editor's entry
  (Back from the page goes where the editor was opened from); **Cancel** goes back unsaved.

The draft is component state: it is not a view to come back to, and a half-made pattern is not saved state.

**Why figures, not notes:** a pattern is a way of playing any chord, so its notes are tokens over the chord (the
figure notation, CONTENT.md), not pitches. Writing a figure note by note needs the score editor's input (sub-project
9: notes by mouse, computer keyboard or MIDI). Until then an own pattern combines the 56 written figures, which already
cover every hand the sources teach; the step editor is recorded in §8.

## 7. How the Player reads an own pattern

- The validators read `pattern=` as a ref by its shape (`isPatternRef`): they run before any store is read.
- Each Player's choice is resolved against the book (`usePatternBook()`, from the store): an own ref not in the book
  is the music's own pattern, a ref the music cannot play likewise (`playablePattern`).
- The arrangement takes the book's options: `book.options(accompaniment)` gives `arrange` the pattern and each hand's
  figure, so `accompanimentOptions` and its four callers read the book instead of `PATTERNS`.

## 8. Not built now, and why

| Item | Why not yet |
| --- | --- |
| Writing a figure note by note (a step editor) | Needs the score editor's note input (sub-project 9) |
| Sharing or importing patterns | No accounts or sync (PRODUCT.md); the Player's URL already carries a built-in pattern |
| Reordering favourites by drag | Starred order is enough for a handful; a drag list waits for a need |

## 9. Words, look and records

- **Glossary:** Pattern (built-in or your own), Own pattern, Pattern book, Idea (a pattern's line), Favourite, Hidden.
- **DESIGN.md:** the Patterns reference (rows with the idea line and a star), the pattern page, the editor; the
  picker's groups. Tile: `AudioWaveform` on a yellow wash.
- **ADR 0026:** a pattern is looked up in the pattern book; an own pattern is a named pair of figures.
- **PRODUCT.md, CLAUDE.md, CONTENT.md** (every pattern has an idea), the roadmap's Built line.

## 10. Testing

- **Model:** the book (built-in and own lookups, an unknown ref, an own pattern's idea, needs, follows-inversion,
  options), the store's sanitiser (each bad shape dropped, `nextOwn` past the ids, another tab followed), each
  command.
- **Content:** every built-in pattern has an idea in both languages.
- **App (`renderApp`):** the reference lists favourites, own and hidden groups; a pattern page plays its bar and
  lists its songs; starring and hiding; making an own pattern from a built-in, saving, finding it in the Player's
  picker, playing it; editing and deleting; the picker leaves hidden patterns out but for the chosen one; the Player
  opened with an own ref that was deleted plays the music's own pattern.

## Review amendments (2026-10-02)

- **A hidden pattern is out of Favourites too:** in the picker (but for the one playing) and in the reference, where
  a starred hidden pattern is on the Hidden shelf only.
- **Make your own from it fits the name:** a source's name too long for "… (mine)" within 40 characters is cut at a
  word, with an ellipsis, so the draft saves as it opens.
- **Saving a pattern deleted in another tab** makes it anew under the next number; its page and its editor, once it
  is gone, show Page not found with the way back to Patterns.
- **The editor is heard by its figures:** typing its name neither arranges nor engraves the sample again.
