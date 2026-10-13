# ADR 0044 — Practice is things, tools and training, a tool is a page of its own, and Search finds everything

- **Status:** accepted · **Date:** 2026-10-13 · **Amends:** ADR 0019 (a reference and a tool), ADR 0029 (no
  "reference" or "tool"; a lesson's category), ADR 0030 (a subject's pages are tabs; everything has one home), ADR
  0034 (the eighth place), ADR 0022 (what is remembered)

## Context

The owner asked how piano.org separates its tools from what it holds, and how the app could. piano.org,
musictheory.net and musicca.com all keep three kinds of page apart under the same words: what teaches (lessons),
what trains (exercises, drills) and what works something out (tools). piano.org also holds things (a page for every
chord), links each to its opposite tool with its state in the URL, and projects its glossary from the same data as
its pages (`.scratch/things-and-tools/research.md`).

ADR 0029 removed "References" and "Tools" from the app as "a distinction a learner does not make", and ADR 0030 gave
every page a subject to live in. The result hid the tools: the Chord finder behind a tab of Chords, Passing chords
and Reharmonise behind tabs of Progressions, though Reharmonise takes a melody note and is no progression. Tabs
meant a thing against a tool on two pages and the views of one thing on a third. Nothing but Songs could be
searched.

## Decision

- **ADR 0019's test stands, and Practice shows it.** A thing's URL names it; a tool's holds what the learner gave
  it; training scores the learner. Practice lists three groups: the things with no heading (Chords, Scales and keys,
  Intervals, Progressions, Accompaniment), **Tools** (Chord finder, Passing chords, Reharmonise, Free play) and
  **Training** (Exercises, Quiz). What ADR 0029 was right to remove is a group word over the things; "Tools" is kept
  for the pages that are tools. A tool's row says what it takes and what it gives.
- **A tool is a page of its own; tabs are the views of one thing.** Chords and Progressions have no tabs. Scales'
  Scale · Chords · Key and Accompaniment's parts are tabs beside their pages.
- **A page's URL sits under its page's:** `/practice/chord-finder`, `/practice/passing-chords`,
  `/practice/reharmonise`; a trainer `/practice/quiz/$trainerId`; a pattern
  `/practice/accompaniment/patterns/$patternRef` (its editor `…/edit`, a new one `…/patterns/new`); a study
  `/practice/accompaniment/studies/$pieceId`. No redirects. `pt-views` is version 2.
- **A thing leads to its tool, with its state:** an explorer ends with a Tools group. Chords opens the Chord finder
  on the chord's keys; Progressions opens Passing chords between its first two chords and Reharmonise in its key;
  Scales' Key view opens Reharmonise in the key.
- **Search** (`/search?q=`) lists every named thing by kind, each a row to its page: Practice's pages, songs,
  lessons, chord qualities, scale kinds, the library's progressions, patterns, exercises and trainers. It is one
  projection of the registries, held to each by a test. A chord symbol typed is read as the chord.
- **A lesson has no category.** It was Learn's filter (ADR 0018); the filter went (ADR 0029) and the label repeated
  the module's heading on half the rows.
- **One word, one meaning:** a Place is the nav's; Practice has pages in groups; a Subject is Learn's; an Explorer
  shows a thing and a Tool works something out.

## Consequences

- A remembered view under a path that moved is forgotten.
- Links to the Chord finder, Passing chords, Reharmonise, a trainer, a pattern and a study name their new paths.
- Practice's pages read the `practice` strings; `learn` holds Learn's and a lesson's.
- The lesson link's `place` is `to`; the pattern entity's `REFERENCE_PARTS` are `ACCOMPANIMENT_PARTS`.
- New tools (chords to numerals, a key finder, an interval finder) each need a spec; Practice's Tools group is where
  they go.
