# Unified Learn and the tool workspaces

> Superseded by `2026-10-14-curriculum-and-workspaces-design.md`.

- **Date:** 2026-10-14 · **Owner's ask:** one view for learning instead of the Path and Learn tabs, a carousel of
  courses and a journey map to switch between, and tools grouped so the learner stops jumping between pages.
- **References:** `piano-data/reference-apps/courses-app` (a carousel of courses, each course its own page of
  numbered lessons), `journey-app` (chapters as a map of nodes, the next one lit; its tools Key Explorer, Chord
  Builder and Progression Lab each one screen), `clefs` (a course chapter's list under one Continue band).

## Learn, one place (ADR 0049)

The four places become three: **Learn** (`/`), **Songs**, **Practice**. The Path and Learn tabs were two
curricula over the same lessons since ADR 0048; Learn is now both.

- **Continue** first: the first step not learned (a lesson to read, a chord or scale to practise, a song), the
  screen's one honey action. Practice days and the songs practised last follow, as on the Path.
- **Journey · Courses**, a segmented switch in the URL (`/?view=journey|courses`, remembered):
  - **Journey** is the Path's levels drawn as a map: each level a chapter with its count and bar, its steps
    nodes on one line, a learned node filled grass with its check, the next one ringed honey and larger. The
    level the learner is at is open. A node opens its step; its learned mark stays at its end.
  - **Courses** is every module as a card on two shelves that scroll sideways on a phone and stand as a grid
    from 1024px: **Subjects** (Fundamentals, Accompaniment, Gospel) and **Courses** (the method books, then
    Gorshkov's). A card wears its module's paint, its name, its line and its count learned with a bar.
- **A course's page** (`/learn/$module`): its name and line, its bar, one honey Start (or Continue with the
  lesson after the last learned), and its lessons numbered as taught, each with its learned mark; a method book's
  page ends with its patterns and pieces on Practice's Accompaniment.
- **A lesson** names its course (a link to the course's page) and its number in it.

Gone: the Path as a name and a place, `/learn`'s tabs and folds (`?tab=`, `?open=`), Learn's own Continue,
Hide learned.

## Tool workspaces (ADR 0050)

A tool that works on the same thing as an explorer becomes a tab of it, holding the same URL's state, so moving
between them is one tap and keeps the chord or the key:

- **Chords** · Build (`/practice/chords`) · Find (`/practice/chords/find`, the Chord finder).
- **Progressions** · Play (`/practice/progressions`) · Passing chords (`…/passing`) · Reharmonise
  (`…/reharmonise`) · Transpose (`…/transpose`).
- **Scales and keys** keeps its Scale · Chords · Key tabs.

The rows that linked one tool page to another (a Chord finder row on Chords, Passing chords and Reharmonise rows
on Progressions) go: their tabs are always in sight. Practice lists five things to explore (Chords, Scales and
keys, Intervals, Progressions, Accompaniment), Free play, and training (Exercises, Quiz).
